# Deploy Japan Trip to Netlify

## 1. Push your code to Git

If you haven’t already, put the project in a Git repo and push to GitHub, GitLab, or Bitbucket:

```bash
git init
git add .
git commit -m "Japan Trip PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2. Connect the repo to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in.
2. Click **Add new site** → **Import an existing project**.
3. Choose your Git provider and authorize Netlify.
4. Select the **Japan Trip** repository.
5. Netlify will detect Next.js and fill in:
   - **Build command:** `npm run build` (or leave default)
   - **Publish directory:** (leave as set by Netlify for Next.js)
   - **Base directory:** (leave empty unless the app is in a subfolder)
6. Click **Deploy site**.

## 3. After the first deploy

- Your site will be at `https://random-name-123.netlify.app`.
- To use your own domain: **Domain settings** → **Add custom domain**.
- To change the site name: **Site settings** → **Change site name**.

## 4. Optional: environment variables

This app doesn’t require env vars for basic use. If you add any later, set them in Netlify:

**Site settings** → **Environment variables** → **Add a variable** (or **Import from .env**).

## 5. PWA and caching

- The app uses `next-pwa`. The service worker and `manifest.json` are built and deployed with the site.
- Users can **Add to Home Screen** on supported browsers; the PWA will load from your Netlify URL.

## Troubleshooting

- **Build fails:** Check the build log in the Netlify **Deploys** tab. Ensure **Node version** is 18 (set in `netlify.toml` and optional `.nvmrc`).
- **404 on refresh:** Next.js and Netlify’s adapter handle routes; if you see 404s, confirm the deploy finished and the correct branch is used.
- **White screen:** Do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or clear site data; old caches can show a blank page.
