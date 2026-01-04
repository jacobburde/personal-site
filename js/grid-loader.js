/**
 * Blake-Inspired Poetry Site - Grid Loader
 * Builds the landing page poem grid from manifest
 */

(function() {
  'use strict';

  var INDEX_PATH = 'poems/index.json';

  /**
   * Create a poem card element
   * @param {Object} poem - Poem metadata from manifest
   * @returns {HTMLElement} Card element
   */
  function createPoemCard(poem) {
    var card = document.createElement('article');
    card.className = 'poem-card';

    // Apply texture if specified
    if (poem.texture) {
      var baseTextures = ['dark-paper', 'aged-parchment', 'scratched-metal'];
      var texturePath;

      if (baseTextures.indexOf(poem.texture) !== -1) {
        texturePath = 'assets/textures/base/' + poem.texture + '.webp';
      } else {
        texturePath = 'assets/textures/poems/' + poem.texture + '.webp';
      }

      card.style.setProperty('--card-texture', 'url("' + texturePath + '")');
    }

    // Create link wrapper
    var link = document.createElement('a');
    link.href = 'poem.html?poem=' + encodeURIComponent(poem.slug);
    link.className = 'poem-card-link';

    // Create content container
    var content = document.createElement('div');
    content.className = 'poem-card-content';

    // Title
    var title = document.createElement('h2');
    title.className = 'poem-card-title';
    title.textContent = poem.title || poem.slug;

    content.appendChild(title);

    // Excerpt if available
    if (poem.excerpt) {
      var excerpt = document.createElement('p');
      excerpt.className = 'poem-card-excerpt';
      excerpt.textContent = poem.excerpt;
      content.appendChild(excerpt);
    }

    link.appendChild(content);
    card.appendChild(link);

    return card;
  }

  /**
   * Create the blank illumination empty state
   * @returns {HTMLElement} Empty state element
   */
  function createEmptyState() {
    var container = document.createElement('div');
    container.className = 'grid-empty';

    var frame = document.createElement('div');
    frame.className = 'blank-frame illuminated-frame border-classical';

    // Corner elements
    var corners = ['tl', 'tr', 'bl', 'br'];
    corners.forEach(function(pos) {
      var corner = document.createElement('span');
      corner.className = 'corner corner--' + pos + ' border-element';
      corner.setAttribute('aria-hidden', 'true');
      frame.appendChild(corner);
    });

    // Central breathing dot
    var center = document.createElement('span');
    center.className = 'blank-center';
    center.setAttribute('aria-hidden', 'true');
    frame.appendChild(center);

    container.appendChild(frame);
    return container;
  }

  /**
   * Load and render the poem grid
   */
  function loadGrid() {
    var gridEl = document.querySelector('.poem-grid');

    if (!gridEl) {
      return;
    }

    fetch(INDEX_PATH)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Could not load poem index');
        }
        return response.json();
      })
      .then(function(poems) {
        // Clear loading state
        gridEl.innerHTML = '';

        if (!poems || poems.length === 0) {
          // Show empty state
          gridEl.appendChild(createEmptyState());
          return;
        }

        // Sort by order
        poems.sort(function(a, b) {
          var orderA = typeof a.order === 'number' ? a.order : 999;
          var orderB = typeof b.order === 'number' ? b.order : 999;
          return orderA - orderB;
        });

        // Create cards
        poems.forEach(function(poem) {
          var card = createPoemCard(poem);
          gridEl.appendChild(card);
        });
      })
      .catch(function(error) {
        // On error, show empty state
        console.warn('Grid loading error:', error.message);
        gridEl.innerHTML = '';
        gridEl.appendChild(createEmptyState());
      });
  }

  /**
   * Initialize grid page
   */
  function init() {
    loadGrid();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
