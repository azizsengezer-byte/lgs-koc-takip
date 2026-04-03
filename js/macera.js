// macera.js — Koloni Günlükleri: Ana Sayfa
// Görsel sahne, hikaye bölümleri, wellness girişi, modül detayları

function maceraPage() {
  const data = loadColonyData();
  const level = data.level || 1;
  const xpProg = getXpProgress(data.xp, level);
  const levelInfo = getColonyLevelInfo(level);
  const activeModules = getActiveModules(level);
  const nextMod = getNextModule(level);
  const chapters = getUnlockedChapters(level);
  const nextChapter = getNextLockedChapter(level);
  const today = getTodayKey();
  const alreadyEntered = data.lastEntryDate === today;

  const moduleSVGs = _buildModuleSVGs(activeModules, level);
  const recentChapters = chapters.slice().reverse().slice(0, 4);
  const newestId = recentChapters[0]?.id;
  const lockedHints = COLONY_CHAPTERS.filter(c => c.level > level).slice(0, 2);
  const streakText = data.currentStreak > 0 ? data.currentStreak + ' gün seri' : '';

  return `
    <div class="colony-wrap">
      <div class="colony-scene" id="colonyScene">
        <div class="colony-stars" id="colonyStars"></div>
        <div class="colony-hud">
          <div>
            <div style="font-size:18px;font-weight:500;color:white;text-shadow:0 1px 8px rgba(0,0,0,0.5)">Seviye ${level}</div>
            <div style="font-size:10px;color:rgba(180,210,255,0.6);margin-top:2px;letter-spacing:0.5px">${(data.colonyName || 'ARCADIA').toUpperCase()} KOLONİSİ</div>
            <div style="display:flex;gap:5px;margin-top:8px;flex-wrap:wrap">
              ${streakText ? `<span style="font-size:10px;padding:3px 8px;border-radius:12px;background:rgba(29,158,117,0.25);color:#5DCAA5;border:0.5px solid rgba(93,202,165,0.3)">${streakText}</span>` : ''}
              ${data.honestyShield ? '<span style="font-size:10px;padding:3px 8px;border-radius:12px;background:rgba(55,138,221,0.2);color:#85B7EB;border:0.5px solid rgba(133,183,235,0.3)">dürüstlük kalkanı</span>' : ''}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10px;color:rgba(255,255,255,0.4)">Gün ${data.totalDays || 0}</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.25);margin-top:2px">${levelInfo.title}</div>
          </div>
        </div>
        <div class="colony-ground"></div>
        <div class="colony-modules">${moduleSVGs}</div>
      </div>

      <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border)">
        <span style="font-size:12px;font-weight:700;color:var(--text2);min-width:36px">Sv.${level}</span>
        <div style="flex:1;height:6px;background:var(--surface2);border-radius:3px;overflow:hidden">
          <div id="colonyXpBar" style="height:100%;border-radius:3px;background:linear-gradient(90deg,#185FA5,#378ADD);width:0%;transition:width 0.8s ease"></div>
        </div>
        <span style="font-size:11px;color:var(--text2);min-width:80px;text-align:right">${xpProg.current} / ${xpProg.needed} XP</span>
      </div>

      <div style="display:flex;gap:6px;padding:12px 16px">
        <div class="colony-stat"><div class="colony-stat-v">${data.currentStreak || 0}</div><div class="colony-stat-l">Giriş serisi</div></div>
        <div class="colony-stat"><div class="colony-stat-v">${activeModules.length}</div><div class="colony-stat-l">Aktif modül</div></div>
        <div class="colony-stat"><div class="colony-stat-v">${chapters.length}</div><div class="colony-stat-l">Bölüm</div></div>
        <div class="colony-stat"><div class="colony-stat-v">${data.totalDays || 0}</div><div class="colony-stat-l">Toplam gün</div></div>
      </div>

      ${alreadyEntered ? `
        <div style="margin:4px 16px 12px;padding:12px 14px;background:rgba(29,158,117,0.08);border:1px solid rgba(29,158,117,0.2);border-radius:12px;text-align:center">
          <span style="font-size:13px;color:var(--accent3);font-weight:700">✓ Bugünkü giriş tamamlandı</span>
          <div style="font-size:11px;color:var(--text2);margin-top:4px">Yarın tekrar gel — kolonin seni bekliyor</div>
        </div>
      ` : `
        <button onclick="_colonyOpenEntry()" style="display:block;width:calc(100% - 32px);margin:4px 16px 12px;padding:13px;background:linear-gradient(135deg,#185FA5,#378ADD);color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">
          Bugünkü durumunu gir → +${COLONY_XP_RULES.wellnessEntry} XP
        </button>
      `}

      <div id="colonyEntryPanel" style="display:none;padding:0 16px 12px">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px">
          <div style="font-size:14px;font-weight:700;margin-bottom:12px">Bugün nasıl hissediyorsun?</div>
          <div id="colonyMoodBtns" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
            ${['Enerjik','Sakin','Kaygılı','Yorgun','Motivasyonsuz','Kararlı','Üzgün','Heyecanlı'].map(m =>
              `<button onclick="_colonyPickMood(this,'${m.toLowerCase()}')" data-mood="${m.toLowerCase()}"
                style="padding:7px 13px;border-radius:16px;border:1.5px solid var(--border);background:var(--surface);font-size:12px;cursor:pointer;color:var(--text);font-family:'Nunito',sans-serif;font-weight:600;transition:all 0.15s">${m}</button>`
            ).join('')}
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <span style="font-size:12px;color:var(--text2);min-width:55px">Kaygı</span>
            <input type="range" min="1" max="10" value="4" id="colonyAnxiety" oninput="document.getElementById('colonyAnxVal').textContent=this.value" style="flex:1;accent-color:var(--accent)">
            <span id="colonyAnxVal" style="font-size:13px;font-weight:700;min-width:16px;text-align:right">4</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
            <span style="font-size:12px;color:var(--text2);min-width:55px">Uyku</span>
            <input type="range" min="3" max="12" value="7" step="0.5" id="colonySleep" oninput="document.getElementById('colonySleepVal').textContent=Math.round(this.value*10)/10+' saat'" style="flex:1;accent-color:var(--accent)">
            <span id="colonySleepVal" style="font-size:13px;font-weight:700;min-width:50px;text-align:right">7 saat</span>
          </div>
          <button onclick="_colonySubmitEntry()" style="width:100%;padding:12px;background:linear-gradient(135deg,#0F6E56,#1D9E75);color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">
            Kaydet ve XP Kazan
          </button>
        </div>
      </div>

      <div style="padding:4px 16px 16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <span style="font-size:13px;font-weight:700;color:var(--text2)">Koloni Günlükleri</span>
          <span style="font-size:11px;color:var(--text2)">${chapters.length} / ${COLONY_CHAPTERS.length} bölüm</span>
        </div>

        ${recentChapters.map(ch => `
          <div class="colony-entry" onclick="_colonyToggleChapter(this)" data-id="${ch.id}">
            ${ch.id === newestId ? '<span style="position:absolute;top:10px;right:10px;font-size:9px;padding:2px 7px;border-radius:10px;background:rgba(55,138,221,0.15);color:#378ADD;font-weight:700">Yeni</span>' : ''}
            <div style="font-size:10px;color:var(--text2);margin-bottom:3px">Bölüm ${ch.level} — ${getColonyLevelInfo(ch.level)?.title || ''}</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:4px">${ch.title}</div>
            <div class="colony-chapter-text" style="max-height:${ch.id === newestId ? '300' : '0'}px;overflow:hidden;transition:max-height 0.35s ease">
              <div style="font-size:12px;color:var(--text2);line-height:1.7;padding-top:4px">${ch.text}</div>
              ${ch.nextHint ? `<div style="font-size:11px;color:var(--accent);margin-top:8px;font-style:italic">→ ${ch.nextHint}</div>` : ''}
            </div>
          </div>
        `).join('')}

        ${chapters.length > 4 ? `
          <button onclick="_colonyShowAllChapters()" style="width:100%;padding:10px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--accent);font-size:12px;font-weight:700;cursor:pointer;margin-bottom:8px;font-family:'Nunito',sans-serif">
            Tüm bölümleri gör (${chapters.length})
          </button>
        ` : ''}

        ${lockedHints.map(ch => `
          <div style="padding:12px 14px;background:var(--surface2);border-radius:10px;margin-bottom:6px;opacity:0.5;border:1px dashed var(--border)">
            <div style="font-size:10px;color:var(--text2)">Bölüm ${ch.level} — Seviye ${ch.level}'de açılacak</div>
            <div style="font-size:13px;font-weight:700;color:var(--text2)">${ch.title.startsWith('???') ? '???' : ch.title}</div>
          </div>
        `).join('')}

        ${nextMod ? `
          <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-top:8px">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#185FA5,#0F6E56);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <span style="font-size:14px">🔧</span>
            </div>
            <div>
              <div style="font-size:12px;font-weight:700">${nextMod.name} yaklaşıyor</div>
              <div style="font-size:11px;color:var(--text2)">Seviye ${nextMod.unlockLevel}'de yeni modül + özel hikaye açılacak</div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <style>
      .colony-wrap{background:var(--surface);border:1px solid var(--border);border-radius:18px;overflow:hidden}
      .colony-scene{position:relative;height:300px;background:linear-gradient(180deg,#020B1A 0%,#0A1628 40%,#162544 70%,#1E3352 100%);overflow:hidden}
      .colony-stars{position:absolute;inset:0}
      .colony-hud{position:absolute;top:12px;left:14px;right:14px;display:flex;justify-content:space-between;align-items:flex-start;z-index:5}
      .colony-ground{position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(180deg,#1a2a3a 0%,#2d1f14 40%,#3d2a18 100%);border-top:1px solid #4a3520}
      .colony-ground::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#6b4c2a,#8b6b3a,#6b4c2a,transparent)}
      .colony-modules{position:absolute;bottom:0;left:0;right:0;height:180px}
      .colony-stat{flex:1;text-align:center;padding:10px 4px;background:var(--surface2);border-radius:10px}
      .colony-stat-v{font-size:18px;font-weight:800}
      .colony-stat-l{font-size:10px;color:var(--text2);margin-top:2px}
      .colony-entry{padding:14px;background:var(--surface2);border-radius:12px;margin-bottom:8px;cursor:pointer;transition:background 0.15s;border-left:3px solid var(--accent);position:relative}
      .colony-entry:active{background:var(--border)}
      @keyframes colTwinkle{0%,100%{opacity:0.2}50%{opacity:1}}
      @keyframes colWindowFlicker{0%,90%{opacity:0.85}95%{opacity:0.3}100%{opacity:0.85}}
      @keyframes colSmoke{0%{transform:translateY(0);opacity:0.4}100%{transform:translateY(-10px);opacity:0}}
      @keyframes colPulse{0%,100%{opacity:0.3}50%{opacity:0.7}}
    </style>
  `;
}

// ── Yıldızları oluştur ───────────────────────────────────
function _colonyInitStars() {
  const el = document.getElementById('colonyStars');
  if (!el || el.children.length > 0) return;
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.style.cssText = `position:absolute;border-radius:50%;background:white;
      width:${1 + Math.random() * 2}px;height:${1 + Math.random() * 2}px;
      left:${Math.random() * 100}%;top:${Math.random() * 55}%;
      animation:colTwinkle ${2 + Math.random() * 4}s ease-in-out infinite;
      animation-delay:${Math.random() * 4}s`;
    el.appendChild(s);
  }
  const bar = document.getElementById('colonyXpBar');
  if (bar) {
    const data = loadColonyData();
    const prog = getXpProgress(data.xp, data.level);
    setTimeout(() => { bar.style.width = prog.percent + '%'; }, 100);
  }
}

// ── Modül SVG'leri ───────────────────────────────────────
function _buildModuleSVGs(modules, level) {
  const positions = {
    komuta:  { bottom: 55, left: '50%', transform: 'translateX(-50%)', w: 70, h: 48 },
    yasam:   { bottom: 48, left: 'calc(50% - 105px)', w: 54, h: 36 },
    lab:     { bottom: 48, right: 'calc(50% - 105px)', w: 54, h: 36 },
    sera:    { bottom: 90, left: 'calc(50% - 125px)', w: 46, h: 30 },
    gozlem:  { bottom: 90, right: 'calc(50% - 125px)', w: 46, h: 30 },
    enerji:  { bottom: 44, left: 'calc(50% - 160px)', w: 34, h: 24 },
    iletisim:{ bottom: 44, right: 'calc(50% - 160px)', w: 34, h: 24 },
    akademi: { bottom: 92, left: '50%', transform: 'translateX(-50%)', w: 50, h: 28 },
    kalkan:  { bottom: 120, left: 'calc(50% - 80px)', w: 30, h: 20 },
    portal:  { bottom: 120, right: 'calc(50% - 80px)', w: 30, h: 20 },
  };
  const colors = {
    komuta: { bg: '#1a3050', border: '#3a6a9a', window: '#7BC8FF' },
    yasam:  { bg: '#0d3028', border: '#2a7a5a', window: '#5DCAA5' },
    lab:    { bg: '#302810', border: '#8a6a2a', window: '#FAC775' },
    sera:   { bg: '#1a3a20', border: '#3a8a4a', window: '#97C459' },
    gozlem: { bg: '#1a1a3a', border: '#4a4a8a', window: '#a5b4fc' },
    enerji: { bg: '#3a2a10', border: '#8a6a20', window: '#fde047' },
    iletisim:{ bg: '#1a2a3a', border: '#3a6a8a', window: '#7dd3fc' },
    akademi:{ bg: '#2a1a3a', border: '#6a3a8a', window: '#c4b5fd' },
    kalkan: { bg: '#1a3a3a', border: '#3a8a8a', window: '#67e8f9' },
    portal: { bg: '#2a1a2a', border: '#8a3a8a', window: '#f0abfc' },
  };

  let html = '';

  COLONY_MODULES.forEach(mod => {
    const pos = positions[mod.id];
    if (!pos) return;
    const col = colors[mod.id] || colors.komuta;
    const status = getModuleStatus(mod.id, level);

    let style = `position:absolute;border-radius:6px;cursor:pointer;transition:all 0.3s;width:${pos.w}px;height:${pos.h}px;bottom:${pos.bottom}px;`;
    if (pos.left) style += `left:${pos.left};`;
    if (pos.right) style += `right:${pos.right};`;
    if (pos.transform) style += `transform:${pos.transform};`;

    if (status.status === 'locked') {
      if (mod.unlockLevel <= level + 10) {
        style += `opacity:0.15;border:1.5px dashed rgba(255,255,255,0.2);background:transparent;`;
        html += `<div style="${style}" title="${mod.name} — Seviye ${mod.unlockLevel}">
          <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:8px;color:rgba(255,255,255,0.2)">Sv.${mod.unlockLevel}</span>
          <span style="position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);font-size:8px;color:rgba(255,255,255,0.15);white-space:nowrap">${mod.name}</span>
        </div>`;
      }
    } else if (status.status === 'building') {
      style += `opacity:0.5;border:1.5px dashed rgba(255,255,255,0.5);background:${col.bg}66;`;
      html += `<div style="${style}" onclick="_colonyModuleClick('${mod.id}')" title="${mod.name}">
        <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:10px;color:rgba(255,255,255,0.6);animation:colPulse 2s ease-in-out infinite">%${status.buildPercent || 68}</span>
        <span style="position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);font-size:8px;color:rgba(255,255,255,0.4);white-space:nowrap">${mod.name}</span>
      </div>`;
    } else {
      style += `background:linear-gradient(180deg,${col.bg},${col.bg}dd);border:1px solid ${col.border};`;
      let windows = '';
      const wc = col.window;
      if (pos.w >= 50) {
        windows += `<div style="position:absolute;top:${Math.round(pos.h*0.2)}px;left:8px;width:5px;height:3px;background:${wc};border-radius:1px;animation:colWindowFlicker ${3+Math.random()*3}s infinite ${Math.random()*2}s"></div>`;
        windows += `<div style="position:absolute;top:${Math.round(pos.h*0.2)}px;right:8px;width:5px;height:3px;background:${wc};border-radius:1px;animation:colWindowFlicker ${3+Math.random()*3}s infinite ${Math.random()*2}s"></div>`;
      }
      if (pos.w >= 60) {
        windows += `<div style="position:absolute;top:${Math.round(pos.h*0.5)}px;left:14px;width:5px;height:3px;background:${wc};border-radius:1px;animation:colWindowFlicker ${4+Math.random()*2}s infinite ${Math.random()}s"></div>`;
        windows += `<div style="position:absolute;top:${Math.round(pos.h*0.5)}px;right:14px;width:5px;height:3px;background:${wc};border-radius:1px;animation:colWindowFlicker ${4+Math.random()*2}s infinite ${Math.random()*3}s"></div>`;
      }
      let extras = '';
      if (mod.id === 'komuta') extras += `<div style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);width:1px;height:16px;background:rgba(255,255,255,0.4)"><div style="position:absolute;top:-3px;left:-2px;width:5px;height:5px;border-radius:50%;background:#ff4444;animation:colPulse 1.5s ease-in-out infinite"></div></div>`;
      if (mod.id === 'lab') {
        extras += `<div style="position:absolute;top:-6px;right:8px;width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,0.2);animation:colSmoke 3s ease-out infinite"></div>`;
        extras += `<div style="position:absolute;top:-10px;right:12px;width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,0.15);animation:colSmoke 3s ease-out infinite 1.5s"></div>`;
      }
      html += `<div style="${style}" onclick="_colonyModuleClick('${mod.id}')" title="${mod.name}">
        ${windows}${extras}
        <span style="position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);font-size:8px;color:rgba(255,255,255,0.6);white-space:nowrap;font-weight:600">${mod.name}</span>
      </div>`;
    }
  });

  if (level >= 2) html += `<div style="position:absolute;bottom:63px;left:calc(50% - 52px);width:18px;height:2px;background:rgba(100,160,220,0.3);border-radius:1px"></div>`;
  if (level >= 4) html += `<div style="position:absolute;bottom:63px;right:calc(50% - 52px);width:18px;height:2px;background:rgba(100,160,220,0.3);border-radius:1px"></div>`;

  return html;
}

// ── Etkileşim fonksiyonları ──────────────────────────────
let _colonySelectedMood = null;

function _colonyOpenEntry() {
  const panel = document.getElementById('colonyEntryPanel');
  if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function _colonyPickMood(btn, mood) {
  _colonySelectedMood = mood;
  document.querySelectorAll('#colonyMoodBtns button').forEach(b => {
    b.style.background = 'var(--surface)';
    b.style.borderColor = 'var(--border)';
    b.style.fontWeight = '600';
  });
  btn.style.background = 'rgba(55,138,221,0.15)';
  btn.style.borderColor = '#378ADD';
  btn.style.fontWeight = '800';
}

function _colonySubmitEntry() {
  if (!_colonySelectedMood) { showToast('⚠️', 'Önce nasıl hissettiğini seç'); return; }

  const anxiety = document.getElementById('colonyAnxiety')?.value || '4';
  const sleep = document.getElementById('colonySleep')?.value || '7';

  // Wellness'a kaydet
  const { myUid, storageKey, data: wData } = _getW();
  const today = getTodayKey();
  if (!wData.days) wData.days = {};
  if (!wData.days[today]) wData.days[today] = {};
  wData.days[today].mood = _colonySelectedMood;
  wData.days[today].kaygi = anxiety;
  wData.days[today].uyku = sleep;
  _syncW(myUid, storageKey, wData);

  // Koloni XP
  const colData = loadColonyData();
  const result = grantWellnessXP(colData, _colonySelectedMood);

  if (result.xpGained === 0) { showToast('ℹ️', result.reason); return; }

  if (result.levelUp) {
    const lvlInfo = getColonyLevelInfo(result.newLevel);
    showToast('🚀', `Seviye ${result.newLevel}: ${lvlInfo.title}!`);
    const newChapter = COLONY_CHAPTERS.find(c => c.level === result.newLevel);
    if (newChapter) setTimeout(() => showToast('📖', `Yeni bölüm: "${newChapter.title}"`), 1500);
    if (lvlInfo.unlocks) setTimeout(() => showToast('🔧', lvlInfo.unlocks), 3000);
  } else {
    showToast('🚀', result.reasons.join(' '));
  }

  _colonySelectedMood = null;
  setTimeout(() => showPage('macera'), 500);
}

function _colonyToggleChapter(el) {
  const text = el.querySelector('.colony-chapter-text');
  if (!text) return;
  text.style.maxHeight = (text.style.maxHeight && text.style.maxHeight !== '0px') ? '0' : '500px';
  const id = el.dataset.id;
  if (id) {
    const data = loadColonyData();
    if (!data.chaptersRead) data.chaptersRead = [];
    if (!data.chaptersRead.includes(id)) { data.chaptersRead.push(id); saveColonyData(data); }
  }
}

function _colonyModuleClick(moduleId) {
  const mod = COLONY_MODULES.find(m => m.id === moduleId);
  if (!mod) return;
  const data = loadColonyData();
  const status = getModuleStatus(moduleId, data.level);
  const modChapters = COLONY_CHAPTERS.filter(c => c.module === moduleId && c.level <= data.level);
  const chapterList = modChapters.length > 0
    ? modChapters.map(c => `<div style="font-size:12px;padding:6px 0;border-bottom:1px solid var(--border)">📖 ${c.title}</div>`).join('')
    : '<div style="font-size:12px;color:var(--text2)">Henüz bölüm yok</div>';
  const upgradeInfo = status.upgradeLevel > 0 ? `<div style="font-size:11px;color:var(--accent);margin-top:4px">Seviye ${status.upgradeLevel} yükseltme</div>` : '';

  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)';
  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:22px 18px;width:100%;max-width:300px">
      <div style="font-size:16px;font-weight:800;margin-bottom:4px">${mod.name}</div>
      ${upgradeInfo}
      <div style="font-size:12px;color:var(--text2);margin:8px 0 14px;line-height:1.5">${mod.desc}</div>
      <div style="font-size:12px;font-weight:700;margin-bottom:8px">İlgili bölümler</div>
      ${chapterList}
      <button onclick="this.closest('div[style*=fixed]').remove()" style="width:100%;margin-top:14px;padding:10px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;color:var(--text);font-family:'Nunito',sans-serif">Kapat</button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function _colonyShowAllChapters() {
  const data = loadColonyData();
  const chapters = getUnlockedChapters(data.level).reverse();
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(3px)';
  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px 14px;width:100%;max-width:360px;max-height:80vh;overflow-y:auto">
      <div style="font-size:16px;font-weight:800;margin-bottom:14px">📖 Tüm Bölümler (${chapters.length})</div>
      ${chapters.map(ch => `
        <div style="padding:10px 12px;background:var(--surface2);border-radius:10px;margin-bottom:6px;cursor:pointer;border-left:3px solid var(--accent)" onclick="this.querySelector('.ch-txt').style.maxHeight=this.querySelector('.ch-txt').style.maxHeight&&this.querySelector('.ch-txt').style.maxHeight!=='0px'?'0':'500px'">
          <div style="font-size:10px;color:var(--text2)">Bölüm ${ch.level}</div>
          <div style="font-size:13px;font-weight:700">${ch.title}</div>
          <div class="ch-txt" style="max-height:0;overflow:hidden;transition:max-height 0.3s">
            <div style="font-size:12px;color:var(--text2);line-height:1.6;padding-top:6px">${ch.text}</div>
          </div>
        </div>`).join('')}
      <button onclick="this.closest('div[style*=fixed]').remove()" style="width:100%;margin-top:10px;padding:10px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;color:var(--text);font-family:'Nunito',sans-serif">Kapat</button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function _colonyPostRender() {
  setTimeout(_colonyInitStars, 50);
}
