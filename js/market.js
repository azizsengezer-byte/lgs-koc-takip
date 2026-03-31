// ============================================================
// 💰 MARKET SİSTEMİ v3
// ============================================================

const MARKET_URUNLER = {

  // 🐉 EJDERHA RENKLERİ — base #6c63ff üzerine filter
  ejderha_kizil:  { kategori:'ejderha', ad:'Kızıl Ejderha',  fiyat:500, ikon:'🔴', aciklama:'Ejderhanı kızıla boyar',  tip:'renk', renk:'#ff4444', css:'hue-rotate(330deg) saturate(2) brightness(1.1)' },
  ejderha_buz:    { kategori:'ejderha', ad:'Buz Ejderhası',  fiyat:500, ikon:'🔵', aciklama:'Ejderhanı maviye boyar',  tip:'renk', renk:'#44aaff', css:'hue-rotate(190deg) saturate(1.5) brightness(1.2)' },
  ejderha_zumrut: { kategori:'ejderha', ad:'Zümrüt Ejderha', fiyat:500, ikon:'🟢', aciklama:'Ejderhanı yeşile boyar',  tip:'renk', renk:'#44cc66', css:'hue-rotate(110deg) saturate(1.6)' },
  ejderha_altin:  { kategori:'ejderha', ad:'Altın Ejderha',  fiyat:800, ikon:'🟡', aciklama:'Ejderhanı altına boyar',  tip:'renk', renk:'#ffcc00', css:'hue-rotate(50deg) saturate(2.5) brightness(1.2)' },
  ejderha_gece:   { kategori:'ejderha', ad:'Gece Ejderhası', fiyat:600, ikon:'⚫', aciklama:'Ejderhanı siyaha boyar',  tip:'renk', renk:'#334455', css:'hue-rotate(220deg) saturate(0.3) brightness(0.55)' },
  ejderha_pembe:  { kategori:'ejderha', ad:'Pembe Ejderha',  fiyat:400, ikon:'🩷', aciklama:'Ejderhanı pembeleştirir', tip:'renk', renk:'#ff66bb', css:'hue-rotate(300deg) saturate(1.8) brightness(1.1)' },

  // 🎩 EJDERHA AKSESUAR
  aksesuar_sapka:  { kategori:'aksesuar', ad:'Sihirbaz Şapkası', fiyat:400, ikon:'🎩', aciklama:'Ejderhanın başında sihirbaz şapkası', tip:'aksesuar', deger:'sapka' },
  aksesuar_tac:    { kategori:'aksesuar', ad:'Altın Taç',        fiyat:600, ikon:'👑', aciklama:'Ejderhanın başında altın taç',      tip:'aksesuar', deger:'tac' },
  aksesuar_gozluk: { kategori:'aksesuar', ad:'Süper Gözlük',     fiyat:350, ikon:'🕶️', aciklama:'Ejderhaya süper gözlük tak',        tip:'aksesuar', deger:'gozluk' },
  aksesuar_kilic:  { kategori:'aksesuar', ad:'Ejderha Kılıcı',   fiyat:500, ikon:'⚔️', aciklama:'Ejderha kılıç tutsun',              tip:'aksesuar', deger:'kilic' },
  aksesuar_yildiz: { kategori:'aksesuar', ad:'Yıldız Tacı',      fiyat:450, ikon:'⭐', aciklama:'Ejderhanın başında yıldızlar',      tip:'aksesuar', deger:'yildiz' },

  // 🌋 EJDERHA ARKA PLANI
  arkaplan_volkan: { kategori:'arkaplan', ad:'Volkan Sahne',  fiyat:600, ikon:'🌋', aciklama:'Ejderha lavların üstünde duruyor',  tip:'arkaplan', deger:'volkan' },
  arkaplan_buz:    { kategori:'arkaplan', ad:'Buz Dağı',      fiyat:600, ikon:'❄️', aciklama:'Ejderha buz kristalleri arasında', tip:'arkaplan', deger:'buz' },
  arkaplan_orman:  { kategori:'arkaplan', ad:'Büyülü Orman',  fiyat:550, ikon:'🌲', aciklama:'Ejderha büyülü ormanda',          tip:'arkaplan', deger:'orman' },
  arkaplan_uzay:   { kategori:'arkaplan', ad:'Uzay Sahne',    fiyat:700, ikon:'🚀', aciklama:'Ejderha uzayda süzülüyor',        tip:'arkaplan', deger:'uzay' },
  arkaplan_deniz:  { kategori:'arkaplan', ad:'Derin Deniz',   fiyat:550, ikon:'🌊', aciklama:'Ejderha denizin derinliklerinde', tip:'arkaplan', deger:'deniz' },

  // 🔥 ATEŞ RENKLERİ
  ates_mavi:  { kategori:'ates', ad:'Mavi Alev',  fiyat:350, ikon:'🔵', aciklama:'Ejderhanın ateşi mavi yanar',  tip:'ates', renk:'#44aaff', css:'hue-rotate(190deg) saturate(1.5)' },
  ates_yesil: { kategori:'ates', ad:'Yeşil Alev', fiyat:350, ikon:'🟢', aciklama:'Ejderhanın ateşi yeşil yanar', tip:'ates', renk:'#44ff88', css:'hue-rotate(110deg) saturate(2)' },
  ates_mor:   { kategori:'ates', ad:'Mor Alev',   fiyat:400, ikon:'🟣', aciklama:'Ejderhanın ateşi mor yanar',   tip:'ates', renk:'#aa44ff', css:'hue-rotate(270deg) saturate(1.8)' },
  ates_pembe: { kategori:'ates', ad:'Pembe Alev', fiyat:300, ikon:'🩷', aciklama:'Ejderhanın ateşi pembe yanar', tip:'ates', renk:'#ff66bb', css:'hue-rotate(310deg) saturate(1.6)' },
  ates_altin: { kategori:'ates', ad:'Altın Alev', fiyat:500, ikon:'🟡', aciklama:'Ejderhanın ateşi altın yanar', tip:'ates', renk:'#ffcc00', css:'hue-rotate(30deg) saturate(2)' },

  // ✨ EFEKTLERi
  efekt_konfeti: { kategori:'efekt', ad:'Konfeti',        fiyat:400, ikon:'🎊', aciklama:'Soru girişinde konfeti patlar',      tip:'efekt', deger:'konfeti' },
  efekt_yildiz:  { kategori:'efekt', ad:'Yıldız Yağmuru', fiyat:500, ikon:'⭐', aciklama:'Soru girişinde yıldızlar uçar',     tip:'efekt', deger:'yildiz' },
  efekt_kalp:    { kategori:'efekt', ad:'Kalp Yağmuru',   fiyat:350, ikon:'💜', aciklama:'Soru girişinde kalpler uçar',      tip:'efekt', deger:'kalp' },
  efekt_altin:   { kategori:'efekt', ad:'Altın Patlama',  fiyat:550, ikon:'💰', aciklama:'Soru girişinde altınlar yağar',    tip:'efekt', deger:'altin' },

  // 👤 İSİM ETİKETLERİ
  etiket_caliskan:  { kategori:'etiket', ad:'🔥 Çalışkan',   fiyat:300, ikon:'🔥', aciklama:'İsmin yanında 🔥 Çalışkan etiketi', tip:'etiket', deger:'🔥 Çalışkan' },
  etiket_hizli:     { kategori:'etiket', ad:'⚡ Hızlı',      fiyat:300, ikon:'⚡', aciklama:'İsmin yanında ⚡ Hızlı etiketi',    tip:'etiket', deger:'⚡ Hızlı' },
  etiket_efsane:    { kategori:'etiket', ad:'👑 Efsane',     fiyat:800, ikon:'👑', aciklama:'İsmin yanında 👑 Efsane etiketi',  tip:'etiket', deger:'👑 Efsane' },
  etiket_elit:      { kategori:'etiket', ad:'💎 Elit',       fiyat:600, ikon:'💎', aciklama:'İsmin yanında 💎 Elit etiketi',    tip:'etiket', deger:'💎 Elit' },
  etiket_kahraman:  { kategori:'etiket', ad:'🦸 Kahraman',   fiyat:400, ikon:'🦸', aciklama:'İsmin yanında 🦸 Kahraman etiketi',tip:'etiket', deger:'🦸 Kahraman' },
  etiket_bilge:     { kategori:'etiket', ad:'🦉 Bilge',      fiyat:350, ikon:'🦉', aciklama:'İsmin yanında 🦉 Bilge etiketi',   tip:'etiket', deger:'🦉 Bilge' },
  etiket_ates:      { kategori:'etiket', ad:'🌋 Ateş Kalbi', fiyat:500, ikon:'🌋', aciklama:'İsmin yanında 🌋 Ateş Kalbi etiketi', tip:'etiket', deger:'🌋 Ateş Kalbi' },

  // ⚡ GÜÇLENDİRİCİ (tüketilebilir)
  boost_seri:    { kategori:'boost', ad:'Seri Koruyucu',  fiyat:500,  ikon:'🛡️', aciklama:'1 gün çalışmasan serin bozulmaz',    tip:'boost', deger:'seri',   tuket:true },
  boost_2x:      { kategori:'boost', ad:'2x Altın (24s)', fiyat:400,  ikon:'✨', aciklama:'24 saat boyunca 2 katı altın kazan', tip:'boost', deger:'2x',     tuket:true },
  boost_3x_soru: { kategori:'boost', ad:'3x Soru Altın', fiyat:600,  ikon:'🎯', aciklama:'24 saat soru başına 3x altın',       tip:'boost', deger:'3x_soru',tuket:true },

  // 🎁 SOSYAL
  hediye_altin_100: { kategori:'sosyal', ad:'100 Altın Hediye',  fiyat:150,  ikon:'🎁', aciklama:'Bir arkadaşına 100 altın gönder',  tip:'hediye', deger:100 },
  hediye_altin_500: { kategori:'sosyal', ad:'500 Altın Hediye',  fiyat:600,  ikon:'🎀', aciklama:'Bir arkadaşına 500 altın gönder',  tip:'hediye', deger:500 },
  meydan_okuma:     { kategori:'sosyal', ad:'Meydan Okuma',      fiyat:200,  ikon:'⚔️', aciklama:'Arkadaşına haftalık yarış gönder', tip:'meydan', deger:'hafta', tuket:true },

  // 🐉 ÖZEL
  ejderha_isim: { kategori:'ozel', ad:'Ejderhaya İsim Ver', fiyat:300, ikon:'✏️', aciklama:'Ejderhana özel bir isim ver', tip:'isim', deger:'' },
};

const MARKET_KATEGORILER = [
  { id:'ejderha',  ad:'🐉 Ejderha Rengi' },
  { id:'aksesuar', ad:'🎩 Aksesuar'      },
  { id:'arkaplan', ad:'🎨 Arka Plan'     },
  { id:'ates',     ad:'🔥 Ateş Rengi'   },
  { id:'efekt',    ad:'✨ Efektler'      },
  { id:'etiket',   ad:'👤 Etiket'        },
  { id:'boost',    ad:'⚡ Güçlendirici'  },
  { id:'sosyal',   ad:'🎁 Sosyal'        },
  { id:'ozel',     ad:'🌟 Özel'          },
];

// ── Altın Kazanma ──────────────────────────────────────────
const MARKET_ALTIN = { MOOD:15, WELLNESS_TAM:100, SORU_10:5, SERI_7:100 };

async function marketAldinEkle(miktar, sebep) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  // 2x boost aktif mi?
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
    div.style.cssText = 'position:fixed;top:60px;right:16px;background:#2a2000;border:1.5px solid #f9ca24;color:#f9ca24;font-weight:900;font-size:.9rem;padding:8px 16px;border-radius:99px;z-index:9999;pointer-events:none';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1200);
    const sayac = document.getElementById('maceraAltinSayac');
    if (sayac) sayac.textContent = yeni;
  } catch(e) { console.error(e); }
}

// ── Satın Al ──────────────────────────────────────────────
async function marketSatinAl(urunId) {
  const urun = MARKET_URUNLER[urunId];
  if (!urun) return;
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const altin = window.currentUserData?.altin || 0;
  if (altin < urun.fiyat) { _mBildirim('Yeterli altın yok! 💰', '#ff6b6b'); return; }

  // Hediye gönderme özel akış
  if (urun.tip === 'hediye' || urun.tip === 'meydan') {
    _mHediyeGonder(urunId, urun);
    return;
  }

  // İsim verme özel akış
  if (urun.tip === 'isim') {
    _mIsimVer(urunId, urun);
    return;
  }

  const liste = window.currentUserData?.satin_alinanlar || [];
  if (liste.includes(urunId) && !urun.tuket) { _mBildirim('Zaten sahipsin!', '#f9ca24'); return; }
  if (!urun.tuket) liste.push(urunId);

  const yeniAltin = altin - urun.fiyat;
  window.currentUserData.altin = yeniAltin;
  window.currentUserData.satin_alinanlar = liste;
  try {
    await db.collection('users').doc(uid).update({ altin: yeniAltin, satin_alinanlar: liste });
    _mBildirim(urun.ikon + ' ' + urun.ad + ' satın alındı!', '#43e97b');
    document.getElementById('_mModal') && (document.getElementById('_mModal').style.display = 'none');
    const el = document.getElementById('marketSayfa');
    if (el) el.innerHTML = _marketIcerik();
    const sayac = document.getElementById('maceraAltinSayac');
    if (sayac) sayac.textContent = yeniAltin;
  } catch(e) { _mBildirim('Hata oluştu', '#ff6b6b'); }
}

// ── Aktif Et / Kapat ───────────────────────────────────────
async function marketAktifEt(urunId) {
  const urun = MARKET_URUNLER[urunId];
  if (!urun) return;
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const aktif = window.currentUserData?.aktif || {};

  // Toggle — zaten aktifse kapat
  if (aktif[urunId] === true || (aktif[urunId] && typeof aktif[urunId] === 'string')) {
    delete aktif[urunId];
    window.currentUserData.aktif = aktif;
    try {
      await db.collection('users').doc(uid).update({ aktif });
      _mBildirim(urun.ikon + ' Deaktif edildi', '#f9ca24');
      _mSifirlaEfekt(urun);
      document.getElementById('_mModal') && (document.getElementById('_mModal').style.display = 'none');
      const el = document.getElementById('marketSayfa');
      if (el) el.innerHTML = _marketIcerik();
    } catch(e) { _mBildirim('Hata', '#ff6b6b'); }
    return;
  }

  // Aynı tipteki eskiyi kaldır
  Object.keys(aktif).forEach(k => {
    const u = MARKET_URUNLER[k];
    if (u && u.tip === urun.tip) delete aktif[k];
  });

  // Boost — bitiş tarihi kaydet
  if (urun.tuket) {
    const bitis = new Date();
    bitis.setDate(bitis.getDate() + 1);
    aktif[urunId] = bitis.toISOString();
  } else {
    aktif[urunId] = true;
  }

  window.currentUserData.aktif = aktif;
  try {
    await db.collection('users').doc(uid).update({ aktif });
    _mBildirim(urun.ikon + ' ' + urun.ad + ' aktif!', '#43e97b');
    _marketUygulaEfektler();
    document.getElementById('_mModal') && (document.getElementById('_mModal').style.display = 'none');
    const el = document.getElementById('marketSayfa');
    if (el) el.innerHTML = _marketIcerik();
  } catch(e) { _mBildirim('Hata', '#ff6b6b'); }
}

// ── Efekt Uygula ──────────────────────────────────────────
function _marketUygulaEfektler() {
  const aktif = window.currentUserData?.aktif || {};
  Object.keys(aktif).forEach(id => {
    if (!aktif[id]) return;
    const u = MARKET_URUNLER[id];
    if (!u) return;
    if (u.tip === 'renk') {
      // Fill renklerini direkt değiştir — filter yok
      const ana = u.renk || '#6c63ff';
      const r = parseInt(ana.slice(1,3),16), g = parseInt(ana.slice(3,5),16), b = parseInt(ana.slice(5,7),16);
      const koyu = '#' + Math.floor(r*0.75).toString(16).padStart(2,'0') + Math.floor(g*0.75).toString(16).padStart(2,'0') + Math.floor(b*0.75).toString(16).padStart(2,'0');
      const acik = '#' + Math.min(255,Math.floor(r*1.2)).toString(16).padStart(2,'0') + Math.min(255,Math.floor(g*1.2)).toString(16).padStart(2,'0') + Math.min(255,Math.floor(b*1.2)).toString(16).padStart(2,'0');
      document.querySelectorAll('#dragon-svg [fill="#6c63ff"]').forEach(el => el.setAttribute('fill', ana));
      document.querySelectorAll('#dragon-svg [fill="#5a4fcf"]').forEach(el => el.setAttribute('fill', koyu));
      document.querySelectorAll('#dragon-svg [fill="#7c74ff"]').forEach(el => el.setAttribute('fill', acik));
      // style.filter'ı temizle
      document.querySelectorAll('#dragon-svg').forEach(el => { el.style.filter = ''; });
    }
    if (u.tip === 'ates') {
      document.querySelectorAll('#fire-group').forEach(el => { el.style.filter = u.css; });
    }
    if (u.tip === 'aksesuar') {
      _mAksesuarUygula(u.deger);
    }
    if (u.tip === 'arkaplan') {
      _mArkaplanUygula(u.deger);
    }
    if (u.tip === 'etiket') {
      _mEtiketUygula(u.deger);
    }
  });
}

function _mSifirlaEfekt(urun) {
  if (urun.tip === 'renk') document.querySelectorAll('#dragon-svg').forEach(el => { el.style.filter = ''; });
  if (urun.tip === 'ates') document.querySelectorAll('#fire-group').forEach(el => { el.style.filter = ''; });
  if (urun.tip === 'aksesuar') { const el = document.getElementById('ej-aksesuar'); if (el) el.remove(); }
  if (urun.tip === 'arkaplan') _mArkaplanSifirla();
  if (urun.tip === 'etiket') _mEtiketSifirla();
}

// ── Aksesuar ──────────────────────────────────────────────
function _mAksesuarUygula(tip) {
  let el = document.getElementById('ej-aksesuar');
  if (el) el.remove();
  const wrap = document.getElementById('ej-wrap');
  if (!wrap) return;
  el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  el.id = 'ej-aksesuar';
  const aksesuarSVG = {
    sapka: '<path d="M58 42 Q80 20 102 42 L98 46 Q80 28 62 46 Z" fill="#1a1a2e"/><rect x="55" y="43" width="50" height="6" rx="3" fill="#2d2d4e"/><path d="M75 20 L80 8 L85 20 Z" fill="#1a1a2e"/><circle cx="80" cy="8" r="3" fill="#f9ca24"/>',
    tac: '<path d="M62 48 L68 32 L74 44 L80 28 L86 44 L92 32 L98 48 Z" fill="#f9ca24"/><circle cx="80" cy="28" r="4" fill="#ff6b6b"/><circle cx="68" cy="32" r="3" fill="#4ecdc4"/><circle cx="92" cy="32" r="3" fill="#4ecdc4"/>',
    gozluk: '<ellipse cx="68" cy="76" rx="10" ry="7" fill="none" stroke="#1a1a2e" stroke-width="2.5"/><ellipse cx="92" cy="76" rx="10" ry="7" fill="none" stroke="#1a1a2e" stroke-width="2.5"/><line x1="78" y1="76" x2="82" y2="76" stroke="#1a1a2e" stroke-width="2"/><ellipse cx="68" cy="76" rx="8" ry="5" fill="#4ecdc4" opacity="0.4"/><ellipse cx="92" cy="76" rx="8" ry="5" fill="#4ecdc4" opacity="0.4"/>',
    kilic: '<rect x="108" y="60" width="4" height="50" rx="2" fill="#c0c0c0" transform="rotate(20 110 85)"/><path d="M106 58 L116 58 L110 52 Z" fill="#f9ca24"/><rect x="104" y="108" width="12" height="5" rx="2" fill="#8B4513" transform="rotate(20 110 110)"/>',
    yildiz: '<circle cx="80" cy="24" r="5" fill="#f9ca24"/><circle cx="65" cy="32" r="3" fill="#f9ca24" opacity="0.8"/><circle cx="95" cy="32" r="3" fill="#f9ca24" opacity="0.8"/><circle cx="72" cy="18" r="2" fill="#f9ca24" opacity="0.6"/><circle cx="88" cy="18" r="2" fill="#f9ca24" opacity="0.6"/>',
  };
  el.innerHTML = aksesuarSVG[tip] || '';
  const svg = document.getElementById('dragon-svg');
  if (svg) svg.appendChild(el);
}

// ── Arka Plan ─────────────────────────────────────────────
function _mArkaplanUygula(tip) {
  const scene = document.getElementById('ejderha-scene');
  if (!scene) return;
  let bg = document.getElementById('ej-arkaplan');
  if (bg) bg.remove();
  bg = document.createElement('div');
  bg.id = 'ej-arkaplan';
  bg.style.cssText = 'position:absolute;inset:0;border-radius:14px;overflow:hidden;z-index:0';

  const arkaplanlar = {
    volkan: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#1a0500 0%,#3d0f00 40%,#8b1a00 70%,#cc3300 100%)"></div>
      <svg style="position:absolute;bottom:0;width:100%;height:100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice">
        <path d="M0 240 L60 120 L90 160 L120 80 L150 180 L180 60 L210 140 L240 100 L270 160 L300 240Z" fill="#4a0f00"/>
        <path d="M90 160 Q105 140 120 160 Q130 150 140 160 L150 180Z" fill="#cc3300" opacity="0.8"/>
        <path d="M60 180 Q75 160 90 180 L100 200 L50 200Z" fill="#ff4400" opacity="0.7"/>
        <ellipse cx="120" cy="80" rx="8" ry="6" fill="#ff6600"/>
        <ellipse cx="120" cy="80" rx="5" ry="4" fill="#ffaa00"/>
        <path d="M115 80 Q120 50 125 80" stroke="#ff4400" stroke-width="3" fill="none" opacity="0.8"/>
        <path d="M118 80 Q120 55 122 80" stroke="#ffcc00" stroke-width="2" fill="none"/>
        <circle cx="80" cy="50" r="3" fill="#ff6600" opacity="0.6"><animate attributeName="cy" values="50;30;50" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="150" cy="40" r="2" fill="#ff4400" opacity="0.5"><animate attributeName="cy" values="40;20;40" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite"/></circle>
        <path d="M0 200 Q150 180 300 200 L300 240 L0 240Z" fill="#cc3300" opacity="0.5"/>
        <path d="M0 215 Q150 200 300 215 L300 240 L0 240Z" fill="#ff4400" opacity="0.4"/>
      </svg>`,

    buz: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#001830 0%,#002a4a 40%,#003d6e 70%,#004080 100%)"></div>
      <svg style="position:absolute;bottom:0;width:100%;height:100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice">
        <path d="M0 240 L40 160 L70 200 L100 120 L130 180 L160 100 L190 170 L220 130 L260 180 L300 140 L300 240Z" fill="#002040" opacity="0.9"/>
        <path d="M100 120 L90 140 L110 140Z" fill="#80d4ff" opacity="0.6"/>
        <path d="M160 100 L148 128 L172 128Z" fill="#aae8ff" opacity="0.7"/>
        <path d="M100 120 L100 80 M95 95 L105 95 M92 108 L108 108" stroke="#80d4ff" stroke-width="1.5" opacity="0.5"/>
        <path d="M160 100 L160 60 M155 75 L165 75 M152 88 L168 88" stroke="#aae8ff" stroke-width="1.5" opacity="0.5"/>
        <circle cx="50" cy="30" r="2" fill="white" opacity="0.8"><animate attributeName="cy" values="30;240;30" dur="4s" repeatCount="indefinite"/></circle>
        <circle cx="120" cy="10" r="1.5" fill="white" opacity="0.7"><animate attributeName="cy" values="10;240;10" dur="5s" repeatCount="indefinite" begin="1s"/></circle>
        <circle cx="200" cy="20" r="2" fill="#80d4ff" opacity="0.6"><animate attributeName="cy" values="20;240;20" dur="3.5s" repeatCount="indefinite" begin="2s"/></circle>
        <circle cx="250" cy="5" r="1.5" fill="white" opacity="0.5"><animate attributeName="cy" values="5;240;5" dur="4.5s" repeatCount="indefinite" begin="0.5s"/></circle>
        <path d="M0 220 Q150 200 300 220 L300 240 L0 240Z" fill="#80d4ff" opacity="0.2"/>
      </svg>`,

    orman: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#001a0a 0%,#002d10 40%,#003d18 70%,#004020 100%)"></div>
      <svg style="position:absolute;bottom:0;width:100%;height:100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMax slice">
        <path d="M20 240 L35 180 L50 200 L65 160 L80 240Z" fill="#003315"/>
        <path d="M60 240 L80 170 L100 200 L120 150 L140 240Z" fill="#004020"/>
        <path d="M130 240 L150 160 L170 190 L190 140 L210 240Z" fill="#003315"/>
        <path d="M200 240 L220 175 L240 200 L260 165 L280 240Z" fill="#004020"/>
        <path d="M35 180 L20 165 L35 170 L25 145 L40 155 L35 130 L50 145 L45 125 L55 140 L50 160 L65 150 L50 165Z" fill="#005c22"/>
        <path d="M80 170 L65 155 L80 162 L68 135 L85 148 L80 122 L95 138 L90 118 L100 132 L95 155 L112 145 L95 162Z" fill="#006b28"/>
        <path d="M150 160 L135 145 L150 152 L138 125 L155 138 L150 112 L165 128 L160 108 L170 122 L165 145 L182 135 L165 152Z" fill="#005c22"/>
        <circle cx="40" cy="80" r="2" fill="#aaffaa" opacity="0.5"/>
        <circle cx="150" cy="60" r="1.5" fill="#88ff88" opacity="0.4"/>
        <circle cx="250" cy="90" r="2" fill="#aaffaa" opacity="0.3"/>
        <ellipse cx="90" cy="195" rx="4" ry="2" fill="#88ffaa" opacity="0.4"/>
        <ellipse cx="200" cy="185" rx="3" ry="1.5" fill="#88ffaa" opacity="0.3"/>
        <path d="M0 225 Q150 210 300 225 L300 240 L0 240Z" fill="#004020" opacity="0.6"/>
      </svg>`,

    uzay: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#000010 0%,#050028 40%,#0a0040 70%,#0f0050 100%)"></div>
      <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 300 240">
        <circle cx="20" cy="15" r="1.5" fill="white" opacity="0.9"/>
        <circle cx="55" cy="30" r="1" fill="white" opacity="0.7"/>
        <circle cx="90" cy="10" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="130" cy="25" r="1" fill="white" opacity="0.6"/>
        <circle cx="170" cy="8" r="1.5" fill="white" opacity="0.9"/>
        <circle cx="210" cy="20" r="1" fill="white" opacity="0.7"/>
        <circle cx="250" cy="12" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="280" cy="35" r="1" fill="white" opacity="0.6"/>
        <circle cx="40" cy="55" r="1" fill="white" opacity="0.5"/>
        <circle cx="110" cy="45" r="1.5" fill="#aaaaff" opacity="0.7"/>
        <circle cx="190" cy="50" r="1" fill="white" opacity="0.6"/>
        <circle cx="260" cy="60" r="1.5" fill="#ffaaaa" opacity="0.6"/>
        <ellipse cx="80" cy="80" rx="25" ry="15" fill="none" stroke="#4466ff" stroke-width="1.5" opacity="0.5" transform="rotate(-20 80 80)"/>
        <ellipse cx="80" cy="80" rx="15" ry="10" fill="#334" opacity="0.8"/>
        <ellipse cx="220" cy="60" rx="18" ry="11" fill="#553322" opacity="0.7"/>
        <ellipse cx="220" cy="60" rx="11" ry="7" fill="#442211" opacity="0.9"/>
        <path d="M0 240 Q150 200 300 240" fill="#0a0040" opacity="0.8"/>
        <circle cx="150" cy="30" r="3" fill="#ffffff" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="60" cy="20" r="2" fill="#aaaaff" opacity="0.5"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/></circle>
      </svg>`,

    deniz: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#000820 0%,#001840 40%,#002860 70%,#003070 100%)"></div>
      <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 300 240">
        <ellipse cx="60" cy="60" rx="30" ry="20" fill="#004488" opacity="0.4"/>
        <ellipse cx="200" cy="40" rx="25" ry="16" fill="#0055aa" opacity="0.3"/>
        <ellipse cx="150" cy="100" rx="40" ry="25" fill="#003366" opacity="0.5"/>
        <path d="M30 180 Q60 160 90 180 Q120 200 150 180 Q180 160 210 180 Q240 200 270 180 L300 180 L300 240 L0 240Z" fill="#002244" opacity="0.8"/>
        <path d="M0 200 Q50 185 100 200 Q150 215 200 200 Q250 185 300 200 L300 240 L0 240Z" fill="#001a33" opacity="0.9"/>
        <circle cx="80" cy="120" r="3" fill="#00aaff" opacity="0.4"><animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></circle>
        <circle cx="180" cy="90" r="2" fill="#00ccff" opacity="0.3"><animate attributeName="r" values="2;5;2" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0.1;0.3" dur="2.5s" repeatCount="indefinite"/></circle>
        <circle cx="240" cy="140" r="4" fill="#0088cc" opacity="0.35"><animate attributeName="r" values="4;7;4" dur="3.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.35;0.1;0.35" dur="3.5s" repeatCount="indefinite"/></circle>
        <path d="M20 100 Q40 90 60 100 Q40 110 20 100Z" fill="#00aaff" opacity="0.2"/>
        <path d="M200 130 Q225 118 250 130 Q225 142 200 130Z" fill="#0088ff" opacity="0.2"/>
      </svg>`,
  };

  bg.innerHTML = arkaplanlar[tip] || '';
  scene.insertBefore(bg, scene.firstChild);
}

function _mArkaplanSifirla() {
  const el = document.getElementById('ej-arkaplan');
  if (el) el.remove();
}

// ── Etiket ────────────────────────────────────────────────
function _mEtiketUygula(etiket) {
  // Menü isminin yanına ekle
  const nameEl = document.getElementById('menuName');
  if (!nameEl) return;
  let etiketEl = document.getElementById('_menuEtiket');
  if (!etiketEl) {
    etiketEl = document.createElement('span');
    etiketEl.id = '_menuEtiket';
    etiketEl.style.cssText = 'font-size:.65rem;font-weight:700;background:rgba(108,99,255,.2);border:1px solid rgba(108,99,255,.4);border-radius:99px;padding:2px 7px;margin-left:6px;color:var(--accent)';
    nameEl.parentNode.insertBefore(etiketEl, nameEl.nextSibling);
  }
  etiketEl.textContent = etiket;
}

function _mEtiketSifirla() {
  const el = document.getElementById('_menuEtiket');
  if (el) el.remove();
}

// ── İsim Verme ────────────────────────────────────────────
function _mIsimVer(urunId, urun) {
  const modal = document.getElementById('_mModal');
  if (!modal) return;
  const mevcut = window.currentUserData?.ejderhaIsim || '';
  modal.style.display = 'flex';
  modal.innerHTML = '<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;text-align:center">'
    + '<div style="font-size:2.5rem;margin-bottom:8px">✏️</div>'
    + '<div style="font-weight:900;font-size:1rem;margin-bottom:6px">Ejderhana İsim Ver</div>'
    + '<div style="font-size:.8rem;color:var(--text2);margin-bottom:14px">Ejderhan hangi isimle anılsın?</div>'
    + '<input id="_ejderhaIsimInput" type="text" placeholder="örn: Ateşli, Kral, Minik..." maxlength="20" value="' + mevcut + '"'
    + ' style="width:100%;padding:10px 12px;border-radius:10px;background:var(--surface2);border:1.5px solid var(--border);color:var(--text);font-size:.9rem;outline:none;box-sizing:border-box;margin-bottom:14px;text-align:center;font-family:inherit">'
    + '<button onclick="_mIsimKaydet(\'' + urunId + '\')" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px">Kaydet</button>'
    + '<button onclick="document.getElementById(\'_mModal\').style.display=\'none\'" style="background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;font-family:inherit">Kapat</button>'
    + '</div>';
}

async function _mIsimKaydet(urunId) {
  const isim = document.getElementById('_ejderhaIsimInput')?.value?.trim();
  if (!isim) { _mBildirim('İsim gir!', '#ff6b6b'); return; }
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  // Satın almadıysa altın düş
  const liste = window.currentUserData?.satin_alinanlar || [];
  if (!liste.includes(urunId)) {
    const altin = window.currentUserData?.altin || 0;
    const urun = MARKET_URUNLER[urunId];
    if (altin < urun.fiyat) { _mBildirim('Yeterli altın yok!', '#ff6b6b'); return; }
    liste.push(urunId);
    window.currentUserData.altin = altin - urun.fiyat;
    window.currentUserData.satin_alinanlar = liste;
  }

  window.currentUserData.ejderhaIsim = isim;
  try {
    await db.collection('users').doc(uid).update({
      ejderhaIsim: isim,
      altin: window.currentUserData.altin,
      satin_alinanlar: liste,
    });
    _mBildirim('✏️ Ejderha adı: ' + isim, '#43e97b');
    document.getElementById('_mModal').style.display = 'none';
    // Ejderha başlığını güncelle
    const titleEl = document.querySelector('#ejderha-scene')?.closest('.card')?.querySelector('.card-title');
    if (titleEl) titleEl.textContent = '🐉 ' + isim;
  } catch(e) { _mBildirim('Hata', '#ff6b6b'); }
}

// ── Hediye Gönder ─────────────────────────────────────────
function _mHediyeGonder(urunId, urun) {
  const modal = document.getElementById('_mModal');
  if (!modal) return;
  const sinifArkadaşları = (window.students || []).filter(s => s.uid !== (window.currentUserData?.uid));
  if (!sinifArkadaşları.length) {
    _mBildirim('Sınıf arkadaşın yok', '#f9ca24');
    return;
  }
  const arkList = sinifArkadaşları.map(s =>
    '<button onclick="_mHediyeGonderKisi(\'' + urunId + '\',\'' + s.uid + '\',\'' + (s.name||'').replace(/'/g,'') + '\')" style="width:100%;padding:10px;background:var(--surface2);border:none;border-radius:10px;cursor:pointer;font-size:.85rem;font-weight:700;color:var(--text);text-align:left;font-family:inherit;margin-bottom:6px">' + (s.name || s.email) + '</button>'
  ).join('');

  modal.style.display = 'flex';
  modal.innerHTML = '<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;max-height:70vh;overflow-y:auto">'
    + '<div style="font-size:2rem;text-align:center;margin-bottom:8px">' + urun.ikon + '</div>'
    + '<div style="font-weight:900;font-size:1rem;text-align:center;margin-bottom:6px">' + urun.ad + '</div>'
    + '<div style="font-size:.8rem;color:var(--text2);text-align:center;margin-bottom:14px">Kime gönderiyorsun?</div>'
    + arkList
    + '<button onclick="document.getElementById(\'_mModal\').style.display=\'none\'" style="width:100%;background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;margin-top:8px;font-family:inherit">Kapat</button>'
    + '</div>';
}

async function _mHediyeGonderKisi(urunId, hedefUid, hedefIsim) {
  const urun = MARKET_URUNLER[urunId];
  const uid = auth.currentUser?.uid;
  if (!uid || !urun) return;
  const altin = window.currentUserData?.altin || 0;
  if (altin < urun.fiyat) { _mBildirim('Yeterli altın yok!', '#ff6b6b'); return; }

  window.currentUserData.altin = altin - urun.fiyat;
  try {
    // Gönderenden düş
    await db.collection('users').doc(uid).update({ altin: window.currentUserData.altin });
    // Alıcıya ekle
    const hedefDoc = await db.collection('users').doc(hedefUid).get();
    const hedefAltin = (hedefDoc.data()?.altin || 0) + (urun.deger || 0);
    await db.collection('users').doc(hedefUid).update({ altin: hedefAltin });
    // Bildirim
    await db.collection('notifications').add({
      toUid: hedefUid,
      fromUid: uid,
      text: '🎁 ' + (window.currentUserData?.name || 'Arkadaşın') + ' sana ' + urun.deger + ' altın hediye etti!',
      type: 'hediye', read: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    _mBildirim('🎁 ' + hedefIsim + "'e gönderildi!", '#43e97b');
    document.getElementById('_mModal').style.display = 'none';
    const sayac = document.getElementById('maceraAltinSayac');
    if (sayac) sayac.textContent = window.currentUserData.altin;
  } catch(e) { _mBildirim('Hata', '#ff6b6b'); }
}

// ── Konfeti Efekti ────────────────────────────────────────
function _marketKonfetiEfekt() {
  const aktif = window.currentUserData?.aktif || {};
  let tip = null;
  if (aktif.efekt_konfeti) tip = 'konfeti';
  else if (aktif.efekt_yildiz) tip = 'yildiz';
  else if (aktif.efekt_kalp) tip = 'kalp';
  else if (aktif.efekt_altin) tip = 'altin';
  if (!tip) return;
  const parcalar = { konfeti:['🎊','🎉','✨'], yildiz:['⭐','🌟','💫'], kalp:['💜','💕','❤️'], altin:['💰','🌟','✨'] };
  const emojiler = parcalar[tip];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:hidden';
  document.body.appendChild(wrap);
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = emojiler[Math.floor(Math.random() * emojiler.length)];
      el.style.cssText = 'position:absolute;font-size:20px;left:' + (Math.random()*100) + '%;top:-30px;animation:_mDus ' + (1.2+Math.random()*0.8) + 's ease-in forwards;animation-delay:' + (Math.random()*0.4) + 's';
      wrap.appendChild(el);
    }, i * 40);
  }
  setTimeout(() => wrap.remove(), 2500);
}

// ── Wellness & Soru Hookları ───────────────────────────────
function _marketMoodKontrol() {
  const gun = getTodayKey();
  if (localStorage.getItem('altin_mood_' + gun)) return;
  localStorage.setItem('altin_mood_' + gun, '1');
  marketAldinEkle(MARKET_ALTIN.MOOD, 'Duygu durumu girişi');
}

function _marketWellnessTamKontrol() {
  const gun = getTodayKey();
  if (localStorage.getItem('altin_wellness_' + gun)) return;
  const { data } = _getW();
  const bugun = (data.days || {})[gun] || {};
  if (bugun.mood && bugun.uyku && bugun.enerji) {
    localStorage.setItem('altin_wellness_' + gun, '1');
    marketAldinEkle(MARKET_ALTIN.WELLNESS_TAM, 'Günlük takip tamamlandı');
  }
}

function _marketSoruKontrol(dogru) {
  const gun = getTodayKey();
  const key = 'altin_soru_' + gun;
  const onceki = parseInt(localStorage.getItem(key) || '0');
  const yeni = onceki + dogru;
  localStorage.setItem(key, yeni);
  const kazanilan = Math.floor(yeni/10) - Math.floor(onceki/10);
  if (kazanilan > 0) marketAldinEkle(kazanilan * MARKET_ALTIN.SORU_10, dogru + ' doğru');
}

// ── Market Sayfası ─────────────────────────────────────────
function marketPage() {
  return '<div class="page-title">🛒 Market</div>'
    + '<div class="page-sub" style="margin-bottom:14px">Altınlarınla özel ürünler satın al</div>'
    + '<div id="marketSayfa">' + _marketIcerik() + '</div>';
}

function _marketIcerik() {
  const altin = window.currentUserData?.altin || 0;
  const liste = window.currentUserData?.satin_alinanlar || [];
  const aktif = window.currentUserData?.aktif || {};
  const secili = window._mKat || 'ejderha';

  const katHTML = MARKET_KATEGORILER.map(k =>
    '<button onclick="window._mKat=\'' + k.id + '\';document.getElementById(\'marketSayfa\').innerHTML=_marketIcerik()" style="flex-shrink:0;padding:7px 14px;border-radius:99px;border:none;cursor:pointer;font-size:.78rem;font-weight:700;font-family:inherit;'
    + (k.id===secili ? 'background:var(--accent);color:white' : 'background:var(--surface2);color:var(--text2)') + '">'
    + k.ad + '</button>'
  ).join('');

  const urunler = Object.entries(MARKET_URUNLER).filter(([,u]) => u.kategori === secili);

  const urunHTML = urunler.map(([id, u]) => {
    const sahip = liste.includes(id) || (u.tip === 'isim' && window.currentUserData?.ejderhaIsim);
    const aktifMi = aktif[id] === true || (aktif[id] && typeof aktif[id] === 'string' && new Date(aktif[id]) > new Date());
    return '<div onclick="_mDetay(\'' + id + '\')" style="background:var(--surface2);border-radius:14px;padding:14px;border:1.5px solid '
      + (aktifMi ? 'var(--accent)' : sahip ? 'rgba(67,233,122,.4)' : 'var(--border)')
      + ';cursor:pointer;position:relative">'
      + (aktifMi ? '<div style="position:absolute;top:6px;right:6px;background:var(--accent);color:white;border-radius:99px;padding:2px 7px;font-size:.58rem;font-weight:800">AKTİF</div>' : '')
      + (sahip&&!aktifMi ? '<div style="position:absolute;top:6px;right:6px;background:rgba(67,233,122,.2);color:#43e97b;border-radius:99px;padding:2px 7px;font-size:.58rem;font-weight:800">SAHİP</div>' : '')
      + '<div style="font-size:1.8rem;margin-bottom:6px">' + u.ikon + '</div>'
      + '<div style="font-weight:800;font-size:.85rem;margin-bottom:3px">' + u.ad + '</div>'
      + '<div style="font-size:.68rem;color:var(--text2);margin-bottom:8px">' + u.aciklama + '</div>'
      + '<div style="font-size:.82rem;font-weight:900;color:#f9ca24">💰 ' + u.fiyat + '</div>'
      + '</div>';
  }).join('');

  return '<div style="background:linear-gradient(135deg,#2a2000,#1a1500);border:1px solid #f9ca2444;border-radius:16px;padding:14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">'
    + '<div><div style="font-size:.7rem;color:#8b7a30;margin-bottom:2px">Toplam Altın</div>'
    + '<div style="font-size:1.5rem;font-weight:900;color:#f9ca24">💰 ' + altin + '</div></div>'
    + '<div style="text-align:right;font-size:.65rem;color:#8b7a30;line-height:1.9">'
    + '<div>Duygu girişi: +' + MARKET_ALTIN.MOOD + ' 💰</div>'
    + '<div>Günlük takip tam: +' + MARKET_ALTIN.WELLNESS_TAM + ' 💰</div>'
    + '<div>10 doğru: +' + MARKET_ALTIN.SORU_10 + ' 💰</div></div></div>'
    + '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:14px">' + katHTML + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + urunHTML + '</div>';
}

// ── Ürün Detay Modalı ─────────────────────────────────────
function _mDetay(id) {
  const u = MARKET_URUNLER[id];
  if (!u) return;
  const altin = window.currentUserData?.altin || 0;
  const liste = window.currentUserData?.satin_alinanlar || [];
  const aktif = window.currentUserData?.aktif || {};
  const sahip = liste.includes(id) || (u.tip==='isim' && window.currentUserData?.ejderhaIsim);
  const aktifMi = aktif[id]===true || (aktif[id] && typeof aktif[id]==='string' && new Date(aktif[id]) > new Date());

  // Önizleme
  let onizleme = '';
  if (u.tip === 'renk') {
    // Fill renklerini direkt kullan — filter yok
    const ana = u.renk || '#6c63ff';
    // Koyu versiyon: hex'i karart
    const r = parseInt(ana.slice(1,3),16), g = parseInt(ana.slice(3,5),16), b = parseInt(ana.slice(5,7),16);
    const koyu = '#' + Math.floor(r*0.75).toString(16).padStart(2,'0') + Math.floor(g*0.75).toString(16).padStart(2,'0') + Math.floor(b*0.75).toString(16).padStart(2,'0');
    const acik = '#' + Math.min(255,Math.floor(r*1.2)).toString(16).padStart(2,'0') + Math.min(255,Math.floor(g*1.2)).toString(16).padStart(2,'0') + Math.min(255,Math.floor(b*1.2)).toString(16).padStart(2,'0');
    onizleme = '<div style="width:80px;height:80px;margin:10px auto">'
      + '<svg width="80" height="80" viewBox="20 30 120 140">'
      + '<ellipse cx="80" cy="148" rx="40" ry="28" fill="' + ana + '"/>'
      + '<path d="M50 120 Q10 88 8 56 Q24 72 38 96 Q44 110 52 122" fill="' + koyu + '"/>'
      + '<path d="M110 120 Q150 88 152 56 Q136 72 122 96 Q116 110 108 122" fill="' + koyu + '"/>'
      + '<path d="M66 120 Q70 102 78 98 Q82 96 86 98 Q94 102 94 120" fill="' + ana + '"/>'
      + '<ellipse cx="80" cy="82" rx="36" ry="32" fill="' + ana + '"/>'
      + '<ellipse cx="65" cy="74" rx="11" ry="12" fill="white"/><circle cx="65" cy="75" r="5" fill="#1a0050"/><circle cx="67.5" cy="72.5" r="2" fill="white"/>'
      + '<ellipse cx="95" cy="74" rx="11" ry="12" fill="white"/><circle cx="95" cy="75" r="5" fill="#1a0050"/><circle cx="97.5" cy="72.5" r="2" fill="white"/>'
      + '</svg></div>';
  } else if (u.tip === 'ates') {
    onizleme = '<div style="font-size:2.5rem;filter:' + u.css + ';margin:10px auto;display:block;text-align:center">🔥</div>';
  } else if (u.tip === 'arkaplan') {
    // Küçük arka plan önizlemesi
    const miniBg = { volkan:'linear-gradient(180deg,#1a0500,#8b1a00)', buz:'linear-gradient(180deg,#001830,#004080)', orman:'linear-gradient(180deg,#001a0a,#004020)', uzay:'linear-gradient(180deg,#000010,#0f0050)', deniz:'linear-gradient(180deg,#000820,#003070)' };
    onizleme = '<div style="width:100%;height:70px;border-radius:10px;background:' + (miniBg[u.deger]||'#333') + ';margin:10px auto;display:flex;align-items:center;justify-content:center;font-size:2rem">' + u.ikon + '</div>';
  } else if (u.tip === 'aksesuar') {
    const akOnizleme = { sapka:'🎩', tac:'👑', gozluk:'🕶️', kilic:'⚔️', yildiz:'⭐' };
    onizleme = '<div style="font-size:3rem;margin:10px auto;display:block;text-align:center">' + (akOnizleme[u.deger]||u.ikon) + '</div>';
  } else if (u.tip === 'etiket') {
    onizleme = '<div style="margin:10px auto;text-align:center"><span style="background:rgba(108,99,255,.2);border:1px solid rgba(108,99,255,.4);border-radius:99px;padding:4px 14px;font-size:.85rem;font-weight:700;color:var(--accent)">' + u.deger + '</span></div>';
  } else if (u.tip === 'boost') {
    onizleme = '<div style="font-size:3rem;margin:10px auto;display:block;text-align:center">' + u.ikon + '</div>';
  } else {
    onizleme = '<div style="font-size:3rem;margin:10px auto;display:block;text-align:center">' + u.ikon + '</div>';
  }

  let btn = '';
  if (u.tip === 'isim') {
    btn = '<button onclick="marketSatinAl(\'' + id + '\');document.getElementById(\'_mModal\').style.display=\'none\'" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit">' + (sahip ? '✏️ İsmi Değiştir' : 'İsim Ver — ' + u.fiyat + ' 💰') + '</button>';
  } else if (u.tip === 'hediye' || u.tip === 'meydan') {
    btn = altin >= u.fiyat
      ? '<button onclick="marketSatinAl(\'' + id + '\')" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit">Gönder — ' + u.fiyat + ' 💰</button>'
      : '<div style="text-align:center;font-size:.78rem;color:var(--text2)">' + (u.fiyat-altin) + ' altın daha lazım</div>';
  } else if (sahip && aktifMi) {
    btn = '<button onclick="marketAktifEt(\'' + id + '\')" style="width:100%;padding:11px;border-radius:10px;border:none;background:rgba(255,107,107,.15);color:#ff6b6b;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit;border:1.5px solid #ff6b6b55">✓ Aktif — Kapat</button>';
  } else if (sahip) {
    btn = '<button onclick="marketAktifEt(\'' + id + '\')" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit">Aktif Et</button>';
  } else if (altin >= u.fiyat) {
    btn = '<button onclick="marketSatinAl(\'' + id + '\')" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit">Satın Al — ' + u.fiyat + ' 💰</button>';
  } else {
    btn = '<div style="background:var(--surface2);border-radius:10px;padding:10px;font-size:.78rem;color:var(--text2);text-align:center">' + (u.fiyat-altin) + ' altın daha lazım</div>';
  }

  let modal = document.getElementById('_mModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = '_mModal';
    modal.onclick = e => { if(e.target===modal) modal.style.display='none'; };
    document.body.appendChild(modal);
  }
  modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:2000;align-items:center;justify-content:center;backdrop-filter:blur(6px)';
  modal.innerHTML = '<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;text-align:center">'
    + '<div style="font-size:1.8rem;margin-bottom:4px">' + u.ikon + '</div>'
    + '<div style="font-weight:900;font-size:1rem;margin-bottom:4px">' + u.ad + '</div>'
    + onizleme
    + '<div style="font-size:.78rem;color:var(--text2);margin-bottom:10px;line-height:1.5">' + u.aciklama + '</div>'
    + '<div style="font-size:1rem;font-weight:900;color:#f9ca24;margin-bottom:14px">💰 ' + u.fiyat + '</div>'
    + btn
    + '<br><button onclick="document.getElementById(\'_mModal\').style.display=\'none\'" style="background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;margin-top:10px;font-family:inherit">Kapat</button>'
    + '</div>';
}

// ── Yardımcılar ────────────────────────────────────────────
function _mBildirim(mesaj, renk) {
  const div = document.createElement('div');
  div.textContent = mesaj;
  div.style.cssText = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);background:var(--surface);border:1.5px solid ' + renk + ';color:' + renk + ';font-weight:700;font-size:.85rem;padding:10px 20px;border-radius:12px;z-index:9999;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.4)';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}

const _mStyle = document.createElement('style');
_mStyle.textContent = '@keyframes _mDus{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
document.head.appendChild(_mStyle);

setTimeout(_marketUygulaEfektler, 800);
