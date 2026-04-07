
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

  const existing = document.getElementById('kocProfilModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'kocProfilModal';
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal" style="max-width:360px;width:100%">
      <div style="text-align:center;margin-bottom:16px">
        ${teacherPhoto
          ? `<img src="${teacherPhoto}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block">`
          : `<div style="width:72px;height:72px;border-radius:50%;background:var(--accent)22;color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;margin:0 auto 10px">👨‍🏫</div>`}
        <div style="font-size:1.1rem;font-weight:900">${teacherName}</div>
        <div style="font-size:0.8rem;color:var(--accent);font-weight:600;margin-top:3px">Koç Öğretmenim</div>
      </div>

      <!-- Haftalık Ders Planım -->
      <div style="background:var(--surface2);border-radius:14px;padding:14px;margin-bottom:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;cursor:pointer" onclick="_haftalikPlanAc()">
          <div style="display:flex;align-items:center;gap:8px;font-size:0.88rem;font-weight:800;color:var(--text)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Haftalık Ders Planım
            ${_haftalikPlanYeni() ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#cc3355;margin-left:2px;flex-shrink:0"></span>' : ''}
          </div>
          <svg id="_planChev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div id="_planDetay" style="display:none">
          <div id="_planIcerik" style="font-size:0.8rem;color:var(--text2);text-align:center;padding:12px 0">Yükleniyor...</div>
        </div>
      </div>

      <button class="btn btn-primary" style="width:100%;margin-bottom:8px" onclick="document.getElementById('kocProfilModal').remove();showPage('messages')">
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

function _haftalikPlanYeni() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  const gorev = (typeof tasks !== 'undefined' ? tasks : []).find(t => t.tip === 'takvim');
  if (!gorev) return false;
  const gorulduKey = 'haftalikPlanGoruldu_' + myUid + '_' + (gorev.hafta || '');
  return !localStorage.getItem(gorulduKey);
}

function _planBadgeKaldir() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  const gorev = (typeof tasks !== 'undefined' ? tasks : []).find(t => t.tip === 'takvim');
  if (gorev?.hafta) localStorage.setItem('haftalikPlanGoruldu_' + myUid + '_' + gorev.hafta, '1');
  const badge = document.getElementById('planBadge');
  if (badge) badge.style.display = 'none';
}

async function _haftalikPlanAc() {
  const detay = document.getElementById('_planDetay');
  const chev  = document.getElementById('_planChev');
  const icerik = document.getElementById('_planIcerik');
  if (!detay) return;

  const open = detay.style.display !== 'none';
  if (open) {
    detay.style.display = 'none';
    if (chev) chev.style.transform = '';
    return;
  }
  detay.style.display = 'block';
  if (chev) chev.style.transform = 'rotate(180deg)';

  // Kırmızı noktayı kaldır — görüldü olarak işaretle
  const myUid = (window.currentUserData||{}).uid || 'local';
  const gorev = (typeof tasks !== 'undefined' ? tasks : []).find(t => t.tip === 'takvim');
  if (gorev?.hafta) {
    localStorage.setItem('haftalikPlanGoruldu_' + myUid + '_' + gorev.hafta, '1');
  }
  // Kırmızı noktayı DOM'dan kaldır
  document.querySelectorAll('[style*="cc3355"][style*="border-radius:50%"]').forEach(el => el.remove());

  // Bu haftanın takvim görevini bul
  const haftalikGorev = (typeof tasks !== 'undefined' ? tasks : [])
    .find(t => t.tip === 'takvim');

  if (!haftalikGorev || !haftalikGorev.etkinlikler) {
    // Firestore'dan da dene
    try {
      const myUid = (window.currentUserData||{}).uid;
      const snap = await db.collection('tasks')
        .where('studentUid','==',myUid)
        .where('tip','==','takvim')
        .orderBy('createdAt','desc')
        .limit(1).get();

      if (snap.empty) {
        icerik.innerHTML = '<div style="padding:12px 0;color:var(--text2);text-align:center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="margin-bottom:6px;display:block;margin-left:auto;margin-right:auto"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Koç tarafından atanan bir ders planı yok</div>';
        return;
      }
      const gorev = snap.docs[0].data();
      _haftalikPlanRender(gorev.etkinlikler, gorev.baslik);
    } catch(e) {
      icerik.innerHTML = '<div style="color:#cc3355;font-size:0.78rem;text-align:center">Yüklenemedi</div>';
    }
    return;
  }
  _haftalikPlanRender(haftalikGorev.etkinlikler, haftalikGorev.baslik);
}

function _haftalikPlanRender(etkinlikler, baslik) {
  const icerik = document.getElementById('_planIcerik');
  if (!icerik) return;
  const gunSirasi = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
  const grouped = {};
  etkinlikler.forEach(ev => {
    const g = ev.gun || '—';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(ev);
  });
  const satirlar = gunSirasi.filter(g => grouped[g]).map(g => `
    <tr>
      <td style="padding:6px 8px;font-size:0.75rem;font-weight:700;color:var(--text);border-bottom:1px solid var(--border);white-space:nowrap;vertical-align:top">${g}</td>
      <td style="padding:6px 8px;border-bottom:1px solid var(--border)">
        ${grouped[g].map(ev => `
          <div style="margin-bottom:3px">
            <span style="font-size:0.78rem;font-weight:700;color:var(--text)">${ev.baslik}</span>
            ${ev.ders ? `<span style="font-size:0.68rem;color:var(--accent);margin-left:4px">${ev.ders}</span>` : ''}
            ${ev.saat ? `<div style="font-size:0.68rem;color:var(--text2)">🕐 ${ev.saat}</div>` : ''}
          </div>`).join('')}
      </td>
    </tr>`).join('');

  icerik.innerHTML = baslik
    ? `<div style="font-size:0.7rem;font-weight:700;color:var(--text2);margin-bottom:8px">${baslik}</div>` : '';
  icerik.innerHTML += `
    <div style="overflow-x:auto;border-radius:10px;border:1px solid var(--border)">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:var(--accent)10">
          <th style="padding:6px 8px;text-align:left;color:var(--accent);font-size:0.72rem;font-weight:800;border-bottom:1px solid var(--border)">Gün</th>
          <th style="padding:6px 8px;text-align:left;color:var(--accent);font-size:0.72rem;font-weight:800;border-bottom:1px solid var(--border)">Program</th>
        </tr></thead>
        <tbody>${satirlar}</tbody>
      </table>
    </div>`;
}

