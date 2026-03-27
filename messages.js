let activeChat = null; // partnerUid
let chatMessages = {}; // { convId: [msgs] }
let teacherNotifs = [];
let studentNotifs = [];
const conversations = [];

function convId(uid1, uid2) { return [uid1,uid2].sort().join('_'); }

function messagesPage(role) {
  const isTeacher = role === 'teacher';
  const myData = window.currentUserData || {};
  const myUid = myData.uid || '';
  const allNotifs = currentRole === 'teacher' ? teacherNotifs : studentNotifs;

  let partners = [];
  if (isTeacher) {
    partners = students.map(s => ({ uid: s.uid, name: s.name, color: s.color || '#6c63ff', photo: s.photo||'' }));
  } else {
    const tId = myData.teacherId || '';
    if (tId) partners = [{ uid: tId, name: myData.teacherName || 'Koçum', color: '#6c63ff', photo: myData.teacherPhoto||'' }];
  }

  if (partners.length === 0) {
    return `<div class="page-title">💬 Mesajlar</div>
    <div class="card" style="text-align:center;padding:40px;color:var(--text2)">
      <div style="font-size:3rem">💬</div>
      <div style="font-weight:700;margin-top:12px">${isTeacher ? 'Henüz öğrenci eklenmedi' : 'Koç henüz atanmadı'}</div>
    </div>`;
  }

  // Okunmamış mesaj sayısı partner başına
  const unreadByPartner = {};
  allNotifs.filter(n=>n.type==='message'&&!n.read).forEach(n=>{
    unreadByPartner[n.fromUid] = (unreadByPartner[n.fromUid]||0)+1;
  });

  const listHTML = partners.map(p => {
    const cid = convId(myUid, p.uid);
    const lastMsgs = chatMessages[cid] || [];
    const last = lastMsgs[lastMsgs.length - 1];
    const unread = unreadByPartner[p.uid]||0;
    const avatarHTML = p.photo
      ? `<img src="${p.photo}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;cursor:pointer" onclick="event.stopPropagation();showUserProfile('${p.uid}','${p.name}','${p.color}')">`
      : `<div class="student-avatar" style="background:${p.color}22;color:${p.color};width:40px;height:40px;font-size:1rem;flex-shrink:0;cursor:pointer" onclick="event.stopPropagation();showUserProfile('${p.uid}','${p.name}','${p.color}')">${p.name[0]}</div>`;
    return `<div class="chat-list-item" onclick="switchChatTo('${p.uid}','${role}')">
      ${avatarHTML}
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:0.9rem">${p.name}</div>
        <div style="font-size:0.75rem;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${last ? last.text.substring(0,30)+'…' : 'Henüz mesaj yok'}</div>
      </div>
      ${unread>0?`<span style="background:var(--accent2);color:#fff;font-size:0.65rem;font-weight:800;min-width:20px;height:20px;border-radius:99px;display:flex;align-items:center;justify-content:center;padding:0 4px;flex-shrink:0">${unread}</span>`:'<span style="color:var(--text2);font-size:1rem">›</span>'}
    </div>`;
  }).join('');


  // Aktif sohbet penceresi
  let chatWindowHTML = '';
  if (activeChat) {
    const partner = partners.find(p => p.uid === activeChat) || partners[0];
    const cId = convId(myUid, partner.uid);
    const msgs = chatMessages[cId] || [];

    // Mesajları tarihe göre grupla — tarih ayırıcıları ekle
    function msgDateLabel(m) {
      let ts = m.createdAt?.seconds ? new Date(m.createdAt.seconds*1000) : null;
      if (!ts && m.dateKey) ts = new Date(m.dateKey);
      if (!ts) return null;
      const today = new Date(); today.setHours(0,0,0,0);
      const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
      const d = new Date(ts); d.setHours(0,0,0,0);
      if (d.getTime()===today.getTime()) return 'Bugün';
      if (d.getTime()===yesterday.getTime()) return 'Dün';
      return ts.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
    }

    let lastDateLabel = null;
    const msgsHTML = msgs.map((m,i) => {
      const mine = m.senderUid === myUid;
      const dateLabel = msgDateLabel(m);
      let separator = '';
      if (dateLabel && dateLabel !== lastDateLabel) {
        lastDateLabel = dateLabel;
        separator = `<div style="text-align:center;margin:10px 0">
          <span style="background:var(--surface2);color:var(--text2);font-size:0.7rem;padding:3px 12px;border-radius:99px;font-weight:600">${dateLabel}</span>
        </div>`;
      }

      // Görüldü göstergesi: sadece benim gönderdiğim son mesajda göster
      const isLastMine = mine && msgs.slice(i+1).every(x=>x.senderUid!==myUid);
      const seenHTML = mine ? `<span style="font-size:0.65rem;color:${m.seen?'var(--accent3)':'rgba(255,255,255,0.5)'};margin-left:3px">${m.seen?'✓✓':'✓'}</span>` : '';
      const seenLabel = (mine && isLastMine && m.seen)
        ? `<div style="text-align:right;font-size:0.65rem;color:var(--accent3);margin-top:1px;margin-right:4px">Görüldü ✓✓</div>` : '';

      return `${separator}<div class="msg ${mine?'mine':'theirs'}" id="msg_${m.id||i}">
        <div class="msg-bubble">${m.text||''}</div>
        <div class="msg-time">${m.time||''}${seenHTML}</div>
      </div>${seenLabel}`;
    }).join('');

    const partnerAvatar = partner.photo
      ? `<img src="${partner.photo}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;cursor:pointer" onclick="showUserProfile('${partner.uid}','${partner.name}','${partner.color}')">`
      : `<div class="student-avatar" style="background:${partner.color}22;color:${partner.color};width:36px;height:36px;cursor:pointer" onclick="showUserProfile('${partner.uid}','${partner.name}','${partner.color}')">${partner.name[0]}</div>`;

    chatWindowHTML = `
      <div class="chat-header">
        <button class="mobile-chat-back" onclick="activeChat=null;showPage('messages')">← Geri</button>
        ${partnerAvatar}
        <div style="flex:1;cursor:pointer" onclick="showUserProfile('${partner.uid}','${partner.name}','${partner.color}')">
          <div style="font-weight:800">${partner.name}</div>
          <div style="font-size:0.72rem;color:var(--accent3)">● profil için tıkla</div>
        </div>
        <button onclick="confirmDeleteConversation('${partner.uid}','${cId}')"
          style="background:#ff658420;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:0.82rem;color:#ff6584;flex-shrink:0"
          title="Sohbeti sil">🗑️</button>
      </div>
      <div class="chat-messages" id="chatMessages">
        ${msgs.length===0?'<div class="msg-system">İlk mesajı sen gönder! 👋</div>':''}
        ${msgsHTML}
      </div>
      <div class="chat-input-row">
        <input class="chat-input" id="chatInput" type="text" placeholder="Mesaj yaz..."
          onkeydown="if(event.key==='Enter')sendMessage('${role}')">
        <button class="chat-send-btn" onclick="sendMessage('${role}')">➤</button>
      </div>`;
  }

  // Mobilde: activeChat varsa listeyi gizle, pencereyi göster
  const listClass = activeChat ? 'chat-list mobile-hidden' : 'chat-list';
  const winClass = activeChat ? 'chat-window mobile-show' : 'chat-window';

  return `
    <div class="page-title">💬 Mesajlar</div>
    <div class="page-sub">Birebir iletişim</div>
    <div class="chat-layout">
      <div class="${listClass}">
        <div class="chat-list-header">💬 Konuşmalar</div>
        ${listHTML}
      </div>
      <div class="${winClass}">
        ${chatWindowHTML}
      </div>
    </div>`;
}

async function switchChatTo(uid, role) {
  activeChat = uid;
  const myUid = (window.currentUserData || {}).uid || '';
  const cId = convId(myUid, uid);
  const el = document.getElementById('pageContent');
  if(el) el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text2)">💬 Yükleniyor...</div>`;
  try {
    const snap = await db.collection('messages').doc(cId).collection('msgs')
      .orderBy('createdAt','asc').limit(100).get();
    chatMessages[cId] = [];
    snap.forEach(d => chatMessages[cId].push(d.data()));
  } catch(e) { chatMessages[cId] = chatMessages[cId] || []; }

  // Firestore'daki TÜM okunmamış mesaj bildirimlerini (bu kişiden) okundu yap
  try {
    const nSnap = await db.collection('notifications')
      .where('toUid','==',myUid)
      .where('fromUid','==',uid)
      .where('type','==','message')
      .where('read','==',false)
      .get();
    const batch = db.batch();
    nSnap.forEach(d => batch.update(d.ref, {read:true}));
    await batch.commit();
  } catch(e) {}

  // Local array güncelle
  const allNotifs = currentRole === 'teacher' ? teacherNotifs : studentNotifs;
  allNotifs.forEach(n => {
    if(n.type==='message' && n.fromUid===uid) n.read = true;
  });

  // messages koleksiyonundaki seen flag'lerini güncelle
  markMessagesAsSeen(uid);
  updateNotifBadge();
  showPage('messages');
  setTimeout(()=>{ const cm=document.getElementById('chatMessages'); if(cm) cm.scrollTop=cm.scrollHeight; },80);
}

async function sendMessage(role) {
  const input = document.getElementById('chatInput');
  const text = input?.value?.trim();
  if (!text || !activeChat) return;
  const myData = window.currentUserData || {};
  const myUid = myData.uid || '';
  const cId = convId(myUid, activeChat);
  const now = new Date();
  const time = now.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  const dateKey = getDateKey(now);
  const msgId = Date.now().toString();
  const msg = {
    id: msgId, text, senderUid: myUid, senderName: myData.name||'',
    time, dateKey, seen: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (!chatMessages[cId]) chatMessages[cId] = [];
  chatMessages[cId].push({ ...msg, createdAt: { seconds: now.getTime()/1000 } });
  input.value = '';

  // DOM'a ekle
  const msgEl = document.getElementById('chatMessages');
  if (msgEl) {
    // Bugün tarihi ayırıcısı — eğer son mesaj farklı günden ise ekle
    const allMsgs = chatMessages[cId];
    if (allMsgs.length >= 2) {
      const prev = allMsgs[allMsgs.length-2];
      const prevDate = prev.dateKey || '';
      if (prevDate !== dateKey) {
        const sep = document.createElement('div');
        sep.style.cssText = 'text-align:center;margin:10px 0';
        sep.innerHTML = `<span style="background:var(--surface2);color:var(--text2);font-size:0.7rem;padding:3px 12px;border-radius:99px;font-weight:600">Bugün</span>`;
        msgEl.appendChild(sep);
      }
    }
    const div = document.createElement('div');
    div.className = 'msg mine';
    div.id = 'msg_' + msgId;
    div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${time} <span class="seen-status" style="font-size:0.65rem;color:rgba(255,255,255,0.5)">✓</span></div>`;
    msgEl.appendChild(div);
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  try {
    const docRef = await db.collection('messages').doc(cId).collection('msgs').add(msg);
    // Karşı tarafa bildirim gönder
    await db.collection('notifications').add({
      toUid: activeChat,
      text: `💬 ${myData.name||'Biri'}: "${text.substring(0,40)}"`,
      type: 'message', read: false, time,
      fromUid: myUid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch(e) { console.log('Mesaj hatası:', e.message); }
}

// Mesajları okunan olarak işaretle
async function markMessagesAsSeen(partnerUid) {
  const myUid = (window.currentUserData||{}).uid || '';
  if (!myUid || !partnerUid) return;
  const cId = convId(myUid, partnerUid);
  // 1. Notifications okundu
  try {
    const snap = await db.collection('notifications')
      .where('toUid','==',myUid).where('fromUid','==',partnerUid).where('read','==',false).get();
    snap.forEach(d => d.ref.update({ read: true }));
    const notifs = currentRole==='teacher' ? teacherNotifs : studentNotifs;
    notifs.forEach(n => { if(n.fromUid===partnerUid) n.read=true; });
    updateNotifBadge();
  } catch(e) {}
  // 2. Mesajları seen:true yap — karşı taraf ✓✓ görecek
  try {
    const msgSnap = await db.collection('messages').doc(cId).collection('msgs')
      .where('senderUid','==',partnerUid).where('seen','==',false).get();
    if (!msgSnap.empty) {
      const batch = db.batch();
      msgSnap.forEach(d => batch.update(d.ref, { seen: true }));
      await batch.commit();
      const cached = chatMessages[cId] || [];
      cached.forEach(m => { if (m.senderUid === partnerUid) m.seen = true; });
    }
  } catch(e) {}
}

// Sohbeti sil onay
async function confirmDeleteConversation(partnerUid, cId) {
  const ok = await appConfirm('Sohbeti Sil', 'Bu sohbeti silmek istediğinize emin misiniz? Mesajlar kalıcı olarak silinecek.', true);
  if (!ok) return;
  deleteConversation(partnerUid, cId);
}

async function deleteConversation(partnerUid, cId) {
  showToast('⏳','Sohbet siliniyor...');
  try {
    // Tüm mesajları sil
    const snap = await db.collection('messages').doc(cId).collection('msgs').get();
    if (!snap.empty) {
      const batch = db.batch();
      snap.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
    await db.collection('messages').doc(cId).delete().catch(()=>{});
    // İlgili bildirimleri sil
    const myUid = (window.currentUserData||{}).uid || '';
    try {
      const nSnap = await db.collection('notifications')
        .where('type','==','message').where('toUid','==',myUid)
        .where('fromUid','==',partnerUid).get();
      const b2 = db.batch();
      nSnap.forEach(d => b2.delete(d.ref));
      await b2.commit();
    } catch(e2) {}
    // Local temizle
    delete chatMessages[cId];
    activeChat = null;
    showToast('✅','Sohbet silindi!');
    showPage('messages');
  } catch(e) {
    showToast('❌','Silme başarısız: '+e.message);
  }
}

