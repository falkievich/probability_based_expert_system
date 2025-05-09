import { causes, conditionalProbabilities, perceptionActionTable } from "./data"

/**
 * Función principal para realizar inferencia bayesiana
 * @param {Array} observedSymptoms - Array de IDs de síntomas observados
 * @returns {Object} - Resultado del diagnóstico
 */
export function bayesianInference(observedSymptoms: string[]) {
  // Verificar que los síntomas existan
  const validSymptoms = observedSymptoms

  if (validSymptoms.length === 0) {
    return {
      error: "No se proporcionaron síntomas válidos",
      causas: [],
    }
  }

  // Calcular probabilidades posteriores para cada causa
  const posteriorProbabilities = causes.map((cause) => {
    // Iniciar con la probabilidad a priori
    let probability = cause.probabilidad_a_priori || 0

    // Multiplicar por cada P(Síntoma|Causa) para los síntomas observados
    validSymptoms.forEach((symptomId) => {
      const causeIndex = Number.parseInt(cause.id.substring(1)) - 1
      probability *= conditionalProbabilities[symptomId][causeIndex]
    })

    return {
      id: cause.id,
      descripcion: cause.descripcion,
      probabilidad: probability,
    }
  })

  // Normalizar las probabilidades para que sumen 1
  const totalProbability = posteriorProbabilities.reduce((sum, cause) => sum + cause.probabilidad!, 0)

  posteriorProbabilities.forEach((cause) => {
    cause.probabilidad = cause.probabilidad! / totalProbability
  })

  // Ordenar por probabilidad descendente
  posteriorProbabilities.sort((a, b) => (b.probabilidad || 0) - (a.probabilidad || 0))

  // Generar recomendaciones basadas en los síntomas observados
  const recommendations = generateRecommendations(validSymptoms, posteriorProbabilities[0])

  return {
    causa_mas_probable: posteriorProbabilities[0],
    todas_las_causas: posteriorProbabilities,
    recomendaciones: recommendations,
  }
}

/**
 * Genera recomendaciones basadas en los síntomas y la causa más probable
 * @param {Array} observedSymptoms - Síntomas observados
 * @param {Object} mostProbableCause - Causa más probable
 * @returns {Array} - Lista de recomendaciones
 */
function generateRecommendations(observedSymptoms: string[], mostProbableCause: any) {
  const recommendations: string[] = []

  // Obtener recomendaciones de la tabla PyA
  observedSymptoms.forEach((symptomId) => {
    const perceptionAction = perceptionActionTable.find((pa) => pa.percepcion.startsWith(symptomId))

    if (perceptionAction) {
      recommendations.push(perceptionAction.accion_sugerida)
    }
  })

  // Añadir recomendaciones específicas basadas en la causa más probable
  switch (mostProbableCause.id) {
    case "C1":
      recommendations.push("Verificar estado del router y reiniciarlo")
      recommendations.push("Comprobar configuración del router")
      break
    case "C2":
      recommendations.push("Instalar repetidor Wi-Fi")
      recommendations.push("Cambiar canal de Wi-Fi para evitar interferencias")
      break
    case "C3":
      recommendations.push("Contactar al proveedor de servicios (ISP)")
      recommendations.push("Verificar estado del servicio en la zona")
      break
    case "C4":
      recommendations.push("Inspeccionar físicamente todos los cables de red")
      recommendations.push("Reemplazar cables dañados o defectuosos")
      break
    case "C5":
      recommendations.push("Configurar DNS alternativos (8.8.8.8, 1.1.1.1)")
      recommendations.push("Verificar configuración de DNS en el router")
      break
  }

  // Eliminar duplicados
  return [...new Set(recommendations)]
}
