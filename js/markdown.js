/**
 * Blake-Inspired Poetry Site - Lightweight Markdown Parser
 * Parses frontmatter and converts simple markdown to HTML
 * Optimized for poetry: preserves line breaks, creates stanzas from blank lines
 */

(function() {
  'use strict';

  /**
   * Parse YAML-like frontmatter from markdown content
   * @param {string} content - Raw markdown with frontmatter
   * @returns {Object} { meta: {}, body: string }
   */
  function parseFrontmatter(content) {
    var result = {
      meta: {},
      body: content
    };

    // Check for frontmatter delimiter
    if (!content.startsWith('---')) {
      return result;
    }

    // Find closing delimiter
    var endIndex = content.indexOf('\n---', 3);
    if (endIndex === -1) {
      return result;
    }

    // Extract frontmatter block
    var frontmatter = content.substring(4, endIndex).trim();
    result.body = content.substring(endIndex + 4).trim();

    // Parse key: value pairs
    frontmatter.split('\n').forEach(function(line) {
      var colonIndex = line.indexOf(':');
      if (colonIndex === -1) return;

      var key = line.substring(0, colonIndex).trim();
      var value = line.substring(colonIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parse numbers
      if (!isNaN(value) && value !== '') {
        value = Number(value);
      }

      result.meta[key] = value;
    });

    return result;
  }

  /**
   * Convert poem markdown to HTML
   * - Blank lines become paragraph breaks (stanzas)
   * - Single line breaks become <br>
   * - Basic emphasis: *italic*, **bold**
   * @param {string} markdown - Poem content in markdown
   * @returns {string} HTML string
   */
  function poemToHtml(markdown) {
    if (!markdown) return '';

    // Escape HTML first
    var escaped = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Split into stanzas (separated by blank lines)
    var stanzas = escaped.split(/\n\s*\n/);

    var html = stanzas.map(function(stanza) {
      // Process emphasis (bold first, then italic)
      var processed = stanza
        // Bold: **text**
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic: *text* (safe after bold is processed)
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // Convert single line breaks to <br>
      processed = processed.split('\n').join('<br>\n');

      return '<p>' + processed + '</p>';
    }).join('\n\n');

    return html;
  }

  /**
   * Extract first line or first N characters as excerpt
   * @param {string} body - Poem body text
   * @param {number} maxLength - Maximum excerpt length
   * @returns {string} Excerpt text
   */
  function getExcerpt(body, maxLength) {
    maxLength = maxLength || 100;

    // Get first non-empty line
    var lines = body.trim().split('\n');
    var firstLine = '';

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line) {
        firstLine = line;
        break;
      }
    }

    // Truncate if needed
    if (firstLine.length > maxLength) {
      return firstLine.substring(0, maxLength).trim() + '...';
    }

    return firstLine;
  }

  /**
   * Full parse: frontmatter + markdown to HTML
   * @param {string} content - Raw markdown file content
   * @returns {Object} { meta: {}, html: string, excerpt: string }
   */
  function parse(content) {
    var parsed = parseFrontmatter(content);

    return {
      meta: parsed.meta,
      html: poemToHtml(parsed.body),
      excerpt: getExcerpt(parsed.body),
      raw: parsed.body
    };
  }

  // Export parser
  window.BlakeMarkdown = {
    parseFrontmatter: parseFrontmatter,
    poemToHtml: poemToHtml,
    getExcerpt: getExcerpt,
    parse: parse
  };

})();
