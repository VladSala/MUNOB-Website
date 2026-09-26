(function () {
  'use strict';

  var ensureAccountInterface = function () {
    var navbarContainer = document.querySelector('.scrolling-navbar > .container');

    if (!document.querySelector('.munob-account-trigger') && navbarContainer) {
      navbarContainer.insertAdjacentHTML('beforeend',
        '<button class="munob-account-trigger" type="button" aria-haspopup="dialog" ' +
          'aria-controls="munob-account-modal" aria-expanded="false">' +
          '<svg class="munob-account-trigger-icon" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 12.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm-7 7.25c.72-3.17 3.46-5.25 7-5.25s6.28 2.08 7 5.25" />' +
          '</svg>' +
          '<span class="munob-account-trigger-label">Account</span>' +
        '</button>');
    }

    if (!document.getElementById('munob-account-modal')) {
      document.body.insertAdjacentHTML('beforeend',
        '<div class="munob-account-modal" id="munob-account-modal" hidden>' +
          '<div class="munob-account-backdrop" data-account-close></div>' +
          '<section class="munob-account-dialog" role="dialog" aria-modal="true" ' +
            'aria-labelledby="munob-account-title" aria-describedby="munob-account-description">' +
            '<button class="munob-account-close" type="button" aria-label="Close account menu" data-account-close>' +
              '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '<div class="munob-account-mark" aria-hidden="true">' +
              '<img src="assets/img/logos/miniblue.png" alt="">' +
            '</div>' +
            '<p class="munob-account-eyebrow">MUNOB PLATFORM</p>' +
            '<h2 id="munob-account-title">Your conference starts here</h2>' +
            '<p id="munob-account-description">Sign in to your account or join MUNOB 2027 in the role that fits you.</p>' +
            '<a class="munob-account-login" href="account.html#login" data-page-transition>' +
              '<span><strong>Sign in</strong><small>Continue to your existing account</small></span>' +
              '<span class="munob-account-arrow" aria-hidden="true">&rarr;</span>' +
            '</a>' +
            '<div class="munob-account-divider"><span>New to MUNOB?</span></div>' +
            '<div class="munob-account-register-grid">' +
              '<a class="munob-account-role" href="account.html#delegate" data-page-transition>' +
                '<span class="munob-account-role-icon" aria-hidden="true">' +
                  '<svg viewBox="0 0 24 24"><path d="m3 9 9-5 9 5-9 5-9-5Zm4 3.2V17c2.9 2.1 7.1 2.1 10 0v-4.8" /></svg>' +
                '</span>' +
                '<span><strong>Register as a Delegate</strong><small>Apply through your school delegation</small></span>' +
              '</a>' +
              '<a class="munob-account-role" href="account.html#director" data-page-transition>' +
                '<span class="munob-account-role-icon" aria-hidden="true">' +
                  '<svg viewBox="0 0 24 24"><path d="M4 5.5h16v12H4zM8 21h8M12 17.5V21M8 10l2.5 2.5L16 8" /></svg>' +
                '</span>' +
                '<span><strong>Register as a MUN Director</strong><small>Create and manage a school delegation</small></span>' +
              '</a>' +
            '</div>' +
          '</section>' +
        '</div>');
    }
  };

  ensureAccountInterface();

  var trigger = document.querySelector('.munob-account-trigger');
  var modal = document.getElementById('munob-account-modal');

  if (!trigger || !modal) {
    return;
  }

  var dialog = modal.querySelector('.munob-account-dialog');
  var closeControls = modal.querySelectorAll('[data-account-close]');
  var closingTimer = null;
  var focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  var openModal = function () {
    window.clearTimeout(closingTimer);
    modal.hidden = false;
    document.body.classList.add('munob-account-open');
    trigger.setAttribute('aria-expanded', 'true');

    window.requestAnimationFrame(function () {
      modal.classList.add('is-open');
      var firstControl = dialog.querySelector(focusableSelector);
      if (firstControl) {
        firstControl.focus();
      }
    });
  };

  var closeModal = function () {
    if (modal.hidden) {
      return;
    }

    modal.classList.remove('is-open');
    document.body.classList.remove('munob-account-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();

    closingTimer = window.setTimeout(function () {
      modal.hidden = true;
    }, 220);
  };

  trigger.addEventListener('click', function () {
    if (modal.hidden) {
      openModal();
    } else {
      closeModal();
    }
  });

  closeControls.forEach(function (control) {
    control.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (event) {
    if (modal.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    var focusable = Array.prototype.slice.call(dialog.querySelectorAll(focusableSelector));
    if (!focusable.length) {
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}());
