/* ============================================================
   home-testimonials.js — Homepage Testimonials Slider & Filters
   ============================================================ */

;(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var track = document.getElementById('testimonials-track');
    if (!track) return;

    var originalCards = Array.from(track.children);
    var filterBtns = document.querySelectorAll('.t-filter-btn');
    var prevBtn = document.getElementById('t-prev');
    var nextBtn = document.getElementById('t-next');
    var dotsContainer = document.getElementById('t-dots');
    var sliderContainer = document.querySelector('.testimonials-slider-container');

    var currentFilter = 'all';
    var currentPage = 0;
    var cardsPerPage = 3;
    var totalPages = 1;
    var filteredCards = [];
    var autoplayTimer = null;

    // Detect responsiveness and set cards per page
    function updateCardsPerPage() {
      var width = window.innerWidth;
      var newCardsPerPage = 3;
      if (width < 768) {
        newCardsPerPage = 1;
      } else if (width < 1024) {
        newCardsPerPage = 2;
      }

      if (newCardsPerPage !== cardsPerPage) {
        cardsPerPage = newCardsPerPage;
        renderSlider();
      }
    }

    // Filter cards and reset slider page
    function applyFilter(filter) {
      currentFilter = filter;
      currentPage = 0;

      filteredCards = originalCards.filter(function (card) {
        var cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('t-hidden');
          return true;
        } else {
          card.classList.add('t-hidden');
          return false;
        }
      });

      renderSlider();
    }

    // Redraw slider track position, dots, and navigation buttons
    function renderSlider() {
      // Calculate total pages
      totalPages = Math.ceil(filteredCards.length / cardsPerPage);
      if (totalPages < 1) totalPages = 1;

      // Keep currentPage in bounds
      if (currentPage >= totalPages) {
        currentPage = totalPages - 1;
      }
      if (currentPage < 0) {
        currentPage = 0;
      }

      // Rebuild dots
      dotsContainer.innerHTML = '';
      if (totalPages > 1) {
        for (var i = 0; i < totalPages; i++) {
          var dot = document.createElement('button');
          dot.className = 't-dot' + (i === currentPage ? ' active' : '');
          dot.setAttribute('aria-label', 'Go to testimonials page ' + (i + 1));
          dot.setAttribute('data-page', i);
          
          dot.addEventListener('click', function (e) {
            var targetPage = parseInt(e.target.getAttribute('data-page'), 10);
            goToPage(targetPage);
            restartAutoplay();
          });
          
          dotsContainer.appendChild(dot);
        }
      }

      // Update track position
      updateTrackPosition();

      // Update navigation button states
      updateNavButtons();
    }

    // Shift track container using hardware-accelerated CSS translation
    function updateTrackPosition() {
      if (totalPages <= 1) {
        track.style.transform = 'translateX(0)';
        return;
      }

      // If we are on the last page and it doesn't have a full set of cards,
      // we can align the cards to the end to prevent trailing empty spaces
      var shiftPercent = currentPage * 100;
      var shiftGapRem = currentPage * 1.5;

      // Safe check to avoid empty overflow space on the right of the last page
      var maxPossibleShiftPage = filteredCards.length - cardsPerPage;
      if (maxPossibleShiftPage < 0) maxPossibleShiftPage = 0;
      
      // Translating track: slides move by 100% of container width + 1.5rem gap for each page
      track.style.transform = 'translateX(calc(-' + shiftPercent + '% - ' + shiftGapRem + 'rem))';
    }

    // Disable navigation controls when limits are reached
    function updateNavButtons() {
      if (prevBtn) prevBtn.disabled = currentPage === 0;
      if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1 || totalPages <= 1;
    }

    // Go to specific page
    function goToPage(page) {
      currentPage = page;
      renderSlider();
    }

    // Autoplay looping
    function nextSlide() {
      if (totalPages <= 1) return;
      var nextPage = (currentPage + 1) % totalPages;
      goToPage(nextPage);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 6000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function restartAutoplay() {
      startAutoplay();
    }

    // Event Listeners for Filters
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilter(btn.getAttribute('data-filter'));
        restartAutoplay();
      });
    });

    // Event Listeners for Arrow buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentPage > 0) {
          goToPage(currentPage - 1);
          restartAutoplay();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentPage < totalPages - 1) {
          goToPage(currentPage + 1);
          restartAutoplay();
        }
      });
    }

    // Pause on Hover
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopAutoplay);
      sliderContainer.addEventListener('mouseleave', startAutoplay);
    }

    // Initialize layout and active size
    window.addEventListener('resize', updateCardsPerPage);
    
    // Set initial size and load reviews
    cardsPerPage = window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 3);
    applyFilter('all');
    startAutoplay();
  });
})();
