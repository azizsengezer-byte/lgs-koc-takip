// macera.js — 3D İzometrik Koloni Ekranı
function maceraPage() {
    let data;
    try {
        data = loadColonyData();
    } catch(e) {
        data = { level: 1, xp: 0 };
    }
    
    const level = data.level || 1;
    const chapters = typeof getUnlockedChapters === 'function' ? getUnlockedChapters(level) : [];
    const recentChapters = chapters.slice().reverse().slice(0, 3);

    // Binaları 3D (Isometric) Çizen Fonksiyon
    const renderBuilding = (name, unlockLvl) => {
        const isLocked = level < unlockLvl;
        let stage = 0;
        if (!isLocked) {
            stage = 1;
            if (level >= unlockLvl + 10) stage = 2;
            if (level >= unlockLvl + 20) stage = 3;
        }

        return `
            <div class="iso-slot ${isLocked ? 'locked' : ''}">
                <div class="building-3d stage-${stage}">
                    <div class="f face-t"></div>
                    <div class="f face-l"></div>
                    <div class="f face-r"></div>
                    ${stage === 3 ? '<div class="antenna"></div>' : ''}
                </div>
                <div class="iso-label">${name} ${isLocked ? `(Sv.${unlockLvl})` : ''}</div>
            </div>
        `;
    };

    return `
    <style>
        .colony-3d-bg { background: #05070a; min-height: 100vh; color: #fff; font-family: 'Nunito', sans-serif; padding: 20px; }
        
        /* İzometrik Grid */
        .iso-grid { 
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px 20px; 
            padding: 60px 10px; perspective: 1000px;
            background: radial-gradient(circle at center, #1a1f2c 0%, #05070a 100%);
            border-radius: 24px; border: 1px solid #242c3d; margin-bottom: 30px;
        }

        .iso-slot { position: relative; display: flex; flex-direction: column; align-items: center; }
        
        /* 3D Küp CSS */
        .building-3d { 
            position: relative; width: 60px; transform-style: preserve-3d;
            transform: rotateX(-30deg) rotateY(45deg); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .f { position: absolute; border: 1px solid rgba(255,255,255,0.1); }
        
        /* Boyutlar (Stage'e göre uzayan binalar) */
        .stage-1 { height: 40px; }
        .stage-2 { height: 70px; }
        .stage-3 { height: 110px; }

        .face-t { width: 60px; height: 60px; top: -60px; transform: rotateX(90deg) translateZ(30px); background: #3d44db; }
        .face-l { width: 60px; height: 100%; left: -30px; transform: rotateY(-90deg); background: #2a2e3e; }
        .face-r { width: 60px; height: 100%; right: -30px; background: #161922; }

        /* Stage Renkleri */
        .stage-3 .face-t { background: #00f2ff; box-shadow: 0 0 25px #00f2ff; }
        .stage-3 .face-l { border-left: 5px solid #00f2ff; }
        
        .antenna { position: absolute; top: -90px; left: 28px; width: 3px; height: 50px; background: #ff2d55; box-shadow: 0 0 15px #ff2d55; }
        .iso-label { margin-top: 20px; font-size: 11px; font-weight: 800; color: #6c63ff; letter-spacing: 1px; }
        .locked { opacity: 0.15; filter: grayscale(1); }

        /* Hikaye Kartları */
        .story-mini { background: #11141d; padding: 15px; border-radius: 12px; margin-bottom: 10px; border-left: 4px solid #6c63ff; }
    </style>

    <div class="colony-3d-bg">
        <div style="text-align:center; margin-bottom:20px;">
            <div style="font-size:24px; font-weight:900; color:#00f2ff;">ARCADIA ÜSSÜ</div>
            <div style="font-size:12px; color:#444;">SEVİYE ${level} VERİ AKIŞI</div>
        </div>

        <div class="iso-grid">
            ${renderBuilding('KOMUTA', 1)}
            ${renderBuilding('LAB', 4)}
            ${renderBuilding('SERA', 7)}
            ${renderBuilding('ENERJİ', 14)}
        </div>

        <div class="story-area">
            <h3 style="font-size:14px; margin-bottom:15px; color:#555;">SON KAYITLAR</h3>
            ${recentChapters.map(ch => `
                <div class="story-mini">
                    <div style="font-size:10px; color:#6c63ff;">BÖLÜM ${ch.level}</div>
                    <div style="font-size:14px; font-weight:700;">${ch.title}</div>
                </div>
            `).join('')}
        </div>
    </div>
    `;
}
