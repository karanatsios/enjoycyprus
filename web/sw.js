// Inside Cyprus – Push Notification Service Worker

self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Inside Cyprus', {
      body: data.body || '',
      icon: data.icon || '/favicon.ico',
      image: data.image || undefined,
      badge: '/favicon.ico',
      tag: data.tag || 'inside-cyprus',
      data: { url: data.url || '/' },
      actions: [
        { action: 'open', title: 'Ansehen' },
        { action: 'close', title: 'Schließen' },
      ],
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'close') return;
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
