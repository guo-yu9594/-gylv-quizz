import { createServer } from "http";
import { Server } from "socket.io";

type JoinData = {
  username: string;
  roomId: string;
};
type CreateData = {
  username: string;
};

type ServerToClientEvents = {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

type ClientToServerEvents = {
  hello: () => void;
  join: (data: JoinData, callback: any) => void;
  create: (data: CreateData, callback: any) => void;
}

type InterServerEvents = {
  ping: () => void;
}

type SocketData = {
  name: string;
  age: number;
}

const port = process.env.SOCKET_PORT;
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
