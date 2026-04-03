// macera.js içindeki görsel alan (Scene) kısmını bu tasarımla değiştirebilirsin
function buildVisualBase(level) {
  // Binaların hangi seviyede evrim geçireceği
  const getStage = (unlockLvl) => {
    if (level < unlockLvl) return 'locked';
    if (level < unlockLvl + 7) return 'lvl1'; // İlk hali
    if (level < unlockLvl + 15) return 'lvl2'; // Gelişmiş
    return 'lvl3'; // Efsane hali
  };

  return `
    <style>
      .colony-map {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        background: url('https://www.transparenttextures.com/patterns/carbon-fibre.png'), #0a0c10;
        padding: 20px; border-radius: 20px; margin: 15px;
        border: 1px solid rgba(108, 99, 255, 0.3);
        box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
      }
      .building {
        aspect-ratio: 1; display: flex; flex-direction: column;
        align-items: center; justify-content: center; position: relative;
        transition: all 0.5s ease;
      }
      /* Bina Görselleri (Emoji yerine gerçek SVG veya PNG koyabilirsin) */
      .b-img { font-size: 40px; filter: drop-shadow(0 0 5px var(--accent)); }
      .locked { opacity: 0.2; filter: grayscale(1); }
      .stage-label { font-size: 8px; color: var(--accent); margin-top: 5px; font-family: monospace; }
    </style>

    <div class="colony-map">
      <div class="building ${getStage(1)}">
        <div class="b-img">${level < 10 ? '⛺' : level < 20 ? '🏠' : '🏢'}</div>
        <div class="stage-label">KOMUTA</div>
      </div>
      
      <div class="building ${getStage(4)}">
        <div class="b-img">${level < 4 ? '🔒' : level < 15 ? '🧪' : '🔬'}</div>
        <div class="stage-label">LAB</div>
      </div>

      <div class="building ${getStage(7)}">
        <div class="b-img">${level < 7 ? '🔒' : level < 18 ? '🌱' : '🌳'}</div>
        <div class="stage-label">SERA</div>
      </div>
      
      <div class="building ${getStage(14)}">
        <div class="b-img">${level < 14 ? '🔒' : '⚡'}</div>
        <div class="stage-label">ENERJİ</div>
      </div>
    </div>
  `;
}
