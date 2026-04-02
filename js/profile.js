
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
            <div style="font-weight:800;font-size:0.9rem">${isim}</div>
            <div style="font-size:0.72rem;color:var(--text2);margin-top:1px">${a.classroom||''} ${a.school||''}</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button onclick="arkadasMesajAt('${a.uid}','${isim}','${renk}')"
              style="background:var(--accent)15;color:var(--accent);border:1px solid var(--accent)44;border-radius:8px;padding:5px 10px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">
              💬
            </button>
            <button onclick="arkadasProfilGoster('${a.uid}','${isim}','${renk}','${a.photo||''}')"
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

function arkadasProfil(uid, isim, renk, foto) {
  const existing = document.getElementById('arkadaProfilModal');
  if (existing) existing.remove();

  const avatarHTML = foto
    ? `<img src="${foto}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block">`
    : `<div style="width:80px;height:80px;border-radius:50%;background:${renk}22;color:${renk};display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;margin:0 auto 12px">${isim[0]}</div>`;

  const modal = document.createElement('div');
  modal.id = 'arkadaProfilModal';
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal" style="max-width:320px;text-align:center">
      ${avatarHTML}
      <div style="font-size:1.2rem;font-weight:900;margin-bottom:4px">${isim}</div>
      <div style="font-size:0.82rem;color:var(--text2);margin-bottom:20px">🏫 Okul Arkadaşı</div>
      <button class="btn btn-primary" style="width:100%;margin-bottom:8px"
        onclick="document.getElementById('arkadaProfilModal').remove();arkadasMesajAt('${uid}','${isim}','${renk}')">
        💬 Mesaj Gönder
      </button>
      <button class="btn btn-outline" style="width:100%;margin-bottom:8px"
        onclick="document.getElementById('arkadaProfilModal').remove();setTimeout(()=>arkadasHediyeGonder('${uid}','${isim}'),100)">
        🎁 Hediye Gönder
      </button>
      <button class="btn btn-outline" style="width:100%"
        onclick="document.getElementById('arkadaProfilModal').remove()">
        Kapat
      </button>
    </div>
  `;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}


// ── Hediye Gönder ────────────────────────────────────────────
function arkadasHediyeGonder(uid, isim) {
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

  // Stoğu say
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
      <button onclick="document.getElementById('_mModal').style.display='none';window._mKat='sosyal';showPage('market')" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--accent);color:white;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px">🛒 Markete Git</button>
      <button onclick="document.getElementById('_mModal').style.display='none'" style="background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;font-family:inherit">Kapat</button>
    </div>`;
    return;
  }

  const hediyeListesi = Object.entries(stok).map(([id, adet]) => {
    const u = urunler[id];
    return `<button onclick="_mHediyeGonderKisi('${id}','${uid}','${isim.replace(/'/g,"\'")}');document.getElementById('_mModal').style.display='none'"
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
    <button onclick="document.getElementById('_mModal').style.display='none'" style="width:100%;background:transparent;border:none;color:var(--text2);font-size:.8rem;cursor:pointer;margin-top:8px;font-family:inherit">Kapat</button>
  </div>`;
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
      <div class="card-title">✏️ Bilgilerimi Düzenle</div>
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
    <div class="card" style="margin-top:0">
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

// ========== FOTOĞRAF KIRPMA SİSTEMİ ==========
const _crop = {
  img: null, canvas: null, ctx: null,
  x: 0, y: 0, scale: 1,
  drag: false, lastX: 0, lastY: 0,
  size: 280, // canvas boyutu (px)
  imgNatW: 0, imgNatH: 0,
};

function uploadPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('⚠️','Lütfen bir görsel seçin!'); return; }

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      _crop.img = img;
      _crop.imgNatW = img.naturalWidth;
      _crop.imgNatH = img.naturalHeight;
      // Başlangıç: resmi kare alana sığdır, ortala
      const S = _crop.size;
      const fit = Math.max(S / img.naturalWidth, S / img.naturalHeight);
      _crop.scale = fit;
      _crop.x = (S - img.naturalWidth * fit) / 2;
      _crop.y = (S - img.naturalHeight * fit) / 2;
      openCropModal();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  input.value = ''; // sıfırla
}

function openCropModal() {
  openModal('cropModal');
  requestAnimationFrame(() => {
    const canvas = document.getElementById('cropCanvas');
    if (!canvas) return;
    const S = _crop.size;
    canvas.width = S; canvas.height = S;
    canvas.style.width = '100%'; canvas.style.height = 'auto';
    _crop.canvas = canvas;
    _crop.ctx = canvas.getContext('2d');
    drawCropPreview();
    // Mouse events
    canvas.onmousedown = (e)=>{ _crop.drag=true; _crop.lastX=e.clientX; _crop.lastY=e.clientY; };
    canvas.onmousemove = (e)=>{ if(!_crop.drag) return; cropMove(e.clientX-_crop.lastX, e.clientY-_crop.lastY); _crop.lastX=e.clientX; _crop.lastY=e.clientY; };
    canvas.onmouseup = ()=>{ _crop.drag=false; };
    // Touch events
    let lastDist = 0;
    canvas.ontouchstart = (e)=>{ e.preventDefault(); if(e.touches.length===1){ _crop.drag=true; _crop.lastX=e.touches[0].clientX; _crop.lastY=e.touches[0].clientY; } else if(e.touches.length===2){ lastDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); } };
    canvas.ontouchmove = (e)=>{ e.preventDefault(); if(e.touches.length===1 && _crop.drag){ const scale=canvas.offsetWidth?canvas.width/canvas.offsetWidth:1; cropMove((e.touches[0].clientX-_crop.lastX)*scale,(e.touches[0].clientY-_crop.lastY)*scale); _crop.lastX=e.touches[0].clientX; _crop.lastY=e.touches[0].clientY; } else if(e.touches.length===2){ const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); cropZoom((d-lastDist)*0.005); lastDist=d; } };
    canvas.ontouchend = ()=>{ _crop.drag=false; };
  });
}

function cropMove(dx, dy) {
  _crop.x += dx; _crop.y += dy;
  clampCrop();
  drawCropPreview();
}

function cropZoom(delta) {
  const S = _crop.size;
  const newScale = Math.max(0.2, Math.min(8, _crop.scale + delta));
  // Zoom around center
  const cx = S/2, cy = S/2;
  _crop.x = cx - (cx - _crop.x) * (newScale / _crop.scale);
  _crop.y = cy - (cy - _crop.y) * (newScale / _crop.scale);
  _crop.scale = newScale;
  clampCrop();
  drawCropPreview();
}

function clampCrop() {
  const S = _crop.size;
  const iw = _crop.imgNatW * _crop.scale;
  const ih = _crop.imgNatH * _crop.scale;
  if (iw >= S) { _crop.x = Math.min(0, Math.max(S-iw, _crop.x)); }
  else { _crop.x = Math.max(0, Math.min(S-iw, _crop.x)); }
  if (ih >= S) { _crop.y = Math.min(0, Math.max(S-ih, _crop.y)); }
  else { _crop.y = Math.max(0, Math.min(S-ih, _crop.y)); }
}

function drawCropPreview() {
  const { ctx, img, x, y, scale, size: S, imgNatW, imgNatH } = _crop;
  if (!ctx || !img) return;
  ctx.clearRect(0, 0, S, S);
  // Karartılmış arka plan
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, S, S);
  // Resim
  ctx.drawImage(img, x, y, imgNatW * scale, imgNatH * scale);
  // Kılavuz daire
  ctx.save();
  ctx.beginPath(); ctx.arc(S/2, S/2, S/2-2, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke();
  // Dışını karart
  ctx.beginPath(); ctx.rect(0,0,S,S); ctx.arc(S/2,S/2,S/2-2,0,Math.PI*2,true);
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
  ctx.restore();
  // Yardımcı çizgiler (ızgara)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 0.5;
  [1/3,2/3].forEach(f=>{ ctx.beginPath(); ctx.moveTo(S*f,0); ctx.lineTo(S*f,S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,S*f); ctx.lineTo(S,S*f); ctx.stroke(); });
}

async function saveCroppedPhoto() {
  const { ctx, img, x, y, scale, imgNatW, imgNatH, size: S } = _crop;
  if (!img) return;

  // Çıktı canvas — 400×400px (yüksek kalite profil)
  const OUT = 400;
  const outCanvas = document.createElement('canvas');
  outCanvas.width = OUT; outCanvas.height = OUT;
  const outCtx = outCanvas.getContext('2d');

  // Daire kırpma maskesi
  outCtx.beginPath(); outCtx.arc(OUT/2, OUT/2, OUT/2, 0, Math.PI*2); outCtx.clip();

  // Kırpma alanını orijinal koordinatlara çevir
  const srcX = -x / scale;
  const srcY = -y / scale;
  const srcW = S / scale;
  const srcH = S / scale;
  outCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUT, OUT);

  // Kalite ayarlı JPEG — max ~150KB hedef
  let quality = 0.85;
  let dataUrl = outCanvas.toDataURL('image/jpeg', quality);
  // 500KB sınırı (base64 ~%33 şişer, 500KB * 0.75 ≈ 375KB base64)
  while (dataUrl.length > 500000 && quality > 0.3) {
    quality -= 0.1;
    dataUrl = outCanvas.toDataURL('image/jpeg', quality);
  }

  closeModal('cropModal');
  showToast('⏳','Fotoğraf yükleniyor...');

  const user = auth.currentUser;
  if (user) {
    await db.collection('users').doc(user.uid).update({ photo: dataUrl });
    window.currentUserData = {...(window.currentUserData||{}), photo: dataUrl};
    const av = document.getElementById('headerAvatar');
    if (av) { av.style.backgroundImage = `url(${dataUrl})`; av.style.backgroundSize = 'cover'; av.textContent = ''; }
    // Öğretmense öğrencilerin teacherPhoto'sunu güncelle
    if (currentRole === 'teacher' && students.length > 0) {
      students.forEach(s => { if (s.uid) db.collection('users').doc(s.uid).update({ teacherPhoto: dataUrl }).catch(()=>{}); });
    }
    students.forEach(s => { if (s.uid === user.uid) s.photo = dataUrl; });
    showToast('✅','Profil fotoğrafı güncellendi!');
    showPage('profile');
  }
}

async function removePhoto() {
  const user = auth.currentUser;
  if (!user) return;
  if (!confirm('Profil fotoğrafını kaldırmak istiyor musunuz?')) return;
  try {
    await db.collection('users').doc(user.uid).update({ photo: '' });
    window.currentUserData = {...(window.currentUserData||{}), photo: ''};
    // Header avatarı güncelle
    const ha = document.getElementById('headerAvatar');
    if (ha) {
      ha.style.backgroundImage = '';
      ha.textContent = (window.currentUserData.name||'?')[0].toUpperCase();
    }
    showToast('✅', 'Fotoğraf kaldırıldı.');
    showPage('profile');
  } catch(e) {
    showToast('❌', 'Hata: ' + e.message);
  }
}

async function uploadPhoto(input) {
  // Geriye dönük uyumluluk — artık cropModal üzerinden çalışıyor
  // ama input varsa doğrudan çağır
  const file = input?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('⚠️','Lütfen görsel seçin!'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      _crop.img = img; _crop.imgNatW = img.naturalWidth; _crop.imgNatH = img.naturalHeight;
      const fit = Math.max(_crop.size/img.naturalWidth, _crop.size/img.naturalHeight);
      _crop.scale = fit;
      _crop.x = (_crop.size - img.naturalWidth*fit)/2;
      _crop.y = (_crop.size - img.naturalHeight*fit)/2;
      openCropModal();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// ========== CLAUDE API YÖNETİMİ ==========

function toggleApiKeyVis() {
  const inp = document.getElementById('apiKeyInput');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

function initApiSettings() {
  const key  = localStorage.getItem('lgs_anthropic_key') || '';
  const enabled = localStorage.getItem('lgs_api_enabled') === 'true';
  const inp  = document.getElementById('apiKeyInput');
  const cb   = document.getElementById('apiEnabled');
  const badge= document.getElementById('apiStatusBadge');
  if (inp)  inp.value = key;
  if (cb)   cb.checked = enabled;
  if (badge) {
    badge.textContent = enabled ? 'AKTİF' : 'KAPALI';
    badge.style.background = enabled ? '#6c63ff22' : '#ff658422';
    badge.style.color = enabled ? '#6c63ff' : '#ff6584';
  }
}

function saveApiSettings() {
  const rawKey = document.getElementById('apiKeyInput')?.value || '';
  const key = rawKey.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '');
  const enabled = document.getElementById('apiEnabled')?.checked || false;
  if (key) localStorage.setItem('lgs_anthropic_key', key);
  localStorage.setItem('lgs_api_enabled', enabled ? 'true' : 'false');
  const badge = document.getElementById('apiStatusBadge');
  if (badge) {
    badge.textContent = enabled ? 'AKTİF' : 'KAPALI';
    badge.style.background = enabled ? '#6c63ff22' : '#ff658422';
    badge.style.color = enabled ? '#6c63ff' : '#ff6584';
  }
  showToast('✓', 'API ayarları kaydedildi');
}

async function testApiKey() {
  const rawKey = document.getElementById('apiKeyInput')?.value || localStorage.getItem('lgs_anthropic_key') || '';
  const key = rawKey.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '');
  const resultEl = document.getElementById('apiTestResult');
  resultEl.style.display = 'block';
  if (!key) { resultEl.style.color='#ff6584'; resultEl.textContent='Önce API anahtarı gir.'; return; }
  if (!key.startsWith('sk-ant')) { resultEl.style.color='#ff6584'; resultEl.textContent='Hata: Anahtar "sk-ant" ile başlamalı. Kopyalamayı kontrol et.'; return; }
  resultEl.style.color='var(--text2)'; resultEl.textContent='⏳ Test ediliyor... (anahtar: ...'+key.slice(-6)+')';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 20, messages: [{ role: 'user', content: 'Hi' }] })
    });
    const data = await res.json();
    if (data.content?.[0]?.text) {
      localStorage.setItem('lgs_anthropic_key', key);
      resultEl.style.color = '#20c864';
      resultEl.textContent = '✓ Bağlantı başarılı! API hazır ve kaydedildi.';
    } else {
      resultEl.style.color = '#ff6584';
      resultEl.textContent = '✗ Hata: ' + (data.error?.message || JSON.stringify(data));
    }
  } catch(e) {
    resultEl.style.color = '#ff6584';
    resultEl.textContent = '✗ Bağlantı hatası: ' + e.message;
  }
}

function clearApiKey() {
  localStorage.removeItem('lgs_anthropic_key');
  localStorage.setItem('lgs_api_enabled', 'false');
  const inp = document.getElementById('apiKeyInput');
  if (inp) inp.value = '';
  const badge = document.getElementById('apiStatusBadge');
  if (badge) { badge.textContent='KAPALI'; badge.style.background='#ff658422'; badge.style.color='#ff6584'; }
  const cb = document.getElementById('apiEnabled');
  if (cb) cb.checked = false;
  showToast('🗑', 'API anahtarı silindi');
}

async function generateAIAnalysis(studentName, period, wellnessData, academicData, denemeler, notlar) {
  const key = localStorage.getItem('lgs_anthropic_key');
  if (!key || localStorage.getItem('lgs_api_enabled') !== 'true') return null;

  const krizGunler = wellnessData.filter(d => (d.kaygi>=8) || (d.uyku>0&&d.uyku<6) || (!d.akademikVar&&d.kaygi>=7));
  const ogrSesi = notlar.filter(n => n.negatif || n.pozitif).slice(0, 5);

  const prompt = 'Sen LGSKoc psikolojik analiz motorusun. Klinik egitim kocu gozuyle analiz et.\n\n' +
    'OGRENCI: ' + studentName + '\n' +
    'DONEM: ' + (period==='daily'?'Gunluk':period==='weekly'?'Haftalik':'Aylik') + '\n\n' +
    'WELLNESS (son ' + wellnessData.length + ' gun):\n' +
    wellnessData.slice(0,14).map(d=>d.tarih+' Kaygi:'+d.kaygi+' Enerji:'+d.enerji+' Uyku:'+(d.uyku||0)+'sa Mood:'+(d.mood||'-')+' Soru:'+(d.soru||0)).join('\n') +
    '\n\nKRIZ GUNLERI (kaygi>=8 veya uyku<6 veya akademik felc):\n' +
    (krizGunler.length>0 ? krizGunler.map(d=>d.tarih+' Kaygi:'+(d.kaygi||0)+' Uyku:'+(d.uyku||'-')+'sa Soru:'+(d.soru||0)+(!d.akademikVar&&d.kaygi>=7?' [AKADEMIK FELC]':'')).join('\n') : 'Kriz gunu yok') +
    '\n\nGUNLUK SORU COZUMU (antrenman - deneme degil):\n' +
    'Toplam: ' + academicData.toplamSoru + ' soru, ' + academicData.aktifGun + ' aktif gun\n' +
    (academicData.ortIsabet!==null ? 'Genel isabet: %'+academicData.ortIsabet+'\n' : '') +
    (academicData.dersBazli&&academicData.dersBazli.length>0 ? 'Ders bazli: '+academicData.dersBazli.map(d=>d.d+':%'+d.isabet).join(' | ')+'\n' : '') +
    'NOT: Gunluk calisma kalitesini gosterir. LGS net hesabi degil.\n\n' +
    'DENEME SINAVI SONUCLARI (resmi olcme - ayri degerlendir):\n' +
    (denemeler.length>0 ? denemeler.map(d=>d.tarih+' | '+d.baslik+' | Toplam: '+d.toplamNet+' net | '+d.dersler).join('\n') : 'Bu donemde deneme yok') +
    '\nNOT: Ders doluluk oranlari farkli: Turkce/Mat/Fen=20soru, Inkilap/Ing/Din=10soru.\n\n' +
    'OGRENCININ SESI:\n' +
    (ogrSesi.length>0 ? ogrSesi.map(n=>n.tarih+':'+(n.pozitif?' (+)'+n.pozitif:'')+' '+(n.negatif?' (-)'+n.negatif:'')).join('\n') : 'Not yok') +
    '\n\nKURALLAR:\n' +
    '1. Kaygi>=7+Soru=0 = Amigdala Blokaji/Akademik Felc (asla dinlenme yazma)\n' +
    '2. Yuksek kaygi+yuksek enerji = Kirilgan Hiper-Aktivasyon (asla olumlu yazma)\n' +
    '3. Gunluk soru cozumu ile deneme sonuclarini karistirma, ikisini ayri yorumla\n' +
    '4. Deneme yorumunda ders doluluk oranini degerlendir\n' +
    '5. Kriz gunlerini tarih tarih adlandir\n' +
    '6. Maskelenmis kriz: ortalama iyi ama 3+ kriz gunu varsa uyar\n' +
    '7. Tum teshisleri TURKCE yaz, ingilizce klinik terim kullanma\n' +
    '8. Her bolum 2-3 cumle, sade\n\n' +
    'SADECE su JSON formatini don:\n' +
    '{"ana_tani":"En kritik 1 cumle","uyari_seviyesi":"yesil|sari|turuncu|kirmizi",' +
    '"kriz_gunleri":["tarih: sebep"],' +
    '"fizyolojik_yorum":"uyku/enerji/odak",' +
    '"duygusal_yorum":"kaygi+mood+brans kacisi",' +
    '"soru_cozumu_yorum":"gunluk antrenman kalitesi ve hafiza riski",' +
    '"deneme_yorum":"deneme sonuclari klinik yorum - ders doluluk dahil - bos birak veri yoksa",' +
    '"brans_riski":"en kritik brans ve gerekce",' +
    '"ogr_sesi_yorum":"ogrencinin kendi ifadelerinin klinik yorumu",' +
    '"koc_stratejisi":"1- 2- 3- seklinde acil eylem",' +
    '"hafiza_borcu":"kriz altinda calisilanlar icin tekrar onerileri"}';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 saniye timeout
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (!res.ok) {
      console.error('AI API hata:', res.status, data?.error?.message);
      return null;
    }
    const text = data.content?.[0]?.text || '';
    if (!text) { console.error('AI boş yanıt döndü:', JSON.stringify(data)); return null; }
    const clean = text.replace(/```json|```/g, '').trim();
    console.log('AI yanıtı (ilk 200):', clean.substring(0, 200));
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch(parseErr) {
      console.error('AI JSON parse hatası:', parseErr.message, '| Ham metin:', clean.substring(0, 300));
      return null;
    }
    // Post-process: İngilizce klinik terimleri Türkçeleştir
    const trTerms = {
      'avoidance through activity': 'çalışma görüntüsüyle kaçınma',
      'activity avoidance': 'aktiviteyle kaçınma',
      'avoidance': 'kaçınma',
      'over-compensation': 'aşırı telafi',
      'over compensation': 'aşırı telafi',
      'overcompensation': 'aşırı telafi',
      'denial': 'inkâr',
      'therapeutic denial': 'savunma amaçlı inkâr',
      'sanitization': 'olumsuzluğu önemsizleştirme',
      'dysregulation': 'düzensizlik',
      'dysregülasyon': 'düzensizlik',
      'bodyscan': 'beden tarama',
      'fragile': 'kırılgan',
      'resilience': 'psikolojik dayanıklılık',
      'burnout': 'tükenmişlik',
      'helplessness': 'çaresizlik hissi',
      'catastrophizing': 'felaketleştirme',
      'imposter': 'sahtekar sendromu',
      'procrastination': 'erteleme',
      'compensation': 'telafi',
      'suppression': 'bastırma',
      'projection': 'yansıtma',
    };
    const turkcelestir = (text) => {
      if (!text) return text;
      let result = text;
      for (const [en, tr] of Object.entries(trTerms)) {
        const regex = new RegExp(en, 'gi');
        result = result.replace(regex, tr);
      }
      return result;
    };
    // Tüm string alanları Türkçeleştir
    for (const key of Object.keys(parsed)) {
      if (typeof parsed[key] === 'string') {
        parsed[key] = turkcelestir(parsed[key]);
      } else if (Array.isArray(parsed[key])) {
        parsed[key] = parsed[key].map(v => typeof v === 'string' ? turkcelestir(v) : v);
      }
    }
    showToast('✅', 'AI hazır: ' + (parsed.ana_tani||'?').substring(0,30));
    return parsed;
  } catch(e) {
    console.error('AI analiz HATA:', e.message, e);
    return null;
  }
}


// Wellness sayfası açıldığında gün kontrolü — dünün verisi varsa inputları sıfırla
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

function notificationsPage() {
  const notifs = currentRole === 'teacher' ? teacherNotifs : studentNotifs;
  const taskNotifs = notifs.filter(n => n.type !== 'message');
  const myUid = (window.currentUserData||{}).uid||'';

  // Önce render et, sonra okundu işaretle (görsel ayrım için)
  const html = `
    <div class="page-title">🔔 Bildirimler</div>
    <div class="page-sub">Görev ve sistem bildirimleri</div>
    <div class="card" style="padding:0;overflow:hidden">
      ${taskNotifs.length === 0
        ? `<div style="text-align:center;padding:40px;color:var(--text2)">
            <div style="font-size:2.5rem;margin-bottom:12px">🔔</div>
            <div>Henüz bildirim yok</div>
           </div>`
        : taskNotifs.map(n=>{
          // Bildirim tipine göre hedef sayfa
          const hedef = n.type==='task' ? (currentRole==='student'?'my-tasks':'tasks-teacher')
                      : n.type==='message' ? 'messages'
                      : n.type==='hediye' ? 'messages'
                      : n.type==='gorusme' ? (currentRole==='student'?'wellness':'students')
                      : null;
          return `
          <div class="notif-item ${n.read ? '' : 'unread'}" 
            onclick="${hedef?`showPage('${hedef}')`:''}" 
            style="${hedef?'cursor:pointer':''};display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border)22">
            <div class="notif-dot ${n.read ? 'read' : ''}"></div>
            <div style="flex:1">
              <div class="notif-text">${n.text}</div>
              <div class="notif-time">${n.time||''}</div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
              ${!n.read ? '<span style="font-size:0.65rem;font-weight:800;color:var(--accent);background:var(--accent)22;padding:2px 7px;border-radius:99px">YENİ</span>' : ''}
              ${hedef ? '<span style="color:var(--text2);font-size:0.9rem">›</span>' : ''}
            </div>
          </div>`;
        }).join('')}
    </div>
    <div style="text-align:center;margin-top:12px;font-size:0.8rem;color:var(--text2)">
      💬 Mesaj bildirimleri için <button onclick="showPage('messages')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-weight:700">Mesajlar</button> bölümüne git
    </div>`;

  // 800ms sonra okundu işaretle (kullanıcı görüntülemiş olsun)
  setTimeout(() => {
    taskNotifs.forEach(n => { n.read = true; });
    if (myUid) {
      taskNotifs.filter(n=>n.id).forEach(n => {
        db.collection('notifications').doc(n.id).update({read:true}).catch(()=>{});
      });
    }
    updateNotifBadge();
    // YENİ badge'lerini kaldır
    document.querySelectorAll('.notif-item.unread').forEach(el => {
      el.classList.remove('unread');
      el.querySelector('.notif-dot')?.classList.add('read');
      const badge = el.querySelector('span[style*="YENİ"]');
      if (badge) badge.remove();
    });
  }, 800);

  return html;
}

let notifUnsubscribe = null;

function startNotifListener() {
  const myUid = (window.currentUserData||{}).uid || '';
  if (!myUid) return;
  if (notifUnsubscribe) { notifUnsubscribe(); notifUnsubscribe = null; }
  // FCM push token kayıt — sadece öğrenci için
  if (currentRole === 'student') {
    registerFCMToken(myUid);
  }
  try {
    notifUnsubscribe = db.collection('notifications')
      .where('toUid','==',myUid)
      .onSnapshot(snap => {
        const notifs = [];
        snap.forEach(d => notifs.push({ ...d.data(), id: d.id }));
        notifs.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
        // Eğer local'de okundu işaretlediysek Firestore gecikmeli güncelleme gelebilir
        // Bu yüzden local read:true olanları koru
        const prevNotifs = currentRole==='teacher' ? teacherNotifs : studentNotifs;
        const localReadIds = new Set(prevNotifs.filter(n=>n.read).map(n=>n.id));
        notifs.forEach(n => { if(localReadIds.has(n.id)) n.read = true; });
        if (currentRole === 'teacher') teacherNotifs = notifs;
        else studentNotifs = notifs;
        updateNotifBadge();
      }, () => loadNotificationsOnce());
  } catch(e) { loadNotificationsOnce(); }
}

// FCM Push Token Kaydı
const VAPID_KEY = 'BNbQhKCJmfDzfz_U9lL2L2t3WgfBhsLVqJpzYGnT5K8vR2mX4eQwYzN6oP1rD3sH7iM9aK5fE8cJ2nW0tI4u';

async function registerFCMToken(uid) {
  try {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    // Service Worker kayıt
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const messaging = firebase.messaging();
    // İzin iste (henüz verilmediyse)
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    // Token al
    const token = await messaging.getToken({ 
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: reg
    });
    if (!token) return;
    // Mevcut token ile aynıysa kaydetme
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.data()?.fcmToken === token) return;
    // Firestore'a kaydet
    await db.collection('users').doc(uid).update({ fcmToken: token });
    window._fcmToken = token;
  } catch(e) {
    // Sessiz hata — bildirim desteklenmiyor veya reddedildi
  }
}

async function loadNotificationsOnce() {
  const myUid = (window.currentUserData||{}).uid || '';
  if (!myUid) return;
  try {
    const snap = await db.collection('notifications').where('toUid','==',myUid).get();
    const notifs = [];
    snap.forEach(d => notifs.push({ ...d.data(), id: d.id }));
    notifs.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    if (currentRole === 'teacher') teacherNotifs = notifs;
    else studentNotifs = notifs;
    updateNotifBadge();
  } catch(e) { console.log('Bildirim hatası:', e.message); }
}

// Geriye dönük uyumluluk için alias
async function loadNotifications() { loadNotificationsOnce(); }

function updateNotifBadge() {
  const notifs = currentRole === 'teacher' ? teacherNotifs : studentNotifs;
  // Görev/sistem bildirimleri → header zil ikonu
  const unreadTask = notifs.filter(n => !n.read && n.type !== 'message').length;
  const badge = document.getElementById('notifBadge');
  if (badge) {
    if (unreadTask > 0) {
      badge.textContent = unreadTask > 9 ? '9+' : String(unreadTask);
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
  // Mobile nav'ı yenile (mesaj badge dahil)
  renderMobileNav();
}

/* =================== HELPERS =================== */
function selectSubjectCard(el, name) {
  document.querySelectorAll('.subject-entry-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('entrySubject').value = name;
  openModal('addEntryModal');
}

// Seçili geçmiş gün için global
window._selectedEntryDate = null;

function openDayAction(dk, dateLabel, isToday, isPast) {
  const isTodayBool = isToday === 'true';
  const isPastBool = isPast === 'true';

  const panel = document.getElementById('dayEntriesPanel');
  const btnDiv = document.getElementById('dayActionBtn');
  const warning = document.getElementById('pastDayWarning');
  const pastLbl = document.getElementById('pastDayLabel');

  // Toggle: aynı güne tekrar tıklayınca kapat
  if (panel && panel._openDk === dk && panel.style.display !== 'none') {
    panel.style.display = 'none';
    panel._openDk = null;
    if (warning) warning.style.display = 'none';
    // Butonu bugün için sıfırla
    if (btnDiv) btnDiv.innerHTML = `<button class="btn btn-primary" style="width:100%" onclick="showPage('daily-entry')">+ Bugün Giriş Yap</button>`;
    return;
  }

  // Girişleri göster
  showDayEntries(dk, dateLabel);
  if (panel) panel._openDk = dk;

  if (isTodayBool) {
    window._selectedEntryDate = null;
    if (btnDiv) btnDiv.innerHTML = `<button class="btn btn-primary" style="width:100%" onclick="showPage('daily-entry')">+ Bugün Giriş Yap</button>`;
    if (warning) warning.style.display = 'none';
  } else if (isPastBool) {
    window._selectedEntryDate = dk;
    if (pastLbl) pastLbl.textContent = dateLabel;
    if (warning) warning.style.display = 'block';
    if (btnDiv) btnDiv.innerHTML = `<button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#f9ca24,#e17055)" onclick="openEntryForDay('${dk}')">📅 ${dateLabel} için Giriş Yap</button>`;
  } else {
    window._selectedEntryDate = null;
    if (warning) warning.style.display = 'none';
    if (btnDiv) btnDiv.innerHTML = `<button class="btn btn-primary" style="width:100%" onclick="showPage('daily-entry')">+ Bugün Giriş Yap</button>`;
  }
}

function openEntryForDay(dk) {
  window._selectedEntryDate = dk || null;
  openEntryFor(null);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function toggleEntryFields() {
  const type = document.getElementById('entryType').value;
  const isDeneme = type === 'deneme';
  const isSoru = type === 'soru';
  document.getElementById('normalFields').style.display = isDeneme ? 'none' : 'block';
  document.getElementById('soruFields').style.display = isSoru ? 'block' : 'none';
  document.getElementById('denemeFields').style.display = isDeneme ? 'block' : 'none';
}

function updateEntryTopics() {
  const sub = document.getElementById('entrySubject').value;
  const topics = kazanimlar[sub] || [];
  const sel = document.getElementById('entryTopic');
  if (sel) { sel.value = ''; }
  // Konu seçici label'ı sıfırla
  const topicLbl = document.getElementById('entryTopicLabel');
  if (topicLbl) topicLbl.textContent = '— Konu seç —';
}

function openDenemeSinaviEntry() {
  const subBtn = document.getElementById('entrySubjectBtn');
  if (subBtn) { subBtn.disabled = false; subBtn.style.opacity=''; subBtn.style.cursor='pointer'; }
  document.getElementById('entryType').value = 'deneme';
  const typeLbl = document.getElementById('entryTypeLabel');
  if (typeLbl) typeLbl.textContent = '📊 Deneme Sınavı';
  document.getElementById('entryDuration').value = '';
  document.getElementById('entryNote').value = '';
  subjects.forEach(s => {
    const d = document.getElementById('deneme_d_'+s.name);
    const y = document.getElementById('deneme_y_'+s.name);
    if(d) d.value='';
    if(y) y.value='';
  });
  toggleEntryFields();
  openModal('addEntryModal');
}

function openEntryFor(subjectName) {
  const subBtn = document.getElementById('entrySubjectBtn');
  if (subjectName) {
    document.getElementById('entrySubject').value = subjectName;
    const sub = subjects.find(s=>s.name===subjectName);
    const lbl = document.getElementById('entrySubjectLabel');
    if (lbl && sub) lbl.textContent = sub.icon + ' ' + sub.name;
    // Ders kartından açıldıysa ders değiştirilemez
    if (subBtn) { subBtn.disabled = true; subBtn.style.opacity='0.65'; subBtn.style.cursor='default'; }
  } else {
    // Deneme veya genel açılışta ders değiştirilebilir
    if (subBtn) { subBtn.disabled = false; subBtn.style.opacity=''; subBtn.style.cursor='pointer'; }
  }
  updateEntryTopics();
  document.getElementById('entryType').value = 'soru';
  const typeLbl = document.getElementById('entryTypeLabel');
  if (typeLbl) typeLbl.textContent = '📝 Soru Çözümü';
  toggleEntryFields();
  document.getElementById('entryDuration').value = '';
  document.getElementById('entryQuestions').value = '';
  document.getElementById('entryCorrect').value = '';
  document.getElementById('entryWrong').value = '';
  document.getElementById('entryNote').value = '';
  subjects.forEach(s => {
    const d = document.getElementById('deneme_d_'+s.name);
    const y = document.getElementById('deneme_y_'+s.name);
    if(d) d.value='';
    if(y) y.value='';
  });
  openModal('addEntryModal');
}

function saveEntry() {
  const type = document.getElementById('entryType').value;
  const dur = parseInt(document.getElementById('entryDuration').value) || 0;
  const note = document.getElementById('entryNote').value;
  if (!dur) { showToast('⚠️', 'Süre giriniz!'); return; }

  const now = new Date();
  const time = now.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  // Geçmiş gün seçiliyse o tarihe kaydet, yoksa bugün
  const dateKey = window._selectedEntryDate || getDateKey(now);
  const isToday = !window._selectedEntryDate;
  window._selectedEntryDate = null; // kullandıktan sonra sıfırla
  const user = auth.currentUser;
  const studentName = document.getElementById('menuName')?.textContent;
  const teacherId = (window.currentUserData||{}).teacherId || '';

  if (type === 'deneme') {
    // examId: bu denemenin tüm derslerini bağlayan benzersiz ID
    const examId = 'exam_' + Date.now() + '_' + Math.random().toString(36).substr(2,6);
    const examTitleRaw = (document.getElementById('denemeTitle')?.value||'').trim();
    const examTitle = examTitleRaw || new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})+' Denemesi';
    // Deneme sınavı — tüm dersler ayrı ayrı kaydet, hepsi aynı examId ile
    let saved = 0;
    const savedPromises = [];
    subjects.forEach(s => {
      const d = parseInt(document.getElementById('deneme_d_'+s.name)?.value)||0;
      const y = parseInt(document.getElementById('deneme_y_'+s.name)?.value)||0;
      if (d===0 && y===0) return;
      const net = d - y/3;
      const q = d + y;
      const entry = {
        subject: s.name, topic: examTitle, type: 'deneme',
        examId, examTitle,
        duration: Math.round(dur/subjects.length), questions: q,
        correct: d, wrong: y, net, note, time, dateKey, isToday: true,
        date: 'Bugün '+time
      };
      studyEntries.unshift(entry);
      if (user) {
        const p = db.collection('studyEntries').add({
          ...entry, userId: user.uid, teacherId, studentName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(docRef => { entry.firestoreId = docRef.id; }).catch(()=>{});
        savedPromises.push(p);
        saved++;
      } else { saved++; }
    });
    // Input temizle
    if(document.getElementById('denemeTitle')) document.getElementById('denemeTitle').value = '';
    closeModal('addEntryModal');
    showToast('✅', `"${examTitle}" kaydedildi! (${saved} ders)`);
    if (user && teacherId) {
      const time2 = new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
      db.collection('notifications').add({
        toUid: teacherId, fromUid: user.uid,
        text: `🎯 ${studentName} deneme girdi: "${examTitle}" (${saved} ders)`,
        examTitle: examTitle,
        type: 'entry', read: false, time: time2,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(()=>{});
    }
    showPage('daily-entry');
    return;
  }

  // Normal giriş
  const sub = document.getElementById('entrySubject').value;
  const topic = document.getElementById('entryTopic').value || 'Genel Çalışma';
  const q = type==='soru' ? (parseInt(document.getElementById('entryQuestions').value)||0) : 0;
  const correct = type==='soru' ? (parseInt(document.getElementById('entryCorrect').value)||0) : 0;
  const wrong = type==='soru' ? (parseInt(document.getElementById('entryWrong').value)||0) : 0;

  // Doğru + yanlış toplam soru sayısını geçemez
  if (type==='soru' && q > 0 && (correct + wrong) > q) {
    showToast('⚠️', `Doğru (${correct}) + yanlış (${wrong}) = ${correct+wrong}, soru sayısı (${q}) geçemez!`);
    // Hatalı alanları kırmızı yap
    const cEl = document.getElementById('entryCorrect');
    const wEl = document.getElementById('entryWrong');
    if(cEl) cEl.style.borderColor='#E24B4A';
    if(wEl) wEl.style.borderColor='#E24B4A';
    setTimeout(()=>{ if(cEl) cEl.style.borderColor=''; if(wEl) wEl.style.borderColor=''; }, 3000);
    return;
  }

  const net = q > 0 ? correct - wrong/3 : 0;

  const entry = {
    subject: sub, topic, type, duration: dur, questions: q,
    correct, wrong, net, note, time, dateKey, isToday,
    date: isToday ? ('Bugün '+time) : (dateKey+' '+time)
  };
  studyEntries.unshift(entry);

  if (user) {
    db.collection('studyEntries').add({
      ...entry, userId: user.uid, teacherId, studentName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
      entry.firestoreId = docRef.id;
      // Öğretmene bildirim gönder
      if (teacherId) {
        const subLabel = sub || 'Genel';
        const typeLabel = type==='soru'?'soru çözümü':type==='konu'?'konu çalışması':'tekrar';
        db.collection('notifications').add({
          toUid: teacherId,
          fromUid: user.uid,
          text: `📚 ${studentName}, ${subLabel} dersinde ${typeLabel} tamamladı (${dur} dk${q>0?', '+q+' soru':''})`,
          type: 'entry',
          read: false,
          time: time,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(()=>{});
      }
    }).catch(()=>{});
  }

  closeModal('addEntryModal');
  const netStr = q>0 ? ` | Net: ${net.toFixed(1)}` : '';
  showToast('✅', `${sub} — ${topic} kaydedildi!${netStr}`);
  showPage('daily-entry');
  // Rozet kontrolü
  setTimeout(()=>checkBadges(), 500);
  // Altın sistemi — soru hook
  if (type === 'soru' && correct > 0 && typeof _marketSoruKontrol === 'function') {
    _marketSoruKontrol(correct);
  }
  // Konfeti efekti
  if (typeof _marketKonfetiEfekt === 'function') {
    setTimeout(()=>_marketKonfetiEfekt(), 300);
  }
}

async function deleteStudent(i) {
  const s = students[i];
  const ok = await appConfirm('Öğrenciyi Sil', `${s.name} silinsin mi? Öğrencinin hesabı devre dışı bırakılacak. Bu işlem geri alınamaz.`, true);
  if (!ok) return;

  try {
    const teacherUser = auth.currentUser;

    // 1. users koleksiyonundan sil
    if (s.uid) {
      await db.collection('users').doc(s.uid).delete();
      await db.collection('wellness').doc(s.uid).delete().catch(()=>{});
    }

    // 2. Silinen hesabı işaretle - aynı e-posta ile yeniden eklenmeye çalışılırsa bilgi ver
    if (s.email || s.uid) {
      await db.collection('deletedStudents').add({
        uid: s.uid || '',
        name: s.name,
        email: s.email || '',
        deletedBy: teacherUser?.uid || '',
        deletedAt: new Date()
      });
    }

    // 3. pendingStudents'tan sil
    if (teacherUser) {
      const snap = await db.collection('pendingStudents')
        .where('teacherId','==',teacherUser.uid)
        .where('name','==',s.name).get();
      snap.forEach(doc => doc.ref.delete());
    }

    // 4. Lokal diziden çıkar
    students.splice(i, 1);
    showToast('🗑️', `${s.name} silindi.`);
    showPage('students');
  } catch(e) {
    showToast('❌', 'Silme hatası: ' + e.message);
  }
}

async function saveNewStudent() {
  const name = document.getElementById('newStudentName').value.trim();
  const email = document.getElementById('newStudentEmail').value.trim();
  const pass = document.getElementById('newStudentPass').value;
  const errEl = document.getElementById('addStudentError');
  errEl.style.display = 'none';
  const school = document.getElementById('newStudentSchool')?.value || '';
  if (!name || !email || !pass) { errEl.textContent = 'Tüm alanları doldurunuz.'; errEl.style.display='block'; return; }
  if (!school) { errEl.textContent = 'Lütfen bir okul seçin.'; errEl.style.display='block'; return; }
  if (pass.length < 6) { errEl.textContent = 'Şifre en az 6 karakter olmalı.'; errEl.style.display='block'; return; }
  if (students.length >= 30) { errEl.textContent = 'En fazla 30 öğrenci eklenebilir.'; errEl.style.display='block'; return; }

  const errBtn = document.querySelector('#addStudentModal .btn-primary');
  if (errBtn) { errBtn.textContent = 'Ekleniyor...'; errBtn.disabled = true; }

  try {
    const teacherUser = auth.currentUser;
    const teacherData = window.currentUserData || {};

    // Silinmiş hesap kontrolü
    const deletedSnap = await db.collection('deletedStudents').where('email','==',email).get();
    if (!deletedSnap.empty) {
      errEl.textContent = 'Bu e-posta daha önce silinmiş bir öğrenciye ait. Farklı bir e-posta kullanın.';
      errEl.style.display = 'block';
      if (errBtn) { errBtn.textContent = 'Ekle ✓'; errBtn.disabled = false; }
      return;
    }
    // Bu sayede öğretmenin oturumu kapanmıyor
    let secondaryApp;
    try {
      secondaryApp = firebase.app('secondary');
    } catch(e) {
      secondaryApp = firebase.initializeApp(firebase.app().options, 'secondary');
    }
    const secondaryAuth = secondaryApp.auth();

    // Öğrenci Firebase Auth hesabı oluştur
    const cred = await secondaryAuth.createUserWithEmailAndPassword(email, pass);
    const studentUid = cred.user.uid;

    // Öğrenci Firestore profilini secondaryAuth aktifken yaz (öğrencinin kendi auth'u)
    const colors = ['#6c63ff','#ff6584','#43e97b','#f9ca24','#00b4d8','#ff9f43'];
    const color = colors[students.length % colors.length];
    const profileData = {
      name, email, role: 'student',
      teacherId: teacherUser.uid,
      teacherName: teacherData.name || '',
      teacherPhoto: teacherData.photo || '',
      school: (document.getElementById('newStudentSchool')?.value) || teacherData.school || '',
      photo: '', color, avg: 0,
      createdAt: new Date()
    };

    // secondaryApp'in Firestore instance'ını al (öğrencinin auth'u aktif)
    let written = false;
    try {
      const secDb = firebase.app('secondary').firestore();
      await secDb.collection('users').doc(studentUid).set(profileData);
      written = true;
    } catch(e1) {
      console.log('Secondary Firestore hatasi:', e1.message);
    }

    // İkinci oturumu kapat
    await secondaryAuth.signOut();

    // Secondary başarısız olduysa öğretmen auth'u ile dene
    if (!written) {
      await db.collection('users').doc(studentUid).set(profileData);
    }

    // Öğretmenin listesine ekle
    students.push({ name, uid: studentUid, avg: 0, trend: 'up', lastActive: 'Yeni', color, tasks: 0 });

    closeModal('addStudentModal');
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentEmail').value = '';
    document.getElementById('newStudentPass').value = '';
    showToast('✅', `${name} eklendi! Giriş: ${email} / ${pass}`);
    showPage('students');

  } catch(e) {
    const msgs = {
      'auth/email-already-in-use': 'Bu e-posta başka bir hesapta kullanılıyor. Farklı bir e-posta deneyin.',
      'auth/invalid-email': 'Geçersiz e-posta adresi.',
      'auth/weak-password': 'Şifre çok zayıf, en az 6 karakter olmalı.',
    };
    errEl.textContent = msgs[e.code] || 'Hata: ' + e.message;
    errEl.style.display = 'block';
  } finally {
    if (errBtn) { errBtn.textContent = 'Ekle ✓'; errBtn.disabled = false; }
  }
}

function populateTaskStudents() {
  // taskStudentBtn'in onclick'ini öğrenci listesiyle güncelle
  const btn = document.getElementById('taskStudentBtn');
  if (btn) {
    const opts = students.length > 0
      ? students.map(s=>({v:s.name, l:s.name + (s.classroom ? ' · '+(s.classroom.match(/\d+/)?.[0]||'')+'.Sınıf' : '')}))
      : [{v:'', l:'Henüz öğrenci eklenmedi'}];
    btn.setAttribute('onclick', `openOptionPicker('taskStudent','Öğrenci Seç',${JSON.stringify(opts)},null)`);
  }
  // Değeri sıfırla
  const inp = document.getElementById('taskStudent');
  if (inp) inp.value = '';
  const lbl = document.getElementById('taskStudentLabel');
  if (lbl) lbl.textContent = '— Öğrenci seç —';
  updateTaskUnits();
}

function updateTaskUnits() {
  // Konu sıfırla
  const inp = document.getElementById('taskUnit');
  if (inp) inp.value = '';
  const lbl = document.getElementById('taskUnitLabel');
  if (lbl) lbl.textContent = '— Konu seç —';
  // Görev başlığını da sıfırla
  const titleEl = document.getElementById('taskTitle');
  if (titleEl) titleEl.value = '';
}

function updateTaskTitle() {
  const type = document.getElementById('taskType')?.value || 'soru';
  const unit = document.getElementById('taskUnit')?.value || '';
  const countGroup = document.getElementById('taskCountGroup');
  const titleEl = document.getElementById('taskTitle');
  const typeLabels = {
    soru: 'Soru Çözümü', konu: 'Konu Çalışma',
    ozet: 'Özet Çıkarma', tekrar: 'Tekrar', diger: 'Görev'
  };
  if (countGroup) countGroup.style.display = type === 'soru' ? 'block' : 'none';
  if (unit && titleEl) titleEl.value = `${unit} — ${typeLabels[type]||'Görev'}`;
}

function openTaskModal() {
  populateTaskStudents();
  const d = new Date();
  d.setDate(d.getDate() + 3);
  document.getElementById('taskDue').value = d.toISOString().split('T')[0];
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  // Başlık ve butonu sıfırla (editTaskModal'dan gelmiş olabilir)
  const titleEl = document.querySelector('#addTaskModal .modal-title');
  if (titleEl) titleEl.textContent = '📋 Görev Ata';
  const btn = document.getElementById('taskSaveBtn');
  if (btn) btn.onclick = saveTask;
  openModal('addTaskModal');
}

async function saveTask() {
  const student = document.getElementById('taskStudent').value;
  if (!student) { showToast('⚠️', 'Lütfen öğrenci seçin!'); return; }
  const title = document.getElementById('taskTitle').value || 'Yeni Görev';
  const sub = document.getElementById('taskSubject').value;
  const unit = document.getElementById('taskUnit').value;
  const type = document.getElementById('taskType').value;
  const count = document.getElementById('taskCount').value;
  const desc = document.getElementById('taskDesc').value || `${unit} konusunda görev`;
  const dueRaw = document.getElementById('taskDue').value;
  const due = dueRaw ? new Date(dueRaw).toLocaleDateString('tr-TR',{day:'numeric',month:'long'}) : '—';
  const typeLabels = {soru:'📝 Soru Çözümü', konu:'📖 Konu Çalışma', test:'📊 Test', ozet:'✏️ Özet', tekrar:'🔁 Tekrar', diger:'📌 Diğer'};
  const fullDesc = (count ? `${count} soru — ` : '') + desc;
  const user = auth.currentUser;
  const studentObj = students.find(s => s.name === student);
  const studentUid = studentObj?.uid || '';
  const taskData = {
    title, subject: sub, unit, type,
    typeLabel: typeLabels[type]||'Görev',
    desc: fullDesc, due,
    studentName: student,
    studentUid: studentUid,
    teacherId: user ? user.uid : '',
    teacherName: document.getElementById('menuName')?.textContent,
    done: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  try {
    const ref = await db.collection('tasks').add(taskData);
    tasks.unshift({ ...taskData, id: ref.id });
    // Öğrenciye bildirim gönder
    if (studentUid) {
      await db.collection('notifications').add({
        toUid: studentUid,
        fromUid: user ? user.uid : '',
        text: `📋 Yeni görev: "${title}" — ${sub} (Son: ${due})`,
        type: 'task', read: false,
        time: new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch(e) {
    tasks.unshift({ ...taskData, id: Date.now().toString() });
  }
  closeModal('addTaskModal');
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskCount').value = '';
  showToast('📤', `${student}'e görev gönderildi!`);
  showPage('tasks-teacher');
}

async function completeTask(i) {
  tasks[i].done = true;
  if (tasks[i].id) {
    try { await db.collection('tasks').doc(tasks[i].id).update({ done: true }); } catch(e) {}
  }
  showToast('🎉', 'Görev tamamlandı!');
  showPage('my-tasks');
}

function toggleKazanim(subject, idx, el) {
  const key = subject+idx;
  kazanimDone[key] = !kazanimDone[key];
  el.classList.toggle('done', kazanimDone[key]);
  el.querySelector('.kazanim-check').textContent = kazanimDone[key] ? '✓' : '';
  // update progress bar
  const kList = kazanimlar[subject] || [];
  const done = kList.filter((_,i)=> kazanimDone[subject+i]).length;
  const pct = kList.length ? Math.round(done/kList.length*100) : 0;
  const kLabel = typeof kList[idx] === 'object' ? kList[idx].unite : kList[idx];
  showToast(kazanimDone[key]?'✅':'↩️', `${subject} — ${kLabel} ${kazanimDone[key]?'tamamlandı':'geri alındı'}`);
}

/* =================== PDF EXPORT =================== */
function exportPDF(role) {
  showToast('⏳','PDF hazirlaniyor...');
  try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
      const now = new Date();
      const todayKey = getDateKey(now);
      const nowStr = now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});

      const period = role==='teacher'
        ? (document.getElementById('pdfPeriodType')?.value || 'monthly')
        : (document.getElementById('pdfPeriodS')?.value || 'monthly');
      const pLabel = period==='weekly'?'Haftalık':period==='monthly'?'Aylık':'Dönem';

      // Seçilen tarih aralığını al
      const dateRangeVal = document.getElementById('pdfDateRange')?.value || '';
      let startKey, endKey;
      if (period==='weekly' && dateRangeVal) {
        startKey = dateRangeVal;
        const mon = new Date(dateRangeVal+'T12:00:00');
        const sun = new Date(mon); sun.setDate(mon.getDate()+6);
        endKey = sun.toISOString().split('T')[0];
      } else if (period==='monthly' && dateRangeVal) {
        const [yr, mo] = dateRangeVal.split('-').map(Number);
        startKey = dateRangeVal + '-01';
        endKey = new Date(yr, mo, 0).toISOString().split('T')[0];
      }

      // Dönem filtresi
      const monday = startKey ? new Date(startKey+'T12:00:00') : (() => { const m=new Date(now); m.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1)); return m; })();
      const mondayKey = monday.toISOString().split('T')[0];
      const monthStart = startKey || todayKey.substring(0,7)+'-01';
      const filterE = (arr) => {
        if (period==='weekly') return arr.filter(e=>e.dateKey>=mondayKey && (!endKey||e.dateKey<=endKey));
        if (period==='monthly') return arr.filter(e=>e.dateKey>=monthStart && (!endKey||e.dateKey<=endKey));
        return arr;
      };

      const studentFilter = role==='teacher'
        ? (document.getElementById('pdfStudent')?.value || 'all')
        : document.getElementById('menuName')?.textContent;

      const filteredEntries = role==='teacher' && studentFilter!=='all'
        ? filterE(studyEntries.filter(e=>e.studentName===studentFilter))
        : filterE(studyEntries);

      const totalEntries = filteredEntries.length;
      const totalDurAll = filteredEntries.reduce((a,e)=>a+(e.duration||0),0);
      const totalQAll = filteredEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.questions||0),0);
      const totalNetAll = filteredEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.net||0),0);
      const activeDays = new Set(filteredEntries.map(e=>e.dateKey)).size;

      // Başlık
      const title = role==='teacher'
        ? (studentFilter==='all' ? 'Tum Ogrenciler — Sinif Ozeti' : ts(studentFilter)+' — Ogrenci Raporu')
        : ts(studentFilter)+' — Kisisel Analiz Raporu';

      // Hafta/ay etiket
      function getPLabel() {
        if (period==='weekly') {
          const sun = new Date(monday); sun.setDate(monday.getDate()+6);
          return monday.toLocaleDateString('tr-TR',{day:'numeric',month:'long'})+' - '+sun.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})+' Haftalık Rapor';
        }
        if (period==='monthly') {
          const d = new Date(monthStart+'T12:00:00');
          return d.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})+' Aylık Rapor';
        }
        return 'Dönem Raporu';
      }

      let Y = pdfHeader(doc, ts(title), ts(getPLabel()), ts(nowStr));

      // Özet kutular
      const stats = role==='teacher' && studentFilter==='all'
        ? [['Aktif Öğrenci',students.length,[90,72,200]],['Toplam Giriş',totalEntries,[38,166,154]],['Toplam Soru',totalQAll,[255,167,38]],['Ort. Net',(totalQAll>0?totalNetAll/totalQAll:0).toFixed(1),[239,83,80]]]
        : [['Süre(dk)',totalDurAll,[90,72,200]],['Soru',totalQAll,[66,165,245]],['Aktif Gün',activeDays,[38,166,154]],['Ort. Net',(totalQAll>0?totalNetAll/totalQAll:0).toFixed(1),[239,83,80]]];
      const bw=41, bh=16, bgap=2.8;
      stats.forEach((s,i)=>{
        const x=14+i*(bw+bgap);
        const [r,g,b]=s[2];
        doc.setFillColor(Math.min(255,Math.round(r*0.08+255*0.92)),Math.min(255,Math.round(g*0.08+255*0.92)),Math.min(255,Math.round(b*0.08+255*0.92))); doc.roundedRect(x,Y,bw,bh,2,2,'F');
        doc.setDrawColor(210,204,242); doc.setLineWidth(0.3); doc.roundedRect(x,Y,bw,bh,2,2,'S');
        doc.setFont(_PF,'bold'); doc.setFontSize(12); doc.setTextColor(r,g,b);
        doc.text(ts(String(s[1])),x+bw/2,Y+9,{align:'center'});
        doc.setFont(_PF,'normal'); doc.setFontSize(5.5); doc.setTextColor(100,95,140);
        doc.text(ts(s[0]),x+bw/2,Y+14.5,{align:'center'});
      });
      Y+=21;

      // Ders bazlı performans
      Y = pdfSecHeader(doc,'DERS BAZLI PERFORMANS',Y);
      const subjectNames = ['Turkce','Matematik','Fen Bilimleri','Inkilap Tarihi','Din Kulturu','Ingilizce'];
      const subjectKeys = ['Türkçe','Matematik','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce'];
      const subColors = [[108,99,255],[66,165,245],[38,166,154],[255,167,38],[171,71,188],[102,187,106]];
      const subjectIcons = ['TUR','MAT','FEN','INK','DIN','ING'];
      subjectKeys.forEach((key,i)=>{
        const se = filteredEntries.filter(e=>e.subject===key&&e.type!=='deneme');
        const q=se.reduce((a,e)=>a+(e.questions||0),0);
        const d=se.reduce((a,e)=>a+(e.correct||0),0);
        const pct=q>0?Math.round(d/q*100):0;
        const [r,g,b]=subColors[i];
        Y=pdfCheck(doc,Y,10);
        doc.setFillColor(248,247,254); doc.roundedRect(14,Y,182,8,1.5,1.5,'F');
        doc.setDrawColor(210,204,242); doc.setLineWidth(0.2); doc.roundedRect(14,Y,182,8,1.5,1.5,'S');
        doc.setTextColor(r,g,b); doc.setFontSize(7); doc.setFont(_PF,'bold');
        doc.text(subjectIcons[i],18,Y+5.5);
        doc.setTextColor(40,35,80); doc.setFont(_PF,'normal');
        doc.text(subjectNames[i],30,Y+5.5);
        // Progress bar
        const bx=95, bw2=75, bh2=3;
        doc.setFillColor(220,215,245); doc.roundedRect(bx,Y+2.5,bw2,bh2,1,1,'F');
        if(pct>0) { const rm2=Math.min(255,Math.round(r*0.8+255*0.2)),gm2=Math.min(255,Math.round(g*0.8+255*0.2)),bm2=Math.min(255,Math.round(b*0.8+255*0.2)); doc.setFillColor(rm2,gm2,bm2); doc.roundedRect(bx,Y+2.5,bw2*pct/100,bh2,1,1,'F'); }
        doc.setTextColor(r,g,b); doc.setFontSize(7.5); doc.setFont(_PF,'bold');
        doc.text(pct+'%',194,Y+5.5,{align:'right'});
        if(q>0) {
          doc.setTextColor(120,115,160); doc.setFontSize(6); doc.setFont(_PF,'normal');
          doc.text(q+' soru | Net:'+(d-se.reduce((a,e)=>a+(e.wrong||0),0)/3).toFixed(1), 175,Y+5.5,{align:'right'});
        }
        Y+=10;
      });
      Y+=4;

      // Öğrenci tablosu (öğretmen - tüm öğrenciler)
      if(role==='teacher' && studentFilter==='all') {
        Y=pdfSecHeader(doc,'ÖĞRENCİ ÇALIŞMA ÖZETİ',Y);
        const tH=['Ad Soyad','Giriş','Top. Süre','Top. Soru','Ort. Net','Son Aktif'];
        const tW=[50,20,26,26,22,38];
        const tR=students.map(s=>{
          const se=filterE(studyEntries.filter(e=>e.studentName===s.name));
          const dur=se.reduce((a,e)=>a+(e.duration||0),0);
          const q=se.reduce((a,e)=>a+(e.questions||0),0);
          const net=se.length>0?(se.reduce((a,e)=>a+(e.net||0),0)/se.length).toFixed(1):'—';
          const last=se.length>0?se[0].dateKey:'Yeni';
          return [s.name,se.length,dur+'dk',q,net,last];
        });
        Y=pdfTable(doc,tH,tW,tR,Y);
        Y+=4;
      }

      // Çalışma detayları (bireysel)
      if(role==='student' || (role==='teacher' && studentFilter!=='all')) {
        Y=pdfCheck(doc,Y,14);
        Y=pdfSecHeader(doc,'ÇALIŞMA GİRİŞ DETAYLARI',Y);
        const tH=['Tarih','Ders','Konu','Tür','Süre','Soru','Net'];
        const tW=[22,28,46,18,16,16,18];
        const tR=filteredEntries.slice(0,30).map(e=>[
          e.dateKey||'',ts(e.subject||''),ts((e.topic||'').substring(0,20)),
          ts(e.type||''),e.duration+'dk',e.questions||0,
          (e.net!=null?e.net.toFixed(1):'—')
        ]);
        Y=pdfTable(doc,tH,tW,tR,Y);
        if(filteredEntries.length>30) {
          Y=pdfCheck(doc,Y,7);
          doc.setFont(_PF,'normal'); doc.setFontSize(7); doc.setTextColor(120,115,160);
          doc.text('... ve '+( filteredEntries.length-30)+' giriş daha (tam rapor için öğrenci analizine bakın)', 14, Y);
          Y+=8;
        }
      }

      pdfFooter(doc, doc.internal.getNumberOfPages(), ts(title)+' | '+ts(getPLabel()));

      const fname = 'LGSKoc_'+ts((studentFilter==='all'?'Sinif':studentFilter).replace(/\s+/g,'_'))+'_'+pLabel+'_'+todayKey+'.pdf';
      pdfDownload(doc, fname);

    } catch(e) {
      console.error(e);
      showToast('❌','PDF olusturulamadi: '+e.message);
    }
}

