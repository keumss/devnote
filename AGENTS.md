# Repository Guidelines

## Project Structure & Module Organization

DevNote is a static React 19 and TypeScript application built with Vite. Code lives in `src/`. `src/main.tsx` initializes hash-based routing, while `src/App.tsx` defines routes. Reusable UI belongs in `src/components/`, hooks in `src/hooks/`, and curriculum content in `src/data.ts`. Global styles live in `src/index.css`; root configuration controls the build.

There is no test or public asset directory. Add colocated tests as `ComponentName.test.tsx` or broader tests under `src/__tests__/`. Put future static assets in `public/`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts Vite on port 3000 and exposes it to the local network.
- `npm run lint` runs TypeScript type checking with no emitted files.
- `npm run build` creates the production site in `dist/`.
- `npm run preview` serves the production build for local verification.
- `npm run clean` removes generated build output.

Before submitting changes, run `npm run lint && npm run build`.

## Coding Style & Naming Conventions

Use TypeScript, ES modules, React function components, and two-space indentation. Follow the existing semicolon and single-quote style. Name component files in PascalCase (`SearchModal.tsx`), hooks in camelCase with a `use` prefix (`useDarkMode.ts`), and variables/functions in camelCase. Move reusable stateful logic into hooks. Preserve existing Tailwind and dark-mode patterns.

No automatic formatter or ESLint configuration is present. Keep diffs focused and use `npm run lint` as the required static check.

## Testing Guidelines

No automated test framework or coverage threshold is configured yet. For UI changes, manually verify desktop and mobile layouts, search, navigation, code copying, and light/dark themes. If adding tests, introduce the runner and an `npm test` script in the same change, then document it here.

## Commit & Pull Request Guidelines

History is small, but uses short imperative summaries and a Conventional Commit example (`feat: ...`). Prefer messages such as `fix: preserve search navigation` or `docs: update contributor guide`. Pull requests should explain the change, list verification commands, link related issues, and include before/after screenshots for visible UI changes. Do not commit `dist/`, environment files, credentials, or generated logs.

## Deployment Notes

GitHub Pages depends on `base: './'` in Vite and `HashRouter` in React. Preserve both unless the deployment architecture changes.
