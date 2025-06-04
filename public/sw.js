// Service Worker para HABY-CLASS
// Este archivo debe estar en la raíz del directorio público

// Versión de caché - cambiar al actualizar recursos
const CACHE_VERSION = "v1.0.0"
const CACHE_NAME = `haby-class-${CACHE_VERSION}`

// Recursos para pre-cachear
const PRECACHE_URLS = ["/", "/offline", "/images/logo-haby-oficial.png", "/manifest.json", "/favicon.ico"]

// Instalar Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

// Activar Service Worker y limpiar cachés antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith("haby-class-") && cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Estrategia de caché: Network First con fallback a caché
self.addEventListener("fetch", (event) => {
  // Ignorar solicitudes no GET o a otros dominios
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin) ||
    event.request.url.includes("/api/") ||
    event.request.url.includes("/_next/data/")
  ) {
    return
  }

  // Estrategia para recursos estáticos (imágenes, CSS, JS)
  if (
    event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?)$/) ||
    event.request.url.includes("/_next/static/")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Usar caché si está disponible
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Actualizar caché con la nueva respuesta
            if (networkResponse.ok) {
              const clonedResponse = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clonedResponse)
              })
            }
            return networkResponse
          })
          .catch(() => {
            // Fallback a caché si la red falla
            return cachedResponse
          })

        return cachedResponse || fetchPromise
      }),
    )
    return
  }

  // Estrategia para páginas HTML: Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar respuesta para guardar en caché
        const clonedResponse = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse)
        })
        return response
      })
      .catch(() => {
        // Intentar obtener de caché si la red falla
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // Si no hay caché, mostrar página offline
          if (event.request.headers.get("Accept").includes("text/html")) {
            return caches.match("/offline")
          }
          // Para otros recursos, mostrar error
          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
      }),
  )
})

// Sincronización en segundo plano
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData())
  }
})

// Función para sincronizar datos pendientes
async function syncData() {
  // Implementar lógica de sincronización
  console.log("Sincronizando datos en segundo plano")
}

// Notificaciones push
self.addEventListener("push", (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()

    const options = {
      body: data.body || "Nueva notificación",
      icon: "/images/logo-haby-oficial.png",
      badge: "/images/notification-badge.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    }

    event.waitUntil(self.registration.showNotification(data.title || "HABY-CLASS", options))
  } catch (error) {
    console.error("Error al procesar notificación push:", error)
  }
})

// Clic en notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const url = event.notification.data.url

      // Si ya hay una ventana abierta, enfocarla y navegar
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }

      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    }),
  )
})
