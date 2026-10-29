# Farhan Ali — Original 3D Studio / Smooth Camera v4

This version keeps the **original MIT-licensed 3D scene assets** and the full redesigned FarhanOS v3 content while replacing the earlier limited camera with smooth, orbiting, reference-style mouse movement. The 3D scene geometry, photos, résumé, OS applications, and styling inside the CRT are preserved.

## Important: two separate repositories and licenses

- **Exterior 3D environment:** based on Henry Heffernan's MIT-licensed `henryjeff/portfolio-website` (geometry and baked texture assets fetched at install time). Original copyright and complete MIT notice included in `ORIGINAL_SOURCE_LICENSE.md`.
- **Inner desktop reference:** `henryjeff/portfolio-inner-site`. The layout and app concepts are used as **design references**, but the new `farhan-os.html`, `os-style.css`, `os.js`, SVG artwork and content were authored independently. No original inner-site images, code, video, games or app media are distributed. The inner-site repo does not visibly carry a LICENSE file in the repository root at the time of inspection, so its assets have not been copied.

## Updated inside of the monitor

My Showcase opens with a designed landing page and seven full navigation areas: **Home, About, Experience, Projects, Skills, Photos, Contact**. The **Résumé** is downloadable and previewable via the PDF link and Start/Terminal. About uses multiple large captioned photos and text; Skills uses graphical technology cards and a professional workspace photo; Projects includes six illustrated entries, category filtering and per-project detail pages with visual media; Experience uses a timeline, photos and credential highlights; Photos has all seven portraits with a fullscreen viewer and keyboard arrows. The Contact page links to email, GitHub, LinkedIn and opens an editable `mailto:` draft, with no misleading claim of sending from a backend.

The FarhanOS desktop also includes **My Computer (folder explorer), My Pictures, Notepad (editable with TXT download), MS-DOS Prompt (supported HELP, ABOUT, PROJECTS, SKILLS, CONTACT, GALLERY, RESUME, WHOAMI, DATE, CLS and OPEN commands), Minesweeper (playable), Read Me, Start Menu, window dragging, minimizing, maximizing, closing and taskbar switching**.

All application code is plain **JavaScript/CSS/HTML**; no TypeScript added.

## Mouse and camera controls — new v4

There are **no visible FOCUS COMPUTER / BACK TO DESK buttons** anywhere on the outside scene.

- **Move / hover your mouse onto the visible CRT screen:** the camera transitions automatically into the computer (1.3 s eased movement). On a touchscreen, tap the CRT screen.
- **Move your mouse off the CRT screen:** the camera returns smoothly to its last desk viewpoint (1.05 s eased movement). This has a small delay to prevent flickering when the iframe moves under your cursor.
- **Drag on the scene outside the screen:** smoothly orbit and rotate the 3D desk using Three.js OrbitControls with damping. Motion decelerates naturally rather than snapping. This is real orbital camera movement, not an X/Y wobble.
- **Mouse wheel:** zoom into/out of the overall 3D scene with limits to stay outside the models.
- **Idle:** the desk camera slowly auto-orbits until the visitor manually interacts, echoing the original cinematic movement.
- **Escape:** another way to return to the desk (not a visible button).

### Windows 10 start

1. Extract the entire ZIP folder.
2. Install Node.js LTS if needed. Internet is required on first run for the Three.js package and the MIT-licensed GLB/JPG scene assets.
3. Double-click `START_WINDOWS.bat`. Wait for the original asset downloader to finish before using the browser opened at `http://localhost:5173`.
4. Hover the physical CRT screen to enter FarhanOS. Use the mouse outside it to smoothly orbit the scene.
5. For just the inside of the computer, open `http://localhost:5173/farhan-os.html` while the server is running.

Do not open `index.html` directly as a `file://` page: module imports and model loading require the local HTTP server.

## What changed and what was preserved

**Changed in v4:** `studio.js` (real damped orbit, smooth automatic screen entry/exit, idle movement), `index.html` (removed focus/back buttons, updated hint), `studio.css` (removed button styling), plus this README/QA report.

**Not changed from v3:** all FarhanOS content files (`farhan-os.html`, `os.js`, `os-style.css`), 7 photos, projects artwork, résumé, GLB/JPG original asset downloader, server, Windows launcher and license notices. The three original asset files pairs and CSS3D screen dimensions/position are unchanged. No 3D scene redesign or downgrade.

## Testing and limitations

- `studio.js` and `os.js` passed JavaScript syntax checks. Confirmed buttons are gone from the index.
- Chromium automated camera interaction test using **mocked Three.js rendering/model loader** exercised actual application JS: desktop startup, 3 model layer callbacks, monitor pointer-enter -> entering -> monitor, pointer-leave -> leaving -> desk, camera positions and look targets, and pointer-up dragging cleanup. No JavaScript runtime errors in that test.
- Checked that the *inside* FarhanOS and photo files remain byte-identical to the previous release. Existing v3 inner screenshots are supplied only for the OS UI.
- **Not verified:** The sandbox cannot download the binary GLB scene assets or npm Three.js, so real GLB/WebGL rendering, live orbit rotation, CSS3D screen pointer hit-testing and Windows 10 performance need testing on your PC. The stub-driven browser check is not a real 3D rendering test.
- If automatic screen focus ever does not respond on a specific browser, please provide its version and a short screen recording. Neither the models nor the OS content should need to be replaced to investigate pointer hit testing.
