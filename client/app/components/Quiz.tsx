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

type ResSelectType = {
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

const msPerQuestion: number = 500;
const progessRefreshTime: number = 50;

export default function Quiz() {
  const [showResult, setShowResult] = useState(false);
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
        if (currentQuestion >= defaultQuizData.questions.length - 1) {
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
    if (responses.res.length === defaultQuizData.questions.length)
      setShowResult(true);
  }, [responses]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
        value={responses.select}
        onChange={(e) => setResponses({ ...responses, select: e.target.value })}
      >
        {defaultQuizData.questions[currentQuestion].options.map((elem, idx) => {
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
        })}
      </RadioGroup>
      <Modal
        isOpen={showResult}
        backdrop="blur"
        isDismissable={false}
        hideCloseButton={true}
        size="2xl"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col items-center pt-7">
                <h1 className={title({ size: "md", color: "violet" })}>
                  Quiz result
                </h1>
              </ModalHeader>
              <ModalBody className="my-5">
                <Table
                  removeWrapper
                  aria-label="Example static collection table"
                >
                  <TableHeader>
                    <TableColumn>RANK</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>SCORE</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell>1</TableCell>
                      <TableCell>Tony Reichert</TableCell>
                      <TableCell>11/15</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter className="flex flex-col items-center">
                <Link href="/single">
                  <Button color="primary">Replay</Button>
                </Link>
                <Link href="/">
                  <Button color="primary" variant="light">
                    Back to the menu
                  </Button>
                </Link>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
