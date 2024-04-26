"use client";

import { title, subtitle } from "@/components/primitives";
import Quiz, { ResSelectType } from "../components/Quiz";
import { useEffect, useState } from "react";
import SocketServices from "@/services/SocketServices";
import Loading from "../components/Loading";
import Show from "@/components/Show";
import { QuizContent, STCEndData, STCStartData } from "@/types";
import ResultModal from "../components/ResultModal";
import QuizSettings, { Settings } from "../components/QuizSettings";

const socket = new SocketServices();

export default function Single() {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizContent>();
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<STCEndData>();
  const [settings, setSettings] = useState<Settings | undefined>(undefined);

  const handleEnd = (answers: number[]) => {
    socket.end(answers);
  };

  const handleStart = (settings: Settings) => {
    console.log(settings);
    setSettings(settings); 
    setIsLoading(true)
    socket.single(settings);
  }

  useEffect(() => {
    socket.on("start", (data: STCStartData) => {
      setIsLoading(false);
      setQuestions(data);
    });
    socket.on("end", (data: STCEndData) => {
      setShowResult(true);
      setResults(data);
    });
    // socket.single();
  }, []);

  return (
    <section className="flex flex-col items-center h-full w-full">
      <Show active={settings == undefined}>
        <QuizSettings next={handleStart} />
      </Show>
      <Show active={isLoading == true}>
        <Loading label="Generating the questions..." />
      </Show>
      <Show active={settings != undefined && isLoading == false}>
        <Quiz content={questions as QuizContent} handleEnd={handleEnd} />
      </Show>
      <ResultModal open={showResult} data={results} />
    </section>
  );
}
