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

window._prgState = { weekOffset: 0, etkinlikler: {} };

async function programiPage() {
  const uid = auth.currentUser?.uid;
  if (!uid) return '<div style="padding:40px;text-align:center;color:var(--text2)">Oturum bulunamadı.</div>';

  const userData = window.currentUserData || {};
  const teacherId = userData.teacherId || userData.koachUid || null;

  try {
    let q = db.collection('takvimler');
    if (teacherId) q = q.where('koachUid', '==', teacherId);
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
  const { weekOffset, etkinlikler } = window._prgState;
  const hafta    = _prgHaftaKey(weekOffset);
  const bugunIdx = _takBugunIdxOgrenci();
  const now      = new Date();
  const MONTHS   = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const DAYS_TR  = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];

  const dayOfWeek = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + weekOffset * 7);

  const bugunKey    = `${_prgHaftaKey(0)}_${bugunIdx}`;
  const bugunEvleri = (etkinlikler[bugunKey] || []).sort((a,b)=>(a.saat||'').localeCompare(b.saat||''));

  const bugunHero = weekOffset === 0 ? `
    <div style="background:linear-gradient(135deg,#6c63ff,#4cc9f0);border-radius:18px;padding:16px;margin-bottom:12px">
      <div style="font-size:0.62rem;color:rgba(255,255,255,0.75);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px">Bugün</div>
      <div style="font-size:0.95rem;font-weight:800;color:#fff;margin-bottom:${bugunEvleri.length?'10px':'0'}">${DAYS_TR[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}</div>
      ${bugunEvleri.length
        ? bugunEvleri.map(ev=>`
          <div style="background:rgba(255,255,255,0.15);border-radius:10px;padding:8px 10px;margin-bottom:5px;display:flex;align-items:flex-start;gap:8px">
            <div style="width:7px;height:7px;border-radius:50%;background:#fff;margin-top:5px;flex-shrink:0"></div>
            <div>
              <div style="font-size:0.83rem;font-weight:800;color:#fff">${ev.baslik}</div>
              <div style="font-size:0.68rem;color:rgba(255,255,255,0.75);margin-top:1px">${ev.saat?'🕐 '+ev.saat:''}${ev.ders?' · '+ev.ders:''}</div>
            </div>
          </div>`).join('')
        : '<div style="font-size:0.78rem;color:rgba(255,255,255,0.65);margin-top:4px">Bugün için etkinlik yok</div>'}
    </div>` : '';

  const nav = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <button onclick="_prgWeekNav(-1)" style="width:30px;height:30px;border-radius:9px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:1rem;color:var(--text)">‹</button>
      <span style="font-size:0.8rem;font-weight:700;color:var(--text)">${_prgHaftaLabel(weekOffset)}</span>
      <button onclick="_prgWeekNav(1)" style="width:30px;height:30px;border-radius:9px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:1rem;color:var(--text)">›</button>
    </div>`;

  const gunlerHtml = _PRG_DAYS.map((gun, i) => {
    const dateOfDay = new Date(monday);
    dateOfDay.setDate(monday.getDate() + i);
    const key    = `${hafta}_${i}`;
    const evs    = (etkinlikler[key] || []).sort((a,b)=>(a.saat||'').localeCompare(b.saat||''));
    const isToday = weekOffset === 0 && i === bugunIdx;
    const isPast  = weekOffset === 0 && i < bugunIdx;

    const evHtml = evs.length
      ? evs.map(ev=>`
        <div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;border-radius:10px;background:${ev.renk}08;margin-bottom:4px;border:1px solid ${ev.renk}18">
          <div style="width:3px;border-radius:99px;align-self:stretch;background:${ev.renk};flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.83rem;font-weight:800;color:var(--text)">${ev.baslik}</div>
            ${ev.ders ? `<div style="font-size:0.68rem;font-weight:700;color:${ev.renk};margin-top:1px">${ev.ders}</div>` : ''}
            ${ev.saat ? `<div style="font-size:0.68rem;color:var(--text2);margin-top:1px">🕐 ${ev.saat}</div>` : ''}
            ${ev.not  ? `<div style="font-size:0.68rem;color:var(--text2);font-style:italic;margin-top:1px">${ev.not}</div>` : ''}
          </div>
        </div>`).join('')
      : `<div style="font-size:0.75rem;color:var(--text2);text-align:center;padding:8px 0;font-style:italic">Etkinlik yok</div>`;

    return `
      <div style="background:var(--surface);border-radius:14px;border:${isToday?'1.5px solid var(--accent)':'1px solid var(--border)'};margin-bottom:7px;overflow:hidden;opacity:${isPast?'0.55':'1'}">
        <div onclick="_prgToggleGun(${i})" style="display:flex;align-items:center;justify-content:space-between;padding:11px 14px;cursor:pointer;user-select:none">
          <div style="display:flex;align-items:center;gap:7px">
            <span style="font-size:0.85rem;font-weight:800;color:${isToday?'var(--accent)':'var(--text)'}">${_PRG_DAYS_S[i]} ${dateOfDay.getDate()}</span>
            ${isToday ? '<span style="font-size:0.6rem;background:var(--accent);color:#fff;border-radius:99px;padding:2px 7px;font-weight:700">Bugün</span>' : ''}
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            ${evs.length ? `<span style="font-size:0.65rem;background:var(--accent)18;color:var(--accent);border-radius:99px;padding:2px 8px;font-weight:700">${evs.length}</span>` : ''}
            <span id="prgChev_${i}" style="color:var(--text2);font-size:0.75rem;transition:transform .2s${isToday?';transform:rotate(180deg)':''}">▼</span>
          </div>
        </div>
        <div id="prgGun_${i}" style="${isToday?'':'display:none'};padding:0 12px 10px">
          ${evHtml}
        </div>
      </div>`;
  }).join('');

  return `
    <div class="page-title" style="display:flex;align-items:center;gap:8px">
      <svg style="vertical-align:middle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      Haftalık Programım
    </div>
    <div class="page-sub">Koçunun hazırladığı çalışma programı</div>
    ${bugunHero}
    ${nav}
    ${gunlerHtml}
    <div style="margin-bottom:16px"></div>
  `;
}

function _prgToggleGun(i) {
  const panel = document.getElementById('prgGun_' + i);
  const chev  = document.getElementById('prgChev_' + i);
  if (!panel) return;
  const open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
  if (chev) chev.style.transform = open ? '' : 'rotate(180deg)';
}

function _prgWeekNav(dir) {
  window._prgState.weekOffset += dir;
  const mc = document.getElementById('mainContent');
  if (mc) mc.innerHTML = _prgRenderPage();
}

function _programPostRender() {}
