import express from "express";
import { Server } from "socket.io";
import http from "http";
const router: any = express.Router();
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
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

const sessionsMap: {} = {};

io.on("connection", (socket) => {
  // console.log(socket.handshake.query);

  let useruuid: any = socket.handshake.query.user;
  socket.data.name = useruuid;
  // socket.broadcast.emit('updatedid', socket.id);

  let roomid: any = socket.handshake.query.room;

  // socket.join("some room");
  socket.once("hello", (...args) => {
    console.log(args);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
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
