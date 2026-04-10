// scenario_engine.js — LGSKoç Dinamik Senaryo Motoru
// =====================================================
// 40 Negatif Senaryo (DYN) + 20 Pozitif Senaryo (POS) + 10 Vaka Kombinasyonu (VAKA)
// Baskınlık sistemi: 90-100 Kritik | 70-89 Psikolojik | 40-69 Akademik
// Dinamik kalibrasyon: sabit eşikler yerine öğrencinin 14 günlük ortalaması baz alınır
// =====================================================

// ── YARDIMCI: Dinamik Kalibrasyon ───────────────────
// gunler: son 14 günlük gün dizisi (teacher_psych'deki gunler objesi)
// Her alan için öğrenciye özel eşik hesaplar
function _kalibre(gunler14) {
  const fn = (arr, field) => {
    const v = arr.filter(d => d[field] > 0).map(d => d[field]);
    if (!v.length) return null;
    const ort = v.reduce((a, b) => a + b, 0) / v.length;
    const sd = v.length > 1
      ? Math.sqrt(v.reduce((a, b) => a + Math.pow(b - ort, 2), 0) / v.length)
      : ort * 0.2;
    return { ort, sd, min: Math.min(...v), max: Math.max(...v), yuksek: ort + sd, dusuk: Math.max(ort - sd, 0) };
  };
  const soruV = gunler14.filter(d => d.soru > 0).map(d => d.soru);
  const soruOrt = soruV.length ? soruV.reduce((a, b) => a + b, 0) / soruV.length : 100;
  const soruSd  = soruV.length > 1
    ? Math.sqrt(soruV.reduce((a, b) => a + Math.pow(b - soruOrt, 2), 0) / soruV.length)
    : soruOrt * 0.3;

  return {
    soru:   { ort: soruOrt, sd: soruSd, yuksek: soruOrt + soruSd, dusuk: Math.max(soruOrt - soruSd, 10) },
    kaygi:  fn(gunler14, 'kaygi')  || { ort: 5,   sd: 1.5, yuksek: 6.5,  dusuk: 3.5 },
    uyku:   fn(gunler14, 'uyku')   || { ort: 7,   sd: 0.8, yuksek: 8,    dusuk: 6   },
    enerji: fn(gunler14, 'enerji') || { ort: 6,   sd: 1.5, yuksek: 7.5,  dusuk: 4.5 },
    odak:   fn(gunler14, 'odak')   || { ort: 6,   sd: 1.5, yuksek: 7.5,  dusuk: 4.5 },
    sosyal: fn(gunler14, 'sosyal') || { ort: 1.5, sd: 0.8, yuksek: 2.3,  dusuk: 0.5 },
    isabet: fn(gunler14.filter(d => d.hataOrani !== null), 'hataOrani') || { ort: 25, sd: 10, yuksek: 35, dusuk: 15 },
  };
}

// ── SENARYO HAVUZU ───────────────────────────────────
// Her senaryo: { id, modul, priority, tetikle(bugun, hafta, ay, kal), cikti }
// tetikle() → true/false
// kal = kalibre() sonucu

const SENARYOLAR = [

  // ════════════════════════════════════════════
  // MODÜL 1: BİLİŞSEL RESTORASYON (DYN-01..10)
  // ════════════════════════════════════════════

  {
    id: 'DYN-01', modul: 1, priority: 82,
    etiket: 'Hasarlı Yüksek Hacim',
    tetikle: (b, h, a, k) =>
      b.kaygi >= k.kaygi.yuksek && b.soru >= k.soru.yuksek,
    cikti: {
      analiz: 'Kaygı etkisiyle yapılan yüksek hacimli çalışmanın bilişsel maliyetinin yüksek olduğu saptanmıştır.',
      strateji: 'Akademik yük hafifletilmeli; kriz anında işlenen üniteler "Temiz Zihin" tekrarına alınmalıdır.',
      aylikEtiket: 'Hasarlı_Kayıt',
      ton: 'empathetic'
    }
  },

  {
    id: 'DYN-02', modul: 1, priority: 70,
    etiket: 'Duygusal Çekilme',
    tetikle: (b, h, a, k) =>
      b.soru === 0 && b.kaygi === 0 && b.enerji === 0 &&
      h.bosGunSayisi >= 3,
    cikti: {
      analiz: 'Takip sistemine karşı bir direnç veya kriz kaynaklı sessizlik evresi saptanmıştır.',
      strateji: 'Veli ve öğrenciyle samimi bir durum tespiti görüşmesi planlanmalı; kopuşun kök nedeni netleştirilmelidir.',
      aylikEtiket: 'Duygusal_Çekilme',
      ton: 'gentle'
    }
  },

  {
    id: 'DYN-03', modul: 1, priority: 88,
    etiket: 'Bilişsel İflas',
    tetikle: (b, h, a, k) =>
      b.uyku > 0 && b.uyku < 6 && b.odak < k.odak.dusuk,
    cikti: {
      analiz: 'Fizyolojik yetersizliğin bilişsel fonksiyonları kısıtladığı değerlendirilmektedir.',
      strateji: 'Yeni konu eklenmesi ertelenmeli; uyku hijyeni ve biyolojik restorasyon önceliklendirilmelidir.',
      aylikEtiket: 'Bilişsel_İflas',
      ton: 'urgent'
    }
  },

  {
    id: 'DYN-04', modul: 1, priority: 95,
    etiket: 'Akut Blokaj',
    tetikle: (b, h, a, k) =>
      b.kaygi >= 9 && b.soru < 40 &&
      h.ozYeterlilikTrend === 'negatif',
    cikti: {
      analiz: 'Yüksek kaygı düzeyinin öğrenciyi tamamen savunmasız bıraktığı ve akademik üretimi durdurduğu saptanmıştır.',
      strateji: 'Akademik beklenti minimize edilmeli; duygusal güvenlik ve moral desteği odaklı bir iletişim kurulmalıdır.',
      aylikEtiket: 'Akut_Blokaj',
      ton: 'crisis'
    }
  },

  {
    id: 'DYN-05', modul: 1, priority: 75,
    etiket: 'Hasarlı Konu Kaydı',
    tetikle: (b, h, a, k) =>
      b.kaygi >= k.kaygi.yuksek && b.konuSure > 60 &&
      h.tekrarSure === 0,
    cikti: {
      analiz: 'Stres altında yapılan konu çalışmasının kalıcı belleğe aktarımında sorunlar yaşanabileceği saptanmıştır.',
      strateji: 'İlgili konu, wellness verilerinin ideal olduğu ilk fırsatta kısa bir "check-up" testine tabi tutulmalıdır.',
      aylikEtiket: 'Hasarlı_Konu',
      ton: 'informative'
    }
  },

  {
    id: 'DYN-06', modul: 1, priority: 62,
    etiket: 'Bilişsel Yorgunluk',
    tetikle: (b, h, a, k) =>
      b.odak < k.odak.dusuk && b.soru > k.soru.ort,
    cikti: {
      analiz: 'Öğrencinin zihinsel olarak tükenmiş olmasına rağmen çalışmaya devam ettiği (boşa mesai) gözlemlenmiştir.',
      strateji: 'Çalışma periyotları kısaltılmalı; dinlenme süreleri nitelikli (ekransız) hale getirilmelidir.',
      aylikEtiket: 'Boşa_Mesai',
      ton: 'coaching'
    }
  },

  {
    id: 'DYN-09', modul: 1, priority: 78,
    etiket: 'Dijital Anestezi',
    tetikle: (b, h, a, k) =>
      b.kaygi >= k.kaygi.yuksek && b.sosyal > k.sosyal.yuksek,
    cikti: {
      analiz: 'Stresle başa çıkma yöntemi olarak dijital dünyada "zamanı dondurma" eğilimi saptanmıştır.',
      strateji: 'Dijital kullanımın bir dinlenme değil, odak sızıntısı olduğu somut verilerle öğrenciye aktarılmalıdır.',
      aylikEtiket: 'Dijital_Kaçış',
      ton: 'rational'
    }
  },

  {
    id: 'DYN-10', modul: 1, priority: 92,
    etiket: 'Kombine Çöküş',
    tetikle: (b, h, a, k) =>
      b.uyku > 0 && b.uyku < 6 && b.kaygi >= k.kaygi.yuksek,
    cikti: {
      analiz: 'Hem biyolojik hem de psikolojik bariyerlerin aşılması nedeniyle sistemin alarm verdiği saptanmıştır.',
      strateji: '24 saatlik tam akademik mola verilmeli; süreç uyku ve duygusal stabilizasyon ile başlatılmalıdır.',
      aylikEtiket: 'Kombine_Çöküş',
      ton: 'crisis'
    }
  },

  {
    id: 'DYN-14', modul: 1, priority: 85,
    etiket: 'Robotik Performans',
    tetikle: (b, h, a, k) =>
      b.kaygi >= k.kaygi.yuksek && b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani < 15 &&
      b.odak < k.odak.dusuk,
    cikti: {
      analiz: 'Öğrenci hiçbir şey hissetmeden sadece görev bilinciyle hareket etmektedir; bu durum ani bir tükenmişlik habercisidir.',
      strateji: 'Duygusal veri takibi sıkılaştırılmalı; öğrenciye akademik başarı dışında nefes alabileceği alanlar hatırlatılmalıdır.',
      aylikEtiket: 'Tükenmişlik_Habercisi',
      ton: 'empathetic'
    }
  },

  {
    id: 'DYN-15', modul: 1, priority: 72,
    etiket: 'Yalancı İvme',
    tetikle: (b, h, a, k) =>
      b.uyku > 0 && b.uyku < 6 && b.soru >= k.soru.yuksek,
    cikti: {
      analiz: 'Öğrenci uyku vaktinden çalarak performans artışı sağlamaktadır; bilişsel rezervlerin hızla tükendiğini gösterir.',
      strateji: 'Başarı takdir edilmeli ancak uyku süresinin uzun vadeli zeka performansı üzerindeki riski vurgulanmalıdır.',
      aylikEtiket: 'Borçlu_Başarı',
      ton: 'balanced'
    }
  },

  // ════════════════════════════════════════════
  // MODÜL 2: BRANŞ KUTUPLAŞMASI (DYN-41..50)
  // ════════════════════════════════════════════

  {
    id: 'DYN-41', modul: 2, priority: 65,
    etiket: 'Branş Gettosu',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || Object.keys(b.dersHata).length < 2) return false;
      const dersler = Object.entries(b.dersHata);
      const enIyi = dersler.sort((x, y) => (y[1].q > 0 ? (1 - y[1].y/y[1].q) : 0) - (x[1].q > 0 ? (1 - x[1].y/x[1].q) : 0))[0];
      const enKotu = dersler[dersler.length - 1];
      if (!enIyi || !enKotu || enIyi[0] === enKotu[0]) return false;
      const iyiIsabet = enIyi[1].q > 0 ? (1 - enIyi[1].y / enIyi[1].q) * 100 : 0;
      const kotuIsabet = enKotu[1].q > 0 ? (1 - enKotu[1].y / enKotu[1].q) * 100 : 0;
      return iyiIsabet >= 85 && kotuIsabet < 50 && h.zayifBransSure < 15;
    },
    cikti: {
      analiz: 'Öğrencinin başarısızlık riskinden kaçmak için sadece yetkin hissettiği alanda vakit geçirdiği saptanmıştır.',
      strateji: 'Zayıf branş çalışmaları günün en yüksek enerji saatine çekilmeli ve mikro hedeflerle başlatılmalıdır.',
      aylikEtiket: 'Branş_Gettosu',
      ton: 'coaching'
    }
  },

  {
    id: 'DYN-42', modul: 2, priority: 58,
    etiket: 'Teorik Kaçış',
    tetikle: (b, h, a, k) =>
      b.konuSure > 60 && b.soru < 20 &&
      h.zayifBransDenemeIsabet < 50,
    cikti: {
      analiz: 'Öğrenci zayıf olduğu branşta "öğreniyormuş gibi yaparak" aslında kendini test etmekten kaçınmaktadır.',
      strateji: 'Konu çalışma süresi 30 dakika ile sınırlandırılmalı; hemen ardından 15 soruluk "başarı garantili" kolay test eklenmelidir.',
      aylikEtiket: 'Pasif_Öğrenme',
      ton: 'directive'
    }
  },

  {
    id: 'DYN-43', modul: 2, priority: 52,
    etiket: 'Sahte Başarı Hazzı',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const favori = Object.entries(b.dersHata).sort((x, y) => y[1].q - x[1].q)[0];
      if (!favori) return false;
      const toplam = Object.values(b.dersHata).reduce((s, d) => s + d.q, 0);
      return favori[1].q / Math.max(toplam, 1) > 0.65 && toplam >= k.soru.ort;
    },
    cikti: {
      analiz: 'Günlük soru hedefine ulaşmak için sadece sevilen derslerin seçildiği, dengesiz bir gelişim modeli gözlemlenmiştir.',
      strateji: 'Günlük soru hedefi branş bazlı kotalara bölünerek disipline edilmelidir.',
      aylikEtiket: 'Dengesiz_Gelişim',
      ton: 'informative'
    }
  },

  {
    id: 'DYN-44', modul: 2, priority: 68,
    etiket: 'Öğrenilmiş Çaresizlik',
    tetikle: (b, h, a, k) =>
      h.zayifBransDenemeIsabet < 45 &&
      h.zayifBransSureAzalma === true,
    cikti: {
      analiz: 'Düşük isabet oranının yarattığı moral bozukluğu, öğrenciyi o branştan tamamen kopma noktasına getirmiştir.',
      strateji: 'İlgili branşta akademik beklenti geçici olarak durdurulmalı; sadece temel kavramlar üzerinden özgüven onarımı yapılmalıdır.',
      aylikEtiket: 'Öğrenilmiş_Çaresizlik',
      ton: 'empathetic'
    }
  },

  {
    id: 'DYN-49', modul: 2, priority: 45,
    etiket: 'Bariyer Aşımı',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const zayifDers = h.zayifBrans;
      if (!zayifDers || !b.dersHata[zayifDers]) return false;
      const isabet = b.dersHata[zayifDers].q > 0
        ? (1 - b.dersHata[zayifDers].y / b.dersHata[zayifDers].q) * 100 : 0;
      return isabet >= 80 && b.dersHata[zayifDers].q >= 50 &&
        h.ozYeterlilikTrend === 'pozitif';
    },
    cikti: {
      analiz: 'Öğrencinin direnç gösterdiği branşta eşik değerin üzerine çıktığı ve psikolojik bariyeri yıktığı gözlemlenmiştir.',
      strateji: 'Bu başarı anı anında geri bildirimle pekiştirilmeli; "yapabiliyorum" algısı diğer günlere taşınmalıdır.',
      aylikEtiket: 'Bariyer_Aşımı_Pozitif',
      ton: 'celebratory'
    }
  },

  {
    id: 'DYN-50', modul: 2, priority: 60,
    etiket: 'Hata Fobisi',
    tetikle: (b, h, a, k) =>
      b.hataOrani !== null && b.hataOrani < 10 &&
      b.soru < 40,
    cikti: {
      analiz: 'Öğrenci hata yapmamak için çok az soru çözmekte; mükemmeliyetçilik kaygısı üretim hacmini kısıtlamaktadır.',
      strateji: 'Hata yapmanın serbest olduğu "hızlı soru çözme" seansları düzenlenmeli; isabetten ziyade hacim teşvik edilmelidir.',
      aylikEtiket: 'Mükemmeliyetçilik_Tuzağı',
      ton: 'coaching'
    }
  },

  {
    id: 'DYN-55', modul: 2, priority: 55,
    etiket: 'Gelişimsel Duraklama',
    tetikle: (b, h, a, k) =>
      b.konuSure === 0 && b.tekrarSure > 90,
    cikti: {
      analiz: 'Öğrenci hata yapma riskini sıfırlamak adına sürekli geçmiş konuları tekrar etmekte, müfredatta ilerlemeyi reddetmektedir.',
      strateji: 'Haftalık planda "Yeni Kazanım" kotası zorunlu tutulmalı; hata yapmanın öğrenmenin bir parçası olduğu vurgulanmalıdır.',
      aylikEtiket: 'Müfredat_Durması',
      ton: 'directive'
    }
  },

  {
    id: 'DYN-56', modul: 2, priority: 42,
    etiket: 'Motivasyon Motoru Branş',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const guclu = Object.entries(b.dersHata)
        .filter(([d, v]) => v.q > 0 && (1 - v.y / v.q) * 100 >= 85)
        .sort((x, y) => y[1].q - x[1].q)[0];
      return guclu && b.enerji >= 8 && b.soru >= k.soru.ort;
    },
    cikti: {
      analiz: 'Güçlü branştaki başarının öğrencinin genel enerji ve özgüven seviyesini yukarı çektiği saptanmıştır.',
      strateji: 'Bu branş, zor bir sayısal dersten hemen sonra "moral restorasyonu" için kullanılmalıdır.',
      aylikEtiket: 'Çapa_Branş',
      ton: 'positive'
    }
  },

  // ════════════════════════════════════════════
  // MODÜL 3: ÖZ-YETERLİLİK (DYN-76..96)
  // ════════════════════════════════════════════

  {
    id: 'DYN-76', modul: 3, priority: 80,
    etiket: 'Yüksek Fonksiyonlu Kaygı',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani < 20 &&
      b.kaygi >= k.kaygi.yuksek,
    cikti: {
      analiz: 'Öğrenci akademik hedeflerine tam kapasiteyle ulaşmasına rağmen performansı "yetersiz" algılamaktadır.',
      strateji: 'Başarı somut verilerle tescil edilmeli; öğrencinin kendine koyduğu "hayali çıtalar" esnetilmelidir.',
      aylikEtiket: 'Mükemmeliyetçilik_Riski',
      ton: 'validating'
    }
  },

  {
    id: 'DYN-82', modul: 3, priority: 90,
    etiket: 'Öz-Yeterlilik Çöküşü',
    tetikle: (b, h, a, k) =>
      b.soru === 0 && (b.mood === 'sad' || b.mood === 'anxious') &&
      b.kaygi >= k.kaygi.yuksek,
    cikti: {
      analiz: 'Öğrenci başarısızlık korkusu nedeniyle masaya oturma iradesini tamamen kaybetmiştir.',
      strateji: 'Akademik tüm talepler durdurulmalı; sadece "tek bir soru çözme" gibi mikro adımlarla süreç başlatılmalıdır.',
      aylikEtiket: 'Akut_Blokaj',
      ton: 'crisis'
    }
  },

  {
    id: 'DYN-83', modul: 3, priority: 38,
    etiket: 'Onaylanmış Disiplin',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek && b.tekrarSure > 60 &&
      (b.mood === 'excited' || b.mood === 'good'),
    cikti: {
      analiz: 'Öğrenci disiplinli çalışmanın yarattığı kontrol hissini içselleştirmiş ve öz-yeterliliğini güçlendirmiştir.',
      strateji: 'Bu momentum korunmalı; öğrenciye "kendi sürecinin lideri" olduğu hissettirilmelidir.',
      aylikEtiket: 'Pozitif_Disiplin',
      ton: 'celebratory'
    }
  },

  {
    id: 'DYN-85', modul: 3, priority: 35,
    etiket: 'Dayanıklı Öz-Yeterlilik',
    tetikle: (b, h, a, k) =>
      h.denemeTrend === 'düşüş' &&
      b.soru >= k.soru.yuksek &&
      (b.mood === 'good' || b.mood === 'focused'),
    cikti: {
      analiz: 'Öğrenci deneme sonucunu bir yıkım değil, bir veri olarak kabul etmiş ve rutinine dürüstçe devam etmiştir.',
      strateji: 'Bu olgun tutum koç tarafından vurgulanmalı; "gerçek kazanan" tavrının bu olduğu pekiştirilmelidir.',
      aylikEtiket: 'Resilience_Pozitif',
      ton: 'celebratory'
    }
  },

  {
    id: 'DYN-87', modul: 3, priority: 75,
    etiket: 'Yıkıcı Çaba',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani > 40 &&
      (b.mood === 'sad' || b.mood === 'tired'),
    cikti: {
      analiz: 'Öğrenci çok çalışmasına rağmen sonuç alamadıkça öz-yeterlilik algısı ağır hasar almaktadır.',
      strateji: 'Hacim (soru sayısı) acilen düşürülmeli; konu eksikleri saptanarak "başarı garantili" küçük kazanımlara odaklanılmalıdır.',
      aylikEtiket: 'Yetersizlik_Döngüsü',
      ton: 'empathetic'
    }
  },

  {
    id: 'DYN-90', modul: 3, priority: 85,
    etiket: 'Öğrenilmiş Çaresizlik Sinyali',
    tetikle: (b, h, a, k) =>
      b.soru < 40 && b.hataOrani !== null && b.hataOrani > 50 &&
      (b.mood === 'sad' || b.mood === 'anxious'),
    cikti: {
      analiz: 'Öğrenci "nasılsa yapamıyorum" algısıyla akademik eylemi tamamen durdurma noktasına gelmiştir.',
      strateji: '24 saatlik tam mola sonrası, akademik olmayan bir motivasyon görüşmesi planlanmalı; süreç sıfırdan yapılandırılmalıdır.',
      aylikEtiket: 'Çöküş_Evresi',
      ton: 'crisis'
    }
  },

  {
    id: 'DYN-96', modul: 3, priority: 88,
    etiket: 'Zirve Felci',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani < 10 &&
      b.kaygi >= 9,
    cikti: {
      analiz: 'Öğrenci ulaştığı yüksek seviyeyi bir "şans" olarak görmekte ve bunu koruyamama stresiyle felç olmaktadır.',
      strateji: 'Başarının tesadüf değil, "süreç odaklı bir emek" olduğu verilerle kanıtlanmalı; beklenti baskısı hafifletilmelidir.',
      aylikEtiket: 'Zirve_Felci',
      ton: 'rational'
    }
  },

  // ════════════════════════════════════════════
  // MODÜL 4: DİJİTAL KAÇINMA (DYN-106..125)
  // ════════════════════════════════════════════

  {
    id: 'DYN-106', modul: 4, priority: 78,
    etiket: 'Duygusal Anestezi',
    tetikle: (b, h, a, k) =>
      b.sosyal > k.sosyal.ort && b.kaygi >= k.kaygi.yuksek,
    cikti: {
      analiz: 'Öğrenci akademik stresle başa çıkamadığı anlarda dijital dünyaya sığınarak gerçeklikten uzaklaşmaktadır.',
      strateji: 'Sosyal medyanın bir "ödül" değil, "stres tetikleyici" olarak analiz edilmesi; ekran dışı rahatlama yöntemleri önerilmelidir.',
      aylikEtiket: 'Dijital_Kaçış',
      ton: 'rational'
    }
  },

  {
    id: 'DYN-107', modul: 4, priority: 72,
    etiket: 'Mavi Işık Borcu',
    tetikle: (b, h, a, k) =>
      b.sosyal > 2 && b.uyku > 0 && b.uyku < 6 &&
      h.geceEkranVar === true,
    cikti: {
      analiz: 'Geç saatteki dijital etkileşim, uyku kalitesini ve ertesi günün bilişsel kapasitesini düşürmektedir.',
      strateji: '"Dijital Sokağa Çıkma Yasağı" (uykudan 1 saat önce telefon bırakma) kuralı akademik başarı için şart koşulmalıdır.',
      aylikEtiket: 'Uyku_Sabotajı',
      ton: 'directive'
    }
  },

  {
    id: 'DYN-108', modul: 4, priority: 70,
    etiket: 'Bilişsel Sis',
    tetikle: (b, h, a, k) =>
      h.dunkuSosyal > k.sosyal.ort && b.odak < k.odak.ort,
    cikti: {
      analiz: 'Bir önceki günün aşırı dijital tüketimi, zihni dopamin yorgunluğuna sürükleyerek odaklanma eşiğini yükseltmiştir.',
      strateji: 'Odaklanma sorununun "yeteneksizlik" değil, "dijital yorgunluk" olduğu somut verilerle öğrenciye gösterilmelidir.',
      aylikEtiket: 'Dijital_Sis',
      ton: 'informative'
    }
  },

  {
    id: 'DYN-110', modul: 4, priority: 35,
    etiket: 'Nitelikli Berraklık',
    tetikle: (b, h, a, k) =>
      b.sosyal <= 0.5 && b.odak >= k.odak.yuksek && b.enerji >= 8,
    cikti: {
      analiz: 'Minimal dijital temasın, zihinsel berraklığı ve akademik motivasyonu maksimize ettiği saptanmıştır.',
      strateji: 'Bu "yüksek verim" hali geri bildirimle desteklenmeli; "az ekran, çok başarı" korelasyonu pekiştirilmelidir.',
      aylikEtiket: 'Dijital_Detoks_Pozitif',
      ton: 'celebratory'
    }
  },

  {
    id: 'DYN-120', modul: 4, priority: 90,
    etiket: 'Felç Edici Kaçış',
    tetikle: (b, h, a, k) =>
      b.sosyal > 2 && b.kaygi >= k.kaygi.yuksek && b.soru === 0,
    cikti: {
      analiz: 'Öğrenci başarısızlık korkusuyla yüzleşmemek için kendini dijital içeriklerin içine hapsetmiş; sistemi tamamen durdurmuştur.',
      strateji: '"5 Dakika Kuralı" uygulanmalı; dijitalden çıkıp sadece 5 dakika dersle temas kurması istenerek atalet kırılmalıdır.',
      aylikEtiket: 'Felç_Edici_Kaçış',
      ton: 'crisis'
    }
  },

  // ════════════════════════════════════════════
  // MODÜL 5: FİZYOLOJİK LİMİT (DYN-126..155)
  // ════════════════════════════════════════════

  {
    id: 'DYN-126', modul: 5, priority: 85,
    etiket: 'Bilişsel Borçlanma',
    tetikle: (b, h, a, k) =>
      b.uyku > 0 && b.uyku < 6.5 && b.soru >= k.soru.yuksek,
    cikti: {
      analiz: 'Öğrenci bedensel sınırlarını zorlayarak hedefi yakalamıştır; ancak bilişsel kalıcılığı düşük, hata payı yüksektir.',
      strateji: 'Akademik başarı takdir edilmeli, ancak 8 saatlik uyku kuralının "hafıza konsolidasyonu" için önemi hatırlatılmalıdır.',
      aylikEtiket: 'Borçlu_Çalışma',
      ton: 'balanced'
    }
  },

  {
    id: 'DYN-128', modul: 5, priority: 88,
    etiket: 'Kronik Stres Döngüsü',
    tetikle: (b, h, a, k) =>
      h.ortUyku > 0 && h.ortUyku < 7 && h.ortKaygi > 0 && h.ortKaygi >= k.kaygi.ort,
    cikti: {
      analiz: 'Yetersiz uyku kaygıyı tetiklemekte, yüksek kaygı ise uykuya geçişi zorlaştırmaktadır; sistem alarm vermektedir.',
      strateji: 'Acil uyku hijyeni protokolü uygulanmalı; akşam 21:00\'den sonra tüm akademik ve dijital uyaranlar kesilmelidir.',
      aylikEtiket: 'Kısır_Döngü',
      ton: 'urgent'
    }
  },

  {
    id: 'DYN-130', modul: 5, priority: 97,
    etiket: 'Fizyolojik İflas',
    tetikle: (b, h, a, k) =>
      b.uyku > 0 && b.uyku < 5 && b.odak < 3 &&
      b.hataOrani !== null && b.hataOrani > 50,
    cikti: {
      analiz: 'Öğrenci masada olsa bile beyni öğrenme ve analiz yeteneğini yitirmiştir; yapılan çalışma "boşa mesai"dir.',
      strateji: 'Çalışma derhal durdurulmalı; tam akademik mola ve derin uyku ile sistem resetlenmelidir.',
      aylikEtiket: 'Fizyolojik_İflas',
      ton: 'crisis'
    }
  },

  {
    id: 'DYN-134', modul: 5, priority: 90,
    etiket: 'Pre-Burnout',
    tetikle: (b, h, a, k) =>
      h.dusukOdakGunSayisi >= 3 && h.dusukEnerjiGunSayisi >= 3,
    cikti: {
      analiz: 'Hem zihinsel hem fiziksel enerjinin uzun süreli düşük seyretmesi, öğrencinin süreci terk etme riskini doğurmaktadır.',
      strateji: 'Program "minimum hayatta kalma" seviyesine çekilmeli; 2 gün tam dinlenme verilmelidir.',
      aylikEtiket: 'Tükenmişlik_Eşiği',
      ton: 'urgent'
    }
  },

  {
    id: 'DYN-135', modul: 5, priority: 32,
    etiket: 'İdeal Fizyolojik Zemin',
    tetikle: (b, h, a, k) =>
      b.enerji >= 8 && (b.mood === 'good' || b.mood === 'excited' || b.mood === 'focused') &&
      b.uyku >= 8,
    cikti: {
      analiz: 'Öğrenci akademik tempoyu taşıyabilecek en ideal fiziksel ve duygusal dengededir.',
      strateji: 'Bu dengeyi sağlayan rutinler (yatış saati, mola süresi) korunmalı ve sabitleştirilmelidir.',
      aylikEtiket: 'İdeal_Zemin_Pozitif',
      ton: 'celebratory'
    }
  },

  {
    id: 'DYN-144', modul: 5, priority: 93,
    etiket: 'Bilişsel Kırılma',
    tetikle: (b, h, a, k) =>
      b.uyku > 0 && b.uyku < 6 && b.kaygi >= k.kaygi.yuksek &&
      b.hataOrani !== null && b.hataOrani > 50,
    cikti: {
      analiz: 'Sistemin tamamen iflas ettiği, öğrenmenin durduğu ve hataların maksimize olduğu kritik eşik saptanmıştır.',
      strateji: '"Acil Durum Protokolü" işletilmeli; 24 saatlik mutlak sessizlik ve dinlenme sonrası durum değerlendirmesi yapılmalıdır.',
      aylikEtiket: 'Bilişsel_Kırılma',
      ton: 'crisis'
    }
  },

  {
    id: 'DYN-150', modul: 5, priority: 30,
    etiket: 'Sürdürülebilirlik Mührü',
    tetikle: (b, h, a, k) =>
      h.ortUyku >= 7.5 && h.ortEnerji >= 7 &&
      h.soruHedefiKarsilama >= 0.95,
    cikti: {
      analiz: 'Akademik hacim ile biyolojik ihtiyaçların tam uyum içinde olduğu, burnout riskinin minimuma indiği saptanmıştır.',
      strateji: 'Bu ritmin bozulmaması için dışsal uyaranlar kısıtlanmalı; stabilite korunmalıdır.',
      aylikEtiket: 'Sürdürülebilir_İdeal',
      ton: 'celebratory'
    }
  },

];

// ════════════════════════════════════════════
// POZİTİF SENARYO HAVUZU (POS)
// ════════════════════════════════════════════

const POZITIF_SENARYOLAR = [

  {
    id: 'POS-01', modul: 0, priority: 40,
    etiket: 'Sabah İradesi',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const zayif = h.zayifBrans;
      return zayif && b.dersHata[zayif] && b.dersHata[zayif].q >= 20 &&
        b.enerji > 0 && b.enerji < k.enerji.ort;
    },
    cikti: {
      analiz: 'Enerji düşük olmasına rağmen en zor branşa başlama cesareti gösterilmiştir.',
      strateji: 'Bu irade takdir edilmeli; zorlukların üstesinden gelme kapasitesi pekiştirilmelidir.',
      aylikEtiket: 'Sabah_İradesi',
      ton: 'celebratory'
    }
  },

  {
    id: 'POS-02', modul: 0, priority: 38,
    etiket: 'Hata Analiz Şampiyonu',
    tetikle: (b, h, a, k) =>
      b.hataOrani !== null && b.hataOrani > 30 &&
      b.tekrarSure > 45,
    cikti: {
      analiz: 'İsabet düşük olsa da hataların üzerine gitme iradesi takdire şayandır.',
      strateji: 'Bu analitik tutum övülmeli; hatayı fırsata çevirme alışkanlığı desteklenmelidir.',
      aylikEtiket: 'Hata_Analisti',
      ton: 'celebratory'
    }
  },

  {
    id: 'POS-03', modul: 0, priority: 35,
    etiket: 'Akış Hali',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani < 15 &&
      b.odak >= k.odak.yuksek &&
      (b.mood === 'excited' || b.mood === 'good' || b.mood === 'focused'),
    cikti: {
      analiz: 'Öğrenci potansiyelini tam kapasiteyle kullanmakta ve başarısını duygusal bir tatmine dönüştürebilmektedir.',
      strateji: 'Bu "akış" (flow) hali ödüllendirilmeli; başarının anahtar bileşenleri (uyku, odak, yöntem) not edilmelidir.',
      aylikEtiket: 'Peak_Performance',
      ton: 'celebratory'
    }
  },

  {
    id: 'POS-04', modul: 0, priority: 42,
    etiket: 'Deneme Sonrası Toparlanma',
    tetikle: (b, h, a, k) =>
      h.denemeTrend === 'düşüş' &&
      b.soru >= k.soru.ort &&
      (b.mood === 'good' || b.mood === 'focused'),
    cikti: {
      analiz: 'Deneme sonucunun olumsuzluğuna rağmen öğrenci çalışma rutinini sürdürmüştür; psikolojik dayanıklılık sergilenmiştir.',
      strateji: 'Bu tutum somut verilerle övülmeli; başarının sonuçtan değil süreçten geldiği pekiştirilmelidir.',
      aylikEtiket: 'Toparlanma_Gücü',
      ton: 'celebratory'
    }
  },

  {
    id: 'POS-05', modul: 0, priority: 36,
    etiket: 'Dengeli Gelişim',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const dersler = Object.entries(b.dersHata).filter(([d, v]) => v.q > 10);
      if (dersler.length < 3) return false;
      const isabetler = dersler.map(([d, v]) => (1 - v.y / v.q) * 100);
      const min = Math.min(...isabetler);
      const max = Math.max(...isabetler);
      return max - min < 25 && b.soru >= k.soru.ort;
    },
    cikti: {
      analiz: 'Tüm branşlara dengeli yaklaşım sergilenmiş; tek bir derse sığınmadan kapsamlı çalışma gerçekleştirilmiştir.',
      strateji: 'Bu denge takdir edilmeli; LGS\'in tüm branşları birlikte değerlendirdiği hatırlatılarak motivasyon güçlendirilmelidir.',
      aylikEtiket: 'Dengeli_Gelişim',
      ton: 'positive'
    }
  },

  {
    id: 'POS-06', modul: 0, priority: 40,
    etiket: 'Kriz Altında Üretim',
    tetikle: (b, h, a, k) =>
      b.kaygi >= k.kaygi.yuksek && b.soru >= k.soru.ort &&
      b.hataOrani !== null && b.hataOrani < 25,
    cikti: {
      analiz: 'Yüksek kaygıya rağmen akademik üretim sürdürülmüş; baskı altında çalışabilme kapasitesi ortaya konmuştur.',
      strateji: 'Bu direnç takdirle karşılanmalı; ancak kaygı kaynağı da ele alınarak sürdürülebilirlik sağlanmalıdır.',
      aylikEtiket: 'Kriz_Altı_Üretim',
      ton: 'validating'
    }
  },

  {
    id: 'POS-07', modul: 0, priority: 37,
    etiket: 'Pozitif Sıçrama',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.ort + k.soru.sd * 1.5 &&
      h.ortSoru > 0 && b.soru > h.ortSoru * 1.4,
    cikti: {
      analiz: 'Kendi normunun belirgin üzerinde bir performans sergilenmiştir; önemli bir kişisel gelişim anı yaşanmaktadır.',
      strateji: 'Bu sıçrama geri bildirimle pekiştirilmeli; "bunu yapabiliyorum" deneyimi kalıcı hale getirilmelidir.',
      aylikEtiket: 'Pozitif_Sıçrama',
      ton: 'celebratory'
    }
  },

  {
    id: 'POS-08', modul: 0, priority: 33,
    etiket: 'Sürdürülebilir Ritim',
    tetikle: (b, h, a, k) =>
      h.tutarliGunSayisi >= 5 && h.ortSoru >= k.soru.ort * 0.9,
    cikti: {
      analiz: 'Öğrenci 5 gün veya daha fazla istikrarlı bir çalışma ritmi yakalamıştır; bu sürdürülebilir başarının temelidir.',
      strateji: 'Bu istikrar tebrik edilmeli; günlük rutinin sınav başarısındaki kritik rolü hatırlatılmalıdır.',
      aylikEtiket: 'İstikrar_Pozitif',
      ton: 'positive'
    }
  },

  {
    id: 'POS-09', modul: 0, priority: 44,
    etiket: 'Wellness Dürüstlüğü',
    tetikle: (b, h, a, k) =>
      b.pozitif && b.pozitif.length > 10 &&
      b.negatif && b.negatif.length > 10,
    cikti: {
      analiz: 'Öğrenci hem olumlu hem olumsuz deneyimlerini açıkça paylaşmıştır; bu dürüstlük koçluk sürecini güçlendirmektedir.',
      strateji: 'Açık iletişim takdir edilmeli; paylaşılan düşünceler üzerine odaklı bir koçluk görüşmesi yapılmalıdır.',
      aylikEtiket: 'Dürüst_Paylaşım',
      ton: 'validating'
    }
  },

  {
    id: 'POS-10', modul: 0, priority: 39,
    etiket: 'Fizyolojik Farkındalık',
    tetikle: (b, h, a, k) =>
      b.uyku >= 8 && b.enerji >= 8 &&
      b.soru >= k.soru.ort,
    cikti: {
      analiz: 'Uyku ve enerji yönetimine verilen önem, akademik verimliliğe doğrudan yansımaktadır.',
      strateji: 'Bu bilinç takdir edilmeli; fizyolojik öz-bakımın "akıllı sporcunun sırrı" olduğu vurgulanmalıdır.',
      aylikEtiket: 'Fizyolojik_Farkındalık',
      ton: 'positive'
    }
  },

  // POS-11..20: Haftalık/aylık pozitifler
  {
    id: 'POS-11', modul: 0, priority: 36,
    etiket: 'Haftalık Momentum',
    tetikle: (b, h, a, k) =>
      h.haftaSoruToplamı >= k.soru.ort * 5 * 0.7 &&
      h.haftalikMoodOrt >= 2.5,
    cikti: {
      analiz: 'Hafta genelinde hem akademik hem duygusal dengeyi koruyarak güçlü bir momentum yakalanmıştır.',
      strateji: 'Bu haftalık tablo koçla paylaşılmalı; başarının neyi doğru yapmanın sonucu olduğu analiz edilmelidir.',
      aylikEtiket: 'Haftalık_Momentum',
      ton: 'positive'
    }
  },

  {
    id: 'POS-12', modul: 0, priority: 34,
    etiket: 'Kaygı Yönetimi',
    tetikle: (b, h, a, k) =>
      h.oncekiHaftaKaygi >= k.kaygi.yuksek &&
      h.ortKaygi < k.kaygi.ort && b.soru >= k.soru.ort,
    cikti: {
      analiz: 'Önceki haftaya kıyasla kaygı belirgin biçimde gerilemiş; öğrenci duygusal dengeyi akademik üretimle birleştirmeyi başarmıştır.',
      strateji: 'Bu ilerleme somut verilerle paylaşılmalı; hangi değişikliğin bu iyileşmeyi sağladığı öğrenciyle konuşulmalıdır.',
      aylikEtiket: 'Kaygı_Yönetimi_Pozitif',
      ton: 'validating'
    }
  },

  {
    id: 'POS-13', modul: 0, priority: 38,
    etiket: 'Zayıf Branşa Temas',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      return zayif && zayif.q >= 30;
    },
    cikti: {
      analiz: 'Kaçınma eğilimine rağmen zayıf branşla bugün temas kurulmuş; bu cesaret sürecin kırılma noktası olabilir.',
      strateji: 'Küçük de olsa bu adım büyük bir cesaret göstergesidir; anında ve somut olarak ödüllendirilmelidir.',
      aylikEtiket: 'Zayıf_Branş_Temas',
      ton: 'celebratory'
    }
  },

  {
    id: 'POS-14', modul: 0, priority: 35,
    etiket: 'Tekrar Disiplini',
    tetikle: (b, h, a, k) =>
      b.tekrarSure >= 40 && b.soru >= k.soru.ort * 0.7 &&
      h.tekrarTutarlilik >= 4,
    cikti: {
      analiz: 'Hem soru çözümü hem tekrar dengesini tutarlı biçimde sürdürmüştür; öğrenme kalıcılığı artmaktadır.',
      strateji: 'Bu denge takdir edilmeli; tekrarın "hafızayı sabitlemek" için neden kritik olduğu vurgulanmalıdır.',
      aylikEtiket: 'Tekrar_Disiplini',
      ton: 'positive'
    }
  },

  {
    id: 'POS-15', modul: 0, priority: 40,
    etiket: 'Dijital Kontrol',
    tetikle: (b, h, a, k) =>
      h.haftaSosyalOrt < k.sosyal.ort * 0.6 &&
      h.haftaOdakOrt >= k.odak.ort,
    cikti: {
      analiz: 'Hafta genelinde dijital kullanımın düşük, odaklanmanın yüksek seyrettiği saptanmıştır; verimli bir hafta geçirilmiştir.',
      strateji: 'Bu "dijital hijyen" takdir edilmeli; ekran azalmasının odak ve isabete etkisi verilerle gösterilmelidir.',
      aylikEtiket: 'Dijital_Kontrol_Pozitif',
      ton: 'positive'
    }
  },

  {
    id: 'POS-16', modul: 0, priority: 42,
    etiket: 'İsabet Yükselişi',
    tetikle: (b, h, a, k) =>
      h.isatetTrend > 10 && b.soru >= k.soru.ort * 0.8,
    cikti: {
      analiz: 'İsabet oranında belirgin bir artış gözlemlenmiştir; çalışma yöntemi ve anlama kalitesi iyileşmektedir.',
      strateji: 'Bu gelişim somutlaştırılmalı; öğrenci neyi farklı yaptığının farkına varmalıdır.',
      aylikEtiket: 'İsabet_Yükselişi',
      ton: 'positive'
    }
  },

  {
    id: 'POS-17', modul: 0, priority: 37,
    etiket: 'Veri Tutarlılığı',
    tetikle: (b, h, a, k) =>
      h.veriGirisTutarliligi >= 4,
    cikti: {
      analiz: 'Öğrenci takip sistemine düzenli ve tutarlı veri girişi yaparak koçluk sürecini aktif desteklemektedir.',
      strateji: 'Bu sorumluluk bilinci takdir edilmeli; veri düzenliliğinin kişiselleştirilmiş analizlere katkısı hatırlatılmalıdır.',
      aylikEtiket: 'Veri_Tutarlılığı',
      ton: 'validating'
    }
  },

  {
    id: 'POS-18', modul: 0, priority: 43,
    etiket: 'Deneme Sonrası Analiz',
    tetikle: (b, h, a, k) =>
      h.denemedeSonraSoru >= k.soru.ort && h.denemeSonrasiGun === true,
    cikti: {
      analiz: 'Deneme sınavının hemen ardından analiz yapmak ve çalışmaya devam etmek olgun bir akademik tutum sergiler.',
      strateji: 'Bu rutinin sürdürülmesi teşvik edilmeli; hatalı soruların detaylı incelenmesi için bir protokol önerilmelidir.',
      aylikEtiket: 'Deneme_Analiz_Rutini',
      ton: 'positive'
    }
  },

  {
    id: 'POS-19', modul: 0, priority: 36,
    etiket: 'Enerji-Odak Uyumu',
    tetikle: (b, h, a, k) =>
      b.enerji >= k.enerji.yuksek && b.odak >= k.odak.yuksek,
    cikti: {
      analiz: 'Fiziksel enerji ve zihinsel odaklanma aynı anda zirvededir; bu kombinasyon en verimli çalışma koşullarını yaratır.',
      strateji: 'Bu "altın saat" en zor branşa ve yeni konu kazanımına ayrılmalıdır.',
      aylikEtiket: 'Altın_Saat',
      ton: 'directive'
    }
  },

  {
    id: 'POS-20', modul: 0, priority: 45,
    etiket: 'Aylık İlerleme',
    tetikle: (b, h, a, k) =>
      a.aylikSoruArtisSuresi > 0.1 && a.aylikIsabetArtis > 0,
    cikti: {
      analiz: 'Ay genelinde hem soru hacminde hem isabet oranında artış kaydedilmiştir; ölçülebilir bir ilerleme yaşanmaktadır.',
      strateji: 'Bu büyüme grafiği öğrenciyle paylaşılmalı; somut gelişim öz-yeterliliği güçlendirir.',
      aylikEtiket: 'Aylık_İlerleme_Pozitif',
      ton: 'celebratory'
    }
  },

];

// ════════════════════════════════════════════
// VAKA KOMBİNASYONLARI
// ════════════════════════════════════════════

const VAKA_KOMBINASYONLARI = [
  {
    id: 'VAKA-01',
    senaryolar: ['DYN-10', 'DYN-03'],
    ad: 'Kombine Fizyolojik-Psikolojik Çöküş',
    analiz: 'Hem uykusuzluk hem yüksek kaygı aynı anda etki etmektedir; sistemin iki cephede birden yıkıldığı saptanmıştır.',
    strateji: '24 saatlik tam mola zorunlu; önce uyku, sonra kaygı kaynağıyla yapılandırılmış görüşme yapılmalıdır.',
    priority: 97
  },
  {
    id: 'VAKA-02',
    senaryolar: ['DYN-130', 'DYN-42'],
    ad: 'Bilişsel Sis Altında Atalet',
    analiz: 'Fizyolojik tükenme öğrencinin zayıf branştan da aktif çalışmadan da kaçmasına zemin hazırlamaktadır.',
    strateji: '1 saatlik uyku molası verilmeli; uyandıktan sonra en kolay branştan 15 dakikalık mikro başlangıç yapılmalıdır.',
    priority: 95
  },
  {
    id: 'VAKA-03',
    senaryolar: ['DYN-106', 'DYN-82'],
    ad: 'Duygusal Savunma Bloğu',
    analiz: 'Başarısızlık korkusu ile dijital kaçış birbiriyle beslendiği için öğrenci hem akademik hem duygusal çıkmazda kalmaktadır.',
    strateji: 'Sosyal medyayı eleştirmek yerine, başarısızlık korkusunu masaya yatıran bir koçluk görüşmesi önceliklendirilmelidir.',
    priority: 90
  },
  {
    id: 'VAKA-04',
    senaryolar: ['DYN-41', 'DYN-83'],
    ad: 'Limitli Şampiyon',
    analiz: 'Öğrenci güçlü branşta yüksek performans sergilerken zayıf alanı sistematik olarak ihmal etmektedir.',
    strateji: 'Konfor alanındaki güveni yerindeyken, hemen ardından zayıf branşa "sızma" fırsatı değerlendirilmelidir.',
    priority: 65
  },
  {
    id: 'VAKA-05',
    senaryolar: ['DYN-76', 'DYN-96'],
    ad: 'Mükemmeliyetçilik Tuzağı',
    analiz: 'Yüksek performansı koruma kaygısı ile yüksek fonksiyonlu kaygı örtüşmekte; başarı öğrenciye rahatlık değil, baskı getirmektedir.',
    strateji: 'Başarı bir "varmak gereken yer" değil, "devam eden bir süreç" olarak yeniden çerçevelenmelidir.',
    priority: 85
  },
  {
    id: 'VAKA-06',
    senaryolar: ['DYN-87', 'DYN-03'],
    ad: 'Yıkıcı Biyolojik Yük',
    analiz: 'Hem çok çalışıp sonuç alamamak hem de uyku yetersizliği eş zamanlı etki etmekte; öğrenci iki yönlü erozyon yaşamaktadır.',
    strateji: 'Hacim derhal düşürülmeli; önce uyku restore edilmeli, ardından isabet odaklı küçük hedefler tanımlanmalıdır.',
    priority: 88
  },
  {
    id: 'VAKA-07',
    senaryolar: ['DYN-55', 'DYN-42'],
    ad: 'Çift Katmanlı Kaçınma',
    analiz: 'Öğrenci hem yeni konu öğrenmekten hem de soru çözme testinden kaçınmakta; pasif döngüde hapsolmaktadır.',
    strateji: 'Tek bir yeni kazanım ve hemen ardından 10 soruluk mini uygulama şeklinde kırılma sağlanmalıdır.',
    priority: 72
  },
  {
    id: 'VAKA-08',
    senaryolar: ['DYN-128', 'DYN-107'],
    ad: 'Gece Döngüsü',
    analiz: 'Gece geç saatte ekran kullanımı uyku süresini çalmakta, yetersiz uyku da ertesi gün kaygıyı artırmaktadır; kısır döngü oluşmuştur.',
    strateji: '"Dijital Sokağa Çıkma Yasağı" ve sabit yatış saati birlikte uygulanmalı; 1 haftalık pilot test önerilmelidir.',
    priority: 88
  },
  {
    id: 'VAKA-09',
    senaryolar: ['DYN-134', 'DYN-02'],
    ad: 'Sessiz Tükenmişlik',
    analiz: 'Öğrenci ne veri girmekte ne de enerji göstermektedir; sisteme ve sürece olan bağlılık tehlikeli biçimde zayıflamıştır.',
    strateji: 'Akademik tüm beklentiler askıya alınmalı; önce duygusal bağ ve güven tazelenmelidir.',
    priority: 95
  },
  {
    id: 'VAKA-10',
    senaryolar: ['POS-03', 'POS-10'],
    ad: 'Altın Gün',
    analiz: 'Hem akış halinde hem fizyolojik olarak ideal durumda çalışılmıştır; bu gün öğrencinin gerçek potansiyelini göstermektedir.',
    strateji: 'Bu günün koşulları (uyku, yatış saati, mola düzeni) ayrıntılı not edilmeli; tekrarlanabilir bir şablon oluşturulmalıdır.',
    priority: 30
  },
];

// Dışa aktarım
window.SENARYOLAR = SENARYOLAR;
window.POZITIF_SENARYOLAR = POZITIF_SENARYOLAR;
window.VAKA_KOMBINASYONLARI = VAKA_KOMBINASYONLARI;
window._kalibre = _kalibre;

// ── EK SENARYOLAR — Modül 1 (DYN-07..20) ─────────────────
SENARYOLAR.push(

  {
    id: 'DYN-07', modul: 1, priority: 65,
    etiket: 'Hafta Sonu Kaygı Kırılması',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 0 || gun === 6) && b.kaygi >= k.kaygi.yuksek && h.ortKaygi < k.kaygi.ort;
    },
    cikti: {
      analiz: 'Hafta içi düşük seyreden kaygı hafta sonu belirgin biçimde yükseliyor; serbest zaman yönetimindeki belirsizliğe bağlanmaktadır.',
      strateji: 'Cumartesi ve Pazar günleri için hafif ama net bir rutin belirlenmeli; belirsizlik hissi giderilmelidir.',
      aylikEtiket: 'Hafta_Sonu_Kaygı', ton: 'coaching'
    }
  },

  {
    id: 'DYN-08', modul: 1, priority: 62,
    etiket: 'Maskelenmiş Başarı',
    tetikle: (b, h, a, k) =>
      (b.mood === 'sad' || b.mood === 'tired') && b.tekrarSure > 40 &&
      b.hataOrani !== null && b.hataOrani < 15,
    cikti: {
      analiz: 'Öğrenci duygusal zorluklarını bastırmak için rutin işlere (tekrar) aşırı odaklanmaktadır.',
      strateji: 'Başarı takdir edilmeli ancak duygusal yükün paylaşılması için rehberlik alanı açılmalıdır.',
      aylikEtiket: 'Maskelenmiş_Başarı', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-11', modul: 1, priority: 78,
    etiket: 'Pasif Direnç',
    tetikle: (b, h, a, k) =>
      b.soru === 0 && b.konuSure === 0 &&
      (b.kaygi > 0 || b.enerji > 0) &&
      h.ortKaygi >= k.kaygi.ort,
    cikti: {
      analiz: 'Öğrenci takip sistemine veri girdiği ancak akademik eyleme geçemediği (felç hali) saptanmıştır.',
      strateji: 'Akademik baskı tamamen kaldırılmalı; eylemsizliğin altındaki duygusal bariyerler üzerine odaklanılmalıdır.',
      aylikEtiket: 'Pasif_Direnç', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-12', modul: 1, priority: 68,
    etiket: 'Güvenli Liman Sığınması',
    tetikle: (b, h, a, k) =>
      b.kaygi >= k.kaygi.yuksek && b.tekrarSure > 60 &&
      b.konuSure === 0,
    cikti: {
      analiz: 'Öğrenci yüksek kaygı anlarında hata yapma riski olmayan tanıdık konulara sığınarak vicdan rahatlatmaktadır.',
      strateji: 'Konfor alanından çıkış için çok küçük (mikro) yeni nesil soru hedefleri tanımlanmalıdır.',
      aylikEtiket: 'Güvenli_Liman', ton: 'coaching'
    }
  },

  {
    id: 'DYN-13', modul: 1, priority: 55,
    etiket: 'Kriz Sonrası Boşluk',
    tetikle: (b, h, a, k) =>
      (b.mood === 'good' || b.mood === 'excited') && b.kaygi < k.kaygi.dusuk &&
      b.soru === 0 && b.konuSure === 0 &&
      h.ortKaygi >= k.kaygi.yuksek,
    cikti: {
      analiz: 'Yoğun bir kriz döneminin ardından öğrencinin zihinsel olarak sistemi tamamen kapattığı gözlemlenmiştir.',
      strateji: 'Bu mola "hak edilmiş bir restorasyon" olarak kabul edilmeli; ancak kopuşun kalıcı olmaması için hafif bir dönüş planı yapılmalıdır.',
      aylikEtiket: 'Kriz_Sonrası_Boşluk', ton: 'balanced'
    }
  },

  {
    id: 'DYN-16', modul: 1, priority: 60,
    etiket: 'Sonuç Odaklı Kopuş',
    tetikle: (b, h, a, k) =>
      b.soru === 0 && b.kaygi === 0 && b.enerji === 0 &&
      h.bosGunSayisi >= 4,
    cikti: {
      analiz: 'Öğrenci günlük rutinle bağını kesmiş; koçluk sistemini sadece bir deneme takip aracına dönüştürmüştür.',
      strateji: 'Günlük verinin "gelişim izleme"deki kritik önemi hatırlatılmalı; sürecin sonuçtan daha kıymetli olduğu vurgulanmalıdır.',
      aylikEtiket: 'Sonuç_Odaklı_Kopuş', ton: 'directive'
    }
  },

  {
    id: 'DYN-17', modul: 1, priority: 74,
    etiket: 'Travmatik Branş Teması',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const zayif = h.zayifBrans;
      if (!zayif || !b.dersHata[zayif]) return false;
      const isabet = b.dersHata[zayif].q > 0 ? (1 - b.dersHata[zayif].y / b.dersHata[zayif].q) * 100 : 100;
      return b.kaygi >= k.kaygi.yuksek && isabet < 45;
    },
    cikti: {
      analiz: 'Zayıf branşla temasın doğrudan yüksek kaygı ve bilişsel blokaj yarattığı saptanmıştır.',
      strateji: 'Bu branşla olan temas süresi kısaltılmalı; "başarı hissi" için çok kolay seviyeden başlanmalıdır.',
      aylikEtiket: 'Travmatik_Branş', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-18', modul: 1, priority: 58,
    etiket: 'Bilişsel Sis',
    tetikle: (b, h, a, k) =>
      b.odak < k.odak.dusuk && b.tekrarSure > 40 &&
      h.isatetTrend < -5,
    cikti: {
      analiz: 'Öğrencinin masada olduğu ancak zihninin içerikte olmadığı (Bilişsel Sis) değerlendirilmektedir.',
      strateji: 'Masadan tamamen uzaklaşılması ve zihni tazeleyecek fiziksel bir aktiviteye geçilmesi önerilmelidir.',
      aylikEtiket: 'Bilişsel_Sis', ton: 'coaching'
    }
  },

  {
    id: 'DYN-19', modul: 1, priority: 55,
    etiket: 'Periyodik Disiplin Kaybı',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 0 || gun === 6) && b.soru === 0 && b.konuSure === 0 &&
        h.tutarliGunSayisi >= 4;
    },
    cikti: {
      analiz: 'Okul/dershane dışındaki serbest zamanın yönetilemediği ve disiplin kaybına yol açtığı saptanmıştır.',
      strateji: 'Hafta sonu için "esnek ama yazılı" bir plan oluşturulmalı; veli denetimi bu günlerde artırılmalıdır.',
      aylikEtiket: 'Hafta_Sonu_Çöküşü', ton: 'directive'
    }
  },

  {
    id: 'DYN-20', modul: 1, priority: 52,
    etiket: 'Duygusal Rehavet',
    tetikle: (b, h, a, k) =>
      (b.mood === 'excited' || b.mood === 'good') &&
      b.kaygi < k.kaygi.dusuk && b.soru < k.soru.dusuk * 0.5 &&
      h.tutarliGunSayisi < 3,
    cikti: {
      analiz: 'Pozitif ruh halinin yarattığı rehavet, çalışma hacmini kritik seviyenin altına düşürmüştür.',
      strateji: 'Hedefler ve sınava kalan gerçek süre hatırlatılmalı; disiplinin duygulardan bağımsızlığı vurgulanmalıdır.',
      aylikEtiket: 'Duygusal_Rehavet', ton: 'directive'
    }
  },

  {
    id: 'DYN-21', modul: 1, priority: 70,
    etiket: 'Emosyonel İstikrarsızlık',
    tetikle: (b, h, a, k) =>
      (b.mood === 'excited' || b.mood === 'good') && b.kaygi >= k.kaygi.yuksek &&
      h.odakTrend === 'stabil',
    cikti: {
      analiz: 'Öğrenci dış dünyada "iyiyim" maskesi takarken, iç dünyasında yoğun sınav baskısı hissettiği değerlendirilmektedir.',
      strateji: 'Duygusal dürüstlük teşvik edilmeli; kaygı düzeyi normalin üstüne çıkmadan yoğun akademik baskı kurulmamalıdır.',
      aylikEtiket: 'Emosyonel_İstikrarsızlık', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-22', modul: 1, priority: 60,
    etiket: 'Pasif Öğrenme Tuzağı',
    tetikle: (b, h, a, k) =>
      b.konuSure > 90 && b.soru < 20,
    cikti: {
      analiz: 'Öğrenci konu çalışarak vicdanını rahatlatmakta ancak soru çözmenin yaratacağı "hata yapma" stresinden kaçmaktadır.',
      strateji: 'Konu çalışma süreleri 40 dakika ile sınırlandırılmalı; hemen ardından en az 20 soruluk uygulama zorunluluğu getirilmelidir.',
      aylikEtiket: 'Pasif_Öğrenme', ton: 'directive'
    }
  },

  {
    id: 'DYN-23', modul: 1, priority: 58,
    etiket: 'Fizyolojik İhmal',
    tetikle: (b, h, a, k) =>
      b.enerji < k.enerji.dusuk && (b.mood === 'good' || b.mood === 'excited') &&
      b.soru >= k.soru.ort && h.ortUyku < 7,
    cikti: {
      analiz: 'Fiziksel tükenmişliğe rağmen öğrencinin kendini zorladığı ve "bedensel borç" biriktirdiği saptanmıştır.',
      strateji: 'Akademik üretim takdir edilmekle birlikte 8 saatlik uyku zorunluluğunun bilişsel zeka üzerindeki etkisi hatırlatılmalıdır.',
      aylikEtiket: 'Fizyolojik_İhmal', ton: 'balanced'
    }
  },

  {
    id: 'DYN-24', modul: 1, priority: 72,
    etiket: 'Yardım Çağrısı',
    tetikle: (b, h, a, k) =>
      b.soru < 40 && b.konuSure === 0 && b.tekrarSure === 0 &&
      (b.kaygi > 0 || b.enerji > 0) &&
      h.veriGirisTutarliligi >= 5,
    cikti: {
      analiz: 'Öğrenci koçluk bağına tutunmakta ancak akademik olarak tamamen tıkanmış (Atalet) durumdadır.',
      strateji: 'Akademik olmayan bir koçluk seansı planlanmalı; öğrencinin süreçten tamamen kopmaması için duygusal destek verilmelidir.',
      aylikEtiket: 'Yardım_Çağrısı', ton: 'empathetic'
    }
  }
);

// ── EK SENARYOLAR — Modül 2 (DYN-45..75) ─────────────────
SENARYOLAR.push(

  {
    id: 'DYN-45', modul: 2, priority: 62,
    etiket: 'Hata İnkarı',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      return zayif && zayif.q < 10 && h.zayifBransDenemeIsabet < 50;
    },
    cikti: {
      analiz: 'Öğrenci denemedeki başarısızlığıyla yüzleşmemek için ilgili branşı çalışma programından elemektedir.',
      strateji: 'Deneme analizi zorunlu bir "hata avcılığı" seansına dönüştürülmeli; yanlış sorular koç eşliğinde incelenmelidir.',
      aylikEtiket: 'Hata_İnkarı', ton: 'directive'
    }
  },

  {
    id: 'DYN-46', modul: 2, priority: 58,
    etiket: 'Bilişsel Kutuplaşma',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const sozel = ['Türkçe','İnkılap Tarihi','Din Kültürü','İngilizce'];
      const sayisal = ['Matematik','Fen Bilimleri'];
      const sozelSure = sozel.reduce((a, d) => a + (b.dersHata[d]?.q || 0), 0);
      const sayisalSure = sayisal.reduce((a, d) => a + (b.dersHata[d]?.q || 0), 0);
      return sozelSure > sayisalSure * 3 && sayisalSure < 15;
    },
    cikti: {
      analiz: 'Zihinsel yorgunluk anlarında direnç göstermek yerine doğrudan sözel branşlara saptığı saptanmıştır.',
      strateji: 'Sayısal çalışmalar bloklar halinde değil, sözel derslerin arasına "sandviç tekniği" ile yerleştirilmelidir.',
      aylikEtiket: 'Bilişsel_Kutuplaşma', ton: 'coaching'
    }
  },

  {
    id: 'DYN-47', modul: 2, priority: 55,
    etiket: 'Tekrar Patolojisi',
    tetikle: (b, h, a, k) =>
      b.tekrarSure > 60 && b.konuSure === 0 &&
      h.zayifBrans !== null,
    cikti: {
      analiz: 'Öğrenci yeni bir şey öğrenmenin riskini almamak için vaktini bildiği konuları tekrar ederek tüketmektedir.',
      strateji: 'Tekrar sürelerine kesin kısıtlama getirilmeli; yeni konu kazanımı haftalık performansın ana kriteri yapılmalıdır.',
      aylikEtiket: 'Tekrar_Patolojisi', ton: 'directive'
    }
  },

  {
    id: 'DYN-48', modul: 2, priority: 52,
    etiket: 'Haftalık Motivasyon Erozyonu',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 4 || gun === 5) && h.zayifBransSure < 10 &&
        h.ortEnerji < k.enerji.ort;
    },
    cikti: {
      analiz: 'Haftalık enerji azaldıkça öğrencinin zayıf branşlarla temas kurma iradesi hızla düşmektedir.',
      strateji: 'Haftanın son günlerine daha hafif pekiştirme çalışmaları konulmalı; ana yük hafta başına dağıtılmalıdır.',
      aylikEtiket: 'Motivasyon_Erozyonu', ton: 'coaching'
    }
  },

  {
    id: 'DYN-51', modul: 2, priority: 58,
    etiket: 'Atıl Çalışma',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      return zayif && zayif.q < 5 && (b.konuSure > 40 || b.tekrarSure > 40);
    },
    cikti: {
      analiz: 'Öğrenci zayıf olduğu dersin başında vakit geçirmekte ancak "başlayamama direnci" nedeniyle somut üretim yapamamaktadır.',
      strateji: 'Başlama eşiğini düşürmek adına ilk 5 dakika sadece "çözümlü örnek inceleme" görevi verilmelidir.',
      aylikEtiket: 'Atıl_Çalışma', ton: 'coaching'
    }
  },

  {
    id: 'DYN-52', modul: 2, priority: 50,
    etiket: 'Sığınma Odaklı Hacim',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const dersler = Object.entries(b.dersHata).sort((x,y) => y[1].q - x[1].q);
      if (!dersler.length) return false;
      const enFazla = dersler[0];
      const toplam = dersler.reduce((s,d) => s + d[1].q, 0);
      return enFazla[1].q / Math.max(toplam,1) > 0.7 &&
        toplam >= k.soru.ort && b.tekrarSure > 60;
    },
    cikti: {
      analiz: 'Öğrenci zor derslerin yarattığı suçluluk hissini sevdiği derste aşırı yükleme yaparak kapatmaya çalışmaktadır.',
      strateji: 'Branşlar arası "geçiş kotaları" uygulanmalı; sevilen derse geçmek için zayıf dersten minimum 20 soru çözme şartı getirilmelidir.',
      aylikEtiket: 'Sığınma_Odaklı_Hacim', ton: 'directive'
    }
  },

  {
    id: 'DYN-53', modul: 2, priority: 55,
    etiket: 'Dikkat Kayması',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const sozel = ['Türkçe','İnkılap Tarihi','Din Kültürü','İngilizce'];
      const sayisal = ['Matematik','Fen Bilimleri'];
      const sozelIsabet = sozel.reduce((a,d) => {
        const v = b.dersHata[d]; return v && v.q > 0 ? a + (1-v.y/v.q)*100 : a;
      }, 0) / Math.max(sozel.filter(d => b.dersHata[d]?.q > 0).length, 1);
      const sayisalIsabet = sayisal.reduce((a,d) => {
        const v = b.dersHata[d]; return v && v.q > 0 ? a + (1-v.y/v.q)*100 : a;
      }, 0) / Math.max(sayisal.filter(d => b.dersHata[d]?.q > 0).length, 1);
      return sayisalIsabet > sozelIsabet + 20 && sozelIsabet < 70;
    },
    cikti: {
      analiz: 'Sayısal branştaki gelişim takdir edilmekle birlikte sözel derslerin "nasılsa yaparım" rehavetiyle ihmal edildiği görülmektedir.',
      strateji: 'Sözel branşların "nankör" yapısı hatırlatılmalı; günlük rutin dengeye oturtulmalıdır.',
      aylikEtiket: 'Dikkat_Kayması', ton: 'informative'
    }
  },

  {
    id: 'DYN-54', modul: 2, priority: 68,
    etiket: 'Akademik Travma Tetiklenmesi',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      if (!zayif || zayif.q < 10) return false;
      const isabet = (1 - zayif.y / zayif.q) * 100;
      return isabet < 35 && (b.mood === 'sad' || b.mood === 'tired' || b.mood === 'anxious');
    },
    cikti: {
      analiz: 'İlgili branşın öğrenci için sadece bir ders değil, bir "yetersizlik sembolü" haline geldiği gözlemlenmiştir.',
      strateji: 'Branşın psikolojik ağırlığını azaltmak için 1 hafta boyunca sadece "video izleme ve not alma" (pasif ama güvenli) süreci işletilmelidir.',
      aylikEtiket: 'Akademik_Travma', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-57', modul: 2, priority: 60,
    etiket: 'Erteleme Kümelenmesi',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 0 || gun === 6) && h.zayifBransSure < 5 &&
        h.tutarliGunSayisi >= 3;
    },
    cikti: {
      analiz: 'Hafta içi kaçınılan tüm zorlukların hafta sonuna bırakılması, öğrencinin dinlenme vaktini akademik bir "ceza seansına" çevirmektedir.',
      strateji: 'Zor branşlar hafta içine "serpiştirilmeli"; hafta sonu ise daha hafif ve pekiştirme odaklı bırakılmalıdır.',
      aylikEtiket: 'Erteleme_Kümelenmesi', ton: 'coaching'
    }
  },

  {
    id: 'DYN-58', modul: 2, priority: 58,
    etiket: 'Verimsiz Refah',
    tetikle: (b, h, a, k) =>
      b.soru < 20 && (b.mood === 'good' || b.mood === 'excited') && b.enerji >= 9,
    cikti: {
      analiz: 'Öğrencinin şartları (enerji, mod) ideal olmasına rağmen hedef odaklı disiplinden tamamen koptuğu görülmektedir.',
      strateji: '"Serbest zaman" ile "akademik zaman" arasındaki sınırlar netleştirilmeli; yüksek enerjinin meyveleri toplanmalıdır.',
      aylikEtiket: 'Verimsiz_Refah', ton: 'directive'
    }
  },

  {
    id: 'DYN-59', modul: 2, priority: 55,
    etiket: 'Kırılgan Başarı',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      if (!zayif) return false;
      const isabet = zayif.q > 0 ? (1 - zayif.y/zayif.q)*100 : 0;
      return isabet >= 80 && zayif.q < 15;
    },
    cikti: {
      analiz: 'Öğrenci sadece "emin olduğu" soruları çözerek isabet oranını yüksek tutmakta, zorlayıcı sorulardan kaçınmaktadır.',
      strateji: 'Yanlış yapmanın "ödüllendirildiği" (analiz edildiği sürece) bir sistem kurulmalı; soru hacmi kademeli artırılmalıdır.',
      aylikEtiket: 'Kırılgan_Başarı', ton: 'coaching'
    }
  },

  {
    id: 'DYN-60', modul: 2, priority: 62,
    etiket: 'Cezalandırıcı Kaçınma',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      return (!zayif || zayif.q === 0) && h.zayifBransDenemeIsabet < 50 &&
        h.denemeTrend === 'düşüş';
    },
    cikti: {
      analiz: 'Deneme sınavındaki düşük performansın öğrenciyi o dersten tamamen soğuttuğu ve bir "akademik blokaj" yarattığı saptanmıştır.',
      strateji: 'Branşla ilişki "duygulardan arındırılmalı"; net odaklı değil, sadece "soru tipi tanıma" odaklı hafif temaslar sağlanmalıdır.',
      aylikEtiket: 'Cezalandırıcı_Kaçınma', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-61', modul: 2, priority: 55,
    etiket: 'Bilişsel Patinaj',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      return zayif && zayif.q < 10 && b.tekrarSure > 60;
    },
    cikti: {
      analiz: 'Öğrenci zayıf olduğu branşta "yeni bir şey öğrenmenin" yaratacağı başarısızlık riskini almamak için sürekli eski bilgileri parlatmaktadır.',
      strateji: 'Tekrar sürelerine "blokaj" konulmalı; yeni nesil soru çözümü için küçük teşvikler tanımlanmalıdır.',
      aylikEtiket: 'Bilişsel_Patinaj', ton: 'coaching'
    }
  },

  {
    id: 'DYN-62', modul: 2, priority: 60,
    etiket: 'Denge Sapması',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const sayisal = ['Matematik','Fen Bilimleri'];
      const sozel = ['Türkçe','İnkılap Tarihi','Din Kültürü','İngilizce'];
      const sayisalQ = sayisal.reduce((a,d) => a+(b.dersHata[d]?.q||0), 0);
      const sozelQ   = sozel.reduce((a,d)   => a+(b.dersHata[d]?.q||0), 0);
      return sayisalQ < 20 && sozelQ > sayisalQ * 4 && sozelQ > 60;
    },
    cikti: {
      analiz: 'Sayısal alandaki gerilemenin yarattığı özgüven kaybı, sözel derslerdeki hacim artışıyla maskelenmektedir.',
      strateji: 'Sözel branş hacmi kontrol altına alınmalı; sayısal branştaki düşüşün teknik nedenleri (konu eksiği mi, süre mi?) ayrıştırılmalıdır.',
      aylikEtiket: 'Denge_Sapması', ton: 'informative'
    }
  },

  {
    id: 'DYN-64', modul: 2, priority: 52,
    etiket: 'İhmalkar Refah',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      return (!zayif || zayif.q < 15) && (b.mood === 'good' || b.mood === 'excited');
    },
    cikti: {
      analiz: 'Pozitif ruh hali, öğrencinin disiplini gevşetmesine ve "bugün zaten çok iyiyim, zorlanmama gerek yok" algısına yol açmıştır.',
      strateji: 'Akademik disiplinin moddan bağımsızlığı vurgulanmalı; günlük rutin plana sadakat teşvik edilmelidir.',
      aylikEtiket: 'İhmalkar_Refah', ton: 'directive'
    }
  },

  {
    id: 'DYN-65', modul: 2, priority: 65,
    etiket: 'Branş İzolasyonu',
    tetikle: (b, h, a, k) =>
      h.zayifBrans !== null && h.zayifBransSure < 5 &&
      h.veriGirisTutarliligi >= 5,
    cikti: {
      analiz: 'Belirli bir branşın haftalık plandan neredeyse tamamen silindiği ve "yok sayıldığı" saptanmıştır.',
      strateji: 'İlgili branş, en sevilen dersin hemen önüne (ön koşul olarak) 15-20 dakikalık mini periyotlarla eklenmelidir.',
      aylikEtiket: 'Branş_İzolasyonu', ton: 'directive'
    }
  },

  {
    id: 'DYN-66', modul: 2, priority: 62,
    etiket: 'Etkisiz Emek',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      if (!zayif || zayif.q < 20) return false;
      const isabet = (1 - zayif.y/zayif.q) * 100;
      return b.konuSure > 90 && isabet < 45;
    },
    cikti: {
      analiz: 'Öğrencinin konu çalışma yöntemi ile soru çözüm performansı arasında ciddi bir kopukluk saptanmıştır.',
      strateji: 'Konu çalışma yöntemi (not alma, video izleme vb.) revize edilmeli; "aktif okuma/dinleme" teknikleri uygulanmalıdır.',
      aylikEtiket: 'Etkisiz_Emek', ton: 'coaching'
    }
  },

  {
    id: 'DYN-68', modul: 2, priority: 55,
    etiket: 'Direnç Erozyonu',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 4 || gun === 5) &&
        h.zayifBransSure < 5 && h.ortEnerji < k.enerji.ort;
    },
    cikti: {
      analiz: 'Haftalık yorgunluk biriktikçe öğrencinin zayıf branşlarla temas kurma iradesi hızla düşmektedir.',
      strateji: 'Haftanın son günlerine daha hafif pekiştirme çalışmaları konulmalı; ana yük hafta başına dağıtılmalıdır.',
      aylikEtiket: 'Direnç_Erozyonu', ton: 'coaching'
    }
  },

  {
    id: 'DYN-69', modul: 2, priority: 58,
    etiket: 'Bilişsel Sıçrama',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const bransSayisi = Object.keys(b.dersHata).filter(d => b.dersHata[d].q > 0).length;
      const maxQ = Math.max(...Object.values(b.dersHata).map(v => v.q));
      const toplamQ = Object.values(b.dersHata).reduce((a,v) => a+v.q, 0);
      return bransSayisi >= 4 && maxQ / Math.max(toplamQ,1) < 0.3 && toplamQ > 0 &&
        Object.values(b.dersHata).every(v => v.q < 15);
    },
    cikti: {
      analiz: 'Öğrenci bir branşta zorlandığı anda diğerine kaçmakta; hiçbir alanda derinleşme sağlayamamaktadır.',
      strateji: '"Blok çalışma" kuralı getirilmeli; bir branştan diğerine geçmek için minimum 30 dakikalık süre şartı konulmalıdır.',
      aylikEtiket: 'Bilişsel_Sıçrama', ton: 'directive'
    }
  },

  {
    id: 'DYN-70', modul: 2, priority: 60,
    etiket: 'Kırılgan Onay Arayışı',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      if (!zayif) return false;
      const isabet = zayif.q > 0 ? (1-zayif.y/zayif.q)*100 : 0;
      return isabet >= 90 && zayif.q < 10 && b.kaygi >= k.kaygi.yuksek;
    },
    cikti: {
      analiz: 'Öğrenci koçun olumsuz tepkisinden çekindiği için isabet oranını yapay olarak yüksek tutmaktadır.',
      strateji: 'Sonuç yerine "hata yapma cesareti" ve "analiz süreci" övülmeli; güvenli iletişim ortamı sağlanmalıdır.',
      aylikEtiket: 'Onay_Arayışı', ton: 'validating'
    }
  },

  {
    id: 'DYN-71', modul: 2, priority: 65,
    etiket: 'Reaktif Kaçış',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      if (!zayif || zayif.q < 10) return false;
      const isabet = (1-zayif.y/zayif.q)*100;
      return isabet < 45 && b.sosyal > k.sosyal.yuksek;
    },
    cikti: {
      analiz: 'Zayıf branşta yaşanan zorlanma, öğrencide anlık bir özgüven kırılması yaratmakta ve dijital kaçışı tetiklemektedir.',
      strateji: 'Zor derslerden hemen sonra "dijital ödül" yerine "fiziksel mola" (yürüyüş, yemek) kuralı getirilmelidir.',
      aylikEtiket: 'Reaktif_Kaçış', ton: 'coaching'
    }
  },

  {
    id: 'DYN-72', modul: 2, priority: 58,
    etiket: 'Pasif Meşguliyet',
    tetikle: (b, h, a, k) =>
      b.soru < 40 && b.konuSure > 120,
    cikti: {
      analiz: 'Öğrenci masada kalarak çevresine "çalıştığı" mesajını vermekte ancak zihinsel efor gerektiren sorulardan kaçınmaktadır.',
      strateji: '"Üretim odaklı" çalışma modeline geçilmeli; konu çalışma süresinin 1/3\'ü kadar soru çözme zorunluluğu getirilmelidir.',
      aylikEtiket: 'Pasif_Meşguliyet', ton: 'directive'
    }
  },

  {
    id: 'DYN-73', modul: 2, priority: 65,
    etiket: 'Sistematik İhmal',
    tetikle: (b, h, a, k) =>
      h.zayifBrans !== null && h.zayifBransSure < 3 &&
      h.bosGunSayisi < 2 && h.veriGirisTutarliligi >= 4,
    cikti: {
      analiz: 'Belirli bir branşın sistematik olarak program dışına itildiği ve bu durumun bir alışkanlığa dönüştüğü gözlemlenmiştir.',
      strateji: 'İlgili branş, haftalık programın en başına "kritik eşik" olarak yerleştirilmeli; veli denetimi bu derse odaklanmalıdır.',
      aylikEtiket: 'Sistematik_İhmal', ton: 'directive'
    }
  },

  {
    id: 'DYN-74', modul: 2, priority: 60,
    etiket: 'Yüksek Maliyetli Başarı',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata || !h.zayifBrans) return false;
      const zayif = b.dersHata[h.zayifBrans];
      if (!zayif || zayif.q < 20) return false;
      const isabet = (1-zayif.y/zayif.q)*100;
      return isabet >= 75 && b.enerji < k.enerji.dusuk && (b.mood === 'sad' || b.mood === 'tired');
    },
    cikti: {
      analiz: 'Öğrenci tüm psikolojik bariyerlerine rağmen kendini zorlayarak başarılı olmuştur; ancak bu durumun sürdürülebilirliği düşüktür.',
      strateji: 'Bu "iradeli duruş" takdir edilmeli; ancak ertesi gün için mutlaka akademik yük hafifletilerek restorasyon sağlanmalıdır.',
      aylikEtiket: 'Yüksek_Maliyetli_Başarı', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-75', modul: 2, priority: 62,
    etiket: 'Konfor Alanı Raporu',
    tetikle: (b, h, a, k) =>
      h.zayifBransSure < 20 && h.tutarliGunSayisi >= 4,
    cikti: {
      analiz: 'Ay genelinde akademik hacim tatmin edici olduğu ancak branş dağılımının dengesiz olduğu saptanmıştır.',
      strateji: 'Bütüncül analizde "Branş Gettosu" uyarısı verilmeli; gelecek ay için zayıf branşlara %30\'luk bir zaman kotası tanımlanmalıdır.',
      aylikEtiket: 'Konfor_Alanı_Tuzağı', ton: 'informative'
    }
  }
);

// ── EK SENARYOLAR — Modül 3 (DYN-77..105) ────────────────
SENARYOLAR.push(

  {
    id: 'DYN-77', modul: 3, priority: 72,
    etiket: 'Sahte Yetkinlik',
    tetikle: (b, h, a, k) =>
      b.soru < 40 && b.hataOrani !== null && b.hataOrani < 10 &&
      (b.mood === 'good' || b.mood === 'excited'),
    cikti: {
      analiz: 'Öğrenci çok az soru çözerek "hata yapmama" konforuna sığınmış ve bunu bir başarı illüzyonu olarak yaşamaktadır.',
      strateji: 'Hedeflenen soru hacminin sınav dayanıklılığı için şart olduğu hatırlatılmalı; konfor alanı genişletilmelidir.',
      aylikEtiket: 'Sahte_Yetkinlik', ton: 'coaching'
    }
  },

  {
    id: 'DYN-78', modul: 3, priority: 80,
    etiket: 'Akademik Aşınma',
    tetikle: (b, h, a, k) =>
      h.tutarliGunSayisi >= 5 && h.enerjiTrend === 'düşüş' &&
      (b.mood === 'tired' || b.mood === 'sad' || b.mood === 'ok'),
    cikti: {
      analiz: 'İstikrarlı yüksek performansın duygusal maliyeti artmaktadır; öğrenci sürdürülebilirlik sınırına yaklaşmıştır.',
      strateji: 'Acil bir "restorasyon günü" planlanmalı; akademik hacim geçici olarak %20 daraltılmalıdır.',
      aylikEtiket: 'Tükenmişlik_Eşiği', ton: 'urgent'
    }
  },

  {
    id: 'DYN-79', modul: 3, priority: 68,
    etiket: 'Düşük Farkındalık',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.ort && b.hataOrani !== null && b.hataOrani > 40 &&
      (b.mood === 'good' || b.mood === 'excited'),
    cikti: {
      analiz: 'Öğrenci çalışma hacminden duyduğu memnuniyetle öğrenme kalitesindeki ciddi düşüşü (hataları) fark etmemektedir.',
      strateji: 'Yanlış sorular üzerinden acil bir "hata analizi" yaptırılmalı; niceliğin değil niteliğin önemi vurgulanmalıdır.',
      aylikEtiket: 'Gerçeklikten_Kopuş', ton: 'rational'
    }
  },

  {
    id: 'DYN-80', modul: 3, priority: 35,
    etiket: 'Dengeli Adaptasyon',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.dusuk && b.soru < k.soru.ort &&
      b.hataOrani !== null && b.hataOrani < 20 &&
      (b.mood === 'good' || b.mood === 'focused'),
    cikti: {
      analiz: 'Öğrenci ideal hedefi yakalayamasa da, bulunduğu şartlar içinde maksimum verim ve motivasyonu korumayı başarmıştır.',
      strateji: 'Bu denge takdir edilmeli; soru hedefine kademeli (günlük +10 soru) geçiş planlanmalıdır.',
      aylikEtiket: 'Dengeli_Adaptasyon', ton: 'positive'
    }
  },

  {
    id: 'DYN-81', modul: 3, priority: 72,
    etiket: 'İçselleştirilemeyen Başarı',
    tetikle: (b, h, a, k) =>
      h.isatetTrend > 10 && h.enerjiTrend === 'düşüş',
    cikti: {
      analiz: 'Somut net artışları öğrencinin iç dünyasında karşılık bulmamakta; öğrenci hala "başaramıyorum" algısını korumaktadır.',
      strateji: 'Gelişim grafiği görselleştirilerek öğrenciye sunulmalı; öz-yeterlilik duygusu verilerle desteklenmelidir.',
      aylikEtiket: 'İçselleştirilemeyen_Başarı', ton: 'validating'
    }
  },

  {
    id: 'DYN-84', modul: 3, priority: 68,
    etiket: 'Süreç Yorgunluğu',
    tetikle: (b, h, a, k) =>
      h.tutarliGunSayisi >= 4 &&
      (b.mood === 'sad' || b.mood === 'tired' || b.mood === 'anxious') &&
      b.soru >= k.soru.ort * 0.7,
    cikti: {
      analiz: 'Haftalık rutinin ağırlığı hafta sonuna doğru öğrencinin psikolojik direncini kırmaktadır.',
      strateji: 'Hafta sonu programı "pekiştirme ve ödül" odaklı revize edilmeli; akademik baskı hafifletilmelidir.',
      aylikEtiket: 'Süreç_Yorgunluğu', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-86', modul: 3, priority: 32,
    etiket: 'Uyumlu Zirve',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani < 10 &&
      b.odak >= k.odak.yuksek &&
      (b.mood === 'excited' || b.mood === 'good' || b.mood === 'focused'),
    cikti: {
      analiz: 'Öğrenci potansiyelini tam kapasiteyle kullanmakta ve başarısını duygusal bir tatmine dönüştürebilmektedir.',
      strateji: 'Bu "akış" (flow) hali ödüllendirilmeli; başarının anahtar bileşenleri (uyku, odak, yöntem) not edilmelidir.',
      aylikEtiket: 'Akış_Hali', ton: 'celebratory'
    }
  },

  {
    id: 'DYN-88', modul: 3, priority: 65,
    etiket: 'Kabullenilmiş Sınır',
    tetikle: (b, h, a, k) =>
      h.tutarliGunSayisi >= 3 && h.soruHedefiKarsilama < 0.4 &&
      (b.mood === 'good' || b.mood === 'ok'),
    cikti: {
      analiz: 'Öğrenci ideal hedeften uzaklaşmasına rağmen bu durumu bir sorun olarak görmemekte, konfor alanını korumaktadır.',
      strateji: 'Sınavın rekabetçi doğası ve "istikrar" gerekliliği profesyonel bir dille hatırlatılmalı; disiplin eşiği yükseltilmelidir.',
      aylikEtiket: 'Kabullenilmiş_Sınır', ton: 'directive'
    }
  },

  {
    id: 'DYN-89', modul: 3, priority: 82,
    etiket: 'Kırılgan Mükemmeliyetçilik',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani < 15 &&
      b.kaygi >= k.kaygi.yuksek,
    cikti: {
      analiz: 'Başarı öğrenciyi rahatlatmamakta, aksine "bu seviyeyi koruma" stresi yaratmaktadır (Zirve Felci başlangıcı).',
      strateji: 'Hata yapmanın bir "öğrenme fırsatı" olduğu felsefesi işlenmeli; isabet oranından ziyade analiz süreci övülmelidir.',
      aylikEtiket: 'Kırılgan_Mükemmeliyetçilik', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-91', modul: 3, priority: 72,
    etiket: 'Duygusal Aşınma',
    tetikle: (b, h, a, k) =>
      h.isatetTrend >= 0 && h.enerjiTrend === 'düşüş' &&
      h.odakTrend === 'düşüş',
    cikti: {
      analiz: 'Akademik başarı devam etse de sürecin psikolojik maliyetinin arttığı saptanmıştır; duygusal yakıt tükenmektedir.',
      strateji: 'Akademik yük %20 hafifletilmeli; öğrenciye sevdiği sosyal aktiviteler için zaman alanı açılmalıdır.',
      aylikEtiket: 'Duygusal_Aşınma', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-92', modul: 3, priority: 60,
    etiket: 'Ezberci Hacim',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek && b.tekrarSure === 0 && b.konuSure === 0,
    cikti: {
      analiz: 'Öğrenci konu eksiğiyle yüzleşmek yerine bildiği yerden soru çözerek öz-yeterliliğini yapay olarak beslemektedir.',
      strateji: 'Yanlış yapılan soruların konu temeli araştırılmalı; "bilmiyorum" demenin erdemi ve gerekliliği anlatılmalıdır.',
      aylikEtiket: 'Ezberci_Hacim', ton: 'coaching'
    }
  },

  {
    id: 'DYN-93', modul: 3, priority: 75,
    etiket: 'Plato Travması',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek && h.denemeTrend === 'stabil' &&
      (b.mood === 'sad' || b.mood === 'anxious' || b.mood === 'tired'),
    cikti: {
      analiz: 'Öğrenci "duraklama dönemini" (plato) bir son olarak algılamakta ve emeğinin boşa gittiğine inanmaktadır.',
      strateji: 'Gelişimin sıçramalı (merdiven tipi) olduğu, denge dönemlerinin (plato) güç toplama evresi olduğu anlatılmalıdır.',
      aylikEtiket: 'Plato_Travması', ton: 'validating'
    }
  },

  {
    id: 'DYN-94', modul: 3, priority: 32,
    etiket: 'Bilişsel Esneklik',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const bransSayisi = Object.keys(b.dersHata).filter(d => b.dersHata[d].q >= 20).length;
      return bransSayisi >= 3 && b.soru >= k.soru.yuksek &&
        (b.mood === 'good' || b.mood === 'excited' || b.mood === 'focused');
    },
    cikti: {
      analiz: 'Öğrenci farklı derslerin yarattığı zihinsel yükü yönetebilmekte ve öz-yeterliliğini genele yayabilmektedir.',
      strateji: 'Bu esnek yapı takdir edilmeli; gerçek sınav simülasyonları (denemeler) bu dönemde artırılmalıdır.',
      aylikEtiket: 'Bilişsel_Esneklik', ton: 'celebratory'
    }
  },

  {
    id: 'DYN-95', modul: 3, priority: 65,
    etiket: 'Robotik Uyum',
    tetikle: (b, h, a, k) =>
      h.tutarliGunSayisi >= 5 && h.soruHedefiKarsilama >= 0.9 &&
      b.mood === 'ok',
    cikti: {
      analiz: 'Öğrenci süreci bir "memuriyet" gibi yürütmekte; heyecan ve motivasyon eksikliği tükenmişlik riski barındırmaktadır.',
      strateji: 'Öğrencinin "neden çalışıyorum?" sorusuna verdiği yanıt (hedef/hayal) güncellenmeli; sürece ruh katılmalıdır.',
      aylikEtiket: 'Robotik_Uyum', ton: 'coaching'
    }
  },

  {
    id: 'DYN-97', modul: 3, priority: 68,
    etiket: 'İllüzyonel Yeterlilik',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek && b.hataOrani !== null && b.hataOrani > 40 &&
      (b.mood === 'good' || b.mood === 'excited'),
    cikti: {
      analiz: 'Öğrenci niceliksel hedefe ulaşmanın verdiği hazla niteliksel çöküşü (düşük isabet) tamamen maskelemektedir.',
      strateji: 'Acil "Hata Analiz Seansı" planlanmalı; öğrencinin "yapamadıklarıyla" barışması sağlanmalıdır.',
      aylikEtiket: 'İllüzyonel_Yeterlilik', ton: 'rational'
    }
  },

  {
    id: 'DYN-98', modul: 3, priority: 72,
    etiket: 'Zihinsel Yorgunluk',
    tetikle: (b, h, a, k) =>
      h.tutarliGunSayisi >= 4 && h.isatetTrend < -10 &&
      h.soruHedefiKarsilama >= 0.85,
    cikti: {
      analiz: 'Öğrenci disiplini elden bırakmamakta ancak zihni artık bilgiyi işleme kapasitesini yitirmektedir.',
      strateji: 'Soru sayısı hedefi geçici olarak %30 düşürülmeli; zihinsel restorasyon için uyku süresi artırılmalıdır.',
      aylikEtiket: 'Zihinsel_Yorgunluk', ton: 'urgent'
    }
  },

  {
    id: 'DYN-99', modul: 3, priority: 85,
    etiket: 'Dürüst Teslimiyet',
    tetikle: (b, h, a, k) =>
      b.soru === 0 && b.konuSure === 0 &&
      (b.kaygi > 0 || b.enerji > 0) &&
      (b.mood === 'sad' || b.mood === 'tired'),
    cikti: {
      analiz: 'Öğrenci sürece olan inancını tamamen kaybetmiş ancak koçluk bağına tutunarak sessiz bir yardım çağrısı yapmaktadır.',
      strateji: 'Akademik tüm konu başlıkları kapatılmalı; sadece duygusal iyi oluş ve "neden" üzerine bir rehberlik seansı yapılmalıdır.',
      aylikEtiket: 'Dürüst_Teslimiyet', ton: 'crisis'
    }
  },

  {
    id: 'DYN-100', modul: 3, priority: 65,
    etiket: 'Yapay Öz-Güven',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const dersler = Object.entries(b.dersHata).filter(([d,v]) => v.q >= 20);
      if (dersler.length < 2) return false;
      const maks = Math.max(...dersler.map(([d,v]) => v.q));
      const toplamQ = dersler.reduce((a,[d,v]) => a+v.q, 0);
      return maks / toplamQ > 0.6 && b.soru >= k.soru.yuksek;
    },
    cikti: {
      analiz: 'Öğrenci zor branşların yarattığı yetersizlik hissini sevdiği branşta aşırı soru çözerek bastırmaktadır.',
      strateji: 'Öz-yeterliliğin "bütünsel" olması gerektiği anlatılmalı; başarı hissi zayıf branşlara küçük adımlarla transfer edilmelidir.',
      aylikEtiket: 'Yapay_Öz_Güven', ton: 'coaching'
    }
  },

  {
    id: 'DYN-101', modul: 3, priority: 60,
    etiket: 'Başarı Sonrası Boşluk',
    tetikle: (b, h, a, k) =>
      h.denemeTrend === 'yükseliş' &&
      (b.mood === 'ok' || b.mood === 'tired') &&
      b.soru < k.soru.ort * 0.6,
    cikti: {
      analiz: 'Beklenen net artışı gerçekleşmesine rağmen öğrenci beklediği mutluluğu hissedememekte ve bir anlamsızlık yaşamaktadır.',
      strateji: 'Başarının bir "durak" değil "yolculuk" olduğu hatırlatılmalı; yeni ve gerçekçi alt hedefler belirlenmeli.',
      aylikEtiket: 'Başarı_Sonrası_Boşluk', ton: 'coaching'
    }
  },

  {
    id: 'DYN-102', modul: 3, priority: 78,
    etiket: 'İradeli Yıkım',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek && b.odak < k.odak.dusuk && b.enerji < k.enerji.dusuk,
    cikti: {
      analiz: 'Öğrenci fiziksel ve zihinsel sınırlarını aşırı zorlamakta; bu durum uzun vadeli bir akademik nefret riski taşımaktadır.',
      strateji: '"Akıllı çalışma"nın dinlenmeyi de içerdiği vurgulanmalı; günlük hedef esnek hale getirilmelidir.',
      aylikEtiket: 'İradeli_Yıkım', ton: 'urgent'
    }
  },

  {
    id: 'DYN-103', modul: 3, priority: 58,
    etiket: 'Korumacı Rehavet',
    tetikle: (b, h, a, k) =>
      b.hataOrani !== null && b.hataOrani < 10 && b.soru < 40,
    cikti: {
      analiz: 'Öğrenci öz-yeterliliğini korumak için risk almaktan vazgeçmiş; gelişimi durdurma pahasına "iyiyim" imajını seçmiştir.',
      strateji: 'Konfor alanını sarsacak ama yıkmayacak "orta zorlukta" yeni görevler tanımlanmalıdır.',
      aylikEtiket: 'Korumacı_Rehavet', ton: 'coaching'
    }
  },

  {
    id: 'DYN-104', modul: 3, priority: 75,
    etiket: 'Kaotik Performans',
    tetikle: (b, h, a, k) =>
      b.kaygi >= k.kaygi.yuksek && b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani > 30,
    cikti: {
      analiz: 'Öğrenci büyük bir içsel fırtına yaşamasına rağmen soru sayısına tutunarak ayakta kalmaya çalışmaktadır.',
      strateji: 'Kaygı kaynağı somutlaştırılmalı; soru çözmenin bir "cezalandırma" değil "gelişim" aracı olduğu anlatılmalıdır.',
      aylikEtiket: 'Kaotik_Performans', ton: 'empathetic'
    }
  }
);

// ── EK SENARYOLAR — Modül 4 (DYN-109..125) ───────────────
SENARYOLAR.push(

  {
    id: 'DYN-109', modul: 4, priority: 62,
    etiket: 'Sinsi Odak Sızıntısı',
    tetikle: (b, h, a, k) =>
      h.haftaSosyalOrt > k.sosyal.ort && h.isatetTrend < 0 &&
      h.soruHedefiKarsilama >= 0.7,
    cikti: {
      analiz: 'Öğrenci görevlerini yerine getirse de zihinsel önceliği kademeli olarak dijital dünyaya kaptırmaktadır.',
      strateji: 'Ekran süresi için "üst limit" tanımlanmalı; bu limit aşıldığında akademik hedeflerin riske gireceği hatırlatılmalıdır.',
      aylikEtiket: 'Odak_Sızıntısı', ton: 'rational'
    }
  },

  {
    id: 'DYN-111', modul: 4, priority: 65,
    etiket: 'Sınav Yorgunluğu İstismarı',
    tetikle: (b, h, a, k) =>
      b.sosyal > 4 && h.denemeSonrasiGun,
    cikti: {
      analiz: 'Öğrenci ağır bir sınavın ardından zihnini dinlendirmek yerine dijital uyaranlarla daha fazla yormaktadır.',
      strateji: 'Deneme sonrası için "aktif dinlenme" (uyku, spor, hobi) alternatifleri sunulmalı; ekranın yorgunluğu artırdığı anlatılmalıdır.',
      aylikEtiket: 'Sınav_Yorgunluğu_İstismarı', ton: 'coaching'
    }
  },

  {
    id: 'DYN-112', modul: 4, priority: 68,
    etiket: 'Dopaminerjik Çöküş',
    tetikle: (b, h, a, k) =>
      b.sosyal > k.sosyal.yuksek &&
      (b.mood === 'sad' || b.mood === 'tired') && b.enerji < k.enerji.dusuk,
    cikti: {
      analiz: 'Dijital tüketim öğrenciye beklediği hazzı vermemekte, aksine suçluluk hissi ve enerji kaybı yaratmaktadır.',
      strateji: 'Sosyal medyanın bir "enerji vampiri" olduğu vurgulanmalı; kısıtlı kullanımın ruh haline etkisi izlenmelidir.',
      aylikEtiket: 'Dopaminerjik_Çöküş', ton: 'rational'
    }
  },

  {
    id: 'DYN-113', modul: 4, priority: 65,
    etiket: 'Parçalanmış Dikkat',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const bransSayisi = Object.keys(b.dersHata).filter(d => b.dersHata[d].q > 0).length;
      return bransSayisi >= 4 && b.sosyal > k.sosyal.yuksek &&
        Object.values(b.dersHata).every(v => v.q < 15);
    },
    cikti: {
      analiz: 'Dijital dünyanın "hızlı geçiş" mantığı, öğrencinin akademik sorularda uzun süre kalma (sabır) yeteneğini köreltmektedir.',
      strateji: '"Pomodoro" veya "Blok Çalışma" gibi kesintisiz odak süreleri zorunlu tutulmalı; telefon çalışma alanından uzaklaştırılmalıdır.',
      aylikEtiket: 'Parçalanmış_Dikkat', ton: 'directive'
    }
  },

  {
    id: 'DYN-114', modul: 4, priority: 68,
    etiket: 'Hafta Sonu Dijital Patlaması',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 0 || gun === 6) && b.sosyal > 4 &&
        h.haftaSosyalOrt <= k.sosyal.ort;
    },
    cikti: {
      analiz: 'Hafta boyunca biriken stresin kontrolsüzce dijital alana boşaltılması, tüm haftanın akademik kazanımlarını tehdit etmektedir.',
      strateji: 'Hafta sonu için "nitelikli ekran saati" belirlenmeli; tam kopuş yerine kontrollü kullanım teşvik edilmelidir.',
      aylikEtiket: 'Hafta_Sonu_Dijital_Patlama', ton: 'coaching'
    }
  },

  {
    id: 'DYN-115', modul: 4, priority: 60,
    etiket: 'Yüzeysel Çalışma Telafisi',
    tetikle: (b, h, a, k) =>
      b.sosyal > k.sosyal.yuksek && b.tekrarSure > 60 && b.soru < 20,
    cikti: {
      analiz: 'Öğrenci vaktini dijitalde tükettiği için vicdanını rahatlatmak adına zihni yormayan basit işlerle (tekrar) günü kapatmaktadır.',
      strateji: 'Akademik önceliğin "soru ve yeni konu" olduğu hatırlatılmalı; dijital süre bu önceliklerin önüne geçmemelidir.',
      aylikEtiket: 'Yüzeysel_Telafi', ton: 'directive'
    }
  },

  {
    id: 'DYN-116', modul: 4, priority: 70,
    etiket: 'Sahte Haz',
    tetikle: (b, h, a, k) =>
      b.sosyal > k.sosyal.yuksek && b.soru < k.soru.dusuk * 0.5 &&
      (b.mood === 'good' || b.mood === 'excited'),
    cikti: {
      analiz: 'Dijital dünyadan alınan yüksek dopamin, öğrencide sahte bir iyi oluş hali yaratmakta ve akademik hedeflerin ihmal edilmesini maskelemektedir.',
      strateji: 'Akademik çıktıların "gerçek haz" kaynağı olması gerektiği vurgulanmalı; dijital süre kısıtlanarak zihinsel açlık yaratılmalıdır.',
      aylikEtiket: 'Sahte_Haz', ton: 'rational'
    }
  },

  {
    id: 'DYN-117', modul: 4, priority: 65,
    etiket: 'Kümülatif Dikkat Dağılması',
    tetikle: (b, h, a, k) =>
      h.haftaSosyalOrt > k.sosyal.yuksek && h.isatetTrend < -8,
    cikti: {
      analiz: 'Uzun süreli dijital tüketimin zihni "hızlı ve yüzeysel" düşünmeye alıştırdığı, bunun da akademik sorularda dikkat hatalarını tetiklediği saptanmıştır.',
      strateji: '"Derin Çalışma" (Deep Work) seansları planlanmalı; bu seanslarda telefonun tamamen farklı bir odada tutulması zorunlu kılınmalıdır.',
      aylikEtiket: 'Kümülatif_Dikkat_Dağılması', ton: 'directive'
    }
  },



  {
    id: 'DYN-119', modul: 4, priority: 62,
    etiket: 'Dijital Enerji Vampiri',
    tetikle: (b, h, a, k) =>
      b.sosyal > k.sosyal.yuksek && b.uyku >= 8 && b.enerji < k.enerji.dusuk,
    cikti: {
      analiz: 'Biyolojik dinlenme (uyku) yeterli olmasına rağmen aşırı görsel uyaran maruziyeti zihinsel bir bitkinlik yaratmaktadır.',
      strateji: 'Enerji düşüklüğünün nedeninin "beden" değil "ekran" olduğu verilerle kanıtlanmalı; dijital detoks periyotları uygulanmalıdır.',
      aylikEtiket: 'Dijital_Enerji_Vampiri', ton: 'informative'
    }
  },

  {
    id: 'DYN-121', modul: 4, priority: 65,
    etiket: 'Gelişim Engelleyici Bariyer',
    tetikle: (b, h, a, k) =>
      h.haftaSosyalOrt > k.sosyal.yuksek && h.denemeTrend === 'stabil',
    cikti: {
      analiz: 'Akademik sıçrama yapması gereken dönemde öğrencinin zihinsel kapasitesini dijital dünyada harcaması ilerlemeyi engellemektedir.',
      strateji: 'Sınava kalan süre ile mevcut netler arasındaki ilişki hatırlatılmalı; dijital sürenin "fırsat maliyeti" somutlaştırılmalıdır.',
      aylikEtiket: 'Gelişim_Engeli', ton: 'rational'
    }
  },

  {
    id: 'DYN-122', modul: 4, priority: 32,
    etiket: 'Zihinsel Keskinlik',
    tetikle: (b, h, a, k) =>
      b.sosyal <= 0.5 && b.odak >= k.odak.yuksek &&
      b.hataOrani !== null && b.hataOrani < 15,
    cikti: {
      analiz: 'Minimal dijital temasın zihinsel berraklığı ve akademik motivasyonu maksimize ettiği saptanmıştır.',
      strateji: 'Bu "altın performans" anı takdir edilmeli; zihinsel berraklığın dijital diyetle olan bağı pekiştirilmelidir.',
      aylikEtiket: 'Zihinsel_Keskinlik', ton: 'celebratory'
    }
  },

  {
    id: 'DYN-123', modul: 4, priority: 58,
    etiket: 'Vicdan Rahatlatma Modu',
    tetikle: (b, h, a, k) =>
      b.sosyal > k.sosyal.yuksek && b.tekrarSure > 40 && b.soru < 20,
    cikti: {
      analiz: 'Öğrenci ağır akademik sorumluluktan kaçıp vaktini ekranda harcamış, gün sonunda ise "tekrar yaptım" diyerek kendini teselli etmiştir.',
      strateji: 'Günlük raporlama dilinde "Üretim (Soru)" ve "Tüketim (Ekran)" dengesi vurgulanmalı; sahte verimliliğe dikkat çekilmelidir.',
      aylikEtiket: 'Vicdan_Rahatlatma', ton: 'rational'
    }
  },

  {
    id: 'DYN-124', modul: 4, priority: 72,
    etiket: 'Ertelenmiş Sorumluluk Krizi',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 0 || gun === 6) && b.kaygi >= k.kaygi.yuksek &&
        h.haftaSosyalOrt > k.sosyal.ort;
    },
    cikti: {
      analiz: 'Hafta boyunca dijitalle uyutulan kaygı, hafta sonu boşluk anlarında kontrolsüz bir kaygı dalgasına dönüşmektedir.',
      strateji: 'Kaygının "yok edilmek" yerine "yönetilmesi" gerektiği anlatılmalı; dijital kaçışın sorunu büyüttüğü vurgulanmalıdır.',
      aylikEtiket: 'Ertelenmiş_Sorumluluk', ton: 'coaching'
    }
  }
);

// ── EK SENARYOLAR — Modül 5 (DYN-127..155) ───────────────
SENARYOLAR.push(

  {
    id: 'DYN-127', modul: 5, priority: 72,
    etiket: 'Duygusal Yorgunluk',
    tetikle: (b, h, a, k) =>
      b.uyku >= 8 && b.enerji < k.enerji.dusuk &&
      (b.mood === 'sad' || b.mood === 'tired'),
    cikti: {
      analiz: 'Fiziksel dinlenme (uyku) yeterli olsa da psikolojik baskı öğrencinin enerjisini tüketmektedir.',
      strateji: 'Akademik yük %30 hafifletilmeli; öğrenciye sadece "sevdiği" işlerle ilgileneceği bir "restorasyon öğleden sonrası" verilmelidir.',
      aylikEtiket: 'Duygusal_Yorgunluk', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-129', modul: 5, priority: 65,
    etiket: 'Atıl Potansiyel',
    tetikle: (b, h, a, k) =>
      b.enerji >= k.enerji.yuksek && b.odak >= k.odak.yuksek && b.soru < 40,
    cikti: {
      analiz: 'Öğrencinin zihinsel ve fiziksel kapasitesi en üst seviyede olmasına rağmen çalışma iradesi sergilenmemiştir.',
      strateji: '"Hazır bulunuşluk" hali en zor branşlarda yeni konu kazanımı için fırsat olarak kullanılmalıdır.',
      aylikEtiket: 'Atıl_Potansiyel', ton: 'directive'
    }
  },

  {
    id: 'DYN-131', modul: 5, priority: 68,
    etiket: 'Sosyal Jetlag',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return gun === 1 && b.enerji < k.enerji.dusuk && h.ortUyku < 7;
    },
    cikti: {
      analiz: 'Hafta içi biriken uyku borcu hafta sonu kapatılmaya çalışılmakta; bu da "sosyal jetlag" yaratarak Pazartesi odağını bozmaktadır.',
      strateji: 'Uyku düzeninin hafta geneline yayılması (istikrar) sağlanmalı; hafta içi-sonu farkı 1 saati geçmemelidir.',
      aylikEtiket: 'Sosyal_Jetlag', ton: 'informative'
    }
  },

  {
    id: 'DYN-132', modul: 5, priority: 60,
    etiket: 'Mekanik İrade',
    tetikle: (b, h, a, k) =>
      b.enerji < k.enerji.dusuk && b.soru >= k.soru.ort * 0.7 &&
      b.tekrarSure > 60,
    cikti: {
      analiz: 'Yeni bir şey öğrenecek enerjisi olmasa da öğrenci bildiklerini yaparak "çalıştım" hissini korumaya çalışmaktadır.',
      strateji: 'Bu direnç takdir edilmeli; ancak derin öğrenme gerektiren görevler enerjinin yüksek olduğu güne ertelenmelidir.',
      aylikEtiket: 'Mekanik_İrade', ton: 'balanced'
    }
  },

  {
    id: 'DYN-133', modul: 5, priority: 68,
    etiket: 'Sınav Sonrası Fizyolojik Çöküş',
    tetikle: (b, h, a, k) =>
      b.enerji < k.enerji.dusuk && b.uyku < 6 &&
      h.denemeSonrasiGun,
    cikti: {
      analiz: 'Sınavın yarattığı yoğun adrenalin sonrası yaşanan bu çöküş, "akut yorgunluk" olarak kodlanmalıdır.',
      strateji: 'Deneme akşamı hiçbir akademik görev verilmemeli; erken uyku ve ılık duş gibi fiziksel rahatlama önerilmelidir.',
      aylikEtiket: 'Sınav_Çöküşü', ton: 'coaching'
    }
  },

  {
    id: 'DYN-136', modul: 5, priority: 75,
    etiket: 'Gizli Yıpranma',
    tetikle: (b, h, a, k) =>
      b.uyku > 0 && b.uyku < 6 && b.soru >= k.soru.yuksek &&
      b.hataOrani !== null && b.hataOrani < 20,
    cikti: {
      analiz: 'Öğrenci kısa vadeli stres motivasyonuyla uykusuzluğu yenmektedir; ancak bilişsel rezervlerin hızla tükendiğini gösterir.',
      strateji: 'Bu "borçlu başarı"nın sürdürülemez olduğu vurgulanmalı; uyku süresinin 8 saatin altına düşmemesi bir "performans kuralı" olarak sunulmalıdır.',
      aylikEtiket: 'Borçlu_Başarı', ton: 'balanced'
    }
  },

  {
    id: 'DYN-137', modul: 5, priority: 60,
    etiket: 'Apatik Çöküş',
    tetikle: (b, h, a, k) =>
      b.enerji < k.enerji.dusuk && b.kaygi < k.kaygi.dusuk &&
      b.soru < k.soru.dusuk * 0.5,
    cikti: {
      analiz: 'Öğrenci duygusal olarak sakin olsa da fiziksel olarak "boş depo" ile hareket etmeye çalışmaktadır.',
      strateji: 'Odak akademik hedeflerden fiziksel restorasyona (beslenme ve dinlenme) kaydırılmalıdır.',
      aylikEtiket: 'Apatik_Çöküş', ton: 'coaching'
    }
  },

  {
    id: 'DYN-138', modul: 5, priority: 78,
    etiket: 'Kümülatif Uykusuzluk',
    tetikle: (b, h, a, k) =>
      h.dusukOdakGunSayisi >= 3 && h.ortUyku > 0 && h.ortUyku < 6.5,
    cikti: {
      analiz: 'Odaklanma sorununun zihinsel bir yetersizlik değil, doğrudan "uyku borcu" kaynaklı olduğu saptanmıştır.',
      strateji: 'Akademik tüm yeni konu kazanımları durdurulmalı; sistemin düzelmesi için 2 gece kesintisiz 8-9 saat uyku şart koşulmalıdır.',
      aylikEtiket: 'Uyku_Borcu', ton: 'urgent'
    }
  },

  {
    id: 'DYN-139', modul: 5, priority: 65,
    etiket: 'Fizyolojik Güç - Duygusal Engel',
    tetikle: (b, h, a, k) =>
      b.enerji >= k.enerji.yuksek && (b.mood === 'sad' || b.mood === 'anxious') &&
      b.soru >= k.soru.ort,
    cikti: {
      analiz: 'Öğrenci fiziksel olarak güçlü olmasına rağmen duygusal bir engel nedeniyle potansiyelini tam yansıtamamaktadır.',
      strateji: 'Fiziksel enerjiyi duygusal modu yükseltmek için kullanacak "aktif molalar" (spor, yürüyüş) önerilmeli.',
      aylikEtiket: 'Fiziksel_Güç_Duygusal_Engel', ton: 'coaching'
    }
  },

  {
    id: 'DYN-140', modul: 5, priority: 55,
    etiket: 'Aşırı Uyku Rehaveti',
    tetikle: (b, h, a, k) =>
      b.uyku >= 9.5 && b.enerji < k.enerji.dusuk && b.odak < k.odak.dusuk,
    cikti: {
      analiz: 'Rutin dışı aşırı uykunun zihni berraklaştırmak yerine daha fazla uyuşturduğu ve odaklanmayı zorlaştırdığı görülmektedir.',
      strateji: 'Uyku süresinin "optimum" seviyeye (8-8.5 saat) çekilmesi önerilmeli; güne fiziksel bir aktiviteyle başlanması teşvik edilmelidir.',
      aylikEtiket: 'Aşırı_Uyku', ton: 'informative'
    }
  },

  {
    id: 'DYN-141', modul: 5, priority: 65,
    etiket: 'Fizyolojik Kaçınma',
    tetikle: (b, h, a, k) =>
      h.enerjiTrend === 'düşüş' && h.zayifBransSure < 5 &&
      h.tutarliGunSayisi >= 3,
    cikti: {
      analiz: 'Fiziksel enerji azaldığında öğrencinin ilk vazgeçtiği alan "zorlandığı dersler" (zayıf branşlar) olmaktadır.',
      strateji: 'Enerjinin düştüğü günlerde zayıf branşla temas tamamen kesilmemeli; çok basit "mekanik tekrarlar" ile bağ korunmalıdır.',
      aylikEtiket: 'Fizyolojik_Kaçınma', ton: 'coaching'
    }
  },

  {
    id: 'DYN-142', modul: 5, priority: 60,
    etiket: 'Yanlış Dinlenme Tercihi',
    tetikle: (b, h, a, k) =>
      b.enerji < k.enerji.dusuk && b.sosyal > k.sosyal.yuksek && b.soru < 40,
    cikti: {
      analiz: 'Öğrenci yorgunluğunu gidermek için seçtiği yöntemin (ekran) aslında zihnini daha fazla tükettiği saptanmıştır.',
      strateji: 'Yorgunluk anlarında "beyin dinlendirme" (uyku, sessizlik) ile "beyin oyalama" (ekran) arasındaki fark anlatılmalıdır.',
      aylikEtiket: 'Yanlış_Dinlenme', ton: 'informative'
    }
  },

  {
    id: 'DYN-143', modul: 5, priority: 62,
    etiket: 'Hiper-Performans Riski',
    tetikle: (b, h, a, k) =>
      b.enerji >= k.enerji.yuksek && b.soru > k.soru.yuksek * 1.5,
    cikti: {
      analiz: 'Öğrenci kapasitesinin çok üzerinde bir efor sarf etmiştir; bu durumun ertesi gün "akademik akşamdan kalmalık" yaratma riski yüksektir.',
      strateji: 'Başarı takdir edilmeli ancak ertesi gün için "hafifletilmiş" bir program hazırlanarak denge sağlanmalıdır.',
      aylikEtiket: 'Hiper_Performans_Riski', ton: 'balanced'
    }
  },

  {
    id: 'DYN-145', modul: 5, priority: 62,
    etiket: 'Haftalık Uyku Borcu Faturası',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 0 || gun === 6) && b.enerji < k.enerji.dusuk &&
        h.ortUyku < 7;
    },
    cikti: {
      analiz: 'Hafta içi biriken fizyolojik borcun hafta sonu "sistem çöküşüne" yol açması, verimli geçirilecek günleri eylemsizliğe itmektedir.',
      strateji: 'Hafta sonu verimi için hafta içi uyku saati 7.5 saatin altına düşürülmemelidir; yük dağılımı revize edilmelidir.',
      aylikEtiket: 'Uyku_Borcu_Faturası', ton: 'coaching'
    }
  },

  {
    id: 'DYN-146', modul: 5, priority: 78,
    etiket: 'Yıpratıcı İrade',
    tetikle: (b, h, a, k) =>
      b.enerji < k.enerji.dusuk && b.soru >= k.soru.yuksek &&
      (b.mood === 'sad' || b.mood === 'tired' || b.mood === 'anxious'),
    cikti: {
      analiz: 'Öğrenci çalışmayı bir gelişim aracı değil, vicdan azabı dindirme veya kendini cezalandırma eylemi olarak sürdürmektedir.',
      strateji: 'İrade gücü takdir edilmeli ancak bu yöntemin uzun vadede "akademik nefret" yaratacağı profesyonelce anlatılmalıdır.',
      aylikEtiket: 'Yıpratıcı_İrade', ton: 'empathetic'
    }
  },

  {
    id: 'DYN-147', modul: 5, priority: 65,
    etiket: 'Gecikmiş Yorgunluk Faturası',
    tetikle: (b, h, a, k) => {
      const gun = new Date(b.dk + 'T12:00:00').getDay();
      return (gun === 0 || gun === 6) && b.enerji < k.enerji.dusuk &&
        h.tutarliGunSayisi >= 4;
    },
    cikti: {
      analiz: 'Hafta boyunca yapılan aşırı yükleme, hafta sonunu verimli geçirmek yerine tamamen "yatakta/eylemsiz" geçirmeye neden olmaktadır.',
      strateji: 'Hafta sonu verimi için hafta içi uyku saati 7.5 saatin altına düşürülmemeli; yük dağılımı revize edilmelidir.',
      aylikEtiket: 'Gecikmiş_Yorgunluk', ton: 'coaching'
    }
  },

  {
    id: 'DYN-148', modul: 5, priority: 88,
    etiket: 'Sabotajcı Hazırlık',
    tetikle: (b, h, a, k) => {
      // Deneme gününden önceki gece kontrolü
      return b.uyku > 0 && b.uyku < 5 && b.kaygi >= k.kaygi.yuksek &&
        h.denemedeSonraSoru === 0;
    },
    cikti: {
      analiz: 'Öğrenci sınav stresini uykusuzlukla birleştirerek gerçek potansiyelini sergileme şansını biyolojik olarak yok etmiştir.',
      strateji: 'Deneme günü performansının "bilgi" değil "fizyolojik hata" kaynaklı olduğu netleştirilmeli; bir sonraki sınav için uyku protokolü zorunlu tutulmalıdır.',
      aylikEtiket: 'Sabotajcı_Hazırlık', ton: 'urgent'
    }
  },

  {
    id: 'DYN-149', modul: 5, priority: 65,
    etiket: 'Enerji İsrafı',
    tetikle: (b, h, a, k) =>
      b.enerji >= k.enerji.yuksek && (b.mood === 'good' || b.mood === 'excited') &&
      b.soru === 0 && b.konuSure === 0,
    cikti: {
      analiz: 'Bedenin ve zihnin en verimli olduğu saatler akademik üretim için kullanılmamış; potansiyel boşa harcanmıştır.',
      strateji: '"Zirve Enerji Saatleri" tespit edilmeli ve bu saatlere en az 1 saatlik "odaklanmış çalışma" blokları yerleştirilmelidir.',
      aylikEtiket: 'Enerji_İsrafı', ton: 'directive'
    }
  },

  {
    id: 'DYN-151', modul: 5, priority: 78,
    etiket: 'Paradoksal Kaygı',
    tetikle: (b, h, a, k) =>
      b.uyku >= 8 && b.enerji >= k.enerji.yuksek && b.kaygi >= k.kaygi.yuksek,
    cikti: {
      analiz: 'Öğrenci kendini dinlenmiş hissettiğinde, yeterince yorulmadığı için "başarısız olacağı" sanrısına kapılmaktadır.',
      strateji: '"Yorulmak değil, verimli çalışmak kazandırır" prensibi işlenmeli; dinlenmiş zihnin işlem hızı vurgulanmalıdır.',
      aylikEtiket: 'Paradoksal_Kaygı', ton: 'rational'
    }
  },

  {
    id: 'DYN-152', modul: 5, priority: 65,
    etiket: 'Atalet ve Çöküş Döngüsü',
    tetikle: (b, h, a, k) =>
      h.bosGunSayisi >= 2 && b.enerji < k.enerji.dusuk,
    cikti: {
      analiz: 'Fiziksel bir efor olmamasına rağmen çalışmamanın verdiği suçluluk hissi öğrencinin tüm enerjisini tüketmiştir.',
      strateji: '"Hareket berekettir" ilkesiyle enerji düşük olsa dahi 15 dakikalık mini görevlerle sistem canlandırılmalıdır.',
      aylikEtiket: 'Atalet_Döngüsü', ton: 'coaching'
    }
  },

  {
    id: 'DYN-153', modul: 5, priority: 68,
    etiket: 'Enerji Bazlı Branş Ayrımı',
    tetikle: (b, h, a, k) => {
      if (!b.dersHata) return false;
      const sayisal = ['Matematik','Fen Bilimleri'];
      const sozel   = ['Türkçe','İnkılap Tarihi','Din Kültürü','İngilizce'];
      const sayisalQ = sayisal.reduce((a,d) => a+(b.dersHata[d]?.q||0), 0);
      const sozelQ   = sozel.reduce((a,d)   => a+(b.dersHata[d]?.q||0), 0);
      return b.enerji < k.enerji.dusuk && sozelQ > sayisalQ * 2 && sayisalQ > 0;
    },
    cikti: {
      analiz: 'Fiziksel tükenmişlik karmaşık bilişsel işlemleri (sayısal) imkansız kılarken otomatik süreçleri (sözel) etkilememektedir.',
      strateji: 'Enerjinin düştüğü akşam saatlerinde sayısal branş çalışılmamalı; bu saatler sözel tekrar veya paragraf için ayrılmalıdır.',
      aylikEtiket: 'Enerji_Bazlı_Ayrım', ton: 'informative'
    }
  },

  {
    id: 'DYN-154', modul: 5, priority: 82,
    etiket: 'Bilişsel Sis ve Depersonalizasyon',
    tetikle: (b, h, a, k) =>
      h.dusukOdakGunSayisi >= 4 && h.ortUyku > 0 && h.ortUyku < 6.5 &&
      b.mood === 'ok',
    cikti: {
      analiz: 'Uzun süreli uykusuzluk ve monotonluk öğrenciyi süreçten duygusal olarak koparmıştır.',
      strateji: '"Zihinsel Tazelenme" için 1 tam gün akademik detoks ve doğa/sosyal aktivite zorunlu tutulmalıdır.',
      aylikEtiket: 'Depersonalizasyon', ton: 'urgent'
    }
  },

  {
    id: 'DYN-155', modul: 5, priority: 92,
    etiket: 'Aylık Fizyolojik Hasar',
    tetikle: (b, h, a, k) => {
      // Aylık: fizyolojik limit aşım gün sayısı kontrolü
      return h.dusukEnerjiGunSayisi >= 5 || h.dusukOdakGunSayisi >= 5;
    },
    cikti: {
      analiz: 'Ayın önemli bir bölümü biyolojik limitlerin üzerinde geçmiştir; bu durum gelecek ay için ciddi bir performans düşüşü riski barındırmaktadır.',
      strateji: 'Gelecek ayın ilk 3 günü "aktif dinlenme" olarak planlanmalı; uyku düzeni ana hedef olarak belirlenmelidir.',
      aylikEtiket: 'Aylık_Fizyolojik_Hasar', ton: 'urgent'
    }
  }
);

