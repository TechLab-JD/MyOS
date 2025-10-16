function updateTime() {
    const now = new Date(); // Get the current date and time
    const formattedTime = now.toLocaleTimeString(); // Format the time for display

    // Get the HTML element by its ID
    const timeDisplay = document.getElementById("currentTime");

    // Update the content of the HTML element
    timeDisplay.textContent = formattedTime;
}

// Call updateTime initially to display the time immediately
updateTime();

// Update the time every second (1000 milliseconds)
setInterval(updateTime, 1000);


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
