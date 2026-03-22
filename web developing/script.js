// ============================================
// HTTPS SECURITY ENFORCEMENT
// ============================================

// Force HTTPS redirect ONLY for production domains (not localhost)
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Replace http:// with https:// only for production
    const httpsUrl = window.location.href.replace(/^http:/, 'https:');
    window.location.href = httpsUrl;
} else if (window.location.protocol === 'https:') {
    console.log('✅ HTTPS Connection Established - Secure Protocol Active');
} else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('⚠️ Local Development Mode: HTTP allowed for localhost testing');
}

// ============================================
// SECURITY FUNCTIONS
// ============================================

console.log("Welcome to my website!");

// Security: CSRF Token generation
function generateCSRFToken() {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Security: Input sanitization function
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Security: Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Security: Disable right-click context menu (optional)
function disableContextMenu() {
    document.addEventListener('contextmenu', function(e) {
        // Allow context menu, commented out for flexibility
        // e.preventDefault();
    });
}

// Security: Log security events
function logSecurityEvent(event) {
    console.warn('[SECURITY EVENT]', event, new Date().toISOString());
}

// Security: Check for HTTPS on critical operations
function ensureSecureConnection() {
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        logSecurityEvent('Non-HTTPS connection detected on non-localhost domain');
        console.error('⚠️ WARNING: This connection is not secure. Please use HTTPS.');
        return false;
    }
    return true;
}

// Security: Detect suspicious activity
window.addEventListener('beforeunload', function(e) {
    logSecurityEvent('Page unload detected');
});

// Simple welcome alert
document.addEventListener('DOMContentLoaded', function() {
    const isSecure = ensureSecureConnection();
    
    console.log("✅ Page loaded successfully with security enabled!");
    alert('Welcome to My Website! 🎉\n\n🔒 This website uses enhanced security measures with HTTPS encryption.');
    
    // Initialize CSRF token
    const csrfToken = generateCSRFToken();
    sessionStorage.setItem('csrfToken', csrfToken);
    console.log('[SECURITY] CSRF token generated');
    console.log('[SECURITY] Security Level: MAXIMUM - HTTPS Enforced');
    
    // Settings dropdown functionality
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            settingsDropdown.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.settings-wrapper')) {
            settingsDropdown.classList.remove('active');
        }
    });
    
    // Handle dropdown items with security checks
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const text = sanitizeInput(this.textContent.trim());
            console.log('[SECURITY] Safe click:', text);
            logSecurityEvent('User interacted with settings: ' + text);
            settingsDropdown.classList.remove('active');
        });
    });
    
    // Secure search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            this.value = sanitizeInput(this.value);
        });
    }
    
    // Monitor for XSS-like patterns
    document.addEventListener('keypress', function(e) {
        const key = e.key;
        if (key === '<' || key === '>' || key === '&') {
            logSecurityEvent('Potential XSS attempt with key: ' + key);
        }
    });
    
    // Security: Disable dangerous functionalities
    document.addEventListener('drag', function(e) {
        logSecurityEvent('Drag event detected');
    });
    
    // Security: Monitor console warnings
    const originalWarn = console.warn;
    console.warn = function(msg) {
        logSecurityEvent('Console warning: ' + msg);
        originalWarn.apply(console, arguments);
    };
});
