# Verification — Windows / Chrome

## Catalogue/case motion — 2026-10-12

The release suite now contains 89 production browser scenarios and 12 unit tests. Twelve new scenarios measure whole-card 22px/500ms reveals and actual 80ms row staggering, first-catalogue intro continuity, exact URL/scroll/focus return across history/locale/Next, poster/video geometry and bounded hover, RU/EN/KK grapheme layout and full accessible text, touch/pause/reduced/no-JS, malformed optional state, new-tab isolation, native transition readiness/500ms timing/name cleanup and actual skipTransition fallback. Existing assertions, timing limits, retry policy and the 125000-byte budget remain unchanged.

Final independent audit is PASS for the exact main JS/CSS and both bootstraps. The corrected first-catalogue handoff has zero opacity drop at 390/1440; cold KK typing completes 1823.4ms after the 3501.4ms intro. Independent five-width inspection covers 360/390/768/1440/1920px, real Chrome accessibility trees and Axe, native forward/reverse snapshots, cold KK direct-case typing after entry, exact paragraph selection and a real popup with copied opener storage/referrer. Private continuous Chrome recordings demonstrate native transitions with ordinary recordVideo enabled. An early suspicion of a screencast limitation was rejected: critical CSS opt-in needed to precede blocking head scripts. The corrected generated head does so without weakening CSP.

Independent first-catalogue frames exposed a visible opacity 1→0 reset at the end of the intro, despite the intermediate 88-scenario pass. Card reveals now prepare before the existing overlay fade begins; opening access never restarts them. The original intro source, duration and case-typing pause remain preserved. The new regression samples actual per-frame card opacity across that handoff. Earlier failed diagnostics and the intermediate pass remain separate from final release results.

Forty useful static routes remain. Six generated inert preview templates match their localized renderer output and reduce runtime JS to 57,458 bytes; project data, screenshots, font files, music, scene and original entry bootstrap are preserved. Private evidence lives outside the repositories in preflight-evidence/catalogue-motion-2026-10-12. Exact source/publisher CI, live results and verified video/Library outcome are recorded in the root release record and private final report. Physical phones, Safari and native Kazakh editorial review remain unavailable; touch and widths use installed Chrome emulation.

## Current observatory refinement - 2026-10-11

Local lint, strict TypeScript, eleven unit tests, build/artifact checks and all58 production browser scenarios passed in one complete installed-Windows-Chrome run (6.5 minutes). There were no retries, skips or flaky results. All prior56 scenarios and their assertions remain; two additional cold-Manrope early-Skip tests compare every name glyph before/after a deliberately delayed full-font response at360/390px. The build has40 useful HTML artifacts and119,241 uncompressed JavaScript bytes against125,000. All35 external destinations returned HTTP200 in this refinement's link pass. Earlier failed source CIs, initial published live55/56 and intermediate local57/58 are preserved privately; the latter exposed full-face warm readiness, now loaded independently in the background without awaiting or delaying entry.

The independent final audit verifies actual cursor coordinates and finite settling, text drag/native I-beam, keyboard/touch/reduced modes, collision-free own/neighbor/footer/caption tooltip geometry, data-identical miniatures, contact reveal/drift, selected layouts and Axe A/AA, playback stop after keyboard/scroll, video request-error fallback, a controlled stale play completion, and independent decoding of both actual5.2-second silent demos. Its initial tooltip collisions and pointerover-driven playback restart were fixed before release. The existing3500ms entry and stable handoff remain independently verified.

Actual private screenshots cover hero, all six hover cards, selected state, full case, catalogue, about and contact at360/390/768/1440/1920px. Private first-entry, hover and open/return recordings are stored outside both repositories in preflight-evidence/observatory-2026-10-11; private evidence is not a public asset. Only the two separately authorized clean actual SIDEREAL/ORBIT application demos are public. The previous project copy, static screenshots, fonts, scene/camera, intro code and exact original archive were verified unchanged. See [observatory behavior and demo provenance](OBSERVATORY.md).

Source and root CI repeat the full58-scenario suite for the pinned release. The root release record and private final report identify exact SHAs/CI/live checks. Physical phones, Safari and native Kazakh editorial review remain unavailable; touch is Chrome emulation. Hidden-tab checks are handler observations rather than physical tab-switch benchmarks. Library upload, when unsupported by its current Windows helper, does not change the private status or location of QA videos.

## Current intro handoff fix - 2026-10-11

Local lint, strict TypeScript, eleven unit tests, production build/artifact checks and all forty-seven Chrome browser scenarios passed. The final run took 3.2 minutes, with no retries, skips or flaky results. There are forty HTML artifacts and 105,828 uncompressed JavaScript bytes against the 125,000-byte limit. All six new handoff regressions and the forty-one existing entry, navigation, motion, font, layout, fallback and accessibility scenarios run together.

Actual before/after frames reproduce the old visible star/line reset and the classic-scrollbar width shift. The corrected build prepares the scene before the overlay fade reveals it, avoids restarting it at3500ms and preserves a consistent root scrollbar gutter. Independent final installed-Chrome observations cover fourteen modes and 360/390/768/1440px, including Escape, reduced motion, stored pause, flat fallback, direct KK selection/EN case, late Onest and real scrollbars. Visible opacity, actual hero width, the complete name rectangle and scroll remain stable through handoff; no extra resize redraw or page error was observed. Intro duration and the first post-intro meteor remain preserved.

The temporary-gutter attempt was rejected by independent QA before release. Its failed intermediate evidence is preserved separately from the final PASS. Root clientWidth can change when a real scrollbar becomes visible even if its space is reserved, so the regression contract measures actual scene and name geometry rather than mistaking that API change for a visual shift. Private frames, recordings, telemetry, audit and exact CI/live evidence are in preflight-evidence/entry-handoff-2026-10-11. Public font, screenshot and project-data files are unchanged. See [handoff details](HANDOFF.md).

## Previous light/motion refinement - 2026-10-11

Local lint, strict TypeScript, eleven content/state/camera unit tests, build and artifact checks passed. All forty-one production Chrome scenarios passed in 2.9 minutes. The production artifact has forty static HTML routes and 105,692 uncompressed JavaScript bytes against its 125,000-byte budget.

The selected-state matrix checks every featured project in RU/EN/KK at 360, 390, 768 and 1440px, including actual star/label bounds, thinner lines, removed cross spikes, enlarged image dimensions, fading background groups and card/footer separation. A touch regression opens the enlarged screenshot and verifies Escape/focus in all three languages. Existing 1920px/tablet, entry, reduced-motion, keyboard/history, no-JS, hidden/offscreen/context-loss and Axe checks remain in the same full run. All 35 external destinations responded HTTP 200 in this pass.

Private before/after pixels, Chrome video, independent review, CI and exact live revision evidence are retained outside both repositories in preflight-evidence/light-motion-2026-10-11. These records distinguish browser emulation from physical-device testing. Fonts, project screenshots, project content and the 3500ms introduction are preserved. See [current behavior](MOTION.md).

The first source CI passed 39 of 41 browser scenarios. With two concurrent software-GPU workers, the entry callback was observed at 4230ms against its unchanged 4200ms upper limit; a meteor interval sampled through delayed test-runner IPC appeared as 6735ms against its unchanged 6900ms lower limit. CI now uses one worker to isolate timing, and meteor insertion timestamps are recorded by a browser-side MutationObserver installed before navigation. Timing bounds, application code and retry policy are unchanged. The original failed CI/log is preserved in the private release evidence; final exact-revision CI and live results are separate gates.

## Previous motion/typography refinement - 2026-10-10

The final local run passed lint, strict TypeScript, ten content/state/camera unit tests, build, artifact checks and **24 production Chrome browser scenarios** (1.7 minutes). The static release has 40 HTML routes and 100,733 uncompressed JavaScript bytes against a 125,000-byte limit.

Normal-motion fitting covers every featured project in RU/EN/KK at 360, 390, 768 and 1440px: 72 destinations, with actual star geometry and labels inside the viewport. Existing checks cover 1920px, intermediate tablet widths, touch, static fallback, routes, storage/images, focus/history, context loss and Axe A/AA. New checks cover interrupted camera travel, late card reveal, sparse fading meteors, pause during flight and real Chrome font selection.

All 35 distinct external destinations were checked. Three GitHub documentation URLs still returned 503 to the HTTP fetch after bounded retries, then opened successfully with HTTP 200 and their expected repository titles in installed Chrome. Every demo/source destination responded 200. The private probe records both observations; browser results were not substituted silently for the failed fetches.

Independent review corrected a click-delegation collision and overlapping hit areas, then verified all 18 ordinary All projects clicks (six projects at 390/768/1440), case/map return, font loading, reduced motion and renderer sleep. Actual meteor first cues were 2548/2737ms; following cues 11768/12491ms. Camera arrival was 1088–1094ms in that pass. A separate concurrent local probe observed 1217ms under QA load; these are observations, not a hardware guarantee.

Manrope renders all 15 Latin name glyphs; Onest 2.000 alone renders the full Kazakh proof string in Chrome. Packaged cmap reports have no missing required letters. A separate decorative star beside the name can use a one-glyph symbol font.

Private BEFORE/AFTER screenshots, transition video and section screenshots are outside the repository in preflight-evidence/motion-v2. New QA media was not published as public/assets; the prior social image is unchanged. The current Library helper cannot upload them, so local artifacts are preserved. See [MOTION](MOTION.md), [assets](ASSETS.md) and [publishing](PUBLISHING.md).

Physical phones, Safari, native Kazakh editorial review and physical low-end GPU benchmarking are still unavailable. Hidden-tab audit invokes the visibility handler; it is not a physical browser-tab switching test.

The first two Linux refinement CI runs passed 23 of 24 scenarios. A test-side 200ms sleep sampled after completion; a browser-side 350ms timer then retargeted before the first enlarged frame was observed. The isolated geometry/card timing regression now uses the real flat-fallback camera, records opacity/zoom inside the browser and interrupts on observable partial enlargement. It still checks early card invisibility and position continuity. All 72 normal-motion fit destinations and the other rendering checks retain WebGL; actual Windows capture/audit timings remain separate observations.

## Original constellation release observations

The following records the predecessor release and remains historical; its performance numbers were not remeasured for this refinement.


The full brief and all three original references were read and visually inspected. Exact old root history was archived before application work. Standalone repositories were read only.

## Production checks

- ESLint, strict TypeScript and seven content/state tests.
- Eleven real cases in three languages, known selection IDs, storage denial, truthful AYQYN limits and strict 1.6M-pixel rendering budget.
- Forty useful static artifacts: 3 homepages, 33 cases, 3 credits pages and 404. Internal links, local executables, release/CSP metadata and 125 KB uncompressed JavaScript budget are checked.
- Sixteen Chrome browser scenarios: rapid selection, reload, Back/Forward, Escape/focus, language/section/case preservation, keyboard, touch, denied storage, broken images, no JS, flat fallback, actual WebGL loss/restoration, idle/offscreen rendering and reduced motion.
- Main layouts: 360, 390, 768, 1440, 1920 px × RU/EN/KK. Intermediate selected-label occlusion: 600, 601, 640, 800, 801, 900, 1024, 1100 px.
- Axe WCAG A/AA on home, selected SIDEREAL, ITER case and Kazakh AYQYN: no violations. This is automated testing, not formal certification.
- All 35 distinct demo, source, verification, contact and image-permission links returned HTTP 200.

## Actual visual and application review

Thirty browser screenshots cover hero, selected state, full case, catalogue, about and contact at all five main widths. Desktop/mobile/tablet pixels were inspected. Improvements include a soft solar boundary, earlier phone preview and readable inactive constellation labels. Full-page capture loads lazy images explicitly.

Independent review inspected all references, eighteen portfolio screenshots, all eleven English cases and state/scene/navigation code. It found intermediate tablet overlaps, secondary-case focus and credits locale issues. These were corrected and covered by regressions.

Its final independent pass checked 108 selected states (601/640/768/801/900/1100 × RU/EN/KK × 6 projects), confirmed focus and all credits routes/canonical/alternate, and found no substantial release blockers. The reviewer noted a minor solar-brightness tradeoff on narrow tablets. All sixteen final production browser scenarios passed after those corrections.

All eleven published applications were opened in fresh profiles: HTTP 200, no uncaught page errors. SIDEREAL guide skip/play/stop and ITER 3D/2D/route-step controls were exercised for authentic screenshots. Additional demo control observations are retained locally. No external report was submitted; test state remains in isolated browser storage.

Independent localhost performance (no network/CPU throttling): LCP 544ms at390px /332ms at1440px, CLS about0.00009 /0.00008. These are local observations, not field metrics or slow-network guarantees. Rendering has no ongoing time loop, DPR≤1.35, ≤1.6M pixels, visibility pause, resource cleanup and HTML/image fallback.

Linux software-rendering CI exposed frame-dependent parallax settling. The renderer now eases by elapsed time with a 450ms completion bound. The idle check waits for the observable completed state before verifying the frame count remains constant, rather than assuming a particular CPU/GPU frame rate.

## Limits

Installed Chrome and CI Chromium are actual browser engines; phone widths/touch are emulated. Physical phones, Safari and native Kazakh editorial review were unavailable. Native computer-use initialization failed; QA used installed Chrome through Playwright. Audio controls were exercised without claiming hardware listening tests. AYQYN physical camera inference was not tested.

The root README records release SHAs/CI; live version.json identifies deployed source. The existing site stays live until the new verified artifact is successfully deployed.


The first observatory source CI ([38162466081](https://github.com/seoshiro/portfolio-constellation/actions/runs/38162466081), source 7d455239f51b4beac5860e2e004cbb4059761c0d) passed 55 of 56 browser checks. Keyboard focus arriving during Escape camera return could leave its hover card hidden after the flight. The observatory now observes the existing camera-flight class and presents the still-focused card when the drawing settles. The regression deliberately focuses during return flight; no intro/meteor bounds, retry policy or scene implementation changed. The failed exact-revision log remains in private release evidence. Final CI/live results are separate gates.

The second source CI ([38163842650](https://github.com/seoshiro/portfolio-constellation/actions/runs/38163842650), source 09df3439087fab4b071a670435d8cba0f24a295d) also passed 55 of 56, failing earlier in the rapid-hover fixture. Installed-Chrome event telemetry reproduced automatic scrolling from repeated locator.hover calls, with scroll events arriving after the last pointer movement and correctly dismissing the card. Both the original sequence and normal/4x CPU-emulation event timestamps are preserved privately. The fixture now premeasures an idle map and sends twelve genuine mouse.move transitions, then requires the final hit-test, one observing ITER and one visible correct ITER card. Separate scroll-dismiss coverage remains. All nine local observatory checks pass in 40.7s; application JS/CSS are unchanged from the independently audited keyboard correction. No timing limit, retry or application behavior was weakened.


## Cold-font early Skip correction

The initial published observatory source f5731a2024c9f0f5c192b4bddb0b61599307c088 passed all 56 checks in source/root CI, but the complete Windows live run found one genuine cold-cache failure: 390px early Skip revealed Arial before Manrope arrived, moving the name width from 188.078125 to 198.828125px. The original 55-pass/1-failure live report, trace and pixels are retained privately. No assertion, timing bound or retry policy was weakened.

The hero now installs a 2564-byte binary-backed variable subset of the existing Manrope 4.505 before entry setup. It contains exactly the name glyphs, preserves their original outlines/advances and 200–800 weight axis, and renders the same weight 525. A separate face avoids a still-loading CSS face taking priority. Binary decoding is synchronous; it does not wait on a download, change CSP, add an asset delay or change the 3500ms intro/handoff/meteor timers. The full local font and its SIL OFL 1.1 license are retained; root HTML also preloads Manrope for ordinary/no-JS fallback. Two additional 360/390px regressions deliberately hold the full font download, skip immediately, then require every visible letter to stay fixed before and after that late font completes. All prior 56 scenarios retain their assertions; the full suite now has 58. Exact CI/live outcomes remain recorded separately.


Independent final cold-font correction audit: PASS for ten targeted states. Held-font early Skip at360 RU/390 EN/1440 KK has zero change in every glyph, heading and visible name star; original full Manrope525 comparison is exact. Normal entry measured3504.9ms and its first meteor2674.9ms after access. Warm full-face readiness, reduced motion with all network fonts aborted, direct/localized routes, noJS and unavailable FontFace fail-open passed with zero page/CSP errors. Actual pixels were inspected; original font/CSS/entry/scene/project files remain unchanged. Exact source/publisher CI and live outcomes are separate final release gates.
