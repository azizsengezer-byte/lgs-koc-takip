// ── MODÜL 2.5: DİJİTAL ANESTEZİ VE BİLİŞSEL KAÇINMA ────────
      {
        const sosyalDizi = veriGunler.filter(d=>d.sosyal>0).map(d=>d.sosyal);
        const onlineDizi = veriGunler.filter(d=>d.online>0).map(d=>d.online);
        const ortSosyal2  = sosyalDizi.length>0 ? sosyalDizi.reduce((a,b)=>a+b,0)/sosyalDizi.length : null;
        const ortOnline2  = onlineDizi.length>0 ? onlineDizi.reduce((a,b)=>a+b,0)/onlineDizi.length : null;
        const toplamSosyal = veriGunler.reduce((a,d)=>a+d.sosyal,0);
        const toplamOnline = veriGunler.reduce((a,d)=>a+d.online,0);
        const ekranVerisiVar = toplamSosyal>0 || toplamOnline>0;

        if (ekranVerisiVar) {
          bolumBaslik([65,35,130],'2.5  Dijital Anestezi ve Bilişsel Kaçınma Analizi',
            period==='weekly'
              ? 'Sosyal medya (kaçış) ve online ders (pasif izleme) verilerinin akademik performansla çarpışması'
              : 'Ay boyunca dijital kaçış karakteristiği: kaygı, uyku ve akademik başarıyla korelasyon');

          if (period === 'weekly') {
            // ═════════════════════════════════════════════════════
            // HAFTALIK 2.5 SENARYOLARI
            // ═════════════════════════════════════════════════════

            // Veri hazırlığı
            const yuksekSosyalGunler = veriGunler.filter(d=>d.sosyal>0&&d.sosyal>2);
            const yuksekOnlineGunler = veriGunler.filter(d=>d.online>0&&d.online>4);
            const sosyalKaygiGunler  = veriGunler.filter(d=>d.sosyal>2&&d.kaygi>0&&d.kaygi>8);
            const sosyalUykuGunler   = veriGunler.filter(d=>d.sosyal>2.5&&d.uyku>0&&d.uyku<6);

            // Ertesi gün başarı düşüşü kontrolü (sosyal medya -> sonraki gün)
            const sirkadiyanSabotaj = (() => {
              for (const d of sosyalUykuGunler) {
                const ertesi = gunlerSorted.find(g=>g.dk>d.dk&&g.soru>0);
                if (!ertesi) continue;
                const ertesiHata = soruEntries2
                  .filter(e=>e.dateKey===ertesi.dk&&e.questions>=10)
                  .map(e=>(e.wrong||0)/(e.questions||1)*100);
                if (ertesiHata.length>0 && ertesiHata.reduce((a,b)=>a+b,0)/ertesiHata.length > 35)
                  return {d, ertesi};
              }
              return null;
            })();

            // Vaka 1: Mavi Işık – Sirkadiyen Sabotaj
            if (sirkadiyanSabotaj && !kullanılanOlaylar.has('E_sirkadiyen')) {
              aktifNegatifler.push('Sirkadiyen Sabotaj');
              kullanılanOlaylar.add('E_sirkadiyen');
              kutu('Mavi Işık ve Bilişsel Sis — Sirkadiyen Sabotaj',
                'Sosyal medya ' + sirkadiyanSabotaj.d.sosyal.toFixed(1) + ' saat (uyku ' + sirkadiyanSabotaj.d.uyku.toFixed(1) + ' sa) olan günün ertesinde isabet oranı belirgin düştü. ' +
                'Gece geç saatteki ekran maruziyeti melatonin salgısını baskılamış; ertesi günün ilk akademik periyodu "bilişsel sis" içinde geçirilmiştir. ' +
                'Uyku öncesi 1 saat ekransız tampon zorunlu.',
                [255,222,215],[168,20,20]);
              bakiyeRiskler.push('Sirkadiyen sabotaj tespit edildi: gece ekranı -> düşük ertesi gün performansı');

            // Vaka 2: Reaktif Sosyal Medya Kaçışı
            } else if (sosyalKaygiGunler.length>=1 && !kullanılanOlaylar.has('E_reaktif_kacis')) {
              aktifNegatifler.push('Reaktif Dijital Kaçış');
              kullanılanOlaylar.add('E_reaktif_kacis');
              const enKotuGun = sosyalKaygiGunler.sort((a,b)=>b.kaygi-a.kaygi)[0];
              const kacisHata = dersHataArr[0];
              kutu('Reaktif Sosyal Medya Kaçışı — Akademik Anestezi',
                'Kaygı ' + enKotuGun.kaygi + '/10 olan günde sosyal medya ' + enKotuGun.sosyal.toFixed(1) + ' saat kullanıldı. ' +
                (kacisHata ? '"' + kacisHata.d + '" branşındaki %' + kacisHata.pct.toFixed(0) + ' hata oranıyla yüzleşmek yerine beyin dijital uyuşturucuya yöneldi. ' : '') +
                'Bu bir dinlenme değil "bilişsel erteleme" (procrastination) refleksidir; akademik sorun çözülmeden büyümeye devam ediyor.',
                [255,215,215],[172,18,18]);
              bakiyeRiskler.push('Dijital anestezi alışkanlığı: stres anında dijital kaçış refleksi kemikleşebilir');

            // Vaka 3: Pasif Öğrenme İllüzyonu
            } else if (yuksekOnlineGunler.length>=1 &&
                       yuksekOnlineGunler.some(d=>d.soru<ortSoru*0.6) &&
                       !kullanılanOlaylar.has('E_pasif_ogrenme')) {
              kullanılanOlaylar.add('E_pasif_ogrenme');
              const illuzGun = yuksekOnlineGunler.find(d=>d.soru<ortSoru*0.6);
              kutu('Pasif Öğrenme İllüzyonu',
                illuzGun.online.toFixed(1) + ' saat online ders izlendi; ancak o gün soru sayısı (' + illuzGun.soru + ') günlük ortalamanın (' + Math.round(ortSoru) + ') altında kaldı. ' +
                'Öğrenci ekran karşısında ders izleyerek "öğreniyorum" hissini tatmin etmiş ancak aktif üretime geçemedi. ' +
                'Pasif izleme kalıcı nöral yollar oluşturmaz; her 25 dk izleme için en az 15 dk aktif soru çözümü gereklidir.',
                [255,238,215],[148,80,0]);

            // Vaka 4: Dopaminerjik Odak Sığlaşması
            } else if (yuksekSosyalGunler.length>=1 &&
                       yuksekSosyalGunler.some(d=>d.odak>0&&d.odak<5) &&
                       !kullanılanOlaylar.has('E_dopamin_odak')) {
              kullanılanOlaylar.add('E_dopamin_odak');
              const dGun = yuksekSosyalGunler.find(d=>d.odak>0&&d.odak<5);
              kutu('Dopaminerjik Odak Sığlaşması',
                'Sosyal medya ' + dGun.sosyal.toFixed(1) + ' saat olan günde odak ' + dGun.odak + '/10\'a düştü. ' +
                'Hızlı görsel akış, beynin "derin odak" (deep work) kapasitesini sığlaştırdı. ' +
                'Akademik sorulardaki basit hatalar sabır eşiğinin dijitalleşme nedeniyle düşmesinden kaynaklanıyor.',
                [255,240,215],[145,80,0]);

            // Vaka 5: Ekran Yorgunluğu (Zoom Fatigue)
            } else if (yuksekOnlineGunler.some(d=>d.enerji>0&&d.enerji<3) &&
                       !kullanılanOlaylar.has('E_zoom_fatigue')) {
              kullanılanOlaylar.add('E_zoom_fatigue');
              const zGun = yuksekOnlineGunler.find(d=>d.enerji>0&&d.enerji<3);
              kutu('Dijital Aşırı Yüklenme — Ekran Yorgunluğu (Zoom Fatigue)',
                zGun.online.toFixed(1) + ' saat online ders takibi sonrası enerji ' + zGun.enerji + '/10\'a geriledi. ' +
                'Uzun süreli pasif ders takibi, beyni fiziksel çalışmadan daha fazla yorar. ' +
                'Bu yorgunluk sonrası yapılan zorunlu soru çözümleri belleğe hatalı kodlanma riski taşır.',
                [255,240,215],[145,80,0]);

            // Vaka 6: Sosyal Medya – Duygusal Regülasyon
            } else if (veriGunler.some(d=>['anxious','sad'].includes(d.mood)&&d.sosyal>1.5) &&
                       !kullanılanOlaylar.has('E_duygusal_kacis')) {
              kullanılanOlaylar.add('E_duygusal_kacis');
              const dkGun = veriGunler.find(d=>['anxious','sad'].includes(d.mood)&&d.sosyal>1.5);
              kutu('Sosyal Medya Üzerinden Duygusal Regülasyon',
                'Olumsuz duygu günlerinde (' + (dkGun.mood==='anxious'?'Kaygılı':'Mutsuz') + ') sosyal medya kullanımı ' + dkGun.sosyal.toFixed(1) + ' saate çıktı. ' +
                'Öğrenci olumsuz hislerle başa çıkamadığı için dijital dünyaya sığındı. ' +
                'Bu bir "kaçınma" döngüsü yaratır: olumsuz his -> dijital kaçış -> akademik sorun çözülmez -> daha fazla olumsuz his.',
                [248,222,255],[120,50,180]);

            // Vaka 7: Dengeli hafta
            } else if (ekranVerisiVar) {
              kullanılanOlaylar.add('E_haftalik_dengeli');
              kutu('Dijital Denge: Bu Hafta Kontrol Altında',
                (ortSosyal2!==null?'Sosyal medya ort. '+ortSosyal2.toFixed(1)+' sa/gün. ':'') +
                (ortOnline2!==null?'Online ders ort. '+ortOnline2.toFixed(1)+' sa/gün. ':'') +
                'Ekran kullanımı ile akademik performans arasında belirgin olumsuz korelasyon tespit edilmemiştir.',
                [230,255,240],[20,140,70]);
            }

          } else {
            // ═════════════════════════════════════════════════════
            // AYLIK 2.5 SENARYOLARI
            // ═════════════════════════════════════════════════════

            // Kriz günlerinde sosyal medya artışı
            const krizGunleri2 = veriGunler.filter(d=>(d.kaygi>0&&d.kaygi>7)||(d.uyku>0&&d.uyku<6));
            const krizSosyalOrt = krizGunleri2.filter(d=>d.sosyal>0).length>0
              ? krizGunleri2.filter(d=>d.sosyal>0).reduce((a,d)=>a+d.sosyal,0)/krizGunleri2.filter(d=>d.sosyal>0).length
              : null;
            const normalSosyalOrt = veriGunler.filter(d=>d.sosyal>0&&d.kaygi<=5&&d.uyku>=6.5).length>0
              ? veriGunler.filter(d=>d.sosyal>0&&d.kaygi<=5&&d.uyku>=6.5).reduce((a,d)=>a+d.sosyal,0)/veriGunler.filter(d=>d.sosyal>0&&d.kaygi<=5&&d.uyku>=6.5).length
              : null;
            const krizSosyalArtis = (krizSosyalOrt!==null&&normalSosyalOrt!==null&&normalSosyalOrt>0)
              ? (krizSosyalOrt-normalSosyalOrt)/normalSosyalOrt*100 : null;

            // Ay sonu sosyal medya trendi
            const ayBasiSosyal = sosyalDizi.slice(0,Math.ceil(sosyalDizi.length/3));
            const aySonuSosyal = sosyalDizi.slice(Math.floor(sosyalDizi.length*2/3));
            const sosyalTrend = (ayBasiSosyal.length>0&&aySonuSosyal.length>0)
              ? aySonuSosyal.reduce((a,b)=>a+b,0)/aySonuSosyal.length - ayBasiSosyal.reduce((a,b)=>a+b,0)/ayBasiSosyal.length
              : null;

            // Online > sosyal medya kontrolü (iyi işaret mi kötü mü)
            const onlineDominant = toplamOnline > toplamSosyal;
            // Yüksek online + düşük soru üretimi
            const onlineSoruDengesi = ortOnline2!==null && ortOnline2>3 && ortSoru<DAILY_GOAL*0.5;

            // Vaka 1: Kriz Sonrası Uyuşma Trendi
            if (krizSosyalArtis!==null && krizSosyalArtis>50 && krizGunleri2.length>=3 &&
                !kullanılanOlaylar.has('E_kriz_uyusma')) {
              aktifNegatifler.push('Kemikleşmiş Dijital Kaçış');
              kullanılanOlaylar.add('E_kriz_uyusma');
              kutu('Kriz Sonrası Uyuşma Trendi — Kemikleşmiş Dijital Kaçış',
                'Ay içinde ' + krizGunleri2.length + ' kriz gününde sosyal medya kullanımı normal günlerin %' + Math.round(krizSosyalArtis) + ' üzerinde (' + (krizSosyalOrt??0).toFixed(1) + ' sa/gün vs ' + (normalSosyalOrt??0).toFixed(1) + ' sa/gün normal). ' +
                'Öğrenci ay boyunca her akademik krizde birincil savunma olarak dijital uyuşturmayı kullandı. ' +
                'Bu kemikleşmiş bir "Dijital Kaçış" karakteristiğidir; sınav dönemi stresinde bu refleks güçlenecektir.',
                [255,215,215],[172,18,18]);
              bakiyeRiskler.push('Kemikleşmiş dijital kaçış: sınav döneminde kriz anlarında şiddetlenebilir');

            // Vaka 2: Kronik Dijital Sızıntı
            } else if (ortSosyal2!==null && ortSosyal2>3 && dersHataArr.length>0 &&
                       !kullanılanOlaylar.has('E_kronik_sizinti')) {
              aktifNegatifler.push('Kronik Dijital Sızıntı');
              kullanılanOlaylar.add('E_kronik_sizinti');
              const enZayif = dersHataArr[0];
              kutu('Kronik Dijital Sızıntı — Bilişsel Yer Değiştirme',
                'Ay boyunca sosyal medya ort. ' + ortSosyal2.toFixed(1) + ' sa/gün. ' +
                'En çok geliştirilmesi gereken ' + enZayif.d + ' branşına (%' + enZayif.pct.toFixed(0) + ' hata) ayrılması gereken "direnç enerjisi", dijital evrende tüketildi. ' +
                'Ay sonunda ' + enZayif.d + ' netlerindeki duraksama bu sızıntının doğrudan sonucudur.',
                [255,222,215],[165,20,20]);

            // Vaka 3: Online Ders–Üretim Dengesi Bozukluğu
            } else if (onlineSoruDengesi && !kullanılanOlaylar.has('E_online_uretim')) {
              kullanılanOlaylar.add('E_online_uretim');
              kutu('Online Ders–Üretim Dengesi Bozukluğu — Teori-Pratik Kopukluğu',
                'Online ders ort. ' + (ortOnline2??0).toFixed(1) + ' sa/gün; ancak günlük soru ort. ' + Math.round(ortSoru) + ' (hedef: ' + DAILY_GOAL + '). ' +
                'Öğrenci ayı "ders dinleyerek" kapatmış, "ders çalışmamıştır". ' +
                'Pasif dinleme+nottta kalan bilgi, aktif uygulama olmadan ay sonunda akademik borç ve "unutu" riskidir.',
                [255,238,215],[145,80,0]);

            // Vaka 4: Dijital Gölgelenme (Sosyal > Online)
            } else if (!onlineDominant && toplamSosyal>0 && !kullanılanOlaylar.has('E_dijital_golgelenme')) {
              kullanılanOlaylar.add('E_dijital_golgelenme');
              kutu('Dijital Gölgelenme — Öncelik Kayması',
                'Ay boyunca eğlence amaçlı ekran (' + toplamSosyal.toFixed(0) + ' sa toplam) akademik amaçlı ekranı (' + toplamOnline.toFixed(0) + ' sa) geçti. ' +
                'Bu öncelik kayması öğrencide "vicdani kaygı" ve "başarısızlık hissi" biriktirmekte; döngüsel bir motivasyon çöküşüne zemin hazırlamaktadır.',
                [248,238,255],[110,60,175]);

            // Vaka 5: Sosyal Medya–Öz-Yeterlilik Paradoksu
            } else if (ortSosyal2!==null && ortSosyal2>2 && ortKaygi>6 &&
                       !kullanılanOlaylar.has('E_ozguven_paradoks')) {
              kullanılanOlaylar.add('E_ozguven_paradoks');
              kutu('Sosyal Medya–Öz-Yeterlilik Paradoksu',
                'Sosyal medya ort. ' + ortSosyal2.toFixed(1) + ' sa/gün; kaygı ort. ' + ortKaygi.toFixed(1) + '/10 — ikisi birlikte yüksek. ' +
                'Dijital dünyadaki "idealize edilmiş başarılar" öğrencinin kendi gelişimini yetersiz bulmasına ve kaygısının kronikleşmesine neden olmaktadır. ' +
                'Sosyal medya kaygıyı gidermek için kullanılıyor ama aslında kaygıyı besliyor.',
                [255,238,215],[148,75,0]);

            // Vaka 6: Ay sonu dijital doygunluk
            } else if (sosyalTrend!==null && sosyalTrend>0.5 && !kullanılanOlaylar.has('E_doygunluk')) {
              kullanılanOlaylar.add('E_doygunluk');
              kutu('Dijital Doygunluk ve Bilişsel Blokaj — Ay Sonu Trendi',
                'Sosyal medya kullanımı ay boyunca artış eğiliminde (' + (sosyalTrend>0?'+':'') + sosyalTrend.toFixed(1) + ' sa/gün değişim). ' +
                'Ay sonuna yaklaşırken artan dijital tüketim yeni bilgi girişini reddeden bilişsel blokaj yaratıyor. ' +
                'Sistem "öğrenme" değil "tüketme" moduna geçmiş durumda.',
                [248,235,255],[105,55,175]);

            // Dengeli
            } else {
              kullanılanOlaylar.add('E_aylik_dengeli');
              kutu('Dijital Denge: Bu Ay Kontrol Altında',
                (ortSosyal2!==null?'Sosyal medya ort. '+ortSosyal2.toFixed(1)+' sa/gün. ':'') +
                (ortOnline2!==null?'Online ders ort. '+ortOnline2.toFixed(1)+' sa/gün. ':'') +
                (onlineDominant?'Akademik ekran süresi eğlence ekranını geçmiş — olumlu işaret.':'') +
                ' Dijital alışkanlıkların akademik performans üzerinde belirgin olumsuz etkisi tespit edilmemiştir.',
                [230,255,240],[20,140,70]);
            }
          }
        }
      }

      // ── C. ÖZ-YETERLİLİK VE NESNEL BAŞARI ÇELİŞKİSİ ────────────
      bolumBaslik([75,55,175],'C.  Öz-Yeterlilik ve Nesnel Başarı Çelişkisi',
        period==='weekly'
          ? 'Bu hafta: deneme/isabet verileri ile duygu/kaygı girişleri arasındaki makasın klinik analizi'
          : 'Ay boyunca: net trendi ile psikolojik algı trendinin karşılaştırmalı değerlendirmesi');

      {
        // ── Ortak veri hazırlığı ──
        const pozitifMoodlar = ['good','focused','excited'];
        const negatifMoodlar = ['anxious','tired','sad'];
        const notrMoodlar    = ['ok'];

        const denemelerSirali = [...denemEntries2].sort((a,b)=>a.dateKey.localeCompare(b.dateKey));
        const denemeSayisi = denemelerSirali.length;
        const toplamD = allAcadEntries.reduce((a,e)=>a+(e.correct||0),0);
        const toplamQ2 = allAcadEntries.reduce((a,e)=>a+(e.questions||0),0);
        const toplamIsabet = toplamQ2>20 ? toplamD/toplamQ2*100 : null;

        const moodGunler = gunler.filter(d=>d.mood&&d.mood!=='');
        const negatifGunSayisi = moodGunler.filter(d=>negatifMoodlar.includes(d.mood)).length;
        const notrGunSayisi    = moodGunler.filter(d=>notrMoodlar.includes(d.mood)).length;
        const pozitifGunSayisi = moodGunler.filter(d=>pozitifMoodlar.includes(d.mood)).length;
        const negatifOrani     = moodGunler.length>0 ? negatifGunSayisi/moodGunler.length : null;

        const olumsuzNotlar = gunler.filter(d=>d.negatif&&d.negatif.trim().length>5).map(d=>d.negatif.trim());
        const olumluNotlar  = gunler.filter(d=>d.pozitif&&d.pozitif.trim().length>5).map(d=>d.pozitif.trim());

        const denemeTarihleri2 = new Set(denemelerSirali.map(e=>e.dateKey));
        const denemeHaftaGunler = gunler.filter(d=>[...denemeTarihleri2].some(dk=>Math.abs(new Date(d.dk)-new Date(dk))/(1000*60*60*24)<=2));
        const denemeHaftaFizOrt = denemeHaftaGunler.filter(d=>d.enerji>0).length>0
          ? denemeHaftaGunler.filter(d=>d.enerji>0).reduce((a,d,_,arr)=>a+d.enerji/arr.length,0) : null;
        const normalFizOrt2 = (() => {
          const n=veriGunler.filter(d=>d.enerji>0&&![...denemeTarihleri2].some(dk=>Math.abs(new Date(d.dk)-new Date(dk))/(1000*60*60*24)<=2));
          return n.length>0?n.reduce((a,d)=>a+d.enerji,0)/n.length:null;
        })();

        if (period === 'weekly') {
          const haftaDenemeler = denemelerSirali.filter(e=>e.dateKey>=startKey&&e.dateKey<=endKey);
          const haftaDenemeOrt = haftaDenemeler.length>0?haftaDenemeler.reduce((a,e)=>a+(e.net||0),0)/haftaDenemeler.length:null;
          const oncekiDenemeler = denemelerSirali.filter(e=>e.dateKey<startKey);
          const oncekiDenemeOrt = oncekiDenemeler.length>0?oncekiDenemeler.reduce((a,e)=>a+(e.net||0),0)/oncekiDenemeler.length:null;

          if (haftaDenemeOrt!==null && oncekiDenemeOrt!==null && haftaDenemeOrt>oncekiDenemeOrt*1.1 &&
              gunlerSorted.slice(0,3).some(d=>d.kaygi>0&&d.kaygi>7) && !kullanılanOlaylar.has('C_basari_kaygisi')) {
            aktifNegatifler.push('Başarı Kaygısı');
            kullanılanOlaylar.add('C_basari_kaygisi');
            kutu('Başarı Kaygısı — Beklenti Baskısı',
              'Bu haftaki deneme neti (' + haftaDenemeOrt.toFixed(1) + ') önceki ortalamayı (' + oncekiDenemeOrt.toFixed(1) + ') geçmesine rağmen kaygı skoru yüksek seyretti. ' +
              'Başarı paradoksu: yüksek performans "bu seviyeyi koruma" baskısı yaratmış, ödül değil yeni stres kaynağına dönüşmüştür. ' +
              'Öz-yeterlilik dışsal sonuca aşırı bağımlı.' +
              (olumsuzNotlar.length>0?' Öğrencinin sesi: "'+olumsuzNotlar[0].substring(0,60)+(olumsuzNotlar[0].length>60?'...':'')+'"':''),
              [255,238,215],[155,80,0]);
            bakiyeRiskler.push('Başarı kaygısı örüntüsü: sınav günü baskı altında performans kırılganlığı riski');

          } else if (toplamIsabet!==null&&toplamIsabet>85&&
                     gunlerSorted.slice(0,3).some(d=>negatifMoodlar.includes(d.mood))&&
                     !kullanılanOlaylar.has('C_yanilsamali_yetersizlik')) {
            kullanılanOlaylar.add('C_yanilsamali_yetersizlik');
            kutu('Yanılsamalı Yetersizlik — Bilişsel Çarpıtma',
              'Bu haftaki isabet oranı %' + toplamIsabet.toFixed(0) + ' ile yüksek; ancak duygu girişleri olumsuz seyretti. ' +
              'Nesnel veriler uzmanlık seviyesini gösterirken öğrenci yapamadığı %' + (100-toplamIsabet).toFixed(0) + '\'lik kısma odaklanarak tüm emeğini değersizleştiriyor. ' +
              'Mükemmeliyetçi blokaj riski.' +
              (olumsuzNotlar.length>0?' Öğrencinin sesi: "'+olumsuzNotlar[0].substring(0,60)+(olumsuzNotlar[0].length>60?'...':'')+'"':''),
              [255,240,220],[170,75,0]);

          } else if (haftaDenemeOrt!==null&&oncekiDenemeOrt!==null&&haftaDenemeOrt>oncekiDenemeOrt&&
                     ortKaygi>5&&olumsuzNotlar.some(n=>n.match(/şans|kolay|tesadüf|bilmiyorum/i))&&
                     !kullanılanOlaylar.has('C_imposter')) {
            aktifNegatifler.push('İmposter Sendromu');
            kullanılanOlaylar.add('C_imposter');
            kutu('Dışsal Atıf Hatası — İmposter Sendromu Belirtisi',
              'Yüksek performansa rağmen kaygı düşmedi (ort. ' + ortKaygi.toFixed(1) + '/10). ' +
              'Öğrenci başarısını kendi emeğine değil şansa bağlamaktadır. ' +
              'Başarı içselleştirilemediği için öz-güven inşası gerçekleşmemektedir.',
              [255,235,215],[155,75,0]);

          } else {
            const denemeSonrasiSifir = (() => {
              for (const e of haftaDenemeler) {
                const ertesi=gunlerSorted.find(d=>d.dk>e.dateKey);
                if(ertesi&&ertesi.kaygi>0&&ertesi.kaygi>9&&ertesi.soru===0) return {deneme:e,ertesi};
              }
              return null;
            })();
            if (denemeSonrasiSifir&&!kullanılanOlaylar.has('C_paralizi')) {
              aktifNegatifler.push('Deneme Sonrası Paralizi');
              kullanılanOlaylar.add('C_paralizi');
              kutu('Deneme Sonrası Şok — Akademik Paralizi',
                'Deneme performansı öğrencinin duygusal eşiğini aşmış; ertesi gün kaygı '+denemeSonrasiSifir.ertesi.kaygi+'/10\'a çıkarak akademik veri girişi sıfırlanmış. ' +
                'Bu total akademik ketlenme biyolojik bir tepkidir; koç bu noktayı "hatalı öğrenme" değil "eşik kalibrasyonu" olarak ele almalıdır.',
                [255,218,218],[175,15,15]);

            } else if (moodGunler.filter(d=>notrMoodlar.includes(d.mood)).length>=moodGunler.length*0.6&&
                       moodGunler.length>=3&&!kullanılanOlaylar.has('C_geri_cekilme')) {
              kullanılanOlaylar.add('C_geri_cekilme');
              kutu('Duygusal Geri Çekilme — Küntlük (Numbness)',
                'Bu haftaki duygu girişlerinin büyük çoğunluğu nötr/belirsiz. ' +
                'Öğrenci başarısızlık korkusuyla baş edemediği için duygularını kapatmıştır. ' +
                'Uzun vadede mekanikleşme ve ani tükenmişlik riski.',
                [240,235,255],[100,75,185]);

            } else if (haftaDenemeOrt!==null||toplamIsabet!==null) {
              kullanılanOlaylar.add('C_haftalik_dengeli');
              kutu('Öz-Yeterlilik: Bu Hafta Dengeli',
                (haftaDenemeOrt!==null?'Deneme neti: '+haftaDenemeOrt.toFixed(1)+'. ':'') +
                (toplamIsabet!==null?'İsabet: %'+toplamIsabet.toFixed(0)+'. ':'') +
                'Duygu dağılımı: '+pozitifGunSayisi+' olumlu, '+negatifGunSayisi+' olumsuz, '+notrGunSayisi+' nötr gün. ' +
                (negatifOrani!==null&&negatifOrani<0.3?'Nesnel başarı ile öz-algı bu hafta uyumlu.':'Küçük kaygı-başarı makası gözlemleniyor; izlenmeli.'),
                [230,255,240],[20,140,70]);
            } else {
              kullanılanOlaylar.add('C_haftalik_veri_yok');
              kutu('Öz-Yeterlilik: Karşılaştırma Verisi Yetersiz',
                'Bu hafta deneme/isabet verisi ile duygu verisi eşleştirilemedi.',
                [245,243,255],[130,120,200]);
            }
          }

        } else {
          const ilkYariDen = denemelerSirali.slice(0,Math.ceil(denemeSayisi/2));
          const ikinciYariDen = denemelerSirali.slice(Math.floor(denemeSayisi/2));
          const ilkYariNet = ilkYariDen.length>0?ilkYariDen.reduce((a,e)=>a+(e.net||0),0)/ilkYariDen.length:null;
          const ikinciYariNet = ikinciYariDen.length>0?ikinciYariDen.reduce((a,e)=>a+(e.net||0),0)/ikinciYariDen.length:null;
          const netDegisim = (ilkYariNet!==null&&ikinciYariNet!==null)?ikinciYariNet-ilkYariNet:null;
          const kaygiDizi2 = veriGunler.filter(d=>d.kaygi>0).map(d=>d.kaygi);
          const kaygiAyBasi = kaygiDizi2.slice(0,Math.ceil(kaygiDizi2.length/3));
          const kaygiAySonu = kaygiDizi2.slice(Math.floor(kaygiDizi2.length*2/3));
          const kaygiAyBasiOrt = kaygiAyBasi.length>0?kaygiAyBasi.reduce((a,b)=>a+b,0)/kaygiAyBasi.length:null;
          const kaygiAySonuOrt = kaygiAySonu.length>0?kaygiAySonu.reduce((a,b)=>a+b,0)/kaygiAySonu.length:null;
          const kaygiDegisim = (kaygiAyBasiOrt!==null&&kaygiAySonuOrt!==null)?kaygiAySonuOrt-kaygiAyBasiOrt:null;

          const felaketlesmeGunu = (() => {
            const kg=gunler.filter(d=>d.kaygi>0&&d.hataOrani!==null);
            if(!kg.length) return null;
            const en=kg.sort((a,b)=>b.kaygi-a.kaygi)[0];
            return (en.kaygi>=9&&ortHata!==null&&en.hataOrani>ortHata*1.5)?en:null;
          })();

          const soruTrendi2 = (() => {
            const ilk=gunler.slice(0,Math.floor(gunler.length/2)).filter(d=>d.soru>0);
            const son=gunler.slice(Math.floor(gunler.length/2)).filter(d=>d.soru>0);
            return {ilk:ilk.length>0?ilk.reduce((a,d)=>a+d.soru,0)/ilk.length:0,
                    son:son.length>0?son.reduce((a,d)=>a+d.soru,0)/son.length:0};
          })();

          const fizIyilikDizi2=veriGunler.filter(d=>d.enerji>0&&d.odak>0).map(d=>(d.enerji+d.odak)/2);
          const ortFizIyilik2=fizIyilikDizi2.length>0?fizIyilikDizi2.reduce((a,b)=>a+b,0)/fizIyilikDizi2.length:null;

          if (netDegisim!==null&&netDegisim>1&&kaygiDegisim!==null&&kaygiDegisim>0&&!kullanılanOlaylar.has('C_kirilgan_ozguven')) {
            aktifNegatifler.push('Kırılgan Öz-Güven');
            kullanılanOlaylar.add('C_kirilgan_ozguven');
            kutu('Kırılgan Öz-Güven Karakteristiği',
              'Ay boyunca netler '+ilkYariNet.toFixed(1)+'->'+ikinciYariNet.toFixed(1)+' (+'+netDegisim.toFixed(1)+') yükseldi; ancak kaygı '+(kaygiDegisim>0?'+':'')+kaygiDegisim.toFixed(1)+' puan daha arttı. ' +
              'Akademik gelişim psikolojik gelişimin önüne geçti. Öğrenci başarısını duygusal düzlemde reddediyor; netler onu tatmin etmiyor, sadece "bar"ı yükseltiyor. ' +
              'Koç görüşmelerinde nesnel verilerle öz-değer arasındaki bağ kasıtlı kurulmalıdır.',
              [255,228,215],[160,65,0]);
            bakiyeRiskler.push('Sınava yaklaştıkça başarı baskısının psikolojik yükü artabilir');

          } else if (felaketlesmeGunu&&!kullanılanOlaylar.has('C_felaketlestirme')) {
            aktifNegatifler.push('Felaketleştirme Trendi');
            kullanılanOlaylar.add('C_felaketlestirme');
            kutu('Felaketleştirme (Catastrophizing)',
              'Ay genelindeki %'+(toplamIsabet??0).toFixed(0)+' isabet başarısına rağmen, bir günlük yüksek hata (%'+felaketlesmeGunu.hataOrani.toFixed(0)+') anında kaygı '+felaketlesmeGunu.kaygi+'/10\'a çıktı. ' +
              'Tek günlük başarısızlık ay boyunca biriken tüm başarıyı sildi. ' +
              'Duygusal dayanıklılık (resilience) kritik derecede düşük. Reçete: "başarı günlüğü" tutturulmalı.',
              [255,222,215],[170,30,20]);
            bakiyeRiskler.push('Sınav günü tek zor soru felakete yol açabilir; reframing çalışması şart');

          } else if (soruTrendi2.son>soruTrendi2.ilk*1.2&&netDegisim!==null&&netDegisim<0&&!kullanılanOlaylar.has('C_caba_sonuc')) {
            aktifNegatifler.push('Çaba-Sonuç Uyumsuzluğu');
            kullanılanOlaylar.add('C_caba_sonuc');
            kutu('Çaba-Sonuç Uyumsuzluğu — Akademik Patinaj',
              'Soru sayısı artmasına rağmen net ortalaması '+Math.abs(netDegisim).toFixed(1)+' birim düştü. ' +
              '"Çok çalışıyorum ama olmuyor" döngüsüne girildi. Sorun miktar değil kalite ve doğru hedeflemedir. ' +
              'Bu patinaj "Öğrenilmiş Çaresizlik" (Learned Helplessness) davranışını tetikleyebilir.',
              [255,228,215],[155,70,0]);

          } else if (ortFizIyilik2!==null&&ortFizIyilik2<4&&(toplamIsabet!==null&&toplamIsabet>70)&&!kullanılanOlaylar.has('C_maskelenmis')) {
            aktifNegatifler.push('Maskelenmiş Fizyolojik Yıkım');
            kullanılanOlaylar.add('C_maskelenmis');
            kutu('Maskelenmiş Fizyolojik Yıkım',
              'İsabet oranı %'+toplamIsabet.toFixed(0)+' ile kabul edilebilir; ancak fizyolojik iyilik ort. '+ortFizIyilik2.toFixed(1)+'/10 ile kritik düşük. ' +
              'Öğrenci akademik olarak ayakta kalsa da bedensel ve ruhsal olarak iflasın eşiğindedir. ' +
              'Başarı fizyolojik yıkım pahasına elde ediliyor; bu tempo sürdürülebilir değildir.',
              [255,220,220],[175,20,20]);

          } else if (ortKaygi<4&&ortHata!==null&&ortHata>35&&!kullanılanOlaylar.has('C_sahte_ozguven')) {
            aktifNegatifler.push('Sahte Öz-Yeterlilik');
            kullanılanOlaylar.add('C_sahte_ozguven');
            kutu('Sahte Öz-Yeterlilik — Gerçeklikten Kopuk Öz-Güven',
              'Kaygı düşük (ort. '+ortKaygi.toFixed(1)+'/10) ancak hata oranı %'+ortHata.toFixed(0)+' ile yüksek. ' +
              'Öğrenci hatalarını görmezden gelerek "yapıyorum" illüzyonuna kapılmış. ' +
              'Analiz ve tekrar süreçleri ihmal ediliyor.',
              [255,240,215],[155,80,0]);

          } else if (denemeSayisi>=2&&denemeHaftaFizOrt!==null&&normalFizOrt2!==null&&
                     denemeHaftaFizOrt<normalFizOrt2*0.75&&!kullanılanOlaylar.has('C_somatizasyon')) {
            aktifNegatifler.push('Sınav Kaygısı Somatizasyonu');
            kullanılanOlaylar.add('C_somatizasyon');
            kutu('Sınav Kaygısı Somatizasyonu',
              'Deneme dönemlerinde fizyolojik enerji ort. '+denemeHaftaFizOrt.toFixed(1)+'/10 — normal günlerin ('+normalFizOrt2.toFixed(1)+'/10) '+Math.round((1-denemeHaftaFizOrt/normalFizOrt2)*100)+'% altında. ' +
              'Kaygı sınav günü beden üzerinden tezahür ediyor. Sınav günü rutini ve kaygı azaltıcı protokol geliştirilmeli.',
              [255,228,225],[165,45,25]);

          } else {
            kullanılanOlaylar.add('C_aylik_dengeli');
            kutu('Öz-Yeterlilik: Bu Ay Dengeli',
              (ilkYariNet!==null&&ikinciYariNet!==null?'Deneme net ort. (ay başı->sonu): '+ilkYariNet.toFixed(1)+'->'+ikinciYariNet.toFixed(1)+' ('+(ikinciYariNet>ilkYariNet?'+':'')+( ikinciYariNet-ilkYariNet).toFixed(1)+'). ':'') +
              (kaygiAyBasiOrt!==null&&kaygiAySonuOrt!==null?'Kaygı ort. (ay başı->sonu): '+kaygiAyBasiOrt.toFixed(1)+'->'+kaygiAySonuOrt.toFixed(1)+'/10 ('+(kaygiAySonuOrt<kaygiAyBasiOrt?'azaldı ✓':'arttı ⚠')+') . ':'') +
              (negatifOrani!==null&&negatifOrani<0.3?'Nesnel başarı ile öz-algı bu ay uyumlu.':'Küçük kaygı-başarı makası var; gelecek ay izlenmeli.'),
              [230,255,240],[20,140,70]);
          }
        }
      }


      // ── D. HAFIZA KONSOLİDASYONU VE AKADEMİK BORÇ ──────────────
      bolumBaslik([20,95,145],'D.  Hafıza Konsolidasyonu ve Akademik Borç (Hasar Tespiti)',
        period==='weekly'
          ? 'Bu hafta: hangi konular fizyolojik kriz altında çalışıldı -> hatalı kodlanma riski tespiti'
          : 'Ay boyunca: bilişsel borç bakiyesi, kriz dönemlerinde çalışılan konular ve Temiz Zihin Tekrarı planı');

      {
        // ── Yardımcı: belirli bir günün "kriz skoru" ──
        // Kriz = kaygı>8 VEYA uyku<6 VEYA enerji<3
        const krizGun = (d) => (d.kaygi>0&&d.kaygi>8)||(d.uyku>0&&d.uyku<6)||(d.enerji>0&&d.enerji<3);
        const odakDusukGun = (d) => d.odak>0&&d.odak<4;

        // Her kriz gününde hangi konular çalışıldı
        const krizGunleri = gunler.filter(d=>krizGun(d)&&d.soru>0);
        const krizKonular = {}; // konu -> {soru, hataPct, gunler[]}
        krizGunleri.forEach(d=>{
          soruEntries2.filter(e=>e.dateKey===d.dk).forEach(e=>{
            const k = e.topic||e.subject;
            if(!k) return;
            if(!krizKonular[k]) krizKonular[k]={soru:0,dogru:0,yanlis:0,dersler:new Set(),gunler:[]};
            krizKonular[k].soru+=(e.questions||0);
            krizKonular[k].dogru+=(e.correct||0);
            krizKonular[k].yanlis+=(e.wrong||0);
            krizKonular[k].dersler.add(e.subject);
            krizKonular[k].gunler.push(d.dk);
          });
        });
        // Kriz konularını hata oranına göre sırala (min 20 soru)
        const krizKonuArr = Object.entries(krizKonular)
          .filter(([k,v])=>v.soru>=20)
          .map(([k,v])=>({
            konu:k, soru:v.soru,
            hataPct: v.soru>0?(v.yanlis/v.soru*100):null,
            dersler:[...v.dersler].join('/'),
            gunSayisi:new Set(v.gunler).size
          }))
          .sort((a,b)=>(b.hataPct??0)-(a.hataPct??0));

        // Odak düşük günlerdeki yüksek soru üretimi
        const odakDusukYuksekSoru = gunler.filter(d=>odakDusukGun(d)&&d.soru>ortSoru*1.1);

        // Uyku borcu + uzun çalışma
        const uykuBorcuYeniKonu = gunler.filter(d=>d.uyku>0&&d.uyku<6&&d.sure>0);
        const uykuBorcuToplamSure = uykuBorcuYeniKonu.reduce((a,d)=>a+d.sure,0);

        if (period === 'weekly') {
          // ════════════════════════════════════════════════════
          // HAFTALIK D SENARYOLARI
          // ════════════════════════════════════════════════════

          // Vaka 1: Hatalı Kodlama Riski (en kritik — kriz + yüksek soru + düşük isabet)
          const hataKodlamaKonu = krizKonuArr.filter(k=>k.soru>=50&&k.hataPct!==null&&k.hataPct>30);
          if (hataKodlamaKonu.length>0&&!kullanılanOlaylar.has('D_hatali_kodlama')) {
            aktifNegatifler.push('Hatalı Kodlama Riski');
            kullanılanOlaylar.add('D_hatali_kodlama');
            const enKritik = hataKodlamaKonu[0];
            kutu('Hatalı Kodlama (Misconception) Riski — ' + enKritik.konu,
              enKritik.konu + ' konusu bu hafta fizyolojik kriz altında (' + enKritik.gunSayisi + ' günde ' + enKritik.soru + ' soru) çalışıldı ve isabet oranı %' + (100-enKritik.hataPct).toFixed(0) + ' ile düşük kaldı. ' +
              'Yüksek kaygı/uykusuzluk altında çalışılan bu konu, beyin tarafından "tehdit" olarak algılanmış ve mantıksal şemalar yerine korku odaklı kısa yollarla kaydedilmiştir. ' +
              'Bu konu "öğrenilmiş" sayılmamalı; 72 saat içinde temiz zihinle "Hasar Tespit Testi" yapılmalıdır.' +
              (hataKodlamaKonu.length>1?' Ek riskli konular: '+hataKodlamaKonu.slice(1).map(k=>k.konu+' (%'+(100-k.hataPct).toFixed(0)+' isabet)').join(', '):''),
              [255,215,215],[175,15,15]);
            bakiyeRiskler.push(enKritik.konu + ': kriz altında çalışıldı, hatalı kodlanma riski — temiz zihin testi gerekli');

          // Vaka 2: Bellek Sızıntısı
          } else if (uykuBorcuToplamSure>120&&!kullanılanOlaylar.has('D_bellek_sizintisi')) {
            aktifNegatifler.push('Bellek Sızıntısı');
            kullanılanOlaylar.add('D_bellek_sizintisi');
            const etkilenenDersler = [...new Set(uykuBorcuYeniKonu.flatMap(d=>soruEntries2.filter(e=>e.dateKey===d.dk).map(e=>e.subject)))].join(', ');
            kutu('Bellek Sızıntısı (Memory Leakage) — Konsolidasyon İflası',
              'Uyku < 6 saat olan günlerde toplam ' + uykuBorcuToplamSure + ' dakika çalışıldı. ' +
              'Beyin, uykuda gerçekleştirdiği "bilgiyi kalıcı belleğe aktarma" (konsolidasyon) işlemini uykusuzluk nedeniyle tamamlayamadı. ' +
              (etkilenenDersler ? 'Bu süreçte çalışılan ' + etkilenenDersler + ' konuları uzun süreli belleğe geçemeden silinme riski taşıyor.' : '') +
              ' Uyku hijyeni sağlanmadan yeni konu girişi yapmak akademik borca yatırımdır.',
              [255,220,215],[170,20,20]);
            bakiyeRiskler.push('Uykusuz çalışılan konular belleğe geçmeden silinmiş olabilir; tekrar zorunlu');

          // Vaka 3: Dikkat Borcu ve Yüzeysel İşleme
          } else if (odakDusukYuksekSoru.length>=1&&!kullanılanOlaylar.has('D_dikkat_borcu')) {
            aktifNegatifler.push('Dikkat Borcu');
            kullanılanOlaylar.add('D_dikkat_borcu');
            const etkilenenGun = odakDusukYuksekSoru[0];
            const etkilenenDers = soruEntries2.filter(e=>e.dateKey===etkilenenGun.dk)
              .sort((a,b)=>(b.questions||0)-(a.questions||0))[0];
            kutu('Dikkat Borcu ve Yüzeysel İşleme',
              'Odak ' + etkilenenGun.odak + '/10 iken günlük ortalamanın (' + Math.round(ortSoru) + ') üzerinde ' + etkilenenGun.soru + ' soru çözüldü. ' +
              (etkilenenDers ? etkilenenDers.subject + ' branşında ' : '') +
              'düşük odakla çözülen sorular beynin "derin işleme" (deep processing) katmanlarına ulaşmadı. ' +
              'Öğrenci "soru çözme eylemini" tamamlamış, konunun mantığını kavramayı değil. Akademik borç bakiyesi artıyor.',
              [255,238,215],[155,80,0]);

          // Vaka 4: Fizyolojik Bariyer (Geri Çağırma Güçlüğü)
          } else if (gunler.some(d=>d.enerji>0&&d.enerji<3&&d.soru>0)&&!kullanılanOlaylar.has('D_fizyolojik_bariyer')) {
            kullanılanOlaylar.add('D_fizyolojik_bariyer');
            const dusukEnerjiGun = gunler.filter(d=>d.enerji>0&&d.enerji<3&&d.soru>0)[0];
            const dersler = [...new Set(soruEntries2.filter(e=>e.dateKey===dusukEnerjiGun.dk).map(e=>e.subject))].join(', ');
            kutu('Fizyolojik Bariyer — Geri Çağırma Güçlüğü',
              'Enerji ' + dusukEnerjiGun.enerji + '/10 iken ' + dusukEnerjiGun.soru + ' soru çözüldü' + (dersler?' ('+dersler+')':'') + '. ' +
              'Bu koşullarda bilgi bellekte olsa bile, düşük enerji seviyesi beynin bilgiye ulaşma (retrieval) hızını ciddi biçimde yavaşlatmıştır. ' +
              '"Hatırlayamıyorum" hissi bilgi eksikliği değil, nörolojik yakıt sorunudur.',
              [255,240,215],[150,85,0]);

          // Vaka 5: Gecikmiş Unutma (Interference)
          } else if (krizGunleri.length>=1&&!kullanılanOlaylar.has('D_interference')) {
            kullanılanOlaylar.add('D_interference');
            const cokFazlaKonuGun = gunler.filter(d=>d.soru>0).map(d=>{
              const benzersizKonular = new Set(soruEntries2.filter(e=>e.dateKey===d.dk).map(e=>e.subject));
              return {d, konuSayisi:benzersizKonular.size};
            }).filter(x=>x.konuSayisi>=4);
            if (cokFazlaKonuGun.length>=1) {
              const g = cokFazlaKonuGun[0];
              kutu('Bilişsel Aşırı Yükleme — Proaktif İnterferans',
                g.d.soru + ' soruluk çalışmada ' + g.konuSayisi + ' farklı branş bir arada çalışıldı. ' +
                'Çok kısa sürede çok fazla konu yüklenmesi, bilgilerin birbirini "itmesine" (proactive interference) neden olmuştur. ' +
                'Bilgiler zihinde karışık bir yığın halindedir; hafıza bütünleşik değil parçalı kodladı.',
                [255,240,215],[145,80,0]);
            } else if (krizKonuArr.length>0) {
              kutu('Kriz Altında Çalışılan Konular — İzleme Altında',
                krizKonuArr.slice(0,3).map(k=>k.konu+' ('+k.soru+' soru, %'+(100-(k.hataPct??0)).toFixed(0)+' isabet)').join('; ') + '. ' +
                'Bu konular fizyolojik stres altında çalışıldı; kalıcı öğrenme garanti edilemez. Fırsatta tekrar edilmeli.',
                [255,245,220],[145,85,0]);
            } else {
              kullanılanOlaylar.add('D_haftalik_temiz');
              kutu('Hafıza Konsolidasyonu: Bu Hafta Temiz',
                'Bu haftaki çalışmaların büyük bölümü fizyolojik kriz dışında yapılmıştır. ' +
                (krizGunleri.length===0?'Kriz günü tespit edilmedi.':'Kriz günleri mevcut ancak konu hacmi sınırlı kaldı.') +
                ' Yüksek kaliteli bellek kaydı beklenmektedir.',
                [230,255,240],[20,140,70]);
            }
          } else {
            kullanılanOlaylar.add('D_haftalik_temiz');
            kutu('Hafıza Konsolidasyonu: Bu Hafta Temiz',
              'Bu haftaki çalışmalar büyük ölçüde fizyolojik kriz dışında gerçekleşti. ' +
              'Hatalı kodlanma riski düşük. Çalışılan konuların kalıcı belleğe geçme olasılığı yüksek.',
              [230,255,240],[20,140,70]);
          }

        } else {
          // ════════════════════════════════════════════════════
          // AYLIK D SENARYOLARI
          // ════════════════════════════════════════════════════

          // Kriz kümeleri (3+ ardışık gün)
          const ayKrizKumeleri = (() => {
            const kümeler=[]; let mevcut=[];
            [...gunler].sort((a,b)=>a.dk.localeCompare(b.dk)).forEach(d=>{
              if(krizGun(d)){mevcut.push(d);}
              else{if(mevcut.length>=3)kümeler.push([...mevcut]);mevcut=[];}
            });
            if(mevcut.length>=3) kümeler.push(mevcut);
            return kümeler;
          })();

          // Aylık toplam kriz günü sayısı
          const ayKrizGunSayisi = gunler.filter(d=>krizGun(d)).length;
          // Kriz konu borç listesi (min 20 soru, isabet < %75)
          const borcKonular = krizKonuArr.filter(k=>k.hataPct!==null&&k.hataPct>25);
          // Dominant branş (en çok soru çözülen)
          const dominantBrans = (() => {
            const brsSoru = subjects.map(s=>{
              const q=gunler.reduce((a,d)=>{const e=d.dersHata[s.name];return a+(e?e.q:0);},0);
              return {d:s.name,q};
            }).sort((a,b)=>b.q-a.q);
            return brsSoru[0]?.q > (toplamSoru*0.4) ? brsSoru[0] : null;
          })();
          // Aylık soru sayısı vs net karşılaştırması
          const yuksekSoruDusukNet = toplamSoru>DAILY_GOAL*aktifGunler.length*0.8 && ortNet!==null && ortHata!==null && ortHata>30;
          // Niteliksiz nicelik (yüksek soru + düşük isabet sürekliliği)
          const hataHaftalar = [0,1,2,3].map(w=>{
            const wStart = new Date(new Date(endKey).getTime()-(w+1)*7*24*3600*1000).toISOString().split('T')[0];
            const wEnd   = new Date(new Date(endKey).getTime()-w*7*24*3600*1000).toISOString().split('T')[0];
            const wG = gunler.filter(d=>d.dk>=wStart&&d.dk<=wEnd&&d.hataOrani!==null);
            return wG.length>0?wG.reduce((a,d)=>a+d.hataOrani,0)/wG.length:null;
          }).filter(v=>v!==null);
          const kronikYuksekHata = hataHaftalar.length>=2 && hataHaftalar.every(h=>h>30);

          // Vaka 1: Aylık Bilişsel Borç Bakiyesi (en önemli)
          if (borcKonular.length>0&&ayKrizGunSayisi>=3&&!kullanılanOlaylar.has('D_aylik_borc')) {
            aktifNegatifler.push('Bilişsel Borç Bakiyesi');
            kullanılanOlaylar.add('D_aylik_borc');
            const topBorclar = borcKonular.slice(0,4);
            kutu('Aylık Bilişsel Borç Bakiyesi — Hasar Kaydı',
              'Ay içinde ' + ayKrizGunSayisi + ' kriz günü tespit edildi. Bu günlerde çalışılan konulardan hasar riski taşıyanlar: ' +
                topBorclar.map(k=>k.konu+' ('+k.soru+' soru, %'+(100-k.hataPct).toFixed(0)+' isabet)').join('; ') + '. ' +
                'Bu konular akademik birer borçtur: "öğrenilmiş" sayılmamalı. ' +
                'Gelecek ayın ilk 10 gününde "Bilişsel Check-up" uygulanmalı — temiz zihin + düşük kaygı koşullarında tekrar edilmeli.',
              [255,215,215],[175,15,15]);
            topBorclar.forEach(k=>bakiyeRiskler.push(k.konu+': kriz döneminde (%'+(100-k.hataPct).toFixed(0)+' isabet) çalışıldı — tekrar zorunlu'));

          // Vaka 2: Geri Ödemesiz Bilişsel Kredi (ay başı uykusuz -> ay sonu hata)
          } else if (ayKrizKumeleri.length>0&&borcKonular.length>0&&!kullanılanOlaylar.has('D_geri_odeme')) {
            aktifNegatifler.push('Geri Ödemesiz Bilişsel Kredi');
            kullanılanOlaylar.add('D_geri_odeme');
            const kum = ayKrizKumeleri[0];
            const kumBaslangic = new Date(kum[0].dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
            const kumBitis = new Date(kum[kum.length-1].dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
            kutu('Geri Ödemesiz Bilişsel Kredi — Nedensellik Kanıtı',
              kumBaslangic + '–' + kumBitis + ' arasındaki ' + kum.length + ' günlük kriz evresinde temeli atılan konular (' +
              borcKonular.slice(0,3).map(k=>k.konu).join(', ') + ') ay genelinde düşük isabet vermeye devam ediyor. ' +
              'Ay başındaki uykusuz/stresli süreçte "hatalı" atılan temel, ay sonundaki testlere yansımaktadır. ' +
              'Bu konular sıfırdan, sağlıklı fizyolojiyle tekrar edilmelidir.',
              [255,220,215],[168,20,20]);
            bakiyeRiskler.push('Kriz evresinde atılan temel konular: sıfırdan tekrar gerekiyor');

          // Vaka 3: Niteliksiz Nicelik Kemikleşmesi
          } else if (kronikYuksekHata&&toplamSoru>200&&!kullanılanOlaylar.has('D_niteliksiz_nicelik')) {
            aktifNegatifler.push('Niteliksiz Nicelik Kemikleşmesi');
            kullanılanOlaylar.add('D_niteliksiz_nicelik');
            const enKemikBrans = dersHataArr[0];
            // Hata oranının haftalar içinde değişip değişmediğini kontrol et
            const haftaHataOranlari = [0,1,2,3].map(w=>{
              const wEnd = new Date(endKey+'T12:00:00'); wEnd.setDate(wEnd.getDate()-w*7);
              const wStart = new Date(wEnd); wStart.setDate(wEnd.getDate()-7);
              const wKey = wStart.toISOString().split('T')[0];
              const wEKey = wEnd.toISOString().split('T')[0];
              const wG = gunler.filter(d=>d.dk>=wKey&&d.dk<=wEKey&&d.hataOrani!==null);
              return wG.length>0?wG.reduce((a,d)=>a+d.hataOrani,0)/wG.length:null;
            }).filter(v=>v!==null);
            const hataSabit = haftaHataOranlari.length>=2 &&
              Math.max(...haftaHataOranlari)-Math.min(...haftaHataOranlari) < 5;
            kutu('Niteliksiz Nicelik Kemikleşmesi' + (hataSabit?' — Hata Farkındalığı Kaybı':''),
              'Ay boyunca toplam ' + toplamSoru + ' soru çözüldü ancak hata oranı sürekli %30+ seviyesinde kaldı. ' +
              (hataSabit?'Hata oranı haftalara göre değişmiyor — öğrenci aynı yanlışları tekrarlıyor, fark etmiyor. Bu "Hata Farkındalığı Kaybı" dur. ':'')+
              (enKemikBrans?enKemikBrans.d+' branşında %'+enKemikBrans.pct.toFixed(0)+' hata oranıyla hatalı mantık otomatize ediliyor. ':'')+
              'Reçete: hacmi kes, önce hata analizi — her yanlış için "neden yanlış?" sorusu.',
              [255,218,218],[172,18,18]);

          // Vaka 4: Veri Çöplüğü Sendromu
          } else if (yuksekSoruDusukNet&&!kullanılanOlaylar.has('D_veri_coplugu')) {
            kullanılanOlaylar.add('D_veri_coplugu');
            kutu('Veri Çöplüğü Sendromu — Depolama Hatası',
              'Ay boyunca yüksek soru hacmi (' + toplamSoru + ' soru, ort. ' + Math.round(ortSoru) + '/gün) ancak hata oranı yüksek (%' + ortHata.toFixed(0) + '). ' +
              'Öğrenci "bilgi girişi" yapmış ancak "bilgi işleme" (analiz/tekrar) yapmamıştır. ' +
              'Beyin bu verileri düzensiz bir depoya istiflemekte; deneme anında geri getirememektedir. ' +
              'Çözüm: hacim azaltılmalı, her çalışmanın arkasına 10 dk "hata analizi" bloku eklenmeli.',
              [248,240,255],[100,75,185]);

          // Vaka 5: Bilişsel Gölgelenme (Dominant Branş)
          } else if (dominantBrans&&!kullanılanOlaylar.has('D_golgelenme')) {
            kullanılanOlaylar.add('D_golgelenme');
            const digerBranslar = dersHataArr.filter(d=>d.d!==dominantBrans.d).slice(0,2);
            kutu('Bilişsel Gölgelenme — Dominant Branş Etkisi',
              dominantBrans.d + ' branşına ay boyunca toplam soruların %' + Math.round(dominantBrans.q/toplamSoru*100) + '\'i ayrıldı. ' +
              'Bu branşa harcanan aşırı mesai ve duygusal yük, diğer branşlardaki nöral ağları zayıflattı. ' +
              (digerBranslar.length>0 ? digerBranslar.map(d=>d.d+' (%'+d.pct.toFixed(0)+' hata)').join(', ') + ' branşlarında buna paralel yüksek hata gözlemleniyor. ' : '') +
              'Ay sonunda tek taraflı akademik gelişim ve diğer alanlarda çöküş riski aktif.',
              [255,238,215],[150,80,0]);

          // Vaka 6: Parçalı Bellek (Süreksiz Çalışma)
          } else if (aktifGunler.length < veriGunler.length*0.5 && ortHata!==null && ortHata<20 && !kullanılanOlaylar.has('D_parca_bellek')) {
            kullanılanOlaylar.add('D_parca_bellek');
            kutu('Parçalı Bellek (Fragmentation) — Öğrenme Süreksizliği',
              'Wellness verisi olan ' + veriGunler.length + ' günün yalnızca ' + aktifGunler.length + '\'inde akademik çalışma yapılmış. ' +
              'Aktif olmayan günlerdeki boşluklar, konular arasındaki mantıksal köprülerin kurulmasını engelledi. ' +
              'Bilgiler "adacıklar" halinde duruyor; bütünsel muhakeme gerektiren deneme sınavında bu adacıklar bağlanamayabilir.',
              [240,238,255],[100,90,175]);

          // Vaka 7: Dengeli ay
          } else {
            kullanılanOlaylar.add('D_aylik_temiz');
            kutu('Hafıza Konsolidasyonu: Bu Ay Dengeli',
              'Ay boyunca ' + ayKrizGunSayisi + ' kriz günü tespit edildi' + (ayKrizGunSayisi===0?' — kriz günü yok, ideal.':'. ') +
              (borcKonular.length===0 ? 'Yüksek riskli "bilişsel borç" konusu tespit edilmedi. ' : '') +
              'Toplam ' + toplamSoru + ' soru, ' + aktifGunler.length + ' aktif günde çalışıldı.',
              [230,255,240],[20,140,70]);
          }

          // Kriz kümeleri özeti (varsa, her zaman göster)
          if (ayKrizKumeleri.length>0) {
            Y=pdfCheck(doc,Y,14);
            doc.setFont(PF,'bold'); doc.setFontSize(6.5); doc.setTextColor(160,30,30);
            doc.text('Kriz Kümeleri (3+ ardışık gün, Bilişsel Borç Statüsü):', 16, Y); Y+=5;
            ayKrizKumeleri.slice(0,3).forEach((kum,i)=>{
              const bas = new Date(kum[0].dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
              const bit = new Date(kum[kum.length-1].dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
              const kumKonular = Object.entries(krizKonular)
                .filter(([k,v])=>kum.some(d=>v.gunler.includes(d.dk)))
                .map(([k])=>k).slice(0,3).join(', ');
              dipnot((i+1)+'. Küme: '+bas+'–'+bit+' ('+kum.length+' gün)' + (kumKonular?' | Riskli konular: '+kumKonular:''));
            });
          }
        }
      }

      // ── DUYGU – DERS VERİMİ ──────────────────────────────────────
      const moodDers = {};
      gunler.forEach(d=>{if(!d.mood||!d.soru)return;const sm={};soruEntries2.filter(e=>e.dateKey===d.dk).forEach(e=>{if(!sm[e.subject])sm[e.subject]=0;sm[e.subject]+=(e.questions||0);});if(!moodDers[d.mood])moodDers[d.mood]={};Object.entries(sm).forEach(([s,q])=>{if(!moodDers[d.mood][s])moodDers[d.mood][s]=0;moodDers[d.mood][s]+=q;});});
      const moodDersGirdi=Object.entries(moodDers).filter(([m,ss])=>Object.values(ss).some(v=>v>0));
      if(moodDersGirdi.length>0){
        Y=pdfCheck(doc,Y,12);
        doc.setFont(PF,'bold');doc.setFontSize(7.5);doc.setTextColor(40,115,155);
        doc.text('Günlük Çalışmada Duygu-Ders Dağılımı (soru çözümü/konu)',16,Y);Y+=3;
        doc.setFont(PF,'normal');doc.setFontSize(6);doc.setTextColor(130,120,160);
        doc.text(tx('Deneme sınavları hariç — yalnızca günlük antrenman verileri'),16,Y);Y+=5;
        const mL={excited:'Heyecanlı',good:'İyiyim',focused:'Odaklı',ok:'İdare Eder',tired:'Yorgunum',anxious:'Kaygılı',sad:'Mutsuzum'};
        const mC={excited:[170,120,0],good:[35,145,175],focused:[75,55,195],ok:[115,105,195],tired:[195,75,115],anxious:[175,35,35],sad:[75,85,105]};
        moodDersGirdi.forEach(([mood,subs])=>{
          const en=Object.entries(subs).sort((a,b)=>b[1]-a[1])[0];if(!en)return;
          Y=pdfCheck(doc,Y,10);const mc=mC[mood]||[100,100,100];
          doc.setFillColor(Math.round(mc[0]*0.08+238*0.92),Math.round(mc[1]*0.08+238*0.92),Math.round(mc[2]*0.08+238*0.92));
          doc.roundedRect(15,Y,180,9,1.5,1.5,'F');doc.setFillColor(mc[0],mc[1],mc[2]);doc.roundedRect(15,Y,3,9,1,1,'F');
          doc.setFont(PF,'bold');doc.setFontSize(7.5);doc.setTextColor(40,40,80);
          doc.text((mL[mood]||mood)+' ->',20,Y+6);
          doc.setFont(PF,'normal');doc.setFontSize(7.5);doc.setTextColor(60,60,100);
          doc.text('En çok: '+en[0]+' ('+en[1]+' soru)',56,Y+6);
          const ozet=Object.entries(subs).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([s,q])=>dersKisa(s)+'('+q+')').join('  ');
          doc.setFontSize(6.5);doc.setTextColor(100,100,130);doc.text(ozet,128,Y+6);Y+=11;
        });
      }

      // Bakiye riskler
      if(bakiyeRiskler.length>0){
        Y=pdfCheck(doc,Y, bakiyeRiskler.length * 20 + 15); // başlık + tüm dipnotlar için yer
        doc.setFont(PF,'bold');doc.setFontSize(6.5);doc.setTextColor(130,120,175);
        doc.text('Geçmişten Gelen Bakiye Riskler (izleniyor):',16,Y);Y+=5;
        bakiyeRiskler.forEach((r,i)=>dipnot((i+1)+'. '+r));
      }


        // ══════════════════════════════════════════
        // E. DENEME SINAVI — KISA KLİNİK ÖZET
        // ══════════════════════════════════════════
        if (denemEntries2.length >= 1) {
          Y = pdfCheck(doc, Y, 20);
          bolumBaslik([80,50,200], 'E.  Deneme Sınavı — Klinik Özet',
            'Kaygı-performans ilişkisi ve öncelikli ders');

          // Grupla
          const dGrp={};
          denemEntries2.forEach(e=>{
            const k=e.examId||e.dateKey;
            if(!dGrp[k]) dGrp[k]={dateKey:e.dateKey,dersler:{}};
            const net=Math.max(0,(e.correct||0)-(e.wrong||0)/3);
            if(!dGrp[k].dersler[e.subject]) dGrp[k].dersler[e.subject]={net:0,count:0};
            dGrp[k].dersler[e.subject].net+=net; dGrp[k].dersler[e.subject].count++;
          });
          const denemSira=Object.values(dGrp).sort((a,b)=>a.dateKey.localeCompare(b.dateKey));
          const lgsSoruE={'Türkçe':20,'Matematik':20,'Fen Bilimleri':20,'İnkılap Tarihi':10,'Din Kültürü':10,'İngilizce':10};
          const topNet=d=>Object.values(d.dersler).reduce((a,v)=>a+v.net,0);
          const lgsPuan=n=>Math.min(500,Math.max(100,Math.round(100+n*4.444)));

          // Ders ort
          const dOrt={};
          denemSira.forEach(d=>Object.entries(d.dersler).forEach(([ders,v])=>{
            if(!dOrt[ders]) dOrt[ders]={net:0,cnt:0,max:lgsSoruE[ders]||10};
            dOrt[ders].net+=v.net; dOrt[ders].cnt++;
          }));
          const dArr=Object.entries(dOrt)
            .map(([d,v])=>({d,ort:Math.round(v.net/v.cnt*10)/10,max:v.max,pct:Math.min(100,Math.round(v.net/v.cnt/v.max*100))}))
            .sort((a,b)=>a.pct-b.pct);
          const enZayif=dArr[0];
          const enGuclu=dArr[dArr.length-1];
          const ortPuan=denemSira.length>0?Math.round(denemSira.reduce((a,d)=>a+lgsPuan(topNet(d)),0)/denemSira.length):null;

          // Kaygı etkisi
          const krizD=denemSira.filter(d=>(parseFloat((days[d.dateKey]||{}).kaygi)||0)>=7);
          const normD=denemSira.filter(d=>{const k=parseFloat((days[d.dateKey]||{}).kaygi)||0;return k>0&&k<7;});
          const krizOrt=krizD.length>0?Math.round(krizD.reduce((a,d)=>a+lgsPuan(topNet(d)),0)/krizD.length):null;
          const normOrt=normD.length>0?Math.round(normD.reduce((a,d)=>a+lgsPuan(topNet(d)),0)/normD.length):null;

          // Satır 1: genel özet
          const c1=(ortPuan?denemSira.length+' denemede tahmini LGS puan ortalamas\u0131 ~'+ortPuan+'/500. ':'')+
            (enGuclu?'En güçlü ders: '+enGuclu.d+' (ort. '+enGuclu.ort+'/'+enGuclu.max+' net). ':'')+
            (enZayif&&enZayif.d!==enGuclu?.d?'Öncelikli ders: '+enZayif.d+' (ort. '+enZayif.ort+'/'+enZayif.max+' net) — çalışma artırılmalı.':'');

          // Satır 2: kaygı etkisi
          const fark=krizOrt&&normOrt?normOrt-krizOrt:null;
          const c2=fark!==null?(fark>20?'Kaygılı günlerde deneme puanı ~'+fark+' puan düşüyor — sınav günü kaygı yönetimi kritik.':
                               fark>5 ?'Kaygı deneme performansını hafifçe etkiliyor (~'+fark+' puan fark).':
                                        'Kaygı deneme performansını belirgin etkilemiyor — iyi.'):'';

          if (c1) {
            kutu('Deneme Özeti', c1+(c2?' '+c2:''), [230,225,255],[80,50,200]);
          }
        }


      // ── BÜTÜNCÜL KLİNİK DEĞERLENDİRME VE SÜREÇ SAĞLIĞI ─────────
      Y=pdfCheck(doc,Y,14);
      Y=pdfSecHeader(doc,
        period==='weekly'?'BÜTÜNCÜL KLİNİK DEĞERLENDİRME — HAFTALIK':'BÜTÜNCÜL KLİNİK DEĞERLENDİRME — AYLIK',
        Y,20,140,100);
      doc.setFont(PF,'normal');doc.setFontSize(6.5);doc.setTextColor(100,90,140);
      doc.text(
        period==='weekly'
          ? 'Tüm modüllerin birleşimi: "Ayın Genel Fotoğrafı" — klinik durum tespiti, iletişim stratejisi ve acil eylem'
          : 'A->D modüllerinin makro sentezi: trend yönü, egemen risk karakteristiği ve gelecek dönem planı',
        16,Y,{maxWidth:178});
      Y+=8;

      {
        // ═══════════════════════════════════════════════════════
        // ORTAK ALTYAPI — Her iki mod için kullanılacak değerler
        // ═══════════════════════════════════════════════════════

        // Genel özet skorlar (null-safe)
        const genelUyku   = fn(veriGunler.filter(d=>d.uyku>0),'uyku')   ?? null;
        const genelKaygi  = fn(veriGunler.filter(d=>d.kaygi>0),'kaygi') ?? null;
        const genelEnerji = fn(veriGunler.filter(d=>d.enerji>0),'enerji')??null;
        const genelOdak   = fn(veriGunler.filter(d=>d.odak>0),'odak')   ??null;
        const genelSosyal = fn(veriGunler.filter(d=>d.sosyal>0),'sosyal')??null;
        const genelIsabet = ortHata!==null ? 100-ortHata : null;

        // Toplam aktif negatif sayısı
        const kritikSayisi = aktifNegatifler.length;
        const bakiyeSayisi = bakiyeRiskler.length;

        // Tüm modüllerden gelen en kritik bulgular
        const krizVar      = aktifNegatifler.some(r=>['Aktif Stres Blokajı','Kümülatif Uyku Borcu',
          'Hatalı Kodlama Riski','Bellek Sızıntısı','Amigdala Blokajı','Kemikleşmiş Dijital Kaçış',
          'Reaktif Dijital Kaçış','Sirkadiyen Sabotaj','Bilişsel Borç Bakiyesi'].includes(r));
        const fizyolojikCokus = (genelUyku!==null&&genelUyku<6.5) && (genelEnerji!==null&&genelEnerji<4);
        const dijitalAnes  = aktifNegatifler.some(r=>r.includes('Dijital')||r.includes('Anestezi'));
        const ozguvenSorunu = aktifNegatifler.some(r=>['Kırılgan Öz-Güven','Felaketleştirme Trendi',
          'İmposter Sendromu','Başarı Kaygısı','Sahte Öz-Yeterlilik'].includes(r));
        const robotikleme  = aktifNegatifler.includes('Robotikleşme — Tükenmişlik Öncesi');
        const patinaj      = aktifNegatifler.some(r=>r.includes('Patinaj')||r.includes('Uyumsuzluğu'));
        const pozitifDonusum = kritikSayisi===0 && bakiyeSayisi<=1;

        // Koç iletişim profili
        const iletisimProfili = (() => {
          if (krizVar || fizyolojikCokus) return 'krizli';
          if (robotikleme || patinaj)     return 'patinaj';
          if (ozguvenSorunu)              return 'ozguven';
          if (pozitifDonusum)             return 'optimal';
          return 'dengeli';
        })();

        // Veri özet stringi (her kutuda kullanılacak)
        const veriOzet = [
          genelUyku!==null    ? 'Uyku: '+genelUyku.toFixed(1)+' sa'     : null,
          genelKaygi!==null   ? 'Kaygı: '+genelKaygi.toFixed(1)+'/10'   : null,
          genelEnerji!==null  ? 'Enerji: '+genelEnerji.toFixed(1)+'/10' : null,
          genelIsabet!==null  ? 'İsabet: %'+genelIsabet.toFixed(0)       : null,
          genelSosyal!==null  ? 'Sosyal medya: '+genelSosyal.toFixed(1)+'sa/gün' : null,
        ].filter(Boolean).join(' | ');

        if (period === 'weekly') {
          // ═══════════════════════════════════════════════════
          // HAFTALIK BÜTÜNCÜL
          // ═══════════════════════════════════════════════════

          // AI varsa kodlu bütüncül vakayı atla — AI zaten kapsamlı analiz yaptı
          // Vaka tespiti: en uygun ana vakayı seç
          let anaVaka = null;

          // Vaka 1: Akut Sistem Çöküşü
          if (genelUyku!==null&&genelUyku<6 && genelKaygi!==null&&genelKaygi>9 &&
              genelSosyal!==null&&genelSosyal>3 && genelIsabet!==null&&genelIsabet<65) {
            anaVaka = 'total_crash';
            aktifNegatifler.push('Akut Sistem Çöküşü');
            kutu('BÜTÜNCÜL TANI: Akut Sistem Çöküşü (Total Crash)',
              'Dört temel kriter eş zamanlı kritik: uyku ' + genelUyku.toFixed(1) + ' sa, kaygı ' + genelKaygi.toFixed(1) + '/10, sosyal medya ' + genelSosyal.toFixed(1) + ' sa/gün, isabet %' + genelIsabet.toFixed(0) + '. ' +
              'Fizyolojik tükenmişlik ve duygusal aşırı yüklenme, dijital kaçışla birleşerek akademik üretimi niteliksiz hale getirmiştir. ' +
              'Bu hafta bitirilen konular "öğrenilmiş" değil "savuşturulmuş" veri statüsündedir. ' +
              (kritikSayisi>0?'Tespit edilen ' + kritikSayisi + ' aktif risk faktörü birbirini besleyen bir sarmal oluşturuyor.':''),
              [255,210,210],[175,10,10]);

          // Vaka 2: Kırılgan Başarı
          } else if (genelIsabet!==null&&genelIsabet>80 && genelKaygi!==null&&genelKaygi>7 && genelUyku!==null&&genelUyku<6.5) {
            anaVaka = 'kirilgan_basari';
            kutu('BÜTÜNCÜL TANI: Kırılgan Başarı (High-Stakes Production)',
              'İsabet %' + genelIsabet.toFixed(0) + ' ile yüksek; ancak kaygı ' + genelKaygi.toFixed(1) + '/10 ve uyku ' + genelUyku.toFixed(1) + ' sa. ' +
              'Başarı ağır bir fizyolojik bedelle satın alınıyor. ' +
              'Bu tempo sürdürülemez; akademik çıktı görünürde iyi olsa da altta yatan fizyolojik erozyon devam ediyor. ' +
              (bakiyeSayisi>0?bakiyeSayisi+' bakiye risk birikmiş durumda.':''),
              [255,235,210],[155,75,0]);

          // Vaka 3: Reaktif Kaçınma ve Telafi Döngüsü
          } else if (aktifNegatifler.includes('Reaktif Telafi') || aktifNegatifler.includes('Akademik Anestezi')) {
            anaVaka = 'telafi_dongusu';
            kutu('BÜTÜNCÜL TANI: Reaktif Kaçınma ve Telafi Döngüsü',
              'Bu hafta boyunca "kaçınma -> telafi" döngüsü gözlemlendi. ' +
              (aktifNegatifler.includes('Akademik Anestezi')?'Güçlü branşa sığınma ile kaçışı maskeleme; ':'')+
              (aktifNegatifler.includes('Reaktif Telafi')?'Kötü deneme sonrası kontrolsüz soru artışı. ':'') +
              'Sistemin ritmi bozuk: nitelikli çalışma yerine duygusal yönetim önce geliyor. ' +
              veriOzet,
              [255,238,215],[150,80,0]);

          // Vaka 4: Pasif Akademik Çürüme
          } else if (aktifNegatifler.includes('Pasif Öğrenme İllüzyonu') ||
                     (genelSosyal!==null&&genelSosyal>2&&ortSoru<DAILY_GOAL*0.3)) {
            anaVaka = 'pasif_curume';
            kutu('BÜTÜNCÜL TANI: Pasif Akademik Çürüme',
              'Öğrenci günü ekran başında (ders izleyerek veya eğlenerek) bitiriyor; kendi başına akademik üretim yapacak bilişsel enerji bulunamıyor. ' +
              (genelSosyal!==null?'Sosyal medya: '+genelSosyal.toFixed(1)+' sa/gün. ':'')+
              (ortSoru>0?'Soru ort.: '+Math.round(ortSoru)+'/gün (hedef: '+DAILY_GOAL+'). ':'') +
              'Dijital sarmal: pasif tüketim aktif üretimi eliyor.',
              [248,238,255],[105,55,175]);

          // Vaka 5: Dengeli Akış
          } else if (genelUyku!==null&&genelUyku>=7.5 && genelKaygi!==null&&genelKaygi>=4&&genelKaygi<=6 &&
                     (genelSosyal===null||genelSosyal<1.5) && genelIsabet!==null&&genelIsabet>=85) {
            anaVaka = 'optimal_flow';
            kutu('BÜTÜNCÜL TANI: Dengeli Akış (Optimal Performance)',
              'İdeal akademik akış (Flow) koşulları: uyku ' + genelUyku.toFixed(1) + ' sa, kaygı ' + genelKaygi.toFixed(1) + '/10 (fonksiyonel bölge), isabet %' + genelIsabet.toFixed(0) + '. ' +
              'Fizyolojik dengenin duygusal stabilitiyi beslediği, bunun da doğrudan akademik isabete yansıdığı sürdürülebilir bir dönem. ' +
              'Bu ritim korunmalı; doz yavaşça artırılabilir.',
              [220,255,235],[15,130,65]);

          // Genel durum
          } else {
            anaVaka = 'genel';
            const durumRenk = kritikSayisi>=3?[255,222,215]:kritikSayisi>=1?[255,240,215]:[225,248,235];
            const durumKenar = kritikSayisi>=3?[170,20,20]:kritikSayisi>=1?[145,80,0]:[20,130,65];
            const durumBaslik = kritikSayisi>=3?'BÜTÜNCÜL TANI: Çoklu Risk Faktörü':kritikSayisi>=1?'BÜTÜNCÜL TANI: İzleme Gerektiren Hafta':'BÜTÜNCÜL TANI: Bu Hafta Dengeli';
            kutu(durumBaslik,
              veriOzet + '. ' +
              (kritikSayisi>0?'Aktif risk faktörleri: '+aktifNegatifler.slice(0,4).join(', ')+'. ':'')+
              (bakiyeSayisi>0?bakiyeSayisi+' bakiye risk izleniyor.':'Aktif klinik risk tespit edilmedi.'),
              durumRenk, durumKenar);
          }

          // KRİZ HAFIZASI: bu haftanın kriz günlerini özet listele
          const haftaKrizGunleri = veriGunler.filter(d=>(d.kaygi>=8)||(d.uyku>0&&d.uyku<6)||(!d.soru&&d.kaygi>=7));
          if (haftaKrizGunleri.length>0) {
            Y=pdfCheck(doc,Y,14);
            doc.setFont(PF,'bold');doc.setFontSize(7);doc.setTextColor(170,30,30);
            doc.text(tx('Bu Haftanın Kriz Günleri (' + haftaKrizGunleri.length + ' gün):'), 16, Y); Y+=5;
            haftaKrizGunleri.forEach(d=>{
              const tarih = new Date(d.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'short'});
              const parcalar = [];
              if (d.kaygi>=8) parcalar.push('Kaygı ' + d.kaygi + '/10');
              if (d.uyku>0&&d.uyku<6) parcalar.push('Uyku ' + d.uyku + ' sa');
              if (!d.soru&&d.kaygi>=7) parcalar.push('Akademik Felç');
              dipnot('• ' + tarih + ': ' + parcalar.join(' + '));
            });
          }

          // ── İletişim Stratejisi ──────────────────────────────
          Y=pdfCheck(doc,Y,12);
          doc.setFont(PF,'bold');doc.setFontSize(7.5);doc.setTextColor(40,80,140);
          doc.text('Koç İletişim Stratejisi:', 16, Y); Y+=5;

          const stratejiMap = {
            krizli:   'Akademik baskıdan kaçının. Bu hafta rakamlarla değil fiziksel yorgunluk, uyku kalitesi ve duygusal durum üzerine şefkatli denetim yapın. "Kaç soru çözdün?" değil "nasıl hissediyorsun?" ile başlayın.',
            patinaj:  'Niceliği değil stratejiyi sorgulayın. "Bu hafta ne kadar çözdün?" değil "bu hafta ne öğrendin?" sorusuyla başlayın. Hata analizi ritüeli oluşturun.',
            ozguven:  'Nesnel verileri somut şekilde paylaşın: "Bu hafta %[isabet] isabet oranı tutturuldu." Başarı kanıtlarını öğrencinin kendi sesiyle tekrar ettirin.',
            optimal:  'Ritmi koru ve dozu artır. Pozitif ilerlemeyi teyit et; yeni zorluk eşiği belirle.',
            dengeli:  'Dengeli bir hafta. Hangi alanın güçlendirilmesi gerektiğini birlikte belirleyin; önümüzdeki hafta için somut bir odak noktası koyun.',
          };
          dipnot(stratejiMap[iletisimProfili]);

          // ── Eylem Önerileri ──────────────────────────────────
          const oneriListesi = [];
          if(aktifNegatifler.some(r=>r.includes('Stres')||r.includes('Blokaj')||r.includes('Paralizi')))
            oneriListesi.push('48 saat içinde: kaygı tetikleyicisini konuş, mikro hedefler (15 dk bloklar) devreye al');
          if(aktifNegatifler.some(r=>r.includes('Uyku')||r.includes('Sirkadiyen')||r.includes('Biyolojik')))
            oneriListesi.push('3 gece 8+ saat uyku; gece 22:00 sonrası ekran sıfır');
          if(bakiyeRiskler.some(r=>r.includes('hatalı')||r.includes('tekrar')||r.includes('kriz')))
            oneriListesi.push('Kriz altında çalışılan konuları bu hafta "Hasar Tespit Testi" ile sorgula');
          if(aktifNegatifler.some(r=>r.includes('Dijital')||r.includes('Anestezi')||r.includes('Kaçış')))
            oneriListesi.push('Sosyal medya için günlük 45 dk üst limit; çalışma öncesi 15 dk ekransız başlama ritüeli');
          if(aktifNegatifler.some(r=>r.includes('Klinik Kaçınma')||r.includes('Baraj')))
            oneriListesi.push('Kaçınılan branşta günde 10 dk "kapı aralama" seansı: en kolay konu + nefes');
          if(dLgs<60)
            oneriListesi.push('Sınava '+dLgs+' gün: yeni konu değil bilinen konularda hata sıfırlama önceliği');
          if(oneriListesi.length===0)
            oneriListesi.push('Mevcut ritmi koru; önümüzdeki hafta dozu %15 artır');

          Y=pdfCheck(doc,Y,12);
          doc.setFont(PF,'bold');doc.setFontSize(7.5);doc.setTextColor(40,80,140);
          doc.text('Öncelikli Eylem Adımları:', 16, Y); Y+=5;
          oneriListesi.forEach((o,i)=>dipnot((i+1)+'. '+o));


        } else {
          // ═══════════════════════════════════════════════════
          // AYLIK BÜTÜNCÜL
          // ═══════════════════════════════════════════════════

          // Regresyon hesabı (ay başı vs ay sonu)
          const ayBasiGunler = [...gunler].sort((a,b)=>a.dk.localeCompare(b.dk)).slice(0,Math.ceil(gunler.length/3));
          const aySonuGunler = [...gunler].sort((a,b)=>a.dk.localeCompare(b.dk)).slice(Math.floor(gunler.length*2/3));

          const ayBasiKaygi  = fn(ayBasiGunler.filter(d=>d.kaygi>0),'kaygi');
          const aySonuKaygi  = fn(aySonuGunler.filter(d=>d.kaygi>0),'kaygi');
          const ayBasiIsabet = (() => {
            const g=ayBasiGunler.filter(d=>d.hataOrani!==null);
            return g.length>0?100-g.reduce((a,d)=>a+d.hataOrani,0)/g.length:null;
          })();
          const aySonuIsabet = (() => {
            const g=aySonuGunler.filter(d=>d.hataOrani!==null);
            return g.length>0?100-g.reduce((a,d)=>a+d.hataOrani,0)/g.length:null;
          })();
          const ayBasiSosyal2 = fn(ayBasiGunler.filter(d=>d.sosyal>0),'sosyal');
          const aySonuSosyal2 = fn(aySonuGunler.filter(d=>d.sosyal>0),'sosyal');

          const kaygiTrend   = (ayBasiKaygi!==null&&aySonuKaygi!==null)?aySonuKaygi-ayBasiKaygi:null;
          const isabetTrend  = (ayBasiIsabet!==null&&aySonuIsabet!==null)?aySonuIsabet-ayBasiIsabet:null;
          const sosyalTrend2 = (ayBasiSosyal2!==null&&aySonuSosyal2!==null)?aySonuSosyal2-ayBasiSosyal2:null;

          // Ay sonu son 10 gün burnout kontrolü
          const son10Gun = [...gunler].sort((a,b)=>b.dk.localeCompare(a.dk)).slice(0,10);
          const son10KaygiOrt = fn(son10Gun.filter(d=>d.kaygi>0),'kaygi');
          const son10EnerjiOrt = fn(son10Gun.filter(d=>d.enerji>0),'enerji');
          const son10IsabetOrt = (() => {
            const g=son10Gun.filter(d=>d.hataOrani!==null);
            return g.length>0?100-g.reduce((a,d)=>a+d.hataOrani,0)/g.length:null;
          })();
          const son10AktifGun = son10Gun.filter(d=>d.soru>0).length;
          const burnoutRisk = son10KaygiOrt!==null&&son10KaygiOrt>7 &&
                              son10EnerjiOrt!==null&&son10EnerjiOrt<4 &&
                              son10AktifGun<5;

          // Vaka seçimi
          let ayAnaVaka = null;

          // Vaka 1: Süreç Sonu Tükenmişliği
          if (burnoutRisk) {
            ayAnaVaka = 'burnout';
            aktifNegatifler.push('Ay Sonu Tükenmişliği');
            kutu('AYLIK FOTOĞRAF: Süreç Sonu Tükenmişliği (Burnout)',
              'Ay sonunun son 10 günü: kaygı ort. '+(son10KaygiOrt??0).toFixed(1)+'/10, enerji ort. '+(son10EnerjiOrt??0).toFixed(1)+'/10, aktif gün '+son10AktifGun+'/10. ' +
              'Ay başındaki yüksek tempo ay sonunda sistemin kapanmasına yol açtı. Kapasite üstü yüklenme akademik çöküşü tetiklemiştir. ' +
              (genelIsabet!==null?'Dönem isabet: %'+genelIsabet.toFixed(0)+'. ':'')+
              'Gelecek ay "Reset" ile başlanmalı: ilk 3 gün sadece uyku ve dinlenme.',
              [255,210,210],[175,10,10]);
            bakiyeRiskler.push('Ay sonu tükenmişliği: gelecek aya kriz durumuyla girilmemeli');

          // Vaka 2: Negatif Regresyon
          } else if (kaygiTrend!==null&&kaygiTrend>1.5 && isabetTrend!==null&&isabetTrend<-5 &&
                     (sosyalTrend2===null||sosyalTrend2>0.3)) {
            ayAnaVaka = 'negatif_regresyon';
            aktifNegatifler.push('Süreç Erozyonu');
            kutu('AYLIK FOTOĞRAF: Negatif Regresyon — Süreç Erozyonu',
              'Ay boyunca tüm göstergeler aşağı yönlü: ' +
              (ayBasiKaygi!==null&&aySonuKaygi!==null?'Kaygı '+ayBasiKaygi.toFixed(1)+'->'+aySonuKaygi.toFixed(1)+'/10 (+'+kaygiTrend.toFixed(1)+'), ':'')+
              (ayBasiIsabet!==null&&aySonuIsabet!==null?'İsabet %'+ayBasiIsabet.toFixed(0)+'->%'+aySonuIsabet.toFixed(0)+' ('+isabetTrend.toFixed(1)+'), ':'')+
              (ayBasiSosyal2!==null&&aySonuSosyal2!==null&&sosyalTrend2!==null?'Sosyal medya '+ayBasiSosyal2.toFixed(1)+'->'+aySonuSosyal2.toFixed(1)+' sa/gün. ':'') +
              'Ay boyunca öğrencinin dayanıklılığı zayıflamış, disiplinden kaçış dijital uyuşmaya evrildi. Acil "Reset" gereklidir.',
              [255,212,212],[172,15,15]);

          // Vaka 3: Pozitif Dönüşüm
          } else if (kaygiTrend!==null&&kaygiTrend<-1 && isabetTrend!==null&&isabetTrend>5) {
            ayAnaVaka = 'pozitif_donusum';
            kutu('AYLIK FOTOĞRAF: Pozitif Dönüşüm — Sistem Adaptasyonu',
              'Ay sonu -> ay başı karşılaştırması olumlu: ' +
              (ayBasiKaygi!==null&&aySonuKaygi!==null?'Kaygı '+ayBasiKaygi.toFixed(1)+'->'+aySonuKaygi.toFixed(1)+'/10 ('+kaygiTrend.toFixed(1)+'), ':'')+
              (ayBasiIsabet!==null&&aySonuIsabet!==null?'İsabet %'+ayBasiIsabet.toFixed(0)+'->%'+aySonuIsabet.toFixed(0)+' (+'+isabetTrend.toFixed(1)+' puan). ':'') +
              'Öğrenci sürecin zorluğuna alışmış, kendi denge mekanizmasını kurmaya başladı. ' +
              'Akademik öz-güven inşası başlamıştır; bu momentum korunmalı.',
              [218,252,232],[12,125,62]);

          // Vaka 4: İmposter Sarmalı
          } else if (ozguvenSorunu && genelIsabet!==null&&genelIsabet>75) {
            ayAnaVaka = 'imposter';
            // Başarı sonrası kaygı artışı var mı? (Başarı İçselleştirememe)
            const basariSonrasiKaygi = (() => {
              const denemeSirali = [...denemEntries2].sort((a,b)=>a.dateKey.localeCompare(b.dateKey));
              let count = 0;
              for (const d of denemeSirali) {
                const ertesi = gunler.find(g=>g.dk>d.dateKey);
                if (ertesi && ertesi.kaygi>0 && ertesi.kaygi>7 && (d.net||0)>ortNet) count++;
              }
              return count;
            })();
            kutu('AYLIK FOTOĞRAF: İmposter Sarmalı — Başarı İçselleştirilemiyor',
              'Dönem isabet oranı %'+genelIsabet.toFixed(0)+' ile nesnel olarak başarılı; ancak duygusal tablo bunu yansıtmıyor. ' +
              (basariSonrasiKaygi>0?'İyi geçen ' + basariSonrasiKaygi + ' deneme sonrasında ertesi gün kaygı yükseldi — başarı içselleştirilemiyor. ':'') +
              'Öğrenci başarısını şansa bağlıyor; "bu sefer denk geldi" savunma mekanizması devrede. ' +
              'Koç: somut başarı kanıtlarını öğrencinin kendi sesiyle tekrar ettir — "Sen yaptın, şans değil."',
              [255,235,210],[150,75,0]);

          // Vaka 5: Dijital Anestezi Karakteristiği
          } else if (dijitalAnes && kritikSayisi>=3) {
            ayAnaVaka = 'dijital_anes';
            kutu('AYLIK FOTOĞRAF: Dijital Anestezi Karakteristiği — Kaçış Refleksi Kemikleşti',
              'Ay boyunca kriz anlarında birincil savunma: dijital dünyaya sığınma. ' +
              (genelSosyal!==null?'Sosyal medya ort. '+genelSosyal.toFixed(1)+' sa/gün. ':'')+
              aktifNegatifler.filter(r=>r.includes('Dijital')||r.includes('Kaçış')).join(', ')+'tespit edildi. ' +
              'Sorun çözmek yerine uyuşma (numbness) birincil savunma mekanizması haline gelmiş. ' +
              'Bu kemikleşmiş refleks sınav döneminde daha güçlü devreye girecek.',
              [248,218,255],[115,45,180]);

          // Vaka 6: Gizli Kriz ve Sinyal Kaybı
          } else if (genelIsabet!==null&&genelIsabet>75 &&
                     son10Gun.filter(d=>d.enerji>0||d.kaygi>0).length<4 &&
                     (genelSosyal!==null&&genelSosyal>2.5)) {
            ayAnaVaka = 'gizli_kriz';
            kutu('AYLIK FOTOĞRAF: Gizli Kriz ve Sinyal Kaybı',
              'İsabet oranı %'+genelIsabet.toFixed(0)+' ile görünürde iyi; ancak ay sonunda veri girişleri seyrekleşti ve sosyal medya ort. '+(genelSosyal??0).toFixed(1)+' sa/gün. ' +
              'Öğrenci süreçten duygusal olarak kopuyor. Başarı gelmesine rağmen her an "vazgeçme" riski var. ' +
              'Bu sessiz kopuş en tehlikeli kriz türüdür — dışarıdan görünmez.',
              [255,232,210],[152,72,0]);

          // Vaka 7: Patinaj ve Bilişsel Durgunluk
          } else if (patinaj && genelKaygi!==null&&genelKaygi>6) {
            ayAnaVaka = 'patinaj';
            kutu('AYLIK FOTOĞRAF: Patinaj ve Bilişsel Durgunluk (Stagnation)',
              'Soru hacmi hedefe yakın; ancak isabet stabil ' + (genelIsabet!==null?'(%'+genelIsabet.toFixed(0)+') ':'')+
              've kaygı sürekli yüksek (' + (genelKaygi??0).toFixed(1) + '/10). ' +
              'Öğrenci çok çalışıyor görünse de duygusal bariyerler gerçek gelişimi engelliyor. ' +
              '"Çok çalışmak" bu öğrenci için bir savunmadır, verimlilik göstergesi değil.',
              [255,238,215],[148,78,0]);

          // Dengeli ay
          } else {
            ayAnaVaka = 'dengeli';
            const trend = isabetTrend!==null
              ? (isabetTrend>3?' İsabet trendi olumlu (+'+isabetTrend.toFixed(1)+' puan).'
                :isabetTrend<-3?' İsabet trendi dikkat gerektiriyor ('+isabetTrend.toFixed(1)+' puan).'
                :' İsabet stabil.')
              : '';
            kutu('AYLIK FOTOĞRAF: ' + (kritikSayisi===0?'Bu Ay Dengeli':'Kontrol Altında — İzleme Gerekli'),
              veriOzet + '.' + trend + ' ' +
              (kritikSayisi>0?kritikSayisi+' aktif risk faktörü belirlendi; bakiye riskler aşağıda listelendi.':'Egemen klinik risk faktörü tespit edilmedi.'),
              kritikSayisi===0?[220,252,232]:[255,240,215],
              kritikSayisi===0?[15,130,65]:[145,78,0]);
          }

          // ── Aylık İletişim Stratejisi ────────────────────────
          Y=pdfCheck(doc,Y,12);
          doc.setFont(PF,'bold');doc.setFontSize(7.5);doc.setTextColor(40,80,140);
          doc.text('Gelecek Ay Koç İletişim Stratejisi:', 16, Y); Y+=5;

          const ayStratejiMap = {
            burnout:         'Reset protokolü: ilk görüşmede akademik baskı yok. Uyku rutini ve fiziksel iyilik hallini önceliklendir. En az 3 gün tam dinlenme.',
            negatif_regresyon:'Acil yeniden çerçeveleme: erozyonun hangi noktada başladığını birlikte tespit et. İlk 2 hafta sadece 1-2 güçlü branşa odaklan; genişlik değil derinlik.',
            pozitif_donusum: 'Momentumu koru. "Ne doğru yaptım?" sorusunu öğrenciyle birlikte yanıtla; bu farkındalık bir sonraki zorlu döneme transfer edilecek.',
            imposter:        'Somut veri paylaş: net artışı, isabet oranı, aktif gün sayısı. Başarıyı öğrencinin kendi sesiyle tekrar ettir. "Şans değil, sen yaptın."',
            dijital_anes:    'Dijital kaçış tetikleyicilerini birlikte haritala. Hangi duygu/durum dijital sığınmayı tetikliyor? Alternatif 5 dk ritüel geliştir.',
            gizli_kriz:      'Bağ kurma öncelikli. "Nasıl gidiyor?" değil "Süreçte seni ne yoruyor?" sorusuyla başla. Öğrencinin sürece bağlılığını yeniden inşa et.',
            patinaj:         'Strateji revizyonu: hacim değil kalite. Hata analizi ritüeli koy; "bugün kaç çözdün?" sorusu yerine "bugün ne öğrendin?" sorusu.',
            dengeli:         'Sürdür ve geliştir. Bir sonraki ay için somut bir hedef belirle: hangi branşta ne kadar isabet artışı? Rakamı öğrenciyle birlikte koy.',
          };
          dipnot(ayStratejiMap[ayAnaVaka]);

          // ── Gelecek Ay Eylem Planı ───────────────────────────
          const ayOneriListesi = [];
          if (bakiyeRiskler.some(r=>r.includes('tekrar')||r.includes('hatalı')||r.includes('kriz')))
            ayOneriListesi.push('İlk 10 gün: kriz döneminde çalışılan konular "Temiz Zihin" ile tekrar edilmeli (Bilişsel Check-up)');
          if (aktifNegatifler.some(r=>r.includes('Kaçınma')||r.includes('Baraj')||r.includes('Sığınma')))
            ayOneriListesi.push('Zayıf branş için günlük 15 dk "kapı aralama" seansı: kolay soru + başarı hissi -> güven inşası');
          if (aktifNegatifler.some(r=>r.includes('Dijital')||r.includes('Anestezi')))
            ayOneriListesi.push('Sosyal medya için haftalık limit koy; kriz anında alternatif 5 dk ritual (nefes/yürüyüş) uygula');
          if (aktifNegatifler.some(r=>r.includes('Uyku')||r.includes('Fizyolojik')||r.includes('Biyolojik')))
            ayOneriListesi.push('Uyku hijyeni: gece 22:30 ekran kapatma, 23:00 uyku — 30 gün boyunca rutinleştir');
          if (dLgs<60)
            ayOneriListesi.push('Sınava '+dLgs+' gün: yeni konu girişi durdur — bilinen konularda hata sıfırlama ve hız kazanımı');
          if (ayOneriListesi.length===0)
            ayOneriListesi.push('Mevcut stratejiyi koru; bu ay iyi giden alanlarda dozu %15-20 artır');

          Y=pdfCheck(doc,Y,12);
          doc.setFont(PF,'bold');doc.setFontSize(7.5);doc.setTextColor(40,80,140);
          doc.text('Gelecek Ay Öncelikli Eylem Planı:', 16, Y); Y+=5;
          ayOneriListesi.forEach((o,i)=>dipnot((i+1)+'. '+o));
        }

        // ── AYLIK KRİZ HAFIZASI ───────────────────────────────────
        if (period !== 'daily') {
          const tumKrizGunleri = veriGunler.filter(d=>(d.kaygi>=8)||(d.uyku>0&&d.uyku<6)||(!d.soru&&d.kaygi>=7));
          if (tumKrizGunleri.length>0) {
            Y=pdfCheck(doc,Y,14);
            doc.setFont(PF,'bold');doc.setFontSize(7);doc.setTextColor(170,30,30);
            doc.text(tx((period==='weekly'?'Bu Hafta':'Bu Ay') + ' Kriz Günleri Kaydı (' + tumKrizGunleri.length + ' gün):'), 16, Y); Y+=5;
            tumKrizGunleri.forEach(d=>{
              const tarih = new Date(d.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'short'});
              const parcalar = [];
              if (d.kaygi>=8) parcalar.push('Kaygı ' + d.kaygi + '/10');
              if (d.uyku>0&&d.uyku<6) parcalar.push('Uyku ' + d.uyku + ' sa');
              if (!d.soru&&d.kaygi>=7) parcalar.push('Akademik Felç');
              if (d.hataOrani!==null&&d.hataOrani>40) parcalar.push('Hata %' + Math.round(d.hataOrani));
              dipnot('• ' + tarih + ': ' + parcalar.join(' · '));
            });
          }
        }

        // ── Bakiye Riskler (her iki mod için) ───────────────────
        if(bakiyeRiskler.length>0){
          Y=pdfCheck(doc,Y,bakiyeRiskler.length*12+15);
          doc.setFont(PF,'bold');doc.setFontSize(6.5);doc.setTextColor(130,120,175);
          doc.text('İzlenmesi Gereken Bakiye Riskler ('+bakiyeRiskler.length+' madde):',16,Y);Y+=5;
          bakiyeRiskler.forEach((r,i)=>dipnot((i+1)+'. '+r));
        }
      }

      // ── Öğrencinin Sesi ─────────────────────────────────────
      {
        const poz=gunler.filter(d=>d.pozitif&&d.pozitif.trim()).slice(0,3).map(d=>d.pozitif.trim());
        const neg=gunler.filter(d=>d.negatif&&d.negatif.trim()).slice(0,3).map(d=>d.negatif.trim());
        if(poz.length>0||neg.length>0){
          const bSatS = ['Öğrencinin Sesi — Kendi İfadelerinden'];
          const pozSat = poz.length>0 ? doc.splitTextToSize('Olumlu: '+poz.join(' / '), 156) : [];
          const negSat = neg.length>0 ? doc.splitTextToSize('Olumsuz: '+neg.join(' / '), 156) : [];
          const notSat = doc.splitTextToSize('Bu ifadeler koçluk seanslarında doğrudan ele alınmalıdır.', 156);
          const sesH = Math.max(bSatS.length*5.5+(pozSat.length+negSat.length+notSat.length+1)*5+22, 28);
          Y = pdfCheck(doc, Y, sesH+8);
          doc.setFillColor(248,242,255); doc.roundedRect(15,Y,180,sesH,2,2,'F');
          doc.setFillColor(115,75,178); doc.roundedRect(15,Y,4,sesH,1,1,'F');
          doc.setFont(PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(115,75,178);
          doc.text(bSatS, 22, Y+6);
          let sY = Y+6+bSatS.length*5.5+2;
          doc.setFont(PF,'normal'); doc.setFontSize(7);
          if(pozSat.length>0){doc.setTextColor(20,140,70);doc.text(pozSat,22,sY);sY+=pozSat.length*5+3;}
          if(negSat.length>0){doc.setTextColor(180,40,40);doc.text(negSat,22,sY);sY+=negSat.length*5+3;}
          doc.setTextColor(100,90,140);doc.text(notSat,22,sY);
          Y += sesH+8;
        }
      }

      // ── Dönem Özeti ─────────────────────────────────────────
      if(toplamSoru>0){
        Y=pdfCheck(doc,Y,10);
        doc.setFillColor(235,245,255);doc.roundedRect(15,Y,180,9,1.5,1.5,'F');
        doc.setFont(PF,'normal');doc.setFontSize(7.5);doc.setTextColor(40,60,120);
        doc.text('Dönem: '+toplamSoru+' soru | '+toplamSure+' dk | '+aktifGunler.length+' aktif gün | Ort. '+Math.round(ortSoru)+'/gün (Hedef: '+DAILY_GOAL+') | LGS: '+dLgs+' gün',19,Y+5.5);
        Y+=11;
      }

      // ── Koç Görüşmeleri ─────────────────────────────────────
      if(data.gorusmeler&&data.gorusmeler.length>0){
        Y=pdfCheck(doc,Y,12);
        Y=pdfSecHeader(doc,'KOÇ GÖRÜŞMELERİ',Y,108,99,255);
        data.gorusmeler.forEach(g=>{
          const ls3=g.not?doc.splitTextToSize(g.not,156):[];
          const gH=12+(ls3.length>0?ls3.length*4.5+4:0);
          Y=pdfCheck(doc,Y,gH+5);
          doc.setFillColor(240,238,255);doc.roundedRect(15,Y,180,gH,1.5,1.5,'F');
          doc.setFont(PF,'bold');doc.setFontSize(7.5);doc.setTextColor(72,58,180);
          doc.text(g.tarih||'',19,Y+5.5);
          const gR=g.durum==='yapildi'?[20,130,60]:[175,125,0];
          doc.setFillColor(gR[0],gR[1],gR[2]);doc.roundedRect(155,Y+1,38,7,2,2,'F');
          doc.setFont(PF,'bold');doc.setFontSize(6.5);doc.setTextColor(255,255,255);
          doc.text(g.durum==='yapildi'?'Görüşme Yapıldı':'Planlandı',174,Y+5.5,{align:'center'});
          if(ls3.length>0){doc.setFont(PF,'normal');doc.setFontSize(7);doc.setTextColor(60,50,100);doc.text(ls3,19,Y+11);}
          Y+=gH+5;
        });
      }









  // Eğitim Koçu / Öğrenci bilgi alanı (PDF sonu)
  Y = pdfCheck(doc, Y, 30);
  Y += 8;
  doc.setDrawColor(180,175,230); doc.setLineWidth(0.5);
  doc.roundedRect(14, Y, 182, 22, 3, 3, 'S');
  doc.setFillColor(240,238,255); doc.roundedRect(14, Y, 182, 22, 3, 3, 'F');
  doc.setFont(PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(72,58,180);
  doc.text(tx('Eğitim Koç:'), 20, Y+7);
  doc.text(tx('Öğrenci:'), 112, Y+7);
  const coachName = (window.currentUserData||{}).name || 'Koç';
  doc.setFont(PF,'normal'); doc.setFontSize(9); doc.setTextColor(40,40,80);
  doc.text(tx(coachName), 20, Y+14);
  doc.text(tx(sName), 112, Y+14);
  doc.setFont(PF,'normal'); doc.setFontSize(7); doc.setTextColor(130,125,180);
  doc.text(tx('Tarih: ') + tx(dateStr), 20, Y+20);
  doc.text(tx('LGSKoç Psikolojik Takip Raporu'), 112, Y+20);
  Y += 30;

      } // end weekly/monthly
      } // end if daily / else weekly-monthly
    } // end veriGunler

    } // end sortedDays

  pdfFooter(doc, doc.internal.getNumberOfPages(), tx(sName)+' | Psikolojik Takip');
  doc.save(ts(sName.replace(/\s+/g,'_'))+'_Psikolojik_'+periodLabel+'_'+getDateKey(now)+'.pdf');
  window._pdfDateOverride = null;
  showToast('📄','PDF indiriliyor!');

  } catch(err) {
    window._pdfDateOverride = null;
    showToast('❌', 'PDF hatası: ' + (err.message||'Bilinmeyen hata'));
    console.error('exportPsychPDF hata:', err);
  }
}

function showAllDenemeler() {
  showPage('all-denemeler');
}

function allDenemelerPage() {
  const myUid = (window.currentUserData||{}).uid || '';
  const myName = (window.currentUserData||{}).name || '';
  const matchE = e => e.studentName===myName || (myUid && e.userId===myUid);
  const allE = studyEntries.filter(e=>matchE(e)&&e.type==='deneme');

  // Tüm denemeleri grupla
  const denMap = {};
  allE.forEach(e=>{
    const k = e.examId||(e.dateKey+'_'+e.examTitle);
    if(!denMap[k]) denMap[k]=[];
    denMap[k].push(e);
  });
  const allDen = Object.entries(denMap)
    .sort((a,b)=>(b[1][0]?.dateKey||'').localeCompare(a[1][0]?.dateKey||''))
    .map(([k,dl])=>{
      const title = dl[0]?.examTitle||dl[0]?.topic||(dl[0]?.dateKey+' Denemesi');
      const dk = dl[0]?.dateKey||'';
      const subR = subjects.map(s=>{ const se=dl.find(e=>e.subject===s.name); if(!se) return {name:s.name,d:0,y:0,net:0,q:0}; const d=se.correct||0,y=se.wrong||0; return {name:s.name,d,y,net:Math.round((d-y/3)*100)/100,q:d+y}; });
      const lgsR = calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:s.q>0?1:0})));
      return {title,dk,lgsR,examId:k};
    });

  // Aylık gruplama
  const byMonth = {};
  allDen.forEach(d=>{
    const mo = d.dk ? d.dk.substring(0,7) : 'bilinmiyor';
    if(!byMonth[mo]) byMonth[mo]=[];
    byMonth[mo].push(d);
  });

  const months = Object.keys(byMonth).sort().reverse();

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <button onclick="showPage('my-analysis')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem">←</button>
      <div class="page-title" style="margin:0">🎯 Tüm Denemeler</div>
    </div>
    <div class="page-sub">Tüm deneme geçmişin — ${allDen.length} deneme</div>

    ${allDen.length===0 ? `<div class="card" style="text-align:center;padding:40px;color:var(--text2)">Henüz deneme girilmemiş</div>` :
      months.map(mo=>{
        const moLabel = new Date(mo+'-01T12:00:00').toLocaleDateString('tr-TR',{month:'long',year:'numeric'});
        const moDen = byMonth[mo];
        return `
          <div style="margin-bottom:20px">
            <div style="font-size:0.78rem;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${moLabel}</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${moDen.map(d=>{
                const dateLabel = d.dk ? new Date(d.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}) : '';
                return `
                  <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <div style="font-weight:700;font-size:0.88rem">${d.title}</div>
                      <div style="font-size:0.72rem;color:var(--text2);margin-top:2px">${dateLabel}</div>
                    </div>
                    <div style="text-align:right">
                      <div style="font-size:1.3rem;font-weight:900;color:var(--accent)">${d.lgsR.puan}</div>
                      <div style="font-size:0.6rem;color:var(--text2)">/500</div>
                    </div>
                  </div>`;
              }).join('')}
            </div>
          </div>`;
      }).join('')}`;
}

function generateWeekOptions() {
  const opts = [];
  const now = new Date();
  // Son 12 haftayı listele
  for (let w = 0; w < 12; w++) {
    const mon = new Date(now);
    mon.setDate(now.getDate() - (now.getDay()===0?6:now.getDay()-1) - w*7);
    const sun = new Date(mon); sun.setDate(mon.getDate()+6);
    const monStr = mon.toISOString().split('T')[0];
    const label = mon.toLocaleDateString('tr-TR',{day:'numeric',month:'long'}) + ' - ' + sun.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
    opts.push(`<option value="${monStr}"${w===0?' selected':''}>${label}</option>`);
  }
  return opts.join('');
}

function generateMonthOptions() {
  const opts = [];
  const now = new Date();
  // Son 12 ayı listele
  for (let m = 0; m < 12; m++) {
    const d = new Date(now.getFullYear(), now.getMonth()-m, 1);
    const val = d.toISOString().split('T')[0].substring(0,7); // "2026-03"
    const label = d.toLocaleDateString('tr-TR',{month:'long',year:'numeric'});
    opts.push(`<option value="${val}"${m===0?' selected':''}>${label}</option>`);
  }
  return opts.join('');
}

