
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
    if (window.RC_WELLNESS_AKTIF === false) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Bu özellik şu an kullanılamıyor.</div>'; return; }
    loadWellnessFromFirestore().then(()=>{
      el.innerHTML = wellnessPage();
      // Render sonrası doğrulama — bugünün tarihi ile uyumsuz veri varsa temizle
      _wellnessDateGuard();
    });
  }
  else if(id==='macera') {
    if (window.RC_MACERA_AKTIF === false) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Bu özellik şu an kullanılamıyor.</div>'; return; }
    el.innerHTML = maceraPage(); _colonyPostRender();
  }
  else if(id==='market') {
    if (window.RC_MARKET_AKTIF === false) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Bu özellik şu an kullanılamıyor.</div>'; return; }
    el.innerHTML = marketPage();
  }
  else if(id==='lgs-dagilim') el.innerHTML = lgsDagilimPage();
  else if(id==='all-denemeler') el.innerHTML = allDenemelerPage();
  else if(id==='messages') {
    messagesPage('student').then(html => { el.innerHTML = html; });
  }
  else if(id==='notifs') { el.innerHTML = notificationsPage(); updateNotifBadge(); }
  else if(id==='profile') {
    profilePage().then(html => {
      el.innerHTML = html;
      setTimeout(initApiSettings, 50);
      setTimeout(okulArkadaslariniYukle, 100);
      setTimeout(odulleriniYukle, 200);
      // Bildirimden ödül ile yönlenme
      if (window._pendingOdulAc) {
        window._pendingOdulAc = false;
        setTimeout(() => {
          const body = document.getElementById('odullerim-body');
          if (body && body.style.display === 'none') toggleOdullerim();
          const kart = document.getElementById('odullerim-kart');
          if (kart) kart.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    });
  }
  else if(id==='badges' || id==='rozet') { showBadgesPage(); }
  else if(id==='yardim') { el.innerHTML = yardimPage(); }
  else if(id==='program') { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">📅 Yükleniyor...</div>'; programiPage().then(html => { el.innerHTML = html; _programPostRender(); }); }
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
    <div class="page-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Ana Sayfa</div>
    <div class="page-sub">Merhaba ${firstName}! Bugün ${new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</div>

    ${lgsCountdownWidget()}

    <!-- Günlük Kartı — hızlı mood + streak -->
    ${(()=>{
      const myUid = (window.currentUserData||{}).uid || 'local';
      let wdata = {};
      try { wdata = JSON.parse(localStorage.getItem('wellness_'+myUid)||'{}'); } catch(e){}
      const todayKey = getTodayKey();
      const today = wdata.days?.[todayKey] || {};
      const hasMood = !!today.mood;

      // Streak hesapla
      let streak = 0;
      const d2 = new Date();
      while(streak<365){ const k=d2.toISOString().slice(0,10).replace(/-/g,''); if(wdata.days?.[k]&&Object.keys(wdata.days[k]).length>0){streak++;d2.setDate(d2.getDate()-1);}else break; }

      const streakBadge = streak>=2 ? `<span style="font-size:0.68rem;background:#ff6b0012;border:1px solid #ff6b0030;color:#cc4400;border-radius:99px;padding:2px 9px;font-weight:800;white-space:nowrap">🔥 ${streak} gün</span>` : '';

      const moods = [{e:'😣',v:'bad'},{e:'😕',v:'hard'},{e:'😐',v:'ok'},{e:'😊',v:'good'},{e:'😄',v:'great'}];
      const moodBtns = moods.map(m=>`
        <button onclick="_dashMoodSec('${m.v}',this)"
          style="flex:1;padding:7px 2px;border-radius:10px;border:2px solid ${today.mood===m.v?'#6c63ff':'var(--border)'};background:${today.mood===m.v?'#6c63ff18':'transparent'};cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;transition:.15s">
          <span style="font-size:1.3rem">${m.e}</span>
        </button>`).join('');

      const doneRow = hasMood ? `<div style="font-size:0.68rem;color:#43b89c;font-weight:700;margin-top:6px;text-align:center">✓ Kaydedildi — <button onclick="showPage('wellness')" style="background:none;border:none;color:var(--accent);font-size:0.68rem;font-weight:700;cursor:pointer;font-family:inherit">Günlüğü aç →</button></div>` : `<button onclick="showPage('wellness')" style="width:100%;margin-top:8px;padding:7px;border:1.5px solid var(--accent)44;border-radius:9px;background:transparent;color:var(--accent);font-size:0.73rem;font-weight:700;cursor:pointer;font-family:inherit">📖 Günlüğü Aç →</button>`;

      return `<div style="background:var(--surface);border-radius:16px;border:2px solid ${hasMood?'#43b89c33':'var(--accent)22'};padding:13px;margin-bottom:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div>
            <div style="font-size:0.88rem;font-weight:800;color:var(--text)">📖 Günlüğüm</div>
            <div style="font-size:0.7rem;color:var(--text2);margin-top:1px">Bugünü hızlıca kaydet</div>
          </div>
          ${streakBadge}
        </div>
        <div style="display:flex;gap:5px">${moodBtns}</div>
        ${doneRow}
      </div>`;
    })()}

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
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Bu Hafta
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
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg> Son Girişlerim</div>
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
    <div class="page-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Günlük Çalışma Girişi</div>
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
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Ders Seç & Çalışma Ekle</div>
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
    <div class="page-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Analizlerim</div>
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
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg> Son 7 Günlük Trend</div>
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
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Ders Bazlı Analiz — ${periodLabel}</div>
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
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Güçlü & Zayıf Derslerim</div>
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
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="1" y1="9" x2="4" y2="9"/></svg> Performans Yorumu</div>
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
  const lgsDate = new Date('2026-06-13T09:30:00+03:00');
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


// ── YARDIM & DESTEK SAYFASI ───────────────────────────────────
function yardimPage() {
  const isTeacher = currentRole === 'teacher';

  const sssOgrenci = [
    { s: 'Şifremi unuttum, ne yapmalıyım?',
      c: 'Giriş ekranındaki <strong>"Şifremi unuttum"</strong> bağlantısına tıkla. E-postana sıfırlama maili gönderilecek. Henüz e-posta eklemediysen önce <strong>Profil → E-posta Adresi</strong> bölümünden ekle.' },
    { s: 'Kullanıcı adımı nasıl değiştirebilirim?',
      c: 'Kullanıcı adın koçun tarafından oluşturulmuştur ve değiştirilemez. Adını değiştirmek için <strong>Profil → Bilgilerimi Düzenle</strong> bölümünü kullan.' },
    { s: 'Günlük çalışmamı nereye gireceğim?',
      c: 'Alt menüdeki <strong>"Günlük Giriş"</strong> sekmesinden çalıştığın ders, konu ve doğru/yanlış sayılarını girebilirsin.' },
    { s: 'Rozet nasıl kazanırım?',
      c: 'Düzenli çalışma girişi yap, günlük hedeflerini tamamla ve wellness takibini düzenli doldur. Rozetler koşullar sağlandığında otomatik kazanılır.' },
    { s: 'Koçuma nasıl mesaj gönderebilirim?',
      c: 'Alt menüdeki <strong>"Mesajlar"</strong> sekmesinden koçunla doğrudan mesajlaşabilirsin.' },
    { s: 'Deneme sınavı sonuçlarımı nereye gireceğim?',
      c: '<strong>"Günlük Giriş"</strong> sayfasında tür olarak <strong>"Deneme Sınavı"</strong> seçerek her ders için doğru/yanlış/boş sayılarını girebilirsin.' },
    { s: 'Uygulama verilerimi başka cihazda görebilir miyim?',
      c: 'Evet! Tüm veriler bulutta güvenli şekilde saklanır. Aynı hesapla farklı telefon veya bilgisayardan giriş yaparak erişebilirsin.' },
    { s: 'Bildirimler çalışmıyor, ne yapmalıyım?',
      c: 'Telefon ayarlarından uygulama bildirimine izin verildiğini kontrol et. Tarayıcı kullanıyorsan site izinlerinde bildirimlere izin ver.' },
  ];

  const sssKoc = [
    { s: 'Öğrenci nasıl eklerim?',
      c: '<strong>Öğrencilerim</strong> sekmesinde sağ üstteki <strong>"+ Öğrenci Ekle"</strong> butonuna tıkla. Kullanıcı adı ve şifre belirleyerek öğrenci hesabı oluşturabilirsin.' },
    { s: 'Öğrencinin şifresini nasıl değiştiririm?',
      c: 'Öğrenci detay sayfasında <strong>"Şifre Değiştir"</strong> seçeneğini kullan. Öğrenci henüz giriş yapmamışsa yeni şifre belirleyebilirsin.' },
    { s: 'Hangi okullar listede görünür?',
      c: '<strong>Profil → Çalıştığım Okullar</strong> bölümünden okullarını yönetebilirsin. Öğrenci eklerken bu listeden seçim yapılır.' },
    { s: 'Psikolojik rapor nasıl oluşturulur?',
      c: 'Öğrenci detay sayfasında <strong>"Psikolojik Rapor"</strong> butonuna tıkla. Öğrencinin wellness verileri analiz edilerek PDF rapor oluşturulur.' },
    { s: 'Öğrenciye ödev nasıl atarım?',
      c: '<strong>Ödevler</strong> sekmesinden yeni ödev oluşturabilir, istediğin öğrenciye atayabilirsin. Öğrenciye otomatik bildirim gider.' },
    { s: 'Öğrenciye mesaj gönderebilir miyim?',
      c: '<strong>Mesajlar</strong> sekmesinden tüm öğrencilerinle birebir mesajlaşabilirsin.' },
    { s: 'Uygulama verilerimi başka cihazda görebilir miyim?',
      c: 'Evet! Tüm veriler Firebase\'de güvenli şekilde saklanır. Aynı hesapla farklı cihazdan giriş yaparak erişebilirsin.' },
    { s: 'Şifremi unuttum, ne yapmalıyım?',
      c: 'Giriş ekranındaki <strong>"Şifremi unuttum"</strong> bağlantısına tıkla. Kayıtlı e-posta adresine sıfırlama maili gönderilecek.' },
  ];

  const sss = isTeacher ? sssKoc : sssOgrenci;

  return `
    <div class="page-title">❓ Yardım &amp; Destek</div>
    <div class="page-sub">Sık sorulan sorular ve iletişim</div>

    <!-- Hızlı eylemler -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;margin-bottom:4px">
      <button onclick="showPage('profile')"
        style="padding:14px 10px;background:var(--surface);border:1px solid var(--border);border-radius:14px;cursor:pointer;font-family:inherit;text-align:center">
        <div style="font-size:1.4rem;margin-bottom:4px">👤</div>
        <div style="font-size:0.78rem;font-weight:700;color:var(--text)">Profilim</div>
        <div style="font-size:0.68rem;color:var(--text2)">${isTeacher ? 'Bilgiler & okullar' : 'E-posta & şifre'}</div>
      </button>
      <button onclick="showPage('messages')"
        style="padding:14px 10px;background:var(--surface);border:1px solid var(--border);border-radius:14px;cursor:pointer;font-family:inherit;text-align:center">
        <div style="font-size:1.4rem;margin-bottom:4px">💬</div>
        <div style="font-size:0.78rem;font-weight:700;color:var(--text)">Mesajlar</div>
        <div style="font-size:0.68rem;color:var(--text2)">${isTeacher ? 'Öğrencilerine yaz' : 'Koçuna yaz'}</div>
      </button>
    </div>

    <!-- SSS -->
    <div class="card" style="margin-top:12px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Sık Sorulan Sorular</div>
      ${sss.map((item, i) => `
        <div style="border-bottom:1px solid var(--border)">
          <div onclick="(function(i){var c=document.getElementById('sssP'+i);var a=document.getElementById('sssA'+i);var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'200px';c.style.opacity=open?'0':'1';a.style.transform=open?'':'rotate(180deg)'})(${i})"
            style="display:flex;align-items:center;justify-content:space-between;padding:13px 0;cursor:pointer;user-select:none;gap:8px">
            <span style="font-size:0.86rem;font-weight:700;flex:1;line-height:1.4">${item.s}</span>
            <span id="sssA${i}" style="color:var(--text2);font-size:0.75rem;flex-shrink:0;transition:transform 0.25s">▼</span>
          </div>
          <div id="sssP${i}" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease,opacity 0.25s;opacity:0">
            <div style="font-size:0.8rem;color:var(--text2);padding-bottom:13px;line-height:1.65">${item.c}</div>
          </div>
        </div>`).join('')}
    </div>

    <!-- İletişim -->
    <div class="card" style="margin-top:16px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Bize Ulaş</div>
      <div style="font-size:0.8rem;color:var(--text2);margin-bottom:14px;line-height:1.6">
        Sorun yaşıyorsan veya öneride bulunmak istiyorsan bize ulaşabilirsin.
      </div>
      <a href="mailto:destek@lgskoc.app"
        style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface2);border-radius:12px;text-decoration:none;margin-bottom:10px;border:1px solid var(--border)">
        <div style="width:40px;height:40px;border-radius:11px;background:var(--accent)18;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0">📧</div>
        <div>
          <div style="font-size:0.88rem;font-weight:700;color:var(--text)">E-posta ile Yaz</div>
          <div style="font-size:0.75rem;color:var(--accent);margin-top:1px">destek@lgskoc.app</div>
        </div>
        <span style="margin-left:auto;color:var(--text2);font-size:0.8rem">›</span>
      </a>
      ${isTeacher ? '' : `<div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface2);border-radius:12px;border:1px solid var(--border);cursor:pointer" onclick="showPage('messages')">
        <div style="width:40px;height:40px;border-radius:11px;background:var(--accent)18;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0">👨‍🏫</div>
        <div>
          <div style="font-size:0.88rem;font-weight:700;color:var(--text)">Koçuna Yaz</div>
          <div style="font-size:0.75rem;color:var(--text2);margin-top:1px">Mesajlar sekmesinden ulaş</div>
        </div>
        <span style="margin-left:auto;color:var(--text2);font-size:0.8rem">›</span>
      </div>`}
    </div>

    <!-- Uygulama bilgisi -->
    <div class="card" style="margin-top:16px;text-align:center;padding:20px">
      <div style="font-size:0.75rem;color:var(--text2);line-height:2">
        <span style="font-weight:800;color:var(--accent);font-size:0.88rem">LGSKoç</span> — Öğrenci Takip Sistemi<br>
        LGS hazırlık sürecinde koçluk &amp; takip için tasarlandı.
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap">
        <button onclick="showPage('profile')"
          style="padding:9px 16px;border-radius:10px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.8rem;font-weight:600;cursor:pointer;font-family:inherit">
          ← Profile Dön
        </button>
        <button onclick="showPage('dashboard')"
          style="padding:9px 16px;border-radius:10px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.8rem;font-weight:600;cursor:pointer;font-family:inherit">
          🏠 Ana Sayfa
        </button>
      </div>
    </div>
  `;
}

// ── ÖĞRENCİ PROGRAM SAYFASI ──────────────────────────────────
const _PRG_DAYS   = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
const _PRG_DAYS_S = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];

function _takBugunIdxOgrenci() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function _prgHaftaKey(offsetWeeks = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetWeeks * 7);
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const weekNo = Math.ceil(((d - jan4) / 86400000 + jan4.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2,'0')}`;
}

function _prgHaftaLabel(offsetWeeks = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetWeeks * 7);
  const day = d.getDay() || 7;
  const mon = new Date(d); mon.setDate(d.getDate() - day + 1);
  const sun = new Date(d); sun.setDate(d.getDate() - day + 7);
  const M = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  return mon.getMonth() === sun.getMonth()
    ? `${mon.getDate()}–${sun.getDate()} ${M[mon.getMonth()]}`
    : `${mon.getDate()} ${M[mon.getMonth()]} – ${sun.getDate()} ${M[sun.getMonth()]}`;
}

window._prgState = { weekOffset: 0, view: 'hafta', selectedDay: _takBugunIdxOgrenci(), etkinlikler: {}, monthOffset: 0 };

async function programiPage() {
  const uid = auth.currentUser?.uid;
  if (!uid) return '<div style="padding:40px;text-align:center;color:var(--text2)">Oturum bulunamadı.</div>';

  // Koachın uid'sini bul
  const userData = window.currentUserData || {};
  const koachUid = userData.koachUid || null;

  try {
    let q = db.collection('takvimler');
    if (koachUid) q = q.where('koachUid', '==', koachUid);
    else q = q.where('koachUid', '==', '__none__');

    const snap = await q.get();
    window._prgState.etkinlikler = {};
    snap.forEach(d => {
      const ev = { id: d.id, ...d.data() };
      const key = `${ev.hafta}_${ev.gun}`;
      if (!window._prgState.etkinlikler[key]) window._prgState.etkinlikler[key] = [];
      window._prgState.etkinlikler[key].push(ev);
    });
  } catch(e) { console.warn('Program yüklenemedi:', e.message); }

  return _prgRenderPage();
}

function _prgRenderPage() {
  const { view, weekOffset, monthOffset, selectedDay, etkinlikler } = window._prgState;
  const bugunIdx = _takBugunIdxOgrenci();
  const hafta = _prgHaftaKey(weekOffset);

  // Bugünün etkinlikleri
  const bugunKey = `${_prgHaftaKey(0)}_${bugunIdx}`;
  const bugunEvleri = (etkinlikler[bugunKey] || []).sort((a,b) => (a.saat||'').localeCompare(b.saat||''));

  const now = new Date();
  const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const DAYS_TR = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];

  return `
    <div class="page-title" style="display:flex;align-items:center;gap:8px">
      <svg style="vertical-align:middle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      Programım
    </div>
    <div class="page-sub">Koçunun hazırladığı çalışma programı</div>

    ${weekOffset === 0 && bugunEvleri.length ? `
    <!-- Bugün kartı -->
    <div style="background:linear-gradient(135deg,#6c63ff,#4cc9f0);border-radius:18px;padding:16px;margin:14px 0 12px">
      <div style="font-size:0.65rem;color:rgba(255,255,255,0.8);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">Bugün</div>
      <div style="font-size:1rem;font-weight:800;color:#fff;margin-bottom:12px">${DAYS_TR[now.getDay()]}, ${now.getDate()} ${MONTHS_TR[now.getMonth()]}</div>
      ${bugunEvleri.map((ev,i) => `
        <div onclick="_prgToggleDone(this,'${ev.id}',${i})"
          style="background:rgba(255,255,255,0.18);border-radius:11px;padding:9px 11px;margin-bottom:6px;display:flex;align-items:center;gap:10px;cursor:pointer">
          <div style="width:8px;height:8px;border-radius:50%;background:#fff;flex-shrink:0"></div>
          <div style="flex:1">
            <div style="font-size:0.85rem;font-weight:800;color:#fff">${ev.baslik}</div>
            ${ev.saat ? `<div style="font-size:0.7rem;color:rgba(255,255,255,0.75)">${ev.saat}</div>` : ''}
          </div>
          <div id="prgChk_${ev.id}" style="width:22px;height:22px;border-radius:7px;border:1.5px solid rgba(255,255,255,0.5);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="transparent" stroke-width="2.2" stroke-linecap="round"><polyline points="2 6 5 9 10 3"/></svg>
          </div>
        </div>`).join('')}
    </div>` : ''}

    <!-- Tabs -->
    <div style="display:flex;background:var(--surface2);border-radius:12px;padding:3px;margin-bottom:12px">
      <button onclick="_prgSwitchView('hafta')" style="flex:1;padding:7px;border-radius:9px;border:none;cursor:pointer;font-size:0.8rem;font-weight:700;font-family:inherit;${view==='hafta'?'background:var(--accent);color:#fff':'background:transparent;color:var(--text2)'}">Haftalık</button>
      <button onclick="_prgSwitchView('ay')" style="flex:1;padding:7px;border-radius:9px;border:none;cursor:pointer;font-size:0.8rem;font-weight:700;font-family:inherit;${view==='ay'?'background:var(--accent);color:#fff':'background:transparent;color:var(--text2)'}">Aylık</button>
    </div>

    ${view === 'hafta' ? _prgHaftalikHTML() : _prgAylikHTML()}
  `;
}

function _prgHaftalikHTML() {
  const { weekOffset, etkinlikler, selectedDay } = window._prgState;
  const hafta = _prgHaftaKey(weekOffset);
  const bugunIdx = _takBugunIdxOgrenci();

  // Yatay gün seritsi
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const monday = new Date(now); monday.setDate(now.getDate() - dayOfWeek + weekOffset * 7);

  const dayStrip = _PRG_DAYS_S.map((d, i) => {
    const date = new Date(monday); date.setDate(monday.getDate() + i);
    const key = `${hafta}_${i}`;
    const hasEv = (etkinlikler[key] || []).length > 0;
    const isToday = weekOffset === 0 && i === bugunIdx;
    const isSel = i === selectedDay;
    return `
      <div onclick="_prgSelectDay(${i})"
        style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 8px;border-radius:12px;cursor:pointer;flex-shrink:0;border:1.5px solid ${isSel?'var(--accent)':isToday?'var(--accent)44':'var(--border)'};background:${isSel?'var(--accent)':isToday?'var(--accent)08':'var(--surface)'}">
        <span style="font-size:0.6rem;font-weight:700;color:${isSel?'rgba(255,255,255,0.8)':'var(--text2)'}">${d}</span>
        <span style="font-size:0.88rem;font-weight:800;color:${isSel?'#fff':isToday?'var(--accent)':'var(--text)'}">${date.getDate()}</span>
        ${hasEv ? `<span style="width:5px;height:5px;border-radius:50%;background:${isSel?'rgba(255,255,255,0.7)':'var(--accent)'}"></span>` : '<span style="width:5px;height:5px"></span>'}
      </div>`;
  }).join('');

  // Seçili günün etkinlikleri
  const selKey = `${hafta}_${selectedDay}`;
  const selEvs = (etkinlikler[selKey] || []).sort((a,b) => (a.saat||'').localeCompare(b.saat||''));
  const evListHtml = selEvs.length ? selEvs.map(ev => `
    <div style="display:flex;align-items:center;gap:10px;background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:10px 12px;margin-bottom:7px">
      <div style="width:4px;border-radius:99px;align-self:stretch;background:${ev.renk};flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.85rem;font-weight:800;color:var(--text)">${ev.baslik}</div>
        ${ev.saat ? `<div style="font-size:0.7rem;color:var(--text2);margin-top:1px">${ev.saat}</div>` : ''}
        ${ev.not  ? `<div style="font-size:0.72rem;color:var(--text2);font-style:italic;margin-top:2px">${ev.not}</div>` : ''}
      </div>
      <div style="font-size:0.68rem;background:${ev.renk}18;color:${ev.renk};border-radius:99px;padding:3px 9px;font-weight:700;flex-shrink:0">${ev.saat||'—'}</div>
    </div>`) .join('')
    : `<div style="text-align:center;padding:24px 0;color:var(--text2);font-size:0.82rem;font-weight:700">Bu gün için etkinlik yok</div>`;

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <button onclick="_prgWeekNav(-1)" style="width:30px;height:30px;border-radius:9px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center">‹</button>
      <span style="font-size:0.8rem;font-weight:700;color:var(--text)">${_prgHaftaLabel(weekOffset)}</span>
      <button onclick="_prgWeekNav(1)" style="width:30px;height:30px;border-radius:9px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center">›</button>
    </div>

    <div style="display:flex;gap:5px;margin-bottom:14px;overflow-x:auto;padding-bottom:4px">${dayStrip}</div>

    <div id="prgEvList">${evListHtml}</div>
  `;
}

function _prgAylikHTML() {
  const { monthOffset, etkinlikler } = window._prgState;
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = target.getFullYear(), month = target.getMonth();
  const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevDays = new Date(year, month, 0).getDate();

  let cells = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    cells += `<div style="min-height:36px;padding:3px;border-right:1px solid #f5f6fa;border-bottom:1px solid #f5f6fa"><span style="font-size:0.68rem;color:var(--border)">${prevDays - i}</span></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
    const dayOfWeek = (new Date(year, month, d).getDay() + 6) % 7;
    const dots = Object.entries(etkinlikler).filter(([k]) => k.endsWith(`_${dayOfWeek}`)).flatMap(([,evs]) => evs.slice(0,2)).slice(0,3)
      .map(ev => `<span style="width:4px;height:4px;border-radius:50%;display:inline-block;background:${ev.renk};margin:1px"></span>`).join('');
    cells += `<div style="min-height:36px;padding:3px;border-right:1px solid #f5f6fa;border-bottom:1px solid #f5f6fa;display:flex;flex-direction:column;align-items:center">
      <span style="font-size:0.68rem;font-weight:700;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:50%;${isToday?'background:var(--accent);color:#fff':'color:var(--text)'}">${d}</span>
      <div style="display:flex;flex-wrap:wrap;justify-content:center">${dots}</div>
    </div>`;
  }

  return `
    <div style="background:var(--surface);border-radius:14px;border:1px solid var(--border);overflow:hidden;margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border)">
        <button onclick="_prgMonthNav(-1)" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);cursor:pointer">‹</button>
        <span style="font-size:0.9rem;font-weight:800">${MONTHS_TR[month]} ${year}</span>
        <button onclick="_prgMonthNav(1)" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);cursor:pointer">›</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--border)">
        ${['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map((d,i) => `<div style="padding:6px 0;text-align:center;font-size:0.6rem;font-weight:800;color:${i>=5?'#ff6584':'var(--text2)'}">${d}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr)">${cells}</div>
    </div>
    <div style="background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:12px">
      <div style="font-size:0.78rem;color:var(--text2)">Koçunun haftalık programı her gün için tekrarlanır. Takvimde renkli noktalar olan günlere etkinlik atandı.</div>
    </div>
    <div style="margin-bottom:16px"></div>
  `;
}

// Öğrenci state fonksiyonları
function _prgSelectDay(i) {
  window._prgState.selectedDay = i;
  document.getElementById('mainContent').innerHTML = _prgRenderPage();
}
function _prgSwitchView(v) { window._prgState.view = v; document.getElementById('mainContent').innerHTML = _prgRenderPage(); }
function _prgWeekNav(dir) { window._prgState.weekOffset += dir; window._prgState.selectedDay = _takBugunIdxOgrenci(); document.getElementById('mainContent').innerHTML = _prgRenderPage(); }
function _prgMonthNav(dir) { window._prgState.monthOffset += dir; document.getElementById('mainContent').innerHTML = _prgRenderPage(); }

// Bugün kartındaki etkinliği tamamla/tamamlamayı geri al
function _prgToggleDone(row, evId, idx) {
  const chk = document.getElementById('prgChk_' + evId);
  if (!chk) return;
  const svg = chk.querySelector('svg');
  const done = svg.getAttribute('stroke') === 'transparent';
  svg.setAttribute('stroke', done ? '#6c63ff' : 'transparent');
  chk.style.background = done ? 'rgba(255,255,255,0.9)' : 'transparent';
  chk.style.borderColor = done ? 'transparent' : 'rgba(255,255,255,0.5)';
}

function _dashMoodSec(moodValue, btn) {
  // localStorage'a kaydet
  const myUid = (window.currentUserData||{}).uid || 'local';
  const storageKey = 'wellness_' + myUid;
  let data = {};
  try { data = JSON.parse(localStorage.getItem(storageKey)||'{}'); } catch(e){}
  const todayKey = getTodayKey();
  if (!data.days) data.days = {};
  if (!data.days[todayKey]) data.days[todayKey] = {};
  data.days[todayKey].mood = moodValue;
  try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch(e){}

  // UI güncelle
  btn.closest('div[style*="gap:5px"]').querySelectorAll('button').forEach(b => {
    b.style.border = '2px solid var(--border)';
    b.style.background = 'transparent';
  });
  btn.style.border = '2px solid #6c63ff';
  btn.style.background = '#6c63ff18';

  // Alt satırı güncelle
  const wrap = btn.closest('div[style*="border-radius:16px"]');
  const doneRow = wrap.querySelector('div[style*="68rem;color:#43b89c"], button[onclick*="wellness"]')?.parentElement || wrap.lastElementChild;
  const newDone = document.createElement('div');
  newDone.style.cssText = 'font-size:0.68rem;color:#43b89c;font-weight:700;margin-top:6px;text-align:center';
  newDone.innerHTML = `✓ Kaydedildi — <button onclick="showPage('wellness')" style="background:none;border:none;color:var(--accent);font-size:0.68rem;font-weight:700;cursor:pointer;font-family:inherit">Günlüğü aç →</button>`;
  // eski replace
  const old = wrap.querySelector('div[style*="color:#43b89c"], button[onclick*="showPage(\'wellness\')"]');
  if (old && old.parentElement === wrap) old.replaceWith(newDone);
  else wrap.appendChild(newDone);

  // Border güncelle
  wrap.style.borderColor = '#43b89c33';
}


