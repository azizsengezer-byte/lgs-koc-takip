let currentRole = 'teacher';
let currentPage = 'dashboard';

const subjects = [
  { name:'Türkçe', color:'var(--turkish)', cls:'turkish', icon:'📖' },
  { name:'Matematik', color:'var(--math)', cls:'math', icon:'📐' },
  { name:'Fen Bilimleri', color:'var(--science)', cls:'science', icon:'🔬' },
  { name:'İnkılap Tarihi', color:'var(--history)', cls:'history', icon:'🏛️' },
  { name:'Din Kültürü', color:'var(--religion)', cls:'religion', icon:'☪️' },
  { name:'İngilizce', color:'var(--english)', cls:'english', icon:'🌍' },
];

let students = [];

const weekDays = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const subjectProgress = [0, 0, 0, 0, 0, 0];
const subjectProgressT = [0, 0, 0, 0, 0, 0];

const kazanimlar = {
  'Türkçe': [
    'Fiilimsiler', 'Cümlenin Ögeleri', 'Fiil Çatısı', 'Sözcükte Anlam',
    'Cümlede Anlam', 'Deyimler ve Atasözü', 'Cümle Çeşitleri',
    'Yazım Kuralları', 'Paragraf', 'Sözel Muhakeme/Görsel Okuma',
    'Noktalama İşaretleri', 'Anlatım Bozuklukları', 'Söz Sanatları', 'Metin Türleri',
  ],
  'Matematik': [
    'Çarpanlar ve Katlar', 'Üslü İfadeler', 'Kareköklü İfadeler', 'Veri Analizi',
    'Basit Olayların Olma Olasılığı', 'Cebirsel İfadeler ve Özdeşlikler',
    'Doğrusal Denklemler', 'Eşitsizlikler', 'Üçgenler',
    'Eşlik ve Benzerlik', 'Dönüşüm Geometrisi', 'Geometrik Cisimler',
  ],
  'Fen Bilimleri': [
    { unite: 'Mevsimler ve İklim', alt: ['Mevsimlerin Oluşumu', 'İklim ve Hava Hareketleri'] },
    { unite: 'DNA ve Genetik Kod', alt: ['DNA ve Genetik Kod', 'Kalıtım', 'Mutasyon ve Modifikasyon', 'Adaptasyon (Çevreye Uyum)', 'Biyoteknoloji'] },
    { unite: 'Basınç', alt: [] },
    { unite: 'Madde ve Endüstri', alt: ['Periyodik Sistem', 'Fiziksel ve Kimyasal Değişimler', 'Kimyasal Tepkimeler', 'Asitler ve Bazlar', 'Maddenin Isı ile Etkileşimi', "Türkiye'de Kimya Endüstrisi"] },
    { unite: 'Basit Makineler', alt: [] },
    { unite: 'Enerji Dönüşümleri ve Çevre Bilimi', alt: ['Besin Zinciri ve Enerji Akışı', 'Enerji Dönüşümleri', 'Madde Döngüleri ve Çevre Sorunları', 'Sürdürülebilir Kalkınma'] },
    { unite: 'Elektrik Yükleri ve Elektrik Enerjisi', alt: ['Elektrik Yükleri ve Elektriklenme', 'Elektrik Yüklü Cisimler', 'Elektrik Enerjisinin Dönüşümü'] },
  ],
  'İnkılap Tarihi': [
    'Bir Kahraman Doğuyor', 'Milli Uyanış - Bağımsızlık Yolunda Atılan Adımlar',
    'Milli Bir Destan - Ya İstiklal Ya Ölüm', 'Atatürkçülük ve Çağdaşlaşan Türkiye',
    'Demokratikleşme Çabaları', 'Atatürk Dönemi Türk Dış Politikası',
    'Atatürk\'ün Ölümü ve Sonrası',
  ],
  'Din Kültürü': [
    'Kader İnancı', 'Zekat ve Sadaka', 'Din ve Hayat',
    'Hz. Muhammed\'in Örnekliği', 'Kur\'an-ı Kerim ve Özellikleri',
  ],
  'İngilizce': [
    'Friendship', 'Teen Life', 'In The Kitchen', 'On The Phone',
    'The Internet', 'Adventures', 'Tourism', 'Chores', 'Science', 'Natural Forces',
  ],
};

let kazanimDone = {};

// Türkiye saatine göre bugünün tarihini döndürür (UTC+3)
function getTodayKey() {
  const now = new Date();
  const tr = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  return tr.toISOString().split('T')[0];
}
function getDateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const tr = new Date(d.getTime() + 3 * 60 * 60 * 1000);
  return tr.toISOString().split('T')[0];
}

function renderMobileNav() {
  const nav = document.getElementById('mobileNav');
  if(!nav) return;
  const _m = p => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const MI = {
    grid:   _m('<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>'),
    users:  _m('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    check:  _m('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
    msg:    _m('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
    home:   _m('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
    pencil: _m('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'),
    rocket: _m('<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'),
    cal:    _m('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
    cart:   _m('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),
  };
  const teacherNav = [
    {id:'dashboard',     icon:MI.grid,  label:'Panel'},
    {id:'students',      icon:MI.users, label:'Öğrenciler'},
    {id:'tasks-teacher', icon:MI.check, label:'Görevler'},
    {id:'takvim',        icon:MI.cal,   label:'Takvim'},
  ];
  const studentNavAll = [
    {id:'dashboard',   icon:MI.home,   label:'Ana Sayfa'},
    {id:'daily-entry', icon:MI.pencil, label:'Giriş Yap'},
    ...(window.RC_MACERA_AKTIF !== false ? [{id:'macera', icon:MI.rocket, label:'Koloni'}] : []),
    {id:'my-tasks',    icon:MI.check,  label:'Ödevler'},
    ...(window.RC_MARKET_AKTIF !== false ? [{id:'market', icon:MI.cart, label:'Market'}] : []),
  ];
  const studentNav = studentNavAll;
  const items = currentRole==='teacher' ? teacherNav : studentNav;
  const unreadMsg = (currentRole==='teacher' ? teacherNotifs : studentNotifs).filter(n=>!n.read&&n.type==='message').length;
  const pendingTaskCount = currentRole==='student' ? tasks.filter(t=>!t.done && t.tip!=='takvim').length : 0;
  nav.innerHTML = `<div class="mobile-nav-inner">${items.map(n=>{
    let badge = '';
    if(n.id==='messages' && unreadMsg>0) badge=`<span class="nav-badge">${unreadMsg>9?'9+':unreadMsg}</span>`;
    if(n.id==='my-tasks' && pendingTaskCount>0) badge=`<span class="nav-badge">${pendingTaskCount>9?'9+':pendingTaskCount}</span>`;
    return `<button class="mobile-nav-item ${currentPage===n.id?'active':''}" onclick="showPage('${n.id}')">
      <span class="nav-icon-wrap">${n.icon}${badge}</span><span>${n.label}</span>
    </button>`;
  }).join('')}</div>`;

  // Header mesaj badge güncelle
  _updateMsgBadge(unreadMsg);
}

function _updateMsgBadge(count) {
  const el = document.getElementById('msgBadge');
  if (!el) return;
  if (count > 0) {
    el.style.display = 'flex';
    el.textContent = count > 9 ? '9+' : count;
  } else {
    el.style.display = 'none';
  }
}

// ── Swipe ile sayfa geçişi ───────────────────────────────
let _swipeStartX = 0, _swipeStartY = 0, _swiping = false;

function _initSwipeNav() {
  const main = document.getElementById('mainContent');
  if (!main || main._swipeInit) return;
  main._swipeInit = true;

  main.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    // Yatay scroll olan bir eleman içindeyse swipe'ı engelle
    const t = e.target;
    if (t.closest('[ontouchstart]') || t.closest('.chat-messages') || t.closest('#mKatBar')) {
      _swiping = false;
      return;
    }
    _swipeStartX = e.touches[0].clientX;
    _swipeStartY = e.touches[0].clientY;
    _swiping = true;
  }, { passive: true });

  main.addEventListener('touchend', e => {
    if (!_swiping) return;
    _swiping = false;
    const dx = e.changedTouches[0].clientX - _swipeStartX;
    const dy = e.changedTouches[0].clientY - _swipeStartY;
    // Yatay swipe mi? (dikey scroll'u engelleme)
    if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx) * 0.6) return;

    const navItems = currentRole === 'teacher'
      ? ['dashboard','students','tasks-teacher','messages']
      : ['dashboard','daily-entry','macera','my-tasks','market'];
    const idx = navItems.indexOf(currentPage);
    if (idx === -1) return;

    if (dx < -80 && idx < navItems.length - 1) {
      showPage(navItems[idx + 1]);
    } else if (dx > 80 && idx > 0) {
      showPage(navItems[idx - 1]);
    }
  }, { passive: true });
}

// Uygulama başladığında swipe'ı aktifle

// ── SERVICE WORKER postMessage DİNLEYİCİ ──────────────────────
// Uygulama açıkken telefon bildirimine tıklanınca SW bu mesajı gönderir
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function(event) {
    const msg = event.data;
    if (!msg || msg.type !== 'NOTIF_NAVIGATE') return;
    const data = msg.data || {};
    const type = data.notifType || '';
    const actionUrl = msg.actionUrl || '';

    // URL parametrelerini parse et
    try {
      const url = new URL(actionUrl, window.location.origin);
      const p = url.searchParams.get('p');
      const s = url.searchParams.get('s');
      const highlight = url.searchParams.get('highlight');

      if (highlight) window._pendingHighlightBadge = decodeURIComponent(highlight);
      if (data.notifType === 'odul') window._pendingOdulAc = true;
      if (s) selectedStudentName = decodeURIComponent(s);
      if (p) showPage(p);
    } catch(e) {
      console.log('SW navigate parse error:', e);
    }
  });
}

// ── URL PARAMETRELERİNDEN HIGHLIGHT OKUMA ────────────────────
// Uygulama kapalıyken bildirime tıklanıp açılınca URL'den yönlendirme
function _applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const highlight = params.get('highlight');
  const odul = params.get('odul');
  if (highlight) window._pendingHighlightBadge = decodeURIComponent(highlight);
  if (odul === '1') window._pendingOdulAc = true;
}
_applyUrlParams();

document.addEventListener('DOMContentLoaded', () => setTimeout(_initSwipeNav, 500));

let studyEntries = [];

let tasks = [];

// =================== FIREBASE ===================
const firebaseConfig = {
  apiKey: "AIzaSyArOWE7RqwK7pjUijS590NOUXx7z0gFxrw",
  authDomain: "lgs-koc-takip.firebaseapp.com",
  projectId: "lgs-koc-takip",
  storageBucket: "lgs-koc-takip.firebasestorage.app",
  messagingSenderId: "131005537763",
  appId: "1:131005537763:web:69b7171c9099358b00d4d6",
  measurementId: "G-VTH5M5PMMQ"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ── REMOTE CONFIG ──────────────────────────────────────────────
// LGS tarihi ve diğer dinamik değerleri Firebase'den çeker.
// Firebase Console → Remote Config → Parametre ekle:
//   lgs_tarihi    → "2026-06-13T09:30:00+03:00"
//   lgs_sinav_adi → "2026 LGS"
const remoteConfig = firebase.remoteConfig();
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 saat cache

// Varsayılan değerler — Remote Config'e erişilemezse bunlar kullanılır
remoteConfig.defaultConfig = {
  // Sınav
  lgsTarihi:          '2026-06-13T09:30:00+03:00',
  lgsSinavAdi:       '2026 LGS',
  lgsTurkceSoru:     '20',
  lgsMatSoru:        '20',
  lgsFenSoru:        '20',
  lgsInkilapSoru:    '10',
  lgsIngSoru:        '10',
  lgsDinSoru:        '10',
  // Özellik flag'leri (true/false string)
  maceraAktif:        'true',
  marketAktif:        'true',
  aiRaporAktif:      'true',
  wellnessAktif:      'true',
  // Oyun değerleri
  gunlukSoruHedefi:  '200',
  seriBonusGun:      '7',
  maxOgrenciSayisi:  '30',
  // Duyuru
  duyuruAktif:        'false',
  duyuruMetni:        '',
  duyuruTipi:         'info',
};

// Remote Config değerlerine kolay erişim
function RC(key) {
  return remoteConfig.getValue(key).asString() || remoteConfig.defaultConfig[key] || '';
}
function RCBool(key) {
  const v = RC(key);
  return v === 'true' || v === '1';
}
function RCNum(key) {
  return parseInt(RC(key)) || parseInt(remoteConfig.defaultConfig[key]) || 0;
}

// Global değişkenler — tüm dosyalar buradan okur
window.LGS_TARIHI          = remoteConfig.defaultConfig.lgs_tarihi;
window.LGS_SINAV_ADI       = remoteConfig.defaultConfig.lgs_sinav_adi;
window.RC_MACERA_AKTIF     = true;
window.RC_MARKET_AKTIF     = true;
window.RC_AI_RAPOR_AKTIF   = true;
window.RC_WELLNESS_AKTIF   = true;
window.RC_GUNLUK_HEDEF     = 200;
window.RC_SERI_BONUS_GUN   = 7;
window.RC_MAX_OGRENCI      = 30;
window.RC_DUYURU_AKTIF     = false;
window.RC_DUYURU_METNI     = '';
window.RC_DUYURU_TIPI      = 'info';

// Uygulama açılışında Remote Config'i çek
async function remoteConfigYukle() {
  try {
    await remoteConfig.fetchAndActivate();
    window.LGS_TARIHI        = RC('lgsTarihi')         || window.LGS_TARIHI;
    window.LGS_SINAV_ADI     = RC('lgsSinavAdi')      || window.LGS_SINAV_ADI;
    window.RC_MACERA_AKTIF   = RCBool('maceraAktif');
    window.RC_MARKET_AKTIF   = RCBool('marketAktif');
    window.RC_AI_RAPOR_AKTIF = RCBool('aiRaporAktif');
    window.RC_WELLNESS_AKTIF = RCBool('wellnessAktif');
    window.RC_GUNLUK_HEDEF   = RCNum('gunlukSoruHedefi');
    window.RC_SERI_BONUS_GUN = RCNum('seriBonusGun');
    window.RC_MAX_OGRENCI    = RCNum('maxOgrenciSayisi');
    window.RC_DUYURU_AKTIF   = RCBool('duyuruAktif');
    window.RC_DUYURU_METNI   = RC('duyuruMetni');
    window.RC_DUYURU_TIPI    = RC('duyuruTipi');
    console.log('Remote Config yüklendi.');
  } catch(e) {
    console.log('Remote Config alınamadı, varsayılan kullanılıyor:', e.message);
  }
}
remoteConfigYukle().then(() => {
  // Duyuru varsa göster
  if (window.RC_DUYURU_AKTIF && window.RC_DUYURU_METNI) {
    const renkler = {
      info:    { bg:'#6c63ff18', border:'#6c63ff44', text:'#4340cc', icon:'ℹ️' },
      warning: { bg:'#f9ca2418', border:'#f9ca2444', text:'#a16207', icon:'⚠️' },
      success: { bg:'#43e97b18', border:'#43e97b44', text:'#2d9e5a', icon:'✅' },
    };
    const r = renkler[window.RC_DUYURU_TIPI] || renkler.info;
    const div = document.createElement('div');
    div.id = 'rc-duyuru';
    div.style.cssText = `position:fixed;top:0;left:0;right:0;z-index:9000;background:${r.bg};border-bottom:1px solid ${r.border};padding:10px 16px;display:flex;align-items:center;gap:10px`;
    div.innerHTML = `<span style="font-size:1rem">${r.icon}</span><span style="flex:1;font-size:0.82rem;color:${r.text};font-weight:600">${window.RC_DUYURU_METNI}</span><button onclick="document.getElementById('rc-duyuru').remove()" style="background:none;border:none;color:${r.text};cursor:pointer;font-size:1.1rem;padding:2px 6px">✕</button>`;
    document.body.appendChild(div);
  }
});

// Auth state listener
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      let doc = await db.collection('users').doc(user.uid).get();

      if (!doc.exists) {
        // users'da yok — pendingRegistrations'a bak
        const pending = await db.collection('pendingRegistrations').doc(user.uid).get();

        if (pending.exists && user.emailVerified) {
          // Doğrulandı! Veriyi users'a taşı
          await db.collection('users').doc(user.uid).set(pending.data());
          await db.collection('pendingRegistrations').doc(user.uid).delete();
          // Doğrulama ekranını kapat
          const el = document.getElementById('dogrulamaEkrani');
          if (el) el.style.display = 'none';
          doc = await db.collection('users').doc(user.uid).get();
        } else if (pending.exists && !user.emailVerified) {
          // E-posta henüz doğrulanmamış — doğrulama ekranını göster
          const userEmail = user.email || '';
          await auth.signOut();
          document.getElementById('app').style.display = 'none';
          document.getElementById('loginScreen').style.display = 'flex';
          if (window._hideSplash) window._hideSplash();
          // Doğrulama ekranını göster
          setTimeout(() => {
            const el = document.getElementById('dogrulamaEkrani');
            if (el) {
              el.style.display = 'flex';
              const emailEl = document.getElementById('dogrulamaEmailGoster');
              if (emailEl) emailEl.textContent = userEmail;
              window._dogrulamaEmail = userEmail;
            }
          }, 200);
          return;
        } else {
          // Hiçbir yerde kayıt yok — çıkış yap
          await auth.signOut();
          document.getElementById('app').style.display = 'none';
          document.getElementById('loginScreen').style.display = 'flex';
          if (window._hideSplash) window._hideSplash();
          return;
        }
      }

      // users koleksiyonunda olan kullanıcılar (eski veya yeni doğrulanmış)
      // doğrulama kontrolüne takılmaz — pendingRegistrations mekanizması yeni kullanıcıları zaten filtreliyor
      const data = doc.data();
      currentRole = data.role || 'student';
      window.currentUserData = { ...data, uid: user.uid };
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      // Splash'ı gizle
      const _sp = document.getElementById('splashScreen');
      if (_sp) { _sp.classList.add('sp-hidden'); setTimeout(() => _sp.remove(), 450); }
      document.getElementById('menuName') && (document.getElementById('menuName').textContent = data.name || user.email);
      const roleLabel = currentRole==='teacher'
        ? `Koç Öğretmen${data.branch?' • '+data.branch:''}`
        : `${data.classroom||''} • ${data.school||'Öğrenci'}`;
      document.getElementById('menuRole') && (document.getElementById('menuRole').textContent = roleLabel);
      if (data.photo) {
        document.getElementById('headerAvatar').style.backgroundImage = `url(${data.photo})`;
        document.getElementById('headerAvatar').style.backgroundSize = 'cover';
        document.getElementById('headerAvatar').textContent = '';
      } else {
        document.getElementById('headerAvatar').textContent = (data.name||user.email)[0].toUpperCase();
      }

      const todayKey = getTodayKey();

      if (currentRole === 'teacher') {
        // Öğrencileri çek
        try {
          const snap = await db.collection('users')
            .where('role','==','student')
            .where('teacherId','==',user.uid).get();
          students = [];
          const colors = ['#6c63ff','#ff6584','#43e97b','#f9ca24','#00b4d8','#ff9f43'];
          snap.forEach(d => {
            const s = d.data();
            students.push({
              uid: d.id, name: s.name, email: s.email,
              avg: s.avg||0, lastActive: s.lastActive||'Yeni',
              color: s.color || colors[students.length % colors.length],
              tasks: 0, classroom: s.classroom||'', school: s.school||'',
              photo: s.photo||'', etiket: s.etiket||''
            });
          });
        } catch(e) { console.log('Öğrenci çekme hatası:', e.message); }

        // Çalışma girişlerini çek — teacherId + her öğrencinin userId ile (en güvenilir yöntem)
        try {
          const entryMap = {};

          // 1. teacherId ile çek
          const eSnap = await db.collection('studyEntries')
            .where('teacherId','==',user.uid).get();
          eSnap.forEach(d => { entryMap[d.id] = { ...d.data(), id: d.id }; });

          // 2. Her öğrencinin userId'si ile çek (teacherId boş/farklı olsa bile yakalar)
          for (const student of students) {
            if (!student.uid) continue;
            try {
              const uSnap = await db.collection('studyEntries')
                .where('userId','==',student.uid).get();
              uSnap.forEach(d => {
                if (!entryMap[d.id]) {
                  entryMap[d.id] = { ...d.data(), id: d.id };
                  // teacherId eksikse arka planda güncelle
                  if (!d.data().teacherId) {
                    d.ref.update({ teacherId: user.uid }).catch(()=>{});
                  }
                }
              });
            } catch(e2) {}
          }

          studyEntries = Object.values(entryMap).map(e => ({
            ...e, isToday: e.dateKey === todayKey
          }));
          studyEntries.sort((a,b)=>(b.dateKey||'').localeCompare(a.dateKey||''));
        } catch(e) { console.log('Giriş çekme hatası:', e.message); studyEntries = []; }

        // Görevleri çek
        try {
          const tSnap = await db.collection('tasks')
            .where('teacherId','==',user.uid).get();
          tasks = [];
          tSnap.forEach(d => tasks.push({ ...d.data(), id: d.id }));
          tasks.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
        } catch(e) { console.log('Görev çekme hatası:', e.message); tasks = []; }
      }

      if (currentRole === 'student') {
        // Kendi girişlerini çek
        try {
          const eSnap = await db.collection('studyEntries')
            .where('userId','==',user.uid).get();
          studyEntries = [];
          eSnap.forEach(d => {
            const e = d.data();
            studyEntries.push({ ...e, firestoreId: d.id, isToday: e.dateKey === todayKey });
          });
          studyEntries.sort((a,b)=>(b.dateKey||'').localeCompare(a.dateKey||''));
        } catch(e) { console.log('Giriş çekme hatası:', e.message); studyEntries = []; }

        // Kendine atanan görevleri çek - UID üzerinden (güvenli)
        try {
          const tSnap = await db.collection('tasks')
            .where('studentUid','==',user.uid).get();
          tasks = [];
          tSnap.forEach(d => tasks.push({ ...d.data(), id: d.id }));
          // Eski kayıtlar için fallback: studentName ile de dene
          if (tasks.length === 0) {
            const tSnapOld = await db.collection('tasks')
              .where('studentName','==',data.name)
              .where('teacherId','==',data.teacherId||'').get();
            tSnapOld.forEach(d => tasks.push({ ...d.data(), id: d.id }));
          }
        } catch(e) { console.log('Görev çekme hatası:', e.message); tasks = []; }

        // Wellness verisini Firestore'dan yükle
        loadWellnessFromFirestore();
      }

      renderSidebar();
      // Rozet menü butonunu göster/gizle
      const _bmb = document.getElementById('badgeMenuBtn');
      if (_bmb) _bmb.style.display = currentRole==='student' ? 'flex' : 'none';
      const _oab = document.getElementById('okulArkadasBtn');
      if (_oab) _oab.style.display = currentRole==='student' ? 'flex' : 'none';
      const _prb = document.getElementById('programimBtn');
      if (_prb) _prb.style.display = currentRole==='student' ? 'flex' : 'none';
      if (currentRole==='student') {
        const badge = document.getElementById('planBadge');
        if (badge) badge.style.display = _haftalikPlanYeni && _haftalikPlanYeni() ? 'block' : 'none';
      }
      const _sab = document.getElementById('satinAlMenuBtn');
      if (_sab) _sab.style.display = currentRole==='teacher' ? 'flex' : 'none';      // Çerçeveyi uygula — önce Firestore'dan oku
      if (currentRole === 'student') {
        if (db) {
          db.collection('users').doc(user.uid).get().then(snap=>{
            if (snap.exists && snap.data().activeFrame) {
              localStorage.setItem('frame_'+user.uid, snap.data().activeFrame);
            }
            setTimeout(()=>applyProfileFrame(user.uid, getActiveFrame(user.uid)), 100);
          }).catch(()=>{
            setTimeout(()=>applyProfileFrame(user.uid, getActiveFrame(user.uid)), 100);
          });
        } else {
          setTimeout(()=>applyProfileFrame(user.uid, getActiveFrame(user.uid)), 100);
        }
        // Rozet sayacını göster
        getBadges(user.uid).then(earned=>{
          const el = document.getElementById('badgeCountBadge');
          if (el) el.textContent = earned.length + ' / ' + BADGES.length;
        });
        // Etiket varsa göster
        if (data.etiket && typeof _mEtiketUygula === 'function') {
          setTimeout(() => _mEtiketUygula(data.etiket), 1000);
        }
      }
      // Sayfa yenilenince son sayfaya dön (URL'den oku)
      const _urlParams = new URLSearchParams(window.location.search);
      const _urlPage = _urlParams.get('p');
      const _urlStudent = _urlParams.get('s');
      const _safePages = ['dashboard','students','student-detail','tasks-teacher','messages','notifs',
        'daily-entry','my-analysis','kazanimlar','my-tasks','wellness','lgs-dagilim','psych-report','macera',
        'market','profile','badges','rozet'];
      const _startPage = _safePages.includes(_urlPage) ? _urlPage : 'dashboard';
      if (_urlStudent) selectedStudentName = decodeURIComponent(_urlStudent);
      showPage(_startPage);
      startNotifListener();
      setTimeout(bildirimKontrolleriniCalistir, 3000);

      // Öğrenci sınıf seçmemişse sor
      if (currentRole==='student' && !data.classroom) {
        setTimeout(()=>{
          document.getElementById('setupSchool').value = data.school || '';
          openModal('classSetupModal');
        }, 600);
      }
    } catch(err) {
      console.log('Auth hata:', err.message);
      renderSidebar();
      showPage('dashboard');
      startNotifListener();
    }
  } else {
    document.getElementById('app').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    // Butonun takılı kalmaması için resetle
    const btn = document.getElementById('loginBtn');
    if (btn) { btn.textContent = 'Giriş Yap →'; btn.disabled = false; }
  }
});

