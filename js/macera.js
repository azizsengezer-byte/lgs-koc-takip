// ============================================================
// 🗺️ MACERA SAYFASI
// ============================================================

function maceraPage() {
  return `
    <div class="page-title">🗺️ Macera</div>
    <div class="page-sub">Gelişimini oyun gibi takip et</div>

    ${maceraEjderha()}

    ${maceraYakitTanki()}

    <!-- Yakında gelecekler -->
    <div class="card" style="margin-bottom:14px;opacity:0.6">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:2rem">🐉</div>
        <div>
          <div style="font-weight:700;font-size:0.95rem">Soru Ejderhası</div>
          <div style="font-size:0.78rem;color:var(--text2)">Yakında — her doğru soruyla ejderhan büyüyor</div>
        </div>
        <div style="margin-left:auto;background:var(--surface2);color:var(--text2);font-size:0.7rem;font-weight:700;padding:4px 10px;border-radius:99px">Yakında</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px;opacity:0.6">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:2rem">✉️</div>
        <div>
          <div style="font-weight:700;font-size:0.95rem">Gelecekteki Sen'den Mektuplar</div>
          <div style="font-size:0.78rem;color:var(--text2)">Yakında — kilometre taşlarında sana mektup geliyor</div>
        </div>
        <div style="margin-left:auto;background:var(--surface2);color:var(--text2);font-size:0.7rem;font-weight:700;padding:4px 10px;border-radius:99px">Yakında</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px;opacity:0.6">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:2rem">🌫️</div>
        <div>
          <div style="font-weight:700;font-size:0.95rem">Yolculuk Haritası</div>
          <div style="font-size:0.78rem;color:var(--text2)">Yakında — konuları çözdükçe haritadaki sis dağılıyor</div>
        </div>
        <div style="margin-left:auto;background:var(--surface2);color:var(--text2);font-size:0.7rem;font-weight:700;padding:4px 10px;border-radius:99px">Yakında</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px;opacity:0.6">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:2rem">👥</div>
        <div>
          <div style="font-weight:700;font-size:0.95rem">Birlikte Çalışma Odaları</div>
          <div style="font-size:0.78rem;color:var(--text2)">Yakında — arkadaşlarınla sanal odada çalış</div>
        </div>
        <div style="margin-left:auto;background:var(--surface2);color:var(--text2);font-size:0.7rem;font-weight:700;padding:4px 10px;border-radius:99px">Yakında</div>
      </div>
    </div>
  `;
}

// ============================================================
// ⚡ BİLİŞSEL YAKIT TANKI
// ============================================================

function maceraYakitTanki() {
  const { data } = _getW();
  const todayKey = getTodayKey();
  const today = data.days?.[todayKey] || {};

  const uyku   = parseFloat(today.uyku || 0);
  const enerji = parseInt(today.enerji || 5);
  const ekranSosyal = parseFloat(today.ekranSosyal || 0);

  // Formül: uyku(0-40) + enerji(0-40) - sosyal medya sızıntısı → /80 → %100
  const uykuPuan   = Math.min(40, Math.round((uyku / 8) * 40));
  const enerjiPuan = Math.min(40, Math.round((enerji / 10) * 40));
  const ekranKayip = Math.min(40, Math.round(ekranSosyal * 6));
  const ham        = uykuPuan + enerjiPuan - ekranKayip;
  const tank       = Math.max(0, Math.min(100, Math.round(ham / 80 * 100)));

  // Renk ve mesaj
  const { renk, renk2, mesaj, durum } = tank >= 70
    ? { renk: '#1D9E75', renk2: '#5DCAA5', mesaj: 'Odaklanmaya hazır', durum: 'iyi' }
    : tank >= 40
    ? { renk: '#BA7517', renk2: '#EF9F27', mesaj: 'Orta kapasite', durum: 'orta' }
    : { renk: '#E24B4A', renk2: '#F09595', mesaj: 'Düşük kapasite — dinlenmeni öneririm', durum: 'dusuk' };

  const veriYok = uyku === 0 && enerji === 5 && ekranSosyal === 0;

  return `
    <div class="card" style="margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div class="card-title" style="margin:0">⚡ Bilişsel Yakıt Tankı</div>
          <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Bugünkü beyin kapasiten</div>
        </div>
        <div style="font-size:2rem;font-weight:900;color:${renk}">${veriYok ? '--' : tank + '%'}</div>
      </div>

      ${veriYok ? `
        <div style="background:var(--surface2);border-radius:10px;padding:14px;text-align:center;margin-bottom:14px">
          <div style="font-size:0.85rem;color:var(--text2)">Wellness verisi girilmemiş</div>
          <button onclick="showPage('wellness')" style="margin-top:8px;background:var(--accent);color:#fff;border:none;border-radius:8px;padding:7px 18px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">
            Veri Gir →
          </button>
        </div>
      ` : `
        <!-- Tank çubuğu -->
        <div style="position:relative;height:44px;background:var(--surface2);border-radius:10px;overflow:hidden;margin-bottom:14px">
          <div style="position:absolute;left:0;top:0;bottom:0;width:${tank}%;background:linear-gradient(90deg,${renk},${renk2});border-radius:10px;transition:width 1s ease"></div>
          <div style="position:absolute;left:25%;top:0;bottom:0;width:1px;background:var(--bg);opacity:0.3"></div>
          <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--bg);opacity:0.3"></div>
          <div style="position:absolute;left:75%;top:0;bottom:0;width:1px;background:var(--bg);opacity:0.3"></div>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;color:${tank>20?'rgba(255,255,255,0.9)':'var(--text2)'}">${mesaj}</div>
        </div>
      `}

      <!-- Katkı kartları -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:${durum==='dusuk'&&!veriYok?'14px':'0'}">
        <div style="background:${uykuPuan>=28?'rgba(29,158,117,0.12)':'var(--surface2)'};border-radius:9px;padding:10px;text-align:center">
          <div style="font-size:0.7rem;color:var(--text2);margin-bottom:3px">Uyku</div>
          <div style="font-size:1.1rem;font-weight:800;color:${uykuPuan>=28?'#1D9E75':'var(--text)'}">${uyku>0?uyku+' sa':'--'}</div>
          <div style="font-size:0.65rem;color:${uykuPuan>=28?'#1D9E75':'var(--text2)'};margin-top:2px">${veriYok?'':'+'+(uykuPuan)+' yakıt'}</div>
        </div>
        <div style="background:${enerjiPuan>=28?'rgba(29,158,117,0.12)':'var(--surface2)'};border-radius:9px;padding:10px;text-align:center">
          <div style="font-size:0.7rem;color:var(--text2);margin-bottom:3px">Enerji</div>
          <div style="font-size:1.1rem;font-weight:800;color:${enerjiPuan>=28?'#1D9E75':'var(--text)'}">${enerji}/10</div>
          <div style="font-size:0.65rem;color:${enerjiPuan>=28?'#1D9E75':'var(--text2)'};margin-top:2px">${veriYok?'':'+'+(enerjiPuan)+' yakıt'}</div>
        </div>
        <div style="background:${ekranSosyal>5?'rgba(226,75,74,0.12)':'var(--surface2)'};border-radius:9px;padding:10px;text-align:center">
          <div style="font-size:0.7rem;color:var(--text2);margin-bottom:3px">Ekran</div>
          <div style="font-size:1.1rem;font-weight:800;color:${ekranSosyal>5?'#E24B4A':'var(--text)'}">${ekranSosyal>0?ekranSosyal+' sa':'--'}</div>
          <div style="font-size:0.6rem;color:var(--text2);margin-top:1px">${ekranSosyal>0?ekranSosyal+'sa sosyal':''}</div>
          <div style="font-size:0.65rem;color:${ekranSosyal>5?'#E24B4A':'var(--text2)'};margin-top:2px">${veriYok||ekranSosyal===0?'':'-'+(ekranKayip)+' sızıntı'}</div>
        </div>
      </div>

      ${durum === 'dusuk' && !veriYok ? `
        <div style="background:rgba(226,75,74,0.1);border:1px solid rgba(226,75,74,0.25);border-radius:9px;padding:10px 12px;font-size:0.8rem;color:#E24B4A;line-height:1.5">
          ⚠️ Tank kritik seviyede. Soru çözmeden önce 20 dk dinlenmeyi dene. Beyin yorgunken öğrenme verimliliği %40 düşüyor.
        </div>
      ` : durum === 'orta' && !veriYok ? `
        <div style="background:rgba(186,117,23,0.1);border:1px solid rgba(186,117,23,0.25);border-radius:9px;padding:10px 12px;font-size:0.8rem;color:#BA7517;line-height:1.5">
          💡 Orta kapasite. Zor konular yerine tekrar çalışması yapmak daha verimli olabilir.
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================
// 🐉 SORU EJDERHASI
// ============================================================

function ejderhaStage(toplamDogru) {
  if (toplamDogru >= 1000) return 4;
  if (toplamDogru >= 600)  return 3;
  if (toplamDogru >= 300)  return 2;
  if (toplamDogru >= 100)  return 1;
  return 0;
}

function ejderhaVerisi() {
  const myUid = (window.currentUserData||{}).uid || '';
  const todayKey = getTodayKey();

  // Tüm soru girişlerinden toplam doğru
  const soruEntries = studyEntries.filter(e => e.type === 'soru' && (e.userId === myUid || e.studentName === (window.currentUserData||{}).name));
  const toplamDogru = soruEntries.reduce((a, e) => a + (e.correct || 0), 0);

  // Son 5 gün veri var mı?
  const son5 = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    son5.push(getDateKey(d));
  }
  const son5Dogru = soruEntries.filter(e => son5.includes(e.dateKey)).reduce((a, e) => a + (e.correct || 0), 0);
  const ac = son5Dogru === 0; // 5 gündür veri yok

  // Bugün kaç doğru?
  const bugunDogru = soruEntries.filter(e => e.dateKey === todayKey).reduce((a, e) => a + (e.correct || 0), 0);

  // Geri evrim: 5 gün veri yoksa bir önceki aşamaya düş
  let gercekStage = ejderhaStage(toplamDogru);
  if (ac && gercekStage > 0) gercekStage--;

  // Günlük seri (art arda kaç gün giriş yapıldı)
  let seri = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const dk = getDateKey(d);
    const varMi = soruEntries.some(e => e.dateKey === dk);
    if (varMi) seri++;
    else break;
  }

  return { toplamDogru, gercekStage, ac, bugunDogru, seri };
}

function maceraEjderha() {
  const { toplamDogru, gercekStage, ac, bugunDogru, seri } = ejderhaVerisi();

  const stageInfo = [
    { lbl: 'Yumurta',          sub: 'İçinden bir şey çıkmak istiyor...',     sonraki: 100,  clr: '#AFA9EC' },
    { lbl: 'Yavru Ejderha',    sub: 'Küçük duman çıkartıyor, ateş henüz yok', sonraki: 300,  clr: '#5DCAA5' },
    { lbl: 'Genç Ejderha',     sub: 'Ateş geliyor — neredeyse tam güçte!',    sonraki: 600,  clr: '#EF9F27' },
    { lbl: 'Güçlü Ejderha',    sub: 'Tam güçte — ateş her yerde!',            sonraki: 1000, clr: '#E24B4A' },
    { lbl: 'Efsanevi Ejderha', sub: '1000+ doğru — kimse durduramaz!',        sonraki: null, clr: '#7F77DD' },
  ];
  const s = stageInfo[gercekStage];
  const nextPct = s.sonraki ? Math.min(100, Math.round(toplamDogru / s.sonraki * 100)) : 100;

  // Ejderha SVG'leri
  const svgList = [
    // 0: Yumurta
    `<svg width="140" height="160" viewBox="0 0 140 160" style="overflow:visible">
      <g style="animation:ejCrack 1.1s ease-in-out infinite;transform-origin:70px 88px">
        <ellipse cx="70" cy="90" rx="42" ry="52" fill="#CECBF6" stroke="#AFA9EC" stroke-width="2"/>
        <ellipse cx="70" cy="90" rx="32" ry="42" fill="#EEEDFE" opacity="0.5"/>
        <path d="M52 72 Q64 61 84 68" stroke="#AFA9EC" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M46 92 Q56 81 68 89" stroke="#AFA9EC" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M72 87 Q84 78 94 85" stroke="#AFA9EC" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M50 110 Q62 102 82 108" stroke="#AFA9EC" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
    // 1: Yavru
    `<svg width="160" height="180" viewBox="0 0 160 180" style="overflow:visible">
      <g style="animation:ejBounce 1.7s ease-in-out infinite;transform-origin:80px 108px">
        <g style="animation:ejTail 2s ease-in-out infinite;transform-origin:80px 148px">
          <path d="M80 148 Q60 160 54 174 Q64 162 72 170 Q78 158 84 170 Q90 160 98 170 Q96 158 80 148" fill="#9FE1CB"/>
        </g>
        <ellipse cx="80" cy="138" rx="30" ry="20" fill="#9FE1CB"/>
        <path d="M50 124 Q38 108 44 92 Q50 78 60 88 Q54 100 62 114" fill="#9FE1CB" stroke="#5DCAA5" stroke-width="1"/>
        <path d="M110 124 Q122 108 116 92 Q110 78 100 88 Q106 100 98 114" fill="#9FE1CB" stroke="#5DCAA5" stroke-width="1"/>
        <ellipse cx="80" cy="106" rx="26" ry="28" fill="#5DCAA5"/>
        <path d="M80 78 Q70 62 74 52 Q78 44 82 52 Q86 62 80 78" fill="#5DCAA5"/>
        <path d="M70 76 Q62 60 66 52 Q58 58 60 70" fill="#9FE1CB"/>
        <path d="M90 76 Q98 60 94 52 Q102 58 100 70" fill="#9FE1CB"/>
        <ellipse cx="71" cy="102" rx="6" ry="7" fill="white"/>
        <circle cx="72" cy="103" r="4" fill="#085041"/>
        <circle cx="73.5" cy="101" r="1.5" fill="white"/>
        <ellipse cx="89" cy="102" rx="6" ry="7" fill="white"/>
        <circle cx="90" cy="103" r="4" fill="#085041"/>
        <circle cx="91.5" cy="101" r="1.5" fill="white"/>
        <path d="M75 115 Q80 121 85 115" stroke="#085041" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
    // 2: Genç
    `<svg width="180" height="190" viewBox="0 0 180 190" style="overflow:visible">
      <g style="animation:ejFloat 2.2s ease-in-out infinite;transform-origin:88px 112px">
        <g style="animation:ejTail 2.2s ease-in-out infinite;transform-origin:88px 152px">
          <path d="M88 152 Q66 165 60 180 Q72 167 82 177 Q88 163 94 177 Q100 165 112 177 Q108 162 88 152" fill="#FAC775"/>
        </g>
        <ellipse cx="88" cy="142" rx="34" ry="22" fill="#FAC775"/>
        <g style="animation:ejWing 1.9s ease-in-out infinite;transform-origin:52px 104px">
          <path d="M52 104 Q16 80 14 52 Q30 64 44 86 Q50 96 56 106" fill="#FAC775" stroke="#EF9F27" stroke-width="1.5"/>
        </g>
        <g style="animation:ejWing 1.9s ease-in-out infinite 0.2s;transform-origin:124px 104px">
          <path d="M124 104 Q160 80 162 52 Q146 64 132 86 Q126 96 120 106" fill="#FAC775" stroke="#EF9F27" stroke-width="1.5"/>
        </g>
        <ellipse cx="88" cy="110" rx="30" ry="32" fill="#EF9F27"/>
        <path d="M88 78 Q77 58 81 48 Q85 38 89 48 Q93 58 88 78" fill="#EF9F27"/>
        <path d="M76 74 Q66 54 72 44 Q62 52 66 66" fill="#FAC775"/>
        <path d="M100 74 Q110 54 104 44 Q114 52 110 66" fill="#FAC775"/>
        <ellipse cx="78" cy="104" rx="7" ry="8" fill="white"/>
        <circle cx="79" cy="105" r="5" fill="#412402"/>
        <circle cx="81" cy="103" r="2" fill="white"/>
        <ellipse cx="98" cy="104" rx="7" ry="8" fill="white"/>
        <circle cx="99" cy="105" r="5" fill="#412402"/>
        <circle cx="101" cy="103" r="2" fill="white"/>
        <path d="M82 118 Q88 125 94 118" stroke="#412402" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- ağız sağ: ~116, ~112 -->
        <polygon points="116,108 116,116 148,112" fill="#E24B4A" style="animation:ejF1 0.55s ease-in-out infinite;transform-origin:116px 112px"/>
        <polygon points="116,109 116,115 138,112" fill="#FAC775" style="animation:ejF1 0.55s ease-in-out infinite 0.1s;transform-origin:116px 112px"/>
        <polygon points="116,110 116,114 128,112" fill="white" opacity="0.8" style="animation:ejF1 0.55s ease-in-out infinite 0.2s;transform-origin:116px 112px"/>
      </g>
    </svg>`,
    // 3: Güçlü
    `<svg width="200" height="200" viewBox="0 0 200 200" style="overflow:visible">
      <g style="animation:ejSoar 2.5s ease-in-out infinite;transform-origin:90px 116px">
        <g style="animation:ejTail 2s ease-in-out infinite;transform-origin:90px 158px">
          <path d="M90 158 Q66 172 58 190 Q72 174 84 186 Q90 172 96 186 Q102 174 116 186 Q112 170 90 158" fill="#F09595"/>
        </g>
        <ellipse cx="90" cy="148" rx="38" ry="25" fill="#F09595"/>
        <g style="animation:ejBigWing 1.4s ease-in-out infinite;transform-origin:50px 106px">
          <path d="M50 106 Q6 68 4 30 Q24 48 42 76 Q48 90 54 106" fill="#F09595" stroke="#E24B4A" stroke-width="1.5"/>
        </g>
        <g style="animation:ejBigWing 1.4s ease-in-out infinite 0.15s;transform-origin:130px 106px">
          <path d="M130 106 Q174 68 176 30 Q156 48 138 76 Q132 90 126 106" fill="#F09595" stroke="#E24B4A" stroke-width="1.5"/>
        </g>
        <ellipse cx="90" cy="116" rx="34" ry="35" fill="#E24B4A"/>
        <path d="M90 81 Q77 58 82 46 Q86 36 90 46 Q94 36 98 46 Q103 58 90 81" fill="#E24B4A"/>
        <path d="M76 77 Q64 54 70 42 Q60 52 64 66" fill="#F09595"/>
        <path d="M104 77 Q116 54 110 42 Q120 52 116 66" fill="#F09595"/>
        <ellipse cx="79" cy="109" rx="8" ry="9" fill="white"/>
        <circle cx="80" cy="110" r="6" fill="#501313"/>
        <circle cx="82.5" cy="108" r="2.5" fill="white"/>
        <ellipse cx="101" cy="109" rx="8" ry="9" fill="white"/>
        <circle cx="102" cy="110" r="6" fill="#501313"/>
        <circle cx="104.5" cy="108" r="2.5" fill="white"/>
        <path d="M84 124 Q90 132 96 124" stroke="#501313" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- ağız ~120, ~116 — büyük ateş -->
        <polygon points="120,109 120,123 162,116" fill="#E24B4A" style="animation:ejF2 0.45s ease-in-out infinite;transform-origin:120px 116px"/>
        <polygon points="120,111 120,121 152,116" fill="#FAC775" style="animation:ejF2 0.45s ease-in-out infinite 0.08s;transform-origin:120px 116px"/>
        <polygon points="120,112 120,120 140,116" fill="white" opacity="0.85" style="animation:ejF2 0.45s ease-in-out infinite 0.16s;transform-origin:120px 116px"/>
      </g>
    </svg>`,
    // 4: Efsanevi
    `<svg width="220" height="215" viewBox="0 0 220 215" style="overflow:visible">
      <g style="animation:ejSoar 2.8s ease-in-out infinite;transform-origin:100px 118px">
        <g style="animation:ejTail 2.2s ease-in-out infinite;transform-origin:100px 164px">
          <path d="M100 164 Q74 178 64 198 Q80 180 94 192 Q100 176 106 192 Q112 180 128 192 Q124 176 100 164" fill="#AFA9EC"/>
        </g>
        <ellipse cx="100" cy="154" rx="42" ry="27" fill="#AFA9EC"/>
        <g style="animation:ejBigWing 1.2s ease-in-out infinite;transform-origin:54px 110px">
          <path d="M54 110 Q2 64 0 20 Q22 42 44 76 Q50 92 58 110" fill="#AFA9EC" stroke="#7F77DD" stroke-width="1.5"/>
          <path d="M54 110 Q12 76 10 40 Q28 58 46 84" fill="#EEEDFE" opacity="0.3"/>
        </g>
        <g style="animation:ejBigWing 1.2s ease-in-out infinite 0.12s;transform-origin:146px 110px">
          <path d="M146 110 Q198 64 200 20 Q178 42 156 76 Q150 92 142 110" fill="#AFA9EC" stroke="#7F77DD" stroke-width="1.5"/>
          <path d="M146 110 Q188 76 190 40 Q172 58 154 84" fill="#EEEDFE" opacity="0.3"/>
        </g>
        <ellipse cx="100" cy="120" rx="36" ry="37" fill="#7F77DD"/>
        <g style="animation:ejCrown 1.8s ease-in-out infinite;transform-origin:100px 62px">
          <path d="M80 78 L86 56 L94 70 L100 48 L106 70 L114 56 L120 78 Z" fill="#FAC775" stroke="#EF9F27" stroke-width="1.5"/>
          <circle cx="100" cy="50" r="5" fill="#E24B4A"/>
          <circle cx="87" cy="58" r="3" fill="#1D9E75"/>
          <circle cx="113" cy="58" r="3" fill="#1D9E75"/>
        </g>
        <path d="M100 83 Q87 60 92 46 Q96 36 100 46 Q104 36 108 46 Q113 60 100 83" fill="#7F77DD"/>
        <path d="M86 79 Q74 56 80 42 Q70 52 74 66" fill="#AFA9EC"/>
        <path d="M114 79 Q126 56 120 42 Q130 52 126 66" fill="#AFA9EC"/>
        <ellipse cx="88" cy="113" rx="9" ry="10" fill="white"/>
        <circle cx="89" cy="114" r="7" fill="#26215C"/>
        <circle cx="92" cy="111.5" r="3" fill="white"/>
        <ellipse cx="112" cy="113" rx="9" ry="10" fill="white"/>
        <circle cx="113" cy="114" r="7" fill="#26215C"/>
        <circle cx="116" cy="111.5" r="3" fill="white"/>
        <path d="M93 129 Q100 137 107 129" stroke="#26215C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- devasa ateş ~132, ~122 -->
        <polygon points="132,113 132,131 185,122" fill="#7F77DD" style="animation:ejF3 0.38s ease-in-out infinite;transform-origin:132px 122px"/>
        <polygon points="132,115 132,129 174,122" fill="#E24B4A" style="animation:ejF3 0.38s ease-in-out infinite 0.07s;transform-origin:132px 122px"/>
        <polygon points="132,116 132,128 162,122" fill="#FAC775" style="animation:ejF3 0.38s ease-in-out infinite 0.14s;transform-origin:132px 122px"/>
        <polygon points="132,117 132,127 150,122" fill="white" opacity="0.9" style="animation:ejF3 0.38s ease-in-out infinite 0.21s;transform-origin:132px 122px"/>
        <!-- duman halkaları -->
        <circle cx="190" cy="108" r="9" fill="none" stroke="#CECBF6" stroke-width="2" style="animation:ejSmoke 2s ease-out infinite"/>
        <circle cx="186" cy="100" r="6" fill="none" stroke="#CECBF6" stroke-width="1.5" style="animation:ejSmoke 2s ease-out 0.7s infinite"/>
      </g>
    </svg>`
  ];

  // Aç görseli — gözler kapalı
  const acOverlay = `<div style="position:absolute;top:8px;left:50%;transform:translateX(-50%);background:rgba(226,75,74,0.12);border:1px solid rgba(226,75,74,0.3);border-radius:8px;padding:3px 10px;font-size:12px;font-weight:700;color:#E24B4A">😴 Aç — 5 gündür uyuyor!</div>`;

  const sonrakiSoru = s.sonraki ? `${toplamDogru} / ${s.sonraki} doğru` : `${toplamDogru} doğru — ZİRVE!`;

  return `
    <div class="card" style="margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <div class="card-title" style="margin:0">🐉 Soru Ejderhası</div>
          <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">${s.lbl}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.75rem;color:var(--text2)">Günlük seri</div>
          <div style="font-size:1.3rem;font-weight:900;color:${s.clr}">${seri} 🔥</div>
        </div>
      </div>

      <!-- Ejderha sahne -->
      <div style="position:relative;background:var(--surface2);border-radius:12px;min-height:190px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;overflow:hidden">
        ${ac ? acOverlay : ''}
        <div style="${ac ? 'filter:grayscale(0.7) brightness(0.65)' : ''}">
          ${svgList[gercekStage]}
        </div>
      </div>

      <!-- İlerleme -->
      <div style="font-size:0.75rem;color:var(--text2);margin-bottom:5px;display:flex;justify-content:space-between">
        <span>${s.sub}</span>
        <span>${sonrakiSoru}</span>
      </div>
      <div style="background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;margin-bottom:12px">
        <div style="width:${nextPct}%;height:100%;background:${s.clr};border-radius:4px;transition:width 0.8s ease"></div>
      </div>

      <!-- İstatistikler -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center">
          <div style="font-size:0.7rem;color:var(--text2);margin-bottom:3px">Toplam doğru</div>
          <div style="font-size:1.1rem;font-weight:800;color:var(--text)">${toplamDogru}</div>
        </div>
        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center">
          <div style="font-size:0.7rem;color:var(--text2);margin-bottom:3px">Bugün</div>
          <div style="font-size:1.1rem;font-weight:800;color:${bugunDogru>0?s.clr:'var(--text)'}">+${bugunDogru}</div>
        </div>
        <div style="background:${ac?'rgba(226,75,74,0.1)':'var(--surface2)'};border-radius:9px;padding:10px;text-align:center;${ac?'border:1px solid rgba(226,75,74,0.25)':''}">
          <div style="font-size:0.7rem;color:${ac?'#E24B4A':'var(--text2)'};margin-bottom:3px">Durum</div>
          <div style="font-size:0.85rem;font-weight:800;color:${ac?'#E24B4A':s.clr}">${ac?'😴 Aç':'✅ Tok'}</div>
        </div>
      </div>

      ${ac ? `
        <div style="margin-top:10px;background:rgba(226,75,74,0.08);border:1px solid rgba(226,75,74,0.2);border-radius:9px;padding:10px 12px;font-size:0.8rem;color:#E24B4A;line-height:1.5">
          ⚠️ Ejderhan 5 gündür beslenmedi ve bir önceki aşamaya geriledi! Bugün en az 10 doğru çöz.
        </div>
      ` : ''}
    </div>

    <style>
      @keyframes ejCrack{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
      @keyframes ejBounce{0%,100%{transform:translateY(0)}45%{transform:translateY(-9px)}65%{transform:translateY(-3px)}}
      @keyframes ejFloat{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-12px) rotate(1.5deg)}}
      @keyframes ejSoar{0%,100%{transform:translateY(0) rotate(-1deg)}35%{transform:translateY(-16px) rotate(1.5deg)}70%{transform:translateY(-8px)}}
      @keyframes ejTail{0%,100%{transform:rotate(0deg)}50%{transform:rotate(10deg)}}
      @keyframes ejWing{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-13deg)}}
      @keyframes ejBigWing{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-20deg)}}
      @keyframes ejCrown{0%,100%{opacity:0.8;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
      @keyframes ejF1{0%,100%{transform:scaleY(1) scaleX(1)}35%{transform:scaleY(1.6) scaleX(0.7)}70%{transform:scaleY(0.65) scaleX(1.35)}}
      @keyframes ejF2{0%,100%{transform:scaleY(1) scaleX(1)}35%{transform:scaleY(1.8) scaleX(0.65)}70%{transform:scaleY(0.55) scaleX(1.45)}}
      @keyframes ejF3{0%,100%{transform:scaleY(1) scaleX(1)}30%{transform:scaleY(2) scaleX(0.6)}70%{transform:scaleY(0.5) scaleX(1.55)}}
      @keyframes ejSmoke{0%{opacity:0.7;transform:scale(0.4) translate(0,0)}100%{opacity:0;transform:scale(2.5) translate(20px,-14px)}}
    </style>
  `;
}
