/* ============================================================
   contact.js — Contact form validation & webhook submission
   Configure WEBHOOK_URL before going live.
   ============================================================ */

;(function () {
  'use strict'

  // Replace with your Google Apps Script web app deployment URL
  var WEBHOOK_URL = '[GOOGLE_APPS_SCRIPT_WEBHOOK_URL]'

  var form = document.getElementById('contact-form')
  var submitBtn = document.getElementById('form-submit')
  var successEl = document.getElementById('form-success')
  var errorEl = document.getElementById('form-error')

  if (!form) return

  // ---- Helpers ----
  function isEmail (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) }
  function isPhone (v) { return v === '' || /^[\d\s+\-()ऀ-ॿ]{7,16}$/.test(v.trim()) }

  function fieldErr (input, msg) {
    var el = document.getElementById(input.id + '-error')
    if (el) { el.textContent = msg; el.style.display = 'block' }
    input.classList.add('input-error')
    input.setAttribute('aria-invalid', 'true')
  }

  function clearErr (input) {
    var el = document.getElementById(input.id + '-error')
    if (el) { el.textContent = ''; el.style.display = 'none' }
    input.classList.remove('input-error')
    input.removeAttribute('aria-invalid')
  }

  function getVal (id) {
    var el = form.querySelector('#' + id)
    return el ? el.value.trim() : ''
  }

  // ---- Validation ----
  function validate () {
    var ok = true
    var inputs = ['name', 'email', 'phone', 'service', 'message']
    inputs.forEach(function (id) {
      var el = form.querySelector('#' + id)
      if (el) clearErr(el)
    })

    var nameEl = form.querySelector('#name')
    var emailEl = form.querySelector('#email')
    var phoneEl = form.querySelector('#phone')
    var serviceEl = form.querySelector('#service')
    var msgEl = form.querySelector('#message')

    if (getVal('name').length < 2) {
      fieldErr(nameEl, 'Please enter your full name.')
      ok = false
    }
    if (!isEmail(getVal('email'))) {
      fieldErr(emailEl, 'Please enter a valid email address.')
      ok = false
    }
    if (!isPhone(getVal('phone'))) {
      fieldErr(phoneEl, 'Please enter a valid phone number.')
      ok = false
    }
    if (!getVal('service')) {
      fieldErr(serviceEl, 'Please select a service interest.')
      ok = false
    }
    if (getVal('message').length < 15) {
      fieldErr(msgEl, 'Please describe your project briefly (at least 15 characters).')
      ok = false
    }

    return ok
  }

  // ---- Submit ----
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    successEl.style.display = 'none'
    errorEl.style.display = 'none'

    if (!validate()) {
      form.querySelector('.input-error') && form.querySelector('.input-error').focus()
      return
    }

    submitBtn.disabled = true
    submitBtn.textContent = 'Sending…'

    if (WEBHOOK_URL === '[GOOGLE_APPS_SCRIPT_WEBHOOK_URL]') {
      setTimeout(function () {
        submitBtn.disabled = false
        submitBtn.textContent = 'Send Message'
        errorEl.textContent =
          'The contact form endpoint has not been configured yet. ' +
          'Please reach us directly at hello@varam.co or call +91 44 4210 1234.'
        errorEl.style.display = 'block'
      }, 400)
      return
    }

    var payload = {
      name: getVal('name'),
      email: getVal('email'),
      phone: getVal('phone'),
      service: getVal('service'),
      message: getVal('message'),
      timestamp: new Date().toISOString(),
    }

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Server error ' + res.status)
        return res.json ? res.json() : {}
      })
      .then(function () {
        form.reset()
        form.style.display = 'none'
        successEl.style.display = 'block'
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
      .catch(function (err) {
        console.error('Form submission error:', err)
        errorEl.textContent =
          'Something went wrong sending your message. Please try again or email us directly.'
        errorEl.style.display = 'block'
      })
      .finally(function () {
        submitBtn.disabled = false
        submitBtn.textContent = 'Send Message'
      })
  })

  // ---- Inline validation on blur ----
  form.querySelectorAll('input, select, textarea').forEach(function (el) {
    el.addEventListener('blur', function () {
      if (this.id === 'email' && this.value && !isEmail(this.value)) {
        fieldErr(this, 'Please enter a valid email address.')
      } else if (this.id === 'phone' && this.value && !isPhone(this.value)) {
        fieldErr(this, 'Please enter a valid phone number.')
      } else {
        clearErr(this)
      }
    })
    // Clear error on change
    el.addEventListener('input', function () { clearErr(this) })
  })

})()
