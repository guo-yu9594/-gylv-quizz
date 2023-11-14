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

export type CTSEndData = {
  responses: number[];
};

export type STCStartData = {
  // options: string;
  questions: any;
  // questions: {question: string, options: string[]}[];
};
