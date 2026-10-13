# MyOS — Roadmap

The vision: **an open, forkable "operating system for your browser tab."** You fork it, edit one JSON file, and get a personal desktop-style workspace that runs anywhere static files can be served — no backend, no build step. Apps are independent, hot-swappable modules.

This file tracks where MyOS is and where it's going.

---

## Current state (as of this pass)

**Fixed in the `fix/relative-paths-and-cleanup` branch:**
- **Relative paths everywhere** — the project was hard-coded to `/MyOS/`, so any fork, rename, or local copy loaded with no styles and no apps. This directly broke the "forkable, zero setup" promise. Now every path is relative, so it runs at any URL.
- **Settings is real** — the ⚙️ button opens a working Settings window (theme toggle + custom wallpaper, saved to the browser).
- **Search works** — no longer navigates to a 404; it filters the Applications panel live.
- **Removed dead UI** — the non-functional Files button and the empty "caret" tray button (and the misspelled `carot.svg`).
- **Safer app loading** — app names/paths from `modules.json` are inserted via DOM APIs, not raw HTML.
- **Valid `settings.json`** (was an empty file) and an **honest README** with a live-demo slot, a real feature list, and a "how to add an app" guide.
- Typo fixes (`enviroment` → `environment`).

**Known, still-open issues:**
- **Gallery sample app doesn't render** — see Phase 1. It's a git submodule, and it also has two bugs of its own.
- **Window manager is mouse-only** — no touch/pointer support, so it's unusable on phones/tablets.
- **`window.APP_BASE` is a shared global** — set per app at load time, so two apps loading at once can race.
- **Magic `setTimeout(300)`** when building the Applications grid (in `core.js`) — fragile timing.
- No keyboard shortcuts, no window snapping, no persistence of open windows.

---

## Phase 1 — Make the demo actually work (highest priority)

The live demo looks broken because the Gallery never shows anything. Two root causes:
1. **Its code** fetches a directory listing (`gallery/`) expecting JSON — GitHub Pages doesn't serve that, so it 404s. And it calls `renderGallery` on `DOMContentLoaded`, which has **already fired** by the time the loader injects the script, so it never runs.
2. **Submodules aren't deployed by default.** GitHub Pages' "deploy from a branch" build does **not** fetch submodules, so the Gallery's files may not even be on the live site.

**Decision needed (pick one):**
- **A — Vendor the Gallery into the main repo** (drop the submodule, copy the app into `apps/`). Simplest; the demo just works; one repo to maintain. *Recommended* for a demo app.
- **B — Keep it a submodule** and switch MyOS to a GitHub **Actions** Pages build that checks out submodules. Keeps apps independent (truer to the vision) but adds CI config.

**Then, regardless of A/B:**
- [ ] Ship a committed `gallery/index.json` manifest (folders + images) and fetch that instead of a directory listing.
- [ ] Run `renderGallery()` immediately on inject (don't wait for `DOMContentLoaded`).
- [ ] Render names with `textContent` (not innerHTML).
- [ ] Confirm GitHub Pages is enabled and set the repo's homepage URL; add a screenshot/GIF to the README.

## Phase 2 — Core desktop polish

- [ ] **Touch/pointer support** in the window manager (use Pointer Events) so it works on mobile.
- [ ] **Window snapping** (drag to an edge → half/maximize) and a **maximize** button.
- [ ] **Keyboard shortcuts** — Alt+Tab to cycle windows, Esc to close, Super to open the menu.
- [ ] **Taskbar entries** for open windows (click to focus/minimize) — currently minimize just collapses in place.
- [ ] Replace the `setTimeout(300)` apps-grid build with an event/callback.
- [ ] Fix the `window.APP_BASE` race — pass each app its base via its window element's dataset instead of a shared global.
- [ ] Remember open windows + positions across reloads (localStorage).

## Phase 3 — Real apps (the point of the platform)

Candidate built-in/first-party apps, each a self-contained module:
- [ ] **Notepad** — text editor, saves to localStorage.
- [ ] **Calculator**.
- [ ] **Files** — a simple virtual file store (localStorage or an in-memory FS), so the Files button can come back for real.
- [ ] **Weather / clock widgets**.
- [ ] **Settings** → grow into a full app (accent colors, wallpaper gallery, layout).
- [ ] **Gallery** → finish Phase 1, then add albums + upload.

## Phase 4 — The "platform" story

- [ ] **App-development guide** — document the app contract (the `.app-window` shape, `modules.json` fields, `window.APP_BASE`, CSS scoping).
- [ ] **App template repo** — turn `MyOS-App_Template` into a real GitHub "Use this template" repo with docs (right now it's a near-empty stub).
- [ ] **Theme editor** — custom accent colors + saved themes.
- [ ] **Example fork** — a second deployment showing a personalized workspace, linked from the README as proof of "fork and go."
- [ ] Topics + homepage URL on the GitHub repo; pin it on the profile.

## Phase 5 — Nice-to-haves

- [ ] Onboarding tour on first load.
- [ ] Loading animations / transitions.
- [ ] Optional sound effects.
- [ ] Right-click desktop context menu.

---

## Open decisions (for Jordan)

1. **Gallery/submodule:** Phase 1 option **A (vendor it, recommended)** or **B (submodule + Actions build)**?
2. **What should the taskbar hold?** Settings is wired; Files was removed. Do you want Files back (as a Phase-3 virtual FS), a system tray, or keep the taskbar minimal?
3. **Scope:** is MyOS mainly a **portfolio showcase** (make it polished + impressive for recruiters) or a **product you want people to actually fork and use** (prioritize the platform/docs)? That changes the order of Phases 3 vs 4.
