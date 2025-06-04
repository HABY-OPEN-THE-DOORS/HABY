// Inicialización de Firebase
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"

// Force demo mode for preview environment
const FORCE_DEMO_MODE = true

// Verificar si estamos en modo de demostración
const isDemoMode =
  FORCE_DEMO_MODE || process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY

console.log("Firebase initialization - Demo Mode:", isDemoMode)

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "demo-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "demo-measurement-id",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "demo-database-url",
}

// Create mock objects for demo mode
const createMockFirebase = () => {
  console.log("Creating mock Firebase objects")

  // Mock auth object with basic methods
  const mockAuth = {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      callback(null)
      return () => {} // Return empty unsubscribe function
    },
    signInWithEmailAndPassword: async () => {
      throw new Error("Firebase not available in demo mode")
    },
    createUserWithEmailAndPassword: async () => {
      throw new Error("Firebase not available in demo mode")
    },
    signOut: async () => {},
  }

  // Mock db object with more complete Firestore-like interface
  const mockDb = {
    // Add a special flag to identify this as a mock
    _isMock: true,
    collection: (path: string) => ({
      doc: (id?: string) => ({
        id: id || "mock-doc-id",
        get: async () => ({
          exists: false,
          data: () => ({}),
          id: id || "mock-doc-id",
        }),
        set: async () => {},
        update: async () => {},
        delete: async () => {},
      }),
      add: async () => ({
        id: "mock-doc-id",
      }),
      where: () => mockDb.collection(path),
      orderBy: () => mockDb.collection(path),
      limit: () => mockDb.collection(path),
      get: async () => ({
        docs: [],
        size: 0,
        empty: true,
        forEach: () => {},
      }),
    }),
    batch: () => ({
      set: () => {},
      update: () => {},
      delete: () => {},
      commit: async () => {},
    }),
  }

  // Mock storage object
  const mockStorage = {
    ref: () => ({
      put: async () => {},
      getDownloadURL: async () => "",
    }),
  }

  return {
    app: {} as any,
    auth: mockAuth as any,
    db: mockDb as any,
    storage: mockStorage as any,
  }
}

// Initialize Firebase or create mock objects
let app, auth, db, storage

if (isDemoMode) {
  console.log("Running in demo mode - Using mock Firebase objects")
  const mockFirebase = createMockFirebase()
  app = mockFirebase.app
  auth = mockFirebase.auth
  db = mockFirebase.db
  storage = mockFirebase.storage
} else {
  try {
    // Inicializar Firebase solo una vez
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    // Conectar a emuladores en desarrollo si es necesario
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
      connectAuthEmulator(auth, "http://localhost:9099")
      connectFirestoreEmulator(db, "localhost", 8080)
      connectStorageEmulator(storage, "localhost", 9199)
    }

    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    // Fallback to mock objects on error
    const mockFirebase = createMockFirebase()
    app = mockFirebase.app
    auth = mockFirebase.auth
    db = mockFirebase.db
    storage = mockFirebase.storage
  }
}

export { app, auth, db, storage }
