const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const manifest = require('../vscode/package.json');
const version = manifest.version;
if (manifest.icon) {
  const iconPath = path.join(root, 'vscode', manifest.icon);
  const size = fs.statSync(iconPath).size;
  if (size > 1024 * 1024) {
    throw new Error(`Marketplace icon is ${size} bytes; maximum is 1024 KB. Resize or compress ${manifest.icon}.`);
  }
}
const cli = path.join(path.dirname(require.resolve('@vscode/vsce/package.json')), 'vsce');
const out = path.join(root, 'dist', `mariana-faithful-${version}.vsix`);
fs.mkdirSync(path.dirname(out), { recursive: true });
const result = spawnSync(process.execPath, [cli, 'package', '--out', out], { cwd: path.join(root, 'vscode'), stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
