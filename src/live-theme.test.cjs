const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const { setTimeout: delay } = require('node:timers/promises');

test('replaces styles after atomic theme swaps; isolates frames and tolerates missing files', async t => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'teams-omarchy-test-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  const theme = path.join(home, '.local/state/omarchy/current/theme');
  fs.mkdirSync(theme, { recursive: true });
  const write = css => fs.writeFileSync(path.join(theme, 'teams.css'), css);
  write(':root { --colorBrandBackground: green; }');
  const styles = new Map();
  let executions = 0;
  let calendarExecutions = 0;
  let unrelatedExecutions = 0;
  const document = {
    head: { appendChild(style) { styles.set(style.id, style); } },
    body: {},
    getElementById(id) { return styles.get(id); },
    createElement() { return {}; },
    querySelector() { return null; },
    querySelectorAll(selector) { return selector.startsWith('#') ? [...styles.values()] : []; },
  };
  const frame = {
    url: 'https://teams.cloud.microsoft/v2/',
    async executeJavaScript(script) {
      executions++;
      return vm.runInNewContext(script, {
        document, location: { origin: 'https://teams.cloud.microsoft' },
        getComputedStyle: () => ({ getPropertyValue: () => '' }),
      });
    },
  };
  const unrelated = {
    url: 'https://teams.cloud.microsoft.example.org/',
    async executeJavaScript() { unrelatedExecutions++; },
  };
  const calendar = {
    url: 'https://outlook.office.com/hosted/calendar/view/month',
    async executeJavaScript(script) {
      calendarExecutions++;
      return vm.runInNewContext(script, {
        document, location: { origin: 'https://outlook.office.com' },
        getComputedStyle: () => ({ getPropertyValue: () => '' }),
      });
    },
  };
  const unrelatedOutlook = {
    url: 'https://outlook.office.com/mail/',
    async executeJavaScript() { unrelatedExecutions++; },
  };
  const content = new EventEmitter();
  content.isDestroyed = () => false;
  content.mainFrame = {
    framesInSubtree: [frame, calendar, unrelated, unrelatedOutlook],
  };
  const app = new EventEmitter();
  app.whenReady = () => Promise.resolve();
  let tick;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'live-theme.cjs'), 'utf8'), {
    require(name) {
      if (name === 'electron') return { app, webContents: { getAllWebContents: () => [content] } };
      if (name === 'node:os') return { homedir: () => home };
      return require(name);
    },
    URL, console: { info() {}, warn() {} },
    setInterval(callback) { tick = callback; return { unref() {} }; },
    clearInterval() {},
  });
  async function settle() { await delay(30); }
  await settle();
  assert.equal(executions, 1);
  assert.equal(calendarExecutions, 1);
  assert.equal(styles.size, 1);
  assert.equal(unrelatedExecutions, 0);
  tick(); await settle();
  assert.equal(executions, 1, 'unchanged CSS causes no reinjection');
  assert.equal(calendarExecutions, 1, 'unchanged calendar CSS causes no reinjection');

  fs.renameSync(theme, theme + '-old');
  tick(); await settle();
  assert.equal(executions, 1, 'missing theme keeps the previous style');
  assert.equal(calendarExecutions, 1, 'missing theme keeps the calendar style');
  fs.mkdirSync(theme);
  // Include JavaScript-looking text to verify that CSS stays literal data.
  const next = ':root { --colorBrandBackground: blue; } /* ` ${throw new Error()} */';
  write(next);
  tick(); await settle();
  assert.equal(executions, 2);
  assert.equal(calendarExecutions, 2);
  assert.equal(styles.size, 1);
  assert.equal(styles.get('omarchy-teams-live-theme').textContent, next);

  write(':root { color: {{ foreground }}; }');
  tick(); await settle();
  assert.equal(executions, 2, 'unrendered template is ignored');
  assert.equal(calendarExecutions, 2, 'unrendered calendar template is ignored');
  app.emit('web-contents-created', {}, content);
  styles.clear();
  content.emit('dom-ready'); await settle();
  assert.equal(styles.size, 1, 'navigation restores the stylesheet');

  frame.executeJavaScript = async () => { throw new Error('Frame detached'); };
  write(':root { color: red; }');
  tick(); await settle();
  assert.equal(unrelatedExecutions, 0);
});
