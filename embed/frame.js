/**
 * Practical Web Tools — calculator embed auto-resizer.
 *
 * Every calculator on practicalwebtools.com can be embedded as an iframe
 * (`<calculator URL>?embed=1`; each calculator page shows its own copy-paste
 * code). This script, included once by the host page, sizes each embedded
 * calculator to its content so it never shows an inner scrollbar or blank
 * space: the framed calculator posts {type:'pwt-embed:resize', height} and
 * the matching iframe gets that height. Pages that load this script after
 * the frame already reported get a {type:'pwt-embed:ping'} round-trip.
 *
 * Framework-free and ES5-safe; safe to include more than once.
 */
(function () {
  'use strict';
  if (window.__pwtEmbedFrame) return;
  window.__pwtEmbedFrame = true;

  var origin = 'https://practicalwebtools.com';
  try {
    var me = document.currentScript;
    if (me && me.src) origin = new URL(me.src, location.href).origin;
  } catch (e) {
    /* keep the production origin */
  }

  function embeds() {
    var all = document.getElementsByTagName('iframe');
    var out = [];
    for (var i = 0; i < all.length; i++) {
      var src = all[i].getAttribute('src') || '';
      if (all[i].hasAttribute('data-pwt-embed') || src.indexOf(origin + '/') === 0) out.push(all[i]);
    }
    return out;
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== origin) return;
    var data = event.data;
    if (!data || data.type !== 'pwt-embed:resize') return;
    var height = Math.round(Number(data.height));
    if (!(height > 0)) return;
    height = Math.min(Math.max(height, 160), 20000);
    var list = embeds();
    for (var i = 0; i < list.length; i++) {
      if (list[i].contentWindow === event.source) {
        list[i].style.height = height + 'px';
        return;
      }
    }
  });

  function ping() {
    var list = embeds();
    for (var i = 0; i < list.length; i++) {
      try {
        list[i].contentWindow.postMessage({ type: 'pwt-embed:ping' }, origin);
      } catch (e) {
        /* frame not ready — it reports on its own load */
      }
    }
  }

  ping();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ping);
  window.addEventListener('load', ping);
})();
