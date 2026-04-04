// colony_story.js — Koloni Günlükleri: Hikaye Verileri
// Kod ile içerik tamamen ayrı — hikaye eklemek/düzenlemek için buraya gel

const COLONY_MODULES = [
  { id:'komuta',  name:'Komuta Merkezi', unlockLevel:1,  upgradeAt:[1,5,12,20], desc:'Koloninin beyni. Tüm operasyonlar buradan yönetilir.' },
  { id:'yasam',   name:'Yaşam Modülü',   unlockLevel:2,  upgradeAt:[2,7,14,22], desc:'Mürettebatın yaşam alanı. Hava, su ve ısı kontrolü.' },
  { id:'lab',     name:'Laboratuvar',     unlockLevel:4,  upgradeAt:[4,9,16,24], desc:'Bilimsel araştırma merkezi. Toprak ve atmosfer analizleri.' },
  { id:'sera',    name:'Sera',            unlockLevel:7,  upgradeAt:[7,13,19,26], desc:'Gıda üretim tesisi. Hidroponik tarım ve bitki deneyleri.' },
  { id:'gozlem',  name:'Gözlemevi',       unlockLevel:10, upgradeAt:[10,17,23,28], desc:'Uzay gözlem istasyonu. Sinyal tarama ve keşif.' },
  { id:'enerji',  name:'Enerji Santrali', unlockLevel:14, upgradeAt:[14,20,26,30], desc:'Güneş panelleri ve füzyon reaktörü. Koloninin kalbi.' },
  { id:'iletisim',name:'İletişim Kulesi', unlockLevel:18, upgradeAt:[18,24,29,33], desc:'Dünya ile iletişim hattı. Veri aktarımı ve mesajlaşma.' },
  { id:'akademi', name:'Araştırma Akademisi', unlockLevel:23, upgradeAt:[23,28,32,36], desc:'Yeni nesil eğitim ve AR-GE merkezi.' },
  { id:'kalkan',  name:'Savunma Kalkanı', unlockLevel:28, upgradeAt:[28,32,36,40], desc:'Koloniyi meteorlardan ve radyasyondan koruyan enerji alanı.' },
  { id:'portal',  name:'Geçit Terminali', unlockLevel:35, upgradeAt:[35,40,45,50], desc:'Gizemli bir yapı. Amacı henüz bilinmiyor...' },
];

// XP tablosu — her seviye için gereken toplam XP
const COLONY_LEVELS = [
  { level:1,  xpNeeded:0,    title:'İniş',               unlocks:'Komuta Merkezi inşa edildi' },
  { level:2,  xpNeeded:50,   title:'İlk Nefes',          unlocks:'Yaşam Modülü inşa edildi' },
  { level:3,  xpNeeded:120,  title:'Yerleşim',            unlocks:null },
  { level:4,  xpNeeded:200,  title:'Keşif Başlıyor',      unlocks:'Laboratuvar inşa edildi' },
  { level:5,  xpNeeded:300,  title:'Adaptasyon',          unlocks:'Komuta Merkezi yükseltildi' },
  { level:6,  xpNeeded:420,  title:'Kök Salmak',          unlocks:null },
  { level:7,  xpNeeded:560,  title:'Yeşil Umut',          unlocks:'Sera inşa edildi' },
  { level:8,  xpNeeded:720,  title:'Büyüme',              unlocks:null },
  { level:9,  xpNeeded:900,  title:'Sinyaller',           unlocks:null },
  { level:10, xpNeeded:1100, title:'Gökyüzüne Bakmak',    unlocks:'Gözlemevi inşa edildi' },
  { level:11, xpNeeded:1320, title:'Derinlere İnmek',     unlocks:null },
  { level:12, xpNeeded:1560, title:'Genişleme',            unlocks:'Komuta Merkezi yükseltildi' },
  { level:13, xpNeeded:1820, title:'Sessiz Fırtına',      unlocks:'Sera yükseltildi' },
  { level:14, xpNeeded:2100, title:'Enerji Çağı',         unlocks:'Enerji Santrali inşa edildi' },
  { level:15, xpNeeded:2400, title:'Dönüm Noktası',       unlocks:null },
  { level:16, xpNeeded:2720, title:'İkinci Dalga',        unlocks:'Laboratuvar yükseltildi' },
  { level:17, xpNeeded:3060, title:'Ufuk Çizgisi',        unlocks:'Gözlemevi yükseltildi' },
  { level:18, xpNeeded:3420, title:'İlk Temas',           unlocks:'İletişim Kulesi inşa edildi' },
  { level:19, xpNeeded:3800, title:'Yankı',                unlocks:'Sera yükseltildi' },
  { level:20, xpNeeded:4200, title:'Olgunlaşma',           unlocks:'Komuta Merkezi + Enerji yükseltildi' },
  { level:21, xpNeeded:4620, title:'Yeni Sorular',        unlocks:null },
  { level:22, xpNeeded:5060, title:'Sınırların Ötesi',    unlocks:'Yaşam Modülü yükseltildi' },
  { level:23, xpNeeded:5520, title:'Bilgi Çağı',           unlocks:'Araştırma Akademisi inşa edildi' },
  { level:24, xpNeeded:6000, title:'Evrim',                unlocks:'İletişim Kulesi yükseltildi' },
  { level:25, xpNeeded:6500, title:'Durgunluk Öncesi',    unlocks:null },
  { level:26, xpNeeded:7020, title:'Fırtına',              unlocks:'Sera + Laboratuvar yükseltildi' },
  { level:27, xpNeeded:7560, title:'Direniş',              unlocks:null },
  { level:28, xpNeeded:8120, title:'Kalkan Aktif',         unlocks:'Savunma Kalkanı inşa edildi' },
  { level:29, xpNeeded:8700, title:'Huzur',                unlocks:'İletişim Kulesi yükseltildi' },
  { level:30, xpNeeded:9300, title:'Parlayan Şehir',      unlocks:'Enerji Santrali yükseltildi' },
  { level:31, xpNeeded:9920, title:'Karar Zamanı',        unlocks:null },
  { level:32, xpNeeded:10560,title:'Bilinmeze Doğru',     unlocks:'Akademi + Kalkan yükseltildi' },
  { level:33, xpNeeded:11220,title:'İşaretler',            unlocks:'İletişim Kulesi yükseltildi' },
  { level:34, xpNeeded:11900,title:'Hazırlık',             unlocks:null },
  { level:35, xpNeeded:12600,title:'Geçit',                unlocks:'Geçit Terminali inşa edildi' },
  { level:36, xpNeeded:13320,title:'Diğer Taraf',         unlocks:'Kalkan yükseltildi' },
  { level:37, xpNeeded:14060,title:'Paralel',              unlocks:null },
  { level:38, xpNeeded:14820,title:'Birleşme',             unlocks:null },
  { level:39, xpNeeded:15600,title:'Son Karar',            unlocks:null },
  { level:40, xpNeeded:16400,title:'Arcadia Uyanıyor',    unlocks:'Geçit Terminali yükseltildi' },
  { level:41, xpNeeded:17220,title:'Öteki Ses',           unlocks:null },
  { level:42, xpNeeded:18060,title:'Köprü',                unlocks:null },
  { level:43, xpNeeded:18920,title:'Yansıma',              unlocks:null },
  { level:44, xpNeeded:19800,title:'Dönüş mü?',           unlocks:null },
  { level:45, xpNeeded:20700,title:'Geçit Terminali',      unlocks:'Portal yükseltildi' },
  { level:46, xpNeeded:21620,title:'Sonsuzluk Dalgası',   unlocks:null },
  { level:47, xpNeeded:22560,title:'Mirasçılar',           unlocks:null },
  { level:48, xpNeeded:23520,title:'Işığa Doğru',         unlocks:null },
  { level:49, xpNeeded:24500,title:'Son Günlük',           unlocks:null },
  { level:50, xpNeeded:25500,title:'Arcadia: Başlangıç',  unlocks:'Tüm modüller maksimum seviye' },
];

// Hikaye bölümleri — her bölüm bir seviyede açılır
const COLONY_CHAPTERS = [
  // ═══ ARC 1: İNİŞ VE HAYATTA KALMA (Sv 1-10) ═══
  { id:'c01', level:1, module:'komuta', title:'İniş',
    text:'Kapsül yüzeye sert çarptı. Toz bulutu dağıldığında, etrafımızda sadece turuncu kayalıklar ve sonsuz bir ufuk vardı. Komuta merkezi modüllerini yerleştirmeye başladık. Dünya\'dan gelen son mesaj: "Bundan sonrası size kalmış." İlk geceyi modülün içinde geçirdik — dışarıda rüzgar uğulduyordu.',
    nextHint:'Hava analizi beklenmedik sonuçlar verecek...' },

  { id:'c02', level:2, module:'yasam', title:'İlk nefes',
    text:'Yaşam modülü aktif. Hava filtreleme sistemi çalışıyor — ama dışarıdaki atmosfer beklediğimizden farklı. Oksijen izi var. Az, ama var. Dr. Kaya kaşlarını çattı: "Bu doğal olmamalı." Şimdilik modülün içinde güvendeyiz. Su arıtma ünitesi test ediliyor.',
    nextHint:'Toprakta garip bir şey var...' },

  { id:'c03', level:3, module:'yasam', title:'Sessizlik',
    text:'İkinci hafta. Herkes görevine alıştı. Muhendis Elif su arıtma kapasitesini artırdı. Ama geceleri herkes aynı şeyi hissediyor — sessizlik. Dünya\'daki gürültüyü özlüyoruz. Kaptan Deniz akşam toplantısında dedi ki: "Sessizlik düşmanınız değil. Onu dinlemeyi öğrenin."',
    nextHint:'Laboratuvar inşaatı başlıyor...' },

  { id:'c04', level:4, module:'lab', title:'İlk analiz',
    text:'Laboratuvar modülü hazır. İlk iş: toprak örnekleri. Sonuçlar ekranda belirdiğinde Dr. Kaya\'nın yüzü değişti. Toprakta tanımadığımız bir mineral var — Dünya\'daki hiçbir veritabanında eşleşme yok. "Bunu adlandırmamız gerekiyor" dedi. Ekip oy birliğiyle karar verdi: Arcadium.',
    nextHint:'Arcadium\'un özellikleri şaşırtıcı olacak...' },

  { id:'c05', level:5, module:'komuta', title:'Yükseltme',
    text:'Komuta merkezi genişletildi. Yeni uydu anteni sayesinde Dünya\'dan veri paketi aldık — 3 haftalık gecikmeyle. İçinde ailelerimizin mesajları var. Herkes kendi köşesine çekildi ve okudu. Kimse konuşmadı ama herkesin gözleri parlıyordu. Bu gece ilk kez burayı "ev" gibi hissettik.',
    nextHint:'Arcadium termal enerji üretiyor...' },

  { id:'c06', level:6, module:'lab', title:'Arcadium ısınıyor',
    text:'Dr. Kaya\'nın son deneyi herkesi şaşırttı. Arcadium minerali belirli bir sıcaklıkta enerji yayıyor — küçük ama ölçülebilir. "Bu bir pil gibi" dedi Elif, "ama bitmez bir pil." Eğer yeterli miktarda çıkarırsak, güneş panellerine bağımlılığımız azalır. Ama toprak derinde ve kazı zor.',
    nextHint:'Sera projesinde sürpriz gelişme...' },

  { id:'c07', level:7, module:'sera', title:'Yeşilin rengi',
    text:'Sera modülü aktif! İlk tohumlar ekildi. Ama bir sorun var — Arcadium\'lu toprakta yetişen bitkiler Dünya\'dakinden farklı. Daha koyu yeşil, daha hızlı büyüyor. Yenilebilir mi? Dr. Kaya test ediyor. Elif diyor ki: "Doğa burada kendi kurallarını koymuş."',
    nextHint:'Gece gökyüzünde bir şey var...' },

  { id:'c08', level:8, module:'sera', title:'İlk hasat',
    text:'Bitkiler test edildi — yenilebilir, hatta besleyici. İlk yerel hasadı kutladık. Kaptan Deniz bir konuşma yaptı: "Artık sadece hayatta kalmıyoruz. Yaşıyoruz." Morallar yüksek. Ama Dr. Kaya gece gözlem notlarına bir şey eklemiş: "Güneydoğu ufkunda düzensiz ışık patlamaları — açıklama bulunamadı."',
    nextHint:'O ışıklar ne olabilir?' },

  { id:'c09', level:9, module:'lab', title:'Sinyal',
    text:'Laboratuvardaki eski radyo alıcısı garip bir sinyal yakaladı. Doğal değil — bir pattern var. Tekrar eden, düzenli bir ritim. 3 uzun, 2 kısa, 3 uzun. Dr. Kaya: "Bu ya çok eski bir otomatik sistem, ya da..." Cümlesini tamamlamadı. Herkes ne demek istediğini anladı. Ama kimse yüksek sesle söylemedi.',
    nextHint:'Gözlemevi bu sinyali çözecek mi?' },

  { id:'c10', level:10, module:'gozlem', title:'Gökyüzünden gelen',
    text:'Gözlemevi inşası tamamlandı. İlk iş: sinyalin kaynağını bulmak. Koordinatlar belli — güneydoğu, 47 kilometre uzakta. Orada bir şey var. Uydu görüntülerinde doğal olmayan bir yapı seziliyor ama detay yetersiz. Kaptan Deniz karar verdi: "Henüz değil. Önce hazırlanmalıyız." Herkes biliyordu ki eninde sonunda oraya gideceğiz.',
    nextHint:'Sinyal güçleniyor...' },

  // ═══ ARC 2: KEŞİF VE BÜYÜME (Sv 11-20) ═══
  { id:'c11', level:11, module:'gozlem', title:'47 kilometre',
    text:'Gözlemevinden yapılan ölçümler netleşti. Yapı metalik, büyük ve çok eski. Radyokarbon benzeri bir yöntemle yaşını hesaplamaya çalıştık — sonuç: en az 50.000 yıl. Bu gezegen boş değilmiş. En azından bir zamanlar boş değilmiş.',
    nextHint:'Dr. Kaya gizli bir proje başlattı...' },

  { id:'c12', level:12, module:'komuta', title:'Gizli dosya',
    text:'Komuta merkezinin genişletilmiş veritabanında Dr. Kaya\'nın gizlediği bir dosya bulduk. Dünya\'dan gelen son veri paketindeymiş. İçinde bu gezegenle ilgili sınıflandırılmış bir rapor var. Dünya bizden önce burayı biliyordu. Sinyalleri onlar da almıştı. Bizi "keşif" için değil, "doğrulama" için göndermişlerdi.',
    nextHint:'Elif bir araç tasarlıyor...' },

  { id:'c13', level:13, module:'sera', title:'Toprağın hafızası',
    text:'Sera\'daki bitkiler beklenmedik bir davranış gösterdi. Arcadium\'lu toprakta yetişenler, belirli frekanslarda titreşime tepki veriyor. Dr. Kaya test etti — tam olarak sinyalle aynı frekansta. "Toprak hatırlıyor" dedi. Herkes sessizce baktı. Bir gezegen hatırlayabilir mi?',
    nextHint:'Enerji krizi yaklaşıyor...' },

  { id:'c14', level:14, module:'enerji', title:'Karanlık gün',
    text:'Güneş panelleri verim kaybetti — toz fırtınası üç gün sürdü. Yedek enerji tükeniyordu. O zaman Elif\'in Arcadium reaktörü devreye girdi. Deneysel, riskli, ama çalıştı. Koloni karanlığa gömülmekten kurtuldu. Elif o gece günlüğüne yazdı: "Bazen en iyi çözüm henüz kanıtlanmamış olandır."',
    nextHint:'47 km\'ye keşif gezisi planlanıyor...' },

  { id:'c15', level:15, module:'komuta', title:'Oylama',
    text:'Kaptan Deniz bir oylama istedi: "Yapıya keşif ekibi gönderelim mi?" Herkes oy kullandı. Sonuç: 5\'e 2 — gidiyoruz. Ama Kaptan ekledi: "Gitmek cesaret ister, ama hazırlıksız gitmek aptallık." İki haftalık hazırlık süresi başladı. Herkesin bir görevi var.',
    nextHint:'Keşif ekibi kimlerden oluşacak?' },

  { id:'c16', level:16, module:'lab', title:'Keşif öncesi',
    text:'Laboratuvarda keşif ekibi için özel ekipman hazırlandı. Arcadium sensörleri, portatif analiz kiti, 72 saatlik erzak. Dr. Kaya ekip liderliğini üstlendi. Elif araç mekaniği olarak gidecek. Kaptan Deniz kalıp koloniyi yönetecek. Ayrılık hep zordur — ama herkes bunun gerekli olduğunu biliyor.',
    nextHint:'Yapıya yaklaştıkça sinyal değişiyor...' },

  { id:'c17', level:17, module:'gozlem', title:'İlk temas',
    text:'Keşif ekibi 47. kilometreye ulaştı. Yapı devasa — yüzeyin altında bir giriş var. Kapı gibi bir şey ama mekanizması tanıdık değil. Arcadium sensörü çıldırdı — yapının tamamı Arcadium\'dan inşa edilmiş. Dr. Kaya nefesini tuttu: "Bu bir bina değil. Bu bir makine."',
    nextHint:'Makinenin içinde ne var?' },

  { id:'c18', level:18, module:'iletisim', title:'Mesaj',
    text:'İletişim kulesi tamamlandı. İlk iş: Dünya\'ya keşif raporunu göndermek. Ama kuleden gelen ilk sinyal Dünya\'dan değil — yapıdan geldi. Yapı, iletişim kulemizi algıladı ve bir mesaj gönderdi. Tek bir kelime, tekrar tekrar, tüm frekanslarda: "BEKLE."',
    nextHint:'Kim bekliyor? Neden?' },

  { id:'c19', level:19, module:'sera', title:'Sera\'nın sırrı',
    text:'Sera\'daki bitkiler aynı anda, tek bir gece içinde çiçek açtı. Hiçbir tetikleyici yok — ne ışık değişimi, ne sıcaklık. Dr. Kaya toprak titreşimini ölçtü: yapıdan gelen sinyal tam o gece değişmişti. "Sinyal bitkilere konuşuyor" dedi. Bu gezegende her şey bağlantılı.',
    nextHint:'Yapıya geri dönüş zamanı...' },

  { id:'c20', level:20, module:'komuta', title:'İkinci giriş',
    text:'Hazırlıklar tamamlandı. Ekip yapıya geri döndü — bu sefer giriş açıldı. İçeride devasa bir boşluk. Duvarlarda haritalara benzeyen işaretler. Ve merkezde, hâlâ titreşen bir çekirdek. Arcadium saf halde, parlak ve sıcak. Dr. Kaya\'nın eli titriyordu: "Bu bir tohum. Tüm gezegen bunun etrafında yaşıyor."',
    nextHint:'Tohum ne anlama geliyor?' },

  // ═══ ARC 3: GERÇEK VE DÖNÜŞÜM (Sv 21-35) ═══
  { id:'c21', level:21, module:'lab', title:'Çözümleme',
    text:'Yapıdan alınan veriler laboratuvarda analiz ediliyor. Duvardaki haritalar bu gezegenin geçmişini anlatıyor: bir zamanlar burada bir uygarlık varmış. Teknolojileri bizimkinden farklı ama ileri. Gezegeni terk etmişler — ya da etmek zorunda kalmışlar. Geride bu tohumu bırakmışlar.',
    nextHint:'Tohum neden bırakıldı?' },

  { id:'c22', level:22, module:'yasam', title:'Değişim',
    text:'Koloni değişiyor. Arcadium sayesinde enerji sorunu çözüldü, sera bol ürün veriyor. İnsanlar artık sadece hayatta kalmıyor, projeler geliştiriyor. Elif bir rüzgar türbini tasarlıyor. Dr. Kaya tohumun genetik kodunu çözmeye çalışıyor. Kaptan Deniz her gece yapıya bakıyor ve düşünüyor.',
    nextHint:'Tohumun kodu kırılmak üzere...' },

  { id:'c23', level:23, module:'akademi', title:'Akademi',
    text:'Araştırma Akademisi açıldı. Amacı: tohumun mesajını çözmek. İlk bulgular şaşırtıcı — tohumun içinde bir bilgi arşivi var. Ama format tanıdık değil, çözümleme yıllar alabilir. Dr. Kaya\'nın bir teorisi var: "Onlar gideceklerini biliyorlardı. Bu tohum bir miras. Bize bırakıldı."',
    nextHint:'Arşivde ne tür bilgiler var?' },

  { id:'c24', level:24, module:'iletisim', title:'Dünya\'nın cevabı',
    text:'Dünya\'dan gelen mesaj 6 ay sonra ulaştı. Kısa ve resmi: "Bilgileri aldık. Keşfi gizli tutun. İkinci ekip hazırlanıyor." Kaptan Deniz mesajı okuduktan sonra uzun süre sessiz kaldı. Sonra dedi ki: "Bu keşif insanlığın. Gizli kalmamalı." Zor bir karar vermemiz gerekecek.',
    nextHint:'Gizlemek mi, paylaşmak mı?' },

  { id:'c25', level:25, module:'komuta', title:'Durgunluk',
    text:'Koloni ikiye bölündü. Bir kısım Dünya\'nın emrine uymak istiyor — gizlilik güvenlik demek. Diğerleri keşfin paylaşılması gerektiğini savunuyor. Kaptan Deniz ara bulucu olmaya çalışıyor ama gerginlik artıyor. Elif günlüğüne yazdı: "Gerçeği bilmek kolay. Ne yapacağına karar vermek zor."',
    nextHint:'Bir kriz kapıda...' },

  { id:'c26', level:26, module:'sera', title:'Toprak konuşuyor',
    text:'Kriz sırasında sera\'daki bitkiler yine aynı anda tepki verdi — bu sefer solararak. Arcadium titreşimi değişti. Dr. Kaya anladı: "Gezegen stresimizi hissediyor. Toprak, tohum, bitkiler — hepsi bağlantılı. Ve biz de artık bu ağın parçasıyız."',
    nextHint:'Birlik sağlanabilecek mi?' },

  { id:'c27', level:27, module:'lab', title:'Uzlaşma',
    text:'Dr. Kaya bir sunum yaptı — tohumun arşivinden çözülen ilk veri paketi. İçinde gezegenin ekolojik haritası ve uyarı var: "Bu dünya paylaşıldığında yaşar, saklandığında ölür." Mesaj açıktı. Herkes sessizce baktı. Oylama tekrarlandı — bu sefer oybirliğiyle: bilgi paylaşılacak.',
    nextHint:'Savunma kalkanı neden gerekli?' },

  { id:'c28', level:28, module:'kalkan', title:'Fırtına geliyor',
    text:'Gözlemevi büyük bir toz fırtınası tespit etti — daha önce görülmemiş ölçekte. Savunma kalkanı tam zamanında devreye girdi. Arcadium enerjisiyle çalışan kalkan koloniyi korudu. Fırtına üç gün sürdü. Herkes kalkanın altında bir aile gibi beklerken, Kaptan Deniz fısıldadı: "Bu ev artık sağlam."',
    nextHint:'Fırtına sonrası yüzeyde bir değişiklik var...' },

  { id:'c29', level:29, module:'iletisim', title:'Açık mesaj',
    text:'Kaptan Deniz, Dünya\'ya resmi bir rapor yerine açık bir mesaj gönderdi — tüm frekanslarda. Keşfin detayları, tohumun mesajı, Arcadium\'un potansiyeli. "Bu bilgi insanlığa ait" dedi. Dünya\'nın cevabı bilinmiyor. Ama yapıdan gelen sinyal değişti — artık "BEKLE" demiyor. Yeni mesaj: "HAZIR."',
    nextHint:'Hazır olan ne?' },

  { id:'c30', level:30, module:'enerji', title:'Parlayan şehir',
    text:'Enerji santrali tam kapasitede. Koloni geceleri uzaydan görülebilecek kadar parlıyor. Elif\'in tasarladığı Arcadium ağı tüm modülleri bağlıyor. Dr. Kaya tohumun arşivinden ikinci veri paketini çözdü — bu sefer içinde bir koordinat var. Gezegenin diğer tarafında, okyanusun ötesinde, bir şey daha var.',
    nextHint:'Okyanusun ötesinde ne var?' },

  // ═══ ARC 4: PORTAL VE SONSUZLUK (Sv 31-40) ═══
  { id:'c31', level:31, module:'akademi', title:'İkinci tohum',
    text:'Koordinatlar bir ikinci tohuma işaret ediyor — ama denizin altında. Ulaşmak şu anki teknolojimizle imkansız. Akademi\'deki araştırmacılar bir çözüm arıyor. Dr. Kaya\'nın gözleri parlıyor: "Belki ulaşmamız gerekmiyor. Belki onu uyandırmamız yeterli."',
    nextHint:'İki tohum bağlantılı mı?' },

  { id:'c32', level:32, module:'kalkan', title:'Rezonans',
    text:'Dr. Kaya haklıydı. İlk tohuma belirli bir frekansta sinyal gönderdiğimizde, gezegenin diğer tarafından cevap geldi. İki tohum birbirleriyle konuşuyor. Arcadium ağı tüm gezegeni sarıyor — biz sadece yüzeydeki küçük bir düğümüz. Bu bağlantı kalkanı güçlendirdi ama aynı zamanda bir şeyi uyandırdı.',
    nextHint:'Uyanan ne?' },

  { id:'c33', level:33, module:'iletisim', title:'Eski sakinler',
    text:'Tohumlar arası iletişim artık deşifre ediliyor. Mesajlar eski uygarlığa ait — kendi tarihlerini tohumlara kodlamışlar. Savaş, keşif, hata, pişmanlık ve sonunda umut. Son mesajları: "Gidenler geri dönmeyecek. Ama gelenler devam edecek." Biz o gelenleriz.',
    nextHint:'Geçit terminali için bir şey değişti...' },

  { id:'c34', level:34, module:'gozlem', title:'Gökyüzünde ikinci yıldız',
    text:'Gözlemevi yeni bir cisim tespit etti — gezegenin yörüngesine giren bir yapı. Doğal değil. Eski uygarlığa ait bir uydu, binlerce yıldır uykuda, şimdi tohumların rezonansıyla uyandı. Üzerinde bir şey var — tarama sonuçları bir geçit mekanizmasına işaret ediyor.',
    nextHint:'Geçit nereye açılıyor?' },

  { id:'c35', level:35, module:'portal', title:'Geçit',
    text:'Geçit Terminali inşa edildi — uydudan gelen spesifikasyonlara göre. Arcadium enerjisiyle çalışıyor. Aktive edildiğinde bir pencere açılıyor — geçidin diğer tarafında başka bir dünya var. Canlı, yeşil, sularla kaplı. Eski uygarlığın gerçek evi. Oraya gidip gidemeyeceğimizi bilmiyoruz. Ama kapı açık.',
    nextHint:'Geçidin diğer tarafında ne bekliyor?' },

  { id:'c36', level:36, module:'portal', title:'Diğer taraf',
    text:'İlk drone geçitten gönderildi. Görüntüler nefes kesici — mavi gökyüzü, dev ağaçlar, berrak nehirler. Ama boş değil. Uzakta yapılar var — bizimkilere benzer ama çok daha gelişmiş. Eski uygarlık tamamen yok olmamış mı? Yoksa bu yeni bir başlangıç mı?',
    nextHint:'Drone bir şey daha gördü...' },

  { id:'c37', level:37, module:'komuta', title:'Seçim',
    text:'Drone\'un son görüntüsü tartışma yarattı — yapıların yakınında hareket var. Canlı bir şey. Koloni yine ikiye bölündü: gitmek isteyenler ve kalıp Arcadia\'yı geliştirmek isteyenler. Bu sefer Kaptan Deniz oy kullanmadı. "Bu bireysel bir karar" dedi. "Herkes kendi yolunu seçsin."',
    nextHint:'Kim gidecek, kim kalacak?' },

  { id:'c38', level:38, module:'portal', title:'Veda ve başlangıç',
    text:'Dr. Kaya gidecekler arasında. Elif kalacak — "Arcadia benim evim artık" dedi. Kaptan Deniz son ana kadar kararsız kaldı, sonra gülümsedi: "Ben köprüyüm. Burada kalıp iki tarafı bağlayacağım." Veda gecesi herkes bir araya geldi. Kimse ağlamadı — ama herkes biliyordu ki hiçbir şey eskisi gibi olmayacak.',
    nextHint:'Geçidin ötesinde ne bulunacak?' },

  { id:'c39', level:39, module:'iletisim', title:'İlk rapor',
    text:'Geçitten ilk rapor geldi. Dr. Kaya\'nın sesi titriyordu: "Burada biri var. Bizimle konuşmak istiyorlar. Korkmayın — onlar da korkmuştu. Ama artık değiller." İletişim kulesi mesajı tüm koloniye iletti. Elif gözyaşlarını sildi ve sera\'ya gitti — bitkilere su verdi. Hayat devam ediyordu, her iki tarafta da.',
    nextHint:'Son bölüm yaklaşıyor...' },

  { id:'c40', level:40, module:'portal', title:'Arcadia uyanıyor',
    text:'İki dünya artık bağlantılı. Arcadia bir koloni olmaktan çıktı — bir köprü oldu. Eski uygarlığın torunları ile yeni dünyanın çocukları birlikte çalışıyor. Kaptan Deniz son günlüğünü yazdı: "Biz keşfetmeye geldik. Ama asıl keşfettiğimiz kendimizdi. Cesaret, sabır, dürüstlük ve birlikte çalışmak — bunlar herhangi bir gezegende geçerli." Arcadia\'nın hikayesi bitmiyor. Sadece yeni bir bölüm başlıyor.',
    nextHint:null },

  // ═══ BONUS BÖLÜMLER (Sv 41-50) — Yan hikayeler ═══
  { id:'c41', level:41, module:'gozlem', title:'Elif\'in günlüğü',
    text:'Elif sera\'da yalnız çalışırken eski bir not defteri buldu — kendi el yazısıyla. İlk haftalarda yazdığı notlar. "Korktum. Ama korkunun ötesinde bir şey var — merak. Ve merak her zaman korkudan güçlü." Güldü ve yeni bir sayfa açtı.',
    nextHint:'Her modülün kendi hikayesi var...' },

  { id:'c42', level:42, module:'yasam', title:'Gece nöbeti',
    text:'Yaşam modülünde gece nöbetçisi Mert, penceresinden dışarı baktı. Geçit terminali hafif mavi bir ışıkla parlıyordu. Uzakta, ufuk çizgisinde, ikinci tohumun bulunduğu yerde de aynı ışık yanıyordu. İki nokta arasında görünmez bir bağ vardı. "Biz de böyleyiz" diye düşündü. "Uzakta ama bağlı."',
    nextHint:null },

  { id:'c43', level:43, module:'lab', title:'Dr. Kaya\'nın mektubu',
    text:'Geçidin ötesinden Dr. Kaya\'nın uzun bir mektubu geldi. İçinde bilimsel notlar, çizimler ve bir paragraf: "Merak etmeyin. Burada da güneş doğuyor. Farklı bir renkte, ama aynı sıcaklıkta. İnsanın ihtiyacı olan şey değişmiyor — anlam, bağlantı ve bir parça umut."',
    nextHint:null },

  { id:'c44', level:44, module:'komuta', title:'Yeni mürettebat',
    text:'Dünya\'dan ikinci ekip geldi — 12 kişi daha. Koloni ikiye katlandı. Yeni gelenler yapıya, geçide, Arcadium\'a inanamıyordu. Kaptan Deniz onları karşıladı: "Soru sormaktan çekinmeyin. Biz de her gün soruyoruz. Önemli olan cevap değil, sormaya devam etmek."',
    nextHint:null },

  { id:'c45', level:45, module:'portal', title:'İki dünya',
    text:'Geçit artık düzenli çalışıyor. Her hafta karşılıklı ziyaretler yapılıyor. Eski uygarlığın torunları bize müziklerini öğretti — garip ama güzel sesler. Biz onlara yemek pişirmeyi öğrettik. Elif\'in domatesi orada da ünlü oldu.',
    nextHint:null },

  { id:'c46', level:46, module:'enerji', title:'Arcadium şarkısı',
    text:'Bilim insanları bir keşif yaptı: Arcadium rezonansı aslında bir tür müzik. Her tohumun kendi melodisi var ve birlikte çaldıklarında gezegen bir orkestra gibi titreşiyor. "Evren sessiz değil" dedi Elif. "Biz sadece dinlemeyi bilmiyorduk."',
    nextHint:null },

  { id:'c47', level:47, module:'akademi', title:'Miras',
    text:'Akademi\'nin arşivinde eski uygarlığın tüm bilgisi deşifre edildi. Teknoloji, sanat, felsefe. En çok dikkat çeken bir cümle: "Bir uygarlığın değeri sahip olduklarıyla değil, geride bıraktıklarıyla ölçülür." Kaptan Deniz bu cümleyi komuta merkezinin duvarına yazdırdı.',
    nextHint:null },

  { id:'c48', level:48, module:'kalkan', title:'Kalkanın ötesi',
    text:'Savunma kalkanı artık sadece fırtınalardan korumak için değil — Arcadium ağını dengeliyor. Kalkan operatörü Mert her gece aynı ritüeli yapıyor: enerji seviyelerini kontrol et, dengeyi ayarla, ve sessizce "iyi geceler, Arcadia" de.',
    nextHint:null },

  { id:'c49', level:49, module:'iletisim', title:'Son mesaj',
    text:'Dünya\'ya gönderilen son resmi mesaj: "Arcadia Kolonisi, Gün 365. Durum: aktif, büyüyen, umutlu. Kayıp: yok. Keşif: devam ediyor. Tavsiye: daha fazla insan gönderin. Burası herkes için yeterince büyük." Mesajın altında tüm mürettebatın imzası vardı.',
    nextHint:null },

  { id:'c50', level:50, module:'portal', title:'Başlangıç',
    text:'Bugün Arcadia\'nın birinci yılı. Herkes bir araya geldi — geçidin bu tarafı ve öteki taraf. İki dünyanın insanları, bir masanın etrafında, yıldızların altında. Kaptan Deniz kalktı ve bardağını kaldırdı: "Bir yıl önce bilmediğimiz bir yere indik. Bugün bir evimiz, bir ailemiz ve bir amacımız var. Hikaye bitmiyor — çünkü biz yazmaya devam ediyoruz." Herkes bardağını kaldırdı. Arcadia parlıyordu.',
    nextHint:null },
];

// XP kazanma kuralları
const COLONY_XP_RULES = {
  wellnessEntry: 30,        // Günlük wellness girişi (alan başına 10, max 3 alan)
  wellnessStreak3: 15,      // 3 gün seri bonus
  wellnessStreak7: 40,      // 7 gün seri bonus
  wellnessStreak14: 80,     // 14 gün seri bonus
  wellnessStreak30: 150,    // 30 gün seri bonus
  honestyShield: 30,        // Dürüstlük kalkanı (haftada 3+ farklı duygu)
  questionsPer50: 8,        // Her 50 soru için
  examEntry: 50,            // Deneme girişi
  wellnessPerField: 10,     // Her doldurulmuş wellness alanı başına
};
