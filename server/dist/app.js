"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const openai_1 = require("openai");
const ai_1 = require("./config/ai");
dotenv_1.default.config();
const port = process.env.PORT;
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
});
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // organization: process.env.ORGANIZATION_ID,
});
const createChatCompletion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        // max_tokens: 350,
        messages: ai_1.aiConfigMessages,
    });
    const formatResponseText = JSON.parse(response.choices[0].message.content);
    return formatResponseText;
});
let users = {};
let rooms = {};
let answers = {};
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
        console.log(`Room ${roomId} successfully created and joined by player "${data.username}" with ID ${socket.id}.`);
    });
    socket.on("join", (data, callback) => {
        if (data.roomId in rooms) {
            users[socket.id] = {
                username: data.username,
                roomId: data.roomId,
                inTest: false,
            };
            rooms[data.roomId] = Object.assign(Object.assign({}, rooms[data.roomId]), { [socket.id]: users[socket.id] });
            socket.join(data.roomId);
            io.to(data.roomId).emit("newPlayer", {
                username: data.username,
                id: socket.id,
            });
            callback(rooms);
            console.log(`Room ${data.roomId} successfully joined by player "${data.username}" with ID ${socket.id}.`);
        }
        else
            callback("error");
    });
    socket.on("start", (dataClient, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const clientRoomId = dataClient.roomId;
        console.log(`Room ${dataClient.roomId} waiting for OpenAI response.`);
        if (clientRoomId in rooms) {
            Object.keys(rooms[clientRoomId]).forEach((userId) => {
                rooms[clientRoomId][userId].inTest = true;
            });
            createChatCompletion(dataClient).then((res) => {
                io.to(clientRoomId).emit("start", {
                    questions: res.questions,
                });
                answers[clientRoomId] = res.answers;
                console.log(`Quiz content successfully generated and sent for room ${dataClient.roomId}.`);
            }, (err) => {
                console.error(`Failed to generate quiz content for room ${dataClient.roomId}.`);
                console.error(err);
            });
        }
        else
            callback("start error");
    }));
    socket.on("end", (dataClient) => {
        const clientRoomId = users[socket.id].roomId;
        const clientUserId = socket.id;
        if (clientRoomId in rooms) {
            if (clientUserId in rooms[clientRoomId]) {
                rooms[clientRoomId][clientUserId].inTest = false;
                if (Object.keys(rooms[clientRoomId]).find((userId) => rooms[clientRoomId][userId].inTest == true)) {
                    console.log(`Player ${clientUserId} responses submitted to room ${clientRoomId}, waiting for other players submitting...`);
                }
                else {
                    io.to(clientRoomId).emit("end", {
                        answers: answers[clientRoomId],
                    });
                    delete answers[clientRoomId];
                    console.log(`Player ${clientUserId} responses submitted to room ${clientRoomId}, all room players submitted. Results sent.`);
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
