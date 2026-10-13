# MyOS — App Catalog Plan

The platform's value is the apps. Each app is its **own repo**, added to MyOS as a **git submodule** under `apps/`, and listed in the catalog (`data/modules.json`) so it shows up in the App Store. This file plans what to build.

## Conventions

- **Repo name:** `MyOS-<Name>-App` (matches `MyOS-Gallery-App`). Start each from `MyOS-App_Template`.
- **Contract:** one `.app-window` fragment in `app.html` (header with `.minimize-btn`/`.close-btn`, an `.app-content`, a `.resize-handle`), plus `app.css` (style **only your own content** — the OS owns the window chrome) and `app.js` (loaded as an ES module; locate yourself with `import.meta.url`).
- **100% static.** No backend. Persist with `localStorage` (or `IndexedDB` for bigger data). If an app needs the network, prefer **no-key / CORS-friendly** sources; anything else is flagged below.
- **Catalog entry:** `{id, name, desc, icon, html, css, js}` in `modules.json`.

## The catalog

Legend — **Effort:** S/M/L · **Static?** ✓ = no network needed · **◐** = needs a friendly API/proxy

### Utilities (core desktop)
| App | Repo | What it does | Effort | Static? |
|---|---|---|---|---|
| Notepad | MyOS-Notepad-App | Plain-text editor, autosave to localStorage | S | ✓ |
| Calculator | MyOS-Calculator-App | Standard + a few scientific ops | S | ✓ |
| Clock | MyOS-Clock-App | World clocks, timer, stopwatch, Pomodoro | M | ✓ |
| Calendar | MyOS-Calendar-App | Month view + saved events (localStorage) | M | ✓ |
| Files | MyOS-Files-App | Virtual file store (IndexedDB) — brings back a real Files button | L | ✓ |
| Unit Converter | MyOS-Convert-App | Length/weight/temp/currency (rates cached) | S | ◐ |

### Productivity
| App | Repo | What it does | Effort | Static? |
|---|---|---|---|---|
| Tasks / To-Do | MyOS-Tasks-App | Checklists with due dates | S | ✓ |
| Sticky Notes | MyOS-Notes-App | Draggable colored notes on the desktop | M | ✓ |
| Markdown | MyOS-Markdown-App | Editor + live preview | M | ✓ |
| Kanban | MyOS-Kanban-App | Drag-and-drop board | M | ✓ |
| Habit Tracker | MyOS-Habits-App | Daily streaks + grid | M | ✓ |

### Media & creative
| App | Repo | What it does | Effort | Static? |
|---|---|---|---|---|
| Gallery | MyOS-Gallery-App ✅ built | Image albums + viewer | — | ✓ |
| Paint | MyOS-Paint-App | Canvas sketch, export PNG | M | ✓ |
| Music Player | MyOS-Music-App | Play local audio files, playlist | M | ✓ |

### Info & widgets
| App | Repo | What it does | Effort | Static? |
|---|---|---|---|---|
| Weather | MyOS-Weather-App | Current + forecast (Open-Meteo, no key) | M | ◐ |
| Dictionary | MyOS-Dictionary-App | Word lookup (free dictionary API) | S | ◐ |
| RSS Reader | MyOS-RSS-App | Follow feeds (needs a CORS proxy) | L | ◐ |

### Games
| App | Repo | What it does | Effort | Static? |
|---|---|---|---|---|
| 2048 | MyOS-2048-App | Classic sliding-tile game | M | ✓ |
| Minesweeper | MyOS-Minesweeper-App | Classic | M | ✓ |
| Snake | MyOS-Snake-App | Classic | S | ✓ |
| Solitaire | MyOS-Solitaire-App | Klondike | L | ✓ |

### Developer tools
| App | Repo | What it does | Effort | Static? |
|---|---|---|---|---|
| JSON Tools | MyOS-JSON-App | Format / validate / tree view | S | ✓ |
| Color Picker | MyOS-Color-App | Pick, convert, save palettes | S | ✓ |
| Terminal | MyOS-Terminal-App | A fun fake shell with a few commands | M | ✓ |

## Recommended build order

**Phase 1 — flagship six** (varied, pure-static, showcase-worthy; makes the demo feel alive):
1. Notepad · 2. Calculator · 3. Tasks · 4. Clock · 5. Paint · 6. 2048

**Phase 2 — rounding out the desktop:** Files, Sticky Notes, Music Player, Weather, Markdown, Color Picker.

**Phase 3 — depth & fun:** Calendar app, Kanban, Minesweeper/Snake/Solitaire, JSON Tools, Terminal, Dictionary, Habit Tracker, Unit Converter, RSS Reader.

## Open questions

1. **First batch:** build the flagship six as listed, or swap any?
2. **Network apps** (Weather/Dictionary/RSS): include the no-key ones (Open-Meteo, dictionary API) or keep Phase 1 strictly offline?
3. **Per app:** do you want these built one at a time (own repo + submodule + catalog entry, deployed), or batch a few per push?
