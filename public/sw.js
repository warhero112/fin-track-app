// Service Worker for Rentora PWA
// Provides offline functionality and caching

const CACHE_NAME = 'rentora-v1.0.0'
const STATIC_CACHE = 'rentora-static-v1.0.0'
const DYNAMIC_CACHE = 'rentora-dynamic-v1.0.0'

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/properties',
  '/about',
  '/contact',
  '/admin',
  '/manifest.json',
  '/offline.html'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files...')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Static files cached successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Error caching static files:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', request.url)
          return cachedResponse
        }

        // Otherwise fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Clone the response
            const responseToCache = networkResponse.clone()

            // Cache successful responses
            if (networkResponse.status === 200) {
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache)
                })
            }

            return networkResponse
          })
          .catch((error) => {
            console.log('Network request failed:', error)
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html')
            }
            
            // Return cached version if available
            return caches.match(request)
          })
      })
  )
})

// Background sync for property data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'property-sync') {
    event.waitUntil(syncPropertyData())
  }
})

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New property updates available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Properties',
        icon: '/icons/explore-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-96x96.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Rentora', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action)
  
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/properties')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Property data synchronization
async function syncPropertyData() {
  try {
    console.log('Syncing property data...')
    
    // In real implementation, sync with your API
    const response = await fetch('/api/properties/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      console.log('Property data synced successfully')
    } else {
      throw new Error('Sync failed')
    }
  } catch (error) {
    console.error('Error syncing property data:', error)
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'property-updates') {
    event.waitUntil(syncPropertyData())
  }
})

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Cache management utilities
async function clearOldCaches() {
  const cacheNames = await caches.keys()
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('rentora-') && name !== CACHE_NAME
  )
  
  return Promise.all(
    oldCaches.map(name => caches.delete(name))
  )
}

// Update available notification
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
    // Notify the main thread that an update is available
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE'
        })
      })
    })
  }
})