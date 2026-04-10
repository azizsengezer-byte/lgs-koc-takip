// scenario_runner.js — LGSKoç Senaryo Eşleştirme Motoru
// =========================================================
// Günlük/haftalık/aylık verilerle senaryo havuzunu çarpıştırır.
// Baskınlık sıralaması uygular, kombinasyonları çözer.
// =========================================================

// ── HAFTALIK HESAPLAMALAR ────────────────────────────────
// gunler: son 7 günlük gün dizisi (teacher_psych'deki format)
// allEntries: tüm akademik girişler
function _hesaplaHafta(gunler, allEntries, kal) {
  const son7 = gunler.slice(-7);
  const veriGunler = son7.filter(d => d.kaygi > 0 || d.uyku > 0 || d.enerji > 0);
  const aktifGunler = son7.filter(d => d.soru > 0);

  // Trend hesabı: ilk yarı vs ikinci yarı
  const trendHesapla = (dizi, field) => {
    const v = dizi.filter(d => d[field] > 0).map(d => d[field]);
    if (v.length < 3) return 'yetersiz_veri';
    const ilk = v.slice(0, Math.floor(v.length / 2));
    const son = v.slice(Math.floor(v.length / 2));
    const ortIlk = ilk.reduce((a, b) => a + b, 0) / ilk.length;
    const ortSon = son.reduce((a, b) => a + b, 0) / son.length;
    if (ortSon - ortIlk > 1) return 'yükseliş';
    if (ortIlk - ortSon > 1) return 'düşüş';
    return 'stabil';
  };

  const fn = (arr, f) => {
    const v = arr.filter(d => d[f] > 0).map(d => d[f]);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
  };

  // İsabet trendi (0-100 skoru, hafta başından sona)
  const isabetDizi = aktifGunler
    .filter(d => d.hataOrani !== null)
    .map(d => 100 - d.hataOrani);
  const isatetTrend = (() => {
    if (isabetDizi.length < 3) return 0;
    const ilk = isabetDizi.slice(0, Math.floor(isabetDizi.length / 2));
    const son = isabetDizi.slice(Math.floor(isabetDizi.length / 2));
    const ortIlk = ilk.reduce((a, b) => a + b, 0) / ilk.length;
    const ortSon = son.reduce((a, b) => a + b, 0) / son.length;
    return ortSon - ortIlk; // pozitif = artış, negatif = düşüş
  })();

  // Zayıf branş tespiti (son 7 gün içinde en düşük isabetli)
  const dersToplamlar = {};
  son7.forEach(d => {
    if (!d.dersHata) return;
    Object.entries(d.dersHata).forEach(([ders, v]) => {
      if (!dersToplamlar[ders]) dersToplamlar[ders] = { q: 0, y: 0 };
      dersToplamlar[ders].q += v.q;
      dersToplamlar[ders].y += v.y;
    });
  });
  const zayifBrans = (() => {
    const dersler = Object.entries(dersToplamlar)
      .filter(([d, v]) => v.q >= 20)
      .map(([d, v]) => ({ d, isabet: (1 - v.y / v.q) * 100 }))
      .sort((a, b) => a.isabet - b.isabet);
    return dersler.length ? dersler[0].d : null;
  })();

  // Zayıf branşta haftalık süre payı (%)
  const toplamSure = son7.reduce((a, d) => a + (d.sure || 0), 0);
  const zayifBransSure = (() => {
    if (!zayifBrans) return 50;
    const zayifEntries = (allEntries || []).filter(e =>
      e.subject === zayifBrans && e.type === 'soru' &&
      son7.some(d => d.dk === e.dateKey)
    );
    const sure = zayifEntries.reduce((a, e) => a + (e.duration || 0), 0);
    return toplamSure > 0 ? (sure / toplamSure) * 100 : 0;
  })();

  // Zayıf branşın deneme isabeti
  const zayifBransDenemeIsabet = (() => {
    if (!zayifBrans) return 60;
    const toplam = dersToplamlar[zayifBrans];
    if (!toplam || toplam.q < 10) return 60;
    return (1 - toplam.y / toplam.q) * 100;
  })();

  // Boş gün sayısı (wellness de yok, akademik de yok)
  const bosGunSayisi = son7.filter(d =>
    d.soru === 0 && d.kaygi === 0 && d.enerji === 0 && d.uyku === 0
  ).length;

  // Birim soru süresi (dk/soru)
  const toplamSoruHafta = son7.reduce((a, d) => a + d.soru, 0);
  const birimSoreSure = toplamSoruHafta > 0 ? toplamSure / toplamSoruHafta : 0;

  // Enerji ve odak trend
  const enerjiTrend = trendHesapla(son7, 'enerji');
  const odakTrend = trendHesapla(son7, 'odak');

  // Düşük enerji/odak gün sayısı
  const dusukEnerjiGunSayisi = son7.filter(d => d.enerji > 0 && d.enerji < kal.enerji.dusuk).length;
  const dusukOdakGunSayisi = son7.filter(d => d.odak > 0 && d.odak < kal.odak.dusuk).length;

  // Önceki gün sosyal medya (bugünün bilişsel sis hesabı için)
  const dunkuSosyal = son7.length >= 2 ? (son7[son7.length - 2]?.sosyal || 0) : 0;

  // Tekrar tutarlılığı: kaç gün tekrar yapıldı
  const tekrarEntries = (allEntries || []).filter(e =>
    e.type === 'tekrar' && son7.some(d => d.dk === e.dateKey)
  );
  const tekrarSure = tekrarEntries.reduce((a, e) => a + (e.duration || 0), 0);
  const tekrarTutarlilik = son7.filter(d =>
    tekrarEntries.some(e => e.dateKey === d.dk)
  ).length;

  // Veri giriş tutarlılığı
  const veriGirisTutarliligi = veriGunler.length;

  // Hafta soru toplamı
  const haftaSoruToplamı = son7.reduce((a, d) => a + d.soru, 0);

  // Haftalık ortalamalar
  const haftaSosyalOrt = fn(son7, 'sosyal');
  const haftaOdakOrt = fn(son7, 'odak');
  const haftalikMoodOrt = (() => {
    const moodPuan = { 'excited': 5, 'good': 4, 'focused': 4, 'ok': 3, 'tired': 2, 'anxious': 2, 'sad': 1 };
    const v = son7.filter(d => d.mood).map(d => moodPuan[d.mood] || 3);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 3;
  })();

  // Deneme trendi
  const denemeTrend = (() => {
    const deneme = son7.filter(d => d.net > 0).map(d => d.net);
    if (deneme.length < 2) return 'yetersiz_veri';
    return deneme[deneme.length - 1] < deneme[0] ? 'düşüş' :
           deneme[deneme.length - 1] > deneme[0] ? 'yükseliş' : 'stabil';
  })();

  // Öz-yeterlilik trendi (mood + isabet birleşimi basit)
  const ozYeterlilikTrend = (() => {
    const moodPuan = { 'excited': 5, 'good': 4, 'focused': 4, 'ok': 3, 'tired': 2, 'anxious': 2, 'sad': 1 };
    const v = son7.filter(d => d.mood && d.hataOrani !== null)
      .map(d => ((moodPuan[d.mood] || 3) + (100 - d.hataOrani) / 20) / 2);
    if (v.length < 3) return 'stabil';
    const ilk = v.slice(0, Math.floor(v.length / 2));
    const son = v.slice(Math.floor(v.length / 2));
    const diff = (son.reduce((a, b) => a + b, 0) / son.length) -
                 (ilk.reduce((a, b) => a + b, 0) / ilk.length);
    return diff > 0.3 ? 'pozitif' : diff < -0.3 ? 'negatif' : 'stabil';
  })();

  // Zayıf branş süresinin azalıp azalmadığı
  const zayifBransSureAzalma = (() => {
    if (!zayifBrans) return false;
    const ilkYariEntries = (allEntries || []).filter(e =>
      e.subject === zayifBrans && e.type === 'soru' &&
      son7.slice(0, 3).some(d => d.dk === e.dateKey)
    );
    const ikinciYariEntries = (allEntries || []).filter(e =>
      e.subject === zayifBrans && e.type === 'soru' &&
      son7.slice(4).some(d => d.dk === e.dateKey)
    );
    const ilkSure = ilkYariEntries.reduce((a, e) => a + (e.duration || 0), 0);
    const ikinciSure = ikinciYariEntries.reduce((a, e) => a + (e.duration || 0), 0);
    return ilkSure > ikinciSure + 10;
  })();

  // Tutarlı gün sayısı (soru > kalibre ort * 0.7)
  const tutarliGunSayisi = son7.filter(d => d.soru >= kal.soru.ort * 0.7).length;

  // Ortalama uyku/kaygi/enerji
  const ortUyku = fn(son7, 'uyku');
  const ortKaygi = fn(son7, 'kaygi');
  const ortEnerji = fn(son7, 'enerji');
  const ortSoru = aktifGunler.length ? haftaSoruToplamı / aktifGunler.length : 0;

  // Önceki hafta kaygı (hafta başındaki ilk 3 gün)
  const oncekiHaftaKaygi = fn(son7.slice(0, 3), 'kaygi');

  // Deneme sonrası gün mü (son 2 günde deneme var mı)
  const denemeSonrasiGun = son7.slice(-2).some(d => d.net > 0 && d.soru > 0);
  const denemedeSonraSoru = son7.slice(-1)[0]?.soru || 0;

  // Gece ekran var mı (bugün sosyal > 2 ve uyku < 7)
  const bugun = son7[son7.length - 1] || {};
  const geceEkranVar = bugun.sosyal > 2 && bugun.uyku < 7;

  // Soruların hedefi karşılama oranı
  const soruHedefiKarsilama = kal.soru.ort > 0
    ? son7.filter(d => d.soru > 0).filter(d => d.soru >= kal.soru.ort * 0.85).length / Math.max(son7.filter(d => d.soru > 0).length, 1)
    : 0;

  return {
    isatetTrend, enerjiTrend, odakTrend, denemeTrend, ozYeterlilikTrend,
    zayifBrans, zayifBransSure, zayifBransDenemeIsabet, zayifBransSureAzalma,
    bosGunSayisi, birimSoreSure, dusukEnerjiGunSayisi, dusukOdakGunSayisi,
    dunkuSosyal, tekrarSure, tekrarTutarlilik, veriGirisTutarliligi,
    haftaSoruToplamı, haftaSosyalOrt, haftaOdakOrt, haftalikMoodOrt,
    ortUyku, ortKaygi, ortEnerji, ortSoru, oncekiHaftaKaygi,
    denemeSonrasiGun, denemedeSonraSoru, geceEkranVar, soruHedefiKarsilama,
    tutarliGunSayisi,
  };
}

// ── AYLIK HESAPLAMALAR ───────────────────────────────────
function _hesaplaAy(gunler30, kal) {
  const fn = (arr, f) => {
    const v = arr.filter(d => d[f] > 0).map(d => d[f]);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
  };

  const aktif = gunler30.filter(d => d.soru > 0);
  const soruDizi = aktif.map(d => d.soru);
  const ilkYari = aktif.slice(0, Math.floor(aktif.length / 2));
  const ikinciYari = aktif.slice(Math.floor(aktif.length / 2));
  const ortIlkSoru = ilkYari.length ? ilkYari.reduce((a, d) => a + d.soru, 0) / ilkYari.length : 0;
  const ortSonSoru = ikinciYari.length ? ikinciYari.reduce((a, d) => a + d.soru, 0) / ikinciYari.length : 0;
  const aylikSoruArtisSuresi = ortIlkSoru > 0 ? (ortSonSoru - ortIlkSoru) / ortIlkSoru : 0;

  const isabetDizi = aktif.filter(d => d.hataOrani !== null).map(d => 100 - d.hataOrani);
  const ilkIsabet = isabetDizi.slice(0, Math.floor(isabetDizi.length / 2));
  const sonIsabet = isabetDizi.slice(Math.floor(isabetDizi.length / 2));
  const ortIlkIsabet = ilkIsabet.length ? ilkIsabet.reduce((a, b) => a + b, 0) / ilkIsabet.length : 0;
  const ortSonIsabet = sonIsabet.length ? sonIsabet.reduce((a, b) => a + b, 0) / sonIsabet.length : 0;
  const aylikIsabetArtis = ortSonIsabet - ortIlkIsabet;

  return {
    aylikSoruArtisSuresi,
    aylikIsabetArtis,
    ortUyku: fn(gunler30, 'uyku'),
    ortEnerji: fn(gunler30, 'enerji'),
  };
}

// ── BUGÜN OBJESİ HAZIRLA ────────────────────────────────
// teacher_psych'deki gunler dizisinin son elemanından bugun objesini türetir
function _bugunHazirla(bugunGun, allEntries, dk) {
  const konuEntries = (allEntries || []).filter(e => e.type === 'konu' && e.dateKey === dk);
  const tekrarEntries = (allEntries || []).filter(e => e.type === 'tekrar' && e.dateKey === dk);
  return {
    ...bugunGun,
    konuSure: konuEntries.reduce((a, e) => a + (e.duration || 0), 0),
    tekrarSure: tekrarEntries.reduce((a, e) => a + (e.duration || 0), 0),
    hataOrani: bugunGun.hataOrani,
  };
}

// ── SENARYO EŞLEŞTİRİCİ ─────────────────────────────────
// Tüm senaryoları çalıştırır, tetiklenen + baskınlık + kombinasyonları döndürür
function calistirSenaryolar(gunler, allEntries, bugunDk) {
  if (!window.SENARYOLAR || !gunler || gunler.length === 0) return { insights: [], positives: [], vaka: null };

  const gunler14 = gunler.slice(-14);
  const gunler7  = gunler.slice(-7);
  const gunler30 = gunler.slice(-30);
  const kal = window._kalibre(gunler14);

  // Aylık/haftalık raporlarda endKey'de veri olmayabilir
  // Son verisi olan günü bul (wellness VEYA akademik)
  const _sonVeriGun = [...gunler].reverse().find(d =>
    d.kaygi > 0 || d.uyku > 0 || d.enerji > 0 || d.soru > 0
  );
  const bugunGun = gunler.find(d => d.dk === bugunDk) || _sonVeriGun || gunler[gunler.length - 1] || {};
  const bugunDkGercek = bugunGun.dk || bugunDk;
  const bugun = _bugunHazirla(bugunGun, allEntries, bugunDkGercek);
  const hafta = _hesaplaHafta(gunler7, allEntries, kal);
  const ay    = _hesaplaAy(gunler30, kal);

  // ── Tetikleme ──
  const tetiklenen = [];
  window.SENARYOLAR.forEach(s => {
    try {
      if (s.tetikle(bugun, hafta, ay, kal)) tetiklenen.push(s);
    } catch(e) { /* veri eksikliği — sessizce atla */ }
  });

  const pozitifTetiklenen = [];
  window.POZITIF_SENARYOLAR.forEach(s => {
    try {
      if (s.tetikle(bugun, hafta, ay, kal)) pozitifTetiklenen.push(s);
    } catch(e) {}
  });

  // ── Baskınlık & Susturma ──
  // Priority 90+ varsa 70 altındaki negatif senaryolar susar
  const kritikVar = tetiklenen.some(s => s.priority >= 90);
  const psikVar   = tetiklenen.some(s => s.priority >= 70 && s.priority < 90);

  const aktifNegatif = tetiklenen.filter(s => {
    if (kritikVar && s.priority < 70) return false;  // Kritik varsa Akademik susar
    return true;
  }).sort((a, b) => b.priority - a.priority);

  // ── Vaka Kombinasyon Kontrolü ──
  let aktifVaka = null;
  const tetiklenenIdler = new Set([...aktifNegatif.map(s => s.id), ...pozitifTetiklenen.map(s => s.id)]);

  window.VAKA_KOMBINASYONLARI.forEach(v => {
    if (v.senaryolar.every(id => tetiklenenIdler.has(id))) {
      if (!aktifVaka || v.priority > aktifVaka.priority) aktifVaka = v;
    }
  });

  // ── Maksimum Çıktı Limiti ──
  // Koça gürültü vermemek için: max 3 negatif + max 2 pozitif + 1 vaka
  const ciktiNegatif = aktifNegatif.slice(0, 3);
  const ciktiPozitif = pozitifTetiklenen.sort((a, b) => b.priority - a.priority).slice(0, 2);

  // ── Insights Üret ──
  const insights = ciktiNegatif.map(s => ({
    id: s.id,
    modul: s.modul,
    priority: s.priority,
    etiket: s.etiket,
    analiz: s.cikti.analiz,
    strateji: s.cikti.strateji,
    aylikEtiket: s.cikti.aylikEtiket,
    ton: s.cikti.ton,
    tip: 'negatif'
  }));

  const positives = ciktiPozitif.map(s => ({
    id: s.id,
    etiket: s.etiket,
    analiz: s.cikti.analiz,
    strateji: s.cikti.strateji,
    aylikEtiket: s.cikti.aylikEtiket,
    ton: s.cikti.ton,
    tip: 'pozitif'
  }));

  // ── Kalibrasyon Özeti ──
  const kalOzet = {
    soruOrt: Math.round(kal.soru.ort),
    kaygiEsik: Math.round(kal.kaygi.yuksek * 10) / 10,
    uyku: Math.round(kal.uyku.ort * 10) / 10,
  };

  return {
    insights,
    positives,
    vaka: aktifVaka,
    kalOzet,
    hafta,
    tetiklenenTumIdler: [...tetiklenenIdler],
  };
}

// Dışa aktarım
window.calistirSenaryolar = calistirSenaryolar;
