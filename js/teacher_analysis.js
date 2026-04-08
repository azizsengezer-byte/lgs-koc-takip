function exportStudentDetailPDF(sName) {
  showToast('⏳', 'PDF hazirlaniyor...');

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'p', unit:'mm', format:'a4' });

  // Türkçe font register et
  const PF = registerFontIfAvailable(doc);

  const now = new Date();
  const todayKey = getDateKey(now);

  // Dönem bilgisi
  const pLabels = { daily:'Günlük', weekly:'Haftalık', monthly:'Aylık' };
  const pLabel = pLabels[studentAnalysisPeriod] || 'Haftalık';

  // Hafta/ay başlığı oluştur
  function getPeriodTitle() {
    if (studentAnalysisPeriod === 'weekly') {
      const mon = new Date(now); mon.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
      const sun = new Date(mon); sun.setDate(mon.getDate()+6);
      return mon.toLocaleDateString('tr-TR',{day:'numeric',month:'long'}) + ' - ' + sun.toLocaleDateString('tr-TR',{day:'numeric',month:'long'}) + ' ' + now.getFullYear() + ' Haftalık Rapor';
    } else if (studentAnalysisPeriod === 'monthly') {
      return now.toLocaleDateString('tr-TR',{month:'long',year:'numeric'}) + ' Aylık Rapor';
    }
    return now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}) + ' Günlük Rapor';
  }

  // Tarih override varsa (geçmişe dönük rapor) onu kullan
  const _override = window._pdfDateOverride;
  const _overridePeriodTitle = _override ? _override.title : null;
  const periodTitle = _overridePeriodTitle || getPeriodTitle();
  const dateStr = now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});

  // Dönem filtresi
  const monday = new Date(now); monday.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
  const mondayKey = monday.toISOString().split('T')[0];
  const monthStart = todayKey.substring(0,7)+'-01';
  const sObj = students.find(s=>s.name===sName) || {};
  const sUid = sObj.uid || '';
  const matchE = e => e.studentName===sName || (sUid && e.userId===sUid);
  let filtered = [];
  if (_override) {
    // Geçmişe dönük: seçilen tarih aralığı
    filtered = studyEntries.filter(e=>matchE(e) && e.dateKey>=_override.startKey && e.dateKey<=_override.endKey);
  } else if (studentAnalysisPeriod==='daily') {
    filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey===todayKey);
  } else if (studentAnalysisPeriod==='weekly') {
    filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey>=mondayKey);
  } else {
    filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey>=monthStart);
  }
  const allEntries = studyEntries.filter(e=>matchE(e));

  // Veri hesapla
  const nonDeneme = filtered.filter(e=>e.type!=='deneme');
  const soruEntries = filtered.filter(e=>e.type==='soru');
  const konuEntries = filtered.filter(e=>e.type==='konu');
  const tekrarEntries = filtered.filter(e=>e.type==='tekrar');

  const totalDur = filtered.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = soruEntries.reduce((a,e)=>a+(e.questions||0),0);
  const totalD = soruEntries.reduce((a,e)=>a+(e.correct||0),0);
  const totalY = soruEntries.reduce((a,e)=>a+(e.wrong||0),0);
  const totalNet = soruEntries.reduce((a,e)=>a+(e.net||0),0);
  const activeDays = new Set(filtered.map(e=>e.dateKey)).size;
  const netRate = totalQ>0?Math.round(totalD/totalQ*100):0;

  // Ders bazlı istatistikler
  const subStats = subjects.map(s=>{
    const se = soruEntries.filter(e=>e.subject===s.name);
    const q=se.reduce((a,e)=>a+(e.questions||0),0);
    const d=se.reduce((a,e)=>a+(e.correct||0),0);
    const y=se.reduce((a,e)=>a+(e.wrong||0),0);
    const net=se.reduce((a,e)=>a+(e.net||0),0);
    const dur=se.reduce((a,e)=>a+(e.duration||0),0);
    const pct=q>0?Math.round(d/q*100):0;
    // Konu bazlı analiz
    const topicMap={};
    se.forEach(e=>{ const t=e.topic||'Genel'; if(!topicMap[t]) topicMap[t]={q:0,d:0,y:0,dur:0,count:0}; topicMap[t].q+=(e.questions||0); topicMap[t].d+=(e.correct||0); topicMap[t].y+=(e.wrong||0); topicMap[t].dur+=(e.duration||0); topicMap[t].count++; });
    const topics = Object.entries(topicMap).map(([name,v])=>({name,pct:v.q>0?Math.round(v.d/v.q*100):0,...v})).sort((a,b)=>b.q-a.q);
    return {...s,q,d,y,net,dur,pct,topics};
  });

  // Gün bazlı veriler
  function buildDayList(days) {
    const list=[];
    const ov = window._pdfDateOverride;
    if (ov) {
      // Geçmişe dönük: override tarih aralığındaki günleri listele
      const start = new Date(ov.startKey+'T12:00:00');
      const end = new Date(ov.endKey+'T12:00:00');
      for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
        const dk = d.toISOString().split('T')[0];
        const dayE = allEntries.filter(e=>e.dateKey===dk);
        const soruE = dayE.filter(e=>e.type==='soru');
        const konuE = dayE.filter(e=>e.type==='konu');
        const tekE = dayE.filter(e=>e.type==='tekrar');
        list.push({
          label: new Date(dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'}),
          dk, q: soruE.reduce((a,e)=>a+(e.questions||0),0),
          net: Math.round(soruE.reduce((a,e)=>a+(e.net||0),0)*10)/10,
          dur: dayE.reduce((a,e)=>a+(e.duration||0),0),
          konuDur: konuE.reduce((a,e)=>a+(e.duration||0),0),
          tekDur: tekE.reduce((a,e)=>a+(e.duration||0),0),
        });
      }
      return list;
    }
    if (studentAnalysisPeriod === 'monthly') {
      // Aylık: sadece o aya ait günler (1'inden bugüne)
      const year = now.getFullYear(), month = now.getMonth();
      const lastDay = now.getDate();
      for (let day = 1; day <= lastDay; day++) {
        const d = new Date(year, month, day);
        const dk = d.toISOString().split('T')[0];
        const dayE = allEntries.filter(e=>e.dateKey===dk);
        const soruE = dayE.filter(e=>e.type==='soru');
        const konuE = dayE.filter(e=>e.type==='konu');
        const tekE = dayE.filter(e=>e.type==='tekrar');
        list.push({
          label: d.toLocaleDateString('tr-TR',{day:'numeric',month:'short'}),
          dk, q: soruE.reduce((a,e)=>a+(e.questions||0),0),
          net: Math.round(soruE.reduce((a,e)=>a+(e.net||0),0)*10)/10,
          dur: dayE.reduce((a,e)=>a+(e.duration||0),0),
          konuDur: konuE.reduce((a,e)=>a+(e.duration||0),0),
          tekDur: tekE.reduce((a,e)=>a+(e.duration||0),0),
        });
      }
    } else {
      for(let i=days-1;i>=0;i--) {
        const d=new Date(now); d.setDate(now.getDate()-i);
        const dk=d.toISOString().split('T')[0];
        const dayE=allEntries.filter(e=>e.dateKey===dk);
        const soruE=dayE.filter(e=>e.type==='soru');
        const konuE=dayE.filter(e=>e.type==='konu');
        const tekE=dayE.filter(e=>e.type==='tekrar');
        list.push({
          label:d.toLocaleDateString('tr-TR',{weekday:'short',day:'numeric',month:'short'}),
          dk, q:soruE.reduce((a,e)=>a+(e.questions||0),0),
          net:Math.round(soruE.reduce((a,e)=>a+(e.net||0),0)*10)/10,
          dur:dayE.reduce((a,e)=>a+(e.duration||0),0),
          konuDur:konuE.reduce((a,e)=>a+(e.duration||0),0),
          tekDur:tekE.reduce((a,e)=>a+(e.duration||0),0),
        });
      }
    }
    return list;
  }
  const trendDays = studentAnalysisPeriod==='weekly'?7:1;
  const dayList = buildDayList(trendDays);

  // Deneme verileri
  // Denemeler — seçilen dönemin tarih aralığına göre filtrele
  const _ov = window._pdfDateOverride;
  const denStartKey = _ov ? _ov.startKey : (
    studentAnalysisPeriod==='weekly' ? mondayKey :
    studentAnalysisPeriod==='monthly' ? monthStart : todayKey
  );
  const denEndKey = _ov ? _ov.endKey : null;
  const allDenemeler = allEntries.filter(e =>
    e.type==='deneme' &&
    e.dateKey >= denStartKey &&
    (!denEndKey || e.dateKey <= denEndKey)
  );
  const denPdfMap={};
  allDenemeler.forEach(e=>{ const k=e.examId||(e.dateKey+'_lgc'); if(!denPdfMap[k]) denPdfMap[k]=[]; denPdfMap[k].push(e); });
  const denemeler = Object.entries(denPdfMap).sort((a,b)=>(a[1][0]?.dateKey||'').localeCompare(b[1][0]?.dateKey||'')).map(([k,dl],di)=>{
    const title=dl[0]?.examTitle||dl[0]?.topic||(dl[0]?.dateKey+' Denemesi');
    const dk=dl[0]?.dateKey||'';
    const subR=subjects.map(s=>{ const se=dl.find(e=>e.subject===s.name); if(!se) return {name:s.name,d:0,y:0,net:0,q:0}; const d=se.correct||0,y=se.wrong||0; return {name:s.name,d,y,net:Math.round((d-y/3)*100)/100,q:d+y}; });
    const lgsR=calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:s.q>0?1:0})));
    return {di:di+1,title,dk,subR,lgs:lgsR.puan,hamPuan:lgsR.hamPuan,detail:lgsR.detail};
  });

  // Konu bazlı zayıflık yorumu
  function topicInsight(subName, topics) {
    const weak = topics.filter(t=>t.q>=2&&t.pct<60).sort((a,b)=>a.pct-b.pct);
    if (weak.length===0) return null;
    const t = weak[0];
    const tName = tx(t.name);
    const insights = {
      'Türkçe': t.pct<40?`"${tName}" konusunda odaklanma sorunu — uzun sorularda hata artisi mevcut.`:`"${tName}" konusunda isabet orani dusuk (%${t.pct}) — tekrar onerilir.`,
      'Matematik': t.pct<40?`"${tName}" konusunda ciddi eksik — temel kavramlar gozden gecirilmeli.`:`"${tName}" konusunda hiz kaybi yasaniyor olabilir (%${t.pct} isabet).`,
      'Fen Bilimleri': t.pct<40?`"${tName}" konusunda kavramsal yanlisamlar var — deney temelli tekrar onerilir.`:`"${tName}" konusunda %${t.pct} isabet — benzer sorular cozulmeli.`,
      'İnkılap Tarihi': `"${tName}" konusunda %${t.pct} isabet — kronolojik harita calismasi yapilmali.`,
      'Din Kültürü': `"${tName}" konusunda %${t.pct} isabet — kavram tekrari gerekli.`,
      'İngilizce': t.pct<40?`"${tName}" konusunda ciddi eksik — kelime bilgisi ve yapilar gozden gecirilmeli.`:`"${tName}" konusunda %${t.pct} isabet — pratik arttirilmali.`,
    };
    return insights[subName] || `"${tName}" konusunda %${t.pct} isabet — tekrar gerekmektedir.`;
  }

  const COLORS6 = [[108,99,255],[66,165,245],[38,166,154],[255,167,38],[171,71,188],[102,187,106]];

  // ================================================================
  // SAYFA 1 — KAPAK + GENEL ÖZET
  // ================================================================
  let Y = pdfHeader(doc, tx(sName) + ' — ' + tx(periodTitle), tx(pLabel + ' Rapor'), tx(dateStr));

  // Özet istatistik kutuları (3+3)
  const boxes = [
    ['Toplam Süre',totalDur+'dk',[108,99,255]],
    ['Soru Çözümü',totalQ+' soru',[66,165,245]],
    ['Doğru/Yanlış',totalD+'/'+totalY,[38,166,154]],
    ['Toplam Net',totalNet.toFixed(1),[255,167,38]],
    ['İsabet %','%'+netRate,[171,71,188]],
    ['Aktif Gün',activeDays+' gün',[102,187,106]],
  ];
  const bw=27.5, bh=17, bgap=2.8;
  boxes.forEach((b,i)=>{
    const x=14+i*(bw+bgap);
    const [r,g,b2]=b[2];
    doc.setFillColor(Math.min(255,Math.round(r*0.08+255*0.92)),Math.min(255,Math.round(g*0.08+255*0.92)),Math.min(255,Math.round(b2*0.08+255*0.92))); doc.roundedRect(x,Y,bw,bh,2,2,'F');
    doc.setDrawColor(Math.min(255,Math.round(r*0.25+191)),Math.min(255,Math.round(g*0.25+191)),Math.min(255,Math.round(b2*0.25+191))); doc.setLineWidth(0.3); doc.roundedRect(x,Y,bw,bh,2,2,'S');
    doc.setFont(_PF,'bold'); doc.setFontSize(11); doc.setTextColor(r,g,b2);
    doc.text(tx(String(b[1])),x+bw/2,Y+9,{align:'center'});
    doc.setFont(_PF,'normal'); doc.setFontSize(5.5); doc.setTextColor(100,95,140);
    doc.text(tx(b[0]),x+bw/2,Y+15,{align:'center'});
  });
  Y+=22;

  // Genel isabet progress bar
  Y=pdfCheck(doc,Y,10);
  doc.setFontSize(7.5); doc.setFont(_PF,'bold'); doc.setTextColor(50,40,120);
  doc.text('Genel İsabet Oranı: %'+netRate, 14, Y+4);
  const pW=130;
  doc.setFillColor(220,215,250); doc.roundedRect(75,Y,pW,5,2.5,2.5,'F');
  const pFill=Math.round((netRate/100)*pW);
  const pC=netRate>=70?[38,166,154]:netRate>=50?[255,167,38]:[239,83,80];
  doc.setFillColor(...pC); doc.roundedRect(75,Y,pFill,5,2.5,2.5,'F');
  doc.setFont(_PF,'bold'); doc.setFontSize(7); doc.setTextColor(...pC);
  doc.text('%'+netRate, 75+pW+3, Y+4);
  Y+=12;

  // Dinamik bölüm numarası sayacı
  let secNum = 0;
  const nextSec = (title, r=90, g=72, b=200) => {
    secNum++;
    Y = pdfSecHeader(doc, secNum + '. ' + title, Y, r, g, b);
  };

  // ================================================================
  // BÖLÜM 1 — SORU ÇÖZÜMÜ ANALİZİ
  // ================================================================
  nextSec('SORU ÇÖZÜMÜ ANALİZİ');

  // Ders bazlı tablo
  const t1H=['Ders','Süre(dk)','Soru','D','Y','Net','%'];
  const t1W=[44,22,18,14,14,18,22];
  const t1R=subStats.map(s=>[s.name,s.dur,s.q,s.d,s.y,s.net.toFixed(1),'%'+s.pct]);
  Y=pdfTable(doc,t1H,t1W,t1R,Y);

  // Ders bazlı soru bar
  if(subStats.some(s=>s.q>0)) {
    Y=pdfBarChart(doc,subStats.map(s=>s.q),subStats.map(s=>tx(dersKisa(s.name))),Y,38,COLORS6,'Ders Bazlı Soru Sayısı');
  }

  // Konu bazlı detay — her ders için en fazla 5 konu
  const hasTopics=subStats.some(s=>s.topics&&s.topics.length>0);
  if(hasTopics) {
    Y=pdfCheck(doc,Y,14); Y=pdfSubHeader(doc,'Konu Bazlı Soru Detayı',Y);
    subStats.filter(s=>s.topics&&s.topics.length>0).forEach(s=>{
      Y=pdfCheck(doc,Y,22); // ders adı + tablo için yeterli alan
      // Ders adı — belirgin ayraç şeklinde
      doc.setFillColor(235,232,255); doc.roundedRect(14,Y,182,7,1.5,1.5,'F');
      doc.setFillColor(72,52,212); doc.roundedRect(14,Y,3,7,1,1,'F');
      doc.setFont(_PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(72,52,212);
      doc.text(tx(s.name), 20, Y+4.8);
      Y+=10; // ders adı sonrası boşluk
      const tH=['Konu','Soru','D','Y','Net','%İsabet','Süre(dk)'];
      const tW=[52,18,12,12,16,22,20];
      const tR=s.topics.slice(0,6).map(t=>[t.name.substring(0,22),t.q,t.d,t.y,(t.d-t.y/3).toFixed(1),'%'+t.pct,t.dur]);
      Y=pdfTable(doc,tH,tW,tR,Y,[100,85,220]);
      Y+=4; // tablolar arası boşluk
    });
    Y+=2;
  }

  // ================================================================
  // BÖLÜM 2 — KONU ÇALIŞMASI & TEKRAR
  // ================================================================
  if(konuEntries.length>0||tekrarEntries.length>0) {
    Y=pdfCheck(doc,Y,14); nextSec('KONU ÇALIŞMASI VE TEKRAR',38,150,100);
    const ktRows=[];
    const ktMap={};
    [...konuEntries,...tekrarEntries].forEach(e=>{
      const key=e.subject+'|'+(e.topic||'Genel')+'|'+e.type;
      if(!ktMap[key]) ktMap[key]={sub:e.subject,topic:e.topic||'Genel',type:e.type,dur:0,count:0};
      ktMap[key].dur+=(e.duration||0); ktMap[key].count++;
    });
    Object.values(ktMap).forEach(v=>ktRows.push([v.sub,v.topic,v.type==='konu'?'Konu':'Tekrar',v.count+' seans',v.dur+'dk']));
    Y=pdfTable(doc,['Ders','Konu','Tür','Seans','Süre(dk)'],[36,52,24,24,22],ktRows,Y,[38,150,100]);
    Y+=3;
  }

  // ================================================================
  // BÖLÜM 3 — GÜN GÜNLÜK AKTİVİTE
  // ================================================================
  if(dayList.length>1) {
    Y=pdfCheck(doc,Y,14); nextSec('GÜNLÜK AKTİVİTE TRENDİ',43,150,100);

    // Tablo
    const gH=['Tarih','Soru','Net','Süre(dk)','Konu(dk)','Tekrar(dk)'];
    const gW=[42,20,18,26,26,26];
    const gR=dayList.map(d=>[d.label,d.q,d.net.toFixed(1),d.dur,d.konuDur,d.tekDur]);
    Y=pdfTable(doc,gH,gW,gR,Y,[43,150,100]);

    // Grafikler
    if(dayList.some(d=>d.q>0)) {
      Y=pdfBarChart(doc,dayList.map(d=>d.q),dayList.map(d=>d.label.substring(0,6)),Y,40,dayList.map(d=>d.q>0?[108,99,255]:[200,195,240]),'Günlük Soru Sayısı (Artan/Azalan)');
    }
    if(dayList.some(d=>d.dur>0)) {
      Y=pdfLineChart(doc,dayList.map(d=>d.dur),dayList.map(d=>d.label.substring(0,6)),Y,36,[255,167,38],'Günlük Toplam Süre Trendi (dakika)');
    }
    if(dayList.some(d=>d.net!==0)) {
      Y=pdfLineChart(doc,dayList.map(d=>d.net),dayList.map(d=>d.label.substring(0,6)),Y,36,[38,166,154],'Günlük Net Trendi');
    }
    Y+=3;
  }

  // ================================================================
  // BÖLÜM 4 — DENEME SINAVLARI
  // ================================================================
  if(denemeler.length>0) {
    Y=pdfCheck(doc,Y,14); nextSec('DENEME SINAVI SONUÇLARI',80,60,200);

    // Özet tablo
    const denH=['#','Deneme Adı','Tarih','LGS Puanı','Ham Puan'];
    const denW=[10,68,36,36,32];
    const denR=denemeler.map(d=>[d.di,d.title.substring(0,30),d.dk?new Date(d.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}):'—',d.lgs+'/500',d.hamPuan]);
    Y=pdfTable(doc,denH,denW,denR,Y,[80,60,200]);

    // LGS puan trend bar
    if(denemeler.length>0) {
      Y=pdfBarChart(doc,denemeler.map(d=>d.lgs),denemeler.map(d=>'D'+d.di),Y,44,
        denemeler.map(d=>d.lgs>=400?[38,166,154]:d.lgs>=300?[255,167,38]:[239,83,80]),
        'LGS Puan Trendi (Deneme Deneme)');
    }

    // Her deneme detay
    denemeler.forEach(den=>{
      const dateL=den.dk?new Date(den.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}):'';
      Y=pdfCheck(doc,Y,14);
      doc.setFillColor(100,85,220); doc.roundedRect(14,Y,182,7,1,1,'F');
      doc.setFont(_PF,'bold'); doc.setFontSize(8); doc.setTextColor(255,255,255);
      doc.text(tx(den.title)+' — '+tx(dateL), 18, Y+4.8);
      doc.text('LGS: '+den.lgs+' / 500', 194, Y+4.8, {align:'right'});
      Y+=9;
      const dHdr=['Ders','Doğru','Yanlış','Net (D-Y/3)','Katsayı','Ağ.Net'];
      const dW=[48,18,18,36,24,38];
      const dRows=den.subR.map(s=>{ const det=den.detail?den.detail.find(x=>x.name===s.name):null; return [s.name,s.d,s.y,s.net.toFixed(2),det?det.kat:'—',det?det.agNet:'—']; });
      Y=pdfTable(doc,dHdr,dW,dRows,Y,[100,85,220]);
      // Ham + LGS satırı
      Y=pdfCheck(doc,Y,8);
      doc.setFillColor(235,230,255); doc.roundedRect(14,Y,182,7,1,1,'F');
      doc.setFont(_PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(80,60,200);
      doc.text('Ham Puan: '+den.hamPuan, 18, Y+4.5);
      doc.text('Tahmini LGS: '+den.lgs+' / 500', 194, Y+4.5, {align:'right'});
      Y+=10;
    });

    // Ders bazlı deneme net karşılaştırma (tüm denemeler)
    if(denemeler.length>1) {
      Y=pdfCheck(doc,Y,14); Y=pdfSubHeader(doc,'Ders Bazlı Deneme Net Gelişimi',Y);
      subjects.forEach((subj,si)=>{
        const nets=denemeler.map(d=>{ const sr=d.subR.find(r=>r.name===subj.name); return sr?parseFloat(sr.net.toFixed(1)):0; });
        if(nets.some(v=>v!==0)) {
          Y=pdfLineChart(doc,nets,denemeler.map(d=>'D'+d.di),Y,36,COLORS6[si%6],tx(subj.name)+' — Net Gelişimi');
        }
      });
    }
  }

  // ================================================================
  // ================================================================
  Y = pdfNewPage(doc);
  nextSec('KOÇ DEĞERLENDİRMESİ',43,180,123);

  // Tespit & Yorum
  const insights=[];
  subStats.filter(s=>s.q>0).forEach(s=>{
    const tip=topicInsight(s.name,s.topics);
    if(tip) insights.push(tx(s.name+': '+tip));
  });
  if(insights.length>0) {
    Y=pdfCheck(doc,Y,10); Y=pdfSubHeader(doc,'Konu Bazlı Tespitler',Y);
    insights.forEach(ins=>{
      Y=pdfCheck(doc,Y,8);
      doc.setFillColor(255,253,235); doc.roundedRect(14,Y,182,7,1.5,1.5,'F');
      doc.setDrawColor(200,160,0); doc.setLineWidth(0.3); doc.roundedRect(14,Y,182,7,1.5,1.5,'S');
      doc.setFillColor(220,120,0); doc.roundedRect(14,Y,2,7,1,1,'F');
      doc.setFont(_PF,'normal'); doc.setFontSize(7); doc.setTextColor(80,60,20);
      // Uzun tespitleri iki satıra böl
      const insLines = doc.splitTextToSize(tx(ins), 174);
      const insH = insLines.length * 4.5 + 3;
      Y=pdfCheck(doc,Y,insH);
      doc.setFillColor(255,253,235); doc.roundedRect(14,Y,182,insH,1.5,1.5,'F');
      doc.setDrawColor(200,160,0); doc.roundedRect(14,Y,182,insH,1.5,1.5,'S');
      doc.setFillColor(220,120,0); doc.roundedRect(14,Y,2,insH,1,1,'F');
      insLines.forEach((l,li)=>{ doc.text(tx(l), 18, Y+4+li*4.5); });
      Y+=insH+2;
    });
    Y+=2;
  }

  // Güçlü / Zayıf dersler
  const sortedSubs=subStats.filter(s=>s.q>0).sort((a,b)=>b.pct-a.pct);
  const strong=sortedSubs.slice(0,2);
  // Zayıf: güçlülerle çakışmayan, en düşük isabet oranlı dersler
  const weakCandidates=[...subStats].filter(s=>s.q>0&&!strong.find(st=>st.name===s.name)).sort((a,b)=>a.pct-b.pct);
  const weak=weakCandidates.slice(0,2);
  if(strong.length>0||weak.length>0) {
    Y=pdfCheck(doc,Y,10);
    const colW=87;
    if(strong.length>0) {
      doc.setFillColor(240,255,245); doc.roundedRect(14,Y,colW,6,1.5,1.5,'F');
      doc.setFont(_PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(38,140,80);
      doc.text('Güçlü: '+strong.map(s=>tx(s.name)+' %'+s.pct).join(', '), 17, Y+4.2);
    }
    if(weak.length>0) {
      doc.setFillColor(255,240,240); doc.roundedRect(14+colW+8,Y,colW,6,1.5,1.5,'F');
      doc.setFont(_PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(180,40,40);
      doc.text('Geliştirilmeli: '+weak.map(s=>tx(s.name)+' %'+s.pct).join(', '), 17+colW+8, Y+4.2);
    }
    Y+=10;
  }

  // Genel yorum — yeni sayfaya geç ve başlıkla birlikte tut
  const _effectivePeriod = _override?.mode || studentAnalysisPeriod;
  const rawComment = generateStudentComment(sName,filtered,subStats,totalDur,totalQ,totalNet,activeDays,_effectivePeriod,true);
  const commentLines = doc.splitTextToSize(tx(rawComment), 174);
  const commentH = commentLines.length * 5 + 20; // başlık + içerik tahmini yükseklik
  if (Y + commentH > 278) { Y = pdfNewPage(doc); }
  doc.setFillColor(240,248,255); doc.roundedRect(14,Y,182,6,2,2,'F');
  doc.setFont(_PF,'bold'); doc.setFontSize(8); doc.setTextColor(30,80,160);
  doc.text('Genel Değerlendirme', 105, Y+4.2, {align:'center'});
  Y+=9;
  doc.setFont(_PF,'normal'); doc.setFontSize(8); doc.setTextColor(30,40,80);
  commentLines.forEach(l=>{ Y=pdfCheck(doc,Y,5); doc.text(tx(l),15,Y); Y+=5; });
  Y+=3;

  // İmza alanı — her zaman içerikle aynı sayfada
  Y=pdfCheck(doc,Y,26);
  doc.setFillColor(245,243,255); doc.roundedRect(14,Y,182,22,2,2,'F');
  doc.setDrawColor(210,204,242); doc.setLineWidth(0.3); doc.roundedRect(14,Y,182,22,2,2,'S');
  doc.setFont(_PF,'bold'); doc.setFontSize(8); doc.setTextColor(72,52,212);
  doc.text('Eğitim Koç:', 18, Y+6);
  doc.setFont(_PF,'normal'); doc.setFontSize(8); doc.setTextColor(50,40,100);
  const teacherName=tx((window.currentUserData||{}).name||'');
  doc.text(teacherName, 18, Y+12);
  doc.text('Tarih: '+tx(dateStr), 18, Y+18);
  doc.setFont(_PF,'bold'); doc.setFontSize(8); doc.setTextColor(72,52,212);
  doc.text('Öğrenci:', 120, Y+6);
  doc.setFont(_PF,'normal'); doc.setTextColor(50,40,100);
  doc.text(tx(sName), 120, Y+12);
  doc.text('LGSKoç Performans Raporu', 120, Y+18);
  Y+=25;

  // Footer
  pdfFooter(doc, doc.internal.getNumberOfPages(), tx(sName)+' | '+tx(periodTitle));

  // preparePdfLink tarafından çağrılıyorsa doc döndür
  return doc;
}

function teacherAnalysis() {
  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Analizler</div>
    <div class="page-sub">Öğrenci çalışma raporları</div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> PDF Rapor İndir</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">
          <select class="pdf-period-select" id="pdfPeriodType" style="flex:1;min-width:120px" onchange="updateTeacherDatePicker()">
            <option value="weekly">Haftalık</option>
            <option value="monthly" selected>Aylık</option>
            <option value="all">Tüm Dönem</option>
          </select>
          <select class="pdf-period-select" id="pdfDateRange" style="flex:1;min-width:160px">
            ${generateMonthOptions()}
          </select>
          <select class="pdf-period-select" id="pdfStudent" style="flex:1;min-width:120px">
            <option value="all">Tüm Öğrenciler</option>
            ${students.map(s=>`<option value="${s.name}">${s.name}</option>`).join('')}
          </select>
          <button class="pdf-btn" onclick="exportPDF('teacher')" style="flex:1;min-width:140px">📄 PDF İndir</button>
        </div>
      </div>

    ${students.length === 0 ? `
      <div class="card" style="text-align:center;padding:40px;color:var(--text2)">
        <div style="font-size:3rem;margin-bottom:12px">📊</div>
        <div style="font-weight:700">Henüz öğrenci eklenmedi</div>
        <div style="font-size:0.85rem;margin-top:8px">Öğrenciler çalışma girişi yaptıkça veriler burada görünecek</div>
      </div>
    ` : `
      <div class="card" style="margin-bottom:16px">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg> Haftalık Özet</div>
        <canvas id="trendChart" height="180"></canvas>
      </div>
      <div class="card">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Öğrenci Bazlı Çalışma Tablosu</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.82rem">
            <thead>
              <tr style="border-bottom:2px solid var(--border)">
                <th style="text-align:left;padding:8px 4px;color:var(--text2)">Öğrenci</th>
                <th style="text-align:center;padding:8px 4px;color:var(--text2)">Toplam Süre</th>
                <th style="text-align:center;padding:8px 4px;color:var(--text2)">Toplam Soru</th>
                <th style="text-align:center;padding:8px 4px;color:var(--text2)">Ort. Net</th>
                <th style="text-align:center;padding:8px 4px;color:var(--text2)">Giriş</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s=>`
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:10px 4px;font-weight:700">
                    <div style="display:flex;align-items:center;gap:8px">
                      <div style="width:28px;height:28px;border-radius:50%;background:${s.color}22;color:${s.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem">${s.name[0]}</div>
                      ${s.name}
                    </div>
                  </td>
                  <td style="text-align:center;padding:10px 4px;color:var(--accent)">— dk</td>
                  <td style="text-align:center;padding:10px 4px;color:var(--accent4)">—</td>
                  <td style="text-align:center;padding:10px 4px;color:var(--accent3)">—</td>
                  <td style="text-align:center;padding:10px 4px;color:var(--text2)">0</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:12px">* Öğrenciler çalışma girişi yaptıkça veriler güncellenir</div>
      </div>

      <div class="card" style="margin-top:16px">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Bu Hafta Ders Bazlı Soru Dağılımı</div>
        <div id="subjectDistBars" style="padding:4px 0"></div>
      </div>
    `}
  `;
}

function teacherTasks() {
  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Görevler</div>
    <div class="page-sub">Ödevler ve çalışma programları</div>
    <button class="btn btn-primary" style="margin-bottom:20px" onclick="openTaskModal()">+ Yeni Görev Ata</button>
    ${tasks.length === 0 ? `<div style="text-align:center;padding:30px;color:var(--text2)">Henüz görev atanmadı</div>` :
    tasks.map((t,i)=>`
      <div class="assignment-card" style="position:relative">
        <div class="assignment-icon" style="background:rgba(108,99,255,.15)">${t.typeLabel?t.typeLabel.split(' ')[0]:'📝'}</div>
        <div style="flex:1;min-width:0">
          <div class="assignment-title">${t.title || t.baslik || 'Görev'}</div>
          <div style="font-size:0.78rem;color:var(--accent);font-weight:600;margin-bottom:2px">${t.subject||''}${(t.studentName||t.student)?(' → '+(t.studentName||t.student)):''}</div>
          <div class="assignment-desc">${t.desc||''}</div>
          <div class="assignment-footer">
            <span class="badge ${t.done?'badge-green':'badge-yellow'}">${t.done?'✅ Tamamlandı':'⏳ Bekliyor'}</span>
            <span style="font-size:0.75rem;color:var(--text2)">Son: ${t.due||'-'}</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
          <button onclick="editTaskModal(${i})" style="background:var(--accent)15;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:0.8rem;color:var(--accent)">✏️</button>
          <button onclick="deleteTask('${t.id||''}',${i})" style="background:#ff658415;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:0.8rem;color:#ff6584">🗑️</button>
        </div>
      </div>
    `).join('')}
  `;
}

/* =================== STUDENT PAGES =================== */
