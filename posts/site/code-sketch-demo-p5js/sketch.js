let particles = [];

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

    setupCanvas() { 
        const sketch = document.querySelector("x-sketch"); 
        let canvas = createCanvas(sketch.offsetWidth, sketch.offsetHeight);
        canvas.parent('canvas-container');
    }
}

const lzon = new Lzon(); 

function setup() {
    

    lzon.setupCanvas(); 
    
    // Create initial particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-1, 1),
            vy: random(-1, 1),
            r: random(3, 8)
        });
    }


}

function windowResized() {
    const canvas = document.querySelector("x-sketch > canvas"); 
    resizeCanvas(canvas.offsetWidth, canvas.offsetHeight); 

}

function draw() {
    background(...lzon.colorDarker);
    
    // Update and draw particles
    for (let p of particles) {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        // Draw particle
        let d = dist(mouseX, mouseY, p.x, p.y);
        fill(...lzon.colorLight);
        noStroke();
        circle(p.x, p.y, p.r * 2);
        
        // Draw connections
        for (let other of particles) {
            let distance = dist(p.x, p.y, other.x, other.y);
            if (distance < 80) {
                stroke(150, 200, 255, map(distance, 0, 80, 80, 0));
                strokeWeight(1);
                line(p.x, p.y, other.x, other.y);
            }
        }
    }
    
    // Mouse interaction
    fill(...lzon.primary);
    noStroke();
    circle(mouseX, mouseY, 20);
}

function mousePressed() {
    // Add particle at mouse position
    particles.push({
        x: mouseX,
        y: mouseY,
        vx: random(-2, 2),
        vy: random(-2, 2),
        r: random(4, 10)
    });
    
    // Keep particle count reasonable
    if (particles.length > 100) {
        particles.shift();
    }
}