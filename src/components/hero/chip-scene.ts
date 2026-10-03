import {
  BackSide,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Fog,
  Group,
  InstancedMesh,
  type Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Scene,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/components/site/logo-path";

/**
 * Colors sampled from the hero background (gradient-depth.jpg as rendered),
 * so the chip reflects and sits in the same light as the page around it.
 */
const WORLD = {
  sky: "#9fc2c7", // overhead source, brighter than the visible top edge
  top: "#385d63",
  horizon: "#1b3f46", // directly behind the chip
  floor: "#071f24",
};

/** Package dimensions in scene units (a square QFP-style chip). */
const BODY = { size: 2.4, height: 0.34, radius: 0.07 };
const PINS = { perSide: 10, pitch: 0.2, width: 0.08 };

const AUTO_SPIN = 0.0035; // radians per frame at 60fps
const BASE_TILT = 0.42; // radians; shows the marked top face

export type ChipScene = { dispose: () => void };

/**
 * Renders an interactive 3D microchip into `canvas`.
 * Glossy clearcoat epoxy body, metallic gull-wing pins, the CircuitSparks
 * mark etched on top. Lit by an environment built from the hero's own
 * colors, with matching film grain, so it reads as part of the background.
 */
export function createChipScene(
  canvas: HTMLCanvasElement,
  { reducedMotion, onFirstFrame }: { reducedMotion: boolean; onFirstFrame?: () => void },
): ChipScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const studio = createStudio();
  const envTexture = pmrem.fromScene(studio.scene, 0.03).texture;
  studio.dispose();
  scene.environment = envTexture;
  scene.environmentIntensity = 1;
  // Slight atmospheric haze toward the background color for depth.
  scene.fog = new Fog(WORLD.horizon, 6.2, 16);

  const camera = new PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.5, 6.3);
  camera.lookAt(0, 0, 0);

  // One soft overhead key in the scene's light color; the environment does the rest.
  const key = new DirectionalLight(new Color(WORLD.sky), 1.3);
  key.position.set(-1, 6, 2);
  scene.add(key);

  const chip = new Group();
  chip.rotation.x = BASE_TILT;
  scene.add(chip);

  // Body: glossy black epoxy with a clearcoat that catches the light.
  const bodyGeometry = new RoundedBoxGeometry(BODY.size, BODY.height, BODY.size, 5, BODY.radius);
  const bodyMaterial = new MeshPhysicalMaterial({
    color: 0x040607,
    roughness: 0.6,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });
  addGrain(bodyMaterial);
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
  addGrain(markingMaterial);
  const marking = new Mesh(new PlaneGeometry(BODY.size - 0.2, BODY.size - 0.2), markingMaterial);
  marking.rotation.x = -Math.PI / 2;
  marking.position.y = BODY.height / 2 + 0.001;
  chip.add(marking);

  // Pins: one extruded gull-wing profile, instanced around all four sides.
  const pinGeometry = createPinGeometry();
  const pinMaterial = new MeshStandardMaterial({ color: 0xdbe5e7, metalness: 1, roughness: 0.26 });
  addGrain(pinMaterial);
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

/**
 * Reflection environment: a dome graded from the hero's own colors, plus a
 * large soft overhead source matching the light falling on the background.
 */
function createStudio() {
  const scene = new Scene();
  const dome = new Mesh(
    new SphereGeometry(10, 48, 24),
    new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms: {
        sky: { value: new Color(WORLD.sky) },
        top: { value: new Color(WORLD.top) },
        horizon: { value: new Color(WORLD.horizon) },
        floor: { value: new Color(WORLD.floor) },
      },
      vertexShader: `varying vec3 vPos;
        void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 sky; uniform vec3 top; uniform vec3 horizon; uniform vec3 floor; varying vec3 vPos;
        void main() {
          float h = normalize(vPos).y;
          vec3 c = h > 0.0
            ? mix(mix(horizon, top, smoothstep(0.0, 0.45, h)), sky, smoothstep(0.45, 1.0, h))
            : mix(horizon, floor, smoothstep(0.0, 0.5, -h));
          gl_FragColor = vec4(c, 1.0);
        }`,
    }),
  );
  scene.add(dome);

  // Overhead softbox: the bright band that slides across the glossy top.
  const softbox = new Mesh(new PlaneGeometry(6, 3), new MeshBasicMaterial({ color: new Color(WORLD.sky).multiplyScalar(4) }));
  softbox.position.set(-1.5, 7, 1.5);
  softbox.lookAt(0, 0, 0);
  scene.add(softbox);

  return {
    scene,
    dispose() {
      scene.traverse((o) => {
        if (o instanceof Mesh) {
          o.geometry.dispose();
          (o.material as Material).dispose();
        }
      });
    },
  };
}

/**
 * Static film grain in screen space, scaled to CSS pixels so it matches the
 * grain baked into the background image.
 */
function addGrain(material: Material, amount = 0.05) {
  const dpr = Math.min(window.devicePixelRatio, 2).toFixed(1);
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `#include <dithering_fragment>
      vec2 grainCell = floor(gl_FragCoord.xy / ${dpr});
      float grain = fract(sin(dot(grainCell, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
      gl_FragColor.rgb += grain * ${amount.toFixed(3)};`,
    );
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
  const ink = "rgba(186, 214, 219, 0.42)";

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
  ctx.fillStyle = "rgba(186, 214, 219, 0.26)";
  ctx.fillText("CS-01  ·  2026", size / 2, 770);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
