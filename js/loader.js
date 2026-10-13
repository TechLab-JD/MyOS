// loader.js — loads apps from the catalog (data/modules.json), filtered by the
// user's installed set (saved per-instance in localStorage, managed by the App
// Store). Everything hangs off window.MyOS so the App Store can drive it.

(function () {
  const CATALOG_URL = 'data/modules.json';
  const INSTALLED_KEY = 'myos.installed';

  const MyOS = (window.MyOS = window.MyOS || {});
  MyOS.catalog = [];       // all available apps
  MyOS.loaded = {};        // id -> window element (loaded this session)

  MyOS.getInstalled = function () {
    try {
      const raw = localStorage.getItem(INSTALLED_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null; // null = first run, nothing chosen yet
  };
  MyOS.setInstalled = function (ids) {
    try { localStorage.setItem(INSTALLED_KEY, JSON.stringify(ids)); } catch (e) {}
  };
  MyOS.isInstalled = function (id) {
    const inst = MyOS.getInstalled();
    return Array.isArray(inst) && inst.includes(id);
  };

  // Load one app into the DOM (icon in the Apps panel + hidden window). Idempotent.
  MyOS.loadApp = function (app) {
    if (MyOS.loaded[app.id]) return Promise.resolve(MyOS.loaded[app.id]);

    const appList = document.getElementById('app-list');
    const appWindows = document.getElementById('app-windows');

    let iconBtn = appList.querySelector('.app-icon[data-app="' + app.id + '"]');
    if (!iconBtn) {
      iconBtn = document.createElement('button');
      iconBtn.className = 'app-icon';
      iconBtn.title = app.name;
      iconBtn.dataset.app = app.id;
      const img = document.createElement('img');
      img.src = app.icon; img.alt = app.name;
      iconBtn.appendChild(img);
      appList.appendChild(iconBtn);
    }

    return fetch(app.html)
      .then((res) => res.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const appWindow = doc.querySelector('.app-window');
        if (!appWindow) return null;

        const imported = document.importNode(appWindow, true);
        imported.style.display = 'none';
        imported.id = app.id;
        imported.dataset.app = app.id;
        appWindows.appendChild(imported);

        // Default size + a cascading position, unless the app set its own.
        if (!imported.style.width) imported.style.width = (app.width || 440) + 'px';
        if (!imported.style.height) imported.style.height = (app.height || 340) + 'px';
        if (!imported.style.left) {
          const n = (MyOS._openN = (MyOS._openN || 0) + 1);
          imported.style.left = (110 + (n % 6) * 30) + 'px';
          imported.style.top = (80 + (n % 6) * 30) + 'px';
        }

        if (app.css && !document.querySelector('link[href="' + app.css + '"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = app.css;
          document.head.appendChild(link);
        }
        // Apps load as ES modules and locate themselves via import.meta.url.
        if (app.js && !document.querySelector('script[data-app-js="' + app.id + '"]')) {
          const script = document.createElement('script');
          script.src = app.js;
          script.type = 'module';
          script.dataset.appJs = app.id;
          document.body.appendChild(script);
        }

        if (window.windowManager) window.windowManager.setupWindow(imported);

        iconBtn.onclick = function () {
          imported.style.display = 'flex';
          if (window.windowManager) {
            window.windowManager.setupWindow(imported);
            window.windowManager.bringToFront(imported);
          }
        };

        MyOS.loaded[app.id] = imported;
        return imported;
      })
      .catch((err) => { console.error('Failed to load app:', app.id, err); return null; });
  };

  // Open an app (loading it on demand — used by the App Store "Launch").
  MyOS.openApp = function (id) {
    const app = MyOS.catalog.find((a) => a.id === id);
    if (!app) return;
    Promise.resolve(MyOS.loaded[id] || MyOS.loadApp(app)).then((win) => {
      if (win) {
        win.style.display = 'flex';
        if (window.windowManager) window.windowManager.bringToFront(win);
      }
    });
  };

  // Remove an app from this session (its window + Apps-panel icon).
  MyOS.unloadApp = function (id) {
    if (MyOS.loaded[id]) MyOS.loaded[id].remove();
    delete MyOS.loaded[id];
    const icon = document.querySelector('#app-list .app-icon[data-app="' + id + '"]');
    if (icon) icon.remove();
  };

  MyOS.init = function () {
    return fetch(CATALOG_URL)
      .then((res) => res.json())
      .then((catalog) => {
        MyOS.catalog = catalog;
        const installed = MyOS.getInstalled();
        if (installed === null) {
          // First run — let the App Store onboarding pick the starting set.
          if (typeof MyOS.firstRun === 'function') MyOS.firstRun(catalog);
          return;
        }
        catalog.forEach((app) => { if (installed.includes(app.id)) MyOS.loadApp(app); });
      })
      .catch((err) => console.error('Failed to load catalog:', err));
  };

  document.addEventListener('DOMContentLoaded', MyOS.init);
})();
