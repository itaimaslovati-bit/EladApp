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

## 4. Environment variables (required for Firebase)

Set these in Netlify so the build does not expose secrets and Firebase works in production:

**Site settings** → **Environment variables** → **Add a variable** (or **Import from .env**).

Add each of these (get values from Firebase Console → Project settings → General → Your apps):

| Variable | Example (replace with yours) |
|----------|-----------------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `eladtrip.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `eladtrip` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `eladtrip.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Your measurement ID (e.g. G-...) |

After adding them, trigger a new deploy (**Deploys** → **Trigger deploy** → **Deploy site**).

For local development, create a `.env.local` in the project root with the same variable names and values (`.env.local` is gitignored).

## 5. Firebase (cloud sync)

- **Photos** sync via Firestore (`trips/japan-2025/media`). No Firebase Storage — images are stored as base64 in documents (Spark plan).
- **Checklist, To Book, Packing, booking links, day captions** sync via `trips/japan-2025` document.
- **First run:** The browser console may show a Firestore error asking you to create an index. Click the link in the error — it opens the Firebase console and creates the required index. Wait 1–2 minutes, then refresh. You may need indexes for:
  - `media`: `dayNumber` (asc) + `timestamp` (asc)
  - `media`: `dayNumber` (==) + `timestamp` (asc)

## 6. PWA and caching

- The app uses `next-pwa`. The service worker and `manifest.json` are built and deployed with the site.
- Users can **Add to Home Screen** on supported browsers; the PWA will load from your Netlify URL.

## Troubleshooting

- **Build fails:** Check the build log in the Netlify **Deploys** tab. Ensure **Node version** is 18 (set in `netlify.toml` and optional `.nvmrc`).
- **404 on refresh:** Next.js and Netlify’s adapter handle routes; if you see 404s, confirm the deploy finished and the correct branch is used.
- **White screen:** Do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or clear site data; old caches can show a blank page.
