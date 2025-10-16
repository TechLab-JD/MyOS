// Make WindowManager available globally
window.WindowManager = class WindowManager {
    constructor() {
        this.highestZIndex = 100;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeWindows();
        });
    }

    bringToFront(window) {
        this.highestZIndex += 1;
        window.style.zIndex = this.highestZIndex;
    }

    initializeWindows() {
        const windows = document.querySelectorAll('.app-window');
        
        windows.forEach(win => {
            this.setupWindow(win);
        });
    }

    setupWindow(win) {
        const header = win.querySelector('.app-header');
        const minimizeBtn = win.querySelector('.minimize-btn');
        const closeBtn = win.querySelector('.close-btn');
        const content = win.querySelector('.app-content');
        const resizeHandle = win.querySelector('.resize-handle');

        if (!header || !minimizeBtn || !closeBtn || !content) return;

        // Initial z-index
        win.style.zIndex = this.highestZIndex++;

        // Minimize functionality
        minimizeBtn.addEventListener('click', () => {
            win.classList.toggle('minimized');
            if (!win.classList.contains('minimized')) {
                win.style.height = win.dataset.prevHeight || '300px';
            } else {
                win.dataset.prevHeight = win.style.height;
            }
        });

        // Close functionality
        closeBtn.addEventListener('click', () => {
            win.style.display = 'none';
        });

        // Dragging
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const startDragging = (e) => {
            if (e.target.closest('.app-controls')) return;
            isDragging = true;
            startX = e.clientX - win.offsetLeft;
            startY = e.clientY - win.offsetTop;
            this.bringToFront(win);
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            
            // Keep window within viewport
            const maxX = window.innerWidth - win.offsetWidth;
            const maxY = window.innerHeight - win.offsetHeight;
            
            win.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            win.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
        };

        const stopDragging = () => {
            isDragging = false;
        };

        // Resizing
        let isResizing = false;

        const startResizing = (e) => {
            isResizing = true;
            e.preventDefault();
            this.bringToFront(win);
        };

        const resize = (e) => {
            if (!isResizing) return;
            
            const newWidth = e.clientX - win.offsetLeft;
            const newHeight = e.clientY - win.offsetTop;
            
            win.style.width = Math.max(200, newWidth) + 'px';
            win.style.height = Math.max(100, newHeight) + 'px';
        };

        const stopResizing = () => {
            isResizing = false;
        };

        // Event Listeners
        header.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', startResizing);
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResizing);
        }

        // Bring to front on click
        win.addEventListener('mousedown', () => this.bringToFront(win));
    }
}

// Initialize window manager
const windowManager = new WindowManager();