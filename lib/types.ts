export interface Symptom {
  id: string
  descripcion: string
  frecuencia: string
  confiabilidad_estimada: number
}

export interface Cause {
  id: string
  descripcion: string
  probabilidad_a_priori?: number
  probabilidad?: number
}

export interface ConditionalProbabilities {
  [key: string]: number[]
}

export interface PerceptionAction {
  percepcion: string
  accion_sugerida: string
}

export interface KnowledgeRule {
  si: string[]
  entonces: string
}
