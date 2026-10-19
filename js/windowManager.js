class WindowManager {
    constructor() {
        this.highestZIndex = 100;
        this.activeWindow = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.snapHint = null; // translucent preview of where a drag will snap

        // Pointer Events cover mouse, touch, and pen with one code path,
        // so windows are draggable/resizable on phones and tablets too.
        document.addEventListener('pointermove', this.handlePointerMove.bind(this));
        document.addEventListener('pointerup', this.handlePointerUp.bind(this));
        document.addEventListener('pointercancel', this.handlePointerUp.bind(this));
    }

    handlePointerMove(e) {
        if (this.isDragging && this.activeWindow) {
            e.preventDefault();
            this.drag(e);
            this.showSnapHint(this.snapZoneFor(e.clientX, e.clientY));
        } else if (this.isResizing && this.activeWindow) {
            e.preventDefault();
            this.resize(e);
        }
    }

    handlePointerUp(e) {
        if (this.isDragging && this.activeWindow && e) {
            const zone = this.snapZoneFor(e.clientX, e.clientY);
            if (zone) this.snapTo(this.activeWindow, zone);
        }
        this.clearSnapHint();
        this.isDragging = false;
        this.isResizing = false;
        this.activeWindow = null;
    }

    bringToFront(win) {
        this.highestZIndex += 1;
        win.style.zIndex = this.highestZIndex;
        if (window.MyOS && win && win.id) window.MyOS.activeAppId = win.id;
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

        // Stop touch from scrolling/zooming the page while dragging these handles.
        header.style.touchAction = 'none';
        if (resizeHandle) resizeHandle.style.touchAction = 'none';

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
            // Stop the app's background activity (looping audio, timers) before hiding,
            // so a closed app doesn't keep running. hide via inline style so the app's
            // author CSS doesn't override it.
            if (window.MyOS && typeof window.MyOS.stopApp === 'function') window.MyOS.stopApp(win.id);
            win.style.display = 'none';
        });

        // Track which app the user is interacting with, so applife.js can attribute
        // the timers/audio an app starts to that app (and stop them on close).
        win.addEventListener('pointerdown', () => {
            if (window.MyOS && win.id) window.MyOS.activeAppId = win.id;
        }, true);

        // Double-click the header to maximize / restore
        header.addEventListener('dblclick', (e) => {
            if (e.target.closest('.app-controls')) return;
            this.toggleMaximize(win);
        });

        // Window dragging
        header.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.app-controls')) return;
            if (e.button && e.button !== 0) return; // primary button / touch only
            e.preventDefault();
            // Dragging a maximized window restores it first (feels natural).
            if (win.classList.contains('maximized')) this.restore(win);
            this.activeWindow = win;
            this.isDragging = true;
            this.dragOffset.x = e.clientX - win.offsetLeft;
            this.dragOffset.y = e.clientY - win.offsetTop;
            this.bringToFront(win);
        });

        // Window resizing
        if (resizeHandle) {
            resizeHandle.addEventListener('pointerdown', (e) => {
                if (e.button && e.button !== 0) return;
                e.preventDefault();
                this.activeWindow = win;
                this.isResizing = true;
                this.bringToFront(win);
            });
        }

        // Bring to front on window touch/click
        win.addEventListener('pointerdown', () => {
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

    // ===== Maximize / restore =====

    _rememberRect(win) {
        win.dataset.restoreLeft = win.style.left;
        win.dataset.restoreTop = win.style.top;
        win.dataset.restoreWidth = win.style.width;
        win.dataset.restoreHeight = win.style.height;
    }

    _area(win) {
        // The container the window lives in (the homescreen), falling back to the viewport.
        const parent = win.offsetParent;
        if (parent && parent !== document.body) {
            return { w: parent.clientWidth, h: parent.clientHeight };
        }
        return { w: window.innerWidth, h: window.innerHeight };
    }

    maximize(win) {
        if (win.classList.contains('maximized')) return;
        this._rememberRect(win);
        const { w, h } = this._area(win);
        win.classList.add('maximized');
        win.style.left = '0px';
        win.style.top = '0px';
        win.style.width = w + 'px';
        win.style.height = h + 'px';
        this.bringToFront(win);
    }

    restore(win) {
        if (!win.classList.contains('maximized') && !win.classList.contains('snapped')) return;
        win.classList.remove('maximized', 'snapped');
        if (win.dataset.restoreWidth) {
            win.style.left = win.dataset.restoreLeft || win.style.left;
            win.style.top = win.dataset.restoreTop || win.style.top;
            win.style.width = win.dataset.restoreWidth;
            win.style.height = win.dataset.restoreHeight;
        }
    }

    toggleMaximize(win) {
        if (win.classList.contains('maximized')) this.restore(win);
        else this.maximize(win);
    }

    // ===== Edge snapping (drag to top = maximize, left/right = half) =====

    snapZoneFor(x, y) {
        const EDGE = 24;
        if (y <= EDGE) return 'max';
        if (x <= EDGE) return 'left';
        if (x >= window.innerWidth - EDGE) return 'right';
        return null;
    }

    snapRect(win, zone) {
        const { w, h } = this._area(win);
        if (zone === 'max') return { left: 0, top: 0, width: w, height: h };
        if (zone === 'left') return { left: 0, top: 0, width: Math.round(w / 2), height: h };
        if (zone === 'right') return { left: Math.round(w / 2), top: 0, width: Math.round(w / 2), height: h };
        return null;
    }

    snapTo(win, zone) {
        if (zone === 'max') { this.maximize(win); return; }
        const r = this.snapRect(win, zone);
        if (!r) return;
        this._rememberRect(win);
        win.classList.add('snapped');
        win.style.left = r.left + 'px';
        win.style.top = r.top + 'px';
        win.style.width = r.width + 'px';
        win.style.height = r.height + 'px';
    }

    showSnapHint(zone) {
        if (!zone) { this.clearSnapHint(); return; }
        const win = this.activeWindow;
        if (!win) return;
        const r = this.snapRect(win, zone);
        if (!r) return;
        if (!this.snapHint) {
            this.snapHint = document.createElement('div');
            this.snapHint.style.cssText =
                'position:absolute;pointer-events:none;z-index:99998;border-radius:8px;' +
                'background:rgba(80,140,230,0.25);border:2px solid rgba(80,140,230,0.7);' +
                'transition:all 0.08s ease;';
            (win.offsetParent || document.body).appendChild(this.snapHint);
        }
        this.snapHint.style.left = r.left + 'px';
        this.snapHint.style.top = r.top + 'px';
        this.snapHint.style.width = r.width + 'px';
        this.snapHint.style.height = r.height + 'px';
        this.snapHint.style.display = 'block';
    }

    clearSnapHint() {
        if (this.snapHint) this.snapHint.remove();
        this.snapHint = null;
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
});
