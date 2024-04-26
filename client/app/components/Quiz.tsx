"use client";

import { title, subtitle, gradient } from "@/components/primitives";
import {
  Button,
  Card,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CustomRadio } from "@/components/CustomRadio";
import { QuizContent } from "@/types";

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

export type ResSelectType = {
  res: number[];
  select: string;
};

const palette: PaletteType = [
  { color: "primary", gradient: "blue" },
  { color: "secondary", gradient: "violet" },
  { color: "success", gradient: "green" },
  { color: "danger", gradient: "pink" },
  { color: "warning", gradient: "yellow" },
];

const msPerQuestion: number = 7000;
const progessRefreshTime: number = 50;

type QuizProps = {
  content: QuizContent;
  handleEnd: (answers: number[]) => void;
};

const Quiz: React.FC<QuizProps> = ({ content, handleEnd }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [clock, setClock] = useState(0);
  const [responses, setResponses] = useState<ResSelectType>({
    res: [],
    select: "0",
  });
  const currentColorIndex = currentQuestion % palette.length;

  useEffect(() => {
    const questionInterval = setInterval(() => {
      setCurrentQuestion((currentQuestion) => {
        if (currentQuestion >= content.questions.length - 1) {
          clearInterval(questionInterval);
          clearInterval(clockInterval);
          return currentQuestion;
        } else {
          setClock(0);
          return currentQuestion + 1;
        }
      });
      setResponses((current) => {
        const newResponses = [...current.res, +current.select];
        const newSelect = "0";
        return { res: newResponses, select: newSelect };
      });
    }, msPerQuestion);
    const clockInterval = setInterval(() => {
      setClock((clock) => clock + progessRefreshTime);
    }, progessRefreshTime);

    return () => {
      clearInterval(questionInterval);
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    if (responses.res.length === content.questions.length) handleEnd(responses.res);
  }, [responses]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <Card
      className={`w-full min-h-full p-8 space-y-12 justify-between`}
      shadow="sm"
    >
      <Progress
        size="lg"
        aria-label="Progress"
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
        {content.questions[currentQuestion].question}
      </h1>
      <RadioGroup
        aria-label="fwefew"
        color={palette[currentColorIndex].color}
        value={responses.select}
        onChange={(e) => setResponses({ ...responses, select: e.target.value })}
      >
        {content.questions[currentQuestion].options.map(
          (elem: any, idx: number) => {
            return (
              <CustomRadio key={idx} aria-label={idx} value={idx.toString()}>
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
          }
        )}
      </RadioGroup>
    </Card>
  );
};

export default Quiz;
