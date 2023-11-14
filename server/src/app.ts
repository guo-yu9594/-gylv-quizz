import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./type/server";

dotenv.config();

const port = process.env.PORT;
const httpServer = createServer();
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("create", (data, callback) => {
    console.log(data);
    callback(socket.id.slice(0, 6));
    socket.join(socket.id.slice(0, 6));
  });

  socket.on("join", (data, callback) => {
    console.log(data);
    socket.join(data.roomId);
    callback("room " + data.roomId + " joined");
  });

  socket.on("disconnect", (reason) => {
    console.log("User disconnected" + socket.id);
    console.log(reason);
  });
});

httpServer.listen(port, () => {
  console.log(`Server Socket.io is running at http://localhost:${port}`);
});
