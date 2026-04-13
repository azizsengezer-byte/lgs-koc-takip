// scenario_runner.js — LGSKoç Senaryo Eşleştirme Motoru v3

// ── BRANS ADI ENJEKSİYONU ────────────────────────────────
// Senaryo metinlerindeki {{ZAYIF_BRANS}} ve eski placeholder'ları
// gerçek branş adıyla değiştirir.
function _injectBrans(text, bransAdi) {
  if (!text || !bransAdi) return text;
  return text
    .replace(/\{\{ZAYIF_BRANS\}\}/g, bransAdi)
    .replace(/Belirli bir branş/g, bransAdi)
    .replace(/İlgili branş/g, bransAdi)
    .replace(/ilgili branş/g, bransAdi);
}
function _injectBransIns(ins, bransAdi) {
  if (!bransAdi) return ins;
  return {
    ...ins,
    teshis:   _injectBrans(ins.teshis,   bransAdi),
    aksiyon:  _injectBrans(ins.aksiyon,  bransAdi),
    analiz:   _injectBrans(ins.analiz,   bransAdi),
    strateji: _injectBrans(ins.strateji, bransAdi),
  };
}

// ── HİYERARŞİK KARAR MOTORU ─────────────────────────────
// Periyoda göre doğru teşhis dilini seçer
// Modül 5 kritikse Modül 2'yi susturur
function _applyHierarchicalLogic(period, triggeredScenarios) {
  if (!triggeredScenarios || triggeredScenarios.length === 0) return [];

  // Modül 5 (Fizyolojik) kritikse Modül 2 (Akademik Kaçınma) susar
  const hasCriticalPhysical = triggeredScenarios.some(s => s.modul === 5 && s.priority >= 95);
  let filtered = triggeredScenarios;
  if (hasCriticalPhysical) {
    filtered = triggeredScenarios.filter(s => s.modul !== 2);
  }

  // Periyoda göre doğru metin bloğunu seç
  const periodKey = period === 'aylik' ? 'aylik' : period === 'haftalik' ? 'weekly' : 'daily';

  return filtered.map(s => {
    // Yeni format: cikti.daily/weekly/aylik
    // Eski format: cikti.analiz/strateji (geriye dönük uyumluluk)
    const yeniFormat = s.cikti && (s.cikti.daily || s.cikti.weekly || s.cikti.aylik);
    let teshis, aksiyon;

    if (yeniFormat) {
      const pData = s.cikti[periodKey] || s.cikti.daily || {};
      teshis  = pData.teshis  || '';
      aksiyon = pData.aksiyon || '';
    } else {
      // Eski format fallback
      teshis  = s.cikti.analiz   || '';
      aksiyon = s.cikti.strateji || '';
    }

    return {
      id:       s.id,
      modul:    s.modul,
      priority: s.priority,
      etiket:   s.etiket,
      ton:      s.cikti.ton || 'informative',
      teshis,
      aksiyon,
      // Geriye dönük uyumluluk için eski alanlar da kalsın
      analiz:   teshis,
      strateji: aksiyon,
      aylikEtiket: s.cikti.aylikEtiket || s.etiket,
      frekans:  s.frekans || 0,
      tip:      'negatif',
    };
  }).sort((a, b) => b.priority - a.priority);
}

// ─────────────────────────────────────────────────────────
// =========================================================
// TEMEL MİMARİ:
//   Günlük mod  → tek gün snapshot
//   Haftalık mod → son 7 günü tara, benzersiz senaryoları birleştir
//   Aylık mod   → tüm dönem günlerini tara, en sık + en ağır senaryoları öne çıkar
// =========================================================

// ── HAFTALIK HESAPLAMALAR ────────────────────────────────
function _hesaplaHafta(gunler, allEntries, kal) {
  const son7 = gunler.slice(-7);
  const veriGunler = son7.filter(d => d.kaygi > 0 || d.uyku > 0 || d.enerji > 0);
  const aktifGunler = son7.filter(d => d.soru > 0);

  const fn = (arr, f) => {
    const v = arr.filter(d => d[f] > 0).map(d => d[f]);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
  };

  const trendHesapla = (dizi, field) => {
    const v = dizi.filter(d => d[field] > 0).map(d => d[field]);
    if (v.length < 3) return 'yetersiz_veri';
    const ilk = v.slice(0, Math.floor(v.length / 2));
    const son = v.slice(Math.floor(v.length / 2));
    const ortIlk = ilk.reduce((a, b) => a + b, 0) / ilk.length;
    const ortSon  = son.reduce((a, b) => a + b, 0) / son.length;
    if (ortSon - ortIlk > 1) return 'yükseliş';
    if (ortIlk - ortSon > 1) return 'düşüş';
    return 'stabil';
  };

  // İsabet trendi
  const isabetDizi = aktifGunler.filter(d => d.hataOrani !== null).map(d => 100 - d.hataOrani);
  const isatetTrend = (() => {
    if (isabetDizi.length < 3) return 0;
    const ilk = isabetDizi.slice(0, Math.floor(isabetDizi.length / 2));
    const son  = isabetDizi.slice(Math.floor(isabetDizi.length / 2));
    return (son.reduce((a,b)=>a+b,0)/son.length) - (ilk.reduce((a,b)=>a+b,0)/ilk.length);
  })();

  // Zayıf branş tespiti
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
      .filter(([d, v]) => v.q >= 15)
      .map(([d, v]) => ({ d, isabet: (1 - v.y / v.q) * 100 }))
      .sort((a, b) => a.isabet - b.isabet);
    return dersler.length ? dersler[0].d : null;
  })();

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

  const zayifBransDenemeIsabet = (() => {
    if (!zayifBrans) return 60;
    const t = dersToplamlar[zayifBrans];
    if (!t || t.q < 10) return 60;
    return (1 - t.y / t.q) * 100;
  })();

  const bosGunSayisi = son7.filter(d =>
    d.soru === 0 && d.kaygi === 0 && d.enerji === 0 && d.uyku === 0
  ).length;

  const toplamSoruHafta = son7.reduce((a, d) => a + d.soru, 0);
  const birimSoreSure = toplamSoruHafta > 0 ? toplamSure / toplamSoruHafta : 0;

  const enerjiTrend = trendHesapla(son7, 'enerji');
  const odakTrend   = trendHesapla(son7, 'odak');

  const dusukEnerjiGunSayisi = son7.filter(d => d.enerji > 0 && d.enerji < kal.enerji.dusuk).length;
  const dusukOdakGunSayisi   = son7.filter(d => d.odak   > 0 && d.odak   < kal.odak.dusuk).length;

  const dunkuSosyal = son7.length >= 2 ? (son7[son7.length - 2]?.sosyal || 0) : 0;

  const tekrarEntries = (allEntries || []).filter(e =>
    e.type === 'tekrar' && son7.some(d => d.dk === e.dateKey)
  );
  const tekrarSure = tekrarEntries.reduce((a, e) => a + (e.duration || 0), 0);
  const tekrarTutarlilik = son7.filter(d => tekrarEntries.some(e => e.dateKey === d.dk)).length;

  const veriGirisTutarliligi = veriGunler.length;
  const haftaSoruToplamı = toplamSoruHafta;
  const haftaSosyalOrt = fn(son7, 'sosyal');
  const haftaOdakOrt   = fn(son7, 'odak');

  const moodPuan = { 'excited':5,'good':4,'focused':4,'ok':3,'tired':2,'anxious':2,'sad':1 };
  const haftalikMoodOrt = (() => {
    const v = son7.filter(d => d.mood).map(d => moodPuan[d.mood] || 3);
    return v.length ? v.reduce((a,b)=>a+b,0)/v.length : 3;
  })();

  const denemeTrend = (() => {
    const dn = son7.filter(d => d.net > 0).map(d => d.net);
    if (dn.length < 2) return 'yetersiz_veri';
    return dn[dn.length-1] < dn[0] ? 'düşüş' : dn[dn.length-1] > dn[0] ? 'yükseliş' : 'stabil';
  })();

  const ozYeterlilikTrend = (() => {
    const v = son7.filter(d => d.mood && d.hataOrani !== null)
      .map(d => ((moodPuan[d.mood]||3) + (100-d.hataOrani)/20) / 2);
    if (v.length < 3) return 'stabil';
    const ilk = v.slice(0, Math.floor(v.length/2));
    const son  = v.slice(Math.floor(v.length/2));
    const diff = (son.reduce((a,b)=>a+b,0)/son.length) - (ilk.reduce((a,b)=>a+b,0)/ilk.length);
    return diff > 0.3 ? 'pozitif' : diff < -0.3 ? 'negatif' : 'stabil';
  })();

  const zayifBransSureAzalma = (() => {
    if (!zayifBrans) return false;
    const ilkYari = (allEntries||[]).filter(e => e.subject===zayifBrans && e.type==='soru' && son7.slice(0,3).some(d=>d.dk===e.dateKey));
    const ikinciYari = (allEntries||[]).filter(e => e.subject===zayifBrans && e.type==='soru' && son7.slice(4).some(d=>d.dk===e.dateKey));
    return ilkYari.reduce((a,e)=>a+(e.duration||0),0) > ikinciYari.reduce((a,e)=>a+(e.duration||0),0) + 10;
  })();

  const tutarliGunSayisi = son7.filter(d => d.soru >= kal.soru.ort * 0.7).length;
  const ortUyku  = fn(son7, 'uyku');
  const ortKaygi = fn(son7, 'kaygi');
  const ortEnerji= fn(son7, 'enerji');
  const ortSoru  = aktifGunler.length ? toplamSoruHafta / aktifGunler.length : 0;
  const oncekiHaftaKaygi = fn(son7.slice(0,3), 'kaygi');
  const denemeSonrasiGun = son7.slice(-2).some(d => d.net > 0 && d.soru > 0);
  const denemedeSonraSoru = son7.slice(-1)[0]?.soru || 0;

  const bugun = son7[son7.length-1] || {};
  const geceEkranVar = bugun.sosyal > 2 && bugun.uyku < 7;
  const soruHedefiKarsilama = kal.soru.ort > 0
    ? son7.filter(d=>d.soru>0).filter(d=>d.soru>=kal.soru.ort*0.85).length / Math.max(son7.filter(d=>d.soru>0).length, 1)
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
  const ilkYari   = aktif.slice(0, Math.floor(aktif.length / 2));
  const ikinciYari = aktif.slice(Math.floor(aktif.length / 2));
  const ortIlkSoru   = ilkYari.length   ? ilkYari.reduce((a,d)=>a+d.soru,0)/ilkYari.length   : 0;
  const ortSonSoru   = ikinciYari.length ? ikinciYari.reduce((a,d)=>a+d.soru,0)/ikinciYari.length : 0;
  const aylikSoruArtisSuresi = ortIlkSoru > 0 ? (ortSonSoru - ortIlkSoru) / ortIlkSoru : 0;

  const isabetDizi   = aktif.filter(d => d.hataOrani !== null).map(d => 100 - d.hataOrani);
  const ilkIsabet    = isabetDizi.slice(0, Math.floor(isabetDizi.length/2));
  const sonIsabet    = isabetDizi.slice(Math.floor(isabetDizi.length/2));
  const aylikIsabetArtis = (sonIsabet.length && ilkIsabet.length)
    ? (sonIsabet.reduce((a,b)=>a+b,0)/sonIsabet.length) - (ilkIsabet.reduce((a,b)=>a+b,0)/ilkIsabet.length)
    : 0;

  // Son 3 gün delta değerleri
  const son3 = gunler30.slice(-3);
  const _mp = { 'great':5, 'good':4, 'ok':3, 'bad':2, 'sad':1 };
  const son3GunKaygiOrt  = (() => { const v=son3.filter(d=>d.kaygi>0).map(d=>d.kaygi); return v.length?v.reduce((a,b)=>a+b,0)/v.length:0; })();
  const son3GunEnerjiOrt = (() => { const v=son3.filter(d=>d.enerji>0).map(d=>d.enerji); return v.length?v.reduce((a,b)=>a+b,0)/v.length:0; })();
  const son3GunMoodPuan  = (() => { const v=son3.filter(d=>d.mood).map(d=>_mp[d.mood]||3); return v.length?v.reduce((a,b)=>a+b,0)/v.length:3; })();
  const son3GunSoruOrt   = (() => { const v=son3.filter(d=>d.soru>0).map(d=>d.soru); return v.length?v.reduce((a,b)=>a+b,0)/v.length:0; })();

  // Ay geneli mood ortalaması
  const ayMoodOrt = (() => { const v=gunler30.filter(d=>d.mood).map(d=>_mp[d.mood]||3); return v.length?v.reduce((a,b)=>a+b,0)/v.length:3; })();

  return {
    aylikSoruArtisSuresi, aylikIsabetArtis,
    ortUyku:    fn(gunler30, 'uyku'),
    ortEnerji:  fn(gunler30, 'enerji'),
    ortKaygi:   fn(gunler30, 'kaygi'),
    son3GunKaygiOrt, son3GunEnerjiOrt, son3GunMoodPuan, son3GunSoruOrt,
    ayMoodOrt,
  };
}

// ── BUGUN OBJESİ HAZIRLA ────────────────────────────────
function _bugunHazirla(bugunGun, allEntries, dk) {
  const konuEntries   = (allEntries||[]).filter(e => e.type==='konu'   && e.dateKey===dk);
  const tekrarEntries = (allEntries||[]).filter(e => e.type==='tekrar' && e.dateKey===dk);
  const soruEntries   = (allEntries||[]).filter(e => e.type==='soru'   && e.dateKey===dk);
  const tumEntries    = (allEntries||[]).filter(e => e.dateKey===dk);

  // Çalışma süresi (dakika)
  const calismaSuresi = tumEntries.reduce((a,e)=>a+(e.duration||0), 0);

  // Dijital süre (saat olarak gelir, dakikaya çevirme gerekmiyor)
  const dijitalSure = bugunGun.sosyal || 0;

  // İsabet oranı (%)
  const isabet = bugunGun.hataOrani !== null && bugunGun.hataOrani !== undefined
    ? 100 - bugunGun.hataOrani : null;

  // Branş analizi — bugün zayıf branşa ne kadar çalışıldı
  const bransHata = bugunGun.dersHata || {};
  const bransAnalizi = (() => {
    const dersler = Object.entries(bransHata);
    if (!dersler.length) return { zayifBransSoru: 0, zayifBransAdi: null, toplamDersSoru: bugunGun.soru || 0 };
    const sirali = dersler
      .filter(([d,v]) => v.q > 0)
      .map(([d,v]) => ({ ders: d, isabet: (1 - v.y/v.q)*100, soru: v.q }))
      .sort((a,b) => a.isabet - b.isabet);
    const zayif = sirali[0];
    return {
      zayifBransSoru:  zayif ? zayif.soru : 0,
      zayifBransAdi:   zayif ? zayif.ders : null,
      zayifBransIsabet: zayif ? zayif.isabet : null,
      toplamDersSoru:  dersler.reduce((a,[,v])=>a+v.q, 0),
    };
  })();

  // Gün adı
  const dayNames = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const dayName = dk ? dayNames[new Date(dk + 'T12:00:00').getDay()] : '';

  return {
    ...bugunGun,
    konuSure:      konuEntries.reduce((a,e)=>a+(e.duration||0), 0),
    tekrarSure:    tekrarEntries.reduce((a,e)=>a+(e.duration||0), 0),
    hataOrani:     bugunGun.hataOrani,
    calismaSuresi,
    dijitalSure,
    isabet,
    bransAnalizi,
    dayName,
  };
}

// ── TEK GÜN İÇİN TETIKLEME ──────────────────────────────
function _tetikleGun(bugunGun, allEntries, gunler7, gunler30, kal) {
  const bugun = _bugunHazirla(bugunGun, allEntries, bugunGun.dk || '');
  const hafta = _hesaplaHafta(gunler7, allEntries, kal);
  const ay    = _hesaplaAy(gunler30, kal);

  const neg = [];
  const pos = [];
  window.SENARYOLAR.forEach(s => {
    try { if (s.tetikle(bugun, hafta, ay, kal)) neg.push(s); } catch(e) {}
  });
  window.POZITIF_SENARYOLAR.forEach(s => {
    try { if (s.tetikle(bugun, hafta, ay, kal)) pos.push(s); } catch(e) {}
  });
  return { neg, pos };
}

// ── ANA FONKSİYON ───────────────────────────────────────
function calistirSenaryolar(gunler, allEntries, bugunDk, mod) {
  if (!window.SENARYOLAR || !gunler || gunler.length === 0) return { insights: [], positives: [], vaka: null };

  // Dönem uzunluğuna göre mod belirle
  const _mod = mod || (gunler.length > 10 ? 'aylik' : gunler.length > 5 ? 'haftalik' : 'gunluk');

  const gunler14 = gunler.slice(-14);
  const gunler7  = gunler.slice(-7);
  const gunler30 = gunler.slice(-30);
  const kal = window._kalibre(gunler14);
  const ay  = _hesaplaAy(gunler30, kal);

  // ── AYLIK: tüm günleri tara ──────────────────────────
  let tumNegIdSayac = {};   // { senaryoId: kaçGünTetiklendi }
  let tumPosIdSayac = {};

  if (_mod === 'aylik') {
    // Her günü kendi hafta penceresiyle tara
    gunler.forEach((g, i) => {
      if (g.kaygi === 0 && g.uyku === 0 && g.enerji === 0 && g.soru === 0) return; // boş gün atla
      const pencere7 = gunler.slice(Math.max(0, i-6), i+1);
      const { neg, pos } = _tetikleGun(g, allEntries, pencere7, gunler30, kal);
      neg.forEach(s => { tumNegIdSayac[s.id] = (tumNegIdSayac[s.id]||0) + 1; });
      pos.forEach(s => { tumPosIdSayac[s.id] = (tumPosIdSayac[s.id]||0) + 1; });
    });

    // En az 1 kez tetiklenenleri al, frekans + priority ile sırala
    const negSirali = window.SENARYOLAR
      .filter(s => tumNegIdSayac[s.id] > 0)
      .sort((a, b) => {
        const freqDiff = (tumNegIdSayac[b.id]||0) - (tumNegIdSayac[a.id]||0);
        return freqDiff !== 0 ? freqDiff : b.priority - a.priority;
      });
    const posSirali = window.POZITIF_SENARYOLAR
      .filter(s => tumPosIdSayac[s.id] > 0)
      .sort((a, b) => (tumPosIdSayac[b.id]||0) - (tumPosIdSayac[a.id]||0));

    // ── PROFİL TESPİTİ ──────────────────────────────────────────────
    // Son veri gününü baz al
    const _sonVeriGunAy = [...gunler].reverse().find(d =>
      d.kaygi > 0 || d.uyku > 0 || d.enerji > 0 || d.soru > 0
    ) || gunler[gunler.length-1] || {};
    const _bugunAy = _bugunHazirla(_sonVeriGunAy, allEntries, _sonVeriGunAy.dk || bugunDk);
    const _haftaAy = _hesaplaHafta(gunler7, allEntries, kal);
    const _tetIdSetAy = new Set(negSirali.map(s => s.id));

    let _profilSonuc = { profil: 'P25' };
    if (window._tespit_profil) {
      _profilSonuc = window._tespit_profil(_bugunAy, _haftaAy, ay, kal, _tetIdSetAy);
    }
    const _aktifProfil = _profilSonuc.profil;

    // Profil filtreleme — sadece bu profile ait senaryolar çıkar
    let aktifNeg;
    if (window._profilSenaryoFiltrele && _aktifProfil !== 'P25') {
      aktifNeg = window._profilSenaryoFiltrele(negSirali, _aktifProfil, 5, 3);
      // Yeterli senaryo yoksa (< 2) karma moda geç
      if (aktifNeg.length < 2) {
        aktifNeg = negSirali.slice(0, 5);
        _profilSonuc.profil = 'P25';
      }
    } else {
      const kritikVar = negSirali.some(s => s.priority >= 90);
      aktifNeg = negSirali.filter(s => !(kritikVar && s.priority < 70)).slice(0, 5);
    }

    const ciktiNeg = aktifNeg;
    const ciktiPos = posSirali.slice(0, 3);

    // Vaka kombinasyonları
    const tetIdSet = new Set([...ciktiNeg.map(s=>s.id), ...ciktiPos.map(s=>s.id)]);
    let aktifVaka = null;
    window.VAKA_KOMBINASYONLARI.forEach(v => {
      if (v.senaryolar.every(id => tetIdSet.has(id))) {
        if (!aktifVaka || v.priority > aktifVaka.priority) aktifVaka = v;
      }
    });

    // Hiyerarşik mantık + periyot dili seçimi
    const _ciktiNegFrekansli = ciktiNeg.map(s => ({ ...s, frekans: tumNegIdSayac[s.id]||0 }));
    const _zayifBransAy = _haftaAy.zayifBrans || null;
    const insights = _applyHierarchicalLogic('aylik', _ciktiNegFrekansli)
      .map(ins => _injectBransIns(ins, _zayifBransAy));
    const positives = ciktiPos.map(s => ({
      id: s.id, etiket: s.etiket,
      analiz: s.cikti.analiz || (s.cikti.aylik||{}).teshis || '',
      strateji: s.cikti.strateji || (s.cikti.aylik||{}).aksiyon || '',
      teshis: (s.cikti.aylik||{}).teshis || s.cikti.analiz || '',
      aksiyon: (s.cikti.aylik||{}).aksiyon || s.cikti.strateji || '',
      aylikEtiket: s.cikti.aylikEtiket || s.etiket,
      ton: s.cikti.ton,
      tip: 'pozitif',
      frekans: tumPosIdSayac[s.id] || 0,
    }));

    const kalOzet = {
      soruOrt: Math.round(kal.soru.ort),
      kaygiEsik: isNaN(kal.kaygi.yuksek) ? '—' : (Math.round(kal.kaygi.yuksek * 10) / 10),
      uyku: isNaN(kal.uyku.ort) ? '—' : (Math.round(kal.uyku.ort * 10) / 10),
    };

    return {
      insights, positives, vaka: aktifVaka, kalOzet,
      tetiklenenTumIdler: [...tetIdSet],
      frekansMap: { ...tumNegIdSayac, ...tumPosIdSayac },
      aktifProfil: _aktifProfil,
      zayifBrans: _zayifBransAy,
    };

  // ── HAFTALIK: son 7 günü tara ─────────────────────────
  } else if (_mod === 'haftalik') {

    // ── TREND TESPİTİ ────────────────────────────────────────────────
    // Veri olan günleri kronolojik sıraya koy
    const veriGunleri = gunler7.filter(d =>
      d.kaygi > 0 || d.uyku > 0 || d.enerji > 0 || d.soru > 0
    ).sort((a, b) => a.dk.localeCompare(b.dk));

    // Son hal: son 2 gün — profilin temeli bu
    const _sonHal = veriGunleri.slice(-2);
    const _ilkHal = veriGunleri.slice(0, Math.max(1, veriGunleri.length - 2));

    // Wellness skoru hesapla (düşük = kötü, yüksek = iyi)
    const _wellnessSkoru = (g) => {
      let s = 0, n = 0;
      if (g.enerji > 0) { s += g.enerji / 10; n += 1; }
      if (g.kaygi  > 0) { s += (10 - g.kaygi) / 10 * 2; n += 2; } // kaygı 2x ağırlık
      if (g.uyku   > 0) { s += Math.min(g.uyku / 9, 1); n += 1; }
      const moodPuan = { 'great':1, 'good':0.8, 'ok':0.5, 'bad':0.2, 'sad':0.1 };
      if (g.mood) { s += (moodPuan[g.mood] || 0.5) * 1.5; n += 1.5; } // mood 1.5x ağırlık
      return n > 0 ? s / n : 0.5;
    };

    const _sonSkor = _sonHal.length > 0
      ? _sonHal.reduce((a, g) => a + _wellnessSkoru(g), 0) / _sonHal.length
      : 0.5;
    const _ilkSkor = _ilkHal.length > 0
      ? _ilkHal.reduce((a, g) => a + _wellnessSkoru(g), 0) / _ilkHal.length
      : 0.5;

    const _trendFark = _sonSkor - _ilkSkor;
    // düşüş: son hal kötüleşmiş | yükseliş: son hal iyileşmiş | stabil: fark küçük
    const _trend = _trendFark < -0.08 ? 'dusus' :
                   _trendFark >  0.08 ? 'yukselis' : 'stabil';

    // Trend anlatısı — PDF'e geçirilecek
    const _trendAnlati = _trend === 'dusus'
      ? 'Hafta iyi başladı ancak son günlere doğru belirgin bir düşüş yaşandı.'
      : _trend === 'yukselis'
      ? 'Hafta zorlu başladı ancak son günlere doğru toparlanma gözlemlendi.'
      : 'Hafta boyunca görece stabil bir tablo izlendi.';

    // ── TREND BAZLI TARAMA ───────────────────────────────────────────
    // Düşüş: son 2 güne 3x ağırlık, önceki günlere 1x
    // Yükseliş: son 2 güne 3x ağırlık (iyileşme baskın olsun)
    // Stabil: tüm günler eşit

    // Haftalık modda SADECE son 2 veri günü taranır
    // Önceki günler bağlam olarak h. değerlerine girer ama senaryo üretmez
    // Bu sayede "iyi geçen eski gün" senaryoları karışmaz
    const _taranacakGunler = _sonHal.length > 0 ? _sonHal : veriGunleri.slice(-2);

    _taranacakGunler.forEach((g, i) => {
      if (g.kaygi === 0 && g.uyku === 0 && g.enerji === 0 && g.soru === 0) return;
      const pencere = gunler7; // tüm hafta bağlam olarak kullanılır
      const { neg, pos } = _tetikleGun(g, allEntries, pencere, gunler30, kal);

      neg.forEach(s => { tumNegIdSayac[s.id] = (tumNegIdSayac[s.id]||0) + 1; });
      pos.forEach(s => { tumPosIdSayac[s.id] = (tumPosIdSayac[s.id]||0) + 1; });
    });

    // ── PROFİL TESPİTİ: SADECE SON HAL ─────────────────────────────
    // Profil son halin verisiyle belirlenir — önceki günler karıştırmaz
    const _sonVeriGunH = _sonHal[_sonHal.length - 1] || gunler7[gunler7.length-1] || {};
    const _bugunH = _bugunHazirla(_sonVeriGunH, allEntries, _sonVeriGunH.dk || bugunDk);
    const _haftaH = _hesaplaHafta(gunler7, allEntries, kal);

    // Trend düşüşse: pozitif senaryo havuzunu kısıtla
    // Trend yükselişse: negatif senaryo havuzunu kısıtla
    const negSirali = window.SENARYOLAR
      .filter(s => tumNegIdSayac[s.id] > 0)
      .sort((a, b) => (tumNegIdSayac[b.id]||0) !== (tumNegIdSayac[a.id]||0)
        ? (tumNegIdSayac[b.id]||0) - (tumNegIdSayac[a.id]||0)
        : b.priority - a.priority);

    const posSirali = window.POZITIF_SENARYOLAR
      .filter(s => tumPosIdSayac[s.id] > 0)
      .sort((a, b) => (tumPosIdSayac[b.id]||0) - (tumPosIdSayac[a.id]||0));

    const _tetIdSetH = new Set(negSirali.map(s => s.id));

    let _profilSonucH = { profil: 'P25' };
    if (window._tespit_profil) {
      _profilSonucH = window._tespit_profil(_bugunH, _haftaH, ay, kal, _tetIdSetH);
    }
    const _aktifProfilH = _profilSonucH.profil;

    let aktifNeg;
    if (window._profilSenaryoFiltrele && _aktifProfilH !== 'P25') {
      aktifNeg = window._profilSenaryoFiltrele(negSirali, _aktifProfilH, 4, 2);
      if (aktifNeg.length < 2) {
        aktifNeg = negSirali.slice(0, 4);
        _profilSonucH.profil = 'P25';
      }
    } else {
      const kritikVar = negSirali.some(s => s.priority >= 90);
      aktifNeg = negSirali.filter(s => !(kritikVar && s.priority < 70)).slice(0, 4);
    }

    // Trend düşüşse pozitif sayısını kısıtla (1'e indir)
    // Trend yükselişse negatif sayısını kısıtla (2'ye indir)
    const _maxPos = _trend === 'dusus' ? 1 : 2;
    const _maxNeg = _trend === 'yukselis' ? 2 : 4;

    const ciktiNeg = aktifNeg.slice(0, _maxNeg);
    const ciktiPos = posSirali.slice(0, _maxPos);

    const tetIdSet = new Set([...ciktiNeg.map(s=>s.id), ...ciktiPos.map(s=>s.id)]);
    let aktifVaka = null;
    window.VAKA_KOMBINASYONLARI.forEach(v => {
      if (v.senaryolar.every(id => tetIdSet.has(id))) {
        if (!aktifVaka || v.priority > aktifVaka.priority) aktifVaka = v;
      }
    });

    const _hNegFrekansli = ciktiNeg.map(s => ({ ...s, frekans: tumNegIdSayac[s.id]||0 }));
    const _zayifBransH = _haftaH.zayifBrans || null;
    const insights = _applyHierarchicalLogic('haftalik', _hNegFrekansli)
      .map(ins => _injectBransIns(ins, _zayifBransH));
    const positives = ciktiPos.map(s => ({
      id: s.id, etiket: s.etiket, analiz: s.cikti.analiz, strateji: s.cikti.strateji,
      aylikEtiket: s.cikti.aylikEtiket, ton: s.cikti.ton, tip: 'pozitif',
      frekans: tumPosIdSayac[s.id] || 0,
    }));

    const kalOzet = {
      soruOrt: Math.round(kal.soru.ort),
      kaygiEsik: isNaN(kal.kaygi.yuksek) ? '—' : (Math.round(kal.kaygi.yuksek * 10) / 10),
      uyku: isNaN(kal.uyku.ort) ? '—' : (Math.round(kal.uyku.ort * 10) / 10),
    };

    return {
      insights, positives, vaka: aktifVaka, kalOzet,
      tetiklenenTumIdler: [...tetIdSet],
      trend: _trend,
      trendAnlati: _trendAnlati,
      sonSkor: Math.round(_sonSkor * 100),
      ilkSkor: Math.round(_ilkSkor * 100),
      aktifProfil: _aktifProfilH,
      zayifBrans: _zayifBransH,
    };

  // ── GÜNLÜK: tek gün snapshot ──────────────────────────
  } else {
    const _sonVeriGun = [...gunler].reverse().find(d => d.kaygi>0||d.uyku>0||d.enerji>0||d.soru>0);
    const bugunGun = gunler.find(d => d.dk === bugunDk) || _sonVeriGun || gunler[gunler.length-1] || {};
    const { neg, pos } = _tetikleGun(bugunGun, allEntries, gunler7, gunler30, kal);

    const kritikVar = neg.some(s => s.priority >= 90);
    const aktifNeg  = neg.filter(s => !(kritikVar && s.priority < 70)).sort((a,b)=>b.priority-a.priority);
    const ciktiNeg  = aktifNeg.slice(0, 3);
    const ciktiPos  = pos.sort((a,b)=>b.priority-a.priority).slice(0, 2);

    const tetIdSet = new Set([...ciktiNeg.map(s=>s.id), ...ciktiPos.map(s=>s.id)]);
    let aktifVaka = null;
    window.VAKA_KOMBINASYONLARI.forEach(v => {
      if (v.senaryolar.every(id => tetIdSet.has(id))) {
        if (!aktifVaka || v.priority > aktifVaka.priority) aktifVaka = v;
      }
    });

    const insights  = ciktiNeg.map(s => ({ id:s.id, modul:s.modul, priority:s.priority, etiket:s.etiket, analiz:s.cikti.analiz, strateji:s.cikti.strateji, aylikEtiket:s.cikti.aylikEtiket, ton:s.cikti.ton, tip:'negatif', frekans:1 }));
    const positives = ciktiPos.map(s => ({ id:s.id, etiket:s.etiket, analiz:s.cikti.analiz, strateji:s.cikti.strateji, aylikEtiket:s.cikti.aylikEtiket, ton:s.cikti.ton, tip:'pozitif', frekans:1 }));

    const kalOzet = {
      soruOrt: Math.round(kal.soru.ort),
      kaygiEsik: isNaN(kal.kaygi.yuksek) ? '—' : (Math.round(kal.kaygi.yuksek * 10) / 10),
      uyku: isNaN(kal.uyku.ort) ? '—' : (Math.round(kal.uyku.ort * 10) / 10),
    };

    return { insights, positives, vaka: aktifVaka, kalOzet, tetiklenenTumIdler: [...tetIdSet] };
  }
}

window.calistirSenaryolar = calistirSenaryolar;
