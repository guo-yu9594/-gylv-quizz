import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type QuizContent = {
  questions: { options: string[]; question: string }[];
};

export type Result = {
  rank: number;
  id: string;
  username: string;
  score: number;
};

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

export type CTSStartData = {
  subject: string;
  roomId: string;
};

export type CTSEndData = {
  answers: number[];
};

export type STCEndData = {
  answers: number[];
  results?: Result[];
};

export type STCStartData = {
  questions: any;
};
