function studentAnalysis() {
  const now = new Date();
  const todayKey = getDateKey(now);

  // Period filtre
  let filtered = [];
  let periodLabel = '';
  if (analysisPeriod === 'daily') {
    filtered = studyEntries.filter(e => e.dateKey === todayKey);
    periodLabel = 'Bugün';
  } else if (analysisPeriod === 'weekly') {
    const monday = new Date(now);
    monday.setDate(now.getDate() - (now.getDay()===0?6:now.getDay()-1));
    const mondayKey = monday.toISOString().split('T')[0];
    filtered = studyEntries.filter(e => e.dateKey >= mondayKey);
    periodLabel = 'Bu Hafta';
  } else {
    const monthStart = todayKey.substring(0,7) + '-01';
    filtered = studyEntries.filter(e => e.dateKey >= monthStart);
    periodLabel = 'Bu Ay';
  }

  // İstatistikler
  const totalDur = filtered.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = filtered.reduce((a,e)=>a+(e.questions||0),0);
  const totalCorrect = filtered.reduce((a,e)=>a+(e.correct||0),0);
  const totalWrong = filtered.reduce((a,e)=>a+(e.wrong||0),0);
  const totalNet = filtered.reduce((a,e)=>a+(e.net||0),0);
  const dayCount = new Set(filtered.map(e=>e.dateKey)).size;

  // Ders bazlı analiz
  const subjectStats = subjects.map(s => {
    const se = filtered.filter(e=>e.subject===s.name);
    const q = se.reduce((a,e)=>a+(e.questions||0),0);
    const d = se.reduce((a,e)=>a+(e.correct||0),0);
    const y = se.reduce((a,e)=>a+(e.wrong||0),0);
    const net = se.reduce((a,e)=>a+(e.net||0),0);
    const dur = se.reduce((a,e)=>a+(e.duration||0),0);
    const netPct = q > 0 ? Math.round((d/q)*100) : 0;
    return { ...s, q, d, y, net, dur, netPct, count: se.length };
  });

  const maxQ = Math.max(...subjectStats.map(s=>s.q), 1);

  // Güçlü/zayıf konular
  const subWithQ = subjectStats.filter(s=>s.q>0).sort((a,b)=>b.netPct-a.netPct);
  const strong = subWithQ.slice(0,2);
  const weak = [...subjectStats].filter(s=>s.q>0).sort((a,b)=>a.netPct-b.netPct).slice(0,2);

  // Yorum üret
  const comment = generateAnalysisComment(filtered, subjectStats, totalDur, totalQ, totalNet, dayCount, analysisPeriod);

  // Haftalık trend tablosu (son 7 gün)
  const trendData = [];
  for (let i=6;i>=0;i--) {
    const d = new Date(now); d.setDate(now.getDate()-i);
    const dk = d.toISOString().split('T')[0];
    const dayQ = studyEntries.filter(e=>e.dateKey===dk).reduce((a,e)=>a+(e.questions||0),0);
    const dayDur = studyEntries.filter(e=>e.dateKey===dk).reduce((a,e)=>a+(e.duration||0),0);
    trendData.push({ label: d.toLocaleDateString('tr-TR',{weekday:'short'}), q: dayQ, dur: dayDur, dk });
  }
  const maxTQ = Math.max(...trendData.map(t=>t.q),1);

  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Analizlerim</div>
    <div class="page-sub">Kişisel performans takibi</div>

    <!-- Dönem seçici -->
    <div style="display:flex;gap:8px;margin-bottom:20px;background:var(--surface2);border-radius:12px;padding:4px">
      ${['daily','weekly','monthly'].map((p,i)=>{
        const lbl = ['Günlük','Haftalık','Aylık'][i];
        return `<button onclick="analysisPeriod='${p}';showPage('my-analysis')"
          style="flex:1;padding:8px;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:0.85rem;
            background:${analysisPeriod===p?'var(--accent)':'transparent'};
            color:${analysisPeriod===p?'#fff':'var(--text2)'};transition:all .2s">${lbl}</button>`;
      }).join('')}
    </div>

    <!-- Özet kartlar -->
    <div class="grid-3" style="margin-bottom:16px">
      <div class="stat-card">
        <div class="stat-label">Çalışma Süresi</div>
        <div class="stat-value" style="color:var(--accent)">${totalDur}<span style="font-size:0.8rem">dk</span></div>
        <div class="stat-change">${dayCount} gün aktif</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Soru</div>
        <div class="stat-value" style="color:var(--accent4)">${totalQ}</div>
        <div class="stat-change">✅${totalCorrect} ❌${totalWrong}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Net</div>
        <div class="stat-value" style="color:var(--accent3)">${totalNet.toFixed(1)}</div>
        <div class="stat-change">${totalQ>0?(totalNet/totalQ*100).toFixed(0)+'% isabet':'-'}</div>
      </div>
    </div>

    <!-- Son 7 günlük trend -->
    ${analysisPeriod !== 'daily' ? `
    <div class="card" style="margin-bottom:16px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg> Son 7 Günlük Trend</div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:80px;padding:0 4px">
        ${trendData.map(t=>{
          const h = Math.round((t.q/maxTQ)*70)+2;
          const isToday = t.dk === todayKey;
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="font-size:0.65rem;color:var(--text2)">${t.q||''}</div>
            <div style="width:100%;height:${h}px;background:${isToday?'var(--accent)':'var(--accent)44'};border-radius:4px 4px 0 0;min-height:3px"></div>
            <div style="font-size:0.68rem;color:${isToday?'var(--accent)':'var(--text2)'};font-weight:${isToday?'800':'600'}">${t.label}</div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

    <!-- Ders bazlı detay -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Ders Bazlı Analiz — ${periodLabel}</div>
      ${filtered.length === 0
        ? `<div style="text-align:center;padding:24px;color:var(--text2)">Bu dönemde henüz veri yok. Çalışma girişi ekle! 💪</div>`
        : subjectStats.map(s=>`
          <div style="padding:10px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:700;font-size:0.88rem;color:var(--${s.cls})">${s.icon} ${s.name}</span>
              <span style="font-size:0.78rem;color:var(--text2)">${s.q} soru • ${s.dur}dk • Net: <b style="color:var(--accent3)">${s.net.toFixed(1)}</b></span>
            </div>
            <div class="bar-bg" style="height:6px">
              <div class="bar-fill bg-${s.cls}" style="width:${Math.round(s.q/maxQ*100)}%"></div>
            </div>
            ${s.q>0?`<div style="font-size:0.72rem;color:var(--text2);margin-top:4px">✅${s.d} doğru &nbsp; ❌${s.y} yanlış &nbsp; 🎯%${s.netPct} isabet</div>`:''}
          </div>
        `).join('')}
    </div>

    <!-- Güçlü / Zayıf -->
    ${filtered.length > 0 ? `
    <div class="card" style="margin-bottom:16px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Güçlü & Zayıf Derslerim</div>
      <div class="grid-2">
        <div>
          <div style="color:var(--accent3);font-weight:800;margin-bottom:10px">💪 En Başarılı</div>
          ${strong.length ? strong.map(s=>`
            <div style="padding:8px 12px;background:rgba(67,233,123,.08);border-radius:8px;font-size:0.83rem;margin-bottom:6px;border:1px solid rgba(67,233,123,.2)">
              ${s.icon} ${s.name} — %${s.netPct} isabet
            </div>`).join('') : '<div style="color:var(--text2);font-size:0.82rem">Yeterli veri yok</div>'}
        </div>
        <div>
          <div style="color:var(--accent2);font-weight:800;margin-bottom:10px">⚠️ Çalışılmalı</div>
          ${weak.length ? weak.map(s=>`
            <div style="padding:8px 12px;background:rgba(255,101,132,.08);border-radius:8px;font-size:0.83rem;margin-bottom:6px;border:1px solid rgba(255,101,132,.2)">
              ${s.icon} ${s.name} — %${s.netPct} isabet
            </div>`).join('') : '<div style="color:var(--text2);font-size:0.82rem">Yeterli veri yok</div>'}
        </div>
      </div>
    </div>` : ''}

    <!-- Koç Yorumu -->
    <div class="card" style="margin-bottom:16px;background:linear-gradient(135deg,var(--accent)12,var(--accent)05);border:1px solid var(--accent)33">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="1" y1="9" x2="4" y2="9"/></svg> Performans Yorumu</div>
      <div style="font-size:0.88rem;line-height:1.7;color:var(--text)">${comment}</div>
    </div>

    <!-- Deneme Sınavları -->
    ${(()=>{
      const allD = studyEntries.filter(e=>e.type==='deneme');
      if(allD.length===0) return '';
      const dMap = {};
      allD.forEach(e=>{ const k=e.examId||(e.dateKey+'_legacy'); if(!dMap[k]) dMap[k]=[]; dMap[k].push(e); });
      const dList = Object.entries(dMap).sort((a,b)=>(b[1][0]?.dateKey||'').localeCompare(a[1][0]?.dateKey||'')).map(([k,dersler],i)=>{
        const title = dersler[0]?.examTitle||dersler[0]?.topic||(dersler[0]?.dateKey+' Denemesi');
        const dk = dersler[0]?.dateKey||'';
        const dateL = dk ? new Date(dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}) : '';
        const subR = subjects.map(s=>{ const se=dersler.find(e=>e.subject===s.name); if(!se) return {...s,d:0,y:0,net:0,q:0}; const d=se.correct||0,y=se.wrong||0; return {...s,d,y,net:Math.round((d-y/3)*100)/100,q:d+y}; });
        const lgsR = calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:s.q>0?1:0})));
        const examId2 = dersler[0]?.examId||k;
        const accId = 'std_den_'+i;
        const num = i+1;
        return `<div style="border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:8px">
          <div style="display:flex;align-items:stretch">
            <div onclick="toggleDenemeAcc('${accId}')" style="flex:1;display:flex;justify-content:space-between;align-items:center;padding:12px 10px;cursor:pointer;background:var(--surface2);user-select:none">
              <div style="min-width:0">
                <div style="font-weight:800;font-size:0.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px">${title}</div>
                <div style="font-size:0.7rem;color:var(--text2)">${dateL}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                <div style="text-align:right">
                  <div style="font-size:1.2rem;font-weight:900;color:var(--accent)">${lgsR.puan}</div>
                  <div style="font-size:0.6rem;color:var(--text2)">/500</div>
                </div>
                <span id="${accId}_arrow" style="font-size:0.9rem;color:var(--text2)">▼</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;border-left:1px solid var(--border)">
              <button onclick="editDeneme('${examId2}','${title.replace(/'/g,'\\\'')}')" style="flex:1;background:var(--accent)15;border:none;padding:0 12px;cursor:pointer;font-size:0.85rem;color:var(--accent);border-bottom:1px solid var(--border)" title="Düzenle"><svg style="vertical-align:middle" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button onclick="deleteDeneme('${examId2}')" style="flex:1;background:#ff658415;border:none;padding:0 12px;cursor:pointer;font-size:0.85rem;color:#ff6584" title="Sil"><svg style="vertical-align:middle" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
            </div>
          </div>
          <div id="${accId}" style="display:none;padding:12px;background:var(--surface);border-top:1px solid var(--border)">
            ${subR.filter(s=>s.q>0).map(s=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:0.8rem"><span style="color:var(--${s.cls})">${s.icon} ${s.name}</span><span>D:${s.d} Y:${s.y} <b style="color:var(--accent3)">Net:${s.net.toFixed(2)}</b></span></div>`).join('')}
            <div style="text-align:right;font-size:0.78rem;font-weight:800;color:var(--accent);margin-top:8px">Ham: ${lgsR.hamPuan} → LGS: ${lgsR.puan}/500</div>
          </div>
        </div>`;
      });
      return `<div class="card" style="margin-bottom:16px;border:1px solid var(--accent4)33">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div class="card-title" style="margin:0"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Deneme Sınavlarım</div>
          <div style="font-size:0.75rem;color:var(--text2)">${dList.length} deneme</div>
        </div>
        ${dList.join('')}
      </div>`;
    })()}

    <!-- PDF -->
    <div class="pdf-actions">
      <button class="pdf-btn" onclick="exportStudentPDF()">📄 PDF Raporu İndir</button>
    </div>
  `;
}

function generateAnalysisComment(filtered, subjectStats, totalDur, totalQ, totalNet, dayCount, period, studentNameParam) {
  if (filtered.length === 0) {
    return `Henüz bu dönem için çalışma verisi bulunmuyor. Düzenli çalışma girişi yaparak performansını takip edebilirsin. Her gün küçük adımlar büyük fark yaratır! 💪`;
  }
  const avgDurPerDay = dayCount > 0 ? Math.round(totalDur/dayCount) : 0;
  const netRate = totalQ > 0 ? (totalNet/totalQ*100).toFixed(0) : 0;
  const subWithQ = subjectStats.filter(s=>s.q>0).sort((a,b)=>b.netPct-a.netPct);
  const bestSub = subWithQ[0];
  const worstSub = [...subWithQ].reverse()[0];

  let comments = [];

  // Süre yorumu
  if (period === 'daily') {
    if (totalDur >= 180) comments.push(`Bugün <b>${totalDur} dakika</b> çalıştın — harika bir gün! 🏆`);
    else if (totalDur >= 90) comments.push(`Bugün <b>${totalDur} dakika</b> çalıştın — iyi devam! ✅`);
    else comments.push(`Bugün <b>${totalDur} dakika</b> çalıştın. Günlük en az 2 saat hedeflemeye çalış. 📚`);
  } else if (period === 'weekly') {
    if (dayCount >= 5) comments.push(`Bu hafta <b>${dayCount} gün</b> çalışman düzenlilik açısından çok iyi! 🌟`);
    else comments.push(`Bu hafta <b>${dayCount} gün</b> aktif oldun. Haftada en az 5 gün hedefle. 📅`);
    if (avgDurPerDay >= 120) comments.push(`Günlük ortalama <b>${avgDurPerDay} dakika</b> çalıştın — bu harika bir tempo! 🚀`);
    else comments.push(`Günlük ortalama <b>${avgDurPerDay} dakika</b> çalışıyorsun. Bunu artırmak için günlük küçük hedefler koy. ⏰`);
  } else {
    if (dayCount >= 20) comments.push(`Bu ay <b>${dayCount} gün</b> çalıştın — aylık hedefini tutturuyorsun! 🏆`);
    else comments.push(`Bu ay <b>${dayCount} aktif gün</b> var. Aylık 25 gün hedefle. 📆`);
    comments.push(`Toplam <b>${totalDur} dakika</b> (${(totalDur/60).toFixed(1)} saat) çalışma yaptın.`);
  }

  // Soru/net yorumu
  if (totalQ > 0) {
    if (netRate >= 70) comments.push(`<b>${totalQ} sorudan</b> net oranın <b>%${netRate}</b> — isabetli çalışıyorsun! ✨`);
    else if (netRate >= 50) comments.push(`<b>${totalQ} sorudan</b> net oranın <b>%${netRate}</b>. Yanlışları tekrar et, oran yükselecek. 📖`);
    else comments.push(`<b>${totalQ} soru</b> çözdün ancak isabet oranın <b>%${netRate}</b>. Hız yerine anlayarak çöz. 🔍`);
  }

  // Ders yorumu
  if (bestSub) comments.push(`En güçlü dersin <b>${bestSub.name}</b> (%${bestSub.netPct} isabet) — tebrikler! 🎯`);
  if (worstSub && worstSub.name !== bestSub?.name) comments.push(`<b>${worstSub.name}</b> dersine biraz daha odaklanabilirsin (%${worstSub.netPct} isabet). 💡`);

  // Deneme özeti
  // Öğrenciye ait tüm deneme girişleri
  // selectedStudentName global — öğretmen tarafında seçili öğrenci
  // Öğrenci kendi raporunu alıyorsa filtered içindeki studentName'i kullan
  // Öğrenci adını belirle — studentNameParam öncelikli
  const _sName = studentNameParam
    || (typeof selectedStudentName !== 'undefined' && selectedStudentName)
    || filtered.find(e=>e.studentName)?.studentName
    || null;
  // Deneme girişlerini filtrele — studentName veya userId eşleşmesi
  const _currentUid = (window.currentUserData||{}).uid || null;
  const _dAll = studyEntries.filter(e=>{
    if (e.type !== 'deneme') return false;
    if (!_sName && !_currentUid) return true; // filtre yoksa hepsini al
    if (_currentUid && e.userId === _currentUid) return true;
    if (_sName && e.studentName === _sName) return true;
    return false;
  });
  const _dUse = _dAll;
  if (_dUse.length >= 1) {
    const _grp={};
    _dUse.forEach(e=>{
      const k=e.examId||e.dateKey;
      if(!_grp[k]) _grp[k]={dersler:{}};
      const net=Math.max(0,(e.correct||0)-(e.wrong||0)/3);
      if(!_grp[k].dersler[e.subject]) _grp[k].dersler[e.subject]={net:0,cnt:0};
      _grp[k].dersler[e.subject]={net, cnt:1};
    });
    const _lgsSoru={'Türkçe':20,'Matematik':20,'Fen Bilimleri':20,'İnkılap Tarihi':10,'Din Kültürü':10,'İngilizce':10};
    const _dSira=Object.values(_grp);
    const _topNet=d=>Object.values(d.dersler).reduce((a,v)=>a+v.net,0);
    const _puan=n=>Math.min(500,Math.max(100,Math.round(100+n*4.444)));
    const _ortP=Math.round(_dSira.reduce((a,d)=>a+_puan(_topNet(d)),0)/_dSira.length);
    const _dOrt={};
    _dSira.forEach(d=>Object.entries(d.dersler).forEach(([ders,v])=>{
      if(!_dOrt[ders]) _dOrt[ders]={net:0,cnt:0,max:_lgsSoru[ders]||10};
      _dOrt[ders].net+=v.net; _dOrt[ders].cnt++;
    }));
    const _arr=Object.entries(_dOrt)
      .map(([d,v])=>({d,ort:Math.round(v.net/v.cnt*10)/10,max:v.max,pct:Math.min(100,Math.round(v.net/v.cnt/v.max*100))}))
      .sort((a,b)=>a.pct-b.pct);
    const _enZ=_arr[0], _enG=_arr[_arr.length-1];
    const _son=_puan(_topNet(_dSira[_dSira.length-1]));
    const _ilk=_puan(_topNet(_dSira[0]));
    const _trend=_son-_ilk>15?'artış trendi var':_son-_ilk>5?'hafif yükseliş var':_son-_ilk>-15?'stabil':'düşüş var';
    comments.push(
      '<b>'+_dSira.length+' denemede</b> tahmini LGS puan ortalaması yaklaşık <b>'+_ortP+'/500</b>; son deneme '+_son+' puan, '+_trend+'. '+
      (_enG?'En yüksek net ortalaması <b>'+_enG.d+'</b> (ort. '+_enG.ort+'/'+_enG.max+' net). ':'')+
      (_enZ&&_enZ.d!==_enG?.d?'En düşük net ortalaması <b>'+_enZ.d+'</b> (ort. '+_enZ.ort+'/'+_enZ.max+' net) — öncelikli çalışma alanı.':'')
    );
  }

  // Genel öneri
  const lgsDate = new Date('2026-06-13T09:30:00+03:00');
  const daysLeft = Math.floor((lgsDate - new Date())/(1000*60*60*24));
  comments.push(`<b>LGS'ye ${daysLeft} gün</b> kaldı — her gün düzenli çalışmak seni hedefe taşır! 🚀`);

  return comments.join('<br><br>');
}

function exportStudentPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'p', unit:'mm', format:'a4' });
  const name = document.getElementById('menuName')?.textContent;
  const periodLabels = { daily:'Günlük', weekly:'Haftalık', monthly:'Aylık' };
  const pLabel = periodLabels[analysisPeriod] || 'Haftalık';

  // Gradient header
  doc.setFillColor(108,99,255); doc.rect(0,0,210,38,'F');
  doc.setFillColor(67,233,123); doc.rect(0,36,210,3,'F');
  // Logo ikonu sol üst
  pdfDrawLogo(doc, 8, 3, 22);
  doc.setFont(_PF,'bold'); doc.setFontSize(14); doc.setTextColor(255,255,255);
  doc.text('LGS', 33, 13); doc.setTextColor(180,230,255); doc.text('Koç', 47, 13);
  doc.setFont(_PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(76,201,240);
  doc.text(tx('Öğrenci Takip'), 33, 19);
  // Orta başlık
  doc.setFont(_PF,'bold'); doc.setFontSize(11); doc.setTextColor(255,255,255);
  doc.text('Öğrenci Analiz Raporu', 130, 14, {align:'center'});
  doc.setFontSize(8); doc.setFont(_PF,'normal'); doc.setTextColor(210,205,255);
  doc.text(`${name} | ${pLabel} Rapor | ${new Date().toLocaleDateString('tr-TR')}`, 130, 22, {align:'center'});

  let y = 50;

  // Özet kutuları
  const now = new Date();
  const todayKey = getDateKey(now);
  let filtered = [];
  if (analysisPeriod === 'daily') filtered = studyEntries.filter(e=>e.dateKey===todayKey);
  else if (analysisPeriod === 'weekly') {
    const monday = new Date(now); monday.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
    filtered = studyEntries.filter(e=>e.dateKey>=monday.toISOString().split('T')[0]);
  } else {
    filtered = studyEntries.filter(e=>e.dateKey>=todayKey.substring(0,7)+'-01');
  }

  const totalDur = filtered.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = filtered.reduce((a,e)=>a+(e.questions||0),0);
  const totalCorrect = filtered.reduce((a,e)=>a+(e.correct||0),0);
  const totalWrong = filtered.reduce((a,e)=>a+(e.wrong||0),0);
  const totalNet = filtered.reduce((a,e)=>a+(e.net||0),0);
  const dayCount = new Set(filtered.map(e=>e.dateKey)).size;

  const stats = [
    ['Süre (dk)', totalDur], ['Toplam Soru', totalQ],
    ['Doğru', totalCorrect], ['Yanlış', totalWrong],
    ['Net', totalNet.toFixed(1)], ['Aktif Gün', dayCount]
  ];
  const bw = 28, bh = 16, bx = 14, gap = 4;
  stats.forEach((s,i)=>{
    const x = bx + i*(bw+gap);
    doc.setFillColor(245,245,255); doc.roundedRect(x, y, bw, bh, 2, 2, 'F');
    doc.setFontSize(14); doc.setFont(_PF,'bold'); doc.setTextColor(108,99,255);
    doc.text(String(s[1]), x+bw/2, y+10, {align:'center'});
    doc.setFontSize(7); doc.setFont(_PF,'normal'); doc.setTextColor(100,100,120);
    doc.text(s[0], x+bw/2, y+14, {align:'center'});
  });
  y += 26;

  // Ders tablosu
  doc.setFont(_PF,'bold'); doc.setFontSize(12); doc.setTextColor(30,30,50);
  doc.text('Ders Bazlı Analiz', 14, y); y += 7;

  const headers = ['Ders','Süre(dk)','Soru','Doğru','Yanlış','Net','%İsabet'];
  const colW = [40,22,18,18,18,16,22];
  let cx = 14;
  doc.setFillColor(108,99,255);
  headers.forEach((h,i)=>{ doc.rect(cx,y,colW[i],7,'F'); cx+=colW[i]; });
  doc.setTextColor(255,255,255); doc.setFontSize(8);
  cx = 14;
  headers.forEach((h,i)=>{ doc.text(h, cx+colW[i]/2, y+5, {align:'center'}); cx+=colW[i]; });
  y += 7;

  subjects.forEach((s,idx)=>{
    const se = filtered.filter(e=>e.subject===s.name);
    const q = se.reduce((a,e)=>a+(e.questions||0),0);
    const d = se.reduce((a,e)=>a+(e.correct||0),0);
    const w = se.reduce((a,e)=>a+(e.wrong||0),0);
    const net = se.reduce((a,e)=>a+(e.net||0),0);
    const dur = se.reduce((a,e)=>a+(e.duration||0),0);
    const pct = q>0?Math.round(d/q*100):0;
    const row = [s.name, dur, q, d, w, net.toFixed(1), '%'+pct];
    doc.setFillColor(idx%2===0?248:255, idx%2===0?248:255, idx%2===0?252:255);
    cx = 14;
    colW.forEach(w=>{ doc.rect(cx,y,w,6,'F'); cx+=w; });
    doc.setTextColor(30,30,50); doc.setFontSize(8);
    cx = 14;
    row.forEach((v,i)=>{ doc.text(String(v), cx+colW[i]/2, y+4.5, {align:'center'}); cx+=colW[i]; });
    y += 6;
  });
  y += 8;

  // Yorum
  const subjectStats = subjects.map(s=>{
    const se=filtered.filter(e=>e.subject===s.name);
    const q=se.reduce((a,e)=>a+(e.questions||0),0);
    const d=se.reduce((a,e)=>a+(e.correct||0),0);
    const w=se.reduce((a,e)=>a+(e.wrong||0),0);
    const net=se.reduce((a,e)=>a+(e.net||0),0);
    const dur=se.reduce((a,e)=>a+(e.duration||0),0);
    const netPct=q>0?Math.round(d/q*100):0;
    return {...s,q,d,y:w,net,dur,netPct};
  });
  const rawComment = generateAnalysisComment(filtered,subjectStats,totalDur,totalQ,totalNet,dayCount,analysisPeriod,name)
    .replace(/<b>/g,'').replace(/<\/b>/g,'').replace(/<br><br>/g,'\n').replace(/<[^>]+>/g,'');

  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFillColor(245,245,255); doc.roundedRect(14, y, 182, 6, 2, 2, 'F');
  doc.setFont(_PF,'bold'); doc.setFontSize(11); doc.setTextColor(108,99,255);
  doc.text('Performans Yorumu', 105, y+4.5, {align:'center'}); y += 10;
  doc.setFont(_PF,'normal'); doc.setFontSize(8.5); doc.setTextColor(40,40,60);
  const lines = doc.splitTextToSize(rawComment, 182);
  lines.forEach(l=>{ if(y>280){doc.addPage();y=20;} doc.text(l,14,y); y+=5; });

  // Footer
  doc.setFillColor(108,99,255); doc.rect(0,287,210,10,'F');
  doc.setTextColor(255,255,255); doc.setFontSize(8);
  doc.text('LGSKoç - Öğrenci Takip Sistemi | lgs-koc-takip.firebaseapp.com', 105, 293, {align:'center'});

  const fname2 = ts(name.replace(/\s+/g,'_'))+'_'+pLabel+'_analiz_'+todayKey+'.pdf';
  pdfDownload(doc, fname2);
}


