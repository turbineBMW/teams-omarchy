#!/usr/bin/env node
// teams-omarchy's own settings, independent of the Omarchy theme:
// ~/.config/teams-omarchy/config.json
//
//   { "transparentSidebar": true, "sidebarOpacity": 0.8 }
//
// live-theme.cjs appends the sidebar opacity they ask for after the theme's
// stylesheet, so a theme's teams.css can no longer decide it. Themes used to
// set --teams-sidebar-opacity themselves; the first time no config exists, a
// value below 1 in the rendered stylesheet is carried over, so nothing changes
// on screen.
//
// Run directly to read or change the setting; Teams picks it up within a
// second:
//   node ~/.local/share/teams-omarchy/config.cjs [status | on | off | 70% | 0.7]
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PROPERTY = '--teams-sidebar-opacity';
const DEFAULTS = Object.freeze({ transparentSidebar: false, sidebarOpacity: 0.8 });

function configPath(home = os.homedir()) {
  return path.join(home, '.config/teams-omarchy/config.json');
}

const clamp = value => Math.min(1, Math.max(0, value));

// Anything unreadable falls back to the default, key by key.
function normalize(raw) {
  const settings = { ...DEFAULTS };
  if (raw && typeof raw === 'object') {
    if (typeof raw.transparentSidebar === 'boolean') settings.transparentSidebar = raw.transparentSidebar;
    if (typeof raw.sidebarOpacity === 'number' && Number.isFinite(raw.sidebarOpacity)) {
      settings.sidebarOpacity = clamp(raw.sidebarOpacity);
    }
  }
  return settings;
}

// The settings, or null when no config file exists yet. A file that is not
// valid JSON reads as the defaults and is left alone for the user to fix.
function read(home = os.homedir()) {
  let text;
  try {
    text = fs.readFileSync(configPath(home), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  try { return normalize(JSON.parse(text)); } catch { return { ...DEFAULTS }; }
}

function write(settings, home = os.homedir()) {
  const file = configPath(home);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(normalize(settings), null, 2) + '\n');
  fs.renameSync(tmp, file);
}

// The last plain-number value `css` gives --teams-sidebar-opacity, clamped
// to 0..1, or null. Comments are skipped; a percentage or anything else that
// isn't a plain number counts as unset, as GTK and Chromium's rgb(from ...)
// alpha would not read it the same way.
function opacityIn(css) {
  const text = css.replace(/\/\*[\s\S]*?(\*\/|$)/g, '');
  const declaration = /(?<![\w-])--teams-sidebar-opacity\s*:\s*([^;}\n]*)/g;
  let found = null;
  for (const match of text.matchAll(declaration)) {
    const value = match[1].replace(/!important/i, '').trim();
    found = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(value) ? clamp(Number(value)) : null;
  }
  return found;
}

// The settings, creating the config on first use from what `themeCss` (the
// rendered teams.css, if any) used to say.
function ensure(themeCss, home = os.homedir()) {
  const existing = read(home);
  if (existing) return existing;
  const settings = { ...DEFAULTS };
  const legacy = themeCss ? opacityIn(themeCss) : null;
  if (legacy !== null && legacy < 1) {
    settings.transparentSidebar = true;
    settings.sidebarOpacity = legacy;
  }
  write(settings, home);
  return settings;
}

// The opacity in force: the setting's while it is on, solid otherwise.
const effectiveOpacity = settings => (settings.transparentSidebar ? clamp(settings.sidebarOpacity) : 1);

// CSS to append after the theme's stylesheet.
function css(settings) {
  return `\n/* teams-omarchy: the Transparent sidebar setting (config.json), above any theme. */\n` +
    `:root { ${PROPERTY}: ${effectiveOpacity(settings).toFixed(2)} !important; }\n`;
}

function parseOpacity(text) {
  const match = /^(\d+(?:\.\d+)?)(%?)$/.exec(text);
  if (!match) return null;
  const value = Number(match[1]) / (match[2] ? 100 : 1);
  return value >= 0 && value <= 1 ? value : null;
}

function main(args, home = os.homedir(), log = console.log) {
  const settings = read(home) ?? { ...DEFAULTS };
  const [command = 'status'] = args;
  if (command === 'on' || command === 'off') {
    settings.transparentSidebar = command === 'on';
  } else if (command !== 'status') {
    const opacity = parseOpacity(command);
    if (opacity === null) {
      throw new Error('Usage: config.cjs [status | on | off | <opacity: 0-1 or 0%-100%>]');
    }
    settings.transparentSidebar = true;
    settings.sidebarOpacity = opacity;
  }
  if (command !== 'status') write(settings, home);
  log(`Transparent sidebar: ${settings.transparentSidebar ? 'on' : 'off'}, ` +
      `opacity ${Math.round(settings.sidebarOpacity * 100)}% (${configPath(home)})`);
  return settings;
}

if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { DEFAULTS, PROPERTY, configPath, read, write, opacityIn, ensure, effectiveOpacity, css, main };
