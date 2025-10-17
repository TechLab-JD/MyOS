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
      <div id="apps-grid" class="apps-grid">
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
    const icons = appList.querySelectorAll(".app-icon");

    if (icons.length === 0) {
      appsGrid.innerHTML = "<p>No apps found.</p>";
      return;
    }

    icons.forEach(icon => {
      const wrapper = document.createElement("div");
      wrapper.className = "apps-grid-item";
      const clone = icon.cloneNode(true);

      // add app label below the icon
      const appName = document.createElement("div");
      appName.className = "app-name";
      appName.textContent = icon.title || icon.dataset.name || "App";

      wrapper.appendChild(clone);
      wrapper.appendChild(appName);
      appsGrid.appendChild(wrapper);

      // 🎯 single-click launches the app
      wrapper.addEventListener("click", () => {
        const appId = icon.dataset.app;
        launchApp(appId);
      });
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
