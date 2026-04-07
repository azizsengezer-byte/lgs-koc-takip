// ── ŞİFRE SIFIRLAMA ──────────────────────────────────────────
function ogrenciSifreSifirla(uid, isim, username) {
  // Rastgele 8 haneli şifre üret
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const yeniSifre = Array.from({length:8}, ()=>chars[Math.floor(Math.random()*chars.length)]).join('');

  const modal = document.createElement('div');
  modal.id = '_sifreModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:24px 20px 32px">
      <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 18px"></div>
      <div style="font-size:1rem;font-weight:800;margin-bottom:4px">🔑 Yeni Şifre Ata</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:16px">${isim} için yeni şifre belirle</div>

      <div style="background:var(--surface2);border-radius:12px;padding:14px;margin-bottom:14px">
        <div style="font-size:0.7rem;color:var(--text2);font-weight:700;margin-bottom:6px">KULLANICI ADI</div>
        <div style="font-size:0.95rem;font-weight:800;color:var(--text);margin-bottom:12px">${username}</div>
        <div style="font-size:0.7rem;color:var(--text2);font-weight:700;margin-bottom:6px">YENİ ŞİFRE</div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:1.1rem;font-weight:900;color:var(--accent);letter-spacing:.08em" id="_yeniSifre">${yeniSifre}</div>
          <button onclick="_sifreYenile()" style="padding:5px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:0.72rem;font-weight:700;cursor:pointer;font-family:inherit;color:var(--text2)">🔄 Yenile</button>
        </div>
      </div>

      <div style="font-size:0.72rem;color:#f9a825;background:#f9a82510;border:1px solid #f9a82530;border-radius:8px;padding:8px 10px;margin-bottom:14px">
        ⚠️ Şifreyi atadıktan sonra bu ekranı kapat ve öğrenciye ilet. Bir daha gösterilmeyecek.
      </div>

      <button onclick="_sifreUygula('${uid}','${isim}','${username}')" id="_sifreUygulaBtn"
        style="width:100%;padding:13px;border:none;border-radius:13px;background:var(--accent);color:#fff;font-size:0.9rem;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px">
        ✓ Şifreyi Ata &amp; Paylaş
      </button>
      <button onclick="document.getElementById('_sifreModal').remove()"
        style="width:100%;padding:11px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit">
        İptal
      </button>
    </div>`;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
  window._sifreSon = yeniSifre;
}

function _sifreYenile() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const yeni = Array.from({length:8}, ()=>chars[Math.floor(Math.random()*chars.length)]).join('');
  window._sifreSon = yeni;
  const el = document.getElementById('_yeniSifre');
  if (el) el.textContent = yeni;
}

async function _sifreUygula(uid, isim, username) {
  const sifre = window._sifreSon;
  if (!sifre) return;
  const btn = document.getElementById('_sifreUygulaBtn');
  if (btn) { btn.textContent = 'Uygulanıyor...'; btn.disabled = true; }

  try {
    // Firebase Admin SDK olmadan şifre değiştirme:
    // Öğrenci e-postasını Firestore'dan bul, secondary auth ile giriş yap ve şifreyi güncelle
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) throw new Error('Öğrenci bulunamadı');
    const email = snap.data().email;

    // Secondary app ile öğrenci hesabına giriş yap
    let secondaryApp;
    try { secondaryApp = firebase.app('secondary'); }
    catch(e) { secondaryApp = firebase.initializeApp(firebase.app().options, 'secondary'); }
    const secAuth = secondaryApp.auth();

    // Mevcut şifreyi Firestore'dan al (şifreyi plaintext saklıyoruz öğrenci için)
    const mevcutSifre = snap.data().plainPass || '';
    if (!mevcutSifre) throw new Error('Mevcut şifre kayıtlı değil. Öğrenciyi silip tekrar ekleyin.');

    const secCred = await secAuth.signInWithEmailAndPassword(email, mevcutSifre);
    await secCred.user.updatePassword(sifre);
    await secAuth.signOut();

    // Yeni şifreyi Firestore'a kaydet
    await db.collection('users').doc(uid).update({ plainPass: sifre });

    document.getElementById('_sifreModal')?.remove();

    // Paylaşım modalını aç
    const loginLink = window.location.origin + window.location.pathname + '?u=' + username;
    document.getElementById('payUname').textContent = username;
    document.getElementById('payPass').textContent = sifre;
    document.getElementById('payLink').textContent = loginLink;
    openModal('paylasimModal');

  } catch(e) {
    showToast('❌', e.message || 'Şifre güncellenemedi');
    if (btn) { btn.textContent = '✓ Şifreyi Ata & Paylaş'; btn.disabled = false; }
  }
}

// ── SWIPE KART FONKSİYONLARI ─────────────────────────────────
let _swipeTxStart = 0;

function _swipeTouchStart(e, uid) {
  _swipeTxStart = e.touches[0].clientX;
}

function _swipeTouchEnd(e, uid) {
  const dx = e.changedTouches[0].clientX - _swipeTxStart;
  const f = document.getElementById('sf_' + uid);
  if (!f) return;
  if (dx < -40) { _swipeCloseAll(); f.classList.add('swipe-open'); }
  else if (dx > 20) f.classList.remove('swipe-open');
}

function _swipeTap(uid, name) {
  const f = document.getElementById('sf_' + uid);
  if (!f) return;
  if (f.classList.contains('swipe-open')) {
    f.classList.remove('swipe-open');
  } else {
    _swipeCloseAll();
    openStudentAnalysis(name);
  }
}

function _swipeClose(uid) {
  const f = document.getElementById('sf_' + uid);
  if (f) f.classList.remove('swipe-open');
}

function _swipeCloseAll() {
  document.querySelectorAll('.swipe-front').forEach(f => f.classList.remove('swipe-open'));
}

// Dışarı tıklayınca kapat
document.addEventListener('click', e => {
  if (!e.target.closest('.swipe-wrap')) _swipeCloseAll();
});
