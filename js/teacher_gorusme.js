function showPsychReport(sName) {
  selectedStudentName = sName;
  window._psychPeriod = 'daily';
  showPage('psych-report');
}

function openGorusmeModal(sName, sUid) {
  const existing = document.getElementById('_gorusmeModal');
  if (existing) existing.remove();
  const now = new Date();
  // Seçili tarih state
  let seciliYil = now.getFullYear();
  let seciliAy  = now.getMonth();
  let seciliGun = now.getDate();

  function takvimHtml(yil, ay, secGun) {
    const ayAdlari = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    const ilkGun = new Date(yil, ay, 1).getDay(); // 0=Pazar
    const pazartesiOffset = ilkGun === 0 ? 6 : ilkGun - 1;
    const sonGun = new Date(yil, ay + 1, 0).getDate();
    let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <button onclick="gorusmeTakvimAy(-1)" style="background:none;border:none;color:var(--text);font-size:1.2rem;cursor:pointer;padding:4px 10px">‹</button>
      <div style="font-weight:700;font-size:0.9rem">${ayAdlari[ay]} ${yil}</div>
      <button onclick="gorusmeTakvimAy(1)" style="background:none;border:none;color:var(--text);font-size:1.2rem;cursor:pointer;padding:4px 10px">›</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:4px">
      ${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(g=>`<div style="text-align:center;font-size:0.65rem;color:var(--text2);padding:3px 0;font-weight:700">${g}</div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">`;
    for (let i = 0; i < pazartesiOffset; i++) html += `<div></div>`;
    for (let g = 1; g <= sonGun; g++) {
      const isSecili = g === secGun;
      const isToday  = g === now.getDate() && ay === now.getMonth() && yil === now.getFullYear();
      html += `<button onclick="gorusmeTakvimGun(${g})"
        style="aspect-ratio:1;border-radius:50%;border:none;cursor:pointer;font-size:0.78rem;font-weight:${isSecili||isToday?'800':'400'};
               background:${isSecili?'var(--accent)':'transparent'};
               color:${isSecili?'#fff':isToday?'var(--accent)':'var(--text)'}">${g}</button>`;
    }
    html += `</div>`;
    return html;
  }

  function tarihStr(y, m, d) {
    const ayAdlari = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    return `${d} ${ayAdlari[m]} ${y}`;
  }

  const modal = document.createElement('div');
  modal.id = '_gorusmeModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  function render() {
    modal.innerHTML = `
    <div style="background:var(--surface);border-radius:20px 20px 0 0;padding:22px 18px 36px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto">
      <div style="font-weight:800;font-size:1rem;margin-bottom:16px">🗣️ Görüşme Kaydı — ${sName.split(' ')[0]}</div>

      <!-- Tarih seçici -->
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">📅 Görüşme Tarihi</div>
      <div id="_gorusmeTakvimWrap" style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:12px">
        ${takvimHtml(seciliYil, seciliAy, seciliGun)}
      </div>
      <div style="text-align:center;font-size:0.82rem;font-weight:700;color:var(--accent);margin-bottom:12px">
        Seçilen: ${tarihStr(seciliYil, seciliAy, seciliGun)}
      </div>

      <!-- Durum -->
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">Durum</div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button id="_gBtn_yapildi" onclick="
          document.getElementById('_gorusmeDurum').value='yapildi';
          this.style.background='var(--accent)';this.style.color='#fff';this.style.borderColor='var(--accent)';
          document.getElementById('_gBtn_planlandi').style.background='transparent';document.getElementById('_gBtn_planlandi').style.color='var(--text2)';document.getElementById('_gBtn_planlandi').style.borderColor='var(--border)'"
          style="flex:1;padding:9px;border-radius:10px;background:var(--accent);border:1.5px solid var(--accent);color:#fff;font-weight:700;font-size:0.82rem;cursor:pointer">✅ Görüşme Yapıldı</button>
        <button id="_gBtn_planlandi" onclick="
          document.getElementById('_gorusmeDurum').value='planlandi';
          this.style.background='var(--accent)';this.style.color='#fff';this.style.borderColor='var(--accent)';
          document.getElementById('_gBtn_yapildi').style.background='transparent';document.getElementById('_gBtn_yapildi').style.color='var(--text2)';document.getElementById('_gBtn_yapildi').style.borderColor='var(--border)'"
          style="flex:1;padding:9px;border-radius:10px;background:transparent;border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">📅 Planlandı</button>
      </div>
      <input type="hidden" id="_gorusmeDurum" value="yapildi">

      <!-- Not -->
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">Görüşme Notu (opsiyonel)</div>
      <textarea id="_gorusmeNot" placeholder="Görüşme içeriği, öğrencinin durumu, alınan kararlar..."
        style="width:100%;padding:9px 12px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:0.85rem;resize:none;height:80px;box-sizing:border-box;outline:none;margin-bottom:16px;font-family:inherit"></textarea>

      <div style="display:flex;gap:8px">
        <button onclick="saveGorusme('${sName}','${sUid}')"
          style="flex:1;padding:12px;border-radius:12px;background:var(--accent);border:none;color:#fff;font-weight:800;font-size:0.92rem;cursor:pointer">💾 Kaydet</button>
        <button onclick="document.getElementById('_gorusmeModal').remove()"
          style="padding:12px 16px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);color:var(--text2);font-weight:700;cursor:pointer">İptal</button>
      </div>
    </div>`;
  }

  // Global fonksiyonlar — takvim navigasyonu
  window.gorusmeTakvimAy = (yon) => {
    seciliAy += yon;
    if (seciliAy > 11) { seciliAy = 0; seciliYil++; }
    if (seciliAy < 0)  { seciliAy = 11; seciliYil--; }
    render();
  };
  window.gorusmeTakvimGun = (gun) => {
    seciliGun = gun;
    render();
    // Seçili tarihi hidden input'a yaz
    window._gorusmeTarihVal = { y: seciliYil, m: seciliAy, d: gun };
  };

  window._gorusmeTarihVal = { y: seciliYil, m: seciliAy, d: seciliGun };

  document.body.appendChild(modal);
  render();
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
}

async function saveGorusme(sName, sUid) {
  const durum = document.getElementById('_gorusmeDurum').value;
  const not = document.getElementById('_gorusmeNot').value.trim();
  const tv = window._gorusmeTarihVal || {};
  const ayAdlari = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const tarih = tv.d ? `${tv.d} ${ayAdlari[tv.m]} ${tv.y}` : new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
  const sObj = students.find(s=>s.name===sName) || {};
  const uid = sUid || sObj.uid || '';
  if (!uid) { showToast('⚠️','Öğrenci UID bulunamadı'); return; }
  const yeniGorusme = { tarih, durum, not, olusturma: new Date().toISOString() };
  try {
    const snap = await db.collection('wellness').doc(uid).get();
    const eskiData = snap.exists ? snap.data() : {};
    const mevcut = eskiData.gorusmeler || [];
    mevcut.push(yeniGorusme);
    const yeniData = { ...eskiData, gorusmeler: mevcut };
    await db.collection('wellness').doc(uid).set({ gorusmeler: mevcut }, { merge: true });
    // localStorage'ı da güncelle — render anında güncel veri gelsin
    localStorage.setItem('wellness_'+uid, JSON.stringify(yeniData));
    document.getElementById('_gorusmeModal').remove();
    showToast('✅', 'Görüşme kaydedildi!');
    renderTeacherPage('psych-report', document.getElementById('mainContent'));
  } catch(e) {
    showToast('❌', 'Hata: ' + e.message);
  }
}

async function deleteGorusme(sName, sUid, idx) {
  const ok = await appConfirm('Görüşmeyi Sil', 'Bu görüşme kaydını silmek istediğinize emin misiniz?', true);
  if (!ok) return;
  const sObj = students.find(s=>s.name===sName) || {};
  const uid = sUid || sObj.uid || '';
  if (!uid) { showToast('⚠️','Öğrenci UID bulunamadı'); return; }
  try {
    const snap = await db.collection('wellness').doc(uid).get();
    const mevcut = snap.exists ? (snap.data().gorusmeler || []) : [];
    mevcut.splice(idx, 1);
    await db.collection('wellness').doc(uid).set({ gorusmeler: mevcut }, { merge: true });
    showToast('🗑️', 'Görüşme silindi!');
    renderTeacherPage('psych-report', document.getElementById('mainContent'));
  } catch(e) {
    showToast('❌', 'Hata: ' + e.message);
  }
}

async function psychReportPage() {
  const sName = selectedStudentName;
  const sObj = students.find(s=>s.name===sName) || {};
  const sUid = sObj.uid || '';
  const data = await getWellnessData(sUid || sName);
  const days = data.days || {};
  const period = window._psychPeriod || 'daily';

  // Dönem filtresi
  const now = new Date();
  const todayKey = getDateKey(now);
  let startKey, endKey;
  if (period === 'daily') {
    startKey = todayKey; endKey = todayKey;
  } else if (period === 'weekly') {
    const mon = new Date(now); mon.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
    startKey = mon.toISOString().split('T')[0];
    const sun = new Date(mon); sun.setDate(mon.getDate()+6);
    endKey = sun.toISOString().split('T')[0];
  } else {
    startKey = todayKey.substring(0,7)+'-01'; endKey = todayKey;
  }
  const sortedDays = Object.keys(days).filter(k=>k>=startKey&&k<=endKey).sort().reverse();
  const allSortedDays = Object.keys(days).sort().reverse().slice(0,30);

  const moodLabels = { excited:'Heyecanlı', good:'İyiyim', focused:'Odaklı', ok:'İdare Eder', tired:'Yorgunum', anxious:'Kaygılı', sad:'Mutsuzum' };
  const moodEmojis = { excited:'🔥', good:'😊', focused:'🎯', ok:'😐', tired:'😔', anxious:'😰', sad:'😢' };
  const moodColors = { excited:'#f9ca24', good:'#45b7d1', focused:'#6c63ff', ok:'#a29bfe', tired:'#fd79a8', anxious:'#ff6b6b', sad:'#778ca3' };
  const alertMoods = ['sad','anxious','tired'];

  // İstatistikler (dönem)
  const validDays = sortedDays.filter(k=>days[k]);
  // 3 gün ART ARDA olumsuz duygu kontrolü (son 30 günün sıralı verilerinde)
  const sortedAll30 = Object.keys(days).filter(k=>{
    const d=new Date(k+'T12:00:00'); return (new Date()-d)<=30*24*60*60*1000;
  }).sort().reverse(); // en yeni önce
  let artArdaOlumsuz = 0, maxArtArda = 0;
  sortedAll30.forEach(k=>{
    if(days[k]&&alertMoods.includes(days[k].mood)){artArdaOlumsuz++;maxArtArda=Math.max(maxArtArda,artArdaOlumsuz);}
    else{artArdaOlumsuz=0;}
  });
  // Şu an devam eden ardışık olumsuz gün sayısı
  let suankiArtArda = 0;
  for(const k of sortedAll30){
    if(days[k]&&alertMoods.includes(days[k].mood)) suankiArtArda++;
    else break;
  }
  const alertDays = suankiArtArda; // aktif ardışık olumsuz gün sayısı

  // Bugünkü duygu verisi (günlük sekme için)
  const todayMood = days[todayKey]?.mood || null;
  const todayMoodLabel = moodLabels[todayMood] || null;
  const todayMoodEmoji = moodEmojis[todayMood] || null;
  const todayMoodColor = moodColors[todayMood] || null;

  const avg = (field) => {
    const vals = validDays.map(k=>parseFloat(days[k][field])||0).filter(v=>v>0);
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : '-';
  };

  // Psikolojik ısı haritası — son 30 gün (max-width grid)
  const heatMapDays = Array.from({length:30},(_,i)=>{
    const d=new Date(now); d.setDate(now.getDate()-29+i);
    const dk=getDateKey(d);
    const dayData=days[dk]||{};
    const mood=dayData.mood;
    const col=mood?moodColors[mood]:'transparent';
    const hasData=!!mood;
    return {dk,col,hasData,emoji:moodEmojis[mood]||'',label:d.getDate()};
  });

  // Görüşmeler
  const gorusmeler = Array.isArray(data.gorusmeler) ? data.gorusmeler : [];
  // Görüşme yapıldıysa uyarı kalkıyor
  const gorusmYapildi = gorusmeler.some(g => g.durum === 'yapildi');

  // Uyarı banner
  // - Görüşme yapıldıysa: tamamen boş
  // - 3+ gün art arda olumsuz: kırmızı uyarı (tüm sekmeler)
  // - Günlük sekme: bugünün duygu durumu renk bandı
  // - Diğer durumlar: boş
  let alertHtml = '';
  if (!gorusmYapildi && alertDays >= 3) {
    // 3+ gün art arda olumsuz → uyarı (tüm sekmeler)
    alertHtml = `<div style="background:#ff6b6b22;border:1.5px solid #ff6b6b66;border-radius:12px;padding:14px;margin-bottom:14px">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <span>⚠️</span>
        <div style="flex:1">
          <div style="font-weight:800;color:#ff6b6b;margin-bottom:3px">Psikolojik Uyarı</div>
          <div style="font-size:0.82rem">${sName.split(' ')[0]} ${alertDays} gün art arda olumsuz duygu bildirdi. Görüşme önerilir.</div>
        </div>
        <button onclick="openGorusmeModal('${sName}','${sUid}')"
          style="padding:7px 12px;border-radius:9px;background:#ff6b6b;border:none;color:#fff;font-size:0.78rem;font-weight:700;cursor:pointer;white-space:nowrap">
          ✅ Görüşme Yap
        </button>
      </div>
    </div>`;
  } else if (period === 'daily' && todayMood && days[todayKey]?.mood) {
    // Günlük sekmede sadece bugüne ait veri varsa duygu bandı göster
    alertHtml = `<div style="background:${todayMoodColor}22;border:1.5px solid ${todayMoodColor}66;border-radius:12px;padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
      <span style="font-size:1.3rem">${todayMoodEmoji}</span>
      <div style="font-weight:700;color:${todayMoodColor};font-size:0.88rem">${todayMoodLabel}</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-left:4px">— Bugünkü duygu durumu</div>
    </div>`;
  }

  // Görüşmeler kartı — silme butonu ile
  const gorusmelerHtml = gorusmeler.length > 0 ? `
    <div class="card" style="margin-bottom:14px;border:1px solid #6c63ff44">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>🗣️ Koç Görüşmeleri</span>
        <button onclick="openGorusmeModal('${sName}','${sUid}')"
          style="padding:5px 10px;border-radius:8px;background:var(--accent)22;border:1px solid var(--accent)44;color:var(--accent);font-size:0.75rem;font-weight:700;cursor:pointer">
          + Görüşme Ekle
        </button>
      </div>
      ${gorusmeler.slice().reverse().map((g,i)=>{
        const gercekIdx = gorusmeler.length - 1 - i;
        return `
        <div style="padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div style="font-size:0.78rem;font-weight:700;color:var(--accent)">${g.tarih||''}</div>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="font-size:0.7rem;padding:2px 8px;border-radius:6px;background:${g.durum==='yapildi'?'#43e97b22':'#f9ca2422'};color:${g.durum==='yapildi'?'#43e97b':'#f9ca24'};font-weight:700">
                ${g.durum==='yapildi'?'✅ Görüşme Yapıldı':'📅 Planlandı'}
              </div>
              <button onclick="deleteGorusme('${sName}','${sUid}',${gercekIdx})"
                style="width:26px;height:26px;border-radius:7px;background:#ff658420;border:1px solid #ff658444;color:#ff6584;font-size:0.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center">🗑️</button>
            </div>
          </div>
          ${g.not?`<div style="font-size:0.8rem;color:var(--text2);line-height:1.5">${g.not}</div>`:''}
        </div>`;
      }).join('')}
    </div>` :
    `<div class="card" style="margin-bottom:14px;border:1px solid var(--border)">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>🗣️ Koç Görüşmeleri</span>
        <button onclick="openGorusmeModal('${sName}','${sUid}')"
          style="padding:5px 10px;border-radius:8px;background:var(--accent)22;border:1px solid var(--accent)44;color:var(--accent);font-size:0.75rem;font-weight:700;cursor:pointer">
          + Görüşme Ekle
        </button>
      </div>
      <div style="text-align:center;padding:16px;color:var(--text2);font-size:0.85rem">Henüz görüşme kaydı yok.</div>
    </div>`;

  // Hedefler (en son kaydedilen)
  const hedefHtml = (data.hedef||data.hedefOkul) ? `
    <div class="card" style="margin-bottom:14px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Öğrencinin Hedefleri</div>
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        ${data.hedef?`<div><div style="font-size:0.72rem;color:var(--text2)">Hedef Puan</div><div style="font-weight:800;font-size:1.3rem;color:var(--accent)">${data.hedef}</div></div>`:''}
        ${data.hedefOkul?`<div><div style="font-size:0.72rem;color:var(--text2)">Hedef Okul</div><div style="font-weight:700;font-size:0.92rem">${data.hedefOkul}</div></div>`:''}
      </div>
    </div>` : '';

  // Isı haritası HTML
  const heatMapHtml = `
    <div class="card" style="margin-bottom:14px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Psikolojik Isı Haritası — Son 30 Gün</div>
      <div style="display:grid;grid-template-columns:repeat(10,1fr);gap:4px;margin-bottom:8px">
        ${heatMapDays.map(d=>`
          <div title="${d.dk}" style="aspect-ratio:1;border-radius:5px;background:${d.hasData?d.col+'88':'var(--surface2)'};
               border:1px solid ${d.hasData?d.col:'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:0.7rem">
            ${d.hasData?d.emoji:'<span style="font-size:0.55rem;color:var(--text2)">${d.label}</span>'}
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
        ${Object.entries(moodColors).slice(0,4).map(([k,c])=>`
          <span style="font-size:0.68rem;display:flex;align-items:center;gap:3px">
            <span style="width:10px;height:10px;border-radius:3px;background:${c};display:inline-block"></span>
            ${moodLabels[k]||k}
          </span>`).join('')}
      </div>
    </div>`;

  // Detay tablosu
  const tableRows = sortedDays.map(k=>{
    const d=days[k];
    const dateStr=new Date(k+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',weekday:'short'});
    const mc=moodColors[d.mood]||'var(--text2)';
    const me=moodEmojis[d.mood]||'·';
    return `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:9px 6px;font-size:0.75rem;color:var(--text2);white-space:nowrap">${dateStr}</td>
      <td style="padding:9px 6px;text-align:center">
        <span style="background:${mc}22;border:1px solid ${mc}66;border-radius:7px;padding:2px 6px;font-size:0.68rem;font-weight:700;color:${mc};white-space:nowrap">${me} ${moodLabels[d.mood]||'-'}</span>
      </td>
      <td style="padding:9px 6px;text-align:center;font-size:0.82rem;font-weight:700;color:#f9ca24">${d.enerji||'-'}</td>
      <td style="padding:9px 6px;text-align:center;font-size:0.82rem;font-weight:700;color:#ff6b6b">${d.kaygi||'-'}</td>
      <td style="padding:9px 6px;text-align:center;font-size:0.82rem;font-weight:700;color:#a29bfe">${d.uyku?d.uyku+'sa':'-'}</td>
      <td style="padding:9px 6px;font-size:0.72rem;color:var(--text2);max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.pozitif||d.gurur||''}</td>
    </tr>`;
  }).join('');

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <button onclick="showPage('students')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem">←</button>
      <div class="page-title" style="margin:0">💙 ${sName}</div>
    </div>
    <div class="page-sub">Psikolojik Takip Raporu</div>

    <!-- Dönem seçici -->
    <div style="display:flex;gap:6px;margin-bottom:14px;background:var(--surface2);border-radius:12px;padding:4px">
      <button onclick="window._psychPeriod='daily';renderTeacherPage('psych-report',document.getElementById('mainContent'))"
        style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;
               background:${period==='daily'?'var(--accent)':'transparent'};
               color:${period==='daily'?'#fff':'var(--text2)'};transition:.2s">Günlük</button>
      <button onclick="window._psychPeriod='weekly';renderTeacherPage('psych-report',document.getElementById('mainContent'))"
        style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;
               background:${period==='weekly'?'var(--accent)':'transparent'};
               color:${period==='weekly'?'#fff':'var(--text2)'};transition:.2s">Haftalık</button>
      <button onclick="window._psychPeriod='monthly';renderTeacherPage('psych-report',document.getElementById('mainContent'))"
        style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;
               background:${period==='monthly'?'var(--accent)':'transparent'};
               color:${period==='monthly'?'#fff':'var(--text2)'};transition:.2s">Aylık</button>
    </div>

    ${sortedDays.length===0 ? `
      <div class="card" style="text-align:center;padding:40px;color:var(--text2)">
        <div style="font-size:3rem;margin-bottom:12px">💙</div>
        <div style="font-weight:700;margin-bottom:8px">Bu dönemde veri yok</div>
        <div style="font-size:0.85rem">Öğrenci "Nasıl Hissediyorum" bölümünden veri girişi yaptıkça burada görünecek.</div>
      </div>
    ` : `
      ${alertHtml}
      ${hedefHtml}
      ${gorusmelerHtml}

      <div class="grid-4" style="margin-bottom:14px">
        <div class="stat-card"><div class="stat-label">⚡ Ort. Enerji</div><div class="stat-value" style="color:#f9ca24">${avg('enerji')}/10</div></div>
        <div class="stat-card"><div class="stat-label">🎯 Ort. Odak</div><div class="stat-value" style="color:#45b7d1">${avg('odak')}/10</div></div>
        <div class="stat-card"><div class="stat-label">😰 Ort. Kaygı</div><div class="stat-value" style="color:#ff6b6b">${avg('kaygi')}/10</div></div>
        <div class="stat-card"><div class="stat-label">🌙 Ort. Uyku</div><div class="stat-value" style="color:#a29bfe">${avg('uyku')}sa</div></div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Dönem Detayı</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="border-bottom:2px solid var(--border)">
              <th style="padding:8px 6px;text-align:left;font-size:0.7rem;color:var(--text2)">Tarih</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Duygu</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Enerji</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Kaygı</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Uyku</th>
              <th style="padding:8px 6px;font-size:0.7rem;color:var(--text2)">Pozitif</th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </div>

      <!-- Rapor Al — Günlük/Haftalık/Aylık -->
      <div style="margin-bottom:14px">
        <button onclick="toggleRaporAl('psych_${sName.replace(/\s/g,'_')}')"
          style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;color:var(--text);cursor:pointer;font-weight:700;font-size:0.9rem">
          <span>📥 Rapor Al</span>
          <span id="raporAlArrow_psych_${sName.replace(/\s/g,'_')}" style="transition:.2s;font-size:0.8rem">▼</span>
        </button>
        <div id="raporAlPanel_psych_${sName.replace(/\s/g,'_')}" style="display:none;margin-top:6px;padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:12px">

          <!-- AI Toggle — sadece haftalık/aylık için -->
          <div id="aiToggleKapsul_${sName.replace(/\s/g,'_')}"
            style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;margin-bottom:10px;transition:all 0.2s">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:15px">🤖</span>
              <div>
                <div style="font-size:12px;font-weight:700;color:var(--text)">AI Analizi</div>
                <div style="font-size:10px;color:var(--text2);margin-top:1px">Haftalık ve aylık raporlara eklenir</div>
              </div>
            </div>
            <div id="aiToggle_${sName.replace(/\s/g,'_')}"
              onclick="aiToggleGuncelle('${sName.replace(/\s/g,'_')}')"
              style="width:38px;height:22px;border-radius:11px;border:1.5px solid var(--border);background:var(--surface2);cursor:pointer;position:relative;transition:all 0.2s;flex-shrink:0">
              <div class="ai-toggle-top"
                style="position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--text2);transition:all 0.2s"></div>
            </div>
          </div>
          <div id="aiKotaBilgi_${sName.replace(/\s/g,'_')}" style="display:none;margin-bottom:10px"></div>

          <!-- Rapor butonları -->
          <div style="display:flex;gap:8px">
            <button id="psychRaporBtn_daily_${sName.replace(/\s/g,'_')}"
              onclick="setPsychRaporBtn('${sName.replace(/\s/g,'_')}','daily');window._psychPeriod='daily';exportPsychPDF('${sName}',false)"
              style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
              📋 Günlük
            </button>
            <button id="psychRaporBtn_weekly_${sName.replace(/\s/g,'_')}"
              onclick="setPsychRaporBtn('${sName.replace(/\s/g,'_')}','weekly');_psychAIKontrolVeAc('${sName}','${sName.replace(/\s/g,'_')}','weekly')"
              style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
              📅 Haftalık
            </button>
            <button id="psychRaporBtn_monthly_${sName.replace(/\s/g,'_')}"
              onclick="setPsychRaporBtn('${sName.replace(/\s/g,'_')}','monthly');_psychAIKontrolVeAc('${sName}','${sName.replace(/\s/g,'_')}','monthly')"
              style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
              📆 Aylık
            </button>
          </div>
        </div>
      </div>
    `}`;
}


