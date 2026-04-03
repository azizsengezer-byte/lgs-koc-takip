// macera.js — Arcadia Kolonisi: Evrimsel Üs Sistemi

function maceraPage() {
  // 1. Veri Güvenliği: Eğer veri yoksa hata vermez, varsayılanı kullanır
  let data = { level: 1, xp: 0 };
  try {
    if (typeof loadColonyData === 'function') data = loadColonyData();
  } catch (e) { console.error("Veri yükleme hatası:", e); }

  const level = data.level || 1;

  // 2. Hikayeleri Güvenli Çekme
  let recentChapters = [];
  try {
    if (typeof COLONY_CHAPTERS !== 'undefined') {
      recentChapters = COLONY_CHAPTERS.filter(c => c.level <= level).slice().reverse().slice(0, 3);
    }
  } catch (e) { console.error("Hikaye hatası:", e); }

  // 3. Modül Evrim Tanımları
  const modules = [
    { id: 'komuta', name: 'Komuta Merkezi', color: '#6c63ff', thresholds: [1, 10, 25] },
    { id: 'yasam', name: 'Yaşam Modülü', color: '#ff6584', thresholds: [2, 12, 22] },
    { id: 'lab', name: 'Laboratuvar', color: '#43e97b', thresholds: [4, 15, 30] },
    { id: 'sera', name: 'Sera', color: '#ffa62d', thresholds: [7, 18, 35] }
  ];

  return `
    <style>
      .colony-container { background: #05070a; min-height: 100vh; font-family: 'Nunito', sans-serif; padding: 20px; color: #fff; }
      
      /* Üst Bilgi */
      .header-card {
        background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.3);
        padding: 15px; border-radius: 15px; display: flex; justify-content: space-between; margin-bottom: 20px;
      }
      .lvl-badge { font-size: 24px; font-weight: 900; text-shadow: 0 0 10px #6c63ff; }

      /* Üs Alanı */
      .base-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
      
      .b-card {
        background: #11141d; border-radius: 20px; padding: 20px 10px;
        border: 1px solid rgba(255,255,255,0.05); text-align: center; transition: 0.3s;
      }
      .b-card.locked { opacity: 0.15; filter: grayscale(1); }
      
      /* Görsel Alanı */
      .b-svg-wrap { height: 90px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 10px; }
      
      .b-name { font-size: 13px; font-weight: 800; margin-bottom: 2px; }
      .b-stage { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }

      /* Günlük Kaydı */
      .log-section { margin-top: 30px; }
      .log-card { 
        background: #11141d; padding: 15px; border-radius: 12px; margin-bottom: 10px;
        border-left: 3px solid #6c63ff;
      }
    </style>

    <div class="colony-container">
      <div class="header-card">
        <div><small style="color:#6c63ff">KOLONİ SEVİYESİ</small><br><span class="lvl-badge">${level}</span></div>
        <div style="text-align:right"><small style="color:#6c63ff">SİSTEM</small><br><span style="color:#43e97b; font-weight:800">ÇALIŞIYOR</span></div>
      </div>

      <div class="base-grid">
        ${modules.map(m => {
          const stage = m.thresholds.filter(t => level >= t).length; // 0, 1, 2 veya 3
          const isLocked = stage === 0;
          return `
            <div class="b-card ${isLocked ? 'locked' : ''}">
              <div class="b-svg-wrap">
                ${isLocked ? '<span style="font-size:24px">🔒</span>' : drawBuilding(m.id, stage, m.color)}
              </div>
              <div class="b-name">${m.name}</div>
              <div class="b-stage">${isLocked ? `Sv. ${m.thresholds[0]}` : 'AŞAMA ' + stage}</div>
            </div>`;
        }).join('')}
      </div>

      <div class="log-section">
        <h3 style="font-size:12px; color:#6c63ff; margin-bottom:15px">📡 SON VERİ KAYITLARI</h3>
        ${recentChapters.map(ch => `
          <div class="log-card">
            <div style="font-weight:800; font-size:14px">${ch.title}</div>
            <div style="font-size:12px; color:#94a3b8; margin-top:5px">${ch.text}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

// EVRİMSEL ÇİZİM MOTORU
function drawBuilding(id, stage, color) {
  // Sahne yüksekliği: 100, Genişlik: 100
  let content = "";
  
  if (id === 'komuta') {
    // Stage 1: Temel barınak
    content += `<rect x="30" y="60" width="40" height="30" fill="none" stroke="${color}" stroke-width="3" rx="2"/>`;
    // Stage 2: Üst kat ve anten
    if (stage >= 2) {
      content += `<rect x="35" y="40" width="30" height="20" fill="none" stroke="${color}" stroke-width="2" rx="1"/>`;
      content += `<path d="M50 40 L50 25 M45 30 L55 30" stroke="${color}" stroke-width="2"/>`;
    }
    // Stage 3: Yan kanatlar ve radar
    if (stage >= 3) {
      content += `<path d="M30 70 L15 85 M70 70 L85 85" stroke="${color}" stroke-width="2"/>`;
      content += `<circle cx="65" cy="25" r="5" fill="none" stroke="${color}" stroke-width="1.5"/>`;
    }
  } 
  
  else if (id === 'yasam') {
    content += `<path d="M25 90 Q50 40 75 90" fill="none" stroke="${color}" stroke-width="3"/>`;
    if (stage >= 2) {
      content += `<circle cx="50" cy="65" r="8" fill="none" stroke="${color}" stroke-width="2"/>`;
    }
    if (stage >= 3) {
      content += `<path d="M15 90 Q50 10 85 90" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4 2"/>`;
    }
  }

  else if (id === 'lab') {
    content += `<rect x="25" y="70" width="50" height="20" rx="10" fill="none" stroke="${color}" stroke-width="3"/>`;
    if (stage >= 2) content += `<path d="M50 70 L50 40 M40 40 L60 40" stroke="${color}" stroke-width="2"/>`;
    if (stage >= 3) content += `<circle cx="50" cy="35" r="10" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="2 1"/>`;
  }

  else { // Sera
    content += `<path d="M25 90 L25 70 Q50 50 75 70 L75 90" fill="none" stroke="${color}" stroke-width="3"/>`;
    if (stage >= 2) content += `<path d="M35 90 L35 70 M50 90 L50 60 M65 90 L65 70" stroke="${color}" stroke-width="1"/>`;
    if (stage >= 3) content += `<path d="M20 90 Q50 30 80 90" fill="none" stroke="${color}" stroke-width="2"/>`;
  }

  return `<svg viewBox="0 0 100 100" width="70">${content}</svg>`;
}
