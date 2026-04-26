function _bulmacaNormalize(harf) {
  return harf.toUpperCase()
    .replace(/İ/g, 'İ').replace(/I/g, 'I')
    .replace(/Ğ/g, 'Ğ').replace(/Ü/g, 'Ü')
    .replace(/Ş/g, 'Ş').replace(/Ö/g, 'Ö').replace(/Ç/g, 'Ç');
}

function _bulmacaGununKelime() {
  const today = getTodayKey();
  let hash = 5381;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash * 33) ^ today.charCodeAt(i)) >>> 0;
  }
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
  _bulmacaState = {
    kelime: kelime,
    harfSayisi: Array.from(kelime).length,
    tahminler: [],
    aktifTahmin: '',
    deneme: 0,
    maksDeneme: 6,
    bitti: false,
  };

  const modal = document.createElement('div');
  modal.id = '_bulmacaOyunModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#0d1421;display:flex;flex-direction:column;padding:14px 16px 20px;color:#fff;';

  modal.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-shrink:0">
      <div>
        <div style="font-size:1.05rem;font-weight:800">🧩 Kelime Bulmaca</div>
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:2px">${_bulmacaState.harfSayisi} harfli · 6 deneme</div>
      </div>
      <button onclick="_bulmacaKapat()" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>
    </div>

    <div id="_bulmacaGrid" style="display:flex;flex-direction:column;gap:6px;align-items:center;flex-shrink:0"></div>

    <div id="_bulmacaMesaj" style="text-align:center;font-size:0.82rem;color:rgba(255,255,255,0.7);min-height:22px;margin-top:14px;flex-shrink:0"></div>

    <div style="margin-top:auto;flex-shrink:0">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:8px">Kelimeyi yaz, Tamam'a bas</div>
      <div style="display:flex;gap:8px">
        <input id="_bulmacaInput" type="text"
          inputmode="text" autocomplete="off" autocorrect="off"
          autocapitalize="characters" spellcheck="false"
          maxlength="${_bulmacaState.harfSayisi}"
          placeholder="Kelime yaz..."
          style="flex:1;padding:14px 16px;border-radius:12px;border:2px solid rgba(91,191,255,0.4);background:rgba(91,191,255,0.08);color:#fff;font-size:1.1rem;font-weight:800;letter-spacing:0.15em;text-align:center;outline:none;-webkit-appearance:none;font-family:inherit">
        <button onclick="_bulmacaGonder()" style="padding:14px 18px;border-radius:12px;border:none;background:#5BBFFF;color:#0d1421;font-size:0.85rem;font-weight:800;cursor:pointer;flex-shrink:0">Tamam</button>
      </div>
    </div>

    <style>
      #_bulmacaInput::placeholder { color: rgba(255,255,255,0.25); font-size:0.85rem; font-weight:400; letter-spacing:normal; }
      @keyframes _bulmacaSalla {
        0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
        40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
      }
    </style>
  `;

  document.body.appendChild(modal);
  _bulmacaGridCiz();

  const inp = document.getElementById('_bulmacaInput');
  inp.addEventListener('input', function() {
    if (_bulmacaState.bitti) { inp.value = ''; return; }
    var val = inp.value.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, '').slice(0, _bulmacaState.harfSayisi);
    inp.value = val;
    _bulmacaState.aktifTahmin = val;
    _bulmacaGridCiz();
  });
  inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); _bulmacaGonder(); }
  });

  setTimeout(function() { inp.focus(); }, 400);
}

function _bulmacaGonder() {
  if (!_bulmacaState || _bulmacaState.bitti) return;
  if (_bulmacaState.aktifTahmin.length !== _bulmacaState.harfSayisi) {
    _bulmacaMesajGoster(_bulmacaState.harfSayisi + ' harf girilmeli', '#d4a838');
    return;
  }
  _bulmacaTahminGonder();
}

function _bulmacaGridCiz() {
  const grid = document.getElementById('_bulmacaGrid');
  if (!grid) return;
  const N = _bulmacaState.harfSayisi;
  let html = '';
  for (let i = 0; i < _bulmacaState.maksDeneme; i++) {
    html += '<div style="display:flex;gap:5px">';
    for (let j = 0; j < N; j++) {
      let harf = '', bg = 'rgba(255,255,255,0.05)', border = '2px solid rgba(255,255,255,0.15)', renk = '#fff';
      if (i < _bulmacaState.tahminler.length) {
        const t = _bulmacaState.tahminler[i];
        harf = t.harfler[j];
        if (t.sonuclar[j] === 'green')  { bg = '#43b55a'; border = '2px solid #43b55a'; }
        else if (t.sonuclar[j] === 'yellow') { bg = '#d4a838'; border = '2px solid #d4a838'; }
        else { bg = '#3a3a3c'; border = '2px solid #3a3a3c'; }
      } else if (i === _bulmacaState.tahminler.length) {
        if (j < _bulmacaState.aktifTahmin.length) {
          harf = _bulmacaState.aktifTahmin[j];
          border = '2px solid rgba(91,191,255,0.6)';
          bg = 'rgba(91,191,255,0.1)';
        }
      }
      html += `<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:${bg};border:${border};border-radius:6px;font-size:1.3rem;font-weight:800;color:${renk};font-family:'Inter',sans-serif">${harf}</div>`;
    }
    html += '</div>';
  }
  grid.innerHTML = html;
}

function _bulmacaTahminGonder() {
  const tahmin = _bulmacaState.aktifTahmin;
  const dogru = _bulmacaState.kelime;
  const harfler = Array.from(tahmin);
  const dogruHarfler = Array.from(dogru);
  const sonuclar = new Array(harfler.length).fill('gray');
  const dogruKalan = [...dogruHarfler];

  harfler.forEach((h, i) => {
    if (h === dogruHarfler[i]) { sonuclar[i] = 'green'; dogruKalan[i] = null; }
  });
  harfler.forEach((h, i) => {
    if (sonuclar[i] === 'green') return;
    const idx = dogruKalan.indexOf(h);
    if (idx !== -1) { sonuclar[i] = 'yellow'; dogruKalan[idx] = null; }
  });

  _bulmacaState.tahminler.push({ harfler, sonuclar });
  _bulmacaState.deneme++;
  _bulmacaState.aktifTahmin = '';
  const inp = document.getElementById('_bulmacaInput');
  if (inp) inp.value = '';
  _bulmacaGridCiz();

  if (sonuclar.every(s => s === 'green')) {
    _bulmacaState.bitti = true;
    const skor = (_bulmacaState.maksDeneme - _bulmacaState.deneme + 1) * 20;
    setTimeout(() => _bulmacaBitir(true, skor), 600);
    return;
  }
  if (_bulmacaState.deneme >= _bulmacaState.maksDeneme) {
    _bulmacaState.bitti = true;
    setTimeout(() => _bulmacaBitir(false, 0), 600);
    return;
  }
  if (inp) inp.focus();
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
       <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:18px">Yarın yeni kelimeyle dene!</div>`;

  modal.innerHTML = `
    <div style="margin:auto;text-align:center;color:#fff;max-width:340px;padding:20px">
      ${mesaj}
      <button onclick="_bulmacaKapat()" style="padding:12px 32px;border-radius:12px;border:1px solid rgba(91,191,255,0.4);background:rgba(91,191,255,0.2);color:#5BBFFF;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit">
        Tamam
      </button>
    </div>`;
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

let _nbackState = null;
