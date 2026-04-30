document.addEventListener('DOMContentLoaded', () => {
    // ── Premium Smooth Scrolling (Lenis) ──────────────────────
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // ── Dark Mode Toggle ──────────────────────────────────────
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Restore saved preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
        observer.observe(el);
    });

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
                    btn.style.color = '#10b981';
                    contactForm.reset();
                } else {
                    btn.textContent = 'Error! Try Again.';
                    btn.style.color = '#ef4444';
                }
            })
            .catch(error => {
                btn.textContent = 'Error! Try Again.';
                btn.style.color = '#ef4444';
            })
            .then(function() {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 4000);
            });
        });
    }

    // Modal Handling Helper
    function setupModal(triggerId, modalId, closeId) {
        const trigger = document.getElementById(triggerId);
        const modal = document.getElementById(modalId);
        const close = document.getElementById(closeId);

        if (!trigger || !modal || !close) return;

        trigger.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (modalId === 'airModal' && beepInterval) {
                clearInterval(beepInterval);
                beepInterval = null;
            }
        };

        close.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    setupModal('driverDetailsBtn', 'driverModal', 'driverCloseBtn');
    setupModal('airDetailsBtn', 'airModal', 'airCloseBtn');

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

    function playBeep() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
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
            gaugeStatus.textContent = 'Status: Danger';
            alertBox.classList.add('show');
            alertMessage.textContent = `${currentGas} level critical: ${val} PPM`;
            
            if (!beepInterval) {
                playBeep();
                beepInterval = setInterval(playBeep, 1500);
            }
        } else {
            gaugeStatus.textContent = 'Status: Safe';
            alertBox.classList.remove('show');
            
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

    if (gaugeMax) {
        gaugeMax.textContent = '500 PPM';
        updateGaugeDemo(50);
    }
});

