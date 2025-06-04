// Este archivo se ejecutará en un Web Worker
// Nota: Este archivo debe ser compilado y servido como un archivo separado

// Tipos de mensajes que puede recibir el worker
type WorkerMessage = {
  type: "PROCESS_DATA" | "FILTER_ITEMS" | "SORT_ITEMS" | "SEARCH_ITEMS"
  payload: any
  requestId: string
}

// Función para procesar grandes conjuntos de datos
function processData(data: any[]) {
  // Simulación de procesamiento pesado
  return data.map((item) => ({
    ...item,
    processed: true,
    score: calculateScore(item),
  }))
}

// Función para calcular puntuación (ejemplo de tarea intensiva)
function calculateScore(item: any) {
  let score = 0
  // Simulación de cálculo intensivo
  for (let i = 0; i < 10000; i++) {
    score += Math.sin(i) * Math.cos(i * 2) * Math.random()
  }
  return score * (item.priority || 1)
}

// Función para filtrar elementos
function filterItems(items: any[], filters: Record<string, any>) {
  return items.filter((item) => {
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        if (!value.includes(item[key])) return false
      } else if (item[key] !== value) {
        return false
      }
    }
    return true
  })
}

// Función para ordenar elementos
function sortItems(items: any[], sortBy: string, sortOrder: "asc" | "desc") {
  return [...items].sort((a, b) => {
    const valueA = a[sortBy]
    const valueB = b[sortBy]

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1
    return 0
  })
}

// Función para búsqueda de texto
function searchItems(items: any[], searchTerm: string, fields: string[]) {
  const term = searchTerm.toLowerCase()
  return items.filter((item) => {
    return fields.some((field) => {
      const value = item[field]
      if (typeof value === "string") {
        return value.toLowerCase().includes(term)
      }
      return false
    })
  })
}

// Manejador de mensajes
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload, requestId } = event.data

  try {
    let result

    switch (type) {
      case "PROCESS_DATA":
        result = processData(payload.data)
        break
      case "FILTER_ITEMS":
        result = filterItems(payload.items, payload.filters)
        break
      case "SORT_ITEMS":
        result = sortItems(payload.items, payload.sortBy, payload.sortOrder)
        break
      case "SEARCH_ITEMS":
        result = searchItems(payload.items, payload.searchTerm, payload.fields)
        break
      default:
        throw new Error(`Unknown message type: ${type}`)
    }

    // Enviar resultado de vuelta al hilo principal
    self.postMessage({
      type: `${type}_RESULT`,
      payload: result,
      requestId,
      error: null,
    })
  } catch (error) {
    // Enviar error al hilo principal
    self.postMessage({
      type: `${type}_ERROR`,
      payload: null,
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
