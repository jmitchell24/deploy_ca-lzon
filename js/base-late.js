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
// Theme List 
//

document.addEventListener('DOMContentLoaded', () => {

    
    let pageHueIndex = parseInt(localStorage.getItem("theme-hue-index")) || 3;
    let pageDarkMode = localStorage.getItem("theme-dark-mode");

    console.log(`initial page hue: ${pageHueIndex}`); 

    const themeItemsColor = document.querySelectorAll('.btn-hue');
    const themeItemDark = document.querySelector("#btn-enable-dark-theme"); 
    const themeItemLight = document.querySelector("#btn-enable-light-theme"); 

    function updatePageHueIndex(idx) { 
        pageHueIndex = idx; 
        localStorage.setItem("theme-hue-index", idx); 
        console.log(`page hue updated: ${pageHueIndex}`); 
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

    updatePageHueIndex(pageHueIndex); 
}); 

// 
// Code Wrapper Copy Function 
// 

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("x-code-wrapper").forEach((el, idx) => { 
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
    });

});
