(function () {
  'use strict';

  /* Shared navigation convention: add data-page-transition to links between
     completed MUNOB pages, each of which includes this script and its layer. */

  var transitionKey = 'munob-page-transition';
  var root = document.documentElement;
  var body = document.body;
  var layer = document.querySelector('.page-transition-layer');
  var isLeaving = false;
  var topPause = 180;

  function transitionWasRequested() {
    try {
      return window.sessionStorage.getItem(transitionKey) === '1';
    } catch (error) {
      return false;
    }
  }

  function saveTransitionRequest() {
    try {
      window.sessionStorage.setItem(transitionKey, '1');
    } catch (error) {
      // The outgoing transition still works if browser storage is unavailable.
    }
  }

  function clearTransitionRequest() {
    try {
      window.sessionStorage.removeItem(transitionKey);
    } catch (error) {
      // Nothing else is required when browser storage is unavailable.
    }
  }

  function openIncomingPage() {
    if (!transitionWasRequested() || !layer) {
      return;
    }

    layer.classList.add('page-transition-layer--opening');

    window.requestAnimationFrame(function () {
      root.classList.remove('munob-transition-arriving');
      clearTransitionRequest();
    });
  }

  function scrollToTopThen(callback) {
    var startPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (startPosition < 2 || reduceMotion) {
      window.scrollTo(0, 0);
      window.setTimeout(callback, topPause);
      return;
    }

    var startedAt = window.performance.now();
    /* Travel time grows gently for lower sections, rather than cutting the
       browser's scroll short and snapping visitors to the top. */
    var duration = Math.min(1050, Math.max(420, 320 + startPosition / 12));

    function easeInOutCubic(progress) {
      return progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }

    function animateToTop(now) {
      var progress = Math.min(1, (now - startedAt) / duration);
      var remainingDistance = startPosition * (1 - easeInOutCubic(progress));

      window.scrollTo(0, Math.round(remainingDistance));

      if (progress < 1) {
        window.requestAnimationFrame(animateToTop);
        return;
      }

      window.scrollTo(0, 0);
      window.setTimeout(callback, topPause);
    }

    window.requestAnimationFrame(animateToTop);
  }

  function beginLeaving(destination) {
    isLeaving = true;
    saveTransitionRequest();
    body.classList.add('is-page-transition-leaving');

    window.setTimeout(function () {
      window.location.assign(destination);
    }, 280);
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[data-page-transition]');

    if (!link || isLeaving || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') {
      return;
    }

    event.preventDefault();
    scrollToTopThen(function () {
      beginLeaving(link.href);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', openIncomingPage);
  } else {
    openIncomingPage();
  }
}());
