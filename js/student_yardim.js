// ── YARDIM & DESTEK SAYFASI ───────────────────────────────────
function yardimPage() {
  const isTeacher = currentRole === 'teacher';

  const sssOgrenci = [
    { s: 'Şifremi unuttum, ne yapmalıyım?',
      c: 'Giriş ekranındaki <strong>"Şifremi unuttum"</strong> bağlantısına tıkla. E-postana sıfırlama maili gönderilecek. Henüz e-posta eklemediysen önce <strong>Profil → E-posta Adresi</strong> bölümünden ekle.' },
    { s: 'Kullanıcı adımı nasıl değiştirebilirim?',
      c: 'Kullanıcı adın koçun tarafından oluşturulmuştur ve değiştirilemez. Adını değiştirmek için <strong>Profil → Bilgilerimi Düzenle</strong> bölümünü kullan.' },
    { s: 'Günlük çalışmamı nereye gireceğim?',
      c: 'Alt menüdeki <strong>"Günlük Giriş"</strong> sekmesinden çalıştığın ders, konu ve doğru/yanlış sayılarını girebilirsin.' },
    { s: 'Rozet nasıl kazanırım?',
      c: 'Düzenli çalışma girişi yap, günlük hedeflerini tamamla ve wellness takibini düzenli doldur. Rozetler koşullar sağlandığında otomatik kazanılır.' },
    { s: 'Koçuma nasıl mesaj gönderebilirim?',
      c: 'Alt menüdeki <strong>"Mesajlar"</strong> sekmesinden koçunla doğrudan mesajlaşabilirsin.' },
    { s: 'Deneme sınavı sonuçlarımı nereye gireceğim?',
      c: '<strong>"Günlük Giriş"</strong> sayfasında tür olarak <strong>"Deneme Sınavı"</strong> seçerek her ders için doğru/yanlış/boş sayılarını girebilirsin.' },
    { s: 'Uygulama verilerimi başka cihazda görebilir miyim?',
      c: 'Evet! Tüm veriler bulutta güvenli şekilde saklanır. Aynı hesapla farklı telefon veya bilgisayardan giriş yaparak erişebilirsin.' },
    { s: 'Bildirimler çalışmıyor, ne yapmalıyım?',
      c: 'Telefon ayarlarından uygulama bildirimine izin verildiğini kontrol et. Tarayıcı kullanıyorsan site izinlerinde bildirimlere izin ver.' },
  ];

  const sssKoc = [
    { s: 'Öğrenci nasıl eklerim?',
      c: '<strong>Öğrencilerim</strong> sekmesinde sağ üstteki <strong>"+ Öğrenci Ekle"</strong> butonuna tıkla. Kullanıcı adı ve şifre belirleyerek öğrenci hesabı oluşturabilirsin.' },
    { s: 'Öğrencinin şifresini nasıl değiştiririm?',
      c: 'Öğrenci detay sayfasında <strong>"Şifre Değiştir"</strong> seçeneğini kullan. Öğrenci henüz giriş yapmamışsa yeni şifre belirleyebilirsin.' },
    { s: 'Hangi okullar listede görünür?',
      c: '<strong>Profil → Çalıştığım Okullar</strong> bölümünden okullarını yönetebilirsin. Öğrenci eklerken bu listeden seçim yapılır.' },
    { s: 'Psikolojik rapor nasıl oluşturulur?',
      c: 'Öğrenci detay sayfasında <strong>"Psikolojik Rapor"</strong> butonuna tıkla. Öğrencinin wellness verileri analiz edilerek PDF rapor oluşturulur.' },
    { s: 'Öğrenciye ödev nasıl atarım?',
      c: '<strong>Ödevler</strong> sekmesinden yeni ödev oluşturabilir, istediğin öğrenciye atayabilirsin. Öğrenciye otomatik bildirim gider.' },
    { s: 'Öğrenciye mesaj gönderebilir miyim?',
      c: '<strong>Mesajlar</strong> sekmesinden tüm öğrencilerinle birebir mesajlaşabilirsin.' },
    { s: 'Uygulama verilerimi başka cihazda görebilir miyim?',
      c: 'Evet! Tüm veriler Firebase\'de güvenli şekilde saklanır. Aynı hesapla farklı cihazdan giriş yaparak erişebilirsin.' },
    { s: 'Şifremi unuttum, ne yapmalıyım?',
      c: 'Giriş ekranındaki <strong>"Şifremi unuttum"</strong> bağlantısına tıkla. Kayıtlı e-posta adresine sıfırlama maili gönderilecek.' },
  ];

  const sss = isTeacher ? sssKoc : sssOgrenci;

  return `
    <div class="page-title">❓ Yardım &amp; Destek</div>
    <div class="page-sub">Sık sorulan sorular ve iletişim</div>

    <!-- Hızlı eylemler -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;margin-bottom:4px">
      <button onclick="showPage('profile')"
        style="padding:14px 10px;background:var(--surface);border:1px solid var(--border);border-radius:14px;cursor:pointer;font-family:inherit;text-align:center">
        <div style="font-size:1.4rem;margin-bottom:4px">👤</div>
        <div style="font-size:0.78rem;font-weight:700;color:var(--text)">Profilim</div>
        <div style="font-size:0.68rem;color:var(--text2)">${isTeacher ? 'Bilgiler & okullar' : 'E-posta & şifre'}</div>
      </button>
      <button onclick="showPage('messages')"
        style="padding:14px 10px;background:var(--surface);border:1px solid var(--border);border-radius:14px;cursor:pointer;font-family:inherit;text-align:center">
        <div style="font-size:1.4rem;margin-bottom:4px">💬</div>
        <div style="font-size:0.78rem;font-weight:700;color:var(--text)">Mesajlar</div>
        <div style="font-size:0.68rem;color:var(--text2)">${isTeacher ? 'Öğrencilerine yaz' : 'Koçuna yaz'}</div>
      </button>
    </div>

    <!-- SSS -->
    <div class="card" style="margin-top:12px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Sık Sorulan Sorular</div>
      ${sss.map((item, i) => `
        <div style="border-bottom:1px solid var(--border)">
          <div onclick="(function(i){var c=document.getElementById('sssP'+i);var a=document.getElementById('sssA'+i);var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'200px';c.style.opacity=open?'0':'1';a.style.transform=open?'':'rotate(180deg)'})(${i})"
            style="display:flex;align-items:center;justify-content:space-between;padding:13px 0;cursor:pointer;user-select:none;gap:8px">
            <span style="font-size:0.86rem;font-weight:700;flex:1;line-height:1.4">${item.s}</span>
            <span id="sssA${i}" style="color:var(--text2);font-size:0.75rem;flex-shrink:0;transition:transform 0.25s">▼</span>
          </div>
          <div id="sssP${i}" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease,opacity 0.25s;opacity:0">
            <div style="font-size:0.8rem;color:var(--text2);padding-bottom:13px;line-height:1.65">${item.c}</div>
          </div>
        </div>`).join('')}
    </div>

    <!-- İletişim -->
    <div class="card" style="margin-top:16px">
      <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Bize Ulaş</div>
      <div style="font-size:0.8rem;color:var(--text2);margin-bottom:14px;line-height:1.6">
        Sorun yaşıyorsan veya öneride bulunmak istiyorsan bize ulaşabilirsin.
      </div>
      <a href="mailto:destek@lgskoc.app"
        style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface2);border-radius:12px;text-decoration:none;margin-bottom:10px;border:1px solid var(--border)">
        <div style="width:40px;height:40px;border-radius:11px;background:var(--accent)18;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0">📧</div>
        <div>
          <div style="font-size:0.88rem;font-weight:700;color:var(--text)">E-posta ile Yaz</div>
          <div style="font-size:0.75rem;color:var(--accent);margin-top:1px">destek@lgskoc.app</div>
        </div>
        <span style="margin-left:auto;color:var(--text2);font-size:0.8rem">›</span>
      </a>
      ${isTeacher ? '' : `<div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface2);border-radius:12px;border:1px solid var(--border);cursor:pointer" onclick="showPage('messages')">
        <div style="width:40px;height:40px;border-radius:11px;background:var(--accent)18;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0">👨‍🏫</div>
        <div>
          <div style="font-size:0.88rem;font-weight:700;color:var(--text)">Koçuna Yaz</div>
          <div style="font-size:0.75rem;color:var(--text2);margin-top:1px">Mesajlar sekmesinden ulaş</div>
        </div>
        <span style="margin-left:auto;color:var(--text2);font-size:0.8rem">›</span>
      </div>`}
    </div>

    <!-- Uygulama bilgisi -->
    <div class="card" style="margin-top:16px;text-align:center;padding:20px">
      <div style="font-size:0.75rem;color:var(--text2);line-height:2">
        <span style="font-weight:800;color:var(--accent);font-size:0.88rem">LGSKoç</span> — Öğrenci Takip Sistemi<br>
        LGS hazırlık sürecinde koçluk &amp; takip için tasarlandı.
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap">
        <button onclick="showPage('profile')"
          style="padding:9px 16px;border-radius:10px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.8rem;font-weight:600;cursor:pointer;font-family:inherit">
          ← Profile Dön
        </button>
        <button onclick="showPage('dashboard')"
          style="padding:9px 16px;border-radius:10px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:0.8rem;font-weight:600;cursor:pointer;font-family:inherit">
          🏠 Ana Sayfa
        </button>
      </div>
    </div>
  `;
}

