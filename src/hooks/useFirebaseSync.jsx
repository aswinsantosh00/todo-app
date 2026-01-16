import { useEffect, useState } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function useFirebaseSync(user, localTasks, listType) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  // Sync local tasks to Firebase when they change
  useEffect(() => {
    if (!user || !db) return;

    const syncToFirebase = async () => {
      try {
        setSyncing(true);
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          tasks: localTasks,
          listType: listType,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
        setSyncError(null);
      } catch (error) {
        console.error('Sync error:', error);
        setSyncError(error.message);
      } finally {
        setSyncing(false);
      }
    };

    // Debounce syncing to avoid too many writes
    const timer = setTimeout(syncToFirebase, 1000);
    return () => clearTimeout(timer);
  }, [user, localTasks, listType]);

  // Listen for changes from Firebase (other devices)
  useEffect(() => {
    if (!user || !db) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // Only update if data exists and is different
        if (data.tasks && JSON.stringify(data.tasks) !== JSON.stringify(localTasks)) {
          // We'll handle this in the App component to avoid circular updates
          // For now, just log it
          console.log('Remote data available:', data);
        }
      }
    }, (error) => {
      console.error('Snapshot error:', error);
      setSyncError(error.message);
    });

    return () => unsubscribe();
  }, [user]);

  return { syncing, syncError };
}
