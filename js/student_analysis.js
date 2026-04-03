// ── Wellness kayıt fonksiyonları ─────────────────────────────

function saveWellnessDay(field, value, btn) {
  const { myUid, storageKey, data } = _getW();
  const todayKey = getTodayKey();
  if (!data.days) data.days = {};
  if (!data.days[todayKey]) data.days[todayKey] = {};
  data.days[todayKey][field] = value;
  _syncW(myUid, storageKey, data);

  // Buton aktif stilini güncelle
  if (btn) {
    const parent = btn.parentElement;
    if (parent) {
      parent.querySelectorAll('button').forEach(b => {
        b.style.borderColor = 'var(--border)';
        b.style.background = 'transparent';
        const span = b.querySelector('span:last-child');
        if (span) span.style.color = 'var(--text2)';
      });
      // Aktif butonu vurgula
      const color = btn.style.borderColor || 'var(--accent)';
      btn.style.borderColor = 'var(--accent)';
      btn.style.background = 'var(--accent)22';
    }
  }

  // Wellness bildirimleri kontrol et
  if (field === 'kaygi' || field === 'mood') {
    const todayData = data.days[todayKey];
    checkAllWellnessNotifications(myUid, data, todayKey);
  }
  // Altın sistemi — mood girişi
  if (field === 'mood' && typeof _marketMoodKontrol === 'function') {
    _marketMoodKontrol(field);
  }
  // Koloni XP — mood girişinde koloniye XP ver
  if (field === 'mood' && typeof grantWellnessXP === 'function') {
    try {
      const colData = loadColonyData();
      const result = grantWellnessXP(colData, value);
      if (result.xpGained > 0) {
        showToast('🚀', result.reasons[0] + (result.levelUp ? ' Seviye atladın!' : ''));
      }
    } catch(e) {}
  }
  // Bildirimler sadece kaydet butonuna basılınca gönderilir (saveWellnessAll)
}

function saveWellnessField(field, value) {
  const { myUid, storageKey, data } = _getW();
  data[field] = value;
  _syncW(myUid, storageKey, data);
}

function saveWellnessAll(btn) {
  const { myUid, storageKey, data } = _getW();
  const todayKey = getTodayKey();
  if (!data.days) data.days = {};
  if (!data.days[todayKey]) data.days[todayKey] = {};

  // Tüm input değerlerini topla
  const fields = ['wellnessEnerji','wellnessKaygi','wellnessOdak'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const fieldName = id.replace('wellness','').toLowerCase();
      data.days[todayKey][fieldName] = el.value;
    }
  });

  _syncW(myUid, storageKey, data);
  // Bildirimler sadece kaydet butonuna basılınca
  const kaygiVal = parseInt(data.days[todayKey]?.kaygi || 0);
  const uykuVal = parseFloat(data.days[todayKey]?.uyku || 0);
  if (kaygiVal >= 8) kaygiBildirimiGonder(kaygiVal);
  if (uykuVal > 0 && uykuVal < 5) uykuBildirimiGonder(uykuVal);
  if (btn) { btn.textContent = '✅ Kaydedildi!'; setTimeout(()=>{ btn.textContent = '💾 Kaydet'; }, 1500); }
  checkBadges();
  // Altın sistemi — wellness tam kontrolü
  if (typeof _marketWellnessTamKontrol === 'function') _marketWellnessTamKontrol();
}

// ============================================================
// LGS SORU DAĞILIM VERİSİ (2021-2025)
// ============================================================
const lgsDagilimData = {
  'Türkçe': {
    color: '#ff6b6b', icon: '📖', totalSoru: 20,
    yillar: ['2018','2019','2020','2021','2022','2023','2024','2025'],
    konular: [
      { ad: 'Sözcükte Anlam',         sorular: [2,2,1,2,2,1,1,2] },
      { ad: 'Deyimler ve Atasözleri', sorular: [1,0,0,2,0,0,1,0] },
      { ad: 'Cümlede Anlam',          sorular: [2,2,2,2,1,3,3,2] },
      { ad: 'Sözel Mantık / Görsel Okuma', sorular: [1,7,6,4,5,5,3,3] },
      { ad: 'Parçada Anlam',          sorular: [8,3,3,10,6,5,6,6] },
      { ad: 'Söz Sanatları',          sorular: [0,0,1,0,0,0,0,1] },
      { ad: 'Metin Türleri',          sorular: [1,1,2,0,1,1,1,0] },
      { ad: 'Noktalama İşaretleri',   sorular: [1,1,1,0,1,1,1,1] },
      { ad: 'Yazım Kuralları',        sorular: [1,1,1,0,1,1,1,1] },
      { ad: 'Fiilimsiler',            sorular: [1,1,1,0,0,1,1,0] },
      { ad: 'Cümlenin Öğeleri',       sorular: [0,0,1,0,1,1,0,0] },
      { ad: 'Cümle Türleri',          sorular: [1,1,1,0,0,1,1,1] },
      { ad: 'Anlatım Bozukluğu',      sorular: [1,1,0,0,2,0,1,1] },
      { ad: 'Fiilde Çatı',            sorular: [0,0,0,0,0,0,0,1] },
      { ad: 'Düşünceyi Geliştirme',   sorular: [0,0,0,0,0,0,0,1] },
    ]
  },
  'Matematik': {
    color: '#4ecdc4', icon: '📐', totalSoru: 20,
    yillar: ['2018','2019','2020','2021','2022','2023','2024','2025'],
    konular: [
      { ad: 'Üslü Sayılar',                    sorular: [2,2,4,3,2,4,2,2] },
      { ad: 'Köklü Sayılar',                   sorular: [3,3,3,2,3,5,3,3] },
      { ad: 'Çarpanlar ve Katlar',             sorular: [1,1,3,3,1,3,1,1] },
      { ad: 'Olasılık',                         sorular: [1,1,3,1,1,2,1,1] },
      { ad: 'Veri Analizi',                     sorular: [0,1,3,2,1,2,1,1] },
      { ad: 'Eşitsizlikler',                    sorular: [2,1,0,2,2,0,2,2] },
      { ad: 'Cebirsel İfadeler ve Özdeşlikler', sorular: [3,3,4,2,2,4,2,2] },
      { ad: 'Doğrusal Denklemler ve Eğim',     sorular: [3,4,0,2,4,0,3,3] },
      { ad: 'Dönüşüm Geometrisi',              sorular: [1,1,0,0,1,0,1,1] },
      { ad: 'Geometrik Cisimler',              sorular: [3,1,0,0,1,0,1,1] },
      { ad: 'Üçgenler',                         sorular: [1,2,0,2,2,0,3,3] },
      { ad: 'Eşlik ve Benzerlik',              sorular: [1,1,0,2,2,0,1,1] },
    ]
  },
  'Fen Bilimleri': {
    color: '#45b7d1', icon: '🔬', totalSoru: 20,
    yillar: ['2018','2019','2020','2021','2022','2023','2024','2025'],
    konular: [
      { ad: 'Mevsimler ve İklim',            sorular: [1,1,3,2,1,3,1,1] },
      { ad: 'DNA ve Genetik Kod',            sorular: [2,3,8,5,4,8,4,3] },
      { ad: 'Basınç',                         sorular: [0,2,5,2,2,5,2,2] },
      { ad: 'Madde ve Endüstri',             sorular: [6,6,4,5,5,4,5,5] },
      { ad: 'Basit Makineler',               sorular: [2,2,0,2,2,0,2,2] },
      { ad: 'Enerji Dönüşümleri ve Çevre Bilimi', sorular: [3,4,0,4,4,0,4,4] },
      { ad: 'Elektrik Yükleri ve Enerjisi',  sorular: [3,3,0,0,2,0,2,3] },
      { ad: 'Hücre Bölünmesi ve Kalıtım',   sorular: [1,0,0,0,0,0,0,0] },
      { ad: 'Işığın Kırılması',              sorular: [1,0,0,0,0,0,0,0] },
      { ad: 'Ses',                            sorular: [1,0,0,0,0,0,0,0] },
    ]
  },
  'İnkılap Tarihi': {
    color: '#f9ca24', icon: '🏛️', totalSoru: 10,
    yillar: ['2018','2019','2020','2021','2022','2023','2024','2025'],
    konular: [
      { ad: 'Bir Kahraman Doğuyor',              sorular: [1,1,3,1,1,5,1,0] },
      { ad: 'Milli Uyanış: Bağımsızlık Yolunda', sorular: [1,2,4,2,2,2,2,5] },
      { ad: 'Milli Bir Destan: Ya İstiklal Ya Ölüm', sorular: [1,2,3,2,2,3,2,2] },
      { ad: 'Atatürkçülük ve Çağdaşlaşan Türkiye', sorular: [5,4,0,3,0,0,4,2] },
      { ad: 'Demokratikleşme Çabaları',          sorular: [0,0,0,1,1,0,1,1] },
      { ad: 'Atatürk Dönemi Türk Dış Politikası', sorular: [1,1,0,1,1,0,0,0] },
      { ad: 'Atatürk\'ün Ölümü ve Sonrası',       sorular: [1,0,0,0,0,0,0,0] },
    ]
  },
  'Din Kültürü': {
    color: '#a29bfe', icon: '☪️', totalSoru: 10,
    yillar: ['2018','2019','2020','2021','2022','2023','2024','2025'],
    konular: [
      { ad: 'Kader İnancı',                sorular: [2,1,1,1,3,4,2,3] },
      { ad: 'Hz. Musa',                    sorular: [0,1,3,2,0,0,0,0] },
      { ad: 'Zekat ve Sadaka',             sorular: [1,3,3,3,2,3,2,2] },
      { ad: 'Din ve Hayat',                sorular: [2,0,3,3,4,3,2,2] },
      { ad: 'Hz. Muhammed\'in Örnekliği',  sorular: [1,3,0,0,1,0,2,2] },
      { ad: 'Kur\'an-ı Kerim ve Özellikleri', sorular: [2,2,1,1,0,0,2,1] },
      { ad: 'İslam\'ın Paylaşma Değeri',   sorular: [1,0,0,0,0,0,0,0] },
      { ad: 'İslam\'da Kötü Davranışlar',  sorular: [1,0,0,0,0,0,0,0] },
      { ad: 'Tevekkül',                    sorular: [0,1,0,0,0,0,0,0] },
      { ad: 'Hac İbadeti',                 sorular: [1,0,0,0,0,0,0,0] },
    ]
  },
  'İngilizce': {
    color: '#fd79a8', icon: '🌍', totalSoru: 10,
    yillar: ['2018','2019','2020','2021','2022','2023','2024','2025'],
    konular: [
      { ad: 'Friendship',     sorular: [2,1,1,1,2,4,2,2] },
      { ad: 'Teen Life',      sorular: [1,3,3,1,1,0,1,1] },
      { ad: 'In The Kitchen', sorular: [1,1,1,2,1,2,1,1] },
      { ad: 'On The Phone',   sorular: [0,1,1,1,1,2,1,1] },
      { ad: 'The Internet',   sorular: [1,1,1,1,1,2,2,1] },
      { ad: 'Adventures',     sorular: [1,1,1,1,1,0,2,1] },
      { ad: 'Tourism',        sorular: [3,0,0,1,1,0,0,1] },
      { ad: 'Chores',         sorular: [1,1,1,1,1,0,0,1] },
      { ad: 'Science',        sorular: [0,1,1,1,1,0,1,1] },
      { ad: 'Natural Forces', sorular: [0,0,0,0,0,0,0,1] },
    ]
  }
};

// ============================================================
// LGS SORU DAĞILIM SAYFASI
// ============================================================
let _dagilimSelected = null;

function lgsDagilimPage() {
  const dersler = Object.keys(lgsDagilimData);
  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <button onclick="showPage('dashboard')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem">←</button>
      <div class="page-title" style="margin:0">📊 LGS Soru Dağılımı</div>
    </div>
    <div class="page-sub">Yıllara göre konu bazlı soru dağılımı</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px">
      ${dersler.map(d => {
        const info = lgsDagilimData[d];
        return `
          <button onclick="showDagilimDetail('${d}')"
            style="background:${info.color}18;border:1.5px solid ${info.color}44;border-radius:14px;
                   padding:18px 14px;text-align:left;cursor:pointer;transition:.15s;color:var(--text)">
            <div style="font-size:1.6rem;margin-bottom:8px">${info.icon}</div>
            <div style="font-weight:800;font-size:0.95rem;margin-bottom:4px">${d}</div>
            <div style="font-size:0.75rem;color:var(--text2)">${info.totalSoru} Soru</div>
            <div style="margin-top:10px;height:3px;border-radius:2px;background:${info.color};opacity:.5"></div>
          </button>`;
      }).join('')}
    </div>
    <div style="font-size:0.72rem;color:var(--text2);text-align:center;margin-top:8px">
      * 2023 yılı deprem nedeniyle sadece 1. dönem konularını kapsar
    </div>

    <!-- Detay Modal -->
    <div id="dagilimModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:600;overflow-y:auto;padding:16px">
      <div id="dagilimBox" style="background:var(--surface);border-radius:18px;padding:20px;max-width:600px;margin:0 auto"></div>
    </div>`;
}

function showDagilimDetail(ders) {
  const info = lgsDagilimData[ders];
  const yillar = info.yillar;
  const maxSoru = Math.max(...info.konular.flatMap(k => k.sorular));

  const rows = info.konular.map(k => {
    const bars = k.sorular.map((s, i) => {
      const pct = maxSoru > 0 ? (s / maxSoru * 100) : 0;
      return `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
          <div style="font-size:0.75rem;font-weight:700;color:${info.color}">${s}</div>
          <div style="width:100%;height:${Math.max(pct*0.5,4)}px;background:${info.color};border-radius:3px 3px 0 0;min-height:4px;opacity:${s>0?'1':'0.2'}"></div>
          <div style="font-size:0.6rem;color:var(--text2)">${yillar[i]}</div>
        </div>`;
    }).join('');
    return `
      <div style="background:var(--surface2);border-radius:12px;padding:14px;margin-bottom:10px">
        <div style="font-weight:700;font-size:0.88rem;margin-bottom:10px;color:var(--text)">${k.ad}</div>
        <div style="display:flex;gap:6px;align-items:flex-end;height:70px">${bars}</div>
      </div>`;
  }).join('');

  document.getElementById('dagilimBox').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:1.8rem">${info.icon}</span>
        <div>
          <div style="font-weight:800;font-size:1.1rem">${ders}</div>
          <div style="font-size:0.75rem;color:${info.color}">${info.totalSoru} soru • Son ${yillar.length} yıl</div>
        </div>
      </div>
      <button onclick="document.getElementById('dagilimModal').style.display='none'"
        style="background:var(--surface2);border:none;border-radius:10px;padding:8px 14px;color:var(--text);cursor:pointer;font-weight:700">✕ Kapat</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      ${yillar.map(y => `<span style="padding:4px 10px;background:${info.color}22;border:1px solid ${info.color}44;border-radius:8px;font-size:0.72rem;font-weight:700;color:${info.color}">${y}</span>`).join('')}
    </div>
    ${rows}
    <div style="font-size:0.7rem;color:var(--text2);margin-top:8px">* 2023 yılı deprem nedeniyle sadece 1. dönem konularını kapsar</div>`;
  document.getElementById('dagilimModal').style.display = 'block';
}

// ============================================================
// PSİKOLOJİK REHBERLİK & HEDEFLER SAYFASI
// ============================================================
const moodOptions = [
  { emoji:'🔥', label:'Heyecanlı', value:'excited', color:'#f9ca24' },
  { emoji:'😊', label:'İyiyim', value:'good', color:'#45b7d1' },
  { emoji:'🎯', label:'Odaklı', value:'focused', color:'#6c63ff' },
  { emoji:'😐', label:'İdare Eder', value:'ok', color:'#a29bfe' },
  { emoji:'😔', label:'Yorgunum', value:'tired', color:'#fd79a8' },
  { emoji:'😰', label:'Kaygılı', value:'anxious', color:'#ff6b6b' },
  { emoji:'😢', label:'Mutsuzum', value:'sad', color:'#778ca3' },
];

function wellnessPage() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  const storageKey = 'wellness_' + myUid;
  let data = {};
  try { data = JSON.parse(localStorage.getItem(storageKey)||'{}'); } catch(e){}

  const todayKey = getTodayKey();

  // Gün değişince: dünün günlük verileri silindi, bugün boş başlar
  // Kalıcı veriler (hedef, hedefOkul) korunur, sadece days[bugün] yok ise boş
  const today = data.days?.[todayKey] || {};

  // Global cache güncelle
  window._wellnessCache = data;

  // Son 7 gün mood geçmişi
  const last7 = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-i);
    const dk = getDateKey(d);
    const dayData = data.days?.[dk] || {};
    const mInfo = moodOptions.find(x=>x.value===dayData.mood);
    return { dk, label: d.toLocaleDateString('tr-TR',{weekday:'short'}), emoji: mInfo?.emoji||'·', color: mInfo?.color||'var(--border)', mood: dayData.mood };
  }).reverse();

  const subjects = ['Türkçe','Matematik','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce'];
  const randomMot = motivasyonSozleri[Math.floor(Math.random()*motivasyonSozleri.length)];

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <button onclick="showPage('dashboard')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem">←</button>
      <div class="page-title" style="margin:0">💙 Nasıl Hissediyorum</div>
    </div>
    <div class="page-sub">Günlük psikolojik takip ve hedeflerim</div>

    <!-- Hedefler -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-title">🎯 Hedeflerim</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div style="flex:1;min-width:120px">
          <div style="font-size:0.72rem;font-weight:700;color:var(--text2);margin-bottom:5px">Hedef Puan</div>
          <input type="number" id="wellnessHedefPuan" placeholder="örn: 480" min="100" max="500"
            value="${data.hedef||''}"
            onchange="saveWellnessField('hedef',this.value)"
            style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.95rem;font-weight:700;outline:none;box-sizing:border-box">
        </div>
        <div style="flex:2;min-width:160px">
          <div style="font-size:0.72rem;font-weight:700;color:var(--text2);margin-bottom:5px">Hedef Okul</div>
          <input type="text" id="wellnessHedefOkul" placeholder="örn: Çankaya Anadolu Lisesi"
            value="${data.hedefOkul||''}"
            onchange="saveWellnessField('hedefOkul',this.value)"
            style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box">
        </div>
      </div>
    </div>

    <!-- BÖLÜM 1: Duygu & Enerji -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-title">😊 Duygu Durum & Enerji</div>
      <div style="font-size:0.75rem;color:var(--text2);margin-bottom:10px;padding:5px 8px;background:var(--surface2);border-radius:8px">📅 ${new Date(todayKey+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long',year:'numeric'})} verisi${Object.keys(today).length===0?' — bugün henüz giriş yapılmadı':''}</div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:8px">Bugün nasıl hissediyorsun?</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
        ${moodOptions.map(m => `
          <button onclick="saveWellnessDay('mood','${m.value}',this)"
            style="flex:1;min-width:50px;padding:8px 4px;border-radius:10px;
                   border:2px solid ${today.mood===m.value ? m.color : 'var(--border)'};
                   background:${today.mood===m.value ? m.color+'22' : 'transparent'};
                   cursor:pointer;transition:.15s;display:flex;flex-direction:column;align-items:center;gap:3px">
            <span style="font-size:1.4rem">${m.emoji}</span>
            <span style="font-size:0.58rem;font-weight:700;color:${today.mood===m.value ? m.color : 'var(--text2)'}">${m.label}</span>
          </button>`).join('')}
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">Enerji Seviyesi (1-10)</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <input type="range" min="1" max="10" value="${today.enerji||1}"
          id="wellnessEnerji" oninput="this.nextElementSibling.textContent=this.value;saveWellnessDay('enerji',this.value)"
          style="flex:1;accent-color:var(--accent)">
        <span style="font-weight:900;font-size:1.1rem;color:var(--accent);min-width:24px;text-align:center">${today.enerji||5}</span>
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">Günün Kelimesi</div>
      <input type="text" id="wellnessKelime" placeholder="Bugünü tek kelimeyle özetle... (örn: 'kararlı', 'dağınık')"
        value="${today.kelime||''}"
        onchange="saveWellnessDay('kelime',this.value)"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:10px">

      <!-- Son 7 gün -->
      <div style="font-size:0.72rem;font-weight:700;color:var(--text2);margin-bottom:6px">Son 7 Gün</div>
      <div style="display:flex;gap:4px">
        ${last7.map(d=>`
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
            <div style="width:30px;height:30px;border-radius:50%;background:${d.color}33;border:2px solid ${d.color};
                        display:flex;align-items:center;justify-content:center;font-size:0.9rem">${d.emoji}</div>
            <div style="font-size:0.56rem;color:var(--text2)">${d.label}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- BÖLÜM 2: Akademik Özgüven -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-title">📚 Akademik Özgüven</div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">Bugün hangi derste en çok zorlandın?</div>
      <button type="button" onclick="openOptionPicker('zorDers','Zorlanan Ders',[{v:'',l:'— Seçiniz —'},{v:'Türkçe',l:'📖 Türkçe'},{v:'Matematik',l:'📐 Matematik'},{v:'Fen Bilimleri',l:'🔬 Fen Bilimleri'},{v:'İnkılap Tarihi',l:'🏛️ İnkılap Tarihi'},{v:'Din Kültürü',l:'☪️ Din Kültürü'},{v:'İngilizce',l:'🌍 İngilizce'}], null)"
        id="zorDersBtn" style="width:100%;padding:10px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);text-align:left;cursor:pointer;font-size:0.88rem;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between">
        <span id="zorDersLabel">${today.zorDers ? subjects.find(s=>s===today.zorDers)||today.zorDers : '— Ders seç —'}</span>
        <span style="color:var(--text2)">▼</span>
      </button>
      <input type="hidden" id="zorDers" value="${today.zorDers||''}">

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">Odaklanma Puanı (1-10)</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <input type="range" min="1" max="10" value="${today.odak||1}"
          id="wellnessOdak" oninput="this.nextElementSibling.textContent=this.value;saveWellnessDay('odak',this.value)"
          style="flex:1;accent-color:#45b7d1">
        <span style="font-weight:900;font-size:1.1rem;color:#45b7d1;min-width:24px;text-align:center">${today.odak||5}</span>
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">💪 Bugün seni gururlandıran küçük bir an?</div>
      <input type="text" id="wellnessGurur" placeholder="örn: Matematik problemini tek başıma çözdüm"
        value="${today.gurur||''}"
        onchange="saveWellnessDay('gurur',this.value)"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box">
    </div>

    <!-- BÖLÜM 3: Fizyolojik İyi Oluş -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-title">🌙 Fizyolojik İyi Oluş</div>

      <!-- Uyku + Ekran yan yana üst satır -->
      <div style="display:flex;gap:10px;margin-bottom:12px;align-items:stretch">
        <div style="flex:1;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:8px 10px">
          <div style="font-size:0.7rem;font-weight:700;color:var(--text2);margin-bottom:7px">🛌 Uyku (saat)</div>
          <input type="number" min="2" max="12" step="0.5" id="wellnessUyku" placeholder="0"
            value="${today.uyku||''}"
            oninput="saveWellnessDay('uyku',this.value)"
            style="width:100%;padding:7px 9px;border-radius:8px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box">
        </div>
        <!-- Ekran Süresi grubu -->
        <div style="flex:2;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:8px 10px">
          <div style="font-size:0.7rem;font-weight:700;color:var(--text2);margin-bottom:7px">📱 Ekran Süresi (saat)</div>
          <div style="display:flex;gap:8px">
            <div style="flex:1">
              <div style="font-size:0.65rem;color:var(--text2);margin-bottom:4px">💻 Online ders</div>
              <input type="number" min="0" max="12" step="0.5" id="wellnessEkranOnline" placeholder="0"
                value="${today.ekranOnline||''}"
                oninput="saveWellnessDay('ekranOnline',this.value)"
                style="width:100%;padding:7px 9px;border-radius:8px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box">
            </div>
            <div style="flex:1">
              <div style="font-size:0.65rem;color:var(--text2);margin-bottom:4px">📵 Sosyal medya</div>
              <input type="number" min="0" max="12" step="0.5" id="wellnessEkranSosyal" placeholder="0"
                value="${today.ekranSosyal||''}"
                oninput="saveWellnessDay('ekranSosyal',this.value)"
                style="width:100%;padding:7px 9px;border-radius:8px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box">
            </div>
          </div>
        </div>
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:8px">Sabah dinç uyandın mı?</div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        ${[{v:'evet',l:'😄 Evet, dinçtim'},{v:'orta',l:'😐 Orta'},{v:'hayir',l:'😴 Hayır, yorgundum'}].map(o=>`
          <button onclick="saveWellnessDay('uykuKalite','${o.v}',this)"
            style="flex:1;padding:8px 6px;border-radius:9px;font-size:0.75rem;font-weight:700;cursor:pointer;
                   border:2px solid ${today.uykuKalite===o.v?'var(--accent)':'var(--border)'};
                   background:${today.uykuKalite===o.v?'var(--accent)22':'transparent'};
                   color:${today.uykuKalite===o.v?'var(--accent)':'var(--text2)'}">${o.l}</button>`).join('')}
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:8px">💧 Yeterli su içtin mi?</div>
      <div style="display:flex;gap:8px">
        ${[{v:'evet',l:'✅ Evet'},{v:'orta',l:'🤔 Biraz'},{v:'hayir',l:'❌ Hayır'}].map(o=>`
          <button onclick="saveWellnessDay('su','${o.v}',this)"
            style="flex:1;padding:8px 6px;border-radius:9px;font-size:0.78rem;font-weight:700;cursor:pointer;
                   border:2px solid ${today.su===o.v?'#45b7d1':'var(--border)'};
                   background:${today.su===o.v?'#45b7d122':'transparent'};
                   color:${today.su===o.v?'#45b7d1':'var(--text2)'}">${o.l}</button>`).join('')}
      </div>
    </div>

    <!-- BÖLÜM 4: Kaygı & Stres -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-title">🧠 Kaygı & Stres Takibi</div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">Kaygı Skoru (1-10)</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <input type="range" min="1" max="10" value="${today.kaygi||1}"
          id="wellnessKaygi" oninput="this.nextElementSibling.textContent=this.value;saveWellnessDay('kaygi',this.value)"
          style="flex:1;accent-color:#ff6b6b">
        <span style="font-weight:900;font-size:1.1rem;color:#ff6b6b;min-width:24px;text-align:center">${today.kaygi||3}</span>
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">😟 Aklına gelen en olumsuz düşünce?</div>
      <input type="text" id="wellnessNegatif" placeholder="örn: Asla başaramayacağım, çok geç kaldım..."
        value="${today.negatif||''}"
        onchange="saveWellnessDay('negatif',this.value)"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:12px">

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">🌟 Her şeye rağmen bugün iyi giden bir şey?</div>
      <input type="text" id="wellnessPozitif" placeholder="örn: Bugün 50 soru çözdüm, küçük ama güzel..."
        value="${today.pozitif||''}"
        onchange="saveWellnessDay('pozitif',this.value)"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:12px">

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">📝 Günlük not (sadece sana özel)</div>
      <textarea rows="3" id="wellnessNot" placeholder="Bugün ne düşündüm, ne hissettim..."
        onchange="saveWellnessDay('not',this.value)"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);
               color:var(--text);font-family:'Nunito',sans-serif;font-size:0.88rem;resize:none;outline:none;box-sizing:border-box">${today.not||''}</textarea>
    </div>

    <!-- Kaydet butonu -->
    <button onclick="saveWellnessAll(this)"
      style="width:100%;padding:14px;border-radius:14px;background:var(--accent);color:#fff;border:none;font-weight:800;font-size:0.95rem;cursor:pointer;margin-bottom:14px">
      ✅ Bugünü Kaydet
    </button>

    <!-- Motivasyon -->
    <div style="background:linear-gradient(135deg,#fd79a822,#f9ca2422);border:1px solid #fd79a844;border-radius:16px;padding:16px;margin-bottom:24px">
      <div style="font-size:0.78rem;font-weight:700;color:var(--text2);margin-bottom:8px;letter-spacing:.05em">💫 GÜNÜN SÖZÜ</div>
      <div id="motivasyonText" style="font-size:0.92rem;font-weight:600;color:var(--text);line-height:1.6;font-style:italic">"${randomMot.text}"</div>
      <button onclick="newMotivation()" style="margin-top:10px;background:none;border:none;color:var(--accent);font-size:0.78rem;cursor:pointer;font-weight:700">🔄 Yeni söz</button>
    </div>`;
}

const motivasyonSozleri = [
  { emoji:'🌟', text:'Her büyük başarı, küçük adımların birikmesiyle gelir. Bugün de bir adım attın.' },
  { emoji:'🎯', text:'Hedeflerin sana uzak görünebilir, ama her gün biraz daha yaklaşıyorsun.' },
  { emoji:'💡', text:'Zorluk, gelişimin işaretidir. Eğer kolaysa büyümüyorsun demektir.' },
  { emoji:'🔥', text:'Motivasyon seni başlatır, alışkanlık seni götürür. Bugün alışkanlık kazan.' },
  { emoji:'🌈', text:'Dün geçti, yarın henüz gelmedi. Bugün elimden gelenin en iyisini yapıyorum.' },
  { emoji:'🏆', text:'Sınav günü sahaya çıktığında, bugün yaptığın çalışma konuşacak.' },
  { emoji:'💎', text:'Elmas, basınç altında şekillenir. Sen de şekilleniyorsun.' },
  { emoji:'🚀', text:'Küçük ilerlemeler, büyük değişimlere yol açar. Devam et!' },
  { emoji:'⭐', text:'Başkalarıyla değil, dünkü kendinle yarış. Daha iyi biri oluyorsun.' },
  { emoji:'🌱', text:'Bugün ektiğin tohumlar, gelecekte meyve verecek. Ekmeye devam!' },
];

function newMotivation() {
  const s = motivasyonSozleri[Math.floor(Math.random()*motivasyonSozleri.length)];
  const el = document.getElementById('motivasyonText');
  if(el) el.textContent = '"' + s.text + '"';
}

