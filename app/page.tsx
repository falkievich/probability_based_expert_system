"use client"

import { useState } from "react"
import SymptomSelector from "@/components/symptom-selector"
import DiagnosticResults from "@/components/diagnostic-results"
import { bayesianInference } from "@/lib/bayesian-inference"
import { symptoms } from "@/lib/data"

export default function Home() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const runDiagnostic = () => {
    if (selectedSymptoms.length === 0) return

    setIsAnalyzing(true)

    // Simulate processing time for better UX
    setTimeout(() => {
      const result = bayesianInference(selectedSymptoms)
      setDiagnosticResult(result)
      setIsAnalyzing(false)
    }, 1000)
  }

  const resetDiagnostic = () => {
    setSelectedSymptoms([])
    setDiagnosticResult(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema Experto de Diagnóstico de Red</h1>
          <p className="text-gray-600">Datatech SRL - Análisis Bayesiano de Problemas de Red</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de síntomas */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Seleccione los síntomas observados</h2>

            <SymptomSelector symptoms={symptoms} selectedSymptoms={selectedSymptoms} onToggle={handleSymptomToggle} />

            <div className="mt-6 flex flex-col space-y-3">
              <button
                onClick={runDiagnostic}
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  selectedSymptoms.length === 0 || isAnalyzing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {isAnalyzing ? "Analizando..." : "Ejecutar Diagnóstico"}
              </button>

              {selectedSymptoms.length > 0 && (
                <button
                  onClick={resetDiagnostic}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors"
                >
                  Reiniciar
                </button>
              )}
            </div>
          </div>

          {/* Panel de resultados */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {!diagnosticResult && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Esperando diagnóstico</h3>
                <p className="text-gray-500 max-w-md">
                  Seleccione los síntomas observados en la red y haga clic en "Ejecutar Diagnóstico" para analizar las
                  posibles causas.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-medium text-gray-700">Analizando síntomas...</h3>
                <p className="text-gray-500 mt-2">
                  Aplicando inferencia bayesiana para determinar las causas más probables.
                </p>
              </div>
            )}

            {diagnosticResult && !isAnalyzing && <DiagnosticResults result={diagnosticResult} />}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Datatech SRL - Sistema Experto de Diagnóstico de Red</p>
        </footer>
      </div>
    </main>
  )
}
