# Deploying Feedback Admin to Firebase Hosting

This guide will walk you through deploying your React feedback admin app to Firebase Hosting.

## Prerequisites

1. Firebase CLI installed globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Logged in to Firebase:
   ```bash
   firebase login
   ```

3. Firebase project initialized (already done - configuration in `firebase-functions/firebase.json`)

## Step-by-Step Deployment

### 1. Configure Firebase in the App

Before building, make sure you've updated `feedback-admin/src/firebaseConfig.js` with your actual Firebase project credentials.

### 2. Deploy to Firebase Hosting (Build is Automatic)

The build process is automated in the predeploy script, so you just need to deploy:

From the `firebase-functions` directory (where firebase.json is located), deploy the hosting:

```bash
cd ../firebase-functions
firebase deploy --only hosting
```

Or deploy everything (functions, firestore rules, and hosting):

```bash
firebase deploy
```

### 4. Access Your Deployed App

After deployment completes, Firebase will provide you with a hosting URL, typically:
```
https://YOUR-PROJECT-ID.web.app
```
or
```
https://YOUR-PROJECT-ID.firebaseapp.com
```

## Deployment Commands Reference

### Deploy only hosting:
```bash
cd firebase-functions
firebase deploy --only hosting
```

### Deploy only Firestore rules:
```bash
cd firebase-functions
firebase deploy --only firestore:rules
```

### Deploy only functions:
```bash
cd firebase-functions
firebase deploy --only functions
```

### Deploy everything:
```bash
cd firebase-functions
firebase deploy
```

## Updating the Deployed App

Whenever you make changes to the React app:

1. Rebuild the app:
   ```bash
   cd feedback-admin
   npm run build
   ```

2. Redeploy hosting:
   ```bash
   cd ../firebase-functions
   firebase deploy --only hosting
   ```

## Custom Domain (Optional)

To use a custom domain:

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify ownership and set up DNS records

## Troubleshooting

### Build fails
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript/linting errors in the console
- Ensure Firebase config is properly set in `firebaseConfig.js`

### Deployment fails
- Verify you're logged in: `firebase login`
- Check you're in the correct directory (`firebase-functions`)
- Ensure the build directory exists: `feedback-admin/build`

### App shows blank page after deployment
- Check browser console for errors
- Verify Firebase configuration values are correct
- Make sure Firestore rules are deployed: `firebase deploy --only firestore:rules`

### Authentication not working
- Verify Authentication is enabled in Firebase Console
- Check that users are created in Firebase Console → Authentication
- Ensure Firebase config matches your project

## Quick Deployment Script

You can create a simple deployment script. Create `deploy.sh` in the root:

```bash
#!/bin/bash
echo "Building React app..."
cd feedback-admin
npm run build

echo "Deploying to Firebase..."
cd ../firebase-functions
firebase deploy --only hosting

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

## Production Checklist

Before deploying to production:

- [ ] Firebase config is set with production credentials
- [ ] Authentication is enabled in Firebase Console
- [ ] Admin users are created in Firebase Console
- [ ] Firestore security rules are deployed
- [ ] App has been tested locally (`npm start`)
- [ ] Production build is tested (`npm run build` + serve locally)
- [ ] HTTPS is enforced (Firebase does this automatically)
