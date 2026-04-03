// wellness_helpers.js — Wellness Veri Yardımcıları

function _getW() {
  const myUid = (window.currentUserData||{}).uid || 'local';
  const storageKey = 'wellness_' + myUid;
  let data = {};
  try { data = JSON.parse(localStorage.getItem(storageKey)||'{}'); } catch(e){}
  return { myUid, storageKey, data };
}

function _syncW(myUid, storageKey, data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
  window._wellnessCache = data;
  if (myUid !== 'local' && db) {
    db.collection('wellness').doc(myUid).set(data)
      .catch(e => console.log('Wellness sync:', e.message));
  }
}
