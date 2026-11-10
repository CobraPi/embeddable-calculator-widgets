/**
 * Embeddable Calorie / TDEE Calculator widget (Mifflin-St Jeor).
 * Usage:
 *   <div id="pwt-calorie-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/calorie-widget.js" defer></script>
 */
(function () {
  'use strict';
  var E = window.PWTWidget;

  E.boot('calorie', function (host) {
    var inputs = {};
    var out;

    var built = E.shell({
      title: 'Calorie Calculator',
      subtitle: 'Daily calories (TDEE) — Mifflin-St Jeor',
      poweredByPath: '/health/calorie-calculator',
      poweredByText: 'free calorie calculator',
      bodyBuilder: function (body) {
        var rows = [
          E.field('Age', { id: 'pwt-cal-age', value: '30', min: '10', max: '100' }),
          E.field('Weight (kg)', { id: 'pwt-cal-w', value: '70', min: '20', max: '300', step: '0.1' }),
          E.field('Height (cm)', { id: 'pwt-cal-h', value: '170', min: '100', max: '230' }),
        ];
        rows.forEach(function (pair) {
          pair.forEach(function (n) { body.appendChild(n); });
          inputs[pair[1].id] = pair[1];
        });

        var label = E.el('label', { style: 'display:block;font-size:13px;color:#475569;margin-bottom:4px;font-weight:500', text: 'Sex' });
        var sex = E.el('select', { id: 'pwt-cal-sex', style: 'width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px;background:#fff;color:#0f172a' }, []);
        ['male', 'female'].forEach(function (v) {
          var o = E.el('option', { value: v });
          o.textContent = v === 'male' ? 'Male' : 'Female';
          sex.appendChild(o);
        });
        body.appendChild(label); body.appendChild(sex);
        inputs[sex.id] = sex;

        var label2 = E.el('label', { style: 'display:block;font-size:13px;color:#475569;margin-bottom:4px;font-weight:500', text: 'Activity level' });
        var act = E.el('select', { id: 'pwt-cal-act', style: 'width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px;background:#fff;color:#0f172a' }, []);
        [
          ['1.2', 'Sedentary (desk job)'],
          ['1.375', 'Light (1–3 days/wk)'],
          ['1.55', 'Moderate (3–5 days/wk)'],
          ['1.725', 'Very active (6–7 days/wk)'],
          ['1.9', 'Athlete (2× daily)'],
        ].forEach(function (pair) {
          var o = E.el('option', { value: pair[0] });
          o.textContent = pair[1];
          act.appendChild(o);
        });
        body.appendChild(label2); body.appendChild(act);
        inputs[act.id] = act;

        out = E.outputBox('pwt-cal-out');
        body.appendChild(out);
        return update;
      },
    });

    function update() {
      var age = E.num(inputs['pwt-cal-age'].value);
      var w = E.num(inputs['pwt-cal-w'].value);
      var h = E.num(inputs['pwt-cal-h'].value);
      var sex = inputs['pwt-cal-sex'].value;
      var act = E.num(inputs['pwt-cal-act'].value);
      if (!(age > 0) || !(w > 0) || !(h > 0) || !isFinite(act)) {
        out.innerHTML = '<span style="color:#94a3b8">Enter your details</span>';
        return;
      }
      var bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'male' ? 5 : -161);
      var tdee = bmr * act;
      out.innerHTML =
        '<div style="font-size:26px;font-weight:800;color:#1e293b">' + E.fmt(tdee, 0) + ' <span style="font-size:13px;font-weight:600;color:#64748b">kcal/day</span></div>' +
        '<div style="font-size:12px;color:#64748b;margin-top:4px">BMR ' + E.fmt(bmr, 0) + ' kcal · mild loss ' + E.fmt(tdee - 250, 0) + ' · loss ' + E.fmt(tdee - 500, 0) + '</div>';
    }

    host.appendChild(built.root);
    Object.keys(inputs).forEach(function (id) {
      inputs[id].addEventListener('input', update);
      inputs[id].addEventListener('change', update);
    });
    update();
  });
})();
