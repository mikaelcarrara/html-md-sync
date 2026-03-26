# html-md-sync — Deterministic HTML ↔ Markdown content sync

html-md-sync syncs text between HTML (via `data-sync`) and Markdown without touching JS/CSS or DOM structure. Built for modern AI workflows: hand the `.md` to the language model and keep the `.html` protected.

## One‑liner
Sync landing page content between HTML and Markdown with layout safety and full predictability.

## Problem
Editing copy directly in HTML (or via AI) breaks styles, scripts and structure. “Smart” tools try to guess what to change and end up causing invisible regressions.

## Solution
Deterministic contract mapping. You mark HTML with `data-sync` and write content in Markdown. html-md-sync updates only the content of mapped nodes, preserving everything else.

## Benefits
- Layout safety: replaces only `textContent` or `innerHTML`.
- Proper decoupling: text in `.md`, structure in `.html`.
- Predictability: no heuristics; a simple `data-attributes` contract.
- Developer‑friendly: small CLI, clear examples, zero lock‑in.
- AI‑friendly: `.md` ready for models; `.html` for structure‑level edits.

## Who uses it
- Product and marketing teams iterating copy with AI.
- Devs maintaining static sites or component templates.
- Teams pursuing “Signal over Noise” in content pipelines.

---

## How it works (overview)
1. In HTML, annotate each content node with `data-sync="key"` and optionally `data-sync-mode="text|html"`.
2. In Markdown, create `# key` sections with corresponding content.
3. Run:
   - `html-md-sync push`: apply Markdown to HTML
   - `html-md-sync pull`: extract HTML to Markdown

### Content contract
HTML:
```html
<h1 data-sync="hero-title">Original Title</h1>
<p data-sync="hero-description">Original description.</p>
<div data-sync="feature-1" data-sync-mode="html"><strong>HTML</strong> allowed</div>
```

Markdown:
```
# hero-title
The Future of AI Orchestration

# hero-description
Turn briefs into functional MVPs in 48 hours.

# feature-1
<p>Use <em>HTML</em> when data-sync-mode="html"</p>
```

---

## Installation
Global:
```bash
npm i -g html-md-sync
```
Local to project:
```bash
npm i -D html-md-sync
npx html-md-sync help
```

## Quick start
```bash
html-md-sync init
# edit sync-config.json and map your files
html-md-sync push   # apply MD → HTML
html-md-sync pull   # extract HTML → MD
```

## CLI
- `html-md-sync help` – help
- `html-md-sync version` – version
- `html-md-sync init [--config <path>]` – create default `sync-config.json`
- `html-md-sync push [--config <path>]` – MD → HTML
- `html-md-sync pull [--config <path>]` – HTML → MD

## Configuration
`sync-config.json`:
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
- `mappings[].html`: HTML path
- `mappings[].md`: Markdown path
- `strategy`: reserved (MVP uses `data-attribute`)
- `options.*`: reserved flags for future versions

## Guarantees and limits
- Only edits nodes with `[data-sync]`.
- `data-sync-mode`:
  - `text` (default) → updates `textContent`
  - `html` → updates `innerHTML`
- Keys in MD with no match in HTML: ignored on `push`.
- Keys in HTML with no match in MD: left unchanged on `push`.
- Duplicate keys in MD: last occurrence wins.
- Normalizes line endings to `\n` in HTML output.

## AI integration
- Give only the `.md` to the language model for copy edits.
- Run `push` to safely apply content to HTML.
- For a snapshot of the current site, run `pull` before iterating.

## Additional examples
Rich content selection:
```html
<section data-sync="features" data-sync-mode="html">
  <ul><li>Fast</li><li>Secure</li></ul>
</section>
```
Markdown for the section:
```
# features
<ul><li>Fast</li><li>Secure</li></ul>
```

---

## Roadmap
- File globs and multiple mappings by default.
- `--dry-run`, `--verbose` and orphan key reports.
- `--watch` for continuous sync.
- Alternative strategies (e.g., custom CSS selectors).

## FAQ
**Can I use this with frameworks?**  
Yes. Point to the final HTML or to the templates that produce it.

**Does it modify attributes, classes or scripts?**  
No. Only the content of marked nodes.

**Can I sync rich HTML?**  
Yes, using `data-sync-mode="html"`.

**How should I version this?**  
Version `.md`, `.html` and `sync-config.json`. Use `pull` to capture the current state before editing.

---

## Landing page guidelines (suggested structure)
1. Hero
   - Title: “Sync HTML ↔ Markdown content without breaking your layout”
   - Subtitle: “Deterministic `data-sync` contract. Markdown for LLMs, HTML for devs.”
   - CTA: “Install now” (anchor to Installation) and “See example”
2. Proof/Benefits
   - Layout safety, predictability, AI‑friendly, developer‑friendly
3. How it works
   - 3 steps with code snippets (HTML/MD/CLI)
4. Installation & Quick start
   - copyable blocks
5. Documentation (CLI, Config, Contract)
6. FAQ
7. Final CTA

## Messaging/Copy (suggestions)
- Headline: “Content in Markdown. Layout untouched. Sync with confidence.”
- Subheadline: “A contract that separates text from structure — and keeps your landing intact.”
- CTA: “Install via npm”

## SEO
- Keywords: html markdown sync, data-sync, decoupled content, sync md html, content cli
- Meta description: “Sync content between HTML and Markdown with layout safety using html-md-sync. Simple CLI for push/pull with a data‑attributes contract.”

## License
MIT

