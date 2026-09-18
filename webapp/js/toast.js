/* ═══════════════════════════════════════════════════════════
   Toast Notification System — Reusable Component
   ═══════════════════════════════════════════════════════════
   Usage: Include this script in any page. Call showToast(message, type).
   Types: 'success', 'error', 'info' (default).
   Toast auto-dismisses after 3 seconds, slides in from the right.
   Accessible: role="alert", close button with aria-label.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('data-testid', 'toast-notification');
    toast.innerHTML =
      '<span>' + message + '</span>' +
      '<button class="toast-close" aria-label="Close notification">\u2715</button>';
    container.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('toast-visible');
    });
    var dismiss = function () {
      toast.classList.remove('toast-visible');
      setTimeout(function () {
        if (toast.parentNode) toast.remove();
      }, 300);
    };
    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    setTimeout(dismiss, 3000);
  }

  window.showToast = showToast;
})();
