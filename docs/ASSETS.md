# Asset sources

All three original user sketches were inspected as pixels from supplied local files. They guide composition and are not used as application screenshots. SHA256:
- Hero b2ddf8e8-f3f6-452c-b317-2922ad552074.png: 35BAF00616FC4A14CD3B66BD1002486622993E79FB68BF199F659A9B3D7B22CD.
- Selection 69625e32-01c1-4f19-b22a-09b9c89428ed.png: 2708A1E3858A012FB89051CC9A34F3650F0EB1EEF1B68BA0B13FA3B3C7BBF236.
- Case 8fb9c3c5-fd60-47b8-bf4e-74e9f815fb38.png: ED770F4FD75E0E20EE70C6FC59938A9A7B7FE350030CF4AA118548E812357C55.

space.webp is original procedural art generated from src/scene/space.ts. Project SVG drawings were designed by hand. No external scene or starfield is copied.

sun.webp comes from the official [NASA/SDO AIA 171 image](https://sdo.gsfc.nasa.gov/assets/img/latest/latest_2048_0171.jpg), retrieved 2026-10-10. The actual image timestamp is 2026-09-21 15:26:46 UT. The released image is fixed, never fetched at runtime. Its timestamp footer was cropped, then it was resized/compressed; CSS adjusts display tone and softens its boundary. [NASA/SDO permissions](https://sdo.gsfc.nasa.gov/gallery/copyright/) allow use without copyright restrictions unless noted. Attribution: **Courtesy of NASA/SDO and the AIA, EVE, and HMI science teams.** No endorsement is implied.

SIDEREAL and ITER screens are fresh live captures in isolated Chrome profiles. AYQYN screens are authentic Electron v0.2.4 captures from its repository with licensed test photographs, not exam participants. See [provenance](screenshots-provenance.json) and [AYQYN attribution](AYQYN-SCREENSHOT-ATTRIBUTION.md). AGPL application code is not copied.

Eight remaining pairs of actual project screenshots were preserved from the author's old portfolio, exact a06ece34d9a084d529cfa406f22b0436a746ae98, public/assets/<project>.webp and <project>-detail.webp. All current applications were independently opened and compared.

The current display font is [Manrope Variable](https://github.com/google/fonts/tree/main/ofl/manrope), version 4.505, weight 525 for the Latin name. The current UI font is [Onest Variable 2.000](https://github.com/simpals/onest/releases/tag/2.000), whose official release adds Kazakh coverage. Original TTFs, local subset WOFF2s and each SIL OFL 1.1 license are packaged in public/fonts/Manrope and public/fonts/Onest. public/fonts/glyph-check-v2.json records the exact packaged cmap, versions, hashes and sizes. Older Geologica/Golos artifacts remain as release history and are not loaded by current UI. No remote fonts are loaded.

The social image preserves the previous released hero capture. New refinement QA images and video remain private local artifacts and were not placed in public/assets. Lusion, Active Theory v5 and Stellarium informed light, depth and spatial clarity; their scenes/assets are not copied.
