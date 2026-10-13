# MyOS

A modular, forkable **personal web OS** — a desktop-style workspace that runs as a plain static site. Fork it, edit one JSON file, and you have your own customizable workspace. No backend, no build step.

> **Status:** early but working. The desktop, windows, theme, clock/calendar, app launcher, settings and search all function. Some pieces (the Gallery demo app, a real Files app, mobile/touch support) are in progress — see the [roadmap](#roadmap).

## Live demo

GitHub Pages: `https://techlab-jd.github.io/MyOS/`

*(A screen recording / screenshot goes here.)*

## What works today

- **Window manager** — draggable, resizable, minimizable, closeable app windows (mouse).
- **Start menu** with an **Applications** launcher that lists every registered app.
- **Settings** — toggle light/dark theme and set a custom wallpaper (saved in your browser).
- **Theme** — light/dark, remembers your choice, respects your system preference on first visit.
- **Clock & calendar** popup in the taskbar.
- **App search** — filters the Applications panel.
- **Modular apps** — each app is just an HTML fragment + optional CSS/JS, listed in `data/modules.json`.

## How it's built

Plain **HTML + CSS + JavaScript**, no framework, no bundler. Configuration lives in JSON. All paths are **relative**, so it works at any URL — your fork, a project subpath, or a local server — with zero config.

```
index.html          # the desktop shell
css/                # core.css, menu.css, themes.css
js/                 # core.js, windowManager.js, loader.js, theme.js
data/
  modules.json      # the app registry — add your apps here
  settings.json     # default settings
apps/
  template/         # a starter app you can copy
  MyOS-Gallery-App/ # a sample app (git submodule)
assets/             # icons, wallpaper
```

## Add your own app

1. Copy `apps/template/` to `apps/my-app/`.
2. Edit `app.html` (a single `.app-window`), plus optional `app.css` / `app.js`.
3. Register it in `data/modules.json`:

   ```json
   {
     "id": "MyApp",
     "name": "My App",
     "icon": "apps/my-app/icon.svg",
     "html": "apps/my-app/app.html",
     "css":  "apps/my-app/app.css",
     "js":   "apps/my-app/app.js"
   }
   ```

4. Reload. Your app shows up in the **Applications** panel.

> Paths in `modules.json` are relative to the site root. An app's own `app.js` receives its folder path as `window.APP_BASE`.

## Run locally

Because the app uses `fetch()` for its config and apps, open it through a local server (not `file://`):

```bash
# from the repo root
python -m http.server 8000
# then visit http://localhost:8000
```

## Roadmap

See [`ROADMAP.md`](ROADMAP.md) for the full plan. Near-term: fix the Gallery sample app, add keyboard shortcuts and window snapping, touch support for mobile, and a proper app-development guide.

## License

[MIT](LICENSE)
