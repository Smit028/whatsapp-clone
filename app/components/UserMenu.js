// UserMenu.js
import React from "react";

const UserMenu = ({ user, onRename, onBlock, onUnblock, onClose, isBlocked }) => {
  return (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
      <button onClick={onRename} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
        Rename
      </button>
      {isBlocked ? (
        <button onClick={onUnblock} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
          Unblock
        </button>
      ) : (
        <button onClick={onBlock} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
          Block
        </button>
      )}
      <button onClick={onClose} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
        Close
      </button>
    </div>
  );
};

export default UserMenu;
