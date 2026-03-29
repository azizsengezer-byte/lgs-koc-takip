// ============================================================
// 🗺️ MACERA SAYFASI
// ============================================================

function maceraPage() {
  return `
    <div class="page-title">🗺️ Macera</div>
    <div class="page-sub">Gelişimini oyun gibi takip et</div>

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
  const ekranOnline = parseFloat(today.ekranOnline || 0);
  const ekranSosyal = parseFloat(today.ekranSosyal || 0);
  const toplamEkran = ekranOnline + ekranSosyal;

  // Formül: uyku(0-40) + enerji(0-40) - ekran kaybı → /80 → %100
  const uykuPuan   = Math.min(40, Math.round((uyku / 8) * 40));
  const enerjiPuan = Math.min(40, Math.round((enerji / 10) * 40));
  const ekranKayip = Math.min(40, Math.round(ekranSosyal * 6 + ekranOnline * 3));
  const ham        = uykuPuan + enerjiPuan - ekranKayip;
  const tank       = Math.max(0, Math.min(100, Math.round(ham / 80 * 100)));

  // Renk ve mesaj
  const { renk, renk2, mesaj, durum } = tank >= 70
    ? { renk: '#1D9E75', renk2: '#5DCAA5', mesaj: 'Odaklanmaya hazır', durum: 'iyi' }
    : tank >= 40
    ? { renk: '#BA7517', renk2: '#EF9F27', mesaj: 'Orta kapasite', durum: 'orta' }
    : { renk: '#E24B4A', renk2: '#F09595', mesaj: 'Düşük kapasite — dinlenmeni öneririm', durum: 'dusuk' };

  const veriYok = uyku === 0 && enerji === 5 && toplamEkran === 0;

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
        <div style="background:${toplamEkran>5?'rgba(226,75,74,0.12)':'var(--surface2)'};border-radius:9px;padding:10px;text-align:center">
          <div style="font-size:0.7rem;color:var(--text2);margin-bottom:3px">Ekran</div>
          <div style="font-size:1.1rem;font-weight:800;color:${toplamEkran>5?'#E24B4A':'var(--text)'}">${toplamEkran>0?toplamEkran+' sa':'--'}</div>
          <div style="font-size:0.6rem;color:var(--text2);margin-top:1px">${ekranSosyal>0?ekranSosyal+'sa sosyal':''}</div>
          <div style="font-size:0.65rem;color:${toplamEkran>5?'#E24B4A':'var(--text2)'};margin-top:2px">${veriYok||toplamEkran===0?'':'-'+(ekranKayip)+' sızıntı'}</div>
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
