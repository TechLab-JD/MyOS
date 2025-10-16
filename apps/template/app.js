(function(){
  const apps = document.querySelectorAll('.app-window');

  apps.forEach(app => {
    const header = app.querySelector('.app-header');
    const closeBtn = app.querySelector('.close-btn');
    const minimizeBtn = app.querySelector('.minimize-btn');
    const resizeHandle = app.querySelector('.resize-handle');
    const content = app.querySelector('.app-content');

    // Store original height dynamically
    const originalHeight = app.offsetHeight;

    // Close button
    closeBtn.addEventListener('click', () => {
      app.style.display = 'none';
    });

    // Minimize button
    minimizeBtn.addEventListener('click', () => {
      const isCollapsed = content.classList.toggle('collapsed');
      resizeHandle.classList.toggle('collapsed');

      if (isCollapsed) {
        // Keep the header visible
        app.style.height = header.offsetHeight + 'px';
      } else {
        // Restore original height
        app.style.height = originalHeight + 'px';
      }
    });

    // Drag functionality (header always draggable)
    let isDragging = false, offsetX = 0, offsetY = 0;
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - app.offsetLeft;
      offsetY = e.clientY - app.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      app.style.left = e.clientX - offsetX + 'px';
      app.style.top = e.clientY - offsetY + 'px';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

    // Resize functionality
    let isResizing = false;
    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      // Only allow resizing if not minimized
      if (!content.classList.contains('collapsed')) {
        app.style.width = e.clientX - app.offsetLeft + 'px';
        app.style.height = e.clientY - app.offsetTop + 'px';
      }
    });
    document.addEventListener('mouseup', () => { isResizing = false; });

  });
})();
