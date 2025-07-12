document.addEventListener('DOMContentLoaded', function() {
    
    // --- Canvas Starry Sky Animation ---
    const canvas = document.getElementById('starry-sky-canvas');
    const ctx = canvas.getContext('2d');

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    // Re-adjust canvas on window resize
    window.addEventListener('resize', setCanvasSize);

    const numStars = 300;
    const stars = [];

    // Utility to get a random number in a range
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Star object
    function Star() {
        this.x = random(0, canvas.width);
        this.y = random(0, canvas.height);
        this.radius = random(0.5, 1.5);
        this.vx = random(-0.1, 0.1);
        this.vy = random(-0.1, 0.1);
        this.alpha = random(0.2, 0.9);
        this.color = `rgba(255, 255, 255, ${this.alpha})`;
    }

    Star.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    Star.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap stars around the screen
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    };
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    // Add a couple of colored "galaxy" stars
    const galaxyColors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff'];
    for (let i = 0; i < 5; i++) {
        const star = new Star();
        star.radius = random(1, 2);
        star.color = galaxyColors[Math.floor(random(0, galaxyColors.length))];
        stars.push(star);
    }
    
    // Supernova particles
    let particles = [];
    function createSupernova() {
        const x = random(canvas.width * 0.2, canvas.width * 0.8);
        const y = random(canvas.height * 0.2, canvas.height * 0.8);
        const particleCount = 100;
        const hue = random(0, 360);

        for(let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y, hue));
        }
    }

    function Particle(x, y, hue) {
        this.x = x;
        this.y = y;
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 5);
        this.friction = 0.97;
        this.gravity = 0.05;
        this.hue = random(hue - 20, hue + 20);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.01, 0.02);
    }

    Particle.prototype.update = function() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
    }

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.fill();
    }

    // Meteor logic
    let meteor = null;
    function createMeteor() {
        meteor = {
            x: random(-100, canvas.width + 100),
            y: -100,
            dx: random(-3, 3),
            dy: random(2, 4),
            len: random(100, 200),
            width: 2,
            color: 'rgba(255, 255, 255, 0.5)'
        };
    }

    function drawMeteor() {
        if (!meteor) return;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.dx * meteor.len, meteor.y - meteor.dy * meteor.len);
        ctx.strokeStyle = meteor.color;
        ctx.lineWidth = meteor.width;
        ctx.stroke();
    }

    function updateMeteor() {
        if (!meteor) return;
        meteor.x += meteor.dx;
        meteor.y += meteor.dy;
        if (meteor.y > canvas.height + 200) meteor = null;
    }

    // Create a supernova every 20 seconds
    setInterval(createSupernova, 20000);
    // Create a meteor every 10 seconds
    setInterval(createMeteor, 10000);


    // The main animation loop
    function animate() {
        requestAnimationFrame(animate);
        // Use a semi-transparent fill to create a motion blur "tail" effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        particles.forEach((p, i) => {
            if(p.alpha <= 0) {
                particles.splice(i, 1);
            } else {
                p.update();
                p.draw();
            }
        });
        
        updateMeteor();
        drawMeteor();
    }
    
    animate();

    // --- Sidebar Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Update active link style
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Show the correct content section
            const targetId = this.getAttribute('href');
            contentSections.forEach(section => {
                if ('#' + section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
});