/**
 * Embeddable BMI calculator widget — the distribution channel pilot
 * (gap-analysis §3b: "an embeddable calculator is a link-acquisition
 * machine disguised as a feature").
 *
 * Architectural differentiation vs calculator.net widgets: this build is
 * FULLY client-side — a single static script, no iframe to our servers,
 * works offline once loaded. Sites embed it without creating a runtime
 * dependency on us.
 *
 * Usage on any site:
 *   <div id="pwt-bmi-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/bmi-widget.js" defer></script>
 *
 * The script renders a styled, self-contained widget into the container and
 * appends a small attribution link (the link-acquisition part — natural,
 * visible, honest).
 */

(function () {
  'use strict';

  var CONTAINER_ID = 'pwt-bmi-widget';
  var SITE = 'https://practicalwebtools.com';

  function fmt(n) {
    return Math.round(n * 10) / 10;
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', color: '#0284c7' };
    if (bmi < 25) return { label: 'Normal weight', color: '#16a34a' };
    if (bmi < 30) return { label: 'Overweight', color: '#d97706' };
    return { label: 'Obesity', color: '#dc2626' };
  }

  function computeBmi(hCm, wKg) {
    if (hCm <= 0 || wKg <= 0) return null;
    var m = hCm / 100;
    return wKg / (m * m);
  }

  function render(host) {
    host.innerHTML =
      '<div style="max-width:420px;margin:0 auto;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#fff">' +
        '<div style="padding:16px 20px;background:#1e293b;color:#fff">' +
          '<div style="font-weight:700;font-size:16px">BMI Calculator</div>' +
          '<div style="font-size:12px;opacity:.75">Metric (cm / kg)</div>' +
        '</div>' +
        '<div style="padding:20px">' +
          '<label style="display:block;font-size:13px;color:#475569;margin-bottom:4px" for="pwt-bmi-h">Height (cm)</label>' +
          '<input id="pwt-bmi-h" type="number" min="50" max="260" value="170" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px" />' +
          '<label style="display:block;font-size:13px;color:#475569;margin-bottom:4px" for="pwt-bmi-w">Weight (kg)</label>' +
          '<input id="pwt-bmi-w" type="number" min="10" max="400" value="70" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:16px" />' +
          '<div id="pwt-bmi-out" style="padding:14px;border-radius:12px;background:#f1f5f9;text-align:center"></div>' +
          '<div id="pwt-bmi-scale" style="display:flex;height:10px;border-radius:6px;overflow:hidden;margin-top:14px">' +
            '<div style="flex:18.5;background:#7dd3fc"></div>' +
            '<div style="flex:6.5;background:#4ade80"></div>' +
            '<div style="flex:5;background:#fbbf24"></div>' +
            '<div style="flex:10;background:#f87171"></div>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-top:4px">' +
            '<span>18.5</span><span>25</span><span>30</span><span>40</span>' +
          '</div>' +
        '</div>' +
        '<div style="padding:10px 20px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center;background:#f8fafc">' +
          'Powered by <a href="' + SITE + '/health/bmi-calculator" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:none">Practical Web Tools</a> — free, no-upload BMI calculator' +
        '</div>' +
      '</div>';

    var hInput = host.querySelector('#pwt-bmi-h');
    var wInput = host.querySelector('#pwt-bmi-w');
    var out = host.querySelector('#pwt-bmi-out');

    function update() {
      var bmi = computeBmi(parseFloat(hInput.value), parseFloat(wInput.value));
      if (bmi === null || !isFinite(bmi)) {
        out.innerHTML = '<span style="color:#94a3b8">Enter height and weight</span>';
        return;
      }
      var cat = bmiCategory(bmi);
      out.innerHTML =
        '<div style="font-size:28px;font-weight:800;color:' + cat.color + '">' + fmt(bmi) + '</div>' +
        '<div style="font-size:13px;color:' + cat.color + ';font-weight:600">' + cat.label + '</div>';
    }

    hInput.addEventListener('input', update);
    wInput.addEventListener('input', update);
    update();
  }

  function boot() {
    var host = document.getElementById(CONTAINER_ID);
    if (host) {
      // re-mount if a framework (Next.js hydration) wiped the injected DOM
      if (!host.dataset.pwtInit || host.children.length === 0) {
        host.dataset.pwtInit = '1';
        render(host);
      }
    }
    // Also support multiple widgets: pwt-bmi-widget-2 etc.
    var nodes = document.querySelectorAll('[id^="' + CONTAINER_ID + '"]');
    nodes.forEach(function (n) {
      if (n && (!n.dataset.pwtInit || n.children.length === 0)) {
        n.dataset.pwtInit = '1';
        render(n);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  // hydration-safe: re-check after load and once shortly after
  window.addEventListener('load', boot);
  setTimeout(boot, 1500);
})();
