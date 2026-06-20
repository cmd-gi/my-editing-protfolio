# Charan — Video Editor · Colorist · Motion Designer Portfolio

A cinematic, high-performance portfolio website showcasing Charan's professional work in video editing, color grading, motion graphics, and AI generative design. Built with a modern, premium aesthetic featuring custom animations, 3D interactive scenes, and server-side rendering (SSR).

---

## 🚀 Tech Stack & Core Technologies

- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (React 19 + SSR + File-based Routing)
- **Vite & Nitro**: Custom high-fidelity bundler setup with [Nitro Server Engine](https://nitro.build/) targeting Cloudflare Workers.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with curated typographic scales (Outfit, Figtree, IBM Plex Mono) and responsive layouts.
- **Animations**: [Motion](https://motion.dev/) (Framer Motion) for page transitions, interactive hover behaviors, and scroll-bound parallax.
- **3D Graphics**: [Spline Integration](https://spline.design/) rendering an interactive 3D studio mascot ("Whobee") with custom theme overlays.
- **Package Manager**: [Bun](https://bun.sh/) for ultra-fast dependency resolution and build cycles.

---

## 🛠️ Getting Started & Local Development

Make sure you have [Bun](https://bun.sh/) installed on your machine.

### 1. Install Dependencies
```bash
bun install
```

### 2. Run the Development Server
Starts the Vite dev server with Hot Module Replacement (HMR).
```bash
bun run dev
```
Open `http://localhost:8080` in your browser.

### 3. Build for Production
Compiles client-side and SSR bundles, then prepares the build for Cloudflare Workers deployment via Nitro.
```bash
bun run build
```

### 4. Preview Build Locally
Preview the production build locally before deploying.
```bash
bun run preview
```

### 5. Code Quality & Formatting
```bash
# Run ESLint linter
bun run lint

# Format code with Prettier
bun run format
```

---

## 📂 Project Structure

```
├── .lovable/                 # (Removed) Deprecated Lovable metadata folder
├── src/
│   ├── assets/               # Local static images, fonts, and assets
│   ├── components/
│   │   ├── ui/               # Core design system components (e.g. interactive-3d-robot)
│   │   ├── HairlineGrid.tsx  # Editorial background grid overlays
│   │   ├── Nav.tsx           # Floating navigation bar with dynamic tracking
│   │   ├── Portfolio.tsx     # Main portfolio page assembler (Hero, About, Contact, etc.)
│   │   ├── SmoothScroll.tsx  # Smooth scrolling engine integration (Lenis)
│   │   ├── VideosSection.tsx # Video portfolio showcase with inline controllers
│   │   └── magic.tsx         # Specialized animators (Marquee, WordRotate, BlurFade)
│   ├── lib/
│   │   ├── portfolio-data.ts # Local portfolio data schema and poster configurations
│   │   └── utils.ts          # Styling helper utilities (clsx & tailwind-merge)
│   ├── routes/
│   │   ├── __root.tsx        # Application shell, global context, and meta tags
│   │   └── index.tsx         # File-based entrypoint root route (/)
│   ├── router.tsx            # QueryClient and TanStack Router instances
│   ├── server.ts             # SSR server entrypoint and error handler wrappers
│   ├── start.ts              # TanStack Start middleware and setup configs
│   └── styles.css            # Global CSS styles and Tailwind direct imports
├── bunfig.toml               # Bun configuration
├── package.json              # Standard dependencies and project scripts
├── tsconfig.json             # TypeScript project overrides
└── vite.config.ts            # Production-grade Vite configuration with Nitro integration
```

---

## ✨ Key Features

- **Interactive 3D Stage**: Features a responsive 3D Spline model ("Whobee") that responds to drag, click, and poke interactions, wrapped in a theme-matched radial gradient with custom watermark overlays.
- **Cinematic Typography**: Harmonized layout scales with strong contrast, lime accents, and dark mode variables.
- **Smooth Layout Scroll**: Seamless scroll-based animations utilizing Lenis smooth scrolling alongside Motion hooks.
- **Zero-Config Router**: Fully file-based, automatically-generated type-safe routing powered by TanStack Start.
