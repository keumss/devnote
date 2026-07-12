# Repository Guidelines

## Project Structure & Module Organization

DevNote is a static React 19 and TypeScript application built with Vite. Code lives in `src/`. `src/main.tsx` initializes hash-based routing, while `src/App.tsx` defines routes. Reusable UI belongs in `src/components/`, hooks in `src/hooks/`, and the Fumadocs-backed content loader in `src/content.ts`. Global styles live in `src/index.css`; root configuration controls the build.

Learning notes live as Markdown/MDX files under `content/<section>/`. A section is a technology-level folder, a note is one MDX file, and a topic is a level-two (`##`) heading within a note. A note's parent directory determines its section, its frontmatter defines the note title, and filenames determine natural numeric note order. Each section's `meta.json` defines its display title, while `content/meta.json` defines section order. The `pages` field in that file is a Fumadocs schema field and is the sole exception to this vocabulary. Use “page” only for an application screen or route. `source.config.ts` configures Fumadocs MDX and validates its standard page and meta schemas. The generated `.source/` directory is build output and must not be committed.

There is no test or public asset directory. Add colocated tests as `ComponentName.test.tsx` or broader tests under `src/__tests__/`. Put future static assets in `public/`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts Vite on port 3000 and exposes it to the local network.
- `npm run lint` runs TypeScript type checking with no emitted files.
- `npm test` runs the Vitest test suite once in jsdom.
- `npm run build` creates the production site in `dist/`.
- `npm run preview` serves the production build for local verification.
- `npm run clean` removes generated build output.

Before submitting changes, run `npm run lint && npm test && npm run build`.

## Coding Style & Naming Conventions

Use TypeScript, ES modules, React function components, and two-space indentation. Follow the existing semicolon and single-quote style. Name component files in PascalCase (`SearchModal.tsx`), hooks in camelCase with a `use` prefix (`useDarkMode.ts`), and variables/functions in camelCase. Move reusable stateful logic into hooks. Preserve existing Tailwind and dark-mode patterns.

For learning-note changes, add or edit `.md`/`.mdx` files instead of embedding content in TypeScript. Keep note frontmatter limited to note-specific metadata such as `title`; do not repeat section or ordering data in notes. Use level-two headings (`##`) for searchable topics and fenced code blocks with a language identifier. Navigation and search data are generated from filenames and metadata files, so do not maintain a separate content index.

No automatic formatter or ESLint configuration is present. Keep diffs focused and use `npm run lint` as the required static check.

## Testing Guidelines

Vitest, Testing Library, and jsdom provide the automated test environment. Keep focused tests colocated as `ComponentName.test.tsx` or put broader tests under `src/__tests__/`. For UI changes, also manually verify desktop and mobile layouts, search, navigation, code copying, and light/dark themes. No coverage threshold is configured.

## Commit & Pull Request Guidelines

History is small, but uses short imperative summaries and a Conventional Commit example (`feat: ...`). Prefer messages such as `fix: preserve search navigation` or `docs: update contributor guide`. Pull requests should explain the change, list verification commands, link related issues, and include before/after screenshots for visible UI changes. Do not commit `dist/`, environment files, credentials, or generated logs.

## Deployment Notes

GitHub Pages depends on `base: './'` in Vite and `HashRouter` in React. Preserve both unless the deployment architecture changes.
