function checkAllWellnessNotifications(studentUid, data, todayKey) {
  const days   = data.days || {};
  const today  = days[todayKey] || {};
  const name   = (window.currentUserData||{}).name?.split(' ')[0] || 'Sen';
  const GOAL   = window.RC_GUNLUK_HEDEF || 200;

  const kaygi  = parseFloat(today.kaygi) || 0;
  const enerji = parseFloat(today.enerji) || 0;
  const uyku   = parseFloat(today.uyku) || 0;
  const odak   = parseFloat(today.odak) || 0;
  const mood   = today.mood || '';
  const negatif= today.negatif || '';
  const zorDers= today.zorDers || '';

  // Bugünkü akademik veriler (localStorage'dan hızlı çek)
  const myUid  = (window.currentUserData||{}).uid || '';
  const myName = (window.currentUserData||{}).name || '';
  const todayEntries = studyEntries.filter(e => (e.studentName===myName||e.userId===myUid) && e.dateKey===todayKey);
  const todayQ = todayEntries.filter(e=>e.type==='soru').reduce((a,e)=>a+(e.questions||0),0);
  const todayNet = todayEntries.filter(e=>e.type==='soru').reduce((a,e)=>a+(e.net||0),0);
  const todayDen = todayEntries.filter(e=>e.type==='deneme');
  const todayDenNet = todayDen.length>0 ? todayDen.reduce((a,e)=>a+(e.net||0),0)/todayDen.length : null;

  // Son 3 gün verileri
  const last3 = [0,1,2].map(i=>{ const d=new Date(); d.setDate(d.getDate()-i); return days[d.toISOString().split('T')[0]]||{}; });
  const negativeMoods = ['anxious','sad','tired'];
  const consecutive3Neg = last3.every(d=>negativeMoods.includes(d.mood));
  const consecutive3LowEnerji = last3.every(d=>parseFloat(d.enerji)>0 && parseFloat(d.enerji)<=4);

  const notifications = [];

  // ──────────────────────────────────────────────────────────
  // KATMAN 1: "AYNA TUTMA" — Veri Yorumlama
  // ──────────────────────────────────────────────────────────

  // 1A. Başarı-Kaygı Zıtlığı: İyi deneme AMA kaygı yüksek
  if (kaygi >= 8 && todayDenNet !== null && todayDenNet > 0) {
    notifications.push({
      msg: `✨ Harika bir başarı elde etmişsin ama kaygı seviyen hâlâ yüksek görünüyor. Unutma, bu netleri SEN yaptın! Kendine biraz kredi vermeye ne dersin?`,
      type: 'basari_kaygi_zitligi', priority: 1, color: '#f9ca24', icon: '✨',
      koç: `${name} bugün iyi deneme neti aldı ancak kaygı ${kaygi}/10 bildirdi. Mükemmeliyetçilik örüntüsü izleniyor.`
    });
  }

  // 1B. Enerji-Disiplin Uyumu: Düşük enerji AMA çok soru çözdü
  if (enerji > 0 && enerji <= 4 && todayQ >= GOAL * 0.8) {
    notifications.push({
      msg: `💪 Bugün enerjin düşük olmasına rağmen masadan kalkmamışsın. Bu disiplin seni hedefine götürecek en büyük gücün! Gurur duy kendinle.`,
      type: 'enerji_disiplin_uyumu', priority: 1, color: '#43e97b', icon: '💪',
      koç: `${name} düşük enerjiyle (${enerji}/10) hedefe yakın soru çözdü (${todayQ}). Yüksek disiplin göstergesi.`
    });
  }

  // 1C. Düşük enerji — sadece enerji düşükse de bildir
  if (enerji > 0 && enerji <= 3 && todayQ < GOAL * 0.8) {
    notifications.push({
      msg: `⚡ Enerjin bugün oldukça düşük görünüyor. Küçük hedefler koy — sadece 30 dakika bir konuya odaklan. Küçük adımlar da ilerlemedir!`,
      type: 'dusuk_enerji_genel', priority: 2, color: '#f9ca24', icon: '⚡',
      koç: `${name} düşük enerji (${enerji}/10) bildirdi. Motivasyon ve çalışma hacmi takip edilmeli.`
    });
  }

  // 1D. Yüksek Enerji - Düşük Üretim
  if (enerji >= 8 && todayQ > 0 && todayQ < GOAL * 0.4) {
    notifications.push({
      msg: `🚀 Enerjin çok yüksek bugün! Bu enerjiyi biraz daha sorulara yönlendirirsen sonuçlar seni şaşırtacak. Hadi devam!`,
      type: 'yuksek_enerji_dusuk_uretim', priority: 2, color: '#6c63ff', icon: '🚀',
      koç: `${name} yüksek enerji (${enerji}/10) bildirdi ama soru sayısı düşük (${todayQ}).`
    });
  }

  // ──────────────────────────────────────────────────────────
  // KATMAN 2: "TAHMİN VE ÖNLEME" — Risk Yönetimi
  // ──────────────────────────────────────────────────────────

  // 2A. Yüksek Kaygı — tek başına bile bildir (en yaygın senaryo)
  if (kaygi >= 8 && notifications.filter(n=>n.type==='basari_kaygi_zitligi').length === 0) {
    const dersRef = zorDers ? ` ${zorDers} dersine` : '';
    notifications.push({
      msg: `😰 Kaygı seviyen bugün oldukça yüksek (${kaygi}/10). Başlamadan önce${dersRef} bildiğin bir konudan 10 soru çöz — 'başarı hissiyle' ısın. Küçük bir kazanım büyük fark yaratır! 🎯`,
      type: 'yuksek_kaygi_genel', priority: 1, color: '#ff6b6b', icon: '😰',
      koç: `${name} yüksek kaygı bildirdi (${kaygi}/10). Günlük akademik performans yakından izlenmeli.`
    });
  }

  // 2B. Orta Kaygı — hatırlatma
  if (kaygi >= 6 && kaygi < 8) {
    notifications.push({
      msg: `🧘 Kaygı seviyen biraz yükselmiş (${kaygi}/10). Bu normal — sınav döneminde herkes hisseder. Bugün sadece çalıştığın sürece odaklan, sonuca değil.`,
      type: 'orta_kaygi', priority: 3, color: '#fd79a8', icon: '🧘',
      koç: `${name} orta düzey kaygı (${kaygi}/10) bildirdi.`
    });
  }

  // 2C. Zihinsel Sis: Az uyku (saat bağımsız)
  if (uyku > 0 && uyku < 6.5) {
    const dersOnerisi = zorDers || 'en önemli konunu';
    notifications.push({
      msg: `😴 Az uyudun bugün (${uyku} saat). Odaklanmakta zorlanabilirsin — ${dersOnerisi} en dinç olduğun ilk 2 saate koy, sonra hafif konulara geç. Kaliteli 2 saat, yorgun 5 saatten iyidir!`,
      type: 'zihinsel_sis', priority: 1, color: '#ff9f43', icon: '😴',
      koç: `${name} ${uyku} saat uyudu. Zihinsel yorgunluk riski — program hafifletilmesi önerilebilir.`
    });
  }

  // 2D. Düşük Odak — tek başına bildir
  if (odak > 0 && odak <= 4) {
    notifications.push({
      msg: `🎯 Odaklanma zorluğu yaşıyorsun (${odak}/10). 25 dakika çalış, 5 dakika gerçekten kalk — Pomodoro tekniğini dene. Telefonu başka odaya bırak. Kalite, saatten önemli!`,
      type: 'dusuk_odak_genel', priority: 2, color: '#45b7d1', icon: '🎯',
      koç: `${name} düşük odak bildirdi (${odak}/10). Verimlilik tekniği önerildi.`
    });
  }

  // 2E. Olumsuz Düşünce Kırıcı
  if (negatif && (negatif.includes('yapamam') || negatif.includes('korkuyor') || negatif.includes('başaramam') || negatif.includes('geç kaldım') || negatif.includes('olmaz') || negatif.includes('zor'))) {
    const bestEntry = studyEntries.filter(e=>(e.studentName===myName||e.userId===myUid)&&e.type==='deneme').sort((a,b)=>(b.net||0)-(a.net||0))[0];
    const bestRef = bestEntry ? `${bestEntry.examTitle||'son denemedeki'} ${bestEntry.net?.toFixed(1)||''} neti` : 'geçen haftaki çalışmalarını';
    notifications.push({
      msg: `🤝 Zihninden geçen o olumsuz düşünceyi gördüm. Bu sadece bir düşünce, gerçek değil. ${bestRef} hatırla — bunu yapabilirsin!`,
      type: 'olumsuz_dusunce_kirici', priority: 1, color: '#a29bfe', icon: '🤝',
      koç: `${name} olumsuz düşünce kaydetti. Motivasyon desteği gerekiyor.`
    });
  }

  // ──────────────────────────────────────────────────────────
  // KATMAN 3: "DUYGUSAL REÇETE" — Aksiyon Önerisi
  // ──────────────────────────────────────────────────────────

  // 3A. Tükenmişlik Sinyali: 3 gün düşük enerji + olumsuz duygu
  if (consecutive3LowEnerji && (mood === 'tired' || mood === 'sad')) {
    notifications.push({
      msg: `🌊 Son 3 gündür pillerin biraz boşalmış görünüyor. Bugün programını %20 hafifletip akşam en çok sevdiğin bir şeyi yapmaya vakit ayır. Dinlenmek de çalışmaya dahildir! 🌙`,
      type: 'tukenmisl_sinyali', priority: 1, color: '#fd79a8', icon: '🌊',
      koç: `⚠️ ${name} 3 gündür düşük enerji + olumsuz duygu bildiriyor. Tükenmişlik riski. Acil görüşme önerilir.`
    });
  }

  // 3B. 3 Gün Üst Üste Olumsuz Duygu
  if (consecutive3Neg && !consecutive3LowEnerji) {
    notifications.push({
      msg: `💙 Son birkaç gündür zorlu bir süreç geçiriyorsun. Bu hisler geçici — sen bu süreçten daha güçlü çıkacaksın. Koçunla konuşmak ister misin?`,
      type: 'mood_consecutive', priority: 1, color: '#778ca3', icon: '💙',
      koç: `⚠️ ${name} son 3 gündür olumsuz duygu bildiriyor. Görüşme planlanması önerilir.`
    });
  }

  // 3C. Mutsuz/Yorgun duygu — tek günlük de bildir
  if ((mood === 'sad' || mood === 'anxious') && !consecutive3Neg) {
    const moodMsg = mood === 'sad'
      ? `Bugün kendini iyi hissetmiyorsun — bu tamamen normal. Küçük bir yürüyüş veya sevdiğin bir müzik sana iyi gelebilir. Yarın yeni bir gün! 🌱`
      : `Kaygılı hissediyorsun. Derin bir nefes al — 4 sayı içeri, 4 sayı tut, 4 sayı dışarı. Şimdi sadece önündeki tek göreve odaklan. 🌬️`;
    notifications.push({
      msg: moodMsg,
      type: 'duygu_destegi', priority: 2, color: '#a29bfe', icon: mood === 'sad' ? '💙' : '🌬️',
      koç: `${name} bugün "${mood === 'sad' ? 'Mutsuzum' : 'Kaygılı'}" bildirdi.`
    });
  }

  // 3D. Yorgun duygu
  if (mood === 'tired' && !consecutive3LowEnerji) {
    notifications.push({
      msg: `😔 Bugün yorgunsun. Kısa bir mola ver, 10 dakika gözlerini kapat. Sonra sadece 1 konuya odaklan — hepsini birden yapmak zorunda değilsin. Adım adım! 🐢`,
      type: 'yorgun_duygu', priority: 2, color: '#fd79a8', icon: '😔',
      koç: `${name} yorgun hissediyor. Çalışma temposu izlenmeli.`
    });
  }

  if (notifications.length === 0) return;

  // Önceliğe göre sırala (1 = en kritik)
  notifications.sort((a,b) => a.priority - b.priority);

  // Öğrenciye en kritik bildirimi göster
  showWellnessFeedbackModal(notifications[0]);

  // Koça tüm kritik bildirimleri gönder (priority 1 olanlar)
  notifications.filter(n=>n.priority===1).forEach(n => {
    if (n.koç) sendWellnessNotification(studentUid, n.koç, n.type);
  });
}

// Öğrenciye anlık geri bildirim modalı
function showWellnessFeedbackModal(notif) {
  const existing = document.getElementById('wellnessFeedbackModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'wellnessFeedbackModal';
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.6);
    display:flex; align-items:flex-end; justify-content:center;
    z-index:9999; padding:16px; animation:fadeIn .2s ease;
  `;
  modal.innerHTML = `
    <div style="
      background:var(--surface); border:1px solid var(--border);
      border-radius:20px 20px 16px 16px; width:100%; max-width:480px;
      padding:24px 20px 20px; box-shadow:0 -8px 40px rgba(0,0,0,0.4);
      border-top:3px solid ${notif.color};
    ">
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px">
        <div style="font-size:1.8rem;line-height:1">${notif.icon}</div>
        <div style="flex:1">
          <div style="font-weight:800;font-size:0.95rem;color:var(--text);line-height:1.6">
            ${notif.msg}
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('wellnessFeedbackModal').remove()"
          style="flex:1;padding:12px;background:${notif.color};border:none;border-radius:12px;
                 color:#fff;font-weight:800;font-size:0.92rem;cursor:pointer;font-family:inherit">
          Anladım 👍
        </button>
        <button onclick="document.getElementById('wellnessFeedbackModal').remove()"
          style="padding:12px 16px;background:var(--surface2);border:1px solid var(--border);
                 border-radius:12px;color:var(--text2);font-weight:700;font-size:0.85rem;
                 cursor:pointer;font-family:inherit">
          Kapat
        </button>
      </div>
    </div>
  `;
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
  document.body.appendChild(modal);
}

// Koça bildirim gönder
async function sendWellnessNotification(studentUid, text, type) {
  if (!db || !studentUid) return;
  try {
    const teacherId = (window.currentUserData||{}).teacherId;
    if (!teacherId) return;
    const todayKey = getTodayKey();
    const existing = await db.collection('notifications')
      .where('toUid','==',teacherId)
      .where('fromUid','==',studentUid)
      .where('type','==',type)
      .where('dateKey','==',todayKey)
      .get();
    if (!existing.empty) return;
    const studentName = (window.currentUserData||{}).name || '';
    await db.collection('notifications').add({
      toUid: teacherId,
      fromUid: studentUid,
      text,
      type,
      dateKey: todayKey,
      actionUrl: `/?p=student-detail&s=${encodeURIComponent(studentName)}`,
      meta: { studentName, actionUrl: `/?p=student-detail&s=${encodeURIComponent(studentName)}` },
      read: false,
      time: new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch(e) { console.log('Wellness notif error:', e.message); }
}

// 3 gün üst üste olumsuz duygu kontrolü (geriye dönük uyumluluk)
function checkConsecutiveNegativeMoods(studentUid, data) {
  // Artık checkAllWellnessNotifications içinde yönetiliyor
}

function _updateWellnessButtons(field, value, activeBtn) {
  const parent = activeBtn.parentElement;
  if (!parent) return;
  const moodColors = { excited:'#f9ca24', good:'#45b7d1', focused:'#6c63ff', ok:'#a29bfe', tired:'#fd79a8', anxious:'#ff6b6b', sad:'#778ca3' };
  parent.querySelectorAll('button').forEach(b => {
    const isActive = b === activeBtn;
    const col = field === 'mood' ? (moodColors[value]||'var(--accent)') : 'var(--accent)';
    b.style.borderColor = isActive ? col : 'var(--border)';
    b.style.background  = isActive ? col+'22' : 'transparent';
    const lbl = b.querySelector('span:last-child');
    if (lbl) lbl.style.color = isActive ? col : 'var(--text2)';
  });
}


async function loadAllStudentsMoodCache() {
  if (!window._wellnessCache) window._wellnessCache = {};
  const todayKey = getTodayKey();
  for (const s of students) {
    try {
      const uid = s.uid || s.name;
      const data = await getWellnessData(uid);
      if (data?.days?.[todayKey]?.mood) {
        window._wellnessCache[s.name] = data.days[todayKey];
      }
    } catch(e) {}
  }
}

async function getWellnessData(uid) {
  if (!uid || uid === 'local') return {};
  try {
    if (db) {
      const snap = await db.collection('wellness').doc(uid).get();
      if (snap.exists) {
        const fresh = snap.data();
        localStorage.setItem('wellness_'+uid, JSON.stringify(fresh));
        return fresh;
      }
    }
    return JSON.parse(localStorage.getItem('wellness_'+uid)||'{}');
  } catch(e) {
    return JSON.parse(localStorage.getItem('wellness_'+uid)||'{}');
  }
}

async function loadWellnessFromFirestore() {
  const myUid = (window.currentUserData||{}).uid;
  if (!myUid || !db) return;
  try {
    const snap = await db.collection('wellness').doc(myUid).get();
    if (snap.exists) {
      const data = snap.data();
      localStorage.setItem('wellness_'+myUid, JSON.stringify(data));
      window._wellnessCache = data; // global cache - dashboard için
    }
  } catch(e) {}
}


function studentKazanimlar() {
  return `
    <div class="page-title">🎯 Kazanımlarım</div>
    <div class="page-sub">LGS müfredatına göre tamamladığın konular</div>
    ${subjects.map(s=>{
      const kList = kazanimlar[s.name] || [];
      const done = kList.filter((_,i)=> kazanimDone[s.name+i]).length;
      const pct = kList.length ? Math.round(done/kList.length*100) : 0;
      return `
        <div class="card" style="margin-bottom:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div class="card-title c-${s.cls}" style="margin:0">${s.icon} ${s.name}</div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:0.85rem;color:var(--text2)">${done}/${kList.length} kazanım</div>
              <span class="badge ${pct>=70?'badge-green':pct>=40?'badge-yellow':'badge-red'}">${pct}%</span>
            </div>
          </div>
          <div class="bar-bg" style="margin-bottom:14px"><div class="bar-fill bg-${s.cls}" style="width:${pct}%"></div></div>
          <div class="kazanim-grid">
            ${kList.map((k,i)=>{ const label = typeof k === 'object' ? k.unite : k; return `
              <div class="kazanim-item ${kazanimDone[s.name+i]?'done':''}" onclick="toggleKazanim('${s.name}',${i},this)">
                <div class="kazanim-check">${kazanimDone[s.name+i]?'✓':''}</div>
                <span>${label}</span>
              </div>
            `; }).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function studentTasks() {
  const bugun = getTodayKey();
  const gorunenGorevler = tasks.filter(t => {
    if (t.done) return true;
    if (!t.dueRaw) return true;
    return t.dueRaw >= bugun;
  });

  if (gorunenGorevler.length === 0) {
    return '<div class="page-title">📋 Ödevlerim</div>' +
      '<div class="page-sub">Koç tarafından atanan görevler</div>' +
      '<div style="text-align:center;padding:40px 20px;color:var(--text2)">' +
        '<div style="font-size:2rem;margin-bottom:8px">✅</div>' +
        '<div style="font-size:14px;font-weight:700">Bekleyen ödev yok</div>' +
        '<div style="font-size:12px;margin-top:4px">Koçun yeni görev atadığında burada görünür</div>' +
      '</div>';
  }

  return '<div class="page-title">📋 Ödevlerim</div>' +
    '<div class="page-sub">Koç tarafından atanan görevler</div>' +
    gorunenGorevler.map(function(t) {
      var idx = tasks.indexOf(t);
      var sureBugün = t.dueRaw && t.dueRaw === bugun;
      var tarihRenk = sureBugün ? '#f9ca24' : 'var(--text2)';
      var cardStyle = (t.dueRaw && t.dueRaw === bugun && !t.done) ? 'border-left:3px solid #f9ca24;' : '';
      var tamamlaBtn = !t.done ? '<button class="btn btn-success" style="padding:8px 14px;font-size:0.8rem" onclick="completeTask(' + idx + ')">Tamamla ✓</button>' : '';
      return '<div class="assignment-card" style="' + cardStyle + '">' +
        '<div class="assignment-icon" style="background:rgba(108,99,255,.15);color:var(--accent);font-size:1.3rem">📝</div>' +
        '<div style="flex:1">' +
          '<div class="assignment-title">' + t.title + '</div>' +
          '<div class="assignment-desc">' + (t.desc||'') + ' • ' + (t.subject||'') + '</div>' +
          '<div class="assignment-footer">' +
            '<span class="badge ' + (t.done ? 'badge-green' : 'badge-yellow') + '">' + (t.done ? '✓ Tamamlandı' : '⏳ Bekliyor') + '</span>' +
            '<span style="font-size:0.78rem;color:' + tarihRenk + '">📅 Son: ' + (t.due||'—') + '</span>' +
          '</div>' +
        '</div>' +
        tamamlaBtn +
      '</div>';
    }).join('');
}

/* =================== MESSAGING =================== */
