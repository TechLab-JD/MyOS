async function loadApps() {
  const response = await fetch('/MyOS/data/modules.json');
  const apps = await response.json();

  const appList = document.getElementById('app-list');
  const appWindows = document.getElementById('app-windows');

  apps.forEach(app => {
    // add icon to the app list
    const iconBtn = document.createElement('button');
    iconBtn.className = 'app-icon';
    iconBtn.title = app.name;
    iconBtn.innerHTML = `<img src="${app.icon}" alt="${app.name}" />`;
    appList.appendChild(iconBtn);

    // fetch app HTML and import the .app-window node
    fetch(app.html)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const appWindow = doc.querySelector('.app-window');
        if (!appWindow) return;

    // import node into current document to ensure scripts/styles execute in correct context
    const imported = document.importNode(appWindow, true);
    // hide via inline style so author CSS can't override it
    imported.style.display = 'none';
    appWindows.appendChild(imported);

        // inject CSS (only if not already present)
        if (app.css && !document.querySelector(`link[href="${app.css}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = app.css;
          document.head.appendChild(link);
        }

        // inject JS (only if not already present)
        if (app.js && !document.querySelector(`script[src="${app.js}"]`)) {
          const script = document.createElement('script');
          script.src = app.js;
          script.defer = true;
          document.body.appendChild(script);
        }

        // register with windowManager if available (defer to allow app scripts to run)
        if (window.windowManager) {
          Promise.resolve().then(() => window.windowManager.setupWindow(imported));
        }

        // show the app when its icon is clicked
        iconBtn.addEventListener('click', () => {
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

document.addEventListener('DOMContentLoaded', loadApps);
