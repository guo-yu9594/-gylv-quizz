"use client";

import Show from "@/components/Show";
import { title } from "@/components/primitives";
import { Button, Card, Input } from "@nextui-org/react";
import { useState } from "react";
import { HiArrowSmRight } from "react-icons/hi";

enum Step {
  NAME,
  INIT,
  ROOM,
  GAME,
}

export default function Room() {
  const [name, setName] = useState("");
  const [host, setHost] = useState(false);
  const [step, setStep] = useState(Step.NAME);
  const [roomId, setRoomId] = useState("");
  const handleJoin = () => {};
  const handleCreate = () => {};

  return (
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
    </Card>
  );
}
