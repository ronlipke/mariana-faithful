// Fetch official, revision-pinned VS Code grammars into an ignored local cache.
const fs = require('node:fs/promises');
const path = require('node:path');
const manifest = require('../tests/grammar-sources.json');
const root = path.resolve(__dirname, '..');
const loaded = new Set();
async function loadGrammar(scope) {
  const relative = manifest.grammars[scope];
  if (!relative) return null;
  loaded.add(scope);
  const cache = path.join(root, '.cache', 'grammars', manifest.revision, relative);
  let text;
  try { text = await fs.readFile(cache, 'utf8'); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const url = `https://raw.githubusercontent.com/${manifest.repository}/${manifest.revision}/extensions/${relative.split('/').map(encodeURIComponent).join('/')}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Grammar download failed (${response.status}): ${url}`);
    text = await response.text();
    await fs.mkdir(path.dirname(cache), { recursive: true });
    await fs.writeFile(cache, text);
  }
  return { path: cache, text };
}
module.exports = { loadGrammar, loaded };
