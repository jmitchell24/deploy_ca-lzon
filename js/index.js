//
// Daily Quote 
//

document.addEventListener("DOMContentLoaded", () => {

    const moodSelected    = { arr: datedQuoteArray,     text: "for today only",    tip: "A quote I chose just for today." }; 
    const moodNeutral     = { arr: neutralQuoteArray,   text: "neutral",           tip: "Just a good quote. Click to refresh." }; 
    const moodStark       = { arr: starkQuoteArray,     text: "stark",             tip: "A harsh truth. Click to refresh." }; 
    const moodFun         = { arr: funQuoteArray,       text: "silly",             tip: "To make you laugh. Click to refresh." }; 
    const moodInspo       = { arr: inspoQuoteArray,     text: "inspirational",     tip: "To inspire you to do something amazing. Click to refresh." }; 

    const qotdContent = document.querySelector("x-qotd-content"); 
    const qotdDate = document.querySelector("x-qotd-date"); 
    const qotdMood = document.querySelector("x-qotd-mood > a"); 

    const today = new Date();

    function getAutoMood() { 
        switch (autoQuoteMood) {
            case "neutral"  : return moodNeutral;
            case "stark"    : return moodStark;
            case "fun"      : return moodFun;
            case "inspo"    : return moodInspo;
        }

        return moodNeutral;
    }

    function updateQuote(quoteMood) { 
        const dateString = today.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        qotdContent.innerHTML = `<em>“${quoteMood.quote.text}”</em> <br> - ${quoteMood.quote.author}`;
        qotdDate.innerHTML =  dateString;
        qotdMood.innerHTML = quoteMood.mood.text; 
        qotdMood.setAttribute("title", quoteMood.mood.tip);
    }

    let moodClickCount = 0; 

    function getQuoteMood() { 
        // try first to use a dated quote for the current day 
        const selectedQuote = datedQuoteArray.find(quote => {
            // Use local date 
            const year          = today.getFullYear();
            const month         = String(today.getMonth() + 1).padStart(2, '0');
            const day           = String(today.getDate()).padStart(2, '0');
            const todayString   = `${year}-${month}-${day}`; // Local 'YYYY-MM-DD'
             
            return quote.date === todayString; 
        });

        if (selectedQuote) return { mood: moodSelected, quote: selectedQuote, canRefresh: false };

        // fallback to automatic rotating quote if a dated quote is not found 
        const mood          = getAutoMood();
        
        const dayOfYear     = moodClickCount + Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const seed          = dayOfYear * 9301 + 49297;
        const randomIndex   = seed % mood.arr.length;

        return { mood: mood, quote: mood.arr[randomIndex], canRefresh: true };
    }

    const quoteMoodToday = getQuoteMood(); 
    updateQuote(quoteMoodToday); 

    if (quoteMoodToday.canRefresh) {
        qotdMood.addEventListener("click", () => { 
            moodClickCount += 1; 
            updateQuote(getQuoteMood()); 
        });
    }

});