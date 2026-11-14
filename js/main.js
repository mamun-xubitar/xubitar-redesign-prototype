/* Xubitar prototype — core interactions (vanilla JS).
   Motion-only effects live in motion.js; calculators/demos in widgets.js. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hoverable = window.matchMedia("(hover: hover)").matches;
  const headerOffset = () => (($("[data-header]") || {}).offsetHeight || 0) + 16;
  window.XB = window.XB || {};

  /* ------------------------------------------------------------------
     Smooth scroll — Lenis (same library and defaults as the app)
     ------------------------------------------------------------------ */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ autoRaf: true, lerp: 0.1 });
    window.XB.lenis = lenis;
  }
  const scrollToEl = (el) => {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -headerOffset(), duration: 1.1 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerOffset(), behavior: reduce ? "auto" : "smooth" });
  };
  window.XB.scrollToEl = scrollToEl;
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.getAttribute("href"), location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === "#") return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, "", url.hash);
    scrollToEl(target);
  });
  if (location.hash && lenis) {
    const t = document.getElementById(location.hash.slice(1));
    if (t) setTimeout(() => scrollToEl(t), 120);
  }

  /* ------------------------------------------------------------------
     Header: shadow when scrolled, hides on scroll down, returns on scroll up
     ------------------------------------------------------------------ */
  const header = $("[data-header]");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (!header) return;
    header.classList.toggle("is-scrolled", y > 8);
    const menuOpen = $(".nav-item.is-open") || ($("[data-mobile-menu]") && !$("[data-mobile-menu]").hidden);
    if (!menuOpen && y > 480 && y > lastY + 4) header.classList.add("is-hidden");
    else if (y < lastY - 4 || y < 480) header.classList.remove("is-hidden");
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     Desktop dropdowns (hover intent + click + keyboard)
     ------------------------------------------------------------------ */
  const dropdowns = $$("[data-dropdown]");
  const closeAll = (except) => dropdowns.forEach((d) => {
    if (d !== except) { d.classList.remove("is-open"); $("button", d).setAttribute("aria-expanded", "false"); }
  });
  dropdowns.forEach((d) => {
    const btn = $("button", d);
    let t;
    const open = () => { clearTimeout(t); closeAll(d); d.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); };
    const close = () => { t = setTimeout(() => { d.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }, 140); };
    d.addEventListener("mouseenter", () => { if (hoverable) { clearTimeout(t); t = setTimeout(open, 60); } });
    d.addEventListener("mouseleave", () => { if (hoverable) { clearTimeout(t); close(); } });
    btn.addEventListener("click", (e) => { e.stopPropagation(); d.classList.contains("is-open") ? (d.classList.remove("is-open"), btn.setAttribute("aria-expanded", "false")) : open(); });
    d.addEventListener("focusout", (e) => { if (!d.contains(e.relatedTarget)) close(); });
    d.addEventListener("keydown", (e) => {
      const items = $$(".menu-link", d);
      const i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); open(); (items[i + 1] || items[0]).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest("[data-dropdown]")) closeAll(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  /* ------------------------------------------------------------------
     Mobile menu (animated open/close, burger morph)
     ------------------------------------------------------------------ */
  const menuBtn = $("[data-menu-toggle]");
  const mobileMenu = $("[data-mobile-menu]");
  if (menuBtn && mobileMenu) {
    const setMenu = (open) => {
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        mobileMenu.classList.remove("is-closing");
        mobileMenu.hidden = false;
        document.body.style.overflow = "hidden";
        if (lenis) lenis.stop();
      } else {
        mobileMenu.classList.add("is-closing");
        setTimeout(() => { mobileMenu.hidden = true; mobileMenu.classList.remove("is-closing"); }, reduce ? 0 : 240);
        document.body.style.overflow = "";
        if (lenis) lenis.start();
      }
    };
    menuBtn.addEventListener("click", () => setMenu(mobileMenu.hidden));
    $$("a", mobileMenu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !mobileMenu.hidden) setMenu(false); });
  }

  /* ------------------------------------------------------------------
     Before / after slider (drag, keyboard via range input)
     ------------------------------------------------------------------ */
  $$("[data-ba]").forEach((ba) => {
    const range = $("[data-ba-range]", ba);
    const set = (v) => ba.style.setProperty("--pos", v + "%");
    const touch = () => { ba.classList.add("is-touched"); ba.dataset.touched = "1"; };
    range.addEventListener("input", () => { set(range.value); touch(); });
    range.addEventListener("pointerdown", () => { ba.classList.add("is-dragging"); touch(); });
    window.addEventListener("pointerup", () => ba.classList.remove("is-dragging"));
    set(range.value);
  });

  /* ------------------------------------------------------------------
     FAQ accordion: smooth height, one open at a time per group
     ------------------------------------------------------------------ */
  const animateDetails = (d, open) => {
    const ans = $(".ans", d);
    if (!ans || reduce) { d.open = open; return; }
    if (d._anim) d._anim.cancel();
    if (open) {
      d.open = true;
      const h = ans.scrollHeight;
      d._anim = ans.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" });
    } else {
      const h = ans.offsetHeight;
      d._anim = ans.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 260, easing: "cubic-bezier(.65,0,.35,1)" });
      d._anim.onfinish = () => { d.open = false; };
    }
  };
  $$(".faq details").forEach((d) => {
    $("summary", d).addEventListener("click", (e) => {
      e.preventDefault();
      const willOpen = !d.open;
      if (willOpen) $$("details[open]", d.parentElement).forEach((o) => { if (o !== d) animateDetails(o, false); });
      animateDetails(d, willOpen);
    });
  });

  /* ------------------------------------------------------------------
     Animated filters (work case studies + careers)
     ------------------------------------------------------------------ */
  const runFilter = (items, match, emptyEl) => {
    const leaving = items.filter((el) => !el.hidden && !match(el));
    leaving.forEach((el) => el.classList.add("is-leaving"));
    setTimeout(() => {
      let k = 0;
      items.forEach((el) => {
        el.classList.remove("is-leaving", "is-entering");
        const show = match(el);
        el.hidden = !show;
        el.classList.toggle("is-hidden", !show);
        if (show) {
          el.classList.remove("reveal");
          el.classList.add("is-in");
          if (!reduce) { el.style.setProperty("--d", k * 70 + "ms"); void el.offsetWidth; el.classList.add("is-entering"); }
          k++;
        }
      });
      if (emptyEl) emptyEl.hidden = k > 0;
    }, reduce ? 0 : 190);
  };
  const workChips = $$("[data-filter]");
  if (workChips.length) {
    workChips.forEach((btn) => btn.addEventListener("click", () => {
      workChips.forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
      const cat = btn.dataset.filter;
      runFilter($$("[data-cat]"), (el) => cat === "all" || el.dataset.cat === cat, $("[data-filter-empty]"));
    }));
  }
  const teamChips = $$("[data-team-filter]");
  if (teamChips.length) {
    teamChips.forEach((btn) => btn.addEventListener("click", () => {
      teamChips.forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
      const team = btn.dataset.teamFilter;
      runFilter($$("[data-team]"), (el) => team === "all" || el.dataset.team === team, $("[data-team-empty]"));
    }));
  }

  /* ------------------------------------------------------------------
     Testimonials: swipe carousel dots (mobile)
     ------------------------------------------------------------------ */
  $$("[data-carousel]").forEach((track) => {
    const dotsWrap = track.parentElement.querySelector("[data-t-dots]");
    if (!dotsWrap) return;
    const slides = Array.from(track.children).filter((c) => c.nodeType === 1 && !c.matches("x-note"));
    slides.forEach((s, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show review " + (i + 1));
      b.addEventListener("click", () => track.scrollTo({ left: s.offsetLeft - track.offsetLeft - 20, behavior: reduce ? "auto" : "smooth" }));
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);
    const update = () => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bestD = Infinity;
      slides.forEach((s, i) => { const c = s.offsetLeft - track.offsetLeft + s.offsetWidth / 2; const dd = Math.abs(c - mid); if (dd < bestD) { bestD = dd; best = i; } });
      dots.forEach((d, i) => d.classList.toggle("is-active", i === best));
    };
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    update();
  });

  /* ------------------------------------------------------------------
     Multi-step enquiry form
     ------------------------------------------------------------------ */
  const form = $("[data-steps]");
  if (form) {
    const steps = $$("[data-step]", form);
    const markers = $$("[data-step-marker]");
    const bar = $("[data-step-progress]", form);
    let i = 0;
    const show = (n) => {
      const dir = n > i ? "from-right" : "from-left";
      i = n;
      steps.forEach((s, k) => { s.classList.remove("from-right", "from-left"); s.classList.toggle("is-active", k === n); if (k === n) s.classList.add(dir); });
      markers.forEach((mk, k) => { mk.classList.toggle("is-active", k === n); mk.classList.toggle("is-done", k < n); });
      if (bar) bar.style.setProperty("--sp", ((n + 1) / steps.length).toFixed(4));
      const top = form.getBoundingClientRect().top;
      if (top < 0) scrollToEl(form);
      const first = $("input:not([type=hidden]), textarea, select", steps[n]);
      if (first && n > 0) setTimeout(() => first.focus({ preventScroll: true }), 350);
    };
    const shake = (el) => { if (!el || reduce) return; el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); };
    const valid = (step) => {
      let ok = true;
      $$("[required]", step).forEach((inp) => {
        const field = inp.closest(".field");
        let good;
        if (inp.type === "checkbox" || inp.type === "radio") good = $$(`[name="${inp.name}"]`, step).some((x) => x.checked);
        else if (inp.type === "email") good = /.+@.+\..+/.test(inp.value);
        else good = inp.value.trim().length > 0;
        if (field) { field.classList.toggle("has-error", !good); if (!good) shake(field); }
        if (!good) ok = false;
      });
      const groupErr = $("[data-group-error]", step);
      if (groupErr) { groupErr.hidden = ok; if (!ok) shake($(".choice-grid", step)); }
      return ok;
    };
    $$("[data-next]", form).forEach((b) => b.addEventListener("click", () => { if (valid(steps[i])) show(i + 1); }));
    $$("[data-back]", form).forEach((b) => b.addEventListener("click", () => show(i - 1)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!valid(steps[i])) return;
      const btn = $("button[type=submit]", form);
      btn.classList.add("is-loading");
      btn.innerHTML = '<span class="spinner"></span> Sending…';
      setTimeout(() => {
        steps.forEach((s) => s.classList.remove("is-active"));
        markers.forEach((mk) => { mk.classList.remove("is-active"); mk.classList.add("is-done"); });
        if (bar) bar.style.setProperty("--sp", "1");
        const ok = $("[data-success]");
        ok.classList.add("is-active");
        const name = $("#f-name");
        const out = $("[data-success-name]");
        if (name && out && name.value.trim()) out.textContent = ", " + name.value.trim().split(" ")[0];
        scrollToEl(form);
      }, reduce ? 0 : 900);
    });
    $$("input, textarea, select", form).forEach((inp) => inp.addEventListener("input", () => {
      const f = inp.closest(".field");
      if (f) f.classList.remove("has-error");
      const ge = $("[data-group-error]", inp.closest("[data-step]") || form);
      if (ge && inp.type === "checkbox") ge.hidden = true;
    }));
    const ta = $("#f-problem");
    const cc = $("[data-char-count]");
    if (ta && cc) {
      const max = Number(ta.getAttribute("maxlength")) || 1000;
      const upd = () => { cc.textContent = ta.value.length + " / " + max; };
      ta.addEventListener("input", upd); upd();
    }
    // Pre-select project type from ?type=agency etc.
    const qt = new URLSearchParams(location.search).get("type");
    if (qt) { const box = $(`input[name="type"][value="${qt}"]`, form); if (box) box.checked = true; }
  }

  /* ------------------------------------------------------------------
     Booking widget (visual demo of Cal.com-style flow)
     ------------------------------------------------------------------ */
  const slotsWrap = $("[data-cal-slots]");
  const confirmBox = $("[data-cal-confirm]");
  let chosenDay = $("[data-cal-day].is-active");
  $$("[data-cal-day]").forEach((b) => b.addEventListener("click", () => {
    chosenDay = b;
    $$("[data-cal-day]").forEach((x) => x.classList.toggle("is-active", x === b));
    if (slotsWrap) { slotsWrap.classList.remove("is-refresh"); void slotsWrap.offsetWidth; slotsWrap.classList.add("is-refresh"); }
    $$("[data-cal-slot]").forEach((s) => s.classList.remove("is-active"));
    if (confirmBox) confirmBox.hidden = true;
  }));
  $$("[data-cal-slot]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-cal-slot]").forEach((s) => s.classList.toggle("is-active", s === b));
    if (!confirmBox) return;
    $("[data-cal-when]", confirmBox).textContent = (chosenDay ? chosenDay.dataset.label : "") + " · " + b.textContent.trim();
    confirmBox.hidden = false;
    $("[data-cal-done]", confirmBox).hidden = true;
    $("[data-cal-actions]", confirmBox).hidden = false;
  }));
  const calBook = $("[data-cal-book]");
  if (calBook) calBook.addEventListener("click", () => {
    calBook.classList.add("is-loading");
    calBook.innerHTML = '<span class="spinner"></span> Booking…';
    setTimeout(() => {
      $("[data-cal-actions]", confirmBox).hidden = true;
      $("[data-cal-done]", confirmBox).hidden = false;
      calBook.classList.remove("is-loading");
      calBook.textContent = "Confirm booking";
    }, reduce ? 0 : 800);
  });

  /* ------------------------------------------------------------------
     Reading progress + table-of-contents scrollspy (case study)
     ------------------------------------------------------------------ */
  const prog = $("[data-read-progress]");
  const article = $("[data-article]");
  if (prog && article) {
    const upd = () => {
      const r = article.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -r.top / total));
      prog.style.setProperty("--progress", p.toFixed(4));
    };
    window.addEventListener("scroll", () => requestAnimationFrame(upd), { passive: true });
    upd();
  }
  const tocLinks = $$(".toc > a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    const map = new Map(tocLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove("is-active"));
          const a = map.get(en.target.id);
          if (a) a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Toki chat widget — scripted demo with nudge + unread badge
     ------------------------------------------------------------------ */
  const chat = $("[data-chat]");
  if (chat) {
    const panel = $("[data-chat-panel]", chat);
    const toggle = $("[data-chat-toggle]", chat);
    const body = $("[data-chat-body]", chat);
    const formEl = $("[data-chat-form]", chat);
    const nudge = $("[data-chat-nudge]", chat);
    const badge = $("[data-chat-badge]", chat);
    const iconChat = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.4-5.2A8.5 8.5 0 1 1 21 11.5z"/></svg>';
    const iconDown = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>';
    const iconWrap = $(".cl-icon", toggle);
    const setIcon = (html) => { const b = badge; iconWrap.innerHTML = html; if (b) iconWrap.appendChild(b); };
    const hideNudge = () => {
      if (!nudge || nudge.hidden) return;
      nudge.classList.add("is-closing");
      setTimeout(() => { nudge.hidden = true; nudge.classList.remove("is-closing"); }, reduce ? 0 : 240);
      try { sessionStorage.setItem("xb-nudged", "1"); } catch (e) { /* ignore */ }
    };
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      chat.classList.toggle("is-open", open);
      if (open) {
        panel.classList.remove("is-closing");
        panel.hidden = false;
        setIcon(iconDown);
        hideNudge();
        if (badge) badge.hidden = true;
        setTimeout(() => $("input", formEl).focus({ preventScroll: true }), 60);
      } else {
        panel.classList.add("is-closing");
        setTimeout(() => { panel.hidden = true; panel.classList.remove("is-closing"); }, reduce ? 0 : 200);
        setIcon(iconChat);
      }
    };
    toggle.addEventListener("click", () => setOpen(panel.hidden));
    $("[data-chat-close]", chat).addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) setOpen(false); });
    if (nudge) {
      nudge.addEventListener("click", (e) => { if (e.target.closest("[data-nudge-close]")) { hideNudge(); return; } setOpen(true); });
      let seen = false;
      try { seen = sessionStorage.getItem("xb-nudged") === "1"; } catch (e) { /* ignore */ }
      if (!seen && !new URLSearchParams(location.search).has("review")) {
        setTimeout(() => { if (panel.hidden) { nudge.hidden = false; if (badge) badge.hidden = false; } }, 7000);
      }
    }

    const replies = {
      "I need Shopify development": "Great. We build custom apps, integrations (ERP, CRM, 3PL), Shopify Functions and themes. Could you share your store URL and a line about what you need? I'll pass it to an engineer.",
      "Ongoing support plans": "We offer monthly plans with agreed development hours and response targets, from occasional fixes to a dedicated lead developer. The plan finder on the Support page suggests one based on your workload.",
      "AI automation idea": "Love it. Tell me which task takes your team the most time (lead follow-up, support emails, reporting…) and we'll suggest how to automate it. There's also a savings calculator on the AI Automation page.",
      "Agency partnership": "We work white-label with agencies: NDA by default, your brand, your tools. Want me to book an intro call with our partnerships lead?",
      "Talk to a human": "Sure. I've let the team know. An engineer will reply here, or by email, within one business day. What's the best email to reach you?"
    };
    const add = (cls, text) => {
      const d = document.createElement("div");
      d.className = "msg " + cls;
      d.textContent = text;
      body.appendChild(d);
      body.scrollTo({ top: body.scrollHeight, behavior: reduce ? "auto" : "smooth" });
      return d;
    };
    const botSay = (text) => {
      const t = document.createElement("div");
      t.className = "msg bot typing";
      t.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => { t.remove(); add("bot", text); }, reduce ? 0 : 700 + Math.min(900, text.length * 6));
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
