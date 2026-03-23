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
    const settingsOverlay = document.querySelector(".overlay");
    settingsOverlay?.addEventListener("click", (e) => {
      if (e.target === settingsOverlay) {
        history.back();
        console.log("overlay click");
      }
    });
  });
}

// ts/changelog.ts
async function initChangelog() {
  const trimMargin = (str) => str.replace(/^[ \t]*\|/gm, "").trim();
  const formatBytes = (kb) => {
    if (kb < 1024)
      return `${kb} KB`;
    if (kb < 1024 ** 2)
      return `${(kb / 1024).toFixed(1)} MB`;
    if (kb < 1024 ** 3)
      return `${(kb / 1024 ** 2).toFixed(1)} GB`;
    return `${(kb / 1024 ** 3).toFixed(1)} TB`;
  };
  const formatDate = (unix) => new Date(unix * 1000).toLocaleString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const formatTime = (unix) => new Date(unix * 1000).toLocaleString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
  document.addEventListener("DOMContentLoaded", () => {
    const elChangelog = document.querySelectorAll("#changelog");
    if (!elChangelog)
      return;
    fetch("/data/changelog.json").then((res) => res.json()).then((data) => {
      elChangelog.forEach((el) => {
        let html = "";
        const buildStr = `
                    |# Build 
                    |    - date: <span class="z-string">${formatDate(data.timestamp)}</span>
                    |    - time: <span class="z-constant">${formatTime(data.timestamp)}</span>
                    |
                    |# Changelog
                `;
        html += trimMargin(buildStr);
        data.commits.forEach((it) => {
          const itStr = `<br>
                        |<span class="z-name">${it.header} </span>
                        |    - date: <span class="z-string">${it.date}</span>
                        |    - hash: <span class="z-constant">${it.hash}</span>
                        |    - changes: <span class=" ">${it.changes.trim()}</span>
                        |    - file count: <span class="z-constant">${it.file_count}</span>
                        |    - size: <span class="z-constant">${formatBytes(it.repo_size_kb)}</span>
                    `;
          html += trimMargin(itStr);
        });
        el.innerHTML = html;
      });
    });
  });
}

// ts/qotd.ts
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
  function getQuoteDate(quote) {
    return quote.date ? new Date(quote.date + "T00:00:00") : new Date;
  }
  function getDateString(d) {
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
  function getLocalDateString(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  document.addEventListener("DOMContentLoaded", () => {
    const elAllQotd = document.querySelectorAll("#qotd");
    const elAllQuoteContainer = document.querySelectorAll("#quote-container > #quote:only-child");
    if (!(elAllQotd.length || elAllQuoteContainer.length))
      return;
    fetch("/data/quotes.json").then((res) => res.json()).then((data) => data.quotes).then((quotes) => {
      const indices = getShuffledIndices(quotes.length);
      function getSequenceQuote(offset) {
        const days = getDaysSinceEpoch() + (offset || 0);
        const cycleIndex = days % quotes.length;
        return quotes[indices[cycleIndex]];
      }
      elAllQotd.forEach((el) => {
        const elContent = el.querySelector("#qotd-content");
        const elButtons = el.querySelector("#qotd-buttons");
        const elPrev = el.querySelector("#qotd-prev");
        const elNext = el.querySelector("#qotd-next");
        const elReset = el.querySelector("#qotd-reset");
        const elLabel = el.querySelector("#qotd-label");
        const elLabelText = elLabel?.querySelector("#qotd-label-text");
        function updateQuote(offset) {
          const day = new Date;
          day.setDate(day.getDate() + offset);
          const q = getSequenceQuote(offset);
          const todayStr2 = getLocalDateString(new Date);
          const isToday = q.date === todayStr2;
          elButtons.classList.toggle("display-none", isToday);
          elLabelText.classList.toggle("text-tertiary", isToday);
          if (isToday) {
            elLabelText.innerHTML = "Today";
          } else {
            elLabelText.innerHTML = getDateString(day);
          }
          elContent.innerHTML = `<em>"${q.text}"</em> <br> - ${q.author}`;
        }
        let dayOffset = 0;
        const todayStr = getLocalDateString(new Date);
        for (let i = 0;i < quotes.length; i++) {
          if (getSequenceQuote(i).date === todayStr) {
            dayOffset = i;
            break;
          }
        }
        updateQuote(dayOffset);
        elPrev.addEventListener("click", () => {
          updateQuote(--dayOffset);
        });
        elNext.addEventListener("click", () => {
          updateQuote(++dayOffset);
        });
        elReset.addEventListener("click", () => {
          updateQuote(dayOffset = 0);
        });
        el.classList.toggle("animate-fade-in-md", true);
      });
      elAllQuoteContainer.forEach((el) => {
        const elContainer = el.parentElement;
        for (let i = 0;i < quotes.length; ++i) {
          const q = getSequenceQuote(i);
          const elQuote = el.cloneNode(true);
          const elDate = elQuote.querySelector("#quote-date");
          const elLabel = elQuote.querySelector("#quote-label");
          const elLabelText = elLabel.querySelector("#quote-label-text");
          const elContent = elQuote.querySelector("#quote-content");
          const d = new Date;
          d.setDate(d.getDate() + i);
          elDate.innerHTML = d.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric"
          });
          if (q.date) {
            elLabel.classList.remove("display-none");
            elLabelText.innerHTML = getDateString(getQuoteDate(q));
          }
          elContent.innerHTML = `<em>"${q.text}"</em> <br> - ${q.author}`;
          elQuote.style.animationDelay = `${i * 50}ms`;
          elQuote.classList.add("animate-fade-in-md");
          elContainer.appendChild(elQuote);
        }
        el.remove();
      });
    });
  });
}

// ts/code.ts
function initCodeWrapper(el) {
  const pre = el.querySelector("pre");
  const preCode = pre.querySelector("code");
  const preLangText = preCode.getAttribute("data-lang") || "plaintext";
  const preCodeText = el.getAttribute("data-raw-code");
  const footer = el.querySelector("x-code-footer");
  const footerLang = el.querySelector("x-code-footer > x-code-footer-lang");
  const footerCopy = el.querySelector("x-code-footer > x-code-footer-copy");
  const footerChars = el.querySelector("x-code-footer > x-code-footer-chars");
  footerLang.innerText = preLangText;
  footerChars.innerText = `${preCodeText.length} chars`;
  footerCopy.innerText = "click to copy";
  footer.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preCodeText);
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
function initCode() {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("x-code-wrapper").forEach(initCodeWrapper);
  });
}

// ts/index.ts
initMatomo();
initSlideshow();
initOverlay();
initChangelog();
initQotd();
initCode();
