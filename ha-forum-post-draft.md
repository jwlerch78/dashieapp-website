# HA Community Forum Post Draft

**Category:** Share your Projects! > Dashboards & Frontend
**URL:** https://community.home-assistant.io/c/projects/frontend/34

---

## Post Title Options (pick one):

1. `Dashie -- Free Kiosk App for Home Assistant with Voice Control, Photo Screensaver & Family Dashboard`
2. `I built a free Fully Kiosk alternative with on-device voice control and family features -- meet Dashie`
3. `Dashie -- Purpose-Built HA Dashboard App: Free Kiosk Mode, Wake Word, Photo Screensaver & More`

---

## Post Body:

Hey everyone!

I've been running Home Assistant dashboards on wall-mounted tablets and Fire TV sticks for a few years now. Like many of you, I started with Fully Kiosk Browser -- it's solid, but I kept wanting more: voice control without cloud dependency, a photo screensaver that pulls from my own libraries, a music player overlay, and a way to turn these tablets into something the whole family actually uses -- not just me staring at sensor graphs.

So I built **Dashie** -- a free, purpose-built app for displaying Home Assistant dashboards on Android tablets, Fire TV, and Google TV devices. It started as a kiosk replacement and grew into a full family dashboard, but the kiosk/HA mode is completely free and works without any account.

### What it does (Kiosk / HA Mode -- free, no account needed)

- **Full-screen kiosk** for any HA dashboard with auto-discovery (SSDP) and URL builder
- **Fully Kiosk Browser API compatible** (port 2323) -- works with existing HA integrations and automations that target Fully Kiosk
- **Photo screensaver** pulling from Home Assistant Media, local folders, Immich, or Google Photos
- **Screen management** -- auto-dimming, scheduled sleep/wake, keep-screen-on, ambient light sensor
- **Motion-activated wake** with optional ML Kit face detection (filters out pets and shadows)
- **Native music player overlay** -- shows what's playing on any HA media_player entity
- **D-pad / remote navigation** for Fire TV sticks and Android TV
- **RTSP camera streaming** to Frigate or HA
- **Dashboard zoom** and return-to-home timeout
- **OOM recovery** -- auto-restarts and restores your dashboard URL if the WebView crashes

### Voice Control ($12 one-time unlock, 7-day free trial)

- **"Hey Dashie" wake word** -- on-device detection via Edge Impulse, no cloud needed
- **Home Assistant Assist pipeline** integration -- control your smart home by voice
- **Local Whisper STT** option for fully private speech recognition
- **Timer management** -- "Set a 5 minute timer" with native alarm sounds
- **Volume and media commands** -- natural language control

### How it compares to Fully Kiosk Browser

| | Fully Kiosk | Dashie |
|---|---|---|
| **Price** | $6.90/device | Free (voice: $12 one-time) |
| **Purpose** | Generic kiosk browser | Built for Home Assistant |
| **Voice control** | No | Yes -- on-device wake word + HA Assist |
| **Photo screensaver** | Basic | Immich, Google Photos, HA Media, local |
| **Music overlay** | No | Yes -- syncs with HA media_player |
| **Face detection wake** | No | Yes -- ML Kit, filters pets/shadows |
| **API compatible** | N/A | Yes -- drop-in replacement (port 2323) |
| **Setup** | Manual URL entry | Auto-discovery + URL builder |
| **Fire TV / Android TV** | Limited | Full D-pad navigation |

### Home Assistant Integration

There's a custom integration available via HACS that provides:
- Auto-discovery of Dashie devices on your network
- Screen on/off, brightness, and volume control
- TTS announcements to specific tablets
- Camera image capture
- Dashboard URL navigation
- Battery, brightness, and connection sensors

[TODO: Add HACS repo link or installation instructions]

### Family Dashboard Mode (optional, with free account)

If you sign in, the same app becomes a full family dashboard with:
- Configurable widget grid (clock, calendar, weather, photos, chores, and more)
- **Chores & rewards** -- assign tasks, track points, gamify household chores for kids
- **Family calendar** with multi-calendar aggregation
- **Location tracking** for family members
- **AI assistant** with multiple providers (Claude, GPT-4o, Gemini)
- Works across web, Android, and iOS

This is totally optional -- the kiosk/HA features work without any account.

### Screenshots

[TODO: Add 3-4 screenshots showing:
1. Kiosk mode displaying an HA dashboard
2. Photo screensaver in action
3. Voice overlay / timer display
4. Settings/setup screen with auto-discovery
5. (Optional) Family dashboard with widgets]

### Hardware I'm Running It On

- Amazon Fire HD 8/10 tablets (wall-mounted) -- $50-80
- Fire TV Stick 4K -- with HA dashboard on the TV
- Samsung Galaxy Tab -- for the family dashboard
- Mio 15" and 32" wall displays
- Any Android 7+ tablet or TV device should work

### Getting Started

1. Download the APK from [dashieapp.com/dashie-lite](https://dashieapp.com/dashie-lite)
2. Open the app -- it will auto-discover your HA instance
3. Select your dashboard and configure kiosk settings
4. (Optional) Install the HACS integration for automation control

### What's Next

- iOS kiosk mode (Capacitor-based, early access now)
- More photo source integrations
- Enhanced Assist pipeline features
- Continued Fully Kiosk API parity

### Current Status

The app is in late beta -- I've been running it daily on multiple devices for months and it's stable, but I'm still actively developing and would love feedback from the community. If you run into issues or have feature requests, I'm happy to hear them.

---

**Links:**
- Download: [dashieapp.com/dashie-lite](https://dashieapp.com/dashie-lite)
- Website: [dashieapp.com](https://dashieapp.com)
- HACS Integration: [TODO: Add link]

Thanks for reading! Would love to hear what you think, especially if you're currently using Fully Kiosk and have been wanting more from your wall tablets.

---

## NOTES FOR YOU (not part of the post):

### Before posting, you'll need:
1. **Screenshots** -- This is the #1 factor for engagement. 3-4 good screenshots of kiosk mode, screensaver, voice overlay, and setup screen. Upload directly to the forum (Discourse supports drag-and-drop).
2. **HACS integration link** -- Fill in the TODO with the GitHub repo URL for your HA integration.
3. **Demo video** (optional but high impact) -- A 60-90 second YouTube video showing setup + voice control would significantly boost engagement. DashVoice's YouTube demo was a major driver.
4. **Account on the forum** -- Create one at community.home-assistant.io if you don't have one already. New accounts may have posting limitations (1 image initially).

### Positioning strategy:
- Lead with **kiosk/HA mode** (free) -- this is what the HA community cares about
- Family dashboard is a bonus, not the headline
- The Fully Kiosk comparison table will drive the most interest
- "Free" and "on-device/local" are magic words in this community
- Stay responsive in the thread for the first few days -- answer every question

### Post timing:
- Best days: Tuesday-Thursday (weekday engagement is higher)
- Avoid weekends and HA release days (your post gets buried)
