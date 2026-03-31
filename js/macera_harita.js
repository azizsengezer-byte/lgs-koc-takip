// ============================================================
// 🗺️ SAVAŞ SİSİ HARİTASI
// ============================================================

const HARITA_ADALAR = [
  { id:'mat', ad:'Matematik',     emoji:'📐', renk:'#4ecdc4', cx:0.285, cy:0.48,  rx:0.155, ry:0.24  },
  { id:'fen', ad:'Fen Bilimleri', emoji:'🔬', renk:'#45b7d1', cx:0.50,  cy:0.30,  rx:0.13,  ry:0.23  },
  { id:'tur', ad:'Türkçe',        emoji:'📖', renk:'#ff6b6b', cx:0.70,  cy:0.50,  rx:0.13,  ry:0.23  },
  { id:'ing', ad:'İngilizce',     emoji:'🌍', renk:'#fd79a8', cx:0.255, cy:0.735, rx:0.12,  ry:0.20  },
  { id:'ink', ad:'İnkılap Tarihi',emoji:'🏛️', renk:'#f9ca24', cx:0.50,  cy:0.80,  rx:0.14,  ry:0.20  },
  { id:'din', ad:'Din Kültürü',   emoji:'☪️', renk:'#a29bfe', cx:0.735, cy:0.78,  rx:0.12,  ry:0.20  },
];

// Her ders için hedef soru sayısı
const HEDEF_SORU = {
  'Matematik':      1000,
  'Fen Bilimleri':  1000,
  'Türkçe':         1000,
  'İngilizce':      500,
  'İnkılap Tarihi': 500,
  'Din Kültürü':    500,
};

// Yol noktaları (harita koordinatları, sıralı)
const HARITA_YOL = [
  { x:0.285, y:0.48  }, // Matematik
  { x:0.50,  y:0.30  }, // Fen
  { x:0.70,  y:0.50  }, // Türkçe
  { x:0.735, y:0.78  }, // Din
  { x:0.50,  y:0.80  }, // İnkılap
  { x:0.255, y:0.735 }, // İngilizce
  { x:0.83,  y:0.12  }, // Hedef Okul
];

// ── Veri hesaplama ─────────────────────────────────────────
function haritaGetirVeri() {
  const myUid = (window.currentUserData||{}).uid || '';
  const soruEntries = studyEntries.filter(e =>
    e.type === 'soru' &&
    (e.userId === myUid || e.studentName === (window.currentUserData||{}).name)
  );

  const result = {};
  Object.keys(HEDEF_SORU).forEach(ders => {
    const dersEntries = soruEntries.filter(e => e.subject === ders);

    // Toplam soru ve doğru
    const toplamSoru = dersEntries.reduce((a,e) => a+(e.questions||0), 0);
    const toplamDogru = dersEntries.reduce((a,e) => a+(e.correct||0), 0);
    const isabet = toplamSoru > 0 ? Math.round(toplamDogru/toplamSoru*100) : 0;

    // Bu derse ait girilmiş konular (unit veya topic)
    const girilenKonular = new Set(
      dersEntries.map(e => e.unit || e.topic || '').filter(Boolean)
    );

    // Toplam konu sayısı (config'den)
    const tumKonular = _haritaKonuListesi(ders);
    const toplamKonu = tumKonular.length;
    const girilenSayi = tumKonular.filter(k => girilenKonular.has(k)).length;

    // İki kriter: soru % ve konu %
    const hedef = HEDEF_SORU[ders];
    const soruPct  = Math.min(100, Math.round(toplamSoru / hedef * 100));
    const konuPct  = toplamKonu > 0 ? Math.min(100, Math.round(girilenSayi / toplamKonu * 100)) : 0;

    // Genel ilerleme = iki kriterin ortalaması (her ikisi de %100 olunca tam açık)
    const genelPct = Math.round((soruPct + konuPct) / 2);

    result[ders] = {
      ad: ders,
      renk: HARITA_ADALAR.find(a => a.ad === ders || (ders==='İnkılap Tarihi'&&a.id==='ink'))?.renk || '#888',
      toplamSoru, toplamDogru, isabet, hedef,
      soruPct, konuPct, genelPct,
      girilenSayi, toplamKonu,
      tumKonular, girilenKonular,
    };
  });
  return result;
}

// Config'den konu listesi düz dizi olarak al
function _haritaKonuListesi(ders) {
  const raw = (typeof kazanimlar !== 'undefined') ? kazanimlar[ders] : [];
  if (!raw || !raw.length) return [];
  // Fen Bilimleri: {unite, alt} yapısı
  if (typeof raw[0] === 'object' && raw[0].unite) {
    return raw.map(u => u.unite);
  }
  return raw;
}

// ── Ana render fonksiyonu ───────────────────────────────────
function maceraHarita() {
  const veri = haritaGetirVeri();
  const toplamPct = Math.round(
    Object.values(veri).reduce((a,d) => a+d.genelPct, 0) / Object.keys(veri).length
  );

  const adaHTML   = _haritaAdaHTML(veri);
  const yolHTML   = _haritaYolHTML(veri);
  const ozetHTML  = _haritaOzetHTML(veri);

  return `
    <style>
      /* ── Genel sis ── */
      .sis-genel-b { position:absolute; border-radius:50%; filter:blur(20px); pointer-events:none; }
      .sis-gb1 { width:72%;height:62%;top:-12%;left:-8%;
        background:radial-gradient(ellipse,rgba(10,14,35,.5) 0%,transparent 70%);
        animation:gSis1 15s ease-in-out infinite; }
      .sis-gb2 { width:65%;height:58%;top:28%;right:-8%;
        background:radial-gradient(ellipse,rgba(10,14,35,.42) 0%,transparent 70%);
        animation:gSis2 19s ease-in-out infinite 2s; }
      .sis-gb3 { width:85%;height:52%;bottom:-18%;left:8%;
        background:radial-gradient(ellipse,rgba(10,14,35,.46) 0%,transparent 70%);
        animation:gSis3 23s ease-in-out infinite 1s; }
      @keyframes gSis1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(9%,7%) scale(1.1)}}
      @keyframes gSis2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-11%,-9%) scale(1.15)}}
      @keyframes gSis3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(7%,-6%) scale(0.91)}}

      /* ── Ada sis bulutları ── */
      .sis-ada { position:absolute; transform:translate(-50%,-50%); border-radius:50%; overflow:hidden; }
      .sis-bc { position:absolute; border-radius:50%; }
      .sis-bc1 { width:100%;height:100%;top:0;left:0; animation:aSis1 7s ease-in-out infinite; animation-delay:var(--sd,0s); }
      .sis-bc2 { width:82%;height:82%;top:9%;left:9%; animation:aSis2 9.5s ease-in-out infinite; animation-delay:calc(var(--sd,0s) + .7s); }
      .sis-bc3 { width:66%;height:66%;top:17%;left:17%; animation:aSis3 11s ease-in-out infinite; animation-delay:calc(var(--sd,0s) + 1.4s); }
      .sis-bc4 { width:50%;height:50%;top:25%;left:25%; animation:aSis4 8.5s ease-in-out infinite; animation-delay:calc(var(--sd,0s) + .4s); }
      @keyframes aSis1{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}33%{transform:translate(7%,-5%) scale(1.09) rotate(3deg)}66%{transform:translate(-5%,7%) scale(.94) rotate(-2deg)}}
      @keyframes aSis2{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}25%{transform:translate(-9%,7%) scale(1.13) rotate(5deg)}50%{transform:translate(7%,-5%) scale(.9) rotate(-4deg)}75%{transform:translate(-4%,-9%) scale(1.06) rotate(3deg)}}
      @keyframes aSis3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(11%,5%) scale(.87)}80%{transform:translate(-7%,-7%) scale(1.1)}}
      @keyframes aSis4{0%,100%{transform:scale(1) translate(0,0);opacity:.9}50%{transform:scale(1.22) translate(3%,-3%);opacity:1}}

      /* ── Altın parlama (tam açık) ── */
      .ada-parlama { position:absolute; transform:translate(-50%,-50%); border-radius:50%; pointer-events:none; }
      @keyframes parlamaIdle{0%,100%{opacity:.65;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}}

      /* ── Bayrak ── */
      .ada-bayrak { position:absolute; transform:translate(-50%,-100%); font-size:15px; z-index:10;
        animation:bayrakSal 2.5s ease-in-out infinite; filter:drop-shadow(0 2px 4px rgba(0,0,0,.7)); }
      @keyframes bayrakSal{0%,100%{transform:translate(-50%,-100%) rotate(-4deg)}50%{transform:translate(-50%,-100%) rotate(4deg)}}

      /* ── Badge ── */
      .ada-badge {
        position:absolute; transform:translate(-50%,0);
        background:rgba(0,0,0,.78); border-radius:99px;
        padding:3px 9px; font-size:9px; font-weight:800;
        color:white; white-space:nowrap; backdrop-filter:blur(4px);
        border:1px solid rgba(255,255,255,.12); z-index:20; cursor:pointer;
        transition:.18s; box-shadow:0 2px 8px rgba(0,0,0,.4);
      }
      .ada-badge:active { transform:translate(-50%,0) scale(.95); }

      /* ── Yol SVG ── */
      .harita-yol-svg { position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible; }
      .yol-line { stroke-dasharray:7 5; animation:yolAk 3s linear infinite; }
      @keyframes yolAk{to{stroke-dashoffset:-24}}

      /* ── Modal ── */
      .ada-modal-bg {
        display:none;position:fixed;inset:0;background:rgba(0,0,0,.72);
        z-index:1000;align-items:center;justify-content:center;
        backdrop-filter:blur(6px);
      }
      .ada-modal-bg.acik{display:flex;}
      .ada-modal {
        background:#1a1d27;border:1px solid #2e3350;border-radius:20px;
        padding:20px;max-width:320px;width:90%;max-height:82vh;
        overflow-y:auto;animation:modalGel .22s ease-out;
      }
      @keyframes modalGel{from{opacity:0;transform:scale(.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
      .modal-kapat{float:right;background:transparent;border:none;color:#8b90b8;font-size:1.5rem;cursor:pointer;line-height:1;padding:0 2px;}
      .konu-sat { display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #23263a;font-size:.8rem; }
      .konu-sat:last-child{border-bottom:none;}
      .konu-cek{width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;flex-shrink:0;}

      /* ── Ozet ── */
      .harita-ozet{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:10px 14px 14px;}
      .ozet-k{background:#22263a;border-radius:8px;padding:7px;text-align:center;cursor:pointer;transition:.15s;}
      .ozet-k:active{transform:scale(.97);}

      .harita-wrap{position:relative;width:100%;}
      .harita-wrap img{width:100%;display:block;}
      .harita-sis-genel{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:0 0 14px 14px;}
      .harita-adalar{position:absolute;inset:0;pointer-events:none;}
    </style>

    <div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">
      <div style="padding:14px 16px 10px">
        <div class="card-title" style="margin:0">🗺️ Müfredat Takımadası</div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">
          Her adayı fethetmek için konulara giriş yap + soru hedefine ulaş
        </div>
      </div>

      <div class="harita-wrap">
        <img src="map.png" alt="Harita"
          onerror="this.src='https://azizsengezer-byte.github.io/lgs-koc-takip/map.png'">

        <!-- Genel sis katmanı -->
        <div class="harita-sis-genel">
          <div class="sis-genel-b sis-gb1"></div>
          <div class="sis-genel-b sis-gb2"></div>
          <div class="sis-genel-b sis-gb3"></div>
        </div>

        <!-- Yol çizgileri -->
        <svg class="harita-yol-svg" viewBox="0 0 1600 872" preserveAspectRatio="xMidYMid meet">
          ${yolHTML}
        </svg>

        <!-- Ada sisleri, bayraklar, badge'ler -->
        <div class="harita-adalar" style="pointer-events:all">
          ${adaHTML}
        </div>
      </div>

      <!-- Özet grid -->
      <div class="harita-ozet">${ozetHTML}</div>
    </div>

    <!-- Modal -->
    <div class="ada-modal-bg" id="haritaModalBg" onclick="_haritaModalKapat(event)">
      <div class="ada-modal" onclick="event.stopPropagation()">
        <button class="modal-kapat" onclick="_haritaModalKapat()">×</button>
        <div id="haritaModalIcerik"></div>
      </div>
    </div>
  `;
}

// ── Ada HTML ───────────────────────────────────────────────
function _haritaAdaHTML(veri) {
  const delays = { mat:0, fen:1.2, tur:0.6, ing:1.8, ink:0.4, din:1.0 };
  let html = '';

  HARITA_ADALAR.forEach(ada => {
    const dAdi = ada.id === 'ink' ? 'İnkılap Tarihi' : ada.ad;
    const d = veri[dAdi] || {};
    const pct = d.genelPct || 0;
    const sisYog = Math.max(0, 100 - pct);
    const delay = delays[ada.id] || 0;
    const tamAcik = pct >= 100;
    const dusuk = d.isabet > 0 && d.isabet < 65;
    const hicGirilmedi = (d.toplamSoru || 0) === 0;

    // ── Ada sis ──
    if (sisYog > 3) {
      const op = Math.min(0.95, sisYog / 100 * 1.1).toFixed(2);
      const sr = dusuk ? 'rgba(60,0,0' : 'rgba(10,14,35';
      const border = dusuk
        ? 'border:1.5px solid rgba(255,60,60,.55)'
        : 'border:1.5px solid rgba(255,255,255,.07)';
      html += `
        <div class="sis-ada" style="
          left:${ada.cx*100}%;top:${ada.cy*100}%;
          width:${ada.rx*200}%;height:${ada.ry*200}%;
          --sd:${delay}s;opacity:${op};${border}">
          <div class="sis-bc sis-bc1" style="background:radial-gradient(ellipse,${sr},.78) 0%,transparent 70%)"></div>
          <div class="sis-bc sis-bc2" style="background:radial-gradient(ellipse,${sr},.62) 0%,transparent 65%)"></div>
          <div class="sis-bc sis-bc3" style="background:radial-gradient(ellipse,${sr},.5) 0%,transparent 60%)"></div>
          <div class="sis-bc sis-bc4" style="background:radial-gradient(ellipse,${sr},.42) 0%,transparent 55%)"></div>
        </div>`;
    }

    // ── Altın parlama (tam açık) ──
    if (tamAcik) {
      html += `<div class="ada-parlama" style="
        left:${ada.cx*100}%;top:${ada.cy*100}%;
        width:${ada.rx*230}%;height:${ada.ry*230}%;
        background:radial-gradient(ellipse,rgba(249,202,36,.2) 0%,transparent 70%);
        animation:parlamaIdle 3.2s ease-in-out infinite ${delay}s">
      </div>`;
    }

    // ── Bayrak (tam açık) ──
    if (tamAcik) {
      html += `<div class="ada-bayrak" style="left:${ada.cx*100}%;top:${(ada.cy - ada.ry*1.1)*100}%">🚩</div>`;
    }

    // ── Badge ──
    let bRenk, bText, bBg;
    if (tamAcik)         { bRenk='#f9ca24'; bText=`${ada.emoji} ${ada.ad} 🚩 Fethedildi`; bBg='rgba(249,202,36,.18)'; }
    else if (hicGirilmedi){ bRenk='#555';   bText=`${ada.emoji} ${ada.ad} 🔒`; bBg='rgba(0,0,0,.4)'; }
    else if (dusuk)       { bRenk='#ff6b6b';bText=`${ada.emoji} ${ada.ad} ⚠️ %${pct}`; bBg='rgba(255,60,60,.18)'; }
    else                  { bRenk=ada.renk; bText=`${ada.emoji} ${ada.ad} %${pct}`; bBg='rgba(0,0,0,.55)'; }

    html += `<div class="ada-badge"
      style="left:${ada.cx*100}%;top:${(ada.cy + ada.ry*1.15)*100}%;
        color:${bRenk};background:${bBg};border-color:${bRenk}44;"
      onclick="_haritaModalAc('${ada.id}')">
      ${bText}
    </div>`;
  });

  // Hedef okul etiketi (genel %50+)
  return html;
}

// ── Yol HTML ───────────────────────────────────────────────
function _haritaYolHTML(veri) {
  const dersSirasi = ['Matematik','Fen Bilimleri','Türkçe','Din Kültürü','İnkılap Tarihi','İngilizce'];
  let html = '';

  dersSirasi.forEach((ders, i) => {
    const d = veri[ders] || {};
    if ((d.genelPct || 0) < 5) return; // Hiç giriş yoksa yol görünmez

    const a = HARITA_YOL[i];
    const b = HARITA_YOL[i+1];
    if (!a || !b) return;

    const x1=a.x*1600, y1=a.y*872, x2=b.x*1600, y2=b.y*872;
    const cx=(x1+x2)/2, cy=(y1+y2)/2 - 35;
    const renk = HARITA_ADALAR.find(a=>a.ad===ders||(ders==='İnkılap Tarihi'&&a.id==='ink'))?.renk || '#4ecdc4';

    html += `
      <path class="yol-line"
        d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}"
        stroke="${renk}" stroke-width="3" fill="none"
        stroke-linecap="round" stroke-dashoffset="0" opacity=".75"/>
      <circle cx="${x2}" cy="${y2}" r="5" fill="${renk}" opacity=".55">
        <animate attributeName="r"       values="4;8;4"   dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".5;.95;.5" dur="2.2s" repeatCount="indefinite"/>
      </circle>`;
  });

  // Hedef okul yolu (genel %60+)
  const toplamPct = Math.round(
    Object.values(veri).reduce((a,d)=>a+(d.genelPct||0),0) / Object.keys(veri).length
  );
  if (toplamPct >= 60) {
    const son = HARITA_YOL[HARITA_YOL.length-2];
    const hdf = HARITA_YOL[HARITA_YOL.length-1];
    html += `
      <path class="yol-line"
        d="M${son.x*1600},${son.y*872} Q${(son.x+hdf.x)/2*1600},${(son.y+hdf.y)/2*872-50} ${hdf.x*1600},${hdf.y*872}"
        stroke="#f9ca24" stroke-width="4" fill="none"
        stroke-linecap="round" opacity=".9"/>
      <circle cx="${hdf.x*1600}" cy="${hdf.y*872}" r="9" fill="#f9ca24" opacity=".8">
        <animate attributeName="r"       values="7;13;7"  dur="1.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".6;1;.6" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <text x="${hdf.x*1600-28}" y="${hdf.y*872-18}"
        font-size="11" font-weight="bold" fill="#f9ca24" opacity=".9">🏛️ Hedef!</text>`;
  }

  return html;
}

// ── Özet HTML ─────────────────────────────────────────────
function _haritaOzetHTML(veri) {
  return Object.values(veri).map(d => {
    const renk = d.genelPct>=80 ? d.renk : d.genelPct>=40 ? '#EF9F27' : '#666';
    const ada = HARITA_ADALAR.find(a => a.ad===d.ad || (d.ad==='İnkılap Tarihi'&&a.id==='ink'));
    return `<div class="ozet-k" onclick="_haritaModalAc('${ada?.id||''}')">
      <div style="font-size:.68rem;color:var(--text2);margin-bottom:2px">${ada?.emoji||''} ${d.ad.substring(0,8)}</div>
      <div style="font-size:.9rem;font-weight:900;color:${renk}">%${d.genelPct}</div>
      <div style="font-size:.58rem;color:var(--text2);margin-top:1px">${d.girilenSayi}/${d.toplamKonu} konu · ${d.toplamSoru}/${d.hedef}s</div>
    </div>`;
  }).join('');
}

// ── Modal ─────────────────────────────────────────────────
window._haritaModalAc = function(id) {
  const ada = HARITA_ADALAR.find(a => a.id === id);
  if (!ada) return;
  const dAdi = id === 'ink' ? 'İnkılap Tarihi' : ada.ad;
  const veri = haritaGetirVeri();
  const d = veri[dAdi];
  if (!d) return;

  const soruRenk = d.soruPct>=100?'#43e97b':d.soruPct>=50?'#f9ca24':'#ff6b6b';
  const konuRenk = d.konuPct>=100?'#43e97b':d.konuPct>=50?'#f9ca24':'#ff6b6b';

  document.getElementById('haritaModalIcerik').innerHTML = `
    <div style="margin-bottom:16px">
      <div style="font-size:2rem;margin-bottom:6px">${ada.emoji}</div>
      <div style="font-weight:900;font-size:1.1rem;margin-bottom:10px">${ada.ad}</div>

      <!-- Genel ilerleme -->
      <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text2);margin-bottom:4px">
        <span>Genel ilerleme</span><span style="font-weight:800;color:${ada.renk}">%${d.genelPct}</span>
      </div>
      <div style="height:8px;background:var(--surface2);border-radius:4px;overflow:hidden;margin-bottom:12px">
        <div style="width:${d.genelPct}%;height:100%;background:${ada.renk};border-radius:4px;transition:.8s"></div>
      </div>

      <!-- İki kriter -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="background:var(--surface2);border-radius:10px;padding:10px">
          <div style="font-size:.65rem;color:var(--text2);margin-bottom:4px">🎯 Soru hedefi</div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px">
            <div style="width:${d.soruPct}%;height:100%;background:${soruRenk};border-radius:3px;transition:.6s"></div>
          </div>
          <div style="font-size:.75rem;font-weight:800;color:${soruRenk}">${d.toplamSoru} / ${d.hedef}</div>
        </div>
        <div style="background:var(--surface2);border-radius:10px;padding:10px">
          <div style="font-size:.65rem;color:var(--text2);margin-bottom:4px">📚 Konu taraması</div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px">
            <div style="width:${d.konuPct}%;height:100%;background:${konuRenk};border-radius:3px;transition:.6s"></div>
          </div>
          <div style="font-size:.75rem;font-weight:800;color:${konuRenk}">${d.girilenSayi} / ${d.toplamKonu}</div>
        </div>
      </div>

      ${d.isabet>0?`<div style="font-size:.75rem;color:var(--text2);margin-bottom:12px">
        🎯 İsabet oranı: <span style="font-weight:800;color:${d.isabet>=70?ada.renk:d.isabet>=50?'#f9ca24':'#ff6b6b'}">%${d.isabet}</span>
      </div>`:''}
    </div>

    <div style="font-size:.78rem;font-weight:800;color:var(--text2);margin-bottom:8px">KONULAR</div>
    ${d.tumKonular.map(k => {
      const girildi = d.girilenKonular.has(k);
      return `<div class="konu-sat">
        <div class="konu-cek" style="background:${girildi?ada.renk+'33':'rgba(255,255,255,.06)'};color:${girildi?ada.renk:'#555'}">
          ${girildi?'✓':'○'}
        </div>
        <span style="color:${girildi?'var(--text)':'#555'}">${k}</span>
        ${girildi?`<span style="margin-left:auto;font-size:.65rem;color:${ada.renk}">✓</span>`:''}
      </div>`;
    }).join('')}
  `;

  document.getElementById('haritaModalBg').classList.add('acik');
};

window._haritaModalKapat = function(e) {
  if (!e || e.target === document.getElementById('haritaModalBg')) {
    document.getElementById('haritaModalBg').classList.remove('acik');
  }
};
