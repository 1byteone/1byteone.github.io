import * as THREE from "./vendor/three.module.min.js";

const canvas = document.querySelector("[data-ep-cape-viewer]");
if (canvas) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
  camera.position.set(0, 1.65, 4.65);
  camera.lookAt(0, 1.28, 0);
  scene.add(new THREE.HemisphereLight(0xb9f5d0, 0x101b14, 2.1));
  const key = new THREE.DirectionalLight(0xd7ffd7, 2.6);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x72f0a8, 2.2);
  rim.position.set(3, 3, -4);
  scene.add(rim);

  const player = new THREE.Group();
  const torso = new THREE.Group();
  scene.add(player);
  player.add(torso);

  const block = (width, height, depth, color, x, y, z, parent = torso) => {
    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, depth));
    const mesh = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x315f44, transparent: true, opacity: 0.82 }));
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };

  block(0.68, 0.68, 0.65, 0xc58d68, 0, 2.13, 0);
  block(0.7, 0.86, 0.38, 0x3476a4, 0, 1.36, 0);
  block(0.74, 0.12, 0.4, 0x2c5c82, 0, 0.91, 0);

  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  leftArm.position.set(-0.52, 1.73, 0);
  rightArm.position.set(0.52, 1.73, 0);
  torso.add(leftArm, rightArm);
  block(0.29, 0.9, 0.38, 0x3476a4, 0, -0.39, 0, leftArm);
  block(0.29, 0.9, 0.38, 0x3476a4, 0, -0.39, 0, rightArm);
  block(0.29, 0.2, 0.38, 0xc58d68, 0, -0.82, 0, leftArm);
  block(0.29, 0.2, 0.38, 0xc58d68, 0, -0.82, 0, rightArm);

  const leftLeg = new THREE.Group();
  const rightLeg = new THREE.Group();
  leftLeg.position.set(-0.18, 0.91, 0);
  rightLeg.position.set(0.18, 0.91, 0);
  torso.add(leftLeg, rightLeg);
  block(0.32, 0.82, 0.38, 0x59478c, 0, -0.41, 0, leftLeg);
  block(0.32, 0.82, 0.38, 0x59478c, 0, -0.41, 0, rightLeg);
  block(0.34, 0.18, 0.42, 0x292f39, 0, -0.82, 0.025, leftLeg);
  block(0.34, 0.18, 0.42, 0x292f39, 0, -0.82, 0.025, rightLeg);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.15, 48),
    new THREE.MeshBasicMaterial({ color: 0x72f0a8, transparent: true, opacity: 0.12 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  scene.add(shadow);

  const capeCanvas = document.createElement("canvas");
  const capeContext = capeCanvas.getContext("2d", { alpha: true });
  capeCanvas.width = 176;
  capeCanvas.height = 136;
  const capeTexture = new THREE.CanvasTexture(capeCanvas);
  capeTexture.colorSpace = THREE.SRGBColorSpace;
  capeTexture.magFilter = THREE.NearestFilter;
  capeTexture.minFilter = THREE.NearestFilter;
  const capeMaterial = new THREE.MeshBasicMaterial({ map: capeTexture, transparent: true, side: THREE.DoubleSide });
  const rows = 12;
  const columns = 8;
  const capeGeometry = new THREE.PlaneGeometry(1.05, 1.52, columns, rows);
  const cape = new THREE.Mesh(capeGeometry, capeMaterial);
  cape.position.set(0, 1.46, 0.28);
  cape.rotation.x = -0.1;
  torso.add(cape);

  let sourceImage;
  let animation = { frametime: 3, width: 176, height: 136, frames: null };
  let frameOrder = [0];
  let activeFrame = -1;
  let frameCount = 1;
  let pose = "stand";
  let yaw = 0.18;
  let pitch = 0;
  let dragging = false;
  let previousX = 0;
  let previousY = 0;
  let raf = 0;
  const frameCounter = document.querySelector("[data-ep-cape-frame-count]");

  const renderFrame = (index) => {
    if (!sourceImage || !capeContext) return;
    const width = Math.min(animation.width || sourceImage.naturalWidth, sourceImage.naturalWidth);
    const height = Math.min(animation.height || sourceImage.naturalHeight, sourceImage.naturalHeight);
    const rowsInAtlas = Math.max(1, Math.floor(sourceImage.naturalHeight / height));
    const atlasColumns = Math.max(1, Math.floor(sourceImage.naturalWidth / width));
    const faceWidth = Math.max(1, Math.floor(width / 2));
    const atlasIndex = frameOrder[index % frameOrder.length];
    const sx = (atlasIndex % atlasColumns) * width;
    const sy = Math.floor(atlasIndex / atlasColumns) * height;
    if (activeFrame === atlasIndex) return;
    capeCanvas.width = faceWidth;
    capeCanvas.height = height;
    capeContext.imageSmoothingEnabled = false;
    capeContext.clearRect(0, 0, capeCanvas.width, capeCanvas.height);
    capeContext.drawImage(sourceImage, sx, sy, faceWidth, height, 0, 0, faceWidth, height);
    capeTexture.needsUpdate = true;
    activeFrame = atlasIndex;
    frameCount = frameOrder.length || rowsInAtlas * atlasColumns;
    if (frameCounter) frameCounter.textContent = String(frameCount).padStart(2, "0");
  };

  const loadCape = (textureUrl, animationData = {}) => {
    if (!textureUrl) return;
    canvas.dataset.capeLoadState = "loading";
    sourceImage = new Image();
    sourceImage.decoding = "async";
    sourceImage.onload = () => {
      animation = { frametime: 3, width: sourceImage.naturalWidth, height: sourceImage.naturalWidth, frames: null, ...animationData };
      const cellHeight = animation.height || animation.width || sourceImage.naturalWidth;
      const atlasCount = Math.max(1, Math.floor(sourceImage.naturalWidth / (animation.width || sourceImage.naturalWidth)) * Math.floor(sourceImage.naturalHeight / cellHeight));
      frameOrder = Array.isArray(animation.frames) && animation.frames.length
        ? animation.frames.map((frame) => typeof frame === "number" ? frame : frame.index).filter(Number.isInteger)
        : Array.from({ length: atlasCount }, (_, index) => index);
      if (!frameOrder.length) frameOrder = [0];
      activeFrame = -1;
      canvas.dataset.capeLoadState = `ready:${sourceImage.naturalWidth}x${sourceImage.naturalHeight}`;
      renderFrame(0);
      capeTexture.needsUpdate = true;
    };
    sourceImage.onerror = () => { canvas.dataset.capeLoadState = "error"; };
    sourceImage.src = textureUrl;
  };

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  const readAnimation = (value) => {
    try { return JSON.parse(value || "{}"); } catch { return {}; }
  };
  loadCape(canvas.dataset.texture, readAnimation(canvas.dataset.animation));

  canvas.addEventListener("ep:cape-texture", (event) => {
    loadCape(event.detail?.texture, event.detail?.animation || {});
  });
  canvas.addEventListener("ep:cape-pose", (event) => { pose = event.detail?.pose === "walk" ? "walk" : "stand"; });
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    yaw += (event.clientX - previousX) * 0.009;
    pitch = THREE.MathUtils.clamp(pitch + (event.clientY - previousY) * 0.006, -0.42, 0.42);
    previousX = event.clientX;
    previousY = event.clientY;
  });
  const stopDrag = (event) => {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);

  const startedAt = performance.now();
  const draw = (now) => {
    const elapsed = now - startedAt;
    const frameDuration = Math.max(1, animation.frametime || 3) * 50;
    const frameIndex = Math.floor(elapsed / frameDuration) % frameOrder.length;
    renderFrame(frameIndex);
    const stride = pose === "walk" ? Math.sin(elapsed / 170) * 0.58 : 0;
    leftArm.rotation.x = -stride;
    rightArm.rotation.x = stride;
    leftLeg.rotation.x = stride;
    rightLeg.rotation.x = -stride;
    cape.rotation.x = -0.1 + Math.sin(elapsed / 440) * (pose === "walk" ? 0.14 : 0.055);
    cape.rotation.z = Math.sin(elapsed / 370) * (pose === "walk" ? 0.07 : 0.025);
    player.rotation.y = yaw + (dragging ? 0 : Math.sin(elapsed / 3200) * 0.035);
    player.rotation.x = pitch;
    const positions = capeGeometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const progress = (1 - (y + 0.67) / 1.34);
      positions.setZ(index, progress * (Math.sin(elapsed / 390 + x * 3.6) * (pose === "walk" ? 0.16 : 0.08) + progress * 0.12));
    }
    positions.needsUpdate = true;
    capeGeometry.computeVertexNormals();
    renderer.render(scene, camera);
    if (!reducedMotion || dragging) raf = requestAnimationFrame(draw);
  };
  draw(performance.now());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reducedMotion) raf = requestAnimationFrame(draw);
  });
  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    capeGeometry.dispose();
    capeTexture.dispose();
    renderer.dispose();
  }, { once: true });
}
