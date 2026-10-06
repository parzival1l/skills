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

// Diagrams: <div data-diagram="key"> draws data.diagrams[key]. Each kind has one fixed style:
// shapes carry the meaning, labels stay short. See COMPONENTS.md for the specs.
const diagram = (() => {
  const T = (x, y, s, cls = '', a = 'start') => `<text x="${x}" y="${y}" text-anchor="${a}"${cls ? ` class="${cls}"` : ''}>${esc(s)}</text>`;
  const L = (x, y, s, a = 'start') => T(x, y, String(s).toUpperCase(), 'lbl', a);
  const many = (x, y, arr, cls, a = 'start', lh = 18) => [].concat(arr || []).map((s, i) => T(x, y + i * lh, s, cls, a)).join('');
  const svg = (w, h, body, label) => `<svg class="dx" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label || '')}">${body}</svg>`;
  const arrow = (x1, x2, y, attrs = '') => `<g ${attrs}><line class="line" x1="${x1}" y1="${y}" x2="${x2 - 6}" y2="${y}"/><path class="tip" d="M${x2} ${y}l-7-4v8z"/></g>`;
  const caption = c => c ? `<p class="caption">${[].concat(c).map(esc).join('<br>↳ ')}</p>` : '';
  const textWidth = s => String(s).length * 8.4;
  const has = (list, i) => (list || []).includes(i);
  const diamond = (x, y, r = 14, cls = 'gate') => `<path class="${cls}" d="M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z"/>`;
  const pageIcon = (x, y) => `<rect class="page" x="${x - 18}" y="${y - 24}" width="36" height="46" rx="3"/><line class="tick" x1="${x - 10}" y1="${y - 10}" x2="${x + 10}" y2="${y - 10}"/><line class="tick" x1="${x - 10}" y1="${y - 2}" x2="${x + 10}" y2="${y - 2}"/><line class="tick" x1="${x - 10}" y1="${y + 6}" x2="${x + 4}" y2="${y + 6}"/>`;

  // Two views of one diagram, with tabs: a, b, and both.
  const views = (box, s, a, b) => {
    box.dataset.views = ''; box.dataset.view = 'both';
    const [ta, tb] = s.tabs || ['Before', 'After'], cap = s.caption || {};
    return `<div class="explainer-bar"><div class="tabs views-toggle" aria-label="Choose view"><button type="button" data-view="a" aria-pressed="false">${esc(ta)}</button><button type="button" data-view="b" aria-pressed="false">${esc(tb)}</button><button type="button" data-view="both" aria-pressed="true">Side by side</button></div></div>` +
      `<div class="views"><figure class="view a" style="margin:0">${s.titles ? `<h3>${esc(s.titles[0])}</h3>` : ''}${a}${caption(cap.a)}</figure><figure class="view b" style="margin:0">${s.titles ? `<h3>${esc(s.titles[1])}</h3>` : ''}${b}${caption(cap.b)}</figure></div>`;
  };

  const kinds = {
    // Same inputs, two routes. a: everything through one node. b: one lane per input, then a gate.
    route(s, box) {
      const n = s.inputs.length, ys = s.inputs.map((_, i) => 66 + i * 45), mid = (ys[0] + ys[n - 1]) / 2, h = 45 * n + 70;
      const group = `${L(8, 18, s.group || 'Inputs')}<rect class="group" x="4" y="34" width="210" height="${45 * n + 20}" rx="8"/>`;
      const bf = s.before || {}, af = s.after || {};
      const a = svg(520, h, group + s.inputs.map((t, i) => `<g class="${has(bf.bad, i) ? 'is-bad' : ''}">${T(20, ys[i] + 5, t)}<rect class="box" x="188" y="${ys[i] - 6}" width="12" height="12" rx="2"/><line class="line" x1="214" y1="${ys[i]}" x2="300" y2="${mid}"/></g>`).join('') +
        `<rect class="node" x="300" y="${mid - 20}" width="40" height="40" rx="4"/><line class="tick" x1="308" y1="${mid - 7}" x2="332" y2="${mid - 7}"/><line class="tick" x1="308" y1="${mid}" x2="332" y2="${mid}"/><line class="tick" x1="308" y1="${mid + 7}" x2="332" y2="${mid + 7}"/>` +
        L(320, mid - 33, bf.node || '', 'middle') + L(320, mid + 43, bf.sub || '', 'middle') + arrow(348, 390, mid) +
        many(400, mid - ((bf.notes || []).length - 1) * 9 + 5, bf.notes, 'bad-t'), s.aria?.[0]);
      const b = svg(520, h, group + (af.head ? L(266, 18, af.head) : '') + s.inputs.map((t, i) => {
        const bad = has(af.bad, i), lane = (af.lanes || [])[i] || '';
        return `<g class="${bad ? 'is-bad' : 'is-on'}">${T(20, ys[i] + 5, t)}<rect class="box" x="188" y="${ys[i] - 6}" width="12" height="12" rx="2"/><line class="line" x1="214" y1="${ys[i]}" x2="238" y2="${ys[i]}"/><circle class="dot" cx="250" cy="${ys[i]}" r="8"/><circle class="pip" cx="250" cy="${ys[i]}" r="2.4"/>${T(266, ys[i] + 5, lane, bad ? 'bad-t' : 'on-t')}<line class="line" x1="${Math.min(274 + textWidth(lane), 400)}" y1="${ys[i]}" x2="422" y2="${mid}"/></g>`;
      }).join('') + diamond(436, mid) + L(436, mid + 41, af.gate || '', 'middle') + arrow(454, 488, mid) + `<circle class="okc" cx="502" cy="${mid}" r="8"/>` + L(514, mid - 25, af.end || '', 'end'), s.aria?.[1]);
      return views(box, s, a, b);
    },

    // One grid drawn twice. a: the focused heading leaks into the last row. b: each scope stops above it.
    scope(s, box) {
      const g = s.groups.length, gw = 372 / g, rows = s.values || [[], []], Y1 = 72, last = Y1 + 38 * (1 + rows.length), h = last + 38 + 16, f = s.focus ?? Math.floor(g / 2);
      const grid = leak => s.groups.map((_, i) => `<rect class="scope${i === f ? ' focus' : ''}" x="${4 + i * gw + 3}" y="${Y1 + 3}" width="${gw - 6}" height="${(leak ? last + 38 : last) - Y1 - 6}" rx="3"/>`).join('') +
        (leak ? `<rect class="spill" x="7" y="${last + 3}" width="366" height="32" rx="3"/>` : '') +
        `<rect class="box" x="4" y="34" width="372" height="${last + 38 - 34}"/>` + [Y1, ...rows.map((_, r) => Y1 + 38 * (r + 1)), last].map(y => `<line class="line" x1="4" y1="${y}" x2="376" y2="${y}"/>`).join('') +
        s.groups.slice(1).map((_, i) => `<line class="line" x1="${4 + (i + 1) * gw}" y1="${Y1}" x2="${4 + (i + 1) * gw}" y2="${last}"/>`).join('') +
        T(190, 58, s.title || '', '', 'middle') + s.groups.map((t, i) => T(4 + i * gw + gw / 2, Y1 + 24, t, 'on-t', 'middle')).join('') +
        rows.map((row, r) => row.map((v, i) => T(4 + i * gw + gw / 2, Y1 + 38 * (r + 1) + 24, v, 'mono mut', 'middle')).join('')).join('') +
        T(190, last + 24, leak ? `${s.last || 'Last row'} · labeled ${s.groups[f]}` : (s.last || 'Last row'), leak ? 'bad-t' : '', 'middle');
      const notes = s.notes || {};
      const a = svg(520, h, L(8, 18, (s.tabs || ['Before'])[0]) + grid(true) + `<line class="line" x1="384" y1="${last + 19}" x2="398" y2="${last + 19}" style="stroke:var(--color-warn)"/>` + many(404, last + 14, notes.a, 'bad-t', 'start', 17), s.aria?.[0]);
      const b = svg(520, h, L(8, 18, (s.tabs || ['', 'After'])[1]) + grid(false) + `<path class="bracket-a" d="M386 ${Y1 + 7}h8v${last - Y1 - 14}h-8"/>` + many(402, (Y1 + last) / 2 - 4, notes.b, 'on-t', 'start', 17) + many(402, last + 14, notes.last, '', 'start', 17), s.aria?.[1]);
      return views(box, s, a, b);
    },

    // A process: steps, a gate, the end. A failed gate loops back; repeated failure ends in a hold. Tabs choose the case.
    flow(s, box) {
      const st = s.steps, n = st.length, gi = st.findIndex(x => x.shape === 'gate'), Y = 80;
      const x0 = Math.max(48, String(st[0].label).length * 4.6 + 8, String(st[0].sub || '').length * 4.4 + 8), xs = st.map((_, i) => Math.round(x0 + i * (880 - x0) / (n - 1)));
      const rad = x => x.shape === 'page' ? 18 : x.shape === 'gate' ? 18 : x.dots ? (x.dots - 1) * 11 + 7 : 12;
      const tx = xs[st.findIndex(x => x.id === (s.loop || {}).to)] ?? xs[Math.max(gi - 2, 0)], gx = xs[gi];
      let body = st.map((x, i) => {
        let shape;
        if (x.shape === 'page') shape = pageIcon(xs[i], Y);
        else if (x.shape === 'gate') shape = diamond(xs[i], Y, 18);
        else if (x.dots) shape = Array.from({length: x.dots}, (_, k) => `<circle class="ring" cx="${xs[i] - (x.dots - 1) * 11 + k * 22}" cy="${Y}" r="7"/>`).join('');
        else shape = `<circle class="ring" cx="${xs[i]}" cy="${Y}" r="12"/>${x.shape === 'review' ? `<circle class="dot" cx="${xs[i]}" cy="${Y}" r="3.5"/>` : ''}`;
        return `<g data-node="${esc(x.id)}">${L(xs[i], 32, x.label, 'middle')}${shape}${x.sub ? T(xs[i], 132, x.sub, 'mut halo', 'middle') : ''}</g>`;
      }).join('');
      body += st.slice(1).map((x, i) => arrow(xs[i] + rad(st[i]) + 12, xs[i + 1] - rad(x) - 12, Y, `data-node="e${i}"`)).join('');
      body = `<g data-node="loop"><path class="line dash" d="M${gx} ${Y + 20}V196H${tx}V${Y + 20}"/><path class="tip" d="M${tx} ${Y + 14}l-4 8h8z"/>${T((gx + tx) / 2, 224, (s.loop || {}).note || '', 'mut', 'middle')}</g>` + body;
      body += `<g data-node="branch"><path class="line dash" d="M${gx + 10} ${Y + 12}L${gx + 70} 170H${gx + 106}"/></g><g data-node="held"><circle class="ring" cx="${gx + 120}" cy="170" r="10"/>${T(gx + 140, 175, s.held || 'held', 'mut')}</g>`;
      const att = s.attempts || 0;
      body += att ? L(tx - 140, 256, 'Attempt', 'end') + Array.from({length: att}, (_, k) => `<g data-node="a${k + 1}"><circle class="ring" cx="${tx - 110 + k * 30}" cy="252" r="9"/><text class="num-t" x="${tx - 110 + k * 30}" y="256" text-anchor="middle">${k + 1}</text></g>`).join('') : '';
      const html = `<div class="explainer-bar"><div class="tabs flow-cases" aria-label="Choose a case">${(s.cases || []).map((c, i) => `<button type="button" data-case="${i}" aria-pressed="false">${esc(c.tab)}</button>`).join('')}</div></div><div class="dx-wide">${svg(1088, 270, body, s.aria).replace('class="dx"', 'class="dx stepper"')}</div><p class="caption flow-caption"></p>`;
      const init = () => {
        const root = box.querySelector('.stepper'), part = k => root.querySelector(`[data-node="${k}"]`);
        const show = i => {
          const c = s.cases[i], fails = c.fails || 0;
          root.querySelectorAll('[data-node]').forEach(p => p.classList.remove('reached', 'is-on', 'is-bad', 'is-ok', 'is-held'));
          st.forEach((x, k) => { if (k <= gi) part(x.id).classList.add('reached'); if (x.state) part(x.id).classList.add('is-' + x.state); if (k < gi) part('e' + k)?.classList.add('reached'); });
          for (let k = 1; k <= Math.min(fails, att); k++) part('a' + k)?.classList.add('reached', 'is-bad');
          if (fails) part('loop').classList.add('reached', 'is-bad');
          if (c.reach === 'held') { part('branch').classList.add('reached'); part('held').classList.add('reached', 'is-held'); }
          else { part('a' + (fails + 1))?.classList.add('reached', 'is-on'); part('e' + gi)?.classList.add('reached', 'is-ok'); const end = part(st[n - 1].id); end.classList.add('reached', 'is-ok'); }
          box.querySelector('.flow-caption').innerHTML = [].concat(c.caption || []).map(esc).join('<br>↳ ');
          box.querySelectorAll('.flow-cases button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.case === i)));
        };
        box.querySelectorAll('.flow-cases button').forEach(b => b.addEventListener('click', () => show(+b.dataset.case)));
        show(s.start ?? 0);
      };
      return {html, init};
    },

    // Small multiples: two to four small diagrams side by side.
    multiples(s) {
      return `<div class="multiples">${s.items.map(it => `<figure data-expand><h3>${esc(it.title)}</h3>${kinds[it.diagram.kind](it.diagram)}${caption(it.caption)}</figure>`).join('')}</div>`;
    },

    // A list where some items are held and the rest pass.
    split(s) {
      const ys = s.items.map((_, i) => 44 + i * 36), h = ys[ys.length - 1] + 22, mid = ys[Math.floor(ys.length / 2)];
      return svg(340, h, L(78, 16, s.left || 'Before', 'middle') + `<line class="line" x1="96" y1="44" x2="96" y2="${ys[ys.length - 1]}"/>` +
        s.items.map((t, i) => T(80, ys[i] + 5, t, '', 'end') + `<circle class="ring" cx="96" cy="${ys[i]}" r="8"/>`).join('') + arrow(124, 164, mid) +
        L(200, 16, s.right || 'After', 'middle') + `<line class="line" x1="190" y1="44" x2="190" y2="${ys[ys.length - 1]}"/>` +
        s.items.map((t, i) => has(s.held, i) ? `<path class="line dash" d="M190 ${ys[i]}H232"/><circle class="heldc" cx="244" cy="${ys[i]}" r="8"/>${T(260, ys[i] + 5, s.hold || 'held', 'held-t')}` : `<circle class="okc" cx="190" cy="${ys[i]}" r="8"/>${T(206, ys[i] + 5, `${t} ${s.ok || ''}`.trim())}`).join(''), s.aria);
    },

    // One whole made of parts. One bad part holds the whole; the good parts never go alone.
    parts(s) {
      const n = s.parts.length, mid = 30 + (50 * n + 20) / 2, h = 50 * n + 60;
      return svg(340, h, L(8, 16, s.group || 'One item') + `<rect class="group" x="4" y="30" width="130" height="${50 * n + 20}" rx="8"/>` +
        s.parts.map((t, i) => { const bad = has(s.bad, i), y = 44 + i * 50; return `<g class="${bad ? 'is-bad' : ''}"><rect class="ring" x="18" y="${y}" width="102" height="38" rx="3"/>${T(30, y + 24, t, bad ? 'bad-t' : '')}${T(106, y + 24, bad ? '✕' : '✓', bad ? 'bad-t' : 'ok-t', 'middle')}</g>`; }).join('') +
        `<g class="is-bad"><line class="line dash" x1="140" y1="${mid}" x2="196" y2="${mid - 50}"/></g><circle class="badc" cx="208" cy="${mid - 54}" r="8"/><line x1="202" y1="${mid - 60}" x2="214" y2="${mid - 48}" style="stroke:var(--color-warn);stroke-width:1.5"/>` +
        many(224, mid - 58, s.reject, 'bad-t') + arrow(140, 196, mid + 25) + `<circle class="heldc" cx="208" cy="${mid + 25}" r="8"/>` + many(224, mid + 21, s.result, 'held-t'), s.aria);
    },

    // Every attempt fails, so the item is held. The count of tries is not approval.
    attempts(s) {
      const c = s.count || 3, xs = Array.from({length: c}, (_, k) => 30 + k * 60), last = xs[c - 1];
      return svg(340, 210, L(8, 16, s.label || 'Attempts') + `<line class="line" x1="30" y1="70" x2="${last}" y2="70"/>` +
        `<g class="is-bad">${xs.map((x, k) => `<circle class="ring" cx="${x}" cy="70" r="12"/><text class="num-t" x="${x}" y="74" text-anchor="middle">${k + 1}</text>`).join('')}</g>` +
        T((30 + last) / 2, 108, s.fail || '', 'bad-t', 'middle') + arrow(last + 22, last + 82, 70) + `<circle class="heldc" cx="${last + 100}" cy="70" r="12"/>` + T(last + 100, 108, s.result || 'held', 'held-t', 'middle') +
        `<path class="line dash" d="M${last + 100} 120V160H${last + 136}"/><circle class="ring" cx="${last + 150}" cy="160" r="9"/><line x1="${last + 143}" y1="153" x2="${last + 157}" y2="167" style="stroke:var(--color-warn);stroke-width:1.5"/>` + T(240, 196, s.note || '', 'mut', 'middle'), s.aria);
    },

    // A row of steps with brackets under it: what a claim covers, and what it does not.
    brackets(s) {
      const n = s.steps.length, xs = s.steps.map((_, i) => Math.round(80 + i * (700 / Math.max(n - 1, 1)))), Y = 70;
      const shape = (x, k) => k === 'page' ? `<rect class="page" x="${x - 24}" y="40" width="48" height="60" rx="3"/><line class="tick" x1="${x - 16}" y1="56" x2="${x + 16}" y2="56"/><line class="tick" x1="${x - 16}" y1="64" x2="${x + 8}" y2="64"/><line class="tick" x1="${x - 16}" y1="72" x2="${x + 16}" y2="72"/>`
        : k === 'gate' ? diamond(x, Y, 18) : k === 'pair' ? `<circle class="dot" cx="${x - 14}" cy="${Y}" r="10"/><circle cx="${x + 14}" cy="${Y}" r="10" style="fill:var(--color-secondary)"/>` : k === 'dot' ? `<circle class="dot" cx="${x}" cy="${Y}" r="12"/>` : `<circle class="ring" cx="${x}" cy="${Y}" r="12"/>`;
      const r = k => k === 'page' ? 24 : k === 'pair' ? 24 : 18;
      let body = s.steps.map((st, i) => L(xs[i], 20, st.label, 'middle') + shape(xs[i], st.shape)).join('');
      body += s.steps.slice(1).map((st, i) => arrow(xs[i] + r(s.steps[i].shape) + 12, xs[i + 1] - r(st.shape) - 10, Y)).join('');
      const tail = s.steps[n - 1];
      if (tail.note) body += many(xs[n - 1] + 40, Y - 6, tail.note, '');
      body += (s.brackets || []).map(b => { const x1 = xs[b.from] - 60, x2 = xs[b.to] + 60, held = b.tone === 'held'; return `<path class="${held ? 'bracket-b' : 'bracket-a'}" d="M${x1} 116v10h${x2 - x1}v-10"/>${T((x1 + x2) / 2, 154, b.label, held ? 'held-t' : 'on-t', 'middle')}${T((x1 + x2) / 2, 174, b.note || '', 'mut', 'middle')}`; }).join('');
      return `<div class="dx-wide">${svg(1144, 200, body, s.aria)}</div>`;
    },

    // Two lanes with a gate between them, for example people who approve and agents who build.
    lanes(s) {
      const [top, bottom] = s.lanes; let x = 110, body = L(0, 55, top.label);
      top.items.forEach(t => { const w = String(t).length * 8.6 + 28; body += `<rect class="ring" x="${x}" y="34" width="${w}" height="32" rx="3" style="stroke:var(--color-ink)"/>${T(x + w / 2, 55, t, 'mono', 'middle')}`; x += w + 12; });
      const gx = Math.round(x + 70); let sx = 170;
      body += arrow(x + 6, gx - 24, 50) + diamond(gx, 50, 22, 'heldc') + T(gx + 34, 55, s.gate || 'approve', 'held-t');
      body += `<line class="line" x1="0" y1="112" x2="1144" y2="112" style="stroke:var(--color-line)"/>` + L(0, 175, bottom.label) + `<path class="line dash" d="M${gx} 76V136H${sx}V160"/>`;
      bottom.items.forEach((t, i) => {
        body += `<circle class="heldc" cx="${sx}" cy="170" r="8" style="stroke:var(--color-line-strong)"/>${T(sx, 204, t, 'mut', 'middle')}`;
        const next = bottom.items[i + 1]; if (next) { const nx = sx + Math.max(120, (String(t).length + String(next).length) * 4.4 + 40); body += `<line class="line" x1="${sx + 10}" y1="170" x2="${nx - 10}" y2="170"/>`; sx = nx; }
      });
      if (s.end) { const w = String(s.end).length * 8 + 30; body += `<line class="line" x1="${sx + 10}" y1="170" x2="${sx + 60}" y2="170"/><rect x="${sx + 60}" y="154" width="${w}" height="32" rx="3" style="fill:none;stroke:var(--color-success);stroke-width:1.5;stroke-dasharray:4 3"/>${T(sx + 60 + w / 2, 175, s.end, 'mono ok-t', 'middle')}`; }
      return `<div class="dx-wide">${svg(1144, 230, body, s.aria)}</div>`;
    },
  };

  return box => {
    const s = (data.diagrams || {})[box.dataset.diagram];
    if (!s || !kinds[s.kind]) { console.warn(`diagram "${box.dataset.diagram}" has no spec or an unknown kind`); return; }
    const out = kinds[s.kind](s, box), html = typeof out === 'string' ? out : out.html;
    box.innerHTML = html + (s.kind === 'route' || s.kind === 'scope' || s.kind === 'flow' || s.kind === 'multiples' ? '' : caption(s.caption));
    if (out.init) out.init();
  };
})();
$$('[data-diagram]').forEach(diagram);

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
