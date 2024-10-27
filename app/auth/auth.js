// auth.js
import { auth } from '../firebase/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

// Initialize the Google Auth provider
const provider = new GoogleAuthProvider();

/**
 * Function to log in with Google
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // Optionally, you can access the signed-in user info
    console.log("User signed in: ", result.user);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    // Handle different error codes (optional)
    if (error.code === 'auth/popup-closed-by-user') {
      alert("Popup was closed before completing sign-in. Please try again.");
    } else if (error.code === 'auth/cancelled-popup-request') {
      alert("Sign-in request was cancelled. Please try again.");
    } else {
      alert("Failed to sign in. Please try again.");
    }
  }
};

/**
 * Function to log out the current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
