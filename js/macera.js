// macera.js — Görsel Koloni Üssü ve Günlükler
function maceraPage() {
  const data = loadColonyData();
  const level = data.level || 1;
  const chapters = getUnlockedChapters(level);
  const recentChapters = chapters.slice().reverse().slice(0, 3); // Son 3 hikaye

  // BİNALARIN GELİŞİM MANTIĞI
  // Seviyeye göre binanın hangi görsel aşamada olduğunu belirler
  const getStage = (currentLvl, unlockLvl) => {
    if (currentLvl < unlockLvl) return 0; // Kilitli
    if (currentLvl < unlockLvl + 8) return 1; // Başlangıç (Prefabrik/Çadır)
    if (currentLvl < unlockLvl + 18) return 2; // Gelişmiş (Bina)
    return 3; // Final (Teknoloji Üssü)
  };

  // Bina Görselleri (SVG Tasarımları)
  const drawBuilding = (type, stage) => {
    if (stage === 0) return `<div class="b-icon locked">🔒</div>`;
    
    // Her bina tipi ve aşaması için farklı ikon/görsel
    const icons = {
      komuta: ['⛺', '🏠', '🏢', '🏛️'],
      yasam:  ['🛖', '🏘️', '🏙️', '🏨'],
      lab:    ['🧪', '⚗️', '🔬', '🔭'],
      sera:   ['🌱', '🌿', '🌳', '🌴'],
      enerji: ['🔋', '🔌', '⚡', '☢️']
    };
    
    return `<div class="b-icon stage-${stage}">${icons[type][stage]}</div>`;
  };

  return `
    <style>
      .colony-container { background: #080a0f; min-height: 100vh; color: #fff; font-family: 'Nunito', sans-serif; }
      
      /* GÖRSEL ÜS ALANI (Şantiye) */
      .base-map {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;
        padding: 20px; background: radial-gradient(circle, #1a1f2c 0%, #080a0f 100%);
        border-bottom: 2px solid #242c3d; position: relative;
      }
      
      .building-slot {
        aspect-ratio: 1; background: rgba(255,255,255,0.03);
        border: 1px solid rgba(108, 99, 255, 0.2); border-radius: 12px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        transition: all 0.5s ease;
      }
      
      .b-icon { font-size: 32px; filter: drop-shadow(0 0 8px rgba(0,242,255,0.2)); }
      .b-icon.locked { opacity: 0.2; filter: grayscale(1); font-size: 20px; }
      .b-icon.stage-3 { filter: drop-shadow(0 0 15px #00f2ff); transform: scale(1.1); }
      
      .b-label { font-size: 9px; margin-top: 5px; color: #6c63ff; font-weight: 800; text-transform: uppercase; }

      /* HİKAYE GÜNLÜKLERİ */
      .logs-section { padding: 20px; }
      .log-card {
        background: #161922; border-left: 4px solid #6c63ff;
        padding: 15px; margin-bottom: 12px; border-radius: 4px;
      }
      .log-meta { font-size: 10px; color: #6c63ff; margin-bottom: 5px; font-weight: bold; }
      .log-title { font-size: 15px; font-weight: 700; margin-bottom: 5px; }
      .log-text { font-size: 13px; color: #a1a1aa; line-height: 1.5; }

      /* LEVEL BAR */
      .hud-bar { padding: 0 20px 20px; text-align: center; }
      .level-text { font-size: 18px; font-weight: 900; color: #00f2ff; }
    </style>

    <div class="colony-container">
      <div class="hud-bar">
        <div class="level-text">SEVİYE ${level}</div>
        <div style="font-size:10px; color:#555;">ARCADIA YERLEŞKESİ</div>
      </div>

      <div class="base-map">
        <div class="building-slot">
