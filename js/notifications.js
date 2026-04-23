// notifications.js — Bildirim Sayfası ve Listener

// Bildirim tipine göre in-app yönlendirme
function _notifNavigate(n) {
  // Öğrenci bildirimleri
  if (currentRole === 'student') {
    if (n.type === 'badge') {
      const badgeName = n.meta?.badgeName || _parseBadgeNameFromText(n.text);
      window._pendingHighlightBadge = badgeName;
      showPage('badges');
      return;
    }
    if (n.type === 'odul') {
      window._pendingOdulAc = true;
      showPage('profile');
      return;
    }
    if (n.type === 'task_takvim')    { kocProfilGoster(); return; }
    if (n.type === 'task')           { showPage('my-tasks');    return; }
    if (n.type === 'wellness_sleep') { showPage('wellness');    return; }
    if (n.type === 'reminder')       { showPage('daily-entry'); return; }
    if (n.type === 'motivation')     { showPage('daily-entry'); return; }
    if (n.type === 'weekly_summary') { showPage('my-analysis'); return; }
    if (n.type === 'message')        { showPage('messages');    return; }
    if (n.type === 'hediye')         { showPage('messages');    return; }
  }

  // Öğretmen bildirimleri
  if (currentRole === 'teacher') {
    if (n.type === 'exam' || n.type === 'wellness_alert' ||
        n.type?.startsWith('basari') || n.type?.startsWith('enerji') ||
        n.type?.startsWith('dusuk') || n.type?.startsWith('yuksek') ||
        n.type?.startsWith('3gun') || n.type?.startsWith('baskı') ||
        n.type?.startsWith('konsantrasyon') || n.type?.startsWith('kacak') ||
        n.type?.startsWith('sinav') || n.type?.startsWith('hata') ||
        n.type?.startsWith('erken') || n.type?.startsWith('kaygi') ||
        n.type?.startsWith('gorev_tamamla') || n.type?.startsWith('streak') ) {
      // fromUid ile öğrenciyi bul
      const studentName = n.meta?.studentName || _findStudentNameByUid(n.fromUid);
      if (studentName) {
        selectedStudentName = studentName;
        showPage('student-detail');
      } else {
        showPage('students');
      }
      return;
    }
    if (n.type === 'task')    { showPage('tasks-teacher'); return; }
    if (n.type === 'message') { showPage('messages');      return; }
    if (n.type === 'gorusme') { showPage('students');      return; }
  }
}

function _parseBadgeNameFromText(text) {
  const m = text.match(/kazandın: "([^"]+)"/);
  return m ? m[1] : '';
}

function _findStudentNameByUid(uid) {
  if (!uid) return '';
  const s = students.find(s => s.uid === uid);
  return s ? s.name : '';
}

function _notifTarih(createdAt) {
  if (!createdAt || !createdAt.seconds) return '';
  const d = new Date(createdAt.seconds * 1000);
  const now = new Date();
  const bugun = now.toISOString().slice(0, 10);
  const dun = new Date(now - 864e5).toISOString().slice(0, 10);
  const tarih = d.toISOString().slice(0, 10);
  const saat = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  if (tarih === bugun) return 'Bugun ' + saat;
  if (tarih === dun)   return 'Dun ' + saat;
  const farkGun = Math.floor((now - d) / 864e5);
  if (farkGun < 7)     return farkGun + ' gun once ' + saat;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) + ' ' + saat;
}

async function bildirimleriTemizle() {
  const myUid = (window.currentUserData||{}).uid || '';
  if (!myUid) return;
  const notifs = currentRole === 'teacher' ? teacherNotifs : studentNotifs;
  const taskNotifs = notifs.filter(function(n) { return n.type !== 'message'; });
  if (taskNotifs.length === 0) return;
  const ok = await appConfirm('Bildirimleri Temizle', 'Tum bildirimler silinecek. Emin misin?', true);
  if (!ok) return;
  const batch = db.batch();
  taskNotifs.filter(function(n) { return n.id; }).forEach(function(n) {
    batch.delete(db.collection('notifications').doc(n.id));
  });
  await batch.commit().catch(function() {});
  if (currentRole === 'teacher') teacherNotifs = teacherNotifs.filter(function(n) { return n.type === 'message'; });
  else studentNotifs = studentNotifs.filter(function(n) { return n.type === 'message'; });
  updateNotifBadge();
  showPage('notifications');
}

async function _eskiBildirimleriSil(myUid) {
  if (!myUid) return;
  const sinir = new Date(Date.now() - 30 * 864e5);
  try {
    const snap = await db.collection('notifications')
      .where('toUid', '==', myUid)
      .where('createdAt', '<', sinir)
      .get();
    if (snap.empty) return;
    const batch = db.batch();
    snap.forEach(function(d) { batch.delete(d.ref); });
    await batch.commit();
  } catch(e) {}
}

function notificationsPage() {
  const notifs = currentRole === 'teacher' ? teacherNotifs : studentNotifs;
  const taskNotifs = notifs.filter(function(n) { return n.type !== 'message'; });
  const myUid = (window.currentUserData||{}).uid || '';

  const rows = taskNotifs.map(function(n, i) {
    var unread = n.read ? '' : 'unread';
    var dot = n.read ? 'read' : '';
    var tarih = _notifTarih(n.createdAt);
    var yeni = n.read ? '' : '<span style="font-size:0.65rem;font-weight:800;color:var(--accent);background:var(--accent)22;padding:2px 7px;border-radius:99px">YENİ</span>';
    return '<div class="notif-item ' + unread + '" onclick="_notifTiklandi(' + i + ')" style="cursor:pointer;display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border)22">'
      + '<div class="notif-dot ' + dot + '"></div>'
      + '<div style="flex:1;min-width:0">'
      + '<div class="notif-text">' + escHTML(n.text) + '</div>'
      + '<div style="font-size:0.72rem;color:var(--text2);margin-top:3px">' + tarih + '</div>'
      + '</div>'
      + '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0">' + yeni
      + '<span style="color:var(--text2);font-size:0.9rem">></span></div>'
      + '</div>';
  }).join('');

  const temizleBtn = taskNotifs.length > 0
    ? '<button onclick="bildirimleriTemizle()" style="background:none;border:1px solid #ff658440;color:#ff6584;font-size:0.75rem;font-weight:700;padding:5px 12px;border-radius:20px;cursor:pointer">Temizle</button>'
    : '';

  const bosEkran = '<div style="text-align:center;padding:40px;color:var(--text2)"><div style="font-size:2.5rem;margin-bottom:12px">🔔</div><div>Henuz bildirim yok</div></div>';

  var html = '<div class="page-title">Bildirimler</div>'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">'
    + '<div class="page-sub" style="margin:0">Gorev ve sistem bildirimleri</div>'
    + temizleBtn + '</div>'
    + '<div class="card" style="padding:0;overflow:hidden">'
    + (taskNotifs.length === 0 ? bosEkran : rows)
    + '</div>'
    + '<div style="text-align:center;margin-top:12px;font-size:0.8rem;color:var(--text2)">'
    + 'Mesaj bildirimleri icin <button onclick="showPage(&quot;messages&quot;)" style="background:none;border:none;color:var(--accent);cursor:pointer;font-weight:700">Mesajlar</button> bolumune git</div>';

  window._notifTiklandi = function(idx) {
    var allNotifs = currentRole === 'teacher' ? teacherNotifs : studentNotifs;
    var tNotifs = allNotifs.filter(function(n) { return n.type !== 'message'; });
    var n = tNotifs[idx];
    if (!n) return;
    n.read = true;
    if (n.id) db.collection('notifications').doc(n.id).update({read:true}).catch(function(){});
    updateNotifBadge();
    _notifNavigate(n);
  };

  setTimeout(function() {
    taskNotifs.forEach(function(n) { n.read = true; });
    if (myUid) {
      taskNotifs.filter(function(n) { return n.id; }).forEach(function(n) {
        db.collection('notifications').doc(n.id).update({read:true}).catch(function(){});
      });
    }
    updateNotifBadge();
    document.querySelectorAll('.notif-item.unread').forEach(function(el) {
      el.classList.remove('unread');
      var dot = el.querySelector('.notif-dot');
      if (dot) dot.classList.add('read');
      var spans = el.querySelectorAll('span');
      spans.forEach(function(s) { if (s.textContent === 'YENİ') s.remove(); });
    });
  }, 800);

  _eskiBildirimleriSil(myUid);

  return html;
}

let notifUnsubscribe = null;

function startNotifListener() {
  const myUid = (window.currentUserData||{}).uid || '';
  if (!myUid) return;
  if (notifUnsubscribe) { notifUnsubscribe(); notifUnsubscribe = null; }
  // FCM push token kayıt — sadece öğrenci için
  if (currentRole === 'student') {
    registerFCMToken(myUid);
  }
  try {
    notifUnsubscribe = db.collection('notifications')
      .where('toUid','==',myUid)
      .onSnapshot(snap => {
        const notifs = [];
        snap.forEach(d => notifs.push({ ...d.data(), id: d.id }));
        notifs.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
        // Eğer local'de okundu işaretlediysek Firestore gecikmeli güncelleme gelebilir
        // Bu yüzden local read:true olanları koru
        const prevNotifs = currentRole==='teacher' ? teacherNotifs : studentNotifs;
        const localReadIds = new Set(prevNotifs.filter(n=>n.read).map(n=>n.id));
        notifs.forEach(n => { if(localReadIds.has(n.id)) n.read = true; });
        if (currentRole === 'teacher') teacherNotifs = notifs;
        else studentNotifs = notifs;
        updateNotifBadge();
      }, () => loadNotificationsOnce());
  } catch(e) { loadNotificationsOnce(); }
}

// FCM Push Token Kaydı
const VAPID_KEY = 'BNbQhKCJmfDzfz_U9lL2L2t3WgfBhsLVqJpzYGnT5K8vR2mX4eQwYzN6oP1rD3sH7iM9aK5fE8cJ2nW0tI4u';

async function registerFCMToken(uid) {
  try {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    // Service Worker kayıt
    const reg = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
    const messaging = firebase.messaging();
    // İzin iste (henüz verilmediyse)
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    // Token al
    const token = await messaging.getToken({ 
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: reg
    });
    if (!token) return;
    // Mevcut token ile aynıysa kaydetme
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.data()?.fcmToken === token) return;
    // Firestore'a kaydet
    await db.collection('users').doc(uid).update({ fcmToken: token });
    window._fcmToken = token;
  } catch(e) {
    // Sessiz hata — bildirim desteklenmiyor veya reddedildi
  }
}

async function loadNotificationsOnce() {
  const myUid = (window.currentUserData||{}).uid || '';
  if (!myUid) return;
  try {
    const snap = await db.collection('notifications').where('toUid','==',myUid).get();
    const notifs = [];
    snap.forEach(d => notifs.push({ ...d.data(), id: d.id }));
    notifs.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    if (currentRole === 'teacher') teacherNotifs = notifs;
    else studentNotifs = notifs;
    updateNotifBadge();
  } catch(e) { console.log('Bildirim hatası:', e.message); }
}

// Geriye dönük uyumluluk için alias
async function loadNotifications() { loadNotificationsOnce(); }

function updateNotifBadge() {
  const notifs = currentRole === 'teacher' ? teacherNotifs : studentNotifs;
  // Görev/sistem bildirimleri → header zil ikonu
  const unreadTask = notifs.filter(n => !n.read && n.type !== 'message').length;
  const badge = document.getElementById('notifBadge');
  if (badge) {
    if (unreadTask > 0) {
      badge.textContent = unreadTask > 9 ? '9+' : String(unreadTask);
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
  // Mobile nav'ı yenile (mesaj badge dahil)
  renderMobileNav();
}

/* =================== HELPERS =================== */
