async function exportPsychPDF(sName, aiAcik) {
  showToast('⏳','PDF hazırlanıyor...');
  // _pdfDateOverride'ı hemen yakala (async await'ten önce, silinmeden)
  const _ovLocal = window._pdfDateOverride ? {...window._pdfDateOverride} : null;

  try {

  const sObj = students.find(s=>s.name===sName) || {};
  const sUid = sObj.uid || '';
  const data = await getWellnessData(sUid || sName);
  const days = data.days || {};
  const period = window._psychPeriod || 'daily';
  const now = new Date();

  // Dönem filtresi + başlık
  let startKey, endKey, periodLabel, periodTitle;
  const ov = _ovLocal;  // yerel kopyayı kullan
  if (ov) {
    startKey = ov.startKey; endKey = ov.endKey;
    periodLabel = ov.label; periodTitle = ov.title;
  } else if (period === 'daily') {
    startKey = getDateKey(now);
    endKey = startKey;
    periodLabel = 'Günlük';
    periodTitle = now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}) + ' Günlük Raporu';
  } else if (period === 'weekly') {
    const mon = new Date(now); mon.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
    startKey = mon.toISOString().split('T')[0];
    const endDate = new Date(mon); endDate.setDate(mon.getDate()+6);
    endKey = endDate.toISOString().split('T')[0];
    const s = mon.toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
    const e = endDate.toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});
    periodLabel = 'Haftalık';
    periodTitle = s + ' – ' + e + ' Haftalık Raporu';
  } else {
    startKey = getDateKey(now).substring(0,7)+'-01';
    endKey = getDateKey(now);
    const monthName = now.toLocaleDateString('tr-TR',{month:'long',year:'numeric'});
    periodLabel = 'Aylık';
    periodTitle = monthName + ' Aylık Raporu';
  }
  const sortedDays = Object.keys(days).filter(k=>k>=startKey&&k<=endKey).sort().reverse();

  const moodLabels = { excited:'Heyecanlı', good:'İyiyim', focused:'Odaklı', ok:'İdare Eder', tired:'Yorgunum', anxious:'Kaygılı', sad:'Mutsuzum' };
  const moodColors = { excited:[249,202,36], good:[69,183,209], focused:[108,99,255], ok:[162,155,254], tired:[253,121,168], anxious:[255,107,107], sad:[119,140,163] };

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'p', unit:'mm', format:'a4' });
  const PF = registerFontIfAvailable(doc);
  _PF = PF; // ts() fonksiyonu _PF'ye bakıyor — Türkçe karakterler için kritik
  const dateStr = now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});

  let Y = pdfHeader(doc, tx(sName)+' \u2014 '+tx(periodTitle), tx('PSİKOLOJİK TAKİP RAPORU'), tx(dateStr));

  // Hedefler
  if (data.hedef || data.hedefOkul) {
    Y = pdfSecHeader(doc, tx('HEDEFLER'), Y, 108, 99, 255);
    doc.setFont(PF,'normal'); doc.setFontSize(9); doc.setTextColor(60,60,80);
    if (data.hedef) { doc.text(tx('Hedef Puan: ') + data.hedef, 16, Y); Y+=6; }
    if (data.hedefOkul) { doc.text(tx('Hedef Okul: ') + tx(data.hedefOkul), 16, Y); Y+=8; }
  }

  if (sortedDays.length > 0) {
    const avg = (field) => {
      const vals = sortedDays.map(k=>parseFloat(days[k]?.[field])||0).filter(v=>v>0);
      return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : '-';
    };

    // İstatistik kutuları
    Y = pdfSecHeader(doc, tx('ÖZET İSTATİSTİKLER'), Y, 108, 99, 255);
    [[tx('Ort. Enerji'),avg('enerji')+'/10',[249,202,36]],[tx('Ort. Odak'),avg('odak')+'/10',[69,183,209]],[tx('Ort. Kaygı'),avg('kaygi')+'/10',[255,107,107]],[tx('Ort. Uyku'),avg('uyku')+'sa',[162,155,254]]].forEach((b,i)=>{
      const bx=16+i*46;
      doc.setFillColor(b[2][0],b[2][1],b[2][2]); doc.roundedRect(bx,Y,40,16,2,2,'F');
      doc.setFont(PF,'bold'); doc.setFontSize(11); doc.setTextColor(255,255,255);
      doc.text(b[1], bx+20, Y+9, {align:'center'});
      doc.setFont(PF,'normal'); doc.setFontSize(6.5);
      doc.text(b[0], bx+20, Y+14, {align:'center'});
    });
    Y += 22;

    // Trend grafikleri — tüm dönem günleri kronolojik
    const trendKeys = sortedDays.slice().reverse();
    Y = pdfCheck(doc, Y, 20);
    Y = pdfSecHeader(doc, tx('TREND GRAFİKLERİ'), Y, 108, 99, 255);
    if (trendKeys.length >= 2) {
      const labels = trendKeys.map(k=>new Date(k+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'}));
      const enerjis = trendKeys.map(k=>parseFloat(days[k]?.enerji)||0);
      const kaygis  = trendKeys.map(k=>parseFloat(days[k]?.kaygi)||0);
      const uykus   = trendKeys.map(k=>parseFloat(days[k]?.uyku)||0);
      const ekranSosyals = trendKeys.map(k=>parseFloat(days[k]?.ekranSosyal)||parseFloat(days[k]?.ekran)||0);
      const ekranOnlines = trendKeys.map(k=>parseFloat(days[k]?.ekranOnline)||0);
      if(enerjis.some(v=>v>0)) { Y=pdfBarChart(doc,enerjis,labels,Y,32,enerjis.map(()=>[249,202,36]),tx('Enerji Seviyesi (1-10)')); Y+=4; }
      if(kaygis.some(v=>v>0))  { Y=pdfBarChart(doc,kaygis,labels,Y,32,kaygis.map(()=>[255,107,107]),tx('Kaygı Seviyesi (1-10)')); Y+=4; }
      if(uykus.some(v=>v>0))   { Y=pdfBarChart(doc,uykus,labels,Y,32,uykus.map(()=>[162,155,254]),tx('Uyku Süresi (saat)')); Y+=4; }
      if(ekranSosyals.some(v=>v>0)||ekranOnlines.some(v=>v>0)) {
        Y=pdfBarChart(doc,ekranSosyals,labels,Y,28,ekranSosyals.map(()=>[255,107,107]),tx('Sosyal Medya/Diğer Ekran (saat)'));
        Y+=2;
        if(ekranOnlines.some(v=>v>0)) { Y=pdfBarChart(doc,ekranOnlines,labels,Y,28,ekranOnlines.map(()=>[69,183,209]),tx('Online Ders Ekran (saat)')); Y+=4; }
      }
    } else {
      doc.setFont(PF,'normal'); doc.setFontSize(9); doc.setTextColor(120,120,140);
      doc.text(tx('Grafik için yeterli veri yok.'), 16, Y); Y+=10;
    }

    // Isı haritası — son 30 gün
    Y = pdfCheck(doc, Y, 20);
    Y = pdfSecHeader(doc, tx('PSİKOLOJİK ISI HARİTASI — SON 30 GÜN'), Y, 108, 99, 255);
    const cellW=15.5, cellH=10, cols=10;
    const last30 = Array.from({length:30},(_,i)=>{ const d=new Date(now); d.setDate(now.getDate()-29+i); return d.toISOString().split('T')[0]; });
    last30.forEach((k,i)=>{
      const col=i%cols, row=Math.floor(i/cols);
      const x=16+col*(cellW+1), y=Y+row*(cellH+1);
      const d=days[k];
      const mc=d?.mood?moodColors[d.mood]||[200,200,200]:[230,230,235];
      doc.setFillColor(mc[0],mc[1],mc[2]); doc.roundedRect(x,y,cellW,cellH,1.5,1.5,'F');
      doc.setTextColor(d?.mood?255:160,d?.mood?255:160,d?.mood?255:160); doc.setFontSize(5);
      doc.text(tx(new Date(k+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'})), x+cellW/2, y+4, {align:'center'});
      if(d?.mood) doc.text(tx((moodLabels[d.mood]||'').substring(0,6)), x+cellW/2, y+8.5, {align:'center'});
    });
    Y += Math.ceil(30/cols)*(cellH+1)+4;
    doc.setFontSize(6); doc.setTextColor(60,60,80);
    Object.entries(moodColors).forEach(([mood,col],i)=>{
      const lx=16+i*24;
      doc.setFillColor(col[0],col[1],col[2]); doc.roundedRect(lx,Y,6,4,1,1,'F');
      doc.text(tx(moodLabels[mood]||mood), lx+7, Y+3.5);
    });
    Y += 10;

    // Psikolojik değerlendirme
    const wArr = sortedDays.map(k=>({
      kaygi:parseFloat(days[k]?.kaygi)||0, uyku:parseFloat(days[k]?.uyku)||0,
      enerji:parseFloat(days[k]?.enerji)||0
    })).filter(d=>d.kaygi>0||d.uyku>0);
    const korLines = [];
    if (wArr.length >= 2) {
      const avgK=(wArr.filter(d=>d.kaygi>0).reduce((a,d)=>a+d.kaygi,0)/Math.max(wArr.filter(d=>d.kaygi>0).length,1)).toFixed(1);
      const avgU=(wArr.filter(d=>d.uyku>0).reduce((a,d)=>a+d.uyku,0)/Math.max(wArr.filter(d=>d.uyku>0).length,1)).toFixed(1);
      const avgE=(wArr.filter(d=>d.enerji>0).reduce((a,d)=>a+d.enerji,0)/Math.max(wArr.filter(d=>d.enerji>0).length,1)).toFixed(1);
      if(parseFloat(avgK)>=7) korLines.push(tx('Kaygı seviyesi bu dönemde yüksek seyretti (ort. '+avgK+'/10). Sınav öncesi kaygı yönetimi çalışması önerilebilir.'));
      else if(parseFloat(avgK)<=3) korLines.push(tx('Kaygı seviyesi bu dönemde oldukça düşük kaldı (ort. '+avgK+'/10). Öğrenci sakin ve rahat bir dönem geçirdi.'));
      if(parseFloat(avgU)<7) korLines.push(tx('Ortalama uyku süresi '+avgU+' saat — yetersiz uyku akademik performansı olumsuz etkileyebilir. Uyku düzeni gözden geçirilmeli.'));
      else korLines.push(tx('Uyku süresi yeterli düzeyde (ort. '+avgU+' saat). Bu, öğrenme kapasitesini destekler.'));
      if(parseFloat(avgE)>=7) korLines.push(tx('Enerji seviyesi yüksek seyretti (ort. '+avgE+'/10). Bu motivasyon çalışma verimliliğine yansıyabilir.'));
      else if(parseFloat(avgE)<=4) korLines.push(tx('Enerji seviyesi düşük kaldı (ort. '+avgE+'/10). Motivasyon desteği ve aktivite planlaması önerilebilir.'));
      const enTrend = sortedDays.slice().reverse().map(k=>parseFloat(days[k]?.enerji)||0).filter(v=>v>0);
      if(enTrend.length>=3) {
        const fh=enTrend.slice(0,Math.floor(enTrend.length/2)), sh=enTrend.slice(Math.floor(enTrend.length/2));
        const fa=fh.reduce((a,b)=>a+b,0)/fh.length, sa=sh.reduce((a,b)=>a+b,0)/sh.length;
        if(fa-sa>1) korLines.push(tx('Dönem sonuna doğru enerji düşüşü gözlemlendi. Yorgunluk ve tükenmişlik belirtileri izlenmeli.'));
        else if(sa-fa>1) korLines.push(tx('Dönem boyunca enerji artışı gözlemlendi. Artan motivasyon akademik çalışmaya yönlendirilebilir.'));
      }
    }
    if (korLines.length > 0) {
      Y = pdfCheck(doc, Y, 20);
      Y = pdfSecHeader(doc, tx('PSİKOLOJİK DEĞERLENDİRME'), Y, 108, 99, 255);
      korLines.forEach(line => {
        Y = pdfCheck(doc, Y, 18);
        doc.setFillColor(240,240,255); doc.roundedRect(16,Y,178,14,2,2,'F');
        doc.setFont(PF,'normal'); doc.setFontSize(8); doc.setTextColor(40,40,80);
        const ls = doc.splitTextToSize(line, 170);
        doc.text(ls, 20, Y+5);
        Y += ls.length*5 + 5;
      });
    }

    // Günlük tablo
    Y = pdfCheck(doc, Y, 14);
    Y = pdfSecHeader(doc, tx('GÜNLÜK VERİLER'), Y, 108, 99, 255);
    Y = pdfTable(doc,
      [tx('Tarih'),tx('Duygu'),tx('Enerji'),tx('Kaygı'),tx('Uyku'),tx('Online'),tx('Sosyal')],
      [28,34,18,18,20,26,26],
      sortedDays.map(k=>{
        const d=days[k];
        const sosyal = parseFloat(d?.ekranSosyal)||parseFloat(d?.ekran)||0;
        const online = parseFloat(d?.ekranOnline)||0;
        return [tx(new Date(k+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'})),
          tx(moodLabels[d?.mood]||'-'),d?.enerji||'-',d?.kaygi||'-',(d?.uyku||'-')+'sa',
          online>0?online+'sa':'-', sosyal>0?sosyal+'sa':'-'];
      }),
      Y,[108,99,255]);

    // Olumlu / Olumsuz düşünceler — tam metin
    const thoughtDays = sortedDays.filter(k=>{
      const d=days[k];
      return (d?.pozitif||d?.gurur||'').trim() || (d?.negatif||'').trim() || (d?.not||'').trim();
    });
    if (thoughtDays.length>0) {
      Y = pdfCheck(doc, Y, 14);
      Y = pdfSecHeader(doc, tx('NOTLAR VE DÜŞÜNCELER'), Y, 108, 99, 255);
      thoughtDays.forEach(k=>{
        const d=days[k];
        const dateStr2=new Date(k+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',weekday:'short'});
        const pozitif=(d?.pozitif||d?.gurur||'').trim();
        const negatif=(d?.negatif||'').trim();
        const not=(d?.not||'').trim();
        Y = pdfCheck(doc, Y, 10);
        doc.setFont(PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(72,58,180);
        doc.text(tx(dateStr2), 16, Y); Y+=5;
        if (pozitif) {
          Y = pdfCheck(doc, Y, 10);
          doc.setFillColor(230,255,240); doc.roundedRect(16,Y,178,10,1.5,1.5,'F');
          doc.setFillColor(72,200,130); doc.roundedRect(16,Y,3,10,1,1,'F');
          doc.setFont(PF,'bold'); doc.setFontSize(6.5); doc.setTextColor(20,100,50);
          doc.text(tx('Olumlu:'), 21, Y+4);
          doc.setFont(PF,'normal'); doc.setFontSize(7);
          const ls=doc.splitTextToSize(tx(pozitif), 148);
          doc.text(ls, 40, Y+4);
          Y += Math.max(ls.length*4+4, 12);
        }
        if (negatif) {
          Y = pdfCheck(doc, Y, 10);
          doc.setFillColor(255,235,235); doc.roundedRect(16,Y,178,10,1.5,1.5,'F');
          doc.setFillColor(255,107,107); doc.roundedRect(16,Y,3,10,1,1,'F');
          doc.setFont(PF,'bold'); doc.setFontSize(6.5); doc.setTextColor(150,20,20);
          doc.text(tx('Olumsuz:'), 21, Y+4);
          doc.setFont(PF,'normal'); doc.setFontSize(7);
          const ls=doc.splitTextToSize(tx(negatif), 148);
          doc.text(ls, 40, Y+4);
          Y += Math.max(ls.length*4+4, 12);
        }
        if (not) {
          Y = pdfCheck(doc, Y, 10);
          doc.setFillColor(240,240,255); doc.roundedRect(16,Y,178,10,1.5,1.5,'F');
          doc.setFillColor(162,155,254); doc.roundedRect(16,Y,3,10,1,1,'F');
          doc.setFont(PF,'bold'); doc.setFontSize(6.5); doc.setTextColor(60,40,160);
          doc.text(tx('Not:'), 21, Y+4);
          doc.setFont(PF,'normal'); doc.setFontSize(7);
          const ls=doc.splitTextToSize(tx(not), 148);
          doc.text(ls, 40, Y+4);
          Y += Math.max(ls.length*4+4, 12);
        }
        Y += 3;
      });
    }






    // ============================================================
    // PSİKOLOJİK-AKADEMİK KORELASYON ANALİZİ
    // ============================================================
    const sObj2 = students.find(s=>s.name===sName) || {};
    const sUid2 = sObj2.uid || '';
    const matchE2 = e => e.studentName===sName || (sUid2 && e.userId===sUid2);
    const allAcadEntries = studyEntries.filter(e=>matchE2(e)&&e.dateKey>=startKey&&e.dateKey<=endKey);
    const soruEntries2   = allAcadEntries.filter(e=>e.type==='soru');
    const denemEntries2  = allAcadEntries.filter(e=>e.type==='deneme');
    const DAILY_GOAL = 200;

    const gunler = sortedDays.slice().reverse().map(dk => {
      const p = days[dk] || {};
      const sg = soruEntries2.filter(e=>e.dateKey===dk);
      const dg = denemEntries2.filter(e=>e.dateKey===dk);
      const soru = sg.reduce((a,e)=>a+(e.questions||0),0);
      const sure = sg.reduce((a,e)=>a+(e.duration||0),0);
      const net  = sg.reduce((a,e)=>a+(e.net||0),0);
      const denQ = dg.reduce((a,e)=>a+(e.correct||0)+(e.wrong||0),0);
      const denY = dg.reduce((a,e)=>a+(e.wrong||0),0);
      const topQ = soru + denQ;
      const topY = sg.reduce((a,e)=>a+(e.wrong||0),0) + denY;
      const hataOrani = topQ >= 60 ? (topY/topQ*100) : null;
      const sosyal = parseFloat(p.ekranSosyal)||parseFloat(p.ekran)||0;
      const online = parseFloat(p.ekranOnline)||0;
      const dersHata = {};
      sg.forEach(e=>{ if(!dersHata[e.subject]) dersHata[e.subject]={q:0,y:0}; dersHata[e.subject].q+=(e.questions||0); dersHata[e.subject].y+=(e.wrong||0); });
      dg.forEach(e=>{ if(!dersHata[e.subject]) dersHata[e.subject]={q:0,y:0}; dersHata[e.subject].q+=(e.correct||0)+(e.wrong||0); dersHata[e.subject].y+=(e.wrong||0); });
      return { dk, soru, sure, net, hataOrani, dersHata,
        enerji:parseFloat(p.enerji)||0, odak:parseFloat(p.odak)||0,
        kaygi:parseFloat(p.kaygi)||0,   uyku:parseFloat(p.uyku)||0,
        sosyal, online, toplamEkran:sosyal+online,
        mood:p.mood||'', negatif:p.negatif||'', pozitif:p.pozitif||p.gurur||''
      };
    });

    const veriGunler  = gunler.filter(d=>d.enerji>0||d.kaygi>0||d.uyku>0);
    const aktifGunler = gunler.filter(d=>d.soru>0);
    const toplamSoru  = gunler.reduce((a,d)=>a+d.soru,0);
    // Süre: sadece soru tipinden değil tüm akademik girişlerden (konu/tekrar dahil)
    const toplamSure  = allAcadEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.duration||0),0);
    const ortSoru     = aktifGunler.length>0 ? toplamSoru/aktifGunler.length : 0;
    // fn: sıfır olmayan değerlerin ortalaması, veri yoksa null döner (0 değil — önemli!)
    const fn = (arr,f) => { const v=arr.filter(d=>d[f]>0); return v.length ? v.reduce((a,d)=>a+d[f],0)/v.length : null; };
    const fnZ = (arr,f) => fn(arr,f) ?? 0; // null yerine 0 isteyen yerler için
    const ortEnerji = fnZ(veriGunler,'enerji'); const ortKaygi = fnZ(veriGunler,'kaygi');
    const ortUyku   = fnZ(veriGunler,'uyku');   const ortOdak  = fnZ(veriGunler,'odak');
    const ortSosyal = fnZ(veriGunler,'sosyal');
    const hataGunler = gunler.filter(d=>d.hataOrani!==null);
    const ortHata = hataGunler.length>0 ? hataGunler.reduce((a,d)=>a+d.hataOrani,0)/hataGunler.length : null;
    const denNetArr = denemEntries2.map(e=>e.net||0).filter(v=>v!==0);
    const ortDenNet = denNetArr.length>0 ? denNetArr.reduce((a,b)=>a+b,0)/denNetArr.length : null;
    const soruNetArr = gunler.filter(d=>d.net>0).map(d=>d.net);
    const ortSoruNet = soruNetArr.length>0 ? soruNetArr.reduce((a,b)=>a+b,0)/soruNetArr.length : null;
    const ortNet = ortDenNet ?? ortSoruNet;
    const dLgs = Math.max(0,Math.floor((new Date('2026-06-13T09:30:00+03:00')-new Date())/(1000*60*60*24)));

    // T-0: kronolojik olarak son 2 GÜN (tarih bazlı, wellness VEYA akademik veri olan her gün dahil)
    // Tüm gunler zaten date sorted, son 2'yi al
    const gunlerSorted = [...gunler].sort((a,b)=>b.dk.localeCompare(a.dk));
    const son2 = gunlerSorted.slice(0,2);
    const tGecmis = gunlerSorted.slice(2).filter(d=>d.enerji>0||d.kaygi>0||d.uyku>0);
    const son7 = gunlerSorted.slice(0,7);

    // T-0 değerleri: sadece o 2 günde VERİSİ OLAN metriklerin ortalaması
    const t0E = fn(son2,'enerji');   // null = bu 2 günde enerji girişi yok
    const t0O = fn(son2,'odak');
    const t0K = fn(son2,'kaygi');
    const t0U = fn(son2,'uyku');
    const t0EkranFn = son2.reduce((a,d)=>a+d.toplamEkran,0)/Math.max(son2.length,1);
    const t0HataG = son2.filter(d=>d.hataOrani!==null);
    const t0Hata = t0HataG.length>0 ? t0HataG.reduce((a,d)=>a+d.hataOrani,0)/t0HataG.length : null;
    const t0Soru = son2.reduce((a,d)=>a+d.soru,0)/Math.max(son2.length,1);

    // T-geçmiş değerleri
    const tgK = fn(tGecmis,'kaygi'); const tgU = fn(tGecmis,'uyku'); const tgE = fn(tGecmis,'enerji');
    const tgHataG = tGecmis.filter(d=>d.hataOrani!==null);
    const tgHata = tgHataG.length>0 ? tgHataG.reduce((a,d)=>a+d.hataOrani,0)/tgHataG.length : null;

    // Uyku analizi için son 5 günün ortalaması
    const son5UykuOrt = fn(son7.slice(0,5).filter(d=>d.uyku>0),'uyku') ?? 0;

    // Geçmiş risk bayrakları
    const gecmisKaygiYuksek = tGecmis.some(d=>d.kaygi>=8);
    const gecmisUykuDusuk   = tGecmis.filter(d=>d.uyku>0).some(d=>d.uyku<6.5);
    const gecmisEkranYuksek = son7.slice(2).some(d=>d.toplamEkran>3);

    // Ardışık düşük uyku günü sayısı
    let maxArdisikUyku=0,_tu=0;
    gunlerSorted.forEach(d=>{if(d.uyku>0&&d.uyku<6.5){_tu++;maxArdisikUyku=Math.max(maxArdisikUyku,_tu);}else if(d.uyku>0){_tu=0;}});

    // Ders bazlı hata ve korelasyon
    const dersToplamHata = {};
    gunler.forEach(d=>{ Object.entries(d.dersHata).forEach(([ders,v])=>{ if(!dersToplamHata[ders]) dersToplamHata[ders]={q:0,y:0}; dersToplamHata[ders].q+=v.q; dersToplamHata[ders].y+=v.y; }); });
    const dersHataArr = Object.entries(dersToplamHata).filter(([d,v])=>v.q>=30).map(([d,v])=>({d,pct:v.y/v.q*100,q:v.q})).sort((a,b)=>b.pct-a.pct);

    // Standart sapma (gürültü/sinyal filtresi)
    const stdSapma = (arr) => { if(arr.length<3) return 0; const m=arr.reduce((a,b)=>a+b,0)/arr.length; return Math.sqrt(arr.reduce((a,b)=>a+(b-m)**2,0)/arr.length); };
    const ekranDizi = gunler.filter(d=>d.toplamEkran>0).map(d=>d.toplamEkran);
    const ekranStd = stdSapma(ekranDizi);
    const ekranOrt = ekranDizi.length>0?ekranDizi.reduce((a,b)=>a+b,0)/ekranDizi.length:0;

    const aktifNegatifler = [];
    const bakiyeRiskler   = [];
    const kullanılanOlaylar = new Set(); // Bağlamsal izolasyon: aynı olay iki başlıkta kullanılmaz

    // ── Yardımcı fonksiyonlar ──
        function kutu(baslik, metin, bg, kenar) {
      const bSat = doc.splitTextToSize(baslik, 156);
      const mSat = doc.splitTextToSize(metin, 156);
      const bH   = Math.max(bSat.length*5.5 + mSat.length*4.8 + 20, 24);
      // Her zaman sayfa kontrolü yap — başlık kaymasını önle
      Y = pdfCheck(doc, Y, bH + 10);
      // Sayfa başındaysa (Y < 50) bolumBaslik bazen kayıyor, küçük güvenlik tamponu
      if (Y < 42) Y = 42;
      _bolumYeniSayfa = false;
      doc.setFillColor(bg[0],bg[1],bg[2]); doc.roundedRect(15,Y,180,bH,2,2,'F');
      doc.setFillColor(kenar[0],kenar[1],kenar[2]); doc.roundedRect(15,Y,4,bH,1,1,'F');
      doc.setFont(PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(kenar[0],kenar[1],kenar[2]);
      doc.text(bSat, 22, Y+6);
      doc.setFont(PF,'normal'); doc.setFontSize(7); doc.setTextColor(50,45,80);
      doc.text(mSat, 22, Y+6+bSat.length*5.5+2);
      Y += bH+8;
    }

    function dipnot(metin) {
      const mSat = doc.splitTextToSize(metin, 158);
      const bH   = Math.max(mSat.length*4.5+10, 12);
      Y = pdfCheck(doc, Y, bH+4);
      doc.setFillColor(248,247,253); doc.roundedRect(15,Y,180,bH,1.5,1.5,'F');
      doc.setFillColor(150,140,185); doc.roundedRect(15,Y,3,bH,1,1,'F');
      doc.setFont(PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(110,100,155);
      doc.text(mSat, 21, Y+5); Y += bH+4;
    }

    function bolumBaslik(renk, baslik, altMetin) {
      const altSat = doc.splitTextToSize(altMetin, 170);
      const needed = altSat.length*5 + 14 + 30; // Başlık + alt metin için yeterli tampon
      Y = pdfCheck(doc, Y, needed);
      // Sayfa sonuna yakınsa zorla yeni sayfa
      if (Y > 240) { Y = pdfNewPage(doc); }
      _bolumYeniSayfa = true;
      Y += 3;
      doc.setFont(PF,'bold'); doc.setFontSize(8.5);
      doc.setTextColor(renk[0],renk[1],renk[2]);
      doc.text(baslik, 16, Y); Y+=5;
      doc.setFont(PF,'normal'); doc.setFontSize(6.5);
      doc.setTextColor(Math.min(renk[0]+20,200),Math.min(renk[1]+20,200),Math.min(renk[2]+20,200));
      doc.text(altSat, 16, Y); Y += altSat.length*5+5;
    }

    // ── AI ANALİZİ (haftalık/aylık, API key varsa) ───────────
    let aiAnaliz = null;
    if (period !== 'daily' && aiAcik && localStorage.getItem('lgs_api_enabled') === 'true' && localStorage.getItem('lgs_anthropic_key')) {
      try {
        const sozelNotlar = gunler
          .filter(d => d.pozitif || d.negatif)
          .slice(0, 7)
          .map(d => ({ tarih: d.dk, pozitif: d.pozitif || '', negatif: d.negatif || '' }));

        const wellnessForAI = gunler.slice(0, 14).map(d => ({
          tarih: d.dk,
          kaygi: d.kaygi, enerji: d.enerji, uyku: d.uyku,
          odak: d.odak, mood: d.mood, soru: d.soru,
          pozitif: d.pozitif || '', negatif: d.negatif || ''
        }));

        const academicForAI = {
          toplamSoru, aktifGun: aktifGunler.length,
          ortIsabet: ortHata !== null ? Math.round(100 - ortHata) : null,
          dersBazli: Object.entries(dersToplamHata)
            .filter(([, v]) => v.q >= 20)
            .map(([d, v]) => ({ d, isabet: Math.round((1 - v.y / v.q) * 100) }))
        };

        const denemelerForAI = denemEntries2.slice(0, 8).map(e => ({
          tarih: e.dateKey,
          baslik: e.examTitle || e.topic || 'Deneme',
          toplamNet: Math.round((e.net || 0) * 10) / 10,
          dersler: e.subject + (e.correct !== undefined ? ' D:' + e.correct + ' Y:' + e.wrong : '')
        }));

        aiAnaliz = await generateAIAnalysis(
          sName, period,
          wellnessForAI, academicForAI,
          denemelerForAI, sozelNotlar
        );
      } catch (aiErr) {
        console.warn('AI analiz atlandı:', aiErr.message);
        aiAnaliz = null;
      }
    }

        if (veriGunler.length >= 1 || period === 'daily') {
      // ───────────────────────────────────────────────────────────
      // ORTAK ALTYAPI — 3 mod için paylaşılan yardımcılar
      // ───────────────────────────────────────────────────────────
      let _bolumYeniSayfa = false;
      const sozelDersler  = ['Türkçe','İnkılap Tarihi','Din Kültürü','İngilizce'];
      const sayisalDersler= ['Matematik','Fen Bilimleri'];
      // LGS soru sayıları (resmi dağılım)
      const lgsSoruSayisi = {
        'Türkçe': 20, 'Matematik': 20, 'Fen Bilimleri': 20,
        'İnkılap Tarihi': 10, 'Din Kültürü': 10, 'İngilizce': 10
      };
      // Net hesabı: doğru - yanlış/4, maksimum o dersin soru sayısı
      const dersNetHesapla = (dogru, yanlis, dersAdi) => {
        const net = (dogru||0) - (yanlis||0)/4;
        return Math.max(0, Math.round(net * 10) / 10);
      };
      // İsabet oranı yerine net ve doluluk oranı
      const dersMaxSoru = (dersAdi) => lgsSoruSayisi[dersAdi] || 20;
      const dersDoluluk = (dogru, yanlis, dersAdi) => {
        const net = dersNetHesapla(dogru, yanlis, dersAdi);
        return Math.round(net / dersMaxSoru(dersAdi) * 100);
      };
      const std = (arr) => {
        if (arr.length<2) return 0;
        const m=arr.reduce((a,b)=>a+b,0)/arr.length;
        return Math.sqrt(arr.reduce((a,b)=>a+(b-m)**2,0)/arr.length);
      };
      const dersHataOrani = (dersAdi) => {
        const v=dersToplamHata[dersAdi];
        return (v&&v.q>=20)?v.y/v.q*100:null;
      };

      // ═══════════════════════════════════════════════════════════
      // GÜNLÜK RAPOR
      // ═══════════════════════════════════════════════════════════
      if (period === 'daily') {
        const bugunKey    = startKey;
        const bugunW      = days[bugunKey] || {};
        const bugunAkad   = allAcadEntries.filter(e=>e.dateKey===bugunKey);
        const bugunSoru   = bugunAkad.reduce((a,e)=>a+(e.questions||0),0);
        const bugunSure   = bugunAkad.reduce((a,e)=>a+(e.duration||0),0);
        const bugunDersler= [...new Set(bugunAkad.map(e=>e.subject).filter(Boolean))];
        const bugunHata   = bugunAkad.reduce((a,e)=>a+(e.wrong||0),0);
        const bugunDogru  = bugunAkad.reduce((a,e)=>a+(e.correct||0),0);
        const bugunIsabet = (bugunSoru>0)?Math.round(bugunDogru/bugunSoru*100):null;
        const bugunKaygi  = parseFloat(bugunW.kaygi)||0;
        const bugunEnerji = parseFloat(bugunW.enerji)||0;
        const bugunUyku   = parseFloat(bugunW.uyku)||0;
        const bugunOdak   = parseFloat(bugunW.odak)||0;
        const bugunMood   = bugunW.mood||'';
        const bugunSosyal = parseFloat(bugunW.ekranSosyal)||parseFloat(bugunW.ekran)||0;
        const bugunOnline = parseFloat(bugunW.ekranOnline)||0;
        const bugunPozitif= (bugunW.pozitif||bugunW.gurur||'').trim();
        const bugunNegatif= (bugunW.negatif||'').trim();
        const wellnessVar = bugunKaygi>0||bugunEnerji>0||bugunUyku>0||bugunOdak>0||!!bugunMood;
        const akademikVar = bugunSoru>0;
        const moodTr = {excited:'Heyecanlı',good:'İyiyim',focused:'Odaklı',ok:'İdare Eder',tired:'Yorgunum',anxious:'Kaygılı',sad:'Mutsuzum'};
        const bugunMoodTr = bugunMood?(moodTr[bugunMood]||bugunMood):'';
        const negatifMood = ['anxious','tired','sad'].includes(bugunMood);

        // Dün verisi
        const dunKey = (()=>{ const d=new Date(bugunKey+'T12:00:00'); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0]; })();
        const dunW   = days[dunKey]||{};
        const dunKaygi= parseFloat(dunW.kaygi)||0;
        const dunSoru = allAcadEntries.filter(e=>e.dateKey===dunKey).reduce((a,e)=>a+(e.questions||0),0);

        // Son 7 gün trendi
        const son7Keys = Array.from({length:7},(_,i)=>{ const d=new Date(bugunKey+'T12:00:00'); d.setDate(d.getDate()-i-1); return d.toISOString().split('T')[0]; });
        const son7W    = son7Keys.map(k=>days[k]).filter(Boolean);
        const s7Kaygi  = son7W.filter(d=>d.kaygi>0); const s7OrtKaygi = s7Kaygi.length>0?s7Kaygi.reduce((a,d)=>a+parseFloat(d.kaygi),0)/s7Kaygi.length:null;
        const s7Uyku   = son7W.filter(d=>d.uyku>0);  const s7OrtUyku  = s7Uyku.length>0?s7Uyku.reduce((a,d)=>a+parseFloat(d.uyku),0)/s7Uyku.length:null;
        const s7Enerji = son7W.filter(d=>d.enerji>0); const s7OrtEnerji= s7Enerji.length>0?s7Enerji.reduce((a,d)=>a+parseFloat(d.enerji),0)/s7Enerji.length:null;
        // Son 7 günün kaçınma örüntüsü
        const ardisikBosDays = (() => { let c=0; for(const k of son7Keys){ if(!allAcadEntries.some(e=>e.dateKey===k)) c++; else break; } return c; })();

        const gunlukAktifler = [];
        const gunlukBakiye   = [];

        Y = pdfCheck(doc, Y, 20);
        Y = pdfSecHeader(doc, 'GÜNLÜK KLİNİK ANALİZ', Y, 220, 50, 100);

        // AI günlük kutusu kaldırıldı
                doc.setFont(PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(100,90,140);
        doc.text(tx('Bugünün verisi anlık klinik değerlendirme — bakiye riskler sonda'), 16, Y); Y+=8;

        // ══ ALTIN KURAL: Kaygı≥7 + Soru=0 -> ACİL UYARI ══════════
        if (bugunKaygi>=7 && !akademikVar) {
          gunlukAktifler.push('Amigdala Blokajı — Akademik Felç');
          Y = pdfCheck(doc, Y, 18);
          doc.setFillColor(255,195,195); doc.roundedRect(15,Y,180,14,2,2,'F');
          doc.setFillColor(190,0,0); doc.roundedRect(15,Y,5,14,1,1,'F');
          doc.setFont(PF,'bold'); doc.setFontSize(9.5); doc.setTextColor(175,0,0);
          doc.text(tx('⚠  ACİL: BİLİŞSEL BLOKAJ — AKADEMİK FELÇ'), 24, Y+9.5);
          Y+=18;
          kutu('[ID-020] Amigdala Blokajı — Güne Stresli Başlama',
            'Bugün kaygı ' + bugunKaygi.toFixed(1) + '/10 ' + (bugunMoodTr?'('+bugunMoodTr+') ':'') + 'iken hiç akademik çalışma yapılmamış. ' +
            'Bu bir disiplin sorunu değil biyolojik bir savunmadır: prefrontal korteks devre dışı, öğrenci doğrudan donmuştur. ' +
            (bugunSosyal>0?'Sosyal medya '+bugunSosyal.toFixed(1)+' sa — dijital anestezi. ':'') +
            'Koç eylemi: akademik baskı yok, önce duygusal düzenleme. Mikro hedef: 5 soru, en sevdiği ders.',
            [255,210,210],[175,0,0]);
          gunlukBakiye.push('Dün çalışılan konularda unutma eğrisi hızlandı — yarın 10 dk tekrar zorunlu');
          if (dunKaygi>7) gunlukBakiye.push('Dün de kaygı '+dunKaygi.toFixed(1)+'/10 idi — 2 günlük blokaj birikimi');
        }

        // ─── 1. FİZYOLOJİK DURUM ─────────────────────────────
        Y = pdfCheck(doc, Y, 16);
        bolumBaslik([120,60,0],'1.  Fizyolojik Durum','Bugünkü uyku · enerji · odak -> anlık bilişsel kapasite');
        if (!wellnessVar) {
          kutu('Wellness Verisi Girilmemiş',
            'Bugün wellness girişi yok. Klinik bağlam kurulamıyor.' +
            (akademikVar?' '+bugunSoru+' soru çözülmüş ancak fizyolojik zemin bilinmiyor.':''),
            [245,243,255],[130,120,200]);
        } else if (bugunUyku>0&&bugunUyku<6&&bugunEnerji>0&&bugunEnerji<4) {
          gunlukAktifler.push('Akut Fizyolojik Çöküş');
          kutu('[ID-010] Akut Fizyolojik Çöküş — Çift Tehdit',
            'Uyku '+bugunUyku.toFixed(1)+' sa + enerji '+bugunEnerji.toFixed(1)+'/10: ikisi birlikte kritik bölgede. ' +
            'Glimfatik sistem dün gece çalışmadı; bugün öğrenilen bilgiler kalıcı belleğe geçemez. ' +
            (akademikVar?'Çözülen '+bugunSoru+' soru "bilişsel borç" statüsünde — temiz zihinle tekrar edilmeli. ':'Akademik üretim beklenmemeli. ') +
            (s7OrtUyku!==null?'7 günlük uyku ort. '+s7OrtUyku.toFixed(1)+' sa — kümülatif borç birikmiş.':''),
            [255,215,215],[172,12,12]);
          gunlukBakiye.push('Bugün çalışılan konular hatalı kodlanma riski taşıyor — düşük enerji testi önerilir');
        } else if (bugunUyku>0&&bugunUyku<6.5) {
          gunlukAktifler.push('Uyku Borcu');
          kutu('[ID-010] Uyku Borcu — Bellek Konsolidasyonu Riskli',
            'Bugün '+bugunUyku.toFixed(1)+' sa uyku (ideal 7.5+). ' +
            (bugunEnerji>0?'Enerji '+bugunEnerji.toFixed(1)+'/10. ':'') +
            'REM evresi kısalmış olabilir; dün öğrenilen bilgiler tam konsolide olmamıştır. ' +
            (akademikVar?bugunSoru+' soruluk çalışmanın özellikle sözel/mantık gerektiren kısmı risk altında.':'') +
            (s7OrtUyku!==null&&s7OrtUyku<6.5?' Son 7 gün uyku ort. '+s7OrtUyku.toFixed(1)+' sa — kronik borç.':''),
            [255,232,215],[160,55,0]);
          gunlukBakiye.push('Uyku borcu devam ederse hafta sonu performans düşüşü kaçınılmaz');
        } else if (bugunUyku>0&&bugunUyku<6.5&&bugunOdak>8) {
          gunlukAktifler.push('Yanılsamalı Hiper-Odak');
          kutu('[ID-020] Yanılsamalı Hiper-Odak — Adrenalin Maskesi',
            'Uyku '+bugunUyku.toFixed(1)+' sa iken odak '+bugunOdak.toFixed(1)+'/10. ' +
            'Stres hormonu kortizol geçici odak sağlıyor; hata denetim mekanizması (error monitoring) devre dışı. ' +
            (akademikVar?'Bugün çözülen '+bugunSoru+' soruda fark edilmeden geçilen hatalar birikmiş olabilir.':''),
            [255,240,215],[148,78,0]);
        } else if (bugunEnerji>=7&&(bugunUyku===0||bugunUyku>=7)) {
          kutu('Fizyolojik Durum: Destekleyici',
            (bugunUyku>0?'Uyku '+bugunUyku.toFixed(1)+' sa, ':'')+
            'enerji '+bugunEnerji.toFixed(1)+'/10'+(bugunOdak>0?', odak '+bugunOdak.toFixed(1)+'/10':'')+'. ' +
            'Biyolojik koşullar öğrenmeyi destekliyor. ' +
            (akademikVar?bugunSoru+' sorunun kalıcı öğrenmeye dönüşme olasılığı yüksek. ':'Bu iyi fizyolojik durumu aktif çalışmaya yönlendir. ') +
            (s7OrtEnerji!==null&&s7OrtEnerji<5?' Ancak son 7 günün enerji ort. '+s7OrtEnerji.toFixed(1)+'/10 — bugün istisna, trend izleniyor.':''),
            [222,250,232],[14,128,62]);
        } else {
          kutu('Fizyolojik Durum: Orta',
            (bugunUyku>0?'Uyku: '+bugunUyku.toFixed(1)+' sa  ':'') +
            (bugunEnerji>0?'Enerji: '+bugunEnerji.toFixed(1)+'/10  ':'') +
            (bugunOdak>0?'Odak: '+bugunOdak.toFixed(1)+'/10':'') +
            '. Kritik patoloji yok; izleme devam.',
            [240,238,255],[100,90,175]);
        }

        // ─── 2. DUYGUSAL DURUM VE BRANŞ KAÇIŞLARI ────────────
        Y = pdfCheck(doc, Y, 16);
        bolumBaslik([150,30,30],'2.  Duygusal Durum ve Branş Analizi','Bugünkü kaygı · mood · branş tercihi çaprazlaması');

        if (bugunKaygi>0||bugunMood) {
          // Branş dağılımı (kaçış/sığınak tespiti)
          const bugunBransDag = bugunDersler.map(d=>{
            const q=bugunAkad.filter(e=>e.subject===d).reduce((a,e)=>a+(e.questions||0),0);
            const y=bugunAkad.filter(e=>e.subject===d).reduce((a,e)=>a+(e.wrong||0),0);
            return {d,q,hataPct:q>0?y/q*100:null};
          }).sort((a,b)=>b.q-a.q);
          const enCokBrans = bugunBransDag[0];
          const sayisalYok = akademikVar && bugunBransDag.filter(d=>sayisalDersler.includes(d.d)).length===0;
          const sozelVar   = akademikVar && bugunBransDag.some(d=>sozelDersler.includes(d.d));

          if (bugunKaygi>=8&&akademikVar&&enCokBrans) {
            gunlukAktifler.push('Akademik Anestezi');
            kutu('[ID-085] Akademik Anestezi — Konfor Alanına Sığınma',
              'Kaygı '+bugunKaygi.toFixed(1)+'/10 iken '+enCokBrans.d+' branşında '+enCokBrans.q+' soru çözüldü. ' +
              (sayisalYok&&sozelVar?'Sayısal branşlar hiç çalışılmadı -> Sözel Sığınma refleksi aktif. ':'') +
              'Bu üretim öğrenme odaklı değil; "başarıyorum" illüzyonuyla kaygı anestezisi yapılıyor. ' +
              (enCokBrans.hataPct!==null?'İsabet %'+(100-enCokBrans.hataPct).toFixed(0)+' — anestezi kalitesi de düşük.':''),
              [255,228,215],[158,70,0]);
            if (sayisalYok) gunlukBakiye.push('Bugün kaçınılan sayısal branşlar: yarın 10 dk "kapı aralama" seansı');
          } else if (bugunKaygi>=8&&!akademikVar&&bugunSosyal>0) {
            // Amigdala blokajı zaten yukarıda işlendi, burada sosyal medya detayı
            kutu('[ID-035] Dijital Anestezi — Kaçış Kapısı Kullanıldı',
              'Akademik giriş yok + sosyal medya '+bugunSosyal.toFixed(1)+' sa. ' +
              'Öğrenci başarısızlık korkusuyla yüzleşmek yerine dijital uyuşturmayı tercih etti. ' +
              'Bu bir dinlenme değil "bilişsel erteleme" — akademik sorun çözülmeden büyüyor.',
              [255,215,215],[170,15,15]);
          } else if (negatifMood&&akademikVar&&sayisalYok&&sozelVar) {
            kutu('[ID-095] Sözel Sığınma — Bilişsel Konfor Refleksi',
              bugunMoodTr+' hissederken sayısal branşlar bırakılmış, sözel branşlara yönelinmiş. ' +
              'Beyin yorgunluk/kaygı anında bilişsel yükü düşük branşı seçiyor. ' +
              'Bu durum sayısal branşlarda bugün zaman kaybı yaratıyor.',
              [255,240,215],[145,78,0]);
          } else if (bugunKaygi>0&&bugunKaygi<5) {
            kutu('Kaygı Düşük — Öğrenme Penceresi Açık',
              'Kaygı '+bugunKaygi.toFixed(1)+'/10'+(bugunMoodTr?' ('+bugunMoodTr+')':'')+'. ' +
              (akademikVar?'Bugün çözülen '+bugunSoru+' sorunun öğrenme kalitesi yüksek olmalı.':'Bu pencereyi aktif çalışmaya dönüştür.'),
              [222,250,232],[14,128,62]);
          } else {
            // SANİTİZASYON TESPİTİ: "olumsuz düşüncem yok" + önceki gün negatif var
          const sanitizasyonKelimeler = ['yok','hiçbir','yoğum','olumsuz değil','sıkıntım yok','sorunum yok'];
          const sanitizasyonBugün = bugunNegatif && sanitizasyonKelimeler.some(k=>bugunNegatif.toLowerCase().includes(k));
          const dunNegatifVar = (dunW.negatif||'').trim().length > 5;
          if (sanitizasyonBugün && dunNegatifVar && !kullanılanOlaylar.has('G_sanitizasyon')) {
            gunlukAktifler.push('Olumsuzluğu Önemsizleştirme');
            kullanılanOlaylar.add('G_sanitizasyon');
            kutu('Olumsuzluğu Önemsizleştirme — Öğrencinin Sesi',
              '"' + bugunNegatif + '" ifadesi bugün girilmiş; ancak dün "' + (dunW.negatif||'').substring(0,50) + '" diye negatif bir düşünce bildirilmişti. ' +
              'Olumsuzluğu önemsizleştirme (sanitizasyon): öğrenci sorununu kapatmaya çalışıyor, gerçek sıkıntı bastırılmış olabilir. ' +
              'Koç görüşmesinde dünkü ifade doğrudan ele alınmalı — "Dün ne hissediyordun?" sorusuyla başla.',
              [248,222,255],[115,45,180]);
            gunlukBakiye.push('Dün bildirilen negatif düşünce bugün inkâr edildi — koç seansında ele alınmalı');
          }

          kutu('Duygusal Durum: '+(bugunMoodTr||'Orta'),
              (bugunKaygi>0?'Kaygı: '+bugunKaygi.toFixed(1)+'/10. ':'') +
              (bugunMoodTr?'Duygu: '+bugunMoodTr+'. ':'') +
              (akademikVar?bugunSoru+' soru çözüldü. ':'') +
              'Belirgin klinik sinyal yok.',
              [240,238,255],[100,90,175]);
          }
        } else {
          // ID-080: Pazartesi Sendromu
          const _gunPazar = new Date(dateKey+'T12:00:00').getDay() === 0;
          if (_gunPazar && bugunKaygi > 7 && bugunOdak > 0 && bugunOdak < 4
              && !kullanılanOlaylar.has('G_pazar')) {
            kullanılanOlaylar.add('G_pazar');
            gunlukAktifler.push('Pazartesi Sendromu');
            kutu('[ID-080] Gelecek Kaygısı — Pazartesi Sendromu',
              'Pazar akşamı: Kaygı ' + bugunKaygi.toFixed(1) + '/10 + Odak ' + bugunOdak.toFixed(1) + '/10. ' +
              'Hafta başına yönelik öngörü stresi günü sabote etti. ' +
              'Öğrenci başlamadan yoruluyor; hafta planlaması ve küçük adım hedefleme bu döngüyü kırabilir.',
              [255,235,250],[140,20,100]);
            gunlukBakiye.push('Pazar akşamı kaygısı — haftaya giriş ritüeli önerilir');
          }

          kutu('Duygusal Veri Girilmemiş',
            'Bugün kaygı/mood girişi yok. Psikolojik bağlam kurulamıyor.',
            [245,243,255],[130,120,200]);
        }

        // ─── 3. AKADEMİK ÜRETIM VE HAFIZA ───────────────────
        Y = pdfCheck(doc, Y, 16);
        bolumBaslik([20,95,145],'3.  Akademik Üretim ve Hafıza Riski','Bugünkü çalışma kalitesi · hatalı kodlanma tespiti');

        if (!akademikVar) {
          const neden = bugunKaygi>=7?'Biyolojik blokaj (Amigdala)':
                        negatifMood?'Duygusal bariyer':
                        bugunSosyal>2?'Dijital anestezi':
                        bugunEnerji>0&&bugunEnerji<3?'Akut enerji yetersizliği':'Bilinmiyor';
          kutu('Akademik Üretim Yok — Neden Analizi',
            'Bugün hiç akademik veri girilmedi. Olası neden: ' + neden + '. ' +
            (ardisikBosDays>0?'Bu '+(ardisikBosDays+1)+'. üst üste boş gün. ':'')+
            (dunSoru>0?'Dün '+dunSoru+' soru çözülmüştü — bugünkü boşluk o bilgilerin kalıcılığını tehdit ediyor (Ebbinghaus unutma eğrisi).':'') +
            ' Yarın mutlaka en az 20 soru: boşluk uzadıkça borç katlanır.',
            [255,228,215],[155,70,0]);
          gunlukBakiye.push('Her geçen boş gün önceki çalışmaların kalıcılığını %20-30 azaltıyor');
        } else {
          // AKTİVİTE YOLUYLA KAÇIŞ: kaygı>8 + aşırı soru + kalite düşük
          if (bugunKaygi>=8 && bugunSoru>ortSoru*1.4 && bugunIsabet!==null && bugunIsabet<70
              && !kullanılanOlaylar.has('G_aktivite_kacis')) {
            gunlukAktifler.push('Çalışma Görüntüsüyle Kaçınma');
            kullanılanOlaylar.add('G_aktivite_kacis');
            kutu('[ID-115] Çalışma Görüntüsüyle Kaçınma — Sahte Verimlilik',
              'Kaygı ' + bugunKaygi.toFixed(1) + '/10 iken bugün ' + bugunSoru + ' soru çözüldü (ort. ' + Math.round(ortSoru) + '). ' +
              'Ancak isabet %' + bugunIsabet + ' — yüksek hacim düşük kalite. ' +
              'Öğrenci kaygıyla yüzleşmek yerine "çalışıyor" maskesi takarak soru sayısını artırıyor. ' +
              'Bu sorular belleğe hatalı kodlanma riski taşır; sayı değil kalite öncelikli.',
              [255,232,210],[160,55,0]);
            gunlukBakiye.push('Bugün çalışma görüntüsüyle kaçınma: yüksek hacim+düşük kalite kombinasyonu');
          }

          // Kriz altında çalışma kontrolü
          const krizAltinda = (bugunKaygi>=8)||(bugunUyku>0&&bugunUyku<6)||(bugunEnerji>0&&bugunEnerji<3);
          if (krizAltinda) {
            gunlukAktifler.push('Kriz Altında Çalışma');
            const enYuksekHataBrans = bugunBransDagSimple();
            function bugunBransDagSimple() {
              return bugunDersler.map(d=>{
                const entries=bugunAkad.filter(e=>e.subject===d);
                const q=entries.reduce((a,e)=>a+(e.questions||0),0);
                const y=entries.reduce((a,e)=>a+(e.wrong||0),0);
                return {d,q,pct:q>0?y/q*100:null};
              }).filter(x=>x.pct!==null).sort((a,b)=>b.pct-a.pct)[0];
            }
            // ID-165: Kriz Savar — yüksek kaygıda üretim devam ettiyse pozitif sinyal
            if (krizAltinda && bugunSoru >= 15 && bugunIsabet !== null && bugunIsabet >= 70
                && !kullanılanOlaylar.has('G_kriz_savar')) {
              kullanılanOlaylar.add('G_kriz_savar');
              gunlukAktifler.push('Kriz Savar');
              kutu('[ID-165] Kriz Savar — Yüksek Psikolojik Dayanıklılık',
                'Kriz koşullarına (kaygı/uyku/enerji baskısı) rağmen ' + bugunSoru + ' soru çözüldü, isabet %' + bugunIsabet + '. ' +
                'Bu, öğrencinin baskı altında dağılmadığının klinik kanıtıdır. ' +
                'Sınav günü bu dayanıklılık kapasitesi kritik avantaj sağlayacak. Koç teyit etmeli.',
                [220,255,235],[14,128,62]);
              gunlukBakiye.push('Kriz altında kaliteli üretim: sınav günü dayanıklılığının pozitif sinyali');
            }

            kutu('[ID-125] Kriz Altında Çalışma — Hatalı Kodlanma Riski',
              bugunSoru+' soru fizyolojik/psikolojik kriz koşullarında çalışıldı. ' +
              (enYuksekHataBrans?'"'+enYuksekHataBrans.d+'" branşında %'+(100-enYuksekHataBrans.pct).toFixed(0)+' isabet — bu konu bugün kalıcı belleğe "hatalı mantık" ile kaydedilmiş olabilir. ':'') +
              'Bu çalışma "tamamlandı" değil "borçlandı" olarak işaretlenmeli; 48-72 saat içinde temiz zihinle Hasar Tespit Testi yapılmalı.',
              [255,225,215],[168,20,20]);
            gunlukBakiye.push('Bugün kriz altında çalışılan konular: ' + (bugunDersler.join(', ')||'belirsiz') + ' — temiz zihin testi gerekli');
          } else {
            // Normal çalışma
            const isabetStr = bugunIsabet!==null?(' İsabet: %'+bugunIsabet+'.'):'';
            kutu('Akademik Üretim: '+(bugunIsabet!==null&&bugunIsabet>80?'Kaliteli':'Normal'),
              bugunSoru+' soru, '+bugunSure+' dk.'+isabetStr+
              (bugunDersler.length>0?' Çalışılan: '+bugunDersler.join(', ')+'.':'')+
              (bugunIsabet!==null&&bugunIsabet>85?' Fizyolojik koşullar iyi + yüksek isabet -> kalıcı öğrenme gerçekleşmiş olabilir.':
               bugunIsabet!==null&&bugunIsabet<65?' Düşük isabet — hata analizi yapılmadan yeni soru çözme verimsiz.':''),
              bugunIsabet!==null&&bugunIsabet>80?[222,250,232]:[240,238,255],
              bugunIsabet!==null&&bugunIsabet>80?[14,128,62]:[100,90,175]);
          }
        }

        // ─── 4. EKRan / DİJİTAL (veri varsa) ────────────────
        if (bugunSosyal>0||bugunOnline>0) {
          Y = pdfCheck(doc, Y, 16);
          bolumBaslik([65,35,130],'4.  Ekran Verisi','Sosyal medya ve online ders çaprazlaması');
          if (bugunSosyal>2&&(negatifMood||bugunKaygi>=7)) {
            kutu('[ID-001] Reaktif Dijital Kaçış — Dijital Yorgunluk',
              'Sosyal medya '+bugunSosyal.toFixed(1)+' sa + olumsuz durum. ' +
              'Olumsuz hislerle baş edememe -> dijital uyuşturma döngüsü. ' +
              (bugunSosyal>bugunOnline?'Eğlence ekranı akademik ekranı geçti ('+bugunSosyal.toFixed(1)+' sa vs '+bugunOnline.toFixed(1)+' sa).':''),
              [255,218,218],[172,15,15]);
          } else if (bugunOnline>3&&!akademikVar) {
            kutu('[ID-105] Pasif Öğrenme İllüzyonu — Masa Başında Hayal Kurma',
              bugunOnline.toFixed(1)+' sa online ders izlendi ama soru çözümü yok. ' +
              'Pasif izleme kalıcı nöral yollar oluşturmaz — "öğrendim" hissi yanıltıcı.',
              [255,238,215],[145,78,0]);
          } else {
            kutu('Ekran Dengesi',
              (bugunSosyal>0?'Sosyal medya: '+bugunSosyal.toFixed(1)+' sa. ':'')+
              (bugunOnline>0?'Online ders: '+bugunOnline.toFixed(1)+' sa. ':'')+
              (bugunSosyal<1.5?'Sosyal medya kontrol altında.':''),
              [230,255,240],[20,140,70]);
          }
        }

        // ─── 5. GÜNLÜK BÜTÜNCÜL DEĞERLENDİRME ───────────────
        Y = pdfCheck(doc, Y, 20);
        Y = pdfSecHeader(doc, 'GÜNLÜK BÜTÜNCÜL DEĞERLENDİRME', Y, 20, 140, 100);
        doc.setFont(PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(100,90,140);
        doc.text(tx('Tüm bugünkü verilerin klinik sentezi + koç iletişim stratejisi'), 16, Y); Y+=7;

        // Profil tespiti
        const acilDurum   = gunlukAktifler.includes('Amigdala Blokajı — Akademik Felç');
        const krizDurum   = gunlukAktifler.some(r=>r.includes('Çöküş')||r.includes('Stres Blokajı')||r.includes('Kriz Altında'));
        const iyiDurum    = gunlukAktifler.length===0 && akademikVar && (bugunIsabet===null||bugunIsabet>75);

        if (acilDurum) {
          kutu('GÜNLÜK TANI: Akademik Felç — Acil Müdahale',
            'Bugün tüm göstergeler kritik: kaygı '+bugunKaygi.toFixed(1)+'/10, akademik üretim sıfır. ' +
            (bugunSosyal>0?'Dijital anestezi '+bugunSosyal.toFixed(1)+' sa. ':'') +
            'Koç eylem planı: akademik baskı yok, "Nasıl hissediyorsun?" ile başla, mikro hedef koy.',
            [255,205,205],[175,0,0]);
        } else if (krizDurum) {
          kutu('GÜNLÜK TANI: Kriz Koşullarında Çalışma',
            'Aktif faktörler: '+gunlukAktifler.join(', ')+'. ' +
            (akademikVar?bugunSoru+' soru çözüldü ancak kalıcılığı sorgulanmalı. ':'') +
            'Koç: akademik rakamları değil fizyolojik iyileşmeyi önceliklendir.',
            [255,222,215],[168,20,20]);
        } else if (iyiDurum) {
          kutu('GÜNLÜK TANI: Destekleyici Gün',
            'Bugün '+bugunSoru+' soru'+(bugunIsabet!==null?', %'+bugunIsabet+' isabet':'')+'.'+(bugunUyku>0?' Uyku '+bugunUyku.toFixed(1)+' sa.':'')+(bugunKaygi>0?' Kaygı '+bugunKaygi.toFixed(1)+'/10.':'')+' Olumlu bir gün. Bu ritmi koru.',
            [222,250,232],[14,128,62]);
        } else {
          kutu('GÜNLÜK TANI: Orta — İzleme Devam',
            'Aktif klinik risk: '+(gunlukAktifler.length>0?gunlukAktifler.join(', '):'Yok')+'. '+
            (akademikVar?bugunSoru+' soru. ':'Akademik giriş yok. ')+
            'Koç: dengeli tutum — ne baskı ne de görmezden gel.',
            [240,238,255],[100,90,175]);
        }

        // Koç iletişim stratejisi
        const strateji = acilDurum
          ? 'Akademik baskı yok. "Nasıl hissediyorsun?" -> mikro hedef (5 soru) -> yarın takip.'
          : krizDurum
          ? 'Rakamları değil fizyolojik durumu sor. Hata analizi ritüeli öner. Yeni konu girişi durdur.'
          : iyiDurum
          ? 'Olumlu ilerlemeyi teyit et. Somut başarıyı öğrencinin sesiyle tekrar ettir. Dozu artır.'
          : 'Dengeli tutum. Bir sonraki 24 saat için tek bir somut hedef belirle.';
        Y=pdfCheck(doc,Y,10);
        doc.setFont(PF,'bold');doc.setFontSize(7);doc.setTextColor(40,80,140);
        doc.text(tx('Koç İletişim: '), 16, Y);
        doc.setFont(PF,'normal');
        const strSat = doc.splitTextToSize(tx(strateji), 155);
        doc.text(strSat, 48, Y); Y += strSat.length*4.5+4;

        // Bakiye riskler
        if (gunlukBakiye.length>0) {
          Y=pdfCheck(doc,Y,10);
          doc.setFont(PF,'bold');doc.setFontSize(6.5);doc.setTextColor(130,120,175);
          doc.text(tx('Bakiye Riskler (önceki günden):'), 16, Y); Y+=5;
          gunlukBakiye.forEach((r,i)=>dipnot((i+1)+'. '+r));
        }

        // Öğrencinin sesi
        if (bugunPozitif||bugunNegatif) {
          Y=pdfCheck(doc,Y,16);
          doc.setFillColor(248,242,255);doc.roundedRect(15,Y,180,bugunPozitif&&bugunNegatif?22:14,2,2,'F');
          doc.setFillColor(115,75,178);doc.roundedRect(15,Y,4,bugunPozitif&&bugunNegatif?22:14,1,1,'F');
          doc.setFont(PF,'bold');doc.setFontSize(7);doc.setTextColor(115,75,178);
          doc.text(tx('Öğrencinin Sesi:'), 22, Y+5);
          let sy=Y+5; doc.setFont(PF,'normal');doc.setFontSize(6.5);
          if(bugunPozitif){doc.setTextColor(20,140,70);const ls=doc.splitTextToSize(tx('(+) '+bugunPozitif),152);doc.text(ls,22,sy+=5);sy+=ls.length*4;}
          if(bugunNegatif){doc.setTextColor(175,30,30);const ls=doc.splitTextToSize(tx('(-) '+bugunNegatif),152);doc.text(ls,22,sy+=2);sy+=ls.length*4;}
          Y+=bugunPozitif&&bugunNegatif?26:18;
        } // end ogr sesi

      // ═══════════════════════════════════════════════════════════
      // HAFTALIK veya AYLIK RAPOR
      // ═══════════════════════════════════════════════════════════
      } else { // end daily -> start weekly/monthly
        // ── PSİKOLOJİK-AKADEMİK KORELASYON: DİNAMİK SENARYO MOTORU ──
        if (Y > 180) { Y = pdfNewPage(doc); }
        Y = pdfSecHeader(doc, 'PSİKOLOJİK-AKADEMİK KORELASYON ANALİZİ', Y, 220, 50, 100);
        doc.setFont(PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(100,90,140);
        doc.text(tx(period==='weekly'
          ? 'Haftalık psikolojik-akademik örüntü analizi — dinamik senaryo motoru'
          : 'Aylık bütüncül teşhis — 5 modül, 40 senaryo, kalibre eşikler'), 16, Y); Y+=8;

        // Motor çıktısı
        // Motor güvenlik kontrolü — typeof ile güvenli kontrol
        const _motorMevcut = typeof window.calistirSenaryolar === 'function';
        const _gunlerYeterli = gunler && gunler.length >= 2;
        if (_motorMevcut && _gunlerYeterli) {
          const _m = window.calistirSenaryolar(gunler, allAcadEntries, endKey);
          const _ins  = _m.insights  || [];
          const _pos  = _m.positives || [];
          const _vaka = _m.vaka;
          const _kal  = _m.kalOzet;

          // Kalibrasyon özeti
          if (_kal) {
            const _kalSat = tx('Kalibrasyon: ' + _kal.soruOrt + ' soru/gun ort. | Kaygi esigi: ' + _kal.kaygiEsik + ' | Uyku ort: ' + _kal.uyku + ' sa');
            Y = pdfCheck(doc, Y, 10);
            doc.setFont(PF,'italic'); doc.setFontSize(6.2); doc.setTextColor(140,120,180);
            doc.text(_kalSat, 16, Y); Y += 7;
          }

          // ── VAKA KOMBİNASYONU ──────────────────────────────────
          if (_vaka) {
            const _vAnaSat  = doc.splitTextToSize(tx(_vaka.analiz), 152);
            const _vStrSat  = doc.splitTextToSize(tx('Koçluk aksiyonu: ' + _vaka.strateji), 152);
            const _vH = _vAnaSat.length * 4.8 + _vStrSat.length * 4.5 + 22;
            Y = pdfCheck(doc, Y, _vH + 5);
            doc.setFillColor(255, 232, 245);
            doc.roundedRect(15, Y, 180, _vH, 2, 2, 'F');
            doc.setFillColor(200, 40, 110);
            doc.roundedRect(15, Y, 3.5, _vH, 1, 1, 'F');
            doc.setFont(PF,'bold'); doc.setFontSize(7);
            doc.setTextColor(170, 20, 90);
            doc.text(tx('⚡ KOMBİNE VAKA — ' + _vaka.ad.toUpperCase()), 21, Y + 6);
            doc.setFont(PF,'normal'); doc.setFontSize(6.6);
            doc.setTextColor(70, 20, 50);
            doc.text(_vAnaSat, 21, Y + 12);
            doc.setTextColor(160, 30, 80); doc.setFont(PF,'bold');
            doc.text(_vStrSat, 21, Y + 12 + _vAnaSat.length * 4.8 + 3);
            Y += _vH + 6;
          }

          // ── NEGATİF SENARYOLAR ─────────────────────────────────
          const _tonRenk = {
            crisis:      { sol:[180,20,20],   arkaR:255, arkaG:245, arkaB:245 },
            urgent:      { sol:[190,90,0],    arkaR:255, arkaG:248, arkaB:235 },
            empathetic:  { sol:[80,50,170],   arkaR:248, arkaG:245, arkaB:255 },
            rational:    { sol:[20,80,160],   arkaR:240, arkaG:248, arkaB:255 },
            coaching:    { sol:[20,130,80],   arkaR:240, arkaG:255, arkaB:248 },
            informative: { sol:[80,60,140],   arkaR:245, arkaG:242, arkaB:255 },
            directive:   { sol:[160,100,0],   arkaR:255, arkaG:250, arkaB:235 },
            balanced:    { sol:[30,110,80],   arkaR:240, arkaG:252, arkaB:248 },
            validating:  { sol:[60,80,160],   arkaR:243, arkaG:246, arkaB:255 },
          };

          if (_ins.length > 0) {
            Y = pdfCheck(doc, Y, 12);
            doc.setFont(PF,'bold'); doc.setFontSize(7.5);
            doc.setTextColor(100, 30, 30);
            doc.text(tx('Risk & Müdahale Alanları'), 16, Y); Y += 6;

            _ins.forEach(ins => {
              const r = _tonRenk[ins.ton] || _tonRenk.informative;
              const _anaSat = doc.splitTextToSize(tx(ins.analiz), 151);
              const _strSat = doc.splitTextToSize(tx('Strateji: ' + ins.strateji), 151);
              const _iH = _anaSat.length * 4.6 + _strSat.length * 4.5 + 20;
              Y = pdfCheck(doc, Y, _iH + 4);
              doc.setFillColor(r.arkaR, r.arkaG, r.arkaB);
              doc.roundedRect(15, Y, 180, _iH, 1.5, 1.5, 'F');
              doc.setFillColor(r.sol[0], r.sol[1], r.sol[2]);
              doc.roundedRect(15, Y, 3, _iH, 1, 1, 'F');
              // Etiket
              doc.setFont(PF,'bold'); doc.setFontSize(6.5);
              doc.setTextColor(r.sol[0], r.sol[1], r.sol[2]);
              const _freqStr = ins.frekans > 1 ? '  (' + ins.frekans + ' gun)' : '';
              doc.text(tx(ins.etiket + _freqStr + '  [' + ins.id + ']'), 21, Y + 5.5);
              // Analiz
              doc.setFont(PF,'normal'); doc.setFontSize(6.5);
              doc.setTextColor(40, 35, 60);
              doc.text(_anaSat, 21, Y + 11);
              // Strateji
              doc.setFont(PF,'bold'); doc.setFontSize(6.3);
              doc.setTextColor(r.sol[0], r.sol[1], r.sol[2]);
              doc.text(_strSat, 21, Y + 11 + _anaSat.length * 4.6 + 3);
              Y += _iH + 4;
            });
          }

          // ── POZİTİF SENARYOLAR ─────────────────────────────────
          if (_pos.length > 0) {
            Y = pdfCheck(doc, Y, 12);
            doc.setFont(PF,'bold'); doc.setFontSize(7.5);
            doc.setTextColor(20, 120, 70);
            doc.text(tx('Güçlü Yanlar'), 16, Y); Y += 6;

            _pos.forEach(p => {
              const _pSat = doc.splitTextToSize(tx(p.analiz), 152);
              const _pH = _pSat.length * 4.6 + 16;
              Y = pdfCheck(doc, Y, _pH + 4);
              doc.setFillColor(238, 255, 246);
              doc.roundedRect(15, Y, 180, _pH, 1.5, 1.5, 'F');
              doc.setFillColor(20, 150, 80);
              doc.roundedRect(15, Y, 3, _pH, 1, 1, 'F');
              doc.setFont(PF,'bold'); doc.setFontSize(6.5);
              doc.setTextColor(20, 130, 70);
              doc.text(tx('✓ ' + p.etiket), 21, Y + 5.5);
              doc.setFont(PF,'normal'); doc.setFontSize(6.5);
              doc.setTextColor(30, 70, 50);
              doc.text(_pSat, 21, Y + 11);
              Y += _pH + 4;
            });
          }

          // ── BÜTÜNCÜL ANALİZ KÖPRÜSÜ ───────────────────────────
          if (_ins.length > 0 || _pos.length > 0 || _vaka) {
            const _tetIdler = _m.tetiklenenTumIdler || [];
            const _frek = _m.frekansMap || {};

            // Modül ağırlık skorları (frekans bazlı)
            const _skor = {
              bilissel: _ins.filter(s => s.modul === 1).reduce((a,s) => a + (s.frekans||1), 0),
              brans:    _ins.filter(s => s.modul === 2).reduce((a,s) => a + (s.frekans||1), 0),
              ozyet:    _ins.filter(s => s.modul === 3).reduce((a,s) => a + (s.frekans||1), 0),
              dijital:  _ins.filter(s => s.modul === 4).reduce((a,s) => a + (s.frekans||1), 0),
              fizyoloj: _ins.filter(s => s.modul === 5).reduce((a,s) => a + (s.frekans||1), 0),
              pozitif:  _pos.reduce((a,p) => a + (p.frekans||1), 0),
            };
            const _toplamNeg = _skor.bilissel + _skor.brans + _skor.ozyet + _skor.dijital + _skor.fizyoloj;
            const _kritikBlok = _tetIdler.some(id => ['DYN-04','DYN-82','DYN-90'].includes(id));
            const _tukenmis   = _tetIdler.some(id => ['DYN-134','DYN-10','DYN-128'].includes(id));
            const _yuksekFon  = _tetIdler.some(id => ['DYN-76','DYN-96'].includes(id));

            // Profil tipi — baskın modüle göre
            let _profil = 'dengeli';
            if (_kritikBlok) _profil = 'bloke';
            else if (_tukenmis && _skor.fizyoloj >= 2) _profil = 'tukenmis';
            else if (_yuksekFon && _skor.bilissel >= 2) _profil = 'yuksekFonKaygi';
            else if (_skor.brans >= 3 && _skor.brans >= _skor.bilissel && _skor.brans >= _skor.dijital) _profil = 'kacinan';
            else if (_skor.dijital >= 3 && _skor.dijital >= _skor.brans) _profil = 'dijitalGolgeli';
            else if (_toplamNeg <= 2 && _skor.pozitif >= 3) _profil = 'dengeli';
            else _profil = 'karisik';

            // Profil metin havuzu (Turkce karakter yok — tx() ile render)
            const _pm = {
              bloke: {
                foto:     'Öğrenci bu dönemde akademik üretimi tamamen durduran bir psikolojik blok yaşamıştır. Yüksek kaygı ile gelen eylemsizlik, süreci anlamlandırma güçlüğüne işaret etmektedir.',
                strateji: 'Akademik baskı tamamen kaldırılmalı; koç görüşmesi rakamlar değil öğrencinin neden çalışamadığını keşfetmek üzerine kurgulanmalıdır. Mikro adımlar — tek bir soru, tek bir sayfa — yeniden başlatma noktası olacaktır.',
                gelecek:  'Gelecek ay önceliği akademik hedef değil, sisteme geri dönme ritmini oturtmaktır.'
              },
              tukenmis: {
                foto:     'Öğrenci bu dönemde biyolojik rezervlerini tüketerek performansını sürdürmeye çalışmıştır. Uyku borcu, düşük enerji ve yüksek kaygı aynı anda etki etmiş; sistem alarm vermiştir.',
                strateji: 'Soru sayısı yerine uyku ve enerji yönetimi önceliklendirilmeli; iletişimde "daha çok çalış" mesajından kaçınılmalıdır. Dinlenmek bir ödül değil, performans aracı olarak konumlandırılmalıdır.',
                gelecek:  'Gelecek ay ilk haftası onarım haftası ilan edilmeli; uyku rutini stabilize edilmeden akademik hedef artırımı yapılmamalıdır.'
              },
              yuksekFonKaygi: {
                foto:     'Öğrenci yüksek akademik üretimini korurken yoğun iç baskı altında olduğu gözlemlenmiştir. Dış gözlemden başarılı görünen tablo, iç dünyada sürdürülemez bir gerilim barındırmaktadır.',
                strateji: 'Başarı somut verilerle tescil edilmeli ve öğrenciye geri yansıtılmalıdır. Koç iletişimi performans değil, öğrencinin kendisiyle barışı üzerine kurgulanmalıdır.',
                gelecek:  'Gelecek ay hedefi niceliksel değil, başarıyı fark etme ve içselleştirme kapasitesi olmalıdır.'
              },
              kacinan: {
                foto:     'Öğrenci bu dönem akademik zamanını güçlü hissettiği alanlarda yoğunlaştırmış; zayıf branşlarla temas sistematik biçimde azalmıştır. Bu durum kısa vadede iyi hissettirse de uzun vadeli branş dengesini bozmaktadır.',
                strateji: 'Koç, zayıf branşa çalış demek yerine günün en yüksek enerjisine denk gelecek 15 dakikalık minimal temas protokolü önermelidir. Küçük başarılar anında geri bildirimle ödüllendirilmelidir.',
                gelecek:  'Gelecek ay zayıf branş için haftalık minimum süre kotası belirlenmeli; önce çok düşük tutulup kademeli artırılmalıdır.'
              },
              dijitalGolgeli: {
                foto:     'Bu dönemde dijital kullanım ile odaklanma kalitesi arasında belirgin bir ters ilişki gözlemlenmiştir. Yüksek ekran süresi olan günlerin ertesinde odak ve üretim değerleri düşmektedir.',
                strateji: 'Öğrenciye dijital kısıtlama bir yaptırım olarak değil, netlerini artıran bir performans aracı olarak sunulmalıdır. Somut veri gösterimi en etkili ikna yöntemidir.',
                gelecek:  'Gelecek ay için günlük ekran üst limiti belirlenmeli; çalışma öncesi 15 dakika ekransız başlangıç rutini denenmeli.'
              },
              dengeli: {
                foto:     'Öğrenci bu dönemde genel olarak dengeli bir performans sergilemiştir. Hem akademik hem duygusal verilerde belirgin bir istikrar gözlemlenmekte; sürecin sürdürülebilir olduğunu gösteren sinyaller alınmaktadır.',
                strateji: 'Mevcut ritim korunmalı ve onaylanmalıdır. Gelişim için küçük bir zorluk eşiği eklenebilir; favori branşta hedef yükseltmek gibi.',
                gelecek:  'Gelecek ay hedefi mevcut dengeyi bozmadan bir ya da iki zayıf alanda küçük kazanımlar eklemek olmalıdır.'
              },
              karisik: {
                foto:     'Bu dönem birden fazla alanda çeşitli güçlükler gözlemlenmiştir. Tek bir baskın patern yerine farklı günlerde farklı tetikleyicilerin devreye girdiği karma bir tablo söz konusudur.',
                strateji: 'En yüksek frekanslı senaryoya odaklanılmalı; tüm sorunları aynı anda çözmeye çalışmak yerine tek bir öncelik belirlenmesi gerekmektedir.',
                gelecek:  'Gelecek ay için tek somut değişiklik hedeflenmeli; birden fazla alanı aynı anda düzeltmeye çalışmak süreçten kopmaya neden olabilir.'
              }
            }[_profil] || { foto:'', strateji:'', gelecek:'' };

            // Render: 3 kutu
            const _kutular = [
              { baslik: 'AYLIK FOTOĞRAFIN', metin: _pm.foto,     ar:242, ag:240, ab:255, sr:70,  sg:40,  sb:180 },
              { baslik: 'KOÇLUK STRATEJİSİ', metin: _pm.strateji, ar:238, ag:255, ab:245, sr:20,  sg:130, sb:70  },
              { baslik: 'GELECEK AY PLANI',  metin: _pm.gelecek,  ar:255, ag:248, ab:235, sr:170, sg:80,  sb:0   },
            ];

            // Bütüncül Analiz bölüm başlığı — belirgin section header
            Y = pdfCheck(doc, Y, 22);
            const _bridgeH = 12;
            doc.setFillColor(40, 30, 100);
            doc.roundedRect(15, Y, 180, _bridgeH, 2, 2, 'F');
            doc.setFont(PF, 'bold'); doc.setFontSize(8.5); doc.setTextColor(255, 255, 255);
            doc.text(tx('BÜTÜNCÜL ANALİZ KÖPRÜSÜ'), 105, Y + 8, { align: 'center' });
            Y += _bridgeH + 6;

            _kutular.forEach(k => {
              if (!k.metin) return;
              const _sat = doc.splitTextToSize(tx(k.metin), 152);
              const _h   = _sat.length * 4.8 + 18;
              Y = pdfCheck(doc, Y, _h + 5);
              doc.setFillColor(k.ar, k.ag, k.ab);
              doc.roundedRect(15, Y, 180, _h, 1.5, 1.5, 'F');
              doc.setFillColor(k.sr, k.sg, k.sb);
              doc.roundedRect(15, Y, 3.5, _h, 1, 1, 'F');
              doc.setFont(PF,'bold'); doc.setFontSize(7);
              doc.setTextColor(k.sr, k.sg, k.sb);
              doc.text(tx(k.baslik), 21, Y + 6);
              doc.setFont(PF,'normal'); doc.setFontSize(6.6);
              doc.setTextColor(40, 35, 60);
              doc.text(_sat, 21, Y + 12);
              Y += _h + 5;
            });
          }


          // ── VERİ YETERSİZSE ────────────────────────────────────
          if (_ins.length === 0 && _pos.length === 0 && !_vaka) {
            Y = pdfCheck(doc, Y, 14);
            doc.setFont(PF,'normal'); doc.setFontSize(7);
            doc.setTextColor(140, 130, 160);
            doc.text(tx('Bu dönem için senaryo eşleşmesi yapılamadı — wellness veri girişi yetersiz.'), 16, Y); Y += 10;
          }

        } else {
          // Motor yüklenmediyse
          Y = pdfCheck(doc, Y, 14);
          doc.setFont(PF,'normal'); doc.setFontSize(7);
          doc.setTextColor(150, 130, 160);
          const _motorDurum = !_motorMevcut ? 'Motor yuklenemedi' : 'Veri yetersiz (' + (gunler ? gunler.length : 0) + ' gun)';
          doc.text(tx(_motorDurum), 16, Y); Y += 10;
        }

        Y += 6; // nefes boşluğu

      // ── AI KLİNİK YORUMU (haftalık/aylık, sadece AI varsa) ──
      if (aiAnaliz && period !== 'daily') {
        const aiFields = [
          { key: 'ana_tani',         label: 'Ana Tanı',                    renk: [60, 20, 120] },
          { key: 'fizyolojik_yorum', label: 'Fizyolojik Yorum',            renk: [20, 80, 150] },
          { key: 'duygusal_yorum',   label: 'Duygusal Yorum',              renk: [140, 40, 40] },
          { key: 'soru_cozumu_yorum',label: 'Soru Çözümü Yorumu',          renk: [30, 100, 60] },
          { key: 'deneme_yorum',     label: 'Deneme Sınavı Yorumu',        renk: [100, 60, 20] },
          { key: 'brans_riski',      label: 'Branş Riski',                 renk: [160, 50, 10] },
          { key: 'ogr_sesi_yorum',   label: 'Öğrencinin Sesi — AI Yorumu', renk: [90, 30, 160] },
          { key: 'hafiza_borcu',     label: 'Hafıza Borcu',                renk: [40, 80, 140] },
          { key: 'koc_stratejisi',   label: 'Koç Stratejisi',              renk: [20, 100, 80] },
        ];

        // Uyarı seviyesi rengi
        const uvRenk = {
          yesil:   [20, 150, 80],
          sari:    [180, 140, 0],
          turuncu: [200, 90, 0],
          kirmizi: [180, 20, 20],
        }[aiAnaliz.uyari_seviyesi] || [80, 80, 80];

        // Başlık bloğu
        const aiBaslikH = 18;
        Y = pdfCheck(doc, Y, aiBaslikH + 10);
        doc.setFillColor(245, 240, 255);
        doc.roundedRect(15, Y, 180, aiBaslikH, 2, 2, 'F');
        doc.setFillColor(uvRenk[0], uvRenk[1], uvRenk[2]);
        doc.roundedRect(15, Y, 4, aiBaslikH, 1, 1, 'F');
        doc.setFont(PF, 'bold'); doc.setFontSize(8.5);
        doc.setTextColor(70, 30, 160);
        doc.text(tx('🤖 Yapay Zeka Destekli Analiz'), 22, Y + 7);
        const uvLabel = { yesil: 'Düşük Risk', sari: 'Dikkat', turuncu: 'Yüksek Risk', kirmizi: 'Kritik' }[aiAnaliz.uyari_seviyesi] || '';
        if (uvLabel) {
          doc.setFillColor(uvRenk[0], uvRenk[1], uvRenk[2]);
          doc.roundedRect(155, Y + 3, 38, 10, 2, 2, 'F');
          doc.setFont(PF, 'bold'); doc.setFontSize(6.5); doc.setTextColor(255, 255, 255);
          doc.text(tx(uvLabel), 174, Y + 9.5, { align: 'center' });
        }
        doc.setFont(PF, 'normal'); doc.setFontSize(6.5); doc.setTextColor(100, 80, 160);
        doc.text(tx('Sözel veriler ve istatistikler birlikte yorumlandı — yapay zeka destekli analiz'), 22, Y + 13);
        Y += aiBaslikH + 5;

        // Her alan
        aiFields.forEach(f => {
          const val = aiAnaliz[f.key];
          if (!val || (typeof val === 'string' && !val.trim())) return;
          if (Array.isArray(val) && val.length === 0) return;

          const metinStr = Array.isArray(val) ? val.join(' • ') : val;
          const mSat = doc.splitTextToSize(tx(metinStr), 154);
          const bH = Math.max(mSat.length * 5 + 16, 18);
          Y = pdfCheck(doc, Y, bH + 6);

          doc.setFillColor(250, 247, 255);
          doc.roundedRect(15, Y, 180, bH, 1.5, 1.5, 'F');
          doc.setFillColor(f.renk[0], f.renk[1], f.renk[2]);
          doc.roundedRect(15, Y, 3, bH, 1, 1, 'F');

          doc.setFont(PF, 'bold'); doc.setFontSize(7);
          doc.setTextColor(f.renk[0], f.renk[1], f.renk[2]);
          doc.text(tx(f.label), 21, Y + 6);

          doc.setFont(PF, 'normal'); doc.setFontSize(6.8);
          doc.setTextColor(40, 35, 70);
          doc.text(mSat, 21, Y + 6 + 6);
          Y += bH + 5;
        });

        // Kriz günleri listesi (AI'dan geliyorsa)
        if (aiAnaliz.kriz_gunleri && aiAnaliz.kriz_gunleri.length > 0) {
          const krizSat = doc.splitTextToSize(tx('Tespit Edilen Kriz Günleri: ' + aiAnaliz.kriz_gunleri.join(' · ')), 156);
          const kH = Math.max(krizSat.length * 5 + 14, 16);
          Y = pdfCheck(doc, Y, kH + 6);
          doc.setFillColor(255, 240, 240); doc.roundedRect(15, Y, 180, kH, 1.5, 1.5, 'F');
          doc.setFillColor(180, 20, 20); doc.roundedRect(15, Y, 3, kH, 1, 1, 'F');
          doc.setFont(PF, 'bold'); doc.setFontSize(7); doc.setTextColor(160, 20, 20);
          doc.text(tx('Kriz Günleri (AI Tespiti)'), 21, Y + 6);
          doc.setFont(PF, 'normal'); doc.setFontSize(6.8); doc.setTextColor(120, 20, 20);
          doc.text(krizSat, 21, Y + 12);
          Y += kH + 5;
        }

        Y += 4; // AI bloğu sonrası nefes boşluğu
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
