function openProfileDrawer() {
  const drawer  = document.getElementById('profileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const ud = window.currentUserData || {};

  // İsim & rol
  const nameEl = document.getElementById('menuName');
  const roleEl = document.getElementById('menuRole');
  if (nameEl) nameEl.textContent = ud.name || '—';
  if (roleEl) roleEl.textContent = ud.role === 'teacher' ? 'Koç Öğretmen' : '8. Sınıf Öğrencisi';

  // Drawer avatar
  const da = document.getElementById('drawerAvatar');
  if (da) {
    if (ud.photo) {
      da.innerHTML = `<img src="${ud.photo}" style="width:52px;height:52px;border-radius:50%;object-fit:cover">`;
      da.style.background = 'transparent';
    } else {
      da.textContent = (ud.name || '?')[0].toUpperCase();
      da.style.background = 'linear-gradient(135deg,#6c63ff,#4cc9f0)';
    }
  }

  // Plan banner — sadece öğretmene
  const banner = document.getElementById('drawerPlanBanner');
  if (banner) banner.style.display = ud.role === 'teacher' ? 'block' : 'none';

  // Aç
  if (overlay) { overlay.style.display = 'block'; requestAnimationFrame(() => overlay.style.background = 'rgba(0,0,0,0.45)'); }
  if (drawer)  requestAnimationFrame(() => drawer.style.right = '0');
}

function closeProfileDrawer() {
  const drawer  = document.getElementById('profileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer)  drawer.style.right = '-224px';
  if (overlay) {
    overlay.style.background = 'rgba(0,0,0,0)';
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
  }
}

// Eski isimler — geriye dönük uyumluluk
function toggleProfileMenu() { openProfileDrawer(); }
function closeProfileMenu()   { closeProfileDrawer(); }

function doLogout() {
  auth.signOut();
}

function lgsCountdownWidget() {
  return `<div id="lgsCountdownCard" class="card" style="margin-bottom:16px;text-align:center;padding:20px 16px"></div>`;
}

// Canlı geri sayım — setInterval ile her saniye günceller
let _countdownTimer = null;
function startCountdown() {
  if (_countdownTimer) clearInterval(_countdownTimer);
  function update() {
    const card = document.getElementById('lgsCountdownCard');
    if (!card) { clearInterval(_countdownTimer); _countdownTimer = null; return; }
    const lgs = new Date(window.LGS_TARIHI || '2026-06-13T09:30:00+03:00');
    const now = new Date();
    const diff = lgs - now;
    if (diff <= 0) {
      card.innerHTML = `<div style="font-size:1.5rem">🎉</div><div style="font-weight:800;color:var(--accent3);font-size:1.1rem">LGS Sınavı Gerçekleşti!</div>`;
      card.style.background = 'linear-gradient(135deg,#43e97b22,#38f9d722)';
      card.style.border = '1px solid #43e97b44';
      clearInterval(_countdownTimer); _countdownTimer = null;
      return;
    }
    const days  = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const mins  = Math.floor((diff % (1000*60*60)) / (1000*60));
    const secs  = Math.floor((diff % (1000*60)) / 1000);
    const urgColor = days < 30 ? '#ff6584' : days < 60 ? '#f9ca24' : '#6c63ff';
    card.style.background = `linear-gradient(135deg,${urgColor}18,${urgColor}08)`;
    card.style.border = `1px solid ${urgColor}44`;
    card.innerHTML = `
      <div style="font-size:0.75rem;color:var(--text2);font-weight:700;letter-spacing:1px;margin-bottom:10px">📅 LGS SINAVI GERİ SAYIM</div>
      <div style="display:flex;justify-content:center;gap:8px">
        <div style="background:${urgColor}22;border-radius:12px;padding:10px 10px;min-width:52px">
          <div style="font-size:1.8rem;font-weight:900;color:${urgColor};line-height:1">${days}</div>
          <div style="font-size:0.62rem;color:var(--text2);margin-top:4px">GÜN</div>
        </div>
        <div style="background:${urgColor}22;border-radius:12px;padding:10px 10px;min-width:46px">
          <div style="font-size:1.8rem;font-weight:900;color:${urgColor};line-height:1">${String(hours).padStart(2,'0')}</div>
          <div style="font-size:0.62rem;color:var(--text2);margin-top:4px">SAAT</div>
        </div>
        <div style="background:${urgColor}22;border-radius:12px;padding:10px 10px;min-width:46px">
          <div style="font-size:1.8rem;font-weight:900;color:${urgColor};line-height:1">${String(mins).padStart(2,'0')}</div>
          <div style="font-size:0.62rem;color:var(--text2);margin-top:4px">DAKİKA</div>
        </div>
        <div style="background:${urgColor}33;border-radius:12px;padding:10px 10px;min-width:46px;border:1px solid ${urgColor}44">
          <div style="font-size:1.8rem;font-weight:900;color:${urgColor};line-height:1" id="lgsSecEl">${String(secs).padStart(2,'0')}</div>
          <div style="font-size:0.62rem;color:var(--text2);margin-top:4px">SANİYE</div>
        </div>
      </div>
      <div style="font-size:0.75rem;color:var(--text2);margin-top:10px">${window.LGS_SINAV_ADI||'LGS'} • ${new Date(window.LGS_TARIHI||'2026-06-13T09:30:00+03:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})} • Saat 09:30</div>`;
  }
  update();
  _countdownTimer = setInterval(update, 1000);
}

function renderSidebar() {
  const sb = document.getElementById('sidebar');
  const _s = (p,extra='') => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${p}</svg>`;
  const ICONS = {
    grid:    _s('<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>'),
    users:   _s('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    trend:   _s('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'),
    check:   _s('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
    msg:     _s('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
    bell:    _s('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
    home:    _s('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
    pencil:  _s('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'),
    target:  _s('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
    heart:   _s('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'),
    pie:     _s('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>'),
  };
  const teacherNav = [
    { id:'dashboard',     icon:ICONS.grid,   label:'Ana Panel' },
    { id:'students',      icon:ICONS.users,  label:'Öğrencilerim' },
    { id:'analysis',      icon:ICONS.trend,  label:'Analizler' },
    { id:'tasks-teacher', icon:ICONS.check,  label:'Görevler' },
    { id:'takvim',        icon:ICONS.cal,    label:'Takvim' },
    { id:'notifs',        icon:ICONS.bell,   label:'Bildirimler' },
  ];
  const studentNav = [
    { id:'dashboard',    icon:ICONS.home,   label:'Ana Sayfa' },
    { id:'daily-entry',  icon:ICONS.pencil, label:'Günlük Giriş' },
    { id:'my-analysis',  icon:ICONS.trend,  label:'Analizlerim' },
    { id:'kazanimlar',   icon:ICONS.target, label:'Kazanımlarım' },
    { id:'my-tasks',     icon:ICONS.check,  label:'Ödevlerim' },
    { id:'wellness',     icon:ICONS.heart,  label:'Nasıl Hissediyorum' },
    { id:'lgs-dagilim',  icon:ICONS.pie,    label:'LGS Soru Dağılımı' },
    { id:'messages',     icon:ICONS.msg,    label:'Koçumla Mesaj' },
    { id:'notifs',       icon:ICONS.bell,   label:'Bildirimler' },
  ];
  const nav = currentRole==='teacher' ? teacherNav : studentNav;
  sb.innerHTML = nav.map(n => `
    <button class="nav-item ${currentPage===n.id?'active':''}" onclick="showPage('${n.id}')">
      <span class="nav-icon">${n.icon}</span>${n.label}
    </button>
  `).join('');
  renderMobileNav();
}

function filterStudentList(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('#studentListCard .student-card-item');
  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    card.style.display = (!q || name.includes(q)) ? '' : 'none';
  });
}

function updateTeacherDatePicker() {
  const type = document.getElementById('pdfPeriodType')?.value;
  const sel = document.getElementById('pdfDateRange');
  if (!sel) return;
  if (type === 'weekly') {
    sel.innerHTML = generateWeekOptions();
    sel.style.display = '';
  } else if (type === 'monthly') {
    sel.innerHTML = generateMonthOptions();
    sel.style.display = '';
  } else {
    sel.style.display = 'none';
  }
}

function toggleNotifsPage() {
  if (currentPage === 'notifs') {
    // Zaten açıksa önceki sayfaya dön
    const prev = _prevPage || 'dashboard';
    showPage(prev);
  } else {
    _prevPage = currentPage;
    showPage('notifs');
  }
}
let _prevPage = 'dashboard';

function showPage(id) {
  currentPage = id;
  if (id === 'messages') { clearAllMessageNotifs(); }
  if (_countdownTimer) { clearInterval(_countdownTimer); _countdownTimer = null; }
  // URL'e sayfa + öğrenci adını kaydet (yenileme için)
  const params = new URLSearchParams();
  params.set('p', id);
  if ((id==='psych-report'||id==='student-detail') && selectedStudentName) {
    params.set('s', encodeURIComponent(selectedStudentName));
  }
  history.pushState({ page: id }, '', window.location.pathname + '?' + params.toString());
  renderSidebar();
  const content = document.getElementById('mainContent');
  if(currentRole==='teacher') renderTeacherPage(id, content);
  else renderStudentPage(id, content);
  window.scrollTo(0,0);
  if (id === 'dashboard') {
    requestAnimationFrame(()=>requestAnimationFrame(startCountdown));
  }
}

// Telefon/tarayıcı geri tuşunu yakala
window.addEventListener('popstate', (e) => {
  // Açık modal varsa önce onu kapat, sayfa geçişi yapma
  if (window._modalStack && window._modalStack.length > 0) {
    _closeTopModal();
    return;
  }

  if (e.state && e.state.page && currentPage) {
    const id = e.state.page;
    currentPage = id;
    if (_countdownTimer) { clearInterval(_countdownTimer); _countdownTimer = null; }
    renderSidebar();
    const content = document.getElementById('mainContent');
    if(currentRole==='teacher') renderTeacherPage(id, content);
    else renderStudentPage(id, content);
    window.scrollTo(0,0);
    if (id === 'dashboard') requestAnimationFrame(()=>requestAnimationFrame(startCountdown));
  }
});

// Mesajlar sayfası açıldığında Firestore'daki tüm message bildirimlerini temizle
async function clearAllMessageNotifs() {
  const myUid = (window.currentUserData||{}).uid || '';
  if (!myUid) return;
  try {
    const snap = await db.collection('notifications')
      .where('toUid','==',myUid)
      .where('type','==','message')
      .where('read','==',false)
      .get();
    if (snap.empty) return;
    const batch = db.batch();
    snap.forEach(d => batch.update(d.ref, {read:true}));
    await batch.commit();
    // Local güncelle
    const notifs = currentRole==='teacher' ? teacherNotifs : studentNotifs;
    notifs.forEach(n => { if(n.type==='message') n.read = true; });
    updateNotifBadge();
  } catch(e) {}
}

/* =================== TEACHER PAGES =================== */
function renderTeacherPage(id, el) {
  if(id==='dashboard') el.innerHTML = teacherDashboard();
  else if(id==='students') el.innerHTML = teacherStudents();
  else if(id==='student-detail') el.innerHTML = studentDetailAnalysis();
  else if(id==='psych-report') {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">💙 Yükleniyor...</div>';
    psychReportPage().then(html => { el.innerHTML = html; });
  }
  else if(id==='analysis') el.innerHTML = teacherAnalysis();
  else if(id==='tasks-teacher') el.innerHTML = teacherTasks();
  else if(id==='messages') {
    // activeChat null ise liste göster (mobilde seçim yapılmamış)
    messagesPage('teacher').then(html => { el.innerHTML = html; });
  }
  else if(id==='notifs') { el.innerHTML = notificationsPage(); updateNotifBadge(); }
  else if(id==='yardim') { el.innerHTML = yardimPage(); }
  else if(id==='satin-al') { el.innerHTML = satinAlPage(); }
  else if(id==='takvim') { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">📅 Yükleniyor...</div>'; takvimiPage().then(html => { el.innerHTML = html; }); }
  else if(id==='profile') { profilePage().then(html => { el.innerHTML = html; setTimeout(initApiSettings, 50); if(currentRole==='student') { setTimeout(okulArkadaslariniYukle, 200); setTimeout(odulleriniYukle, 500); } }); }
  setTimeout(()=>drawCharts(), 50);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

function showToast(icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.querySelector('.toast-icon').textContent = icon;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3000);
}

/* =================== CHARTS =================== */
function drawCharts() {
  const now = new Date();
  const todayKey = getDateKey(now);

  // Son 7 günlük veri
  const last7 = [];
  for (let i=6;i>=0;i--) {
    const d = new Date(now); d.setDate(now.getDate()-i);
    const dk = d.toISOString().split('T')[0];
    last7.push(studyEntries.filter(e=>e.dateKey===dk).reduce((a,e)=>a+(e.questions||0),0));
  }

  // Week chart - gerçek soru sayısı
  const wc = document.getElementById('weekChart');
  if(wc) {
    wc._drawn = false; // her seferinde yenile
    wc._drawn = true;
    const ctx = wc.getContext('2d');
    drawLineChart(ctx, wc.width, 100, last7.length ? last7 : [0,0,0,0,0,0,0], '#6c63ff');
  }

  // Haftalık öğrenci özet tablosu
  const wTable = document.getElementById('weeklyStudentTable');
  if(wTable && students.length > 0) {
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate()-7);
    const weekKey = weekAgo.toISOString().split('T')[0];
    const todayK = getDateKey(now);
    wTable.innerHTML = students.map((s,i) => {
      const se = studyEntries.filter(e=>e.studentName===s.name && e.dateKey>=weekKey);
      const soru = se.reduce((a,e)=>a+(e.questions||0),0);
      const sure = se.reduce((a,e)=>a+(e.duration||0),0);
      const netT = se.reduce((a,e)=>a+(e.net||0),0);
      const gun  = new Set(se.map(e=>e.dateKey)).size;
      const netOrt = soru>0 ? (netT/gun).toFixed(1) : '—';
      const isToday = se.some(e=>e.dateKey===todayK);
      const bgRow = i%2===0?'background:var(--surface2)':'';
      return `<tr style="${bgRow};cursor:pointer" onclick="openStudentAnalysis('${s.name}')">
        <td style="padding:9px 6px;font-weight:700">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:26px;height:26px;border-radius:50%;background:${s.color}22;color:${s.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.8rem">${s.name[0]}</div>
            <span style="font-size:0.82rem">${s.name.split(' ')[0]}</span>
          </div>
        </td>
        <td style="text-align:center;padding:9px 6px;font-weight:700;color:var(--accent4)">${gun}</td>
        <td style="text-align:center;padding:9px 6px;font-weight:700;color:var(--accent)">${soru}</td>
        <td style="text-align:center;padding:9px 6px;color:var(--text2)">${sure}dk</td>
        <td style="text-align:center;padding:9px 6px;font-weight:800;color:var(--accent3)">${netOrt}</td>
        <td style="text-align:center;padding:9px 6px">${isToday?'<span style="font-size:1rem">✅</span>':'<span style="font-size:1rem">⬜</span>'}</td>
      </tr>`;
    }).join('');
  }

  // Ders bazlı soru dağılım barları (analiz sayfası)
  const subDistEl = document.getElementById('subjectDistBars');
  if(subDistEl) {
    const weekAgo2 = new Date(now); weekAgo2.setDate(now.getDate()-7);
    const weekKey2 = weekAgo2.toISOString().split('T')[0];
    const subTotals = subjects.map(s=>{
      const q = studyEntries.filter(e=>e.dateKey>=weekKey2&&e.subject===s.name).reduce((a,e)=>a+(e.questions||0),0);
      return {...s, q};
    }).filter(s=>s.q>0);
    const maxQ = Math.max(...subTotals.map(s=>s.q),1);
    if(subTotals.length>0) {
      subDistEl.innerHTML = subTotals.map(s=>`
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <div style="font-size:0.78rem;min-width:90px;color:var(--${s.cls})">${s.icon} ${s.name}</div>
          <div style="flex:1;height:10px;background:var(--border);border-radius:5px;overflow:hidden">
            <div style="height:100%;width:${Math.round(s.q/maxQ*100)}%;background:var(--${s.cls});border-radius:5px;transition:.4s"></div>
          </div>
          <div style="font-size:0.78rem;font-weight:800;min-width:28px;text-align:right;color:var(--${s.cls})">${s.q}</div>
        </div>`).join('');
    } else {
      subDistEl.innerHTML = '<div style="color:var(--text2);font-size:0.82rem;text-align:center;padding:12px">Bu hafta çalışma verisi yok</div>';
    }
  }

  // Trend chart (analysis page) - son 7 gün
  const tc = document.getElementById('trendChart');
  if(tc) {
    tc._drawn = true;
    const ctx = tc.getContext('2d');
    drawLineChart(ctx, tc.width, 180, last7, '#43e97b');
  }

  // Student trend chart
  const st = document.getElementById('studentTrend');
  if(st) {
    st._drawn = true;
    const ctx = st.getContext('2d');
    drawLineChart(ctx, st.width, 200, last7, '#6c63ff');
  }
}

function drawLineChart(ctx, w, h, data, color) {
  const c = ctx.canvas; c.width = c.offsetWidth || 400;
  const cw = c.width, ch = h;
  ctx.clearRect(0,0,cw,ch);
  const max = Math.max(...data), min = 0;
  const pad = 20;
  const xStep = (cw-pad*2)/(data.length-1);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for(let i=0;i<4;i++) {
    const y = pad + (ch-pad*2)*i/3;
    ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(cw-pad,y); ctx.stroke();
  }

  // Fill
  const gradient = ctx.createLinearGradient(0,0,0,ch);
  gradient.addColorStop(0, color+'44');
  gradient.addColorStop(1, color+'00');
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x = pad+i*xStep, y = ch-pad-(v/max)*(ch-pad*2);
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.lineTo(pad+(data.length-1)*xStep, ch-pad);
  ctx.lineTo(pad, ch-pad);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = color; ctx.lineWidth = 2.5;
  data.forEach((v,i)=>{
    const x = pad+i*xStep, y = ch-pad-(v/max)*(ch-pad*2);
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.stroke();

  // Dots
  data.forEach((v,i)=>{
    if(v===0) return;
    const x = pad+i*xStep, y = ch-pad-(v/max)*(ch-pad*2);
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle = color; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2);
    ctx.fillStyle = '#fff'; ctx.fill();
  });

  // Labels
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Nunito'; ctx.textAlign='center';
  ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].forEach((d,i)=>{
    ctx.fillText(d, pad+i*xStep, ch-4);
  });
}

function drawBarChart(ctx, w, h, labels, data) {
  const c = ctx.canvas; c.width = c.offsetWidth || 400;
  const cw = c.width, ch = h;
  ctx.clearRect(0,0,cw,ch);
  const max = 100;
  const barColors = ['#6c63ff','#ff6584','#43e97b','#f9ca24'];
  const pad = 30, barW = (cw-pad*2)/data.length*0.5;
  const xStep = (cw-pad*2)/data.length;

  data.forEach((v,i)=>{
    const x = pad+i*xStep+xStep*0.25;
    const barH = (v/max)*(ch-pad*2);
    const y = ch-pad-barH;
    const r = ctx.createLinearGradient(0,y,0,ch-pad);
    r.addColorStop(0,barColors[i]); r.addColorStop(1,barColors[i]+'66');
    ctx.fillStyle = r;
    ctx.beginPath();
    ctx.roundRect(x,y,barW,barH,6);
    ctx.fill();
    ctx.fillStyle = barColors[i]; ctx.font='bold 12px Nunito'; ctx.textAlign='center';
    ctx.fillText(v, x+barW/2, y-6);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font='10px Nunito';
    ctx.fillText(labels[i], x+barW/2, ch-10);
  });
}

window.addEventListener('resize', ()=>{ document.querySelectorAll('canvas').forEach(c=>c._drawn=false); drawCharts(); });
