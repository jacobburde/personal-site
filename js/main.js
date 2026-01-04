/**
 * Blake-Inspired Poetry Site - Main JavaScript
 * Shared utilities and font loading
 */

(function() {
  'use strict';

  /**
   * Font Loading Handler
   * Adds 'fonts-loaded' class when custom fonts are ready
   */
  function initFontLoading() {
    // Mark as loading initially
    document.documentElement.classList.add('fonts-loading');

    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('400 1em "EB Garamond"'),
        document.fonts.load('400 1em "Cinzel Decorative"'),
        document.fonts.load('400 1em "Cormorant Garamond"')
      ]).then(function() {
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-loaded');
      }).catch(function() {
        // Fonts failed to load, still show content
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      // Font loading API not supported, show content anyway
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
    }
  }

  /**
   * Apply border theme based on data attribute
   * @param {HTMLElement} element - Element with data-border attribute
   */
  function applyBorderTheme(element) {
    var border = element.dataset.border;
    if (border) {
      element.classList.add('border-theme-' + border);
    }
  }

  /**
   * Apply texture based on data attribute or frontmatter
   * @param {HTMLElement} element - Element to apply texture to
   * @param {string} textureName - Name of the texture file (without path/extension)
   */
  function applyTexture(element, textureName) {
    if (!textureName) return;

    // Check if it's a base texture or poem-specific
    var texturePath;
    var baseTextures = ['dark-paper', 'aged-parchment', 'scratched-metal'];

    if (baseTextures.indexOf(textureName) !== -1) {
      texturePath = 'assets/textures/base/' + textureName + '.webp';
    } else {
      texturePath = 'assets/textures/poems/' + textureName + '.webp';
    }

    element.style.setProperty('--texture-primary', 'url("' + texturePath + '")');
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get URL query parameters
   * @returns {Object} Query parameters as key-value pairs
   */
  function getQueryParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (!search) return params;

    search.split('&').forEach(function(pair) {
      var parts = pair.split('=');
      var key = decodeURIComponent(parts[0]);
      var value = parts[1] ? decodeURIComponent(parts[1]) : '';
      params[key] = value;
    });

    return params;
  }

  /**
   * Debounce function for performance
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  // Export utilities to global scope
  window.BlakePoetry = {
    applyBorderTheme: applyBorderTheme,
    applyTexture: applyTexture,
    escapeHtml: escapeHtml,
    getQueryParams: getQueryParams,
    debounce: debounce
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFontLoading);
  } else {
    initFontLoading();
  }

})();
