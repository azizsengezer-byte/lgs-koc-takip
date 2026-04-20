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
  const bulmacaOynandi = _oyunOynandiMi('bulmaca');
  const nbackOynandi = _oyunOynandiMi('nback');
  const stroopOynandi = _oyunOynandiMi('stroop');
  const matrisOynandi = _oyunOynandiMi('matris');
  const sayiaviOynandi = _oyunOynandiMi('sayiavi');
  const bulmacaBest = _oyunEnYuksekSkor('bulmaca');
  const nbackBest = _oyunEnYuksekSkor('nback');
  const stroopBest = _oyunEnYuksekSkor('stroop');
  const matrisBest = _oyunEnYuksekSkor('matris');
  const sayiaviBest = _oyunEnYuksekSkor('sayiavi');

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
          ${_oyunKartHTML('bulmaca', '🧩', 'Kelime Bulmacası', '5 harfli gizli kelimeyi 6 denemede bul.', false, 0, true)}
          ${_oyunKartHTML('sayiavi', '🔢', 'Sayı Avı', '1\'den 25\'e kadar dağılmış sayıları sırayla bul.', false, 0, true)}
          ${_oyunKartHTML('nback', '🧠', 'N-Back: Çalışan Bellek', 'Çalışan bellek antrenmanı.', false, 0, true)}
          ${_oyunKartHTML('stroop', '🎨', 'Stroop: Çeldiriciye Karşı', 'Yazıyı değil rengi seç.', false, 0, true)}
          ${_oyunKartHTML('matris', '🔲', 'Görsel Matris', 'Yanıp sönen kareleri sırayla bul.', false, 0, true)}
        </div>
        <div style="margin-top:10px;padding:10px 13px;background:rgba(91,191,255,0.08);border-radius:10px;font-size:0.75rem;color:var(--text2)">
          💡 <b>Nefes egzersizi</b> kilit dışı — istediğin zaman günlük sayfasından açabilirsin.
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

    ${_oyunKartHTML('bulmaca', '🧩', 'Kelime Bulmacası', '5 harfli gizli kelimeyi 6 denemede bul. Her gün farklı kelime.', bulmacaOynandi, bulmacaBest, false)}
    ${_oyunKartHTML('sayiavi', '🔢', 'Sayı Avı', '1\'den 25\'e kadar dağılmış sayıları sırayla bul. En hızlı sen misin? Herkes bugün aynı grid ile karşılaşır.', sayiaviOynandi, sayiaviBest, false)}
    ${_oyunKartHTML('nback', '🧠', 'N-Back: Çalışan Bellek', 'Ekrandaki harfin 2 önceki ile aynı olup olmadığını bul. Yeni nesil sorularda veriyi kaybetmemek için.', nbackOynandi, nbackBest, false)}
    ${_oyunKartHTML('stroop', '🎨', 'Stroop: Çeldiriciye Karşı', 'Yazıyı değil, rengini seç. Soru tuzaklarına direnç kazandırır.', stroopOynandi, stroopBest, false)}
    ${_oyunKartHTML('matris', '🔲', 'Görsel Matris', 'Yanıp sönen kareleri sırayla bul. Geometri ve şekil sorularına hazırlık.', matrisOynandi, matrisBest, false)}

    <div style="margin-top:14px;padding:14px 16px;background:rgba(91,191,255,0.08);border:1px solid rgba(91,191,255,0.25);border-radius:14px;display:flex;align-items:center;gap:12px">
      <span style="font-size:1.8rem">🫁</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.85rem;font-weight:700;margin-bottom:2px">Nefes egzersizi mi yapmak istiyorsun?</div>
        <div style="font-size:0.72rem;color:var(--text2)">Günlük sayfasında her an açabilirsin — sınırsız.</div>
      </div>
      <button onclick="showPage('wellness')" style="padding:8px 14px;border-radius:10px;border:none;background:rgba(91,191,255,0.2);color:var(--accent);font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0">Git →</button>
    </div>

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

  // Sayı Avı'nın skoru "süre"dir, diğerleri normal skor
  let bestMetin = '';
  if (best > 0) {
    if (id === 'sayiavi') {
      // En yüksek puan → en iyi süre (düşük daha iyi)
      const myUid = (window.currentUserData || {}).uid || 'local';
      const bestTimeMs = parseInt(localStorage.getItem('oyun_sayiavi_besttime_' + myUid) || '0');
      if (bestTimeMs > 0) {
        bestMetin = `⚡ En iyi süren: <b>${(bestTimeMs/1000).toFixed(1)}s</b>`;
      } else {
        bestMetin = `🏆 En yüksek skorun: <b>${best}</b>`;
      }
    } else {
      bestMetin = `🏆 En yüksek skorun: <b>${best}</b>`;
    }
  } else {
    bestMetin = `<span style="color:var(--text2);opacity:0.6">Henüz oynamadın</span>`;
  }

  return `
    <div class="card" style="margin-bottom:12px;padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;gap:14px;padding:16px 16px 14px">
        <div style="font-size:2.4rem;flex-shrink:0;width:60px;text-align:center">${ikon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:800;font-size:0.98rem;margin-bottom:3px">${baslik}</div>
          <div style="font-size:0.78rem;color:var(--text2);line-height:1.5">${aciklama}</div>
        </div>
        <div style="flex-shrink:0">${buton}</div>
      </div>
      <div style="padding:8px 16px;background:${best > 0 ? 'rgba(91,191,255,0.06)' : 'var(--surface2)'};border-top:1px solid ${best > 0 ? 'rgba(91,191,255,0.15)' : 'var(--border)'};font-size:0.76rem;color:${best > 0 ? 'var(--accent)' : 'var(--text2)'};font-weight:600">
        ${bestMetin}
      </div>
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
  if (oyunId === 'bulmaca') _bulmacaOyunuAc();
  else if (oyunId === 'nback') _nbackOyunuAc();
  else if (oyunId === 'stroop') _stroopOyunuAc();
  else if (oyunId === 'matris') _matrisOyunuAc();
  else if (oyunId === 'sayiavi') _sayiaviOyunuAc();
}

// ═══════════════════════════════════════════════════════════
// NEFES EGZERSİZİ (WELLNESS içinde kullanılır — SINIRSIZ)
// ═══════════════════════════════════════════════════════════
// 4-7-8 Tekniği: 4sn al, 7sn tut, 8sn ver.
// Oyun değil, gerçek bir rahatlama aracı. Skor yok, günlük limit yok.
// Kaç döngü yapıldığı sayılır (motivasyon için).

function nefesEgzersiziAc() {
  _nefesOyunuAc();
}

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
      <div style="font-size:0.88rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:20px">
        4-7-8 tekniği — sınav kaygısını azaltan, sinir sistemini yatıştıran bilimsel bir nefes egzersizi.
        <br><br>
        <b style="color:#5BBFFF">4 saniye</b> nefes al →
        <b style="color:#FAC775">7 saniye</b> tut →
        <b style="color:#5DCAA5">8 saniye</b> nefes ver
        <br><br>
        <span style="font-size:0.8rem;color:rgba(255,255,255,0.5)">Ne zaman ihtiyacın olursa aç — sınırsız, skor yok.</span>
      </div>
      <button onclick="_nefesBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#5BBFFF,#185FA5);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(91,191,255,0.4)">
        Başla →
      </button>
    </div>

    <!-- Egzersiz ekranı -->
    <div id="_nefesGame" style="display:none;text-align:center;color:#fff;width:100%;max-width:380px">
      <div id="_nefesDongu" style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:12px">DÖNGÜ 1</div>

      <!-- Daire -->
      <div style="position:relative;width:240px;height:240px;margin:0 auto 30px;display:flex;align-items:center;justify-content:center">
        <div id="_nefesRing" style="position:absolute;width:240px;height:240px;border-radius:50%;border:3px solid rgba(91,191,255,0.3);transition:all 0.5s"></div>
        <div id="_nefesCore" style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#5BBFFF,#185FA5);transition:all 4s cubic-bezier(0.4,0,0.6,1);box-shadow:0 0 60px rgba(91,191,255,0.6)"></div>
      </div>

      <div id="_nefesFaz" style="font-size:1.6rem;font-weight:800;margin-bottom:6px">HAZIR OL</div>
      <div id="_nefesSayac" style="font-size:0.9rem;color:rgba(255,255,255,0.6);margin-bottom:18px">3</div>

      <button onclick="_nefesBitirManuel()" style="padding:10px 24px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.7);font-size:0.82rem;font-weight:600;cursor:pointer;font-family:inherit">
        Yeterli — Bitir
      </button>
    </div>

    <!-- Bitiş ekranı -->
    <div id="_nefesBitis" style="display:none;text-align:center;color:#fff;max-width:340px">
      <div style="font-size:3rem;margin-bottom:10px">✨</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px">Güzel gidiyor</div>
      <div id="_nefesBitisAlt" style="font-size:0.9rem;color:rgba(255,255,255,0.65);margin-bottom:20px;line-height:1.6"></div>
      <div style="display:flex;gap:10px;justify-content:center">
        <button onclick="_nefesKapat()" style="padding:12px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.8);font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          Tamam
        </button>
        <button onclick="_nefesTekrar()" style="padding:12px 24px;border-radius:12px;border:none;background:rgba(91,191,255,0.2);color:#5BBFFF;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(91,191,255,0.4)">
          🫁 Tekrar Başla
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

let _nefesState = null;

function _nefesBasla() {
  document.getElementById('_nefesIntro').style.display = 'none';
  document.getElementById('_nefesGame').style.display = 'block';
  const bitisEl = document.getElementById('_nefesBitis');
  if (bitisEl) bitisEl.style.display = 'none';

  _nefesState = {
    dongu: 0,
    timer: null,
    aktif: true,
  };

  _nefesGeriSayim(3, () => _nefesDonguBasla());
}

function _nefesGeriSayim(saniye, onDone) {
  const fazEl = document.getElementById('_nefesFaz');
  const sayacEl = document.getElementById('_nefesSayac');
  if (fazEl) { fazEl.textContent = 'HAZIR OL'; fazEl.style.color = '#fff'; }
  let kalan = saniye;
  if (sayacEl) sayacEl.textContent = String(kalan);
  const timer = setInterval(() => {
    if (!_nefesState || !_nefesState.aktif) { clearInterval(timer); return; }
    kalan--;
    if (sayacEl) sayacEl.textContent = String(kalan);
    if (kalan <= 0) { clearInterval(timer); onDone(); }
  }, 1000);
  if (_nefesState) _nefesState.timer = timer;
}

function _nefesDonguBasla() {
  if (!_nefesState || !_nefesState.aktif) return;
  _nefesState.dongu++;
  const donguEl = document.getElementById('_nefesDongu');
  if (donguEl) donguEl.textContent = `DÖNGÜ ${_nefesState.dongu}`;

  // Faz 1: Nefes al (4 sn)
  _nefesFaz('AL', '#5BBFFF', 4, 220, () => {
    if (!_nefesState || !_nefesState.aktif) return;
    // Faz 2: Tut (7 sn)
    _nefesFaz('TUT', '#FAC775', 7, 220, () => {
      if (!_nefesState || !_nefesState.aktif) return;
      // Faz 3: Ver (8 sn)
      _nefesFaz('VER', '#5DCAA5', 8, 60, () => {
        if (!_nefesState || !_nefesState.aktif) return;
        // Kısa ara sonra bir sonraki döngü
        setTimeout(() => _nefesDonguBasla(), 800);
      });
    });
  });
}

function _nefesFaz(label, renk, saniye, hedefBoyut, onDone) {
  const fazEl = document.getElementById('_nefesFaz');
  const sayacEl = document.getElementById('_nefesSayac');
  const coreEl = document.getElementById('_nefesCore');
  const ringEl = document.getElementById('_nefesRing');

  if (fazEl) { fazEl.textContent = 'NEFES ' + label; fazEl.style.color = renk; }
  if (coreEl) {
    coreEl.style.transition = `all ${saniye}s cubic-bezier(0.4,0,0.6,1)`;
    coreEl.style.width = hedefBoyut + 'px';
    coreEl.style.height = hedefBoyut + 'px';
    coreEl.style.background = `linear-gradient(135deg,${renk},${renk}88)`;
    coreEl.style.boxShadow = `0 0 80px ${renk}99`;
  }
  if (ringEl) ringEl.style.borderColor = renk + '66';

  let kalan = saniye;
  if (sayacEl) sayacEl.textContent = String(kalan);
  const timer = setInterval(() => {
    if (!_nefesState || !_nefesState.aktif) { clearInterval(timer); return; }
    kalan--;
    if (sayacEl) sayacEl.textContent = String(Math.max(0, kalan));
    if (kalan <= 0) { clearInterval(timer); onDone(); }
  }, 1000);
  if (_nefesState) _nefesState.timer = timer;
}

function _nefesBitirManuel() {
  if (!_nefesState) return;
  _nefesState.aktif = false;
  if (_nefesState.timer) clearInterval(_nefesState.timer);

  const tamamlanan = _nefesState.dongu > 0 ? _nefesState.dongu - 1 : 0;
  document.getElementById('_nefesGame').style.display = 'none';
  const bitisEl = document.getElementById('_nefesBitis');
  bitisEl.style.display = 'block';

  const altEl = document.getElementById('_nefesBitisAlt');
  let mesaj = '';
  if (tamamlanan >= 4) mesaj = `${tamamlanan} tam döngü tamamladın — sinir sistemin yavaşladı.`;
  else if (tamamlanan >= 2) mesaj = `${tamamlanan} döngü yaptın. Az bile olsa etki eder.`;
  else if (tamamlanan === 1) mesaj = '1 döngü yaptın — her başlangıç değerli.';
  else mesaj = 'İlk döngünü başlatmıştın, istersen tekrar dene.';
  if (altEl) altEl.textContent = mesaj;
}

function _nefesTekrar() {
  _nefesState = null;
  document.getElementById('_nefesBitis').style.display = 'none';
  document.getElementById('_nefesIntro').style.display = 'block';
  const coreEl = document.getElementById('_nefesCore');
  if (coreEl) {
    coreEl.style.transition = 'all 0.3s';
    coreEl.style.width = '60px';
    coreEl.style.height = '60px';
    coreEl.style.background = 'linear-gradient(135deg,#5BBFFF,#185FA5)';
    coreEl.style.boxShadow = '0 0 60px rgba(91,191,255,0.6)';
  }
}

function _nefesKapat() {
  if (_nefesState) {
    _nefesState.aktif = false;
    if (_nefesState.timer) clearInterval(_nefesState.timer);
  }
  const modal = document.getElementById('_nefesOyunModal');
  if (modal) modal.remove();
  _nefesState = null;
}

// ═══════════════════════════════════════════════════════════
// 5-4-3-2-1 TOPRAKLAMA EGZERSİZİ (WELLNESS — SINIRSIZ)
// ═══════════════════════════════════════════════════════════
// Panik anında şimdiki ana dönüş. 5 aşama, her aşamada bir duyu.
// Zaman sınırı YOK. Kullanıcı kendi ritminde ilerler.
// Her adımda 1-2 kelime yazar (opsiyonel), "Devam" ile geçer.

let _topraklamaState = null;

const _TOPRAKLAMA_ADIMLAR = [
  {
    sayi: 5,
    duyu: 'GÖR',
    ikon: '👁️',
    renk: '#5BBFFF',
    baslik: 'Etrafında gördüğün 5 şey',
    aciklama: 'Yavaşça etrafına bak. İlk gördüğün 5 şeyi fark et — kalem, lamba, perde, ne varsa.',
    placeholder: 'örn: kalem, lamba, duvar...',
  },
  {
    sayi: 4,
    duyu: 'DUY',
    ikon: '👂',
    renk: '#a78bfa',
    baslik: 'Duyabildiğin 4 ses',
    aciklama: 'Sessizce dinle. Dışarıdan, odandan, kendi bedeninden gelen sesler var.',
    placeholder: 'örn: saat tıkırtısı, rüzgar...',
  },
  {
    sayi: 3,
    duyu: 'DOKUN',
    ikon: '✋',
    renk: '#f472b6',
    baslik: 'Dokunduğun 3 şey',
    aciklama: 'Parmaklarınla dokun. Hissettiğin dokuları fark et — masa, giysin, cilt.',
    placeholder: 'örn: masa, tişört, saç...',
  },
  {
    sayi: 2,
    duyu: 'KOKLA',
    ikon: '👃',
    renk: '#fbbf24',
    baslik: 'Kokladığın 2 şey',
    aciklama: 'Derin bir nefes al. Belirgin bir koku yoksa havayı, kâğıdı, cildini kokla.',
    placeholder: 'örn: kağıt, hava, cilt...',
  },
  {
    sayi: 1,
    duyu: 'TAT',
    ikon: '👅',
    renk: '#43b89c',
    baslik: 'Tadını aldığın 1 şey',
    aciklama: 'Ağzındaki tadı fark et. Su iç, yudumla, ya da ağzının mevcut tadını hisset.',
    placeholder: 'örn: su, nane, tükürük...',
  },
];

function topraklamaEgzersiziAc() {
  const existing = document.getElementById('_topraklamaModal');
  if (existing) existing.remove();

  _topraklamaState = { adimIdx: -1, girdiler: [] };

  const modal = document.createElement('div');
  modal.id = '_topraklamaModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#0a1f1a,#1a3a2d);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:24px 20px;overflow:hidden;
  `;

  modal.innerHTML = `
    <button onclick="_topraklamaKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_topraklamaContent" style="width:100%;max-width:380px"></div>
  `;

  document.body.appendChild(modal);
  _topraklamaIntroGoster();
}

function _topraklamaIntroGoster() {
  const c = document.getElementById('_topraklamaContent');
  if (!c) return;
  c.innerHTML = `
    <div style="text-align:center;color:#fff">
      <div style="font-size:3rem;margin-bottom:14px">🌿</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">5-4-3-2-1 Topraklama</div>
      <div style="font-size:0.88rem;color:rgba(255,255,255,0.7);line-height:1.75;margin-bottom:24px;text-align:left;padding:0 8px">
        Zihnin şu an kaygıyla geleceğe kaçıyorsa, bu egzersiz seni <b style="color:#43b89c">şimdiki ana</b> geri getirir.
        <br><br>
        Beş duyunu sırayla kullanacaksın:
        <br>
        <span style="display:block;margin:8px 0 0 0;font-size:0.82rem;color:rgba(255,255,255,0.65)">
        👁️ 5 gördüğün · 👂 4 duyduğun · ✋ 3 dokunduğun · 👃 2 kokladığın · 👅 1 tattığın şey
        </span>
        <br>
        <span style="font-size:0.78rem;color:rgba(255,255,255,0.5)">Acele etme. Kendi hızında ilerle.</span>
      </div>
      <button onclick="_topraklamaSonrakiAdim()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#43b89c,#2d7a67);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(67,184,156,0.4)">
        Başla →
      </button>
    </div>
  `;
}

function _topraklamaSonrakiAdim() {
  if (!_topraklamaState) return;
  _topraklamaState.adimIdx++;

  if (_topraklamaState.adimIdx >= _TOPRAKLAMA_ADIMLAR.length) {
    _topraklamaBitir();
    return;
  }

  const adim = _TOPRAKLAMA_ADIMLAR[_topraklamaState.adimIdx];
  const toplam = _TOPRAKLAMA_ADIMLAR.length;
  const mevcut = _topraklamaState.adimIdx + 1;

  const c = document.getElementById('_topraklamaContent');
  if (!c) return;

  // Sakin halka animasyonu için CSS
  c.innerHTML = `
    <style>
      @keyframes _topraklamaHalka {
        0% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(1.15); opacity: 0.15; }
        100% { transform: scale(1.3); opacity: 0; }
      }
    </style>
    <div style="text-align:center;color:#fff">
      <!-- İlerleme noktaları -->
      <div style="display:flex;justify-content:center;gap:6px;margin-bottom:20px">
        ${_TOPRAKLAMA_ADIMLAR.map((_, i) => `<div style="width:${i === _topraklamaState.adimIdx ? '24' : '8'}px;height:8px;border-radius:4px;background:${i <= _topraklamaState.adimIdx ? adim.renk : 'rgba(255,255,255,0.15)'};transition:.4s"></div>`).join('')}
      </div>

      <!-- Büyük sayı + duyu -->
      <div style="position:relative;width:140px;height:140px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center">
        <div style="position:absolute;inset:0;border-radius:50%;background:${adim.renk};opacity:0.4;animation:_topraklamaHalka 2.5s ease-out infinite"></div>
        <div style="position:absolute;inset:0;border-radius:50%;background:${adim.renk};opacity:0.4;animation:_topraklamaHalka 2.5s ease-out infinite 0.8s"></div>
        <div style="position:relative;width:90px;height:90px;border-radius:50%;background:${adim.renk};display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 40px ${adim.renk}88">
          <div style="font-size:2.2rem;line-height:1;color:#fff">${adim.ikon}</div>
        </div>
      </div>

      <div style="font-size:0.72rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.15em;margin-bottom:4px">ADIM ${mevcut}/${toplam}</div>
      <div style="font-size:2.2rem;font-weight:900;color:${adim.renk};line-height:1;margin-bottom:8px">${adim.sayi}</div>
      <div style="font-size:1.05rem;font-weight:800;color:#fff;margin-bottom:8px">${adim.baslik}</div>
      <div style="font-size:0.84rem;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:20px;max-width:320px;margin-left:auto;margin-right:auto">
        ${adim.aciklama}
      </div>

      <!-- Opsiyonel input -->
      <input id="_topraklamaInput" type="text" placeholder="${adim.placeholder}" maxlength="80"
        style="width:100%;max-width:300px;padding:11px 14px;border-radius:11px;border:1.5px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:0.9rem;text-align:center;outline:none;margin-bottom:8px;font-family:inherit">
      <div style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin-bottom:20px">isteğe bağlı — yazmadan da geçebilirsin</div>

      <button onclick="_topraklamaDevam()" style="width:100%;max-width:300px;padding:13px;border-radius:12px;border:none;background:${adim.renk};color:#fff;font-size:0.95rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 16px ${adim.renk}66">
        Fark Ettim →
      </button>
    </div>
  `;

  // Input'a focus yapma, otomatik klavye açmasın — kullanıcı isterse dokunur
}

function _topraklamaDevam() {
  if (!_topraklamaState) return;
  const input = document.getElementById('_topraklamaInput');
  const deger = input ? input.value.trim() : '';
  _topraklamaState.girdiler.push(deger);
  _topraklamaSonrakiAdim();
}

function _topraklamaBitir() {
  const c = document.getElementById('_topraklamaContent');
  if (!c) return;

  // Kullanıcı en az 1 şey yazdıysa özet göster
  const yazilanlar = _topraklamaState.girdiler.filter(g => g.length > 0);
  let ozetHtml = '';
  if (yazilanlar.length > 0) {
    ozetHtml = `
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:18px;text-align:left">
        <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:8px">FARK ETTİKLERİN</div>
        ${_TOPRAKLAMA_ADIMLAR.map((adim, i) => {
          const g = _topraklamaState.girdiler[i];
          if (!g) return '';
          return `<div style="font-size:0.82rem;color:rgba(255,255,255,0.8);line-height:1.6;margin-bottom:4px">
            <span style="color:${adim.renk};font-weight:700">${adim.ikon} ${adim.duyu}:</span> ${g}
          </div>`;
        }).filter(x => x).join('')}
      </div>`;
  }

  c.innerHTML = `
    <div style="text-align:center;color:#fff">
      <div style="font-size:3rem;margin-bottom:12px">🌿</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px">Şimdiki Andasın</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.65);margin-bottom:20px;line-height:1.6">
        Beş duyunu da gezdirdin. Zihnin biraz daha sakin, biraz daha burada.
      </div>
      ${ozetHtml}
      <div style="display:flex;gap:10px;justify-content:center">
        <button onclick="_topraklamaKapat()" style="padding:12px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.8);font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          Tamam
        </button>
        <button onclick="_topraklamaTekrar()" style="padding:12px 24px;border-radius:12px;border:none;background:rgba(67,184,156,0.2);color:#43b89c;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(67,184,156,0.4)">
          🌿 Tekrar Başla
        </button>
      </div>
    </div>
  `;
}

function _topraklamaTekrar() {
  _topraklamaState = { adimIdx: -1, girdiler: [] };
  _topraklamaIntroGoster();
}

function _topraklamaKapat() {
  const modal = document.getElementById('_topraklamaModal');
  if (modal) modal.remove();
  _topraklamaState = null;
}

// ═══════════════════════════════════════════════════════════
// KAS GEVŞETME — Jacobson Tekniği (WELLNESS — SINIRSIZ)
// ═══════════════════════════════════════════════════════════
// 6 kas grubu: yumruklar, kollar, omuzlar, yüz, göğüs/karın, bacaklar
// Her grup: 5 sn ger → 10 sn bırak. Toplam ~90 saniye.
// SVG figür — aktif bölge gergin fazda kırmızı, bırakma fazında yeşil parlar.

let _kasState = null;

const _KAS_GRUPLARI = [
  {
    id: 'eller',
    baslik: 'Yumruklar',
    ikon: '✊',
    gerMesaj: 'İki elini sıkıca yumruk yap. Tırnakların avuç içine batsın. Parmaklarını sıkıca kıstır.',
    bosMesaj: 'Yumruklarını aç. Parmaklarını serbest bırak. Avucunun içindeki yumuşamayı hisset.',
    bolgeler: ['sol-el', 'sag-el'],
  },
  {
    id: 'kollar',
    baslik: 'Kollar',
    ikon: '💪',
    gerMesaj: 'Kollarını gererek yukarı kaldır. Pazularını sık. Kollar gergin, titresin.',
    bosMesaj: 'Kollarını yavaşça indir. Kaslarının yumuşamasını hisset. Kolların ağırlaşsın.',
    bolgeler: ['sol-kol', 'sag-kol'],
  },
  {
    id: 'omuzlar',
    baslik: 'Omuzlar',
    ikon: '🤷',
    gerMesaj: 'Omuzlarını kulaklarına doğru kaldır. Sıkıca yukarı çek. Boyun gerilsin.',
    bosMesaj: 'Omuzlarını aşağı bırak. Düşsünler. Boynundaki gerginliğin gittiğini hisset.',
    bolgeler: ['omuz'],
  },
  {
    id: 'yuz',
    baslik: 'Yüz ve Çene',
    ikon: '😬',
    gerMesaj: 'Gözlerini sıkıca yum. Dişlerini sık. Alnını kırıştır. Tüm yüz kasları gergin.',
    bosMesaj: 'Gözlerini yumuşat. Çeneni bırak. Alnın gevşesin. Yüzün rahat.',
    bolgeler: ['yuz'],
  },
  {
    id: 'govde',
    baslik: 'Göğüs ve Karın',
    ikon: '🫁',
    gerMesaj: 'Nefes al ve göğsünü şişir. Karnını içeri çek. Gövdeni sert tut.',
    bosMesaj: 'Nefesini ver. Göğsün ve karnın yumuşasın. Gövdene yerçekimini bırak.',
    bolgeler: ['govde'],
  },
  {
    id: 'bacaklar',
    baslik: 'Bacaklar',
    ikon: '🦵',
    gerMesaj: 'Bacaklarını uzat. Parmak uçlarını kendinden uzaklaştır. Baldır kasların gergin.',
    bosMesaj: 'Bacaklarını bırak. Ayakların rahat. Bacakların ağırlaşsın, yere batsın.',
    bolgeler: ['sol-bacak', 'sag-bacak'],
  },
];

function kasGevsetmeEgzersiziAc() {
  const existing = document.getElementById('_kasGevsetmeModal');
  if (existing) existing.remove();

  _kasState = { grupIdx: -1, faz: null, timer: null, aktif: true };

  const modal = document.createElement('div');
  modal.id = '_kasGevsetmeModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#1a0f08,#2d1810);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px;overflow-y:auto;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_kasGevsetmeKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2">×</button>

    <div id="_kasContent" style="width:100%;max-width:380px"></div>
  `;

  document.body.appendChild(modal);
  _kasIntroGoster();
}

function _kasIntroGoster() {
  const c = document.getElementById('_kasContent');
  if (!c) return;
  c.innerHTML = `
    <div style="text-align:center">
      <div style="font-size:3rem;margin-bottom:14px">💪</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Kas Gevşetme</div>
      <div style="font-size:0.85rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:20px;text-align:left;padding:0 8px">
        <b style="color:#ffb380">Jacobson tekniği</b> — kaygılıyken bedenin farkında olmadan kasılır. Bu egzersiz kasları <b>bilinçli olarak</b> sırayla gerip bırakarak bedene "güvendesin" sinyali gönderir.
        <br><br>
        6 kas grubu → her biri <b style="color:#ff6584">5 sn ger</b> → <b style="color:#43b89c">10 sn bırak</b>
        <br><br>
        <span style="font-size:0.78rem;color:rgba(255,255,255,0.5)">Yaklaşık 90 saniye sürer. Rahat bir pozisyonda otur, ekrandaki yönergeleri takip et.</span>
      </div>
      <button onclick="_kasBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#e67e22,#c0542a);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(230,126,34,0.4)">
        Başla →
      </button>
    </div>
  `;
}

function _kasBasla() {
  if (!_kasState) return;
  _kasState.grupIdx = -1;
  _kasSonrakiGrup();
}

function _kasSonrakiGrup() {
  if (!_kasState || !_kasState.aktif) return;
  _kasState.grupIdx++;

  if (_kasState.grupIdx >= _KAS_GRUPLARI.length) {
    _kasBitir();
    return;
  }

  const grup = _KAS_GRUPLARI[_kasState.grupIdx];
  _kasEkranCiz(grup);
  _kasGerFazi(grup);
}

function _kasGerFazi(grup) {
  if (!_kasState || !_kasState.aktif) return;
  _kasState.faz = 'ger';

  // Görsel: gergin bölgeler kırmızı parlak
  grup.bolgeler.forEach(b => {
    const el = document.getElementById('_kasBolge_' + b);
    if (el) {
      el.style.fill = '#ef4444';
      el.style.filter = 'drop-shadow(0 0 12px #ef4444cc)';
    }
  });

  const mesajEl = document.getElementById('_kasMesaj');
  const fazEl = document.getElementById('_kasFazLabel');
  if (mesajEl) mesajEl.textContent = grup.gerMesaj;
  if (fazEl) { fazEl.textContent = '🔴 GER'; fazEl.style.color = '#ef4444'; }

  _kasGeriSayim(5, () => _kasBosFazi(grup));
}

function _kasBosFazi(grup) {
  if (!_kasState || !_kasState.aktif) return;
  _kasState.faz = 'bos';

  // Görsel: gevşeyen bölgeler yeşil yumuşak
  grup.bolgeler.forEach(b => {
    const el = document.getElementById('_kasBolge_' + b);
    if (el) {
      el.style.fill = '#43b89c';
      el.style.filter = 'drop-shadow(0 0 16px #43b89c99)';
    }
  });

  const mesajEl = document.getElementById('_kasMesaj');
  const fazEl = document.getElementById('_kasFazLabel');
  if (mesajEl) mesajEl.textContent = grup.bosMesaj;
  if (fazEl) { fazEl.textContent = '🟢 BIRAK'; fazEl.style.color = '#43b89c'; }

  _kasGeriSayim(10, () => {
    // Bölgeyi nötr gri'ye döndür
    grup.bolgeler.forEach(b => {
      const el = document.getElementById('_kasBolge_' + b);
      if (el) {
        el.style.fill = 'rgba(255,255,255,0.15)';
        el.style.filter = 'none';
      }
    });
    _kasSonrakiGrup();
  });
}

function _kasGeriSayim(saniye, onDone) {
  const sayacEl = document.getElementById('_kasSayac');
  let kalan = saniye;
  if (sayacEl) sayacEl.textContent = String(kalan);
  const timer = setInterval(() => {
    if (!_kasState || !_kasState.aktif) { clearInterval(timer); return; }
    kalan--;
    if (sayacEl) sayacEl.textContent = String(Math.max(0, kalan));
    if (kalan <= 0) { clearInterval(timer); onDone(); }
  }, 1000);
  if (_kasState) _kasState.timer = timer;
}

function _kasEkranCiz(grup) {
  const c = document.getElementById('_kasContent');
  if (!c) return;
  const mevcut = _kasState.grupIdx + 1;
  const toplam = _KAS_GRUPLARI.length;

  c.innerHTML = `
    <div style="text-align:center">
      <!-- İlerleme noktaları -->
      <div style="display:flex;justify-content:center;gap:5px;margin-bottom:14px">
        ${_KAS_GRUPLARI.map((_, i) => `<div style="width:${i === _kasState.grupIdx ? '24' : '7'}px;height:7px;border-radius:4px;background:${i <= _kasState.grupIdx ? '#e67e22' : 'rgba(255,255,255,0.15)'};transition:.4s"></div>`).join('')}
      </div>

      <!-- Grup başlığı -->
      <div style="font-size:0.68rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.15em;margin-bottom:4px">GRUP ${mevcut}/${toplam}</div>
      <div style="font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:14px">${grup.ikon} ${grup.baslik}</div>

      <!-- SVG Figür -->
      <div style="margin:0 auto 18px;display:flex;justify-content:center">
        ${_kasFigurSvg()}
      </div>

      <!-- Faz + sayaç -->
      <div id="_kasFazLabel" style="font-size:1.1rem;font-weight:800;margin-bottom:6px;letter-spacing:.05em">🔴 GER</div>
      <div id="_kasSayac" style="font-size:2.4rem;font-weight:900;color:#fff;line-height:1;margin-bottom:14px;font-variant-numeric:tabular-nums">5</div>

      <!-- Mesaj -->
      <div id="_kasMesaj" style="font-size:0.88rem;color:rgba(255,255,255,0.8);line-height:1.6;min-height:56px;padding:0 10px"></div>
    </div>
  `;
}

function _kasFigurSvg() {
  // Basit insan silueti. Bölgeler ID'li path'ler.
  // viewBox: 200x260
  return `
    <svg width="180" height="234" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      <!-- Arka plan glow -->
      <circle cx="100" cy="130" r="100" fill="rgba(230,126,34,0.04)"/>

      <!-- Yüz -->
      <circle id="_kasBolge_yuz" cx="100" cy="32" r="20" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Omuz (geniş kısım) -->
      <path id="_kasBolge_omuz" d="M60 64 Q100 56 140 64 L145 82 Q100 76 55 82 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Gövde (göğüs+karın) -->
      <path id="_kasBolge_govde" d="M62 82 L138 82 L134 152 L66 152 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Sol kol (üst) -->
      <path id="_kasBolge_sol-kol" d="M55 82 L42 82 L32 140 L45 142 L55 90 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>
      <!-- Sağ kol (üst) -->
      <path id="_kasBolge_sag-kol" d="M145 82 L158 82 L168 140 L155 142 L145 90 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Sol el (yumruk) -->
      <circle id="_kasBolge_sol-el" cx="38" cy="152" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>
      <!-- Sağ el (yumruk) -->
      <circle id="_kasBolge_sag-el" cx="162" cy="152" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Sol bacak -->
      <path id="_kasBolge_sol-bacak" d="M70 152 L66 152 L72 240 L86 240 L88 152 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>
      <!-- Sağ bacak -->
      <path id="_kasBolge_sag-bacak" d="M130 152 L134 152 L128 240 L114 240 L112 152 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>
    </svg>
  `;
}

function _kasBitir() {
  if (!_kasState) return;
  _kasState.aktif = false;
  if (_kasState.timer) clearInterval(_kasState.timer);

  const c = document.getElementById('_kasContent');
  if (!c) return;

  c.innerHTML = `
    <div style="text-align:center">
      <div style="font-size:3rem;margin-bottom:12px">✨</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px">Bedenin Gevşedi</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.65);margin-bottom:20px;line-height:1.7;padding:0 10px">
        Altı kas grubunu sırayla çalıştırdın. Beden "güvendesin" sinyalini aldı — kortizol düşer, kalp atışı yavaşlar.
        <br><br>
        <span style="font-size:0.82rem;color:rgba(255,255,255,0.5)">Gözlerini kapatıp son bir derin nefes alabilirsin.</span>
      </div>
      <div style="display:flex;gap:10px;justify-content:center">
        <button onclick="_kasGevsetmeKapat()" style="padding:12px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.8);font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          Tamam
        </button>
        <button onclick="_kasTekrar()" style="padding:12px 24px;border-radius:12px;border:none;background:rgba(230,126,34,0.2);color:#ffb380;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(230,126,34,0.4)">
          💪 Tekrar Başla
        </button>
      </div>
    </div>
  `;
}

function _kasTekrar() {
  _kasState = { grupIdx: -1, faz: null, timer: null, aktif: true };
  _kasIntroGoster();
}

function _kasGevsetmeKapat() {
  if (_kasState) {
    _kasState.aktif = false;
    if (_kasState.timer) clearInterval(_kasState.timer);
  }
  const modal = document.getElementById('_kasGevsetmeModal');
  if (modal) modal.remove();
  _kasState = null;
}

// ═══════════════════════════════════════════════════════════
// KELİME BULMACASI (Wordle tarzı)
// ═══════════════════════════════════════════════════════════
// 5 harfli Türkçe kelimeler. 6 deneme. Her gün farklı kelime.
// Yeşil: doğru harf doğru yer. Sarı: doğru harf yanlış yer. Gri: yok.

const _BULMACA_KELIMELER = [
  'BAVUL','ZAMAN','KAVGA','FENER','GÜNEŞ','HÜCRE','ILGIN','JOKER','KABAK','LAMBA',
  'MEYVE','NOKTA','ORMAN','ÖRDEK','PAKET','RADAR','SABUN','ŞEHİR','TABLO','UYARI',
  'VERGİ','YALAN','ZARAR','AKORT','BÖLGE','CEKET','ÇANTA','DAİRE','ESNEK','FİGÜR',
  'GÖZCÜ','HIRKA','IRMAK','JİLET','KEMER','LİMON','MADEN','NAMUS','OTLAK','ÖVÜNÇ',
  'PASTA','RAKET','SINAV','ŞEKER','TAVAN','UZMAN','ÜCRET','VİŞNE','YOSUN','ZEMİN',
  'ARŞİV','BETON','CEVİZ','ÇİZGİ','EVRAK','FİRMA','GALİP','HUKUK','ISLAK','JETON',
  'KİLİT','LİDER','MASAL','NEFES','ONLAR','ÖLÇÜM','PAZAR','ROBOT','SEÇİM','ŞERİT',
  'TURŞU','ÜTÜCÜ','VAGON','YEMEK','ATLAS','BİBER','CÜMLE','ÇEKİÇ','DOLAR','FULAR',
  'GÖVDE','HAYAT','JAPON','KAYIK','LİSTE','METAL','NİSAN','ORTAK','ÖNDER','PİLOT',
  'RADYO','SİYAH','TARAK','UYGUN','ÜSTÜN','YÜZEY','ABİYE','BALIK','CASUS','ÇİÇEK',
  'DUVAR','ERKEN','FOSİL','GİTAR','HEDEF','ISRAR','KÖPEK','MÜZİK','NİYET','SAYGI',
  'ŞARKI','VATAN','YARIN','ZALİM','ADRES','BANDO','CİHAZ','ÇORAP','DOLAP','ELMAS',
  'HASTA','ISLIK','KULAK','LOKUM','NAKİT','POLİS','ŞAPKA','TAVUK','VİRAJ','YAZAR',
  'AMPUL','BİLET','CESUR','ÇOCUK','DENİZ','EYLEM','FIRÇA','GARAJ','HABER','KİTAP',
  'LEVHA','NÖBET','PARKA','REÇEL','SEVGİ','YATAK','ZAYIF','AHŞAP','BULUT','CAMCI',
  'ÇABUK','DAVUL','ENGEL','GAZOZ','HALAT','KAĞIT','LİMAN','PİLAV','ÇORBA','AYRAN',
  'KAHVE','HELVA','SALÇA','NOHUT','HURMA','BÖREK','SİMİT','ÇİLEK','KAYSI','YUFKA',
  'TABAK','KAŞIK','BIÇAK','KAPAK','AVİZE','ASTAR','PERDE','KİLİM','HAVLU','SÜRME',
  'ASKER','MEMUR','ÇIRAK','ŞOFÖR','BAKAN','HAKİM','AKTÖR','YEŞİL','BEYAZ','PEMBE',
  'KÜÇÜK','BÜYÜK','HAFİF','SICAK','SOĞUK','YAVAŞ','HIZLI','DERİN','GENİŞ','GÜZEL',
  'TATLI','TUZLU','ÇİMEN','SABAH','AKŞAM','HAFTA','BUGÜN','DUDAK','DAMAK','YANAK',
  'TEYZE','KUZEN','GELDİ','GİTTİ','VERDİ','SORDU','BAKTI','BEKLE','ASLAN','TİLKİ',
  'ZEBRA','HOROZ','GEYİK','AKREP','SİNEK','KOYUN','ARMUT','KAVUN','İNCİR','MISIR',
  'SOĞAN','HAVUÇ','METRO','MOTOR','VAPUR','TAKSİ','TENİS','VOLEY','SAHİL','GÖLET',
  'SOKAK','CADDE','ÜZGÜN','KORKU','PANİK','HÜZÜN','MORAL','NAZİK','YARIŞ','SAVAŞ',
  'PARTİ','DÜĞÜN','TATİL','İŞLEM','YEMİN','EYLÜL','KASIM','MAYIS','BANYO','BİLGE',
  'DURUM','HÂDİS','SÖYLE','DUYGU','KONUM','DENGE','KOŞTU','UÇTUK','BATTI','ÇIKTI',
  'YATTI','YEDİK','İÇTİK','TUTTU','KESER','YAZDI','OKUDU','SATAN','VURDU','KABLO',
  'PANEL','EKRAN','TUŞLU','MODEM','MODEL','MARKA','KUPON','GÖREV','YETKİ','GÜÇLÜ',
  'TEKİL','ÇİFTE','TOPLU','GENEL','KAZAK','PALTO','KOLYE','YÜZÜK','KEMAN','ÇALAR',
  'ALBÜM','BESTE','ROMAN','METİN','DERGİ','PİYES','KURAK','BORAN','YAĞIŞ','KARGA',
  'ŞAHİN','SİLGİ','DÜNYA','VENÜS','ALÇAK','YASSI','BOZUK','BAYAT','CANLI','SAHTE',
  'SİNİR','COŞKU','KEDER','ASABİ','BİNDİ','DÖNDÜ','KIRDI','YIKTI','YAPTI','ETTİK',
  'KALDI','SATAR','BAKAR','KOYAR','TACİR','CAHİL','MÜDÜR','SİRKE','ACIMA','KİBİR',
  'YALIN','BEŞER','YİRMİ','ÇAYIR','BAYIR','YOKUŞ','DAMAR','YAMAÇ','BATAK','BORSA',
  'KREDİ','HESAP','BEDEL','FİYAT','DENEY','PROJE','SUNUŞ','YAZIM','SÜREÇ','SONUÇ',
  'BAŞAR','PARKE','PANDA','KOALA','KUMRU','GEÇER','DURUR','TÜKET','GÖRÜŞ','FİKİR',
  'İNANÇ','KANAT','TAHİN','KAŞAR','EZİNE','ZURNA','TERZİ','ÇOMAK','ZIMBA','KENAR',
  'TOPAL','DEMİR','BAKIR','ÇELİK','ALTIN','GÜMÜŞ','KALAY','NİKEL','TUNCA','ÇİNKO',
  'KIRAÇ','MORUK','KÜRSÜ','TEKİR','YUVAK','KISIR','KASIK','MAKAS','KORSE','MADEM',
  'YEĞEN','DAMAT','GELİN','KIZAN',
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
  // djb2-like hash ile daha iyi dağılım
  const today = getTodayKey();
  let hash = 5381;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash * 33) ^ today.charCodeAt(i)) >>> 0;
  }
  // Gün numarasını da ek bir çarpan olarak kullan (daha iyi dağılım için)
  const day = parseInt(today.slice(6, 8)) || 1;
  const month = parseInt(today.slice(4, 6)) || 1;
  hash = (hash + day * 2654435761 + month * 40503) >>> 0;
  const idx = hash % _BULMACA_KELIMELER.length;
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
    padding:14px 10px;overflow:hidden;color:#fff;
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
    <style>
      @keyframes _bulmacaSalla {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-8px)}
        40%{transform:translateX(8px)}
        60%{transform:translateX(-6px)}
        80%{transform:translateX(6px)}
      }
    </style>
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

      html += `<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:${bg};border:${border};border-radius:6px;font-size:1.3rem;font-weight:800;color:${renk};font-family:'Inter',sans-serif">${harf}</div>`;
    }
    html += '</div>';
  }
  grid.innerHTML = html;
}

function _bulmacaKlavyeCiz() {
  const kEl = document.getElementById('_bulmacaKlavye');
  if (!kEl) return;

  // Türkçe mobil QWERTY - her satır 10 tuş, 3. sırada ENTER/DEL geniş
  const sira1 = ['E','R','T','Y','U','I','O','P','Ğ','Ü'];
  const sira2 = ['A','S','D','F','G','H','J','K','L','Ş','İ'];
  const sira3 = ['Z','C','V','B','N','M','Ö','Ç'];

  // Her harf için renk durumu
  const harfDurum = {};
  _bulmacaState.tahminler.forEach(t => {
    t.harfler.forEach((h, i) => {
      const mevcut = harfDurum[h];
      const yeni = t.sonuclar[i];
      if (yeni === 'green') harfDurum[h] = 'green';
      else if (yeni === 'yellow' && mevcut !== 'green') harfDurum[h] = 'yellow';
      else if (yeni === 'gray' && !mevcut) harfDurum[h] = 'gray';
    });
  });

  function harfStyle(durum) {
    if (durum === 'green')  return 'background:#43b55a;color:#fff';
    if (durum === 'yellow') return 'background:#d4a838;color:#fff';
    if (durum === 'gray')   return 'background:#2a2a2c;color:rgba(255,255,255,0.4)';
    return 'background:rgba(255,255,255,0.14);color:#fff';
  }

  const tusBase = 'flex:1;min-width:0;height:52px;border:none;border-radius:8px;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;padding:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent';
  const ozelBase = 'height:52px;border:none;border-radius:8px;font-size:0.72rem;font-weight:800;cursor:pointer;font-family:inherit;padding:0 10px;background:rgba(255,255,255,0.2);color:#fff;touch-action:manipulation;-webkit-tap-highlight-color:transparent';

  function renderHarf(h) {
    return `<button ontouchstart="" onclick="_bulmacaKlavyeBas('${h}')" style="${tusBase};${harfStyle(harfDurum[h])}">${h}</button>`;
  }

  kEl.innerHTML = `
    <div style="display:flex;gap:4px;margin-bottom:5px;width:100%">
      ${sira1.map(renderHarf).join('')}
    </div>
    <div style="display:flex;gap:4px;margin-bottom:5px;width:100%">
      ${sira2.map(renderHarf).join('')}
    </div>
    <div style="display:flex;gap:4px;width:100%">
      <button ontouchstart="" onclick="_bulmacaKlavyeBas('ENT')" style="${ozelBase};flex:1.4;background:rgba(91,191,255,0.35);color:#5BBFFF">TAMAM</button>
      ${sira3.map(renderHarf).join('')}
      <button ontouchstart="" onclick="_bulmacaKlavyeBas('SİL')" style="${ozelBase};flex:1.4;font-size:1.1rem">⌫</button>
    </div>
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
    // Sözlük kontrolü — kelime listede var mı?
    if (!_BULMACA_KELIMELER.includes(_bulmacaState.aktifTahmin)) {
      _bulmacaMesajGoster('Sözlükte yok', '#ff6584');
      // Satırı salla (shake animasyonu)
      _bulmacaSatirSalla();
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

// Geçersiz tahmin girildiğinde aktif satırı salla
function _bulmacaSatirSalla() {
  const grid = document.getElementById('_bulmacaGrid');
  if (!grid) return;
  const aktifIdx = _bulmacaState.tahminler.length;
  const satirlar = grid.children;
  if (satirlar[aktifIdx]) {
    const satir = satirlar[aktifIdx];
    satir.style.animation = '_bulmacaSalla 0.4s';
    setTimeout(() => { satir.style.animation = ''; }, 400);
  }
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

// ═══════════════════════════════════════════════════════════
// SAYI AVI — Schulte Table
// ═══════════════════════════════════════════════════════════
// 5x5 grid, 1-25 arası sayılar rastgele dağılmış.
// Sırayla 1'den 25'e tıkla. Yanlış tıklama = +2 saniye ceza.
// Günlük seed — herkes aynı gridi görür.

let _sayiaviState = null;

function _sayiaviOyunuAc() {
  const existing = document.getElementById('_sayiaviOyunModal');
  if (existing) existing.remove();

  // Günlük seed'le rastgele dağılım
  const todayKey = getTodayKey();
  let seed = 0;
  for (let i = 0; i < todayKey.length; i++) seed = ((seed << 5) - seed) + todayKey.charCodeAt(i);
  seed = Math.abs(seed);

  // Seed'li PRNG (mulberry32)
  function mulberry32(s) {
    return function() {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(seed);

  // 1-25 diziyi karıştır
  const sayilar = Array.from({length:25}, (_,i) => i + 1);
  for (let i = sayilar.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [sayilar[i], sayilar[j]] = [sayilar[j], sayilar[i]];
  }

  // Önceki en iyi süre (süre bazlı, daha düşük daha iyi)
  const myUid = (window.currentUserData || {}).uid || 'local';
  const bestTimeKey = 'oyun_sayiavi_besttime_' + myUid;
  const bestTime = parseInt(localStorage.getItem(bestTimeKey) || '0');
  const dunBest = parseInt(localStorage.getItem('oyun_sayiavi_yesterdaytime_' + myUid) || '0');

  _sayiaviState = {
    sayilar,
    aktif: 1,
    baslangic: null,
    ceza: 0,
    bitti: false,
    timer: null,
    bestTime,
    dunBest,
  };

  const modal = document.createElement('div');
  modal.id = '_sayiaviOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#0f1b2d,#1a2844);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:18px 14px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_sayiaviKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_sayiaviIntro" style="text-align:center;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🔢</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Sayı Avı</div>
      <div style="font-size:0.86rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:18px">
        1'den 25'e kadar sayıları <b style="color:#7dd3fc">sırayla</b> tıkla. Ne kadar hızlısan o kadar iyi.
        <br><br>
        <b style="color:#ff6584">Yanlış tıklama → +2 saniye ceza</b>
        <br><br>
        <span style="font-size:0.78rem;color:rgba(255,255,255,0.5)">Herkes bugün aynı gridle yarışıyor — seed tarihi: ${todayKey}</span>
      </div>
      ${dunBest > 0 ? `<div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-bottom:16px">Dünkü süren: <b style="color:#7dd3fc">${(dunBest/1000).toFixed(1)}s</b></div>` : ''}
      <button onclick="_sayiaviBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#7dd3fc,#0284c7);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(125,211,252,0.4)">
        Başla →
      </button>
    </div>

    <div id="_sayiaviGame" style="display:none;width:100%;max-width:380px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div>
          <div style="font-size:0.68rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.1em">SIRADAKI</div>
          <div id="_sayiaviAktif" style="font-size:2rem;font-weight:900;color:#7dd3fc;line-height:1">1</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.68rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.1em">SÜRE</div>
          <div id="_sayiaviSure" style="font-size:1.6rem;font-weight:900;color:#fff;line-height:1.2;font-variant-numeric:tabular-nums">0.0</div>
          <div id="_sayiaviCeza" style="font-size:0.68rem;color:#ff6584;font-weight:700;height:14px"></div>
        </div>
      </div>

      <div id="_sayiaviGrid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:14px"></div>

      <div id="_sayiaviGeri" style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:10px;min-height:18px;text-align:center"></div>
    </div>

    <div id="_sayiaviBitis" style="display:none;text-align:center;max-width:340px"></div>
  `;

  document.body.appendChild(modal);
}

function _sayiaviBasla() {
  document.getElementById('_sayiaviIntro').style.display = 'none';
  document.getElementById('_sayiaviGame').style.display = 'block';

  _sayiaviState.baslangic = Date.now();
  _sayiaviGridCiz();

  // Süre sayacı
  _sayiaviState.timer = setInterval(() => {
    if (!_sayiaviState || _sayiaviState.bitti) return;
    const gecen = (Date.now() - _sayiaviState.baslangic + _sayiaviState.ceza) / 1000;
    const el = document.getElementById('_sayiaviSure');
    if (el) el.textContent = gecen.toFixed(1);
  }, 100);
}

function _sayiaviGridCiz() {
  const grid = document.getElementById('_sayiaviGrid');
  if (!grid) return;
  grid.innerHTML = _sayiaviState.sayilar.map((s, idx) => {
    const bulundu = s < _sayiaviState.aktif;
    return `<button id="_sayiaviKare_${idx}" onclick="_sayiaviTikla(${s}, ${idx})" ${bulundu ? 'disabled' : ''} style="
      aspect-ratio:1;
      background:${bulundu ? 'rgba(67,181,90,0.2)' : 'rgba(255,255,255,0.08)'};
      border:1.5px solid ${bulundu ? 'rgba(67,181,90,0.4)' : 'rgba(255,255,255,0.15)'};
      border-radius:10px;
      color:${bulundu ? 'rgba(255,255,255,0.3)' : '#fff'};
      font-size:1.1rem;
      font-weight:800;
      font-family:inherit;
      cursor:${bulundu ? 'default' : 'pointer'};
      transition:all 0.12s;
      ${bulundu ? 'text-decoration:line-through' : ''}
    ">${s}</button>`;
  }).join('');
}

function _sayiaviTikla(sayi, idx) {
  if (!_sayiaviState || _sayiaviState.bitti) return;
  const kare = document.getElementById('_sayiaviKare_' + idx);

  if (sayi === _sayiaviState.aktif) {
    // Doğru
    if (kare) {
      kare.style.background = '#43b55a';
      kare.style.borderColor = '#43b55a';
      kare.style.transform = 'scale(0.95)';
      setTimeout(() => {
        kare.style.background = 'rgba(67,181,90,0.2)';
        kare.style.borderColor = 'rgba(67,181,90,0.4)';
        kare.style.color = 'rgba(255,255,255,0.3)';
        kare.style.textDecoration = 'line-through';
        kare.style.transform = 'scale(1)';
        kare.disabled = true;
        kare.style.cursor = 'default';
      }, 150);
    }

    // Haptic feedback (destekleyen cihazlarda)
    if (navigator.vibrate) navigator.vibrate(20);

    _sayiaviState.aktif++;
    const aktifEl = document.getElementById('_sayiaviAktif');
    if (aktifEl) {
      aktifEl.textContent = _sayiaviState.aktif <= 25 ? _sayiaviState.aktif : '✓';
    }

    if (_sayiaviState.aktif > 25) {
      _sayiaviBitir();
    }
  } else {
    // Yanlış — +2 saniye ceza
    if (kare) {
      kare.style.background = '#ff6584';
      kare.style.borderColor = '#ff6584';
      setTimeout(() => {
        kare.style.background = 'rgba(255,255,255,0.08)';
        kare.style.borderColor = 'rgba(255,255,255,0.15)';
      }, 400);
    }
    _sayiaviState.ceza += 2000;

    // Cezayı göster
    const cezaEl = document.getElementById('_sayiaviCeza');
    if (cezaEl) {
      cezaEl.textContent = '+2 saniye ceza';
      setTimeout(() => { if (cezaEl) cezaEl.textContent = ''; }, 1500);
    }

    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }
}

function _sayiaviBitir() {
  if (!_sayiaviState) return;
  _sayiaviState.bitti = true;
  if (_sayiaviState.timer) clearInterval(_sayiaviState.timer);

  const totalMs = Date.now() - _sayiaviState.baslangic + _sayiaviState.ceza;
  const saniye = (totalMs / 1000).toFixed(1);

  // En iyi süreyi güncelle (daha düşük daha iyi)
  const myUid = (window.currentUserData || {}).uid || 'local';
  const bestTimeKey = 'oyun_sayiavi_besttime_' + myUid;
  const onceki = _sayiaviState.bestTime;
  const yeniRekor = onceki === 0 || totalMs < onceki;
  if (yeniRekor) {
    localStorage.setItem(bestTimeKey, String(totalMs));
  }

  // Dün için kaydet — sonraki güne "dünkü süren"
  const todayKey = getTodayKey();
  const lastDateKey = 'oyun_sayiavi_lastdate_' + myUid;
  const lastDate = localStorage.getItem(lastDateKey);
  if (lastDate !== todayKey) {
    // Bugün ilk kez oynanıyor — bir önceki kayıtlı süre "dün" oluyor
    const buTimeKey = 'oyun_sayiavi_todaytime_' + myUid;
    const buGunSure = parseInt(localStorage.getItem(buTimeKey) || '0');
    if (buGunSure > 0) {
      localStorage.setItem('oyun_sayiavi_yesterdaytime_' + myUid, String(buGunSure));
    }
    localStorage.setItem(buTimeKey, String(totalMs));
    localStorage.setItem(lastDateKey, todayKey);
  } else {
    localStorage.setItem('oyun_sayiavi_todaytime_' + myUid, String(totalMs));
  }

  // Skor sistemi için: süreyi puana çevir (daha hızlı → daha yüksek puan)
  // 10 saniye = 1000 puan baseline
  const puan = Math.max(0, Math.round(100000 / totalMs));

  document.getElementById('_sayiaviGame').style.display = 'none';
  const bitisEl = document.getElementById('_sayiaviBitis');
  bitisEl.style.display = 'block';

  let mesaj = '';
  if (totalMs < 15000) mesaj = '⚡ İnanılmaz hızlısın!';
  else if (totalMs < 25000) mesaj = '🎯 Çok iyi gittin!';
  else if (totalMs < 40000) mesaj = '👍 Güzel iş.';
  else mesaj = '💪 Pratik yaptıkça hızlanacaksın.';

  // Dün ile karşılaştırma
  let kiyas = '';
  if (_sayiaviState.dunBest > 0) {
    const fark = _sayiaviState.dunBest - totalMs;
    if (fark > 500) {
      const yuzde = Math.round(fark / _sayiaviState.dunBest * 100);
      kiyas = `<div style="font-size:0.82rem;color:#43b55a;margin-top:8px;font-weight:700">📈 Dünkünden %${yuzde} daha hızlısın!</div>`;
    } else if (fark < -500) {
      const yuzde = Math.round(-fark / _sayiaviState.dunBest * 100);
      kiyas = `<div style="font-size:0.82rem;color:rgba(255,255,255,0.5);margin-top:8px">Dünkünden %${yuzde} daha yavaş — yarın tekrar dene</div>`;
    } else {
      kiyas = `<div style="font-size:0.82rem;color:rgba(255,255,255,0.6);margin-top:8px">Dünkü süreye çok yakınsın 🎯</div>`;
    }
  }

  bitisEl.innerHTML = `
    <div style="font-size:3rem;margin-bottom:10px">${yeniRekor ? '🏆' : '🔢'}</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px;color:#fff">${yeniRekor && onceki > 0 ? 'Yeni Rekor!' : 'Tamamlandı!'}</div>
    <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:18px">${mesaj}</div>
    <div style="background:rgba(125,211,252,0.12);border:1px solid rgba(125,211,252,0.3);border-radius:14px;padding:18px;margin-bottom:18px">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SÜRE</div>
      <div style="font-size:2.4rem;font-weight:900;color:#7dd3fc;font-variant-numeric:tabular-nums">${saniye}<span style="font-size:1rem;color:rgba(255,255,255,0.5)">s</span></div>
      ${_sayiaviState.ceza > 0 ? `<div style="font-size:0.72rem;color:#ff6584;margin-top:4px">+${_sayiaviState.ceza/1000}s ceza dahil</div>` : ''}
      ${kiyas}
    </div>
    <button onclick="_sayiaviKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(125,211,252,0.2);color:#7dd3fc;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(125,211,252,0.4)">
      Tamam
    </button>
  `;

  _oyunOynanmisOlarakKaydet('sayiavi', puan);
}

function _sayiaviKapat() {
  if (_sayiaviState && _sayiaviState.timer) clearInterval(_sayiaviState.timer);
  const modal = document.getElementById('_sayiaviOyunModal');
  if (modal) modal.remove();
  _sayiaviState = null;
  if (typeof showPage === 'function') showPage('oyun');
}
