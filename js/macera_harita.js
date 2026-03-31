// ============================================================
// 🗺️ SAVAŞ SİSİ HARİTASI v2
// ============================================================

const HARITA_ADALAR = [
  { id:'mat', ad:'Matematik',     emoji:'📐', renk:'#4ecdc4', cx:0.285, cy:0.48,  rx:0.155, ry:0.24  },
  { id:'fen', ad:'Fen Bilimleri', emoji:'🔬', renk:'#45b7d1', cx:0.50,  cy:0.30,  rx:0.13,  ry:0.23  },
  { id:'tur', ad:'Türkçe',        emoji:'📖', renk:'#ff6b6b', cx:0.70,  cy:0.50,  rx:0.13,  ry:0.23  },
  { id:'ing', ad:'İngilizce',     emoji:'🌍', renk:'#fd79a8', cx:0.255, cy:0.735, rx:0.12,  ry:0.20  },
  { id:'ink', ad:'İnkılap',       emoji:'🏛️', renk:'#f9ca24', cx:0.50,  cy:0.80,  rx:0.14,  ry:0.20  },
  { id:'din', ad:'Din Kültürü',   emoji:'☪️', renk:'#a29bfe', cx:0.735, cy:0.78,  rx:0.12,  ry:0.20  },
];

const HEDEF_SORU = {
  'Matematik':1000, 'Fen Bilimleri':1000, 'Türkçe':1000,
  'İngilizce':500,  'İnkılap Tarihi':500, 'Din Kültürü':500,
};

const HARITA_YOL = [
  {x:0.285,y:0.48}, {x:0.50,y:0.30}, {x:0.70,y:0.50},
  {x:0.735,y:0.78}, {x:0.50,y:0.80}, {x:0.255,y:0.735},
  {x:0.83,y:0.12},
];

function _haritaKonuListesi(ders) {
  const raw = (typeof kazanimlar !== 'undefined') ? (kazanimlar[ders] || []) : [];
  if (!raw.length) return [];
  if (typeof raw[0] === 'object' && raw[0].unite) return raw.map(u => u.unite);
  return raw;
}

function haritaGetirVeri() {
  const myUid = (window.currentUserData||{}).uid || '';
  const soruEntries = studyEntries.filter(e =>
    e.type === 'soru' &&
    (e.userId === myUid || e.studentName === (window.currentUserData||{}).name)
  );
  const result = {};
  Object.keys(HEDEF_SORU).forEach(ders => {
    const de = soruEntries.filter(e => e.subject === ders);
    const toplamSoru  = de.reduce((a,e) => a+(e.questions||0), 0);
    const toplamDogru = de.reduce((a,e) => a+(e.correct||0), 0);
    const isabet = toplamSoru > 0 ? Math.round(toplamDogru/toplamSoru*100) : 0;
    const girilenKonular = new Set(de.map(e => e.unit||e.topic||'').filter(Boolean));
    const tumKonular  = _haritaKonuListesi(ders);
    const toplamKonu  = tumKonular.length || 1;
    const girilenSayi = tumKonular.filter(k => girilenKonular.has(k)).length;
    const hedef       = HEDEF_SORU[ders];
    const soruPct     = Math.min(100, Math.round(toplamSoru/hedef*100));
    const konuPct     = Math.min(100, Math.round(girilenSayi/toplamKonu*100));
    const genelPct    = Math.round((soruPct + konuPct) / 2);
    const ada         = HARITA_ADALAR.find(a => a.ad===ders || (ders==='İnkılap Tarihi'&&a.id==='ink'));
    result[ders] = {
      ad:ders, renk:ada?.renk||'#888',
      toplamSoru, toplamDogru, isabet, hedef,
      soruPct, konuPct, genelPct,
      girilenSayi, toplamKonu, tumKonular, girilenKonular,
    };
  });
  return result;
}

function maceraHarita() {
  const veri = haritaGetirVeri();
  const toplamPct = Math.round(Object.values(veri).reduce((a,d)=>a+d.genelPct,0)/6);

  // Adaya göre delay
  const delays = {mat:0,fen:1.2,tur:0.6,ing:1.8,ink:0.4,din:1.0};

  // Ada HTML: sis + bayrak + badge
  let adaHTML = '';
  HARITA_ADALAR.forEach(ada => {
    const dAdi  = ada.id==='ink' ? 'İnkılap Tarihi' : ada.ad;
    const d     = veri[dAdi] || {};
    const pct   = d.genelPct || 0;
    const sisOp = Math.max(0, Math.min(0.96, (100-pct)/100 * 1.05)).toFixed(2);
    const delay = delays[ada.id] || 0;
    const tamAcik     = pct >= 100;
    const hicGirilmedi= (d.toplamSoru||0) === 0;
    const dusuk       = d.isabet>0 && d.isabet<65;

    // Sis rengi
    const sr = dusuk ? '60,0,0' : '10,14,35';

    // Sis div (sadece %4'ten fazla sis varsa)
    if ((100-pct) > 4) {
      adaHTML += `<div style="
        position:absolute;
        left:${ada.cx*100}%;top:${ada.cy*100}%;
        width:${ada.rx*200}%;height:${ada.ry*200}%;
        transform:translate(-50%,-50%);
        border-radius:50%;overflow:hidden;
        opacity:${sisOp};
        ${dusuk?'border:1.5px solid rgba(255,60,60,.55)':''}
      ">
        <div style="position:absolute;width:100%;height:100%;top:0;left:0;border-radius:50%;
          background:radial-gradient(ellipse,rgba(${sr},.82) 0%,transparent 70%);
          animation:hSis1 ${6.5+delay*0.3}s ease-in-out infinite;
          animation-delay:${delay}s"></div>
        <div style="position:absolute;width:82%;height:82%;top:9%;left:9%;border-radius:50%;
          background:radial-gradient(ellipse,rgba(${sr},.65) 0%,transparent 68%);
          animation:hSis2 ${8.5+delay*0.4}s ease-in-out infinite;
          animation-delay:${delay+0.7}s"></div>
        <div style="position:absolute;width:65%;height:65%;top:17%;left:17%;border-radius:50%;
          background:radial-gradient(ellipse,rgba(${sr},.52) 0%,transparent 62%);
          animation:hSis3 ${10+delay*0.5}s ease-in-out infinite;
          animation-delay:${delay+1.4}s"></div>
        <div style="position:absolute;width:50%;height:50%;top:25%;left:25%;border-radius:50%;
          background:radial-gradient(ellipse,rgba(${sr},.44) 0%,transparent 58%);
          animation:hSis4 ${7.5+delay*0.3}s ease-in-out infinite;
          animation-delay:${delay+0.35}s"></div>
      </div>`;
    }

    // Altın parlama (tam açık)
    if (tamAcik) {
      adaHTML += `<div style="
        position:absolute;
        left:${ada.cx*100}%;top:${ada.cy*100}%;
        width:${ada.rx*240}%;height:${ada.ry*240}%;
        transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;
        background:radial-gradient(ellipse,rgba(249,202,36,.22) 0%,transparent 70%);
        animation:hParlama 3s ease-in-out infinite;
        animation-delay:${delay}s"></div>`;

      // Bayrak
      adaHTML += `<div style="
        position:absolute;
        left:${ada.cx*100}%;
        top:${(ada.cy - ada.ry*1.15)*100}%;
        transform:translate(-50%,-100%);
        font-size:15px;z-index:10;
        animation:hBayrak 2.5s ease-in-out infinite;
        filter:drop-shadow(0 2px 5px rgba(0,0,0,.7))">🚩</div>`;
    }

    // Badge
    let bRenk, bText, bBg;
    if      (tamAcik)       { bRenk='#f9ca24'; bText=`${ada.emoji} ${ada.ad} 🚩`; bBg='rgba(249,202,36,.2)'; }
    else if (hicGirilmedi)  { bRenk='#666';    bText=`${ada.emoji} ${ada.ad} 🔒`; bBg='rgba(0,0,0,.5)'; }
    else if (dusuk)         { bRenk='#ff6b6b'; bText=`${ada.emoji} ${ada.ad} ⚠️${pct}%`; bBg='rgba(255,60,60,.2)'; }
    else                    { bRenk=ada.renk;  bText=`${ada.emoji} ${ada.ad} ${pct}%`; bBg='rgba(0,0,0,.6)'; }

    adaHTML += `<div onclick="_haritaModalAc('${ada.id}')" style="
      position:absolute;
      left:${ada.cx*100}%;
      top:${Math.min(96,(ada.cy + ada.ry*1.18)*100)}%;
      transform:translateX(-50%);
      background:${bBg};
      border:1px solid ${bRenk}55;
      border-radius:99px;
      padding:3px 9px;
      font-size:9px;font-weight:800;
      color:${bRenk};
      white-space:nowrap;
      cursor:pointer;z-index:20;
      backdrop-filter:blur(4px);
      box-shadow:0 2px 8px rgba(0,0,0,.5);
      pointer-events:all">
      ${bText}
    </div>`;
  });

  // Genel sis katmanı HTML
  const genelSisHTML = `
    <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:0 0 14px 14px">
      <div style="position:absolute;width:75%;height:65%;top:-15%;left:-10%;border-radius:50%;filter:blur(22px);
        background:radial-gradient(ellipse,rgba(10,14,35,.48) 0%,transparent 70%);
        animation:hGSis1 16s ease-in-out infinite"></div>
      <div style="position:absolute;width:68%;height:60%;top:25%;right:-10%;border-radius:50%;filter:blur(20px);
        background:radial-gradient(ellipse,rgba(10,14,35,.4) 0%,transparent 70%);
        animation:hGSis2 20s ease-in-out infinite 2.5s"></div>
      <div style="position:absolute;width:90%;height:55%;bottom:-20%;left:5%;border-radius:50%;filter:blur(25px);
        background:radial-gradient(ellipse,rgba(10,14,35,.44) 0%,transparent 70%);
        animation:hGSis3 24s ease-in-out infinite 1.2s"></div>
    </div>`;

  // Yol SVG
  const dersSirasi = ['Matematik','Fen Bilimleri','Türkçe','Din Kültürü','İnkılap Tarihi','İngilizce'];
  let yolPaths = '';
  dersSirasi.forEach((ders,i) => {
    const d = veri[ders]||{};
    if ((d.genelPct||0) < 5) return;
    const a = HARITA_YOL[i], b = HARITA_YOL[i+1];
    if (!a||!b) return;
    const x1=a.x*1600,y1=a.y*872,x2=b.x*1600,y2=b.y*872;
    const renk = HARITA_ADALAR.find(a=>a.ad===ders||(ders==='İnkılap Tarihi'&&a.id==='ink'))?.renk||'#4ecdc4';
    yolPaths += `
      <path d="M${x1},${y1} Q${(x1+x2)/2},${(y1+y2)/2-32} ${x2},${y2}"
        stroke="${renk}" stroke-width="3.5" fill="none" stroke-linecap="round"
        stroke-dasharray="7 5" opacity=".8">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2.5s" repeatCount="indefinite"/>
      </path>
      <circle cx="${x2}" cy="${y2}" r="5" fill="${renk}" opacity=".6">
        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".5;.95;.5" dur="2s" repeatCount="indefinite"/>
      </circle>`;
  });

  // Hedef yolu sadece tüm adalar %50+ ise
  const acikAdaSayisi = HARITA_ADALAR.filter(ada => {
    const dAdi = ada.id==='ink'?'İnkılap Tarihi':ada.ad;
    return (veri[dAdi]?.genelPct||0) >= 50;
  }).length;

  if (acikAdaSayisi >= 4) {
    const son=HARITA_YOL[5], hdf=HARITA_YOL[6];
    yolPaths += `
      <path d="M${son.x*1600},${son.y*872} Q${(son.x+hdf.x)/2*1600},${(son.y+hdf.y)/2*872-55} ${hdf.x*1600},${hdf.y*872}"
        stroke="#f9ca24" stroke-width="4" fill="none" stroke-linecap="round"
        stroke-dasharray="8 5" opacity=".9">
        <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="2s" repeatCount="indefinite"/>
      </path>
      <circle cx="${hdf.x*1600}" cy="${hdf.y*872}" r="9" fill="#f9ca24" opacity=".85">
        <animate attributeName="r" values="7;13;7" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".65;1;.65" dur="1.5s" repeatCount="indefinite"/>
      </circle>`;
  }

  // Özet grid — tam isimler
  const ozetHTML = Object.values(veri).map(d => {
    const renk = d.genelPct>=80?d.renk:d.genelPct>=40?'#EF9F27':'#888';
    const ada  = HARITA_ADALAR.find(a=>a.ad===d.ad||(d.ad==='İnkılap Tarihi'&&a.id==='ink'));
    const adAdi = d.ad === 'İnkılap Tarihi' ? 'İnkılap' : d.ad === 'Fen Bilimleri' ? 'Fen Bil.' : d.ad;
    return `<div onclick="_haritaModalAc('${ada?.id||''}')" style="
      background:var(--surface2);border-radius:8px;padding:8px;
      text-align:center;cursor:pointer;transition:.15s">
      <div style="font-size:.65rem;color:var(--text2);margin-bottom:2px">${ada?.emoji||''} ${adAdi}</div>
      <div style="font-size:.92rem;font-weight:900;color:${renk}">%${d.genelPct}</div>
      <div style="font-size:.58rem;color:var(--text2);margin-top:1px">${d.girilenSayi}/${d.toplamKonu}k · ${d.toplamSoru}/${d.hedef}s</div>
    </div>`;
  }).join('');

  return `
    <style>
      @keyframes hSis1{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}33%{transform:translate(7%,-5%) scale(1.09) rotate(3deg)}66%{transform:translate(-5%,7%) scale(.94) rotate(-2deg)}}
      @keyframes hSis2{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(-9%,7%) scale(1.13) rotate(5deg)}50%{transform:translate(7%,-5%) scale(.89) rotate(-4deg)}75%{transform:translate(-4%,-9%) scale(1.06) rotate(3deg)}}
      @keyframes hSis3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(11%,5%) scale(.86)}80%{transform:translate(-7%,-7%) scale(1.11)}}
      @keyframes hSis4{0%,100%{transform:scale(1) translate(0,0);opacity:.9}50%{transform:scale(1.24) translate(3%,-3%);opacity:1}}
      @keyframes hGSis1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(10%,8%) scale(1.12)}}
      @keyframes hGSis2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-12%,-10%) scale(1.16)}}
      @keyframes hGSis3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(8%,-7%) scale(.9)}}
      @keyframes hParlama{0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}}
      @keyframes hBayrak{0%,100%{transform:translate(-50%,-100%) rotate(-4deg)}50%{transform:translate(-50%,-100%) rotate(4deg)}}

      /* Modal */
      .hModal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(6px)}
      .hModal-bg.acik{display:flex}
      .hModal{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:20px;max-width:320px;width:90%;max-height:82vh;overflow-y:auto;animation:hModalGel .22s ease-out}
      @keyframes hModalGel{from{opacity:0;transform:scale(.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
      .hModal-kapat{float:right;background:transparent;border:none;color:var(--text2);font-size:1.5rem;cursor:pointer;line-height:1}
      .hKonu-sat{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.8rem}
      .hKonu-sat:last-child{border-bottom:none}
    </style>

    <div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">
      <div style="padding:14px 16px 10px">
        <div class="card-title" style="margin:0">🗺️ Müfredat Takımadası</div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Konulara giriş yap + soru hedefine ulaş → sis dağılır</div>
      </div>

      <div style="position:relative;width:100%">
        <img src="map.png" style="width:100%;display:block"
          onerror="this.src='https://azizsengezer-byte.github.io/lgs-koc-takip/map.png'">

        ${genelSisHTML}

        <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible"
          viewBox="0 0 1600 872" preserveAspectRatio="xMidYMid meet">
          ${yolPaths}
        </svg>

        <div style="position:absolute;inset:0;pointer-events:none">
          ${adaHTML}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:10px 14px 14px">
        ${ozetHTML}
      </div>
    </div>

    <div class="hModal-bg" id="hModalBg" onclick="_haritaModalKapat(event)">
      <div class="hModal" onclick="event.stopPropagation()">
        <button class="hModal-kapat" onclick="_haritaModalKapat()">×</button>
        <div id="hModalIcerik"></div>
      </div>
    </div>
  `;
}

window._haritaModalAc = function(id) {
  const ada = HARITA_ADALAR.find(a=>a.id===id); if(!ada) return;
  const dAdi = id==='ink'?'İnkılap Tarihi':ada.ad;
  const veri = haritaGetirVeri();
  const d = veri[dAdi]; if(!d) return;
  const sR = d.soruPct>=100?'#43e97b':d.soruPct>=50?'#f9ca24':'#ff6b6b';
  const kR = d.konuPct>=100?'#43e97b':d.konuPct>=50?'#f9ca24':'#ff6b6b';

  document.getElementById('hModalIcerik').innerHTML = `
    <div style="margin-bottom:14px">
      <div style="font-size:2rem;margin-bottom:4px">${ada.emoji}</div>
      <div style="font-weight:900;font-size:1.1rem;margin-bottom:10px">${dAdi}</div>
      <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text2);margin-bottom:4px">
        <span>Genel ilerleme</span><span style="font-weight:800;color:${ada.renk}">%${d.genelPct}</span>
      </div>
      <div style="height:8px;background:var(--surface2);border-radius:4px;overflow:hidden;margin-bottom:12px">
        <div style="width:${d.genelPct}%;height:100%;background:${ada.renk};border-radius:4px;transition:.8s"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div style="background:var(--surface2);border-radius:10px;padding:10px">
          <div style="font-size:.62rem;color:var(--text2);margin-bottom:4px">🎯 Soru hedefi</div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px">
            <div style="width:${d.soruPct}%;height:100%;background:${sR};border-radius:3px"></div>
          </div>
          <div style="font-size:.74rem;font-weight:800;color:${sR}">${d.toplamSoru} / ${d.hedef}</div>
        </div>
        <div style="background:var(--surface2);border-radius:10px;padding:10px">
          <div style="font-size:.62rem;color:var(--text2);margin-bottom:4px">📚 Konu taraması</div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px">
            <div style="width:${d.konuPct}%;height:100%;background:${kR};border-radius:3px"></div>
          </div>
          <div style="font-size:.74rem;font-weight:800;color:${kR}">${d.girilenSayi} / ${d.toplamKonu}</div>
        </div>
      </div>
      ${d.isabet>0?`<div style="font-size:.74rem;color:var(--text2)">🎯 İsabet: <span style="font-weight:800;color:${d.isabet>=70?ada.renk:d.isabet>=50?'#f9ca24':'#ff6b6b'}">%${d.isabet}</span></div>`:''}
    </div>
    <div style="font-size:.78rem;font-weight:800;color:var(--text2);margin-bottom:8px">KONULAR</div>
    ${d.tumKonular.map(k=>{
      const g=d.girilenKonular.has(k);
      return `<div class="hKonu-sat">
        <div style="width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;flex-shrink:0;background:${g?ada.renk+'33':'rgba(255,255,255,.06)'};color:${g?ada.renk:'#555'}">${g?'✓':'○'}</div>
        <span style="color:${g?'var(--text)':'var(--text2)'}">${k}</span>
        ${g?`<span style="margin-left:auto;font-size:.65rem;color:${ada.renk}">✓</span>`:''}
      </div>`;
    }).join('')}
  `;
  document.getElementById('hModalBg').classList.add('acik');
};

window._haritaModalKapat = function(e) {
  if(!e||e.target===document.getElementById('hModalBg'))
    document.getElementById('hModalBg').classList.remove('acik');
};
