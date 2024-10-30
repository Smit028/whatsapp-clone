import React, { useState, useEffect } from "react";
import Link from "next/link";

const UserList = ({ users, selectedUser, onUserSelect, unreadCounts }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Remove duplicates by email and filter out null values
    const uniqueUsers = users
      .filter((user) => user?.email) // Filter out null entries
      .filter((user, index, self) => 
        index === self.findIndex((u) => u.email === user.email)
      );

    // Filter users based on the search query
    const visibleUsers = uniqueUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(visibleUsers);
  }, [users, searchQuery]);

  return (
    <div className="w-full md:w-1/4 border-r border-gray-300 bg-gray-50 h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="font-semibold text-lg">Users</h2>
        <Link href={"/profile"}>
          <button className="text-blue-500 hover:underline">Edit Profile</button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User List with Scrollable Container */}
      <ul className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => onUserSelect(user)}
            className={`p-4 cursor-pointer ${
              selectedUser?.id === user.id ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {/* Status Indicator */}
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={user.status === "online" ? "Online" : "Offline"}
                />
                <span>{user.name}</span>
              </div>
              {unreadCounts[user.id] > 0 && (
                <span className="text-xs text-red-500">
                  {unreadCounts[user.id]} unread
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
