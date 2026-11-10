/**
 * Embeddable Pregnancy Due Date Calculator widget.
 * Usage:
 *   <div id="pwt-duedate-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/duedate-widget.js" defer></script>
 */
(function () {
  'use strict';
  var E = window.PWTWidget;

  E.boot('duedate', function (host) {
    var inputs = {};
    var out;

    var built = E.shell({
      title: 'Due Date Calculator',
      subtitle: 'Naegele\'s rule — 40 weeks from LMP',
      poweredByPath: '/health/due-date-calculator',
      poweredByText: 'free due date calculator',
      bodyBuilder: function (body) {
        var label = E.el('label', { style: 'display:block;font-size:13px;color:#475569;margin-bottom:4px;font-weight:500', text: 'First day of last period (LMP)' });
        var date = E.el('input', { id: 'pwt-dd-lmp', type: 'date', style: 'width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px;background:#fff;color:#0f172a' });
        body.appendChild(label); body.appendChild(date);
        inputs[date.id] = date;

        var clabel = E.el('label', { style: 'display:block;font-size:13px;color:#475569;margin-bottom:4px;font-weight:500', text: 'Cycle length (days)' });
        var cycle = E.el('input', { id: 'pwt-dd-cycle', type: 'number', value: '28', min: '20', max: '45', style: 'width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px;background:#fff;color:#0f172a' });
        body.appendChild(clabel); body.appendChild(cycle);
        inputs[cycle.id] = cycle;

        out = E.outputBox('pwt-dd-out');
        body.appendChild(out);
        return update;
      },
    });

    function update() {
      var v = inputs['pwt-dd-lmp'].value;
      var cycle = E.num(inputs['pwt-dd-cycle'].value) || 28;
      if (!v) {
        out.innerHTML = '<span style="color:#94a3b8">Select the first day of your last period</span>';
        return;
      }
      var parts = v.split('-').map(Number);
      var lmp = new Date(parts[0], parts[1] - 1, parts[2]);
      if (isNaN(lmp.getTime())) {
        out.innerHTML = '<span style="color:#94a3b8">Select the first day of your last period</span>';
        return;
      }
      // Naegele + cycle adjustment: add 280 days + (cycle − 28)
      var due = new Date(lmp.getTime());
      due.setDate(due.getDate() + 280 + (cycle - 28));
      var now = new Date();
      var daysPreg = Math.floor((now - lmp) / 86400000);
      var weeks = Math.floor(daysPreg / 7);
      var opts = { year: 'numeric', month: 'long', day: 'numeric' };
      var fmtDue = due.toLocaleDateString('en-US', opts);
      var trimester = daysPreg < 0 ? '—' : weeks < 13 ? 'First trimester' : weeks < 27 ? 'Second trimester' : 'Third trimester';
      out.innerHTML =
        '<div style="font-size:22px;font-weight:800;color:#1e293b">' + fmtDue + '</div>' +
        '<div style="font-size:12px;color:#64748b;margin-top:4px">' +
        (daysPreg >= 0 ? weeks + ' weeks along · ' + trimester : 'Estimated from LMP') +
        ' · ~' + (280 + (cycle - 28)) + ' day gestation</div>';
    }

    host.appendChild(built.root);
    Object.keys(inputs).forEach(function (id) {
      inputs[id].addEventListener('input', update);
      inputs[id].addEventListener('change', update);
    });
    update();
  });
})();
