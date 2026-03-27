importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyArOWE7RqwK7pjUijS590NOUXx7z0gFxrw",
  authDomain: "lgs-koc-takip.firebaseapp.com",
  projectId: "lgs-koc-takip",
  storageBucket: "lgs-koc-takip.firebasestorage.app",
  messagingSenderId: "131005537763",
  appId: "1:131005537763:web:69b7171c9099358b00d4d6"
});

const messaging = firebase.messaging();

// Uygulama arka plandayken bildirimleri göster
messaging.onBackgroundMessage(function(payload) {
  const { title, body, icon, data } = payload.notification || payload.data || {};
  
  self.registration.showNotification(title || 'LGSKoç', {
    body: body || '',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: data?.tag || 'lgs-koc',
    data: data || {},
    vibrate: [200, 100, 200],
    requireInteraction: false,
    actions: data?.actionUrl ? [
      { action: 'open', title: '📱 Uygulamayı Aç' }
    ] : []
  });
});

// Bildirime tıklanınca uygulamayı aç
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.actionUrl || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        for (const client of clientList) {
          if (client.url.includes('sengezer-byte.github.io') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
