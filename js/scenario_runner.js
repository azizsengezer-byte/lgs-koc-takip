// scenario_runner.js — LGSKoç Senaryo Eşleştirme Motoru v2
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

  return {
    aylikSoruArtisSuresi, aylikIsabetArtis,
    ortUyku:  fn(gunler30, 'uyku'),
    ortEnerji: fn(gunler30, 'enerji'),
  };
}

// ── BUGUN OBJESİ HAZIRLA ────────────────────────────────
function _bugunHazirla(bugunGun, allEntries, dk) {
  const konuEntries   = (allEntries||[]).filter(e => e.type==='konu'   && e.dateKey===dk);
  const tekrarEntries = (allEntries||[]).filter(e => e.type==='tekrar' && e.dateKey===dk);
  return {
    ...bugunGun,
    konuSure:   konuEntries.reduce((a,e)=>a+(e.duration||0), 0),
    tekrarSure: tekrarEntries.reduce((a,e)=>a+(e.duration||0), 0),
    hataOrani:  bugunGun.hataOrani,
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

    // Baskınlık: kritik varsa düşük öncelikliler susar
    const kritikVar = negSirali.some(s => s.priority >= 90);
    const aktifNeg  = negSirali.filter(s => !(kritikVar && s.priority < 70));

    // Max 5 negatif, 3 pozitif (aylıkta daha kapsamlı)
    const ciktiNeg = aktifNeg.slice(0, 5);
    const ciktiPos = posSirali.slice(0, 3);

    // Vaka kombinasyonları
    const tetIdSet = new Set([...ciktiNeg.map(s=>s.id), ...ciktiPos.map(s=>s.id)]);
    let aktifVaka = null;
    window.VAKA_KOMBINASYONLARI.forEach(v => {
      if (v.senaryolar.every(id => tetIdSet.has(id))) {
        if (!aktifVaka || v.priority > aktifVaka.priority) aktifVaka = v;
      }
    });

    const insights = ciktiNeg.map(s => ({
      id: s.id, modul: s.modul, priority: s.priority,
      etiket: s.etiket,
      analiz: s.cikti.analiz,
      strateji: s.cikti.strateji,
      aylikEtiket: s.cikti.aylikEtiket,
      ton: s.cikti.ton,
      tip: 'negatif',
      frekans: tumNegIdSayac[s.id] || 0,
    }));
    const positives = ciktiPos.map(s => ({
      id: s.id, etiket: s.etiket,
      analiz: s.cikti.analiz,
      strateji: s.cikti.strateji,
      aylikEtiket: s.cikti.aylikEtiket,
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
    };

  // ── HAFTALIK: son 7 günü tara ─────────────────────────
  } else if (_mod === 'haftalik') {
    gunler7.forEach((g, i) => {
      if (g.kaygi === 0 && g.uyku === 0 && g.enerji === 0 && g.soru === 0) return;
      const pencere = gunler7.slice(Math.max(0, i-3), i+1);
      const { neg, pos } = _tetikleGun(g, allEntries, pencere, gunler30, kal);
      neg.forEach(s => { tumNegIdSayac[s.id] = (tumNegIdSayac[s.id]||0) + 1; });
      pos.forEach(s => { tumPosIdSayac[s.id] = (tumPosIdSayac[s.id]||0) + 1; });
    });

    const negSirali = window.SENARYOLAR
      .filter(s => tumNegIdSayac[s.id] > 0)
      .sort((a, b) => b.priority - a.priority);
    const posSirali = window.POZITIF_SENARYOLAR
      .filter(s => tumPosIdSayac[s.id] > 0)
      .sort((a, b) => (tumPosIdSayac[b.id]||0) - (tumPosIdSayac[a.id]||0));

    const kritikVar = negSirali.some(s => s.priority >= 90);
    const aktifNeg  = negSirali.filter(s => !(kritikVar && s.priority < 70));
    const ciktiNeg  = aktifNeg.slice(0, 4);
    const ciktiPos  = posSirali.slice(0, 2);

    const tetIdSet = new Set([...ciktiNeg.map(s=>s.id), ...ciktiPos.map(s=>s.id)]);
    let aktifVaka = null;
    window.VAKA_KOMBINASYONLARI.forEach(v => {
      if (v.senaryolar.every(id => tetIdSet.has(id))) {
        if (!aktifVaka || v.priority > aktifVaka.priority) aktifVaka = v;
      }
    });

    const insights = ciktiNeg.map(s => ({
      id: s.id, modul: s.modul, priority: s.priority,
      etiket: s.etiket, analiz: s.cikti.analiz, strateji: s.cikti.strateji,
      aylikEtiket: s.cikti.aylikEtiket, ton: s.cikti.ton, tip: 'negatif',
      frekans: tumNegIdSayac[s.id] || 0,
    }));
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

    return { insights, positives, vaka: aktifVaka, kalOzet, tetiklenenTumIdler: [...tetIdSet] };

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
