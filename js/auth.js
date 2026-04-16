function selectRole(r) {
  currentRole = r;
  document.getElementById('roleTeacher').classList.toggle('active', r==='teacher');
  document.getElementById('roleStudent').classList.toggle('active', r==='student');
}

function showRegister() {
  ['regName','regEmail','regPass','regPass2','regSchool'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const _rb = document.getElementById('regBranch'); if (_rb) _rb.value = '';
  const _rbl = document.getElementById('regBranchLabel'); if (_rbl) _rbl.textContent = '— Branş seçin —';
  const errEl = document.getElementById('regError');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
  const msg = document.getElementById('sifreUyumMsg'); if (msg) msg.style.display = 'none';
  ['regPass','regPass2'].forEach(id => { const el = document.getElementById(id); if (el) el.type = 'password'; });
  openModal('registerModal');
}

async function doLogin() {
  let giris = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  errEl.style.display = 'none';
  if (!giris || !pass) { errEl.textContent = 'Kullanıcı adı/e-posta ve şifre giriniz.'; errEl.style.display='block'; return; }
  btn.textContent = 'Giriş yapılıyor...'; btn.disabled = true;
  try {
    let email = giris;

    // @ yoksa kullanıcı adı — Firestore'dan e-postayı bul
    if (!giris.includes('@')) {
      const username = giris.toLowerCase();
      const snap = await db.collection('users')
        .where('username', '==', username).limit(1).get();
      if (snap.empty) {
        btn.textContent = 'Giriş Yap →'; btn.disabled = false;
        errEl.textContent = 'Bu kullanıcı adıyla kayıtlı hesap bulunamadı.';
        errEl.style.display = 'block';
        return;
      }
      email = snap.docs[0].data().email;
    }

    await auth.signInWithEmailAndPassword(email, pass);
    // onAuthStateChanged devralır — doğrulama kontrolü orada yapılır
  } catch(e) {
    btn.textContent = 'Giriş Yap →'; btn.disabled = false;
    errEl.textContent = _trHata(e.code);
    errEl.style.display = 'block';
  }
}

// Şifre göster/gizle
function sifreGoster(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const gizli = inp.type === 'password';
  inp.type = gizli ? 'text' : 'password';
  // Göz ikonunu güncelle
  const svg = btn.querySelector('svg');
  if (svg) {
    svg.innerHTML = gizli
      ? '<path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.2"/><line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>'
      : '<path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2"/>';
  }
}

// Şifre uyum mesajı
function sifreMesajGoster() {
  const p1 = document.getElementById('regPass')?.value || '';
  const p2 = document.getElementById('regPass2')?.value || '';
  const msg = document.getElementById('sifreUyumMsg');
  if (!msg || !p2) { if(msg) msg.style.display='none'; return; }
  if (p1 === p2) {
    msg.textContent = '✓ Şifreler uyuşuyor';
    msg.style.color = '#2d9e5a';
    msg.style.display = 'block';
  } else {
    msg.textContent = '✗ Şifreler uyuşmuyor';
    msg.style.color = '#cc3355';
    msg.style.display = 'block';
  }
}

async function doRegister() {
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass  = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2')?.value || '';
  const errEl = document.getElementById('regError');
  errEl.style.display = 'none';

  if (!name || !email || !pass) { errEl.textContent = 'Tüm alanları doldurunuz.'; errEl.style.display='block'; return; }
  if (pass.length < 6) { errEl.textContent = 'Şifre en az 6 karakter olmalı.'; errEl.style.display='block'; return; }
  if (pass !== pass2) { errEl.textContent = 'Şifreler uyuşmuyor. Lütfen kontrol edin.'; errEl.style.display='block'; return; }

  const branch = document.getElementById('regBranch')?.value || '';
  const school = document.getElementById('regSchool')?.value.trim() || '';
  if (!school) { errEl.textContent = 'Okul adı giriniz.'; errEl.style.display='block'; return; }

  const btn = document.getElementById('regBtn');
  if (btn) { btn.textContent = 'Kaydediliyor...'; btn.disabled = true; }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    const uid = cred.user.uid;

    const profileData = {
      name, email, role: 'teacher', branch, school,
      schools: school ? [school] : [],
      photo: '', createdAt: new Date()
    };

    await db.collection('pendingRegistrations').doc(uid).set(profileData);
    await cred.user.sendEmailVerification({ url: window.location.origin + window.location.pathname });
    await auth.signOut();
    closeModal('registerModal');

    setTimeout(() => {
      const el = document.getElementById('dogrulamaEkrani');
      if (el) {
        el.style.display = 'flex';
        const emailEl = document.getElementById('dogrulamaEmailGoster');
        if (emailEl) emailEl.textContent = email;
        window._dogrulamaEmail = email;
        window._dogrulamaPass  = pass;
      }
    }, 300);

  } catch(e) {
    errEl.textContent = _trHata(e.code);
    errEl.style.display = 'block';
  } finally {
    if (btn) { btn.textContent = 'Hesap Oluştur →'; btn.disabled = false; }
  }
}

// Firebase hata kodlarını Türkçeye çevir
function _trHata(code) {
  const m = {
    'auth/user-not-found':        'Bu e-posta ile kayıtlı hesap bulunamadı.',
    'auth/wrong-password':        'Şifre yanlış, tekrar deneyin.',
    'auth/invalid-credential':    'E-posta veya şifre hatalı.',
    'auth/invalid-email':         'Geçersiz e-posta adresi.',
    'auth/email-already-in-use':  'Bu e-posta zaten kayıtlı.',
    'auth/weak-password':         'Şifre çok zayıf, en az 6 karakter olmalı.',
    'auth/too-many-requests':     'Çok fazla deneme yapıldı. Lütfen birkaç dakika bekleyin.',
    'auth/network-request-failed':'İnternet bağlantısını kontrol edin.',
    'auth/user-disabled':         'Bu hesap devre dışı bırakılmış.',
    'auth/requires-recent-login': 'Bu işlem için tekrar giriş yapmanız gerekiyor.',
    'auth/expired-action-code':   'Doğrulama bağlantısının süresi dolmuş. Yeni bağlantı isteyin.',
    'auth/invalid-action-code':   'Doğrulama bağlantısı geçersiz veya daha önce kullanılmış.',
  };
  return m[code] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
}

// Tekrar doğrulama maili gönder — şifreyi inputtan alır
async function dogrulamaTekrarGonder() {
  const email  = window._dogrulamaEmail || document.getElementById('dogrulamaEmailGoster')?.textContent || '';
  const pass   = document.getElementById('dogrulamaPass')?.value || window._dogrulamaPass || '';
  const hataEl = document.getElementById('dogrulamaHata');

  if (hataEl) hataEl.style.display = 'none';

  if (!email) {
    if (hataEl) { hataEl.textContent = 'E-posta adresi bulunamadı.'; hataEl.style.display = 'block'; }
    return;
  }
  if (!pass) {
    if (hataEl) { hataEl.textContent = 'Lütfen şifrenizi girin.'; hataEl.style.display = 'block'; }
    return;
  }

  try {
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    await cred.user.sendEmailVerification({
      url: window.location.origin + window.location.pathname
    });
    await auth.signOut();
    // Şifre alanını temizle
    const passEl = document.getElementById('dogrulamaPass');
    if (passEl) passEl.value = '';
    showToast('✅', 'Yeni doğrulama bağlantısı gönderildi! Spam klasörünü de kontrol et.');
  } catch(e) {
    const mesaj = _trHata(e.code);
    if (hataEl) { hataEl.textContent = mesaj; hataEl.style.display = 'block'; }
  }
}


async function dogrulamaYeniden() {
  // Kullanıcı sign-out edildiği için e-posta saklıyoruz ve tekrar gönderiyoruz
  const email = document.getElementById('dogrulamaEmail')?.textContent || '';
  const pass = window._regPassTemp || '';
  if (!email || !pass) {
    showToast('⚠️', 'Lütfen tekrar kayıt olun.');
    dogrulamaKapat();
    return;
  }
  try {
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    await cred.user.sendEmailVerification({ url: window.location.origin + window.location.pathname });
    await auth.signOut();
    showToast('✅', 'Doğrulama e-postası tekrar gönderildi!');
  } catch(e) {
    showToast('⚠️', 'Gönderilemedi: ' + e.message);
  }
}

function toggleRegFields() {
  const role = document.getElementById('regRole').value;
  document.getElementById('teacherFields').style.display = role==='teacher' ? 'block' : 'none';
  document.getElementById('studentFields').style.display = role==='student' ? 'block' : 'none';
}

function openRolPicker() {
  const mevcut = document.getElementById('regRole').value;
  const roller = [
    {v:'student', l:'🎒 Öğrenci'},
    {v:'teacher', l:'👨‍🏫 Öğretmen'},
  ];
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display:flex;align-items:flex-end;z-index:9999';
  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:18px 18px 0 0;width:100%;padding:20px">
      <div style="font-size:1rem;font-weight:700;margin-bottom:16px;text-align:center">Rol Seç</div>
      ${roller.map(r=>`
        <div onclick="secRol('${r.v}','${r.l}',this.closest('.modal-overlay'))"
          style="padding:16px 20px;border-radius:12px;margin-bottom:8px;cursor:pointer;
          background:${'${r.v}'===mevcut?'var(--accent)22':'var(--surface2)'};
          border:1.5px solid ${'${r.v}'===mevcut?'var(--accent)':'var(--border)'};
          display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:1.1rem;font-weight:${r.v===mevcut?'700':'400'}">${r.l}</span>
          ${r.v===mevcut?'<span style="color:var(--accent);font-size:1.2rem">✓</span>':''}
        </div>`).join('')}
      <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="this.closest('.modal-overlay').remove()">İptal</button>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
}

function secRolKart(v) {
  document.getElementById('regRole').value = v;
  document.getElementById('regRoleLabel').value = v === 'teacher' ? '👨‍🏫 Öğretmen' : '🎒 Öğrenci';
  // Buton stillerini güncelle
  const sBtn = document.getElementById('rolBtn_student');
  const tBtn = document.getElementById('rolBtn_teacher');
  if (!sBtn || !tBtn) { toggleRegFields(); return; }
  if (v === 'student') {
    sBtn.style.border = '2px solid var(--accent)';
    sBtn.style.background = 'var(--accent)12';
    sBtn.querySelector('div:last-child').style.color = 'var(--accent)';
    tBtn.style.border = '2px solid var(--border)';
    tBtn.style.background = 'var(--surface2)';
    tBtn.querySelector('div:last-child').style.color = 'var(--text2)';
  } else {
    tBtn.style.border = '2px solid var(--accent)';
    tBtn.style.background = 'var(--accent)12';
    tBtn.querySelector('div:last-child').style.color = 'var(--accent)';
    sBtn.style.border = '2px solid var(--border)';
    sBtn.style.background = 'var(--surface2)';
    sBtn.querySelector('div:last-child').style.color = 'var(--text2)';
  }
  toggleRegFields();
}

function secRol(v, l, modalEl) {
  document.getElementById('regRole').value = v;
  document.getElementById('regRoleLabel').textContent = l;
  modalEl?.remove();
  toggleRegFields();
}

function openBransPicker() {
  const mevcut = document.getElementById('regBranch').value;
  const branslar = [
    {v:'Matematik',l:'📐 Matematik'},{v:'Türkçe',l:'📖 Türkçe'},
    {v:'Fen Bilimleri',l:'🔬 Fen Bilimleri'},{v:'İnkılap Tarihi',l:'🏛️ İnkılap Tarihi'},
    {v:'Din Kültürü',l:'☪️ Din Kültürü'},{v:'İngilizce',l:'🌍 İngilizce'},
    {v:'Sınıf Öğretmeni',l:'🏫 Sınıf Öğretmeni'},{v:'Diğer',l:'📌 Diğer'},
  ];
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display:flex;align-items:flex-end;z-index:9999';
  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:18px 18px 0 0;width:100%;padding:20px;max-height:70vh;overflow-y:auto">
      <div style="font-size:1rem;font-weight:700;margin-bottom:16px;text-align:center">Branş Seç</div>
      ${branslar.map(b=>`
        <div onclick="secBrans('${b.v}','${b.l}',this.closest('.modal-overlay'))"
          style="padding:14px 20px;border-radius:12px;margin-bottom:8px;cursor:pointer;
          background:${b.v===mevcut?'var(--accent)22':'var(--surface2)'};
          border:1.5px solid ${b.v===mevcut?'var(--accent)':'var(--border)'};
          display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:0.95rem;font-weight:${b.v===mevcut?'700':'400'}">${b.l}</span>
          ${b.v===mevcut?'<span style="color:var(--accent);font-size:1.2rem">✓</span>':''}
        </div>`).join('')}
      <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="this.closest('.modal-overlay').remove()">İptal</button>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
}

function secBrans(v, l, modalEl) {
  document.getElementById('regBranch').value = v;
  document.getElementById('regBranchLabel').textContent = l;
  modalEl?.remove();
}

async function saveClassSetup() {
  const clsRaw = document.getElementById('setupClass').value || '8';
  const cls = clsRaw + '. Sınıf';
  const user = auth.currentUser;
  if (user) {
    await db.collection('users').doc(user.uid).update({ classroom: cls });
    window.currentUserData = {...(window.currentUserData||{}), classroom: cls};
    closeModal('classSetupModal');
    const school = window.currentUserData.school || '';
    document.getElementById('menuRole') && (document.getElementById('menuRole').textContent = `${cls} • ${school}`);
    showToast('✅', `Sınıfın ${cls} olarak kaydedildi!`);
  }
}


// ── SOLO ÖĞRENCİ KAYIT ───────────────────────────────────────
function showRegisterSolo() {
  ['soloName','soloEmail','soloPass','soloPass2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const errEl = document.getElementById('soloError');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
  const msg = document.getElementById('soloSifreMsg');
  if (msg) msg.style.display = 'none';
  document.getElementById('soloClass').value = '8';
  document.getElementById('soloHedefPuan').value = '';
  document.getElementById('soloHedefOkul').value = '';
  openModal('soloRegisterModal');
}

async function doRegisterSolo() {
  const name  = document.getElementById('soloName').value.trim();
  const email = document.getElementById('soloEmail').value.trim();
  const pass  = document.getElementById('soloPass').value;
  const pass2 = document.getElementById('soloPass2').value;
  const sinif = document.getElementById('soloClass').value;
  const hedefPuan = document.getElementById('soloHedefPuan').value.trim();
  const hedefOkul = document.getElementById('soloHedefOkul').value.trim();
  const errEl = document.getElementById('soloError');
  errEl.style.display = 'none';

  if (!name || !email || !pass) { errEl.textContent = 'Ad, e-posta ve şifre zorunludur.'; errEl.style.display='block'; return; }
  if (pass.length < 6) { errEl.textContent = 'Şifre en az 6 karakter olmalı.'; errEl.style.display='block'; return; }
  if (pass !== pass2) { errEl.textContent = 'Şifreler uyuşmuyor.'; errEl.style.display='block'; return; }

  const btn = document.getElementById('soloBtnKayit');
  if (btn) { btn.textContent = 'Kaydediliyor...'; btn.disabled = true; }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    const uid  = cred.user.uid;
    const now  = new Date();
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const profileData = {
      name, email,
      role: 'solo_student',
      sinif,
      hedefPuan: hedefPuan || '',
      hedefOkul: hedefOkul || '',
      trial: {
        startedAt: now,
        endsAt: trialEnd,
        expired: false,
      },
      subscription: { plan: 'none', status: 'trial' },
      createdAt: now,
    };

    await db.collection('pendingRegistrations').doc(uid).set(profileData);
    await cred.user.sendEmailVerification({ url: window.location.origin + window.location.pathname });
    await auth.signOut();
    closeModal('soloRegisterModal');

    setTimeout(() => {
      const el = document.getElementById('dogrulamaEkrani');
      if (el) {
        el.style.display = 'flex';
        const emailEl = document.getElementById('dogrulamaEmailGoster');
        if (emailEl) emailEl.textContent = email;
        window._dogrulamaEmail = email;
        window._dogrulamaPass  = pass;
      }
    }, 300);

  } catch(e) {
    errEl.textContent = _trHata(e.code);
    errEl.style.display = 'block';
  } finally {
    if (btn) { btn.textContent = 'Hesap Oluştur →'; btn.disabled = false; }
  }
}

function soloSifreMesaj() {
  const p1 = document.getElementById('soloPass')?.value || '';
  const p2 = document.getElementById('soloPass2')?.value || '';
  const msg = document.getElementById('soloSifreMsg');
  if (!msg || !p2) { if (msg) msg.style.display='none'; return; }
  if (p1 === p2) {
    msg.textContent = '✓ Şifreler uyuşuyor';
    msg.style.color = '#2d9e5a';
    msg.style.display = 'block';
  } else {
    msg.textContent = '✗ Şifreler uyuşmuyor';
    msg.style.color = '#cc3355';
    msg.style.display = 'block';
  }
}

// Trial süre kontrolü — süresi dolmuşsa true döner
function soloTrialBitti(userData) {
  if (!userData || userData.role !== 'solo_student') return false;
  if (userData.subscription?.status === 'active') return false;
  const endsAt = userData.trial?.endsAt;
  if (!endsAt) return false;
  const bitis = endsAt.toDate ? endsAt.toDate() : new Date(endsAt);
  return new Date() > bitis;
}
