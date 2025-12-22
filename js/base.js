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
    }

    function closePopup() { 
        bodyOverlay.style.display = "none";
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


// function toggleDarkMode() { 
//     const attrDarkMode = document.body.getAttribute("data-dark-mode"); 
//     let dark_mode_value = localStorage.getItem(DARK_MODE_KEY) || "on"; 

//     if (attrDarkMode == null)
//         dark_mode_value = "on"; 
//     else if (attrDarkMode == "on")
//         dark_mode_value = "off"; 
//     else if (attrDarkMode == "off")
//         dark_mode_value = "on"; 

//     localStorage.setItem(DARK_MODE_KEY, dark_mode_value); 
//     document.body.setAttribute("data-dark-mode", dark_mode_value); 
// }

// document.addEventListener('DOMContentLoaded', () => { 
//     const footerButton = document.querySelector("footer-button"); 

//     const keyDarkMode = "data-dark-mode";

//     function toggleDarkMode(animateTransition) { 
//         const attrDarkMode = document.body.getAttribute(keyDarkMode); 
//         const valueDarkMode = 
//             attrDarkMode != null && attrDarkMode == "on" 
//             ? "off"
//             : "on";  

//         document.body.setAttribute(keyDarkMode, valueDarkMode); 
//         localStorage.setItem(keyDarkMode, valueDarkMode); 
        
//         if (animateTransition) { 
//             document.body.classList.add('dark-mode-transition');
//                 setTimeout(() => {
//                 document.body.classList.remove('dark-mode-transition');
//             }, 300);
//         }
        
//     }

//     const attrDarkMode = document.body.getAttribute(keyDarkMode); 
//     const itemDarkMode = localStorage.getItem(keyDarkMode); 
//     if (attrDarkMode != itemDarkMode)
//         toggleDarkMode(false); 

//     footerButton.addEventListener("click", (e) => { 
//         toggleDarkMode(true); 
//     });
    
// }); 
