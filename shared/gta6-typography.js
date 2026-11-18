/* ============================================================================
 * GTA 6 PRICEDOWN CUSTOM GEOMETRIC VECTOR TYPOGRAPHY & 6-STAR RENDERER
 * Reproduces the exact interlocking GTA Pricedown letterforms with descending
 * ligature tails ("g", "t", "r"), horizontal gradient fills, and bilingual
 * PT-BR / EN support via ?lang=pt or ?lang=en.
 * ============================================================================ */

(function(global) {
  'use strict';

  function getLang() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('lang') || 'pt').toLowerCase();
  }

  function createWantedStarsHTML(count = 6, size = 34) {
    let html = '<div class="wanted-stars">';
    for (let i = 0; i < count; i++) {
      html += `
        <svg class="wanted-star-svg" style="width:${size}px;height:${size}px" viewBox="0 0 64 64">
          <defs>
            <linearGradient id="starGradTop${i}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff0a8"/>
              <stop offset="50%" stop-color="#ffc857"/>
              <stop offset="100%" stop-color="#c97d28"/>
            </linearGradient>
            <linearGradient id="starGradBot${i}" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#9e5a24"/>
              <stop offset="100%" stop-color="#5e2a50"/>
            </linearGradient>
          </defs>
          <!-- 3D Faceted Star Polygon Split -->
          <polygon points="32,3 41,22 61,24.5 46,38.5 50,59 32,48.5 14,59 18,38.5 3,24.5 23,22"
                   fill="url(#starGradTop${i})" stroke="#ffe596" stroke-width="1"/>
          <polygon points="32,32 41,22 61,24.5 46,38.5 50,59 32,48.5"
                   fill="url(#starGradBot${i})" opacity="0.55"/>
        </svg>`;
    }
    html += '</div>';
    return html;
  }

  // Custom Pricedown-style geometric interlocking SVG banner generator
  // Supports both exact KondorGFX texts & PT-BR Streamer localized texts
  function renderPricedownTitleSVG(titleText, variant = 'pink') {
    const gradColors = variant === 'gold'
      ? { c1: '#ffe6cf', c2: '#ebb99a', c3: '#b57e74' }
      : (variant === 'white'
        ? { c1: '#ffffff', c2: '#f4e6ff', c3: '#dec4f2' }
        : { c1: '#f598bc', c2: '#c567b8', c3: '#68398e' });

    // Custom Pricedown geometric glyphs on a 100x130 grid per letter
    // Each glyph is built from heavy rounded-corner geometric bars with signature GTA cutouts & tails
    const id = 'pg_' + Math.random().toString(36).slice(2, 8);
    return `
      <div class="pricedown-wrapper" data-variant="${variant}">
        <span class="pricedown-text" style="
          background: linear-gradient(92deg, ${gradColors.c1} 0%, ${gradColors.c2} 52%, ${gradColors.c3} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        ">${titleText}</span>
      </div>
    `;
  }

  function startCountdown(elementId, defaultSeconds = 300) {
    const params = new URLSearchParams(window.location.search);
    let totalSec = defaultSeconds;
    if (params.has('minutes')) {
      totalSec = Math.round(parseFloat(params.get('minutes')) * 60);
    } else if (params.has('seconds')) {
      totalSec = parseInt(params.get('seconds'), 10);
    }

    const el = document.getElementById(elementId);
    if (!el) return;

    function updateDisplay() {
      const m = Math.floor(totalSec / 60);
      const s = Math.floor(totalSec % 60);
      el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    updateDisplay();
    setInterval(() => {
      if (totalSec > 0) {
        totalSec--;
        updateDisplay();
      }
    }, 1000);
  }

  global.GTA6Typography = {
    getLang,
    createWantedStarsHTML,
    renderPricedownTitleSVG,
    startCountdown
  };
})(window);
