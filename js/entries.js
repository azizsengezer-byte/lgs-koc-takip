// entries.js — Giriş, Görev ve Öğrenci Yönetimi
function selectSubjectCard(el, name) {
  document.querySelectorAll('.subject-entry-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('entrySubject').value = name;
  openModal('addEntryModal');
}

// Seçili geçmiş gün için global
window._selectedEntryDate = null;

function openDayAction(dk, dateLabel, isToday, isPast) {
  const isTodayBool = isToday === 'true';
  const isPastBool = isPast === 'true';

  const panel = document.getElementById('dayEntriesPanel');
  const btnDiv = document.getElementById('dayActionBtn');
  const warning = document.getElementById('pastDayWarning');
  const pastLbl = document.getElementById('pastDayLabel');

  // Toggle: aynı güne tekrar tıklayınca kapat
  if (panel && panel._openDk === dk && panel.style.display !== 'none') {
    panel.style.display = 'none';
    panel._openDk = null;
    if (warning) warning.style.display = 'none';
    // Butonu bugün için sıfırla
    if (btnDiv) btnDiv.innerHTML = `<button class="btn btn-primary" style="width:100%" onclick="showPage('daily-entry')">+ Bugün Giriş Yap</button>`;
    return;
  }

  // Girişleri göster
  showDayEntries(dk, dateLabel);
  if (panel) panel._openDk = dk;

  if (isTodayBool) {
    window._selectedEntryDate = null;
    if (btnDiv) btnDiv.innerHTML = `<button class="btn btn-primary" style="width:100%" onclick="showPage('daily-entry')">+ Bugün Giriş Yap</button>`;
    if (warning) warning.style.display = 'none';
  } else if (isPastBool) {
    window._selectedEntryDate = dk;
    if (pastLbl) pastLbl.textContent = dateLabel;
    if (warning) warning.style.display = 'block';
    if (btnDiv) btnDiv.innerHTML = `<button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#f9ca24,#e17055)" onclick="openEntryForDay('${dk}')">📅 ${dateLabel} için Giriş Yap</button>`;
  } else {
    window._selectedEntryDate = null;
    if (warning) warning.style.display = 'none';
    if (btnDiv) btnDiv.innerHTML = `<button class="btn btn-primary" style="width:100%" onclick="showPage('daily-entry')">+ Bugün Giriş Yap</button>`;
  }
}

function openEntryForDay(dk) {
  window._selectedEntryDate = dk || null;
  openEntryFor(null);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function toggleEntryFields() {
  const type = document.getElementById('entryType').value;
  const isDeneme = type === 'deneme';
  const isSoru = type === 'soru';
  document.getElementById('normalFields').style.display = isDeneme ? 'none' : 'block';
  document.getElementById('soruFields').style.display = isSoru ? 'block' : 'none';
  document.getElementById('denemeFields').style.display = isDeneme ? 'block' : 'none';
}

function updateEntryTopics() {
  const sub = document.getElementById('entrySubject').value;
  const topics = kazanimlar[sub] || [];
  const sel = document.getElementById('entryTopic');
  if (sel) { sel.value = ''; }
  // Konu seçici label'ı sıfırla
  const topicLbl = document.getElementById('entryTopicLabel');
  if (topicLbl) topicLbl.textContent = '— Konu seç —';
}

function openDenemeSinaviEntry() {
  const subBtn = document.getElementById('entrySubjectBtn');
  if (subBtn) { subBtn.disabled = false; subBtn.style.opacity=''; subBtn.style.cursor='pointer'; }
  document.getElementById('entryType').value = 'deneme';
  const typeLbl = document.getElementById('entryTypeLabel');
  if (typeLbl) typeLbl.textContent = '📊 Deneme Sınavı';
  document.getElementById('entryDuration').value = '';
  document.getElementById('entryNote').value = '';
  subjects.forEach(s => {
    const d = document.getElementById('deneme_d_'+s.name);
    const y = document.getElementById('deneme_y_'+s.name);
    if(d) d.value='';
    if(y) y.value='';
  });
  toggleEntryFields();
  openModal('addEntryModal');
}

function openEntryFor(subjectName) {
  const subBtn = document.getElementById('entrySubjectBtn');
  if (subjectName) {
    document.getElementById('entrySubject').value = subjectName;
    const sub = subjects.find(s=>s.name===subjectName);
    const lbl = document.getElementById('entrySubjectLabel');
    if (lbl && sub) lbl.textContent = sub.icon + ' ' + sub.name;
    // Ders kartından açıldıysa ders değiştirilemez
    if (subBtn) { subBtn.disabled = true; subBtn.style.opacity='0.65'; subBtn.style.cursor='default'; }
  } else {
    // Deneme veya genel açılışta ders değiştirilebilir
    if (subBtn) { subBtn.disabled = false; subBtn.style.opacity=''; subBtn.style.cursor='pointer'; }
  }
  updateEntryTopics();
  document.getElementById('entryType').value = 'soru';
  const typeLbl = document.getElementById('entryTypeLabel');
  if (typeLbl) typeLbl.textContent = '📝 Soru Çözümü';
  toggleEntryFields();
  document.getElementById('entryDuration').value = '';
  document.getElementById('entryQuestions').value = '';
  document.getElementById('entryCorrect').value = '';
  document.getElementById('entryWrong').value = '';
  document.getElementById('entryNote').value = '';
  subjects.forEach(s => {
    const d = document.getElementById('deneme_d_'+s.name);
    const y = document.getElementById('deneme_y_'+s.name);
    if(d) d.value='';
    if(y) y.value='';
  });
  openModal('addEntryModal');
}

function saveEntry() {
  const type = document.getElementById('entryType').value;
  const dur = parseInt(document.getElementById('entryDuration').value) || 0;
  const note = document.getElementById('entryNote').value;
  if (!dur) { showToast('⚠️', 'Süre giriniz!'); return; }

  const now = new Date();
  const time = now.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  // Geçmiş gün seçiliyse o tarihe kaydet, yoksa bugün
  const dateKey = window._selectedEntryDate || getDateKey(now);
  const isToday = !window._selectedEntryDate;
  window._selectedEntryDate = null; // kullandıktan sonra sıfırla
  const user = auth.currentUser;
  const studentName = document.getElementById('menuName')?.textContent;
  const teacherId = (window.currentUserData||{}).teacherId || '';

  if (type === 'deneme') {
    // examId: bu denemenin tüm derslerini bağlayan benzersiz ID
    const examId = 'exam_' + Date.now() + '_' + Math.random().toString(36).substr(2,6);
    const examTitleRaw = (document.getElementById('denemeTitle')?.value||'').trim();
    const examTitle = examTitleRaw || new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})+' Denemesi';
    // Deneme sınavı — tüm dersler ayrı ayrı kaydet, hepsi aynı examId ile
    let saved = 0;
    const savedPromises = [];
    subjects.forEach(s => {
      const d = parseInt(document.getElementById('deneme_d_'+s.name)?.value)||0;
      const y = parseInt(document.getElementById('deneme_y_'+s.name)?.value)||0;
      if (d===0 && y===0) return;
      const net = d - y/3;
      const q = d + y;
      const entry = {
        subject: s.name, topic: examTitle, type: 'deneme',
        examId, examTitle,
        duration: Math.round(dur/subjects.length), questions: q,
        correct: d, wrong: y, net, note, time, dateKey, isToday: true,
        date: 'Bugün '+time
      };
      studyEntries.unshift(entry);
      if (user) {
        const p = db.collection('studyEntries').add({
          ...entry, userId: user.uid, teacherId, studentName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(docRef => { entry.firestoreId = docRef.id; }).catch(()=>{});
        savedPromises.push(p);
        saved++;
      } else { saved++; }
    });
    // Input temizle
    if(document.getElementById('denemeTitle')) document.getElementById('denemeTitle').value = '';
    closeModal('addEntryModal');
    showToast('✅', `"${examTitle}" kaydedildi! (${saved} ders)`);
    if (user && teacherId) {
      const time2 = new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
      db.collection('notifications').add({
        toUid: teacherId, fromUid: user.uid,
        text: `🎯 ${studentName} deneme girdi: "${examTitle}" (${saved} ders)`,
        examTitle: examTitle,
        type: 'entry', read: false, time: time2,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(()=>{});
    }
    // Koloni XP — deneme girişi (günde 1 kez)
    if (saved > 0 && typeof grantExamXP === 'function') {
      try {
        const _examKey = 'colony_exam_' + getTodayKey();
        if (!localStorage.getItem(_examKey)) {
          localStorage.setItem(_examKey, '1');
          const colData = loadColonyData();
          const xpGained = grantExamXP(colData);
          if (xpGained > 0) showToast('🚀', `+${xpGained} XP deneme girişi!`);
        }
      } catch(e) {}
    }
    // Konfeti efekti
    if (typeof _marketKonfetiEfekt === 'function') {
      setTimeout(() => _marketKonfetiEfekt(), 400);
    }
    showPage('daily-entry');
    return;
  }

  // Normal giriş
  const sub = document.getElementById('entrySubject').value;
  const topic = document.getElementById('entryTopic').value || 'Genel Çalışma';
  const q = type==='soru' ? (parseInt(document.getElementById('entryQuestions').value)||0) : 0;
  const correct = type==='soru' ? (parseInt(document.getElementById('entryCorrect').value)||0) : 0;
  const wrong = type==='soru' ? (parseInt(document.getElementById('entryWrong').value)||0) : 0;

  // Doğru + yanlış toplam soru sayısını geçemez
  if (type==='soru' && q > 0 && (correct + wrong) > q) {
    showToast('⚠️', `Doğru (${correct}) + yanlış (${wrong}) = ${correct+wrong}, soru sayısı (${q}) geçemez!`);
    // Hatalı alanları kırmızı yap
    const cEl = document.getElementById('entryCorrect');
    const wEl = document.getElementById('entryWrong');
    if(cEl) cEl.style.borderColor='#E24B4A';
    if(wEl) wEl.style.borderColor='#E24B4A';
    setTimeout(()=>{ if(cEl) cEl.style.borderColor=''; if(wEl) wEl.style.borderColor=''; }, 3000);
    return;
  }

  const net = q > 0 ? correct - wrong/3 : 0;

  const entry = {
    subject: sub, topic, type, duration: dur, questions: q,
    correct, wrong, net, note, time, dateKey, isToday,
    date: isToday ? ('Bugün '+time) : (dateKey+' '+time)
  };
  studyEntries.unshift(entry);

  if (user) {
    db.collection('studyEntries').add({
      ...entry, userId: user.uid, teacherId, studentName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
      entry.firestoreId = docRef.id;
      // Öğretmene bildirim gönder
      if (teacherId) {
        const subLabel = sub || 'Genel';
        const typeLabel = type==='soru'?'soru çözümü':type==='konu'?'konu çalışması':'tekrar';
        db.collection('notifications').add({
          toUid: teacherId,
          fromUid: user.uid,
          text: `📚 ${studentName}, ${subLabel} dersinde ${typeLabel} tamamladı (${dur} dk${q>0?', '+q+' soru':''})`,
          type: 'entry',
          read: false,
          time: time,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(()=>{});
      }
    }).catch(()=>{});
  }

  closeModal('addEntryModal');
  const netStr = q>0 ? ` | Net: ${net.toFixed(1)}` : '';
  showToast('✅', `${sub} — ${topic} kaydedildi!${netStr}`);
  showPage('daily-entry');
  // Rozet kontrolü
  setTimeout(()=>checkBadges(), 500);
  // Altın sistemi — soru hook
  if (type === 'soru' && correct > 0 && typeof _marketSoruKontrol === 'function') {
    _marketSoruKontrol(correct);
  }
  // Koloni XP — soru çözme
  if (type === 'soru' && q > 0 && typeof grantQuestionXP === 'function') {
    try {
      const colData = loadColonyData();
      const xpGained = grantQuestionXP(colData, q);
      if (xpGained > 0) showToast('🚀', `+${xpGained} XP ${q} soru çözümü!`);
    } catch(e) {}
  }
  // Konfeti efekti
  if (typeof _marketKonfetiEfekt === 'function') {
    setTimeout(()=>_marketKonfetiEfekt(), 300);
  }
}

async function deleteStudent(i) {
  const s = students[i];
  const ok = await appConfirm('Öğrenciyi Sil', `${s.name} silinsin mi? Öğrencinin hesabı devre dışı bırakılacak. Bu işlem geri alınamaz.`, true);
  if (!ok) return;

  try {
    const teacherUser = auth.currentUser;

    // 1. users koleksiyonundan sil
    if (s.uid) {
      await db.collection('users').doc(s.uid).delete();
      await db.collection('wellness').doc(s.uid).delete().catch(()=>{});
    }

    // 2. Silinen hesabı işaretle - aynı e-posta ile yeniden eklenmeye çalışılırsa bilgi ver
    if (s.email || s.uid) {
      await db.collection('deletedStudents').add({
        uid: s.uid || '',
        name: s.name,
        email: s.email || '',
        deletedBy: teacherUser?.uid || '',
        deletedAt: new Date()
      });
    }

    // 3. pendingStudents'tan sil
    if (teacherUser) {
      const snap = await db.collection('pendingStudents')
        .where('teacherId','==',teacherUser.uid)
        .where('name','==',s.name).get();
      snap.forEach(doc => doc.ref.delete());
    }

    // 4. Lokal diziden çıkar
    students.splice(i, 1);
    showToast('🗑️', `${s.name} silindi.`);
    showPage('students');
  } catch(e) {
    showToast('❌', 'Silme hatası: ' + e.message);
  }
}

async function saveNewStudent() {
  const name = document.getElementById('newStudentName').value.trim();
  const email = document.getElementById('newStudentEmail').value.trim();
  const pass = document.getElementById('newStudentPass').value;
  const errEl = document.getElementById('addStudentError');
  errEl.style.display = 'none';
  const school = document.getElementById('newStudentSchool')?.value || '';
  if (!name || !email || !pass) { errEl.textContent = 'Tüm alanları doldurunuz.'; errEl.style.display='block'; return; }
  if (!school) { errEl.textContent = 'Lütfen bir okul seçin.'; errEl.style.display='block'; return; }
  if (pass.length < 6) { errEl.textContent = 'Şifre en az 6 karakter olmalı.'; errEl.style.display='block'; return; }
  if (students.length >= 30) { errEl.textContent = 'En fazla 30 öğrenci eklenebilir.'; errEl.style.display='block'; return; }

  const errBtn = document.querySelector('#addStudentModal .btn-primary');
  if (errBtn) { errBtn.textContent = 'Ekleniyor...'; errBtn.disabled = true; }

  try {
    const teacherUser = auth.currentUser;
    const teacherData = window.currentUserData || {};

    // Silinmiş hesap kontrolü
    const deletedSnap = await db.collection('deletedStudents').where('email','==',email).get();
    if (!deletedSnap.empty) {
      errEl.textContent = 'Bu e-posta daha önce silinmiş bir öğrenciye ait. Farklı bir e-posta kullanın.';
      errEl.style.display = 'block';
      if (errBtn) { errBtn.textContent = 'Ekle ✓'; errBtn.disabled = false; }
      return;
    }
    // Bu sayede öğretmenin oturumu kapanmıyor
    let secondaryApp;
    try {
      secondaryApp = firebase.app('secondary');
    } catch(e) {
      secondaryApp = firebase.initializeApp(firebase.app().options, 'secondary');
    }
    const secondaryAuth = secondaryApp.auth();

    // Öğrenci Firebase Auth hesabı oluştur
    const cred = await secondaryAuth.createUserWithEmailAndPassword(email, pass);
    const studentUid = cred.user.uid;

    // Öğrenci Firestore profilini secondaryAuth aktifken yaz (öğrencinin kendi auth'u)
    const colors = ['#6c63ff','#ff6584','#43e97b','#f9ca24','#00b4d8','#ff9f43'];
    const color = colors[students.length % colors.length];
    const profileData = {
      name, email, role: 'student',
      teacherId: teacherUser.uid,
      teacherName: teacherData.name || '',
      teacherPhoto: teacherData.photo || '',
      school: (document.getElementById('newStudentSchool')?.value) || teacherData.school || '',
      photo: '', color, avg: 0,
      createdAt: new Date()
    };

    // secondaryApp'in Firestore instance'ını al (öğrencinin auth'u aktif)
    let written = false;
    try {
      const secDb = firebase.app('secondary').firestore();
      await secDb.collection('users').doc(studentUid).set(profileData);
      written = true;
    } catch(e1) {
      console.log('Secondary Firestore hatasi:', e1.message);
    }

    // İkinci oturumu kapat
    await secondaryAuth.signOut();

    // Secondary başarısız olduysa öğretmen auth'u ile dene
    if (!written) {
      await db.collection('users').doc(studentUid).set(profileData);
    }

    // Öğretmenin listesine ekle
    students.push({ name, uid: studentUid, avg: 0, trend: 'up', lastActive: 'Yeni', color, tasks: 0 });

    closeModal('addStudentModal');
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentEmail').value = '';
    document.getElementById('newStudentPass').value = '';
    showToast('✅', `${name} eklendi! Giriş: ${email} / ${pass}`);
    showPage('students');

  } catch(e) {
    const msgs = {
      'auth/email-already-in-use': 'Bu e-posta başka bir hesapta kullanılıyor. Farklı bir e-posta deneyin.',
      'auth/invalid-email': 'Geçersiz e-posta adresi.',
      'auth/weak-password': 'Şifre çok zayıf, en az 6 karakter olmalı.',
    };
    errEl.textContent = msgs[e.code] || 'Hata: ' + e.message;
    errEl.style.display = 'block';
  } finally {
    if (errBtn) { errBtn.textContent = 'Ekle ✓'; errBtn.disabled = false; }
  }
}

function populateTaskStudents() {
  // taskStudentBtn'in onclick'ini öğrenci listesiyle güncelle
  const btn = document.getElementById('taskStudentBtn');
  if (btn) {
    const opts = students.length > 0
      ? students.map(s=>({v:s.name, l:s.name + (s.classroom ? ' · '+(s.classroom.match(/\d+/)?.[0]||'')+'.Sınıf' : '')}))
      : [{v:'', l:'Henüz öğrenci eklenmedi'}];
    btn.setAttribute('onclick', `openOptionPicker('taskStudent','Öğrenci Seç',${JSON.stringify(opts)},null)`);
  }
  // Değeri sıfırla
  const inp = document.getElementById('taskStudent');
  if (inp) inp.value = '';
  const lbl = document.getElementById('taskStudentLabel');
  if (lbl) lbl.textContent = '— Öğrenci seç —';
  updateTaskUnits();
}

function updateTaskUnits() {
  // Konu sıfırla
  const inp = document.getElementById('taskUnit');
  if (inp) inp.value = '';
  const lbl = document.getElementById('taskUnitLabel');
  if (lbl) lbl.textContent = '— Konu seç —';
  // Görev başlığını da sıfırla
  const titleEl = document.getElementById('taskTitle');
  if (titleEl) titleEl.value = '';
}

function updateTaskTitle() {
  const type = document.getElementById('taskType')?.value || 'soru';
  const unit = document.getElementById('taskUnit')?.value || '';
  const countGroup = document.getElementById('taskCountGroup');
  const titleEl = document.getElementById('taskTitle');
  const typeLabels = {
    soru: 'Soru Çözümü', konu: 'Konu Çalışma',
    ozet: 'Özet Çıkarma', tekrar: 'Tekrar', diger: 'Görev'
  };
  if (countGroup) countGroup.style.display = type === 'soru' ? 'block' : 'none';
  if (unit && titleEl) titleEl.value = `${unit} — ${typeLabels[type]||'Görev'}`;
}

function openTaskModal() {
  populateTaskStudents();
  const d = new Date();
  d.setDate(d.getDate() + 3);
  document.getElementById('taskDue').value = d.toISOString().split('T')[0];
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  // Başlık ve butonu sıfırla (editTaskModal'dan gelmiş olabilir)
  const titleEl = document.querySelector('#addTaskModal .modal-title');
  if (titleEl) titleEl.textContent = '📋 Görev Ata';
  const btn = document.getElementById('taskSaveBtn');
  if (btn) btn.onclick = saveTask;
  openModal('addTaskModal');
}

async function saveTask() {
  const student = document.getElementById('taskStudent').value;
  if (!student) { showToast('⚠️', 'Lütfen öğrenci seçin!'); return; }
  const title = document.getElementById('taskTitle').value || 'Yeni Görev';
  const sub = document.getElementById('taskSubject').value;
  const unit = document.getElementById('taskUnit').value;
  const type = document.getElementById('taskType').value;
  const count = document.getElementById('taskCount').value;
  const desc = document.getElementById('taskDesc').value || `${unit} konusunda görev`;
  const dueRaw = document.getElementById('taskDue').value;
  const due = dueRaw ? new Date(dueRaw).toLocaleDateString('tr-TR',{day:'numeric',month:'long'}) : '—';
  const typeLabels = {soru:'📝 Soru Çözümü', konu:'📖 Konu Çalışma', test:'📊 Test', ozet:'✏️ Özet', tekrar:'🔁 Tekrar', diger:'📌 Diğer'};
  const fullDesc = (count ? `${count} soru — ` : '') + desc;
  const user = auth.currentUser;
  const studentObj = students.find(s => s.name === student);
  const studentUid = studentObj?.uid || '';
  const taskData = {
    title, subject: sub, unit, type,
    typeLabel: typeLabels[type]||'Görev',
    desc: fullDesc, due, dueRaw: dueRaw || '',
    studentName: student,
    studentUid: studentUid,
    teacherId: user ? user.uid : '',
    teacherName: document.getElementById('menuName')?.textContent,
    done: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  try {
    const ref = await db.collection('tasks').add(taskData);
    tasks.unshift({ ...taskData, id: ref.id });
    // Öğrenciye bildirim gönder
    if (studentUid) {
      await db.collection('notifications').add({
        toUid: studentUid,
        fromUid: user ? user.uid : '',
        text: `📋 Yeni görev: "${title}" — ${sub} (Son: ${due})`,
        type: 'task', read: false,
        time: new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch(e) {
    tasks.unshift({ ...taskData, id: Date.now().toString() });
  }
  closeModal('addTaskModal');
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskCount').value = '';
  showToast('📤', `${student}'e görev gönderildi!`);
  showPage('tasks-teacher');
}

async function completeTask(i) {
  tasks[i].done = true;
  if (tasks[i].id) {
    try { await db.collection('tasks').doc(tasks[i].id).update({ done: true }); } catch(e) {}
  }
  showToast('🎉', 'Görev tamamlandı!');
  showPage('my-tasks');
}

function toggleKazanim(subject, idx, el) {
  const key = subject+idx;
  kazanimDone[key] = !kazanimDone[key];
  el.classList.toggle('done', kazanimDone[key]);
  el.querySelector('.kazanim-check').textContent = kazanimDone[key] ? '✓' : '';
  // update progress bar
  const kList = kazanimlar[subject] || [];
  const done = kList.filter((_,i)=> kazanimDone[subject+i]).length;
  const pct = kList.length ? Math.round(done/kList.length*100) : 0;
  const kLabel = typeof kList[idx] === 'object' ? kList[idx].unite : kList[idx];
  showToast(kazanimDone[key]?'✅':'↩️', `${subject} — ${kLabel} ${kazanimDone[key]?'tamamlandı':'geri alındı'}`);
}

/* =================== PDF EXPORT =================== */
function exportPDF(role) {
  showToast('⏳','PDF hazirlaniyor...');
  try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
      const now = new Date();
      const todayKey = getDateKey(now);
      const nowStr = now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});

      const period = role==='teacher'
        ? (document.getElementById('pdfPeriodType')?.value || 'monthly')
        : (document.getElementById('pdfPeriodS')?.value || 'monthly');
      const pLabel = period==='weekly'?'Haftalık':period==='monthly'?'Aylık':'Dönem';

      // Seçilen tarih aralığını al
      const dateRangeVal = document.getElementById('pdfDateRange')?.value || '';
      let startKey, endKey;
      if (period==='weekly' && dateRangeVal) {
        startKey = dateRangeVal;
        const mon = new Date(dateRangeVal+'T12:00:00');
        const sun = new Date(mon); sun.setDate(mon.getDate()+6);
        endKey = sun.toISOString().split('T')[0];
      } else if (period==='monthly' && dateRangeVal) {
        const [yr, mo] = dateRangeVal.split('-').map(Number);
        startKey = dateRangeVal + '-01';
        endKey = new Date(yr, mo, 0).toISOString().split('T')[0];
      }

      // Dönem filtresi
      const monday = startKey ? new Date(startKey+'T12:00:00') : (() => { const m=new Date(now); m.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1)); return m; })();
      const mondayKey = monday.toISOString().split('T')[0];
      const monthStart = startKey || todayKey.substring(0,7)+'-01';
      const filterE = (arr) => {
        if (period==='weekly') return arr.filter(e=>e.dateKey>=mondayKey && (!endKey||e.dateKey<=endKey));
        if (period==='monthly') return arr.filter(e=>e.dateKey>=monthStart && (!endKey||e.dateKey<=endKey));
        return arr;
      };

      const studentFilter = role==='teacher'
        ? (document.getElementById('pdfStudent')?.value || 'all')
        : document.getElementById('menuName')?.textContent;

      const filteredEntries = role==='teacher' && studentFilter!=='all'
        ? filterE(studyEntries.filter(e=>e.studentName===studentFilter))
        : filterE(studyEntries);

      const totalEntries = filteredEntries.length;
      const totalDurAll = filteredEntries.reduce((a,e)=>a+(e.duration||0),0);
      const totalQAll = filteredEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.questions||0),0);
      const totalNetAll = filteredEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.net||0),0);
      const activeDays = new Set(filteredEntries.map(e=>e.dateKey)).size;

      // Başlık
      const title = role==='teacher'
        ? (studentFilter==='all' ? 'Tum Ogrenciler — Sinif Ozeti' : ts(studentFilter)+' — Ogrenci Raporu')
        : ts(studentFilter)+' — Kisisel Analiz Raporu';

      // Hafta/ay etiket
      function getPLabel() {
        if (period==='weekly') {
          const sun = new Date(monday); sun.setDate(monday.getDate()+6);
          return monday.toLocaleDateString('tr-TR',{day:'numeric',month:'long'})+' - '+sun.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})+' Haftalık Rapor';
        }
        if (period==='monthly') {
          const d = new Date(monthStart+'T12:00:00');
          return d.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})+' Aylık Rapor';
        }
        return 'Dönem Raporu';
      }

      let Y = pdfHeader(doc, ts(title), ts(getPLabel()), ts(nowStr));

      // Özet kutular
      const stats = role==='teacher' && studentFilter==='all'
        ? [['Aktif Öğrenci',students.length,[90,72,200]],['Toplam Giriş',totalEntries,[38,166,154]],['Toplam Soru',totalQAll,[255,167,38]],['Ort. Net',(totalQAll>0?totalNetAll/totalQAll:0).toFixed(1),[239,83,80]]]
        : [['Süre(dk)',totalDurAll,[90,72,200]],['Soru',totalQAll,[66,165,245]],['Aktif Gün',activeDays,[38,166,154]],['Ort. Net',(totalQAll>0?totalNetAll/totalQAll:0).toFixed(1),[239,83,80]]];
      const bw=41, bh=16, bgap=2.8;
      stats.forEach((s,i)=>{
        const x=14+i*(bw+bgap);
        const [r,g,b]=s[2];
        doc.setFillColor(Math.min(255,Math.round(r*0.08+255*0.92)),Math.min(255,Math.round(g*0.08+255*0.92)),Math.min(255,Math.round(b*0.08+255*0.92))); doc.roundedRect(x,Y,bw,bh,2,2,'F');
        doc.setDrawColor(210,204,242); doc.setLineWidth(0.3); doc.roundedRect(x,Y,bw,bh,2,2,'S');
        doc.setFont(_PF,'bold'); doc.setFontSize(12); doc.setTextColor(r,g,b);
        doc.text(ts(String(s[1])),x+bw/2,Y+9,{align:'center'});
        doc.setFont(_PF,'normal'); doc.setFontSize(5.5); doc.setTextColor(100,95,140);
        doc.text(ts(s[0]),x+bw/2,Y+14.5,{align:'center'});
      });
      Y+=21;

      // Ders bazlı performans
      Y = pdfSecHeader(doc,'DERS BAZLI PERFORMANS',Y);
      const subjectNames = ['Turkce','Matematik','Fen Bilimleri','Inkilap Tarihi','Din Kulturu','Ingilizce'];
      const subjectKeys = ['Türkçe','Matematik','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce'];
      const subColors = [[108,99,255],[66,165,245],[38,166,154],[255,167,38],[171,71,188],[102,187,106]];
      const subjectIcons = ['TUR','MAT','FEN','INK','DIN','ING'];
      subjectKeys.forEach((key,i)=>{
        const se = filteredEntries.filter(e=>e.subject===key&&e.type!=='deneme');
        const q=se.reduce((a,e)=>a+(e.questions||0),0);
        const d=se.reduce((a,e)=>a+(e.correct||0),0);
        const pct=q>0?Math.round(d/q*100):0;
        const [r,g,b]=subColors[i];
        Y=pdfCheck(doc,Y,10);
        doc.setFillColor(248,247,254); doc.roundedRect(14,Y,182,8,1.5,1.5,'F');
        doc.setDrawColor(210,204,242); doc.setLineWidth(0.2); doc.roundedRect(14,Y,182,8,1.5,1.5,'S');
        doc.setTextColor(r,g,b); doc.setFontSize(7); doc.setFont(_PF,'bold');
        doc.text(subjectIcons[i],18,Y+5.5);
        doc.setTextColor(40,35,80); doc.setFont(_PF,'normal');
        doc.text(subjectNames[i],30,Y+5.5);
        // Progress bar
        const bx=95, bw2=75, bh2=3;
        doc.setFillColor(220,215,245); doc.roundedRect(bx,Y+2.5,bw2,bh2,1,1,'F');
        if(pct>0) { const rm2=Math.min(255,Math.round(r*0.8+255*0.2)),gm2=Math.min(255,Math.round(g*0.8+255*0.2)),bm2=Math.min(255,Math.round(b*0.8+255*0.2)); doc.setFillColor(rm2,gm2,bm2); doc.roundedRect(bx,Y+2.5,bw2*pct/100,bh2,1,1,'F'); }
        doc.setTextColor(r,g,b); doc.setFontSize(7.5); doc.setFont(_PF,'bold');
        doc.text(pct+'%',194,Y+5.5,{align:'right'});
        if(q>0) {
          doc.setTextColor(120,115,160); doc.setFontSize(6); doc.setFont(_PF,'normal');
          doc.text(q+' soru | Net:'+(d-se.reduce((a,e)=>a+(e.wrong||0),0)/3).toFixed(1), 175,Y+5.5,{align:'right'});
        }
        Y+=10;
      });
      Y+=4;

      // Öğrenci tablosu (öğretmen - tüm öğrenciler)
      if(role==='teacher' && studentFilter==='all') {
        Y=pdfSecHeader(doc,'ÖĞRENCİ ÇALIŞMA ÖZETİ',Y);
        const tH=['Ad Soyad','Giriş','Top. Süre','Top. Soru','Ort. Net','Son Aktif'];
        const tW=[50,20,26,26,22,38];
        const tR=students.map(s=>{
          const se=filterE(studyEntries.filter(e=>e.studentName===s.name));
          const dur=se.reduce((a,e)=>a+(e.duration||0),0);
          const q=se.reduce((a,e)=>a+(e.questions||0),0);
          const net=se.length>0?(se.reduce((a,e)=>a+(e.net||0),0)/se.length).toFixed(1):'—';
          const last=se.length>0?se[0].dateKey:'Yeni';
          return [s.name,se.length,dur+'dk',q,net,last];
        });
        Y=pdfTable(doc,tH,tW,tR,Y);
        Y+=4;
      }

      // Çalışma detayları (bireysel)
      if(role==='student' || (role==='teacher' && studentFilter!=='all')) {
        Y=pdfCheck(doc,Y,14);
        Y=pdfSecHeader(doc,'ÇALIŞMA GİRİŞ DETAYLARI',Y);
        const tH=['Tarih','Ders','Konu','Tür','Süre','Soru','Net'];
        const tW=[22,28,46,18,16,16,18];
        const tR=filteredEntries.slice(0,30).map(e=>[
          e.dateKey||'',ts(e.subject||''),ts((e.topic||'').substring(0,20)),
          ts(e.type||''),e.duration+'dk',e.questions||0,
          (e.net!=null?e.net.toFixed(1):'—')
        ]);
        Y=pdfTable(doc,tH,tW,tR,Y);
        if(filteredEntries.length>30) {
          Y=pdfCheck(doc,Y,7);
          doc.setFont(_PF,'normal'); doc.setFontSize(7); doc.setTextColor(120,115,160);
          doc.text('... ve '+( filteredEntries.length-30)+' giriş daha (tam rapor için öğrenci analizine bakın)', 14, Y);
          Y+=8;
        }
      }

      pdfFooter(doc, doc.internal.getNumberOfPages(), ts(title)+' | '+ts(getPLabel()));

      const fname = 'LGSKoc_'+ts((studentFilter==='all'?'Sinif':studentFilter).replace(/\s+/g,'_'))+'_'+pLabel+'_'+todayKey+'.pdf';
      pdfDownload(doc, fname);

    } catch(e) {
      console.error(e);
      showToast('❌','PDF olusturulamadi: '+e.message);
    }
}

