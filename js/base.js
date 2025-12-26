/// Matomo 

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

    const footerButton = document.querySelector("footer-button"); 
    const popupButton = document.querySelector("body-overlay-popup-button"); 
    const bodyOverlay = document.querySelector("body-overlay"); 
    const bodyOverlayPopup = document.querySelector("body-overlay-popup");

    function openPopup() { 
        bodyOverlay.style.display = "flex"; 
        bodyOverlay.classList.add("overlay-is-open"); 
        document.body.classList.add("overlay-is-open"); 
    }

    function closePopup() { 
        bodyOverlay.style.display = "none";
        bodyOverlay.classList.remove("overlay-is-open"); 
        document.body.classList.remove("overlay-is-open"); 
    }

    // openPopup(); 

    bodyOverlayPopup.addEventListener('click', () => { 

    }); 
    
    bodyOverlay.addEventListener("click", (e) => { 
        if (e.target === bodyOverlay) { 
            closePopup(); 
        }
    });

    popupButton.addEventListener("click", (e) => { 
        closePopup(); 
    });

    footerButton.addEventListener("click", () => {
        openPopup();  
    });
});

/// Theme List 

document.addEventListener('DOMContentLoaded', () => {

    let pageHueIndex = parseInt(localStorage.getItem("theme-hue-index") ?? "0"); 
    const themeItems = document.querySelectorAll("theme-item");

    function updatePageHueIndex(idx) { 
        pageHueIndex = idx; 
        localStorage.setItem("theme-hue-index", idx); 
        document.documentElement.style.setProperty("--color-primary-hue", 
            themeItems[pageHueIndex].getAttribute("data-hue")
        );
    }

    function updateThemeItems() { 
        themeItems.forEach((it, idx) => {
            it.setAttribute("data-active", idx == pageHueIndex ? "true" : "false"); 
        });
    }

    themeItems.forEach((it, idx) => { 
        it.addEventListener("click", (e) => { 
            updatePageHueIndex(idx);      
            updateThemeItems(); 
        });
    });

    updateThemeItems();
    updatePageHueIndex(pageHueIndex);
}); 

/// Daily Quote 

document.addEventListener("DOMContentLoaded", () => {
   
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)+3;

    let randomQuote = pickedQuoteArray.find(quote => {
        const todayString = today.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
        console.log(todayString); 
        console.log(quote.date); 
        const isToday = quote.date === todayString;
        console.log(isToday); // true or false
        return isToday; 
    });

    if (!randomQuote) { 
        const seed = dayOfYear * 9301 + 49297;
        const randomIndex = seed % quoteArray.length;
        randomQuote = quoteArray[randomIndex];
    }

    //const randomQuote = quoteArray[randomIndex];
    const quoteContent = document.querySelector("daily-quote-content"); 
    const quoteTitle = document.querySelector("daily-quote-title"); 
    const dateString = today.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    quoteContent.innerHTML = `${randomQuote.text} <br> - ${randomQuote.author}`;
    quoteTitle.innerHTML =  `For ${dateString}`
});


/// Copy Buttons

    
function addCopyButton2(el) { 
    const pre = el.querySelector("pre"); 
    
    const preLangText = pre.getAttribute("data-lang") || "plaintext"; 
    const preCodeText = pre.textContent || pre.innerText; 

    const footer = el.querySelector("code-footer"); 
    const footerLang = el.querySelector("code-footer > code-footer-lang"); 
    const footerCopy = el.querySelector("code-footer > code-footer-copy");
    const footerChars = el.querySelector("code-footer > code-footer-chars"); 

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
            // Fallback for older browsers
            // ...
        }
    });
}
        
// Function to add copy buttons to all pre elements
function addCopyButtons() {
    document.querySelectorAll("code-wrapper").forEach((el, idx) => { 
        addCopyButton2(el); 
    });
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCopyButtons);
} else {
    addCopyButtons();
}
