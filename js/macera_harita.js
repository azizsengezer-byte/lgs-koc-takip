// ============================================================
// 🗺️ SAVAŞ SİSİ HARİTASI
// ============================================================

function maceraHarita() {
  return `
    <div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">
      <div style="padding:14px 16px 10px">
        <div class="card-title" style="margin:0">🗺️ Müfredat Takımadası</div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Konuları çözdükçe sis dağılıyor</div>
      </div>
      <div style="position:relative;width:100%;touch-action:none" id="haritaWrap">
        <img src="map.png" id="haritaImg" style="width:100%;display:block;border-radius:0 0 18px 18px" 
             onload="haritaSisOlustur()" onerror="this.src='https://azizsengezer-byte.github.io/lgs-koc-takip/map.png'">
        <canvas id="haritaCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:0 0 18px 18px;pointer-events:none"></canvas>
        <div id="haritaTooltip" style="display:none;position:absolute;background:rgba(10,14,26,0.95);border:1px solid #2e3350;border-radius:10px;padding:8px 12px;font-size:11px;color:#e8eaf6;pointer-events:none;z-index:20;max-width:150px;text-align:center"></div>
      </div>

      <!-- Ders özeti -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:10px 14px 14px" id="haritaOzet"></div>
    </div>
  `;
}

// Ada koordinatları — orijinal görsel 1517x850 piksel
// Normalize edilmiş (0-1 arası)
const HARITA_ADALAR = [
  { id:'mat', ad:'Matematik',    renk:'#4ecdc4', cx:0.285, cy:0.48,  rx:0.13, ry:0.22 },
  { id:'fen', ad:'Fen Bilimleri',renk:'#45b7d1', cx:0.50,  cy:0.30,  rx:0.11, ry:0.20 },
  { id:'tur', ad:'Türkçe',       renk:'#ff6b6b', cx:0.70,  cy:0.50,  rx:0.11, ry:0.20 },
  { id:'ing', ad:'İngilizce',    renk:'#fd79a8', cx:0.255, cy:0.735, rx:0.10, ry:0.17 },
  { id:'ink', ad:'İnkılap',      renk:'#f9ca24', cx:0.50,  cy:0.80,  rx:0.12, ry:0.17 },
  { id:'din', ad:'Din Kültürü',  renk:'#a29bfe', cx:0.735, cy:0.78,  rx:0.10, ry:0.17 },
];

let _haritaAnimId = null;
let _haritaT = 0;

function haritaGetirVeri() {
  const myUid = (window.currentUserData||{}).uid || '';
  const soruEntries = studyEntries.filter(e =>
    e.type === 'soru' && (e.userId === myUid || e.studentName === (window.currentUserData||{}).name)
  );

  const dersMap = {
    'Matematik':    { renk:'#4ecdc4', id:'mat' },
    'Fen Bilimleri':{ renk:'#45b7d1', id:'fen' },
    'Türkçe':       { renk:'#ff6b6b', id:'tur' },
    'İngilizce':    { renk:'#fd79a8', id:'ing' },
    'İnkılap Tarihi':{ renk:'#f9ca24', id:'ink' },
    'Din Kültürü':  { renk:'#a29bfe', id:'din' },
  };

  const toplam = {
    'Matematik':14, 'Fen Bilimleri':12, 'Türkçe':7,
    'İngilizce':7, 'İnkılap Tarihi':5, 'Din Kültürü':10
  };

  const result = {};
  Object.keys(dersMap).forEach(ders => {
    const entries = soruEntries.filter(e => e.subject === ders);
    const toplamD = entries.reduce((a,e) => a+(e.correct||0),0);
    const toplamQ = entries.reduce((a,e) => a+(e.questions||0),0);
    const isabet = toplamQ > 0 ? Math.round(toplamD/toplamQ*100) : 0;

    // Tamamlanan: çözülen benzersiz gün sayısı / hedef (7 gün = %100)
    // Veya toplam soru / hedef soru sayısı
    const hedef = toplam[ders] * 20; // her konu için 20 soru hedefi
    const tamamlananPct = Math.min(1, toplamQ / Math.max(hedef, 1));
    const kazList = kazanimlar[ders] || [];
    const toplamKonu = kazList.length || toplam[ders] || 10;
    const tamamlanan = Math.round(tamamlananPct * toplamKonu);

    result[ders] = {
      ...dersMap[ders],
      ad: ders,
      toplamKonu,
      tamamlanan,
      isabet,
      toplamSoru: toplamQ,
    };
  });

  return result;
}

function haritaSisOlustur() {
  const img = document.getElementById('haritaImg');
  const canvas = document.getElementById('haritaCanvas');
  const wrap = document.getElementById('haritaWrap');
  if (!img || !canvas) return;

  canvas.width = img.offsetWidth;
  canvas.height = img.offsetHeight;

  const veri = haritaGetirVeri();
  haritaOzetGuncelle(veri);

  // Hover
  wrap.addEventListener('mousemove', (e) => haritaHover(e, veri));
  wrap.addEventListener('touchmove', (e) => {
    e.preventDefault();
    haritaHover(e.touches[0], veri);
  }, { passive: false });
  wrap.addEventListener('mouseleave', () => {
    document.getElementById('haritaTooltip').style.display = 'none';
  });

  // Animasyon döngüsü
  if (_haritaAnimId) cancelAnimationFrame(_haritaAnimId);
  function loop() {
    _haritaT++;
    haritaCiz(canvas, img, veri);
    _haritaAnimId = requestAnimationFrame(loop);
  }
  loop();
}

function haritaCiz(canvas, img, veri) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  HARITA_ADALAR.forEach(ada => {
    const dAdi = ada.ad === 'İnkılap' ? 'İnkılap Tarihi' : ada.ad;
    const d = veri[dAdi] || {};
    const pct = d.toplamKonu > 0 ? d.tamamlanan / d.toplamKonu : 0;
    const sisYog = Math.max(0, 1 - pct);
    if (sisYog < 0.04) return;

    const cx = ada.cx * W, cy = ada.cy * H;
    const rx = ada.rx * W, ry = ada.ry * H;
    const dusukIsabet = d.isabet > 0 && d.isabet < 65;
    const t = _haritaT;

    ctx.save();

    // Clip: sis sadece ada bölgesinde görünsün
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 1.05, ry * 1.05, 0, 0, Math.PI * 2);
    ctx.clip();

    // --- KATMAN 1: Koyu temel sis ---
    const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    const baseAlpha = sisYog * 0.52;
    const sisR = dusukIsabet ? '60,0,0' : '15,18,38';
    g1.addColorStop(0,   `rgba(${sisR},${baseAlpha})`);
    g1.addColorStop(0.6, `rgba(${sisR},${baseAlpha * 0.85})`);
    g1.addColorStop(1,   `rgba(${sisR},0)`);
    ctx.fillStyle = g1;
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);

    // --- KATMAN 2: Yüzen bulut topakları ---
    const bulutSayisi = 7;
    for (let j = 0; j < bulutSayisi; j++) {
      const speed1 = 0.004 + j * 0.0008;
      const speed2 = 0.003 + j * 0.0006;
      const baseAng = (j / bulutSayisi) * Math.PI * 2;
      const ang = baseAng + t * speed1;
      const wobble = Math.sin(t * 0.015 + j * 1.3) * 0.12;
      const orbitR = 0.28 + wobble;
      const bx = cx + Math.cos(ang) * rx * orbitR;
      const by = cy + Math.sin(ang) * ry * orbitR * 0.85;
      const br = rx * (0.32 + Math.sin(t * speed2 + j) * 0.05);
      const pulse = 0.18 + Math.sin(t * 0.022 + j * 0.9) * 0.06;

      const g2 = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      const bulutRenk = dusukIsabet ? '80,10,10' : '30,34,64';
      g2.addColorStop(0,   `rgba(${bulutRenk},${sisYog * pulse})`);
      g2.addColorStop(0.5, `rgba(${bulutRenk},${sisYog * pulse * 0.6})`);
      g2.addColorStop(1,   `rgba(${bulutRenk},0)`);
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- KATMAN 3: Sis akış dalgaları ---
    for (let j = 0; j < 3; j++) {
      const waveAng = t * 0.008 + j * (Math.PI * 2 / 3);
      const wx = cx + Math.cos(waveAng) * rx * 0.15;
      const wy = cy + Math.sin(waveAng) * ry * 0.15;
      const wR = rx * (0.55 + Math.sin(t * 0.012 + j * 2) * 0.08);
      const wAlpha = sisYog * (0.1 + Math.sin(t * 0.018 + j) * 0.04);
      const g3 = ctx.createRadialGradient(wx, wy, 0, wx, wy, wR);
      const wRenk = dusukIsabet ? '90,20,20' : '40,44,80';
      g3.addColorStop(0,   `rgba(${wRenk},${wAlpha})`);
      g3.addColorStop(1,   `rgba(${wRenk},0)`);
      ctx.fillStyle = g3;
      ctx.beginPath();
      ctx.arc(wx, wy, wR, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- KATMAN 4: Kenarlardaki yoğun sis halkası ---
    const edgeG = ctx.createRadialGradient(cx, cy, rx * 0.5, cx, cy, rx);
    const edgeAlpha = sisYog * (0.35 + Math.sin(t * 0.025) * 0.06);
    const edgeRenk = dusukIsabet ? '70,5,5' : '20,24,50';
    edgeG.addColorStop(0,   `rgba(${edgeRenk},0)`);
    edgeG.addColorStop(0.7, `rgba(${edgeRenk},${edgeAlpha * 0.5})`);
    edgeG.addColorStop(1,   `rgba(${edgeRenk},${edgeAlpha})`);
    ctx.fillStyle = edgeG;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // --- Kırmızı tehlike halkası (düşük isabet) ---
    if (dusukIsabet && sisYog > 0.15) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx + 2, ry + 2, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,40,40,${0.2 + Math.sin(t * 0.04) * 0.1})`;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }

    // --- Keşif parlaması (tamamen açılınca) ---
    if (pct >= 1) {
      ctx.save();
      const glowAlpha = 0.35 + Math.sin(t * 0.05) * 0.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx + 5, ry + 5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = ada.renk + Math.round(glowAlpha * 255).toString(16).padStart(2,'0');
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  });
}

function haritaHover(e, veri) {
  const wrap = document.getElementById('haritaWrap');
  const img = document.getElementById('haritaImg');
  const tt = document.getElementById('haritaTooltip');
  if (!wrap || !img || !tt) return;

  const rect = wrap.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const W = img.offsetWidth, H = img.offsetHeight;

  let hit = null;
  HARITA_ADALAR.forEach(ada => {
    const cx = ada.cx * W, cy = ada.cy * H;
    const rx = ada.rx * W, ry = ada.ry * H;
    const dx = (mx - cx) / rx, dy = (my - cy) / ry;
    if (dx * dx + dy * dy < 1) hit = ada;
  });

  if (hit) {
    const adAdi = hit.ad === 'İnkılap' ? 'İnkılap Tarihi' : hit.ad;
    const d = veri[adAdi] || {};
    const pct = d.toplamKonu > 0 ? Math.round(d.tamamlanan / d.toplamKonu * 100) : 0;
    tt.style.display = 'block';
    tt.style.left = Math.min(mx + 10, W - 160) + 'px';
    tt.style.top = Math.max(my - 70, 4) + 'px';
    tt.innerHTML = `
      <div style="font-weight:700;color:${hit.renk};margin-bottom:3px">${adAdi}</div>
      <div>${d.tamamlanan||0}/${d.toplamKonu||0} konu · %${pct}</div>
      <div style="color:#8b90b8;font-size:10px;margin-top:2px">
        ${d.isabet>0?'%'+d.isabet+' isabet':'Henüz çözülmedi'}
      </div>
      <div style="color:#8b90b8;font-size:10px">
        ${pct>=100?'✅ Tam keşfedildi!':pct>0?'🌫️ Sis dağılıyor...':'⬛ Keşfedilmedi'}
      </div>
    `;
  } else {
    tt.style.display = 'none';
  }
}

function haritaOzetGuncelle(veri) {
  const el = document.getElementById('haritaOzet');
  if (!el) return;
  const dersler = Object.values(veri);
  el.innerHTML = dersler.map(d => {
    const pct = d.toplamKonu > 0 ? Math.round(d.tamamlanan / d.toplamKonu * 100) : 0;
    const renk = pct >= 80 ? d.renk : pct >= 40 ? '#EF9F27' : '#888';
    return `
      <div style="background:var(--surface2);border-radius:8px;padding:7px;text-align:center">
        <div style="font-size:0.68rem;color:var(--text2);margin-bottom:2px">${d.ad.substring(0,7)}</div>
        <div style="font-size:0.9rem;font-weight:800;color:${renk}">${pct}%</div>
        <div style="font-size:0.62rem;color:var(--text2)">${d.tamamlanan}/${d.toplamKonu}</div>
      </div>
    `;
  }).join('');
}
