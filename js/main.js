/* ============================================================
   RIJOE CHACKO MATHEW — PORTFOLIO MAIN JS
   Vanta.js, GSAP, Typed.js, AOS, Vanilla Tilt, magnetic hover
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ---- Initialize AOS ---- */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic',
        });
    }

    /* ---- Vanta.js NET background ---- */
    let vantaEffect = null;

    const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

    function initVanta(isLight) {
        if (typeof VANTA === 'undefined') return;
        try {
            if (vantaEffect) {
                vantaEffect.destroy();
                vantaEffect = null;
            }
            vantaEffect = VANTA.NET({
                el: '#vanta-bg',
                mouseControls: !isMobile,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: isLight ? 0x93c5fd : 0x00d4ff,
                backgroundColor: isLight ? 0xf0f4f8 : 0x0a0a0f,
                points: isMobile ? 6.0 : (isLight ? 8.0 : 10.0),
                maxDistance: isMobile ? 18.0 : (isLight ? 20.0 : 22.0),
                spacing: isMobile ? 20.0 : 18.0,
                showDots: true,
            });
        } catch (e) {
            // Vanta failed (e.g. no WebGL) — CSS gradient fallback is already in place
        }
    }

    initVanta(localStorage.getItem('portfolio_theme') === 'light');

    /* ---- Typed.js ---- */
    if (typeof Typed !== 'undefined') {
        new Typed('#typed', {
            strings: [
                'Full Stack Developer',
                'Database Specialist',
                'Python & Django Developer',
                'Software Engineer',
                'Cloud Enthusiast',
                'Problem Solver',
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1500,
            loop: true,
            smartBackspace: false,
        });
    }

    /* ---- Vanilla Tilt on skill cards (skip on touch devices) ---- */
    if (typeof VanillaTilt !== 'undefined' && !isMobile) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        if (tiltCards.length) {
            VanillaTilt.init(Array.from(tiltCards), {
                max: 12,
                speed: 400,
                glare: true,
                'max-glare': 0.15,
                scale: 1.02,
            });
        }
    }

    /* ---- GSAP + ScrollTrigger ---- */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        /* Navbar scroll effect */
        const navbar = document.getElementById('navbar');
        ScrollTrigger.create({
            start: 'top -80',
            onUpdate: (self) => {
                if (self.progress > 0) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            },
        });

        /* Stat counter animation */
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target'), 10) || 0;
            gsap.fromTo(
                el,
                { textContent: 0 },
                {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        /* Skill ring SVG animation */
        const rings = document.querySelectorAll('.ring-fill');
        const circumference = 2 * Math.PI * 52; // r=52

        rings.forEach((ring) => {
            const percent = parseInt(ring.getAttribute('data-percent'), 10) || 0;
            const offset = circumference - (percent / 100) * circumference;

            // Set gradient on each ring via inline style
            ring.style.stroke = 'url(#ringGradient)';

            gsap.fromTo(
                ring,
                { strokeDashoffset: circumference },
                {
                    strokeDashoffset: offset,
                    duration: 1.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: ring.closest('.skill-card'),
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        /* Project cards stagger - Disabled temporarily to fix invisibility issue */
        /*
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        });
        */

        /* Timeline items */
        gsap.utils.toArray('.timeline-item').forEach((item) => {
            const isLeft = item.classList.contains('left');
            gsap.from(item.querySelector('.timeline-content'), {
                x: isLeft ? -80 : 80,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });
        });

        /* Contact social icons stagger */
        gsap.from('.social-icon', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            clearProps: 'all',
            scrollTrigger: {
                trigger: '.social-icons',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    }

    /* ---- SVG Gradient Definition (injected for skill rings) ---- */
    const svgNS = 'http://www.w3.org/2000/svg';
    const skillRings = document.querySelectorAll('.skill-ring');

    function updateRingGradients() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const color1 = isLight ? '#0284c7' : '#00d4ff';
        const color2 = isLight ? '#6366f1' : '#7b2ff7';
        skillRings.forEach((svg) => {
            const stops = svg.querySelectorAll('#ringGradient stop');
            if (stops.length === 2) {
                stops[0].setAttribute('stop-color', color1);
                stops[1].setAttribute('stop-color', color2);
            }
        });
    }

    skillRings.forEach((svg) => {
        const defs = document.createElementNS(svgNS, 'defs');
        const grad = document.createElementNS(svgNS, 'linearGradient');
        grad.setAttribute('id', 'ringGradient');
        grad.setAttribute('x1', '0%');
        grad.setAttribute('y1', '0%');
        grad.setAttribute('x2', '100%');
        grad.setAttribute('y2', '100%');

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const stop1 = document.createElementNS(svgNS, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', isLight ? '#0284c7' : '#00d4ff');

        const stop2 = document.createElementNS(svgNS, 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', isLight ? '#6366f1' : '#7b2ff7');

        grad.appendChild(stop1);
        grad.appendChild(stop2);
        defs.appendChild(grad);
        svg.insertBefore(defs, svg.firstChild);
    });

    /* ---- Smooth Scrolling for nav links ---- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ---- Active nav link on scroll ---- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

    /* ---- Hamburger / Mobile Menu ---- */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close mobile menu on link click
        document.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---- Back To Top ---- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener(
            'scroll',
            () => {
                if (window.scrollY > 400) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            },
            { passive: true }
        );

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---- Magnetic Hover on Social Icons (skip on touch) ---- */
    if (!isMobile) {
        const magneticIcons = document.querySelectorAll('.magnetic');
        magneticIcons.forEach((icon) => {
            icon.addEventListener('mousemove', (e) => {
                const rect = icon.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                icon.style.transition = 'transform 0.1s ease';
                icon.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.1)`;
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.transition = 'transform 0.4s ease';
                icon.style.transform = '';
            });
        });
    }

    /* ---- Parallax on scroll for subtle depth ---- */
    if (!isMobile) {
        window.addEventListener(
            'scroll',
            () => {
                const scrolled = window.scrollY;
                const heroContent = document.querySelector('.hero-content');
                if (heroContent && scrolled < window.innerHeight) {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroContent.style.opacity = 1 - scrolled / window.innerHeight;
                }
            },
            { passive: true }
        );
    }

    /* ---- Dark / Light Theme Toggle ---- */
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const savedTheme = localStorage.getItem('portfolio_theme');

    function applyTheme(isLight) {
        if (isLight) {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.removeAttribute('data-theme');
        }
        [themeIcon, mobileThemeIcon].forEach((icon) => {
            if (!icon) return;
            icon.classList.remove('fa-sun', 'fa-moon');
            icon.classList.add(isLight ? 'fa-sun' : 'fa-moon');
        });
    }

    // Apply saved theme on load
    if (savedTheme === 'light') {
        applyTheme(true);
    }

    function toggleTheme() {
        const currentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
        const goLight = !currentlyLight;
        localStorage.setItem('portfolio_theme', goLight ? 'light' : 'dark');
        applyTheme(goLight);
        initVanta(goLight);
        updateRingGradients();
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
});
