'use strict';
const data = JSON.parse(document.getElementById('report-data').textContent);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => Number(n).toLocaleString('en-US', {maximumFractionDigits: 1});
const get = path => path.split('.').reduce((o, k) => o?.[k], data);
const groupOf = id => (data.groups || []).find(g => g.id === id) || {label: id, color: 'var(--color-cat-5)'};
const exists = id => document.getElementById(id);

// Theme switch: dark by default, choice saved per browser.
const themeButton = $('#theme-toggle');
const syncTheme = () => {
  const light = document.documentElement.dataset.theme === 'light';
  themeButton.textContent = light ? 'Dark mode' : 'Light mode';
  themeButton.setAttribute('aria-pressed', String(light));
};
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('report-theme', next); } catch (e) {}
  syncTheme();
});
syncTheme();

// Text bindings: data-bind="engines.a" fills in a value from the data.
$$('[data-bind]').forEach(el => { const v = get(el.dataset.bind); if (v != null) el.textContent = v + (el.dataset.suffix || ''); });

// Compare table: same field from two sources; "Show only differences" hides equal rows.
if (exists('compare-table')) {
  const c = data.compare;
  const rows = c.rows.map(r => ({...r, same: String(r.a).trim() === String(r.b).trim()}));
  const render = () => {
    const only = $('#diff-only').checked, shown = rows.filter(r => !only || !r.same);
    $('#compare-table').innerHTML = `<thead><tr>${c.columns.map(h => `<th scope="col">${esc(h)}</th>`).join('')}<th scope="col">Result</th></tr></thead><tbody>` +
      shown.map(r => `<tr class="${r.same ? 'same' : 'diff'}"><td>${esc(r.field)}</td><td>${esc(r.a)}</td><td>${esc(r.b)}</td><td class="status">${r.same ? 'Same' : 'Different'}</td></tr>`).join('') + '</tbody>';
    const diffs = rows.filter(r => !r.same).length;
    $('#compare-count').textContent = `${diffs} of ${rows.length} fields differ`;
  };
  $('#diff-only').addEventListener('change', render);
  render();
}

// Explainer views: the toggle shows view a, view b, or both.
$$('[data-views]').forEach(ex => {
  const buttons = [...ex.querySelectorAll('.views-toggle button')];
  buttons.forEach(b => b.addEventListener('click', () => {
    ex.dataset.view = b.dataset.view;
    buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));
});

// Rule map: names grouped in columns, a detail strip for the selected rule, and an optional full list.
if (exists('rule-map')) {
  const c = data.catalog; let selected = c.selected || c.items[0].id;
  const groupLabel = id => (c.groups.find(g => g.id === id) || {label: id}).label;
  const figure = (id, side) => { const t = document.getElementById(`${id}-${side}`); return t ? `<div class="fig">${t.innerHTML}</div>` : ''; };
  $('#rule-map').style.setProperty('--cols', c.groups.length);
  $('#rule-map').innerHTML = c.groups.map(g => {
    const items = c.items.filter(i => i.group === g.id);
    return `<div class="rule-group"><header><span>${esc(g.label)}</span><b>${items.length}</b></header>${items.map(i => `<button type="button" class="rule" data-id="${esc(i.id)}" aria-pressed="false">${esc(i.name)}</button>`).join('')}</div>`;
  }).join('');
  const select = id => {
    selected = id; const r = c.items.find(i => i.id === id), n = c.items.indexOf(r) + 1;
    $('#rule-detail').innerHTML = `<div><span class="eyebrow">${esc(groupLabel(r.group))} · ${n}</span><h3>${esc(r.name)}</h3></div>` +
      `<div class="rule-side accepts">${figure(r.id, 'accepts')}<div><span class="eyebrow">✓ Accepts</span><p>${esc(r.accepts)}</p></div></div>` +
      `<div class="rule-side rejects">${figure(r.id, 'rejects')}<div><span class="eyebrow">✕ Rejects</span><p>${esc(r.rejects)}</p></div></div>`;
    $$('.rule').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
  };
  $$('.rule').forEach(b => b.addEventListener('click', () => select(b.dataset.id)));
  $('#rule-table').innerHTML = `<thead><tr><th scope="col">Rule</th><th scope="col">Accepts</th><th scope="col">Rejects</th></tr></thead><tbody>` +
    c.items.map(i => `<tr><td>${esc(i.name)}<br><span class="meta">${esc(groupLabel(i.group))}</span></td><td>${esc(i.accepts)}</td><td>${esc(i.rejects)}</td></tr>`).join('') + '</tbody>';
  $('#rule-list-toggle').addEventListener('click', e => {
    const open = $('#rule-list').hidden; $('#rule-list').hidden = !open;
    e.currentTarget.setAttribute('aria-pressed', String(open));
    e.currentTarget.textContent = open ? 'Hide the full list' : 'Show every rule in full';
  });
  select(selected);
}

// Stepper flow: tabs choose a case. A case marks parts and lists its path. No animation.
if (exists('flow')) {
  const f = data.flow, svg = $('#flow'), parts = [...svg.querySelectorAll('[data-node]')];
  const part = k => svg.querySelector(`[data-node="${k}"]`);
  const show = id => {
    const s = f.cases.find(x => x.id === id);
    parts.forEach(p => p.classList.remove('reached', 'is-on', 'is-bad', 'is-ok', 'is-held'));
    Object.entries(s.marks).forEach(([k, v]) => part(k)?.classList.add('is-' + v));
    s.path.forEach(k => part(k)?.classList.add('reached'));
    $('#flow-caption').innerHTML = s.caption.split('\n').map(esc).join('<br>↳ ');
    $$('#flow-cases button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.case === id)));
  };
  $('#flow-cases').innerHTML = f.cases.map(s => `<button type="button" data-case="${esc(s.id)}" aria-pressed="false">${esc(s.label)}</button>`).join('');
  $$('#flow-cases button').forEach(b => b.addEventListener('click', () => show(b.dataset.case)));
  show(f.start || f.cases[0].id);
}

// Race: recorded medians as bars.
if (exists('race-tracks')) {
  let task = Object.keys(data.race)[0];
  const render = () => {
    const r = data.race[task], max = Math.max(r.a.p50, r.b.p50);
    $('#race-tabs').innerHTML = Object.entries(data.race).map(([k, v]) => `<button type="button" data-task="${k}" aria-pressed="${k === task}">${esc(v.label)}</button>`).join('');
    $('#race-meta').textContent = `Median time · ${r.count} for each reader · ${r.unit}`;
    $('#race-tracks').innerHTML = ['a', 'b'].map(e => `<div class="race-track"><header><span>${esc(data.engines[e])}</span><strong>${fmt(r[e].p50)} ${r.unit}</strong></header><div class="track"><div class="bar ${e}" data-engine="${e}" style="--width:${r[e].p50 / max * 100}%"></div></div></div>`).join('');
    $('#race-p95').textContent = `p95 · ${fmt(r.a.p95)} / ${fmt(r.b.p95)} ${r.unit}`;
    $$('#race-tabs button').forEach(b => b.addEventListener('click', () => { task = b.dataset.task; render(); }));
  };
  render();
}

// Breakdown: total, proportional stack, ledger.
if (exists('breakdown-rows')) {
  const b = data.breakdown, sum = b.rows.reduce((t, r) => t + r.value, 0);
  $('#breakdown-tag').textContent = b.tag;
  $('#breakdown-total').innerHTML = `${esc(b.total)}<small>${esc(b.unit)}</small>`;
  $('#breakdown-detail').textContent = b.detail;
  $('#breakdown-stack').innerHTML = b.rows.map(r => `<span style="width:${r.value / sum * 100}%;background:${r.color}"></span>`).join('');
  $('#breakdown-rows').innerHTML = b.rows.map(r => `<tr><td>${esc(r.label)} <small>· ${esc(r.note)}</small></td><td>${esc(r.display)}</td></tr>`).join('');
}

// Status grid: filter -> tiles -> detail box.
if (exists('tile-grid')) {
  let selected = data.items[0].id;
  const n = data.items.length, correct = e => data.items.filter(i => i[e].ok).length;
  $('#explorer-tag').textContent = `${data.engines.a} ${correct('a')} of ${n} · ${data.engines.b} ${correct('b')} of ${n}`;
  $('#group-filter').innerHTML += data.groups.map(g => `<option value="${g.id}">${esc(g.label)} (${data.items.filter(i => i.group === g.id).length})</option>`).join('');
  const detail = id => {
    selected = id; const d = data.items.find(i => i.id === id);
    $('#detail-box').innerHTML = `<div><span class="meta">${esc(d.id.toUpperCase())} · ${d.pages} ${d.pages === 1 ? 'page' : 'pages'} · ${esc(groupOf(d.group).label)}</span><h3>${esc(d.title)}</h3><a class="meta" href="${esc(d.href)}">Open the original ↗</a></div>` +
      ['a', 'b'].map(e => `<div class="detail-result"><small>${esc(data.engines[e])}</small><p>${d[e].ok ? 'Correct' : 'Wrong'}: ${esc(d[e].value)}</p><strong>${fmt(d[e].ms)} ms</strong><p>${d[e].flag ? 'Marked for review' : 'Not marked for review'}</p></div>`).join('');
    $$('.tile').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.id === id)));
  };
  const tiles = () => {
    const g = $('#group-filter').value, items = data.items.filter(i => g === 'all' || i.group === g);
    $('#tile-grid').innerHTML = items.map(d => `<button type="button" class="tile" data-id="${d.id}" aria-label="${esc(d.title)}. ${esc(data.engines.a)} ${d.a.ok ? 'correct' : 'wrong'}, ${esc(data.engines.b)} ${d.b.ok ? 'correct' : 'wrong'}."><i class="sheet-icon" aria-hidden="true"></i><span class="id">${esc(d.id.toUpperCase())}</span><span class="marks" aria-hidden="true"><span class="${d.a.ok ? 'a' : 'miss'}">${d.a.ok ? '✓' : '✕'}</span><span class="${d.b.ok ? 'b' : 'miss'}">${d.b.ok ? '✓' : '✕'}</span></span></button>`).join('');
    $$('.tile').forEach(t => t.addEventListener('click', () => detail(t.dataset.id)));
    detail(items.some(i => i.id === selected) ? selected : items[0].id);
  };
  $('#group-filter').addEventListener('change', tiles);
  tiles();
}

// Segment strips: one row per source, one span per segment.
if (exists('strip-rows')) {
  const render = id => {
    const p = data.packets.find(x => x.id === id);
    $$('#packet-tabs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.packet === id)));
    $('#strip-summary').innerHTML = `<div><h3>${esc(p.id.toUpperCase())} · ${p.units} pages</h3><p>${esc(p.summary)}</p></div><span class="tag">${esc(p.status)}</span>`;
    $('#strip-rows').innerHTML = p.rows.map(r => `<div class="strip-row"><header>${esc(r.label)}<small>${esc(r.note)}</small></header><div class="strip" style="--units:${p.units}">${r.segments.map(s => `<div class="segment${s.flag ? ' flag' : ''}" style="grid-column:${s.from}/span ${s.to - s.from + 1};background:${groupOf(s.group).color}" title="${esc(groupOf(s.group).label)}, pages ${s.from} to ${s.to}"><span>${esc(groupOf(s.group).label)}</span><small>${s.from === s.to ? s.from : s.from + '–' + s.to}</small></div>`).join('')}</div></div>`).join('');
    $('#strip-caption').textContent = p.caption;
  };
  $('#packet-tabs').innerHTML = data.packets.map(p => `<button type="button" data-packet="${p.id}" aria-pressed="false">${esc(p.id.toUpperCase())}${p.flagged ? '<span class="flag-dot" aria-hidden="true"></span>' : ''}</button>`).join('');
  $$('#packet-tabs button').forEach(b => b.addEventListener('click', () => render(b.dataset.packet)));
  $('#strip-key').innerHTML = data.groups.map(g => `<span><i style="background:${g.color}"></i>${esc(g.label)}</span>`).join('');
  render(data.packets[0].id);
}

// Findings: tiles show one finding; "Show all" shows every finding.
if (exists('finding-grid')) {
  const tiles = $$('.finding-tile'), findings = tiles.map(t => document.getElementById(t.dataset.target));
  const select = id => {
    findings.forEach(f => { f.hidden = f.id !== id; });
    tiles.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.target === id)));
    const code = tiles.find(t => t.dataset.target === id).querySelector('code').textContent;
    $('#finding-status').textContent = `Showing ${code}.`;
  };
  tiles.forEach(t => t.addEventListener('click', () => select(t.dataset.target)));
  $('#show-all-findings').addEventListener('click', () => {
    findings.forEach(f => { f.hidden = false; }); tiles.forEach(t => t.setAttribute('aria-pressed', 'false'));
    $('#finding-status').textContent = `Showing all ${findings.length} findings.`;
  });
  select(tiles[0].dataset.target);
}

// Zoom dialog: images with data-zoom, and diagrams inside data-expand.
const dialog = $('#zoom-dialog');
const openZoom = (title, img, body) => {
  $('#zoom-title').textContent = title;
  $('#zoom-img').hidden = !img; $('#zoom-body').hidden = !body;
  if (img) { $('#zoom-img').src = img.src; $('#zoom-img').alt = img.alt; }
  $('#zoom-body').innerHTML = ''; if (body) $('#zoom-body').append(body);
  dialog.showModal();
};
$$('[data-zoom]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); const img = link.querySelector('img');
  openZoom(link.dataset.zoomTitle || img.alt, img, null);
}));
$$('[data-expand]').forEach(box => {
  const title = box.dataset.expand || (box.matches('figure') && box.querySelector('h3')?.textContent) || box.closest('section')?.querySelector('h2')?.textContent || '';
  const open = () => {
    const wrap = document.createElement('div');
    wrap.className = 'explainer bare'; if (box.dataset.view) wrap.dataset.view = box.dataset.view;
    wrap.append((box.querySelector('.views') || box.querySelector('.dx-wide') || box.querySelector('.dx')).cloneNode(true));
    openZoom(title, null, wrap);
  };
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'expand'; button.textContent = 'Expand ⤢'; button.setAttribute('aria-label', `Expand the diagram: ${title}`);
  button.addEventListener('click', open); box.prepend(button);
  box.querySelectorAll('.dx').forEach(svg => svg.addEventListener('click', open));
});
$('#zoom-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

window.reportReady = true;
