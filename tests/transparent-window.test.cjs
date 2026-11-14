const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function load() {
  const created = [];
  const cleared = [];
  class BrowserWindow { constructor(options) { created.push(options); } static getAllWindows() { return []; } }
  class WebContentsView { setBackgroundColor(color) { cleared.push(color); } }
  // Electron defines its exports as non-configurable getters.
  const electron = {};
  for (const [name, value] of Object.entries({ BrowserWindow, WebContentsView, app: { name: 'app' } })) {
    Object.defineProperty(electron, name, { enumerable: true, get: () => value });
  }
  const Module = { _load: request => ({ original: request }) };
  const sandbox = { module: { exports: {} } };
  sandbox.require = name => {
    if (name === 'electron') return electron;
    if (name === 'node:module') return Module;
    return require(name);
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, '../src/transparent-window.cjs'), 'utf8'), sandbox);
  return { created, cleared, Module, electron, exports: sandbox.module.exports };
}

const main = {
  title: 'Teams for Linux',
  backgroundColor: '#fff',
  webPreferences: { preload: '/app/browser/preload.js', partition: 'persist:teams-4-linux' },
};

test('only the Teams main window is created transparent', () => {
  const { created, Module } = load();
  const { BrowserWindow } = Module._load('electron');
  new BrowserWindow(main);
  new BrowserWindow({ title: 'Teams for Linux', parent: {}, webPreferences: main.webPreferences });
  new BrowserWindow({ title: 'Share your screen', webPreferences: { preload: '/app/screenSharing/preload.js' } });
  new BrowserWindow();
  assert.equal(created[0].transparent, true);
  assert.equal(created[0].backgroundColor, '#00000000');
  assert.equal(created[0].webPreferences, main.webPreferences);
  for (const options of created.slice(1)) assert.notEqual(options?.transparent, true);
  assert.equal(main.backgroundColor, '#fff', 'caller options are not mutated');
  assert.equal(typeof BrowserWindow.getAllWindows, 'function', 'static methods are inherited');
});

test('extra profile views are cleared; other views and modules are untouched', () => {
  const { cleared, Module, electron } = load();
  const patched = Module._load('electron');
  new patched.WebContentsView({ webPreferences: { partition: 'persist:teams-profile-1234' } });
  new patched.WebContentsView({ webPreferences: { preload: '/app/profileSwitcher/preload.js' } });
  assert.deepEqual(cleared, ['#00000000']);
  assert.equal(patched.app, electron.app);
  assert.deepEqual(Module._load('node:fs'), { original: 'node:fs' });
});
