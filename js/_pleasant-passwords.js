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

  // ts/_pleasant-passwords.ts
  var fetchCache = new Map;
  function fetchCached(url, transform) {
    if (!fetchCache.has(url)) {
      fetchCache.set(url, fetch(url).then((r) => r.text()).then(transform));
    }
    return fetchCache.get(url);
  }
  function fetchAdjectiveList() {
    return fetchCached("/data/adjectives.txt", (text) => text.trim().split(`
`));
  }
  function fetchNounList() {
    return fetchCached("/data/nouns.txt", (text) => text.trim().split(`
`));
  }
  function passwordEntropy(password) {
    const charSets = [
      { chars: 26, test: /[a-z]/ },
      { chars: 26, test: /[A-Z]/ },
      { chars: 10, test: /[0-9]/ },
      { chars: 10, test: /[^a-zA-Z0-9]/ }
    ];
    const poolSize = charSets.filter(({ test }) => test.test(password)).reduce((sum, { chars }) => sum + chars, 0);
    return Math.round(password.length * Math.log2(poolSize));
  }
  function initPleasantPasswords() {
    const elAdjectiveCount = document.querySelectorAll(".acount");
    const elNounCount = document.querySelectorAll(".ncount");
    console.log(elAdjectiveCount.length.toString());
    elAdjectiveCount.forEach((el) => {
      fetchAdjectiveList().then((words) => el.innerHTML = words.length.toString());
    });
    elNounCount.forEach((el) => {
      fetchNounList().then((words) => el.innerHTML = words.length.toString());
    });
    const expander = ListExpander.create("pwd-container", "pwd-template");
    document.querySelector("#pwd-button")?.addEventListener("click", (el) => {
      console.log("click");
      Promise.all([fetchAdjectiveList(), fetchNounList()]).then(([aList, nList]) => {
        const pList = Array.from({ length: 10 }, () => {
          const adj = aList[Math.floor(Math.random() * aList.length)];
          const noun = nList[Math.floor(Math.random() * nList.length)];
          const digits = String(Math.floor(Math.random() * 900) + 100);
          return `${adj}.${noun}.${digits}`;
        });
        expander?.expand(pList, (el2, it, idx) => {
          const elIndex = el2.querySelector(".pwd-index");
          const elEntropy = el2.querySelector(".pwd-entopy");
          const elText = el2.querySelector(".pwd-text");
          elIndex.innerHTML = (idx + 1).toString().padStart(2, "0");
          elEntropy.innerHTML = `${passwordEntropy(it).toString().padStart(2, "0")} bits`;
          elText.innerHTML = it;
        });
      });
    });
  }
  document.addEventListener("DOMContentLoaded", initPleasantPasswords);
})();
