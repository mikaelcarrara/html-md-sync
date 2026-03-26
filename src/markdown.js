const EOL = /\r?\n/;
function parseMarkdownToMap(md) {
  const lines = md.split(EOL);
  const map = new Map();
  let currentKey = null;
  let buffer = [];
  for (const line of lines) {
    const m = line.match(/^\s*#\s+(.+)\s*$/);
    if (m) {
      if (currentKey !== null) {
        const content = buffer.join('\n').replace(/^\n+|\n+$/g, '');
        map.set(currentKey, content);
      }
      currentKey = m[1].trim();
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  if (currentKey !== null) {
    const content = buffer.join('\n').replace(/^\n+|\n+$/g, '');
    map.set(currentKey, content);
  }
  return map;
}
function serializeMapToMarkdown(map) {
  const parts = [];
  for (const [key, value] of map.entries()) {
    parts.push(`# ${key}`);
    parts.push(value ? String(value) : '');
    parts.push('');
  }
  return parts.join('\n').replace(/\n+$/g, '\n');
}
module.exports = { parseMarkdownToMap, serializeMapToMarkdown };
