// data/phishingLessons.ts
export type PhishingLesson = {
  id: string; // "ph-1"
  title: string; // título
  minutes?: number; // opcional
  image?: any; // opcional (require)
  sections: { h: string; p: string }[];
  tips?: string[];
};

export const PHISHING_LESSONS: Record<string, PhishingLesson> = {
  "ph-1": {
    id: "ph-1",
    title: "¿Qué es phishing?",
    minutes: 3,
    sections: [
      {
        h: "Idea clave",
        p: "Phishing es un engaño para robar datos (claves, códigos, tarjetas) con mensajes falsos.",
      },
      {
        h: "Dónde aparece",
        p: "Email, WhatsApp, SMS y páginas clonadas de bancos/tiendas.",
      },
    ],
    tips: [
      "No compartas códigos de verificación.",
      "Entra a la web escribiéndola tú, no por links.",
    ],
  },

  "ph-2": {
    id: "ph-2",
    title: "Señales típicas",
    minutes: 4,
    sections: [
      { h: "Urgencia", p: "“Último aviso”, “hoy se bloquea tu cuenta”." },
      {
        h: "Links raros",
        p: "Dominios parecidos o largos (banco-peru-secure.com).",
      },
    ],
    tips: ["Desconfía de lo urgente.", "Verifica por otro canal."],
  },
};

// ✅ orden para rotar cada 5h
export const PHISHING_ORDER = Object.keys(PHISHING_LESSONS);
