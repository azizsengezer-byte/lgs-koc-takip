// ── ÖDÜL SİSTEMİ ─────────────────────────────────────────

const ODUL_KARTLARI = [
  { id:'superCalisma',   emoji:'⚡', baslik:'Süper Çalışma',         renk:'#6c63ff', aciklama:'Bu haftaki çalışma temponu çok beğendim.' },
  { id:'harikaGelisim',  emoji:'📈', baslik:'Harika Gelişim',         renk:'#1D9E75', aciklama:'Geçen haftaya göre gelişimin çok net görünüyor.' },
  { id:'azimOdulu',      emoji:'💪', baslik:'Azim Ödülü',             renk:'#e67e22', aciklama:'Zor dönemde bile çalışmaya devam ettin.' },
  { id:'denemeSampiyon', emoji:'🎯', baslik:'Deneme Başarısı',        renk:'#e74c3c', aciklama:'Deneme performansın gerçekten etkileyiciydi.' },
  { id:'haftaYildizi',   emoji:'⭐', baslik:'Haftanın En İyisi',      renk:'#f9ca24', aciklama:'Bu hafta öne çıkan öğrencimsin.' },
  { id:'ozelTebrik',     emoji:'🎉', baslik:'Özel Tebrik',            renk:'#9b59b6', aciklama:'Seni özellikle tebrik etmek istedim.' },
  { id:'odakliCalisma',  emoji:'🔍', baslik:'Odaklı Çalışma',         renk:'#2980b9', aciklama:'Dikkatini doğru yere yönlendirdin.' },
  { id:'kararlilik',     emoji:'🏹', baslik:'Kararlılık',             renk:'#8e44ad', aciklama:'Hedefine odaklanmayı bırakmadın.' },
  { id:'sorucozumu',     emoji:'✏️', baslik:'Soru Çözüm Şampiyonu',  renk:'#16a085', aciklama:'Bu haftaki soru sayın gerçekten etkileyici.' },
  { id:'turkce',         emoji:'📚', baslik:'Türkçe Başarısı',        renk:'#c0392b', aciklama:'Türkçe performansın bu hafta çok iyiydi.' },
  { id:'matematik',      emoji:'📐', baslik:'Matematik Başarısı',     renk:'#2471a3', aciklama:'Matematik çalışman meyve verdi.' },
  { id:'fen',            emoji:'🔬', baslik:'Fen Başarısı',           renk:'#1e8449', aciklama:'Fen sorularındaki gelişimin göze çarpıyor.' },
];

function odul_gonderModal(name, uid) {
  const existing = document.getElementById('_odulModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_odulModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';

  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:20px;padding:22px 18px;width:100%;max-width:380px;max-height:90vh;overflow-y:auto">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <div style="font-weight:800;font-size:1rem">🏅 Ödül Gönder</div>
          <div style="font-size:0.72rem;color:var(--text2);margin-top:2px">${name}</div>
        </div>
        <button onclick="document.getElementById('_odulModal').remove()" style="background:none;border:none;color:var(--text2);font-size:1.3rem;cursor:pointer">✕</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        ${ODUL_KARTLARI.map(k => `
          <div onclick="_odulSec(this,'${k.id}')"
            style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1.5px solid var(--border);cursor:pointer;transition:all 0.15s"
            data-id="${k.id}">
            <div style="width:40px;height:40px;border-radius:10px;background:${k.renk}22;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">${k.emoji}</div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:0.88rem;color:${k.renk}">${k.baslik}</div>
              <div style="font-size:0.72rem;color:var(--text2);margin-top:1px">${k.aciklama}</div>
            </div>
            <div class="odul-check" style="width:20px;height:20px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0"></div>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom:12px">
        <div style="font-size:0.78rem;font-weight:700;color:var(--text2);margin-bottom:6px">Kişisel not (isteğe bağlı)</div>
        <textarea id="odulNotInput" maxlength="120" placeholder="Bir şeyler ekle..." rows="2"
          style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:0.85rem;font-family:'Nunito',sans-serif;resize:none;box-sizing:border-box"></textarea>
      </div>

      <button onclick="_odulGonder('${name}','${uid}')"
        style="width:100%;padding:12px;background:linear-gradient(135deg,#f9ca24,#f0932b);border:none;border-radius:12px;color:#222;font-weight:800;font-size:0.95rem;cursor:pointer;font-family:'Nunito',sans-serif">
        🎉 Ödülü Gönder
      </button>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

let _seciliOdul = null;

function _odulSec(el, id) {
  _seciliOdul = id;
  document.querySelectorAll('#_odulModal [data-id]').forEach(item => {
    const check = item.querySelector('.odul-check');
    const isSelected = item.dataset.id === id;
    item.style.borderColor = isSelected ? '#f9ca24' : 'var(--border)';
    item.style.background = isSelected ? 'rgba(249,202,36,0.06)' : 'transparent';
    check.style.background = isSelected ? '#f9ca24' : 'transparent';
    check.style.borderColor = isSelected ? '#f9ca24' : 'var(--border)';
    check.innerHTML = isSelected ? '<svg viewBox="0 0 20 20" width="12" height="12" style="margin:3px"><polyline points="4,10 8,14 16,6" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>' : '';
  });
}

async function _odulGonder(name, uid) {
  if (!_seciliOdul) { showToast('⚠️', 'Bir ödül seç'); return; }
  const kart = ODUL_KARTLARI.find(k => k.id === _seciliOdul);
  if (!kart) return;

  const not = document.getElementById('odulNotInput')?.value?.trim() || '';
  const teacherName = document.getElementById('menuName')?.textContent || 'Koçun';
  const user = auth.currentUser;
  if (!user) return;

  const odulData = {
    kartId: kart.id,
    emoji: kart.emoji,
    baslik: kart.baslik,
    renk: kart.renk,
    not: not,
    gonderenAd: teacherName,
    gonderenUid: user.uid,
    tarih: new Date().toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' }),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    // Firestore'a kaydet
    await db.collection('oduller').add({ ...odulData, ogrenciUid: uid, ogrenciAd: name });

    // Bildirim gönder
    if (uid) {
      await db.collection('notifications').add({
        toUid: uid,
        fromUid: user.uid,
        text: kart.emoji + ' ' + teacherName + ' sana "' + kart.baslik + '" ödülü gönderdi!',
        type: 'odul',
        kartId: kart.id,
        actionUrl: '/?p=profile&odul=1',
        meta: { actionUrl: '/?p=profile&odul=1' },
        read: false,
        time: new Date().toLocaleTimeString('tr-TR', { hour:'2-digit', minute:'2-digit' }),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    document.getElementById('_odulModal')?.remove();
    showToast(kart.emoji, name + "'e ödül gönderildi!");
    _seciliOdul = null;
  } catch(e) {
    showToast('❌', 'Gönderilemedi: ' + e.message);
  }
}

function buildKonuZafiyetHTML(allEntries) {
  const _LGS_AG = {
    'Türkçe':{'Ana Fikir / Başlık':3,'Dil Bilgisi':3,'Sözcükte Anlam':3,'Cümlede Anlam':3,'Paragrafta Anlam':3,'Anlatım Biçimleri':2,'Yazım Kuralları':2,'Noktalama':2,'Sözcük Türleri':2,'Fiil Çekimi':2},
    'Matematik':{'Sayılar':3,'Kesirler':3,'Oran Orantı':3,'Yüzde':3,'Cebirsel İfadeler':3,'Denklemler':3,'Üslü İfadeler':3,'Kök İfadeler':3,'Eşlik ve Benzerlik':3,'Üçgenler':3,'Çember':3,'Doğrusal Denklemler':3,'Dört İşlem':2,'Ondalık Sayılar':2,'Dörtgenler':2,'Veri Analizi':2,'Olasılık':2,'Çarpanlara Ayırma':2,'Fonksiyonlar':2},
    'Fen Bilimleri':{'Kuvvet ve Hareket':3,'Madde':3,'Elektrik':3,'Hücre':3,'Kalıtım':3,'Atom':3,'Kimyasal Tepkimeler':3,'DNA':3,'Enerji Dönüşümü':3,'Işık':2,'Ses':2,'Fotosentez':2,'Kimyasal Bağlar':2,'Asit Baz':2,'Basınç':2,'Optik':2},
    'İnkılap Tarihi':{'Kurtuluş Savaşı':3,'Atatürk İlkeleri':3,'Cumhuriyetin İlanı':3,'Devrimler':3,'Ekonomik Gelişmeler':2,'Dış Politika':2,'İkinci Dünya Savaşı':2,'Demokrasiye Geçiş':2,'Kültür Devrimi':2},
    'Din Kültürü':{'İslamın Temelleri':3,'Kuran':3,'Hz. Muhammed':3,'Namaz':2,'Oruç Zekât Hac':2,'Ahlak':2,'Dini Kavramlar':2,'Peygamberler':2},
    'İngilizce':{'Okuma Anlama':3,'Kelime Bilgisi':3,'Dilbilgisi':3,'Tenses':3,'Reading':3,'Vocabulary':3,'Modal Verbs':2,'Prepositions':2},
  };
  const dersSirasi = ['Türkçe','Matematik','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce'];

  const kumMap = {};
  (allEntries||[]).filter(e=>e.type==='soru'&&(e.questions||0)>=1).forEach(e=>{
    const key=(e.subject||'')+'|'+(e.topic||'Genel');
    if(!kumMap[key]) kumMap[key]={subject:e.subject,topic:e.topic||'Genel',q:0,d:0,sessions:0};
    kumMap[key].q+=e.questions||0; kumMap[key].d+=e.correct||0; kumMap[key].sessions++;
  });

  const konular=Object.values(kumMap).filter(m=>m.q>=3).map(m=>{
    const pct=m.q>0?Math.round(m.d/m.q*100):0;
    const lgsAg=(_LGS_AG[m.subject]||{})[m.topic]||0;
    return Object.assign({},m,{pct,lgsAg,kritik:pct<60&&lgsAg>=2});
  }).sort((a,b)=>a.pct-b.pct);

  if(konular.length===0) return '';

  const tekrarlar=konular.filter(m=>m.pct<65&&m.q>=5);
  const dersGrup={};
  konular.forEach(m=>{if(!dersGrup[m.subject])dersGrup[m.subject]=[];dersGrup[m.subject].push(m);});

  function renk(pct){
    if(pct<50) return {bar:'#d9534f',txt:'#c0392b'};
    if(pct<65) return {bar:'#e67e22',txt:'#b35c00'};
    if(pct<80) return {bar:'#c8a800',txt:'#7d6b00'};
    return {bar:'#27ae60',txt:'#1a7a40'};
  }

  const _uid='kzh_'+Math.random().toString(36).slice(2,7);
  let html='<div class="card" style="margin-bottom:12px;padding:0;overflow:hidden">';
  html+='<div onclick="(()=>{const b=document.getElementById(\''+_uid+'\');const a=document.getElementById(\''+_uid+'_arr\');if(!b)return;const open=b.style.display!==\'none\';b.style.display=open?\'none\':\'block\';a.textContent=open?\'▼\':\'▲\';})()" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;user-select:none">';
  html+='<div class="card-title" style="margin:0">';
  html+='<svg style="vertical-align:middle;margin-right:6px" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>';
  html+='Konu Zafiyet Haritası</div>';
  html+='<span id="'+_uid+'_arr" style="color:var(--text2);font-size:0.8rem">▼</span></div>';
  html+='<div id="'+_uid+'" style="display:none;padding:0 16px 14px">';

  dersSirasi.forEach(function(ders){
    const km=dersGrup[ders];
    if(!km||km.length===0) return;
    html+='<div style="margin-bottom:10px">';
    html+='<div style="font-size:0.72rem;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;padding:4px 8px;background:var(--surface2);border-radius:6px">'+ders+'</div>';
    km.forEach(function(m){
      const r=renk(m.pct);
      const barW=Math.max(4,m.pct);
      const lgsTag=m.lgsAg===3?'<span style="font-size:0.6rem;background:#c0392b;color:#fff;border-radius:4px;padding:1px 5px;margin-left:5px">LGS</span>':m.lgsAg===2?'<span style="font-size:0.6rem;background:#e67e22;color:#fff;border-radius:4px;padding:1px 5px;margin-left:5px">LGS</span>':'';
      html+='<div style="margin-bottom:6px">';
      html+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">';
      html+='<span style="font-size:0.75rem;font-weight:700;color:var(--text)">'+m.topic+lgsTag+'</span>';
      html+='<span style="font-size:0.75rem;font-weight:800;color:'+r.txt+'">'+m.pct+'%</span></div>';
      html+='<div style="height:6px;background:var(--surface2);border-radius:4px;overflow:hidden">';
      html+='<div style="height:100%;width:'+barW+'%;background:'+r.bar+';border-radius:4px;transition:.3s"></div></div>';
      html+='<div style="font-size:0.65rem;color:var(--text2);margin-top:1px">'+m.q+' soru · '+m.sessions+' seans</div>';
      html+='</div>';
    });
    html+='</div>';
  });

  if(tekrarlar.length>0){
    html+='<div style="margin-top:12px;padding:10px 12px;background:#fff5f5;border-radius:10px;border-left:3px solid #d9534f">';
    html+='<div style="font-size:0.78rem;font-weight:800;color:#c0392b;margin-bottom:7px">Tekrar Gerektiren Konular</div>';
    tekrarlar.slice(0,8).forEach(function(m){
      const lgsTag=m.lgsAg>=2?' [LGS '+(m.lgsAg===3?'Önemli':'Orta')+']':'';
      html+='<div style="font-size:0.75rem;padding:4px 0;border-bottom:1px solid #fdd;display:flex;justify-content:space-between">';
      html+='<span style="color:'+(m.kritik?'#c0392b':'var(--text)')+(m.kritik?';font-weight:700':'')+'">'+(m.kritik?'★ ':'')+m.subject+' — '+m.topic+lgsTag+'</span>';
      html+='<span style="font-weight:800;color:#c0392b">'+m.pct+'%</span></div>';
    });
    html+='</div>';
  }

  html+='</div>'; // accordion body
  html+='</div>'; // card
  return html;
}

function studentDetailAnalysis() {
  const sName = selectedStudentName;
  if (!sName) return `<div class="page-title">Öğrenci seçilmedi</div>`;
  const sObj = students.find(s=>s.name===sName) || { color:'#6c63ff' };
  const sUid = sObj.uid || '';
  const now = new Date();
  const todayKey = getDateKey(now);
  const matchE = e => e.studentName===sName || (sUid && e.userId===sUid);

  // Dönem filtresi
  const monday = new Date(now); monday.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
  const mondayKey = monday.toISOString().split('T')[0];
  const monthStart = todayKey.substring(0,7)+'-01';
  let filtered = [], periodLabel = '';
  if (studentAnalysisPeriod==='daily') { filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey===todayKey); periodLabel='Bugün'; }
  else if (studentAnalysisPeriod==='weekly') { filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey>=mondayKey); periodLabel='Bu Hafta'; }
  else { filtered = studyEntries.filter(e=>matchE(e)&&e.dateKey>=monthStart); periodLabel='Bu Ay'; }
  const allEntries = studyEntries.filter(e=>matchE(e));

  const soruEntries = filtered.filter(e=>e.type==='soru');
  const nonDeneme = filtered.filter(e=>e.type!=='deneme');
  const totalDur = nonDeneme.reduce((a,e)=>a+(e.duration||0),0);
  const totalQ = soruEntries.reduce((a,e)=>a+(e.questions||0),0);
  const totalD = soruEntries.reduce((a,e)=>a+(e.correct||0),0);
  const totalY = soruEntries.reduce((a,e)=>a+(e.wrong||0),0);
  const totalNet = soruEntries.reduce((a,e)=>a+(e.net||0),0);
  const activeDays = new Set(filtered.map(e=>e.dateKey)).size;
  const netRate = totalQ>0?Math.round(totalD/totalQ*100):0;

  // Ders istatistikleri
  const maxQ = Math.max(...subjects.map(s=>soruEntries.filter(e=>e.subject===s.name).reduce((a,e)=>a+(e.questions||0),0)),1);
  const subStats = subjects.map(s=>{
    const se=soruEntries.filter(e=>e.subject===s.name);
    const q=se.reduce((a,e)=>a+(e.questions||0),0);
    const d=se.reduce((a,e)=>a+(e.correct||0),0);
    const y=se.reduce((a,e)=>a+(e.wrong||0),0);
    const net=se.reduce((a,e)=>a+(e.net||0),0);
    const dur=nonDeneme.filter(e=>e.subject===s.name).reduce((a,e)=>a+(e.duration||0),0);
    const pct=q>0?Math.round(d/q*100):0;
    return {...s,q,d,y,net,dur,pct};
  });

  // Son 7 gün trend
  const trendDays = Array.from({length:7},(_,i)=>{
    const d=new Date(now); d.setDate(now.getDate()-6+i);
    const dk=d.toISOString().split('T')[0];
    const dayE=allEntries.filter(e=>e.dateKey===dk&&e.type==='soru');
    return { dk, label:d.toLocaleDateString('tr-TR',{weekday:'short'}),
      q:dayE.reduce((a,e)=>a+(e.questions||0),0), net:dayE.reduce((a,e)=>a+(e.net||0),0) };
  });
  const maxTQ = Math.max(...trendDays.map(t=>t.q),1);
  const maxTN = Math.max(...trendDays.map(t=>t.net),1);

  // Deneme sonuçları (son 3)
  const denemeler = {};
  allEntries.filter(e=>e.type==='deneme').forEach(e=>{
    const k=e.examId||(e.dateKey+'_'+e.subject);
    if(!denemeler[k]) denemeler[k]={title:e.examTitle||'Deneme',dk:e.dateKey,entries:[]};
    denemeler[k].entries.push(e);
  });
  const denList = Object.values(denemeler).sort((a,b)=>(b.dk||'').localeCompare(a.dk||'')).slice(0,3);

  // Genel koç yorumu
  const strong = subStats.filter(s=>s.q>0).sort((a,b)=>b.pct-a.pct)[0];
  const weak = subStats.filter(s=>s.q>0).sort((a,b)=>a.pct-b.pct)[0];
  const commentParts = [];
  if (totalQ>0) commentParts.push(`${sName.split(' ')[0]} ${periodLabel.toLowerCase()} ${totalQ} soru çözdü, %${netRate} isabet oranıyla ${netRate>=80?'güçlü bir':'geliştirilmesi gereken'} performans sergiledi.`);
  if (strong&&strong.q>0) commentParts.push(`${strong.name} dersinde %${strong.pct} ile en yüksek isabet oranına ulaştı.`);
  if (weak&&weak.q>0&&weak.pct<70) commentParts.push(`${weak.name} dersinde %${weak.pct} isabet oranı dikkat gerektiriyor.`);
  if (activeDays<(studentAnalysisPeriod==='weekly'?4:15)) commentParts.push(`Düzenlilik konusunda iyileştirme gerekiyor — ${activeDays} gün aktif.`);

  // Deneme özeti — LGS puanı ve ders ortalamaları
  const lgsDenemeOzeti = (() => {
    const dEntries = allEntries.filter(e=>e.type==='deneme');
    if (dEntries.length < 2) return null;
    // examId bazlı grupla
    const dGrup = {};
    dEntries.forEach(e=>{
      const k = e.examId||e.dateKey;
      if(!dGrup[k]) dGrup[k] = {dateKey:e.dateKey, dersler:{}};
      const net = Math.max(0, (e.correct||0)-(e.wrong||0)/3);
      if(!dGrup[k].dersler[e.subject]) dGrup[k].dersler[e.subject] = [];
      dGrup[k].dersler[e.subject].push(net);
    });
    const denemeler = Object.values(dGrup).sort((a,b)=>a.dateKey.localeCompare(b.dateKey));
    // 2025 LGS katsayıları
    const LGS_K = {'Türkçe':4.348,'Matematik':4.2538,'Fen Bilimleri':4.1230,'İnkılap Tarihi':1.666,'Din Kültürü':1.899,'İngilizce':1.5075};
    const LGS_BAZ = 194.752082;
    const LGS_MAX_SORU = {'Türkçe':20,'Matematik':20,'Fen Bilimleri':20,'İnkılap Tarihi':10,'Din Kültürü':10,'İngilizce':10};
    const lgsPuanHesapla = (dersler) => {
      let toplam = 0;
      Object.entries(dersler).forEach(([ders, netArr]) => {
        const k = LGS_K[ders]; if (!k) return;
        // Aynı derste birden fazla giriş varsa ortalamasını al
        const ortNet = netArr.reduce((a,b)=>a+b,0) / netArr.length;
        toplam += ortNet * k;
      });
      return Math.min(500, Math.max(100, Math.round((toplam + LGS_BAZ) * 10) / 10));
    };
    const puanlar = denemeler.map(d=>lgsPuanHesapla(d.dersler));
    const ortPuan = Math.round(puanlar.reduce((a,b)=>a+b,0)/puanlar.length);
    const son = puanlar[puanlar.length-1];
    const ilk = puanlar[0];
    const trend = puanlar.length>=3
      ? (son>ilk+10?'artış trendi var':son>ilk?'hafif yükseliş var':'stabil gidiyor')
      : (son>ilk?'artış var':'stabil');
    // Ders bazlı ortalama net — her denemede dersin ortalaması alınır
    const dersOrt = {};
    denemeler.forEach(d=>{
      Object.entries(d.dersler).forEach(([ders,netArr])=>{
        const maxSoru = LGS_MAX_SORU[ders]||10;
        if(!dersOrt[ders]) dersOrt[ders]={topNet:0,count:0,max:maxSoru};
        // Birden fazla giriş varsa ortalamasını kullan
        dersOrt[ders].topNet += netArr.reduce((a,b)=>a+b,0) / netArr.length;
        dersOrt[ders].count++;
      });
    });
    const dersSirali = Object.entries(dersOrt)
      .map(([d,v])=>({d, ort:Math.round(v.topNet/v.count*10)/10, max:v.max, pct:Math.round(v.topNet/v.count/v.max*100)}))
      .filter(x=>x.count>0||x.ort>0);
    const enYuksek = dersSirali.sort((a,b)=>b.pct-a.pct)[0];
    const enDusuk  = dersSirali.sort((a,b)=>a.pct-b.pct)[0];
    return {ortPuan, son, trend, enYuksek, enDusuk, count:denemeler.length};
  })();

  if (lgsDenemeOzeti) {
    const {ortPuan, son, trend, enYuksek, enDusuk, count} = lgsDenemeOzeti;
    commentParts.push(
      `${count} denemede LGS puan ortalaması yaklaşık ${ortPuan}/500; ` +
      `son deneme ${son} puan, ${trend}. ` +
      (enYuksek ? `Denemede en yüksek net ortalaması ${enYuksek.d} (ort. ${enYuksek.ort} net, %${enYuksek.pct} isabet). ` : '') +
      (enDusuk&&enDusuk.d!==enYuksek?.d ? `En düşük net ortalaması ${enDusuk.d} (ort. ${enDusuk.ort} net, %${enDusuk.pct} isabet) — öncelikli çalışma alanı.` : '')
    );
  }

  const comment = commentParts.join(' ') || `${sName.split(' ')[0]} için bu dönemde henüz yeterli veri yok.`;

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <button onclick="showPage('students')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem">←</button>
      <div class="page-title" style="margin:0"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> ${sName}</div>
    </div>
    <div class="page-sub">Bireysel Analiz Raporu</div>

    <!-- Rapor Al -->
    <div style="display:flex;gap:6px;margin-bottom:10px">
      <button onclick="(()=>{const now=new Date();const dk=getDateKey(now);const dateStr=now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});window._pdfDateOverride={mode:'daily',startKey:dk,endKey:dk,label:'Günlük',title:dateStr+' Günlük Rapor'};preparePdfLink('${sName}',this).finally(()=>{window._pdfDateOverride=null;})})()"
        class="dp-btn-pdf"
        style="flex:1;padding:10px;border-radius:10px;background:var(--accent);border:none;color:#fff;font-weight:700;font-size:0.82rem;cursor:pointer">
        Günlük Rapor
      </button>
      <button onclick="openDatePicker('${sName}','weekly')"
        style="flex:1;padding:10px;border-radius:10px;background:var(--surface2);border:1.5px solid var(--border);color:var(--text);font-weight:700;font-size:0.82rem;cursor:pointer">
        Haftalık
      </button>
      <button onclick="openDatePicker('${sName}','monthly')"
        style="flex:1;padding:10px;border-radius:10px;background:var(--surface2);border:1.5px solid var(--border);color:var(--text);font-weight:700;font-size:0.82rem;cursor:pointer">
        Aylık
      </button>
    </div>

    <!-- Dönem seçici -->
    <div style="display:flex;gap:6px;margin-bottom:12px;background:var(--surface2);border-radius:12px;padding:4px">
      ${['daily','weekly','monthly'].map((p,i)=>{
        const lbl=['Günlük','Haftalık','Aylık'][i];
        return `<button onclick="studentAnalysisPeriod='${p}';showPage('student-detail')"
          style="flex:1;padding:8px 4px;border:none;border-radius:9px;cursor:pointer;font-weight:700;font-size:0.82rem;
          background:${studentAnalysisPeriod===p?'var(--accent)':'transparent'};
          color:${studentAnalysisPeriod===p?'#fff':'var(--text2)'};transition:.2s">${lbl}</button>`;
      }).join('')}
    </div>

    <!-- Özet kartlar — 2x2 grid, 4. hücre = Rapor Al -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div class="stat-card">
        <div class="stat-label">Süre</div>
        <div class="stat-value" style="color:var(--accent)">${totalDur}<span style="font-size:0.75rem">dk</span></div>
        <div class="stat-change">${activeDays} gün aktif</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Soru</div>
        <div class="stat-value" style="color:var(--accent4)">${totalQ}</div>
        <div class="stat-change">✅${totalD} ❌${totalY}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Net</div>
        <div class="stat-value" style="color:var(--accent3)">${totalNet.toFixed(1)}</div>
        <div class="stat-change">${totalQ>0?netRate+'% isabet':'-'}</div>
      </div>
      <!-- 4. hücre: Rapor Al -->
      <div onclick="toggleRaporAl('${sName.replace(/\s/g,'_')}')"
        style="background:var(--surface2);border:1.5px solid var(--border);border-radius:var(--radius);padding:14px;cursor:pointer;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <span style="font-size:0.82rem;font-weight:800;color:var(--accent)">Rapor Al</span>
        <span id="raporAlArrow_${sName.replace(/\s/g,'_')}" style="font-size:0.7rem;color:var(--text2)">▼</span>
      </div>
    </div>

    <!-- Rapor paneli -->
    <div id="raporAlPanel_${sName.replace(/\s/g,'_')}" style="display:none;margin-bottom:12px;padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:12px">
      <div style="display:flex;gap:8px">
        <button onclick="(()=>{const now=new Date();const dk=getDateKey(now);const dateStr=now.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});window._pdfDateOverride={mode:'daily',startKey:dk,endKey:dk,label:'Günlük',title:dateStr+' Günlük Rapor'};preparePdfLink('${sName}',this).finally(()=>{window._pdfDateOverride=null;})})()"
          class="dp-btn-pdf"
          style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
          📋 Günlük
        </button>
        <button onclick="openDatePicker('${sName}','weekly')"
          style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
          📅 Haftalık
        </button>
        <button onclick="openDatePicker('${sName}','monthly')"
          style="flex:1;padding:10px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);font-weight:700;font-size:0.82rem;cursor:pointer">
          📆 Aylık
        </button>
      </div>
    </div>

    <!-- Son 7 gün trend — tıklanabilir -->
    ${studentAnalysisPeriod!=='daily'?`
    <div class="card" style="margin-bottom:12px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Son 7 Gün — Soru & Net Trendi</div>
      <div style="display:flex;gap:4px;align-items:flex-end;height:100px;padding-bottom:20px;box-sizing:border-box">
        ${trendDays.map(t=>{
          const hQ=t.q>0?Math.max(Math.round((t.q/maxTQ)*60),6):0;
          const hN=t.net>0?Math.max(Math.round((t.net/maxTN)*60),6):0;
          const isToday=t.dk===todayKey;
          const dl=new Date(t.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'short'});
          return `<div style="flex:1;text-align:center;cursor:pointer;position:relative" onclick="showDayEntries('${t.dk}','${dl}')">
            <div style="font-size:0.55rem;color:var(--text2);position:absolute;top:-16px;left:0;right:0;text-align:center">${t.q>0?t.q:''}</div>
            <div style="display:inline-block;width:45%;height:${hQ}px;background:${isToday?'var(--accent)':'#6c63ff99'};border-radius:2px 2px 0 0;vertical-align:bottom"></div><div style="display:inline-block;width:45%;height:${hN}px;background:${isToday?'var(--accent3)':'#43e97b99'};border-radius:2px 2px 0 0;vertical-align:bottom"></div>
            <div style="font-size:0.55rem;color:${isToday?'var(--accent)':'var(--text2)'};position:absolute;bottom:-18px;left:0;right:0;text-align:center">${t.label}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:4px;font-size:0.68rem;color:var(--text2)">
        <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;background:var(--accent);border-radius:2px;display:inline-block"></span>Soru</span>
        <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;background:var(--accent3);border-radius:2px;display:inline-block"></span>Net</span>
      </div>
      <div style="font-size:0.72rem;color:var(--text2);text-align:center;margin-top:6px">Güne tıkla → detayları gör</div>
    </div>
    <!-- Seçili gün detay paneli -->
    <div id="dayEntriesPanel" style="display:none;margin-bottom:12px" class="card"></div>`
    : ''}

    <!-- Ders bazlı detay — konu accordion -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Ders Bazlı Detay — ${periodLabel}</div>
      ${filtered.length===0
        ? `<div style="text-align:center;padding:24px;color:var(--text2)">Bu dönemde veri yok</div>`
        : subStats.map(s=>{
          const accId='dersAcc_'+s.name.replace(/\s/g,'_');
          const topicMap={};
          filtered.filter(e=>e.type==='soru'&&e.subject===s.name).forEach(e=>{
            const t=e.topic||'Genel';
            if(!topicMap[t]) topicMap[t]={q:0,d:0,y:0};
            topicMap[t].q+=(e.questions||0); topicMap[t].d+=(e.correct||0); topicMap[t].y+=(e.wrong||0);
          });
          const topics=Object.entries(topicMap);
          return `
          <div style="border-bottom:1px solid var(--border)">
            <div onclick="toggleDersAcc('${accId}')" style="padding:10px 0;cursor:pointer">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
                <span style="font-weight:700;font-size:0.85rem;color:var(--${s.cls})">${s.icon} ${s.name}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:0.7rem;color:var(--text2)">${s.dur}dk • ${s.q} soru • Net <b style="color:var(--accent3)">${s.net.toFixed(1)}</b></span>
                  <span id="${accId}_arrow" style="color:var(--text2);font-size:0.7rem;transition:.2s">▼</span>
                </div>
              </div>
              <div class="bar-bg" style="height:6px"><div class="bar-fill bg-${s.cls}" style="width:${Math.round(s.q/maxQ*100)}%"></div></div>
              ${s.q>0?`<div style="font-size:0.7rem;color:var(--text2);margin-top:3px">✅${s.d} ❌${s.y} • 🎯%${s.pct}</div>`:''}
            </div>
            <div id="${accId}" style="display:none;padding-bottom:8px">
              ${topics.length===0?`<div style="font-size:0.78rem;color:var(--text2)">Konu detayı yok</div>`:
                topics.map(([t,td])=>`
                <div style="display:flex;justify-content:space-between;padding:7px 10px;background:var(--surface2);border-radius:8px;margin-bottom:4px">
                  <span style="font-size:0.78rem;font-weight:600">${t}</span>
                  <span style="font-size:0.7rem;color:var(--text2)">✅${td.d} ❌${td.y} • Net ${(td.d-td.y/3).toFixed(1)}</span>
                </div>`).join('')}
            </div>
          </div>`;
        }).join('')}
    </div>

    <!-- Deneme sonuçları son 3 -->
    ${denList.length>0?`
    <div class="card" style="margin-bottom:12px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Son Denemeler</div>
      ${denList.slice(0,3).map((d,di)=>{
        const subR=subjects.map(s=>{ const e=d.entries.find(e=>e.subject===s.name); if(!e) return {name:s.name,cls:s.cls,icon:s.icon,d:0,y:0,net:0,hasData:false}; return {name:s.name,cls:s.cls,icon:s.icon,d:e.correct||0,y:e.wrong||0,net:e.net||0,hasData:true}; });
        const lgsR=calcLGSScore(subR.map(s=>({...s,avgNet:s.net,count:s.net>0?1:0})));
        const dateL=d.dk?new Date(d.dk+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}):'';
        const detailId='denDetail_'+di+'_'+sName.replace(/\s/g,'_');
        return `
        <div style="border-bottom:1px solid var(--border)">
          <div onclick="(()=>{const el=document.getElementById('${detailId}');const arr=document.getElementById('${detailId}_arr');if(!el)return;const open=el.style.display!=='none';el.style.display=open?'none':'block';arr.textContent=open?'▼':'▲';})()"
            style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;cursor:pointer">
            <div>
              <div style="font-weight:700;font-size:0.85rem">${d.title}</div>
              <div style="font-size:0.72rem;color:var(--text2)">${dateL}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:1.2rem;font-weight:900;color:var(--accent)">${lgsR.puan}<span style="font-size:0.65rem;color:var(--text2)">/500</span></div>
              <span id="${detailId}_arr" style="color:var(--text2);font-size:0.75rem;transition:.2s">▼</span>
            </div>
          </div>
          <div id="${detailId}" style="display:none;padding-bottom:10px">
            ${subR.filter(s=>s.hasData).map(s=>`
              <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;background:var(--surface2);border-radius:8px;margin-bottom:4px">
                <span style="font-size:0.78rem;font-weight:700;color:var(--${s.cls})">${s.icon} ${s.name}</span>
                <span style="font-size:0.75rem;color:var(--text2)">✅${s.d} ❌${s.y} <b style="color:var(--accent3)">Net:${s.net.toFixed(2)}</b></span>
              </div>`).join('')}
            <div style="display:flex;justify-content:flex-end;margin-top:6px">
              <div style="font-size:0.78rem;color:var(--text2)">Tahmini Puan: <b style="color:var(--accent);font-size:0.9rem">${lgsR.puan}</b><span style="font-size:0.65rem">/500</span></div>
            </div>
          </div>
        </div>`;}).join('')}
    </div>`:''}

    <!-- Konu Zafiyet Haritası -->
    ${buildKonuZafiyetHTML(allEntries)}

    <!-- Koç Yorumu -->
    <div class="card" style="margin-bottom:16px;background:linear-gradient(135deg,var(--accent)10,var(--accent)04);border:1px solid var(--accent)33">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Koç Değerlendirmesi</div>
      <div style="font-size:0.86rem;line-height:1.75;color:var(--text)">${comment}</div>
    </div>
  `;

}

