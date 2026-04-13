// ============================================
// Dark Mode Toggle
// ============================================

const initDarkMode = () => {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a small animation to the button
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 400);
    });
};

// ============================================
// Intersection Observer for Scroll Animations
// ============================================

// Observe content sections for fade-in animations
const observeElements = () => {
    const sections = document.querySelectorAll('.content-section');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
};

// ============================================
// Counter Animation for Hero Stats
// ============================================

const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
};

const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas for thousands
        const displayValue = Math.floor(current).toLocaleString();
        element.textContent = target >= 100 ? `${displayValue}` : displayValue;
    }, stepTime);
};

// ============================================
// Truth Meter Animation
// ============================================

const animateTruthMeter = () => {
    const truthMeter = document.querySelector('.truth-meter-fill');
    
    if (!truthMeter) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const truthObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const score = entry.target.dataset.score;
                entry.target.style.setProperty('--score-width', `${score}%`);
                entry.target.classList.add('animate');
                entry.target.classList.add('animated');
                
                // Animate breakdown bars
                setTimeout(() => {
                    animateBreakdownBars();
                }, 500);
            }
        });
    }, observerOptions);
    
    truthObserver.observe(truthMeter);
};

const animateBreakdownBars = () => {
    const breakdownFills = document.querySelectorAll('.breakdown-fill');
    
    breakdownFills.forEach((fill, index) => {
        setTimeout(() => {
            fill.style.width = fill.style.width || '0%';
        }, index * 200);
    });
};

// ============================================
// Bias Spectrum Animation
// ============================================

const animateBiasSpectrum = () => {
    const biasSegments = document.querySelectorAll('.bias-segment');
    
    if (biasSegments.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const biasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                biasSegments.forEach(segment => {
                    if (!segment.classList.contains('animated')) {
                        const width = segment.dataset.width;
                        segment.style.setProperty('--segment-width', `${width}%`);
                        segment.classList.add('animate');
                        segment.classList.add('animated');
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe the first segment
    if (biasSegments.length > 0) {
        biasObserver.observe(biasSegments[0]);
    }
};

// ============================================
// Header Scroll Effect
// ============================================

const handleHeaderScroll = () => {
    const header = document.querySelector('.modern-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
};

// ============================================
// Timeline Animation
// ============================================

const animateTimeline = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, 100);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
};

// ============================================
// Mission Cards Hover Effect
// ============================================

const enhanceMissionCards = () => {
    const cards = document.querySelectorAll('.mission-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.4s ease-out';
        });
    });
};

// ============================================
// Smooth Scroll for Scroll Indicator
// ============================================

const handleScrollIndicator = () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutContainer = document.querySelector('.about-container');
            aboutContainer.scrollIntoView({ behavior: 'smooth' });
        });
        
        scrollIndicator.style.cursor = 'pointer';
    }
};

// ============================================
// Value Cards Animation
// ============================================

const animateValueCards = () => {
    const valueCards = document.querySelectorAll('.value-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const valueObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'all 0.5s ease-out';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                    
                    entry.target.classList.add('animated');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    valueCards.forEach(card => {
        valueObserver.observe(card);
    });
};

// ============================================
// CTA Button Ripple Effect
// ============================================

const addRippleEffect = () => {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }
};

// Add ripple animation to CSS dynamically
const addRippleAnimation = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
};

// ============================================
// Parallax Effect for Hero
// ============================================

const addParallaxEffect = () => {
    const hero = document.querySelector('.hero-banner');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const heroContent = hero.querySelector('.hero-content');
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / heroHeight);
            }
        });
    }
};

// ============================================
// Initialize All Functions on DOM Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode first
    initDarkMode();
    
    // Initialize all animations and interactions
    observeElements();
    animateCounters();
    animateTruthMeter();
    animateBiasSpectrum();
    handleHeaderScroll();
    animateTimeline();
    enhanceMissionCards();
    handleScrollIndicator();
    animateValueCards();
    addRippleEffect();
    addRippleAnimation();
    addParallaxEffect();
    
    // Add loaded class to body for initial animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ============================================
// Performance Optimization
// ============================================

// Debounce function for scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Handle window resize
const handleResize = debounce(() => {
    // Recalculate any position-dependent animations if needed
    console.log('Window resized - animations adjusted');
}, 250);

window.addEventListener('resize', handleResize);