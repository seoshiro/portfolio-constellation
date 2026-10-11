# Light, motion and typography — 2026-10-11

This refines the existing constellation portfolio and its eleven truthful cases. The preceding verified source is 2e3a91fbfc818e1f21646c532819d769b9135543. The root publisher stays pinned until verification of a new source revision succeeds. Standalone project repositories, screenshot assets, the Manrope/Onest fonts and the 3500ms introduction are preserved.

## Camera and light

Selection moves the actual SVG star group and its label to the center of the available scene over 1280ms. Desktop fitting reserves the real preview width; zoom is capped at 2.35×. Phones fit the constellation above a full-width preview and grow the scene to keep the card clear of the footer. Text and navigation stay still. A quintic curve starts and arrives gently; retargeting samples the visible pose and velocity. The preview starts fading in after 82% of travel and becomes interactive on arrival. Its real screenshot is also a case link. Escape and return animate back and restore keyboard focus.

Selected connections are about one-third thinner than the preceding release, with compact bright cores and soft radial halos. Sharp cross spikes are removed. Other star groups dissolve gradually during selection and return on the reverse flight. Far, middle and near star planes use distinct camera depths of 0.16, 0.57 and 1.35. A quieter solar plane moves at 0.055 and dims further on selection. Pointer motion is subtle and ends after settling. The renderer has no perpetual time loop.

After the introduction opens or is skipped, the first meteor is scheduled in 2300–2800ms, independently of slow fonts. Later cues are irregularly spaced 7000–14000ms apart. Each meteor has a small bright core, a soft head halo and a tapered tail; travel lasts 1150–1390ms, with the head disappearing before the final tail fade. Paths avoid UI rectangles. Only one cue exists at a time, and camera travel clears the current cue and postpones the next one.

Reduced motion, Save-Data and the pause button remove meteors and snap the camera to its accessible destination. Hidden/offscreen scenes stop rendering and clear meteor timers. WebGL loss preserves image/HTML fallback and cleanup. DPR remains at most 1.35 with a 1.6M-pixel cap; sustained slow frames reduce resolution further. The added preview ResizeObserver is disconnected with the scene.

## Fonts and introduction

Manrope Variable 4.505 supplies Beibars Ileskhan at weight 525. Onest Variable 2.000 supplies navigation, previews, cases and EN/RU/KK copy. Both are served locally under SIL OFL 1.1. WOFF2 sizes are 31,980 and 44,868 bytes. The packaged cmap includes Ә Ғ Қ Ң Ө Ұ Ү Һ І / ә ғ қ ң ө ұ ү һ і; Chrome platform-font checks verify Onest without system fallback for these letters and Manrope for the name.

The existing [entry behavior](ENTRY.md) remains: 3500ms once per tab session, immediate skip/Escape, static reduced motion, parallel content loading and an independent 4500ms static-content recovery.

## Verification and private evidence

Eleven content/state/camera unit scenarios and forty-one production browser scenarios cover navigation, denied storage, image failure, useful no-JS routes, focus, keyboard/touch case links, context loss, idle/offscreen rendering, reduced motion, retargeting, late cards, meteor timing and actual browser font selection. All six selections are checked in RU/EN/KK at 360, 390, 768 and 1440px; existing layout checks also cover 1920px and intermediate tablet widths. Axe checks supplement actual pixel inspection.

Before/after images, flight frames, Chrome recordings, exact CI/live records and the independent audit are private files in the Windows task's preflight-evidence/light-motion-2026-10-11 directory. QA media is not published as portfolio assets. The existing social image is preserved; npm run capture requires explicit CAPTURE_SOCIAL=1 to alter it.

Physical phones, Safari, weak physical GPUs and native Kazakh editorial review remain untested. Chrome viewport/touch emulation is not physical-device verification.
