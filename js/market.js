// ============================================================
// 💰 MARKET SİSTEMİ v2
// ============================================================

const MARKET_URUNLER = {
  // 🐉 EJDERHA RENKLERİ
  ejderha_kizil:     { kategori:'ejderha', ad:'Kızıl Ejderha',     fiyat:500,  ikon:'🔴', aciklama:'Ejderhanın rengini kızıla çevirir', tip:'renk', css:'hue-rotate(330deg) saturate(1.5)' },
  ejderha_buz:       { kategori:'ejderha', ad:'Buz Ejderhası',     fiyat:500,  ikon:'🔵', aciklama:'Ejderhanın rengini maviye çevirir',  tip:'renk', css:'hue-rotate(180deg) saturate(1.3) brightness(1.1)' },
  ejderha_zumrut:    { kategori:'ejderha', ad:'Zümrüt Ejderha',    fiyat:500,  ikon:'🟢', aciklama:'Ejderhanın rengini yeşile çevirir',  tip:'renk', css:'hue-rotate(100deg) saturate(1.4)' },
  ejderha_altin:     { kategori:'ejderha', ad:'Altın Ejderha',     fiyat:800,  ikon:'🟡', aciklama:'Ejderhanı altın rengine boyar',      tip:'renk', css:'hue-rotate(45deg) saturate(2) brightness(1.15)' },
  ejderha_gece:      { kategori:'ejderha', ad:'Gece Ejderhası',    fiyat:600,  ikon:'⚫', aciklama:'Ejderhanı karanlık renge boyar',     tip:'renk', css:'hue-rotate(260deg) saturate(0.4) brightness(0.7)' },
  ejderha_pembe:     { kategori:'ejderha', ad:'Pembe Ejderha',     fiyat:400,  ikon:'🩷', aciklama:'Ejderhanı pembeye boyar',           tip:'renk', css:'hue-rotate(290deg) saturate(1.6)' },
  // 🔥 ATEŞ RENKLERİ
  ates_mavi:         { kategori:'ates', ad:'Mavi Alev',    fiyat:350, ikon:'🔵', aciklama:'Ejderhanın ateşini maviye çevirir',   tip:'ates', css:'hue-rotate(180deg) saturate(1.5)' },
  ates_yesil:        { kategori:'ates', ad:'Yeşil Alev',   fiyat:350, ikon:'🟢', aciklama:'Ejderhanın ateşini yeşile çevirir',  tip:'ates', css:'hue-rotate(100deg) saturate(1.8)' },
  ates_mor:          { kategori:'ates', ad:'Mor Alev',     fiyat:400, ikon:'🟣', aciklama:'Ejderhanın ateşini mora çevirir',    tip:'ates', css:'hue-rotate(270deg) saturate(1.6)' },
  ates_pembe:        { kategori:'ates', ad:'Pembe Alev',   fiyat:300, ikon:'🩷', aciklama:'Ejderhanın ateşini pembeleştirir',  tip:'ates', css:'hue-rotate(300deg) saturate(1.4)' },
  // ✨ EFEKTLERi
  efekt_konfeti:     { kategori:'efekt', ad:'Konfeti',        fiyat:400, ikon:'🎊', aciklama:'Soru girişi yapınca konfeti düşer',      tip:'efekt', deger:'konfeti' },
  efekt_yildiz:      { kategori:'efekt', ad:'Yıldız Yağmuru', fiyat:500, ikon:'⭐', aciklama:'Soru girişi yapınca yıldızlar uçar',    tip:'efekt', deger:'yildiz' },
  efekt_kalp:        { kategori:'efekt', ad:'Kalp Yağmuru',   fiyat:350, ikon:'💜', aciklama:'Soru girişi yapınca kalpler uçar',     tip:'efekt', deger:'kalp' },
  // 🏝️ HARİTA
  harita_sis_mor:    { kategori:'harita', ad:'Mor Sis',      fiyat:450, ikon:'🟣', aciklama:'Haritadaki sis rengini mora çevirir',   tip:'harita_sis', deger:'mor' },
  harita_sis_kizil:  { kategori:'harita', ad:'Kızıl Sis',    fiyat:450, ikon:'🔴', aciklama:'Haritadaki sis rengini kızıla çevirir', tip:'harita_sis', deger:'kizil' },
  harita_sis_yesil:  { kategori:'harita', ad:'Yeşil Sis',    fiyat:400, ikon:'🟢', aciklama:'Haritadaki sis rengini yeşile çevirir', tip:'harita_sis', deger:'yesil' },
  harita_bayrak_altin:{ kategori:'harita', ad:'Altın Bayrak', fiyat:300, ikon:'🏅', aciklama:'Fethedilen adalarda altın bayrak rengi', tip:'harita_bayrak', deger:'#f9ca24' },
  harita_bayrak_mor:  { kategori:'harita', ad:'Mor Bayrak',   fiyat:250, ikon:'🟣', aciklama:'Fethedilen adalarda mor bayrak rengi',  tip:'harita_bayrak', deger:'#a29bfe' },
  harita_bayrak_kizil:{ kategori:'harita', ad:'Kızıl Bayrak', fiyat:250, ikon:'🔴', aciklama:'Fethedilen adalarda kızıl bayrak rengi',tip:'harita_bayrak', deger:'#ff6b6b' },
  // 🎨 PROFİL TEMALAR
  profil_uzay:       { kategori:'profil', ad:'Uzay Teması',   fiyat:500, ikon:'🚀', aciklama:'Uygulama arka planını uzay temasına çevirir', tip:'profil_bg', css:'linear-gradient(135deg,#0a0a2e,#1a1060,#0d0030)' },
  profil_orman:      { kategori:'profil', ad:'Orman Teması',  fiyat:500, ikon:'🌲', aciklama:'Uygulama arka planını orman temasına çevirir', tip:'profil_bg', css:'linear-gradient(135deg,#0a2a0a,#1a4020,#0d2010)' },
  profil_galaksi:    { kategori:'profil', ad:'Galaksi Teması',fiyat:700, ikon:'🌌', aciklama:'Uygulama arka planını galaksi temasına çevirir', tip:'profil_bg', css:'linear-gradient(135deg,#1a0a30,#2d1060,#0a0020)' },
};

const MARKET_KATEGORILER = [
  { id:'ejderha', ad:'🐉 Ejderha Rengi' },
  { id:'ates',    ad:'🔥 Ateş Rengi'   },
  { id:'efekt',   ad:'✨ Efektler'      },
  { id:'harita',  ad:'🏝️ Harita'       },
  { id:'profil',  ad:'🎨 Profil Tema'  },
];

// ── Altın Kazanma ──────────────────────────────────────────
const MARKET_ALTIN = { MOOD:15, WELLNESS_TAM:100, SORU_10:5, SERI_7:100 };

async function marketAldinEkle(miktar, sebep) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const simdiki = window.currentUserData?.altin || 0;
  const yeni = simdiki + miktar;
  window.currentUserData.altin = yeni;
  try {
    await db.collection('users').doc(uid).update({ altin: yeni });
    // Altın animasyonu
    const div = document.createElement('div');
    div.textContent = '+' + miktar + ' 💰';
    div.style.cssText = 'position:fixed;top:60px;right:16px;background:#2a2000;border:1.5px solid #f9ca24;color:#f9ca24;font-weight:900;font-size:.9rem;padding:8px 16px;border-radius:99px;z-index:9999;animation:_mAltin .8s ease-out forwards';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 900);
    // Sayacı güncelle
    const sayac = document.getElementById('maceraAltinSayac');
    if (sayac) sayac.textContent = yeni;
  } catch(e) { console.error('Altın ekle hata:', e); }
}

// ── Satın Al ──────────────────────────────────────────────
async function marketSatinAl(urunId) {
  const urun = MARKET_URUNLER[urunId];
  if (!urun) return;
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const altin = window.currentUserData?.altin || 0;
  if (altin < urun.fiyat) {
    _mBildirim('Yeterli altın yok! 💰', '#ff6b6b'); return;
  }
  const liste = window.currentUserData?.satin_alinanlar || [];
  if (liste.includes(urunId)) {
    _mBildirim('Zaten sahipsin!', '#f9ca24'); return;
  }
  liste.push(urunId);
  const yeniAltin = altin - urun.fiyat;
  window.currentUserData.altin = yeniAltin;
  window.currentUserData.satin_alinanlar = liste;
  try {
    await db.collection('users').doc(uid).update({ altin: yeniAltin, satin_alinanlar: liste });
    _mBildirim(urun.ikon + ' ' + urun.ad + ' satın alındı!', '#43e97b');
    // Market'i yenile
    const el = document.getElementById('marketSayfa');
    if (el) el.innerHTML = _marketIcerik();
    // Altın sayacını güncelle
    const sayac = document.getElementById('maceraAltinSayac');
    if (sayac) sayac.textContent = yeniAltin;
  } catch(e) { _mBildirim('Hata oluştu', '#ff6b6b'); }
}

// ── Aktif Et ──────────────────────────────────────────────
async function marketAktifEt(urunId) {
  const urun = MARKET_URUNLER[urunId];
  if (!urun) return;
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const aktif = window.currentUserData?.aktif || {};
  // Zaten aktifse → kapat (toggle)
  if (aktif[urunId] === true) {
    delete aktif[urunId];
    window.currentUserData.aktif = aktif;
    try {
      await db.collection('users').doc(uid).update({ aktif: aktif });
      _mBildirim(urun.ikon + ' Deaktif edildi', '#f9ca24');
      // Sıfırla
      if (urun.tip === 'renk') document.querySelectorAll('#dragon-svg').forEach(el => { el.style.filter = ''; });
      if (urun.tip === 'ates') document.querySelectorAll('#fire-group').forEach(el => { el.style.filter = ''; });
      if (urun.tip === 'profil_bg') { const ov=document.getElementById('_temaOverlay'); if(ov) ov.style.display='none'; }
      if (urun.tip === 'harita_sis') document.querySelectorAll('[id^="sis_"]').forEach(el => { el.style.filter = ''; });
      const el = document.getElementById('marketSayfa');
      if (el) el.innerHTML = _marketIcerik();
    } catch(e) { _mBildirim('Hata oluştu', '#ff6b6b'); }
    return;
  }
  // Aynı tipteki eski aktifi kaldır
  Object.keys(aktif).forEach(k => {
    const u = MARKET_URUNLER[k];
    if (u && u.tip === urun.tip && k !== urunId) delete aktif[k];
  });
  aktif[urunId] = true;
  window.currentUserData.aktif = aktif;
  try {
    await db.collection('users').doc(uid).update({ aktif: aktif });
    _mBildirim(urun.ikon + ' ' + urun.ad + ' aktif edildi!', '#43e97b');
    // Efekti hemen uygula
    _marketUygulaEfektler();
    // Market'i yenile
    const el = document.getElementById('marketSayfa');
    if (el) el.innerHTML = _marketIcerik();
  } catch(e) { _mBildirim('Hata oluştu', '#ff6b6b'); }
}

// ── Efekt Uygula ──────────────────────────────────────────
function _marketUygulaEfektler() {
  const aktif = window.currentUserData?.aktif || {};
  Object.keys(aktif).forEach(id => {
    if (!aktif[id]) return;
    const u = MARKET_URUNLER[id];
    if (!u) return;
    if (u.tip === 'renk') {
      // Tüm dragon-svg elementlerine uygula
      document.querySelectorAll('#dragon-svg').forEach(el => { el.style.filter = u.css; });
    }
    if (u.tip === 'ates') {
      document.querySelectorAll('#fire-group').forEach(el => { el.style.filter = u.css; });
    }
    if (u.tip === 'profil_bg') {
      // CSS variable değiştir - tüm app etkilensin
      const renk1 = u.css.match(/#[a-fA-F0-9]{6}/g)?.[0] || '#0f1117';
      const renk2 = u.css.match(/#[a-fA-F0-9]{6}/g)?.[1] || '#1a1d2e';
      document.documentElement.style.setProperty('--bg', renk1);
      document.documentElement.style.setProperty('--surface', renk2);
      // Content area
      const content = document.getElementById('content');
      if (content) content.style.background = renk1;
    }
    if (u.tip === 'harita_sis') {
      // Harita sisi - SVG elipsleri
      document.querySelectorAll('[id^="sis_"]').forEach(el => { el.style.filter = u.css; });
    }
    // Harita sis rengi
    if (u.tip === 'harita' && id.startsWith('harita_sis')) {
      document.querySelectorAll('.sis-ada, .sis-bc, .sis-bc1, .sis-bc2, .sis-bc3, .sis-bc4').forEach(el => {
        if (id === 'harita_sis_mor') el.style.filter = 'hue-rotate(260deg)';
        else if (id === 'harita_sis_kizil') el.style.filter = 'hue-rotate(330deg) saturate(1.5)';
      });
    }
  });
}

// ── Konfeti Efekti ────────────────────────────────────────
function _marketKonfetiEfekt() {
  const aktif = window.currentUserData?.aktif || {};
  let tip = null;
  if (aktif.efekt_konfeti) tip = 'konfeti';
  else if (aktif.efekt_yildiz) tip = 'yildiz';
  else if (aktif.efekt_kalp) tip = 'kalp';
  if (!tip) return;

  const parcalar = { konfeti:['🎊','🎉','✨'], yildiz:['⭐','🌟','💫'], kalp:['💜','💕','❤️'] };
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
  const key = 'altin_mood_' + gun;
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, '1');
  marketAldinEkle(MARKET_ALTIN.MOOD, 'Duygu durumu girişi');
}

function _marketWellnessTamKontrol() {
  const gun = getTodayKey();
  const key = 'altin_wellness_' + gun;
  if (localStorage.getItem(key)) return;
  const { data } = _getW();
  const bugun = (data.days || {})[gun] || {};
  if (bugun.mood && bugun.uyku && bugun.enerji) {
    localStorage.setItem(key, '1');
    marketAldinEkle(MARKET_ALTIN.WELLNESS_TAM, 'Wellness tam dolduruldu');
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
    + (k.id === secili ? 'background:var(--accent);color:white' : 'background:var(--surface2);color:var(--text2)') + '">'
    + k.ad + '</button>'
  ).join('');

  const urunler = Object.entries(MARKET_URUNLER).filter(([, u]) => u.kategori === secili);

  const urunHTML = urunler.map(([id, u]) => {
    const sahip = liste.includes(id);
    const aktifMi = aktif[id] === true;
    return '<div onclick="_mDetay(\'' + id + '\')" style="background:var(--surface2);border-radius:14px;padding:14px;border:1.5px solid '
      + (aktifMi ? 'var(--accent)' : sahip ? 'rgba(67,233,122,.4)' : 'var(--border)')
      + ';cursor:pointer;position:relative">'
      + (aktifMi ? '<div style="position:absolute;top:6px;right:6px;background:var(--accent);color:white;border-radius:99px;padding:2px 7px;font-size:.58rem;font-weight:800">AKTİF</div>' : '')
      + (sahip && !aktifMi ? '<div style="position:absolute;top:6px;right:6px;background:rgba(67,233,122,.2);color:#43e97b;border-radius:99px;padding:2px 7px;font-size:.58rem;font-weight:800">SAHİP</div>' : '')
      + '<div style="font-size:1.8rem;margin-bottom:6px">' + u.ikon + '</div>'
      + '<div style="font-weight:800;font-size:.85rem;margin-bottom:3px">' + u.ad + '</div>'
      + '<div style="font-size:.68rem;color:var(--text2);margin-bottom:8px">' + u.aciklama + '</div>'
      + '<div style="font-size:.82rem;font-weight:900;color:#f9ca24">💰 ' + u.fiyat + '</div>'
      + '</div>';
  }).join('');

  return '<div style="background:linear-gradient(135deg,#2a2000,#1a1500);border:1px solid #f9ca2444;border-radius:16px;padding:14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">'
    + '<div><div style="font-size:.7rem;color:#8b7a30;margin-bottom:2px">Toplam Altın</div>'
    + '<div style="font-size:1.5rem;font-weight:900;color:#f9ca24">💰 ' + altin + '</div></div>'
    + '<div style="text-align:right;font-size:.65rem;color:#8b7a30;line-height:1.8">'
    + '<div>Mood girişi: +' + MARKET_ALTIN.MOOD + ' 💰</div>'
    + '<div>Wellness tam: +' + MARKET_ALTIN.WELLNESS_TAM + ' 💰</div>'
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
  const sahip = liste.includes(id);
  const aktifMi = aktif[id] === true;

  let onizleme = '';
  if (u.tip === 'renk') {
    // Ejderhanın gerçek SVG'sini küçük göster - base renk #6c63ff
    onizleme = '<div style="width:64px;height:64px;margin:10px auto;position:relative">'
      + '<svg width="64" height="64" viewBox="0 0 160 160" style="filter:' + u.css + '">'
      + '<ellipse cx="80" cy="110" rx="40" ry="28" fill="#6c63ff"/>'
      + '<ellipse cx="80" cy="72" rx="36" ry="32" fill="#6c63ff"/>'
      + '<ellipse cx="68" cy="60" rx="10" ry="7" fill="#5040c0" opacity=".8"/>'
      + '<ellipse cx="92" cy="60" rx="10" ry="7" fill="#5040c0" opacity=".8"/>'
      + '<circle cx="72" cy="68" r="5" fill="white"/>'
      + '<circle cx="88" cy="68" r="5" fill="white"/>'
      + '<circle cx="73" cy="68" r="2.5" fill="#222"/>'
      + '<circle cx="89" cy="68" r="2.5" fill="#222"/>'
      + '</svg></div>';
  } else if (u.tip === 'ates') {
    onizleme = '<div style="font-size:2.5rem;' + (u.css ? 'filter:' + u.css + ';' : '') + 'margin:10px auto;display:block;text-align:center">🔥</div>';
  } else if (u.tip === 'profil_bg') {
    // Transparan overlay önizleme
    onizleme = '<div style="width:100%;height:60px;border-radius:12px;'
      + 'background:' + u.css + ';'
      + 'margin:10px auto;border:1px solid rgba(255,255,255,.15);'
      + 'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">'
      + '<div style="position:absolute;inset:0;background:rgba(0,0,0,.3)"></div>'
      + '<div style="position:relative;color:white;font-size:.75rem;font-weight:700">Önizleme</div>'
      + '</div>';
  } else if (u.tip === 'harita_sis') {
    const sisRenkler = { mor:'rgba(120,80,200,.7)', kizil:'rgba(200,60,60,.7)', yesil:'rgba(60,160,80,.7)' };
    const sisR = sisRenkler[u.deger] || 'rgba(200,215,230,.7)';
    onizleme = '<div style="margin:10px auto;width:80px;height:40px;border-radius:50%;background:radial-gradient(ellipse,' + sisR + ' 0%,transparent 80%);filter:blur(4px)"></div>';
  } else if (u.tip === 'harita_bayrak') {
    onizleme = '<div style="font-size:2rem;margin:10px auto;display:block;text-align:center;color:' + (u.deger||'#f9ca24') + '">🚩</div>';
  } else {
    onizleme = '<div style="font-size:2.5rem;margin:10px auto;display:block;text-align:center">' + u.ikon + '</div>';
  }

  let btn = '';
  if (sahip && aktifMi) btn = '<button onclick="marketAktifEt(\'' + id + '\');document.getElementById(\'_mModal\').style.display=\'none\'" style="width:100%;padding:11px;border-radius:10px;border:none;background:rgba(255,107,107,.15);color:#ff6b6b;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit;border:1.5px solid #ff6b6b44">✓ Aktif — Kapat</button>';
  else if (sahip) btn = '<button onclick="marketAktifEt(\'' + id + '\');document.getElementById(\'_mModal\').style.display=\'none\'" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit">Aktif Et</button>';
  else if (altin >= u.fiyat) btn = '<button onclick="marketSatinAl(\'' + id + '\');document.getElementById(\'_mModal\').style.display=\'none\'" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit">Satın Al — ' + u.fiyat + ' 💰</button>';
  else btn = '<div style="background:var(--surface2);border-radius:10px;padding:10px;font-size:.78rem;color:var(--text2);text-align:center">' + (u.fiyat - altin) + ' altın daha lazım</div>';

  let modal = document.getElementById('_mModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = '_mModal';
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
    document.body.appendChild(modal);
  }
  modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:2000;align-items:center;justify-content:center;backdrop-filter:blur(6px)';
  modal.innerHTML = '<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;text-align:center">'
    + '<div style="font-size:2rem;margin-bottom:4px">' + u.ikon + '</div>'
    + '<div style="font-weight:900;font-size:1rem;margin-bottom:6px">' + u.ad + '</div>'
    + onizleme
    + '<div style="font-size:.8rem;color:var(--text2);margin-bottom:10px;line-height:1.5">' + u.aciklama + '</div>'
    + '<div style="font-size:1rem;font-weight:900;color:#f9ca24;margin-bottom:14px">💰 ' + u.fiyat + '</div>'
    + btn
    + '<br><button onclick="document.getElementById(\'_mModal\').style.display=\'none\'" style="background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;margin-top:10px;font-family:inherit">Kapat</button>'
    + '</div>';
}

// ── Yardımcılar ────────────────────────────────────────────
// Haritayı yeniden render et
function _marketHaritaYenile() {
  const wrap = document.getElementById('haritaWrap');
  if (!wrap) return; // Harita sayfada değil, render edilince global'den okuyacak
  if (typeof maceraHarita === 'function') {
    // Haritanın olduğu card'ı bul ve yenile
    const card = wrap.closest('.card');
    if (card) card.outerHTML = maceraHarita();
  }
}

function _mBildirim(mesaj, renk) {
  const div = document.createElement('div');
  div.textContent = mesaj;
  div.style.cssText = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);background:var(--surface);border:1.5px solid ' + renk + ';color:' + renk + ';font-weight:700;font-size:.85rem;padding:10px 20px;border-radius:12px;z-index:9999;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.4)';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}

// CSS
const _mStyle = document.createElement('style');
_mStyle.textContent = '@keyframes _mAltin{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-40px)}} @keyframes _mDus{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
document.head.appendChild(_mStyle);

// Sayfa açılınca efektleri uygula
setTimeout(_marketUygulaEfektler, 800);
