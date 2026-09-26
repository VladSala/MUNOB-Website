(function () {
  'use strict';

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-auth-mode]'));
  var panels = {
    login: document.getElementById('account-login-panel'),
    register: document.getElementById('account-register-panel')
  };
  var roleChoices = Array.prototype.slice.call(document.querySelectorAll('[data-register-role]'));
  var registrationForms = Array.prototype.slice.call(document.querySelectorAll('[data-registration-form]'));

  var setMode = function (mode, updateHistory) {
    var selectedMode = mode === 'register' ? 'register' : 'login';
    tabs.forEach(function (tab) {
      var active = tab.dataset.authMode === selectedMode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    Object.keys(panels).forEach(function (key) {
      var active = key === selectedMode;
      panels[key].classList.toggle('is-active', active);
      panels[key].hidden = !active;
    });

    if (updateHistory) {
      window.history.replaceState(null, '', selectedMode === 'login' ? '#login' : '#delegate');
    }
  };

  var setRole = function (role, updateHistory) {
    var selectedRole = role === 'director' ? 'director' : 'delegate';
    roleChoices.forEach(function (choice) {
      var active = choice.dataset.registerRole === selectedRole;
      choice.classList.toggle('is-active', active);
      choice.setAttribute('aria-pressed', String(active));
    });

    registrationForms.forEach(function (form) {
      var active = form.dataset.registrationForm === selectedRole;
      form.classList.toggle('is-active', active);
      form.hidden = !active;
    });

    if (updateHistory) {
      window.history.replaceState(null, '', '#' + selectedRole);
    }
  };

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      setMode(tab.dataset.authMode, true);
    });
  });

  roleChoices.forEach(function (choice) {
    choice.addEventListener('click', function () {
      setRole(choice.dataset.registerRole, true);
    });
  });

  document.querySelectorAll('.account-password-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var input = toggle.parentElement.querySelector('input');
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      toggle.textContent = showing ? 'Show' : 'Hide';
      toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  });

  registrationForms.forEach(function (form) {
    var password = form.querySelector('input[name="password"]');
    var confirmation = form.querySelector('input[name="confirm_password"]');
    var validateMatch = function () {
      confirmation.setCustomValidity(password.value === confirmation.value ? '' : 'Passwords must match.');
    };
    password.addEventListener('input', validateMatch);
    confirmation.addEventListener('input', validateMatch);
    form.addEventListener('submit', validateMatch);
  });

  var schoolList = document.getElementById('munob-school-list');
  if (schoolList && window.fetch && /^https?:$/.test(window.location.protocol)) {
    fetch('/platform/student-register.php', { credentials: 'same-origin' })
      .then(function (response) { return response.ok ? response.text() : ''; })
      .then(function (markup) {
        if (!markup) {
          return;
        }
        var source = new DOMParser().parseFromString(markup, 'text/html');
        var schools = Array.prototype.slice.call(source.querySelectorAll('select[name="selectHighSchool"] option'));
        schools.forEach(function (school) {
          if (!school.value || school.value === 'SH') {
            return;
          }
          var option = document.createElement('option');
          option.value = school.value;
          schoolList.appendChild(option);
        });
      })
      .catch(function () {
        /* Manual school entry remains available if the legacy list is offline. */
      });
  }

  var initialHash = window.location.hash.replace('#', '').toLowerCase();
  if (initialHash === 'delegate' || initialHash === 'director') {
    setMode('register', false);
    setRole(initialHash, false);
  } else {
    setMode('login', false);
    setRole('delegate', false);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var particleCount = Math.max(18, Math.min(42, Math.round(window.innerWidth / 34)));
    for (var index = 0; index < particleCount; index += 1) {
      var particle = document.createElement('span');
      particle.className = 'account-particle';
      particle.setAttribute('aria-hidden', 'true');
      particle.style.setProperty('--particle-x', (Math.random() * 100).toFixed(2) + '%');
      particle.style.setProperty('--particle-size', (2 + Math.random() * 4).toFixed(1) + 'px');
      particle.style.setProperty('--particle-duration', (12 + Math.random() * 15).toFixed(1) + 's');
      particle.style.setProperty('--particle-delay', (-Math.random() * 20).toFixed(1) + 's');
      particle.style.setProperty('--particle-drift', ((Math.random() - 0.5) * 110).toFixed(0) + 'px');
      document.body.appendChild(particle);
    }
  }
}());
