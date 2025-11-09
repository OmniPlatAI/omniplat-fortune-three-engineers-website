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

// Image Carousel Auto-Rotation
function initImageCarousels() {
    const carousels = {};
    const carouselElements = document.querySelectorAll('[data-carousel]');

    // Group images by carousel name
    carouselElements.forEach(element => {
        const carouselName = element.getAttribute('data-carousel');
        if (!carousels[carouselName]) {
            carousels[carouselName] = {
                images: [],
                indicators: [],
                currentIndex: 0
            };
        }

        if (element.classList.contains('carousel-image')) {
            carousels[carouselName].images.push(element);
        } else if (element.classList.contains('carousel-indicator')) {
            carousels[carouselName].indicators.push(element);
        }
    });

    // Initialize each carousel
    Object.keys(carousels).forEach(carouselName => {
        const carousel = carousels[carouselName];

        function showImage(index) {
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
        }

        // Auto-rotate every 5 seconds
        setInterval(() => {
            const nextIndex = (carousel.currentIndex + 1) % carousel.images.length;
            showImage(nextIndex);
        }, 5000);

        // Allow manual navigation via indicators
        carousel.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showImage(index);
            });
        });
    });
}

// Initialize carousels when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageCarousels);
} else {
    initImageCarousels();
}

