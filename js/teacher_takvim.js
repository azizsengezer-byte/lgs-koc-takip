// ── TAKVİM SAYFASI ───────────────────────────────────────────
const _TAK_COLORS = ['#6c63ff','#43b89c','#f9a825','#e24b4a','#4cc9f0','#f472b6'];
const _TAK_DAYS   = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
const _TAK_DAYS_S = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];

// Haftanın ISO key'i (ör: "2026-W15")
function _takHaftaKey(offsetWeeks = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetWeeks * 7);
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const weekNo = Math.ceil(((d - jan4) / 86400000 + jan4.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2,'0')}`;
}

// Hafta aralığı string (ör: "7–13 Nisan")
function _takHaftaLabel(offsetWeeks = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetWeeks * 7);
  const day = d.getDay() || 7;
  const mon = new Date(d); mon.setDate(d.getDate() - day + 1);
  const sun = new Date(d); sun.setDate(d.getDate() - day + 7);
  const MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const sameMonth = mon.getMonth() === sun.getMonth();
  return sameMonth
    ? `${mon.getDate()}–${sun.getDate()} ${MONTHS[mon.getMonth()]} ${mon.getFullYear()}`
    : `${mon.getDate()} ${MONTHS[mon.getMonth()]} – ${sun.getDate()} ${MONTHS[sun.getMonth()]}`;
}

// Bugünün haftaiçi index'i (0=Pzt, 6=Paz)
function _takBugunIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

// State
window._takState = { weekOffset: 0, view: 'hafta', selectedDay: _takBugunIndex(), etkinlikler: {}, monthOffset: 0 };

async function takvimiPage() {
  const uid = auth.currentUser?.uid;
  if (!uid) return '<div style="padding:40px;text-align:center;color:var(--text2)">Oturum bulunamadı.</div>';

  // Firestore'dan etkinlikleri yükle
  try {
    const snap = await db.collection('takvimler').where('koachUid','==',uid).get();
    window._takState.etkinlikler = {};
    snap.forEach(d => {
      const ev = { id: d.id, ...d.data() };
      const key = `${ev.hafta}_${ev.gun}`;
      if (!window._takState.etkinlikler[key]) window._takState.etkinlikler[key] = [];
      window._takState.etkinlikler[key].push(ev);
    });
  } catch(e) { console.warn('Takvim yüklenemedi:', e.message); }

  return _takRenderPage();
}

function _takRenderPage() {
  const { view, weekOffset, monthOffset } = window._takState;
  return `
    <div class="page-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
      <span style="display:flex;align-items:center;gap:8px">
        <svg style="vertical-align:middle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Takvim
      </span>
      <button onclick="_takEtkinlikEkle()" style="width:32px;height:32px;border-radius:9px;border:none;background:var(--accent);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit">+</button>
    </div>
    <div class="page-sub">Haftalık ve aylık program yönetimi</div>

    <!-- Tabs -->
    <div style="display:flex;background:var(--surface2);border-radius:12px;padding:3px;margin:14px 0 12px">
      <button onclick="_takSwitchView('hafta')" id="takTabHafta"
        style="flex:1;padding:7px;border-radius:9px;border:none;cursor:pointer;font-size:0.8rem;font-weight:700;font-family:inherit;${view==='hafta'?'background:var(--accent);color:#fff':'background:transparent;color:var(--text2)'}">
        Haftalık
      </button>
      <button onclick="_takSwitchView('ay')" id="takTabAy"
        style="flex:1;padding:7px;border-radius:9px;border:none;cursor:pointer;font-size:0.8rem;font-weight:700;font-family:inherit;${view==='ay'?'background:var(--accent);color:#fff':'background:transparent;color:var(--text2)'}">
        Aylık
      </button>
    </div>

    ${view === 'hafta' ? _takHaftalikHTML() : _takAylikHTML()}
  `;
}

function _takHaftalikHTML() {
  const { weekOffset, etkinlikler, selectedDay } = window._takState;
  const haftaKey = _takHaftaKey(weekOffset);
  const bugunIdx = _takBugunIndex();

  const gunSatirlari = _TAK_DAYS.map((gun, i) => {
    const key = `${haftaKey}_${i}`;
    const evs = (etkinlikler[key] || []).sort((a,b) => (a.saat||'').localeCompare(b.saat||''));
    const isToday = weekOffset === 0 && i === bugunIdx;

    const evHtml = evs.map(ev => `
      <div style="display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:8px;background:${ev.renk}10;margin-bottom:4px;border:1px solid ${ev.renk}22">
        <div style="width:3px;border-radius:99px;align-self:stretch;background:${ev.renk};flex-shrink:0"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:0.82rem;font-weight:800;color:var(--text)">${ev.baslik}</div>
          ${ev.ders ? `<div style="font-size:0.68rem;font-weight:700;color:${ev.renk};margin-top:1px">${ev.ders}</div>` : ''}
          ${ev.saat ? `<div style="font-size:0.68rem;color:var(--text2);margin-top:1px">🕐 ${ev.saat}</div>` : ''}
          ${ev.not  ? `<div style="font-size:0.68rem;color:var(--text2);font-style:italic;margin-top:1px">${ev.not}</div>` : ''}
        </div>
        <button onclick="_takEvSil('${ev.id}','${key}')" style="width:22px;height:22px;border-radius:6px;border:none;background:#ff658420;color:#ff6584;cursor:pointer;font-size:0.75rem;flex-shrink:0;display:flex;align-items:center;justify-content:center">✕</button>
      </div>`).join('');

    return `
    <div style="background:var(--surface);border-radius:12px;border:${isToday?'1.5px solid var(--accent)':'1px solid var(--border)'};margin-bottom:7px;overflow:hidden">
      <div onclick="_takToggleGun(${i})" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;cursor:pointer;user-select:none">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:0.85rem;font-weight:800;color:${isToday?'var(--accent)':'var(--text)'}">${gun}</span>
          ${isToday?'<span style="font-size:0.62rem;background:var(--accent);color:#fff;border-radius:99px;padding:1px 7px;font-weight:700">Bugün</span>':''}
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          ${evs.length ? `<span style="font-size:0.68rem;background:var(--accent)18;color:var(--accent);border-radius:99px;padding:2px 8px;font-weight:700">${evs.length}</span>` : ''}
          <span id="takChev_${i}" style="color:var(--text2);font-size:0.75rem;transition:transform 0.2s${isToday?';transform:rotate(180deg)':''}">▼</span>
        </div>
      </div>
      <div id="takGunPanel_${i}" style="${isToday?'':'display:none'};padding:0 10px 10px">
        ${evHtml}
        <button onclick="_takEtkinlikEkle(${i})" style="width:100%;padding:7px;border:1.5px dashed var(--accent)55;background:var(--accent)08;border-radius:9px;color:var(--accent);font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit;margin-top:4px">
          + Etkinlik Ekle
        </button>
      </div>
    </div>`;
  }).join('');

  return `
    <!-- Hafta navigasyon -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <button onclick="_takWeekNav(-1)" style="width:30px;height:30px;border-radius:9px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center">‹</button>
      <span style="font-size:0.82rem;font-weight:700;color:var(--text)" id="takHaftaLabel">${_takHaftaLabel(weekOffset)}</span>
      <button onclick="_takWeekNav(1)" style="width:30px;height:30px;border-radius:9px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center">›</button>
    </div>

    ${gunSatirlari}

    <!-- Öğrenciye Gönder -->
    <div style="background:var(--surface);border-radius:14px;border:1px solid var(--border);padding:14px;margin-top:8px;margin-bottom:16px">
      <div style="font-size:0.82rem;font-weight:800;color:var(--text);margin-bottom:10px;display:flex;align-items:center;gap:6px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Bu haftayı öğrenciye gönder
      </div>
      <div style="font-size:0.72rem;color:var(--text2);margin-bottom:8px">Öğrenci seç</div>
      <div id="takOgrenciSecim" style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">
        ${_takOgrenciChipleri()}
      </div>
      <div style="font-size:0.72rem;color:var(--text2);margin-bottom:6px">Gönderme şekli</div>
      <div style="display:flex;gap:6px;margin-bottom:12px">
        <button id="takTipMesaj" onclick="_takTipSec('mesaj')"
          style="flex:1;padding:8px;border:1.5px solid var(--accent);border-radius:10px;background:var(--accent)0a;color:var(--accent);font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit">
          💬 Mesaj
        </button>
        <button id="takTipGorev" onclick="_takTipSec('gorev')"
          style="flex:1;padding:8px;border:1.5px solid var(--border);border-radius:10px;background:transparent;color:var(--text2);font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit">
          📋 Görev
        </button>
      </div>
      <button onclick="_takGonder()" style="width:100%;padding:11px;border:none;border-radius:12px;background:var(--accent);color:#fff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
        Gönder →
      </button>
    </div>
  `;
}

function _takAylikHTML() {
  const { monthOffset, etkinlikler } = window._takState;
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = target.getFullYear();
  const month = target.getMonth();
  const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Pzt=0

  let cells = '';
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    cells += `<div style="min-height:38px;padding:3px;border-right:1px solid #f5f6fa;border-bottom:1px solid #f5f6fa"><span style="font-size:0.68rem;color:var(--border)">${prevDays - i}</span></div>`;
  }

  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    // Renk noktaları — tüm haftaların bu güne denk gelenlerini bul
    const dayOfWeek = (new Date(year, month, d).getDay() + 6) % 7;
    const dots = Object.entries(etkinlikler)
      .filter(([k]) => k.endsWith(`_${dayOfWeek}`))
      .flatMap(([,evs]) => evs.slice(0,2))
      .slice(0,3)
      .map(ev => `<span style="display:inline-block;width:4px;height:4px;border-radius:50%;background:${ev.renk};margin:1px"></span>`)
      .join('');
    cells += `
      <div onclick="_takSelectMonthDay(${d},${month},${year})" style="min-height:38px;padding:3px;border-right:1px solid #f5f6fa;border-bottom:1px solid #f5f6fa;cursor:pointer;display:flex;flex-direction:column;align-items:center">
        <span style="font-size:0.68rem;font-weight:700;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:50%;${isToday?'background:var(--accent);color:#fff':'color:var(--text)'}">${d}</span>
        <div style="display:flex;flex-wrap:wrap;justify-content:center">${dots}</div>
      </div>`;
  }

  return `
    <div style="background:var(--surface);border-radius:14px;border:1px solid var(--border);overflow:hidden;margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border)">
        <button onclick="_takMonthNav(-1)" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);cursor:pointer">‹</button>
        <span style="font-size:0.9rem;font-weight:800">${MONTHS_TR[month]} ${year}</span>
        <button onclick="_takMonthNav(1)" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);cursor:pointer">›</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--border)">
        ${['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map((d,i)=>`<div style="padding:6px 0;text-align:center;font-size:0.6rem;font-weight:800;color:${i>=5?'#ff6584':'var(--text2)'}">${d}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr)">${cells}</div>
    </div>

    <div id="takAylikDetay" style="background:var(--surface);border-radius:14px;border:1px solid var(--border);padding:14px">
      <div style="font-size:0.8rem;font-weight:800;color:var(--text);margin-bottom:8px">Bir güne tıkla</div>
      <div style="font-size:0.78rem;color:var(--text2)">Etkinlik detaylarını görmek için takvimden bir gün seç.</div>
    </div>
    <div style="margin-bottom:16px"></div>
  `;
}

function _takOgrenciChipleri() {
  const ogrenciler = (typeof students !== 'undefined' ? students : null) || window.students || [];
  if (!ogrenciler.length) return '<span style="font-size:0.75rem;color:var(--text2)">Henüz öğrenci eklenmemiş</span>';
  return ogrenciler.map(o => `
    <span onclick="_takOgrenciToggle(this,'${o.uid}')"
      data-uid="${o.uid}"
      style="display:inline-flex;align-items:center;gap:5px;background:var(--surface2);border:1.5px solid var(--border);border-radius:99px;padding:5px 12px;font-size:0.75rem;font-weight:700;color:var(--text2);cursor:pointer;transition:all .15s;margin-bottom:4px">
      <span style="width:8px;height:8px;border-radius:50%;background:${o.color};flex-shrink:0"></span>
      ${o.name.split(' ')[0]}
    </span>`).join('');
}

// Toggle fonksiyonları
window._takSecilenOgrenciler = new Set();
window._takSecilenTip = 'mesaj';

function _takOgrenciToggle(el, uid) {
  if (window._takSecilenOgrenciler.has(uid)) {
    window._takSecilenOgrenciler.delete(uid);
    el.style.background = 'var(--surface2)';
    el.style.borderColor = 'var(--border)';
    el.style.color = 'var(--text2)';
  } else {
    window._takSecilenOgrenciler.add(uid);
    el.style.background = 'var(--accent)';
    el.style.borderColor = 'var(--accent)';
    el.style.color = '#fff';
  }
}

function _takTipSec(tip) {
  window._takSecilenTip = tip;
  const mBtn = document.getElementById('takTipMesaj');
  const gBtn = document.getElementById('takTipGorev');
  if (!mBtn || !gBtn) return;
  if (tip === 'mesaj') {
    mBtn.style.borderColor = 'var(--accent)'; mBtn.style.background = 'var(--accent)0a'; mBtn.style.color = 'var(--accent)';
    gBtn.style.borderColor = 'var(--border)'; gBtn.style.background = 'transparent'; gBtn.style.color = 'var(--text2)';
  } else {
    gBtn.style.borderColor = 'var(--accent)'; gBtn.style.background = 'var(--accent)0a'; gBtn.style.color = 'var(--accent)';
    mBtn.style.borderColor = 'var(--border)'; mBtn.style.background = 'transparent'; mBtn.style.color = 'var(--text2)';
  }
}

function _takSwitchView(view) {
  window._takState.view = view;
  const el = document.getElementById('mainContent');
  el.innerHTML = _takRenderPage();
}

function _takWeekNav(dir) {
  window._takState.weekOffset += dir;
  const el = document.getElementById('mainContent');
  el.innerHTML = _takRenderPage();
}

function _takMonthNav(dir) {
  window._takState.monthOffset += dir;
  const el = document.getElementById('mainContent');
  el.innerHTML = _takRenderPage();
}

function _takToggleGun(i) {
  const panel = document.getElementById(`takGunPanel_${i}`);
  const chev  = document.getElementById(`takChev_${i}`);
  if (!panel) return;
  const open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
  if (chev) chev.style.transform = open ? '' : 'rotate(180deg)';
}

function _takSelectMonthDay(d, month, year) {
  const el = document.getElementById('takAylikDetay');
  if (!el) return;
  const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const DAYS_TR = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const date = new Date(year, month, d);
  const dayOfWeek = (date.getDay() + 6) % 7;
  const { etkinlikler } = window._takState;

  const evs = Object.entries(etkinlikler)
    .filter(([k]) => k.endsWith(`_${dayOfWeek}`))
    .flatMap(([,evArr]) => evArr)
    .sort((a,b) => (a.saat||'').localeCompare(b.saat||''));

  el.innerHTML = `
    <div style="font-size:0.82rem;font-weight:800;color:var(--text);margin-bottom:10px">${d} ${MONTHS_TR[month]} — ${DAYS_TR[date.getDay()]}</div>
    ${evs.length ? evs.map(ev => `
      <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)">
        <div style="width:4px;height:36px;border-radius:99px;background:${ev.renk};flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-size:0.82rem;font-weight:700;color:var(--text)">${ev.baslik}</div>
          ${ev.saat ? `<div style="font-size:0.7rem;color:var(--text2)">${ev.saat}</div>` : ''}
        </div>
        <button onclick="_takEvSil('${ev.id}',null)" style="width:22px;height:22px;border-radius:6px;border:none;background:#ff658420;color:#ff6584;cursor:pointer;font-size:0.72rem">✕</button>
      </div>`).join('') : '<div style="font-size:0.78rem;color:var(--text2);padding:4px 0">Bu gün için etkinlik yok.</div>'}
    <button onclick="_takEtkinlikEkle(${dayOfWeek})" style="width:100%;padding:8px;margin-top:10px;border:1.5px dashed var(--accent)55;background:var(--accent)08;border-radius:9px;color:var(--accent);font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit">
      + Etkinlik Ekle
    </button>
  `;
}

// ETKİNLİK EKLE MODALI
function _takEtkinlikEkle(gunIndex) {
  const modal = document.createElement('div');
  modal.id = '_takModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:flex-end;justify-content:center';

  const renkler = _TAK_COLORS.map((r,i) => `
    <div onclick="_takRenkSec(this,'${r}')" data-renk="${r}"
      style="width:26px;height:26px;border-radius:50%;background:${r};cursor:pointer;border:2.5px solid ${i===0?'#1a1a2e':'transparent'};transition:transform .15s;${i===0?'transform:scale(1.15)':''}">
    </div>`).join('');

  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:24px 18px 32px">
      <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 18px"></div>
      <div style="font-size:1rem;font-weight:800;margin-bottom:16px">Etkinlik Ekle</div>

      <div style="font-size:0.72rem;color:var(--text2);margin-bottom:4px;font-weight:700">BAŞLIK</div>
      <input id="_takBaslik" class="form-input" placeholder="ör. Matematik, LGS Denemesi, Fen..." style="margin-bottom:12px">

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="flex:1.4">
          <div style="font-size:0.72rem;color:var(--text2);margin-bottom:4px;font-weight:700">GÜN</div>
          <select id="_takGun" class="form-select">
            ${_TAK_DAYS.map((d,i) => `<option value="${i}" ${i===(gunIndex??_takBugunIndex())?'selected':''}>${d}</option>`).join('')}
          </select>
        </div>
        <div style="flex:1">
          <div style="font-size:0.72rem;color:var(--text2);margin-bottom:4px;font-weight:700">BAŞLANGIÇ</div>
          <input id="_takSaatBaslangic" type="time" class="form-input" style="margin:0;padding:10px 8px">
        </div>
        <div style="flex:1">
          <div style="font-size:0.72rem;color:var(--text2);margin-bottom:4px;font-weight:700">BİTİŞ</div>
          <input id="_takSaatBitis" type="time" class="form-input" style="margin:0;padding:10px 8px">
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="flex:1">
          <div style="font-size:0.72rem;color:var(--text2);margin-bottom:4px;font-weight:700">DERS</div>
          <select id="_takDers" class="form-select">
            <option value="">— Seç —</option>
            <option>Türkçe</option>
            <option>Matematik</option>
            <option>Fen Bilimleri</option>
            <option>İnkılap Tarihi</option>
            <option>Din Kültürü</option>
            <option>İngilizce</option>
            <option>Genel Tekrar</option>
            <option>Deneme Sınavı</option>
            <option>Dinlenme</option>
          </select>
        </div>
      </div>

      <div style="font-size:0.72rem;color:var(--text2);margin-bottom:6px;font-weight:700">RENK</div>
      <div style="display:flex;gap:8px;margin-bottom:12px" id="_takRenkRow">${renkler}</div>

      <div style="font-size:0.72rem;color:var(--text2);margin-bottom:4px;font-weight:700">NOT (opsiyonel)</div>
      <input id="_takNot" class="form-input" placeholder="Konu, hedef soru sayısı…" style="margin-bottom:16px">

      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('_takModal').remove()"
          style="flex:1;padding:11px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          İptal
        </button>
        <button onclick="_takKaydet()"
          style="flex:1;padding:11px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          Kaydet ✓
        </button>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

window._takSecilenRenk = _TAK_COLORS[0];
function _takRenkSec(el, renk) {
  window._takSecilenRenk = renk;
  document.querySelectorAll('#_takRenkRow div').forEach(d => {
    d.style.border = '2.5px solid transparent';
    d.style.transform = '';
  });
  el.style.border = '2.5px solid #1a1a2e';
  el.style.transform = 'scale(1.15)';
}

async function _takKaydet() {
  const baslikEl = document.getElementById('_takBaslik');
  const gunEl    = document.getElementById('_takGun');
  const saatEl   = document.getElementById('_takSaat');
  const notEl    = document.getElementById('_takNot');

  const baslik = baslikEl?.value.trim();
  if (!baslik) { showToast('⚠️', 'Başlık girin'); return; }

  const gun  = parseInt(gunEl?.value ?? 0);
  const saatBaslangic = document.getElementById('_takSaatBaslangic')?.value || '';
  const saatBitis    = document.getElementById('_takSaatBitis')?.value || '';
  const saat  = saatBaslangic && saatBitis ? `${saatBaslangic}–${saatBitis}` : saatBaslangic || '';
  const sure  = document.getElementById('_takSure')?.value || '';
  const ders  = document.getElementById('_takDers')?.value || '';
  const not   = notEl?.value.trim() || '';
  const uid  = auth.currentUser?.uid;
  if (!uid) { showToast('❌', 'Oturum bulunamadı'); return; }

  const hafta = _takHaftaKey(window._takState.weekOffset);
  const ev = { koachUid: uid, baslik, gun, hafta, saat, sure, ders, not, renk: window._takSecilenRenk || _TAK_COLORS[0], createdAt: new Date() };

  // Önce modalı kapat, sonra kaydet
  document.getElementById('_takModal')?.remove();
  showToast('⏳', 'Kaydediliyor...');

  try {
    const ref = await db.collection('takvimler').add(ev);
    const key = `${hafta}_${gun}`;
    if (!window._takState.etkinlikler[key]) window._takState.etkinlikler[key] = [];
    window._takState.etkinlikler[key].push({ id: ref.id, ...ev });
    showToast('✅', 'Etkinlik kaydedildi');
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = _takRenderPage();
  } catch(e) {
    showToast('❌', 'Kaydedilemedi: ' + e.message);
  }
}

async function _takEvSil(evId, key) {
  if (!confirm('Bu etkinliği silmek istiyor musun?')) return;
  try {
    await db.collection('takvimler').doc(evId).delete();
    // State'ten kaldır
    if (key) {
      window._takState.etkinlikler[key] = (window._takState.etkinlikler[key] || []).filter(e => e.id !== evId);
    } else {
      Object.keys(window._takState.etkinlikler).forEach(k => {
        window._takState.etkinlikler[k] = window._takState.etkinlikler[k].filter(e => e.id !== evId);
      });
    }
    showToast('✅', 'Silindi');
    document.getElementById('mainContent').innerHTML = _takRenderPage();
  } catch(e) { showToast('❌', e.message); }
}

async function _takGonder() {
  const ogrenciler = [...window._takSecilenOgrenciler];
  if (!ogrenciler.length) { showToast('⚠️', 'Öğrenci seçin'); return; }

  const { weekOffset, etkinlikler } = window._takState;
  const hafta  = _takHaftaKey(weekOffset);
  const haftaLabel = _takHaftaLabel(weekOffset);
  const tip    = window._takSecilenTip;
  const koachUid = auth.currentUser?.uid;
  const koachName = window.currentUserData?.name || 'Koçunuz';

  // Bu haftanın tüm etkinlikleri
  const haftaEvleri = [];
  for (let i = 0; i < 7; i++) {
    const key = `${hafta}_${i}`;
    const evs = (etkinlikler[key] || []).sort((a,b) => (a.saat||'').localeCompare(b.saat||''));
    evs.forEach(ev => haftaEvleri.push({ ...ev, gunAdi: _TAK_DAYS[i] }));
  }

  if (!haftaEvleri.length) { showToast('⚠️', 'Bu haftada etkinlik yok'); return; }

  try {
    const batch = db.batch();

    if (tip === 'mesaj') {
      // Tablo formatında mesaj oluştur
      const tablo = haftaEvleri.map(ev => `${ev.gunAdi}${ev.saat?' '+ev.saat:''}: ${ev.baslik}${ev.not?' ('+ev.not+')':''}`).join('\n');
      const icerik = `📅 ${haftaLabel} Haftalık Programın:\n\n${tablo}\n\nBaşarılar! 💪`;

      for (const ogrenciUid of ogrenciler) {
        const ref = db.collection('messages').doc();
        batch.set(ref, {
          fromUid: koachUid, toUid: ogrenciUid,
          fromName: koachName, text: icerik,
          type: 'takvim', hafta, createdAt: new Date(), read: false,
        });
        // Bildirim
        const nRef = db.collection('notifications').doc();
        batch.set(nRef, {
          toUid: ogrenciUid, fromName: koachName,
          type: 'message', baslik: 'Haftalık programın geldi!',
          body: `${haftaLabel} haftası için program gönderildi.`,
          read: false, createdAt: new Date(),
        });
      }
    } else {
      // Görev olarak
      for (const ogrenciUid of ogrenciler) {
        const ref = db.collection('tasks').doc();
        batch.set(ref, {
          koachUid, ogrenciUid, tip: 'takvim',
          baslik: `${haftaLabel} Haftalık Program`,
          etkinlikler: haftaEvleri.map(ev => ({ baslik: ev.baslik, gun: ev.gunAdi, saat: ev.saat||'', not: ev.not||'', renk: ev.renk, done: false })),
          hafta, createdAt: new Date(), done: false,
        });
        // Bildirim
        const nRef = db.collection('notifications').doc();
        batch.set(nRef, {
          toUid: ogrenciUid, fromName: koachName,
          type: 'task', baslik: 'Yeni haftalık program!',
          body: `${haftaLabel} için ${haftaEvleri.length} etkinlik.`,
          read: false, createdAt: new Date(),
        });
      }
    }

    await batch.commit();
    showToast('✅', `${ogrenciler.length} öğrenciye ${tip === 'mesaj' ? 'mesaj' : 'görev'} olarak gönderildi!`);
    window._takSecilenOgrenciler.clear();
    document.getElementById('mainContent').innerHTML = _takRenderPage();
  } catch(e) {
    showToast('❌', 'Gönderilemedi: ' + e.message);
  }
}

