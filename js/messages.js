// ═══════════════════════════════════════════════════════════
//  MESAJLAŞMA SİSTEMİ — v2 (sıfırdan)
//  Koç ↔ Öğrenci  +  Öğrenci ↔ Öğrenci (aynı okul)
//  Özellikler: Çevrimiçi/yazıyor, görüldü ✓✓, engelleme,
//              koça bildirme, günlük mesaj limiti (25)
// ═══════════════════════════════════════════════════════════

let activeChat = null;        // partner uid
let chatMessages = {};        // { convId: [msgs] }
let teacherNotifs = [];
let studentNotifs = [];
let _chatUnsub = null;        // realtime listener
let _onlineUnsub = null;      // presence listener
let _typingTimeout = null;

const MSG_DAILY_LIMIT = 25;
const MSG_LIMIT_WARN = 20;

// ── Yardımcılar ──────────────────────────────────────────
function convId(a, b) { return [a, b].sort().join('_'); }

function _myUid()  { return (window.currentUserData || {}).uid || ''; }
function _myData() { return window.currentUserData || {}; }
function _notifs() { return currentRole === 'teacher' ? teacherNotifs : studentNotifs; }

function _timeStr(d) {
  return (d || new Date()).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

// ── PRESENCE — Çevrimiçi + Yazıyor ──────────────────────
function setMyPresence(typing) {
  const uid = _myUid();
  if (!uid || !db) return;
  db.collection('presence').doc(uid).set({
    online: true, typing: !!typing,
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).catch(() => {});
}

function setMyOffline() {
  const uid = _myUid();
  if (!uid || !db) return;
  db.collection('presence').doc(uid).set({
    online: false, typing: false,
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).catch(() => {});
}

window.addEventListener('beforeunload', setMyOffline);
document.addEventListener('visibilitychange', () => {
  document.hidden ? setMyOffline() : setMyPresence(false);
});

function startOnlineWatch(partnerUid) {
  if (_onlineUnsub) { _onlineUnsub(); _onlineUnsub = null; }
  if (!partnerUid || !db) return;
  _onlineUnsub = db.collection('presence').doc(partnerUid)
    .onSnapshot(snap => {
      const el = document.getElementById('chatStatus');
      if (!el) return;
      const d = snap.data();
      if (!d) { el.textContent = ''; return; }
      if (d.typing) {
        el.textContent = '● yazıyor...';
        el.style.color = 'var(--accent)';
      } else if (d.online) {
        el.textContent = '● çevrimiçi';
        el.style.color = 'var(--accent3)';
      } else {
        const last = d.lastSeen?.seconds ? new Date(d.lastSeen.seconds * 1000) : null;
        el.textContent = last
          ? 'son görülme: ' + _timeStr(last)
          : 'çevrimdışı';
        el.style.color = 'var(--text2)';
      }
    }, () => {});
}

// ── ENGELLEME ────────────────────────────────────────────
function _engelliListe() {
  return JSON.parse(localStorage.getItem('engelliList') || '[]');
}

function _engelleKisi(uid, isim) {
  const liste = _engelliListe();
  const idx = liste.indexOf(uid);
  if (idx === -1) {
    liste.push(uid);
    localStorage.setItem('engelliList', JSON.stringify(liste));
    showToast('🚫', isim + ' engellendi. Mesajları artık gelmeyecek.');
  } else {
    liste.splice(idx, 1);
    localStorage.setItem('engelliList', JSON.stringify(liste));
    showToast('✅', isim + ' engeli kaldırıldı.');
  }
  const m = document.getElementById('chatProfilModal');
  if (m) m.remove();
}

// ── KOÇA BİLDİRME ───────────────────────────────────────
async function _kocaBildir(uid, isim) {
  const my = _myData();
  const myUid = _myUid();
  const teacherId = my.teacherId || '';
  if (!myUid || !teacherId) { showToast('⚠️', 'Koç bilgisi bulunamadı'); return; }
  try {
    await db.collection('notifications').add({
      toUid: teacherId, fromUid: myUid,
      text: '⚠️ ' + (my.name || 'Bir öğrenci') + ', ' + isim + ' adlı öğrenciyi rahatsız edici mesaj nedeniyle bildirdi.',
      type: 'sikayet', read: false,
      sikayet_uid: uid, sikayet_isim: isim,
      time: _timeStr(), createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    showToast('✅', 'Koçuna bildirildi.');
  } catch (e) { showToast('⚠️', 'Gönderilemedi.'); }
  const m = document.getElementById('chatProfilModal');
  if (m) m.remove();
}

// ── PROFİL MODAL ─────────────────────────────────────────
async function chatPartnerProfil(uid, name, color, photo, isSchoolMate) {
  const existing = document.getElementById('chatProfilModal');
  if (existing) existing.remove();

  let okul = '', sinif = '';
  try {
    const snap = await db.collection('users').doc(uid).get();
    if (snap.exists) {
      const d = snap.data();
      okul = d.school || '';
      sinif = d.classroom || '';
      if (!photo && d.photo) photo = d.photo;
    }
  } catch (e) {}

  const avatarHTML = photo
    ? `<img src="${photo}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block">`
    : `<div style="width:72px;height:72px;border-radius:50%;background:${color}22;color:${color};display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;margin:0 auto 12px">${name[0]}</div>`;

  const detaylar = [];
  if (okul) detaylar.push(`<div style="font-size:0.85rem;color:var(--text2);margin-bottom:4px">🏫 ${okul}</div>`);
  if (sinif) detaylar.push(`<div style="font-size:0.85rem;color:var(--text2);margin-bottom:4px">📚 ${sinif}</div>`);

  const engelli = _engelliListe().includes(uid);
  const isStudent = currentRole === 'student';
  const isArkadas = isSchoolMate === 'true' || isSchoolMate === true;

  let aksiyonlar = '';
  if (isStudent && isArkadas) {
    aksiyonlar = `
      <button onclick="_engelleKisi('${uid}','${name}')" style="width:100%;margin-top:8px;padding:10px;border-radius:12px;border:1.5px solid ${engelli ? 'var(--accent3)' : '#ff6584'};background:transparent;color:${engelli ? 'var(--accent3)' : '#ff6584'};font-weight:700;font-size:0.85rem;cursor:pointer">
        ${engelli ? '✅ Engeli Kaldır' : '🚫 Engelle'}
      </button>
      <button onclick="_kocaBildir('${uid}','${name}')" style="width:100%;margin-top:6px;padding:10px;border-radius:12px;border:1.5px solid var(--accent);background:transparent;color:var(--accent);font-weight:700;font-size:0.85rem;cursor:pointer">
        📢 Koçuma Bildir
      </button>`;
  }

  const modal = document.createElement('div');
  modal.id = 'chatProfilModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(26,26,46,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)';
  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:28px 24px;width:100%;max-width:320px;text-align:center;box-shadow:var(--shadow-md)">
      ${avatarHTML}
      <div style="font-size:1.2rem;font-weight:900;margin-bottom:4px">${name}</div>
      <div style="font-size:0.82rem;color:var(--accent);font-weight:700;margin-bottom:12px">${isArkadas ? '🏫 Okul Arkadaşı' : '👨‍🎓 Öğrenci / Koç'}</div>
      ${detaylar.join('')}
      ${aksiyonlar}
      <button class="btn btn-outline" style="width:100%;margin-top:12px" onclick="document.getElementById('chatProfilModal').remove()">Kapat</button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}


// ═══════════════════════════════════════════════════════════
//  ANA SAYFA — Partner Listesi + Sohbet Penceresi
// ═══════════════════════════════════════════════════════════

// Son mesaja göre sırala — en son mesajlaşılan en üstte
function _sortByLastMsg(partners, myUid) {
  return [...partners].sort((a, b) => {
    const la = (chatMessages[convId(myUid, a.uid)] || []).slice(-1)[0]?.createdAt?.seconds || 0;
    const lb = (chatMessages[convId(myUid, b.uid)] || []).slice(-1)[0]?.createdAt?.seconds || 0;
    return lb - la;
  });
}

// Öğretmen mesaj arama
function _msgAra() {
  const q = (document.getElementById('msgArama')?.value || '').toLowerCase().trim();
  const liste = document.getElementById('msgListe');
  if (!liste) return;
  const items = liste.querySelectorAll('.chat-list-item');
  items.forEach(item => {
    const isim = item.querySelector('[style*="font-weight:700"]')?.textContent?.toLowerCase() || '';
    item.style.display = (!q || isim.includes(q)) ? '' : 'none';
  });
}

async function messagesPage(role) {
  const isTeacher = role === 'teacher';
  const my = _myData();
  const myUid = my.uid || '';
  const allNotifs = _notifs();

  // ── Partner listesini oluştur ──────────────────────────
  let partners = [];

  if (isTeacher) {
    partners = students.map(s => ({
      uid: s.uid, name: s.name,
      color: s.color || '#6c63ff', photo: s.photo || '',
      isSchoolMate: false
    }));
  } else {
    // Koçu ekle
    const tId = my.teacherId || '';
    if (tId) {
      partners.push({
        uid: tId, name: my.teacherName || 'Koçum',
        color: '#6c63ff', photo: my.teacherPhoto || '',
        isSchoolMate: false
      });
    }
    // Aynı okuldaki arkadaşları ekle
    const mySchool = my.school || '';
    if (mySchool) {
      try {
        const snap = await db.collection('users')
          .where('role', '==', 'student')
          .where('school', '==', mySchool).get();
        snap.forEach(d => {
          if (d.id !== myUid && !partners.find(p => p.uid === d.id)) {
            const s = d.data();
            partners.push({
              uid: d.id, name: s.name,
              color: s.color || '#6c63ff', photo: s.photo || '',
              isSchoolMate: true
            });
          }
        });
      } catch (e) {}
    }
  }

  if (partners.length === 0) {
    return `<div class="page-title">💬 Mesajlar</div>
      <div class="card" style="text-align:center;padding:40px;color:var(--text2)">
        <div style="font-size:3rem">💬</div>
        <div style="font-weight:700;margin-top:12px">${isTeacher ? 'Henüz öğrenci eklenmedi' : 'Koç henüz atanmadı'}</div>
      </div>`;
  }

  // ── Firestore'dan son mesajları çek (ilk açılış için) ──
  try {
    await Promise.all(partners.map(async p => {
      const cid = convId(myUid, p.uid);
      if (chatMessages[cid] && chatMessages[cid].length > 0) return;
      try {
        const snap = await db.collection('messages').doc(cid).collection('msgs')
          .orderBy('createdAt', 'desc').limit(1).get();
        if (!snap.empty) {
          chatMessages[cid] = [];
          snap.forEach(d => chatMessages[cid].push(d.data()));
        }
      } catch (e) {}
    }));
  } catch (e) {}

  // ── Okunmamış sayılar ──────────────────────────────────
  const unreadByPartner = {};
  allNotifs.filter(n => n.type === 'message' && !n.read).forEach(n => {
    unreadByPartner[n.fromUid] = (unreadByPartner[n.fromUid] || 0) + 1;
  });

  // ── Koç ve arkadaş listelerini ayır ────────────────────
  const kocPartners = partners.filter(p => !p.isSchoolMate);

  // Arkadaşlar: mesajlaşma geçmişi VEYA okunmamış bildirimi olanlar
  const arkPartners = partners.filter(p => {
    if (!p.isSchoolMate) return false;
    const cid = convId(myUid, p.uid);
    return (chatMessages[cid] || []).length > 0 || (unreadByPartner[p.uid] || 0) > 0;
  });

  // Son mesaja göre sırala
  arkPartners.sort((a, b) => {
    const la = (chatMessages[convId(myUid, a.uid)] || []).slice(-1)[0]?.createdAt?.seconds || 0;
    const lb = (chatMessages[convId(myUid, b.uid)] || []).slice(-1)[0]?.createdAt?.seconds || 0;
    return lb - la;
  });

  // ── Partner satırı render ──────────────────────────────
  const renderItem = (p) => {
    const cid = convId(myUid, p.uid);
    const last = (chatMessages[cid] || []).slice(-1)[0];
    const unread = unreadByPartner[p.uid] || 0;
    const avatar = p.photo
      ? `<img src="${p.photo}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0">`
      : `<div class="student-avatar" style="background:${p.color}22;color:${p.color};width:40px;height:40px;font-size:1rem;flex-shrink:0">${p.name[0]}</div>`;
    const preview = last ? last.text.substring(0, 30) + '…' : 'Henüz mesaj yok';
    const badge = unread > 0
      ? `<span style="background:var(--accent2);color:#fff;font-size:0.65rem;font-weight:800;min-width:20px;height:20px;border-radius:99px;display:flex;align-items:center;justify-content:center;padding:0 4px;flex-shrink:0">${unread}</span>`
      : '<span style="color:var(--text2);font-size:1rem">›</span>';
    return `<div class="chat-list-item" style="border-bottom:1px solid var(--border);border-radius:0" onclick="switchChatTo('${p.uid}','${role}')">
      ${avatar}
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:0.9rem">${p.name}${p.isSchoolMate ? '<span style="font-size:0.65rem;color:var(--accent);margin-left:6px">🏫</span>' : ''}</div>
        <div style="font-size:0.75rem;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${preview}</div>
      </div>
      ${badge}
    </div>`;
  };

  // ── Aktif sohbet penceresi ─────────────────────────────
  let chatWindowHTML = '';
  if (activeChat) {
    const partner = partners.find(p => p.uid === activeChat) || partners[0];
    const cId = convId(myUid, partner.uid);
    const msgs = chatMessages[cId] || [];
    const engelli = _engelliListe();

    // Tarih ayırıcıları
    function dateLabel(m) {
      let ts = m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000) : null;
      if (!ts && m.dateKey) ts = new Date(m.dateKey);
      if (!ts) return null;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const yest = new Date(today); yest.setDate(today.getDate() - 1);
      const d = new Date(ts); d.setHours(0, 0, 0, 0);
      if (d.getTime() === today.getTime()) return 'Bugün';
      if (d.getTime() === yest.getTime()) return 'Dün';
      return ts.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    let lastLabel = null;
    const msgsHTML = msgs.filter(m => !engelli.includes(m.senderUid)).map((m, i, arr) => {
      const mine = m.senderUid === myUid;
      const dl = dateLabel(m);
      let sep = '';
      if (dl && dl !== lastLabel) {
        lastLabel = dl;
        sep = `<div style="text-align:center;margin:10px 0">
          <span style="background:var(--surface2);color:var(--text2);font-size:0.7rem;padding:3px 12px;border-radius:99px;font-weight:600">${dl}</span>
        </div>`;
      }
      // Görüldü: sadece benim son mesajımda göster
      const isLastMine = mine && arr.slice(i + 1).every(x => x.senderUid !== myUid);
      let seenIcon = '';
      if (mine) {
        if (isLastMine && m.seen) seenIcon = '<span style="font-size:0.65rem;color:var(--accent3);margin-left:3px">✓✓</span>';
        else seenIcon = '<span style="font-size:0.65rem;color:rgba(0,0,0,0.3);margin-left:3px">✓</span>';
      }
      return `${sep}<div class="msg ${mine ? 'mine' : 'theirs'}" id="msg_${m.id || i}">
        <div class="msg-bubble">${m.text || ''}</div>
        <div class="msg-time">${m.time || ''}${seenIcon}</div>
      </div>`;
    }).join('');

    const pAvatar = partner.photo
      ? `<img src="${partner.photo}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;cursor:pointer" onclick="chatPartnerProfil('${partner.uid}','${partner.name}','${partner.color}','${partner.photo || ''}','${!!partner.isSchoolMate}')">`
      : `<div class="student-avatar" style="background:${partner.color}22;color:${partner.color};width:36px;height:36px;cursor:pointer" onclick="chatPartnerProfil('${partner.uid}','${partner.name}','${partner.color}','','${!!partner.isSchoolMate}')">${partner.name[0]}</div>`;

    chatWindowHTML = `
      <div class="chat-header">
        <button class="mobile-chat-back" onclick="activeChat=null;showPage('messages')">← Geri</button>
        ${pAvatar}
        <div style="flex:1;cursor:pointer" onclick="chatPartnerProfil('${partner.uid}','${partner.name}','${partner.color}','${partner.photo || ''}','${!!partner.isSchoolMate}')">
          <div style="font-weight:800">${partner.name}</div>
          <div id="chatStatus" style="font-size:0.72rem;color:var(--text2)"></div>
        </div>
        <button onclick="confirmDeleteConversation('${partner.uid}','${cId}')"
          style="background:#ff658420;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:0.82rem;color:#ff6584;flex-shrink:0"
          title="Sohbeti sil">🗑️</button>
      </div>
      <div class="chat-messages" id="chatMessages">
        ${msgs.length === 0 ? '<div class="msg-system">İlk mesajı sen gönder! 👋</div>' : ''}
        ${msgsHTML}
      </div>
      <div class="chat-input-row">
        <textarea class="chat-input" id="chatInput" placeholder="Mesaj yaz..." rows="1"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage('${role}')}"
          oninput="_onTyping()"></textarea>
        <button class="chat-send-btn" onmousedown="event.preventDefault()" onclick="sendMessage('${role}')">➤</button>
      </div>`;
  }

  // ── Mobil: liste vs pencere ────────────────────────────
  const listCls = activeChat ? 'chat-list mobile-hidden' : 'chat-list';
  const winCls  = activeChat ? 'chat-window mobile-show' : 'chat-window';

  const hasSchoolMates = partners.some(p => p.isSchoolMate);

  // activeChat varsa, HTML DOM'a yazıldığı anda en alta scroll yap
  const scrollTrigger = activeChat
    ? `<img src="" onerror="setTimeout(function(){var c=document.getElementById('chatMessages');if(c)c.scrollTop=c.scrollHeight},0)" style="display:none">`
    : '';

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
      <div>
        <div class="page-title" style="margin-bottom:0">💬 Mesajlar</div>
        <div class="page-sub">Birebir iletişim</div>
      </div>
      ${!isTeacher && hasSchoolMates ? '<button onclick="yeniSohbetModal()" style="background:var(--accent);color:white;border:none;border-radius:10px;padding:7px 14px;font-size:0.82rem;font-weight:700;cursor:pointer;flex-shrink:0">✏️ Yeni</button>' : ''}
    </div>
    <div class="chat-layout">
      <div class="${listCls}" style="border:none;border-radius:0">
        ${isTeacher
          ? `<div style="padding:8px 12px 6px">
              <input id="msgArama" type="text" placeholder="Öğrenci ara..." oninput="_msgAra()"
                style="width:100%;padding:7px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:0.85rem;box-sizing:border-box;font-family:'Nunito',sans-serif">
             </div>
             <div id="msgListe">${_sortByLastMsg(partners, myUid).map(renderItem).join('')}</div>`
          : `${kocPartners.length > 0 ? '<div style="font-size:0.7rem;font-weight:700;color:var(--text2);padding:8px 16px 4px;letter-spacing:0.06em">👨‍🏫 KOÇUM</div>' + kocPartners.map(renderItem).join('') : ''}
             ${arkPartners.length > 0 ? '<div style="font-size:0.7rem;font-weight:700;color:var(--text2);padding:8px 16px 4px;letter-spacing:0.06em">🏫 OKUL ARKADAŞLARI</div>' + _sortByLastMsg(arkPartners, myUid).map(renderItem).join('') : ''}`
        }
      </div>
      <div class="${winCls}">
        ${chatWindowHTML}
      </div>
    </div>
    ${scrollTrigger}`;
}


// ═══════════════════════════════════════════════════════════
//  SOHBET AÇMA
// ═══════════════════════════════════════════════════════════

async function switchChatTo(uid, role) {
  activeChat = uid;
  startOnlineWatch(uid);
  setMyPresence(false);

  const myUid = _myUid();
  const cId = convId(myUid, uid);

  const el = document.getElementById('pageContent') || document.getElementById('mainContent');
  if (el) el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">💬 Yükleniyor...</div>';

  // Mesajları çek
  const engelli = _engelliListe();
  try {
    const snap = await db.collection('messages').doc(cId).collection('msgs')
      .orderBy('createdAt', 'asc').limit(100).get();
    chatMessages[cId] = [];
    snap.forEach(d => {
      const m = d.data();
      if (!engelli.includes(m.senderUid)) chatMessages[cId].push(m);
    });
  } catch (e) { chatMessages[cId] = chatMessages[cId] || []; }

  // Bildirimleri okundu yap
  try {
    const nSnap = await db.collection('notifications')
      .where('toUid', '==', myUid)
      .where('fromUid', '==', uid)
      .where('type', '==', 'message')
      .where('read', '==', false).get();
    if (!nSnap.empty) {
      const batch = db.batch();
      nSnap.forEach(d => batch.update(d.ref, { read: true }));
      await batch.commit();
    }
  } catch (e) {}

  _notifs().forEach(n => { if (n.type === 'message' && n.fromUid === uid) n.read = true; });

  markMessagesAsSeen(uid);
  updateNotifBadge();
  showPage('messages');

  // Yedek scroll — HTML içindeki scrollTrigger ana iş yapıyor ama
  // mobilde geç render olursa diye ekstra deneme
  let _sc = 0;
  const _si = setInterval(() => {
    const cm = document.getElementById('chatMessages');
    if (cm) { cm.scrollTop = cm.scrollHeight; }
    if (++_sc > 15) clearInterval(_si);
  }, 100);

  // Realtime listener
  if (_chatUnsub) _chatUnsub();
  _chatUnsub = db.collection('messages').doc(cId).collection('msgs')
    .orderBy('createdAt', 'asc')
    .onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (change.type !== 'added') return;
        const msg = change.doc.data();
        if (!chatMessages[cId]) chatMessages[cId] = [];
        if (chatMessages[cId].find(m => m.id === msg.id)) return;
        chatMessages[cId].push(msg);

        const msgEl = document.getElementById('chatMessages');
        if (!msgEl) return;
        const isMine = msg.senderUid === _myUid();
        const div = document.createElement('div');
        div.className = 'msg' + (isMine ? ' mine' : ' theirs');
        div.id = 'msg_' + msg.id;
        div.innerHTML = `<div class="msg-bubble">${msg.text}</div><div class="msg-time">${msg.time || ''}</div>`;
        msgEl.appendChild(div);
        msgEl.scrollTop = msgEl.scrollHeight;

        if (!isMine) markMessagesAsSeen(uid);
      });
    });
}


// ═══════════════════════════════════════════════════════════
//  MESAJ GÖNDERME
// ═══════════════════════════════════════════════════════════

function _onTyping() {
  setMyPresence(true);
  clearTimeout(_typingTimeout);
  _typingTimeout = setTimeout(() => setMyPresence(false), 2000);
  const inp = document.getElementById('chatInput');
  if (inp) { inp.style.height = 'auto'; inp.style.height = Math.min(inp.scrollHeight, 120) + 'px'; }
}

async function sendMessage(role) {
  const input = document.getElementById('chatInput');
  const text = input?.value?.trim();
  if (!text || !activeChat) return;

  // Engel kontrolü
  if (_engelliListe().includes(activeChat)) {
    showToast('🚫', 'Bu kişiyi engelledin. Mesaj gönderemezsin.');
    return;
  }

  const my = _myData();
  const myUid = my.uid || '';

  // Günlük limit (sadece öğrenci → arkadaş)
  const isArkadas = currentRole !== 'teacher' && activeChat !== my.teacherId;
  if (isArkadas) {
    const todayKey = getTodayKey();
    const limitKey = `msgLimit_${myUid}_${activeChat}_${todayKey}`;
    const count = parseInt(localStorage.getItem(limitKey) || '0');
    if (count >= MSG_DAILY_LIMIT) {
      showToast('⚠️', `Bugünlük ${MSG_DAILY_LIMIT} mesaj limitine ulaştın!`);
      return;
    }
    if (count === MSG_LIMIT_WARN) showToast('💬', `Dikkat: Bugün sadece ${MSG_DAILY_LIMIT - MSG_LIMIT_WARN} mesaj hakkın kaldı!`);
    localStorage.setItem(limitKey, count + 1);
  }

  if (input.tagName === 'TEXTAREA') input.style.height = 'auto';
  input.value = '';
  setTimeout(() => { const inp = document.getElementById('chatInput'); if (inp) inp.focus(); }, 50);

  const cId = convId(myUid, activeChat);
  const now = new Date();
  const time = _timeStr(now);
  const dateKey = getDateKey(now);
  const msgId = Date.now().toString();

  const msg = {
    id: msgId, text, senderUid: myUid, senderName: my.name || '',
    time, dateKey, seen: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (!chatMessages[cId]) chatMessages[cId] = [];
  chatMessages[cId].push({ ...msg, createdAt: { seconds: now.getTime() / 1000 } });

  // DOM'a ekle
  const msgEl = document.getElementById('chatMessages');
  if (msgEl) {
    const allMsgs = chatMessages[cId];
    if (allMsgs.length >= 2) {
      const prev = allMsgs[allMsgs.length - 2];
      if ((prev.dateKey || '') !== dateKey) {
        const sep = document.createElement('div');
        sep.style.cssText = 'text-align:center;margin:10px 0';
        sep.innerHTML = '<span style="background:var(--surface2);color:var(--text2);font-size:0.7rem;padding:3px 12px;border-radius:99px;font-weight:600">Bugün</span>';
        msgEl.appendChild(sep);
      }
    }
    const div = document.createElement('div');
    div.className = 'msg mine';
    div.id = 'msg_' + msgId;
    div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${time} <span style="font-size:0.65rem;color:rgba(255,255,255,0.5)">✓</span></div>`;
    msgEl.appendChild(div);
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  // Firestore'a yaz + bildirim
  try {
    await db.collection('messages').doc(cId).collection('msgs').add(msg);
    await db.collection('notifications').add({
      toUid: activeChat,
      text: `💬 ${my.name || 'Biri'}: "${text.substring(0, 40)}"`,
      type: 'message', read: false, time,
      fromUid: myUid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) { console.log('Mesaj hatası:', e.message); }
}


// ═══════════════════════════════════════════════════════════
//  GÖRÜLDÜ (seen) İŞARETLEME
// ═══════════════════════════════════════════════════════════

async function markMessagesAsSeen(partnerUid) {
  const myUid = _myUid();
  if (!myUid || !partnerUid) return;
  const cId = convId(myUid, partnerUid);

  try {
    const snap = await db.collection('notifications')
      .where('toUid', '==', myUid).where('fromUid', '==', partnerUid).where('read', '==', false).get();
    snap.forEach(d => d.ref.update({ read: true }));
    _notifs().forEach(n => { if (n.fromUid === partnerUid) n.read = true; });
    updateNotifBadge();
  } catch (e) {}

  try {
    const msgSnap = await db.collection('messages').doc(cId).collection('msgs')
      .where('senderUid', '==', partnerUid).where('seen', '==', false).get();
    if (!msgSnap.empty) {
      const batch = db.batch();
      msgSnap.forEach(d => batch.update(d.ref, { seen: true }));
      await batch.commit();
      (chatMessages[cId] || []).forEach(m => { if (m.senderUid === partnerUid) m.seen = true; });
    }
  } catch (e) {}
}


// ═══════════════════════════════════════════════════════════
//  SOHBETİ SİLME
// ═══════════════════════════════════════════════════════════

async function confirmDeleteConversation(partnerUid, cId) {
  const ok = await appConfirm('Sohbeti Sil', 'Bu sohbeti silmek istediğinize emin misiniz? Mesajlar kalıcı olarak silinecek.', true);
  if (!ok) return;
  deleteConversation(partnerUid, cId);
}

async function deleteConversation(partnerUid, cId) {
  showToast('⏳', 'Sohbet siliniyor...');
  try {
    const snap = await db.collection('messages').doc(cId).collection('msgs').get();
    if (!snap.empty) {
      const batch = db.batch();
      snap.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
    await db.collection('messages').doc(cId).delete().catch(() => {});

    const myUid = _myUid();
    try {
      const nSnap = await db.collection('notifications')
        .where('type', '==', 'message').where('toUid', '==', myUid)
        .where('fromUid', '==', partnerUid).get();
      const b2 = db.batch();
      nSnap.forEach(d => b2.delete(d.ref));
      await b2.commit();
    } catch (e) {}

    delete chatMessages[cId];
    activeChat = null;
    showToast('✅', 'Sohbet silindi!');
    showPage('messages');
  } catch (e) { showToast('❌', 'Silme başarısız: ' + e.message); }
}


// ═══════════════════════════════════════════════════════════
//  YENİ SOHBET BAŞLATMA MODALI
// ═══════════════════════════════════════════════════════════

async function yeniSohbetModal() {
  const existing = document.getElementById('yeniSohbetModal');
  if (existing) existing.remove();

  const my = _myData();
  const myUid = my.uid || '';
  const mySchool = my.school || '';
  if (!mySchool) { showToast('⚠️', 'Okul bilgin tanımlı değil.'); return; }

  let arkadaslar = [];
  try {
    const snap = await db.collection('users')
      .where('role', '==', 'student')
      .where('school', '==', mySchool).get();
    snap.forEach(d => {
      if (d.id !== myUid) {
        const s = d.data();
        arkadaslar.push({ uid: d.id, name: s.name, color: s.color || '#6c63ff', photo: s.photo || '' });
      }
    });
  } catch (e) {}

  if (arkadaslar.length === 0) { showToast('💬', 'Okulunda başka öğrenci bulunamadı.'); return; }

  // Arama fonksiyonu
  const aramaId = 'ysArama_' + Date.now();

  const listHTML = arkadaslar.map(p => {
    const av = p.photo
      ? `<img src="${p.photo}" style="width:36px;height:36px;border-radius:50%;object-fit:cover">`
      : `<div style="width:36px;height:36px;border-radius:50%;background:${p.color}22;color:${p.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.9rem">${p.name[0]}</div>`;
    return `<div class="ys-item" data-name="${p.name.toLowerCase()}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;"
      onclick="document.getElementById('yeniSohbetModal').remove();switchChatTo('${p.uid}','student')">
      ${av}
      <div style="font-weight:700;font-size:0.9rem">${p.name}</div>
    </div>`;
  }).join('');

  const modal = document.createElement('div');
  modal.id = 'yeniSohbetModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(26,26,46,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)';
  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:24px 16px;width:100%;max-width:360px;max-height:70vh;overflow-y:auto;box-shadow:var(--shadow-md)">
      <div style="font-weight:900;font-size:1.1rem;margin-bottom:12px;text-align:center">🏫 Okul Arkadaşlarım</div>
      <input id="${aramaId}" type="text" placeholder="İsim ara..." 
        oninput="var v=this.value.toLowerCase();document.querySelectorAll('.ys-item').forEach(el=>{el.style.display=el.dataset.name.includes(v)?'flex':'none'})"
        style="width:100%;padding:9px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:10px;font-family:inherit">
      <div id="ysListe">${listHTML}</div>
      <button class="btn btn-outline" style="width:100%;margin-top:12px" onclick="document.getElementById('yeniSohbetModal').remove()">Kapat</button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}
