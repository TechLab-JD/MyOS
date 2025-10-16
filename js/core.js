function updateTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("currentTime").textContent = formattedTime;
}

updateTime();
setInterval(updateTime, 1000);

// Popup toggle logic
const clockButton = document.getElementById("clockButton");
const clockPopup = document.getElementById("clockPopup");

clockButton.addEventListener("click", () => {
  clockPopup.classList.toggle("hidden");
});

// Optional: close popup if you click outside
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
