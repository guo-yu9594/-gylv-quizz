import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type QuizContent = { questions: { options: string[]; question: string }[] };

export type STCEndData = {
  answers: number[];
  results?: {
    rank: number;
    grade: number;
    ranking: {
      rank: number;
      username: string;
      grade: number;
    }[];
  };
};
