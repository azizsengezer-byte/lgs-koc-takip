
function teacherDashboard() {
  const name = document.getElementById('menuName')?.textContent || 'Hoca';
  const studentCount = students.length;
  const todayKey = getTodayKey();
  const todayEntries = studyEntries.filter(e=>e.dateKey===todayKey);
  const activeToday = new Set(todayEntries.map(e=>e.studentName)).size;
  return `
    <div class="page-title">📊 Ana Panel</div>
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
        <div class="card-title">👥 Öğrenci Durumları</div>
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
              <div class="student-name">${s.name}</div>
              <div class="student-meta">${sTasks} görev • ${totalQ} soru • Bu hafta: ${weekDays2}g</div>
            </div>
            <div style="text-align:right">
              <span class="badge ${activeToday2?'badge-green':'badge-yellow'}" style="font-size:0.7rem">${activeToday2?'✅ Aktif':'⏳ Bekliyor'}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="card">
        <div class="card-title">⚡ Hızlı İşlemler</div>
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
      <div class="card-title">📋 Son Atanan Görevler</div>
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

  return `
    <div class="page-title">👥 Öğrencilerim</div>
    <div class="page-sub">Koçluk takibindeki öğrenciler</div>
    <div style="display:flex;gap:10px;margin-bottom:12px">
      <button class="btn btn-primary" onclick="openModal('addStudentModal')">+ Öğrenci Ekle</button>
      <button class="btn btn-outline" onclick="openTaskModal()">📋 Görev Ata</button>
    </div>
    <!-- Arama -->
    <div style="position:relative;margin-bottom:16px">
      <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text2);font-size:1rem">🔍</span>
      <input type="text" id="studentSearchInput" placeholder="Öğrenci ara..."
        oninput="filterStudentList(this.value)"
        style="width:100%;padding:10px 12px 10px 36px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.92rem;outline:none;box-sizing:border-box">
    </div>
    <div class="card" id="studentListCard">
      ${students.length === 0 ? `
        <div style="text-align:center;padding:40px 20px;color:var(--text2)">
          <div style="font-size:3rem;margin-bottom:12px">👥</div>
          <div style="font-weight:700;margin-bottom:8px">Henüz öğrenci eklenmedi</div>
          <div style="font-size:0.85rem">+ Öğrenci Ekle butonuna basarak başla</div>
        </div>
      ` : students.map((s,i)=>{
        const sEntries = studyEntries.filter(e=>e.studentName===s.name);
        const weekEntries = sEntries.filter(e=>e.dateKey>=weekKey);
        const activeDays = new Set(weekEntries.map(e=>e.dateKey)).size;
        const totalQ = sEntries.reduce((a,e)=>a+(e.questions||0),0);
        const totalNet = sEntries.reduce((a,e)=>a+(e.net||0),0);
        const avgNet = weekEntries.length > 0
          ? (weekEntries.reduce((a,e)=>a+(e.net||0),0) / weekEntries.length).toFixed(1)
          : 0;
        const isActiveToday = sEntries.some(e=>e.dateKey===todayKey);
        const pendingTasks = tasks.filter(t=>t.studentName===s.name && !t.done).length;
        // Durum: son 7 günde 4+ gün aktifse İyi, 2-3 gün Normal, <2 gün Dikkat
        const status = activeDays >= 4 ? 'good' : activeDays >= 2 ? 'normal' : 'warn';
        const statusBadge = status==='good'
          ? `<span class="badge badge-green">✅ Aktif</span>`
          : status==='normal'
          ? `<span class="badge badge-yellow">📊 Normal</span>`
          : `<span class="badge badge-red">⚠️ Dikkat!</span>`;
        // Bugünkü wellness cache'den mood al
        const moodBadge = '';
        return `
        <div class="student-row student-card-item" data-name="${s.name.toLowerCase()}" onclick="openStudentAnalysis('${s.name}')" style="cursor:pointer">
          ${s.photo
            ? `<img src="${s.photo}" style="width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0;cursor:pointer" onclick="event.stopPropagation();showUserProfile('${s.uid}','${s.name}','${s.color}')">`
            : `<div class="student-avatar" style="background:${s.color}20;color:${s.color};font-size:1.1rem;cursor:pointer" onclick="event.stopPropagation();showUserProfile('${s.uid}','${s.name}','${s.color}')">${s.name[0]}</div>`}
          <div class="student-info" style="flex:1">
            <div class="student-name">${s.name}</div>
            <div class="student-meta">Bu hafta ${activeDays} gün • ${totalQ} soru • Net ort: ${avgNet}</div>
            <div style="font-size:0.72rem;color:var(--text2)">${pendingTasks} bekleyen görev • ${isActiveToday?'✅ Bugün aktif':'⏳ Bugün giriş yok'}</div>
            ${moodBadge}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
            ${statusBadge}
            <div style="display:flex;gap:6px">
              <button class="btn btn-outline" style="padding:4px 10px;font-size:0.75rem" onclick="event.stopPropagation();openStudentAnalysis('${s.name}')">📊</button>
              <button class="btn btn-outline" style="padding:4px 10px;font-size:0.75rem;color:#ff6584;border-color:#ff6584" onclick="event.stopPropagation();deleteStudent(${i})">🗑️</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div style="margin-top:20px" class="card">
      <div class="card-title">📋 Haftalık Öğrenci Özeti</div>
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
  vpRole.textContent = data.role==='teacher' ? '👨‍🏫 Koç Öğretmen' : '🎒 Öğrenci';

  const details = [];
  if (data.school) details.push(`🏫 <b>Okul:</b> ${data.school}`);
  if (data.classroom) details.push(`📚 <b>Sınıf:</b> ${data.classroom}`);
  if (data.branch) details.push(`📐 <b>Branş:</b> ${data.branch}`);
  if (data.email) details.push(`✉️ <b>E-posta:</b> ${data.email}`);
  vpDet.innerHTML = details.join('<br>') || '<span style="color:var(--text2)">Bilgi eklenmemiş</span>';

  openModal('viewProfileModal');

  // Çerçeve uygula — Firestore'dan activeFrame oku
  const old = vpPhoto.querySelector('._anyFrameOverlay');
  if (old) old.remove();
  try {
    let frameId = data.activeFrame || localStorage.getItem('frame_'+uid) || 'none';
    // Firestore'dan güncelle (data yetersizse)
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
}

async function editDeneme(examId, currentTitle) {
  const newTitle = prompt('Deneme adını düzenle:', currentTitle);
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
  const net = correct > 0 || wrong > 0 ? correct - wrong/3 : (studyEntries[localIdx]?.net || 0);
  const q = qManual > 0 ? qManual : (correct + wrong);

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
          <div style="font-weight:800;font-size:0.85rem">🎯 ${g.title}</div>
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

function openStudentAnalysis(name) {
  // İki seçenek sun: Bireysel Analiz veya Psikolojik Takip
  selectedStudentName = name;
  const sObj = students.find(s=>s.name===name) || {};
  const initials = name[0];
  const color = sObj.color || '#6c63ff';

  // Basit seçim modalı
  const existing = document.getElementById('_studentChoiceModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_studentChoiceModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:0';
  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:20px 20px 0 0;padding:22px 18px 36px;width:100%;max-width:480px;animation:slideUp .2s ease">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <div style="width:42px;height:42px;border-radius:50%;background:${color}22;color:${color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem">${initials}</div>
        <div>
          <div style="font-weight:800;font-size:1rem">${name}</div>
          <div style="font-size:0.72rem;color:var(--text2)">Hangi raporu görmek istiyorsun?</div>
        </div>
        <button onclick="document.getElementById('_studentChoiceModal').remove()" style="margin-left:auto;background:none;border:none;color:var(--text2);font-size:1.3rem;cursor:pointer">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="document.getElementById('_studentChoiceModal').remove();studentAnalysisPeriod='daily';showPage('student-detail')"
          style="padding:16px;border-radius:14px;background:var(--surface2);border:1.5px solid var(--border);color:var(--text);cursor:pointer;text-align:left;display:flex;align-items:center;gap:14px">
          <span style="font-size:1.6rem">📊</span>
          <div>
            <div style="font-weight:800;font-size:0.95rem">Bireysel Analiz Raporu</div>
            <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Soru çözümü, deneme sonuçları, performans grafikleri</div>
          </div>
        </button>
        <button onclick="document.getElementById('_studentChoiceModal').remove();showPsychReport('${name}')"
          style="padding:16px;border-radius:14px;background:var(--surface2);border:1.5px solid var(--border);color:var(--text);cursor:pointer;text-align:left;display:flex;align-items:center;gap:14px">
          <span style="font-size:1.6rem">💙</span>
          <div>
            <div style="font-weight:800;font-size:0.95rem">Psikolojik Takip Raporu</div>
            <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Duygu durumu, enerji, kaygı ve uyku takibi</div>
          </div>
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
}

function studentDetailAnalysis() {
  const sName = selectedStudentName;
  if (!sName) return `<div class="page-title">Öğrenci seçilmedi</div>`;
  const sObj = students.find(s=>s.name===sName) || { color:'#6c63ff' };
  const sUid = sObj.uid || '';
  const now = new Date();
  const todayKey = getDateKey(now);
  const matchE = e => e.studentName===sName || (sUid && e.userId===sUid);

  // Dönem filtresi
  const monday = new Date(now); monday.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
  const mondayKey = monday.toISOString().split('T')[0];
  const monthStart = todayKey.substring(0,7)+'-01';
  let filtered = [], periodLabel = '';
  if (studentAnalysisPeriod==='daily') { filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey===todayKey); periodLabel='Bugün'; }
  else if (studentAnalysisPeriod==='weekly') { filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey>=mondayKey); periodLabel='Bu Hafta'; }
  else { filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey>=monthStart); periodLabel='Bu Ay'; }
  const allEntries = studyEntries.filter(e=>matchE(e));

  const soruEntries = filtered.filter(e=>e.type==='soru');
  const nonDeneme = filtered.filter(e=>e.type!=='deneme');
  const totalDur = nonDeneme.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = soruEntries.reduce((a,e)=>a+(e.questions||0),0);
  const totalD = soruEntries.reduce((a,e)=>a+(e.correct||0),0);
  const totalY = soruEntries.reduce((a,e)=>a+(e.wrong||0),0);
  const totalNet = soruEntries.reduce((a,e)=>a+(e.net||0),0);
  const activeDays = new Set(filtered.map(e=>e.dateKey)).size;
  const netRate = totalQ>0?Math.round(totalD/totalQ*100):0;

  // Ders istatistikleri
  const maxQ = Math.max(...subjects.map(s=>soruEntries.filter(e=>e.subject===s.name).reduce((a,e)=>a+(e.questions||0),0)),1);
  const subStats = subjects.map(s=>{
    const se=soruEntries.filter(e=>e.subject===s.name);
    const q=se.reduce((a,e)=>a+(e.questions||0),0);
    const d=se.reduce((a,e)=>a+(e.correct||0),0);
    const y=se.reduce((a,e)=>a+(e.wrong||0),0);
    const net=se.reduce((a,e)=>a+(e.net||0),0);
    const dur=nonDeneme.filter(e=>e.subject===s.name).reduce((a,e)=>a+(e.duration||0),0);
    const pct=q>0?Math.round(d/q*100):0;
    return {...s,q,d,y,net,dur,pct};
  });

  // Son 7 gün trend
  const trendDays = Array.from({length:7},(_,i)=>{
    const d=new Date(now); d.setDate(now.getDate()-6+i);
    const dk=d.toISOString().split('T')[0];
    const dayE=allEntries.filter(e=>e.dateKey===dk&&e.type==='soru');
    return { dk, label:d.toLocaleDateString('tr-TR',{weekday:'short'}),
      q:dayE.reduce((a,e)=>a+(e.questions||0),0), net:dayE.reduce((a,e)=>a+(e.net||0),0) };
  });
  const maxTQ = Math.max(...trendDays.map(t=>t.q),1);
  const maxTN = Math.max(...trendDays.map(t=>t.net),1);

  // Korelasyon analizi — seçili döneme göre psiko vs akademik
  const wellnessLocal = (() => { try { return JSON.parse(localStorage.getItem('wellness_'+sUid)||'{}'); } catch(e){ return {}; } })();
  const wDays = wellnessLocal.days || {};
  const korelasyonInsights = [];

  // Seçili döneme göre gün listesi oluştur
  const periodStart = studentAnalysisPeriod==='daily' ? todayKey
    : studentAnalysisPeriod==='weekly' ? mondayKey : monthStart;
  const allPeriodKeys = Object.keys(wDays).filter(k=>k>=periodStart).sort();
  // Akademik verisi olan günler için eşleştir
  const periodDataDays = allPeriodKeys.map(dk=>{
    const we=wDays[dk]||{};
    const ac=allEntries.filter(e=>e.dateKey===dk&&e.type==='soru');
    return { dk, kaygi:parseFloat(we.kaygi)||0, uyku:parseFloat(we.uyku)||0,
      ekran:parseFloat(we.ekran)||0, enerji:parseFloat(we.enerji)||0,
      net:ac.reduce((a,e)=>a+(e.net||0),0), q:ac.reduce((a,e)=>a+(e.questions||0),0) };
  });

  const minDays = studentAnalysisPeriod==='monthly' ? 3 : 2;
  const wDataDays = periodDataDays.filter(d=>d.kaygi>0||d.uyku>0);
  const korLabel = studentAnalysisPeriod==='monthly' ? 'Bu ay' : studentAnalysisPeriod==='weekly' ? 'Bu hafta' : 'Bugün';

  if (wDataDays.length>=minDays) {
    // Uyku-başarı korelasyonu
    const highSleep = wDataDays.filter(d=>d.uyku>=7&&d.q>0);
    const lowSleep = wDataDays.filter(d=>d.uyku>0&&d.uyku<6&&d.q>0);
    if (highSleep.length>0&&lowSleep.length>0) {
      const avgNetHS = highSleep.reduce((a,d)=>a+d.net,0)/highSleep.length;
      const avgNetLS = lowSleep.reduce((a,d)=>a+d.net,0)/lowSleep.length;
      if (Math.abs(avgNetHS-avgNetLS)>0.3) korelasyonInsights.push(`💤 ${korLabel} uyku süresi 7+ saat olan günlerde ortalama net ${avgNetHS.toFixed(1)}, 6 saat altında ise ${avgNetLS.toFixed(1)}. ${avgNetHS>avgNetLS?'Uyku kalitesi akademik performansı olumlu etkiliyor.':'Uyku artmasına rağmen performans farkı beklendiği kadar değil.'}`);
    }
    // Kaygı-başarı korelasyonu
    const highAnx = wDataDays.filter(d=>d.kaygi>=7&&d.q>0);
    const lowAnx = wDataDays.filter(d=>d.kaygi>0&&d.kaygi<=4&&d.q>0);
    if (highAnx.length>0&&lowAnx.length>0) {
      const avgNetHA = highAnx.reduce((a,d)=>a+d.net,0)/highAnx.length;
      const avgNetLA = lowAnx.reduce((a,d)=>a+d.net,0)/lowAnx.length;
      if (Math.abs(avgNetHA-avgNetLA)>0.3) korelasyonInsights.push(`😰 ${korLabel} kaygı skoru yüksek günlerde (7+) net ortalama ${avgNetHA.toFixed(1)}, düşük kaygılı günlerde ise ${avgNetLA.toFixed(1)}. ${avgNetHA<avgNetLA?'Yüksek kaygı performansı olumsuz etkiliyor.':'Kaygıya rağmen performans korunuyor.'}`);
    }
    // Ekran süresi korelasyonu
    const highScreen = wDataDays.filter(d=>d.ekran>=3&&d.q>0);
    const lowScreen = wDataDays.filter(d=>d.ekran>0&&d.ekran<=1.5&&d.q>0);
    if (highScreen.length>0&&lowScreen.length>0) {
      const avgNetHSc = highScreen.reduce((a,d)=>a+d.net,0)/highScreen.length;
      const avgNetLSc = lowScreen.reduce((a,d)=>a+d.net,0)/lowScreen.length;
      if (Math.abs(avgNetHSc-avgNetLSc)>0.3) korelasyonInsights.push(`📱 ${korLabel} ekran süresi 3+ saat olan günlerde net ${avgNetHSc.toFixed(1)}, 1.5 saat altında ise ${avgNetLSc.toFixed(1)}. ${avgNetHSc<avgNetLSc?'Ekran süresini azaltmak performansı artırabilir.':'Ekran süresi bu dönemde performansı belirgin etkilemiyor.'}`);
    }
    // Enerji trendi (son 3-5 gün)
    const recentDays = wDataDays.slice(-Math.min(5,wDataDays.length));
    const energyTrend = recentDays.map(d=>d.enerji).filter(e=>e>0);
    if (energyTrend.length>=3) {
      const first = energyTrend.slice(0,Math.floor(energyTrend.length/2));
      const last = energyTrend.slice(Math.floor(energyTrend.length/2));
      const avgFirst = first.reduce((a,b)=>a+b,0)/first.length;
      const avgLast = last.reduce((a,b)=>a+b,0)/last.length;
      if (avgFirst-avgLast>1) korelasyonInsights.push(`⚡ ${korLabel} enerji seviyesi düşüş eğiliminde (${energyTrend.join(' → ')}). Motivasyon desteği ve dinlenme önerilir.`);
      else if (avgLast-avgFirst>1) korelasyonInsights.push(`⚡ ${korLabel} enerji seviyesi yükseliş eğiliminde (${energyTrend.join(' → ')}). Bu ivmeyi akademik çalışmaya yönlendirme iyi bir fırsat.`);
    }
    // Aylık özet — ek istatistik
    if (studentAnalysisPeriod==='monthly' && wDataDays.length>=7) {
      const avgKaygi = wDataDays.reduce((a,d)=>a+d.kaygi,0)/wDataDays.filter(d=>d.kaygi>0).length;
      const avgUyku = wDataDays.filter(d=>d.uyku>0).reduce((a,d)=>a+d.uyku,0)/wDataDays.filter(d=>d.uyku>0).length||0;
      const netTrend = wDataDays.filter(d=>d.q>0);
      if (netTrend.length>=4) {
        const firstHalf = netTrend.slice(0,Math.floor(netTrend.length/2));
        const secondHalf = netTrend.slice(Math.floor(netTrend.length/2));
        const avgFirst = firstHalf.reduce((a,d)=>a+d.net,0)/firstHalf.length;
        const avgSecond = secondHalf.reduce((a,d)=>a+d.net,0)/secondHalf.length;
        if (avgSecond-avgFirst>0.5) korelasyonInsights.push(`📈 Bu ay akademik performans ikinci yarıda ilerleme gösterdi (Ort. net: ${avgFirst.toFixed(1)} → ${avgSecond.toFixed(1)}). Kaygı ort. ${avgKaygi.toFixed(1)}/10, uyku ort. ${avgUyku.toFixed(1)} saat.`);
        else if (avgFirst-avgSecond>0.5) korelasyonInsights.push(`📉 Bu ay akademik performans ikinci yarıda geriledi (Ort. net: ${avgFirst.toFixed(1)} → ${avgSecond.toFixed(1)}). Kaygı ort. ${avgKaygi.toFixed(1)}/10, uyku ort. ${avgUyku.toFixed(1)} saat. Nedenler incelenmeli.`);
      }
    }
  }

  // Deneme sonuçları (son 3)
  const denemeler = {};
  allEntries.filter(e=>e.type==='deneme').forEach(e=>{
    const k=e.examId||(e.dateKey+'_'+e.subject);
    if(!denemeler[k]) denemeler[k]={title:e.examTitle||'Deneme',dk:e.dateKey,entries:[]};
    denemeler[k].entries.push(e);
  });
  const denList = Object.values(denemeler).sort((a,b)=>(b.dk||'').localeCompare(a.dk||'')).slice(0,3);

  // Genel koç yorumu
  const strong = subStats.filter(s=>s.q>0).sort((a,b)=>b.pct-a.pct)[0];
  const weak = subStats.filter(s=>s.q>0).sort((a,b)=>a.pct-b.pct)[0];
  const commentParts = [];
  if (totalQ>0) commentParts.push(`${sName.split(' ')[0]} ${periodLabel.toLowerCase()} ${totalQ} soru çözdü, %${netRate} isabet oranıyla ${netRate>=80?'güçlü bir':'geliştirilmesi gereken'} performans sergiledi.`);
  if (strong&&strong.q>0) commentParts.push(`${strong.name} dersinde %${strong.pct} ile en yüksek isabet oranına ulaştı.`);
  if (weak&&weak.q>0&&weak.pct<70) commentParts.push(`${weak.name} dersinde %${weak.pct} isabet oranı dikkat gerektiriyor.`);
  if (activeDays<(studentAnalysisPeriod==='weekly'?4:15)) commentParts.push(`Düzenlilik konusunda iyileştirme gerekiyor — ${activeDays} gün aktif.`);

  // Deneme özeti — LGS puanı ve ders ortalamaları
  const lgsDenemeOzeti = (() => {
    const dEntries = allEntries.filter(e=>e.type==='deneme');
    if (dEntries.length < 2) return null;
    // examId bazlı grupla
    const dGrup = {};
    dEntries.forEach(e=>{
      const k = e.examId||e.dateKey;
      if(!dGrup[k]) dGrup[k] = {dateKey:e.dateKey, dersler:{}};
      const net = Math.max(0, (e.correct||0)-(e.wrong||0)/3);
      if(!dGrup[k].dersler[e.subject]) dGrup[k].dersler[e.subject] = [];
      dGrup[k].dersler[e.subject].push(net);
    });
    const denemeler = Object.values(dGrup).sort((a,b)=>a.dateKey.localeCompare(b.dateKey));
    // Her denemede toplam net → LGS puan tahmini
    // LGS yaklaşık formül: puan = 100 + toplamNet * 4.444 (500 max, 90 soru tam net)
    const lgsPuanHesapla = (dersler) => {
      const topNet = Object.values(dersler).reduce((a,arr)=>a+arr.reduce((x,y)=>x+y,0),0);
      return Math.round(100 + topNet * 4.444);
    };
    const puanlar = denemeler.map(d=>lgsPuanHesapla(d.dersler));
    const ortPuan = Math.round(puanlar.reduce((a,b)=>a+b,0)/puanlar.length);
    const son = puanlar[puanlar.length-1];
    const ilk = puanlar[0];
    // Trend
    const trend = puanlar.length>=3
      ? (son>ilk+10?'artış trendi var':son>ilk?'hafif yükseliş var':'stabil gidiyor')
      : (son>ilk?'artış var':'stabil');
    // Ders bazlı ortalama net
    const dersOrt = {};
    const lgsSoru = {'Türkçe':20,'Matematik':20,'Fen Bilimleri':20,'İnkılap Tarihi':10,'Din Kültürü':10,'İngilizce':10};
    denemeler.forEach(d=>{
      Object.entries(d.dersler).forEach(([ders,netArr])=>{
        if(!dersOrt[ders]) dersOrt[ders]={topNet:0,count:0,max:lgsSoru[ders]||10};
        dersOrt[ders].topNet += netArr.reduce((a,b)=>a+b,0);
        dersOrt[ders].count++;
      });
    });
    const dersSirali = Object.entries(dersOrt)
      .map(([d,v])=>({d, ort:Math.round(v.topNet/v.count*10)/10, max:v.max, pct:Math.round(v.topNet/v.count/v.max*100)}))
      .filter(x=>x.count>0||x.ort>0);
    const enYuksek = dersSirali.sort((a,b)=>b.pct-a.pct)[0];
    const enDusuk  = dersSirali.sort((a,b)=>a.pct-b.pct)[0];
    return {ortPuan, son, trend, enYuksek, enDusuk, count:denemeler.length};
  })();

  if (lgsDenemeOzeti) {
    const {ortPuan, son, trend, enYuksek, enDusuk, count} = lgsDenemeOzeti;
    commentParts.push(
      `${count} denemede LGS puan ortalaması yaklaşık ${ortPuan}/500; ` +
      `son deneme ${son} puan, ${trend}. ` +
      (enYuksek ? `En yüksek net ortalaması ${enYuksek.d} (ort. ${enYuksek.ort}/${enYuksek.max}, %${enYuksek.pct} doluluk). ` : '') +
      (enDusuk&&enDusuk.d!==enYuksek?.d ? `En düşük net ortalaması ${enDusuk.d} (ort. ${enDusuk.ort}/${enDusuk.max}, %${enDusuk.pct} doluluk) — öncelikli çalışma alanı.` : '')
    );
  }

  const comment = commentParts.join(' ') || `${sName.split(' ')[0]} için bu dönemde henüz yeterli veri yok.`;

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <button onclick="showPage('students')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem">←</button>
      <div class="page-title" style="margin:0">📊 ${sName}</div>
    </div>
    <div class="page-sub">Bireysel Analiz Raporu</div>

    <!-- Dönem seçici -->
    <div style="display:flex;gap:6px;margin-bottom:12px;background:var(--surface2);border-radius:12px;padding:4px">
      ${['daily','weekly','monthly'].map((p,i)=>{
        const lbl=['Günlük','Haftalık','Aylık'][i];
        return `<button onclick="studentAnalysisPeriod='${p}';showPage('student-detail')"
          style="flex:1;padding:8px 4px;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;
          background:${studentAnalysisPeriod===p?'var(--accent)':'transparent'};
          color:${studentAnalysisPeriod===p?'#fff':'var(--text2)'};transition:.2s">${lbl}</button>`;
      }).join('')}
    </div>

    <!-- Özet kartlar -->
    <div class="grid-3" style="margin-bottom:12px">
      <div class="stat-card">
        <div class="stat-label">Süre</div>
        <div class="stat-value" style="color:var(--accent)">${totalDur}<span style="font-size:0.75rem">dk</span></div>
        <div class="stat-change">${activeDays} gün aktif</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Soru</div>
        <div class="stat-value" style="color:var(--accent4)">${totalQ}</div>
        <div class="stat-change">✅${totalD} ❌${totalY}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Net</div>
        <div class="stat-value" style="color:var(--accent3)">${totalNet.toFixed(1)}</div>
        <div class="stat-change">${totalQ>0?netRate+'% isabet':'-'}</div>
      </div>
    </div>

    <!-- Rapor Al -->
    <div style="margin-bottom:12px">
      <button onclick="toggleRaporAl('${sName.replace(/\s/g,'_')}')"
        style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;color:var(--text);cursor:pointer;font-weight:700;font-size:0.9rem">
        <span>📥 Rapor Al</span>
        <span id="raporAlArrow_${sName.replace(/\s/g,'_')}" style="transition:.2s;font-size:0.8rem">▼</span>
      </button>
      <div id="raporAlPanel_${sName.replace(/\s/g,'_')}" style="display:none;margin-top:6px;padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:12px">
        <div style="display:flex;gap:8px">
          <button onclick="(()=>{const now=new Date();const dk=getDateKey(now);const dateStr=now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});window._pdfDateOverride={mode:'daily',startKey:dk,endKey:dk,label:'Günlük',title:dateStr+' Günlük Rapor'};preparePdfLink('${sName}',this).finally(()=>{window._pdfDateOverride=null;});})()"
            class="dp-btn-pdf"
            style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
            📋 Günlük
          </button>
          <button onclick="openDatePicker('${sName}','weekly')"
            style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
            📅 Haftalık
          </button>
          <button onclick="openDatePicker('${sName}','monthly')"
            style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
            📆 Aylık
          </button>
        </div>
      </div>
    </div>

    <!-- Son 7 gün trend — tıklanabilir -->
    ${studentAnalysisPeriod!=='daily'?`
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">📅 Son 7 Gün — Soru & Net Trendi</div>
      <div style="display:flex;gap:4px;align-items:flex-end;height:100px;padding-bottom:20px;box-sizing:border-box">
        ${trendDays.map(t=>{
          const hQ=t.q>0?Math.max(Math.round((t.q/maxTQ)*60),6):0;
          const hN=t.net>0?Math.max(Math.round((t.net/maxTN)*60),6):0;
          const isToday=t.dk===todayKey;
          const dl=new Date(t.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'short'});
          return `<div style="flex:1;text-align:center;cursor:pointer;position:relative" onclick="showDayEntries('${t.dk}','${dl}')">
            <div style="font-size:0.55rem;color:var(--text2);position:absolute;top:-16px;left:0;right:0;text-align:center">${t.q>0?t.q:''}</div>
            <div style="display:inline-block;width:45%;height:${hQ}px;background:${isToday?'var(--accent)':'#6c63ff99'};border-radius:2px 2px 0 0;vertical-align:bottom"></div><div style="display:inline-block;width:45%;height:${hN}px;background:${isToday?'var(--accent3)':'#43e97b99'};border-radius:2px 2px 0 0;vertical-align:bottom"></div>
            <div style="font-size:0.55rem;color:${isToday?'var(--accent)':'var(--text2)'};position:absolute;bottom:-18px;left:0;right:0;text-align:center">${t.label}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:4px;font-size:0.68rem;color:var(--text2)">
        <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;background:var(--accent);border-radius:2px;display:inline-block"></span>Soru</span>
        <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;background:var(--accent3);border-radius:2px;display:inline-block"></span>Net</span>
      </div>
      <div style="font-size:0.72rem;color:var(--text2);text-align:center;margin-top:6px">Güne tıkla → detayları gör</div>
    </div>
    <!-- Seçili gün detay paneli -->
    <div id="dayEntriesPanel" style="display:none;margin-bottom:12px" class="card"></div>`
    : ''}

    <!-- Ders bazlı detay — konu accordion -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">📚 Ders Bazlı Detay — ${periodLabel}</div>
      ${filtered.length===0
        ? `<div style="text-align:center;padding:24px;color:var(--text2)">Bu dönemde veri yok</div>`
        : subStats.map(s=>{
          const accId='dersAcc_'+s.name.replace(/\s/g,'_');
          const topicMap={};
          filtered.filter(e=>e.type==='soru'&&e.subject===s.name).forEach(e=>{
            const t=e.topic||'Genel';
            if(!topicMap[t]) topicMap[t]={q:0,d:0,y:0};
            topicMap[t].q+=(e.questions||0); topicMap[t].d+=(e.correct||0); topicMap[t].y+=(e.wrong||0);
          });
          const topics=Object.entries(topicMap);
          return `
          <div style="border-bottom:1px solid var(--border)">
            <div onclick="toggleDersAcc('${accId}')" style="padding:10px 0;cursor:pointer">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
                <span style="font-weight:700;font-size:0.85rem;color:var(--${s.cls})">${s.icon} ${s.name}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:0.7rem;color:var(--text2)">${s.dur}dk • ${s.q} soru • Net <b style="color:var(--accent3)">${s.net.toFixed(1)}</b></span>
                  <span id="${accId}_arrow" style="color:var(--text2);font-size:0.7rem;transition:.2s">▼</span>
                </div>
              </div>
              <div class="bar-bg" style="height:6px"><div class="bar-fill bg-${s.cls}" style="width:${Math.round(s.q/maxQ*100)}%"></div></div>
              ${s.q>0?`<div style="font-size:0.7rem;color:var(--text2);margin-top:3px">✅${s.d} ❌${s.y} • 🎯%${s.pct}</div>`:''}
            </div>
            <div id="${accId}" style="display:none;padding-bottom:8px">
              ${topics.length===0?`<div style="font-size:0.78rem;color:var(--text2)">Konu detayı yok</div>`:
                topics.map(([t,td])=>`
                <div style="display:flex;justify-content:space-between;padding:7px 10px;background:var(--surface2);border-radius:8px;margin-bottom:4px">
                  <span style="font-size:0.78rem;font-weight:600">${t}</span>
                  <span style="font-size:0.7rem;color:var(--text2)">✅${td.d} ❌${td.y} • Net ${(td.d-td.y/3).toFixed(1)}</span>
                </div>`).join('')}
            </div>
          </div>`;
        }).join('')}
    </div>

    <!-- Deneme sonuçları son 3 -->
    ${denList.length>0?`
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">🎯 Son Denemeler</div>
      ${denList.slice(0,3).map((d,di)=>{
        const subR=subjects.map(s=>{ const e=d.entries.find(e=>e.subject===s.name); if(!e) return {name:s.name,cls:s.cls,icon:s.icon,d:0,y:0,net:0,hasData:false}; return {name:s.name,cls:s.cls,icon:s.icon,d:e.correct||0,y:e.wrong||0,net:e.net||0,hasData:true}; });
        const lgsR=calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:s.net>0?1:0})));
        const dateL=d.dk?new Date(d.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}):'';
        const detailId='denDetail_'+di+'_'+sName.replace(/\s/g,'_');
        return `
        <div style="border-bottom:1px solid var(--border)">
          <div onclick="(()=>{const el=document.getElementById('${detailId}');const arr=document.getElementById('${detailId}_arr');if(!el)return;const open=el.style.display!=='none';el.style.display=open?'none':'block';arr.textContent=open?'▼':'▲';})()"
            style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;cursor:pointer">
            <div>
              <div style="font-weight:700;font-size:0.85rem">${d.title}</div>
              <div style="font-size:0.72rem;color:var(--text2)">${dateL}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:1.2rem;font-weight:900;color:var(--accent)">${lgsR.puan}<span style="font-size:0.65rem;color:var(--text2)">/500</span></div>
              <span id="${detailId}_arr" style="color:var(--text2);font-size:0.75rem;transition:.2s">▼</span>
            </div>
          </div>
          <div id="${detailId}" style="display:none;padding-bottom:10px">
            ${subR.filter(s=>s.hasData).map(s=>`
              <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;background:var(--surface2);border-radius:8px;margin-bottom:4px">
                <span style="font-size:0.78rem;font-weight:700;color:var(--${s.cls})">${s.icon} ${s.name}</span>
                <span style="font-size:0.75rem;color:var(--text2)">✅${s.d} ❌${s.y} <b style="color:var(--accent3)">Net:${s.net.toFixed(2)}</b></span>
              </div>`).join('')}
            <div style="display:flex;justify-content:flex-end;margin-top:6px">
              <div style="font-size:0.78rem;color:var(--text2)">Tahmini Puan: <b style="color:var(--accent);font-size:0.9rem">${lgsR.puan}</b><span style="font-size:0.65rem">/500</span></div>
            </div>
          </div>
        </div>`;}).join('')}
    </div>`:''}

    <!-- Psikolojik-Akademik Korelasyon -->
    ${korelasyonInsights.length>0?`
    <div class="card" style="margin-bottom:12px;border:1px solid #6c63ff44;background:linear-gradient(135deg,#6c63ff0a,#fd79a80a)">
      <div class="card-title">🔗 Psikolojik-Akademik Korelasyon</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:10px">${periodLabel} psikolojik veri ile akademik performans karşılaştırması:</div>
      ${korelasyonInsights.map(ins=>`
        <div style="padding:10px 12px;background:var(--surface2);border-radius:10px;margin-bottom:8px;font-size:0.83rem;line-height:1.6;color:var(--text)">
          ${ins}
        </div>`).join('')}
    </div>`:''}

    <!-- Rozet Özeti -->
    <div class="card" id="studentBadgeCard" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-title" style="margin:0">🏆 Rozetler</div>
        <span id="studentBadgeCount" style="font-size:0.78rem;color:var(--text2)">-</span>
      </div>
      <div id="studentBadgeGrid" style="display:flex;flex-wrap:wrap;gap:6px;min-height:30px">
        <div style="color:var(--text2);font-size:0.8rem">Yükleniyor...</div>
      </div>
    </div>

    <!-- Koç Yorumu -->
    <div class="card" style="margin-bottom:16px;background:linear-gradient(135deg,var(--accent)10,var(--accent)04);border:1px solid var(--accent)33">
      <div class="card-title">🧑‍🏫 Koç Değerlendirmesi</div>
      <div style="font-size:0.86rem;line-height:1.75;color:var(--text)">${comment}</div>
    </div>
  `;
  // Rozet grid'ini async doldur
  setTimeout(async ()=>{
    const sObj2 = students.find(s=>s.name===selectedStudentName)||{};
    const sUid2 = sObj2.uid||'';
    if (!sUid2) return;
    const earned2 = await getBadges(sUid2);
    const countEl = document.getElementById('studentBadgeCount');
    const gridEl  = document.getElementById('studentBadgeGrid');
    if (countEl) countEl.textContent = earned2.length + ' / ' + BADGES.length + ' rozet';
    if (gridEl) {
      if (earned2.length === 0) {
        gridEl.innerHTML = '<span style="color:var(--text2);font-size:0.8rem">Henüz rozet kazanılmadı</span>';
      } else {
        gridEl.innerHTML = BADGES.filter(b=>earned2.includes(b.id))
          .slice(0,12)
          .map(b=>`<span title="${b.name}: ${b.desc}" style="font-size:1.4rem;cursor:default">${b.icon}</span>`)
          .join('') + (earned2.length>12?`<span style="font-size:0.75rem;color:var(--text2);align-self:center">+${earned2.length-12} daha</span>`:'');
      }
    }
  }, 200);
}

function showPsychReport(sName) {
  selectedStudentName = sName;
  window._psychPeriod = 'daily';
  showPage('psych-report');
}

function openGorusmeModal(sName, sUid) {
  const existing = document.getElementById('_gorusmeModal');
  if (existing) existing.remove();
  const now = new Date();
  // Seçili tarih state
  let seciliYil = now.getFullYear();
  let seciliAy  = now.getMonth();
  let seciliGun = now.getDate();

  function takvimHtml(yil, ay, secGun) {
    const ayAdlari = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    const ilkGun = new Date(yil, ay, 1).getDay(); // 0=Pazar
    const pazartesiOffset = ilkGun === 0 ? 6 : ilkGun - 1;
    const sonGun = new Date(yil, ay + 1, 0).getDate();
    let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <button onclick="gorusmeTakvimAy(-1)" style="background:none;border:none;color:var(--text);font-size:1.2rem;cursor:pointer;padding:4px 10px">‹</button>
      <div style="font-weight:700;font-size:0.9rem">${ayAdlari[ay]} ${yil}</div>
      <button onclick="gorusmeTakvimAy(1)" style="background:none;border:none;color:var(--text);font-size:1.2rem;cursor:pointer;padding:4px 10px">›</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:4px">
      ${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(g=>`<div style="text-align:center;font-size:0.65rem;color:var(--text2);padding:3px 0;font-weight:700">${g}</div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">`;
    for (let i = 0; i < pazartesiOffset; i++) html += `<div></div>`;
    for (let g = 1; g <= sonGun; g++) {
      const isSecili = g === secGun;
      const isToday  = g === now.getDate() && ay === now.getMonth() && yil === now.getFullYear();
      html += `<button onclick="gorusmeTakvimGun(${g})"
        style="aspect-ratio:1;border-radius:50%;border:none;cursor:pointer;font-size:0.78rem;font-weight:${isSecili||isToday?'800':'400'};
               background:${isSecili?'var(--accent)':'transparent'};
               color:${isSecili?'#fff':isToday?'var(--accent)':'var(--text)'}">${g}</button>`;
    }
    html += `</div>`;
    return html;
  }

  function tarihStr(y, m, d) {
    const ayAdlari = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    return `${d} ${ayAdlari[m]} ${y}`;
  }

  const modal = document.createElement('div');
  modal.id = '_gorusmeModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  function render() {
    modal.innerHTML = `
    <div style="background:var(--surface);border-radius:20px 20px 0 0;padding:22px 18px 36px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto">
      <div style="font-weight:800;font-size:1rem;margin-bottom:16px">🗣️ Görüşme Kaydı — ${sName.split(' ')[0]}</div>

      <!-- Tarih seçici -->
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">📅 Görüşme Tarihi</div>
      <div id="_gorusmeTakvimWrap" style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:12px">
        ${takvimHtml(seciliYil, seciliAy, seciliGun)}
      </div>
      <div style="text-align:center;font-size:0.82rem;font-weight:700;color:var(--accent);margin-bottom:12px">
        Seçilen: ${tarihStr(seciliYil, seciliAy, seciliGun)}
      </div>

      <!-- Durum -->
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">Durum</div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button id="_gBtn_yapildi" onclick="
          document.getElementById('_gorusmeDurum').value='yapildi';
          this.style.background='var(--accent)';this.style.color='#fff';this.style.borderColor='var(--accent)';
          document.getElementById('_gBtn_planlandi').style.background='transparent';document.getElementById('_gBtn_planlandi').style.color='var(--text2)';document.getElementById('_gBtn_planlandi').style.borderColor='var(--border)'"
          style="flex:1;padding:9px;border-radius:10px;background:var(--accent);border:1.5px solid var(--accent);color:#fff;font-weight:700;font-size:0.82rem;cursor:pointer">✅ Görüşme Yapıldı</button>
        <button id="_gBtn_planlandi" onclick="
          document.getElementById('_gorusmeDurum').value='planlandi';
          this.style.background='var(--accent)';this.style.color='#fff';this.style.borderColor='var(--accent)';
          document.getElementById('_gBtn_yapildi').style.background='transparent';document.getElementById('_gBtn_yapildi').style.color='var(--text2)';document.getElementById('_gBtn_yapildi').style.borderColor='var(--border)'"
          style="flex:1;padding:9px;border-radius:10px;background:transparent;border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">📅 Planlandı</button>
      </div>
      <input type="hidden" id="_gorusmeDurum" value="yapildi">

      <!-- Not -->
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">Görüşme Notu (opsiyonel)</div>
      <textarea id="_gorusmeNot" placeholder="Görüşme içeriği, öğrencinin durumu, alınan kararlar..."
        style="width:100%;padding:9px 12px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.85rem;resize:none;height:80px;box-sizing:border-box;outline:none;margin-bottom:16px;font-family:inherit"></textarea>

      <div style="display:flex;gap:8px">
        <button onclick="saveGorusme('${sName}','${sUid}')"
          style="flex:1;padding:12px;border-radius:12px;background:var(--accent);border:none;color:#fff;font-weight:800;font-size:0.92rem;cursor:pointer">💾 Kaydet</button>
        <button onclick="document.getElementById('_gorusmeModal').remove()"
          style="padding:12px 16px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);color:var(--text2);font-weight:700;cursor:pointer">İptal</button>
      </div>
    </div>`;
  }

  // Global fonksiyonlar — takvim navigasyonu
  window.gorusmeTakvimAy = (yon) => {
    seciliAy += yon;
    if (seciliAy > 11) { seciliAy = 0; seciliYil++; }
    if (seciliAy < 0)  { seciliAy = 11; seciliYil--; }
    render();
  };
  window.gorusmeTakvimGun = (gun) => {
    seciliGun = gun;
    render();
    // Seçili tarihi hidden input'a yaz
    window._gorusmeTarihVal = { y: seciliYil, m: seciliAy, d: gun };
  };

  window._gorusmeTarihVal = { y: seciliYil, m: seciliAy, d: seciliGun };

  document.body.appendChild(modal);
  render();
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
}

async function saveGorusme(sName, sUid) {
  const durum = document.getElementById('_gorusmeDurum').value;
  const not = document.getElementById('_gorusmeNot').value.trim();
  const tv = window._gorusmeTarihVal || {};
  const ayAdlari = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const tarih = tv.d ? `${tv.d} ${ayAdlari[tv.m]} ${tv.y}` : new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
  const sObj = students.find(s=>s.name===sName) || {};
  const uid = sUid || sObj.uid || '';
  if (!uid) { showToast('⚠️','Öğrenci UID bulunamadı'); return; }
  const yeniGorusme = { tarih, durum, not, olusturma: new Date().toISOString() };
  try {
    const snap = await db.collection('wellness').doc(uid).get();
    const eskiData = snap.exists ? snap.data() : {};
    const mevcut = eskiData.gorusmeler || [];
    mevcut.push(yeniGorusme);
    const yeniData = { ...eskiData, gorusmeler: mevcut };
    await db.collection('wellness').doc(uid).set({ gorusmeler: mevcut }, { merge: true });
    // localStorage'ı da güncelle — render anında güncel veri gelsin
    localStorage.setItem('wellness_'+uid, JSON.stringify(yeniData));
    document.getElementById('_gorusmeModal').remove();
    showToast('✅', 'Görüşme kaydedildi!');
    renderTeacherPage('psych-report', document.getElementById('mainContent'));
  } catch(e) {
    showToast('❌', 'Hata: ' + e.message);
  }
}

async function deleteGorusme(sName, sUid, idx) {
  const ok = await appConfirm('Görüşmeyi Sil', 'Bu görüşme kaydını silmek istediğinize emin misiniz?', true);
  if (!ok) return;
  const sObj = students.find(s=>s.name===sName) || {};
  const uid = sUid || sObj.uid || '';
  if (!uid) { showToast('⚠️','Öğrenci UID bulunamadı'); return; }
  try {
    const snap = await db.collection('wellness').doc(uid).get();
    const mevcut = snap.exists ? (snap.data().gorusmeler || []) : [];
    mevcut.splice(idx, 1);
    await db.collection('wellness').doc(uid).set({ gorusmeler: mevcut }, { merge: true });
    showToast('🗑️', 'Görüşme silindi!');
    renderTeacherPage('psych-report', document.getElementById('mainContent'));
  } catch(e) {
    showToast('❌', 'Hata: ' + e.message);
  }
}

async function psychReportPage() {
  const sName = selectedStudentName;
  const sObj = students.find(s=>s.name===sName) || {};
  const sUid = sObj.uid || '';
  const data = await getWellnessData(sUid || sName);
  const days = data.days || {};
  const period = window._psychPeriod || 'daily';

  // Dönem filtresi
  const now = new Date();
  const todayKey = getDateKey(now);
  let startKey, endKey;
  if (period === 'daily') {
    startKey = todayKey; endKey = todayKey;
  } else if (period === 'weekly') {
    const mon = new Date(now); mon.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
    startKey = mon.toISOString().split('T')[0];
    const sun = new Date(mon); sun.setDate(mon.getDate()+6);
    endKey = sun.toISOString().split('T')[0];
  } else {
    startKey = todayKey.substring(0,7)+'-01'; endKey = todayKey;
  }
  const sortedDays = Object.keys(days).filter(k=>k>=startKey&&k<=endKey).sort().reverse();
  const allSortedDays = Object.keys(days).sort().reverse().slice(0,30);

  const moodLabels = { excited:'Heyecanlı', good:'İyiyim', focused:'Odaklı', ok:'İdare Eder', tired:'Yorgunum', anxious:'Kaygılı', sad:'Mutsuzum' };
  const moodEmojis = { excited:'🔥', good:'😊', focused:'🎯', ok:'😐', tired:'😔', anxious:'😰', sad:'😢' };
  const moodColors = { excited:'#f9ca24', good:'#45b7d1', focused:'#6c63ff', ok:'#a29bfe', tired:'#fd79a8', anxious:'#ff6b6b', sad:'#778ca3' };
  const alertMoods = ['tired','anxious','sad'];

  // İstatistikler (dönem)
  const validDays = sortedDays.filter(k=>days[k]);
  // 3 gün ART ARDA olumsuz duygu kontrolü (son 30 günün sıralı verilerinde)
  const sortedAll30 = Object.keys(days).filter(k=>{
    const d=new Date(k+'T12:00:00'); return (new Date()-d)<=30*24*60*60*1000;
  }).sort().reverse(); // en yeni önce
  let artArdaOlumsuz = 0, maxArtArda = 0;
  sortedAll30.forEach(k=>{
    if(days[k]&&alertMoods.includes(days[k].mood)){artArdaOlumsuz++;maxArtArda=Math.max(maxArtArda,artArdaOlumsuz);}
    else{artArdaOlumsuz=0;}
  });
  // Şu an devam eden ardışık olumsuz gün sayısı
  let suankiArtArda = 0;
  for(const k of sortedAll30){
    if(days[k]&&alertMoods.includes(days[k].mood)) suankiArtArda++;
    else break;
  }
  const alertDays = suankiArtArda; // aktif ardışık olumsuz gün sayısı

  // Bugünkü duygu verisi (günlük sekme için)
  const todayMood = days[todayKey]?.mood || null;
  const todayMoodLabel = moodLabels[todayMood] || null;
  const todayMoodEmoji = moodEmojis[todayMood] || null;
  const todayMoodColor = moodColors[todayMood] || null;

  const avg = (field) => {
    const vals = validDays.map(k=>parseFloat(days[k][field])||0).filter(v=>v>0);
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : '-';
  };

  // Psikolojik ısı haritası — son 30 gün (max-width grid)
  const heatMapDays = Array.from({length:30},(_,i)=>{
    const d=new Date(now); d.setDate(now.getDate()-29+i);
    const dk=getDateKey(d);
    const dayData=days[dk]||{};
    const mood=dayData.mood;
    const col=mood?moodColors[mood]:'transparent';
    const hasData=!!mood;
    return {dk,col,hasData,emoji:moodEmojis[mood]||'',label:d.getDate()};
  });

  // Görüşmeler
  const gorusmeler = Array.isArray(data.gorusmeler) ? data.gorusmeler : [];
  // Görüşme yapıldıysa uyarı kalkıyor
  const gorusmYapildi = gorusmeler.some(g => g.durum === 'yapildi');

  // Uyarı banner
  // - Görüşme yapıldıysa: tamamen boş
  // - 3+ gün art arda olumsuz: kırmızı uyarı (tüm sekmeler)
  // - Günlük sekme: bugünün duygu durumu renk bandı
  // - Diğer durumlar: boş
  let alertHtml = '';
  if (!gorusmYapildi && alertDays >= 3) {
    // 3+ gün art arda olumsuz → uyarı (tüm sekmeler)
    alertHtml = `<div style="background:#ff6b6b22;border:1.5px solid #ff6b6b66;border-radius:12px;padding:14px;margin-bottom:14px">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <span>⚠️</span>
        <div style="flex:1">
          <div style="font-weight:800;color:#ff6b6b;margin-bottom:3px">Psikolojik Uyarı</div>
          <div style="font-size:0.82rem">${sName.split(' ')[0]} ${alertDays} gün art arda olumsuz duygu bildirdi. Görüşme önerilir.</div>
        </div>
        <button onclick="openGorusmeModal('${sName}','${sUid}')"
          style="padding:7px 12px;border-radius:9px;background:#ff6b6b;border:none;color:#fff;font-size:0.78rem;font-weight:700;cursor:pointer;white-space:nowrap">
          ✅ Görüşme Yap
        </button>
      </div>
    </div>`;
  } else if (period === 'daily' && todayMood && days[todayKey]?.mood) {
    // Günlük sekmede sadece bugüne ait veri varsa duygu bandı göster
    alertHtml = `<div style="background:${todayMoodColor}22;border:1.5px solid ${todayMoodColor}66;border-radius:12px;padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
      <span style="font-size:1.3rem">${todayMoodEmoji}</span>
      <div style="font-weight:700;color:${todayMoodColor};font-size:0.88rem">${todayMoodLabel}</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-left:4px">— Bugünkü duygu durumu</div>
    </div>`;
  }

  // Görüşmeler kartı — silme butonu ile
  const gorusmelerHtml = gorusmeler.length > 0 ? `
    <div class="card" style="margin-bottom:14px;border:1px solid #6c63ff44">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>🗣️ Koç Görüşmeleri</span>
        <button onclick="openGorusmeModal('${sName}','${sUid}')"
          style="padding:5px 10px;border-radius:8px;background:var(--accent)22;border:1px solid var(--accent)44;color:var(--accent);font-size:0.75rem;font-weight:700;cursor:pointer">
          + Görüşme Ekle
        </button>
      </div>
      ${gorusmeler.slice().reverse().map((g,i)=>{
        const gercekIdx = gorusmeler.length - 1 - i;
        return `
        <div style="padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div style="font-size:0.78rem;font-weight:700;color:var(--accent)">${g.tarih||''}</div>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="font-size:0.7rem;padding:2px 8px;border-radius:6px;background:${g.durum==='yapildi'?'#43e97b22':'#f9ca2422'};color:${g.durum==='yapildi'?'#43e97b':'#f9ca24'};font-weight:700">
                ${g.durum==='yapildi'?'✅ Görüşme Yapıldı':'📅 Planlandı'}
              </div>
              <button onclick="deleteGorusme('${sName}','${sUid}',${gercekIdx})"
                style="width:26px;height:26px;border-radius:7px;background:#ff658420;border:1px solid #ff658444;color:#ff6584;font-size:0.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center">🗑️</button>
            </div>
          </div>
          ${g.not?`<div style="font-size:0.8rem;color:var(--text2);line-height:1.5">${g.not}</div>`:''}
        </div>`;
      }).join('')}
    </div>` :
    `<div class="card" style="margin-bottom:14px;border:1px solid var(--border)">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>🗣️ Koç Görüşmeleri</span>
        <button onclick="openGorusmeModal('${sName}','${sUid}')"
          style="padding:5px 10px;border-radius:8px;background:var(--accent)22;border:1px solid var(--accent)44;color:var(--accent);font-size:0.75rem;font-weight:700;cursor:pointer">
          + Görüşme Ekle
        </button>
      </div>
      <div style="text-align:center;padding:16px;color:var(--text2);font-size:0.85rem">Henüz görüşme kaydı yok.</div>
    </div>`;

  // Hedefler (en son kaydedilen)
  const hedefHtml = (data.hedef||data.hedefOkul) ? `
    <div class="card" style="margin-bottom:14px">
      <div class="card-title">🎯 Öğrencinin Hedefleri</div>
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        ${data.hedef?`<div><div style="font-size:0.72rem;color:var(--text2)">Hedef Puan</div><div style="font-weight:800;font-size:1.3rem;color:var(--accent)">${data.hedef}</div></div>`:''}
        ${data.hedefOkul?`<div><div style="font-size:0.72rem;color:var(--text2)">Hedef Okul</div><div style="font-weight:700;font-size:0.92rem">${data.hedefOkul}</div></div>`:''}
      </div>
    </div>` : '';

  // Isı haritası HTML
  const heatMapHtml = `
    <div class="card" style="margin-bottom:14px">
      <div class="card-title">🌡️ Psikolojik Isı Haritası — Son 30 Gün</div>
      <div style="display:grid;grid-template-columns:repeat(10,1fr);gap:4px;margin-bottom:8px">
        ${heatMapDays.map(d=>`
          <div title="${d.dk}" style="aspect-ratio:1;border-radius:5px;background:${d.hasData?d.col+'88':'var(--surface2)'};
               border:1px solid ${d.hasData?d.col:'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:0.7rem">
            ${d.hasData?d.emoji:'<span style="font-size:0.55rem;color:var(--text2)">${d.label}</span>'}
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
        ${Object.entries(moodColors).slice(0,4).map(([k,c])=>`
          <span style="font-size:0.68rem;display:flex;align-items:center;gap:3px">
            <span style="width:10px;height:10px;border-radius:3px;background:${c};display:inline-block"></span>
            ${moodLabels[k]||k}
          </span>`).join('')}
      </div>
    </div>`;

  // Detay tablosu
  const tableRows = sortedDays.map(k=>{
    const d=days[k];
    const dateStr=new Date(k+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',weekday:'short'});
    const mc=moodColors[d.mood]||'var(--text2)';
    const me=moodEmojis[d.mood]||'·';
    return `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:9px 6px;font-size:0.75rem;color:var(--text2);white-space:nowrap">${dateStr}</td>
      <td style="padding:9px 6px;text-align:center">
        <span style="background:${mc}22;border:1px solid ${mc}66;border-radius:7px;padding:2px 6px;font-size:0.68rem;font-weight:700;color:${mc};white-space:nowrap">${me} ${moodLabels[d.mood]||'-'}</span>
      </td>
      <td style="padding:9px 6px;text-align:center;font-size:0.82rem;font-weight:700;color:#f9ca24">${d.enerji||'-'}</td>
      <td style="padding:9px 6px;text-align:center;font-size:0.82rem;font-weight:700;color:#ff6b6b">${d.kaygi||'-'}</td>
      <td style="padding:9px 6px;text-align:center;font-size:0.82rem;font-weight:700;color:#a29bfe">${d.uyku?d.uyku+'sa':'-'}</td>
      <td style="padding:9px 6px;font-size:0.72rem;color:var(--text2);max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.pozitif||d.gurur||''}</td>
    </tr>`;
  }).join('');

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <button onclick="showPage('students')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem">←</button>
      <div class="page-title" style="margin:0">💙 ${sName}</div>
    </div>
    <div class="page-sub">Psikolojik Takip Raporu</div>

    <!-- Dönem seçici -->
    <div style="display:flex;gap:6px;margin-bottom:14px;background:var(--surface2);border-radius:12px;padding:4px">
      <button onclick="window._psychPeriod='daily';renderTeacherPage('psych-report',document.getElementById('mainContent'))"
        style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;
               background:${period==='daily'?'var(--accent)':'transparent'};
               color:${period==='daily'?'#fff':'var(--text2)'};transition:.2s">Günlük</button>
      <button onclick="window._psychPeriod='weekly';renderTeacherPage('psych-report',document.getElementById('mainContent'))"
        style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;
               background:${period==='weekly'?'var(--accent)':'transparent'};
               color:${period==='weekly'?'#fff':'var(--text2)'};transition:.2s">Haftalık</button>
      <button onclick="window._psychPeriod='monthly';renderTeacherPage('psych-report',document.getElementById('mainContent'))"
        style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;
               background:${period==='monthly'?'var(--accent)':'transparent'};
               color:${period==='monthly'?'#fff':'var(--text2)'};transition:.2s">Aylık</button>
    </div>

    ${sortedDays.length===0 ? `
      <div class="card" style="text-align:center;padding:40px;color:var(--text2)">
        <div style="font-size:3rem;margin-bottom:12px">💙</div>
        <div style="font-weight:700;margin-bottom:8px">Bu dönemde veri yok</div>
        <div style="font-size:0.85rem">Öğrenci "Nasıl Hissediyorum" bölümünden veri girişi yaptıkça burada görünecek.</div>
      </div>
    ` : `
      ${alertHtml}
      ${hedefHtml}
      ${gorusmelerHtml}

      <div class="grid-4" style="margin-bottom:14px">
        <div class="stat-card"><div class="stat-label">⚡ Ort. Enerji</div><div class="stat-value" style="color:#f9ca24">${avg('enerji')}/10</div></div>
        <div class="stat-card"><div class="stat-label">🎯 Ort. Odak</div><div class="stat-value" style="color:#45b7d1">${avg('odak')}/10</div></div>
        <div class="stat-card"><div class="stat-label">😰 Ort. Kaygı</div><div class="stat-value" style="color:#ff6b6b">${avg('kaygi')}/10</div></div>
        <div class="stat-card"><div class="stat-label">🌙 Ort. Uyku</div><div class="stat-value" style="color:#a29bfe">${avg('uyku')}sa</div></div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="card-title">📅 Dönem Detayı</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="border-bottom:2px solid var(--border)">
              <th style="padding:8px 6px;text-align:left;font-size:0.7rem;color:var(--text2)">Tarih</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Duygu</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Enerji</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Kaygı</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Uyku</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Pozitif</th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </div>

      <!-- Rapor Al — Günlük/Haftalık/Aylık -->
      <div style="margin-bottom:14px">
        <button onclick="toggleRaporAl('psych_${sName.replace(/\s/g,'_')}')"
          style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;color:var(--text);cursor:pointer;font-weight:700;font-size:0.9rem">
          <span>📥 Rapor Al</span>
          <span id="raporAlArrow_psych_${sName.replace(/\s/g,'_')}" style="transition:.2s;font-size:0.8rem">▼</span>
        </button>
        <div id="raporAlPanel_psych_${sName.replace(/\s/g,'_')}" style="display:none;margin-top:6px;padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:12px">
          <div style="display:flex;gap:8px">
            <button id="psychRaporBtn_daily_${sName.replace(/\s/g,'_')}"
              onclick="setPsychRaporBtn('${sName.replace(/\s/g,'_')}','daily');window._psychPeriod='daily';exportPsychPDF('${sName}')"
              style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
              📋 Günlük
            </button>
            <button id="psychRaporBtn_weekly_${sName.replace(/\s/g,'_')}"
              onclick="setPsychRaporBtn('${sName.replace(/\s/g,'_')}','weekly');openDatePicker('psych_${sName.replace(/\s/g,'_')}','weekly')"
              style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
              📅 Haftalık
            </button>
            <button id="psychRaporBtn_monthly_${sName.replace(/\s/g,'_')}"
              onclick="setPsychRaporBtn('${sName.replace(/\s/g,'_')}','monthly');openDatePicker('psych_${sName.replace(/\s/g,'_')}','monthly')"
              style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
              📆 Aylık
            </button>
          </div>
        </div>
      </div>
    `}`;
}
