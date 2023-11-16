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
import { OpenAI } from "openai";
import { CTSEndData, STCStartData } from "./type/data";

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

  const openai = new OpenAI({
    apiKey: process.env.GTP_APIKEY,
    // organization: process.env.ORGANIZATION_ID,
  });

  let CTSEndData: CTSEndData = {};

  let STCStartData: STCStartData = {
    questions: undefined,
  };

  const createChatCompletion = async (data) => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      // max_tokens: 350,
      messages: [
        {
          role: "system",
          content: `Genere moi 2 question et reponses (4 par questions et une seule est bonne) sur le theme de la technologie d'une difficulte facile, je veux que ce soit en json composer de 2 tableau. 
        le premier tableau compose d'une liste d'objet avec key "questions", chaque objet est compose d'une question ( key "question") de 4 reponses (key "options" ) sans la bonne reponses. les bonne reponses devront etre le second tableau sous forne de liste d'index (key "answers").
        il me faut 2 questions et ne m'envoie que le json sans tes phrases inutile 
        exemple de ma structure :
        {
          questions: [
            {
              question: "",
              options: [...]
            },
            {
              question: "",
              options: [...]
            },
            ...
          ],
          answers: [...]
        }`,
        },
      ],
    });
    const formatResponseText = JSON.parse(response.choices[0].message.content);
    STCStartData = {
      // options: formatResponseText.questions[0].options,
      questions: formatResponseText.questions,
    };
    // CTSEndData = formatResponseText.answers;
    CTSEndData[data.roomId] = {
      ...response,
      response: formatResponseText.answers,
    };
    console.log("response", response);
  };

  socket.on("start", async (dataClient, callback) => {
    console.log(
      "dataClient.roomId: ",
      dataClient.roomId,
      "Now waiting for OpenAI response"
    );
    if (dataClient.roomId in rooms) {
      await createChatCompletion(dataClient);
      io.to(dataClient.roomId).emit("startServer", {
        // roomId: dataclient.roomId,
        // options: STCStartData,
        questions: STCStartData,
      });
    } else callback("error creating chat completion");
  });

  socket.on("end", (dataClient) => {
    console.log("dataClient", dataClient);
    if (dataClient.roomId in rooms) {
      io.to(dataClient.roomId).emit("giveResponseServer", {
        answer: CTSEndData[dataClient.roomId].response,
      });
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
