"use client"

import type { Symptom } from "@/lib/types"

interface SymptomSelectorProps {
  symptoms: Symptom[]
  selectedSymptoms: string[]
  onToggle: (symptomId: string) => void
}

export default function SymptomSelector({ symptoms, selectedSymptoms, onToggle }: SymptomSelectorProps) {
  return (
    <div className="space-y-3">
      {symptoms.map((symptom) => (
        <div
          key={symptom.id}
          className={`relative flex items-start p-3 rounded-md border transition-colors cursor-pointer ${
            selectedSymptoms.includes(symptom.id)
              ? "bg-emerald-50 border-emerald-200"
              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
          }`}
          onClick={() => onToggle(symptom.id)}
        >
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={selectedSymptoms.includes(symptom.id)}
              onChange={() => {}}
              className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-700">{symptom.descripcion}</label>
            <div className="flex items-center mt-1 space-x-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  symptom.frecuencia === "Alta"
                    ? "bg-red-100 text-red-800"
                    : symptom.frecuencia === "Media"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                Frecuencia: {symptom.frecuencia}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                Confiabilidad: {(symptom.confiabilidad_estimada * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
