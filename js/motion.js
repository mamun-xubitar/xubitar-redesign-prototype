/* Xubitar prototype — motion layer.
   Mirrors lib/motion/presets.ts (fadeUp / scaleIn / stagger) for the build.
   Every looping effect only runs while visible, and nothing animates when the
   visitor prefers reduced motion. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasIO = "IntersectionObserver" in window;
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* Observe once when an element enters the viewport */
  const onceInView = (els, cb, opts = {}) => {
    if (!hasIO) { els.forEach(cb); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); cb(en.target); } });
    }, { rootMargin: opts.rootMargin || "0px 0px -8% 0px", threshold: opts.threshold || 0.12 });
    els.forEach((el) => io.observe(el));
  };
  /* Track visibility continuously (to pause loops off-screen) */
  const trackVisible = (el, onChange) => {
    if (!hasIO) { onChange(true); return; }
    new IntersectionObserver((entries) => entries.forEach((en) => onChange(en.isIntersecting)), { threshold: 0.15 }).observe(el);
  };
  /* A loop that only ticks while its element is visible */
  const visibleLoop = (el, fn, interval) => {
    let visible = false, timer = null;
    const tick = () => { if (visible && !document.hidden) fn(); timer = setTimeout(tick, typeof interval === "function" ? interval() : interval); };
    trackVisible(el, (v) => { visible = v; if (v && !timer) timer = setTimeout(tick, 600); });
  };

  /* ------------------------------------------------------------------
     1. Stagger + reveal (fadeUp / scaleIn / fade)
     ------------------------------------------------------------------ */
  $$("[data-stagger]").forEach((parent) => {
    $$(":scope > .reveal", parent).forEach((el, i) => {
      if (!/reveal-d\d/.test(el.className)) el.style.setProperty("--d", i * 100 + "ms");
    });
  });
  const reveals = $$(".reveal");
  const finishReveal = (el) => {
    // Once revealed, drop the reveal class so components get back their own hover transitions.
    const done = () => { el.classList.remove("reveal", "reveal-scale", "reveal-fade", "reveal-left", "reveal-right", "reveal-d1", "reveal-d2", "reveal-d3", "reveal-d4"); el.style.removeProperty("--d"); };
    const d = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
    setTimeout(done, d + 700);
  };
  if (reduce || !hasIO) {
    reveals.forEach((el) => { el.classList.add("is-in"); el.classList.remove("reveal"); });
  } else {
    onceInView(reveals, (el) => { el.classList.add("is-in"); finishReveal(el); }, { rootMargin: "0px 0px -60px 0px", threshold: 0.08 });
  }
  const inviews = $$("[data-inview]");
  if (reduce) inviews.forEach((el) => el.classList.add("is-in"));
  else onceInView(inviews, (el) => el.classList.add("is-in"), { threshold: 0.3 });

  /* ------------------------------------------------------------------
     2. Headline split (word-by-word rise, keeps inline elements intact)
     ------------------------------------------------------------------ */
  $$("[data-split]").forEach((h) => {
    if (reduce) { h.classList.add("is-split-in"); return; }
    const frag = document.createDocumentFragment();
    let i = 0;
    const wrap = (node) => {
      const w = document.createElement("span");
      w.className = "split-word";
      const inner = document.createElement("span");
      inner.style.setProperty("--d", 120 + i * 55 + "ms");
      inner.appendChild(node);
      w.appendChild(inner);
      i++;
      return w;
    };
    Array.from(h.childNodes).forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
          else frag.appendChild(wrap(document.createTextNode(part)));
        });
      } else {
        frag.appendChild(wrap(node.cloneNode(true)));
      }
    });
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    h.textContent = "";
    h.appendChild(frag);
    const go = () => requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add("is-split-in")));
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
    setTimeout(go, 1200);
  });

  /* ------------------------------------------------------------------
     3. Count-up numbers (stats, results, logs)
     ------------------------------------------------------------------ */
  const countEls = $$(".stat-num, .log-foot b, .cs-result b, .t-summary .big, [data-countup]");
  const parseCount = (el) => {
    const txt = el.textContent.trim();
    const m = txt.match(/^([^\d]*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    const [, pre, num, post] = m;
    if (/\d/.test(post) && !/^\/\d+$/.test(post)) return null;   // e.g. "4.1s → 1.8s"
    const value = parseFloat(num.replace(/,/g, ""));
    const decimals = (num.split(".")[1] || "").length;
    if (!decimals && value < 3) return null;                     // "<1 day", "0", "2"
    if (!decimals && value >= 1900 && value <= 2100) return null; // years
    return { pre, post, value, decimals, commas: num.includes(",") };
  };
  const fmt = (v, c) => {
    let s = v.toFixed(c.decimals);
    if (c.commas) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals });
    return c.pre + s + c.post;
  };
  if (!reduce) {
    const targets = countEls.map((el) => ({ el, c: parseCount(el) })).filter((x) => x.c);
    targets.forEach(({ el, c }) => { el.dataset.counting = ""; el.textContent = fmt(0, c); });
    onceInView(targets.map((t) => t.el), (el) => {
      const c = targets.find((t) => t.el === el).c;
      const dur = 1500, t0 = performance.now() + 150;
      const step = (now) => {
        const t = Math.min(1, Math.max(0, (now - t0) / dur));
        el.textContent = fmt(c.value * easeOutExpo(t), c);
        if (t < 1) requestAnimationFrame(step); else el.textContent = fmt(c.value, c);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
  }

  if (reduce) return; // ---- everything below is decorative motion ----

  /* ------------------------------------------------------------------
     4. Hero: cursor spotlight grid + gentle depth tilt
     ------------------------------------------------------------------ */
  const hero = $("[data-hero]");
  if (hero && finePointer) {
    const tilt = $("[data-tilt]", hero);
    const consoleEl = tilt && $(".console", tilt);
    const floats = tilt ? $$(".float-card", tilt) : [];
    let raf = null, last = null;
    hero.addEventListener("pointermove", (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", last.clientX - r.left + "px");
        hero.style.setProperty("--my", last.clientY - r.top + "px");
        hero.classList.add("is-pointer");
        if (consoleEl) {
          const px = (last.clientX - r.left) / r.width - 0.5;
          const py = (last.clientY - r.top) / r.height - 0.5;
          consoleEl.style.setProperty("--ry", (px * 7).toFixed(2) + "deg");
          consoleEl.style.setProperty("--rx", (-py * 5).toFixed(2) + "deg");
          floats.forEach((f, i) => {
            const depth = i === 0 ? 16 : 22;
            f.style.setProperty("--tx", (px * depth).toFixed(1) + "px");
            f.style.setProperty("--ty", (py * depth).toFixed(1) + "px");
          });
        }
      });
    });
    hero.addEventListener("pointerleave", () => {
      hero.classList.remove("is-pointer");
      if (consoleEl) { consoleEl.style.setProperty("--rx", "0deg"); consoleEl.style.setProperty("--ry", "0deg"); }
      floats.forEach((f) => { f.style.setProperty("--tx", "0px"); f.style.setProperty("--ty", "0px"); });
    });
  }

  /* ------------------------------------------------------------------
     5. Live console: inventory sync runs, AI drafts tick up
     ------------------------------------------------------------------ */
  const syncRow = $('[data-live="sync"]');
  if (syncRow) {
    const val = $(".val", syncRow);
    visibleLoop(syncRow, async () => {
      syncRow.classList.add("is-syncing");
      val.textContent = "syncing…";
      await sleep(1400);
      syncRow.classList.remove("is-syncing");
      val.innerHTML = '<span class="roll">just now</span>';
    }, 6500);
  }
  const draftsRow = $('[data-live="drafts"]');
  if (draftsRow) {
    const n = $("[data-n]", draftsRow);
    visibleLoop(draftsRow, () => {
      n.innerHTML = '<span class="roll">' + (parseInt(n.textContent, 10) + 1) + "</span>";
    }, () => 4000 + Math.random() * 3000);
  }

  /* 6. Rotating resolved-ticket card */
  $$("[data-ticker]").forEach((t) => {
    const items = $$(".ticker-item", t);
    let i = 0;
    visibleLoop(t, () => {
      const cur = items[i];
      i = (i + 1) % items.length;
      cur.classList.add("is-leaving");
      cur.classList.remove("is-active");
      setTimeout(() => cur.classList.remove("is-leaving"), 600);
      items[i].classList.add("is-active");
    }, 4200);
  });

  /* ------------------------------------------------------------------
     7. Live support feed (tickets resolve, new ones arrive)
     ------------------------------------------------------------------ */
  const pool = [
    ["Product filter returns empty on mobile", "1h 50m"], ["Gift card balance not syncing to POS", "2h 30m"],
    ["Shipping rate rule for EU zone", "4h 05m"], ["Order tags missing for wholesale", "55m"],
    ["Metafield values lost on theme update", "1h 20m"], ["Webhook retries to 3PL resolved", "1h 40m"],
  ];
  $$("[data-feed]").forEach((list) => {
    let p = 0;
    const working = $$("li", list).find((li) => /review|working/i.test(li.textContent));
    if (working) {
      working.classList.add("is-working");
      working.dataset.done = "1h 25m";
      $(".mono", working).textContent = "working…";
      list.prepend(working);
    }
    visibleLoop(list, () => {
      const w = $("li.is-working", list);
      if (w) { w.classList.remove("is-working"); $(".mono", w).innerHTML = '<span class="roll">' + (w.dataset.done || "1h 10m") + "</span>"; }
      const [text, time] = pool[p++ % pool.length];
      const li = document.createElement("li");
      li.className = "is-working is-new";
      li.dataset.done = time;
      li.innerHTML = '<span class="t"><span class="dot"></span><span></span></span><span class="mono">working…</span>';
      li.querySelector(".t span:last-child").textContent = text;
      list.prepend(li);
      const items = $$("li", list);
      if (items.length > 3) {
        const out = items[items.length - 1];
        out.classList.add("is-out");
        setTimeout(() => out.remove(), 340);
      }
    }, 3600);
  });

  /* ------------------------------------------------------------------
     8. AI answer mock: type question → write answer → cite your brand
     ------------------------------------------------------------------ */
  $$("[data-answer]").forEach((mock) => {
    const q = $("[data-type]", mock);
    const full = q.dataset.type;
    let busy = false;
    mock.classList.add("is-armed", "is-answer", "is-cited");
    const run = async () => {
      if (busy) return;
      busy = true;
      mock.classList.remove("is-answer", "is-cited");
      q.textContent = "";
      await sleep(350);
      for (let k = 1; k <= full.length; k++) { q.textContent = full.slice(0, k); await sleep(32); }
      await sleep(300);
      mock.classList.add("is-answer");
      await sleep(900);
      mock.classList.add("is-cited");
      busy = false;
    };
    visibleLoop(mock, run, 8500);
  });

  /* ------------------------------------------------------------------
     9. Sequenced chips (XocialAI pipeline: Topic → Caption → Image → Posted)
     ------------------------------------------------------------------ */
  $$("[data-sequence]").forEach((wrap) => {
    const steps = $$("[data-seq]", wrap);
    wrap.classList.add("is-armed");
    steps.forEach((s) => s.classList.add("is-done", "settled"));
    let busy = false;
    const run = async () => {
      if (busy) return;
      busy = true;
      steps.forEach((s) => s.classList.remove("is-done", "settled"));
      await sleep(400);
      for (const s of steps) {
        s.classList.add("is-done");
        setTimeout(() => s.classList.add("settled"), 380);
        await sleep(420);
      }
      busy = false;
    };
    visibleLoop(wrap, run, 6000);
  });

  /* 10. Live counters (e.g. pre-orders reserved) */
  $$("[data-tickup]").forEach((el) => {
    const host = el.closest("[data-tickup-host]") || el.parentElement;
    visibleLoop(el, () => {
      el.innerHTML = '<span class="roll">' + (parseInt(el.textContent, 10) + 1) + "</span>";
      const b = document.createElement("span");
      b.className = "tick-bubble";
      b.textContent = el.dataset.tickup || "+1";
      host.appendChild(b);
      setTimeout(() => b.remove(), 1500);
    }, () => 3500 + Math.random() * 2500);
  });

  /* ------------------------------------------------------------------
     11. Before/after slider demonstrates itself once
     ------------------------------------------------------------------ */
  onceInView($$("[data-ba]"), (ba) => {
    const range = $("[data-ba-range]", ba);
    const keys = [50, 26, 74, 50];
    const seg = 700, t0 = performance.now() + 500;
    const step = (now) => {
      if (ba.dataset.touched) return;
      const t = (now - t0) / seg;
      if (t < 0) { requestAnimationFrame(step); return; }
      const k = Math.min(keys.length - 2, Math.floor(t));
      const local = Math.min(1, t - k);
      const e = local < 0.5 ? 4 * local * local * local : 1 - Math.pow(-2 * local + 2, 3) / 2;
      const v = keys[k] + (keys[k + 1] - keys[k]) * e;
      ba.style.setProperty("--pos", v + "%");
      range.value = v;
      if (t < keys.length - 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.5 });

  /* ------------------------------------------------------------------
     12. Cursor spotlight on cards
     ------------------------------------------------------------------ */
  if (finePointer) {
    $$(".svc-card, .audience-card, .included-item, .commit, .engage, .value-card, .disc, .plan, .seo-tab").forEach((el) => el.classList.add("spot"));
    let raf = null, ev = null;
    document.addEventListener("pointermove", (e) => {
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = ev.target.closest && ev.target.closest(".spot");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ev.clientX - r.left + "px");
        el.style.setProperty("--my", ev.clientY - r.top + "px");
      });
    }, { passive: true });
  }
})();
