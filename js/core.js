function updateTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  document.getElementById("currentTime").textContent = formattedTime;
  document.getElementById("currentDate").textContent = formattedDate;
}

updateTime();
setInterval(updateTime, 1000);

// Popup toggle logic
const clockButton = document.getElementById("clockButton");
const clockPopup = document.getElementById("clockPopup");

clockButton.addEventListener("click", () => {
  clockPopup.classList.toggle("hidden");
});

clockPopup.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Close popup if clicking outside
document.addEventListener("click", (e) => {
  if (!clockPopup.contains(e.target) && !clockButton.contains(e.target)) {
    clockPopup.classList.add("hidden");
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const startMenu = document.getElementById('start-menu');

  if (!menuBtn || !startMenu) return;

  // Toggle menu visibility
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing immediately
    startMenu.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !startMenu.contains(e.target)) {
      startMenu.classList.remove('active');
    }
  });

  // Optional: ESC key closes the menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      startMenu.classList.remove('active');
    }
  });
});

function renderCalendar(date = new Date()) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = ""; // clear old content

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // Header
  const header = document.createElement("div");
  header.className = "calendar-header";
  header.innerHTML = `
  <button id="prevMonth" class="month-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L6.707 7l4.647 4.646a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 0 1 .708 0z"/>
    </svg>
  </button>
  <span>${date.toLocaleString("default", { month: "long" })} ${year}</span>
  <button id="nextMonth" class="month-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l5 5a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708-.708L9.293 7 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  </button>
  `;
  calendar.appendChild(header);

  

  // Weekday labels
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdaysRow = document.createElement("div");
  weekdaysRow.className = "calendar-grid weekdays";
  weekdaysRow.innerHTML = weekdays.map(d => `<strong>${d}</strong>`).join("");
  calendar.appendChild(weekdaysRow);

  // Calendar grid
  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElem = document.createElement("div");
    dayElem.className = "calendar-day";
    dayElem.textContent = day;

    // ✅ Highlight today
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

  // Navigation
  document.getElementById("prevMonth").addEventListener("click", () => {
    renderCalendar(new Date(year, month - 1, 1));
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    renderCalendar(new Date(year, month + 1, 1));
  });
}

renderCalendar();


document.addEventListener("DOMContentLoaded", () => {
  const appsButton = document.getElementById("appsButton");
  if (appsButton) {
    appsButton.addEventListener("click", openAppsPanel);
  }
});

function openAppsPanel() {
  const existing = document.getElementById("apps-window");

  if (existing) {
    // Toggle if it already exists
    existing.style.display = existing.style.display === "none" ? "flex" : "none";
    window.windowManager.bringToFront(existing);
    return;
  }

  // Create a new "Apps" window container
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

  // ✅ Load app icons dynamically from the #app-list (which loader.js populates)
  const appList = document.getElementById("app-list");
  const appsGrid = win.querySelector("#apps-grid");

  if (!appList || !appsGrid) return;

  // Wait a tick in case loader.js is still populating
  setTimeout(() => {
    appsGrid.innerHTML = ""; // clear "Loading..."
    const icons = appList.querySelectorAll(".app-icon");

    if (icons.length === 0) {
      appsGrid.innerHTML = "<p>No apps found.</p>";
      return;
    }

    icons.forEach(icon => {
      const clone = icon.cloneNode(true);
      clone.classList.add("apps-grid-item");
      appsGrid.appendChild(clone);
    });
  }, 300); // small delay to allow loader.js to finish
}
