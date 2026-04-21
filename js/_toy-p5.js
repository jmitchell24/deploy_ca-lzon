// ts/_toy-p5.ts
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
export {
  initToyP5
};
