// pages/_app.js or a separate login component
"use client"
import { useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import setupUser from './utils/setupUser';

const MyApp = () => {
  const auth = getAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Call setupUser to create the user's document in Firestore
      await setupUser(user);

      // Redirect to chat page after successful login
      window.location.href = '/chat'; // Adjust this as needed for your routing
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    // Check if the user is already logged in and set up
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await setupUser(user); // Ensure user document is set up
        // Redirect to chat page
        window.location.href = '/chat'; // Adjust this as needed for your routing
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div>
      <h1>Chat Application</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default MyApp;
