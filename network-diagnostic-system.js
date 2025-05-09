// Sistema Experto Basado en Probabilidad para Diagnóstico de Red - Datatech SRL

// Definición de síntomas
const symptoms = [
  {
    id: "S1",
    descripcion: "Pérdida de paquetes al hacer ping",
    frecuencia: "Alta",
    confiabilidad_estimada: 0.90
  },
  {
    id: "S2",
    descripcion: "Tiempo de respuesta inconsistente",
    frecuencia: "Media",
    confiabilidad_estimada: 0.85
  },
  {
    id: "S3",
    descripcion: "Errores relacionados con DNS",
    frecuencia: "Media",
    confiabilidad_estimada: 0.70
  },
  {
    id: "S4",
    descripcion: "Señal Wi-Fi débil en oficina alejada",
    frecuencia: "Alta",
    confiabilidad_estimada: 0.95
  },
  {
    id: "S5",
    descripcion: "Conector de red dañado",
    frecuencia: "Baja",
    confiabilidad_estimada: 0.90
  }
];

// Definición de causas con probabilidades a priori
const causes = [
  { id: "C1", descripcion: "Falla en el router", probabilidad_a_priori: 0.30 },
  { id: "C2", descripcion: "Interferencia o señal Wi-Fi débil", probabilidad_a_priori: 0.25 },
  { id: "C3", descripcion: "Problemas con el proveedor (ISP)", probabilidad_a_priori: 0.20 },
  { id: "C4", descripcion: "Problemas físicos en el cableado", probabilidad_a_priori: 0.15 },
  { id: "C5", descripcion: "Mal funcionamiento del DNS local", probabilidad_a_priori: 0.10 }
];

// Matriz de probabilidades condicionales P(Síntoma|Causa)
// Representa la probabilidad de observar un síntoma dado que una causa específica está presente
const conditionalProbabilities = {
  // P(S1|C1), P(S1|C2), P(S1|C3), P(S1|C4), P(S1|C5)
  "S1": [0.80, 0.40, 0.70, 0.60, 0.20],
  // P(S2|C1), P(S2|C2), P(S2|C3), P(S2|C4), P(S2|C5)
  "S2": [0.75, 0.30, 0.80, 0.40, 0.25],
  // P(S3|C1), P(S3|C2), P(S3|C3), P(S3|C4), P(S3|C5)
  "S3": [0.30, 0.20, 0.60, 0.10, 0.90],
  // P(S4|C1), P(S4|C2), P(S4|C3), P(S4|C4), P(S4|C5)
  "S4": [0.40, 0.95, 0.30, 0.20, 0.10],
  // P(S5|C1), P(S5|C2), P(S5|C3), P(S5|C4), P(S5|C5)
  "S5": [0.20, 0.10, 0.15, 0.90, 0.05]
};

// Tabla de Percepción y Acción (PyA)
const perceptionActionTable = [
  { percepcion: "S1: Pérdida de paquetes", accion_sugerida: "Reiniciar router, verificar cableado" },
  { percepcion: "S2: Tiempo inconsistente", accion_sugerida: "Evaluar router y carga de red" },
  { percepcion: "S3: Error de DNS", accion_sugerida: "Verificar DNS interno, cambiar a externo" },
  { percepcion: "S4: Señal Wi-Fi débil", accion_sugerida: "Colocar repetidor o cambiar canal Wi-Fi" },
  { percepcion: "S5: Cable dañado", accion_sugerida: "Reemplazar cable" }
];

// Reglas de conocimiento
const knowledgeRules = [
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
  { si: ["todos los equipos sin conexión"], entonces: "Revisar WAN o cableado troncal" }
];

/**
 * Función principal para realizar inferencia bayesiana
 * @param {Array} observedSymptoms - Array de IDs de síntomas observados
 * @returns {Object} - Resultado del diagnóstico
 */
function bayesianInference(observedSymptoms) {
  // Verificar que los síntomas existan
  const validSymptoms = observedSymptoms.filter(s => 
    symptoms.some(symptom => symptom.id === s)
  );
  
  if (validSymptoms.length === 0) {
    return {
      error: "No se proporcionaron síntomas válidos",
      causas: []
    };
  }

  // Calcular probabilidades posteriores para cada causa
  const posteriorProbabilities = causes.map(cause => {
    // Iniciar con la probabilidad a priori
    let probability = cause.probabilidad_a_priori;
    
    // Multiplicar por cada P(Síntoma|Causa) para los síntomas observados
    validSymptoms.forEach(symptomId => {
      const symptomIndex = parseInt(symptomId.substring(1)) - 1;
      const causeIndex = parseInt(cause.id.substring(1)) - 1;
      probability *= conditionalProbabilities[symptomId][causeIndex];
    });
    
    return {
      id: cause.id,
      descripcion: cause.descripcion,
      probabilidad: probability
    };
  });
  
  // Normalizar las probabilidades para que sumen 1
  const totalProbability = posteriorProbabilities.reduce(
    (sum, cause) => sum + cause.probabilidad, 0
  );
  
  posteriorProbabilities.forEach(cause => {
    cause.probabilidad = cause.probabilidad / totalProbability;
  });
  
  // Ordenar por probabilidad descendente
  posteriorProbabilities.sort((a, b) => b.probabilidad - a.probabilidad);
  
  // Generar recomendaciones basadas en los síntomas observados
  const recommendations = generateRecommendations(validSymptoms, posteriorProbabilities[0]);
  
  return {
    causa_mas_probable: posteriorProbabilities[0],
    todas_las_causas: posteriorProbabilities,
    recomendaciones: recommendations
  };
}

/**
 * Genera recomendaciones basadas en los síntomas y la causa más probable
 * @param {Array} observedSymptoms - Síntomas observados
 * @param {Object} mostProbableCause - Causa más probable
 * @returns {Array} - Lista de recomendaciones
 */
function generateRecommendations(observedSymptoms, mostProbableCause) {
  const recommendations = [];
  
  // Obtener recomendaciones de la tabla PyA
  observedSymptoms.forEach(symptomId => {
    const perceptionAction = perceptionActionTable.find(pa => 
      pa.percepcion.startsWith(symptomId)
    );
    
    if (perceptionAction) {
      recommendations.push(perceptionAction.accion_sugerida);
    }
  });
  
  // Añadir recomendaciones específicas basadas en la causa más probable
  switch (mostProbableCause.id) {
    case "C1":
      recommendations.push("Verificar estado del router y reiniciarlo");
      recommendations.push("Comprobar configuración del router");
      break;
    case "C2":
      recommendations.push("Instalar repetidor Wi-Fi");
      recommendations.push("Cambiar canal de Wi-Fi para evitar interferencias");
      break;
    case "C3":
      recommendations.push("Contactar al proveedor de servicios (ISP)");
      recommendations.push("Verificar estado del servicio en la zona");
      break;
    case "C4":
      recommendations.push("Inspeccionar físicamente todos los cables de red");
      recommendations.push("Reemplazar cables dañados o defectuosos");
      break;
    case "C5":
      recommendations.push("Configurar DNS alternativos (8.8.8.8, 1.1.1.1)");
      recommendations.push("Verificar configuración de DNS en el router");
      break;
  }
  
  // Eliminar duplicados
  return [...new Set(recommendations)];
}

// Función para simular casos de prueba
function runTestCases() {
  console.log("=== SISTEMA EXPERTO DE DIAGNÓSTICO DE RED - DATATECH SRL ===\n");
  
  // Caso de prueba 1: Problemas con el router
  console.log("CASO DE PRUEBA 1: Pérdida de paquetes y tiempo de respuesta inconsistente");
  const result1 = bayesianInference(["S1", "S2"]);
  printDiagnosticResult(result1);
  
  // Caso de prueba 2: Problemas de DNS
  console.log("\nCASO DE PRUEBA 2: Errores de DNS");
  const result2 = bayesianInference(["S3"]);
  printDiagnosticResult(result2);
  
  // Caso de prueba 3: Problemas de Wi-Fi
  console.log("\nCASO DE PRUEBA 3: Señal Wi-Fi débil");
  const result3 = bayesianInference(["S4"]);
  printDiagnosticResult(result3);
  
  // Caso de prueba 4: Problemas de cableado
  console.log("\nCASO DE PRUEBA 4: Conector de red dañado");
  const result4 = bayesianInference(["S5"]);
  printDiagnosticResult(result4);
  
  // Caso de prueba 5: Múltiples síntomas
  console.log("\nCASO DE PRUEBA 5: Múltiples síntomas (S1, S3, S4)");
  const result5 = bayesianInference(["S1", "S3", "S4"]);
  printDiagnosticResult(result5);
}

// Función para imprimir resultados de diagnóstico
function printDiagnosticResult(result) {
  if (result.error) {
    console.log(`Error: ${result.error}`);
    return;
  }
  
  const mostProbableCause = result.causa_mas_probable;
  
  console.log(`DIAGNÓSTICO MÁS PROBABLE: ${mostProbableCause.descripcion}`);
  console.log(`PROBABILIDAD: ${(mostProbableCause.probabilidad * 100).toFixed(2)}%`);
  
  console.log("\nTODAS LAS CAUSAS (ORDENADAS POR PROBABILIDAD):");
  result.todas_las_causas.forEach(cause => {
    console.log(`- ${cause.descripcion}: ${(cause.probabilidad * 100).toFixed(2)}%`);
  });
  
  console.log("\nRECOMENDACIONES:");
  result.recomendaciones.forEach(recommendation => {
    console.log(`- ${recommendation}`);
  });
}

// Ejecutar casos de prueba
runTestCases();

// Ejemplo de cómo se usaría en una aplicación real:
// const observedSymptoms = ["S1", "S4"]; // Síntomas observados
// const diagnosticResult = bayesianInference(observedSymptoms);
// console.log(diagnosticResult);
