// ── TAKVİM SAYFASI ───────────────────────────────────────────
const _TAK_COLORS = ['#6c63ff','#43b89c','#f9a825','#e24b4a','#4cc9f0','#f472b6'];
const _TAK_DAYS   = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
const _TAK_DAYS_S = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const _TAK_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

// Haftanın ISO key'i
function _takHaftaKey(offsetWeeks = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetWeeks * 7);
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const weekNo = Math.ceil(((d - jan4) / 86400000 + jan4.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2,'0')}`;
}

// Haftanın Pazartesisi
function _takGetMon(offsetWeeks = 0) {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1 + offsetWeeks * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Hafta label
function _takHaftaLabel(offsetWeeks = 0) {
  const mon = _takGetMon(offsetWeeks);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const sameMonth = mon.getMonth() === sun.getMonth();
  return sameMonth
    ? `${mon.getDate()}–${sun.getDate()} ${_TAK_MONTHS[mon.getMonth()]} ${mon.getFullYear()}`
    : `${mon.getDate()} ${_TAK_MONTHS[mon.getMonth()]} – ${sun.getDate()} ${_TAK_MONTHS[sun.getMonth()]}`;
}

// Bugünün haftaiçi index'i (0=Pzt)
function _takBugunIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

// State
window._takState = {
  weekOffset: 0,
  selectedDay: _takBugunIndex(),
  etkinlikler: {},
};

async function takvimiPage() {
  const uid = auth.currentUser?.uid;
  if (!uid) return '<div style="padding:40px;text-align:center;color:var(--text2)">Oturum bulunamadı.</div>';

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
  const { weekOffset, selectedDay, etkinlikler } = window._takState;
  const haftaKey  = _takHaftaKey(weekOffset);
  const bugunIdx  = _takBugunIndex();
  const mon       = _takGetMon(weekOffset);

  // Pill strip
  const pills = _TAK_DAYS_S.map((label, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const key = `${haftaKey}_${i}`;
    const evs = etkinlikler[key] || [];
    const isToday  = weekOffset === 0 && i === bugunIdx;
    const isActive = i === selectedDay;
    const dots = evs.slice(0, 3).map(ev =>
      `<div style="width:4px;height:4px;border-radius:50%;background:${isActive?'rgba(255,255,255,.65)':ev.renk}"></div>`
    ).join('');
    return `
      <div onclick="_takSelDay(${i})" style="flex:1;display:flex;flex-direction:column;align-items:center;
        padding:7px 3px;border-radius:11px;cursor:pointer;transition:all .15s;border:1.5px solid ${isActive?'#6c63ff':isToday?'#6c63ff33':'transparent'};
        background:${isActive?'#6c63ff':isToday?'#6c63ff08':'var(--surface)'}">
        <div style="font-size:9px;font-weight:700;color:${isActive?'rgba(255,255,255,.75)':'var(--text2)'};margin-bottom:2px">${label}</div>
        <div style="font-size:15px;font-weight:900;color:${isActive?'#fff':isToday?'#6c63ff':'var(--text)'}">${d.getDate()}</div>
        <div style="display:flex;gap:2px;margin-top:3px;min-height:5px">${dots}</div>
      </div>`;
  }).join('');

  // Seçili günün etkinlikleri
  const selDate = new Date(mon); selDate.setDate(mon.getDate() + selectedDay);
  const isToday2 = weekOffset === 0 && selectedDay === bugunIdx;
  const selKey  = `${haftaKey}_${selectedDay}`;
  const selEvs  = (etkinlikler[selKey] || []).sort((a,b) => (a.saat||'').localeCompare(b.saat||''));

  const evCards = selEvs.length === 0
    ? `<div style="text-align:center;padding:24px 12px;color:var(--text2)">
        <div style="font-size:26px;opacity:.3;margin-bottom:6px">📭</div>
        <div style="font-size:12px;font-weight:600">Bu gün için etkinlik yok</div>
       </div>`
    : selEvs.map(ev => `
        <div style="display:flex;align-items:stretch;background:var(--surface);border-radius:11px;border:1px solid var(--border);overflow:hidden;margin-bottom:6px">
          <div style="width:4px;flex-shrink:0;background:${ev.renk}"></div>
          <div style="flex:1;padding:9px 10px">
            <div style="font-size:13px;font-weight:800;color:var(--text)">${ev.baslik}</div>
            ${ev.ders ? `<div style="font-size:10px;font-weight:700;color:${ev.renk};margin-top:1px">${ev.ders}</div>` : ''}
            <div style="display:flex;gap:8px;margin-top:3px">
              ${ev.saat ? `<span style="font-size:10px;color:var(--text2);display:flex;align-items:center;gap:3px">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${ev.saat}
              </span>` : ''}
              ${ev.not ? `<span style="font-size:10px;color:var(--text2);font-style:italic">${ev.not}</span>` : ''}
            </div>
          </div>
          <button onclick="_takEvSil('${ev.id}','${selKey}')" style="width:32px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#ff658408;border:none;cursor:pointer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ff6584" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>`).join('');

  // Öğrenci gönder bölümü
  const ogrenciler = (typeof students !== 'undefined' ? students : []) || [];
  const ogrChips = ogrenciler.length
    ? ogrenciler.map(o => `
        <span onclick="_takOgrToggle(this,'${o.uid}')"
          style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:99px;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;
          border:1.5px solid ${window._takSecilenOgrenciler?.has(o.uid)?'#6c63ff':'var(--border)'};
          background:${window._takSecilenOgrenciler?.has(o.uid)?'#6c63ff':'transparent'};
          color:${window._takSecilenOgrenciler?.has(o.uid)?'#fff':'var(--text2)'}">
          <span style="width:6px;height:6px;border-radius:50%;background:${o.color||'#6c63ff'};flex-shrink:0"></span>
          ${o.name.split(' ')[0]}
        </span>`).join('')
    : `<span style="font-size:11px;color:var(--text2)">Henüz öğrenci yok</span>`;

  return `
    <!-- Başlık -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
      <span style="font-size:21px;font-weight:900;color:var(--text);display:flex;align-items:center;gap:8px">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Takvim
      </span>
      <button onclick="_takEtkinlikEkle(${selectedDay})" style="width:30px;height:30px;border-radius:9px;border:none;background:var(--accent);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
    </div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:12px">Haftalık ders ve etkinlik planı</div>

    <!-- Hafta nav -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <button onclick="_takWeekNav(-1)" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;display:flex;align-items:center;justify-content:center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span style="font-size:13px;font-weight:800;color:var(--text)">${_takHaftaLabel(weekOffset)}</span>
      <button onclick="_takWeekNav(1)" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;display:flex;align-items:center;justify-content:center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- Pill strip -->
    <div style="display:flex;gap:5px;margin-bottom:12px">${pills}</div>

    <!-- Seçili gün başlık -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:var(--surface);border-radius:12px;border:1px solid var(--border);margin-bottom:9px">
      <div>
        <span style="font-size:14px;font-weight:900;color:var(--text)">${_TAK_DAYS[selectedDay]}</span>
        ${isToday2 ? '<span style="font-size:9px;background:#6c63ff;color:#fff;border-radius:99px;padding:2px 7px;font-weight:700;margin-left:6px;vertical-align:middle">Bugün</span>' : ''}
        <div style="font-size:11px;color:var(--text2);margin-top:1px">
          ${selDate.getDate()} ${_TAK_MONTHS[selDate.getMonth()]} ${selDate.getFullYear()}
        </div>
      </div>
      <button onclick="_takEtkinlikEkle(${selectedDay})" style="width:28px;height:28px;border-radius:8px;border:1.5px dashed #6c63ff55;background:#6c63ff08;color:#6c63ff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
    </div>

    <!-- Etkinlik listesi -->
    <div style="margin-bottom:12px">${evCards}</div>

    <!-- Alt butonlar -->
    <div style="display:flex;gap:7px;margin-bottom:14px">
      <button onclick="_takKopyalaAc()" style="flex:1;padding:10px;border:1.5px solid #6c63ff44;border-radius:11px;background:#6c63ff08;color:#6c63ff;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-family:'Inter',sans-serif">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Haftayı Kopyala
      </button>
      <button onclick="_takGonderAc()" style="flex:1;padding:10px;border:none;border-radius:11px;background:var(--accent);color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">
        Öğrencilere Gönder →
      </button>
    </div>

    <!-- Gönder paneli -->
    <div id="_takGonderPanel" style="display:none;background:var(--surface);border-radius:14px;border:1px solid var(--border);padding:13px;margin-bottom:16px">
      <div style="font-size:12px;font-weight:800;color:var(--text);margin-bottom:8px;display:flex;align-items:center;gap:6px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        ${_takHaftaLabel(weekOffset)} haftasını gönder
      </div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:6px">Öğrenci seç</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">${ogrChips}</div>
      <div style="display:flex;gap:6px;margin-bottom:10px">
        <button id="_takTipMesajBtn" onclick="_takTipSec('mesaj')"
          style="flex:1;padding:8px;border:1.5px solid var(--accent);border-radius:10px;background:var(--accent)0a;color:var(--accent);font-size:11px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">
          Mesaj olarak
        </button>
        <button id="_takTipGorevBtn" onclick="_takTipSec('gorev')"
          style="flex:1;padding:8px;border:1.5px solid var(--border);border-radius:10px;background:transparent;color:var(--text2);font-size:11px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">
          Görev olarak
        </button>
      </div>
      <button onclick="_takGonder()" style="width:100%;padding:11px;border:none;border-radius:12px;background:var(--accent);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">
        Gönder →
      </button>
    </div>

    <div style="height:16px"></div>
  `;
}

// Gün seç
function _takSelDay(i) {
  window._takState.selectedDay = i;
  document.getElementById('mainContent').innerHTML = _takRenderPage();
}

// Hafta navigasyon
function _takWeekNav(dir) {
  window._takState.weekOffset += dir;
  document.getElementById('mainContent').innerHTML = _takRenderPage();
}

// Gönder paneli aç/kapat
function _takGonderAc() {
  const p = document.getElementById('_takGonderPanel');
  if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

// Öğrenci toggle (chip)
function _takOgrToggle(el, uid) {
  if (!window._takSecilenOgrenciler) window._takSecilenOgrenciler = new Set();
  if (window._takSecilenOgrenciler.has(uid)) {
    window._takSecilenOgrenciler.delete(uid);
    el.style.background = 'transparent';
    el.style.borderColor = 'var(--border)';
    el.style.color = 'var(--text2)';
  } else {
    window._takSecilenOgrenciler.add(uid);
    el.style.background = '#6c63ff';
    el.style.borderColor = '#6c63ff';
    el.style.color = '#fff';
  }
}

// Tip seç
window._takSecilenTip = 'mesaj';
function _takTipSec(tip) {
  window._takSecilenTip = tip;
  const m = document.getElementById('_takTipMesajBtn');
  const g = document.getElementById('_takTipGorevBtn');
  if (!m || !g) return;
  if (tip === 'mesaj') {
    m.style.borderColor = 'var(--accent)'; m.style.background = 'var(--accent)0a'; m.style.color = 'var(--accent)';
    g.style.borderColor = 'var(--border)'; g.style.background = 'transparent'; g.style.color = 'var(--text2)';
  } else {
    g.style.borderColor = 'var(--accent)'; g.style.background = 'var(--accent)0a'; g.style.color = 'var(--accent)';
    m.style.borderColor = 'var(--border)'; m.style.background = 'transparent'; m.style.color = 'var(--text2)';
  }
}

// ── HAFTA KOPYALA ─────────────────────────────────────────────
function _takKopyalaAc() {
  window._takKopyalaSecilen = new Set();
  const srcLabel = _takHaftaLabel(window._takState.weekOffset);
  const modal = document.createElement('div');
  modal.id = '_takKopyalaModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center';

  const weeks = [-3,-2,-1,1,2,3,4];
  const weekRows = weeks.map(off => {
    const lbl = _takHaftaLabel(window._takState.weekOffset + off);
    const rel = off === -1 ? 'Geçen hafta' : off === 1 ? 'Gelecek hafta' : `${off > 0 ? '+' + off : off} hafta`;
    return `<div data-off="${off}" onclick="_takKopyalaToggle(this,${off})"
      style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:11px;border:1.5px solid var(--border);background:var(--surface);cursor:pointer;margin-bottom:6px;transition:all .15s">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700;color:var(--text)">${lbl}</div>
        <div style="font-size:11px;color:var(--text2);margin-top:1px">${rel}</div>
      </div>
      <div id="_takKopChk_${off}" style="width:20px;height:20px;border-radius:6px;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .15s"></div>
    </div>`;
  }).join('');

  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px 16px 32px">
      <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 16px"></div>
      <div style="font-size:15px;font-weight:900;color:var(--text);margin-bottom:4px">Haftayı Kopyala</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:14px">"${srcLabel}" haftasını hangi haftaya kopyalayalım?</div>
      <div style="max-height:260px;overflow-y:auto">${weekRows}</div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button onclick="document.getElementById('_takKopyalaModal').remove()"
          style="flex:1;padding:11px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">
          Vazgeç
        </button>
        <button onclick="_takKopyalaYap()"
          style="flex:1;padding:11px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">
          Kopyala ✓
        </button>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function _takKopyalaToggle(el, off) {
  const isSelected = window._takKopyalaSecilen.has(off);
  const chk = document.getElementById(`_takKopChk_${off}`);
  if (isSelected) {
    window._takKopyalaSecilen.delete(off);
    el.style.borderColor = 'var(--border)';
    el.style.background = 'var(--surface)';
    if (chk) { chk.textContent = ''; chk.style.background = 'transparent'; chk.style.borderColor = 'var(--border)'; }
  } else {
    window._takKopyalaSecilen.add(off);
    el.style.borderColor = '#6c63ff';
    el.style.background = '#6c63ff08';
    if (chk) { chk.textContent = '✓'; chk.style.background = '#6c63ff'; chk.style.borderColor = '#6c63ff'; chk.style.color = '#fff'; }
  }
}

async function _takKopyalaYap() {
  if (!window._takKopyalaSecilen || !window._takKopyalaSecilen.size) {
    showToast('⚠️', 'En az bir hafta seç'); return;
  }
  const srcOffset  = window._takState.weekOffset;
  const srcHafta   = _takHaftaKey(srcOffset);
  const uid        = auth.currentUser?.uid;
  if (!uid) return;

  document.getElementById('_takKopyalaModal')?.remove();
  showToast('⏳', 'Kopyalanıyor...');

  try {
    const batch = db.batch();
    let kopyalanan = 0;

    for (const relOff of window._takKopyalaSecilen) {
      const dstOffset = srcOffset + relOff;
      const dstHafta  = _takHaftaKey(dstOffset);

      for (let gun = 0; gun < 7; gun++) {
        const srcKey = `${srcHafta}_${gun}`;
        const srcEvs = window._takState.etkinlikler[srcKey] || [];
        srcEvs.forEach(ev => {
          const ref = db.collection('takvimler').doc();
          const { id, hafta, createdAt, ...rest } = ev;
          batch.set(ref, { ...rest, hafta: dstHafta, createdAt: new Date() });
          // State'e de ekle
          const dstKey = `${dstHafta}_${gun}`;
          if (!window._takState.etkinlikler[dstKey]) window._takState.etkinlikler[dstKey] = [];
          window._takState.etkinlikler[dstKey].push({ id: ref.id, ...rest, hafta: dstHafta });
          kopyalanan++;
        });
      }
    }

    await batch.commit();
    showToast('✅', `${kopyalanan} etkinlik ${window._takKopyalaSecilen.size} haftaya kopyalandı`);
    document.getElementById('mainContent').innerHTML = _takRenderPage();
  } catch(e) {
    showToast('❌', 'Kopyalanamadı: ' + e.message);
  }
}

// ── SAAT YARDIMCILARI ─────────────────────────────────────────
function _takSaatInput(el) {
  let v = el.value.replace(/[^0-9]/g, '');
  if (v.length >= 2) v = v.slice(0, 2) + ':' + v.slice(2, 4);
  else v = v.slice(0, 2);
  el.value = v;
  if (v.length >= 2 && parseInt(v.slice(0, 2)) > 23) el.value = '23' + v.slice(2);
  if (v.length === 5 && parseInt(v.slice(3, 5)) > 59) el.value = v.slice(0, 3) + '59';
}
function _takSaatBlur(el) {
  const v = el.value;
  if (!v) return;
  const m = v.match(/^(\d{2}):(\d{2})$/);
  if (!m || parseInt(m[1]) > 23 || parseInt(m[2]) > 59) {
    el.value = '';
    showToast('⚠️', 'Geçersiz saat — SS:DD formatında girin');
  }
}
function _takSaatValidate(val) {
  if (!val) return true;
  const m = val.match(/^(\d{2}):(\d{2})$/);
  return m && parseInt(m[1]) <= 23 && parseInt(m[2]) <= 59;
}

// ── ETKİNLİK EKLE MODALI ──────────────────────────────────────
function _takEtkinlikEkle(gunIndex) {
  const modal = document.createElement('div');
  modal.id = '_takModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:flex-end;justify-content:center';

  const renkler = _TAK_COLORS.map((r, i) => `
    <div onclick="_takRenkSec(this,'${r}')" data-renk="${r}"
      style="width:26px;height:26px;border-radius:50%;background:${r};cursor:pointer;border:2.5px solid ${i===0?'#1a1a2e':'transparent'};transition:transform .15s;${i===0?'transform:scale(1.15)':''}">
    </div>`).join('');

  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:24px 18px 32px">
      <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 18px"></div>
      <div style="font-size:15px;font-weight:800;color:var(--text);margin-bottom:16px">Etkinlik Ekle</div>

      <div style="font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700">BAŞLIK</div>
      <input id="_takBaslik" class="form-input" placeholder="ör. Matematik Tekrar, Deneme Sınavı…" style="margin-bottom:12px">

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="flex:1.4">
          <div style="font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700">GÜN</div>
          <select id="_takGun" class="form-select">
            ${_TAK_DAYS.map((d, i) => `<option value="${i}" ${i===(gunIndex??_takBugunIndex())?'selected':''}>${d}</option>`).join('')}
          </select>
        </div>
        <div style="flex:1">
          <div style="font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700">BAŞLANGIÇ</div>
          <input id="_takSaatBaslangic" class="form-input" placeholder="--:--" maxlength="5"
            oninput="_takSaatInput(this)" onblur="_takSaatBlur(this)"
            style="margin:0;text-align:center;font-size:15px;font-weight:700;letter-spacing:.05em">
        </div>
        <div style="flex:1">
          <div style="font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700">BİTİŞ</div>
          <input id="_takSaatBitis" class="form-input" placeholder="--:--" maxlength="5"
            oninput="_takSaatInput(this)" onblur="_takSaatBlur(this)"
            style="margin:0;text-align:center;font-size:15px;font-weight:700;letter-spacing:.05em">
        </div>
      </div>

      <div style="margin-bottom:12px">
        <div style="font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700">DERS</div>
        <select id="_takDers" class="form-select">
          <option value="">— Seç —</option>
          <option>Türkçe</option><option>Matematik</option><option>Fen Bilimleri</option>
          <option>İnkılap Tarihi</option><option>Din Kültürü</option><option>İngilizce</option>
          <option>Genel Tekrar</option><option>Deneme Sınavı</option><option>Dinlenme</option>
        </select>
      </div>

      <div style="font-size:10px;color:var(--text2);margin-bottom:6px;font-weight:700">RENK</div>
      <div style="display:flex;gap:8px;margin-bottom:12px" id="_takRenkRow">${renkler}</div>

      <div style="font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700">NOT (opsiyonel)</div>
      <input id="_takNot" class="form-input" placeholder="Konu, hedef soru sayısı…" style="margin-bottom:16px">

      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('_takModal').remove()"
          style="flex:1;padding:11px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">
          İptal
        </button>
        <button onclick="_takKaydet()"
          style="flex:1;padding:11px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">
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

// ── KAYDET ────────────────────────────────────────────────────
async function _takKaydet() {
  const baslik = document.getElementById('_takBaslik')?.value.trim();
  if (!baslik) { showToast('⚠️', 'Başlık girin'); return; }

  const gun           = parseInt(document.getElementById('_takGun')?.value ?? 0);
  const saatBaslangic = document.getElementById('_takSaatBaslangic')?.value.trim() || '';
  const saatBitis     = document.getElementById('_takSaatBitis')?.value.trim() || '';
  const ders          = document.getElementById('_takDers')?.value || '';
  const not           = document.getElementById('_takNot')?.value.trim() || '';
  const uid           = auth.currentUser?.uid;

  if (!uid) { showToast('❌', 'Oturum bulunamadı'); return; }
  if (saatBaslangic && !_takSaatValidate(saatBaslangic)) { showToast('⚠️', 'Başlangıç saati geçersiz'); return; }
  if (saatBitis && !_takSaatValidate(saatBitis)) { showToast('⚠️', 'Bitiş saati geçersiz'); return; }
  if (saatBaslangic && saatBitis && saatBitis <= saatBaslangic) { showToast('⚠️', 'Bitiş başlangıçtan sonra olmalı'); return; }

  const saat  = saatBaslangic && saatBitis ? `${saatBaslangic}–${saatBitis}` : saatBaslangic || '';
  const hafta = _takHaftaKey(window._takState.weekOffset);
  const ev    = { koachUid: uid, baslik, gun, hafta, saat, ders, not, renk: window._takSecilenRenk || _TAK_COLORS[0], createdAt: new Date() };

  document.getElementById('_takModal')?.remove();
  showToast('⏳', 'Kaydediliyor...');

  try {
    const ref = await db.collection('takvimler').add(ev);
    const key = `${hafta}_${gun}`;
    if (!window._takState.etkinlikler[key]) window._takState.etkinlikler[key] = [];
    window._takState.etkinlikler[key].push({ id: ref.id, ...ev });
    showToast('✅', 'Etkinlik kaydedildi');
    document.getElementById('mainContent').innerHTML = _takRenderPage();
  } catch(e) {
    showToast('❌', 'Kaydedilemedi: ' + e.message);
  }
}

// ── SİL ──────────────────────────────────────────────────────
async function _takEvSil(evId, key) {
  const onay = await appConfirm('Etkinliği Sil', 'Bu etkinliği silmek istiyor musun?', true);
  if (!onay) return;
  try {
    await db.collection('takvimler').doc(evId).delete();
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

// ── GÖNDER ────────────────────────────────────────────────────
window._takSecilenOgrenciler = new Set();

async function _takGonder() {
  const ogrenciler = [...(window._takSecilenOgrenciler || [])];
  if (!ogrenciler.length) { showToast('⚠️', 'Öğrenci seçin'); return; }

  const { weekOffset, etkinlikler } = window._takState;
  const hafta       = _takHaftaKey(weekOffset);
  const haftaLabel  = _takHaftaLabel(weekOffset);
  const tip         = window._takSecilenTip || 'mesaj';
  const koachUid    = auth.currentUser?.uid;
  const koachName   = window.currentUserData?.name || 'Koçunuz';

  const haftaEvleri = [];
  for (let i = 0; i < 7; i++) {
    const key = `${hafta}_${i}`;
    (etkinlikler[key] || []).sort((a,b) => (a.saat||'').localeCompare(b.saat||''))
      .forEach(ev => haftaEvleri.push({ ...ev, gunAdi: _TAK_DAYS[i] }));
  }

  if (!haftaEvleri.length) { showToast('⚠️', 'Bu haftada etkinlik yok'); return; }

  try {
    const batch = db.batch();
    if (tip === 'mesaj') {
      const tablo   = haftaEvleri.map(ev => `${ev.gunAdi}${ev.saat?' '+ev.saat:''}: ${ev.baslik}${ev.not?' ('+ev.not+')':''}`).join('\n');
      const icerik  = `📅 ${haftaLabel} Haftalık Programın:\n\n${tablo}\n\nBaşarılar! 💪`;
      for (const ogrenciUid of ogrenciler) {
        const cId    = [koachUid, ogrenciUid].sort().join('_');
        const msgRef = db.collection('messages').doc(cId).collection('msgs').doc();
        batch.set(msgRef, { fromUid: koachUid, toUid: ogrenciUid, senderUid: koachUid, fromName: koachName, text: icerik, type: 'takvim', hafta, createdAt: new Date(), read: false });
        const nRef   = db.collection('notifications').doc();
        batch.set(nRef, { toUid: ogrenciUid, fromUid: koachUid, fromName: koachName, type: 'message', baslik: 'Haftalık programın geldi!', body: `${haftaLabel} için program gönderildi.`, read: false, createdAt: new Date() });
      }
    } else {
      for (const ogrenciUid of ogrenciler) {
        const ref = db.collection('tasks').doc();
        batch.set(ref, { teacherId: koachUid, ogrenciUid, studentUid: ogrenciUid, tip: 'takvim', baslik: `${haftaLabel} Haftalık Program`, etkinlikler: haftaEvleri.map(ev => ({ baslik: ev.baslik, gun: ev.gunAdi, saat: ev.saat||'', not: ev.not||'', renk: ev.renk, done: false })), hafta, createdAt: new Date(), done: false });
        const nRef = db.collection('notifications').doc();
        batch.set(nRef, { toUid: ogrenciUid, fromUid: koachUid, fromName: koachName, type: 'task_takvim', baslik: 'Yeni haftalık ders planın geldi!', body: `${haftaLabel} için ${haftaEvleri.length} etkinlik.`, read: false, createdAt: new Date() });
      }
    }
    await batch.commit();
    showToast('✅', `${ogrenciler.length} öğrenciye gönderildi!`);
    window._takSecilenOgrenciler.clear();
    document.getElementById('mainContent').innerHTML = _takRenderPage();
  } catch(e) {
    showToast('❌', 'Gönderilemedi: ' + e.message);
  }
}
