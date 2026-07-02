/**
 * Shared header/navigation component for all public website pages
 * Includes hamburger menu for mobile with proper touch handling
 *
 * Usage: Include <script src="/components/header.js"></script> in your page
 * The header will be injected at the script location
 */

// Determine the current page for active state
const currentPath = window.location.pathname;

function getActiveClass(path) {
  if (path === '/' && (currentPath === '/' || currentPath === '/index.html')) return 'active';
  if (path !== '/' && currentPath.startsWith(path)) return 'active';
  return '';
}

const headerHTML = `
<style>
  /* Navigation Bar */
  .nav-bar {
    background: #f8f9fa;
    padding: 0 40px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .nav-bar-left {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .logo-container {
    display: flex;
    align-items: center;
    padding-right: 20px;
  }

  .logo {
    height: 50px;
    width: auto;
  }

  .nav-bar ul {
    display: flex;
    list-style: none;
    gap: 0;
    margin: 0;
    padding: 0;
  }

  .nav-bar li a {
    display: block;
    padding: 14px 20px;
    color: #555;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
  }

  .nav-bar li a:hover {
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.05);
  }

  .nav-bar li a.active {
    color: #ffaa00;
    border-bottom-color: #ffaa00;
  }

  .nav-bar li a .beta-tag {
    display: inline-block;
    background: #1a365d;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
    margin-left: 6px;
    vertical-align: middle;
  }

  .nav-bar li a .early-access-tag {
    display: inline-block;
    background: #ffaa00;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
    margin-left: 6px;
    vertical-align: middle;
  }

  .nav-bar li a .alpha-tag,
  .mobile-menu li a .alpha-tag {
    display: inline-block;
    background: linear-gradient(135deg, #7b2ff7 0%, #4a00e0 100%);
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
    margin-left: 6px;
    vertical-align: middle;
  }

  .nav-bar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-bar .btn-login {
    background: #ffaa00;
    color: #ffffff;
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .nav-bar .btn-login:hover {
    background: #ffbb22;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 170, 0, 0.3);
  }

  .nav-bar .btn-signup {
    background: transparent;
    color: #ffaa00;
    padding: 8px 20px;
    border: 2px solid #ffaa00;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .nav-bar .btn-signup:hover {
    background: #ffaa00;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 170, 0, 0.3);
  }

  /* Hamburger Button - hidden on desktop */
  .hamburger-btn {
    display: none;
    background: none;
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 101;
  }

  .hamburger-btn svg {
    width: 24px;
    height: 24px;
    stroke: #555;
    stroke-width: 2;
    stroke-linecap: round;
  }

  /* Mobile Menu Overlay */
  .mobile-menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .mobile-menu-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }

  /* Mobile Menu Drawer */
  .mobile-menu {
    display: none;
    position: fixed;
    top: 0;
    right: -280px;
    width: 280px;
    height: 100%;
    background: #ffffff;
    z-index: 201;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
    transition: right 0.3s ease;
    overflow-y: auto;
  }

  .mobile-menu.active {
    right: 0;
  }

  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
    color: #424242;
  }

  .mobile-menu-close {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
  }

  .mobile-menu-close svg {
    width: 24px;
    height: 24px;
    stroke: #555;
    stroke-width: 2;
  }

  .mobile-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-menu li a {
    display: block;
    padding: 15px 20px;
    color: #555;
    text-decoration: none;
    font-size: 16px;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.2s;
  }

  .mobile-menu li a:hover,
  .mobile-menu li a.active {
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.05);
  }

  .mobile-menu-buttons {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1px solid #e0e0e0;
    margin-top: auto;
  }

  .mobile-menu-buttons .btn-login,
  .mobile-menu-buttons .btn-signup {
    display: block;
    text-align: center;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }

  .mobile-menu-buttons .btn-login {
    background: #ffaa00;
    color: #ffffff;
    border: none;
  }

  .mobile-menu-buttons .btn-signup {
    background: transparent;
    color: #ffaa00;
    border: 2px solid #ffaa00;
  }

  /* Sign-in Modal */
  .signin-modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .signin-modal-overlay.active {
    display: flex;
    opacity: 1;
    pointer-events: auto;
  }

  .signin-modal {
    background: white;
    padding: 40px;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .signin-modal p {
    color: #666;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .signin-modal-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .signin-modal-buttons .btn-primary {
    background: #ffaa00;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
  }

  .signin-modal-buttons .btn-primary:hover {
    background: #ffbb22;
  }

  .signin-modal-buttons .btn-secondary {
    background: transparent;
    color: #ffaa00;
    padding: 12px 20px;
    border: 2px solid #ffaa00;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
  }

  .signin-modal-buttons .btn-secondary:hover {
    background: #ffaa00;
    color: white;
  }

  .signin-modal-buttons .btn-cancel {
    background: transparent;
    color: #888;
    padding: 12px 20px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .signin-modal-buttons .btn-cancel:hover {
    color: #555;
  }

  /* Dropdown menu for nav items */
  .nav-dropdown {
    position: relative;
  }

  .nav-dropdown > a {
    display: block;
    padding: 14px 20px;
    color: #555;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
  }

  .nav-dropdown > a:hover {
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.05);
  }

  .nav-dropdown > a.active {
    color: #ffaa00;
    border-bottom-color: #ffaa00;
  }

  .nav-dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    min-width: 220px;
    padding: 8px 0;
    z-index: 200;
  }

  .nav-dropdown:hover .nav-dropdown-menu {
    display: block;
  }

  .nav-dropdown-menu a {
    display: block;
    padding: 10px 20px;
    color: #555;
    text-decoration: none;
    font-size: 13px;
    font-weight: 400;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .nav-dropdown-menu a:hover {
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.05);
  }

  .nav-dropdown-menu .dropdown-divider {
    height: 1px;
    background: #e8e8e8;
    margin: 6px 0;
  }

  /* Mobile submenu items */
  .mobile-menu li a.mobile-sub-item {
    padding-left: 40px;
    font-size: 14px;
    color: #888;
  }

  .mobile-menu li a.mobile-sub-item:hover,
  .mobile-menu li a.mobile-sub-item.active {
    color: #ffaa00;
  }

  /* Mobile section label (non-navigating, e.g. "About") */
  .mobile-menu li a.mobile-menu-label {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #aaa;
    cursor: default;
  }

  .mobile-menu li a.mobile-menu-label:hover {
    color: #aaa;
    background: transparent;
  }

  /* Dropdown caret on nav items */
  .nav-caret {
    font-size: 9px;
    vertical-align: middle;
    margin-left: 2px;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .nav-bar {
      padding: 10px 15px;
    }

    .logo {
      height: 40px;
    }

    /* Hide desktop nav on mobile */
    .nav-bar ul,
    .nav-bar-right {
      display: none;
    }

    /* Show hamburger on mobile */
    .hamburger-btn {
      display: block;
    }

    .mobile-menu-overlay,
    .mobile-menu {
      display: block;
    }
  }
</style>

<nav class="nav-bar">
  <div class="nav-bar-left">
    <div class="logo-container">
      <a href="/"><img src="/artwork/Dashie_Full_Logo_Orange_Transparent.png" alt="Dashie" class="logo"></a>
    </div>
    <ul>
      <li><a href="/for-families" class="${getActiveClass('/for-families')}">For Families</a></li>
      <li class="nav-dropdown">
        <a href="/dashie-kiosk" class="${getActiveClass('/dashie-kiosk')}">For Home Assistant</a>
        <div class="nav-dropdown-menu">
          <a href="/dashie-kiosk">Overview</a>
          <a href="/dashie-kiosk#screensaver">Screensaver & Photos</a>
          <a href="/dashie-kiosk#voice-control">Voice Control</a>
          <a href="/dashie-kiosk#lock-mode">Lock Mode</a>
          <a href="/dashie-kiosk#music-player">Music Player</a>
          <a href="/dashie-kiosk#video-streaming">Video Streaming</a>
          <a href="/dashie-kiosk#battery-management">Battery Management</a>
          <a href="/dashie-kiosk#home-assistant">Home Assistant Integration</a>
        </div>
      </li>
      <li><a href="/get-dashie" class="${getActiveClass('/get-dashie')}">Get Dashie <span class="beta-tag">Beta</span></a></li>
      <li><a href="/dashie-intelligence" class="${getActiveClass('/dashie-intelligence')}">Dashie Intelligence <span class="alpha-tag">Alpha</span></a></li>
      <li><a href="/guides/" class="${getActiveClass('/guides')}">How to Guides</a></li>
      <li><a href="/pricing" class="${getActiveClass('/pricing')}">Pricing</a></li>
      <li class="nav-dropdown">
        <a href="#" onclick="event.preventDefault();">About <span class="nav-caret">&#9662;</span></a>
        <div class="nav-dropdown-menu">
          <a href="/privacy-policy.html">Privacy Policy</a>
          <a href="/terms-of-service.html">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div>
      </li>
    </ul>
  </div>
  <div class="nav-bar-right">
    <a href="https://app.dashieapp.com/subscribe.html?source=website" class="btn-login">Purchase</a>
  </div>
  <button class="hamburger-btn" onclick="window.dashieHeader.toggleMobileMenu()">
    <svg viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>
</nav>

<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay" id="mobile-menu-overlay" onclick="window.dashieHeader.toggleMobileMenu()"></div>

<!-- Mobile Menu Drawer -->
<div class="mobile-menu" id="mobile-menu">
  <div class="mobile-menu-header">
    <span>Menu</span>
    <button class="mobile-menu-close" onclick="window.dashieHeader.toggleMobileMenu()">
      <svg viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
  <ul>
    <li><a href="/for-families" class="${getActiveClass('/for-families')}">For Families</a></li>
    <li><a href="/dashie-kiosk" class="${getActiveClass('/dashie-kiosk')}">For Home Assistant</a></li>
    <li><a href="/dashie-kiosk#screensaver" class="mobile-sub-item">Screensaver & Photos</a></li>
    <li><a href="/dashie-kiosk#voice-control" class="mobile-sub-item">Voice Control</a></li>
    <li><a href="/dashie-kiosk#lock-mode" class="mobile-sub-item">Lock Mode</a></li>
    <li><a href="/dashie-kiosk#music-player" class="mobile-sub-item">Music Player</a></li>
    <li><a href="/dashie-kiosk#video-streaming" class="mobile-sub-item">Video Streaming</a></li>
    <li><a href="/dashie-kiosk#battery-management" class="mobile-sub-item">Battery Management</a></li>
    <li><a href="/get-dashie" class="${getActiveClass('/get-dashie')}">Get Dashie</a></li>
    <li><a href="/dashie-intelligence" class="${getActiveClass('/dashie-intelligence')}">Dashie Intelligence <span class="alpha-tag">Alpha</span></a></li>
    <li><a href="/guides/" class="${getActiveClass('/guides')}">How to Guides</a></li>
    <li><a href="/pricing" class="${getActiveClass('/pricing')}">Pricing</a></li>
    <li><a href="#" onclick="event.preventDefault();" class="mobile-menu-label">About</a></li>
    <li><a href="/privacy-policy.html" class="mobile-sub-item">Privacy Policy</a></li>
    <li><a href="/terms-of-service.html" class="mobile-sub-item">Terms of Service</a></li>
    <li><a href="/contact" class="mobile-sub-item ${getActiveClass('/contact')}">Contact Us</a></li>
  </ul>
  <div class="mobile-menu-buttons">
    <a href="https://app.dashieapp.com/subscribe.html?source=website" class="btn-login">Purchase</a>
  </div>
</div>

`;

// Inject the header HTML
document.currentScript.insertAdjacentHTML('afterend', headerHTML);

// Header controller functions (namespaced to avoid conflicts)
window.dashieHeader = {
  toggleMobileMenu: function() {
    const overlay = document.getElementById('mobile-menu-overlay');
    const menu = document.getElementById('mobile-menu');
    const isOpen = menu.classList.contains('active');

    if (isOpen) {
      menu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      menu.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
};
