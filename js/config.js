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
    {id:'messages',icon:'💬',label:'Mesaj'},
    {id:'tasks-teacher',icon:'📋',label:'Görevler'},
  ];
  const studentNav = [
    {id:'dashboard',icon:'🏠',label:'Ana Sayfa'},
    {id:'daily-entry',icon:'✏️',label:'Giriş Yap'},
    {id:'macera',icon:'🗺️',label:'Macera'},
    {id:'messages',icon:'💬',label:'Mesaj'},
    {id:'my-tasks',icon:'📋',label:'Ödevler'},
  ];
  const items = currentRole==='teacher' ? teacherNav : studentNav;
  const unreadMsg = (currentRole==='teacher' ? teacherNotifs : studentNotifs).filter(n=>!n.read&&n.type==='message').length;
  const pendingTaskCount = currentRole==='student' ? tasks.filter(t=>!t.done).length : 0;
  nav.innerHTML = `<div class="mobile-nav-inner">${items.map(n=>{
    let badge = '';
    if(n.id==='messages' && unreadMsg>0) badge=`<span class=\"nav-badge\">${unreadMsg>9?'9+':unreadMsg}</span>`;
    if(n.id==='my-tasks' && pendingTaskCount>0) badge=`<span class=\"nav-badge\">${pendingTaskCount>9?'9+':pendingTaskCount}</span>`;
    return `<button class="mobile-nav-item ${currentPage===n.id?'active':''}" onclick="showPage('${n.id}')">
      <span class="nav-icon-wrap">${n.icon}${badge}</span><span>${n.label}</span>
    </button>`;
  }).join('')}</div>`;
}

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

// Auth state listener
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      const doc = await db.collection('users').doc(user.uid).get();
      if (!doc.exists) {
        // Hesap Firestore'dan silinmiş - Auth'tan da çıkış yap
        await auth.signOut();
        document.getElementById('app').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        return;
      }
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
        'daily-entry','my-analysis','kazanimlar','my-tasks','wellness','lgs-dagilim','psych-report','macera'];
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

