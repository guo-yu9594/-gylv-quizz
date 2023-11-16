export type JoinData = {
  username: string;
  roomId: string;
};

export type CreateData = {
  username: string;
};

export type NewPlayerData = {
  id: string;
  username: string;
};

export type requestQuiz = {
  subject: string;
  roomId: string;
};

export type requestResponseQuiz = {
  roomId: string;
  userId: string;
  response: number[];
};

export type CTSEndData = {
  [customKey: string]: { response: any };
  // [customKey: string]: answers;
  // [customKey: string]: answers;
};
export type answers = {
  // roomId: string;
  response: number[];
  // response: any;
};

export type STCStartData = {
  // options: string;
  questions: any;
  // questions: {question: string, options: string[]}[];
};
