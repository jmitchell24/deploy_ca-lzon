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
        { author: "Charlie Brown", text: "In the book of life, the answers aren't in the back." },
        { author: "Charlie Brown", text: "That's the secret to life... replace one worry with another." },
        { author: "Charlie Brown", text: "I've developed a new philosophy. I only dread one day at a time." },
        { author: "Charlie Brown", text: "I love the kinds of hugs where you can physically feel the sadness leaving your body." },
        { author: "Charlie Brown", text: "Nothing takes the taste out of peanut butter quite like unrequited love." },
        { author: "Charlie Brown", text: "I think I'm afraid to be happy, every time I'm happy something bad happens." },
        { author: "Charlie Brown", text: "My anxieties have anxieties." },
        { author: "Charlie Brown", text: "For one brief moment today I thought I was winning in the game of life. But there was a flag on the play!" },
        { author: "Charlie Brown", text: "Sometimes you lie in bed at night, and you don't have a single thing to worry about... That always worries me!" },
        { author: "Charles M. Schulz", text: "I think I'm allergic to morning." },
        { author: "Charles M. Schulz", text: "My life has no purpose, no direction, no aim, no meaning, and yet I'm happy. I can't figure it out. What am I doing right?" },
        { author: "Charles M. Schulz", text: "Be yourself. No one can say you're doing it wrong." },
        { author: "Charles M. Schulz", text: "The less you want, the more you love." },
        { author: "Charles M. Schulz", text: "Few people are successful unless other people want them to be." },
        { author: "Lucy van Pelt", text: "All I really need is love, but a little chocolate now and then doesn't hurt." },
        { author: "Lucy van Pelt", text: "Ugh! I’ve been kissed by a dog! I have dog germs! Get hot water! Get some disinfectant! Get some Iodine!" },
        { author: "Lucy van Pelt", text: "Happiness is a warm puppy." },
        { author: "Lucy van Pelt", text: "I never made a mistake in my life. I thought I did once, but I was wrong." },
        { author: "Lucy van Pelt", text: "Try not to have a good time... This is supposed to be educational." },
        { author: "Linus van Pelt", text: "No problem is so big or so complicated that it can't be run away from!" },
        { author: "Linus van Pelt", text: "Big sisters are the crab grass in the lawn of life." },
        { author: "Linus van Pelt", text: "Don't be a leaf... Be a tree!" },
        { author: "Sally Brown", text: "I think I've discovered the secret of life - you just hang around until you get used to it." },
        { author: "Sally Brown", text: "Light travels at a speed of 186,000 miles per second…So why are the afternoons so long?" },
        { author: "Snoopy", text: "There's no sense in doing a lot of barking if you don't really have anything to say." },
        { author: "Frieda", text: "People always expect more of you when you have naturally curly hair!" },
    ]
    
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)+3;
    const seed = dayOfYear * 9301 + 49297;
    const randomIndex = seed % quoteArray.length;
    const randomQuote = quoteArray[randomIndex];
    const quote = document.querySelector("daily-quote"); 
    quote.innerHTML = `${randomQuote.text} <br><br> - ${randomQuote.author}`;
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
