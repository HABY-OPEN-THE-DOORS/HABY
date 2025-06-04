import {
  collection,
  query,
  limit,
  getDocs,
  getDoc,
  doc,
  type DocumentData,
  type QueryDocumentSnapshot,
  startAfter,
  type QueryConstraint,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// Caché en memoria para consultas frecuentes
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// Función para generar clave de caché
const generateCacheKey = (collectionName: string, constraints: QueryConstraint[]) => {
  return `${collectionName}:${constraints.map((c) => c.toString()).join("|")}`
}

// Función para convertir documentos de Firestore
function convertDoc<T>(doc: QueryDocumentSnapshot<DocumentData>): T & { id: string } {
  return {
    id: doc.id,
    ...doc.data(),
  } as T & { id: string }
}

// Función optimizada para consultas paginadas
export async function getPaginatedData<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  pageSize = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  cacheTTL = 60000, // 1 minuto por defecto
): Promise<{ data: (T & { id: string })[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }> {
  try {
    // Generar clave de caché (solo para la primera página)
    const cacheKey = !lastDoc ? generateCacheKey(collectionName, constraints) : null

    // Verificar caché para la primera página
    if (cacheKey && !lastDoc) {
      const cached = queryCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data
      }
    }

    // Construir consulta base
    const queryConstraints = [...constraints, limit(pageSize + 1)] // +1 para verificar si hay más páginas

    // Añadir paginación si hay un documento de inicio
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc))
    }

    // Ejecutar consulta
    const q = query(collection(db, collectionName), ...queryConstraints)
    const querySnapshot = await getDocs(q)

    // Procesar resultados
    const docs = querySnapshot.docs
    const hasMore = docs.length > pageSize
    const data = docs.slice(0, pageSize).map((doc) => convertDoc<T>(doc))
    const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null

    // Almacenar en caché (solo primera página)
    const result = { data, lastDoc: newLastDoc, hasMore }
    if (cacheKey && !lastDoc) {
      queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl: cacheTTL,
      })
    }

    return result
  } catch (error) {
    console.error("Error fetching paginated data:", error)
    throw error
  }
}

// Función optimizada para obtener un documento por ID con caché
export async function getDocumentById<T>(
  collectionName: string,
  docId: string,
  cacheTTL = 300000, // 5 minutos por defecto
): Promise<(T & { id: string }) | null> {
  try {
    const cacheKey = `${collectionName}:${docId}`

    // Verificar caché
    const cached = queryCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }

    // Obtener documento
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() } as T & { id: string }

      // Almacenar en caché
      queryCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL,
      })

      return data
    }

    return null
  } catch (error) {
    console.error(`Error fetching document ${docId} from ${collectionName}:`, error)
    throw error
  }
}

// Función para limpiar caché
export function clearQueryCache(pattern?: string): void {
  if (!pattern) {
    queryCache.clear()
    return
  }

  // Limpiar entradas que coincidan con el patrón
  for (const key of queryCache.keys()) {
    if (key.includes(pattern)) {
      queryCache.delete(key)
    }
  }
}

// Función para invalidar caché después de mutaciones
export function invalidateQueries(collectionName: string): void {
  clearQueryCache(collectionName)
}
