function teacherAnalysis() {
  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Analizler</div>
    <div class="page-sub">Öğrenci çalışma raporları</div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> PDF Rapor İndir</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">
          <select class="pdf-period-select" id="pdfPeriodType" style="flex:1;min-width:120px" onchange="updateTeacherDatePicker()">
            <option value="weekly">Haftalık</option>
            <option value="monthly" selected>Aylık</option>
            <option value="all">Tüm Dönem</option>
          </select>
          <select class="pdf-period-select" id="pdfDateRange" style="flex:1;min-width:160px">
            ${generateMonthOptions()}
          </select>
          <select class="pdf-period-select" id="pdfStudent" style="flex:1;min-width:120px">
            <option value="all">Tüm Öğrenciler</option>
            ${students.map(s=>`<option value="${s.name}">${s.name}</option>`).join('')}
          </select>
          <button class="pdf-btn" onclick="exportPDF('teacher')" style="flex:1;min-width:140px">📄 PDF İndir</button>
        </div>
      </div>

    ${students.length === 0 ? `
      <div class="card" style="text-align:center;padding:40px;color:var(--text2)">
        <div style="font-size:3rem;margin-bottom:12px">📊</div>
        <div style="font-weight:700">Henüz öğrenci eklenmedi</div>
        <div style="font-size:0.85rem;margin-top:8px">Öğrenciler çalışma girişi yaptıkça veriler burada görünecek</div>
      </div>
    ` : `
      <div class="card" style="margin-bottom:16px">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg> Haftalık Özet</div>
        <canvas id="trendChart" height="180"></canvas>
      </div>
      <div class="card">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Öğrenci Bazlı Çalışma Tablosu</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.82rem">
            <thead>
              <tr style="border-bottom:2px solid var(--border)">
                <th style="text-align:left;padding:8px 4px;color:var(--text2)">Öğrenci</th>
                <th style="text-align:center;padding:8px 4px;color:var(--text2)">Toplam Süre</th>
                <th style="text-align:center;padding:8px 4px;color:var(--text2)">Toplam Soru</th>
                <th style="text-align:center;padding:8px 4px;color:var(--text2)">Ort. Net</th>
                <th style="text-align:center;padding:8px 4px;color:var(--text2)">Giriş</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s=>`
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:10px 4px;font-weight:700">
                    <div style="display:flex;align-items:center;gap:8px">
                      <div style="width:28px;height:28px;border-radius:50%;background:${s.color}22;color:${s.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem">${s.name[0]}</div>
                      ${s.name}
                    </div>
                  </td>
                  <td style="text-align:center;padding:10px 4px;color:var(--accent)">— dk</td>
                  <td style="text-align:center;padding:10px 4px;color:var(--accent4)">—</td>
                  <td style="text-align:center;padding:10px 4px;color:var(--accent3)">—</td>
                  <td style="text-align:center;padding:10px 4px;color:var(--text2)">0</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:12px">* Öğrenciler çalışma girişi yaptıkça veriler güncellenir</div>
      </div>

      <div class="card" style="margin-top:16px">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Bu Hafta Ders Bazlı Soru Dağılımı</div>
        <div id="subjectDistBars" style="padding:4px 0"></div>
      </div>
    `}
  `;
}

function teacherTasks() {
  // Öğrenci bazlı gruplama
  const grouped = {};
  tasks.forEach((t, globalIdx) => {
    const sName = t.studentName || t.student || '—';
    if (!grouped[sName]) grouped[sName] = [];
    grouped[sName].push({ ...t, _globalIdx: globalIdx });
  });

  // Öğrenci sıralaması: bekleyen görevi olan önce, sonra isime göre
  const sortedNames = Object.keys(grouped).sort((a, b) => {
    const aPending = grouped[a].filter(t => !t.done).length;
    const bPending = grouped[b].filter(t => !t.done).length;
    if (bPending !== aPending) return bPending - aPending;
    return a.localeCompare(b, 'tr');
  });

  const totalPending = tasks.filter(t => !t.done).length;
  const totalDone    = tasks.filter(t => t.done).length;

  const typeIcon = { soru:'📝', okuma:'📖', video:'🎬', tekrar:'🔁', deneme:'📊' };

  const studentBlocks = sortedNames.map(sName => {
    const sObj = students.find(s => s.name === sName) || {};
    const color = sObj.color || '#6c63ff';
    const initials = sName !== '—' ? sName[0] : '?';
    const sList = grouped[sName];
    const pending = sList.filter(t => !t.done).length;
    const done    = sList.filter(t => t.done).length;

    // Görevler: bekleyenler önce, sonra son tarihe göre
    const sorted = [...sList].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (a.due || '9999').localeCompare(b.due || '9999');
    });

    const taskRows = sorted.map(t => {
      const idx = t._globalIdx;
      const icon = typeIcon[t.type] || '📝';
      const isOverdue = !t.done && t.due && t.due < new Date().toISOString().slice(0,10);
      const dueBadge = t.due
        ? `<span style="font-size:0.72rem;color:${isOverdue?'#ff6584':'var(--text2)'}">📅 ${t.due}</span>`
        : '';
      return `
        <div style="display:flex;align-items:flex-start;gap:10px;padding:12px 0;border-bottom:1px solid var(--border)">
          <div style="width:34px;height:34px;border-radius:10px;background:${t.done?'rgba(0,200,120,.12)':'rgba(108,99,255,.12)'};display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${icon}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.88rem;${t.done?'text-decoration:line-through;color:var(--text2)':''}">${escHTML(t.title)}</div>
            <div style="font-size:0.76rem;color:var(--accent);font-weight:600;margin-top:1px">${escHTML(t.subject||'')}${t.unit?' · '+escHTML(t.unit):''}</div>
            ${t.desc?`<div style="font-size:0.77rem;color:var(--text2);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHTML(t.desc)}</div>`:''}
            <div style="display:flex;align-items:center;gap:8px;margin-top:5px;flex-wrap:wrap">
              <span style="font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:20px;${t.done?'background:rgba(0,200,120,.15);color:#00c878':'background:rgba(255,193,7,.15);color:#e6a800'}">${t.done?'✅ Teslim Edildi':'⏳ Bekliyor'}</span>
              ${dueBadge}
              ${isOverdue?`<span style="font-size:0.7rem;font-weight:700;color:#ff6584">⚠️ Gecikti</span>`:''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0">
            ${!t.done ? `<button onclick="gorevHatirlatGonder('${t.id||''}',${idx},this)" style="background:#f9ca2415;border:none;padding:5px 9px;border-radius:8px;cursor:pointer;font-size:0.78rem;color:#e6a800" title="Hatırlatma gönder"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></button>` : ''}
            <button onclick="editTaskModal(${idx})" style="background:var(--accent)15;border:none;padding:5px 9px;border-radius:8px;cursor:pointer;font-size:0.78rem;color:var(--accent)"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button onclick="deleteTask('${t.id||''}',${idx})" style="background:#ff658415;border:none;padding:5px 9px;border-radius:8px;cursor:pointer;font-size:0.78rem;color:#ff6584"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="card" style="margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:2px">
          <div style="width:36px;height:36px;border-radius:50%;background:${color}22;color:${color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1rem;flex-shrink:0">${initials}</div>
          <div style="flex:1">
            <div style="font-weight:800;font-size:0.95rem">${sName}</div>
            <div style="font-size:0.75rem;color:var(--text2);margin-top:1px">
              ${pending>0?`<span style="color:#e6a800;font-weight:700">${pending} bekliyor</span>`:'<span style="color:#00c878;font-weight:700">Hepsi tamamlandı</span>'}
              ${done>0?` · <span style="color:var(--text2)">${done} teslim</span>`:''}
            </div>
          </div>
          <button onclick="openTaskModal('${sName}')" style="background:var(--accent)15;border:1px solid var(--accent)30;color:var(--accent);font-size:0.78rem;font-weight:700;padding:5px 12px;border-radius:20px;cursor:pointer;flex-shrink:0">+ Görev Ekle</button>
        </div>
        ${taskRows}
      </div>`;
  }).join('');

  return `
    <div class="page-title">
      <svg style="vertical-align:middle;margin-right:6px" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      Ödev Takip &amp; Kontrol
    </div>
    <div class="page-sub">Öğrenci bazlı ödev ve görev yönetimi</div>

    <div style="display:flex;gap:10px;margin-bottom:16px">
      <div class="card" style="flex:1;text-align:center;padding:14px 10px;margin-bottom:0">
        <div style="font-size:1.5rem;font-weight:800;color:var(--accent4)">${totalPending}</div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Bekleyen</div>
      </div>
      <div class="card" style="flex:1;text-align:center;padding:14px 10px;margin-bottom:0">
        <div style="font-size:1.5rem;font-weight:800;color:#00c878">${totalDone}</div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Teslim Edildi</div>
      </div>
      <div class="card" style="flex:1;text-align:center;padding:14px 10px;margin-bottom:0">
        <div style="font-size:1.5rem;font-weight:800;color:var(--accent)">${sortedNames.length}</div>
        <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Öğrenci</div>
      </div>
    </div>

    <button class="btn btn-primary" style="width:100%;margin-bottom:20px" onclick="openTaskModal()">+ Yeni Görev Ata</button>

    ${tasks.length === 0
      ? `<div style="text-align:center;padding:40px 20px;color:var(--text2)">
           <div style="font-size:3rem;margin-bottom:12px">📋</div>
           <div style="font-weight:700;margin-bottom:6px">Henüz görev atanmadı</div>
           <div style="font-size:0.83rem">Yukarıdaki butona tıklayarak öğrencilere görev atayabilirsiniz.</div>
         </div>`
      : studentBlocks
    }
  `;
}

/* =================== STUDENT PAGES =================== */

// openStudentAnalysis
function openStudentAnalysis(name) {
  // İki seçenek sun: Bireysel Analiz veya Psikolojik Takip
  selectedStudentName = name;
  const sObj = students.find(s=>s.name===name) || {};
  const initials = name[0];
  const color = sObj.color || '#6c63ff';
  const sUid = sObj.uid || '';

  // Basit seçim modalı
  const existing = document.getElementById('_studentChoiceModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_studentChoiceModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:0';
  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:20px 20px 0 0;padding:22px 18px 36px;width:100%;max-width:480px;animation:slideUp .2s ease">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <div style="width:42px;height:42px;border-radius:50%;background:${color}22;color:${color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem">${initials}</div>
        <div>
          <div style="font-weight:800;font-size:1rem">${name}</div>
          <div style="font-size:0.72rem;color:var(--text2)">Hangi raporu görmek istiyorsun?</div>
        </div>
        <button onclick="document.getElementById('_studentChoiceModal').remove()" style="margin-left:auto;background:none;border:none;color:var(--text2);font-size:1.3rem;cursor:pointer">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button onclick="document.getElementById('_studentChoiceModal').remove();studentAnalysisPeriod='daily';showPage('student-detail')"
          style="padding:16px;border-radius:14px;background:var(--surface2);border:1.5px solid var(--border);color:var(--text);cursor:pointer;text-align:left;display:flex;align-items:center;gap:14px">
          <span style="font-size:1.6rem">📊</span>
          <div>
            <div style="font-weight:800;font-size:0.95rem">Bireysel Analiz Raporu</div>
            <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Soru çözümü, deneme sonuçları, performans grafikleri</div>
          </div>
        </button>
        <button onclick="document.getElementById('_studentChoiceModal').remove();showPsychReport('${name}')"
          style="padding:16px;border-radius:14px;background:var(--surface2);border:1.5px solid var(--border);color:var(--text);cursor:pointer;text-align:left;display:flex;align-items:center;gap:14px">
          <span style="font-size:1.6rem">💙</span>
          <div>
            <div style="font-weight:800;font-size:0.95rem">Psikolojik Takip Raporu</div>
            <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Duygu durumu, enerji, kaygı ve uyku takibi</div>
          </div>
        </button>
        <button onclick="document.getElementById('_studentChoiceModal').remove();odul_gonderModal('${name}','${sUid}')"
          style="padding:16px;border-radius:14px;background:linear-gradient(135deg,rgba(249,202,36,0.1),rgba(255,140,0,0.1));border:1.5px solid rgba(249,202,36,0.4);color:var(--text);cursor:pointer;text-align:left;display:flex;align-items:center;gap:14px">
          <span style="font-size:1.6rem">🏅</span>
          <div>
            <div style="font-weight:800;font-size:0.95rem">Ödül Gönder</div>
            <div style="font-size:0.75rem;color:var(--text2);margin-top:2px">Tebrik kartı veya madalya gönder</div>
          </div>
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if(e.target===modal) modal.remove(); });
}


