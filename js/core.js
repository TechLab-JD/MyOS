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
    <button id="prevMonth">&lt;</button>
    <span>${date.toLocaleString("default", { month: "long" })} ${year}</span>
    <button id="nextMonth">&gt;</button>
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
