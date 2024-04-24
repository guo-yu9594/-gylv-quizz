"use client";

import { title, subtitle } from "@/components/primitives";
import Quiz, { ResSelectType } from "../components/Quiz";
import { useEffect, useState } from "react";
import SocketServices from "@/services/SocketServices";
import Loading from "../components/Loading";
import Show from "@/components/Show";
import { QuizContent } from "@/types";
import ResultModal from "../components/ResultModal";

const socket = new SocketServices();

export default function Single() {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizContent>();
  const [showResult, setShowResult] = useState(false);

  const handleEnd = (responses: ResSelectType) => {
    socket.end(responses);
    setIsLoading(true);
  };

  useEffect(() => {
    socket.on("start", (data: any) => {
      console.log(data);
      setIsLoading(false);
      setQuestions(data);
    });
    socket.on("end", (data: any) => {
      setShowResult(true);
      console.log("end result");
      console.log(data);
    });
    socket.single();
  }, []);

  return (
    <section className="flex flex-col items-center h-full w-full">
      <Show active={isLoading}>
        <Loading />
      </Show>
      <Show active={!isLoading}>
        <Quiz content={questions as QuizContent} handleEnd={handleEnd} />
      </Show>
      <ResultModal open={showResult} />
    </section>
  );
}
