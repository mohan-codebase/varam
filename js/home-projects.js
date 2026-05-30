/* ============================================================
   home-projects.js — Home page portfolio grid filter and project lightbox
   ============================================================ */

;(function () {
  'use strict'

  // ---- Project data ----
  var projects = {
    'p01': {
      title: 'Serene Residences, Adyar',
      category: 'Architecture',
      description:
        'A three-bedroom family home designed around a central courtyard that brings natural light and ventilation into every room. The design prioritises material honesty — exposed concrete, teak joinery, and locally sourced laterite stone form a palette that ages gracefully.',
      img: 'https://images.unsplash.com/photo-1642667670006-6b3059ccf96d?w=900&q=85&auto=format&fit=crop',
      scope: ['Architectural Design', 'Interior Design', 'Landscape Integration', 'Site Supervision'],
    },
    'p02': {
      title: 'The Prism Office, Nungambakkam',
      category: 'Architecture',
      description:
        'A 12,000 sq ft commercial workspace designed to foster collaboration while preserving focused work zones. The triangulated aluminium facade screen controls solar gain without sacrificing the open views of the tree-lined street below.',
      img: 'https://images.unsplash.com/photo-1643602475901-9f67ab7d8196?w=900&q=85&auto=format&fit=crop',
      scope: ['Commercial Architecture', 'Interior Architecture', 'Facade Engineering', 'MEP Coordination'],
    },
    'p03': {
      title: 'Greenfield Villas, East Coast Road',
      category: 'Construction',
      description:
        'Complete turnkey construction of six luxury villas set within a landscaped plot on the ECR. Shri Associates handled all structural, finishing, and external development works to deliver move-in ready homes on schedule.',
      img: 'https://images.unsplash.com/photo-1607567618395-62fc2d132c3e?w=900&q=85&auto=format&fit=crop',
      scope: ['Structural Construction', 'Internal Finishes', 'Landscape Development', 'MEP Works'],
    },
    'p04': {
      title: 'Heritage Townhouse Restoration, Mylapore',
      category: 'Renovation',
      description:
        'Careful restoration of an 80-year-old Chettinad townhouse. The project balanced modern structural requirements with the preservation of original terrazzo flooring, carved teak screens, and the traditional courtyard layout.',
      img: 'https://images.unsplash.com/photo-1668749543729-9fbd709751ca?w=900&q=85&auto=format&fit=crop',
      scope: ['Structural Repair', 'Heritage Restoration', 'Terrazzo & Stone Works', 'Teak Woodwork'],
    },
    'p05': {
      title: 'Medha School Campus, Tambaram',
      category: 'Architecture',
      description:
        'A 3-acre school campus planned for natural learning. The layout creates shaded outdoor corridors, dedicated science and arts blocks, and a central gathering lawn that serves as the social heart of the institution.',
      img: 'https://images.unsplash.com/photo-1759562588736-186cce2c26b5?w=900&q=85&auto=format&fit=crop',
      scope: ['Master Planning', 'Architectural Design', 'Landscape Design', 'Phased Construction Advisory'],
    },
    'p06': {
      title: 'Skyline Apartments — Property Management, Velachery',
      category: 'Construction',
      description:
        'Ongoing property management for a 48-unit apartment complex. MPMS coordinates quarterly condition assessments, monitors maintenance contractors, and delivers structured monthly reports to the NRI-based property owner.',
      img: 'https://images.unsplash.com/photo-1639335944967-03b902ead5fd?w=900&q=85&auto=format&fit=crop',
      scope: ['Quarterly Inspections', 'Maintenance Supervision', 'Monthly Reporting', 'Contractor Coordination'],
    },
  }

  // ---- Filter ----
  var filterBtns = document.querySelectorAll('.home-filter-btn')
  var items = document.querySelectorAll('.home-project-card')

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.dataset.filter

      filterBtns.forEach(function (b) { b.classList.remove('active') })
      this.classList.add('active')

      items.forEach(function (item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = ''
          item.classList.add('fade-in')
        } else {
          item.style.display = 'none'
          item.classList.remove('fade-in')
        }
      })
    })
  })

  // ---- Lightbox ----
  var lightbox = document.getElementById('lightbox')
  var lbClose = document.getElementById('lightbox-close')
  var lbTitle = document.getElementById('lightbox-title')
  var lbCategory = document.getElementById('lightbox-category')
  var lbDesc = document.getElementById('lightbox-description')
  var lbImg = document.getElementById('lightbox-image')
  var lbScope = document.getElementById('lightbox-scope')

  var previousFocus

  function openLightbox (id) {
    var data = projects[id]
    if (!data || !lightbox) return

    previousFocus = document.activeElement
    lbTitle.textContent = data.title
    lbCategory.textContent = data.category
    lbDesc.textContent = data.description
    lbImg.src = data.img
    lbImg.alt = data.title
    lbScope.innerHTML = data.scope.map(function (s) { return '<li>' + s + '</li>' }).join('')

    lightbox.classList.add('open')
    document.body.style.overflow = 'hidden'
    lbClose && lbClose.focus()
  }

  function closeLightbox () {
    if (!lightbox) return
    lightbox.classList.remove('open')
    document.body.style.overflow = ''
    previousFocus && previousFocus.focus()
  }

  document.querySelectorAll('.home-project-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(this.dataset.project)
    })
  })

  if (lbClose) lbClose.addEventListener('click', closeLightbox)

  if (lightbox) {
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox)
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox()
    }
  })

})()
