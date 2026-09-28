import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  setDoc, 
  collection, 
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test Firestore connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Firestore connection verified successfully.');
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Firestore client appears offline or connecting.');
    }
    return false;
  }
}

// Google Sign-In Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Save or update user profile in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        id: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'User',
        photoURL: result.user.photoURL || '',
        createdAt: Date.now()
      }, { merge: true });
    }
    return result.user;
  } catch (err: any) {
    console.error('[Firebase] Sign-in error:', err);
    throw err;
  }
}

export async function signOutUser() {
  return fbSignOut(auth);
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// User Firestore Collections helpers
export async function saveUserMemory(userId: string, memory: { id: string; category: string; key: string; value: string; updatedAt: number }) {
  if (!userId) return;
  const ref = doc(db, 'users', userId, 'memories', memory.id);
  await setDoc(ref, { ...memory, userId }, { merge: true });
}

export async function deleteUserMemory(userId: string, memoryId: string) {
  if (!userId) return;
  const ref = doc(db, 'users', userId, 'memories', memoryId);
  await deleteDoc(ref);
}

export async function saveUserCreation(userId: string, creation: { id: string; type: string; prompt: string; mediaUrl: string; status: string; createdAt: number }) {
  if (!userId) return;
  const ref = doc(db, 'users', userId, 'creations', creation.id);
  await setDoc(ref, { ...creation, userId }, { merge: true });
}

export async function saveUserTask(userId: string, task: any) {
  if (!userId) return;
  const ref = doc(db, 'users', userId, 'tasks', task.id);
  await setDoc(ref, { ...task, userId }, { merge: true });
}
