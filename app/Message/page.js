"use client"
import React, { useEffect } from "react";
import NotificationButton from "./NotificationButton";
import { onMessageListener } from "../lib/fcmClient";

const Home = () => {
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log("Message received. ", payload);
        // Handle foreground message
      })
      .catch((err) => console.log("Failed to receive message: ", err));
  }, []);

  return (
    <div>
      <h1>Firebase Cloud Messaging with Next.js</h1>
      <NotificationButton />
    </div>
  );
};

export default Home;
