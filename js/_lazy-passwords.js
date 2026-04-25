// ts/_lazy-passwords.ts
var wordListPromise = null;
function isWordLazy(word) {
  const fingerMap = {
    q: 0,
    a: 0,
    z: 0,
    w: 1,
    s: 1,
    x: 1,
    e: 2,
    d: 2,
    c: 2,
    r: 3,
    f: 3,
    v: 3,
    t: 3,
    g: 3,
    b: 3
  };
  const fingers = [...word].map((c) => fingerMap[c]);
  if (fingers.some((f) => f === undefined))
    return false;
  for (let i = 1;i < fingers.length; i++) {
    if (fingers[i] === fingers[i - 1])
      return false;
    if (fingers[i] <= 1 && fingers[i - 1] <= 1)
      return false;
  }
  return true;
}
async function fetchWordList() {
  if (!wordListPromise) {
    wordListPromise = fetch("/data/eff_wordlist.txt").then((r) => r.text()).then((text) => text.trim().split(`
`).map((line) => line.split("\t")[1]).filter(isWordLazy));
  }
  return wordListPromise;
}
function badDigits(n) {
  const delta = Math.random() < 0.5 ? 1 : -1;
  const start = delta === 1 ? Math.floor(Math.random() * (5 - n + 1)) + 1 : Math.floor(Math.random() * (5 - n + 1)) + n;
  let result = "";
  for (let i = 0;i < n; i++) {
    result += String(start + delta * i);
  }
  return result;
}
function initLazyPasswords() {
  const elBpButton = document.querySelector("#bad-password-button");
  const elBpList = document.querySelector("#bad-password-list");
  if (!(elBpButton && elBpList)) {
    console.error("can't find el's");
    return;
  }
  function fillList(items) {
    let s = "";
    for (const it of items) {
      s += it + "<br>";
    }
    elBpList.innerHTML = s;
  }
  function makeBadPasswords(words, limit) {
    console.log("words count : " + words.length);
    return Array.from({ length: limit }, () => {
      const word = words[Math.floor(Math.random() * words.length)];
      return word + badDigits(3);
    });
  }
  elBpButton.addEventListener("click", (el) => {
    console.log("click");
    fetchWordList().then((words) => {
      const badPasswords = makeBadPasswords(words, 10);
      fillList(badPasswords);
    });
  });
}
initLazyPasswords();
