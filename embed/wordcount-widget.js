/**
 * Embeddable Word + Character Counter widget.
 * Usage:
 *   <div id="pwt-wordcount-widget"></div>
 *   <script src="https://practicalwebtools.com/embed/wordcount-widget.js" defer></script>
 */
(function () {
  'use strict';
  var E = window.PWTWidget;

  E.boot('wordcount', function (host) {
    var input;

    var built = E.shell({
      title: 'Word & Character Counter',
      subtitle: 'Live counts, reading time, and limits',
      poweredByPath: '/text/word-counter',
      poweredByText: 'free word counter',
      bodyBuilder: function (body) {
        var label = E.el('label', {
          for: 'pwt-wc-text',
          style: 'display:block;font-size:13px;color:#475569;margin-bottom:4px;font-weight:500',
          text: 'Type or paste text',
        });
        input = E.el('textarea', {
          id: 'pwt-wc-text',
          rows: '5',
          placeholder: 'Start typing…',
          style: 'width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px;background:#fff;color:#0f172a;resize:vertical',
        });
        body.appendChild(label);
        body.appendChild(input);
        var out = E.outputBox('pwt-wc-out');
        body.appendChild(out);
        return function () {};
      },
    });

    var out = null;

    function update() {
      out = out || host.querySelector('#pwt-wc-out');
      if (!out) return;
      var text = input.value;
      var words = text.trim() ? text.trim().split(/\s+/).length : 0;
      var chars = text.length;
      var noSpaces = text.replace(/\s/g, '').length;
      var sentences = (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length;
      var minutes = words / 200;
      var readTime = words === 0 ? '0 sec' : minutes < 1 ? Math.max(1, Math.round(minutes * 60)) + ' sec' : Math.round(minutes) + ' min';

      var limits = [
        ['Tweet', 280],
        ['Meta description', 160],
        ['Title tag', 60],
      ].map(function (l) {
        var pctUsed = l[1] > 0 ? chars / l[1] : 0;
        var color = pctUsed > 1 ? '#dc2626' : pctUsed > 0.9 ? '#d97706' : '#16a34a';
        return '<span style="color:' + color + '">' + l[0] + ' ' + chars + '/' + l[1] + '</span>';
      }).join(' · ');

      out.innerHTML =
        '<div style="display:flex;justify-content:center;gap:22px;flex-wrap:wrap">' +
        [['Words', words], ['Characters', chars], ['No spaces', noSpaces], ['Sentences', sentences]].map(function (p) {
          return '<div><div style="font-size:22px;font-weight:800;color:#1e293b">' + p[1] + '</div><div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.05em">' + p[0] + '</div></div>';
        }).join('') +
        '</div>' +
        '<div style="font-size:12px;color:#64748b;margin-top:8px">Reading time ' + readTime + ' · ' + limits + '</div>';
    }

    host.appendChild(built.root);
    input.addEventListener('input', update);
    update();
  });
})();
