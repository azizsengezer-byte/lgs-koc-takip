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
  // Altın sistemi — her alan girişinde kontrol et
  if (typeof _marketWellnessTamKontrol === 'function') {
    _marketWellnessTamKontrol();
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
  const fields = ['wellnessEnerji','wellnessKaygi','wellnessOdak','wellnessUyku','wellnessEkranOnline','wellnessEkranSosyal'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value !== '') {
      const fieldName = id.replace('wellness','').toLowerCase();
      data.days[todayKey][fieldName] = el.value;
    }
  });
  const textFields = ['wellnessKelime','wellnessGurur','wellnessPozitif','wellnessNegatif'];
  textFields.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value.trim()) {
      const fieldName = id.replace('wellness','').toLowerCase();
      data.days[todayKey][fieldName] = el.value.trim();
    }
  });

  _syncW(myUid, storageKey, data);
  // Bildirimler sadece kaydet butonuna basılınca
  const today = data.days[todayKey];
  const kaygiVal = parseInt(today?.kaygi || 0);
  const uykuVal = parseFloat(today?.uyku || 0);
  if (kaygiVal >= 8) kaygiBildirimiGonder(kaygiVal);
  if (uykuVal > 0 && uykuVal < 5) uykuBildirimiGonder(uykuVal);
  if (btn) { btn.textContent = '✅ Kaydedildi!'; setTimeout(()=>{ btn.textContent = '✓ Günlüğü Kaydet'; }, 2000); }
  checkBadges();
  if (typeof _marketWellnessTamKontrol === 'function') _marketWellnessTamKontrol();

  // Kaydet sonrası telkin modalı
  const telkinler = [];
  if (today.mood)  telkinler.push(wpMood(today.mood));
  if (today.enerji) telkinler.push(wpEnerji(parseInt(today.enerji)));
  if (today.odak)   telkinler.push(wpOdak(parseInt(today.odak)));
  if (today.kaygi)  telkinler.push(wpKaygi(parseInt(today.kaygi)));
  if (today.uyku)   telkinler.push(wpUyku(parseFloat(today.uyku)));
  if (today.gurur)  telkinler.push(wpGurur());
  if (telkinler.length === 0) return;

  // Rasgele 1–2 telkin seç
  const shuffle = arr => arr.sort(()=>Math.random()-.5);
  const secilen = shuffle(telkinler).slice(0, 2);

  const existing = document.getElementById('_wellnessTelkinModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = '_wellnessTelkinModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:flex-end;justify-content:center';
  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:22px 18px 36px">
      <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 18px"></div>
      <div style="font-size:1rem;font-weight:800;margin-bottom:14px">✨ Günlüğün kaydedildi</div>
      ${secilen.map(t=>`
        <div style="background:var(--surface2);border-radius:12px;padding:12px 14px;margin-bottom:8px;font-size:0.85rem;color:var(--text);line-height:1.5">${t}</div>
      `).join('')}
      <button onclick="document.getElementById('_wellnessTelkinModal').remove()"
        style="width:100%;margin-top:8px;padding:12px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-weight:800;font-size:0.88rem;cursor:pointer;font-family:inherit">
        Tamam 👋
      </button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
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
// ============================================================
// GÜNLÜK & WELLNESS SİSTEMİ
// ============================================================

const moodOptions = [
  { emoji:'😢', label:'Mutsuz',   value:'sad',     color:'#9b59b6', tip:'neg' },
  { emoji:'😰', label:'Kaygılı',  value:'anxious', color:'#ff6b6b', tip:'neg' },
  { emoji:'😴', label:'Yorgunum', value:'tired',   color:'#f39c12', tip:'neg' },
  { emoji:'😐', label:'İdare Eder', value:'ok',   color:'#888',    tip:'ntr' },
  { emoji:'😊', label:'İyi',      value:'good',   color:'#43b89c', tip:'poz' },
  { emoji:'😄', label:'Harika',   value:'great',  color:'#6c63ff', tip:'poz' },
];

// ── CÜMLE HAVUZU ─────────────────────────────────────────────
const WP = {
  mood: {
    bad:   ['Bugün ağır bir gün. Burada olman bile başlı başına cesaret.','Her gün güneşli olmak zorunda değil, bulutlu günler de senindir.','Kendine iyi bak bugün. Bazen en iyi yapabileceğin bu.','Zor hissediyorsun ama bu his geçici. Hep geçiyor.','En karanlık gecelerin de sabahı olur.','Bazen sadece nefes almak yeterli.','Yorgunluk güçsüzlük değil. Çok şey taşıyorsun.','Bugün olmadı, yarın yeni bir sayfa.','Hissetmek sorun değil. Hissetmemek asıl zordu.','Kendine biraz nazik ol bugün.'],
    hard:  ['Böyle günler de geçer. Küçük adımlar bile yeterli.','Her şey mükemmel olmak zorunda değil.','Bugün biraz yorgunsun, bu normal.','İçinden geçmek zorunda olduğun günler bunlar.','Kendine karşı sabırlı ol, herkes böyle günler yaşar.','Zor hissettiriyorsa, gerçekten çalışıyorsun demek.','Bugün küçük kalmak tamam. Yarın büyük düşünürsün.','Bir şeylerin zor olması başarısız olduğun anlamına gelmiyor.','Mücadele etmek zaten önemli bir şey.','Bu da geçecek, söz.'],
    ok:    ['Sıradan günler de birikimin bir parçası.','Bugün sakin, yarın belki daha enerjik.','Normal günler de değerli. Hepsi birikerek büyüyor.','Dalgalanmalar olmasa zaten düz bir çizgi olurdu.','Her gün harika olmak zorunda değil, tutarlı olmak yeter.','Sakin bir gün de bir kazanım.','Düzenli olmak bazen coşkudan daha değerlidir.','Normal hissetmek, iyi hissetmektir aslında.'],
    good:  ['Bu enerjiyi iyi kullan, nadir bir şey.','İyi hissetmek de bir başarı. Sahip çık buna.','Böyle günlerde ne yaptığını hatırla.','Bu hal bulaşıcı, devam et.','Bugün kendini ödüllendirmeyi hak ediyorsun.','Bu his geçici ama iz bırakıyor. Güzel bir iz.','İyi günlerin tadını çıkar.','Bu enerjiyi nasıl koruyabileceğini düşün.','Güzel bir gün seni bekliyor gibi görünüyor.','Bu hissin nereden geldiğini fark etmeye çalış.'],
    great: ['Bu enerjiyi besle, büyüt.','Harika günler harika anların birikim sonucudur.','Tam gaz! Bu hal seninle kalsın.','Bugün dünya biraz daha iyi bir yer.','Bu hissi hatırla, zor günlerde işine yarayacak.','Seni bu kadar neyin mutlu ettiğini biliyor musun?','Bu enerjiyle nelere ulaşabileceğini düşün.','Harika günler öyle gelmiyor, sen getiriyorsun.','Bugün her şey mümkün hissettiriyor.','Böyle hissetmek için emek verdin.'],
  },
  enerji: {
    low:  ['Enerjin düşük ama buraya yazdın. Bu da bir şey.','Düşük enerjili günlerde mola vermek zayıflık değil.','Bedenin bugün dinlenmeye ihtiyaç duyuyor olabilir.','Az enerjiyle küçük adımlar atmak da değerlidir.','Bazen pilimiz bitiyor. Bu insani.','Bugün kendine izin ver, yarın yeniden şarj olursun.','Yorgunluk bir mesajdır, dinle onu.'],
    mid:  ['Orta enerji, kararlılıkla çok şey yapar.','Ne tam dolu ne tam boş. Dengeli bir gün.','Bu enerjiyle neler yapabileceğini dene.','Yeterli enerji var, yeter ki doğru yönlendir.','Sabit tempoda devam et.','Ortalama günler de birikime katkı sağlar.','Sürdürülebilir tempo bu olabilir.'],
    high: ['Bu enerji nadir bir hediye, iyi kullan.','Dolu pillerin var, harika bir gün seni bekliyor.','Bu enerjini nasıl değerlendireceğine sen karar ver.','Bugün kendini durdurmak zor olacak, bırak akışı.','Böyle hissetmek için emek verdin, hak ettin.','Bu hali mümkün olduğunca uzat.','Yüksek enerji + niyet = güçlü bir gün.'],
  },
  odak: {
    low:  ['Odaklanmak bugün zor, bu bazen öyle oluyor.','Dağınık zihin dinlenmeye ihtiyaç duyuyor olabilir.','Odaklanamıyorsan ortamını değiştirmeyi dene.','Dikkat dağıldığında kendini suçlama, tekrar başla.','Her dağınık günün ardından toplanmış günler geliyor.','Küçük bloklar halinde çalışmak bugün daha iyi olabilir.','5 dakika odaklanmayı dene, sonra karar ver.'],
    mid:  ['Orta odak, doğru konuyla buluşunca yeterli olur.','Tam konsantre olmasan da devam etmek değerli.','Bugün en önemli bir şeyi tamamlamak yeterli.','Odak bir kas, her gün biraz güçleniyor.','Mükemmel odak beklemeden başlamak çok daha iyi.','Hayatın her günü keskin olmak zorunda değilsin.'],
    high: ['Zihnin keskin bugün, iyi fırsatla bu.','Bu odak seviyesi seni çok ileri götürür.','Tam konsantrasyon harika bir hal, tadını çıkar.','Bugün akış halindeysen durma.','Bu hali besleyen neydi, fark ettiysen koru onu.','Keskin zihin + iyi niyet = güçlü gün.'],
  },
  kaygi: {
    low:  ['Kaygın düşük. Zihninle barışık bir gün.','Sakin bir zihin en büyük güçtür.','Bu huzuru hissedebilmek güzel bir şey.','İçin sakin, bu geçici değil korunabilir.','Sakin kalmak bir beceri, her gün biraz daha gelişiyor.','Bu hali yakalayan az insan var, koru onu.'],
    mid:  ['Biraz kaygı var ama bu seni durdurmaz.','Orta kaygı aslında dikkatli olmak demek bazen.','Kaygın seni uyarıyor, ama karar sen veriyorsun.','Bu his geçecek, kendin için burada olmaya devam et.','Kaygıyla yaşamak değil, ona rağmen yürümek.','Zihnini meşgul eden şeyi yazmak hafifletebilir.','Nefes al. Gerçekten sadece derin bir nefes.'],
    high: ['Kaygın biraz yüksek. Kendine nazik davranmayı unutma.','Bu his çok güçlü hissettiriyor ama geçici.','Bugün kendine ekstra şefkat göster.','Bu hissi birine anlatmak ister misin? Koçun dinler.','Büyük resmi şu an görmen gerekmiyor. Sadece bugün.','Kaygıyla mücadele etmek yerine kabul etmek bazen daha hafif.'],
    vhigh:['Kaygın çok yoğun hissettiriyor. Yalnız taşımak zorunda değilsin.','Bu hissi içinde tutmak ağır. Güvendiğin birine anlat.','Şu an her şey büyük görünüyor, ama bu his gerçeği değiştirmiyor.','Yardım istemek cesaret gerektirir, ve sen cesursun.','Bugün tek yapman gereken nefes almak olabilir. Yeterli.'],
  },
  ders: {
    'Matematik':       ['Matematik sabır ister, acele etme.','Bir problemi çözemesen de çözmeye çalıştın. Bu önemli.','Matematikte zorlanmak zeka eksikliği değil, alıştırma eksikliği.','Her yanlış çözüm seni doğruya biraz daha yaklaştırıyor.','Bugün zorlandığın konu yarın daha tanıdık gelecek.','Matematik direniyor ama sen ısrar ediyorsun.'],
    'Türkçe':          ['Türkçe bazen soyut hissettiriyor, bu normal.','Anlamadığın bir metin seni küçük düşürmez.','Dil becerileri zaman içinde gelişir, bu bir süreç.','Bugün zor bir parça vardı ama devam ettin.','Türkçeye zaman ayırmak hiç boşa gitmez.','Okumak her şeyin temelidir, sabret.'],
    'Fen Bilimleri':   ['Fen bilimlerinde kavramlar birbirine bağlıdır, birine hakim olunca diğerleri gelir.','Bugün kafa karıştırıcıydı ama yarın daha net görünecek.','Merak etmek zaten fen bilimidir. Sen merak ediyorsun.','Her kavram bir puzzle parçası, yavaş yavaş oturur.','Zorlandığın konu üzerinde biraz daha durmaya değer.'],
    'İnkılap Tarihi':  ['Tarih ezber değil, hikaye okumak gibi düşün.','Olaylar arasındaki bağı görmek zaman alır.','Bugün zorlandıysan bir kez daha okumak fark yaratır.','Her seferinde biraz daha netleşiyor.','Tarihi anlamak için bağlamına bakmak gerekiyor, sabret.'],
    'Din Kültürü':     ['Bugün zorlu bir konuyla karşılaştın, bu geçecek.','Kavramları kendi kelimenle ifade etmek anlamayı kolaylaştırır.','Zorlandığın yeri not al, tekrar dönersin.','Her ders kendi içinde bir dünya, zamanla açılıyor.'],
    'İngilizce':       ['Dil öğrenmek zaman ister, acele etme.','Bugün anlamadıkların yarın daha tanıdık gelebilir.','İngilizce bir maraton, sprint değil.','Kelime dağarcığı her gün biraz büyüyor, fark etmesen de.','Hata yapmak dilin bir parçası, korkma.','Bugün zorlandın ama devam ettin.'],
  },
  uyku: {
    low:  ['Bugün yorgun olabilirsin, kendine nazik ol.','Az uyku zor bir gün getirebilir. Mola almaktan çekinme.','Bu gece erken yatmayı düşün.','Yorgun zihin de çalışır, ama kendine ağır beklenti koyma.','Bugün az enerjiyle devam ediyorsun, bu da cesaret.'],
    mid:  ['Fena değil ama biraz daha iyi olabilir.','Yeterli olmasa da tamamen yoksun değilsin.','Bu gece biraz daha erken yatabilirsen iyi olur.','Uyku kalitesi kadar düzen de önemlidir.'],
    good: ['Güzel bir uyku, iyi başlangıç.','İyi uyumuşsun, beynin dinç.','Bu uyku düzenini koru, çok değerli.','Dinlenmiş bir zihin en büyük avantajdır.','Bu ritmi sürdürmeye çalış.'],
  },
  gurur: ['Küçük zaferler büyük şeylerin habercisidir.','Bunu hatırla. Zor günlerde işine yarayacak.','Kendini takdir etmek güçtür, ama öğrenebilirsin.','Bugün küçük bir şey yaptın ama bu küçük değil.','Bu his seni beslesin.','Her gün böyle bir an bulmaya çalış.','Gurur duymayı hak ediyorsun.','Bu anı kaydetmen önemli.'],
  streak: {
    s2:  ['İyi başlangıç! Devam et.','Başlamak bazen en zor kısımdır, onu geçtin.','2–3 gün peşpeşe küçük ama değerli.'],
    s5:  ['Alışkanlık oluşuyor. Bırakma.','Haftanın büyük kısmında buradasın, harika.','Düzenlilik en güçlü alışkanlıktır.','Bu seri seni besliyor.'],
    s7:  ['Bir hafta üstü! Bu artık bir alışkanlık.','Devam etmek artık daha kolay, hissettiriyor mu?','Çoğu insan buraya kadar gelemez. Sen geldin.','Bu disiplin seni farklı kılıyor.'],
    s14: ['İki haftadan fazla! Bu bir karakter meselesi artık.','Bunun farkında mısın? Gerçekten farkında mısın?','Bu alışkanlık seni geliştiriyor, fark etsen de etmesen de.','Uzun seriler nadirdir. Sen nadirsindir.','Bu kadar devam etmek kolay değil. Ama sen ettin.'],
  },
};

// Rastgele ama aynı gün tekrar yok
function wpPick(arr, seedKey) {
  if (!arr || !arr.length) return '';
  const today = getTodayKey ? getTodayKey() : new Date().toISOString().slice(0,10);
  const cacheKey = '_wp_' + seedKey + '_' + today;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached && arr.includes(cached)) return cached;
  // Dünkü seçimi kaydet, bugün farklı seç
  const yesterday = '_wp_' + seedKey + '_prev';
  const prev = localStorage.getItem(yesterday);
  let pool = prev ? arr.filter(s => s !== prev) : arr;
  if (!pool.length) pool = arr;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  sessionStorage.setItem(cacheKey, pick);
  localStorage.setItem(yesterday, pick);
  return pick;
}

function wpMood(moodValue)   { return wpPick(WP.mood[moodValue]   || WP.mood.ok, 'mood_' + moodValue); }
function wpEnerji(val)       { return wpPick(val<=3?WP.enerji.low:val<=6?WP.enerji.mid:WP.enerji.high, 'enerji_' + (val<=3?'l':val<=6?'m':'h')); }
function wpOdak(val)         { return wpPick(val<=3?WP.odak.low:val<=6?WP.odak.mid:WP.odak.high, 'odak_' + (val<=3?'l':val<=6?'m':'h')); }
function wpKaygi(val)        { return wpPick(val<=3?WP.kaygi.low:val<=6?WP.kaygi.mid:val<=8?WP.kaygi.high:WP.kaygi.vhigh, 'kaygi_' + val); }
function wpDers(ders)        { return wpPick(WP.ders[ders] || [], 'ders_' + ders); }
function wpUyku(val)         { return wpPick(val<5?WP.uyku.low:val<7?WP.uyku.mid:WP.uyku.good, 'uyku_' + (val<5?'l':val<7?'m':'h')); }
function wpGurur()           { return wpPick(WP.gurur, 'gurur'); }
function wpStreak(n)         { return wpPick(n>=14?WP.streak.s14:n>=7?WP.streak.s7:n>=5?WP.streak.s5:WP.streak.s2, 'streak_' + (n>=14?14:n>=7?7:n>=5?5:2)); }

// Telkin kutusu HTML
function telkinHtml(text, type='neutral') {
  if (!text) return '';
  const styles = {
    good:    'background:#43b89c0e;color:#085041;border:1px solid #43b89c2a',
    warn:    'background:#f9a8250e;color:#a07800;border:1px solid #f9a8252a',
    alert:   'background:#ff65840e;color:#cc3355;border:1px solid #ff65842a',
    neutral: 'background:var(--accent)0e;color:var(--accent);border:1px solid var(--accent)2a',
  };
  return `<div style="font-size:0.73rem;line-height:1.55;padding:7px 10px;border-radius:9px;margin-top:6px;${styles[type]||styles.neutral}">${text}</div>`;
}

// Streak hesapla
function hesaplaStreak() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  const data = (() => { try { return JSON.parse(localStorage.getItem('wellness_'+myUid)||'{}'); } catch(e){ return {}; } })();
  if (!data.days) return 0;
  let streak = 0;
  const d = new Date();
  while (streak < 365) {
    const key = d.toISOString().slice(0,10).replace(/-/g,'');
    if (data.days[key] && Object.keys(data.days[key]).length > 0) {
      streak++;
      d.setDate(d.getDate()-1);
    } else break;
  }
  return streak;
}

// ── WELLNESS SAYFASI ─────────────────────────────────────────
function wellnessPage() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  const storageKey = 'wellness_' + myUid;
  let data = {};
  try { data = JSON.parse(localStorage.getItem(storageKey)||'{}'); } catch(e){}

  const todayKey = getTodayKey();
  const today = data.days?.[todayKey] || {};
  window._wellnessCache = data;

  const streak = hesaplaStreak();
  const streakHtml = streak >= 2
    ? `<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.2);border-radius:99px;padding:3px 11px;font-size:0.7rem;font-weight:800;color:#fff;margin-top:10px">🔥 ${streak} günlük seri${streak>=14?' 🏅':streak>=7?' ⭐':''}</span>`
    : '';

  const now = new Date();
  const hour = now.getHours();
  const selamlama = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';
  const userName = (window.currentUserData?.name || '').split(' ')[0] || '';

  const last7 = Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-i); const dk=d.toISOString().slice(0,10).replace(/-/g,''); const dayData=data.days?.[dk]||{}; const mInfo=moodOptions.find(x=>x.value===dayData.mood); return {label:d.toLocaleDateString('tr-TR',{weekday:'short'}), emoji:mInfo?.emoji||'·', color:mInfo?.color||'var(--border)', filled:!!dayData.mood}; }).reverse();

  const subjects = ['Türkçe','Matematik','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce'];

  const gunlukNotData = (() => { try { const myUid=(window.currentUserData||{}).uid||'local'; return JSON.parse(localStorage.getItem('gunluk_not_'+myUid)||'{}'); } catch(e){ return {}; } })();
  const todayNot = gunlukNotData[todayKey] || '';

  const streakTelkin = streak>=2 ? telkinHtml(wpStreak(streak), 'good') : '';

  return `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
      <button onclick="showPage('dashboard')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem;padding:0">←</button>
      <div class="page-title" style="margin:0">📖 Günlüğüm</div>
    </div>
    <div class="page-sub">Bugünü kaydet — sadece senin için</div>

    <div style="background:linear-gradient(135deg,#6c63ff,#4cc9f0);border-radius:18px;padding:16px;margin:12px 0">
      <div style="font-size:0.68rem;color:rgba(255,255,255,0.8);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px">${now.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</div>
      <div style="font-size:1.05rem;font-weight:800;color:#fff">${selamlama}${userName?' '+userName:''} 👋</div>
      <div style="font-size:0.73rem;color:rgba(255,255,255,0.75);margin-top:2px">Bugünü birkaç satırla kaydet — sadece senin için.</div>
      ${streakHtml}
    </div>

    <div style="display:flex;gap:4px;margin-bottom:14px">
      ${last7.map(d=>`
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
          <div style="width:32px;height:32px;border-radius:50%;background:${d.color}25;border:2px solid ${d.filled?d.color:'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:0.9rem">${d.emoji}</div>
          <div style="font-size:0.56rem;color:var(--text2)">${d.label}</div>
        </div>`).join('')}
    </div>

    <!-- BÖLÜM 1: Duygu & Enerji -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">Bugün nasıl bir rüzgar var? 🌤️</div>
      <div style="display:flex;gap:4px;margin-bottom:8px">
        ${moodOptions.map(m=>`
          <button onclick="saveWellnessDay('mood','${m.value}',this)"
            style="flex:1;padding:8px 2px;border-radius:11px;border:2px solid ${today.mood===m.value?m.color:'var(--border)'};background:${today.mood===m.value?m.color+'22':'transparent'};cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:.15s">
            <span style="font-size:1.2rem">${m.emoji}</span>
            <span style="font-size:0.52rem;font-weight:700;color:${today.mood===m.value?m.color:'var(--text2)'}">${m.label}</span>
          </button>`).join('')}
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin:12px 0 6px">Enerji seviyesi (1–10)</div>
      <div style="display:flex;align-items:center;gap:12px">
        <input type="range" min="1" max="10" value="${today.enerji||5}" id="wellnessEnerji"
          oninput="this.nextElementSibling.textContent=this.value"
          style="flex:1;accent-color:var(--accent)">
        <span style="font-weight:900;font-size:1.1rem;color:var(--accent);min-width:22px;text-align:center">${today.enerji||5}</span>
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin:10px 0 5px">Bugünü tek kelimeyle?</div>
      <input type="text" id="wellnessKelime" placeholder="kararlı, dağınık, umutlu…"
        value="${today.kelime||''}"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box">
    </div>

    <!-- BÖLÜM 2: Akademik -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">Çalışma masasında ne var? 📚</div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:7px">En çok zorlandığın ders?</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">
        ${subjects.map(s=>`
          <button onclick="saveWellnessDay('zorDers','${s}',this)"
            style="padding:6px 10px;border-radius:9px;font-size:0.73rem;font-weight:700;cursor:pointer;font-family:inherit;border:1.5px solid ${today.zorDers===s?'var(--accent)':'var(--border)'};background:${today.zorDers===s?'var(--accent)0d':'transparent'};color:${today.zorDers===s?'var(--accent)':'var(--text2)'}">
            ${s}
          </button>`).join('')}
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin:0 0 6px">Odak seviyesi (1–10)</div>
      <div style="display:flex;align-items:center;gap:12px">
        <input type="range" min="1" max="10" value="${today.odak||5}" id="wellnessOdak"
          oninput="this.nextElementSibling.textContent=this.value"
          style="flex:1;accent-color:#45b7d1">
        <span style="font-weight:900;font-size:1.1rem;color:#45b7d1;min-width:22px;text-align:center">${today.odak||5}</span>
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin:10px 0 5px">Seni gururlandıran küçük bir an? 💪</div>
      <input type="text" id="wellnessGurur" placeholder="Küçük de olsa bir şey…"
        value="${today.gurur||''}"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box">
    </div>

    <!-- BÖLÜM 3: İç dünya -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">Zihnindeki ses 🧠</div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px">Kaygı seviyesi (1–10)</div>
      <div style="display:flex;align-items:center;gap:12px">
        <input type="range" min="1" max="10" value="${today.kaygi||3}" id="wellnessKaygi"
          oninput="this.nextElementSibling.textContent=this.value"
          style="flex:1;accent-color:#ff6b6b">
        <span style="font-weight:900;font-size:1.1rem;color:#ff6b6b;min-width:22px;text-align:center">${today.kaygi||3}</span>
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin:10px 0 5px">Bugün iyi giden bir şey?</div>
      <input type="text" id="wellnessPozitif" placeholder="Her şeye rağmen…"
        value="${today.pozitif||''}"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:10px">

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:5px">Aklını karıştıran bir düşünce?</div>
      <input type="text" id="wellnessNegatif" placeholder="İstersen yaz, sadece sana özel…"
        value="${today.negatif||''}"
        style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box">
    </div>

    <!-- BÖLÜM 4: Beden -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">Bedenine ne yaptın? 💤</div>
      <div style="margin-bottom:10px">
        <div style="font-size:0.7rem;font-weight:700;color:var(--text2);margin-bottom:5px">🛌 Uyku (saat)</div>
        <input type="number" min="2" max="12" step="0.5" id="wellnessUyku" placeholder="0"
          value="${today.uyku||''}"
          style="width:100%;padding:8px 10px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box">
      </div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <div style="flex:1">
          <div style="font-size:0.7rem;font-weight:700;color:var(--text2);margin-bottom:5px">💻 Online ders (saat)</div>
          <input type="number" min="0" max="12" step="0.5" id="wellnessEkranOnline" placeholder="0"
            value="${today.ekranOnline||''}"
            style="width:100%;padding:8px 10px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box">
        </div>
        <div style="flex:1">
          <div style="font-size:0.7rem;font-weight:700;color:var(--text2);margin-bottom:5px">📱 Sosyal medya (saat)</div>
          <input type="number" min="0" max="12" step="0.5" id="wellnessEkranSosyal" placeholder="0"
            value="${today.ekranSosyal||''}"
            style="width:100%;padding:8px 10px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.9rem;outline:none;box-sizing:border-box">
        </div>
      </div>

      <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin:6px 0 7px">Sabah dinç uyandın mı?</div>
      <div style="display:flex;gap:6px">
        ${[{v:'evet',l:'😄 Evet'},{v:'orta',l:'😐 Orta'},{v:'hayir',l:'😴 Hayır'}].map(o=>`
          <button onclick="saveWellnessDay('uykuKalite','${o.v}',this)"
            style="flex:1;padding:8px 6px;border-radius:9px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit;border:2px solid ${today.uykuKalite===o.v?'var(--accent)':'var(--border)'};background:${today.uykuKalite===o.v?'var(--accent)22':'transparent'};color:${today.uykuKalite===o.v?'var(--accent)':'var(--text2)'}">
            ${o.l}
          </button>`).join('')}
      </div>
    </div>

    ${streakTelkin ? `<div style="margin-bottom:12px">${streakTelkin}</div>` : ''}

    <!-- ANA KAYDET -->
    <button onclick="saveWellnessAll(this)"
      style="width:100%;padding:14px;border-radius:14px;background:var(--accent);color:#fff;border:none;font-weight:800;font-size:0.95rem;cursor:pointer;margin-bottom:28px">
      ✓ Günlüğü Kaydet
    </button>

    <!-- ÖZEL GÜNLÜK — görsel ayraç ile ayrılmış -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <div style="flex:1;height:1px;background:var(--border)"></div>
      <div style="font-size:0.65rem;font-weight:800;color:var(--text2);letter-spacing:.1em;white-space:nowrap">🔒 ÖZEL GÜNLÜK</div>
      <div style="flex:1;height:1px;background:var(--border)"></div>
    </div>
    <div class="card" style="margin-bottom:12px;border:1.5px solid var(--border)" id="gunlukNotKart">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div class="card-title" style="margin:0">Bugün ne düşündüm?</div>
      </div>
      <div style="font-size:0.72rem;color:var(--text2);margin-bottom:10px;padding:8px 10px;background:var(--surface2);border-radius:8px;line-height:1.5">
        🔒 Bu alan tamamen sana özel — koçun dahil kimse okuyamaz. PIN ile korunuyor.
      </div>
      ${todayNot ? `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#43b89c12;border:1px solid #43b89c33;border-radius:10px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1rem">🔒</span>
          <span style="font-size:0.8rem;font-weight:700;color:#085041">Kaydedildi ve gizlendi</span>
        </div>
        <button onclick="_gunlukDuzenlePin()" style="padding:4px 10px;border-radius:8px;border:1px solid #43b89c55;background:transparent;color:#085041;font-size:0.72rem;font-weight:700;cursor:pointer;font-family:inherit">Düzenle</button>
      </div>
      ` : `
      <textarea rows="4" style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-family:'Nunito',sans-serif;font-size:0.88rem;resize:none;outline:none;box-sizing:border-box;margin-bottom:8px"></textarea>
      <button onclick="_gunlukNotKaydet(this)"
        style="width:100%;padding:11px;border-radius:11px;background:#444;color:#fff;border:none;font-weight:800;font-size:0.85rem;cursor:pointer;font-family:inherit">
        🔒 Kaydet &amp; Gizle
      </button>
      `}
    </div>

    <!-- Geçmiş günlükler — PIN korumalı -->
    <div class="card" style="margin-bottom:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div class="card-title" style="margin:0">🔒 Geçmiş Günlükler</div>
        <button onclick="_gunlukArsivAc()" style="padding:6px 14px;border-radius:99px;border:none;background:var(--accent);color:#fff;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit">Aç →</button>
      </div>
      <div style="font-size:0.72rem;color:var(--text2)">Özel notların PIN ile korunuyor.</div>
    </div>
  `;
}


// ── GÜNLÜK NOT KAYDET / DÜZENLE ──────────────────────────────
// Günlük notları için ayrı key — loadWellnessFromFirestore bunu asla ezmez
function _gunlukNotKey() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  return 'gunluk_not_' + myUid;
}
function _gunlukNotOku() {
  try { return JSON.parse(localStorage.getItem(_gunlukNotKey())||'{}'); } catch(e){ return {}; }
}
function _gunlukNotYaz(data) {
  try { localStorage.setItem(_gunlukNotKey(), JSON.stringify(data)); } catch(e){}
}

function _gunlukNotKaydet(btn) {
  const kart = document.getElementById('gunlukNotKart');
  const ta = kart ? kart.querySelector('textarea') : null;
  const not = ta?.value.trim();
  if (!not) { showToast('⚠️', 'Bir şeyler yaz önce'); return; }

  // Sadece kendi özel key'ine yaz — wellness verisine dokunmaz
  const data = _gunlukNotOku();
  data[getTodayKey()] = not;
  _gunlukNotYaz(data);

  if (kart) {
    kart.innerHTML = `
      <div class="card-title">Bugün ne düşündüm?</div>
      <div style="font-size:0.72rem;color:var(--text2);margin-bottom:8px">Sadece sana özel — kimse okuyamaz, PIN ile korunuyor.</div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#43b89c12;border:1px solid #43b89c33;border-radius:10px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1rem">🔒</span>
          <span style="font-size:0.8rem;font-weight:700;color:#085041">Kaydedildi ve gizlendi</span>
        </div>
        <button onclick="_gunlukDuzenlePin()" style="padding:4px 10px;border-radius:8px;border:1px solid #43b89c55;background:transparent;color:#085041;font-size:0.72rem;font-weight:700;cursor:pointer;font-family:inherit">Düzenle</button>
      </div>`;
  }
  showToast('✅', 'Not kaydedildi');
}

function _gunlukDuzenlePin() {
  const pin = localStorage.getItem(_gunlukPinKey());
  if (!pin) { _gunlukNotDuzenle(); return; }
  window._pinBasariAksiyon = 'duzenle';
  _gunlukPinGir();
}

function _gunlukNotDuzenle() {
  const data = _gunlukNotOku();
  const mevcut = data[getTodayKey()] || '';

  const kart = document.getElementById('gunlukNotKart');
  if (!kart) return;
  kart.innerHTML = `
    <div class="card-title">Bugün ne düşündüm?</div>
    <div style="font-size:0.72rem;color:var(--text2);margin-bottom:8px">Sadece sana özel — kimse okuyamaz, PIN ile korunuyor.</div>
    <textarea rows="4" style="width:100%;padding:9px 11px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-family:'Nunito',sans-serif;font-size:0.88rem;resize:none;outline:none;box-sizing:border-box;margin-bottom:8px">${mevcut}</textarea>
    <button onclick="_gunlukNotKaydet(this)" style="width:100%;padding:11px;border-radius:11px;background:var(--accent);color:#fff;border:none;font-weight:800;font-size:0.85rem;cursor:pointer;font-family:inherit">🔒 Kaydet &amp; Gizle</button>`;
  setTimeout(()=>{ kart.querySelector('textarea')?.focus(); }, 50);
}



function _gunlukPinKey() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  return 'gunluk_pin_' + myUid;
}

function _gunlukArsivAc() {
  const pin = localStorage.getItem(_gunlukPinKey());
  if (!pin) {
    _gunlukPinKur();
  } else {
    _gunlukPinGir();
  }
}

function _gunlukPinKur() {
  const modal = document.createElement('div');
  modal.id = '_pinModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:28px 24px 36px">
      <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 22px"></div>
      <div style="text-align:center;margin-bottom:6px;font-size:1.6rem">🔒</div>
      <div style="font-size:1rem;font-weight:800;text-align:center;margin-bottom:6px">Günlük PINi Belirle</div>
      <div style="font-size:0.78rem;color:var(--text2);text-align:center;margin-bottom:22px;line-height:1.6">Geçmiş günlüklerini korumak için 4 haneli bir PIN belirle. Bu PIN sadece sende kalacak.</div>
      <div style="display:flex;justify-content:center;gap:10px;margin-bottom:20px" id="_pinDots1">
        ${[0,1,2,3].map(i=>`<div id="_dot1_${i}" style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border);background:transparent;transition:all .15s"></div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:220px;margin:0 auto 16px">
        ${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(n=>`
          <button onclick="_pinTus1('${n}')" style="padding:14px;border-radius:13px;border:1px solid var(--border);background:var(--surface2);font-size:1.1rem;font-weight:800;cursor:pointer;font-family:inherit;color:var(--text)">
            ${n}
          </button>`).join('')}
      </div>
      <div id="_pinHata1" style="text-align:center;font-size:0.78rem;color:#cc3355;display:none;margin-top:8px"></div>
      <button onclick="document.getElementById('_pinModal').remove()" style="width:100%;margin-top:10px;padding:11px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit">İptal</button>
    </div>`;
  document.body.appendChild(modal);
  window._pin1 = '';
  window._pin1Onay = '';
  window._pin1Asama = 1;
}

window._pin1 = '';
window._pin1Onay = '';
window._pin1Asama = 1;

function _pinTus1(n) {
  if (n === '') return;
  if (n === '⌫') {
    if (window._pin1Asama === 1) window._pin1 = window._pin1.slice(0,-1);
    else window._pin1Onay = window._pin1Onay.slice(0,-1);
  } else {
    if (window._pin1Asama === 1 && window._pin1.length < 4) window._pin1 += n;
    else if (window._pin1Asama === 2 && window._pin1Onay.length < 4) window._pin1Onay += n;
  }

  // Nokta güncelle
  const aktif = window._pin1Asama === 1 ? window._pin1 : window._pin1Onay;
  [0,1,2,3].forEach(i => {
    const dot = document.getElementById('_dot1_' + i);
    if (dot) {
      dot.style.background = i < aktif.length ? 'var(--accent)' : 'transparent';
      dot.style.borderColor = i < aktif.length ? 'var(--accent)' : 'var(--border)';
    }
  });

  if (window._pin1Asama === 1 && window._pin1.length === 4) {
    // Onay aşamasına geç
    window._pin1Asama = 2;
    const modal = document.getElementById('_pinModal');
    if (modal) {
      modal.querySelector('div[style*="1rem;font-weight:800"]').textContent = 'PINi Tekrar Gir';
      modal.querySelector('div[style*="0.78rem;color:var(--text2)"]').textContent = 'Aynı PINi tekrar girerek onayla.';
      modal.querySelector('#_pinDots1').id = '_pinDots1_done';
      const dots = modal.querySelector('[id^="_pinDots1"]');
      [0,1,2,3].forEach(i => { const d = document.getElementById('_dot1_'+i); if(d){d.style.background='var(--accent)44';d.style.borderColor='var(--accent)44';} });
      // Yeni dot satırı ekle
      const newDots = document.createElement('div');
      newDots.id = '_pinDots1';
      newDots.style.cssText = 'display:flex;justify-content:center;gap:10px;margin-bottom:20px';
      newDots.innerHTML = [0,1,2,3].map(i=>`<div id="_dot1_${i}" style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border);background:transparent;transition:all .15s"></div>`).join('');
      dots.insertAdjacentElement('afterend', newDots);
    }
    return;
  }

  if (window._pin1Asama === 2 && window._pin1Onay.length === 4) {
    const hata = document.getElementById('_pinHata1');
    if (window._pin1 === window._pin1Onay) {
      localStorage.setItem(_gunlukPinKey(), window._pin1);
      document.getElementById('_pinModal')?.remove();
      showToast('✅', 'PIN belirlendi! Günlüğün artık korumalı.');
      _gunlukArsivSayfasiAc();
    } else {
      if (hata) { hata.textContent = 'PINler eşleşmedi. Tekrar dene.'; hata.style.display = 'block'; }
      window._pin1 = '';
      window._pin1Onay = '';
      window._pin1Asama = 1;
      [0,1,2,3].forEach(i => {
        const d = document.getElementById('_dot1_'+i);
        if(d){d.style.background='transparent';d.style.borderColor='var(--border)';}
      });
    }
  }
}

function _gunlukPinGir(hedef) {
  window._pinHedef = hedef || 'arsiv';
  const modal = document.createElement('div');
  modal.id = '_pinGirModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:28px 24px 36px">
      <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 22px"></div>
      <div style="text-align:center;margin-bottom:6px;font-size:1.6rem">🔐</div>
      <div style="font-size:1rem;font-weight:800;text-align:center;margin-bottom:6px">PIN Gir</div>
      <div style="font-size:0.78rem;color:var(--text2);text-align:center;margin-bottom:22px">Günlüğünü açmak için PINini gir.</div>
      <div style="display:flex;justify-content:center;gap:10px;margin-bottom:20px">
        ${[0,1,2,3].map(i=>`<div id="_pinGirDot${i}" style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border);background:transparent;transition:all .15s"></div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:220px;margin:0 auto 16px">
        ${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(n=>`
          <button onclick="_pinGirTus('${n}')" style="padding:14px;border-radius:13px;border:1px solid var(--border);background:var(--surface2);font-size:1.1rem;font-weight:800;cursor:pointer;font-family:inherit;color:var(--text)">
            ${n}
          </button>`).join('')}
      </div>
      <div id="_pinGirHata" style="text-align:center;font-size:0.78rem;color:#cc3355;display:none;margin-bottom:8px"></div>
      <button onclick="_gunlukPinUnuttum()" style="width:100%;margin-bottom:6px;padding:10px;border-radius:12px;border:none;background:transparent;color:var(--text2);font-size:0.75rem;cursor:pointer;font-family:inherit;text-decoration:underline">PINimi unuttum</button>
      <button onclick="document.getElementById('_pinGirModal').remove()" style="width:100%;padding:11px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit">İptal</button>
    </div>`;
  document.body.appendChild(modal);
  window._pinGirilen = '';
}

function _pinGirTus(n) {
  if (n === '') return;
  if (n === '⌫') {
    window._pinGirilen = window._pinGirilen.slice(0,-1);
  } else if (window._pinGirilen.length < 4) {
    window._pinGirilen += n;
  }

  [0,1,2,3].forEach(i => {
    const dot = document.getElementById('_pinGirDot' + i);
    if (dot) {
      dot.style.background = i < window._pinGirilen.length ? 'var(--accent)' : 'transparent';
      dot.style.borderColor = i < window._pinGirilen.length ? 'var(--accent)' : 'var(--border)';
    }
  });

  if (window._pinGirilen.length === 4) {
    const dogruPin = localStorage.getItem(_gunlukPinKey());
    if (window._pinGirilen === dogruPin) {
      document.getElementById('_pinGirModal')?.remove();
      if (window._pinBasariAksiyon === 'duzenle') {
        window._pinBasariAksiyon = null;
        _gunlukNotDuzenle();
      } else {
        _gunlukArsivSayfasiAc();
      }
    } else {
      const hata = document.getElementById('_pinGirHata');
      if (hata) { hata.textContent = 'Yanlış PIN. Tekrar dene.'; hata.style.display = 'block'; }
      // Salla animasyonu
      [0,1,2,3].forEach(i => {
        const d = document.getElementById('_pinGirDot'+i);
        if(d){d.style.background='#cc3355';d.style.borderColor='#cc3355';}
      });
      setTimeout(()=>{
        window._pinGirilen = '';
        [0,1,2,3].forEach(i => {
          const d = document.getElementById('_pinGirDot'+i);
          if(d){d.style.background='transparent';d.style.borderColor='var(--border)';}
        });
      }, 600);
    }
  }
}

function _gunlukPinUnuttum() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:18px;padding:24px 20px;max-width:300px;width:100%;text-align:center">
      <div style="font-size:1.8rem;margin-bottom:8px">⚠️</div>
      <div style="font-weight:800;font-size:0.95rem;margin-bottom:8px">PINi Sıfırla</div>
      <div style="font-size:0.8rem;color:var(--text2);margin-bottom:18px;line-height:1.6">
        PINi sıfırlamak için tüm geçmiş günlük notların kalıcı olarak silinecek. Devam etmek istiyor musun?
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="this.closest('[style*=fixed]').remove()" style="flex:1;padding:11px;border-radius:11px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit">İptal</button>
        <button onclick="this.closest('[style*=fixed]').remove();_gunlukPinSifirla()" style="flex:1;padding:11px;border-radius:11px;border:none;background:#cc3355;color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit">Sıfırla</button>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}

function _gunlukPinSifirla() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  // Sadece günlük not key'ini sil — wellness verilerine dokunma
  localStorage.removeItem('gunluk_not_' + myUid);
  localStorage.removeItem(_gunlukPinKey());
  document.getElementById('_pinGirModal')?.remove();
  showToast('✅', 'PIN sıfırlandı. Günlük notlar temizlendi.');
}

function _gunlukArsivSayfasiAc() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  let data = {};
  try { data = JSON.parse(localStorage.getItem('gunluk_not_'+myUid)||'{}'); } catch(e){}

  const todayKey = getTodayKey();
  const gunler = Object.entries(data)
    .filter(([k,v]) => k !== todayKey && v)
    .sort(([a],[b]) => b.localeCompare(a));

  const modal = document.createElement('div');
  modal.id = '_arsivModal';
  modal.style.cssText = 'position:fixed;inset:0;background:#f0ece4;z-index:9999;display:flex;flex-direction:column;overflow:hidden';

  const icerik = gunler.length === 0
    ? `<div style="text-align:center;padding:60px 20px;color:var(--text2)">
        <div style="font-size:2rem;margin-bottom:8px">📭</div>
        <div style="font-weight:700">Henüz geçmiş günlük yok</div>
        <div style="font-size:0.78rem;margin-top:4px">Günlük not yazdıkça burada görünecek</div>
       </div>`
    : gunler.map(([k,v]) => {
        const d = new Date(k + 'T12:00:00');
        const tarih = d.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
        const colors = ['#6c63ff','#43b89c','#f9a825','#ff6584','#4cc9f0','#a855f7'];
        const renk = colors[Math.abs(k.split('').reduce((a,c)=>a+c.charCodeAt(0),0)) % colors.length];
        return `
        <div style="background:#faf8f2;border-radius:3px 14px 14px 3px;margin-bottom:20px;box-shadow:2px 4px 12px rgba(0,0,0,0.13);position:relative;border-left:4px solid ${renk}">
          <!-- Ataç -->
          <div style="position:absolute;top:-9px;right:22px;width:22px;height:30px;border:2.5px solid #aaa;border-radius:8px 8px 0 0;border-bottom:none;z-index:1;background:transparent"></div>
          <div style="position:absolute;top:-3px;right:25px;width:10px;height:18px;border:2px solid #ccc;border-radius:5px 5px 0 0;border-bottom:none;z-index:1;background:transparent"></div>
          <div style="padding:16px 14px 12px">
            <div style="font-size:0.65rem;font-weight:800;color:#b0a080;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e8e0d0">${tarih}</div>
            <div style="position:relative">
              <div style="position:absolute;inset:0;background:repeating-linear-gradient(transparent,transparent 26px,#e0d8c8 26px,#e0d8c8 27px);pointer-events:none;z-index:0"></div>
              <div style="position:relative;z-index:1;font-size:0.87rem;color:#3a3020;line-height:27px;white-space:pre-wrap;font-family:Georgia,'Times New Roman',serif;min-height:54px">${v}</div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:10px;padding-top:8px;border-top:1px dashed #d8ceb8">
              <button onclick="_arsivGunlukSil('${k}',this)" style="padding:3px 12px;border-radius:99px;border:1px solid #dda0a0;background:transparent;color:#cc6666;font-size:0.65rem;font-weight:700;cursor:pointer;font-family:inherit">Sil</button>
            </div>
          </div>
        </div>`;
      }).join('');

  modal.innerHTML = `
    <div style="background:#faf8f4;border-bottom:1px solid #e0d8cc;padding:14px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0">
      <button onclick="document.getElementById('_arsivModal').remove()" style="width:30px;height:30px;border-radius:9px;border:1px solid #e0d4c0;background:#f5f0e4;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#3a3020">←</button>
      <div style="font-size:0.95rem;font-weight:800;color:#3a3020">📖 Geçmiş Günlükler</div>
      <button onclick="_arsivPinDegistir()" style="margin-left:auto;padding:5px 11px;border-radius:8px;border:1px solid #e0d4c0;background:transparent;color:#8a7a5a;font-size:0.7rem;font-weight:700;cursor:pointer;font-family:inherit">PIN Değiştir</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:16px 14px;background:#ede9e0;background-image:repeating-linear-gradient(transparent,transparent 27px,#d4cec5 27px,#d4cec5 28px)">
      ${icerik}
    </div>
  `;
  document.body.appendChild(modal);
}

function _arsivGunlukAc(key) {
  const myUid = (window.currentUserData||{}).uid || 'local';
  let data = {};
  try { data = JSON.parse(localStorage.getItem('wellness_'+myUid)||'{}'); } catch(e){}
  const v = data.days?.[key] || {};
  const d = new Date(key + 'T12:00:00');
  const tarih = d.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const mInfo = moodOptions.find(x=>x.value===v.mood);

  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:flex-end;justify-content:center';
  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:24px 20px 32px;max-height:80vh;overflow-y:auto">
      <div style="width:32px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 18px"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        ${mInfo?`<span style="font-size:1.4rem">${mInfo.emoji}</span>`:''}
        <div style="font-size:0.85rem;font-weight:800;color:var(--text)">${tarih}</div>
      </div>
      ${v.kelime?`<div style="font-size:0.75rem;color:var(--accent);font-weight:700;margin-bottom:12px">"${v.kelime}"</div>`:''}
      <div style="height:1px;background:var(--border);margin-bottom:14px"></div>
      <div style="font-size:0.88rem;color:var(--text);line-height:1.75;white-space:pre-wrap">${v.not||'(Not yazılmamış)'}</div>
      <button onclick="this.closest('[style*=rgba]').remove()" style="width:100%;margin-top:20px;padding:12px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit">Kapat</button>
    </div>`;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}

function _arsivGunlukSil(key, btn) {
  const onay = document.createElement('div');
  onay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  onay.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:18px;padding:22px 18px;max-width:280px;width:100%;text-align:center">
      <div style="font-size:1.5rem;margin-bottom:6px">🗑️</div>
      <div style="font-weight:800;margin-bottom:6px">Bu günlüğü sil?</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:16px">Bu işlem geri alınamaz.</div>
      <div style="display:flex;gap:8px">
        <button onclick="this.closest('[style*=fixed]').remove()" style="flex:1;padding:10px;border-radius:10px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit">İptal</button>
        <button onclick="(function(){
          const myUid=(window.currentUserData||{}).uid||'local';
          let d={};try{d=JSON.parse(localStorage.getItem('gunluk_not_'+myUid)||'{}')}catch(e){}
          delete d['${key}'];
          try{localStorage.setItem('gunluk_not_'+myUid,JSON.stringify(d))}catch(e){}
          const card=document.querySelector('[onclick*=\\'${key}\\']')?.closest('div[style*=border-radius]');
          if(card)card.remove();
          this.closest('[style*=fixed]').remove();
          showToast('✅','Günlük notu silindi');
        })()" style="flex:1;padding:10px;border-radius:10px;border:none;background:#cc3355;color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit">Sil</button>
      </div>
    </div>`;
  onay.addEventListener('click', e => { if(e.target===onay) onay.remove(); });
  document.body.appendChild(onay);
}

function _arsivPinDegistir() {
  localStorage.removeItem(_gunlukPinKey());
  document.getElementById('_arsivModal')?.remove();
  showToast('ℹ️', 'Yeni PIN belirle');
  setTimeout(_gunlukPinKur, 300);
}

