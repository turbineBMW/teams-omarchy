const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const config = require('../src/config.cjs');

function tempHome(t) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'teams-omarchy-config-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  return home;
}

test('the old theme opacity is read like the stylesheet would', () => {
  assert.equal(config.opacityIn(''), null);
  assert.equal(config.opacityIn(':root { --teams-sidebar-opacity: 0.8; }'), 0.8);
  assert.equal(config.opacityIn('/* --teams-sidebar-opacity: 0.1; */ :root { --teams-sidebar-opacity:0.6 }'), 0.6);
  assert.equal(config.opacityIn(':root { --teams-sidebar-opacity: 2; }'), 1);
  assert.equal(config.opacityIn(':root { --teams-sidebar-opacity: 80%; }'), null);
  assert.equal(config.opacityIn(':root { --teams-sidebar-opacity-x: 0.5; --x--teams-sidebar-opacity: 0.4; }'), null);
  assert.equal(config.opacityIn(':root { --teams-sidebar-opacity: 0.5; } :root { --teams-sidebar-opacity: lots; }'), null);
});

test('a theme opacity is adopted once, then the theme has no say', t => {
  const home = tempHome(t);
  assert.equal(config.read(home), null);
  const settings = config.ensure(':root { --teams-sidebar-opacity: 0.7; }', home);
  assert.deepEqual(settings, { transparentSidebar: true, sidebarOpacity: 0.7 });
  assert.deepEqual(config.ensure(':root { --teams-sidebar-opacity: 0.2; }', home), settings);
  assert.match(config.css(settings), /:root \{ --teams-sidebar-opacity: 0\.70 !important; \}/);
});

test('no theme value leaves the sidebar opaque, at the default opacity', t => {
  const home = tempHome(t);
  const settings = config.ensure(':root { --teams-sidebar-opacity: 1; }', home);
  assert.deepEqual(settings, config.DEFAULTS);
  assert.equal(config.effectiveOpacity(settings), 1);
  assert.match(config.css(settings), /--teams-sidebar-opacity: 1\.00 !important;/);
});

test('the command line turns it on and off and sets the opacity', t => {
  const home = tempHome(t);
  const quiet = () => {};
  assert.deepEqual(config.main(['70%'], home, quiet), { transparentSidebar: true, sidebarOpacity: 0.7 });
  assert.equal(config.main(['off'], home, quiet).transparentSidebar, false);
  assert.equal(config.read(home).sidebarOpacity, 0.7, 'turning it off keeps the opacity');
  assert.deepEqual(config.main(['0.55'], home, quiet), { transparentSidebar: true, sidebarOpacity: 0.55 });
  assert.throws(() => config.main(['150%'], home, quiet), /Usage/);
  assert.throws(() => config.main(['lots'], home, quiet), /Usage/);
});

test('an unreadable config reads as the defaults and is left alone', t => {
  const home = tempHome(t);
  fs.mkdirSync(path.dirname(config.configPath(home)), { recursive: true });
  fs.writeFileSync(config.configPath(home), '{ not json');
  assert.deepEqual(config.ensure(':root { --teams-sidebar-opacity: 0.5; }', home), config.DEFAULTS);
  assert.equal(fs.readFileSync(config.configPath(home), 'utf8'), '{ not json');
  fs.writeFileSync(config.configPath(home), JSON.stringify({ transparentSidebar: 'yes', sidebarOpacity: 7 }));
  assert.deepEqual(config.read(home), { transparentSidebar: false, sidebarOpacity: 1 });
});
