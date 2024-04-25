import { ChatCompletionMessageParam } from "openai/resources";

export const aiConfigMessages = (
  nbQuestions: number,
  theme: string
): Array<ChatCompletionMessageParam> => {
  return [
    {
      role: "system",
      content: `Please generate a ${nbQuestions}-question quiz on ${theme}, easy difficulty. Format in JSON with 'questions' and 'answers' arrays. Each 'questions' entry includes a 'question' and 'options' (4 choices, correct one excluded). 'answers' should list correct indices only.`,
    },
  ];
};
