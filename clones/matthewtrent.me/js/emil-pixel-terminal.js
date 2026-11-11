(() => {
  const body = document.body;
  if (!body?.classList.contains("emil-pixel-terminal")) return;

  const isHome = body.classList.contains("ep-home-page");
  const canvas = document.querySelector("[data-ep-canvas]");
  const ctx = canvas?.getContext("2d");
  const asciiCanvas = document.createElement("canvas");
  const asciiCtx = asciiCanvas.getContext("2d");
  const glowCanvas = document.querySelector("[data-ep-glow-canvas]");
  const glowCtx = glowCanvas?.getContext("2d");
  const signalCanvas = document.querySelector("[data-ep-signal-canvas]");
  const signalCtx = signalCanvas?.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fxButton = document.querySelector("[data-ep-fx]");
  const logicalPixel = 4;
  let particles = [];
  let glowParticles = [];
  let signalParticles = [];
  let frame = 0;
  let asciiRenderedAt = -Infinity;
  let audioContext;

  let fxMuted = false;
  try { fxMuted = localStorage.getItem("emil-pixel-fx-muted") === "true"; } catch {}
  body.classList.toggle("is-ep-fx-muted", fxMuted);
  fxButton?.setAttribute("aria-pressed", String(!fxMuted));
  fxButton?.addEventListener("click", () => {
    fxMuted = !fxMuted;
    body.classList.toggle("is-ep-fx-muted", fxMuted);
    fxButton.setAttribute("aria-pressed", String(!fxMuted));
    try { localStorage.setItem("emil-pixel-fx-muted", String(fxMuted)); } catch {}
  });

  const seed = (value) => { const x = Math.sin(value * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const createParticles = (width, height) => Array.from({ length: Math.min(480, Math.floor(width * height / 240)) }, (_, index) => ({ x: seed(index + 1) * width, y: seed(index + 801) * height, speed: .0005 + seed(index + 1601) * .004, phase: seed(index + 2401) * Math.PI * 2, size: seed(index + 3201) > .9 ? 2 : 1, tone: seed(index + 4001) > .78 ? "rgba(224,239,231,.72)" : "rgba(114,240,168,.58)" }));
  const drawAsciiCloud = (x, y, columns, rows, time, seedOffset) => {
    if (!asciiCtx) return;
    const chars = " .,:;~=+*#%@";
    asciiCtx.font = `${Math.max(1.7, Math.min(2.8, asciiCanvas.width / 105))}px ep-mono, monospace`;
    asciiCtx.textBaseline = "top";
    for (let row = 0; row < rows; row += 1) {
      let line = "";
      for (let col = 0; col < columns; col += 1) {
        const wave = Math.sin((col + seedOffset) * .41 + time / 1350) + Math.cos((row + seedOffset) * .47 - time / 1700);
        const mask = wave + (seed(col + row * columns + seedOffset) - .5) * .8;
        line += mask > .12 ? chars[Math.floor(seed(col * 9 + row * 5 + seedOffset) * chars.length)] : " ";
      }
      asciiCtx.globalAlpha = .3 + .38 * ((Math.sin(time / 1450 + row * .24 + seedOffset) + 1) / 2);
      asciiCtx.fillStyle = seed(row + seedOffset * 17) > .78 ? "rgba(220,235,225,.74)" : "rgba(114,240,168,.72)";
      asciiCtx.fillText(line, x, y + row * 2.6);
    }
    asciiCtx.globalAlpha = 1;
  };
  const resizeCanvas = () => {
    if (canvas && ctx) {
      canvas.width = Math.max(1, Math.ceil(innerWidth / logicalPixel));
      canvas.height = Math.max(1, Math.ceil(innerHeight / logicalPixel));
      asciiCanvas.width = canvas.width;
      asciiCanvas.height = canvas.height;
      asciiRenderedAt = -Infinity;
      particles = createParticles(canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    if (glowCanvas && glowCtx) {
      glowCanvas.width = Math.max(1, Math.ceil(innerWidth));
      glowCanvas.height = Math.max(1, Math.ceil(innerHeight));
      glowParticles = Array.from({ length: 28 }, (_, index) => ({ x: seed(index + 5101) * glowCanvas.width, y: seed(index + 5201) * glowCanvas.height, radius: .55 + seed(index + 5301) * 1.05, phase: seed(index + 5401) * Math.PI * 2, speed: .001 + seed(index + 5501) * .003, warm: seed(index + 5601) > .9 }));
      glowCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
    if (signalCanvas && signalCtx) {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      signalCanvas.width = Math.max(1, Math.ceil(innerWidth * ratio));
      signalCanvas.height = Math.max(1, Math.ceil(innerHeight * ratio));
      signalCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      signalParticles = Array.from({ length: Math.min(260, Math.floor(innerWidth * innerHeight / 7000)) }, (_, index) => ({ x: seed(index + 6101) * innerWidth, y: seed(index + 6201) * innerHeight, phase: seed(index + 6301) * Math.PI * 2, size: seed(index + 6401) > .84 ? 3 : 1, drift: .35 + seed(index + 6501) * 2.2, warm: seed(index + 6601) > .74 }));
    }
  };
  const drawGlow = (time) => {
    if (!glowCanvas || !glowCtx) return;
    const width = glowCanvas.width;
    const height = glowCanvas.height;
    glowCtx.clearRect(0, 0, width, height);
    glowParticles.forEach((particle) => {
      const x = (particle.x + time * particle.speed / 12) % width;
      const y = particle.y + Math.sin(time / 1150 + particle.phase) * 2;
      const pulse = .1 + .1 * ((Math.sin(time / 760 + particle.phase) + 1) / 2);
      const color = particle.warm ? `rgba(255,140,178,${pulse * .35})` : `rgba(114,240,168,${pulse})`;
      const glow = glowCtx.createRadialGradient(x, y, 0, x, y, particle.radius);
      glow.addColorStop(0, color);
      glow.addColorStop(1, "rgba(114,240,168,0)");
      glowCtx.fillStyle = glow;
      glowCtx.fillRect(x - particle.radius, y - particle.radius, particle.radius * 2, particle.radius * 2);
    });
  };
  const drawSignals = (time) => {
    if (!signalCanvas || !signalCtx) return;
    signalCtx.clearRect(0, 0, innerWidth, innerHeight);
    signalParticles.forEach((particle, index) => {
      const x = (particle.x + Math.sin(time / 1800 + particle.phase) * particle.drift + innerWidth) % innerWidth;
      const y = (particle.y + Math.cos(time / 2100 + particle.phase) * 2 + innerHeight) % innerHeight;
      const blink = Math.max(0, Math.sin(time / (particle.size > 1 ? 370 : 690) + particle.phase));
      if (blink < .78) return;
      const color = particle.warm ? "224,239,231" : "114,240,168";
      signalCtx.globalAlpha = (blink - .78) * (particle.size > 1 ? .44 : .3);
      signalCtx.fillStyle = `rgb(${color})`;
      signalCtx.fillRect(Math.round(x), Math.round(y), particle.size, particle.size);
      if (particle.size > 1 || index % 13 === 0) {
        signalCtx.fillRect(Math.round(x - 3), Math.round(y), particle.size + 6, 1);
        signalCtx.fillRect(Math.round(x), Math.round(y - 3), 1, particle.size + 6);
      }
    });
    signalCtx.globalAlpha = 1;
    const bandY = (time * .018) % Math.max(1, innerHeight);
    signalCtx.fillStyle = "rgba(114,240,168,.018)";
    signalCtx.fillRect(0, bandY, innerWidth, 1);
  };
  const drawBackground = (time = 0) => {
    if (canvas && ctx) {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#030806";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(114,240,168,.065)";
      for (const x of [Math.floor(width * .03), Math.floor(width * .5), Math.floor(width * .97)]) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      ctx.strokeStyle = "rgba(114,240,168,.025)";
      for (let y = 0; y < height; y += 2) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(width, y + .5); ctx.stroke(); }
      for (const particle of particles) { const x = (particle.x + time * particle.speed) % width; const y = (particle.y + Math.sin(time / 900 + particle.phase) * 1.5 + height) % height; const blink = .25 + .75 * ((Math.sin(time / 420 + particle.phase) + 1) / 2); ctx.globalAlpha = blink; ctx.fillStyle = particle.tone; ctx.fillRect(Math.floor(x), Math.floor(y), particle.size, particle.size); }
      ctx.globalAlpha = 1;
      if (time - asciiRenderedAt >= 120) {
        asciiCtx?.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);
        drawAsciiCloud(Math.max(0, Math.floor(width * .6)), 2, Math.min(58, Math.floor(width * .4)), Math.min(48, Math.floor(height * .46)), time, 37);
        drawAsciiCloud(2, Math.max(8, Math.floor(height * .32)), Math.min(50, Math.floor(width * .36)), Math.min(70, Math.floor(height * .72)), time, 11);
        drawAsciiCloud(Math.floor(width * .38), Math.floor(height * .68), Math.min(78, Math.floor(width * .5)), Math.min(40, Math.floor(height * .4)), time, 83);
        asciiRenderedAt = time;
      }
      if (asciiCtx) { ctx.imageSmoothingEnabled = false; ctx.drawImage(asciiCanvas, 0, 0); }
    }
    drawGlow(time);
    drawSignals(time);
    if (isHome && state.active) drawArt(menu[state.selected]?.dataset.epTarget || "minecraft", time);
    if (!reducedMotion) frame = requestAnimationFrame(drawBackground);
  };

  const artCanvas = document.querySelector("[data-ep-art-canvas]");
  const artCtx = artCanvas?.getContext("2d");
  const homeArt = document.querySelector("[data-ep-home-art]");
  const artStage = document.querySelector("[data-ep-art-stage]");
  const artCode = document.querySelector("[data-ep-art-code]");
  const artHint = document.querySelector("[data-ep-art-hint]");
  const pixelPalette = { ink: "rgba(114,240,168,.82)", bright: "rgba(203,243,106,.94)", dim: "rgba(114,240,168,.27)", faint: "rgba(114,240,168,.11)", pink: "rgba(255,140,178,.72)" };
  const strokeLine = (points, color = pixelPalette.ink, width = 3) => { artCtx.strokeStyle = color; artCtx.lineWidth = width; artCtx.beginPath(); points.forEach(([x, y], index) => index ? artCtx.lineTo(x, y) : artCtx.moveTo(x, y)); artCtx.stroke(); };
  const pixelBox = (x, y, width, height, color = pixelPalette.ink, fill = false, line = 3) => { artCtx.strokeStyle = color; artCtx.fillStyle = color; artCtx.lineWidth = line; fill ? artCtx.fillRect(x, y, width, height) : artCtx.strokeRect(x, y, width, height); };
  const hatch = (x, y, width, height, step = 16, color = pixelPalette.faint) => { artCtx.strokeStyle = color; artCtx.lineWidth = 1; for (let offset = -height; offset < width; offset += step) { artCtx.beginPath(); artCtx.moveTo(x + Math.max(offset, 0), y + Math.max(-offset, 0)); artCtx.lineTo(x + Math.min(offset + height, width), y + Math.min(height, height + offset)); artCtx.stroke(); } };
  const drawGrid = (x, y, width, height, columns, rows, color = pixelPalette.faint) => { artCtx.strokeStyle = color; artCtx.lineWidth = 2; for (let col = 1; col < columns; col += 1) { const px = x + width * col / columns; artCtx.beginPath(); artCtx.moveTo(px, y); artCtx.lineTo(px, y + height); artCtx.stroke(); } for (let row = 1; row < rows; row += 1) { const py = y + height * row / rows; artCtx.beginPath(); artCtx.moveTo(x, py); artCtx.lineTo(x + width, py); artCtx.stroke(); } };
  const drawCube = (x, y, size, depth, color = pixelPalette.ink) => { strokeLine([[x, y], [x + size, y], [x + size, y + size], [x, y + size], [x, y]], color); strokeLine([[x + size, y], [x + size + depth, y - depth * .52], [x + size + depth, y + size - depth * .52], [x + size, y + size]], color); strokeLine([[x, y], [x + depth, y - depth * .52], [x + size + depth, y - depth * .52]], color); };
  const drawInventory = (time) => {
    pixelBox(108, 72, 474, 420, pixelPalette.dim, false, 4); pixelBox(126, 90, 438, 34, pixelPalette.ink, false, 2); pixelBox(126, 136, 205, 200, pixelPalette.dim, false, 2); pixelBox(344, 136, 202, 200, pixelPalette.dim, false, 2); pixelBox(126, 352, 420, 114, pixelPalette.ink, false, 2);
    drawGrid(145, 153, 168, 166, 4, 4); drawGrid(364, 153, 162, 166, 3, 3); drawGrid(145, 369, 382, 78, 9, 2);
    pixelBox(145, 108, 58, 5, pixelPalette.bright, true); pixelBox(217, 108, 94, 5, pixelPalette.dim, true); pixelBox(384, 108, 74, 5, pixelPalette.dim, true);
    drawCube(178, 184, 42, 10, pixelPalette.bright); drawCube(257, 238, 29, 8, pixelPalette.ink); pixelBox(405, 184, 25, 39, pixelPalette.pink, true); pixelBox(455, 205, 24, 24, pixelPalette.bright, true); pixelBox(496, 245, 18, 31, pixelPalette.ink, true);
    const pulse = 0.45 + Math.sin(time / 220) * .2; artCtx.strokeStyle = `rgba(203,243,106,${pulse})`; artCtx.lineWidth = 2; artCtx.beginPath(); artCtx.arc(497, 174, 14 + Math.sin(time / 300) * 2, 0, Math.PI * 2); artCtx.stroke();
    strokeLine([[425, 393], [439, 407], [425, 421], [428, 408], [412, 408], [425, 393]], pixelPalette.bright, 3);
  };
  const drawDocument = (time) => {
    pixelBox(148, 60, 404, 472, pixelPalette.ink, false, 4); pixelBox(173, 86, 354, 48, pixelPalette.bright, false, 3); pixelBox(173, 157, 245, 9, pixelPalette.ink, true); pixelBox(173, 183, 310, 7, pixelPalette.dim, true); pixelBox(173, 207, 282, 7, pixelPalette.dim, true); pixelBox(173, 231, 215, 7, pixelPalette.dim, true); pixelBox(173, 275, 354, 170, pixelPalette.dim, false, 2); drawGrid(193, 298, 314, 124, 7, 4); hatch(173, 275, 354, 170, 21); pixelBox(173, 469, 106, 13, pixelPalette.lime || pixelPalette.bright, true); pixelBox(295, 469, 72, 13, pixelPalette.pink, true); pixelBox(383, 469, 144, 13, pixelPalette.dim, true);
    const scanY = 145 + ((time / 8) % 335); artCtx.fillStyle = "rgba(203,243,106,.18)"; artCtx.fillRect(161, scanY, 378, 2);
  };
  const drawLab = (time) => {
    pixelBox(104, 92, 492, 352, pixelPalette.ink, false, 4); pixelBox(128, 116, 210, 132, pixelPalette.dim, false, 2); pixelBox(358, 116, 214, 132, pixelPalette.dim, false, 2); pixelBox(128, 273, 444, 145, pixelPalette.dim, false, 2); drawGrid(145, 136, 176, 92, 8, 4); drawGrid(377, 135, 176, 93, 8, 4);
    artCtx.strokeStyle = pixelPalette.bright; artCtx.lineWidth = 2; artCtx.beginPath(); for (let x = 149; x < 544; x += 13) { const y = 377 - Math.sin((x + time / 7) / 33) * 38 - Math.cos(x / 21) * 12; x === 149 ? artCtx.moveTo(x, y) : artCtx.lineTo(x, y); } artCtx.stroke();
    for (let index = 0; index < 9; index += 1) { const height = 22 + ((index * 17 + Math.floor(time / 200)) % 7) * 8; pixelBox(151 + index * 42, 405 - height, 18, height, index % 3 === 0 ? pixelPalette.bright : pixelPalette.ink, true); }
    pixelBox(116, 462, 42, 16, pixelPalette.pink, true); pixelBox(170, 462, 42, 16, pixelPalette.bright, true); pixelBox(224, 462, 42, 16, pixelPalette.ink, true);
  };
  const drawProfile = (time) => {
    strokeLine([[350, 58], [528, 130], [528, 468], [350, 540], [172, 468], [172, 130], [350, 58]], pixelPalette.ink, 4); strokeLine([[208, 146], [350, 94], [492, 146], [492, 432], [350, 494], [208, 432], [208, 146]], pixelPalette.dim, 2); pixelBox(266, 166, 168, 112, pixelPalette.bright, false, 3); pixelBox(292, 310, 116, 70, pixelPalette.ink, false, 3);
    artCtx.fillStyle = pixelPalette.bright; artCtx.fillRect(300, 197, 24, 24); artCtx.fillRect(376, 197, 24, 24); pixelBox(333, 231, 34, 10, pixelPalette.pink, true); strokeLine([[322, 334], [350, 348 + Math.sin(time / 300) * 4], [378, 334]], pixelPalette.bright, 3); for (let i = 0; i < 5; i += 1) pixelBox(240 + i * 55, 420, 23, 8, i % 2 ? pixelPalette.ink : pixelPalette.bright, true);
  };
  const drawThemeGallery = (time) => {
    pixelBox(94, 74, 512, 420, pixelPalette.ink, false, 4); pixelBox(94, 74, 512, 42, pixelPalette.bright, false, 2); pixelBox(116, 91, 12, 8, pixelPalette.pink, true); pixelBox(136, 91, 12, 8, pixelPalette.bright, true); pixelBox(156, 91, 12, 8, pixelPalette.ink, true); pixelBox(198, 91, 172, 6, pixelPalette.dim, true); const cards = [[120,143,pixelPalette.bright],[294,143,pixelPalette.ink],[468,143,pixelPalette.pink],[120,307,pixelPalette.ink],[294,307,pixelPalette.bright],[468,307,pixelPalette.ink]]; cards.forEach(([x,y,color], index) => { pixelBox(x, y, 142, 126, color, false, 2); pixelBox(x + 13, y + 15, 116, 52, color, false, 2); pixelBox(x + 13, y + 80, 62 + index * 7, 6, color, true); }); artCtx.strokeStyle = `rgba(203,243,106,${.4 + Math.sin(time / 320) * .2})`; artCtx.beginPath(); artCtx.arc(540, 440, 24, 0, Math.PI * 2); artCtx.stroke();
  };
  const project3D = (point, yaw, pitch) => {
    const [x, y, z] = point;
    const cosYaw = Math.cos(yaw); const sinYaw = Math.sin(yaw);
    const rotatedX = x * cosYaw + z * sinYaw;
    const rotatedZ = -x * sinYaw + z * cosYaw;
    const cosPitch = Math.cos(pitch); const sinPitch = Math.sin(pitch);
    const rotatedY = y * cosPitch - rotatedZ * sinPitch;
    const depth = y * sinPitch + rotatedZ * cosPitch;
    const perspective = 620 / Math.max(330, 620 - depth);
    return [350 + rotatedX * perspective, 310 + rotatedY * perspective];
  };
  const draw3DPath = (points, yaw, pitch, color, width = 3, close = false) => {
    if (!points.length) return;
    const projected = points.map((point) => project3D(point, yaw, pitch));
    artCtx.strokeStyle = color; artCtx.lineWidth = width; artCtx.beginPath(); artCtx.moveTo(projected[0][0], projected[0][1]);
    for (let index = 1; index < projected.length; index += 1) artCtx.lineTo(projected[index][0], projected[index][1]);
    if (close) artCtx.closePath();
    artCtx.stroke();
  };
  const draw3DPolygon = (points, yaw, pitch, fill, stroke) => {
    const projected = points.map((point) => project3D(point, yaw, pitch));
    artCtx.fillStyle = fill; artCtx.strokeStyle = stroke; artCtx.lineWidth = 3; artCtx.beginPath(); artCtx.moveTo(projected[0][0], projected[0][1]);
    for (let index = 1; index < projected.length; index += 1) artCtx.lineTo(projected[index][0], projected[index][1]);
    artCtx.closePath(); artCtx.fill(); artCtx.stroke();
  };
  const draw3DBox = (x, y, z, width, height, depth, yaw, pitch, color = pixelPalette.ink) => {
    const x0 = x - width / 2; const x1 = x + width / 2; const y0 = y - height / 2; const y1 = y + height / 2; const z0 = z - depth / 2; const z1 = z + depth / 2;
    const top = [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]];
    const right = [[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]];
    const front = [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
    draw3DPolygon(top, yaw, pitch, "rgba(114,240,168,.075)", color);
    draw3DPolygon(right, yaw, pitch, "rgba(114,240,168,.035)", "rgba(114,240,168,.64)");
    draw3DPolygon(front, yaw, pitch, "rgba(3,8,6,.56)", color);
    draw3DPath([[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z0]], yaw, pitch, "rgba(114,240,168,.4)", 2);
  };
  const draw3DRect = (x, y, z, width, height, yaw, pitch, color = pixelPalette.ink, fill = false) => {
    const points = [[x-width/2,y-height/2,z],[x+width/2,y-height/2,z],[x+width/2,y+height/2,z],[x-width/2,y+height/2,z]];
    if (fill) draw3DPolygon(points, yaw, pitch, color, color); else draw3DPath([...points, points[0]], yaw, pitch, color, 3);
  };
  const draw3DFloor = (yaw, pitch, time) => {
    const floorY = 196;
    for (let x = -300; x <= 300; x += 50) draw3DPath([[x,floorY,-240],[x,floorY,240]], yaw, pitch, "rgba(114,240,168,.12)", 2);
    for (let z = -240; z <= 240; z += 48) draw3DPath([[-300,floorY,z],[300,floorY,z]], yaw, pitch, "rgba(114,240,168,.12)", 2);
    const orbit = [];
    for (let index = 0; index <= 48; index += 1) { const angle = index / 48 * Math.PI * 2; orbit.push([Math.cos(angle) * 230, 96 + Math.sin(angle) * 11, Math.sin(angle) * 116]); }
    draw3DPath(orbit, yaw, pitch, `rgba(203,243,106,${.25 + .12 * Math.sin(time / 500)})`, 2);
  };
  const draw3DScene = (mode, time) => {
    const yaw = state.artYaw + time / 7000;
    const pitch = state.artPitch + Math.sin(time / 4200) * .035;
    draw3DFloor(yaw, pitch, time);
    if (mode === "work") {
      draw3DBox(0, 18, 0, 290, 244, 66, yaw, pitch, pixelPalette.ink);
      draw3DRect(0, -8, 35, 236, 151, yaw, pitch, pixelPalette.bright);
      for (let col = -3; col <= 3; col += 1) draw3DPath([[col*31,-80,37],[col*31,64,37]],yaw,pitch,"rgba(114,240,168,.3)",2);
      for (let row = -1; row <= 2; row += 1) draw3DPath([[-108,-57+row*33,37],[108,-57+row*33,37]],yaw,pitch,"rgba(114,240,168,.3)",2);
      draw3DBox(-50, -24, 42, 31, 31, 20, yaw, pitch, pixelPalette.bright); draw3DBox(4, 12, 43, 25, 25, 19, yaw, pitch, pixelPalette.pink); draw3DBox(69, 52, 43, 29, 24, 18, yaw, pitch, pixelPalette.ink);
      draw3DBox(0, 159, 0, 110, 26, 76, yaw, pitch, pixelPalette.dim);
    } else if (mode === "notes") {
      draw3DBox(0, 15, 0, 232, 294, 38, yaw, pitch, pixelPalette.ink);
      draw3DRect(0, 15, 21, 194, 252, yaw, pitch, pixelPalette.bright);
      draw3DPath([[0,-111,23],[0,141,23]],yaw,pitch,pixelPalette.dim,3);
      for (let row = 0; row < 7; row += 1) draw3DPath([[-82,-82+row*28,23],[76,-82+row*28,23]],yaw,pitch,row === 0 ? pixelPalette.bright : pixelPalette.dim, row === 0 ? 5 : 2);
      draw3DBox(24, 48, 30, 87, 73, 15, yaw, pitch, pixelPalette.pink);
      for (let index = 0; index < 5; index += 1) draw3DBox(-53+index*25, 124, 27, 12, 20+(index%3)*12, 10, yaw, pitch, index === 3 ? pixelPalette.bright : pixelPalette.ink);
    } else if (mode === "lab") {
      draw3DBox(0, 14, 0, 304, 238, 68, yaw, pitch, pixelPalette.ink);
      draw3DRect(0, -15, 36, 250, 151, yaw, pitch, pixelPalette.dim);
      for (let index = 0; index < 10; index += 1) draw3DPath([[-105+index*23,54,39],[-105+index*23,54-18-(index%4)*15,39]],yaw,pitch,index===7?pixelPalette.bright:pixelPalette.ink,5);
      const trace=[]; for(let index=0;index<=24;index+=1){const x=-108+index*9;const y=8+Math.sin(index*.72+time/430)*30+Math.sin(index*.22)*12;trace.push([x,y,40]);} draw3DPath(trace,yaw,pitch,pixelPalette.bright,4);
      draw3DBox(0, 156, 0, 120, 23, 88, yaw, pitch, pixelPalette.dim);
    } else if (mode === "about") {
      draw3DBox(0, -103, 0, 92, 92, 84, yaw, pitch, pixelPalette.bright);
      draw3DBox(0, 5, 0, 122, 118, 64, yaw, pitch, pixelPalette.ink);
      draw3DBox(-82, 7, 0, 37, 104, 42, yaw, pitch, pixelPalette.dim); draw3DBox(82, 7, 0, 37, 104, 42, yaw, pitch, pixelPalette.dim);
      draw3DBox(-39, 116, 0, 40, 100, 48, yaw, pitch, pixelPalette.ink); draw3DBox(39, 116, 0, 40, 100, 48, yaw, pitch, pixelPalette.ink);
      draw3DRect(-22,-112,44,13,13,yaw,pitch,pixelPalette.pink,true); draw3DRect(22,-112,44,13,13,yaw,pitch,pixelPalette.pink,true);
      const capeWave=Math.sin(time/230)*17; draw3DPath([[-55,-36,-43],[-126,18+capeWave,-102],[-108,122+capeWave,-112],[-5,69,-47]],yaw,pitch,pixelPalette.bright,4,true);
    } else {
      const cubes=[[-96,-62,0,70,pixelPalette.bright],[0,-62,0,86,pixelPalette.ink],[96,-62,0,70,pixelPalette.pink],[-96,38,0,70,pixelPalette.ink],[0,38,0,86,pixelPalette.bright],[96,38,0,70,pixelPalette.ink]];
      cubes.forEach(([x,y,z,size,color],index)=>{const bob=Math.sin(time/360+index)*5;draw3DBox(x,y+bob,z,size,size,size*.68,yaw,pitch,color);draw3DRect(x,y+bob,z+size*.35,size*.55,size*.1,yaw,pitch,color,true);});
    }
  };
  const drawPixelWordmarks = () => {
    const glyphs = { Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"], O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"] };
    for (const wordmark of document.querySelectorAll("[data-ep-wordmark]")) {
      const wordCtx = wordmark.getContext("2d");
      const cell = Math.max(16, Math.floor(wordmark.width / 29));
      const advance = 7 * cell;
      const totalWidth = advance * 4 - 2 * cell;
      const startX = Math.floor((wordmark.width - totalWidth) / 2);
      const startY = Math.floor((wordmark.height - 7 * cell) / 2);
      wordCtx.clearRect(0, 0, wordmark.width, wordmark.height);
      wordCtx.shadowColor = "rgba(114,240,168,.82)";
      wordCtx.shadowBlur = 7;
      "YOYO".split("").forEach((letter, letterIndex) => {
        glyphs[letter].forEach((row, rowIndex) => [...row].forEach((pixel, colIndex) => {
          if (pixel !== "1") return;
          const x = startX + letterIndex * advance + colIndex * cell;
          const y = startY + rowIndex * cell;
          wordCtx.fillStyle = "rgba(203,243,106,.22)";
          wordCtx.fillRect(x + 2, y, cell, cell);
          wordCtx.fillStyle = rowIndex === 0 ? "#cbf36a" : "#72f0a8";
          wordCtx.fillRect(x, y, cell, cell);
        }));
      });
      wordCtx.shadowBlur = 0;
      wordCtx.fillStyle = "rgba(3,8,6,.38)";
      for (let y = 1; y < wordmark.height; y += 5) wordCtx.fillRect(startX, y, totalWidth, 1);
    }
    const sprite = document.querySelector("[data-ep-boot-sprite]");
    const spriteCtx = sprite?.getContext("2d");
    if (!spriteCtx) return;
    const rows = ["000001100000", "000001100000", "000111111000", "001111111100", "011111111110", "011111111110", "011011110110", "011011110110", "011111111110", "001111111100", "000111111000", "001010010100", "011010010110", "000110011000"];
    const cell = 6;
    const startX = Math.floor((sprite.width - rows[0].length * cell) / 2);
    const startY = Math.floor((sprite.height - rows.length * cell) / 2);
    spriteCtx.clearRect(0, 0, sprite.width, sprite.height);
    rows.forEach((row, rowIndex) => [...row].forEach((pixel, colIndex) => {
      if (pixel !== "1") return;
      spriteCtx.fillStyle = rowIndex === 6 && (colIndex === 3 || colIndex === 8) ? "#cbf36a" : "#72f0a8";
      spriteCtx.fillRect(startX + colIndex * cell, startY + rowIndex * cell, cell, cell);
    }));
  };
  const drawArt = (mode = "minecraft", time = 0) => {
    const activeLink = menu.find((link) => link.dataset.epTarget === mode);
    if (homeArt && activeLink?.dataset.epArt && homeArt.getAttribute("src") !== activeLink.dataset.epArt) {
      homeArt.src = activeLink.dataset.epArt;
      homeArt.alt = activeLink.textContent.trim().replace(/^▶\s*/, "");
    }
    if (!artCtx || !artCanvas) return;
    const w = artCanvas.width;
    const h = artCanvas.height;
    artCtx.clearRect(0, 0, w, h);
    const sx = w / 700;
    const sy = h / 620;
    artCtx.save();
    artCtx.setTransform(sx, 0, 0, sy, 0, 0);
    artCtx.strokeStyle = "rgba(114,240,168,.28)";
    artCtx.lineWidth = 1.5;
    artCtx.strokeRect(42, 38, 616, 504);
    artCtx.strokeStyle = "rgba(203,243,106,.42)";
    artCtx.beginPath();
    artCtx.moveTo(350, 48); artCtx.lineTo(350, 112);
    artCtx.moveTo(350, 468); artCtx.lineTo(350, 532);
    artCtx.moveTo(54, 290); artCtx.lineTo(118, 290);
    artCtx.moveTo(582, 290); artCtx.lineTo(646, 290);
    artCtx.stroke();
    const scanY = 42 + ((time / 11) % 496);
    artCtx.fillStyle = "rgba(203,243,106,.13)";
    artCtx.fillRect(44, scanY, 612, 2);
    artCtx.fillStyle = "rgba(203,243,106,.72)";
    for (let index = 0; index < 16; index += 1) {
      const x = 58 + ((index * 137 + Math.floor(time / 75)) % 584);
      const y = 56 + ((index * 191 + Math.floor(time / 105)) % 468);
      artCtx.globalAlpha = .22 + .38 * ((Math.sin(time / 310 + index) + 1) / 2);
      artCtx.fillRect(x, y, index % 5 === 0 ? 3 : 2, index % 5 === 0 ? 3 : 2);
    }
    artCtx.globalAlpha = 1;
    artCtx.restore();
    if (artHint) artHint.textContent = state?.dragging ? "DRAG / ROTATE" : "DRAG / INSPECT";
    if (artCode) artCode.textContent = `${mode.toUpperCase().slice(0, 3)}_${String((state?.selected ?? 0) + 1).padStart(3, "0")}`;
    if (artStage) {
      artStage.style.setProperty("--ep-art-yaw", `${state.artYaw * 22}deg`);
      artStage.style.setProperty("--ep-art-pitch", `${state.artPitch * -18}deg`);
    }
  };

  const state = { active: true, sound: false, selected: 0, artYaw: 0, artPitch: 0, dragging: false, lastPointerX: 0, lastPointerY: 0 };
  const menu = [...document.querySelectorAll("[data-ep-menu-link]")];
  const beep = (frequency = 440, duration = 0.045) => {
    if (!state.sound || !window.AudioContext) return;
    audioContext ||= new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.01);
  };
  const select = (index, open = false) => {
    if (!menu.length) return;
    state.selected = (index + menu.length) % menu.length;
    menu.forEach((link, i) => { link.classList.toggle("is-selected", i === state.selected); link.querySelector("span")?.setAttribute("aria-hidden", String(i !== state.selected)); });
    const key = menu[state.selected].dataset.epTarget;
    const item = menu[state.selected];
    const zh = document.documentElement.lang.startsWith("zh");
    const description = document.querySelector("[data-ep-description]");
    const label = document.querySelector("[data-ep-art-label]");
    if (description && item) description.textContent = zh ? item.dataset.epCopyZh : item.dataset.epCopyEn;
    if (label && item) label.textContent = zh ? item.dataset.epLabelZh : item.dataset.epLabelEn;
    drawArt(key);
    beep(open ? 660 : 440);
    if (open && menu[state.selected]) window.location.assign(menu[state.selected].href);
  };
  menu.forEach((link, index) => link.addEventListener("mouseenter", () => select(index)));
  document.addEventListener("keydown", (event) => {
    if (!state.active) return;
    if (document.activeElement === artCanvas && event.key.startsWith("Arrow")) {
      event.preventDefault();
      if (event.key === "ArrowLeft") state.artYaw = Math.max(-1.25, state.artYaw - .12);
      if (event.key === "ArrowRight") state.artYaw = Math.min(1.25, state.artYaw + .12);
      if (event.key === "ArrowUp") state.artPitch = Math.max(-.55, state.artPitch - .08);
      if (event.key === "ArrowDown") state.artPitch = Math.min(.55, state.artPitch + .08);
      if (reducedMotion) drawArt(menu[state.selected]?.dataset.epTarget || "work");
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); select(state.selected + 1); }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); select(state.selected - 1); }
    if (event.key === "Enter") { event.preventDefault(); select(state.selected, true); }
    if (event.key.toLowerCase() === "m") document.querySelector("[data-ep-sound]")?.click();
  });
  document.querySelector("[data-ep-sound]")?.addEventListener("click", (event) => {
    state.sound = !state.sound;
    event.currentTarget.setAttribute("aria-pressed", String(state.sound));
    event.currentTarget.classList.toggle("is-on", state.sound);
    if (state.sound) beep(520, 0.08);
  });
  artCanvas?.addEventListener("pointerdown", (event) => { state.dragging = true; state.lastPointerX = event.clientX; state.lastPointerY = event.clientY; artCanvas.setPointerCapture?.(event.pointerId); artCanvas.classList.add("is-dragging"); drawArt(menu[state.selected]?.dataset.epTarget || "work"); });
  artCanvas?.addEventListener("pointermove", (event) => { if (!state.dragging) return; state.artYaw = Math.max(-1.25, Math.min(1.25, state.artYaw + (event.clientX - state.lastPointerX) * .008)); state.artPitch = Math.max(-.55, Math.min(.55, state.artPitch + (event.clientY - state.lastPointerY) * .006)); state.lastPointerX = event.clientX; state.lastPointerY = event.clientY; if (reducedMotion) drawArt(menu[state.selected]?.dataset.epTarget || "work"); });
  const stopArtDrag = (event) => { if (!state.dragging) return; state.dragging = false; artCanvas?.releasePointerCapture?.(event.pointerId); artCanvas?.classList.remove("is-dragging"); drawArt(menu[state.selected]?.dataset.epTarget || "work"); };
  artCanvas?.addEventListener("pointerup", stopArtDrag);
  artCanvas?.addEventListener("pointercancel", stopArtDrag);
  window.addEventListener("resize", resizeCanvas, { passive: true });
  drawPixelWordmarks();
  resizeCanvas();
  if (isHome) {
    body.classList.add("is-ep-started");
    select(0);
  }
  drawBackground(0);
  drawArt("work", 0);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (!reducedMotion) frame = requestAnimationFrame(drawBackground);
  });
  const clock = document.querySelector("[data-ep-clock]");
  const updateClock = () => { if (clock) clock.textContent = `${new Date().toLocaleTimeString([], { hour12: false })} LOCAL`; };
  updateClock();
  const clockTimer = window.setInterval(updateClock, 1000);

  const hobbySearch = document.querySelector("[data-ep-hobby-search]");
  const hobbyCards = [...document.querySelectorAll("[data-ep-hobby-card]")];
  const hobbyFilters = [...document.querySelectorAll("[data-ep-hobby-filter]")];
  let hobbyFilter = "all";
  const filterHobby = () => {
    const query = (hobbySearch?.value || "").trim().toLocaleLowerCase();
    hobbyCards.forEach((card) => {
      const matchesFilter = hobbyFilter === "all" || card.dataset.hobbyId === hobbyFilter;
      const matchesSearch = !query || (card.dataset.hobbySearch || "").toLocaleLowerCase().includes(query);
      card.hidden = !(matchesFilter && matchesSearch);
    });
  };
  hobbySearch?.addEventListener("input", filterHobby);
  hobbyFilters.forEach((button) => button.addEventListener("click", () => {
    hobbyFilter = button.dataset.epHobbyFilter || "all";
    hobbyFilters.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    filterHobby();
    beep(520, .04);
  }));
  filterHobby();

  const specimenOutput = document.querySelector("[data-ep-specimen-output]");
  const inventoryItems = [...document.querySelectorAll("[data-ep-inventory-item]")];
  inventoryItems.forEach((button) => button.addEventListener("click", () => {
    inventoryItems.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    const zh = document.documentElement.lang.startsWith("zh");
    if (specimenOutput) specimenOutput.textContent = `${zh ? "物品栏" : "INVENTORY"} / ${button.dataset.itemIndex} · ${button.dataset.itemLabel}`;
    beep(520, .04);
  }));

  const capeToggle = document.querySelector("[data-ep-cape-toggle]");
  const capeStage = document.querySelector(".ep-demo-cape-stage");
  capeToggle?.addEventListener("click", () => {
    const paused = capeToggle.getAttribute("aria-pressed") !== "true";
    const zh = document.documentElement.lang.startsWith("zh");
    capeToggle.setAttribute("aria-pressed", String(paused));
    capeToggle.textContent = paused ? (zh ? "继续披风动效" : "RESUME CAPE MOTION") : (zh ? "暂停披风动效" : "PAUSE CAPE MOTION");
    capeStage?.classList.toggle("is-paused", paused);
    if (specimenOutput) specimenOutput.textContent = paused ? (zh ? "循环 / 已暂停" : "LOOP / PAUSED") : (zh ? "循环 / 60 FPS" : "LOOP / 60 FPS");
    beep(paused ? 330 : 620, .05);
  });

  const artBoard = document.querySelector("[data-ep-art-board]");
  const artPalettes = [...document.querySelectorAll("[data-ep-art-palette]")];
  artPalettes.forEach((button) => button.addEventListener("click", () => {
    const palette = button.dataset.epArtPalette || "emerald";
    const zh = document.documentElement.lang.startsWith("zh");
    artBoard?.setAttribute("data-palette", palette);
    artPalettes.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    if (specimenOutput) specimenOutput.textContent = `${zh ? "配色" : "PALETTE"} / ${palette.toUpperCase()}`;
    beep(480, .04);
  }));

  const webBoard = document.querySelector("[data-ep-web-board]");
  const webModes = [...document.querySelectorAll("[data-ep-web-mode]")];
  webModes.forEach((button) => button.addEventListener("click", () => {
    const mode = button.dataset.epWebMode || "dark";
    const zh = document.documentElement.lang.startsWith("zh");
    webBoard?.setAttribute("data-mode", mode);
    webModes.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    if (specimenOutput) specimenOutput.textContent = `${zh ? "视图" : "VIEW"} / ${mode === "light" ? (zh ? "浅色模式" : "LIGHT MODE") : (zh ? "深色模式" : "DARK MODE")}`;
    beep(mode === "light" ? 620 : 360, .04);
  }));
  window.addEventListener("pagehide", () => { cancelAnimationFrame(frame); window.clearInterval(clockTimer); audioContext?.close(); }, { once: true });
})();
