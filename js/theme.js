const THEME_KEY = 'site_theme'; // make sure this is defined

function initThemeToggle() {
  try {
    const container = document.querySelector('.theme-toggle');
    if (!container) return;

    const btn = container.querySelector('button.theme-btn');
    if (!btn) return; // use existing button, don’t overwrite

    // Apply saved or system theme
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Toggle on click
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });

  } catch (e) {
    console.warn('Theme toggle init failed:', e);
  }
}

function applyTheme(mode) {
  const html = document.documentElement;
  html.setAttribute('data-theme', mode);
  const btn = document.querySelector('.theme-toggle button');
  const icon = document.getElementById('theme-icon');
  if (btn) btn.setAttribute('aria-pressed', mode === 'dark');
  if (icon) {
    if (mode === 'dark') {
      icon.textContent = '🌙';
      icon.className = 'icon icon-moon';
    } else {
      icon.textContent = '☀️';
      icon.className = 'icon icon-sun';
    }
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', initThemeToggle);