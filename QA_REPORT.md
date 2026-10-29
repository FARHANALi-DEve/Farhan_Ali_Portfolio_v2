# QA — Smooth Orbit Camera & Automatic Monitor Focus — v4 (October 29, 2026)

## Passed

- `node --check studio.js` and `node --check os.js`.
- Confirmed `FOCUS COMPUTER` and `BACK TO DESK` buttons and their UI styles were removed.
- Original computer/decor/environment model URLs, baked material mapping, GLTF loading and CSS3D screen plane position retained.
- Headless Chromium interaction smoke test using fake Three.js classes and asset loader: initial model callbacks, orbit-damping configuration, screen pointerenter automatic zoom, completed monitor transition, pointerleave delayed return, completed return to original camera position, drag pointerdown/up state. No JavaScript exceptions in this mock browser test.
- All existing OS v3 assets / photos / resume retained without modification.

## Not verified

- Original licensed 3D GLB/JPG files must download during the Windows startup; the sandbox cannot download them.
- Real WebGL GLB scene visuals, OrbitControls with live Three.js and CSS3D iframe perspective/pointer alignment could NOT be tested here.
- These are *logic tests* of the new movement code, not proof of end-to-end Windows 10 functionality or smooth frame rate.
- If screen hover/exit behaves incorrectly on the user's PC, reproduce with a screen recording and inspect browser devtools errors.
