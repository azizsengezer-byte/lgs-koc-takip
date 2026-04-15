function studentDailyEntry() {
  const todayStr = new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long'});
  const todayKey = getTodayKey();
  const todayEntries = studyEntries.filter(e => e.isToday || e.dateKey === todayKey);
  const totalDur = todayEntries.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = todayEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.questions||0),0);
  const totalCorrect = todayEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.correct||0),0);
  const totalWrong = todayEntries.filter(e=>e.type!=='deneme').reduce((a,e)=>a+(e.wrong||0),0);

  // ---- GRUPLAMA ----
  // 1. Denemeler → examId/examTitle ile grupla
  const denemeMap = {};
  todayEntries.filter(e=>e.type==='deneme').forEach((e,i)=>{
    const key = e.examId || (e.topic||'Deneme Sınavı');
    if(!denemeMap[key]) denemeMap[key] = { title: e.examTitle||e.topic||'Deneme Sınavı', entries: [] };
    denemeMap[key].entries.push({...e, _localIdx: studyEntries.indexOf(e)});
  });

  // 2. Normal girişler → tür bazlı
  const typeGroups = {
    'soru':   { label: '📝 Soru Çözümü',     entries: [] },
    'konu':   { label: '📖 Konu Çalışması',   entries: [] },
    'tekrar': { label: '🔁 Tekrar',            entries: [] },
  };
  todayEntries.filter(e=>e.type!=='deneme').forEach(e=>{
    const g = typeGroups[e.type] || typeGroups['soru'];
    g.entries.push({...e, _localIdx: studyEntries.indexOf(e)});
  });

  // ---- GRUP RENDER YARDIMCI ----
  function renderEntryRow(e) {
    const icon = subjects.find(s=>s.name===e.subject)?.icon||'📚';
    const subj = subjects.find(s=>s.name===e.subject);
    const netStr = e.questions>0 ? `Net: <b style="color:var(--accent3)">${(e.net||0).toFixed(2)}</b>` : '';
    const eid = e.firestoreId || e.id || '';
    const idx = e._localIdx ?? studyEntries.findIndex(x=>x.time===e.time&&x.subject===e.subject&&x.dateKey===e.dateKey);
    return `
      <div style="display:flex;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:1.1rem;margin-right:10px;flex-shrink:0">${icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:0.88rem;color:var(--${subj?.cls||'accent'})">${e.subject}</div>
          ${e.type!=='deneme'?`<div style="font-size:0.76rem;color:var(--text2)">${e.topic||'Genel'}</div>`:''}
          <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">
            ⏱${e.duration||0}dk
            ${e.questions>0?` · 📝${e.questions} · ✅${e.correct||0} · ❌${e.wrong||0} · ${netStr}`:''}
          </div>
          ${e.note?`<div style="font-size:0.72rem;color:var(--text2);font-style:italic;margin-top:2px">📌 ${e.note}</div>`:''}
        </div>
        <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;margin-left:6px">
          <span style="font-size:0.65rem;color:var(--text2)">${e.time||''}</span>
          <button onclick="editEntryModal('${eid}',${idx})" style="background:var(--accent)15;border:none;padding:5px 7px;border-radius:6px;cursor:pointer;color:var(--accent);line-height:1"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button onclick="deleteEntry('${eid}',${idx})" style="background:#ff658415;border:none;padding:5px 7px;border-radius:6px;cursor:pointer;color:#ff6584;line-height:1"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
        </div>
      </div>`;
  }

  // ---- DENEME GRUPLARI RENDER ----
  const denemeGroups = Object.entries(denemeMap);
  const denemeHTML = denemeGroups.length === 0 ? '' : denemeGroups.map(([key, grp])=>{
    const subR = subjects.map(s=>{
      const se = grp.entries.find(e=>e.subject===s.name);
      if(!se) return null;
      return {name:s.name,icon:s.icon,cls:s.cls,d:se.correct||0,y:se.wrong||0,net:Math.round((se.net||0)*100)/100};
    }).filter(Boolean);
    const lgsR = calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:1})));
    const examId2 = grp.entries[0]?.examId || key;
    const accId = 'grp_deneme_'+key.replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'');
    return `
      <div style="border:1px solid var(--accent4)33;border-radius:12px;margin-bottom:10px;overflow:hidden">
        <!-- Başlık -->
        <div onclick="toggleDenemeAcc('${accId}')" style="display:flex;align-items:center;justify-content:space-between;padding:11px 13px;background:var(--accent4)10;cursor:pointer;user-select:none">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:1.2rem">🎯</span>
            <div>
              <div style="font-weight:800;font-size:0.9rem">${grp.title}</div>
              <div style="font-size:0.72rem;color:var(--text2)">${grp.entries.length} ders · Tahmini LGS: <b style="color:var(--accent)">${lgsR.puan}</b>/500</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="text-align:right">
              <div style="font-size:1.1rem;font-weight:900;color:var(--accent)">${lgsR.puan}</div>
              <div style="font-size:0.58rem;color:var(--text2)">/500</div>
            </div>
            <span id="${accId}_arrow" style="color:var(--text2)">▼</span>
          </div>
        </div>
        <!-- Detay -->
        <div id="${accId}" style="display:none;padding:8px 12px;background:var(--surface)">
          ${subR.map(s=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:0.82rem;color:var(--${s.cls})">${s.icon} ${s.name}</span>
              <span style="font-size:0.8rem">D:${s.d} Y:${s.y} <b style="color:var(--accent3)">Net:${s.net.toFixed(2)}</b></span>
            </div>`).join('')}
          <div style="margin-top:8px;font-size:0.75rem;color:var(--text2);display:flex;justify-content:space-between">
            <span>Ham Puan: <b style="color:var(--accent)">${lgsR.hamPuan}</b></span>
            <span>LGS Tahmini: <b style="color:var(--accent)">${lgsR.puan}/500</b></span>
          </div>
          <!-- Düzenle/Sil -->
          <div style="display:flex;gap:8px;margin-top:8px">
            <button onclick="editDeneme('${examId2}','${grp.title.replace(/'/g,'\\\'')}')" style="flex:1;background:var(--accent)15;border:none;padding:7px;border-radius:8px;cursor:pointer;font-size:0.82rem;color:var(--accent)"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Düzenle</button>
            <button onclick="deleteDeneme('${examId2}')" style="flex:1;background:#ff658415;border:none;padding:7px;border-radius:8px;cursor:pointer;font-size:0.82rem;color:#ff6584"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> Sil</button>
          </div>
        </div>
      </div>`;
  }).join('');

  // ---- NORMAL GİRİŞ GRUPLARI RENDER ----
  const normalHTML = Object.values(typeGroups).filter(g=>g.entries.length>0).map(g=>{
    const totalGrpQ = g.entries.reduce((a,e)=>a+(e.questions||0),0);
    const totalGrpNet = g.entries.reduce((a,e)=>a+(e.net||0),0);
    const totalGrpDur = g.entries.reduce((a,e)=>a+(e.duration||0),0);
    const accId2 = 'grp_'+g.label.replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'');
    return `
      <div style="border:1px solid var(--border);border-radius:12px;margin-bottom:10px;overflow:hidden">
        <div onclick="toggleDenemeAcc('${accId2}')" style="display:flex;align-items:center;justify-content:space-between;padding:11px 13px;background:var(--surface2);cursor:pointer;user-select:none">
          <div>
            <div style="font-weight:800;font-size:0.9rem">${g.label}</div>
            <div style="font-size:0.72rem;color:var(--text2)">${g.entries.length} giriş · ${totalGrpDur}dk${totalGrpQ>0?' · '+totalGrpQ+' soru · Net:'+totalGrpNet.toFixed(1):''}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="background:var(--accent)22;color:var(--accent);font-size:0.8rem;font-weight:700;padding:3px 8px;border-radius:99px">${g.entries.length}</span>
            <span id="${accId2}_arrow" style="color:var(--text2)">▼</span>
          </div>
        </div>
        <div id="${accId2}" style="display:none;padding:0 12px;background:var(--surface)">
          ${g.entries.map(e=>renderEntryRow(e)).join('')}
          <div style="height:4px"></div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Günlük Çalışma Girişi</div>
    <div class="page-sub">${todayStr}</div>

    <div class="grid-3" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-label">Toplam Süre</div>
        <div class="stat-value" style="color:var(--accent)">${totalDur}<span style="font-size:0.9rem">dk</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Soru</div>
        <div class="stat-value" style="color:var(--accent4)">${totalQ}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">D / Y</div>
        <div class="stat-value" style="font-size:1.2rem"><span style="color:var(--accent3)">${totalCorrect}</span><span style="color:var(--text2);font-size:0.9rem"> / </span><span style="color:var(--accent2)">${totalWrong}</span></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Ders Seç & Çalışma Ekle</div>
      <div class="subject-entry-grid">
        ${subjects.map(s=>{
          const sEntries = todayEntries.filter(e=>e.subject===s.name&&e.type==='soru');
          const sQ = sEntries.reduce((a,e)=>a+(e.questions||0),0);
          const sD = sEntries.reduce((a,e)=>a+(e.correct||0),0);
          const sY = sEntries.reduce((a,e)=>a+(e.wrong||0),0);
          const sNet = sEntries.reduce((a,e)=>a+(e.net||0),0);
          const girisCount = todayEntries.filter(e=>e.subject===s.name).length;
          return `
          <div class="subject-entry-card" onclick="openEntryFor('${s.name}')">
            <div class="sec-name"><span class="sec-dot" style="background:${s.color}"></span>${s.icon} ${s.name}</div>
            ${sQ>0
              ? `<div style="font-size:0.72rem;color:var(--text2);margin-top:2px">${sQ} soru • ✅${sD} ❌${sY}</div>
                 <div style="font-size:0.72rem;font-weight:700;color:var(--accent3)">Net: ${sNet.toFixed(1)}</div>`
              : `<div style="font-size:0.75rem;color:var(--text2)">${girisCount} giriş</div>`}
          </div>`;}).join('')}
      </div>
      <!-- Deneme Sınavı butonu -->
      ${(()=>{
        const denemeCount = todayEntries.filter(e=>e.type==='deneme').length;
        const denemeNet   = todayEntries.filter(e=>e.type==='deneme').reduce((a,e)=>a+(e.net||0),0);
        return `<button onclick="openDenemeSinaviEntry()"
          style="width:100%;margin-top:12px;padding:12px;border-radius:12px;
                 background:linear-gradient(135deg,#6c63ff22,#45b7d122);
                 border:1.5px solid #6c63ff66;color:var(--text);cursor:pointer;
                 display:flex;align-items:center;justify-content:space-between;font-size:0.88rem;font-weight:700">
          <span>📊 Deneme Sınavı Ekle</span>
          ${denemeCount>0
            ? `<span style="font-size:0.78rem;color:var(--accent);font-weight:700">${denemeCount} deneme • Net: ${denemeNet.toFixed(1)}</span>`
            : ``}
        </button>`;
      })()}
      
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom:12px"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> Bugünkü Girişler
        ${todayEntries.length>0?`<span style="float:right;font-size:0.75rem;color:var(--text2);font-weight:400">${todayEntries.length} kayıt</span>`:''}
      </div>
      ${todayEntries.length === 0
        ? `<div style="text-align:center;padding:24px;color:var(--text2)">Henüz giriş yok. Yukarıdan ekle! 💪</div>`
        : `${denemeHTML}${normalHTML}`}
    </div>
  `;
}

let analysisPeriod = 'weekly'; // 'daily' | 'weekly' | 'monthly'

