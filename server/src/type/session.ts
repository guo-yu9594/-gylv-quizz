export type User = {
  username: string;
  roomId: string;
  inTest: boolean;
  answers?: number[];
};

export type Users = {
  [id: string]: User;
};

export type Rooms = { [roomId: string]: Users };

export type Answers = { [roomId: string]: number[] };

export type Result = {
  rank: number;
  id: string;
  username: string;
  score: number;
};

export type QuizData = {
  questions: {
    question: string,
    options: string[]
  }[],
  answers: number[]
}