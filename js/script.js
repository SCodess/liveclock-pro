const clock = document.getElementById("clock");
const dateEl = document.getElementById("date");
const bgVideoEl = document.getElementById("bg-video");
const bgAudioEl = document.getElementById("bg-audio");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const colorPicker = document.getElementById("colorPicker");
const bgImage = document.getElementById("bgImage");
const bgVideoInput = document.getElementById("bgVideoInput");
const bgMusic = document.getElementById("bgMusic");
const fontSelector = document.getElementById("fontSelector");
const timeToggle = document.getElementById("timeToggle");
const dateToggle = document.getElementById("dateToggle");
const secondsToggle = document.getElementById("secondsToggle");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");

let prefs = JSON.parse(localStorage.getItem("clockPrefs")) || {
  color: "#ffffff",
  font: "Roboto",
  is24h: false,
  showDate: true,
  showSeconds: true,
  bgType: null,
  bg: null,
  music: null,
};

let is24h = prefs.is24h;
let showDate = prefs.showDate;
let showSeconds = prefs.showSeconds;

function setFont(font) {
  document.getElementById(
    "googleFont"
  ).href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
  document.body.style.fontFamily = `'${font.replace(/\+/g, " ")}', sans-serif`;
}

function updateClock() {
  const now = new Date();
  let timeOpts = {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: !is24h,
  };
  clock.textContent = now.toLocaleTimeString([], timeOpts);
  dateEl.textContent = showDate
    ? now.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
  requestAnimationFrame(updateClock);
}

function savePrefs() {
  localStorage.setItem("clockPrefs", JSON.stringify(prefs));
}

function resetPrefs() {
  localStorage.removeItem("clockPrefs");
  window.location.reload();
}

// Background handlers
function applyBackground() {
  if (prefs.bgType === "image" && prefs.bg) {
    document.body.style.background = `url(${prefs.bg}) center/cover no-repeat`;
    bgVideoEl.classList.add("hidden");
  } else if (prefs.bgType === "video" && prefs.bg) {
    bgVideoEl.src = prefs.bg;
    bgVideoEl.classList.remove("hidden");
    document.body.style.background = "";
  } else {
    document.body.style.background = "";
    bgVideoEl.classList.add("hidden");
  }
  if (prefs.music) {
    bgAudioEl.src = prefs.music;
    bgAudioEl.play().catch(() => {});
  }
}

// Event Listeners
settingsBtn.onclick = () => settingsPanel.classList.toggle("hidden");
document.getElementById("closeSettings").onclick = () =>
  settingsPanel.classList.add("hidden");
timeToggle.onclick = () => {
  is24h = !is24h;
  prefs.is24h = is24h;
  savePrefs();
};
dateToggle.onclick = () => {
  showDate = !showDate;
  prefs.showDate = showDate;
  savePrefs();
};
secondsToggle.onclick = () => {
  showSeconds = !showSeconds;
  prefs.showSeconds = showSeconds;
  savePrefs();
};
fullscreenBtn.onclick = () => {
  document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen();
};
resetSettingsBtn.onclick = resetPrefs;

saveSettingsBtn.onclick = () => {
  prefs.color = colorPicker.value;
  clock.style.color = prefs.color;
  prefs.font = fontSelector.value;
  setFont(prefs.font);
  prefs.is24h = is24h;
  prefs.showDate = showDate;
  prefs.showSeconds = showSeconds;

  if (bgImage.files[0]) {
    const url = URL.createObjectURL(bgImage.files[0]);
    prefs.bgType = "image";
    prefs.bg = url;
  } else if (bgVideoInput.files[0]) {
    const file = bgVideoInput.files[0];
    const url = URL.createObjectURL(file);
    prefs.bgType = "video";
    prefs.bg = url;
  }
  if (bgMusic.files[0]) {
    prefs.music = URL.createObjectURL(bgMusic.files[0]);
  }
  applyBackground();
  savePrefs();
  settingsPanel.classList.add("hidden");
};

// Load saved preferences
if (prefs.color) clock.style.color = prefs.color;
if (prefs.font) setFont(prefs.font);
is24h = prefs.is24h;
showDate = prefs.showDate;
showSeconds = prefs.showSeconds;
applyBackground();

updateClock();
