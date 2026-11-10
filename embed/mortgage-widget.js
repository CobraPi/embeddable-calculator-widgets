/**
 * Embeddable Mortgage Calculator widget.
 * Usage:
 *   <div id="pwt-mortgage-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/mortgage-widget.js" defer></script>
 * Fully client-side — no iframe, no server dependency, works offline.
 */
(function () {
  'use strict';
  var E = window.PWTWidget;

  E.boot('mortgage', function (host) {
    var inputs = {};
    var out;

    var built = E.shell({
      title: 'Mortgage Calculator',
      subtitle: 'Monthly payment + total interest',
      poweredByPath: '/finance/mortgage-calculator',
      poweredByText: 'free mortgage calculator',
      bodyBuilder: function (body) {
        var h = E.field('Home price ($)', { id: 'pwt-mtg-price', value: '350000', min: '0', step: '1000' });
        var d = E.field('Down payment ($)', { id: 'pwt-mtg-down', value: '70000', min: '0', step: '1000' });
        var r = E.field('Interest rate (% per year)', { id: 'pwt-mtg-rate', value: '6.5', min: '0', max: '30', step: '0.01' });
        var t = E.field('Loan term (years)', { id: 'pwt-mtg-term', value: '30', min: '1', max: '50', step: '1' });
        [h, d, r, t].forEach(function (pair) {
          pair.forEach(function (n) { body.appendChild(n); });
          inputs[pair[1].id] = pair[1];
        });
        out = E.outputBox('pwt-mtg-out');
        body.appendChild(out);
        return update;
      },
    });

    function update() {
      var price = E.num(inputs['pwt-mtg-price'].value);
      var down = E.num(inputs['pwt-mtg-down'].value);
      var rate = E.num(inputs['pwt-mtg-rate'].value);
      var years = E.num(inputs['pwt-mtg-term'].value);
      var principal = price - down;
      if (!(principal > 0) || !(rate >= 0) || !(years > 0)) {
        out.innerHTML = '<span style="color:#94a3b8">Enter your loan details</span>';
        return;
      }
      var n = years * 12;
      var monthlyRate = rate / 100 / 12;
      var payment;
      if (monthlyRate === 0) payment = principal / n;
      else payment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));
      var total = payment * n;
      out.innerHTML =
        '<div style="font-size:26px;font-weight:800;color:#1e293b">' + E.money(payment) + '<span style="font-size:13px;font-weight:600;color:#64748b">/mo</span></div>' +
        '<div style="font-size:12px;color:#64748b;margin-top:4px">Loan ' + E.money(principal) + ' · total interest ' + E.money(total - principal) + '</div>';
    }

    host.appendChild(built.root);
    Object.keys(inputs).forEach(function (id) {
      inputs[id].addEventListener('input', update);
    });
    update();
  });
})();
