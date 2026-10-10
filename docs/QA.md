# Verification — Windows / Chrome

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
