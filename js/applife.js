// applife.js — app lifecycle. Closing an app window should actually stop what the
// app was doing (looping audio, game loops, tickers), not just hide the window.
//
// How: we tag every setInterval to whichever app window the user was interacting
// with when it was created, and clear those intervals when that window is closed.
// That covers the interval-driven apps (Drum, Metronome, Simon, Snake, Pomodoro,
// Stopwatch, ...). Apps whose audio is NOT interval-driven (a looping buffer, a
// held note) also receive a `myos:close` event on their window so they can stop
// cleanly. Reopening re-runs the app's own controls, so nothing here is destructive.
(function () {
  const MyOS = (window.MyOS = window.MyOS || {});
  MyOS.activeAppId = null;             // id of the window the user last interacted with
  const intervals = {};                // appId -> Set(intervalId)

  const _setInterval = window.setInterval.bind(window);
  window.setInterval = function () {
    const id = _setInterval.apply(null, arguments);
    const app = MyOS.activeAppId;
    if (app) (intervals[app] || (intervals[app] = new Set())).add(id);
    return id;
  };

  // Called by the window manager when an app window is closed.
  MyOS.stopApp = function (id) {
    if (!id) return;
    const set = intervals[id];
    if (set) { set.forEach(function (i) { clearInterval(i); }); set.clear(); }
    const win = document.getElementById(id);
    if (win) win.dispatchEvent(new CustomEvent('myos:close'));
  };
})();
