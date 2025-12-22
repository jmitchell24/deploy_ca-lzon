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

/// Daily Quote 

document.addEventListener("DOMContentLoaded", () => {
    const quoteArray = [ 
        "All I really need is love, but a little chocolate now and then doesn't hurt. <br><br> - Lucy van Pelt",
        "That's the secret to life... replace one worry with another. <br><br> - Charlie Brown",
        "No problem is so big or so complicated that it can't be run away from! <br><br> - Linus van Pelt",
        "Ugh! I’ve been kissed by a dog! I have dog germs! Get hot water! Get some disinfectant! Get some Iodine! <br><br> - Lucy van Pelt",
        "Big sisters are the crab grass in the lawn of life. <br><br> - Linus van Pelt",
        "Happiness is a warm puppy. <br><br> - Lucy van Pelt",
        "I never made a mistake in my life. I thought I did once, but I was wrong. <br><br> - Lucy van Pelt",
        "I think I've discovered the secret of life - you just hang around until you get used to it. <br><br> - Sally Brown",
        "In the book of life, the answers aren't in the back. <br><br> - Charlie Brown",
        "I've developed a new philosophy. I only dread one day at a time. <br><br> - Charlie Brown",
        "My life has no purpose, no direction, no aim, no meaning, and yet I'm happy. I can't figure it out. What am I doing right? <br><br> - Charles M. Schulz",
        "Nothing takes the taste out of peanut butter quite like unrequited love. <br><br> - Charlie Brown",
        "Try not to have a good time... This is supposed to be educational. <br><br> - Lucy van Pelt",
        "I think I'm allergic to morning. <br><br> - Charles M. Schulz",
        "I love the kinds of hugs where you can physically feel the sadness leaving your body. <br><br> - Charlie Brown",
        "There's no sense in doing a lot of barking if you don't really have anything to say. <br><br> - Snoopy",
        "I think I'm afraid to be happy, every time I'm happy something bad happens. <br><br> - Charlie Brown",
        "Be yourself. No one can say you're doing it wrong. <br><br> - Charles M. Schulz",
        "The less you want, the more you love. <br><br> - Charles M. Schulz",
        "Few people are successful unless other people want them to be. <br><br> - Charles M. Schulz",
        "People always expect more of you when you have naturally curly hair! <br><br> - Frieda",
        "Light travels at a speed of 186,000 miles per second…So why are the afternoons so long? <br><br> - Sally Brown",
        "My anxieties have anxieties. <br><br> - Charlie Brown",
        "Sometimes you lie in bed at night, and you don't have a single thing to worry about... That always worries me! <br><br> - Charlie Brown",
        "For one brief moment today I thought I was winning in the game of life. But there was a flag on the play! <br><br> - Charlie Brown",
        "Don't be a leaf... Be a tree! <br><br> - Linus van Pelt",
    ]
    
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const seed = dayOfYear * 9301 + 49297;
    const randomIndex = seed % quoteArray.length;
    const randomQuote = quoteArray[randomIndex];
    const quote = document.querySelector("peanuts-quote"); 
    quote.innerHTML = randomQuote;
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
