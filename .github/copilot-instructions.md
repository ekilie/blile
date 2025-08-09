# Haptic - Open-Source Markdown Editor

Haptic is a local-first & privacy-focused, open-source markdown editor with three main applications: web app (PGlite), desktop app (Tauri), and marketing homepage. This is a monorepo using pnpm workspaces and Turbo for builds.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Initial Setup and Dependencies
- Install Node.js (>=18) and pnpm: `npm install -g pnpm`
- Install Rust (for desktop app): Already available in this environment
- Install Linux system dependencies (for Tauri desktop builds):
  ```bash
  sudo apt-get update
  sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf libsoup2.4-dev
  ```

### Bootstrap and Build
- Install dependencies: `pnpm install` -- takes 71 seconds. NEVER CANCEL.
- Build all apps: `pnpm run build` -- takes 77 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
- Build individual apps:
  - Web app: `cd apps/web && pnpm run build` -- takes 50 seconds
  - Desktop app: `cd apps/desktop && pnpm run build` -- takes 50 seconds  
  - Homepage: `cd apps/homepage && pnpm run build` -- takes 25 seconds

### Development Servers
- Web app: `cd apps/web && pnpm run dev` -- starts in ~1 second on http://localhost:5173
- Desktop app: `cd apps/desktop && pnpm run dev` -- starts in ~1 second on http://localhost:5173
- Homepage: `cd apps/homepage && pnpm run dev` -- starts in ~1 second on http://localhost:5173
- Desktop app (Tauri): `cd apps/desktop && pnpm run dev:tauri` -- launches native app (requires system dependencies)

### Code Quality and CI Preparation
- Format code: `pnpm run format` -- takes 23 seconds. NEVER CANCEL.
- Lint code: `pnpm run lint` -- may have some existing linting issues but builds work
- ALWAYS run `pnpm run format` before committing changes
- The CI (.github/workflows/test-build-only.yml) requires clean builds

## Validation

### Manual Testing Scenarios
- **Web App Functionality**: After starting `pnpm run dev` in apps/web, verify:
  - App loads at http://localhost:5173 with full UI
  - Sidebar shows navigation (Notes, Daily, Tasks)
  - Editor loads with sample README.md content
  - Markdown rendering works correctly
  - File properties panel displays metadata
  - Local PGlite database initializes ("Table already exists" log message is normal)

- **Desktop App**: 
  - Vite build works: `cd apps/desktop && pnpm run build`
  - Tauri build requires system dependencies but may fail in constrained environments
  - Development mode: `pnpm run dev:tauri` works if dependencies are installed

- **All Apps**: ALWAYS test that development servers start successfully and display expected content

### Build Validation
- Root build must complete successfully: `pnpm run build`
- Individual app builds must work independently
- Format command must run without errors
- NEVER CANCEL long-running builds - they can take 77+ seconds

## Important Implementation Details

### Critical Bug Fix Applied
- Fixed import issue in `apps/web/src/routes/+layout.svelte`: Changed `@Blile/ui/app.web.css` to `@haptic/ui/app.web.css`
- This was a critical bug preventing builds

### Repository Structure
```
/
├── apps/
│   ├── web/          # Svelte + PGlite web application  
│   ├── desktop/      # Tauri + Svelte desktop application
│   └── homepage/     # Marketing website (Svelte)
├── packages/
│   ├── ui/           # Shared UI components (@haptic/ui)
│   ├── config-eslint/  # ESLint configuration
│   └── config-tailwind/ # Tailwind configuration
├── package.json      # Root workspace configuration
├── pnpm-workspace.yaml
└── turbo.json        # Turbo build configuration
```

### Tech Stack per App
- **Web**: Svelte Kit + Vite + PGlite (local database) + Tailwind
- **Desktop**: Tauri + Svelte Kit + Vite + Tailwind (no database)
- **Homepage**: Svelte Kit + Vite + Tailwind

### Timing Expectations (NEVER CANCEL)
- `pnpm install`: 71 seconds
- `pnpm run build`: 77 seconds (NEVER CANCEL - set timeout 120+ seconds)
- `pnpm run format`: 23 seconds
- Individual app builds: 50 seconds each
- Tauri builds: Can take 5+ minutes if successful

### Known Issues and Workarounds
- Lint command may fail with TypeScript version warnings and some code style issues
- Tauri builds require specific Linux system packages and may fail in constrained environments
- Some Tailwind warnings about node_modules patterns are normal
- Console warnings about Dialog props in web app are expected during development

## Common Tasks

### Adding Features to Web App
1. Run `cd apps/web && pnpm run dev` to start development server
2. Make changes to components in `src/lib/components/`
3. Test functionality in browser at http://localhost:5173
4. Run `pnpm run format` before committing
5. Verify builds still work: `pnpm run build`

### Working with Shared UI Components
- Components are in `packages/ui/components/`
- Import as `@haptic/ui/components/[component-name]`
- CSS files: `@haptic/ui/app.web.css` for web, `@haptic/ui/app.desktop.css` for desktop

### Deployment Testing
- Web app builds to static files in `apps/web/build/`
- Docker build available via `apps/web/Dockerfile`
- Desktop app can be packaged with `pnpm run tauri:build` (requires system dependencies)

Remember: This is a working codebase. The main issue you may encounter is missing system dependencies for Tauri builds, but all Svelte applications build and run successfully.