# Publishing and rollback design

This is a proposed scheme. It has not been activated.

## Separation

Keep the new application sources and their verification workflow in `seoshiro/portfolio-constellation`. Preserve the existing root repository's full history and archival branch. Public standalone project repositories and Pages deployments must stay untouched.

After the completed application passes local, browser and independent visual checks, commit it and run CI in the new repository. Record its exact 40-character Git SHA.

In `seoshiro/seoshiro.github.io`, replace the current `.github/workflows/publish.yml` in a normal descendant commit. The replacement should check out `seoshiro/portfolio-constellation` at that explicit verified SHA with `persist-credentials: false`, run its required checks and build, upload only its static `dist` artifact and deploy through the root repository's existing GitHub Pages environment. A publicly readable source checkout requires no cross-repository write token. Keep action versions pinned to audited SHAs.

Do not leave the old pavilion workflow alongside the new one. Root `main` should contain only one active Pages publisher. The main root site must remain on the old deployed artifact until the new pipeline succeeds. Document the new-source SHA in the deployed release manifest and root repository README.

The new repository can run its own verification CI. It should not independently deploy to the user-site root or use an automatic unpinned main checkout in the root publisher. New releases update the root publisher's SHA through a normal commit after the new revision passes checks.

Preserve `/projects/<existing-id>/` routes or provide useful static redirects to equivalent cases. Build all canonical URLs for `https://seoshiro.github.io/`. Verify the separate `/sidereal/`, `/orbit-studio/`, and other project Pages roots before and after rollout.

## Rollback

Baseline: `a06ece34d9a084d529cfa406f22b0436a746ae98`, archived as [`archive/pre-constellation-2026-10-10`](https://github.com/seoshiro/seoshiro.github.io/tree/archive/pre-constellation-2026-10-10). A verified complete Git bundle also exists locally.

For a broken constellation release, update the root publisher to the last verified new-source SHA through a normal commit and inspect CI plus the deployed manifest.

For a full return to the previous pavilion, use a normal revert of the root rollout commit after checking subsequent changes. This restores the old publishing workflow without rewriting history. Verify the restored source/build checks and root live page. Never force push or delete unrelated Pages projects.

The final implementation and exact rollout/rollback commit SHAs must replace this proposal once a verified release exists.
