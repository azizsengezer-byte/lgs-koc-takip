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

// Kaç wellness alanı doldurulmuş? Oyun açılımı buna göre.
function _oyunWellnessDoluluk() {
  const myUid = (window.currentUserData || {}).uid || 'local';
  try {
    const data = JSON.parse(localStorage.getItem('wellness_' + myUid) || '{}');
    const todayKey = getTodayKey();
    const today = data.days && data.days[todayKey];
    if (!today) return 0;

    let puan = 0;
    // Temel alan (mood zorunlu)
    if (today.mood) puan++;
    // Diğer sayısal girilmiş alanlar
    // Varsayılan değerden farklı mı kontrolü: enerji default 5, kaygı default 3, odak default 5
    // Kullanıcı gerçekten slider'ı kaydırdıysa saveWellnessDay çağrıldığı için field olarak set edilir
    // Ancak saveWellnessAll sadece input okur ve slider'lar her zaman değer üretir — bu yüzden
    // "doldurulma"yı kullanıcının slider'la etkileşimi üzerinden tespit edemeyiz.
    // Alternatif: tüm sayısal alanları say (her biri 1 puan)
    if (today.enerji != null && today.enerji !== '') puan++;
    if (today.odak != null && today.odak !== '')   puan++;
    if (today.kaygi != null && today.kaygi !== '') puan++;
    // Bonus alan: uyku
    if (today.uyku && parseFloat(today.uyku) > 0) puan++;
    return puan;
  } catch (e) {
    return 0;
  }
}

// Oyun id → hangi doluluk seviyesinde açılır?
// Sıralama: en basit → en zor
// 1 alan (sadece mood)     → bulmaca
// 2 alan                    → + sayiavi
// 3 alan                    → + matris
// 4 alan                    → + stroop
// 5 alan (+ uyku bonus)     → + nback
const _OYUN_KILIT_SEVIYE = {
  bulmaca:  1,
  sayiavi:  2,
  matris:   3,
  stroop:   4,
  nback:    5,
};

function _oyunKilitMi(oyunId) {
  const gerekli = _OYUN_KILIT_SEVIYE[oyunId] || 1;
  return _oyunWellnessDoluluk() < gerekli;
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
  const doluluk = _oyunWellnessDoluluk();
  const toplamSeviye = 5; // max doluluk (mood + enerji + odak + kaygı + uyku)
  const acikOyunSayisi = Math.min(5, doluluk);

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

  // Oyun tanımları (sıralama = kilit sırası)
  const oyunlar = [
    { id: 'bulmaca', ikon: '🧩', baslik: 'Kelime Bulmacası', aciklama: '5 harfli gizli kelimeyi 6 denemede bul. Her gün farklı kelime.', oynandi: bulmacaOynandi, best: bulmacaBest },
    { id: 'sayiavi', ikon: '🔢', baslik: 'Sayı Avı',          aciklama: '1\'den 25\'e kadar dağılmış sayıları sırayla bul. Herkes bugün aynı grid ile karşılaşır.', oynandi: sayiaviOynandi, best: sayiaviBest },
    { id: 'matris',  ikon: '🔲', baslik: 'Görsel Matris',     aciklama: 'Yanıp sönen kareleri sırayla bul. Geometri ve şekil sorularına hazırlık.', oynandi: matrisOynandi, best: matrisBest },
    { id: 'stroop',  ikon: '🎨', baslik: 'Stroop: Çeldiriciye Karşı', aciklama: 'Yazıyı değil, rengini seç. Soru tuzaklarına direnç kazandırır.', oynandi: stroopOynandi, best: stroopBest },
    { id: 'nback',   ikon: '🧠', baslik: 'N-Back: Çalışan Bellek',    aciklama: 'Ekrandaki harfin 2 önceki ile aynı olup olmadığını bul. Yeni nesil sorularda veriyi kaybetmemek için.', oynandi: nbackOynandi, best: nbackBest },
  ];

  // Henüz hiç wellness yoksa — tam kilit
  if (!wellnessVar) {
    return `
      <div class="page-title">🎮 Mini Oyunlar</div>
      <div class="page-sub">Günlüğünü doldurduğunda açılır</div>

      <div class="card" style="text-align:center;padding:40px 24px;margin-top:20px;background:linear-gradient(135deg,#6c63ff08,#4cc9f008);border:1.5px dashed var(--border)">
        <div style="font-size:3rem;margin-bottom:12px">🔒</div>
        <div style="font-weight:800;font-size:1.05rem;margin-bottom:8px">Önce Günlüğünü Doldur</div>
        <div style="font-size:0.85rem;color:var(--text2);line-height:1.6;margin-bottom:18px;max-width:300px;margin-left:auto;margin-right:auto">
          Ne kadar çok alan doldurursan o kadar çok oyun açılır:<br>
          <b>1 alan</b> → 1 oyun · <b>2 alan</b> → 2 oyun · ... · <b>5 alan</b> → hepsi açık
        </div>
        <button onclick="showPage('wellness')" style="padding:12px 28px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-size:0.92rem;font-weight:800;cursor:pointer;font-family:inherit">
          📖 Günlüğe Git →
        </button>
      </div>

      <div class="card" style="margin-top:14px">
        <div class="card-title">Bugün Oynanabilir Olanlar</div>
        <div style="opacity:0.5;pointer-events:none">
          ${oyunlar.map(o => _oyunKartHTML(o.id, o.ikon, o.baslik, o.aciklama, false, 0, true)).join('')}
        </div>
        <div style="margin-top:10px;padding:10px 13px;background:rgba(91,191,255,0.08);border-radius:10px;font-size:0.75rem;color:var(--text2)">
          💡 <b>Nefes egzersizi</b> kilit dışı — istediğin zaman günlük sayfasından açabilirsin.
        </div>
      </div>
    `;
  }

  // İlerleme göstergesi
  const ilerlemePct = Math.round(doluluk / toplamSeviye * 100);
  const hepsiAcik = doluluk >= toplamSeviye;
  const sonrakiKilitOyun = oyunlar.find(o => _OYUN_KILIT_SEVIYE[o.id] === doluluk + 1);

  return `
    <div class="page-title">🎮 Mini Oyunlar</div>
    <div class="page-sub">${acikOyunSayisi} / 5 oyun açıldı</div>

    <!-- İlerleme kartı -->
    <div style="margin:12px 0;padding:14px 16px;background:${hepsiAcik ? 'rgba(67,233,123,0.1)' : 'rgba(91,191,255,0.08)'};border:1px solid ${hepsiAcik ? 'rgba(67,233,123,0.3)' : 'rgba(91,191,255,0.25)'};border-radius:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:0.85rem;font-weight:700;color:var(--text)">
          ${hepsiAcik ? '✅ Tüm oyunlar açık' : `📊 Wellness dolu: ${doluluk}/${toplamSeviye} alan`}
        </div>
        <div style="font-size:0.75rem;font-weight:800;color:${hepsiAcik ? 'var(--accent3)' : 'var(--accent)'}">%${ilerlemePct}</div>
      </div>
      <div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-bottom:${hepsiAcik || !sonrakiKilitOyun ? '0' : '8px'}">
        <div style="height:100%;width:${ilerlemePct}%;background:${hepsiAcik ? 'var(--accent3)' : 'var(--accent)'};border-radius:3px;transition:.4s"></div>
      </div>
      ${!hepsiAcik && sonrakiKilitOyun ? `
        <div style="font-size:0.72rem;color:var(--text2);line-height:1.5">
          💡 Bir alan daha doldurursan <b>${sonrakiKilitOyun.ikon} ${sonrakiKilitOyun.baslik}</b> açılacak —
          <span onclick="showPage('wellness')" style="color:var(--accent);font-weight:700;cursor:pointer;text-decoration:underline">günlüğe git →</span>
        </div>
      ` : ''}
    </div>

    ${oyunlar.map(o => {
      const kilitli = _oyunKilitMi(o.id);
      return _oyunKartHTML(o.id, o.ikon, o.baslik, o.aciklama, o.oynandi, o.best, kilitli, _OYUN_KILIT_SEVIYE[o.id]);
    }).join('')}

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

function _oyunKartHTML(id, ikon, baslik, aciklama, oynandi, best, kilit, kilitSeviye) {
  const buton = kilit
    ? `<button disabled style="padding:10px 18px;border-radius:11px;border:none;background:var(--surface2);color:var(--text2);font-size:0.78rem;font-weight:700;cursor:not-allowed;font-family:inherit">🔒 ${kilitSeviye ? `${kilitSeviye} alan` : 'Kilitli'}</button>`
    : oynandi
      ? `<button disabled style="padding:10px 18px;border-radius:11px;border:none;background:var(--surface2);color:var(--text2);font-size:0.78rem;font-weight:700;cursor:not-allowed;font-family:inherit">✅ Oynandı</button>`
      : `<button onclick="oyunBaslat('${id}')" style="padding:10px 22px;border-radius:11px;border:none;background:var(--accent);color:#fff;font-size:0.85rem;font-weight:800;cursor:pointer;font-family:inherit">▶ Oyna</button>`;

  // Sayı Avı'nın skoru "süre"dir, diğerleri normal skor
  let bestMetin = '';
  if (best > 0) {
    if (id === 'sayiavi') {
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
  } else if (kilit) {
    bestMetin = `<span style="color:var(--text2);opacity:0.7">🔒 ${kilitSeviye} wellness alanı dolduğunda açılır</span>`;
  } else {
    bestMetin = `<span style="color:var(--text2);opacity:0.6">Henüz oynamadın</span>`;
  }

  const opaklik = kilit ? 0.55 : 1;

  return `
    <div class="card" style="margin-bottom:12px;padding:0;overflow:hidden;opacity:${opaklik};transition:opacity .3s">
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
  if (_oyunKilitMi(oyunId)) {
    const gerekli = _OYUN_KILIT_SEVIYE[oyunId];
    showToast('🔒', `Bu oyun için ${gerekli} wellness alanı doldurmalısın`);
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

