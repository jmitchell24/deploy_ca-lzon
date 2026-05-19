(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  function __accessProp(key) {
    return this[key];
  }
  var __toCommonJS = (from) => {
    var entry = (__moduleCache ??= new WeakMap).get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function") {
      for (var key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(entry, key))
          __defProp(entry, key, {
            get: __accessProp.bind(from, key),
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
          });
    }
    __moduleCache.set(from, entry);
    return entry;
  };
  var __moduleCache;
  var __returnValue = (v) => v;
  function __exportSetter(name, newValue) {
    this[name] = __returnValue.bind(null, newValue);
  }
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: __exportSetter.bind(all, name)
      });
  };

  // ts/_toy-p5.ts
  var exports__toy_p5 = {};
  __export(exports__toy_p5, {
    initToyP5: () => initToyP5
  });
  function initToyP5() {
    document.addEventListener("DOMContentLoaded", () => {
      const codeFrameSource = document.getElementById("code-frame-p5-source");
      const codeFrameTarget = document.getElementById("code-frame-p5-target");
      if (!codeFrameSource || !codeFrameTarget)
        return;
      codeFrameTarget.replaceWith(codeFrameSource);
      const p5Code = codeFrameSource.getAttribute("data-code-text");
      console.log("p5 code" + p5Code);
    });
  }
  initToyP5();

  // ts/matomo.ts
  function initMatomo() {
    const _paq = window._paq = window._paq || [];
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
    const u = "//matomo.delm.win/";
    _paq.push(["setTrackerUrl", u + "matomo.php"]);
    _paq.push(["setSiteId", "4"]);
    const d = document;
    const g = d.createElement("script");
    const s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = u + "matomo.js";
    s.parentNode.insertBefore(g, s);
  }

  // ts/slideshow.ts
  class Slideshow {
    el;
    inner;
    items;
    indicators;
    prevBtn;
    nextBtn;
    current;
    scrolling;
    _scrollEnd = null;
    constructor(el) {
      this.el = el;
      this.inner = el.querySelector(".slideshow-slides");
      this.items = [...el.querySelectorAll(".slideshow-slide")];
      this.indicators = [...el.querySelectorAll(".slideshow-page")];
      this.prevBtn = el.querySelector(".slideshow-prev");
      this.nextBtn = el.querySelector(".slideshow-next");
      this.current = 0;
      this.scrolling = false;
      this.prevBtn?.addEventListener("click", () => this.prev());
      this.nextBtn?.addEventListener("click", () => this.next());
      this.indicators.forEach((ind, i) => ind.addEventListener("click", () => this.goTo(i)));
      this.inner.addEventListener("scroll", () => {
        if (this.scrolling)
          return;
        const origin = this.inner.offsetLeft;
        const center = this.inner.scrollLeft + this.inner.offsetWidth / 2;
        this.current = this.items.reduce((nearest, item, i) => {
          const itemCenter = item.offsetLeft - origin + item.offsetWidth / 2;
          const prevCenter = this.items[nearest].offsetLeft - origin + this.items[nearest].offsetWidth / 2;
          return Math.abs(itemCenter - center) < Math.abs(prevCenter - center) ? i : nearest;
        }, 0);
        this.update();
      });
      this.update();
      this.constrainHeight();
    }
    constrainHeight() {
      const imgs = this.items.flatMap((item) => [...item.querySelectorAll("img")]);
      if (imgs.length === 0)
        return;
      const measure = () => {
        const minH = imgs.reduce((min, img) => Math.min(min, img.offsetHeight), Infinity);
        if (minH > 0 && isFinite(minH)) {
          imgs.forEach((img) => {
            img.style.maxHeight = `${minH}px`;
          });
        }
      };
      const pending = imgs.filter((img) => !img.complete);
      if (pending.length === 0) {
        measure();
      } else {
        let loaded = 0;
        const onLoad = () => {
          if (++loaded === pending.length)
            measure();
        };
        pending.forEach((img) => {
          img.addEventListener("load", onLoad, { once: true });
        });
      }
    }
    goTo(index) {
      this.current = index;
      this.scrolling = true;
      this.inner.scrollTo({ left: this.items[index].offsetLeft - this.inner.offsetLeft, behavior: "smooth" });
      this.update();
      if (this._scrollEnd !== null)
        clearTimeout(this._scrollEnd);
      this._scrollEnd = setTimeout(() => {
        this.scrolling = false;
      }, 400);
    }
    prev() {
      if (this.current > 0)
        this.goTo(this.current - 1);
    }
    next() {
      if (this.current < this.items.length - 1)
        this.goTo(this.current + 1);
    }
    update() {
      this.indicators.forEach((ind, i) => ind.classList.toggle("active", i === this.current));
      this.prevBtn?.toggleAttribute("disabled", this.current === 0);
      this.nextBtn?.toggleAttribute("disabled", this.current === this.items.length - 1);
    }
  }
  function initSlideshow() {
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll(".slideshow").forEach((el) => new Slideshow(el));
    });
  }

  // ts/overlay.ts
  function initOverlay() {
    document.addEventListener("DOMContentLoaded", () => {
      const elSettings = document.querySelector("#settings");
      elSettings?.addEventListener("click", (e) => {
        if (e.target === elSettings) {
          history.back();
          console.log("overlay click");
        }
      });
      const elSettingsClose = document.querySelector("#settings-close");
      elSettingsClose?.addEventListener("click", (e) => {
        history.back();
      });
    });
  }

  // ts/qotd.ts
  function parseQuote(quote) {
    if (!quote?.text)
      throw new Error("Quote missing required field: text");
    if (!quote.date)
      throw new Error("Quote missing required field: date");
    const date = new Date(quote.date + "T00:00:00");
    if (isNaN(date.getTime()))
      throw new Error(`Invalid quote date: ${quote.date}`);
    return {
      id: quote.id,
      date,
      author: quote.author,
      work: quote.work,
      text: quote.text,
      path: quote.path
    };
  }
  function getQuoteTextAsHtml(q) {
    const text = q.text.trim();
    const author = q.author ?? "Anonymous";
    const attribution = q.work ? `${author}, <em>${q.work}</em>` : author;
    return `<em>"${text}"</em> <br>- ${attribution}`;
  }
  function collectTextNodes(el) {
    const nodes = [];
    (function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? "";
        nodes.push([node, text]);
      } else
        node.childNodes.forEach(walk);
    })(el);
    return nodes;
  }
  function typeOut(el, durationMs, alive) {
    return new Promise((resolve) => {
      const nodes = collectTextNodes(el).filter(([, t]) => t.length > 0).reverse();
      const total = nodes.reduce((n, [, t]) => n + t.length, 0);
      if (total === 0) {
        resolve();
        return;
      }
      const ms = durationMs / total;
      let ni = 0, ci = nodes[0][1].length;
      function tick() {
        if (!alive()) {
          resolve();
          return;
        }
        nodes[ni][0].textContent = nodes[ni][1].slice(0, --ci);
        if (ci <= 0) {
          ni++;
          if (ni >= nodes.length) {
            resolve();
            return;
          }
          ci = nodes[ni][1].length;
        }
        setTimeout(tick, ms);
      }
      tick();
    });
  }
  function typeIn(el, html, durationMs, alive) {
    return new Promise((resolve) => {
      el.innerHTML = html;
      const nodes = collectTextNodes(el);
      nodes.forEach(([node]) => node.textContent = "");
      const total = nodes.reduce((n, [, t]) => n + t.length, 0);
      if (total === 0) {
        resolve();
        return;
      }
      const ms = durationMs / total;
      let ni = 0, ci = 0;
      function tick() {
        if (!alive()) {
          resolve();
          return;
        }
        nodes[ni][0].textContent = nodes[ni][1].slice(0, ++ci);
        if (ci >= nodes[ni][1].length) {
          ni++;
          if (ni >= nodes.length) {
            resolve();
            return;
          }
          ci = 0;
        }
        setTimeout(tick, ms);
      }
      tick();
    });
  }
  async function initQotd() {
    function getShuffledIndices(length) {
      function rand() {
        let t = 1831565813;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      }
      const indices = Array.from({ length }, (_, i) => i);
      for (let i = length - 1;i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return indices;
    }
    function getDaysSinceEpoch() {
      const epochDate = new Date(1991, 7, 22);
      const now = new Date;
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return Math.floor((today.valueOf() - epochDate.valueOf()) / (1000 * 60 * 60 * 24));
    }
    function getDateString(d) {
      return d.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    function getDateStringHtml(d) {
      const s = d.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      return `From <span class="text-secondary">${s}</span>`;
    }
    function getScheduleStringHtml(d) {
      const s = d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      return `For ${s}`;
    }
    function isDateSame(a, b) {
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    document.addEventListener("DOMContentLoaded", () => {
      const elQotd = document.querySelector("#qotd");
      const elQuoteSchedules = document.querySelectorAll(".quote-schedule");
      const elQuoteRandoms = document.querySelectorAll("a.quote-random");
      if (!(elQotd || elQuoteSchedules.length > 0 || elQuoteRandoms.length > 0))
        return;
      fetch("/quotes/pages.json").then((res) => res.json()).then((data) => data.pages).then((quotes) => quotes.map(parseQuote)).then((quotes) => {
        const indices = getShuffledIndices(quotes.length);
        function getSequenceQuote(offset) {
          const days = getDaysSinceEpoch() + (offset || 0);
          const cycleIndex = days % quotes.length;
          return quotes[indices[cycleIndex]];
        }
        if (elQotd) {
          let updateQuote = function(quote, isNewToday2, animate = false) {
            elLabelText.classList.toggle("text-tertiary", isNewToday2);
            if (isNewToday2) {
              elLabelText.innerHTML = "Today";
            } else {
              const scheduleDate = new Date(todayDate);
              scheduleDate.setDate(scheduleDate.getDate() + todayQuoteIdx);
              elLabelText.innerHTML = getDateString(scheduleDate);
            }
            if (animate) {
              const gen = ++animGen;
              const alive = () => gen === animGen;
              typeOut(elContent, 1000, alive).then(() => {
                if (alive())
                  typeIn(elContent, getQuoteTextAsHtml(quote), 1000, alive);
              });
            } else {
              elContent.innerHTML = getQuoteTextAsHtml(quote);
            }
          };
          const elContent = elQotd.querySelector("#qotd-content");
          const elRandomize = elQotd.querySelector("#qotd-randomize");
          const elLabel = elQotd.querySelector("#qotd-label");
          const elLabelText = elLabel?.querySelector("#qotd-label-text");
          let todayQuoteIdx = 0;
          let isNewToday = false;
          const todayDate = new Date;
          let animGen = 0;
          for (let i = 0;i < quotes.length; i++) {
            if (isDateSame(getSequenceQuote(i).date, todayDate)) {
              todayQuoteIdx = i;
              isNewToday = true;
              break;
            }
          }
          updateQuote(getSequenceQuote(todayQuoteIdx), isNewToday);
          todayQuoteIdx = 0;
          elRandomize.addEventListener("click", () => {
            updateQuote(getSequenceQuote(++todayQuoteIdx), false, true);
          });
        }
        if (elQuoteSchedules.length > 0) {
          const today = new Date;
          const idToDate = new Map;
          for (let offset = 0;offset < quotes.length; offset++) {
            const d = new Date(today);
            d.setDate(d.getDate() + offset);
            idToDate.set(getSequenceQuote(offset).id, d);
          }
          elQuoteSchedules.forEach((el) => {
            const id = parseInt(el.dataset.quoteId ?? "", 10);
            const schedDate = idToDate.get(id);
            if (schedDate)
              el.innerHTML = getScheduleStringHtml(schedDate);
          });
        }
        if (elQuoteRandoms.length > 0) {
          elQuoteRandoms.forEach((el) => {
            const pick = quotes[Math.floor(Math.random() * quotes.length)];
            el.href = pick.path;
          });
        }
      });
    });
  }

  // ts/code-frame.ts
  function createNode(parent, className, node = "div") {
    const el = document.createElement(node);
    el.classList.add(className);
    parent.appendChild(el);
    return el;
  }
  function initCodeFrame(el) {
    const codeLang = el.getAttribute("data-code-lang") || "plaintext";
    const codeText = el.getAttribute("data-code-text");
    const footer = createNode(el, "code-frame-footer", "button");
    const footerLang = createNode(footer, "code-frame-footer-lang");
    const footerChars = createNode(footer, "code-frame-footer-chars");
    const footerCopy = createNode(footer, "code-frame-footer-copy");
    footerLang.innerText = codeLang;
    footerChars.innerText = `${codeText.length} chars`;
    footerCopy.innerText = "click to copy";
    footer.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(codeText);
        const originalText = footerCopy.innerHTML;
        footerCopy.innerHTML = "copied...";
        setTimeout(() => {
          footerCopy.innerHTML = originalText;
        }, 1500);
      } catch (err) {
        console.log("error while copying: " + err);
      }
    });
  }
  function initCodeFrames() {
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll(".code-frame").forEach(initCodeFrame);
    });
  }

  // ts/collapse.ts
  function initCollapse() {
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll(".top-section").forEach((section) => {
        const head = section.querySelector(".top-section-head");
        const body = section.querySelector(".top-section-body");
        if (!head || !body)
          return;
        const isClosed = section.classList.contains("top-section-closed");
        if (isClosed) {
          body.classList.add("collapse");
          head.classList.add("collapsed");
        } else {
          body.classList.add("collapse", "show");
          head.classList.remove("collapsed");
        }
        head.addEventListener("click", () => {
          if (body.classList.contains("show")) {
            collapseElement(body);
            head.classList.add("collapsed");
            console.log("collapse top-section");
          } else if (!body.classList.contains("collapsing")) {
            expandElement(body);
            head.classList.remove("collapsed");
            console.log("expand top-section");
          }
        });
      });
    });
    document.addEventListener("DOMContentLoaded", () => {
      function initLazyExpandX(el) {
        el.style.width = "0px";
        el.style.opacity = "0";
        const delay = Number(el.getAttribute("data-delay-ms")) || 500;
        const observer = new MutationObserver(() => {
          observer.disconnect();
          setTimeout(() => {
            el.offsetWidth;
            const target = el.scrollWidth;
            el.classList.add("collapsing", "collapse-horizontal");
            el.style.width = `${target}px`;
            el.style.opacity = "1";
            el.addEventListener("transitionend", function handler(e) {
              if (e.propertyName !== "width")
                return;
              el.removeEventListener("transitionend", handler);
              el.classList.remove("collapsing", "collapse-horizontal");
              el.style.width = "";
            });
          }, delay);
        });
        observer.observe(el, { childList: true, subtree: true });
      }
      function initLazyExpandY(el) {
        el.style.height = "0px";
        el.style.opacity = "0";
        const delay = Number(el.getAttribute("data-delay-ms")) || 500;
        const observer = new MutationObserver(() => {
          observer.disconnect();
          setTimeout(() => {
            el.offsetHeight;
            const target = el.scrollHeight;
            el.classList.add("collapsing");
            el.style.height = `${target}px`;
            el.style.opacity = "1";
            el.addEventListener("transitionend", function handler(e) {
              if (e.propertyName !== "height")
                return;
              el.removeEventListener("transitionend", handler);
              el.classList.remove("collapsing");
              el.style.height = "";
            });
          }, delay);
        });
        observer.observe(el, { childList: true, subtree: true });
      }
      document.querySelectorAll(".lazy-expand").forEach(initLazyExpandY);
      document.querySelectorAll(".lazy-expand-y").forEach(initLazyExpandY);
      document.querySelectorAll(".lazy-expand-x").forEach(initLazyExpandX);
    });
  }
  function expandElement(el) {
    el.classList.remove("collapse");
    el.classList.add("collapsing");
    el.style.height = "0px";
    el.offsetHeight;
    const targetHeight = el.scrollHeight;
    if (targetHeight === 0) {
      el.classList.remove("collapsing");
      el.classList.add("collapse", "show");
      el.style.height = "0px";
      return;
    }
    el.style.height = `${targetHeight}px`;
    el.addEventListener("transitionend", function handler(e) {
      if (e.propertyName !== "height")
        return;
      el.removeEventListener("transitionend", handler);
      el.classList.remove("collapsing");
      el.classList.add("collapse", "show");
      el.style.height = "";
    });
  }
  function collapseElement(el) {
    const currentHeight = el.scrollHeight;
    if (currentHeight === 0) {
      el.classList.remove("collapsing", "show");
      el.classList.add("collapse");
      el.style.height = "";
      return;
    }
    el.style.height = `${currentHeight}px`;
    el.offsetHeight;
    el.classList.remove("collapse", "show");
    el.classList.add("collapsing");
    el.style.height = "0px";
    el.addEventListener("transitionend", function handler(e) {
      if (e.propertyName !== "height")
        return;
      el.removeEventListener("transitionend", handler);
      el.classList.remove("collapsing");
      el.classList.add("collapse");
      el.style.height = "";
    });
  }

  // ts/theme.ts
  var HUE_VALUE_TOTAL = 36;
  var HUE_VALUE_DEFAULT = 13;
  var HUE_VALUE_KEY = "theme-hue-index";
  function getStoredHueValue() {
    const item = localStorage.getItem(HUE_VALUE_KEY);
    if (item == null) {
      console.log(`hue value not found in local storage. setting default: ${HUE_VALUE_DEFAULT}`);
      localStorage.setItem(HUE_VALUE_KEY, HUE_VALUE_DEFAULT.toString());
      return HUE_VALUE_DEFAULT;
    }
    const value = parseInt(item);
    if (isNaN(value)) {
      console.log(`failed to parse hue value: ${item}`);
      return HUE_VALUE_DEFAULT;
    }
    console.log(`hue value found in local storage: ${value}`);
    return value;
  }
  function setStoredHueValue(value) {
    localStorage.setItem(HUE_VALUE_KEY, (value ?? HUE_VALUE_DEFAULT).toString());
    console.log(`local storage hue value updated: ${value}`);
  }
  function initTheme() {
    let pageHueIndex = getStoredHueValue();
    pageHueIndex = Math.max(0, Math.min(HUE_VALUE_TOTAL - 1, pageHueIndex));
    localStorage.setItem(HUE_VALUE_KEY, pageHueIndex.toString());
    document.documentElement.style.setProperty("--color-primary-hue", (pageHueIndex * 360 / (HUE_VALUE_TOTAL - 1)).toString());
    document.addEventListener("DOMContentLoaded", () => {
      let pageDarkMode = localStorage.getItem("theme-dark-mode");
      pageDarkMode = pageDarkMode == "off" ? "off" : "on";
      localStorage.setItem("theme-dark-mode", pageDarkMode);
      document.body.setAttribute("data-dark-mode", pageDarkMode);
      let pageHueIndex2 = getStoredHueValue();
      console.log(`initial page hue: ${pageHueIndex2}`);
      const themeItemsColor = document.querySelectorAll(".btn-hue");
      const themeItemDark = document.querySelector("#btn-enable-dark-theme");
      const themeItemLight = document.querySelector("#btn-enable-light-theme");
      function updatePageHueIndex(idx) {
        pageHueIndex2 = idx;
        setStoredHueValue(idx);
        document.documentElement.style.setProperty("--color-primary-hue", themeItemsColor[pageHueIndex2].getAttribute("data-hue"));
      }
      function updatePageDarkMode(mode) {
        pageDarkMode = mode ? "on" : "off";
        localStorage.setItem("theme-dark-mode", pageDarkMode);
        document.body.classList.add("animate-everything");
        document.body.setAttribute("data-dark-mode", pageDarkMode);
        setTimeout(() => {
          document.body.classList.remove("animate-everything");
        }, 500);
      }
      function updateThemeItems() {
        themeItemsColor.forEach((it, idx) => {
          it.classList.toggle("active", idx === pageHueIndex2);
        });
      }
      function updateDarkModeItems() {
        const isDark = pageDarkMode == "on";
        themeItemDark.classList.toggle("active", isDark);
        themeItemLight.classList.toggle("active", !isDark);
      }
      themeItemsColor.forEach((it, idx) => {
        it.addEventListener("click", (e) => {
          updatePageHueIndex(idx);
          updateThemeItems();
        });
      });
      themeItemLight.addEventListener("click", (e) => {
        updatePageDarkMode(false);
        updateDarkModeItems();
      });
      themeItemDark.addEventListener("click", (e) => {
        updatePageDarkMode(true);
        updateDarkModeItems();
      });
      updateThemeItems();
      updateDarkModeItems();
    });
  }

  // ts/secrets.ts
  function cipher(asciiVal) {
    if (asciiVal >= 65 && asciiVal <= 90)
      return String.fromCharCode(155 - asciiVal);
    if (asciiVal >= 97 && asciiVal <= 122)
      return String.fromCharCode(219 - asciiVal);
    return String.fromCharCode(asciiVal);
  }
  function applyCipher(el, cipher2) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode()) !== null) {
      node.nodeValue = node.nodeValue.split("").map((ch) => {
        const code = ch.charCodeAt(0);
        return code > 32 ? cipher2(code) : ch;
      }).join("");
    }
  }
  function initSecrets() {
    REVEAL_SECRETS = false;
    document.addEventListener("DOMContentLoaded", () => {
      const elSecrets = document.querySelectorAll(".secret");
      const elSecretTexts = document.querySelectorAll(".secret-text");
      const elSecretsDiv = document.getElementById("div-secrets");
      const elBtnSecretsOn = document.getElementById("btn-secrets-on");
      const elBtnSecretsOff = document.getElementById("btn-secrets-off");
      if (!elBtnSecretsOn || !elBtnSecretsOff)
        return;
      if (elSecrets.length > 0)
        elSecretsDiv?.classList.toggle("display-none", false);
      if (elSecretTexts.length == 0)
        return;
      console.log(`${elSecretTexts.length} cipher texts`);
      function applyAllCiphers() {
        for (const el of elSecretTexts) {
          applyCipher(el, cipher);
        }
      }
      elBtnSecretsOn.addEventListener("click", () => {
        if (!REVEAL_SECRETS) {
          REVEAL_SECRETS = true;
          applyAllCiphers();
          elBtnSecretsOn.classList.toggle("active", true);
          elBtnSecretsOff.classList.toggle("active", false);
        }
      });
      elBtnSecretsOff.addEventListener("click", () => {
        if (REVEAL_SECRETS) {
          REVEAL_SECRETS = false;
          applyAllCiphers();
          elBtnSecretsOn.classList.toggle("active", false);
          elBtnSecretsOff.classList.toggle("active", true);
        }
      });
    });
  }

  // ts/tree.ts
  function initTree() {
    document.addEventListener("click", (e) => {
      const head = e.target?.closest(".tree-node-head");
      if (!head)
        return;
      head.closest("li")?.classList.toggle("open");
    });
  }

  // ts/util.ts
  class ListExpander {
    elContainer;
    elTemplate;
    constructor(elContainer, elTemplate) {
      this.elContainer = elContainer;
      this.elTemplate = elTemplate;
    }
    static createList(containerClass, templateClass) {
      const containers = document.querySelectorAll(`.${containerClass}`);
      return Array.from(containers).flatMap((elContainer) => {
        const elTemplate = elContainer.querySelector(`:scope > .${templateClass}:only-child`);
        if (!elTemplate)
          return [];
        elTemplate.remove();
        return [new ListExpander(elContainer, elTemplate)];
      });
    }
    static create(containerId, templateId) {
      const elContainer = document.querySelector(`#${containerId}`);
      const elTemplate = document.querySelector(`#${containerId} > #${templateId}:only-child`);
      if (!elContainer || !elTemplate)
        return null;
      elTemplate.remove();
      return new ListExpander(elContainer, elTemplate);
    }
    getUrl() {
      return this.elContainer.getAttribute("data-url") ?? "";
    }
    getName() {
      return this.elContainer.getAttribute("data-name") ?? "";
    }
    expand(items, populate, { clear = true } = {}) {
      if (clear)
        this.elContainer.replaceChildren();
      const limit = parseInt(this.elContainer.getAttribute("data-limit") ?? "", 10) || -1;
      const sliced = limit === -1 ? items : items.slice(0, limit);
      sliced.forEach((item, idx) => {
        const el = this.elTemplate.cloneNode(true);
        el.classList.add("animate-fade-in-md");
        el.style.animationDelay = `${idx * 50}ms`;
        populate(el, item, idx);
        this.elContainer.appendChild(el);
      });
    }
  }

  // ts/links.ts
  function initLinks() {
    function getDateString(dateStr) {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    document.addEventListener("DOMContentLoaded", () => {
      const expanders = ListExpander.createList("links-container", "links-template");
      expanders.forEach((expander) => {
        fetch(expander?.getUrl()).then((res) => res.json()).then((data) => data.items).then((items) => {
          const numCurios = items.length;
          const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
          expander?.expand(sorted, (el, it, idx) => {
            const elUrl = el.querySelector(".url");
            const elArc = el.querySelector(".arc");
            const elDate = el.querySelector(".date");
            const elDesc = el.querySelector(".desc");
            const elSeq = el.querySelector(".seq");
            if (!elUrl || !elArc || !elDate || !elDesc) {
              console.error("links-template selector failed");
              return;
            }
            elUrl.href = it.url;
            elUrl.textContent = it.title;
            elDate.textContent = getDateString(it.date);
            if (elSeq) {
              const pad = numCurios.toString().length;
              elSeq.textContent = String(numCurios - idx).padStart(pad, "0") + ".";
            }
            if (it.arc) {
              elArc.href = `https://web.archive.org/web/${it.arc}/${it.url}`;
              elArc.textContent = "snapshot";
            } else {
              elArc.href = `https://web.archive.org/web/*/${it.url}`;
              elArc.textContent = "search archive.org";
            }
            if (it.desc) {
              elDesc.textContent = it.desc;
            } else {
              elDesc.remove();
            }
          });
        });
      });
    });
  }

  // ts/toast.ts
  function initToasts() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log(document.cookie);
    });
  }

  // ts/_lzon.ts
  initMatomo();
  initSlideshow();
  initOverlay();
  initQotd();
  initLinks();
  initCodeFrames();
  initTheme();
  initSecrets();
  initTree();
  initCollapse();
  initToyP5();
  initToasts();
})();
