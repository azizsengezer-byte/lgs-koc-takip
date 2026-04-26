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
      <div class="page-title" style="margin:0"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Tüm Denemeler</div>
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

// ============================================================
// ── AI KOTA SİSTEMİ ────────────────────────────────────────
const AI_AYLIK_KOTA = 20;

function _aiKotaKey() {
  const uid = (window.currentUserData || {}).uid || 'local';
  const ay  = new Date().toISOString().slice(0, 7); // "2026-04"
  return 'ai_kota_' + uid + '_' + ay;
}

function aiKotaKullanim() {
  try { return parseInt(localStorage.getItem(_aiKotaKey()) || '0'); } catch(e) { return 0; }
}

function aiKotaArttir() {
  try {
    const yeni = aiKotaKullanim() + 1;
    localStorage.setItem(_aiKotaKey(), yeni);
    return yeni;
  } catch(e) { return 0; }
}

function aiKotaDolu() {
  return aiKotaKullanim() >= AI_AYLIK_KOTA;
}

function _aiToggleKey(sNameKey) {
  return 'ai_toggle_psych_' + sNameKey;
}

function aiToggleDurumu(sNameKey) {
  // Toggle durumu key'den bağımsız saklanır
  // Key kontrolü sadece PDF alırken yapılır
  return localStorage.getItem(_aiToggleKey(sNameKey)) === 'true';
}

function aiToggleGuncelle(sNameKey) {
  const mevcutAcik = aiToggleDurumu(sNameKey);
  const yeniDurum  = !mevcutAcik;
  localStorage.setItem(_aiToggleKey(sNameKey), yeniDurum ? 'true' : 'false');
  _aiToggleUI(sNameKey, yeniDurum);
}

function _aiToggleUI(sNameKey, acik) {
  const toggle  = document.getElementById('aiToggle_' + sNameKey);
  const bilgi   = document.getElementById('aiKotaBilgi_' + sNameKey);
  const kapsul  = document.getElementById('aiToggleKapsul_' + sNameKey);
  if (!toggle) return;

  const kullanim = aiKotaKullanim();
  const kalan    = Math.max(0, AI_AYLIK_KOTA - kullanim);
  const doluluk  = Math.round((kullanim / AI_AYLIK_KOTA) * 100);

  // Toggle görünümü
  toggle.style.background   = acik ? '#6c63ff' : 'var(--surface2)';
  toggle.style.borderColor  = acik ? '#6c63ff' : 'var(--border)';
  toggle.querySelector('.ai-toggle-top').style.transform = acik ? 'translateX(18px)' : 'translateX(0)';
  toggle.querySelector('.ai-toggle-top').style.background = acik ? '#fff' : 'var(--text2)';

  // Kapsül arka planı
  if (kapsul) {
    kapsul.style.background     = acik ? 'rgba(108,99,255,0.06)' : 'var(--surface2)';
    kapsul.style.borderColor    = acik ? 'rgba(108,99,255,0.25)' : 'var(--border)';
  }

  // Kota bilgisi
  if (bilgi) {
    if (!acik) {
      bilgi.style.display = 'none';
      return;
    }
    bilgi.style.display = 'block';

    const apiYok = typeof ANTHROPIC_KEY === 'undefined' || !ANTHROPIC_KEY || ANTHROPIC_KEY === 'BURAYA_KEY_GIR';

    if (apiYok) {
      bilgi.innerHTML = '<div style="font-size:11px;color:#ff6584;margin-top:8px;padding:8px 10px;background:rgba(255,101,132,0.08);border-radius:8px;border:1px solid rgba(255,101,132,0.2)">⚠️ Profil sayfasından API anahtarı eklemen gerekiyor.</div>';
      return;
    }

    if (aiKotaDolu()) {
      bilgi.innerHTML = '<div style="font-size:11px;color:#ff6584;margin-top:8px;padding:8px 10px;background:rgba(255,101,132,0.08);border-radius:8px;border:1px solid rgba(255,101,132,0.2)">🚫 Bu ay için <strong>' + AI_AYLIK_KOTA + ' rapor</strong> kotanı doldurdun. Sıfırlanma: önümüzdeki ay başı.</div>';
      return;
    }

    const renkBar = doluluk >= 80 ? '#ff6584' : doluluk >= 50 ? '#f9ca24' : '#6c63ff';
    bilgi.innerHTML =
      '<div style="margin-top:8px;padding:10px 12px;background:rgba(108,99,255,0.06);border-radius:10px;border:1px solid rgba(108,99,255,0.15)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
          '<span style="font-size:11px;font-weight:700;color:var(--text)">Aylık AI Kotası</span>' +
          '<span style="font-size:11px;font-weight:700;color:' + renkBar + '">' + kullanim + ' / ' + AI_AYLIK_KOTA + '</span>' +
        '</div>' +
        '<div style="height:5px;background:var(--surface);border-radius:3px;overflow:hidden;margin-bottom:6px">' +
          '<div style="height:100%;width:' + doluluk + '%;background:' + renkBar + ';border-radius:3px;transition:width 0.4s ease"></div>' +
        '</div>' +
        '<div style="font-size:10px;color:var(--text2)">' +
          kalan + ' rapor kaldı · Haftalık ve aylık raporlarda kullanılır · Sıfırlanma: ay başı' +
        '</div>' +
      '</div>';
  }
}

// Profil sayfasından API key kaydedilince toggle'ları güncelle
function aiToggleHepsiniGuncelle() {
  document.querySelectorAll('[id^="aiToggle_"]').forEach(el => {
    const key = el.id.replace('aiToggle_', '');
    _aiToggleUI(key, aiToggleDurumu(key));
  });
}

function setPsychRaporBtn(key, mode) {
  ['daily','weekly','monthly'].forEach(m => {
    const btn = document.getElementById('psychRaporBtn_'+m+'_'+key);
    if (!btn) return;
    if (m === mode) {
      btn.style.background = 'var(--accent)22';
      btn.style.borderColor = 'var(--accent)';
      btn.style.color = 'var(--accent)';
    } else {
      btn.style.background = 'var(--surface)';
      btn.style.borderColor = 'var(--border)';
      btn.style.color = 'var(--text2)';
    }
  });
}

// Haftalık/Aylık butonuna basılınca: AI kota kontrolü yap, sonra date picker aç
function _psychAIKontrolVeAc(sName, sNameKey, mode) {
  const aiAcik = aiToggleDurumu(sNameKey);

  if (aiAcik) {
    // API key kontrolü
    if (typeof ANTHROPIC_KEY === 'undefined' || !ANTHROPIC_KEY || ANTHROPIC_KEY === 'BURAYA_KEY_GIR') {
      showToast('⚠️', 'AI aktif ama API anahtarı yok — profil sayfasından ekle');
      openDatePicker('psych_' + sNameKey, mode);
      return;
    }
    // Kota kontrolü
    if (aiKotaDolu()) {
      showToast('🚫', 'Bu ay ' + AI_AYLIK_KOTA + ' AI raporu kotanı doldurdun');
      openDatePicker('psych_' + sNameKey, mode);
      return;
    }
    // Kota artır ve PDF'i AI ile başlat
    aiKotaArttir();
    _aiToggleUI(sNameKey, true); // kota göstergesini güncelle
    window._psychAIAcik = true;
  } else {
    window._psychAIAcik = false;
  }

  openDatePicker('psych_' + sNameKey, mode);
}

function toggleRaporAl(key) {
  const panel = document.getElementById('raporAlPanel_'+key);
  const arrow = document.getElementById('raporAlArrow_'+key);
  if (!panel) return;
  const open = panel.style.display === 'none';
  panel.style.display = open ? 'block' : 'none';
  if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
  // Psych paneli açılınca AI toggle'ı initialize et
  if (open && key.startsWith('psych_')) {
    const sNameKey = key.replace('psych_', '');
    setTimeout(() => _aiToggleUI(sNameKey, aiToggleDurumu(sNameKey)), 50);
  }
}

function setPdfMode(sName, mode) {
  const key = sName.replace(/\s/g,'_');
  const weekBtn = document.getElementById('pdfModeWeekly_'+key);
  const monthBtn = document.getElementById('pdfModeMonthly_'+key);
  const dateSel = document.getElementById('pdfDateSel_'+key);
  if (!weekBtn || !monthBtn || !dateSel) return;

  // Buton stillerini güncelle
  if (mode === 'weekly') {
    weekBtn.style.borderColor = 'var(--accent)'; weekBtn.style.background = 'var(--accent)22'; weekBtn.style.color = 'var(--accent)';
    monthBtn.style.borderColor = 'var(--border)'; monthBtn.style.background = 'transparent'; monthBtn.style.color = 'var(--text2)';
    dateSel.innerHTML = generateWeekOptions();
  } else {
    monthBtn.style.borderColor = 'var(--accent)'; monthBtn.style.background = 'var(--accent)22'; monthBtn.style.color = 'var(--accent)';
    weekBtn.style.borderColor = 'var(--border)'; weekBtn.style.background = 'transparent'; weekBtn.style.color = 'var(--text2)';
    dateSel.innerHTML = generateMonthOptions();
  }
  // Seçili modu data attribute olarak sakla
  dateSel.dataset.mode = mode;
}

async function preparePdfLinkWithDate(sName, btn) {
  const key = sName.replace(/\s/g,'_');
  const dateSel = document.getElementById('pdfDateSel_'+key);
  // Modu belirle: dataset.mode yoksa haftalık (varsayılan)
  const mode = dateSel?.dataset?.mode || 'weekly';
  const val = dateSel?.value || '';
  const now = new Date();

  if (mode === 'monthly') {
    const [yr, mo] = val.split('-').map(Number);
    const startKey = val + '-01';
    const lastDay = new Date(yr, mo, 0).getDate();
    const endKey = val + '-' + String(lastDay).padStart(2,'0');
    const monthName = new Date(yr, mo-1, 1).toLocaleDateString('tr-TR',{month:'long',year:'numeric'});
    window._pdfDateOverride = { mode:'monthly', startKey, endKey, label:'Aylık', title: monthName + ' Aylık Rapor' };
  } else {
    const monKey = val || (() => {
      const m = new Date(now); m.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
      return m.toISOString().split('T')[0];
    })();
    const mon = new Date(monKey+'T12:00:00');
    const sun = new Date(mon); sun.setDate(mon.getDate()+6);
    const endKey = sun.toISOString().split('T')[0];
    const rangeLabel = mon.toLocaleDateString('tr-TR',{day:'numeric',month:'long'}) + ' - ' + sun.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
    window._pdfDateOverride = { mode:'weekly', startKey: monKey, endKey, label:'Haftalık', title: rangeLabel + ' Haftalık Rapor' };
  }

  await preparePdfLink(sName, btn);
  window._pdfDateOverride = null;
}

function generateStudentComment(sName, filtered, subStats, totalDur, totalQ, totalNet, activeDays, period, forPdf=false) {
  // p() — PDF için ASCII, HTML için Türkçe
  const p = forPdf ? ts : (v=>String(v??''));

  if (filtered.length===0) {
    if (forPdf) return ts(sName) + ' bu donem icin henuz calisma girisi bulunmuyor.';
    return `<b>${sName}</b> bu dönem için henüz çalışma girişi bulunmuyor. Öğrenciye hatırlatma yapılması önerilir.`;
  }

  const firstName = p(sName.split(' ')[0]);
  // isabet oranı = doğru / toplam soru (PDF başlığıyla aynı metrik)
  const totalCorrect = filtered.reduce((a,e)=>a+(e.correct||0)+(e.type==='soru'?Math.max(0,(e.net||0)+(e.wrong||0)):0),0);
  const netRate = totalQ>0 ? Math.round(subStats.filter(s=>s.q>0).reduce((a,s)=>a+(s.d||0),0)/totalQ*100) : 0;
  const withQ = subStats.filter(s=>s.q>0).sort((a,b)=>b.pct-a.pct);
  const best = withQ[0];
  const worst = withQ.length>1 ? [...withQ].sort((a,b)=>a.pct-b.pct)[0] : null;
  const lgs = new Date('2026-06-13T09:30:00+03:00');
  const daysLeft = Math.floor((lgs-new Date())/(1000*60*60*24));
  const avgDurDay = activeDays>0 ? Math.round(totalDur/activeDays) : 0;
  const avgQDay = activeDays>0 ? Math.round(totalQ/activeDays) : 0;
  const sep = forPdf ? '\n\n' : '<br><br>';
  let parts = [];

  // 1. GENEL PERFORMANS
  const periodLabel = period==='daily'?p('bugün'):period==='weekly'?p('bu hafta'):p('bu ay');
  let genelPart = `${firstName} ${periodLabel} toplam ${totalDur} ${p('dakika çalışma süresi')}, ${totalQ} ${p('soru çözmesi')} ve ${activeDays} ${p('gün aktif olması')} ile `;
  if (activeDays >= (period==='weekly'?5:period==='monthly'?20:1)) {
    genelPart += p('düzenliliği oldukça iyi bir seviyede. Süreklilik bakımından olumlu bir tablo sergileniyor.');
  } else if (activeDays >= (period==='weekly'?3:period==='monthly'?12:1)) {
    genelPart += p('orta düzey bir düzenliliği yansıtmaktadır. Çalışma günlerinin artırılması önerilir.');
  } else {
    genelPart += p('düzensiz bir çalışma ritmi içinde olduğu görülüyor. Bu konuda ivedi önlem alınmalıdır.');
  }
  parts.push(genelPart);

  // 2. SORU ÇÖZÜMLEFİLİĞİ
  if (totalQ>0) {
    const qAciklama = activeDays > 1
      ? `${p('Soru çözüm verilerine bakıldığında günlük ortalama')} ${avgQDay} ${p('soru ile')} `
      : `${p('Soru çözüm verilerine bakıldığında toplam')} ${totalQ} ${p('soru ile')} `;
    let qPart = qAciklama;
    if (netRate>=75) qPart += `%${netRate} ${p('isabet oranı son derece güçlü bir performansın göstergesidir. Anlayarak ve dikkatli okuyarak çözüm yapması bu başarıyı getiriyor.')}`;
    else if (netRate>=55) qPart += `%${netRate} ${p('isabet oranı kabul edilebilir bir seviyede, ancak geliştirilmesi gereken noktalar bulunuyor. Yanlış yapılan soruların analizi yapılmalı.')}`;
    else qPart += `%${netRate} ${p('isabet oranı düşük bir seviyededir. Hız yerine doğru anlayış önceliklendirilmeli.')}`;
    parts.push(qPart);
  }

  // 3. DERS BAZLI
  if (best) {
    const bestTxt = withQ.length > 1
      ? p('isabet oranı ile en güçlü performansı sergiliyor. Bu dersteki başarı stratejisi diğer derslere model olabilir.')
      : p('isabet oranı ile bu dönemde çalıştığı tek ders.');
    parts.push(`${p('Güçlü Alan:')} ${p(best.name)} ${p('dersinde')} %${best.pct} ${bestTxt}`);
  }
  if (worst && worst.name !== best?.name) {
    let worstPart = `${p('Geliştirilmesi Gereken Alan:')} ${p(worst.name)} ${p('dersinde')} %${worst.pct} ${p('isabet oranı ile en düşük performans görülüyor. ')}`;
    if (worst.pct < 40) worstPart += p('Temel kavramlarda ciddi boşluklar var; bu ders için yoğun ve tekrar odaklı çalışma programı hazırlanmalı.');
    else if (worst.pct < 60) worstPart += p('Orta düzey bir performans. Yanlış analizi yapılarak eksik konular tespit edilmeli.');
    else worstPart += p('Nispeten düşük kalan bu oran, dikkat edilirse kısa sürede geliştirilebilir.');
    parts.push(worstPart);
  }

  // 4. KONU BAZLI TESPİTLER
  const topicInsights = [];
  subStats.filter(s=>s.q>0&&s.topics&&s.topics.length>0).forEach(s=>{
    const weakT = s.topics.filter(t=>t.q>=2&&t.pct<60).sort((a,b)=>a.pct-b.pct)[0];
    if (weakT) {
      const tName = p(weakT.name);
      let tip = '';
      const sn = s.name;
      if (sn==='Türkçe'||sn==='Turkce') tip = `"${tName}" ${p('konusunda')} %${weakT.pct} ${p('isabet — uzun sorularda odaklanma sorunu olabilir, dikkatli okuma pratiği artırılmalı.')}`;
      else if (sn==='Matematik') tip = `"${tName}" ${p('konusunda')} %${weakT.pct} ${p('isabet — görsel okuma veya işlem hatası söz konusu olabilir, adım adım çözüm tekniği önerilir.')}`;
      else if (sn==='Fen Bilimleri') tip = `"${tName}" ${p('konusunda')} %${weakT.pct} ${p('isabet — kavramsal yanlış anlamalar var, deney ve görselle destekli tekrar yapılmalı.')}`;
      else if (sn==='İnkılap Tarihi'||sn==='Inkilap Tarihi') tip = `"${tName}" ${p('konusunda')} %${weakT.pct} ${p('isabet — kronolojik sıralama ve neden-sonuç ilişkisi üzerinde çalışılmalı.')}`;
      else if (sn==='Din Kültürü') tip = `"${tName}" ${p('konusunda')} %${weakT.pct} ${p('isabet — tanım ve kavram bilgisi güçlendirilmeli.')}`;
      else if (sn==='İngilizce') tip = `"${tName}" ${p('konusunda')} %${weakT.pct} ${p('isabet — kelime bilgisi ve yapı pratiği artırılmalı.')}`;
      if (tip) topicInsights.push(`${p(s.name)}: ${tip}`);
    }
  });
  if (topicInsights.length > 0) {
    parts.push(`${p('Konu Bazlı Tespitler:')}${forPdf?'\n':' '}${topicInsights.join(forPdf?'\n':'<br>')}`);
  }

  // 5. STRATEJİK ÖNERİLER
  let stratejik = `${p('Strateji Önerisi:')} `;
  if (avgDurDay < 90) stratejik += `${p('Günlük çalışma süresi')} ${avgDurDay} ${p('dakika ile yetersiz kalıyor; en az 120-150 dakika hedeflenmeli.')} `;
  if (netRate < 60 && totalQ > 0) stratejik += `${p('Soru sayısından önce kalite önemsenmeli; az ama doğru çözüm netleri artırır.')} `;
  if (activeDays < (period==='weekly'?5:period==='monthly'?20:1)) stratejik += `${p('Düzenliliğin artırılması en kritik adımdır. Her gün en az bir ders girişinin yapılması hedeflenmeli.')} `;
  if (best && withQ.length > 1) stratejik += `${p(best.name)} ${p('dersindeki başarının korunması sağlanırken')} `;
  if (worst) stratejik += `${p(worst.name)} ${p('dersine ek ağırlık verilmeli.')} `;
  parts.push(stratejik);

  // 5b. DENEME SINAVI ÖZETİ — sadece seçili dönem içindeki denemeler
  const _sObj = students.find(s=>s.name===sName)||{};
  const _sUid = _sObj.uid||'';
  // filtered zaten dönem filtreli entry listesi — sadece deneme tipini al
  const _dEntries = filtered.filter(e => e.type === 'deneme');
  if (_dEntries.length >= 1) {
    const _grp={};
    _dEntries.forEach(e=>{
      const k=e.examId||e.dateKey;
      if(!_grp[k]) _grp[k]={dersler:{}};
      const net=Math.max(0,(e.correct||0)-(e.wrong||0)/3);
      // Aynı sınavda aynı ders birden fazla girdiyse en son girişi al (üzerine yaz)
      _grp[k].dersler[e.subject]={net, cnt:1};
    });
    const _lgsSoru={'Türkçe':20,'Matematik':20,'Fen Bilimleri':20,'İnkılap Tarihi':10,'Din Kültürü':10,'İngilizce':10};
    const _dSira=Object.values(_grp);
    const _topNet=d=>Object.values(d.dersler).reduce((a,v)=>a+v.net,0);
    const _puan=n=>Math.min(500,Math.max(100,Math.round(100+n*4.444)));
    const _ortP=Math.round(_dSira.reduce((a,d)=>a+_puan(_topNet(d)),0)/_dSira.length);
    const _son=_puan(_topNet(_dSira[_dSira.length-1]));
    const _ilk=_puan(_topNet(_dSira[0]));
    const _trend=_son-_ilk>15?p('artış trendi var'):_son-_ilk>5?p('hafif yükseliş var'):_son-_ilk>-15?p('stabil'):p('düşüş var');
    const _dOrt={};
    _dSira.forEach(d=>Object.entries(d.dersler).forEach(([ders,v])=>{
      if(!_dOrt[ders]) _dOrt[ders]={net:0,cnt:0,max:_lgsSoru[ders]||10};
      _dOrt[ders].net+=v.net; _dOrt[ders].cnt++;
    }));
    const _arr=Object.entries(_dOrt)
      .map(([d,v])=>({d,ort:Math.round(v.net/v.cnt*10)/10,max:v.max,pct:Math.min(100,Math.round(v.net/v.cnt/v.max*100))}))
      .sort((a,b)=>a.pct-b.pct);
    const _enZ=_arr[0], _enG=_arr[_arr.length-1];
    const _denemePart = p(_dSira.length+' denemede tahmini LGS puan ortalaması yaklaşık '+_ortP+'/500; son deneme '+_son+' puan, '+_trend+'. ')+
      (_enG ? p('En yüksek net ortalaması '+_enG.d+' (ort. '+_enG.ort+'/'+_enG.max+' net). ') : '')+
      (_enZ&&_enZ.d!==_enG?.d ? p('En düşük net ortalaması '+_enZ.d+' (ort. '+_enZ.ort+'/'+_enZ.max+' net) — öncelikli çalışma alanı.') : '');
    if (_denemePart) parts.push(_denemePart);
  }

  // 6. LGS HEDEF
  parts.push(`${p("LGS'ye")} ${daysLeft} ${p('gün kalıyor.')} ${firstName}'${p('in her geçen gün daha nitelikli çalışmasının önemi artmaktadır. Düzenli takip, motivasyon desteği ve hedef belirleme bu süreçte belirleyici rol oynayacaktır.')}`);

  return parts.join(sep);
}

// Türkçe karakter dönüştürücü (jsPDF Latin-1 için)
function toSafe(str) {
  return String(str||'')
    .replace(/ğ/g,'g').replace(/Ğ/g,'G')
    .replace(/ü/g,'u').replace(/Ü/g,'U')
    .replace(/ş/g,'s').replace(/Ş/g,'S')
    .replace(/ı/g,'i').replace(/İ/g,'I')
    .replace(/ö/g,'o').replace(/Ö/g,'O')
    .replace(/ç/g,'c').replace(/Ç/g,'C');
}

// LGS Puan Hesaplama (Resmi Formül 2026)
// 1. Net = Doğru - Yanlış/3
// 2. Ham Puan = Σ(Net × Katsayı)  [Türkçe/Mat/Fen: ×4, diğerleri: ×1]
// 3. Standart Puan: ham puanı 100-500 aralığına dönüştür
//    Türkiye ort. ham puan ≈ 85, std ≈ 58
//    SP = 300 + ((hamPuan - 85) / 58) * 66.67  → 100-500 arası

const LGS_KATSAYI = {
  'Türkçe':        4.348,
  'Matematik':     4.2538,
  'Fen Bilimleri': 4.1230,
  'İnkılap Tarihi':1.666,
  'Din Kültürü':   1.899,
  'İngilizce':     1.5075,
};
const LGS_BAZ_PUAN = 194.752082;

function calcLGSScore(subStats) {
  let toplam = 0;
  const detail = [];
  subStats.forEach(s => {
    const k = LGS_KATSAYI[s.name];
    if (k == null) return;
    const net = Number(s.avgNet) || 0; // avgNet = doğru - yanlış/3 (önceden hesaplanmış)
    const puan = net * k;
    toplam += puan;
    detail.push({ name: s.name, net: net.toFixed(2), kat: k, puan: puan.toFixed(2) });
  });
  const lgsPuan = Math.min(Math.max(
    Math.round((toplam + LGS_BAZ_PUAN) * 10) / 10,
  100), 500);
  return { puan: lgsPuan, hamPuan: toplam.toFixed(2), detail };
}


// ============================================================
// ts() - Tüm Türkçe karakterleri ASCII'ye çevir (jsPDF font uyumu)
// ============================================================
// ts() — PDF için: Türkçe→ASCII + emoji/özel karakter temizle
// ts() — PDF için: font yüklüyse Türkçe orijinal, yoksa ASCII
// _PF global değişkeni font durumunu tutar
function ts(v) {
  if (v == null) return '';
  // Türkçe font yüklüyse orijinal metni döndür
  if (typeof _PF !== 'undefined' && (_PF === 'NotoSans' || _PF === 'DejaVuSans')) return String(v);
  // Yoksa ASCII'ye çevir
  let s = String(v);
  const map = {'ğ':'g','Ğ':'G','ü':'u','Ü':'U','ş':'s','Ş':'S',
               'ı':'i','İ':'I','ö':'o','Ö':'O','ç':'c','Ç':'C'};
  s = s.replace(/[ğĞüÜşŞıİöÖçÇ]/g, m => map[m]||m);
  let result = '';
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code >= 32 && code <= 126) result += s[i];
    else if (code === 10 || code === 13) result += ' ';
  }
  return result.trim();
}

// Grafik label'ları için ders kısaltmaları
function dersKisa(name) {
  const map = {
    'Türkçe':'Tür', 'Matematik':'Mat', 'Fen Bilimleri':'Fen',
    'İnkılap Tarihi':'İnk', 'Din Kültürü':'Din', 'İngilizce':'İng'
  };
  return map[name] || (name||'').substring(0,4);
}

// ============================================================
// ============================================================
// TÜRKÇE FONT — NotoSans CDN'den yükle, jsPDF'e register et
// ============================================================
// Türkçe font — DejaVu Sans Latin/Turkish subset (embed)
const _FONT_REGULAR = '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EiYAIgAAEAcBVQS8AXX//wAQAAAFaAdrEiYAIgAAEAcBUwS8AXX//wAQAAAFaAdtEiYAIgAAEAcBVgS8AXX//wAQAAAFaAdeEiYAIgAAEAcBVAS8AXX//wAQAAAFaAdOEiYAIgAAEAcBUgS8AXUAAwAQAAAFaAdtAAsADgAhAAABNCYjIgYVFBYzMjYDASEBLgE1NDYzMhYVFAYHASMDIQMjA1RZP0BXWD8/WZj+8AIh/lg9Pp9zcqE/PAIU0oj9X4jVBlo/WVdBP1hY/vP9GQNOKXNJc6ChckZ2KfqLAX/+gQACAAgAAAdIBdUADwATAAABFSERIRUhESEVIREhAyMBFwEhEQc1/RsCx/05Avj8Pf3woM0CcYv+tgHLBdWq/kaq/eOqAX/+gQXVnvzwAxAA//8Ac/51BScF8BImACQAABAHAGQBLQAA//8AyQAABIsHaxImACYAABAHAVUEngF1//8AyQAABIsHaxImACYAABAHAVMEngF1//8AyQAABIsHbRImACYAABAHAVYEngF1//8AyQAABIsHThImACYAABAHAVIEngF1//8AOwAAAboHaxImACoAABAHAVUDLwF1//8AogAAAh8HaxImACoAABAHAVMDLwF1/////gAAAmAHbRImACoAABAHAVYDLwF1//8ABgAAAlgHThImACoAABAHAVIDLwF1AAIACgAABboF1QAMABkAABMhIAAREAApAREjNTMTESEVIREzIAAREAAh0wGgAbEBlv5p/lD+YMnJywFQ/rDzATUBH/7h/ssF1f6X/oD+fv6WAryQAeP+HZD96gEYAS4BLAEXAP//AMkAAAUzB14SJgAvAAAQBwFUBP4Bdf//AHP/4wXZB2sSJgAwAAAQBwFVBScBdf//AHP/4wXZB2sSJgAwAAAQBwFTBScBdf//AHP/4wXZB20SJgAwAAAQBwFWBScBdf//AHP/4wXZB14SJgAwAAAQBwFUBScBdf//AHP/4wXZB04SJgAwAAAQBwFSBScBdQABARkAPwWcBMUACwAACQIHCQEnCQE3CQEFnP43Acl3/jX+NXYByP44dgHLAcsETP41/jd5Acv+NXkByQHLef41AcsAAAMAZv+6BeUGFwAJABMAKwAACQEeATMyABE0JicuASMiABEUFhcHJgI1EAAhMhYXNxcHFhIVEAAhIiYnBycEtv0z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AjMAxQMfALADHwCkBAAAPQa0ANkCiwCeAuMAZAKLANsCsgAABRcAhwUXAOEFFwCWBRcAnAUXAGQFFwCeBRcAjwUXAKgFFwCLBRcAgQKyAPACsgCeBrQA2Qa0ANkGtADZBD8AkwgAAIcFeQAQBX0AyQWWAHMGKQDJBQ4AyQSaAMkGMwBzBgQAyQJcAMkCXP+WBT8AyQR1AMkG5wDJBfwAyQZMAHME0wDJBkwAcwWPAMkFFACHBOP/+gXbALIFeQAQB+kARAV7AD0E4//8BXsAXAMfALACsgAAAx8Axwa0ANkEAP/sBAAAqgTnAHsFFAC6BGYAcQUUAHEE7ABxAtEALwUUAHEFEgC6AjkAwQI5/9sEogC6AjkAwQfLALoFEgC6BOUAcQUUALoFFABxA0oAugQrAG8DIwA3BRIArgS8AD0GiwBWBLwAOwS8AD0EMwBYBRcBAAKyAQQFFwEABrQA2QQAANcEAADVBAABcwKLANsEAAEjBXkAEAV5ABAFeQAQBXkAEAV5ABAFeQAQB8sACAWWAHMFDgDJBQ4AyQUOAMkFDgDJAlwAOwJcAKICXP/+AlwABgYzAAoF/ADJBkwAcwZMAHMGTABzBkwAcwZMAHMGtAEZBkwAZgXbALIF2wCyBdsAsgXbALIE4//8BNcAyQUKALoE5wB7BOcAewTnAHsE5wB7BOcAewTnAHsH2wB7BGYAcQTsAHEE7ABxBOwAcQTsAHECOf/HAjkAkAI5/94COf/0BOUAcQUSALoE5QBxBOUAcQTlAHEE5QBxBOUAcQa0ANkE5QBIBRIArgUSAK4FEgCuBRIArgS8AD0FFAC6BLwAPQV5ABAE5wB7BXkAEATnAHsFeQAQBOcAewWWAHMEZgBxBZYAcwRmAHEFlgBzBGYAcQWWAHMEZgBxBikAyQUUAHEGMwAKBRQAcQUOAMkE7ABxBQ4AyQTsAHEFDgDJBOwAcQUOAMkE7ABxBQ4AyQTsAHEGMwBzBRQAcQYzAHMFFABxBjMAcwUUAHEGMwBzBRQAcQYEAMkFEv/lB1QAyQWPAHgCXP/kAjn/0wJcAAMCOf/yAlz/9QI5/+QCXACwAjkAlgJcAMkCOQDBBLgAyQRyAMECXP+WAjn/2wU/AMkEogC6BKIAugR1AMkCOQDBBHUAyQI5AIgEdQDJAwAAwQR1AMkCvADBBH//8gJGAAIF/ADJ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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/3AAAAAAAJgAAAAAAAAAA/9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9wAAAAA/5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/kAAA/9P/yQAAAAD+t/9h/0QAAAAAAAAAAAAAAAAAAAAA/9z/3AAAAAAAAAAAAAAAAP9EAAAAAP+QAAAAAP9rAAAAAP+3/2sAAAAA/5AAAAAAAAD/RAAAAAD/RP+QAAD/t/+Q/0T/RAAAAAAAAAAAAAAAAP+QAAAAAP9r/7cAAP/c/9z/kAAAAAAAAP9E/9MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/twAAAAAAAAAA/5oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9P/0wAAAAD/3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/7f/wQAA/7cAAAAA/9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/7f/wQAA/ykAAAAA/9wAAP+QAAAAAAAAAAD/kAAAAAD/Yf/JAAD/twAA/7cAAP/cAAAAAP+aAAAAAAAAAAAAAP+aAAAAAAAA/5oAAAAAAAD/awAA/5D/3P+aAAD/mv+aAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8H/wQAA/9wAAAAAAC8AAAAAAAAAAAAAAAD/twAAAAD+5v+a/x//RAAA/vAAAAAAAAAAAP/cAAAAAAAAAAAAAP/cAAAAAAAA/9wAAAAAAAD/RAAAAAAAAP/cAAD/3P/cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/mH95gAAADn/rf/c/9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9wAAP99/5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9P/3AAA/9P+wQAA/30AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9MAAP+kAAAAAP+3AAAAAP/TAAD/3P+3/9z/3AAA/9wAAAAAAAAAAAAAAAD/pP+3AAD/t//cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACYAJgAAADkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9P/3AAA/63/t//B/60AAP+aAAAAAAAAAAAAAAAAAAD/awAA/5D/rQAA/30AAP/TAAAAAP+kAAAAAAAAAAAAAP+kAAAAAAAA/6QAAAAAAAD/kAAA/5r/0/+kAAD/pP+kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/2v/fQAAAAAAAAAAACYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/0T/Df8f/2EAAP+IAAAAAAAAAAAAAAAAAAD/3AAAAAAAAAAAAAAAAP6t/qQAAP6kAAAAAP/BAAAAAP6k/tP+rQAA/skAAP6tAAD+wQAA/4j/Ef7gAAD+9P7nAAAAAP6kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/0wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4j++P9Z/30AAAAAAAAAAAAAAAD/3AAAAAAAAAAAAAAAAAAAAAAAAP9hAAAAAP9hAAAAAP/TAAAAAP9hAAAAAAAA/3UAAAAAAAD/yQAAAAD/Yf9hAAD/Yf91AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/63/Ff+I/5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP99AAAAAP+IAAAAAP/TAAAAAP+I/6QAAAAA/7cAAAAAAAD/3AAAAAD/ff+IAAD/iP+3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9wAAAAA/5oAAAAAAAAAAP9rAAAAAAAAAAD/fQAAAAD/3AAAAAAAAAAAAAAAAAAAAAAAAP+kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/2sAAP+kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/2H/rQAA/w3+Yf7w/2EAAP+QAAAAAAAAAAD/kAAAAAAAAAAAAAAAAAAAAAAAAP7mAAAAAP7wAAAAAP+3AAAAAP7wAAAAAAAA/xUAAAAAAAAAAAAA/5D+5v7wAAD+8P8VAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/5D/3AAA/9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9z/3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/5D/a/+3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/cAAAAAP/cAAD/3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/cAAAAAP+3AAAAAAAAAAAAAP+3AAAAAAAA/8EAAAAAAAD/twAAAAD/3P+3AAD/t//BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/2v/kAAAACb/3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/2v/twAA/33/RP/cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9P/3P/TAAD/3AAAAAD/3P/T/9wAAAAAAAAAAAAA/8kAAAAAAAAAAP/TAAD/0wAAAAAAAP/TAAAAAAAAAEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVgAA/8n/Yf+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/3AAAAAD/RP+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9wAAP/BAAAAAAAAAAAAAP/BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/BAAD/wQAAAAAAAP/cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9z+3P9rAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9P/3P/cADkAAP/cAAAAAP/cAAD/3P/cAAD/YQAA/33/kAAA/2EAAAAA/9z/3P/c/7cAAAAAAAAAAP/cAAAAAP/cAAD/iP+tAAD/dQAA/9wAAP/cAAD/3AAAADkAAP/c/9wAAP/c/9wAAP/c/9wAAAAA/9z/3P9hAAAAAP+Q/63/Yf91/vj/AwAA/9P/3P/cADkAAP/cAAAAAP/cAAD/3P/cAAD/YQAA/33/kAAA/2EAAAAA/9z/3P/c/7cAAAAAAAAAAP/cAAAAAP/cAAD/iP+tAAD/dQAA/9wAAP/cAAD/3AAAADkAAP/c/9wAAP/c/9wAAP/c/9wAAAAA/9z/3P9hAAAAAP+Q/63/Yf91/vj/AwAA/9P/3P/cADkAAP/cAAAAAP/cAAD/3P/cAAD/YQAA/33/kAAA/2EAAAAA/9z/3P/c/7cAAAAAAAAAAP/cAAAAAP/cAAD/iP+tAAD/dQAA/9wAAP/cAAD/3AAAADkAAP/c/9wAAP/c/9wAAP/c/9wAAAAA/9z/3P9hAAAAAP+Q/63/Yf91/vj/AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/63/pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJgAAAAD/a/+3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9wAAAAAACYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/5D/kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/6T/kAAA/9P/3P/cADkAAP/cAAAAAP/cAAD/3P/cAAD/YQAA/33/kAAA/2EAAAAA/9z/3P/c/7cAAAAAAAAAAP/cAAAAAP/cAAD/iP+tAAD/dQAAAAAAAP/cAAD/3AAAADkAAAAA/9wAAP/c/9z/3P/cAAAAAAAA/9z/3P9hAAAAAP+Q/63/Yf91/vj/AgAA/9P/3P/cADkAAP/cAAAAAP/cAAD/3P/cAAD/YQAA/33/kAAA/2EAAAAA/9z/3P/c/7cAAAAAAAAAAP/cAAAAAP/cAAD/iP+tAAAAAAAA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';
const _FONT_BOLD = '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AFMAVwBYAFoAZQBmAGcAaABpAGsAbAB1AHcAeAB5AHoAewB9AH4AfwCAAIEAggCFAIYAhwCIAIkAigCiAKQApQCnAKkAqwCtAK8AsQCzALUAwwDeAOIA5QDmAPkA+gD9AP4BAwEFAQkBEwEdASIBNAE2AAIAQAAiACIAAQAjACMAAgAkACQAAwAlACUABAAnACcABQAoACgABgAsACwABwAtAC0ACAAwADAACQAxADEACgAyADIACwAzADMADAA0ADQADQA1ADUADgA2ADYADwA3ADcAEAA4ADgAEQA5ADkAEgA6ADoAEwA7ADsAFABCAEIAFQBHAEcAFgBMAEwAFwBTAFMAGABXAFcAGQBYAFgAGgBaAFoAGwBlAGkAAQBrAGsAFABsAGwAAwB1AHUABAB3AHsACQB9AH0AHAB+AIEADwCCAIIAEwCFAIoAFQCiAKIAGwCkAKQAGwClAKUAAQCnAKcAAQCpAKkAHQCrAKsAAwCtAK0AAwCvAK8AAwCxALEAAwCzALMABAC1ALUABADDAMMABgDeAN4ACADiAOIACADlAOUAHgDmAOYAHwD5APkADAD6APoAGAD9AP0ADAD+AP4AGAEDAQMADQEFAQUADQEJAQkAIAETARMADwEdAR0AEwEiASIAFAE0ATQAIQE2ATYAIgACAGMADQANAAEADgAOAAIADwAPAAMAGwAcAAQAIgAiAAUAJAAkAAYAKwArAAcAMAAwAAgANAA0AAkANQA1AAoANgA2AAsANwA3AAwAOAA4AA0AOQA5AA4AOgA6AA8AQgBCABAARABEABEARgBGABIASgBKABMATQBNABQAUABQABUAUwBTABYAVABUABcAVgBWABgAVwBXABkAWABYABoAWgBaABsAZQBpAAUAawBrABwAbABsAAYAdwB7AAgAfQB9AB0AfgCBAAsAggCCAA8AhQCFAB4AhgCGABAAhwCKAB4AiwCLAB8AjACMABEAjQCNACAAjgCOABIAjwCQACAAlwCXACEAmACYABUAmQCbACEAnQCdACIAngCeACMAnwCfABgAoAChACMAogCiABsApACkABsApQClACQApgCmACUApwCnACQAqACoACUAqQCpACQAqgCqACUAqwCrAAYArACsABEAsQCxAAYAsgCyABEAuAC4ACYAugC6ACYAvAC8ACYAvgC+ACYAwADAABIA8gDyACYA9AD0ACYA9gD2ACYA9wD3ACcA+AD4ACgA+gD6ABYA/AD8ACkA/gD+ABYA/wD/ACoBAQEBACoBAwEDAAkBBAEEABcBBQEFAAkBBgEGABcBBwEHACsBCQEJACwBDQENAC0BDgEOAC4BDwEPAC0BEAEQAC4BEQERAC0BEgESAC4BEwETAAsBFAEUABgBFQEVAC0BFgEWAC4BGAEYAC4BGQEZAC8BGwEbADABHAEcADEBHQEdAA8BNQE1ADIBNwE3ADMAAQAAAAoAzADmABRERkxUAHphcmFiAL5hcm1uAL5icmFpAL5jYW5zAL5jaGVyAL5jeXJsAL5nZW9yAL5ncmVrAL5oYW5pAL5oZWJyAL5rYW5hAL5sYW8gAL5sYXRuAIRtYXRoAL5ua28gAL5vZ2FtAL5ydW5yAL50Zm5nAL50aGFpAL4ABAAAAAD//wAAACgABklTTSAAMEtTTSAAMExTTSAAME5TTSAAMFNLUyAAMFNTTSAAMAAA//8AAQAAAAD//wACAAAAAQAAAAAAAmxpZ2EADmxvY2wAFAAAAAEAAQAAAAEAAAACAAYAGgABAAAAAQAIAAEABgBZAAEAAQDvAAQAAAABAAgAAQA2AAEACAAFAAwAFAAcACIAKAE9AAMARwBNATwAAwBHAEoBOwACAE0BOgACAEoBOQACAEcAAQABAEc=';
let _PF = 'DejaVuSans'; // Font her zaman hazır
const tx = (v) => ts(v); // Global alias — tüm PDF fonksiyonları kullanır

async function loadTurkishFont() {
  return true; // Font embed edildi, yükleme gerekmez
}

function registerFontIfAvailable(doc) {
  try {
    doc.addFileToVFS('DejaVuSans.ttf', _FONT_REGULAR);
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', _FONT_BOLD);
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold');
    return 'DejaVuSans';
  } catch(e) {
    return 'helvetica';
  }
}

// PDF'i oluştur ve sayfada indirme linki göster
async function preparePdfLink(sName, btn) {
  const origText = btn ? btn.textContent : '';
  if (btn) { btn.textContent = '⏳ Hazırlanıyor...'; btn.disabled = true; }
  try {
    const doc = exportStudentDetailPDF(sName);
    if (!doc) { if(btn){btn.textContent=origText;btn.disabled=false;} return; }
    const ov = window._pdfDateOverride;
    const period = ov?.label || studentAnalysisPeriod || 'haftalik';
    const fname = ts(sName.replace(/\s+/g,'_')) + '_' + period + '_' + getTodayKey() + '.pdf';
    // Direkt indir — yeşil buton yok
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fname;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast('📄', 'PDF indiriliyor!');
  } catch(e) {
    showToast('❌','Hata: '+e.message);
  } finally {
    if (btn) { btn.textContent = origText; btn.disabled = false; }
  }
}

function pdfDownload(doc, fname) {
  try { doc.save(fname); } catch(e) {}
}

// ============================================================
// ORTAK ÇİZİM YARDIMCILARI
// ============================================================
function pdfNewPage(doc) { doc.addPage(); return 20; }
function pdfCheck(doc, Y, needed) { return Y + needed > 268 ? pdfNewPage(doc) : Y; }

function pdfDrawLogo(doc, x, y, size) {
  const r = size * 0.26;
  // Arka plan — gradient simülasyonu: mor → turkuaz
  doc.setFillColor(108,99,255); doc.roundedRect(x, y, size, size, r, r, 'F');
  doc.setFillColor(76,180,240); doc.roundedRect(x+size*0.5, y, size*0.5, size, r, r, 'F');
  doc.setFillColor(92,90,255); doc.roundedRect(x, y, size*0.6, size, r, r, 'F');

  // Bar chart — 3 yükselen sütun (opasite yok, doğrudan renk)
  const bw = size * 0.15;
  const bottom = y + size * 0.87;
  const bx1 = x + size * 0.14, h1 = size * 0.30;
  const bx2 = x + size * 0.36, h2 = size * 0.50;
  const bx3 = x + size * 0.58, h3 = size * 0.70;
  const br = 0.7;
  // Bar 1 — koyu beyaz
  doc.setFillColor(200,195,255); doc.roundedRect(bx1, bottom-h1, bw, h1, br, br, 'F');
  // Bar 2 — orta beyaz
  doc.setFillColor(225,222,255); doc.roundedRect(bx2, bottom-h2, bw, h2, br, br, 'F');
  // Bar 3 — tam beyaz
  doc.setFillColor(255,255,255); doc.roundedRect(bx3, bottom-h3, bw, h3, br, br, 'F');
  // Ok — sağ üst
  const ax = x + size*0.83, ay = y + size*0.17;
  doc.setDrawColor(255,255,255); doc.setLineWidth(0.65);
  doc.line(ax, ay+size*0.13, ax, ay);
  doc.line(ax-size*0.09, ay+size*0.09, ax, ay);
  doc.line(ax+size*0.09, ay+size*0.09, ax, ay);
  doc.setLineWidth(0.3);
}

function pdfHeader(doc, title, subtitle, dateStr) {
  doc.setFillColor(255,255,255); doc.rect(0,0,210,297,'F');
  // Üst şerit (32mm)
  doc.setFillColor(72,58,180); doc.rect(0,0,210,32,'F');
  doc.setFillColor(72,200,130); doc.rect(0,30.2,210,1.8,'F');

  // Sol: Logo ikonu (7,4) boyut 22mm → 7+22=29mm bitiyor
  pdfDrawLogo(doc, 7, 4, 22);

  // Sol: LGSKoç yazısı x=32'den başlıyor, ~55mm'de bitiyor
  doc.setFont(_PF,'bold'); doc.setFontSize(11); doc.setTextColor(255,255,255);
  doc.text('LGS', 32, 13);
  doc.setTextColor(180,225,255);
  doc.text('Ko\u00e7', 43, 13);
  doc.setFont(_PF,'normal'); doc.setFontSize(5.5); doc.setTextColor(76,201,240);
  doc.text('O\u011frenci Takip', 32, 19);

  // Sağ üst: rapor tarihi — 203mm sağdan
  doc.setFont(_PF,'normal'); doc.setFontSize(6); doc.setTextColor(180,175,230);
  doc.text(tx(dateStr), 203, 8, {align:'right'});

  // Orta merkez: logo bölgesi 55mm, tarih alanı ~25mm → kullanılabilir 55-185mm → merkez 120mm
  const cx = 120;

  // title formatı: "Test Öğrenci — 9 Mart - 15 Mart 2026 Haftalık Rapor"
  //            ya: "Test Öğrenci — Mart 2026 Aylık Rapor"
  const tRaw = tx(title);
  const dashIdx = tRaw.indexOf(' \u2014 ');
  // Öğrenci adını önce orijinalden al (tx öncesi), büyük harfe çevir, sonra tx uygula
  const titleOrig = String(title);
  const dashIdxOrig = titleOrig.indexOf(' \u2014 ');
  const studentNameOrig = dashIdxOrig > -1 ? titleOrig.substring(0, dashIdxOrig) : titleOrig;
  const studentName = tx(studentNameOrig.toLocaleUpperCase('tr-TR'));
  const afterDash = dashIdx > -1 ? tRaw.substring(dashIdx + 3) : '';

  // Rapor tipini bul
  const typeMatch = afterDash.match(/(Haftal\u0131k|Ayl\u0131k|G\u00fcnl\u00fck)/);
  const reportType = typeMatch ? typeMatch[0] : 'Haftalık';

  // Satır 2 ve 3 için içeriği belirle
  let line2 = '', line3 = '';

  if (reportType === 'Aylık') {
    // "Mart 2026 Aylık Rapor" → "MART AYLIK RAPORU" tek satır, 3. satır boş
    const monthMatch = afterDash.match(/^([A-Za-zığüşöçİĞÜŞÖÇ]+)\s+\d{4}/);
    const monthName = monthMatch ? monthMatch[1].toLocaleUpperCase('tr-TR') : '';
    line2 = monthName ? monthName + ' AYLIK RAPORU' : 'AYLIK RAPOR';
    line3 = '';
  } else if (reportType === 'Günlük') {
    line2 = 'GÜNLÜK RAPOR';
    // tarih aralığı = dateStr
    line3 = tx(dateStr);
  } else {
    // Haftalık: "16 Mart – 22 Mart 2026 Haftalık Raporu" → tarih aralığını çıkar
    line2 = 'HAFTALIK RAPOR';
    const dateRangePart = afterDash.replace(/Haftal\u0131k.*$/,'').trim();
    // Yıl ve "Raporu" kısmını kaldır, sadece tarih aralığını bırak
    const yearRemoved = dateRangePart.replace(/\s*\d{4}\s*$/,'').trim();
    line3 = yearRemoved;
  }

  // Satır 1: Öğrenci adı — büyük, beyaz, kalın
  doc.setFont(_PF,'bold'); doc.setFontSize(10.5); doc.setTextColor(255,255,255);
  doc.text(studentName, cx, line3 ? 8 : 11, {align:'center'});

  // Subtitle satırı: "PSİKOLOJİK TAKİP RAPORU" gibi — öğrenci adından hemen sonra
  const showSubtitle = subtitle && subtitle.includes('PSİKOLOJİK');
  if (showSubtitle) {
    doc.setFont(_PF,'bold'); doc.setFontSize(5.5); doc.setTextColor(72,220,160);
    doc.text(tx(subtitle).toLocaleUpperCase('tr-TR'), cx, line3 ? 13.5 : 16.5, {align:'center'});
    // Rapor türü
    doc.setFont(_PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(180,175,230);
    doc.text(line2, cx, line3 ? 19 : 22, {align:'center'});
    if (line3) {
      doc.setFont(_PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(140,135,200);
      doc.text(line3, cx, 25, {align:'center'});
    }
  } else {
    // Normal rapor: subtitle yok
    doc.setFont(_PF,'bold'); doc.setFontSize(7.5); doc.setTextColor(180,175,230);
    doc.text(line2, cx, line3 ? 17 : 21, {align:'center'});
    if (line3) {
      doc.setFont(_PF,'normal'); doc.setFontSize(6.5); doc.setTextColor(140,135,200);
      doc.text(line3, cx, 24, {align:'center'});
    }
  }

  return 38;
}

function pdfFooter(doc, totalPages, subtitle) {
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(90,72,200); doc.rect(0,287,210,10,'F');
    doc.setFillColor(72,200,130); doc.rect(0,287,210,1.2,'F');
    doc.setFont(_PF,'normal'); doc.setFontSize(7); doc.setTextColor(210,205,255);
    doc.text('LGSKoç — ' + tx(subtitle), 14, 293);
    doc.text('Sayfa ' + p + ' / ' + totalPages, 196, 293, {align:'right'});
  }
}

function pdfSecHeader(doc, title, Y, r=90, g=72, b=200) {
  Y = pdfCheck(doc, Y, 80); // Başlık + altındaki içerik için geniş güvenli tampon
  // Yumuşak renk + sol çizgi aksanı
  doc.setFillColor(Math.min(255,Math.round(r*0.12+255*0.88)),Math.min(255,Math.round(g*0.12+255*0.88)),Math.min(255,Math.round(b*0.12+255*0.88))); doc.roundedRect(14,Y,182,8,1.5,1.5,'F');
  doc.setFillColor(r,g,b); doc.roundedRect(14,Y,3,8,1,1,'F');
  doc.setDrawColor(193,184,230); doc.setLineWidth(0.3); doc.roundedRect(14,Y,182,8,1.5,1.5,'S');
  doc.setFont(_PF,'bold'); doc.setFontSize(9.5); doc.setTextColor(r,g,b);
  doc.text(tx(title), 20, Y+5.6);
  return Y+12;
}

function pdfSubHeader(doc, text, Y) {
  // Not: pdfBarChart/pdfLineChart çağrısından önce zaten pdfCheck yapılıyor
  doc.setFont(_PF,'bold'); doc.setFontSize(8.5); doc.setTextColor(80,65,180);
  doc.text(tx(text), 14, Y); return Y+6;
}

function pdfTable(doc, headers, colWidths, rows, Y, hdrColor=[90,72,200], altRow=true) {
  Y = pdfCheck(doc, Y, 10);
  let cx = 14;
  // Header — orta yoğunluk (yazıcıya uygun)
  const [hr,hg,hb] = hdrColor;
  doc.setFillColor(hr,hg,hb); doc.rect(cx,Y,colWidths.reduce((a,w)=>a+w,0),6.5,'F');
  doc.setFont(_PF,'bold'); doc.setFontSize(7); doc.setTextColor(255,255,255);
  cx=14;
  headers.forEach((h,i) => { doc.text(tx(h), cx+colWidths[i]/2, Y+4.5, {align:'center'}); cx+=colWidths[i]; });
  Y+=6.5;
  rows.forEach((row,ri) => {
    Y = pdfCheck(doc, Y, 5.5);
    cx=14;
    // Çok açık alternatif satır
    doc.setFillColor(ri%2===0?250:255, ri%2===0?249:255, ri%2===0?255:255);
    const totalW = colWidths.reduce((a,w)=>a+w,0);
    doc.rect(14,Y,totalW,5.5,'F');
    doc.setDrawColor(220,215,245); doc.setLineWidth(0.15);
    doc.rect(14,Y,totalW,5.5,'S');
    doc.setTextColor(35,30,75); doc.setFont(_PF,'normal'); doc.setFontSize(7); cx=14;
    row.forEach((v,i) => {
      doc.text(tx(String(v??'')), cx+colWidths[i]/2, Y+4, {align:'center'});
      cx+=colWidths[i];
    });
    Y+=5.5;
  });
  return Y+3;
}

function pdfBarChart(doc, values, labels, Y, chartH, colors, title) {
  const titleH = title ? 10 : 0;
  Y = pdfCheck(doc, Y, chartH + titleH + 16);
  if (title) { Y = pdfSubHeader(doc, title, Y); }
  const maxV = Math.max(...values.map(v=>Math.abs(v)), 1);
  const startX = 22, W = 172;
  const n = values.length;
  const barW = Math.min(Math.floor(W/n)-2, 14);
  const gap = (W - barW*n) / (n+1);
  const baseY = Y + chartH - 8;
  // Hafif grid
  doc.setDrawColor(220,215,240); doc.setLineWidth(0.15);
  doc.line(startX, Y, startX, Y+chartH-8);
  doc.line(startX, Y+chartH-8, startX+W, Y+chartH-8);
  [0.25,0.5,0.75,1].forEach(f => {
    const gy = Y+(chartH-8)*(1-f);
    doc.setDrawColor(235,230,248); doc.line(startX,gy,startX+W,gy);
    doc.setFontSize(5); doc.setTextColor(160,150,190);
    doc.text(String(Math.round(maxV*f)), startX-1, gy+1.5, {align:'right'});
  });
  values.forEach((v,i) => {
    const bh = Math.max((Math.abs(v)/maxV)*(chartH-10), 1.5);
    const x = startX + gap + i*(barW+gap);
    const by = baseY - bh;
    const col = typeof colors[i%colors.length] === 'function' ? colors[i%colors.length](v) : colors[i%colors.length];
    const [r,g,b] = col;
    // Yumuşak gölge — açık ton
    const rl=Math.min(255,Math.round(r*0.15+255*0.85)), gl2=Math.min(255,Math.round(g*0.15+255*0.85)), bl2=Math.min(255,Math.round(b*0.15+255*0.85));
    doc.setFillColor(rl,gl2,bl2); doc.roundedRect(x+0.5,by+0.5,barW,bh,0.8,0.8,'F');
    // Asıl bar — biraz daha açık (%75 doygunluk)
    const rm=Math.min(255,Math.round(r*0.75+255*0.25)), gm=Math.min(255,Math.round(g*0.75+255*0.25)), bm=Math.min(255,Math.round(b*0.75+255*0.25));
    doc.setFillColor(rm,gm,bm); doc.roundedRect(x,by,barW,bh,0.8,0.8,'F');
    doc.setFontSize(5); doc.setFont(_PF,'bold'); doc.setTextColor(r,g,b);
    if(v!==0) doc.text(String(v), x+barW/2, Math.max(by-1,Y+1.5), {align:'center'});
    doc.setFontSize(5); doc.setTextColor(110,100,150); doc.setFont(_PF,'normal');
    doc.text(tx(String(labels[i]||'')), x+barW/2, Y+chartH-2, {align:'center'});
  });
  // Trend çizgisi — kırmızı yerine turuncu, daha yumuşak
  if (values.length > 1) {
    doc.setDrawColor(200,80,40); doc.setLineWidth(0.45);
    const pts = values.map((v,i) => ({
      x: startX + gap + i*(barW+gap) + barW/2,
      y: baseY - Math.max((Math.abs(v)/maxV)*(chartH-10),1.5)
    }));
    for(let i=0;i<pts.length-1;i++) doc.line(pts[i].x,pts[i].y,pts[i+1].x,pts[i+1].y);
    pts.forEach(p => { doc.setFillColor(200,80,40); doc.circle(p.x,p.y,0.9,'F'); });
  }
  return Y + chartH + 3;
}

function pdfLineChart(doc, values, labels, Y, chartH, color, title) {
  const titleH = title ? 10 : 0;
  Y = pdfCheck(doc, Y, chartH + titleH + 16);
  if (title) { Y = pdfSubHeader(doc, title, Y); }
  const maxV = Math.max(...values.map(Math.abs), 1);
  const startX = 22, W = 172;
  const n = values.length;
  const stepX = n>1 ? W/(n-1) : W;
  const baseY = Y + chartH - 8;
  const [cr,cg,cb] = color;
  doc.setDrawColor(220,215,240); doc.setLineWidth(0.15);
  doc.line(startX,Y,startX,Y+chartH-8); doc.line(startX,Y+chartH-8,startX+W,Y+chartH-8);
  [0.25,0.5,0.75,1].forEach(f => {
    const gy=Y+(chartH-8)*(1-f);
    doc.setDrawColor(235,230,248); doc.line(startX,gy,startX+W,gy);
    doc.setFontSize(5); doc.setTextColor(160,150,190);
    doc.text(String(Math.round(maxV*f)), startX-1, gy+1.5, {align:'right'});
  });
  const pts = values.map((v,i) => ({x:startX+i*stepX, y:baseY-(Math.abs(v)/maxV)*(chartH-10)}));
  if(pts.length>1) {
    doc.setDrawColor(cr,cg,cb); doc.setLineWidth(0.7);
    for(let i=0;i<pts.length-1;i++) doc.line(pts[i].x,pts[i].y,pts[i+1].x,pts[i+1].y);
  }
  pts.forEach((p,i) => {
    doc.setFillColor(cr,cg,cb); doc.circle(p.x,p.y,1,'F');
    doc.setFontSize(5); doc.setFont(_PF,'bold'); doc.setTextColor(cr,cg,cb);
    if(values[i]!==0) doc.text(String(values[i]),p.x,p.y-1.8,{align:'center'});
    doc.setFontSize(4.5); doc.setTextColor(110,100,150); doc.setFont(_PF,'normal');
    doc.text(tx(String(labels[i]||'')),p.x,Y+chartH-1.5,{align:'center'});
  });
  return Y+chartH+3;
}

function pdfHorizBar(doc, label, value, maxVal, Y, barH=5, color=[72,52,212]) {
  const labelW=50, valW=18, barW=182-labelW-valW-4;
  doc.setFont(_PF,'normal'); doc.setFontSize(7); doc.setTextColor(40,35,80);
  doc.text(tx(String(label).substring(0,28)), 14, Y+barH-0.8);
  doc.setFillColor(225,222,248); doc.roundedRect(14+labelW, Y, barW, barH, barH/2, barH/2,'F');
  const fillW = maxVal>0 ? Math.max((value/maxVal)*barW,1) : 0;
  doc.setFillColor(...color); doc.roundedRect(14+labelW, Y, fillW, barH, barH/2, barH/2,'F');
  doc.setFont(_PF,'bold'); doc.setFontSize(7); doc.setTextColor(...color);
  doc.text(String(value), 14+labelW+barW+2, Y+barH-0.8);
  return Y+barH+2.5;
}

function pdfInfoBox(doc, text, Y, bgColor=[240,238,255], textColor=[50,40,140]) {
  Y = pdfCheck(doc, Y, 10);
  const lines = doc.splitTextToSize(tx(text), 174);
  const h = lines.length*5+6;
  doc.setFillColor(...bgColor); doc.roundedRect(14,Y,182,h,2,2,'F');
  doc.setDrawColor(...textColor,30); doc.setLineWidth(0.3); doc.roundedRect(14,Y,182,h,2,2,'S');
  doc.setFont(_PF,'normal'); doc.setFontSize(8); doc.setTextColor(...textColor);
  lines.forEach((l,i) => doc.text(tx(l),16,Y+5+i*5));
  return Y+h+4;
}

// ============================================================
// ANA PDF FONKSİYONU — exportStudentDetailPDF
// ============================================================

// exportStudentDetailPDF
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
      const dRows=den.subR.map(s=>{ const det=den.detail?den.detail.find(x=>x.name===s.name):null; return [s.name,s.d,s.y,s.net.toFixed(2),det?det.kat:'—',det?det.puan:'—']; });
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

