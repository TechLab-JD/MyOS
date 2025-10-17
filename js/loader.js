// loader.js
async function loadApps() {
  const response = await fetch('/MyOS/data/modules.json');
  const apps = await response.json();

  const appList = document.getElementById('app-list');
  const appWindows = document.getElementById('app-windows');

  apps.forEach(app => {
    // ====== 1️⃣ Create app icon in app list ======
    const iconBtn = document.createElement('button');
    iconBtn.className = 'app-icon';
    iconBtn.title = app.name;
    iconBtn.dataset.app = app.id; // important for apps panel
    iconBtn.innerHTML = `<img src="${app.icon}" alt="${app.name}" />`;
    appList.appendChild(iconBtn);

    // ====== 2️⃣ Fetch app HTML ======
    fetch(app.html)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const appWindow = doc.querySelector('.app-window');
        if (!appWindow) return;

        // ====== 3️⃣ Import app window into DOM ======
        const imported = document.importNode(appWindow, true);
        imported.style.display = 'none';          // hide initially
        imported.id = app.id;                      // ensure launchApp() can find it
        imported.dataset.app = app.id;             // optional but useful
        appWindows.appendChild(imported);

        // ====== 4️⃣ Inject CSS ======
        if (app.css && !document.querySelector(`link[href="${app.css}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = app.css;
          document.head.appendChild(link);
        }

        // ====== 5️⃣ Inject JS with base path ======
        if (app.js && !document.querySelector(`script[src="${app.js}"]`)) {
          const script = document.createElement('script');
          // Pass the app base path as a global variable
          script.textContent = `window.APP_BASE = "${app.js.replace(/app\.js$/, '')}";`;
          document.body.appendChild(script);

          const scriptModule = document.createElement('script');
          scriptModule.src = app.js;
          scriptModule.type = 'module'; // ensure ES module context if needed
          document.body.appendChild(scriptModule);
}

        // ====== 6️⃣ Setup window with WindowManager ======
        if (window.windowManager) {
          Promise.resolve().then(() => window.windowManager.setupWindow(imported));
        }

        // ====== 7️⃣ Show app when icon is clicked ======
        iconBtn.addEventListener('click', () => {
          imported.hidden = false;
          imported.style.display = 'flex';
          if (window.windowManager) {
            window.windowManager.setupWindow(imported);
            window.windowManager.bringToFront(imported);
          }
        });
      })
      .catch(err => console.error('Failed to load app:', app.id, err));
  });
}

// Initialize apps after DOM is ready
document.addEventListener('DOMContentLoaded', loadApps);
