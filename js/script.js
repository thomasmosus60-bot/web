// 3D Rotating Cake Gallery
class Carousel3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.track = this.container.querySelector('.carousel-3d-track');
        this.slides = Array.from(this.container.querySelectorAll('.carousel-3d-slide'));
        this.prevBtn = this.container.querySelector('.carousel-3d-prev');
        this.nextBtn = this.container.querySelector('.carousel-3d-next');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoRotate = true;
        this.autoRotateInterval = 4000;
        this.intervalId = null;
        
        // Touch tracking
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
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.rotatePrev());
        this.nextBtn.addEventListener('click', () => this.rotateNext());
        
        // Touch/swipe support
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse drag support for desktop
        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseup', () => this.handleMouseUp());
        this.container.addEventListener('mouseleave', () => this.handleMouseUp());
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoRotate());
        this.container.addEventListener('mouseleave', () => this.startAutoRotate());
        
        // Initial render
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
            // Reset to base class only
            slide.className = 'carousel-3d-slide';
            
            // Calculate relative position (circular)
            let relativeIndex = (index - this.currentIndex + this.totalSlides) % this.totalSlides;
            
            // Apply position classes - balanced on both sides
            if (relativeIndex === 0) {
                slide.classList.add('active');
            } else if (relativeIndex === 1) {
                slide.classList.add('right-1');
            } else if (relativeIndex === 2) {
                slide.classList.add('right-2');
            } else if (relativeIndex === 3) {
                slide.classList.add('right-3');
            } else if (relativeIndex === 4) {
                slide.classList.add('right-4');
            } else if (relativeIndex === 5) {
                slide.classList.add('right-5');
            } else if (relativeIndex === this.totalSlides - 1) {
                slide.classList.add('left-1');
            } else if (relativeIndex === this.totalSlides - 2) {
                slide.classList.add('left-2');
            } else if (relativeIndex === this.totalSlides - 3) {
                slide.classList.add('left-3');
            } else if (relativeIndex === this.totalSlides - 4) {
                slide.classList.add('left-4');
            } else if (relativeIndex === this.totalSlides - 5) {
                slide.classList.add('left-5');
            } else {
                slide.classList.add('pos-6');
            }
        });
    }
    
    // Touch handlers with overflow hidden behavior
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isTouching = true;
    }
    
    handleTouchMove(e) {
        if (!this.isTouching) return;
        
        // Prevent page scroll when swiping inside carousel
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - this.touchStartX);
        const deltaY = Math.abs(touch.clientY - this.touchStartY);
        
        // If horizontal swipe is dominant, prevent page scroll
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isTouching) return;
        this.isTouching = false;
        
        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;
        this.handleSwipe();
    }
    
    // Mouse drag handlers
    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
    }
    
    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
        }
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Only trigger if horizontal swipe is dominant
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                this.rotateNext(); // Swipe left = next
            } else {
                this.rotatePrev(); // Swipe right = prev
            }
        }
    }
    
    // Auto-rotation
    startAutoRotate() {
        if (!this.autoRotate) return;
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

// Initialize both galleries when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Carousel3D('gallery1');
    new Carousel3D('gallery2');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});