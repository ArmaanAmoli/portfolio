"use client"

import * as React from 'react'

/**
 * Pixel-art halftone nebula rendered with a raw WebGL2 fragment shader.
 *
 * NOTE: the `reference/halftone-nebula.tsx` source supplied with the task was
 * not present in this repository, so this file is a reconstruction that follows
 * the documented contract of that component:
 *   - `preset` selects the colour grade ("crimson" | "dusk" | "void")
 *   - `params` positions the planet and tunes the grade
 *   - `height` sizes the canvas band
 *   - children are rendered in a `pointer-events-none` overlay
 *   - a pointer lamp follows the cursor, clicking adds a sparkle
 *   - rendering pauses when the component scrolls out of view
 *   - `prefers-reduced-motion` renders a single static frame
 *   - a CSS gradient fallback is always painted underneath the canvas, so the
 *     design still reads if WebGL2 is unavailable or the context is lost
 */

export type HalftonePreset = 'crimson' | 'dusk' | 'void'

export interface HalftoneNebulaParams {
  /** Horizontal position of the planet, 0..1. */
  planetX?: number
  /** Vertical position of the planet, 0..1. */
  planetY?: number
  /** Overall brightness of the nebula, 0..1. */
  intensity?: number
  /** Size of the halftone dot grid in device pixels. */  dotScale?: number
}

export interface HalftoneNebulaProps {
  preset?: HalftonePreset
  params?: HalftoneNebulaParams
  /** Height of the nebula band, e.g. "100svh" or "520px". */
  height?: string
  className?: string
  children?: React.ReactNode
}

interface Grade {
  deep: [number, number, number]
  mid: [number, number, number]
  glow: [number, number, number]
  hot: [number, number, number]
}

const GRADES: Record<HalftonePreset, Grade> = {
  crimson: {
    deep: [0.02, 0.01, 0.04],
    mid: [0.36, 0.09, 0.27],
    glow: [0.75, 0.07, 0.27],
    hot: [1.0, 0.12, 0.35],
  },
  dusk: {
    deep: [0.02, 0.02, 0.06],
    mid: [0.09, 0.1, 0.22],
    glow: [0.23, 0.09, 0.27],
    hot: [0.6, 0.16, 0.36],
  },
  void: {
    deep: [0.02, 0.01, 0.04],
    mid: [0.09, 0.1, 0.22],
    glow: [0.14, 0.06, 0.18],
    hot: [0.35, 0.07, 0.19],
  },
}

const VERTEX_SHADER = `#version 300 es
precision highp float;

const vec2 POSITIONS[3] = vec2[3](
  vec2(-1.0, -3.0),
  vec2(-1.0, 1.0),
  vec2(3.0, 1.0)
);

out vec2 vUv;

void main() {
  vec2 position = POSITIONS[gl_VertexID];
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPlanet;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform vec4 uDeep;
uniform vec4 uMid;
uniform vec4 uGlow;
uniform vec4 uHot;
uniform float uIntensity;
uniform float uDotScale;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  // Slow drifting gas.
  float t = uTime * 0.02;
  float base = fbm(p * 2.1 + vec2(t, -t * 0.6));
  float detail = fbm(p * 5.3 - vec2(t * 1.4, t * 0.3));
  float cloud = base * 0.72 + detail * 0.38;

  // Nebula body: bright gas gathers towards the lower left.
  float body = smoothstep(0.16, 0.92, cloud);
  float lowerLeft = smoothstep(1.05, 0.05, distance(vec2(uv.x, 1.0 - uv.y), vec2(0.16, 0.16)));
  body *= mix(0.35, 1.0, lowerLeft);

  // Planet.
  vec2 planetPos = vec2((uPlanet.x - 0.5) * aspect, 0.5 - uPlanet.y);
  float planetDistance = distance(p, planetPos);
  float planetRadius = 0.16;
  float planet = smoothstep(planetRadius, planetRadius * 0.72, planetDistance);
  float limb = smoothstep(planetRadius * 0.62, planetRadius, planetDistance) * planet;

  // Pointer lamp: a soft glow that follows the pointer.
  float lamp = smoothstep(0.55, 0.0, distance(p, vec2((uPointer.x - 0.5) * aspect, 0.5 - uPointer.y)));
  lamp *= uPointerStrength;

  // Pixel-art halftone: quantise the canvas into dots and size them by density.
  vec2 grid = floor(vec2(uResolution.x, uResolution.y) / max(uDotScale, 1.0));
  vec2 cell = floor(gl_FragCoord.xy / max(uDotScale, 1.0));
  float jitter = hash(cell);
  vec2 cellCenter = (cell + 0.5) * max(uDotScale, 1.0);
  float radius = length(gl_FragCoord.xy - cellCenter) / max(uDotScale, 1.0) * 2.0;

  float density = clamp(body * 0.85 + planet * 0.9 + lamp * 0.55, 0.0, 1.0);
  density *= 0.72 + jitter * 0.42;
  float dot = 1.0 - smoothstep(density * 0.92, density * 0.92 + 0.16, radius);
  float dotMask = clamp(dot, 0.0, 1.0);
  vec2 gridUv = cell / max(grid, vec2(1.0));

  // Colour grade the gas.
  vec3 color = uDeep.rgb;
  color = mix(color, uMid.rgb, smoothstep(0.1, 0.65, cloud));
  color = mix(color, uGlow.rgb, smoothstep(0.45, 0.95, body));
  color += uHot.rgb * pow(max(body, 0.0), 2.4) * 0.55;
  color += uHot.rgb * limb * 0.35;
  color += uHot.rgb * lamp * 0.4;

  // Darker voids between dots keep the pixel-art read.
  float mask = mix(0.22, 1.0, dotMask);
  color *= mask;
  color += vec3(0.02, 0.0, 0.05) * (1.0 - dotMask);

  // Stars.
  float stars = step(0.9975, hash(floor(gl_FragCoord.xy / 2.0) + floor(uTime * 0.02)));
  color += vec3(0.85, 0.78, 0.85) * stars * (0.4 + 0.6 * hash(cell + 7.0));

  // Vignette.
  float vignette = smoothstep(1.25, 0.25, length(vec2(uv.x - 0.5, uv.y - 0.5)) * 1.35);
  color *= 0.35 + 0.65 * vignette;

  color *= uIntensity;
  fragColor = vec4(color, 1.0);
}
`

interface Sparkle {
  x: number
  y: number
  born: number
}

const MAX_SPARKLES = 12

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vertex || !fragment) return null

  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  return program
}

function HalftoneNebulaComponent({
  preset = 'crimson',
  params,
  height = '100svh',
  className,
  children,
}: HalftoneNebulaProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const [sparkles, setSparkles] = React.useState<Sparkle[]>([])
  const pointerRef = React.useRef({ x: 0.5, y: 0.5, strength: 0 })

  const planetX = params?.planetX ?? 0.74
  const planetY = params?.planetY ?? 0.2
  const intensity = params?.intensity ?? 1
  const dotScale = params?.dotScale ?? 3

  React.useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = reducedMotionQuery.matches

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })

    // No WebGL2: the CSS gradient fallback underneath stays visible.
    if (!gl) return

    const program = createProgram(gl)
    if (!program) return

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    gl.useProgram(program)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const uniforms = {
      resolution: uniform('uResolution'),
      time: uniform('uTime'),
      planet: uniform('uPlanet'),
      pointer: uniform('uPointer'),
      pointerStrength: uniform('uPointerStrength'),
      deep: uniform('uDeep'),
      mid: uniform('uMid'),
      glow: uniform('uGlow'),
      hot: uniform('uHot'),
      intensity: uniform('uIntensity'),
      dotScale: uniform('uDotScale'),
    }

    const grade = GRADES[preset] ?? GRADES.crimson

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = wrapper.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width * dpr))
      const heightPx = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== width || canvas.height !== heightPx) {
        canvas.width = width
        canvas.height = heightPx
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = (time: number) => {
      resize()
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      gl.uniform1f(uniforms.time, time * 0.001)
      gl.uniform2f(uniforms.planet, planetX, planetY)
      gl.uniform2f(uniforms.pointer, pointerRef.current.x, pointerRef.current.y)
      gl.uniform1f(uniforms.pointerStrength, pointerRef.current.strength)
      gl.uniform4f(uniforms.deep, grade.deep[0], grade.deep[1], grade.deep[2], 1)
      gl.uniform4f(uniforms.mid, grade.mid[0], grade.mid[1], grade.mid[2], 1)
      gl.uniform4f(uniforms.glow, grade.glow[0], grade.glow[1], grade.glow[2], 1)
      gl.uniform4f(uniforms.hot, grade.hot[0], grade.hot[1], grade.hot[2], 1)
      gl.uniform1f(uniforms.intensity, intensity)
      gl.uniform1f(uniforms.dotScale, dotScale)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let frame = 0
    let visible = true
    let running = false

    const render = () => {
      if (!running) return
      draw(performance.now())
      frame = requestAnimationFrame(render)
    }

    const startLoop = () => {
      if (running || reducedMotion) return
      running = true
      frame = requestAnimationFrame(render)
    }

    const stopLoop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    // Pause when the hero scrolls out of view.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting
          if (visible) startLoop()
          else stopLoop()
        }
      },
      { threshold: 0 },
    )
    observer.observe(wrapper)

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect()
      pointerRef.current = {
        x: (event.clientX - rect.left) / Math.max(rect.width, 1),
        y: (event.clientY - rect.top) / Math.max(rect.height, 1),
        strength: Math.min(1, pointerRef.current.strength + 0.12),
      }
    }

    const onPointerLeave = () => {
      pointerRef.current.strength = 0
    }

    const onClick = (event: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const sparkle: Sparkle = {
        x: (event.clientX - rect.left) / Math.max(rect.width, 1),
        y: (event.clientY - rect.top) / Math.max(rect.height, 1),
        born: performance.now(),
      }
      setSparkles((current) => [...current.slice(-(MAX_SPARKLES - 1)), sparkle])
    }

    const onMotionChange = () => {
      reducedMotion = reducedMotionQuery.matches
      if (reducedMotion) {
        stopLoop()
        draw(performance.now())
      } else if (visible) {
        startLoop()
      }
    }

    wrapper.addEventListener('pointermove', onPointerMove)
    wrapper.addEventListener('pointerleave', onPointerLeave)
    wrapper.addEventListener('click', onClick)
    reducedMotionQuery.addEventListener('change', onMotionChange)

    resize()
    if (reducedMotion) {
      draw(performance.now())
    } else {
      startLoop()
    }

    return () => {
      stopLoop()
      observer.disconnect()
      wrapper.removeEventListener('pointermove', onPointerMove)
      wrapper.removeEventListener('pointerleave', onPointerLeave)
      wrapper.removeEventListener('click', onClick)
      reducedMotionQuery.removeEventListener('change', onMotionChange)
      gl.deleteProgram(program)
      gl.deleteVertexArray(vao)
    }
  }, [preset, planetX, planetY, intensity, dotScale])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: 'relative', height, overflow: 'hidden', touchAction: 'pan-y' }}
      data-preset={preset}
    >
      <div
        aria-hidden='true'
        className='nebula-fallback absolute inset-0'
      />
      <canvas
        ref={canvasRef}
        aria-hidden='true'
        className='absolute inset-0 h-full w-full'
        style={{ display: 'block', touchAction: 'pan-y' }}
      />
      {sparkles.map((sparkle, index) => (
        <span
          key={`${sparkle.born}-${index}`}
          aria-hidden='true'
          className='nebula-sparkle'
          style={{
            left: `${sparkle.x * 100}%`,
            top: `${sparkle.y * 100}%`,
          }}
        />
      ))}

      <div
        className='pointer-events-none absolute inset-0'
        style={{ touchAction: 'pan-y' }}
      >
        {children}
      </div>
    </div>
  )
}

export const HalftoneNebula = React.memo(HalftoneNebulaComponent)
HalftoneNebula.displayName = 'HalftoneNebula'
