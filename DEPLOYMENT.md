# Production Deployment Guide

This project is built with [Vite](https://vitejs.dev/). Building for production is straightforward.

## 1. Build the Application

To create a production build, run the following command found in `package.json`:

```bash
npm run build
```

This will run `vite build` and generate the static assets in the `dist/` directory.

### Build Output
- The `dist/` folder will contain your `index.html` and bundled CSS/JS assets.
- These files are static and can be hosted on any static file server.

## 2. Preview the Build Locally

Before deploying, it is good practice to test the production build locally:

```bash
npm run preview
```

This uses `vite preview` to serve the `dist/` folder locally, usually at `http://localhost:4173/`.

## 3. Deploying to Hosting Providers

Since this is a static site (SPA), you can deploy it to many popular providers.

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel` or use the web dashboard.
2. Run `vercel`.
3. It should automatically detect Vite. The default settings (Output Directory: `dist`) are correct.

### Netlify
1. Create a `netlify.toml` file (optional but recommended) or configure in UI.
2. Build command: `npm run build`
3. Publish directory: `dist`

### GitHub Pages
1. You may need to update `base` in `vite.config.js` if deploying to a subdirectory (e.g., `/repo-name/`).
2. Use a workflow to build and deploy the `dist` folder to the `gh-pages` branch.

## 4. Server-Side Considerations
If you are using the custom server in `server/index.js` (referenced in `package.json` scripts), you will need a Node.js environment to run it.
- **Command**: `npm run server`
- **Hosting**: Heroku, Render, DigitalOcean, or Vercel (using Serverless Functions).

## 5. Process Management with PM2
For production, use PM2 to keep the server running in the background.

```bash
# Install PM2
npm install -g pm2

# Start the server
pm2 start index.js --name vansutra-api --cwd ./server

# Save the process list (for auto-start on reboot)
pm2 save
pm2 startup
```

