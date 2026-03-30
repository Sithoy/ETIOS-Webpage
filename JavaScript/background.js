// background.js

const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Particle settings
const PARTICLE_COUNT = 110;
const MAX_DISTANCE = 140;

let particles = [];

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;

        this.radius = 2;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#888";
        ctx.fill();
    }
}

// Create particles
function initParticles() {
    particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

// Draw connection lines
function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MAX_DISTANCE) {

                let opacity = 1 - distance / MAX_DISTANCE;

                ctx.strokeStyle = "rgba(120,120,120," + opacity + ")";
                ctx.lineWidth = 0.5;

                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.move();
        particle.draw();
    });

    connectParticles();

    requestAnimationFrame(animate);
}

// Start
initParticles();
animate();