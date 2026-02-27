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

**Option A — New site (recommended so the deploy “shows” as EladApp)**  
1. Go to [app.netlify.com](https://app.netlify.com) and sign in.  
2. Click **Add new site** → **Import an existing project**.  
3. Choose **GitHub** and authorize Netlify.  
4. Select the **EladApp** repo (`itaimaslovati-bit/EladApp`).  
5. Netlify will detect Next.js. Leave **Build command** as `npm run build`.  
6. Click **Deploy site**. Your app will be at `https://<site-name>.netlify.app`.

**Live site:** **konichiwaapp** — deploys from GitHub (Next.js). URL: **https://konichiwaapp.netlify.app**

## 3. After the first deploy

- This app is live at **https://konichiwaapp.netlify.app** (deploys from GitHub).
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
