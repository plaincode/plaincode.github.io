/**
 * Handle documentation-only view for embedded/external contexts
 * Hides header, footer, and store links when specific URL parameters are present
 */
(function() {
  'use strict';

  function isDocumentationOnlyMode() {
    const url = window.location.href.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    
    // Check for specific parameters or keywords
    return params.has('clinometer') || 
           params.has('magnetmeter') ||
           params.has('accelmeter') ||
           params.has('isetsquare') ||
           params.has('contactsbynumber') ||
           params.has('magichue') ||
           params.has('build') ||
           params.has('embed') ||
           params.has('docs') ||
           url.includes('amazon');
  }

  function enableDocumentationMode() {
    // Hide header
    const header = document.querySelector('.site-header');
    if (header) header.style.display = 'none';
    
    // Hide footer
    const footer = document.querySelector('.site-footer');
    if (footer) footer.style.display = 'none';
    
    // Hide store badges/links
    const storeLinks = document.querySelectorAll('.app-links, .store-badge');
    storeLinks.forEach(function(element) {
      element.style.display = 'none';
    });
    
    // Hide hero section (the blue gradient bar with app name)
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    
    // Adjust main content styling for documentation-only view
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.paddingTop = '2rem';
    }
    
    const productPage = document.querySelector('.product-page');
    if (productPage) {
      productPage.style.paddingTop = '0';
    }
    
    // Remove glassmorphism background from product-detail for cleaner embedded view
    const productDetail = document.querySelector('.product-detail');
    if (productDetail) {
      productDetail.style.background = '#fff';
      productDetail.style.backdropFilter = 'none';
      productDetail.style.boxShadow = 'none';
    }
    
    // Add marker class to body for additional styling if needed
    document.body.classList.add('docs-only-mode');
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (isDocumentationOnlyMode()) {
        enableDocumentationMode();
      }
    });
  } else {
    // DOM already loaded
    if (isDocumentationOnlyMode()) {
      enableDocumentationMode();
    }
  }
})();

/**
 * Load Umami analytics script with environment-specific website ID
 */
(function() {
  'use strict';
  
  // Normalize hostname (remove www., etc.)
  const hostname = window.location.hostname.replace(/^www\./, '');
  let websiteId;
  
  // Choose website ID based on domain
  if (hostname === 'plaincode.github.io') {
    // Staging environment
    websiteId = 'd95a6272-74ed-4710-9b09-fc3937947531';
  } else if (hostname === 'plaincode.com') {
    // Production environment
    websiteId = '128a0259-e530-410b-9fad-5c20f0e2610b';
  } else {
    // Fallback for localhost or other domains (optional: don't load analytics)
    return;
  }
  
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute('data-website-id', websiteId);
  document.head.appendChild(script);
})();
