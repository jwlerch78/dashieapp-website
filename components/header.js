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
    background: #18bcf2;
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
      <li><a href="/" class="${getActiveClass('/')}">Home</a></li>
      <li><a href="/beta-signup" class="${getActiveClass('/beta-signup')}">Dashie <span class="early-access-tag">Early Access</span></a></li>
      <li><a href="/dashie-lite" class="${getActiveClass('/dashie-lite')}">Dashie Lite <span class="beta-tag">Beta</span></a></li>
      <li><a href="/guides/" class="${getActiveClass('/guides')}">How To Guides</a></li>
      <li><a href="/contact" class="${getActiveClass('/contact')}">Contact Us</a></li>
    </ul>
  </div>
  <div class="nav-bar-right">
    <a href="#" class="btn-login" onclick="window.dashieHeader.showSigninModal(event)">Sign In</a>
    <a href="/beta-signup" class="btn-signup">Sign Up</a>
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
    <li><a href="/" class="${getActiveClass('/')}">Home</a></li>
    <li><a href="/beta-signup" class="${getActiveClass('/beta-signup')}">Dashie Early Access</a></li>
    <li><a href="/dashie-lite" class="${getActiveClass('/dashie-lite')}">Dashie Lite</a></li>
    <li><a href="/guides/" class="${getActiveClass('/guides')}">How To Guides</a></li>
    <li><a href="/contact" class="${getActiveClass('/contact')}">Contact Us</a></li>
  </ul>
  <div class="mobile-menu-buttons">
    <a href="#" class="btn-login" onclick="window.dashieHeader.showSigninModal(event)">Sign In</a>
    <a href="/beta-signup" class="btn-signup">Sign Up</a>
  </div>
</div>

<!-- Sign-in Modal -->
<div class="signin-modal-overlay" id="signin-modal-overlay" onclick="window.dashieHeader.hideSigninModal(event)">
  <div class="signin-modal" onclick="event.stopPropagation()">
    <div style="text-align: center; margin-bottom: 20px; display: flex; flex-direction: column; align-items: center;">
      <img src="/artwork/Dashie_Full_Logo_Orange_Transparent.png" alt="Dashie" style="height: 70px; margin-bottom: 10px;">
      <div style="background: #ffaa00; color: white; font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 4px;">Early Access</div>
    </div>
    <p>Dashie is in limited release and your account must be registered through our early access process.</p>
    <div class="signin-modal-buttons">
      <a href="/beta-signup" class="btn-primary">Register for Early Access</a>
      <a href="/login" class="btn-secondary">Continue to Sign In</a>
      <button class="btn-cancel" onclick="window.dashieHeader.hideSigninModal(event)">Cancel</button>
    </div>
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
  },

  showSigninModal: function(event) {
    event.preventDefault();
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      this.toggleMobileMenu();
    }
    document.getElementById('signin-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  hideSigninModal: function(event) {
    if (event) event.preventDefault();
    document.getElementById('signin-modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }
};
