// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 153, 255, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 30px rgba(0, 153, 255, 0.3)';
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Skill bars animation
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Make card visible
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate progress bar
            const progress = entry.target.querySelector('.skill-progress');
            if (progress) {
                const width = progress.style.width;
                progress.style.width = '0';
                setTimeout(() => {
                    progress.style.width = width;
                }, 300);
            }
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

skillCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.5s ease ${index * 0.05}s`;
    skillObserver.observe(card);
});

// Animate about stats
const stats = document.querySelectorAll('.stat');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

stats.forEach(stat => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px) scale(0.9)';
    stat.style.transition = 'all 0.5s ease';
    statsObserver.observe(stat);
});

// Animate project cards
const projectCards = document.querySelectorAll('.project-card');
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 200);
            projectObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    card.style.transition = 'all 0.6s ease';
    projectObserver.observe(card);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Floating elements animation
const floatingElements = document.querySelectorAll('.floating-element');
floatingElements.forEach((element, index) => {
    element.style.animation = `float 3s ease-in-out ${index}s infinite`;
});

// Cursor trail effect (optional - can be removed if too much)
let cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
        cursorTrail.push({x: e.clientX, y: e.clientY});
        
        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
    }
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        
        // Show success message
        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #00d4ff, #00ff88)';
        
        // Reset after 3 seconds
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// Add typing effect to hero title - DISABLED to prevent HTML showing as text
// const heroTitle = document.querySelector('.hero-title');
// if (heroTitle) {
//     const originalText = heroTitle.innerHTML;
//     heroTitle.innerHTML = '';
//     
//     let i = 0;
//     const typeWriter = () => {
//         if (i < originalText.length) {
//             heroTitle.innerHTML += originalText.charAt(i);
//             i++;
//             setTimeout(typeWriter, 50);
//         }
//     };
//     
//     // Start typing after a short delay
//     setTimeout(typeWriter, 500);
// }

// Project cards hover effect - Already handled by CSS and Observer above
// Additional interactive enhancements
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.project-image i');
        if (icon) {
            icon.style.transform = 'scale(1.3) rotate(15deg)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.project-image i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn-primary, .btn-submit').forEach(button => {
    button.addEventListener('click', function(e) {
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
});

// Add CSS animation for ripple
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

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Add number counting animation for experience badge
    const badgeNumber = document.querySelector('.badge-number');
    if (badgeNumber) {
        const target = parseInt(badgeNumber.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                badgeNumber.textContent = target + '+';
                clearInterval(timer);
            } else {
                badgeNumber.textContent = Math.floor(current) + '+';
            }
        }, 30);
    }
});

// Handle viewport resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate any size-dependent features
        console.log('Viewport resized');
    }, 250);
});

// Add custom cursor (optional)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Add cursor styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
        display: none;
    }
    
    @media (min-width: 769px) {
        .custom-cursor {
            display: block;
        }
        body {
            cursor: none;
        }
        a, button {
            cursor: none;
        }
    }
    
    a:hover ~ .custom-cursor,
    button:hover ~ .custom-cursor {
        transform: translate(-50%, -50%) scale(1.5);
        background: rgba(0, 153, 255, 0.2);
    }
`;
document.head.appendChild(cursorStyle);

// Interactive hover letter animations
document.querySelectorAll('.hover-letter').forEach(letter => {
    letter.addEventListener('mouseenter', function() {
        // Add a ripple effect
        this.style.textShadow = '0 0 20px rgba(0, 153, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.6)';
        
        // Animate siblings slightly
        const parent = this.parentElement;
        const siblings = Array.from(parent.childNodes).filter(node => node !== this && node.nodeType === 3);
        siblings.forEach(sibling => {
            if (sibling.nodeValue && sibling.nodeValue.trim()) {
                const span = document.createElement('span');
                span.textContent = sibling.nodeValue;
                span.style.display = 'inline-block';
                span.style.transition = 'all 0.3s ease';
                sibling.parentNode.replaceChild(span, sibling);
            }
        });
    });
    
    letter.addEventListener('mouseleave', function() {
        this.style.textShadow = '';
    });
});

// Add hover effect to about text paragraphs
document.querySelectorAll('.about-text p').forEach(p => {
    p.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
        this.style.color = 'var(--text-primary)';
    });
    p.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
        this.style.color = 'var(--text-secondary)';
    });
    p.style.transition = 'all 0.3s ease';
});

// Add interactive hover to tags
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
    });
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
    tag.style.transition = 'all 0.3s ease';
});

// Contact details animation on hover
document.querySelectorAll('.contact-details').forEach(container => {
    const items = container.querySelectorAll('.contact-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
});

// School video popup player
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalVideoTitle = document.getElementById('modalVideoTitle');
const closeVideoModalBtn = document.getElementById('closeVideoModal');

const openSchoolVideoModal = (videoSrc, titleText) => {
    if (!videoModal || !modalVideo) {
        return;
    }

    modalVideo.src = videoSrc;
    modalVideoTitle.textContent = titleText || 'School Project Video';
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const playPromise = modalVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            // Ignore autoplay restrictions; user can press play manually.
        });
    }
};

modalVideo?.addEventListener('error', () => {
    const src = modalVideo.getAttribute('src');
    if (src) {
        window.open(src, '_blank');
    }
});

const closeSchoolVideoModal = () => {
    if (!videoModal || !modalVideo) {
        return;
    }

    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    document.body.style.overflow = '';
};

document.querySelectorAll('.school-video-card').forEach((card) => {
    const previewVideo = card.querySelector('.project-video');
    const source = previewVideo ? previewVideo.querySelector('source') : null;
    const title = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'School Project Video';
    const videoSrc = source ? source.getAttribute('src') : '';

    if (!videoSrc || !previewVideo) {
        return;
    }

    previewVideo.controls = false;
    previewVideo.addEventListener('click', () => openSchoolVideoModal(videoSrc, title));
    previewVideo.addEventListener('play', (event) => {
        event.preventDefault();
        previewVideo.pause();
        openSchoolVideoModal(videoSrc, title);
    });

    const wrapper = card.querySelector('.video-wrapper');
    if (wrapper) {
        wrapper.addEventListener('click', () => openSchoolVideoModal(videoSrc, title));
    }
});

if (videoModal) {
    videoModal.addEventListener('click', (event) => {
        if (event.target.closest('[data-close-modal="true"]')) {
            closeSchoolVideoModal();
        }
    });
}

if (closeVideoModalBtn) {
    closeVideoModalBtn.addEventListener('click', closeSchoolVideoModal);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && videoModal && videoModal.classList.contains('open')) {
        closeSchoolVideoModal();
    }
});

// Add progress animation on page load
window.addEventListener('scroll', () => {
    const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
});

console.log('Portfolio loaded successfully! 🚀');
