// app/assets.ts
export const MAPAS = [
  require("../assets/images/mapa-1.png"),
  require("../assets/images/mapa-2.png"),
  require("../assets/images/mapa-3.png"),
  require("../assets/images/mapa-4.png"),
] as const;

export const ISLAS = {
  isla1: require("../assets/images/isla1.png"),
  isla2: require("../assets/images/isla2.png"),
  isla3: require("../assets/images/isla3.png"),
} as const;

export const PUNTOS = {
  punto1: require("../assets/images/punto1.png"),
  punto2: require("../assets/images/punto2.png"),
} as const;

export const TOP_ICONS = {
  servidor: require("../assets/images/servidor.png"),
  teoria: require("../assets/images/teoria.png"),
  virus: require("../assets/images/virus.png"),
  simulador: require("../assets/images/simulador.png"),
  phishing: require("../assets/images/phishing.gif"),
} as const;

// ✅ lista única para precargar
export const PRELOAD = [
  ...MAPAS,
  ISLAS.isla1,
  ISLAS.isla2,
  ISLAS.isla3,
  PUNTOS.punto1,
  PUNTOS.punto2,
  TOP_ICONS.servidor,
  TOP_ICONS.teoria,
  TOP_ICONS.virus,
  TOP_ICONS.simulador,
  TOP_ICONS.phishing,
] as const;
