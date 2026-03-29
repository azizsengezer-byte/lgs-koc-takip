// ============================================================
// 🔔 BİLDİRİM SİSTEMİ
// ============================================================

// Merkezi bildirim gönderme fonksiyonu
async function sendNotif(toUid, text, type, fromUid) {
  if (!toUid || !db) return;
  try {
    await db.collection('notifications').add({
      toUid,
      fromUid: fromUid || (window.currentUserData||{}).uid || '',
      text,
      type,
      read: false,
      time: new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch(e) { console.log('Bildirim gönderilemedi:', e.message); }
}

// ── 1. MESAJ BİLDİRİMİ ──────────────────────────────────────
// messages.js'deki sendMessage fonksiyonundan çağrılır
// Zaten mevcut, burada sadece dokümantasyon amaçlı

// ── 2. GÖREV BİLDİRİMİ ──────────────────────────────────────
// Koç yeni görev atayınca öğrenciye bildirim
async function gorevBildirimiGonder(studentUid, studentName, taskTitle) {
  await sendNotif(
    studentUid,
    `📋 Koçun yeni görev atadı: "${taskTitle}"`,
    'task'
  );
}

// ── 3. ROZET BİLDİRİMİ ──────────────────────────────────────
// checkBadges'dan rozet kazanılınca çağrılır
async function rozetBildirimiGonder(badge) {
  const myUid = (window.currentUserData||{}).uid;
  if (!myUid) return;
  await sendNotif(
    myUid,
    `🏆 Yeni rozet kazandın: "${badge.name}"! ${badge.desc}`,
    'badge',
    myUid
  );
}

// ── 4. DENEME BİLDİRİMİ ──────────────────────────────────────
// Öğrenci deneme girince koça bildirim
async function denemeBildirimiGonder(teacherId, studentName, examTitle, puan) {
  if (!teacherId) return;
  await sendNotif(
    teacherId,
    `🎯 ${studentName} deneme girdi: "${examTitle}"${puan ? ' — ' + puan + ' puan' : ''}`,
    'exam'
  );
}

// ── 5. WELLNESS BİLDİRİMLERİ ─────────────────────────────────
// Kaygı 8+ → koça bildirim
async function kaygiBildirimiGonder(kaygiSkor) {
  if (kaygiSkor < 8) return;
  const myData = window.currentUserData || {};
  const teacherId = myData.teacherId;
  if (!teacherId) return;
  await sendNotif(
    teacherId,
    `⚠️ ${myData.name || 'Öğrenci'} bugün kaygı skoru ${kaygiSkor}/10 girdi. Takip önerilir.`,
    'wellness_alert'
  );
}

// Uyku 5 saat altı → öğrenciye bildirim
async function uykuBildirimiGonder(uykuSaat) {
  if (uykuSaat >= 5) return;
  const myUid = (window.currentUserData||{}).uid;
  if (!myUid) return;
  // Bugün zaten gönderildi mi?
  const todayKey = getTodayKey();
  const key = 'uykuBildirim_' + todayKey;
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, '1');
  await sendNotif(
    myUid,
    `💙 Az uyku beyin kapasiteni %40 düşürüyor. Bugün hafif çalış ve erken uyu.`,
    'wellness_sleep',
    myUid
  );
}

// ── 6. ÇALIŞMA HATIRLATMA ────────────────────────────────────
// Uygulama açılınca kontrol edilir
// Bugün hiç giriş yapılmadıysa akşam 20:00 sonrası bildirim
async function calismaHatirlatmakontrol() {
  const myUid = (window.currentUserData||{}).uid;
  if (!myUid || currentRole !== 'student') return;

  const now = new Date();
  const saat = now.getHours();
  if (saat < 20) return; // 20:00'den önce kontrol etme

  const todayKey = getTodayKey();
  const key = 'hatirlatBildirim_' + todayKey;
  if (localStorage.getItem(key)) return; // Bugün zaten gönderildi

  const bugunGiris = studyEntries.some(e => e.dateKey === todayKey);
  if (bugunGiris) return; // Zaten giriş var

  localStorage.setItem(key, '1');
  await sendNotif(
    myUid,
    `📚 Bugün henüz çalışma girişin yok. 10 dakikan varsa bile kayıt edebilirsin!`,
    'reminder',
    myUid
  );
}

// ── 7. 2 GÜN ÇALIŞMA YOK ─────────────────────────────────────
async function ikiGunKontrol() {
  const myUid = (window.currentUserData||{}).uid;
  if (!myUid || currentRole !== 'student') return;

  const key = 'ikiGunBildirim_' + getTodayKey();
  if (localStorage.getItem(key)) return;

  // Son 2 günde giriş var mı?
  const son2Gun = [];
  for (let i = 1; i <= 2; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    son2Gun.push(getDateKey(d));
  }
  const varMi = studyEntries.some(e => son2Gun.includes(e.dateKey));
  if (varMi) return;

  localStorage.setItem(key, '1');
  await sendNotif(
    myUid,
    `⏰ 2 gündür çalışma girişin yok. Devam etmek ister misin?`,
    'reminder',
    myUid
  );
}

// ── 8. HAFTA SONU MOTİVASYON ─────────────────────────────────
async function haftaSonuBildirimiKontrol() {
  const myUid = (window.currentUserData||{}).uid;
  if (!myUid || currentRole !== 'student') return;

  const now = new Date();
  const gun = now.getDay(); // 6=Cumartesi, 0=Pazar
  const saat = now.getHours();
  if (gun !== 6 && gun !== 0) return;
  if (saat < 9 || saat > 12) return; // 09:00-12:00 arası

  const key = 'haftaSonuBildirim_' + getTodayKey();
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, '1');

  const myData = window.currentUserData || {};
  const isim = (myData.name || 'Öğrenci').split(' ')[0];

  if (gun === 6) {
    await sendNotif(
      myUid,
      `🌟 Günaydın ${isim}! Cumartesi sabahı 30 dakika çalışmak haftalık ortalamanı ciddi yükseltir.`,
      'motivation',
      myUid
    );
  } else {
    // Pazar: haftalık özet
    const buHafta = studyEntries.filter(e => {
      const d = new Date(e.dateKey);
      const simdi = new Date();
      const fark = (simdi - d) / (1000*60*60*24);
      return fark <= 7 && e.type === 'soru';
    });
    const toplamQ = buHafta.reduce((a,e) => a+(e.questions||0), 0);
    const toplamD = buHafta.reduce((a,e) => a+(e.correct||0), 0);
    const isabet = toplamQ > 0 ? Math.round(toplamD/toplamQ*100) : 0;

    await sendNotif(
      myUid,
      `📊 Bu hafta ${toplamQ} soru çözdün, %${isabet} isabet oranıyla. Harika gidiyorsun!`,
      'weekly_summary',
      myUid
    );
  }
}

// ── ANA KONTROL FONKSİYONU ────────────────────────────────────
// Uygulama açılınca çağrılır
async function bildirimKontrolleriniCalistir() {
  try {
    await calismaHatirlatmakontrol();
    await ikiGunKontrol();
    await haftaSonuBildirimiKontrol();
  } catch(e) {
    console.log('Bildirim kontrol hatası:', e.message);
  }
}
