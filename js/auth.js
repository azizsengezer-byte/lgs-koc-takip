function selectRole(r) {
  currentRole = r;
  document.getElementById('roleTeacher').classList.toggle('active', r==='teacher');
  document.getElementById('roleStudent').classList.toggle('active', r==='student');
}

function showRegister() {
  // Kayıt formunu sıfırla - varsayılan seçim yok
  document.getElementById('regRole').value = '';
  document.getElementById('regRoleLabel').textContent = '— Rol seçin —';
  document.getElementById('teacherFields').style.display = 'none';
  document.getElementById('studentFields').style.display = 'none';
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
    // onAuthStateChanged devralır
  } catch(e) {
    btn.textContent = 'Giriş Yap →'; btn.disabled = false;
    const msgs = {
      'auth/user-not-found': 'Hesap bulunamadı.',
      'auth/wrong-password': 'Şifre yanlış, tekrar deneyin.',
      'auth/invalid-email': 'Geçersiz giriş bilgisi.',
      'auth/invalid-credential': 'Kullanıcı adı/e-posta veya şifre hatalı.',
    };
    errEl.textContent = msgs[e.code] || 'Giriş başarısız: ' + e.message;
    errEl.style.display = 'block';
  }
}

async function doRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value;
  const role = document.getElementById('regRole').value;
  const errEl = document.getElementById('regError');
  errEl.style.display = 'none';
  if (!name || !email || !pass) { errEl.textContent = 'Tüm alanları doldurunuz.'; errEl.style.display='block'; return; }
  if (!role) { errEl.textContent = 'Lütfen öğretmen veya öğrenci rolünü seçiniz.'; errEl.style.display='block'; return; }
  if (pass.length < 6) { errEl.textContent = 'Şifre en az 6 karakter olmalı.'; errEl.style.display='block'; return; }
  const branch = role==='teacher' ? (document.getElementById('regBranch').value || '') : '';
  const school = role==='teacher' ? (document.getElementById('regSchool').value.trim() || '') : '';
  const classRaw = role==='student' ? (document.getElementById('regClass').value || '8') : '';
  const classroom = classRaw ? classRaw + '. Sınıf' : '';
  if (role==='teacher' && !school) { errEl.textContent = 'Okul adı giriniz.'; errEl.style.display='block'; return; }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await db.collection('users').doc(cred.user.uid).set({ name, email, role, branch, school, classroom, photo:'', createdAt: new Date() });
    closeModal('registerModal');
    showToast('🎉', `Hoş geldin ${name}! Hesabın oluşturuldu.`);
  } catch(e) {
    const msgs = {
      'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı.',
      'auth/invalid-email': 'Geçersiz e-posta adresi.',
      'auth/weak-password': 'Şifre çok zayıf.',
    };
    errEl.textContent = msgs[e.code] || 'Kayıt başarısız: ' + e.message;
    errEl.style.display = 'block';
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

