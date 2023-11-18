import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./type/server";
import { Answers, Rooms, Users } from "./type/session";
import { OpenAI } from "openai";
import { aiConfigMessages } from "./config/ai";

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

const openai = new OpenAI({
  apiKey: process.env.GTP_APIKEY,
  // organization: process.env.ORGANIZATION_ID,
});

const createChatCompletion = async (data): Promise<any> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    // max_tokens: 350,
    messages: aiConfigMessages,
  });
  const formatResponseText = JSON.parse(response.choices[0].message.content);
  return formatResponseText;
};

let users: Users = {};
let rooms: Rooms = {};
let answers: Answers = {};

io.on("connection", (socket) => {
  socket.on("create", (data, callback) => {
    const roomId = socket.id.slice(0, 6);
    users[socket.id] = {
      username: data.username,
      roomId,
      inTest: false,
    };
    rooms[roomId] = { [socket.id]: users[socket.id] };
    socket.join(roomId);
    callback(roomId);
    console.log(
      `Room ${roomId} successfully created and joinded by player "${data.username}" ID ${socket.id}`
    );
  });

  socket.on("join", (data, callback) => {
    if (data.roomId in rooms) {
      users[socket.id] = {
        username: data.username,
        roomId: data.roomId,
        inTest: false,
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
      console.log(
        `Room ${data.roomId} successfully joined by player "${data.username}" ID ${socket.id}`
      );
    } else callback("error");
  });

  socket.on("start", async (dataClient, callback) => {
    const clientRoomId = dataClient.roomId;
    console.log(`Room ${dataClient.roomId} waiting for OpenAI response.`);
    if (clientRoomId in rooms) {
      Object.keys(rooms[clientRoomId]).forEach((userId) => {
        rooms[clientRoomId][userId].inTest = true;
      });
      createChatCompletion(dataClient).then(
        (res) => {
          io.to(clientRoomId).emit("start", {
            questions: res.questions,
          });
          answers[clientRoomId] = res.answers;
          console.log(
            `Quiz content successfully generated and sent for room ${dataClient.roomId}.`
          );
        },
        (err) => {
          console.error(
            `Failed to generate quiz content for room ${dataClient.roomId}.`
          );
        }
      );
    } else callback("error creating chat completion");
  });

  socket.on("end", (dataClient) => {
    const clientRoomId = dataClient.roomId;
    const clientUserId = dataClient.userId;

    if (clientRoomId in rooms) {
      if (clientUserId in rooms[clientRoomId]) {
        rooms[clientRoomId][clientUserId].inTest = false;

        if (
          Object.keys(rooms[clientRoomId]).find(
            (userId) => rooms[clientRoomId][userId].inTest == true
          )
        ) {
          console.log(
            `Player ${clientUserId} responses submitted to room ${clientRoomId}, waiting for other players submitting...`
          );
        } else {
          io.to(clientRoomId).emit("end", {
            answers: answers[clientRoomId],
          });
          delete answers[clientRoomId];
          console.log(
            `Player ${clientUserId} responses submitted to room ${clientRoomId}, all room players submitted. Results sent.`
          );
        }
      }
    }
  });

  socket.on("disconnect", (reason) => {
    if (users[socket.id] && rooms[users[socket.id].roomId] !== undefined) {
      delete rooms[users[socket.id].roomId][socket.id];
    }
    delete users[socket.id];
    console.log(`User ${socket.id} disconnected`);
    console.log(reason);
  });
});
httpServer.listen(port, () => {
  console.log(`Server Socket.io is running at http://localhost:${port}`);
});
