// appstore.js — first-run app picker + the App Store (browse / install / remove /
// launch). Works on top of the catalog + installed set managed in loader.js.

(function () {
  const MyOS = (window.MyOS = window.MyOS || {});

  function escHtml(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function escAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;'); }

  // ---- First-run onboarding: choose which catalog apps to install ----
  MyOS.firstRun = function (catalog) {
    if (document.getElementById('onboard-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'onboard-overlay';
    overlay.className = 'onboard-overlay';
    overlay.innerHTML =
      '<div class="onboard">' +
        '<h2>Welcome to MyOS</h2>' +
        '<p>Pick the apps you want to start with. You can add or remove apps anytime from the App Store.</p>' +
        '<div class="onboard-apps">' +
          catalog.map(function (a) {
            return '<label class="onboard-app">' +
              '<input type="checkbox" value="' + escAttr(a.id) + '" checked>' +
              '<img src="' + escAttr(a.icon) + '" alt="">' +
              '<span class="onboard-name">' + escHtml(a.name) + '</span>' +
              '<span class="onboard-desc">' + escHtml(a.desc || '') + '</span>' +
            '</label>';
          }).join('') +
        '</div>' +
        '<button class="onboard-go">Set up my workspace</button>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.onboard-go').addEventListener('click', function () {
      const ids = Array.prototype.map.call(overlay.querySelectorAll('input:checked'), function (i) { return i.value; });
      MyOS.setInstalled(ids);
      overlay.remove();
      ids.forEach(function (id) {
        const app = catalog.find(function (a) { return a.id === id; });
        if (app) MyOS.loadApp(app);
      });
    });
  };

  // ---- The App Store window ----
  MyOS.openStore = function () {
    const existing = document.getElementById('appstore-window');
    if (existing) {
      existing.style.display = 'flex';
      if (window.windowManager) window.windowManager.bringToFront(existing);
      return;
    }
    const win = document.createElement('div');
    win.className = 'app-window';
    win.id = 'appstore-window';
    win.style.cssText = 'left:180px; top:110px; width:540px; height:460px;';
    win.innerHTML =
      '<div class="app-header">' +
        '<div class="app-title">🛍️ App Store</div>' +
        '<div class="app-controls"><button class="minimize-btn">—</button><button class="close-btn">✖</button></div>' +
      '</div>' +
      '<div class="app-content"><div class="store-grid"></div></div>' +
      '<div class="resize-handle"></div>';
    document.getElementById('app-windows').appendChild(win);
    if (window.windowManager) window.windowManager.setupWindow(win);
    renderStore(win.querySelector('.store-grid'));
  };

  function renderStore(grid) {
    grid.replaceChildren();
    (MyOS.catalog || []).forEach(function (app) {
      const installed = MyOS.isInstalled(app.id);

      const card = document.createElement('div');
      card.className = 'store-card';

      const img = document.createElement('img'); img.src = app.icon; img.alt = '';
      const name = document.createElement('div'); name.className = 'store-name'; name.textContent = app.name;
      const desc = document.createElement('div'); desc.className = 'store-desc'; desc.textContent = app.desc || '';

      const actions = document.createElement('div'); actions.className = 'store-actions';
      const launch = document.createElement('button'); launch.className = 'store-launch'; launch.textContent = 'Launch';
      launch.addEventListener('click', function () { MyOS.openApp(app.id); });

      const toggle = document.createElement('button');
      toggle.textContent = installed ? 'Remove' : 'Install';
      toggle.className = installed ? 'store-remove' : 'store-install';
      toggle.addEventListener('click', function () {
        let inst = MyOS.getInstalled() || [];
        if (MyOS.isInstalled(app.id)) {
          inst = inst.filter(function (i) { return i !== app.id; });
          MyOS.unloadApp(app.id);
        } else {
          inst = inst.concat([app.id]);
          MyOS.loadApp(app);
        }
        MyOS.setInstalled(inst);
        renderStore(grid);
      });

      actions.append(launch, toggle);
      card.append(img, name, desc, actions);
      grid.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('storeButton');
    if (btn) btn.addEventListener('click', MyOS.openStore);
  });
})();
