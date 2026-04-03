function maceraPage() {
  const data = loadColonyData();
  const level = data.level || 1;

  // Binaların Gelişim Aşamaları (Seviye Kontrolü)
  // Buradaki sayıları (l:5, l:15 vb.) test panelinden hızlıca değiştirebilirsin
  const modules = [
    { id: 'komuta', name: 'Komuta Merkezi', levels: [{ l: 1, type: 'basic' }, { l: 10, type: 'advanced' }, { l: 25, type: 'hq' }] },
    { id: 'yasam', name: 'Yaşam Modülü', levels: [{ l: 3, type: 'tent' }, { l: 15, type: 'habitat' }, { l: 30, type: 'dome' }] },
    { id: 'lab', name: 'Laboratuvar', levels: [{ l: 7, type: 'shack' }, { l: 20, type: 'complex' }, { l: 40, type: 'nexus' }] },
    { id: 'sera', name: 'Sera', levels: [{ l: 12, type: 'hydro' }, { l: 28, type: 'farm' }, { l: 50, type: 'biosphere' }] }
  ];

  return `
    <style>
      .base-builder { background: #080a0f; min-height: 100vh; font-family: 'Nunito', sans-serif; padding: 20px; }
      
      /* Üs Grid Sistemi */
      .base-grid { 
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
        background: radial-gradient(circle at center, #111 0%, #080a0f 100%);
        padding: 30px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);
      }

      /* Bina Konteyneri */
      .building-slot { 
        text-align: center; position: relative;
        background: rgba(16, 22, 34, 0.4); border: 1px solid rgba(108, 99, 255, 0.1);
        padding: 15px; border-radius: 8px; transition: 0.3s;
      }
      
      .building-slot.locked { opacity: 0.3; filter: grayscale(1); border-style: dashed; }
      .building-slot:not(.locked):hover { border-color: var(--accent); background: rgba(108, 99, 255, 0.05); }

      /* Bina Görselleri (SVG Kodları - lottie.js gerekmez, saf CSS/SVG) */
      .building-visual { 
        width: 100%; height: 100px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;
      }
      
      /* Örnek SVG Binalar (Ben senin için derme çatma çizdim, sen bunları görsellerle değiştirebilirsin) */
      .komuta-basic { fill: #333; stroke: #555; }
      .komuta-advanced { fill: #1a3050; stroke: var(--accent); }
      .komuta-hq { fill: #1a3050; stroke: var(--accent); filter: drop-shadow(0 0 10px var(--accent)); }
      
      .building-name { font-size: 14px; font-weight: 800; color: #fff; }
      .building-status { font-size: 10px; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; }

    </style>

    <div class="base-builder">
      <div class="base-grid">
        ${modules.map(mod => {
          // Bu bina şu an hangi aşamada?
          const currentStage = mod.levels.slice().reverse().find(stage => level >= stage.l);
          const isLocked = !currentStage;
          
          return `
            <div class="building-slot ${isLocked ? 'locked' : ''}">
              <div class="building-visual">
                ${isLocked ? '🔒' : getBuildingSVG(mod.id, currentStage.type)}
              </div>
              <div class="building-name">${mod.name}</div>
              <div class="building-status">
                ${isLocked ? `Sv. ${mod.levels[0].l}'de Açılır` : `Aşama: ${currentStage.type.toUpperCase()}`}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Binaların SVG Çizimlerini Döndüren Fonksiyon (Bunu da macera.js'in altına ekle)
function getBuildingSVG(id, type) {
  // Örnek: Komuta Merkezi'nin 3 aşaması
  if (id === 'komuta') {
    if (type === 'basic') return `<svg viewBox="0 0 100 100"><rect x="30" y="40" width="40" height="40" class="komuta-basic"/></svg>`;
    if (type === 'advanced') return `<svg viewBox="0 0 100 100"><rect x="30" y="40" width="40" height="40" class="komuta-advanced"/><rect x="40" y="20" width="20" height="20" class="komuta-advanced"/></svg>`;
    if (type === 'hq') return `<svg viewBox="0 0 100 100"><rect x="30" y="40" width="40" height="40" class="komuta-hq"/><rect x="40" y="20" width="20" height="20" class="komuta-hq"/><circle cx="50" cy="50" r="10" fill="var(--accent)" /></svg>`;
  }
  
  // Diğer binalar (yasam, lab, sera) için de benzer SVG'ler ekleyebiliriz.
  // Eğer görsellerin varsa, buraya <img src="${id}_${type}.png" /> yazabilirsin.
  
  return '🏗️'; // Geçici ikon
}
