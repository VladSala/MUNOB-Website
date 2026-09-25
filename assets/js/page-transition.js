(function () {
  'use strict';

  var transitionKey = 'munob-page-transition';
  var root = document.documentElement;
  var body = document.body;
  var layer = document.querySelector('.page-transition-layer');
  var isLeaving = false;
  var topPause = 360;

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
    var maxWait = Math.min(1150, Math.max(500, startPosition / 6));

    window.scrollTo({ top: 0, behavior: 'smooth' });

    function waitForTop(now) {
      var currentPosition = window.pageYOffset || document.documentElement.scrollTop || 0;

      if (currentPosition < 2 || now - startedAt >= maxWait) {
        window.scrollTo(0, 0);
        window.setTimeout(callback, topPause);
        return;
      }

      window.requestAnimationFrame(waitForTop);
    }

    window.requestAnimationFrame(waitForTop);
  }

  function beginLeaving(destination) {
    isLeaving = true;
    saveTransitionRequest();
    body.classList.add('is-page-transition-leaving');

    window.setTimeout(function () {
      window.location.assign(destination);
    }, 420);
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
