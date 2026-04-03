// picker.js — Konu/Seçenek Picker Sistemi
// ============================================================
// KONU & SEÇENEK MODAL — Tüm seçimler için
// ============================================================

function openOptionPicker(targetId, title, options, callback) {
  const modal = document.getElementById('topicPickerModal');
  document.getElementById('topicPickerTitle').textContent = title;
  const searchEl = document.getElementById('topicPickerSearch');
  const searchWrap = searchEl?.parentElement;
  // Sadece öğrenci seçiminde arama göster
  const showSearch = targetId === 'taskStudent';
  if (searchWrap) searchWrap.style.display = showSearch ? '' : 'none';
  if (searchEl) searchEl.value = '';
  const currentVal = document.getElementById(targetId)?.value || '';
  modal._options = options;
  modal._targetId = targetId;
  modal._callback = callback;
  _renderPickerOptions(options, currentVal, targetId, callback);
  modal.style.display = 'flex';
  modal.onclick = (e) => { if(e.target===modal) closeTopicPicker(); };
  if (showSearch) { /* Kullanıcı kendisi tıklasın, otomatik klavye açma */ }
}

function _renderPickerOptions(options, currentVal, targetId, callback) {
  document.getElementById('topicPickerList').innerHTML = options.map(o => `
    <button onclick="selectOption('${targetId}','${o.v.replace(/'/g,"\\'")}','${(o.l||o.v).replace(/'/g,"\\'")}','${callback ? callback.name : ''}')"
      style="width:100%;padding:14px 18px;background:${o.v===currentVal?'rgba(108,99,255,0.1)':'transparent'};
             border:none;border-bottom:1px solid var(--border);color:var(--text);
             text-align:left;cursor:pointer;font-size:0.92rem;display:flex;align-items:center;justify-content:space-between">
      <span>${o.l||o.v}</span>
      ${o.v===currentVal ? '<span style="color:var(--accent)">✓</span>' : '<span style="color:var(--text2);font-size:0.8rem">›</span>'}
    </button>`).join('');
}

function filterTopicPicker(query) {
  const modal = document.getElementById('topicPickerModal');
  if (!modal._options) return;
  const q = query.toLowerCase().trim();
  const filtered = q ? modal._options.filter(o=>(o.l||o.v).toLowerCase().includes(q)) : modal._options;
  const currentVal = document.getElementById(modal._targetId)?.value || '';
  _renderPickerOptions(filtered, currentVal, modal._targetId, modal._callback);
}

function selectOption(targetId, value, label, callbackName) {
  const inp = document.getElementById(targetId);
  if (inp) inp.value = value;
  // Label'ı güncelle — hem targetId+'Label' hem de özel durumlar
  const lbl = document.getElementById(targetId+'Label');
  if (lbl) lbl.textContent = label;
  // taskUnit için taskUnitLabel'ı da güncelle (hidden input olduğu için ayrıca)
  if (targetId === 'taskUnit') {
    const unitLbl = document.getElementById('taskUnitLabel');
    if (unitLbl) unitLbl.textContent = label;
  }
  // entryTopic için entryTopicLabel'ı da güncelle
  if (targetId === 'entryTopic') {
    const topicLbl = document.getElementById('entryTopicLabel');
    if (topicLbl) topicLbl.textContent = label;
  }
  closeTopicPicker();
  if (callbackName) { const fn=window[callbackName]; if(typeof fn==='function') fn(); }
}

// Konu seçici — kazanimlar listesini kullanır
function openEditTopicPicker() {
  const sub = document.getElementById('editEntrySub')?.value || '';
  const topics = kazanimlar[sub] || [];
  const opts = topics.map(t=>({v:t, l:t}));
  if (!opts.length) { showToast('ℹ️','Bu ders için konu listesi yok, elle yaz'); return; }
  const current = document.getElementById('editEntryTopic')?.value || '';
  openOptionPicker('editEntryTopicHidden', (sub||'Konu')+' — Seç', opts, 'applyEditTopic');
  // Mevcut değeri geçici hidden input'a yansıt
  let hid = document.getElementById('editEntryTopicHidden');
  if (!hid) { hid = document.createElement('input'); hid.type='hidden'; hid.id='editEntryTopicHidden'; document.body.appendChild(hid); }
  hid.value = current;
}

function applyEditTopic() {
  const val = document.getElementById('editEntryTopicHidden')?.value || '';
  if (!val) return;
  document.getElementById('editEntryTopic').value = val;
  const lbl = document.getElementById('editEntryTopicLabel');
  if (lbl) lbl.textContent = val;
}

function openTopicPicker(target) {
  const sub = document.getElementById(target==='entry'?'entrySubject':'taskSubject')?.value || '';
  const type = document.getElementById(target==='entry'?'entryType':'taskType')?.value || '';
  const targetId = target==='entry' ? 'entryTopic' : 'taskUnit';
  const labelId  = target==='entry' ? 'entryTopicLabel' : 'taskUnitLabel';
  const cbName   = target==='task' ? 'updateTaskTitle' : null;
  const rawList  = kazanimlar[sub] || [];
  const isHiyerarsik = rawList.length > 0 && typeof rawList[0] === 'object';

  if (isHiyerarsik) {
    const modal = document.getElementById('topicPickerModal');
    document.getElementById('topicPickerTitle').textContent = sub + ' — Konu Seç';
    const searchWrap = document.getElementById('topicPickerSearch')?.parentElement;
    if (searchWrap) searchWrap.style.display = 'none';

    let listHTML = '';
    rawList.forEach((item, ui) => {
      const hasAlt = item.alt && item.alt.length > 0;
      const cbArg = cbName || '';
      const uniteEsc = item.unite.replace(/'/g, "\'");

      // Ünite satırı: sol kısım = seç, sağ ok = alt konuları aç/kapat
      listHTML += `<div style="display:flex;border-bottom:1px solid var(--border);align-items:stretch">
        <button onclick="fenSecVeKapat('${uniteEsc}','${uniteEsc}','${targetId}','${labelId}','${cbArg}')"
          style="flex:1;padding:14px 18px;background:transparent;border:none;
                 color:var(--text);text-align:left;cursor:pointer;font-size:0.92rem;font-weight:600">
          ${item.unite}
        </button>
        ${hasAlt ? `<button onclick="fenUniteToggle(${ui})" 
          style="padding:14px 16px;background:transparent;border:none;border-left:1px solid var(--border);
                 color:var(--text2);cursor:pointer;font-size:0.9rem;min-width:44px;text-align:center"
          title="Alt konuları göster">
          <span id="fenArrow_${ui}" style="display:inline-block;transition:transform .2s">›</span>
        </button>` : ''}
      </div>`;

      if (hasAlt) {
        listHTML += `<div id="fenAlt_${ui}" style="display:none">`;
        item.alt.forEach(alt => {
          const altEsc = alt.replace(/'/g, "\'");
          listHTML += `<button onclick="fenSecVeKapat('${uniteEsc}','${altEsc}','${targetId}','${labelId}','${cbArg}')"
            style="width:100%;padding:11px 18px 11px 36px;background:var(--surface2)33;border:none;
                   border-bottom:1px solid var(--border)22;color:var(--text2);text-align:left;
                   cursor:pointer;font-size:0.86rem;display:flex;align-items:center;gap:8px">
            <span style="color:var(--accent);font-size:0.65rem">●</span><span>${alt}</span>
          </button>`;
        });
        listHTML += `</div>`;
      }
    });

    if (type === 'tekrar') {
      const cbArg = cbName || '';
      listHTML += `<button onclick="fenSecVeKapat('Genel Tekrar','Genel Tekrar','${targetId}','${labelId}','${cbArg}')"
        style="width:100%;padding:14px 18px;background:transparent;border:none;border-bottom:1px solid var(--border);
               color:var(--text);text-align:left;cursor:pointer;font-size:0.92rem;display:flex;align-items:center;gap:8px">
        🔁 Genel Tekrar
      </button>`;
    }

    document.getElementById('topicPickerList').innerHTML = listHTML;
    modal.style.display = 'flex';
    modal.onclick = (e) => { if(e.target===modal) closeTopicPicker(); };
  } else {
    const showGenel = type === 'tekrar';
    const allTopics = showGenel ? [...rawList, 'Genel Tekrar'] : rawList;
    const opts = allTopics.map(t=>({v:t, l:t}));
    openOptionPicker(targetId, (sub||'Konu')+' — Seç', opts, cbName ? {name:cbName} : null);
  }
}

function fenToggleAlt(ui, unite, targetId, labelId, cbName) {
  const altEl = document.getElementById('fenAlt_'+ui);
  const arrowEl = document.getElementById('fenArrow_'+ui);
  if (!altEl) {
    // Alt konu yok, direkt seç
    fenSecVeKapat(unite, unite, targetId, labelId, cbName);
    return;
  }
  const open = altEl.style.display !== 'none';
  altEl.style.display = open ? 'none' : 'block';
  if (arrowEl) arrowEl.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
}

function fenSecVeKapat(unite, alt, targetId, labelId, cbName) {
  const val = (alt && alt !== unite) ? unite + ' / ' + alt : unite;
  const inp = document.getElementById(targetId);
  const lbl = document.getElementById(labelId);
  if (inp) inp.value = val;
  if (lbl) lbl.textContent = val;
  closeTopicPicker();
  if (cbName && window[cbName]) window[cbName]();
}

function fenUniteToggle(ui) {
  const altEl = document.getElementById('fenAlt_'+ui);
  const arrowEl = document.getElementById('fenArrow_'+ui);
  if (!altEl) return;
  const open = altEl.style.display !== 'none';
  altEl.style.display = open ? 'none' : 'block';
  if (arrowEl) arrowEl.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
}

function fenSec(unite, alt, targetId, labelId, modalEl, cbName) {
  const val = (alt && alt !== unite) ? unite + ' / ' + alt : unite;
  const inp = document.getElementById(targetId);
  const lbl = document.getElementById(labelId);
  if (inp) inp.value = val;
  if (lbl) lbl.textContent = val;
  modalEl?.remove();
  if (cbName && window[cbName]) window[cbName]();
}

function closeTopicPicker() {
  document.getElementById('topicPickerModal').style.display = 'none';
}

function updateEntryTopics() {
  document.getElementById('entryTopic').value = '';
  const lbl = document.getElementById('entryTopicLabel');
  if (lbl) lbl.textContent = '— Konu seç —';
}

function updateTaskUnits() {
  document.getElementById('taskUnit').value = '';
  const lbl = document.getElementById('taskUnitLabel');
  if (lbl) lbl.textContent = '— Konu seç —';
}
