# Constellation introduction — 2026-10-11

The owner explicitly requested an approximately 3–4 second entrance. This is a timed title sequence: six warm stars and seven fine lines assemble above seoshiro, then the overlay fades into the existing portfolio. It does not claim a loading percentage or resource-completion status. No existing project layout, screenshot, font or published project repository is changed.

## Duration and navigation

The normal deadline is **3500ms** from the early local bootstrap; the final **480ms** crossfades the overlay. HTML, fonts, images and the application load in parallel. The introduction does not await those resources. Slower browser scheduling can extend the observed deadline; there is no hardware timing guarantee.

The scene entrance is prepared before that fade makes it visible and is not restarted when access opens. A consistent root scrollbar gutter prevents a visible width/name change when scrolling unlocks. The meteor countdown still begins at final open. See the [handoff fix and verification](HANDOFF.md).

It is shown once per tab session. Completion or skipping stores atlas-entry-seen in optional sessionStorage. Reload, logo, language, case navigation and Back/Forward then bypass it. A fresh tab/session can show it again. An automatic saved-language or lang-query redirect does not consume the first introduction: its destination preserves the project, URL/hash and locale and displays the sequence. A transient first-entry query handoff also works with denied storage and is removed by the destination bootstrap before paint.

If storage is unavailable, same-origin referrers, reload and back_forward navigation provide an internal-navigation fallback. Independent direct visits without that evidence may show it again. No cookie, backend or identifier is used.

## Accessibility and recovery

The localized RU/EN/KK dialog describes an automatically ending introduction and offers a 44px-tall skip button. The rest of the site is inert and hidden from assistive technology while it is active. Tab stays on the skip button. Enter/click/touch or Escape skips immediately; Escape is consumed by the dialog and does not navigate away from a direct case. Completion transfers focus to the existing main region without scrolling. Temporary listeners and timers are removed on completion/pagehide.

Reduced motion uses a static composition without the star/line/text animations or opacity crossfade, retaining the requested 3.5s duration and immediate skip. The saved pause preference and Save-Data use the same quiet styles.

The small **local external** /entry-bootstrap.js respects the unchanged script-src self CSP. If the main application fails to start, its independent **4500ms** timer releases useful static HTML and removes inert/aria-hidden. If the bootstrap itself fails or JavaScript is disabled, no introduction hides the content. Credits and 404 pages do not start it.

## Scene integration and verification

The scene prepares in parallel but does not consume its entrance or meteor timer behind the overlay. When the introduction completes/skips, scene.reveal starts the existing visible star/line entrance and schedules the first meteor **2300–2800ms** after the scene is open. It does not wait for a slow font download. Later sparse meteors, camera travel, visibility, context-loss handling and cleanup retain their previous behavior.

Sixteen dedicated production-browser scenarios cover timing, focus, Axe A/AA, mobile 360/390, all three localized direct cases, reload/internal navigation/history, static reduced motion, skipping, failed resources, an eight-second font download, denied storage, missing application fail-open and automatic language redirects with/without storage. The BFCache lifecycle check dispatches persisted pagehide/pageshow to the actual handlers; it verifies scene resumption after leaving mid-introduction without claiming a physical browser-cache test. The existing twenty-four scenarios exercise the established portfolio after entry, including all six camera destinations in RU/EN/KK. Actual private screenshots and a short Chrome recording are kept in the task workspace outside public assets; the private release report records exact source/root SHA, CI and live measurements. Chrome phone emulation is not physical-device or Safari verification.
