"use client";
import { useEffect, useState } from "react";
import { firestore, auth } from "../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../globals.css"

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ name: "", photoURL: "", bio: "", phone: "" });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to control editing mode
  const storage = getStorage();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDoc = await getDoc(doc(firestore, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserDetails(userDoc.data());
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, bio, phone } = userDetails;

    try {
      if (imageFile) {
        const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
          photoURL: imageUrl,
          name,
          bio,
          phone,
        });
      } else {
        await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
          name,
          bio,
          phone,
        });
      }
      alert("Profile updated successfully!");
      setIsEditing(false); // Exit editing mode after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)} // Toggle editing mode
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? ( // Show form if in editing mode
        <form onSubmit={handleSubmit}>
          {/* Row 1: Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Row 2: Profile Picture */}
          <div className="mb-4">
            <label className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded"
            />
          </div>

          {/* Row 3: Additional Details (Bio and Phone) */}
          <div className="mb-4">
            <label className="block text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={userDetails.bio}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={userDetails.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Your phone number..."
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save
          </button>
        </form>
      ) : ( // Show profile details if not in editing mode
        <div>
          <div className="mb-4">
            <strong>Name:</strong> {userDetails.name}
          </div>
          <div className="mb-4">
            <strong>Bio:</strong> {userDetails.bio}
          </div>
          <div className="mb-4">
            <strong>Phone Number:</strong> {userDetails.phone}
          </div>
          {userDetails.photoURL && (
            <div className="mt-4">
              <img src={userDetails.photoURL} alt="Profile" className="w-24 h-24 rounded-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
