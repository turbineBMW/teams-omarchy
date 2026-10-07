const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { app, webContents } = require('electron');

const cssPath = path.join(os.homedir(), '.local/state/omarchy/current/theme/teams.css');
const styleId = 'omarchy-teams-live-theme';
let css = '';
let reading = false;
const applied = new WeakMap();
const pending = new WeakSet();

function isThemedFrame(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    if (['teams.microsoft.com', 'teams.cloud.microsoft', 'teams.live.com'].some(
      host => u.hostname === host || u.hostname.endsWith('.' + host))) return true;
    return u.hostname === 'outlook.office.com' &&
      u.pathname.startsWith('/hosted/calendar/');
  } catch { return false; }
}

async function applyFrame(frame, force = false) {
  if (!css || !isThemedFrame(frame.url) || pending.has(frame)) return;
  if (!force && applied.get(frame) === css) return;
  const next = css;
  pending.add(frame);
  try {
    // JSON encoding preserves arbitrary CSS without turning it into executable JS.
    const result = await frame.executeJavaScript(`(() => {
      if (!document.head) return false;
      let style = document.getElementById(${JSON.stringify(styleId)});
      if (!style) {
        style = document.createElement('style');
        style.id = ${JSON.stringify(styleId)};
        document.head.appendChild(style);
      }
      style.textContent = ${JSON.stringify(next)};
      const provider = document.querySelector('.fui-FluentProvider') || document.body;
      return {
        origin: location.origin,
        providers: document.querySelectorAll('.fui-FluentProvider').length,
        background: getComputedStyle(provider).getPropertyValue('--colorNeutralBackground1').trim(),
        accent: getComputedStyle(provider).getPropertyValue('--colorBrandBackground').trim(),
        styleCount: document.querySelectorAll('#' + ${JSON.stringify(styleId)}).length,
      };
    })()`);
    if (result) {
      applied.set(frame, next);
      console.info('[Omarchy theme] Applied', JSON.stringify(result));
    }
  } catch {
    // Navigating or detached frames are retried after their next load.
  } finally { pending.delete(frame); }
}

function applyContent(content, force = false) {
  if (content.isDestroyed()) return;
  try {
    for (const frame of content.mainFrame.framesInSubtree) {
      void applyFrame(frame, force);
    }
  } catch { /* A window can close while enumerating frames. */ }
}

async function refresh() {
  if (reading) return;
  reading = true;
  try {
    // Reopen the path: Omarchy swaps the entire directory on theme changes.
    const next = await fs.promises.readFile(cssPath, 'utf8');
    if (next.trim() && !next.includes('{{') && next !== css) {
      css = next;
      console.info('[Omarchy theme] Loaded current palette');
    }
    for (const content of webContents.getAllWebContents()) applyContent(content);
  } catch (error) {
    if (error.code !== 'ENOENT') console.warn('[Omarchy theme]', error.message);
  } finally { reading = false; }
}

app.on('web-contents-created', (_event, content) => {
  content.on('dom-ready', () => applyContent(content, true));
  content.on('did-frame-finish-load', () => applyContent(content, true));
});
app.whenReady().then(() => {
  void refresh();
  const timer = setInterval(() => { void refresh(); }, 1000);
  timer.unref();
  app.once('will-quit', () => clearInterval(timer));
});
