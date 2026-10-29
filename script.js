/**
 * Mubarik - Personal Bio & Portfolio
 * Core JavaScript: Interactive Features, Dark / Light Mode, UI & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initDynamicGreeting();
    initTypewriter();
    initThemeSwitcher();
    initScrollSpy();
    initSkillFilters();
    initContactForm();
    initBackToTop();
    initCardSpotlight();
    initAvatarEasterEgg();
    initDynamicYear();
});

/* ==========================================================================
   1. Dynamic Greeting Based on Local Time
   ========================================================================== */
function initDynamicGreeting() {
    const greetingEl = document.getElementById('greeting-pill');
    if (!greetingEl) return;

    const currentHour = new Date().getHours();
    let greeting = 'Hello';
    let icon = '👋';

    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Good morning';
        icon = '☀️';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Good afternoon';
        icon = '🌤️';
    } else if (currentHour >= 18 && currentHour < 22) {
        greeting = 'Good evening';
        icon = '🌆';
    } else {
        greeting = 'Night owl hours';
        icon = '🌙';
    }

    greetingEl.innerHTML = `<span class="greeting-icon">${icon}</span> ${greeting}, welcome to my space!`;
}

/* ==========================================================================
   2. Typing Effect for Profile Role / Headline
   ========================================================================== */
function initTypewriter() {
    const textTarget = document.getElementById('typed-text');
    if (!textTarget) return;

    const roles = [
        'Aspiring Web Developer',
        'Frontend Enthusiast',
        'UI / UX Explorer',
        'JavaScript & Modern CSS Lover',
        'Open Source Learner'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseBeforeDelete = 1800;
    const pauseBeforeNext = 500;

    function typeLoop() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            textTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = pauseBeforeDelete;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = pauseBeforeNext;
        }

        setTimeout(typeLoop, delay);
    }

    typeLoop();
}

/* ==========================================================================
   3. Dark Mode & Light Mode Theme Switcher with Persistence
   ========================================================================== */
function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // Detect saved theme or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    // Determine initial theme: saved choice > system preference > default to dark
    let currentTheme = savedTheme || (prefersLight ? 'light' : 'dark');
    applyTheme(currentTheme, false);

    function applyTheme(theme, showNotification = true) {
        const isLight = theme === 'light';
        const activeTheme = isLight ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', activeTheme);
        localStorage.setItem('portfolio-theme', activeTheme);

        const iconSpan = themeBtn.querySelector('.theme-icon');
        const labelSpan = themeBtn.querySelector('.theme-label');

        if (isLight) {

            if (labelSpan) labelSpan.textContent = 'Light';
            themeBtn.setAttribute('title', 'Switch to Dark Mode ');
            themeBtn.setAttribute('aria-label', 'Current theme: Light Mode. Click to switch to Dark Mode.');
        } else {

            if (labelSpan) labelSpan.textContent = 'Dark';
            themeBtn.setAttribute('title', 'Switch to Light Mode ');
            themeBtn.setAttribute('aria-label', 'Current theme: Dark Mode. Click to switch to Light Mode.');
        }

        if (showNotification) {
            showToast(`Switched to ${isLight ? 'Light Mode' : 'Dark Mode'}!`, 'info', 2200);
        }
    }

    themeBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = activeTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme, true);
    });

    // Listen for OS scheme change if user hasn't explicitly set preference
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                applyTheme(e.matches ? 'light' : 'dark', false);
            }
        });
    }
}

/* ==========================================================================
   4. ScrollSpy & Smooth Section Navigation
   ========================================================================== */
function initScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-menu .nav-btn');
    const sections = document.querySelectorAll('.bio-section[id], header[id]');

    if (!navLinks.length || !sections.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Smooth navigation click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

/* ==========================================================================
   5. Interactive Skills Filter & Tag Interactions
   ========================================================================== */
function initSkillFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillTags = document.querySelectorAll('.skills-grid .skill-tag');

    if (!filterButtons.length || !skillTags.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filterValue = btn.getAttribute('data-filter');

            skillTags.forEach(tag => {
                const category = tag.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    tag.classList.remove('hidden');
                    tag.style.opacity = '1';
                    tag.style.transform = 'scale(1)';
                } else {
                    tag.style.opacity = '0';
                    tag.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        tag.classList.add('hidden');
                    }, 200);
                }
            });
        });
    });

    // Click on individual skill for interactive feedback
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skillName = tag.textContent.trim();
            tag.classList.add('skill-pulse');
            setTimeout(() => tag.classList.remove('skill-pulse'), 400);
            showToast(`Tech skill: ${skillName}`, 'info', 1600);
        });
    });
}

/* ==========================================================================
   6. Contact Form Validation, Character Counter & Toast Notification
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('char-count');
    const submitBtn = document.getElementById('submit-btn');

    // Live character counter
    if (messageInput && charCounter) {
        const maxLength = messageInput.getAttribute('maxlength') || 500;
        messageInput.addEventListener('input', () => {
            const currentLength = messageInput.value.length;
            charCounter.textContent = currentLength;
            if (currentLength >= maxLength * 0.9) {
                charCounter.classList.add('warning');
            } else {
                charCounter.classList.remove('warning');
            }
        });
    }

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageVal = messageInput ? messageInput.value.trim() : '';

        const name = nameInput ? nameInput.value.trim() : 'Friend';
        const email = emailInput ? emailInput.value.trim() : '';

        // Basic validation
        if (!name || !email || !messageVal) {
            showToast('Please fill out all required fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            emailInput.focus();
            return;
        }

        // Loading state
        const originalContent = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="btn-spinner"></span>
                <span>Sending...</span>
            `;
        }

        // Simulate network delay for real-world feel
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            }

            form.reset();
            if (charCounter) charCounter.textContent = '0';

            // Celebration confetti burst!
            triggerConfetti();

            // Success notification toast
            showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success', 5000);
        }, 850);
    });
}

/* ==========================================================================
   7. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-body">
            <p class="toast-message">${escapeHtml(message)}</p>
        </div>
        <button class="toast-close" aria-label="Close notification">&times;</button>
        <div class="toast-progress"></div>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    container.appendChild(toast);

    // Auto dismiss
    const timeout = setTimeout(() => {
        removeToast(toast);
    }, duration);

    toast.addEventListener('mouseenter', () => clearTimeout(timeout));
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => removeToast(toast), 1500);
    });
}

function removeToast(toast) {
    if (!toast) return;
    toast.classList.add('toast-exit');
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ==========================================================================
   8. Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   9. Mouse Spotlight Tracking on Bio Card
   ========================================================================== */
function initCardSpotlight() {
    const card = document.querySelector('.bio-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
}

/* ==========================================================================
   10. Avatar Easter Egg (Interactive Click Greeting & Sparkles)
   ========================================================================== */
function initAvatarEasterEgg() {
    const avatar = document.querySelector('.avatar-wrapper img');
    if (!avatar) return;

    avatar.style.cursor = 'pointer';
    avatar.setAttribute('title', 'Click me for a surprise!');

    avatar.addEventListener('click', () => {
        avatar.classList.add('avatar-spin');
        triggerConfetti(60);
        showToast("Hello there! Thanks for checking out Mubarik's bio! 🚀", 'success', 3000);
        setTimeout(() => avatar.classList.remove('avatar-spin'), 650);
    });
}

/* ==========================================================================
   11. Dynamic Year in Footer
   ========================================================================== */
function initDynamicYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* ==========================================================================
   12. Lightweight Vanilla Confetti Generator (Zero Dependencies)
   ========================================================================== */
function triggerConfetti(count = 70) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#1e40af', '#1e3a8a', '#3b82f6', '#0f172a', '#ffffff', '#4ade80'];
    const particles = [];

    for (let i = 0; i < count; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 - 50,
            radius: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 18,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }

    let animationFrameId;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.45; // gravity
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.015;

            if (p.opacity > 0) {
                activeParticles++;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
                ctx.restore();
            }
        });

        if (activeParticles > 0) {
            animationFrameId = requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrameId);
        }
    }

    render();
}
