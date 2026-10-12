# Catalogue and case motion

Catalogue cards reveal once per root-page visit with a 22 px rise over 500 ms. Two cards entering in the same responsive row use an 80 ms stagger; the wide SIDEREAL/PERCH articles animate as one unit. On a fresh direct catalogue arrival, queued reveals start during the existing prepare callback before the intro fade exposes them; opening access does not restart their opacity. Case typing remains paused until access opens. The reveal set, exact origin URL, scroll and focus are saved to the relevant history entry. A short-lived, destination/referrer-bound handoff transfers catalogue origin to a case; each case then owns its origin in history state. Close/Escape preserve that origin across Next and locale changes. Map-origin cases keep their existing map return.

Pointer hover applies identical 1.025 scale and clamped ±1.5 degree transforms to poster/video inside the fixed frame. Keyboard focus reveals a card immediately, without shifting a pointer's hit target during a tap. Touch gets a finite opacity response and no hover scale/tilt.

The generated case summary contains a complete accessible text node and an aria-hidden visual copy split into Unicode grapheme clusters with Intl.Segmenter. Its final layout is present from the start; only opacity changes. Letter delays span 1650 ms plus a 150 ms fade (1800 ms total), with a finite indicator. The case title fades over 350 ms. Subsequent paragraphs use actual rendered word-line positions for short line fades on scroll. No replacement text is sent to a live region.

Same-origin navigation remains ordinary static links. Native cross-document View Transitions expand the chosen real preview into the case image over 500 ms, followed by title/summary. Critical opt-in is declared at the beginning of the generated head, before blocking scripts; waiting for Vite's later stylesheet can cause the browser to skip the transition. A classic head listener prepares the incoming snapshot and clears temporary names after completion. If unavailable/skipped, useful content still navigates immediately with a short case fade. The browser controls navigation cancellation; there is no synthetic loading timer or client router.

Reduced motion, data saving and the existing motion switch disable movement/typing. Full static text remains available without JavaScript. Observers/listeners and finite animations clean up on disposal; hidden documents cannot start new effects. The existing intro bootstrap, fonts, cursor, music and standalone applications are unchanged.

Six inert root templates now contain the same generated preview markup previously imported into the runtime. Cloning the selected template avoids shipping all static case prose in JavaScript; artifact validation requires every template. The 125000-byte JS budget is unchanged.

QA media and diagnostic runs are private outside the repository. Verify native readiness and image-group timing, not merely receipt of a pagereveal event. Chrome viewport/touch emulation does not certify physical devices or Safari.

Platform references: [Chrome cross-document transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document), [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter).

Rollback this refinement by normally pinning both root workflow source fields to `2e3a2f5c4b6f467ca98ef02fef631eae0cdc9f5b`, previously published by `84f737be1909f2f26083e0ea2c47371202671472`, and repeating CI/live validation. Preserve the original archive and all standalone project deployments.
