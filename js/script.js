const clock = document.getElementById("clock");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const colorPicker = document.getElementById("colorPicker");
const bgImage = document.getElementById("bgImage");
const bgVideo = document.getElementById("bgVideo");
const bgVideoEl = document.getElementById("bg-video");
const fontSelector = document.getElementById("fontSelector");
const themeToggle = document.getElementById("themeToggle");
const timeToggle = document.getElementById("timeToggle");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");

let is24h = false;
let wakeLock = null;

const prefs = JSON.parse(localStorage.getItem("clockPrefs")) || {};

function setFont(font) {
  document.getElementById(
    "googleFont"
  ).href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
  document.body.style.fontFamily = `'${font.replace(/\+/g, " ")}', sans-serif`;
}

function setTheme(mode) {
  document.body.classList.toggle("bg-white", mode === "light");
  document.body.classList.toggle("text-black", mode === "light");
  document.body.classList.toggle("bg-gray-900", mode !== "light");
  document.body.classList.toggle("text-white", mode !== "light");
  prefs.theme = mode;
}

function savePrefs() {
  localStorage.setItem("clockPrefs", JSON.stringify(prefs));
}

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24h,
  });
}

function startClockLoop() {
  updateClock();
  requestAnimationFrame(startClockLoop);
}

startClockLoop();

settingsBtn.onclick = () => settingsPanel.classList.toggle("hidden");
document.getElementById("closeSettings").onclick = () =>
  settingsPanel.classList.add("hidden");
themeToggle.onclick = () => setTheme(prefs.theme === "dark" ? "light" : "dark");
timeToggle.onclick = () => (is24h = !is24h);

fullscreenBtn.onclick = () => {
  document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen();
};

document.addEventListener("fullscreenchange", () => {
  settingsBtn.classList.toggle("hidden", !!document.fullscreenElement);
});

saveSettingsBtn.onclick = () => {
  prefs.color = colorPicker.value;
  clock.style.color = prefs.color;
  prefs.font = fontSelector.value;
  setFont(prefs.font);
  prefs.is24h = is24h;

  if (bgImage.files[0]) {
    const url = URL.createObjectURL(bgImage.files[0]);
    prefs.bgType = "image";
    prefs.bg = url;
    document.body.style.background = `url(${url}) center/cover no-repeat`;
    bgVideoEl.classList.add("hidden");
    bgVideoEl.src = "";
  } else if (bgVideo.files[0]) {
    const file = bgVideo.files[0];
    if (file.duration < 60) {
      alert("Please upload a video of at least 1 minute.");
      return;
    }
    const url = URL.createObjectURL(file);
    prefs.bgType = "video";
    prefs.bg = url;
    bgVideoEl.src = url;
    bgVideoEl.classList.remove("hidden");
    document.body.style.background = "";
  } else {
    prefs.bgType = null;
    prefs.bg = null;
    document.body.style.background = "";
    bgVideoEl.classList.add("hidden");
    bgVideoEl.src = "";
  }

  savePrefs();
  settingsPanel.classList.add("hidden");
};

if (prefs.color) clock.style.color = prefs.color;
if (prefs.font) setFont(prefs.font);
if (prefs.theme) setTheme(prefs.theme);
if (prefs.is24h !== undefined) is24h = prefs.is24h;
if (prefs.bgType === "image" && prefs.bg) {
  document.body.style.background = `url(${prefs.bg}) center/cover no-repeat`;
  bgVideoEl.classList.add("hidden");
} else if (prefs.bgType === "video" && prefs.bg) {
  bgVideoEl.src = prefs.bg;
  bgVideoEl.classList.remove("hidden");
  document.body.style.background = "";
}

if ("wakeLock" in navigator) {
  navigator.wakeLock.request("screen").then((lock) => (wakeLock = lock));
}
