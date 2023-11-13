import express from "express";
import { Server } from "socket.io";
import http from "http";
const router: any = express.Router();

type JoinData = {
  username: string;
  roomId: string;
};
type CreateData = {
  username: string;
};

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  join: (data: JoinData, callback: any) => void;
  create: (data: CreateData, callback: any) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const app = express();
const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server is listening on http://localhost:4000");
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("create", (data, callback) => {
    callback(socket.id.slice(0, 6));
    console.log(data);
    socket.join(socket.id.slice(0, 6));
  });
  socket.on("join", (data, callback) => {
    console.log(data);

    socket.join(data.roomId);
    callback("room " + data.roomId + " joined");
  });

  // let useruuid: any = socket.handshake.query.user;
  // socket.data.name = useruuid;
  // let roomid: any = socket.handshake.query.room;

  socket.on("disconnect", (reason) => {
    console.log("User disconnected" + socket.id);
    console.log(reason);
  });
});

router.post("/create/:username", (req, res) => {
  const username: string = req.params.username;
  if (!username) {
    console.log(username);
    return res.status(404).send("Please enter a username");
  }
  res.json({ result: true, username: username });
});

// router.post("/join", (req, res) => {});
export default router;
