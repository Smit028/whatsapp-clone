"use client";
import { useEffect, useState, useRef } from "react";
import { firestore, auth } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  getDocs
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import UserList from "../components/UserList";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../globals.css";
import Img1 from "./alter.jpeg";
import VoiceCall from "../VoiceCall/VoiceCall";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const storage = getStorage();
  
  // Audio references and flag for send/receive sounds
  const sendSoundRef = useRef(null);
  const receiveSoundRef = useRef(null);
  const isSending = useRef(false);  // Flag to control audio playback

  const handleBeforeUnload = () => {
    if (currentUser) {
      updateDoc(doc(firestore, "users", currentUser.id), {
        status: "offline",
        lastSeen: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await updateDoc(doc(firestore, "users", user.uid), {
          status: "online",
          lastSeen: serverTimestamp(),
        });
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, ...userDoc.data() });
        }

        window.addEventListener("beforeunload", handleBeforeUnload);
      } else {
        router.push("/auth");
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const userChatId = [auth.currentUser.uid, selectedUser.id].sort().join("_");
      const unsubscribeUserChat = onSnapshot(
        collection(firestore, `chat/${userChatId}/messages`),
        (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(
            messagesData.sort(
              (a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)
            )
          );
          // Play receive sound only if not sending and a new message is received
          if (messagesData.length > messages.length && receiveSoundRef.current && !isSending.current) {
            receiveSoundRef.current.play();
          }
        }
      );

      return () => unsubscribeUserChat();
    }
  }, [selectedUser, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      const userChatId = [auth.currentUser.uid, selectedUser.id].sort().join("_");
      try {
        isSending.current = true; // Set isSending flag
        await addDoc(collection(firestore, `chat/${userChatId}/messages`), {
          text: newMessage,
          uid: auth.currentUser.uid,
          timestamp: serverTimestamp(),
          delivered: true,
          seen: false,
        });
        setNewMessage("");
        inputRef.current.focus();
        
        if (sendSoundRef.current) {
          sendSoundRef.current.play();
          sendSoundRef.current.onended = () => {
            isSending.current = false; // Reset flag when send sound ends
          };
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const sendImage = async () => {
    if (imageFile && selectedUser) {
      const userChatId = [auth.currentUser.uid, selectedUser.id]
        .sort()
        .join("_");
      const messagesCollection = collection(
        firestore,
        `chat/${userChatId}/messages`
      );
      const storageRef = ref(
        storage,
        `chat_images/${Date.now()}_${imageFile.name}`
      );

      try {
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        await addDoc(messagesCollection, {
          imageUrl,
          uid: auth.currentUser.uid,
          timestamp: serverTimestamp(),
          delivered: true,
          seen: false,
        });
        setImageFile(null);
        
        if (sendSoundRef.current) {
          sendSoundRef.current.play(); // Play sound on sending image
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
  
    const userChatId = [auth.currentUser.uid, user.id].sort().join("_");
    const messagesRef = collection(firestore, `chat/${userChatId}/messages`);
  
    const snapshot = await getDocs(messagesRef);
    snapshot.forEach(async (messageDoc) => {
      const messageData = messageDoc.data();
      if (!messageData.seen && messageData.uid !== auth.currentUser.uid) {
        await updateDoc(messageDoc.ref, { seen: true });
      }
    });
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSend = async () => {
    await Promise.all([sendMessage(), sendImage()]);
  };



// voice call


const handlevoicecall = () =>{
  // router.push({
  //   pathname:"/demo1",
  //   query: {
  //     currentUserId: currentUser.id,
  //     currentUserName: currentUser.name,
  //     currentUserPhotoURL: currentUser.photoURL,
  //     chatUserId: users.id,
  //     chatUserName: users.name,
  //     chatUserPhotoURL: users.photoURL,
  //   },
  // }); 
  router.push(`/VoiceCall?currentUserId=${currentUser.id}&chatUserId=${selectedUser.id}`)
}



  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-gray-100">
      {/* Audio files for message sounds */}
      <audio
        ref={sendSoundRef}
        src="https://media.memesoundeffects.com/2022/03/WhatsApp-Sending-Message-Sound-Effect.mp3"
        preload="auto"
        onError={(e) => console.error("Error loading send sound:", e)}
      />
      <audio
        ref={receiveSoundRef}
        src="https://sounddino.com/mp3/44/incoming-message-online-whatsapp.mp3"
        preload="auto"
        onError={(e) => console.error("Error loading receive sound:", e)}
      />
  
      {/* User list for selecting chat */}
      {(!selectedUser || window.innerWidth >= 768) && (
        <UserList
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          unreadCounts={unreadCounts}
          className="w-full md:w-1/3 border-r border-gray-300 bg-white"
          currentUser={currentUser}
        />
      )}
  
      {/* Chat area for selected user */}
      {selectedUser && (  
        <div className="flex-1 flex flex-col back bg-white">
          <div className="p-4 border-b border-gray-300 bg-gray-50 flex items-center">
            {window.innerWidth < 768 && (
              <button
                onClick={() => setSelectedUser(null)}
                className="text-blue-500 mr-2"
              >
                ← Back
              </button>
            )}
  
            {/* Profile Image of Selected User */}
            <img
              src={selectedUser.photoURL || Img1} // Use selected user's photo or a default image
              alt={`${selectedUser.name}'s profile`}
              className="w-8 h-8 rounded-full mr-3" // Style for the image
            />
            <h3 className="text-lg font-semibold">{selectedUser.name}</h3><button onClick={() => handlevoicecall()}>Call</button>
          </div>
  
          <div className="flex-1 overflow-y-auto bg-gray-50 max-h-[calc(100vh-200px)]">
            <div className="flex flex-col space-y-4 p-4">
            {messages.map((msg) => {
  const messageUser = users.find((user) => user.id === msg.uid);
  const messageTime = new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      key={msg.id}
      className={`flex items-start space-x-3 ${msg.uid === auth.currentUser.uid ? "justify-end" : ""}`}
    >
      <div
        className={`p-2 rounded-lg shadow-sm max-w-xs ${
          msg.uid === auth.currentUser.uid
            ? "bg-[#dcf8c6] text-black self-end"
            : "bg-gray-200 text-gray-800 self-start"
        } flex flex-col`}
        style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }} // Allow text wrapping
      >
        <div className="flex-1">
          {msg.imageUrl ? (
            <img
              src={msg.imageUrl}
              alt="Sent"
              className="rounded-md mb-1"
            />
          ) : (
            <span className="block mb-1">{msg.text}</span>
          )}
        </div>
        <div className="flex justify-end items-center space-x-1 text-[10px] text-gray-500">
          <span>{messageTime}</span>
          {msg.uid === auth.currentUser.uid && (  // Only show ticks for the sender's messages
            <span className={`ml-1 ${msg.seen ? "text-green-600" : "text-gray-500"}`}>
              {msg.seen ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
})}

  
              <div ref={messagesEndRef} />
            </div>
          </div>
  
          <div className="p-2 border-t border-gray-300 bg-gray-50 flex items-center space-x-2">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md resize-none focus:outline-none"
              rows="1"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="p-2 text-blue-500 cursor-pointer">
              📷
            </label>
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
         {selectedUser && (
      <div className="hidden lg:flex flex-col w-1/5 h-full border-l border-gray-300 bg-white p-4">
        <h3 className="text-lg font-semibold mb-2">Call Controls</h3>
        <VoiceCall currentUserId={currentUser.id} chatUserId={selectedUser.id} currentUserName={currentUser.name} chatUserName={selectedUser.name} />
      </div>
    )}
    </div>
  );
};

export default Chat;
