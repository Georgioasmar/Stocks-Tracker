# Roumieh Quant

A front-end web app for engineering students breaking into quantitative finance:
live markets, a curated resource shelf, and a CV-timeline tool that turns a dense
French Grande École CV into a layout international recruiters can read.

> **Author:** _Georgio El Asmar_

> **Live URL:** _[Github Pages Live Website](https://georgioasmar.github.io/Stocks-Tracker)_

---

## API used

**Finnhub** (https://finnhub.io) — free, registration/key-based stock-market API.

The Markets page demonstrates all three  API features at once:
**client-side search**, **filtering** (by sector and by gainers/losers), and
**pagination** (6 cards per page). It also handles **loading**, **error**, and **empty** states explicitly (see `MarketsPage._state()` in `js/markets.js`).

---

## Project description

| Page | File | What it does |
|------|------|--------------|
| Home | `index.html` | Hero + features + the sign-in call-to-action modal |
| Markets | `markets.html` | Live API data with search / filter / pagination + detail modal |
| Resources | `resources.html` | 16 curated quant resources with category filtering |
| About | `about.html` | Project + stack overview |

**Stack:** semantic HTML5, hand-written CSS3 (`css/styles.css`), Bootstrap 5 (CDN),
and vanilla JavaScript written **entirely with ES6 classes** — `App`, `ApiService`,
`AuthModal`, `MarketsPage`, `ResourcesPage`. No jQuery, no frameworks.

**Own content (well over 15 real items):** a 25-company curated watchlist
(`WATCHLIST` in `js/config.js`) plus 16 curated resources (`RESOURCES` in
`js/resources.js`).

---

## Custom front-end requirement

**Implemented requirement:** _"Create a hero section with overlay text and call-to-action"_

Where: clicking any stock card on the **Markets** page opens `#detailModal`, which
is populated live from Finnhub's company-profile endpoint. The implementing code is
marked with a `CUSTOM UI REQUIREMENT` comment block in `js/markets.js`
(`MarketsPage._openDetail()`).
(`.spinner`, shown during API calls), **real-time form validation** (the sign-in
modal), and a **responsive card grid with hover effects** (Markets & Resources).

---

## Responsive evidence

Desktop view:

![Desktop View](images\desktop_view.png)

Mobile view:

![Mobile View](images\mobile_view.png)

Tablet View:

![Tablet View](images\ipad_view.png)

- `evidence/mobile.png`
- `evidence/tablet.png`
- `evidence/desktop.png`

---

## AI-use appendix

**Tools used**

- _Claude / Gemini_ — used to: scaffold the ES6 class structure, draft the
  Finnhub fetch wrapper, and rebuild the React/Tailwind mockup as vanilla
  HTML/CSS/Bootstrap as per the .

**Sample prompts**

1. _"Convert this React/Tailwind landing page into semantic HTML5 + Bootstrap 5
   with hand-written CSS3, no frameworks."_
2. _"Write an ES6 class that fetches quotes for a list of tickers from Finnhub and
   handles 401/429/network errors."_

**What the AI got wrong**

1. _"The first version called the API once per keystroke in the search box,
   hitting Finnhub's rate limit. I changed search to filter the already-loaded
   data client-side instead — found it when the cards flickered and 429 errors
   appeared in the console."_
2. _"Initial CSS made the 40/60 login split with floats, which collapsed on
   mobile. I rebuilt it with Flexbox and a media query that turns the image panel
   into a top banner under 768px."_

---

## Deployment
https://georgioasmar.github.io/Stocks-Tracker
Free deployment using Github Pages

