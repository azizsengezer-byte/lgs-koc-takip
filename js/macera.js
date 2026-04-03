// macera.js — Koloni Günlükleri: Görsel Üs ve Hikaye Akışı
// Not: getBuildingSVG fonksiyonu binaların evrimini çizer.

function maceraPage() {
  const data = loadColonyData();
  const level = data.level || 1;
  const chapters = getUnlockedChapters(level);
  const recentChapters = chapters.slice().reverse().slice(0, 3); // Son 3 hikaye

  // Binaların Gelişim Aşamaları (Seviye ve Görsel Eşleşmesi)
  const modules = [
    { id: 'komuta', name: 'Komuta Merkezi', levels: [{ l: 1, type: 'basic' }, { l: 10, type: 'advanced' }, { l: 25, type: 'hq' }] },
    { id: 'yasam', name: 'Yaşam Modülü', levels: [{ l: 2, type: 'tent' }, { l: 14, type: 'habitat' }, { l: 22, type: 'dome' }] },
    { id: 'lab', name: 'Laboratuvar', levels: [{ l: 4, type: 'shack' }, { l: 16, type: 'complex' }, { l: 30, type: 'nexus' }] },
    { id: 'sera', name: 'Sera', levels: [{ l: 7, type: 'hydro' }, { l: 19, type: 'farm' }, { l: 40, type: 'biosphere' }] }
  ];

  return `
    <style>
      .base-builder { background: #080a0f; min-height: 100vh; font-family: 'Nunito', sans-serif; padding: 20px; color: #e2e8f0; }
      
      /* Üst Bilgi Barı */
      .base-stats {
        display: flex; justify-content: space-between; align-items: center;
        background: rgba(108, 99, 255, 0.1); padding: 15px; border-radius: 12px;
        border: 1px solid rgba(108, 99, 255, 0.2); margin-bottom: 20px;
      }
      .stat-item { text-align: center; }
      .stat-val { font-weight: 900; color: #fff; font-size: 18px; display: block; }
      .stat-lbl { font-size: 10px; color: #6c63ff; text-transform: uppercase; letter-spacing: 1px; }

      /* Üs Grid Sistemi */
      .base-grid { 
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;
        background: radial-gradient(circle at center, #111827 0%, #080a0f 100%);
        padding: 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);
        box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
      }

      /* Bina Kartı */
      .building-slot { 
        text-align: center; position: relative;
        background: rgba(16, 22, 34, 0.6); border: 1px solid rgba(108, 99, 255, 0.1);
        padding: 20px 10px; border-radius: 15px; transition: all 0.3s ease;
      }
      
      .building-slot.locked { opacity: 0.2; filter: grayscale(1); border-style: dashed; }
      .building-slot:not(.locked):hover { 
        border-color: #6c63ff; background: rgba(108, 99, 255, 0.1); 
        transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.3);
      }

      .building-visual { 
        width: 100%; height: 80px; margin-bottom: 12px; 
        display: flex; align-items: center; justify-content: center;
      }
      
      .building-name { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 4px; }
      .building-status { font-size: 9px; color: #8891a5; text-transform: uppercase; letter-spacing: 0.5px; }

      /* Hikaye Bölümü */
      .story-section { margin-top: 30px; }
      .story-header { 
        font-size: 11px; color: #6c63ff; font-weight: 900; 
        margin-bottom: 15px; letter-spacing: 2px; border-bottom: 1px solid #1e2230; padding-bottom: 8px;
      }
      .story-log {
        background: rgba(22, 25, 34, 0.5); border-left: 3px solid #6c63ff;
        padding: 15px; margin-bottom: 12px; border-radius: 4px;
        animation: fadeIn 0.5s ease;
      }
      @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      .log-t { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 5px; }
      .log-txt { font-size: 13px; color: #94a3b8; line-height: 1.5; }
    </style>

    <div class="base-builder">
      <div class="base-stats">
        <div class="stat-item">
            <span class="stat-lbl">Koloni Seviyesi</span>
            <span class="stat-val">${level}</span>
        </div>
        <div class="stat-item">
            <span class="stat-lbl">Enerji Durumu</span>
            <span class="stat-val" style="color:#43e97b">STABİL</span>
        </div>
      </div>

      <div class="base-grid">
        ${modules.map(mod => {
          const currentStage = mod.levels.slice().reverse().find(stage => level >= stage.l);
          const isLocked = !currentStage;
          
          return `
            <div class="building-slot ${isLocked ? 'locked' : ''}">
              <div class="building-visual">
                ${isLocked ? '<span style="font-size:24px">🔒</span>' : getBuildingSVG(mod.id, currentStage.type)}
              </div>
              <div class="building-name">${mod.name}</div>
              <div class="building-status">
                ${isLocked ? `Seviye ${mod.levels[0].l}` : currentStage.type}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="story-section">
        <div class="story-header">📡 SON SİNYAL KAYITLARI</div>
        ${recentChapters.map(ch => `
          <div class="story-log">
            <div class="log-t">${ch.title}</div>
            <div class="log-txt">${ch.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Binaları Seviyeye Göre Çizen Fonksiyon
function getBuildingSVG(id, type) {
  const colors = { komuta: '#6c63ff', yasam: '#ff6584', lab: '#43e97b', sera: '#ffa62d' };
  const color = colors[id] || '#fff';

  if (id === 'komuta') {
    if (type === 'basic') return `<svg viewBox="0 0 100 100" width="60"><rect x="30" y="45" width="40" height="35" fill="none" stroke="${color}" stroke-width="3" rx="2"/></svg>`;
    if (type === 'advanced') return `<svg viewBox="0 0 100 100" width="60"><rect x="25" y="45" width="50" height="35" fill="none" stroke="${color}" stroke-width="3" rx="4"/><path d="M40 25 L60 25 L70 45 L30 45 Z" fill="none" stroke="${color}" stroke-width="2"/></svg>`;
    return `<svg viewBox="0 0 100 100" width="60"><rect x="20" y="45" width="60" height="40" fill="none" stroke="${color}" stroke-width="3" rx="5"/><circle cx="50" cy="30" r="15" fill="none" stroke="${color}" stroke-width="3"/><path d="M50 15 L50 45 M35 30 L65 30" stroke="${color}" stroke-width="2"/></svg>`;
  }

  if (id === 'yasam') {
    if (type === 'tent') return `<svg viewBox="0 0 100 100" width="60"><path d="M20 80 L50 30 L80 80 Z" fill="none" stroke="${color}" stroke-width="3"/></svg>`;
    return `<svg viewBox="0 0 100 100" width="60"><path d="M20 80 Q50 10 80 80" fill="none" stroke="${color}" stroke-width="3"/><rect x="40" y="60" width="20" height="20" fill="none" stroke="${color}" stroke-width="2"/></svg>`;
  }

  if (id === 'lab') {
    if (type === 'shack
