# Observatory interactions — 2026-10-11

The existing composition, Manrope/Onest typography, six project drawings,
eleven truthful cases and 3500 ms entry/handoff remain the baseline.

On a primary fine mouse pointer, a seven-pixel four-ray star tracks the exact
pointer position. A 26-pixel gold ring eases towards it and widens over links.
The localized caption distinguishes exploring a constellation from opening
a real preview. Text selection uses the native I-beam; touch, keyboard and
the introduction retain native interaction. Click impulses and ring lag
respect the motion preference. No persistent animation loop is added.

Hover or keyboard focus highlights one constellation, pulses its lines once
for 420 ms and shows an actual static screenshot with a localized action.
A single tooltip searches unoccupied viewport boundaries, including its own
drawing, neighbouring groups, name, header, footer and cursor caption. It
fades in/out over 160 ms; rapid changes reuse the same element. If a narrow
viewport has no clear rectangle, the thumbnail stays hidden while the
highlight, native focus outline, title and ordinary case link remain usable.

The catalogue miniatures read exactly the same points and edges as the map.
SIDEREAL leads with a wide desktop row; the remaining five cards retain their
grid and the mobile catalogue stacks naturally. One shared SVG star marks
the name, section accents, pointer and contact. The contact outline reveals
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
