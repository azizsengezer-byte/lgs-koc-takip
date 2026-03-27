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
      // bolumBaslik yeni sayfaya geçtiyse kutu o sayfada kalır, geçmediyse normal check
      if (!_bolumYeniSayfa) Y = pdfCheck(doc, Y, bH+6);
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
      // Başlık + altMetin + ilk kutu için TEK seferlik sayfa kontrolü (80mm güvenli alan)
      const needed = altSat.length*5 + 14 + 80;
      const yBefore = Y;
      Y = pdfCheck(doc, Y, needed);
      // Eğer Y değişmedi VE sayfa sonuna yakınsa (250mm+) yeni sayfaya zorla
      if (Y === yBefore && Y > 210) { Y = pdfNewPage(doc); }
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
          kutu('Amigdala Blokajı (Modül A-Vaka 6 + Modül 2.5-Vaka 2)',
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
          kutu('Akut Fizyolojik Çöküş — Çift Tehdit',
            'Uyku '+bugunUyku.toFixed(1)+' sa + enerji '+bugunEnerji.toFixed(1)+'/10: ikisi birlikte kritik bölgede. ' +
            'Glimfatik sistem dün gece çalışmadı; bugün öğrenilen bilgiler kalıcı belleğe geçemez. ' +
            (akademikVar?'Çözülen '+bugunSoru+' soru "bilişsel borç" statüsünde — temiz zihinle tekrar edilmeli. ':'Akademik üretim beklenmemeli. ') +
            (s7OrtUyku!==null?'7 günlük uyku ort. '+s7OrtUyku.toFixed(1)+' sa — kümülatif borç birikmiş.':''),
            [255,215,215],[172,12,12]);
          gunlukBakiye.push('Bugün çalışılan konular hatalı kodlanma riski taşıyor — düşük enerji testi önerilir');
        } else if (bugunUyku>0&&bugunUyku<6.5) {
          gunlukAktifler.push('Uyku Borcu');
          kutu('Uyku Borcu — Bellek Konsolidasyonu Riskli',
            'Bugün '+bugunUyku.toFixed(1)+' sa uyku (ideal 7.5+). ' +
            (bugunEnerji>0?'Enerji '+bugunEnerji.toFixed(1)+'/10. ':'') +
            'REM evresi kısalmış olabilir; dün öğrenilen bilgiler tam konsolide olmamıştır. ' +
            (akademikVar?bugunSoru+' soruluk çalışmanın özellikle sözel/mantık gerektiren kısmı risk altında.':'') +
            (s7OrtUyku!==null&&s7OrtUyku<6.5?' Son 7 gün uyku ort. '+s7OrtUyku.toFixed(1)+' sa — kronik borç.':''),
            [255,232,215],[160,55,0]);
          gunlukBakiye.push('Uyku borcu devam ederse hafta sonu performans düşüşü kaçınılmaz');
        } else if (bugunUyku>0&&bugunUyku<6.5&&bugunOdak>8) {
          gunlukAktifler.push('Yanılsamalı Hiper-Odak');
          kutu('Yanılsamalı Hiper-Odak — Adrenalin Maskesi',
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
            kutu('Akademik Anestezi — Güvenli Liman (Modül B-Vaka 1)',
              'Kaygı '+bugunKaygi.toFixed(1)+'/10 iken '+enCokBrans.d+' branşında '+enCokBrans.q+' soru çözüldü. ' +
              (sayisalYok&&sozelVar?'Sayısal branşlar hiç çalışılmadı -> Sözel Sığınma refleksi aktif. ':'') +
              'Bu üretim öğrenme odaklı değil; "başarıyorum" illüzyonuyla kaygı anestezisi yapılıyor. ' +
              (enCokBrans.hataPct!==null?'İsabet %'+(100-enCokBrans.hataPct).toFixed(0)+' — anestezi kalitesi de düşük.':''),
              [255,228,215],[158,70,0]);
            if (sayisalYok) gunlukBakiye.push('Bugün kaçınılan sayısal branşlar: yarın 10 dk "kapı aralama" seansı');
          } else if (bugunKaygi>=8&&!akademikVar&&bugunSosyal>0) {
            // Amigdala blokajı zaten yukarıda işlendi, burada sosyal medya detayı
            kutu('Dijital Anestezi — Kaçış Kapısı Kullanıldı (Modül 2.5-Vaka 2)',
              'Akademik giriş yok + sosyal medya '+bugunSosyal.toFixed(1)+' sa. ' +
              'Öğrenci başarısızlık korkusuyla yüzleşmek yerine dijital uyuşturmayı tercih etti. ' +
              'Bu bir dinlenme değil "bilişsel erteleme" — akademik sorun çözülmeden büyüyor.',
              [255,215,215],[170,15,15]);
          } else if (negatifMood&&akademikVar&&sayisalYok&&sozelVar) {
            kutu('Sözel Sığınma — Bilişsel Konfor Refleksi (Modül B-Vaka 5)',
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
            kutu('Çalışma Görüntüsüyle Kaçınma — Sahte Verimlilik',
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
            kutu('Kriz Altında Çalışma — Hatalı Kodlanma Riski (Modül D-Vaka 1)',
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
            kutu('Reaktif Dijital Kaçış (Modül 2.5-Vaka 2)',
              'Sosyal medya '+bugunSosyal.toFixed(1)+' sa + olumsuz durum. ' +
              'Olumsuz hislerle baş edememe -> dijital uyuşturma döngüsü. ' +
              (bugunSosyal>bugunOnline?'Eğlence ekranı akademik ekranı geçti ('+bugunSosyal.toFixed(1)+' sa vs '+bugunOnline.toFixed(1)+' sa).':''),
              [255,218,218],[172,15,15]);
          } else if (bugunOnline>3&&!akademikVar) {
            kutu('Pasif Öğrenme İllüzyonu (Modül 2.5-Vaka 1)',
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
                kutu('Karar Verme Yorgunluğu (Decision Fatigue)',
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
            kutu('Kronik Bilişsel Erozyon — Hafıza Konsolidasyonu Arızası',
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
              kutu('Robotikleşme — Tükenmişlik Öncesi Evre',
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
            kutu('Adaptasyon Direnci — Fizyolojik Sürdürülemezlik',
              'Ay boyunca yüksek kaygı (' + ortKaygi.toFixed(1) + '/10) + yetersiz uyku (' + ortUykuA.toFixed(1) + ' sa) + düşük enerji (' + ortEnerjiA.toFixed(1) + '/10) birlikte seyretti. ' +
              'Öğrenci mevcut seviyesini korumak için çok ağır bir "duygusal maliyet" ödüyor. ' +
              'Bu tempo fizyolojik olarak sürdürülebilir değildir; bir sonraki kriz evresi daha derin bir çöküşle gelebilir.',
              [255,220,220],[175,20,20]);

          // Vaka 5: Bellek Sızıntısı
          } else if (aktifGunler.length < veriGunler.length * 0.5 && ortHata!==null && ortHata<20) {
            kullanılanOlaylar.add('A_bellek_sizintisi');
            kutu('Bellek Sızıntısı — Kopuk Çalışma Ritmi',
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
              kutu('Maskelenmiş Kriz — Ortalama Aldatıcı',
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
            kutu('Akademik Anestezi — Güvenli Liman Sığınması',
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
            kutu('Bilişsel Yük Reddi — Enerji Tasarrufu Refleksi',
              'Sistem koruma modu. Enerji düşük günlerde ' + yorgunBirakilan.d + ' branşındaki çalışma normale göre %' + Math.round((1-yorgunBirakilan.oran)*100) + ' azalmış. ' +
              'Beyin, yorgunluk anında en çok enerji tüketen ' + yorgunBirakilan.d + ' branşını ' + (isSayisal?'(sayısal muhakeme yükü yüksek) ':'') + 'geçici olarak devre dışı bırakmıştır. ' +
              'Bu bir disiplinsizlik değil, prefrontal korteksin "enerji ekonomisi" refleksidir.',
              [255,245,220],[150,85,0]);

          // Vaka 3: Klinik Kaçınma
          } else if (kacisaDers && zayifBrans && kacisaDers.d===zayifBrans.d && kaygiGunler.some(d=>!d.dersHata[kacisaDers.d]||d.dersHata[kacisaDers.d].q===0) && !kullanılanOlaylar.has('B_klinik_kacinma')) {
            aktifNegatifler.push('Klinik Kaçınma');
            kullanılanOlaylar.add('B_klinik_kacinma');
            kutu('Klinik Kaçınma (Avoidance) — ' + kacisaDers.d,
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
              kutu('Reaktif Telafi — Yanılsamalı Tamir',
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
            kutu('Kemikleşmiş Savunma Karakteristiği',
              'Ay boyunca ' + kaygiGunler.length + ' yüksek kaygı gününde tutarlı bir patern gözlemlendi: ' +
              siginakDers.d + ' branşı "duygusal tampon" (kaygıda ort. ' + (siginakDers.oran*100).toFixed(0) + '% soru artışı), ' +
              kacisaDers.d + ' branşı "tehdit" olarak kodlanmış (kaygıda ' + Math.round((1-kacisaDers.oran)*100) + '% azalış). ' +
              'Bu karakteristik bir reflekstir — sınav gününde bu örüntü aktive olacaktır.',
              [255,220,220],[170,25,25]);
            bakiyeRiskler.push('Sınav anı ' + kacisaDers.d + ' performansı kaygı düzeyine kritik bağımlı — özel müdahale gerekli');

          // Vaka 2: Sahte Gelişim İllüzyonu
          } else if (zayifBransCalismaPct!==null && zayifBransCalismaPct<15 && toplamSoruAy>100 && !kullanılanOlaylar.has('B_sahte_gelisim')) {
            kullanılanOlaylar.add('B_sahte_gelisim');
            kutu('Sahte Gelişim İllüzyonu — Konfor Alanı Tuzağı',
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

