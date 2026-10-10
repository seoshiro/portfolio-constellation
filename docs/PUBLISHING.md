# Publishing and rollback

Sources live in seoshiro/portfolio-constellation. [seoshiro.github.io](https://seoshiro.github.io/) uses the existing root repository's Pages environment. Standalone project repositories and deployments are separate and unchanged.

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

To return fully to the old pavilion, inspect subsequent changes and normally revert the original root rollout commit 8b84f2a53b69d5e2ac3d9204cd87b184c26915c4. This restores its previous publisher without rewriting history. Verify old checks/deployment and live root. Never force push or delete separate Pages projects.
