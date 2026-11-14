// Create the Teams main window with an alpha channel so the theme CSS can let
// the desktop show through chosen surfaces. Electron only honours `transparent`
// when a window is created, so this must load before Teams requires electron.
// With every surface painted opaque the window looks exactly as before.
const Module = require('node:module');
const path = require('node:path');
const electron = require('electron');

const CLEAR = '#00000000';
const PROFILE_PARTITION = 'persist:teams-profile-';

// Teams' main window: its title and its preload, the one Teams pages load with.
function isMainWindow(options) {
  const preload = options?.webPreferences?.preload;
  return options?.title === 'Teams for Linux' && !options.parent &&
    typeof preload === 'string' && preload.endsWith(path.join('browser', 'preload.js'));
}

class TransparentBrowserWindow extends electron.BrowserWindow {
  constructor(options) {
    super(isMainWindow(options)
      ? { ...options, transparent: true, backgroundColor: CLEAR }
      : options);
  }
}

// Extra Teams profiles are views stacked over the main window's content.
class TransparentWebContentsView extends electron.WebContentsView {
  constructor(options) {
    super(options);
    const partition = options?.webPreferences?.partition;
    if (typeof partition === 'string' && partition.startsWith(PROFILE_PARTITION)) {
      this.setBackgroundColor(CLEAR);
    }
  }
}

const replacements = {
  BrowserWindow: TransparentBrowserWindow,
  WebContentsView: TransparentWebContentsView,
};
// Electron's exports are non-configurable getters, so hand out a view of them.
const patched = new Proxy(electron, {
  get(target, key, receiver) {
    return Object.hasOwn(replacements, key) ? replacements[key] : Reflect.get(target, key, receiver);
  },
});
const load = Module._load;
Module._load = function (request, ...rest) {
  return request === 'electron' ? patched : load.call(this, request, ...rest);
};

module.exports = { isMainWindow, TransparentBrowserWindow, TransparentWebContentsView };
