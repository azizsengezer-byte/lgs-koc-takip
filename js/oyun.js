// oyun.js — Mini Oyunlar (Nefes + Kelime Bulmaca)
// Wellness günlüğü doldurulduğunda günde 1 kez oynanabilir.

// ── Wellness kontrolü — bugünkü mood girilmiş mi? ───────
function _oyunWellnessVarMi() {
  const myUid = (window.currentUserData || {}).uid || 'local';
  try {
    const data = JSON.parse(localStorage.getItem('wellness_' + myUid) || '{}');
    const todayKey = getTodayKey();
    return !!(data.days && data.days[todayKey] && data.days[todayKey].mood);
  } catch (e) {
    return false;
  }
}

// ── Bugün oynandı mı? ────────────────────────────────────
function _oyunOynandiMi(oyunId) {
  const myUid = (window.currentUserData || {}).uid || 'local';
  const todayKey = getTodayKey();
  return localStorage.getItem(`oyun_${oyunId}_${myUid}_${todayKey}`) !== null;
}

function _oyunOynanmisOlarakKaydet(oyunId, skor) {
  const myUid = (window.currentUserData || {}).uid || 'local';
  const todayKey = getTodayKey();
  localStorage.setItem(`oyun_${oyunId}_${myUid}_${todayKey}`, String(skor));
  // En yüksek skor güncelle
  const bestKey = `oyun_${oyunId}_best_${myUid}`;
  const best = parseInt(localStorage.getItem(bestKey) || '0');
  if (skor > best) localStorage.setItem(bestKey, String(skor));
}

function _oyunEnYuksekSkor(oyunId) {
  const myUid = (window.currentUserData || {}).uid || 'local';
  return parseInt(localStorage.getItem(`oyun_${oyunId}_best_${myUid}`) || '0');
}

// ── Ana sayfa ───────────────────────────────────────────
function oyunPage() {
  const wellnessVar = _oyunWellnessVarMi();
  const nefesOynandi = _oyunOynandiMi('nefes');
  const bulmacaOynandi = _oyunOynandiMi('bulmaca');
  const nbackOynandi = _oyunOynandiMi('nback');
  const stroopOynandi = _oyunOynandiMi('stroop');
  const matrisOynandi = _oyunOynandiMi('matris');
  const nefesBest = _oyunEnYuksekSkor('nefes');
  const bulmacaBest = _oyunEnYuksekSkor('bulmaca');
  const nbackBest = _oyunEnYuksekSkor('nback');
  const stroopBest = _oyunEnYuksekSkor('stroop');
  const matrisBest = _oyunEnYuksekSkor('matris');

  if (!wellnessVar) {
    return `
      <div class="page-title">🎮 Mini Oyunlar</div>
      <div class="page-sub">Günlüğünü doldurduğunda açılır</div>

      <div class="card" style="text-align:center;padding:40px 24px;margin-top:20px;background:linear-gradient(135deg,#6c63ff08,#4cc9f008);border:1.5px dashed var(--border)">
        <div style="font-size:3rem;margin-bottom:12px">🔒</div>
        <div style="font-weight:800;font-size:1.05rem;margin-bottom:8px">Önce Günlüğünü Doldur</div>
        <div style="font-size:0.85rem;color:var(--text2);line-height:1.6;margin-bottom:18px;max-width:280px;margin-left:auto;margin-right:auto">
          Mini oyunlar, günlüğünü düzenli doldurmanı teşvik etmek için var. Bugünkü duygu durumunu girince oyunlar açılır.
        </div>
        <button onclick="showPage('wellness')" style="padding:12px 28px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-size:0.92rem;font-weight:800;cursor:pointer;font-family:inherit">
          📖 Günlüğe Git →
        </button>
      </div>

      <div class="card" style="margin-top:14px">
        <div class="card-title">Bugün Oynanabilir Olanlar</div>
        <div style="opacity:0.5;pointer-events:none">
          ${_oyunKartHTML('nefes', '🫁', 'Nefes Egzersizi', 'Sınav kaygısını azaltan 4-7-8 tekniği.', false, 0, true)}
          ${_oyunKartHTML('bulmaca', '🧩', 'Kelime Bulmacası', '5 harfli gizli kelimeyi 6 denemede bul.', false, 0, true)}
          ${_oyunKartHTML('nback', '🧠', 'N-Back: Çalışan Bellek', 'Çalışan bellek antrenmanı.', false, 0, true)}
          ${_oyunKartHTML('stroop', '🎨', 'Stroop: Çeldiriciye Karşı', 'Yazıyı değil rengi seç.', false, 0, true)}
          ${_oyunKartHTML('matris', '🔲', 'Görsel Matris', 'Yanıp sönen kareleri sırayla bul.', false, 0, true)}
        </div>
      </div>
    `;
  }

  return `
    <div class="page-title">🎮 Mini Oyunlar</div>
    <div class="page-sub">Bugünkü oyun hakkın kullanıma hazır</div>

    <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(67,233,123,0.1);border:1px solid rgba(67,233,123,0.3);border-radius:12px;margin:12px 0">
      <span style="font-size:1.1rem">✅</span>
      <span style="font-size:0.82rem;color:var(--accent3);font-weight:700">Günlüğünü doldurdun — oyunlar açık!</span>
    </div>

    ${_oyunKartHTML('nefes', '🫁', 'Nefes Egzersizi', 'Sınav kaygısını azaltan 4-7-8 tekniği. 2 dakikalık nefes ritmini takip et.', nefesOynandi, nefesBest, false)}
    ${_oyunKartHTML('bulmaca', '🧩', 'Kelime Bulmacası', '5 harfli gizli kelimeyi 6 denemede bul. Her gün farklı kelime.', bulmacaOynandi, bulmacaBest, false)}
    ${_oyunKartHTML('nback', '🧠', 'N-Back: Çalışan Bellek', 'Ekrandaki harfin 2 önceki ile aynı olup olmadığını bul. Yeni nesil sorularda veriyi kaybetmemek için.', nbackOynandi, nbackBest, false)}
    ${_oyunKartHTML('stroop', '🎨', 'Stroop: Çeldiriciye Karşı', 'Yazıyı değil, rengini seç. Soru tuzaklarına direnç kazandırır.', stroopOynandi, stroopBest, false)}
    ${_oyunKartHTML('matris', '🔲', 'Görsel Matris', 'Yanıp sönen kareleri sırayla bul. Geometri ve şekil sorularına hazırlık.', matrisOynandi, matrisBest, false)}

    <div style="font-size:0.72rem;color:var(--text2);text-align:center;margin-top:14px;line-height:1.5">
      Her oyun günde 1 kez oynanabilir. Yarın yeni oyun hakkın olacak.
    </div>
  `;
}

function _oyunKartHTML(id, ikon, baslik, aciklama, oynandi, best, kilit) {
  const buton = kilit
    ? `<button disabled style="padding:10px 22px;border-radius:11px;border:none;background:var(--surface2);color:var(--text2);font-size:0.85rem;font-weight:700;cursor:not-allowed;font-family:inherit">🔒 Kilitli</button>`
    : oynandi
      ? `<button disabled style="padding:10px 22px;border-radius:11px;border:none;background:var(--surface2);color:var(--text2);font-size:0.85rem;font-weight:700;cursor:not-allowed;font-family:inherit">✅ Bugün Oynandı</button>`
      : `<button onclick="oyunBaslat('${id}')" style="padding:10px 22px;border-radius:11px;border:none;background:var(--accent);color:#fff;font-size:0.85rem;font-weight:800;cursor:pointer;font-family:inherit">▶ Oyna</button>`;

  return `
    <div class="card" style="margin-bottom:12px;display:flex;align-items:center;gap:14px;padding:16px">
      <div style="font-size:2.4rem;flex-shrink:0;width:60px;text-align:center">${ikon}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:800;font-size:0.98rem;margin-bottom:3px">${baslik}</div>
        <div style="font-size:0.78rem;color:var(--text2);line-height:1.5;margin-bottom:8px">${aciklama}</div>
        ${best > 0 ? `<div style="font-size:0.72rem;color:var(--accent);font-weight:700">🏆 En yüksek skorun: ${best}</div>` : ''}
      </div>
      <div style="flex-shrink:0">${buton}</div>
    </div>
  `;
}

function oyunBaslat(oyunId) {
  if (!_oyunWellnessVarMi()) {
    showToast('🔒', 'Önce günlüğünü doldur');
    return;
  }
  if (_oyunOynandiMi(oyunId)) {
    showToast('✅', 'Bu oyunu bugün oynadın — yarın tekrar gel');
    return;
  }
  if (oyunId === 'nefes') _nefesOyunuAc();
  else if (oyunId === 'bulmaca') _bulmacaOyunuAc();
  else if (oyunId === 'nback') _nbackOyunuAc();
  else if (oyunId === 'stroop') _stroopOyunuAc();
  else if (oyunId === 'matris') _matrisOyunuAc();
}

// ═══════════════════════════════════════════════════════════
// NEFES EGZERSİZİ
// ═══════════════════════════════════════════════════════════
// 4-7-8 Tekniği: 4sn al, 7sn tut, 8sn ver — sınav kaygısı için bilimsel.
// 4 döngü = ~80 saniye + hazırlık. Her döngü skoru ritimle uyumuna göre 0-25.

function _nefesOyunuAc() {
  const existing = document.getElementById('_nefesOyunModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_nefesOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#0a1628,#1a2540);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:24px;overflow:hidden;
  `;

  modal.innerHTML = `
    <button onclick="_nefesKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <!-- Açıklama / başlangıç ekranı -->
    <div id="_nefesIntro" style="text-align:center;color:#fff;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🫁</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Nefes Egzersizi</div>
      <div style="font-size:0.88rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:24px">
        4-7-8 tekniği — sınav kaygısını azaltan bilimsel bir nefes egzersizi.
        <br><br>
        <b style="color:#5BBFFF">4 saniye</b> nefes al →
        <b style="color:#FAC775">7 saniye</b> tut →
        <b style="color:#5DCAA5">8 saniye</b> nefes ver
        <br><br>
        Daire büyüdüğünde nefes al, küçüldüğünde ver. Ritmi tuttuğun sürece skor artar.
      </div>
      <button onclick="_nefesBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#5BBFFF,#185FA5);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(91,191,255,0.4)">
        Başla →
      </button>
    </div>

    <!-- Oyun ekranı -->
    <div id="_nefesGame" style="display:none;text-align:center;color:#fff;width:100%;max-width:380px">
      <div id="_nefesDongu" style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:12px">DÖNGÜ 1 / 4</div>

      <!-- Daire -->
      <div style="position:relative;width:240px;height:240px;margin:0 auto 30px;display:flex;align-items:center;justify-content:center">
        <!-- Dış halka -->
        <div id="_nefesRing" style="position:absolute;width:240px;height:240px;border-radius:50%;border:3px solid rgba(91,191,255,0.3);transition:all 0.5s"></div>
        <!-- İç daire -->
        <div id="_nefesCore" style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#5BBFFF,#185FA5);transition:all 4s cubic-bezier(0.4,0,0.6,1);box-shadow:0 0 60px rgba(91,191,255,0.6)"></div>
      </div>

      <div id="_nefesFaz" style="font-size:1.6rem;font-weight:800;margin-bottom:6px">HAZIR OL</div>
      <div id="_nefesSayac" style="font-size:0.9rem;color:rgba(255,255,255,0.6);margin-bottom:18px">3</div>

      <div style="display:flex;justify-content:center;gap:18px;margin-bottom:14px">
        <div>
          <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.05em">SKOR</div>
          <div id="_nefesSkor" style="font-size:1.4rem;font-weight:900;color:#5BBFFF">0</div>
        </div>
      </div>
    </div>

    <!-- Bitiş ekranı -->
    <div id="_nefesBitis" style="display:none;text-align:center;color:#fff;max-width:340px">
      <div style="font-size:3rem;margin-bottom:10px">✨</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px">Tamamlandı!</div>
      <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:20px;line-height:1.6">
        4 nefes döngüsünü tamamladın. Kalp atışın yavaşladı, sinir sistemin sakinleşti.
      </div>
      <div style="background:rgba(255,255,255,0.06);border-radius:14px;padding:18px;margin-bottom:20px">
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SKORUN</div>
        <div id="_nefesSonSkor" style="font-size:2.2rem;font-weight:900;color:#5BBFFF">0</div>
        <div id="_nefesSonMesaj" style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:5px"></div>
      </div>
      <button onclick="_nefesKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(91,191,255,0.2);color:#5BBFFF;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(91,191,255,0.4)">
        Tamam
      </button>
    </div>
  `;

  document.body.appendChild(modal);
}

let _nefesState = null;

function _nefesBasla() {
  document.getElementById('_nefesIntro').style.display = 'none';
  document.getElementById('_nefesGame').style.display = 'block';

  _nefesState = {
    dongu: 0,
    toplamDongu: 4,
    faz: 'hazir',
    skor: 0,
  };

  _nefesGeriSayim(3, () => _nefesDonguBasla());
}

function _nefesGeriSayim(saniye, onDone) {
  const fazEl = document.getElementById('_nefesFaz');
  const sayacEl = document.getElementById('_nefesSayac');
  if (fazEl) fazEl.textContent = 'HAZIR OL';
  let kalan = saniye;
  if (sayacEl) sayacEl.textContent = String(kalan);
  const timer = setInterval(() => {
    kalan--;
    if (sayacEl) sayacEl.textContent = String(kalan);
    if (kalan <= 0) {
      clearInterval(timer);
      onDone();
    }
  }, 1000);
}

function _nefesDonguBasla() {
  if (!_nefesState) return;
  _nefesState.dongu++;
  const donguEl = document.getElementById('_nefesDongu');
  if (donguEl) donguEl.textContent = `DÖNGÜ ${_nefesState.dongu} / ${_nefesState.toplamDongu}`;

  // Faz 1: Nefes al (4 sn)
  _nefesFaz('AL', '#5BBFFF', 4, 220, () => {
    // Faz 2: Tut (7 sn)
    _nefesFaz('TUT', '#FAC775', 7, 220, () => {
      // Faz 3: Ver (8 sn)
      _nefesFaz('VER', '#5DCAA5', 8, 60, () => {
        // Skor ekle (her tamamlanan döngü = 25 puan)
        _nefesState.skor += 25;
        const skorEl = document.getElementById('_nefesSkor');
        if (skorEl) skorEl.textContent = String(_nefesState.skor);
        // Sonraki döngü ya da bitiş
        if (_nefesState.dongu >= _nefesState.toplamDongu) {
          _nefesBitir();
        } else {
          setTimeout(() => _nefesDonguBasla(), 800);
        }
      });
    });
  });
}

function _nefesFaz(label, renk, saniye, hedefBoyut, onDone) {
  const fazEl = document.getElementById('_nefesFaz');
  const sayacEl = document.getElementById('_nefesSayac');
  const coreEl = document.getElementById('_nefesCore');
  const ringEl = document.getElementById('_nefesRing');

  if (fazEl) {
    fazEl.textContent = 'NEFES ' + label;
    fazEl.style.color = renk;
  }
  if (coreEl) {
    coreEl.style.transition = `all ${saniye}s cubic-bezier(0.4,0,0.6,1)`;
    coreEl.style.width = hedefBoyut + 'px';
    coreEl.style.height = hedefBoyut + 'px';
    coreEl.style.background = `linear-gradient(135deg,${renk},${renk}88)`;
    coreEl.style.boxShadow = `0 0 80px ${renk}99`;
  }
  if (ringEl) {
    ringEl.style.borderColor = renk + '66';
  }

  let kalan = saniye;
  if (sayacEl) sayacEl.textContent = String(kalan);
  const timer = setInterval(() => {
    kalan--;
    if (sayacEl) sayacEl.textContent = String(Math.max(0, kalan));
    if (kalan <= 0) {
      clearInterval(timer);
      onDone();
    }
  }, 1000);
}

function _nefesBitir() {
  const skor = _nefesState ? _nefesState.skor : 0;
  document.getElementById('_nefesGame').style.display = 'none';
  document.getElementById('_nefesBitis').style.display = 'block';
  document.getElementById('_nefesSonSkor').textContent = String(skor);

  let mesaj = '';
  if (skor >= 100) mesaj = '🌟 Mükemmel! Tüm döngüleri tamamladın.';
  else if (skor >= 75) mesaj = '👍 Çok iyi gittin!';
  else if (skor >= 50) mesaj = '🙂 Güzel bir başlangıç.';
  else mesaj = '💙 Pratik yaptıkça daha kolaylaşacak.';
  document.getElementById('_nefesSonMesaj').textContent = mesaj;

  _oyunOynanmisOlarakKaydet('nefes', skor);
  _nefesState = null;
}

function _nefesKapat() {
  const modal = document.getElementById('_nefesOyunModal');
  if (modal) modal.remove();
  _nefesState = null;
  // Sayfayı yenile
  if (typeof showPage === 'function') showPage('oyun');
}

// ═══════════════════════════════════════════════════════════
// KELİME BULMACASI (Wordle tarzı)
// ═══════════════════════════════════════════════════════════
// 5 harfli Türkçe kelimeler. 6 deneme. Her gün farklı kelime.
// Yeşil: doğru harf doğru yer. Sarı: doğru harf yanlış yer. Gri: yok.

const _BULMACA_KELIMELER = [
  // Okul / çalışma
  'KALEM','MASA','KİTAP','DEFTER','SINIF','DERSE','KÂĞIT','SİLGİ','ETÜT','ÖDEV',
  'BİLGİ','OKUMA','YAZMA','BAŞAR','ÇABA','EMEK','HEDEF','PLAN','NOTUN','SINAV',
  // Doğa
  'ORMAN','DENİZ','GÖLGE','BULUT','RÜZGÂR','GÜNEŞ','AYDIN','YILDI','GEZGİ','ATLAS',
  'TARLA','BAHÇE','ÇİÇEK','TOHUM','FİDAN','MEYVE','SEBZE','SUYUN','TOPRA','HAVAA',
  // Duygu
  'HUZUR','SEVİN','UMUT','GÜLÜM','MUTLU','HEYE','SABRI','KARAR','İRADE','GÜVEN',
  'CESUR','UYANI','DİKKA','ODAKL','SAKİN','RAHAT','TEMİZ','ARAYİ','AÇIKL','DOSTU',
  // Genel
  'ARABA','EVLER','YEMEK','SUYUM','OYUNA','MÜZİK','RESİM','ŞARKI','DOSYA','POSTA',
];

// Türkçe karakter normalizasyonu
function _bulmacaNormalize(harf) {
  return harf.toUpperCase()
    .replace(/İ/g, 'İ').replace(/I/g, 'I')
    .replace(/Ğ/g, 'Ğ').replace(/Ü/g, 'Ü')
    .replace(/Ş/g, 'Ş').replace(/Ö/g, 'Ö').replace(/Ç/g, 'Ç');
}

function _bulmacaGununKelime() {
  // Tarihten deterministik seed üret — herkes aynı kelimeyi alır
  const today = getTodayKey();
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash = ((hash << 5) - hash) + today.charCodeAt(i);
  const idx = Math.abs(hash) % _BULMACA_KELIMELER.length;
  return _BULMACA_KELIMELER[idx];
}

let _bulmacaState = null;

function _bulmacaOyunuAc() {
  const existing = document.getElementById('_bulmacaOyunModal');
  if (existing) existing.remove();

  const kelime = _bulmacaGununKelime();
  const harfler = Array.from(kelime);

  _bulmacaState = {
    kelime: kelime,
    harfSayisi: harfler.length,
    tahminler: [],
    aktifTahmin: '',
    deneme: 0,
    maksDeneme: 6,
    bitti: false,
  };

  const modal = document.createElement('div');
  modal.id = '_bulmacaOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:#0d1421;
    display:flex;flex-direction:column;
    padding:18px 16px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <!-- Üst bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
      <div>
        <div style="font-size:1.05rem;font-weight:800">🧩 Kelime Bulmaca</div>
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:2px">${_bulmacaState.harfSayisi} harfli · 6 deneme</div>
      </div>
      <button onclick="_bulmacaKapat()" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>
    </div>

    <!-- Tahmin grid -->
    <div id="_bulmacaGrid" style="display:flex;flex-direction:column;gap:6px;margin:0 auto 16px;align-items:center"></div>

    <!-- Mesaj alanı -->
    <div id="_bulmacaMesaj" style="text-align:center;font-size:0.82rem;color:rgba(255,255,255,0.7);min-height:24px;margin-bottom:10px"></div>

    <!-- Klavye -->
    <div id="_bulmacaKlavye" style="margin-top:auto;padding-bottom:8px"></div>
  `;

  document.body.appendChild(modal);
  _bulmacaGridCiz();
  _bulmacaKlavyeCiz();
}

function _bulmacaGridCiz() {
  const grid = document.getElementById('_bulmacaGrid');
  if (!grid) return;
  const N = _bulmacaState.harfSayisi;

  // Her satır = bir tahmin
  let html = '';
  for (let i = 0; i < _bulmacaState.maksDeneme; i++) {
    html += '<div style="display:flex;gap:5px">';
    for (let j = 0; j < N; j++) {
      let harf = '';
      let bg = 'rgba(255,255,255,0.05)';
      let border = '2px solid rgba(255,255,255,0.15)';
      let renk = '#fff';

      if (i < _bulmacaState.tahminler.length) {
        // Tamamlanmış tahmin
        const tahmin = _bulmacaState.tahminler[i];
        harf = tahmin.harfler[j];
        if (tahmin.sonuclar[j] === 'green') { bg = '#43b55a'; border = '2px solid #43b55a'; }
        else if (tahmin.sonuclar[j] === 'yellow') { bg = '#d4a838'; border = '2px solid #d4a838'; }
        else { bg = '#3a3a3c'; border = '2px solid #3a3a3c'; }
      } else if (i === _bulmacaState.tahminler.length) {
        // Aktif satır
        if (j < _bulmacaState.aktifTahmin.length) {
          harf = _bulmacaState.aktifTahmin[j];
          border = '2px solid rgba(255,255,255,0.4)';
        }
      }

      html += `<div style="width:50px;height:50px;display:flex;align-items:center;justify-content:center;background:${bg};border:${border};border-radius:6px;font-size:1.4rem;font-weight:800;color:${renk};font-family:'Inter',sans-serif">${harf}</div>`;
    }
    html += '</div>';
  }
  grid.innerHTML = html;
}

function _bulmacaKlavyeCiz() {
  const kEl = document.getElementById('_bulmacaKlavye');
  if (!kEl) return;
  const sira1 = ['E','R','T','Y','U','I','O','P','Ğ','Ü'];
  const sira2 = ['A','S','D','F','G','H','J','K','L','Ş','İ'];
  const sira3 = ['SİL','Z','C','V','B','N','M','Ö','Ç','ENT'];

  // Her harf için renk durumu
  const harfDurum = {};
  _bulmacaState.tahminler.forEach(t => {
    t.harfler.forEach((h, i) => {
      const mevcut = harfDurum[h];
      const yeni = t.sonuclar[i];
      // Öncelik: green > yellow > gray
      if (yeni === 'green') harfDurum[h] = 'green';
      else if (yeni === 'yellow' && mevcut !== 'green') harfDurum[h] = 'yellow';
      else if (yeni === 'gray' && !mevcut) harfDurum[h] = 'gray';
    });
  });

  function renderHarf(h) {
    const durum = harfDurum[h];
    let bg = 'rgba(255,255,255,0.1)', renk = '#fff';
    if (durum === 'green') { bg = '#43b55a'; }
    else if (durum === 'yellow') { bg = '#d4a838'; }
    else if (durum === 'gray') { bg = '#2a2a2c'; renk = 'rgba(255,255,255,0.5)'; }

    if (h === 'SİL') return `<button onclick="_bulmacaKlavyeBas('SİL')" style="flex:1.5;height:42px;background:rgba(255,255,255,0.1);border:none;border-radius:7px;color:#fff;font-size:0.7rem;font-weight:800;cursor:pointer;font-family:inherit">⌫</button>`;
    if (h === 'ENT') return `<button onclick="_bulmacaKlavyeBas('ENT')" style="flex:1.5;height:42px;background:rgba(91,191,255,0.3);border:none;border-radius:7px;color:#5BBFFF;font-size:0.65rem;font-weight:800;cursor:pointer;font-family:inherit">TAMAM</button>`;
    return `<button onclick="_bulmacaKlavyeBas('${h}')" style="flex:1;height:42px;background:${bg};border:none;border-radius:7px;color:${renk};font-size:0.85rem;font-weight:800;cursor:pointer;font-family:inherit">${h}</button>`;
  }

  kEl.innerHTML = `
    <div style="display:flex;gap:4px;margin-bottom:5px;justify-content:center">${sira1.map(renderHarf).join('')}</div>
    <div style="display:flex;gap:4px;margin-bottom:5px;justify-content:center">${sira2.map(renderHarf).join('')}</div>
    <div style="display:flex;gap:4px;justify-content:center">${sira3.map(renderHarf).join('')}</div>
  `;
}

function _bulmacaKlavyeBas(tus) {
  if (!_bulmacaState || _bulmacaState.bitti) return;

  if (tus === 'SİL') {
    _bulmacaState.aktifTahmin = _bulmacaState.aktifTahmin.slice(0, -1);
  } else if (tus === 'ENT') {
    if (_bulmacaState.aktifTahmin.length !== _bulmacaState.harfSayisi) {
      _bulmacaMesajGoster('Tüm harfleri doldur', '#d4a838');
      return;
    }
    _bulmacaTahminGonder();
    return;
  } else {
    if (_bulmacaState.aktifTahmin.length < _bulmacaState.harfSayisi) {
      _bulmacaState.aktifTahmin += tus;
    }
  }
  _bulmacaGridCiz();
}

function _bulmacaTahminGonder() {
  const tahmin = _bulmacaState.aktifTahmin;
  const dogru = _bulmacaState.kelime;
  const harfler = Array.from(tahmin);
  const dogruHarfler = Array.from(dogru);

  // Her harfin sonucunu hesapla — Wordle algoritması
  const sonuclar = new Array(harfler.length).fill('gray');
  const dogruKalan = [...dogruHarfler];

  // İlk geçiş: yeşilleri işaretle
  harfler.forEach((h, i) => {
    if (h === dogruHarfler[i]) {
      sonuclar[i] = 'green';
      dogruKalan[i] = null;
    }
  });
  // İkinci geçiş: sarıları işaretle
  harfler.forEach((h, i) => {
    if (sonuclar[i] === 'green') return;
    const idx = dogruKalan.indexOf(h);
    if (idx !== -1) {
      sonuclar[i] = 'yellow';
      dogruKalan[idx] = null;
    }
  });

  _bulmacaState.tahminler.push({ harfler, sonuclar });
  _bulmacaState.deneme++;
  _bulmacaState.aktifTahmin = '';

  _bulmacaGridCiz();
  _bulmacaKlavyeCiz();

  // Kazandı mı?
  if (sonuclar.every(s => s === 'green')) {
    _bulmacaState.bitti = true;
    const skor = (_bulmacaState.maksDeneme - _bulmacaState.deneme + 1) * 20;
    setTimeout(() => _bulmacaBitir(true, skor), 600);
    return;
  }

  // Hakkı bitti mi?
  if (_bulmacaState.deneme >= _bulmacaState.maksDeneme) {
    _bulmacaState.bitti = true;
    setTimeout(() => _bulmacaBitir(false, 0), 600);
    return;
  }
}

function _bulmacaMesajGoster(metin, renk) {
  const el = document.getElementById('_bulmacaMesaj');
  if (!el) return;
  el.textContent = metin;
  el.style.color = renk || '#fff';
  setTimeout(() => { if (el.textContent === metin) el.textContent = ''; }, 2000);
}

function _bulmacaBitir(kazandi, skor) {
  const modal = document.getElementById('_bulmacaOyunModal');
  if (!modal) return;

  const mesaj = kazandi
    ? `<div style="font-size:3rem;margin-bottom:10px">🎉</div>
       <div style="font-size:1.4rem;font-weight:800;margin-bottom:6px">Tebrikler!</div>
       <div style="font-size:0.9rem;color:rgba(255,255,255,0.7);margin-bottom:18px">"${_bulmacaState.kelime}" kelimesini ${_bulmacaState.deneme} denemede buldun!</div>
       <div style="background:rgba(91,191,255,0.15);border:1px solid rgba(91,191,255,0.4);border-radius:12px;padding:16px;margin-bottom:20px">
         <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.1em">SKOR</div>
         <div style="font-size:2.2rem;font-weight:900;color:#5BBFFF">${skor}</div>
       </div>`
    : `<div style="font-size:3rem;margin-bottom:10px">🤔</div>
       <div style="font-size:1.4rem;font-weight:800;margin-bottom:6px">Hakkın bitti</div>
       <div style="font-size:0.9rem;color:rgba(255,255,255,0.7);margin-bottom:18px">Kelime: <b style="color:#5BBFFF">${_bulmacaState.kelime}</b></div>
       <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:18px">Yarın yeni bir kelimeyle gel!</div>`;

  modal.innerHTML = `
    <div style="margin:auto;text-align:center;color:#fff;max-width:340px">
      ${mesaj}
      <button onclick="_bulmacaKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(91,191,255,0.2);color:#5BBFFF;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(91,191,255,0.4)">
        Tamam
      </button>
    </div>
  `;

  _oyunOynanmisOlarakKaydet('bulmaca', skor);
}

function _bulmacaKapat() {
  const modal = document.getElementById('_bulmacaOyunModal');
  if (modal) modal.remove();
  _bulmacaState = null;
  if (typeof showPage === 'function') showPage('oyun');
}

// ═══════════════════════════════════════════════════════════
// N-BACK (2-Back) — Çalışan Bellek
// ═══════════════════════════════════════════════════════════
// 20 tur. Her turda bir harf gösterilir. 3. turdan itibaren
// "2 önceki ile aynı mı?" sorulur. Doğru cevap +5, yanlış -2.
// Hedef: 2-back N=2.

let _nbackState = null;

function _nbackOyunuAc() {
  const existing = document.getElementById('_nbackOyunModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_nbackOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#1a1030,#2a1850);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_nbackKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_nbackIntro" style="text-align:center;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🧠</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">N-Back: Çalışan Bellek</div>
      <div style="font-size:0.86rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:24px">
        Ekranda harfler tek tek görünecek. Her harfi gördüğünde, <b style="color:#a78bfa">2 önceki harf ile aynı mı?</b> diye soracaksın.
        <br><br>
        <b style="color:#43b55a">AYNI</b> ise yeşil butona, <b style="color:#ff6584">FARKLI</b> ise kırmızıya bas.
        <br><br>
        İlk 2 harf için cevap verme — sadece izle. 20 tur sürer.
      </div>
      <button onclick="_nbackBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(167,139,250,0.4)">
        Başla →
      </button>
    </div>

    <div id="_nbackGame" style="display:none;text-align:center;width:100%;max-width:380px">
      <div style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:6px">
        TUR <span id="_nbackTur">0</span> / 20
      </div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:18px">
        Skor: <span id="_nbackSkor" style="color:#a78bfa;font-weight:800">0</span> ·
        Doğru: <span id="_nbackDogru" style="color:#43b55a;font-weight:800">0</span> ·
        Yanlış: <span id="_nbackYanlis" style="color:#ff6584;font-weight:800">0</span>
      </div>

      <!-- Harf kutusu -->
      <div style="position:relative;width:200px;height:200px;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);border:2px solid rgba(167,139,250,0.3);border-radius:24px">
        <div id="_nbackHarf" style="font-size:5rem;font-weight:900;color:#a78bfa;font-family:'Inter',sans-serif">—</div>
      </div>

      <div id="_nbackSoru" style="font-size:0.88rem;color:rgba(255,255,255,0.6);margin-bottom:14px;min-height:20px">2 önceki ile aynı mı?</div>

      <div style="display:flex;gap:12px;justify-content:center">
        <button id="_nbackBtnFarkli" onclick="_nbackCevap(false)" style="flex:1;max-width:140px;padding:14px;border-radius:14px;border:none;background:rgba(255,101,132,0.2);border:2px solid rgba(255,101,132,0.5);color:#ff6584;font-size:0.95rem;font-weight:800;cursor:pointer;font-family:inherit">
          ✕ FARKLI
        </button>
        <button id="_nbackBtnAyni" onclick="_nbackCevap(true)" style="flex:1;max-width:140px;padding:14px;border-radius:14px;border:none;background:rgba(67,181,90,0.2);border:2px solid rgba(67,181,90,0.5);color:#43b55a;font-size:0.95rem;font-weight:800;cursor:pointer;font-family:inherit">
          ✓ AYNI
        </button>
      </div>

      <div id="_nbackGeri" style="font-size:0.72rem;color:rgba(255,255,255,0.3);margin-top:12px;min-height:16px"></div>
    </div>

    <div id="_nbackBitis" style="display:none;text-align:center;max-width:340px"></div>
  `;

  document.body.appendChild(modal);
}

function _nbackBasla() {
  document.getElementById('_nbackIntro').style.display = 'none';
  document.getElementById('_nbackGame').style.display = 'block';

  const harfler = ['A','B','C','D','E','F','G','H'];
  // 20 turluk dizi üret — yaklaşık %30 oranında "match" olsun
  const dizi = [];
  for (let i = 0; i < 20; i++) {
    if (i >= 2 && Math.random() < 0.32) {
      dizi.push(dizi[i-2]); // match
    } else {
      let h;
      do { h = harfler[Math.floor(Math.random() * harfler.length)]; }
      while (i >= 2 && h === dizi[i-2] && Math.random() < 0.5); // bazen yine match olabilir, sorun değil
      dizi.push(h);
    }
  }

  _nbackState = {
    dizi,
    tur: 0,
    skor: 0,
    dogru: 0,
    yanlis: 0,
    bekliyor: false,
    timer: null,
  };

  _nbackTurSonraki();
}

function _nbackTurSonraki() {
  if (!_nbackState) return;
  if (_nbackState.tur >= _nbackState.dizi.length) {
    _nbackBitir();
    return;
  }
  _nbackState.tur++;
  const idx = _nbackState.tur - 1;
  const harf = _nbackState.dizi[idx];

  document.getElementById('_nbackTur').textContent = _nbackState.tur;
  document.getElementById('_nbackHarf').textContent = harf;
  document.getElementById('_nbackHarf').style.color = '#a78bfa';
  document.getElementById('_nbackGeri').textContent = '';

  // İlk 2 turda cevap istenmiyor
  if (_nbackState.tur <= 2) {
    document.getElementById('_nbackSoru').textContent = `Sadece izle (${3 - _nbackState.tur} tur kaldı)`;
    _nbackState.bekliyor = false;
    _nbackState.timer = setTimeout(() => _nbackTurSonraki(), 2200);
  } else {
    document.getElementById('_nbackSoru').textContent = '2 önceki ile aynı mı?';
    _nbackState.bekliyor = true;
    // 4 saniye içinde cevap verilmezse otomatik geç (yanlış sayılır)
    _nbackState.timer = setTimeout(() => {
      if (_nbackState && _nbackState.bekliyor) {
        _nbackState.bekliyor = false;
        _nbackState.yanlis++;
        document.getElementById('_nbackYanlis').textContent = _nbackState.yanlis;
        document.getElementById('_nbackGeri').textContent = '⏰ Süre doldu';
        setTimeout(() => _nbackTurSonraki(), 700);
      }
    }, 4000);
  }
}

function _nbackCevap(ayni) {
  if (!_nbackState || !_nbackState.bekliyor) return;
  clearTimeout(_nbackState.timer);
  _nbackState.bekliyor = false;

  const idx = _nbackState.tur - 1;
  const dogruCevap = _nbackState.dizi[idx] === _nbackState.dizi[idx - 2];

  if (ayni === dogruCevap) {
    _nbackState.skor += 5;
    _nbackState.dogru++;
    document.getElementById('_nbackGeri').textContent = '✓ Doğru +5';
    document.getElementById('_nbackGeri').style.color = '#43b55a';
    document.getElementById('_nbackHarf').style.color = '#43b55a';
  } else {
    _nbackState.skor = Math.max(0, _nbackState.skor - 2);
    _nbackState.yanlis++;
    document.getElementById('_nbackGeri').textContent = `✕ Yanlış · doğrusu: ${dogruCevap ? 'AYNI' : 'FARKLI'}`;
    document.getElementById('_nbackGeri').style.color = '#ff6584';
    document.getElementById('_nbackHarf').style.color = '#ff6584';
  }

  document.getElementById('_nbackSkor').textContent = _nbackState.skor;
  document.getElementById('_nbackDogru').textContent = _nbackState.dogru;
  document.getElementById('_nbackYanlis').textContent = _nbackState.yanlis;

  setTimeout(() => _nbackTurSonraki(), 900);
}

function _nbackBitir() {
  const skor = _nbackState ? _nbackState.skor : 0;
  const dogru = _nbackState ? _nbackState.dogru : 0;
  const yanlis = _nbackState ? _nbackState.yanlis : 0;
  const toplam = dogru + yanlis;
  const isabet = toplam > 0 ? Math.round(dogru / toplam * 100) : 0;

  document.getElementById('_nbackGame').style.display = 'none';
  const bitisEl = document.getElementById('_nbackBitis');
  bitisEl.style.display = 'block';

  let mesaj = '';
  if (isabet >= 80) mesaj = '🌟 Çalışan belleğin çok güçlü!';
  else if (isabet >= 60) mesaj = '👍 İyi gittin, gelişiyorsun.';
  else if (isabet >= 40) mesaj = '🙂 Pratik yaptıkça daha iyi olacak.';
  else mesaj = '💪 İlk seferinde herkes zorlanır, devam et.';

  bitisEl.innerHTML = `
    <div style="font-size:3rem;margin-bottom:10px">🧠</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px;color:#fff">Tamamlandı!</div>
    <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:18px">${mesaj}</div>
    <div style="background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.3);border-radius:14px;padding:18px;margin-bottom:18px">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SKOR</div>
      <div style="font-size:2.2rem;font-weight:900;color:#a78bfa">${skor}</div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:8px">
        ${dogru} doğru · ${yanlis} yanlış · %${isabet} isabet
      </div>
    </div>
    <button onclick="_nbackKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(167,139,250,0.2);color:#a78bfa;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(167,139,250,0.4)">
      Tamam
    </button>
  `;

  _oyunOynanmisOlarakKaydet('nback', skor);
}

function _nbackKapat() {
  if (_nbackState && _nbackState.timer) clearTimeout(_nbackState.timer);
  const modal = document.getElementById('_nbackOyunModal');
  if (modal) modal.remove();
  _nbackState = null;
  if (typeof showPage === 'function') showPage('oyun');
}

// ═══════════════════════════════════════════════════════════
// STROOP TESTİ — Çeldirici Direnci
// ═══════════════════════════════════════════════════════════
// 30 tur. Her turda bir renk ismi (KIRMIZI/MAVİ/YEŞİL/SARI) farklı
// bir renkte yazılır. Öğrenci yazıyı değil, RENGİ seçer.
// Doğru +5, yanlış -2. Süre limiti var.

let _stroopState = null;

const _STROOP_RENKLER = [
  { ad: 'KIRMIZI', kod: '#ef4444' },
  { ad: 'MAVİ',    kod: '#3b82f6' },
  { ad: 'YEŞİL',   kod: '#22c55e' },
  { ad: 'SARI',    kod: '#eab308' },
];

function _stroopOyunuAc() {
  const existing = document.getElementById('_stroopOyunModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_stroopOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#1a1a2e,#16213e);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_stroopKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_stroopIntro" style="text-align:center;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🎨</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Stroop Testi</div>
      <div style="font-size:0.86rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:18px">
        Ekranda renk isimleri çıkacak — ama yazıldıkları renk farklı olabilir.
        <br><br>
        <b style="color:#fff">Yazıyı değil, kelimenin RENGİNİ seç.</b>
        <br><br>
        Örnek: <span style="color:#3b82f6;font-weight:800;font-size:1.2rem">KIRMIZI</span>
        — burada cevap <b style="color:#3b82f6">MAVİ</b> (yazının rengi).
      </div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:24px">30 tur · her tur 3 saniye</div>
      <button onclick="_stroopBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#f472b6,#db2777);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(244,114,182,0.4)">
        Başla →
      </button>
    </div>

    <div id="_stroopGame" style="display:none;text-align:center;width:100%;max-width:380px">
      <div style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:6px">
        TUR <span id="_stroopTur">0</span> / 30
      </div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:6px">
        Skor: <span id="_stroopSkor" style="color:#f472b6;font-weight:800">0</span> ·
        Doğru: <span id="_stroopDogru" style="color:#43b55a;font-weight:800">0</span>
      </div>

      <!-- Süre çubuğu -->
      <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;margin-bottom:30px">
        <div id="_stroopSureBar" style="height:100%;background:#f472b6;border-radius:2px;width:100%;transition:width 0.1s linear"></div>
      </div>

      <!-- Kelime -->
      <div style="height:140px;display:flex;align-items:center;justify-content:center;margin-bottom:24px">
        <div id="_stroopKelime" style="font-size:3rem;font-weight:900;font-family:'Inter',sans-serif;letter-spacing:0.05em">—</div>
      </div>

      <div style="font-size:0.78rem;color:rgba(255,255,255,0.6);margin-bottom:14px">Yazının RENGİNİ seç:</div>

      <div id="_stroopButonlar" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></div>

      <div id="_stroopGeri" style="font-size:0.75rem;margin-top:10px;min-height:18px;color:rgba(255,255,255,0.4)"></div>
    </div>

    <div id="_stroopBitis" style="display:none;text-align:center;max-width:340px"></div>
  `;

  document.body.appendChild(modal);
}

function _stroopBasla() {
  document.getElementById('_stroopIntro').style.display = 'none';
  document.getElementById('_stroopGame').style.display = 'block';

  _stroopState = {
    tur: 0,
    toplam: 30,
    skor: 0,
    dogru: 0,
    yanlis: 0,
    bekliyor: false,
    timer: null,
    sureTimer: null,
    aktifRenk: null,
  };

  _stroopTurSonraki();
}

function _stroopTurSonraki() {
  if (!_stroopState) return;
  if (_stroopState.tur >= _stroopState.toplam) {
    _stroopBitir();
    return;
  }
  _stroopState.tur++;

  // Renk + farklı renkte yazı seç (~%80 ihtimalle uyumsuz)
  const renkIdx = Math.floor(Math.random() * _STROOP_RENKLER.length);
  const yaziRengi = _STROOP_RENKLER[renkIdx];
  let kelimeIdx = renkIdx;
  if (Math.random() < 0.8) {
    while (kelimeIdx === renkIdx) {
      kelimeIdx = Math.floor(Math.random() * _STROOP_RENKLER.length);
    }
  }
  const kelime = _STROOP_RENKLER[kelimeIdx];

  _stroopState.aktifRenk = yaziRengi.ad;

  document.getElementById('_stroopTur').textContent = _stroopState.tur;
  const kelimeEl = document.getElementById('_stroopKelime');
  kelimeEl.textContent = kelime.ad;
  kelimeEl.style.color = yaziRengi.kod;

  document.getElementById('_stroopGeri').textContent = '';

  // Butonları üret (her seferinde renkler rastgele sıralı)
  const renklerKarisik = [..._STROOP_RENKLER].sort(() => Math.random() - 0.5);
  const btnEl = document.getElementById('_stroopButonlar');
  btnEl.innerHTML = renklerKarisik.map(r => `
    <button onclick="_stroopCevap('${r.ad}')" style="padding:14px;border-radius:12px;border:2px solid ${r.kod}66;background:${r.kod}22;color:${r.kod};font-size:0.95rem;font-weight:800;cursor:pointer;font-family:inherit">
      ${r.ad}
    </button>
  `).join('');

  _stroopState.bekliyor = true;

  // Süre çubuğu (3 saniye)
  const sureBar = document.getElementById('_stroopSureBar');
  if (sureBar) {
    sureBar.style.transition = 'none';
    sureBar.style.width = '100%';
    setTimeout(() => {
      sureBar.style.transition = 'width 3s linear';
      sureBar.style.width = '0%';
    }, 30);
  }

  _stroopState.timer = setTimeout(() => {
    if (_stroopState && _stroopState.bekliyor) {
      _stroopState.bekliyor = false;
      _stroopState.yanlis++;
      document.getElementById('_stroopGeri').textContent = '⏰ Süre doldu';
      document.getElementById('_stroopGeri').style.color = '#ff6584';
      setTimeout(() => _stroopTurSonraki(), 600);
    }
  }, 3000);
}

function _stroopCevap(secilen) {
  if (!_stroopState || !_stroopState.bekliyor) return;
  clearTimeout(_stroopState.timer);
  _stroopState.bekliyor = false;

  if (secilen === _stroopState.aktifRenk) {
    _stroopState.skor += 5;
    _stroopState.dogru++;
    document.getElementById('_stroopGeri').textContent = '✓ Doğru +5';
    document.getElementById('_stroopGeri').style.color = '#43b55a';
  } else {
    _stroopState.skor = Math.max(0, _stroopState.skor - 2);
    _stroopState.yanlis++;
    document.getElementById('_stroopGeri').textContent = `✕ Doğrusu: ${_stroopState.aktifRenk}`;
    document.getElementById('_stroopGeri').style.color = '#ff6584';
  }

  document.getElementById('_stroopSkor').textContent = _stroopState.skor;
  document.getElementById('_stroopDogru').textContent = _stroopState.dogru;

  setTimeout(() => _stroopTurSonraki(), 600);
}

function _stroopBitir() {
  const skor = _stroopState ? _stroopState.skor : 0;
  const dogru = _stroopState ? _stroopState.dogru : 0;
  const yanlis = _stroopState ? _stroopState.yanlis : 0;
  const isabet = (dogru + yanlis) > 0 ? Math.round(dogru / (dogru + yanlis) * 100) : 0;

  document.getElementById('_stroopGame').style.display = 'none';
  const bitisEl = document.getElementById('_stroopBitis');
  bitisEl.style.display = 'block';

  let mesaj = '';
  if (isabet >= 85) mesaj = '🎯 Çeldiricilere karşı çok güçlüsün!';
  else if (isabet >= 65) mesaj = '👍 İyi odaklandın.';
  else if (isabet >= 45) mesaj = '🙂 Beynin otomatik tepki vermeye çalıştı, normaldir.';
  else mesaj = '💪 Stroop etkisi gerçek — pratik yaptıkça aşacaksın.';

  bitisEl.innerHTML = `
    <div style="font-size:3rem;margin-bottom:10px">🎨</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px;color:#fff">Tamamlandı!</div>
    <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:18px">${mesaj}</div>
    <div style="background:rgba(244,114,182,0.12);border:1px solid rgba(244,114,182,0.3);border-radius:14px;padding:18px;margin-bottom:18px">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SKOR</div>
      <div style="font-size:2.2rem;font-weight:900;color:#f472b6">${skor}</div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:8px">
        ${dogru} doğru · ${yanlis} yanlış · %${isabet} isabet
      </div>
    </div>
    <button onclick="_stroopKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(244,114,182,0.2);color:#f472b6;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(244,114,182,0.4)">
      Tamam
    </button>
  `;

  _oyunOynanmisOlarakKaydet('stroop', skor);
}

function _stroopKapat() {
  if (_stroopState && _stroopState.timer) clearTimeout(_stroopState.timer);
  const modal = document.getElementById('_stroopOyunModal');
  if (modal) modal.remove();
  _stroopState = null;
  if (typeof showPage === 'function') showPage('oyun');
}

// ═══════════════════════════════════════════════════════════
// GÖRSEL MATRİS — Uzamsal Bellek
// ═══════════════════════════════════════════════════════════
// Grid'de bazı kareler yanıp söner. Öğrenci sırayla doğru
// kareleri tıklar. Her bölüm zorlaşır: 4x4 grid, başlangıçta
// 3 kare yanar, her geçişte +1.

let _matrisState = null;

function _matrisOyunuAc() {
  const existing = document.getElementById('_matrisOyunModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_matrisOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#0c1421,#1a2540);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_matrisKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_matrisIntro" style="text-align:center;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🔲</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Görsel Matris</div>
      <div style="font-size:0.86rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:24px">
        4×4 ızgarada bazı kareler <b style="color:#5dd4ff">yanıp söner</b>.
        <br><br>
        Sönen kareleri <b>aynı sırayla</b> tıklamaya çalış. Her geçtiğin bölümde bir kare daha eklenir.
        <br><br>
        3 hata yaparsan oyun biter.
      </div>
      <button onclick="_matrisBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#5dd4ff,#0ea5e9);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(93,212,255,0.4)">
        Başla →
      </button>
    </div>

    <div id="_matrisGame" style="display:none;text-align:center;width:100%;max-width:380px">
      <div style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:6px">
        BÖLÜM <span id="_matrisBolum">1</span>
      </div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:18px">
        Skor: <span id="_matrisSkor" style="color:#5dd4ff;font-weight:800">0</span> ·
        Can: <span id="_matrisCan" style="color:#ff6584;font-weight:800">❤️❤️❤️</span>
      </div>

      <div id="_matrisDurum" style="font-size:0.95rem;font-weight:700;margin-bottom:16px;min-height:24px;color:#5dd4ff">İzle...</div>

      <!-- 4x4 grid -->
      <div id="_matrisGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:280px;margin:0 auto"></div>

      <div id="_matrisIlerleme" style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-top:14px;min-height:16px"></div>
    </div>

    <div id="_matrisBitis" style="display:none;text-align:center;max-width:340px"></div>
  `;

  document.body.appendChild(modal);
}

function _matrisBasla() {
  document.getElementById('_matrisIntro').style.display = 'none';
  document.getElementById('_matrisGame').style.display = 'block';

  _matrisState = {
    bolum: 1,
    skor: 0,
    can: 3,
    gridN: 4,
    sira: [],
    aktifIdx: 0,
    bekliyor: false,
  };

  _matrisGridCiz();
  _matrisBolumBasla();
}

function _matrisGridCiz() {
  const grid = document.getElementById('_matrisGrid');
  if (!grid) return;
  const N = _matrisState.gridN;
  const total = N * N;
  let html = '';
  for (let i = 0; i < total; i++) {
    html += `<div id="_matrisKare_${i}" data-idx="${i}" onclick="_matrisKareTikla(${i})" style="aspect-ratio:1;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);border-radius:10px;cursor:pointer;transition:all 0.15s"></div>`;
  }
  grid.innerHTML = html;
}

function _matrisBolumBasla() {
  if (!_matrisState) return;
  const N = _matrisState.gridN;
  const toplamKare = N * N;
  const yanacakSayi = Math.min(toplamKare - 1, 2 + _matrisState.bolum); // bölüm 1: 3 kare, bölüm 2: 4 kare...

  // Rastgele unique kareler seç
  const sira = [];
  const kullanilan = new Set();
  while (sira.length < yanacakSayi) {
    const k = Math.floor(Math.random() * toplamKare);
    if (!kullanilan.has(k)) {
      kullanilan.add(k);
      sira.push(k);
    }
  }

  _matrisState.sira = sira;
  _matrisState.aktifIdx = 0;
  _matrisState.bekliyor = false;

  document.getElementById('_matrisBolum').textContent = _matrisState.bolum;
  document.getElementById('_matrisDurum').textContent = `İzle (${yanacakSayi} kare)...`;
  document.getElementById('_matrisDurum').style.color = '#5dd4ff';
  document.getElementById('_matrisIlerleme').textContent = '';

  // Sırayla yak-söndür
  let i = 0;
  const yakDelay = Math.max(400, 700 - _matrisState.bolum * 30); // bölüm arttıkça hızlanır
  const yakInterval = setInterval(() => {
    if (i > 0) {
      const onceki = document.getElementById('_matrisKare_' + sira[i-1]);
      if (onceki) {
        onceki.style.background = 'rgba(255,255,255,0.08)';
        onceki.style.borderColor = 'rgba(255,255,255,0.15)';
        onceki.style.boxShadow = 'none';
      }
    }
    if (i >= sira.length) {
      clearInterval(yakInterval);
      // Tıklama aşaması başlasın
      setTimeout(() => {
        _matrisState.bekliyor = true;
        document.getElementById('_matrisDurum').textContent = 'Şimdi sırayla tıkla';
        document.getElementById('_matrisDurum').style.color = '#fff';
        document.getElementById('_matrisIlerleme').textContent = `0 / ${sira.length}`;
      }, 200);
      return;
    }
    const k = sira[i];
    const el = document.getElementById('_matrisKare_' + k);
    if (el) {
      el.style.background = '#5dd4ff';
      el.style.borderColor = '#5dd4ff';
      el.style.boxShadow = '0 0 20px rgba(93,212,255,0.6)';
    }
    i++;
  }, yakDelay);
}

function _matrisKareTikla(idx) {
  if (!_matrisState || !_matrisState.bekliyor) return;
  const beklenen = _matrisState.sira[_matrisState.aktifIdx];
  const el = document.getElementById('_matrisKare_' + idx);

  if (idx === beklenen) {
    // Doğru
    if (el) {
      el.style.background = '#43b55a';
      el.style.borderColor = '#43b55a';
      setTimeout(() => {
        el.style.background = 'rgba(67,181,90,0.2)';
        el.style.borderColor = 'rgba(67,181,90,0.5)';
      }, 200);
    }
    _matrisState.aktifIdx++;
    document.getElementById('_matrisIlerleme').textContent = `${_matrisState.aktifIdx} / ${_matrisState.sira.length}`;

    if (_matrisState.aktifIdx >= _matrisState.sira.length) {
      // Bölüm tamamlandı
      _matrisState.bekliyor = false;
      _matrisState.skor += _matrisState.sira.length * 10;
      document.getElementById('_matrisSkor').textContent = _matrisState.skor;
      document.getElementById('_matrisDurum').textContent = `✓ Bölüm ${_matrisState.bolum} tamam!`;
      document.getElementById('_matrisDurum').style.color = '#43b55a';
      _matrisState.bolum++;
      setTimeout(() => {
        // Grid'i temizle
        for (let i = 0; i < _matrisState.gridN * _matrisState.gridN; i++) {
          const k = document.getElementById('_matrisKare_' + i);
          if (k) {
            k.style.background = 'rgba(255,255,255,0.08)';
            k.style.borderColor = 'rgba(255,255,255,0.15)';
            k.style.boxShadow = 'none';
          }
        }
        _matrisBolumBasla();
      }, 1100);
    }
  } else {
    // Yanlış
    if (el) {
      el.style.background = '#ff6584';
      el.style.borderColor = '#ff6584';
      setTimeout(() => {
        el.style.background = 'rgba(255,255,255,0.08)';
        el.style.borderColor = 'rgba(255,255,255,0.15)';
      }, 400);
    }
    _matrisState.can--;
    _matrisState.bekliyor = false;
    document.getElementById('_matrisCan').textContent = '❤️'.repeat(Math.max(0, _matrisState.can));
    document.getElementById('_matrisDurum').textContent = '✕ Yanlış!';
    document.getElementById('_matrisDurum').style.color = '#ff6584';

    if (_matrisState.can <= 0) {
      setTimeout(() => _matrisBitir(), 900);
    } else {
      // Aynı bölümü tekrar başlat
      setTimeout(() => {
        for (let i = 0; i < _matrisState.gridN * _matrisState.gridN; i++) {
          const k = document.getElementById('_matrisKare_' + i);
          if (k) {
            k.style.background = 'rgba(255,255,255,0.08)';
            k.style.borderColor = 'rgba(255,255,255,0.15)';
            k.style.boxShadow = 'none';
          }
        }
        _matrisBolumBasla();
      }, 1000);
    }
  }
}

function _matrisBitir() {
  const skor = _matrisState ? _matrisState.skor : 0;
  const bolum = _matrisState ? _matrisState.bolum - 1 : 0;

  document.getElementById('_matrisGame').style.display = 'none';
  const bitisEl = document.getElementById('_matrisBitis');
  bitisEl.style.display = 'block';

  let mesaj = '';
  if (bolum >= 8) mesaj = '🌟 İnanılmaz görsel hafıza!';
  else if (bolum >= 5) mesaj = '👏 Çok iyi gittin!';
  else if (bolum >= 3) mesaj = '🙂 Güzel başlangıç.';
  else mesaj = '💪 Tekrar dene, gelişeceksin.';

  bitisEl.innerHTML = `
    <div style="font-size:3rem;margin-bottom:10px">🔲</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px;color:#fff">Oyun Bitti</div>
    <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:18px">${mesaj}</div>
    <div style="background:rgba(93,212,255,0.12);border:1px solid rgba(93,212,255,0.3);border-radius:14px;padding:18px;margin-bottom:18px">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SKOR</div>
      <div style="font-size:2.2rem;font-weight:900;color:#5dd4ff">${skor}</div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:8px">${bolum} bölüm tamamlandı</div>
    </div>
    <button onclick="_matrisKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(93,212,255,0.2);color:#5dd4ff;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(93,212,255,0.4)">
      Tamam
    </button>
  `;

  _oyunOynanmisOlarakKaydet('matris', skor);
}

function _matrisKapat() {
  const modal = document.getElementById('_matrisOyunModal');
  if (modal) modal.remove();
  _matrisState = null;
  if (typeof showPage === 'function') showPage('oyun');
}
