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
  aksesuar_gozluk: { kategori:'aksesuar', ad:'Güneş Gözlüğü',   fiyat:350, ikon:'🕶️', aciklama:'Ejderhaya güneş gözlüğü tak',      tip:'aksesuar', deger:'gozluk' },
  aksesuar_fiyonk: { kategori:'aksesuar', ad:'Pembe Fiyonk',     fiyat:300, ikon:'🎀', aciklama:'Ejderhanın başında pembe fiyonk',   tip:'aksesuar', deger:'fiyonk' },
  aksesuar_kolye:  { kategori:'aksesuar', ad:'Elmas Kolye',      fiyat:450, ikon:'💎', aciklama:'Ejderhanın boynunda elmas kolye',   tip:'aksesuar', deger:'kolye' },
  aksesuar_yildiz: { kategori:'aksesuar', ad:'Yıldız Tacı',      fiyat:450, ikon:'⭐', aciklama:'Ejderhanın başında yıldız tacı',    tip:'aksesuar', deger:'yildiz' },

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
  hediye_altin_50:   { kategori:'sosyal', ad:'50 Altın Hediye',   fiyat:80,   ikon:'🎁', aciklama:'Bir arkadaşına 50 altın gönder',   tip:'hediye', deger:50 },
  hediye_altin_100:  { kategori:'sosyal', ad:'100 Altın Hediye',  fiyat:150,  ikon:'🎀', aciklama:'Bir arkadaşına 100 altın gönder',  tip:'hediye', deger:100 },
  hediye_altin_250:  { kategori:'sosyal', ad:'250 Altın Hediye',  fiyat:350,  ikon:'💝', aciklama:'Bir arkadaşına 250 altın gönder',  tip:'hediye', deger:250 },
  hediye_altin_500:  { kategori:'sosyal', ad:'500 Altın Hediye',  fiyat:650,  ikon:'💰', aciklama:'Bir arkadaşına 500 altın gönder',  tip:'hediye', deger:500 },
  hediye_ejderha_isi:{ kategori:'sosyal', ad:'Ejderha Isısı',     fiyat:200,  ikon:'🔥', aciklama:'Arkadaşının ejderhasına 50 XP hediye et', tip:'hediye_xp', deger:50 },
  hediye_sans:       { kategori:'sosyal', ad:'Şans Zarı',         fiyat:100,  ikon:'🎲', aciklama:'Arkadaşına rastgele 10-200 altın gönder', tip:'hediye_sans', deger:0 },
  hediye_motivasyon: { kategori:'sosyal', ad:'Motivasyon Kartı',  fiyat:50,   ikon:'💌', aciklama:'Arkadaşına özel motivasyon mesajı gönder', tip:'hediye_mesaj', deger:'motivasyon' },
  hediye_tebrik:     { kategori:'sosyal', ad:'Tebrik Kartı',      fiyat:50,   ikon:'🎊', aciklama:'Arkadaşını kutla, bildirim gönder', tip:'hediye_mesaj', deger:'tebrik' },
  hediye_emoji_set:  { kategori:'sosyal', ad:'Emoji Paketi',      fiyat:300,  ikon:'😄', aciklama:'Arkadaşına özel emoji seti hediye et', tip:'hediye_ozel', deger:'emoji' },
  meydan_okuma:      { kategori:'sosyal', ad:'Meydan Okuma',      fiyat:200,  ikon:'⚔️', aciklama:'Arkadaşına haftalık soru yarışı gönder', tip:'meydan', deger:'hafta', tuket:true },

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

  // Aynı tipteki eskiyi kaldır — aksesuar için alt tip kontrolü
  Object.keys(aktif).forEach(k => {
    const u = MARKET_URUNLER[k];
    if (!u || u.tip !== urun.tip) return;
    // Aksesuar: sadece aynı pozisyondaki eskiyi kaldır
    if (urun.tip === 'aksesuar') {
      const basGrubu = ['sapka','tac','yildiz'];
      const yuzGrubu = ['gozluk'];
      const boynGrubu = ['kolye'];
      const fiyonkGrubu = ['fiyonk'];
      const hangiGrup = (d) => basGrubu.includes(d) ? 'bas' : yuzGrubu.includes(d) ? 'yuz' : boynGrubu.includes(d) ? 'boyn' : fiyonkGrubu.includes(d) ? 'fiyonk' : 'diger';
      if (hangiGrup(u.deger) === hangiGrup(urun.deger)) delete aktif[k];
    } else {
      delete aktif[k];
    }
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
    if (u.tip === 'aksesuar') { _mAksesuarUygula(u.deger); }
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
  if (urun.tip === 'aksesuar') { _mAksesuarSifirla(urun.deger); }
  if (urun.tip === 'arkaplan') _mArkaplanSifirla();
  if (urun.tip === 'etiket') _mEtiketSifirla();
}

// ── Aksesuar ──────────────────────────────────────────────
// Aksesuar SVG içerikleri
const _AKSESUAR_SVG = {
  sapka:  '<ellipse cx="80" cy="54" rx="34" ry="7" fill="#1a1030"/><path d="M56 54 Q58 20 80 14 Q102 20 104 54 Z" fill="#1a1030"/><ellipse cx="80" cy="54" rx="34" ry="5" fill="none" stroke="#f9ca24" stroke-width="2.5"/><ellipse cx="80" cy="17" rx="6" ry="4" fill="#f9ca24"/>',
  tac:    '<rect x="54" y="50" width="52" height="10" rx="2" fill="#f9ca24"/><polygon points="54,50 60,34 66,50" fill="#f9ca24"/><polygon points="67,50 74,30 81,50" fill="#f9ca24"/><polygon points="80,50 87,30 94,50" fill="#f9ca24"/><polygon points="94,50 100,34 106,50" fill="#f9ca24"/><circle cx="63" cy="34" r="3" fill="#ff4444"/><circle cx="77" cy="30" r="3.5" fill="#4444ff"/><circle cx="91" cy="30" r="3.5" fill="#44cc44"/><circle cx="103" cy="34" r="3" fill="#ff4444"/>',
  gozluk: '<rect x="46" y="67" width="24" height="17" rx="8" fill="#111" opacity="0.85"/><rect x="90" y="67" width="24" height="17" rx="8" fill="#111" opacity="0.85"/><ellipse cx="54" cy="71" rx="4" ry="2.5" fill="white" opacity="0.25"/><ellipse cx="98" cy="71" rx="4" ry="2.5" fill="white" opacity="0.25"/><path d="M70 74 Q80 70 90 74" stroke="#333" stroke-width="2.5" fill="none"/><path d="M46 74 Q38 78 36 80" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M114 74 Q122 78 124 80" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  fiyonk: '<path d="M80,46 Q68,38 62,44 Q66,50 80,48 Z" fill="#ff6b9d"/><path d="M80,46 Q92,38 98,44 Q94,50 80,48 Z" fill="#ff6b9d"/><circle cx="80" cy="47" r="4" fill="#ff4488"/><path d="M76,47 Q72,52 70,56" stroke="#ff6b9d" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M84,47 Q88,52 90,56" stroke="#ff6b9d" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  kolye:  '<path d="M60 110 Q70 118 80 116 Q90 118 100 110" fill="none" stroke="#f9ca24" stroke-width="1.5"/><polygon points="80,116 74,122 80,132 86,122" fill="#7dd3fc"/><polygon points="80,116 74,122 80,124" fill="white" opacity="0.5"/><polygon points="80,132 74,122 80,124" fill="#38bdf8" opacity="0.7"/><polygon points="80,132 86,122 80,124" fill="#0ea5e9" opacity="0.7"/><circle cx="78" cy="120" r="1.5" fill="white" opacity="0.8"/>',
  yildiz: '<path d="M52 56 Q80 50 108 56 Q108 62 80 62 Q52 62 52 56 Z" fill="#5a4fcf"/><polygon points="80,36 83,46 94,46 85,53 88,63 80,56 72,63 75,53 66,46 77,46" fill="#f9ca24"/><polygon points="60,44 62,50 68,50 63,54 65,60 60,56 55,60 57,54 52,50 58,50" fill="#f9ca24" opacity="0.85"/><polygon points="100,44 102,50 108,50 103,54 105,60 100,56 95,60 97,54 92,50 98,50" fill="#f9ca24" opacity="0.85"/>',
};
const _AKSESUAR_SLOT = {
  sapka:'ej-ak-bas', tac:'ej-ak-bas', yildiz:'ej-ak-bas',
  gozluk:'ej-ak-yuz', kolye:'ej-ak-kolye', fiyonk:'ej-ak-fiyonk',
};
function _mAksesuarUygula(tip) {
  const slot = _AKSESUAR_SLOT[tip] || 'ej-ak-bas';
  const el = document.getElementById(slot);
  if (el) el.innerHTML = _AKSESUAR_SVG[tip] || '';
}
function _mAksesuarSifirla(tip) {
  const slot = _AKSESUAR_SLOT[tip] || 'ej-ak-bas';
  const el = document.getElementById(slot);
  if (el) el.innerHTML = '';
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
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#1a0800,#3d0f00,#8b1a00,#cc3300)"></div>
      <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice">
        <polygon points="0,240 50,40 80,80 110,35 160,240" fill="#2a0f00"/>
        <polygon points="160,240 180,60 210,140 240,100 270,160 300,240" fill="#2a0f00"/>
        <ellipse cx="110" cy="35" rx="8" ry="5" fill="#ff6600"/>
        <ellipse cx="110" cy="35" rx="5" ry="3" fill="#ffaa00"/>
        <path d="M105 35 Q110 10 115 35" stroke="#ff4400" stroke-width="3" fill="none"/>
        <circle cx="90" cy="20" r="3" fill="#ff6600"><animate attributeName="cy" values="20;0;20" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="125" cy="15" r="2" fill="#ffaa00"><animate attributeName="cy" values="15;0;15" dur="1.5s" repeatCount="indefinite" begin="0.5s"/><animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" begin="0.5s"/></circle>
        <path d="M0 200 Q150 185 300 200 L300 240 L0 240Z" fill="#cc2200" opacity="0.8"/>
        <path d="M0 215 Q150 205 300 215 L300 240 L0 240Z" fill="#ff4400" opacity="0.5">
          <animate attributeName="d" values="M0 215 Q150 205 300 215 L300 240 L0 240Z;M0 218 Q150 208 300 218 L300 240 L0 240Z;M0 215 Q150 205 300 215 L300 240 L0 240Z" dur="3s" repeatCount="indefinite"/>
        </path>
        <circle cx="70" cy="60" r="2" fill="#ff8800"><animate attributeName="cy" values="60;30;60" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite"/></circle>
        <circle cx="150" cy="50" r="1.5" fill="#ffcc00"><animate attributeName="cy" values="50;20;50" dur="2.2s" repeatCount="indefinite" begin="0.8s"/><animate attributeName="opacity" values="1;0;1" dur="2.2s" repeatCount="indefinite" begin="0.8s"/></circle>
      </svg>`,

    buz: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#001830,#002a4a,#003d6e,#004080)"></div>
      <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice">
        <polygon points="0,240 30,100 60,160 100,60 130,140 160,80 190,150 220,90 260,160 300,100 300,240" fill="#002040" opacity="0.9"/>
        <polygon points="100,60 88,88 112,88" fill="#80d4ff" opacity="0.7"/>
        <polygon points="160,80 148,108 172,108" fill="#aae8ff" opacity="0.6"/>
        <line x1="100" y1="60" x2="100" y2="30" stroke="#80d4ff" stroke-width="1.5" opacity="0.5"/>
        <line x1="95" y1="42" x2="105" y2="42" stroke="#80d4ff" stroke-width="1" opacity="0.4"/>
        <circle cx="50" cy="10" r="2" fill="white" opacity="0.8"><animate attributeName="cy" values="10;240;10" dur="4s" repeatCount="indefinite"/></circle>
        <circle cx="120" cy="0" r="1.5" fill="white" opacity="0.7"><animate attributeName="cy" values="0;240;0" dur="5s" repeatCount="indefinite" begin="1s"/></circle>
        <circle cx="200" cy="20" r="2" fill="#80d4ff" opacity="0.6"><animate attributeName="cy" values="20;240;20" dur="3.5s" repeatCount="indefinite" begin="2s"/></circle>
        <circle cx="270" cy="5" r="1.5" fill="white"><animate attributeName="cy" values="5;240;5" dur="4.5s" repeatCount="indefinite" begin="0.5s"/></circle>
        <path d="M0 180 Q75,165 150,175 Q225,185 300,175" stroke="#4488cc" stroke-width="1.5" fill="none" opacity="0.4"><animate attributeName="d" values="M0 180 Q75,165 150,175 Q225,185 300,175;M0 183 Q75,170 150,178 Q225,188 300,178;M0 180 Q75,165 150,175 Q225,185 300,175" dur="4s" repeatCount="indefinite"/></path>
      </svg>`,

    orman: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#001a08,#002d10,#004020)"></div>
      <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice">
        <circle cx="240" cy="30" r="18" fill="#fffde0" opacity="0.9"/>
        <circle cx="248" cy="25" r="14" fill="#001a08"/>
        <polygon points="20,240 32,160 44,240" fill="#003318"/>
        <polygon points="70,240 90,140 110,240" fill="#004020"/>
        <polygon points="140,240 165,120 190,240" fill="#003318"/>
        <polygon points="220,240 242,145 264,240" fill="#004020"/>
        <polygon points="270,240 282,170 294,240" fill="#003318"/>
        <path d="M32,160 Q28,148 32,138 Q36,148 32,160" fill="#005c22"/>
        <path d="M90,140 Q85,125 90,112 Q95,125 90,140" fill="#006b28"/>
        <path d="M165,120 Q160,105 165,92 Q170,105 165,120" fill="#005c22"/>
        <circle cx="55" cy="100" r="2" fill="#aaff44"><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/></circle>
        <circle cx="130" cy="80" r="1.5" fill="#88ff22"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.7s"/></circle>
        <circle cx="200" cy="110" r="2" fill="#ccff44"><animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="1.2s"/></circle>
        <circle cx="250" cy="90" r="1.5" fill="#aaff66"><animate attributeName="opacity" values="0;1;0" dur="1.3s" repeatCount="indefinite" begin="0.3s"/></circle>
        <path d="M0 230 Q150 220 300 230 L300 240 L0 240Z" fill="#003318"/>
      </svg>`,

    uzay: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#000008,#050028,#0a0040)"></div>
      <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice">
        <circle cx="20" cy="15" r="1.5" fill="white"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="55" cy="8" r="1" fill="white"><animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" begin="0.5s"/></circle>
        <circle cx="90" cy="20" r="1.5" fill="#aaaaff"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" begin="1s"/></circle>
        <circle cx="150" cy="10" r="1" fill="white"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.8s" repeatCount="indefinite"/></circle>
        <circle cx="200" cy="25" r="1.5" fill="#ffaaaa"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" begin="0.8s"/></circle>
        <circle cx="260" cy="15" r="1" fill="white"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" begin="1.5s"/></circle>
        <circle cx="280" cy="40" r="1.5" fill="#aaffaa"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite" begin="2s"/></circle>
        <circle cx="45" cy="60" r="22" fill="#7733aa"/>
        <ellipse cx="45" cy="60" rx="34" ry="9" fill="none" stroke="#cc88ff" stroke-width="3" opacity="0.7"/>
        <ellipse cx="45" cy="56" rx="14" ry="9" fill="#aa66cc" opacity="0.4"/>
        <circle cx="220" cy="50" r="14" fill="#223366"/>
        <circle cx="216" cy="46" r="4" fill="#334477" opacity="0.7"/>
        <path d="M0,50 Q75,35 150,45 Q225,55 300,40" stroke="#00ff88" stroke-width="2" fill="none"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="3s" repeatCount="indefinite"/></path>
        <line x1="250" y1="5" x2="270" y2="25" stroke="white" stroke-width="1.5"><animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" begin="2s"/></line>
      </svg>`,

    deniz: `
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,#000c20,#001840,#002860)"></div>
      <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice">
        <circle cx="150" cy="30" r="18" fill="#fffde0" opacity="0.85"/>
        <ellipse cx="150" cy="115" rx="15" ry="4" fill="#fffde0" opacity="0.2"><animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite"/></ellipse>
        <path d="M0,110 Q37,95 75,110 Q112,125 150,110 Q187,95 225,110 Q262,125 300,110 L300,240 L0,240Z" fill="#001840"/>
        <path d="M0,115 Q37,100 75,115 Q112,130 150,115 Q187,100 225,115 Q262,130 300,115" fill="none" stroke="#0044aa" stroke-width="2" opacity="0.5">
          <animate attributeName="d" values="M0,115 Q37,100 75,115 Q112,130 150,115 Q187,100 225,115 Q262,130 300,115;M0,118 Q37,103 75,118 Q112,133 150,118 Q187,103 225,118 Q262,133 300,118;M0,115 Q37,100 75,115 Q112,130 150,115 Q187,100 225,115 Q262,130 300,115" dur="3s" repeatCount="indefinite"/>
        </path>
        <path d="M30,240 Q28,200 30,185 Q32,200 30,240" stroke="#ff4488" stroke-width="3" fill="none"/>
        <path d="M30,185 Q26,175 24,165" stroke="#ff4488" stroke-width="2" fill="none"/>
        <path d="M30,185 Q34,175 36,165" stroke="#ff4488" stroke-width="2" fill="none"/>
        <path d="M260,240 Q258,205 260,190 Q262,205 260,240" stroke="#ff6600" stroke-width="3" fill="none"/>
        <circle cx="100" cy="160" r="4" fill="none" stroke="#4488ff" stroke-width="1.5"><animate attributeName="cy" values="160;110;160" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite"/></circle>
        <circle cx="180" cy="170" r="3" fill="none" stroke="#44aaff" stroke-width="1"><animate attributeName="cy" values="170;120;170" dur="2.5s" repeatCount="indefinite" begin="0.8s"/><animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" begin="0.8s"/></circle>
        <circle cx="240" cy="155" r="4" fill="none" stroke="#4488ff" stroke-width="1.5"><animate attributeName="cy" values="155;105;155" dur="3.5s" repeatCount="indefinite" begin="1.5s"/><animate attributeName="opacity" values="0.5;0;0.5" dur="3.5s" repeatCount="indefinite" begin="1.5s"/></circle>
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
// Etiket renk haritası
const _ETIKET_STILLER = {
  '🔥 Çalışkan':  'background:linear-gradient(135deg,#ff4444,#cc1111);color:white;box-shadow:0 2px 8px rgba(255,68,68,0.4)',
  '⚡ Hızlı':     'background:linear-gradient(135deg,#00d2ff,#0099cc);color:white;box-shadow:0 2px 8px rgba(0,210,255,0.3)',
  '👑 Efsane':    'background:linear-gradient(135deg,#f9ca24,#e6a800);color:#1a1200;box-shadow:0 2px 8px rgba(249,202,36,0.4)',
  '💎 Elit':      'background:linear-gradient(135deg,#a855f7,#7c22cc);color:white;box-shadow:0 2px 8px rgba(168,85,247,0.4)',
  '🦸 Kahraman':  'background:linear-gradient(135deg,#ff6b9d,#cc2266);color:white;box-shadow:0 2px 8px rgba(255,107,157,0.35)',
  '🦉 Bilge':     'background:linear-gradient(135deg,#45b7d1,#1a7a99);color:white;box-shadow:0 2px 8px rgba(69,183,209,0.35)',
  '🌋 Ateş Kalbi':'background:linear-gradient(135deg,#ff8c00,#cc4400);color:white;box-shadow:0 2px 8px rgba(255,140,0,0.4)',
};

function _mEtiketUygula(etiket) {
  const stil = _ETIKET_STILLER[etiket] || 'background:rgba(108,99,255,.3);color:white';
  // Önce eskiyi kaldır
  const eskiEl = document.getElementById('_menuEtiket');
  if (eskiEl) eskiEl.remove();
  // Header isim alanına ekle
  const nameEl = document.getElementById('menuName');
  if (nameEl) {
    const span = document.createElement('span');
    span.id = '_menuEtiket';
    span.style.cssText = stil + ';font-size:.75rem;font-weight:800;padding:3px 9px;border-radius:99px;margin-left:6px;display:inline-flex;align-items:center;vertical-align:middle';
    span.textContent = etiket;
    nameEl.insertAdjacentElement('afterend', span);
  }
  // Firebase'e kaydet — koç ve arkadaşlar görsün
  const uid = auth.currentUser?.uid;
  if (uid) {
    if (window.currentUserData) window.currentUserData.etiket = etiket;
    db.collection('users').doc(uid).update({ etiket: etiket }).catch(()=>{});
  }
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
    // Tüm ejderha başlıklarını güncelle
    document.querySelectorAll('.card-title').forEach(el => {
      if (el.textContent.includes('Soru Ejderhası') || el.textContent.includes('🐉')) {
        el.textContent = '🐉 ' + isim;
      }
    });
    // Macera sayfası açıksa yenile
    if (typeof maceraPage === 'function' && document.getElementById('ejderha-scene')) {
      const cont = document.getElementById('mainContent');
      if (cont) { cont.innerHTML = maceraPage(); setTimeout(_marketUygulaEfektler, 150); }
    }
  } catch(e) { _mBildirim('Hata', '#ff6b6b'); }
}

// ── Hediye Gönder ─────────────────────────────────────────
function _mHediyeGonder(urunId, urun) {
  const modal = document.getElementById('_mModal');
  if (!modal) return;

  // Önce yükleniyor göster
  modal.style.display = 'flex';
  modal.innerHTML = '<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;text-align:center">'
    + '<div style="font-size:1.5rem;margin-bottom:8px">🎁</div>'
    + '<div style="color:var(--text2);font-size:.85rem">Arkadaşlar yükleniyor...</div>'
    + '</div>';

  // Aynı öğretmene bağlı öğrencileri Firebase'den çek
  const uid = auth.currentUser?.uid;
  const teacherId = window.currentUserData?.teacherId || '';
  if (!uid || !teacherId) {
    _mBildirim('Öğretmen bilgisi bulunamadı', '#ff6b6b');
    modal.style.display = 'none';
    return;
  }

  db.collection('users')
    .where('role', '==', 'student')
    .where('teacherId', '==', teacherId)
    .get()
    .then(snap => {
      const arkadaslar = [];
      snap.forEach(d => {
        if (d.id !== uid) arkadaslar.push({ uid: d.id, name: d.data().name || d.data().email });
      });

      if (!arkadaslar.length) {
        modal.innerHTML = '<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;text-align:center">'
          + '<div style="font-size:2rem;margin-bottom:8px">😔</div>'
          + '<div style="font-size:.85rem;color:var(--text2);margin-bottom:14px">Henüz sınıf arkadaşın yok</div>'
          + '<button onclick="document.getElementById(\'_mModal\').style.display=\'none\'" style="background:var(--surface2);border:none;border-radius:10px;padding:9px 24px;font-size:.85rem;font-weight:700;cursor:pointer;color:var(--text);font-family:inherit">Kapat</button>'
          + '</div>';
        return;
      }

      const arkList = arkadaslar.map(s =>
        '<button onclick="_mHediyeGonderKisi(\'' + urunId + '\',\'' + s.uid + '\',\'' + s.name.replace(/'/g,'') + '\')" '
        + 'style="width:100%;padding:10px 14px;background:var(--surface2);border:none;border-radius:10px;cursor:pointer;font-size:.85rem;font-weight:700;color:var(--text);text-align:left;font-family:inherit;margin-bottom:6px;display:flex;align-items:center;gap:8px">'
        + '<span style="width:30px;height:30px;border-radius:50%;background:var(--accent);color:white;display:inline-flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:900;flex-shrink:0">' + s.name[0].toUpperCase() + '</span>'
        + s.name + '</button>'
      ).join('');

      modal.innerHTML = '<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;max-height:70vh;overflow-y:auto">'
        + '<div style="font-size:2rem;text-align:center;margin-bottom:6px">' + urun.ikon + '</div>'
        + '<div style="font-weight:900;font-size:1rem;text-align:center;margin-bottom:4px">' + urun.ad + '</div>'
        + '<div style="font-size:.78rem;color:var(--text2);text-align:center;margin-bottom:14px">Kime gönderiyorsun?</div>'
        + arkList
        + '<button onclick="document.getElementById(\'_mModal\').style.display=\'none\'" style="width:100%;background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;margin-top:8px;font-family:inherit">Kapat</button>'
        + '</div>';
    })
    .catch(() => { _mBildirim('Arkadaşlar yüklenemedi', '#ff6b6b'); modal.style.display = 'none'; });
}

async function _mHediyeGonderKisi(urunId, hedefUid, hedefIsim) {
  const urun = MARKET_URUNLER[urunId];
  const uid = auth.currentUser?.uid;
  if (!uid || !urun) return;
  const altin = window.currentUserData?.altin || 0;
  if (altin < urun.fiyat) { _mBildirim('Yeterli altın yok!', '#ff6b6b'); return; }

  window.currentUserData.altin = altin - urun.fiyat;
  const gonderen = window.currentUserData?.name || 'Arkadaşın';

  try {
    await db.collection('users').doc(uid).update({ altin: window.currentUserData.altin });

    let bildirimMetni = '';
    let hedefGuncelleme = {};

    if (urun.tip === 'hediye') {
      // Altın hediye
      const hedefDoc = await db.collection('users').doc(hedefUid).get();
      const hedefAltin = (hedefDoc.data()?.altin || 0) + (urun.deger || 0);
      hedefGuncelleme = { altin: hedefAltin };
      bildirimMetni = '🎁 ' + gonderen + ' sana ' + urun.deger + ' altın hediye etti!';
    } else if (urun.tip === 'hediye_sans') {
      // Rastgele altın
      const miktar = Math.floor(Math.random() * 191) + 10;
      const hedefDoc = await db.collection('users').doc(hedefUid).get();
      const hedefAltin = (hedefDoc.data()?.altin || 0) + miktar;
      hedefGuncelleme = { altin: hedefAltin };
      bildirimMetni = '🎲 ' + gonderen + ' sana şans zarı attı! ' + miktar + ' altın kazandın!';
    } else if (urun.tip === 'hediye_mesaj') {
      const mesajlar = {
        motivasyon: ['💪 Sen yapabilirsin!', '🔥 Ateşini söndürme!', '⭐ Yıldızlara ulaş!', '🚀 Hedefine odaklan!'],
        tebrik: ['🎊 Tebrikler!', '🏆 Harikasın!', '🌟 Muhteşemsin!', '👏 Bravo!'],
      };
      const liste = mesajlar[urun.deger] || ['💌 Seni düşünüyorum!'];
      bildirimMetni = liste[Math.floor(Math.random() * liste.length)] + ' — ' + gonderen;
    } else if (urun.tip === 'hediye_ozel') {
      bildirimMetni = '😄 ' + gonderen + ' sana özel emoji seti hediye etti!';
    }

    if (Object.keys(hedefGuncelleme).length) {
      await db.collection('users').doc(hedefUid).update(hedefGuncelleme);
    }

    await db.collection('notifications').add({
      toUid: hedefUid, fromUid: uid,
      text: bildirimMetni,
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
    '<button onclick="window._mKat=\'' + k.id + '\';var _kb=document.getElementById(\'mKatBar\');var _ksx=_kb?_kb.scrollLeft:0;var _sp=document.getElementById(\'marketSayfa\');_sp.innerHTML=_marketIcerik();var _kb2=document.getElementById(\'mKatBar\');if(_kb2)_kb2.scrollLeft=_ksx" style="flex-shrink:0;padding:7px 14px;border-radius:99px;border:none;cursor:pointer;font-size:.78rem;font-weight:700;font-family:inherit;'
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
    + '<div id="mKatBar" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:14px">' + katHTML + '</div>'
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
    const akOnizleme = { sapka:'🎩', tac:'👑', gozluk:'🕶️', fiyonk:'🎀', kolye:'💎', yildiz:'⭐' };
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
    if (sahip || altin >= u.fiyat) {
      btn = '<button onclick="_mIsimVer(\'' + id + '\', MARKET_URUNLER[\'' + id + '\'])" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit">' + (sahip ? '✏️ İsmi Değiştir' : 'İsim Ver — ' + u.fiyat + ' 💰') + '</button>';
    } else {
      btn = '<div style="background:var(--surface2);border-radius:10px;padding:10px;font-size:.78rem;color:var(--text2);text-align:center">' + (u.fiyat-altin) + ' altın daha lazım</div>';
    }
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

setTimeout(() => {
  _marketUygulaEfektler();
  // Kayıtlı etiket varsa göster
  const etiket = window.currentUserData?.etiket;
  if (etiket) _mEtiketUygula(etiket);
}, 800);
