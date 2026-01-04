# Personal Site

Blake-inspired poetry illumination site.

## Project Structure

- `index.html` - Homepage
- `poem.html` - Individual poem viewer
- `poems/` - Poem content (markdown files + index.json)
- `css/` - Stylesheets
- `js/` - JavaScript
- `assets/` - Images and textures

## Deployment

Deployed to Cloudflare Workers via GitHub integration.

**Configuration:** `wrangler.json` defines the static asset deployment.

**Deploy command:** `npx wrangler deploy`

Pushes to `main` trigger automatic deployment.
