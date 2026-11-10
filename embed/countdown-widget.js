/**
 * Embeddable Countdown Timer widget (to any date, with event presets).
 * Usage:
 *   <div id="pwt-countdown-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/countdown-widget.js" defer></script>
 */
(function () {
  'use strict';
  var E = window.PWTWidget;

  E.boot('countdown', function (host) {
    var inputs = {};
    var out;
    var timer = null;

    var built = E.shell({
      title: 'Countdown Timer',
      subtitle: 'Days, hours, minutes to your event',
      poweredByPath: '/other/time/countdown-timer',
      poweredByText: 'free countdown timer',
      bodyBuilder: function (body) {
        var label = E.el('label', { style: 'display:block;font-size:13px;color:#475569;margin-bottom:4px;font-weight:500', text: 'Event date & time' });
        var date = E.el('input', { id: 'pwt-cd-date', type: 'datetime-local', style: 'width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px;background:#fff;color:#0f172a' });
        body.appendChild(label); body.appendChild(date);
        inputs[date.id] = date;

        var presetLabel = E.el('div', { style: 'font-size:12px;color:#64748b;margin-bottom:6px', text: 'Quick presets' });
        body.appendChild(presetLabel);
        var flex = E.el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px' });
        [
          ['New Year', function () { var d = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0); return d; }],
          ['Black Friday', function () {
            var y = new Date().getFullYear();
            var d = new Date(y, 10, 1);
            while (d.getDay() !== 4) d.setDate(d.getDate() + 1); // first Thursday… actually 4th Thursday:
            d = new Date(y, 10, 1 + 21 + ((4 - d.getDay() + 7) % 7));
            if (d < new Date()) d = new Date(y + 1, 10, 1 + 21);
            return d;
          }],
          ['Christmas', function () { var y = new Date().getFullYear(); var d = new Date(y, 11, 25); if (d < new Date()) d = new Date(y + 1, 11, 25); return d; }],
        ].forEach(function (preset) {
          var b = E.el('button', {
            type: 'button',
            style: 'flex:1;min-width:90px;padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#334155;font-size:13px;font-weight:600;cursor:pointer',
            text: preset[0],
          });
          b.addEventListener('click', function () {
            var d = preset[1]();
            var pad = function (n) { return String(n).padStart(2, '0'); };
            inputs['pwt-cd-date'].value = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
            update();
          });
          flex.appendChild(b);
        });
        body.appendChild(flex);

        out = E.el('div', { id: 'pwt-cd-out', style: 'padding:16px;border-radius:12px;background:#f1f5f9;text-align:center', text: '—' });
        body.appendChild(out);
        return update;
      },
    });

    function update() {
      if (timer) { clearInterval(timer); timer = null; }
      var v = inputs['pwt-cd-date'].value;
      if (!v) {
        out.innerHTML = '<span style="color:#94a3b8;font-size:14px">Pick an event date</span>';
        return;
      }
      var target = new Date(v);
      if (isNaN(target.getTime())) {
        out.innerHTML = '<span style="color:#94a3b8;font-size:14px">Pick an event date</span>';
        return;
      }
      function tick() {
        var ms = target - new Date();
        if (ms <= 0) {
          out.innerHTML = '<div style="font-size:22px;font-weight:800;color:#16a34a">It\'s here! 🎉</div>';
          if (timer) clearInterval(timer);
          return;
        }
        var days = Math.floor(ms / 86400000);
        var hours = Math.floor((ms % 86400000) / 3600000);
        var mins = Math.floor((ms % 3600000) / 60000);
        var secs = Math.floor((ms % 60000) / 1000);
        out.innerHTML =
          '<div style="display:flex;justify-content:center;gap:14px">' +
          [[days, 'days'], [hours, 'hrs'], [mins, 'min'], [secs, 'sec']].map(function (p) {
            return '<div><div style="font-size:24px;font-weight:800;color:#1e293b">' + p[0] + '</div><div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.05em">' + p[1] + '</div></div>';
          }).join('') +
          '</div>';
      }
      tick();
      timer = setInterval(tick, 1000);
    }

    host.appendChild(built.root);
    Object.keys(inputs).forEach(function (id) {
      inputs[id].addEventListener('input', update);
      inputs[id].addEventListener('change', update);
    });
    update();
  });
})();
