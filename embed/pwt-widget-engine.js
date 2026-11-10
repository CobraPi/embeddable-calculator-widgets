/**
 * PWT Embeddable Widget Engine — shared runtime for all embeddable
 * calculator widgets (widget roadmap "one engine, many widgets").
 *
 * Follows the bmi-widget.js pilot pattern: a single static script per
 * widget renders into #pwt-<name>-widget containers, fully client-side,
 * no iframe to our servers, works offline once loaded, with a visible
 * "Powered by" attribution link (the link-acquisition mechanism).
 *
 * This file is the shared library each widget script inlines. Keep it
 * framework-free and ES5-safe so any site can paste one <script> tag.
 */
(function () {
  'use strict';

  var SITE = 'https://practicalwebtools.com';

  // -- tiny DOM + style helpers ------------------------------------------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        if (k === 'style') node.setAttribute('style', attrs[k]);
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function field(labelText, inputAttrs) {
    var id = inputAttrs.id;
    var label = el('label', {
      for: id,
      style: 'display:block;font-size:13px;color:#475569;margin-bottom:4px;font-weight:500',
      text: labelText,
    });
    var input = el('input', Object.assign({
      type: 'number',
      style: 'width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px;background:#fff;color:#0f172a',
    }, inputAttrs));
    return [label, input];
  }

  function outputBox(id) {
    return el('div', {
      id: id,
      style: 'padding:14px;border-radius:12px;background:#f1f5f9;text-align:center;font-size:15px;color:#334155;min-height:52px',
      text: '—',
    });
  }

  function num(v) {
    var n = parseFloat(v);
    return isFinite(n) ? n : NaN;
  }

  function fmt(n, places) {
    if (!isFinite(n)) return '—';
    var p = places == null ? 2 : places;
    var s = n.toFixed(p);
    // trim trailing zeros, keep at least `min` decimals (1 for plain fmt)
    s = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '.0');
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function money(n) {
    if (!isFinite(n)) return '—';
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function pct(n) {
    if (!isFinite(n)) return '—';
    return fmt(n, 2) + '%';
  }

  // -- widget shell --------------------------------------------------------

  /**
   * Build the standard widget chrome: header, body, attribution footer.
   * @param {object} opts
   *   title: widget heading
   *   subtitle: small header text
   *   bodyBuilder: fn(container) — populates the body; returns update fn
   *   poweredByPath: tool path for the attribution link
   *   poweredByText: attribution anchor text suffix
   */
  function shell(opts) {
    var root = el('div', {
      style: 'max-width:420px;margin:0 auto;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#fff',
    });

    var header = el('div', {
      style: 'padding:16px 20px;background:#1e293b;color:#fff',
    }, [
      el('div', { style: 'font-weight:700;font-size:16px', text: opts.title }),
      opts.subtitle ? el('div', { style: 'font-size:12px;opacity:.75;margin-top:2px', text: opts.subtitle }) : null,
    ]);

    var body = el('div', { style: 'padding:20px' });
    var update = opts.bodyBuilder(body) || function () {};

    var footer = el('div', {
      style: 'padding:10px 20px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center;background:#f8fafc',
      html: 'Powered by <a href="' + SITE + (opts.poweredByPath || '') + '" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:none">Practical Web Tools</a>' + (opts.poweredByText ? ' — ' + opts.poweredByText : ''),
    });

    root.appendChild(header);
    root.appendChild(body);
    root.appendChild(footer);
    return { root: root, update: update };
  }

  /**
   * Boot a widget: find #pwt-<name>-widget (plus suffixed duplicates),
   * render a shell into each, wire inputs to their update functions.
   */
  function boot(name, mount) {
    function renderAll() {
      var host = document.getElementById('pwt-' + name + '-widget');
      if (host) {
        if (!host.dataset.pwtInit || host.children.length === 0) {
          host.dataset.pwtInit = '1';
          host.innerHTML = '';
          mount(host);
        }
      }
      var nodes = document.querySelectorAll('[id^="pwt-' + name + '-widget"]');
      nodes.forEach(function (n) {
        if (n && (!n.dataset.pwtInit || n.children.length === 0)) {
          n.dataset.pwtInit = '1';
          n.innerHTML = '';
          mount(n);
        }
      });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderAll);
    } else {
      renderAll();
    }
    // Framework pages (e.g. Next.js) hydrate AFTER DOMContentLoaded and can
    // wipe content injected into SSR'd containers. Re-check after load and
    // once more shortly after — idempotent via the children check above.
    window.addEventListener('load', renderAll);
    setTimeout(renderAll, 1500);
  }

  // -- exports -------------------------------------------------------------

  window.PWTWidget = {
    el: el,
    field: field,
    outputBox: outputBox,
    shell: shell,
    boot: boot,
    num: num,
    fmt: fmt,
    money: money,
    pct: pct,
    SITE: SITE,
  };
})();
