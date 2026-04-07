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

