(function () {
  'use strict';

  var mobileQuery = window.matchMedia('(max-width: 767px)');
  var backdrop = null;
  var surfaces = [];
  var ticking = false;
  var artworkHeight = 900;
  var initialPixelRatio = window.devicePixelRatio || 1;

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

    if (!mobileQuery.matches) {
      backdrop.classList.remove('is-visible');
      backdrop.style.width = '';
      backdrop.style.height = '';
      backdrop.style.backgroundSize = '';
      backdrop.style.transform = '';
      return;
    }

    var viewport = window.visualViewport;
    var viewportOffsetTop = viewport ? viewport.offsetTop : 0;
    var viewportOffsetLeft = viewport ? viewport.offsetLeft : 0;
    var viewportScale = viewport && viewport.scale ? viewport.scale : 1;
    var browserZoom = (window.devicePixelRatio || initialPixelRatio) / initialPixelRatio;
    var effectiveScale = Math.max(0.25, viewportScale * browserZoom);
    var viewportWidth = viewport ? viewport.width : document.documentElement.clientWidth;
    var viewportHeight = viewport ? viewport.height : document.documentElement.clientHeight;
    var documentViewportTop = window.scrollY + viewportOffsetTop;
    var documentViewportLeft = window.scrollX + viewportOffsetLeft;

    /* Counter the browser's page scale so the particle artwork keeps the same
       visual size while the foreground content is zoomed. */
    backdrop.style.width = Math.ceil(viewportWidth) + 'px';
    backdrop.style.height = Math.ceil(viewportHeight) + 'px';
    backdrop.style.backgroundSize = 'auto ' + (artworkHeight / effectiveScale).toFixed(3) + 'px';
    backdrop.style.transform = 'translate3d(' + documentViewportLeft + 'px, ' + documentViewportTop + 'px, 0)';

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
