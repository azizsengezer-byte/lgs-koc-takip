// ============================================================
// 🛒 MARKET SİSTEMİ — Koloni Temalı
// Etiketler, koloni temaları, efektler, boost, profil
// ============================================================

const MARKET_URUNLER = {
  // ── Etiketler (profilde isim yanında görünür) ──────────
  etiket_caliskan:  { kategori:'etiket', ad:'🔥 Çalışkan',   fiyat:300, ikon:'🔥', aciklama:'İsmin yanında 🔥 Çalışkan etiketi',    tip:'etiket', deger:'🔥 Çalışkan' },
  etiket_hizli:     { kategori:'etiket', ad:'⚡ Hızlı',      fiyat:300, ikon:'⚡', aciklama:'İsmin yanında ⚡ Hızlı etiketi',       tip:'etiket', deger:'⚡ Hızlı' },
  etiket_efsane:    { kategori:'etiket', ad:'👑 Efsane',     fiyat:800, ikon:'👑', aciklama:'İsmin yanında 👑 Efsane etiketi',      tip:'etiket', deger:'👑 Efsane' },
  etiket_elit:      { kategori:'etiket', ad:'💎 Elit',       fiyat:600, ikon:'💎', aciklama:'İsmin yanında 💎 Elit etiketi',        tip:'etiket', deger:'💎 Elit' },
  etiket_kahraman:  { kategori:'etiket', ad:'🦸 Kahraman',   fiyat:400, ikon:'🦸', aciklama:'İsmin yanında 🦸 Kahraman etiketi',    tip:'etiket', deger:'🦸 Kahraman' },
  etiket_bilge:     { kategori:'etiket', ad:'🦉 Bilge',      fiyat:350, ikon:'🦉', aciklama:'İsmin yanında 🦉 Bilge etiketi',       tip:'etiket', deger:'🦉 Bilge' },
  etiket_ates:      { kategori:'etiket', ad:'🌋 Ateş Kalbi', fiyat:500, ikon:'🌋', aciklama:'İsmin yanında 🌋 Ateş Kalbi etiketi', tip:'etiket', deger:'🌋 Ateş Kalbi' },
  etiket_astronot:  { kategori:'etiket', ad:'🚀 Astronot',   fiyat:500, ikon:'🚀', aciklama:'İsmin yanında 🚀 Astronot etiketi',    tip:'etiket', deger:'🚀 Astronot' },
  etiket_bilgin:    { kategori:'etiket', ad:'🔬 Bilgin',     fiyat:450, ikon:'🔬', aciklama:'İsmin yanında 🔬 Bilgin etiketi',      tip:'etiket', deger:'🔬 Bilgin' },
  etiket_komutan:   { kategori:'etiket', ad:'⭐ Komutan',    fiyat:700, ikon:'⭐', aciklama:'İsmin yanında ⭐ Komutan etiketi',      tip:'etiket', deger:'⭐ Komutan' },

  // ── Koloni Temaları (koloni sahnesinin renk paleti) ────
  tema_mars:    { kategori:'tema', ad:'Mars Kolonisi',    fiyat:600, ikon:'🔴', aciklama:'Koloni sahnesini kızıl Mars temasına çevir',    tip:'tema', deger:'mars' },
  tema_buz:     { kategori:'tema', ad:'Buz Gezegeni',     fiyat:600, ikon:'❄️', aciklama:'Koloni sahnesini buz mavisi temasına çevir',   tip:'tema', deger:'buz' },
  tema_orman:   { kategori:'tema', ad:'Yeşil Gezegen',    fiyat:550, ikon:'🌲', aciklama:'Koloni sahnesini yeşil orman temasına çevir',  tip:'tema', deger:'orman' },
  tema_nebula:  { kategori:'tema', ad:'Nebula',           fiyat:700, ikon:'🌌', aciklama:'Koloni sahnesini mor nebula temasına çevir',   tip:'tema', deger:'nebula' },
  tema_altin:   { kategori:'tema', ad:'Altın Çağ',        fiyat:800, ikon:'✨', aciklama:'Koloni sahnesini altın temasına çevir',       tip:'tema', deger:'altin' },
  tema_karanlik:{ kategori:'tema', ad:'Karanlık Madde',   fiyat:650, ikon:'🌑', aciklama:'Koloni sahnesini derin uzay temasına çevir',  tip:'tema', deger:'karanlik' },

  // ── Koloni İsimlendirme ────────────────────────────────
  koloni_isim:  { kategori:'koloni', ad:'Koloni İsmi Değiştir', fiyat:200, ikon:'✏️', aciklama:'Kolonine özel bir isim ver', tip:'isim', deger:'', tuket:true },

  // ── Efektler (soru girişinde animasyon) ────────────────
  efekt_konfeti: { kategori:'efekt', ad:'Konfeti',        fiyat:400, ikon:'🎊', aciklama:'Soru girişinde konfeti patlar',      tip:'efekt', deger:'konfeti' },
  efekt_yildiz:  { kategori:'efekt', ad:'Yıldız Yağmuru', fiyat:500, ikon:'⭐', aciklama:'Soru girişinde yıldızlar yağar',    tip:'efekt', deger:'yildiz' },
  efekt_kalp:    { kategori:'efekt', ad:'Kalp Yağmuru',   fiyat:350, ikon:'💜', aciklama:'Soru girişinde kalpler uçar',       tip:'efekt', deger:'kalp' },
  efekt_altin:   { kategori:'efekt', ad:'Altın Patlama',  fiyat:550, ikon:'💰', aciklama:'Soru girişinde altınlar yağar',     tip:'efekt', deger:'altin' },
  efekt_roket:   { kategori:'efekt', ad:'Roket Fırlatma', fiyat:600, ikon:'🚀', aciklama:'Soru girişinde roket fırlar',       tip:'efekt', deger:'roket' },

  // ── XP Paketleri ──────────────────────────────────────────
  xp_kucuk:  { kategori:'xp', ad:'50 XP Paketi',   fiyat:300,  ikon:'⚡', aciklama:'Kolonine anında 50 XP ekle',   tip:'xp', deger:50,  tuket:true },
  xp_orta:   { kategori:'xp', ad:'150 XP Paketi',  fiyat:800,  ikon:'🚀', aciklama:'Kolonine anında 150 XP ekle',  tip:'xp', deger:150, tuket:true },
  xp_buyuk:  { kategori:'xp', ad:'400 XP Paketi',  fiyat:2000, ikon:'🌟', aciklama:'Kolonine anında 400 XP ekle',  tip:'xp', deger:400, tuket:true },

  // ── Güçlendiriciler (süreli, tüketilir) ────────────────
  boost_seri:    { kategori:'boost', ad:'Seri Koruyucu',  fiyat:500,  ikon:'🛡️', aciklama:'1 gün çalışmasan serin bozulmaz',     tip:'boost', deger:'seri',    tuket:true },
  boost_2x:      { kategori:'boost', ad:'2x Altın (24s)', fiyat:400,  ikon:'💰', aciklama:'24 saat boyunca 2 katı altın kazan',  tip:'boost', deger:'2x',      tuket:true },
  boost_3x_soru: { kategori:'boost', ad:'3x Soru Altın',  fiyat:600,  ikon:'🎯', aciklama:'24 saat soru başına 3x altın',        tip:'boost', deger:'3x_soru', tuket:true },
  boost_2x_xp:   { kategori:'boost', ad:'2x Koloni XP',   fiyat:500,  ikon:'🚀', aciklama:'24 saat koloni XP 2 katına çıkar',    tip:'boost', deger:'2x_xp',   tuket:true },
};

const MARKET_KATEGORILER = [
  { id:'etiket', ad:'👤 Etiket'        },
  { id:'tema',   ad:'🎨 Koloni Tema'   },
  { id:'efekt',  ad:'✨ Efektler'      },
  { id:'boost',  ad:'⚡ Güçlendirici'  },
  { id:'xp',     ad:'⭐ XP Paketi'     },
  { id:'koloni', ad:'🚀 Koloni'        },
];

const MARKET_ALTIN = { MOOD: 20, WELLNESS_TAM: 50, WELLNESS_ALAN: 20, SORU_10: 5, SERI_7: 100 };
// MOOD: duygu girişi, WELLNESS_TAM: tüm alanlar dolunca bonus, WELLNESS_ALAN: her alan başına

const _ETIKET_STILLER = {
  '🔥 Çalışkan':  'background:linear-gradient(135deg,#ff4444,#cc1111);color:white;box-shadow:0 2px 8px rgba(255,68,68,0.4)',
  '⚡ Hızlı':     'background:linear-gradient(135deg,#00d2ff,#0099cc);color:white;box-shadow:0 2px 8px rgba(0,210,255,0.3)',
  '👑 Efsane':    'background:linear-gradient(135deg,#f9ca24,#e6a800);color:#1a1200;box-shadow:0 2px 8px rgba(249,202,36,0.4)',
  '💎 Elit':      'background:linear-gradient(135deg,#a855f7,#7c22cc);color:white;box-shadow:0 2px 8px rgba(168,85,247,0.4)',
  '🦸 Kahraman':  'background:linear-gradient(135deg,#ff6b9d,#cc2266);color:white;box-shadow:0 2px 8px rgba(255,107,157,0.35)',
  '🦉 Bilge':     'background:linear-gradient(135deg,#45b7d1,#1a7a99);color:white;box-shadow:0 2px 8px rgba(69,183,209,0.35)',
  '🌋 Ateş Kalbi':'background:linear-gradient(135deg,#ff8c00,#cc4400);color:white;box-shadow:0 2px 8px rgba(255,140,0,0.4)',
  '🚀 Astronot':  'background:linear-gradient(135deg,#185FA5,#378ADD);color:white;box-shadow:0 2px 8px rgba(55,138,221,0.4)',
  '🔬 Bilgin':    'background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;box-shadow:0 2px 8px rgba(124,58,237,0.4)',
  '⭐ Komutan':   'background:linear-gradient(135deg,#f59e0b,#d97706);color:#1a1200;box-shadow:0 2px 8px rgba(245,158,11,0.4)',
};

// ── Altın Ekleme ─────────────────────────────────────────
async function marketAldinEkle(miktar, sebep) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const aktif = window.currentUserData?.aktif || {};
  const x2 = aktif.boost_2x && new Date(aktif.boost_2x) > new Date();
  const x3 = aktif.boost_3x_soru && new Date(aktif.boost_3x_soru) > new Date() && sebep.includes('doğru');
  const carpan = x3 ? 3 : x2 ? 2 : 1;
  const gercek = miktar * carpan;
  const simdiki = window.currentUserData?.altin || 0;
  const yeni = simdiki + gercek;
  window.currentUserData.altin = yeni;
  try {
    await db.collection('users').doc(uid).update({ altin: yeni });
    const div = document.createElement('div');
    div.textContent = '+' + gercek + ' 💰' + (carpan > 1 ? ' (' + carpan + 'x!)' : '');
    div.style.cssText = 'position:fixed;top:60px;right:16px;background:#2a2000;border:1.5px solid #f9ca24;color:#f9ca24;font-weight:900;font-size:.9rem;padding:8px 16px;border-radius:99px;z-index:9999;pointer-events:none;animation:mFadeUp 1.2s forwards';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1300);
  } catch (e) { console.error(e); }
}

// ── Satın Alma ───────────────────────────────────────────
async function marketSatinAl(urunId) {
  const urun = MARKET_URUNLER[urunId];
  if (!urun) { showToast('⚠️', 'Ürün bulunamadı'); return; }
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const altin = window.currentUserData?.altin || 0;
  if (altin < urun.fiyat) { showToast('⚠️', 'Yeterli altın yok! (' + urun.fiyat + ' gerekli)'); return; }

  // Zaten sahip mi?
  const sahip = window.currentUserData?.sahipUrunler || [];
  if (sahip.includes(urunId) && !urun.tuket) { showToast('ℹ️', 'Bu ürün zaten sende var'); return; }

  const yeniAltin = altin - urun.fiyat;
  window.currentUserData.altin = yeniAltin;
  if (!window.currentUserData.sahipUrunler) window.currentUserData.sahipUrunler = [];
  if (!urun.tuket) window.currentUserData.sahipUrunler.push(urunId);

  try {
    const update = { altin: yeniAltin };
    if (!urun.tuket) update.sahipUrunler = firebase.firestore.FieldValue.arrayUnion(urunId);

    // Tüketilir boost → bitiş zamanı kaydet
    if (urun.tuket) {
      const bitis = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      if (!window.currentUserData.aktif) window.currentUserData.aktif = {};
      window.currentUserData.aktif[urunId] = bitis;
      update['aktif.' + urunId] = bitis;
    }

    await db.collection('users').doc(uid).update(update);
    showToast('✅', urun.ad + ' satın alındı!');

    // Özel işlemler
    if (urun.tip === 'etiket') _mEtiketUygula(urun.deger);
    if (urun.tip === 'isim') {
      // Altın düş, isim modalını aç — ama sahipUrunler'e ekleme (tekrar kullanılabilir)
      window.currentUserData.altin = altin - urun.fiyat;
      try { await db.collection('users').doc(uid).update({ altin: window.currentUserData.altin }); } catch(e) {}
      _mKoloniIsimVer();
      _marketYenile();
      return;
    }
    if (urun.tip === 'tema') _mKoloniTemaUygula(urun.deger);

    _marketYenile();
  } catch (e) {
    showToast('❌', 'Satın alma başarısız: ' + e.message);
    window.currentUserData.altin = altin; // geri al
  }
}

// ── Aktif Et (zaten sahip olunan ürün) ───────────────────
async function marketAktifEt(urunId) {
  const urun = MARKET_URUNLER[urunId];
  if (!urun) return;
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  if (urun.tip === 'xp') {
    const colData = loadColonyData();
    const eskiXp = colData.xp || 0;
    const eskiSeviye = colData.level || 1;
    colData.xp += urun.deger;
    colData.level = getColonyLevel(colData.xp);
    saveColonyData(colData);
    const seviyeAtladi = colData.level > eskiSeviye;
    showToast('⭐', '+' + urun.deger + ' XP kolonine eklendi!' + (seviyeAtladi ? ' Seviye atladın!' : ''));
    _marketYenile();
    return;
  }
  if (urun.tip === 'etiket') {
    // Toggle — aynı etiketse kaldır
    if (window.currentUserData?.etiket === urun.deger) {
      _mEtiketSifirla();
      window.currentUserData.etiket = '';
      await db.collection('users').doc(uid).update({ etiket: '' }).catch(() => {});
      showToast('✅', 'Etiket kaldırıldı');
    } else {
      _mEtiketUygula(urun.deger);
      await db.collection('users').doc(uid).update({ etiket: urun.deger }).catch(() => {});
      showToast('✅', urun.ad + ' etiketi aktif!');
    }
  } else if (urun.tip === 'tema') {
    const data = loadColonyData();
    if (data.tema === urun.deger) {
      data.tema = null;
      saveColonyData(data);
      if (typeof _colonyApplyTheme === 'function') _colonyApplyTheme();
      showToast('✅', 'Tema kaldırıldı — varsayılana dönüldü');
    } else {
      _mKoloniTemaUygula(urun.deger);
      if (typeof _colonyApplyTheme === 'function') _colonyApplyTheme();
      showToast('✅', urun.ad + ' teması aktif!');
    }
  } else if (urun.tip === 'efekt') {
    if (!window.currentUserData.aktif) window.currentUserData.aktif = {};
    if (window.currentUserData.aktif.efekt === urun.deger) {
      window.currentUserData.aktif.efekt = null;
      await db.collection('users').doc(uid).update({ 'aktif.efekt': null }).catch(() => {});
      showToast('✅', 'Efekt kaldırıldı');
    } else {
      window.currentUserData.aktif.efekt = urun.deger;
      await db.collection('users').doc(uid).update({ 'aktif.efekt': urun.deger }).catch(() => {});
      showToast('✅', urun.ad + ' efekti aktif!');
    }
  }
  _marketYenile();
}

// ── Etiket Sistemi ───────────────────────────────────────
function _mEtiketUygula(etiket) {
  const stil = _ETIKET_STILLER[etiket] || 'background:rgba(108,99,255,.3);color:white';
  const eskiEl = document.getElementById('_menuEtiket');
  if (eskiEl) eskiEl.remove();
  const nameEl = document.getElementById('menuName');
  if (nameEl) {
    const span = document.createElement('span');
    span.id = '_menuEtiket';
    span.style.cssText = stil + ';font-size:.75rem;font-weight:800;padding:3px 9px;border-radius:99px;margin-left:6px;display:inline-flex;align-items:center;vertical-align:middle';
    span.textContent = etiket;
    nameEl.insertAdjacentElement('afterend', span);
  }
  const uid = auth.currentUser?.uid;
  if (uid) {
    if (window.currentUserData) window.currentUserData.etiket = etiket;
    db.collection('users').doc(uid).update({ etiket }).catch(() => {});
  }
}

function _mEtiketSifirla() {
  const el = document.getElementById('_menuEtiket');
  if (el) el.remove();
}

// ── Koloni İsim Verme ────────────────────────────────────
function _mKoloniIsimVer() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)';
  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:22px;width:100%;max-width:300px;text-align:center">
      <div style="font-size:16px;font-weight:800;margin-bottom:12px">🚀 Koloni İsmi</div>
      <input id="koloniIsimInput" type="text" maxlength="20" placeholder="Yeni isim gir..." style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-size:14px;background:var(--surface2);color:var(--text);font-family:'Nunito',sans-serif;margin-bottom:12px;box-sizing:border-box">
      <button onclick="_mKoloniIsimKaydet()" style="width:100%;padding:10px;background:var(--accent-btn);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">Kaydet</button>
      <button onclick="this.closest('div[style*=fixed]').remove()" style="width:100%;padding:8px;background:transparent;border:1px solid var(--border);border-radius:10px;margin-top:6px;cursor:pointer;color:var(--text);font-family:'Nunito',sans-serif">Vazgeç</button>
    </div>`;
  document.body.appendChild(modal);
}

function _mKoloniIsimKaydet() {
  const input = document.getElementById('koloniIsimInput');
  const isim = input?.value?.trim();
  if (!isim || isim.length < 2) { showToast('⚠️', 'En az 2 karakter gir'); return; }
  const data = loadColonyData();
  data.colonyName = isim;
  saveColonyData(data);
  showToast('✅', 'Koloni ismi: ' + isim);
  const modal = input.closest('div[style*=fixed]');
  if (modal) modal.remove();
}

// ── Koloni Tema Uygulama ─────────────────────────────────
function _mKoloniTemaUygula(tema) {
  const data = loadColonyData();
  data.tema = tema;
  saveColonyData(data);
  // Aktif sahne varsa güncelle
  const scene = document.getElementById('colonyScene');
  if (scene) {
    const temalar = {
      mars:     'linear-gradient(180deg,#1a0505 0%,#3d1010 40%,#5a2020 70%,#7a3030 100%)',
      buz:      'linear-gradient(180deg,#051525 0%,#0a2a4a 40%,#1a4a6a 70%,#2a6a8a 100%)',
      orman:    'linear-gradient(180deg,#050f05 0%,#0a2a0a 40%,#1a4a2a 70%,#2a5a3a 100%)',
      nebula:   'linear-gradient(180deg,#0a0520 0%,#1a0a3a 40%,#3a1a5a 70%,#5a2a7a 100%)',
      altin:    'linear-gradient(180deg,#1a1505 0%,#2a2510 40%,#3a3520 70%,#4a4530 100%)',
      karanlik: 'linear-gradient(180deg,#000005 0%,#050510 40%,#0a0a1a 70%,#101020 100%)',
    };
    if (temalar[tema]) scene.style.background = temalar[tema];
  }
}

// ── Efekt Sistemi ────────────────────────────────────────
function _marketKonfetiEfekt() {
  const aktifEfekt = window.currentUserData?.aktif?.efekt;
  if (!aktifEfekt) return;
  const renkler = {
    konfeti: ['#6c63ff','#f9ca24','#ff6584','#43e97b','#00b4d8','#e879f9'],
    yildiz:  ['#f9ca24','#fde047','#ffec4d','#fff4b0'],
    kalp:    ['#ff6b9d','#e879f9','#f9a8d4','#fda4af'],
    altin:   ['#f9ca24','#d97706','#fde047','#b45309'],
    roket:   ['#378ADD','#ff6584','#f9ca24','#43e97b'],
  };
  const cols = renkler[aktifEfekt] || renkler.konfeti;
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const parts = Array.from({ length: 60 }, () => ({
    x: Math.random() * cv.width, y: -20,
    vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3 + 2,
    color: cols[Math.floor(Math.random() * cols.length)],
    size: Math.random() * 7 + 3, rot: Math.random() * 360,
    rv: (Math.random() - 0.5) * 8
  }));
  let fr = 0;
  const anim = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.rv; p.vy += 0.05;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      if (aktifEfekt === 'kalp') {
        ctx.beginPath(); ctx.arc(-p.size/4, 0, p.size/3, 0, Math.PI*2); ctx.arc(p.size/4, 0, p.size/3, 0, Math.PI*2);
        ctx.fill(); ctx.beginPath(); ctx.moveTo(-p.size/2, 0); ctx.lineTo(0, p.size/2); ctx.lineTo(p.size/2, 0); ctx.fill();
      } else if (aktifEfekt === 'yildiz' || aktifEfekt === 'altin') {
        ctx.beginPath(); for (let i=0;i<5;i++){const a=(i*72-90)*Math.PI/180;const b=((i*72)+36-90)*Math.PI/180;ctx.lineTo(Math.cos(a)*p.size,Math.sin(a)*p.size);ctx.lineTo(Math.cos(b)*p.size/2,Math.sin(b)*p.size/2);} ctx.closePath(); ctx.fill();
      } else { ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2); }
      ctx.restore();
    });
    if (++fr < 100) requestAnimationFrame(anim); else cv.remove();
  };
  requestAnimationFrame(anim);
}

// ── Altın Kazanma Hook'ları ──────────────────────────────
function _marketMoodKontrol() {
  const gun = getTodayKey();
  if (localStorage.getItem('altin_mood_' + gun)) return;
  localStorage.setItem('altin_mood_' + gun, '1');
  marketAldinEkle(MARKET_ALTIN.MOOD, 'Duygu durumu girişi');
}

function _marketWellnessTamKontrol() {
  const gun = getTodayKey();
  const { data } = _getW();
  const bugun = (data.days || {})[gun] || {};
  // Alan başına — her alan günde 1 kez altın verir
  const alanlar = [
    { key: 'mood',   label: 'Duygu girişi' },
    { key: 'uyku',   label: 'Uyku verisi' },
    { key: 'enerji', label: 'Enerji verisi' },
    { key: 'kaygi',  label: 'Kaygı verisi' },
    { key: 'odak',   label: 'Odak verisi' },
  ];
  alanlar.forEach(a => {
    const aKey = 'altin_alan_' + a.key + '_' + gun;
    if (bugun[a.key] && !localStorage.getItem(aKey)) {
      localStorage.setItem(aKey, '1');
      marketAldinEkle(MARKET_ALTIN.WELLNESS_ALAN, a.label);
    }
  });
  // Bonus: tüm 5 alan doluysa
  const tamKey = 'altin_wellness_tam_' + gun;
  if (!localStorage.getItem(tamKey) && alanlar.every(a => bugun[a.key])) {
    localStorage.setItem(tamKey, '1');
    marketAldinEkle(MARKET_ALTIN.WELLNESS_TAM, 'Tam günlük takip bonusu!');
  }
}

function _marketSoruKontrol(dogru) {
  const gun = getTodayKey();
  const key = 'altin_soru_' + gun;
  const onceki = parseInt(localStorage.getItem(key) || '0');
  const yeni = onceki + dogru;
  localStorage.setItem(key, yeni);
  const kazanilan = Math.floor(yeni / 10) - Math.floor(onceki / 10);
  if (kazanilan > 0) marketAldinEkle(kazanilan * MARKET_ALTIN.SORU_10, dogru + ' doğru');
}

// ── Market Sayfası ───────────────────────────────────────
let _marketSeciliKat = 'etiket';

function marketPage() {
  const altin = window.currentUserData?.altin || 0;
  const gun = getTodayKey();
  const soruCount = parseInt(localStorage.getItem('altin_soru_' + gun) || '0');
  // Alan bazlı kontrol
  const alanlar = [
    { key:'mood',   label:'Duygu' },
    { key:'uyku',   label:'Uyku' },
    { key:'enerji', label:'Enerji' },
    { key:'kaygi',  label:'Kaygı' },
    { key:'odak',   label:'Odak' },
  ];
  const alanDurumu = alanlar.map(a => ({
    ...a, done: !!localStorage.getItem('altin_alan_' + a.key + '_' + gun)
  }));
  const tamDone = !!localStorage.getItem('altin_wellness_tam_' + gun);
  const doldurulan = alanDurumu.filter(a => a.done).length;

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div>
        <div class="page-title" style="margin-bottom:0">🛒 Market</div>
        <div class="page-sub">Altınlarınla özel ürünler al</div>
      </div>
      <div id="marketAltinBadge" style="background:linear-gradient(135deg,#2a2000,#3a3000);border:1.5px solid #f9ca24;color:#f9ca24;font-weight:900;font-size:1rem;padding:8px 16px;border-radius:99px;display:flex;align-items:center;gap:5px;box-shadow:0 2px 12px rgba(249,202,36,0.2)">
        💰 <span id="marketAltinGoster">${altin}</span>
      </div>
    </div>

    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:12px 14px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:10px;letter-spacing:0.3px">BUGÜN KAZANDIĞIN ALTIN</div>
      <div style="display:flex;flex-direction:column;gap:7px">

        <!-- Alan bazlı satır -->
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="display:flex;gap:3px">
              ${alanDurumu.map(a => '<div style="width:8px;height:8px;border-radius:50%;background:' + (a.done ? '#1D9E75' : 'var(--border)') + ';title=' + a.label + '"></div>').join('')}
            </div>
            <span style="font-size:12px;color:var(--text2)">Nasıl hissediyorum verisi <span style="color:var(--text);font-weight:700">(${doldurulan}/5)</span></span>
          </div>
          <span style="font-size:12px;font-weight:700;color:#f9ca24">+${MARKET_ALTIN.WELLNESS_ALAN} 💰/alan</span>
        </div>

        <!-- Tam takip bonusu -->
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:22px;height:22px;border-radius:50%;background:${tamDone ? 'rgba(29,158,117,0.2)' : 'var(--surface)'};border:1.5px solid ${tamDone ? '#1D9E75' : 'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:11px">${tamDone ? '✓' : '·'}</div>
            <span style="font-size:12px;color:${tamDone ? 'var(--text)' : 'var(--text2)'}">Tam takip bonusu (5/5 alan)</span>
          </div>
          <span style="font-size:12px;font-weight:700;color:${tamDone ? '#f9ca24' : 'var(--text2)'}">+${MARKET_ALTIN.WELLNESS_TAM} 💰</span>
        </div>

        <!-- Soru -->
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:22px;height:22px;border-radius:50%;background:${soruCount>0?'rgba(55,138,221,0.15)':'var(--surface)'};border:1.5px solid ${soruCount>0?'#378ADD':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${soruCount>0?'#378ADD':'var(--text2)'}">${soruCount}</div>
            <span style="font-size:12px;color:${soruCount>0?'var(--text)':'var(--text2)'}">Soru çözümü (her 10'da)</span>
          </div>
          <span style="font-size:12px;font-weight:700;color:${soruCount>=10?'#f9ca24':'var(--text2)'}">+${MARKET_ALTIN.SORU_10} 💰</span>
        </div>
      </div>
    </div>

    <div id="marketSayfa">${_marketIcerik()}</div>
    <style>
      @keyframes mFadeUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-30px)}}
      @keyframes mPop{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
      #marketAltinBadge.mPop{animation:mPop 0.35s ease}
    </style>
  `;
}

function _marketIcerik() {
  const sahip = window.currentUserData?.sahipUrunler || [];
  const aktif = window.currentUserData?.aktif || {};
  const secili = _marketSeciliKat;
  const colData = loadColonyData();

  // Kategori tabları
  const tabHTML = MARKET_KATEGORILER.map(k => {
    const isActive = secili === k.id;
    // Kategorideki sahip olunan ürün sayısı
    const katSahip = Object.values(MARKET_URUNLER).filter(u => u.kategori === k.id && sahip.includes(Object.keys(MARKET_URUNLER).find(id => MARKET_URUNLER[id] === u))).length;
    return `<button onclick="_marketSeciliKat='${k.id}';_marketYenile()"
      style="position:relative;padding:8px 14px;border-radius:20px;border:1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'};
      background:${isActive ? 'var(--accent)22' : 'var(--surface)'};color:${isActive ? 'var(--accent)' : 'var(--text2)'};
      font-size:0.78rem;font-weight:700;cursor:pointer;white-space:nowrap;font-family:'Nunito',sans-serif;transition:all 0.15s">${k.ad}</button>`;
  }).join('');

  // Ürünler
  const urunler = Object.entries(MARKET_URUNLER).filter(([, u]) => u.kategori === secili);
  const altin = window.currentUserData?.altin || 0;

  const urunHTML = urunler.map(([id, u]) => {
    const sahipMi = sahip.includes(id);
    const aktifMi = (u.tip === 'etiket' && window.currentUserData?.etiket === u.deger)
      || (u.tip === 'tema' && colData.tema === u.deger)
      || (u.tip === 'efekt' && aktif.efekt === u.deger);
    const boostAktif = u.tuket && aktif[id] && new Date(aktif[id]) > new Date();
    const yetersiz = altin < u.fiyat && !sahipMi;

    let butonHTML = '';
    if (aktifMi) {
      butonHTML = `<button onclick="marketAktifEt('${id}')" style="width:100%;padding:9px;background:rgba(29,158,117,0.12);border:1.5px solid #1D9E75;border-radius:10px;color:#1D9E75;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">✓ Aktif — Kaldır</button>`;
    } else if (boostAktif) {
      const kalan = Math.round((new Date(aktif[id]) - new Date()) / 3600000);
      butonHTML = `<div style="padding:9px;text-align:center;font-size:0.78rem;font-weight:700;color:var(--accent);background:var(--accent)11;border-radius:10px;border:1px solid var(--accent)33">⏱ ${kalan}s kaldı</div>`;
    } else if (sahipMi && !u.tuket) {
      butonHTML = `<button onclick="marketAktifEt('${id}')" style="width:100%;padding:9px;background:var(--accent)18;border:1.5px solid var(--accent);border-radius:10px;color:var(--accent);font-size:0.78rem;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">Aktif Et</button>`;
    } else {
      const style = yetersiz
        ? 'width:100%;padding:9px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text2);font-size:0.78rem;font-weight:700;cursor:not-allowed;font-family:\'Nunito\',sans-serif;opacity:0.6'
        : 'width:100%;padding:9px;background:var(--accent-btn);border:none;border-radius:10px;color:white;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:\'Nunito\',sans-serif';
      butonHTML = `<button ${yetersiz ? '' : `onclick="marketSatinAl('${id}')"`} style="${style}">${u.fiyat} 💰 ${yetersiz ? '— Yetersiz' : 'Satın Al'}</button>`;
    }

    const cardBorder = aktifMi ? '1.5px solid #1D9E75' : sahipMi ? '1px solid var(--accent)55' : '1px solid var(--border)';
    const cardBg = aktifMi ? 'rgba(29,158,117,0.05)' : 'var(--surface)';

    return `<div style="background:${cardBg};border:${cardBorder};border-radius:14px;padding:14px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;transition:border 0.2s">
      ${aktifMi ? '<div style="position:absolute;top:7px;right:7px;width:8px;height:8px;border-radius:50%;background:#1D9E75;box-shadow:0 0 6px #1D9E75"></div>' :
        sahipMi && !u.tuket ? '<div style="position:absolute;top:6px;right:6px;font-size:8px;background:var(--accent)22;color:var(--accent);padding:2px 7px;border-radius:8px;font-weight:700">Sahip</div>' : ''}
      <div style="font-size:2rem;margin-bottom:6px">${u.ikon}</div>
      <div style="font-size:0.82rem;font-weight:700;margin-bottom:2px">${u.ad}</div>
      <div style="font-size:0.68rem;color:var(--text2);margin-bottom:10px;line-height:1.45;flex:1">${u.aciklama}</div>
      ${butonHTML}
    </div>`;
  }).join('');

  return `
    <div id="mKatBar" style="display:flex;gap:6px;overflow-x:auto;padding:8px 0 12px;-webkit-overflow-scrolling:touch" ontouchstart="event.stopPropagation()">
      ${tabHTML}
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
      ${urunHTML}
    </div>
  `;
}

function _marketYenile() {
  const el = document.getElementById('marketSayfa');
  if (el) el.innerHTML = _marketIcerik();
  const altinEl = document.getElementById('marketAltinGoster');
  if (altinEl) {
    altinEl.textContent = window.currentUserData?.altin || 0;
    // Pop animasyonu
    const badge = document.getElementById('marketAltinBadge');
    if (badge) { badge.classList.remove('mPop'); void badge.offsetWidth; badge.classList.add('mPop'); }
  }
}

// ── Bildirim ─────────────────────────────────────────────
function _mBildirim(mesaj, renk) {
  const d = document.createElement('div');
  d.textContent = mesaj;
  d.style.cssText = `position:fixed;top:60px;left:50%;transform:translateX(-50%);background:${renk || '#333'};color:white;font-weight:700;font-size:.85rem;padding:10px 20px;border-radius:99px;z-index:9999;pointer-events:none;animation:mFadeUp 1.5s forwards`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 1600);
}
