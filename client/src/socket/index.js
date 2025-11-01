// server/socket/index.js
import { Server } from "socket.io";

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // When user joins a chatroom
    socket.on("join_room", (room, username) => {
      socket.join(room);
      socket.data.username = username;
      io.to(room).emit("user_joined", { username });
    });

    // Listen when user is typing
    socket.on("typing", (room, username) => {
      socket.to(room).emit("user_typing", { username });
    });

    // Listen when user stops typing
    socket.on("stop_typing", (room, username) => {
      socket.to(room).emit("user_stop_typing", { username });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
