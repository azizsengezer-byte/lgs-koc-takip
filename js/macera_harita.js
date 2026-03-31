// ============================================================
// 🗺️ SAVAŞ SİSİ HARİTASI v4 — Canvas Animasyonlu
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
  'Matematik':1000,'Fen Bilimleri':1000,'Türkçe':1000,
  'İngilizce':500,'İnkılap Tarihi':500,'Din Kültürü':500,
};

const HARITA_YOL = [
  {x:0.285,y:0.48},{x:0.50,y:0.30},{x:0.70,y:0.50},
  {x:0.735,y:0.78},{x:0.50,y:0.80},{x:0.255,y:0.735},
  {x:0.83,y:0.12},
];

function _haritaKonuListesi(ders) {
  const raw = (typeof kazanimlar!=='undefined')?(kazanimlar[ders]||[]):[];
  if (!raw.length) return [];
  if (typeof raw[0]==='object'&&raw[0].unite) return raw.map(u=>u.unite);
  return raw;
}

function haritaGetirVeri() {
  const myUid=(window.currentUserData||{}).uid||'';
  const soruEntries=studyEntries.filter(e=>
    e.type==='soru'&&(e.userId===myUid||e.studentName===(window.currentUserData||{}).name)
  );
  const result={};
  Object.keys(HEDEF_SORU).forEach(ders=>{
    const de=soruEntries.filter(e=>e.subject===ders);
    const toplamSoru =de.reduce((a,e)=>a+(e.questions||0),0);
    const toplamDogru=de.reduce((a,e)=>a+(e.correct||0),0);
    const isabet=toplamSoru>0?Math.round(toplamDogru/toplamSoru*100):0;
    const girilenKonular=new Set(de.map(e=>e.unit||e.topic||'').filter(Boolean));
    const tumKonular =_haritaKonuListesi(ders);
    const toplamKonu =tumKonular.length||1;
    const girilenSayi=tumKonular.filter(k=>girilenKonular.has(k)).length;
    const hedef=HEDEF_SORU[ders];
    const soruPct =Math.min(100,Math.round(toplamSoru/hedef*100));
    const konuPct =Math.min(100,Math.round(girilenSayi/toplamKonu*100));
    const genelPct=Math.round((soruPct+konuPct)/2);
    const ada=HARITA_ADALAR.find(a=>a.ad===ders||(ders==='İnkılap Tarihi'&&a.id==='ink'));
    result[ders]={
      ad:ders,renk:ada?.renk||'#888',
      toplamSoru,toplamDogru,isabet,hedef,
      soruPct,konuPct,genelPct,
      girilenSayi,toplamKonu,tumKonular,girilenKonular,
    };
  });
  return result;
}

// Global animasyon handle
let _haritaAnimId = null;

function maceraHarita() {
  // Önceki animasyonu durdur
  if (_haritaAnimId) { cancelAnimationFrame(_haritaAnimId); _haritaAnimId=null; }

  const veri=haritaGetirVeri();

  // Badge HTML
  let badgeHTML='';
  HARITA_ADALAR.forEach(ada=>{
    const dAdi=ada.id==='ink'?'İnkılap Tarihi':ada.ad;
    const d=veri[dAdi]||{};
    const pct=d.genelPct||0;
    const tamAcik=pct>=100;
    const hicGirilmedi=(d.toplamSoru||0)===0;
    const dusuk=d.isabet>0&&d.isabet<65;
    let bRenk,bText,bBg;
    if      (tamAcik)      {bRenk='#f9ca24';bText=`${ada.emoji} ${ada.ad} 🚩`;bBg='rgba(249,202,36,.2)';}
    else if (hicGirilmedi) {bRenk='#666';   bText=`${ada.emoji} ${ada.ad} 🔒`;bBg='rgba(0,0,0,.6)';}
    else if (dusuk)        {bRenk='#ff6b6b';bText=`${ada.emoji} ${ada.ad} ⚠️${pct}%`;bBg='rgba(255,60,60,.2)';}
    else                   {bRenk=ada.renk; bText=`${ada.emoji} ${ada.ad} ${pct}%`;bBg='rgba(0,0,0,.65)';}
    badgeHTML+=`<div onclick="_haritaModalAc('${ada.id}')" style="
      position:absolute;
      left:${ada.cx*100}%;
      top:${Math.min(94,(ada.cy+ada.ry*1.18)*100)}%;
      transform:translateX(-50%);
      background:${bBg};border:1px solid ${bRenk}66;
      border-radius:99px;padding:3px 9px;
      font-size:9px;font-weight:800;color:${bRenk};
      white-space:nowrap;cursor:pointer;z-index:20;
      box-shadow:0 2px 8px rgba(0,0,0,.6);
      pointer-events:all">${bText}</div>`;
    if (tamAcik) {
      badgeHTML+=`<div style="position:absolute;left:${ada.cx*100}%;top:${(ada.cy-ada.ry*1.15)*100}%;
        transform:translate(-50%,-100%);font-size:15px;z-index:10;
        filter:drop-shadow(0 2px 5px rgba(0,0,0,.8))">🚩</div>`;
    }
  });

  // Yol SVG
  const dersSirasi=['Matematik','Fen Bilimleri','Türkçe','Din Kültürü','İnkılap Tarihi','İngilizce'];
  let yolPaths='';
  dersSirasi.forEach((ders,i)=>{
    const d=veri[ders]||{};
    if((d.genelPct||0)<5) return;
    const a=HARITA_YOL[i],b=HARITA_YOL[i+1];
    if(!a||!b) return;
    const x1=a.x*1600,y1=a.y*872,x2=b.x*1600,y2=b.y*872;
    const renk=HARITA_ADALAR.find(a=>a.ad===ders||(ders==='İnkılap Tarihi'&&a.id==='ink'))?.renk||'#4ecdc4';
    yolPaths+=`<path d="M${x1},${y1} Q${(x1+x2)/2},${(y1+y2)/2-32} ${x2},${y2}"
      stroke="${renk}" stroke-width="3.5" fill="none" stroke-linecap="round"
      stroke-dasharray="7 5" opacity=".8">
      <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2.5s" repeatCount="indefinite"/>
    </path>
    <circle cx="${x2}" cy="${y2}" r="5" fill="${renk}" opacity=".6">
      <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/>
    </circle>`;
  });

  const acikSayisi=HARITA_ADALAR.filter(ada=>{
    const dAdi=ada.id==='ink'?'İnkılap Tarihi':ada.ad;
    return(veri[dAdi]?.genelPct||0)>=50;
  }).length;
  if(acikSayisi>=4){
    const s=HARITA_YOL[5],h=HARITA_YOL[6];
    yolPaths+=`<path d="M${s.x*1600},${s.y*872} Q${(s.x+h.x)/2*1600},${(s.y+h.y)/2*872-55} ${h.x*1600},${h.y*872}"
      stroke="#f9ca24" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="8 5" opacity=".9">
      <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="2s" repeatCount="indefinite"/>
    </path>
    <circle cx="${h.x*1600}" cy="${h.y*872}" r="9" fill="#f9ca24" opacity=".85">
      <animate attributeName="r" values="7;13;7" dur="1.5s" repeatCount="indefinite"/>
    </circle>`;
  }

  // Özet
  const ozetHTML=Object.values(veri).map(d=>{
    const renk=d.genelPct>=80?d.renk:d.genelPct>=40?'#EF9F27':'#888';
    const ada=HARITA_ADALAR.find(a=>a.ad===d.ad||(d.ad==='İnkılap Tarihi'&&a.id==='ink'));
    const adAdi=d.ad==='İnkılap Tarihi'?'İnkılap':d.ad==='Fen Bilimleri'?'Fen Bil.':d.ad;
    return `<div onclick="_haritaModalAc('${ada?.id||''}')" style="
      background:var(--surface2);border-radius:8px;padding:8px;text-align:center;cursor:pointer">
      <div style="font-size:.65rem;color:var(--text2);margin-bottom:2px">${ada?.emoji||''} ${adAdi}</div>
      <div style="font-size:.92rem;font-weight:900;color:${renk}">%${d.genelPct}</div>
      <div style="font-size:.58rem;color:var(--text2);margin-top:1px">${d.girilenSayi}/${d.toplamKonu}k · ${d.toplamSoru}/${d.hedef}s</div>
    </div>`;
  }).join('');

  // Canvas animasyonu başlat (DOM hazır olunca)
  setTimeout(()=>_haritaCanvasBaslat(veri),300);

  return `
    <style>
      .hModal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(6px)}
      .hModal-bg.acik{display:flex}
      .hModal{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:20px;max-width:320px;width:90%;max-height:82vh;overflow-y:auto}
      .hModal-kapat{float:right;background:transparent;border:none;color:var(--text2);font-size:1.5rem;cursor:pointer;line-height:1}
      .hKonu-sat{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.8rem}
      .hKonu-sat:last-child{border-bottom:none}
    </style>

    <div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">
      <div style="padding:14px 16px 10px">
        <div class="card-title" style="margin:0">🗺️ Müfredat Takımadası</div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Konulara giriş yap + soru hedefine ulaş → sis dağılır</div>
      </div>

      <div id="haritaWrap" style="position:relative;width:100%">
        <img id="haritaImg" src="map.png" style="width:100%;display:block;visibility:hidden"
          onload="this.style.visibility='visible';_haritaImgYuklendi()"
          onerror="this.src='https://azizsengezer-byte.github.io/lgs-koc-takip/map.png';this.style.visibility='visible'">

        <!-- Canvas: sis tam üstte -->
        <canvas id="haritaSisCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5"></canvas>

        <!-- SVG yollar -->
        <svg id="haritaYolSvg" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:6;overflow:visible"
          viewBox="0 0 1600 872" preserveAspectRatio="xMidYMid meet">
          ${yolPaths}
        </svg>

        <!-- Badge overlay -->
        <div style="position:absolute;inset:0;pointer-events:none;z-index:10">
          ${badgeHTML}
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

window._haritaImgYuklendi = function() {
  const img = document.getElementById('haritaImg');
  const canvas = document.getElementById('haritaSisCanvas');
  if (!canvas||!img) return;
  canvas.width  = img.naturalWidth  || img.offsetWidth;
  canvas.height = img.naturalHeight || img.offsetHeight;
};

function _haritaCanvasBaslat(veri) {
  if (_haritaAnimId) { cancelAnimationFrame(_haritaAnimId); _haritaAnimId=null; }

  const canvas = document.getElementById('haritaSisCanvas');
  const img    = document.getElementById('haritaImg');
  if (!canvas||!img) return;

  // Canvas boyutunu görselin gerçek boyutuna eşitle
  const setSize = ()=>{
    canvas.width  = img.offsetWidth  * (window.devicePixelRatio||1);
    canvas.height = img.offsetHeight * (window.devicePixelRatio||1);
  };
  setSize();

  const ctx = canvas.getContext('2d');
  const t0  = performance.now();

  // Her ada için sis bulut parametreleri
  const adaParams = HARITA_ADALAR.map((ada,idx)=>{
    const dAdi = ada.id==='ink'?'İnkılap Tarihi':ada.ad;
    const d    = veri[dAdi]||{};
    const pct  = d.genelPct||0;
    const sisOp= Math.max(0, Math.min(0.92, (100-pct)/100));
    if (sisOp<0.04) return null;
    const dusuk= d.isabet>0&&d.isabet<65;
    const delay= [0,1.2,0.6,1.8,0.4,1.0][idx]||0;
    return {
      ada, sisOp, dusuk, delay,
      // 4 katman bulut
      layers:[
        {rMul:1.0,  op:0.82, spd:0.00045, phX:delay*0.8, phY:delay*0.5, phS:delay*0.3, ampX:0.015, ampY:0.012, ampS:0.08},
        {rMul:0.78, op:0.65, spd:0.00038, phX:delay*0.6, phY:delay*0.9, phS:delay*0.7, ampX:0.018, ampY:0.014, ampS:0.1},
        {rMul:0.58, op:0.52, spd:0.00052, phX:delay*1.1, phY:delay*0.3, phS:delay*0.5, ampX:0.022, ampY:0.01,  ampS:0.07},
        {rMul:0.40, op:0.42, spd:0.00041, phX:delay*0.4, phY:delay*1.2, phS:delay*0.9, ampX:0.012, ampY:0.018, ampS:0.12},
      ],
    };
  }).filter(Boolean);

  function drawRadialCloud(ctx, cx, cy, rx, ry, opacity, r, g, b) {
    const grad = ctx.createRadialGradient(cx,cy,0, cx,cy, Math.max(rx,ry));
    grad.addColorStop(0,   `rgba(${r},${g},${b},${opacity})`);
    grad.addColorStop(0.4, `rgba(${r},${g},${b},${opacity*0.55})`);
    grad.addColorStop(0.75,`rgba(${r},${g},${b},${opacity*0.15})`);
    grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    ctx.save();
    ctx.scale(1, ry/rx);
    ctx.beginPath();
    ctx.arc(cx, cy*(rx/ry), rx, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  function frame(now) {
    const t  = now - t0;
    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0,0,cw,ch);

    // Genel sis katmanı (3 büyük bulut)
    const genelBulutlar=[
      {cx:0.25, cy:0.3,  rx:0.5, ry:0.45, op:0.38, spd:0.00016, phX:0,   phY:0},
      {cx:0.75, cy:0.55, rx:0.45,ry:0.5,  op:0.32, spd:0.00013, phX:1.5, phY:0.8},
      {cx:0.45, cy:0.85, rx:0.6, ry:0.4,  op:0.35, spd:0.00011, phX:0.7, phY:1.3},
    ];
    genelBulutlar.forEach(gb=>{
      const tx = Math.sin(t*gb.spd+gb.phX)*0.06;
      const ty = Math.cos(t*gb.spd*0.8+gb.phY)*0.05;
      const cx = (gb.cx+tx)*cw;
      const cy = (gb.cy+ty)*ch;
      drawRadialCloud(ctx, cx,cy, gb.rx*cw, gb.ry*ch, gb.op, 8,12,32);
    });

    // Ada sisleri
    adaParams.forEach(p=>{
      const {ada,sisOp,dusuk,layers}=p;
      const baseCX = ada.cx*cw;
      const baseCY = ada.cy*ch;
      const baseRX = ada.rx*cw;
      const baseRY = ada.ry*ch;
      const r=dusuk?55:8, g=dusuk?0:12, b=dusuk?0:32;

      layers.forEach(l=>{
        const tx = Math.sin(t*l.spd+l.phX)*l.ampX*cw;
        const ty = Math.cos(t*l.spd*0.8+l.phY)*l.ampY*ch;
        const sc = 1+Math.sin(t*l.spd*0.6+l.phS)*l.ampS;
        const cx = baseCX+tx;
        const cy = baseCY+ty;
        const rx = baseRX*l.rMul*sc;
        const ry = baseRY*l.rMul*sc;
        drawRadialCloud(ctx, cx,cy, rx,ry, l.op*sisOp, r,g,b);
      });

      // Kırmızı border (düşük isabet)
      if (dusuk) {
        ctx.save();
        ctx.strokeStyle='rgba(255,60,60,0.5)';
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.ellipse(baseCX,baseCY, baseRX,baseRY, 0,0,Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }
    });

    _haritaAnimId = requestAnimationFrame(frame);
  }

  _haritaAnimId = requestAnimationFrame(frame);
}

// ── Modal ──────────────────────────────────────────────────
window._haritaModalAc = function(id) {
  const ada=HARITA_ADALAR.find(a=>a.id===id); if(!ada) return;
  const dAdi=id==='ink'?'İnkılap Tarihi':ada.ad;
  const veri=haritaGetirVeri();
  const d=veri[dAdi]; if(!d) return;
  const sR=d.soruPct>=100?'#43e97b':d.soruPct>=50?'#f9ca24':'#ff6b6b';
  const kR=d.konuPct>=100?'#43e97b':d.konuPct>=50?'#f9ca24':'#ff6b6b';
  document.getElementById('hModalIcerik').innerHTML=`
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

window._haritaModalKapat=function(e){
  if(!e||e.target===document.getElementById('hModalBg'))
    document.getElementById('hModalBg').classList.remove('acik');
};
