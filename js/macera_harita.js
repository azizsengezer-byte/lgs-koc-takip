// ============================================================
// 🗺️ SAVAŞ SİSİ HARİTASI v6 — JS Driven SVG
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

function _haritaKonuListesi(ders) {
  const raw=(typeof kazanimlar!=='undefined')?(kazanimlar[ders]||[]):[];
  if(!raw.length) return [];
  if(typeof raw[0]==='object'&&raw[0].unite) return raw.map(u=>u.unite);
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
    const tumKonular=_haritaKonuListesi(ders);
    const toplamKonu=tumKonular.length||1;
    const girilenSayi=tumKonular.filter(k=>girilenKonular.has(k)).length;
    const hedef=HEDEF_SORU[ders];
    const soruPct=Math.min(100,Math.round(toplamSoru/hedef*100));
    const konuPct=Math.min(100,Math.round(girilenSayi/toplamKonu*100));
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

let _hRaf=null;

function maceraHarita() {
  if(_hRaf){cancelAnimationFrame(_hRaf);_hRaf=null;}
  const veri=haritaGetirVeri();
  const VW=1600,VH=872;

  // Statik SVG içeriği: sadece yol çizgileri (animasyonsuz)
  const yolNoktalari=[
    {x:0.285,y:0.48},{x:0.50,y:0.30},{x:0.70,y:0.50},
    {x:0.735,y:0.78},{x:0.50,y:0.80},{x:0.255,y:0.735},
    {x:0.83,y:0.12},
  ];
  const dersSirasi=['Matematik','Fen Bilimleri','Türkçe','Din Kültürü','İnkılap Tarihi','İngilizce'];
  let yolHTML='';
  dersSirasi.forEach((ders,i)=>{
    const d=veri[ders]||{};
    if((d.genelPct||0)<5) return;
    const a=yolNoktalari[i],b=yolNoktalari[i+1];
    if(!a||!b) return;
    const x1=a.x*VW,y1=a.y*VH,x2=b.x*VW,y2=b.y*VH;
    const renk=HARITA_ADALAR.find(x=>x.ad===ders||(ders==='İnkılap Tarihi'&&x.id==='ink'))?.renk||'#fff';
    yolHTML+=`<path id="yol_${i}" d="M${x1},${y1} Q${(x1+x2)/2},${(y1+y2)/2-35} ${x2},${y2}"
      stroke="${renk}" stroke-width="4" fill="none" stroke-linecap="round"
      stroke-dasharray="8 6" stroke-dashoffset="0" opacity=".85"/>
    <circle id="yolN_${i}" cx="${x2}" cy="${y2}" r="6" fill="${renk}" opacity=".7"/>`;
  });

  // Hedef yolu
  const acikSayisi=HARITA_ADALAR.filter(ada=>{
    const dAdi=ada.id==='ink'?'İnkılap Tarihi':ada.ad;
    return(veri[dAdi]?.genelPct||0)>=50;
  }).length;
  if(acikSayisi>=4){
    const s=yolNoktalari[5],h=yolNoktalari[6];
    yolHTML+=`<path id="yolHedef" d="M${s.x*VW},${s.y*VH} Q${(s.x+h.x)/2*VW},${(s.y+h.y)/2*VH-60} ${h.x*VW},${h.y*VH}"
      stroke="#f9ca24" stroke-width="5" fill="none" stroke-linecap="round"
      stroke-dasharray="9 6" stroke-dashoffset="0" opacity=".95"/>
    <circle id="yolNHedef" cx="${h.x*VW}" cy="${h.y*VH}" r="10" fill="#f9ca24" opacity=".9"/>`;
  }

  // Sis elipsleri (statik, JS hareket ettirecek)
  let sisHTML='';
  HARITA_ADALAR.forEach((ada,idx)=>{
    const dAdi=ada.id==='ink'?'İnkılap Tarihi':ada.ad;
    const d=veri[dAdi]||{};
    const pct=d.genelPct||0;
    if(pct>=100) return;
    const op=Math.max(0.12,(100-pct)/100*0.85).toFixed(2);
    const cx=ada.cx*VW,cy=ada.cy*VH;
    const rx=ada.rx*VW,ry=ada.ry*VH;
    const dusuk=d.isabet>0&&d.isabet<65;
    const r=dusuk?'180,80,80':'200,215,230';

    // 3 katman
    [1.0,0.75,0.52].forEach((mul,li)=>{
      sisHTML+=`<ellipse id="sis_${ada.id}_${li}"
        cx="${cx}" cy="${cy}"
        rx="${rx*mul}" ry="${ry*mul}"
        fill="rgba(${r},${(parseFloat(op)*(1-li*0.22)).toFixed(2)})"
        filter="url(#sb)"/>`;
    });

    // Şimşek path (başlangıçta gizli) — her ada için
    const lx=cx+rx*0.08, ly=cy-ry*0.25;
  });

  // Etiketler (ada merkezi)
  let etiketHTML='';
  HARITA_ADALAR.forEach(ada=>{
    const dAdi=ada.id==='ink'?'İnkılap Tarihi':ada.ad;
    const d=veri[dAdi]||{};
    const pct=d.genelPct||0;
    const tamAcik=pct>=100;
    const hicYok=(d.toplamSoru||0)===0;
    const dusuk=d.isabet>0&&d.isabet<65;
    let ikon,renk,bg;
    if(tamAcik)    {ikon='🚩';renk='#f9ca24';bg='rgba(20,15,0,.82)';}
    else if(hicYok){ikon='🔒';renk='#aaa';   bg='rgba(0,0,0,.72)';}
    else if(dusuk) {ikon='⚡';renk='#ff8080';bg='rgba(50,0,0,.78)';}
    else           {ikon='';  renk=ada.renk; bg='rgba(0,0,0,.72)';}
    const tekst=tamAcik?'🚩':hicYok?'🔒':`${ikon}${pct}%`;
    etiketHTML+=`
      <div onclick="_haritaModalAc('${ada.id}')"
        style="position:absolute;
          left:${ada.cx*100}%;top:${ada.cy*100}%;
          transform:translate(-50%,-50%);
          background:${bg};border:1.5px solid ${renk}99;
          border-radius:99px;padding:2px 8px;
          font-size:9.5px;font-weight:800;color:${renk};
          white-space:nowrap;cursor:pointer;z-index:20;
          box-shadow:0 2px 12px rgba(0,0,0,.75);
          pointer-events:all">${tekst}</div>`;
    if(tamAcik){
      etiketHTML+=`<div style="position:absolute;
        left:${ada.cx*100}%;top:${(ada.cy-ada.ry*1.2)*100}%;
        transform:translate(-50%,-100%);font-size:18px;z-index:21;
        filter:drop-shadow(0 2px 6px rgba(0,0,0,.9))">🚩</div>`;
    }
    // Şimşek — pct<70 ise, z-index:30 ile her şeyin ÜSTÜNDE
    if(pct<70){
      etiketHTML+=`<div id="sim_${ada.id}" style="
        position:absolute;
        left:${ada.cx*100}%;
        top:${ada.cy*100}%;
        transform:translate(-20px,-60px);
        width:36px;height:70px;
        pointer-events:none;
        z-index:30;
        opacity:1;">
        <svg width="36" height="70" viewBox="0 0 36 70" overflow="visible">
          <defs>
            <filter id="sg${ada.id}" x="-80%" y="-40%" width="260%" height="180%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <ellipse cx="18" cy="35" rx="22" ry="32" fill="rgba(255,235,50,0.28)" filter="url(#sg${ada.id})"/>
          <path d="M21,2 L6,30 L17,30 L11,68 L30,22 L19,22 Z"
            fill="#ffee44" stroke="#ffffff" stroke-width="1"
            filter="url(#sg${ada.id})"/>
        </svg>
      </div>`;
    }
  });

  // Özet
  const ozetHTML=Object.values(veri).map(d=>{
    const renk=d.genelPct>=80?d.renk:d.genelPct>=40?'#EF9F27':'#888';
    const ada=HARITA_ADALAR.find(a=>a.ad===d.ad||(d.ad==='İnkılap Tarihi'&&a.id==='ink'));
    const kAdi=d.ad==='İnkılap Tarihi'?'İnkılap':d.ad==='Fen Bilimleri'?'Fen Bil.':d.ad;
    return `<div onclick="_haritaModalAc('${ada?.id||''}')"
      style="background:var(--surface2);border-radius:8px;padding:8px;text-align:center;cursor:pointer">
      <div style="font-size:.63rem;color:var(--text2);margin-bottom:2px">${ada?.emoji||''} ${kAdi}</div>
      <div style="font-size:.9rem;font-weight:900;color:${renk}">%${d.genelPct}</div>
      <div style="font-size:.56rem;color:var(--text2);margin-top:1px">${d.girilenSayi}/${d.toplamKonu}k · ${d.toplamSoru}/${d.hedef}s</div>
    </div>`;
  }).join('');

  // JS animasyonu başlat
  setTimeout(()=>_hAnimBaslat(veri),150);

  return `
    <style>
      .hModal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(6px)}
      .hModal-bg.acik{display:flex}
      .hModal{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:20px;max-width:320px;width:90%;max-height:82vh;overflow-y:auto}
      .hModal-kapat{float:right;background:transparent;border:none;color:var(--text2);font-size:1.5rem;cursor:pointer}
      .hKonu-sat{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:.8rem}
      .hKonu-sat:last-child{border-bottom:none}
    </style>

    <div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">
      <div style="padding:14px 16px 10px">
        <div class="card-title" style="margin:0">🗺️ Müfredat Takımadası</div>
        <div style="font-size:.75rem;color:var(--text2);margin-top:2px">Adaları fethettikçe sis dağılır, Hedef Okul'a ulaş!</div>
      </div>

      <div style="position:relative;width:100%;padding-bottom:54.5%">
        <img src="map.png"
          style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover"
          onerror="this.src='https://azizsengezer-byte.github.io/lgs-koc-takip/map.png'">

        <svg id="hSvg" style="position:absolute;top:0;left:0;width:100%;height:100%"
          viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="sb" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="22"/>
            </filter>
          </defs>
          ${sisHTML}
          ${yolHTML}
        </svg>

        <div style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none">
          ${etiketHTML}
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

function _hAnimBaslat(veri) {
  if(_hRaf){cancelAnimationFrame(_hRaf);_hRaf=null;}
  const VW=1600,VH=872;
  const t0=performance.now();
  const delays=[0,1.2,0.6,1.8,0.4,1.0];

  // Şimşek durumları
  const simState=HARITA_ADALAR.map((ada,i)=>({
    nextFlash:t0+300+i*200,
    on:false,
    onUntil:0,
  }));

  // Yol dashoffset sayacı
  let dashOff=0;

  function frame(now){
    const t=now-t0;
    dashOff=(dashOff+0.4)%28;

    // Sis hareketi
    HARITA_ADALAR.forEach((ada,idx)=>{
      const dAdi=ada.id==='ink'?'İnkılap Tarihi':ada.ad;
      const d=veri[dAdi]||{};
      const pct=d.genelPct||0;
      if(pct>=100) return;
      const dl=delays[idx];
      [1.0,0.75,0.52].forEach((mul,li)=>{
        const el=document.getElementById(`sis_${ada.id}_${li}`);
        if(!el) return;
        const spd=0.0004+li*0.0001;
        const amp=0.04+li*0.01;
        const tx=Math.sin(t*spd+dl+li)*amp*ada.rx*VW;
        const ty=Math.cos(t*spd*0.75+dl*0.8+li)*amp*ada.ry*VH;
        const sc=1+Math.sin(t*spd*0.5+dl)*0.06;
        el.setAttribute('cx',ada.cx*VW+tx);
        el.setAttribute('cy',ada.cy*VH+ty);
        el.setAttribute('rx',ada.rx*VW*mul*sc);
        el.setAttribute('ry',ada.ry*VH*mul*sc);
      });

      // Şimşek
      const ss=simState[idx];
      const simEl=document.getElementById(`sim_${ada.id}`);
      if(simEl && pct<70){
        if(!ss.on && now>=ss.nextFlash){
          ss.on=true;
          ss.onUntil=now+220;
          ss.nextFlash=now+1500+Math.random()*1500+idx*200;
        }
        if(ss.on && now>ss.onUntil){
          ss.on=false;
          // Çift çakma efekti
          if(Math.random()>0.5){
            ss.nextFlash=now+80;
          }
        }
        simEl.style.opacity = ss.on ? '1' : '0';
      }
    });

    // Yol animasyonu
    for(let i=0;i<6;i++){
      const el=document.getElementById(`yol_${i}`);
      if(el) el.setAttribute('stroke-dashoffset',-dashOff);
    }
    const yolH=document.getElementById('yolHedef');
    if(yolH) yolH.setAttribute('stroke-dashoffset',-dashOff*1.2);

    // Yol nokta nabzı
    for(let i=0;i<6;i++){
      const el=document.getElementById(`yolN_${i}`);
      if(el){
        const r=5+Math.sin(t*0.003+i)*3;
        const op=0.55+Math.sin(t*0.003+i)*0.4;
        el.setAttribute('r',r);
        el.setAttribute('opacity',op);
      }
    }
    const yolNH=document.getElementById('yolNHedef');
    if(yolNH){
      const r=8+Math.sin(t*0.004)*5;
      yolNH.setAttribute('r',r);
    }

    _hRaf=requestAnimationFrame(frame);
  }
  _hRaf=requestAnimationFrame(frame);
}

window._haritaModalAc=function(id){
  const ada=HARITA_ADALAR.find(a=>a.id===id);if(!ada)return;
  const dAdi=id==='ink'?'İnkılap Tarihi':ada.ad;
  const veri=haritaGetirVeri();
  const d=veri[dAdi];if(!d)return;
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
          <div style="font-size:.74rem;font-weight:800;color:${sR}">${d.toplamSoru}/${d.hedef}</div>
        </div>
        <div style="background:var(--surface2);border-radius:10px;padding:10px">
          <div style="font-size:.62rem;color:var(--text2);margin-bottom:4px">📚 Konu taraması</div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px">
            <div style="width:${d.konuPct}%;height:100%;background:${kR};border-radius:3px"></div>
          </div>
          <div style="font-size:.74rem;font-weight:800;color:${kR}">${d.girilenSayi}/${d.toplamKonu}</div>
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
