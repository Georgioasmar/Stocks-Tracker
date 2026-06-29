/* ============================================================================
   auth-modal.js  —  controls the "Sign in" call-to-action modal.
   Layout: 40% vertical image panel + 60% form (see .auth-grid in styles.css).
   Includes real-time email / password validation (no page reload).
   ========================================================================== */

class AuthModal {
  constructor() {
    this.modalEl   = document.getElementById("authModal");
    if (!this.modalEl) return;                      // not on this page
    this.modal     = new bootstrap.Modal(this.modalEl);
    this.form      = document.getElementById("authForm");
    this.email     = document.getElementById("authEmail");
    this.password  = document.getElementById("authPassword");
    this.emailMsg  = document.getElementById("emailError");
    this.passMsg   = document.getElementById("passError");
    this.feedback  = document.getElementById("authFeedback");

    this._bind();
  }

  _bind() {
    // Real-time validation: validate each field as the user types.
    this.email.addEventListener("input", () => this._validateEmail());
    this.password.addEventListener("input", () => this._validatePassword());

    // Email + password submit (client-side only — front-end demo).
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const okEmail = this._validateEmail();
      const okPass  = this._validatePassword();
      if (okEmail && okPass) {
        this._showFeedback(
          `Welcome back — signed in as ${this.email.value.trim()}.`, "ok"
        );
        this.form.reset();
      }
    });

    // Social buttons: stubbed (OAuth needs a backend, out of scope for a
    // front-end project) — they give honest, named feedback instead.
    document.querySelectorAll("[data-provider]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this._showFeedback(
          `${btn.dataset.provider} sign-in would open here in production.`, "info"
        );
      });
    });
  }

  _validateEmail() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok = re.test(this.email.value.trim());
    this._mark(this.email, this.emailMsg, ok, "Enter a valid email address.");
    return ok;
  }

  _validatePassword() {
    const ok = this.password.value.length >= 8;
    this._mark(this.password, this.passMsg, ok, "Use at least 8 characters.");
    return ok;
  }

  _mark(input, msgEl, ok, msg) {
    input.classList.toggle("is-invalid", !ok);
    input.classList.toggle("is-valid", ok && input.value.length > 0);
    msgEl.textContent = ok ? "" : msg;
  }

  _showFeedback(text, kind) {
    this.feedback.textContent = text;
    this.feedback.className = `auth-feedback show ${kind}`;
  }

  open() {
    if (this.modal) this.modal.show();
  }
}
