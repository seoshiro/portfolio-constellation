# Motion and typography refinement — 2026-10-10

This retains the published constellation portfolio and its eleven truthful cases. The predecessor source is 8a1016e045565916b8ca9b7aa2fb66512483c39a; the root publisher remains pinned until verified source CI passes. No standalone project repository or screenshot was changed.

## Camera and light

Selecting a project translates and scales its actual SVG geometry over 1080ms. The camera fits the star group and label to the viewport; desktop zoom is usually near 2×, with a maximum of 2.15×. Small phone groups fit adaptively (ORBIT about 1.74× at 390px). The card begins appearing in the final 23% of travel and becomes interactive on arrival. Switching destinations samples the current pose and velocity. Escape and return animate back; scroll position and fixed UI text are preserved.

Far, middle and near procedural star planes project at different depths, with a quieter solar plane and the project geometry in front. Pointer movement is subtle and stops after settling. The Sun dims when a constellation is chosen. Hover/focus reveals the real project headline and a short line-light cue; the card keeps the real screenshot.

After fonts are ready and the scene is revealed, the first pointed meteor is scheduled in 2300–2800ms. Since the 2026-10-11 requested [entry introduction](ENTRY.md), its visible countdown begins after the overlay finishes/skips. Following cues are 7000–14000ms apart; travel takes 850–1080ms, then its head disappears before the fading tail. Paths avoid UI rectangles. Only one meteor exists at a time. Camera travel postpones the next cue.

Reduced motion, Save-Data and the pause button remove meteors and snap the camera to its accessible destination. Hidden/offscreen scenes stop rendering and clear meteor timers. WebGL loss has the existing image/HTML fallback and resource cleanup. DPR stays at most 1.35 with a 1.6M-pixel cap; sustained slow frames reduce resolution further. The renderer does not have a perpetual time loop.

## Fonts

Manrope Variable 4.505 supplies Beibars Ileskhan at weight 525, restrained tracking and separate desktop/phone sizing. Onest Variable **2.000** supplies navigation, labels, previews, cases and EN/RU/KK body copy. Both are free SIL OFL 1.1 and served locally. WOFF2 sizes: Manrope 31,980 bytes; Onest 44,868 bytes.

The packaged cmap includes all required Latin/Russian UI letters and Ә Ғ Қ Ң Ө Ұ Ү Һ І / ә ғ қ ң ө ұ ү һ і. Chrome CSS.getPlatformFontsForNode separately checks the Kazakh string against the real custom Onest font and the name against Manrope. The adjacent decorative star may use its own single-symbol font.

## Verification and private evidence

Ten content/state/camera unit scenarios and twenty-four production browser scenarios cover navigation, storage/image failures, no JS, all routes, context loss, idle/offscreen rendering, reduced motion, interrupted travel, card timing, sparse meteor behavior and real browser font selection. Normal-motion camera fitting covers all six projects in RU/EN/KK at 360, 390, 768 and 1440px. Existing layout checks also cover 1920px and intermediate tablet widths. Automated Axe checks supplement actual pixel inspection; they are not certification.

Actual BEFORE images, AFTER images, flight frames and a short Chrome screen recording are saved outside the repository in the Windows task's preflight-evidence/motion-v2 directory. New QA images/video are not published as portfolio assets. The existing social image remains unchanged. npm run capture now requires explicit CAPTURE_SOCIAL=1 to alter it.

The private release report records exact source/root revisions, CI URLs and live checks. Library upload remains unavailable in the current Windows helper; local files are retained for sharing. Physical phones, Safari, weak physical GPUs and native Kazakh editorial review remain untested. No hardware performance guarantee is claimed.
