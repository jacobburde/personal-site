# Personal Site

A Blake-inspired poetry illumination site.

## Local Development

Open `index.html` in a browser, or serve with any static server:

```bash
npx serve .
```

## Deployment

This site is deployed to Cloudflare Workers.

### Setup

1. Connect your GitHub repo to Cloudflare (Workers & Pages → Create → Start with GitHub)
2. Configure:
   - **Build command:** *(leave empty)*
   - **Deploy command:** `npx wrangler deploy`
3. The `wrangler.json` config tells Cloudflare to serve static assets from the root directory

### Manual Deploy

```bash
npx wrangler deploy
```

Pushes to `main` trigger automatic deployment.
