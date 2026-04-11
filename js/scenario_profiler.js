// scenario_profiler.js — LGSKoç Profil Tespit ve Çelişki Yönetim Motoru
// ======================================================================
// 25 profil, 134 senaryo, çelişki grupları
// Profil belirlenir → sadece o profile ait senaryolar çıkar
// ======================================================================

// ── SENARYO-PROFİL HARİTASI ─────────────────────────────────────────
const PROFIL_SENARYOLAR = {
  P01: ['DYN-04','DYN-82','DYN-90','DYN-99','DYN-11','DYN-24','DYN-02'],
  P02: ['DYN-10','DYN-130','DYN-144','DYN-128','DYN-154','DYN-03'],
  P03: ['DYN-76','DYN-89','DYN-96','DYN-21','DYN-01','DYN-14','DYN-78','DYN-91','DYN-104','DYN-151'],
  P04: ['DYN-14','DYN-95','DYN-134','DYN-78','DYN-84','DYN-98','DYN-132','DYN-146','DYN-102','DYN-06','DYN-18'],
  P05: ['DYN-01','DYN-05','DYN-15','DYN-126','DYN-136','DYN-102','DYN-148','DYN-74'],
  P06: ['DYN-130','DYN-134','DYN-155','DYN-138','DYN-128','DYN-127','DYN-133','DYN-136','DYN-148','DYN-131','DYN-145','DYN-153','DYN-140','DYN-141'],
  P07: ['DYN-134','DYN-78','DYN-91','DYN-84','DYN-98','DYN-154','DYN-147','DYN-146','DYN-152','DYN-143'],
  P08: ['DYN-41','DYN-44','DYN-65','DYN-73','DYN-17','DYN-60','DYN-71','DYN-45','DYN-54','DYN-75','DYN-68','DYN-48','DYN-66'],
  P09: ['DYN-17','DYN-54','DYN-44','DYN-60','DYN-42','DYN-61','DYN-51','DYN-141'],
  P10: ['DYN-43','DYN-46','DYN-52','DYN-62','DYN-53','DYN-69','DYN-100'],
  P11: ['DYN-82','DYN-90','DYN-87','DYN-93','DYN-77','DYN-88','DYN-103'],
  P12: ['DYN-76','DYN-79','DYN-81','DYN-97','DYN-100','DYN-89','DYN-83','DYN-80'],
  P13: ['DYN-93','DYN-87','DYN-101','DYN-95','DYN-81','DYN-85','DYN-49','DYN-56'],
  P14: ['DYN-09','DYN-106','DYN-120','DYN-108','DYN-116','DYN-124','DYN-71','DYN-112','DYN-107','DYN-111','DYN-119'],
  P15: ['DYN-109','DYN-113','DYN-117','DYN-121','DYN-115','DYN-123','DYN-142'],
  P16: ['DYN-114','DYN-124','DYN-145','DYN-57','DYN-19','DYN-107'],
  P17: ['DYN-20','DYN-16','DYN-58','DYN-64','DYN-88','DYN-149','DYN-129','DYN-139'],
  P18: ['DYN-22','DYN-47','DYN-72','DYN-42','DYN-55','DYN-51','DYN-92'],
  P19: ['DYN-50','DYN-59','DYN-77','DYN-70','DYN-103','DYN-12'],
  P20: ['DYN-21','DYN-08','DYN-13','DYN-23','DYN-139'],
  P21: ['DYN-91','DYN-84','DYN-127','DYN-07','DYN-152','DYN-137'],
  P22: ['DYN-13','DYN-101','DYN-133','DYN-16'],
  P23: ['DYN-135','DYN-150','DYN-83','DYN-85','DYN-86','DYN-94','DYN-80'],
  P24: ['DYN-86','DYN-94','DYN-122','DYN-110','DYN-83','DYN-85','DYN-150'],
  P25: [], // Karma — en yüksek öncelikli senaryolar
};

// ── PROFİL AÇIKLAMALARI ──────────────────────────────────────────────
const PROFIL_ACIKLAMA = {
  P01: 'Akut Blokaj',
  P02: 'Kombine Çöküş',
  P03: 'Yüksek Fonksiyonlu Kaygı',
  P04: 'Robotik Tükeniş',
  P05: 'Hasarlı Yüksek Hacim',
  P06: 'Fizyolojik Limit',
  P07: 'Pre-Burnout',
  P08: 'Branş Kaçışı',
  P09: 'Branş Travması',
  P10: 'Branş Dengesizliği',
  P11: 'Öz-Yeterlilik Çöküşü',
  P12: 'Öz-Yeterlilik Yanılsaması',
  P13: 'Plato Dönemi',
  P14: 'Dijital Anestezi',
  P15: 'Dijital Sızıntı',
  P16: 'Hafta Sonu Dijital Patlaması',
  P17: 'Düşük Üretim / Motivasyon Kaybı',
  P18: 'Pasif Öğrenme Tuzağı',
  P19: 'Mükemmeliyetçi Kısıtlama',
  P20: 'Duygusal Maskeleme',
  P21: 'Duygusal Yorgunluk',
  P22: 'Kriz Sonrası Restorasyon',
  P23: 'Dengeli Aktif',
  P24: 'Yüksek Performans / Akış',
  P25: 'Karma Örüntü',
};

// ── PROFİL ÇATIŞMA KURALLARI ─────────────────────────────────────────
// Bir profil aktifse hangi profiller susacak
const PROFIL_CELISIK = {
  P01: ['P03','P04','P05','P08','P09','P10','P12','P13','P17','P18','P19','P20','P22','P23','P24'],
  P02: ['P03','P04','P05','P13','P17','P23','P24'],
  P03: ['P01','P02','P08_brans','P11','P17','P22'],
  P04: ['P01','P03'],
  P05: ['P01','P08','P17','P18','P19'],
  P06: ['P23','P24'],
  P07: ['P23','P24'],
  P09: ['P08'],  // Travma ve kaçış aynı anda değil
  P11: ['P03','P12'],  // Çöküş ve yanılsama aynı anda değil
  P12: ['P11'],
  P14: ['P15'],  // Anestezi ve hafif sızıntı aynı anda değil
  P15: ['P14'],
  P23: ['P01','P02','P06','P07'],
  P24: ['P01','P02','P06','P07','P11'],
};

// ── PROFİL TESPİT FONKSİYONU ────────────────────────────────────────
function _tespit_profil(bugun, hafta, ay, kal, tetiklenenIdSet) {
  const b = bugun, h = hafta;

  // Yardımcı kontroller
  const _kaygiYuksek  = b.kaygi >= kal.kaygi.yuksek;
  const _kaygiOrt     = b.kaygi >= kal.kaygi.ort;
  const _kaygiDusuk   = b.kaygi > 0 && b.kaygi < kal.kaygi.dusuk;
  const _enerjidusuk  = b.enerji > 0 && b.enerji < kal.enerji.dusuk;
  const _enerjiIyi    = b.enerji >= kal.enerji.yuksek;
  const _uykuDusuk    = b.uyku > 0 && b.uyku < 6.5;
  const _uykuIyi      = b.uyku >= 8;
  const _soruYuksek   = b.soru >= kal.soru.yuksek;
  const _soruOrt      = b.soru >= kal.soru.ort * 0.6;
  const _soruDusuk    = b.soru < kal.soru.dusuk * 0.5;
  const _soruSifir    = b.soru === 0;
  const _moodKotu     = b.mood === 'sad' || b.mood === 'bad';
  const _moodIyi      = b.mood === 'good' || b.mood === 'great';
  const _moodOrta     = b.mood === 'ok';
  const _sosyalYuksek = b.sosyal > kal.sosyal.yuksek;
  const _sosyalOrt    = h.haftaSosyalOrt > kal.sosyal.ort;
  const _hataYuksek   = b.hataOrani !== null && b.hataOrani > 35;
  const _hataDusuk    = b.hataOrani !== null && b.hataOrani < 15;
  const _hafOrtKaygi  = h.ortKaygi >= kal.kaygi.yuksek;
  const _hafOrtEnerji = h.ortEnerji < kal.enerji.dusuk;
  const _tutarli      = h.tutarliGunSayisi >= 4;
  const _zayifBrans   = h.zayifBrans !== null;
  const _zayifBransDusuk = h.zayifBransSure < 10;
  const _bransOrani   = (() => {
    if (!b.dersHata) return 1;
    const vals = Object.values(b.dersHata).map(v => v.q);
    const top = vals.reduce((a,b)=>a+b,0);
    const maks = Math.max(...vals, 0);
    return top > 0 ? maks/top : 1;
  })();

  // ── Aday profil puanları ──────────────────────────────────────────
  const puan = {};

  // P01 — Akut Blokaj
  puan.P01 = 0;
  if (_soruSifir && (_kaygiYuksek || _moodKotu)) puan.P01 += 40;
  if (tetiklenenIdSet.has('DYN-04') || tetiklenenIdSet.has('DYN-82') || tetiklenenIdSet.has('DYN-99')) puan.P01 += 30;
  if (_enerjidusuk && _soruSifir) puan.P01 += 20;
  if (tetiklenenIdSet.has('DYN-90') || tetiklenenIdSet.has('DYN-11')) puan.P01 += 10;

  // P02 — Kombine Çöküş
  puan.P02 = 0;
  if (_kaygiYuksek && _enerjidusuk) puan.P02 += 40;
  if (_uykuDusuk && _kaygiYuksek) puan.P02 += 20;
  if (tetiklenenIdSet.has('DYN-10') || tetiklenenIdSet.has('DYN-130') || tetiklenenIdSet.has('DYN-144')) puan.P02 += 30;
  if (_moodKotu && _enerjidusuk) puan.P02 += 10;

  // P03 — Yüksek Fonksiyonlu Kaygı
  puan.P03 = 0;
  if (_soruOrt && _kaygiYuksek) puan.P03 += 40;
  if (tetiklenenIdSet.has('DYN-76') || tetiklenenIdSet.has('DYN-89') || tetiklenenIdSet.has('DYN-96')) puan.P03 += 30;
  if (!_enerjidusuk && _kaygiYuksek) puan.P03 += 15;
  if (_hataDusuk && _kaygiYuksek) puan.P03 += 15;

  // P04 — Robotik Tükeniş
  puan.P04 = 0;
  if (_soruOrt && _moodOrta && _tutarli) puan.P04 += 30;
  if (tetiklenenIdSet.has('DYN-14') || tetiklenenIdSet.has('DYN-95') || tetiklenenIdSet.has('DYN-134')) puan.P04 += 30;
  if (!_kaygiYuksek && !_moodIyi && _tutarli) puan.P04 += 20;
  if (_hafOrtEnerji && _soruOrt) puan.P04 += 20;

  // P05 — Hasarlı Yüksek Hacim
  puan.P05 = 0;
  if (_soruYuksek && (_kaygiYuksek || _uykuDusuk)) puan.P05 += 50;
  if (tetiklenenIdSet.has('DYN-01') || tetiklenenIdSet.has('DYN-05') || tetiklenenIdSet.has('DYN-15')) puan.P05 += 30;
  if (_hataYuksek && _soruYuksek) puan.P05 += 20;

  // P06 — Fizyolojik Limit
  puan.P06 = 0;
  if (_uykuDusuk && _enerjidusuk) puan.P06 += 50;
  if (h.dusukEnerjiGunSayisi >= 3 || h.dusukOdakGunSayisi >= 3) puan.P06 += 30;
  if (tetiklenenIdSet.has('DYN-130') || tetiklenenIdSet.has('DYN-134') || tetiklenenIdSet.has('DYN-138')) puan.P06 += 20;
  if (_hafOrtEnerji) puan.P06 += 20;

  // P07 — Pre-Burnout
  puan.P07 = 0;
  if (_tutarli && _hafOrtEnerji && _moodKotu) puan.P07 += 40;
  if (tetiklenenIdSet.has('DYN-134') && tetiklenenIdSet.has('DYN-78')) puan.P07 += 30;
  if (h.enerjiTrend === 'düşüş' && _tutarli) puan.P07 += 20;
  if (h.dusukEnerjiGunSayisi >= 4) puan.P07 += 20;

  // P08 — Branş Kaçışı
  puan.P08 = 0;
  if (_zayifBrans && _zayifBransDusuk) puan.P08 += 40;
  if (tetiklenenIdSet.has('DYN-41') || tetiklenenIdSet.has('DYN-65') || tetiklenenIdSet.has('DYN-73')) puan.P08 += 30;
  if (_bransOrani > 0.55 && _soruOrt) puan.P08 += 20;
  if (!_kaygiYuksek && _zayifBransDusuk) puan.P08 += 10;

  // P09 — Branş Travması
  puan.P09 = 0;
  if (_zayifBrans && _kaygiYuksek && h.zayifBransDenemeIsabet < 45) puan.P09 += 50;
  if (tetiklenenIdSet.has('DYN-17') || tetiklenenIdSet.has('DYN-54') || tetiklenenIdSet.has('DYN-44')) puan.P09 += 30;
  if (_moodKotu && _zayifBransDusuk) puan.P09 += 20;

  // P10 — Branş Dengesizliği
  puan.P10 = 0;
  if (_bransOrani > 0.6 && _soruOrt) puan.P10 += 40;
  if (tetiklenenIdSet.has('DYN-43') || tetiklenenIdSet.has('DYN-52') || tetiklenenIdSet.has('DYN-62')) puan.P10 += 30;
  if (!_zayifBrans && _bransOrani > 0.65) puan.P10 += 20;

  // P11 — Öz-Yeterlilik Çöküşü
  puan.P11 = 0;
  if (_moodKotu && _soruDusuk) puan.P11 += 40;
  if (tetiklenenIdSet.has('DYN-82') || tetiklenenIdSet.has('DYN-90') || tetiklenenIdSet.has('DYN-87')) puan.P11 += 30;
  if (_kaygiYuksek && _soruDusuk && _moodKotu) puan.P11 += 20;

  // P12 — Öz-Yeterlilik Yanılsaması
  puan.P12 = 0;
  if (tetiklenenIdSet.has('DYN-76') || tetiklenenIdSet.has('DYN-79') || tetiklenenIdSet.has('DYN-97')) puan.P12 += 40;
  if (_soruOrt && (_hataYuksek || _hataDusuk)) puan.P12 += 30;
  if (tetiklenenIdSet.has('DYN-81') || tetiklenenIdSet.has('DYN-89')) puan.P12 += 20;

  // P13 — Plato Dönemi
  puan.P13 = 0;
  if (h.denemeTrend === 'stabil' && _soruOrt && _tutarli) puan.P13 += 40;
  if (tetiklenenIdSet.has('DYN-93') || tetiklenenIdSet.has('DYN-87') || tetiklenenIdSet.has('DYN-81')) puan.P13 += 30;
  if (h.isatetTrend < 5 && h.isatetTrend > -5 && _tutarli) puan.P13 += 20;

  // P14 — Dijital Anestezi
  puan.P14 = 0;
  if (_sosyalYuksek && _kaygiYuksek) puan.P14 += 50;
  if (tetiklenenIdSet.has('DYN-09') || tetiklenenIdSet.has('DYN-106') || tetiklenenIdSet.has('DYN-120')) puan.P14 += 30;
  if (_sosyalYuksek && (_moodKotu || _enerjidusuk)) puan.P14 += 20;

  // P15 — Dijital Sızıntı
  puan.P15 = 0;
  if (_sosyalOrt && !_kaygiYuksek) puan.P15 += 30;
  if (tetiklenenIdSet.has('DYN-109') || tetiklenenIdSet.has('DYN-113') || tetiklenenIdSet.has('DYN-117')) puan.P15 += 30;
  if (h.isatetTrend < -5 && _sosyalOrt) puan.P15 += 20;

  // P16 — Hafta Sonu Dijital
  puan.P16 = 0;
  const _gun = b.dk ? new Date(b.dk + 'T12:00:00').getDay() : -1;
  if ((_gun === 0 || _gun === 6) && _sosyalYuksek) puan.P16 += 50;
  if (tetiklenenIdSet.has('DYN-114') || tetiklenenIdSet.has('DYN-57')) puan.P16 += 20;

  // P17 — Düşük Üretim / Motivasyon
  puan.P17 = 0;
  if (_soruDusuk && !_kaygiYuksek && _moodIyi) puan.P17 += 40;
  if (tetiklenenIdSet.has('DYN-20') || tetiklenenIdSet.has('DYN-58') || tetiklenenIdSet.has('DYN-64')) puan.P17 += 30;
  if (_kaygiDusuk && _soruDusuk) puan.P17 += 20;

  // P18 — Pasif Öğrenme
  puan.P18 = 0;
  if (b.tekrarSure > 60 && _soruDusuk) puan.P18 += 40;
  if (b.konuSure > 90 && b.soru < 20) puan.P18 += 30;
  if (tetiklenenIdSet.has('DYN-22') || tetiklenenIdSet.has('DYN-47') || tetiklenenIdSet.has('DYN-72')) puan.P18 += 20;

  // P19 — Mükemmeliyetçi Kısıtlama
  puan.P19 = 0;
  if (_soruDusuk && _hataDusuk) puan.P19 += 40;
  if (tetiklenenIdSet.has('DYN-50') || tetiklenenIdSet.has('DYN-59') || tetiklenenIdSet.has('DYN-77')) puan.P19 += 30;
  if (_kaygiYuksek && _hataDusuk && _soruDusuk) puan.P19 += 20;

  // P20 — Duygusal Maskeleme
  puan.P20 = 0;
  if (_moodIyi && (_kaygiYuksek || _enerjidusuk)) puan.P20 += 50;
  if (tetiklenenIdSet.has('DYN-21') || tetiklenenIdSet.has('DYN-08')) puan.P20 += 30;

  // P21 — Duygusal Yorgunluk
  puan.P21 = 0;
  if (_moodKotu && _tutarli && !_enerjidusuk) puan.P21 += 40;
  if (tetiklenenIdSet.has('DYN-91') || tetiklenenIdSet.has('DYN-84') || tetiklenenIdSet.has('DYN-127')) puan.P21 += 30;
  if (h.haftalikMoodOrt < 2.5 && _tutarli) puan.P21 += 20;

  // P22 — Kriz Sonrası
  puan.P22 = 0;
  if (_moodIyi && h.ortKaygi >= kal.kaygi.yuksek) puan.P22 += 30;
  if (tetiklenenIdSet.has('DYN-13') || tetiklenenIdSet.has('DYN-133')) puan.P22 += 30;
  if (_soruSifir && _moodIyi) puan.P22 += 20;

  // P23 — Dengeli Aktif
  puan.P23 = 0;
  if (_soruOrt && !_kaygiYuksek && _uykuIyi && !_enerjidusuk) puan.P23 += 40;
  if (tetiklenenIdSet.has('DYN-135') || tetiklenenIdSet.has('DYN-150') || tetiklenenIdSet.has('DYN-83')) puan.P23 += 30;
  if (_moodIyi && _soruOrt && !_moodKotu) puan.P23 += 20;

  // P24 — Yüksek Performans / Akış
  puan.P24 = 0;
  if (_soruYuksek && _enerjiIyi && _moodIyi) puan.P24 += 50;
  if (tetiklenenIdSet.has('DYN-86') || tetiklenenIdSet.has('DYN-94') || tetiklenenIdSet.has('DYN-122')) puan.P24 += 30;
  if (_hataDusuk && _soruYuksek && _uykuIyi) puan.P24 += 20;

  // ── En yüksek puanlı profili seç ────────────────────────────────────
  let secilenProfil = 'P25';
  let enYuksekPuan = 30; // Min eşik — altında kalırsa P25 (karma)

  for (const [pid, p] of Object.entries(puan)) {
    if (p > enYuksekPuan) {
      enYuksekPuan = p;
      secilenProfil = pid;
    }
  }

  return { profil: secilenProfil, puanlar: puan };
}

// ── ANA FİLTRE: Profile göre senaryo seç ────────────────────────────
function _profilSenaryoFiltrele(tetiklenenTum, seciliProfil, maxNeg, maxPos) {
  const profilSenaryolar = new Set(PROFIL_SENARYOLAR[seciliProfil] || []);

  // P25 karma ise filtre yok, önceliğe göre sırala
  if (seciliProfil === 'P25' || profilSenaryolar.size === 0) {
    return tetiklenenTum.slice(0, maxNeg);
  }

  // Sadece bu profile ait senaryoları al
  return tetiklenenTum.filter(s => profilSenaryolar.has(s.id)).slice(0, maxNeg);
}

// ── DIŞ AKTARIM ─────────────────────────────────────────────────────
window._tespit_profil      = _tespit_profil;
window._profilSenaryoFiltrele = _profilSenaryoFiltrele;
window.PROFIL_SENARYOLAR   = PROFIL_SENARYOLAR;
window.PROFIL_ACIKLAMA     = PROFIL_ACIKLAMA;
