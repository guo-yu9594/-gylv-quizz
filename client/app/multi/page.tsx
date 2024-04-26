"use client";

import Show from "@/components/Show";
import { title } from "@/components/primitives";
import SocketServices from "@/services/SocketServices";
import { NewPlayerData, QuizContent, STCEndData, STCStartData } from "@/types";
import { Button, Card, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import Loading from "../components/Loading";
import ResultModal from "../components/ResultModal";
import Quiz from "../components/Quiz";
import QuizSettings, { Settings } from "../components/QuizSettings";

enum Step {
  NAME,
  INIT,
  ROOM,
  SETTINGS,
  GAME,
}

const socket = new SocketServices();
export default function Multi() {
  const [name, setName] = useState("");
  const [step, setStep] = useState(Step.NAME);
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizContent>();
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<STCEndData>();
  const [joinError, setJoinError] = useState(false);
  const [players, setPlayers] = useState<NewPlayerData[]>([]);
  const [host, setHost] = useState(false);
  const handleEnd = (answers: number[]) => {
    socket.end(answers);
    setIsLoading(true);
  };
  const handleStart = (settings: Settings) => {
    socket.start(settings);
    setIsLoading(true);
  };
  const handleJoin = () => {
    setIsLoading(true);
    socket.username = name;
    socket.join(roomId, (value) => {
      if (value) {
        setStep(Step.ROOM);
        setIsLoading(false);
        setPlayers(value);
      } else {
        setIsLoading(false);
        setJoinError(true);
      }
    });
  };
  const handleCreate = () => {
    setHost(true);
    setIsLoading(true);
    socket.username = name;
    socket.create((value) => {
      console.log("DOIAZDIZPFNPI");
      if (value) {
        setStep(Step.ROOM);
        setPlayers([
          {
            id: socket.socket.id || "",
            username: name,
          },
        ]);
        setRoomId(socket.roomId);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        alert("Failed to create rooom.");
      }
    });
  };

  useEffect(() => {
    socket.on("start", (data: STCStartData) => {
      setIsLoading(false);
      setStep(Step.GAME);
      setQuestions(data);
    });
    socket.on("end", (data: STCEndData) => {
      setShowResult(true);
      setResults(data);
    });
    socket.on("newPlayer", (data: NewPlayerData) => {
      setPlayers((players) => {
        if (players.findIndex((p) => p.id === data.id) == -1)
          return [...players, data];
        return players;
      });
    });
  }, []);

  return (
    <section className="flex flex-col items-center h-full w-full">
      <Show active={!isLoading && step !== Step.GAME && step != Step.SETTINGS}>
        <Card
          className={`w-full min-h-full p-8 space-y-12 justify-center items-center`}
          shadow="sm"
        >
          <Show active={step === Step.NAME}>
            <h1 className={title({ size: "md" })}>Choose your username</h1>
            <div className="flex">
              <Input
                type="text"
                label="Name"
                size="lg"
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                size="lg"
                color="primary"
                isIconOnly
                onClick={() => setStep(Step.INIT)}
                className="h-100 ml-3"
              >
                <HiArrowSmRight size="25px" />
              </Button>
            </div>
          </Show>
          <Show active={step === Step.INIT}>
            <div className="flex flex-col justify-center items-center">
              <h1 className={title({ size: "md" })}>Join a room</h1>
              <div className="flex my-8">
                <Input
                  type="text"
                  label="Room ID"
                  isInvalid={joinError}
                  errorMessage={joinError ? "Room ID is invalid" : null}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <Button
                  size="lg"
                  color="primary"
                  isIconOnly
                  onClick={handleJoin}
                  className="h-100 ml-3"
                >
                  <HiArrowSmRight size="25px" />
                </Button>
              </div>
              <p>or</p>
              <Button
                className="mt-8"
                size="lg"
                color="secondary"
                onClick={handleCreate}
              >
                Create your own room
              </Button>
            </div>
          </Show>
          <Show active={step === Step.ROOM}>
            <div className="flex flex-col justify-center items-center">
              <h1 className={title({ size: "md" })}>Room ID : {roomId}</h1>
              <div className="my-8 flex flex-col justify-center items-center">
                {players.map((player) => (
                  <p key={player.id} className="mb-1">
                    {player.username}
                  </p>
                ))}
                <Button
                  className="mt-8"
                  size="lg"
                  color="primary"
                  onClick={() => setStep(Step.SETTINGS)}
                  disabled={!host}
                  isDisabled={!host}
                >
                  Start the quiz !
                </Button>
              </div>
            </div>
          </Show>
        </Card>
      </Show>
      <Show active={!isLoading && step === Step.SETTINGS}>
        <QuizSettings next={(settings) => handleStart(settings)} />
      </Show>
      <Show active={!isLoading && step === Step.GAME}>
        <Quiz content={questions as QuizContent} handleEnd={handleEnd} />
      </Show>
      <Show active={isLoading}>
        <Loading label="Loading..." />
      </Show>
      <ResultModal open={showResult} data={results} />
    </section>
  );
}
