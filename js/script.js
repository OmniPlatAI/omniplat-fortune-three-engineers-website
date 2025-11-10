// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Close mobile menu when clicking on a link
const mobileLinks = document.querySelectorAll('#mobile-menu a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }

    lastScroll = currentScroll;
});

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        backToTopBtn.classList.add('opacity-0', 'invisible');
        backToTopBtn.classList.remove('opacity-100', 'visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission Handler
function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        formMessage.classList.remove('hidden');
        formMessage.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-400');
        formMessage.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Thank you! Your message has been sent successfully. We will get back to you soon.';

        // Reset form
        form.reset();

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }, 1500);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Image Carousel Auto-Rotation with Professional Navigation
function initImageCarousels() {
    const carousels = {};
    const carouselContainers = document.querySelectorAll('.image-carousel');

    carouselContainers.forEach(container => {
        const images = container.querySelectorAll('.carousel-image');
        if (images.length === 0) return;

        const firstImage = images[0];
        const carouselName = firstImage.getAttribute('data-carousel');
        
        if (!carouselName) return;

        if (!carousels[carouselName]) {
            carousels[carouselName] = {
                container: container,
                images: Array.from(images),
                indicators: Array.from(container.querySelectorAll('.carousel-indicator')),
                currentIndex: 0,
                intervalId: null,
                progressIntervalId: null,
                isPaused: false,
                progressBar: null
            };
        }
    });

    // Initialize each carousel
    Object.keys(carousels).forEach(carouselName => {
        const carousel = carousels[carouselName];
        const container = carousel.container;

        // Create navigation arrows if they don't exist
        if (!container.querySelector('.carousel-nav.prev')) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-nav prev';
            prevBtn.setAttribute('data-carousel', carouselName);
            prevBtn.setAttribute('data-direction', 'prev');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.setAttribute('aria-label', 'Previous image');
            container.appendChild(prevBtn);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-nav next';
            nextBtn.setAttribute('data-carousel', carouselName);
            nextBtn.setAttribute('data-direction', 'next');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.setAttribute('aria-label', 'Next image');
            container.appendChild(nextBtn);
        }

        // Create progress bar if it doesn't exist
        if (!container.querySelector('.carousel-progress')) {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'carousel-progress';
            const progressBar = document.createElement('div');
            progressBar.className = 'carousel-progress-bar';
            progressBar.setAttribute('data-carousel', carouselName);
            progressContainer.appendChild(progressBar);
            container.appendChild(progressContainer);
            carousel.progressBar = progressBar;
        } else {
            carousel.progressBar = container.querySelector('.carousel-progress-bar');
        }

        function showImage(index, resetProgress = true) {
            // Hide all images
            carousel.images.forEach((img, i) => {
                img.classList.remove('active');
                if (i === index) {
                    img.classList.add('active');
                }
            });

            // Update indicators
            carousel.indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });

            carousel.currentIndex = index;

            // Reset progress bar
            if (resetProgress && carousel.progressBar) {
                carousel.progressBar.style.width = '0%';
            }
        }

        function nextImage() {
            const nextIndex = (carousel.currentIndex + 1) % carousel.images.length;
            showImage(nextIndex);
        }

        function prevImage() {
            const prevIndex = (carousel.currentIndex - 1 + carousel.images.length) % carousel.images.length;
            showImage(prevIndex);
        }

        function startAutoRotate() {
            // Clear existing intervals
            if (carousel.intervalId) clearInterval(carousel.intervalId);
            if (carousel.progressIntervalId) clearInterval(carousel.progressIntervalId);

            // Auto-rotate every 5 seconds
            carousel.intervalId = setInterval(() => {
                if (!carousel.isPaused) {
                    nextImage();
                }
            }, 5000);

            // Progress bar animation
            if (carousel.progressBar) {
                carousel.progressBar.style.width = '0%';
                carousel.progressIntervalId = setInterval(() => {
                    if (!carousel.isPaused && carousel.progressBar) {
                        const currentWidth = parseFloat(carousel.progressBar.style.width) || 0;
                        const increment = (100 / 5000) * 50; // 5000ms = 5 seconds, update every 50ms
                        if (currentWidth < 100) {
                            carousel.progressBar.style.width = (currentWidth + increment) + '%';
                        }
                    }
                }, 50);
            }
        }

        // Pause on hover
        container.addEventListener('mouseenter', () => {
            carousel.isPaused = true;
        });

        container.addEventListener('mouseleave', () => {
            carousel.isPaused = false;
            showImage(carousel.currentIndex, true);
        });

        // Navigation arrows
        const prevBtn = container.querySelector('.carousel-nav.prev');
        const nextBtn = container.querySelector('.carousel-nav.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevImage();
                startAutoRotate();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextImage();
                startAutoRotate();
            });
        }

        // Keyboard navigation
        container.setAttribute('tabindex', '0');
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevImage();
                startAutoRotate();
            } else if (e.key === 'ArrowRight') {
                nextImage();
                startAutoRotate();
            }
        });

        // Allow manual navigation via indicators
        carousel.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showImage(index);
                startAutoRotate();
            });
        });

        // Start auto-rotation
        startAutoRotate();
    });
}

// Initialize carousels when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageCarousels);
} else {
    initImageCarousels();
}

// Progressive Image Loading with Intersection Observer
function initProgressiveImageLoading() {
    // Handle images with data-src (lazy loading)
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // Handle regular images that should fade in when loaded
    const regularImages = document.querySelectorAll('img:not([data-src]):not(.loaded)');
    
    // Image loading handler
    function loadImage(img) {
        return new Promise((resolve, reject) => {
            if (img.complete && img.naturalHeight !== 0) {
                // Image already loaded
                resolve(img);
                return;
            }
            
            img.onload = () => resolve(img);
            img.onerror = reject;
            
            // If image has data-src, load it
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }
    
    // Mark image as loaded and fade in
    function markImageLoaded(img) {
        img.classList.add('loaded');
        img.classList.add('image-fade-in');
        img.classList.remove('lazy-load');
        
        // Remove placeholder background from container
        const container = img.closest('.image-container');
        if (container) {
            container.classList.remove('image-container');
        }
    }
    
    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                loadImage(img)
                    .then(() => {
                        markImageLoaded(img);
                        observer.unobserve(img);
                    })
                    .catch(() => {
                        // Handle error - maybe show placeholder
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    });
            }
        });
    }, {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
    });
    
    // Observe lazy images
    lazyImages.forEach(img => {
        // Set a tiny placeholder or keep original src as placeholder
        if (!img.src) {
            // Create a 1x1 transparent pixel as placeholder
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        }
        imageObserver.observe(img);
    });
    
    // Handle regular images (above the fold)
    regularImages.forEach(img => {
        // For critical images, load immediately
        if (img.hasAttribute('fetchpriority') || (img.hasAttribute('loading') && img.getAttribute('loading') === 'eager')) {
            loadImage(img).then(() => markImageLoaded(img));
        } else {
            // For other images, use intersection observer
            imageObserver.observe(img);
        }
    });
    
    // Preload critical images
    const criticalImages = document.querySelectorAll('img[fetchpriority="high"], img[loading="eager"]');
    criticalImages.forEach(img => {
        if (img.src && !img.complete) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        }
    });
}

// Initialize progressive image loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgressiveImageLoading);
} else {
    initProgressiveImageLoading();
}

