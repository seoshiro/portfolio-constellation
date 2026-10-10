# seoshiro / Personal Atlas

Original portfolio for Beibars Ileskhan at [seoshiro.github.io](https://seoshiro.github.io/). Six manually designed constellations open real previews; eleven complete cases and an ordinary HTML catalogue work independently of decorative WebGL.

RU / EN / KK have useful static routes. Language retains the selected project, section or case. Original procedural space, an attributed NASA/SDO solar image, gentle layer parallax and rare fading meteors provide depth. Text stays still. Motion respects reduced motion and data saving and can be paused.

## Local work

Node 24, pinned dependencies/actions, local fonts/assets. No backend, analytics or paid services.

```sh
npm ci --ignore-scripts
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run check:artifact
npx playwright install chromium
npm run test:browser
npm run check:links
npm run preview
npm run capture
```

Preview: http://127.0.0.1:5318/. Windows QA uses installed Chrome; CI uses Playwright Chromium. Capture requires a running preview and creates actual screenshots in evidence/screenshots, plus the social image from the real hero. Builds require no asset download. scripts/bake.ts regenerates the original procedural fallback; optional SOLAR_SOURCE specifies the original licensed solar file.

## Source

- src/data: project copy, localization and authored constellation geometries.
- src/ui and scripts/generate.ts: useful static page/preview markup and all routes.
- src/state.ts / src/main.ts: URLs, history, focus, language and preferences.
- src/scene: rendering quality, visibility, context loss and cleanup.
- public: real screenshots, local fonts and licenses.
- tests: content/state and production browser verification.

Geologica supplies expressive display type; Golos Text handles long copy. Both packaged fonts pass actual cmap checks for EN/RU/KK, including Әә Ғғ Ққ Ңң Өө Ұұ Үү Һһ Іі. SIL OFL files are included.

SIDEREAL is a musical instrument. ITER models a fictitious educational building. AYQYN is a prototype with human review and no winning award. AURA is excluded. Cases use actual project sources/screenshots.

The old root version is preserved at [archive/pre-constellation-2026-10-10](https://github.com/seoshiro/seoshiro.github.io/tree/archive/pre-constellation-2026-10-10), exact SHA a06ece34d9a084d529cfa406f22b0436a746ae98. The root publisher pins a verified source SHA from this repository.

See [QA](docs/QA.md), [assets](docs/ASSETS.md), [project sources](data/project-sources.json), [publishing/rollback](docs/PUBLISHING.md) and [historical preflight](docs/PREFLIGHT.md). Physical mobile devices, Safari and native Kazakh editorial review were unavailable.
