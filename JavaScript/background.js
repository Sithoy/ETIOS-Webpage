// background.js

const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");

let PARTICLE_COUNT = 90;
let MAX_DISTANCE = 140;
let SPEED = 0.45;
let LINE_STRENGTH = 0.35;
let particles = [];

const pointer = {
  x: null,
  y: null,
  active: false,
};

function setResponsiveSettings() {
  const width = window.innerWidth;

  if (width < 640) {
    // Mobile
    PARTICLE_COUNT = 30;
    MAX_DISTANCE = 100;
    SPEED = 0.55;
    LINE_STRENGTH = 0.22;
  } else if (width < 1024) {
    // Tablet
    PARTICLE_COUNT = 55;
    MAX_DISTANCE = 130;
    SPEED = 0.4;
    LINE_STRENGTH = 0.28;
  } else {
    // Desktop
    PARTICLE_COUNT = 90;
    MAX_DISTANCE = 180;
    SPEED = 0.45;
    LINE_STRENGTH = 0.35;
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  setResponsiveSettings();
  initParticles();
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.baseVx = (Math.random() - 0.5) * SPEED;
    this.baseVy = (Math.random() - 0.5) * SPEED;

    this.vx = this.baseVx;
    this.vy = this.baseVy;

    this.radius = Math.random() < 0.2 ? 2.2 : 1.8;
  }

  move() {
    this.vx = this.baseVx;
    this.vy = this.baseVy;

    // Premium effect: very subtle pointer repulsion on desktop only
    if (window.innerWidth >= 1024 && pointer.active && pointer.x !== null && pointer.y !== null) {
      const dx = this.x - pointer.x;
      const dy = this.y - pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 160 && distance > 0) {
        const force = (160 - distance) / 1600;
        this.vx += (dx / distance) * force * 2.5;
        this.vy += (dy / distance) * force * 2.5;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= canvas.width) this.baseVx *= -1;
    if (this.y <= 0 || this.y >= canvas.height) this.baseVy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
    ctx.fill();
  }
}

function initParticles() {
  particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MAX_DISTANCE) {
        const opacity = (1 - distance / MAX_DISTANCE) * LINE_STRENGTH;

        ctx.strokeStyle = `rgba(120, 120, 120, ${opacity})`;
        ctx.lineWidth = window.innerWidth >= 1024 ? 0.65 : 0.5;

        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const particle of particles) {
    particle.move();
    particle.draw();
  }

  connectParticles();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
  if (window.innerWidth >= 1024) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  }
});

window.addEventListener("mouseleave", () => {
  pointer.active = false;
  pointer.x = null;
  pointer.y = null;
});

resizeCanvas();
animate();