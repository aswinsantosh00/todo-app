import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, firebaseSignOut } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (signingIn) return; // Prevent multiple simultaneous sign-in attempts
    
    try {
      setSigningIn(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      // Ignore cancelled popup errors (user closed popup or clicked button again)
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        setError(error.message);
        console.error('Sign in error:', error);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (error) {
      setError(error.message);
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    loading,
    error,
    signingIn,
    signInWithGoogle,
    signOut
  };
}
