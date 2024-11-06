import React from "react";
import { requestPermission } from "../lib/fcmClient";

const NotificationButton = () => {
  const handleClick = async () => {
    await requestPermission();
  };

  return <button onClick={handleClick}>Enable Notifications</button>;
};

export default NotificationButton;
