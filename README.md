# Auryvo

Auryvo is a calm, cross-platform AI voice typing, refinement, translation, and remote-control experience. This repository currently contains a polished **React 19 + TypeScript + Tailwind CSS v4 web UI** built from the supplied visual reference and product specification.

The reference UI’s soft pastel gradients, rounded cards, organic 3D characters, pill controls, generous whitespace, and floating navigation are the primary visual direction. Auryvo’s brand purple, dark-mode palette, and seven workspace sections are layered on top.

## Highlights

- Seven responsive screens: Home, Voice Typing, Refinement, Translation, Models, Appearance, and Remote Control.
- Desktop sidebar, command palette (`⌘/Ctrl + K`), and mobile floating navigation.
- Functional light/dark themes and three accent palettes, persisted in local storage.
- Four independently selectable output combinations (raw, refined, translated, unified).
- Live browser dictation through the Web Speech API where supported, with a graceful demo fallback.
- Strict browser-side guard that removes Devanagari during dictation and maps common Hindi words to Urdu or Roman Urdu. Hindi remains available only as an explicit translation target.
- Interactive refinement preview, language catalog, model selection, overlay preview, QR pairing preview, and remote-control event log.
- Reusable, typed components; small pure utility modules; CSS design tokens; unit tests; linting and formatting configuration.

## Getting started

```bash
npm install
npm run dev
```

The dev server binds to `0.0.0.0` so it works inside remote preview environments as well as locally.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run format:check
```

## Static preview

A single self-contained HTML file is committed as `docs/index.html` and copied to `auryvo-preview.html`. It inlines the JavaScript, CSS, fonts, and illustrations, so it can be opened directly in a browser without a server. Generate it with:

```bash
npm run build:preview
```

The same file can also be opened through GitHub’s HTML Preview service:

```text
https://htmlpreview.github.io/?https://github.com/shoaibumer5373-alt/Auryvo/blob/arena/2f0b19c7-auryvo/docs/index.html
```

## Project structure

```text
src/
  components/       Reusable layout, UI, illustration, and voice components
  data/             Navigation, languages, models, and default settings
  lib/              Pure helpers for formatting, pipeline rules, QR, storage, and transcripts
  pages/            Seven product screens
  state/            Typed React context and application provider
  styles/           Tailwind v4 import and semantic design tokens
  assets/           Inlined organic mascot artwork
  types/            Shared TypeScript contracts
docs/             Self-contained public preview HTML
auryvo-preview.html  Same preview file, ready to open locally
```

## Scope

This is a front-end product UI and interaction prototype. It does **not** include the native Windows overlay service, Android accessibility service, Electron shell, Chrome extension, WebSocket pairing server, or production AI gateway calls described in the full Auryvo specification.

Browser dictation uses `SpeechRecognition` where available. API keys entered on the Models screen are kept only in React state for the current session and are never sent anywhere by this prototype. The local transcript normalizer handles common Devanagari tokens; production transcription should use the specified Urdu-aware ASR prompt plus a complete transliteration service for exhaustive coverage.

## Design notes

- Default theme intentionally follows the supplied reference image rather than a conventional SaaS dashboard.
- All illustrations are original generated assets placed in `public/illustrations`.
- Motion respects `prefers-reduced-motion`.
- Controls use semantic buttons, switches, labels, dialogs, and focus-visible states.
