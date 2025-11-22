# Local Development Setup

## Testing Locally with Netlify Functions

Your site uses Netlify Functions to securely access environment variables. To test locally:

### 1. Install Netlify CLI (if not already installed)
```bash
npm install -g netlify-cli
```

### 2. Make sure `.env.local` exists with your credentials
Already created with your actual values. This file is gitignored.

### 3. Run the local development server
```bash
netlify dev
```

This command:
- Starts a local server (usually at http://localhost:8888)
- Runs your Netlify Functions locally at `/.netlify/functions/*`
- Automatically loads environment variables from `.env.local`
- Simulates the production Netlify environment

### 4. Test your site
- Open http://localhost:8888 in your browser
- Firebase and Paystack will work via the local function endpoint
- All functionality will work exactly as on production

## Alternative: Direct File Access (Simple Testing)

If you just want to test without Netlify CLI, you can temporarily use Live Server or similar, but the Netlify Functions won't work. You'd need to modify the config files to use hardcoded values temporarily (NOT recommended).

## Environment Variables

Your `.env.local` file contains:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_DATABASE_URL`
- `PAYSTACK_PUBLIC_KEY`

**These are automatically available to Netlify Functions when running `netlify dev`.**

## Deployment

When you push to GitHub:
1. Netlify auto-deploys
2. Uses environment variables from Netlify Dashboard
3. Functions run server-side with secure access to secrets

## Quick Commands

```bash
# Start local dev server
netlify dev

# Deploy to production
git push

# Test function locally
netlify functions:serve

# Link to Netlify site (first time only)
netlify link
```
