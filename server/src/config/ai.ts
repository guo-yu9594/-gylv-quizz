import { ChatCompletionMessageParam } from "openai/resources";

export const aiConfigMessages: Array<ChatCompletionMessageParam> = [
  {
    role: "system",
    content: `Genere moi 2 question et reponses (4 par questions et une seule est bonne) sur le theme de la technologie d'une difficulte facile, je veux que ce soit en json composer de 2 tableau. 
  le premier tableau compose d'une liste d'objet avec key "questions", chaque objet est compose d'une question ( key "question") de 4 reponses (key "options" ) sans la bonne reponses. les bonne reponses devront etre le second tableau sous forne de liste d'index (key "answers").
  il me faut 2 questions et ne m'envoie que le json sans tes phrases inutile 
  exemple de ma structure :
  {
    questions: [
      {
        question: "",
        options: [...]
      },
      {
        question: "",
        options: [...]
      },
      ...
    ],
    answers: [...]
  }`,
  },
];
