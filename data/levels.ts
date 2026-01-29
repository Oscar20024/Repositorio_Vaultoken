// src/data/levels.ts
// Diccionario de niveles. La app lo lee por ID.
// Puedes mezclar niveles "quiz" y "theory" sin cambiar la pantalla.

import type { Level } from "../types/level";

export const LEVELS: Record<number, Level> = {
  // -------------------------
  // NIVEL 1 (QUIZ)
  // -------------------------
  1: {
    id: 1,
    mode: "quiz",
    title: "Contraseñas seguras",
    intro: "Aprende lo básico para no caer fácil.",
    xp: 10,
    theme: { accent: "#22C55E", bg: "#FFFFFF", text: "#111827" },
    passRate: 0.7, // opcional (70%); si lo quitas, igual usa 0.7

    questions: [
      {
        id: "1-1",
        type: "tf",
        prompt: "Usar 123456 es seguro.",
        answer: false,
        explain: "Es común y fácil de adivinar.",
      },
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

  // -------------------------
  // NIVEL 2 (TEORÍA)
  // -------------------------
  2: {
    id: 2,
    mode: "theory",
    title: "Phishing (Teoría)",
    intro: "Lee lo esencial antes de practicar.",
    xp: 10,
    theme: { accent: "#F59E0B", bg: "#FFFFFF", text: "#111827" },

    pages: [
      {
        id: "2-p1",
        title: "¿Qué es phishing?",
        body: "Es un engaño para que entregues datos (contraseña, tarjeta) usando mensajes o webs falsas.",
      },
      {
        id: "2-p2",
        title: "Señales típicas",
        body: "• Dominio raro (ej: micr0soft-support)\n• Urgencia (“hoy o se bloquea”)\n• Links acortados o sospechosos\n• Errores de ortografía",
      },
      {
        id: "2-p3",
        title: "Qué hacer",
        body: "No abras links dudosos. Verifica la URL, busca el sitio manualmente y activa 2FA cuando puedas.",
      },
    ],
  },

  // -------------------------
  // NIVEL 3 (QUIZ)
  // -------------------------
  3: {
    id: 3,
    mode: "quiz",
    title: "Phishing (Quiz)",
    intro: "Ahora sí: detecta señales en preguntas.",
    xp: 10,
    theme: { accent: "#F59E0B", bg: "#FFFFFF", text: "#111827" },

    questions: [
      {
        id: "3-1",
        type: "mc",
        prompt: "Señal típica de phishing:",
        options: ["Dominio raro", "Mensaje claro", "Correo oficial verificado"],
        answerIndex: 0,
        explain: "Muchos ataques usan dominios parecidos o raros.",
      },
    ],
  },
};
