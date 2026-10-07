#!/usr/bin/env node
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const project = path.resolve(__dirname, '..');
const shellQuote = value => "'" + value.replaceAll("'", "'\\''") + "'";
const desktopQuote = value => '"' + value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
  .replaceAll('`', '\\`').replaceAll('$', '\\$').replaceAll('%', '%%') + '"';
const exists = file => { try { fs.lstatSync(file); return true; } catch (e) { if (e.code === 'ENOENT') return false; throw e; } };

function locations(home) {
  return {
    integration: path.join(home, '.local/share/teams-omarchy'),
    launcher: path.join(home, '.local/bin/teams-for-linux'),
    desktop: path.join(home, '.local/share/applications/teams-for-linux.desktop'),
    template: path.join(home, '.config/omarchy/themed/teams.css.tpl'),
    css: path.join(home, '.local/state/omarchy/current/theme/teams.css'),
    backups: path.join(home, '.local/share/teams-omarchy-backups'),
  };
}

function run(command, args, options = {}) {
  return execFileSync(command, args, { stdio: 'inherit', ...options });
}

function checkNode() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 12)) throw new Error('Node.js 22.12 or newer is required.');
}

function detectTeams(explicit) {
  const candidates = explicit ? [path.resolve(explicit)] : [
    '/opt/teams-for-linux', '/usr/lib/teams-for-linux', '/usr/share/teams-for-linux',
  ];
  if (!explicit) {
    try { candidates.push(path.dirname(fs.realpathSync('/usr/bin/teams-for-linux'))); } catch {}
  }
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'resources/app.asar')) && fs.existsSync(path.join(dir, 'teams-for-linux'))) return dir;
  }
  throw new Error('Native Teams installation not found. Use --teams-dir /path/to/teams-for-linux. Flatpak/Snap are unsupported.');
}

function assertTeamsClosed() {
  for (const pid of fs.readdirSync('/proc').filter(name => /^\d+$/.test(name))) {
    let exe;
    try { exe = fs.readlinkSync(`/proc/${pid}/exe`); } catch { continue; }
    if (path.basename(exe).replace(/ \(deleted\)$/, '') === 'teams-for-linux') {
      throw new Error('Quit Teams completely (including its tray icon), then run this command again.');
    }
  }
}

function snapshot(paths) {
  fs.mkdirSync(paths.backups, { recursive: true });
  const backup = fs.mkdtempSync(path.join(paths.backups, 'install-'));
  const entries = [];
  for (const key of ['integration', 'launcher', 'desktop', 'template', 'css']) {
    entries.push({ key, target: paths[key], saved: exists(paths[key]) ? path.join(backup, key) : null });
  }
  const manifest = { format: 1, backup, entries };
  fs.writeFileSync(path.join(backup, 'manifest.json'), JSON.stringify(manifest, null, 2));
  // Persist the recovery plan before moving anything.
  const moved = [];
  try {
    for (const item of entries) {
      if (item.saved) { fs.renameSync(item.target, item.saved); moved.push(item); }
    }
  } catch (error) {
    for (const item of moved.reverse()) fs.renameSync(item.saved, item.target);
    throw error;
  }
  return manifest;
}

function restore(manifest, paths) {
  // Preserve the disabled installation and any edits instead of deleting them.
  const disabled = fs.mkdtempSync(path.join(paths.backups, 'disabled-'));
  for (const item of manifest.entries) {
    if (exists(item.target)) fs.renameSync(item.target, path.join(disabled, item.key));
    if (item.saved && exists(item.saved)) {
      fs.mkdirSync(path.dirname(item.target), { recursive: true });
      fs.renameSync(item.saved, item.target);
    }
  }
  return disabled;
}

function refreshDesktop(paths) {
  try { run('update-desktop-database', [path.dirname(paths.desktop)], { stdio: 'ignore' }); } catch {}
}

function install({ home = os.homedir(), teamsDir, dryRun = false, runner = run, checkRunning = assertTeamsClosed } = {}) {
  checkNode();
  const paths = locations(home);
  const source = detectTeams(teamsDir);
  if (!fs.existsSync(path.join(path.dirname(paths.css), 'colors.toml'))) {
    throw new Error('Current Omarchy theme not found. This release requires ~/.local/state/omarchy/current/theme/colors.toml.');
  }
  const paletteOutput = runner('omarchy', ['theme', 'color', '--all'], { encoding: 'utf8', stdio: 'pipe' });
  const palette = new Map(paletteOutput.trim().split('\n').map(line => line.split('\t')));
  const template = fs.readFileSync(path.join(project, 'themes/teams.css.tpl'), 'utf8');
  const css = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key) => {
    if (!palette.has(key)) throw new Error('This Omarchy version lacks the color: ' + key);
    return palette.get(key);
  });
  if (dryRun) {
    console.log('Native Teams: ' + source);
    console.log('Would back up existing files and install:\n' + Object.entries(paths).filter(([k]) => k !== 'backups').map(([, p]) => '  ' + p).join('\n'));
    console.log('Would download locked npm dependencies, build the launcher, and render the palette. No files changed.');
    return paths;
  }
  checkRunning();
  runner('npm', ['--version'], { stdio: 'ignore' });
  const manifest = snapshot(paths);
  try {
    fs.mkdirSync(paths.integration, { recursive: true });
    for (const file of ['live-theme.cjs', 'prepare.cjs', 'render.cjs', 'live-theme.test.cjs']) {
      fs.copyFileSync(path.join(project, 'src', file), path.join(paths.integration, file));
    }
    for (const file of ['package.json', 'package-lock.json', 'README.md']) {
      fs.copyFileSync(path.join(project, file), path.join(paths.integration, file));
    }
    fs.writeFileSync(path.join(paths.integration, 'settings.json'), JSON.stringify({ teamsDir: source }, null, 2));
    fs.writeFileSync(path.join(paths.integration, 'install-manifest.json'), JSON.stringify(manifest, null, 2));
    runner('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: paths.integration });
    runner(process.execPath, [path.join(paths.integration, 'prepare.cjs')]);
    for (const target of [paths.launcher, paths.desktop, paths.template, paths.css]) fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(paths.template, template);
    fs.writeFileSync(paths.css, css);
    fs.writeFileSync(paths.launcher, '#!/bin/bash\nset -euo pipefail\n' +
      `runtime=$(${shellQuote(process.execPath)} ${shellQuote(path.join(paths.integration, 'prepare.cjs'))})\n` +
      'exec "$runtime" "$@"\n', { mode: 0o755 });
    fs.writeFileSync(paths.desktop, '[Desktop Entry]\nType=Application\nName=Microsoft Teams for Linux\n' +
      'Comment=Microsoft Teams with live Omarchy colors\nGenericName=Teams\n' +
      `Exec=${desktopQuote(paths.launcher)} --gtk-version=3 %U\n` +
      'Icon=teams-for-linux\nMimeType=x-scheme-handler/msteams;\nCategories=Network;Chat;InstantMessaging;\nTerminal=false\nStartupNotify=true\nVersion=1.0\n');
    refreshDesktop(paths);
    console.log('Installed. Open Teams from your application launcher. Backup: ' + manifest.backup);
    return paths;
  } catch (error) {
    const disabled = restore(manifest, paths);
    throw new Error(`${error.message}\nPrevious files restored. Failed installation retained at ${disabled}`);
  }
}

function uninstall({ home = os.homedir(), dryRun = false, checkRunning = assertTeamsClosed } = {}) {
  const paths = locations(home);
  const manifestPath = path.join(paths.integration, 'install-manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error('No installer manifest found; this installation must be disabled manually.');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const keys = ['integration', 'launcher', 'desktop', 'template', 'css'];
  if (manifest.format !== 1 || path.dirname(manifest.backup) !== paths.backups ||
      manifest.entries.length !== keys.length || manifest.entries.some((item, i) =>
        item.key !== keys[i] || item.target !== paths[item.key] ||
        (item.saved !== null && item.saved !== path.join(manifest.backup, item.key)))) {
    throw new Error('Unexpected recovery paths in the installation manifest.');
  }
  for (const item of manifest.entries) {
    if (item.saved && !exists(item.saved)) throw new Error('Backup is missing: ' + item.saved);
  }
  if (dryRun) { console.log('Would restore previous files from ' + manifest.backup); return; }
  checkRunning();
  const disabled = restore(manifest, paths);
  refreshDesktop(paths);
  console.log('Previous files restored. Disabled installation and later edits retained at ' + disabled);
}

if (require.main === module) {
  try {
    const [action, ...args] = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--dry-run') options.dryRun = true;
      else if (args[i] === '--teams-dir' && args[i + 1]) options.teamsDir = args[++i];
      else throw new Error('Usage: ./install.sh [--dry-run] [--teams-dir PATH] or ./uninstall.sh [--dry-run]');
    }
    if (action === 'install') install(options);
    else if (action === 'uninstall') uninstall(options);
    else throw new Error('Expected install or uninstall.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { install, uninstall, locations, shellQuote, desktopQuote };
