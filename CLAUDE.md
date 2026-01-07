# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Fulgurations — a brutalist poetry site. Static site with no build step, vanilla HTML, CSS, and JavaScript. Dark mode, system fonts, minimal design.

## Development

```bash
# Local development - serve with any static server
npx serve .

# Deploy to Cloudflare Workers
npx wrangler deploy
```

No build, lint, or test commands. Pushes to `main` trigger automatic Cloudflare deployment.

## Architecture

### Page Flow
- `index.html` → loads `grid-loader.js` → fetches `poems/index.json` → renders poem list
- `poem.html?poem=<slug>` → loads `poem-loader.js` → fetches `poems/<slug>.md` → parses with `markdown.js` → renders poem

### JavaScript Globals
- `window.BlakePoetry` (from `main.js`): shared utilities (`getQueryParams`, `escapeHtml`)
- `window.BlakeMarkdown` (from `markdown.js`): poem parser (`parse`, `parseFrontmatter`, `poemToHtml`)

### Adding a Poem
1. Create `poems/<slug>.md` with YAML frontmatter:
   ```yaml
   ---
   title: Poem Title
   order: 1
   ---

   Poem text here.
   Blank lines separate stanzas.
   ```
2. Add entry to `poems/index.json`:
   ```json
   { "slug": "my-poem", "title": "Poem Title", "excerpt": "First line...", "order": 2 }
   ```

### Design
- Dark charcoal background (`#1a1a1a`), off-white text (`#f5f1e6`)
- Muted gold accent (`#b8a04a`) for links
- System font stacks: serif for poems, monospace for navigation
- No external dependencies
