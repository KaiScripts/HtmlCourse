// Main JavaScript file for HTML & CSS Course Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize navigation highlighting
    initNavHighlighting();
    
    // Initialize progress tracking
    initProgressTracking();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize code highlighting
    highlightCode();
});

// Animate elements when they come into view
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animation || 'fade-in';
                element.classList.add(animation);
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Highlight active navigation items
function initNavHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a, .sidebar a');
    
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
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Track progress through the course
function initProgressTracking() {
    const progressBar = document.querySelector('.progress-bar');
    const totalPages = 50; // Total number of pages in the course
    
    if (progressBar) {
        // Get current page number from data attribute or URL
        const currentPage = parseInt(document.body.dataset.page) || 1;
        const progressPercentage = (currentPage / totalPages) * 100;
        
        progressBar.style.width = `${progressPercentage}%`;
        
        // Store progress in localStorage
        localStorage.setItem('courseProgress', currentPage);
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });
    }
}

// Highlight code syntax
function highlightCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // Simple syntax highlighting for HTML
        if (block.classList.contains('language-html')) {
            let html = block.innerHTML;
            
            // Highlight tags
            html = html.replace(/(&lt;[\/]?[a-z0-9]+(&gt;)?)/g, '<span class="tag">$1</span>');
            
            // Highlight attributes
            html = html.replace(/([a-z\-]+)=/g, '<span class="attribute">$1</span>=');
            
            // Highlight values
            html = html.replace(/(".*?")/g, '<span class="value">$1</span>');
            
            // Highlight comments
            html = html.replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>');
            
            block.innerHTML = html;
        }
        
        // Simple syntax highlighting for CSS
        if (block.classList.contains('language-css')) {
            let css = block.innerHTML;
            
            // Highlight selectors
            css = css.replace(/([a-z0-9\-\.\#\[\]\:\,\s]+)\{/g, '<span class="tag">$1</span>{');
            
            // Highlight properties
            css = css.replace(/([a-z\-]+):/g, '<span class="attribute">$1</span>:');
            
            // Highlight values
            css = css.replace(/:\s(.*?);/g, ': <span class="value">$1</span>;');
            
            // Highlight comments
            css = css.replace(/(\/\*.*?\*\/)/g, '<span class="comment">$1</span>');
            
            block.innerHTML = css;
        }
    });
}

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        // Store theme preference
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
        }
    });
});

// Page navigation
function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > 50) return;
    
    const pageUrl = pageNumber <= 25 
        ? `pages/html/${pageNumber <= 12 ? 'basic' : 'professional'}/page${pageNumber}.html`
        : `pages/css/${pageNumber <= 37 ? 'basic' : 'professional'}/page${pageNumber}.html`;
    
    window.location.href = pageUrl;
}

// Copy code functionality
function setupCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = 'Copy';
        
        block.appendChild(copyButton);
        
        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code').innerText;
            
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });
}

// Call setupCodeCopy after page load
window.addEventListener('load', setupCodeCopy);

// Interactive examples
function initInteractiveExamples() {
    const liveEditors = document.querySelectorAll('.live-editor');
    
    liveEditors.forEach(editor => {
        const codeInput = editor.querySelector('.code-input');
        const previewFrame = editor.querySelector('.preview');
        
        if (codeInput && previewFrame) {
            codeInput.addEventListener('input', () => {
                updatePreview(codeInput, previewFrame);
            });
            
            // Initial preview
            updatePreview(codeInput, previewFrame);
        }
    });
}

function updatePreview(codeInput, previewFrame) {
    const code = codeInput.value;
    
    if (previewFrame.tagName === 'IFRAME') {
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(code);
        frameDoc.close();
    } else {
        previewFrame.innerHTML = code;
    }
}

// Initialize interactive examples after page load
window.addEventListener('load', initInteractiveExamples);
