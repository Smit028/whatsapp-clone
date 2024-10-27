// components/UserList.js
"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase'; // Import firestore

const UserList = ({ currentUserId, onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const userDocs = await getDocs(usersCollection);
      const usersData = userDocs.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUserId); // Exclude current user

      setUsers(usersData);
    };

    fetchUsers();
  }, [currentUserId]);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => onSelectUser(user.id)}>
            {user.username} {/* Display the username or any other user info */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
