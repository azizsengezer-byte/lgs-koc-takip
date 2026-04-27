// psych_analyzer.js — LGSKoç Veri-Anlatı Klinik Analiz Motoru
// Senaryo eşleştirme yok. Ham veriden doğrudan klinik teşhis.
// window.calistirSenaryolar arayüzü korundu — teacher_psych.js değişmez.

(function () {
  'use strict';

  // ── YARDIMCI FONKSİYONLAR ───────────────────────────────────
  function fnOrt(arr, f) {
    const v = arr.filter(d => (d[f] || 0) > 0);
    return v.length ? v.reduce((a, d) => a + d[f], 0) / v.length : null;
  }
  function r1(v) { return v !== null ? Math.round(v * 10) / 10 : null; }
  function r0(v) { return v !== null ? Math.round(v) : null; }
  function pctFark(a, b) {
    if (!b || b === 0) return null;
    return Math.round((a - b) / b * 100);
  }
  function lgsGun() {
    return Math.max(0, Math.floor((new Date('2026-06-13T09:30:00+03:00') - new Date()) / 86400000));
  }

  // ── ANA FONKSİYON (drop-in replacement) ─────────────────────
  window.calistirSenaryolar = function (gunler, allAcadEntries, endKey, period, startKey) {

    if (!gunler || gunler.length < 1) {
      return { insights: [], positives: [], kalOzet: null, trend: 'stabil', trendAnlati: '',
               zayifBrans: null, vaka: null, aktifProfil: null, tetiklenenTumIdler: [], frekansMap: {} };
    }

    // ── DÖNEM TOPLAM GÜN & BOŞ GÜN HESABI ──────────────────────
    let _totalPeriodDays = gunler.length; // fallback
    let _bosDays = 0;
    let _bosSeriler = []; // üst üste boş gün serileri [{baslangic, bitis, uzunluk}]
    let _sonBosSeri = 0;  // dönem sonundaki boş gün sayısı
    if (startKey && endKey) {
      const s = new Date(startKey + 'T12:00:00');
      const e = new Date(endKey   + 'T12:00:00');
      _totalPeriodDays = Math.round((e - s) / 86400000) + 1;
      const veriSet = new Set(gunler.map(d => d.dk));
      _bosDays = _totalPeriodDays - gunler.length;

      // Üst üste boş gün serilerini bul
      let seriBaslangic = null;
      let seriUzunluk = 0;
      for (let t = new Date(s); t <= e; t.setDate(t.getDate() + 1)) {
        const key = t.toISOString().split('T')[0];
        if (!veriSet.has(key)) {
          if (!seriBaslangic) seriBaslangic = key;
          seriUzunluk++;
        } else {
          if (seriBaslangic && seriUzunluk >= 2) {
            _bosSeriler.push({ baslangic: seriBaslangic, uzunluk: seriUzunluk });
          }
          seriBaslangic = null;
          seriUzunluk = 0;
        }
      }
      if (seriBaslangic && seriUzunluk >= 2) {
        _bosSeriler.push({ baslangic: seriBaslangic, uzunluk: seriUzunluk });
        // Dönem sonundaki boş seri
        const sonSeri = _bosSeriler[_bosSeriler.length - 1];
        if (sonSeri.baslangic >= endKey.substring(0, 8) + '15') _sonBosSeri = sonSeri.uzunluk;
        else _sonBosSeri = sonSeri.uzunluk; // son seri zaten dönem sonu
      }
    }
    const _aktifOran = _totalPeriodDays > 0 ? gunler.length / _totalPeriodDays : 1;

    const insights  = [];
    const positives = [];
    const isAylik   = period === 'aylik';
    const donem     = isAylik ? 'bu ay' : 'bu hafta';
    const _lgsGun   = lgsGun();

    // Kronolojik sıra
    const kron     = [...gunler].sort((a, b) => a.dk.localeCompare(b.dk));
    const ortaIdx  = Math.ceil(kron.length / 2);
    const ilkYari  = kron.slice(0, ortaIdx);
    const sonYari  = kron.slice(ortaIdx);

    // Temel gruplar
    const wellGun  = gunler.filter(d => d.enerji > 0 || d.kaygi > 0 || d.uyku > 0);
    const akadGun  = gunler.filter(d => d.soru > 0);

    // Branş hata haritası
    const dHata = {};
    gunler.forEach(d => {
      Object.entries(d.dersHata || {}).forEach(([ders, v]) => {
        if (!dHata[ders]) dHata[ders] = { q: 0, y: 0 };
        dHata[ders].q += v.q;
        dHata[ders].y += v.y;
      });
    });
    const dHataArr = Object.entries(dHata)
      .filter(([, v]) => v.q >= 20)
      .map(([d, v]) => ({ d, hata: v.y / v.q * 100, q: v.q }))
      .sort((a, b) => b.hata - a.hata);
    const zayifBrans = dHataArr.length > 0 ? dHataArr[0].d : null;

    // ── MODÜL 1: KAYGI × ÜRETİM KORELASYONU ────────────────────
    _modKaygiUretim(gunler, insights, positives, donem);

    // ── MODÜL 2: FİZYOLOJİK YÜK ────────────────────────────────
    _modFizyolojik(gunler, kron, insights, positives, donem);

    // ── MODÜL 3: AKADEMİK TEMPO TRENDİ ─────────────────────────
    _modTempo(kron, ilkYari, sonYari, insights, positives, isAylik, donem, _lgsGun);

    // ── MODÜL 4: BRANŞ KAÇINMASI ────────────────────────────────
    _modBrans(gunler, dHataArr, insights, positives, donem);

    // ── MODÜL 5: MEKANİK ÇALIŞMA ────────────────────────────────
    _modMekanik(gunler, insights, donem);

    // ── MODÜL 6: EKRAN GÖLGE ÇAPRAZLAMASI ───────────────────────
    _modEkran(gunler, insights, donem);

    // ── MODÜL 7: DUYGUSAL ÖRÜNTÜ ────────────────────────────────
    _modDuygu(gunler, kron, insights, positives, donem);

    // ── MODÜL 8: UYKU-ERTESİ GÜN KORELASYONU ───────────────────
    _modUykuErtesi(kron, insights, donem);

    // Önceliğe göre sırala
    insights.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Trend hesapla
    const trend       = _hesaplaTrend(ilkYari, sonYari);
    const trendAnlati = _trendAnlatisi(trend, ilkYari, sonYari, isAylik);

    // Kalibrasyon özeti
    const _toplamSoru  = akadGun.reduce((a, d) => a + d.soru, 0);
    // Gerçek günlük ortalama: toplam / dönem günü (boş günler dahil)
    const ortSoru      = _totalPeriodDays > 0 ? r0(_toplamSoru / _totalPeriodDays) : 0;
    // Aktif günlerdeki ortalama (referans için)
    const ortSoruAktif = akadGun.length > 0 ? r0(_toplamSoru / akadGun.length) : 0;
    const ortKaygi  = fnOrt(wellGun, 'kaygi');
    const ortUyku   = fnOrt(wellGun.filter(d => d.uyku > 0), 'uyku');
    const kalOzet   = {
      soruOrt:     ortSoru || 0,
      soruOrtAktif: ortSoruAktif || 0,
      kaygiEsik:   ortKaygi !== null ? r1(ortKaygi) : '-',
      uyku:        ortUyku  !== null ? r1(ortUyku)  : '-',
      // Boş gün bilgisi
      toplamGun:   _totalPeriodDays,
      aktifGun:    gunler.length,
      bosDays:     _bosDays,
      bosSeriler:  _bosSeriler,
      sonBosSeri:  _sonBosSeri,
      aktifOran:   _aktifOran,
    };

    // ── MODÜL 9: SİSTEMDEN KOPUŞ SINYALI ───────────────────────
    _modKopus(_totalPeriodDays, gunler.length, _bosDays, _bosSeriler, _sonBosSeri, _aktifOran, insights, period);

    return {
      insights, positives, kalOzet, trend, trendAnlati, zayifBrans,
      vaka: null, aktifProfil: null, tetiklenenTumIdler: [], frekansMap: {},
    };
  };

  // ════════════════════════════════════════════════════════════
  // MODÜL 1 — KAYGI × ÜRETİM KORELASYONU
  // ════════════════════════════════════════════════════════════
  function _modKaygiUretim(gunler, insights, positives, donem) {
    const ykG = gunler.filter(d => d.kaygi >= 6 && d.kaygi > 0 && d.soru >= 0);
    const dkG = gunler.filter(d => d.kaygi > 0 && d.kaygi < 5);
    if (ykG.length < 2 || dkG.length < 2) return;

    const ykSoru = ykG.reduce((a, d) => a + d.soru, 0) / ykG.length;
    const dkSoru = dkG.reduce((a, d) => a + d.soru, 0) / dkG.length;
    const fark   = dkSoru > 5 ? pctFark(dkSoru, ykSoru) : null;

    // İsabet korelasyonu
    const ykIsBg  = ykG.filter(d => d.hataOrani !== null);
    const dkIsBg  = dkG.filter(d => d.hataOrani !== null);
    const ykIsab  = ykIsBg.length  ? 100 - ykIsBg.reduce((a, d) => a + d.hataOrani, 0) / ykIsBg.length  : null;
    const dkIsab  = dkIsBg.length  ? 100 - dkIsBg.reduce((a, d) => a + d.hataOrani, 0) / dkIsBg.length  : null;
    const isabFark = (ykIsab !== null && dkIsab !== null) ? pctFark(dkIsab, ykIsab) : null;

    if (fark !== null && fark >= 30) {
      // Kaygı üretimi belirgin düşürüyor
      const isabEk = (isabFark !== null && isabFark >= 10)
        ? ` Üstelik isabet de etkileniyor: kaygılı günlerde %${r0(ykIsab)}, sakin günlerde %${r0(dkIsab)}.`
        : '';
      insights.push({
        etiket:   'Kaygı Altında Üretim Paradoksu',
        teshis:   `Kaygının 6'yı aştığı ${ykG.length} günde günlük soru ort. ${r0(ykSoru)};` +
                  ` kaygının 5'in altında kaldığı ${dkG.length} günde ${r0(dkSoru)}.` +
                  ` Fark %${fark}.${isabEk}` +
                  ` Öğrenci stres altında çalışmaya devam ediyor gibi görünse de gerçek verim dramatik düşüyor.`,
        aksiyon:  `Kaygı yüksekken soru sayısı hedefini askıya alın; önce fizyolojik ve duygusal zemin` +
                  ` stabilize edilmeli. Sakin günlerin bu öğrencinin gerçek kapasitesi olduğunu sayılarla gösterin.`,
        ton: 'urgent', priority: 90, frekans: ykG.length,
      });
    } else if (fark !== null && fark < 0 && ykIsBg.length >= 2 && dkIsBg.length >= 2 && (dkIsab - ykIsab) > 12) {
      // Kaygı altında daha çok çalışıyor ama kalite düşük → mekanik savunma
      insights.push({
        etiket:   'Mekanik Savunma — Sayıyla Kaygı Bastırma',
        teshis:   `Kaygı yüksek günlerde ${r0(ykSoru)} soru (sakin günlerde ${r0(dkSoru)}).` +
                  ` Daha fazla çalışıyor ama isabet kaygılı günlerde %${r0(ykIsab)}, sakin günlerde %${r0(dkIsab)}.` +
                  ` Soru hacmi artıyor çünkü çalışmak kaygıyı örtmek için kullanılıyor — öğrenmek için değil.`,
        aksiyon:  `Soru sayısına değil isabet oranına odaklanın. Bu öğrencide "çok çalışmak" çözüm değil` +
                  ` semptom. Önce kaygıyı düşürün, hacim kendiliğinden kaliteye döner.`,
        ton: 'urgent', priority: 86, frekans: ykG.length,
      });
    } else if (fark !== null && fark >= 0 && fark < 30 && ykG.length >= 2) {
      positives.push({
        etiket: 'Kaygıya Rağmen Sürdürülen Üretim',
        teshis: `Yüksek kaygı günlerinde soru ort. ${r0(ykSoru)}, düşük kaygı günlerinde ${r0(dkSoru)}.` +
                ` Fark mevcut ama öğrenci büyük ölçüde üretimini koruyabiliyor — klinik dayanıklılık sinyali.`,
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  // MODÜL 2 — FİZYOLOJİK YÜK
  // ════════════════════════════════════════════════════════════
  function _modFizyolojik(gunler, kron, insights, positives, donem) {
    const uG = gunler.filter(d => d.uyku > 0);
    if (uG.length < 2) return;

    const yetersiz = uG.filter(d => d.uyku < 6.5);
    const pct      = r0(yetersiz.length / uG.length * 100);
    const ortU     = r1(uG.reduce((a, d) => a + d.uyku, 0) / uG.length);

    // Ardışık yetersiz uyku
    let maxArd = 0, suan = 0;
    kron.forEach(d => {
      if (d.uyku > 0 && d.uyku < 6.5) { suan++; maxArd = Math.max(maxArd, suan); }
      else if (d.uyku > 0) suan = 0;
    });

    if (maxArd >= 3) {
      const ortYet = r1(yetersiz.reduce((a, d) => a + d.uyku, 0) / yetersiz.length);
      insights.push({
        etiket:   'Kümülatif Uyku Borcu — Bilişsel Çöküş Riski',
        teshis:   `${maxArd} ardışık gün uyku 6.5 saatin altında (ort. ${ortYet} sa).` +
                  ` Bu sürede beyin glimfatik temizleme yapamıyor; öğrenilen bilgiler kalıcı belleğe geçemiyor.` +
                  ` Kümülatif borç bir gecede ödenmez — her geçen gün birikim katlanıyor.`,
        aksiyon:  `Acil öncelik: 2 ardışık 8+ saatlik uyku. Bundan önce eklenen yeni konu kalıcı olmayacak.` +
                  ` "Az uyu çok çalış" bu öğrencide tamamen ters çalışıyor.`,
        ton: 'crisis', priority: 95, frekans: maxArd,
      });
    } else if (pct >= 40) {
      insights.push({
        etiket:   'Kronik Uyku Yetersizliği',
        teshis:   `Uyku verisi olan günlerin %${pct}'inde uyku 6.5 saatin altında` +
                  ` (${yetersiz.length}/${uG.length} gün). Tek seferlik değil, kronik örüntü.` +
                  ` Dönem ort. ${ortU} sa — ideal eşik 7.5-8.5 sa.`,
        aksiyon:  `Uyku düzeni akademik çalışma kadar takip edilmeli. Haftalık görüşmede uyku verisi soru verisiyle aynı öncelikte ele alın.`,
        ton: 'urgent', priority: 80, frekans: yetersiz.length,
      });
    } else if (uG.length >= 4 && pct < 15) {
      positives.push({
        etiket: 'Uyku Düzeni Yeterli',
        teshis: `${donem} ortalama uyku ${ortU} sa — öğrenme konsolidasyonu için kritik eşiğin üzerinde.` +
                ` Bu düzen devam ederse çalışmaların kalıcılığı güvende.`,
      });
    }

    // Adrenalin maskesi: düşük uyku + yüksek enerji
    const adrGun = yetersiz.filter(d => d.enerji >= 7 && d.soru > 0);
    if (adrGun.length >= 2) {
      insights.push({
        etiket:   'Adrenalin Maskesi — Yanıltıcı Enerji',
        teshis:   `${adrGun.length} günde uyku 6.5 sa altında ama enerji 7+/10.` +
                  ` Kortizol geçici enerji sağlıyor; hata denetim mekanizması devre dışı.` +
                  ` Bu günlerde çalışılan materyal hatalı kodlanmış olabilir.`,
        aksiyon:  `Bu günlerde yeni konu yerine tekrar öner. Yüksek enerji hissi öğrenme kalitesini garanti etmiyor.`,
        ton: 'empathetic', priority: 65, frekans: adrGun.length,
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  // MODÜL 3 — AKADEMİK TEMPO TRENDİ
  // ════════════════════════════════════════════════════════════
  function _modTempo(kron, iy, sy, insights, positives, isAylik, donem, _lgsGun) {
    if (iy.length < 2 || sy.length < 2) return;

    const iySoru   = fnOrt(iy, 'soru');
    const sySoru   = fnOrt(sy, 'soru');
    const iyKaygi  = fnOrt(iy, 'kaygi');
    const syKaygi  = fnOrt(sy, 'kaygi');
    const iyEnerji = fnOrt(iy, 'enerji');
    const syEnerji = fnOrt(sy, 'enerji');

    // Akademik düşüş
    if (iySoru !== null && sySoru !== null && iySoru > 5) {
      const soruD = pctFark(sySoru, iySoru);
      if (soruD !== null && soruD <= -25) {
        const kaygiFak = (iyKaygi !== null && syKaygi !== null && syKaygi > iyKaygi + 1)
          ? ` Aynı dönemde kaygı da ${r1(iyKaygi)}'den ${r1(syKaygi)}'e yükseldi.` : '';
        const enerjiFak = (iyEnerji !== null && syEnerji !== null && iyEnerji - syEnerji > 1)
          ? ` Enerji ${r1(iyEnerji)}'den ${r1(syEnerji)}'e düştü.` : '';
        insights.push({
          etiket:   'Akademik İrtifa Kaybı',
          teshis:   `${isAylik ? 'Ayın' : 'Haftanın'} ilk yarısında günlük ort. ${r0(iySoru)} soru;` +
                    ` ikinci yarıda ${r0(sySoru)} — %${Math.abs(soruD)} düşüş.` +
                    `${kaygiFak}${enerjiFak}` +
                    ` ${_lgsGun} gün kala bu tablo kritik hâle geliyor.`,
          aksiyon:  `Düşüşün kökeni araştırılmalı: fizyolojik yük mü, dışsal faktör mü, motivasyon mu?` +
                    ` Bir sonraki görüşmede öğrenciye doğrudan sor.`,
          ton: 'urgent', priority: 85, frekans: sy.length,
        });
      } else if (soruD !== null && soruD >= 20) {
        positives.push({
          etiket: 'Yükselen Tempo',
          teshis: `${isAylik ? 'Ay' : 'Hafta'} boyunca ivme artıyor: ilk yarı ort. ${r0(iySoru)} soru/gün,` +
                  ` ikinci yarı ${r0(sySoru)} — %${soruD} artış. Sürdürülebilir olduğu sürece güçlü sinyal.`,
        });
      }
    }

    // Kaygı tırmanması
    if (iyKaygi !== null && syKaygi !== null && syKaygi > iyKaygi + 1.5) {
      insights.push({
        etiket:   'Dönem İçi Kaygı Tırmanması',
        teshis:   `Kaygı ${donem} boyunca yükseliyor: ilk yarı ort. ${r1(iyKaygi)}/10,` +
                  ` ikinci yarı ${r1(syKaygi)}/10 — ${r1(syKaygi - iyKaygi)} puanlık artış.` +
                  ` ${_lgsGun} gün kala bu tırmanma sınav günü performansını doğrudan etkiler.`,
        aksiyon:  `Kaygı yönetimi seansı öncelik. LGS tarihi sabit, kaygı değişken — onu yönetmek akademik çalışma kadar stratejik.`,
        ton: 'urgent', priority: 88, frekans: sy.length,
      });
    }

    // Enerji çöküşü
    if (iyEnerji !== null && syEnerji !== null && iyEnerji - syEnerji >= 2) {
      insights.push({
        etiket:   'Tükenmişlik Eşiği — Enerji Çöküşü',
        teshis:   `Enerji ${isAylik ? 'ay' : 'hafta'} boyunca düşüyor: ilk yarı ort. ${r1(iyEnerji)}/10,` +
                  ` ikinci yarı ${r1(syEnerji)}/10. Biyolojik rezervler tükeniyor.`,
        aksiyon:  `Mevcut tempo sürdürülemez. Yük azaltılmadan enerji yenilenmez; enerji yenilenmeden tempo artırılamaz.`,
        ton: 'urgent', priority: 82, frekans: sy.length,
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  // MODÜL 4 — BRANŞ KAÇINMASI
  // ════════════════════════════════════════════════════════════
  function _modBrans(gunler, dHataArr, insights, positives, donem) {
    if (dHataArr.length < 1) return;

    const enZayif = dHataArr[0];
    const enGuclu = dHataArr[dHataArr.length - 1];
    const toplamQ = dHataArr.reduce((a, d) => a + d.q, 0);
    const zayifPay = r0(enZayif.q / Math.max(toplamQ, 1) * 100);

    if (enZayif.hata >= 40 && zayifPay < 15 && dHataArr.length >= 2) {
      insights.push({
        etiket:   `Branş Kaçınması — ${enZayif.d}`,
        teshis:   `${enZayif.d} hata oranı %${r0(enZayif.hata)} (${enZayif.q} soruda).` +
                  ` Ama toplam çalışmanın yalnızca %${zayifPay}'i bu derse ayrılmış.` +
                  ` Ders ne kadar zor olursa o kadar az çalışılıyor — kaçınma döngüsü aktif.`,
        aksiyon:  `${enZayif.d} için günlük minimum kota: 10-15 soru, başka bir şey değil.` +
                  ` Düşük tut, kademeli artır. Kaçınma kırılmadan bu branş LGS'de boşluk olmaya devam eder.`,
        ton: 'directive', priority: 82, frekans: 0,
      });
    } else if (enZayif.hata >= 35 && enZayif.q >= 20) {
      insights.push({
        etiket:   `${enZayif.d} — Yüksek Hata Yoğunluğu`,
        teshis:   `${enZayif.d} hata oranı %${r0(enZayif.hata)} (${enZayif.q} soru).` +
                  ` Her yanlış doğruyu 0.25 kez eritiyor; bu oran LGS netini ciddi baskılıyor.`,
        aksiyon:  `Hata analizi yapılmadan yeni soru çözme verimini artırmaz.` +
                  ` Yanlış soruları konu bazlı gruplandır; kaynak konuyu bul, orayı kapat.`,
        ton: 'rational', priority: 75, frekans: 0,
      });
    }

    if (dHataArr.length >= 2 && enGuclu.d !== enZayif.d && enGuclu.hata < 20 && enGuclu.q >= 30) {
      positives.push({
        etiket: `${enGuclu.d} — Güçlü Alan Tescili`,
        teshis: `${enGuclu.d} isabet %${r0(100 - enGuclu.hata)} (${enGuclu.q} soru).` +
                ` Bu branş LGS'de net üretim kapısı. Güç bu alanda korunurken enerji zayıf alanlara kaydırılmalı.`,
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  // MODÜL 5 — MEKANİK ÇALIŞMA
  // ════════════════════════════════════════════════════════════
  function _modMekanik(gunler, insights, donem) {
    const mekGun = gunler.filter(d => d.soru > 0 && d.kaygi >= 7 && d.odak > 0 && d.odak < 5);
    if (mekGun.length < 2) return;

    const ortSoru = r0(mekGun.reduce((a, d) => a + d.soru, 0) / mekGun.length);
    const digerG  = gunler.filter(d => d.soru > 0 && !(d.kaygi >= 7 && d.odak > 0 && d.odak < 5));
    const digerS  = digerG.length > 0 ? r0(digerG.reduce((a, d) => a + d.soru, 0) / digerG.length) : null;

    const mekIsabG = mekGun.filter(d => d.hataOrani !== null);
    const mekIsab  = mekIsabG.length
      ? r0(100 - mekIsabG.reduce((a, d) => a + d.hataOrani, 0) / mekIsabG.length) : null;

    const isabEk = mekIsab !== null ? `, isabet %${mekIsab}` : '';
    const digerEk = digerS !== null ? ` Odaklı günlerde ort. ${digerS} soru.` : '';

    insights.push({
      etiket:   'Mekanik Savunma Çalışması',
      teshis:   `${mekGun.length} günde yüksek kaygı (7+/10) + düşük odak (5-/10) eşzamanlı:` +
                ` ort. ${ortSoru} soru${isabEk}.${digerEk}` +
                ` Bu çalışma öğrenmek için değil kaygıyı bastırmak için yapılan mekanik aktivitedir.` +
                ` Soru sayısı yüksek görünse de bellek kodlaması son derece zayıf.`,
      aksiyon:  `"Bugün çalışmak zorunda değilsin, 20 dakika yürüyelim" bu günlerde daha değerli.` +
                ` Mekanik çalışma enerji tüketir, kalıcı öğrenme üretmez.`,
      ton: 'empathetic', priority: 78, frekans: mekGun.length,
    });
  }

  // ════════════════════════════════════════════════════════════
  // MODÜL 6 — EKRAN GÖLGE ÇAPRAZLAMASI
  // ════════════════════════════════════════════════════════════
  function _modEkran(gunler, insights, donem) {
    const ekrGun = gunler.filter(d => d.sosyal > 0);
    if (ekrGun.length < 3) return;

    const yukG = ekrGun.filter(d => d.sosyal >= 2);
    const dukG = ekrGun.filter(d => d.sosyal < 1);
    if (yukG.length < 2 || dukG.length < 1) return;

    const ySoru = r0(yukG.reduce((a, d) => a + d.soru, 0) / yukG.length);
    const dSoru = r0(dukG.reduce((a, d) => a + d.soru, 0) / dukG.length);
    if (!dSoru || dSoru === 0) return;

    const fark = pctFark(dSoru, ySoru);
    if (fark !== null && fark >= 30) {
      insights.push({
        etiket:   'Dijital Gölge — Ekran × Üretim',
        teshis:   `Sosyal medya 2+ saat olan ${yukG.length} günde günlük soru ort. ${ySoru};` +
                  ` 1 saatin altında olan ${dukG.length} günde ${dSoru}.` +
                  ` %${fark} fark. Ekran süresi doğrudan akademik kapasiteyi aşındırıyor.`,
        aksiyon:  `Bu veriyi öğrenciye gösterin — hiçbir söz bu kadar ikna edici değil.` +
                  ` Günlük ekran üst limiti belirleyin; çalışma öncesi 15 dk ekransız başlangıç deneyin.`,
        ton: 'rational', priority: 70, frekans: yukG.length,
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  // MODÜL 7 — DUYGUSAL ÖRÜNTÜ
  // ════════════════════════════════════════════════════════════
  function _modDuygu(gunler, kron, insights, positives, donem) {
    // Mood tipleri — student_analysis.js moodOptions.tip ile senkron
    const negMoodlar = ['sad', 'anxious', 'tired'];
    const ntrMoodlar = ['ok'];
    const pozMoodlar = ['good', 'great'];
    const moodGun    = gunler.filter(d => !!d.mood);
    if (moodGun.length < 3) return;

    const negGun = moodGun.filter(d => negMoodlar.includes(d.mood));
    const negPct = r0(negGun.length / moodGun.length * 100);

    // Ardışık negatif gün
    let maxArdNeg = 0, suNeg = 0;
    kron.filter(d => !!d.mood).forEach(d => {
      if (negMoodlar.includes(d.mood)) { suNeg++; maxArdNeg = Math.max(maxArdNeg, suNeg); }
      else suNeg = 0;
    });

    const moodTrTablo = { anxious: 'Kaygılı', tired: 'Yorgunum', sad: 'Mutsuzum' };
    const negIsimler = [...new Set(negGun.map(d => moodTrTablo[d.mood]).filter(Boolean))].join('/');

    if (maxArdNeg >= 3) {
      insights.push({
        etiket:   `Kronik Duygusal Yük — ${maxArdNeg} Gün Kesintisiz`,
        teshis:   `${maxArdNeg} gün üst üste olumsuz duygu durumu (${negIsimler || 'olumsuz'}).` +
                  ` Tek seferlik stres değil, biriken ve normalleşen yük.` +
                  ` Bu kadar süren olumsuz duygu durumu akademik motivasyonu zemin düzeyinde etkiliyor.`,
        aksiyon:  `Akademik konular önce değil. "Geçen ${maxArdNeg} günde ne yaşadın?" sorusuyla başla.` +
                  ` Duygusal boşalma olmadan akademik ilerleme yüzeysel kalır.`,
        ton: 'empathetic', priority: 88, frekans: maxArdNeg,
      });
    } else if (negPct >= 50) {
      insights.push({
        etiket:   'Baskın Negatif Duygu Örüntüsü',
        teshis:   `Duygu verisi olan ${moodGun.length} günün %${negPct}'i olumsuz (${negGun.length} gün: ${negIsimler || 'olumsuz'}).` +
                  ` ${donem.charAt(0).toUpperCase() + donem.slice(1)} genel tonu ağır.`,
        aksiyon:  `Küçük zafer anlarını birlikte bul ve tescil et. Olumlu günlerin ne farklı kıldığını öğrenciye sor — bu kalıplar tekrarlanabilir.`,
        ton: 'empathetic', priority: 72, frekans: negGun.length,
      });
    }

    // Duygusal kapanma: olumlu alanda negatif içerik
    const kapGun = gunler.filter(d => {
      const poz = (d.pozitif || '').toLowerCase();
      if (!poz) return false;
      return ['hatırlamıyorum', 'hatırlamıyor', 'yok', 'hiçbir', 'bilmiyorum', 'aklıma gelmiyor'].some(k => poz.includes(k));
    });
    if (kapGun.length > 0) {
      insights.push({
        etiket:   'Duygusal Kapanma',
        teshis:   `${kapGun.length} günde öğrenci olumlu alanda "hatırlamıyorum" veya "yok" yazmış.` +
                  ` Olumlu hiçbir şey görememek ya da görmek istememek — klinik depresif belirtilerle örtüşen bir sinyal.`,
        aksiyon:  `Bu günleri görüşmede özellikle ele alın. "O gün en küçük iyi şey ne olabilirdi?" sorusu kapı aralayabilir.` +
                  ` Tekrarlanıyorsa uzman desteği değerlendirilebilir.`,
        ton: 'empathetic', priority: 68, frekans: kapGun.length,
      });
    }

    // Pozitif: iyi duygu oranı
    if (negPct < 30 && moodGun.length >= 4) {
      positives.push({
        etiket: 'Duygusal Denge',
        teshis: `${moodGun.length} günlük duygu verisinin %${100 - negPct}'i olumlu ya da nötr.` +
                ` Psikolojik zemin stabil — bu denge akademik çalışmayı doğrudan destekliyor.`,
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  // MODÜL 8 — UYKU-ERTESİ GÜN KORELASYONU
  // ════════════════════════════════════════════════════════════
  function _modUykuErtesi(kron, insights, donem) {
    if (kron.length < 4) return;

    let iyi = [], kotu = [];
    for (let i = 0; i < kron.length - 1; i++) {
      const d = kron[i], s = kron[i + 1];
      if (d.uyku > 0 && s.soru > 0) {
        if (d.uyku >= 7.5) iyi.push(s.soru);
        else if (d.uyku < 6.5) kotu.push(s.soru);
      }
    }
    if (iyi.length < 2 || kotu.length < 2) return;

    const iyiOrt = r0(iyi.reduce((a, v) => a + v, 0) / iyi.length);
    const kotuOrt = r0(kotu.reduce((a, v) => a + v, 0) / kotu.length);
    const fark = iyiOrt > 0 ? pctFark(iyiOrt, kotuOrt) : null;

    if (fark !== null && fark >= 30) {
      insights.push({
        etiket:   'Uyku → Ertesi Gün Üretim Bağlantısı',
        teshis:   `7.5+ sa uyku sonrası günlerde soru ort. ${iyiOrt};` +
                  ` 6.5 sa altı uyku sonrası günlerde ${kotuOrt}.` +
                  ` Fark %${fark}. Bu öğrencide uyku düzeni bir sonraki günü doğrudan şekillendiriyor.`,
        aksiyon:  `"Yarın çok çalışacaksın" demek yerine "Bu gece 8 saat uyu" deyin — veriye göre ikincisi daha etkili.`,
        ton: 'informative', priority: 62, frekans: iyi.length + kotu.length,
      });
    }
  }

  // ── TREND ─────────────────────────────────────────────────
  function _hesaplaTrend(iy, sy) {
    const a = fnOrt(iy, 'soru'), b = fnOrt(sy, 'soru');
    if (a === null || b === null || a === 0) return 'stabil';
    const f = (b - a) / a;
    return f > 0.15 ? 'yukselis' : f < -0.15 ? 'dusus' : 'stabil';
  }

  function _trendAnlatisi(trend, iy, sy, isAylik) {
    const a = fnOrt(iy, 'soru'), b = fnOrt(sy, 'soru');
    if (a === null || b === null) return '';
    const donem = isAylik ? 'Ay' : 'Hafta';
    if (trend === 'yukselis')
      return `${donem} boyunca yükselen ivme: ilk yarıda ort. ${r0(a)} soru/gün, ikinci yarıda ${r0(b)}.`;
    if (trend === 'dusus')
      return `${donem} boyunca düşen tempo: ilk yarıda ort. ${r0(a)} soru/gün, ikinci yarıda ${r0(b)}.`;
    return `${donem} boyunca stabil tempo: ${r0(a)}-${r0(b)} soru/gün bandında.`;
  }

  // ════════════════════════════════════════════════════════════
  // MODUL 9 — SISTEMDEN KOPUS SINYALI
  // ════════════════════════════════════════════════════════════
  function _modKopus(toplamGun, aktifGun, bosDays, bosSeriler, sonBosSeri, aktifOran, insights, period) {
    if (toplamGun <= 1) return; // gunluk raporda anlamsiz

    const donem = period === 'aylik' ? 'bu ay' : 'bu hafta';

    // 1. Donem sonunda uzun kopus — EN YUKSEK ONCELIK
    if (sonBosSeri >= 5) {
      insights.push({
        etiket:  'Sistemden Kopus — Son ' + sonBosSeri + ' Gun Veri Yok',
        teshis:  'Donemin son ' + sonBosSeri + ' gunu hic veri girilmemis. Bu artik unutma degil, sistemden veya takip surecinden aktif kopus sinyalidir.',
        aksiyon: 'Bir sonraki koc gorusmesi bu kopusu dogrudan ve yargisizca ele almali. "Son gunlerde nasil hissediyorsun?" ile basla.',
        ton: 'crisis', priority: 99, frekans: sonBosSeri,
      });
    } else if (sonBosSeri >= 3) {
      insights.push({
        etiket:  'Son ' + sonBosSeri + ' Gun Sessizlik',
        teshis:  'Donemin son ' + sonBosSeri + ' gunu veri girilmemis. Kisa kopus — ama yogun donemde dikkat gerektiriyor.',
        aksiyon: 'Koc gorusmesinde bu surece kisaca degin; baski uygulamadan neden sorulabilir.',
        ton: 'urgent', priority: 90, frekans: sonBosSeri,
      });
    }

    // 2. Genel aktiflik orani cok dusuk
    if (aktifOran < 0.33 && bosDays >= 3) {
      const pct = Math.round(aktifOran * 100);
      insights.push({
        etiket:  'Dusuk Katilim — ' + toplamGun + ' Gunun ' + bosDays + "'i Bos",
        teshis:  donem.charAt(0).toUpperCase() + donem.slice(1) + ' ' + aktifGun + '/' + toplamGun + ' gunde veri girildi (%' + pct + '). Veri girisi yapilmayan gunler gorunmez risk tasir — o gunlerde ne yasandigi bilinmiyor.',
        aksiyon: 'Koc gorusmesinde once bu boslugu ele al. "Girilmeyen gunlerde ne oldu?" sorusu, akademik konularin onunde gelmeli.',
        ton: 'urgent', priority: 88, frekans: bosDays,
      });
    }

    // 3. Icinde uzun seriler var mi (donem sonu haric)
    bosSeriler.forEach(function(seri) {
      if (seri.uzunluk < 4) return;
      if (sonBosSeri >= 3 && insights.find(function(i) { return i.etiket && i.etiket.indexOf('Sistemden Kopus') >= 0; })) return;
      insights.push({
        etiket:  seri.uzunluk + ' Gunluk Veri Boslugu (' + seri.baslangic + ')',
        teshis:  seri.baslangic + ' tarihinde baslayan ' + seri.uzunluk + ' gunluk veri boslugu. Bu kadar suren kopus tek basina risk sinyali.',
        aksiyon: 'Koc gorusmesinde bu donem kisaca sorgulanmali; ogrenciye ne yasadigini anlat firsati ver.',
        ton: 'urgent', priority: 78, frekans: seri.uzunluk,
      });
    });
  }

})();
