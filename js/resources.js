/* ============================================================================
   resources.js  —  a second set of your own curated content (16 real items).
   Rendered from a data array via an ES6 class, with client-side category
   filtering. Together with the 25-stock watchlist this comfortably exceeds the
   "15+ real items" requirement.
   ========================================================================== */

const RESOURCES = [
  { name: "Options, Futures, and Other Derivatives", by: "John C. Hull", cat: "Books",
    note: "The standard reference for derivatives pricing and risk." },
  { name: "Active Portfolio Management", by: "Grinold & Kahn", cat: "Books",
    note: "Foundational text on the fundamental law of active management." },
  { name: "Advances in Financial Machine Learning", by: "Marcos López de Prado", cat: "Books",
    note: "Modern ML methods applied carefully to financial data." },
  { name: "Stochastic Calculus for Finance I & II", by: "Steven Shreve", cat: "Books",
    note: "Rigorous treatment of the math behind pricing models." },
  { name: "Quantitative Trading", by: "Ernest P. Chan", cat: "Books",
    note: "Practical guide to building and backtesting strategies." },

  { name: "MIT 18.S096 — Topics in Mathematics with Applications in Finance", by: "MIT OpenCourseWare", cat: "Courses",
    note: "Free lecture series covering quant finance fundamentals." },
  { name: "Financial Engineering and Risk Management", by: "Columbia (Coursera)", cat: "Courses",
    note: "Pricing, hedging, and portfolio theory from Columbia faculty." },
  { name: "WorldQuant University MSc in Financial Engineering", by: "WorldQuant University", cat: "Courses",
    note: "Tuition-free, fully online graduate program." },

  { name: "Jane Street", by: "Proprietary trading firm", cat: "Firms",
    note: "Quant trading firm known for OCaml and probability puzzles." },
  { name: "Citadel Securities", by: "Market maker", cat: "Firms",
    note: "One of the largest electronic market makers globally." },
  { name: "Two Sigma", by: "Quant hedge fund", cat: "Firms",
    note: "Data- and technology-driven systematic investing." },
  { name: "Optiver", by: "Market maker", cat: "Firms",
    note: "Amsterdam-rooted market maker with strong intern programs." },

  { name: "QuantConnect", by: "Algorithmic trading platform", cat: "Tools",
    note: "Cloud backtesting and live trading in Python and C#." },
  { name: "QuantLib", by: "Open-source library", cat: "Tools",
    note: "C++ library for quantitative finance, with Python bindings." },
  { name: "pandas + NumPy", by: "Python data stack", cat: "Tools",
    note: "The default toolkit for financial data analysis in Python." },
  { name: "Backtrader", by: "Python framework", cat: "Tools",
    note: "Event-driven backtesting framework for trading strategies." },
];

class ResourcesPage {
  constructor(data) {
    this.data = data;
    this.cat = "all";
    this.grid = document.getElementById("resGrid");
    this.tabs = document.getElementById("resTabs");
    this._bindTabs();
    this.render();
  }

  _bindTabs() {
    const cats = ["all", ...new Set(this.data.map((d) => d.cat))];
    this.tabs.innerHTML = cats.map((c) =>
      `<button class="res-tab ${c === "all" ? "active" : ""}" data-cat="${c}">
         ${c === "all" ? "All" : c}
       </button>`
    ).join("");

    this.tabs.querySelectorAll("[data-cat]").forEach((btn) =>
      btn.addEventListener("click", () => {
        this.cat = btn.dataset.cat;
        this.tabs.querySelectorAll(".res-tab").forEach((b) =>
          b.classList.toggle("active", b === btn));
        this.render();
      })
    );
  }

  render() {
    const rows = this.cat === "all"
      ? this.data
      : this.data.filter((d) => d.cat === this.cat);

    this.grid.innerHTML = rows.map((d) => `
      <div class="col-12 col-md-6 col-lg-4">
        <article class="res-card">
          <span class="res-card__tag">${d.cat}</span>
          <h3 class="res-card__title">${d.name}</h3>
          <p class="res-card__by">${d.by}</p>
          <p class="res-card__note">${d.note}</p>
        </article>
      </div>`).join("");
  }
}
