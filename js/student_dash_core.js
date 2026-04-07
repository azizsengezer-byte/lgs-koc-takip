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

      return `<div class="wellness-banner-wrap">
        <div class="wellness-banner-inner" style="flex-direction:column;align-items:stretch;gap:0;padding:12px 14px">
          <div onclick="showPage('wellness')" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;cursor:pointer">
            <div>
              <div style="font-size:0.88rem;font-weight:800;color:var(--text)"><span class="wellness-journal-icon">📖</span> Günlüğüm</div>
              <div style="font-size:0.7rem;color:var(--text2);margin-top:1px">Bugünü hızlıca kaydet</div>
            </div>
            ${streakBadge}
          </div>
          <div style="display:flex;gap:5px">${moodBtns}</div>
          <div onclick="showPage('wellness')" style="cursor:pointer;margin-top:2px">
            ${hasMood
              ? `<div style="font-size:0.68rem;color:#43b89c;font-weight:700;margin-top:6px;text-align:center">✓ Kaydedildi — <span style="color:var(--accent)">Günlüğü aç →</span></div>`
              : `<div style="width:100%;margin-top:8px;padding:7px;border:1.5px solid var(--accent)44;border-radius:9px;text-align:center;color:var(--accent);font-size:0.73rem;font-weight:700">📖 Günlüğü Aç →</div>`
            }
          </div>
        </div>
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


