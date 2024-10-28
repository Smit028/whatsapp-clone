// pages/_app.js or a separate login component
"use client";
import { useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import setupUser from "./utils/setupUser";

const Home = () => {
  const auth = getAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      await setupUser(user);
      window.location.href = "/chat"; // Adjust this as needed for your routing
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await setupUser(user); // Ensure user document is set up
        window.location.href = "/chat"; // Adjust this as needed for your routing
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

export default Home;
