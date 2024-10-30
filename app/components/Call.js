"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "../firebase/firebase";
import "../globals.css"

const Call = () => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState("Ringing...");
  const [callDuration, setCallDuration] = useState(0);
  const [timer, setTimer] = useState(null);
  const userId = new URLSearchParams(window.location.search).get("userId");

  useEffect(() => {
    // Start the call timer
    setTimer(setInterval(() => setCallDuration((prev) => prev + 1), 1000));

    // Cleanup timer on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  const endCall = () => {
    clearInterval(timer);
    router.push("/chat"); // Redirect back to chat
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">{callStatus}</h1>
      <h2 className="text-lg">{`Duration: ${Math.floor(callDuration / 60)
        .toString()
        .padStart(2, "0")}:${(callDuration % 60)
        .toString()
        .padStart(2, "0")}`}</h2>
      <button
        onClick={endCall}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        End Call
      </button>
    </div>
  );
};

export default Call;
