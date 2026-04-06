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
  const teacherNav = [
    {id:'dashboard',icon:'📊',label:'Panel'},
    {id:'students',icon:'👥',label:'Öğrenciler'},
    {id:'tasks-teacher',icon:'📋',label:'Görevler'},
    {id:'messages',icon:'💬',label:'Mesaj'},
  ];
  const studentNavAll = [
    {id:'dashboard',  icon:'🏠', label:'Ana Sayfa'},
    {id:'daily-entry',icon:'✏️', label:'Giriş Yap'},
    ...(window.RC_MACERA_AKTIF !== false ? [{id:'macera', icon:'🚀', label:'Koloni'}] : []),
    {id:'my-tasks',   icon:'📋', label:'Ödevler'},
    ...(window.RC_MARKET_AKTIF !== false ? [{id:'market', icon:'🛒', label:'Market'}] : []),
  ];
  const studentNav = studentNavAll;
  const items = currentRole==='teacher' ? teacherNav : studentNav;
  const unreadMsg = (currentRole==='teacher' ? teacherNotifs : studentNotifs).filter(n=>!n.read&&n.type==='message').length;
  const pendingTaskCount = currentRole==='student' ? tasks.filter(t=>!t.done).length : 0;
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
  lgs_tarihi:          '2026-06-13T09:30:00+03:00',
  lgs_sinav_adi:       '2026 LGS',
  lgs_turkce_soru:     '20',
  lgs_mat_soru:        '20',
  lgs_fen_soru:        '20',
  lgs_inkilap_soru:    '10',
  lgs_ing_soru:        '10',
  lgs_din_soru:        '10',
  // Özellik flag'leri (true/false string)
  macera_aktif:        'true',
  market_aktif:        'true',
  ai_rapor_aktif:      'true',
  wellness_aktif:      'true',
  // Oyun değerleri
  gunluk_soru_hedefi:  '200',
  seri_bonus_gun:      '7',
  max_ogrenci_sayisi:  '30',
  // Duyuru
  duyuru_aktif:        'false',
  duyuru_metni:        '',
  duyuru_tipi:         'info',
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
    window.LGS_TARIHI        = RC('lgs_tarihi')         || window.LGS_TARIHI;
    window.LGS_SINAV_ADI     = RC('lgs_sinav_adi')      || window.LGS_SINAV_ADI;
    window.RC_MACERA_AKTIF   = RCBool('macera_aktif');
    window.RC_MARKET_AKTIF   = RCBool('market_aktif');
    window.RC_AI_RAPOR_AKTIF = RCBool('ai_rapor_aktif');
    window.RC_WELLNESS_AKTIF = RCBool('wellness_aktif');
    window.RC_GUNLUK_HEDEF   = RCNum('gunluk_soru_hedefi');
    window.RC_SERI_BONUS_GUN = RCNum('seri_bonus_gun');
    window.RC_MAX_OGRENCI    = RCNum('max_ogrenci_sayisi');
    window.RC_DUYURU_AKTIF   = RCBool('duyuru_aktif');
    window.RC_DUYURU_METNI   = RC('duyuru_metni');
    window.RC_DUYURU_TIPI    = RC('duyuru_tipi');
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
      // Çerçeveyi uygula — önce Firestore'dan oku
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

