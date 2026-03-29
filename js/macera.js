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
    { lbl: 'Yumurta',          sub: 'İçinden bir şey çıkmak istiyor...',      sonraki: 100,  clr: '#AFA9EC' },
    { lbl: 'Yavru Ejderha',    sub: 'Küçük duman çıkartıyor, ateş henüz yok', sonraki: 300,  clr: '#5DCAA5' },
    { lbl: 'Genç Ejderha',     sub: 'Ateş geliyor — neredeyse tam güçte!',     sonraki: 600,  clr: '#EF9F27' },
    { lbl: 'Güçlü Ejderha',    sub: 'Tam güçte — ateş her yerde!',             sonraki: 1000, clr: '#E24B4A' },
    { lbl: 'Efsanevi Ejderha', sub: '1000+ doğru — kimse durduramaz!',         sonraki: null, clr: '#7F77DD' },
  ];
  const s = stageInfo[gercekStage];
  const nextPct = s.sonraki ? Math.min(100, Math.round(toplamDogru / s.sonraki * 100)) : 100;
  const sonrakiSoru = s.sonraki ? `${toplamDogru} / ${s.sonraki} doğru` : `${toplamDogru} doğru — ZİRVE!`;

  setTimeout(() => {
    // Duruma göre başlangıç state
    const initState = ac ? 'hungry' : gercekStage >= 3 ? 'fire' : 'happy';
    if (typeof window._ejderhaSetState === 'function') {
      window._ejderhaSetState(initState);
    }
  }, 100);

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

      <div id="ejderha-scene" onclick="window._ejderhaTap(event)" style="position:relative;height:240px;background:linear-gradient(180deg,#1a1060 0%,#0f0830 100%);border-radius:14px;overflow:hidden;cursor:pointer;margin-bottom:12px">
        <div style="position:absolute;top:12px;left:20px;width:3px;height:3px;background:white;border-radius:50%;opacity:0.6"></div>
        <div style="position:absolute;top:28px;left:60px;width:2px;height:2px;background:white;border-radius:50%;opacity:0.4"></div>
        <div style="position:absolute;top:18px;right:40px;width:3px;height:3px;background:white;border-radius:50%;opacity:0.7"></div>
        <div style="position:absolute;top:40px;right:80px;width:2px;height:2px;background:white;border-radius:50%;opacity:0.5"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:44px;background:#6c63ff22;border-top:1px solid #6c63ff44;border-radius:0 0 14px 14px"></div>
        <div id="ej-fx" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none"></div>
        <div id="ej-wrap" style="position:absolute;bottom:36px;left:50%;transform:translateX(-50%)">
          <svg id="dragon-svg" width="160" height="200" viewBox="0 0 160 200" style="overflow:visible;cursor:pointer">
      <g id="tail" style="transform-origin:62px 155px;animation:tailIdle 2.5s ease-in-out infinite">
        <path d="M62 155 Q30 165 18 182 Q28 170 38 176 Q46 162 56 170 Q60 158 68 162 Q66 156 62 155" fill="#5a4fcf"/>
      </g>
      <ellipse cx="80" cy="148" rx="40" ry="28" fill="#6c63ff"/>
      <ellipse cx="80" cy="148" rx="28" ry="18" fill="#7c74ff" opacity="0.4"/>
      <g id="wing-l" style="transform-origin:50px 120px;animation:wingIdle 2s ease-in-out infinite">
        <path d="M50 120 Q10 88 8 56 Q24 72 38 96 Q44 110 52 122" fill="#5a4fcf"/>
        <path d="M50 120 Q18 92 16 64 Q28 78 40 100" fill="#7c74ff" opacity="0.3"/>
      </g>
      <g id="wing-r" style="transform-origin:110px 120px;animation:wingIdle 2s ease-in-out infinite 0.2s">
        <path d="M110 120 Q150 88 152 56 Q136 72 122 96 Q116 110 108 122" fill="#5a4fcf"/>
        <path d="M110 120 Q142 92 144 64 Q132 78 120 100" fill="#7c74ff" opacity="0.3"/>
      </g>
      <path d="M66 120 Q70 102 78 98 Q82 96 86 98 Q94 102 94 120" fill="#6c63ff"/>
      <g id="head" style="animation:idle 3s ease-in-out infinite">
        <ellipse cx="80" cy="82" rx="36" ry="32" fill="#6c63ff"/>
        <path d="M62 58 Q58 42 64 36 Q68 44 66 54" fill="#5a4fcf"/>
        <path d="M72 54 Q70 38 76 32 Q80 40 78 52" fill="#7c74ff"/>
        <path d="M88 54 Q90 38 84 32 Q80 40 82 52" fill="#7c74ff"/>
        <path d="M98 58 Q102 42 96 36 Q92 44 94 54" fill="#5a4fcf"/>
        <ellipse cx="80" cy="90" rx="14" ry="10" fill="#7c74ff"/>
        <circle cx="76" cy="89" r="3" fill="#5a4fcf" opacity="0.6"/>
        <circle cx="84" cy="89" r="3" fill="#5a4fcf" opacity="0.6"/>
        <g id="eye-l">
          <ellipse cx="65" cy="74" rx="11" ry="12" fill="white"/>
          <ellipse cx="65" cy="75" rx="8" ry="9" fill="#4cc9f0"/>
          <circle cx="65" cy="75" r="5" fill="#1a0050"/>
          <circle cx="67.5" cy="72.5" r="2" fill="white"/>
        </g>
        <g id="eye-r">
          <ellipse cx="95" cy="74" rx="11" ry="12" fill="white"/>
          <ellipse cx="95" cy="75" rx="8" ry="9" fill="#4cc9f0"/>
          <circle cx="95" cy="75" r="5" fill="#1a0050"/>
          <circle cx="97.5" cy="72.5" r="2" fill="white"/>
        </g>
        <path id="mouth" d="M72 96 Q80 102 88 96" stroke="#4a40c8" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="55" cy="84" rx="8" ry="5" fill="#ff6b9d" opacity="0.35"/>
        <ellipse cx="105" cy="84" rx="8" ry="5" fill="#ff6b9d" opacity="0.35"/>
        <ellipse cx="63" cy="56" rx="5" ry="8" fill="#4cc9f0" transform="rotate(-15 63 56)"/>
        <ellipse cx="97" cy="56" rx="5" ry="8" fill="#4cc9f0" transform="rotate(15 97 56)"/>
        <g id="fire-group" style="display:none">
          <!-- Kıvılcım parçacıkları -->
          <circle cx="110" cy="86" r="3" fill="#ff9500" style="animation:firebreath 0.35s ease-in-out infinite 0s"/>
          <circle cx="118" cy="88" r="2.5" fill="#ffcc00" style="animation:firebreath 0.35s ease-in-out infinite 0.05s"/>
          <circle cx="106" cy="90" r="2" fill="#ff6600" style="animation:firebreath 0.35s ease-in-out infinite 0.1s"/>
          <!-- Ana alev gövdesi — yatay uzayan damlacık -->
          <ellipse cx="112" cy="92" rx="20" ry="7" fill="#ff6600" style="animation:firebreath 0.4s ease-in-out infinite 0s" transform-origin="94px 92px"/>
          <ellipse cx="116" cy="92" rx="14" ry="5" fill="#ff9500" style="animation:firebreath 0.4s ease-in-out infinite 0.07s" transform-origin="94px 92px"/>
          <ellipse cx="120" cy="92" rx="9" ry="3.5" fill="#ffcc00" style="animation:firebreath 0.4s ease-in-out infinite 0.14s" transform-origin="94px 92px"/>
          <ellipse cx="124" cy="92" rx="5" ry="2" fill="white" opacity="0.9" style="animation:firebreath 0.4s ease-in-out infinite 0.21s" transform-origin="94px 92px"/>
          <!-- Alev dili — yukarı kıvrılan -->
          <path d="M98 92 Q108 82 118 86 Q112 90 120 88 Q114 96 104 94 Z" fill="#ff4500" style="animation:firebreath 0.5s ease-in-out infinite 0.05s" transform-origin="94px 92px"/>
          <path d="M100 92 Q108 85 115 88 Q110 92 116 90 Q111 96 104 94 Z" fill="#ff7700" style="animation:firebreath 0.5s ease-in-out infinite 0.12s" transform-origin="94px 92px"/>
        </g>
      </g>
      <ellipse cx="58" cy="170" rx="14" ry="9" fill="#5a4fcf" transform="rotate(-20 58 170)"/>
      <ellipse cx="102" cy="170" rx="14" ry="9" fill="#5a4fcf" transform="rotate(20 102 170)"/>
      <ellipse cx="54" cy="175" rx="7" ry="5" fill="#4a40c8"/>
      <ellipse cx="106" cy="175" rx="7" ry="5" fill="#4a40c8"/>
    </svg>
        </div>
        <div id="ej-bubble" style="display:none;position:absolute;bottom:198px;left:50%;transform:translateX(-50%);background:white;color:#333;border-radius:12px;padding:5px 12px;font-size:12px;font-weight:700;white-space:nowrap;z-index:10">
          <span id="ej-bubble-text"></span>
          <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid white"></div>
        </div>
        <div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:10px;color:rgba(255,255,255,0.3)">ejderhana dokun</div>
      </div>

      <div style="font-size:0.75rem;color:var(--text2);margin-bottom:5px;display:flex;justify-content:space-between">
        <span>${s.sub}</span>
        <span>${sonrakiSoru}</span>
      </div>
      <div style="background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;margin-bottom:12px">
        <div style="width:${nextPct}%;height:100%;background:${s.clr};border-radius:4px;transition:width 0.8s ease"></div>
      </div>

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

      ${ac ? `<div style="margin-top:10px;background:rgba(226,75,74,0.08);border:1px solid rgba(226,75,74,0.2);border-radius:9px;padding:10px 12px;font-size:0.8rem;color:#E24B4A;line-height:1.5">⚠️ Ejderhan 5 gündür beslenmedi ve geriledi! Bugün en az 10 doğru çöz.</div>` : ''}
    </div>

    <style>
      @keyframes ejIdle{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}
      @keyframes ejBlink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.05)}}
      @keyframes ejTailIdle{0%,100%{transform:rotate(0deg)}50%{transform:rotate(12deg)}}
      @keyframes ejWingIdle{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-10deg)}}
      @keyframes ejHappy{0%{transform:translateY(0)}15%{transform:translateY(-20px) rotate(-8deg)}30%{transform:translateY(-14px) rotate(8deg)}45%{transform:translateY(-22px) rotate(-5deg)}60%{transform:translateY(-10px) rotate(4deg)}75%{transform:translateY(-18px) rotate(-3deg)}100%{transform:translateY(0)}}
      @keyframes ejHeart{0%{opacity:0;transform:translate(-50%,-50%) scale(0)}20%{opacity:1;transform:translate(-50%,-120%) scale(1.2)}60%{opacity:1;transform:translate(-50%,-180%) scale(1)}100%{opacity:0;transform:translate(-50%,-260%) scale(0.8)}}
      @keyframes ejFire{0%{opacity:0;transform:scaleX(0)}15%{opacity:1}80%{opacity:1}100%{opacity:0;transform:scaleX(1)}}
      @keyframes ejZzz{0%{opacity:0;transform:translate(0,0) scale(0.5)}50%{opacity:1}100%{opacity:0;transform:translate(-20px,-28px) scale(1.5)}}
      @keyframes ejSleepy{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-4px) rotate(2deg)}}
      #tail{transform-origin:62px 155px;animation:ejTailIdle 2.5s ease-in-out infinite}
      #wing-l{transform-origin:50px 120px;animation:ejWingIdle 2s ease-in-out infinite}
      #wing-r{transform-origin:110px 120px;animation:ejWingIdle 2s ease-in-out infinite 0.2s}
      #head{animation:ejIdle 3s ease-in-out infinite}
    </style>
  `;
}


// Ejderha interaktif fonksiyonlar
(function(){
  let curState = 'happy', tapCount = 0, isAnimating = false;
  const msgs = {
    happy: ['Soru çözmeye hazırım! 💪','Bugün harika hissediyorum!','Birlikte başarırız! ⭐','Daha fazla soru!'],
    hungry: ['Açım... biraz soru çöz 🥺','2 gündür bekledim seni...','Lütfen beni besle 😢','Soru çözmek istiyorum...'],
    fire: ['RAWR! 🔥 Tam güçteyim!','Bugün rekor kırıyoruz!','Ateşim sönmez! 💥','En iyi günüm bu! 👑']
  };

  function showBubble(text, dur=2000){
    const b=document.getElementById('ej-bubble');
    const t=document.getElementById('ej-bubble-text');
    if(!b||!t) return;
    t.textContent=text; b.style.display='block';
    setTimeout(()=>{b.style.display='none';},dur);
  }

  function spawnFx(x,y,type){
    const fx=document.getElementById('ej-fx');
    if(!fx) return;
    const el=document.createElement('div');
    el.style.cssText=`position:absolute;left:${x}px;top:${y}px;font-size:20px;pointer-events:none;animation:ejHeart 1s ease-out forwards`;
    el.textContent=type==='heart'?'💜':'✨';
    fx.appendChild(el);
    setTimeout(()=>el.remove(),1000);
  }

  function spawnStars(){
    for(let i=0;i<4;i++) setTimeout(()=>spawnFx(60+Math.random()*80,20+Math.random()*60,i%2?'heart':'star'),i*150);
  }

  window._ejderhaTap = function(e){
    if(isAnimating) return;
    const scene=document.getElementById('ejderha-scene');
    if(!scene) return;
    const rect=scene.getBoundingClientRect();
    const x=e.clientX-rect.left, y=e.clientY-rect.top;
    tapCount++; isAnimating=true;
    const dragon=document.getElementById('dragon-svg');
    if(!dragon){isAnimating=false;return;}
    if(curState==='hungry'){
      showBubble(msgs.hungry[tapCount%msgs.hungry.length]);
      spawnFx(x,y-20,'star');
      setTimeout(()=>{isAnimating=false;},600);
    } else if(curState==='fire'){
      dragon.style.animation='ejHappy 0.9s ease-out';
      spawnStars();
      showBubble(msgs.fire[tapCount%msgs.fire.length]);
      setTimeout(()=>{dragon.style.animation='';isAnimating=false;},950);
    } else {
      dragon.style.animation='ejHappy 0.8s ease-out';
      spawnFx(x,y-10,'heart');
      showBubble(msgs.happy[tapCount%msgs.happy.length]);
      setTimeout(()=>{dragon.style.animation='';isAnimating=false;},850);
    }
  };

  window._ejderhaSetState = function(s){
    curState=s;
    const head=document.getElementById('head');
    const fire=document.getElementById('fire-group');
    const mouth=document.getElementById('mouth');
    const lEye=document.getElementById('eye-l');
    const rEye=document.getElementById('eye-r');
    const dragon=document.getElementById('dragon-svg');
    const zzzLayer=document.getElementById('ej-fx');
    if(!head||!dragon) return;
    if(s==='hungry'){
      dragon.style.filter='grayscale(0.5) brightness(0.75)';
      head.style.animation='ejSleepy 4s ease-in-out infinite';
      if(fire) fire.style.display='none';
      if(mouth) mouth.setAttribute('d','M72 98 Q80 95 88 98');
      if(lEye) lEye.style.transform='scaleY(0.35) translateY(8px)';
      if(rEye) rEye.style.transform='scaleY(0.35) translateY(8px)';
      if(zzzLayer){
        zzzLayer.innerHTML='';
        for(let i=0;i<3;i++){
          const z=document.createElement('div');
          z.style.cssText=`position:absolute;left:${112-i*14}px;top:${32+i*16}px;font-size:${16-i*3}px;color:rgba(255,255,255,0.6);animation:ejZzz 2.4s ease-out ${i*0.8}s infinite`;
          z.textContent='z';
          zzzLayer.appendChild(z);
        }
      }
    } else if(s==='fire'){
      dragon.style.filter='none';
      head.style.animation='ejIdle 2s ease-in-out infinite';
      if(fire) fire.style.display='block';
      if(mouth) mouth.setAttribute('d','M70 97 Q80 106 90 97');
      if(lEye) lEye.style.transform='';
      if(rEye) rEye.style.transform='';
      if(zzzLayer) zzzLayer.innerHTML='';
    } else {
      dragon.style.filter='none';
      head.style.animation='ejIdle 3s ease-in-out infinite';
      if(fire) fire.style.display='none';
      if(mouth) mouth.setAttribute('d','M72 96 Q80 102 88 96');
      if(lEye) lEye.style.transform='';
      if(rEye) rEye.style.transform='';
      if(zzzLayer) zzzLayer.innerHTML='';
    }
  };

  // Periyodik mesajlar
  setInterval(()=>{
    if(!isAnimating&&Math.random()>0.6){
      const m=msgs[curState];
      showBubble(m[Math.floor(Math.random()*m.length)],1800);
    }
  },8000);
})();
