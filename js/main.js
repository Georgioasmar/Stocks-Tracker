/* ============================================================================
   main.js  —  shared bootstrapping that runs on every page.
   Each page sets <body data-page="..."> so this file knows what to start.
   ========================================================================== */

class App {
  constructor() {
    this.page = document.body.dataset.page;
    this._markActiveNav();
    this._setYear();
    this._initAuth();
    this._initPage();
  }

  /* Highlight the current link in the shared navbar. */
  _markActiveNav() {
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".navbar .nav-link").forEach((a) => {
      if (a.getAttribute("href") === here) a.classList.add("active");
    });
  }

  _setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* The login modal exists on every page; wire all "Sign in" triggers to it. */
  _initAuth() {
    this.auth = new AuthModal();
    document.querySelectorAll("[data-open-auth]").forEach((btn) =>
      btn.addEventListener("click", () => this.auth.open())
    );

    // CTA pop-up: auto-open once per browser session, on the home page only.
    if (this.page === "home" && !sessionStorage.getItem("authSeen")) {
      sessionStorage.setItem("authSeen", "1");
      setTimeout(() => this.auth.open(), 1200);
    }
  }

  _initPage() {
    if (this.page === "markets") {
      const api = new ApiService(CONFIG);
      new MarketsPage(api, WATCHLIST).load();
    }
    if (this.page === "resources") {
      new ResourcesPage(RESOURCES);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new App());
