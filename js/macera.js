function maceraPage() {
  const data = loadColonyData();
  const level = data.level || 1;
  const chapters = getUnlockedChapters(level);
  const recentChapters = chapters.slice().reverse().slice(0, 3);

  // Binaların 3D İzometrik Çizimleri (Saf CSS)
  const render3DBuilding = (type, unlockLvl) => {
    if (level < unlockLvl) return `<div class="slot locked"><div class="lock-icon">🔒</div><div class="lvl-tag">Sv. ${unlockLvl}</div></div>`;
    
    // Seviyeye göre binanın yüksekliği ve detayı artar (3 Aşamalı Gelişim)
    let stage = 1;
    if (level >= unlockLvl + 10) stage = 2;
    if (level >= unlockLvl + 20) stage = 3;

    return `
      <div class="slot active">
        <div class="iso-building stage-${stage} type-${type}">
          <div class="side face-top"></div>
          <div class="side face-left"></div>
          <div class="side face-right"></div>
          ${stage > 1 ? '<div class="antenna"></div>' : ''}
          ${stage > 2 ? '<div class="glow-ring"></div>' : ''}
        </div>
        <div class="building-name">${type.toUpperCase()}</div>
      </div>
    `;
  };

  return `
    <style>
      .colony-3d-wrap { background: #05070a; min-height: 100vh; padding: 20px; color: #fff; font-family: 'Nunito', sans-serif; }
      
      /* İZOMETRİK HARİTA ALANI */
      .iso-map {
        height: 350px; position: relative;
        background: radial-gradient(circle at center, #1a1f2c 0%, #05070a 100%);
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        perspective: 1000px; padding: 40px 20px; border-radius: 30px;
        border: 1px solid rgba(108, 99, 255, 0.2); margin-bottom: 20px;
      }

      /* 3D KÜP MANTIĞI */
      .slot { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 120px; }
      
      .iso-building {
        position: relative; width: 50px; transform-style: preserve-3d;
        transform: rotateX(-30deg) rotateY(45deg); transition: all 1s ease;
      }

      .side { position: absolute; background: rgba(108, 99, 255, 0.8); border: 1px solid rgba(255,255,255,0.2); }
      
      /* AŞAMA 1: Küçük Modül */
      .stage-1 { height: 30px; }
      .stage-1 .face-top { width: 50px; height: 50px; top: -50px; transform: rotateX(90deg) translateZ(25px); background: #2a2e3e; }
      .stage-1 .face-left { width: 50px; height: 30px; left: -25px; transform: rotateY(-90deg); background: #1e2230; }
      .stage-1 .face-right { width: 50px; height: 30px; right: -25px; background: #161922; }

      /* AŞAMA 2: Orta Boy Bina */
      .stage-2 { height: 60px; }
      .stage-2 .face-top { width: 50px; height: 50px; top: -50px; transform: rotateX(90deg) translateZ(25px); background: #3d44db; }
      .stage-2 .face-left { width: 50px; height: 60px; left: -25px; transform: rotateY(-90deg); background: #2a2e3e; }
      .stage-2 .face-right { width: 50px; height: 60px; right: -25px; background: #1e2230; }

      /* AŞAMA 3: Devasa Teknoloji Kulesi */
      .stage-3 { height: 100px; }
      .stage-3 .face-top { width: 50px; height: 50px; top: -50px; transform: rotateX(90deg) translateZ(25px); background: #00f2ff; box-shadow: 0 0 20px #00f2ff; }
      .stage-3 .face-left { width: 50px; height: 100px; left: -25px; transform: rotateY(-90deg); background: #1a1f2c; border-left: 4px solid #00f2ff; }
      .stage-3 .face-right { width: 50px; height: 100px; right: -25px; background: #0f1218; }

      /* Detaylar */
      .antenna { position: absolute; top: -80px; left: 23px; width: 2px; height: 40px; background: #ff2d55; box-shadow: 0 0 10px #ff2d55; }
      .building-name { margin-top: 15px; font-size: 10px; font-weight: 900; color: #6c63ff; letter-spacing: 1px; }
      .locked { opacity: 0.1; }
      .lvl-tag { font-size: 9px; color: #444; margin-top: 5px; }

      /* Günlükler Alt Bölüm */
      .story-scroll { padding: 0 10px; }
      .story-mini-card { background: #11141d; padding: 12px; border-radius: 8px; border-left: 3px solid #00f2ff; margin-bottom: 10px; }
    </style>

    <div class="colony-3d-wrap">
      <div style="text-align:center; padding:10px;">
        <h2 style="font-size:14px; letter-spacing:3px; color:#00f2ff;">ARCADIA_SECTOR_01</h2>
        <p style="font-size:10px; color:#444;">Mevcut Seviye: ${level}</p>
      </div>

      <div class="iso-map">
        ${render3DBuilding('komuta', 1)}
        ${render3DBuilding('yasam', 3)}
        ${render3DBuilding('lab', 7)}
        ${render3DBuilding('sera', 12)}
        ${render3DBuilding('enerji', 18)}
        ${render3DBuilding('uydu', 25)}
      </div>

      <div class="story-scroll">
        <div style="font-size:11px; color:#333; margin-bottom:10px;">SON İSTİHBARAT</div>
        ${recentChapters.map(ch => `
          <div class="story-mini-card">
            <div style="font-size:10px; color:#6c63ff;">SV.${ch.level} KAYDI</div>
            <div style="font-size:13px; font-weight:bold;">${ch.title}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
