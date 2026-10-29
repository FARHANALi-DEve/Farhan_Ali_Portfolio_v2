# Farhan Ali — Interactive 3D Computer Studio Portfolio

A portfolio built around a detailed 3D retro computer workstation. The **3D scene outside the computer** uses MIT-licensed assets from Henry Heffernan's portfolio. The **desktop inside the monitor** is a custom FarhanOS experience presenting Farhan Ali's work, skills, and photos.

## Requirements

- Windows 10 or later
- Node.js LTS and npm installed
- A current browser with WebGL support (Chrome or Edge recommended)
- Internet access for the **first run** to download Three.js and the original 3D models/textures

## Run on Windows

1. Extract the full `Farhan_Ali_3D_Studio_Inside_Redesign_v3.zip` archive. Do not run it while it is still inside the ZIP.
2. Double-click **`START_WINDOWS.bat`**.
3. Allow the first-run downloads to finish. The setup gets Three.js via npm and six 3D model/texture files from the original GitHub repository.
4. Open **`http://localhost:5173`** in Chrome or Edge if it does not open automatically.
5. To view just the monitor's desktop experience, open **`http://localhost:5173/farhan-os.html`** while the server is running.

**Do not open `index.html` with `file://`.** The site needs the included local web server.

## Using the portfolio

### 3D scene — current v3 controls

- **Drag** on the 3D canvas to adjust the viewpoint.
- **Mouse wheel** to zoom in or out while viewing the desk.
- **FOCUS COMPUTER** zooms toward the monitor.
- **BACK TO DESK** returns to the wider workstation view.

**Known issue / requested change:** The v3 camera movement is limited and does **not** yet reproduce the original repository's smooth camera transitions. The `FOCUS COMPUTER` and `BACK TO DESK` buttons are still present in this release. The requested change is to remove both buttons and adapt the reference's original mouse-driven idle/desk/monitor camera transitions, keeping the outer 3D environment unchanged. **Do not treat that change as completed in v3.**

### Inside the monitor — FarhanOS

- **My Showcase:** Home, About, Experience, Projects, Skills, Photos, and Contact.
- **Photos:** seven personal portraits, image viewer, next/previous navigation.
- **Projects:** visual project categories, filters, and detail pages.
- **Skills:** technology illustrations and skill groups.
- **Résumé:** open or download the bundled PDF.
- **Desktop tools:** My Computer, Notepad (editable notes and TXT export), Command Prompt, Minesweeper, Start Menu, and draggable/minimizable/maximizable windows.
- **Contact:** email, GitHub, and LinkedIn links. The email action opens the user's mail app; there is no backend message-sending service.

## Project structure

```text
index.html                 3D workstation entry point
studio.js                  Three.js renderer and camera handling
studio.css                 Outer studio styles
farhan-os.html             Inner desktop entry point
os.js / os-style.css       FarhanOS logic and styling
assets/photos/             Seven portfolio images
assets/portfolio/          Original illustrations for project cards
assets/resume/             Farhan Ali résumé PDF
GET_ORIGINAL_ASSETS.ps1    Fetches licensed 3D models and baked textures
START_WINDOWS.bat          Installs dependencies and launches local server
server.cjs                 Local HTTP server
ORIGINAL_SOURCE_LICENSE.md Credits and license details
QA_REPORT.md               Test notes and limitations
```

The original GLB and JPG scene assets are downloaded into `reference-assets/` on first launch; they are **not included in the ZIP**.

## Troubleshooting

- **Blank or missing 3D scene:** Make sure the first-run asset download succeeds, WebGL is enabled, and the browser is up to date.
- **Node/npm not found:** Install Node.js LTS, restart the terminal, then run `START_WINDOWS.bat` again.
- **Page does not open:** Keep the launcher terminal running and browse to `http://localhost:5173`.
- **Rotation feels stiff or stops:** This is a current v3 limitation, not a problem fixed by the README. The camera controls require an implementation update.

## Source and verification

The outer 3D environment is based on **Henry Heffernan's MIT-licensed** `henryjeff/portfolio-website` repository: https://github.com/henryjeff/portfolio-website . See `ORIGINAL_SOURCE_LICENSE.md` for attribution. The related inner OS repository inspired the UX, but the FarhanOS HTML/CSS/JS is custom implementation.

The inner interface was tested in a Chromium browser for navigation, photos, projects, and several desktop apps. The complete original-model 3D scene on a Windows 10 PC, including model-to-monitor alignment and the camera motion, is **not yet verified**.
