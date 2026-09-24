(function($) {
  
  "use strict";  

  $(window).on('load', function() {

  /*Page Loader active
    ========================================================*/
    $('#preloader').fadeOut();

  // The navigation scroll state is handled once, below, by the native menu code.

    /* ==========================================================================
       countdown timer
       ========================================================================== */
     jQuery('#clock').countdown('2018/06/21',function(event){
      var $this=jQuery(this).html(event.strftime(''
      +'<div class="time-entry days"><span>%-D</span> Days</div> '
      +'<div class="time-entry hours"><span>%H</span> Hours</div> '
      +'<div class="time-entry minutes"><span>%M</span> Minutes</div> '
      +'<div class="time-entry seconds"><span>%S</span> Seconds</div> '));
    });

    /*
     * SlickNav used to clone the navigation into a second mobile menu here.
     * The shared native menu below is now the single responsive navigation.
     */

      /* WOW Scroll Spy
    ========================================================*/
     var wow = new WOW({
      //disabled for mobile
        mobile: false
    });
    wow.init();

    /* Nivo Lightbox 
    ========================================================*/
    $('.lightbox').nivoLightbox({
        effect: 'fadeScale',
        keyboardNav: true,
      });

    // Active navigation state is handled by the native menu code below.

    /* Back Top Link active
    ========================================================*/
      var offset = 200;
      var duration = 500;
      $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
          $('.back-to-top').fadeIn(400);
        } else {
          $('.back-to-top').fadeOut(400);
        }
      });

      $('.back-to-top').on('click',function(event) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: 0
        }, 600);
        return false;
      });

  });      

}(jQuery));

/* A single responsive navigation and a lightweight homepage particle layer. */
document.addEventListener('DOMContentLoaded', function () {
  var navbar = document.querySelector('.scrolling-navbar');
  var toggle = document.querySelector('.navbar-toggler');
  var menu = document.getElementById('main-navbar');
  var hero = document.querySelector('.hero-header');

  if (menu) {
    var navList = menu.querySelector('.navbar-nav');
    var navigationOrder = [
      'index.html',
      'index.html#about',
      'index.html#faq',
      'index.html#pricing',
      'index.html#sponsors',
      'index.html#contact',
      'newspaper.html',
      'committees.html',
      'country_matrix.html',
      'team.html',
      'important.html'
    ];

    if (navList) {
      var navigationItems = Array.prototype.slice.call(navList.querySelectorAll('.nav-item'));
      var itemsByDestination = {};
      navigationItems.forEach(function (item) {
        var link = item.querySelector('.nav-link');
        if (!link) {
          return;
        }
        var destination = new URL(link.href);
        var key = destination.pathname.split('/').pop() + destination.hash;
        itemsByDestination[key] = item;
      });

      navigationOrder.forEach(function (destination) {
        if (itemsByDestination[destination]) {
          navList.appendChild(itemsByDestination[destination]);
        }
      });
    }
  }

  if (navbar) {
    navbar.classList.toggle('munob-on-hero', Boolean(hero));
    navbar.classList.toggle('munob-page-nav', !hero);

    var updateNavigation = function () {
      navbar.classList.toggle('munob-nav-scrolled', window.scrollY > 24);
    };

    updateNavigation();
    window.addEventListener('scroll', updateNavigation, { passive: true });
  }

  if (hero && menu) {
    var pageLinks = Array.prototype.slice.call(menu.querySelectorAll('.nav-link'));
    var homeLink = pageLinks.find(function (link) {
      return new URL(link.href).hash === '';
    });
    var sectionLinks = pageLinks.filter(function (link) {
      var hash = new URL(link.href).hash;
      return hash && document.querySelector(hash);
    });
    var contactLink = pageLinks.find(function (link) {
      return new URL(link.href).hash === '#contact';
    });
    var footer = document.querySelector('footer.footer-area');

    var pagePosition = function (element) {
      return element.getBoundingClientRect().top + window.scrollY;
    };

    var footerIsVisible = false;
    var updateActiveLink = function () {
      var activeLink = homeLink;
      var marker = window.scrollY + navbar.offsetHeight + 24;

      if (window.scrollY >= hero.offsetHeight - 130) {
        sectionLinks
          .map(function (link) {
            return {
              link: link,
              section: document.querySelector(new URL(link.href).hash)
            };
          })
          .filter(function (entry) {
            return entry.section;
          })
          .sort(function (firstEntry, secondEntry) {
            return pagePosition(firstEntry.section) - pagePosition(secondEntry.section);
          })
          .forEach(function (entry) {
            if (pagePosition(entry.section) <= marker) {
              activeLink = entry.link;
            }
          });

        /* Contact is active whenever the actual footer is visible below the navbar. */
        if (contactLink && footer) {
          var footerBounds = footer.getBoundingClientRect();
          footerIsVisible = footerBounds.top < window.innerHeight && footerBounds.bottom > navbar.offsetHeight;
          if (footerIsVisible) {
            activeLink = contactLink;
          }
        }
      }

      pageLinks.forEach(function (link) {
        var isActive = link === activeLink;
        link.classList.toggle('active', isActive);
        if (link.parentElement) {
          link.parentElement.classList.toggle('active', isActive);
        }
      });
    };

    if (footer && 'IntersectionObserver' in window) {
      var footerObserver = new IntersectionObserver(function (entries) {
        footerIsVisible = entries.some(function (entry) {
          return entry.isIntersecting;
        });
        updateActiveLink();
      }, {
        rootMargin: '-' + navbar.offsetHeight + 'px 0px 0px 0px',
        threshold: 0.01
      });
      footerObserver.observe(footer);
    }

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink, { passive: true });
    window.addEventListener('load', updateActiveLink, { once: true });
  }

  if (toggle && menu) {
    /* Bootstrap's old data API must not also control this menu. */
    toggle.removeAttribute('data-toggle');
    toggle.removeAttribute('data-target');

    /* Keep the mobile drawer outside Bootstrap's legacy collapse layout. */
    var mobileDrawer = document.createElement('aside');
    mobileDrawer.id = 'munob-mobile-menu';
    mobileDrawer.setAttribute('aria-label', 'Main navigation');
    mobileDrawer.setAttribute('aria-hidden', 'true');

    var drawerCloseButton = document.createElement('button');
    drawerCloseButton.type = 'button';
    drawerCloseButton.className = 'munob-drawer-close';
    drawerCloseButton.setAttribute('aria-label', 'Close navigation');
    drawerCloseButton.textContent = '×';
    mobileDrawer.appendChild(drawerCloseButton);

    var mobileList = document.createElement('ul');
    menu.querySelectorAll('.nav-link').forEach(function (link) {
      var item = document.createElement('li');
      var mobileLink = document.createElement('a');
      mobileLink.href = link.href;
      mobileLink.textContent = link.textContent.trim();
      item.appendChild(mobileLink);
      mobileList.appendChild(item);
    });
    mobileDrawer.appendChild(mobileList);
    document.body.appendChild(mobileDrawer);
    toggle.setAttribute('aria-controls', mobileDrawer.id);

    var closeMenu = function () {
      menu.classList.remove('show');
      mobileDrawer.classList.remove('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    };

    drawerCloseButton.addEventListener('click', function () {
      closeMenu();
      toggle.focus();
    });

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      var isOpen = mobileDrawer.classList.toggle('is-open');
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (mobileDrawer.classList.contains('is-open') && !mobileDrawer.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1200) {
        closeMenu();
      }
    });
  }

  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var particleLayer = document.createElement('div');
  particleLayer.className = 'munob-particles';
  particleLayer.setAttribute('aria-hidden', 'true');
  hero.prepend(particleLayer);

  var particleCount = Math.max(26, Math.min(70, Math.round(window.innerWidth / 22)));
  for (var index = 0; index < particleCount; index += 1) {
    var particle = document.createElement('span');
    particle.className = 'munob-particle';
    particle.style.setProperty('--munob-x', (Math.random() * 100).toFixed(2) + '%');
    particle.style.setProperty('--munob-size', (2 + Math.random() * 5).toFixed(1) + 'px');
    particle.style.setProperty('--munob-duration', (11 + Math.random() * 15).toFixed(1) + 's');
    particle.style.setProperty('--munob-delay', (-Math.random() * 20).toFixed(1) + 's');
    particle.style.setProperty('--munob-drift', ((Math.random() - 0.5) * 120).toFixed(0) + 'px');
    particleLayer.appendChild(particle);
  }
});
