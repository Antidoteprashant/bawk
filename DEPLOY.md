# Deploying The Mimicon (Anime4.0)

Your application is production-ready! Here is how to deploy it to the most popular platforms.

## Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory.
3. Follow the prompts (Keep default settings).
4. **Done!** You will get a live URL.

## Option 2: Netlify
1. Log in to Netlify.
2. Drag and drop the `dist/` folder (run `npm run build` first).
3. OR connect your GitHub repository and let Netlify auto-deploy.
   - Build Command: `npm run build`
   - Publish Directory: `dist`

## Option 3: Manual Hosting
1. Run `npm run build`.
2. Upload the contents of the `dist/` folder to your customized web server.
3. Ensure your server is configured to rewrite all 404s to `index.html` (for client-side routing).

## Important Configuration
- **Razorpay**: Before going live, ensure you switch your Razorpay Key in `src/components/Checkout.jsx` to your **Live Mode** key.
- **Favicon**: You may want to replace `public/vite.svg` with your own brand logo.
