# Embeddable Calculator Widgets

Free calculator widgets for your website or blog: **mortgage, loan amortization, compound interest,
BMI, calorie/TDEE, pregnancy due date, percentage, countdown timer, and word counter** — plus 400+
more calculators embeddable from [Practical Web Tools](https://practicalwebtools.com/embed).

- **No API key, no server, no rate limit** — every widget is fully client-side
- **One line of HTML** per widget; no build step, no framework
- **Self-host or hotlink** — vendor these files, or hotlink the always-current copies on
  [practicalwebtools.com/embed](https://practicalwebtools.com/embed)
- **Zero layout surprises** — the iframe flavor auto-sizes to its content

## Quick start

Drop a mortgage calculator into any HTML page:

```html
<div id="pwt-mortgage-widget"></div>
<script src="https://practicalwebtools.com/embed/mortgage-widget.js" defer></script>
```

Or self-host / CDN this repo's copy via jsDelivr:

```html
<div id="pwt-mortgage-widget"></div>
<script src="https://cdn.jsdelivr.net/gh/CobraPi/embeddable-calculator-widgets@main/embed/pwt-widget-engine.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/CobraPi/embeddable-calculator-widgets@main/embed/mortgage-widget.js" defer></script>
```

Works anywhere custom HTML is allowed: WordPress, Squarespace, Wix, Webflow, Ghost, GitHub Pages,
documentation sites, LMS pages.

## The nine script widgets

| Widget | Container div | Script | Try it |
|---|---|---|---|
| BMI | `pwt-bmi-widget` | [`bmi-widget.js`](embed/bmi-widget.js) | [live calculator](https://practicalwebtools.com/health/bmi-calculator) |
| Mortgage | `pwt-mortgage-widget` | [`mortgage-widget.js`](embed/mortgage-widget.js) | [live calculator](https://practicalwebtools.com/finance/mortgage-calculator) |
| Calorie / TDEE | `pwt-calorie-widget` | [`calorie-widget.js`](embed/calorie-widget.js) | [live calculator](https://practicalwebtools.com/health/calorie-calculator) |
| Pregnancy due date | `pwt-duedate-widget` | [`duedate-widget.js`](embed/duedate-widget.js) | [live calculator](https://practicalwebtools.com/health/due-date-calculator) |
| Percentage | `pwt-percentage-widget` | [`percentage-widget.js`](embed/percentage-widget.js) | [live calculator](https://practicalwebtools.com/math/percentage-calculator) |
| Compound interest | `pwt-compound-widget` | [`compound-widget.js`](embed/compound-widget.js) | [live calculator](https://practicalwebtools.com/finance/compound-interest-calculator) |
| Countdown timer | `pwt-countdown-widget` | [`countdown-widget.js`](embed/countdown-widget.js) | [live calculator](https://practicalwebtools.com/other/time/countdown-timer) |
| Loan / amortization | `pwt-loan-widget` | [`loan-widget.js`](embed/loan-widget.js) | [live calculator](https://practicalwebtools.com/finance/loan-calculator) |
| Word & character counter | `pwt-wordcount-widget` | [`wordcount-widget.js`](embed/wordcount-widget.js) | [live calculator](https://practicalwebtools.com/text/word-counter) |

`bmi-widget.js` is self-contained; the rest share the ~4 KB `pwt-widget-engine.js`
(engine first — `defer` scripts execute in document order).

## Embed ANY of the 400+ calculators

Every calculator on [Practical Web Tools](https://practicalwebtools.com/calculators) — finance, math,
health, science, everyday — doubles as an auto-sizing iframe widget at `<calculator URL>?embed=1`.
Each calculator page has its own copy-paste snippet with a theme picker and live preview. The pattern:

```html
<iframe src="https://practicalwebtools.com/finance/mortgage-calculator?embed=1"
        title="Mortgage Calculator" loading="lazy"
        style="display:block;width:100%;max-width:880px;height:720px;border:0"
        data-pwt-embed></iframe>
<script src="https://practicalwebtools.com/embed/frame.js" async></script>
<p style="margin:6px 0 0;font:13px/1.5 system-ui,sans-serif">
  Mortgage Calculator by <a href="https://practicalwebtools.com/finance/mortgage-calculator">Practical Web Tools</a>
</p>
```

`frame.js` is a ~1 KB, framework-free auto-resizer: the framed calculator posts its height via
`postMessage`, and `frame.js` sizes the iframe to fit — no inner scrollbars, no blank space.

## Why free?

Each widget carries a small "Calculator by Practical Web Tools" link. That is the entire business
model: no signup, no email wall, no view caps, no paid tier hiding dark mode. The widgets run in your
visitor's browser — their inputs never touch a server.

## Files

- `embed/pwt-widget-engine.js` — shared render engine (~4 KB)
- `embed/<name>-widget.js` — the nine widget scripts
- `embed/frame.js` — the iframe auto-resizer for the any-calculator flavor

## License

[MIT](LICENSE) for the loader, engine, and resizer scripts in this repository.
The calculators themselves are served live from [practicalwebtools.com](https://practicalwebtools.com).
