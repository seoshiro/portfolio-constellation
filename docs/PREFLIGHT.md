# Historical Windows preflight — 2026-10-10

**Resolved later:** readable originals were supplied in the local Downloads folder and all three pixel sets inspected. The application was then implemented and checked. See ASSETS.md, QA.md and PUBLISHING.md for the completed state; the text below preserves the historical preparation checkpoint.

## Preserved baseline

- Workspace: `C:\Users\gokusen\Documents\Codex\2026-10-10\task-2` was empty before this task.
- Fresh read-only source clone: `old-site/`; working tree stayed clean.
- Root repository: `seoshiro/seoshiro.github.io`, main SHA `a06ece34d9a084d529cfa406f22b0436a746ae98`.
- Remote archival branch: `archive/pre-constellation-2026-10-10`; `git ls-remote` confirmed the exact same SHA.
- Local `pre-constellation-a06ece34.bundle` contains complete history; `git bundle verify` succeeded.
- Existing root publishing workflow: `.github/workflows/publish.yml`, verifies/builds the current repository and deploys `dist` through GitHub Pages. It remains active until the replacement is checked.
- No force push or changes to root main, project repositories, Pages settings or credentials were made.

## Brief and reference access

The complete 286-line brief was read through Library. Known references:

| File | Library identity | Result |
| --- | --- | --- |
| Detailed brief | `libfile_9e74010504e881919e8d4d7afc1e95ae` | Complete text read |
| Case sketch | `libfile_26ee91e837fc8191b649f95c5e68bd51` | Pixels unavailable |
| Selected constellation sketch | `libfile_6f181a341c30819190ace961e88029b0` | Pixels unavailable |
| Hero sketch | `libfile_5780ed3696bc8191986f93d11623dcd5` | Pixels unavailable |

The current official Library `SKILL.md`, `references/materialization.md`, and pristine `library_file_transfer.py` were obtained. `prepare_materialize` used an explicit destination inside this Windows workspace and returned signed transfers. The unchanged helper failed on `os.setxattr`, which is absent from native Windows Python. It did not install a complete, metadata-preserving file. No raw download, helper modification, alternate storage URL or partial-file inspection was used to bypass this failure.

Library image reads returned image asset pointers and extracted descriptions, not image content blocks. Those descriptions were not treated as a pixel inspection. No installed WSL distribution was available to run the unchanged helper. The task needs a supported Windows Library materialization path or actual readable local reference files before visual implementation.

Browser UI tooling was attempted and retried after a reset. Both attempts failed before initialization: `MXC launcher: cannot locate required Windows platform directory: HRESULT 0x80070003`. This does not prevent application QA using the already installed Chrome and Playwright; that browser path worked for public live-page checks.

## Repository access

`gh auth status` reports an invalid saved CLI token. Existing Git Credential Manager access works: a noninteractive `git push --dry-run` succeeded without creating a branch. The existing credential was used through its ordinary Git helper flow to verify the account and create the explicitly requested public repository `seoshiro/portfolio-constellation`. No token was printed, persisted, created, or refreshed; no scope or account change was requested.

## Real projects and screenshots

Fresh source clones were read for SIDEREAL, ITER, AYQYN and ORBIT. Their exact revisions and factual limits are recorded in `data/project-sources.json`. Standalone project repositories were not modified.

SIDEREAL is an SVG/Web Audio musical instrument, not an orbital spacecraft dashboard. It supports four-bar scores, three synthesized voices, a practice guide, local saves, JSON/share links, PNG scores and one-pass WAV export. Its public source SHA matches the user-provided `a49dc39b018ea7bd7e3110ce6112989af63dc40b`.

ITER is an educational route navigator for a fictitious building. The verified case must distinguish model accessibility constraints from certified physical-building accessibility. Its deployment snapshot also contains a public reporting backend; the new portfolio itself does not need that backend. No report was submitted during this preflight.

AYQYN is a Windows local proctoring prototype with observations reviewed by a person, plus a browser replay. It participated in Qostanai AI Industry Hackathon 2026; no winning award is claimed. Repository screenshot provenance explicitly describes real Electron captures with an isolated test profile and licensed test photos. Those screens are suitable as actual case evidence with their existing caption and attribution. The app is AGPL-3.0-only. Its code is not copied into the portfolio.

ORBIT is an idealized educational spacecraft mission studio with original parametric geometry, circular two-body orbit assumptions and local mission storage; no telemetry or flight-readiness claim.

The eight previous catalogue entries remain available for later curation and legacy-route preservation. AURA is excluded.

## Browser and link checks

`preflight-live.mjs` used a fresh, owned Playwright browser context with installed Chrome, a 1440×1000 viewport and reduced motion. It captured the current root site, SIDEREAL, ITER, AYQYN landing page and AYQYN replay. The captures of the current root, SIDEREAL and ITER were visually inspected, alongside AYQYN's actual repository review screenshot.

All 24 root/demo/source URL checks returned HTTP 200. The five captured pages reported no uncaught page errors. This establishes page availability and a first visual/content check; it does not establish a complete feature audit, physical-device behavior or new portfolio QA. Reports and actual screenshots remain in the adjacent `preflight-evidence/` directory.

## Font checks

Official Google Fonts files, OFL licenses, provenance and actual glyph-check reports are packaged locally. Geologica and Golos Text pass EN/RU/KK samples, including all nine Kazakh letter pairs. Unbounded was tested and rejected because 16 required Kazakh uppercase/lowercase glyphs are missing. Claims of broad Cyrillic support alone were insufficient.

Geologica is the intended expressive primary family; Golos Text is available for comfortable long case copy. Final sizing, widths, hierarchy and contrast have not been visually approved.

## Remaining work

1. Resolve the original reference pixels through a supported path and inspect all three.
2. Implement the original star atlas, detailed sun, manually designed interactive constellations, responsive HTML catalogue, full localized cases and navigation state.
3. Run lint, typecheck, content/behavior tests, production build, artifact/security checks, browser interaction tests, performance measurements and independent visual review.
4. Pin the verified new-source SHA in the root publisher; replace the old publisher atomically and verify CI plus live root.

No new portfolio build, screenshots, CI run, application commit or publication is claimed at this checkpoint. The blocker is reference access/tool compatibility, not model capability; switching models would not restore missing file pixels.
