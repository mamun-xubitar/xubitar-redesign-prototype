/* Xubitar prototype — interactive decision tools:
   plan finder (support), savings calculator (AI automation), search-visibility demo (SEO). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const paintRange = (r) => {
    const p = ((r.value - r.min) / (r.max - r.min)) * 100;
    r.style.setProperty("--fill", p + "%");
  };
  $$(".range").forEach((r) => { paintRange(r); r.addEventListener("input", () => paintRange(r)); });

  /* Smoothly tween a number inside an element */
  const tween = (el, to, fmt) => {
    const from = parseFloat(el.dataset.v || "0");
    el.dataset.v = to;
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 450;
    cancelAnimationFrame(el._raf);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (t < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  };
  const swap = (el, text) => {
    if (el.textContent === text) return;
    el.innerHTML = "";
    const s = document.createElement("span");
    s.className = reduce ? "" : "swap";
    s.textContent = text;
    el.appendChild(s);
  };

  /* ------------------------------------------------------------------
     Plan finder — recommends a support plan from expected workload
     ------------------------------------------------------------------ */
  const finder = $("[data-plan-finder]");
  if (finder) {
    const hours = $("[data-hours]", finder);
    const critical = $("[data-critical]", finder);
    const multi = $("[data-multi]", finder);
    const outH = $("[data-out-hours]", finder);
    const outPlan = $("[data-out-plan]", finder);
    const outNote = $("[data-out-note]", finder);
    const plans = $$("[data-plan]");
    const info = {
      Care: "10 hrs included · 2 business day response",
      Growth: "25 hrs included · 1 business day response · Slack",
      Partner: "60 hrs included · same-day critical response",
    };
    const update = () => {
      const h = Number(hours.value);
      outH.textContent = h + " hrs / month";
      let plan = h <= 10 ? "Care" : h <= 25 ? "Growth" : "Partner";
      if (critical.checked || (multi && multi.checked)) plan = "Partner";
      let note = info[plan];
      if (h > 60) note = "Partner + extra hours — we'll tailor a custom plan";
      swap(outPlan, plan);
      outNote.textContent = note;
      plans.forEach((p) => p.classList.toggle("is-recommended", p.dataset.plan === plan));
    };
    [hours, critical, multi].forEach((el) => el && el.addEventListener("input", update));
    update();
  }

  /* ------------------------------------------------------------------
     Savings calculator — AI automation
     ------------------------------------------------------------------ */
  const calc = $("[data-calc]");
  if (calc) {
    const inp = (n) => $(`[data-in="${n}"]`, calc);
    const out = (n) => $(`[data-out="${n}"]`, calc);
    const nf = (v) => Math.round(v).toLocaleString("en-US");
    const update = () => {
      const people = Number(inp("people").value);
      const hrs = Number(inp("hours").value);
      const share = Number(inp("share").value) / 100;
      const rate = Number(inp("rate").value);
      out("people-v").textContent = people + (people === 1 ? " person" : " people");
      out("hours-v").textContent = hrs + " hrs / week";
      out("share-v").textContent = Math.round(share * 100) + "%";
      out("rate-v").textContent = "$" + rate + " / hr";
      const month = people * hrs * share * 4.33;
      const year = month * 12;
      tween(out("month"), month, nf);
      tween(out("year"), year, nf);
      tween(out("days"), year / 8, nf);
      tween(out("money"), year * rate, (v) => "$" + nf(v));
      $(".calc-bar i", calc).style.setProperty("--w", Math.round(share * 100) + "%");
    };
    $$("input", calc).forEach((el) => el.addEventListener("input", update));
    update();
  }

  /* ------------------------------------------------------------------
     SEO / AEO / GEO / LLMO demo — tabs with auto-advance
     ------------------------------------------------------------------ */
  $$("[data-tabs]").forEach((wrap) => {
    const tabs = $$("[role=tab]", wrap);
    const panels = $$("[role=tabpanel]", wrap);
    const dur = Number(wrap.dataset.autoplay || 0);
    let i = 0, timer = null, auto = !!dur && !reduce, visible = false;
    wrap.style.setProperty("--dur-tab", dur + "ms");
    const select = (n, user) => {
      i = n;
      tabs.forEach((t, k) => {
        t.setAttribute("aria-selected", String(k === n));
        t.tabIndex = k === n ? 0 : -1;
        const bar = $(".tab-progress", t);
        if (bar) { bar.classList.remove("is-running"); if (k === n && auto) { void bar.offsetWidth; bar.classList.add("is-running"); } }
      });
      panels.forEach((p, k) => { p.classList.toggle("is-active", k === n); p.hidden = k !== n; });
      if (user) { auto = false; clearTimeout(timer); $$(".tab-progress", wrap).forEach((b) => b.classList.remove("is-running")); }
      schedule();
    };
    const schedule = () => {
      clearTimeout(timer);
      if (auto && visible) timer = setTimeout(() => select((i + 1) % tabs.length), dur);
    };
    tabs.forEach((t, k) => {
      t.addEventListener("click", () => select(k, true));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); select((k + 1) % tabs.length, true); tabs[(k + 1) % tabs.length].focus(); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); const j = (k - 1 + tabs.length) % tabs.length; select(j, true); tabs[j].focus(); }
      });
    });
    wrap.addEventListener("mouseenter", () => { if (auto) { clearTimeout(timer); $$(".tab-progress", wrap).forEach((b) => (b.style.animationPlayState = "paused")); } });
    wrap.addEventListener("mouseleave", () => { if (auto) { $$(".tab-progress", wrap).forEach((b) => (b.style.animationPlayState = "")); select(i); } });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((en) => en.forEach((e) => { visible = e.isIntersecting; if (visible && auto) select(i); else clearTimeout(timer); }), { threshold: 0.35 }).observe(wrap);
    }
    select(0);
  });

  /* ------------------------------------------------------------------
     Style guide: replay motion demos
     ------------------------------------------------------------------ */
  $$("[data-replay]").forEach((btn) => btn.addEventListener("click", () => {
    const stage = btn.closest(".demo").querySelector(".demo-stage");
    const cls = "play-" + btn.dataset.replay;
    stage.classList.remove(cls);
    void stage.offsetWidth;
    stage.classList.add(cls);
  }));
})();
