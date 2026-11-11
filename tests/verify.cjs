const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const tm = require('vscode-textmate');
const onig = require('vscode-oniguruma');
const root = path.resolve(__dirname, '..');
const theme = JSON.parse(fs.readFileSync(path.join(root, 'vscode/themes/mariana-faithful-color-theme.json')));
const { loadGrammar, loaded } = require('../scripts/grammars.cjs');
const samples = {
  'source.ts': `// Mariana: original palette, translated scopes\ninterface Theme { name: string; count: number; }\nfunction greet(name: string, count = 3) {\n  const message = "Hello, Mariana";\n  if (count > 0 && true) {\n    console.log(message, name);\n  }\n  return greet(name, count - 1);\n}\nconst theme = { "name": "Mariana", count: 42 };\ntheme.count;`,
  'source.python': `# Muted comments, teal declarations, orange parameters\nclass Theme:\n    def greet(self, name, count=3):\n        message = "Hello, Mariana"\n        if count > 0 and True:\n            print(message, name)\n        return self.greet(name, count - 1)`,
  'source.json': `{\n  "name": "Mariana",\n  "enabled": true,\n  "count": 42,\n  "items": ["Nord", "Everforest"]\n}`,
  'source.shell': `# Matching terminal palette\nexport EDITOR="code"\nfor file in *.json; do\n  printf '%s\\n' "$file"\ndone\ngit status --short`,
  'source.yaml': `# YAML keys differ from string values\nname: Mariana\ncount: 42\nenabled: true\ncolors:\n  - "blue-gray"\n  - "teal"`,
  'text.html.basic': `<section class="theme">\n  <h1>Hello, Mariana</h1>\n  <a href="https://example.com">A matching palette</a>\n</section>`,
  'source.css': `.theme {\n  color: #d8dee9;\n  background: #303841;\n  margin: 12px;\n}`,
  'text.html.markdown': `# Mariana Faithful\n\nA **bold** and *italic* theme with [links](https://example.com).\n\n- Muted comments\n- Teal declarations\n\nInline code: \`git status\`.\n\n[Test Markdown Link](www.google.com)\n[Reference label][ref]\n![Image label](image.png)`,
};

(async () => {
  const wasm = fs.readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm'));
  await onig.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength));
  const registry = new tm.Registry({
    theme: { settings: [{ settings: { foreground: theme.colors['editor.foreground'], background: theme.colors['editor.background'] } }, ...theme.tokenColors] },
    onigLib: Promise.resolve({ createOnigScanner: p => new onig.OnigScanner(p), createOnigString: s => new onig.OnigString(s) }),
    loadGrammar: async scope => { const raw = await loadGrammar(scope); return raw ? tm.parseRawGrammar(raw.text, raw.path) : null; },
  });
  const result = {};
  for (const [scope, sample] of Object.entries(samples)) {
    const grammar = await registry.loadGrammar(scope);
    assert(grammar, `Missing grammar: ${scope}`);
    const lines = []; let state = null;
    for (const line of sample.split('\n')) {
      const detailed = grammar.tokenizeLine(line, state);
      const colored = grammar.tokenizeLine2(line, state);
      state = detailed.ruleStack;
      const colors = registry.getColorMap();
      const tokens = [];
      for (let i=0; i<colored.tokens.length; i+=2) {
        const start = colored.tokens[i], end = colored.tokens[i+2] ?? line.length;
        const metadata = colored.tokens[i+1];
        tokens.push({ text: line.slice(start,end), color: colors[(metadata >>> 15) & 0x1ff],
          style: (metadata >>> 11) & 0xf,
          scopes: detailed.tokens.find(t => t.startIndex <= start && t.endIndex > start)?.scopes });
      }
      lines.push(tokens);
    }
    result[scope] = lines;
  }
  const pick = (scope,line,text) => {
    const t = result[scope][line].find(t=>t.text.includes(text));
    assert(t, `Missing ${text} on ${scope}:${line}`); return t;
  };
  const checks = [
    ['source.ts',0,'// Mariana','#A6ACB9'],
    ['source.ts',2,'greet','#5FB4B4'],
    ['source.ts',2,'name','#F9AE58'],
    ['source.ts',3,'Hello','#99C794'],
    ['source.ts',4,'>','#F97B58'],
    ['source.ts',7,'greet','#6699CC'],
    ['source.ts',9,'Mariana','#99C794'],
    ['source.ts',10,'count','#EC5F66'],
    ['source.ts',8,'}','#FFFFFF'],
    ['source.python',2,'greet','#5FB4B4'],
    ['source.python',5,'print','#6699CC'],
    ['source.json',1,'name','#5FB4B4'],
    ['source.json',1,'Mariana','#99C794'],
    ['source.json',2,'true','#EC5F66'],
    ['source.json',3,'42','#F9AE58'],
    ['source.yaml',1,'name','#5FB4B4'],
    ['source.css',1,'color','#D8DEE9'],
    ['text.html.markdown',9,'Test Markdown Link','#D8DEE9'],
    ['text.html.markdown',9,'www.google.com','#6699CC'],
    ['text.html.markdown',9,'[','#5FB4B4'],
    ['text.html.markdown',9,'](','#5FB4B4'],
    ['text.html.markdown',9,')','#5FB4B4'],
    ['text.html.markdown',10,'Reference label','#D8DEE9'],
    ['text.html.markdown',11,'Image label','#D8DEE9'],
    ['text.html.markdown',11,'image.png','#6699CC'],
  ];
  const checksResult = checks.map(([scope,line,text,expected]) => {
    const token=pick(scope,line,text);
    return {scope,line:line+1,text,expected,actual:token.color,pass:token.color===expected,scopes:token.scopes};
  });
  fs.mkdirSync(path.join(root, 'build'), { recursive: true });
  fs.writeFileSync(path.join(root,'build/tokenized.json'),JSON.stringify(result,null,2));
  fs.writeFileSync(path.join(root,'build/loaded-grammars.json'),JSON.stringify([...loaded],null,2));
  fs.writeFileSync(path.join(root,'build/validation.json'),JSON.stringify(checksResult,null,2));
  for (const c of checksResult) console.log(`${c.pass ? 'PASS' : 'FAIL'} ${c.scope}:${c.line} ${c.text}: ${c.actual}`);
  assert(checksResult.every(c=>c.pass),'Color mismatch; inspect verification.json');
  console.log(`Verified ${checks.length} representative colors across ${Object.keys(result).length} actual VS Code grammars.`);
})();

process.on("unhandledRejection", error => { console.error(error); process.exitCode = 1; });
