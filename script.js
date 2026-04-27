document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // ── Dark Mode Toggle ──────────────────────────────────────
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Restore saved preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
            // Re-init canvas so colors match the new theme
            initCanvas();
        });
    }

    // ── Techy Particle Canvas Background ──────────────────────
    const canvas = document.getElementById('heroCanvas');
    let animFrame;

    function initCanvas() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const isDark = document.body.classList.contains('dark-mode');

        // Colors based on theme
        const particleColor = isDark ? 'rgba(59,130,246,0.7)' : 'rgba(59,130,246,0.5)';
        const lineColor     = isDark ? 'rgba(139,92,246,0.2)'  : 'rgba(59,130,246,0.12)';
        const bgColor       = isDark ? '#0d1117'                : '#f0f4f8';

        // Size canvas to section
        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Particle setup
        const NUM = Math.min(Math.floor(canvas.width / 12), 90);
        const MAX_DIST = 150;
        const particles = [];

        for (let i = 0; i < NUM; i++) {
            particles.push({
                x:  Math.random() * canvas.width,
                y:  Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                r:  Math.random() * 2 + 1.5,
            });
        }

        // Cancel any previous loop
        if (animFrame) cancelAnimationFrame(animFrame);

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Move & draw particles
            for (let p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            }

            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx   = particles[i].x - particles[j].x;
                    const dy   = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth   = 1 - dist / MAX_DIST;
                        ctx.stroke();
                    }
                }
            }

            animFrame = requestAnimationFrame(draw);
        }

        draw();
    }

    initCanvas();

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animate hamburger lines
        hamburger.classList.toggle('toggle');
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Form submission handling via Web3Forms API
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    btn.textContent = 'Message Sent!';
                    btn.style.background = '#10b981';
                    contactForm.reset();
                } else {
                    console.log(response);
                    btn.textContent = 'Error! Check Key.';
                    btn.style.background = '#ef4444';
                }
            })
            .catch(error => {
                console.log(error);
                btn.textContent = 'Error! Try Again.';
                btn.style.background = '#ef4444';
            })
            .then(function() {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 4000);
            });
        });
    }

    // Premium Driver Drowsiness Modal Logic
    const driverDetailsBtn = document.getElementById('driverDetailsBtn');
    const driverModal = document.getElementById('driverModal');
    const driverCloseBtn = document.querySelector('.driver-close-btn');

    if(driverDetailsBtn && driverModal && driverCloseBtn) {
        driverDetailsBtn.addEventListener('click', () => {
            driverModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        driverCloseBtn.addEventListener('click', () => {
            driverModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        window.addEventListener('click', (e) => {
            if (e.target == driverModal) {
                driverModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ── Air Pollution Modal ──────────────────────────────────
    const airDetailsBtn  = document.getElementById('airDetailsBtn');
    const airModal       = document.getElementById('airModal');
    const airCloseBtn    = document.getElementById('airCloseBtn');

    function openAirModal()  { airModal.style.display = 'block'; document.body.style.overflow = 'hidden'; }
    function closeAirModal() { airModal.style.display = 'none';  document.body.style.overflow = 'auto'; }

    if (airDetailsBtn) airDetailsBtn.addEventListener('click', openAirModal);
    if (airCloseBtn)   airCloseBtn.addEventListener('click', closeAirModal);
    window.addEventListener('click', (e) => { if (e.target === airModal) closeAirModal(); });

    // ── Gas Sensor Live Demo ─────────────────────────────────
    const gasSlider     = document.getElementById('gasSlider');
    const gaugeFill     = document.getElementById('gaugeFill');
    const gaugeThreshold= document.getElementById('gaugeThreshold');
    const gaugePPM      = document.getElementById('gaugePPM');
    const gaugeMax      = document.getElementById('gaugeMax');
    const gaugeStatus   = document.getElementById('gaugeStatus');
    const gaugeGasName  = document.getElementById('gaugeGasName');
    const alertBox      = document.getElementById('alertBox');
    const alertMessage  = document.getElementById('alertMessage');
    const safeBox       = document.getElementById('safeBox');
    const gasBtns       = document.querySelectorAll('.gas-btn');

    const gasNames = {
        'CO':    'CO (Carbon Monoxide)',
        'CO₂':   'CO₂ (Carbon Dioxide)',
        'LPG':   'LPG (Liquefied Petroleum Gas)',
        'Smoke': 'Smoke Particles',
        'NH₃':   'NH₃ (Ammonia)'
    };

    let currentMax       = 500;
    let currentThreshold = 200;
    let currentGas       = 'CO';
    let beepInterval     = null;

    // Beep sound function using Web Audio API
    function playBeep() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    }

    function updateGaugeDemo(val) {
        const pct       = (val / currentMax) * 100;
        const threshPct = (currentThreshold / currentMax) * 100;
        const isDanger  = val >= currentThreshold;

        gaugeFill.style.width            = Math.min(pct, 100) + '%';
        gaugeThreshold.style.left        = threshPct + '%';
        gaugePPM.textContent             = val + ' PPM';

        if (isDanger) {
            gaugeFill.classList.add('danger');
            gaugeStatus.classList.add('danger');
            gaugeStatus.textContent = '🚨 DANGER — Threshold Exceeded!';
            alertBox.classList.add('show');
            safeBox.classList.add('hidden-safe');
            alertMessage.textContent = `⚠ ${currentGas} level: ${val} PPM — Threshold: ${currentThreshold} PPM`;
            
            // Start beeping if not already beeping
            if (!beepInterval) {
                playBeep(); // Play immediately
                beepInterval = setInterval(playBeep, 1500); // Repeat every 1.5s
            }
        } else {
            gaugeFill.classList.remove('danger');
            gaugeStatus.classList.remove('danger');
            gaugeStatus.textContent = '✅ Safe Level';
            alertBox.classList.remove('show');
            safeBox.classList.remove('hidden-safe');
            
            // Stop beeping
            if (beepInterval) {
                clearInterval(beepInterval);
                beepInterval = null;
            }
        }
    }

    if (gasSlider) {
        gasSlider.addEventListener('input', () => {
            updateGaugeDemo(parseInt(gasSlider.value));
        });
    }

    gasBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gasBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentGas       = btn.dataset.gas;
            currentThreshold = parseInt(btn.dataset.threshold);
            currentMax       = parseInt(btn.dataset.max);

            gasSlider.max   = currentMax;
            gasSlider.value = Math.min(parseInt(gasSlider.value), currentMax);
            gaugeMax.textContent    = currentMax + ' PPM';
            gaugeGasName.textContent = gasNames[currentGas] || currentGas;

            updateGaugeDemo(parseInt(gasSlider.value));
        });
    });

    // Initialise demo state
    if (gaugeMax) {
        gaugeMax.textContent = '500 PPM';
        updateGaugeDemo(50);
    }

});
