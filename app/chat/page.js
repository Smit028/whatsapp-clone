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
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import UserList from "../components/UserList";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../globals.css";

<<<<<<< HEAD
=======
const UserMenu = ({ user, onRename, onDelete, onBlock, onUnblock, onClose, isBlocked }) => {
  return (
    <div className="absolute bg-white border rounded-lg shadow-lg z-10 transition-all duration-300 transform scale-95 hover:scale-100">
      <div className="p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={onRename}>Rename</div>
      <div className="p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={onDelete}>Delete</div>
      {isBlocked ? (
        <div className="p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={onUnblock}>Unblock</div>
      ) : (
        <div className="p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={onBlock}>Block</div>
      )}
      <div className="p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={onClose}>Close</div>
    </div>
  );
};

>>>>>>> e7a99101fdb84c702c4edbd1170efb6b6751863e
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

        window.addEventListener("beforeunload", () => {
          updateDoc(doc(firestore, "users", user.uid), {
            status: "offline",
            lastSeen: serverTimestamp(),
          });
        });

        return () =>
          window.removeEventListener("beforeunload", handleBeforeUnload);
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
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
<<<<<<< HEAD
      const userChatId = [auth.currentUser.uid, selectedUser.id]
        .sort()
        .join("_");
=======
      const userChatId = [auth.currentUser.uid, selectedUser.id].sort().join("_");

>>>>>>> e7a99101fdb84c702c4edbd1170efb6b6751863e
      const unsubscribeUserChat = onSnapshot(
        collection(firestore, `chat/${userChatId}/messages`),
        (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
<<<<<<< HEAD
          setMessages(
            messagesData.sort(
              (a, b) =>
                (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)
            )
          );
=======

          // Sort messages by timestamp
          const sortedMessages = messagesData.sort((a, b) => {
            const timeA = a.timestamp?.seconds || 0; // Fallback to 0 if timestamp is undefined
            const timeB = b.timestamp?.seconds || 0;
            return timeA - timeB; // Ascending order
          });

          // Update seen status for the last message and all previous messages from the sender
          const updateLastMessageSeen = async () => {
            const lastMessage = sortedMessages[sortedMessages.length - 1];
            if (lastMessage && lastMessage.uid !== auth.currentUser.uid && !lastMessage.seen) {
              const messageDocRef = doc(firestore, `chat/${userChatId}/messages`, lastMessage.id);
              await updateDoc(messageDocRef, { seen: true });

              // Update all previous messages from the sender to seen
              const messagesToUpdate = sortedMessages.filter(msg => msg.uid === lastMessage.uid && !msg.seen);
              for (const msg of messagesToUpdate) {
                const msgDocRef = doc(firestore, `chat/${userChatId}/messages`, msg.id);
                await updateDoc(msgDocRef, { seen: true });
              }
            }
          };

          updateLastMessageSeen(); // Call to update seen status
          setMessages(sortedMessages);
>>>>>>> e7a99101fdb84c702c4edbd1170efb6b6751863e
        }
      );

      return () => unsubscribeUserChat();
    }
  }, [selectedUser]);

<<<<<<< HEAD
=======
  // Scroll to the bottom of the chat whenever messages change
>>>>>>> e7a99101fdb84c702c4edbd1170efb6b6751863e
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
<<<<<<< HEAD
      const userChatId = [auth.currentUser.uid, selectedUser.id]
        .sort()
        .join("_");
      try {
        await addDoc(collection(firestore, `chat/${userChatId}/messages`), {
          text: newMessage,
          uid: auth.currentUser.uid,
          timestamp: serverTimestamp(),
          delivered: true,
          seen: false,
        });
=======
      const userChatId = [auth.currentUser.uid, selectedUser.id].sort().join("_");
      const messagesCollection = collection(firestore, `chat/${userChatId}/messages`);

      try {
        await addDoc(messagesCollection, {
          text: newMessage,
          uid: auth.currentUser.uid,
          timestamp: serverTimestamp(),
          delivered: true, // Mark as delivered when sent
          seen: false, // Initially set to false
        });

>>>>>>> e7a99101fdb84c702c4edbd1170efb6b6751863e
        setNewMessage("");
        inputRef.current.focus();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

<<<<<<< HEAD
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
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
  };

=======
  // Handle Enter key press
>>>>>>> e7a99101fdb84c702c4edbd1170efb6b6751863e
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

  const getUniqueName = (name, usersList) => {
    const nameCount = {};
    
    // Count occurrences of each name
    usersList.forEach((user) => {
      if (user.name === name) {
        nameCount[name] = (nameCount[name] || 0) + 1;
      }
    });

    // If there's more than one occurrence, append a random number
    if (nameCount[name] > 1) {
      return `${name} (${Math.floor(Math.random() * 100)})`; // Generate a random number between 0 and 99
    }

    return name; // Return original name if unique
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col md:flex-row h-screen max-w-4xl mx-auto shadow-lg bg-gray-100">
      {(!selectedUser || window.innerWidth >= 768) && (
        <UserList
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          unreadCounts={unreadCounts}
          className="w-full md:w-1/3 border-r border-gray-300 bg-white"
        />
      )}
=======
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* User List Section */}
      <div className={`user-list w-full md:w-1/3 bg-white relative ${selectedUser ? 'hidden md:block' : ''}`}>
        <h2 className="text-lg font-semibold p-4 border-b">Online Users</h2>
        <div className="overflow-y-auto h-full fade-in">
          {users.map((user) => (
            <div
              key={user.id}
              className={`user-item p-4 cursor-pointer hover:bg-gray-200 transition relative ${selectedUser?.id === user.id ? "selected-user" : ""}`}
              onClick={() => handleUserClick(user)}
            >
              <div className="flex items-center">
                <Image
                  src={user.photoURL || Img1}
                  alt={`${user.name}'s profile`}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="mr-2">{getUniqueName(user.name, users)}</span> {/* Use the unique name function */}
                {unreadCounts[user.id] > 0 && (
                  <span className="bg-blue-500 text-white rounded-full px-2 text-xs">{unreadCounts[user.id]}</span>
                )}
              </div>
              <div className="absolute right-2 top-2">
                <button className="text-gray-400 hover:text-gray-600" onClick={() => handleMenuClick(user)}>...</button>
                {menuVisible && menuUser.id === user.id && (
                  <UserMenu
                    user={user}
                    onRename={handleRename}
                    onDelete={handleDelete}
                    onBlock={handleBlock}
                    onUnblock={handleUnblock}
                    onClose={() => setMenuVisible(false)}
                    isBlocked={isBlocked(user.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
>>>>>>> e7a99101fdb84c702c4edbd1170efb6b6751863e

      {selectedUser && (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-300 bg-gray-50 flex items-center">
            {window.innerWidth < 768 && (
              <button
                onClick={() => setSelectedUser(null)}
                className="text-blue-500 mr-2"
              >
                ← Back
              </button>
            )}
            <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
          </div>
<<<<<<< HEAD

          {/* Chat Messages with fixed height for scrollable chat area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 max-h-[calc(100vh-200px)]">
            <div className="flex flex-col space-y-4 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg shadow-sm max-w-xs ${
                    msg.uid === auth.currentUser.uid
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    {msg.imageUrl ? (
                      <img
                        src={msg.imageUrl}
                        alt="Sent"
                        className="rounded-md max-w-full"
                      />
                    ) : (
                      <span>{msg.text}</span>
                    )}
                    {msg.uid === auth.currentUser.uid && (
                      <span
                        className={`text-xs ml-2 ${
                          msg.seen ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {msg.seen ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
=======
        )}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.uid === auth.currentUser.uid ? "sent-message" : "received-message"}`}>
                <div className="flex justify-between items-center">
                  <span>{msg.text}</span>
                  {msg.uid === auth.currentUser.uid && (
                    <span className={`status ${msg.seen ? 'seen' : 'delivered'}`}>
                      {msg.seen ? '✓✓' : '✓'} {/* ✓✓ for seen, ✓ for delivered */}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
>>>>>>> e7a99101fdb84c702c4edbd1170efb6b6751863e

          {/* Message Input */}
          <div className="p-2 border-t border-gray-300 bg-gray-50 flex items-center space-x-2">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 p-2 resize-none bg-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
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
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
