// macera.js — Koloni Günlükleri: Dinamik Üs İnşaatı

function maceraPage() {
  const data = loadColonyData();
  const level = data.level || 1;
  
  // Hikaye verilerini colony_story.js'den çekiyoruz
  const chapters = typeof COLONY_CHAPTERS !== 'undefined' ? COLONY_CHAPTERS.filter(c => c.level <= level) : [];
  const recentChapters = chapters.slice().reverse().slice(0, 3);

  // Modül tanımları ve evrim eşikleri
  const modules = [
    { id: 'komuta', name: 'Komuta Merkezi', levels: [{ l: 1, type: 'basic' }, { l: 10, type: 'advanced' }, { l: 25, type: 'hq' }] },
    { id: 'yasam', name: 'Yaşam Modülü', levels: [{ l: 2, type: 'tent' }, { l: 14, type: 'habitat' }, { l: 22, type: 'dome' }] },
    { id: 'lab', name: 'Laboratuvar', levels: [{ l: 4, type: 'shack' }, { l: 16, type: 'complex' }, { l: 30, type: 'nexus' }] },
    { id: 'sera', name: 'Sera', levels: [{ l: 7, type: 'hydro' }, { l: 19, type: 'farm' }, { l: 40, type: 'biosphere' }] }
  ];

  return `
    <style>
      .base-builder { background: #05070a; min-height: 100vh; font-family: 'Nunito', sans-serif; padding: 20px; color: #e2e8f0; }
      
      /* Üst Panel */
      .base-stats {
        display: flex; justify-content: space-between; align-items: center;
        background: rgba(108, 99, 255, 0.1); padding: 15px; border-radius: 12px;
        border: 1px solid rgba(108, 99, 255, 0.3); margin-bottom: 25px;
        box-shadow: 0 0 20px rgba(108, 99, 255, 0.1);
      }
      .stat-val { font-weight: 900; color: #fff; font-size: 22px; text-shadow: 0 0 10px #6c63ff; }
      .stat-lbl { font-size: 10px; color: #6c63ff; text-transform: uppercase; letter-spacing: 2px; }

      /* Üs Alanı */
      .base-grid { 
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
        perspective: 1000px;
      }

      .building-slot { 
        text-align: center; position: relative;
        background: #11141d; border: 1px solid rgba(255,255,255,0.05);
        padding: 25px 10px; border-radius: 24px; transition: 0.4s;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      
      .building-slot:not(.locked) {
        border-bottom: 3px solid var(--b-color);
      }

      .building-slot.locked { opacity: 0.15; filter: grayscale(1) blur(1px); transform: scale(0.9); }

      /* Bina Animasyonu */
      .building-visual { 
        width: 100%; height: 100px; margin-bottom: 15px; 
        display: flex; align-items: flex-end; justify-content: center;
      }
      
      .building-name { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 4px; }
      .building-status { font-size: 10px; color: #64748b; font-weight: bold; }

      /* Alt Hikaye Akışı */
      .story-section { margin-top: 40px; }
      .story-header { font-size: 12px; color: #6c63ff; font-weight: 900; margin-bottom: 15px; padding-left: 5px; }
      .story-log {
        background: #11141d; border-radius: 16px; padding: 18px; margin-bottom: 12px;
        border-left: 4px solid #6c63ff; position: relative;
      }
      .log-t { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 6px; }
      .log-txt { font-size: 13px; color: #94a3b8; line-height: 1.6; }
    </style>

    <div class="base-builder">
      <div class="base-stats">
        <div><span class="stat-lbl">KOLONİ SEVİYESİ</span><span class="stat-val">${level}</span></div>
        <div style="text-align:right"><span class="stat-lbl">DURUM</span><span class="stat-val" style="color:#43e97b">AKTİF</span></div>
      </div>

      <div class="base-grid">
        ${modules.map(mod => {
          const currentStage = mod.levels.slice().reverse().find(stage => level >= stage.l);
          const isLocked = !currentStage;
          const colors = { komuta: '#6c63ff', yasam: '#ff6584', lab: '#43e97b', sera: '#ffa62d' };
          const bColor = colors[mod.id];
          
          return `
            <div class="building-slot ${isLocked ? 'locked' : ''}" style="--b-color: ${bColor}">
              <div class="building-visual">
                ${isLocked ? '<span style="font-size:30px">🔒</span>' : getEvolutionSVG(mod.id, currentStage.type, bColor)}
              </div>
              <div class="building-name">${mod.name}</div>
              <div class="building-status">${isLocked ? `Sv. ${mod.levels[0].l}` : currentStage.type.toUpperCase()}</div>
            </div>`;
        }).join('')}
      </div>

      <div class="story-section">
        <div class="story-header">> SİSTEM KAYITLARI</div>
        ${recentChapters.map(ch => `
          <div class="story-log">
            <div class
