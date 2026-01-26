import type { Level } from "../types/level";
//Este código es un diccionario de niveles. Guarda la info de cada nivel
// (id, título, intro, XP, tema) y sus preguntas (VF o opción múltiple) para que la app las lea
// y muestre en pantalla según el nivel elegido.
export const LEVELS: Record<number, Level> = {
  //nivel 1
  1: {
    id: 1,
    title: "Contraseñas seguras",
    intro: "Aprende lo básico para no caer fácil.",
    xp: 10,
    theme: { accent: "#22C55E", bg: "#FFFFFF", text: "#111827" },

    questions: [
      //pregunta 1
      {
        id: "1-1",
        type: "tf",
        prompt: "Usar 123456 es seguro.",
        answer: false,
        explain: "Es común y fácil de adivinar.",
      },
      //pregunta 2
      {
        id: "1-2",
        type: "mc",
        prompt: "¿Qué es mejor?",
        options: ["Repetir contraseña", "Usar gestor", "Compartirla"],
        answerIndex: 1,
        explain: "Un gestor crea y guarda claves fuertes.",
      },
    ],
  },
  //nivel 2
  2: {
    id: 2,
    title: "Phishing",
    intro: "Aprende a detectar engaños por mensajes.",
    xp: 10,
    theme: { accent: "#F59E0B" },
    questions: [
      {
        id: "2-1",
        type: "mc",
        prompt: "Señal típica de phishing:",
        options: ["Dominio raro", "Mensaje claro", "Correo oficial verificado"],
        answerIndex: 0,
        explain: "Muchos ataques usan dominios parecidos o raros.",
      },
    ],
  },
};
