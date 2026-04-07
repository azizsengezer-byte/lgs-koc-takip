// ── SATIN ALMA SAYFASI ────────────────────────────────────────
function satinAlPage() {
  const planlar = [
    {
      id:'baslangic', isim:'Başlangıç', ogrenci:'5 öğrenciye kadar',
      aylik:249, yillik:2490,
      renk:'#1D9E75', bgRenk:'#E1F5EE', textRenk:'#085041',
      populer:false, aiLimit:20, deneme:true,
    },
    {
      id:'standart', isim:'Standart', ogrenci:'15 öğrenciye kadar',
      aylik:599, yillik:5990,
      renk:'#534AB7', bgRenk:'#EEEDFE', textRenk:'#3C3489',
      populer:true, aiLimit:75, deneme:false,
    },
    {
      id:'pro', isim:'Pro', ogrenci:'30 öğrenciye kadar',
      aylik:999, yillik:9990,
      renk:'#BA7517', bgRenk:'#FAEEDA', textRenk:'#633806',
      populer:false, aiLimit:150, deneme:false,
    },
  ];

  const ozellikler = [
    { t:'Günlük çalışma takibi' },
    { t:'Ödev atama' },
    { t:'Mesajlaşma & bildirimler' },
    { t:'Bireysel Analiz Raporu (PDF)' },
    { t:'Psikolojik Takip Raporu (PDF)' },
    { t:'AI Analiz', ai:true },
    { t:'Detaylı analitik' },
    { t:'Duygu-Durum takibi' },
  ];

  const kartlar = planlar.map(p => {
    const ozelHTML = ozellikler.map(o => `
      <div style="display:flex;align-items:center;gap:8px;padding:3px 0">
        <span style="font-size:0.8rem;color:${p.renk};width:14px;flex-shrink:0">✓</span>
        <span style="font-size:0.82rem;color:var(--text)">${o.t}</span>
        ${o.ai ? `<span style="font-size:0.68rem;background:${p.bgRenk};color:${p.textRenk};border-radius:99px;padding:2px 8px;white-space:nowrap;margin-left:auto;flex-shrink:0">${p.aiLimit} sorgu/ay</span>` : ''}
      </div>`).join('');

    return `
    <div id="planKart_${p.id}" style="position:relative;background:var(--surface);border:${p.populer?`2px solid ${p.renk}`:'1px solid var(--border)'};border-radius:18px;padding:${p.populer?'22px 18px 18px':'18px'};margin-bottom:14px;overflow:visible">
      ${p.populer ? `<div style="position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:${p.renk};color:#fff;font-size:0.7rem;font-weight:800;padding:3px 14px;border-radius:99px;white-space:nowrap">En popüler</div>` : ''}
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
        <div>
          <div style="font-size:1rem;font-weight:800;color:var(--text)">${p.isim}</div>
          <div style="font-size:0.72rem;color:var(--text2);margin-top:2px">${p.ogrenci}</div>
          ${p.deneme ? `<div style="display:inline-block;margin-top:5px;font-size:0.68rem;background:${p.bgRenk};color:${p.textRenk};border-radius:99px;padding:2px 9px;font-weight:700">8 gün ücretsiz deneme</div>` : ''}
        </div>
        <div style="background:${p.bgRenk};color:${p.textRenk};border-radius:10px;padding:5px 10px;text-align:right;flex-shrink:0">
          <div id="fiyatSayi_${p.id}" style="font-size:1.35rem;font-weight:900">₺${p.aylik}</div>
          <div style="font-size:0.68rem;opacity:0.8">/ay</div>
        </div>
      </div>
      <div id="yillikNot_${p.id}" style="display:none;font-size:0.72rem;color:#1D9E75;margin-bottom:8px">
        ₺${p.yillik}/yıl &nbsp;·&nbsp; <s style="color:var(--text2);opacity:0.6">₺${p.aylik*12}</s>
      </div>
      <div style="border-top:1px solid var(--border);margin:10px 0"></div>
      ${ozelHTML}
      <button onclick="satinAlTiklandi('${p.id}','${p.isim}',${p.deneme})"
        style="width:100%;margin-top:14px;padding:11px;border-radius:12px;cursor:pointer;font-family:inherit;font-size:0.88rem;font-weight:700;
          border:${p.populer?'none':`2px solid ${p.renk}`};
          background:${p.populer?p.renk:'transparent'};
          color:${p.populer?'#fff':p.renk}">
        ${p.deneme ? '8 gün ücretsiz dene →' : p.populer ? 'Hemen başla →' : 'Planı seç'}
      </button>
    </div>`;
  }).join('');

  return `
    <div class="page-title">💳 Abonelik Planları</div>
    <div class="page-sub">İhtiyacına en uygun planı seç</div>

    <!-- Fatura döngüsü toggle -->
    <div style="display:flex;align-items:center;background:var(--surface2);border-radius:99px;padding:3px;width:fit-content;margin:14px auto 22px">
      <button id="toggleAylik" onclick="satirToggle('aylik')"
        style="padding:7px 20px;border-radius:99px;border:none;cursor:pointer;font-size:0.85rem;font-weight:700;font-family:inherit;background:var(--surface);color:var(--text)">
        Aylık
      </button>
      <button id="toggleYillik" onclick="satirToggle('yillik')"
        style="padding:7px 20px;border-radius:99px;border:none;cursor:pointer;font-size:0.85rem;font-weight:700;font-family:inherit;background:transparent;color:var(--text2);display:flex;align-items:center;gap:6px">
        Yıllık <span style="font-size:0.65rem;background:#1D9E75;color:#E1F5EE;border-radius:99px;padding:2px 7px;font-weight:800">-2 ay</span>
      </button>
    </div>

    ${kartlar}

    <div style="background:var(--surface2);border-radius:14px;padding:14px 16px;margin-bottom:24px">
      <div style="font-size:0.78rem;color:var(--text2);line-height:1.8">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px">ℹ️ Bilgi</div>
        · İstediğin zaman iptal edebilirsin, ücret alınmaz.<br>
        · Planını dilediğin zaman yükseltebilir veya düşürebilirsin.<br>
        · Sorular için: <a href="mailto:destek@lgskoc.app" style="color:var(--accent);font-weight:700">destek@lgskoc.app</a>
      </div>
    </div>
  `;
}

function satirToggle(tip) {
  const aylikBtn  = document.getElementById('toggleAylik');
  const yillikBtn = document.getElementById('toggleYillik');
  if (!aylikBtn) return;

  if (tip === 'aylik') {
    aylikBtn.style.background  = 'var(--surface)';  aylikBtn.style.color  = 'var(--text)';
    yillikBtn.style.background = 'transparent';      yillikBtn.style.color = 'var(--text2)';
  } else {
    yillikBtn.style.background = 'var(--surface)';  yillikBtn.style.color = 'var(--text)';
    aylikBtn.style.background  = 'transparent';      aylikBtn.style.color  = 'var(--text2)';
  }
  yillikBtn.innerHTML = 'Yıllık <span style="font-size:0.65rem;background:#1D9E75;color:#E1F5EE;border-radius:99px;padding:2px 7px;font-weight:800">-2 ay</span>';

  const planlar = [
    { id:'baslangic', aylik:249, yillik:2490 },
    { id:'standart',  aylik:599, yillik:5990 },
    { id:'pro',       aylik:999, yillik:9990 },
  ];

  planlar.forEach(p => {
    const sayi = document.getElementById('fiyatSayi_' + p.id);
    const not  = document.getElementById('yillikNot_'  + p.id);
    if (!sayi) return;
    if (tip === 'yillik') {
      sayi.textContent = '₺' + Math.round(p.yillik / 12);
      if (not) not.style.display = 'block';
    } else {
      sayi.textContent = '₺' + p.aylik;
      if (not) not.style.display = 'none';
    }
  });
}

function satinAlTiklandi(planId, planIsim, deneme) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  const deneBtn = deneme
    ? `<div style="font-size:0.75rem;color:var(--text2);text-align:center;margin-top:10px">8 gün ücretsiz — sonrasında ücret başlar</div>`
    : '';
  modal.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:28px 20px 36px">
      <div style="width:36px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 20px"></div>
      <div style="font-size:1.8rem;text-align:center;margin-bottom:8px">🚀</div>
      <div style="font-size:1.05rem;font-weight:800;text-align:center;margin-bottom:8px">${planIsim} Planı</div>
      <div style="font-size:0.82rem;color:var(--text2);text-align:center;margin-bottom:22px;line-height:1.6">
        Ödeme altyapısı yakında aktif olacak.<br>
        Şu an erken erişim için bize ulaşabilirsin.
      </div>
      <a href="mailto:destek@lgskoc.app?subject=${encodeURIComponent(planIsim + ' Planı - Abonelik Talebi')}"
        style="display:block;width:100%;box-sizing:border-box;padding:13px;border-radius:13px;
          background:var(--accent);color:#fff;text-align:center;text-decoration:none;
          font-size:0.92rem;font-weight:800;font-family:inherit;margin-bottom:10px">
        📧 Talep Gönder
      </a>
      ${deneBtn}
      <button onclick="this.closest('[style*=fixed]').remove()"
        style="width:100%;padding:12px;border-radius:13px;border:1.5px solid var(--border);
          background:transparent;color:var(--text2);font-size:0.88rem;font-weight:600;
          cursor:pointer;font-family:inherit;margin-top:8px">
        Kapat
      </button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

