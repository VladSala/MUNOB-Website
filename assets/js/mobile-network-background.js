(function () {
  'use strict';

  var mobileQuery = window.matchMedia('(max-width: 767px)');
  var backdrop = null;
  var surfaces = [];
  var ticking = false;

  function collectSurfaces() {
    var selectors = [
      '.committees-page #committees',
      '.country-matrix-page .matrix-content',
      '.news-page:not(.team-page):not(.committees-page):not(.country-matrix-page) .news-stories',
      '#pricing',
      '#sponsors'
    ];

    surfaces = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));

    if (document.body.classList.contains('team-page')) {
      surfaces.push(document.body);
    }

    surfaces.forEach(function (surface) {
      surface.classList.add('munob-network-surface');
    });
  }

  function isSurfaceVisible(surface) {
    if (surface === document.body) {
      return true;
    }

    var rect = surface.getBoundingClientRect();
    var viewportHeight = document.documentElement.clientHeight;
    return rect.bottom > 0 && rect.top < viewportHeight;
  }

  function updateBackdrop() {
    ticking = false;

    if (!backdrop) {
      return;
    }

    var viewportOffset = window.visualViewport ? window.visualViewport.offsetTop : 0;
    var documentViewportTop = window.scrollY + viewportOffset;
    backdrop.style.transform = 'translate3d(0, ' + documentViewportTop + 'px, 0)';

    var shouldShow = mobileQuery.matches && surfaces.some(isSurfaceVisible);
    backdrop.classList.toggle('is-visible', shouldShow);
  }

  function scheduleUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateBackdrop);
    }
  }

  function init() {
    collectSurfaces();

    if (!surfaces.length) {
      return;
    }

    backdrop = document.createElement('div');
    backdrop.className = 'munob-mobile-network-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(backdrop, document.body.firstChild);
    document.body.classList.add('munob-stable-network-ready');

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', scheduleUpdate);
    } else {
      mobileQuery.addListener(scheduleUpdate);
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', scheduleUpdate, { passive: true });
      window.visualViewport.addEventListener('scroll', scheduleUpdate, { passive: true });
    }

    updateBackdrop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
