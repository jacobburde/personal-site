/**
 * Fulgurations - Grid Loader
 * Builds the landing page poem list from manifest
 */

(function() {
  'use strict';

  var INDEX_PATH = 'poems/index.json';

  /**
   * Create a poem list item
   * @param {Object} poem - Poem metadata from manifest
   * @returns {HTMLElement} List item element
   */
  function createPoemItem(poem) {
    var li = document.createElement('li');
    li.className = 'poem-list-item';

    var link = document.createElement('a');
    link.href = 'poem.html?poem=' + encodeURIComponent(poem.slug);
    link.className = 'poem-list-link';

    var title = document.createElement('h2');
    title.className = 'poem-list-title';
    title.textContent = poem.title || poem.slug;

    link.appendChild(title);

    if (poem.excerpt) {
      var excerpt = document.createElement('p');
      excerpt.className = 'poem-list-excerpt';
      excerpt.textContent = poem.excerpt;
      link.appendChild(excerpt);
    }

    li.appendChild(link);
    return li;
  }

  /**
   * Load and render the poem list
   */
  function loadIndex() {
    var indexEl = document.querySelector('.poem-index');

    if (!indexEl) {
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
        if (!poems || poems.length === 0) {
          return;
        }

        // Sort by order
        poems.sort(function(a, b) {
          var orderA = typeof a.order === 'number' ? a.order : 999;
          var orderB = typeof b.order === 'number' ? b.order : 999;
          return orderA - orderB;
        });

        // Create list
        var list = document.createElement('ul');
        list.className = 'poem-list fade-in';

        poems.forEach(function(poem) {
          var item = createPoemItem(poem);
          list.appendChild(item);
        });

        indexEl.appendChild(list);
      })
      .catch(function(error) {
        console.warn('Index loading error:', error.message);
      });
  }

  /**
   * Initialize index page
   */
  function init() {
    loadIndex();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
