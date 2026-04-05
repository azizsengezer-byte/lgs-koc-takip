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
  const notifData = payload.notification || {};
  const extraData = payload.data || {};
  const actionUrl = extraData.actionUrl || notifData.click_action || '/';

  self.registration.showNotification(notifData.title || 'LGSKoç', {
    body: notifData.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: extraData.tag || 'lgs-koc',
    data: { ...extraData, actionUrl },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  });
});

// Bildirime tıklanınca
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const data = event.notification.data || {};
  const actionUrl = data.actionUrl || '/';

  // Tam URL oluştur (relative ise base URL ekle)
  const baseUrl = 'https://azizsengezer-byte.github.io/lgs-koc-takip/';
  let targetUrl = actionUrl.startsWith('http') ? actionUrl : baseUrl + actionUrl.replace(/^\//, '');

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Uygulama zaten açıksa: odakla ve postMessage ile yönlendir
      for (const client of clientList) {
        if (client.url.includes('lgs-koc-takip') && 'focus' in client) {
          client.postMessage({
            type: 'NOTIF_NAVIGATE',
            actionUrl,
            data
          });
          return client.focus();
        }
      }
      // Uygulama kapalıysa: URL ile aç — URL parametreleri yönlendirmeyi sağlar
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
