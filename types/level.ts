// src/types/level.ts
// Tipos base para definir Niveles.
// Ahora un nivel puede ser:
// 1) "quiz"  -> preguntas (mc/tf) + regla de aprobación
// 2) "theory"-> solo teoría en páginas + botón siguiente/terminar

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

// Página de teoría (texto simple). Puedes agregar más campos luego si quieres.
export type TheoryPage = {
  id: string;
  title?: string;
  body: string;
};

// Propiedades comunes a TODOS los niveles
type LevelBase = {
  id: number;
  title: string;
  intro: string;
  xp: number;

  // Opcional: tema/cover por nivel (sin “UI compleja”)
  theme?: { accent?: string; bg?: string; text?: string };
  cover?: { type: "image"; source: any }; // require(...)
};

// Nivel tipo QUIZ (preguntas)
export type QuizLevel = LevelBase & {
  mode: "quiz";
  questions: Question[];

  // Opcional: porcentaje mínimo para aprobar (por defecto 0.7 = 70%)
  passRate?: number;
};

// Nivel tipo TEORÍA (páginas)
export type TheoryLevel = LevelBase & {
  mode: "theory";
  pages: TheoryPage[];
};

// Un Level puede ser Quiz o Theory
export type Level = QuizLevel | TheoryLevel;
