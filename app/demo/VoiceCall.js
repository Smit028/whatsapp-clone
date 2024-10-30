// app/components/VoiceCall.js
"use client"; // Required for client-side components

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs"; // Correct import
import io from "socket.io-client";

// Make sure to specify the correct path to your API route
const socket = io();

const VoiceCall = () => {
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [myId, setMyId] = useState("");
  const [peer, setPeer] = useState(null); // Store peer instance

  useEffect(() => {
    const getMedia = async () => {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localAudioRef.current.srcObject = stream;

      const newPeer = new Peer(); // Create a new Peer instance
      setPeer(newPeer); // Save the peer instance

      newPeer.on("open", (id) => {
        setMyId(id);
      });

      newPeer.on("call", (call) => {
        call.answer(stream); // Answer the call
        call.on("stream", (remoteStream) => {
          remoteAudioRef.current.srcObject = remoteStream;
        });
      });

      socket.on("signal", (data) => {
        newPeer.signal(data.signal);
      });

      return () => {
        socket.disconnect();
        newPeer.destroy(); // Clean up peer instance
      };
    };

    getMedia();
  }, []);

  const startCall = (remotePeerId) => {
    const call = peer.call(remotePeerId, localAudioRef.current.srcObject);
    call.on("stream", (remoteStream) => {
      remoteAudioRef.current.srcObject = remoteStream;
    });
  };

  return (
    <div>
      <h1>Voice Call Demo</h1>
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
      <button onClick={() => startCall(prompt("Enter the Peer ID to call:"))}>
        Start Call
      </button>
      <p>Your ID: {myId}</p>
    </div>
  );
};

export default VoiceCall;
