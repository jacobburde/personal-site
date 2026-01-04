/**
 * Blake-Inspired Poetry Site - Poem Loader
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
    var page = document.querySelector('.poem-page');
    var titleEl = document.querySelector('.poem-title');
    var attributionEl = document.querySelector('.poem-attribution');
    var bodyEl = document.querySelector('.poem-body');
    var loadingEl = document.querySelector('.poem-loading');
    var contentEl = document.querySelector('.poem-content-wrapper');
    var prevLink = document.querySelector('.nav-prev');
    var nextLink = document.querySelector('.nav-next');

    // Hide loading
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }

    // Show content
    if (contentEl) {
      contentEl.style.display = 'block';
    }

    // Set title
    if (titleEl) {
      titleEl.textContent = poem.meta.title || 'Untitled';
      document.title = (poem.meta.title || 'Poem') + ' | Blake\'s Illuminations';
    }

    // Set attribution if available
    if (attributionEl && poem.meta.attribution) {
      attributionEl.textContent = poem.meta.attribution;
      attributionEl.style.display = 'block';
    } else if (attributionEl) {
      attributionEl.style.display = 'none';
    }

    // Set poem body
    if (bodyEl) {
      bodyEl.innerHTML = poem.html;
    }

    // Apply texture
    if (page && poem.meta.texture) {
      window.BlakePoetry.applyTexture(page, poem.meta.texture);
    }

    // Apply border theme
    if (page && poem.meta.border) {
      page.classList.add('border-theme-' + poem.meta.border);
    }

    // Set up navigation
    if (prevLink) {
      if (navigation.prev) {
        prevLink.href = 'poem.html?poem=' + navigation.prev.slug;
        prevLink.textContent = navigation.prev.title || 'Previous';
        prevLink.removeAttribute('hidden');
      } else {
        prevLink.setAttribute('hidden', '');
      }
    }

    if (nextLink) {
      if (navigation.next) {
        nextLink.href = 'poem.html?poem=' + navigation.next.slug;
        nextLink.textContent = navigation.next.title || 'Next';
        nextLink.removeAttribute('hidden');
      } else {
        nextLink.setAttribute('hidden', '');
      }
    }
  }

  /**
   * Show error state
   * @param {string} message - Error message
   */
  function showError(message) {
    var loadingEl = document.querySelector('.poem-loading');
    var errorEl = document.querySelector('.poem-error');
    var errorText = document.querySelector('.error-text');

    if (loadingEl) {
      loadingEl.style.display = 'none';
    }

    if (errorEl) {
      errorEl.style.display = 'block';
    }

    if (errorText) {
      errorText.textContent = message;
    }
  }

  /**
   * Initialize poem page
   */
  function init() {
    var params = window.BlakePoetry.getQueryParams();
    var slug = params.poem;

    if (!slug) {
      showError('No poem specified');
      return;
    }

    // Sanitize slug - only allow alphanumeric and hyphens
    slug = slug.replace(/[^a-zA-Z0-9-]/g, '');

    if (!slug) {
      showError('Invalid poem identifier');
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
    }).catch(function(error) {
      showError('Could not load poem: ' + (error.message || 'Unknown error'));
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
