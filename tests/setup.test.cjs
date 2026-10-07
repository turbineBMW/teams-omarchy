const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { install, uninstall, locations } = require('../scripts/setup.cjs');

function fixture(t) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'teams-omarchy-setup-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  const paths = locations(home);
  const teamsDir = path.join(home, 'native teams');
  fs.mkdirSync(path.join(teamsDir, 'resources'), { recursive: true });
  fs.writeFileSync(path.join(teamsDir, 'resources/app.asar'), 'fixture');
  fs.writeFileSync(path.join(teamsDir, 'teams-for-linux'), 'fixture');
  fs.mkdirSync(path.dirname(paths.css), { recursive: true });
  fs.writeFileSync(path.join(path.dirname(paths.css), 'colors.toml'), 'fixture');
  const template = fs.readFileSync(path.join(__dirname, '../themes/teams.css.tpl'), 'utf8');
  const keys = [...new Set([...template.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map(m => m[1]))];
  const calls = [];
  const runner = (command, args) => {
    calls.push({ command, args });
    if (command === 'omarchy') return keys.map(k => `${k}\t#123456`).join('\n');
    return '';
  };
  return { home, paths, teamsDir, calls, runner, checkRunning() {} };
}

test('dry run does not install files or invoke npm', t => {
  const f = fixture(t);
  install({ ...f, dryRun: true });
  assert.equal(fs.existsSync(f.paths.integration), false);
  assert.equal(fs.existsSync(f.paths.backups), false);
  assert.equal(f.calls.length, 1);
});

test('install renders CSS; uninstall restores previous files and preserves edits', t => {
  const f = fixture(t);
  fs.mkdirSync(path.dirname(f.paths.template), { recursive: true });
  fs.writeFileSync(f.paths.template, 'previous custom template');
  install(f);
  assert.match(fs.readFileSync(f.paths.launcher, 'utf8'), /exec "\$runtime" "\$@"/);
  assert.equal(fs.statSync(f.paths.launcher).mode & 0o777, 0o755);
  assert.ok(!fs.readFileSync(f.paths.css, 'utf8').includes('{{'));
  fs.appendFileSync(f.paths.template, '\n/* user customization */');
  uninstall({ ...f, dryRun: true });
  assert.ok(fs.existsSync(f.paths.launcher));
  uninstall(f);
  assert.equal(fs.readFileSync(f.paths.template, 'utf8'), 'previous custom template');
  assert.equal(fs.existsSync(f.paths.launcher), false);
  const disabled = fs.readdirSync(f.paths.backups).find(name => name.startsWith('disabled-'));
  assert.match(fs.readFileSync(path.join(f.paths.backups, disabled, 'template'), 'utf8'), /user customization/);
});

test('failed dependency installation rolls back existing files', t => {
  const f = fixture(t);
  fs.mkdirSync(f.paths.integration, { recursive: true });
  fs.writeFileSync(path.join(f.paths.integration, 'existing.txt'), 'keep me');
  const runner = (command, args) => {
    if (command === 'npm' && args[0] === 'ci') throw new Error('simulated network failure');
    return f.runner(command, args);
  };
  assert.throws(() => install({ ...f, runner }), /Previous files restored/);
  assert.equal(fs.readFileSync(path.join(f.paths.integration, 'existing.txt'), 'utf8'), 'keep me');
  assert.equal(fs.existsSync(f.paths.launcher), false);
});

test('update can be undone one version at a time', t => {
  const f = fixture(t);
  install(f);
  fs.appendFileSync(f.paths.template, '\n/* first version */');
  install(f);
  uninstall(f);
  assert.match(fs.readFileSync(f.paths.template, 'utf8'), /first version/);
  uninstall(f);
  assert.equal(fs.existsSync(f.paths.integration), false);
});

test('running Teams blocks installation before changes', t => {
  const f = fixture(t);
  assert.throws(() => install({ ...f, checkRunning() { throw new Error('Quit Teams'); } }), /Quit Teams/);
  assert.equal(fs.existsSync(f.paths.backups), false);
});
