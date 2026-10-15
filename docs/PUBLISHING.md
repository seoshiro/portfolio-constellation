# Publishing and rollback

Sources live in seoshiro/portfolio-constellation. [seoshiro.github.io](https://seoshiro.github.io/) uses the existing root repository's Pages environment. Standalone project repositories and deployments are separate and unchanged.

## Signal release recovery

Before the Signal release, the verified source was `bdffb0e339ac92eb24a8ea80152a76fc44528d46`, published by root `4c8a892da5e10de01746821be8e8b648dc5c66ed`. To roll back Signal, pin that source in both existing publisher fields through a normal descendant commit and verify CI plus live version.json. Local complete-history Git bundles of both repositories were verified before release. No force push or neighbouring application changes are needed.

## Release

1. Complete lint, typecheck, content/state tests, build, artifact checks, browser QA, real screenshot inspection and independent review.
2. Commit/push verified source. Confirm remote SHA and successful verify.yml CI for that exact revision.
3. Update the root's single .github/workflows/publish.yml source ref and PORTFOLIO_COMMIT to the same **40-character SHA**, with its README release record, in a normal descendant commit.
4. The root checks out that public source without cross-repository write credentials, repeats verification, builds and deploys dist through its existing Pages environment. There is no second pavilion publisher. Source branches must never be used as unpinned release refs.
5. Confirm remote root SHA, source/root CI, live root/case/localized URLs, version.json source SHA and standalone project URLs. The old artifact remains live until new deployment succeeds.

The root README records its pinned source and rollout commit. /version.json and portfolio-build HTML metadata identify the deployed source. Existing /projects/<id>.html routes remain; #work resolves to the catalogue.

## Restore

Original SHA a06ece34d9a084d529cfa406f22b0436a746ae98 is preserved at [archive/pre-constellation-2026-10-10](https://github.com/seoshiro/seoshiro.github.io/tree/archive/pre-constellation-2026-10-10). A complete verified local Git bundle preserves history; SHA256 B7809E35D68646A127811E1746DA2CEC17253613ECDE14C04083257ABEF2CE92.

For an application regression, pin the last verified constellation SHA through a normal root commit and confirm CI plus version.json.

The catalogue/case motion refinement can be rolled back to source `2e3a2f5c4b6f467ca98ef02fef631eae0cdc9f5b`, previously published by root `84f737be1909f2f26083e0ea2c47371202671472`. It preserves the prior navigation, original opt-in music, fonts and angular cursor. See [catalogue and case motion](CATALOGUE-MOTION.md).

The integrated navigation/audio refinement can be rolled back to source `0a60cdfd24796cb97da616c00b5900776ada6806`, previously published by root `a0d488f4ee88b852e119122fb067f3d1fc2e3953`. That revision preserves the audited open-corner cursor and prior observatory/intro corrections. See [navigation, audio and verification](ATMOSPHERE.md).

The observatory refinement can be rolled back to source `0ee178b95b28f400e99a55b10a9c3b5a3e49ac69`, previously published by root `e9d90d947331e9a5b7b5af857e64fa9bf23aa7ed`. That release preserves the verified introduction/handoff and earlier light/camera refinements. Set both source pin fields to that exact SHA in a normal commit and repeat CI/live verification.

To return fully to the old pavilion, inspect subsequent changes and normally revert the original root rollout commit 8b84f2a53b69d5e2ac3d9204cd87b184c26915c4. This restores its previous publisher without rewriting history. Verify old checks/deployment and live root. Never force push or delete separate Pages projects.
