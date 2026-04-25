function _nbackOyunuAc() {
  const existing = document.getElementById('_nbackOyunModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_nbackOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#1a1030,#2a1850);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_nbackKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_nbackIntro" style="text-align:center;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🧠</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">N-Back: Çalışan Bellek</div>
      <div style="font-size:0.86rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:24px">
        Ekranda harfler tek tek görünecek. Her harfi gördüğünde, <b style="color:#a78bfa">2 önceki harf ile aynı mı?</b> diye soracaksın.
        <br><br>
        <b style="color:#43b55a">AYNI</b> ise yeşil butona, <b style="color:#ff6584">FARKLI</b> ise kırmızıya bas.
        <br><br>
        İlk 2 harf için cevap verme — sadece izle. 20 tur sürer.
      </div>
      <button onclick="_nbackBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(167,139,250,0.4)">
        Başla →
      </button>
    </div>

    <div id="_nbackGame" style="display:none;text-align:center;width:100%;max-width:380px">
      <div style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:6px">
        TUR <span id="_nbackTur">0</span> / 20
      </div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:18px">
        Skor: <span id="_nbackSkor" style="color:#a78bfa;font-weight:800">0</span> ·
        Doğru: <span id="_nbackDogru" style="color:#43b55a;font-weight:800">0</span> ·
        Yanlış: <span id="_nbackYanlis" style="color:#ff6584;font-weight:800">0</span>
      </div>

      <!-- Harf kutusu -->
      <div style="position:relative;width:200px;height:200px;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);border:2px solid rgba(167,139,250,0.3);border-radius:24px">
        <div id="_nbackHarf" style="font-size:5rem;font-weight:900;color:#a78bfa;font-family:'Inter',sans-serif">—</div>
      </div>

      <div id="_nbackSoru" style="font-size:0.88rem;color:rgba(255,255,255,0.6);margin-bottom:14px;min-height:20px">2 önceki ile aynı mı?</div>

      <div style="display:flex;gap:12px;justify-content:center">
        <button id="_nbackBtnFarkli" onclick="_nbackCevap(false)" style="flex:1;max-width:140px;padding:14px;border-radius:14px;border:none;background:rgba(255,101,132,0.2);border:2px solid rgba(255,101,132,0.5);color:#ff6584;font-size:0.95rem;font-weight:800;cursor:pointer;font-family:inherit">
          ✕ FARKLI
        </button>
        <button id="_nbackBtnAyni" onclick="_nbackCevap(true)" style="flex:1;max-width:140px;padding:14px;border-radius:14px;border:none;background:rgba(67,181,90,0.2);border:2px solid rgba(67,181,90,0.5);color:#43b55a;font-size:0.95rem;font-weight:800;cursor:pointer;font-family:inherit">
          ✓ AYNI
        </button>
      </div>

      <div id="_nbackGeri" style="font-size:0.72rem;color:rgba(255,255,255,0.3);margin-top:12px;min-height:16px"></div>
    </div>

    <div id="_nbackBitis" style="display:none;text-align:center;max-width:340px"></div>
  `;

  document.body.appendChild(modal);
}

function _nbackBasla() {
  document.getElementById('_nbackIntro').style.display = 'none';
  document.getElementById('_nbackGame').style.display = 'block';

  const harfler = ['A','B','C','D','E','F','G','H'];
  // 20 turluk dizi üret — yaklaşık %30 oranında "match" olsun
  const dizi = [];
  for (let i = 0; i < 20; i++) {
    if (i >= 2 && Math.random() < 0.32) {
      dizi.push(dizi[i-2]); // match
    } else {
      let h;
      do { h = harfler[Math.floor(Math.random() * harfler.length)]; }
      while (i >= 2 && h === dizi[i-2] && Math.random() < 0.5); // bazen yine match olabilir, sorun değil
      dizi.push(h);
    }
  }

  _nbackState = {
    dizi,
    tur: 0,
    skor: 0,
    dogru: 0,
    yanlis: 0,
    bekliyor: false,
    timer: null,
  };

  _nbackTurSonraki();
}

function _nbackTurSonraki() {
  if (!_nbackState) return;
  if (_nbackState.tur >= _nbackState.dizi.length) {
    _nbackBitir();
    return;
  }
  _nbackState.tur++;
  const idx = _nbackState.tur - 1;
  const harf = _nbackState.dizi[idx];

  document.getElementById('_nbackTur').textContent = _nbackState.tur;
  document.getElementById('_nbackHarf').textContent = harf;
  document.getElementById('_nbackHarf').style.color = '#a78bfa';
  document.getElementById('_nbackGeri').textContent = '';

  // İlk 2 turda cevap istenmiyor
  if (_nbackState.tur <= 2) {
    document.getElementById('_nbackSoru').textContent = `Sadece izle (${3 - _nbackState.tur} tur kaldı)`;
    _nbackState.bekliyor = false;
    _nbackState.timer = setTimeout(() => _nbackTurSonraki(), 2200);
  } else {
    document.getElementById('_nbackSoru').textContent = '2 önceki ile aynı mı?';
    _nbackState.bekliyor = true;
    // 4 saniye içinde cevap verilmezse otomatik geç (yanlış sayılır)
    _nbackState.timer = setTimeout(() => {
      if (_nbackState && _nbackState.bekliyor) {
        _nbackState.bekliyor = false;
        _nbackState.yanlis++;
        document.getElementById('_nbackYanlis').textContent = _nbackState.yanlis;
        document.getElementById('_nbackGeri').textContent = '⏰ Süre doldu';
        setTimeout(() => _nbackTurSonraki(), 700);
      }
    }, 4000);
  }
}

function _nbackCevap(ayni) {
  if (!_nbackState || !_nbackState.bekliyor) return;
  clearTimeout(_nbackState.timer);
  _nbackState.bekliyor = false;

  const idx = _nbackState.tur - 1;
  const dogruCevap = _nbackState.dizi[idx] === _nbackState.dizi[idx - 2];

  if (ayni === dogruCevap) {
    _nbackState.skor += 5;
    _nbackState.dogru++;
    document.getElementById('_nbackGeri').textContent = '✓ Doğru +5';
    document.getElementById('_nbackGeri').style.color = '#43b55a';
    document.getElementById('_nbackHarf').style.color = '#43b55a';
  } else {
    _nbackState.skor = Math.max(0, _nbackState.skor - 2);
    _nbackState.yanlis++;
    document.getElementById('_nbackGeri').textContent = `✕ Yanlış · doğrusu: ${dogruCevap ? 'AYNI' : 'FARKLI'}`;
    document.getElementById('_nbackGeri').style.color = '#ff6584';
    document.getElementById('_nbackHarf').style.color = '#ff6584';
  }

  document.getElementById('_nbackSkor').textContent = _nbackState.skor;
  document.getElementById('_nbackDogru').textContent = _nbackState.dogru;
  document.getElementById('_nbackYanlis').textContent = _nbackState.yanlis;

  setTimeout(() => _nbackTurSonraki(), 900);
}

function _nbackBitir() {
  const skor = _nbackState ? _nbackState.skor : 0;
  const dogru = _nbackState ? _nbackState.dogru : 0;
  const yanlis = _nbackState ? _nbackState.yanlis : 0;
  const toplam = dogru + yanlis;
  const isabet = toplam > 0 ? Math.round(dogru / toplam * 100) : 0;

  document.getElementById('_nbackGame').style.display = 'none';
  const bitisEl = document.getElementById('_nbackBitis');
  bitisEl.style.display = 'block';

  let mesaj = '';
  if (isabet >= 80) mesaj = '🌟 Çalışan belleğin çok güçlü!';
  else if (isabet >= 60) mesaj = '👍 İyi gittin, gelişiyorsun.';
  else if (isabet >= 40) mesaj = '🙂 Pratik yaptıkça daha iyi olacak.';
  else mesaj = '💪 İlk seferinde herkes zorlanır, devam et.';

  bitisEl.innerHTML = `
    <div style="font-size:3rem;margin-bottom:10px">🧠</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px;color:#fff">Tamamlandı!</div>
    <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:18px">${mesaj}</div>
    <div style="background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.3);border-radius:14px;padding:18px;margin-bottom:18px">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SKOR</div>
      <div style="font-size:2.2rem;font-weight:900;color:#a78bfa">${skor}</div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:8px">
        ${dogru} doğru · ${yanlis} yanlış · %${isabet} isabet
      </div>
    </div>
    <button onclick="_nbackKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(167,139,250,0.2);color:#a78bfa;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(167,139,250,0.4)">
      Tamam
    </button>
  `;

  _oyunOynanmisOlarakKaydet('nback', skor);
}

function _nbackKapat() {
  if (_nbackState && _nbackState.timer) clearTimeout(_nbackState.timer);
  const modal = document.getElementById('_nbackOyunModal');
  if (modal) modal.remove();
  _nbackState = null;
  if (typeof showPage === 'function') showPage('oyun');
}

// ═══════════════════════════════════════════════════════════
// STROOP TESTİ — Çeldirici Direnci
// ═══════════════════════════════════════════════════════════
// 30 tur. Her turda bir renk ismi (KIRMIZI/MAVİ/YEŞİL/SARI) farklı
// bir renkte yazılır. Öğrenci yazıyı değil, RENGİ seçer.
// Doğru +5, yanlış -2. Süre limiti var.

let _stroopState = null;

const _STROOP_RENKLER = [
  { ad: 'KIRMIZI', kod: '#ef4444' },
  { ad: 'MAVİ',    kod: '#3b82f6' },
  { ad: 'YEŞİL',   kod: '#22c55e' },
  { ad: 'SARI',    kod: '#eab308' },
];

function _stroopOyunuAc() {
  const existing = document.getElementById('_stroopOyunModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_stroopOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#1a1a2e,#16213e);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_stroopKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_stroopIntro" style="text-align:center;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🎨</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Stroop Testi</div>
      <div style="font-size:0.86rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:18px">
        Ekranda renk isimleri çıkacak — ama yazıldıkları renk farklı olabilir.
        <br><br>
        <b style="color:#fff">Yazıyı değil, kelimenin RENGİNİ seç.</b>
        <br><br>
        Örnek: <span style="color:#3b82f6;font-weight:800;font-size:1.2rem">KIRMIZI</span>
        — burada cevap <b style="color:#3b82f6">MAVİ</b> (yazının rengi).
      </div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:24px">30 tur · her tur 3 saniye</div>
      <button onclick="_stroopBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#f472b6,#db2777);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(244,114,182,0.4)">
        Başla →
      </button>
    </div>

    <div id="_stroopGame" style="display:none;text-align:center;width:100%;max-width:380px">
      <div style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:6px">
        TUR <span id="_stroopTur">0</span> / 30
      </div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:6px">
        Skor: <span id="_stroopSkor" style="color:#f472b6;font-weight:800">0</span> ·
        Doğru: <span id="_stroopDogru" style="color:#43b55a;font-weight:800">0</span>
      </div>

      <!-- Süre çubuğu -->
      <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;margin-bottom:30px">
        <div id="_stroopSureBar" style="height:100%;background:#f472b6;border-radius:2px;width:100%;transition:width 0.1s linear"></div>
      </div>

      <!-- Kelime -->
      <div style="height:140px;display:flex;align-items:center;justify-content:center;margin-bottom:24px">
        <div id="_stroopKelime" style="font-size:3rem;font-weight:900;font-family:'Inter',sans-serif;letter-spacing:0.05em">—</div>
      </div>

      <div style="font-size:0.78rem;color:rgba(255,255,255,0.6);margin-bottom:14px">Yazının RENGİNİ seç:</div>

      <div id="_stroopButonlar" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></div>

      <div id="_stroopGeri" style="font-size:0.75rem;margin-top:10px;min-height:18px;color:rgba(255,255,255,0.4)"></div>
    </div>

    <div id="_stroopBitis" style="display:none;text-align:center;max-width:340px"></div>
  `;

  document.body.appendChild(modal);
}

function _stroopBasla() {
  document.getElementById('_stroopIntro').style.display = 'none';
  document.getElementById('_stroopGame').style.display = 'block';

  _stroopState = {
    tur: 0,
    toplam: 30,
    skor: 0,
    dogru: 0,
    yanlis: 0,
    bekliyor: false,
    timer: null,
    sureTimer: null,
    aktifRenk: null,
  };

  _stroopTurSonraki();
}

function _stroopTurSonraki() {
  if (!_stroopState) return;
  if (_stroopState.tur >= _stroopState.toplam) {
    _stroopBitir();
    return;
  }
  _stroopState.tur++;

  // Renk + farklı renkte yazı seç (~%80 ihtimalle uyumsuz)
  const renkIdx = Math.floor(Math.random() * _STROOP_RENKLER.length);
  const yaziRengi = _STROOP_RENKLER[renkIdx];
  let kelimeIdx = renkIdx;
  if (Math.random() < 0.8) {
    while (kelimeIdx === renkIdx) {
      kelimeIdx = Math.floor(Math.random() * _STROOP_RENKLER.length);
    }
  }
  const kelime = _STROOP_RENKLER[kelimeIdx];

  _stroopState.aktifRenk = yaziRengi.ad;

  document.getElementById('_stroopTur').textContent = _stroopState.tur;
  const kelimeEl = document.getElementById('_stroopKelime');
  kelimeEl.textContent = kelime.ad;
  kelimeEl.style.color = yaziRengi.kod;

  document.getElementById('_stroopGeri').textContent = '';

  // Butonları üret (her seferinde renkler rastgele sıralı)
  const renklerKarisik = [..._STROOP_RENKLER].sort(() => Math.random() - 0.5);
  const btnEl = document.getElementById('_stroopButonlar');
  btnEl.innerHTML = renklerKarisik.map(r => `
    <button onclick="_stroopCevap('${r.ad}')" style="padding:14px;border-radius:12px;border:2px solid ${r.kod}66;background:${r.kod}22;color:${r.kod};font-size:0.95rem;font-weight:800;cursor:pointer;font-family:inherit">
      ${r.ad}
    </button>
  `).join('');

  _stroopState.bekliyor = true;

  // Süre çubuğu (3 saniye)
  const sureBar = document.getElementById('_stroopSureBar');
  if (sureBar) {
    sureBar.style.transition = 'none';
    sureBar.style.width = '100%';
    setTimeout(() => {
      sureBar.style.transition = 'width 3s linear';
      sureBar.style.width = '0%';
    }, 30);
  }

  _stroopState.timer = setTimeout(() => {
    if (_stroopState && _stroopState.bekliyor) {
      _stroopState.bekliyor = false;
      _stroopState.yanlis++;
      document.getElementById('_stroopGeri').textContent = '⏰ Süre doldu';
      document.getElementById('_stroopGeri').style.color = '#ff6584';
      setTimeout(() => _stroopTurSonraki(), 600);
    }
  }, 3000);
}

function _stroopCevap(secilen) {
  if (!_stroopState || !_stroopState.bekliyor) return;
  clearTimeout(_stroopState.timer);
  _stroopState.bekliyor = false;

  if (secilen === _stroopState.aktifRenk) {
    _stroopState.skor += 5;
    _stroopState.dogru++;
    document.getElementById('_stroopGeri').textContent = '✓ Doğru +5';
    document.getElementById('_stroopGeri').style.color = '#43b55a';
  } else {
    _stroopState.skor = Math.max(0, _stroopState.skor - 2);
    _stroopState.yanlis++;
    document.getElementById('_stroopGeri').textContent = `✕ Doğrusu: ${_stroopState.aktifRenk}`;
    document.getElementById('_stroopGeri').style.color = '#ff6584';
  }

  document.getElementById('_stroopSkor').textContent = _stroopState.skor;
  document.getElementById('_stroopDogru').textContent = _stroopState.dogru;

  setTimeout(() => _stroopTurSonraki(), 600);
}

function _stroopBitir() {
  const skor = _stroopState ? _stroopState.skor : 0;
  const dogru = _stroopState ? _stroopState.dogru : 0;
  const yanlis = _stroopState ? _stroopState.yanlis : 0;
  const isabet = (dogru + yanlis) > 0 ? Math.round(dogru / (dogru + yanlis) * 100) : 0;

  document.getElementById('_stroopGame').style.display = 'none';
  const bitisEl = document.getElementById('_stroopBitis');
  bitisEl.style.display = 'block';

  let mesaj = '';
  if (isabet >= 85) mesaj = '🎯 Çeldiricilere karşı çok güçlüsün!';
  else if (isabet >= 65) mesaj = '👍 İyi odaklandın.';
  else if (isabet >= 45) mesaj = '🙂 Beynin otomatik tepki vermeye çalıştı, normaldir.';
  else mesaj = '💪 Stroop etkisi gerçek — pratik yaptıkça aşacaksın.';

  bitisEl.innerHTML = `
    <div style="font-size:3rem;margin-bottom:10px">🎨</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px;color:#fff">Tamamlandı!</div>
    <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:18px">${mesaj}</div>
    <div style="background:rgba(244,114,182,0.12);border:1px solid rgba(244,114,182,0.3);border-radius:14px;padding:18px;margin-bottom:18px">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SKOR</div>
      <div style="font-size:2.2rem;font-weight:900;color:#f472b6">${skor}</div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:8px">
        ${dogru} doğru · ${yanlis} yanlış · %${isabet} isabet
      </div>
    </div>
    <button onclick="_stroopKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(244,114,182,0.2);color:#f472b6;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(244,114,182,0.4)">
      Tamam
    </button>
  `;

  _oyunOynanmisOlarakKaydet('stroop', skor);
}

function _stroopKapat() {
  if (_stroopState && _stroopState.timer) clearTimeout(_stroopState.timer);
  const modal = document.getElementById('_stroopOyunModal');
  if (modal) modal.remove();
  _stroopState = null;
  if (typeof showPage === 'function') showPage('oyun');
}

// ═══════════════════════════════════════════════════════════
// GÖRSEL MATRİS — Uzamsal Bellek
// ═══════════════════════════════════════════════════════════
// Grid'de bazı kareler yanıp söner. Öğrenci sırayla doğru
// kareleri tıklar. Her bölüm zorlaşır: 4x4 grid, başlangıçta
// 3 kare yanar, her geçişte +1.

let _matrisState = null;

function _matrisOyunuAc() {
  const existing = document.getElementById('_matrisOyunModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_matrisOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#0c1421,#1a2540);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_matrisKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_matrisIntro" style="text-align:center;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🔲</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Görsel Matris</div>
      <div style="font-size:0.86rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:24px">
        4×4 ızgarada bazı kareler <b style="color:#5dd4ff">yanıp söner</b>.
        <br><br>
        Sönen kareleri <b>aynı sırayla</b> tıklamaya çalış. Her geçtiğin bölümde bir kare daha eklenir.
        <br><br>
        3 hata yaparsan oyun biter.
      </div>
      <button onclick="_matrisBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#5dd4ff,#0ea5e9);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(93,212,255,0.4)">
        Başla →
      </button>
    </div>

    <div id="_matrisGame" style="display:none;text-align:center;width:100%;max-width:380px">
      <div style="font-size:0.78rem;letter-spacing:.15em;color:rgba(255,255,255,0.5);font-weight:700;margin-bottom:6px">
        BÖLÜM <span id="_matrisBolum">1</span>
      </div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:18px">
        Skor: <span id="_matrisSkor" style="color:#5dd4ff;font-weight:800">0</span> ·
        Can: <span id="_matrisCan" style="color:#ff6584;font-weight:800">❤️❤️❤️</span>
      </div>

      <div id="_matrisDurum" style="font-size:0.95rem;font-weight:700;margin-bottom:16px;min-height:24px;color:#5dd4ff">İzle...</div>

      <!-- 4x4 grid -->
      <div id="_matrisGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:280px;margin:0 auto"></div>

      <div id="_matrisIlerleme" style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-top:14px;min-height:16px"></div>
    </div>

    <div id="_matrisBitis" style="display:none;text-align:center;max-width:340px"></div>
  `;

  document.body.appendChild(modal);
}

function _matrisBasla() {
  document.getElementById('_matrisIntro').style.display = 'none';
  document.getElementById('_matrisGame').style.display = 'block';

  _matrisState = {
    bolum: 1,
    skor: 0,
    can: 3,
    gridN: 4,
    sira: [],
    aktifIdx: 0,
    bekliyor: false,
  };

  _matrisGridCiz();
  _matrisBolumBasla();
}

function _matrisGridCiz() {
  const grid = document.getElementById('_matrisGrid');
  if (!grid) return;
  const N = _matrisState.gridN;
  const total = N * N;
  let html = '';
  for (let i = 0; i < total; i++) {
    html += `<div id="_matrisKare_${i}" data-idx="${i}" onclick="_matrisKareTikla(${i})" style="aspect-ratio:1;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);border-radius:10px;cursor:pointer;transition:all 0.15s"></div>`;
  }
  grid.innerHTML = html;
}

function _matrisBolumBasla() {
  if (!_matrisState) return;
  const N = _matrisState.gridN;
  const toplamKare = N * N;
  const yanacakSayi = Math.min(toplamKare - 1, 2 + _matrisState.bolum); // bölüm 1: 3 kare, bölüm 2: 4 kare...

  // Rastgele unique kareler seç
  const sira = [];
  const kullanilan = new Set();
  while (sira.length < yanacakSayi) {
    const k = Math.floor(Math.random() * toplamKare);
    if (!kullanilan.has(k)) {
      kullanilan.add(k);
      sira.push(k);
    }
  }

  _matrisState.sira = sira;
  _matrisState.aktifIdx = 0;
  _matrisState.bekliyor = false;

  document.getElementById('_matrisBolum').textContent = _matrisState.bolum;
  document.getElementById('_matrisDurum').textContent = `İzle (${yanacakSayi} kare)...`;
  document.getElementById('_matrisDurum').style.color = '#5dd4ff';
  document.getElementById('_matrisIlerleme').textContent = '';

  // Sırayla yak-söndür
  let i = 0;
  const yakDelay = Math.max(400, 700 - _matrisState.bolum * 30); // bölüm arttıkça hızlanır
  const yakInterval = setInterval(() => {
    if (i > 0) {
      const onceki = document.getElementById('_matrisKare_' + sira[i-1]);
      if (onceki) {
        onceki.style.background = 'rgba(255,255,255,0.08)';
        onceki.style.borderColor = 'rgba(255,255,255,0.15)';
        onceki.style.boxShadow = 'none';
      }
    }
    if (i >= sira.length) {
      clearInterval(yakInterval);
      // Tıklama aşaması başlasın
      setTimeout(() => {
        _matrisState.bekliyor = true;
        document.getElementById('_matrisDurum').textContent = 'Şimdi sırayla tıkla';
        document.getElementById('_matrisDurum').style.color = '#fff';
        document.getElementById('_matrisIlerleme').textContent = `0 / ${sira.length}`;
      }, 200);
      return;
    }
    const k = sira[i];
    const el = document.getElementById('_matrisKare_' + k);
    if (el) {
      el.style.background = '#5dd4ff';
      el.style.borderColor = '#5dd4ff';
      el.style.boxShadow = '0 0 20px rgba(93,212,255,0.6)';
    }
    i++;
  }, yakDelay);
}

function _matrisKareTikla(idx) {
  if (!_matrisState || !_matrisState.bekliyor) return;
  const beklenen = _matrisState.sira[_matrisState.aktifIdx];
  const el = document.getElementById('_matrisKare_' + idx);

  if (idx === beklenen) {
    // Doğru
    if (el) {
      el.style.background = '#43b55a';
      el.style.borderColor = '#43b55a';
      setTimeout(() => {
        el.style.background = 'rgba(67,181,90,0.2)';
        el.style.borderColor = 'rgba(67,181,90,0.5)';
      }, 200);
    }
    _matrisState.aktifIdx++;
    document.getElementById('_matrisIlerleme').textContent = `${_matrisState.aktifIdx} / ${_matrisState.sira.length}`;

    if (_matrisState.aktifIdx >= _matrisState.sira.length) {
      // Bölüm tamamlandı
      _matrisState.bekliyor = false;
      _matrisState.skor += _matrisState.sira.length * 10;
      document.getElementById('_matrisSkor').textContent = _matrisState.skor;
      document.getElementById('_matrisDurum').textContent = `✓ Bölüm ${_matrisState.bolum} tamam!`;
      document.getElementById('_matrisDurum').style.color = '#43b55a';
      _matrisState.bolum++;
      setTimeout(() => {
        // Grid'i temizle
        for (let i = 0; i < _matrisState.gridN * _matrisState.gridN; i++) {
          const k = document.getElementById('_matrisKare_' + i);
          if (k) {
            k.style.background = 'rgba(255,255,255,0.08)';
            k.style.borderColor = 'rgba(255,255,255,0.15)';
            k.style.boxShadow = 'none';
          }
        }
        _matrisBolumBasla();
      }, 1100);
    }
  } else {
    // Yanlış
    if (el) {
      el.style.background = '#ff6584';
      el.style.borderColor = '#ff6584';
      setTimeout(() => {
        el.style.background = 'rgba(255,255,255,0.08)';
        el.style.borderColor = 'rgba(255,255,255,0.15)';
      }, 400);
    }
    _matrisState.can--;
    _matrisState.bekliyor = false;
    document.getElementById('_matrisCan').textContent = '❤️'.repeat(Math.max(0, _matrisState.can));
    document.getElementById('_matrisDurum').textContent = '✕ Yanlış!';
    document.getElementById('_matrisDurum').style.color = '#ff6584';

    if (_matrisState.can <= 0) {
      setTimeout(() => _matrisBitir(), 900);
    } else {
      // Aynı bölümü tekrar başlat
      setTimeout(() => {
        for (let i = 0; i < _matrisState.gridN * _matrisState.gridN; i++) {
          const k = document.getElementById('_matrisKare_' + i);
          if (k) {
            k.style.background = 'rgba(255,255,255,0.08)';
            k.style.borderColor = 'rgba(255,255,255,0.15)';
            k.style.boxShadow = 'none';
          }
        }
        _matrisBolumBasla();
      }, 1000);
    }
  }
}

function _matrisBitir() {
  const skor = _matrisState ? _matrisState.skor : 0;
  const bolum = _matrisState ? _matrisState.bolum - 1 : 0;

  document.getElementById('_matrisGame').style.display = 'none';
  const bitisEl = document.getElementById('_matrisBitis');
  bitisEl.style.display = 'block';

  let mesaj = '';
  if (bolum >= 8) mesaj = '🌟 İnanılmaz görsel hafıza!';
  else if (bolum >= 5) mesaj = '👏 Çok iyi gittin!';
  else if (bolum >= 3) mesaj = '🙂 Güzel başlangıç.';
  else mesaj = '💪 Tekrar dene, gelişeceksin.';

  bitisEl.innerHTML = `
    <div style="font-size:3rem;margin-bottom:10px">🔲</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px;color:#fff">Oyun Bitti</div>
    <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:18px">${mesaj}</div>
    <div style="background:rgba(93,212,255,0.12);border:1px solid rgba(93,212,255,0.3);border-radius:14px;padding:18px;margin-bottom:18px">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SKOR</div>
      <div style="font-size:2.2rem;font-weight:900;color:#5dd4ff">${skor}</div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:8px">${bolum} bölüm tamamlandı</div>
    </div>
    <button onclick="_matrisKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(93,212,255,0.2);color:#5dd4ff;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(93,212,255,0.4)">
      Tamam
    </button>
  `;

  _oyunOynanmisOlarakKaydet('matris', skor);
}

function _matrisKapat() {
  const modal = document.getElementById('_matrisOyunModal');
  if (modal) modal.remove();
  _matrisState = null;
  if (typeof showPage === 'function') showPage('oyun');
}

// ═══════════════════════════════════════════════════════════
// SAYI AVI — Schulte Table
// ═══════════════════════════════════════════════════════════
// 5x5 grid, 1-25 arası sayılar rastgele dağılmış.
// Sırayla 1'den 25'e tıkla. Yanlış tıklama = +2 saniye ceza.
// Günlük seed — herkes aynı gridi görür.

let _sayiaviState = null;

function _sayiaviOyunuAc() {
  const existing = document.getElementById('_sayiaviOyunModal');
  if (existing) existing.remove();

  // Günlük seed'le rastgele dağılım
  const todayKey = getTodayKey();
  let seed = 0;
  for (let i = 0; i < todayKey.length; i++) seed = ((seed << 5) - seed) + todayKey.charCodeAt(i);
  seed = Math.abs(seed);

  // Seed'li PRNG (mulberry32)
  function mulberry32(s) {
    return function() {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(seed);

  // 1-25 diziyi karıştır
  const sayilar = Array.from({length:25}, (_,i) => i + 1);
  for (let i = sayilar.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [sayilar[i], sayilar[j]] = [sayilar[j], sayilar[i]];
  }

  // Önceki en iyi süre (süre bazlı, daha düşük daha iyi)
  const myUid = (window.currentUserData || {}).uid || 'local';
  const bestTimeKey = 'oyun_sayiavi_besttime_' + myUid;
  const bestTime = parseInt(localStorage.getItem(bestTimeKey) || '0');
  const dunBest = parseInt(localStorage.getItem('oyun_sayiavi_yesterdaytime_' + myUid) || '0');

  _sayiaviState = {
    sayilar,
    aktif: 1,
    baslangic: null,
    ceza: 0,
    bitti: false,
    timer: null,
    bestTime,
    dunBest,
  };

  const modal = document.createElement('div');
  modal.id = '_sayiaviOyunModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#0f1b2d,#1a2844);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:18px 14px;overflow:hidden;color:#fff;
  `;

  modal.innerHTML = `
    <button onclick="_sayiaviKapat()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>

    <div id="_sayiaviIntro" style="text-align:center;max-width:340px">
      <div style="font-size:3rem;margin-bottom:14px">🔢</div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:10px">Sayı Avı</div>
      <div style="font-size:0.86rem;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:18px">
        1'den 25'e kadar sayıları <b style="color:#7dd3fc">sırayla</b> tıkla. Ne kadar hızlısan o kadar iyi.
        <br><br>
        <b style="color:#ff6584">Yanlış tıklama → +2 saniye ceza</b>
        <br><br>
        <span style="font-size:0.78rem;color:rgba(255,255,255,0.5)">Herkes bugün aynı gridle yarışıyor — seed tarihi: ${todayKey}</span>
      </div>
      ${dunBest > 0 ? `<div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-bottom:16px">Dünkü süren: <b style="color:#7dd3fc">${(dunBest/1000).toFixed(1)}s</b></div>` : ''}
      <button onclick="_sayiaviBasla()" style="padding:14px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#7dd3fc,#0284c7);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 4px 20px rgba(125,211,252,0.4)">
        Başla →
      </button>
    </div>

    <div id="_sayiaviGame" style="display:none;width:100%;max-width:380px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div>
          <div style="font-size:0.68rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.1em">SIRADAKI</div>
          <div id="_sayiaviAktif" style="font-size:2rem;font-weight:900;color:#7dd3fc;line-height:1">1</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.68rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:.1em">SÜRE</div>
          <div id="_sayiaviSure" style="font-size:1.6rem;font-weight:900;color:#fff;line-height:1.2;font-variant-numeric:tabular-nums">0.0</div>
          <div id="_sayiaviCeza" style="font-size:0.68rem;color:#ff6584;font-weight:700;height:14px"></div>
        </div>
      </div>

      <div id="_sayiaviGrid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:14px"></div>

      <div id="_sayiaviGeri" style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:10px;min-height:18px;text-align:center"></div>
    </div>

    <div id="_sayiaviBitis" style="display:none;text-align:center;max-width:340px"></div>
  `;

  document.body.appendChild(modal);
}

function _sayiaviBasla() {
  document.getElementById('_sayiaviIntro').style.display = 'none';
  document.getElementById('_sayiaviGame').style.display = 'block';

  _sayiaviState.baslangic = Date.now();
  _sayiaviGridCiz();

  // Süre sayacı
  _sayiaviState.timer = setInterval(() => {
    if (!_sayiaviState || _sayiaviState.bitti) return;
    const gecen = (Date.now() - _sayiaviState.baslangic + _sayiaviState.ceza) / 1000;
    const el = document.getElementById('_sayiaviSure');
    if (el) el.textContent = gecen.toFixed(1);
  }, 100);
}

function _sayiaviGridCiz() {
  const grid = document.getElementById('_sayiaviGrid');
  if (!grid) return;
  grid.innerHTML = _sayiaviState.sayilar.map((s, idx) => {
    const bulundu = s < _sayiaviState.aktif;
    return `<button id="_sayiaviKare_${idx}" onclick="_sayiaviTikla(${s}, ${idx})" ${bulundu ? 'disabled' : ''} style="
      aspect-ratio:1;
      background:${bulundu ? 'rgba(67,181,90,0.2)' : 'rgba(255,255,255,0.08)'};
      border:1.5px solid ${bulundu ? 'rgba(67,181,90,0.4)' : 'rgba(255,255,255,0.15)'};
      border-radius:10px;
      color:${bulundu ? 'rgba(255,255,255,0.3)' : '#fff'};
      font-size:1.1rem;
      font-weight:800;
      font-family:inherit;
      cursor:${bulundu ? 'default' : 'pointer'};
      transition:all 0.12s;
      ${bulundu ? 'text-decoration:line-through' : ''}
    ">${s}</button>`;
  }).join('');
}

function _sayiaviTikla(sayi, idx) {
  if (!_sayiaviState || _sayiaviState.bitti) return;
  const kare = document.getElementById('_sayiaviKare_' + idx);

  if (sayi === _sayiaviState.aktif) {
    // Doğru
    if (kare) {
      kare.style.background = '#43b55a';
      kare.style.borderColor = '#43b55a';
      kare.style.transform = 'scale(0.95)';
      setTimeout(() => {
        kare.style.background = 'rgba(67,181,90,0.2)';
        kare.style.borderColor = 'rgba(67,181,90,0.4)';
        kare.style.color = 'rgba(255,255,255,0.3)';
        kare.style.textDecoration = 'line-through';
        kare.style.transform = 'scale(1)';
        kare.disabled = true;
        kare.style.cursor = 'default';
      }, 150);
    }

    // Haptic feedback (destekleyen cihazlarda)
    if (navigator.vibrate) navigator.vibrate(20);

    _sayiaviState.aktif++;
    const aktifEl = document.getElementById('_sayiaviAktif');
    if (aktifEl) {
      aktifEl.textContent = _sayiaviState.aktif <= 25 ? _sayiaviState.aktif : '✓';
    }

    if (_sayiaviState.aktif > 25) {
      _sayiaviBitir();
    }
  } else {
    // Yanlış — +2 saniye ceza
    if (kare) {
      kare.style.background = '#ff6584';
      kare.style.borderColor = '#ff6584';
      setTimeout(() => {
        kare.style.background = 'rgba(255,255,255,0.08)';
        kare.style.borderColor = 'rgba(255,255,255,0.15)';
      }, 400);
    }
    _sayiaviState.ceza += 2000;

    // Cezayı göster
    const cezaEl = document.getElementById('_sayiaviCeza');
    if (cezaEl) {
      cezaEl.textContent = '+2 saniye ceza';
      setTimeout(() => { if (cezaEl) cezaEl.textContent = ''; }, 1500);
    }

    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }
}

function _sayiaviBitir() {
  if (!_sayiaviState) return;
  _sayiaviState.bitti = true;
  if (_sayiaviState.timer) clearInterval(_sayiaviState.timer);

  const totalMs = Date.now() - _sayiaviState.baslangic + _sayiaviState.ceza;
  const saniye = (totalMs / 1000).toFixed(1);

  // En iyi süreyi güncelle (daha düşük daha iyi)
  const myUid = (window.currentUserData || {}).uid || 'local';
  const bestTimeKey = 'oyun_sayiavi_besttime_' + myUid;
  const onceki = _sayiaviState.bestTime;
  const yeniRekor = onceki === 0 || totalMs < onceki;
  if (yeniRekor) {
    localStorage.setItem(bestTimeKey, String(totalMs));
  }

  // Dün için kaydet — sonraki güne "dünkü süren"
  const todayKey = getTodayKey();
  const lastDateKey = 'oyun_sayiavi_lastdate_' + myUid;
  const lastDate = localStorage.getItem(lastDateKey);
  if (lastDate !== todayKey) {
    // Bugün ilk kez oynanıyor — bir önceki kayıtlı süre "dün" oluyor
    const buTimeKey = 'oyun_sayiavi_todaytime_' + myUid;
    const buGunSure = parseInt(localStorage.getItem(buTimeKey) || '0');
    if (buGunSure > 0) {
      localStorage.setItem('oyun_sayiavi_yesterdaytime_' + myUid, String(buGunSure));
    }
    localStorage.setItem(buTimeKey, String(totalMs));
    localStorage.setItem(lastDateKey, todayKey);
  } else {
    localStorage.setItem('oyun_sayiavi_todaytime_' + myUid, String(totalMs));
  }

  // Skor sistemi için: süreyi puana çevir (daha hızlı → daha yüksek puan)
  // 10 saniye = 1000 puan baseline
  const puan = Math.max(0, Math.round(100000 / totalMs));

  document.getElementById('_sayiaviGame').style.display = 'none';
  const bitisEl = document.getElementById('_sayiaviBitis');
  bitisEl.style.display = 'block';

  let mesaj = '';
  if (totalMs < 15000) mesaj = '⚡ İnanılmaz hızlısın!';
  else if (totalMs < 25000) mesaj = '🎯 Çok iyi gittin!';
  else if (totalMs < 40000) mesaj = '👍 Güzel iş.';
  else mesaj = '💪 Pratik yaptıkça hızlanacaksın.';

  // Dün ile karşılaştırma
  let kiyas = '';
  if (_sayiaviState.dunBest > 0) {
    const fark = _sayiaviState.dunBest - totalMs;
    if (fark > 500) {
      const yuzde = Math.round(fark / _sayiaviState.dunBest * 100);
      kiyas = `<div style="font-size:0.82rem;color:#43b55a;margin-top:8px;font-weight:700">📈 Dünkünden %${yuzde} daha hızlısın!</div>`;
    } else if (fark < -500) {
      const yuzde = Math.round(-fark / _sayiaviState.dunBest * 100);
      kiyas = `<div style="font-size:0.82rem;color:rgba(255,255,255,0.5);margin-top:8px">Dünkünden %${yuzde} daha yavaş — yarın tekrar dene</div>`;
    } else {
      kiyas = `<div style="font-size:0.82rem;color:rgba(255,255,255,0.6);margin-top:8px">Dünkü süreye çok yakınsın 🎯</div>`;
    }
  }

  bitisEl.innerHTML = `
    <div style="font-size:3rem;margin-bottom:10px">${yeniRekor ? '🏆' : '🔢'}</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:6px;color:#fff">${yeniRekor && onceki > 0 ? 'Yeni Rekor!' : 'Tamamlandı!'}</div>
    <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:18px">${mesaj}</div>
    <div style="background:rgba(125,211,252,0.12);border:1px solid rgba(125,211,252,0.3);border-radius:14px;padding:18px;margin-bottom:18px">
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-weight:700;letter-spacing:.1em;margin-bottom:5px">SÜRE</div>
      <div style="font-size:2.4rem;font-weight:900;color:#7dd3fc;font-variant-numeric:tabular-nums">${saniye}<span style="font-size:1rem;color:rgba(255,255,255,0.5)">s</span></div>
      ${_sayiaviState.ceza > 0 ? `<div style="font-size:0.72rem;color:#ff6584;margin-top:4px">+${_sayiaviState.ceza/1000}s ceza dahil</div>` : ''}
      ${kiyas}
    </div>
    <button onclick="_sayiaviKapat()" style="padding:12px 32px;border-radius:12px;border:none;background:rgba(125,211,252,0.2);color:#7dd3fc;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid rgba(125,211,252,0.4)">
      Tamam
    </button>
  `;

  _oyunOynanmisOlarakKaydet('sayiavi', puan);
}

function _sayiaviKapat() {
  if (_sayiaviState && _sayiaviState.timer) clearInterval(_sayiaviState.timer);
  const modal = document.getElementById('_sayiaviOyunModal');
  if (modal) modal.remove();
  _sayiaviState = null;
  if (typeof showPage === 'function') showPage('oyun');
}
