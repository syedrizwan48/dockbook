# Deploy DockBook to Vercel — Step by step

Your friend will only see the live app (login, booking, admin).  
They will **not** see your source code, Arena, or any backend tools.

---

## What you need

- A free [Vercel](https://vercel.com) account  
- A free [GitHub](https://github.com) account (recommended method)  
- The `loading-dock-app` folder from this project  

**Vercel settings for this app (already configured):**

| Setting | Value |
|---------|--------|
| Framework | Vite |
| Build command | `npm run build` |
| Output folder | `dist` |
| SPA rewrites | Yes (`vercel.json`) |

---

# METHOD 1 — GitHub + Vercel (best for sharing)

## Step 1 — Get the project onto your computer

1. Download the **`loading-dock-app`** folder from Arena (workspace download / zip).
2. Unzip it somewhere easy, e.g. Desktop.
3. Open the folder and confirm you see:
   - `package.json`
   - `src/`
   - `public/`
   - `vercel.json`
   - `index.html`

You do **not** need `node_modules` for upload to GitHub.

---

## Step 2 — Create a GitHub repository

1. Go to **https://github.com** and sign in (or create a free account).
2. Click the **+** (top right) → **New repository**.
3. Fill in:
   - **Repository name:** `dockbook` (or any name)
   - **Public** (easiest for free deploy)
   - Do **not** tick “Add a README” if you will upload existing files
4. Click **Create repository**.

---

## Step 3 — Upload your app code to GitHub

### Easy way (no terminal): GitHub website

1. On the new empty repo page, click **uploading an existing file**.
2. Drag **all files and folders inside** `loading-dock-app`  
   (not the outer zip — the contents: `src`, `public`, `package.json`, etc.).
3. **Do not upload** `node_modules` if it appears (it’s large and not needed).
4. Scroll down → **Commit changes**.

### Or with Git on your computer

```bash
cd loading-dock-app
git init
git add .
git commit -m "DockBook app ready for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dockbook.git
git push -u origin main
```

Replace `YOUR_USERNAME/dockbook` with your real repo URL.

---

## Step 4 — Sign up / log in to Vercel

1. Go to **https://vercel.com**
2. Click **Sign Up** (or Log in).
3. Choose **Continue with GitHub** (recommended — one click link).
4. Allow Vercel to access your GitHub if asked.

---

## Step 5 — Import the project on Vercel

1. On the Vercel dashboard, click **Add New…** → **Project**.
2. You should see your GitHub repos. Find **`dockbook`** (or whatever you named it).
3. Click **Import**.

---

## Step 6 — Check build settings

Vercel usually auto-detects Vite. Confirm:

| Field | Should be |
|-------|-----------|
| **Framework Preset** | Vite |
| **Root Directory** | `./` (leave default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` (default) |

You do **not** need Environment Variables for this app.

Click **Deploy**.

---

## Step 7 — Wait for the build

1. Vercel will install packages and run the build (about 1–2 minutes).
2. When it says **Congratulations** / **Ready**, you’re live.
3. Click the **Visit** button (or the generated URL).

Your link will look like:

```text
https://dockbook-xxxx.vercel.app
```

or

```text
https://dockbook.vercel.app
```

---

## Step 8 — Send the link to your friend

Send **only** that `https://….vercel.app` link.

### What your friend sees
- DockBook sign-in / register  
- Booking screens  
- Bay photos  

### What they do **not** see
- Your code  
- Arena  
- Vercel dashboard  
- GitHub repo (unless the repo is public and they go looking — see note below)

**Optional privacy tip:**  
If the GitHub repo is **Public**, anyone with the repo URL can view source.  
That is normal for free open projects. To hide source:
- Make the GitHub repo **Private**, and  
- In Vercel, still deploy from that private repo (works on free tier with your GitHub login).

Your friend only needs the Vercel app URL, not the GitHub link.

---

## Step 9 — How your friend uses it

1. Open the link you sent.  
2. Click **Register** and create their own account.  
3. Book a loading bay.

**Admin (approve/reject):**

- Email: `admin@dock.com`  
- Password: `admin123`  

Only share admin details with people who should approve bookings.  
Change that password in the code later if this goes to a wider group.

---

## Important: data note

Bookings are stored in **each browser** (`localStorage`).

- Your laptop and your friend’s phone do **not** share the same bookings yet.  
- Admin approvals on one device won’t appear on another until you add a real database later.

The link still works perfectly for **showing the app** and testing the UI.

---

# METHOD 2 — Vercel without GitHub (CLI)

Use this if you don’t want GitHub yet. You run this **on your own computer** after downloading the project.

1. Install Node.js from **https://nodejs.org** (LTS).
2. Open Terminal (Mac) or Command Prompt / PowerShell (Windows).
3. Go to the project folder:

```bash
cd path/to/loading-dock-app
```

4. Log in to Vercel:

```bash
npx vercel login
```

Follow the browser login.

5. Deploy:

```bash
npx vercel
```

Answer the prompts (defaults are fine):
- Set up and deploy? **Y**
- Which scope? your account  
- Link to existing project? **N**  
- Project name? `dockbook`  
- Directory? `./`  
- Want to modify settings? **N**

6. Production link:

```bash
npx vercel --prod
```

7. Copy the **Production** URL and send it to your friend.

---

# After deploy — checklist

- [ ] Open the Vercel URL yourself first  
- [ ] Register a test user  
- [ ] Create a booking  
- [ ] Log in as admin and approve it  
- [ ] Only then send the link to your friend  
- [ ] Do **not** send Arena preview links  
- [ ] Do **not** send `localhost` links  

---

# Common problems

### “404” when refreshing /dashboard or /book
`vercel.json` already fixes this with rewrites. Redeploy if you added it after the first deploy.

### Blank white page
Output directory must be **`dist`** (not `build`).

### Build failed on Vercel
Check the build log. Usually missing files in the GitHub upload — make sure `package.json` and `src/` were committed.

### Friend can’t access Arena link
Correct — Arena previews are not for sharing. Always use the Vercel URL.

---

# Updating the app later

1. Change code on your computer.  
2. Push to GitHub again (`git add` → `git commit` → `git push`).  
3. Vercel **auto-redeploys**.  
4. Same link still works — no need to resend unless the URL changed.

---

# Quick summary

1. Upload `loading-dock-app` to **GitHub**  
2. **vercel.com** → Import that repo  
3. Deploy (build: `npm run build`, output: `dist`)  
4. Copy `https://your-app.vercel.app`  
5. Send **that link only** to your friend  

They only see DockBook — not your backend, code editor, or Arena.
