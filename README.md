# portfolio

Personal portfolio for **Armaan Amoli** — a single-page, static React site built with Vite,
TypeScript and Tailwind CSS v4, deployed to GitHub Pages.

The hero background is a raw-WebGL2 pixel-art halftone nebula (`src/components/ui/halftone-nebula.tsx`).
Everything below the hero is plain DOM with a CSS-only halftone texture.

## Local development

```bash
bun install        # install dependencies
bun run dev        # start the Vite dev server (default port 5173)
bun run build      # type-check (tsc -b) and build to dist/
bun run preview    # preview the production build locally
```

To test the GitHub Pages sub-path locally:

```bash
VITE_BASE=/portfolio/ bun run build
bun run preview
```

## Editing content

All copy lives in **`src/data/portfolio.ts`**. Edit the exported `portfolio` object there —
identity, links, about copy, skills, projects, education, competitive-programming profiles and
contact details. The section components read from that object, so no component changes are needed.

The resume is served from `public/Armaan_Resume.pdf` and linked with
`import.meta.env.BASE_URL` so it resolves correctly under a GitHub Pages project path.

## Deploy to GitHub Pages

1. Create the GitHub repository (for example `github.com/ArmaanAmoli/portfolio`) and push this
   project to the `main` branch:

   ```bash
   git add .
   git commit -m 'Initial portfolio'
   git branch -M main
   git remote add origin git@github.com:<your-username>/portfolio.git
   git push -u origin main
   ```

2. In the repository on GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.

3. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually). The workflow builds
   with Bun and publishes `dist/` through `actions/deploy-pages`.

The site will be live at:

- `https://<your-username>.github.io/portfolio/` for a project repository
- `https://<your-username>.github.io/` for a `<your-username>.github.io` repository

The workflow computes the base path automatically: a repository named `<username>.github.io`
builds with `VITE_BASE=/`, any other repository builds with `VITE_BASE=/<repository-name>/`.

## Stack

- Vite 8 + React 19 + TypeScript (strict)
- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn/ui project structure (`components.json`, `src/components/ui/`)
- `lucide-react` icons
- `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono` (self-hosted, no CDN)
- No backend, no router, no analytics, no runtime API calls
