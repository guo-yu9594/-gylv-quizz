"use client";

import { title, subtitle, gradient } from "@/components/primitives";
import { Card, Progress, Radio, RadioGroup, cn } from "@nextui-org/react";
import { defaultQuizData } from "@/config/data";
import { useEffect, useState } from "react";
import { CustomRadio } from "@/components/CustomRadio";

type PaletteType = {
  color: "default" | "primary" | "secondary" | "success" | "danger" | "warning";
  gradient:
    | "blue"
    | "violet"
    | "green"
    | "pink"
    | "yellow"
    | "cyan"
    | "foreground";
}[];

const palette: PaletteType = [
  { color: "primary", gradient: "blue" },
  { color: "secondary", gradient: "violet" },
  { color: "success", gradient: "green" },
  { color: "danger", gradient: "pink" },
  { color: "warning", gradient: "yellow" },
];

const msPerQuestion: number = 15000;
const progessRefreshTime: number = 50;

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [clock, setClock] = useState(0);
  const currentColorIndex = currentQuestion % palette.length;

  useEffect(() => {
    const questionInterval = setInterval(() => {
      setCurrentQuestion((currentQuestion) => {
        if (currentQuestion >= defaultQuizData.questions.length - 2)
          clearInterval(questionInterval);
        return currentQuestion + 1;
      });
      setClock(0);
    }, msPerQuestion);
    const clockInterval = setInterval(() => {
      setClock((clock) => clock + progessRefreshTime);
    }, progessRefreshTime);

    return () => {
      clearInterval(questionInterval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <Card
      className={`w-full min-h-full p-8 space-y-12 justify-between`}
      shadow="sm"
    >
      <Progress
        size="lg"
        value={(clock / (msPerQuestion - 600)) * 100}
        color={palette[currentColorIndex].color}
        className="w-full"
        classNames={{
          indicator: `bg-gradient-to-r ${
            gradient[palette[currentColorIndex].gradient]
          }`,
        }}
      />
      <h1 className={title({ size: "bmd" })}>
        {defaultQuizData.questions[currentQuestion].question}
      </h1>
      <RadioGroup
        aria-label="fwefew"
        color={palette[currentColorIndex].color}
      >
        {defaultQuizData.questions[currentQuestion].options.map((elem, idx) => {
          return (
            <CustomRadio key={idx} aria-label={idx} value={elem}>
              <h1
                className={title({
                  color: palette[currentColorIndex].gradient,
                  size: "sm",
                })}
              >
                {elem}
              </h1>
            </CustomRadio>
          );
        })}
      </RadioGroup>
    </Card>
  );
}
