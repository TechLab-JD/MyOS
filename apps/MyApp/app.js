document.addEventListener('DOMContentLoaded', () => {
  const apps = document.querySelectorAll('.app-window');

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
      const collapsed = content.classList.toggle('collapsed');
      resizeHandle?.classList.toggle('collapsed', collapsed);

      // Toggle icon/text feedback (optional)
      minimizeBtn.textContent = collapsed ? '🗗' : '🗕';
    });

    // --- Drag ---
    let isDragging = false, offsetX = 0, offsetY = 0;
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - app.offsetLeft;
      offsetY = e.clientY - app.offsetTop;
      app.style.zIndex = 9999; // Bring to front
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      app.style.left = e.clientX - offsetX + 'px';
      app.style.top = e.clientY - offsetY + 'px';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

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
