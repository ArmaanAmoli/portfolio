// Browser verification for the built site.
//
// Serves `dist/` under a /portfolio/ prefix (the GitHub Pages URL space) and
// drives real Chrome via puppeteer-core to check:
//   - no horizontal scroll at 375 / 768 / 1280 px
//   - the WebGL2 nebula canvas actually paints (non-uniform pixels)
//   - the CSS fallback appears when WebGL2 is unavailable
//   - the hero buttons and the mobile menu work
//   - fonts are loaded and reveal content becomes visible
//   - reduced-motion renders a static frame
//
// Usage: node scripts/verify_browser.mjs   (requires `bun run build` first)

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { homedir } from 'node:os'

import puppeteer from 'puppeteer-core'

const DIST = new URL('../dist/', import.meta.url).pathname
const PREFIX = '/portfolio/'
const PORT = 4190

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.json': 'application/json',
}

function findChrome() {
  const candidates = [
    join(
      homedir(),
      '.cache/puppeteer/chrome/linux-146.0.7680.153/chrome-linux64/chrome',
    ),
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  throw new Error('No Chrome binary found')
}

async function serve() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    if (!url.pathname.startsWith(PREFIX)) {
      res.writeHead(404).end('outside base prefix')
      return
    }
    let pathname = url.pathname.slice(PREFIX.length)
    if (pathname === '' || pathname.endsWith('/')) pathname += 'index.html'
    const filePath = join(DIST, normalize(pathname).replace(/^(\.\.[/\\])+/, ''))
    try {
      const info = await stat(filePath)
      if (!info.isFile()) throw new Error('not a file')
      const body = await readFile(filePath)
      res.writeHead(200, {
        'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
      })
      res.end(body)
    } catch {
      res.writeHead(404).end('not found')
    }
  })
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve))
  return server
}

const results = []
function check(name, pass, detail = '') {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function canvasStats(page) {
  // Measure what is actually painted on screen. Reading the WebGL buffer with
  // readPixels is unreliable because the drawing buffer is cleared after the
  // browser composites the frame, so we screenshot a region instead.
  const shot = await page.screenshot({
    clip: { x: 0, y: 150, width: 250, height: 250 },
    encoding: 'base64',
  })

  const stats = await page.evaluate(async (base64) => {
    const canvas = document.querySelector('canvas')
    const hasCanvas = Boolean(canvas)
    const gl = hasCanvas ? canvas.getContext('webgl2') : null

    const image = new Image()
    image.src = `data:image/png;base64,${base64}`
    await image.decode()

    const surface = document.createElement('canvas')
    surface.width = image.width
    surface.height = image.height
    const context = surface.getContext('2d')
    if (!context) return { found: hasCanvas, gl: Boolean(gl), min: 0, max: 0, mean: 0 }
    context.drawImage(image, 0, 0)
    const { data } = context.getImageData(0, 0, surface.width, surface.height)

    let min = 255
    let max = 0
    let sum = 0
    let count = 0
    for (let i = 0; i < data.length; i += 4 * 13) {
      const value = data[i] + data[i + 1] + data[i + 2]
      if (value < min) min = value
      if (value > max) max = value
      sum += value
      count += 1
    }
    return {
      found: hasCanvas,
      gl: Boolean(gl),
      width: surface.width,
      height: surface.height,
      min,
      max,
      mean: count ? Math.round(sum / count) : 0,
    }
  }, shot)

  return stats
}

async function run() {
  const server = await serve()
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--hide-scrollbars',
    ],
  })

  const base = `http://127.0.0.1:${PORT}${PREFIX}`
  const errors = []

  try {
    const page = await browser.newPage()
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
    })
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))

    // --- 1. Responsive checks at three widths ------------------------------
    for (const width of [375, 768, 1280]) {
      await page.setViewport({ width, height: 800, deviceScaleFactor: 1 })
      await page.goto(base, { waitUntil: 'networkidle0' })
      await new Promise((r) => setTimeout(r, 900))

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      check(
        `no horizontal scroll @ ${width}px`,
        overflow.scrollWidth <= overflow.clientWidth + 1,
        `scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`,
      )

      const stats = await canvasStats(page)
      check(
        `webgl2 canvas paints @ ${width}px`,
        stats.found === true && stats.gl === true && stats.max - stats.min > 12,
        JSON.stringify(stats),
      )

      const fonts = await page.evaluate(() => ({
        inter: document.fonts.check('16px "Inter Variable"'),
        mono: document.fonts.check('16px "JetBrains Mono Variable"'),
        count: document.fonts.size,
      }))
      check(
        `fonts loaded @ ${width}px`,
        fonts.inter && fonts.mono,
        JSON.stringify(fonts),
      )

      await page.screenshot({
        path: `/tmp/shot-hero-${width}.png`,
        fullPage: false,
      })
    }

    // --- 2. Hero button scrolls to projects --------------------------------
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto(base, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 600))
    const clickResult = await page.evaluate(() => {
      const link = [...document.querySelectorAll('a')].find((a) =>
        a.textContent?.toLowerCase().includes('view projects'),
      )
      if (!link) return { found: false }
      const rect = link.getBoundingClientRect()
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
      link.click()
      return { found: true, hitTag: hit?.tagName ?? null, hitText: hit?.textContent?.slice(0, 40) ?? null }
    })
    await new Promise((r) => setTimeout(r, 1200))
    const projectsY = await page.evaluate(() => {
      const el = document.getElementById('projects')
      return el ? el.getBoundingClientRect().top : null
    })
    check(
      'hero "View projects" button is clickable and scrolls to #projects',
      clickResult.found === true && clickResult.hitTag === 'A' && projectsY !== null && Math.abs(projectsY) < 220,
      `hit=${JSON.stringify(clickResult)} projectsTop=${projectsY}`,
    )

    // --- 3. Reveal content becomes visible ----------------------------------
    const revealVisible = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('.reveal')]
      const shown = nodes.filter((n) => getComputedStyle(n).opacity === '1')
      return { total: nodes.length, shown: shown.length }
    })
    check(
      'reveal sections fade in (opacity 1 after scroll)',
      revealVisible.total > 0 && revealVisible.shown > 0,
      JSON.stringify(revealVisible),
    )

    // --- 4. Mobile menu ------------------------------------------------------
    await page.setViewport({ width: 375, height: 800 })
    await page.goto(base, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))
    const menuOpened = await page.evaluate(() => {
      const button = document.querySelector('button[aria-controls="mobile-menu"]')
      if (!button) return { found: false }
      button.click()
      return { found: true }
    })
    await new Promise((r) => setTimeout(r, 400))
    const menuState = await page.evaluate(() => {
      const menu = document.getElementById('mobile-menu')
      return {
        exists: Boolean(menu),
        visible: menu ? getComputedStyle(menu).display !== 'none' : false,
        links: menu ? menu.querySelectorAll('a').length : 0,
      }
    })
    check(
      'mobile menu button opens a full-width dropdown',
      menuOpened.found === true && menuState.exists === true && menuState.visible === true && menuState.links >= 6,
      JSON.stringify(menuState),
    )

    const closed = await page.evaluate(() => {
      const link = document.querySelector('#mobile-menu a[href="#skills"]')
      if (!link) return { found: false }
      link.click()
      return { found: true }
    })
    await new Promise((r) => setTimeout(r, 400))
    const menuClosed = await page.evaluate(() => !document.getElementById('mobile-menu'))
    check(
      'mobile menu closes after choosing a link',
      closed.found === true && menuClosed === true,
      JSON.stringify({ closed, menuClosed }),
    )

    await page.screenshot({ path: '/tmp/shot-menu-375.png', fullPage: false })

    // --- 5. WebGL2 unavailable -> CSS fallback --------------------------------
    const fallbackPage = await browser.newPage()
    await fallbackPage.evaluateOnNewDocument(() => {
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        if (type === 'webgl2') return null
        return original.call(this, type, ...rest)
      }
    })
    await fallbackPage.setViewport({ width: 1280, height: 800 })
    await fallbackPage.goto(base, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 700))
    const fallback = await fallbackPage.evaluate(() => {
      const node = document.querySelector('.nebula-fallback')
      if (!node) return { found: false }
      const style = getComputedStyle(node)
      return {
        found: true,
        background: style.backgroundImage,
        size: { w: node.clientWidth, h: node.clientHeight },
      }
    })
    check(
      'CSS nebula fallback renders when WebGL2 is unavailable',
      fallback.found === true && fallback.background.includes('radial-gradient') && fallback.size.h > 100,
      JSON.stringify(fallback),
    )
    await fallbackPage.screenshot({ path: '/tmp/shot-fallback.png', fullPage: false })
    await fallbackPage.close()

    // --- 6. Reduced motion -----------------------------------------------------
    const reducedPage = await browser.newPage()
    await reducedPage.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
    await reducedPage.setViewport({ width: 1280, height: 800 })
    await reducedPage.goto(base, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 900))
    const reduced = await reducedPage.evaluate(() => {
      const reveals = [...document.querySelectorAll('.reveal')]
      const hidden = reveals.filter((n) => getComputedStyle(n).opacity !== '1').length
      const transform = reveals[0] ? getComputedStyle(reveals[0]).transform : 'none'
      return { total: reveals.length, hidden, transform }
    })
    const reducedStats = await canvasStats(reducedPage)
    check(
      'prefers-reduced-motion disables reveal transforms and still paints a frame',
      reduced.hidden === 0 && (reduced.transform === 'none' || reduced.transform === 'matrix(1, 0, 0, 1, 0, 0)') && reducedStats.gl === true,
      JSON.stringify({ reduced, reducedStats }),
    )
    await reducedPage.close()

    // --- 7. Console errors ------------------------------------------------------
    check('no console or page errors', errors.length === 0, errors.slice(0, 5).join(' | '))

    await page.screenshot({ path: '/tmp/shot-full.png', fullPage: true })
  } finally {
    await browser.close()
    server.close()
  }

  const failed = results.filter((r) => !r.pass)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) {
    console.log('FAILED:')
    for (const f of failed) console.log(` - ${f.name}: ${f.detail}`)
    process.exitCode = 1
  }
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
