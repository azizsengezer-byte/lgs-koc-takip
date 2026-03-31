// ============================================================
// 🗺️ MACERA SAYFASI
// ============================================================

function maceraPage() {
  return `
    <div class="page-title">🗺️ Macera</div>
    <div class="page-sub">Gelişimini oyun gibi takip et</div>

    ${maceraEjderha()}

    ${maceraYakitTanki()}

    ${maceraHarita()}

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
  `;
}

// ============================================================
// 🐉 EJDERHA VERİSİ
// ============================================================

function ejderhaStage(toplamDogru) {
  if (toplamDogru >= 1000) return 4;
  if (toplamDogru >= 600)  return 3;
  if (toplamDogru >= 300)  return 2;
  if (toplamDogru >= 100)  return 1;
  return 0;
}

function ejderhaVerisi() {
  const myUid    = (window.currentUserData||{}).uid || '';
  const todayKey = getTodayKey();
  const soruEntries = studyEntries.filter(e =>
    e.type === 'soru' &&
    (e.userId === myUid || e.studentName === (window.currentUserData||{}).name)
  );
  const toplamDogru = soruEntries.reduce((a,e) => a+(e.correct||0), 0);

  // Son 5 gün boşsa → geri evrim
  const son5 = Array.from({length:5},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-i); return getDateKey(d); });
  const ac   = soruEntries.filter(e=>son5.includes(e.dateKey)).reduce((a,e)=>a+(e.correct||0),0) === 0;

  // Son 2 gün boşsa → uyuyor
  const son2     = [0,1].map(i=>{ const d=new Date(); d.setDate(d.getDate()-i); return getDateKey(d); });
  const uyuyor   = !ac && soruEntries.filter(e=>son2.includes(e.dateKey)).reduce((a,e)=>a+(e.correct||0),0) === 0;
  const bugunDogru = soruEntries.filter(e=>e.dateKey===todayKey).reduce((a,e)=>a+(e.correct||0),0);

  let gercekStage = ejderhaStage(toplamDogru);
  if (ac && gercekStage > 0) gercekStage--;

  let seri = 0;
  for (let i=0; i<30; i++) {
    const d=new Date(); d.setDate(d.getDate()-i);
    if (soruEntries.some(e=>e.dateKey===getDateKey(d))) seri++;
    else break;
  }

  // Wellness'dan mutluluk
  const { data: wData } = _getW();
  const todayW    = (wData.days||{})[todayKey] || {};
  const mutluluk  = todayW.mood ? ({great:100,good:80,ok:60,bad:30,terrible:10}[todayW.mood]||50) : 50;
  const dunKey    = son2[1];
  const dunDogru  = soruEntries.filter(e=>e.dateKey===dunKey).reduce((a,e)=>a+(e.correct||0),0);
  const aclik     = bugunDogru===0 ? 0 : Math.min(100, Math.round(bugunDogru/20*100));
  const enerji    = Math.min(100, Math.round((bugunDogru+dunDogru)/30*100));

  return { toplamDogru, gercekStage, ac, uyuyor, bugunDogru, seri, mutluluk, aclik, enerji };
}

// ============================================================
// 🥚 SVG: YUMURTA
// ============================================================
function _svgYumurta(state) {
  const asleep = state==='sleeping'||state==='hungry';
  const gray   = state==='hungry' ? 'filter:grayscale(.6) brightness(.68)' : '';
  const eyeL   = asleep
    ? `<path d="M58 113 Q68 121 78 113" stroke="#8070d0" stroke-width="3.8" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="68" cy="112" rx="8.5" ry="9.5" fill="white"/>
       <ellipse cx="68" cy="113" rx="6" ry="7" fill="url(#ejIris1)"/>
       <circle  cx="68" cy="113" r="3.8" fill="#0a0025"/>
       <circle  cx="70.5" cy="110.5" r="1.6" fill="white"/>
       <circle  cx="66.5" cy="114.5" r=".9" fill="rgba(255,255,255,.4)"/>`;
  const eyeR   = asleep
    ? `<path d="M82 113 Q92 121 102 113" stroke="#8070d0" stroke-width="3.8" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="92" cy="112" rx="8.5" ry="9.5" fill="white"/>
       <ellipse cx="92" cy="113" rx="6" ry="7" fill="url(#ejIris1)"/>
       <circle  cx="92" cy="113" r="3.8" fill="#0a0025"/>
       <circle  cx="94.5" cy="110.5" r="1.6" fill="white"/>
       <circle  cx="90.5" cy="114.5" r=".9" fill="rgba(255,255,255,.4)"/>`;
  const mouth  = asleep
    ? `<path d="M73 123 Q80 120 87 123" stroke="#9080d0" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : `<path d="M72 121 Q80 129 88 121" stroke="#9080d0" stroke-width="2" fill="none" stroke-linecap="round"/>
       <path d="M74 122 Q80 127 86 122" fill="#cc99ff" opacity=".3"/>`;

  return `<svg id="dragon-svg" width="160" height="200" viewBox="0 0 160 200" style="overflow:visible;animation:ejBreathe 3.5s ease-in-out infinite;${gray}">
  <defs>
    <radialGradient id="ejEggGrad" cx="38%" cy="30%">
      <stop offset="0%"   stop-color="#ede6ff"/>
      <stop offset="55%"  stop-color="#d8ceff"/>
      <stop offset="100%" stop-color="#c0b0f0"/>
    </radialGradient>
    <radialGradient id="ejEggInner" cx="50%" cy="55%">
      <stop offset="0%"   stop-color="#b090ff" stop-opacity=".35"/>
      <stop offset="100%" stop-color="#b090ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ejIris1" cx="40%" cy="35%">
      <stop offset="0%"   stop-color="#9580ff"/>
      <stop offset="60%"  stop-color="#6c63ff"/>
      <stop offset="100%" stop-color="#4030a0"/>
    </radialGradient>
  </defs>
  <ellipse cx="80" cy="190" rx="38" ry="7" fill="#000" opacity=".14"/>
  <g id="head" style="transform-origin:80px 118px;animation:${asleep?'ejSleepy 4s':'ejEggRock 2.3s'} ease-in-out infinite">
    <ellipse cx="80" cy="118" rx="54" ry="67" fill="url(#ejEggGrad)"/>
    <ellipse cx="80" cy="130" rx="40" ry="52" fill="url(#ejEggInner)" style="animation:ejEggGlow 2.5s ease-in-out infinite"/>
    <ellipse cx="62" cy="83" rx="15" ry="9" fill="white" opacity=".42" transform="rotate(-28 62 83)"/>
    <ellipse cx="90" cy="75" rx="7"  ry="4" fill="white" opacity=".2"  transform="rotate(-15 90 75)"/>
    <ellipse cx="80" cy="160" rx="40" ry="22" fill="#a090d0" opacity=".28"/>
    <g style="animation:ejCrack 1.9s ease-in-out infinite">
      <path d="M80 72 L73 90 L83 96 L74 113" stroke="#9080d0" stroke-width="2"   fill="none" stroke-linecap="round"/>
      <path d="M91 98 L99 105 L93 113"       stroke="#9080d0" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M65 108 L58 118 L67 123"      stroke="#9080d0" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M83 96 L90 98"                stroke="#b0a0e0" stroke-width="1"   fill="none" stroke-linecap="round"/>
    </g>
    ${eyeL}${eyeR}${mouth}
    <ellipse cx="59" cy="120" rx="8" ry="5.5" fill="#ffb3d1" opacity=".38"/>
    <ellipse cx="101" cy="120" rx="8" ry="5.5" fill="#ffb3d1" opacity=".38"/>
  </g>
  ${asleep ? `
  <text x="112" y="74" font-size="14" fill="rgba(164,148,255,.82)" style="animation:ejZzz 2.4s ease-out 0s infinite">z</text>
  <text x="122" y="59" font-size="10" fill="rgba(164,148,255,.62)" style="animation:ejZzz 2.4s ease-out .8s infinite">z</text>
  <text x="130" y="46" font-size="7.5" fill="rgba(164,148,255,.42)" style="animation:ejZzz 2.4s ease-out 1.6s infinite">z</text>` : ''}
</svg>`;
}

// ============================================================
// 🐣 SVG: YAVRU
// ============================================================
function _svgYavru(state) {
  const asleep   = state==='sleeping'||state==='hungry';
  const gray     = state==='hungry' ? 'filter:grayscale(.5) brightness(.72)' : '';
  const fireShow = state==='fire';
  const eyeL     = asleep
    ? `<path d="M56 79 Q65 87 74 79" stroke="#1a9080" stroke-width="3.8" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="65" cy="79" rx="11" ry="12" fill="white"/>
       <ellipse cx="65" cy="80" rx="8"  ry="9"  fill="url(#ejIrisY)"/>
       <circle  cx="65" cy="80" r="5.5" fill="#082820"/>
       <circle  cx="67.5" cy="77.5" r="2"   fill="white"/>
       <circle  cx="63"   cy="82"   r="1.1" fill="rgba(255,255,255,.38)"/>`;
  const eyeR     = asleep
    ? `<path d="M86 79 Q95 87 104 79" stroke="#1a9080" stroke-width="3.8" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="95" cy="79" rx="11" ry="12" fill="white"/>
       <ellipse cx="95" cy="80" rx="8"  ry="9"  fill="url(#ejIrisY)"/>
       <circle  cx="95" cy="80" r="5.5" fill="#082820"/>
       <circle  cx="97.5" cy="77.5" r="2"   fill="white"/>
       <circle  cx="93"   cy="82"   r="1.1" fill="rgba(255,255,255,.38)"/>`;
  const mouth    = asleep
    ? `<path d="M71 96 Q80 93 89 96" stroke="#20b39a" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
    : `<path d="M70 95 Q80 105 90 95" stroke="#20b39a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
       <path d="M72 97 Q80 104 88 97" fill="#ff8fb0" opacity=".38"/>`;

  return `<svg id="dragon-svg" width="160" height="200" viewBox="0 0 160 200" style="overflow:visible;animation:ejBreathe 3.5s ease-in-out infinite;${gray}">
  <defs>
    <radialGradient id="ejBodyY" cx="42%" cy="35%">
      <stop offset="0%"   stop-color="#5ee8de"/>
      <stop offset="60%"  stop-color="#4ecdc4"/>
      <stop offset="100%" stop-color="#38b8ae"/>
    </radialGradient>
    <radialGradient id="ejBellyY" cx="50%" cy="40%">
      <stop offset="0%"   stop-color="#8ff5ee"/>
      <stop offset="100%" stop-color="#4ecdc4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ejIrisY" cx="38%" cy="35%">
      <stop offset="0%"   stop-color="#80fff0"/>
      <stop offset="55%"  stop-color="#00d4aa"/>
      <stop offset="100%" stop-color="#009978"/>
    </radialGradient>
  </defs>
  <ellipse cx="80" cy="192" rx="34" ry="6.5" fill="#000" opacity=".17"/>
  <g id="tail" style="transform-origin:65px 158px;animation:ejTailWag 2.8s ease-in-out infinite">
    <path d="M65 158 Q38 170 24 188 Q36 174 46 180 Q53 165 62 172 Q65 160 70 164 Q68 158 65 158" fill="#38b8ae"/>
    <path d="M65 158 Q46 168 38 180 Q46 172 54 174" fill="#5de0d8" opacity=".35"/>
    <path d="M22 190 Q18 186 20 182 Q24 186 26 190Z" fill="#4ecdc4"/>
  </g>
  <ellipse cx="80" cy="152" rx="37" ry="27" fill="url(#ejBodyY)"/>
  <ellipse cx="80" cy="157" rx="22" ry="15" fill="url(#ejBellyY)"/>
  <ellipse cx="70" cy="140" rx="16" ry="8" fill="white" opacity=".12" transform="rotate(-15 70 140)"/>
  <g id="wing-l" style="transform-origin:52px 124px;animation:ejWingFlap 2.3s ease-in-out infinite">
    <path d="M52 124 Q15 95 17 64 Q32 81 45 106 Q49 117 55 126" fill="#38b8ae"/>
    <path d="M52 124 Q22 99 24 72 Q36 88 47 110" fill="#5de0d8" opacity=".3"/>
    <path d="M45 107 Q28 88 30 70" stroke="#4ecdc4" stroke-width=".9" fill="none" opacity=".4"/>
    <path d="M49 116 Q32 98 34 78" stroke="#4ecdc4" stroke-width=".8" fill="none" opacity=".35"/>
  </g>
  <g id="wing-r" style="transform-origin:108px 124px;animation:ejWingFlap 2.3s ease-in-out infinite .28s">
    <path d="M108 124 Q145 95 143 64 Q128 81 115 106 Q111 117 105 126" fill="#38b8ae"/>
    <path d="M108 124 Q138 99 136 72 Q124 88 113 110" fill="#5de0d8" opacity=".3"/>
    <path d="M115 107 Q132 88 130 70" stroke="#4ecdc4" stroke-width=".9" fill="none" opacity=".4"/>
    <path d="M111 116 Q128 98 126 78" stroke="#4ecdc4" stroke-width=".8" fill="none" opacity=".35"/>
  </g>
  <path d="M64 128 Q68 108 78 104 Q82 102 86 104 Q92 108 96 128" fill="#42c8bf"/>
  <g id="head" style="animation:${asleep?'ejSleepy 4s':'ejIdle 3.2s'} ease-in-out infinite">
    <ellipse cx="80" cy="82" rx="34" ry="32" fill="url(#ejBodyY)"/>
    <ellipse cx="68" cy="60" rx="18" ry="9" fill="white" opacity=".14" transform="rotate(-18 68 60)"/>
    <path d="M60 62 Q55 45 62 37 Q65 48 63 58" fill="#38b8ae"/>
    <path d="M70 57 Q67 39 75 32 Q78 44 76 55" fill="#5de0d8"/>
    <path d="M80 55 Q80 37 87 30 Q89 43 87 53" fill="#5de0d8"/>
    <path d="M90 57 Q93 39 85 32 Q82 44 84 55" fill="#5de0d8"/>
    <path d="M100 62 Q105 45 98 37 Q95 48 97 58" fill="#38b8ae"/>
    <ellipse cx="54" cy="57" rx="5.5" ry="10" fill="#4cc9f0" opacity=".88" transform="rotate(-18 54 57)"/>
    <ellipse cx="106" cy="57" rx="5.5" ry="10" fill="#4cc9f0" opacity=".88" transform="rotate(18 106 57)"/>
    <ellipse cx="80" cy="92" rx="11" ry="7.5" fill="#5de0d8"/>
    <circle cx="77" cy="91" r="2.2" fill="#2a9e90" opacity=".55"/>
    <circle cx="83" cy="91" r="2.2" fill="#2a9e90" opacity=".55"/>
    ${eyeL}${eyeR}${mouth}
    <ellipse cx="49" cy="88" rx="9.5" ry="6.5" fill="#ff9fc4" opacity=".33"/>
    <ellipse cx="111" cy="88" rx="9.5" ry="6.5" fill="#ff9fc4" opacity=".33"/>
    <g id="fire-group" style="display:${fireShow?'block':'none'}">
      <circle cx="106" cy="91" r="6.5" fill="#b2f5ea" opacity=".78" style="animation:ejSpark1 .65s ease-out infinite"/>
      <circle cx="115" cy="89" r="5"   fill="#81e6d9" opacity=".68" style="animation:ejSpark2 .65s ease-out infinite .12s"/>
      <circle cx="124" cy="87" r="3.5" fill="#4fd1c5" opacity=".58" style="animation:ejSpark3 .65s ease-out infinite .24s"/>
      <circle cx="131" cy="87" r="2.2" fill="#a0fff8" opacity=".5"  style="animation:ejSpark4 .65s ease-out infinite .36s"/>
    </g>
  </g>
  <ellipse cx="62" cy="172" rx="14" ry="9.5" fill="#38b8ae" transform="rotate(-18 62 172)"/>
  <ellipse cx="98" cy="172" rx="14" ry="9.5" fill="#38b8ae" transform="rotate(18 98 172)"/>
  <ellipse cx="58" cy="179" rx="8" ry="5.5" fill="#2e9e83"/>
  <ellipse cx="102" cy="179" rx="8" ry="5.5" fill="#2e9e83"/>
  <circle cx="51" cy="185" r="4.2" fill="#38b8ae"/><circle cx="58" cy="187" r="4.2" fill="#38b8ae"/><circle cx="65" cy="186" r="4.2" fill="#38b8ae"/>
  <circle cx="95" cy="185" r="4.2" fill="#38b8ae"/><circle cx="102" cy="187" r="4.2" fill="#38b8ae"/><circle cx="109" cy="186" r="4.2" fill="#38b8ae"/>
  ${asleep ? `
  <text x="112" y="70" font-size="15" fill="rgba(78,205,196,.85)" style="animation:ejZzz 2.4s ease-out 0s infinite">z</text>
  <text x="124" y="55" font-size="11" fill="rgba(78,205,196,.65)" style="animation:ejZzz 2.4s ease-out .8s infinite">z</text>
  <text x="132" y="42" font-size="8"  fill="rgba(78,205,196,.45)" style="animation:ejZzz 2.4s ease-out 1.6s infinite">z</text>` : ''}
</svg>`;
}

// ============================================================
// 🐉 SVG: EJDERHA
// ============================================================
function _svgEjderha(state) {
  const asleep   = state==='sleeping'||state==='hungry';
  const gray     = state==='hungry' ? 'filter:grayscale(.45) brightness(.68)' : '';
  const fireShow = state==='fire';

  const eyeL = asleep
    ? `<path d="M50 73 Q61 82 72 73" stroke="#3a30b0" stroke-width="4.2" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="61" cy="72" rx="13" ry="14" fill="white"/>
       <ellipse cx="61" cy="73" rx="9.5" ry="10.5" fill="url(#ejIrisE)"/>
       <circle  cx="61" cy="73" r="6.5" fill="#050020"/>
       <circle  cx="64"  cy="70"   r="2.6" fill="white"/>
       <circle  cx="58.5" cy="75.5" r="1.4" fill="rgba(255,255,255,.38)"/>
       <circle  cx="64.5" cy="74.5" r=".8"  fill="rgba(255,255,255,.25)"/>`;
  const eyeR = asleep
    ? `<path d="M88 73 Q99 82 110 73" stroke="#3a30b0" stroke-width="4.2" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="99" cy="72" rx="13" ry="14" fill="white"/>
       <ellipse cx="99" cy="73" rx="9.5" ry="10.5" fill="url(#ejIrisE)"/>
       <circle  cx="99" cy="73" r="6.5" fill="#050020"/>
       <circle  cx="102"  cy="70"   r="2.6" fill="white"/>
       <circle  cx="96.5" cy="75.5" r="1.4" fill="rgba(255,255,255,.38)"/>
       <circle  cx="102.5" cy="74.5" r=".8" fill="rgba(255,255,255,.25)"/>`;
  const mouth = asleep
    ? `<path d="M67 94 Q80 89 93 94" stroke="#4a40c8" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
    : fireShow
    ? `<path d="M65 93 Q80 107 95 93" stroke="#4a40c8" stroke-width="2.8" fill="none" stroke-linecap="round"/>
       <path d="M67 95 Q80 106 93 95" fill="#ff5090" opacity=".45"/>
       <path d="M70 97 Q80 104 90 97" fill="#ff80b0" opacity=".25"/>`
    : `<path d="M67 92 Q80 103 93 92" stroke="#4a40c8" stroke-width="2.5" fill="none" stroke-linecap="round"/>
       <path d="M69 94 Q80 102 91 94" fill="#ff6090" opacity=".38"/>`;

  const fire = fireShow ? `
    <g id="fire-group">
      <circle cx="97" cy="91" r="14" fill="#ff6600" opacity="0" style="animation:ejHeatWave 1s ease-in-out infinite"/>
      <ellipse cx="96" cy="91" rx="8" ry="6" fill="#ff8800" opacity=".55" style="animation:ejHeatWave .8s ease-in-out infinite"/>
      <path d="M94 91 Q105 72 118 68 Q124 78 116 82 Q128 76 134 84 Q128 92 118 88 Q122 96 114 98 Q106 94 94 91Z"
            fill="#cc2200" opacity=".9" style="animation:ejFlame1 .55s ease-in-out infinite"/>
      <path d="M94 91 Q103 76 114 73 Q119 81 112 84 Q122 79 126 87 Q120 94 112 90 Q115 97 108 99 Q102 95 94 91Z"
            fill="#ff4400" opacity=".88" style="animation:ejFlame2 .5s ease-in-out infinite .06s"/>
      <path d="M94 91 Q101 79 110 77 Q114 84 108 86 Q116 82 119 89 Q114 95 108 92 Q110 98 105 99 Q100 96 94 91Z"
            fill="#ff7700" opacity=".85" style="animation:ejFlame3 .45s ease-in-out infinite .1s"/>
      <ellipse cx="104" cy="87" rx="7"   ry="4.5" fill="#ffaa00" opacity=".92" style="animation:ejHeatWave .5s ease-in-out infinite"/>
      <ellipse cx="110" cy="86" rx="4.5" ry="3"   fill="#ffdd00" opacity=".95" style="animation:ejHeatWave .5s ease-in-out infinite .08s"/>
      <ellipse cx="116" cy="85" rx="3"   ry="2"   fill="#fff0a0"               style="animation:ejHeatWave .5s ease-in-out infinite .16s"/>
      <ellipse cx="121" cy="85" rx="2"   ry="1.4" fill="white" opacity=".9"   style="animation:ejHeatWave .5s ease-in-out infinite .24s"/>
      <circle cx="112" cy="82" r="2.8" fill="#ffcc00" style="animation:ejSpark1 .9s ease-out infinite"/>
      <circle cx="119" cy="79" r="2.2" fill="#ffaa00" style="animation:ejSpark2 .9s ease-out infinite .15s"/>
      <circle cx="106" cy="78" r="1.8" fill="#ff8800" style="animation:ejSpark3 .9s ease-out infinite .3s"/>
      <circle cx="124" cy="82" r="1.5" fill="#ff6600" style="animation:ejSpark4 .9s ease-out infinite .45s"/>
      <circle cx="116" cy="75" r="1.3" fill="#ffee00" style="animation:ejSpark5 .9s ease-out infinite .6s"/>
      <circle cx="129" cy="79" r="1.2" fill="#ffcc00" style="animation:ejSpark1 .9s ease-out infinite .2s"/>
      <circle cx="120" cy="68" r="5"   fill="#888" opacity=".12" style="animation:ejSpark2 1.4s ease-out infinite"/>
      <circle cx="128" cy="62" r="4"   fill="#999" opacity=".09" style="animation:ejSpark3 1.4s ease-out infinite .2s"/>
      <circle cx="134" cy="56" r="3"   fill="#aaa" opacity=".07" style="animation:ejSpark4 1.4s ease-out infinite .4s"/>
    </g>` : `<g id="fire-group" style="display:none"></g>`;

  return `<svg id="dragon-svg" width="175" height="215" viewBox="0 0 175 215" style="overflow:visible;animation:ejBreathe 3.5s ease-in-out infinite;${gray}">
  <defs>
    <radialGradient id="ejBodyE" cx="40%" cy="32%">
      <stop offset="0%"   stop-color="#8a83ff"/>
      <stop offset="55%"  stop-color="#6c63ff"/>
      <stop offset="100%" stop-color="#5040c8"/>
    </radialGradient>
    <radialGradient id="ejBellyE" cx="50%" cy="42%">
      <stop offset="0%"   stop-color="#a09aff" stop-opacity=".45"/>
      <stop offset="100%" stop-color="#6c63ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ejWingGrad" cx="35%" cy="30%">
      <stop offset="0%"   stop-color="#6858e0"/>
      <stop offset="100%" stop-color="#4030b0"/>
    </radialGradient>
    <radialGradient id="ejIrisE" cx="38%" cy="32%">
      <stop offset="0%"   stop-color="#80e8ff"/>
      <stop offset="45%"  stop-color="#4cc9f0"/>
      <stop offset="100%" stop-color="#1a80c0"/>
    </radialGradient>
  </defs>
  <ellipse cx="87" cy="206" rx="44" ry="8" fill="#000" opacity=".2"/>
  <g id="tail" style="transform-origin:67px 163px;animation:ejTailWag 2.7s ease-in-out infinite">
    <path d="M67 163 Q35 175 21 195 Q35 179 47 185 Q55 169 65 177 Q68 165 74 169 Q71 163 67 163" fill="#5040c8"/>
    <path d="M67 163 Q47 171 39 183 Q47 175 56 177" fill="#7060e8" opacity=".32"/>
    <path d="M20 197 Q16 192 19 188 Q23 193 25 197Z" fill="#6050d0"/>
  </g>
  <ellipse cx="87" cy="160" rx="46" ry="31" fill="url(#ejBodyE)"/>
  <ellipse cx="87" cy="166" rx="28" ry="18" fill="url(#ejBellyE)"/>
  <ellipse cx="76" cy="156" rx="7" ry="4.5" fill="#7c74ff" opacity=".28" transform="rotate(-14 76 156)"/>
  <ellipse cx="98" cy="156" rx="7" ry="4.5" fill="#7c74ff" opacity=".28" transform="rotate(14 98 156)"/>
  <ellipse cx="87" cy="150" rx="6" ry="4" fill="#7c74ff" opacity=".25"/>
  <ellipse cx="74" cy="143" rx="18" ry="9" fill="white" opacity=".1" transform="rotate(-18 74 143)"/>
  <g id="wing-l" style="transform-origin:55px 123px;animation:ejWingFlap 2.5s ease-in-out infinite">
    <path d="M55 123 Q8 87 7 50 Q25 70 42 97 Q48 111 57 125" fill="url(#ejWingGrad)"/>
    <path d="M55 123 Q15 92 16 58 Q30 76 44 102" fill="#8070f0" opacity=".28"/>
    <path d="M55 123 Q22 97 24 70" stroke="#6050d8" stroke-width="1.1" fill="none" opacity=".4"/>
    <path d="M49 113 Q20 89 22 64" stroke="#6050d8" stroke-width=".9"  fill="none" opacity=".32"/>
    <path d="M43 103 Q18 82 20 58" stroke="#6050d8" stroke-width=".8"  fill="none" opacity=".25"/>
  </g>
  <g id="wing-r" style="transform-origin:119px 123px;animation:ejWingFlap 2.5s ease-in-out infinite .28s">
    <path d="M119 123 Q166 87 167 50 Q149 70 132 97 Q126 111 117 125" fill="url(#ejWingGrad)"/>
    <path d="M119 123 Q159 92 158 58 Q144 76 130 102" fill="#8070f0" opacity=".28"/>
    <path d="M119 123 Q152 97 150 70" stroke="#6050d8" stroke-width="1.1" fill="none" opacity=".4"/>
    <path d="M125 113 Q154 89 152 64" stroke="#6050d8" stroke-width=".9"  fill="none" opacity=".32"/>
    <path d="M131 103 Q156 82 154 58" stroke="#6050d8" stroke-width=".8"  fill="none" opacity=".25"/>
  </g>
  <path d="M69 130 Q73 107 81 103 Q87 101 93 103 Q101 107 105 130" fill="#6a60f8"/>
  <g id="head" style="animation:${asleep?'ejSleepy 4s':'ejIdle 3s'} ease-in-out infinite">
    <ellipse cx="80" cy="79" rx="42" ry="38" fill="url(#ejBodyE)"/>
    <ellipse cx="66" cy="56" rx="20" ry="9" fill="white" opacity=".15" transform="rotate(-22 66 56)"/>
    <path d="M58 56 Q51 35 60 27 Q64 39 62 52" fill="#4838c0"/>
    <path d="M70 50 Q67 29 76 21 Q80 33 78 47" fill="#6858e0"/>
    <path d="M90 50 Q93 29 84 21 Q80 33 82 47" fill="#6858e0"/>
    <path d="M102 56 Q109 35 100 27 Q96 39 98 52" fill="#4838c0"/>
    <path d="M59 42 Q55 33 61 29" stroke="#9888ff" stroke-width="1.8" fill="none" opacity=".5" stroke-linecap="round"/>
    <path d="M71 36 Q68 27 76 23" stroke="#9888ff" stroke-width="1.8" fill="none" opacity=".5" stroke-linecap="round"/>
    <path d="M89 36 Q92 27 84 23" stroke="#9888ff" stroke-width="1.8" fill="none" opacity=".5" stroke-linecap="round"/>
    <ellipse cx="48" cy="51" rx="6.5" ry="12" fill="#4cc9f0" opacity=".88" transform="rotate(-22 48 51)"/>
    <ellipse cx="112" cy="51" rx="6.5" ry="12" fill="#4cc9f0" opacity=".88" transform="rotate(22 112 51)"/>
    <ellipse cx="80" cy="90" rx="14" ry="10" fill="#7870ff"/>
    <circle cx="76" cy="89" r="2.8" fill="#4838c0" opacity=".5"/>
    <circle cx="84" cy="89" r="2.8" fill="#4838c0" opacity=".5"/>
    <ellipse cx="46" cy="82" rx="11" ry="7.5" fill="#ff7eb3" opacity=".28"/>
    <ellipse cx="114" cy="82" rx="11" ry="7.5" fill="#ff7eb3" opacity=".28"/>
    ${eyeL}${eyeR}${mouth}
    ${fire}
  </g>
  <ellipse cx="63" cy="179" rx="16" ry="11" fill="#5040c8" transform="rotate(-18 63 179)"/>
  <ellipse cx="111" cy="179" rx="16" ry="11" fill="#5040c8" transform="rotate(18 111 179)"/>
  <ellipse cx="59" cy="187" rx="10" ry="6.5" fill="#3c2ea8"/>
  <ellipse cx="115" cy="187" rx="10" ry="6.5" fill="#3c2ea8"/>
  <circle cx="51" cy="195" r="5" fill="#5040c8"/><circle cx="58" cy="197" r="5" fill="#5040c8"/><circle cx="66" cy="196" r="5" fill="#5040c8"/>
  <circle cx="108" cy="195" r="5" fill="#5040c8"/><circle cx="115" cy="197" r="5" fill="#5040c8"/><circle cx="123" cy="196" r="5" fill="#5040c8"/>
  ${asleep ? `
  <text x="120" y="65" font-size="17" fill="rgba(108,99,255,.88)" style="animation:ejZzz 2.4s ease-out 0s infinite">z</text>
  <text x="132" y="49" font-size="13" fill="rgba(108,99,255,.68)" style="animation:ejZzz 2.4s ease-out .8s infinite">z</text>
  <text x="142" y="35" font-size="9.5" fill="rgba(108,99,255,.48)" style="animation:ejZzz 2.4s ease-out 1.6s infinite">z</text>` : ''}
</svg>`;
}

// ============================================================
// 🐉 EJDERHA SAHNESI
// ============================================================
function maceraEjderha() {
  const { toplamDogru, gercekStage, ac, uyuyor, bugunDogru, seri, mutluluk, aclik, enerji } = ejderhaVerisi();

  const stageInfo = [
    { lbl:'🥚 Yumurta',         sub:'İçinden bir şey çıkmak istiyor...',      sonraki:100,  clr:'#c4b8f0', bg:'linear-gradient(170deg,#1e1450 0%,#0d0828 100%)' },
    { lbl:'🐣 Yavru Ejderha',   sub:'Küçük duman çıkartıyor, büyüyor',        sonraki:300,  clr:'#4ecdc4', bg:'linear-gradient(170deg,#0a3d35 0%,#051f1a 100%)' },
    { lbl:'🐉 Genç Ejderha',    sub:'Ateş geliyor — neredeyse tam güçte!',    sonraki:600,  clr:'#EF9F27', bg:'linear-gradient(170deg,#1a1060 0%,#090520 100%)' },
    { lbl:'🐉 Güçlü Ejderha',   sub:'Tam güçte — ateş her yerde!',            sonraki:1000, clr:'#7c74ff', bg:'linear-gradient(170deg,#1a1060 0%,#090520 100%)' },
    { lbl:'👑 Efsanevi Ejderha', sub:'1000+ doğru — kimse durduramaz!',        sonraki:null, clr:'#f9ca24', bg:'linear-gradient(170deg,#1a1060 0%,#090520 100%)' },
  ];
  const s        = stageInfo[gercekStage];
  const nextPct  = s.sonraki ? Math.min(100, Math.round(toplamDogru/s.sonraki*100)) : 100;
  const nextText = s.sonraki ? `${toplamDogru} / ${s.sonraki} doğru` : `${toplamDogru} doğru — ZİRVE!`;

  let durumEmoji = '', durumMsg = '';
  if      (ac)              { durumEmoji='😰'; durumMsg='5 gündür beslenmedi'; }
  else if (uyuyor)          { durumEmoji='😴'; durumMsg='Uyuyor (2 gün)'; }
  else if (bugunDogru>=30)  { durumEmoji='🔥'; durumMsg='Bugün çok güçlü!'; }
  else if (bugunDogru>0)    { durumEmoji='😊'; durumMsg='Bugün beslenmiş'; }
  else                      { durumEmoji='🥺'; durumMsg='Bugün henüz yok'; }

  const svgChar = gercekStage===0 ? _svgYumurta(ac?'hungry':uyuyor?'sleeping':gercekStage>=3?'fire':'happy')
                : gercekStage===1 ? _svgYavru  (ac?'hungry':uyuyor?'sleeping':gercekStage>=3?'fire':'happy')
                :                   _svgEjderha(ac?'hungry':uyuyor?'sleeping':gercekStage>=3?'fire':'happy');

  setTimeout(() => {
    const initState = ac ? 'hungry' : uyuyor ? 'sleeping' : gercekStage >= 3 ? 'fire' : 'happy';
    if (typeof window._ejderhaSetState === 'function') window._ejderhaSetState(initState);
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

      <div id="ejderha-scene" onclick="window._ejderhaTap(event)"
        style="position:relative;height:250px;background:${s.bg};border-radius:14px;overflow:hidden;cursor:pointer;margin-bottom:12px">
        <div style="position:absolute;top:10px;left:18px;width:3px;height:3px;background:white;border-radius:50%;opacity:.55"></div>
        <div style="position:absolute;top:26px;left:55px;width:2px;height:2px;background:white;border-radius:50%;opacity:.38"></div>
        <div style="position:absolute;top:16px;right:38px;width:3px;height:3px;background:white;border-radius:50%;opacity:.65"></div>
        <div style="position:absolute;top:38px;right:75px;width:2px;height:2px;background:white;border-radius:50%;opacity:.45"></div>
        <div style="position:absolute;top:8px;right:110px;width:1.5px;height:1.5px;background:white;border-radius:50%;opacity:.3"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:50px;background:${s.clr}20;border-top:1px solid ${s.clr}44;border-radius:0 0 14px 14px"></div>
        <div id="ej-fx" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5"></div>
        <div id="ej-wrap" style="position:absolute;bottom:42px;left:50%;transform:translateX(-50%);z-index:2">
          ${svgChar}
        </div>
        <div id="ej-bubble" style="display:none;position:absolute;bottom:206px;left:50%;transform:translateX(-50%);background:white;color:#333;border-radius:12px;padding:6px 14px;font-size:11px;font-weight:700;white-space:nowrap;z-index:10;box-shadow:0 4px 12px rgba(0,0,0,.3)">
          <span id="ej-bubble-text"></span>
          <div style="position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);border-left:7px solid transparent;border-right:7px solid transparent;border-top:7px solid white"></div>
        </div>
        <div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.55);color:white;border-radius:99px;padding:4px 10px;font-size:.68rem;font-weight:700;z-index:3">${durumEmoji} ${durumMsg}</div>
        <div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:9px;color:rgba(255,255,255,.22);z-index:3">ejderhana dokun ✨</div>
      </div>

      <!-- Tamagotchi stat barları -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="background:var(--surface2);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:0.65rem;color:var(--text2);margin-bottom:4px">🍖 Tokluk</div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px">
            <div style="height:100%;width:${aclik}%;background:${aclik>60?'#43e97b':aclik>30?'#f9ca24':'#ff6b6b'};border-radius:3px;transition:.6s"></div>
          </div>
          <div style="font-size:0.7rem;font-weight:800;color:${aclik>60?'#43e97b':aclik>30?'#f9ca24':'#ff6b6b'}">${aclik}%</div>
        </div>
        <div style="background:var(--surface2);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:0.65rem;color:var(--text2);margin-bottom:4px">😊 Mutluluk</div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px">
            <div style="height:100%;width:${mutluluk}%;background:${mutluluk>60?'#43e97b':mutluluk>30?'#f9ca24':'#ff6b6b'};border-radius:3px;transition:.6s"></div>
          </div>
          <div style="font-size:0.7rem;font-weight:800;color:${mutluluk>60?'#43e97b':mutluluk>30?'#f9ca24':'#ff6b6b'}">${mutluluk}%</div>
        </div>
        <div style="background:var(--surface2);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:0.65rem;color:var(--text2);margin-bottom:4px">⚡ Enerji</div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:4px">
            <div style="height:100%;width:${enerji}%;background:${enerji>60?'#4cc9f0':enerji>30?'#f9ca24':'#ff6b6b'};border-radius:3px;transition:.6s"></div>
          </div>
          <div style="font-size:0.7rem;font-weight:800;color:${enerji>60?'#4cc9f0':enerji>30?'#f9ca24':'#ff6b6b'}">${enerji}%</div>
        </div>
      </div>

      <!-- İlerleme -->
      <div style="font-size:0.75rem;color:var(--text2);margin-bottom:5px;display:flex;justify-content:space-between">
        <span>${s.sub}</span><span>${nextText}</span>
      </div>
      <div style="background:var(--surface2);border-radius:4px;height:8px;overflow:hidden;margin-bottom:12px">
        <div style="width:${nextPct}%;height:100%;background:${s.clr};border-radius:4px;transition:width .8s ease"></div>
      </div>

      <!-- İstatistik -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center">
          <div style="font-size:0.7rem;color:var(--text2);margin-bottom:3px">Toplam doğru</div>
          <div style="font-size:1.1rem;font-weight:800">${toplamDogru}</div>
        </div>
        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center">
          <div style="font-size:0.7rem;color:var(--text2);margin-bottom:3px">Bugün</div>
          <div style="font-size:1.1rem;font-weight:800;color:${bugunDogru>0?s.clr:'var(--text)'}">+${bugunDogru}</div>
        </div>
        <div style="background:${ac?'rgba(226,75,74,0.1)':uyuyor?'rgba(108,99,255,0.1)':'var(--surface2)'};border-radius:9px;padding:10px;text-align:center;${ac?'border:1px solid rgba(226,75,74,0.25)':uyuyor?'border:1px solid rgba(108,99,255,0.25)':''}">
          <div style="font-size:0.7rem;color:${ac?'#E24B4A':uyuyor?'var(--accent)':'var(--text2)'};margin-bottom:3px">Durum</div>
          <div style="font-size:0.85rem;font-weight:800;color:${ac?'#E24B4A':uyuyor?'var(--accent)':s.clr}">${ac?'😰 Aç':uyuyor?'😴 Uyuyor':'✅ Tok'}</div>
        </div>
      </div>

      ${ac    ? `<div style="margin-top:10px;background:rgba(226,75,74,0.08);border:1px solid rgba(226,75,74,0.2);border-radius:9px;padding:10px 12px;font-size:.8rem;color:#E24B4A;line-height:1.5">⚠️ Ejderhan 5 gündür beslenmedi ve geriledi! Bugün en az 10 doğru çöz.</div>` : ''}
      ${uyuyor&&!ac ? `<div style="margin-top:10px;background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.2);border-radius:9px;padding:10px 12px;font-size:.8rem;color:var(--accent);line-height:1.5">😴 Ejderhan 2 gündür uyuyor. Uyandırmak için soru çöz!</div>` : ''}
    </div>

    <style>
      @keyframes ejIdle     {0%,100%{transform:translateY(0) rotate(-.8deg)}50%{transform:translateY(-10px) rotate(.8deg)}}
      @keyframes ejHappy    {0%{transform:translateY(0)}20%{transform:translateY(-24px) rotate(-11deg)}40%{transform:translateY(-15px) rotate(11deg)}60%{transform:translateY(-22px) rotate(-7deg)}80%{transform:translateY(-9px) rotate(5deg)}100%{transform:translateY(0)}}
      @keyframes ejSleepy   {0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-4px) rotate(1.5deg)}}
      @keyframes ejTailWag  {0%,100%{transform:rotate(0deg)}50%{transform:rotate(16deg)}}
      @keyframes ejWingFlap {0%,100%{transform:rotate(0deg) scaleY(1)}50%{transform:rotate(-14deg) scaleY(1.06)}}
      @keyframes ejZzz      {0%{opacity:0;transform:translate(0,0) scale(.4)}50%{opacity:1}100%{opacity:0;transform:translate(-18px,-26px) scale(1.4)}}
      @keyframes ejEggRock  {0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
      @keyframes ejCrack    {0%,100%{opacity:.3}50%{opacity:.95}}
      @keyframes ejEggGlow  {0%,100%{opacity:.15}50%{opacity:.45}}
      @keyframes ejBreathe  {0%,100%{transform:scale(1)}50%{transform:scale(1.018)}}
      @keyframes ejPop      {0%{opacity:0;transform:translate(-50%,-50%) scale(0)}30%{opacity:1;transform:translate(-50%,-120%) scale(1.3)}70%{opacity:1;transform:translate(-50%,-190%) scale(1)}100%{opacity:0;transform:translate(-50%,-270%) scale(.8)}}
      @keyframes ejFlame1   {0%,100%{d:path("M94 91 Q105 72 118 68 Q124 78 116 82 Q128 76 134 84 Q128 92 118 88 Q122 96 114 98 Q106 94 94 91Z");opacity:.9}50%{d:path("M94 91 Q107 68 122 64 Q130 76 120 80 Q134 72 138 82 Q132 94 120 88 Q126 98 116 100 Q106 96 94 91Z");opacity:1}}
      @keyframes ejFlame2   {0%,100%{d:path("M94 91 Q103 76 114 73 Q119 81 112 84 Q122 79 126 87 Q120 94 112 90 Q115 97 108 99 Q102 95 94 91Z");opacity:.85}50%{d:path("M94 91 Q105 72 118 69 Q124 79 116 82 Q128 74 132 84 Q126 93 116 88 Q120 97 112 99 Q104 95 94 91Z");opacity:.95}}
      @keyframes ejFlame3   {0%,100%{d:path("M94 91 Q101 79 110 77 Q114 84 108 86 Q116 82 119 89 Q114 95 108 92 Q110 98 105 99 Q100 96 94 91Z");opacity:.8}50%{d:path("M94 91 Q103 75 113 73 Q118 82 110 84 Q120 78 123 87 Q118 95 110 91 Q113 98 107 99 Q101 96 94 91Z");opacity:.9}}
      @keyframes ejHeatWave {0%,100%{opacity:.18}50%{opacity:.38}}
      @keyframes ejSpark1   {0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(18px,-28px) scale(0);opacity:0}}
      @keyframes ejSpark2   {0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(8px,-38px) scale(0);opacity:0}}
      @keyframes ejSpark3   {0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(26px,-22px) scale(0);opacity:0}}
      @keyframes ejSpark4   {0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(14px,-32px) scale(0);opacity:0}}
      @keyframes ejSpark5   {0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(-4px,-34px) scale(0);opacity:0}}
    </style>
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


// ============================================================
// 🐉 EJDERhA İNTERAKTİF
// ============================================================
(function(){
  let curState='happy', tapCount=0, busy=false;
  const msgs={
    happy:   ['Soru çözmeye hazırım! 💪','Bugün harika hissediyorum!','Birlikte başarırız! ⭐','Daha fazla soru!'],
    sleeping:['Zzzz... 😴','Uyandırma beni...','2 gündür kimse yoktu...','Biraz daha... zzz...'],
    hungry:  ['Açım... biraz soru çöz 🥺','5 gündür bekledim seni...','Lütfen beni besle 😢','Güçsüzleşiyorum...'],
    fire:    ['RAWR! 🔥 Tam güçteyim!','Bugün rekor kırıyoruz!','Ateşim sönmez! 💥','Kimse durduramaz! 👑'],
  };

  function showBubble(text, dur=2200){
    const b=document.getElementById('ej-bubble');
    const t=document.getElementById('ej-bubble-text');
    if(!b||!t) return;
    t.textContent=text; b.style.display='block';
    setTimeout(()=>b.style.display='none', dur);
  }

  function spawnFx(x,y,emoji){
    const fx=document.getElementById('ej-fx');
    if(!fx) return;
    const el=document.createElement('div');
    el.style.cssText=`position:absolute;left:${x}px;top:${y}px;font-size:22px;pointer-events:none;animation:ejPop 1.1s ease-out forwards`;
    el.textContent=emoji;
    fx.appendChild(el);
    setTimeout(()=>el.remove(), 1150);
  }

  window._ejderhaTap = function(e){
    if(busy) return;
    const scene=document.getElementById('ejderha-scene');
    if(!scene) return;
    const rect=scene.getBoundingClientRect();
    const x=e.clientX-rect.left, y=e.clientY-rect.top;
    busy=true; tapCount++;
    const dragon=document.getElementById('dragon-svg');
    const m=msgs[curState]||msgs.happy;
    showBubble(m[tapCount%m.length]);
    const fx={happy:'💜',sleeping:'⭐',hungry:'🍖',fire:'✨'};
    spawnFx(x, y-12, fx[curState]||'💜');
    if(curState!=='hungry'){
      if(dragon){ dragon.style.animation='ejHappy .9s ease-out'; setTimeout(()=>{dragon.style.animation='';busy=false;},920); }
      else busy=false;
      if(curState==='fire') for(let i=1;i<5;i++) setTimeout(()=>spawnFx(50+Math.random()*95,12+Math.random()*75,'✨'),i*130);
    } else {
      setTimeout(()=>busy=false, 600);
    }
  };

  window._ejderhaSetState = function(s){
    curState=s;
    // SVG artık state'e göre zaten doğru render ediliyor,
    // _ejderhaSetState sadece curState'i günceller
    // (Dinamik durum değişikliği gerekirse buraya eklenebilir)
  };

  // Periyodik mesajlar
  setInterval(()=>{
    if(!busy && Math.random()>.62){
      const m=msgs[curState]||msgs.happy;
      showBubble(m[Math.floor(Math.random()*m.length)], 2000);
    }
  }, 8000);
})();
