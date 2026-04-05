// ai_analysis.js — Claude API Yönetimi
// ========== CLAUDE API YÖNETİMİ ==========

function toggleApiKeyVis() {
  const inp = document.getElementById('apiKeyInput');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

function initApiSettings() {
  const key  = localStorage.getItem('lgs_anthropic_key') || '';
  const enabled = localStorage.getItem('lgs_api_enabled') === 'true';
  const inp  = document.getElementById('apiKeyInput');
  const cb   = document.getElementById('apiEnabled');
  const badge= document.getElementById('apiStatusBadge');
  if (inp)  inp.value = key;
  if (cb)   cb.checked = enabled;
  if (badge) {
    badge.textContent = enabled ? 'AKTİF' : 'KAPALI';
    badge.style.background = enabled ? '#6c63ff22' : '#ff658422';
    badge.style.color = enabled ? '#6c63ff' : '#ff6584';
  }
}

function saveApiSettings() {
  const rawKey = document.getElementById('apiKeyInput')?.value || '';
  const key = rawKey.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '');
  const enabled = document.getElementById('apiEnabled')?.checked || false;
  if (key) localStorage.setItem('lgs_anthropic_key', key);
  localStorage.setItem('lgs_api_enabled', enabled ? 'true' : 'false');
  const badge = document.getElementById('apiStatusBadge');
  if (badge) {
    badge.textContent = enabled ? 'AKTİF' : 'KAPALI';
    badge.style.background = enabled ? '#6c63ff22' : '#ff658422';
    badge.style.color = enabled ? '#6c63ff' : '#ff6584';
  }
  showToast('✓', 'API ayarları kaydedildi');
}

async function testApiKey() {
  const rawKey = document.getElementById('apiKeyInput')?.value || localStorage.getItem('lgs_anthropic_key') || '';
  const key = rawKey.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '');
  const resultEl = document.getElementById('apiTestResult');
  resultEl.style.display = 'block';
  if (!key) { resultEl.style.color='#ff6584'; resultEl.textContent='Önce API anahtarı gir.'; return; }
  if (!key.startsWith('sk-ant')) { resultEl.style.color='#ff6584'; resultEl.textContent='Hata: Anahtar "sk-ant" ile başlamalı. Kopyalamayı kontrol et.'; return; }
  resultEl.style.color='var(--text2)'; resultEl.textContent='⏳ Test ediliyor... (anahtar: ...'+key.slice(-6)+')';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 20, messages: [{ role: 'user', content: 'Hi' }] })
    });
    const data = await res.json();
    if (data.content?.[0]?.text) {
      localStorage.setItem('lgs_anthropic_key', key);
      resultEl.style.color = '#20c864';
      resultEl.textContent = '✓ Bağlantı başarılı! API hazır ve kaydedildi.';
    } else {
      resultEl.style.color = '#ff6584';
      resultEl.textContent = '✗ Hata: ' + (data.error?.message || JSON.stringify(data));
    }
  } catch(e) {
    resultEl.style.color = '#ff6584';
    resultEl.textContent = '✗ Bağlantı hatası: ' + e.message;
  }
}

function clearApiKey() {
  localStorage.removeItem('lgs_anthropic_key');
  localStorage.setItem('lgs_api_enabled', 'false');
  const inp = document.getElementById('apiKeyInput');
  if (inp) inp.value = '';
  const badge = document.getElementById('apiStatusBadge');
  if (badge) { badge.textContent='KAPALI'; badge.style.background='#ff658422'; badge.style.color='#ff6584'; }
  const cb = document.getElementById('apiEnabled');
  if (cb) cb.checked = false;
  showToast('🗑', 'API anahtarı silindi');
}

async function generateAIAnalysis(studentName, period, wellnessData, academicData, denemeler, notlar) {
  const key = localStorage.getItem('lgs_anthropic_key');
  if (!key || localStorage.getItem('lgs_api_enabled') !== 'true') return null;

  // notlar parametresi artık wellnessData içinde geliyor (pozitif/negatif alanları)
  const krizGunler = wellnessData.filter(d => (d.kaygi>=8) || (d.uyku>0&&d.uyku<6) || (d.soru===0&&d.kaygi>=7));
  // Sözel veriler: wellnessData içindeki pozitif/negatif + eski notlar parametresi (uyumluluk için)
  const _notlarArr = Array.isArray(notlar) ? notlar : [];
  const _sozelWellness = wellnessData.filter(d => d.pozitif || d.negatif).slice(0, 5);
  const ogrSesi = [..._sozelWellness.map(d => ({ tarih: d.tarih, pozitif: d.pozitif||'', negatif: d.negatif||'' })),
                   ..._notlarArr].slice(0, 7);

  const prompt = 'Sen LGSKoc psikolojik analiz motorusun. Klinik egitim kocu gozuyle analiz et.\n\n' +
    'OGRENCI: ' + studentName + '\n' +
    'DONEM: ' + (period==='daily'?'Gunluk':period==='weekly'?'Haftalik':'Aylik') + '\n\n' +
    'WELLNESS (son ' + wellnessData.length + ' gun):\n' +
    wellnessData.slice(0,14).map(d=>{
      const moodTr = {'excited':'Heyecanlı','good':'İyi','focused':'Odaklı','ok':'İdare Eder','tired':'Yorgun','anxious':'Kaygılı','sad':'Mutsuz'}[d.mood]||d.mood||'-';
      return d.tarih+' Duygu:'+moodTr+' Enerji:'+d.enerji+' Kaygi:'+d.kaygi+' Uyku:'+(d.uyku||0)+'sa Soru:'+(d.soru||0)+(d.pozitif?' (+)'+d.pozitif.substring(0,40):'')+(d.negatif?' (-)'+d.negatif.substring(0,40):'');
    }).join('\n') +
    '\n\nKRIZ GUNLERI (kaygi>=8 veya uyku<6 veya akademik felc):\n' +
    (krizGunler.length>0 ? krizGunler.map(d=>d.tarih+' Kaygi:'+(d.kaygi||0)+' Uyku:'+(d.uyku||'-')+'sa Soru:'+(d.soru||0)+(!d.akademikVar&&d.kaygi>=7?' [AKADEMIK FELC]':'')).join('\n') : 'Kriz gunu yok') +
    '\n\nGUNLUK SORU COZUMU (antrenman - deneme degil):\n' +
    'Toplam: ' + academicData.toplamSoru + ' soru, ' + academicData.aktifGun + ' aktif gun\n' +
    (academicData.ortIsabet!==null ? 'Genel isabet: %'+academicData.ortIsabet+'\n' : '') +
    (academicData.dersBazli&&academicData.dersBazli.length>0 ? 'Ders bazli: '+academicData.dersBazli.map(d=>d.d+':%'+d.isabet).join(' | ')+'\n' : '') +
    'NOT: Gunluk calisma kalitesini gosterir. LGS net hesabi degil.\n\n' +
    'DENEME SINAVI SONUCLARI (resmi olcme - ayri degerlendir):\n' +
    (denemeler.length>0 ? denemeler.map(d=>d.tarih+' | '+d.baslik+' | Toplam: '+d.toplamNet+' net | '+d.dersler).join('\n') : 'Bu donemde deneme yok') +
    '\nNOT: Ders doluluk oranlari farkli: Turkce/Mat/Fen=20soru, Inkilap/Ing/Din=10soru.\n\n' +
    'OGRENCININ SESI (sozel ifadeler — en onemli analiz girdisi):\n' +
    (ogrSesi.length>0 ? ogrSesi.map(n=>n.tarih+':'+(n.pozitif?' (+)'+n.pozitif:'')+' '+(n.negatif?' (-)'+n.negatif:'')).join('\n') : 'Bu donemde sozel ifade girilmemis') +
    '\n\nKURALLAR:\n' +
    '1. Kaygi>=7+Soru=0 = Akademik Felc\n' +
    '2. Tum teshisleri TURKCE yaz\n' +
    '3. Her bolum MAX 2 cumle\n' +
    '4. Kriz gunlerini tarih tarih adlandir\n' +
    '5. deneme_yorum: veri yoksa bos string don\n\n' +
    'KRITIK: Sadece asagidaki JSON formatini don, baska hicbir sey yazma, markdown kullanma:\n' +
    '{"ana_tani":"1 cumle","uyari_seviyesi":"yesil|sari|turuncu|kirmizi","kriz_gunleri":[],"fizyolojik_yorum":"2 cumle","duygusal_yorum":"2 cumle","soru_cozumu_yorum":"2 cumle","deneme_yorum":"","brans_riski":"2 cumle","ogr_sesi_yorum":"2 cumle","koc_stratejisi":"1- 2- 3-","hafiza_borcu":"2 cumle"}';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 saniye timeout
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (!res.ok) {
      console.error('AI API hata:', res.status, data?.error?.message);
      return null;
    }
    const text = data.content?.[0]?.text || '';
    if (!text) { console.error('AI boş yanıt döndü:', JSON.stringify(data)); return null; }
    const clean = text.replace(/```json|```/g, '').trim();
    console.log('AI yanıtı (ilk 200):', clean.substring(0, 200));
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch(parseErr) {
      console.error('AI JSON parse hatası:', parseErr.message, '| Ham metin:', clean.substring(0, 300));
      return null;
    }
    // Post-process: İngilizce klinik terimleri Türkçeleştir
    const trTerms = {
      'avoidance through activity': 'çalışma görüntüsüyle kaçınma',
      'activity avoidance': 'aktiviteyle kaçınma',
      'avoidance': 'kaçınma',
      'over-compensation': 'aşırı telafi',
      'over compensation': 'aşırı telafi',
      'overcompensation': 'aşırı telafi',
      'denial': 'inkâr',
      'therapeutic denial': 'savunma amaçlı inkâr',
      'sanitization': 'olumsuzluğu önemsizleştirme',
      'dysregulation': 'düzensizlik',
      'dysregülasyon': 'düzensizlik',
      'bodyscan': 'beden tarama',
      'fragile': 'kırılgan',
      'resilience': 'psikolojik dayanıklılık',
      'burnout': 'tükenmişlik',
      'helplessness': 'çaresizlik hissi',
      'catastrophizing': 'felaketleştirme',
      'imposter': 'sahtekar sendromu',
      'procrastination': 'erteleme',
      'compensation': 'telafi',
      'suppression': 'bastırma',
      'projection': 'yansıtma',
    };
    const turkcelestir = (text) => {
      if (!text) return text;
      let result = text;
      for (const [en, tr] of Object.entries(trTerms)) {
        const regex = new RegExp(en, 'gi');
        result = result.replace(regex, tr);
      }
      return result;
    };
    // Tüm string alanları Türkçeleştir
    for (const key of Object.keys(parsed)) {
      if (typeof parsed[key] === 'string') {
        parsed[key] = turkcelestir(parsed[key]);
      } else if (Array.isArray(parsed[key])) {
        parsed[key] = parsed[key].map(v => typeof v === 'string' ? turkcelestir(v) : v);
      }
    }
    showToast('✅', 'AI hazır: ' + (parsed.ana_tani||'?').substring(0,30));
    return parsed;
  } catch(e) {
    console.error('AI analiz HATA:', e.message, e);
    return null;
  }
}


// Wellness sayfası açıldığında gün kontrolü — dünün verisi varsa inputları sıfırla
