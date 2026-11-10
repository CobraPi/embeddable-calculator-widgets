/**
 * Embeddable Percentage Calculator widget (4 modes).
 * Usage:
 *   <div id="pwt-percentage-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/percentage-widget.js" defer></script>
 */
(function () {
  'use strict';
  var E = window.PWTWidget;

  E.boot('percentage', function (host) {
    var inputs = {};
    var outs = {};

    var built = E.shell({
      title: 'Percentage Calculator',
      subtitle: 'Four everyday percentage modes',
      poweredByPath: '/math/percentage-calculator',
      poweredByText: 'free percentage calculator',
      bodyBuilder: function (body) {
        function row(aAttrs, bAttrs, labelA, labelB, outId) {
          var wrap = E.el('div', { style: 'margin-bottom:16px;padding:12px;border:1px solid #e2e8f0;border-radius:12px' });
          var flex = E.el('div', { style: 'display:flex;gap:10px' });
          var a = E.el('input', Object.assign({ type: 'number', step: 'any', style: 'flex:1;min-width:0;padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:15px;background:#fff;color:#0f172a' }, aAttrs));
          var b = E.el('input', Object.assign({ type: 'number', step: 'any', style: 'flex:1;min-width:0;padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:15px;background:#fff;color:#0f172a' }, bAttrs));
          flex.appendChild(a); flex.appendChild(b);
          inputs[a.id] = a; inputs[b.id] = b;
          var o = E.el('div', { id: outId, style: 'margin-top:8px;font-size:15px;font-weight:700;color:#1e293b', text: '—' });
          outs[outId] = o;
          wrap.appendChild(E.el('div', { style: 'font-size:12px;color:#64748b;margin-bottom:6px', text: labelA + ' ' + labelB }));
          wrap.appendChild(flex);
          wrap.appendChild(o);
          body.appendChild(wrap);
        }
        row({ id: 'pwt-pct-of-a', value: '10' }, { id: 'pwt-pct-of-b', value: '50' }, 'What is', '% of ____ = ?', 'pwt-pct-of-out');
        row({ id: 'pwt-pct-off-a', value: '80' }, { id: 'pwt-pct-off-b', value: '20' }, 'Price ____ with', '% off = ?', 'pwt-pct-off-out');
        row({ id: 'pwt-pct-is-a', value: '12' }, { id: 'pwt-pct-is-b', value: '48' }, '____ is what % of ____', '', 'pwt-pct-is-out');
        row({ id: 'pwt-pct-chg-a', value: '40' }, { id: 'pwt-pct-chg-b', value: '50' }, '% change from ____ to ____', '', 'pwt-pct-chg-out');
        return update;
      },
    });

    function update() {
      var v = function (id) { return E.num(inputs[id].value); };

      var a1 = v('pwt-pct-of-a'), b1 = v('pwt-pct-of-b');
      outs['pwt-pct-of-out'].textContent = isFinite(a1) && isFinite(b1) ? E.fmt(a1 * b1 / 100) : '—';

      var a2 = v('pwt-pct-off-a'), b2 = v('pwt-pct-off-b');
      outs['pwt-pct-off-out'].textContent = isFinite(a2) && isFinite(b2) ? E.money(a2 * (1 - b2 / 100)) + ' (−' + E.money(a2 * b2 / 100) + ')' : '—';

      var a3 = v('pwt-pct-is-a'), b3 = v('pwt-pct-is-b');
      outs['pwt-pct-is-out'].textContent = isFinite(a3) && b3 !== 0 ? E.fmt(a3 / b3 * 100) + '%' : '—';

      var a4 = v('pwt-pct-chg-a'), b4 = v('pwt-pct-chg-b');
      outs['pwt-pct-chg-out'].textContent = isFinite(a4) && isFinite(b4) && a4 !== 0 ? (b4 >= a4 ? '+' : '') + E.fmt((b4 - a4) / Math.abs(a4) * 100) + '%' : '—';
    }

    host.appendChild(built.root);
    Object.keys(inputs).forEach(function (id) {
      inputs[id].addEventListener('input', update);
    });
    update();
  });
})();
