async function loadApps() {
  const response = await fetch('apps.json');
  const apps = await response.json();

  const appList = document.getElementById('app-list');
  const appWindows = document.getElementById('app-windows');

  apps.forEach(app => {
    // 1️⃣ Add icon to app list
    const iconBtn = document.createElement('button');
    iconBtn.className = 'app-icon';
    iconBtn.title = app.name;
    iconBtn.innerHTML = `<img src="${app.icon}" alt="${app.name}" />`;
    appList.appendChild(iconBtn);

    // 2️⃣ Load app HTML dynamically (hidden initially)
    fetch(app.html)
      .then(res => res.text())
      .then(html => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        wrapper.style.display = 'none';
        appWindows.appendChild(wrapper);

        // 3️⃣ Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = app.css;
        wrapper.appendChild(link);

        // 4️⃣ Load JS
        const script = document.createElement('script');
        script.src = app.js;
        script.defer = true;
        wrapper.appendChild(script);

        // 5️⃣ Show app when icon clicked
        iconBtn.addEventListener('click', () => {
          wrapper.style.display = 'block';
        });
      });
  });
}

loadApps();
