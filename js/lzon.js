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

