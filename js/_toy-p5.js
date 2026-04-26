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
})();
