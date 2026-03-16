# Bart van Zeist - portfolio

Built with Gatsby 5, React 18, TypeScript 5, and styled-components 6.

## Requirements

- Node.js 24.14.0 via `nvm use`
- Corepack-enabled Yarn 4.12.0
- .NET 8 SDK (global install recommended; `yarn generate:cv` can bootstrap a local `.dotnet` SDK if needed)

## Install

```sh
corepack enable
yarn install
```

## Development

```sh
yarn develop
```

## Production build

```sh
yarn build
```

The static site output is generated in `public/` and can be deployed to any static host.

## CV generation

The downloadable CV at `/CV_-_Bart_van_Zeist.pdf` is generated with QuestPDF. The regular site scripts try to refresh it automatically when the required fonts and a compatible .NET runtime are available, and reuse the committed PDF otherwise.

```sh
yarn generate:cv
```

Use `yarn generate:cv` when you want strict regeneration.

The generator renders the full one-page CV layout from the semantic source in [content/cv/cv.json](content/cv/cv.json), including clickable contact links. The committed output is [static/CV_-_Bart_van_Zeist.pdf](static/CV_-_Bart_van_Zeist.pdf).

For exact typography, the generator embeds `Test Tiempos Headline`, `SF Mono`, and `SF Pro Text` from local file paths. It uses these environment variables first and then falls back to common macOS font locations:

- `CV_TEST_TIEMPOS_HEADLINE_REGULAR_PATH`
- `CV_SF_MONO_REGULAR_PATH`
- `CV_SF_PRO_TEXT_REGULAR_PATH`
- `CV_SF_PRO_TEXT_BOLD_PATH`

Strict manual generation fails fast if required fonts cannot be resolved so visual output does not silently drift.

## Local preview

```sh
yarn serve
```

## Lint

```sh
yarn lint
```

