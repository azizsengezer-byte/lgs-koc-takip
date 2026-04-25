// ============================================================
// 🔔 BİLDİRİM SİSTEMİ
// ============================================================

// Merkezi bildirim gönderme fonksiyonu
async function sendNotif(toUid, text, type, fromUid, meta) {
  if (!toUid || !db) return;
  try {
    await db.collection('notifications').add({
      toUid,
      fromUid: fromUid || (window.currentUserData||{}).uid || '',
      text,
      type,
      actionUrl: meta?.actionUrl || '',
      meta: meta || {},
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
    'task',
    null,
    { actionUrl: '/?p=my-tasks' }
  );
}

// ── GÖREV HATIRLATMA BİLDİRİMİ ──────────────────────────────
async function gorevHatirlatGonder(taskId, idx, btn) {
  const task = tasks[idx];
  if (!task) return;
  const sObj = students.find(s => s.name === (task.studentName || task.student || ''));
  if (!sObj?.uid) { showToast('⚠️', 'Öğrenci bulunamadı.'); return; }

  // Spam koruması — aynı görev için 1 saat içinde tekrar gönderme
  const cacheKey = '_hatirlatma_' + (taskId || idx);
  const lastSent = parseInt(localStorage.getItem(cacheKey) || '0');
  const sinceMin = (Date.now() - lastSent) / 60000;
  if (sinceMin < 60) {
    showToast('⏳', `Son hatırlatmadan bu yana ${Math.floor(sinceMin)} dakika geçti. Biraz bekle.`);
    return;
  }

  const teacherName = (window.currentUserData?.name || 'Koçun').split(' ')[0];
  await sendNotif(
    sObj.uid,
    `🔔 ${teacherName} seni hatırlattı: "${task.title}" görevi hâlâ bekliyor!`,
    'task',
    (window.currentUserData || {}).uid,
    { actionUrl: '/?p=my-tasks' }
  );

  localStorage.setItem(cacheKey, Date.now().toString());
  if (btn) { btn.style.color = '#00b894'; btn.style.background = 'rgba(0,184,148,.15)'; }
  showToast('🔔', `${sObj.name.split(' ')[0]}'e hatırlatma gönderildi!`);
}


// checkBadges'dan rozet kazanılınca çağrılır
async function rozetBildirimiGonder(badge) {
  const myUid = (window.currentUserData||{}).uid;
  if (!myUid) return;
  await sendNotif(
    myUid,
    `🏆 Yeni rozet kazandın: "${badge.name}"! ${badge.desc}`,
    'badge',
    myUid,
    { actionUrl: `/?p=badges&highlight=${encodeURIComponent(badge.name)}`, badgeName: badge.name }
  );
}

// ── 4. DENEME BİLDİRİMİ ──────────────────────────────────────
// Öğrenci deneme girince koça bildirim
async function denemeBildirimiGonder(teacherId, studentName, examTitle, puan) {
  if (!teacherId) return;
  await sendNotif(
    teacherId,
    `🎯 ${studentName} deneme girdi: "${examTitle}"${puan ? ' — ' + puan + ' puan' : ''}`,
    'exam',
    (window.currentUserData||{}).uid,
    { actionUrl: `/?p=student-detail&s=${encodeURIComponent(studentName)}`, studentName }
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
    'wellness_alert',
    myData.uid,
    { actionUrl: `/?p=student-detail&s=${encodeURIComponent(myData.name||'')}`, studentName: myData.name||'' }
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
    myUid,
    { actionUrl: '/?p=wellness' }
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
    myUid,
    { actionUrl: '/?p=daily-entry' }
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
    myUid,
    { actionUrl: '/?p=daily-entry' }
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
      myUid,
      { actionUrl: '/?p=daily-entry' }
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
      myUid,
      { actionUrl: '/?p=my-analysis' }
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

// ── ÖĞRETMEN DUYURU SİSTEMİ ─────────────────────────────────
function openDuyuruModal() {
  const mevcut = document.getElementById('teacherDuyuruModal');
  if (mevcut) mevcut.remove();

  const modal = document.createElement('div');
  modal.id = 'teacherDuyuruModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;justify-content:center';
  modal.innerHTML = `
    <div style="width:100%;max-width:480px;background:var(--bg);border-radius:20px 20px 0 0;padding:20px 16px 32px;box-shadow:0 -8px 32px rgba(0,0,0,0.2)">
      <div style="width:36px;height:4px;background:var(--border);border-radius:99px;margin:0 auto 16px"></div>
      <div style="font-size:1rem;font-weight:800;color:var(--text);margin-bottom:4px">📢 Öğrencilere Duyuru</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:16px">Tüm öğrencilerin bildirim kutusuna gönderilir</div>

      <!-- Alıcı seçimi -->
      <div style="margin-bottom:12px">
        <div style="font-size:0.72rem;font-weight:700;color:var(--text2);margin-bottom:6px">KİME</div>
        <div style="display:flex;gap:8px">
          <button id="dAliciHepsi" onclick="_dAliciSec('hepsi')"
            style="flex:1;padding:8px;border-radius:10px;border:2px solid var(--accent);background:var(--accent);color:#fff;font-weight:700;font-size:0.8rem;cursor:pointer">
            👥 Tüm Öğrenciler
          </button>
          <button id="dAliciSec" onclick="_dAliciSec('sec')"
            style="flex:1;padding:8px;border-radius:10px;border:2px solid var(--border);background:var(--surface2);color:var(--text2);font-weight:700;font-size:0.8rem;cursor:pointer">
            🎯 Seç
          </button>
        </div>
        <div id="dOgrenciListesi" style="display:none;margin-top:8px;max-height:120px;overflow-y:auto;border:1px solid var(--border);border-radius:10px">
          ${(window.students||[]).map(s => `
            <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border)11">
              <input type="checkbox" value="${s.uid}" data-name="${s.name}" style="accent-color:var(--accent)">
              <div style="width:28px;height:28px;border-radius:50%;background:${s.color}20;color:${s.color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0">${s.name[0]}</div>
              <span style="font-size:0.83rem;color:var(--text);font-weight:600">${s.name}</span>
            </label>`).join('')}
        </div>
      </div>

      <!-- Emoji -->
      <div style="margin-bottom:10px">
        <div style="font-size:0.72rem;font-weight:700;color:var(--text2);margin-bottom:6px">EMOJİ</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${['📢','⚠️','🎯','📅','🏆','💪','📝','🔔','❗','✅'].map(e =>
            `<button onclick="_dEmojiSec(this,'${e}')" style="font-size:1.2rem;padding:6px 8px;border-radius:8px;border:2px solid var(--border);background:var(--surface2);cursor:pointer">${e}</button>`
          ).join('')}
        </div>
      </div>

      <!-- Başlık -->
      <div style="margin-bottom:10px">
        <div style="font-size:0.72rem;font-weight:700;color:var(--text2);margin-bottom:6px">BAŞLIK</div>
        <input id="dBaslik" type="text" maxlength="60" placeholder="örn: Yarın deneme sınavı var!"
          style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:0.85rem;box-sizing:border-box">
      </div>

      <!-- Mesaj -->
      <div style="margin-bottom:16px">
        <div style="font-size:0.72rem;font-weight:700;color:var(--text2);margin-bottom:6px">MESAJ <span style="color:var(--text2);font-weight:400">(isteğe bağlı)</span></div>
        <textarea id="dMesaj" maxlength="300" rows="3" placeholder="Detayları buraya yaz..."
          style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:0.83rem;box-sizing:border-box;resize:none;font-family:inherit"></textarea>
      </div>

      <div id="dHata" style="display:none;color:#ff6584;font-size:0.78rem;margin-bottom:10px;text-align:center"></div>

      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('teacherDuyuruModal').remove()"
          style="flex:1;padding:12px;border-radius:12px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-weight:700;cursor:pointer">İptal</button>
        <button id="dGonderBtn" onclick="teacherDuyuruGonder()"
          style="flex:2;padding:12px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-weight:800;cursor:pointer;font-size:0.9rem">📨 Gönder</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

  // İlk emoji seçili gelsin
  window._dSeciliEmoji = '📢';
  window._dAliciMod = 'hepsi';
  modal.querySelector('button[style*="1.2rem"]').style.borderColor = 'var(--accent)';
}

window._dAliciSec = function(mod) {
  window._dAliciMod = mod;
  const liste = document.getElementById('dOgrenciListesi');
  const btnHepsi = document.getElementById('dAliciHepsi');
  const btnSec = document.getElementById('dAliciSec');
  if (mod === 'hepsi') {
    liste.style.display = 'none';
    btnHepsi.style.background = 'var(--accent)';
    btnHepsi.style.color = '#fff';
    btnHepsi.style.borderColor = 'var(--accent)';
    btnSec.style.background = 'var(--surface2)';
    btnSec.style.color = 'var(--text2)';
    btnSec.style.borderColor = 'var(--border)';
  } else {
    liste.style.display = 'block';
    btnSec.style.background = 'var(--accent)';
    btnSec.style.color = '#fff';
    btnSec.style.borderColor = 'var(--accent)';
    btnHepsi.style.background = 'var(--surface2)';
    btnHepsi.style.color = 'var(--text2)';
    btnHepsi.style.borderColor = 'var(--border)';
  }
};

window._dEmojiSec = function(btn, emoji) {
  window._dSeciliEmoji = emoji;
  document.querySelectorAll('#teacherDuyuruModal button[style*="1.2rem"]').forEach(b => {
    b.style.borderColor = 'var(--border)';
    b.style.background = 'var(--surface2)';
  });
  btn.style.borderColor = 'var(--accent)';
  btn.style.background = 'var(--accent)20';
};

async function teacherDuyuruGonder() {
  const baslik = document.getElementById('dBaslik')?.value.trim();
  const mesaj  = document.getElementById('dMesaj')?.value.trim();
  const hataEl = document.getElementById('dHata');
  const btn    = document.getElementById('dGonderBtn');
  const emoji  = window._dSeciliEmoji || '📢';

  if (!baslik) { hataEl.textContent = 'Başlık zorunludur.'; hataEl.style.display = 'block'; return; }
  if (baslik.length > 60) { hataEl.textContent = 'Başlık en fazla 60 karakter.'; hataEl.style.display = 'block'; return; }

  // Alıcıları belirle
  let alicilar = [];
  if (window._dAliciMod === 'hepsi') {
    alicilar = (window.students || []).filter(s => s.uid).map(s => ({ uid: s.uid, name: s.name }));
  } else {
    document.querySelectorAll('#dOgrenciListesi input:checked').forEach(cb => {
      alicilar.push({ uid: cb.value, name: cb.dataset.name });
    });
  }

  if (alicilar.length === 0) { hataEl.textContent = 'En az bir öğrenci seçilmeli.'; hataEl.style.display = 'block'; return; }

  btn.textContent = '⏳ Gönderiliyor...';
  btn.disabled = true;
  hataEl.style.display = 'none';

  const ogretmenAdi = (window.currentUserData?.name || 'Koçun').split(' ')[0];
  const bildirimMetni = emoji + ' ' + baslik + (mesaj ? '\n' + mesaj : '');
  const teacherUid = window.currentUserData?.uid || '';

  try {
    const batch = db.batch();
    alicilar.forEach(a => {
      const ref = db.collection('notifications').doc();
      batch.set(ref, {
        toUid: a.uid,
        text: bildirimMetni,
        type: 'teacher_duyuru',
        baslik,
        mesaj: mesaj || '',
        emoji,
        ogretmenAdi,
        fromUid: teacherUid,
        read: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
    document.getElementById('teacherDuyuruModal').remove();
    showToast('📢', `Duyuru ${alicilar.length} öğrenciye gönderildi!`);
  } catch(e) {
    btn.textContent = '📨 Gönder';
    btn.disabled = false;
    hataEl.textContent = 'Gönderilemedi, tekrar dene.';
    hataEl.style.display = 'block';
  }
}
