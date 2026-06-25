/* ============================================================
   MI JARDÍN — script.js
   Senior Full Stack · UI/UX · Animation Expert
   Vanilla JS · No frameworks · No jQuery
============================================================ */

'use strict';

/* ─── CONSTANTS ─────────────────────────────────────────── */
const LS_KEY      = 'mi_jardin_respuesta';
const LS_VISITED  = 'mi_jardin_visited';

const ROMANTIC_PHRASES = [
  'Me hacés muy feliz ❤️',
  'Gracias por estar conmigo 🌼',
  'Sos mi persona favorita 💛',
  'Cada día sos más especial 🌷',
  'Me encanta compartir tiempo con vos ❤️',
  'Sos mi flor favorita 🌼',
  'Con vos todo es más lindo 💛',
  'Me alegra tanto tenerte cerca ❤️',
  'Pensé en vos al hacer esto 🌷',
  'Gracias por existir 🌼',
];

/* ─── STATE ──────────────────────────────────────────────── */
let noAttempts   = 0;
let noButtonRect = null;
let yesScale     = 1;
let musicPlaying = false;

/* ─── DOM REFS ────────────────────────────────────────────── */
const screenWelcome = document.getElementById('screen-welcome');
const screenYes     = document.getElementById('screen-yes');
const screenGarden  = document.getElementById('screen-garden');
const titleMain     = document.getElementById('title-main');
const questionBlock = document.getElementById('question-block');
const btnYes        = document.getElementById('btn-yes');
const btnNo         = document.getElementById('btn-no');
const noHint        = document.getElementById('no-hint');
const modalNo       = document.getElementById('modal-no');
const modalConfirmNo  = document.getElementById('modal-confirm-no');
const modalMaybeYes   = document.getElementById('modal-maybe-yes');
const canvasPetals    = document.getElementById('canvas-petals');
const yesTextLine     = document.getElementById('yes-text-line');
const canvasGarden    = document.getElementById('canvas-garden');
const canvasParticles = document.getElementById('canvas-particles');
const romanticMsg     = document.getElementById('romantic-message');
const musicBtn        = document.getElementById('music-btn');
const bgMusic         = document.getElementById('bg-music');

/* ═══════════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', boot);

function boot() {
  generateBokeh('bokeh-welcome', 18);
  generateStars('stars-welcome', 80);
  generateBokeh('bokeh-yes',     12);
  generateBokeh('bokeh-garden',  22);
  generateStars('stars-garden',  120);

  const prevAnswer = localStorage.getItem(LS_KEY);

  if (prevAnswer) {
    // Ya respondió antes → ir directo al jardín
    goToGarden(true);
  } else {
    startWelcomeFlow();
  }
}

/* ═══════════════════════════════════════════════════════════
   BOKEH & STARS
═══════════════════════════════════════════════════════════ */
function generateBokeh(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const colors = [
    'rgba(255,107,157,0.5)',
    'rgba(216,51,132,0.4)',
    'rgba(255,215,0,0.3)',
    'rgba(180,100,255,0.3)',
    'rgba(255,179,204,0.4)',
  ];

  for (let i = 0; i < count; i++) {
    const d   = document.createElement('div');
    const sz  = rand(40, 180);
    const col = colors[Math.floor(rand(0, colors.length))];

    d.className = 'bokeh-dot';
    d.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${rand(0,100)}%; top:${rand(0,100)}%;
      --blur:${rand(8,28)}px;
      --op:${rand(0.07,0.22)};
      --col:${col};
      --dur:${rand(5,14)}s;
      --delay:-${rand(0,10)}s;
    `;
    container.appendChild(d);
  }
}

function generateStars(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const d  = document.createElement('div');
    const sz = rand(1, 3.5);
    d.className = 'star';
    d.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${rand(0,100)}%; top:${rand(0,100)}%;
      --dur:${rand(2,6)}s;
      --delay:-${rand(0,5)}s;
      opacity:${rand(0.2,0.9)};
    `;
    container.appendChild(d);
  }
}

/* ═══════════════════════════════════════════════════════════
   WELCOME FLOW
═══════════════════════════════════════════════════════════ */
function startWelcomeFlow() {
  showScreen(screenWelcome);

  // La pregunta aparece después de que el título está visible
  setTimeout(() => {
    questionBlock.removeAttribute('aria-hidden');
    questionBlock.classList.add('visible');
    initNoButton();
  }, 3400);
}

/* ─── INIT NO BUTTON POSITION ────────────────────────────── */
function initNoButton() {
  // Poner el botón NO en posición normal primero
  const yesRect = btnYes.getBoundingClientRect();
  btnNo.style.position = 'fixed';
  btnNo.style.left = `${yesRect.right + 24}px`;
  btnNo.style.top  = `${yesRect.top}px`;
  btnNo.style.fontSize = '';
  noButtonRect = btnNo.getBoundingClientRect();

  btnYes.addEventListener('click', handleYes);
  btnNo.addEventListener('mouseenter', handleNoHover);
  btnNo.addEventListener('touchstart', handleNoTouch, { passive: true });
  btnNo.addEventListener('click', handleNoClick);
}

/* ─── NO BUTTON EVASION ──────────────────────────────────── */
const NO_SIZES  = [1, 0.85, 0.70, 0.55, 0.40, 0.25, 0.15, 0.10];
const YES_SCALES = [1, 1.04, 1.08, 1.12, 1.16, 1.20, 1.24, 1.28];

function handleNoHover() {
  evadeNoButton();
}

function handleNoTouch() {
  evadeNoButton();
}

function evadeNoButton() {
  if (noAttempts >= NO_SIZES.length) return;

  noAttempts++;
  const sizeRatio = NO_SIZES[Math.min(noAttempts, NO_SIZES.length - 1)];
  yesScale        = YES_SCALES[Math.min(noAttempts, YES_SCALES.length - 1)];

  // Move NO button to random safe position
  moveNoButtonRandom();

  // Shrink NO
  btnNo.style.fontSize = `${sizeRatio * 100}%`;

  // Grow YES
  btnYes.classList.add('growing');
  btnYes.style.setProperty('--yes-scale', yesScale);

  // Show hint after 3rd attempt
  if (noAttempts >= 3) {
    noHint.textContent = 'Dale, sabés que querés decir que sí ❤️';
    noHint.classList.add('visible');
  }
}

function moveNoButtonRandom() {
  const margin = 40;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const bw = btnNo.offsetWidth  || 90;
  const bh = btnNo.offsetHeight || 44;

  // Keep away from YES button
  const yesRect = btnYes.getBoundingClientRect();
  let x, y, tries = 0;

  do {
    x = rand(margin, vw - bw - margin);
    y = rand(margin, vh - bh - margin);
    tries++;
  } while (
    tries < 30 &&
    x < yesRect.right + 60 && x > yesRect.left - 60 &&
    y < yesRect.bottom + 60 && y > yesRect.top - 60
  );

  btnNo.style.left       = `${x}px`;
  btnNo.style.top        = `${y}px`;
  btnNo.style.transition = 'left 0.35s cubic-bezier(0.4,0,0.2,1), top 0.35s cubic-bezier(0.4,0,0.2,1), font-size 0.4s';
}

/* ─── NO CLICK → MODAL ───────────────────────────────────── */
function handleNoClick() {
  openModal();
}

function openModal() {
  modalNo.removeAttribute('aria-hidden');
  modalNo.classList.add('visible');
  modalMaybeYes.focus();
}

function closeModal() {
  modalNo.setAttribute('aria-hidden', 'true');
  modalNo.classList.remove('visible');
}

modalMaybeYes.addEventListener('click', () => {
  closeModal();
  handleYes('maybe');
});

modalConfirmNo.addEventListener('click', () => {
  closeModal();
  localStorage.setItem(LS_KEY, 'no');
  handleDefinitiveNo();
});

/* ─── DEFINITIVE NO ──────────────────────────────────────── */
function handleDefinitiveNo() {
  transitionToYesScreen('Bueno, al menos disfrutá las flores 🌼');
}

/* ═══════════════════════════════════════════════════════════
   YES HANDLER
═══════════════════════════════════════════════════════════ */
function handleYes(source) {
  const msg = source === 'maybe'
    ? 'Sabía que ibas a reconsiderarlo ❤️'
    : 'Sabía que ibas a decir que sí ❤️';

  localStorage.setItem(LS_KEY, 'yes');
  transitionToYesScreen(msg);
}

btnYes.addEventListener('click', handleYes);

/* ═══════════════════════════════════════════════════════════
   TRANSITION → YES SCREEN
═══════════════════════════════════════════════════════════ */
function transitionToYesScreen(message) {
  // Fade out welcome
  screenWelcome.classList.remove('active');
  screenWelcome.classList.add('fade-out');

  setTimeout(() => {
    screenWelcome.style.display = 'none';
    showScreen(screenYes);
    startPetalsAnimation();

    setTimeout(() => {
      yesTextLine.textContent = message;
      yesTextLine.classList.add('visible');
    }, 600);

    setTimeout(() => {
      goToGarden(false);
    }, 4000);

  }, 900);
}

/* ═══════════════════════════════════════════════════════════
   PETALS ANIMATION (canvas)
═══════════════════════════════════════════════════════════ */
let petalAnimId = null;

function startPetalsAnimation() {
  const ctx = canvasPetals.getContext('2d');
  resizeCanvas(canvasPetals);

  const petals = [];
  const hearts = [];

  // Spawn petals
  for (let i = 0; i < 120; i++) {
    petals.push(createPetal(canvasPetals));
  }

  for (let i = 0; i < 30; i++) {
    hearts.push(createHeart(canvasPetals));
  }

  function frame() {
    ctx.clearRect(0, 0, canvasPetals.width, canvasPetals.height);

    petals.forEach(p => {
      updatePetal(p, canvasPetals);
      drawPetal(ctx, p);
    });

    hearts.forEach(h => {
      updateHeart(h, canvasPetals);
      drawHeart(ctx, h);
    });

    petalAnimId = requestAnimationFrame(frame);
  }

  frame();
}

function createPetal(canvas) {
  return {
    x:     rand(0, canvas.width),
    y:     rand(canvas.height, canvas.height + 200),
    vx:    rand(-1.5, 1.5),
    vy:    rand(-3, -1.2),
    rot:   rand(0, Math.PI * 2),
    vrot:  rand(-0.04, 0.04),
    size:  rand(8, 18),
    alpha: rand(0.6, 1),
    hue:   rand(330, 360),
    sat:   rand(70, 100),
    lgt:   rand(75, 90),
  };
}

function updatePetal(p, canvas) {
  p.x   += p.vx;
  p.y   += p.vy;
  p.rot += p.vrot;
  p.vx  += Math.sin(Date.now() * 0.001 + p.y * 0.01) * 0.02;

  if (p.y < -30) {
    p.y   = canvas.height + 10;
    p.x   = rand(0, canvas.width);
    p.alpha = rand(0.6, 1);
  }
}

function drawPetal(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = `hsl(${p.hue},${p.sat}%,${p.lgt}%)`;
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function createHeart(canvas) {
  return {
    x:     rand(0, canvas.width),
    y:     canvas.height + rand(0, 100),
    vy:    rand(-1.5, -0.6),
    size:  rand(14, 36),
    alpha: rand(0.5, 0.9),
    wobble: rand(0, Math.PI * 2),
  };
}

function updateHeart(h, canvas) {
  h.y       += h.vy;
  h.wobble  += 0.04;
  h.x       += Math.sin(h.wobble) * 0.6;
  if (h.y < -40) {
    h.y = canvas.height + 20;
    h.x = rand(0, canvas.width);
  }
}

function drawHeart(ctx, h) {
  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.globalAlpha = h.alpha;
  ctx.fillStyle = `rgba(255,107,157,${h.alpha})`;
  const s = h.size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.1, 0, s * 0.9);
  ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.2, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════
   GO TO GARDEN
═══════════════════════════════════════════════════════════ */
function goToGarden(instant) {
  if (petalAnimId) {
    cancelAnimationFrame(petalAnimId);
    petalAnimId = null;
  }

  if (instant) {
    screenWelcome.style.display = 'none';
    screenYes.style.display     = 'none';
  } else {
    screenYes.classList.remove('active');
    screenYes.classList.add('fade-out');
    setTimeout(() => { screenYes.style.display = 'none'; }, 1200);
  }

  setTimeout(() => {
    showScreen(screenGarden);
    initGarden();
    initParticles();
    initRomanticMessages();
    initMusicButton();
  }, instant ? 0 : 800);
}

/* ═══════════════════════════════════════════════════════════
   GARDEN — FLOWERS
═══════════════════════════════════════════════════════════ */
let gardenAnimId = null;

function initGarden() {
  const canvas = canvasGarden;
  resizeCanvas(canvas);
  const ctx = canvas.getContext('2d');

  window.addEventListener('resize', () => {
    resizeCanvas(canvas);
    buildFlowers(canvas);
  });

  buildFlowers(canvas);

  function buildFlowers(c) {
    if (gardenAnimId) cancelAnimationFrame(gardenAnimId);
    const flowers = generateFlowers(c);
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, c.width, c.height);
      drawGround(ctx, c);

      flowers.forEach(f => drawFlower(ctx, f, elapsed));
      gardenAnimId = requestAnimationFrame(frame);
    }

    gardenAnimId = requestAnimationFrame(frame);
  }
}

function generateFlowers(canvas) {
  const count   = Math.floor(rand(12, 22));
  const flowers = [];
  const minW    = 60;

  for (let i = 0; i < count; i++) {
    const x      = rand(minW, canvas.width - minW);
    const height = rand(120, 260);
    const delay  = rand(0, 2000);

    flowers.push({
      x,
      y:           canvas.height,
      targetH:     height,
      stemW:       rand(2.5, 5),
      petalCount:  Math.floor(rand(6, 14)),
      petalSize:   rand(18, 38),
      centerR:     rand(8, 16),
      leafSize:    rand(18, 30),
      delay,
      growDur:     rand(1800, 3500),
      openDur:     rand(1200, 2800),
      windAmp:     rand(0.3, 1.8),
      windFreq:    rand(0.5, 1.5),
      windPhase:   rand(0, Math.PI * 2),
      depth:       rand(0.6, 1),     // perspective depth
      leafAngle:   rand(0.3, 0.8),
      leafSide:    Math.random() > 0.5 ? 1 : -1,
    });
  }

  // Sort by depth so closer flowers draw on top
  flowers.sort((a, b) => a.depth - b.depth);
  return flowers;
}

function drawGround(ctx, canvas) {
  const grad = ctx.createLinearGradient(0, canvas.height - 40, 0, canvas.height);
  grad.addColorStop(0, 'rgba(20,40,15,0)');
  grad.addColorStop(1, 'rgba(10,25,8,0.6)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
}

function drawFlower(ctx, f, elapsed) {
  const t = Math.max(0, elapsed - f.delay);
  if (t <= 0) return;

  const growProgress = easeOut(Math.min(t / f.growDur, 1));
  const openProgress = easeOut(Math.min(Math.max((t - f.growDur * 0.5) / f.openDur, 0), 1));

  const currentH   = f.targetH * growProgress * f.depth;
  const wind        = Math.sin(elapsed * 0.001 * f.windFreq + f.windPhase) * f.windAmp * growProgress;
  const windRadians = wind * 0.04;

  ctx.save();
  ctx.translate(f.x, f.y);

  // Stem
  drawStem(ctx, f, currentH, wind);

  // Leaf (appears at 40% growth)
  if (growProgress > 0.4) {
    const leafProg = easeOut(Math.min((growProgress - 0.4) / 0.6, 1));
    drawLeaf(ctx, f, currentH, wind, leafProg);
  }

  // Flower head (when stem is mostly grown)
  if (growProgress > 0.7) {
    const headProg = easeOut(Math.min((growProgress - 0.7) / 0.3, 1));
    drawFlowerHead(ctx, f, currentH, wind, windRadians, openProgress * headProg);
  }

  ctx.restore();
}

function drawStem(ctx, f, currentH, wind) {
  ctx.save();
  const bendX = wind * (currentH / 100);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(bendX * 0.4, -currentH * 0.5, bendX, -currentH);

  const alpha  = Math.min(currentH / 50, 1);
  ctx.strokeStyle = `rgba(46,125,50,${alpha})`;
  ctx.lineWidth  = f.stemW * f.depth;
  ctx.lineCap    = 'round';
  ctx.stroke();
  ctx.restore();
}

function drawLeaf(ctx, f, currentH, wind, progress) {
  ctx.save();
  const bendX  = wind * (currentH / 100);
  const leafY  = -currentH * 0.45;
  const leafX  = bendX * 0.45;
  const lx     = f.leafSide * f.leafSize * progress;
  const ly     = -f.leafSize * 0.6 * progress;

  const alpha = Math.min(progress, 0.9);
  ctx.translate(leafX, leafY);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(lx * 0.5, ly * 1.5, lx, ly * 0.2);
  ctx.quadraticCurveTo(lx * 0.3, ly * 0.5, 0, 0);
  ctx.fillStyle   = `rgba(61,139,55,${alpha})`;
  ctx.strokeStyle = `rgba(46,100,40,${alpha * 0.7})`;
  ctx.lineWidth   = 1;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawFlowerHead(ctx, f, currentH, wind, windRadians, openProgress) {
  ctx.save();
  const bendX = wind * (currentH / 100);
  ctx.translate(bendX, -currentH);
  ctx.rotate(windRadians);

  const scale  = f.depth;
  const alpha  = Math.min(openProgress * 1.5, 1);

  // Glow behind flower
  if (openProgress > 0.3) {
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, f.petalSize * 1.8 * scale);
    glow.addColorStop(0, `rgba(255,230,102,${0.18 * openProgress})`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, f.petalSize * 1.8 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Petals
  const angleStep = (Math.PI * 2) / f.petalCount;
  for (let i = 0; i < f.petalCount; i++) {
    const angle     = i * angleStep;
    const petalDist = f.centerR * scale * 0.9;
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -petalDist);

    const petalH = f.petalSize * openProgress * scale;
    const petalW = f.petalSize * 0.52 * openProgress * scale;

    // Petal gradient (white → cream)
    const pGrad = ctx.createLinearGradient(0, 0, 0, -petalH);
    pGrad.addColorStop(0, `rgba(255,248,240,${alpha})`);
    pGrad.addColorStop(0.5, `rgba(255,253,245,${alpha})`);
    pGrad.addColorStop(1, `rgba(255,255,255,${alpha * 0.7})`);

    ctx.beginPath();
    ctx.ellipse(0, -petalH * 0.5, petalW, petalH * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle   = pGrad;
    ctx.strokeStyle = `rgba(230,210,190,${alpha * 0.3})`;
    ctx.lineWidth   = 0.5;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Center disk
  const cGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, f.centerR * scale);
  cGrad.addColorStop(0,   `rgba(255,220,50,${alpha})`);
  cGrad.addColorStop(0.6, `rgba(220,160,20,${alpha})`);
  cGrad.addColorStop(1,   `rgba(180,110,10,${alpha * 0.8})`);

  ctx.beginPath();
  ctx.arc(0, 0, f.centerR * scale, 0, Math.PI * 2);
  ctx.fillStyle = cGrad;
  ctx.fill();

  // Center texture dots
  if (openProgress > 0.6) {
    const dotAlpha = (openProgress - 0.6) / 0.4 * alpha;
    for (let d = 0; d < 8; d++) {
      const da = d * Math.PI * 2 / 8;
      const dr = f.centerR * scale * 0.55;
      ctx.beginPath();
      ctx.arc(
        Math.cos(da) * dr,
        Math.sin(da) * dr,
        1.5 * scale, 0, Math.PI * 2
      );
      ctx.fillStyle = `rgba(160,90,0,${dotAlpha})`;
      ctx.fill();
    }
  }

  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════
   PARTICLES (floating sparkles)
═══════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = canvasParticles;
  resizeCanvas(canvas);
  const ctx = canvas.getContext('2d');

  window.addEventListener('resize', () => resizeCanvas(canvas));

  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push(makeParticle(canvas, true));
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.life++;
      if (p.life > p.maxLife) {
        particles[i] = makeParticle(canvas, false);
        return;
      }
      const t     = p.life / p.maxLife;
      const alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy -= 0.008;

      ctx.save();
      ctx.globalAlpha = alpha * p.baseAlpha;
      // Sparkle cross
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 0.05);
      for (let arm = 0; arm < 4; arm++) {
        ctx.save();
        ctx.rotate(arm * Math.PI / 2);
        ctx.fillRect(-p.size * 0.15, -p.size, p.size * 0.3, p.size * 2);
        ctx.restore();
      }
      ctx.restore();
    });
    requestAnimationFrame(frame);
  }
  frame();
}

function makeParticle(canvas, randomY) {
  const colors = ['#ffd700','#ffe066','#ff6b9d','#ffb3cc','#fff8f0'];
  return {
    x:        rand(0, canvas.width),
    y:        randomY ? rand(0, canvas.height) : canvas.height + 10,
    vx:       rand(-0.3, 0.3),
    vy:       rand(-0.8, -0.2),
    size:     rand(1.5, 4),
    color:    colors[Math.floor(rand(0, colors.length))],
    baseAlpha: rand(0.4, 0.9),
    life:     0,
    maxLife:  Math.floor(rand(80, 200)),
  };
}

/* ═══════════════════════════════════════════════════════════
   ROMANTIC MESSAGES
═══════════════════════════════════════════════════════════ */
function initRomanticMessages() {
  let phraseIndex = Math.floor(rand(0, ROMANTIC_PHRASES.length));

  function showNextPhrase() {
    const phrase = ROMANTIC_PHRASES[phraseIndex % ROMANTIC_PHRASES.length];
    phraseIndex++;

    romanticMsg.textContent = phrase;
    romanticMsg.classList.add('visible');

    setTimeout(() => {
      romanticMsg.classList.remove('visible');
      setTimeout(showNextPhrase, rand(3000, 5000));
    }, 4500);
  }

  setTimeout(showNextPhrase, 2000);
}

/* ═══════════════════════════════════════════════════════════
   MUSIC BUTTON
═══════════════════════════════════════════════════════════ */
function initMusicButton() {
  musicBtn.addEventListener('click', toggleMusic);
}

function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.setAttribute('aria-label', 'Reproducir música de fondo');
    musicBtn.querySelector('.music-label').textContent = 'Música';
  } else {
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-label', 'Pausar música de fondo');
      musicBtn.querySelector('.music-label').textContent = 'Pausar';
    }).catch(() => {
      // No hay archivo de audio todavía, mostrar mensaje
      musicBtn.querySelector('.music-label').textContent = 'Sin audio';
      setTimeout(() => {
        musicBtn.querySelector('.music-label').textContent = 'Música';
      }, 2000);
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   SCREEN MANAGER
═══════════════════════════════════════════════════════════ */
function showScreen(el) {
  el.style.display = '';
  el.removeAttribute('aria-hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   RESIZE CANVAS
═══════════════════════════════════════════════════════════ */
function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w   = canvas.parentElement
    ? canvas.parentElement.clientWidth
    : window.innerWidth;
  const h   = canvas.parentElement
    ? canvas.parentElement.clientHeight
    : window.innerHeight;

  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
  canvas.getContext('2d').scale(dpr, dpr);
}

/* ═══════════════════════════════════════════════════════════
   KEYBOARD ACCESSIBILITY
═══════════════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalNo.classList.contains('visible')) {
    closeModal();
  }
});

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
