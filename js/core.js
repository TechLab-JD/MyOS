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