// ============================================
// Obsidian Reality - Main JavaScript
// ============================================

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initActiveLink();
    initAnimations();
    initForms();
    initSmoothScroll();
});

// Navigation Functions
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            // Toggle hamburger icon
            if (navMenu.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }
}

// Set Active Link Based on Current Page
function initActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Remove active class first
        link.classList.remove('active');
        
        // Check if this link matches the current page
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
            
            // If it's a dropdown item, also highlight the parent dropdown
            const dropdownParent = link.closest('.dropdown');
            if (dropdownParent) {
                const parentLink = dropdownParent.querySelector('a');
                if (parentLink && !parentLink.classList.contains('active')) {
                    // Don't add active to parent if we're on home2.html (it's a submenu)
                    if (currentPage !== 'home2.html') {
                        parentLink.classList.add('active');
                    }
                }
            }
        }
    });
    
    // Special handling for home2.html - ensure Home2 link is active
    if (currentPage === 'home2.html') {
        const home2Link = document.querySelector('.nav-menu a[href="home2.html"]');
        if (home2Link) {
            home2Link.classList.add('active');
        }
    }
}

// Animations on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.card, .section-title');
    animatedElements.forEach(el => observer.observe(el));
}

// Form Validation and AJAX
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(form);
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorMsg = field.parentElement.querySelector('.error-message');
    
    // Remove previous error
    if (errorMsg) {
        errorMsg.classList.remove('show');
        field.style.borderColor = '';
    }
    
    // Validation rules
    let isValid = true;
    let errorText = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorText = 'This field is required';
    } else if (fieldName === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorText = 'Please enter a valid email address';
    } else if (fieldName === 'phone' && value && !isValidPhone(value)) {
        isValid = false;
        errorText = 'Please enter a valid phone number';
    }
    
    if (!isValid && errorMsg) {
        errorMsg.textContent = errorText;
        errorMsg.classList.add('show');
        field.style.borderColor = '#ff4444';
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
}

function handleFormSubmit(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = form.querySelector('.success-message');
    const errorMsg = form.querySelector('.error-message');
    
    // Validate all fields
    const inputs = form.querySelectorAll('.form-control');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        return;
    }
    
    // Disable submit button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    }
    
    // Simulate AJAX request (replace with actual endpoint)
    setTimeout(() => {
        // Success response
        if (successMsg) {
            successMsg.textContent = 'Thank you! Your message has been sent successfully.';
            successMsg.classList.add('show');
        }
        
        // Reset form
        form.reset();
        
        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
        }
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            if (successMsg) {
                successMsg.classList.remove('show');
            }
        }, 5000);
    }, 1500);
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Logo Click Handler
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

// Store original button text for form submission
document.addEventListener('DOMContentLoaded', function() {
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(btn => {
        btn.setAttribute('data-original-text', btn.textContent);
    });
});

