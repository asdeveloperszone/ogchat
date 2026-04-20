/**
 * pwa.js — Install prompt handler
 * Must be loaded in <head> so beforeinstallprompt is captured before body parses.
 * Uses window._pwaPrompt so it's accessible from any inline script.
 *
 * FIX: Creates a floating install button dynamically so it works on every page,
 * not just chats.html where #installAppBtn exists in markup.
 */

window._pwaPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window._pwaPrompt = e;
  // Delay until DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _ensureInstallBtn);
  } else {
    _ensureInstallBtn();
  }
  showInstallButton();
});

window.addEventListener('appinstalled', () => {
  window._pwaPrompt = null;
  hideInstallButton();
});

function _ensureInstallBtn() {
  // If the page already has a dedicated #installAppBtn in the header, use it.
  if (document.getElementById('installAppBtn')) return;

  // Otherwise inject a floating install button (used on pages without a header button)
  const existing = document.getElementById('_pwaFloatBtn');
  if (existing) return;

  const btn = document.createElement('button');
  btn.id = '_pwaFloatBtn';
  btn.title = 'Install App';
  btn.setAttribute('aria-label', 'Install ASChat as an app');
  btn.onclick = installApp;
  btn.innerHTML = '<i class="fa-solid fa-download"></i><span>Install App</span>';
  btn.style.cssText = [
    'position:fixed',
    'bottom:80px',
    'right:16px',
    'z-index:9999',
    'display:none',
    'align-items:center',
    'gap:6px',
    'padding:10px 16px',
    'background:linear-gradient(135deg,#4F46E5,#7C3AED)',
    'color:#fff',
    'border:none',
    'border-radius:24px',
    'font-size:14px',
    'font-weight:600',
    'cursor:pointer',
    'box-shadow:0 4px 16px rgba(79,70,229,0.45)',
    'transition:transform .15s,box-shadow .15s',
  ].join(';');
  btn.addEventListener('mouseover',  () => { btn.style.transform = 'scale(1.04)'; });
  btn.addEventListener('mouseout',   () => { btn.style.transform = 'scale(1)'; });
  document.body.appendChild(btn);
}

function showInstallButton() {
  // Named #installAppBtn in header (chats.html)
  const headerBtn = document.getElementById('installAppBtn');
  if (headerBtn) {
    headerBtn.style.display = 'flex';
    headerBtn.classList.add('install-btn-pop');
    return;
  }
  // Floating fallback
  const floatBtn = document.getElementById('_pwaFloatBtn');
  if (floatBtn) floatBtn.style.display = 'flex';
}

function hideInstallButton() {
  const headerBtn = document.getElementById('installAppBtn');
  if (headerBtn) headerBtn.style.display = 'none';
  const floatBtn = document.getElementById('_pwaFloatBtn');
  if (floatBtn) floatBtn.style.display = 'none';
}

window.installApp = async function () {
  if (!window._pwaPrompt) return;
  window._pwaPrompt.prompt();
  const { outcome } = await window._pwaPrompt.userChoice;
  window._pwaPrompt = null;
  if (outcome === 'accepted') hideInstallButton();
};
