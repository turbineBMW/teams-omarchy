// Build a small Electron bootstrap around the system app, without editing it.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

async function main() {
  const { extractFile, createPackage } = await import('@electron/asar');
  const settings = JSON.parse(await fs.readFile(path.join(__dirname, 'settings.json'), 'utf8'));
  const source = settings.teamsDir;
  const archive = path.join(source, 'resources/app.asar');
  const pkg = JSON.parse(extractFile(archive, 'package.json'));
  if (pkg.name !== 'teams-for-linux' || pkg.main !== 'app/index.js') {
    throw new Error('System Teams entry point changed; review the integration.');
  }
  const [archiveStat, binaryStat, script] = await Promise.all([
    fs.stat(archive), fs.stat(path.join(source, 'teams-for-linux')), fs.readFile(__filename),
  ]);
  const id = crypto.createHash('sha256').update(JSON.stringify([
    source, __dirname, archiveStat.size, archiveStat.mtimeMs, binaryStat.size, binaryStat.mtimeMs,
  ])).update(script).digest('hex').slice(0, 16);
  const runtimeRoot = path.join(__dirname, 'runtime');
  const target = path.join(runtimeRoot, id);
  try {
    await fs.access(path.join(target, 'ready'));
    console.log(path.join(target, 'teams-for-linux'));
    return;
  } catch {}
  await fs.mkdir(runtimeRoot, { recursive: true });
  const staging = await fs.mkdtemp(path.join(runtimeRoot, '.build-'));
  for (const name of await fs.readdir(source)) {
    if (name === 'resources') continue;
    if (name === 'teams-for-linux') {
      // /proc/self/exe must point into our runtime; a symlink would run the stock app.
      execFileSync('cp', ['--reflink=auto', '--preserve=mode', path.join(source, name), path.join(staging, name)]);
    } else await fs.symlink(path.join(source, name), path.join(staging, name));
  }
  const resources = path.join(staging, 'resources');
  await fs.mkdir(resources);
  for (const name of await fs.readdir(path.join(source, 'resources'))) {
    if (name === 'app.asar' || name === 'app.asar.unpacked') continue;
    await fs.symlink(path.join(source, 'resources', name), path.join(resources, name));
  }
  const bootstrap = path.join(staging, 'bootstrap');
  await fs.mkdir(bootstrap);
  await fs.writeFile(path.join(bootstrap, 'package.json'), JSON.stringify({
    name: pkg.name, version: pkg.version, main: 'index.cjs',
  }));
  await fs.writeFile(path.join(bootstrap, 'index.cjs'),
    `require('electron').app.setAppPath(${JSON.stringify(archive)});\n` +
    `require(${JSON.stringify(path.join(__dirname, 'live-theme.cjs'))});\n` +
    `require(${JSON.stringify(path.join(archive, pkg.main))});\n`);
  await createPackage(bootstrap, path.join(resources, 'app.asar'));
  await fs.writeFile(path.join(staging, 'ready'), pkg.version + '\n');
  try { await fs.rename(staging, target); }
  catch (error) {
    // Another launch may have finished the identical build first.
    if (error.code !== 'EEXIST' && error.code !== 'ENOTEMPTY') throw error;
  }
  console.log(path.join(target, 'teams-for-linux'));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
