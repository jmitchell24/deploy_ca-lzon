//
// Theme Init 
//


(function() { // update hue value 
    const hueValueTotal = 36; 

    let pageHueIndex = parseInt(localStorage.getItem("theme-hue-index") ?? "0"); 
    pageHueIndex = Math.max(0, Math.min(hueValueTotal-1, pageHueIndex)); 
    localStorage.setItem("theme-hue-index", pageHueIndex); 
    
    document.documentElement.style.setProperty("--color-primary-hue", 
        pageHueIndex * 360 / (hueValueTotal - 1)
    );
})();


document.addEventListener('DOMContentLoaded', () => { // update dark mode (defaults to 'on')
    let pageDarkMode = localStorage.getItem("theme-dark-mode");
    pageDarkMode = pageDarkMode == "off" ? "off" : "on"; 
    localStorage.setItem("theme-dark-mode", pageDarkMode); 

    document.body.setAttribute("data-dark-mode", pageDarkMode);
}); 

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