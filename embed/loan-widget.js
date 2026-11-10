/**
 * Embeddable Loan / Amortization Calculator widget.
 * Usage:
 *   <div id="pwt-loan-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/loan-widget.js" defer></script>
 */
(function () {
  'use strict';
  var E = window.PWTWidget;

  E.boot('loan', function (host) {
    var inputs = {};
    var out;
    var table;

    var built = E.shell({
      title: 'Loan Calculator',
      subtitle: 'Payment + yearly amortization schedule',
      poweredByPath: '/finance/loan-calculator',
      poweredByText: 'free loan calculator',
      bodyBuilder: function (body) {
        var rows = [
          E.field('Loan amount ($)', { id: 'pwt-ln-p', value: '25000', min: '0', step: '100' }),
          E.field('Interest rate (% per year)', { id: 'pwt-ln-r', value: '8', min: '0', max: '40', step: '0.01' }),
          E.field('Term (years)', { id: 'pwt-ln-y', value: '5', min: '1', max: '40', step: '1' }),
        ];
        rows.forEach(function (pair) {
          pair.forEach(function (n) { body.appendChild(n); });
          inputs[pair[1].id] = pair[1];
        });
        out = E.outputBox('pwt-ln-out');
        body.appendChild(out);
        table = E.el('div', { id: 'pwt-ln-table', style: 'margin-top:12px;max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:12px' });
        body.appendChild(table);
        return update;
      },
    });

    function update() {
      var p = E.num(inputs['pwt-ln-p'].value);
      var r = E.num(inputs['pwt-ln-r'].value);
      var y = E.num(inputs['pwt-ln-y'].value);
      if (!(p > 0) || !(r >= 0) || !(y > 0)) {
        out.innerHTML = '<span style="color:#94a3b8">Enter loan details</span>';
        table.innerHTML = '';
        return;
      }
      var n = y * 12;
      var mr = r / 100 / 12;
      var payment = mr === 0 ? p / n : p * mr / (1 - Math.pow(1 + mr, -n));

      var balance = p;
      var rows = [];
      var yearInterest = 0, yearPrincipal = 0;
      for (var i = 1; i <= n; i++) {
        var interest = balance * mr;
        var principal = payment - interest;
        balance -= principal;
        yearInterest += interest;
        yearPrincipal += principal;
        if (i % 12 === 0 || i === n) {
          rows.push([Math.ceil(i / 12), yearPrincipal, yearInterest, Math.max(0, balance)]);
          yearInterest = 0; yearPrincipal = 0;
        }
      }

      out.innerHTML =
        '<div style="font-size:26px;font-weight:800;color:#1e293b">' + E.money(payment) + '<span style="font-size:13px;font-weight:600;color:#64748b">/mo</span></div>' +
        '<div style="font-size:12px;color:#64748b;margin-top:4px">Total interest ' + E.money(payment * n - p) + ' · ' + n + ' payments</div>';

      var html = '<table style="width:100%;border-collapse:collapse;font-size:12px;color:#334155">' +
        '<thead><tr style="background:#f1f5f9;position:sticky;top:0">' +
        '<th style="padding:6px 8px;text-align:left;font-weight:600">Year</th>' +
        '<th style="padding:6px 8px;text-align:right;font-weight:600">Principal</th>' +
        '<th style="padding:6px 8px;text-align:right;font-weight:600">Interest</th>' +
        '<th style="padding:6px 8px;text-align:right;font-weight:600">Balance</th>' +
        '</tr></thead><tbody>';
      rows.forEach(function (row) {
        html += '<tr style="border-top:1px solid #e2e8f0">' +
          '<td style="padding:6px 8px">' + row[0] + '</td>' +
          '<td style="padding:6px 8px;text-align:right">' + E.money(row[1]) + '</td>' +
          '<td style="padding:6px 8px;text-align:right">' + E.money(row[2]) + '</td>' +
          '<td style="padding:6px 8px;text-align:right">' + E.money(row[3]) + '</td></tr>';
      });
      html += '</tbody></table>';
      table.innerHTML = html;
    }

    host.appendChild(built.root);
    Object.keys(inputs).forEach(function (id) {
      inputs[id].addEventListener('input', update);
    });
    update();
  });
})();
