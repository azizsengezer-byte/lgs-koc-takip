// profile.js — Profil Sayfası, Arkadaşlar, Okul Yönetimi

function _etiketHTML(etiket) {
  if (!etiket) return '';
  const s = {
    '🔥 Çalışkan':  'background:linear-gradient(135deg,#ff4444,#cc1111);color:white',
    '⚡ Hızlı':     'background:linear-gradient(135deg,#00d2ff,#0099cc);color:white',
    '👑 Efsane':    'background:linear-gradient(135deg,#f9ca24,#e6a800);color:#1a1200',
    '💎 Elit':      'background:linear-gradient(135deg,#a855f7,#7c22cc);color:white',
    '🦸 Kahraman':  'background:linear-gradient(135deg,#ff6b9d,#cc2266);color:white',
    '🦉 Bilge':     'background:linear-gradient(135deg,#45b7d1,#1a7a99);color:white',
    '🌋 Ateş Kalbi':'background:linear-gradient(135deg,#ff8c00,#cc4400);color:white',
  };
  return `<span style="${s[etiket]||'background:rgba(108,99,255,.3);color:white'};font-size:9px;font-weight:800;padding:2px 7px;border-radius:99px;margin-left:5px;vertical-align:middle">${etiket}</span>`;
}


// ── OKUL ARKADAŞLARI ─────────────────────────────────────────
async function okulArkadaslariniYukle() {
  const myData = window.currentUserData || {};
  const myUid = myData.uid || '';
  const mySchool = myData.school || '';
  const liste = document.getElementById('okul-arkadaslar-liste');
  if (!liste) return;

  if (!mySchool) {
    liste.innerHTML = '<div style="color:var(--text2);font-size:0.82rem">Okul bilgin henüz eklenmemiş.</div>';
    return;
  }

  try {
    const snap = await db.collection('users')
      .where('role', '==', 'student')
      .where('school', '==', mySchool)
      .get();

    const arkadaslar = [];
    snap.forEach(d => {
      if (d.id !== myUid) arkadaslar.push({ uid: d.id, ...d.data() });
    });

    if (arkadaslar.length === 0) {
      liste.innerHTML = '<div style="color:var(--text2);font-size:0.82rem;padding:8px 0">Henüz aynı okulda başka öğrenci yok.</div>';
      return;
    }

    liste.innerHTML = arkadaslar.map(a => {
      const isim = a.name || '?';
      const renk = a.color || '#6c63ff';
      const foto = a.photo
        ? `<img src="${a.photo}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0">`
        : `<div style="width:44px;height:44px;border-radius:50%;background:${renk}22;color:${renk};display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;flex-shrink:0">${isim[0]}</div>`;

      return `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
          ${foto}
          <div style="flex:1;min-width:0">
            <div style="font-weight:800;font-size:0.9rem;display:flex;align-items:center;flex-wrap:wrap">${isim}${_etiketHTML(a.etiket||"")}</div>
            <div style="font-size:0.72rem;color:var(--text2);margin-top:1px">${a.classroom||''} ${a.school||''}</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button onclick="arkadasMesajAt('${a.uid}','${isim}','${renk}')"
              style="background:var(--accent)15;color:var(--accent);border:1px solid var(--accent)44;border-radius:8px;padding:5px 10px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">
              💬
            </button>
            <button onclick="arkadasProfil('${a.uid}','${isim}','${renk}','${a.photo||''}','${a.etiket||''}')"
              style="background:var(--surface2);color:var(--text2);border:1px solid var(--border);border-radius:8px;padding:5px 10px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">
              👤
            </button>
          </div>
        </div>`;
    }).join('');

  } catch(e) {
    liste.innerHTML = '<div style="color:var(--accent2);font-size:0.82rem">Yüklenemedi: ' + e.message + '</div>';
  }
}

function arkadasMesajAt(uid, isim, renk) {
  activeChat = uid;
  showPage('messages');
}

function arkadasHediyeGonder(uid, isim) {
  // Önce tüm açık modalları kapat
  const existing = document.getElementById('arkadaProfilModal');
  if (existing) existing.remove();

  // _mModal yoksa oluştur
  let modal = document.getElementById('_mModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = '_mModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:none;align-items:center;justify-content:center;padding:16px';
    modal.onclick = (e) => { if(e.target===modal) modal.style.display='none'; };
    document.body.appendChild(modal);
  }

  const satin = window.currentUserData?.satin_alinanlar || [];
  const hediyeTipleri = ['hediye','hediye_sans','hediye_mesaj','hediye_boost','meydan'];
  const urunler = window.MARKET_URUNLER || {};

  const stok = {};
  satin.forEach(id => {
    const u = urunler[id];
    if (u && hediyeTipleri.includes(u.tip)) {
      stok[id] = (stok[id] || 0) + 1;
    }
  });

  if (!Object.keys(stok).length) {
    modal.style.display = 'flex';
    modal.innerHTML = `<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;text-align:center">
      <div style="font-size:2.5rem;margin-bottom:8px">🎁</div>
      <div style="font-weight:900;font-size:1rem;margin-bottom:6px">Hediye Yok</div>
      <div style="font-size:.8rem;color:var(--text2);margin-bottom:14px">Önce marketten hediye satın alman gerekiyor.</div>
      <button onclick="var m=document.getElementById('_mModal');if(m)m.style.display='none';window._mKat='sosyal';showPage('market')" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px">🛒 Markete Git</button>
      <button onclick="var m=document.getElementById('_mModal');if(m)m.style.display='none'" style="background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;font-family:inherit">Kapat</button>
    </div>`;
    return;
  }

  const hediyeListesi = Object.entries(stok).map(([id, adet]) => {
    const u = urunler[id];
    const gIsim = isim.replace(/'/g,"\'");
    return `<button onclick="_mHediyeGonderKisi('${id}','${uid}','${gIsim}');var m=document.getElementById('_mModal');if(m)m.style.display='none'"
      style="width:100%;padding:10px 14px;background:var(--surface2);border:none;border-radius:10px;cursor:pointer;font-size:.82rem;font-weight:700;color:var(--text);text-align:left;font-family:inherit;margin-bottom:6px;display:flex;align-items:center;gap:8px">
      <span style="font-size:1.2rem">${u.ikon}</span>
      <span style="flex:1">${u.ad}</span>
      <span style="background:var(--accent);color:white;border-radius:99px;padding:2px 8px;font-size:.72rem">${adet} adet</span>
    </button>`;
  }).join('');

  modal.style.display = 'flex';
  modal.innerHTML = `<div onclick="event.stopPropagation()" style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;max-width:290px;width:88%;max-height:75vh;overflow-y:auto">
    <div style="font-size:1.8rem;text-align:center;margin-bottom:6px">🎁</div>
    <div style="font-weight:900;font-size:1rem;text-align:center;margin-bottom:4px">${isim}'e Hediye Gönder</div>
    <div style="font-size:.75rem;color:var(--text2);text-align:center;margin-bottom:14px">Hangi hediyeyi gönderiyorsun?</div>
    ${hediyeListesi}
    <button onclick="var m=document.getElementById('_mModal');if(m)m.style.display='none'" style="width:100%;background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;margin-top:8px;font-family:inherit">Kapat</button>
  </div>`;
}

function arkadasProfil(uid, isim, renk, foto, etiket) {
  const existing = document.getElementById('arkadaProfilModal');
  if (existing) existing.remove();
  const etiketHTML = _etiketHTML(etiket||"");

  const avatarHTML = foto
    ? `<img src="${foto}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block">`
    : `<div style="width:80px;height:80px;border-radius:50%;background:${renk}22;color:${renk};display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;margin:0 auto 12px">${isim[0]}</div>`;

  // Engel durumunu kontrol et
  const engelliListe = JSON.parse(localStorage.getItem('engelliList') || '[]');
  const engelli = engelliListe.includes(uid);

  const modal = document.createElement('div');
  modal.id = 'arkadaProfilModal';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal" style="max-width:340px;text-align:center;padding:24px 20px">
      ${avatarHTML}
      <div style="font-size:1.2rem;font-weight:900;margin-bottom:4px">${isim}${etiketHTML}</div>
      <div style="font-size:0.82rem;color:var(--accent);font-weight:600;margin-bottom:16px">🏫 Okul Arkadaşı</div>

      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button class="btn btn-primary" style="flex:1;font-size:0.85rem;padding:10px 0"
          onclick="document.getElementById('arkadaProfilModal').remove();arkadasMesajAt('${uid}','${isim}','${renk}')">
          💬 Mesaj Gönder
        </button>
      </div>

      <!-- Sekmeler -->
      <div style="display:flex;border-bottom:2px solid var(--border);margin-bottom:12px" id="apTabs">
        <button onclick="_apSekme('bilgi')" id="apTab_bilgi" style="flex:1;padding:8px 0;font-size:0.85rem;font-weight:700;border:none;background:transparent;cursor:pointer;border-bottom:2px solid var(--accent);color:var(--accent);margin-bottom:-2px">📋 Bilgi</button>
        <button onclick="_apSekme('rozetler')" id="apTab_rozetler" style="flex:1;padding:8px 0;font-size:0.85rem;font-weight:700;border:none;background:transparent;cursor:pointer;border-bottom:2px solid transparent;color:var(--text2);margin-bottom:-2px">🏆 Rozetler</button>
      </div>

      <!-- Bilgi sekmesi -->
      <div id="apPanel_bilgi">
        <div id="apBilgiIcerik" style="text-align:left;font-size:0.88rem;color:var(--text2);padding:4px 0">
          Yükleniyor...
        </div>
      </div>

      <!-- Rozetler sekmesi -->
      <div id="apPanel_rozetler" style="display:none">
        <div id="apRozetIcerik" style="padding:4px 0">
          Yükleniyor...
        </div>
      </div>

      <!-- Engelle / Engeli Kaldır -->
      <button id="apEngelBtn" onclick="_apEngelToggle('${uid}','${isim}')"
        style="width:100%;margin-top:14px;padding:10px;border-radius:12px;border:1.5px solid ${engelli ? 'var(--accent3)' : '#ff6584'};background:transparent;color:${engelli ? 'var(--accent3)' : '#ff6584'};font-weight:700;font-size:0.82rem;cursor:pointer">
        ${engelli ? '✅ Engeli Kaldır' : '🚫 Engelle'}
      </button>

      <button class="btn btn-outline" style="width:100%;margin-top:8px"
        onclick="document.getElementById('arkadaProfilModal').remove()">
        Kapat
      </button>
    </div>
  `;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);

  // Bilgi yükle
  _apBilgiYukle(uid);
  // Rozetler yükle
  _apRozetYukle(uid);
}

// Sekme değiştirme
function _apSekme(tab) {
  ['bilgi','rozetler'].forEach(t => {
    const panel = document.getElementById('apPanel_' + t);
    const btn = document.getElementById('apTab_' + t);
    if (panel) panel.style.display = t === tab ? 'block' : 'none';
    if (btn) {
      btn.style.borderBottomColor = t === tab ? 'var(--accent)' : 'transparent';
      btn.style.color = t === tab ? 'var(--accent)' : 'var(--text2)';
    }
  });
}

// Bilgi yükle
async function _apBilgiYukle(uid) {
  const el = document.getElementById('apBilgiIcerik');
  if (!el) return;
  try {
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) { el.innerHTML = '<span style="color:var(--text2)">Bilgi bulunamadı.</span>'; return; }
    const d = snap.data();
    const satirlar = [];
    if (d.school) satirlar.push(`<div style="margin-bottom:6px">🏫 <strong>Okul:</strong> ${d.school}</div>`);
    if (d.classroom) satirlar.push(`<div style="margin-bottom:6px">📚 <strong>Sınıf:</strong> ${d.classroom}</div>`);
    el.innerHTML = satirlar.length > 0 ? satirlar.join('') : '<span style="color:var(--text2)">Bilgi eklenmemiş.</span>';
  } catch(e) {
    el.innerHTML = '<span style="color:var(--text2)">Bilgi yüklenemedi.</span>';
  }
}

// Rozetler yükle
async function _apRozetYukle(uid) {
  const el = document.getElementById('apRozetIcerik');
  if (!el) return;
  el.innerHTML = '<div style="color:var(--text2);font-size:0.82rem;padding:8px 0">Yükleniyor...</div>';
  try {
    if (typeof getBadges !== 'function' || typeof BADGES === 'undefined') {
      el.innerHTML = '<span style="color:var(--text2);font-size:0.82rem">Rozet sistemi yüklenemedi.</span>';
      return;
    }
    const earnedIds = await getBadges(uid);
    if (!earnedIds || earnedIds.length === 0) {
      el.innerHTML = '<div style="color:var(--text2);font-size:0.82rem;padding:8px 0">Henüz rozet kazanılmamış.</div>';
      return;
    }
    // ID listesinden BADGES dizisindeki rozet objelerini bul
    const earnedBadges = earnedIds.map(id => BADGES.find(b => b.id === id)).filter(Boolean);
    if (earnedBadges.length === 0) {
      el.innerHTML = '<div style="color:var(--text2);font-size:0.82rem;padding:8px 0">Henüz rozet kazanılmamış.</div>';
      return;
    }
    el.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">' +
      earnedBadges.slice(0, 12).map(b => `<div style="text-align:center;width:60px" title="${b.desc || ''}">
        <div style="display:flex;justify-content:center">${typeof getBadgeHTML === 'function' ? getBadgeHTML(b, false, 40) : '<span style="font-size:1.6rem">' + (b.sym || '🏅') + '</span>'}</div>
        <div style="font-size:0.58rem;color:var(--text2);font-weight:600;line-height:1.2;margin-top:2px">${b.name}</div>
      </div>`).join('') + '</div>' +
      (earnedBadges.length > 12 ? `<div style="text-align:center;font-size:0.75rem;color:var(--accent);margin-top:8px;font-weight:700">+${earnedBadges.length - 12} rozet daha</div>` : '');
  } catch(e) {
    el.innerHTML = '<span style="color:var(--text2);font-size:0.82rem">Rozetler yüklenemedi.</span>';
  }
}

// Engelle / Engeli Kaldır toggle
function _apEngelToggle(uid, isim) {
  const liste = JSON.parse(localStorage.getItem('engelliList') || '[]');
  const idx = liste.indexOf(uid);
  if (idx === -1) {
    liste.push(uid);
    localStorage.setItem('engelliList', JSON.stringify(liste));
    showToast('🚫', isim + ' engellendi. Mesajları artık gelmeyecek.');
  } else {
    liste.splice(idx, 1);
    localStorage.setItem('engelliList', JSON.stringify(liste));
    showToast('✅', isim + ' engeli kaldırıldı.');
  }
  // Buton güncelle
  const btn = document.getElementById('apEngelBtn');
  if (btn) {
    const yeniEngelli = liste.includes(uid);
    btn.innerHTML = yeniEngelli ? '✅ Engeli Kaldır' : '🚫 Engelle';
    btn.style.borderColor = yeniEngelli ? 'var(--accent3)' : '#ff6584';
    btn.style.color = yeniEngelli ? 'var(--accent3)' : '#ff6584';
  }
}


// ── Koç Okul Yönetimi ────────────────────────────────────────
async function teacherOkulEkle() {
  const input = document.getElementById('newSchoolInput');
  const okul = input?.value?.trim();
  if (!okul) { showToast('⚠️', 'Okul adı girin'); return; }

  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const mevcutOkullar = window.currentUserData?.schools || [];
  if (mevcutOkullar.includes(okul)) { showToast('⚠️', 'Bu okul zaten ekli'); return; }

  const yeniOkullar = [...mevcutOkullar, okul];
  try {
    await db.collection('users').doc(uid).update({ schools: yeniOkullar });
    window.currentUserData.schools = yeniOkullar;
    input.value = '';
    showToast('✅', `"${okul}" eklendi`);
    showPage('profile');
  } catch(e) { showToast('❌', 'Kaydedilemedi: ' + e.message); }
}

async function teacherOkulSil(idx) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const mevcutOkullar = [...(window.currentUserData?.schools || [])];
  const silinen = mevcutOkullar[idx];
  mevcutOkullar.splice(idx, 1);

  try {
    await db.collection('users').doc(uid).update({ schools: mevcutOkullar });
    window.currentUserData.schools = mevcutOkullar;
    showToast('✅', `"${silinen}" kaldırıldı`);
    showPage('profile');
  } catch(e) { showToast('❌', 'Kaydedilemedi: ' + e.message); }
}


// Deneme soru limiti kontrolü
function denemeSoruKontrol(ders) {
  const limler = {
    'Türkçe':20,'Matematik':20,'Fen Bilimleri':20,
    'İnkılap Tarihi':10,'Din Kültürü':10,'İngilizce':10
  };
  const max = limler[ders] || 20;
  const dEl = document.getElementById('deneme_d_' + ders);
  const yEl = document.getElementById('deneme_y_' + ders);
  if (!dEl || !yEl) return;

  const d = parseInt(dEl.value) || 0;
  const y = parseInt(yEl.value) || 0;
  const toplam = d + y;

  // Toplam max'ı aşıyorsa kırmızı yap
  const asim = toplam > max;
  dEl.style.borderColor = asim ? '#E24B4A' : '';
  yEl.style.borderColor = asim ? '#E24B4A' : '';
  dEl.style.color = asim ? '#E24B4A' : '';
  yEl.style.color = asim ? '#E24B4A' : '';

  // Kaydet butonunu devre dışı bırak
  const kaydetBtn = document.querySelector('#addEntryModal .btn-primary');
  if (!kaydetBtn) return;

  // Tüm derslerde kontrol et
  const tumLimler = {
    'Türkçe':20,'Matematik':20,'Fen Bilimleri':20,
    'İnkılap Tarihi':10,'Din Kültürü':10,'İngilizce':10
  };
  let herhangiAsim = false;
  Object.entries(tumLimler).forEach(([d2, m]) => {
    const dI = document.getElementById('deneme_d_' + d2);
    const yI = document.getElementById('deneme_y_' + d2);
    if (!dI || !yI) return;
    if ((parseInt(dI.value)||0) + (parseInt(yI.value)||0) > m) herhangiAsim = true;
  });

  if (herhangiAsim) {
    kaydetBtn.disabled = true;
    kaydetBtn.style.opacity = '0.5';
    kaydetBtn.title = 'Soru sayısı limiti aşıldı!';
    showToast('⚠️', `${ders} denemede en fazla ${max} soru olabilir!`);
  } else {
    kaydetBtn.disabled = false;
    kaydetBtn.style.opacity = '';
    kaydetBtn.title = '';
  }
}

async function profilePage() {
  const user = auth.currentUser;
  const name = document.getElementById('menuName')?.textContent;
  const data = window.currentUserData || {};
  const isTeacher = currentRole === 'teacher';
  const roleLabel = isTeacher ? 'Koç Öğretmen' : '8. Sınıf Öğrencisi';
  const photoHTML = data.photo
    ? `<img src="${data.photo}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block">`
    : `<div class="avatar" style="width:72px;height:72px;font-size:1.8rem;margin:0 auto 12px">${name[0].toUpperCase()}</div>`;
  return `
    <div class="page-title">👤 Profilim</div>
    <div class="page-sub">Hesap bilgileri ve ayarlar</div>
    <div class="card" style="text-align:center;padding:32px 20px">
      ${photoHTML}
      <div style="font-size:1.2rem;font-weight:800;margin-bottom:4px">${name}</div>
      <div style="color:var(--accent);font-size:0.88rem;font-weight:600">${roleLabel}</div>
      <div style="color:var(--text2);font-size:0.82rem;margin-top:4px">${user ? user.email : ''}</div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:14px;flex-wrap:wrap">
        <label style="cursor:pointer">
          <span class="btn btn-outline" style="font-size:0.82rem;padding:8px 18px;display:flex;align-items:center;gap:6px">
            <span>📷</span><span>Fotoğraf Değiştir</span>
          </span>
          <input type="file" accept="image/*" style="display:none" onchange="uploadPhoto(this)">
        </label>
        ${data.photo ? `
        <button onclick="removePhoto()" style="padding:8px 18px;border-radius:10px;border:1.5px solid #ff658444;background:#ff658412;color:#ff6584;font-size:0.82rem;cursor:pointer;display:flex;align-items:center;gap:6px">
          <span>✕</span><span>Kaldır</span>
        </button>` : ''}
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div onclick="const p=document.getElementById('bilgiDuzenlePanel');p.style.display=p.style.display==='none'?'block':'none';this.querySelector('.bd-arrow').style.transform=p.style.display==='block'?'rotate(180deg)':'rotate(0deg)'"
        style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none">
        <div class="card-title" style="margin-bottom:0">✏️ Bilgilerimi Düzenle</div>
        <span class="bd-arrow" style="color:var(--text2);font-size:1.1rem;transition:transform 0.2s">▼</span>
      </div>
      <div id="bilgiDuzenlePanel" style="display:none;margin-top:14px">
      <div class="form-group">
        <label class="form-label">Ad Soyad</label>
        <input class="form-input" type="text" id="profileName" value="${name}">
      </div>
      ${isTeacher ? `
      <div class="form-group">
        <label class="form-label">Branş</label>
        <select class="form-select" id="profileBranch">
          ${['Matematik','Türkçe','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce','Sınıf Öğretmeni','Diğer'].map(b=>`<option ${data.branch===b?'selected':''}>${b}</option>`).join('')}
        </select>
      </div>

      ` : `
      <div class="form-group">
        <label class="form-label">Okul</label>
        <input class="form-input" type="text" id="profileSchool" value="${data.school||''}" readonly style="opacity:0.6">
      </div>
      <div class="form-group">
        <label class="form-label">Sınıf Kademesi</label>
        <button type="button" onclick="openKademePicker()" style="width:100%;padding:12px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);text-align:left;cursor:pointer;font-size:0.92rem;display:flex;align-items:center;justify-content:space-between">
          <span id="kademeLabel">${(()=>{const c=data.classroom||'8';const n=c.match(/\d+/)?.[0]||'8';return n+'. Sınıf';})()}</span>
          <span style="color:var(--text2)">▼</span>
        </button>
        <input type="hidden" id="profileClass" value="${(data.classroom||'8').match(/\d+/)?.[0]||'8'}">
      </div>
      `}
      <div id="profileError" style="color:#ff6584;font-size:0.82rem;margin-bottom:8px;display:none"></div>
      <button class="btn btn-primary" style="width:100%" onclick="saveProfile()">Kaydet ✓</button>
      </div>
    </div>
    ${isTeacher ? `
    <div class="card" style="margin-top:16px">
      <div class="card-title">🏫 Çalıştığım Okullar</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:12px">Öğrenci eklerken bu okullardan seçim yapılır</div>
      <div id="teacherSchoolList" style="margin-bottom:12px">
        ${(data.schools||[]).length === 0
          ? '<div style="color:var(--text2);font-size:0.82rem;padding:8px 0">Henüz okul eklenmedi</div>'
          : (data.schools||[]).map((s,i) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--surface2);border-radius:8px;margin-bottom:6px">
              <span style="font-size:0.88rem">🏫 ${s}</span>
              <button onclick="teacherOkulSil(${i})" style="background:none;border:none;color:#ff6584;cursor:pointer;font-size:0.8rem;padding:2px 6px">✕ Kaldır</button>
            </div>`).join('')
        }
      </div>
      <div style="display:flex;gap:8px">
        <input class="form-input" type="text" id="newSchoolInput" placeholder="Okul adı girin..." style="flex:1">
        <button class="btn btn-primary" onclick="teacherOkulEkle()" style="white-space:nowrap">+ Ekle</button>
      </div>
    </div>
    <div class="card" style="margin-top:16px;border:1.5px solid #6c63ff33">
      <div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.api-arrow\').style.transform=this.nextElementSibling.style.display===\'block\'?\'rotate(180deg)\':\'rotate(0deg)\'"
        style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:2px 0;user-select:none">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.3rem">🤖</span>
          <div>
            <div class="card-title" style="margin-bottom:0">Claude AI Rapor Analizi</div>
            <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Psikolojik raporlarda yapay zeka yorumlaması</div>
          </div>
        </div>
        <span class="api-arrow" style="color:var(--text2);transition:transform 0.2s;font-size:0.8rem">▼</span>
      </div>
      <div style="display:none">
        <div style="height:1px;background:var(--border);margin:14px 0"></div>
        <div style="background:#6c63ff12;border-radius:10px;padding:12px;margin-bottom:14px;font-size:0.8rem;color:var(--text2);line-height:1.6">
          API anahtarı girdiğinde korelasyon analizi Claude AI tarafından yazılır. Kriz günleri, öğrencinin ifadeleri ve çelişkili veriler klinik dille yorumlanır.<br>
          <span style="color:#ff6584">⚠ Anahtarı kimseyle paylaşma. GitHub\'a push etmeden önce temizle.</span>
        </div>
        <div class="form-group">
          <label class="form-label">Anthropic API Anahtarı</label>
          <div style="position:relative">
            <input class="form-input" type="password" id="apiKeyInput"
              placeholder="sk-ant-api03-..."
              style="padding-right:48px;font-family:monospace;font-size:0.82rem">
            <button type="button" onclick="toggleApiKeyVis()"
              style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1rem;color:var(--text2)">👁</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.85rem;color:var(--text)">
            <input type="checkbox" id="apiEnabled" style="width:18px;height:18px;accent-color:#6c63ff;cursor:pointer">
            AI analizini aktif et
          </label>
          <span id="apiStatusBadge" style="font-size:0.72rem;padding:2px 8px;border-radius:20px;font-weight:700;background:#ff658422;color:#ff6584">KAPALI</span>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary" style="flex:1" onclick="saveApiSettings()">Kaydet ✓</button>
          <button type="button" class="btn btn-outline" style="padding:10px 14px;font-size:0.8rem" onclick="testApiKey()">Test Et</button>
          <button type="button" onclick="clearApiKey()" style="padding:10px 14px;border-radius:10px;border:1.5px solid #ff658444;background:#ff658412;color:#ff6584;font-size:0.8rem;cursor:pointer">Sil</button>
        </div>
        <div id="apiTestResult" style="margin-top:10px;font-size:0.8rem;display:none"></div>
      </div>
    </div></div>` : ''}
    <div class="card" style="margin-top:16px">
      <div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';this.querySelector('.sifre-arrow').style.transform=this.nextElementSibling.style.display==='block'?'rotate(180deg)':'rotate(0deg)'"
        style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:2px 0;user-select:none">
        <span class="card-title" style="margin-bottom:0">🔒 Şifre Değiştir</span>
        <span class="sifre-arrow" style="color:var(--text2);transition:transform 0.2s;font-size:0.8rem">▼</span>
      </div>
      <div style="display:none">
        <div style="height:1px;background:var(--border);margin:14px 0"></div>
        <div class="form-group">
          <label class="form-label">Mevcut Şifre</label>
          <input class="form-input" type="password" id="currentPassword" placeholder="Mevcut şifrenizi girin">
        </div>
        <div class="form-group">
          <label class="form-label">Yeni Şifre</label>
          <input class="form-input" type="password" id="newPassword" placeholder="En az 6 karakter" oninput="checkPassMatch()">
        </div>
        <div class="form-group">
          <label class="form-label">Yeni Şifre (Tekrar)</label>
          <input class="form-input" type="password" id="newPassword2" placeholder="Şifreyi tekrar girin" oninput="checkPassMatch()">
          <div id="passMatchHint" style="font-size:0.78rem;margin-top:4px;display:none"></div>
        </div>
        <div id="passwordError" style="color:#ff6584;font-size:0.82rem;margin-bottom:8px;display:none"></div>
        <button class="btn btn-outline" style="width:100%" onclick="changePassword()">Şifreyi Güncelle</button>
      </div>
    </div>

    ${!isTeacher ? `
    <div class="card" style="margin-top:16px">
      <button class="btn btn-primary" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px"
        onclick="showBadgesPage()">
        🏆 <span>Rozetlerim</span>
        <span id="badgeCountBadge" style="background:#f9ca24;color:#222;border-radius:20px;padding:2px 10px;font-size:0.78rem;font-weight:800"></span>
      </button>
    </div>
    <div class="card" style="margin-top:16px" id="okul-arkadaslar-kart">
      <div class="card-title">🏫 Okul Arkadaşlarım</div>
      <div id="okul-arkadaslar-liste" style="color:var(--text2);font-size:0.85rem">Yükleniyor...</div>
    </div>
    ` : ''}
  `;
}

// Rozet sayfasını göster
async function showBadgesPage() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const el = document.getElementById('mainContent');
  el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">🏆 Yükleniyor...</div>';
  el.innerHTML = await badgesPageHTML(uid);
  // Çerçeveyi uygula
  applyProfileFrame(uid, getActiveFrame(uid));
}


function _wellnessDateGuard() {
  const todayKey = getTodayKey();
  const myUid = (window.currentUserData||{}).uid || 'local';
  const storageKey = 'wellness_' + myUid;
  let data = {};
  try { data = JSON.parse(localStorage.getItem(storageKey)||'{}'); } catch(e){}
  const today = data.days?.[todayKey] || {};
  const hasToday = Object.keys(today).length > 0;

  if (!hasToday) {
    // Bugüne ait veri yok — tüm inputları sıfırla
    const resetIds = [
      'wellnessEnerji','wellnessOdak','wellnessKaygi',
      'wellnessUyku','wellnessEkranOnline','wellnessEkranSosyal',
      'wellnessKelime','wellnessGurur','wellnessNegatif',
      'wellnessPozitif','wellnessNot'
    ];
    resetIds.forEach(id=>{
      const el = document.getElementById(id);
      if (!el) return;
      if (el.type==='range') {
        // Slider'ları default değere sıfırla
        if (id==='wellnessEnerji'||id==='wellnessOdak') el.value=5;
        else if (id==='wellnessKaygi') el.value=5;
        else el.value=0;
        // Yanındaki sayı göstergesini güncelle
        if (el.nextElementSibling) el.nextElementSibling.textContent = el.value;
      } else {
        el.value = '';
      }
    });
    // Mood butonlarını temizle
    document.querySelectorAll('[data-mood-selected]').forEach(btn=>{
      delete btn.dataset.moodSelected;
      btn.style.border='2px solid var(--border)';
      btn.style.background='transparent';
    });
    // uykuKalite ve su butonlarını temizle
    document.querySelectorAll('[data-uykukalite-selected],[data-su-selected]').forEach(btn=>{
      btn.style.border='2px solid var(--border)';
      btn.style.background='transparent';
    });
  }
}

async function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  const errEl = document.getElementById('profileError');
  errEl.style.display = 'none';
  if (!name) { errEl.textContent = 'İsim boş olamaz.'; errEl.style.display='block'; return; }
  const user = auth.currentUser;
  if (user) {
    const updates = { name };
    if (currentRole === 'teacher') {
      updates.branch = document.getElementById('profileBranch').value;
      // school: Çalıştığım Okullar kartından ayrıca yönetiliyor
      // schools array yoksa başlat
      if (!window.currentUserData?.schools) updates.schools = [];
    } else {
      updates.classroom = document.getElementById('profileClass').value + '. Sınıf';
    }
    await db.collection('users').doc(user.uid).update(updates);
    window.currentUserData = {...(window.currentUserData||{}), ...updates};
    document.getElementById('menuName') && (document.getElementById('menuName').textContent = name);
    document.getElementById('headerAvatar').textContent = (window.currentUserData.photo) ? '' : name[0].toUpperCase();
    const roleLabel = currentRole==='teacher'
      ? `Koç Öğretmen${updates.branch?' • '+updates.branch:''}`
      : `${updates.classroom||''} • ${window.currentUserData.school||''}`;
    document.getElementById('menuRole') && (document.getElementById('menuRole').textContent = roleLabel);
    showToast('✅', 'Profil güncellendi!');
    showPage('profile');
  }
}

function openKademePickerFor(inputId, labelId) {
  const mevcut = document.getElementById(inputId)?.value || '8';
  const kademe = ['7','8'];
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display:flex;align-items:flex-end;z-index:9999';
  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:18px 18px 0 0;width:100%;padding:20px;max-height:60vh;overflow-y:auto">
      <div style="font-size:1rem;font-weight:700;margin-bottom:16px;text-align:center">Sınıf Kademesi Seç</div>
      ${kademe.map(k=>`
        <div onclick="secKademeFor('${k}','${inputId}','${labelId}',this.closest('.modal-overlay'))"
          style="padding:16px 20px;border-radius:12px;margin-bottom:8px;cursor:pointer;
          background:${k===mevcut?'var(--accent)22':'var(--surface2)'};
          border:1.5px solid ${k===mevcut?'var(--accent)':'var(--border)'};
          display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:1.1rem;font-weight:${k===mevcut?'700':'400'}">${k}. Sınıf</span>
          ${k===mevcut?`<span style="color:var(--accent);font-size:1.2rem">✓</span>`:''}
        </div>`).join('')}
      <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="this.closest('.modal-overlay').remove()">İptal</button>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
}

function secKademeFor(k, inputId, labelId, modalEl) {
  const inp = document.getElementById(inputId);
  const lbl = document.getElementById(labelId);
  if(inp) inp.value = k;
  if(lbl) lbl.textContent = k + '. Sınıf';
  modalEl?.remove();
}

function openKademePicker() {
  openKademePickerFor('profileClass','kademeLabel');
}

function secKademe(k) {
  secKademeFor(k,'profileClass','kademeLabel', document.querySelector('.modal-overlay:last-child'));
}

function checkPassMatch() {
  const p1 = document.getElementById('newPassword')?.value || '';
  const p2 = document.getElementById('newPassword2')?.value || '';
  const hint = document.getElementById('passMatchHint');
  if(!hint) return;
  if(!p1 || !p2) { hint.style.display='none'; return; }
  hint.style.display = 'block';
  if(p1 === p2) {
    hint.textContent = '✅ Şifreler eşleşiyor';
    hint.style.color = '#43e97b';
  } else {
    hint.textContent = '❌ Şifreler eşleşmiyor';
    hint.style.color = '#ff6584';
  }
}

async function changePassword() {
  const current = document.getElementById('currentPassword')?.value || '';
  const pass1   = document.getElementById('newPassword')?.value || '';
  const pass2   = document.getElementById('newPassword2')?.value || '';
  const errEl   = document.getElementById('passwordError');
  errEl.style.display = 'none';

  if (!current) { errEl.textContent = 'Mevcut şifrenizi girin.'; errEl.style.display='block'; return; }
  if (pass1.length < 6) { errEl.textContent = 'Yeni şifre en az 6 karakter olmalı.'; errEl.style.display='block'; return; }
  if (pass1 !== pass2) { errEl.textContent = 'Yeni şifreler eşleşmiyor.'; errEl.style.display='block'; return; }

  try {
    const user = auth.currentUser;
    // Önce mevcut şifre ile yeniden kimlik doğrula
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, current);
    await user.reauthenticateWithCredential(cred);
    await user.updatePassword(pass1);
    showToast('✅', 'Şifre güncellendi!');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newPassword2').value = '';
    document.getElementById('passMatchHint').style.display = 'none';
  } catch(e) {
    if(e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
      errEl.textContent = 'Mevcut şifre yanlış.';
    } else {
      errEl.textContent = 'Hata: ' + (e.message||'Tekrar giriş yapıp deneyin.');
    }
    errEl.style.display = 'block';
  }
}

