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
