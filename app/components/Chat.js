// pages/chat.js
"use client";
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import sendMessage from '../utils/sendMessage';

const ChatPage = () => {
  const auth = getAuth();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('userIdOfOtherUser'); // Replace with actual selected user ID
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid); // Set current user ID
      } else {
        window.location.href = '/login'; // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [auth]);

  // Fetch messages from Firestore when user is authenticated
  useEffect(() => {
    if (currentUserId && selectedUserId) {
      const chatId = `${currentUserId}_${selectedUserId}`;
      const messagesRef = collection(firestore, `chat/${chatId}/messages`);

      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });

      return () => unsubscribe(); // Clean up the listener on unmount
    }
  }, [currentUserId, selectedUserId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(currentUserId, selectedUserId, newMessage);
      setNewMessage(''); // Clear the input field after sending
    }
  };

  return (
    <div>
      <h1>Chat with {selectedUserId}</h1>
      <div>
        {messages.map((message) => (
          <div key={message.id} style={{ textAlign: message.uid === currentUserId ? 'right' : 'left' }}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
