import { ChatCompletionMessageParam } from "openai/resources";

export const aiConfigMessages = (
  nbQuestions: number = 15,
  theme: string = "general culture",
  difficulty: string = "normal"
): Array<ChatCompletionMessageParam> => {
  return [
    {
      role: "system",
      content: `Please generate a ${nbQuestions}-question quiz on ${theme}, it must be ${difficulty} difficulty questions. Format in JSON with 'questions' and 'answers' arrays. Each 'questions' entry includes a 'question' and 'options' (4 choices, correct one excluded). 'answers' should list correct indices only.`,
    },
  ];
};
