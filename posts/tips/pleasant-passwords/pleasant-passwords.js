(() => {
  // ts/util.ts
  class ListExpander {
    elContainer;
    elTemplate;
    constructor(elContainer, elTemplate) {
      this.elContainer = elContainer;
      this.elTemplate = elTemplate;
    }
    static create(containerId, templateId) {
      const elContainer = document.querySelector(`#${containerId}`);
      const elTemplate = document.querySelector(`#${containerId} > #${templateId}:only-child`);
      if (!elContainer || !elTemplate)
        return null;
      elTemplate.remove();
      return new ListExpander(elContainer, elTemplate);
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

  // content/posts/tips/pleasant-passwords/pleasant-passwords.ts
  var fetchCache = new Map;
  function fetchCached(url, transform) {
    if (!fetchCache.has(url)) {
      fetchCache.set(url, fetch(url).then((r) => r.text()).then(transform));
    }
    return fetchCache.get(url);
  }
  function fetchAdjectiveList() {
    return fetchCached("Wordlist-Adjectives-Common-Audited-Len-3-6.txt", (text) => text.trim().split(`
`));
  }
  function fetchNounList() {
    return fetchCached("Wordlist-Nouns-Common-Audited-Len-3-6.txt", (text) => text.trim().split(`
`));
  }
  function initPleasantPasswords() {
    const expander = ListExpander.create("pwd-container", "pwd-template");
    function generatePasswords() {
      Promise.all([fetchAdjectiveList(), fetchNounList()]).then(([aList, nList]) => {
        const adjectiveCount = aList.length;
        const nounCount = nList.length;
        const digitCount = 1000;
        const totalCount = adjectiveCount * nounCount * digitCount;
        document.querySelectorAll(".adjective-count").forEach((el) => {
          el.innerHTML = adjectiveCount.toString();
        });
        document.querySelectorAll(".noun-count").forEach((el) => {
          el.innerHTML = nounCount.toString();
        });
        document.querySelectorAll(".digit-count").forEach((el) => {
          el.innerHTML = digitCount.toString();
        });
        document.querySelectorAll(".total-count").forEach((el) => {
          el.innerHTML = totalCount.toLocaleString();
        });
        const pList = Array.from({ length: 20 }, () => {
          const adj = aList[Math.floor(Math.random() * aList.length)];
          const noun = nList[Math.floor(Math.random() * nList.length)];
          const digits = String(Math.floor(Math.random() * 900) + 100);
          return `${digits}-${adj}-${noun}`;
        });
        expander?.expand(pList, (el, it, idx) => {
          const elIndex = el.querySelector(".pwd-index");
          const elText = el.querySelector(".pwd-text");
          elIndex.innerHTML = (idx + 1).toString().padStart(2, "0");
          elText.innerHTML = it;
        });
      });
    }
    generatePasswords();
    document.querySelector("#pwd-button")?.addEventListener("click", generatePasswords);
  }
  document.addEventListener("DOMContentLoaded", initPleasantPasswords);
})();
