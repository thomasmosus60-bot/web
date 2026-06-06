const API_BASE_URL = '';

const FALLBACK_CAKES = [
    { id: 'cake-1', name: 'Mickey Safari Cake', image: 'images/cake6.jpg', category: 'signature' },
    { id: 'cake-2', name: 'Cocomelon Birthday Cake', image: 'images/cake.jpg.jpeg', category: 'signature' },
    { id: 'cake-3', name: 'Hello Kitty Cake', image: 'images/cake2.jpeg', category: 'signature' },
    { id: 'cake-4', name: 'Galaxy Theme Cake', image: 'images/cake3.jpeg', category: 'signature' },
    { id: 'cake-5', name: 'Pineapple Cream Cake', image: 'images/cake4.jpeg', category: 'signature' },
    { id: 'cake-6', name: 'Rainbow Baby Cake', image: 'images/cake5.jpg', category: 'signature' },
    { id: 'theme-1', name: 'Custom Theme Cake', image: 'images/1.jpg', category: 'theme' },
    { id: 'theme-2', name: 'Pink Character Cake', image: 'images/2.jpg', category: 'theme' },
    { id: 'theme-3', name: 'Solar System Cake', image: 'images/3.jpg', category: 'theme' },
    { id: 'theme-4', name: 'Celebration Cake', image: 'images/4.jpg', category: 'theme' },
    { id: 'theme-5', name: 'Kids Birthday Cake', image: 'images/5.jpg', category: 'theme' },
    { id: 'theme-6', name: 'Two Tier Theme Cake', image: 'images/6.jpg', category: 'theme' }
];

class Carousel3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.track = this.container.querySelector('.carousel-3d-track');
        this.slides = Array.from(this.container.querySelectorAll('.carousel-3d-slide'));
        this.prevBtn = this.container.querySelector('.carousel-3d-prev');
        this.nextBtn = this.container.querySelector('.carousel-3d-next');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoRotate = true;
        this.autoRotateInterval = 4000;
        this.intervalId = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isTouching = false;
        this.isDragging = false;
        this.dragStartX = 0;

        this.init();
    }

    init() {
        if (!this.track || this.totalSlides === 0) return;

        this.prevBtn?.addEventListener('click', () => this.rotatePrev());
        this.nextBtn?.addEventListener('click', () => this.rotateNext());
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseup', () => this.handleMouseUp());
        this.container.addEventListener('mouseleave', () => this.handleMouseUp());
        this.container.addEventListener('mouseenter', () => this.pauseAutoRotate());
        this.container.addEventListener('mouseleave', () => this.startAutoRotate());
        this.updateSlides();
        this.startAutoRotate();
    }

    rotatePrev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlides();
        this.resetAutoRotate();
    }

    rotateNext() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlides();
        this.resetAutoRotate();
    }

    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.className = 'carousel-3d-slide';
            const relativeIndex = (index - this.currentIndex + this.totalSlides) % this.totalSlides;

            if (relativeIndex === 0) slide.classList.add('active');
            else if (relativeIndex === 1) slide.classList.add('right-1');
            else if (relativeIndex === 2) slide.classList.add('right-2');
            else if (relativeIndex === 3) slide.classList.add('right-3');
            else if (relativeIndex === 4) slide.classList.add('right-4');
            else if (relativeIndex === 5) slide.classList.add('right-5');
            else if (relativeIndex === this.totalSlides - 1) slide.classList.add('left-1');
            else if (relativeIndex === this.totalSlides - 2) slide.classList.add('left-2');
            else if (relativeIndex === this.totalSlides - 3) slide.classList.add('left-3');
            else if (relativeIndex === this.totalSlides - 4) slide.classList.add('left-4');
            else if (relativeIndex === this.totalSlides - 5) slide.classList.add('left-5');
            else slide.classList.add('pos-6');
        });
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isTouching = true;
    }

    handleTouchMove(e) {
        if (!this.isTouching) return;
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - this.touchStartX);
        const deltaY = Math.abs(touch.clientY - this.touchStartY);
        if (deltaX > deltaY && deltaX > 10) e.preventDefault();
    }

    handleTouchEnd(e) {
        if (!this.isTouching) return;
        this.isTouching = false;
        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;
        this.handleSwipe();
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
    }

    handleMouseMove() {}

    handleMouseUp() {
        this.isDragging = false;
    }

    handleSwipe() {
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            diffX > 0 ? this.rotateNext() : this.rotatePrev();
        }
    }

    startAutoRotate() {
        if (!this.autoRotate || this.intervalId || this.totalSlides < 2) return;
        this.intervalId = setInterval(() => this.rotateNext(), this.autoRotateInterval);
    }

    pauseAutoRotate() {
        this.autoRotate = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    resetAutoRotate() {
        this.pauseAutoRotate();
        this.autoRotate = true;
        this.startAutoRotate();
    }
}

function apiUrl(path) {
    return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}

function getCakeImage(cake) {
    return cake.image || cake.imageUrl || cake.photo || cake.photoUrl || cake.thumbnail || 'images/cake6.jpg';
}

function getCakeName(cake) {
    return cake.name || cake.title || cake.flavor || 'Custom Cake';
}

function normalizeCake(cake, index) {
    return {
        id: cake.id || cake._id || `cake-${index + 1}`,
        name: getCakeName(cake),
        image: getCakeImage(cake),
        category: (cake.category || cake.type || '').toLowerCase()
    };
}

async function fetchCakes() {
    if (!API_BASE_URL) return FALLBACK_CAKES;

    try {
        const response = await fetch(apiUrl('/api/cakes'));
        if (!response.ok) throw new Error('Could not load cakes');
        const data = await response.json();
        const cakes = Array.isArray(data) ? data : data.cakes || data.data || [];
        return cakes.map(normalizeCake);
    } catch (error) {
        console.warn(error);
        return FALLBACK_CAKES;
    }
}

function createCakeSlide(cake) {
    const slide = document.createElement('div');
    slide.className = 'carousel-3d-slide';
    slide.dataset.cakeId = cake.id;

    const image = document.createElement('img');
    image.src = cake.image;
    image.alt = cake.name;
    image.loading = 'lazy';

    slide.appendChild(image);
    return slide;
}

function renderGallery(containerId, cakes) {
    const container = document.getElementById(containerId);
    const track = container?.querySelector('.carousel-3d-track');
    if (!track || cakes.length === 0) return;

    track.innerHTML = '';
    cakes.forEach((cake) => track.appendChild(createCakeSlide(cake)));
}

function splitGalleryCakes(cakes) {
    const signature = cakes.filter((cake) => cake.category !== 'theme').slice(0, 6);
    const theme = cakes.filter((cake) => cake.category === 'theme').slice(0, 6);

    return {
        signature: signature.length ? signature : cakes.slice(0, 6),
        theme: theme.length ? theme : cakes.slice(6, 12)
    };
}

async function loadCakeGalleries() {
    const cakes = await fetchCakes();
    const galleries = splitGalleryCakes(cakes);
    renderGallery('gallery1', galleries.signature);
    renderGallery('gallery2', galleries.theme.length ? galleries.theme : galleries.signature);
    new Carousel3D('gallery1');
    new Carousel3D('gallery2');
}

async function submitInquiry(form) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    const formData = new FormData(form);
    const inquiry = {
        name: formData.get('name')?.trim(),
        email: formData.get('email')?.trim(),
        phone: formData.get('phone')?.trim(),
        message: formData.get('message')?.trim()
    };

    if (!API_BASE_URL) {
        const whatsappMessage = [
            '*New Order Request*',
            '',
            `*Name:* ${inquiry.name}`,
            `*Email:* ${inquiry.email}`,
            inquiry.phone ? `*Phone:* ${inquiry.phone}` : '',
            `*Message:* ${inquiry.message}`,
            '',
            'Sent from HONORE CAKES website'
        ].filter(Boolean).join('\n');

        window.open(`https://wa.me/919746401163?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        form.reset();
        return;
    }

    try {
        button.disabled = true;
        button.textContent = 'Sending...';

        const response = await fetch(apiUrl('/api/inquiries'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiry)
        });

        if (!response.ok) throw new Error('Could not send inquiry');

        alert('Thank you! Your inquiry has been sent.');
        form.reset();
    } catch (error) {
        console.warn(error);
        alert('Sorry, your inquiry could not be sent. Please try WhatsApp or email.');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCakeGalleries();

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitInquiry(contactForm);
    });
});

window.addEventListener('scroll', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    const header = document.querySelector('header');

    if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
    }

    if (header) {
        header.style.boxShadow = window.scrollY > 50
            ? '0 4px 8px rgba(255,255,255,0.15)'
            : '0 2px 4px rgba(255,255,255,0.1)';
    }
});