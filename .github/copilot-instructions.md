# Project Guidelines

## Architecture
- This workspace is a small React + Vite single-page reference app for COBOL/JCL content.
- `src/App.jsx` owns the search/filter flow and renders sections from `src/data/data.json` through `src/components/Layout.jsx` and `src/components/CodeBlock.jsx`.
- Keep the data shape in `src/data/data.json` consistent: `categories[]` with nested `items[]` used directly by the UI.

## Code Style
- Use functional React components with hooks and modern ES module syntax.
- Stay in JavaScript/JSX unless the task explicitly asks for TypeScript.
- Prefer Tailwind utility classes over custom CSS and match the existing dark mainframe look: gray backgrounds, green terminal accents, rounded cards, subtle borders/shadows.
- Preserve French UI copy unless the user asks for translation or localization changes.

## Build and Validation
- On Windows PowerShell, use `npm.cmd` instead of `npm`.
- Install dependencies with `npm install`.
- Start local development with `npm.cmd run dev -- --host 127.0.0.1 --port 4173`.
- Validate changes with `npm.cmd run lint` and `npm.cmd run build`.
- No automated test runner is configured in this repo, so do not assume `npm test` exists.

## Conventions
- Treat `src/data/data.json` as the primary content source; prefer editing content there instead of hardcoding repeated text in components.
- Keep accessibility attributes on interactive elements (`aria-label`, `aria-expanded`, `aria-controls`) when updating UI.
- Search is plain text based, so preserve useful tags/keywords when editing memo entries.
- ESLint uses the flat config in `eslint.config.js`; keep the React hooks and Vite refresh setup intact.
- `README.md` is the default Vite starter doc, so rely on the codebase itself for project-specific patterns.