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

// ts/index.ts
initMatomo();
initSlideshow();
