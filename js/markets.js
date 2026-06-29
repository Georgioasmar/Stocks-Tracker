/* ============================================================================
   markets.js  —  the API-driven page.
   Demonstrates: live API integration, client-side SEARCH + FILTER + PAGINATION,
   and explicit LOADING / ERROR / EMPTY states.

   ┌────────────────────────────────────────────────────────────────────────┐
   │ CUSTOM UI REQUIREMENT — "Implement a modal popup for a detailed view of  │
   │ an item." Clicking any stock card opens #detailModal, populated live     │
   │ from Finnhub's company-profile endpoint. (Also satisfies several related │
   │ requirements: loading spinner, card grid w/ hover.)                      │
   └────────────────────────────────────────────────────────────────────────┘
   ========================================================================== */

class MarketsPage {
  constructor(api, watchlist) {
    this.api = api;
    this.all = [];                 // [{symbol,name,sector,quote,failed}]
    this.watchlist = watchlist;

    this.term = "";
    this.sector = "all";
    this.trend = "all";
    this.page = 1;

    // DOM
    this.grid     = document.getElementById("grid");
    this.status   = document.getElementById("status");
    this.search   = document.getElementById("search");
    this.sectorEl = document.getElementById("sectorFilter");
    this.trendEl  = document.getElementById("trendFilter");
    this.pager    = document.getElementById("pager");

    this.detailModal = new bootstrap.Modal(document.getElementById("detailModal"));
    this.detailBody  = document.getElementById("detailBody");
    this.detailTitle = document.getElementById("detailTitle");

    this._bind();
    this._populateSectors();
  }

  _bind() {
    this.search.addEventListener("input", (e) => {
      this.term = e.target.value.toLowerCase().trim();
      this.page = 1; this.render();
    });
    this.sectorEl.addEventListener("change", (e) => {
      this.sector = e.target.value; this.page = 1; this.render();
    });
    this.trendEl.addEventListener("change", (e) => {
      this.trend = e.target.value; this.page = 1; this.render();
    });
  }

  _populateSectors() {
    const sectors = [...new Set(this.watchlist.map((i) => i.sector))].sort();
    sectors.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s; opt.textContent = s;
      this.sectorEl.appendChild(opt);
    });
  }

  /* ---- data load with LOADING / ERROR states ---------------------------- */
  async load() {
    if (!this.api.hasKey()) {
      return this._state(
        "No API key set",
        'Add your free Finnhub key in <code>js/config.js</code> to load live prices.'
      );
    }
    this._state("Loading live market data…", "", true);
    try {
      this.all = await this.api.getQuotes(this.watchlist);
      this.render();
    } catch (err) {
      this._state("Could not load market data", err.message);
    }
  }

  /* ---- filtering pipeline ----------------------------------------------- */
  _filtered() {
    return this.all.filter((it) => {
      const matchTerm =
        it.symbol.toLowerCase().includes(this.term) ||
        it.name.toLowerCase().includes(this.term);
      const matchSector = this.sector === "all" || it.sector === this.sector;

      let matchTrend = true;
      const dp = it.quote ? it.quote.dp : null;
      if (this.trend === "gainers") matchTrend = dp !== null && dp > 0;
      if (this.trend === "losers")  matchTrend = dp !== null && dp < 0;

      return matchTerm && matchSector && matchTrend;
    });
  }

  /* ---- render with EMPTY state + pagination ----------------------------- */
  render() {
    const rows = this._filtered();

    if (rows.length === 0) {
      this.grid.innerHTML = "";
      this.pager.innerHTML = "";
      return this._state("No matches", "Try a different search or filter.");
    }

    this.status.classList.add("d-none");

    const pages = Math.ceil(rows.length / CONFIG.PAGE_SIZE);
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * CONFIG.PAGE_SIZE;
    const slice = rows.slice(start, start + CONFIG.PAGE_SIZE);

    this.grid.innerHTML = slice.map((it) => this._card(it)).join("");
    this.grid.querySelectorAll("[data-symbol]").forEach((el) =>
      el.addEventListener("click", () => this._openDetail(el.dataset.symbol))
    );

    this._renderPager(pages);
  }

  _card(it) {
    const q = it.quote;
    const has = q && q.c;
    const dp = has ? q.dp : 0;
    const dir = dp > 0 ? "up" : dp < 0 ? "down" : "flat";
    const price = has ? `$${q.c.toFixed(2)}` : "—";
    const chg = has ? `${dp > 0 ? "+" : ""}${dp.toFixed(2)}%` : "n/a";

    return `
      <div class="col-12 col-sm-6 col-lg-4">
        <button class="stock-card ${dir}" data-symbol="${it.symbol}">
          <div class="stock-card__top">
            <span class="ticker">${it.symbol}</span>
            <span class="sector">${it.sector}</span>
          </div>
          <p class="stock-card__name">${it.name}</p>
          <div class="stock-card__bottom">
            <span class="price">${price}</span>
            <span class="change ${dir}">${chg}</span>
          </div>
        </button>
      </div>`;
  }

  _renderPager(pages) {
    if (pages <= 1) { this.pager.innerHTML = ""; return; }
    let html = "";
    const btn = (label, page, disabled, active) =>
      `<li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
         <button class="page-link" data-page="${page}">${label}</button>
       </li>`;

    html += btn("‹", this.page - 1, this.page === 1, false);
    for (let p = 1; p <= pages; p++) html += btn(p, p, false, p === this.page);
    html += btn("›", this.page + 1, this.page === pages, false);

    this.pager.innerHTML = html;
    this.pager.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = Number(b.dataset.page);
        if (p >= 1 && p <= pages) { this.page = p; this.render(); }
      })
    );
  }

  /* ---- detail modal (CUSTOM UI REQUIREMENT) ----------------------------- */
  async _openDetail(symbol) {
    const item = this.all.find((i) => i.symbol === symbol);
    this.detailTitle.textContent = `${symbol} · ${item.name}`;
    this.detailBody.innerHTML =
      `<div class="spinner"></div><p class="text-center mt-3 mb-0">Loading profile…</p>`;
    this.detailModal.show();

    try {
      const p = await this.api.getProfile(symbol);
      const q = item.quote;
      const rows = [
        ["Exchange", p.exchange],
        ["Industry", p.finnhubIndustry],
        ["Country", p.country],
        ["Currency", p.currency],
        ["Market cap", p.marketCapitalization ? `$${Math.round(p.marketCapitalization).toLocaleString()} M` : "—"],
        ["IPO date", p.ipo],
        ["Last price", q && q.c ? `$${q.c.toFixed(2)}` : "—"],
        ["Day range", q && q.l ? `$${q.l.toFixed(2)} – $${q.h.toFixed(2)}` : "—"],
      ];
      this.detailBody.innerHTML = `
        <table class="detail-table">
          ${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v || "—"}</td></tr>`).join("")}
        </table>
        ${p.weburl ? `<a class="detail-link" href="${p.weburl}" target="_blank" rel="noopener">Company website ↗</a>` : ""}`;
    } catch (err) {
      this.detailBody.innerHTML =
        `<p class="state__msg">Could not load profile — ${err.message}</p>`;
    }
  }

  /* ---- shared state renderer (loading / error / empty) ------------------- */
  _state(title, msg, loading = false) {
    this.grid.innerHTML = "";
    this.pager.innerHTML = "";
    this.status.classList.remove("d-none");
    this.status.innerHTML = `
      ${loading ? '<div class="spinner"></div>' : ""}
      <h3 class="state__title">${title}</h3>
      ${msg ? `<p class="state__msg">${msg}</p>` : ""}`;
  }
}
