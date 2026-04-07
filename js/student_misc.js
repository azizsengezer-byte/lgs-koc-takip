
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

