/**
 * Fulgurations - Main JavaScript
 * Shared utilities
 */

(function() {
  'use strict';

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

  // Export utilities to global scope
  window.BlakePoetry = {
    escapeHtml: escapeHtml,
    getQueryParams: getQueryParams
  };

})();
