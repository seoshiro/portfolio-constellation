# seoshiro / Personal Atlas

Original portfolio for Beibars Ileskhan at [seoshiro.github.io](https://seoshiro.github.io/). Six manually designed constellations open real previews; eleven complete cases and an ordinary HTML catalogue work independently of decorative WebGL.

RU / EN / KK have useful static routes. Language retains the selected project, section or case. A 3.5-second constellation introduction appears once per tab session, can be skipped, and opens the existing atlas or direct case. Content loads in parallel; reduced motion keeps a static entrance. Original procedural space, an attributed NASA/SDO solar image, three star-depth planes, a separate solar plane and constellation camera moves provide depth. A pointed meteor appears about 2.3–2.8 seconds after the scene opens; later cues are 7–14 seconds apart. Text stays still. Motion respects reduced motion and data saving and can be paused. See [entry behavior and fail-open](docs/ENTRY.md).

## Local work

The 2026-10-11 light/motion refinement uses thinner connections and soft stellar cores, a fitted 1280ms camera flight, gradual fading of other groups, a larger clickable real screenshot, brighter tapered meteors and a quieter Sun. The existing fonts and 3500ms introduction are retained. See [motion details and verification](docs/MOTION.md).

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

Preview: http://127.0.0.1:5318/. Windows QA uses installed Chrome; CI uses Playwright Chromium. Capture requires a running preview and creates actual screenshots in evidence/screenshots, Only CAPTURE_SOCIAL=1 additionally replaces the public social image; QA screenshots stay in ignored local evidence. Builds require no asset download. scripts/bake.ts regenerates the original procedural fallback; optional SOLAR_SOURCE specifies the original licensed solar file.

## Source

- src/data: project copy, localization and authored constellation geometries.
- src/ui and scripts/generate.ts: useful static page/preview markup and all routes.
- src/state.ts / src/main.ts: URLs, history, focus, language and preferences.
- src/entry.ts / src/ui/intro.ts / public/entry-bootstrap.js: timed introduction, optional session preference and independent static-content recovery.
- src/scene: rendering quality, visibility, context loss and cleanup.
- public: real screenshots, local fonts and licenses.
- tests: content/state and production browser verification.

The name uses Manrope Variable at weight 525. Onest Variable 2.000 handles UI and EN/RU/KK copy. Actual packaged cmap and Chrome platform-font checks include Ә Ғ Қ Ң Ө Ұ Ү Һ І / ә ғ қ ң ө ұ ү һ і without system fallback. Both fonts are local, free SIL OFL 1.1 releases. See [motion and typography](docs/MOTION.md).

SIDEREAL is a musical instrument. ITER models a fictitious educational building. AYQYN is a prototype with human review and no winning award. AURA is excluded. Cases use actual project sources/screenshots.

The old root version is preserved at [archive/pre-constellation-2026-10-10](https://github.com/seoshiro/seoshiro.github.io/tree/archive/pre-constellation-2026-10-10), exact SHA a06ece34d9a084d529cfa406f22b0436a746ae98. The root publisher pins a verified source SHA from this repository.

See [QA](docs/QA.md), [assets](docs/ASSETS.md), [project sources](data/project-sources.json), [publishing/rollback](docs/PUBLISHING.md) and [historical preflight](docs/PREFLIGHT.md). Physical mobile devices, Safari and native Kazakh editorial review were unavailable.
