# html-md-sync

npm publish

## Why
- Decoupled content: text lives in Markdown; structure lives in HTML.
- Layout safety: DOM parser (Cheerio) changes only `textContent` or `innerHTML` of mapped nodes.
- Productivity: simple “push” (MD → HTML) and “pull” (HTML → MD) with no guesswork.

## Installation

```bash
npm i -g html-md-sync
# or locally in your project
npm i -D html-md-sync
# local execution
npx html-md-sync help
```

## Quick Start

```bash
# 1) Generate a default config file
html-md-sync init

# 2) Map your files in sync-config.json
# 3) Run the sync
html-md-sync push   # MD → HTML
html-md-sync pull   # HTML → MD
```

### Commands
- `html-md-sync help` – show help
- `html-md-sync version` – show version
- `html-md-sync init [--config <path>]` – create a default `sync-config.json`
- `html-md-sync push [--config <path>]` – write Markdown content into HTML
- `html-md-sync pull [--config <path>]` – extract HTML content into Markdown

## Content Contract

### HTML
Use `data-sync="<key>"` on nodes you want to sync. Optionally set `data-sync-mode="text|html"`:

- `data-sync-mode="text"` (default): syncs `textContent`
- `data-sync-mode="html"`: syncs `innerHTML`

Example:

```html
<h1 data-sync="hero-title">Original Title</h1>
<p data-sync="hero-description">Original description.</p>
<div data-sync="feature-1" data-sync-mode="html"><strong>HTML</strong> allowed</div>
```

### Markdown
Each section starts with a level‑1 heading `# <key>`. Section content goes until the next `# <key>` or EOF.

Example:

```
# hero-title
The Future of AI Orchestration

# hero-description
Turn briefs into functional MVPs in 48 hours.

# feature-1
<p>Use <em>HTML</em> when data-sync-mode="html"</p>
```

## Configuration (`sync-config.json`)

JSON file that “pairs” HTML and Markdown files:

```json
{
  "mappings": [
    {
      "html": "./src/index.html",
      "md": "./content/home.md",
      "strategy": "data-attribute"
    }
  ],
  "options": {
    "preserveAttributes": true,
    "minifyOutput": false
  }
}
```

- `mappings[].html`: path to the HTML file
- `mappings[].md`: path to the corresponding Markdown file
- `strategy`: reserved (MVP uses `data-attribute`)
- `options.preserveAttributes`: reserved (MVP does not change attributes)
- `options.minifyOutput`: reserved (MVP does not minify)

Use `--config <path>` to point to a different config file.

## How It Works

### push (MD → HTML)
1. Read `.md` and build a map `{ key → content }`.
2. Load `.html` with Cheerio.
3. For each `[data-sync]`, if the key exists in the map:
   - `data-sync-mode="text"`: update `textContent`
   - `data-sync-mode="html"`: update `innerHTML`
4. Write the updated HTML back to disk, preserving structure, JS and CSS.

### pull (HTML → MD)
1. Load `.html` with Cheerio.
2. For each `[data-sync]`, capture content (`textContent` or `innerHTML`).
3. Generate a Markdown with `# key` sections containing the captured content.

## Behavior and Edge Cases
- Keys present in HTML but missing in Markdown (during `push`) remain unchanged.
- Keys present in Markdown but missing in HTML (during `push`) are ignored.
- Duplicate keys in Markdown: last occurrence wins.
- Missing `data-sync-mode`: defaults to `"text"`.
- Line endings: HTML output is normalized to `\n`.

## Practical Examples

1) Simple mapping

```json
{
  "mappings": [
    { "html": "./public/index.html", "md": "./content/home.md", "strategy": "data-attribute" }
  ]
}
```

HTML:

```html
<h2 data-sync="cta-title">Sign up now</h2>
<p data-sync="cta-copy">Discover how to accelerate your team.</p>
```

Markdown:

```
# cta-title
Sign up now

# cta-copy
Discover how to accelerate your team.
```

2) Rich content

```html
<section data-sync="features" data-sync-mode="html">
  <ul><li>Fast</li><li>Secure</li></ul>
</section>
```

Markdown:

```
# features
<ul><li>Fast</li><li>Secure</li></ul>
```

## Development

```bash
npm install
node bin/html-md-sync.js help
npm link
html-md-sync help
```

## Roadmap
- Multiple mappings with glob.
- `--dry-run`, `--verbose` and orphan key reports.
- `--watch` for continuous sync.
- Alternative strategies (e.g., custom CSS selectors).

## License
MIT
