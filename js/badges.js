// badges.js — Rozet Sistemi, Çerçeveler, İstatistik
// ============================================================
// 🏆 ROZET SİSTEMİ — SVG Tasarım
// ============================================================

// ── Benzersiz Rozet SVG'leri — tüm 93 rozet ─────────────────
const BADGE_DEFS = {
// === AKADEMİK ===
s50:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_s50" cx="40%" cy="30%"><stop offset="0%" stop-color="#a8ff78"/><stop offset="100%" stop-color="#1a6b1a"/></radialGradient><filter id="f_s50"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0a3d0a" flood-opacity="0.7"/></filter></defs><ellipse cx="40" cy="40" rx="34" ry="36" fill="url(#g_s50)" filter="url(#f_s50)"/><line x1="40" y1="58" x2="40" y2="34" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M40,44 Q32,37 28,29" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M40,39 Q48,33 52,25" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M37,58 Q40,53 43,58" fill="white"/></svg>`,
s100:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_s100" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#1e40af"/></linearGradient><filter id="f_s100"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0a1f5c" flood-opacity="0.7"/></filter></defs><path d="M14,12 L52,8 L66,12 L66,72 L52,68 L14,72Z" fill="url(#g_s100)" filter="url(#f_s100)"/><path d="M14,12 L14,72 L52,68 L52,8Z" fill="#1e3a8a"/><line x1="52" y1="8" x2="52" y2="68" stroke="#93c5fd" stroke-width="1.5" opacity="0.6"/><path d="M22,44 L38,44 M32,37 L38,44 L32,51" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
s300:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_s300" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#92400e"/></linearGradient><filter id="f_s300"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0a00" flood-opacity="0.7"/></filter></defs><rect x="10" y="10" width="60" height="60" rx="12" fill="url(#g_s300)" filter="url(#f_s300)"/><path d="M24,52 L24,38 L30,32 M30,32 L24,38 M36,32 L36,52 M36,32 Q46,32 46,40 Q46,48 36,48" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M52,32 Q62,32 62,40 Q62,52 52,52 L50,52" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`,
s500:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_s500" x1="0%" y1="0%" x2="60%" y2="100%"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#9a3412"/></linearGradient><filter id="f_s500"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3d1308" flood-opacity="0.7"/></filter></defs><polygon points="40,6 62,18 70,42 62,66 40,74 18,66 10,42 18,18" fill="url(#g_s500)" filter="url(#f_s500)"/><circle cx="40" cy="22" r="5" fill="white" opacity="0.9"/><path d="M40,27 L38,40 L32,52 M40,27 L42,40 L48,52" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M35,34 L45,34" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
s1000:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_s1k" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#334155"/></linearGradient><filter id="f_s1k"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.8"/></filter></defs><polygon points="40,6 70,40 40,74 10,40" fill="url(#g_s1k)" filter="url(#f_s1k)"/><ellipse cx="40" cy="40" rx="20" ry="15" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/><text x="40" y="44" text-anchor="middle" font-size="13" font-weight="900" fill="white" font-family="system-ui">1K</text></svg>`,
s2500:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_s2500" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#3730a3"/></linearGradient><filter id="f_s2500"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1e1b4b" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_s2500)" filter="url(#f_s2500)"/><path d="M28,34 L35,26 L40,30 L45,22 L52,30 L52,50 Q52,56 40,58 Q28,56 28,50Z" fill="white" opacity="0.9"/></svg>`,
s5000:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_s5k" x1="0%" y1="0%" x2="70%" y2="100%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#78350f"/></linearGradient><filter id="f_s5k"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#78350f" flood-opacity="0.8"/></filter></defs><path d="M40,6 L70,16 L70,44 C70,60 56,72 40,76 C24,72 10,60 10,44 L10,16Z" fill="url(#g_s5k)" filter="url(#f_s5k)"/><path d="M20,36 L20,52 L60,52 L60,36 L52,44 L40,32 L28,44Z" fill="white" opacity="0.9"/><circle cx="20" cy="34" r="3.5" fill="white"/><circle cx="40" cy="30" r="4" fill="white"/><circle cx="60" cy="34" r="3.5" fill="white"/></svg>`,
s10000:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_s10k" cx="50%" cy="30%"><stop offset="0%" stop-color="#f0abfc"/><stop offset="40%" stop-color="#9333ea"/><stop offset="100%" stop-color="#1e0050"/></radialGradient><filter id="f_s10k"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0a0020" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_s10k)" filter="url(#f_s10k)"/><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="none" stroke="#e9d5ff" stroke-width="1" opacity="0.4"/><text x="40" y="46" text-anchor="middle" font-size="10" font-weight="900" fill="white" font-family="system-ui">10K</text></svg>`,
// Seri
d3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_d3" cx="50%" cy="80%"><stop offset="0%" stop-color="#fde047"/><stop offset="40%" stop-color="#f97316"/><stop offset="100%" stop-color="#7f1d1d"/></radialGradient><filter id="f_d3"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3d0000" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_d3)" filter="url(#f_d3)"/><path d="M40,65 Q24,52 26,36 Q30,24 38,20 Q35,28 40,32 Q44,24 46,16 Q56,28 54,44 Q52,56 40,65Z" fill="white" opacity="0.9"/><path d="M40,62 Q30,50 33,38 Q36,30 40,28 Q43,34 44,42 Q50,36 48,50 Q46,58 40,62Z" fill="#f97316" opacity="0.6"/><text x="40" y="58" text-anchor="middle" font-size="10" font-weight="900" fill="white" font-family="system-ui">3</text></svg>`,
d7:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_d7" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient><filter id="f_d7"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1e0050" flood-opacity="0.8"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="18" fill="url(#g_d7)" filter="url(#f_d7)"/><path d="M46,14 L30,42 H43 L34,66 L58,34 H44Z" fill="white" opacity="0.9"/></svg>`,
d14:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_d14" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0369a1"/></linearGradient><filter id="f_d14"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#001a35" flood-opacity="0.8"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="12" fill="url(#g_d14)" filter="url(#f_d14)"/><path d="M26,14 L26,42 H44 M52,14 L52,42" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M20,54 H60" stroke="white" stroke-width="2" opacity="0.4"/><text x="40" y="68" text-anchor="middle" font-size="9" fill="white" opacity="0.7" font-family="system-ui">14 GÜN</text></svg>`,
d30:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_d30" cx="35%" cy="28%"><stop offset="0%" stop-color="#bae6fd"/><stop offset="40%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#0c4a6e"/></radialGradient><filter id="f_d30"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#001a2e" flood-opacity="0.8"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_d30)" filter="url(#f_d30)"/><path d="M40,12 L40,22 M40,58 L40,68 M12,40 L22,40 M58,40 L68,40" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.6"/><polygon points="40,22 43,32 54,32 45,39 48,50 40,44 32,50 35,39 26,32 37,32" fill="white" opacity="0.9"/></svg>`,
// Hedef
g1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient><filter id="f_g1"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3d0010" flood-opacity="0.7"/></filter></defs><polygon points="40,6 66,21 66,59 40,74 14,59 14,21" fill="url(#g_g1)" filter="url(#f_g1)"/><circle cx="40" cy="40" r="20" fill="none" stroke="white" stroke-width="1.5" opacity="0.4"/><circle cx="40" cy="40" r="13" fill="none" stroke="white" stroke-width="1.5" opacity="0.6"/><circle cx="40" cy="40" r="6" fill="none" stroke="white" stroke-width="2" opacity="0.9"/><circle cx="40" cy="40" r="2.5" fill="white"/><path d="M40,18 L40,24 M40,56 L40,62 M18,40 L24,40 M56,40 L62,40" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.6"/></svg>`,
g3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#7c2d12"/></linearGradient><filter id="f_g3"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3d1000" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_g3)" filter="url(#f_g3)"/><circle cx="40" cy="40" r="22" fill="none" stroke="white" stroke-width="1.5" opacity="0.4"/><circle cx="40" cy="40" r="14" fill="none" stroke="white" stroke-width="1.5" opacity="0.6"/><circle cx="40" cy="40" r="6" fill="none" stroke="white" stroke-width="2"/><circle cx="40" cy="40" r="2" fill="white"/><path d="M40,16 L40,20 M40,60 L40,64 M16,40 L20,40 M60,40 L64,40" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/></svg>`,
g7:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#a16207"/></linearGradient><filter id="f_g7"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0a00" flood-opacity="0.7"/></filter></defs><path d="M40,6 L70,16 L70,44 C70,60 56,72 40,76 C24,72 10,60 10,44 L10,16Z" fill="url(#g_g7)" filter="url(#f_g7)"/><circle cx="40" cy="38" r="20" fill="none" stroke="white" stroke-width="1.5" opacity="0.4"/><circle cx="40" cy="38" r="12" fill="none" stroke="white" stroke-width="1.5" opacity="0.6"/><circle cx="40" cy="38" r="5" fill="none" stroke="white" stroke-width="2"/><circle cx="40" cy="38" r="2" fill="white"/></svg>`,
g30:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_g30" cx="40%" cy="30%"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#064e3b"/></radialGradient><filter id="f_g30"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#001c12" flood-opacity="0.8"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_g30)" filter="url(#f_g30)"/><circle cx="40" cy="42" r="18" fill="none" stroke="white" stroke-width="1.5" opacity="0.4"/><circle cx="40" cy="42" r="10" fill="none" stroke="white" stroke-width="1.5" opacity="0.6"/><circle cx="40" cy="42" r="4" fill="white" opacity="0.9"/><path d="M40,22 L40,26 M40,58 L40,62 M22,42 L26,42 M54,42 L58,42" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/></svg>`,
// İsabet
a70:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_a70" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#14532d"/></linearGradient><filter id="f_a70"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#052e16" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_a70)" filter="url(#f_a70)"/><path d="M16,44 L30,58 L64,22" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="40" y="72" text-anchor="middle" font-size="0" fill="white"/><!-- 70 görsel olarak checkmark --></svg>`,
a80:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_a80" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#166534"/></linearGradient><filter id="f_a80"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#14532d" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_a80)" filter="url(#f_a80)"/><path d="M16,44 L30,58 L64,22" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="52" cy="22" r="6" fill="white" opacity="0.3"/></svg>`,
a80x7:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_a80x7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#34d399"/><stop offset="50%" stop-color="#059669"/><stop offset="100%" stop-color="#064e3b"/></linearGradient><filter id="f_a80x7"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001c12" flood-opacity="0.7"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_a80x7)" filter="url(#f_a80x7)"/><path d="M18,44 L30,56 L62,22" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M16,56 H64" stroke="white" stroke-width="1" opacity="0.3"/><text x="40" y="70" text-anchor="middle" font-size="8" fill="white" opacity="0.7" font-family="system-ui">×7 GÜN</text></svg>`,
a95:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_a95" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="30%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#075985"/></linearGradient><filter id="f_a95"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#001a35" flood-opacity="0.8"/></filter></defs><polygon points="40,8 68,34 40,72 12,34" fill="url(#g_a95)" filter="url(#f_a95)"/><polygon points="40,8 68,34 40,72 12,34" fill="none" stroke="#7dd3fc" stroke-width="1.5" opacity="0.5"/><text x="40" y="38" text-anchor="middle" font-size="14" font-weight="900" fill="white" font-family="system-ui">%95</text></svg>`,
// Süre
t300:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_t300" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c084fc"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient><filter id="f_t300"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1e0050" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_t300)" filter="url(#f_t300)"/><circle cx="40" cy="42" r="20" fill="none" stroke="white" stroke-width="2" opacity="0.7"/><path d="M40,24 L40,42 L52,42" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M36,18 H44" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.6"/><text x="40" y="72" text-anchor="middle" font-size="0" fill="white"/></svg>`,
t500:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_t500" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f0abfc"/><stop offset="50%" stop-color="#9333ea"/><stop offset="100%" stop-color="#3b0764"/></linearGradient><filter id="f_t500"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0a0020" flood-opacity="0.8"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_t500)" filter="url(#f_t500)"/><circle cx="40" cy="42" r="22" fill="none" stroke="white" stroke-width="2" opacity="0.6"/><path d="M40,22 L40,42 L55,42" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M35,16 H45" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.5"/></svg>`,
// Çeşitlilik
allsub:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_allsub" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fcd34d"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#7c2d12"/></linearGradient><filter id="f_allsub"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0700" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_allsub)" filter="url(#f_allsub)"/><text x="22" y="32" font-size="9" fill="white" font-family="system-ui" font-weight="700">TÜR</text><text x="22" y="46" font-size="9" fill="white" font-family="system-ui" font-weight="700">MAT</text><text x="22" y="60" font-size="9" fill="white" font-family="system-ui" font-weight="700">FEN</text><text x="50" y="32" font-size="9" fill="white" font-family="system-ui" font-weight="700">İNK</text><text x="50" y="46" font-size="9" fill="white" font-family="system-ui" font-weight="700">DİN</text><text x="50" y="60" font-size="9" fill="white" font-family="system-ui" font-weight="700">İNG</text></svg>`,
week5:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_week5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#67e8f9"/><stop offset="100%" stop-color="#0e7490"/></linearGradient><filter id="f_week5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001a24" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_week5)" filter="url(#f_week5)"/><rect x="16" y="18" width="48" height="44" rx="4" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/><path d="M16" y1="28" x2="64" y2="28" stroke="white" stroke-width="1.5" opacity="0.4"/><path d="M16,28 H64" stroke="white" stroke-width="1.5" opacity="0.4"/><rect x="22" y="34" width="8" height="8" rx="2" fill="white" opacity="0.8"/><rect x="36" y="34" width="8" height="8" rx="2" fill="white" opacity="0.8"/><rect x="50" y="34" width="8" height="8" rx="2" fill="white" opacity="0.8"/><rect x="22" y="46" width="8" height="8" rx="2" fill="white" opacity="0.8"/><rect x="36" y="46" width="8" height="8" rx="2" fill="white" opacity="0.8"/></svg>`,
month20:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_m20" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#14532d"/></linearGradient><filter id="f_m20"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#052e16" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_m20)" filter="url(#f_m20)"/><rect x="16" y="18" width="48" height="44" rx="4" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/><path d="M16,28 H64" stroke="white" stroke-width="1.5" opacity="0.4"/><text x="40" y="52" text-anchor="middle" font-size="20" font-weight="900" fill="white" font-family="system-ui">20</text><text x="40" y="64" text-anchor="middle" font-size="8" fill="white" opacity="0.7" font-family="system-ui">GÜN</text></svg>`,
// === BRANŞ ===
tur1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_tur1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#7c2d12"/></linearGradient><filter id="f_tur1"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#2d0a00" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_tur1)" filter="url(#f_tur1)"/><path d="M20,24 L40,20 L40,58 L20,54Z" fill="white" opacity="0.9"/><path d="M60,24 L40,20 L40,58 L60,54Z" fill="white" opacity="0.75"/><line x1="40" y1="20" x2="40" y2="58" stroke="#fb923c" stroke-width="2" opacity="0.8"/><path d="M23,32 H36 M23,38 H34 M23,44 H36 M23,50 H31" stroke="#fb923c" stroke-width="1.5" stroke-linecap="round"/></svg>`,
tur2:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_tur2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fdba74"/><stop offset="100%" stop-color="#9a3412"/></linearGradient><filter id="f_tur2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3d1000" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_tur2)" filter="url(#f_tur2)"/><path d="M20,30 Q20,20 32,20 L48,20 Q60,20 60,30 L60,48 Q50,52 40,58 Q30,52 20,48Z" fill="white" opacity="0.15"/><path d="M24,36 H40 M24,44 H36 M24,52 H40 M46,28 L50,56 M54,28 L58,56" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.85"/></svg>`,
tur3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_tur3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fed7aa"/><stop offset="50%" stop-color="#ea580c"/><stop offset="100%" stop-color="#7c2d12"/></linearGradient><filter id="f_tur3"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#3d1000" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_tur3)" filter="url(#f_tur3)"/><path d="M24,28 H56 M28,36 H52 M24,44 H56 M28,52 H52 M30,60 H50" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.8"/></svg>`,
tur4:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_tur4" cx="40%" cy="30%"><stop offset="0%" stop-color="#fed7aa"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#431407"/></radialGradient><filter id="f_tur4"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1c0700" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_tur4)" filter="url(#f_tur4)"/><path d="M30,36 H50 M26,44 H54 M30,52 H50" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.85"/></svg>`,
mat1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_mat1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#14532d"/></linearGradient><filter id="f_mat1"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#052e16" flood-opacity="0.7"/></filter></defs><rect x="8" y="16" width="64" height="50" rx="4" fill="url(#g_mat1)" filter="url(#f_mat1)"/><rect x="8" y="60" width="64" height="6" rx="2" fill="#15803d"/><rect x="28" y="66" width="8" height="10" rx="2" fill="#15803d"/><rect x="44" y="66" width="8" height="10" rx="2" fill="#15803d"/><text x="24" y="34" font-size="11" font-weight="700" fill="white" font-family="monospace">x²+y²</text><text x="20" y="48" font-size="10" font-weight="700" fill="white" font-family="monospace">=r²</text><text x="44" y="55" font-size="9" fill="white" opacity="0.7" font-family="monospace">∑π</text></svg>`,
mat2:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_mat2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#065f46"/></linearGradient><filter id="f_mat2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#022c22" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_mat2)" filter="url(#f_mat2)"/><path d="M20,40 H60 M40,20 V60" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.5"/><text x="40" y="35" text-anchor="middle" font-size="11" font-weight="900" fill="white" font-family="monospace">f(x)</text><text x="40" y="52" text-anchor="middle" font-size="10" fill="white" opacity="0.7" font-family="monospace">∫dx</text></svg>`,
mat3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_mat3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="50%" stop-color="#10b981"/><stop offset="100%" stop-color="#064e3b"/></linearGradient><filter id="f_mat3"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#022c22" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_mat3)" filter="url(#f_mat3)"/><text x="40" y="38" text-anchor="middle" font-size="14" font-weight="900" fill="white" font-family="monospace">∞</text><text x="40" y="55" text-anchor="middle" font-size="9" fill="white" opacity="0.7" font-family="monospace">∑∫π</text></svg>`,
mat4:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_mat4" cx="40%" cy="30%"><stop offset="0%" stop-color="#d1fae5"/><stop offset="50%" stop-color="#059669"/><stop offset="100%" stop-color="#022c22"/></radialGradient><filter id="f_mat4"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#001a0f" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_mat4)" filter="url(#f_mat4)"/><text x="40" y="44" text-anchor="middle" font-size="18" font-weight="900" fill="white" font-family="monospace">∞</text></svg>`,
fen1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_fen1" cx="50%" cy="40%"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#1e1b4b"/></radialGradient><filter id="f_fen1"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000020" flood-opacity="0.8"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_fen1)" filter="url(#f_fen1)"/><ellipse cx="40" cy="40" rx="28" ry="11" fill="none" stroke="white" stroke-width="1.5" opacity="0.6"/><ellipse cx="40" cy="40" rx="28" ry="11" fill="none" stroke="white" stroke-width="1.5" opacity="0.6" transform="rotate(60 40 40)"/><ellipse cx="40" cy="40" rx="28" ry="11" fill="none" stroke="white" stroke-width="1.5" opacity="0.6" transform="rotate(-60 40 40)"/><circle cx="40" cy="40" r="5" fill="white" opacity="0.9"/><circle cx="66" cy="37" r="2.5" fill="#a5f3fc"/><circle cx="23" cy="23" r="2.5" fill="#a5f3fc"/><circle cx="23" cy="57" r="2.5" fill="#a5f3fc"/></svg>`,
fen2:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_fen2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a5b4fc"/><stop offset="100%" stop-color="#3730a3"/></linearGradient><filter id="f_fen2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1e1b4b" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_fen2)" filter="url(#f_fen2)"/><circle cx="40" cy="36" r="14" fill="none" stroke="white" stroke-width="2" opacity="0.6"/><circle cx="40" cy="36" r="5" fill="white" opacity="0.9"/><path d="M40,22 V16 M54,36 H60 M40,50 V56 M26,36 H20" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.6"/></svg>`,
fen3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_fen3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="50%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient><filter id="f_fen3"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0a001c" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_fen3)" filter="url(#f_fen3)"/><path d="M28,30 L28,55 M28,55 Q28,62 36,62 L52,62" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="36" cy="26" r="5" fill="none" stroke="white" stroke-width="2"/><path d="M36,20 L40,26 L32,26Z" fill="white" opacity="0.7"/></svg>`,
fen4:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_fen4" cx="40%" cy="30%"><stop offset="0%" stop-color="#ddd6fe"/><stop offset="50%" stop-color="#6d28d9"/><stop offset="100%" stop-color="#0a001c"/></radialGradient><filter id="f_fen4"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0a001c" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_fen4)" filter="url(#f_fen4)"/><ellipse cx="40" cy="40" rx="16" ry="8" fill="none" stroke="white" stroke-width="1.5" opacity="0.5" transform="rotate(30 40 40)"/><ellipse cx="40" cy="40" rx="16" ry="8" fill="none" stroke="white" stroke-width="1.5" opacity="0.5" transform="rotate(-30 40 40)"/><circle cx="40" cy="40" r="4" fill="white"/></svg>`,
ink1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ink1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#78350f"/></linearGradient><filter id="f_ink1"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0700" flood-opacity="0.7"/></filter></defs><path d="M40,8 L68,18 L68,44 C68,58 55,70 40,74 C25,70 12,58 12,44 L12,18Z" fill="url(#g_ink1)" filter="url(#f_ink1)"/><line x1="28" y1="52" x2="28" y2="24" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M28,24 L52,30 L28,36Z" fill="white" opacity="0.9"/></svg>`,
ink2:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ink2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#92400e"/></linearGradient><filter id="f_ink2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0700" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_ink2)" filter="url(#f_ink2)"/><line x1="32" y1="60" x2="32" y2="22" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M32,22 L58,30 L32,38Z" fill="white" opacity="0.9"/><circle cx="58" cy="30" r="3" fill="white" opacity="0.6"/></svg>`,
ink3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ink3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef3c7"/><stop offset="50%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/></linearGradient><filter id="f_ink3"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1c0700" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_ink3)" filter="url(#f_ink3)"/><line x1="28" y1="62" x2="28" y2="20" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M28,20 L54,28 L28,36Z" fill="white" opacity="0.9"/><line x1="34" y1="46" x2="54" y2="46" stroke="white" stroke-width="1.5" opacity="0.5"/></svg>`,
ink4:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_ink4" cx="40%" cy="30%"><stop offset="0%" stop-color="#fef9c3"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#431407"/></radialGradient><filter id="f_ink4"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1c0700" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_ink4)" filter="url(#f_ink4)"/><line x1="30" y1="58" x2="30" y2="24" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M30,24 L56,32 L30,40Z" fill="white" opacity="0.9"/></svg>`,
din1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_din1" cx="40%" cy="30%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#065f46"/></radialGradient><filter id="f_din1"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#021c12" flood-opacity="0.8"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_din1)" filter="url(#f_din1)"/><path d="M34,20 A20,20 0 1,1 34,60 A14,14 0 1,0 34,20Z" fill="white" opacity="0.9"/><polygon points="56,26 57.5,31 63,31 58.5,34.5 60,40 56,36.5 52,40 53.5,34.5 49,31 54.5,31" fill="white" opacity="0.9"/></svg>`,
din2:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_din2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#047857"/></linearGradient><filter id="f_din2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#022c22" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_din2)" filter="url(#f_din2)"/><path d="M34,20 A18,18 0 1,1 34,56 A12,12 0 1,0 34,20Z" fill="white" opacity="0.9"/><polygon points="54,24 55.5,29 61,29 56.5,32 58,38 54,34.5 50,38 51.5,32 47,29 52.5,29" fill="white" opacity="0.85"/></svg>`,
din3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_din3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="50%" stop-color="#10b981"/><stop offset="100%" stop-color="#064e3b"/></linearGradient><filter id="f_din3"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#022c22" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_din3)" filter="url(#f_din3)"/><path d="M30,22 A16,16 0 1,1 30,56 A11,11 0 1,0 30,22Z" fill="white" opacity="0.9"/><polygon points="52,22 53.5,27 59,27 54.5,30 56,36 52,32.5 48,36 49.5,30 45,27 50.5,27" fill="white" opacity="0.9"/></svg>`,
din4:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_din4" cx="40%" cy="30%"><stop offset="0%" stop-color="#d1fae5"/><stop offset="50%" stop-color="#059669"/><stop offset="100%" stop-color="#022c22"/></radialGradient><filter id="f_din4"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#001a0f" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_din4)" filter="url(#f_din4)"/><path d="M28,24 A14,14 0 1,1 28,52 A10,10 0 1,0 28,24Z" fill="white" opacity="0.9"/><polygon points="50,20 51,25 56,25 52,28 53.5,33 50,30 46.5,33 48,28 44,25 49,25" fill="white"/></svg>`,
ing1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ing1" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0c4a6e"/></linearGradient><filter id="f_ing1"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#001624" flood-opacity="0.8"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_ing1)" filter="url(#f_ing1)"/><path d="M14,32 Q22,28 28,34 Q26,44 20,46 Q12,44 14,32Z" fill="white" opacity="0.7"/><path d="M34,16 Q44,14 48,22 Q52,30 44,36 Q38,38 32,32 Q28,24 34,16Z" fill="white" opacity="0.7"/><path d="M52,38 Q62,36 66,46 Q64,56 54,56 Q46,58 44,50 Q44,40 52,38Z" fill="white" opacity="0.7"/><circle cx="40" cy="40" r="34" fill="none" stroke="white" stroke-width="1" opacity="0.3"/></svg>`,
ing2:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ing2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#075985"/></linearGradient><filter id="f_ing2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001624" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_ing2)" filter="url(#f_ing2)"/><path d="M20,32 Q20,24 28,24 L52,24 Q60,24 60,32 L60,48 Q60,56 52,56 L28,56 Q20,56 20,48Z" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/><text x="40" y="38" text-anchor="middle" font-size="9" fill="white" font-family="system-ui" font-weight="700">Hello</text><text x="40" y="52" text-anchor="middle" font-size="9" fill="white" font-family="system-ui" opacity="0.7">World!</text></svg>`,
ing3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ing3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#bae6fd"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0c4a6e"/></linearGradient><filter id="f_ing3"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#001624" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_ing3)" filter="url(#f_ing3)"/><ellipse cx="40" cy="40" rx="20" ry="28" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/><path d="M40,12 L40,68" stroke="white" stroke-width="1.5" opacity="0.4"/><ellipse cx="40" cy="40" rx="34" ry="14" fill="none" stroke="white" stroke-width="1" opacity="0.3"/></svg>`,
ing4:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_ing4" cx="40%" cy="30%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="50%" stop-color="#0369a1"/><stop offset="100%" stop-color="#001624"/></radialGradient><filter id="f_ing4"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#001624" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_ing4)" filter="url(#f_ing4)"/><ellipse cx="40" cy="42" rx="18" ry="24" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/><path d="M40,18 L40,66" stroke="white" stroke-width="1.5" opacity="0.4"/><ellipse cx="40" cy="42" rx="30" ry="12" fill="none" stroke="white" stroke-width="1" opacity="0.3"/></svg>`,
allA:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_allA" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#7c2d12"/></linearGradient><filter id="f_allA"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1c0700" flood-opacity="0.8"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_allA)" filter="url(#f_allA)"/><text x="16" y="30" font-size="8" fill="white" font-family="system-ui" font-weight="700">TÜR ✓</text><text x="16" y="42" font-size="8" fill="white" font-family="system-ui" font-weight="700">MAT ✓</text><text x="16" y="54" font-size="8" fill="white" font-family="system-ui" font-weight="700">FEN ✓</text><text x="44" y="30" font-size="8" fill="white" font-family="system-ui" font-weight="700">İNK ✓</text><text x="44" y="42" font-size="8" fill="white" font-family="system-ui" font-weight="700">DİN ✓</text><text x="44" y="54" font-size="8" fill="white" font-family="system-ui" font-weight="700">İNG ✓</text></svg>`,
allS:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_allS" cx="40%" cy="30%"><stop offset="0%" stop-color="#fef9c3"/><stop offset="40%" stop-color="#eab308"/><stop offset="100%" stop-color="#431407"/></radialGradient><filter id="f_allS"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1c0a00" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_allS)" filter="url(#f_allS)"/><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="none" stroke="#fef08a" stroke-width="1.5" opacity="0.5"/><text x="40" y="44" text-anchor="middle" font-size="8" font-weight="900" fill="white" font-family="system-ui">6/6 ⭐</text></svg>`,
topBrans:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_topB" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#fde047"/></linearGradient><filter id="f_topB"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0700" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_topB)" filter="url(#f_topB)"/><path d="M20,52 L20,36 L27,28 L34,36 L40,22 L46,36 L53,28 L60,36 L60,52Z" fill="white" opacity="0.9"/><text x="40" y="66" text-anchor="middle" font-size="8" fill="white" opacity="0.7" font-family="system-ui">%90+</text></svg>`,
balBrans:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_balB" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#065f46"/></linearGradient><filter id="f_balB"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#022c22" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_balB)" filter="url(#f_balB)"/><line x1="20" y1="40" x2="60" y2="40" stroke="white" stroke-width="2" opacity="0.4"/><circle cx="30" cy="30" r="5" fill="white" opacity="0.8"/><circle cx="40" cy="26" r="5" fill="white" opacity="0.8"/><circle cx="50" cy="30" r="5" fill="white" opacity="0.8"/><path d="M24,40 L30,30 M36,40 L40,26 M44,40 L50,30" stroke="white" stroke-width="1.5" opacity="0.5"/></svg>`,
// === PSİKOLOJİ ===
w1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_w1" cx="40%" cy="35%"><stop offset="0%" stop-color="#f9a8d4"/><stop offset="100%" stop-color="#9d174d"/></radialGradient><filter id="f_w1"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3d0020" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="20" fill="url(#g_w1)" filter="url(#f_w1)"/><path d="M40,58 C38,56 14,44 14,30 C14,20 21,14 28,14 C33,14 38,18 40,22 C42,18 47,14 52,14 C59,14 66,20 66,30 C66,44 42,56 40,58Z" fill="white" opacity="0.9"/></svg>`,
w7:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_w7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fda4af"/><stop offset="100%" stop-color="#be123c"/></linearGradient><filter id="f_w7"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#4c0519" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_w7)" filter="url(#f_w7)"/><path d="M40,56 C38,54 16,43 16,30 C16,21 22,15 30,15 C35,15 39,19 40,22 C41,19 45,15 50,15 C58,15 64,21 64,30 C64,43 42,54 40,56Z" fill="white" opacity="0.9"/><text x="40" y="68" text-anchor="middle" font-size="8" fill="white" opacity="0.7" font-family="system-ui">7 GÜN</text></svg>`,
w14:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_w14" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fecdd3"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#4c0519"/></linearGradient><filter id="f_w14"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#4c0519" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_w14)" filter="url(#f_w14)"/><path d="M40,54 C38,52 18,42 18,30 C18,22 23,17 30,17 C35,17 39,21 40,24 C41,21 45,17 50,17 C57,17 62,22 62,30 C62,42 42,52 40,54Z" fill="white" opacity="0.9"/></svg>`,
w30:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_w30" cx="40%" cy="30%"><stop offset="0%" stop-color="#fce7f3"/><stop offset="40%" stop-color="#ec4899"/><stop offset="100%" stop-color="#500724"/></radialGradient><filter id="f_w30"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1a0010" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_w30)" filter="url(#f_w30)"/><path d="M40,52 C38,50 20,41 20,30 C20,23 25,18 32,18 C36,18 40,22 40,24 C40,22 44,18 48,18 C55,18 60,23 60,30 C60,41 42,50 40,52Z" fill="white" opacity="0.9"/></svg>`,
mood5:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_mood5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#a16207"/></linearGradient><filter id="f_mood5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0a00" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_mood5)" filter="url(#f_mood5)"/><circle cx="30" cy="35" r="4" fill="white" opacity="0.9"/><circle cx="50" cy="35" r="4" fill="white" opacity="0.9"/><path d="M24,50 Q32,60 40,60 Q48,60 56,50" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
mood10:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_mood10" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#eab308"/><stop offset="100%" stop-color="#713f12"/></linearGradient><filter id="f_mood10"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1c0a00" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_mood10)" filter="url(#f_mood10)"/><circle cx="30" cy="35" r="4" fill="white" opacity="0.9"/><circle cx="50" cy="35" r="4" fill="white" opacity="0.9"/><path d="M22,52 Q31,64 40,64 Q49,64 58,52" stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`,
calm:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_calm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a5f3fc"/><stop offset="100%" stop-color="#0e7490"/></linearGradient><filter id="f_calm"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001a24" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_calm)" filter="url(#f_calm)"/><path d="M16,48 Q25,32 34,40 Q43,48 52,32 Q61,16 70,32" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M16,56 Q25,44 34,50 Q43,56 52,44 Q61,32 70,44" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/></svg>`,
calm3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_calm3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#67e8f9"/><stop offset="100%" stop-color="#0c4a6e"/></linearGradient><filter id="f_calm3"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001a35" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_calm3)" filter="url(#f_calm3)"/><path d="M14,40 Q23,26 32,34 Q41,42 50,26 Q59,10 68,26" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M14,50 Q23,38 32,44 Q41,50 50,38 Q59,26 68,38" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/><text x="40" y="66" text-anchor="middle" font-size="8" fill="white" opacity="0.7" font-family="system-ui">×3 HAFTA</text></svg>`,
brave:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_brave" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient><filter id="f_brave"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1c0000" flood-opacity="0.8"/></filter></defs><path d="M40,6 L70,16 L70,44 C70,60 56,72 40,76 C24,72 10,60 10,44 L10,16Z" fill="url(#g_brave)" filter="url(#f_brave)"/><path d="M48,18 L34,42 H45 L32,62 L54,36 H42Z" fill="white" opacity="0.95"/></svg>`,
brave3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_brave3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#dc2626"/><stop offset="100%" stop-color="#450a0a"/></linearGradient><filter id="f_brave3"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1c0000" flood-opacity="0.8"/></filter></defs><path d="M40,6 L70,16 L70,44 C70,60 56,72 40,76 C24,72 10,60 10,44 L10,16Z" fill="url(#g_brave3)" filter="url(#f_brave3)"/><path d="M47,16 L31,42 H44 L28,64 L56,34 H42Z" fill="white" opacity="0.95"/><circle cx="47" cy="16" r="4" fill="white" opacity="0.7"/></svg>`,
bounce:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_bounce" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#312e81"/></linearGradient><filter id="f_bounce"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1e1b4b" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_bounce)" filter="url(#f_bounce)"/><path d="M16,60 L30,30 L40,48 L50,22 L64,50" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M46,22 L54,22 L54,30" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
bounce3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_bounce3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#a5b4fc"/><stop offset="50%" stop-color="#6d28d9"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient><filter id="f_bounce3"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1e1b4b" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_bounce3)" filter="url(#f_bounce3)"/><path d="M14,58 L24,28 L32,46 L42,18 L50,38 L60,20 L66,38" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
sleep7:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_sl7" cx="40%" cy="30%"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#1e0050"/></radialGradient><filter id="f_sl7"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0a0020" flood-opacity="0.8"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_sl7)" filter="url(#f_sl7)"/><circle cx="20" cy="20" r="1.5" fill="white" opacity="0.7"/><circle cx="58" cy="18" r="2" fill="white" opacity="0.6"/><circle cx="62" cy="54" r="1.5" fill="white" opacity="0.5"/><path d="M30,24 A18,18 0 1,1 30,58 A12,12 0 1,0 30,24Z" fill="white" opacity="0.9"/><text x="54" y="36" font-size="10" font-weight="900" fill="white" opacity="0.7" font-family="system-ui">Z</text><text x="58" y="46" font-size="8" fill="white" opacity="0.5" font-family="system-ui">z</text></svg>`,
sleep14:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_sl14" cx="40%" cy="30%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="50%" stop-color="#6d28d9"/><stop offset="100%" stop-color="#0a001c"/></radialGradient><filter id="f_sl14"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0a001c" flood-opacity="0.8"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_sl14)" filter="url(#f_sl14)"/><circle cx="20" cy="20" r="1.5" fill="white" opacity="0.6"/><circle cx="60" cy="16" r="2" fill="white" opacity="0.5"/><path d="M28,22 A16,16 0 1,1 28,54 A11,11 0 1,0 28,22Z" fill="white" opacity="0.9"/><text x="54" y="34" font-size="10" font-weight="900" fill="white" opacity="0.7" font-family="system-ui">Z</text><text x="58" y="44" font-size="8" fill="white" opacity="0.5" font-family="system-ui">z</text><text x="61" y="52" font-size="6" fill="white" opacity="0.3" font-family="system-ui">z</text></svg>`,
water7:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_wt7" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#0369a1"/></linearGradient><filter id="f_wt7"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001a35" flood-opacity="0.8"/></filter></defs><path d="M40,8 Q52,22 56,36 A16,16 0 0,1 24,36 Q28,22 40,8Z" fill="url(#g_wt7)" filter="url(#f_wt7)" transform="scale(1.3) translate(-9,-5)"/><path d="M35,44 A6,4 0 0,0 46,44" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/></svg>`,
energy5:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_en5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#b45309"/></linearGradient><filter id="f_en5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0700" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_en5)" filter="url(#f_en5)"/><path d="M50,12 L30,44 H46 L30,68 L58,36 H42Z" fill="white" opacity="0.95"/></svg>`,
diary10:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_d10" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fda4af"/><stop offset="100%" stop-color="#9f1239"/></linearGradient><filter id="f_d10"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#4c0519" flood-opacity="0.7"/></filter></defs><rect x="14" y="8" width="52" height="64" rx="6" fill="url(#g_d10)" filter="url(#f_d10)"/><rect x="14" y="8" width="8" height="64" rx="6" fill="#be123c"/><path d="M30,24 H58 M30,34 H58 M30,44 H50 M30,54 H58" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M22,30 A2,2 0 1,0 22,26" stroke="white" stroke-width="1.5" fill="none"/></svg>`,
diary30:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_d30b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fecdd3"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#500724"/></linearGradient><filter id="f_d30b"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1a0010" flood-opacity="0.8"/></filter></defs><rect x="12" y="8" width="56" height="64" rx="6" fill="url(#g_d30b)" filter="url(#f_d30b)"/><rect x="12" y="8" width="10" height="64" rx="6" fill="#be123c"/><path d="M30,22 H58 M30,32 H58 M30,42 H50 M30,52 H58 M30,62 H48" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
open20:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_op20" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e9d5ff"/><stop offset="50%" stop-color="#9333ea"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient><filter id="f_op20"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0a001c" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_op20)" filter="url(#f_op20)"/><path d="M16,40 Q24,28 32,36 Q40,44 48,28 Q56,12 64,28" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.9"/><path d="M16,52 Q24,44 32,48 Q40,52 48,40 Q56,28 64,40" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/></svg>`,
nodig:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_nd" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><filter id="f_nd"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_nd)" filter="url(#f_nd)"/><rect x="28" y="18" width="24" height="42" rx="4" fill="white" opacity="0.85"/><rect x="31" y="22" width="18" height="30" rx="2" fill="#0f172a" opacity="0.8"/><circle cx="40" cy="56" r="2.5" fill="#0f172a" opacity="0.9"/><line x1="14" y1="14" x2="66" y2="66" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/><line x1="14" y1="14" x2="66" y2="66" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.5"/></svg>`,
nodig5:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_nd5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#1e293b"/></linearGradient><filter id="f_nd5"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_nd5)" filter="url(#f_nd5)"/><rect x="28" y="18" width="24" height="40" rx="4" fill="white" opacity="0.85"/><rect x="31" y="22" width="18" height="28" rx="2" fill="#1e293b" opacity="0.8"/><line x1="16" y1="14" x2="64" y2="62" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/><line x1="16" y1="14" x2="64" y2="62" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.5"/></svg>`,
screen:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_scr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#67e8f9"/><stop offset="100%" stop-color="#0e7490"/></linearGradient><filter id="f_scr"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001a24" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_scr)" filter="url(#f_scr)"/><rect x="16" y="20" width="48" height="32" rx="3" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/><path d="M32,52 H48 M40,52 V60" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><path d="M26,30 L30,34 L38,26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
honest7:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_hn7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="50%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient><filter id="f_hn7"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0a001c" flood-opacity="0.8"/></filter></defs><ellipse cx="40" cy="36" rx="26" ry="30" fill="url(#g_hn7)" filter="url(#f_hn7)"/><ellipse cx="40" cy="36" rx="26" ry="30" fill="none" stroke="#c4b5fd" stroke-width="1.5" opacity="0.5"/><path d="M30,24 Q26,30 26,38 Q26,46 30,52" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.3"/><ellipse cx="34" cy="24" rx="4" ry="7" fill="white" opacity="0.15" transform="rotate(-20 34 24)"/><rect x="36" y="64" width="8" height="14" rx="3" fill="#7c3aed"/><rect x="34" y="64" width="12" height="4" rx="2" fill="#5b21b6"/></svg>`,
honest14:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_hn14" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ede9fe"/><stop offset="50%" stop-color="#6d28d9"/><stop offset="100%" stop-color="#0a001c"/></linearGradient><filter id="f_hn14"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0a001c" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_hn14)" filter="url(#f_hn14)"/><ellipse cx="40" cy="38" rx="20" ry="26" fill="none" stroke="#c4b5fd" stroke-width="1.5" opacity="0.5"/><path d="M32,26 Q28,32 28,40 Q28,48 32,54" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/><ellipse cx="35" cy="26" rx="4" ry="6" fill="white" opacity="0.15" transform="rotate(-20 35 26)"/><rect x="37" y="62" width="6" height="10" rx="2" fill="#7c3aed"/></svg>`,
full30:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_f30" cx="40%" cy="30%"><stop offset="0%" stop-color="#fce7f3"/><stop offset="40%" stop-color="#db2777"/><stop offset="100%" stop-color="#500724"/></radialGradient><filter id="f_f30"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1a0010" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_f30)" filter="url(#f_f30)"/><path d="M20,42 L32,54 L60,22" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
// === DENEME ===
exam1:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ex1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#064e3b"/></linearGradient><filter id="f_ex1"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001c12" flood-opacity="0.7"/></filter></defs><path d="M40,8 L66,22 L72,50 L56,70 L24,70 L8,50 L14,22Z" fill="url(#g_ex1)" filter="url(#f_ex1)"/><text x="40" y="48" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="system-ui">1</text><text x="40" y="62" text-anchor="middle" font-size="9" fill="white" opacity="0.7" font-family="system-ui">DENEME</text></svg>`,
exam3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ex3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#065f46"/></linearGradient><filter id="f_ex3"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001c12" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_ex3)" filter="url(#f_ex3)"/><text x="40" y="48" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="system-ui">3</text><text x="40" y="62" text-anchor="middle" font-size="9" fill="white" opacity="0.7" font-family="system-ui">DENEME</text></svg>`,
exam5:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ex5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#047857"/></linearGradient><filter id="f_ex5"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#022c22" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_ex5)" filter="url(#f_ex5)"/><text x="40" y="48" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="system-ui">5</text><text x="40" y="62" text-anchor="middle" font-size="9" fill="white" opacity="0.7" font-family="system-ui">DENEME</text></svg>`,
exam10:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ex10" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#a16207"/></linearGradient><filter id="f_ex10"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0a00" flood-opacity="0.7"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_ex10)" filter="url(#f_ex10)"/><text x="40" y="46" text-anchor="middle" font-size="24" font-weight="900" fill="white" font-family="system-ui">10</text><text x="40" y="62" text-anchor="middle" font-size="9" fill="white" opacity="0.7" font-family="system-ui">DENEME</text></svg>`,
exam20:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_ex20" cx="40%" cy="30%"><stop offset="0%" stop-color="#fef9c3"/><stop offset="40%" stop-color="#eab308"/><stop offset="100%" stop-color="#1c0a00"/></radialGradient><filter id="f_ex20"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1c0a00" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_ex20)" filter="url(#f_ex20)"/><text x="40" y="46" text-anchor="middle" font-size="22" font-weight="900" fill="white" font-family="system-ui">20</text></svg>`,
exup3:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_exup3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#fde047"/></linearGradient><filter id="f_exup3"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0700" flood-opacity="0.7"/></filter></defs><path d="M20,14 H60 V46 C60,58 51,65 40,68 C29,65 20,58 20,46Z" fill="url(#g_exup3)" filter="url(#f_exup3)"/><path d="M20,18 H8 C8,18 5,34 20,40" fill="none" stroke="#fde047" stroke-width="2" stroke-linecap="round"/><path d="M60,18 H72 C72,18 75,34 60,40" fill="none" stroke="#fde047" stroke-width="2" stroke-linecap="round"/><rect x="32" y="68" width="16" height="8" rx="2" fill="#f97316"/><path d="M26,50 L34,38 L40,44 L52,28" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M48,28 L56,28 L56,36" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
exup5:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_exup5" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#fb923c"/><stop offset="50%" stop-color="#fde047"/><stop offset="100%" stop-color="#fef9c3"/></linearGradient><filter id="f_exup5"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1c0700" flood-opacity="0.8"/></filter></defs><path d="M40,6 L66,21 L66,59 L40,74 L14,59 L14,21Z" fill="url(#g_exup5)" filter="url(#f_exup5)"/><path d="M20,56 L32,36 L40,46 L52,24 L60,36" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M56,24 L64,24 L64,32" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
expeak:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_peak" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#1e40af"/></linearGradient><filter id="f_peak"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0a1f5c" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_peak)" filter="url(#f_peak)"/><path d="M12,60 L26,34 L40,50 L54,20 L68,42" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="54" cy="20" r="5" fill="white" opacity="0.9"/><path d="M50,20 L58,20 L58,28" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
ex350:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ex350" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#064e3b"/></linearGradient><filter id="f_ex350"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#001c12" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_ex350)" filter="url(#f_ex350)"/><text x="40" y="44" text-anchor="middle" font-size="18" font-weight="900" fill="white" font-family="system-ui">350</text><text x="40" y="60" text-anchor="middle" font-size="10" fill="white" opacity="0.7" font-family="system-ui">PUAN+</text></svg>`,
ex400:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ex400" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#a16207"/></linearGradient><filter id="f_ex400"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0a00" flood-opacity="0.7"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_ex400)" filter="url(#f_ex400)"/><text x="40" y="44" text-anchor="middle" font-size="18" font-weight="900" fill="white" font-family="system-ui">400</text><text x="40" y="60" text-anchor="middle" font-size="10" fill="white" opacity="0.7" font-family="system-ui">PUAN+</text></svg>`,
ex425:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ex425" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde68a"/><stop offset="50%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/></linearGradient><filter id="f_ex425"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1c0700" flood-opacity="0.8"/></filter></defs><path d="M40,8 L68,18 L68,44 C68,60 55,70 40,74 C25,70 12,60 12,44 L12,18Z" fill="url(#g_ex425)" filter="url(#f_ex425)"/><text x="40" y="44" text-anchor="middle" font-size="18" font-weight="900" fill="white" font-family="system-ui">425</text><text x="40" y="60" text-anchor="middle" font-size="10" fill="white" opacity="0.7" font-family="system-ui">PUAN+</text></svg>`,
ex450:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g_ex450" cx="40%" cy="30%"><stop offset="0%" stop-color="#fef9c3"/><stop offset="30%" stop-color="#eab308"/><stop offset="100%" stop-color="#713f12"/></radialGradient><filter id="f_ex450"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1c0a00" flood-opacity="0.9"/></filter></defs><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="url(#g_ex450)" filter="url(#f_ex450)"/><polygon points="40,6 49,32 76,32 55,50 63,76 40,60 17,76 25,50 4,32 31,32" fill="none" stroke="#fef08a" stroke-width="1.5" opacity="0.5"/><text x="40" y="46" text-anchor="middle" font-size="12" font-weight="900" fill="white" font-family="system-ui">450+</text></svg>`,
ex80net:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_ex80" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#7c2d12"/></linearGradient><filter id="f_ex80"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1c0700" flood-opacity="0.7"/></filter></defs><rect x="8" y="8" width="64" height="64" rx="14" fill="url(#g_ex80)" filter="url(#f_ex80)"/><path d="M48,12 L30,44 H44 L28,68 L56,36 H42Z" fill="white" opacity="0.95"/><text x="62" y="18" text-anchor="middle" font-size="8" fill="white" font-family="system-ui" font-weight="700">80</text></svg>`,
exfull:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_exful" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="50%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient><filter id="f_exful"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0a001c" flood-opacity="0.8"/></filter></defs><path d="M40,8 L68,18 L68,44 C68,60 55,70 40,74 C25,70 12,60 12,44 L12,18Z" fill="url(#g_exful)" filter="url(#f_exful)"/><path d="M18,42 L30,54 L62,18" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
exmonth:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g_exm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e879f9"/><stop offset="50%" stop-color="#a21caf"/><stop offset="100%" stop-color="#3b0764"/></linearGradient><filter id="f_exm"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1a0025" flood-opacity="0.8"/></filter></defs><circle cx="40" cy="40" r="36" fill="url(#g_exm)" filter="url(#f_exm)"/><path d="M24,28 H56 V46 C56,54 48,60 40,62 C32,60 24,54 24,46Z" fill="white" opacity="0.9"/><path d="M24,30 H16 C16,30 14,40 24,44" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M56,30 H64 C64,30 66,40 56,44" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><rect x="34" y="62" width="12" height="7" rx="1.5" fill="white" opacity="0.8"/><path d="M26,28 L26,22 L32,26 L40,18 L48,26 L54,22 L54,28Z" fill="#fde047" opacity="0.95"/></svg>`,
};

// Rozet HTML döndür — her rozet benzersiz
function getBadgeHTML(badge, isLocked, size) {
  size = size || 52;
  const svg = BADGE_DEFS[badge.id];
  if (svg) {
    const s = svg.replace('<svg ', '<svg width="'+size+'" height="'+size+'" ');
    if (isLocked) {
      return '<div style="position:relative;display:inline-block;width:'+size+'px;height:'+size+'px">'
        +'<div style="filter:saturate(0);opacity:0.25">'+s+'</div>'
        +'<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">'
        +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round">'
        +'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
        +'</svg></div></div>';
    }
    return s;
  }
  // Fallback — tanımlanmamış rozet için minimal şablon
  const tc = {bronze:'#cd7f32',silver:'#9ca3af',gold:'#d97706',diamond:'#3b82f6',ruby:'#e11d48'}[badge.tier]||'#6c63ff';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">'
    +'<circle cx="40" cy="40" r="36" fill="'+tc+'" opacity="0.8"/>'
    +'<text x="40" y="46" text-anchor="middle" font-size="20" fill="white" font-family="system-ui">'+badge.sym+'</text>'
    +(isLocked?'<rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="#666" stroke-width="2.5" transform="translate(25,25)"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#666" stroke-width="2.5" fill="none" transform="translate(25,25)"/>':'')
    +'</svg>';
}

// SVG Rozet Üretici — saf SVG, emoji yok
function makeBadgeSVG(form, tier, sym, locked, size) {
  size = size || 72;
  const T = {
    bronze:  {c1:'#7a3e0a',c2:'#cd7f32',c3:'#f0a060',c4:'#3d1f05'},
    silver:  {c1:'#374151',c2:'#9ca3af',c3:'#e5e7eb',c4:'#1f2937'},
    gold:    {c1:'#78350f',c2:'#d97706',c3:'#fde68a',c4:'#451a03'},
    diamond: {c1:'#1e3a8a',c2:'#3b82f6',c3:'#bae6fd',c4:'#172554'},
    ruby:    {c1:'#6f0a28',c2:'#e11d48',c3:'#fda4af',c4:'#4c0519'},
  };
  const t = locked ? {c1:'#111',c2:'#2a2a3a',c3:'#3d3d52',c4:'#000'} : (T[tier]||T.bronze);
  const uid = 'b'+Math.random().toString(36).slice(2,7);

  // İç sembol çizimleri — tamamen SVG path
  const SYM = {
    // Akademik (kitap içi)
    'filiz':   `<path d="M12,22 Q12,8 20,4 Q16,10 16,22" fill="${t.c3}" opacity="0.8"/><path d="M12,22 Q12,10 4,6 Q8,12 8,22" fill="${t.c3}" opacity="0.6"/>`,
    'adim':    `<rect x="4" y="6" width="16" height="2" rx="1" fill="${t.c3}" opacity="0.7"/><rect x="4" y="11" width="12" height="2" rx="1" fill="${t.c3}" opacity="0.7"/><rect x="4" y="16" width="16" height="2" rx="1" fill="${t.c3}" opacity="0.7"/><rect x="4" y="21" width="10" height="2" rx="1" fill="${t.c3}" opacity="0.5"/>`,
    'caliskan':`<path d="M4,6 H20 V22 H4Z" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/><path d="M7,10 H17 M7,14 H15 M7,18 H17" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>`,
    'kosucu':  `<path d="M6,22 L12,6 L18,22" fill="none" stroke="${t.c3}" stroke-width="2" stroke-linejoin="round" opacity="0.85"/><line x1="8" y1="17" x2="16" y2="17" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/>`,
    'maraton': `<circle cx="12" cy="14" r="7" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/><circle cx="12" cy="14" r="3" fill="${t.c3}" opacity="0.8"/><path d="M12,7 V4 M17,10 L20,8 M19,14 H22 M17,18 L20,20" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>`,
    'firtina': `<path d="M18,6 L10,14 H15 L8,26" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>`,
    'efsane':  `<polygon points="12,4 14,10 20,10 15,14 17,20 12,16 7,20 9,14 4,10 10,10" fill="${t.c3}" opacity="0.85"/>`,
    'savasci': `<polygon points="12,3 13.5,9 20,9 15,13 17,20 12,16 7,20 9,13 4,9 10.5,9" fill="${t.c3}" opacity="0.85"/><polygon points="12,6 13,10 17,10 13.8,12.5 15,16.5 12,14.5 9,16.5 10.2,12.5 7,10 11,10" fill="${t.c2}" opacity="0.5"/>`,
    // Seri
    'd3':      `<path d="M6,20 L6,12 M12,20 L12,8 M18,20 L18,4" stroke="${t.c3}" stroke-width="3" stroke-linecap="round" opacity="0.85"/>`,
    'd7':      `<path d="M4,18 L8,10 L12,14 L16,6 L20,10" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85"/><circle cx="20" cy="10" r="2.5" fill="${t.c3}" opacity="0.9"/>`,
    'd14':     `<path d="M4,20 Q4,4 12,4 Q20,4 20,20" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/><line x1="8" y1="12" x2="16" y2="12" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.9"/>`,
    'd30':     `<circle cx="12" cy="12" r="8" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><path d="M12,4 L13.5,9 L19,9 L14.5,12.5 L16,18 L12,14.5 L8,18 L9.5,12.5 L5,9 L10.5,9Z" fill="${t.c3}" opacity="0.85"/>`,
    // Hedef
    'g1':      `<circle cx="12" cy="12" r="8" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.5"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/><circle cx="12" cy="12" r="1.5" fill="${t.c3}" opacity="0.95"/>`,
    'g7':      `<circle cx="12" cy="12" r="8" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/><circle cx="12" cy="12" r="2" fill="${t.c3}" opacity="0.9"/><path d="M20,4 L20,12 L12,12" stroke="${t.c3}" stroke-width="1.5" fill="none" opacity="0.7"/>`,
    'g30':     `<path d="M12,4 L12,20 M4,12 L20,12" stroke="${t.c3}" stroke-width="1.5" opacity="0.4"/><circle cx="12" cy="12" r="8" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.8"/><circle cx="12" cy="12" r="1.5" fill="${t.c3}" opacity="1"/>`,
    // İsabet
    'a70':     `<path d="M4,14 L9,19 L20,7" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85"/>`,
    'a80':     `<path d="M4,14 L9,19 L20,7" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/><circle cx="12" cy="6" r="2" fill="${t.c3}" opacity="0.7"/>`,
    'a80x7':   `<path d="M4,14 L9,19 L20,7" stroke="${t.c3}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/><path d="M6,20 L6,23 M11,21 L11,24 M16,20 L16,23" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>`,
    'a95':     `<path d="M3,13 L9,19 L21,6" stroke="${t.c3}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/><circle cx="12" cy="12" r="10" fill="none" stroke="${t.c3}" stroke-width="1" opacity="0.3"/>`,
    // Süre
    't300':    `<circle cx="12" cy="14" r="8" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/><path d="M12,8 L12,14 L17,14" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.9"/><path d="M9,5 L15,5" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>`,
    't500':    `<circle cx="12" cy="14" r="8" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/><path d="M12,7 L12,14 L16,17" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/><path d="M9,4 L15,4" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`,
    // Çeşit
    'allsub':  `<path d="M4,8 L20,8 L20,18 L4,18Z" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><path d="M8,4 L8,22 M12,4 L12,22 M16,4 L16,22" stroke="${t.c3}" stroke-width="1" opacity="0.4"/><path d="M4,12 L20,12 M4,16 L20,16" stroke="${t.c3}" stroke-width="1" opacity="0.4"/>`,
    'week5':   `<rect x="4" y="6" width="16" height="16" rx="2" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><path d="M4,10 H20" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><circle cx="8" cy="8" r="1.5" fill="${t.c3}" opacity="0.7"/><circle cx="16" cy="8" r="1.5" fill="${t.c3}" opacity="0.7"/><path d="M8,14 H16 M8,18 H12" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>`,
    'month20': `<rect x="4" y="6" width="16" height="16" rx="2" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><path d="M4,10 H20" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><rect x="7" y="13" width="2.5" height="2.5" rx="0.5" fill="${t.c3}" opacity="0.8"/><rect x="11" y="13" width="2.5" height="2.5" rx="0.5" fill="${t.c3}" opacity="0.8"/><rect x="15" y="13" width="2.5" height="2.5" rx="0.5" fill="${t.c3}" opacity="0.8"/><rect x="7" y="17" width="2.5" height="2.5" rx="0.5" fill="${t.c3}" opacity="0.6"/><rect x="11" y="17" width="2.5" height="2.5" rx="0.5" fill="${t.c3}" opacity="0.6"/>`,
    // Branş (yıldız içi)
    'tur':     `<path d="M5,8 H19 M5,13 H16 M5,18 H19 M5,23 H13" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`,
    'mat':     `<path d="M6,12 H18 M12,6 V18" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/><path d="M6,22 Q12,18 18,22" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>`,
    'fen':     `<circle cx="12" cy="12" r="4" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.9"/><path d="M12,8 V4 M16,10 L19,7 M16,14 L19,17 M12,16 V20 M8,14 L5,17 M8,10 L5,7" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>`,
    'ink':     `<path d="M4,20 L12,4 L20,20Z" fill="none" stroke="${t.c3}" stroke-width="2" stroke-linejoin="round" opacity="0.8"/><line x1="7" y1="15" x2="17" y2="15" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/>`,
    'din':     `<path d="M12,4 A9,9 0 1,0 20,8" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/><line x1="18" y1="4" x2="22" y2="2" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/><line x1="20" y1="6" x2="24" y2="6" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>`,
    'ing':     `<path d="M5,6 V18 M5,6 H18 M5,12 H14 M5,18 H18" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`,
    'allA':    `<polygon points="12,4 14,10 20,10 15,14 17,20 12,16 7,20 9,14 4,10 10,10" fill="${t.c3}" opacity="0.9"/>`,
    'allS':    `<polygon points="12,4 14,10 20,10 15,14 17,20 12,16 7,20 9,14 4,10 10,10" fill="${t.c3}" opacity="0.9"/><polygon points="12,7 13.2,10.5 17,10.5 14,12.8 15.2,16.5 12,14.3 8.8,16.5 10,12.8 7,10.5 10.8,10.5" fill="${t.c2}" opacity="0.5"/>`,
    'topBrans':`<path d="M4,20 L4,12 L8,16 L12,8 L16,14 L20,10 L20,20Z" fill="${t.c3}" opacity="0.7"/>`,
    'balBrans':`<path d="M4,12 H20 M12,4 V20" stroke="${t.c3}" stroke-width="1.5" opacity="0.4"/><circle cx="12" cy="8" r="2" fill="${t.c3}" opacity="0.8"/><circle cx="7" cy="14" r="2" fill="${t.c3}" opacity="0.8"/><circle cx="17" cy="14" r="2" fill="${t.c3}" opacity="0.8"/>`,
    // Psikoloji (kalp içi)
    'w1':      `<path d="M4,12 Q8,6 12,12 Q16,18 20,12" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.85"/>`,
    'w7':      `<path d="M3,12 Q6,6 9,12 Q12,18 15,12 Q18,6 21,12" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.85"/>`,
    'w14':     `<path d="M2,12 Q5,6 8,12 Q11,18 14,12 Q17,6 20,12 Q22,8 24,12" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.85"/>`,
    'w30':     `<circle cx="12" cy="12" r="8" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.5"/><path d="M4,12 Q8,4 12,12 Q16,20 20,12" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.85"/>`,
    'mood5':   `<path d="M7,10 Q7,8 9,8 Q11,8 11,10 M13,10 Q13,8 15,8 Q17,8 17,10" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/><path d="M7,15 Q9,19 12,19 Q15,19 17,15" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.85"/>`,
    'mood10':  `<path d="M6,10 Q6,7 9,7 Q12,7 12,10 M12,10 Q12,7 15,7 Q18,7 18,10" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/><path d="M5,16 Q8.5,21 12,21 Q15.5,21 19,16" stroke="${t.c3}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.9"/>`,
    'calm':    `<path d="M4,14 Q8,6 12,14 Q16,22 20,14" stroke="${t.c3}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/><path d="M4,11 Q8,3 12,11 Q16,19 20,11" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.75"/><line x1="4" y1="8" x2="20" y2="8" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.9"/>`,
    'calm3':   `<circle cx="12" cy="12" r="7" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.5"/><path d="M8,10 Q8,7 12,7 Q16,7 16,10" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/><path d="M8,15 Q10,18 12,18 Q14,18 16,15" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.9"/>`,
    'brave':   `<path d="M12,4 L20,8 L20,16 Q20,22 12,24 Q4,22 4,16 L4,8Z" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/><path d="M8,13 L11,16 L16,10" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>`,
    'brave3':  `<path d="M12,3 L21,7 L21,17 Q21,23 12,25 Q3,23 3,17 L3,7Z" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/><path d="M7,13 L11,17 L17,9" stroke="${t.c3}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>`,
    'bounce':  `<path d="M6,18 Q6,6 12,6 Q18,6 18,18" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.6"/><path d="M9,14 L12,8 L15,14" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>`,
    'bounce3': `<path d="M4,20 L4,12 L8,6 L12,12 L16,6 L20,12 L20,20" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85"/>`,
    'sleep7':  `<path d="M5,14 A8,6 0 0,0 19,14" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/><line x1="5" y1="14" x2="19" y2="14" stroke="${t.c3}" stroke-width="1" opacity="0.3"/><circle cx="8" cy="19" r="2" fill="${t.c3}" opacity="0.6"/><circle cx="12" cy="21" r="2.5" fill="${t.c3}" opacity="0.85"/><circle cx="16" cy="19" r="2" fill="${t.c3}" opacity="0.6"/>`,
    'sleep14': `<path d="M8,6 A6,6 0 1,0 14,6" stroke="${t.c3}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/><circle cx="8" cy="18" r="2" fill="${t.c3}" opacity="0.6"/><circle cx="12" cy="20" r="2.5" fill="${t.c3}" opacity="0.9"/><circle cx="16" cy="18" r="2" fill="${t.c3}" opacity="0.6"/>`,
    'water7':  `<path d="M12,4 Q16,10 16,16 A4,4 0 0,1 8,16 Q8,10 12,4Z" fill="${t.c3}" opacity="0.7"/><path d="M10,16 Q10,18 12,18 Q14,18 14,16" stroke="${t.c2}" stroke-width="1" fill="none" opacity="0.8"/>`,
    'energy5': `<path d="M15,4 L9,13 H14 L9,24 L19,11 H13Z" fill="${t.c3}" opacity="0.85"/>`,
    'diary10': `<path d="M6,6 H18 V22 H6Z" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><path d="M9,11 H15 M9,15 H13 M9,19 H15" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>`,
    'diary30': `<path d="M5,6 H19 V22 H5Z" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><path d="M8,10 H16 M8,14 H14 M8,18 H16" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/><path d="M15,4 L15,8 M9,4 L9,8" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>`,
    'open20':  `<path d="M4,18 Q4,8 12,6 Q20,8 20,18" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.5"/><path d="M8,18 Q8,11 12,10 Q16,11 16,18" fill="${t.c3}" opacity="0.6"/>`,
    'nodig':   `<rect x="6" y="5" width="12" height="18" rx="2" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/><line x1="4" y1="4" x2="20" y2="22" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`,
    'nodig5':  `<rect x="6" y="5" width="12" height="18" rx="2" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.8"/><line x1="3" y1="3" x2="21" y2="23" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>`,
    'screen':  `<rect x="4" y="7" width="16" height="12" rx="2" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/><path d="M8,22 H16 M12,19 V22" stroke="${t.c3}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><path d="M8,12 L11,12 M13,12 H16" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`,
    'honest7': `<path d="M4,12 Q12,4 20,12 Q12,20 4,12Z" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/><circle cx="12" cy="12" r="3" fill="${t.c3}" opacity="0.9"/>`,
    'honest14':`<path d="M3,12 Q12,3 21,12 Q12,21 3,12Z" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/><circle cx="12" cy="12" r="4" fill="${t.c3}" opacity="0.8"/><circle cx="12" cy="12" r="1.5" fill="${t.c2}" opacity="0.9"/>`,
    'full30':  `<circle cx="12" cy="12" r="8" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.5"/><path d="M6,12 L10,16 L18,8" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>`,
    // Deneme (kupa içi)
    'exam1':   `<circle cx="12" cy="12" r="7" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.8"/><circle cx="12" cy="12" r="1.5" fill="${t.c3}" opacity="1"/>`,
    'exam3':   `<circle cx="12" cy="12" r="7" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="${t.c3}" stroke-width="1.5" opacity="0.7"/><circle cx="12" cy="12" r="1.5" fill="${t.c3}" opacity="1"/><path d="M19,5 L19,12 L12,12" stroke="${t.c3}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.7"/>`,
    'exam5':   `<path d="M5,18 L5,10 M10,18 L10,8 M15,18 L15,6 M20,18 L20,4" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`,
    'exam10':  `<path d="M4,18 L4,10 L8,14 L12,6 L16,12 L20,8 L20,18" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85"/>`,
    'exam20':  `<path d="M4,18 L4,12 L8,6 L12,10 L16,4 L20,8 L20,18" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>`,
    'exup3':   `<path d="M4,18 L10,10 L14,14 L20,4" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/><circle cx="20" cy="4" r="2.5" fill="${t.c3}" opacity="0.9"/>`,
    'exup5':   `<path d="M3,18 L9,10 L13,14 L21,3" stroke="${t.c3}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/><path d="M17,3 L21,3 L21,7" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`,
    'expeak':  `<path d="M4,18 L12,4 L20,18" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8"/><circle cx="12" cy="4" r="2.5" fill="${t.c3}" opacity="0.9"/>`,
    'ex350':   `<path d="M12,4 L20,8 L20,16 Q20,22 12,24 Q4,22 4,16 L4,8Z" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/>`,
    'ex400':   `<path d="M12,4 L20,8 L20,16 Q20,22 12,24 Q4,22 4,16 L4,8Z" fill="none" stroke="${t.c3}" stroke-width="2" opacity="0.7"/><path d="M8,13 L11,16 L16,10" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>`,
    'ex425':   `<polygon points="12,4 14,9 20,9 15,13 17,18 12,15 7,18 9,13 4,9 10,9" fill="${t.c3}" opacity="0.85"/>`,
    'ex450':   `<polygon points="12,3 14,9 21,9 15.5,13.5 17.5,20 12,16 6.5,20 8.5,13.5 3,9 10,9" fill="${t.c3}" opacity="0.85"/><polygon points="12,7 13.5,11 18,11 14.5,13.5 16,18 12,15.5 8,18 9.5,13.5 6,11 10.5,11" fill="${t.c2}" opacity="0.4"/>`,
    'ex80net': `<path d="M15,4 L9,13 H14 L9,24 L19,11 H13Z" fill="${t.c3}" opacity="0.85"/>`,
    'exfull':  `<path d="M6,8 H18 M6,12 H18 M6,16 H18" stroke="${t.c3}" stroke-width="2" stroke-linecap="round" opacity="0.7"/><path d="M3,6 L9,20 L21,4" stroke="${t.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0"/>`,
    'exmonth': `<path d="M12,3 L14,9 L20,9 L15,13 L17,19 L12,16 L7,19 L9,13 L4,9 L10,9Z" fill="${t.c3}" opacity="0.9"/><polygon points="12,6 13.2,9.5 17,9.5 14,12 15.2,15.5 12,13.3 8.8,15.5 10,12 7,9.5 10.8,9.5" fill="${t.c2}" opacity="0.4"/>`,
  };
  // default sembol
  const inner = SYM[sym] || SYM['adim'];

  const SHAPES = {
    book: {
      body: `<rect x="13" y="7" width="54" height="66" rx="4"/>
             <rect x="13" y="7" width="10" height="66" rx="4" fill="${t.c1}" opacity="0.7"/>
             <rect x="22" y="7" width="2" height="66" fill="${t.c1}" opacity="0.3"/>
             <rect x="24" y="7" width="41" height="3" rx="1" fill="${t.c3}" opacity="0.2"/>
             <rect x="24" y="70" width="41" height="3" rx="1" fill="${t.c3}" opacity="0.15"/>`,
      vb:'0 0 80 80', tx:27, ty:22, tsz:32
    },
    star: {
      body: (()=>{ const pts=[];for(let i=0;i<12;i++){const r=i%2===0?34:17;const a=(i*30-90)*Math.PI/180;pts.push(`${40+r*Math.cos(a)},${40+r*Math.sin(a)}`);}return `<polygon points="${pts.join(' ')}"/>`; })(),
      vb:'0 0 80 80', tx:16, ty:16, tsz:32
    },
    heart: {
      body: `<path d="M40,68 C38,66 7,47 7,27 C7,14 17,6 26,6 C32,6 37,10 40,14 C43,10 48,6 54,6 C63,6 73,14 73,27 C73,47 42,66 40,68Z"/>`,
      vb:'0 0 80 80', tx:16, ty:18, tsz:32
    },
    trophy: {
      body: `<path d="M18,7 H62 V38 C62,54 51,63 40,65 C29,63 18,54 18,38Z"/>
             <path d="M18,11 H7 C7,11 4,29 18,37" fill="none" stroke="${t.b}" stroke-width="3" stroke-linecap="round"/>
             <path d="M62,11 H73 C73,11 76,29 62,37" fill="none" stroke="${t.b}" stroke-width="3" stroke-linecap="round"/>
             <rect x="32" y="65" width="16" height="8" rx="2"/>
             <rect x="24" y="73" width="32" height="5" rx="2.5"/>`,
      vb:'0 0 80 80', tx:19, ty:14, tsz:28
    },
  };
  const sh = SHAPES[form] || SHAPES.book;

  return `<svg width="${size}" height="${size}" viewBox="${sh.vb}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g${uid}" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="${t.c3}"/>
      <stop offset="40%" stop-color="${t.c2}"/>
      <stop offset="100%" stop-color="${t.c1}"/>
    </linearGradient>
    <radialGradient id="rg${uid}" cx="30%" cy="22%" r="60%">
      <stop offset="0%" stop-color="white" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <filter id="ds${uid}"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="${t.c4}" flood-opacity="0.65"/></filter>
  </defs>
  <g filter="url(#ds${uid})"><g fill="url(#g${uid})" stroke="${t.c1}" stroke-width="1">${sh.body}</g></g>
  <g fill="url(#rg${uid})" stroke="none"><g stroke="none">${sh.body}</g></g>
  ${locked
    ? `<g opacity="0.5"><rect x="31" y="31" width="18" height="15" rx="3" fill="#111" stroke="#333" stroke-width="1.5"/><rect x="35.5" y="24" width="9" height="11" rx="4.5" fill="none" stroke="#333" stroke-width="2"/><circle cx="40" cy="39.5" r="2" fill="#444"/></g>`
    : `<g transform="translate(${sh.tx},${sh.ty})"><svg width="${sh.tsz}" height="${sh.tsz}" viewBox="0 0 24 24">${inner}</svg></g>`
  }
  </svg>`;
}
// Çerçeve SVG üretici — köşelere rozet sembolü işler
function makeFrameSVG(frameId, size) {
  const frames = {
    none:   null,
    blue:   { color:'#6c63ff', symbol:'◈', glow:'none' },
    purple: { color:'#a855f7', symbol:'✦', glow:'0 0 8px #a855f7aa' },
    orange: { color:'#f97316', symbol:'🔥', glow:'0 0 12px #f97316aa' },
    gold:   { color:'#f59e0b', symbol:'👑', glow:'0 0 16px #f59e0baa, 0 0 32px #fbbf2466' },
  };
  return frames[frameId] || frames.none;
}

// Tüm rozetler
const BADGES = [
  // ════════════════════════════════════
  // 📚 AKADEMİK — Kitap formu (25 rozet)
  // ════════════════════════════════════
  // Toplam soru
  { id:'s50',    cat:'akademik', form:'book', tier:'bronze',  sym:'🌱', name:'Filiz',          desc:'50 soru çöz',                   check:s=>s.totalQ>=50 },
  { id:'s100',   cat:'akademik', form:'book', tier:'bronze',  sym:'📖', name:'İlk Adım',       desc:'100 soru çöz',                  check:s=>s.totalQ>=100 },
  { id:'s300',   cat:'akademik', form:'book', tier:'bronze',  sym:'📚', name:'Çalışkan',       desc:'300 soru çöz',                  check:s=>s.totalQ>=300 },
  { id:'s500',   cat:'akademik', form:'book', tier:'silver',  sym:'🏃', name:'Koşucu',         desc:'500 soru çöz',                  check:s=>s.totalQ>=500 },
  { id:'s1000',  cat:'akademik', form:'book', tier:'silver',  sym:'🎯', name:'Maraton',        desc:'1.000 soru çöz',                check:s=>s.totalQ>=1000 },
  { id:'s2500',  cat:'akademik', form:'book', tier:'gold',    sym:'⚡', name:'Fırtına',        desc:'2.500 soru çöz',                check:s=>s.totalQ>=2500 },
  { id:'s5000',  cat:'akademik', form:'book', tier:'gold',    sym:'💎', name:'Efsane',         desc:'5.000 soru çöz',                check:s=>s.totalQ>=5000 },
  { id:'s10000', cat:'akademik', form:'book', tier:'diamond', sym:'👑', name:'LGS Savaşçısı',  desc:'10.000 soru çöz',               check:s=>s.totalQ>=10000 },
  // Seri
  { id:'d3',     cat:'akademik', form:'book', tier:'bronze',  sym:'🔥', name:'3 Gün Ateşi',    desc:'3 gün üst üste çalış',          check:s=>s.streak>=3 },
  { id:'d7',     cat:'akademik', form:'book', tier:'silver',  sym:'🔥', name:'7 Gün Serisi',   desc:'7 gün üst üste çalış',          check:s=>s.streak>=7 },
  { id:'d14',    cat:'akademik', form:'book', tier:'gold',    sym:'⚡', name:'14 Gün Fırtına', desc:'14 gün üst üste çalış',         check:s=>s.streak>=14 },
  { id:'d30',    cat:'akademik', form:'book', tier:'diamond', sym:'🌟', name:'30 Gün Efsane',  desc:'30 gün üst üste çalış',         check:s=>s.streak>=30 },
  // Günlük hedef
  { id:'g1',     cat:'akademik', form:'book', tier:'bronze',  sym:'🎯', name:'Hedef Avcısı',   desc:'1 günde 200+ soru',             check:s=>s.goal1>=1 },
  { id:'g3',     cat:'akademik', form:'book', tier:'silver',  sym:'🏹', name:'Isabetli',       desc:'3 kez günde 200+ soru',         check:s=>s.goal1>=3 },
  { id:'g7',     cat:'akademik', form:'book', tier:'gold',    sym:'🎖️', name:'Usta',           desc:'7 kez günde 200+ soru',         check:s=>s.goal1>=7 },
  { id:'g30',    cat:'akademik', form:'book', tier:'diamond', sym:'💥', name:'Keskin Nişancı', desc:'30 kez günde 200+ soru',        check:s=>s.goal1>=30 },
  // İsabet
  { id:'a70',    cat:'akademik', form:'book', tier:'bronze',  sym:'✔️', name:'Doğruluk',       desc:'%70+ isabet 1 gün',             check:s=>s.acc70>=1 },
  { id:'a80',    cat:'akademik', form:'book', tier:'silver',  sym:'✅', name:'İsabetli',       desc:'%80+ isabet 1 gün',             check:s=>s.acc80>=1 },
  { id:'a80x7',  cat:'akademik', form:'book', tier:'gold',    sym:'🎯', name:'Tutarlı',        desc:'%80+ isabet 7 gün üst üste',    check:s=>s.acc80streak>=7 },
  { id:'a95',    cat:'akademik', form:'book', tier:'diamond', sym:'💯', name:'Mükemmel',       desc:'%95+ isabet 1 gün',             check:s=>s.acc95>=1 },
  // Saat
  { id:'t300',   cat:'akademik', form:'book', tier:'bronze',  sym:'⏱️', name:'Sabırlı',        desc:'Tek günde 300+ dk çalış',       check:s=>s.maxDayMin>=300 },
  { id:'t500',   cat:'akademik', form:'book', tier:'gold',    sym:'⌛', name:'Azimli',         desc:'Tek günde 500+ dk çalış',       check:s=>s.maxDayMin>=500 },
  // Çeşitlilik
  { id:'allsub', cat:'akademik', form:'book', tier:'gold',    sym:'🌈', name:'Tam Kapsamlı',   desc:'Bir günde 6 dersle de çalış',   check:s=>s.allSubDay>=1 },
  { id:'week5',  cat:'akademik', form:'book', tier:'silver',  sym:'📅', name:'Düzenli',        desc:'Bir haftada 5 gün çalış',       check:s=>s.week5>=1 },
  { id:'month20',cat:'akademik', form:'book', tier:'gold',    sym:'📆', name:'Aylık Şampiyon', desc:'Bir ayda 20 gün çalış',         check:s=>s.month20>=1 },

  // ════════════════════════════════════
  // ⭐ BRANŞ UZMANLIĞI — Yıldız formu (28 rozet)
  // ════════════════════════════════════
  { id:'tur1', cat:'brans', form:'star', tier:'bronze',  sym:'📝', name:'Türkçe: Okur',        desc:'Türkçe\'de 50 soru',    check:s=>s.brans['Türkçe']>=50 },
  { id:'tur2', cat:'brans', form:'star', tier:'silver',  sym:'✒️', name:'Türkçe: Yazar',        desc:'Türkçe\'de 200 soru',   check:s=>s.brans['Türkçe']>=200 },
  { id:'tur3', cat:'brans', form:'star', tier:'gold',    sym:'📜', name:'Türkçe: Edebiyatçı',   desc:'Türkçe\'de 500 soru',   check:s=>s.brans['Türkçe']>=500 },
  { id:'tur4', cat:'brans', form:'star', tier:'ruby',    sym:'🖊️', name:'Türkçe: Dil Ustası',   desc:'Türkçe\'de 1000 soru',  check:s=>s.brans['Türkçe']>=1000 },
  { id:'mat1', cat:'brans', form:'star', tier:'bronze',  sym:'🔢', name:'Matematik: Sayıcı',    desc:'Matematikte 50 soru',   check:s=>s.brans['Matematik']>=50 },
  { id:'mat2', cat:'brans', form:'star', tier:'silver',  sym:'📐', name:'Matematik: Hesapçı',   desc:'Matematikte 200 soru',  check:s=>s.brans['Matematik']>=200 },
  { id:'mat3', cat:'brans', form:'star', tier:'gold',    sym:'∞',  name:'Matematik: Analist',   desc:'Matematikte 500 soru',  check:s=>s.brans['Matematik']>=500 },
  { id:'mat4', cat:'brans', form:'star', tier:'ruby',    sym:'🧮', name:'Matematik Dehası',     desc:'Matematikte 1000 soru', check:s=>s.brans['Matematik']>=1000 },
  { id:'fen1', cat:'brans', form:'star', tier:'bronze',  sym:'🔍', name:'Fen: Meraklı',         desc:'Fen\'de 50 soru',       check:s=>s.brans['Fen Bilimleri']>=50 },
  { id:'fen2', cat:'brans', form:'star', tier:'silver',  sym:'🔬', name:'Fen: Araştırmacı',     desc:'Fen\'de 200 soru',      check:s=>s.brans['Fen Bilimleri']>=200 },
  { id:'fen3', cat:'brans', form:'star', tier:'gold',    sym:'⚗️', name:'Fen: Bilim İnsanı',   desc:'Fen\'de 500 soru',      check:s=>s.brans['Fen Bilimleri']>=500 },
  { id:'fen4', cat:'brans', form:'star', tier:'ruby',    sym:'🧬', name:'Fen: Deney Ustası',    desc:'Fen\'de 1000 soru',     check:s=>s.brans['Fen Bilimleri']>=1000 },
  { id:'ink1', cat:'brans', form:'star', tier:'bronze',  sym:'🏛️', name:'İnkılap: Vatandaş',   desc:'İnkılap\'ta 50 soru',   check:s=>s.brans['İnkılap Tarihi']>=50 },
  { id:'ink2', cat:'brans', form:'star', tier:'silver',  sym:'📰', name:'İnkılap: Tarihçi',     desc:'İnkılap\'ta 200 soru',  check:s=>s.brans['İnkılap Tarihi']>=200 },
  { id:'ink3', cat:'brans', form:'star', tier:'gold',    sym:'🗺️', name:'İnkılap: Arşivci',    desc:'İnkılap\'ta 500 soru',  check:s=>s.brans['İnkılap Tarihi']>=500 },
  { id:'ink4', cat:'brans', form:'star', tier:'ruby',    sym:'⚔️', name:'Tarih Bilgesi',       desc:'İnkılap\'ta 1000 soru', check:s=>s.brans['İnkılap Tarihi']>=1000 },
  { id:'din1', cat:'brans', form:'star', tier:'bronze',  sym:'🌙', name:'Din: Öğrenci',         desc:'Din\'de 50 soru',       check:s=>s.brans['Din Kültürü']>=50 },
  { id:'din2', cat:'brans', form:'star', tier:'silver',  sym:'☪️', name:'Din: Bilgili',         desc:'Din\'de 200 soru',      check:s=>s.brans['Din Kültürü']>=200 },
  { id:'din3', cat:'brans', form:'star', tier:'gold',    sym:'📿', name:'Din: Aydın',           desc:'Din\'de 500 soru',      check:s=>s.brans['Din Kültürü']>=500 },
  { id:'din4', cat:'brans', form:'star', tier:'ruby',    sym:'🕌', name:'Din: Bilge',           desc:'Din\'de 1000 soru',     check:s=>s.brans['Din Kültürü']>=1000 },
  { id:'ing1', cat:'brans', form:'star', tier:'bronze',  sym:'🗣️', name:'English: Beginner',   desc:'İngilizce\'de 50 soru', check:s=>s.brans['İngilizce']>=50 },
  { id:'ing2', cat:'brans', form:'star', tier:'silver',  sym:'💬', name:'English: Speaker',     desc:'İngilizce\'de 200 soru',check:s=>s.brans['İngilizce']>=200 },
  { id:'ing3', cat:'brans', form:'star', tier:'gold',    sym:'🌍', name:'English: Fluent',      desc:'İngilizce\'de 500 soru',check:s=>s.brans['İngilizce']>=500 },
  { id:'ing4', cat:'brans', form:'star', tier:'ruby',    sym:'🎓', name:'English: Mastermind',  desc:'İngilizce\'de 1000 soru',check:s=>s.brans['İngilizce']>=1000 },
  { id:'allA', cat:'brans', form:'star', tier:'gold',    sym:'🌠', name:'Tam Branş',            desc:'Tüm derslerde 100+ soru',check:s=>Object.values(s.brans).every(v=>v>=100) },
  { id:'allS', cat:'brans', form:'star', tier:'diamond', sym:'💫', name:'Sonsuz Yıldız',       desc:'Tüm derslerde 500+ soru',check:s=>Object.values(s.brans).every(v=>v>=500) },
  { id:'topBrans', cat:'brans', form:'star', tier:'silver', sym:'🥇', name:'Güçlü Ders',       desc:'Bir derste %90+ isabet (50+ soru)',check:s=>s.topBrans>=1 },
  { id:'balBrans', cat:'brans', form:'star', tier:'gold',   sym:'⚖️', name:'Dengeli',          desc:'Tüm derslerde %60+ isabet',check:s=>s.balBrans>=1 },

  // ════════════════════════════════════
  // 💙 PSİKOLOJİ — Kalp formu (25 rozet)
  // ════════════════════════════════════
  { id:'w1',     cat:'psikoloji', form:'heart', tier:'bronze',  sym:'💙', name:'İlk Gün',        desc:'Wellness\'e ilk giriş',           check:s=>s.wellnessTotal>=1 },
  { id:'w7',     cat:'psikoloji', form:'heart', tier:'silver',  sym:'📆', name:'Haftalık Takip', desc:'7 gün üst üste wellness girişi',  check:s=>s.wellnessStreak>=7 },
  { id:'w14',    cat:'psikoloji', form:'heart', tier:'gold',    sym:'🗓️', name:'2 Hafta Devam', desc:'14 gün üst üste wellness girişi', check:s=>s.wellnessStreak>=14 },
  { id:'w30',    cat:'psikoloji', form:'heart', tier:'diamond', sym:'💜', name:'Aylık Takip',    desc:'30 gün üst üste wellness girişi', check:s=>s.wellnessStreak>=30 },
  { id:'mood5',  cat:'psikoloji', form:'heart', tier:'silver',  sym:'😊', name:'İyimser',        desc:'5 gün üst üste iyi/heyecanlı',    check:s=>s.goodMoodStreak>=5 },
  { id:'mood10', cat:'psikoloji', form:'heart', tier:'gold',    sym:'🌈', name:'Mutlu Ruh',      desc:'10 gün üst üste iyi/heyecanlı',   check:s=>s.goodMoodStreak>=10 },
  { id:'calm',   cat:'psikoloji', form:'heart', tier:'silver',  sym:'🧘', name:'Dengeli',        desc:'Haftalık kaygı ort. 5 altı',      check:s=>s.calmWeek>=1 },
  { id:'calm3',  cat:'psikoloji', form:'heart', tier:'gold',    sym:'☮️', name:'Huzurlu',        desc:'3 hafta kaygı ort. 5 altı',       check:s=>s.calmWeek>=3 },
  { id:'brave',  cat:'psikoloji', form:'heart', tier:'gold',    sym:'💪', name:'Blokaj Kırıcı',  desc:'Kaygı 8+ günde 10+ soru çöz',    check:s=>s.braveDay>=1 },
  { id:'brave3', cat:'psikoloji', form:'heart', tier:'diamond', sym:'🦁', name:'Demir İrade',    desc:'Blokaj Kırıcı\'yı 3 kez yap',    check:s=>s.braveDay>=3 },
  { id:'bounce', cat:'psikoloji', form:'heart', tier:'silver',  sym:'🌈', name:'Toparlanma',     desc:'Kaygılı günden sonra iyiyim',     check:s=>s.bounceBack>=1 },
  { id:'bounce3',cat:'psikoloji', form:'heart', tier:'gold',    sym:'🦋', name:'Dönüşüm',       desc:'3 kez kaygıdan iyiye geçiş',      check:s=>s.bounceBack>=3 },
  { id:'sleep7', cat:'psikoloji', form:'heart', tier:'silver',  sym:'😴', name:'Dinç Uyandım',   desc:'7 gün üst üste 7+ saat uyku',    check:s=>s.sleepStreak>=7 },
  { id:'sleep14',cat:'psikoloji', form:'heart', tier:'gold',    sym:'🌙', name:'Uyku Ustası',    desc:'14 gün üst üste 7+ saat uyku',   check:s=>s.sleepStreak>=14 },
  { id:'water7', cat:'psikoloji', form:'heart', tier:'silver',  sym:'💧', name:'Su İçtim',       desc:'7 gün üst üste su içti',         check:s=>s.waterStreak>=7 },
  { id:'energy5',cat:'psikoloji', form:'heart', tier:'silver',  sym:'⚡', name:'Enerji Bombası', desc:'5 gün üst üste enerji 8+',       check:s=>s.energyStreak>=5 },
  { id:'diary10',cat:'psikoloji', form:'heart', tier:'bronze',  sym:'✍️', name:'Günlükçü',       desc:'10 gün not girişi',               check:s=>s.diaryDays>=10 },
  { id:'diary30',cat:'psikoloji', form:'heart', tier:'silver',  sym:'📔', name:'Düşünür',        desc:'30 gün not girişi',               check:s=>s.diaryDays>=30 },
  { id:'open20', cat:'psikoloji', form:'heart', tier:'gold',    sym:'🗣️', name:'Açık Yürek',     desc:'20 gün hem + hem - not',          check:s=>s.openDays>=20 },
  { id:'nodig',  cat:'psikoloji', form:'heart', tier:'silver',  sym:'📵', name:'Dijital Oruç',   desc:'Sosyal medya 0 dk olan 1 gün',   check:s=>s.digitalFast>=1 },
  { id:'nodig5', cat:'psikoloji', form:'heart', tier:'gold',    sym:'🔇', name:'Dijital Usta',   desc:'Dijital Oruç\'u 5 kez yap',      check:s=>s.digitalFast>=5 },
  { id:'screen', cat:'psikoloji', form:'heart', tier:'gold',    sym:'💻', name:'Verimli Ekran',  desc:'Sadece online ders, sosyal 0',   check:s=>s.productiveScreen>=1 },
  { id:'honest7',cat:'psikoloji', form:'heart', tier:'gold',    sym:'🪞', name:'Ayna',           desc:'7 günde 5+ farklı duygu',        check:s=>s.uniqueMoods7>=5 },
  { id:'honest14',cat:'psikoloji',form:'heart', tier:'diamond', sym:'💎', name:'Özgün',          desc:'14 günde 5+ farklı duygu',       check:s=>s.uniqueMoods14>=5 },
  { id:'full30', cat:'psikoloji', form:'heart', tier:'diamond', sym:'🔍', name:'Kendini Tanıyan',desc:'4 alanı dolu 30 gün',            check:s=>s.fullDays>=30 },

  // ════════════════════════════════════
  // 🏆 DENEME — Kupa formu (15 rozet)
  // ════════════════════════════════════
  { id:'exam1',   cat:'deneme', form:'trophy', tier:'bronze',  sym:'🎯', name:'İlk Deneme',      desc:'İlk deneme girişi',               check:s=>s.examCount>=1 },
  { id:'exam3',   cat:'deneme', form:'trophy', tier:'bronze',  sym:'📝', name:'Düzenli',         desc:'3 deneme girişi',                 check:s=>s.examCount>=3 },
  { id:'exam5',   cat:'deneme', form:'trophy', tier:'silver',  sym:'📊', name:'Takipçi',         desc:'5 deneme girişi',                 check:s=>s.examCount>=5 },
  { id:'exam10',  cat:'deneme', form:'trophy', tier:'gold',    sym:'🔄', name:'Vazgeçmez',       desc:'10 deneme girişi',                check:s=>s.examCount>=10 },
  { id:'exam20',  cat:'deneme', form:'trophy', tier:'diamond', sym:'⚡', name:'Deneme Makinası', desc:'20 deneme girişi',                check:s=>s.examCount>=20 },
  { id:'exup3',   cat:'deneme', form:'trophy', tier:'silver',  sym:'📈', name:'Yükselen Yıldız', desc:'3 denemede art arda net artışı',  check:s=>s.examRise>=3 },
  { id:'exup5',   cat:'deneme', form:'trophy', tier:'gold',    sym:'🚀', name:'Roket',           desc:'5 denemede art arda net artışı',  check:s=>s.examRise>=5 },
  { id:'expeak',  cat:'deneme', form:'trophy', tier:'gold',    sym:'🏔️', name:'Zirve',           desc:'En yüksek deneme puanını kır',   check:s=>s.examPeak>=1 },
  { id:'ex350',   cat:'deneme', form:'trophy', tier:'bronze',  sym:'💫', name:'Umut Verici',     desc:'Tahmini LGS puanı 350+',          check:s=>s.examBest>=350 },
  { id:'ex400',   cat:'deneme', form:'trophy', tier:'silver',  sym:'💪', name:'Güçlü',           desc:'Tahmini LGS puanı 400+',          check:s=>s.examBest>=400 },
  { id:'ex425',   cat:'deneme', form:'trophy', tier:'gold',    sym:'🎖️', name:'500\'e Doğru',    desc:'Tahmini LGS puanı 425+',          check:s=>s.examBest>=425 },
  { id:'ex450',   cat:'deneme', form:'trophy', tier:'diamond', sym:'👑', name:'LGS Hazırı',      desc:'Tahmini LGS puanı 450+',          check:s=>s.examBest>=450 },
  { id:'ex80net', cat:'deneme', form:'trophy', tier:'gold',    sym:'⚡', name:'Hız Rekoru',      desc:'Tek denemede 80+ net',            check:s=>s.examMax80>=1 },
  { id:'exfull',  cat:'deneme', form:'trophy', tier:'gold',    sym:'🎓', name:'Full Branş',      desc:'Tüm 6 derste 0+ net',             check:s=>s.examAllBrans>=1 },
  { id:'exmonth', cat:'deneme', form:'trophy', tier:'ruby',    sym:'🌟', name:'Ay Şampiyonu',    desc:'Bu ay en yüksek puan',            check:s=>s.examMonthBest>=1 },
];

// Yardımcı fonksiyonlar - çerçeve render için
function _c(C,R,stroke,sw,extra){return '<circle cx="'+C+'" cy="'+C+'" r="'+R+'" fill="none" stroke="'+stroke+'" stroke-width="'+sw+'"'+(extra?' '+extra:'')+'/>';}
function _ci(x,y,r,fill,stroke,sw){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||1)+'"':'')+'/>';}

// Çerçeveler — 12 seviye, süslü arabesk tarz
const FRAMES = [

{id:'none', name:'Çerçevesiz', minBadge:0, fn:null},

// 1 — Başlangıç: ince gümüş halka + 8 nokta
{id:'baslangic', name:'Başlangıç', minBadge:0, fn:function(C,R){
  var o='<circle cx="'+C+'" cy="'+C+'" r="'+R+'" fill="none" stroke="#64748b" stroke-width="1.5" opacity="0.8"/>';
  for(var i=0;i<8;i++){var a=i*45*Math.PI/180,x=C+R*Math.cos(a),y=C+R*Math.sin(a);o+='<circle cx="'+x+'" cy="'+y+'" r="2" fill="#94a3b8"/>';}
  return o;
}},

// 2 — Çalışkan: mavi altıgen segmentler
{id:'caliskan', name:'Çalışkan', minBadge:8, fn:function(C,R){
  var o='';
  for(var i=0;i<6;i++){
    var a1=(i*60-15)*Math.PI/180,a2=(i*60+15)*Math.PI/180;
    var x1=C+R*Math.cos(a1),y1=C+R*Math.sin(a1),x2=C+R*Math.cos(a2),y2=C+R*Math.sin(a2);
    o+='<path d="M'+x1+','+y1+' A'+R+','+R+' 0 0,1 '+x2+','+y2+'" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>';
  }
  return o;
}},

// 3 — Azimli: mor dörtgen köşe noktaları
{id:'azimli', name:'Azimli', minBadge:15, fn:function(C,R){
  var o='<circle cx="'+C+'" cy="'+C+'" r="'+R+'" fill="none" stroke="#7c3aed" stroke-width="1.5" opacity="0.5"/>';
  [0,90,180,270].forEach(function(deg){
    var a=deg*Math.PI/180,x=C+R*Math.cos(a),y=C+R*Math.sin(a);
    o+='<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="#a855f7"/>';
    var b1=(deg+30)*Math.PI/180,b2=(deg-30)*Math.PI/180;
    o+='<circle cx="'+(C+R*Math.cos(b1))+'" cy="'+(C+R*Math.sin(b1))+'" r="1.5" fill="#c084fc" opacity="0.7"/>';
    o+='<circle cx="'+(C+R*Math.cos(b2))+'" cy="'+(C+R*Math.sin(b2))+'" r="1.5" fill="#c084fc" opacity="0.7"/>';
  });
  return o;
}},

// 4 — Kararlı: turkuaz ince çift halka + 6 çizgi
{id:'kararli', name:'Kararlı', minBadge:22, fn:function(C,R){
  var o='<circle cx="'+C+'" cy="'+C+'" r="'+R+'" fill="none" stroke="#06b6d4" stroke-width="1.5"/>';
  o+='<circle cx="'+C+'" cy="'+C+'" r="'+(R+3)+'" fill="none" stroke="#0e7490" stroke-width="0.8" stroke-dasharray="4,4"/>';
  for(var i=0;i<6;i++){var a=i*60*Math.PI/180,x=C+(R-3)*Math.cos(a),y=C+(R-3)*Math.sin(a),x2=C+(R+5)*Math.cos(a),y2=C+(R+5)*Math.sin(a);o+='<line x1="'+x+'" y1="'+y+'" x2="'+x2+'" y2="'+y2+'" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>';}
  return o;
}},

// 5 — Güçlü: kırmızı 5 köşeli yıldız halkası
{id:'guclu', name:'Güçlü', minBadge:30, fn:function(C,R){
  var o='';
  for(var i=0;i<5;i++){
    var a=i*72*Math.PI/180-Math.PI/2,an=(i+1)*72*Math.PI/180-Math.PI/2;
    var x=C+R*Math.cos(a),y=C+R*Math.sin(a),x2=C+R*Math.cos(an),y2=C+R*Math.sin(an);
    var mx=C+(R+5)*Math.cos((a+an)/2),my=C+(R+5)*Math.sin((a+an)/2);
    o+='<path d="M'+x+','+y+' Q'+mx+','+my+' '+x2+','+y2+'" fill="none" stroke="#ef4444" stroke-width="2"/>';
    o+='<circle cx="'+x+'" cy="'+y+'" r="3" fill="#f43f5e"/>';
  }
  return o;
}},

// 6 — Usta: turuncu ark segmentleri + altın noktalar
{id:'usta', name:'Usta', minBadge:40, fn:function(C,R){
  var o='';
  [0,60,120,180,240,300].forEach(function(deg){
    var a1=(deg-20)*Math.PI/180,a2=(deg+20)*Math.PI/180;
    var x1=C+R*Math.cos(a1),y1=C+R*Math.sin(a1),x2=C+R*Math.cos(a2),y2=C+R*Math.sin(a2);
    o+='<path d="M'+x1+','+y1+' A'+R+','+R+' 0 0,1 '+x2+','+y2+'" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>';
  });
  [30,90,150,210,270,330].forEach(function(deg){
    var a=deg*Math.PI/180;o+='<circle cx="'+(C+R*Math.cos(a))+'" cy="'+(C+R*Math.sin(a))+'" r="2" fill="#fde047"/>';
  });
  return o;
}},

// 7 — Efsane: altın 8 yapraklı çiçek
{id:'efsane', name:'Efsane', minBadge:52, fn:function(C,R){
  var o='<circle cx="'+C+'" cy="'+C+'" r="'+R+'" fill="none" stroke="#d97706" stroke-width="1" opacity="0.4"/>';
  for(var i=0;i<8;i++){
    var a=i*45*Math.PI/180,x=C+R*Math.cos(a),y=C+R*Math.sin(a),nx=Math.cos(a),ny=Math.sin(a),tx=-ny,ty=nx;
    o+='<path d="M'+(x-tx*3)+','+(y-ty*3)+' Q'+(x+nx*5)+','+(y+ny*5)+' '+(x+tx*3)+','+(y+ty*3)+'" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>';
    o+='<circle cx="'+x+'" cy="'+y+'" r="2.5" fill="#fde047"/>';
  }
  return o;
}},

// 8 — Efsane+: mavi-cyan mozaik
{id:'efsaneplus', name:'Efsane+', minBadge:65, fn:function(C,R){
  var o='';
  for(var i=0;i<12;i++){
    var a=i*30*Math.PI/180,col=i%3===0?'#60a5fa':i%3===1?'#818cf8':'#22d3ee';
    var x=C+R*Math.cos(a),y=C+R*Math.sin(a),x2=C+R*Math.cos(a+26*Math.PI/180),y2=C+R*Math.sin(a+26*Math.PI/180);
    o+='<path d="M'+x+','+y+' A'+R+','+R+' 0 0,1 '+x2+','+y2+'" fill="none" stroke="'+col+'" stroke-width="'+(i%3===0?3:1.5)+'" stroke-linecap="round"/>';
  }
  return o;
}},

// 9 — Şampiyonluk: yeşil defne halka 16 yaprak
{id:'sampiyonluk', name:'Şampiyonluk', minBadge:78, fn:function(C,R){
  var o='<circle cx="'+C+'" cy="'+C+'" r="'+R+'" fill="none" stroke="#16a34a" stroke-width="1.2"/>';
  for(var i=0;i<16;i++){
    var a=i*22.5*Math.PI/180,nx=Math.cos(a),ny=Math.sin(a),tx=-ny,ty=nx;
    var x=C+R*nx,y=C+R*ny,big=i%2===0,s=big?3.5:2;
    o+='<path d="M'+x+','+y+' Q'+(x+nx*4+tx*s)+','+(y+ny*4+ty*s)+' '+(x+nx*7)+','+(y+ny*7)+' Q'+(x+nx*4-tx*s)+','+(y+ny*4-ty*s)+' '+x+','+y+'Z" fill="'+(big?'#15803d':'#166534')+'" stroke="'+(big?'#4ade80':'#86efac')+'" stroke-width="0.8"/>';
  }
  return o;
}},

// 10 — Yakut: kırmızı-altın Baroque
{id:'yakut', name:'Yakut', minBadge:88, fn:function(C,R){
  var o='<circle cx="'+C+'" cy="'+C+'" r="'+R+'" fill="none" stroke="#991b1b" stroke-width="1.5"/>';
  [0,90,180,270].forEach(function(deg){
    var a=deg*Math.PI/180,x=C+R*Math.cos(a),y=C+R*Math.sin(a),nx=Math.cos(a),ny=Math.sin(a),tx=-ny,ty=nx;
    o+='<path d="M'+(x+tx*6)+','+(y+ty*6)+' Q'+(x+nx*5)+','+(y+ny*5)+' '+(x+nx*9)+','+(y+ny*9)+' Q'+(x+nx*5)+','+(y+ny*5)+' '+(x-tx*6)+','+(y-ty*6)+'" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5"/>';
    o+='<circle cx="'+(x+nx*9)+'" cy="'+(y+ny*9)+'" r="3" fill="#fde047"/>';
    o+='<circle cx="'+x+'" cy="'+y+'" r="2.5" fill="#dc2626"/>';
  });
  return o;
}},

// 11 — Kozmik: gökkuşağı 8 segment
{id:'kozmik', name:'Kozmik', minBadge:95, fn:function(C,R){
  var cols=['#7c3aed','#2563eb','#0e7490','#047857','#b45309','#9f1239','#4c1d95','#1e3a8a'];
  var scols=['#a78bfa','#60a5fa','#22d3ee','#34d399','#fbbf24','#f87171','#c084fc','#93c5fd'];
  var o='';
  for(var i=0;i<8;i++){
    var a1=(i*45-18)*Math.PI/180,a2=(i*45+18)*Math.PI/180,am=i*45*Math.PI/180;
    var x1=C+R*Math.cos(a1),y1=C+R*Math.sin(a1),x2=C+R*Math.cos(a2),y2=C+R*Math.sin(a2);
    o+='<path d="M'+x1+','+y1+' A'+R+','+R+' 0 0,1 '+x2+','+y2+'" fill="none" stroke="'+scols[i]+'" stroke-width="3" stroke-linecap="round"/>';
    o+='<circle cx="'+(C+(R+1)*Math.cos(am))+'" cy="'+(C+(R+1)*Math.sin(am))+'" r="2" fill="white"/>';
  }
  return o;
}},

// 12 — Efsanevi: altın 12 motif saray
{id:'efsanevi', name:'Efsanevi ✦', minBadge:105, fn:function(C,R){
  var o='<circle cx="'+C+'" cy="'+C+'" r="'+R+'" fill="none" stroke="#92400e" stroke-width="1.5"/>';
  o+='<circle cx="'+C+'" cy="'+C+'" r="'+(R-4)+'" fill="none" stroke="#fde68a" stroke-width="0.5" opacity="0.5"/>';
  for(var i=0;i<12;i++){
    var a=i*30*Math.PI/180,nx=Math.cos(a),ny=Math.sin(a),tx=-ny,ty=nx,big=i%3===0;
    var x=C+R*nx,y=C+R*ny;
    if(big){o+='<path d="M'+(x-tx*3)+','+(y-ty*3)+' Q'+(x+nx*6)+','+(y+ny*6)+' '+(x+tx*3)+','+(y+ty*3)+'" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>';o+='<circle cx="'+x+'" cy="'+y+'" r="3" fill="#fde047"/>';}
    else{o+='<circle cx="'+x+'" cy="'+y+'" r="1.8" fill="#d97706"/>';}
  }
  return o;
}},

];






// Çerçeve SVG'sini render et (avatarın etrafına)
function renderFrameSVG(frameId, avatarEl, totalSize) {
  const frame = FRAMES.find(f=>f.id===frameId);
  if (!frame || !frame.fn) { 
    avatarEl.style.border='none'; avatarEl.style.boxShadow='none';
    const old=document.getElementById('_frameOverlay');
    if(old) old.remove();
    return; 
  }
  avatarEl.style.border='none'; avatarEl.style.boxShadow='none';
  const C=totalSize/2, R=totalSize/2-14;
  const svgContent=frame.fn(C,R);
  let overlay=document.getElementById('_frameOverlay');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='_frameOverlay';
    overlay.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3';
    const parent=avatarEl.parentElement;
    if(parent){parent.style.position='relative';parent.appendChild(overlay);}
  }
  overlay.innerHTML='<svg width="'+totalSize+'" height="'+totalSize+'" viewBox="0 0 '+totalSize+' '+totalSize+'" style="position:absolute;top:0;left:0" xmlns="http://www.w3.org/2000/svg">'+svgContent+'</svg>';
}


// ── İstatistik hesaplama ────────────────────────────────────
function computeBadgeStats(uid) {
  const sObj = students.find(s=>s.uid===uid) || {};
  const entries = studyEntries.filter(e=>e.userId===uid||e.studentName===sObj.name);
  const soruE   = entries.filter(e=>e.type!=='deneme');
  const denemE  = entries.filter(e=>e.type==='deneme');

  const totalQ = soruE.reduce((a,e)=>a+(e.questions||0),0);

  const brans = {};
  ['Türkçe','Matematik','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce'].forEach(d=>{
    brans[d] = soruE.filter(e=>e.subject===d).reduce((a,e)=>a+(e.questions||0),0);
  });

  // Aktif günler & streak
  const activeDays = [...new Set(soruE.map(e=>e.dateKey))].sort();
  let streak = 0;
  const todayKey = getTodayKey();
  let checkDay = todayKey;
  for (let i=0;i<365;i++) {
    if (activeDays.includes(checkDay)) { streak++; }
    else if (i>0) break;
    const d=new Date(checkDay+'T12:00:00'); d.setDate(d.getDate()-1);
    checkDay=d.toISOString().split('T')[0];
  }

  // Günlük toplamlar
  const byDay={};
  soruE.forEach(e=>{ byDay[e.dateKey]=(byDay[e.dateKey]||{q:0,min:0});
    byDay[e.dateKey].q+=(e.questions||0); byDay[e.dateKey].min+=(e.duration||0); });
  const goal1 = Object.values(byDay).filter(v=>v.q>=200).length;
  const maxDayMin = Math.max(0,...Object.values(byDay).map(v=>v.min));

  // Haftada 5 gün, ayda 20 gün
  let week5=0, month20=0;
  const allDayKeys = Object.keys(byDay).sort();
  for (let w=0;w<52;w++) {
    const wEnd=new Date(todayKey+'T12:00:00'); wEnd.setDate(wEnd.getDate()-w*7);
    const wStart=new Date(wEnd); wStart.setDate(wEnd.getDate()-7);
    const wk=allDayKeys.filter(k=>k>=wStart.toISOString().split('T')[0]&&k<=wEnd.toISOString().split('T')[0]);
    if(wk.length>=5) week5++;
  }
  const curMonth=todayKey.substring(0,7);
  if(allDayKeys.filter(k=>k.startsWith(curMonth)).length>=20) month20++;

  // 6 derste çalışılan gün
  let allSubDay=0;
  allDayKeys.forEach(dk=>{
    const dersler=new Set(soruE.filter(e=>e.dateKey===dk).map(e=>e.subject));
    if(dersler.size>=6) allSubDay++;
  });

  // İsabet
  let acc70=0,acc80=0,acc95=0,acc80streak=0,acc80cur=0;
  allDayKeys.forEach(dk=>{
    const de=soruE.filter(e=>e.dateKey===dk);
    const q=de.reduce((a,e)=>a+(e.questions||0),0);
    const d2=de.reduce((a,e)=>a+(e.correct||0),0);
    const pct=q>0?d2/q*100:0;
    if(pct>=70) acc70++;
    if(pct>=80){acc80++;acc80cur++;if(acc80cur>acc80streak)acc80streak=acc80cur;}else acc80cur=0;
    if(pct>=95) acc95++;
  });

  // Branş isabet
  let topBrans=0, balBrans=0;
  const subStats={};
  ['Türkçe','Matematik','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce'].forEach(d=>{
    const de=soruE.filter(e=>e.subject===d);
    const q=de.reduce((a,e)=>a+(e.questions||0),0);
    const c=de.reduce((a,e)=>a+(e.correct||0),0);
    subStats[d]={q,pct:q>0?Math.round(c/q*100):0};
  });
  if(Object.values(subStats).some(v=>v.q>=50&&v.pct>=90)) topBrans=1;
  if(Object.values(subStats).filter(v=>v.q>0).every(v=>v.pct>=60)) balBrans=1;

  // Wellness
  const wCache = (window._wellnessAllCache||{})[uid]||JSON.parse(localStorage.getItem('wellness_'+uid)||'{}');
  const days=wCache.days||{};
  const dayKeys=Object.keys(days).sort();
  const wellnessTotal=dayKeys.filter(k=>days[k]&&(days[k].mood||days[k].kaygi)).length;
  let wellnessStreak=0; let wc=todayKey;
  for(let i=0;i<365;i++){
    if(days[wc]&&(days[wc].mood||days[wc].kaygi)){wellnessStreak++;}
    else if(i>0) break;
    const d=new Date(wc+'T12:00:00'); d.setDate(d.getDate()-1); wc=d.toISOString().split('T')[0];
  }
  let goodMoodStreak=0,gmc=0;
  dayKeys.forEach(k=>{const m=days[k]?.mood;if(m==='good'||m==='excited'){gmc++;if(gmc>goodMoodStreak)goodMoodStreak=gmc;}else gmc=0;});
  let calmWeek=0;
  for(let w=0;w<52;w++){
    const we=new Date(todayKey+'T12:00:00'); we.setDate(we.getDate()-w*7);
    const ws=new Date(we); ws.setDate(we.getDate()-7);
    const wdk=dayKeys.filter(k=>k>=ws.toISOString().split('T')[0]&&k<=we.toISOString().split('T')[0]);
    const kv=wdk.map(k=>parseFloat(days[k]?.kaygi)||0).filter(v=>v>0);
    if(kv.length>0&&kv.reduce((a,b)=>a+b,0)/kv.length<5) calmWeek++;
  }
  let braveDay=0;
  dayKeys.forEach(k=>{if((parseFloat(days[k]?.kaygi)||0)>=8&&(byDay[k]?.q||0)>=10) braveDay++;});
  let bounceBack=0;
  for(let i=1;i<dayKeys.length;i++){
    const p=days[dayKeys[i-1]]?.mood, c=days[dayKeys[i]]?.mood;
    if((p==='anxious'||p==='sad'||p==='tired')&&(c==='good'||c==='excited')) bounceBack++;
  }
  let sleepStreak=0,ss=0;
  dayKeys.forEach(k=>{if((parseFloat(days[k]?.uyku)||0)>=7){ss++;if(ss>sleepStreak)sleepStreak=ss;}else ss=0;});
  let waterStreak=0,ws2=0;
  dayKeys.forEach(k=>{const v=days[k]?.su;if(v==='evet'||v==='yes'||parseFloat(v)>0){ws2++;if(ws2>waterStreak)waterStreak=ws2;}else ws2=0;});
  let energyStreak=0,es=0;
  dayKeys.forEach(k=>{if((parseFloat(days[k]?.enerji)||0)>=8){es++;if(es>energyStreak)energyStreak=es;}else es=0;});
  const diaryDays=dayKeys.filter(k=>days[k]?.not||days[k]?.pozitif||days[k]?.negatif).length;
  const openDays=dayKeys.filter(k=>(days[k]?.pozitif||'').length>2&&(days[k]?.negatif||'').length>2).length;
  const digitalFast=dayKeys.filter(k=>{const s=days[k]?.ekranSosyal;return s!==undefined&&s!==null&&s!==''&&(parseFloat(s)||0)===0;}).length;
  const productiveScreen=dayKeys.filter(k=>{const s=parseFloat(days[k]?.ekranSosyal)||0;const o=parseFloat(days[k]?.ekranOnline)||0;return s===0&&o>0&&days[k]?.ekranSosyal!==undefined;}).length;
  const last7m=dayKeys.slice(-7).map(k=>days[k]?.mood).filter(Boolean);
  const uniqueMoods7=new Set(last7m).size;
  const last14m=dayKeys.slice(-14).map(k=>days[k]?.mood).filter(Boolean);
  const uniqueMoods14=new Set(last14m).size;
  const fullDays=dayKeys.filter(k=>days[k]?.mood&&days[k]?.kaygi&&days[k]?.enerji&&days[k]?.uyku).length;

  // Deneme
  const examByKey={};
  denemE.forEach(e=>{
    const k=e.examId||e.dateKey;
    if(!examByKey[k]) examByKey[k]={net:0,dersler:{},dateKey:e.dateKey};
    const n=Math.max(0,(e.correct||0)-(e.wrong||0)/3);
    examByKey[k].net+=n;
    examByKey[k].dersler[e.subject]=(examByKey[k].dersler[e.subject]||0)+n;
  });
  const examList=Object.values(examByKey).sort((a,b)=>a.dateKey.localeCompare(b.dateKey));
  const examCount=examList.length;
  const examNets=examList.map(e=>Math.min(500,Math.max(100,Math.round(100+e.net*4.444))));
  let examRise=0,erc=0;
  for(let i=1;i<examNets.length;i++){if(examNets[i]>examNets[i-1]){erc++;}else erc=0;if(erc>examRise)examRise=erc;}
  const examBest=examNets.length>0?Math.max(...examNets):0;
  const examPeak=examNets.length>1&&examNets[examNets.length-1]===examBest?1:0;
  const examMax80=examList.some(e=>e.net>=80)?1:0;
  const examAllBrans=examList.some(e=>['Türkçe','Matematik','Fen Bilimleri','İnkılap Tarihi','Din Kültürü','İngilizce'].every(d=>(e.dersler[d]||0)>0))?1:0;
  const thisMonth2=todayKey.substring(0,7);
  const monthExams=examList.filter(e=>e.dateKey?.startsWith(thisMonth2));
  const examMonthBest=monthExams.length>0&&Math.max(...monthExams.map(e=>Math.round(100+e.net*4.444)))===examBest?1:0;

  return {totalQ,brans,streak,goal1,maxDayMin,week5,month20,allSubDay,
    acc70,acc80,acc80streak,acc95,topBrans,balBrans,
    wellnessTotal,wellnessStreak,goodMoodStreak,calmWeek,braveDay,bounceBack,
    sleepStreak,waterStreak,energyStreak,diaryDays,openDays,digitalFast,productiveScreen,
    uniqueMoods7,uniqueMoods14,fullDays,
    examCount,examRise,examBest,examPeak,examMax80,examAllBrans,examMonthBest};
}

// ── Rozet kazanım kontrolü ──────────────────────────────────
async function checkBadges() {
  const user=auth.currentUser;
  if(!user||currentRole!=='student') return;
  const uid=user.uid;
  const stats=computeBadgeStats(uid);
  const key='badges_'+uid;
  let earned=JSON.parse(localStorage.getItem(key)||'[]');
  const newBadges=[];
  BADGES.forEach(b=>{if(!earned.includes(b.id)&&b.check(stats)){earned.push(b.id);newBadges.push(b);}});
  if(newBadges.length>0){
    localStorage.setItem(key,JSON.stringify(earned));
    if(db) db.collection('badges').doc(uid).set({earned,updatedAt:new Date()}).catch(()=>{});
    for(const b of newBadges){ await showBadgeUnlocked(b); await new Promise(r=>setTimeout(r,2800)); }
  }
}

// ── Konfeti + kart animasyonu ───────────────────────────────
function showBadgeUnlocked(badge) {
  rozetBildirimiGonder(badge);
  return new Promise(resolve=>{
    const catColors={akademik:'#f9ca24',brans:'#6c63ff',psikoloji:'#e879f9',deneme:'#34d399'};
    const cc=catColors[badge.cat]||'#6c63ff';
    // Konfeti
    const cv=document.createElement('canvas');
    cv.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    cv.width=window.innerWidth; cv.height=window.innerHeight;
    document.body.appendChild(cv);
    const cx2=cv.getContext('2d');
    const parts=Array.from({length:90},()=>({
      x:Math.random()*cv.width, y:-20,
      vx:(Math.random()-0.5)*5, vy:Math.random()*4+2,
      color:['#6c63ff','#f9ca24','#ff6584','#43e97b','#00b4d8','#e879f9'][Math.floor(Math.random()*6)],
      size:Math.random()*9+4, rot:Math.random()*360, rv:(Math.random()-0.5)*10, shape:Math.random()>0.5?'rect':'circle'
    }));
    let fr=0;
    const anim=()=>{
      cx2.clearRect(0,0,cv.width,cv.height);
      parts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.rv; p.vy+=0.06;
        cx2.save(); cx2.translate(p.x,p.y); cx2.rotate(p.rot*Math.PI/180);
        cx2.fillStyle=p.color;
        if(p.shape==='circle'){cx2.beginPath();cx2.arc(0,0,p.size/2,0,Math.PI*2);cx2.fill();}
        else{cx2.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);}
        cx2.restore();
      });
      fr++;
      if(fr<140) requestAnimationFrame(anim); else cv.remove();
    };
    requestAnimationFrame(anim);
    // Kart
    const card=document.createElement('div');
    card.style.cssText=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);
      background:var(--surface);border:2px solid ${cc};border-radius:20px;
      padding:24px 32px;text-align:center;z-index:10000;min-width:240px;
      box-shadow:0 8px 40px rgba(0,0,0,0.5), 0 0 20px ${cc}44;
      transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1)`;
    card.innerHTML=`
      <div style="font-size:0.7rem;font-weight:800;letter-spacing:2px;color:${cc};margin-bottom:8px">🏆 YENİ ROZET!</div>
      <div style="display:flex;justify-content:center;margin-bottom:10px">${makeBadgeSVG(badge.form,badge.tier,badge.sym,false,72)}</div>
      <div style="font-size:1.15rem;font-weight:800;color:var(--text);margin-bottom:4px">${badge.name}</div>
      <div style="font-size:0.78rem;color:var(--text2)">${badge.desc}</div>`;
    document.body.appendChild(card);
    setTimeout(()=>card.style.transform='translate(-50%,-50%) scale(1)',30);
    setTimeout(()=>{card.style.transition='opacity 0.4s';card.style.opacity='0';setTimeout(()=>{card.remove();resolve();},400);},2400);
  });
}

// ── Rozet yükleme / kaydetme ────────────────────────────────
async function getBadges(uid) {
  if(db){
    try{
      const s=await db.collection('badges').doc(uid).get();
      if(s.exists){
        const e=s.data().earned||[];
        localStorage.setItem('badges_'+uid,JSON.stringify(e));
        return e;
      }
    } catch(e){ console.warn('getBadges hata:',e.message); }
  }
  // localStorage fallback
  return JSON.parse(localStorage.getItem('badges_'+uid)||'[]');
}

// ── Çerçeve sistemi ─────────────────────────────────────────
function getActiveFrame(uid){ return localStorage.getItem('frame_'+uid)||'none'; }
function setActiveFrame(uid,fid){
  localStorage.setItem('frame_'+uid,fid);
  if(db) db.collection('users').doc(uid).update({activeFrame:fid}).catch(()=>{});
  applyProfileFrame(uid,fid);
}
function applyProfileFrame(uid,frameId){
  const frame=FRAMES.find(f=>f.id===frameId)||FRAMES[0];
  const el=document.getElementById('headerAvatar');
  if(!el) return;
  el.style.border='none'; el.style.boxShadow='none';
  const old=document.getElementById('_frameOverlay');
  if(old) old.remove();
  if(frame.id==='none'||!frame.fn) return;
  const avSz=el.offsetWidth||42;
  const pad=10, totalSz=avSz+pad*2;
  const C=totalSz/2, R=avSz/2+2;
  const parent=el.parentElement;
  if(!parent) return;
  parent.style.position='relative'; parent.style.overflow='visible';
  const overlay=document.createElement('div');
  overlay.id='_frameOverlay';
  overlay.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:3;width:'+totalSz+'px;height:'+totalSz+'px';
  overlay.innerHTML='<svg width="'+totalSz+'" height="'+totalSz+'" viewBox="0 0 '+totalSz+' '+totalSz+'" xmlns="http://www.w3.org/2000/svg">'+frame.fn(C,R)+'</svg>';
  parent.appendChild(overlay);
}

function applyFrameToElement(el, frameId, avSz) {
  if(!el) return;
  // Eski overlay temizle
  const old=el.querySelector('._anyFrameOverlay');
  if(old) old.remove();
  const frame=FRAMES.find(f=>f.id===frameId);
  if(!frame||frame.id==='none'||!frame.fn) return;
  avSz=avSz||(el.offsetWidth||80);
  const pad=12, totalSz=avSz+pad*2;
  const C=totalSz/2, R=avSz/2+2;
  // Overlay'i doğrudan el'in içine ekle — parent'a değil
  el.style.position='relative';
  el.style.overflow='visible';
  const overlay=document.createElement('div');
  overlay.className='_anyFrameOverlay';
  overlay.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:3;width:'+totalSz+'px;height:'+totalSz+'px';
  overlay.innerHTML='<svg width="'+totalSz+'" height="'+totalSz+'" viewBox="0 0 '+totalSz+' '+totalSz+'" xmlns="http://www.w3.org/2000/svg">'+frame.fn(C,R)+'</svg>';
  el.appendChild(overlay);
}

// ── Rozet sayfası HTML ──────────────────────────────────────
async function badgesPageHTML(uid) {
  const earned=await getBadges(uid);
  const total=BADGES.length;
  const activeFrame=getActiveFrame(uid);
  const earnedCount=earned.length;
  const availFrames=FRAMES.filter(f=>earnedCount>=f.minBadge);

  const cats=[
    {id:'akademik',label:'📚 Akademik',  color:'#f9ca24'},
    {id:'brans',   label:'⭐ Branş',     color:'#6c63ff'},
    {id:'psikoloji',label:'💙 Psikoloji',color:'#e879f9'},
    {id:'deneme',  label:'🏆 Deneme',    color:'#34d399'},
  ];

  const catHTML=cats.map(cat=>{
    const cb=BADGES.filter(b=>b.cat===cat.id);
    const ce=cb.filter(b=>earned.includes(b.id)).length;
    return `<div style="margin-bottom:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-weight:800;font-size:0.88rem;color:var(--text)">${cat.label}</div>
        <div style="font-size:0.72rem;background:${cat.color}22;padding:3px 10px;border-radius:20px;font-weight:700;color:${cat.color}">${ce}/${cb.length}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
        ${cb.map(b=>{
          const has=earned.includes(b.id);
          return `<div style="text-align:center;padding:8px 4px;border-radius:14px;
            background:${has?cat.color+'18':'var(--surface2)'};
            border:1.5px solid ${has?cat.color:'var(--border)'};
            cursor:pointer"
            onclick="_rozetBilgiGoster(event)"
            data-ad="${b.name}" data-aciklama="${b.desc.replace(/"/g,'&quot;')}" data-has="${has}" data-renk="${cat.color}">
            ${getBadgeHTML(b,!has,52)}
            <div style="font-size:0.6rem;font-weight:700;margin-top:3px;line-height:1.2;color:${has?'var(--text)':'var(--text2)'}">${b.name}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');

  const frameHTML=`<div class="card" style="margin-top:16px">
    <div class="card-title">🖼️ Profil Çerçevesi Seç</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${FRAMES.map(f=>{
        const avail = earnedCount >= f.minBadge;
        const active = activeFrame === f.id;
        // Küçük önizleme SVG
        const pvSz = 48, pvC = pvSz/2, pvR = pvSz/2 - 2;
        const pvContent = f.fn ? f.fn(pvC, pvR) : '';
        const previewHTML = `<div style="position:relative;width:${pvSz}px;height:${pvSz}px;flex-shrink:0;overflow:visible">
          <div style="width:${pvSz}px;height:${pvSz}px;border-radius:50%;background:#1e2030;display:flex;align-items:center;justify-content:center;font-size:18px;position:relative;z-index:1">👤</div>
          ${pvContent ? `<svg width="${pvSz+16}" height="${pvSz+16}" viewBox="0 0 ${pvSz+16} ${pvSz+16}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:2" xmlns="http://www.w3.org/2000/svg">${f.fn((pvSz+16)/2,(pvSz)/2+2)}</svg>` : ''}
        </div>`;
        return `<button onclick="${avail ? `setActiveFrame('${uid}','${f.id}');showPage('badges')` : 'void(0)'}"
          style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:12px;
            border:2px solid ${active?'#6c63ff':'var(--border)'};
            background:${active?'#6c63ff18':'var(--surface2)'};
            cursor:${avail?'pointer':'not-allowed'};opacity:${avail?1:0.4};text-align:left;width:100%">
          ${previewHTML}
          <div style="flex:1">
            <div style="font-weight:700;font-size:0.85rem;color:var(--text)">${f.name}</div>
            <div style="font-size:0.72rem;color:var(--text2)">${f.id==='none'?'Varsayılan':f.minBadge+' rozet gerekli'}${active?' · Aktif ✓':''}</div>
          </div>
        </button>`;
      }).join('')}
    </div>
  </div>`;

  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
    <button onclick="showPage('profile')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:1.2rem">←</button>
    <div class="page-title" style="margin:0">🏆 Rozetlerim</div>
  </div>
  <div class="page-sub">${earnedCount} / ${total} rozet kazanıldı</div>
  <div style="background:var(--accent)22;border-radius:12px;padding:12px 14px;margin-bottom:20px">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
      <span style="font-size:0.82rem;color:var(--text2)">Genel İlerleme</span>
      <span style="font-size:0.82rem;font-weight:800;color:var(--accent)">${Math.round(earnedCount/total*100)}%</span>
    </div>
    <div style="background:var(--border);border-radius:6px;height:8px">
      <div style="background:linear-gradient(90deg,var(--accent),#a855f7);width:${Math.round(earnedCount/total*100)}%;height:8px;border-radius:6px;transition:width 0.6s"></div>
    </div>
  </div>
  ${catHTML}
  ${frameHTML}`;
}

// Rozet sayfasını göster (showPage sistemiyle entegre)
async function showBadgesPage() {
  const uid=auth.currentUser?.uid; if(!uid) return;
  const el=document.getElementById('mainContent');
  if(!el) return;
  el.innerHTML='<div style="text-align:center;padding:40px;color:var(--text2)">🏆 Rozetler yükleniyor...</div>';
  el.innerHTML=await badgesPageHTML(uid);
  applyProfileFrame(uid,getActiveFrame(uid));
}

// ============================================================
// BİLDİRİM SİSTEMİ — 3 KATMANLI FRAMEWORK
// ============================================================


// Rozet bilgi modalı
function _rozetBilgiGoster(e) {
  const el = e.currentTarget;
  const ad = el.dataset.ad || '';
  const aciklama = el.dataset.aciklama || '';
  const has = el.dataset.has === 'true';
  const renk = el.dataset.renk || '#6c63ff';

  let modal = document.getElementById('_rozetModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = '_rozetModal';
    modal.onclick = function(ev) { if(ev.target===modal) modal.style.display='none'; };
    document.body.appendChild(modal);
  }

  modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:3000;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = '<div style="background:var(--surface);border:1.5px solid var(--border);border-radius:18px;padding:22px 20px;max-width:280px;width:86%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.4)">'
    + '<div style="font-size:1.1rem;font-weight:900;margin-bottom:8px;color:var(--text)">' + ad + '</div>'
    + '<div style="font-size:.85rem;color:var(--text2);margin-bottom:14px;line-height:1.5">' + aciklama + '</div>'
    + '<div style="display:inline-block;padding:5px 16px;border-radius:99px;font-size:.78rem;font-weight:700;margin-bottom:16px;'
    + (has ? 'background:rgba(67,233,122,.15);color:#43e97b' : 'background:rgba(255,255,255,.08);color:var(--text2)') + '">'
    + (has ? '✅ Kazanıldı!' : '🔒 Henüz kazanılmadı') + '</div><br>'
    + '<button onclick="document.getElementById(\'_rozetModal\').style.display=\'none\'" '
    + 'style="background:var(--surface2);border:none;border-radius:10px;padding:9px 24px;font-size:.85rem;font-weight:700;cursor:pointer;color:var(--text);font-family:inherit">Tamam</button>'
    + '</div>';
}
