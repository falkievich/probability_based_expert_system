import type { Cause } from "@/lib/types"

interface DiagnosticResultsProps {
  result: {
    causa_mas_probable: Cause
    todas_las_causas: Cause[]
    recomendaciones: string[]
  }
}

export default function DiagnosticResults({ result }: DiagnosticResultsProps) {
  const { causa_mas_probable, todas_las_causas, recomendaciones } = result

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados del Diagnóstico</h2>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-emerald-800 mb-1">Causa más probable:</h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-800">{causa_mas_probable.descripcion}</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              {(causa_mas_probable.probabilidad * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-3">Todas las causas (ordenadas por probabilidad):</h3>
        <div className="space-y-2">
          {todas_las_causas.map((cause, index) => (
            <div
              key={cause.id}
              className={`flex items-center justify-between p-3 rounded-md ${
                index === 0 ? "bg-emerald-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs font-medium mr-3">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-700">{cause.descripcion}</span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${
                  index === 0 ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                }`}
              >
                {(cause.probabilidad * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-3">Recomendaciones:</h3>
        <ul className="space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
          {recomendaciones.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mr-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
