

// Öğrenci etiket HTML yardımcısı
function _ogrenciEtiketHTML(etiket) {
  if (!etiket) return '';
  const stiller = {
    '🔥 Çalışkan':  'background:linear-gradient(135deg,#ff4444,#cc1111);color:white;box-shadow:0 1px 6px rgba(255,68,68,0.4)',
    '⚡ Hızlı':     'background:linear-gradient(135deg,#00d2ff,#0099cc);color:white;box-shadow:0 1px 6px rgba(0,210,255,0.3)',
    '👑 Efsane':    'background:linear-gradient(135deg,#f9ca24,#e6a800);color:#1a1200;box-shadow:0 1px 6px rgba(249,202,36,0.4)',
    '💎 Elit':      'background:linear-gradient(135deg,#a855f7,#7c22cc);color:white;box-shadow:0 1px 6px rgba(168,85,247,0.4)',
    '🦸 Kahraman':  'background:linear-gradient(135deg,#ff6b9d,#cc2266);color:white;box-shadow:0 1px 6px rgba(255,107,157,0.35)',
    '🦉 Bilge':     'background:linear-gradient(135deg,#45b7d1,#1a7a99);color:white;box-shadow:0 1px 6px rgba(69,183,209,0.35)',
    '🌋 Ateş Kalbi':'background:linear-gradient(135deg,#ff8c00,#cc4400);color:white;box-shadow:0 1px 6px rgba(255,140,0,0.4)',
  };
  const stil = stiller[etiket] || 'background:rgba(108,99,255,.3);color:white';
  return '<span style="' + stil + ';font-size:9px;font-weight:800;padding:2px 7px;border-radius:99px;margin-left:5px;white-space:nowrap">' + etiket + '</span>';
}

async function ogrenciOkulDegistir(i) {
  const s = students[i];
  const okullar = window.currentUserData?.schools || [];
  if (okullar.length === 0) {
    showToast('⚠️', 'Önce profilinde okul ekle');
    return;
  }

  // Basit seçim modalı
  const mevcut = s.school || 'Belirtilmemiş';
  const secenek = okullar.map((o, idx) =>
    `<button onclick="ogrenciOkulKaydet(${i},'${o}',this)" style="width:100%;text-align:left;padding:12px 14px;margin-bottom:8px;background:${o===mevcut?'rgba(108,99,255,.1)':'var(--bg)'};border:1.5px solid ${o===mevcut?'var(--accent)':'var(--border)'};border-radius:12px;cursor:pointer;font-weight:700;font-size:0.9rem;color:${o===mevcut?'var(--accent)':'var(--text)'};font-family:'Nunito',sans-serif">
      ${o===mevcut?'✓ ':''}${o}
    </button>`
  ).join('');

  const modal = document.createElement('div');
  modal.id = 'okulDegistirModal';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal" style="max-width:360px">
      <div class="modal-title">🏫 Okul Değiştir</div>
      <div style="font-size:0.82rem;color:var(--text2);margin-bottom:14px">${s.name} — Mevcut: <b>${mevcut}</b></div>
      ${secenek}
      <button class="btn btn-outline" style="width:100%;margin-top:4px" onclick="document.getElementById('okulDegistirModal').remove()">İptal</button>
    </div>
  `;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}

async function ogrenciOkulKaydet(i, yeniOkul, btn) {
  const s = students[i];
  if (!s.uid) return;
  try {
    await db.collection('users').doc(s.uid).update({ school: yeniOkul });
    students[i].school = yeniOkul;
    showToast('✅', `${s.name} → ${yeniOkul}`);
    document.getElementById('okulDegistirModal')?.remove();
    showPage('students');
  } catch(e) {
    showToast('❌', 'Kaydedilemedi: ' + e.message);
  }
}


function ogrenciEkleModalAc() {
  const okullar = window.currentUserData?.schools || [];
  const sel = document.getElementById('newStudentSchool');
  if (sel) {
    sel.innerHTML = '<option value="">— Okul seçin —</option>';
    okullar.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      sel.appendChild(opt);
    });
    if (okullar.length === 0) {
      sel.innerHTML = '<option value="">Önce profilde okul ekleyin</option>';
    }
  }
  openModal('addStudentModal');
}

function teacherDashboard() {
  const name = document.getElementById('menuName')?.textContent || 'Hoca';
  const studentCount = students.length;
  const todayKey = getTodayKey();
  const todayEntries = studyEntries.filter(e=>e.dateKey===todayKey);
  const activeToday = new Set(todayEntries.map(e=>e.studentName)).size;
  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg> Ana Panel</div>
    <div class="page-sub">Merhaba ${name}! Bugün ${new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</div>

    ${lgsCountdownWidget()}

    <div class="grid-3">
      <div class="stat-card">
        <div class="stat-label">Aktif Öğrenci</div>
        <div class="stat-value" style="color:var(--accent)">${studentCount}</div>
        <div class="stat-change up">↑ Toplam öğrenci</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Bugün Giriş</div>
        <div class="stat-value" style="color:var(--accent3)">${activeToday}</div>
        <div class="stat-change">${activeToday>0?'✅ Aktif':'⏳ Bekliyor'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Bekleyen Ödev</div>
        <div class="stat-value" style="color:var(--accent4)">${tasks.filter(t=>!t.done).length}</div>
        <div class="stat-change down">↓ ${tasks.filter(t=>t.done).length} teslim edildi</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Öğrenci Durumları</div>
        ${studentCount === 0 ? `<div style="text-align:center;padding:20px;color:var(--text2);font-size:0.88rem">Henüz öğrenci eklenmedi</div>` :
        students.map(s=>{
          const sEntries = studyEntries.filter(e=>e.studentName===s.name);
          const sTasks = tasks.filter(t=>t.studentName===s.name && !t.done).length;
          const todayKey2 = getTodayKey();
          const activeToday2 = sEntries.some(e=>e.dateKey===todayKey2);
          const totalQ = sEntries.reduce((a,e)=>a+(e.questions||0),0);
          const weekAgo2 = new Date(); weekAgo2.setDate(weekAgo2.getDate()-7);
          const weekKey2 = weekAgo2.toISOString().split('T')[0];
          const weekDays2 = new Set(sEntries.filter(e=>e.dateKey>=weekKey2).map(e=>e.dateKey)).size;
          return `
          <div class="student-row" onclick="openStudentAnalysis('${s.name}')" style="cursor:pointer">
            ${s.photo
              ? `<img src="${s.photo}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;cursor:pointer" onclick="event.stopPropagation();showUserProfile('${s.uid}','${s.name}','${s.color}')">`
              : `<div class="student-avatar" style="background:${s.color}20;color:${s.color};cursor:pointer" onclick="event.stopPropagation();showUserProfile('${s.uid}','${s.name}','${s.color}')">${s.name[0]}</div>`}
            <div class="student-info">
              <div class="student-name" style="display:flex;align-items:center;gap:4px">${s.name}${_ogrenciEtiketHTML(s.etiket||"")}</div>
              <div class="student-meta">${sTasks} görev • ${totalQ} soru • Bu hafta: ${weekDays2}g</div>
            </div>
            <div style="text-align:right">
              <span class="badge ${activeToday2?'badge-green':'badge-yellow'}" style="font-size:0.7rem">${activeToday2?'✅ Aktif':'⏳ Bekliyor'}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="card">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hızlı İşlemler</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          <button class="btn btn-primary" style="width:100%;padding:12px;text-align:left" onclick="showPage('students')">
            👥 Öğrenci Listesi & Analiz
          </button>
          <button class="btn btn-outline" style="width:100%;padding:12px;text-align:left" onclick="openTaskModal()">
            📋 Görev Ata
          </button>
          <button class="btn btn-outline" style="width:100%;padding:12px;text-align:left" onclick="showPage('tasks-teacher')">
            📊 Görev Takibi
          </button>
          <button class="btn btn-outline" style="width:100%;padding:12px;text-align:left" onclick="showPage('messages')">
            💬 Mesajlaş
          </button>
        </div>
        <div style="margin-top:16px;padding:12px;background:var(--surface2);border-radius:10px">
          <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">📅 Bugün Giriş Yapan</div>
          <div style="font-size:1.4rem;font-weight:800;color:var(--accent3)">${activeToday} <span style="font-size:0.85rem;font-weight:600;color:var(--text2)">/ ${studentCount} öğrenci</span></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Son Atanan Görevler</div>
      ${tasks.length===0
        ? `<div style="text-align:center;padding:20px;color:var(--text2);font-size:0.85rem">Henüz görev atanmadı</div>`
        : tasks.slice(0,4).map(t=>`
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
            <div style="font-size:1.2rem">${t.done?'✅':'📋'}</div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:0.85rem">${t.title}</div>
              <div style="font-size:0.75rem;color:var(--text2)">${t.studentName||t.student||''} • Son: ${t.due}</div>
            </div>
            <span class="badge ${t.done?'badge-green':'badge-yellow'}" style="font-size:0.7rem">${t.done?'Tamam':'Bekliyor'}</span>
          </div>`).join('')}
      ${tasks.length>4?`<div style="text-align:center;margin-top:10px"><button class="btn btn-outline" style="font-size:0.8rem;padding:6px 16px" onclick="showPage('tasks-teacher')">Tümünü Gör</button></div>`:''}
    </div>
  `;
}

function teacherStudents() {
  const todayKey = getTodayKey();
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const weekKey = weekAgo.toISOString().split('T')[0];

  // Öğrencileri okula göre grupla
  const groups = {};
  const NO_SCHOOL = '— Okul Belirtilmemiş —';
  students.forEach((s, i) => {
    const key = s.school && s.school.trim() ? s.school.trim() : NO_SCHOOL;
    if (!groups[key]) groups[key] = [];
    groups[key].push({ s, i });
  });
  const sortedKeys = Object.keys(groups).sort((a,b) => {
    if (a === NO_SCHOOL) return 1;
    if (b === NO_SCHOOL) return -1;
    return a.localeCompare(b, 'tr');
  });

  function renderCard(s, i) {
    const sEntries = studyEntries.filter(e=>e.studentName===s.name);
    const weekEntries = sEntries.filter(e=>e.dateKey>=weekKey);
    const activeDays = new Set(weekEntries.map(e=>e.dateKey)).size;
    const totalQ = sEntries.reduce((a,e)=>a+(e.questions||0),0);
    const avgNet = weekEntries.length > 0
      ? (weekEntries.reduce((a,e)=>a+(e.net||0),0) / weekEntries.length).toFixed(1) : 0;
    const isActiveToday = sEntries.some(e=>e.dateKey===todayKey);
    const status = activeDays >= 4 ? 'good' : activeDays >= 2 ? 'normal' : 'warn';
    const statusBadge = status==='good'
      ? `<span class="badge badge-green">✅ Aktif</span>`
      : status==='normal'
      ? `<span class="badge badge-yellow">📊 Normal</span>`
      : `<span class="badge badge-red">⚠️ Dikkat!</span>`;

    const avatar = s.photo
      ? `<img src="${s.photo}" onclick="event.stopPropagation();showUserProfile('${s.uid}','${s.name}','${s.color}')"
           style="width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0;cursor:pointer">`
      : `<div onclick="event.stopPropagation();showUserProfile('${s.uid}','${s.name}','${s.color}')"
           style="width:42px;height:42px;border-radius:50%;background:${s.color}18;color:${s.color};font-size:1rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer">${s.name[0]}</div>`;

    return `
      <div class="swipe-wrap" id="sw_${s.uid}">
        <div class="swipe-actions">
          <button class="swipe-action-btn" onclick="event.stopPropagation();_swipeClose('${s.uid}');ogrenciOkulDegistir(${i})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Okul</span>
          </button>
          <button class="swipe-action-btn" onclick="event.stopPropagation();_swipeClose('${s.uid}');ogrenciSifreSifirla('${s.uid}','${s.name}','${s.username||''}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Şifre</span>
          </button>
          <button class="swipe-action-btn" onclick="event.stopPropagation();_swipeClose('${s.uid}');deleteStudent(${i})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            <span>Sil</span>
          </button>
        </div>
        <div class="swipe-front student-card-item" data-name="${s.name.toLowerCase()}" id="sf_${s.uid}"
          ontouchstart="_swipeTouchStart(event,'${s.uid}')"
          ontouchend="_swipeTouchEnd(event,'${s.uid}')"
          onclick="_swipeTap('${s.uid}','${s.name}')">
          ${avatar}
          <div style="flex:1;min-width:0">
            <div style="font-size:0.88rem;font-weight:800;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
            <div style="font-size:0.7rem;color:var(--text2);margin-top:2px">${activeDays} gün · ${totalQ} soru · Net ${avgNet} · ${isActiveToday?'✅ aktif':'⏳ giriş yok'}</div>
          </div>
          ${statusBadge}
          <button onclick="event.stopPropagation();_swipeToggle('${s.uid}')"
            style="background:none;border:none;cursor:pointer;padding:4px 6px;color:var(--text2);font-size:1.1rem;flex-shrink:0;line-height:1" title="İşlemler">⋯</button>
        </div>
      </div>`;
  }

  const studentListHTML = students.length === 0
    ? `<div style="text-align:center;padding:40px 20px;color:var(--text2)">
        <div style="font-size:3rem;margin-bottom:12px">👥</div>
        <div style="font-weight:700;margin-bottom:8px">Henüz öğrenci eklenmedi</div>
        <div style="font-size:0.85rem">+ Öğrenci Ekle butonuna basarak başla</div>
      </div>`
    : sortedKeys.map(key => `
        <div data-school-header="1" style="font-size:0.68rem;font-weight:800;color:var(--text2);letter-spacing:.08em;text-transform:uppercase;padding:10px 4px 4px;margin-top:4px">
          🏫 ${key}
        </div>
        ${groups[key].map(({s,i}) => renderCard(s,i)).join('')}
      `).join('');

  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Öğrencilerim</div>
    <div class="page-sub">Koçluk takibindeki öğrenciler</div>
    <div style="display:flex;gap:10px;margin-bottom:12px">
      <button class="btn btn-primary" onclick="ogrenciEkleModalAc()">+ Öğrenci Ekle</button>
      <button class="btn btn-outline" onclick="openTaskModal()">📋 Görev Ata</button>
    </div>
    <div style="position:relative;margin-bottom:16px">
      <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text2);font-size:1rem">🔍</span>
      <input type="text" id="studentSearchInput" placeholder="Öğrenci ara..."
        oninput="filterStudentList(this.value)"
        style="width:100%;padding:10px 12px 10px 36px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.92rem;outline:none;box-sizing:border-box">
    </div>
    <div class="card" id="studentListCard" style="padding:8px 10px">
      ${studentListHTML}
    </div>
    <div style="margin-top:20px" class="card">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Haftalık Öğrenci Özeti</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:0.78rem">
          <thead>
            <tr style="background:var(--accent)22">
              <th style="padding:8px 6px;text-align:left;color:var(--text2);font-weight:700;border-bottom:2px solid var(--accent)44">Öğrenci</th>
              <th style="padding:8px 6px;text-align:center;color:var(--text2);font-weight:700;border-bottom:2px solid var(--accent)44">Gün</th>
              <th style="padding:8px 6px;text-align:center;color:var(--text2);font-weight:700;border-bottom:2px solid var(--accent)44">Soru</th>
              <th style="padding:8px 6px;text-align:center;color:var(--text2);font-weight:700;border-bottom:2px solid var(--accent)44">Süre</th>
              <th style="padding:8px 6px;text-align:center;color:var(--text2);font-weight:700;border-bottom:2px solid var(--accent)44">Net Ort.</th>
              <th style="padding:8px 6px;text-align:center;color:var(--text2);font-weight:700;border-bottom:2px solid var(--accent)44">Durum</th>
            </tr>
          </thead>
          <tbody id="weeklyStudentTable">
            ${students.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text2)">Henüz öğrenci yok</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;
}



/* ========== ÖĞRENCI DETAY ANALİZİ ========== */
let selectedStudentName = '';
let studentAnalysisPeriod = 'daily';

// Profil görüntüleme — hem öğretmen hem öğrenci tıklayabilir
async function showUserProfile(uid, fallbackName, fallbackColor) {
  const vpPhoto = document.getElementById('vpPhoto');
  const vpName  = document.getElementById('vpName');
  const vpRole  = document.getElementById('vpRole');
  const vpDet   = document.getElementById('vpDetails');
  if (!vpPhoto) return;

  // Önce local cache'e bak
  let data = null;
  if (uid === (window.currentUserData||{}).uid) {
    data = window.currentUserData;
  } else {
    // students dizisinden bak
    const s = students.find(x=>x.uid===uid);
    if (s) data = { name:s.name, role:'student', school:s.school||'', classroom:s.classroom||'', photo:s.photo||'' };
  }

  // Firestore'dan çek
  if (!data) {
    try {
      const snap = await db.collection('users').doc(uid).get();
      if (snap.exists) data = snap.data();
    } catch(e) {}
  }

  if (!data) { showToast('⚠️','Profil bulunamadı'); return; }

  const name = data.name || fallbackName || 'Kullanıcı';
  const color = fallbackColor || '#6c63ff';

  // Etiket ve çerçeve — students dizisinden veya Firestore'dan
  const sObj2 = students.find(x => x.uid === uid);
  const etiket = data.etiket || sObj2?.etiket || '';

  // Fotoğraf
  vpPhoto.style.cssText = 'width:80px;height:80px;border-radius:50%;margin:8px auto 20px;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;position:relative;overflow:visible';
  if (data.photo) {
    vpPhoto.innerHTML = `<img src="${data.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    vpPhoto.style.background = color+'22';
    vpPhoto.style.color = color;
    vpPhoto.textContent = name[0].toUpperCase();
  }

  vpName.textContent = name;
  // Etiket göster
  const vpEtiket = document.getElementById('vpEtiket');
  if (vpEtiket) {
    if (etiket) {
      const etiketStyle = {
        '🔥 Çalışkan':  'background:linear-gradient(135deg,#ff4444,#cc1111);color:white',
        '⚡ Hızlı':     'background:linear-gradient(135deg,#00d2ff,#0099cc);color:white',
        '👑 Efsane':    'background:linear-gradient(135deg,#f9ca24,#e6a800);color:#1a1200',
        '💎 Elit':      'background:linear-gradient(135deg,#a855f7,#7c22cc);color:white',
        '🦸 Kahraman':  'background:linear-gradient(135deg,#ff6b9d,#cc2266);color:white',
        '🦉 Bilge':     'background:linear-gradient(135deg,#45b7d1,#1a7a99);color:white',
        '🌋 Ateş Kalbi':'background:linear-gradient(135deg,#ff8c00,#cc4400);color:white',
      }[etiket] || 'background:rgba(108,99,255,.3);color:white';
      vpEtiket.innerHTML = '<span style="' + etiketStyle + ';font-size:10px;font-weight:800;padding:3px 10px;border-radius:99px">' + etiket + '</span>';
      vpEtiket.style.display = 'block';
    } else {
      vpEtiket.innerHTML = '';
      vpEtiket.style.display = 'none';
    }
  }
  vpRole.textContent = data.role==='teacher' ? '👨‍🏫 Koç Öğretmen' : '🎒 Öğrenci';

  const details = [];
  if (data.school) details.push(`🏫 <b>Okul:</b> ${data.school}`);
  if (data.classroom) details.push(`📚 <b>Sınıf:</b> ${data.classroom}`);
  if (data.branch) details.push(`📐 <b>Branş:</b> ${data.branch}`);
  // E-posta sadece koça göster, öğrenciler birbirinin e-postasını göremez
  if (data.email && currentRole === 'teacher') details.push(`✉️ <b>E-posta:</b> ${data.email}`);
  vpDet.innerHTML = details.join('<br>') || '<span style="color:var(--text2)">Bilgi eklenmemiş</span>';

  window._vpCurrentUid = uid;
  openModal('viewProfileModal');

  // Sekmeyi sıfırla
  vpSwitchTab('info');



  // Çerçeve uygula
  const _oldOverlay = vpPhoto.querySelector('._anyFrameOverlay');
  if (_oldOverlay) _oldOverlay.remove();
  try {
    let frameId = data.activeFrame || localStorage.getItem('frame_'+uid) || 'none';
    if (!data.activeFrame && db) {
      db.collection('users').doc(uid).get().then(snap=>{
        if (snap.exists && snap.data().activeFrame) {
          applyFrameToElement(vpPhoto, snap.data().activeFrame, 80);
        }
      }).catch(()=>{});
    }
    if (frameId !== 'none') {
      setTimeout(()=>applyFrameToElement(vpPhoto, frameId, 80), 50);
    }
  } catch(e) {}

  // Rozetleri arka planda yükle
  if (data.role === 'student') {
    getBadges(uid).then(earned => {
      window._vpBadges = { uid, earned };
    });
  }
}

function vpSwitchTab(tab) {
  const infoBtn     = document.getElementById('vpTabInfo');
  const badgesBtn   = document.getElementById('vpTabBadges');
  const infoContent = document.getElementById('vpTabInfoContent');
  const badgeContent= document.getElementById('vpTabBadgesContent');
  if (!infoBtn) return;

  if (tab === 'info') {
    infoBtn.style.color = 'var(--accent)';
    infoBtn.style.borderBottom = '2px solid var(--accent)';
    badgesBtn.style.color = 'var(--text2)';
    badgesBtn.style.borderBottom = '2px solid transparent';
    infoContent.style.display = 'block';
    badgeContent.style.display = 'none';
  } else {
    badgesBtn.style.color = 'var(--accent)';
    badgesBtn.style.borderBottom = '2px solid var(--accent)';
    infoBtn.style.color = 'var(--text2)';
    infoBtn.style.borderBottom = '2px solid transparent';
    infoContent.style.display = 'none';
    badgeContent.style.display = 'block';

    // Rozet grid'ini doldur
    const gridEl  = document.getElementById('vpBadgeGrid');
    const countEl = document.getElementById('vpBadgeCount');
    if (!gridEl) return;

    const cached = window._vpBadges;
    const fill = (earned) => {
      if (countEl) countEl.textContent = earned.length + ' / ' + BADGES.length + ' rozet kazanıldı';
      if (earned.length === 0) {
        gridEl.innerHTML = '<div style="color:var(--text2);font-size:0.8rem;padding:20px">Henüz rozet kazanılmadı</div>';
      } else {
        gridEl.innerHTML = BADGES.filter(b=>earned.includes(b.id))
          .map(b=>getBadgeHTML(b,false,44))
          .join('');
      }
    };

    if (cached) {
      fill(cached.earned);
    } else {
      gridEl.innerHTML = '<div style="color:var(--text2);font-size:0.8rem;padding:20px">Yükleniyor...</div>';
      const vpUid = (window._vpCurrentUid || '');
      if (vpUid) getBadges(vpUid).then(fill);
    }
  }
}

async function editDeneme(examId, currentTitle) {
  const newTitle = await new Promise(resolve => {
    const existing = document.getElementById('_editDenemeModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = '_editDenemeModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10000;display:flex;align-items:flex-end;justify-content:center';
    modal.innerHTML = `
      <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:22px 18px 32px">
        <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 16px"></div>
        <div style="font-size:1rem;font-weight:800;margin-bottom:14px">✏️ Deneme Adını Düzenle</div>
        <input id="_editDenemeInput" class="form-input" value="${currentTitle.replace(/"/g,'&quot;')}" style="margin-bottom:14px">
        <div style="display:flex;gap:8px">
          <button onclick="document.getElementById('_editDenemeModal').remove();window._editDenemeResolve(null)"
            style="flex:1;padding:11px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-weight:700;cursor:pointer;font-family:inherit">İptal</button>
          <button onclick="window._editDenemeResolve(document.getElementById('_editDenemeInput').value)"
            style="flex:1;padding:11px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-weight:700;cursor:pointer;font-family:inherit">Kaydet ✓</button>
        </div>
      </div>`;
    window._editDenemeResolve = (val) => { modal.remove(); delete window._editDenemeResolve; resolve(val); };
    modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); resolve(null); } });
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('_editDenemeInput')?.select(), 50);
  });
  if (!newTitle || newTitle.trim() === currentTitle) return;
  const trimmed = newTitle.trim();
  const user = auth.currentUser;
  if (!user) return;
  showToast('⏳', 'Güncelleniyor...');
  try {
    // studyEntries local güncelle
    studyEntries.forEach(e => { if (e.examId === examId) { e.examTitle = trimmed; e.topic = trimmed; } });
    // Firestore güncelle
    const snap = await db.collection('studyEntries')
      .where('userId','==',user.uid)
      .where('examId','==',examId).get();
    const batch = db.batch();
    snap.forEach(d => batch.update(d.ref, { examTitle: trimmed, topic: trimmed }));
    await batch.commit();
    showToast('✅', 'Deneme adı güncellendi!');
    showPage('my-analysis');
  } catch(e) { showToast('❌', 'Güncelleme başarısız'); }
}

async function deleteDeneme(examId) {
  const ok = await appConfirm('Denemeyi Sil', 'Bu denemeyi silmek istediğinize emin misiniz?', true);
  if (!ok) return;
  const user = auth.currentUser;
  if (!user) return;
  showToast('⏳', 'Siliniyor...');
  try {
    // local sil
    studyEntries = studyEntries.filter(e => e.examId !== examId);
    // Firestore sil
    const snap = await db.collection('studyEntries')
      .where('userId','==',user.uid)
      .where('examId','==',examId).get();
    const batch = db.batch();
    snap.forEach(d => batch.delete(d.ref));
    await batch.commit();
    showToast('✅', 'Deneme silindi!');
    showPage('my-analysis');
  } catch(e) { showToast('❌', 'Silme başarısız'); }
}

// ---- GİRİŞ DÜZENLEME / SİLME ----
function editEntryModal(firestoreId, localIdx) {
  const entry = studyEntries[localIdx];
  if (!entry) return;
  document.getElementById('editEntryId').value = firestoreId;
  document.getElementById('editEntryIdx').value = localIdx;

  // Ders seçicisini dinamik doldur
  const selEl = document.getElementById('editEntrySub');
  selEl.innerHTML = subjects.map(s=>`<option value="${s.name}">${s.icon} ${s.name}</option>`).join('');
  selEl.value = entry.subject || subjects[0].name;

  document.getElementById('editEntryTopic').value = entry.topic || '';
  // Konu seçici label'ını da güncelle
  const topicLbl = document.getElementById('editEntryTopicLabel');
  if (topicLbl) topicLbl.textContent = entry.topic || '— Konu seç —';
  document.getElementById('editEntryDur').value = entry.duration || 0;
  const hasQ = entry.type === 'soru';
  document.getElementById('editEntryQFields').style.display = hasQ ? 'block' : 'none';
  document.getElementById('editEntryCorrect').value = entry.correct || 0;
  document.getElementById('editEntryWrong').value = entry.wrong || 0;
  // Soru sayısı alanını doldur
  const qCountEl = document.getElementById('editEntryQuestions');
  if (qCountEl) qCountEl.value = entry.questions || 0;
  document.getElementById('editEntryNote').value = entry.note || '';
  openModal('editEntryModalEl');
}

async function saveEditEntry() {
  const firestoreId = document.getElementById('editEntryId').value;
  const localIdx = parseInt(document.getElementById('editEntryIdx').value);
  const sub = document.getElementById('editEntrySub').value;
  const topic = document.getElementById('editEntryTopic').value.trim() || 'Genel Çalışma';
  const dur = parseInt(document.getElementById('editEntryDur').value) || 0;
  const correct = parseInt(document.getElementById('editEntryCorrect').value) || 0;
  const wrong = parseInt(document.getElementById('editEntryWrong').value) || 0;
  const qManual = parseInt(document.getElementById('editEntryQuestions')?.value) || 0;
  const note = document.getElementById('editEntryNote').value.trim();
  const q = qManual > 0 ? qManual : (correct + wrong);

  // Doğru + yanlış toplam soru sayısını geçemez
  if (qManual > 0 && (correct + wrong) > qManual) {
    showToast('⚠️', `Doğru (${correct}) + yanlış (${wrong}) = ${correct+wrong}, soru sayısı (${qManual}) geçemez!`);
    const cEl = document.getElementById('editEntryCorrect');
    const wEl = document.getElementById('editEntryWrong');
    if(cEl) cEl.style.borderColor='#E24B4A';
    if(wEl) wEl.style.borderColor='#E24B4A';
    setTimeout(()=>{ if(cEl) cEl.style.borderColor=''; if(wEl) wEl.style.borderColor=''; }, 3000);
    return;
  }

  const net = correct > 0 || wrong > 0 ? correct - wrong/3 : (studyEntries[localIdx]?.net || 0);
  const updates = { subject: sub, topic, duration: dur, correct, wrong, net, questions: q, note };

  if (studyEntries[localIdx]) Object.assign(studyEntries[localIdx], updates);

  if (firestoreId && firestoreId !== 'undefined') {
    try {
      await db.collection('studyEntries').doc(firestoreId).update(updates);
    } catch(e) {
      try {
        const snap = await db.collection('studyEntries')
          .where('userId','==',auth.currentUser?.uid)
          .where('time','==',studyEntries[localIdx]?.time)
          .where('dateKey','==',studyEntries[localIdx]?.dateKey).get();
        snap.forEach(d => d.ref.update(updates));
      } catch(e2) {}
    }
  }

  closeModal('editEntryModalEl');
  showToast('✅', 'Giriş güncellendi!');
  showPage('daily-entry');
}

async function deleteEntry(firestoreId, localIdx) {
  const ok = await appConfirm('Girişi Sil', 'Bu girişi silmek istediğinize emin misiniz?', true);
  if (!ok) return;

  const entry = studyEntries[localIdx];
  studyEntries.splice(localIdx, 1);

  if (firestoreId && firestoreId !== 'undefined') {
    try {
      await db.collection('studyEntries').doc(firestoreId).delete();
    } catch(e) {
      if (entry && auth.currentUser) {
        try {
          const snap = await db.collection('studyEntries')
            .where('userId','==',auth.currentUser.uid)
            .where('time','==',entry.time)
            .where('dateKey','==',entry.dateKey).get();
          snap.forEach(d => d.ref.delete());
        } catch(e2) {}
      }
    }
  }

  showToast('🗑️', 'Giriş silindi!');
  showPage('daily-entry');
}

// ---- GÖREV SİLME / DÜZENLEME ----
async function deleteTask(taskId, idx) {
  const ok = await appConfirm('Görevi Sil', 'Bu görevi silmek istediğinize emin misiniz?', true);
  if (!ok) return;
  const task = tasks[idx];
  tasks.splice(idx, 1);
  if (taskId) {
    try { await db.collection('tasks').doc(taskId).delete(); } catch(e) {}
    // Öğrencinin task bildirimini de sil
    try {
      const studentObj = students.find(s => s.name === (task?.studentName||''));
      if (studentObj?.uid) {
        const notifSnap = await db.collection('notifications')
          .where('toUid','==',studentObj.uid)
          .where('type','==','task')
          .get();
        notifSnap.forEach(doc => doc.ref.delete());
      }
    } catch(e) {}
  }
  showToast('🗑️', 'Görev silindi!');
  showPage('tasks-teacher');
}

function editTaskModal(idx) {
  const t = tasks[idx];
  if (!t) return;
  // Hidden input değerleri
  document.getElementById('taskStudent').value = t.studentName || t.student || '';
  document.getElementById('taskSubject').value = t.subject || subjects[0].name;
  document.getElementById('taskUnit').value = t.unit || '';
  document.getElementById('taskType').value = t.type || 'soru';
  document.getElementById('taskTitle').value = t.title || '';
  document.getElementById('taskDesc').value = t.desc || '';
  document.getElementById('taskDue').value = t.due || '';
  // Buton label'larını güncelle
  const sLbl = document.getElementById('taskStudentLabel');
  if (sLbl) sLbl.textContent = t.studentName || t.student || '— Öğrenci seç —';
  const subLbl = document.getElementById('taskSubjectLabel');
  if (subLbl) subLbl.textContent = t.subject || subjects[0].name;
  const unitLbl = document.getElementById('taskUnitLabel');
  if (unitLbl) unitLbl.textContent = t.unit || '— Konu seç —';
  const typeLbl = document.getElementById('taskTypeLabel');
  const typeLabels = {soru:'📝 Soru Çözümü',konu:'📖 Konu Çalışma',ozet:'✏️ Özet Çıkarma',tekrar:'🔁 Tekrar',diger:'📌 Diğer'};
  if (typeLbl) typeLbl.textContent = typeLabels[t.type]||'📝 Soru Çözümü';
  // countGroup görünürlüğü
  const cg = document.getElementById('taskCountGroup');
  if (cg) cg.style.display = (t.type==='soru') ? 'block' : 'none';
  document.getElementById('taskSaveBtn').onclick = () => saveEditTask(idx);
  document.querySelector('#addTaskModal .modal-title').textContent = '✏️ Görevi Düzenle';
  openModal('addTaskModal');
}

async function saveEditTask(idx) {
  const t = tasks[idx];
  if (!t) return;
  const updates = {
    student: document.getElementById('taskStudent').value,
    title: document.getElementById('taskTitle').value.trim(),
    subject: document.getElementById('taskSubject').value,
    desc: document.getElementById('taskDesc').value.trim(),
    due: document.getElementById('taskDue').value,
    dueRaw: document.getElementById('taskDue').value,
  };
  if (!updates.title) { showToast('⚠️','Başlık boş olamaz!'); return; }
  Object.assign(t, updates);
  if (t.id) {
    try { await db.collection('tasks').doc(t.id).update(updates); } catch(e) {}
  }
  closeModal('addTaskModal');
  // Butonları sıfırla
  document.getElementById('taskSaveBtn').onclick = saveTask;
  document.querySelector('#addTaskModal .modal-title').textContent = '📋 Görev Ata';
  showToast('✅','Görev güncellendi!');
  showPage('tasks-teacher');
}

function showDayEntries(dk, dateLabel) {
  const panel = document.getElementById('dayEntriesPanel');
  if (!panel) return;

  const entries = studyEntries.filter(e => e.dateKey === dk);

  if (entries.length === 0) {
    panel.innerHTML = `<div style="text-align:center;padding:12px;color:var(--text2);font-size:0.85rem">📭 ${dateLabel} — giriş yok</div>`;
    panel.style.display = 'block';
    return;
  }

  // Grupla: denemeler + normal
  const denMap = {};
  const normal = [];
  entries.forEach(e => {
    if (e.type === 'deneme') {
      const k = e.examId || (e.topic || 'Deneme');
      if (!denMap[k]) denMap[k] = { title: e.examTitle || e.topic || 'Deneme Sınavı', dersler: [] };
      denMap[k].dersler.push(e);
    } else {
      normal.push(e);
    }
  });

  const totalDur = entries.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = normal.reduce((a,e)=>a+(e.questions||0),0);
  const totalNet = normal.reduce((a,e)=>a+(e.net||0),0);

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-weight:800;font-size:0.9rem">📅 ${dateLabel}</div>
      <div style="font-size:0.72rem;color:var(--text2)">${totalDur}dk${totalQ>0?' · '+totalQ+' soru · Net:'+totalNet.toFixed(1):''}</div>
    </div>`;

  // Denemeler
  Object.values(denMap).forEach(g => {
    const subR = subjects.map(s => {
      const se = g.dersler.find(e=>e.subject===s.name);
      if (!se) return null;
      return { ...s, d:se.correct||0, y:se.wrong||0, net:se.net||0 };
    }).filter(Boolean);
    const lgsR = calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:1})));
    html += `
      <div style="background:var(--accent4)10;border:1px solid var(--accent4)33;border-radius:10px;padding:10px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="font-weight:800;font-size:0.85rem"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> ${g.title}</div>
          <div style="font-size:0.85rem;font-weight:900;color:var(--accent)">${lgsR.puan}<span style="font-size:0.62rem;color:var(--text2)">/500</span></div>
        </div>
        ${subR.map(s=>`
          <div style="display:flex;justify-content:space-between;font-size:0.78rem;padding:3px 0;border-top:1px solid var(--border)">
            <span style="color:var(--${s.cls})">${s.icon} ${s.name}</span>
            <span>D:${s.d} Y:${s.y} <b style="color:var(--accent3)">Net:${s.net.toFixed(2)}</b></span>
          </div>`).join('')}
      </div>`;
  });

  // Normal girişler
  normal.forEach(e => {
    const icon = subjects.find(s=>s.name===e.subject)?.icon||'📚';
    const typeLabel = e.type==='soru'?'📝 Soru':e.type==='konu'?'📖 Konu':e.type==='tekrar'?'🔁 Tekrar':'📚';
    html += `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--border)">
        <span style="font-size:1.1rem">${icon}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:0.85rem">${e.subject}</div>
          <div style="font-size:0.75rem;color:var(--accent)">${typeLabel} · ${e.topic||'Genel'}</div>
          <div style="font-size:0.73rem;color:var(--text2)">⏱${e.duration||0}dk${e.questions>0?' · 📝'+e.questions+' soru · ✅'+(e.correct||0)+' ❌'+(e.wrong||0)+' · Net:'+(e.net||0).toFixed(1):''}</div>
        </div>
        <span style="font-size:0.68rem;color:var(--text2)">${e.time||''}</span>
      </div>`;
  });

  panel.innerHTML = html;
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleDenemeAcc(id) {
  const el = document.getElementById(id);
  const arrow = document.getElementById(id+'_arrow');
  if (!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
}

function toggleDersAcc(id) {
  const el = document.getElementById(id);
  const arrow = document.getElementById(id+'_arrow');
  if (!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
}

