(function(){
  const app = document.getElementById('temp');
  const header = app.querySelector('.app-header');
  const closeBtn = app.querySelector('.close-btn');
  const minimizeBtn = app.querySelector('.minimize-btn');
  const resizeHandle = app.querySelector('.resize-handle');

  // Close
  closeBtn.addEventListener('click', () => {
    app.style.display = 'none';
  });

  // Minimize
  minimizeBtn.addEventListener('click', () => {
    const content = app.querySelector('.app-content');
    if (content.style.display === 'none') {
      content.style.display = 'block';
      resizeHandle.style.display = 'block';
    } else {
      content.style.display = 'none';
      resizeHandle.style.display = 'none';
    }
  });

  // Drag
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

  // Resize
  let isResizing = false;
  resizeHandle.addEventListener('mousedown', (e) => { 
    isResizing = true; 
    e.preventDefault(); 
  });
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    app.style.width = e.clientX - app.offsetLeft + 'px';
    app.style.height = e.clientY - app.offsetTop + 'px';
  });
  document.addEventListener('mouseup', () => { isResizing = false; });
})();
