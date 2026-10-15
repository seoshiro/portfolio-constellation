# seoshiro / Personal Atlas

Original portfolio for Beibars Ileskhan at [seoshiro.github.io](https://seoshiro.github.io/). Six manually designed constellations open real previews; eleven complete cases and an ordinary HTML catalogue work independently of decorative WebGL.

RU / EN / KK have useful static routes. Language retains the selected project, section or case. A 3.5-second constellation introduction appears once per tab session, can be skipped, and opens the existing atlas or direct case. Content loads in parallel; reduced motion keeps a static entrance. Original procedural space, an attributed NASA/SDO solar image, three star-depth planes, a separate solar plane and constellation camera moves provide depth. A pointed meteor appears about 2.3–2.8 seconds after the scene opens; later cues are 7–14 seconds apart. Text stays still. Motion respects reduced motion and data saving and can be paused. See [entry behavior and fail-open](docs/ENTRY.md).

## Signal journey — 2026-10-15

The [Signal / Personal Atlas design](DESIGN.md) connects the original constellation map to three orbital stations and an unfolding receiver. Native scroll drives a reversible 260svh desktop scene; phones use compact sequential station panels. Original Canvas artwork, a shared time-based scene state and one opt-in Web Audio context connect depth, actual scroll velocity, ambience, effects and a small optional persistent quest. Projects remain directly accessible throughout.

[QA](QA_REPORT.md): 16 unit/content/state/audio tests and a fresh complete 110/110 browser run passed (331.32 seconds, no skips, retries or flaky outcomes), together with lint, types, build and artifact checks. Three polish passes fixed tablet composition, scroll/light/audio agreement and real mobile hit obstruction. A final camera fix publishes idle only after terminal light state, including resize/font measurement. Existing project facts, RU/EN/KK, fonts, cursor, loader and ordinary case navigation remain. [Credits](CREDITS.md) record the original procedural assets and existing licenses. Auditory listening, physical devices and Safari remain NOT TESTED.

## Local work

The 2026-10-11 light/motion refinement uses thinner connections and soft stellar cores, a fitted 1280ms camera flight, gradual fading of other groups, a larger clickable real screenshot, brighter tapered meteors and a quieter Sun. The existing fonts and 3500ms introduction are retained. See [motion details and verification](docs/MOTION.md).

The subsequent [entry handoff fix](docs/HANDOFF.md) removes the first-arrival star/line reset and scrollbar layout jump while retaining the same duration, design and meteor timing. Its six added regressions run with the existing forty-one production browser scenarios.

The [observatory refinement](docs/OBSERVATORY.md) adds a precise desktop star cursor, collision-safe real-image hover/focus cards, data-derived catalogue drawings with a wide SIDEREAL lead row, and a subtle shared contact star. Two expressly authorized silent recordings of the actual SIDEREAL and ORBIT demos play only on mouse hover; touch and reduced motion keep their real static posters. Portfolio QA media stays private. Nine further browser regressions preserve the existing forty-seven.

Node 24, pinned dependencies/actions, local fonts/assets. No backend, analytics or paid services.

The [integrated navigation and original atmosphere](docs/ATMOSPHERE.md) adds a 70px sticky desktop header, a native mobile menu, an explicit opt-in CC0 instrumental loop with six quiet project motifs, title-row catalogue geometries and three truthful About examples with actual image fragments. Sound and motion remain independent; first arrival is silent. Fifteen added browser regressions bring the full suite to 77; actual PCM verification brings unit tests to 12. Private browser recordings include the actual application sound; physical headphone/speaker listening remains unavailable.

The [catalogue and case motion refinement](docs/CATALOGUE-MOTION.md) adds finite card reveals, restrained media hover, native image transitions, layout-stable grapheme typing and exact catalogue return. Twelve added regressions bring the full browser suite to 89. Motion remains optional; full static copy stays accessible. Private continuous browser video records the actual open/return transition.

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
