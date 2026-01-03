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

/// Settings Popup

document.addEventListener('DOMContentLoaded', () => {

    const settingsOverlay = document.querySelector("x-settings-overlay"); 
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

    let pageHueIndex = parseInt(localStorage.getItem("theme-hue-index") ?? "0"); 
    let pageDarkMode = localStorage.getItem("theme-dark-mode");

    const themeItemsColor = document.querySelectorAll('x-theme-color-item');
    const themeItemDark = document.querySelector("x-theme-dark-item"); 
    const themeItemLight = document.querySelector("x-theme-light-item"); 

    function updatePageHueIndex(idx) { 
        pageHueIndex = idx; 
        localStorage.setItem("theme-hue-index", idx); 
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
            it.setAttribute("data-active", idx == pageHueIndex ? "true" : "false"); 
        });
    }

    function updateDarkModeItems() { 
        themeItemDark.setAttribute("data-active", pageDarkMode == "on" ? "true" : "false"); 
        themeItemLight.setAttribute("data-active", pageDarkMode == "off" ? "true" : "false"); 
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

/// Daily Quote 

document.addEventListener("DOMContentLoaded", () => {
   
    const today = new Date();
    

    // try first to use a dated quote for the current day 
    let selectedQuote = datedQuoteArray.find(quote => {
        // Use local date 
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`; // Local 'YYYY-MM-DD'

        return quote.date === todayString; 
    });

    // fallback to automatic rotating quote if a dated quote is not found 
    if (!selectedQuote) { 
        function getQuoteArray() {
            console.log("mood: " + autoQuoteMood); 
            if (autoQuoteMood == "stark") return starkQuoteArray; 
            if (autoQuoteMood == "fun") return funQuoteArray; 
            return autoQuoteArray; 
        }

        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const seed = dayOfYear * 9301 + 49297;
        const quoteArray = getQuoteArray()
        const randomIndex = seed % quoteArray.length;

        selectedQuote = quoteArray[randomIndex];

        console.log("Automatic Rotating Quote: \n" + selectedQuote.text); 
    } else { 
        console.log("Dated Quote: \n" + selectedQuote.text); 
    }

    const quoteContent = document.querySelector("daily-quote-content"); 
    const quoteTitle = document.querySelector("daily-quote-title"); 
    const dateString = today.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    quoteContent.innerHTML = `<em>“${selectedQuote.text}”</em> <br> - ${selectedQuote.author}`;
    quoteTitle.innerHTML =  `For ${dateString}`
});

// 
// Code Wrapper Copy Function 
// 

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("x-code-wrapper").forEach((el, idx) => { 
        const pre = el.querySelector("pre"); 
        
        const preLangText = pre.getAttribute("data-lang") || "plaintext"; 
        const preCodeText = pre.textContent || pre.innerText; 

        const footer = el.querySelector("x-code-footer"); 
        const footerLang = el.querySelector("x-code-footer > x-code-footer-lang"); 
        const footerCopy = el.querySelector("x-code-footer > x-code-footer-copy");
        const footerChars = el.querySelector("x-code-footer > x-code-footer-chars"); 

        footerLang.innerText = preLangText; 
        footerChars.innerText = `${preCodeText.length} chars`; 
        footerCopy.innerText = "click to copy";

        footer.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(pre.textContent || pre.innerText);
                
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
