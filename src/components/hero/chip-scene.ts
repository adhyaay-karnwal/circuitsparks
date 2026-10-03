import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Quaternion,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/components/site/logo-path";

/** Package dimensions in scene units (a square QFP-style chip). */
const BODY = { size: 2.4, height: 0.34, radius: 0.07 };
const PINS = { perSide: 10, pitch: 0.2, width: 0.08 };

const AUTO_SPIN = 0.0035; // radians per frame at 60fps
const BASE_TILT = 0.42; // radians; shows the marked top face

export type ChipScene = { dispose: () => void };

/**
 * Renders an interactive 3D microchip into `canvas`.
 * Glossy clearcoat epoxy body, metallic gull-wing pins, the CircuitSparks
 * mark laser-etched on top, lit by a studio environment.
 */
export function createChipScene(
  canvas: HTMLCanvasElement,
  { reducedMotion, onFirstFrame }: { reducedMotion: boolean; onFirstFrame?: () => void },
): ChipScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.9;

  const camera = new PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.5, 6.3);
  camera.lookAt(0, 0, 0);

  // Lights: a soft key, and a cool rim in the brand sky color.
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new PointLight(new Color("#b6dbe1"), 18, 20, 2);
  rim.position.set(2.5, 1.5, -3);
  scene.add(rim);

  const chip = new Group();
  chip.rotation.x = BASE_TILT;
  scene.add(chip);

  // Body: glossy black epoxy with a clearcoat that catches the light.
  const bodyGeometry = new RoundedBoxGeometry(BODY.size, BODY.height, BODY.size, 5, BODY.radius);
  const bodyMaterial = new MeshPhysicalMaterial({
    color: 0x050708,
    roughness: 0.62,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
  chip.add(new Mesh(bodyGeometry, bodyMaterial));

  // Top marking: etched logo, part number, and the pin-1 dot.
  const markingTexture = createMarkingTexture();
  const markingMaterial = new MeshStandardMaterial({
    map: markingTexture,
    transparent: true,
    roughness: 0.7,
    metalness: 0,
    depthWrite: false,
  });
  const marking = new Mesh(new PlaneGeometry(BODY.size - 0.2, BODY.size - 0.2), markingMaterial);
  marking.rotation.x = -Math.PI / 2;
  marking.position.y = BODY.height / 2 + 0.001;
  chip.add(marking);

  // Pins: one extruded gull-wing profile, instanced around all four sides.
  const pinGeometry = createPinGeometry();
  const pinMaterial = new MeshStandardMaterial({ color: 0xd9dee2, metalness: 1, roughness: 0.22 });
  const pins = new InstancedMesh(pinGeometry, pinMaterial, PINS.perSide * 4);
  const matrix = new Matrix4();
  const rotation = new Quaternion();
  const up = new Vector3(0, 1, 0);
  const span = (PINS.perSide - 1) * PINS.pitch;
  let index = 0;
  for (let side = 0; side < 4; side++) {
    rotation.setFromAxisAngle(up, (side * Math.PI) / 2);
    for (let i = 0; i < PINS.perSide; i++) {
      const offset = new Vector3(BODY.size / 2 - 0.02, -0.04, -span / 2 + i * PINS.pitch).applyQuaternion(rotation);
      matrix.compose(offset, rotation, new Vector3(1, 1, 1));
      pins.setMatrixAt(index++, matrix);
    }
  }
  chip.add(pins);

  // ---------------------------------------------------------------- Interaction
  let spinVelocity = AUTO_SPIN;
  let tilt = BASE_TILT;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastMoveTime = 0;

  const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    lastMoveTime = performance.now();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic or already-released pointer */
    }
    canvas.style.cursor = "grabbing";
    wake();
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const now = performance.now();
    const dt = Math.max(now - lastMoveTime, 1);
    chip.rotation.y += dx * 0.009;
    tilt = clamp(tilt + dy * 0.006, -0.2, 1.2);
    spinVelocity = clamp((dx * 0.009 * 16) / dt, -0.25, 0.25);
    lastX = e.clientX;
    lastY = e.clientY;
    lastMoveTime = now;
  };
  const onPointerUp = (e: PointerEvent) => {
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = "grab";
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.style.cursor = "grab";

  // ---------------------------------------------------------------- Sizing
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  // ---------------------------------------------------------------- Loop
  let frame = 0;
  let visible = true;
  let firstFrameSent = false;
  let lastTime = performance.now();

  const render = () => {
    renderer.render(scene, camera);
    if (!firstFrameSent) {
      firstFrameSent = true;
      onFirstFrame?.();
    }
  };

  const tick = (now: number) => {
    frame = 0;
    const step = Math.min((now - lastTime) / 16.67, 3);
    lastTime = now;

    if (!dragging) {
      const target = reducedMotion ? 0 : AUTO_SPIN * Math.sign(spinVelocity || 1);
      spinVelocity += (target - spinVelocity) * 0.04 * step;
      chip.rotation.y += spinVelocity * step;
      tilt += (BASE_TILT - tilt) * 0.05 * step;
    }
    chip.rotation.x = tilt;
    render();

    const settling = Math.abs(spinVelocity) > 0.0005 || Math.abs(tilt - BASE_TILT) > 0.001;
    if (visible && (dragging || !reducedMotion || settling)) frame = requestAnimationFrame(tick);
  };

  function wake() {
    if (!frame && visible) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  // Pause when the hero scrolls away or the tab is hidden.
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden;
    if (visible) wake();
  });
  visibility.observe(canvas);
  const onVisibilityChange = () => {
    visible = !document.hidden;
    if (visible) wake();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  resize();
  wake();

  return {
    dispose() {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      pinGeometry.dispose();
      pinMaterial.dispose();
      markingTexture.dispose();
      markingMaterial.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

/** Side profile of a gull-wing lead, extruded to pin width. Origin at the body edge. */
function createPinGeometry() {
  const t = 0.036; // metal thickness
  const shape = new Shape();
  shape.moveTo(0, t / 2);
  shape.lineTo(0.1, t / 2);
  shape.quadraticCurveTo(0.13, t / 2, 0.142, -0.03);
  shape.lineTo(0.17, -0.15);
  shape.quadraticCurveTo(0.18, -0.18 + t / 2, 0.21, -0.18 + t / 2);
  shape.lineTo(0.32, -0.18 + t / 2);
  shape.lineTo(0.32, -0.18 - t / 2);
  shape.lineTo(0.2, -0.18 - t / 2);
  shape.quadraticCurveTo(0.152, -0.18 - t / 2, 0.136, -0.14);
  shape.lineTo(0.108, -0.035);
  shape.quadraticCurveTo(0.1, -t / 2, 0.085, -t / 2);
  shape.lineTo(0, -t / 2);
  shape.closePath();

  const geometry = new ExtrudeGeometry(shape, {
    depth: PINS.width,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 8,
  });
  geometry.translate(0, 0, -PINS.width / 2);
  return geometry;
}

/** Laser-etch style marking drawn to a transparent canvas texture. */
function createMarkingTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const ink = "rgba(206, 214, 217, 0.5)";

  // Pin-1 dot, recessed look.
  ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
  ctx.beginPath();
  ctx.arc(130, 130, 46, 0, Math.PI * 2);
  ctx.fill();

  // Logo mark.
  const [vx, vy, vw] = LOGO_VIEWBOX.split(" ").map(Number);
  const markSize = 300;
  ctx.save();
  ctx.translate(size / 2 - markSize / 2, 250);
  ctx.scale(markSize / vw, markSize / vw);
  ctx.translate(-vx, -vy);
  ctx.fillStyle = ink;
  ctx.fill(new Path2D(LOGO_PATH));
  ctx.restore();

  // Text, set in the page font.
  const family = getComputedStyle(document.body).fontFamily || "sans-serif";
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.font = `500 76px ${family}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("CIRCUITSPARKS", size / 2, 690);
  ctx.font = `400 44px ${family}`;
  ctx.letterSpacing = "8px";
  ctx.fillStyle = "rgba(206, 214, 217, 0.32)";
  ctx.fillText("CS-01  ·  2026", size / 2, 770);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
