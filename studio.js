import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Preserve the original licensed computer/decor/environment models and CRT screen placement.
// Camera behavior: damped free orbit, subtle automatic idle movement, and original-style
// cursor-enter-monitor / cursor-leave-monitor cinematic focus transitions. NO focus/back buttons.
const $ = id => document.getElementById(id);
const canvas = $('webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#babbbc');
const cssScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 10, 900000);
const gl = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
gl.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
gl.outputColorSpace = THREE.SRGBColorSpace;
const css = new CSS3DRenderer();
css.domElement.style.position = 'absolute';
css.domElement.style.top = '0';
css.domElement.style.pointerEvents = 'none';
$('css-stage').appendChild(css.domElement);

// The same Three.js OrbitControls used by the reference site's free-camera mode.
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.rotateSpeed = 0.60;
controls.zoomSpeed = 0.82;
controls.minDistance = 3300;
controls.maxDistance = 24500;
controls.minPolarAngle = 0.27;
controls.maxPolarAngle = Math.PI / 2 - 0.04;
controls.minAzimuthAngle = -1.35;
controls.maxAzimuthAngle = 1.35;
controls.target.set(0, 600, 0);
camera.position.set(-4200, 2950, 9700);
controls.update();

let mode = 'desk'; // 'desk' | 'entering' | 'monitor' | 'leaving'
let loaded = 0;
let userHasMoved = false;
let lastPointerActivity = performance.now();
let hoverExitTimeout = null;
let enterTransitionCount = 0;
let leaveTransitionCount = 0;
let activeTransition = null;
let savedDeskPosition = camera.position.clone();
let savedDeskTarget = controls.target.clone();
const monitorPosition = new THREE.Vector3(0, 950, 2000);
const monitorLookAt = new THREE.Vector3(0, 950, 0);
const layers = [
  ['Computer/computer_setup.glb', 'Computer/baked_computer.jpg'],
  ['Decor/decor.glb', 'Decor/baked_decor.jpg'],
  ['World/environment.glb', 'World/baked_environment.jpg']
];
const gltfLoader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();

function showError(error) {
  $('error').hidden = false;
  $('loading').hidden = true;
  console.error('Original 3D model loading failed', error);
}
async function loadLayer([model, texture]) {
  return new Promise((resolve, reject) => {
    texLoader.load('/reference-assets/' + texture, tex => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      const baked = new THREE.MeshBasicMaterial({ map: tex });
      gltfLoader.load('/reference-assets/' + model, gltf => {
        gltf.scene.traverse(child => {
          if (child.isMesh) {
            child.scale.setScalar(900);
            child.material = baked;
          }
        });
        scene.add(gltf.scene);
        loaded++;
        $('loadText').textContent = `LOADING ORIGINAL MODELS… ${loaded}/3`;
        resolve();
      }, undefined, reject);
    }, undefined, reject);
  });
}

// Smooth camera travel with a deterministic ease curve, rather than snapping positions.
// Transitions always start at the current camera location, so a quick hover in/out
// reverses naturally and never teleports the user to an obsolete preset.
function beginTransition(destination, duration, nextMode) {
  activeTransition = {
    fromPosition: camera.position.clone(),
    fromTarget: controls.target.clone(),
    destination: destination.position.clone(),
    target: destination.target.clone(),
    start: performance.now(),
    duration,
    nextMode
  };
  controls.enabled = false;
}
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function enterMonitor() {
  if (mode === 'monitor' || mode === 'entering') return;
  if (hoverExitTimeout !== null) { clearTimeout(hoverExitTimeout); hoverExitTimeout = null; }
  if (mode === 'desk') {
    controls.update();
    savedDeskPosition = camera.position.clone();
    savedDeskTarget = controls.target.clone();
  }
  // If reversing an exit animation, preserve the last genuinely explored viewpoint.
  mode = 'entering';
  enterTransitionCount++;
  beginTransition({ position: monitorPosition, target: monitorLookAt }, 1300, 'monitor');
  canvas.classList.remove('dragging');
}
function leaveMonitor() {
  if (mode === 'desk' || mode === 'leaving') return;
  mode = 'leaving';
  leaveTransitionCount++;
  beginTransition({ position: savedDeskPosition, target: savedDeskTarget }, 1050, 'desk');
}
function scheduleLeave() {
  if (hoverExitTimeout !== null) clearTimeout(hoverExitTimeout);
  hoverExitTimeout = setTimeout(() => {
    hoverExitTimeout = null;
    leaveMonitor();
  }, 200); // Avoid a visual oscillation while the camera is approaching the CRT.
}
function cancelLeave() {
  if (hoverExitTimeout !== null) { clearTimeout(hoverExitTimeout); hoverExitTimeout = null; }
  if (mode === 'leaving') enterMonitor();
}
function screenPlane() {
  const iframe = document.createElement('iframe');
  iframe.src = './farhan-os.html';
  iframe.title = 'Farhan Ali interactive portfolio';
  iframe.id = 'computer-screen';
  iframe.style.cssText = 'width:1280px;height:1024px;border:0;background:#087a83;pointer-events:auto;';
  const container = document.createElement('div');
  container.style.cssText = 'width:1280px;height:1024px;pointer-events:auto;';
  container.appendChild(iframe);
  const screen = new CSS3DObject(container);
  screen.position.set(0, 950, 255);
  screen.rotation.x = -THREE.MathUtils.degToRad(3);
  cssScene.add(screen);

  // Pointer interaction tracks the *real screen*, never a separate overlay button.
  // The inner OS is same-origin; listeners inside it keep hover reliable even if
  // the cursor starts inside the iframe after a CSS3D camera transformation.
  iframe.addEventListener('pointerenter', () => { cancelLeave(); enterMonitor(); });
  iframe.addEventListener('pointerleave', scheduleLeave);
  iframe.addEventListener('focus', () => { cancelLeave(); enterMonitor(); });
  iframe.addEventListener('load', () => {
    try {
      const inner = iframe.contentDocument;
      if (!inner) return;
      inner.addEventListener('pointermove', () => {
        if (mode === 'desk' || mode === 'leaving') enterMonitor();
        else cancelLeave();
      }, { passive: true });
      inner.addEventListener('pointerleave', scheduleLeave);
      inner.addEventListener('touchstart', () => { cancelLeave(); enterMonitor(); }, { passive: true });
      inner.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !inner.querySelector('#lightbox:not([hidden])')) {
          leaveMonitor();
          iframe.blur();
        }
      });
    } catch (error) {
      // Fallback: pointerenter/pointerleave on the iframe element still work.
      console.warn('Inner screen event bridge unavailable', error);
    }
  });
  // Touching the monitor enters it automatically on mobile, like hovering on desktop.
  container.addEventListener('pointerdown', () => { cancelLeave(); enterMonitor(); });
}

try {
  await Promise.all(layers.map(loadLayer));
  screenPlane();
  $('loading').hidden = true;
} catch (error) { showError(error); }

const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), 0.08);
  const now = performance.now();
  if (activeTransition) {
    const t = Math.min((now - activeTransition.start) / activeTransition.duration, 1);
    const eased = easeInOut(t);
    camera.position.lerpVectors(activeTransition.fromPosition, activeTransition.destination, eased);
    controls.target.lerpVectors(activeTransition.fromTarget, activeTransition.target, eased);
    camera.lookAt(controls.target);
    if (t >= 1) {
      const nextMode = activeTransition.nextMode;
      activeTransition = null;
      mode = nextMode;
      if (mode === 'desk') {
        controls.enabled = true;
        controls.autoRotate = false;
        controls.update();
      }
    }
  } else if (mode === 'desk') {
    // Subtle movement while idle, like the original; stops immediately on drag.
    controls.autoRotate = !userHasMoved && (now - lastPointerActivity > 1800);
    controls.autoRotateSpeed = 0.25;
    controls.update(dt);
  } else {
    camera.lookAt(controls.target);
  }
  gl.render(scene, camera);
  css.render(cssScene, camera);
  requestAnimationFrame(frame);
}
function resize() {
  const w = innerWidth, h = innerHeight;
  gl.setSize(w, h, false);
  css.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
addEventListener('resize', resize);
frame();

// Explicitly stop the slow cinematic motion when the visitor manually rotates.
canvas.addEventListener('pointerdown', e => {
  userHasMoved = true;
  lastPointerActivity = performance.now();
  controls.autoRotate = false;
  canvas.classList.add('dragging');
  if (mode !== 'desk') leaveMonitor();
});
addEventListener('pointerup', () => canvas.classList.remove('dragging'));
canvas.addEventListener('pointercancel', () => canvas.classList.remove('dragging'));
canvas.addEventListener('wheel', () => { userHasMoved = true; controls.autoRotate = false; lastPointerActivity = performance.now(); }, { passive: true });
addEventListener('keydown', e => { if (e.key === 'Escape') leaveMonitor(); });

// Read-only diagnostics for testing; no additional visible UI or controls.
window.__farhan3d = {
  getState: () => ({
    modelCount: loaded,
    originalMITModels: loaded === 3,
    mode,
    activeTransition: !!activeTransition,
    orbitDamping: controls.enableDamping,
    dragEnabled: controls.enabled,
    cameraPosition: camera.position.toArray(),
    cameraTarget: controls.target.toArray(),
    enterTransitionCount,
    leaveTransitionCount,
    screenPresent: !!$('computer-screen')
  })
};
