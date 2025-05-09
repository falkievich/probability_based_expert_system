import type { Symptom, Cause, ConditionalProbabilities, PerceptionAction, KnowledgeRule } from "./types"

// Definición de síntomas
export const symptoms: Symptom[] = [
  {
    id: "S1",
    descripcion: "Pérdida de paquetes al hacer ping",
    frecuencia: "Alta",
    confiabilidad_estimada: 0.9,
  },
  {
    id: "S2",
    descripcion: "Tiempo de respuesta inconsistente",
    frecuencia: "Media",
    confiabilidad_estimada: 0.85,
  },
  {
    id: "S3",
    descripcion: "Errores relacionados con DNS",
    frecuencia: "Media",
    confiabilidad_estimada: 0.7,
  },
  {
    id: "S4",
    descripcion: "Señal Wi-Fi débil en oficina alejada",
    frecuencia: "Alta",
    confiabilidad_estimada: 0.95,
  },
  {
    id: "S5",
    descripcion: "Conector de red dañado",
    frecuencia: "Baja",
    confiabilidad_estimada: 0.9,
  },
]

// Definición de causas con probabilidades a priori
export const causes: Cause[] = [
  { id: "C1", descripcion: "Falla en el router", probabilidad_a_priori: 0.3 },
  { id: "C2", descripcion: "Interferencia o señal Wi-Fi débil", probabilidad_a_priori: 0.25 },
  { id: "C3", descripcion: "Problemas con el proveedor (ISP)", probabilidad_a_priori: 0.2 },
  { id: "C4", descripcion: "Problemas físicos en el cableado", probabilidad_a_priori: 0.15 },
  { id: "C5", descripcion: "Mal funcionamiento del DNS local", probabilidad_a_priori: 0.1 },
]

// Matriz de probabilidades condicionales P(Síntoma|Causa)
export const conditionalProbabilities: ConditionalProbabilities = {
  // P(S1|C1), P(S1|C2), P(S1|C3), P(S1|C4), P(S1|C5)
  S1: [0.8, 0.4, 0.7, 0.6, 0.2],
  // P(S2|C1), P(S2|C2), P(S2|C3), P(S2|C4), P(S2|C5)
  S2: [0.75, 0.3, 0.8, 0.4, 0.25],
  // P(S3|C1), P(S3|C2), P(S3|C3), P(S3|C4), P(S3|C5)
  S3: [0.3, 0.2, 0.6, 0.1, 0.9],
  // P(S4|C1), P(S4|C2), P(S4|C3), P(S4|C4), P(S4|C5)
  S4: [0.4, 0.95, 0.3, 0.2, 0.1],
  // P(S5|C1), P(S5|C2), P(S5|C3), P(S5|C4), P(S5|C5)
  S5: [0.2, 0.1, 0.15, 0.9, 0.05],
}

// Tabla de Percepción y Acción (PyA)
export const perceptionActionTable: PerceptionAction[] = [
  { percepcion: "S1: Pérdida de paquetes", accion_sugerida: "Reiniciar router, verificar cableado" },
  { percepcion: "S2: Tiempo inconsistente", accion_sugerida: "Evaluar router y carga de red" },
  { percepcion: "S3: Error de DNS", accion_sugerida: "Verificar DNS interno, cambiar a externo" },
  { percepcion: "S4: Señal Wi-Fi débil", accion_sugerida: "Colocar repetidor o cambiar canal Wi-Fi" },
  { percepcion: "S5: Cable dañado", accion_sugerida: "Reemplazar cable" },
]

// Reglas de conocimiento
export const knowledgeRules: KnowledgeRule[] = [
  { si: ["no hay conexión", "router está apagado"], entonces: "Encender el router" },
  { si: ["no hay conexión", "router encendido", "ping falla"], entonces: "Revisar cable de red" },
  { si: ["no hay conexión", "ping funciona"], entonces: "Verificar configuración IP" },
  { si: ["navegación lenta", "muchos dispositivos"], entonces: "Reducir uso de red simultáneo" },
  { si: ["navegación lenta", "pocos dispositivos", "velocidad baja"], entonces: "Contactar ISP" },
  { si: ["señal Wi-Fi débil"], entonces: "Acercar equipo al router o cambiar canal Wi-Fi" },
  { si: ["conexión intermitente", "IP dinámica"], entonces: "Revisar servidor DHCP" },
  { si: ["conexión intermitente", "switch/router muestra errores"], entonces: "Reiniciar equipo de red" },
  { si: ["no se puede imprimir", "impresora apagada"], entonces: "Encender impresora" },
  { si: ["impresora encendida", "IP mal configurada"], entonces: "Asignar IP correcta" },
  { si: ["ping a impresora falla", "impresora encendida"], entonces: "Revisar red de impresora" },
  { si: ["todos los equipos sin conexión"], entonces: "Revisar WAN o cableado troncal" },
]
