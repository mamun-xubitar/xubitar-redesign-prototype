/* Xubitar prototype — site interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* Sticky header shadow */
  const header = $("[data-header]");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Desktop dropdowns (hover + click + keyboard) */
  const dropdowns = $$("[data-dropdown]");
  const closeAll = (except) => dropdowns.forEach((d) => {
    if (d !== except) { d.classList.remove("is-open"); $("button", d).setAttribute("aria-expanded", "false"); }
  });
  dropdowns.forEach((d) => {
    const btn = $("button", d);
    let t;
    const open = () => { clearTimeout(t); closeAll(d); d.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); };
    const close = () => { t = setTimeout(() => { d.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }, 120); };
    d.addEventListener("mouseenter", () => { if (window.matchMedia("(hover: hover)").matches) open(); });
    d.addEventListener("mouseleave", () => { if (window.matchMedia("(hover: hover)").matches) close(); });
    btn.addEventListener("click", (e) => { e.stopPropagation(); d.classList.contains("is-open") ? (d.classList.remove("is-open"), btn.setAttribute("aria-expanded", "false")) : open(); });
    d.addEventListener("focusout", (e) => { if (!d.contains(e.relatedTarget)) close(); });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest("[data-dropdown]")) closeAll(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  /* Mobile menu */
  const menuBtn = $("[data-menu-toggle]");
  const mobileMenu = $("[data-mobile-menu]");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const open = mobileMenu.hasAttribute("hidden");
      mobileMenu.toggleAttribute("hidden", !open);
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      menuBtn.innerHTML = open
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>';
    });
  }

  /* Reveal on scroll */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Before / after slider */
  $$("[data-ba]").forEach((ba) => {
    const range = $("[data-ba-range]", ba);
    const set = (v) => ba.style.setProperty("--pos", v + "%");
    range.addEventListener("input", () => set(range.value));
    set(range.value);
  });

  /* Work filters */
  const filters = $$("[data-filter]");
  if (filters.length) {
    filters.forEach((btn) => btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.toggle("is-active", b === btn));
      const cat = btn.dataset.filter;
      $$("[data-cat]").forEach((card) => {
        const show = cat === "all" || card.dataset.cat === cat;
        card.classList.toggle("is-hidden", !show);
        if (show) card.classList.add("is-in");
      });
      const empty = $("[data-filter-empty]");
      if (empty) empty.hidden = $$("[data-cat]:not(.is-hidden)").length > 0;
    }));
  }

  /* Multi-step enquiry form */
  const form = $("[data-steps]");
  if (form) {
    const steps = $$("[data-step]", form);
    const markers = $$("[data-step-marker]");
    let i = 0;
    const show = (n) => {
      i = n;
      steps.forEach((s, k) => s.classList.toggle("is-active", k === n));
      markers.forEach((mk, k) => {
        mk.classList.toggle("is-active", k === n);
        mk.classList.toggle("is-done", k < n);
      });
      const top = form.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    };
    const valid = (step) => {
      let ok = true;
      $$("[required]", step).forEach((inp) => {
        const field = inp.closest(".field");
        let good;
        if (inp.type === "checkbox" || inp.type === "radio") {
          good = $$(`[name="${inp.name}"]`, step).some((x) => x.checked);
        } else if (inp.type === "email") {
          good = /.+@.+\..+/.test(inp.value);
        } else {
          good = inp.value.trim().length > 0;
        }
        if (field) field.classList.toggle("has-error", !good);
        if (!good) ok = false;
      });
      const groupErr = $("[data-group-error]", step);
      if (groupErr) groupErr.hidden = ok;
      return ok;
    };
    $$("[data-next]", form).forEach((b) => b.addEventListener("click", () => { if (valid(steps[i])) show(i + 1); }));
    $$("[data-back]", form).forEach((b) => b.addEventListener("click", () => show(i - 1)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!valid(steps[i])) return;
      steps.forEach((s) => s.classList.remove("is-active"));
      markers.forEach((mk) => { mk.classList.remove("is-active"); mk.classList.add("is-done"); });
      const ok = $("[data-success]");
      ok.classList.add("is-active");
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      const name = $("#f-name");
      const out = $("[data-success-name]");
      if (name && out && name.value.trim()) out.textContent = ", " + name.value.trim().split(" ")[0];
    });
    $$("input, textarea, select", form).forEach((inp) => inp.addEventListener("input", () => {
      const f = inp.closest(".field");
      if (f) f.classList.remove("has-error");
    }));
  }

  /* Booking widget (visual only) */
  $$("[data-cal-day]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-cal-day]").forEach((x) => x.classList.toggle("is-active", x === b));
  }));
  $$("[data-cal-slot]").forEach((b) => b.addEventListener("click", () => {
    const out = $("[data-cal-out]");
    if (out) out.innerHTML = "<strong>" + b.textContent + "</strong> selected — in the live site this opens the booking confirmation (e.g. Cal.com / Calendly).";
  }));

  /* Toki chat widget — scripted demo */
  const chat = $("[data-chat]");
  if (chat) {
    const panel = $("[data-chat-panel]", chat);
    const toggle = $("[data-chat-toggle]", chat);
    const body = $("[data-chat-body]", chat);
    const formEl = $("[data-chat-form]", chat);
    const setOpen = (open) => {
      panel.hidden = !open;
      chat.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".cl-icon").innerHTML = open
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.4-5.2A8.5 8.5 0 1 1 21 11.5z"/></svg>';
      if (open) setTimeout(() => $("input", formEl).focus({ preventScroll: true }), 50);
    };
    toggle.addEventListener("click", () => setOpen(panel.hidden));
    $("[data-chat-close]", chat).addEventListener("click", () => setOpen(false));

    const replies = {
      "I need Shopify development": "Great. We build custom apps, integrations (ERP, CRM, 3PL), Shopify Functions and themes. Could you share your store URL and a line about what you need? I'll pass it to an engineer.",
      "Ongoing support plans": "We offer monthly plans with agreed development hours and response targets, from occasional fixes to a dedicated lead developer. You can compare them on the Support & Maintenance page.",
      "AI automation idea": "Love it. Tell me which task takes your team the most time (e.g. lead follow-up, support emails, reporting) and we'll suggest how to automate it.",
      "Agency partnership": "We work white-label with agencies: NDA by default, your brand, your tools. Want me to book an intro call with our partnerships lead?",
      "Talk to a human": "Sure. I've let the team know. An engineer will reply here, or by email, within one business day. What's the best email to reach you?"
    };
    const add = (cls, text) => {
      const d = document.createElement("div");
      d.className = "msg " + cls;
      d.textContent = text;
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    };
    const botSay = (text) => {
      const t = document.createElement("div");
      t.className = "msg bot typing";
      t.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => { t.remove(); add("bot", text); }, 900);
    };
    body.addEventListener("click", (e) => {
      const b = e.target.closest(".quick button");
      if (!b) return;
      const q = b.textContent.trim();
      b.parentElement.remove();
      add("user", q);
      botSay(replies[q] || "Thanks! An engineer will follow up shortly.");
    });
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = $("input", formEl);
      const v = inp.value.trim();
      if (!v) return;
      add("user", v);
      inp.value = "";
      botSay(/@/.test(v)
        ? "Thanks — got it. A Xubitar engineer will email you within one business day."
        : "Thanks for the details. I'll share this with the team. Could you also leave your email so we can follow up?");
    });
  }
})();
