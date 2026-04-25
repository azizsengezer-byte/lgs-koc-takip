function nefesEgzersiziAc() {
  _nefesOyunuAc();
}

function _nefesOyunuAc() {
  const existing = document.getElementById('_nefesOyunModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_nefesOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#0a1628,#1a2540);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:24px;overflow:hidden;
  `;

  modal.innerHTML = `
    <button onclick="_nefesKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <!-- Açıklama / başlangıç ekranı -->
    <div id="_nefesIntro" style="text-align:center;color:#fff;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🫁</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Nefes Egzersizi</div>
      <div style="font-size:0.88rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:20px">
        4-7-8 tekniği — sınav kaygısını azaltan, sinir sistemini yatıştıran bilimsel bir nefes egzersizi.
        <br><br>
        <b style="color:#5BBFFF">4 saniye</b> nefes al →
        <b style="color:#FAC775">7 saniye</b> tut →
        <b style="color:#5DCAA5">8 saniye</b> nefes ver
        <br><br>
        <span style="font-size:0.8rem;color:rgba(255,255,255,0.5)">Ne zaman ihtiyacın olursa aç — sınırsız, skor yok.</span>
      </div>
      <button onclick="_nefesBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#5BBFFF,#185FA5);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(91,191,255,0.4)">
        Başla →
      </button>
    </div>

    <!-- Egzersiz ekranı -->
    <div id="_nefesGame" style="display:none;text-align:center;color:#fff;width:100%;max-width:380px">
      <div id="_nefesDongu" style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:12px">DÖNGÜ 1</div>

      <!-- Daire -->
      <div style="position:relative;width:240px;height:240px;margin:0 auto 30px;display:flex;align-items:center;justify-content:center">
        <div id="_nefesRing" style="position:absolute;width:240px;height:240px;border-radius:50%;border:3px solid rgba(91,191,255,0.3);transition:all 0.5s"></div>
        <div id="_nefesCore" style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#5BBFFF,#185FA5);transition:all 4s cubic-bezier(0.4,0,0.6,1);box-shadow:0 0 60px rgba(91,191,255,0.6)"></div>
      </div>

      <div id="_nefesFaz" style="font-size:1.6rem;font-weight:800;margin-bottom:6px">HAZIR OL</div>
      <div id="_nefesSayac" style="font-size:0.9rem;color:rgba(255,255,255,0.6);margin-bottom:18px">3</div>

      <button onclick="_nefesBitirManuel()" style="padding:10px 24px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.7);font-size:0.82rem;font-weight:600;cursor:pointer;font-family:inherit">
        Yeterli — Bitir
      </button>
    </div>

    <!-- Bitiş ekranı -->
    <div id="_nefesBitis" style="display:none;text-align:center;color:#fff;max-width:340px">
      <div style="font-size:3rem;margin-bottom:10px">✨</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px">Güzel gidiyor</div>
      <div id="_nefesBitisAlt" style="font-size:0.9rem;color:rgba(255,255,255,0.65);margin-bottom:20px;line-height:1.6"></div>
      <div style="display:flex;gap:10px;justify-content:center">
        <button onclick="_nefesKapat()" style="padding:12px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.8);font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          Tamam
        </button>
        <button onclick="_nefesTekrar()" style="padding:12px 24px;border-radius:12px;border:none;background:rgba(91,191,255,0.2);color:#5BBFFF;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(91,191,255,0.4)">
          🫁 Tekrar Başla
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

let _nefesState = null;

function _nefesBasla() {
  document.getElementById('_nefesIntro').style.display = 'none';
  document.getElementById('_nefesGame').style.display = 'block';
  const bitisEl = document.getElementById('_nefesBitis');
  if (bitisEl) bitisEl.style.display = 'none';

  _nefesState = {
    dongu: 0,
    timer: null,
    aktif: true,
  };

  _nefesGeriSayim(3, () => _nefesDonguBasla());
}

function _nefesGeriSayim(saniye, onDone) {
  const fazEl = document.getElementById('_nefesFaz');
  const sayacEl = document.getElementById('_nefesSayac');
  if (fazEl) { fazEl.textContent = 'HAZIR OL'; fazEl.style.color = '#fff'; }
  let kalan = saniye;
  if (sayacEl) sayacEl.textContent = String(kalan);
  const timer = setInterval(() => {
    if (!_nefesState || !_nefesState.aktif) { clearInterval(timer); return; }
    kalan--;
    if (sayacEl) sayacEl.textContent = String(kalan);
    if (kalan <= 0) { clearInterval(timer); onDone(); }
  }, 1000);
  if (_nefesState) _nefesState.timer = timer;
}

function _nefesDonguBasla() {
  if (!_nefesState || !_nefesState.aktif) return;
  _nefesState.dongu++;
  const donguEl = document.getElementById('_nefesDongu');
  if (donguEl) donguEl.textContent = `DÖNGÜ ${_nefesState.dongu}`;

  // Faz 1: Nefes al (4 sn)
  _nefesFaz('AL', '#5BBFFF', 4, 220, () => {
    if (!_nefesState || !_nefesState.aktif) return;
    // Faz 2: Tut (7 sn)
    _nefesFaz('TUT', '#FAC775', 7, 220, () => {
      if (!_nefesState || !_nefesState.aktif) return;
      // Faz 3: Ver (8 sn)
      _nefesFaz('VER', '#5DCAA5', 8, 60, () => {
        if (!_nefesState || !_nefesState.aktif) return;
        // Kısa ara sonra bir sonraki döngü
        setTimeout(() => _nefesDonguBasla(), 800);
      });
    });
  });
}

function _nefesFaz(label, renk, saniye, hedefBoyut, onDone) {
  const fazEl = document.getElementById('_nefesFaz');
  const sayacEl = document.getElementById('_nefesSayac');
  const coreEl = document.getElementById('_nefesCore');
  const ringEl = document.getElementById('_nefesRing');

  if (fazEl) { fazEl.textContent = 'NEFES ' + label; fazEl.style.color = renk; }
  if (coreEl) {
    coreEl.style.transition = `all ${saniye}s cubic-bezier(0.4,0,0.6,1)`;
    coreEl.style.width = hedefBoyut + 'px';
    coreEl.style.height = hedefBoyut + 'px';
    coreEl.style.background = `linear-gradient(135deg,${renk},${renk}88)`;
    coreEl.style.boxShadow = `0 0 80px ${renk}99`;
  }
  if (ringEl) ringEl.style.borderColor = renk + '66';

  let kalan = saniye;
  if (sayacEl) sayacEl.textContent = String(kalan);
  const timer = setInterval(() => {
    if (!_nefesState || !_nefesState.aktif) { clearInterval(timer); return; }
    kalan--;
    if (sayacEl) sayacEl.textContent = String(Math.max(0, kalan));
    if (kalan <= 0) { clearInterval(timer); onDone(); }
  }, 1000);
  if (_nefesState) _nefesState.timer = timer;
}

function _nefesBitirManuel() {
  if (!_nefesState) return;
  _nefesState.aktif = false;
  if (_nefesState.timer) clearInterval(_nefesState.timer);

  const tamamlanan = _nefesState.dongu > 0 ? _nefesState.dongu - 1 : 0;
  document.getElementById('_nefesGame').style.display = 'none';
  const bitisEl = document.getElementById('_nefesBitis');
  bitisEl.style.display = 'block';

  const altEl = document.getElementById('_nefesBitisAlt');
  let mesaj = '';
  if (tamamlanan >= 4) mesaj = `${tamamlanan} tam döngü tamamladın — sinir sistemin yavaşladı.`;
  else if (tamamlanan >= 2) mesaj = `${tamamlanan} döngü yaptın. Az bile olsa etki eder.`;
  else if (tamamlanan === 1) mesaj = '1 döngü yaptın — her başlangıç değerli.';
  else mesaj = 'İlk döngünü başlatmıştın, istersen tekrar dene.';
  if (altEl) altEl.textContent = mesaj;
}

function _nefesTekrar() {
  _nefesState = null;
  document.getElementById('_nefesBitis').style.display = 'none';
  document.getElementById('_nefesIntro').style.display = 'block';
  const coreEl = document.getElementById('_nefesCore');
  if (coreEl) {
    coreEl.style.transition = 'all 0.3s';
    coreEl.style.width = '60px';
    coreEl.style.height = '60px';
    coreEl.style.background = 'linear-gradient(135deg,#5BBFFF,#185FA5)';
    coreEl.style.boxShadow = '0 0 60px rgba(91,191,255,0.6)';
  }
}

function _nefesKapat() {
  if (_nefesState) {
    _nefesState.aktif = false;
    if (_nefesState.timer) clearInterval(_nefesState.timer);
  }
  const modal = document.getElementById('_nefesOyunModal');
  if (modal) modal.remove();
  _nefesState = null;
}

// ═══════════════════════════════════════════════════════════
// 5-4-3-2-1 TOPRAKLAMA EGZERSİZİ (WELLNESS — SINIRSIZ)
// ═══════════════════════════════════════════════════════════
// Panik anında şimdiki ana dönüş. 5 aşama, her aşamada bir duyu.
// Zaman sınırı YOK. Kullanıcı kendi ritminde ilerler.
// Her adımda 1-2 kelime yazar (opsiyonel), "Devam" ile geçer.

let _topraklamaState = null;

const _TOPRAKLAMA_ADIMLAR = [
  {
    sayi: 5,
    duyu: 'GÖR',
    ikon: '👁️',
    renk: '#5BBFFF',
    baslik: 'Etrafında gördüğün 5 şey',
    aciklama: 'Yavaşça etrafına bak. İlk gördüğün 5 şeyi fark et — kalem, lamba, perde, ne varsa.',
    placeholder: 'örn: kalem, lamba, duvar...',
  },
  {
    sayi: 4,
    duyu: 'DUY',
    ikon: '👂',
    renk: '#a78bfa',
    baslik: 'Duyabildiğin 4 ses',
    aciklama: 'Sessizce dinle. Dışarıdan, odandan, kendi bedeninden gelen sesler var.',
    placeholder: 'örn: saat tıkırtısı, rüzgar...',
  },
  {
    sayi: 3,
    duyu: 'DOKUN',
    ikon: '✋',
    renk: '#f472b6',
    baslik: 'Dokunduğun 3 şey',
    aciklama: 'Parmaklarınla dokun. Hissettiğin dokuları fark et — masa, giysin, cilt.',
    placeholder: 'örn: masa, tişört, saç...',
  },
  {
    sayi: 2,
    duyu: 'KOKLA',
    ikon: '👃',
    renk: '#fbbf24',
    baslik: 'Kokladığın 2 şey',
    aciklama: 'Derin bir nefes al. Belirgin bir koku yoksa havayı, kâğıdı, cildini kokla.',
    placeholder: 'örn: kağıt, hava, cilt...',
  },
  {
    sayi: 1,
    duyu: 'TAT',
    ikon: '👅',
    renk: '#43b89c',
    baslik: 'Tadını aldığın 1 şey',
    aciklama: 'Ağzındaki tadı fark et. Su iç, yudumla, ya da ağzının mevcut tadını hisset.',
    placeholder: 'örn: su, nane, tükürük...',
  },
];

function topraklamaEgzersiziAc() {
  const existing = document.getElementById('_topraklamaModal');
  if (existing) existing.remove();

  _topraklamaState = { adimIdx: -1, girdiler: [] };

  const modal = document.createElement('div');
  modal.id = '_topraklamaModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#0a1f1a,#1a3a2d);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:24px 20px;overflow:hidden;
  `;

  modal.innerHTML = `
    <button onclick="_topraklamaKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_topraklamaContent" style="width:100%;max-width:380px"></div>
  `;

  document.body.appendChild(modal);
  _topraklamaIntroGoster();
}

function _topraklamaIntroGoster() {
  const c = document.getElementById('_topraklamaContent');
  if (!c) return;
  c.innerHTML = `
    <div style="text-align:center;color:#fff">
      <div style="font-size:3rem;margin-bottom:14px">🌿</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">5-4-3-2-1 Topraklama</div>
      <div style="font-size:0.88rem;color:rgba(255,255,255,0.7);line-height:1.75;margin-bottom:24px;text-align:left;padding:0 8px">
        Zihnin şu an kaygıyla geleceğe kaçıyorsa, bu egzersiz seni <b style="color:#43b89c">şimdiki ana</b> geri getirir.
        <br><br>
        Beş duyunu sırayla kullanacaksın:
        <br>
        <span style="display:block;margin:8px 0 0 0;font-size:0.82rem;color:rgba(255,255,255,0.65)">
        👁️ 5 gördüğün · 👂 4 duyduğun · ✋ 3 dokunduğun · 👃 2 kokladığın · 👅 1 tattığın şey
        </span>
        <br>
        <span style="font-size:0.78rem;color:rgba(255,255,255,0.5)">Acele etme. Kendi hızında ilerle.</span>
      </div>
      <button onclick="_topraklamaSonrakiAdim()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#43b89c,#2d7a67);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(67,184,156,0.4)">
        Başla →
      </button>
    </div>
  `;
}

function _topraklamaSonrakiAdim() {
  if (!_topraklamaState) return;
  _topraklamaState.adimIdx++;

  if (_topraklamaState.adimIdx >= _TOPRAKLAMA_ADIMLAR.length) {
    _topraklamaBitir();
    return;
  }

  const adim = _TOPRAKLAMA_ADIMLAR[_topraklamaState.adimIdx];
  const toplam = _TOPRAKLAMA_ADIMLAR.length;
  const mevcut = _topraklamaState.adimIdx + 1;

  const c = document.getElementById('_topraklamaContent');
  if (!c) return;

  // Sakin halka animasyonu için CSS
  c.innerHTML = `
    <style>
      @keyframes _topraklamaHalka {
        0% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(1.15); opacity: 0.15; }
        100% { transform: scale(1.3); opacity: 0; }
      }
    </style>
    <div style="text-align:center;color:#fff">
      <!-- İlerleme noktaları -->
      <div style="display:flex;justify-content:center;gap:6px;margin-bottom:20px">
        ${_TOPRAKLAMA_ADIMLAR.map((_, i) => `<div style="width:${i === _topraklamaState.adimIdx ? '24' : '8'}px;height:8px;border-radius:4px;background:${i <= _topraklamaState.adimIdx ? adim.renk : 'rgba(255,255,255,0.15)'};transition:.4s"></div>`).join('')}
      </div>

      <!-- Büyük sayı + duyu -->
      <div style="position:relative;width:140px;height:140px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center">
        <div style="position:absolute;inset:0;border-radius:50%;background:${adim.renk};opacity:0.4;animation:_topraklamaHalka 2.5s ease-out infinite"></div>
        <div style="position:absolute;inset:0;border-radius:50%;background:${adim.renk};opacity:0.4;animation:_topraklamaHalka 2.5s ease-out infinite 0.8s"></div>
        <div style="position:relative;width:90px;height:90px;border-radius:50%;background:${adim.renk};display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 40px ${adim.renk}88">
          <div style="font-size:2.2rem;line-height:1;color:#fff">${adim.ikon}</div>
        </div>
      </div>

      <div style="font-size:0.72rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.15em;margin-bottom:4px">ADIM ${mevcut}/${toplam}</div>
      <div style="font-size:2.2rem;font-weight:900;color:${adim.renk};line-height:1;margin-bottom:8px">${adim.sayi}</div>
      <div style="font-size:1.05rem;font-weight:800;color:#fff;margin-bottom:8px">${adim.baslik}</div>
      <div style="font-size:0.84rem;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:20px;max-width:320px;margin-left:auto;margin-right:auto">
        ${adim.aciklama}
      </div>

      <!-- Opsiyonel input -->
      <input id="_topraklamaInput" type="text" placeholder="${adim.placeholder}" maxlength="80"
        style="width:100%;max-width:300px;padding:11px 14px;border-radius:11px;border:1.5px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;font-size:0.9rem;text-align:center;outline:none;margin-bottom:8px;font-family:inherit">
      <div style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin-bottom:20px">isteğe bağlı — yazmadan da geçebilirsin</div>

      <button onclick="_topraklamaDevam()" style="width:100%;max-width:300px;padding:13px;border-radius:12px;border:none;background:${adim.renk};color:#fff;font-size:0.95rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 16px ${adim.renk}66">
        Fark Ettim →
      </button>
    </div>
  `;

  // Input'a focus yapma, otomatik klavye açmasın — kullanıcı isterse dokunur
}

function _topraklamaDevam() {
  if (!_topraklamaState) return;
  const input = document.getElementById('_topraklamaInput');
  const deger = input ? input.value.trim() : '';
  _topraklamaState.girdiler.push(deger);
  _topraklamaSonrakiAdim();
}

function _topraklamaBitir() {
  const c = document.getElementById('_topraklamaContent');
  if (!c) return;

  // Kullanıcı en az 1 şey yazdıysa özet göster
  const yazilanlar = _topraklamaState.girdiler.filter(g => g.length > 0);
  let ozetHtml = '';
  if (yazilanlar.length > 0) {
    ozetHtml = `
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:18px;text-align:left">
        <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:8px">FARK ETTİKLERİN</div>
        ${_TOPRAKLAMA_ADIMLAR.map((adim, i) => {
          const g = _topraklamaState.girdiler[i];
          if (!g) return '';
          return `<div style="font-size:0.82rem;color:rgba(255,255,255,0.8);line-height:1.6;margin-bottom:4px">
            <span style="color:${adim.renk};font-weight:700">${adim.ikon} ${adim.duyu}:</span> ${g}
          </div>`;
        }).filter(x => x).join('')}
      </div>`;
  }

  c.innerHTML = `
    <div style="text-align:center;color:#fff">
      <div style="font-size:3rem;margin-bottom:12px">🌿</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px">Şimdiki Andasın</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.65);margin-bottom:20px;line-height:1.6">
        Beş duyunu da gezdirdin. Zihnin biraz daha sakin, biraz daha burada.
      </div>
      ${ozetHtml}
      <div style="display:flex;gap:10px;justify-content:center">
        <button onclick="_topraklamaKapat()" style="padding:12px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.8);font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          Tamam
        </button>
        <button onclick="_topraklamaTekrar()" style="padding:12px 24px;border-radius:12px;border:none;background:rgba(67,184,156,0.2);color:#43b89c;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(67,184,156,0.4)">
          🌿 Tekrar Başla
        </button>
      </div>
    </div>
  `;
}

function _topraklamaTekrar() {
  _topraklamaState = { adimIdx: -1, girdiler: [] };
  _topraklamaIntroGoster();
}

function _topraklamaKapat() {
  const modal = document.getElementById('_topraklamaModal');
  if (modal) modal.remove();
  _topraklamaState = null;
}

// ═══════════════════════════════════════════════════════════
// KAS GEVŞETME — Jacobson Tekniği (WELLNESS — SINIRSIZ)
// ═══════════════════════════════════════════════════════════
// 6 kas grubu: yumruklar, kollar, omuzlar, yüz, göğüs/karın, bacaklar
// Her grup: 5 sn ger → 10 sn bırak. Toplam ~90 saniye.
// SVG figür — aktif bölge gergin fazda kırmızı, bırakma fazında yeşil parlar.

let _kasState = null;

const _KAS_GRUPLARI = [
  {
    id: 'eller',
    baslik: 'Yumruklar',
    ikon: '✊',
    gerMesaj: 'İki elini sıkıca yumruk yap. Tırnakların avuç içine batsın. Parmaklarını sıkıca kıstır.',
    bosMesaj: 'Yumruklarını aç. Parmaklarını serbest bırak. Avucunun içindeki yumuşamayı hisset.',
    bolgeler: ['sol-el', 'sag-el'],
  },
  {
    id: 'kollar',
    baslik: 'Kollar',
    ikon: '💪',
    gerMesaj: 'Kollarını gererek yukarı kaldır. Pazularını sık. Kollar gergin, titresin.',
    bosMesaj: 'Kollarını yavaşça indir. Kaslarının yumuşamasını hisset. Kolların ağırlaşsın.',
    bolgeler: ['sol-kol', 'sag-kol'],
  },
  {
    id: 'omuzlar',
    baslik: 'Omuzlar',
    ikon: '🤷',
    gerMesaj: 'Omuzlarını kulaklarına doğru kaldır. Sıkıca yukarı çek. Boyun gerilsin.',
    bosMesaj: 'Omuzlarını aşağı bırak. Düşsünler. Boynundaki gerginliğin gittiğini hisset.',
    bolgeler: ['omuz'],
  },
  {
    id: 'yuz',
    baslik: 'Yüz ve Çene',
    ikon: '😬',
    gerMesaj: 'Gözlerini sıkıca yum. Dişlerini sık. Alnını kırıştır. Tüm yüz kasları gergin.',
    bosMesaj: 'Gözlerini yumuşat. Çeneni bırak. Alnın gevşesin. Yüzün rahat.',
    bolgeler: ['yuz'],
  },
  {
    id: 'govde',
    baslik: 'Göğüs ve Karın',
    ikon: '🫁',
    gerMesaj: 'Nefes al ve göğsünü şişir. Karnını içeri çek. Gövdeni sert tut.',
    bosMesaj: 'Nefesini ver. Göğsün ve karnın yumuşasın. Gövdene yerçekimini bırak.',
    bolgeler: ['govde'],
  },
  {
    id: 'bacaklar',
    baslik: 'Bacaklar',
    ikon: '🦵',
    gerMesaj: 'Bacaklarını uzat. Parmak uçlarını kendinden uzaklaştır. Baldır kasların gergin.',
    bosMesaj: 'Bacaklarını bırak. Ayakların rahat. Bacakların ağırlaşsın, yere batsın.',
    bolgeler: ['sol-bacak', 'sag-bacak'],
  },
];

function kasGevsetmeEgzersiziAc() {
  const existing = document.getElementById('_kasGevsetmeModal');
  if (existing) existing.remove();

  _kasState = { grupIdx: -1, faz: null, timer: null, aktif: true };

  const modal = document.createElement('div');
  modal.id = '_kasGevsetmeModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#1a0f08,#2d1810);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px;overflow-y:auto;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_kasGevsetmeKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2">×</button>

    <div id="_kasContent" style="width:100%;max-width:380px"></div>
  `;

  document.body.appendChild(modal);
  _kasIntroGoster();
}

function _kasIntroGoster() {
  const c = document.getElementById('_kasContent');
  if (!c) return;
  c.innerHTML = `
    <div style="text-align:center">
      <div style="font-size:3rem;margin-bottom:14px">💪</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Kas Gevşetme</div>
      <div style="font-size:0.85rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:20px;text-align:left;padding:0 8px">
        <b style="color:#ffb380">Jacobson tekniği</b> — kaygılıyken bedenin farkında olmadan kasılır. Bu egzersiz kasları <b>bilinçli olarak</b> sırayla gerip bırakarak bedene "güvendesin" sinyali gönderir.
        <br><br>
        6 kas grubu → her biri <b style="color:#ff6584">5 sn ger</b> → <b style="color:#43b89c">10 sn bırak</b>
        <br><br>
        <span style="font-size:0.78rem;color:rgba(255,255,255,0.5)">Yaklaşık 90 saniye sürer. Rahat bir pozisyonda otur, ekrandaki yönergeleri takip et.</span>
      </div>
      <button onclick="_kasBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#e67e22,#c0542a);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(230,126,34,0.4)">
        Başla →
      </button>
    </div>
  `;
}

function _kasBasla() {
  if (!_kasState) return;
  _kasState.grupIdx = -1;
  _kasSonrakiGrup();
}

function _kasSonrakiGrup() {
  if (!_kasState || !_kasState.aktif) return;
  _kasState.grupIdx++;

  if (_kasState.grupIdx >= _KAS_GRUPLARI.length) {
    _kasBitir();
    return;
  }

  const grup = _KAS_GRUPLARI[_kasState.grupIdx];
  _kasEkranCiz(grup);
  _kasGerFazi(grup);
}

function _kasGerFazi(grup) {
  if (!_kasState || !_kasState.aktif) return;
  _kasState.faz = 'ger';

  // Görsel: gergin bölgeler kırmızı parlak
  grup.bolgeler.forEach(b => {
    const el = document.getElementById('_kasBolge_' + b);
    if (el) {
      el.style.fill = '#ef4444';
      el.style.filter = 'drop-shadow(0 0 12px #ef4444cc)';
    }
  });

  const mesajEl = document.getElementById('_kasMesaj');
  const fazEl = document.getElementById('_kasFazLabel');
  if (mesajEl) mesajEl.textContent = grup.gerMesaj;
  if (fazEl) { fazEl.textContent = '🔴 GER'; fazEl.style.color = '#ef4444'; }

  _kasGeriSayim(5, () => _kasBosFazi(grup));
}

function _kasBosFazi(grup) {
  if (!_kasState || !_kasState.aktif) return;
  _kasState.faz = 'bos';

  // Görsel: gevşeyen bölgeler yeşil yumuşak
  grup.bolgeler.forEach(b => {
    const el = document.getElementById('_kasBolge_' + b);
    if (el) {
      el.style.fill = '#43b89c';
      el.style.filter = 'drop-shadow(0 0 16px #43b89c99)';
    }
  });

  const mesajEl = document.getElementById('_kasMesaj');
  const fazEl = document.getElementById('_kasFazLabel');
  if (mesajEl) mesajEl.textContent = grup.bosMesaj;
  if (fazEl) { fazEl.textContent = '🟢 BIRAK'; fazEl.style.color = '#43b89c'; }

  _kasGeriSayim(10, () => {
    // Bölgeyi nötr gri'ye döndür
    grup.bolgeler.forEach(b => {
      const el = document.getElementById('_kasBolge_' + b);
      if (el) {
        el.style.fill = 'rgba(255,255,255,0.15)';
        el.style.filter = 'none';
      }
    });
    _kasSonrakiGrup();
  });
}

function _kasGeriSayim(saniye, onDone) {
  const sayacEl = document.getElementById('_kasSayac');
  let kalan = saniye;
  if (sayacEl) sayacEl.textContent = String(kalan);
  const timer = setInterval(() => {
    if (!_kasState || !_kasState.aktif) { clearInterval(timer); return; }
    kalan--;
    if (sayacEl) sayacEl.textContent = String(Math.max(0, kalan));
    if (kalan <= 0) { clearInterval(timer); onDone(); }
  }, 1000);
  if (_kasState) _kasState.timer = timer;
}

function _kasEkranCiz(grup) {
  const c = document.getElementById('_kasContent');
  if (!c) return;
  const mevcut = _kasState.grupIdx + 1;
  const toplam = _KAS_GRUPLARI.length;

  c.innerHTML = `
    <div style="text-align:center">
      <!-- İlerleme noktaları -->
      <div style="display:flex;justify-content:center;gap:5px;margin-bottom:14px">
        ${_KAS_GRUPLARI.map((_, i) => `<div style="width:${i === _kasState.grupIdx ? '24' : '7'}px;height:7px;border-radius:4px;background:${i <= _kasState.grupIdx ? '#e67e22' : 'rgba(255,255,255,0.15)'};transition:.4s"></div>`).join('')}
      </div>

      <!-- Grup başlığı -->
      <div style="font-size:0.68rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.15em;margin-bottom:4px">GRUP ${mevcut}/${toplam}</div>
      <div style="font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:14px">${grup.ikon} ${grup.baslik}</div>

      <!-- SVG Figür -->
      <div style="margin:0 auto 18px;display:flex;justify-content:center">
        ${_kasFigurSvg()}
      </div>

      <!-- Faz + sayaç -->
      <div id="_kasFazLabel" style="font-size:1.1rem;font-weight:800;margin-bottom:6px;letter-spacing:.05em">🔴 GER</div>
      <div id="_kasSayac" style="font-size:2.4rem;font-weight:900;color:#fff;line-height:1;margin-bottom:14px;font-variant-numeric:tabular-nums">5</div>

      <!-- Mesaj -->
      <div id="_kasMesaj" style="font-size:0.88rem;color:rgba(255,255,255,0.8);line-height:1.6;min-height:56px;padding:0 10px"></div>
    </div>
  `;
}

function _kasFigurSvg() {
  // Basit insan silueti. Bölgeler ID'li path'ler.
  // viewBox: 200x260
  return `
    <svg width="180" height="234" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      <!-- Arka plan glow -->
      <circle cx="100" cy="130" r="100" fill="rgba(230,126,34,0.04)"/>

      <!-- Yüz -->
      <circle id="_kasBolge_yuz" cx="100" cy="32" r="20" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Omuz (geniş kısım) -->
      <path id="_kasBolge_omuz" d="M60 64 Q100 56 140 64 L145 82 Q100 76 55 82 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Gövde (göğüs+karın) -->
      <path id="_kasBolge_govde" d="M62 82 L138 82 L134 152 L66 152 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Sol kol (üst) -->
      <path id="_kasBolge_sol-kol" d="M55 82 L42 82 L32 140 L45 142 L55 90 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>
      <!-- Sağ kol (üst) -->
      <path id="_kasBolge_sag-kol" d="M145 82 L158 82 L168 140 L155 142 L145 90 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Sol el (yumruk) -->
      <circle id="_kasBolge_sol-el" cx="38" cy="152" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>
      <!-- Sağ el (yumruk) -->
      <circle id="_kasBolge_sag-el" cx="162" cy="152" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>

      <!-- Sol bacak -->
      <path id="_kasBolge_sol-bacak" d="M70 152 L66 152 L72 240 L86 240 L88 152 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>
      <!-- Sağ bacak -->
      <path id="_kasBolge_sag-bacak" d="M130 152 L134 152 L128 240 L114 240 L112 152 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition:all 0.4s"/>
    </svg>
  `;
}

function _kasBitir() {
  if (!_kasState) return;
  _kasState.aktif = false;
  if (_kasState.timer) clearInterval(_kasState.timer);

  const c = document.getElementById('_kasContent');
  if (!c) return;

  c.innerHTML = `
    <div style="text-align:center">
      <div style="font-size:3rem;margin-bottom:12px">✨</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px">Bedenin Gevşedi</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.65);margin-bottom:20px;line-height:1.7;padding:0 10px">
        Altı kas grubunu sırayla çalıştırdın. Beden "güvendesin" sinyalini aldı — kortizol düşer, kalp atışı yavaşlar.
        <br><br>
        <span style="font-size:0.82rem;color:rgba(255,255,255,0.5)">Gözlerini kapatıp son bir derin nefes alabilirsin.</span>
      </div>
      <div style="display:flex;gap:10px;justify-content:center">
        <button onclick="_kasGevsetmeKapat()" style="padding:12px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.8);font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          Tamam
        </button>
        <button onclick="_kasTekrar()" style="padding:12px 24px;border-radius:12px;border:none;background:rgba(230,126,34,0.2);color:#ffb380;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(230,126,34,0.4)">
          💪 Tekrar Başla
        </button>
      </div>
    </div>
  `;
}

function _kasTekrar() {
  _kasState = { grupIdx: -1, faz: null, timer: null, aktif: true };
  _kasIntroGoster();
}

function _kasGevsetmeKapat() {
  if (_kasState) {
    _kasState.aktif = false;
    if (_kasState.timer) clearInterval(_kasState.timer);
  }
  const modal = document.getElementById('_kasGevsetmeModal');
  if (modal) modal.remove();
  _kasState = null;
}

// ═══════════════════════════════════════════════════════════
// KELİME BULMACASI (Wordle tarzı)
// ═══════════════════════════════════════════════════════════
// 5 harfli Türkçe kelimeler. 6 deneme. Her gün farklı kelime.
// Yeşil: doğru harf doğru yer. Sarı: doğru harf yanlış yer. Gri: yok.

const _BULMACA_KELIMELER = [
  'BAVUL','ZAMAN','KAVGA','FENER','GÜNEŞ','HÜCRE','ILGIN','JOKER','KABAK','LAMBA',
  'MEYVE','NOKTA','ORMAN','ÖRDEK','PAKET','RADAR','SABUN','ŞEHİR','TABLO','UYARI',
  'VERGİ','YALAN','ZARAR','AKORT','BÖLGE','CEKET','ÇANTA','DAİRE','ESNEK','FİGÜR',
  'GÖZCÜ','HIRKA','IRMAK','JİLET','KEMER','LİMON','MADEN','NAMUS','OTLAK','ÖVÜNÇ',
  'PASTA','RAKET','SINAV','ŞEKER','TAVAN','UZMAN','ÜCRET','VİŞNE','YOSUN','ZEMİN',
  'ARŞİV','BETON','CEVİZ','ÇİZGİ','EVRAK','FİRMA','GALİP','HUKUK','ISLAK','JETON',
  'KİLİT','LİDER','MASAL','NEFES','ONLAR','ÖLÇÜM','PAZAR','ROBOT','SEÇİM','ŞERİT',
  'TURŞU','ÜTÜCÜ','VAGON','YEMEK','ATLAS','BİBER','CÜMLE','ÇEKİÇ','DOLAR','FULAR',
  'GÖVDE','HAYAT','JAPON','KAYIK','LİSTE','METAL','NİSAN','ORTAK','ÖNDER','PİLOT',
  'RADYO','SİYAH','TARAK','UYGUN','ÜSTÜN','YÜZEY','ABİYE','BALIK','CASUS','ÇİÇEK',
  'DUVAR','ERKEN','FOSİL','GİTAR','HEDEF','ISRAR','KÖPEK','MÜZİK','NİYET','SAYGI',
  'ŞARKI','VATAN','YARIN','ZALİM','ADRES','BANDO','CİHAZ','ÇORAP','DOLAP','ELMAS',
  'HASTA','ISLIK','KULAK','LOKUM','NAKİT','POLİS','ŞAPKA','TAVUK','VİRAJ','YAZAR',
  'AMPUL','BİLET','CESUR','ÇOCUK','DENİZ','EYLEM','FIRÇA','GARAJ','HABER','KİTAP',
  'LEVHA','NÖBET','PARKA','REÇEL','SEVGİ','YATAK','ZAYIF','AHŞAP','BULUT','CAMCI',
  'ÇABUK','DAVUL','ENGEL','GAZOZ','HALAT','KAĞIT','LİMAN','PİLAV','ÇORBA','AYRAN',
  'KAHVE','HELVA','SALÇA','NOHUT','HURMA','BÖREK','SİMİT','ÇİLEK','KAYSI','YUFKA',
  'TABAK','KAŞIK','BIÇAK','KAPAK','AVİZE','ASTAR','PERDE','KİLİM','HAVLU','SÜRME',
  'ASKER','MEMUR','ÇIRAK','ŞOFÖR','BAKAN','HAKİM','AKTÖR','YEŞİL','BEYAZ','PEMBE',
  'KÜÇÜK','BÜYÜK','HAFİF','SICAK','SOĞUK','YAVAŞ','HIZLI','DERİN','GENİŞ','GÜZEL',
  'TATLI','TUZLU','ÇİMEN','SABAH','AKŞAM','HAFTA','BUGÜN','DUDAK','DAMAK','YANAK',
  'TEYZE','KUZEN','GELDİ','GİTTİ','VERDİ','SORDU','BAKTI','BEKLE','ASLAN','TİLKİ',
  'ZEBRA','HOROZ','GEYİK','AKREP','SİNEK','KOYUN','ARMUT','KAVUN','İNCİR','MISIR',
  'SOĞAN','HAVUÇ','METRO','MOTOR','VAPUR','TAKSİ','TENİS','VOLEY','SAHİL','GÖLET',
  'SOKAK','CADDE','ÜZGÜN','KORKU','PANİK','HÜZÜN','MORAL','NAZİK','YARIŞ','SAVAŞ',
  'PARTİ','DÜĞÜN','TATİL','İŞLEM','YEMİN','EYLÜL','KASIM','MAYIS','BANYO','BİLGE',
  'DURUM','HÂDİS','SÖYLE','DUYGU','KONUM','DENGE','KOŞTU','UÇTUK','BATTI','ÇIKTI',
  'YATTI','YEDİK','İÇTİK','TUTTU','KESER','YAZDI','OKUDU','SATAN','VURDU','KABLO',
  'PANEL','EKRAN','TUŞLU','MODEM','MODEL','MARKA','KUPON','GÖREV','YETKİ','GÜÇLÜ',
  'TEKİL','ÇİFTE','TOPLU','GENEL','KAZAK','PALTO','KOLYE','YÜZÜK','KEMAN','ÇALAR',
  'ALBÜM','BESTE','ROMAN','METİN','DERGİ','PİYES','KURAK','BORAN','YAĞIŞ','KARGA',
  'ŞAHİN','SİLGİ','DÜNYA','VENÜS','ALÇAK','YASSI','BOZUK','BAYAT','CANLI','SAHTE',
  'SİNİR','COŞKU','KEDER','ASABİ','BİNDİ','DÖNDÜ','KIRDI','YIKTI','YAPTI','ETTİK',
  'KALDI','SATAR','BAKAR','KOYAR','TACİR','CAHİL','MÜDÜR','SİRKE','ACIMA','KİBİR',
  'YALIN','BEŞER','YİRMİ','ÇAYIR','BAYIR','YOKUŞ','DAMAR','YAMAÇ','BATAK','BORSA',
  'KREDİ','HESAP','BEDEL','FİYAT','DENEY','PROJE','SUNUŞ','YAZIM','SÜREÇ','SONUÇ',
  'BAŞAR','PARKE','PANDA','KOALA','KUMRU','GEÇER','DURUR','TÜKET','GÖRÜŞ','FİKİR',
  'İNANÇ','KANAT','TAHİN','KAŞAR','EZİNE','ZURNA','TERZİ','ÇOMAK','ZIMBA','KENAR',
  'TOPAL','DEMİR','BAKIR','ÇELİK','ALTIN','GÜMÜŞ','KALAY','NİKEL','TUNCA','ÇİNKO',
  'KIRAÇ','MORUK','KÜRSÜ','TEKİR','YUVAK','KISIR','KASIK','MAKAS','KORSE','MADEM',
  'YEĞEN','DAMAT','GELİN','KIZAN',
];

// Türkçe karakter normalizasyonu
