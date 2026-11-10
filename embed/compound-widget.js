/**
 * Embeddable Compound Interest Calculator widget.
 * Usage:
 *   <div id="pwt-compound-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/compound-widget.js" defer></script>
 */
(function () {
  'use strict';
  var E = window.PWTWidget;

  E.boot('compound', function (host) {
    var inputs = {};
    var out;

    var built = E.shell({
      title: 'Compound Interest Calculator',
      subtitle: 'Growth with monthly contributions',
      poweredByPath: '/finance/compound-interest-calculator',
      poweredByText: 'free compound interest calculator',
      bodyBuilder: function (body) {
        var rows = [
          E.field('Starting amount ($)', { id: 'pwt-ci-p', value: '10000', min: '0', step: '100' }),
          E.field('Monthly contribution ($)', { id: 'pwt-ci-m', value: '200', min: '0', step: '10' }),
          E.field('Annual interest rate (%)', { id: 'pwt-ci-r', value: '7', min: '0', max: '30', step: '0.1' }),
          E.field('Years', { id: 'pwt-ci-y', value: '20', min: '1', max: '60', step: '1' }),
        ];
        rows.forEach(function (pair) {
          pair.forEach(function (n) { body.appendChild(n); });
          inputs[pair[1].id] = pair[1];
        });
        out = E.outputBox('pwt-ci-out');
        body.appendChild(out);
        return update;
      },
    });

    function update() {
      var p = E.num(inputs['pwt-ci-p'].value);
      var m = E.num(inputs['pwt-ci-m'].value);
      var r = E.num(inputs['pwt-ci-r'].value);
      var y = E.num(inputs['pwt-ci-y'].value);
      if (!(p >= 0) || !(m >= 0) || !(r >= 0) || !(y > 0)) {
        out.innerHTML = '<span style="color:#94a3b8">Enter your savings details</span>';
        return;
      }
      var mr = r / 100 / 12;
      var n = Math.floor(y * 12);
      var balance = p;
      var contributed = p;
      for (var i = 0; i < n; i++) {
        balance = balance * (1 + mr) + m;
        contributed += m;
      }
      out.innerHTML =
        '<div style="font-size:26px;font-weight:800;color:#1e293b">' + E.money(balance) + '</div>' +
        '<div style="font-size:12px;color:#64748b;margin-top:4px">Contributed ' + E.money(contributed) + ' · interest earned ' + E.money(balance - contributed) + '</div>';
    }

    host.appendChild(built.root);
    Object.keys(inputs).forEach(function (id) {
      inputs[id].addEventListener('input', update);
    });
    update();
  });
})();
