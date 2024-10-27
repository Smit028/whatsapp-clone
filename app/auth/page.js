// app/auth/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from '../auth/auth'; 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/firebase'; 
import "../globals.css";

const Auth = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/chat");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Chat Application</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={loginWithGoogle}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;
