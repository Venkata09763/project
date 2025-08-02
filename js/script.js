// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// DOM Elements
const navbar = $('#navbar');
const hamburger = $('#hamburger');
const navMenu = $('#nav-menu');
const backToTopBtn = $('#back-to-top');
const cartIcon = $('#cart-icon');
const cartCount = $('.cart-count');
const productsGrid = $('#products-grid');
const filterBtns = $$('.filter-btn');
const loadMoreBtn = $('#load-more-btn');
const newsletterForm = $('#newsletter-form');
const contactForm = $('#contact-form');

// State Management
let cart = [];
let currentFilter = 'all';
let productsLoaded = 8;
let isLoading = false;

// Sample Products Data
const products = [
    {
        id: 1,
        name: "Elegant Summer Dress",
        price: 89.99,
        originalPrice: 119.99,
        image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "new",
        badge: "New"
    },
    {
        id: 2,
        name: "Casual Chic Blouse",
        price: 49.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "trending",
        badge: "Trending"
    },
    {
        id: 3,
        name: "Designer Handbag",
        price: 159.99,
        originalPrice: 199.99,
        image: "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "sale",
        badge: "Sale"
    },
    {
        id: 4,
        name: "Floral Print Dress",
        price: 75.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "new",
        badge: "New"
    },
    {
        id: 5,
        name: "Silk Scarf Collection",
        price: 29.99,
        originalPrice: 39.99,
        image: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "trending",
        badge: "Trending"
    },
    {
        id: 6,
        name: "Evening Gown",
        price: 299.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "new",
        badge: "New"
    },
    {
        id: 7,
        name: "Casual Denim Jacket",
        price: 69.99,
        originalPrice: 89.99,
        image: "https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "sale",
        badge: "Sale"
    },
    {
        id: 8,
        name: "Statement Necklace",
        price: 39.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1445597/pexels-photo-1445597.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "trending",
        badge: "Trending"
    },
    {
        id: 9,
        name: "Leather Boots",
        price: 129.99,
        originalPrice: 159.99,
        image: "https://images.pexels.com/photos/1319799/pexels-photo-1319799.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "sale",
        badge: "Sale"
    },
    {
        id: 10,
        name: "Vintage Sunglasses",
        price: 45.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1253763/pexels-photo-1253763.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "new",
        badge: "New"
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadProducts();
    initializeAnimations();
    updateCartDisplay();
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    hamburger?.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);
    
    // Back to top
    backToTopBtn?.addEventListener('click', scrollToTop);
    
    // Product filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => filterProducts(e.target.dataset.filter));
    });
    
    // Load more products
    loadMoreBtn?.addEventListener('click', loadMoreProducts);
    
    // Forms
    newsletterForm?.addEventListener('submit', handleNewsletterSubmit);
    contactForm?.addEventListener('submit', handleContactSubmit);
    
    // Smooth scrolling for navigation links
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    // Category cards
    $$('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            filterProducts(category);
            scrollToSection('collections');
        });
    });
}

// Navigation Functions
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Navbar scroll effect
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (scrollTop > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Animate elements on scroll
    animateOnScroll();
}

function updateActiveNavLink() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    
    if (targetId.startsWith('#')) {
        scrollToSection(targetId.substring(1));
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

function scrollToSection(sectionId) {
    const section = $(`#${sectionId}`);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Product Functions
function loadProducts() {
    if (isLoading) return;
    
    isLoading = true;
    showLoadingSpinner();
    
    setTimeout(() => {
        const filteredProducts = getFilteredProducts();
        const productsToShow = filteredProducts.slice(0, productsLoaded);
        renderProducts(productsToShow);
        
        // Show/hide load more button
        if (productsLoaded >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
        
        hideLoadingSpinner();
        isLoading = false;
    }, 500);
}

function getFilteredProducts() {
    if (currentFilter === 'all') {
        return products;
    }
    return products.filter(product => product.category === currentFilter);
}

function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Add animation classes
    setTimeout(() => {
        $$('.product-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in', 'visible');
            }, index * 100);
        });
    }, 100);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-actions">
                <button class="action-btn" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="addToCart(${product.id})" title="Add to Cart">
                    <i class="fas fa-shopping-bag"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                $${product.price}
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function filterProducts(filter) {
    currentFilter = filter;
    productsLoaded = 8;
    
    // Update active filter button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    loadProducts();
}

function loadMoreProducts() {
    productsLoaded += 4;
    loadProducts();
}

function showLoadingSpinner() {
    if (!$('.loading-spinner')) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        productsGrid.parentNode.insertBefore(spinner, loadMoreBtn);
    }
}

function hideLoadingSpinner() {
    const spinner = $('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        updateCartDisplay();
        showNotification(`${product.name} added to cart!`, 'success');
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

function toggleWishlist(productId) {
    // Wishlist functionality would be implemented here
    showNotification('Added to wishlist!', 'success');
}

function quickView(productId) {
    // Quick view modal would be implemented here
    showNotification('Quick view coming soon!', 'info');
}

// Form Handling
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('Thank you for subscribing!', 'success');
        e.target.reset();
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Message sent successfully!', 'success');
        e.target.reset();
    }, 1000);
}

// Animation Functions
function initializeAnimations() {
    // Add animation classes to elements
    $$('.hero-text > *').forEach((el, index) => {
        el.classList.add('slide-in-left');
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 200);
    });
    
    $('.hero-image').classList.add('slide-in-right');
    setTimeout(() => {
        $('.hero-image').classList.add('visible');
    }, 400);
}

function animateOnScroll() {
    const elements = $$('.fade-in:not(.visible), .slide-in-left:not(.visible), .slide-in-right:not(.visible)');
    
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            el.classList.add('visible');
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    return colors[type] || colors.info;
}

// Search Functionality (placeholder)
$('#search-icon')?.addEventListener('click', function() {
    showNotification('Search functionality coming soon!', 'info');
});

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(handleScroll, 10);
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', optimizedScrollHandler);

// Lazy loading for images
function setupLazyLoading() {
    const images = $$('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.quickView = quickView;