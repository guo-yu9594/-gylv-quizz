import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./type/server";
import { Rooms, Users } from "./type/session";

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

let users: Users = {};
let rooms: Rooms = {};

io.on("connection", (socket) => {
  socket.on("create", (data, callback) => {
    const roomId = socket.id.slice(0, 6);
    users[socket.id] = {
      username: data.username,
      roomId,
    };
    rooms[roomId] = { [socket.id]: users[socket.id] };
    socket.join(roomId);
    callback(roomId);
  });

  socket.on("join", (data, callback) => {
    if (data.roomId in rooms) {
      users[socket.id] = {
        username: data.username,
        roomId: data.roomId,
      };
      rooms[data.roomId] = {
        ...rooms[data.roomId],
        [socket.id]: users[socket.id],
      };
      socket.join(data.roomId);
      io.to(data.roomId).emit("newPlayer", {
        username: data.username,
        id: socket.id,
      });
      callback(rooms);
    } else callback("error");
  });

  socket.on("start", () => {
  });

  socket.on("end", (data) => {
  });

  socket.on("disconnect", (reason) => {
    delete rooms[users[socket.id].roomId][socket.id];
    delete users[socket.id];
    console.log(`User ${socket.id} disconnected`);
    console.log(reason);
  });
});

httpServer.listen(port, () => {
  console.log(`Server Socket.io is running at http://localhost:${port}`);
});
