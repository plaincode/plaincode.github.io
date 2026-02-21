/**
 * Theme Toggle Functionality
 * Supports automatic system preference detection and manual override
 * Stores preference in localStorage (no cookies)
 */
(function() {
  'use strict';

  // Apply theme immediately to prevent flash
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // User has a saved preference - apply it
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    // If no saved preference, CSS media query handles system preference automatically
  }

  // Apply theme before DOM loads to prevent flash
  initTheme();

  // Set up theme toggle button after DOM loads
  function setupThemeToggle() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (!toggleButton) return;

    toggleButton.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      let newTheme;

      if (currentTheme === 'dark') {
        // Switch to light
        newTheme = 'light';
      } else if (currentTheme === 'light') {
        // Switch to dark
        newTheme = 'dark';
      } else {
        // No manual override yet - check system preference and toggle opposite
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        newTheme = prefersDark ? 'light' : 'dark';
      }

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeToggle);
  } else {
    setupThemeToggle();
  }
})();

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
 * Custom comment rendering via Cusdis REST API
 * Fetches approved comments and renders them natively — no iframe.
 * A modal popup handles new comment submission.
 */
(function() {
  'use strict';

  var MODAL_HTML =
    '<div class="comment-modal-overlay" id="comment-modal-overlay">' +
    '<div class="comment-modal" role="dialog" aria-modal="true" aria-labelledby="cm-title">' +
    '<h4 id="cm-title">Leave a Comment</h4>' +
    '<label for="cm-name">Name</label>' +
    '<input type="text" id="cm-name" placeholder="Your name" autocomplete="name">' +
    '<label for="cm-email">Email <span class="cm-optional">(optional, not shown publicly)</span></label>' +
    '<input type="email" id="cm-email" placeholder="your@email.com" autocomplete="email">' +
    '<p class="comment-modal-notice cm-gravatar-notice">If you provide an email, we use <a href="https://gravatar.com" target="_blank" rel="noopener">Gravatar</a> to show a profile picture next to your comment. Your email is never displayed publicly.</p>' +
    '<label for="cm-content">Comment</label>' +
    '<textarea id="cm-content" placeholder="Write your comment\u2026"></textarea>' +
    '<p class="comment-modal-notice">Comments are reviewed before appearing publicly.</p>' +
    '<div class="comment-modal-actions">' +
    '<button class="btn-cancel-comment" id="cm-cancel">Cancel</button>' +
    '<button class="btn-submit-comment" id="cm-submit">Submit</button>' +
    '</div>' +
    '<p class="comment-submit-success" id="cm-success" style="display:none">Thanks! Your comment is awaiting approval.</p>' +
    '<p class="cm-reply-context" id="cm-reply-context" style="display:none"></p>' +
    '</div></div>';

  function updateModalTitle(replyToName) {
    var el = document.getElementById('cm-title');
    var ctx = document.getElementById('cm-reply-context');
    if (!el) return;
    if (replyToName) {
      el.textContent = 'Leave a Reply';
      if (ctx) { ctx.textContent = 'Replying to ' + replyToName; ctx.style.display = 'block'; }
    } else {
      el.textContent = 'Leave a Comment';
      if (ctx) ctx.style.display = 'none';
    }
  }

  function injectModal() {
    if (document.getElementById('comment-modal-overlay')) return;
    var div = document.createElement('div');
    div.innerHTML = MODAL_HTML;
    document.body.appendChild(div.firstChild);
    document.getElementById('cm-cancel').addEventListener('click', closeModal);
    document.getElementById('cm-submit').addEventListener('click', submitComment);
    document.getElementById('comment-modal-overlay').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  var currentSection  = null;
  var currentParentId = null;

  function openModal(section, parentId, replyToName) {
    currentSection  = section;
    currentParentId = parentId || null;
    var overlay = document.getElementById('comment-modal-overlay');
    overlay.classList.add('open');
    document.getElementById('cm-name').value    = '';
    document.getElementById('cm-email').value   = '';
    document.getElementById('cm-content').value = '';
    document.getElementById('cm-success').style.display = 'none';
    document.getElementById('cm-submit').disabled = false;
    updateModalTitle(replyToName || null);
    document.getElementById('cm-name').focus();
  }

  function closeModal() {
    var overlay = document.getElementById('comment-modal-overlay');
    if (overlay) overlay.classList.remove('open');
    currentSection  = null;
    currentParentId = null;
  }

  function formatDate(str) {
    try {
      return new Date(str).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch(e) { return ''; }
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function sha256Hex(str) {
    var buf = new TextEncoder().encode(str.trim().toLowerCase());
    return crypto.subtle.digest('SHA-256', buf).then(function(hash) {
      return Array.from(new Uint8Array(hash))
        .map(function(b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  function buildAvatarMap(comments) {
    // gravatar_hash is pre-computed server-side (by_email is not exposed by the API)
    var map = {};
    function collect(list) {
      list.forEach(function(c) {
        if (c.gravatar_hash) map[c.id] = 'https://www.gravatar.com/avatar/' + c.gravatar_hash + '?s=40&d=404';
        var nested = (c.replies && c.replies.data) ? c.replies.data : (c._children || []);
        if (nested.length) collect(nested);
      });
    }
    collect(comments);
    return Promise.resolve(map);
  }

  function renderComment(c, avatarMap) {
    var author = esc(c.by_nickname || 'Anonymous');
    var avatarUrl = c.gravatar_hash && avatarMap && avatarMap[c.id];
    var avatarHtml = avatarUrl
      ? '<img class="comment-avatar" src="' + esc(avatarUrl) + '" alt="" ' +
        'onerror="this.style.display=\'none\'" width="20" height="20">'
      : '';
    var html = '<div class="comment-item" data-comment-id="' + esc(c.id) + '">' +
      '<div class="comment-meta">' +
      avatarHtml +
      '<span class="comment-author">' + author + '</span>' +
      '<span class="comment-date">' + formatDate(c.createdAt) + '</span>' +
      '<button class="btn-reply-comment" data-id="' + esc(c.id) + '" data-author="' + author + '">Reply</button>' +
      '</div><div class="comment-content">' + esc(c.content) + '</div>';
    var nested = (c.replies && c.replies.data && c.replies.data.length)
      ? c.replies.data : (c._children && c._children.length ? c._children : []);
    if (nested.length) {
      html += '<div class="comment-replies">';
      nested.forEach(function(r) { html += renderComment(r, avatarMap); });
      html += '</div>';
    }
    return html + '</div>';
  }

  function renderComments(container, comments, avatarMap) {
    if (!comments || !comments.length) {
      container.innerHTML = '<p class="comments-empty">No comments yet. Be the first!</p>';
      return;
    }
    container.innerHTML = comments.map(function(c) { return renderComment(c, avatarMap); }).join('');
  }

  function fetchComments(section) {
    var host   = section.dataset.cusdisHost;
    var appId  = section.dataset.cusdisAppId;
    var pageId = section.dataset.cusdisPageId;
    var list   = section.querySelector('.comments-list');
    if (!list || !host || !appId) return;

    var allComments = [];

    function fetchPage(page) {
      var url = host + '/api/open/comments?appId=' + encodeURIComponent(appId) +
                '&pageId=' + encodeURIComponent(pageId) + '&page=' + page;
      return fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var payload    = data && data.data;
          var batch      = (payload && payload.data) ? payload.data : [];
          var pageCount  = (payload && payload.pageCount) ? payload.pageCount : 1;
          allComments = allComments.concat(batch);
          if (page < pageCount) return fetchPage(page + 1);
        });
    }

    fetchPage(1)
      .then(function() { return buildAvatarMap(allComments); })
      .then(function(avatarMap) { renderComments(list, allComments, avatarMap); })
      .catch(function() {
        list.innerHTML = '<p class="comments-empty">Could not load comments.</p>';
      });
  }

  function submitComment() {
    if (!currentSection) return;
    var nickname = document.getElementById('cm-name').value.trim();
    var content  = document.getElementById('cm-content').value.trim();
    if (!nickname) { document.getElementById('cm-name').focus(); return; }
    if (!content)  { document.getElementById('cm-content').focus(); return; }
    document.getElementById('cm-submit').disabled = true;
    fetch(currentSection.dataset.cusdisHost + '/api/open/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appId:     currentSection.dataset.cusdisAppId,
        pageId:    currentSection.dataset.cusdisPageId,
        content:   content,
        nickname:  nickname,
        email:     document.getElementById('cm-email').value.trim(),
        pageTitle: currentSection.dataset.cusdisPageTitle || '',
        pageUrl:   currentSection.dataset.cusdisPageUrl || window.location.href,
        parentId:  currentParentId || undefined
      })
    })
    .then(function() {
      document.getElementById('cm-success').style.display = 'block';
      setTimeout(closeModal, 2500);
    })
    .catch(function() {
      document.getElementById('cm-submit').disabled = false;
    });
  }

  function initCommentSections() {
    var sections = document.querySelectorAll('.comments-section[data-cusdis-app-id]');
    if (!sections.length) return;
    injectModal();
    sections.forEach(function(section) {
      fetchComments(section);
      var btns = section.querySelectorAll('.btn-add-comment');
      btns.forEach(function(btn) {
        btn.addEventListener('click', function() { openModal(section); });
      });

      // Event delegation for reply buttons inside the comments list
      var list = section.querySelector('.comments-list');
      if (list) {
        list.addEventListener('click', function(e) {
          var replyBtn = e.target.closest('.btn-reply-comment');
          if (!replyBtn) return;
          openModal(section, replyBtn.dataset.id, replyBtn.dataset.author);
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommentSections);
  } else {
    initCommentSections();
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
