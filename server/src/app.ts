import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./type/server";
import { Answers, QuizData, Result, Rooms, Users } from "./type/session";
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
    origin: "https://gylv-quiz-client.onrender.com",
    methods: ["GET", "POST"],
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // organization: process.env.ORGANIZATION_ID,
});

let users: Users = {};
let rooms: Rooms = {};
let answers: Answers = {};
let quizQueue: { [difficulty: string]: QuizData[] } = {
  easy: [],
  normal: [],
  hard: [],
};

const checkQuiz = (quiz: any) => {
  if (
    "questions" in quiz &&
    "answers" in quiz &&
    typeof quiz.answers[0] == "number" &&
    "question" in quiz.questions[0] &&
    "options" in quiz.questions[0] &&
    typeof quiz.questions[0].question == "string" &&
    typeof quiz.questions[0].options[0] == "string"
  )
    return true;
  else return false;
};

const createChatCompletion = async (
  difficulty: string = "normal"
): Promise<any> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    // max_tokens: 350,
    messages: aiConfigMessages(15, "general culture", difficulty),
  });
  const formatResponseText = JSON.parse(response.choices[0].message.content);
  return formatResponseText;
};

const queueQuiz = () => {
  for (const difficulty in quizQueue) {
    if (quizQueue[difficulty].length < 3) {
      createChatCompletion(difficulty).then(
        (res) => {
          if (checkQuiz(res)) {
            quizQueue[difficulty].push(res);
            console.log(
              `Quiz content (${difficulty}) successfully generated and queued, position in the queue: ${
                quizQueue[difficulty].length - 1
              }`
            );
            if (quizQueue[difficulty].length < 3) queueQuiz();
          }
        },
        (err) => {
          console.log(`Failed to generate quiz content for queing`);
        }
      );
    }
  }
};

const getQuiz = async (roomId: string, difficulty: string): Promise<any> => {
  if (quizQueue[difficulty].length > 0) {
    const quiz = quizQueue[difficulty].shift();
    queueQuiz();
    return quiz;
  } else {
    const quiz = await createChatCompletion(difficulty);
    if (checkQuiz(quiz)) return getQuiz(roomId, difficulty);
    return quiz;
  }
};

const getScores = (expectedAnswers: number[], roomUsers: Users): Result[] => {
  let scores: Result[] = [];

  for (const id in roomUsers) {
    let score = 0;
    for (let i = 0; i < roomUsers[id].answers.length; i++)
      if (roomUsers[id].answers[i] === expectedAnswers[i]) score++;
    scores.push({
      username: roomUsers[id].username,
      id,
      score,
      rank: 1,
    });
  }
  return scores.sort((a, b) => b.score - a.score);
};

const compileResults = (roomId: string): Result[] => {
  const roomUsers = rooms[roomId]; // yes it get the users of the room
  const expectedAnswers = answers[roomId];
  let scores = getScores(expectedAnswers, roomUsers);
  let rank = 1;

  for (let i = 1; i < scores.length; i++) {
    if (scores[i].score < scores[i - 1].score) rank++;
    scores[i].rank = rank;
  }
  return scores;
};

const getUsersList = (roomId: string) => {
  let list = [];

  for (const id in rooms[roomId]) {
    list.push({
      id: id,
      username: rooms[roomId][id].username,
    });
  }
  return list;
};

io.on("connection", (socket) => {
  console.log(`Player with ID ${socket.id} has been connected.`);

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
      `Room ${roomId} successfully created and joined by player "${data.username}" with ID ${socket.id}.`
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
      callback(getUsersList(data.roomId));
      console.log(
        `Room ${data.roomId} successfully joined by player "${data.username}" with ID ${socket.id}.`
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
      try {
        const quiz = await getQuiz(
          dataClient.roomId,
          dataClient.settings.difficulty
        );
        io.to(clientRoomId).emit("start", {
          questions: quiz.questions,
        });
        answers[clientRoomId] = quiz.answers;
        console.log(
          `Quiz content successfully gotted and sent for room ${dataClient.roomId}.`
        );
      } catch (err) {
        console.error(
          `Failed to get quiz content for room ${dataClient.roomId}.`
        );
        console.error(err);
      }
    } else callback("start error");
  });

  socket.on("end", (dataClient) => {
    const clientRoomId = users[socket.id].roomId;
    const clientUserId = socket.id;

    if (clientRoomId in rooms) {
      if (clientUserId in rooms[clientRoomId]) {
        rooms[clientRoomId][clientUserId].inTest = false;
        rooms[clientRoomId][clientUserId].answers = dataClient.answers;
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
            results: compileResults(clientRoomId),
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
    console.log(`Player ${socket.id} disconnected. Reason: ${reason}.`);
  });
});
httpServer.listen(port, () => {
  console.log(`Server Socket.io is running at http://localhost:${port}`);
});

queueQuiz();
