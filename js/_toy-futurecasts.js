(() => {
  // ts/_toy-futurecasts.ts
  var TRANSITION_MS = 200;
  function swapBags(active, inactive, zoomIn) {
    const parent = active.parentElement;
    const activeHeight = active.offsetHeight;
    inactive.classList.remove("display-none");
    inactive.style.position = "absolute";
    inactive.style.top = "0";
    inactive.style.left = "0";
    inactive.style.width = "100%";
    inactive.style.opacity = "0";
    inactive.style.pointerEvents = "none";
    const inactiveHeight = inactive.offsetHeight;
    parent.style.position = "relative";
    parent.style.height = `${activeHeight}px`;
    parent.style.overflow = "hidden";
    active.style.position = "absolute";
    active.style.top = "0";
    active.style.left = "0";
    active.style.width = "100%";
    const incomingScale = zoomIn ? "1.5" : "0.5";
    const outgoingScale = zoomIn ? "0.5" : "1.5";
    inactive.style.transition = "none";
    inactive.style.transform = `scale(${incomingScale})`;
    inactive.getBoundingClientRect();
    parent.style.transition = `height ${TRANSITION_MS}ms ease`;
    parent.style.height = `${inactiveHeight}px`;
    active.style.transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;
    active.style.opacity = "0";
    active.style.transform = `scale(${outgoingScale})`;
    active.style.pointerEvents = "none";
    inactive.style.transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;
    inactive.style.opacity = "1";
    inactive.style.transform = "";
    setTimeout(() => {
      active.classList.add("display-none");
      for (const el of [active, inactive]) {
        el.style.position = "";
        el.style.top = "";
        el.style.left = "";
        el.style.width = "";
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transition = "";
      }
      parent.style.position = "";
      parent.style.height = "";
      parent.style.overflow = "";
      parent.style.transition = "";
      inactive.style.pointerEvents = "";
    }, TRANSITION_MS);
  }
  function ordinal(n) {
    const v = n % 100;
    if (v >= 11 && v <= 13)
      return `${n}th`;
    switch (n % 10) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  }
  function labelMillennium(m) {
    if (m <= -10)
      return "10,000+ BCE";
    if (m >= 10)
      return "10,000+ CE";
    if (m < 0)
      return `${ordinal(-m)} Millennium BCE`;
    return `${ordinal(m + 1)} Millennium CE`;
  }
  function labelCentury(base) {
    if (base < 0)
      return `${ordinal(-base / 100)} Century BCE`;
    return `${ordinal(Math.floor(base / 100) + 1)} Century CE`;
  }
  function labelDecade(base) {
    return base < 0 ? `${-base}s BCE` : `${base}s`;
  }
  function labelYear(year) {
    return year < 0 ? `${-year} BCE` : `${year}`;
  }
  function labelTargetYear(f) {
    return f.target_span ? `${f.target_year}–${f.target_year + f.target_span}` : `${f.target_year}`;
  }
  function initFuturecasts() {
    document.addEventListener("DOMContentLoaded", () => {
      fetch("/data/futurecasts.json").then((res) => res.json()).then((data) => setup(data.futurecasts));
    });
  }
  function setup(futurecasts) {
    futurecasts.sort((a, b) => a.created_year - b.created_year || a.author.localeCompare(b.author));
    const bagMillenia = document.getElementById("bag-millenia");
    const bagCentury = document.getElementById("bag-century");
    const bagDecade = document.getElementById("bag-decade");
    const bagYear = document.getElementById("bag-year");
    const swapBtn = document.getElementById("swap");
    const scopeLabelEl = document.getElementById("scope-label");
    const castList = document.getElementById("futurecast-list");
    const castTemplate = document.getElementById("futurecast-template");
    function countInRange(start, count) {
      return futurecasts.filter((f) => f.created_year >= start && f.created_year < start + count).length;
    }
    const years = futurecasts.map((f) => f.created_year);
    const minCentury = Math.floor(Math.min(...years) / 100) * 100;
    const maxCentury = Math.floor(Math.max(...years) / 100) * 100;
    const midCentury = Math.floor((minCentury + maxCentury) / 200) * 100;
    const defaultCenturyWindowStart = midCentury - 4 * 100;
    let scope = "millennium";
    let selectedMillennium = null;
    let centuryWindowStart = defaultCenturyWindowStart;
    let centuryBase = null;
    let decadeBase = null;
    let transitioning = false;
    function getBag(s) {
      if (s === "millennium")
        return bagMillenia;
      if (s === "century")
        return bagCentury;
      if (s === "decade")
        return bagDecade;
      return bagYear;
    }
    function prepareMillenniaBag() {
      bagMillenia.querySelectorAll("[data-millenia]").forEach((btn) => {
        const m = parseInt(btn.dataset.millenia.trim());
        const n = countInRange(m * 1000, 1000);
        btn.classList.toggle("disabled", n === 0);
        btn.classList.toggle("display-none", n === 0);
        btn.textContent = `(${n}) ${labelMillennium(m)}`;
        btn.dataset.abs = String(m);
        btn.classList.remove("active");
      });
    }
    function prepareCenturyBag() {
      bagCentury.querySelectorAll("[data-century]").forEach((btn, i) => {
        const c = centuryWindowStart + i * 100;
        const n = countInRange(c, 100);
        btn.classList.toggle("disabled", n === 0);
        btn.classList.toggle("display-none", n === 0);
        btn.textContent = `(${n}) ${labelCentury(c)}`;
        btn.dataset.abs = String(c);
        btn.classList.remove("active");
      });
    }
    function prepareDecadeBag(base) {
      bagDecade.querySelectorAll("[data-decade]").forEach((btn, i) => {
        const d = base + i * 10;
        const n = countInRange(d, 10);
        btn.classList.toggle("disabled", n === 0);
        btn.classList.toggle("display-none", n === 0);
        btn.textContent = `(${n}) ${labelDecade(d)}`;
        btn.dataset.abs = String(d);
        btn.classList.remove("active");
      });
    }
    function prepareYearBag(base) {
      bagYear.querySelectorAll("[data-year]").forEach((btn, i) => {
        const y = base + i;
        const n = futurecasts.filter((f) => f.created_year === y).length;
        btn.classList.toggle("disabled", n === 0);
        btn.classList.toggle("display-none", n === 0);
        btn.textContent = `(${n}) ${labelYear(y)}`;
        btn.dataset.abs = String(y);
        btn.classList.remove("active");
      });
    }
    function updateScopeLabel() {
      if (scope === "millennium") {
        scopeLabelEl.textContent = "All Futurecasts";
      } else if (scope === "century") {
        scopeLabelEl.textContent = selectedMillennium !== null ? labelMillennium(selectedMillennium) : "All Futurecasts";
      } else if (scope === "decade" && centuryBase !== null) {
        scopeLabelEl.textContent = labelCentury(centuryBase);
      } else if (scope === "year" && decadeBase !== null) {
        scopeLabelEl.textContent = labelDecade(decadeBase);
      }
    }
    function renderCasts(casts) {
      castList.innerHTML = "";
      casts.forEach((f, i) => {
        const el = castTemplate.cloneNode(true);
        el.removeAttribute("id");
        el.classList.remove("display-none");
        el.querySelector("#futurecast-year").textContent = String(f.created_year);
        el.querySelector("#futurecast-author-text").textContent = f.author;
        el.querySelector("#futurecast-target-text").textContent = labelTargetYear(f);
        el.querySelector("#futurecast-content").textContent = f.condition.trim();
        el.style.animationDelay = `${i * 60}ms`;
        el.classList.add("animate-fade-in-md");
        castList.appendChild(el);
      });
    }
    function zoomTo(toScope) {
      transitioning = true;
      swapBags(getBag(scope), getBag(toScope), true);
      scope = toScope;
      updateScopeLabel();
      swapBtn.classList.remove("disabled");
      setTimeout(() => {
        transitioning = false;
      }, TRANSITION_MS);
    }
    function zoomBack() {
      if (scope === "millennium")
        return;
      const prev = scope === "year" ? "decade" : scope === "decade" ? "century" : "millennium";
      transitioning = true;
      swapBags(getBag(scope), getBag(prev), false);
      scope = prev;
      if (prev === "decade") {
        decadeBase = null;
        renderCasts(centuryBase !== null ? futurecasts.filter((f) => f.created_year >= centuryBase && f.created_year < centuryBase + 100) : []);
      } else if (prev === "century") {
        centuryBase = null;
        decadeBase = null;
        renderCasts(selectedMillennium !== null ? futurecasts.filter((f) => f.created_year >= selectedMillennium * 1000 && f.created_year < selectedMillennium * 1000 + 1000) : []);
      } else {
        selectedMillennium = null;
        centuryBase = null;
        decadeBase = null;
        centuryWindowStart = defaultCenturyWindowStart;
        renderCasts(futurecasts);
        swapBtn.classList.add("disabled");
      }
      updateScopeLabel();
      setTimeout(() => {
        transitioning = false;
      }, TRANSITION_MS);
    }
    prepareMillenniaBag();
    prepareCenturyBag();
    updateScopeLabel();
    swapBtn.classList.add("disabled");
    renderCasts(futurecasts);
    bagMillenia.addEventListener("click", (e) => {
      if (transitioning)
        return;
      const btn = e.target.closest("[data-millenia]");
      if (!btn || btn.classList.contains("display-none"))
        return;
      selectedMillennium = parseInt(btn.dataset.abs);
      centuryWindowStart = selectedMillennium * 1000;
      prepareCenturyBag();
      zoomTo("century");
      renderCasts(futurecasts.filter((f) => f.created_year >= selectedMillennium * 1000 && f.created_year < selectedMillennium * 1000 + 1000));
    });
    bagCentury.addEventListener("click", (e) => {
      if (transitioning)
        return;
      const btn = e.target.closest("[data-century]");
      if (!btn || btn.classList.contains("display-none"))
        return;
      centuryBase = parseInt(btn.dataset.abs);
      prepareDecadeBag(centuryBase);
      zoomTo("decade");
      renderCasts(futurecasts.filter((f) => f.created_year >= centuryBase && f.created_year < centuryBase + 100));
    });
    bagDecade.addEventListener("click", (e) => {
      if (transitioning)
        return;
      const btn = e.target.closest("[data-decade]");
      if (!btn || btn.classList.contains("display-none"))
        return;
      decadeBase = parseInt(btn.dataset.abs);
      prepareYearBag(decadeBase);
      zoomTo("year");
      renderCasts(futurecasts.filter((f) => f.created_year >= decadeBase && f.created_year < decadeBase + 10));
    });
    bagYear.addEventListener("click", (e) => {
      if (transitioning)
        return;
      const btn = e.target.closest("[data-year]");
      if (!btn || btn.classList.contains("display-none"))
        return;
      bagYear.querySelectorAll("[data-year]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderCasts(futurecasts.filter((f) => f.created_year === parseInt(btn.dataset.abs)));
    });
    swapBtn.addEventListener("click", zoomBack);
  }
  initFuturecasts();
})();
