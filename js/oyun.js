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
  const nefesBest = _oyunEnYuksekSkor('nefes');
  const bulmacaBest = _oyunEnYuksekSkor('bulmaca');

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
          ${_oyunKartHTML('nefes', '🫁', 'Nefes Egzersizi', 'Sınav kaygısını azaltan bilimsel bir teknik. 2 dakikalık nefes ritmini takip et.', false, 0, true)}
          ${_oyunKartHTML('bulmaca', '🧩', 'Kelime Bulmacası', '5 harfli gizli kelimeyi 6 denemede bul. Wordle tarzı, her gün yeni kelime.', false, 0, true)}
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

    ${_oyunKartHTML('nefes', '🫁', 'Nefes Egzersizi', 'Sınav kaygısını azaltan bilimsel bir teknik. 2 dakikalık nefes ritmini takip et.', nefesOynandi, nefesBest, false)}
    ${_oyunKartHTML('bulmaca', '🧩', 'Kelime Bulmacası', '5 harfli gizli kelimeyi 6 denemede bul. Her gün farklı kelime.', bulmacaOynandi, bulmacaBest, false)}

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
