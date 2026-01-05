/**
 * Website Analytics for Dashie Marketing Site
 * Tracks page views and download events using Supabase
 *
 * Usage: Include this script on any page you want to track:
 *   <script type="module" src="/js/analytics/website-analytics.js"></script>
 */

// Supabase configuration (auto-detect environment)
const SUPABASE_ENVIRONMENTS = {
  production: {
    url: 'https://cseaywxcvnxcsypaqaid.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZWF5d3hjdm54Y3N5cGFxYWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDIxOTEsImV4cCI6MjA3MzE3ODE5MX0.Wnd7XELrtPIDKeTcHVw7dl3awn3BlI0z9ADKPgSfHhA'
  },
  development: {
    url: 'https://cwglbtosingboqepsmjk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3Z2xidG9zaW5nYm9xZXBzbWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDY4NjYsImV4cCI6MjA3MzIyMjg2Nn0.VCP5DSfAwwZMjtPl33bhsixSiu_lHsM6n42FMJRP3YA'
  }
};

function getSupabaseConfig() {
  const host = window.location.hostname;
  if (host.includes('dev.') || host.includes('local.') || host === 'localhost' || host.startsWith('127.0.0.1')) {
    return SUPABASE_ENVIRONMENTS.development;
  }
  return SUPABASE_ENVIRONMENTS.production;
}

const config = getSupabaseConfig();

// Generate or retrieve session ID (persists for the browser session)
function getSessionId() {
  let sessionId = sessionStorage.getItem('dashie_analytics_session');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem('dashie_analytics_session', sessionId);
  }
  return sessionId;
}

// Track a page view
async function trackPageView() {
  try {
    const response = await fetch(`${config.url}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        session_id: getSessionId()
      })
    });

    if (!response.ok) {
      console.warn('Analytics: Failed to track page view', response.status);
    }
  } catch (error) {
    console.warn('Analytics: Error tracking page view', error);
  }
}

// Track a download event
async function trackDownload(fileName, filePath) {
  try {
    const response = await fetch(`${config.url}/rest/v1/download_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        file_name: fileName,
        file_path: filePath,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        session_id: getSessionId()
      })
    });

    if (!response.ok) {
      console.warn('Analytics: Failed to track download', response.status);
    }
  } catch (error) {
    console.warn('Analytics: Error tracking download', error);
  }
}

// Auto-attach download tracking to APK links
function attachDownloadTracking() {
  // Find all download links (APK files)
  const downloadLinks = document.querySelectorAll('a[href$=".apk"]');

  downloadLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const filePath = link.getAttribute('href');
      const fileName = filePath.split('/').pop();

      // Track the download (don't prevent default - let download proceed)
      trackDownload(fileName, filePath);
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Track page view
  trackPageView();

  // Attach download tracking
  attachDownloadTracking();
});

// Also track if page is already loaded (for dynamic script loading)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  trackPageView();
  attachDownloadTracking();
}

// Export functions for manual use if needed
window.DashieAnalytics = {
  trackPageView,
  trackDownload
};
