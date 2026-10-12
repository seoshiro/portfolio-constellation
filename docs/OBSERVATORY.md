# Observatory interactions — 2026-10-11

The existing composition, Manrope/Onest typography, six project drawings,
eleven truthful cases and 3500 ms entry/handoff remain the baseline.

On a primary fine mouse pointer, an exact three-pixel light dot sits inside
four fine open corner strokes. The frame is 22px normally and 30px on links,
with 180ms opening; its 38ms easing is capped at 6px displacement, including
between pointer events and RAF. The cursor has no visible HUD label. Real
localized card actions remain. Text selection uses the native I-beam; touch,
keyboard and introduction retain native interaction. A 220ms corner echo
finishes after clicking. Reduced motion snaps the frame and disables the
echo/transitions. Window blur and pointer leave restore the native cursor.
The viewport clips the decorative corners without moving the exact dot.
No persistent animation loop is added. See [cursor-only refinement](CURSOR.md).

Hover or keyboard focus highlights one constellation, pulses its lines once
for 420 ms and shows an actual static screenshot with a localized action.
A single tooltip searches unoccupied viewport boundaries, including its own
drawing, neighbouring groups, name, header and footer. It
fades in/out over 160 ms; rapid changes reuse the same element. If a narrow
viewport has no clear rectangle, the thumbnail stays hidden while the
highlight, native focus outline, title and ordinary case link remain usable.

The catalogue miniatures read exactly the same points and edges as the map.
SIDEREAL leads with a wide desktop row; the remaining five cards retain their
grid and the mobile catalogue stacks naturally. One shared SVG star marks
the name, section accents and contact. The contact outline reveals
on entry and follows the mouse by at most four pixels and 4.5 degrees.
Reduced motion keeps it static and already drawn.

## Two authorized public application demos

Only SIDEREAL and ORBIT have clean 5.2-second silent WebM recordings. They
were captured from the actual live applications in isolated, unsigned-in
Chrome contexts with their default demonstration state. SIDEREAL's native
playback cursor advances; ORBIT's native scene rotates and its solar wings
fold. No application source, account or personal content was changed.
The portfolio owner expressly authorized public use of these two recordings.

Both load lazily on actual mouse movement over their image, remain muted,
loop while hovered, and return to the static poster on leave. Keyboard,
scroll, touch, page hiding, offscreen state and motion pause stop playback.
Layout-generated pointerover events cannot restart a stopped video. Pending
play promises use a version guard so rapid leave/reentry is safe. Touch,
reduced motion and data saving retain static images. Video errors preserve
the ordinary image and case link.

Private portfolio QA videos, screenshots, traces and raw recording evidence
remain outside public assets and both repositories. Public footage consists
of those two clean demos only. Everything uses existing free tools/hosting.

## Verification

Nine observable browser regressions cover the cursor, text selection,
finite impulses, localized captions, tooltip geometry, rapid switching,
touch modality, shared drawings, contact motion and lazy video lifecycle.
They run with the existing forty-seven entry, handoff, navigation, layout,
fallback, performance and accessibility regressions. See [QA](QA.md) for
the completed release observations and limitations.

The independent audit caught tooltip collisions and a playback restart
after keyboard/scroll. Both were repaired before release. Physical phones,
Safari and native Kazakh editorial review remain unavailable; Chrome touch
emulation is identified as emulation.


Keyboard focus during Escape camera return is preserved: its card appears when the existing flight finishes. Only the camera-flight true-to-false transition presents the focused card; other class changes cannot revive a dismissed card. Layout-generated pointerover under a stationary mouse cannot steal keyboard mode; genuine pointer movement restores mouse mode. A scoped class observer is disconnected with the other observatory resources; no continuous polling or change to the scene timing is required.


## Cold-font early Skip correction

The initial published observatory source f5731a2024c9f0f5c192b4bddb0b61599307c088 passed all 56 checks in source/root CI, but the complete Windows live run found one genuine cold-cache failure: 390px early Skip revealed Arial before Manrope arrived, moving the name width from 188.078125 to 198.828125px. The original 55-pass/1-failure live report, trace and pixels are retained privately. No assertion, timing bound or retry policy was weakened.

The hero now installs a 2564-byte binary-backed variable subset of the existing Manrope 4.505 before entry setup. It contains exactly the name glyphs, preserves their original outlines/advances and 200–800 weight axis, and renders the same weight 525. A separate face avoids a still-loading CSS face taking priority. Binary decoding is synchronous; it does not wait on a download, change CSP, add an asset delay or change the 3500ms intro/handoff/meteor timers. The full local font and its SIL OFL 1.1 license are retained; root HTML also preloads Manrope for ordinary/no-JS fallback. Two additional 360/390px regressions deliberately hold the full font download, skip immediately, then require every visible letter to stay fixed before and after that late font completes. All prior 56 scenarios retain their assertions; the full suite now has 58. Exact CI/live outcomes remain recorded separately.
