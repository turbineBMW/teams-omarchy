// Render just the Teams template, without switching the desktop theme.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const home = os.homedir();
const palette = new Map(execFileSync('omarchy', ['theme', 'color', '--all'], {
  encoding: 'utf8',
}).trim().split('\n').map(line => line.split('\t')));
const template = fs.readFileSync(path.join(home, '.config/omarchy/themed/teams.css.tpl'), 'utf8');
const css = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key) => {
  if (!palette.has(key)) throw new Error('Unknown Omarchy color: ' + key);
  return palette.get(key);
});
fs.writeFileSync(path.join(home, '.local/state/omarchy/current/theme/teams.css'), css);
