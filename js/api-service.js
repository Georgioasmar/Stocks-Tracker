/* ============================================================================
   api-service.js  —  thin wrapper around the Finnhub REST API.
   Written as an ES6 class (assignment requirement: no jQuery, ES6 only).
   ========================================================================== */

class ApiService {
  constructor(config) {
    this.key = config.FINNHUB_KEY;
    this.base = config.BASE_URL;
  }

  /* Returns true only when a real key has been provided. */
  hasKey() {
    return this.key && this.key !== "PASTE_YOUR_FINNHUB_KEY_HERE";
  }

  /* Low-level fetch with explicit HTTP + network error handling. */
  async _get(path) {
    const sep = path.includes("?") ? "&" : "?";
    const url = `${this.base}${path}${sep}token=${this.key}`;

    const res = await fetch(url);
    if (res.status === 401 || res.status === 403) {
      throw new Error("Invalid or missing API key.");
    }
    if (res.status === 429) {
      throw new Error("Rate limit reached — wait a minute and retry.");
    }
    if (!res.ok) {
      throw new Error(`Request failed (HTTP ${res.status}).`);
    }
    return res.json();
  }

  /* Live quote for one symbol → { c, d, dp, h, l, o, pc }. */
  getQuote(symbol) {
    return this._get(`/quote?symbol=${encodeURIComponent(symbol)}`);
  }

  /* Company profile for the detail modal. */
  getProfile(symbol) {
    return this._get(`/stock/profile2?symbol=${encodeURIComponent(symbol)}`);
  }

  /* Fetch quotes for many symbols in parallel.
     Promise.allSettled lets one bad ticker fail without sinking the page. */
  async getQuotes(items) {
    const results = await Promise.allSettled(
      items.map((it) => this.getQuote(it.symbol))
    );
    return items.map((it, i) => {
      const r = results[i];
      return {
        ...it,
        quote: r.status === "fulfilled" ? r.value : null,
        failed: r.status === "rejected",
      };
    });
  }
}
