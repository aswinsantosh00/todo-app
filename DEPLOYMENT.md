# Deployment Guide - Vercel

## Quick Deploy Steps

### 1. Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### 2. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Choose your account
- **Link to existing project**: No (first time)
- **Project name**: todov3 (or your preferred name)
- **In which directory**: ./ (press Enter)
- **Want to modify settings**: No (press Enter)

Your app will be deployed! 🚀

### 3. Production Deployment
After testing the preview URL, deploy to production:
```bash
vercel --prod
```

## Important: Post-Deployment Setup

### Update Firebase Settings

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: todo-sync-da398
3. **Go to Authentication** > **Settings** > **Authorized domains**
4. **Add your Vercel domain** (e.g., `your-app.vercel.app`)

### Update Firestore Security Rules (If still in test mode)

In Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish** to save the rules.

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** > **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Add custom domain to Firebase authorized domains

## Environment Variables (If needed in future)

If you add any secrets, use Vercel environment variables:
1. Go to project **Settings** > **Environment Variables**
2. Add variables
3. Redeploy

## Automatic Deployments

Connect your GitHub repository for automatic deployments:
1. Push code to GitHub
2. In Vercel, **Import** your repository
3. Every push to main branch will auto-deploy

## Your Project URLs

- **Preview**: Will be shown after first `vercel` command
- **Production**: Will be shown after `vercel --prod`
- Format: `https://todov3.vercel.app` (or similar)

## Troubleshooting

### Build Fails
- Check `npm run build` works locally first
- Check for console errors in browser

### Firebase Not Working
- Verify domain added to Firebase authorized domains
- Check Firebase config in `src/firebase-config.js`
- Ensure Firestore rules are published

### App Not Loading
- Check browser console for errors
- Verify all dependencies in package.json
- Clear browser cache

## Support

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
