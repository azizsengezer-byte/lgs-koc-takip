// ── EmailJS OTP Konfigürasyonu ─────────────────────────────────
// emailjs.com'da ücretsiz hesap aç, aşağıdaki değerleri doldur:
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
// EmailJS template değişkenleri: {{to_email}}, {{otp_code}}, {{user_name}}

let _otpCode = '';
let _otpEmail = '';
let _otpPendingUid = '';
let _otpPendingData = null;
let _otpTimerInterval = null;

function _otpGenerate() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function _otpSend(email, code, name) {
  if (typeof emailjs === 'undefined') return false;
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: email, otp_code: code, user_name: name || 'Kullanıcı'
    });
    return true;
  } catch(e) { console.log('EmailJS hata:', e); return false; }
}

async function _otpStore(uid, code) {
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  await db.collection('otpVerifications').doc(uid).set({
    code, expires, used: false, createdAt: new Date()
  });
}

function _otpTimerStart() {
  let sn = 120;
  const el = document.getElementById('otpTimer');
  const rb = document.getElementById('otpResendBtn');
  clearInterval(_otpTimerInterval);
  _otpTimerInterval = setInterval(() => {
    sn--;
    if (el) {
      const m = Math.floor(sn/60).toString().padStart(2,'0');
      const s = (sn%60).toString().padStart(2,'0');
      el.textContent = m+':'+s;
    }
    if (sn <= 0) {
      clearInterval(_otpTimerInterval);
      if (el) el.textContent = '00:00';
      if (rb) { rb.disabled=false; rb.style.color='#6c63ff'; rb.style.borderColor='#6c63ff44'; rb.style.cursor='pointer'; }
    }
  }, 1000);
}

function otpInput(el, idx) {
  el.value = el.value.replace(/[^0-9]/g,'');
  const boxes = document.querySelectorAll('.otp-box');
  if (el.value && idx < 5) boxes[idx+1].focus();
}

function otpKey(e, el, idx) {
  const boxes = document.querySelectorAll('.otp-box');
  if (e.key === 'Backspace' && !el.value && idx > 0) { boxes[idx-1].focus(); boxes[idx-1].value=''; }
}

function otpGeriDon() {
  document.getElementById('otpModal').style.display = 'none';
  clearInterval(_otpTimerInterval);
}

async function otpDogrula() {
  const boxes = document.querySelectorAll('.otp-box');
  const girilen = Array.from(boxes).map(b=>b.value).join('');
  const errEl = document.getElementById('otpError');
  errEl.style.display = 'none';
  if (girilen.length < 6) { errEl.textContent = 'Lütfen 6 haneli kodu eksiksiz gir.'; errEl.style.display='block'; return; }
  if (girilen !== _otpCode) {
    errEl.textContent = 'Kod yanlış. Tekrar dene.';
    errEl.style.display = 'block';
    boxes.forEach(b => { b.style.borderColor='#ff6584'; b.value=''; });
    setTimeout(()=>{ boxes.forEach(b=>b.style.borderColor='#e0e2eb'); boxes[0].focus(); }, 1200);
    return;
  }
  try {
    await db.collection('otpVerifications').doc(_otpPendingUid).update({ used:true, verifiedAt:new Date() });
    await db.collection('users').doc(_otpPendingUid).update({ emailVerified:true });
  } catch(e) {}
  clearInterval(_otpTimerInterval);
  document.getElementById('otpModal').style.display = 'none';
  showToast('🎉', 'Hesabın doğrulandı! Şimdi giriş yapabilirsin.');
}

async function otpTekrarGonder() {
  const rb = document.getElementById('otpResendBtn');
  if (rb) { rb.disabled=true; rb.style.color='#ccc'; rb.style.cursor='not-allowed'; }
  _otpCode = _otpGenerate();
  try {
    await _otpStore(_otpPendingUid, _otpCode);
    const sent = await _otpSend(_otpEmail, _otpCode, (_otpPendingData||{}).name||'');
    if (!sent) showToast('🔑', 'Geliştirme modu — OTP: '+_otpCode, 8000);
    _otpTimerStart();
    document.querySelectorAll('.otp-box').forEach(b=>b.value='');
    document.getElementById('otpError').style.display='none';
    showToast('✅', 'Yeni kod gönderildi!');
  } catch(e) { showToast('⚠️', 'Gönderilemedi.'); }
}

function _otpEkraniAc(email) {
  const el = document.getElementById('otpModal');
  if (!el) return;
  el.style.display = 'flex';
  document.getElementById('otpEmail').textContent = email;
  document.querySelectorAll('.otp-box').forEach(b=>b.value='');
  document.getElementById('otpError').style.display='none';
  const rb = document.getElementById('otpResendBtn');
  if (rb) { rb.disabled=true; rb.style.color='#ccc'; rb.style.borderColor='#e0e2eb'; rb.style.cursor='not-allowed'; }
  _otpTimerStart();
  setTimeout(()=>document.querySelector('.otp-box')?.focus(), 300);
}

function selectRole(r) {
  currentRole = r;
  document.getElementById('roleTeacher').classList.toggle('active', r==='teacher');
  document.getElementById('roleStudent').classList.toggle('active', r==='student');
}

function showRegister() {
  // Formu tamamen sıfırla
  ['regName','regEmail','regPass','regPass2','regSchool'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('regRole').value = 'student';
  document.getElementById('regBranch').value = '';
  document.getElementById('regBranchLabel').textContent = '— Branş seçin —';
  document.getElementById('regClass').value = '8';
  document.getElementById('regClassLabel').textContent = '8. Sınıf';
  const errEl = document.getElementById('regError');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
  const msg = document.getElementById('sifreUyumMsg');
  if (msg) msg.style.display = 'none';
  // Şifre alanlarını gizli yap
  ['regPass','regPass2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.type = 'password';
  });
  // Rol butonlarını sıfırla — öğrenci varsayılan
  secRolKart('student');
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
  const role  = document.getElementById('regRole').value;
  const errEl = document.getElementById('regError');
  errEl.style.display = 'none';

  if (!name || !email || !pass) { errEl.textContent = 'Tüm alanları doldurunuz.'; errEl.style.display='block'; return; }
  if (!role) { errEl.textContent = 'Lütfen öğretmen veya öğrenci rolünü seçiniz.'; errEl.style.display='block'; return; }
  if (pass.length < 6) { errEl.textContent = 'Şifre en az 6 karakter olmalı.'; errEl.style.display='block'; return; }
  if (pass !== pass2) { errEl.textContent = 'Şifreler uyuşmuyor. Lütfen kontrol edin.'; errEl.style.display='block'; return; }

  const branch   = role==='teacher' ? (document.getElementById('regBranch').value || '') : '';
  const school   = role==='teacher' ? (document.getElementById('regSchool').value.trim() || '') : '';
  const classRaw = role==='student' ? (document.getElementById('regClass').value || '8') : '';
  const classroom = classRaw ? classRaw + '. Sınıf' : '';
  if (role==='teacher' && !school) { errEl.textContent = 'Okul adı giriniz.'; errEl.style.display='block'; return; }

  const btn = document.querySelector('#registerModal .btn-primary') ||
              document.querySelector('#registerModal button[onclick="doRegister()"]');
  if (btn) { btn.textContent = 'Kaydediliyor...'; btn.disabled = true; }

  try {
    window._regPassTemp = pass; // "tekrar gönder" için geçici sakla
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await db.collection('users').doc(cred.user.uid).set({
      name, email, role, branch, school, classroom, photo:'', createdAt: new Date()
    });

    // Sadece öğretmenler için OTP doğrulama
    if (role === 'teacher') {
      _otpCode = _otpGenerate();
      _otpEmail = email;
      _otpPendingUid = cred.user.uid;
      _otpPendingData = { name };
      try {
        await _otpStore(cred.user.uid, _otpCode);
        const sent = await _otpSend(email, _otpCode, name);
        if (!sent) showToast('🔑', 'EmailJS kurulmadı — geliştirme kodu: '+_otpCode, 8000);
      } catch(e) { console.log('OTP hata:', e); }
      await auth.signOut();
      closeModal('registerModal');
      setTimeout(()=>_otpEkraniAc(email), 350);
    } else {
      closeModal('registerModal');
      showToast('🎉', `Hoş geldin ${name}! Hesabın oluşturuldu.`);
    }
  } catch(e) {
    const msgs = {
      'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı.',
      'auth/invalid-email': 'Geçersiz e-posta adresi.',
      'auth/weak-password': 'Şifre çok zayıf, en az 6 karakter olmalı.',
    };
    errEl.textContent = msgs[e.code] || 'Kayıt başarısız: ' + e.message;
    errEl.style.display = 'block';
  } finally {
    if (btn) { btn.textContent = 'Kayıt Ol →'; btn.disabled = false; }
  }
}

function dogrulamaKapat() {
  const el = document.getElementById('dogrulamaModal');
  if (el) el.style.display = 'none';
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

