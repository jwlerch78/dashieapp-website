# Website Restructure — Navigation, Get Dashie & Pricing

**Created:** 2026-05-19
**Repo:** `dashieapp-website` (this repo)
**Status:** Planned — not started

## Goal

Restructure the public website navigation and add two pages, to reflect the
current product framing (Home Assistant integration is stable; the Families
product is the beta) and the multi-channel distribution model.

**Target navigation** (every page):

```
For Families [Beta]  ·  For Home Assistant  ·  Pricing  ·  Get Dashie  ·  How to Guides  ·  About ▾
                                                                                          ├ Privacy Policy
                                                                                          ├ Terms of Service
                                                                                          └ Contact Us
```

(Logo → Home. "Home" is dropped as an explicit nav item.)

## Current state

**Navigation is inconsistent** — two implementations:
- **Shared `components/header.js`** (≈7 pages): `dashie-kiosk.html`,
  `dashie-kiosk-download.html`, `dashie-kiosk-beta.html`, `beta-signup.html`,
  `contact/index.html`, `guides/index.html`, `guides/music-assistant-setup/`.
- **Inline `<nav>`** (≈10 pages): `index.html`, `voice-license.html`,
  `voice-license-success.html`, and most `guides/*/index.html`
  (home-assistant-integration, dashie-early-access, dashie-kiosk-features,
  photos-setup, screensaver-setup, fire-tablet-sideload, voice-control-setup).

Current nav items: `Home` · `Dashie [Early Access]` (→ `/beta-signup`) ·
`For Home Assistant [Beta]` (→ `/dashie-kiosk`, with a dropdown) ·
`How To Guides` · `Contact Us` + Sign In / Sign Up.

Relevant pages: `index.html`, `beta-signup.html`, `dashie-kiosk.html` (the
"For Home Assistant" page), `dashie-kiosk-download.html` ("Download Dashie
for Home Assistant"), `dashie-kiosk-beta.html`, legacy `dashie-lite-*.html`,
`privacy-policy.html`, `terms-of-service.html`, `delete-account.html`,
`contact/index.html`, `guides/`.

## Resolved decisions

1. **"For Families" nav target** — points to `/beta-signup`. "For Families"
   replaces the old "Dashie [Early Access]" item; the beta-signup page is the
   Families product page for now. A dedicated `for-families.html` is deferred
   to Phase 3.
2. **"Get Dashie" source page** — `dashie-kiosk-download.html` ("Download
   Dashie for Home Assistant") is the starting point for the new
   `get-dashie.html`.
3. **URLs** — keep `dashie-kiosk.html`'s URL (renaming breaks inbound links);
   just relabel it in the nav.
4. **iOS** — **no iOS yet.** The Get Dashie page is Android-only (Play /
   Amazon / Sideload). iOS App Store is not ready for primetime.
5. **Nav consistency** — **migrate the inline-nav pages onto
   `components/header.js`** within Phase 1, so this is the last time nav lives
   in N places.

## Phases

### Phase 1 — Get Dashie page + nav restructure + header migration + HA CTA  *(do first)*

1. **Create `get-dashie.html`** — start from `dashie-kiosk-download.html`.
   Content = the multi-channel download matrix (see "Get Dashie page" below).
   Android-only.
2. **Restructure the nav to the 6-item target** in `components/header.js`:
   - "Dashie [Early Access]" → **"For Families" [Beta]** (→ `/beta-signup`).
   - "For Home Assistant" → **drop the Beta tag** (→ `/dashie-kiosk`).
   - Add **Pricing** (→ `/pricing`, may 404 until Phase 2) and **Get Dashie**
     (→ `/get-dashie`).
   - Add the **About ▾** dropdown (Privacy Policy / Terms of Service /
     Contact Us).
   - Drop the explicit "Home" item (logo → Home).
3. **Header migration** — migrate every inline-nav page onto
   `components/header.js` so nav lives in exactly one file.
4. **For-Home-Assistant page (`dashie-kiosk.html`)** — change the primary CTA
   + link to point to **`/get-dashie`** (instead of the current HA download
   path).

### Phase 2 — Pricing page

- Create `pricing.html` — the subscription tiers / trial (30-day trial,
  paid subscription). Wire the `Pricing` nav item to it.

### Phase 3 — Content cleanup & consolidation

- "For Home Assistant" page body — remove remaining "Beta" references (not
  just the nav tag).
- Build the dedicated `for-families.html`.
- Retire / redirect legacy pages (`dashie-lite-*.html`, possibly
  `dashie-kiosk-beta.html` / `beta-signup.html` once "Get Dashie" + a beta
  registration flow supersede them).
- Confirm `About` targets and `contact/` content.

## The "Get Dashie" page — content spec

Presents Dashie's **three Android distribution channels**, each with a
**stable** (public) and **beta** (registered-users-only) path — mirroring the
release-track model (`_HOW_TO.md` §1.7). No iOS yet.

| Channel | Stable | Beta |
|---|---|---|
| **Google Play** | "Get on Google Play" badge → Play listing | Play **closed-testing opt-in** link (emailed to registered beta users) |
| **Amazon Appstore** | "Available at Amazon" badge → Amazon listing | Amazon **Live App Testing** invite (emailed) |
| **Sideload (direct APK)** | `Dashie-sideload.apk` direct download | `Dashie-sideload-beta.apk` (link emailed to registered beta users) |

- Beta is **ungated but unlisted** — the public page shows the stable
  downloads; beta links are only sent by email after the user registers via
  the beta signup form (the existing relationship-building flow).
- Once installed, each channel **auto-updates** on its track (Play/Amazon
  store tracks; sideload polls `sideload-latest.json` / `sideload-beta.json`).
- Versioning shown to users: stable version + (for beta) the beta version
  ("1.1 stable / 1.2 beta" as the human label).

## Notes

- The website is its own repo (`dashieapp-website`); commit + push there to
  deploy via Vercel. Per the deploy rules, that push is the publish step —
  do NOT push without an explicit deploy request.
- Nav lives in `components/header.js` *and* inline copies — Phase 1 reduces
  that to one shared component.
