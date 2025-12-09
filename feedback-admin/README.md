# Feedback Admin Dashboard

A React web application for browsing user feedback stored in Firebase Firestore.

## Features

- **Firebase Authentication**: Secure login with email/password
- **Real-time Feedback List**: Displays feedbacks sorted by newest first
- **Responsive Design**: Works on desktop and mobile devices
- **User Management**: Logout functionality

## Setup Instructions

### 1. Install Dependencies

Navigate to the feedback-admin directory and install the required packages:

```bash
cd feedback-admin
npm install
```


### 5. Run the Application

Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Usage

1. **Login**: Enter the email and password of a user you created in Firebase Console
2. **View Feedback**: Once logged in, you'll see a list of all feedback entries sorted by newest first
3. **Logout**: Click the "Logout" button in the header to sign out

## Project Structure

```
feedback-admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js           # Login form component
│   │   └── FeedbackList.js    # Feedback list with real-time updates
│   ├── App.js                 # Main app component with auth state
│   ├── App.css                # Global styles
│   ├── index.js               # React entry point
│   └── firebaseConfig.js      # Firebase configuration
├── package.json
└── README.md
```

## Data Structure

The app reads from the `userFeedback` collection in Firestore. Each document has:

- `appName` (string): Name of the app the feedback is from
- `feedbackText` (string): The feedback content
- `createdAt` (timestamp): When the feedback was submitted

## Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build/` folder, ready for deployment.

## Deployment Options

You can deploy this app to:

- **Firebase Hosting**: `firebase deploy --only hosting`
- **Netlify**: Connect your Git repository or drag & drop the build folder
- **Vercel**: Import your Git repository
- **Any static hosting service**

## Troubleshooting

### "Firebase: Error (auth/user-not-found)"
- Make sure you've created the user in Firebase Console
- Double-check the email address

### "Firebase: Error (auth/wrong-password)"
- Verify the password is correct

### No feedbacks showing
- Check that feedbacks exist in the `userFeedback` collection
- Verify Firestore security rules allow authenticated reads
- Check browser console for errors

### Firebase configuration errors
- Ensure all values in `firebaseConfig.js` are correctly copied from Firebase Console
- Make sure there are no extra quotes or spaces
