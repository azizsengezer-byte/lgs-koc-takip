// photo_crop.js — Fotoğraf Kırpma Sistemi
// ========== FOTOĞRAF KIRPMA SİSTEMİ ==========
const _crop = {
  img: null, canvas: null, ctx: null,
  x: 0, y: 0, scale: 1,
  drag: false, lastX: 0, lastY: 0,
  size: 280, // canvas boyutu (px)
  imgNatW: 0, imgNatH: 0,
};


function openCropModal() {
  openModal('cropModal');
  requestAnimationFrame(() => {
    const canvas = document.getElementById('cropCanvas');
    if (!canvas) return;
    const S = _crop.size;
    canvas.width = S; canvas.height = S;
    canvas.style.width = '100%'; canvas.style.height = 'auto';
    _crop.canvas = canvas;
    _crop.ctx = canvas.getContext('2d');
    drawCropPreview();
    // Mouse events
    canvas.onmousedown = (e)=>{ _crop.drag=true; _crop.lastX=e.clientX; _crop.lastY=e.clientY; };
    canvas.onmousemove = (e)=>{ if(!_crop.drag) return; cropMove(e.clientX-_crop.lastX, e.clientY-_crop.lastY); _crop.lastX=e.clientX; _crop.lastY=e.clientY; };
    canvas.onmouseup = ()=>{ _crop.drag=false; };
    // Touch events
    let lastDist = 0;
    canvas.ontouchstart = (e)=>{ e.preventDefault(); if(e.touches.length===1){ _crop.drag=true; _crop.lastX=e.touches[0].clientX; _crop.lastY=e.touches[0].clientY; } else if(e.touches.length===2){ lastDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); } };
    canvas.ontouchmove = (e)=>{ e.preventDefault(); if(e.touches.length===1 && _crop.drag){ const scale=canvas.offsetWidth?canvas.width/canvas.offsetWidth:1; cropMove((e.touches[0].clientX-_crop.lastX)*scale,(e.touches[0].clientY-_crop.lastY)*scale); _crop.lastX=e.touches[0].clientX; _crop.lastY=e.touches[0].clientY; } else if(e.touches.length===2){ const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); cropZoom((d-lastDist)*0.005); lastDist=d; } };
    canvas.ontouchend = ()=>{ _crop.drag=false; };
  });
}

function cropMove(dx, dy) {
  _crop.x += dx; _crop.y += dy;
  clampCrop();
  drawCropPreview();
}

function cropZoom(delta) {
  const S = _crop.size;
  const newScale = Math.max(0.2, Math.min(8, _crop.scale + delta));
  // Zoom around center
  const cx = S/2, cy = S/2;
  _crop.x = cx - (cx - _crop.x) * (newScale / _crop.scale);
  _crop.y = cy - (cy - _crop.y) * (newScale / _crop.scale);
  _crop.scale = newScale;
  clampCrop();
  drawCropPreview();
}

function clampCrop() {
  const S = _crop.size;
  const iw = _crop.imgNatW * _crop.scale;
  const ih = _crop.imgNatH * _crop.scale;
  if (iw >= S) { _crop.x = Math.min(0, Math.max(S-iw, _crop.x)); }
  else { _crop.x = Math.max(0, Math.min(S-iw, _crop.x)); }
  if (ih >= S) { _crop.y = Math.min(0, Math.max(S-ih, _crop.y)); }
  else { _crop.y = Math.max(0, Math.min(S-ih, _crop.y)); }
}

function drawCropPreview() {
  const { ctx, img, x, y, scale, size: S, imgNatW, imgNatH } = _crop;
  if (!ctx || !img) return;
  ctx.clearRect(0, 0, S, S);
  // Karartılmış arka plan
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, S, S);
  // Resim
  ctx.drawImage(img, x, y, imgNatW * scale, imgNatH * scale);
  // Kılavuz daire
  ctx.save();
  ctx.beginPath(); ctx.arc(S/2, S/2, S/2-2, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke();
  // Dışını karart
  ctx.beginPath(); ctx.rect(0,0,S,S); ctx.arc(S/2,S/2,S/2-2,0,Math.PI*2,true);
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
  ctx.restore();
  // Yardımcı çizgiler (ızgara)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 0.5;
  [1/3,2/3].forEach(f=>{ ctx.beginPath(); ctx.moveTo(S*f,0); ctx.lineTo(S*f,S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,S*f); ctx.lineTo(S,S*f); ctx.stroke(); });
}

async function saveCroppedPhoto() {
  const { ctx, img, x, y, scale, imgNatW, imgNatH, size: S } = _crop;
  if (!img) return;

  // Çıktı canvas — 400×400px (yüksek kalite profil)
  const OUT = 400;
  const outCanvas = document.createElement('canvas');
  outCanvas.width = OUT; outCanvas.height = OUT;
  const outCtx = outCanvas.getContext('2d');

  // Daire kırpma maskesi
  outCtx.beginPath(); outCtx.arc(OUT/2, OUT/2, OUT/2, 0, Math.PI*2); outCtx.clip();

  // Kırpma alanını orijinal koordinatlara çevir
  const srcX = -x / scale;
  const srcY = -y / scale;
  const srcW = S / scale;
  const srcH = S / scale;
  outCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUT, OUT);

  // Kalite ayarlı JPEG — max ~150KB hedef
  let quality = 0.85;
  let dataUrl = outCanvas.toDataURL('image/jpeg', quality);
  // 500KB sınırı (base64 ~%33 şişer, 500KB * 0.75 ≈ 375KB base64)
  while (dataUrl.length > 500000 && quality > 0.3) {
    quality -= 0.1;
    dataUrl = outCanvas.toDataURL('image/jpeg', quality);
  }

  closeModal('cropModal');
  showToast('⏳','Fotoğraf yükleniyor...');

  const user = auth.currentUser;
  if (user) {
    await db.collection('users').doc(user.uid).update({ photo: dataUrl });
    window.currentUserData = {...(window.currentUserData||{}), photo: dataUrl};
    const av = document.getElementById('headerAvatar');
    if (av) { av.style.backgroundImage = `url(${dataUrl})`; av.style.backgroundSize = 'cover'; av.textContent = ''; }
    // Öğretmense öğrencilerin teacherPhoto'sunu güncelle
    if (currentRole === 'teacher' && students.length > 0) {
      students.forEach(s => { if (s.uid) db.collection('users').doc(s.uid).update({ teacherPhoto: dataUrl }).catch(()=>{}); });
    }
    students.forEach(s => { if (s.uid === user.uid) s.photo = dataUrl; });
    showToast('✅','Profil fotoğrafı güncellendi!');
    showPage('profile');
  }
}

async function removePhoto() {
  const user = auth.currentUser;
  if (!user) return;
  if (!confirm('Profil fotoğrafını kaldırmak istiyor musunuz?')) return;
  try {
    await db.collection('users').doc(user.uid).update({ photo: '' });
    window.currentUserData = {...(window.currentUserData||{}), photo: ''};
    // Header avatarı güncelle
    const ha = document.getElementById('headerAvatar');
    if (ha) {
      ha.style.backgroundImage = '';
      ha.textContent = (window.currentUserData.name||'?')[0].toUpperCase();
    }
    showToast('✅', 'Fotoğraf kaldırıldı.');
    showPage('profile');
  } catch(e) {
    showToast('❌', 'Hata: ' + e.message);
  }
}

async function uploadPhoto(input) {
  // Geriye dönük uyumluluk — artık cropModal üzerinden çalışıyor
  // ama input varsa doğrudan çağır
  const file = input?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('⚠️','Lütfen görsel seçin!'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      _crop.img = img; _crop.imgNatW = img.naturalWidth; _crop.imgNatH = img.naturalHeight;
      const fit = Math.max(_crop.size/img.naturalWidth, _crop.size/img.naturalHeight);
      _crop.scale = fit;
      _crop.x = (_crop.size - img.naturalWidth*fit)/2;
      _crop.y = (_crop.size - img.naturalHeight*fit)/2;
      openCropModal();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  input.value = '';
}

