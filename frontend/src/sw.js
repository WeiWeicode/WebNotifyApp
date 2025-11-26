import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()
clientsClaim()

self.addEventListener('push', (event) => {
    let data = {}
    if (event.data) {
        data = event.data.json()
    }

    const title = data.title || 'WebNotifyApp'
    const options = {
        body: data.body || 'New notification',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: data.url || '/'
    }

    event.waitUntil(
        self.registration.showNotification(title, options)
    )
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(
        clients.openWindow(event.notification.data)
    )
})
