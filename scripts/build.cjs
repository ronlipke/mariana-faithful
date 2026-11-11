const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const palette = require('../palette.json');
const themePath = path.join(root, 'vscode/themes/mariana-faithful-color-theme.json');
const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
const names = ['Black','Red','Green','Yellow','Blue','Magenta','Cyan','White'];
for (let i = 0; i < 16; i++) {
  assert.match(palette.ansi[i], /^#[0-9A-F]{6}$/i, `ANSI ${i}`);
  theme.colors[`terminal.ansi${i >= 8 ? 'Bright' : ''}${names[i % 8]}`] = palette.ansi[i];
}
for (const [key, value] of Object.entries({
  'terminal.background': palette.editor.background,
  'terminal.foreground': palette.editor.foreground,
  'terminalCursor.foreground': palette.editor.caret,
  'terminalCursor.background': palette.editor.background,
  'terminal.selectionBackground': palette.editor.selectionRGBA,
  'terminal.selectionForeground': palette.editor.foreground,
  'terminal.inactiveSelectionBackground': palette.editor.selectionRGBA,
})) theme.colors[key] = value;
fs.writeFileSync(themePath, JSON.stringify(theme, null, 2) + '\n');
const lines = [
  '# Mariana Faithful — source palette from Sublime Text build 4215.',
  '# Original design: Sublime HQ Pty Ltd and Dmitri Voronianski.',
  '# ANSI mapping is an adaptation; Sublime has no official terminal palette.',
  '# Matching source colors are used for bright slots, avoiding extra saturation.',
  `background = ${palette.editor.background}`, `foreground = ${palette.editor.foreground}`,
  `cursor-color = ${palette.editor.caret}`, `cursor-text = ${palette.editor.background}`,
  '# Flatten source hsla(210, 13%, 40%, 0.7) over the editor background.',
  `selection-background = ${palette.editor.selectionFlattened}`,
  `selection-foreground = ${palette.editor.foreground}`,
  ...Array.from({length: 16}, (_, i) => `palette = ${i}=${palette.ansi[i]}`),
];
fs.writeFileSync(path.join(root, 'Mariana-Faithful.ghostty'), lines.join('\n') + '\n');
for (const file of ['LICENSE.txt', 'NOTICE.md']) fs.copyFileSync(path.join(root, file), path.join(root, 'vscode', file));
console.log('Synchronized the terminal palettes and extension license/attribution files.');
