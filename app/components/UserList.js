// UserList.js
import React from "react";

const UserList = ({ users, selectedUser, onUserSelect, unreadCounts }) => {
  return (
    <div className="w-full md:w-1/4 border-r border-gray-300 bg-gray-50">
      <h2 className="p-4 font-semibold text-lg">Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => onUserSelect(user)}
            className={`p-4 cursor-pointer ${
              selectedUser?.id === user.id ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{user.name}</span>
              {unreadCounts[user.id] > 0 && (
                <span className="text-xs text-red-500">{unreadCounts[user.id]} unread</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
