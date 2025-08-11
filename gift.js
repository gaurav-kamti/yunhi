/* ========= Configuration ========= */
const bgm = document.getElementById("bgmSong");
// your one BGM file
bgm.loop = true;
bgm.volume = 0.45; // adjust loudness

const memes = [
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
  "https://media.giphy.com/media/l3vR85PnGsBwu1PFK/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3o6ZsQFq0ZHSs4cM7a/giphy.gif",
];

// const friendMessages = [
//   {
//     name: "Aarav",
//     text: "Happy birthday! You light up every room — keep shining ✨",
//   },
//   {
//     name: "Meera",
//     text: "Hope this year brings you all the laughter and cake 🍰",
//   },
//   {
//     name: "Rohan",
//     text: "To more game nights and late chats — love you bro! 🥳",
//   },
//   {
//     name: "Tara",
//     text: "Your kindness inspires me. Have a magical birthday 💖",
//   },
//   {
//     name: "Kabir",
//     text: "Another year of epic memories — let's make more soon! 🚀",
//   },
//   {
//     name: "Nisha",
//     text: "You deserve the whole world. Happiest of birthdays! 🌟",
//   },
// ];

const photos = [
  { src: "img/photo1.jpg", caption: "That crazy trip we took" },
  { src: "img/photo2.jpg", caption: "Late night laughs — unforgettable" },
  { src: "img/photo3.jpg", caption: "Our silly selfie moment" },
  { src: "img/photo4.jpg", caption: "When everything went right" },
  { src: "img/photo5.jpg", caption: "One of my favorite days with you" },
];

const poemText = `A tiny light on a quiet night,
You bloom and make the world more bright.
Laughter follows wherever you roam,
May warmth and wonder lead you home.`;

const letterText = `Dear Friend,

On this special day I wanted to tell you how much you mean to me.
You've been a companion, a partner-in-crime, and the kindest heart.
Thank you for every memory — the silly, the deep, the loud laughs.
I hope this year gives you everything you dream of and more.

Always with warmth,
— Your friend`;

/* ========= Confetti & Emoji FX ========= */
const EMOJIS = ["🎉", "🎊", "✨", "💖", "🎈", "🧁", "⭐"];
function spawnConfettiBurst(x, y, count = 18) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.position = "absolute";
    el.style.left = x + (Math.random() * 180 - 90) + "px";
    el.style.top = y + (Math.random() * 80 - 40) + "px";
    el.style.fontSize = 12 + Math.random() * 22 + "px";
    el.style.opacity = 1;
    el.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
    el.style.transition = `transform ${
      1.2 + Math.random() * 1.2
    }s cubic-bezier(.2,.8,.3,1), opacity 1.3s`;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translateY(${
        120 + Math.random() * 300
      }px) translateX(${Math.random() * 200 - 100}px) rotate(${
        Math.random() * 720
      }deg) scale(${0.9 + Math.random() * 1.4})`;
      el.style.opacity = 0;
    });
    setTimeout(() => el.remove(), 1800);
  }
}

/* ========= Stage Management ========= */
let currentStage = 1;
const totalStages = 5;

function showStage(n) {
  for (let i = 1; i <= totalStages; i++) {
    const el = document.getElementById("st" + i);
    if (!el) continue;
    if (i === n) {
      el.classList.add("active");
      el.setAttribute("aria-hidden", "false");
    } else {
      el.classList.remove("active");
      el.setAttribute("aria-hidden", "true");
    }
  }
  currentStage = n;
  // ✅ Start BGM automatically on Stage 1
  if (n === 1 && bgm.paused) {
    bgm.play().catch(() => {
      console.log("Autoplay blocked — will play after first click.");
    });
  }
}

function cuteClickSpark(btn) {
  for (let i = 0; i < 6; i++) {
    const sp = document.createElement("div");
    sp.className = "sparkle";
    sp.textContent = ["✨", "💕", "🎀", "✨", "💫", "🌸"][
      Math.floor(Math.random() * 6)
    ];
    const r = btn.getBoundingClientRect();
    sp.style.left = r.left + r.width * Math.random() + "px";
    sp.style.top = r.top + r.height * Math.random() * 0.6 + "px";
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 900);
  }
}

/* ---- Stage 1: Meme Explosion ---- */
let memeInterval = null;
function startMemeStage() {
  memeInterval = setInterval(() => {
    if (currentStage !== 1) return;
    const img = document.createElement("img");
    img.src = memes[Math.floor(Math.random() * memes.length)];
    img.className = "meme";
    img.style.left = Math.random() * (window.innerWidth - 180) + 40 + "px";
    img.style.top = Math.random() * (window.innerHeight - 220) + 60 + "px";
    img.style.transform = `scale(${0.9 + Math.random() * 0.7})`;
    document.body.appendChild(img);
    setTimeout(() => img.remove(), 3500);
    if (Math.random() < 0.25)
      spawnConfettiBurst(
        parseFloat(img.style.left),
        parseFloat(img.style.top),
        10
      );
  }, 700);
}
function stopMemeStage() {
  clearInterval(memeInterval);
}

// /* ---- Stage 2: Messages ---- */
// function startMessagesStage() {
//   const container = document.getElementById("messages-container");
//   container.innerHTML = "";
//   let i = 0;
//   function nextMsg() {
//     if (currentStage !== 2) return;
//     if (i >= friendMessages.length) {
//       spawnConfettiBurst(window.innerWidth / 2, 150, 28);
//       return;
//     }
//     const m = friendMessages[i];
//     const msg = document.createElement("div");
//     msg.className = "msg";
//     msg.innerHTML = `<div class="avatar">${m.name.charAt(0)}</div>
//                      <div style="flex:1">
//                        <div class="who">${m.name}</div>
//                        <div class="text">${m.text}</div>
//                      </div>`;
//     container.appendChild(msg);
//     i++;
//     setTimeout(nextMsg, 1200 + Math.random() * 900);
//   }
//   nextMsg();
// }

/* ---- Stage 3: Memory Gallery ---- */
let galleryInterval = null;
let galleryIndex = 0;
function startGallery() {
  const imgEl = document.getElementById("galleryImg");
  const capEl = document.getElementById("galleryCaption");
  imgEl.src = photos[0].src;
  capEl.textContent = photos[0].caption;
  galleryIndex = 0;
  galleryInterval = setInterval(() => {
    if (currentStage !== 2) return;
    galleryIndex = (galleryIndex + 1) % photos.length;
    imgEl.style.opacity = 0;
    setTimeout(() => {
      imgEl.src = photos[galleryIndex].src;
      capEl.textContent = photos[galleryIndex].caption;
      imgEl.style.opacity = 1;
      spawnConfettiBurst(window.innerWidth / 2, 120, 22);
    }, 520);
  }, 3300);
}
function stopGallery() {
  clearInterval(galleryInterval);
}

/* ---- Stage 4: Poem ---- */
function showPoem() {
  const box = document.getElementById("poemBox");
  box.innerHTML = "";
  poemText.split("\n").forEach((ln, idx) => {
    const p = document.createElement("div");
    p.style.opacity = 0;
    p.style.transform = "translateY(10px)";
    p.style.transition = `opacity .6s ease ${idx * 220}ms, transform .6s ease ${
      idx * 220
    }ms`;
    p.textContent = ln;
    box.appendChild(p);
    setTimeout(() => {
      p.style.opacity = 1;
      p.style.transform = "translateY(0)";
    }, 40);
  });
}

/* ---- Stage 5: Personal Letter ---- */
let typingTimer = null;
function bindSeal() {
  const seal = document.getElementById("sealBtn");
  const paper = document.getElementById("paper");
  seal.addEventListener(
    "click",
    () => {
      paper.classList.add("open");
      const el = document.createElement("div");
      el.className = "typewriter";
      paper.innerHTML = "";
      paper.appendChild(el);
      let i = 0;
      function type() {
        if (currentStage !== 4) return;
        if (i < letterText.length) {
          el.textContent += letterText.charAt(i);
          i++;
          typingTimer = setTimeout(type, 32 + Math.random() * 22);
        } else {
          document.getElementById("nextBtn4").classList.remove("hidden");
        }
      }
      setTimeout(type, 220);
    },
    { once: true }
  );
}

function spawnBalloonLoop() {
  setInterval(() => {
    if (currentStage === 5) spawnBalloon();
  }, 600);
}

/* ---- Navigation ---- */
function goToNext() {
  cuteClickSpark(document.querySelector(".next-btn"));
  if (currentStage === 1) stopMemeStage();
  if (currentStage === 2) stopGallery();
  if (currentStage === 4) clearTimeout(typingTimer);
  const next = Math.min(totalStages, currentStage + 1);
  showStage(next);

  if (next === 2) startGallery(); // gallery is now stage 2
  if (next === 3) showPoem(); // poem is now stage 3
  if (next === 4) bindSeal(); // letter is now stage 4
  if (next === 5) spawnBalloonLoop(); // balloons is now stage 5
}

/* ---- Event Bindings ---- */
document.getElementById("nextBtn1").addEventListener("click", goToNext);
document.getElementById("nextBtn2").addEventListener("click", goToNext);
document.getElementById("nextBtn3").addEventListener("click", goToNext);
document.getElementById("nextBtn4").addEventListener("click", goToNext);

document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => cuteClickSpark(btn));
});

/* ---- Start ---- */
document.getElementById("st1").addEventListener("click", (e) => {
  if (currentStage === 1 && bgm.paused) bgm.play(); // start BGM on first click
  spawnConfettiBurst(e.clientX, e.clientY, 20);
});
showStage(1);
startMemeStage();
