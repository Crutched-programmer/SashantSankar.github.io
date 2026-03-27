// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Project filtering functionality
// Theme Toggle
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = null;

                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.5s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const revealTargets = [
        '.content',
        '.skill-category',
        '.project-card',
        '.album-card',
        '.contact-card',
        '.contact-message'
    ];

    const revealElements = document.querySelectorAll(revealTargets.join(','));
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
        observer.observe(el);
    });


    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        const parallaxLayers = document.querySelectorAll('[data-parallax]');
        let latestScroll = window.scrollY;
        let ticking = false;

        const updateParallax = () => {
            parallaxLayers.forEach(layer => {
                const speed = Number(layer.dataset.parallax) || 0;
                layer.style.transform = `translate3d(0, ${latestScroll * speed}px, 0)`;
            });
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            latestScroll = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        updateParallax();
    }

    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    if (pointerFine && !prefersReducedMotion) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        if (cursorDot && cursorRing) {
            document.body.classList.add('cursor-active');
            let mouseX = 0;
            let mouseY = 0;
            let ringX = 0;
            let ringY = 0;

            const animateRing = () => {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
                cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
                window.requestAnimationFrame(animateRing);
            };

            window.addEventListener('mousemove', (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            });

            window.addEventListener('mousedown', () => {
                document.body.classList.add('cursor-press');
            });

            window.addEventListener('mouseup', () => {
                document.body.classList.remove('cursor-press');
            });

            animateRing();
        }
    }


// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});
