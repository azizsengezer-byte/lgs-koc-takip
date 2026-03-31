// ============================================================
// 💰 MARKET SİSTEMİ
// ============================================================

// ── Altın Fiyatları ────────────────────────────────────────
const MARKET_ALTIN = {
  MOOD_GIRIS:      15,   // Duygu durumu (mood) girilince
  WELLNESS_TAM:    25,   // Tüm wellness doldurulunca
  SORU_10_DOGRU:   5,    // Her 10 doğruda
  SERI_7GUN:       100,  // 7 günlük seri bonusu
  SERI_30GUN:      500,  // 30 günlük seri bonusu
};

// ── Ürün Kataloğu ──────────────────────────────────────────
const MARKET_URUNLER = {

  // 🐉 EJDERHA KATEGORİSİ
  ejderha_kizil:    { kategori:'ejderha', ad:'Kızıl Ejderha',    fiyat:500,  ikon:'🔴', aciklama:'Ateş gibi kızıl', tip:'renk',    deger:'kizil',   css:'hue-rotate(330deg) saturate(1.5)' },
  ejderha_buz:      { kategori:'ejderha', ad:'Buz Ejderhası',    fiyat:500,  ikon:'🔵', aciklama:'Buz gibi soğuk',  tip:'renk',    deger:'buz',     css:'hue-rotate(180deg) saturate(1.3) brightness(1.1)' },
  ejderha_zumrut:   { kategori:'ejderha', ad:'Zümrüt Ejderha',   fiyat:500,  ikon:'🟢', aciklama:'Orman ruhu',      tip:'renk',    deger:'zumrut',  css:'hue-rotate(100deg) saturate(1.4)' },
  ejderha_altin:    { kategori:'ejderha', ad:'Altın Ejderha',    fiyat:800,  ikon:'🟡', aciklama:'Efsanevi güç',    tip:'renk',    deger:'altin',   css:'hue-rotate(45deg) saturate(2) brightness(1.15)' },
  ejderha_gece:     { kategori:'ejderha', ad:'Gece Ejderhası',   fiyat:600,  ikon:'⚫', aciklama:'Karanlığın efendisi', tip:'renk', deger:'gece',   css:'hue-rotate(260deg) saturate(0.4) brightness(0.7)' },
  ejderha_pembe:    { kategori:'ejderha', ad:'Pembe Ejderha',    fiyat:400,  ikon:'🩷', aciklama:'Tatlı ama güçlü', tip:'renk',    deger:'pembe',   css:'hue-rotate(290deg) saturate(1.6)' },
  ejderha_gokkusagi:{ kategori:'ejderha', ad:'Gökkuşağı',        fiyat:1200, ikon:'🌈', aciklama:'Eşsiz ve nadir',  tip:'renk',    deger:'gokkusagi', css:'hue-rotate(0deg) saturate(1.5) brightness(1.05)' },
  ejderha_isim:     { kategori:'ejderha', ad:'Ejderhaya İsim Ver', fiyat:300, ikon:'✏️', aciklama:'Kendi ismini ver', tip:'isim',  deger:'',        css:'' },

  // 🔥 ATEŞ RENGİ KATEGORİSİ
  ates_mavi:    { kategori:'ates', ad:'Mavi Alev',    fiyat:350, ikon:'🔵', aciklama:'Mistik mavi alev',   tip:'ates', deger:'mavi',  css:'hue-rotate(180deg) saturate(1.5)' },
  ates_yesil:   { kategori:'ates', ad:'Yeşil Alev',   fiyat:350, ikon:'🟢', aciklama:'Zehirli yeşil alev', tip:'ates', deger:'yesil', css:'hue-rotate(100deg) saturate(1.8)' },
  ates_mor:     { kategori:'ates', ad:'Mor Alev',     fiyat:400, ikon:'🟣', aciklama:'Büyülü mor alev',    tip:'ates', deger:'mor',   css:'hue-rotate(270deg) saturate(1.6)' },
  ates_beyaz:   { kategori:'ates', ad:'Beyaz Alev',   fiyat:500, ikon:'⚪', aciklama:'Kutsal beyaz alev',  tip:'ates', deger:'beyaz', css:'saturate(0) brightness(1.8)' },
  ates_pembe:   { kategori:'ates', ad:'Pembe Alev',   fiyat:300, ikon:'🩷', aciklama:'Sevimli pembe alev', tip:'ates', deger:'pembe', css:'hue-rotate(300deg) saturate(1.4)' },

  // 💬 DİYALOG PAKETLERİ
  diyalog_motivasyon: { kategori:'diyalog', ad:'Motivasyon Paketi', fiyat:400, ikon:'💪', aciklama:'10 yeni güçlü replik', tip:'diyalog', deger:'motivasyon', css:'' },
  diyalog_komik:      { kategori:'diyalog', ad:'Komik Paket',       fiyat:350, ikon:'😂', aciklama:'10 eğlenceli replik',  tip:'diyalog', deger:'komik',       css:'' },
  diyalog_efssane:    { kategori:'diyalog', ad:'Efsane Paket',      fiyat:600, ikon:'👑', aciklama:'10 epik replik',       tip:'diyalog', deger:'efsane',      css:'' },
  diyalog_sevgi:      { kategori:'diyalog', ad:'Sevgi Paketi',      fiyat:300, ikon:'💜', aciklama:'10 sıcak replik',      tip:'diyalog', deger:'sevgi',       css:'' },
  diyalog_bilge:      { kategori:'diyalog', ad:'Bilge Paket',       fiyat:450, ikon:'🦉', aciklama:'10 derin replik',      tip:'diyalog', deger:'bilge',       css:'' },

  // 🏝️ HARİTA DEKORASYONLARİ
  harita_kale:      { kategori:'harita', ad:'Ada Kalesi',      fiyat:600,  ikon:'🏰', aciklama:'Adana kale ekle',        tip:'harita', deger:'kale',      css:'' },
  harita_kristal:   { kategori:'harita', ad:'Kristal Kule',    fiyat:700,  ikon:'💎', aciklama:'Parlayan kristal kule',  tip:'harita', deger:'kristal',   css:'' },
  harita_fener:     { kategori:'harita', ad:'Deniz Feneri',    fiyat:500,  ikon:'🗼', aciklama:'Işık saçan fener',       tip:'harita', deger:'fener',     css:'' },
  harita_bayrak_r:  { kategori:'harita', ad:'Kırmızı Bayrak',  fiyat:200,  ikon:'🚩', aciklama:'Kırmızı zafer bayrağı', tip:'harita', deger:'bayrak_r',  css:'' },
  harita_bayrak_m:  { kategori:'harita', ad:'Mor Bayrak',      fiyat:200,  ikon:'🟣', aciklama:'Mor güç bayrağı',       tip:'harita', deger:'bayrak_m',  css:'' },
  harita_sis_mor:   { kategori:'harita', ad:'Mor Sis',         fiyat:450,  ikon:'🟣', aciklama:'Haritanda mor sis',     tip:'harita', deger:'sis_mor',   css:'' },
  harita_sis_kizil: { kategori:'harita', ad:'Kızıl Sis',       fiyat:450,  ikon:'🔴', aciklama:'Haritanda kızıl sis',  tip:'harita', deger:'sis_kizil', css:'' },
  harita_gokkusagi: { kategori:'harita', ad:'Gökkuşağı Köprü', fiyat:800,  ikon:'🌈', aciklama:'Adalar arası köprü',   tip:'harita', deger:'gokkusagi', css:'' },

  // 🎨 PROFİL KATEGORİSİ
  profil_uzay:     { kategori:'profil', ad:'Uzay Teması',      fiyat:500,  ikon:'🚀', aciklama:'Uzay arka planı',      tip:'profil_bg', deger:'uzay',    css:'linear-gradient(135deg,#0a0a2e,#1a1060,#0d0030)' },
  profil_orman:    { kategori:'profil', ad:'Orman Teması',     fiyat:500,  ikon:'🌲', aciklama:'Orman arka planı',     tip:'profil_bg', deger:'orman',   css:'linear-gradient(135deg,#0a2a0a,#1a4020,#0d2010)' },
  profil_okyanus:  { kategori:'profil', ad:'Okyanus Teması',   fiyat:500,  ikon:'🌊', aciklama:'Okyanus arka planı',   tip:'profil_bg', deger:'okyanus', css:'linear-gradient(135deg,#001a40,#002a5e,#001030)' },
  profil_galaksi:  { kategori:'profil', ad:'Galaksi Teması',   fiyat:700,  ikon:'🌌', aciklama:'Galaksi arka planı',   tip:'profil_bg', deger:'galaksi', css:'linear-gradient(135deg,#1a0a30,#2d1060,#0a0020)' },
  profil_alev:     { kategori:'profil', ad:'Alev Teması',      fiyat:600,  ikon:'🔥', aciklama:'Ateş arka planı',      tip:'profil_bg', deger:'alev',    css:'linear-gradient(135deg,#2a0a00,#4a1a00,#1a0500)' },
  profil_buz:      { kategori:'profil', ad:'Buz Teması',       fiyat:600,  ikon:'❄️', aciklama:'Buz arka planı',       tip:'profil_bg', deger:'buz',     css:'linear-gradient(135deg,#001a30,#002a50,#001020)' },

  // ✨ EFEKT KATEGORİSİ
  efekt_konfeti:   { kategori:'efekt', ad:'Konfeti Efekti',    fiyat:400,  ikon:'🎊', aciklama:'Soru çözünce konfeti', tip:'efekt', deger:'konfeti',  css:'' },
  efekt_yildiz:    { kategori:'efekt', ad:'Yıldız Yağmuru',    fiyat:500,  ikon:'⭐', aciklama:'Yıldız yağmuru efekti',tip:'efekt', deger:'yildiz',   css:'' },
  efekt_altin_p:   { kategori:'efekt', ad:'Altın Patlama',     fiyat:600,  ikon:'💥', aciklama:'Altın patlama efekti', tip:'efekt', deger:'altin_p',  css:'' },
  efekt_kalp:      { kategori:'efekt', ad:'Kalp Yağmuru',      fiyat:350,  ikon:'💜', aciklama:'Kalp yağmuru efekti',  tip:'efekt', deger:'kalp',     css:'' },
  efekt_sim_buyuk: { kategori:'efekt', ad:'Mega Şimşek',       fiyat:700,  ikon:'⚡', aciklama:'Büyük şimşek efekti', tip:'efekt', deger:'sim_buyuk',css:'' },

  // 🎁 ÖZEL PAKETLER
  paket_baslangic: { kategori:'paket', ad:'Başlangıç Paketi',  fiyat:800,  ikon:'🎁', aciklama:'Kızıl ejderha + Mavi alev + Konfeti', tip:'paket', deger:'baslangic', css:'' },
  paket_efsane:    { kategori:'paket', ad:'Efsane Paketi',     fiyat:2000, ikon:'👑', aciklama:'Altın ejderha + Beyaz alev + Galaksi tema + Yıldız yağmuru', tip:'paket', deger:'efsane', css:'' },
  paket_kahraman:  { kategori:'paket', ad:'Kahraman Paketi',   fiyat:1500, ikon:'🦸', aciklama:'Buz ejderha + Mor alev + Uzay tema', tip:'paket', deger:'kahraman', css:'' },

  // 🌟 ÖZEL / SEZONAL
  ozel_gorunmez:   { kategori:'ozel', ad:'Görünmez Mod',       fiyat:1000, ikon:'👻', aciklama:'Profilde özel rozet',  tip:'ozel', deger:'gorunmez', css:'' },
  ozel_vip:        { kategori:'ozel', ad:'VIP Rozet',          fiyat:1500, ikon:'💎', aciklama:'Efsanevi VIP işareti', tip:'ozel', deger:'vip',      css:'' },
  ozel_ejder_dans: { kategori:'ozel', ad:'Dans Eden Ejderha',  fiyat:900,  ikon:'💃', aciklama:'Ejderhan dans ediyor', tip:'ozel', deger:'ejder_dans',css:'' },
  ozel_sis_bomb:   { kategori:'ozel', ad:'Sis Bombası',        fiyat:300,  ikon:'💣', aciklama:'Bir adanın sisi 1 gün dağılır', tip:'ozel', deger:'sis_bomb', css:'', tuket:true },
  ozel_altin_x2:   { kategori:'ozel', ad:'2x Altın (1 gün)',   fiyat:400,  ikon:'✨', aciklama:'1 gün 2 katı altın kazan', tip:'ozel', deger:'altin_x2', css:'', tuket:true },
  ozel_ejder_ates: { kategori:'ozel', ad:'Ejderha Fırını',     fiyat:1100, ikon:'🌋', aciklama:'Süper ateş animasyonu', tip:'ozel', deger:'ejder_ates', css:'' },
};

const MARKET_KATEGORILER = [
  { id:'ejderha', ad:'🐉 Ejderha',    aciklama:'Ejderhanı özelleştir' },
  { id:'ates',    ad:'🔥 Ateş Rengi', aciklama:'Alevin rengini değiştir' },
  { id:'diyalog', ad:'💬 Diyaloglar', aciklama:'Yeni replikler ekle' },
  { id:'harita',  ad:'🏝️ Harita',     aciklama:'Haritanı dekore et' },
  { id:'profil',  ad:'🎨 Profil',     aciklama:'Arka plan temaları' },
  { id:'efekt',   ad:'✨ Efektler',   aciklama:'Özel efektler' },
  { id:'paket',   ad:'🎁 Paketler',   aciklama:'Özel indirimli paketler' },
  { id:'ozel',    ad:'🌟 Özel',       aciklama:'Nadir ve özel ürünler' },
];

// ── Firebase Altın İşlemleri ────────────────────────────────
async function marketGetirAltin() {
  const uid = auth.currentUser?.uid;
  if (!uid) return 0;
  // Önce local'den al (hızlı)
  const local = window.currentUserData?.altin || 0;
  return local;
}

async function marketAldinEkle(miktar, sebep) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const simdiki = window.currentUserData?.altin || 0;

  // 2x altın aktifse
  const aktif = window.currentUserData?.aktif || {};
  const x2 = aktif.altin_x2 && new Date(aktif.altin_x2) > new Date();
  const gercekMiktar = x2 ? miktar * 2 : miktar;

  const yeni = simdiki + gercekMiktar;
  window.currentUserData.altin = yeni;
  try {
    await db.collection('users').doc(uid).update({ altin: yeni });
    _marketAldinAnimasyon(gercekMiktar);
    console.log(`💰 +${gercekMiktar} altın (${sebep})`);
  } catch(e) { console.error(e); }
}

async function marketSatinAl(urunId) {
  const urun = MARKET_URUNLER[urunId];
  if (!urun) return;
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const simdikiAltin = window.currentUserData?.altin || 0;
  if (simdikiAltin < urun.fiyat) {
    _marketBildirim('Yeterli altının yok! 💰', 'hata');
    return;
  }

  const satinAlinanlar = window.currentUserData?.satin_alinanlar || [];
  if (satinAlinanlar.includes(urunId) && !urun.tuket) {
    _marketBildirim('Bu ürüne zaten sahipsin!', 'uyari');
    return;
  }

  // Paket ise içindekileri ekle
  if (urun.tip === 'paket') {
    const paketIcerigi = {
      baslangic: ['ejderha_kizil','ates_mavi','efekt_konfeti'],
      efsane:    ['ejderha_altin','ates_beyaz','profil_galaksi','efekt_yildiz'],
      kahraman:  ['ejderha_buz','ates_mor','profil_uzay'],
    };
    (paketIcerigi[urun.deger]||[]).forEach(id => {
      if (!satinAlinanlar.includes(id)) satinAlinanlar.push(id);
    });
  } else {
    if (!satinAlinanlar.includes(urunId)) satinAlinanlar.push(urunId);
  }

  const yeniAltin = simdikiAltin - urun.fiyat;
  window.currentUserData.altin = yeniAltin;
  window.currentUserData.satin_alinanlar = satinAlinanlar;

  try {
    await db.collection('users').doc(uid).update({
      altin: yeniAltin,
      satin_alinanlar: satinAlinanlar,
    });
    _marketBildirim(`${urun.ikon} ${urun.ad} satın alındı!`, 'basari');
    // Market'i yenile
    const el = document.getElementById('marketSayfa');
    if (el) el.innerHTML = _marketIcerik();
  } catch(e) {
    console.error(e);
    _marketBildirim('Bir hata oluştu', 'hata');
  }
}

async function marketAktifEt(urunId) {
  const urun = MARKET_URUNLER[urunId];
  if (!urun) return;
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const aktif = window.currentUserData?.aktif || {};

  // Aynı kategorideki eski aktifi kaldır
  if (urun.tip !== 'ozel' && !urun.tuket) {
    Object.keys(aktif).forEach(k => {
      const u = MARKET_URUNLER[k];
      if (u && u.tip === urun.tip) delete aktif[k];
    });
  }

  if (urun.tuket) {
    // Tüketilebilir: bitiş tarihi kaydet
    const bitis = new Date();
    bitis.setDate(bitis.getDate() + 1);
    aktif[urunId] = bitis.toISOString();
  } else {
    aktif[urunId] = true;
  }

  window.currentUserData.aktif = aktif;

  try {
    await db.collection('users').doc(uid).update({ aktif });
    _marketBildirim(`${urun.ikon} ${urun.ad} aktif edildi!`, 'basari');
    _marketUygulaEfektler();
    const el = document.getElementById('marketSayfa');
    if (el) el.innerHTML = _marketIcerik();
  } catch(e) { console.error(e); }
}

// ── Wellness & Soru Hook'ları ──────────────────────────────
// saveWellnessDay'e mood hook
const _orijinalSaveWellness = typeof saveWellnessDay !== 'undefined' ? saveWellnessDay : null;

function _marketMoodKontrol(field) {
  if (field !== 'mood') return;
  const todayKey = getTodayKey();
  const kazanildi = localStorage.getItem(`altin_mood_${todayKey}`);
  if (!kazanildi) {
    localStorage.setItem(`altin_mood_${todayKey}`, '1');
    marketAldinEkle(MARKET_ALTIN.MOOD_GIRIS, 'Duygu durumu girişi');
  }
}

function _marketWellnessTamKontrol() {
  const { data } = _getW();
  const todayKey = getTodayKey();
  const today = data.days?.[todayKey] || {};
  const tam = today.mood && today.uyku && today.enerji;
  if (!tam) return;
  const kazanildi = localStorage.getItem(`altin_wellness_tam_${todayKey}`);
  if (!kazanildi) {
    localStorage.setItem(`altin_wellness_tam_${todayKey}`, '1');
    marketAldinEkle(MARKET_ALTIN.WELLNESS_TAM, 'Wellness tam dolduruldu');
  }
}

function _marketSoruKontrol(dogruSayisi) {
  const gun = getTodayKey();
  const mevcutStr = localStorage.getItem(`altin_soru_${gun}`) || '0';
  const mevcut = parseInt(mevcutStr);
  const yeni = mevcut + dogruSayisi;
  const eskiOnlar = Math.floor(mevcut / 10);
  const yeniOnlar = Math.floor(yeni / 10);
  if (yeniOnlar > eskiOnlar) {
    const kazanilanPaket = (yeniOnlar - eskiOnlar) * MARKET_ALTIN.SORU_10_DOGRU;
    marketAldinEkle(kazanilanPaket, `${yeniOnlar*10} doğru`);
  }
  localStorage.setItem(`altin_soru_${gun}`, yeni.toString());
}

// ── Market UI ──────────────────────────────────────────────
function marketPage() {
  return `
    <div class="page-title">🛒 Market</div>
    <div class="page-sub">Altınlarınla özel ürünler satın al</div>
    <div id="marketSayfa">${_marketIcerik()}</div>
  `;
}

function _marketIcerik() {
  const altin = window.currentUserData?.altin || 0;
  const satinAlinanlar = window.currentUserData?.satin_alinanlar || [];
  const aktif = window.currentUserData?.aktif || {};
  let seciliKategori = window._marketSeciliKat || 'ejderha';

  const katHTML = MARKET_KATEGORILER.map(k => `
    <button onclick="window._marketSeciliKat='${k.id}';document.getElementById('marketSayfa').innerHTML=_marketIcerik()"
      style="flex-shrink:0;padding:8px 14px;border-radius:99px;border:none;cursor:pointer;font-size:.8rem;font-weight:700;font-family:inherit;
        ${k.id===seciliKategori
          ? 'background:var(--accent);color:white'
          : 'background:var(--surface2);color:var(--text2)'}">
      ${k.ad}
    </button>`).join('');

  const urunler = Object.entries(MARKET_URUNLER)
    .filter(([,u]) => u.kategori === seciliKategori);

  const urunHTML = urunler.map(([id, u]) => {
    const sahip = satinAlinanlar.includes(id);
    const aktifMi = aktif[id] === true || (aktif[id] && new Date(aktif[id]) > new Date());
    return `
      <div style="background:var(--surface2);border-radius:14px;padding:14px;
        border:1.5px solid ${aktifMi?'var(--accent)':sahip?'rgba(67,233,122,.4)':'var(--border)'};
        position:relative;overflow:hidden">
        ${aktifMi?`<div style="position:absolute;top:8px;right:8px;background:var(--accent);color:white;border-radius:99px;padding:2px 8px;font-size:.6rem;font-weight:800">AKTİF</div>`:''}
        ${sahip&&!aktifMi?`<div style="position:absolute;top:8px;right:8px;background:rgba(67,233,122,.2);color:#43e97b;border-radius:99px;padding:2px 8px;font-size:.6rem;font-weight:800">SAHİP</div>`:''}
        <div style="font-size:1.8rem;margin-bottom:6px">${u.ikon}</div>
        <div style="font-weight:800;font-size:.88rem;margin-bottom:3px">${u.ad}</div>
        <div style="font-size:.72rem;color:var(--text2);margin-bottom:10px">${u.aciklama}</div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.85rem;font-weight:900;color:#f9ca24">💰 ${u.fiyat}</div>
          ${sahip
            ? `<button onclick="marketAktifEt('${id}')"
                style="padding:6px 14px;border-radius:8px;border:none;cursor:pointer;font-size:.75rem;font-weight:700;font-family:inherit;
                  background:${aktifMi?'var(--surface)':'var(--accent)'};color:${aktifMi?'var(--text2)':'white'}">
                ${aktifMi?'Aktif ✓':'Aktif Et'}
              </button>`
            : `<button onclick="marketSatinAl('${id}')"
                style="padding:6px 14px;border-radius:8px;border:none;cursor:pointer;font-size:.75rem;font-weight:700;font-family:inherit;
                  background:${altin>=u.fiyat?'var(--accent)':'var(--surface)'};
                  color:${altin>=u.fiyat?'white':'var(--text2)'}">
                ${altin>=u.fiyat?'Satın Al':'🔒'}
              </button>`
          }
        </div>
      </div>`;
  }).join('');

  return `
    <!-- Altın sayacı -->
    <div style="background:linear-gradient(135deg,#2a2000,#1a1500);border:1px solid #f9ca2444;border-radius:16px;padding:14px 18px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:.72rem;color:#f9ca24;margin-bottom:2px">Toplam Altın</div>
        <div style="font-size:1.6rem;font-weight:900;color:#f9ca24">💰 ${altin.toLocaleString()}</div>
      </div>
      <div style="text-align:right;font-size:.68rem;color:#8b7a30;line-height:1.6">
        <div>Mood girişi: +${MARKET_ALTIN.MOOD_GIRIS} 💰</div>
        <div>Wellness tam: +${MARKET_ALTIN.WELLNESS_TAM} 💰</div>
        <div>10 doğru: +${MARKET_ALTIN.SORU_10_DOGRU} 💰</div>
      </div>
    </div>

    <!-- Kategori seçici -->
    <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:14px">
      ${katHTML}
    </div>

    <!-- Ürün grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${urunHTML}
    </div>
  `;
}

// ── Bildiririm & Animasyon ─────────────────────────────────
function _marketBildirim(mesaj, tip='basari') {
  const renk = tip==='basari'?'#43e97b':tip==='hata'?'#ff6b6b':'#f9ca24';
  const div = document.createElement('div');
  div.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%);
    background:var(--surface);border:1.5px solid ${renk};border-radius:12px;
    padding:10px 20px;font-size:.85rem;font-weight:700;color:${renk};
    z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.4);
    animation:slideDown .3s ease-out`;
  div.textContent = mesaj;
  document.body.appendChild(div);
  setTimeout(()=>div.remove(), 2500);
}

function _marketAldinAnimasyon(miktar) {
  const div = document.createElement('div');
  div.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    font-size:1.4rem;font-weight:900;color:#f9ca24;z-index:9999;
    animation:altinAnim .8s ease-out forwards;pointer-events:none`;
  div.textContent = `+${miktar} 💰`;
  document.body.appendChild(div);
  setTimeout(()=>div.remove(), 800);

  // Altın sayacını güncelle
  const sayac = document.getElementById('marketAltinSayac');
  if (sayac) sayac.textContent = `💰 ${(window.currentUserData?.altin||0).toLocaleString()}`;
}

// Efektleri uygula
function _marketUygulaEfektler() {
  const aktif = window.currentUserData?.aktif || {};
  if (!aktif || !Object.keys(aktif).length) return;

  Object.keys(aktif).forEach(id => {
    const u = MARKET_URUNLER[id];
    if (!u) return;
    const aktifMi = aktif[id] === true || (aktif[id] && new Date(aktif[id]) > new Date());
    if (!aktifMi) return;

    // Ejderha rengi
    if (u.tip === 'renk' && u.css) {
      const svg = document.getElementById('dragon-svg');
      if (svg) svg.style.filter = u.css;
    }
    // Ateş rengi
    if (u.tip === 'ates' && u.css) {
      const fg = document.getElementById('fire-group');
      if (fg) fg.style.filter = u.css;
    }
    // Profil arka planı
    if (u.tip === 'profil_bg' && u.css) {
      const app = document.getElementById('app');
      if (app) app.style.background = u.css;
    }
  });
}

// maceraPage render edilince efektleri uygula
const _origMaceraEjderha = window.maceraEjderha;

// ── Koç Bonus Verme ────────────────────────────────────────
async function kocBonusAltin(ogrenciUid, miktar, sebep) {
  if (!ogrenciUid || !miktar) return;
  try {
    const doc = await db.collection('users').doc(ogrenciUid).get();
    const simdiki = doc.data()?.altin || 0;
    const yeni = simdiki + parseInt(miktar);
    await db.collection('users').doc(ogrenciUid).update({ altin: yeni });
    return yeni;
  } catch(e) {
    console.error(e);
    return null;
  }
}

// maceraPage açılınca efektleri uygula (setTimeout ile SVG DOM'a geldikten sonra)
const _origShowPage = window.showPage;
// macera sayfası açılınca efektleri uygula
document.addEventListener('DOMContentLoaded', () => {
  // Sayfa zaten açıksa uygula
  setTimeout(_marketUygulaEfektler, 500);
});

// CSS animasyonları
const _marketStyle = document.createElement('style');
_marketStyle.textContent = `
  @keyframes altinAnim {
    0%  { opacity:1; transform:translate(-50%,-50%) scale(1); }
    50% { opacity:1; transform:translate(-50%,-120%) scale(1.3); }
    100%{ opacity:0; transform:translate(-50%,-200%) scale(0.8); }
  }
  @keyframes slideDown {
    from { opacity:0; transform:translateX(-50%) translateY(-10px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(_marketStyle);

// ============================================================
// ✨ GÖRSEL EFEKTLer
// ============================================================

function _marketKonfetiEfekt() {
  const aktif = window.currentUserData?.aktif || {};
  // Hangi efekt aktif?
  let efektTip = null;
  if (aktif.efekt_konfeti === true) efektTip = 'konfeti';
  else if (aktif.efekt_yildiz === true) efektTip = 'yildiz';
  else if (aktif.efekt_altin_p === true) efektTip = 'altin';
  else if (aktif.efekt_kalp === true) efektTip = 'kalp';
  if (!efektTip) return;

  const renkler = {
    konfeti: ['#ff6b6b','#4ecdc4','#f9ca24','#a29bfe','#fd79a8','#55efc4'],
    yildiz:  ['#f9ca24','#fff','#ffd700','#ffe066','#ffec8b'],
    altin:   ['#f9ca24','#ffd700','#daa520','#b8860b','#ffec8b'],
    kalp:    ['#ff6b9d','#ff8fb0','#ff5c8a','#c0392b','#e84393'],
  };
  const emojiler = {
    konfeti: ['🎊','🎉','✨','⭐'],
    yildiz:  ['⭐','🌟','✨','💫'],
    altin:   ['💰','✨','⭐','🌟'],
    kalp:    ['💜','💕','❤️','💖'],
  };

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:hidden';
  document.body.appendChild(container);

  const rList = renkler[efektTip];
  const eList = emojiler[efektTip];

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      const x = Math.random() * 100;
      const emoji = Math.random() > 0.5;
      el.style.cssText = `
        position:absolute;
        left:${x}%;top:-20px;
        font-size:${emoji ? '18px' : '12px'};
        ${emoji ? '' : `width:10px;height:10px;border-radius:${Math.random()>0.5?'50%':'2px'};background:${rList[Math.floor(Math.random()*rList.length)]};`}
        animation:efektDus ${1.5 + Math.random()}s ease-in forwards;
        animation-delay:${Math.random()*0.5}s;
      `;
      if (emoji) el.textContent = eList[Math.floor(Math.random()*eList.length)];
      container.appendChild(el);
    }, i * 50);
  }

  setTimeout(() => container.remove(), 3000);
}

// Efekt CSS
const _efektStyle = document.createElement('style');
_efektStyle.textContent = `
  @keyframes efektDus {
    0%   { transform:translateY(0) rotate(0deg); opacity:1; }
    100% { transform:translateY(100vh) rotate(${Math.random()>0.5?'':'-'}720deg); opacity:0; }
  }
`;
document.head.appendChild(_efektStyle);
