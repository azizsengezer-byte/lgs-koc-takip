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

  // ── Efektler (soru girişinde animasyon) ────────────────
  efekt_konfeti: { kategori:'efekt', ad:'Konfeti',        fiyat:400, ikon:'🎊', aciklama:'Soru girişinde konfeti patlar',      tip:'efekt', deger:'konfeti' },
  efekt_yildiz:  { kategori:'efekt', ad:'Yıldız Yağmuru', fiyat:500, ikon:'⭐', aciklama:'Soru girişinde yıldızlar yağar',    tip:'efekt', deger:'yildiz' },
  efekt_kalp:    { kategori:'efekt', ad:'Kalp Yağmuru',   fiyat:350, ikon:'💜', aciklama:'Soru girişinde kalpler uçar',       tip:'efekt', deger:'kalp' },
  efekt_altin:   { kategori:'efekt', ad:'Altın Patlama',  fiyat:550, ikon:'💰', aciklama:'Soru girişinde altınlar yağar',     tip:'efekt', deger:'altin' },
  efekt_roket:   { kategori:'efekt', ad:'Roket Fırlatma', fiyat:600, ikon:'🚀', aciklama:'Soru girişinde roket fırlar',       tip:'efekt', deger:'roket' },

  // ── Güçlendiriciler (süreli, tüketilir) ────────────────
  boost_seri:    { kategori:'boost', ad:'Seri Koruyucu',  fiyat:500,  ikon:'🛡', aciklama:'1 gün çalışmasan serin bozulmaz',     tip:'boost', deger:'seri',    tuket:true },
  boost_2x:      { kategori:'boost', ad:'2x Altın (24s)', fiyat:400,  ikon:'💰', aciklama:'24 saat boyunca 2 katı altın kazan',  tip:'boost', deger:'2x',      tuket:true },
  boost_3x_soru: { kategori:'boost', ad:'3x Soru Altın',  fiyat:600,  ikon:'🎯', aciklama:'24 saat soru başına 3x altın',        tip:'boost', deger:'3x_soru', tuket:true },

  // ── Uygulama Temaları ──────────────────────────────────
  tema_okyanus:  { kategori:'tema', ad:'Okyanus',        fiyat:800,  ikon:'🌊', aciklama:'Derin mavi okyanus teması',   tip:'tema', deger:'okyanus' },
  tema_orman:    { kategori:'tema', ad:'Orman',          fiyat:800,  ikon:'🌿', aciklama:'Ferahlatıcı yeşil orman teması', tip:'tema', deger:'orman' },
  tema_gece:     { kategori:'tema', ad:'Gece Yarısı',    fiyat:900,  ikon:'🌙', aciklama:'Derin koyu gece teması',      tip:'tema', deger:'gece' },
  tema_seker:    { kategori:'tema', ad:'Şeker',          fiyat:700,  ikon:'🍬', aciklama:'Tatlı pembe şeker teması',    tip:'tema', deger:'seker' },
  tema_alev:     { kategori:'tema', ad:'Alev',           fiyat:1000, ikon:'🔥', aciklama:'Yakıcı turuncu alev teması', tip:'tema', deger:'alev' },
  tema_buz:      { kategori:'tema', ad:'Buz',            fiyat:850,  ikon:'❄', aciklama:'Soğuk buz mavisi teması',    tip:'tema', deger:'buz' },

  // ── Profil Çerçeveleri ─────────────────────────────────
  cerceve_caliskan:   { kategori:'cerceve', ad:'Çalışkan Çerçeve',   fiyat:400,  ikon:'🔵', aciklama:'Mavi altıgen çerçeve',       tip:'cerceve', deger:'caliskan' },
  cerceve_azimli:     { kategori:'cerceve', ad:'Azimli Çerçeve',     fiyat:500,  ikon:'🟣', aciklama:'Mor spiral çerçeve',         tip:'cerceve', deger:'azimli' },
  cerceve_kararli:    { kategori:'cerceve', ad:'Kararlı Çerçeve',    fiyat:600,  ikon:'🟡', aciklama:'Altın çizgili çerçeve',      tip:'cerceve', deger:'kararli' },
  cerceve_guclu:      { kategori:'cerceve', ad:'Güçlü Çerçeve',      fiyat:800,  ikon:'🟠', aciklama:'Turuncu güç çerçevesi',      tip:'cerceve', deger:'guclu' },
  cerceve_usta:       { kategori:'cerceve', ad:'Usta Çerçeve',       fiyat:1200, ikon:'⭐', aciklama:'Altın yıldızlı çerçeve',    tip:'cerceve', deger:'usta' },
  cerceve_efsane:     { kategori:'cerceve', ad:'Efsane Çerçeve',     fiyat:2000, ikon:'👑', aciklama:'Görkemli efsane çerçevesi', tip:'cerceve', deger:'efsane' },

  // ── Rozet Vitrini ──────────────────────────────────────
  rozet_vitrin: { kategori:'vitrin', ad:'Rozet Vitrini', fiyat:600, ikon:'🏆', aciklama:'Profilinde 3 rozet öne çıkar', tip:'vitrin', deger:'aktif', tuket:false },
};

const MARKET_KATEGORILER = [
  { id:'etiket',  ad:'👤 Etiket'         },
  { id:'tema',    ad:'🎨 Tema'           },
  { id:'cerceve', ad:'🖼 Çerçeve'        },
  { id:'vitrin',  ad:'🏆 Vitrin'         },
  { id:'efekt',   ad:'✨ Efektler'       },
  { id:'boost',   ad:'⚡ Güçlendirici'   },
];

const MARKET_ALTIN = { MOOD: 20, WELLNESS_TAM: 50, WELLNESS_ALAN: 30, SORU_10: 5, SERI_7: 100 };
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
  if (!urun) { showToast('⚠', 'Ürün bulunamadı'); return; }
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const altin = window.currentUserData?.altin || 0;
  if (altin < urun.fiyat) { showToast('⚠', 'Yeterli altın yok! (' + urun.fiyat + ' gerekli)'); return; }

  // Zaten sahip mi?
  const sahip = window.currentUserData?.sahipUrunler || [];
  if (sahip.includes(urunId) && !urun.tuket && urun.tip !== 'isim') { showToast('ℹ️', 'Bu ürün zaten sende var'); return; }

  const yeniAltin = altin - urun.fiyat;
  window.currentUserData.altin = yeniAltin;
  if (!window.currentUserData.sahipUrunler) window.currentUserData.sahipUrunler = [];
  if (!urun.tuket) window.currentUserData.sahipUrunler.push(urunId);

  try {
    const update = { altin: yeniAltin };
    if (!urun.tuket) update.sahipUrunler = firebase.firestore.FieldValue.arrayUnion(urunId);

    // Tüketilir boost → bitiş zamanı kaydet (XP paketleri hariç — anında uygulanır)
    if (urun.tuket && urun.tip !== 'xp') {
      const bitis = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      if (!window.currentUserData.aktif) window.currentUserData.aktif = {};
      window.currentUserData.aktif[urunId] = bitis;
      update['aktif.' + urunId] = bitis;
    }

    await db.collection('users').doc(uid).update(update);
    showToast('✅', urun.ad + ' satın alındı!');

    // Özel işlemler
    if (urun.tip === 'etiket')  _mEtiketUygula(urun.deger);
    if (urun.tip === 'tema')    _mTemaUygula(urun.deger);
    if (urun.tip === 'cerceve') _mCerceveSec(urun.deger);
    if (urun.tip === 'vitrin')  _mVitrinAc();

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
  } else if (urun.tip === 'tema') {
    _mTemaUygula(urun.deger);
  } else if (urun.tip === 'cerceve') {
    _mCerceveSec(urun.deger);
  } else if (urun.tip === 'vitrin') {
    _mVitrinAc();
  }
  _marketYenile();
}

// ── Tema Sistemi ──────────────────────────────────────────
const MARKET_TEMALAR = {
  okyanus: { '--bg':'#f0f7ff', '--surface':'#ffffff', '--surface2':'#e6f2ff', '--border':'#c8dff5', '--accent':'#1a6eb5', '--accent-btn':'#1558a0', '--text':'#0a1f35', '--text2':'#5a7fa0', '--shadow':'0 2px 12px rgba(26,110,181,0.10)' },
  orman:   { '--bg':'#f0f7f2', '--surface':'#ffffff', '--surface2':'#e4f1e7', '--border':'#c2dfc9', '--accent':'#1D7A45', '--accent-btn':'#186038', '--text':'#0a2215', '--text2':'#4a7a57', '--shadow':'0 2px 12px rgba(29,122,69,0.10)' },
  gece:    { '--bg':'#0f111a', '--surface':'#1a1d2e', '--surface2':'#22263a', '--border':'#2e334d', '--accent':'#7c73ff', '--accent-btn':'#6a61ee', '--text':'#e8eaf6', '--text2':'#7880a8', '--shadow':'0 2px 12px rgba(124,115,255,0.15)' },
  seker:   { '--bg':'#fff5f8', '--surface':'#ffffff', '--surface2':'#ffeef3', '--border':'#ffd5e5', '--accent':'#e0447a', '--accent-btn':'#c83568', '--text':'#2d0a17', '--text2':'#b06080', '--shadow':'0 2px 12px rgba(224,68,122,0.10)' },
  alev:    { '--bg':'#fff8f0', '--surface':'#ffffff', '--surface2':'#fff0e0', '--border':'#ffd5a8', '--accent':'#d4520a', '--accent-btn':'#bc4408', '--text':'#2d1200', '--text2':'#9a6030', '--shadow':'0 2px 12px rgba(212,82,10,0.10)' },
  buz:     { '--bg':'#f4f9ff', '--surface':'#ffffff', '--surface2':'#e8f4ff', '--border':'#c5dff5', '--accent':'#3a8fc8', '--accent-btn':'#2e72a5', '--text':'#0a1a2d', '--text2':'#5080a5', '--shadow':'0 2px 12px rgba(58,143,200,0.10)' },
};

function _mTemaUygula(temaId) {
  const tema = MARKET_TEMALAR[temaId];
  if (!tema) return;
  const root = document.documentElement;
  Object.entries(tema).forEach(([k,v]) => root.style.setProperty(k, v));
  localStorage.setItem('market_tema', temaId);
  showToast('🎨', MARKET_URUNLER['tema_'+temaId]?.ad + ' teması aktif!');
}

function _mTemaKaldir() {
  const root = document.documentElement;
  ['--bg','--surface','--surface2','--border','--accent','--accent-btn','--text','--text2','--shadow'].forEach(k => root.style.removeProperty(k));
  localStorage.removeItem('market_tema');
}

function _mTemaYukle() {
  const temaId = localStorage.getItem('market_tema');
  if (temaId && MARKET_TEMALAR[temaId]) _mTemaUygula(temaId);
}

// ── Çerçeve Sistemi ──────────────────────────────────────
function _mCerceveSec(frameId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const prev = localStorage.getItem('market_cerceve');
  if (prev === frameId) {
    // Toggle — kaldır
    localStorage.removeItem('market_cerceve');
    setActiveFrame(uid, 'none');
    applyProfileFrame(uid, 'none');
    showToast('✅', 'Çerçeve kaldırıldı');
  } else {
    localStorage.setItem('market_cerceve', frameId);
    setActiveFrame(uid, frameId);
    applyProfileFrame(uid, frameId);
    showToast('🖼', 'Çerçeve aktif!');
  }
}

// ── Rozet Vitrini ────────────────────────────────────────
function _mVitrinAc() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const earned = JSON.parse(localStorage.getItem('badges_'+uid)||'[]');
  if (earned.length === 0) { showToast('⚠', 'Henüz rozet kazanmadın'); return; }

  const mevcut = JSON.parse(localStorage.getItem('market_vitrin_secili_'+uid)||'[]');

  let html = '<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center" id="_vitrinModal">';
  html += '<div style="background:var(--surface);border-radius:20px;padding:24px;width:90%;max-width:360px;max-height:80vh;overflow-y:auto">';
  html += '<div style="font-weight:800;font-size:1rem;margin-bottom:6px">Rozet Vitrini</div>';
  html += '<div style="font-size:0.78rem;color:var(--text2);margin-bottom:16px">Profilinde öne çıkarmak istediğin 3 rozeti seç</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">';

  earned.forEach(bid => {
    const secili = mevcut.includes(bid);
    html += '<div onclick="_vitrinToggle(\"'+bid+'\",\"'+uid+'\")" id="vb_'+bid+'" style="cursor:pointer;border-radius:10px;padding:8px;text-align:center;border:2px solid '+(secili?'var(--accent)':'var(--border)')+';background:'+(secili?'var(--accent)11':'var(--surface2)')+';">'; 
    html += '<div style="font-size:1.4rem">'+( typeof BADGE_DEFS !== 'undefined' && BADGE_DEFS[bid] ? '⭐' : '🏅')+'</div>';
    html += '<div style="font-size:0.6rem;color:var(--text2);margin-top:2px">'+bid+'</div>';
    html += '</div>';
  });

  html += '</div>';
  html += '<button onclick="_vitrinKaydet(\"'+uid+'\")" style="width:100%;margin-top:16px;padding:12px;background:var(--accent-btn);border:none;border-radius:12px;color:white;font-weight:700;cursor:pointer">Kaydet</button>';
  html += '<button onclick="document.getElementById(\'_vitrinModal\').remove()" style="width:100%;margin-top:8px;padding:10px;background:none;border:1px solid var(--border);border-radius:12px;color:var(--text2);font-weight:700;cursor:pointer">Kapat</button>';
  html += '</div></div>';

  document.body.insertAdjacentHTML('beforeend', html);
}

function _vitrinToggle(bid, uid) {
  let secili = JSON.parse(localStorage.getItem('market_vitrin_secili_'+uid)||'[]');
  const el = document.getElementById('vb_'+bid);
  if (secili.includes(bid)) {
    secili = secili.filter(b=>b!==bid);
    if (el) { el.style.borderColor='var(--border)'; el.style.background='var(--surface2)'; }
  } else {
    if (secili.length >= 3) { showToast('⚠','En fazla 3 rozet seçebilirsin'); return; }
    secili.push(bid);
    if (el) { el.style.borderColor='var(--accent)'; el.style.background='var(--accent)11'; }
  }
  localStorage.setItem('market_vitrin_secili_'+uid, JSON.stringify(secili));
}

function _vitrinKaydet(uid) {
  localStorage.setItem('market_vitrin', 'aktif');
  document.getElementById('_vitrinModal')?.remove();
  showToast('🏆','Rozet vitrini güncellendi!');
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
// ── Koloni Tema Uygulama ─────────────────────────────────
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
        <div class="page-title" style="margin-bottom:0"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Market</div>
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
    const _aktifTema    = localStorage.getItem('market_tema')    || null;
    const _aktifCerceve = localStorage.getItem('market_cerceve') || null;
    const aktifMi = (u.tip === 'etiket'  && window.currentUserData?.etiket === u.deger)
      || (u.tip === 'efekt'   && aktif.efekt === u.deger)
      || (u.tip === 'tema'    && _aktifTema    === u.deger)
      || (u.tip === 'cerceve' && _aktifCerceve === u.deger)
      || (u.tip === 'vitrin'  && localStorage.getItem('market_vitrin') === 'aktif');
    // isim tipi boost gibi davranmaz — özel render
    if (u.tip === 'isim') {
      const isimBtn = `<button onclick="marketSatinAl('${id}')" style="width:100%;padding:9px;background:var(--accent-btn);border:none;border-radius:10px;color:white;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">${u.fiyat} — İsim Değiştir</button>`;
      return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px;display:flex;flex-direction:column;align-items:center;text-align:center">
        <div style="font-size:2rem;margin-bottom:6px">${u.ikon}</div>
        <div style="font-size:0.82rem;font-weight:700;margin-bottom:2px">${u.ad}</div>
        <div style="font-size:0.68rem;color:var(--text2);margin-bottom:10px;flex:1">${u.aciklama}</div>
        ${isimBtn}
      </div>`;
    }
    const boostAktif = u.tuket && u.tip !== 'xp' && aktif[id] && new Date(aktif[id]) > new Date();
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
      butonHTML = `<button ${yetersiz ? '' : `onclick="marketSatinAl('${id}')"`} style="${style}">${u.fiyat} ${yetersiz ? '— Yetersiz' : 'Satın Al'}</button>`;
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
