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
