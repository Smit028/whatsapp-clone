"use client"; // Required for client-side components

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import "../globals.css";

const socket = io();

const VoiceCall = () => {
    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const [myId, setMyId] = useState("");
    const [peer, setPeer] = useState(null);
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [incomingCall, setIncomingCall] = useState(null);
    const [currentCall, setCurrentCall] = useState(null);
    const [callerId, setCallerId] = useState("");

    useEffect(() => {
        const initializePeerAndSocket = () => {
            const newPeer = new Peer({
                config: {
                    iceServers: [
                        { urls: "stun:stun.l.google.com:19302" },
                    ],
                },
            });

            setPeer(newPeer);

            newPeer.on("open", (id) => {
                setMyId(id); // Set the Peer ID
            });

            newPeer.on("call", (call) => {
                setIncomingCall(call);
                setCallerId(call.peer); // Store the caller ID for callback
            });

            // Handle incoming signal messages from the server
            socket.on("signal", (data) => {
                newPeer.signal(data.signal);
            });

            // Handle responses to the call
            socket.on("call_response", (data) => {
                if (data.accepted && incomingCall) {
                    handleCallAccepted();
                } else {
                    setIncomingCall(null); // Clear incoming call state if declined
                }
            });

            // Handle incoming call closure notifications
            socket.on("call_closed", (data) => {
                handleCallEnded(data.peer);
            });

            return () => {
                socket.disconnect();
                newPeer.destroy();
            };
        };

        const getAudioDevices = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputDevices = devices.filter(
                    (device) => device.kind === "audioinput"
                );
                setAudioDevices(audioInputDevices);
                if (audioInputDevices.length > 0) {
                    setSelectedDevice(audioInputDevices[0].deviceId);
                }
            } else {
                console.error("Media devices API not supported in this browser.");
            }
        };

        initializePeerAndSocket();
        getAudioDevices();
    }, []);

    const getAudioStream = async () => {
        const constraints = {
            audio: {
                deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
                channelCount: 2,
                sampleSize: 16,
            },
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            localAudioRef.current.srcObject = stream;
            return stream;
        } catch (error) {
            console.error("Error accessing audio device:", error);
            return null;
        }
    };

    const startCall = async (remotePeerId) => {
        const stream = await getAudioStream();
        if (stream && peer) {
            const call = peer.call(remotePeerId, stream);
            setCurrentCall(call);
            call.on("stream", (remoteStream) => {
                remoteAudioRef.current.srcObject = remoteStream; // Set remote stream
            });
            socket.emit("call_invitation", { to: remotePeerId, call });
        } else {
            console.error("Error starting call. Stream or peer instance not available.");
        }
    };

    const handleCallAccepted = async () => {
        const stream = await getAudioStream();
        incomingCall.answer(stream); // Answer the call
        setCurrentCall(incomingCall); // Set the current call state
        incomingCall.on("stream", (remoteStream) => {
            remoteAudioRef.current.srcObject = remoteStream; // Set remote stream
        });
        localAudioRef.current.srcObject = stream; // Set local stream
        setIncomingCall(null); // Clear incoming call state
    };

    const cutCall = () => {
        if (currentCall) {
            const peerId = currentCall.peer; // Get the peer ID of the current call
            currentCall.close(); // Close the current call
            socket.emit("call_closed", { peer: peerId }); // Notify the other peer that the call is ended
            cleanupCurrentCall(); // Clean up the current call state
        }
    };

    const cleanupCurrentCall = () => {
        setCurrentCall(null); // Clear current call state
        localAudioRef.current.srcObject = null; // Clear local audio
        remoteAudioRef.current.srcObject = null; // Clear remote audio
    };

    const pickupCall = () => {
        if (incomingCall) {
            handleCallAccepted();
        }
    };

    const declineCall = () => {
        if (incomingCall) {
            socket.emit("call_response", { to: incomingCall.peer, accepted: false });
            setIncomingCall(null); // Clear incoming call state
        }
    };

    const handleCallEnded = (peerId) => {
        if (peerId === currentCall?.peer) {
            cleanupCurrentCall(); // Clean up the call state if it was the current call
        }
    };

    return (
        <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-5">Voice Call Demo</h1>
            <p className="mb-4">Your Peer ID: <strong>{myId}</strong></p>
            <audio ref={localAudioRef} autoPlay muted className="hidden" />
            <audio ref={remoteAudioRef} autoPlay className="hidden" />

            <label htmlFor="audio-select" className="mb-2 text-lg">Select Microphone:</label>
            <select
                id="audio-select"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="mb-4 p-2 border rounded-md shadow-md"
            >
                {audioDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${device.deviceId}`}
                    </option>
                ))}
            </select>

            <button
                onClick={() => {
                    const remotePeerId = prompt("Enter the Peer ID to call:");
                    if (remotePeerId) startCall(remotePeerId);
                }}
                disabled={!!incomingCall || !!currentCall}
                className={`mb-4 p-2 rounded-md text-white ${
                    !!incomingCall || !!currentCall ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                } transition duration-300`}
            >
                Start Call
            </button>

            {incomingCall && (
                <div className="mb-4 p-4 border rounded-md shadow-md bg-white">
                    <p className="text-lg font-semibold">Incoming Call from {callerId}...</p>
                    <div className="mt-2">
                        <button onClick={pickupCall} className="mr-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            Accept
                        </button>
                        <button onClick={declineCall} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Decline
                        </button>
                    </div>
                </div>
            )}

            {currentCall && (
                <div className="mt-4 p-4 border rounded-md shadow-md bg-white">
                    <p className="text-lg font-semibold">Current Call with {currentCall.peer}</p>
                    <button onClick={cutCall} className="mt-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                        End Call
                    </button>
                </div>
            )}
        </div>
    );
};

export default VoiceCall;
