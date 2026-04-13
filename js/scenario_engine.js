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

  // Çalışma süresi kalibrasyonu
  const sureV = gunler14.filter(d => d.sure > 0).map(d => d.sure);
  const sureOrt = sureV.length ? sureV.reduce((a,b)=>a+b,0)/sureV.length : 60;
  const sureSd  = sureV.length > 1
    ? Math.sqrt(sureV.reduce((a,b)=>a+Math.pow(b-sureOrt,2),0)/sureV.length)
    : sureOrt * 0.3;

  // Dijital süre kalibrasyonu
  const dijV = gunler14.filter(d => d.sosyal > 0).map(d => d.sosyal);
  const dijOrt = dijV.length ? dijV.reduce((a,b)=>a+b,0)/dijV.length : 1.5;
  const dijSd  = dijV.length > 1
    ? Math.sqrt(dijV.reduce((a,b)=>a+Math.pow(b-dijOrt,2),0)/dijV.length)
    : dijOrt * 0.3;

  // Mood puan kalibrasyonu
  const _mp = { 'great':5, 'good':4, 'ok':3, 'bad':2, 'sad':1 };
  const moodV = gunler14.filter(d => d.mood).map(d => _mp[d.mood] || 3);
  const moodOrt = moodV.length ? moodV.reduce((a,b)=>a+b,0)/moodV.length : 3;

  // İsabet oranı kalibrasyonu
  const isabetV = gunler14.filter(d => d.hataOrani !== null && d.soru > 0).map(d => 100 - d.hataOrani);
  const isabetOrt = isabetV.length ? isabetV.reduce((a,b)=>a+b,0)/isabetV.length : 70;
  const isabetSd  = isabetV.length > 1
    ? Math.sqrt(isabetV.reduce((a,b)=>a+Math.pow(b-isabetOrt,2),0)/isabetV.length)
    : 10;

  return {
    soru:          { ort: soruOrt, sd: soruSd, yuksek: soruOrt + soruSd, dusuk: Math.max(soruOrt - soruSd, 10) },
    kaygi:         fn(gunler14, 'kaygi')  || { ort: 5,   sd: 1.5, yuksek: 6.5,  dusuk: 3.5 },
    uyku:          fn(gunler14, 'uyku')   || { ort: 7,   sd: 0.8, yuksek: 8,    dusuk: 6   },
    enerji:        fn(gunler14, 'enerji') || { ort: 6,   sd: 1.5, yuksek: 7.5,  dusuk: 4.5 },
    odak:          fn(gunler14, 'odak')   || { ort: 6,   sd: 1.5, yuksek: 7.5,  dusuk: 4.5 },
    sosyal:        fn(gunler14, 'sosyal') || { ort: 1.5, sd: 0.8, yuksek: 2.3,  dusuk: 0.5 },
    isabet:        { ort: isabetOrt, sd: isabetSd, yuksek: isabetOrt + isabetSd, dusuk: Math.max(isabetOrt - isabetSd, 20) },
    calismaSuresi: { ort: sureOrt, sd: sureSd, yuksek: sureOrt + sureSd, dusuk: Math.max(sureOrt - sureSd, 10) },
    dijital:       { ort: dijOrt, sd: dijSd, yuksek: dijOrt + dijSd, dusuk: Math.max(dijOrt - dijSd, 0) },
    mood:          { ort: moodOrt },
    zayifBransSoru: { dusuk: soruOrt * 0.1, ort: soruOrt * 0.2, yuksek: soruOrt * 0.3 },
  };
}

// ── SENARYO HAVUZU ───────────────────────────────────
// Her senaryo: { id, modul, priority, tetikle(bugun, hafta, ay, kal), cikti }
// tetikle() → true/false
// kal = kalibre() sonucu

const SENARYOLAR = [

  // ══════════════════════════════════════════════
  // MODÜL 1: KRİZ VE BİLİŞSEL ONARIM
  // ══════════════════════════════════════════════

  {
    id: 'DYN-01', modul: 1, priority: 95, etiket: 'Toksik Yüklenme',
    tetikle: (b, h, a, k) => b.kaygi >= k.kaygi.yuksek && b.soru >= k.soru.yuksek,
    cikti: {
      daily:   { teshis: 'Akut Kaygı Altında Yüklenme.', aksiyon: 'Bugün akademik baskıyı sıfırlayın; sadece dünkü hataları analiz ettirin.' },
      weekly:  { teshis: 'Kaygılı Çaba Eğilimi: Başarıyı stresle satın alma trendi.', aksiyon: 'Haftalık görüşmede netlere değil, çalışma huzuruna odaklanın.' },
      aylik : { teshis: 'Kronik Performans Anksiyetesi.', aksiyon: 'Gelecek ay stratejisini duygusal onarım üzerine kurun.' },
      ton: 'urgent'
    }
  },
  {
    id: 'DYN-04', modul: 1, priority: 98, etiket: 'Akut Blokaj',
    tetikle: (b, h, a, k) => b.kaygi >= k.kaygi.yuksek && b.soru <= k.soru.dusuk,
    cikti: {
      daily:   { teshis: 'Duygusal Felç: Kaygı sistemi durdurmuş.', aksiyon: 'Görevleri iptal edin, sadece moral görüşmesi yapın.' },
      weekly:  { teshis: 'Süreçten Kopma Haftası.', aksiyon: 'Planı Mikro Hedeflerle (günde 10-20 soru) resetleyin.' },
      aylik : { teshis: 'Akademik Yıkım Riski.', aksiyon: 'Hedefleri revize edin; baskıyı tamamen kaldırın.' },
      ton: 'urgent'
    }
  },
  {
    id: 'DYN-05', modul: 1, priority: 92, etiket: 'Sessiz Kaygı',
    tetikle: (b, h, a, k) => b.kaygi >= k.kaygi.yuksek && b.soru < k.soru.ort,
    cikti: {
      daily:   { teshis: 'Gizli Baskı: Kaygı üretimi yavaşlatmış.', aksiyon: 'Öğrenciyle bugünkü moral durumu üzerine 5 dakikalık kısa bir görüşme yapın.' },
      weekly:  { teshis: 'Akademik Patinaj: Kaygı nedeniyle ilerleme durma noktasında.', aksiyon: 'Haftalık programı hafifletip moral verici konular ekleyin.' },
      aylik : { teshis: 'İçsel Blokaj Karakteristiği.', aksiyon: 'Öğrencinin sınav algısını değiştirecek rehberlik çalışmaları planlayın.' },
      ton: 'warning'
    }
  },
  {
    id: 'DYN-10', modul: 1, priority: 88, etiket: 'Motivasyonel Dalgalanma',
    tetikle: (b, h, a, k) => ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'sad') && b.soru < k.soru.dusuk && h.soruHedefiKarsilama < 0.5,
    cikti: {
      daily:   { teshis: 'Düşük Enerji ve İsteksizlik.', aksiyon: 'Zorunlu hedefleri bugünlük askıya alın; sevdiği bir branştan 1 test çözmesini isteyin.' },
      weekly:  { teshis: 'Süreçten Kopuş Sinyalleri.', aksiyon: 'Görüşmede "Neden LGS?" sorusunu tekrar gündeme getirin.' },
      aylik : { teshis: 'Hedeften Uzaklaşma Eğilimi.', aksiyon: 'Öğrencinin hayalindeki liseyi odağa alan bir vizyon çalışması yapın.' },
      ton: 'warning'
    }
  },
  {
    id: 'DYN-20', modul: 1, priority: 90, etiket: 'Krizden Çıkış',
    tetikle: (b, h, a, k) => a.son3GunKaygiOrt < (k.kaygi.ort * 0.8) && b.soru >= k.soru.ort,
    cikti: {
      daily:   { teshis: 'Duygusal Toparlanma: Stres yönetimi bugün başarılı.', aksiyon: 'Bu kararlılığı fark ettiğinizi belirten pozitif bir mesaj gönderin.' },
      weekly:  { teshis: 'Pozitif Değişim Trendi: Kriz geride kalıyor.', aksiyon: 'Öğrenciyi tebrik edin; normal tempoya geçin.' },
      aylik : { teshis: 'Psikolojik Sağlamlık Artışı.', aksiyon: 'Öğrencinin kriz yönetim becerisini başarısının temeli olarak not edin.' },
      ton: 'positive'
    }
  },
  

  // ══════════════════════════════════════════════
  // MODÜL 2: AKADEMİK KAÇINMA VE SAVUNMA
  // ══════════════════════════════════════════════

  {
    id: 'DYN-41', modul: 2, priority: 85, etiket: 'Branş Gettosu',
    tetikle: (b, h, a, k) =>
      b.soru > k.soru.ort &&
      h.soruHedefiKarsilama >= 0.4 &&
      b.bransAnalizi.zayifBransSoru <= k.zayifBransSoru.dusuk,
    cikti: {
      daily:   { teshis: 'Konfor Alanı: Bugün sadece başarılı olunan branşlara odaklanılmış.', aksiyon: 'Yarına en az 1 testlik zayıf branş zorunluluğu ekleyin.' },
      weekly:  { teshis: 'Sistematik Branş Dışlama: Bu hafta zor derslerden kaçış kronikleşmiş.', aksiyon: 'Programda Önce Zor Olanı Yap kuralını işletin.' },
      aylik : { teshis: 'Gelişimi Engelleyen Konfor Bağımlılığı.', aksiyon: 'Zayıf branş kotalarını sabitleyin ve koç denetiminde çözülmesini sağlayın.' },
      ton: 'warning'
    }
  },
  {
    id: 'DYN-45', modul: 2, priority: 82, etiket: 'Nicelik Tuzağı',
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.yuksek &&
      h.soruHedefiKarsilama >= 0.7 &&
      b.isabet !== null &&
      b.isabet < k.isabet.dusuk,
    cikti: {
      daily:   { teshis: 'Yüzeysel Çözüm: Soru sayısı fazla ama öğrenme kalitesi düşük.', aksiyon: 'Bugün yeni soru vermeyin; yanlış yapılan soruların mantığını sorgulayın.' },
      weekly:  { teshis: 'Hız Tuzağı: Bu hafta nicelik niteliğin önüne geçmiş.', aksiyon: 'Haftalık hedefi soru sayısından doğru sayısına kaydırın.' },
      aylik : { teshis: 'Mekanik Çalışma Karakteri: Öğrenci sadece soru eritiyor.', aksiyon: 'Deneme sınavlarıyla sahte özgüveni test edin.' },
      ton: 'warning'
    }
  },
  {
    id: 'DYN-55', modul: 2, priority: 88, etiket: 'Analizden Kaçış',
    tetikle: (b, h, a, k) =>
      b.hataOrani !== null &&
      b.hataOrani >= 35 &&
      b.konuSure < 10,
    cikti: {
      daily:   { teshis: 'Hata Körlüğü: Yanlışlar incelenmeden kapatılmış.', aksiyon: 'Bugünkü yanlışların video çözümlerini izletmeden günü bitirmeyin.' },
      weekly:  { teshis: 'Sistematik Analiz İhmali: Hatalardan ders çıkarma süreci durmuş.', aksiyon: 'Haftalık görüşmede Hata Defteri üzerinden çapraz sorgu yapın.' },
      aylik : { teshis: 'Gelişim Durması Riski: Yanlışlarından kaçma karakteri.', aksiyon: 'Analiz yapılmayan çalışmaları sistemde geçersiz sayın.' },
      ton: 'urgent'
    }
  },
  {
    id: 'DYN-62', modul: 2, priority: 70, etiket: 'Atıl Masa Mesaisi',
    tetikle: (b, h, a, k) =>
      b.calismaSuresi >= k.calismaSuresi.yuksek &&
      b.soru <= k.soru.dusuk &&
      h.soruHedefiKarsilama < 0.4,
    cikti: {
      daily:   { teshis: 'Pasif Direnç: Masada kalınmış ama üretim yapılmamış.', aksiyon: 'Çalışma ortamındaki uyaran sızıntılarını sorgulayın.' },
      weekly:  { teshis: 'Odaklanma Erozyonu: Masa süresi verime dönüşmüyor.', aksiyon: 'Bu hafta Pomodoro tekniğini zorunlu tutun.' },
      aylik : { teshis: 'Masa Başında Atalet: Çalışıyor imajı var ama zihin süreçte değil.', aksiyon: 'Öğrencinin motivasyon kaynağını veya çalışma ortamını değiştirin.' },
      ton: 'stable'
    }
  },
  {
    id: 'DYN-65', modul: 2, priority: 83, etiket: 'Sayısal Blokaj',
    tetikle: (b, h, a, k) =>
      b.bransAnalizi.sayisalHataOrani !== undefined &&
      b.hataOrani !== null &&
      b.bransAnalizi.sayisalHataOrani > (b.hataOrani * 1.2),
    cikti: {
      daily:   { teshis: 'Sayısal Kaygı: Bugün sayısal branşlarda hata artmış.', aksiyon: 'Sayısal branşlarda soru azaltıp sadece yöntem tekrarı yaptırın.' },
      weekly:  { teshis: 'Sayısal Direnç: Bu hafta sayısal derslerdeki hata kronik artış göstermiş.', aksiyon: 'Haftalık planda sayısal dersleri sabah saatlerine kaydırın.' },
      aylik : { teshis: 'Sayısal Temel Eksikliği: Aylık veriler sayısal branşta bariyer olduğunu kanıtlıyor.', aksiyon: 'Temel seviye kaynaklara geri dönüş planlayın.' },
      ton: 'warning'
    }
  },
  {
    id: 'DYN-68', modul: 2, priority: 81, etiket: 'Sözel Rehavet',
    tetikle: (b, h, a, k) =>
      b.bransAnalizi.sozelIsabet !== undefined &&
      b.bransAnalizi.sozelIsabet > 90 &&
      b.bransAnalizi.sozelSure < 20,
    cikti: {
      daily:   { teshis: 'Sözel Rehavet: Başarı yüksek olduğu için sözel dersler ihmal edilmiş.', aksiyon: 'Her gün en az 20 paragraf sorusunu rutin olarak ekleyin.' },
      weekly:  { teshis: 'Okuma Alışkanlığı Erozyonu: Sözel branşlar çerez olarak geçilmiş.', aksiyon: 'Haftalık denemede sözel dikkati ölçün; rehavet kaynaklı hataları sorgulayın.' },
      aylik : { teshis: 'Sözel Performans Sürüklenmesi: Aylık veride sözel netlerde dalgalanma başlamış.', aksiyon: 'Sözel dersleri analiz gerektiren yeni nesil sorulara yöneltin.' },
      ton: 'stable'
    }
  },

  // ══════════════════════════════════════════════
  // MODÜL 3: ÖZ-YETERLİLİK VE ALGI MAKASI
  // ══════════════════════════════════════════════

  {
    id: 'DYN-76', modul: 3, priority: 88, etiket: 'Zirve Felci',
    tetikle: (b, h, a, k) =>
      b.isabet !== null &&
      b.isabet >= 85 &&
      b.kaygi >= k.kaygi.yuksek,
    cikti: {
      daily:   { teshis: 'Başarı Baskısı: Yüksek netler hata yapma korkusunu tetiklemiş.', aksiyon: 'Bugün netleri övmeyin; sadece çabasının güzelliğinden bahsedin.' },
      weekly:  { teshis: 'Sürdürülebilirlik Kaygısı: Her başarı öğrenciye hep böyle yapmalısın yükü bindirmiş.', aksiyon: 'Haftalık görüşmede odağı sınavdan çıkarıp sevdiği bir hobiye kaydırın.' },
      aylik : { teshis: 'Karakteristik Başarı Fobisi: Potansiyelini tehdit olarak görme eğilimi.', aksiyon: 'Uzun vadeli hedef baskısını azaltıp mikro hedefler verin.' },
      ton: 'warning'
    }
  },
  {
    id: 'DYN-82', modul: 3, priority: 82, etiket: 'Yetersizlik İllüzyonu',
    tetikle: (b, h, a, k) =>
      b.isabet !== null &&
      b.isabet >= k.isabet.ort &&
      ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'sad'),
    cikti: {
      daily:   { teshis: 'Negatif Filtreleme: Başarıya rağmen öğrenci kendini yetersiz hissediyor.', aksiyon: 'Bugün çözdüğü doğru soruları somut kanıt olarak önüne koyun.' },
      weekly:  { teshis: 'Öz-Güven Aşınması: Akademik üretim moral yükseltmeye yetmiyor.', aksiyon: 'Bu hafta sadece ustalaştığı konulardan test vererek yapabiliyorum hissini besleyin.' },
      aylik : { teshis: 'Kronik Düşük Öz-Yeterlilik: Başarıyı sahiplenememe durumu.', aksiyon: 'Küçük galibiyetler stratejisiyle her hafta bir başarı tescili yapın.' },
      ton: 'warning'
    }
  },
  {
    id: 'DYN-90', modul: 3, priority: 75, etiket: 'Sahte Yeterlilik',
    tetikle: (b, h, a, k) =>
      b.isabet !== null &&
      b.isabet <= k.isabet.dusuk &&
      (b.mood === 'great' || (b.mood === 'good' || b.mood === 'great')),
    cikti: {
      daily:   { teshis: 'Hata Körlüğü: Düşük performansa rağmen suni iyimserlik hakim.', aksiyon: 'Yanlış yaptığı 3 kritik soruyu video çözümleriyle inceletin.' },
      weekly:  { teshis: 'Yüzeysel Gelişim: Hataları görmezden gelme trendi.', aksiyon: 'Haftalık analizde netlere değil yanlışların çözüm sürelerine bakın.' },
      aylik : { teshis: 'Suni Özgüven Riski: Gelişimi engelleyen inkar mekanizması.', aksiyon: 'Zor ve objektif bir deneme ile gerçek seviyeyi yüzleştirin.' },
      ton: 'stable'
    }
  },
  {
    id: 'DYN-95', modul: 3, priority: 90, etiket: 'Kırılma Noktası Alarmı',
    tetikle: (b, h, a, k) => a.son3GunMoodPuan < (k.mood.ort * 0.5),
    cikti: {
      daily:   { teshis: 'Duygusal Çöküş: Öğrencinin içsel motivasyonu kırılmış görünüyor.', aksiyon: 'Ders konuşmayın; sadece moral ve destek odaklı sesli mesaj gönderin.' },
      weekly:  { teshis: 'Depresif Süreç: Bu hafta öğrenci süreçten tamamen kopma riskinde.', aksiyon: 'Haftalık planı durdurun ve bir resetleme günü planlayın.' },
      aylik : { teshis: 'Kronik Motivasyon Kaybı.', aksiyon: 'Öğrencinin temel yaşam enerjisini sorgulayın; aileyle görüşün.' },
      ton: 'urgent'
    }
  },
  {
    id: 'DYN-100', modul: 3, priority: 87, etiket: 'Pozitif Kırılma',
    tetikle: (b, h, a, k) =>
      a.son3GunSoruOrt > (k.soru.ort * 1.3) &&
      h.soruHedefiKarsilama >= 0.75 &&
      b.isabet !== null &&
      b.isabet >= k.isabet.ort,
    cikti: {
      daily:   { teshis: 'Sıçrama Günü: Öğrenci kendi limitlerini sağlıklı zorlamış.', aksiyon: 'Bu yüksek performansı tescilleyin; takdir mesajı atın.' },
      weekly:  { teshis: 'Kapasite Artışı: Bu hafta çalışma bandı bir üst seviyeye taşındı.', aksiyon: 'Haftalık hedefleri bu yeni normale göre yukarı revize edin.' },
      aylik : { teshis: 'Akademik Evrim: Öğrenci ay boyunca istikrarlı yükseliş trendine girdi.', aksiyon: 'Başarı grafiğini aileyle paylaşarak motivasyonel ödül planlayın.' },
      ton: 'positive'
    }
  },
  {
    id: 'DYN-102', modul: 3, priority: 89, etiket: 'Negatif Sürüklenme',
    tetikle: (b, h, a, k) =>
      a.son3GunIsabetOrt !== undefined &&
      a.son3GunIsabetOrt < k.isabet.ort &&
      a.son3GunSoruOrt < k.soru.ort &&
      h.soruHedefiKarsilama < 0.5,
    cikti: {
      daily:   { teshis: 'Enerji Kaçağı: Bugün verim ve süre eş zamanlı düşüş göstermiş.', aksiyon: 'Koçluk görüşmesiyle enerjiyi ne emiyor sorusuna yanıt arayın.' },
      weekly:  { teshis: 'İstikrar Kaybı: Bu hafta genel gerileme ve süreçten kopma eğilimi var.', aksiyon: 'Haftalık programı sadeleştirin; yapabildikleri üzerinden geri dönüş hattı kurun.' },
      aylik : { teshis: 'Kronik Düşüş Trendi: Öğrenci sistemden yavaş uzaklaşıyor.', aksiyon: 'Hedefleri ve çalışma ortamını kökten değiştirme vaktiniz gelmiş olabilir.' },
      ton: 'urgent'
    }
  },

  // ══════════════════════════════════════════════
  // MODÜL 4: DİJİTAL KAÇINMA VE ODAK KAYBI
  // ══════════════════════════════════════════════

  {
    id: 'DYN-106', modul: 4, priority: 84, etiket: 'Dopaminerjik Kaçış',
    tetikle: (b, h, a, k) =>
      b.kaygi >= k.kaygi.yuksek &&
      b.dijitalSure >= k.dijital.yuksek,
    cikti: {
      daily:   { teshis: 'Dijital Anestezi: Stres anında ekrana sığınma.', aksiyon: 'Yasak koymayın; stresi tetikleyen dersi bulup yükünü hafifletin.' },
      weekly:  { teshis: 'Kaçış Paterni: Her zorlanma sosyal medya sığınağıyla sonuçlanmış.', aksiyon: 'Haftalık planda ekran süresini akademik blok sonrasına ödül olarak sabitleyin.' },
      aylik : { teshis: 'Kronik Dijital Savunma: Problem çözme kası zayıflamış.', aksiyon: 'Kademeli dijital detoks protokolü başlatın.' },
      ton: 'warning'
    }
  },
  {
    id: 'DYN-113', modul: 4, priority: 78, etiket: 'Parçalanmış Dikkat',
    tetikle: (b, h, a, k) =>
      b.calismaSuresi >= k.calismaSuresi.yuksek &&
      b.soru <= k.soru.dusuk &&
      h.soruHedefiKarsilama < 0.4,
    cikti: {
      daily:   { teshis: 'Yüzeysel Odak: Dikkat dağıtıcılar derinleşmeyi engellemiş.', aksiyon: 'Telefonu çalışma odasının dışına çıkartarak 40 dakikalık tam odak seansı yapın.' },
      weekly:  { teshis: 'Derinleşme Yeteneği Kaybı: Bu hafta hiçbir konuda akış haline geçilememiş.', aksiyon: 'Pomodoro süresini kademeli olarak 25 ten 45 dakikaya zorlayın.' },
      aylik : { teshis: 'Sığ Zihin Alışkanlığı: Zor sorularda kalamama hali.', aksiyon: 'Zihinsel antrenman programı başlatın.' },
      ton: 'warning'
    }
  },

  // ══════════════════════════════════════════════
  // MODÜL 5: FİZYOLOJİK LİMİT VE SÜRDÜRÜLEBİLİRLİK
  // ══════════════════════════════════════════════

  {
    id: 'DYN-126', modul: 5, priority: 96, etiket: 'Bilişsel Borçlanma',
    tetikle: (b, h, a, k) =>
      b.uyku > 0 &&
      b.uyku <= k.uyku.dusuk &&
      b.soru >= k.soru.ort,
    cikti: {
      daily:   { teshis: 'Bilişsel Borç: Uykusuzluğa rağmen sistem zorlanarak çalışılmış.', aksiyon: 'Bugün yeni konu yüklemeyin; sadece dünkü yanlışların analizini yaptırın.' },
      weekly:  { teshis: 'Performans Sürüklenmesi: Başarı sağlıktan borç alınarak sürdürülmüş.', aksiyon: 'Haftalık planda uyku süresini 7 saatin üzerine sabitleyip gece çalışmasını durdurun.' },
      aylik : { teshis: 'Kronik Fizyolojik Aşınma: Tükenmişlik kapıda.', aksiyon: 'Gelecek ayın ilk haftasını Restorasyon Haftası ilan ederek yükü yüzde otuz düşürün.' },
      ton: 'urgent'
    }
  },
  {
    id: 'DYN-134', modul: 5, priority: 99, etiket: 'Pre-Burnout',
    tetikle: (b, h, a, k) =>
      a.son3GunEnerjiOrt <= (k.enerji.ort * 0.6) &&
      a.son3GunMoodPuan  <= (k.mood.ort * 0.6),
    cikti: {
      daily:   { teshis: 'Sistem İflası: Fiziksel ve zihinsel enerji tamamen tükenme noktasında.', aksiyon: 'Acil 24 saatlik mutlak akademik mola verdirin.' },
      weekly:  { teshis: 'Motivasyonel İflas Haftası.', aksiyon: 'Haftalık hedefleri yüzde elli düşürüp öğrenciyi dinlendirin.' },
      aylik : { teshis: 'Akademik Tükenmişlik Teşhisi.', aksiyon: 'Mevcut strateji sürdürülemez; yöntemi aileyle revize edin.' },
      ton: 'urgent'
    }
  },

  {
    id: 'DYN-140', modul: 2, priority: 94, etiket: 'Akademik İrtifa Kaybı',
    // Mood nötr/iyi ama üretim hem geçmişin hem hedefin çok gerisinde
    // DYN-10 ile çakışmaz (o mood kötü ister), DYN-62 ile çakışmaz (o süre yüksek ister)
    tetikle: (b, h, a, k) =>
      b.soru < k.soru.dusuk &&
      h.soruHedefiKarsilama < 0.5 &&
      (b.mood === 'ok' || (b.mood === 'good' || b.mood === 'great') || b.mood === 'great') &&
      b.calismaSuresi < k.calismaSuresi.yuksek,
    cikti: {
      daily:   { teshis: 'Sessiz Üretim Kaybı: Mood iyi ama üretim hem geçmişin hem hedefin çok gerisinde.', aksiyon: 'Çalışmayı engelleyen dış bir faktör olup olmadığını kontrol edin.' },
      weekly:  { teshis: 'Süreklilik Krizi: Bu hafta hedefe ulaşma oranı yüzde ellinin altında; sistemden kopuş başlamış.', aksiyon: 'Haftalık programı başarabileceği seviyeye geçici olarak çekip özgüven tazeleyin.' },
      aylik : { teshis: 'Kronik Hedef Uzaklaşması: Aylık hedef öğrenci için hayali bir rakama dönüşmüş.', aksiyon: 'Mevcut hedefi revize edin veya temel çalışma motivasyonunu rehberlik servisiyle sorgulayın.' },
      ton: 'urgent'
    }
  },,

  // ── MODÜL 1 EKLEMELERİ ──────────────────────────────────

  {
    id: 'DYN-02', modul: 1, priority: 85, etiket: 'Veri Sessizliği',
    // Öğrenci veri girmemiş ama önceki günlerde aktifti
    tetikle: (b, h, a, k) =>
      b.kaygi === 0 && b.enerji === 0 && b.soru === 0 &&
      h.veriGirisTutarliligi >= 3,
    cikti: {
      daily:   { teshis: 'Sistemden Kopuş: Düzenli veri giren öğrenci bugün sessiz kalmış.', aksiyon: 'Kısa bir mesajla öğrencinin durumunu sorgulayın; sessizlik erken uyarı işareti olabilir.' },
      weekly:  { teshis: 'Aralıklı Takip Bozukluğu: Bu hafta veri girişleri tutarsız.', aksiyon: 'Veri girişinin neden kesildiğini görüşün; alışkanlık kırılıyor olabilir.' },
      aylik : { teshis: 'Sisteme Güven Kaybı: Öğrenci takip sistemini terk etme eğiliminde.', aksiyon: 'Sistemin öğrenciye ne kazandırdığını somut verilerle gösterin.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-03', modul: 1, priority: 87, etiket: 'Gece Krizi',
    // Uyku çok düşük + kaygı yüksek → gece zor geçmiş
    tetikle: (b, h, a, k) =>
      b.uyku > 0 && b.uyku < 5 &&
      b.kaygi >= k.kaygi.yuksek,
    cikti: {
      daily:   { teshis: 'Gece Krizi: Uyku 5 saatin altında ve kaygı zirvedeydi; bugün bilişsel kapasite ciddi kısıtlı.', aksiyon: 'Bugün yeni konu veya deneme vermeyin; sadece basit tekrar yaptırın.' },
      weekly:  { teshis: 'Kronik Gece Savaşı: Bu hafta uyku-kaygı kısır döngüsü izleniyor.', aksiyon: 'Akşam rutinini yeniden tasarlayın; yatmadan 1 saat önce ekransız kural koyun.' },
      aylik : { teshis: 'Uyku Borcunu Ödeme Zamanı: Ay genelinde uyku kalitesi sürdürülemez düzeyde.', aksiyon: 'Uyku düzenini normalleştirmeden akademik performans artışı beklenmesin.' },
      ton: 'urgent'
    }
  },

  {
    id: 'DYN-06', modul: 1, priority: 80, etiket: 'Hafta Sonu Çöküşü',
    // Hafta içi iyi ama hafta sonu kaygı patlaması
    tetikle: (b, h, a, k) =>
      b.dayName !== undefined &&
      (b.dayName === 'Cumartesi' || b.dayName === 'Pazar') &&
      b.kaygi >= k.kaygi.yuksek &&
      h.ortKaygi < k.kaygi.yuksek,
    cikti: {
      daily:   { teshis: 'Hafta Sonu Kaygı Patlaması: Serbest zaman öğrenciyi rahatlatmak yerine bunaltıyor.', aksiyon: 'Hafta sonu için yapılandırılmış ama hafif bir program önerin; boşluk kaygıyı artırıyor.' },
      weekly:  { teshis: 'Yapısız Zaman Korkusu: Hafta sonları düzensizlik kaygı tetikliyor.', aksiyon: 'Hafta sonu için sabah rutini oluşturun; gün başlangıcı çıpası kaygıyı azaltır.' },
      aylik : { teshis: 'Dinlenme Zamanı Paradoksu: Öğrenci için tatil kavramı stres kaynağına dönüşmüş.', aksiyon: 'Dinlenmenin performansı artırdığını veri göstererek öğretirn; izin hakkı verilmeli.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-07', modul: 1, priority: 83, etiket: 'Deneme Sonrası Çöküş',
    // Deneme sonrası gün: kaygı yüksek, soru düşük
    tetikle: (b, h, a, k) =>
      h.denemeSonrasiGun &&
      b.kaygi >= k.kaygi.yuksek &&
      b.soru < k.soru.ort,
    cikti: {
      daily:   { teshis: 'Deneme Şoku: Sınav sonrası kaygı yükselmiş, üretim durmuş.', aksiyon: 'Deneme sonuçlarını bugün değerlendirmeyin; sadece bir yanlışı birlikte analiz edin.' },
      weekly:  { teshis: 'Deneme Kırılganlığı: Her sınavın ardından çöküş yaşanıyor.', aksiyon: 'Deneme sonuçlarını tehdit değil veri olarak çerçeveleme alışkanlığı kazandırın.' },
      aylik : { teshis: 'Sınav Fobisi Sinyali: Denemeler motivasyon artırmak yerine çökertmeye başlamış.', aksiyon: 'Deneme sıklığını azaltın; sonuç odaklı değil süreç odaklı değerlendirmeye geçin.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-08', modul: 1, priority: 78, etiket: 'Robotik Devam',
    // Düzenli çalışıyor ama mood sürekli nötr — tükenmişlik öncüsü
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.ort &&
      b.mood === 'ok' &&
      h.haftalikMoodOrt < 3.2 &&
      h.tutarliGunSayisi >= 4,
    cikti: {
      daily:   { teshis: 'Mekanik Çalışma: Üretim var ama içsel motivasyon sıfırlanmış; robot modunda ilerleniyor.', aksiyon: 'Bugün çalışmanın neden önemli olduğunu konuşun; hedefe bağlantı kurun.' },
      weekly:  { teshis: 'Duygusal Donukluk: Bu hafta ne iyi ne kötü; öğrenci süreci sadece "bitirmek" istiyor.', aksiyon: 'Haftalık programa öğrencinin seveceği küçük bir sürpriz ekleyin.' },
      aylik : { teshis: 'Pre-Burnout Zemini: Duygusal katılım azalmış; tükenmişlik kapıda.', aksiyon: 'Hazırlık sürecine anlam katan yeni bir motivasyon kaynağı bulun.' },
      ton: 'warning'
    }
  },

  // ── MODÜL 2 EKLEMELERİ ──────────────────────────────────

  {
    id: 'DYN-46', modul: 2, priority: 79, etiket: 'Tekrar Tuzağı',
    // Tekrar süresi yüksek ama yeni konu yok → konfor alanı
    tetikle: (b, h, a, k) =>
      b.tekrarSure > 60 &&
      b.konuSure < 15 &&
      b.soru >= k.soru.ort,
    cikti: {
      daily:   { teshis: 'Konfor Tekrarı: Öğrenci bildiklerini tekrar ederek güvende hissediyor ama yeni şey öğrenmiyor.', aksiyon: 'Bugün en az 30 dakika yeni konu çalışmasını zorunlu tutun.' },
      weekly:  { teshis: 'Gelişim Duraksaması: Bu hafta tekrarlar yeni kazanımın önüne geçmiş.', aksiyon: 'Haftalık planda konu-tekrar oranını 60-40 olarak sabitleyin.' },
      aylik : { teshis: 'Statik Öğrenme Karakteri: Öğrenci hep bildiğini pekiştiriyor, bilinmeyene girmiyor.', aksiyon: 'Müfredat haritası çıkarıp hangi konuların hiç çalışılmadığını gösterin.' },
      ton: 'stable'
    }
  },

  {
    id: 'DYN-48', modul: 2, priority: 86, etiket: 'Hedef-Performans Makası',
    // Soru sayısı kalibrasyon ortasında ama hedefin çok gerisinde
    tetikle: (b, h, a, k) =>
      b.soru >= k.soru.dusuk &&
      b.soru < k.soru.ort &&
      h.soruHedefiKarsilama < 0.4,
    cikti: {
      daily:   { teshis: 'Hedef Makası: Kendi geçmişine göre normal ama hedefe göre çok yetersiz.', aksiyon: 'Öğrenciye gerçek hedefe ne kadar uzak olduğunu somut sayılarla gösterin.' },
      weekly:  { teshis: 'Kalibrasyon Yanılması: Sistem normal diyor ama hedef gerçeği farklı.', aksiyon: 'Haftalık hedefi LGS geri sayımına göre yeniden hesaplayıp paylaşın.' },
      aylik : { teshis: 'Kronik Hedef Açığı: Aylık üretim hedefe ulaşmak için yeterli değil.', aksiyon: 'Ya hedefi düşürün ya da çalışma saatlerini artırın; ikisi aynı anda olamaz.' },
      ton: 'urgent'
    }
  },

  {
    id: 'DYN-50', modul: 2, priority: 77, etiket: 'Deneme Kaçınması',
    // Uzun süre deneme yapmamış + soru çözüyor
    tetikle: (b, h, a, k) =>
      h.denemeSonrasiGun === false &&
      b.soru >= k.soru.ort &&
      h.tutarliGunSayisi >= 5,
    cikti: {
      daily:   { teshis: 'Deneme Fobisi: Düzenli çalışıyor ama kendinini sınav koşullarında test etmekten kaçınıyor.', aksiyon: 'Bu hafta en az bir deneme sınavı planlamasını isteyin.' },
      weekly:  { teshis: 'Sınav Ortamı Yabancılığı: Bu hafta deneme yoksa çalışma gerçekçi değil.', aksiyon: 'Cumartesi günü için kısa bir mini deneme (30 soru) planlayın.' },
      aylik : { teshis: 'Sınav Dayanıklılığı Eksikliği: Ay boyunca deneme sayısı yetersiz.', aksiyon: 'Ayda en az 4 deneme minimum standart olarak belirleyin.' },
      ton: 'warning'
    }
  },

  // ── MODÜL 3 EKLEMELERİ ──────────────────────────────────

  {
    id: 'DYN-80', modul: 3, priority: 85, etiket: 'Başarı Körlüğü',
    // İsabet yükseliyor ama öğrenci fark etmiyor (mood hâlâ kötü)
    tetikle: (b, h, a, k) =>
      b.isabet !== null &&
      b.isabet > k.isabet.ort &&
      h.isatetTrend > 5 &&
      ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'sad'),
    cikti: {
      daily:   { teshis: 'Başarı Körlüğü: İsabet oranı yükseliyor ama öğrenci bunu görmüyor.', aksiyon: 'Son 7 günün isabet grafiğini gösterin; gelişim somutlaştırılmalı.' },
      weekly:  { teshis: 'Fark Etmeme Sendromu: Bu hafta net artışı var ama içselleştiremiyor.', aksiyon: 'Haftalık görüşmede sadece rakamları değil, hangi konuları fethetti onu konuşun.' },
      aylik : { teshis: 'Kronik Öz-Küçümseme: Ay boyunca gerçek gelişim psikolojik kabul görmüyor.', aksiyon: 'Başarı günlüğü tutmasını önerin; her gün 1 şeyin üstesinden geldiğini yazmalı.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-83', modul: 3, priority: 72, etiket: 'Konfor Zaferi',
    // Yüksek isabet ama sadece kolay sorulardan
    tetikle: (b, h, a, k) =>
      b.isabet !== null &&
      b.isabet >= k.isabet.yuksek &&
      b.soru < k.soru.ort &&
      h.soruHedefiKarsilama < 0.5,
    cikti: {
      daily:   { teshis: 'Sahte Zafer: Yüksek isabet ama az soru ve hedefin yarısında — kolay sorular seçilmiş.', aksiyon: 'Bugün zorluk seviyesini bir basamak artırın; gerçek seviyeyi test edin.' },
      weekly:  { teshis: 'Konfor Bölgesi Başarısı: Bu hafta yüksek isabet düşük hacimle sağlandı.', aksiyon: 'Soru sayısını artırıp isabeti bu seviyede tutabilirse gerçek gelişim başlar.' },
      aylik : { teshis: 'Yapay Öz-Yeterlilik: Ay boyunca kolay sorularda yüksek isabet gerçek sınav hazırlığı değil.', aksiyon: 'Deneme sınavlarındaki zorluk dağılımıyla karşılaştırın; gerçeği gösterin.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-86', modul: 3, priority: 88, etiket: 'İstikrar Sinyali',
    // Son 3 gün hem soru hem isabet istikrarlı
    tetikle: (b, h, a, k) =>
      a.son3GunSoruOrt >= k.soru.ort &&
      a.son3GunSoruOrt <= k.soru.ort * 1.3 &&
      a.son3GunIsabetOrt !== undefined &&
      a.son3GunIsabetOrt >= k.isabet.ort &&
      h.soruHedefiKarsilama >= 0.6,
    cikti: {
      daily:   { teshis: 'İstikrar Günü: Son 3 gün tutarlı soru ve isabet; sistem sağlıklı çalışıyor.', aksiyon: 'Bu dengeyi bozmayın; rutini koruyun ve küçük bir takdir mesajı gönderin.' },
      weekly:  { teshis: 'Sürdürülebilir Ritim: Bu hafta nicelik ve nitelik dengesinde ilerleniyor.', aksiyon: 'Haftalık hedefi hafifçe yukarı çekerek bu ivmeyi güçlendirin.' },
      aylik : { teshis: 'Karakteristik İstikrar: Öğrenci tutarlı çalışma alışkanlığını içselleştirmiş.', aksiyon: 'Bu temeli kullanarak bir sonraki ay hedeflerini yukarı revize edin.' },
      ton: 'positive'
    }
  },

  // ── MODÜL 4 EKLEMELERİ ──────────────────────────────────

  {
    id: 'DYN-108', modul: 4, priority: 81, etiket: 'Gece Ekranı',
    // Sosyal medya yüksek + uyku düşük → gece ekran kullanımı
    tetikle: (b, h, a, k) =>
      b.dijitalSure >= k.dijital.yuksek &&
      b.uyku > 0 &&
      b.uyku < k.uyku.ort,
    cikti: {
      daily:   { teshis: 'Gece Ekranı: Yüksek dijital kullanım uyku kalitesini düşürmüş; bugün zihin yorgun.', aksiyon: 'Yatmadan 1 saat önce ekran yasağını bu hafta deneyin.' },
      weekly:  { teshis: 'Uyku-Ekran Kısır Döngüsü: Bu hafta gece ekranı ertesi gün verimliliğini sürekli düşürüyor.', aksiyon: 'Akşam programını 21:00 de bitirip telefonu başka odaya koyun.' },
      aylik : { teshis: 'Sirkadiyen Ritim Bozukluğu: Dijital alışkanlık biyolojik saati bozmuş.', aksiyon: 'Yaşam döngüsünü düzeltemeden akademik sıçrama beklenmesin.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-110', modul: 4, priority: 76, etiket: 'Dijital Rehavet',
    // Mood iyi, kaygı düşük ama dijital süre yüksek → keyif amaçlı ekran
    tetikle: (b, h, a, k) =>
      b.dijitalSure >= k.dijital.yuksek &&
      b.kaygi < k.kaygi.dusuk &&
      ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused') &&
      h.soruHedefiKarsilama < 0.5,
    cikti: {
      daily:   { teshis: 'Dijital Rehavet: Kaygı yok, keyif var ama ekran hedefin önüne geçmiş.', aksiyon: 'Öğrenciye LGS geri sayımını hatırlatın; rahat hissetmek hareketsizlik değil.' },
      weekly:  { teshis: 'Konfor Tuzağı: Bu hafta iyi hissetmek çalışma motivasyonunu azaltmış.', aksiyon: 'Haftalık görüşmede iyi günlerin fırsata dönüştürülmesi gerektiğini konuşun.' },
      aylik : { teshis: 'Motivasyon-Performans Kopukluğu: Öğrenci mutlu ama hedefe gitmiyor.', aksiyon: 'İyi mood u akademik ataklar için kullanmayı alışkanlık haline getirin.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-112', modul: 4, priority: 83, etiket: 'Dijital Telafi',
    // Zor bir gün sonrası aşırı dijital kullanım
    tetikle: (b, h, a, k) =>
      b.dijitalSure >= k.dijital.yuksek &&
      b.kaygi >= k.kaygi.yuksek &&
      b.soru >= k.soru.ort,
    cikti: {
      daily:   { teshis: 'Dijital Telafi: Yoğun bir çalışma gününün ardından ekranla ödüllendirme yapılmış.', aksiyon: 'Ekranı tamamen yasaklamayın; süreyi 45 dakika ile sınırlayın.' },
      weekly:  { teshis: 'Stres-Ekran Döngüsü: Yoğun günlerin ardından dijital tüketim ani artış gösteriyor.', aksiyon: 'Ekran yerine yürüyüş veya müzik gibi alternatif dinlenme yöntemleri önerin.' },
      aylik : { teshis: 'Tek Rahatlama Kanalı: Öğrencinin stres yönetim repertuarı dijital medyayla sınırlı.', aksiyon: 'Farklı rahatlama aktiviteleri keşfetmesine yardımcı olun.' },
      ton: 'stable'
    }
  },

  // ── MODÜL 5 EKLEMELERİ ──────────────────────────────────

  {
    id: 'DYN-127', modul: 5, priority: 88, etiket: 'Enerji Çöküşü',
    // Enerji çok düşük + soru ortanın altında
    tetikle: (b, h, a, k) =>
      b.enerji > 0 &&
      b.enerji <= k.enerji.dusuk &&
      b.soru < k.soru.ort,
    cikti: {
      daily:   { teshis: 'Enerji Çöküşü: Fiziksel enerji dipte; üretim kaçınılmaz olarak düşmüş.', aksiyon: 'Bugün kısa ve odaklı çalışma blokları (2x25 dk) yeterli; uzun seans beklemeyin.' },
      weekly:  { teshis: 'Kronik Düşük Enerji: Bu hafta enerji seviyesi sürekli düşük seyretti.', aksiyon: 'Uyku düzeni, beslenme ve hareket alışkanlıklarını gözden geçirin.' },
      aylik : { teshis: 'Fizyolojik Taban Sorunu: Enerji tabanı yükseltilmeden akademik performans artmaz.', aksiyon: 'Gerekirse aileyle birlikte sağlık kontrolü planlayın.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-128', modul: 5, priority: 92, etiket: 'Fizyolojik Çelişki',
    // Uyku iyi ama enerji düşük → uyku kalitesi bozuk
    tetikle: (b, h, a, k) =>
      b.uyku >= k.uyku.yuksek &&
      b.enerji > 0 &&
      b.enerji <= k.enerji.dusuk,
    cikti: {
      daily:   { teshis: 'Uyku Paradoksu: Uyku süresi yeterli ama enerji yok; uyku kalitesi bozuk olabilir.', aksiyon: 'Geç saatte yemek, gece ekranı veya stres uyku kalitesini düşürüyor olabilir.' },
      weekly:  { teshis: 'Restoratif Uyku Eksikliği: Bu hafta süre var ama dinlendirici uyku yok.', aksiyon: 'Yatmadan önceki 1 saati stressiz geçirme rutini oluşturun.' },
      aylik : { teshis: 'Kronik Uyku Kalitesi Sorunu: Uzun vadede bilişsel performansı olumsuz etkiler.', aksiyon: 'Gerekirse uyku hijyeni üzerine profesyonel destek alın.' },
      ton: 'warning'
    }
  },

  {
    id: 'DYN-130', modul: 5, priority: 94, etiket: 'Sürdürülebilirlik Alarmı',
    // Haftalık enerji trendi sürekli düşüş
    tetikle: (b, h, a, k) =>
      h.enerjiTrend === 'düşüş' &&
      h.dusukEnerjiGunSayisi >= 3 &&
      h.tutarliGunSayisi >= 3,
    cikti: {
      daily:   { teshis: 'Tükeniş Yolunda: Haftalık enerji trendi sürekli aşağı; sistem yavaşlıyor.', aksiyon: 'Bugün akademik yükü yarıya indirin; enerjiyi önce doldurun.' },
      weekly:  { teshis: 'Haftanın Enerji Karnesi Kötü: Bu hafta her gün biraz daha yorgun başlanmış.', aksiyon: 'Hafta sonu tam dinlenme günü planlayın; hiç soru yok, sadece dinlenme.' },
      aylik : { teshis: 'Tükenmişlik Eşiği: Ay boyunca enerji eğrisi aşağı; burnout an meselesi.', aksiyon: 'Çalışma temposunu kalıcı olarak düşürün; yorgun öğrenci öğrenemez.' },
      ton: 'urgent'
    }
  },

  {
    id: 'DYN-132', modul: 5, priority: 78, etiket: 'Fizyolojik Zirve',
    // Uyku + enerji ikisi de yüksek → fırsat günü
    tetikle: (b, h, a, k) =>
      b.uyku >= k.uyku.yuksek &&
      b.enerji >= k.enerji.yuksek &&
      h.soruHedefiKarsilama < 0.6,
    cikti: {
      daily:   { teshis: 'Kaçırılan Fırsat: Uyku ve enerji zirvedeyken hedefin yarısında kalınmış.', aksiyon: 'Öğrenciye bu enerjinin kıymetini hatırlatın; zor konuya bugün girmek için ideal gün.' },
      weekly:  { teshis: 'Yüksek Kapasite-Düşük Kullanım: Bu hafta biyolojik koşullar iyiydi ama kullanılamadı.', aksiyon: 'İyi fiziksel günleri zorlu konulara ayırma alışkanlığı kazandırın.' },
      aylik : { teshis: 'Fırsat Maliyeti: Ay boyunca iyi günler boşa geçti; bu fark LGS sonucuna yansır.', aksiyon: 'Enerji yüksekken çalışma, düşükken dinlenme rutinini program haline getirin.' },
      ton: 'warning'
    }
  }

];

const POZITIF_SENARYOLAR = [

  {
    id: 'POS-BELIEF-01', modul: 3, priority: 92, etiket: 'Zihinsel Kırılma',
    tetikle: (b, h, a, k) =>
      (b.mood === 'great' || (b.mood === 'good' || b.mood === 'great')) &&
      a.son3GunMoodPuan > k.mood.ort * 1.4 &&
      b.soru >= k.soru.ort,
    cikti: {
      daily:   { teshis: 'Zihinsel Aydınlanma: Öğrenci bugün kendi potansiyeline dair pozitif bir uyanış yaşadı.', aksiyon: 'Bu özgüven artışını, bekletilen zor bir konuyu vererek perçinleyin.' },
      weekly:  { teshis: 'İnanç Dönüşümü: Bu hafta yapamam bariyeri pozitif yönde yıkıldı.', aksiyon: 'Öğrenciye artık bu seviyedesin mesajını net şekilde verin.' },
      aylik : { teshis: 'Karakteristik Güçlenme: Ayın başındaki düşük özgüven, sağlam yeterlilik algısına dönüştü.', aksiyon: 'Hedefleri üst lige taşıma zamanı geldi.' },
      ton: 'positive'
    }
  }

];

window.SENARYOLAR = SENARYOLAR;
window.POZITIF_SENARYOLAR = POZITIF_SENARYOLAR;
window.VAKA_KOMBINASYONLARI = []; // Vaka kombinasyonları şimdilik boş
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
      (b.mood === 'sad' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok')) && b.tekrarSure > 40 &&
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
      ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused') && b.kaygi < k.kaygi.dusuk &&
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
      (b.mood === 'great' || (b.mood === 'good' || b.mood === 'great')) &&
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
      (b.mood === 'great' || (b.mood === 'good' || b.mood === 'great')) && b.kaygi >= k.kaygi.yuksek &&
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
      b.enerji < k.enerji.dusuk && ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused') &&
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
      return isabet < 35 && (b.mood === 'sad' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok') || (b.mood === 'bad' || b.mood === 'sad'));
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
      b.soru < 20 && ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused') && b.enerji >= 9,
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
      return (!zayif || zayif.q < 15) && ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused');
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
      return isabet < 45 && (b.sosyal > k.sosyal.yuksek || h.haftaSosyalOrt > k.sosyal.yuksek);
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
      return isabet >= 75 && b.enerji < k.enerji.dusuk && (b.mood === 'sad' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok'));
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
      ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused'),
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
      (((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok') || b.mood === 'sad' || b.mood === 'ok'),
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
      ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused'),
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
      ((b.mood === 'good' || b.mood === 'great') || ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused')),
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
      (b.mood === 'sad' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok') || (b.mood === 'bad' || b.mood === 'sad')) &&
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
      (b.mood === 'great' || (b.mood === 'good' || b.mood === 'great') || ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused')),
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
      ((b.mood === 'good' || b.mood === 'great') || b.mood === 'ok'),
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
      (b.mood === 'sad' || (b.mood === 'bad' || b.mood === 'sad') || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok')),
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
        ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused'));
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
      ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused'),
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
      (b.mood === 'sad' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok')),
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
      (b.mood === 'ok' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok')) &&
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
      (b.sosyal > k.sosyal.yuksek || h.haftaSosyalOrt > k.sosyal.yuksek) && h.denemeSonrasiGun && b.enerji < k.enerji.ort,
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
      (b.mood === 'sad' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok')) && b.enerji < k.enerji.dusuk,
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
      return bransSayisi >= 4 && h.haftaSosyalOrt > k.sosyal.ort &&
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
      return (gun === 0 || gun === 6) && b.sosyal > k.sosyal.yuksek * 1.5 &&
        h.haftaSosyalOrt <= k.sosyal.ort * 1.2;
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
      h.haftaSosyalOrt > k.sosyal.ort && b.tekrarSure > 60 && b.soru < 20,
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
      ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused'),
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
      h.haftaSosyalOrt < k.sosyal.ort * 0.7 && b.odak >= k.odak.yuksek &&
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
      h.haftaSosyalOrt > k.sosyal.ort && b.tekrarSure > 40 && b.soru < 20,
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
      (b.mood === 'sad' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok')),
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
      b.enerji >= k.enerji.yuksek && (b.mood === 'sad' || (b.mood === 'bad' || b.mood === 'sad')) &&
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
      (b.mood === 'sad' || ((b.mood === 'bad' || b.mood === 'sad') || b.mood === 'ok') || (b.mood === 'bad' || b.mood === 'sad')),
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
      return b.uyku > 0 && b.uyku < 5.5 && b.kaygi >= k.kaygi.yuksek;
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
      b.enerji >= k.enerji.yuksek && ((b.mood === 'good' || b.mood === 'great') || b.mood === 'great' || b.mood === 'focused') &&
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

