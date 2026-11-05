// ===== Settings you can change =====
const QUESTION = "Will you be my girl for the rest of my life?";

const ERROR_MESSAGES = [
  { title: "Error: Answer not found", text: 'The answer "No" does not exist.<br>Please choose a valid answer.', code: "ERROR 404: NO_NOT_FOUND" },
  { title: "Access denied", text: 'You do not have permission to say "No".<br>Please try again.', code: "ERROR 403: NO_FORBIDDEN" },
  { title: "System failure", text: "My heart could not process that answer.<br>Only \"Yes\" is supported.", code: "ERROR 500: HEART_OVERLOAD" },
  { title: "Invalid input", text: '"No" is not a valid option in this relationship.<br>Please select "Yes".', code: "ERROR 418: TOO_CUTE_TO_REFUSE" }
];

// ===== Elements =====
const card = document.getElementById("card");
const questionEl = document.getElementById("question");
const buttons = document.getElementById("buttons");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const heartScene = document.getElementById("heartScene");
const orbit = document.getElementById("orbit");
const errorOverlay = document.getElementById("errorOverlay");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const bgHearts = document.getElementById("bg-hearts");
const roses = document.getElementById("roses");

let noCount = 0;

// ===== Floating hearts in the background =====
const HEART_CHARS = ["♥", "♡", "❤", "💗", "💕"];

function spawnBgHeart() {
  const h = document.createElement("span");
  h.className = "float-heart";
  h.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 26 + "px";
  h.style.animationDuration = 7 + Math.random() * 7 + "s";
  bgHearts.appendChild(h);
  h.addEventListener("animationend", () => h.remove());
}
for (let i = 0; i < 8; i++) setTimeout(spawnBgHeart, i * 300);
setInterval(spawnBgHeart, 650);

// ===== Question pops up with an animation =====
function showQuestion() {
  card.classList.add("show");

  questionEl.innerHTML = "";
  QUESTION.split(" ").forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word;
    span.style.animationDelay = 0.9 + i * 0.16 + "s";
    questionEl.appendChild(span);
    questionEl.appendChild(document.createTextNode(" "));
  });

  const wordsTime = 900 + QUESTION.split(" ").length * 160 + 300;
  setTimeout(() => buttons.classList.add("show"), wordsTime);
}

window.addEventListener("load", () => setTimeout(showQuestion, 400));

// ===== YES =====
yesBtn.addEventListener("click", () => {
  card.classList.remove("show");
  card.classList.add("hide");

  setTimeout(() => {
    card.hidden = true;
    heartScene.hidden = false;
    // small delay so the animation starts after it becomes visible
    requestAnimationFrame(() => heartScene.classList.add("show"));
    buildOrbit();
    startRoses();
  }, 600);
});

// sparkles circling around the heart
function buildOrbit() {
  const symbols = ["✦", "♥", "✧", "♡", "✦", "♥", "✧", "♡"];
  const radius = Math.min(window.innerWidth * 0.48, 210);
  symbols.forEach((s, i) => {
    const span = document.createElement("span");
    span.textContent = s;
    const angle = (i / symbols.length) * Math.PI * 2;
    span.style.left = Math.cos(angle) * radius - 10 + "px";
    span.style.top = Math.sin(angle) * radius - 12 + "px";
    orbit.appendChild(span);
  });
}

// ===== Roses falling from the back =====
function spawnRose() {
  const r = document.createElement("span");
  r.className = "rose";
  r.textContent = "🌹";
  r.style.left = Math.random() * 100 + "vw";
  r.style.fontSize = 22 + Math.random() * 22 + "px";
  r.style.animationDuration = 5 + Math.random() * 5 + "s";
  roses.appendChild(r);
  r.addEventListener("animationend", () => r.remove());
}

function spawnPetal() {
  const p = document.createElement("span");
  p.className = "petal";
  const size = 10 + Math.random() * 10;
  p.style.width = size + "px";
  p.style.height = size + "px";
  p.style.left = Math.random() * 100 + "vw";
  p.style.animationDuration = 4 + Math.random() * 5 + "s";
  roses.appendChild(p);
  p.addEventListener("animationend", () => p.remove());
}

function startRoses() {
  for (let i = 0; i < 12; i++) setTimeout(spawnRose, i * 120);
  setInterval(spawnRose, 380);
  setInterval(spawnPetal, 220);
}

// ===== NO -> error message =====
noBtn.addEventListener("click", () => {
  const msg = ERROR_MESSAGES[noCount % ERROR_MESSAGES.length];
  noCount++;

  document.getElementById("errTitle").textContent = msg.title;
  document.getElementById("errText").innerHTML =
    msg.text + '<span class="error-code">' + msg.code + "</span>";

  errorOverlay.hidden = false;
  // restart the pop + shake animation every time
  const win = errorOverlay.querySelector(".error-window");
  win.style.animation = "none";
  void win.offsetWidth;
  win.style.animation = "";

  tryAgainBtn.focus();

  // every "No" makes the Yes button a little bigger
  const grow = 1 + Math.min(noCount * 0.15, 0.75);
  yesBtn.style.setProperty("--grow", grow);
  yesBtn.style.margin = (grow - 1) * 20 + "px";
});

tryAgainBtn.addEventListener("click", () => {
  errorOverlay.hidden = true;
  yesBtn.focus();
});
