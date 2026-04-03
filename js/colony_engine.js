// colony_engine.js — Koloni Motor Sistemi
// Seviye, XP, modül durumu, dürüstlük kalkanı, veri yönetimi

// ── Veri yükleme/kaydetme ────────────────────────────────
function _colonyKey() {
  return 'colony_' + ((window.currentUserData || {}).uid || 'local');
}

function loadColonyData() {
  try {
    const raw = localStorage.getItem(_colonyKey());
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return _defaultColonyData();
}

function saveColonyData(data) {
  try {
    localStorage.setItem(_colonyKey(), JSON.stringify(data));
    // Firestore backup
    const uid = (window.currentUserData || {}).uid;
    if (uid && db) {
      db.collection('colony').doc(uid).set(data, { merge: true }).catch(() => {});
    }
  } catch (e) {}
}

async function loadColonyFromFirestore() {
  const uid = (window.currentUserData || {}).uid;
  if (!uid || !db) return null;
  try {
    const snap = await db.collection('colony').doc(uid).get();
    if (snap.exists) {
      const data = snap.data();
      localStorage.setItem(_colonyKey(), JSON.stringify(data));
      return data;
    }
  } catch (e) {}
  return null;
}

function _defaultColonyData() {
  return {
    xp: 0,
    level: 1,
    totalDays: 0,
    currentStreak: 0,
    lastEntryDate: null,
    chaptersRead: [],
    honestyShield: false,
    weekMoods: [],
    colonyName: 'Arcadia',
    version: 1
  };
}

// ── Seviye hesaplama ─────────────────────────────────────
function getColonyLevel(xp) {
  let level = 1;
  for (let i = COLONY_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= COLONY_LEVELS[i].xpNeeded) {
      level = COLONY_LEVELS[i].level;
      break;
    }
  }
  return level;
}

function getColonyLevelInfo(level) {
  return COLONY_LEVELS.find(l => l.level === level) || COLONY_LEVELS[0];
}

function getXpForNextLevel(level) {
  const next = COLONY_LEVELS.find(l => l.level === level + 1);
  return next ? next.xpNeeded : null;
}

function getXpProgress(xp, level) {
  const current = getColonyLevelInfo(level);
  const nextXp = getXpForNextLevel(level);
  if (!nextXp) return { current: xp, needed: xp, percent: 100 };
  const base = current.xpNeeded;
  const range = nextXp - base;
  const progress = xp - base;
  return {
    current: progress,
    needed: range,
    percent: Math.min(100, Math.round((progress / range) * 100))
  };
}

// ── Modül durumları ──────────────────────────────────────
function getModuleStatus(moduleId, level) {
  const mod = COLONY_MODULES.find(m => m.id === moduleId);
  if (!mod) return { status: 'unknown', upgradeLevel: 0 };

  if (level < mod.unlockLevel) {
    return { status: 'locked', upgradeLevel: 0, unlockAt: mod.unlockLevel };
  }

  // Kaç kez upgrade olmuş
  let upgradeLevel = 0;
  for (const ul of mod.upgradeAt) {
    if (level >= ul) upgradeLevel++;
  }

  // İnşaat halinde mi (unlock seviyesindeyse ve yeni açıldıysa)
  if (level === mod.unlockLevel) {
    return { status: 'building', upgradeLevel, buildPercent: 68 };
  }

  return { status: 'active', upgradeLevel };
}

function getActiveModules(level) {
  return COLONY_MODULES.filter(m => level >= m.unlockLevel).map(m => ({
    ...m,
    ...getModuleStatus(m.id, level)
  }));
}

function getNextModule(level) {
  return COLONY_MODULES.find(m => m.unlockLevel > level) || null;
}

// ── Açılmış hikaye bölümleri ─────────────────────────────
function getUnlockedChapters(level) {
  return COLONY_CHAPTERS.filter(c => c.level <= level);
}

function getNextLockedChapter(level) {
  return COLONY_CHAPTERS.find(c => c.level > level) || null;
}

// ── Dürüstlük kalkanı ───────────────────────────────────
function checkHonestyShield(weekMoods) {
  // Son 7 günde 3+ farklı duygu girildiyse aktif
  if (!weekMoods || weekMoods.length < 3) return false;
  const unique = new Set(weekMoods.slice(-7));
  return unique.size >= 3;
}

// ── XP kazanma ───────────────────────────────────────────
function grantWellnessXP(colonyData, mood) {
  const today = getTodayKey();
  if (colonyData.lastEntryDate === today) {
    return { xpGained: 0, reason: 'Bugün zaten giriş yaptın', levelUp: false };
  }

  let xpGained = COLONY_XP_RULES.wellnessEntry;
  const reasons = ['+' + COLONY_XP_RULES.wellnessEntry + ' XP wellness girişi'];

  // Seri güncelle
  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();

  if (colonyData.lastEntryDate === yesterday) {
    colonyData.currentStreak++;
  } else if (colonyData.lastEntryDate !== today) {
    colonyData.currentStreak = 1;
  }

  // Seri bonusları
  const streak = colonyData.currentStreak;
  if (streak === 3) { xpGained += COLONY_XP_RULES.wellnessStreak3; reasons.push('+' + COLONY_XP_RULES.wellnessStreak3 + ' XP 3 gün seri!'); }
  if (streak === 7) { xpGained += COLONY_XP_RULES.wellnessStreak7; reasons.push('+' + COLONY_XP_RULES.wellnessStreak7 + ' XP 7 gün seri!'); }
  if (streak === 14) { xpGained += COLONY_XP_RULES.wellnessStreak14; reasons.push('+' + COLONY_XP_RULES.wellnessStreak14 + ' XP 14 gün seri!'); }
  if (streak === 30) { xpGained += COLONY_XP_RULES.wellnessStreak30; reasons.push('+' + COLONY_XP_RULES.wellnessStreak30 + ' XP 30 gün seri!'); }

  // Dürüstlük kalkanı
  if (!colonyData.weekMoods) colonyData.weekMoods = [];
  if (mood) colonyData.weekMoods.push(mood);
  if (colonyData.weekMoods.length > 7) colonyData.weekMoods = colonyData.weekMoods.slice(-7);

  const hadShield = colonyData.honestyShield;
  colonyData.honestyShield = checkHonestyShield(colonyData.weekMoods);
  if (colonyData.honestyShield && !hadShield) {
    xpGained += COLONY_XP_RULES.honestyShield;
    reasons.push('+' + COLONY_XP_RULES.honestyShield + ' XP dürüstlük kalkanı!');
  }

  // XP ve seviye güncelle
  const oldLevel = colonyData.level;
  colonyData.xp += xpGained;
  colonyData.level = getColonyLevel(colonyData.xp);
  colonyData.totalDays++;
  colonyData.lastEntryDate = today;

  const levelUp = colonyData.level > oldLevel;

  saveColonyData(colonyData);

  return {
    xpGained,
    reasons,
    levelUp,
    newLevel: colonyData.level,
    oldLevel,
    streak: colonyData.currentStreak
  };
}

// Soru çözme XP'si (entries.js'ten çağrılır)
function grantQuestionXP(colonyData, questionCount) {
  if (!questionCount || questionCount <= 0) return 0;
  const xp = Math.floor(questionCount / 50) * COLONY_XP_RULES.questionsPer50;
  if (xp > 0) {
    colonyData.xp += xp;
    colonyData.level = getColonyLevel(colonyData.xp);
    saveColonyData(colonyData);
  }
  return xp;
}

// Deneme XP'si
function grantExamXP(colonyData) {
  colonyData.xp += COLONY_XP_RULES.examEntry;
  colonyData.level = getColonyLevel(colonyData.xp);
  saveColonyData(colonyData);
  return COLONY_XP_RULES.examEntry;
}
