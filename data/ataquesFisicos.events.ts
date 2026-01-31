// app/data/ataquesFisicos.events.ts
// =====================================================
// ✅ AQUÍ VIVES TUS EVENTOS (DATA)
// ✅ Para agregar uno nuevo: copia un objeto y cambia campos
// =====================================================

export type AttackType =
  | "tailgating"
  | "device-theft"
  | "shoulder-surfing"
  | "dumpster-diving";

export type AttackEvent = {
  id: number;
  type: AttackType;
  title: string;
  description: string;
  tools: string[];
  correctTool: string;
};

// ✅ IMPORTANTE: tipar el array como AttackEvent[]
export const ATAQUES_FISICOS_EVENTS: AttackEvent[] = [
  {
    id: 1,
    type: "tailgating",
    title: "Tailgating",
    description: "Un desconocido intenta pasar detrás de un empleado.",
    tools: ["Ignorar", "Pedir ID", "Llamar a seguridad", "Dejar pasar"],
    correctTool: "Llamar a seguridad",
  },
  {
    id: 2,
    type: "device-theft",
    title: "Laptop sola",
    description: "Laptop sin supervisión en sala.",
    tools: ["Dejar", "Guardar seguro", "Cable", "Reportar IT"],
    correctTool: "Guardar seguro",
  },

  // 👇 EJEMPLO: agrega nuevos eventos así
  // {
  //   id: 3,
  //   type: "shoulder-surfing",
  //   title: "Shoulder Surfing",
  //   description: "Alguien mira tu pantalla por detrás.",
  //   tools: ["Ignorar", "Mover pantalla", "Filtro de privacidad", "Cerrar sesión"],
  //   correctTool: "Filtro de privacidad",
  // },
];
