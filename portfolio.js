// ======================================
// PORTFOLIO INTERACTIONS
// ======================================

// 1. TYPING EFFECT
const typingText = document.getElementById("typing-text");

if (typingText) {
    const roles = [
        "Software Engineer",
        "Web Developer",
        "JavaScript Developer",
        "Problem Solver"
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (deleting) {
            characterIndex--;
        } else {
            characterIndex++;
        }

        typingText.textContent = currentRole.substring(0, characterIndex);

        let speed = deleting ? 50 : 100;

        if (!deleting && characterIndex === currentRole.length) {
            deleting = true;
            speed = 1200;
        } else if (deleting && characterIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();
}


// ======================================
// 2. DARK / LIGHT MODE
// ======================================

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    try {
        const savedTheme = localStorage.getItem("portfolio-theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
        }
    } catch (error) {
        console.warn("Theme preference could not be loaded.");
    }

    function updateThemeButton() {
        const isDark = document.body.classList.contains("dark-mode");

        themeToggle.textContent = isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
    }

    updateThemeButton();

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        try {
            localStorage.setItem(
                "portfolio-theme",
                isDark ? "dark" : "light"
            );
        } catch (error) {
            console.warn("Theme preference could not be saved.");
        }

        updateThemeButton();
    });
}


// ======================================
// 3. BACK TO TOP BUTTON
// ======================================

const backToTop = document.getElementById("back-to-top");

if (backToTop) {
    function updateBackToTop() {
        backToTop.style.display =
            window.scrollY > 300 ? "block" : "none";
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// ======================================
// 4. CONTACT FORM VALIDATION
// ======================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameField = document.getElementById("name");
        const emailField = document.getElementById("email");
        const messageField = document.getElementById("message");
        const status = document.getElementById("form-status");

        if (!nameField || !emailField || !messageField || !status) {
            console.error("Some contact form elements are missing.");
            return;
        }

        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const message = messageField.value.trim();

        if (!name || !email || !message) {
            status.textContent = "Please complete all fields.";
            return;
        }

        status.textContent =
            "Your details are valid. Connect a form service to send your message.";
    });
}


// ======================================
// 5. INTERACTIVE PARTICLE BACKGROUND
// ======================================

(() => {
    const canvas = document.getElementById("particle-canvas");

    if (!canvas) {
        console.warn(
            'Particle background unavailable. Add <canvas id="particle-canvas"></canvas> to your HTML.'
        );
        return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.warn("Your browser does not support the canvas animation.");
        return;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;
    let lastFrameTime = 0;

    const mouse = {
        x: null,
        y: null,
        radius: 140
    };

    const shockwaves = [];

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const isMobile = () => window.innerWidth < 768;


    // PARTICLE COUNT
    function getParticleCount() {
        const area = width * height;
        const density = isMobile() ? 10000 : 8500;

        return Math.max(
            35,
            Math.min(140, Math.floor(area / density))
        );
    }


    // CREATE PARTICLES
    function createParticles() {
        const count = getParticleCount();

        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,

            radius: Math.random() * 1.8 + 0.7,

            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,

            hue: Math.random() > 0.5 ? 215 : 265
        }));
    }


    // RESIZE CANVAS
    function resizeCanvas() {
        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        createParticles();
        drawParticles();
    }


    // ======================================
    // 6. CLICK / TAP SHOCKWAVES
    // ======================================

    function createShockwave(x, y) {
        if (reduceMotion.matches) {
            return;
        }

        shockwaves.push({
            x: x,
            y: y,

            radius: 0,

            // Expand across the screen.
            maxRadius: Math.hypot(width, height),

            // Slow, cinematic movement.
            speed: 1.2,

            opacity: 0.8
        });

        // Prevent too many simultaneous shockwaves.
        if (shockwaves.length > 5) {
            shockwaves.shift();
        }

        startAnimation();
    }


    // DRAW SHOCKWAVES
    function drawShockwaves() {
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const wave = shockwaves[i];

            wave.radius += wave.speed;

            wave.opacity =
                0.8 * (1 - wave.radius / wave.maxRadius);

            if (
                wave.radius >= wave.maxRadius ||
                wave.opacity <= 0
            ) {
                shockwaves.splice(i, 1);
                continue;
            }

            ctx.beginPath();

            ctx.arc(
                wave.x,
                wave.y,
                wave.radius,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                `rgba(90, 140, 255, ${wave.opacity})`;

            ctx.lineWidth = 2;

            ctx.shadowBlur = 22;
            ctx.shadowColor = "#8b5cf6";

            ctx.stroke();

            ctx.shadowBlur = 0;
        }
    }


    // ======================================
    // 7. DRAW PARTICLES AND CONNECTIONS
    // ======================================

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];

            // Draw glowing particles.
            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `hsla(${particle.hue}, 100%, 70%, 0.9)`;

            ctx.shadowBlur = 10;

            ctx.shadowColor =
                `hsla(${particle.hue}, 100%, 65%, 0.6)`;

            ctx.fill();

            ctx.shadowBlur = 0;


            // Connect nearby particles.
            for (let j = i + 1; j < particles.length; j++) {
                const other = particles[j];

                const dx = particle.x - other.x;
                const dy = particle.y - other.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                const maxDistance = isMobile() ? 100 : 135;

                if (distance < maxDistance) {
                    const opacity =
                        (1 - distance / maxDistance) * 0.3;

                    ctx.beginPath();

                    ctx.moveTo(
                        particle.x,
                        particle.y
                    );

                    ctx.lineTo(
                        other.x,
                        other.y
                    );

                    ctx.strokeStyle =
                        `rgba(96, 165, 250, ${opacity})`;

                    ctx.lineWidth = 0.7;

                    ctx.stroke();
                }
            }


            // Connect particles to the mouse pointer.
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particle.x - mouse.x;
                const dy = particle.y - mouse.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < mouse.radius) {
                    const opacity =
                        (1 - distance / mouse.radius) * 0.65;

                    ctx.beginPath();

                    ctx.moveTo(
                        particle.x,
                        particle.y
                    );

                    ctx.lineTo(
                        mouse.x,
                        mouse.y
                    );

                    ctx.strokeStyle =
                        `rgba(139, 92, 246, ${opacity})`;

                    ctx.lineWidth = 1;

                    ctx.stroke();
                }
            }
        }

        // Draw shockwaves after the particles.
        drawShockwaves();
    }


    // ======================================
    // 8. ANIMATE PARTICLES
    // ======================================

    function animateParticles(timestamp = 0) {
        if (reduceMotion.matches) {
            drawParticles();
            animationId = null;
            return;
        }

        const delta = lastFrameTime
            ? Math.min(timestamp - lastFrameTime, 32)
            : 16;

        lastFrameTime = timestamp;

        const frameScale = delta / 16.67;

        particles.forEach((particle) => {
            // Move particles.
            particle.x += particle.vx * frameScale;
            particle.y += particle.vy * frameScale;

            // Bounce off screen edges.
            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -1;
            }

            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -1;
            }

            // Gently repel particles from the pointer.
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particle.x - mouse.x;
                const dy = particle.y - mouse.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (
                    distance > 0 &&
                    distance < mouse.radius
                ) {
                    const force =
                        (mouse.radius - distance) / mouse.radius;

                    particle.x +=
                        (dx / distance) * force * 0.6 * frameScale;

                    particle.y +=
                        (dy / distance) * force * 0.6 * frameScale;
                }
            }
        });

        drawParticles();

        animationId = requestAnimationFrame(animateParticles);
    }


    // START ANIMATION IF NOT ALREADY RUNNING
    function startAnimation() {
        if (reduceMotion.matches) {
            drawParticles();
            return;
        }

        if (animationId === null) {
            lastFrameTime = 0;

            animationId = requestAnimationFrame(
                animateParticles
            );
        }
    }


    // ======================================
    // 9. MOUSE AND TOUCH INTERACTION
    // ======================================

    window.addEventListener(
        "pointermove",
        (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        },
        { passive: true }
    );


    // Click or tap anywhere to create a shockwave.
    document.addEventListener("pointerdown", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;

        createShockwave(
            event.clientX,
            event.clientY
        );
    });


    // Clear mouse influence when the pointer leaves.
    document.addEventListener("pointerleave", () => {
        mouse.x = null;
        mouse.y = null;
    });


    // ======================================
    // 10. WINDOW RESIZE AND MOTION SETTINGS
    // ======================================

    window.addEventListener("resize", () => {
        resizeCanvas();

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        startAnimation();
    });


    reduceMotion.addEventListener("change", () => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        lastFrameTime = 0;

        startAnimation();
    });


    // ======================================
    // START THE BACKGROUND
    // ======================================

    resizeCanvas();
    startAnimation();

})();