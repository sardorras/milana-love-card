"use strict";

const canvas = document.querySelector("#effects");
const context = canvas.getContext("2d");
const envelopeView = document.querySelector("#envelopeView");
const openEnvelopeButton = document.querySelector("#openEnvelope");
const cardView = document.querySelector("#cardView");
const wishButton = document.querySelector("#wishButton");
const wishText = document.querySelector("#wish");
const musicButton = document.querySelector("#musicButton");
const music = document.querySelector("#backgroundMusic");
const wishes = ["Ты самая красивая 🌷", "Ты делаешь мой мир ярче ✨", "Твоя улыбка — моё любимое чудо 💕", "Пусть сегодня сбудется всё, о чём ты мечтаешь 🦋", "Ты прекрасна — просто помни об этом 💖", "С тобой даже обычный день становится особенным 🌸"];
const colors = ["#ff74a8", "#fa5f78", "#c48be8", "#ff9fc5", "#f7d1ed"];
const particles = [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let width = 0, height = 0, pixelRatio = 1, opened = false, lastTrailTime = 0, lastFrameTime = 0, lastWishIndex = -1;

// Настраиваем canvas с учётом плотности экрана.
function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();
const random = (min, max) => Math.random() * (max - min) + min;
function addParticle(particle) { if (particles.length < 260) particles.push(particle); }

function makeHeart(x, y, options = {}) {
  const life = options.life ?? random(1.8, 3.8);
  const alpha = options.alpha ?? random(.55, .95);
  return { type: "heart", x, y, size: options.size ?? random(8, 18), color: options.color ?? colors[Math.floor(Math.random() * colors.length)], alpha, baseAlpha: alpha, life, vx: options.vx ?? random(-38, 38), vy: options.vy ?? random(-95, -35), sway: random(10, 34), swaySpeed: random(1.4, 3.8), rotation: random(-.45, .45), rotationSpeed: random(-1.2, 1.2), age: 0 };
}
function makeSparkle(x, y) {
  const life = random(.5, 1.1);
  return { type: "sparkle", x, y, size: random(2, 5), color: "#fff9db", alpha: 1, baseAlpha: 1, life, vx: random(-55, 55), vy: random(-70, 30), rotation: 0, rotationSpeed: random(-2, 2), age: 0 };
}
function makePetal() {
  const life = random(7, 12);
  const alpha = random(.52, .78);
  return { type: "petal", x: random(0, width), y: -30, size: random(8, 16), color: Math.random() > .5 ? "#e985ae" : "#f4abc4", alpha, baseAlpha: alpha, life, vx: random(-18, 18), vy: random(24, 55), sway: random(25, 70), swaySpeed: random(.7, 1.8), rotation: random(0, Math.PI), rotationSpeed: random(-1.4, 1.4), age: 0 };
}
function burst(x, y, count = 20) {
  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 * index / count + random(-.2, .2);
    const speed = random(45, 180);
    addParticle(makeHeart(x, y, { size: random(9, 20), life: random(1.1, 2.5), alpha: random(.65, 1), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - random(15, 60) }));
    if (index % 2 === 0) addParticle(makeSparkle(x + random(-12, 12), y + random(-12, 12)));
  }
}
function drawHeart(p) {
  context.save(); context.translate(p.x, p.y); context.rotate(p.rotation); context.scale(p.size / 18, p.size / 18); context.globalAlpha = p.alpha; context.fillStyle = p.color; context.beginPath(); context.moveTo(0, 6); context.bezierCurveTo(-14, -3, -9, -14, 0, -7); context.bezierCurveTo(9, -14, 14, -3, 0, 6); context.fill(); context.restore();
}
function drawSparkle(p) {
  context.save(); context.translate(p.x, p.y); context.rotate(p.rotation); context.globalAlpha = p.alpha; context.fillStyle = p.color; context.beginPath(); context.moveTo(0, -p.size); context.lineTo(p.size * .28, -p.size * .28); context.lineTo(p.size, 0); context.lineTo(p.size * .28, p.size * .28); context.lineTo(0, p.size); context.lineTo(-p.size * .28, p.size * .28); context.lineTo(-p.size, 0); context.lineTo(-p.size * .28, -p.size * .28); context.closePath(); context.fill(); context.restore();
}
function drawPetal(p) {
  context.save(); context.translate(p.x, p.y); context.rotate(p.rotation); context.globalAlpha = p.alpha; context.fillStyle = p.color; context.beginPath(); context.ellipse(0, 0, p.size * .48, p.size, 0, 0, Math.PI * 2); context.fill(); context.restore();
}
function animate(timestamp) {
  const delta = Math.min((timestamp - (lastFrameTime || timestamp)) / 1000, .04);
  lastFrameTime = timestamp;
  context.clearRect(0, 0, width, height);
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i]; p.age += delta; p.life -= delta;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    p.x += (p.vx + Math.sin(p.age * (p.swaySpeed || 1)) * (p.sway || 0)) * delta;
    p.y += p.vy * delta; p.rotation += p.rotationSpeed * delta;
    p.alpha = Math.min(p.age / .18, 1, p.life / .55) * p.baseAlpha;
    if (p.type === "heart") drawHeart(p);
    else if (p.type === "sparkle") drawSparkle(p);
    else drawPetal(p);
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function sendOpeningHearts() {
  for (let i = 0; i < 65; i += 1) addParticle(makeHeart(random(0, width), random(height * .55, height + 40), { size: random(8, 20), life: random(3.2, 6.5), vy: random(-105, -40), alpha: random(.35, .78) }));
}
openEnvelopeButton.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  envelopeView.classList.add("is-opening");
  sendOpeningHearts();
  window.setTimeout(() => {
    envelopeView.classList.add("is-open"); cardView.classList.add("is-visible"); cardView.setAttribute("aria-hidden", "false"); burst(width / 2, height / 2, 28); schedulePetals();
  }, 720);
});
window.addEventListener("pointerdown", (event) => { if (!reduceMotion) burst(event.clientX, event.clientY, 12); });
window.addEventListener("pointermove", (event) => {
  if (reduceMotion || !opened || performance.now() - lastTrailTime < 55) return;
  lastTrailTime = performance.now();
  if (Math.random() > .35) addParticle(makeHeart(event.clientX, event.clientY, { size: random(5, 11), life: random(.7, 1.35), alpha: random(.45, .8), vx: random(-12, 12), vy: random(-25, -5) }));
  else addParticle(makeSparkle(event.clientX, event.clientY));
}, { passive: true });
function schedulePetals() {
  if (!opened) return;
  for (let i = 0, count = Math.floor(random(2, 5)); i < count; i += 1) window.setTimeout(() => addParticle(makePetal()), i * 480);
  window.setTimeout(schedulePetals, random(9000, 15000));
}

wishButton.addEventListener("click", () => {
  let index;
  do { index = Math.floor(Math.random() * wishes.length); } while (wishes.length > 1 && index === lastWishIndex);
  lastWishIndex = index; wishText.classList.remove("is-changing"); void wishText.offsetWidth; wishText.textContent = wishes[index]; wishText.classList.add("is-changing"); burst(width / 2, height * .78, 10);
});
musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play(); musicButton.classList.add("is-playing"); musicButton.setAttribute("aria-pressed", "true"); musicButton.setAttribute("aria-label", "Выключить музыку"); musicButton.querySelector(".music-button__text").textContent = "Музыка: вкл.";
    } catch { musicButton.querySelector(".music-button__text").textContent = "Добавь music.mp3"; }
    return;
  }
  music.pause(); musicButton.classList.remove("is-playing"); musicButton.setAttribute("aria-pressed", "false"); musicButton.setAttribute("aria-label", "Включить музыку"); musicButton.querySelector(".music-button__text").textContent = "Музыка: выкл.";
});
