
// ── OKUL ARKADAŞI PROFİL MODALI ─────────────────────────────
function arkadasProfilGoster(uid, isim, renk, foto) {
  const existing = document.getElementById('arkadasProfilModal');
  if (existing) existing.remove();

  const avatarHTML = foto && foto !== 'undefined'
    ? `<img src="${foto}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block">`
    : `<div style="width:80px;height:80px;border-radius:50%;background:${renk}22;color:${renk};display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;margin:0 auto 10px">${isim[0]}</div>`;

  const modal = document.createElement('div');
  modal.id = 'arkadasProfilModal';
  modal.className = 'modal-overlay open';
  modal.style.zIndex = '9999';
  modal.innerHTML = `
    <div class="modal" style="max-width:340px">
      <div style="text-align:center;padding:8px 0 12px">
        ${avatarHTML}
        <div style="font-size:1.2rem;font-weight:900;margin-bottom:3px">${isim}</div>
        <div style="font-size:0.8rem;color:var(--accent);font-weight:600;margin-bottom:14px">🏫 Okul Arkadaşı</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:14px">
          <button class="btn btn-primary" style="padding:8px 18px;font-size:0.82rem"
            onclick="document.getElementById('arkadasProfilModal').remove();activeChat='${uid}';showPage('messages')">
            💬 Mesaj Gönder
          </button>
          <button class="btn btn-outline" style="padding:8px 18px;font-size:0.82rem"
            onclick="arkadasHediyeGonder('${uid}','${isim}')">
            🎁 Hediye
          </button>
        </div>
      </div>
      <!-- Sekmeler -->
      <div style="display:flex;border-bottom:1.5px solid var(--border);margin-bottom:12px">
        <button id="arkadasTabBilgi" onclick="arkadasTab('bilgi')"
          style="flex:1;padding:8px;background:none;border:none;color:var(--accent);font-weight:700;font-size:0.82rem;cursor:pointer;border-bottom:2px solid var(--accent)">
          📋 Bilgi
        </button>
        <button id="arkadasTabRozet" onclick="arkadasTab('rozet')"
          style="flex:1;padding:8px;background:none;border:none;color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer;border-bottom:2px solid transparent">
          🏆 Rozetler
        </button>
      </div>
      <div id="arkadasBilgiContent" style="font-size:0.83rem;color:var(--text2);line-height:1.8;margin-bottom:12px;text-align:left">
        Bilgiler yükleniyor...
      </div>
      <div id="arkadasRozetContent" style="display:none;min-height:60px;padding:4px 0">
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center" id="arkadasRozetGrid">
          <div style="color:var(--text2);font-size:0.8rem;padding:16px">Yükleniyor...</div>
        </div>
      </div>
      <button class="btn btn-outline" style="width:100%;margin-top:8px"
        onclick="document.getElementById('arkadasProfilModal').remove()">Kapat</button>
    </div>
  `;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);

  // Bilgi ve rozetleri yükle
  arkadasBilgiYukle(uid);
  arkadasRozetYukle(uid);
}

function arkadasTab(tab) {
  const bilgi = document.getElementById('arkadasBilgiContent');
  const rozet = document.getElementById('arkadasRozetContent');
  const btnB = document.getElementById('arkadasTabBilgi');
  const btnR = document.getElementById('arkadasTabRozet');
  if (!bilgi || !rozet) return;
  if (tab === 'bilgi') {
    bilgi.style.display = 'block'; rozet.style.display = 'none';
    btnB.style.color = 'var(--accent)'; btnB.style.borderBottom = '2px solid var(--accent)';
    btnR.style.color = 'var(--text2)'; btnR.style.borderBottom = '2px solid transparent';
  } else {
    bilgi.style.display = 'none'; rozet.style.display = 'block';
    btnR.style.color = 'var(--accent)'; btnR.style.borderBottom = '2px solid var(--accent)';
    btnB.style.color = 'var(--text2)'; btnB.style.borderBottom = '2px solid transparent';
  }
}

async function arkadasBilgiYukle(uid) {
  const el = document.getElementById('arkadasBilgiContent');
  if (!el) return;
  try {
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) { el.textContent = 'Bilgi bulunamadı.'; return; }
    const d = snap.data();
    const satirlar = [];
    if (d.school) satirlar.push(`🏫 <b>Okul:</b> ${d.school}`);
    if (d.classroom) satirlar.push(`📚 <b>Sınıf:</b> ${d.classroom}`);
    el.innerHTML = satirlar.join('<br>') || '<span style="color:var(--text2)">Bilgi eklenmemiş</span>';
  } catch(e) { el.textContent = 'Yüklenemedi.'; }
}

async function arkadasRozetYukle(uid) {
  const grid = document.getElementById('arkadasRozetGrid');
  if (!grid) return;
  try {
    const snap = await db.collection('badges').doc(uid).get();
    if (!snap.exists || !snap.data().earned?.length) {
      grid.innerHTML = '<div style="color:var(--text2);font-size:0.8rem;padding:16px">Henüz rozet yok.</div>';
      return;
    }
    const earned = snap.data().earned || [];
    grid.innerHTML = earned.slice(0, 12).map(b =>
      `<div title="${b.name||''}" style="width:44px;height:44px;border-radius:10px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:1.4rem">${b.icon||'🏅'}</div>`
    ).join('');
  } catch(e) { grid.innerHTML = '<div style="color:var(--text2);font-size:0.8rem;padding:16px">Yüklenemedi.</div>'; }
}

function arkadasHediyeGonder(uid, isim) {
  document.getElementById('arkadasProfilModal')?.remove();
  if (typeof marketHediyeAc === 'function') {
    marketHediyeAc(uid, isim);
  } else {
    showToast('⚠️', 'Hediye için markete git');
  }
}


function kocProfilGoster() {
  const myData = window.currentUserData || {};
  const teacherId = myData.teacherId;
  const teacherName = myData.teacherName || 'Koçum';
  const teacherPhoto = myData.teacherPhoto || '';

  if (!teacherId) {
    showToast('⚠️', 'Koç bilgisi bulunamadı');
    return;
  }

  // Basit profil modalı
  const existing = document.getElementById('kocProfilModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'kocProfilModal';
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal" style="max-width:320px;text-align:center">
      <div style="margin-bottom:16px">
        ${teacherPhoto
          ? `<img src="${teacherPhoto}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block">`
          : `<div style="width:80px;height:80px;border-radius:50%;background:var(--accent)22;color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;margin:0 auto 12px">👨‍🏫</div>`}
        <div style="font-size:1.3rem;font-weight:900">${teacherName}</div>
        <div style="font-size:0.82rem;color:var(--accent);font-weight:600;margin-top:4px">Koç Öğretmenim</div>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-bottom:8px" onclick="showPage('messages')">
        💬 Mesaj Gönder
      </button>
      <button class="btn btn-outline" style="width:100%" onclick="document.getElementById('kocProfilModal').remove()">
        Kapat
      </button>
    </div>
  `;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}

function renderStudentPage(id, el) {
  if(id==='dashboard') el.innerHTML = studentDashboard();
  else if(id==='daily-entry') el.innerHTML = studentDailyEntry();
  else if(id==='my-analysis') el.innerHTML = studentAnalysis();
  else if(id==='kazanimlar') el.innerHTML = studentKazanimlar();
  else if(id==='my-tasks') el.innerHTML = studentTasks();
  else if(id==='wellness') {
    loadWellnessFromFirestore().then(()=>{
      el.innerHTML = wellnessPage();
      // Render sonrası doğrulama — bugünün tarihi ile uyumsuz veri varsa temizle
      _wellnessDateGuard();
    });
  }
  else if(id==='macera') el.innerHTML = maceraPage();
  else if(id==='market') { el.innerHTML = marketPage(); }
  else if(id==='lgs-dagilim') el.innerHTML = lgsDagilimPage();
  else if(id==='all-denemeler') el.innerHTML = allDenemelerPage();
  else if(id==='messages') {
    messagesPage('student').then(html => {
      el.innerHTML = html;
      // Profil'den yönlendirme geldiyse konuşmayı aç
      if (activeChat && typeof switchChatTo === 'function') {
        switchChatTo(activeChat, 'student');
      }
    });
  }
  else if(id==='notifs') { el.innerHTML = notificationsPage(); updateNotifBadge(); }
  else if(id==='profile') { profilePage().then(html => { el.innerHTML = html; setTimeout(initApiSettings, 50); setTimeout(okulArkadaslariniYukle, 100); }); }
  setTimeout(()=>drawCharts(), 50);
}

function studentDashboard() {
  const userName = document.getElementById('menuName')?.textContent || 'Öğrenci';
  const firstName = userName.split(' ')[0];
  const todayKey = getTodayKey();

  // Gerçek verilerden hesapla
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const weekEntries = studyEntries.filter(e => e.dateKey >= weekAgo.toISOString().split('T')[0]);
  const weekQ = weekEntries.reduce((a,e)=>a+(e.questions||0),0);
  const weekDurMin = weekEntries.reduce((a,e)=>a+(e.duration||0),0);
  const weekDurH = (weekDurMin/60).toFixed(1);
  const pendingTasks = tasks.filter(t=>!t.done).length;
  const unseenTasks = tasks.filter(t=>!t.done && !t.seen).length;

  // Bugünkü girişler
  const todayEntries = studyEntries.filter(e=>e.dateKey===todayKey);

  // Haftalık takvim
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek===0?6:dayOfWeek-1));
  const weekDayData = weekDays.map((d,i)=>{
    const day = new Date(monday);
    day.setDate(monday.getDate()+i);
    const dk = day.toISOString().split('T')[0];
    const isToday = dk === todayKey;
    const dayEntries = studyEntries.filter(e=>e.dateKey===dk);
    const hasEntry = dayEntries.length > 0;
    return { d, dk, day, isToday, hasEntry, count: dayEntries.length };
  });
  const weekCalendar = weekDayData.map(({d,dk,day,isToday,hasEntry,count})=>{
    const isPast = dk < todayKey;
    const isFuture = dk > todayKey;
    return `<div class="day-cell ${hasEntry?'has-data':''} ${isToday?'today':''}" 
      onclick="openDayAction('${dk}','${day.toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'short'})}','${isToday}','${isPast}')"
      style="${isFuture?'opacity:0.4;cursor:default':'cursor:pointer'}">
      <div class="day-name">${d}</div>
      <div class="day-num">${day.getDate()}</div>
      ${hasEntry?`<div style="width:18px;height:4px;border-radius:2px;background:var(--accent3);margin-top:2px"></div>`:'<div style="height:6px"></div>'}
    </div>`;
  }).join('');

  return `
    <div class="page-title">🏠 Ana Sayfa</div>
    <div class="page-sub">Merhaba ${firstName}! Bugün ${new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</div>

    ${lgsCountdownWidget()}

    <!-- Nasıl Hissediyorum — her zaman animasyonlu banner -->
    <div class="wellness-banner-wrap">
      <button class="wellness-banner-inner" onclick="showPage('wellness')">
        <span class="wellness-heart-beat" style="font-size:1.8rem">💙</span>
        <div style="flex:1">
          <div style="font-weight:800;font-size:0.95rem">Nasıl Hissediyorum?</div>
          <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Bugünkü duygu, enerji ve hedeflerini kaydet</div>
        </div>
        <span style="color:var(--accent);font-size:1rem">›</span>
      </button>
    </div>

    <div class="grid-3">
      <div class="stat-card">
        <div class="stat-label">Bu Hafta Soru</div>
        <div class="stat-value" style="color:var(--accent)">${weekQ}</div>
        <div class="stat-change">${weekQ>0?'💪 Devam et!':'➕ Giriş yap'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Çalışma Süresi</div>
        <div class="stat-value" style="color:var(--accent3)">${weekDurH}<span style="font-size:1rem">sa</span></div>
        <div class="stat-change">${weekDurMin>0?'📅 Bu hafta':'➕ Başla!'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Bekleyen Ödev</div>
        <div class="stat-value" style="color:var(--accent4)">${pendingTasks}</div>
        <div class="stat-change">${pendingTasks>0?'📋 Tamamlanacak':'✅ Temiz!'}</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-title">📅 Bu Hafta
        <span style="float:right;font-size:0.72rem;color:var(--text2);font-weight:400">Güne tıkla → girişleri gör</span>
      </div>
      <div class="week-grid">${weekCalendar}</div>
      <!-- Seçili gün girişleri -->
      <div id="dayEntriesPanel" style="display:none;margin-top:14px;border-top:1px solid var(--border);padding-top:12px"></div>
      <!-- Geçmiş gün uyarısı -->
      <div id="pastDayWarning" style="display:none;margin-top:10px;padding:10px 14px;background:#f9ca2418;border:1.5px solid #f9ca2444;border-radius:10px;font-size:0.82rem;color:#f9ca24">
        ⚠️ <b>Geçmiş güne giriş yapıyorsun.</b> Bu veri <span id="pastDayLabel"></span> tarihine kaydedilecek.
      </div>
      <div style="margin-top:14px" id="dayActionBtn">
        <button class="btn btn-primary" style="width:100%" onclick="showPage('daily-entry')">+ Bugün Giriş Yap</button>
      </div>
    </div>

    </div>

    <!-- LGS Soru Dağılımı -->
    <button onclick="showPage('lgs-dagilim')"
      style="width:100%;display:flex;align-items:center;gap:14px;padding:13px 18px;
             background:linear-gradient(135deg,#f9ca2422,#fd79a818);
             border:1.5px solid #f9ca2455;border-radius:14px;
             cursor:pointer;color:var(--text);margin-bottom:14px;text-align:left">
      <span style="font-size:1.6rem">📊</span>
      <div style="flex:1">
        <div style="font-weight:800;font-size:0.92rem">LGS Soru Dağılımı</div>
        <div style="font-size:0.72rem;color:var(--text2);margin-top:2px">2018-2025 yıllara göre konu analizi</div>
      </div>
      <span style="color:var(--text2);font-size:1rem">›</span>
    </button>

    <div class="card">
      <div class="card-title">📊 Son Girişlerim</div>
      ${studyEntries.length === 0
        ? `<div style="text-align:center;padding:24px;color:var(--text2)">Henüz giriş yok. Çalışmaya başla! 💪</div>`
        : studyEntries.slice(0,5).map(e=>`
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
            <div style="font-size:1.2rem">${subjects.find(s=>s.name===e.subject)?.icon||'📚'}</div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:0.9rem">${e.subject}</div>
              <div style="font-size:0.82rem;color:var(--accent)">${e.topic}</div>
              <div style="font-size:0.75rem;color:var(--text2)">${e.dateKey||''} ${e.time||''}</div>
            </div>
            <div style="text-align:right;font-size:0.8rem;color:var(--text2)">
              ${e.duration?`<div>⏱ ${e.duration}dk</div>`:''}
              ${e.questions?`<div>📝 ${e.questions} soru</div>`:''}
              ${e.net!=null&&e.questions?`<div style="color:var(--accent3)">Net: ${e.net.toFixed(1)}</div>`:''}
            </div>
          </div>
        `).join('')
      }
    </div>

    <!-- Koç Kartı -->
    ${(window.currentUserData||{}).teacherId ? `
    <div class="card" style="margin-top:16px;cursor:pointer" onclick="kocProfilGoster()">
      <div style="display:flex;align-items:center;gap:14px">
        ${(window.currentUserData||{}).teacherPhoto
          ? `<img src="${(window.currentUserData||{}).teacherPhoto}" style="width:52px;height:52px;border-radius:50%;object-fit:cover">`
          : `<div style="width:52px;height:52px;border-radius:50%;background:var(--accent)22;color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;flex-shrink:0">👨‍🏫</div>`}
        <div style="flex:1">
          <div style="font-weight:800;font-size:1rem">${(window.currentUserData||{}).teacherName||'Koçum'}</div>
          <div style="font-size:0.78rem;color:var(--accent)">Koç Öğretmenim</div>
          <div style="font-size:0.72rem;color:var(--text2);margin-top:2px">Profili görüntülemek için tıkla 👆</div>
        </div>
        <span style="color:var(--text2);font-size:1.2rem">›</span>
      </div>
    </div>` : ''}
  `;
}

function studentDailyEntry() {
  const todayStr = new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long'});
  const todayKey = getTodayKey();
  const todayEntries = studyEntries.filter(e => e.isToday || e.dateKey === todayKey);
  const totalDur = todayEntries.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = todayEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.questions||0),0);
  const totalCorrect = todayEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.correct||0),0);
  const totalWrong = todayEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.wrong||0),0);

  // ---- GRUPLAMA ----
  // 1. Denemeler → examId/examTitle ile grupla
  const denemeMap = {};
  todayEntries.filter(e=>e.type==='deneme').forEach((e,i)=>{
    const key = e.examId || (e.topic||'Deneme Sınavı');
    if(!denemeMap[key]) denemeMap[key] = { title: e.examTitle||e.topic||'Deneme Sınavı', entries: [] };
    denemeMap[key].entries.push({...e, _localIdx: studyEntries.indexOf(e)});
  });

  // 2. Normal girişler → tür bazlı
  const typeGroups = {
    'soru':   { label: '📝 Soru Çözümü',     entries: [] },
    'konu':   { label: '📖 Konu Çalışması',   entries: [] },
    'tekrar': { label: '🔁 Tekrar',            entries: [] },
  };
  todayEntries.filter(e=>e.type!=='deneme').forEach(e=>{
    const g = typeGroups[e.type] || typeGroups['soru'];
    g.entries.push({...e, _localIdx: studyEntries.indexOf(e)});
  });

  // ---- GRUP RENDER YARDIMCI ----
  function renderEntryRow(e) {
    const icon = subjects.find(s=>s.name===e.subject)?.icon||'📚';
    const subj = subjects.find(s=>s.name===e.subject);
    const netStr = e.questions>0 ? `Net: <b style="color:var(--accent3)">${(e.net||0).toFixed(2)}</b>` : '';
    const eid = e.firestoreId || e.id || '';
    const idx = e._localIdx ?? studyEntries.findIndex(x=>x.time===e.time&&x.subject===e.subject&&x.dateKey===e.dateKey);
    return `
      <div style="display:flex;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:1.1rem;margin-right:10px;flex-shrink:0">${icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:0.88rem;color:var(--${subj?.cls||'accent'})">${e.subject}</div>
          ${e.type!=='deneme'?`<div style="font-size:0.76rem;color:var(--text2)">${e.topic||'Genel'}</div>`:''}
          <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">
            ⏱${e.duration||0}dk
            ${e.questions>0?` · 📝${e.questions} · ✅${e.correct||0} · ❌${e.wrong||0} · ${netStr}`:''}
          </div>
          ${e.note?`<div style="font-size:0.72rem;color:var(--text2);font-style:italic;margin-top:2px">📌 ${e.note}</div>`:''}
        </div>
        <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;margin-left:6px">
          <span style="font-size:0.65rem;color:var(--text2)">${e.time||''}</span>
          <button onclick="editEntryModal('${eid}',${idx})" style="background:var(--accent)15;border:none;padding:5px 7px;border-radius:6px;cursor:pointer;color:var(--accent);line-height:1">✏️</button>
          <button onclick="deleteEntry('${eid}',${idx})" style="background:#ff658415;border:none;padding:5px 7px;border-radius:6px;cursor:pointer;color:#ff6584;line-height:1">🗑️</button>
        </div>
      </div>`;
  }

  // ---- DENEME GRUPLARI RENDER ----
  const denemeGroups = Object.entries(denemeMap);
  const denemeHTML = denemeGroups.length === 0 ? '' : denemeGroups.map(([key, grp])=>{
    const subR = subjects.map(s=>{
      const se = grp.entries.find(e=>e.subject===s.name);
      if(!se) return null;
      return {name:s.name,icon:s.icon,cls:s.cls,d:se.correct||0,y:se.wrong||0,net:Math.round((se.net||0)*100)/100};
    }).filter(Boolean);
    const lgsR = calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:1})));
    const examId2 = grp.entries[0]?.examId || key;
    const accId = 'grp_deneme_'+key.replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'');
    return `
      <div style="border:1px solid var(--accent4)33;border-radius:12px;margin-bottom:10px;overflow:hidden">
        <!-- Başlık -->
        <div onclick="toggleDenemeAcc('${accId}')" style="display:flex;align-items:center;justify-content:space-between;padding:11px 13px;background:var(--accent4)10;cursor:pointer;user-select:none">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:1.2rem">🎯</span>
            <div>
              <div style="font-weight:800;font-size:0.9rem">${grp.title}</div>
              <div style="font-size:0.72rem;color:var(--text2)">${grp.entries.length} ders · Tahmini LGS: <b style="color:var(--accent)">${lgsR.puan}</b>/500</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="text-align:right">
              <div style="font-size:1.1rem;font-weight:900;color:var(--accent)">${lgsR.puan}</div>
              <div style="font-size:0.58rem;color:var(--text2)">/500</div>
            </div>
            <span id="${accId}_arrow" style="color:var(--text2)">▼</span>
          </div>
        </div>
        <!-- Detay -->
        <div id="${accId}" style="display:none;padding:8px 12px;background:var(--surface)">
          ${subR.map(s=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:0.82rem;color:var(--${s.cls})">${s.icon} ${s.name}</span>
              <span style="font-size:0.8rem">D:${s.d} Y:${s.y} <b style="color:var(--accent3)">Net:${s.net.toFixed(2)}</b></span>
            </div>`).join('')}
          <div style="margin-top:8px;font-size:0.75rem;color:var(--text2);display:flex;justify-content:space-between">
            <span>Ham Puan: <b style="color:var(--accent)">${lgsR.hamPuan}</b></span>
            <span>LGS Tahmini: <b style="color:var(--accent)">${lgsR.puan}/500</b></span>
          </div>
          <!-- Düzenle/Sil -->
          <div style="display:flex;gap:8px;margin-top:8px">
            <button onclick="editDeneme('${examId2}','${grp.title.replace(/'/g,'\\\'')}')" style="flex:1;background:var(--accent)15;border:none;padding:7px;border-radius:8px;cursor:pointer;font-size:0.82rem;color:var(--accent)">✏️ İsim Düzenle</button>
            <button onclick="deleteDeneme('${examId2}')" style="flex:1;background:#ff658415;border:none;padding:7px;border-radius:8px;cursor:pointer;font-size:0.82rem;color:#ff6584">🗑️ Sil</button>
          </div>
        </div>
      </div>`;
  }).join('');

  // ---- NORMAL GİRİŞ GRUPLARI RENDER ----
  const normalHTML = Object.values(typeGroups).filter(g=>g.entries.length>0).map(g=>{
    const totalGrpQ = g.entries.reduce((a,e)=>a+(e.questions||0),0);
    const totalGrpNet = g.entries.reduce((a,e)=>a+(e.net||0),0);
    const totalGrpDur = g.entries.reduce((a,e)=>a+(e.duration||0),0);
    const accId2 = 'grp_'+g.label.replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'');
    return `
      <div style="border:1px solid var(--border);border-radius:12px;margin-bottom:10px;overflow:hidden">
        <div onclick="toggleDenemeAcc('${accId2}')" style="display:flex;align-items:center;justify-content:space-between;padding:11px 13px;background:var(--surface2);cursor:pointer;user-select:none">
          <div>
            <div style="font-weight:800;font-size:0.9rem">${g.label}</div>
            <div style="font-size:0.72rem;color:var(--text2)">${g.entries.length} giriş · ${totalGrpDur}dk${totalGrpQ>0?' · '+totalGrpQ+' soru · Net:'+totalGrpNet.toFixed(1):''}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="background:var(--accent)22;color:var(--accent);font-size:0.8rem;font-weight:700;padding:3px 8px;border-radius:99px">${g.entries.length}</span>
            <span id="${accId2}_arrow" style="color:var(--text2)">▼</span>
          </div>
        </div>
        <div id="${accId2}" style="display:none;padding:0 12px;background:var(--surface)">
          ${g.entries.map(e=>renderEntryRow(e)).join('')}
          <div style="height:4px"></div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="page-title">✏️ Günlük Çalışma Girişi</div>
    <div class="page-sub">${todayStr}</div>

    <div class="grid-3" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-label">Toplam Süre</div>
        <div class="stat-value" style="color:var(--accent)">${totalDur}<span style="font-size:0.9rem">dk</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Soru</div>
        <div class="stat-value" style="color:var(--accent4)">${totalQ}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">D / Y</div>
        <div class="stat-value" style="font-size:1.2rem"><span style="color:var(--accent3)">${totalCorrect}</span><span style="color:var(--text2);font-size:0.9rem"> / </span><span style="color:var(--accent2)">${totalWrong}</span></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-title">📚 Ders Seç & Çalışma Ekle</div>
      <div class="subject-entry-grid">
        ${subjects.map(s=>{
          const sEntries = todayEntries.filter(e=>e.subject===s.name&&e.type==='soru');
          const sQ = sEntries.reduce((a,e)=>a+(e.questions||0),0);
          const sD = sEntries.reduce((a,e)=>a+(e.correct||0),0);
          const sY = sEntries.reduce((a,e)=>a+(e.wrong||0),0);
          const sNet = sEntries.reduce((a,e)=>a+(e.net||0),0);
          const girisCount = todayEntries.filter(e=>e.subject===s.name).length;
          return `
          <div class="subject-entry-card" onclick="openEntryFor('${s.name}')">
            <div class="sec-name"><span class="sec-dot" style="background:${s.color}"></span>${s.icon} ${s.name}</div>
            ${sQ>0
              ? `<div style="font-size:0.72rem;color:var(--text2);margin-top:2px">${sQ} soru • ✅${sD} ❌${sY}</div>
                 <div style="font-size:0.72rem;font-weight:700;color:var(--accent3)">Net: ${sNet.toFixed(1)}</div>`
              : `<div style="font-size:0.75rem;color:var(--text2)">${girisCount} giriş</div>`}
          </div>`;}).join('')}
      </div>
      <!-- Deneme Sınavı butonu -->
      ${(()=>{
        const denemeCount = todayEntries.filter(e=>e.type==='deneme').length;
        const denemeNet   = todayEntries.filter(e=>e.type==='deneme').reduce((a,e)=>a+(e.net||0),0);
        return `<button onclick="openDenemeSinaviEntry()"
          style="width:100%;margin-top:12px;padding:12px;border-radius:12px;
                 background:linear-gradient(135deg,#6c63ff22,#45b7d122);
                 border:1.5px solid #6c63ff66;color:var(--text);cursor:pointer;
                 display:flex;align-items:center;justify-content:space-between;font-size:0.88rem;font-weight:700">
          <span>📊 Deneme Sınavı Ekle</span>
          ${denemeCount>0
            ? `<span style="font-size:0.78rem;color:var(--accent);font-weight:700">${denemeCount} deneme • Net: ${denemeNet.toFixed(1)}</span>`
            : ``}
        </button>`;
      })()}
      
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom:12px">📋 Bugünkü Girişler
        ${todayEntries.length>0?`<span style="float:right;font-size:0.75rem;color:var(--text2);font-weight:400">${todayEntries.length} kayıt</span>`:''}
      </div>
      ${todayEntries.length === 0
        ? `<div style="text-align:center;padding:24px;color:var(--text2)">Henüz giriş yok. Yukarıdan ekle! 💪</div>`
        : `${denemeHTML}${normalHTML}`}
    </div>
  `;
}

let analysisPeriod = 'weekly'; // 'daily' | 'weekly' | 'monthly'

function studentAnalysis() {
  const now = new Date();
  const todayKey = getDateKey(now);

  // Period filtre
  let filtered = [];
  let periodLabel = '';
  if (analysisPeriod === 'daily') {
    filtered = studyEntries.filter(e => e.dateKey === todayKey);
    periodLabel = 'Bugün';
  } else if (analysisPeriod === 'weekly') {
    const monday = new Date(now);
    monday.setDate(now.getDate() - (now.getDay()===0?6:now.getDay()-1));
    const mondayKey = monday.toISOString().split('T')[0];
    filtered = studyEntries.filter(e => e.dateKey >= mondayKey);
    periodLabel = 'Bu Hafta';
  } else {
    const monthStart = todayKey.substring(0,7) + '-01';
    filtered = studyEntries.filter(e => e.dateKey >= monthStart);
    periodLabel = 'Bu Ay';
  }

  // İstatistikler
  const totalDur = filtered.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = filtered.reduce((a,e)=>a+(e.questions||0),0);
  const totalCorrect = filtered.reduce((a,e)=>a+(e.correct||0),0);
  const totalWrong = filtered.reduce((a,e)=>a+(e.wrong||0),0);
  const totalNet = filtered.reduce((a,e)=>a+(e.net||0),0);
  const dayCount = new Set(filtered.map(e=>e.dateKey)).size;

  // Ders bazlı analiz
  const subjectStats = subjects.map(s => {
    const se = filtered.filter(e=>e.subject===s.name);
    const q = se.reduce((a,e)=>a+(e.questions||0),0);
    const d = se.reduce((a,e)=>a+(e.correct||0),0);
    const y = se.reduce((a,e)=>a+(e.wrong||0),0);
    const net = se.reduce((a,e)=>a+(e.net||0),0);
    const dur = se.reduce((a,e)=>a+(e.duration||0),0);
    const netPct = q > 0 ? Math.round((d/q)*100) : 0;
    return { ...s, q, d, y, net, dur, netPct, count: se.length };
  });

  const maxQ = Math.max(...subjectStats.map(s=>s.q), 1);

  // Güçlü/zayıf konular
  const subWithQ = subjectStats.filter(s=>s.q>0).sort((a,b)=>b.netPct-a.netPct);
  const strong = subWithQ.slice(0,2);
  const weak = [...subjectStats].filter(s=>s.q>0).sort((a,b)=>a.netPct-b.netPct).slice(0,2);

  // Yorum üret
  const comment = generateAnalysisComment(filtered, subjectStats, totalDur, totalQ, totalNet, dayCount, analysisPeriod);

  // Haftalık trend tablosu (son 7 gün)
  const trendData = [];
  for (let i=6;i>=0;i--) {
    const d = new Date(now); d.setDate(now.getDate()-i);
    const dk = d.toISOString().split('T')[0];
    const dayQ = studyEntries.filter(e=>e.dateKey===dk).reduce((a,e)=>a+(e.questions||0),0);
    const dayDur = studyEntries.filter(e=>e.dateKey===dk).reduce((a,e)=>a+(e.duration||0),0);
    trendData.push({ label: d.toLocaleDateString('tr-TR',{weekday:'short'}), q: dayQ, dur: dayDur, dk });
  }
  const maxTQ = Math.max(...trendData.map(t=>t.q),1);

  return `
    <div class="page-title">📈 Analizlerim</div>
    <div class="page-sub">Kişisel performans takibi</div>

    <!-- Dönem seçici -->
    <div style="display:flex;gap:8px;margin-bottom:20px;background:var(--surface2);border-radius:12px;padding:4px">
      ${['daily','weekly','monthly'].map((p,i)=>{
        const lbl = ['Günlük','Haftalık','Aylık'][i];
        return `<button onclick="analysisPeriod='${p}';showPage('my-analysis')"
          style="flex:1;padding:8px;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:0.85rem;
            background:${analysisPeriod===p?'var(--accent)':'transparent'};
            color:${analysisPeriod===p?'#fff':'var(--text2)'};transition:all .2s">${lbl}</button>`;
      }).join('')}
    </div>

    <!-- Özet kartlar -->
    <div class="grid-3" style="margin-bottom:16px">
      <div class="stat-card">
        <div class="stat-label">Çalışma Süresi</div>
        <div class="stat-value" style="color:var(--accent)">${totalDur}<span style="font-size:0.8rem">dk</span></div>
        <div class="stat-change">${dayCount} gün aktif</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Soru</div>
        <div class="stat-value" style="color:var(--accent4)">${totalQ}</div>
        <div class="stat-change">✅${totalCorrect} ❌${totalWrong}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Net</div>
        <div class="stat-value" style="color:var(--accent3)">${totalNet.toFixed(1)}</div>
        <div class="stat-change">${totalQ>0?(totalNet/totalQ*100).toFixed(0)+'% isabet':'-'}</div>
      </div>
    </div>

    <!-- Son 7 günlük trend -->
    ${analysisPeriod !== 'daily' ? `
    <div class="card" style="margin-bottom:16px">
      <div class="card-title">📊 Son 7 Günlük Trend</div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:80px;padding:0 4px">
        ${trendData.map(t=>{
          const h = Math.round((t.q/maxTQ)*70)+2;
          const isToday = t.dk === todayKey;
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="font-size:0.65rem;color:var(--text2)">${t.q||''}</div>
            <div style="width:100%;height:${h}px;background:${isToday?'var(--accent)':'var(--accent)44'};border-radius:4px 4px 0 0;min-height:3px"></div>
            <div style="font-size:0.68rem;color:${isToday?'var(--accent)':'var(--text2)'};font-weight:${isToday?'800':'600'}">${t.label}</div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

    <!-- Ders bazlı detay -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-title">📚 Ders Bazlı Analiz — ${periodLabel}</div>
      ${filtered.length === 0
        ? `<div style="text-align:center;padding:24px;color:var(--text2)">Bu dönemde henüz veri yok. Çalışma girişi ekle! 💪</div>`
        : subjectStats.map(s=>`
          <div style="padding:10px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:700;font-size:0.88rem;color:var(--${s.cls})">${s.icon} ${s.name}</span>
              <span style="font-size:0.78rem;color:var(--text2)">${s.q} soru • ${s.dur}dk • Net: <b style="color:var(--accent3)">${s.net.toFixed(1)}</b></span>
            </div>
            <div class="bar-bg" style="height:6px">
              <div class="bar-fill bg-${s.cls}" style="width:${Math.round(s.q/maxQ*100)}%"></div>
            </div>
            ${s.q>0?`<div style="font-size:0.72rem;color:var(--text2);margin-top:4px">✅${s.d} doğru &nbsp; ❌${s.y} yanlış &nbsp; 🎯%${s.netPct} isabet</div>`:''}
          </div>
        `).join('')}
    </div>

    <!-- Güçlü / Zayıf -->
    ${filtered.length > 0 ? `
    <div class="card" style="margin-bottom:16px">
      <div class="card-title">⚡ Güçlü & Zayıf Derslerim</div>
      <div class="grid-2">
        <div>
          <div style="color:var(--accent3);font-weight:800;margin-bottom:10px">💪 En Başarılı</div>
          ${strong.length ? strong.map(s=>`
            <div style="padding:8px 12px;background:rgba(67,233,123,.08);border-radius:8px;font-size:0.83rem;margin-bottom:6px;border:1px solid rgba(67,233,123,.2)">
              ${s.icon} ${s.name} — %${s.netPct} isabet
            </div>`).join('') : '<div style="color:var(--text2);font-size:0.82rem">Yeterli veri yok</div>'}
        </div>
        <div>
          <div style="color:var(--accent2);font-weight:800;margin-bottom:10px">⚠️ Çalışılmalı</div>
          ${weak.length ? weak.map(s=>`
            <div style="padding:8px 12px;background:rgba(255,101,132,.08);border-radius:8px;font-size:0.83rem;margin-bottom:6px;border:1px solid rgba(255,101,132,.2)">
              ${s.icon} ${s.name} — %${s.netPct} isabet
            </div>`).join('') : '<div style="color:var(--text2);font-size:0.82rem">Yeterli veri yok</div>'}
        </div>
      </div>
    </div>` : ''}

    <!-- Koç Yorumu -->
    <div class="card" style="margin-bottom:16px;background:linear-gradient(135deg,var(--accent)12,var(--accent)05);border:1px solid var(--accent)33">
      <div class="card-title">🤖 Performans Yorumu</div>
      <div style="font-size:0.88rem;line-height:1.7;color:var(--text)">${comment}</div>
    </div>

    <!-- Deneme Sınavları -->
    ${(()=>{
      const allD = studyEntries.filter(e=>e.type==='deneme');
      if(allD.length===0) return '';
      const dMap = {};
      allD.forEach(e=>{ const k=e.examId||(e.dateKey+'_legacy'); if(!dMap[k]) dMap[k]=[]; dMap[k].push(e); });
      const dList = Object.entries(dMap).sort((a,b)=>(b[1][0]?.dateKey||'').localeCompare(a[1][0]?.dateKey||'')).map(([k,dersler],i)=>{
        const title = dersler[0]?.examTitle||dersler[0]?.topic||(dersler[0]?.dateKey+' Denemesi');
        const dk = dersler[0]?.dateKey||'';
        const dateL = dk ? new Date(dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}) : '';
        const subR = subjects.map(s=>{ const se=dersler.find(e=>e.subject===s.name); if(!se) return {...s,d:0,y:0,net:0,q:0}; const d=se.correct||0,y=se.wrong||0; return {...s,d,y,net:Math.round((d-y/3)*100)/100,q:d+y}; });
        const lgsR = calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:s.q>0?1:0})));
        const examId2 = dersler[0]?.examId||k;
        const accId = 'std_den_'+i;
        const num = i+1;
        return `<div style="border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:8px">
          <div style="display:flex;align-items:stretch">
            <div onclick="toggleDenemeAcc('${accId}')" style="flex:1;display:flex;justify-content:space-between;align-items:center;padding:12px 10px;cursor:pointer;background:var(--surface2);user-select:none">
              <div style="min-width:0">
                <div style="font-weight:800;font-size:0.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px">${title}</div>
                <div style="font-size:0.7rem;color:var(--text2)">${dateL}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                <div style="text-align:right">
                  <div style="font-size:1.2rem;font-weight:900;color:var(--accent)">${lgsR.puan}</div>
                  <div style="font-size:0.6rem;color:var(--text2)">/500</div>
                </div>
                <span id="${accId}_arrow" style="font-size:0.9rem;color:var(--text2)">▼</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;border-left:1px solid var(--border)">
              <button onclick="editDeneme('${examId2}','${title.replace(/'/g,'\\\'')}')" style="flex:1;background:var(--accent)15;border:none;padding:0 12px;cursor:pointer;font-size:0.85rem;color:var(--accent);border-bottom:1px solid var(--border)" title="Düzenle">✏️</button>
              <button onclick="deleteDeneme('${examId2}')" style="flex:1;background:#ff658415;border:none;padding:0 12px;cursor:pointer;font-size:0.85rem;color:#ff6584" title="Sil">🗑️</button>
            </div>
          </div>
          <div id="${accId}" style="display:none;padding:12px;background:var(--surface);border-top:1px solid var(--border)">
            ${subR.filter(s=>s.q>0).map(s=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:0.8rem"><span style="color:var(--${s.cls})">${s.icon} ${s.name}</span><span>D:${s.d} Y:${s.y} <b style="color:var(--accent3)">Net:${s.net.toFixed(2)}</b></span></div>`).join('')}
            <div style="text-align:right;font-size:0.78rem;font-weight:800;color:var(--accent);margin-top:8px">Ham: ${lgsR.hamPuan} → LGS: ${lgsR.puan}/500</div>
          </div>
        </div>`;
      });
      return `<div class="card" style="margin-bottom:16px;border:1px solid var(--accent4)33">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div class="card-title" style="margin:0">🎯 Deneme Sınavlarım</div>
          <div style="font-size:0.75rem;color:var(--text2)">${dList.length} deneme</div>
        </div>
        ${dList.join('')}
      </div>`;
    })()}

    <!-- PDF -->
    <div class="pdf-actions">
      <button class="pdf-btn" onclick="exportStudentPDF()">📄 PDF Raporu İndir</button>
    </div>
  `;
}

function generateAnalysisComment(filtered, subjectStats, totalDur, totalQ, totalNet, dayCount, period, studentNameParam) {
  if (filtered.length === 0) {
    return `Henüz bu dönem için çalışma verisi bulunmuyor. Düzenli çalışma girişi yaparak performansını takip edebilirsin. Her gün küçük adımlar büyük fark yaratır! 💪`;
  }
  const avgDurPerDay = dayCount > 0 ? Math.round(totalDur/dayCount) : 0;
  const netRate = totalQ > 0 ? (totalNet/totalQ*100).toFixed(0) : 0;
  const subWithQ = subjectStats.filter(s=>s.q>0).sort((a,b)=>b.netPct-a.netPct);
  const bestSub = subWithQ[0];
  const worstSub = [...subWithQ].reverse()[0];

  let comments = [];

  // Süre yorumu
  if (period === 'daily') {
    if (totalDur >= 180) comments.push(`Bugün <b>${totalDur} dakika</b> çalıştın — harika bir gün! 🏆`);
    else if (totalDur >= 90) comments.push(`Bugün <b>${totalDur} dakika</b> çalıştın — iyi devam! ✅`);
    else comments.push(`Bugün <b>${totalDur} dakika</b> çalıştın. Günlük en az 2 saat hedeflemeye çalış. 📚`);
  } else if (period === 'weekly') {
    if (dayCount >= 5) comments.push(`Bu hafta <b>${dayCount} gün</b> çalışman düzenlilik açısından çok iyi! 🌟`);
    else comments.push(`Bu hafta <b>${dayCount} gün</b> aktif oldun. Haftada en az 5 gün hedefle. 📅`);
    if (avgDurPerDay >= 120) comments.push(`Günlük ortalama <b>${avgDurPerDay} dakika</b> çalıştın — bu harika bir tempo! 🚀`);
    else comments.push(`Günlük ortalama <b>${avgDurPerDay} dakika</b> çalışıyorsun. Bunu artırmak için günlük küçük hedefler koy. ⏰`);
  } else {
    if (dayCount >= 20) comments.push(`Bu ay <b>${dayCount} gün</b> çalıştın — aylık hedefini tutturuyorsun! 🏆`);
    else comments.push(`Bu ay <b>${dayCount} aktif gün</b> var. Aylık 25 gün hedefle. 📆`);
    comments.push(`Toplam <b>${totalDur} dakika</b> (${(totalDur/60).toFixed(1)} saat) çalışma yaptın.`);
  }

  // Soru/net yorumu
  if (totalQ > 0) {
    if (netRate >= 70) comments.push(`<b>${totalQ} sorudan</b> net oranın <b>%${netRate}</b> — isabetli çalışıyorsun! ✨`);
    else if (netRate >= 50) comments.push(`<b>${totalQ} sorudan</b> net oranın <b>%${netRate}</b>. Yanlışları tekrar et, oran yükselecek. 📖`);
    else comments.push(`<b>${totalQ} soru</b> çözdün ancak isabet oranın <b>%${netRate}</b>. Hız yerine anlayarak çöz. 🔍`);
  }

  // Ders yorumu
  if (bestSub) comments.push(`En güçlü dersin <b>${bestSub.name}</b> (%${bestSub.netPct} isabet) — tebrikler! 🎯`);
  if (worstSub && worstSub.name !== bestSub?.name) comments.push(`<b>${worstSub.name}</b> dersine biraz daha odaklanabilirsin (%${worstSub.netPct} isabet). 💡`);

  // Deneme özeti
  // Öğrenciye ait tüm deneme girişleri
  // selectedStudentName global — öğretmen tarafında seçili öğrenci
  // Öğrenci kendi raporunu alıyorsa filtered içindeki studentName'i kullan
  // Öğrenci adını belirle — studentNameParam öncelikli
  const _sName = studentNameParam
    || (typeof selectedStudentName !== 'undefined' && selectedStudentName)
    || filtered.find(e=>e.studentName)?.studentName
    || null;
  // Deneme girişlerini filtrele — studentName veya userId eşleşmesi
  const _currentUid = (window.currentUserData||{}).uid || null;
  const _dAll = studyEntries.filter(e=>{
    if (e.type !== 'deneme') return false;
    if (!_sName && !_currentUid) return true; // filtre yoksa hepsini al
    if (_currentUid && e.userId === _currentUid) return true;
    if (_sName && e.studentName === _sName) return true;
    return false;
  });
  const _dUse = _dAll;
  if (_dUse.length >= 1) {
    const _grp={};
    _dUse.forEach(e=>{
      const k=e.examId||e.dateKey;
      if(!_grp[k]) _grp[k]={dersler:{}};
      const net=Math.max(0,(e.correct||0)-(e.wrong||0)/3);
      if(!_grp[k].dersler[e.subject]) _grp[k].dersler[e.subject]={net:0,cnt:0};
      _grp[k].dersler[e.subject]={net, cnt:1};
    });
    const _lgsSoru={'Türkçe':20,'Matematik':20,'Fen Bilimleri':20,'İnkılap Tarihi':10,'Din Kültürü':10,'İngilizce':10};
    const _dSira=Object.values(_grp);
    const _topNet=d=>Object.values(d.dersler).reduce((a,v)=>a+v.net,0);
    const _puan=n=>Math.min(500,Math.max(100,Math.round(100+n*4.444)));
    const _ortP=Math.round(_dSira.reduce((a,d)=>a+_puan(_topNet(d)),0)/_dSira.length);
    const _dOrt={};
    _dSira.forEach(d=>Object.entries(d.dersler).forEach(([ders,v])=>{
      if(!_dOrt[ders]) _dOrt[ders]={net:0,cnt:0,max:_lgsSoru[ders]||10};
      _dOrt[ders].net+=v.net; _dOrt[ders].cnt++;
    }));
    const _arr=Object.entries(_dOrt)
      .map(([d,v])=>({d,ort:Math.round(v.net/v.cnt*10)/10,max:v.max,pct:Math.min(100,Math.round(v.net/v.cnt/v.max*100))}))
      .sort((a,b)=>a.pct-b.pct);
    const _enZ=_arr[0], _enG=_arr[_arr.length-1];
    const _son=_puan(_topNet(_dSira[_dSira.length-1]));
    const _ilk=_puan(_topNet(_dSira[0]));
    const _trend=_son-_ilk>15?'artış trendi var':_son-_ilk>5?'hafif yükseliş var':_son-_ilk>-15?'stabil':'düşüş var';
    comments.push(
      '<b>'+_dSira.length+' denemede</b> tahmini LGS puan ortalaması yaklaşık <b>'+_ortP+'/500</b>; son deneme '+_son+' puan, '+_trend+'. '+
      (_enG?'En yüksek net ortalaması <b>'+_enG.d+'</b> (ort. '+_enG.ort+'/'+_enG.max+' net). ':'')+
      (_enZ&&_enZ.d!==_enG?.d?'En düşük net ortalaması <b>'+_enZ.d+'</b> (ort. '+_enZ.ort+'/'+_enZ.max+' net) — öncelikli çalışma alanı.':'')
    );
  }

  // Genel öneri
  const lgsDate = new Date('2026-06-14T09:30:00+03:00');
  const daysLeft = Math.floor((lgsDate - new Date())/(1000*60*60*24));
  comments.push(`<b>LGS'ye ${daysLeft} gün</b> kaldı — her gün düzenli çalışmak seni hedefe taşır! 🚀`);

  return comments.join('<br><br>');
}

function exportStudentPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'p', unit:'mm', format:'a4' });
  const name = document.getElementById('menuName')?.textContent;
  const periodLabels = { daily:'Günlük', weekly:'Haftalık', monthly:'Aylık' };
  const pLabel = periodLabels[analysisPeriod] || 'Haftalık';

  // Gradient header
  doc.setFillColor(108,99,255); doc.rect(0,0,210,38,'F');
  doc.setFillColor(67,233,123); doc.rect(0,36,210,3,'F');
  // Logo ikonu sol üst
  pdfDrawLogo(doc, 8, 3, 22);
  doc.setFont(_PF,'bold'); doc.setFontSize(14); doc.setTextColor(255,255,255);
  doc.text('LGS', 33, 13); doc.setTextColor(180,230,255); doc.text('Koç', 47, 13);
  doc.setFont(_PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(76,201,240);
  doc.text(tx('Öğrenci Takip'), 33, 19);
  // Orta başlık
  doc.setFont(_PF,'bold'); doc.setFontSize(11); doc.setTextColor(255,255,255);
  doc.text('Öğrenci Analiz Raporu', 130, 14, {align:'center'});
  doc.setFontSize(8); doc.setFont(_PF,'normal'); doc.setTextColor(210,205,255);
  doc.text(`${name} | ${pLabel} Rapor | ${new Date().toLocaleDateString('tr-TR')}`, 130, 22, {align:'center'});

  let y = 50;

  // Özet kutuları
  const now = new Date();
  const todayKey = getDateKey(now);
  let filtered = [];
  if (analysisPeriod === 'daily') filtered = studyEntries.filter(e=>e.dateKey===todayKey);
  else if (analysisPeriod === 'weekly') {
    const monday = new Date(now); monday.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
    filtered = studyEntries.filter(e=>e.dateKey>=monday.toISOString().split('T')[0]);
  } else {
    filtered = studyEntries.filter(e=>e.dateKey>=todayKey.substring(0,7)+'-01');
  }

  const totalDur = filtered.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = filtered.reduce((a,e)=>a+(e.questions||0),0);
  const totalCorrect = filtered.reduce((a,e)=>a+(e.correct||0),0);
  const totalWrong = filtered.reduce((a,e)=>a+(e.wrong||0),0);
  const totalNet = filtered.reduce((a,e)=>a+(e.net||0),0);
  const dayCount = new Set(filtered.map(e=>e.dateKey)).size;

  const stats = [
    ['Süre (dk)', totalDur], ['Toplam Soru', totalQ],
    ['Doğru', totalCorrect], ['Yanlış', totalWrong],
    ['Net', totalNet.toFixed(1)], ['Aktif Gün', dayCount]
  ];
  const bw = 28, bh = 16, bx = 14, gap = 4;
  stats.forEach((s,i)=>{
    const x = bx + i*(bw+gap);
    doc.setFillColor(245,245,255); doc.roundedRect(x, y, bw, bh, 2, 2, 'F');
    doc.setFontSize(14); doc.setFont(_PF,'bold'); doc.setTextColor(108,99,255);
    doc.text(String(s[1]), x+bw/2, y+10, {align:'center'});
    doc.setFontSize(7); doc.setFont(_PF,'normal'); doc.setTextColor(100,100,120);
    doc.text(s[0], x+bw/2, y+14, {align:'center'});
  });
  y += 26;

  // Ders tablosu
  doc.setFont(_PF,'bold'); doc.setFontSize(12); doc.setTextColor(30,30,50);
  doc.text('Ders Bazlı Analiz', 14, y); y += 7;

  const headers = ['Ders','Süre(dk)','Soru','Doğru','Yanlış','Net','%İsabet'];
  const colW = [40,22,18,18,18,16,22];
  let cx = 14;
  doc.setFillColor(108,99,255);
  headers.forEach((h,i)=>{ doc.rect(cx,y,colW[i],7,'F'); cx+=colW[i]; });
  doc.setTextColor(255,255,255); doc.setFontSize(8);
  cx = 14;
  headers.forEach((h,i)=>{ doc.text(h, cx+colW[i]/2, y+5, {align:'center'}); cx+=colW[i]; });
  y += 7;

  subjects.forEach((s,idx)=>{
    const se = filtered.filter(e=>e.subject===s.name);
    const q = se.reduce((a,e)=>a+(e.questions||0),0);
    const d = se.reduce((a,e)=>a+(e.correct||0),0);
    const w = se.reduce((a,e)=>a+(e.wrong||0),0);
    const net = se.reduce((a,e)=>a+(e.net||0),0);
    const dur = se.reduce((a,e)=>a+(e.duration||0),0);
    const pct = q>0?Math.round(d/q*100):0;
    const row = [s.name, dur, q, d, w, net.toFixed(1), '%'+pct];
    doc.setFillColor(idx%2===0?248:255, idx%2===0?248:255, idx%2===0?252:255);
    cx = 14;
    colW.forEach(w=>{ doc.rect(cx,y,w,6,'F'); cx+=w; });
    doc.setTextColor(30,30,50); doc.setFontSize(8);
    cx = 14;
    row.forEach((v,i)=>{ doc.text(String(v), cx+colW[i]/2, y+4.5, {align:'center'}); cx+=colW[i]; });
    y += 6;
  });
  y += 8;

  // Yorum
  const subjectStats = subjects.map(s=>{
    const se=filtered.filter(e=>e.subject===s.name);
    const q=se.reduce((a,e)=>a+(e.questions||0),0);
    const d=se.reduce((a,e)=>a+(e.correct||0),0);
    const w=se.reduce((a,e)=>a+(e.wrong||0),0);
    const net=se.reduce((a,e)=>a+(e.net||0),0);
    const dur=se.reduce((a,e)=>a+(e.duration||0),0);
    const netPct=q>0?Math.round(d/q*100):0;
    return {...s,q,d,y:w,net,dur,netPct};
  });
  const rawComment = generateAnalysisComment(filtered,subjectStats,totalDur,totalQ,totalNet,dayCount,analysisPeriod,name)
    .replace(/<b>/g,'').replace(/<\/b>/g,'').replace(/<br><br>/g,'\n').replace(/<[^>]+>/g,'');

  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFillColor(245,245,255); doc.roundedRect(14, y, 182, 6, 2, 2, 'F');
  doc.setFont(_PF,'bold'); doc.setFontSize(11); doc.setTextColor(108,99,255);
  doc.text('Performans Yorumu', 105, y+4.5, {align:'center'}); y += 10;
  doc.setFont(_PF,'normal'); doc.setFontSize(8.5); doc.setTextColor(40,40,60);
  const lines = doc.splitTextToSize(rawComment, 182);
  lines.forEach(l=>{ if(y>280){doc.addPage();y=20;} doc.text(l,14,y); y+=5; });

  // Footer
  doc.setFillColor(108,99,255); doc.rect(0,287,210,10,'F');
  doc.setTextColor(255,255,255); doc.setFontSize(8);
  doc.text('LGSKoç - Öğrenci Takip Sistemi | lgs-koc-takip.firebaseapp.com', 105, 293, {align:'center'});

  const fname2 = ts(name.replace(/\s+/g,'_'))+'_'+pLabel+'_analiz_'+todayKey+'.pdf';
  pdfDownload(doc, fname2);
}

