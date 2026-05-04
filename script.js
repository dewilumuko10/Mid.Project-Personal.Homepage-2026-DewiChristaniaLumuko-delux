'use strict';

/* ============================================
   1. LOADING SCREEN
============================================ */
window.addEventListener('load', function() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});


/* ============================================
   2. SMOOTH SCROLL WITH PROGRESS INDICATOR
============================================ */
// Progress bar saat scroll
function updateScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;
    
    progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// Smooth scroll untuk semua anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});


/* ============================================
   3. NAVBAR SCROLL EFFECTS
============================================ */
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;
let ticking = false;

function handleNavbarScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(255, 105, 180, 0.15)';
        navbar.style.backgroundColor = 'rgba(255, 240, 245, 0.98)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.backgroundColor = 'rgba(255, 240, 245, 0.95)';
    }
    
    // Hide navbar on scroll down, show on scroll up
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(handleNavbarScroll);
        ticking = true;
    }
});


/* ============================================
   4. SCROLL REVEAL ANIMATIONS
============================================ */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Stagger animation untuk children
            const children = entry.target.querySelectorAll('.stagger-item');
            children.forEach(function(child, index) {
                setTimeout(function() {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.fade-in, .slide-up, .zoom-in').forEach(function(el) {
    observer.observe(el);
});


/* ============================================
   5. TYPING ANIMATION (Homepage Hero)
============================================ */
function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

const heroTitle = document.querySelector('.hero-content h1');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.style.opacity = '1';
    
    setTimeout(function() {
        typeWriter(heroTitle, originalText, 80);
    }, 500);
}


/* ============================================
   6. INTERACTIVE MUSIC PLAYER (Homepage)
============================================ */
const audioPlayer = document.querySelector('.listening-card audio');
const musicDisc = document.querySelector('.music-visual');

if (audioPlayer && musicDisc) {
    audioPlayer.addEventListener('play', function() {
        musicDisc.style.animationPlayState = 'running';
        musicDisc.style.transform = 'scale(1.05)';
    });
    
    audioPlayer.addEventListener('pause', function() {
        musicDisc.style.animationPlayState = 'paused';
        musicDisc.style.transform = 'scale(1)';
    });
    
    audioPlayer.addEventListener('ended', function() {
        musicDisc.style.animationPlayState = 'paused';
        musicDisc.style.transform = 'scale(1)';
    });
}


/* ============================================
   7. DETAILS/ACCORDION SMOOTH ANIMATION (Homepage)
============================================ */
const detailsElements = document.querySelectorAll('details.favorite-card');

detailsElements.forEach(function(details) {
    const content = details.querySelector('.favorite-content');
    
    details.addEventListener('toggle', function() {
        if (details.open) {
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            
            const height = content.scrollHeight;
            content.style.maxHeight = height + 'px';
            
            setTimeout(function() {
                content.style.maxHeight = 'none';
                content.style.overflow = 'visible';
            }, 300);
            
            // Add sparkle effect
            createSparkles(details);
        }
    });
});


/* ============================================
   8. SPARKLE/CONFETTI EFFECT
============================================ */
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + window.scrollY) + 'px';
        sparkle.textContent = '✨';
        
        document.body.appendChild(sparkle);
        
        setTimeout(function() {
            sparkle.remove();
        }, 1000);
    }
}


/* ============================================
   9. GALLERY - ENHANCED LIGHTBOX
============================================ */
if (document.querySelector('.lightbox-overlay')) {
    let lightboxImages = [];
    let currentLightboxIndex = 0;
    let autoPlayInterval = null;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    // Collect all images
    function collectImages() {
        lightboxImages = [];
        
        // Photo cards
        document.querySelectorAll('.photo-card .photo-wrapper img').forEach(function(img) {
            const caption = img.closest('.photo-card').querySelector('.photo-caption p');
            lightboxImages.push({
                src: img.src,
                alt: img.alt,
                caption: caption ? caption.textContent : ''
            });
        });
        
        // Polaroids
        document.querySelectorAll('.polaroid .polaroid-img img').forEach(function(img) {
            lightboxImages.push({
                src: img.src,
                alt: img.alt,
                caption: ''
            });
        });
    }
    
    function openLightbox(index) {
        collectImages();
        currentLightboxIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Preload next and previous images
        preloadAdjacentImages();
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        stopAutoPlay();
    }
    
    function updateLightboxImage() {
        const img = lightboxImages[currentLightboxIndex];
        
        // Fade out
        lightboxImg.style.opacity = '0';
        
        setTimeout(function() {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            
            if (img.caption) {
                lightboxCaption.textContent = img.caption;
                lightboxCaption.style.display = 'block';
            } else {
                lightboxCaption.style.display = 'none';
            }
            
            if (lightboxCounter) {
                lightboxCounter.textContent = (currentLightboxIndex + 1) + ' / ' + lightboxImages.length;
            }
            
            // Fade in
            lightboxImg.style.opacity = '1';
        }, 200);
    }
    
    function showPrevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        updateLightboxImage();
        preloadAdjacentImages();
    }
    
    function showNextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        updateLightboxImage();
        preloadAdjacentImages();
    }
    
    function preloadAdjacentImages() {
        const nextIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        const prevIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        
        const preloadNext = new Image();
        const preloadPrev = new Image();
        
        preloadNext.src = lightboxImages[nextIndex].src;
        preloadPrev.src = lightboxImages[prevIndex].src;
    }
    
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(showNextImage, 3000);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Event listeners for gallery images
    document.querySelectorAll('.photo-card .photo-wrapper img, .polaroid .polaroid-img img').forEach(function(img, index) {
        img.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            showPrevImage();
            stopAutoPlay();
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextImage();
            stopAutoPlay();
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                stopAutoPlay();
                break;
            case 'ArrowRight':
                showNextImage();
                stopAutoPlay();
                break;
            case ' ':
                e.preventDefault();
                if (autoPlayInterval) {
                    stopAutoPlay();
                } else {
                    startAutoPlay();
                }
                break;
        }
    });
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (lightbox) {
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            showNextImage();
        }
        if (touchEndX > touchStartX + 50) {
            showPrevImage();
        }
    }
}


/* ============================================
   10. SCROLL TO TOP BUTTON
============================================ */
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add bounce effect
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
}


/* ============================================
   11. BLOG - ARTICLE MODAL
============================================ */
function openArticle(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add reading progress bar
    createReadingProgress(overlay);
    
    // Track reading time
    startReadingTimer(overlay);
}

function closeArticle(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove reading progress
    const progressBar = overlay.querySelector('.reading-progress');
    if (progressBar) {
        progressBar.remove();
    }
}

function createReadingProgress(overlay) {
    const existingProgress = overlay.querySelector('.reading-progress');
    if (existingProgress) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    
    const modal = overlay.querySelector('.article-modal');
    if (modal) {
        modal.insertBefore(progressBar, modal.firstChild);
    }
    
    // Update progress on scroll
    overlay.addEventListener('scroll', function() {
        updateReadingProgress(overlay);
    });
}

function updateReadingProgress(overlay) {
    const scrollTop = overlay.scrollTop;
    const scrollHeight = overlay.scrollHeight - overlay.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    const bar = overlay.querySelector('.reading-progress-bar');
    if (bar) {
        bar.style.width = progress + '%';
    }
}

function startReadingTimer(overlay) {
    const startTime = Date.now();
    
    overlay.addEventListener('scroll', function checkReading() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        
        if (elapsed > 30) { // Read for 30+ seconds
            // Show appreciation message
            showAppreciationMessage(overlay);
            overlay.removeEventListener('scroll', checkReading);
        }
    });
}

function showAppreciationMessage(overlay) {
    const message = document.createElement('div');
    message.className = 'appreciation-toast';
    message.innerHTML = 'Thank you for reading!';
    
    document.body.appendChild(message);
    
    setTimeout(function() {
        message.classList.add('show');
    }, 100);
    
    setTimeout(function() {
        message.classList.remove('show');
        setTimeout(function() {
            message.remove();
        }, 300);
    }, 3000);
}

// Close article overlays
document.querySelectorAll('.article-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            const id = this.getAttribute('id');
            closeArticle(id);
        }
    });
});

// Keyboard close
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.article-overlay.active').forEach(function(overlay) {
            const id = overlay.getAttribute('id');
            closeArticle(id);
        });
    }
});


/* ============================================
   12. BLOG - VIDEO PLAYER ENHANCEMENTS
============================================ */
const videoElement = document.querySelector('.video-wrapper video');

if (videoElement) {
    // Add custom controls visualization
    videoElement.addEventListener('play', function() {
        this.closest('.video-wrapper').classList.add('playing');
    });
    
    videoElement.addEventListener('pause', function() {
        this.closest('.video-wrapper').classList.remove('playing');
    });
    
    videoElement.addEventListener('ended', function() {
        this.closest('.video-wrapper').classList.remove('playing');
        showVideoEndMessage();
    });
    
    // Time update
    videoElement.addEventListener('timeupdate', function() {
        const percent = (this.currentTime / this.duration) * 100;
        // Could add a custom progress bar here
    });
}

function showVideoEndMessage() {
    const message = document.createElement('div');
    message.className = 'video-end-message';
    message.innerHTML = '🎬 Thanks for watching!';
    
    document.body.appendChild(message);
    
    setTimeout(function() {
        message.classList.add('show');
    }, 100);
    
    setTimeout(function() {
        message.classList.remove('show');
        setTimeout(function() {
            message.remove();
        }, 300);
    }, 2500);
}


/* ============================================
   13. CONTACT - COPY TO CLIPBOARD
============================================ */
const emailCard = document.querySelector('a[href^="mailto:"]');

if (emailCard) {
    const emailText = emailCard.querySelector('.card-info p');
    
    // Add copy icon
    const copyIcon = document.createElement('span');
    copyIcon.className = 'copy-icon';
    copyIcon.innerHTML = '📋';
    copyIcon.title = 'Click to copy email';
    
    if (emailText) {
        emailText.style.position = 'relative';
        emailText.style.display = 'inline-flex';
        emailText.style.alignItems = 'center';
        emailText.style.gap = '8px';
        
        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'copy-icon-wrapper';
        iconWrapper.appendChild(copyIcon);
        emailText.appendChild(iconWrapper);
        
        copyIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const email = emailText.textContent.trim().replace('📋', '');
            
            navigator.clipboard.writeText(email).then(function() {
                showCopySuccess(copyIcon);
            }).catch(function(err) {
                console.error('Copy failed:', err);
            });
        });
    }
}

function showCopySuccess(element) {
    const originalText = element.innerHTML;
    element.innerHTML = '✓';
    element.style.color = '#4CAF50';
    
    setTimeout(function() {
        element.innerHTML = originalText;
        element.style.color = '';
    }, 2000);
    
    // Show toast
    showToast('Email copied to clipboard! 📧');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}


/* ============================================
   14. CONTACT - CARD RIPPLE EFFECT
============================================ */
document.querySelectorAll('.contact-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(function() {
            ripple.remove();
        }, 600);
    });
});


/* ============================================
   15. PARTICLE CURSOR EFFECT - AESTHETIC
============================================ */
let cursorParticles = [];
let cursorX = 0;
let cursorY = 0;
let lastParticleTime = 0;

document.addEventListener('mousemove', function(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    const now = Date.now();
    
    // Create particle occasionally with throttle
    if (Math.random() < 0.15 && (now - lastParticleTime) > 100) {
        createCursorParticle(cursorX, cursorY);
        lastParticleTime = now;
    }
});

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = x + 'px';
    particle.style.top = (y + window.scrollY) + 'px';
    
    // Aesthetic symbols collection
    const aestheticSymbols = [
        // Sparkles & Stars
        '✦', '✧', '⋆', '˚', '･', '｡', '°', '✩', '✫', '✬',
        
        // Hearts & Love
        '♡', '❤', '𖥔', '୨୧', '༘',
        
        // Nature & Flowers
        '✿', '❀', '✾', '❁', '໒', '꒰', '꒱',
        
        // Minimal Shapes
        '◌', '○', '◯', '⭒', '⊹', '⋆', '˖',
        
        // Special Characters
        '᭄', 'ꕤ', '◟', '◞', '⌗', '⟡', '˙',
        
        // Aesthetic Combinations
        '‧₊˚', '⊱', '⊰', '༉', '✧˖'
    ];
    
    // Random symbol selection
    const randomSymbol = aestheticSymbols[Math.floor(Math.random() * aestheticSymbols.length)];
    particle.textContent = randomSymbol;
    
    // Random color from aesthetic palette
    const aestheticColors = [
        '#FFB6C1', // Light Pink
        '#FF69B4', // Hot Pink
        '#FFE4E1', // Misty Rose
        '#FFC0CB', // Pink
        '#FFD0E8', // Soft Pink
        '#E6B8D7', // Lavender Pink
        '#F8BBD0', // Rose Pink
        '#FADBD8', // Pale Pink
        '#D8BFD8', // Thistle
        '#DDA0DD'  // Plum
    ];
    
    const randomColor = aestheticColors[Math.floor(Math.random() * aestheticColors.length)];
    particle.style.color = randomColor;
    
    // Random size variation
    const randomSize = 0.8 + Math.random() * 0.6; // 0.8 to 1.4
    particle.style.fontSize = randomSize + 'rem';
    
    // Random direction
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = -30 - Math.random() * 40;
    particle.style.setProperty('--random-x', randomX);
    particle.style.setProperty('--random-y', randomY);
    
    // Random rotation
    const randomRotation = Math.random() * 720 - 360;
    particle.style.setProperty('--rotation', randomRotation + 'deg');
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(function() {
        particle.remove();
    }, 1200);
}

// Alternative: Page-specific particle themes
function getPageSpecificSymbols() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const pageThemes = {
        'index.html': ['♡', '✧', '⋆', '˚', '✦', '°', '･'],
        'gallery.html': ['✿', '❀', '✾', '◌', '○', '⭒'],
        'blog.html': ['✎', '✐', '✑', '✒', '⊹', '˙'],
        'contact.html': ['♡', '❤', '୨୧', '༘', '𖥔']
    };
    
    return pageThemes[currentPage] || pageThemes['index.html'];
}

// Enhanced version with page-specific themes
function createCursorParticleThemed(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = x + 'px';
    particle.style.top = (y + window.scrollY) + 'px';
    
    const symbols = getPageSpecificSymbols();
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    particle.textContent = randomSymbol;
    
    const aestheticColors = ['#FFB6C1', '#FF69B4', '#FFE4E1', '#FFC0CB', '#FFD0E8'];
    const randomColor = aestheticColors[Math.floor(Math.random() * aestheticColors.length)];
    particle.style.color = randomColor;
    
    const randomSize = 0.8 + Math.random() * 0.6;
    particle.style.fontSize = randomSize + 'rem';
    
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = -30 - Math.random() * 40;
    particle.style.setProperty('--random-x', randomX);
    particle.style.setProperty('--random-y', randomY);
    
    const randomRotation = Math.random() * 720 - 360;
    particle.style.setProperty('--rotation', randomRotation + 'deg');
    
    document.body.appendChild(particle);
    
    setTimeout(function() {
        particle.remove();
    }, 1200);
}

// Disable on mobile devices for performance
if (window.matchMedia('(pointer: coarse)').matches) {
    // Mobile device detected, skip particle effect
} else {
    // Desktop - enable particle effect
    document.addEventListener('mousemove', function(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        const now = Date.now();
        
        if (Math.random() < 0.15 && (now - lastParticleTime) > 100) {
            createCursorParticle(cursorX, cursorY);
            lastParticleTime = now;
        }
    });
}

/* ============================================
   16. EASTER EGG - KONAMI CODE
============================================ */
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Create confetti explosion
    for (let i = 0; i < 50; i++) {
        setTimeout(function() {
            createConfetti();
        }, i * 30);
    }
    
    showToast('🎉 You found the secret! 🎉');
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = getRandomColor();
    
    document.body.appendChild(confetti);
    
    setTimeout(function() {
        confetti.remove();
    }, 3000);
}

function getRandomColor() {
    const colors = ['#FF69B4', '#FFE4E1', '#FFF0F5', '#FF1493', '#FFB6C1'];
    return colors[Math.floor(Math.random() * colors.length)];
}


/* ============================================
   17. DARK MODE TOGGLE
============================================ */
function createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'dark-mode-toggle';
    toggle.className = 'dark-mode-toggle';
    toggle.innerHTML = '🌙';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    
    document.body.appendChild(toggle);
    
    // Check saved preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '☀️';
    }
    
    toggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            this.innerHTML = '☀️';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            this.innerHTML = '🌙';
            localStorage.setItem('darkMode', 'disabled');
        }
        
        // Animate toggle
        this.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    });
}

// Initialize dark mode toggle
createDarkModeToggle();


/* ============================================
   18. LAZY LOADING IMAGES
============================================ */
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Trigger loading
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(function(img) {
        imageObserver.observe(img);
    });
}


/* ============================================
   19. PERFORMANCE OPTIMIZATION
============================================ */
// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// Use throttle for scroll events
const throttledScroll = throttle(function() {
    updateScrollProgress();
}, 100);

window.addEventListener('scroll', throttledScroll);


/* ============================================
   20. ACCESSIBILITY ENHANCEMENTS
============================================ */
// Focus trap for modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

// Apply focus trap to modals
document.querySelectorAll('.article-overlay, .lightbox-overlay').forEach(function(modal) {
    modal.addEventListener('transitionend', function() {
        if (this.classList.contains('active')) {
            trapFocus(this);
        }
    });
});


/* ============================================
   21. PERFORMANCE MONITORING
============================================ */
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver(function(list) {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}


/* ============================================
   22. SERVICE WORKER REGISTRATION (Optional)
============================================ */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registered:', registration);
        //     })
        //     .catch(function(error) {
        //         console.log('ServiceWorker registration failed:', error);
        //     });
    });
}


/* ============================================
    CONSOLE EASTER EGG
============================================ */
console.log('%c💖 Welcome to Delux! 💖', 'color: #FF69B4; font-size: 24px; font-weight: bold;');
console.log('%cMade with love by Dewi Christania Lumuko', 'color: #888; font-size: 14px;');
console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #FF69B4; font-size: 12px;');

/* ============================================
   FAVORITES SECTION - ENHANCED INTERACTIONS (FIXED)
============================================ */

// Enhanced Details/Accordion Animation
const favoriteCards = document.querySelectorAll('details.favorite-card');
let isAnimating = false;

favoriteCards.forEach(function(card) {
    const content = card.querySelector('.favorite-content');
    
    card.addEventListener('toggle', function(e) {
        // Prevent rapid toggling
        if (isAnimating) {
            e.preventDefault();
            return;
        }
        
        if (card.open) {
            isAnimating = true;
            
            // Close other cards FIRST before opening this one
            closeOtherFavorites(card);
            
            // Small delay to ensure other cards are closed
            setTimeout(function() {
                // Smooth expand animation
                content.style.maxHeight = '0';
                content.style.overflow = 'hidden';
                
                const height = content.scrollHeight;
                requestAnimationFrame(function() {
                    content.style.maxHeight = height + 'px';
                });
                
                setTimeout(function() {
                    content.style.maxHeight = 'none';
                    content.style.overflow = 'visible';
                    isAnimating = false;
                }, 400);
                
                // Add sparkle effect
                createSparkleEffect(card);
                
                // Play sound effect (optional)
                // playOpenSound();
                
                // Scroll into view if needed
                setTimeout(function() {
                    const rect = card.getBoundingClientRect();
                    const isOutOfView = rect.bottom > window.innerHeight || rect.top < 100;
                    
                    if (isOutOfView) {
                        card.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest',
                            inline: 'nearest'
                        });
                    }
                }, 100);
                
                // Track interaction
                trackFavoritesInteraction(card);
                
            }, 50);
            
        } else {
            isAnimating = true;
            
            // Smooth collapse animation
            const height = content.scrollHeight;
            content.style.maxHeight = height + 'px';
            content.style.overflow = 'hidden';
            
            requestAnimationFrame(function() {
                content.style.maxHeight = '0';
            });
            
            setTimeout(function() {
                isAnimating = false;
            }, 400);
        }
    });
    
    // Prevent default toggle behavior to have full control
    const summary = card.querySelector('summary');
    summary.addEventListener('click', function(e) {
        if (isAnimating) {
            e.preventDefault();
            return false;
        }
    });
    
    // Add keyboard support
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isAnimating) {
                summary.click();
            }
        }
    });
});

// Close other favorite cards when one is opened
function closeOtherFavorites(currentCard) {
    favoriteCards.forEach(function(card) {
        if (card !== currentCard && card.open) {
            // Force close without triggering animation
            card.open = false;
            const content = card.querySelector('.favorite-content');
            if (content) {
                content.style.maxHeight = '0';
                content.style.overflow = 'hidden';
            }
        }
    });
}

// Create sparkle effect
function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 8;
    
    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(function() {
            const sparkle = document.createElement('span');
            sparkle.className = 'favorite-sparkle';
            
            const symbols = ['✨', '💖', '⭐', '💫', '🌸', '❤️', '✦', '✧'];
            sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            
            const randomX = rect.left + Math.random() * rect.width;
            const randomY = rect.top + window.scrollY + (rect.height * 0.3);
            
            sparkle.style.left = randomX + 'px';
            sparkle.style.top = randomY + 'px';
            sparkle.style.setProperty('--random-x', (Math.random() - 0.5) * 2);
            sparkle.style.setProperty('--random-y', -30 - Math.random() * 30);
            
            document.body.appendChild(sparkle);
            
            setTimeout(function() {
                sparkle.remove();
            }, 1500);
        }, i * 50);
    }
}

// Play sound effect (optional - uncomment if you add audio files)
function playOpenSound() {
    // const audio = new Audio('assets/audio/pop.mp3');
    // audio.volume = 0.3;
    // audio.play().catch(e => console.log('Audio play failed:', e));
}

// Track user interaction
let favoritesOpened = new Set();

function trackFavoritesInteraction(card) {
    const category = card.getAttribute('data-category');
    if (category && !favoritesOpened.has(category)) {
        favoritesOpened.add(category);
        
        // Easter egg: if user opens all 3 cards
        if (favoritesOpened.size === 3) {
            setTimeout(function() {
                showFavoritesCompletionMessage();
                favoritesOpened.clear(); // Reset for next time
            }, 500);
        }
    }
}

function showFavoritesCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'favorites-completion-toast';
    message.innerHTML = '🎉 You discovered all my favorites! 💖';
    
    document.body.appendChild(message);
    
    setTimeout(function() {
        message.classList.add('show');
    }, 100);
    
    setTimeout(function() {
        message.classList.remove('show');
        setTimeout(function() {
            message.remove();
        }, 300);
    }, 3000);
    
    // Create confetti
    for (let i = 0; i < 30; i++) {
        setTimeout(function() {
            createConfettiParticle();
        }, i * 50);
    }
}

function createConfettiParticle() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    
    const colors = ['#FF69B4', '#FFE4E1', '#FFC0CB', '#FFB6C1', '#FF1493'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(confetti);
    
    setTimeout(function() {
        confetti.remove();
    }, 3000);
}

/* ============================================
   END OF SCRIPT
============================================ */