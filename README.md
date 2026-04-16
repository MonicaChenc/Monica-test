# Monica Docs

This documentation website is built with [Docusaurus](https://docusaurus.io/).

## Install dependencies

```bash
npm ci
```

## Local development

```bash
npm run start
```

This starts a local development server and opens your site in a browser.

## Build

```bash
npm run build
```

This generates static files into the `build` directory.

## Deploy to GitHub Pages

Deployment is handled by GitHub Actions in `.github/workflows/deploy.yml`.

When you push to the `main` branch, the workflow will:

1. Install dependencies
2. Build the site
3. Deploy the `build` output to GitHub Pages

### GitHub Pages setup (one-time)

1. Go to your repository Settings
2. Open Pages
3. In "Build and deployment", set Source to "GitHub Actions"
