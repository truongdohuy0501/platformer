# Platformer

A Phaser 3 platformer built with TypeScript and Vite.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Publish on GitHub Pages

This repo includes a GitHub Actions workflow that builds and deploys to **GitHub Pages** on every push to `main`.

### One-time setup

1. Push this repository to GitHub (`truongdohuy0501/platformer` or your fork).
2. In the repo on GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
4. Push to `main` (or run the workflow manually under **Actions → Build and Deploy → Run workflow**).

After the workflow succeeds, the game is live at:

**https://truongdohuy0501.github.io/platformer/**

(Replace `truongdohuy0501` with your GitHub username if different.)

### CI behavior

| Event | What runs |
|-------|-----------|
| Pull request to `main` | `npm ci` + `npm run build` (no deploy) |
| Push to `main` | Build + deploy to GitHub Pages |

### Custom domain

In **Settings → Pages**, add your domain and follow GitHub’s DNS instructions. Update `VITE_BASE_PATH` in `.github/workflows/deploy.yml` if the app is served from the domain root (`/`).

## Project structure

- `src/` — game code (scenes, systems, entities)
- `public/` — assets, maps, data JSON
- `.github/workflows/deploy.yml` — CI/CD pipeline
