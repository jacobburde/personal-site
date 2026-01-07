/**
 * Fulgurations - Poem Loader
 * Loads and renders individual poems from markdown files
 */

(function() {
  'use strict';

  var POEMS_PATH = 'poems/';
  var INDEX_PATH = 'poems/index.json';

  /**
   * Load poem manifest to get navigation info
   * @returns {Promise<Array>} Array of poem metadata
   */
  function loadManifest() {
    return fetch(INDEX_PATH)
      .then(function(response) {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .catch(function() {
        return [];
      });
  }

  /**
   * Find adjacent poems for navigation
   * @param {Array} poems - All poems from manifest
   * @param {string} currentSlug - Current poem slug
   * @returns {Object} { prev: {...}, next: {...} }
   */
  function getAdjacentPoems(poems, currentSlug) {
    var result = { prev: null, next: null };

    if (!poems || poems.length === 0) {
      return result;
    }

    // Sort by order if available
    var sorted = poems.slice().sort(function(a, b) {
      var orderA = typeof a.order === 'number' ? a.order : 999;
      var orderB = typeof b.order === 'number' ? b.order : 999;
      return orderA - orderB;
    });

    var currentIndex = -1;
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].slug === currentSlug) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex > 0) {
      result.prev = sorted[currentIndex - 1];
    }
    if (currentIndex >= 0 && currentIndex < sorted.length - 1) {
      result.next = sorted[currentIndex + 1];
    }

    return result;
  }

  /**
   * Load a poem by slug
   * @param {string} slug - Poem identifier (filename without extension)
   * @returns {Promise<Object>} Parsed poem data
   */
  function loadPoem(slug) {
    var url = POEMS_PATH + slug + '.md';

    return fetch(url)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Poem not found');
        }
        return response.text();
      })
      .then(function(content) {
        return window.BlakeMarkdown.parse(content);
      });
  }

  /**
   * Render poem to the page
   * @param {Object} poem - Parsed poem object
   * @param {Object} navigation - Adjacent poems for nav
   */
  function renderPoem(poem, navigation) {
    var articleEl = document.querySelector('.poem-article');
    var titleEl = document.querySelector('.poem-title');
    var bodyEl = document.querySelector('.poem-body');

    // Header nav
    var prevLink = document.querySelector('.nav-prev');
    var nextLink = document.querySelector('.nav-next');

    // Footer nav
    var prevFooter = document.querySelector('.nav-prev-footer');
    var nextFooter = document.querySelector('.nav-next-footer');

    // Set title
    if (titleEl) {
      titleEl.textContent = poem.meta.title || 'Untitled';
      document.title = (poem.meta.title || 'Poem') + ' | Fulgurations';
    }

    // Set poem body - HTML is pre-sanitized by BlakeMarkdown.parse()
    // which escapes all user content before converting to HTML
    if (bodyEl) {
      bodyEl.innerHTML = poem.html;
    }

    // Show article
    if (articleEl) {
      articleEl.removeAttribute('hidden');
    }

    // Set up header navigation
    if (prevLink) {
      if (navigation.prev) {
        prevLink.href = 'poem.html?poem=' + navigation.prev.slug;
        prevLink.textContent = 'Previous';
        prevLink.removeAttribute('hidden');
      }
    }

    if (nextLink) {
      if (navigation.next) {
        nextLink.href = 'poem.html?poem=' + navigation.next.slug;
        nextLink.textContent = 'Next';
        nextLink.removeAttribute('hidden');
      }
    }

    // Set up footer navigation
    if (prevFooter) {
      if (navigation.prev) {
        prevFooter.href = 'poem.html?poem=' + navigation.prev.slug;
        prevFooter.textContent = 'Previous: ' + (navigation.prev.title || 'Untitled');
        prevFooter.removeAttribute('hidden');
      }
    }

    if (nextFooter) {
      if (navigation.next) {
        nextFooter.href = 'poem.html?poem=' + navigation.next.slug;
        nextFooter.textContent = 'Next: ' + (navigation.next.title || 'Untitled');
        nextFooter.removeAttribute('hidden');
      }
    }
  }

  /**
   * Show error state
   */
  function showError() {
    var errorEl = document.querySelector('.poem-error');
    if (errorEl) {
      errorEl.removeAttribute('hidden');
    }
  }

  /**
   * Initialize poem page
   */
  function init() {
    var params = window.BlakePoetry.getQueryParams();
    var slug = params.poem;

    if (!slug) {
      showError();
      return;
    }

    // Sanitize slug - only allow alphanumeric and hyphens
    slug = slug.replace(/[^a-zA-Z0-9-]/g, '');

    if (!slug) {
      showError();
      return;
    }

    // Load manifest and poem in parallel
    Promise.all([
      loadPoem(slug),
      loadManifest()
    ]).then(function(results) {
      var poem = results[0];
      var manifest = results[1];
      var navigation = getAdjacentPoems(manifest, slug);
      renderPoem(poem, navigation);
    }).catch(function() {
      showError();
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
