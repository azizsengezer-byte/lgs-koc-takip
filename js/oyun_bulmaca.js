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
    <div id="_bulmacaMesaj" style="text-align:center;font-size:0.82rem;color:rgba(255,255,255,0.7);min-height:24px;margin-bottom:12px"></div>

    <!-- Harf durumu göstergesi -->
    <div id="_bulmacaHarfDurum" style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin-bottom:16px;padding:0 8px"></div>

    <!-- Klavye aç butonu -->
    <div style="margin-top:auto;padding-bottom:env(safe-area-inset-bottom,12px)">
      <button onclick="_bulmacaInputFocus()" style="width:100%;padding:14px;border:none;border-radius:14px;background:rgba(91,191,255,0.2);color:#5BBFFF;font-size:0.9rem;font-weight:800;cursor:pointer;letter-spacing:.03em">
        ⌨️ Yaz  •  Enter ile gönder
      </button>
    </div>

    <!-- Gizli input — native klavye -->
    <input id="_bulmacaInput" type="text"
      inputmode="text" autocomplete="off" autocorrect="off"
      autocapitalize="characters" spellcheck="false"
      maxlength="${_bulmacaState.harfSayisi}"
      style="position:absolute;opacity:0;width:1px;height:1px;top:50%;left:50%;pointer-events:none">

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
  _bulmacaHarfDurumCiz();
  _bulmacaInputBagla();
  setTimeout(function() { _bulmacaInputFocus(); }, 300);
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

function _bulmacaHarfDurumCiz() {
  const el = document.getElementById('_bulmacaHarfDurum');
  if (!el) return;
  const harfDurum = {};
  _bulmacaState.tahminler.forEach(function(t) {
    t.harfler.forEach(function(h, i) {
      const mevcut = harfDurum[h];
      const yeni = t.sonuclar[i];
      if (yeni === 'green') harfDurum[h] = 'green';
      else if (yeni === 'yellow' && mevcut !== 'green') harfDurum[h] = 'yellow';
      else if (yeni === 'gray' && !mevcut) harfDurum[h] = 'gray';
    });
  });
  const tumHarfler = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
  el.innerHTML = tumHarfler.map(function(h) {
    const d = harfDurum[h];
    var bg = d === 'green' ? '#43b55a' : d === 'yellow' ? '#d4a838' : d === 'gray' ? '#2a2a2c' : 'rgba(255,255,255,0.1)';
    var renk = d === 'gray' ? 'rgba(255,255,255,0.3)' : '#fff';
    var fw = d ? '800' : '500';
    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:28px;border-radius:5px;background:' + bg + ';color:' + renk + ';font-size:0.72rem;font-weight:' + fw + '">' + h + '</span>';
  }).join('');
}

function _bulmacaInputFocus() {
  const inp = document.getElementById('_bulmacaInput');
  if (inp && !_bulmacaState.bitti) {
    inp.value = '';
    inp.focus();
    inp.click();
  }
}

function _bulmacaInputBagla() {
  const inp = document.getElementById('_bulmacaInput');
  if (!inp) return;

  inp.addEventListener('input', function() {
    if (_bulmacaState.bitti) { inp.value = ''; return; }
    // Büyük harfe çevir, sadece Türkçe harf kabul et
    var val = inp.value.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, '');
    if (val.length > _bulmacaState.harfSayisi) val = val.slice(0, _bulmacaState.harfSayisi);
    inp.value = val;
    _bulmacaState.aktifTahmin = val;
    _bulmacaGridCiz();
  });

  inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (_bulmacaState.aktifTahmin.length !== _bulmacaState.harfSayisi) {
        _bulmacaMesajGoster('Tüm harfleri doldur', '#d4a838');
        return;
      }
      _bulmacaTahminGonder();
    }
  });

  // Blur olunca otomatik tekrar focus yap (oyun bitene kadar)
  inp.addEventListener('blur', function() {
    if (!_bulmacaState.bitti) {
      setTimeout(function() {
        var stillOpen = document.getElementById('_bulmacaInput');
        if (stillOpen && !_bulmacaState.bitti) stillOpen.focus();
      }, 200);
    }
  });
}

// Geçersiz tahmin girildiğinde aktif satırı salla (artık kullanılmıyor ama kalabilir)
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
  var _bInp = document.getElementById("_bulmacaInput"); if (_bInp) _bInp.value = "";

  _bulmacaGridCiz();
  _bulmacaHarfDurumCiz();

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

