import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("signal", (data) => {
      socket.to(data.to).emit("signal", {
        signal: data.signal,
        from: socket.id,
      });
    });

    socket.on("call_invitation", (data) => {
      socket.to(data.to).emit("call_invitation", {
        from: socket.id,
      });
    });

    socket.on("call_response", (data) => {
      socket.to(data.to).emit("call_response", {
        from: socket.id,
        accepted: data.accepted,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  console.log("Setting up socket");
  res.end();
}
