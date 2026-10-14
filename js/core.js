function updateTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  document.getElementById("currentTime").textContent = formattedTime;
  document.getElementById("currentDate").textContent = formattedDate;
}

updateTime();
setInterval(updateTime, 1000);

// Clock popup logic
const clockButton = document.getElementById("clockButton");
const clockPopup = document.getElementById("clockPopup");

clockButton.addEventListener("click", () => {
  clockPopup.classList.toggle("hidden");
});

clockPopup.addEventListener("click", (e) => e.stopPropagation());

document.addEventListener("click", (e) => {
  if (!clockPopup.contains(e.target) && !clockButton.contains(e.target)) {
    clockPopup.classList.add("hidden");
  }
});

// Start menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const startMenu = document.getElementById('start-menu');
  if (!menuBtn || !startMenu) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !startMenu.contains(e.target)) {
      startMenu.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') startMenu.classList.remove('active');
  });
});

// ===============================
// 📅 Calendar
// ===============================
function renderCalendar(date = new Date()) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const header = document.createElement("div");
  header.className = "calendar-header";
  header.innerHTML = `
    <button id="prevMonth" class="month-btn">◀</button>
    <span>${date.toLocaleString("default", { month: "long" })} ${year}</span>
    <button id="nextMonth" class="month-btn">▶</button>
  `;
  calendar.appendChild(header);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdaysRow = document.createElement("div");
  weekdaysRow.className = "calendar-grid weekdays";
  weekdaysRow.innerHTML = weekdays.map(d => `<strong>${d}</strong>`).join("");
  calendar.appendChild(weekdaysRow);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  for (let i = 0; i < firstWeekday; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElem = document.createElement("div");
    dayElem.className = "calendar-day";
    dayElem.textContent = day;

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayElem.classList.add("today");
    }

    grid.appendChild(dayElem);
  }

  calendar.appendChild(grid);

  document.getElementById("prevMonth").addEventListener("click", () => {
    renderCalendar(new Date(year, month - 1, 1));
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    renderCalendar(new Date(year, month + 1, 1));
  });
}

renderCalendar();

// ===============================
// 💻 Applications Panel
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // find the “💻 Apps” button in the start menu
  const appsButton = Array.from(document.querySelectorAll(".menu-list button"))
    .find(btn => btn.textContent.includes("💻"));

  if (appsButton) {
    appsButton.addEventListener("click", openAppsPanel);
  }
});

function openAppsPanel() {
  const existing = document.getElementById("apps-window");
  if (existing) {
    existing.style.display = existing.style.display === "none" ? "flex" : "none";
    if (window.windowManager) window.windowManager.bringToFront(existing);
    return;
  }

  // Create Applications Window
  const win = document.createElement("div");
  win.className = "app-window";
  win.id = "apps-window";
  win.style.left = "250px";
  win.style.top = "150px";
  win.style.width = "600px";
  win.style.height = "400px";
  win.innerHTML = `
    <div class="app-header">
      <div class="app-title">💻 Applications</div>
      <div class="app-controls">
        <button class="minimize-btn">—</button>
        <button class="close-btn">✖</button>
      </div>
    </div>
    <div class="app-content">
      <div id="apps-grid" class="apps-body">
        <p>Loading applications...</p>
      </div>
    </div>
    <div class="resize-handle"></div>
  `;
  document.getElementById("app-windows").appendChild(win);
  window.windowManager.setupWindow(win);

  const appsGrid = win.querySelector("#apps-grid");
  const appList = document.getElementById("app-list");

  setTimeout(() => {
    appsGrid.innerHTML = "";
    const icons = Array.from(appList.querySelectorAll(".app-icon"));

    if (icons.length === 0) {
      appsGrid.innerHTML = "<p>No apps found.</p>";
      return;
    }

    // Group the installed apps by category (from the catalog).
    const CAT_ORDER = ["Productivity", "Utilities", "Media", "Creative", "Games", "Developer"];
    const catOf = {};
    ((window.MyOS && window.MyOS.catalog) || []).forEach(a => { catOf[a.id] = a.category || "Other"; });
    const byCat = {};
    icons.forEach(icon => { const c = catOf[icon.dataset.app] || "Other"; (byCat[c] = byCat[c] || []).push(icon); });
    const cats = CAT_ORDER.filter(c => byCat[c])
      .concat(Object.keys(byCat).filter(c => CAT_ORDER.indexOf(c) < 0).sort());

    cats.forEach(c => {
      const h = document.createElement("div");
      h.className = "apps-cat-h";
      h.textContent = c;
      const grid = document.createElement("div");
      grid.className = "apps-grid";
      byCat[c].forEach(icon => {
        const wrapper = document.createElement("div");
        wrapper.className = "apps-grid-item";
        wrapper.appendChild(icon.cloneNode(true));
        const appName = document.createElement("div");
        appName.className = "app-name";
        appName.textContent = icon.title || icon.dataset.name || "App";
        wrapper.appendChild(appName);
        wrapper.addEventListener("click", () => launchApp(icon.dataset.app));
        grid.appendChild(wrapper);
      });
      appsGrid.append(h, grid);
    });
  }, 300);
}

// ===============================
// 🚀 Launch App by ID
// ===============================
function launchApp(appId) {
  const appWindows = document.querySelectorAll(`#app-windows .app-window`);
  for (const win of appWindows) {
    if (win.id === appId || win.dataset.app === appId) {
      win.style.display = "flex";
      if (window.windowManager) window.windowManager.bringToFront(win);
      return;
    }
  }

  console.warn(`App with id "${appId}" not found.`);
}

// ===============================
// 🖼️ Wallpaper (persisted to localStorage)
// ===============================
const WALLPAPER_KEY = "myos_wallpaper";

function applyWallpaper(url) {
  const home = document.querySelector(".homescreen");
  if (!home) return;
  if (url) {
    const safe = String(url).replace(/"/g, "%22"); // keep it inside the url("...")
    home.style.backgroundImage = `url("${safe}")`;
  } else {
    home.style.backgroundImage = ""; // fall back to the CSS default wallpaper
  }
}

try {
  const savedWall = localStorage.getItem(WALLPAPER_KEY);
  if (savedWall) applyWallpaper(savedWall);
} catch (e) {}

// ===============================
// ⚙️ Settings window (theme + wallpaper)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const settingsButton = document.getElementById("settingsButton");
  if (settingsButton) settingsButton.addEventListener("click", openSettings);
});

function openSettings() {
  const existing = document.getElementById("settings-window");
  if (existing) {
    existing.style.display = "flex";
    if (window.windowManager) window.windowManager.bringToFront(existing);
    return;
  }

  const win = document.createElement("div");
  win.className = "app-window";
  win.id = "settings-window";
  win.style.left = "220px";
  win.style.top = "120px";
  win.style.width = "360px";
  win.style.height = "300px";
  win.innerHTML = `
    <div class="app-header">
      <div class="app-title">⚙️ Settings</div>
      <div class="app-controls">
        <button class="minimize-btn">—</button>
        <button class="close-btn">✖</button>
      </div>
    </div>
    <div class="app-content" style="padding:16px; overflow:auto;">
      <p style="margin:0 0 6px;"><strong>Theme</strong></p>
      <button id="settings-theme-btn" type="button">Toggle light / dark</button>
      <p style="margin:16px 0 6px;"><strong>Wallpaper URL</strong></p>
      <input id="settings-wallpaper" type="url" placeholder="https://… or assets/wallpaper.png" style="width:100%; box-sizing:border-box;">
      <div style="margin-top:10px; display:flex; gap:8px;">
        <button id="settings-wallpaper-apply" type="button">Apply</button>
        <button id="settings-wallpaper-reset" type="button">Reset</button>
      </div>
    </div>
    <div class="resize-handle"></div>
  `;
  document.getElementById("app-windows").appendChild(win);
  if (window.windowManager) window.windowManager.setupWindow(win);

  win.querySelector("#settings-theme-btn").addEventListener("click", () => {
    const t = document.getElementById("theme-toggle-btn");
    if (t) t.click();
  });

  const wallInput = win.querySelector("#settings-wallpaper");
  try { wallInput.value = localStorage.getItem(WALLPAPER_KEY) || ""; } catch (e) {}

  win.querySelector("#settings-wallpaper-apply").addEventListener("click", () => {
    const url = wallInput.value.trim();
    applyWallpaper(url);
    try { url ? localStorage.setItem(WALLPAPER_KEY, url) : localStorage.removeItem(WALLPAPER_KEY); } catch (e) {}
  });
  win.querySelector("#settings-wallpaper-reset").addEventListener("click", () => {
    wallInput.value = "";
    applyWallpaper("");
    try { localStorage.removeItem(WALLPAPER_KEY); } catch (e) {}
  });
}

// ===============================
// 🔍 App search — filters the Applications panel (no more 404 navigation)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();          // the old form action pointed at a 404
    openAppsPanel();
    setTimeout(() => filterApps(input.value), 350); // wait for the grid to populate
  });
  input.addEventListener("input", () => filterApps(input.value));
});

function filterApps(query) {
  const grid = document.getElementById("apps-grid");
  if (!grid) return;
  const q = (query || "").trim().toLowerCase();
  grid.querySelectorAll(".apps-grid-item").forEach((item) => {
    const nameEl = item.querySelector(".app-name");
    const name = (nameEl ? nameEl.textContent : "").toLowerCase();
    item.style.display = (!q || name.includes(q)) ? "" : "none";
  });
}

// ===============================
// 🎵 Taskbar music mini-player
// ===============================
(function wireMusicWidget() {
  const w = document.getElementById('trayMusic');
  if (!w) return;
  const title = document.getElementById('tm-title');
  const play = document.getElementById('tm-play');

  function update(s) {
    if (!s || !s.track) { w.setAttribute('hidden', ''); return; }
    w.removeAttribute('hidden');
    title.textContent = s.track;
    play.textContent = s.playing ? '⏸' : '▶';
  }
  const ctl = (fn) => () => { if (window.MyOS && window.MyOS.music) window.MyOS.music[fn](); };

  window.addEventListener('myos:music', (e) => update(e.detail));
  document.getElementById('tm-prev').addEventListener('click', ctl('prev'));
  play.addEventListener('click', ctl('toggle'));
  document.getElementById('tm-next').addEventListener('click', ctl('next'));
  title.addEventListener('click', () => { if (window.MyOS && window.MyOS.openApp) window.MyOS.openApp('MusicApp'); });

  // In case music was already loaded before this ran.
  if (window.MyOS && window.MyOS.music && window.MyOS.music.getState) update(window.MyOS.music.getState());
})();
