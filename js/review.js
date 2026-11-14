/* Review toolbar — prototype only. Adds numbered design-note pins,
   sample-content highlighting and accent-colour options. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };
  const root = $("[data-review]");
  if (!root) return;

  const panel = $("[data-review-panel]", root);
  const fab = $("[data-review-toggle]", root);
  fab.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    fab.setAttribute("aria-expanded", String(!panel.hidden));
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") panel.hidden = true; });
  document.addEventListener("click", (e) => { if (!root.contains(e.target)) panel.hidden = true; });

  /* Notes */
  const notes = $$("[data-note]").filter((el) => !root.contains(el));
  const list = $("[data-notes-list]", root);
  $("[data-notes-count]", root).textContent = notes.length;
  if (!notes.length) $("[data-notes-wrap]", root).hidden = true;
  notes.forEach((el, i) => {
    const n = i + 1;
    if (getComputedStyle(el).position === "static") el.classList.add("has-note");
    const pin = document.createElement("x-note");
    pin.className = "note-pin";
    pin.tabIndex = 0;
    pin.textContent = n;
    const pop = document.createElement("x-note-pop");
    pop.className = "note-pop";
    pop.textContent = el.dataset.note;
    pin.appendChild(pop);
    el.appendChild(pin);

    const item = document.createElement("button");
    item.type = "button";
    item.innerHTML = '<span class="n">' + n + "</span><span></span>";
    item.lastChild.textContent = el.dataset.note;
    item.addEventListener("click", () => {
      setNotes(true);
      const visible = el.getClientRects().length && getComputedStyle(el).visibility !== "hidden";
      if (visible) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        pin.classList.remove("is-flash");
        void pin.offsetWidth;
        pin.classList.add("is-flash");
        setTimeout(() => pin.classList.remove("is-flash"), 2600);
      }
    });
    list.appendChild(item);
  });

  const notesToggle = $("[data-toggle-notes]", root);
  const setNotes = (on) => {
    document.body.classList.toggle("show-notes", on);
    notesToggle.checked = on;
    store.set("xb-notes", on ? "1" : "0");
  };
  notesToggle.addEventListener("change", () => setNotes(notesToggle.checked));
  setNotes(store.get("xb-notes") === "1");

  /* Placeholder highlighting */
  const phToggle = $("[data-toggle-ph]", root);
  const setPh = (on) => {
    document.body.classList.toggle("show-ph", on);
    phToggle.checked = on;
    store.set("xb-ph", on ? "1" : "0");
  };
  phToggle.addEventListener("change", () => setPh(phToggle.checked));
  setPh(store.get("xb-ph") === "1");

  /* Accent options */
  const swatches = $$("[data-accent-set]", root);
  const setAccent = (a) => {
    document.documentElement.dataset.accent = a;
    swatches.forEach((s) => s.classList.toggle("is-active", s.dataset.accentSet === a));
    store.set("xb-accent", a);
  };
  swatches.forEach((s) => s.addEventListener("click", () => setAccent(s.dataset.accentSet)));
  setAccent(document.documentElement.dataset.accent || "blue");

  /* Page jump */
  const jump = $("[data-page-jump]", root);
  if (jump) jump.addEventListener("change", () => { window.location.href = jump.value; });

  /* URL params for sharing a specific view: ?notes=1&accent=emerald&ph=1 */
  const q = new URLSearchParams(location.search);
  if (q.has("notes")) setNotes(q.get("notes") === "1");
  if (q.has("ph")) setPh(q.get("ph") === "1");
  if (q.has("accent")) setAccent(q.get("accent"));
  if (q.get("review") === "0") root.hidden = true;
})();
