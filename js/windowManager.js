class WindowManager {
    constructor() {
        this.highestZIndex = 100;
        this.activeWindow = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };

        // Global event listeners
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseMove(e) {
        if (this.isDragging && this.activeWindow) {
            this.drag(e);
        } else if (this.isResizing && this.activeWindow) {
            this.resize(e);
        }
    }

    handleMouseUp() {
        this.isDragging = false;
        this.isResizing = false;
        this.activeWindow = null;
    }

    bringToFront(win) {
        this.highestZIndex += 1;
        win.style.zIndex = this.highestZIndex;
    }

    setupWindow(win) {
        if (!win || win.dataset.initialized) return;

        const header = win.querySelector('.app-header');
        const minimizeBtn = win.querySelector('.minimize-btn');
        const closeBtn = win.querySelector('.close-btn');
        const resizeHandle = win.querySelector('.resize-handle');

        if (!header || !minimizeBtn || !closeBtn) return;

        // Mark as initialized
        win.dataset.initialized = 'true';
        win.style.zIndex = this.highestZIndex++;

        // Minimize functionality
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isMinimized = win.classList.toggle('minimized');
            if (!isMinimized && win.dataset.prevHeight) {
                win.style.height = win.dataset.prevHeight;
                win.style.width = win.dataset.prevWidth;
            } else {
                win.dataset.prevHeight = win.style.height;
                win.dataset.prevWidth = win.style.width;
            }
        });

        // Close functionality
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // hide via inline style so app's author CSS doesn't override it
            win.style.display = 'none';
        });

        // Window dragging
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.app-controls')) return;
            e.preventDefault();
            this.activeWindow = win;
            this.isDragging = true;
            this.dragOffset.x = e.clientX - win.offsetLeft;
            this.dragOffset.y = e.clientY - win.offsetTop;
            this.bringToFront(win);
        });

        // Window resizing
        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.activeWindow = win;
                this.isResizing = true;
                this.bringToFront(win);
            });
        }

        // Bring to front on window click
        win.addEventListener('mousedown', () => {
            this.bringToFront(win);
        });
    }

    drag(e) {
        const win = this.activeWindow;
        if (!win) return;

        const newX = e.clientX - this.dragOffset.x;
        const newY = e.clientY - this.dragOffset.y;

        // Keep window within viewport bounds
        const maxX = window.innerWidth - win.offsetWidth;
        const maxY = window.innerHeight - win.offsetHeight;

        win.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        win.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    }

    resize(e) {
        const win = this.activeWindow;
        if (!win) return;

        const newWidth = Math.max(200, e.clientX - win.offsetLeft);
        const newHeight = Math.max(100, e.clientY - win.offsetTop);

        win.style.width = newWidth + 'px';
        win.style.height = newHeight + 'px';
    }
}

// Make WindowManager available globally
window.WindowManager = WindowManager;

// Create single instance for global use
window.windowManager = new WindowManager();

// Initialize any existing windows when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const manager = window.windowManager;
    document.querySelectorAll('.app-window').forEach(win => {
        manager.setupWindow(win);
    });