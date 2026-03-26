const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { parseMarkdownToMap, serializeMapToMarkdown } = require('./markdown');
function readText(p) {
  return fs.readFileSync(p, 'utf8');
}
function writeText(p, s) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s, 'utf8');
}
function normalizeHtml(html) {
  return html.replace(/\r\n/g, '\n');
}
function loadConfig(configPath) {
  const full = path.resolve(process.cwd(), configPath || 'sync-config.json');
  if (!fs.existsSync(full)) {
    throw new Error('Configuration file not found: ' + full);
  }
  const raw = readText(full);
  const conf = JSON.parse(raw);
  if (!Array.isArray(conf.mappings)) {
    throw new Error('Invalid config: "mappings" is missing or not an array');
  }
  conf.options = conf.options || {};
  return { path: full, config: conf };
}
function getNodeContent($, el) {
  const mode = $(el).attr('data-sync-mode') || 'text';
  if (mode === 'html') return $(el).html() || '';
  return $(el).text() || '';
}
function setNodeContent($, el, value) {
  const mode = $(el).attr('data-sync-mode') || 'text';
  if (mode === 'html') {
    $(el).html(value || '');
  } else {
    $(el).text(value || '');
  }
}
async function pushSync(configPath) {
  const { config } = loadConfig(configPath);
  for (const m of config.mappings) {
    const htmlPath = path.resolve(process.cwd(), m.html);
    const mdPath = path.resolve(process.cwd(), m.md);
    if (!fs.existsSync(htmlPath)) throw new Error('HTML file not found: ' + htmlPath);
    if (!fs.existsSync(mdPath)) throw new Error('Markdown file not found: ' + mdPath);
    const html = readText(htmlPath);
    const md = readText(mdPath);
    const map = parseMarkdownToMap(md);
    const $ = cheerio.load(html, { decodeEntities: false });
    $('[data-sync]').each((_, el) => {
      const key = $(el).attr('data-sync');
      if (!key) return;
      if (map.has(key)) {
        const value = map.get(key);
        setNodeContent($, el, value);
      }
    });
    const out = normalizeHtml($.html());
    writeText(htmlPath, out);
  }
}
async function pullSync(configPath) {
  const { config } = loadConfig(configPath);
  for (const m of config.mappings) {
    const htmlPath = path.resolve(process.cwd(), m.html);
    const mdPath = path.resolve(process.cwd(), m.md);
    if (!fs.existsSync(htmlPath)) throw new Error('HTML file not found: ' + htmlPath);
    const html = readText(htmlPath);
    const $ = cheerio.load(html, { decodeEntities: false });
    const map = new Map();
    $('[data-sync]').each((_, el) => {
      const key = $(el).attr('data-sync');
      if (!key) return;
      const value = getNodeContent($, el);
      map.set(key, value || '');
    });
    const md = serializeMapToMarkdown(map);
    writeText(mdPath, md);
  }
}
function writeDefaultConfig(target) {
  const conf = {
    mappings: [
      { html: "./src/index.html", md: "./content/home.md", strategy: "data-attribute" }
    ],
    options: { preserveAttributes: true, minifyOutput: false }
  };
  const p = path.resolve(process.cwd(), target || 'sync-config.json');
  writeText(p, JSON.stringify(conf, null, 2));
  return p;
}
module.exports = { pushSync, pullSync, writeDefaultConfig, loadConfig };
