class Lzon { 
    constructor() { 
        this.primary = parseCSSColorToRGB("--color-primary"); 
        this.primaryDark = parseCSSColorToRGB("--color-primary-dark");
        this.primaryLight = parseCSSColorToRGB("--color-primary-light");
        this.colorDarker = parseCSSColorToRGB("--color-darker");
        this.colorDark = parseCSSColorToRGB("--color-dark");
        this.colorGray = parseCSSColorToRGB("--color-gray");
        this.colorLight = parseCSSColorToRGB("--color-light");
        this.colorLighter = parseCSSColorToRGB("--color-lighter"); 
    }
    
    // Detect monitor refresh rate by measuring frame timing
    async detectRefreshRate() {
        return new Promise((resolve) => {
            let lastTime = performance.now();
            let frameTimes = [];
            let frameCount = 0;
            const maxFrames = 60; // Sample 60 frames
            
            function measureFrame() {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            if (frameCount > 10) { // Skip first few frames (can be unstable)
                frameTimes.push(deltaTime);
            }
            
            frameCount++;
            
            if (frameCount < maxFrames) {
                requestAnimationFrame(measureFrame);
            } else {
                // Calculate average frame time
                const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
                const refreshRate = Math.round(1000 / avgFrameTime);
                resolve(refreshRate);
            }
            }
            
            requestAnimationFrame(measureFrame);
        });
    }

    setup() { 
        const sketch = document.querySelector("x-sketch"); 

        p5.disableFriendlyErrors = true;

        let canvas = createCanvas(sketch.offsetWidth, sketch.offsetHeight);
        canvas.parent('canvas-container');

        if (this.desiredFrameRate) { 
            frameRate(this.desiredFrameRate); 
        } else { 
            // Detect monitor refresh rate
            this.detectRefreshRate().then(rate => {
                this.desiredFrameRate = rate;
                frameRate(this.desiredFrameRate);
                console.log('Detected Framerate:', this.desiredFrameRate, 'Hz');
            });
        }
        
    }
    
}

const lzon = new Lzon(); 