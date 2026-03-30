async function exportPsychPDF(sName) {
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
    const dLgs = Math.max(0,Math.floor((new Date('2026-06-14T09:30:00+03:00')-new Date())/(1000*60*60*24)));

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
      const needed = altSat.length*5 + 14 + 100; // Başlık + içerik için geniş tampon
      Y = pdfCheck(doc, Y, needed);
      // Sayfa sonuna yakınsa zorla yeni sayfa
      if (Y > 200) { Y = pdfNewPage(doc); }
      _bolumYeniSayfa = true;
      Y += 3;
      doc.setFont(PF,'bold'); doc.setFontSize(8.5);
      doc.setTextColor(renk[0],renk[1],renk[2]);
      doc.text(baslik, 16, Y); Y+=5;
      doc.setFont(PF,'normal'); doc.setFontSize(6.5);
      doc.setTextColor(Math.min(renk[0]+20,200),Math.min(renk[1]+20,200),Math.min(renk[2]+20,200));
      doc.text(altSat, 16, Y); Y += altSat.length*5+5;
    }

    // AI analizi devre dışı
    const aiAnaliz = null;

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
        Y = pdfCheck(doc, Y, 20);
        Y = pdfSecHeader(doc, 'PSİKOLOJİK-AKADEMİK KORELASYON ANALİZİ', Y, 220, 50, 100);

        // AI kutusu kaldırıldı
                doc.setFont(PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(100,90,140);
        doc.text(tx(period==='weekly'
          ? 'Haftalık neden-sonuç zinciri — her başlık bu haftanın verisiyle çalışır'
          : 'Aylık trend / varyans / kriz kümesi — tekil gün ana analize taşınmaz'), 16, Y); Y+=7;

        // ── A. BİLİŞSEL KAPASİTE VE FİZYOLOJİK BASKI ───────────
        bolumBaslik([120,60,0],'A.  Bilişsel Kapasite ve Fizyolojik Baskı Analizi',
          period==='weekly'
            ? 'Uyku, enerji ve odak verilerinin yönetici fonksiyonlar üzerindeki bu haftaki etkisi (neden-sonuç)'
            : 'Ay genelinde bilişsel istikrar skoru, kronik aşınma tespiti ve hafıza konsolidasyonu analizi');

        {

      {
        // ── Ders sınıflandırması ──
        const sozelDersler = ['Türkçe','İnkılap Tarihi','Din Kültürü','İngilizce'];
        const sayisalDersler = ['Matematik','Fen Bilimleri'];

        // ── Yardımcı: belirli dersin dönemdeki hata oranı (null = veri yok)
        const dersHataOrani = (dersAdi) => {
          const v = dersToplamHata[dersAdi];
          return (v && v.q >= 20) ? v.y/v.q*100 : null;
        };

        // ── Yardımcı: std sapma
        const std = (arr) => {
          if (arr.length < 2) return 0;
          const m = arr.reduce((a,b)=>a+b,0)/arr.length;
          return Math.sqrt(arr.reduce((a,b)=>a+(b-m)**2,0)/arr.length);
        };

        if (period === 'weekly') {
          // ════════════════════════════════════════════════════
          // HAFTALIK SENARYOLAR
          // ════════════════════════════════════════════════════

          // Veri hazırlık
          const uykuVeriliGunler = gunler.filter(d=>d.uyku>0);
          const enerjiVeriliGunler = gunler.filter(d=>d.enerji>0);
          const odakVeriliGunler = gunler.filter(d=>d.odak>0);
          const ortUykuH = uykuVeriliGunler.length>0 ? uykuVeriliGunler.reduce((a,d)=>a+d.uyku,0)/uykuVeriliGunler.length : null;
          const ortEnerjiH = enerjiVeriliGunler.length>0 ? enerjiVeriliGunler.reduce((a,d)=>a+d.enerji,0)/enerjiVeriliGunler.length : null;
          const ortOdakH = odakVeriliGunler.length>0 ? odakVeriliGunler.reduce((a,d)=>a+d.odak,0)/odakVeriliGunler.length : null;
          const ortHataH = hataGunler.length>0 ? hataGunler.reduce((a,d)=>a+d.hataOrani,0)/hataGunler.length : null;
          const ortKaygiH = veriGunler.filter(d=>d.kaygi>0).length>0 ? veriGunler.filter(d=>d.kaygi>0).reduce((a,d)=>a+d.kaygi,0)/veriGunler.filter(d=>d.kaygi>0).length : null;
          const fizIyilikH = (ortEnerjiH!==null && ortOdakH!==null) ? (ortEnerjiH+ortOdakH)/2 : (ortEnerjiH??ortOdakH);

          // ── Vaka 1: Sözel İşlemleme Blokajı ──
          const uykusuzKaygiGunler = gunler.filter(d=>d.uyku>0&&d.uyku<7&&d.kaygi>0&&d.kaygi>7);
          const sozelYuksekHata = sozelDersler.map(d=>({d,h:dersHataOrani(d)})).filter(x=>x.h!==null&&x.h>30);
          if (uykusuzKaygiGunler.length>=2 && sozelYuksekHata.length>0) {
            const etkilenenDers = sozelYuksekHata.sort((a,b)=>b.h-a.h)[0];
            aktifNegatifler.push('Sözel İşlemleme Blokajı');
            kullanılanOlaylar.add('A_sozel_blokaj');
            kutu('Sözel İşlemleme Blokajı (Semantic Fatigue)',
              etkilenenDers.d + ' branşındaki %' + etkilenenDers.h.toFixed(0) + ' hata oranı bilgi eksikliği değil; uykusuzluk (' + (ortUykuH??0).toFixed(1) + ' sa ort.) ve yüksek kaygının beynin dil merkezini (Broca/Wernicke alanları) baskılamasının sonucudur. ' +
              'Bu hafta ' + etkilenenDers.d + ' metnini okuyan öğrenci metni işleyemiyor, "boş bakıyor" — anlık anlam çıkartamama durumu yaşıyor. ' +
              'Reçete: ' + etkilenenDers.d + ' çalışması sabah ilk saate, uyku tam olduğunda yapılmalı.',
              [255,235,220],[160,60,0]);
            bakiyeRiskler.push('Sözel blokaj devam ederse ' + etkilenenDers.d + ' konularında kalıcı hafıza sorunu riski');

          // ── Vaka 2: Sayısal Muhakeme Darboğazı ──
          } else {
            const uykuDusukEnerjiDusuk = gunler.filter(d=>d.uyku>0&&d.uyku<7&&d.enerji>0&&d.enerji<5);
            const sayisalYuksekHata = sayisalDersler.map(d=>({d,h:dersHataOrani(d)})).filter(x=>x.h!==null&&x.h>25);
            if (uykuDusukEnerjiDusuk.length>=1 && sayisalYuksekHata.length>0) {
              const etkilenenDers = sayisalYuksekHata.sort((a,b)=>b.h-a.h)[0];
              aktifNegatifler.push('Sayısal Muhakeme Darboğazı');
              kullanılanOlaylar.add('A_sayisal_darbogaz');
              kutu('Sayısal Muhakeme Darboğazı',
                'Fizyolojik enerji düşüşü (' + (ortEnerjiH??0).toFixed(1) + '/10 ort.) ' + etkilenenDers.d + ' branşındaki işlem kapasitesini kısıtlamıştır. ' +
                '%' + etkilenenDers.h.toFixed(0) + ' hata oranı uykusuzluğun yarattığı mikro-uyku anlarına denk gelen odak sıçramalarıdır — öğrenci adım atlamaktadır, bilgiyi bilmediği için değil. ' +
                'Reçete: ' + etkilenenDers.d + ' çalışması kısa (20 dk) bloklara bölünmeli; uzun oturumlar bu hafta verimsizdir.',
                [255,240,215],[150,80,0]);
              bakiyeRiskler.push(etkilenenDers.d + ' bu hafta yapılan sorular "darboğaz etkisiyle" hatalı kodlanmış olabilir');

            // ── Vaka 3: Yanılsamalı Hiper-Odak (Adrenalin Maskesi) ──
            } else {
              const hipOdakGunler = gunler.filter(d=>d.uyku>0&&d.uyku<6.5&&d.odak>0&&d.odak>8);
              if (hipOdakGunler.length>=1 && ortHataH!==null && ortHataH>((ortSoru>0?ortSoru:DAILY_GOAL)*0.25)) {
                aktifNegatifler.push('Yanılsamalı Hiper-Odak');
                kullanılanOlaylar.add('A_hiper_odak');
                kutu('Yanılsamalı Hiper-Odak (Adrenalin Maskesi)',
                  'Öğrenci odağını yüksek (' + hipOdakGunler.map(d=>d.odak.toFixed(0)).join(', ') + '/10) tanımlıyor ancak bu "Savaş ya da Kaç" modunda üretilen suni bir odaktır. ' +
                  'Uyku ' + hipOdakGunler.map(d=>d.uyku.toFixed(1)).join(', ') + ' saat olan günlerde yüksek odak bildirimi, Hata Denetim Mekanizmasının (Error Monitoring) devre dışı olduğunun işaretidir. ' +
                  'Öğrenci hataları fark etmeden seri üretim yapmaktadır — çözülen sorular "öğrenildi" sayılmamalı.',
                  [255,245,215],[170,100,0]);
                bakiyeRiskler.push('Adrenalin maskesi altında çalışılan konular: kalıcı öğrenme sorgulanmalı');

              // ── Vaka 4: Bilişsel Esneklik Kaybı ──
              } else if (fizIyilikH!==null && fizIyilikH<4) {
                const yeniKonuSure = gunler.reduce((a,d)=>{
                  const sg=soruEntries2.filter(e=>e.dateKey===d.dk&&e.duration>0);
                  return a+sg.reduce((b,e)=>b+(e.duration||0),0);
                },0);
                aktifNegatifler.push('Bilişsel Esneklik Kaybı');
                kullanılanOlaylar.add('A_esneklik_kaybi');
                kutu('Bilişsel Esneklik Kaybı (Rijitlik)',
                  'Fizyolojik iyi oluş skoru bu hafta kritik düzeyde düşük (' + fizIyilikH.toFixed(1) + '/10 — enerji ve odak ortalaması). ' +
                  (yeniKonuSure>90 ? 'Vücut direnci bu denli düşükken yapılan ' + yeniKonuSure + ' dakikalık çalışma süresi; beynin yeni nöral yollar (öğrenme şemaları) oluşturmasını engellemiştir. ' : '') +
                  'Bu hafta yapılan çalışmalar "hatalı kodlanma" riski taşır. Öncelik: fizyolojik toparlanma.',
                  [255,228,220],[175,45,0]);

              // ── Vaka 5: Karar Verme Yorgunluğu ──
              } else if (ortEnerjiH!==null && ortEnerjiH<4) {
                const enYuksekHataDers = dersHataArr[0];
                aktifNegatifler.push('Karar Verme Yorgunluğu');
                kullanılanOlaylar.add('A_karar_yorgunlugu');
                kutu('[ID-115] Karar Verme Yorgunluğu — Fizyolojik İşlem Hatası',
                  'Haftalık enerji ortalaması ' + ortEnerjiH.toFixed(1) + '/10 ile kritik düşüklükte. ' +
                  (enYuksekHataDers ? enYuksekHataDers.d + ' branşında %' + enYuksekHataDers.pct.toFixed(0) + ' hata oranıyla "çeldiriciler arasında kalma" sendromu gözlemlenmektedir. ' : '') +
                  'Fizyolojik çöküş nedeniyle beyin "ayırt etme" yetisini kaybetmiştir; analiz gerektiren branşlarda iki şık arasında kalma sıklığı bu hafta artmıştır.',
                  [255,232,215],[170,55,0]);

              // ── Vaka 6: Amigdala Blokajı ──
              } else if (gunler.some(d=>d.kaygi>0&&d.kaygi>8&&d.soru===0)) {
                const blokajGunler = gunler.filter(d=>d.kaygi>0&&d.kaygi>8&&d.soru===0);
                aktifNegatifler.push('Amigdala Blokajı');
                kullanılanOlaylar.add('A_amigdala_blokaj');
                kutu('Amigdala Blokajı — Akademik Felç',
                  blokajGunler.length + ' günde yüksek kaygı (>' + blokajGunler.map(d=>d.kaygi.toFixed(0)).join(', ') + '/10) ile birlikte akademik veri girişi yapılmamış. ' +
                  'Bu bir disiplin sorunu değil, biyolojik bir savunmadır: yüksek kaygı prefrontal korteksi kilitlemiş ve öğrenciyi akademik felç durumuna sokmuştur. ' +
                  'Koç görüşmesinde bu günler "kayıp" olarak değil, "alarm sinyali" olarak ele alınmalıdır.',
                  [255,218,218],[175,15,15]);
                bakiyeRiskler.push('Amigdala blokajı yaşanan günlerde konular tamamen atlanmış olabilir');

              // ── Vaka 7: Gecikmiş Fizyolojik Bedel (48 Saat Rötarı) ──
              } else {
                const haftaBasiUykuDusuk = gunlerSorted.slice(-3).some(d=>d.uyku>0&&d.uyku<6);
                const haftaSonuBasariDusuk = gunlerSorted.slice(0,3).some(d=>{
                  const sg=soruEntries2.filter(e=>e.dateKey===d.dk);
                  const topQ=sg.reduce((a,e)=>a+(e.questions||0),0);
                  return topQ>0 && sg.reduce((a,e)=>a+(e.wrong||0),0)/topQ > 0.35;
                });
                if (haftaBasiUykuDusuk && haftaSonuBasariDusuk) {
                  aktifNegatifler.push('Gecikmiş Fizyolojik Bedel');
                  kullanılanOlaylar.add('A_gecikme_bedeli');
                  kutu('Gecikmiş Fizyolojik Bedel (48 Saat Rötarı)',
                    'Hafta başındaki düşük uyku süresi, hafta sonu performansına 48-72 saat gecikmeyle yansımıştır. ' +
                    'Hafta sonu görülen başarısızlık o günkü değil, hafta başındaki uyku borcunun tahsilatıdır. ' +
                    'Bir sonraki hafta bu döngüyü kırmak için Pazartesi-Salı uykusu önceliklendirilmeli.',
                    [255,238,215],[155,75,0]);
                } else if (ortUykuH!==null && ortEnerjiH!==null && ortUykuH>=7 && ortEnerjiH>=6 && ortOdakH!==null && ortOdakH>=7
                       && (ortKaygiH===null || ortKaygiH<7)) { // Kaygı düşükse gerçekten dengeli
                  kullanılanOlaylar.add('A_dengeli');
                  kutu('Bilişsel Kapasite: Bu Hafta Dengeli',
                    'Uyku ort. ' + ortUykuH.toFixed(1) + ' sa, enerji ort. ' + ortEnerjiH.toFixed(1) + '/10, odak ort. ' + ortOdakH.toFixed(1) + '/10. ' +
                    'Yönetici fonksiyonlar (planlama, karar verme, hata denetimi) desteklenmiş durumda. ' +
                    (ortSoru>0 ? 'Günlük ort. ' + Math.round(ortSoru) + ' soru ile akademik hacim fizyolojik kapasiteye paralel.' : ''),
                    [230,255,240],[20,140,70]);
                } else if (ortKaygiH!==null && ortKaygiH>=7 && ortEnerjiH!==null && ortEnerjiH>=6) {
                  aktifNegatifler.push('Kırılgan Hiper-Aktivasyon');
                  kullanılanOlaylar.add('A_kirilgan_hiper');
                  kutu('Kırılgan Hiper-Aktivasyon — Bu Hafta',
                    'Enerji ort. ' + ortEnerjiH.toFixed(1) + '/10 yüksek ama kaygı ort. ' + ortKaygiH.toFixed(1) + '/10 ile kritik eşikte. ' +
                      'Kortizol kaynaklı geçici enerji illüzyonu; yüksek üretim "öğrenme" değil "kaygıyla çalışma" refleksini gösterir. ' +
                      'Bu tablo olumlu değil — sürdürülemez bir tempo işaretidir.',
                    [255,228,210],[160,55,0]);
                  bakiyeRiskler.push('Bu hafta kaygı+enerji eş zamanlı yüksek: kırılgan performans');
                } else {
                  kullanılanOlaylar.add('A_veri_yetersiz');
                  kutu('Bilişsel Kapasite: Veri Yetersiz',
                    'Bu hafta için yeterli wellness verisi bulunmamaktadır. ' +
                    (aktifGunler.length>0 ? aktifGunler.length + ' günlük akademik veri mevcuttur ancak fizyolojik bağlam kurulamıyor.' : '') +
                    ' Günlük wellness girişleri analizin kalitesini doğrudan etkiler.',
                    [245,243,255],[130,120,200]);
                }
              }
            }
          }

        } else {
          // ════════════════════════════════════════════════════
          // AYLIK SENARYOLAR
          // ════════════════════════════════════════════════════

          const uykuDizi = veriGunler.filter(d=>d.uyku>0).map(d=>d.uyku);
          const enerjiDizi = veriGunler.filter(d=>d.enerji>0).map(d=>d.enerji);
          const odakDizi = veriGunler.filter(d=>d.odak>0).map(d=>d.odak);
          const ortUykuA = uykuDizi.length>0 ? uykuDizi.reduce((a,b)=>a+b,0)/uykuDizi.length : null;
          const ortEnerjiA = enerjiDizi.length>0 ? enerjiDizi.reduce((a,b)=>a+b,0)/enerjiDizi.length : null;
          const ortOdakA = odakDizi.length>0 ? odakDizi.reduce((a,b)=>a+b,0)/odakDizi.length : null;
          const stdEnerji = std(enerjiDizi);
          const stdOdak = std(odakDizi);
          const istikrarSkoru = (stdEnerji+stdOdak)/2;

          // Ay başı vs ay sonu enerji trendi (regresyon yönü)
          const ayBasiEnerji = enerjiDizi.slice(0, Math.ceil(enerjiDizi.length/3));
          const aySonuEnerji = enerjiDizi.slice(Math.floor(enerjiDizi.length*2/3));
          const ayBasiOrt = ayBasiEnerji.length>0 ? ayBasiEnerji.reduce((a,b)=>a+b,0)/ayBasiEnerji.length : null;
          const aySonuOrt = aySonuEnerji.length>0 ? aySonuEnerji.reduce((a,b)=>a+b,0)/aySonuEnerji.length : null;
          const enerjiiRegresyon = (ayBasiOrt!==null && aySonuOrt!==null) ? aySonuOrt - ayBasiOrt : null;

          // Ay sonu deneme net trendi
          const denemeler = denemEntries2.sort((a,b)=>a.dateKey.localeCompare(b.dateKey));
          const ilkDenemeler = denemeler.slice(0,Math.ceil(denemeler.length/2));
          const sonDenemeler = denemeler.slice(Math.floor(denemeler.length/2));
          const ilkNetOrt = ilkDenemeler.length>0 ? ilkDenemeler.reduce((a,e)=>a+(e.net||0),0)/ilkDenemeler.length : null;
          const sonNetOrt = sonDenemeler.length>0 ? sonDenemeler.reduce((a,e)=>a+(e.net||0),0)/sonDenemeler.length : null;
          const netRegresyon = (ilkNetOrt!==null && sonNetOrt!==null) ? sonNetOrt - ilkNetOrt : null;

          // Vaka 1: Kronik Bilişsel Erozyon
          if (ortUykuA!==null && ortUykuA<7 && netRegresyon!==null && netRegresyon<-1) {
            aktifNegatifler.push('Kronik Bilişsel Erozyon');
            kullanılanOlaylar.add('A_kronik_erozyon');
            kutu('[ID-040] Kronik Bilişsel Erozyon — Hafıza Konsolidasyonu Arızası',
              'Ay boyunca uyku ortalaması ' + ortUykuA.toFixed(1) + ' saat/gece ile yetersiz. ' +
              'Hipokampal bölgedeki veri transferi (' + ortUykuA.toFixed(1) + ' sa < 7 sa eşik) aksatılmıştır. ' +
              (netRegresyon!==null ? 'Ay sonu deneme netlerinde ' + Math.abs(netRegresyon).toFixed(1) + ' birim düşüş; bu ay başındaki uykusuz gecelerin kümülatif yorgunluk bedelidir. ' : '') +
              (enerjiiRegresyon!==null ? 'Enerji trendi: ay başı ' + (ayBasiOrt??0).toFixed(1) + ' -> ay sonu ' + (aySonuOrt??0).toFixed(1) + '/10 (' + (enerjiiRegresyon>0?'+':'') + enerjiiRegresyon.toFixed(1) + ').' : ''),
              [255,218,218],[175,15,15]);
            bakiyeRiskler.push('Bu ay uykusuz geçilen dönemlerde çalışılan konularda geri çağırma (recall) eksikliği riski yüksek');

          // Vaka 2: Duygu Durum Bağımlı Performans (Varyans)
          } else if (istikrarSkoru > 2.5) {
            aktifNegatifler.push('İstikrarsızlık — Yüksek Varyans');
            kullanılanOlaylar.add('A_varyans_yuksek');
            kutu('Duygu Durum Bağımlı Performans — İstikrarsızlık Skoru Kritik',
              'Enerji standart sapması: ' + stdEnerji.toFixed(2) + ', Odak standart sapması: ' + stdOdak.toFixed(2) + '. ' +
              'Bileşik istikrarsızlık skoru: ' + istikrarSkoru.toFixed(2) + ' (eşik: 2.5). ' +
              'Öğrencinin performansı tamamen anlık duygu durumuna bağlıdır. ' +
              'Sınav anı performansı için "Yüksek Risk" grubu: sınav günü iyi hissedip hissetmemesi sonucu belirleyecek. ' +
              'Rutin ve öngörülebilirlik bu öğrenci için en kritik müdahale alanıdır.',
              [255,238,215],[160,80,0]);

          // Vaka 3: Robotikleşme (Tükenmişlik Sinyali)
          } else if (enerjiiRegresyon!==null && enerjiiRegresyon < -1.5 && ortSoru>0) {
            const soruTrendi = aktifGunler.length>=4 ? (() => {
              const ilkYari = gunler.slice(0,Math.floor(gunler.length/2)).filter(d=>d.soru>0);
              const ikinciYari = gunler.slice(Math.floor(gunler.length/2)).filter(d=>d.soru>0);
              const ilkOrt = ilkYari.length>0?ilkYari.reduce((a,d)=>a+d.soru,0)/ilkYari.length:0;
              const ikinciOrt = ikinciYari.length>0?ikinciYari.reduce((a,d)=>a+d.soru,0)/ikinciYari.length:0;
              return ikinciOrt - ilkOrt;
            })() : null;
            if (soruTrendi!==null && soruTrendi>0) {
              aktifNegatifler.push('Robotikleşme — Tükenmişlik Öncesi');
              kullanılanOlaylar.add('A_robotiklesme');
              kutu('[ID-040] Robotikleşme — Tükenmişlik Öncesi Evre',
                'Enerji trendi: ay başı ' + (ayBasiOrt??0).toFixed(1) + ' -> ay sonu ' + (aySonuOrt??0).toFixed(1) + '/10 (' + enerjiiRegresyon.toFixed(1) + ' puan düşüş). ' +
                'Soru sayısı artarken enerji düşüyor — öğrenci verimi değil, sadece rakamları takip etmektedir. ' +
                'Bu süreçte çözülen sorular nitelikten yoksundur; hacim "çalışma" değil "var olma" amacıyla üretilmektedir. ' +
                'Burnout (tükenmişlik) öncesi evre olarak değerlendirilmeli.',
                [255,232,215],[175,50,0]);
              bakiyeRiskler.push('Robotikleşme döneminde çözülen sorular nitelik açısından sorgulanmalı');
            } else {
              kullanılanOlaylar.add('A_enerji_dusus');
              kutu('Ay Sonu Enerji Düşüşü — İzleme Altında',
                'Enerji trendi: ay başı ' + (ayBasiOrt??0).toFixed(1) + ' -> ay sonu ' + (aySonuOrt??0).toFixed(1) + '/10. ' +
                'Bu düşüş henüz tükenmişlik sinyali değil; ancak bir sonraki ay başında toparlanma gözlemlenmezse müdahale gerekir.',
                [255,245,220],[150,90,0]);
            }

          // Vaka 4: Adaptasyon Direnci
          } else if (ortUykuA!==null && ortEnerjiA!==null && ortUykuA<7 && ortEnerjiA<5 && ortKaygi>7) {
            aktifNegatifler.push('Adaptasyon Direnci');
            kullanılanOlaylar.add('A_adaptasyon_direnci');
            kutu('[ID-040] Adaptasyon Direnci — Fizyolojik Sürdürülemezlik',
              'Ay boyunca yüksek kaygı (' + ortKaygi.toFixed(1) + '/10) + yetersiz uyku (' + ortUykuA.toFixed(1) + ' sa) + düşük enerji (' + ortEnerjiA.toFixed(1) + '/10) birlikte seyretti. ' +
              'Öğrenci mevcut seviyesini korumak için çok ağır bir "duygusal maliyet" ödüyor. ' +
              'Bu tempo fizyolojik olarak sürdürülebilir değildir; bir sonraki kriz evresi daha derin bir çöküşle gelebilir.',
              [255,220,220],[175,20,20]);

          // Vaka 5: Bellek Sızıntısı
          } else if (aktifGunler.length < veriGunler.length * 0.5 && ortHata!==null && ortHata<20) {
            kullanılanOlaylar.add('A_bellek_sizintisi');
            kutu('[ID-140] Bellek Sızıntısı — Kopuk Çalışma Ritmi',
              'Wellness verisi olan ' + veriGunler.length + ' günün yalnızca ' + aktifGunler.length + "'inde akademik çalışma yapılmış. " +
              'İsabet oranı görece yüksek (%' + (100-ortHata).toFixed(0) + ') olsa da, aktif olunmayan günlerdeki "bilişsel boşluk" öğrenilen konuların kalıcı hafızaya geçmeden silinmesine (leakage) neden olmaktadır. ' +
              'Sınav günleri arasındaki uzun boşluklar, Ebbinghaus unutma eğrisini hızlandırır.',
              [240,238,255],[100,90,175]);

          // Vaka 6: Fizyolojik Eşik Aşımı
          } else if (veriGunler.length > 0 && gunlerSorted.slice(0,7).filter(d=>d.enerji>0||d.uyku>0).length < 3) {
            kullanılanOlaylar.add('A_esik_asimi');
            kutu('Fizyolojik Eşik Aşımı — Süreç Yorgunluğu',
              'Ay sonuna yakın wellness veri girişleri seyrekleşmiştir. ' +
              'Bu "unutkanlık" değil; sistemin ödül mekanizmasının çöküşünün işaretidir. ' +
              'Öğrenci için akademik gelişimden ziyade "sürece bağlılık" sorunu öncelikli hale gelmiştir.',
              [245,235,255],[120,80,180]);

          // Vaka 7: Dengeli Ay (kaygı 7'nin altındaysa gerçekten dengeli)
          } else if (ortUykuA!==null && ortUykuA>=7 && ortEnerjiA!==null && ortEnerjiA>=6
                  && (ortKaygi===null || ortKaygi<7)) {
            // MASKELENMIŞ KRİZ: ortalama iyi ama kriz günleri var
            const krizGunSayisiMask = gunler.filter(d=>(d.kaygi>=8)||(d.uyku>0&&d.uyku<6)).length;
            kullanılanOlaylar.add('A_dengeli_ay');
            if (krizGunSayisiMask >= 3) {
              aktifNegatifler.push('Maskelenmiş Kriz');
              kutu('[ID-055] Maskelenmiş Kriz — Gizli Kırılganlık',
                'Uyku ve enerji ortalamaları dengeli görünse de ay içinde ' + krizGunSayisiMask + ' kriz günü (kaygı≥8 veya uyku<6) yaşandı. ' +
                'Ay ortalaması bu krizleri görünmez kılıyor. ' +
                'Öğrencinin "genel olarak iyi" profili, gerçekte kronik kırılganlık üzerine kurulu. ' +
                'Sınav günü kaygı yükselirse kriz moduna geçiş ani ve sert olabilir.',
                [255,232,210],[160,55,0]);
              bakiyeRiskler.push(krizGunSayisiMask + ' kriz günü aylık ortalamaya gömülmüş — gerçek kırılganlık maskelenmiş');
            }
            const trend = enerjiiRegresyon!==null ? (enerjiiRegresyon>0.5?' Enerji ay boyunca yükseliş eğiliminde (' + (enerjiiRegresyon>0?'+':'') + enerjiiRegresyon.toFixed(1) + ' puan). Bu ivme korunmalı.' : enerjiiRegresyon<-0.5?' Enerji hafif düşüş eğiliminde; izlenmeli.' : ' Enerji stabil seyretmiştir.') : '';
            kutu('Bilişsel Kapasite: Bu Ay Dengeli',
              'Uyku ort. ' + ortUykuA.toFixed(1) + ' sa, enerji ort. ' + ortEnerjiA.toFixed(1) + '/10. ' +
              'İstikrar skoru: ' + istikrarSkoru.toFixed(2) + ' (eşik: 2.5 altı — iyi). ' +
              trend +
              (ortSoru>0 ? ' Aylık akademik ort. ' + Math.round(ortSoru) + ' soru/gün.' : ''),
              [230,255,240],[20,140,70]);

          } else if (ortKaygi!==null && ortKaygi>=7 && ortEnerjiA!==null && ortEnerjiA>=6) {
            // Kaygı yüksek + enerji yüksek = kırılgan performans, asla olumlu değil
            aktifNegatifler.push('Kırılgan Hiper-Aktivasyon');
            kullanılanOlaylar.add('A_kirilgan_hiper_ay');
            kutu('Kırılgan Hiper-Aktivasyon — Maskelenmiş Kriz',
              'Enerji ort. ' + ortEnerjiA.toFixed(1) + '/10 yüksek görünse de kaygı ort. ' + ortKaygi.toFixed(1) + '/10 ile kritik eşikte. ' +
                'Bu tablo "iyi performans" değildir. Kortizol ve adrenalin geçici bir enerji illüzyonu yaratmakta; ' +
                'prefrontal korteks kronik baskı altında çalışmaktadır. ' +
                'Yüksek soru üretimi varsa "öğrenme" değil "kaygıyla çalışma" refleksidir. Sürdürülemez.',
              [255,228,210],[160,55,0]);
            bakiyeRiskler.push('Kaygı+enerji eş zamanlı yüksek: tükenmişlik öncesi sinyal — tempo düşürülmeli');
          } else {
            kullanılanOlaylar.add('A_veri_yetersiz_ay');
            kutu('Bilişsel Kapasite: Veri Yetersiz',
              'Aylık analiz için yeterli wellness verisi bulunmamaktadır (' + veriGunler.length + ' gün). ' +
              'Trend ve varyans hesabı için en az 7 günlük sürekli veri gereklidir.',
              [245,243,255],[130,120,200]);
          }
        }
      }

      // Grafik
      if (gunler.length >= 2) {
        Y = pdfCheck(doc, Y, 44);
        const gX=15,gW=180,gH=38;
        doc.setFillColor(248,247,255); doc.roundedRect(gX,Y,gW,gH,2,2,'F');
        doc.setFont(PF,'bold'); doc.setFontSize(5.5); doc.setTextColor(70,70,120);
        doc.text('Günlük Soru (mor çubuk) / Enerji (turuncu) / Kaygı (kırmızı)',gX+gW/2,Y+4,{align:'center'});
        const qV=gunler.map(d=>d.soru),eV=gunler.map(d=>d.enerji),kV=gunler.map(d=>d.kaygi);
        const mxQ=Math.max(...qV,1),n=gunler.length;
        const pd=14,iW=gW-pd*2,iH=gH-12,bW=Math.min(iW/n*0.5,9),xS=n>1?iW/(n-1):iW;
        const tabY=Y+gH-5,tepY=Y+9;
        qV.forEach((v,i)=>{const bx=gX+pd+(n===1?iW/2:i*xS)-bW/2,bh=v>0?Math.max((v/mxQ)*iH,2):0;doc.setFillColor(120,90,210);doc.roundedRect(bx,tabY-bh,bW,bh,0.5,0.5,'F');if(v>0){doc.setFont(PF,'normal');doc.setFontSize(4);doc.setTextColor(80,60,180);doc.text(String(v),bx+bW/2,tabY-bh-1,{align:'center'});}});
        [[eV,[190,110,0]],[kV,[170,30,30]]].forEach(([vArr,c])=>{
          const pts=vArr.map((v,i)=>({x:gX+pd+(n===1?iW/2:i*xS),y:v>0?tepY+(1-v/10)*iH:null}));
          const vp=pts.filter(p=>p.y);
          if(vp.length>=2){doc.setDrawColor(c[0],c[1],c[2]);doc.setLineWidth(0.9);for(let i=1;i<pts.length;i++){if(pts[i-1].y&&pts[i].y)doc.line(pts[i-1].x,pts[i-1].y,pts[i].x,pts[i].y);}vp.forEach(p=>{doc.setFillColor(c[0],c[1],c[2]);doc.circle(p.x,p.y,0.9,'F');});}
        });
        doc.setFont(PF,'normal');doc.setFontSize(4);doc.setTextColor(110,105,135);
        gunler.forEach((d,i)=>{const lx=gX+pd+(n===1?iW/2:i*xS);doc.text(new Date(d.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'}),lx,tabY+3,{align:'center'});});
        Y+=gH+6;
      }


              // ── B. DUYGUSAL SAVUNMA MEKANİZMALARI VE BRANŞ KAÇIŞLARI ────
      bolumBaslik([150,30,30],'B.  Duygusal Savunma Mekanizmaları ve Branş Kaçışları',
        period==='weekly'
          ? 'Bu hafta kaygı/yorgunluk anında hangi branşa sığınıldı, hangisinden kaçıldı (kriz tepkisi)'
          : 'Ay boyunca savunma karakteristiği: duygusal tampon branş ve tehdit olarak kodlanan branş tespiti');

      {
        // ── Ortak veri hazırlığı ──
        // Her derse ait soru sayısını kaygı durumuna göre grupla
        const kaygiGunler   = gunler.filter(d=>d.kaygi>0&&d.kaygi>7&&d.soru>0);  // yüksek kaygı + çalışma var
        const normalGunler  = gunler.filter(d=>(d.kaygi===0||(d.kaygi>0&&d.kaygi<=5))&&d.soru>0);
        const yorgunGunler  = gunler.filter(d=>d.enerji>0&&d.enerji<5&&d.soru>0);

        // Her ders için kaygılı vs normal günlerdeki soru ortalaması
        const dersKaygiProfili = subjects.map(s=>{
          const kGun = kaygiGunler.filter(d=>d.dersHata[s.name]&&d.dersHata[s.name].q>0);
          const nGun = normalGunler.filter(d=>d.dersHata[s.name]&&d.dersHata[s.name].q>0);
          const kOrt = kGun.length>0 ? kGun.reduce((a,d)=>a+d.dersHata[s.name].q,0)/kGun.length : 0;
          const nOrt = nGun.length>0 ? nGun.reduce((a,d)=>a+d.dersHata[s.name].q,0)/nGun.length : 0;
          const kHata = kGun.length>0 ? kGun.reduce((a,d)=>a+(d.dersHata[s.name].y/d.dersHata[s.name].q*100),0)/kGun.length : null;
          return { d:s.name, kOrt, nOrt, kHata, kGunSayisi:kGun.length, nGunSayisi:nGun.length,
                   oran: (nOrt>0&&kOrt>0) ? kOrt/nOrt : null };  // >1: kaygıda artış, <1: kaçış
        });

        // Sığınak ders: kaygıda en çok artan soru (oran en yüksek)
        const siginakDers = dersKaygiProfili.filter(d=>d.oran!==null&&d.oran>1.2).sort((a,b)=>b.oran-a.oran)[0];
        // Kaçış dersi: kaygıda en çok düşen soru (oran en düşük)
        const kacisaDers  = dersKaygiProfili.filter(d=>d.oran!==null&&d.oran<0.7).sort((a,b)=>a.oran-b.oran)[0];
        // Zayıf branş: hata oranı en yüksek (min 20 soru)
        const zayifBrans  = dersHataArr[0] || null;
        // Güçlü branş: hata oranı en düşük (min 20 soru)
        const gucluBrans  = [...dersHataArr].sort((a,b)=>a.pct-b.pct)[0] || null;

        // Yorgunlukta ilk bırakılan ders
        const yorgunBirakilan = (() => {
          const yorgunDersSoru = subjects.map(s=>{
            const yg=yorgunGunler.filter(d=>d.dersHata[s.name]);
            const ng=normalGunler.filter(d=>d.dersHata[s.name]);
            const yOrt=yg.length>0?yg.reduce((a,d)=>a+d.dersHata[s.name].q,0)/yg.length:0;
            const nOrt2=ng.length>0?ng.reduce((a,d)=>a+d.dersHata[s.name].q,0)/ng.length:0;
            return {d:s.name, oran:(nOrt2>0&&yOrt>=0)?yOrt/Math.max(nOrt2,1):null};
          });
          return yorgunDersSoru.filter(d=>d.oran!==null).sort((a,b)=>a.oran-b.oran)[0];
        })();

        if (period === 'weekly') {
          // ════════════════════════════════════════════════════
          // HAFTALIK B SENARYOLARI
          // ════════════════════════════════════════════════════

          // Vaka 1: Akademik Anestezi (Güvenli Liman)
          if (kaygiGunler.length>=1 && siginakDers && !kullanılanOlaylar.has('B_anestezi')) {
            aktifNegatifler.push('Akademik Anestezi');
            kullanılanOlaylar.add('B_anestezi');
            kutu('[ID-085] Akademik Anestezi — Güvenli Liman Sığınması',
              'Kaygı yüksek günlerde ' + siginakDers.d + ' branşındaki soru sayısı normal günlerin ' + (siginakDers.oran*100).toFixed(0) + '\'ine çıkmış. ' +
              'Öğrenci stres anında başarısızlık riskini sıfırlamak için en güçlü olduğu ' + siginakDers.d + ' branşına sığınmıştır. ' +
              'Bu hacimli üretim öğrenme odaklı değil; "başarıyorum" illüzyonuyla kaygıyı uyuşturma (anestezi) amaçlıdır. ' +
              (kacisaDers ? '"Tehdit" olarak kodlanan ' + kacisaDers.d + ' ise bu günlerde arka plana itilmiştir.' : ''),
              [255,238,215],[160,75,0]);
            bakiyeRiskler.push(siginakDers.d + ' kaygı döneminde anestezi amaçlı kullanılıyor; gerçek öğrenme değeri sorgulanmalı');

          // Vaka 2: Bilişsel Yük Reddi
          } else if (yorgunGunler.length>=1 && yorgunBirakilan && yorgunBirakilan.oran<0.4 && !kullanılanOlaylar.has('B_yuk_reddi')) {
            kullanılanOlaylar.add('B_yuk_reddi');
            const isSayisal = sayisalDersler.includes(yorgunBirakilan.d);
            kutu('[ID-105] Bilişsel Yük Reddi — Verimsiz Çalışma',
              'Sistem koruma modu. Enerji düşük günlerde ' + yorgunBirakilan.d + ' branşındaki çalışma normale göre %' + Math.round((1-yorgunBirakilan.oran)*100) + ' azalmış. ' +
              'Beyin, yorgunluk anında en çok enerji tüketen ' + yorgunBirakilan.d + ' branşını ' + (isSayisal?'(sayısal muhakeme yükü yüksek) ':'') + 'geçici olarak devre dışı bırakmıştır. ' +
              'Bu bir disiplinsizlik değil, prefrontal korteksin "enerji ekonomisi" refleksidir.',
              [255,245,220],[150,85,0]);

          // Vaka 3: Klinik Kaçınma
          } else if (kacisaDers && zayifBrans && kacisaDers.d===zayifBrans.d && kaygiGunler.some(d=>!d.dersHata[kacisaDers.d]||d.dersHata[kacisaDers.d].q===0) && !kullanılanOlaylar.has('B_klinik_kacinma')) {
            aktifNegatifler.push('Klinik Kaçınma');
            kullanılanOlaylar.add('B_klinik_kacinma');
            kutu('[ID-095] Klinik Kaçınma (Avoidance) — ' + kacisaDers.d,
              'Hata oranı en yüksek (%' + zayifBrans.pct.toFixed(0) + ') olan ' + kacisaDers.d + ' branşı, kaygı yüksek günlerde tamamen bloke edilmiştir. ' +
              'Hata yapma korkusuyla yüzleşmemek için ' + kacisaDers.d + ' sistematik olarak atlanmaktadır. ' +
              'Öğrenci diğer derslerde çok soru çözerek "çalışıyor" maskesi taksa da, akademik gelişim patinaj yapmaktadır. ' +
              'Reçete: ' + kacisaDers.d + ' seanslarını 10 dk ile sınırla ve sadece en basit konulardan başlat.',
              [255,220,220],[175,20,20]);
            bakiyeRiskler.push(kacisaDers.d + ' kaçınma davranışı kaygı dönemlerinde pekişiyor; birikmekte olan akademik boşluk tespit edilmeli');

          // Vaka 4: Reaktif Telafi
          } else if (!kullanılanOlaylar.has('B_reaktif_telafi')) {
            const denemeSonrasi = (() => {
              const denemeTarihleri = denemEntries2.map(e=>e.dateKey);
              for (const dk of denemeTarihleri) {
                const ertesi = gunlerSorted.find(d=>d.dk>dk);
                if (!ertesi) continue;
                const denemeNets = denemEntries2.filter(e=>e.dateKey===dk).map(e=>e.net||0);
                const ortNet2 = denemeNets.length>0?denemeNets.reduce((a,b)=>a+b,0)/denemeNets.length:null;
                if (ortNet2!==null && ortNet2<ortNet*0.8 && ertesi.soru>ortSoru*1.5) {
                  return {dk, ertesi, ortNet2};
                }
              }
              return null;
            })();
            if (denemeSonrasi) {
              aktifNegatifler.push('Reaktif Telafi');
              kullanılanOlaylar.add('B_reaktif_telafi');
              kutu('[ID-175] Reaktif Telafi — Öz-Denetim Sinyali',
                'Düşük deneme performansının ertesinde soru sayısı ort. ' + Math.round(ortSoru) + '\'den ' + denemeSonrasi.ertesi.soru + '\'e çıkmış. ' +
                'Zedelenen öz-güveni rakamlarla tamir etme çabasıdır. ' +
                'Hızla çözülen bu soruların analiz kalitesi ve kalıcı hafızaya aktarımı düşüktür — sayı artışı gerçek öğrenmeyi yansıtmaz.',
                [255,240,215],[155,80,0]);

            // Vaka 5: Sözel Sığınma
            } else if (yorgunGunler.length>=1 || kaygiGunler.length>=1) {
              const sozelArtis = dersKaygiProfili.filter(d=>sozelDersler.includes(d.d)&&d.oran>1);
              const sayisalDus = dersKaygiProfili.filter(d=>sayisalDersler.includes(d.d)&&d.oran<0.8);
              if (sozelArtis.length>0 && sayisalDus.length>0 && !kullanılanOlaylar.has('B_sozel_sigmak')) {
                kullanılanOlaylar.add('B_sozel_sigmak');
                kutu('Sözel Sığınma — Bilişsel Konfor Refleksi',
                  'Kaygı/yorgunluk anında ' + sayisalDus.map(d=>d.d).join(', ') + ' branşları bırakılmış; ' + sozelArtis.map(d=>d.d).join(', ') + ' branşlarına yönelinmiştir. ' +
                  'Öğrenci bilişsel yükü düşük olan sözel alanlarda kalarak zihnini dinlendirmeye çalışıyor. ' +
                  'Bu durum asıl gelişim alanı olan sayısal branşlarda bu hafta zaman kaybına yol açmıştır.',
                  [255,245,220],[145,90,0]);
              } else {
                kullanılanOlaylar.add('B_haftalik_dengeli');
                kutu('Duygusal Savunma: Bu Hafta Belirgin Patern Yok',
                  'Kaygı ve yorgunluk anlarında branş dağılımında sistematik bir savunma refleksi tespit edilmemiştir. ' +
                  (kaygiGunler.length===0?'Bu hafta kaygı eşiği aşılmamıştır.':kaygiGunler.length+' yüksek kaygı günü gözlemlenmiş ancak branş tercihlerinde tutarlı kaçış/sığınma örüntüsü oluşmamıştır.'),
                  [240,248,255],[75,115,195]);
              }
            } else {
              kullanılanOlaylar.add('B_haftalik_veri_yok');
              kutu('Duygusal Savunma: Veri Yetersiz',
                'Bu hafta için yeterli kaygı/yorgunluk+branş kombinasyon verisi bulunmamaktadır.',
                [245,243,255],[130,120,200]);
            }
          }

        } else {
          // ════════════════════════════════════════════════════
          // AYLIK B SENARYOLARI
          // ════════════════════════════════════════════════════

          // Yardımcı: kriz kümeleri (3+ ardışık yüksek kaygı günü)
          const krizKumeleri = (() => {
            const kümeler = []; let mevcut = [];
            const sirali = [...gunler].sort((a,b)=>a.dk.localeCompare(b.dk));
            sirali.forEach(d=>{
              if(d.kaygi>0&&d.kaygi>7){mevcut.push(d);}
              else{if(mevcut.length>=3)kümeler.push([...mevcut]);mevcut=[];}
            });
            if(mevcut.length>=3) kümeler.push(mevcut);
            return kümeler;
          })();

          // Ay ortalamasına göre varyans hesabı (branş bazlı)
          const dersVaryans = subjects.map(s=>{
            const gunlukSoru = aktifGunler.map(d=>{
              const sg=soruEntries2.filter(e=>e.dateKey===d.dk&&e.subject===s.name);
              return sg.reduce((a,e)=>a+(e.questions||0),0);
            }).filter(v=>v>0);
            const ort2 = gunlukSoru.length>0?gunlukSoru.reduce((a,b)=>a+b,0)/gunlukSoru.length:0;
            const sapma = gunlukSoru.length>=3?Math.sqrt(gunlukSoru.reduce((a,b)=>a+(b-ort2)**2,0)/gunlukSoru.length):0;
            const cv = ort2>0?sapma/ort2:0; // Değişkenlik katsayısı
            return {d:s.name, ort:ort2, sapma, cv};
          });
          const enVaryansliDers = dersVaryans.filter(d=>d.cv>0.6&&d.ort>0).sort((a,b)=>b.cv-a.cv)[0];

          // Zayıf branş çalışma yüzdesi
          const toplamSoruAy = gunler.reduce((a,d)=>a+d.soru,0);
          const zayifBransCalismaPct = zayifBrans && toplamSoruAy>0
            ? (gunler.reduce((a,d)=>a+(d.dersHata[zayifBrans.d]?.q||0),0)/toplamSoruAy*100)
            : null;

          // Vaka 1: Kemikleşmiş Savunma Karakteristiği
          if (siginakDers && kacisaDers && kaygiGunler.length>=3 && !kullanılanOlaylar.has('B_kemiklesme')) {
            aktifNegatifler.push('Kemikleşmiş Savunma Karakteristiği');
            kullanılanOlaylar.add('B_kemiklesme');
            kutu('[ID-055] Kemikleşmiş Savunma — Maskeli Stabilite',
              'Ay boyunca ' + kaygiGunler.length + ' yüksek kaygı gününde tutarlı bir patern gözlemlendi: ' +
              siginakDers.d + ' branşı "duygusal tampon" (kaygıda ort. ' + (siginakDers.oran*100).toFixed(0) + '% soru artışı), ' +
              kacisaDers.d + ' branşı "tehdit" olarak kodlanmış (kaygıda ' + Math.round((1-kacisaDers.oran)*100) + '% azalış). ' +
              'Bu karakteristik bir reflekstir — sınav gününde bu örüntü aktive olacaktır.',
              [255,220,220],[170,25,25]);
            bakiyeRiskler.push('Sınav anı ' + kacisaDers.d + ' performansı kaygı düzeyine kritik bağımlı — özel müdahale gerekli');

          // Vaka 2: Sahte Gelişim İllüzyonu
          } else if (zayifBransCalismaPct!==null && zayifBransCalismaPct<15 && toplamSoruAy>100 && !kullanılanOlaylar.has('B_sahte_gelisim')) {
            kullanılanOlaylar.add('B_sahte_gelisim');
            kutu('[ID-085] Sahte Gelişim İllüzyonu — Konfor Alanı Tuzağı',
              'Aylık toplam ' + toplamSoruAy + ' soru çözülmüş; ancak en zayıf branş olan ' + zayifBrans.d + ' (%' + zayifBrans.pct.toFixed(0) + ' hata) toplam çalışmanın yalnızca %' + zayifBransCalismaPct.toFixed(0) + '\'ini oluşturuyor. ' +
              'Ay genelinde "patinaj" teşhisi: öğrenci bildiği konuları tekrar ederek "başarı hazzı" satın almakta, gerçek zayıflıklarıyla temas kurmaktan ay boyu kaçınmıştır. ' +
              'Gelecek ay ' + zayifBrans.d + ' çalışma oranının %30\'a çıkarılması hedeflenmeli.',
              [255,240,215],[155,80,0]);

          // Vaka 3: Kriz Kümelenmesi ve Branş Reddi
          } else if (krizKumeleri.length>0 && kacisaDers && !kullanılanOlaylar.has('B_kriz_kumesi')) {
            aktifNegatifler.push('Kriz Kümelenmesi');
            kullanılanOlaylar.add('B_kriz_kumesi');
            const kum = krizKumeleri[0];
            const kumBaslangic = new Date(kum[0].dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
            const kumBitis = new Date(kum[kum.length-1].dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
            kutu('Kriz Kümelenmesi — Branş Reddi',
              kum.length + ' günlük kriz evresinde (' + kumBaslangic + '–' + kumBitis + ' arası) ' + kacisaDers.d + ' branşında belirgin çalışma azalması tespit edilmiştir. ' +
              'Beyin kriz anında bu derse karşı "geçici körlük" geliştirmiştir; bu süreçte o dersten kopuş akademik boşluk yaratmıştır. ' +
              (krizKumeleri.length>1 ? 'Ay içinde ' + krizKumeleri.length + ' ayrı kriz kümesi gözlemlenmiştir.' : ''),
              [255,222,222],[170,25,25]);
            bakiyeRiskler.push('Kriz döneminde ' + kacisaDers.d + ' alanında oluşan boşluk tespit edilip kapatılmalı');

          // Vaka 4: Branş Bazlı Varyans (Duygu Bağımlı Performans)
          } else if (enVaryansliDers && !kullanılanOlaylar.has('B_varyans')) {
            kullanılanOlaylar.add('B_varyans');
            kutu('Duygusal Branş Dalgalanması — ' + enVaryansliDers.d,
              enVaryansliDers.d + ' branşındaki günlük soru sayısı ay içinde yüksek varyans gösterdi (değişkenlik katsayısı: ' + (enVaryansliDers.cv*100).toFixed(0) + '%). ' +
              'Bu branştaki performans bilgi değil "mod" odaklıdır: iyi hissedilen günlerde açılıyor, düşük enerji/kaygı günlerinde kapanıyor. ' +
              'Sınav anı performansı için öngörülemezlik riski taşır.',
              [255,242,215],[150,85,0]);

          // Vaka 5: Mekanikleşmiş Süreç Yönetimi
          } else if (aktifGunler.length>0 && ortHata!==null) {
            const kötüMoodAktifGunler = gunler.filter(d=>d.soru>0&&(d.mood==='anxious'||d.mood==='tired'||d.mood==='sad'));
            const iyiMoodAktifGunler = gunler.filter(d=>d.soru>0&&(d.mood==='good'||d.mood==='focused'||d.mood==='excited'));
            if (kötüMoodAktifGunler.length>=2 && iyiMoodAktifGunler.length>=2) {
              const kotSoru = kötüMoodAktifGunler.reduce((a,d)=>a+d.soru,0)/kötüMoodAktifGunler.length;
              const iyiSoru = iyiMoodAktifGunler.reduce((a,d)=>a+d.soru,0)/iyiMoodAktifGunler.length;
              const kotHata = kötüMoodAktifGunler.filter(d=>d.hataOrani!==null).reduce((a,d,_,arr)=>a+d.hataOrani/arr.length,0)||null;
              const iyiHata = iyiMoodAktifGunler.filter(d=>d.hataOrani!==null).reduce((a,d,_,arr)=>a+d.hataOrani/arr.length,0)||null;
              if (Math.abs(kotSoru-iyiSoru)<ortSoru*0.2 && kotHata!==null && iyiHata!==null && kotHata>iyiHata*1.3) {
                kullanılanOlaylar.add('B_mekaniklesme');
                kutu('Mekanikleşmiş Süreç Yönetimi',
                  'Kötü hissedilen günlerde soru sayısı iyi günlere yakın (' + Math.round(kotSoru) + ' vs ' + Math.round(iyiSoru) + ') ancak hata oranı belirgin yüksek (%' + (kotHata??0).toFixed(0) + ' vs %' + (iyiHata??0).toFixed(0) + '). ' +
                  'Öğrenci ayı "görev tamamlama" moduyla kapatmıştır: nitelik değil yalnızca nicelik korunmuştur. ' +
                  'Kötü hissedilen günlerde yarı hacimle ama tam konsantrasyonla çalışmak daha verimlidir.',
                  [248,242,255],[110,80,180]);
              } else {
                kullanılanOlaylar.add('B_aylik_dengeli');
                kutu('Duygusal Savunma: Bu Ay Dengeli',
                  'Ay boyunca kaygı/yorgunluk anlarında sistematik bir branş savunma refleksi tespit edilmemiştir. ' +
                  (kaygiGunler.length>0 ? kaygiGunler.length + ' yüksek kaygı günü gözlemlenmiş ancak branş tercihlerinde tutarlı bir kaçış örüntüsü oluşmamış.' : 'Kaygı eşiği bu ay aşılmamıştır.'),
                  [230,255,240],[20,140,70]);
              }
            } else {
              kullanılanOlaylar.add('B_aylik_veri_az');
              kutu('Duygusal Savunma: Analiz İçin Veri Yetersiz',
                'Branş savunma karakteristiği tespiti için duygu + branş kombinasyonu yeterli gün sayısına ulaşmamıştır (' + kaygiGunler.length + ' yüksek kaygı günü). En az 5 yüksek kaygı günü gereklidir.',
                [245,243,255],[130,120,200]);
            }
          } else {
            kullanılanOlaylar.add('B_aylik_veri_yok');
            kutu('Duygusal Savunma: Veri Yetersiz',
              'Aylık branş savunma analizi için yeterli wellness + akademik veri kombinasyonu bulunmamaktadır.',
              [245,243,255],[130,120,200]);
          }
        }
      }

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
              kutu('[ID-010] Mavi Işık ve Bilişsel Sis — Sirkadiyen Sabotaj',
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
              kutu('[ID-035] Reaktif Sosyal Medya Kaçışı — Akademik Anestezi',
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
              kutu('[ID-105] Pasif Öğrenme İllüzyonu',
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
              kutu('[ID-035] Kriz Sonrası Uyuşma Trendi — Kemikleşmiş Dijital Kaçış',
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
              kutu('[ID-001] Kronik Dijital Sızıntı — Bilişsel Yer Değiştirme',
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
            kutu('[ID-045] Başarı Kaygısı — Zirve Baskısı / İmposter',
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
            kutu('[ID-075] Yanılsamalı Yetersizlik — Gizli Duygu Çarpıtması',
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
              kutu('[ID-065] Deneme Sonrası Şok — Akademik Küsme',
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
            kutu('[ID-045] Kırılgan Öz-Güven — Zirve Felci Karakteristiği',
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
            kutu('[ID-125] Hatalı Kodlama Riski — ' + enKritik.konu,
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
            kutu('[ID-140] Bellek Sızıntısı — Konsolidasyon İflası',
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
            kutu('[ID-155] Dikkat Borcu ve Yüzeysel İşleme',
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
              kutu('[ID-125] Kriz Altında Çalışılan Konular — İzleme Altında',
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
            kutu('[ID-140] Aylık Bilişsel Borç Bakiyesi — Hasar Kaydı',
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
            kutu('[ID-155] Niteliksiz Nicelik Kemikleşmesi' + (hataSabit?' — Hata Farkındalığı Kaybı':''),
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
            // ID-190: Sınav Günü Riski — günlük vs deneme isabet farkı
            (() => {
              const _gunlukGirisler = studyEntries.filter(e =>
                (e.userId === sUid || e.studentName === sName) &&
                e.type === 'soru' && e.dateKey >= startKey && e.dateKey <= endKey
              );
              const _gQ = _gunlukGirisler.reduce((a,e)=>a+(e.questions||0),0);
              const _gD = _gunlukGirisler.reduce((a,e)=>a+(e.correct||0),0);
              const _gIsa = _gQ > 0 ? _gD/_gQ*100 : null;
              const _filtExams = studyEntries.filter(e =>
                (e.userId === sUid || e.studentName === sName) &&
                e.type === 'deneme' && e.dateKey >= startKey && e.dateKey <= endKey
              );
              const _dQ = _filtExams.reduce((a,e)=>a+(e.questions||0),0);
              const _dD = _filtExams.reduce((a,e)=>a+(e.correct||0),0);
              const _dIsa = _dQ > 0 ? _dD/_dQ*100 : null;
              if (_gIsa !== null && _dIsa !== null && Math.abs(_gIsa - _dIsa) > 20) {
                const yonMesaj = _dIsa < _gIsa
                  ? 'Öğrenci sınav ortamında günlük performansının altına düşüyor — sınav anı yönetimi zayıf, baskı altında performans kaybı var.'
                  : 'Denemede günlük ortalamayı aşıyor — sınav koşulları motivasyonu artırıyor, pozitif baskı çalışıyor.';
                Y = pdfCheck(doc, Y, 20);
                kutu('[ID-190] Sınav Günü Riski — Ortam Performans Farkı',
                  'Günlük isabet ort. %' + _gIsa.toFixed(0) + ' vs Deneme isabet ort. %' + _dIsa.toFixed(0) +
                  ' → ' + Math.abs(_gIsa-_dIsa).toFixed(0) + ' puan fark. ' + yonMesaj,
                  _dIsa < _gIsa ? [255,230,215] : [220,255,235],
                  _dIsa < _gIsa ? [168,50,10] : [14,128,62]);
              }
            })();

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
            kutu('[ID-040+ID-001+ID-010] BÜTÜNCÜL TANI: Akut Sistem Çöküşü',
              'Dört temel kriter eş zamanlı kritik: uyku ' + genelUyku.toFixed(1) + ' sa, kaygı ' + genelKaygi.toFixed(1) + '/10, sosyal medya ' + genelSosyal.toFixed(1) + ' sa/gün, isabet %' + genelIsabet.toFixed(0) + '. ' +
              'Fizyolojik tükenmişlik ve duygusal aşırı yüklenme, dijital kaçışla birleşerek akademik üretimi niteliksiz hale getirmiştir. ' +
              'Bu hafta bitirilen konular "öğrenilmiş" değil "savuşturulmuş" veri statüsündedir. ' +
              (kritikSayisi>0?'Tespit edilen ' + kritikSayisi + ' aktif risk faktörü birbirini besleyen bir sarmal oluşturuyor.':''),
              [255,210,210],[175,10,10]);

          // Vaka 2: Kırılgan Başarı
          } else if (genelIsabet!==null&&genelIsabet>80 && genelKaygi!==null&&genelKaygi>7 && genelUyku!==null&&genelUyku<6.5) {
            anaVaka = 'kirilgan_basari';
            kutu('[ID-045] BÜTÜNCÜL TANI: Kırılgan Başarı — Fizyolojik Bedelle Satın Alınan Başarı',
              'İsabet %' + genelIsabet.toFixed(0) + ' ile yüksek; ancak kaygı ' + genelKaygi.toFixed(1) + '/10 ve uyku ' + genelUyku.toFixed(1) + ' sa. ' +
              'Başarı ağır bir fizyolojik bedelle satın alınıyor. ' +
              'Bu tempo sürdürülemez; akademik çıktı görünürde iyi olsa da altta yatan fizyolojik erozyon devam ediyor. ' +
              (bakiyeSayisi>0?bakiyeSayisi+' bakiye risk birikmiş durumda.':''),
              [255,235,210],[155,75,0]);

          // Vaka 3: Reaktif Kaçınma ve Telafi Döngüsü
          } else if (aktifNegatifler.includes('Reaktif Telafi') || aktifNegatifler.includes('Akademik Anestezi')) {
            anaVaka = 'telafi_dongusu';
            kutu('[ID-065+ID-175] BÜTÜNCÜL TANI: Reaktif Kaçınma ve Telafi Döngüsü',
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
            kutu('[ID-105+ID-035] BÜTÜNCÜL TANI: Pasif Akademik Çürüme',
              'Öğrenci günü ekran başında (ders izleyerek veya eğlenerek) bitiriyor; kendi başına akademik üretim yapacak bilişsel enerji bulunamıyor. ' +
              (genelSosyal!==null?'Sosyal medya: '+genelSosyal.toFixed(1)+' sa/gün. ':'')+
              (ortSoru>0?'Soru ort.: '+Math.round(ortSoru)+'/gün (hedef: '+DAILY_GOAL+'). ':'') +
              'Dijital sarmal: pasif tüketim aktif üretimi eliyor.',
              [248,238,255],[105,55,175]);

          // Vaka 5: Dengeli Akış
          } else if (genelUyku!==null&&genelUyku>=7.5 && genelKaygi!==null&&genelKaygi>=4&&genelKaygi<=6 &&
                     (genelSosyal===null||genelSosyal<1.5) && genelIsabet!==null&&genelIsabet>=85) {
            anaVaka = 'optimal_flow';
            // ID-200 kontrolü — 14 gün stabil mi?
            const _stabil14 = sortedDays.length >= 14 && sortedDays.slice(0,14).every(dk => {
              const _d = days[dk] || {};
              return parseFloat(_d.uyku||0)>=7 && parseFloat(_d.enerji||0)>=6 && parseFloat(_d.odak||0)>=6;
            });

            kutu('[ID-200] BÜTÜNCÜL TANI: Dengeli Akış — İdeal LGS Formu',
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
            kutu('[ID-040] AYLIK FOTOĞRAF: Süreç Sonu Tükenmişliği — Burnout',
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
            kutu('[ID-040+ID-155] AYLIK FOTOĞRAF: Negatif Regresyon — Süreç Erozyonu',
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
            kutu('[ID-045] AYLIK FOTOĞRAF: İmposter Sarmalı — Zirve Felci Kemikleşmiş',
              'Dönem isabet oranı %'+genelIsabet.toFixed(0)+' ile nesnel olarak başarılı; ancak duygusal tablo bunu yansıtmıyor. ' +
              (basariSonrasiKaygi>0?'İyi geçen ' + basariSonrasiKaygi + ' deneme sonrasında ertesi gün kaygı yükseldi — başarı içselleştirilemiyor. ':'') +
              'Öğrenci başarısını şansa bağlıyor; "bu sefer denk geldi" savunma mekanizması devrede. ' +
              'Koç: somut başarı kanıtlarını öğrencinin kendi sesiyle tekrar ettir — "Sen yaptın, şans değil."',
              [255,235,210],[150,75,0]);

          // Vaka 5: Dijital Anestezi Karakteristiği
          } else if (dijitalAnes && kritikSayisi>=3) {
            ayAnaVaka = 'dijital_anes';
            kutu('[ID-035] AYLIK FOTOĞRAF: Dijital Anestezi Karakteristiği',
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
            kutu('[ID-055] AYLIK FOTOĞRAF: Gizli Kriz ve Sinyal Kaybı',
              'İsabet oranı %'+genelIsabet.toFixed(0)+' ile görünürde iyi; ancak ay sonunda veri girişleri seyrekleşti ve sosyal medya ort. '+(genelSosyal??0).toFixed(1)+' sa/gün. ' +
              'Öğrenci süreçten duygusal olarak kopuyor. Başarı gelmesine rağmen her an "vazgeçme" riski var. ' +
              'Bu sessiz kopuş en tehlikeli kriz türüdür — dışarıdan görünmez.',
              [255,232,210],[152,72,0]);

          // Vaka 7: Patinaj ve Bilişsel Durgunluk
          } else if (patinaj && genelKaygi!==null&&genelKaygi>6) {
            ayAnaVaka = 'patinaj';
            kutu('[ID-085+ID-095] AYLIK FOTOĞRAF: Patinaj ve Bilişsel Durgunluk',
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
