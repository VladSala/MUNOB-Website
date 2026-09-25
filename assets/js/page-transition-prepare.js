(function () {
  'use strict';

  try {
    if (window.sessionStorage.getItem('munob-page-transition') === '1') {
      document.documentElement.classList.add('munob-transition-arriving');
    }
  } catch (error) {
    // The page still works when browser storage is unavailable.
  }
}());
