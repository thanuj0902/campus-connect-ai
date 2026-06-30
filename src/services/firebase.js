let app = null
let auth = null
let provider = null
let db = null
let isConfigured = false

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
if (apiKey && apiKey !== 'your-firebase-api-key') {
  try {
    const { initializeApp } = await import('firebase/app')
    const { getAuth, GoogleAuthProvider } = await import('firebase/auth')
    const { getFirestore } = await import('firebase/firestore')

    const firebaseConfig = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }

    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    provider = new GoogleAuthProvider()
    db = getFirestore(app)
    isConfigured = true
  } catch {
    isConfigured = false
  }
}

export { auth, provider, db, isConfigured }
