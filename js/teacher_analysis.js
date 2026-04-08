function teacherAnalysis() {
  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Analizler</div>
    <div class="page-sub">Öğrenci çalışma raporları</div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> PDF Rapor İndir</div>
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
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg> Haftalık Özet</div>
        <canvas id="trendChart" height="180"></canvas>
      </div>
      <div class="card">
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Öğrenci Bazlı Çalışma Tablosu</div>
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
        <div class="card-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Bu Hafta Ders Bazlı Soru Dağılımı</div>
        <div id="subjectDistBars" style="padding:4px 0"></div>
      </div>
    `}
  `;
}

function teacherTasks() {
  return `
    <div class="page-title"><svg style="vertical-align:middle;margin-right:5px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Görevler</div>
    <div class="page-sub">Ödevler ve çalışma programları</div>
    <button class="btn btn-primary" style="margin-bottom:20px" onclick="openTaskModal()">+ Yeni Görev Ata</button>
    ${tasks.length === 0 ? `<div style="text-align:center;padding:30px;color:var(--text2)">Henüz görev atanmadı</div>` :
    tasks.map((t,i)=>`
      <div class="assignment-card" style="position:relative">
        <div class="assignment-icon" style="background:rgba(108,99,255,.15)">${t.typeLabel?t.typeLabel.split(' ')[0]:'📝'}</div>
        <div style="flex:1;min-width:0">
          <div class="assignment-title">${t.title || t.baslik || 'Görev'}</div>
          <div style="font-size:0.78rem;color:var(--accent);font-weight:600;margin-bottom:2px">${t.subject||''}${(t.studentName||t.student)?(' → '+(t.studentName||t.student)):''}</div>
          <div class="assignment-desc">${t.desc||''}</div>
          <div class="assignment-footer">
            <span class="badge ${t.done?'badge-green':'badge-yellow'}">${t.done?'✅ Tamamlandı':'⏳ Bekliyor'}</span>
            <span style="font-size:0.75rem;color:var(--text2)">Son: ${t.due||'-'}</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
          <button onclick="editTaskModal(${i})" style="background:var(--accent)15;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:0.8rem;color:var(--accent)">✏️</button>
          <button onclick="deleteTask('${t.id||''}',${i})" style="background:#ff658415;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:0.8rem;color:#ff6584">🗑️</button>
        </div>
      </div>
    `).join('')}
  `;
}

/* =================== STUDENT PAGES =================== */

// ============================================================
// ÖĞRENCİ ANALİZ SAYFASI AÇICI
// ============================================================
        <span style="font-size:0.68rem;color:var(--text2)">${e.time||''}</span>
      </div>`;
  });

  panel.innerHTML = html;
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleDenemeAcc(id) {
  const el = document.getElementById(id);
  const arrow = document.getElementById(id+'_arrow');
  if (!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
}

function toggleDersAcc(id) {
  const el = document.getElementById(id);
  const arrow = document.getElementById(id+'_arrow');
  if (!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
}

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
