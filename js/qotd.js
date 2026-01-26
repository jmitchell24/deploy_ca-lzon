//
// Daily Quote 
//

document.addEventListener("DOMContentLoaded", () => {

    const moodSelected    = { arr: datedQuoteArray,     text: "for today only",    tip: "A quote I chose just for today." }; 
    const moodNeutral     = { arr: neutralQuoteArray,   text: "neutral",           tip: "Just a good quote. Click to refresh." }; 
    const moodStark       = { arr: starkQuoteArray,     text: "stark",             tip: "A harsh truth. Click to refresh." }; 
    const moodFun         = { arr: funQuoteArray,       text: "silly",             tip: "To make you laugh. Click to refresh." }; 
    const moodInspo       = { arr: inspoQuoteArray,     text: "inspirational",     tip: "To inspire you to do something amazing. Click to refresh." }; 

    const qotdContent = document.querySelector("#qotd-content"); 
    const qotdDate = document.querySelector("#qotd-date"); 
    const qotdMood = document.querySelector("#qotd-mood > a"); 

    const today = new Date();

    // A better pseudo-random seed generator 
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    function getMulberry32(a) {
        return function() {
            let t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

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
        const todayString = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const selectedQuote = datedQuoteArray.find(q => q.date === todayString);

        if (selectedQuote) return { mood: moodSelected, quote: selectedQuote, canRefresh: false };

        // fallback to automatic rotating quote if a dated quote is not found 
        const mood = getAutoMood();

        // Create a seed based on the date + click count + mood name
        // This ensures "Fun" and "Stark" show different quotes on the same day/click
        const seedString = todayString + moodClickCount + mood;
        let hash = 0;
        for (let i = 0; i < seedString.length; i++) {
            hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
            hash |= 0; 
        }

        const rand = getMulberry32(hash);
        const randomIndex = Math.floor(rand() * mood.arr.length);

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