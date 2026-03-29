// ============================================================
// 🗺️ SAVAŞ SİSİ HARİTASI — CSS Animasyonlu
// ============================================================

function maceraHarita() {
  const veri = haritaGetirVeri();
  const adaHTML = HARITA_ADALAR.map(ada => {
    const dAdi = ada.id === 'ink' ? 'İnkılap Tarihi' : ada.ad;
    const d = veri[dAdi] || {};
    const pct = Math.min(100, Math.round(d.tamamlanan / d.toplamKonu * 100));
    const sisYog = Math.max(0, 100 - pct); // 0-100
    const dusuk = d.isabet > 0 && d.isabet < 65;
    const delay = ada.id === 'mat' ? 0 : ada.id === 'fen' ? 1.2 : ada.id === 'tur' ? 0.6 :
                  ada.id === 'ing' ? 1.8 : ada.id === 'ink' ? 0.4 : 1.0;

    if (sisYog < 4) return ''; // Tamamen açık

    const sisRenk = dusuk ? 'rgba(60,0,0' : 'rgba(15,18,40';
    const borderRenk = dusuk ? 'rgba(255,40,40,0.5)' : 'transparent';

    return `
      <div class="sis-ada" style="
        left:${ada.cx*100}%;
        top:${ada.cy*100}%;
        width:${ada.rx*200}%;
        height:${ada.ry*200}%;
        --sis-renk:${sisRenk};
        --sis-yog:${(sisYog/100).toFixed(2)};
        --delay:${delay}s;
        border: 2px solid ${borderRenk};
      ">
        <div class="sis-bulut sis-b1"></div>
        <div class="sis-bulut sis-b2"></div>
        <div class="sis-bulut sis-b3"></div>
        <div class="sis-merkez"></div>
      </div>
    `;
  }).join('');

  const ozet = Object.values(veri).map(d => {
    const pct = Math.round(d.tamamlanan / d.toplamKonu * 100);
    const renk = pct >= 80 ? d.renk : pct >= 40 ? '#EF9F27' : '#888';
    return `
      <div style="background:var(--surface2);border-radius:8px;padding:7px;text-align:center">
        <div style="font-size:0.68rem;color:var(--text2);margin-bottom:2px">${d.ad.substring(0,7)}</div>
        <div style="font-size:0.9rem;font-weight:800;color:${renk}">${pct}%</div>
        <div style="font-size:0.62rem;color:var(--text2)">${d.tamamlanan}/${d.toplamKonu} konu</div>
      </div>
    `;
  }).join('');

  return `
    <style>
      .harita-wrap { position:relative; width:100%; }
      .harita-wrap img { width:100%; display:block; border-radius:0 0 14px 14px; }
      .sis-kaplama { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; border-radius:0 0 14px 14px; }
      .sis-ada {
        position:absolute;
        transform:translate(-50%,-50%);
        border-radius:50%;
        overflow:hidden;
      }
      .sis-bulut {
        position:absolute;
        border-radius:50%;
        
      }
      .sis-b1 {
        width:80%; height:80%; top:10%; left:10%;
        background:radial-gradient(circle, rgba(15,18,40,0.5) 0%, transparent 70%);
        animation:sisYuz1 6s ease-in-out infinite;
        animation-delay:var(--delay);
      }
      .sis-b2 {
        width:60%; height:60%; top:20%; left:20%;
        background:radial-gradient(circle, rgba(15,18,40,0.35) 0%, transparent 70%);
        animation:sisYuz2 8s ease-in-out infinite;
        animation-delay:calc(var(--delay) + 0.5s);
      }
      .sis-b3 {
        width:70%; height:55%; top:5%; left:5%;
        background:radial-gradient(circle, rgba(15,18,40,0.28) 0%, transparent 70%);
        animation:sisYuz3 10s ease-in-out infinite;
        animation-delay:calc(var(--delay) + 1s);
      }
      .sis-merkez {
        position:absolute;
        width:50%; height:50%; top:25%; left:25%;
        background:radial-gradient(circle, rgba(15,18,40,0.4) 0%, transparent 70%);
        animation:sisMerkez 7s ease-in-out infinite;
        animation-delay:calc(var(--delay) + 0.3s);
      }
      @keyframes sisYuz1 {
        0%,100% { transform:translate(0,0) scale(1); opacity:1; }
        33%  { transform:translate(8%,-6%) scale(1.08); opacity:0.9; }
        66%  { transform:translate(-6%,8%) scale(0.95); opacity:1; }
      }
      @keyframes sisYuz2 {
        0%,100% { transform:translate(0,0) scale(1) rotate(0deg); }
        25%  { transform:translate(-10%,8%) scale(1.12) rotate(5deg); }
        50%  { transform:translate(8%,-6%) scale(0.92) rotate(-3deg); }
        75%  { transform:translate(-5%,-10%) scale(1.06) rotate(4deg); }
      }
      @keyframes sisYuz3 {
        0%,100% { transform:translate(0,0) scale(1); }
        40%  { transform:translate(12%,6%) scale(0.88); }
        80%  { transform:translate(-8%,-8%) scale(1.1); }
      }
      @keyframes sisMerkez {
        0%,100% { transform:scale(1) translate(0,0); opacity:0.8; }
        50%  { transform:scale(1.2) translate(4%,-4%); opacity:1; }
      }
    </style>

    <div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">
      <div style="padding:14px 16px 10px">
        <div class="card-title" style="margin:0">🗺️ Müfredat Takımadası</div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Her derste 300 soru çözdükçe sis dağılıyor</div>
      </div>

      <div class="harita-wrap">
        <img src="map.png" alt="Müfredat Haritası"
             onerror="this.src='https://azizsengezer-byte.github.io/lgs-koc-takip/map.png'">
        <div class="sis-kaplama">${adaHTML}</div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:10px 14px 14px">
        ${ozet}
      </div>
    </div>
  `;
}

const HARITA_ADALAR = [
  { id:'mat', ad:'Matematik',    renk:'#4ecdc4', cx:0.285, cy:0.48,  rx:0.14, ry:0.22 },
  { id:'fen', ad:'Fen Bilimleri',renk:'#45b7d1', cx:0.50,  cy:0.30,  rx:0.12, ry:0.21 },
  { id:'tur', ad:'Türkçe',       renk:'#ff6b6b', cx:0.70,  cy:0.50,  rx:0.12, ry:0.21 },
  { id:'ing', ad:'İngilizce',    renk:'#fd79a8', cx:0.255, cy:0.735, rx:0.11, ry:0.18 },
  { id:'ink', ad:'İnkılap',      renk:'#f9ca24', cx:0.50,  cy:0.80,  rx:0.13, ry:0.18 },
  { id:'din', ad:'Din Kültürü',  renk:'#a29bfe', cx:0.735, cy:0.78,  rx:0.11, ry:0.18 },
];

function haritaGetirVeri() {
  const myUid = (window.currentUserData||{}).uid || '';
  const soruEntries = studyEntries.filter(e =>
    (e.type === 'soru') &&
    (e.userId === myUid || e.studentName === (window.currentUserData||{}).name)
  );

  const dersler = {
    'Matematik':     { renk:'#4ecdc4', id:'mat' },
    'Fen Bilimleri': { renk:'#45b7d1', id:'fen' },
    'Türkçe':        { renk:'#ff6b6b', id:'tur' },
    'İngilizce':     { renk:'#fd79a8', id:'ing' },
    'İnkılap Tarihi':{ renk:'#f9ca24', id:'ink' },
    'Din Kültürü':   { renk:'#a29bfe', id:'din' },
  };

  const kazanimSayilari = {
    'Matematik':14, 'Fen Bilimleri':7, 'Türkçe':14,
    'İngilizce':10, 'İnkılap Tarihi':7, 'Din Kültürü':5
  };

  const HEDEF_SORU = 300; // Her ders için hedef soru sayısı

  const result = {};
  Object.keys(dersler).forEach(ders => {
    const entries = soruEntries.filter(e => e.subject === ders);
    const toplamQ = entries.reduce((a,e) => a+(e.questions||0), 0);
    const toplamD = entries.reduce((a,e) => a+(e.correct||0), 0);
    const isabet = toplamQ > 0 ? Math.round(toplamD/toplamQ*100) : 0;
    const toplamKonu = kazanimSayilari[ders] || 10;
    // 300 soruda tüm konular tamamlanmış sayılır
    const tamamlanan = Math.min(toplamKonu, Math.round((toplamQ / HEDEF_SORU) * toplamKonu));

    result[ders] = {
      ...dersler[ders], ad:ders,
      toplamKonu, tamamlanan, isabet, toplamSoru:toplamQ,
    };
  });
  return result;
}
