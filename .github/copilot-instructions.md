# Project Guidelines

## Architecture

- This repo is a Gatsby 4, React 17, and TypeScript single-page portfolio site.
- The homepage is assembled in [src/pages/index.tsx](../src/pages/index.tsx) from section components exported by [src/components/index.tsx](../src/components/index.tsx).
- Markdown content lives under [content](../content): jobs and featured entries use folder-based `index.md` files with colocated assets, while projects are standalone markdown files.
- Treat [gatsby-config.ts](../gatsby-config.ts) as the source of truth for Gatsby plugins, content sources, and GraphQL code generation.
- Treat [src/config.ts](../src/config.ts) and [src/styles](../src/styles) as the source of truth for site settings, colors, and theme mixins.

## Build And Validation

- Use Yarn for repo tasks. The workspace is configured for `yarn@3.2.0`.
- Main commands:
  - `yarn develop` for local development
  - `yarn build` for production output
  - `yarn lint` for ESLint fixes on `src/**/*.{ts,tsx}`
  - `yarn format` for Prettier on TypeScript, JSON, and Markdown files
  - `yarn clean` to clear Gatsby caches
  - `yarn serve` to build and serve the static output
- No automated test suite is configured. For non-trivial changes, validate with `yarn lint` and at least one of `yarn build` or `yarn develop`.
- CI in [Jenkinsfile](../Jenkinsfile) installs dependencies with Corepack-enabled Yarn on Node 18.7.0 and deploys the generated `public/` output.

## Code Style

- Match the existing TypeScript and React style: functional components, typed props interfaces, semicolons, and styled-components for styling.
- Keep import style consistent with the surrounding file. Path aliases such as `@components` and `@styles` exist, but many files still use relative imports.
- Reuse the theme mixins and shared variables in [src/styles/theme.tsx](../src/styles/theme.tsx), [src/styles/mixins.tsx](../src/styles/mixins.tsx), and [src/styles/variables.tsx](../src/styles/variables.tsx) before adding new colors, spacing rules, or breakpoints.

## Conventions

- Do not hand-edit `graphql-types.ts`, `public/`, or `.cache/`; they are generated.
- Avoid touching `.yarn/cache` unless the task is explicitly about dependencies or Yarn state.
- When GraphQL queries change, rely on Gatsby code generation to refresh `graphql-types.ts` instead of patching generated types manually.
- If you introduce browser-only libraries, keep Gatsby SSR in mind and update [gatsby-node.ts](../gatsby-node.ts) if HTML builds need null-loader exceptions.
- When adding, removing, or reordering homepage sections, keep [src/pages/index.tsx](../src/pages/index.tsx), [src/components/index.tsx](../src/components/index.tsx), and the navigation entries in [src/config.ts](../src/config.ts) in sync.
- For markdown-backed content, preserve the existing frontmatter shapes in [content/featured](../content/featured), [content/jobs](../content/jobs), and [content/projects](../content/projects), and keep assets next to the owning markdown file when that folder pattern already exists.