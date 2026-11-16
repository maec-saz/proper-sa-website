/* =========================================================
   Proper Developments — immersive 3D layer (Three.js)
   Source file. Bundled to assets/js/immersive.js with:  npm run build
   ========================================================= */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const COLORS = {
  bg: 0x070f1b,
  navy: 0x0b1626,
  brand: 0x2a4261,
  copper: 0xe09a4b,
  teal: 0x3fd0c9,
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = () => window.innerWidth < 760;
const canUseImages = location.protocol !== 'file:'; // WebGL can't sample file:// images (browser security)

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch (e) { return false; }
}

const isRTL = () => document.documentElement.dir === 'rtl';
const lang = () => document.documentElement.lang || 'en';

/* ---------- shared helpers ---------- */
function makeRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall() ? 1.5 : 1.75));
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.setClearColor(COLORS.bg, 1);
  return r;
}

function makeComposer(renderer, scene, camera, w, h, strength, threshold = 0.18) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), strength, 0.55, threshold);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  return { composer, bloom };
}

let dotTex = null;
function dotTexture() {
  if (dotTex) return dotTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c);
  return dotTex;
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!canUseImages || !src) return resolve(null);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawCover(g, img, x, y, w, h) {
  const r = Math.max(w / img.width, h / img.height);
  const iw = img.width * r, ih = img.height * r;
  g.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

function fallbackArt(g, w, h, seed) {
  const grd = g.createLinearGradient(0, 0, w, h);
  grd.addColorStop(0, '#132338');
  grd.addColorStop(1, seed % 2 ? '#1c3150' : '#0f2a2e');
  g.fillStyle = grd;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(63,208,201,.18)';
  g.lineWidth = 2;
  for (let i = 0; i < 14; i++) {
    g.beginPath();
    g.moveTo(0, (i + 1) * h / 15);
    g.lineTo(w, (i + 1) * h / 15 + Math.sin(i + seed) * 40);
    g.stroke();
  }
}

/** Builds a panel texture: image on top and (optionally) a caption bar. */
async function panelTexture({ src, title, cat, seed = 0, caption = true }) {
  const W = 1024, IH = 576, CH = caption ? 136 : 0;
  const c = document.createElement('canvas');
  c.width = W; c.height = IH + CH;
  const g = c.getContext('2d');
  const img = await loadImage(src);
  if (img) drawCover(g, img, 0, 0, W, IH); else fallbackArt(g, W, IH, seed);
  // subtle vignette so panels read as screens
  const v = g.createLinearGradient(0, IH * 0.55, 0, IH);
  v.addColorStop(0, 'rgba(7,15,27,0)');
  v.addColorStop(1, 'rgba(7,15,27,.45)');
  g.fillStyle = v;
  g.fillRect(0, 0, W, IH);
  if (caption) {
    g.fillStyle = '#0b1626';
    g.fillRect(0, IH, W, CH);
    g.fillStyle = '#e09a4b';
    g.fillRect(0, IH, W, 6);
    const ar = lang() === 'ar';
    const fam = ar ? '"IBM Plex Sans Arabic", Tahoma, sans-serif' : 'Sora, Manrope, "Segoe UI", sans-serif';
    g.direction = ar ? 'rtl' : 'ltr';
    g.textAlign = ar ? 'right' : 'left';
    const x = ar ? W - 40 : 40;
    g.fillStyle = '#e09a4b';
    g.font = `700 26px ${fam}`;
    g.fillText(ar ? cat : cat.toUpperCase(), x, IH + 50);
    g.fillStyle = '#ffffff';
    g.font = `700 40px ${fam}`;
    let t = title;
    while (g.measureText(t).width > W - 80 && t.length > 4) t = t.slice(0, -2);
    if (t !== title) t = t.trim() + '…';
    g.fillText(t, x, IH + 104);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: c.height / c.width };
}

/* Glowing grid floor shader */
function gridFloor(size, colorA, colorB, fadeRadius) {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uA: { value: new THREE.Color(colorA) },
      uB: { value: new THREE.Color(colorB) },
      uFade: { value: fadeRadius },
    },
    vertexShader: /* glsl */`
      varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform float uFade;
      varying vec3 vW;
      float grid(vec2 p, float s){ vec2 q = p / s; vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q); return 1.0 - min(min(g.x, g.y), 1.0); }
      void main(){
        float d = length(vW.xz);
        float g1 = grid(vW.xz, 1.0) * 0.55;
        float g2 = grid(vW.xz, 4.0) * 0.9;
        float pulse = smoothstep(0.0, 0.6, 0.6 - abs(fract(d * 0.12 - uTime * 0.18) - 0.5)) ;
        vec3 col = mix(uA, uB, pulse);
        float fade = 1.0 - smoothstep(uFade * 0.25, uFade, d);
        float a = (g1 + g2) * fade * (0.35 + pulse * 0.9);
        gl_FragColor = vec4(col * (1.0 + pulse), a);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function dustPoints(count, box, color, size) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const spd = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = THREE.MathUtils.randFloat(box[0], box[1]);
    pos[i * 3 + 1] = THREE.MathUtils.randFloat(box[2], box[3]);
    pos[i * 3 + 2] = THREE.MathUtils.randFloat(box[4], box[5]);
    spd[i] = THREE.MathUtils.randFloat(0.05, 0.25);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size, map: dotTexture(), color, transparent: true, opacity: 0.8,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData = { spd, box };
  return pts;
}
function updateDust(pts, dt) {
  const p = pts.geometry.attributes.position.array;
  const { spd, box } = pts.userData;
  for (let i = 0; i < spd.length; i++) {
    p[i * 3 + 1] += spd[i] * dt;
    if (p[i * 3 + 1] > box[3]) p[i * 3 + 1] = box[2];
  }
  pts.geometry.attributes.position.needsUpdate = true;
}

/** Runs a render loop only while the element is visible and the tab is active. */
function visibilityLoop(el, tick) {
  let visible = false, raf = 0, last = performance.now();
  const loop = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    tick(dt, now / 1000);
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0.01 }).observe(el);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}

/* =========================================================
   1) HERO — 3D command-center scene
   ========================================================= */
async function initHero() {
  const hero = document.querySelector('.hero');
  const media = hero && hero.querySelector('.hero__media');
  if (!media) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'hero__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  media.appendChild(canvas);

  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.bg, 0.036);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);

  /* --- AI core --- */
  const core = new THREE.Group();
  scene.add(core);
  const shell = new THREE.IcosahedronGeometry(1.25, 3);
  core.add(new THREE.Points(shell, new THREE.PointsMaterial({
    size: 0.07, map: dotTexture(), color: COLORS.teal, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })));
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.25, 1)),
    new THREE.LineBasicMaterial({ color: COLORS.teal, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending }),
  );
  core.add(wire);
  const glowMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color(COLORS.copper) }, uB: { value: new THREE.Color(COLORS.teal) } },
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uTime; uniform vec3 uA; uniform vec3 uB; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2); float p = 0.75 + 0.25 * sin(uTime * 2.0);
      vec3 c = mix(uB * 0.35, uA, f); gl_FragColor = vec4(c * p, f * 0.95 + 0.08); }`,
  });
  core.add(new THREE.Mesh(new THREE.SphereGeometry(0.82, 64, 64), glowMat));
  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), new THREE.MeshBasicMaterial({ color: 0xfff1dc }));
  core.add(heart);

  // orbit rings with satellites
  const rings = [];
  [[1.85, COLORS.copper, 0.9, 0.2], [2.3, COLORS.teal, -0.5, 0.8], [2.75, 0x8fb3ff, 0.25, -0.6]].forEach(([r, col, tx, tz], i) => {
    const g = new THREE.Group();
    g.rotation.set(Math.PI / 2 + tx, 0, tz);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 160), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.65 }));
    g.add(ring);
    const sat = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), new THREE.MeshBasicMaterial({ color: col }));
    sat.position.x = r;
    g.add(sat);
    g.userData.speed = 0.35 + i * 0.18;
    core.add(g);
    rings.push(g);
  });

  // neural cloud
  const cloudN = isSmall() ? 260 : 520;
  const cloudGeo = new THREE.BufferGeometry();
  const cp = new Float32Array(cloudN * 3);
  for (let i = 0; i < cloudN; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(THREE.MathUtils.randFloat(1.6, 3.2));
    cp.set([v.x, v.y, v.z], i * 3);
  }
  cloudGeo.setAttribute('position', new THREE.BufferAttribute(cp, 3));
  const cloud = new THREE.Points(cloudGeo, new THREE.PointsMaterial({
    size: 0.045, map: dotTexture(), color: 0xbfe9ff, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  core.add(cloud);

  /* --- Curved LED video wall --- */
  const wall = new THREE.Group();
  scene.add(wall);
  const wallImgs = [
    'services/control-console.jpg', 'projects/aramco-sail.jpg', 'services/mission-control.jpg', 'projects/lexus-showroom.jpg',
    'services/city-night.jpg', 'projects/hq-business-park.jpg', 'services/control-room-hero.jpg', 'projects/high-mark.jpg',
    'services/glass-tower.jpg', 'projects/kec-dar-al-jewar.jpg', 'services/cranes.jpg', 'projects/tewergi.jpg',
    'projects/bin-sulaiman.jpg', 'services/warehouse.jpg',
  ];
  const cols = 7, R = 13, PW = 2.9, PH = 1.66, gap = 0.12;
  const step = (PW + gap) / R;
  const screens = [];
  for (let row = 0; row < 2; row++) {
    for (let c = 0; c < cols; c++) {
      const a = (c - (cols - 1) / 2) * step;
      const mat = new THREE.MeshBasicMaterial({ color: 0x6f7f96, toneMapped: true });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), mat);
      m.position.set(Math.sin(a) * R, -0.55 + row * (PH + gap), 3 - Math.cos(a) * R);
      m.lookAt(0, m.position.y, 3);
      m.userData = { phase: Math.random() * 6.28, base: 0.42 + Math.random() * 0.12 };
      const frame = new THREE.Mesh(new THREE.PlaneGeometry(PW + 0.06, PH + 0.06), new THREE.MeshBasicMaterial({ color: 0x1c3150 }));
      frame.position.z = -0.02;
      m.add(frame);
      wall.add(m);
      screens.push(m);
      const src = 'assets/img/' + wallImgs[(row * cols + c) % wallImgs.length];
      panelTexture({ src, seed: row * cols + c, caption: false }).then(({ tex }) => { mat.map = tex; mat.needsUpdate = true; });
    }
  }
  // light strip under the wall
  const strip = new THREE.Mesh(
    new THREE.CylinderGeometry(R - 0.05, R - 0.05, 0.03, 96, 1, true, Math.PI - step * 3.6, step * 7.2),
    new THREE.MeshBasicMaterial({ color: COLORS.copper, side: THREE.DoubleSide }),
  );
  strip.position.set(0, -1.45, 3);
  wall.add(strip);

  /* --- Floor & dust --- */
  const floor = gridFloor(90, COLORS.brand, COLORS.teal, 26);
  floor.position.y = -1.6;
  scene.add(floor);
  const dust = dustPoints(isSmall() ? 500 : 1300, [-16, 16, -1.6, 7, -12, 8], 0xffd9a8, 0.06);
  scene.add(dust);

  /* --- Post-processing --- */
  let { composer, bloom } = makeComposer(renderer, scene, camera, 1, 1, isSmall() ? 0.75 : 0.95);

  /* --- Layout --- */
  const layout = () => {
    const w = media.clientWidth, h = media.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    camera.fov = w < 760 ? 58 : 42;
    camera.updateProjectionMatrix();
    const side = isRTL() ? -1 : 1;
    if (w < 900) { core.position.set(0, 2.4, -1.5); core.scale.setScalar(0.85); }
    else { core.position.set(side * 3.0, 0.85, 0); core.scale.setScalar(1); }
  };
  layout();
  window.addEventListener('resize', layout);
  new MutationObserver(layout).observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

  /* --- Interaction --- */
  const mouse = new THREE.Vector2(), target = new THREE.Vector2();
  window.addEventListener('pointermove', (e) => {
    target.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  }, { passive: true });

  const speed = reduceMotion ? 0.15 : 1;
  let intro = reduceMotion ? 1 : 0, t = 0;
  hero.classList.add('has-3d');

  visibilityLoop(hero, (dt) => {
    t += dt * speed;
    intro = Math.min(intro + dt / 2.8, 1);
    const e = 1 - Math.pow(1 - intro, 3);
    mouse.lerp(target, 0.05);
    const scroll = Math.min(window.scrollY / (hero.offsetHeight || 1), 1);

    camera.position.set(mouse.x * 0.9, 1.0 + mouse.y * 0.45 + scroll * 0.6, THREE.MathUtils.lerp(17, 10, e) - scroll * 3.2);
    camera.lookAt(mouse.x * 0.3, 0.75 - scroll * 0.4, 0);

    core.rotation.y = t * 0.25;
    core.rotation.x = Math.sin(t * 0.3) * 0.15;
    wire.rotation.y = -t * 0.4;
    cloud.rotation.y = -t * 0.08;
    rings.forEach((r) => { r.rotation.z += dt * speed * r.userData.speed; });
    heart.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
    glowMat.uniforms.uTime.value = t;
    floor.material.uniforms.uTime.value = t;
    screens.forEach((s) => {
      const k = s.userData.base + Math.sin(t * 0.8 + s.userData.phase) * 0.07;
      s.material.color.setScalar(k * e);
    });
    updateDust(dust, dt * speed);
    composer.render();
  });
}

/* =========================================================
   2) VIRTUAL SHOWROOM — 360° room of projects
   ========================================================= */
async function initShowroom() {
  const stage = document.getElementById('showroomStage');
  const P = window.PROPER;
  if (!stage || !P) return;
  const canvas = stage.querySelector('canvas');
  const label = document.getElementById('showroomLabel');
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.bg, 6, 20);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 80);
  camera.position.set(0, 1.7, 0);
  camera.rotation.order = 'YXZ';

  const projects = P.projects;
  const N = projects.length;
  const R = 7;
  const W = 2 * R * Math.tan(Math.PI / N) * 0.8;
  const panels = [];
  const room = new THREE.Group();
  scene.add(room);

  const buildTextures = () => Promise.all(projects.map((p, i) => {
    const L = p[lang()] || p.en;
    return panelTexture({ src: 'assets/img/projects/' + p.img, title: L.t, cat: L.c, seed: i });
  }));

  projects.forEach((p, i) => {
    const a = (i / N) * Math.PI * 2;
    const g = new THREE.Group();
    g.position.set(Math.sin(a) * R, 1.75, -Math.cos(a) * R);
    g.lookAt(0, 1.75, 0);
    const H = W * (712 / 1024);
    const mat = new THREE.MeshBasicMaterial({ color: 0x9aa6b8 });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
    screen.userData = { id: p.id, index: i, hover: 0 };
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.08, H + 0.08), new THREE.MeshBasicMaterial({ color: 0x1c3150 }));
    frame.position.z = -0.01;
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.9, 0.035), new THREE.MeshBasicMaterial({ color: COLORS.copper }));
    glow.position.set(0, -H / 2 - 0.22, 0.02);
    g.add(frame, screen, glow);
    g.userData = { screen, glow };
    room.add(g);
    panels.push(g);

    // light pillars between panels
    const b = a + Math.PI / N;
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 4.2, 0.04), new THREE.MeshBasicMaterial({ color: COLORS.teal }));
    pillar.position.set(Math.sin(b) * (R + 0.15), 1.9, -Math.cos(b) * (R + 0.15));
    room.add(pillar);
  });

  const applyTextures = async () => {
    const texes = await buildTextures();
    texes.forEach(({ tex }, i) => {
      const m = panels[i].userData.screen.material;
      if (m.map) m.map.dispose();
      m.map = tex;
      m.needsUpdate = true;
    });
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(applyTextures);
  document.addEventListener('proper:lang', applyTextures);

  // walls (dark cylinder) + ceiling light rings
  const wallMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.4, R + 0.4, 6, 64, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x0a1424, side: THREE.BackSide }),
  );
  wallMesh.position.y = 2;
  room.add(wallMesh);
  [[R - 0.5, 4.3, COLORS.teal], [R - 1.2, 4.45, COLORS.copper]].forEach(([r, y, c]) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 8, 200), new THREE.MeshBasicMaterial({ color: c }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    room.add(ring);
  });
  // floor emblem rings
  const emblem = new THREE.Group();
  [0.9, 1.25, 1.6].forEach((r, i) => {
    const m = new THREE.Mesh(new THREE.RingGeometry(r, r + (i === 1 ? 0.05 : 0.02), 96, 1, 0, Math.PI * (i === 1 ? 1.4 : 2)),
      new THREE.MeshBasicMaterial({ color: i === 1 ? COLORS.copper : COLORS.teal, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2;
    emblem.add(m);
  });
  emblem.position.y = 0.01;
  scene.add(emblem);
  const floor = gridFloor(40, COLORS.brand, COLORS.teal, R + 1);
  scene.add(floor);
  const dust = dustPoints(isSmall() ? 250 : 600, [-R, R, 0, 4.5, -R, R], 0xbfe9ff, 0.035);
  scene.add(dust);

  let { composer, bloom } = makeComposer(renderer, scene, camera, 1, 1, 0.7, 0.55);
  const layout = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    camera.fov = w < 760 ? 78 : 62;
    camera.updateProjectionMatrix();
  };
  layout();
  window.addEventListener('resize', layout);

  /* --- Look-around controls --- */
  let yaw = 0, yawTarget = 0, pitch = 0, pitchTarget = 0, vel = 0;
  let dragging = false, moved = 0, lastX = 0, lastY = 0, idle = 0;
  const pointer = new THREE.Vector2(-10, -10);
  const ray = new THREE.Raycaster();
  let hovered = null;

  stage.addEventListener('pointerdown', (e) => {
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; vel = 0;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    const k = 0.0042 * (60 / camera.fov);
    yawTarget -= dx * k;
    vel = -dx * k;
    pitchTarget = THREE.MathUtils.clamp(pitchTarget + dy * k * 0.6, -0.25, 0.25);
    idle = 0;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    if (moved < 6 && hovered) P.openProject(hovered.userData.id);
    try { stage.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', () => { if (!dragging) pointer.set(-10, -10); });

  const stepTo = (dir) => {
    const s = (Math.PI * 2) / N;
    yawTarget = Math.round(yawTarget / s) * s + dir * s;
    vel = 0; idle = 0;
  };
  // In RTL the visual direction of "next" flips
  document.getElementById('showroomPrev')?.addEventListener('click', () => stepTo(isRTL() ? 1 : -1) );
  document.getElementById('showroomNext')?.addEventListener('click', () => stepTo(isRTL() ? -1 : 1));
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { stepTo(-1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { stepTo(1); e.preventDefault(); }
    if (e.key === 'Enter') {
      const s = (Math.PI * 2) / N;
      const i = ((Math.round(yaw / s) % N) + N) % N;
      P.openProject(projects[i].id);
    }
  });

  const speed = reduceMotion ? 0 : 1;
  visibilityLoop(stage, (dt, now) => {
    idle += dt;
    if (!dragging) {
      yawTarget += vel;
      vel *= 0.92;
      if (idle > 3 && speed) yawTarget -= dt * 0.06; // gentle auto-rotate
      pitchTarget *= 0.97;
    }
    yaw += (yawTarget - yaw) * 0.08;
    pitch += (pitchTarget - pitch) * 0.08;
    // Panel i sits at angle a = i·2π/N; the camera faces it when yaw = a.
    camera.rotation.set(pitch, -yaw, 0);

    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects(panels.map((p) => p.userData.screen));
    const h = hits.length ? hits[0].object : null;
    if (h !== hovered) {
      hovered = h;
      stage.style.cursor = h ? 'pointer' : '';
      if (h) {
        const p = projects[h.userData.index];
        const L = p[lang()] || p.en;
        label.textContent = L.t;
        label.classList.add('is-on');
      } else label.classList.remove('is-on');
    }
    panels.forEach((g) => {
      const s = g.userData.screen;
      s.userData.hover += ((s === hovered ? 1 : 0) - s.userData.hover) * 0.12;
      const k = s.userData.hover;
      g.scale.setScalar(1 + k * 0.05);
      s.material.color.setScalar(0.58 + k * 0.2);
      g.userData.glow.scale.x = 0.5 + k * 0.5;
    });
    emblem.rotation.y += dt * 0.2 * (speed || 0.2);
    floor.material.uniforms.uTime.value = now;
    updateDust(dust, dt * (speed || 0.2));
    composer.render();
  });
}

/* =========================================================
   Boot
   ========================================================= */
function boot() {
  if (!webglAvailable()) {
    document.documentElement.classList.add('no-3d');
    return;
  }
  document.documentElement.classList.add('has-webgl');
  initHero().catch((e) => console.warn('Hero 3D disabled:', e));
  initShowroom().catch((e) => console.warn('Showroom 3D disabled:', e));
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
