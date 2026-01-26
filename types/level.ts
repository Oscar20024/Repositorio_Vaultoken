export type Question =
  | {
      id: string;
      type: "mc";
      prompt: string;
      options: string[];
      answerIndex: number;
      explain?: string;
    }
  | {
      id: string;
      type: "tf";
      prompt: string;
      answer: boolean;
      explain?: string;
    };

export type Level = {
  id: number;
  title: string;
  intro: string;
  xp: number;

  // Opcional: tema/cover por nivel (sin “UI compleja”)
  theme?: { accent?: string; bg?: string; text?: string };
  cover?: { type: "image"; source: any }; // require(...)
  questions: Question[];
};
