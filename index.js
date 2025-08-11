const TARGET = new Date("2025-08-11T22:25:00");
const ONTIME_DURATION = 30 * 1000;

const musicBefore = document.getElementById("musicBefore");
const musicOnTime = document.getElementById("musicOnTime");
const musicAfter = document.getElementById("musicAfter");
const autoplayNote = document.getElementById("autoplayNote");

let reached = false;
let confettiInterval = null;
let stage = "before"; // before | ontime | after

// ===== PLAY HELPER =====
async function tryPlay(audio) {
  try {
    await audio.play();
  } catch {
    console.log("Autoplay blocked, waiting for user interaction.");
  }
}

// Unlock audio on user gesture if blocked
function primeAudioOnGesture() {
  if (stage === "before") tryPlay(musicBefore);
  else if (stage === "ontime") tryPlay(musicOnTime);
  else if (stage === "after") tryPlay(musicAfter);
  window.removeEventListener("click", primeAudioOnGesture);
  window.removeEventListener("touchend", primeAudioOnGesture);
}
window.addEventListener("click", primeAudioOnGesture);
window.addEventListener("touchend", primeAudioOnGesture);

// ===== COUNTDOWN =====
function pad(n) {
  return String(n).padStart(2, "0");
}
function renderCountdown(diffMs) {
  const totalSec = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSec / 86400);
  const hrs = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  document.getElementById("d").textContent = days;
  document.getElementById("h").textContent = hrs;
  document.getElementById("m").textContent = mins;
  document.getElementById("s").textContent = secs;
  const bigH = days * 24 + hrs;
  document.getElementById("bigTime").textContent = `${pad(bigH)}:${pad(
    mins
  )}:${pad(secs)}`;
}

// ===== MUSIC CONTROL =====
function startBeforeMusic() {
  stage = "before";
  localStorage.setItem("stage", stage);
  tryPlay(musicBefore);
}

function onReachMidnight() {
  stage = "ontime";
  localStorage.setItem("stage", stage);

  musicBefore.pause();
  musicBefore.currentTime = 0;
  musicOnTime.currentTime = 0;
  musicOnTime.play().catch(() => autoplayNote?.removeAttribute("hidden"));

  // After ONTIME_DURATION, go to AFTER stage
  setTimeout(() => {
    if (stage === "ontime") startAfterMusic();
  }, ONTIME_DURATION);

  switchToBirthdayScreen();
  startConfettiContinuous();
}

function startAfterMusic() {
  stage = "after";
  localStorage.setItem("stage", stage);

  musicOnTime.pause();
  musicOnTime.currentTime = 0;
  musicAfter.currentTime = 0;
  musicAfter.play().catch(() => autoplayNote?.removeAttribute("hidden"));
}

// ===== SCREEN =====
function switchToBirthdayScreen() {
  const tpl = document
    .getElementById("birthdayTemplate")
    .content.cloneNode(true);
  document.getElementById("app").replaceWith(tpl);
  const giftBtn = document.getElementById("giftBtn");
  if (giftBtn) {
    giftBtn.addEventListener("click", () => {
      musicAfter.pause();
      startConfettiContinuous();
      window.open("gift.html", "_blank");
    });
  }
}

// ===== CONFETTI =====
const EMOJIS = ["🎉", "🎈", "🎂", "✨", "💖", "🎊", "🧁", "⭐", "💫"];
function spawnEmoji() {
  const el = document.createElement("div");
  el.className = "confetti";
  el.textContent = EMOJIS[(Math.random() * EMOJIS.length) | 0];
  const startX = Math.random() * window.innerWidth;
  const xEnd = Math.random() * 120 - 60;
  const duration = (6 + Math.random() * 5).toFixed(2) + "s";
  el.style.left = startX + "px";
  el.style.setProperty("--x", "0px");
  el.style.setProperty("--x-end", xEnd + "px");
  el.style.setProperty("--dur", duration);
  document.getElementById("confetti-container").appendChild(el);
  el.addEventListener("animationend", () => el.remove());
  setTimeout(() => el.remove(), 15000);
}
function startConfettiContinuous() {
  for (let i = 0; i < 40; i++) spawnEmoji();
  confettiInterval = setInterval(() => {
    for (let i = 0; i < 5; i++) spawnEmoji();
  }, 500);
  setTimeout(() => {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }, 30000);
}

// ===== INITIAL LOAD CHECK =====
(function init() {
  const now = Date.now();
  const targetTime = TARGET.getTime();

  if (now >= targetTime + ONTIME_DURATION) {
    // AFTER stage
    startAfterMusic();
    switchToBirthdayScreen();
  } else if (now >= targetTime) {
    // ONTIME stage
    onReachMidnight();
  } else {
    // BEFORE stage
    startBeforeMusic();
    const timer = setInterval(() => {
      const diff = TARGET.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        onReachMidnight();
      } else renderCountdown(diff);
    }, 1000);
    renderCountdown(targetTime - now);
  }
})();
