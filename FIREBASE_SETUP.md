# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "todov3-sync")
4. Click Continue
5. Disable Google Analytics (optional) or configure it
6. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (</>) to add a web app
2. Register app with a nickname (e.g., "Todo App")
3. **Don't check** "Firebase Hosting" (unless you want it)
4. Click "Register app"
5. Copy the Firebase configuration object shown

## Step 3: Update Firebase Config

1. Open `src/firebase-config.js` in your project
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click on **Google** provider
4. Toggle "Enable"
5. Select a support email
6. Click "Save"

## Step 5: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (for development)
4. Choose a location (closest to you)
5. Click "Enable"

## Step 6: Configure Firestore Security Rules

In Firestore Database, go to **Rules** tab and update:

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

This ensures users can only access their own data.

## Done!

Your app is now configured for cloud sync. Users can:
- Sign in with Google
- Access their tasks from any device
- Data syncs in real-time
- Works offline with Firebase persistence

## Testing

1. Run your app: `npm run dev`
2. Click "Sign In" and authenticate with Google
3. Add some tasks
4. Open the app on another device or browser
5. Sign in with the same Google account
6. Your tasks should appear automatically!
