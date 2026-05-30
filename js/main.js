/* ============================================================
   main.js — VARAM Website
   Shared: navigation scroll, mobile drawer, hero slideshow,
   Lucide icons init, active nav link, smooth scroll
   ============================================================ */

; (function () {
  'use strict'

  // ---- Navigation Scroll Behaviour ----
  var nav = document.getElementById('main-nav')
  var heroHome = document.querySelector('.hero-home')

  function updateNav() {
    if (!nav) return
    if (heroHome) {
      if (window.scrollY > 72) {
        nav.classList.add('nav-scrolled')
      } else {
        nav.classList.remove('nav-scrolled')
      }
    }
    // Non-hero pages already have nav-solid set in HTML
  }

  if (nav) {
    window.addEventListener('scroll', updateNav, { passive: true })
    updateNav()
  }

  // ---- Mobile Drawer ----
  var hamburger = document.getElementById('nav-hamburger')
  var drawer = document.getElementById('mobile-drawer')
  var drawerOverlay = document.getElementById('drawer-overlay')
  var drawerClose = document.getElementById('drawer-close')
  var lastFocus

  function openDrawer() {
    if (!drawer) return
    lastFocus = document.activeElement
    drawer.classList.add('open')
    document.body.style.overflow = 'hidden'
    hamburger.classList.add('open')
    hamburger.setAttribute('aria-expanded', 'true')
    drawerClose && drawerClose.focus()
  }

  function closeDrawer() {
    if (!drawer) return
    drawer.classList.remove('open')
    document.body.style.overflow = ''
    hamburger.classList.remove('open')
    hamburger.setAttribute('aria-expanded', 'false')
    lastFocus && lastFocus.focus()
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer)
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer)
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer)

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer()
    }
  })

  // Mobile drawer links and accordions
  if (drawer) {
    drawer.querySelectorAll('.drawer-link').forEach(function (link) {
      link.addEventListener('click', function(e) {
        var parentItem = link.closest('.drawer-item');
        if (parentItem && parentItem.querySelector('.drawer-dropdown')) {
          e.preventDefault();
          parentItem.classList.toggle('open');
        } else {
          closeDrawer();
        }
      });
    });

    drawer.querySelectorAll('.drawer-dropdown-item').forEach(function (item) {
      item.addEventListener('click', function () {
        closeDrawer();
      });
    });
  }

  // ---- Hero Slideshow ----
  var slides = document.querySelectorAll('.hero-slide')
  var dots = document.querySelectorAll('.hero-dot')
  var currentSlide = 0
  var slideTimer

  function activateSlide(index) {
    slides[currentSlide].classList.remove('active')
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active')
    currentSlide = ((index % slides.length) + slides.length) % slides.length
    slides[currentSlide].classList.add('active')
    if (dots[currentSlide]) dots[currentSlide].classList.add('active')
  }

  function nextSlide() { activateSlide(currentSlide + 1) }

  function startAutoplay() { slideTimer = setInterval(nextSlide, 5500) }
  function stopAutoplay() { clearInterval(slideTimer) }
  function restartAutoplay() { stopAutoplay(); startAutoplay() }

  if (slides.length > 1) {
    activateSlide(0)
    startAutoplay()

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { activateSlide(i); restartAutoplay() })
    })

    // Pause on hover for accessibility
    var heroEl = document.querySelector('.hero-home')
    if (heroEl) {
      heroEl.addEventListener('mouseenter', stopAutoplay)
      heroEl.addEventListener('mouseleave', startAutoplay)
    }
  } else if (slides.length === 1) {
    slides[0].classList.add('active')
  }

  // ---- Lucide Icons ----
  if (typeof lucide !== 'undefined') {
    lucide.createIcons()
  }

  // ---- Active Nav Link ----
  var currentFile = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-link, .drawer-link').forEach(function (link) {
    var href = link.getAttribute('href') || ''
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active')
    }
  })

  // ---- Smooth Scroll (in-page anchors) ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href')
      var target = document.querySelector(id)
      if (target) {
        e.preventDefault()
        var navHeight = nav ? nav.offsetHeight : 0
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16
        window.scrollTo({ top: top, behavior: 'smooth' })
      }
    })
  })

  // ---- Lazy-image fallback colour ----
  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
    if (!img.dataset.fallbackSet) {
      img.dataset.fallbackSet = '1'
      img.style.backgroundColor = '#FAF8F3'
    }
  })

  // ---- Back to Top Button ----
  var backToTopBtn = document.getElementById('backToTop')
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('is-visible')
      } else {
        backToTopBtn.classList.remove('is-visible')
      }
    }, { passive: true })

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }


  // ---- MODAL / POPUP FORM ----
  var contactModal = document.getElementById('contact-modal')
  if (contactModal) {
    var modalCloseBtn = contactModal.querySelector('.modal-close')
    
    function openModal(e) {
      if (e) e.preventDefault()
      contactModal.classList.add('is-open')
      document.body.style.overflow = 'hidden'
    }
    
    function closeModal() {
      contactModal.classList.remove('is-open')
      document.body.style.overflow = ''
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal)
    }

    // Close on click outside
    contactModal.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        closeModal()
      }
    })

    // Attach to all "Get in Touch" buttons and "#footer-cta" links
    document.querySelectorAll('a, button').forEach(function(el) {
      var text = el.textContent.trim().toLowerCase()
      var href = el.getAttribute('href') || ''
      if (text === 'get in touch' || text === 'start your project' || text === 'start a conversation' || href === '#footer-cta') {
        el.addEventListener('click', openModal)
      }
    })
  }

  // ---- Scroll Reveal Animations (Intersection Observer) ----
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: immediately reveal all elements if IntersectionObserver is not supported
      var allReveals = document.querySelectorAll('.reveal');
      for (var i = 0; i < allReveals.length; i++) {
        allReveals[i].classList.add('revealed');
      }
      return;
    }

    var revealCallback = function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px', // trigger slightly before entering fully to look natural
      threshold: 0.08 // 8% visibility
    };

    var observer = new IntersectionObserver(revealCallback, observerOptions);

    // Observe all reveal targets
    var revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(function (el) {
      observer.observe(el);
    });

    // Auto-stagger logic for lists/grids (e.g., cards, feature blocks)
    document.querySelectorAll('[data-stagger-container]').forEach(function (container) {
      var selector = container.getAttribute('data-stagger-container') || '.reveal';
      var delay = parseInt(container.getAttribute('data-stagger-delay') || '100', 10);
      var children = container.querySelectorAll(selector);
      children.forEach(function (child, idx) {
        if (!child.style.transitionDelay) {
          child.style.transitionDelay = (idx * delay) + 'ms';
        }
      });
    });
  }

  // Initialize as soon as DOM content is parsed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
})()
