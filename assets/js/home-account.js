(function () {
  'use strict';

  var navbarContainer = document.querySelector('.scrolling-navbar > .container');

  if (!document.querySelector('.munob-account-trigger') && navbarContainer) {
    navbarContainer.insertAdjacentHTML('beforeend',
      '<a class="munob-account-trigger" href="account.html#login" data-page-transition aria-label="Login or register">' +
        '<svg class="munob-account-trigger-icon" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M12 12.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm-7 7.25c.72-3.17 3.46-5.25 7-5.25s6.28 2.08 7 5.25" />' +
        '</svg>' +
        '<span class="munob-account-trigger-label">Login / Register</span>' +
      '</a>');
  }
}());
