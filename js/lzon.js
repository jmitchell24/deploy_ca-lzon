//
// Matomo 
//

var _paq = window._paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
    var u="//matomo.delm.win/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '4']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();



function parseCSSColorToFloat(colorStr) {
    const div = document.createElement('div');
    div.style.color = window.getComputedStyle(document.body).getPropertyValue(colorStr).trim();
    document.body.appendChild(div);
    
    const rgb = window.getComputedStyle(div).color;
    document.body.removeChild(div);
    
    const match = rgb.match(/[\d.]+/g);
    return [
        parseFloat(match[0]) / 255,
        parseFloat(match[1]) / 255,
        parseFloat(match[2]) / 255,
        match[3] !== undefined ? parseFloat(match[3]) : 1
    ];
}

function parseCSSColorToRGB(colorStr) {
    const div = document.createElement('div');
    div.style.color = window.getComputedStyle(document.body).getPropertyValue(colorStr).trim();
    document.body.appendChild(div);
    
    const rgb = window.getComputedStyle(div).color;
    document.body.removeChild(div);
    
    const match = rgb.match(/[\d.]+/g);
    return [
        parseInt(match[0]),
        parseInt(match[1]),
        parseInt(match[2])
    ];
}

/// Overlay

document.addEventListener('DOMContentLoaded', () => {

    const settingsOverlay = document.querySelector(".overlay"); 
    settingsOverlay.addEventListener("click", (e) => { 
        if (e.target === settingsOverlay) { 
            history.back(); 
            console.log("overlay click"); 
        }
    });
    
});

//
// Theme 
//

const HUE_VALUE_TOTAL   = 36; 
const HUE_VALUE_DEFAULT = 3; 
const HUE_VALUE_KEY     = "theme-hue-index"; 

function getStoredHueValue() { 
    const item = localStorage.getItem(HUE_VALUE_KEY); 

    if (item == null) { 
        console.log(`hue value not found in local storage. setting default: ${HUE_VALUE_DEFAULT}`); 
        localStorage.setItem(HUE_VALUE_KEY, HUE_VALUE_DEFAULT); 
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

    localStorage.setItem(HUE_VALUE_KEY, 
        value ?? HUE_VALUE_DEFAULT
    ); 
    console.log(`local storage hue value updated: ${value}`); 
}

(function() { // update hue value 
    
    let pageHueIndex = getStoredHueValue(); 
    pageHueIndex = Math.max(0, Math.min(HUE_VALUE_TOTAL-1, pageHueIndex)); 
    localStorage.setItem(HUE_VALUE_KEY, pageHueIndex); 
     
    document.documentElement.style.setProperty("--color-primary-hue", 
        pageHueIndex * 360 / (HUE_VALUE_TOTAL - 1)
    );
})();


document.addEventListener('DOMContentLoaded', () => { // update dark mode (defaults to 'on')
    let pageDarkMode = localStorage.getItem("theme-dark-mode");
    pageDarkMode = pageDarkMode == "off" ? "off" : "on"; 
    localStorage.setItem("theme-dark-mode", pageDarkMode); 

    document.body.setAttribute("data-dark-mode", pageDarkMode);
}); 

document.addEventListener('DOMContentLoaded', () => {

    
    let pageHueIndex = getStoredHueValue(); 
    let pageDarkMode = localStorage.getItem("theme-dark-mode");

    console.log(`initial page hue: ${pageHueIndex}`); 

    const themeItemsColor = document.querySelectorAll('.btn-hue');
    const themeItemDark = document.querySelector("#btn-enable-dark-theme"); 
    const themeItemLight = document.querySelector("#btn-enable-light-theme"); 

    function updatePageHueIndex(idx) { 
        pageHueIndex = idx; 
        setStoredHueValue(idx); 
        
        document.documentElement.style.setProperty("--color-primary-hue", 
            themeItemsColor[pageHueIndex].getAttribute("data-hue")
        );
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
            it.classList.toggle('active', idx === pageHueIndex);
        });
    }

    function updateDarkModeItems() { 
        const isDark = pageDarkMode == "on"; 
        themeItemDark.classList.toggle('active', isDark); 
        themeItemLight.classList.toggle('active', !isDark); 
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

// 
// Code Wrapper Copy Function 
// 

function initCodeWrapper(el) { 
    const pre = el.querySelector("pre"); 
    const preCode = pre.querySelector("code"); 
    
    const preLangText = preCode.getAttribute("data-lang") || "plaintext"; 
    const preCodeText = el.getAttribute("data-raw-code"); // pre.textContent || pre.innerText; 

    const footer = el.querySelector("x-code-footer"); 
    const footerLang = el.querySelector("x-code-footer > x-code-footer-lang"); 
    const footerCopy = el.querySelector("x-code-footer > x-code-footer-copy");
    const footerChars = el.querySelector("x-code-footer > x-code-footer-chars"); 

    footerLang.innerText = preLangText; 
    footerChars.innerText = `${preCodeText.length} chars`; 
    footerCopy.innerText = "click to copy";

    footer.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(preCodeText);
            
            // Visual feedback
            const originalText = footerCopy.innerHTML;
            footerCopy.innerHTML = "copied...";
            
            // Reset after 2 seconds
            setTimeout(() => {
                footerCopy.innerHTML = originalText;
            }, 1500);
            
        } catch (err) {
            console.log("error while copying: " + err); 
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("x-code-wrapper").forEach(initCodeWrapper);

});

// 
// accordian 
// 

function initAccordion() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-toggle="collapse"]');
    if (!btn) return;

    const target = document.querySelector(btn.dataset.target);
    if (!target) return;

    const parent = btn.dataset.parent
      ? document.querySelector(btn.dataset.parent)
      : target.closest('.accordion');

    // Close siblings within parent
    if (parent) {
      parent.querySelectorAll('.accordion-collapse.show, .accordion-collapse.collapsing')
        .forEach(function(el) {
          if (el !== target) collapseElement(el);
        });
    }

    // Toggle target
    if (target.classList.contains('show')) {
      collapseElement(target);
    } else {
      expandElement(target);
    }
  });
}

function expandElement(el) {
  // Remove collapse, add collapsing for transition
  el.classList.remove('collapse');
  el.classList.add('collapsing');
  el.style.height = '0px';

  // Force reflow then set target height
  void el.offsetHeight;
  el.style.height = el.scrollHeight + 'px';

  // Toggle button state
  var btn = findAccordionButton(el);
  if (btn) btn.classList.remove('collapsed');

  el.addEventListener('transitionend', function handler() {
    el.removeEventListener('transitionend', handler);
    el.classList.remove('collapsing');
    el.classList.add('collapse', 'show');
    el.style.height = '';
  });
}

function collapseElement(el) {
  // Set explicit height so transition has a start value
  el.style.height = el.scrollHeight + 'px';
  void el.offsetHeight;

  el.classList.remove('collapse', 'show');
  el.classList.add('collapsing');
  el.style.height = '0px';

  // Toggle button state
  var btn = findAccordionButton(el);
  if (btn) btn.classList.add('collapsed');

  el.addEventListener('transitionend', function handler() {
    el.removeEventListener('transitionend', handler);
    el.classList.remove('collapsing');
    el.classList.add('collapse');
    el.style.height = '';
  });
}

function findAccordionButton(collapseEl) {
  return document.querySelector('[data-target="#' + collapseEl.id + '"]');
}

initAccordion();

// 
// qotd
// 

async function initQotd() { 
    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function getShuffledIndices(length) {
        function rand() {
            let t = 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
        
        const indices = Array.from({length}, (_, i) => i);
        for (let i = length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    }

    function getDaysSinceEpoch() { 
        const epochDate = new Date(1991, 7, 22); 
        const now = new Date(); 
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
        return Math.floor((today - epochDate) / (1000 * 60 * 60 * 24)); 
    }

    function getQuoteDate(quote) { 
        return quote.date ? new Date(quote.date + "T00:00:00") : null; 
    }

    function getDateString(d) { 
        return d.toLocaleDateString(undefined, {
            weekday: "long", year: "numeric", month: "short", day: "numeric",
        });
    }




    // wait for dom to load
    document.addEventListener("DOMContentLoaded", () => {
        
        const elAllQotd = document.querySelectorAll("#qotd");
        const elAllQuoteContainer = document.querySelectorAll("#quote-container > #quote:only-child");

        // early out if no dom to work with
        if (!(elAllQotd.length || elAllQuoteContainer.length)) 
            return; 

        // wait for quotes json to load
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        fetch('/data/quotes.json')
            .then(res => res.json())
            .then(data => data.quotes)
            //.then(quotes => delay(1220).then(() => quotes))
            .then(quotes => {

            const indices = getShuffledIndices(quotes.length);

            function getSequenceQuote(offset) { 
                const days = getDaysSinceEpoch() + (offset || 0); 
                const cycleIndex = days % quotes.length; 
                return quotes[indices[cycleIndex]]; 
            }

            // 
            // setup qotd 
            // 

            elAllQotd.forEach(el => { 
                const elContent = el.querySelector("#qotd-content");
                const elButtons = el.querySelector("#qotd-buttons");
                const elPrev = el.querySelector("#qotd-prev");
                const elNext = el.querySelector("#qotd-next");
                const elReset = el.querySelector("#qotd-reset"); 
                const elLabel = el.querySelector("#qotd-label");
                const elLabelPre = elLabel.querySelector("#qotd-label-pre");
                const elLabelText = elLabel.querySelector("#qotd-label-text");
                


                function updateQuote(offset) {
                    const day = new Date();
                    day.setDate(day.getDate() + offset);

                    const q = getSequenceQuote(offset);
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const isToday = q.date === todayStr;

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

                // if a quote was added today, start on it
                const todayStr = new Date().toISOString().slice(0, 10);
                for (let i = 0; i < quotes.length; i++) {
                    if (getSequenceQuote(i).date === todayStr) { dayOffset = i; break; }
                }

                updateQuote(dayOffset);

                elPrev.addEventListener("click", () => { updateQuote(--dayOffset); });
                elNext.addEventListener("click", () => { updateQuote(++dayOffset); });
                elReset.addEventListener("click", () => { updateQuote(dayOffset=0); });
                el.classList.toggle("animate-fade-in-md", true); 
            });

            // 
            // setup quotes table 
            // 

            elAllQuoteContainer.forEach(el => { 
                const elContainer = el.parentElement; 
                
                for (let i = 0; i < quotes.length; ++i) { 

                    const q = getSequenceQuote(i);
                    const elQuote = el.cloneNode(true); 
                    const elDate = elQuote.querySelector("#quote-date"); 
                    const elLabel = elQuote.querySelector("#quote-label"); 
                    const elContent = elQuote.querySelector("#quote-content"); 

                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    elDate.innerHTML = "Scheduled for " + d.toLocaleDateString(undefined, {
                        weekday: "long", year: "numeric", month: "short", day: "numeric",
                    });
                    
                    if (q.date) { 
                        elLabel.innerHTML = "Added " + getDateString(getQuoteDate(q)); 
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

initQotd(); 

// 
// changelog 
// 

async function initChangelog() { 
    const trimMargin = str => str.replace(/^[ \t]*\|/gm, '').trim();

    const formatBytes = kb => {
        if (kb < 1024) return `${kb} KB`;
        if (kb < 1024 ** 2) return `${(kb / 1024).toFixed(1)} MB`;
        if (kb < 1024 ** 3) return `${(kb / 1024 ** 2).toFixed(1)} GB`;
        return `${(kb / 1024 ** 3).toFixed(1)} TB`;
    };

    const formatDate = unix => new Date(unix * 1000).toLocaleString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const formatTime = unix => new Date(unix * 1000).toLocaleString('en-CA', {
        hour: 'numeric', minute: '2-digit', second: '2-digit'
    });

    // wait for dom to load
    document.addEventListener("DOMContentLoaded", () => {

        const elChangelog = document.querySelectorAll("#changelog"); 

        // early out if no dom to work with
        if (!elChangelog) return; 
        
        // wait for json to load
        fetch('/data/changelog.json').then(res => res.json()).then(data => {
            elChangelog.forEach(el => {
                
                
                let html = ""

                const buildStr = `
                |# Build 
                |    - date: <span class="z-string">${formatDate(data.timestamp)}</span>
                |    - time: <span class="z-constant">${formatTime(data.timestamp)}</span>
                |
                |# Changelog
                `;
                
                html += trimMargin(buildStr); 

                data.commits.forEach(it => { 
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

initChangelog(); 

