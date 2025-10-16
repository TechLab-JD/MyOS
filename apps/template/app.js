document.addEventListener('DOMContentLoaded', () => {
  const apps = document.querySelectorAll('.app-window');
  let highestZIndex = 100;

  // Function to bring window to front
  function bringToFront(app) {
    highestZIndex += 1;
    app.style.zIndex = highestZIndex;
  }

  apps.forEach(app => {
    const header = app.querySelector('.app-header');
    const closeBtn = app.querySelector('.close-btn');
    const minimizeBtn = app.querySelector('.minimize-btn');
    const resizeHandle = app.querySelector('.resize-handle');
    const content = app.querySelector('.app-content');

    if (!header || !minimizeBtn || !content) return; // Skip invalid apps

    // --- Close ---
    closeBtn?.addEventListener('click', () => {
      app.style.display = 'none';
    });

    // --- Minimize / Restore ---
    minimizeBtn.addEventListener('click', () => {
      const isMinimized = app.classList.toggle('minimized');
      // Store current height before minimizing
      if (!isMinimized && !app.dataset.prevHeight) {
        app.style.height = app.dataset.prevHeight || '300px';
      }
      // Toggle icon/text feedback
      minimizeBtn.textContent = isMinimized ? '🗗' : '🗕';
    });

    // --- Bring to front on any interaction ---
    app.addEventListener('mousedown', () => {
      bringToFront(app);
    });

    // --- Drag ---
    let isDragging = false, offsetX = 0, offsetY = 0;
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.app-controls')) return; // Don't drag if clicking controls
      isDragging = true;
      offsetX = e.clientX - app.offsetLeft;
      offsetY = e.clientY - app.offsetTop;
      bringToFront(app);
    });
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;
      
      // Keep window within viewport bounds
      const maxX = window.innerWidth - app.offsetWidth;
      const maxY = window.innerHeight - app.offsetHeight;
      
      app.style.left = Math.min(Math.max(0, newLeft), maxX) + 'px';
      app.style.top = Math.min(Math.max(0, newTop), maxY) + 'px';
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    header.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // --- Resize ---
    let isResizing = false;
    resizeHandle?.addEventListener('mousedown', (e) => { 
      isResizing = true; 
      e.preventDefault(); 
    });
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      app.style.width = e.clientX - app.offsetLeft + 'px';
      app.style.height = e.clientY - app.offsetTop + 'px';
    });
    document.addEventListener('mouseup', () => { isResizing = false; });
  });
});
