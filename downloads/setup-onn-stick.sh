#!/usr/bin/env bash
#
# setup-onn-stick.sh — turn a Walmart onn Google TV stick into a dedicated
# Dashie display. Installs the self-updating Dashie app, makes Dashie the
# home app (so the stick boots straight into your dashboard), and disables
# the Google TV Home launcher + sponsored-content bloat.
#
# This is the public companion to the guide at:
#   https://dashieapp.com/guides/onn-stick-setup
#
# It is SAFE by design: it verifies Dashie can be a launcher BEFORE disabling
# anything, skips packages that aren't present, and every change is reversible
# (see RECOVERY below). Run with --dry-run first to preview every command.
#
# ─────────────────────────────────────────────────────────────────────────
# WHAT YOU NEED FIRST (do these on the stick + your computer)
# ─────────────────────────────────────────────────────────────────────────
#   1. Boot the new onn stick and walk through Google TV setup.
#      WiFi is REQUIRED. A Google account is OPTIONAL — pick "Skip" if asked.
#   2. On the stick, enable Developer options:
#         Settings → System → About → tap "Android TV OS build" 7 times.
#   3. On the stick, enable Wireless debugging:
#         Settings → System → Developer options → "Wireless debugging" → ON
#         → "Pair device with pairing code".
#      Note the IP, the pairing port, and the 6-digit code it shows.
#   4. Install ADB on your computer (Android SDK "platform-tools"):
#         https://developer.android.com/tools/releases/platform-tools
#      Unzip it and make sure `adb` is on your PATH.
#   5. From your computer, pair + connect (two different ports — read carefully):
#         adb pair    <ip>:<pairing-port>   <6-digit-code>
#         adb connect <ip>:<connect-port>
#      Confirm the stick shows up in:  adb devices
#   6. Run this script.  (First time: add --dry-run to preview.)
#
# ─────────────────────────────────────────────────────────────────────────
# USAGE
# ─────────────────────────────────────────────────────────────────────────
#   ./setup-onn-stick.sh [options]
#
# Options:
#   --device <id>     Target a specific ADB device. Auto-detected when exactly
#                     one onn stick is connected.
#   --apk <path>      Install a local APK instead of downloading from dashieapp.com.
#   --dry-run         Print every command but change nothing. Use this first.
#   --skip-install    Skip the app install; just (re-)apply the home-app +
#                     bloat-disable config. Use if Dashie is already installed.
#   -h | --help       Show this help.
#
# ─────────────────────────────────────────────────────────────────────────
# RECOVERY (everything here is reversible)
# ─────────────────────────────────────────────────────────────────────────
#   Get back to the system Settings on the stick at any time:
#     Hold the BACK button for 2 seconds anywhere in Dashie.
#
#   Re-enable the Google TV Home launcher (from your computer):
#     adb -s <id> shell pm enable com.google.android.apps.tv.launcherx
#   Re-enable any app this script disabled:
#     adb -s <id> shell pm enable <package-name>
#   Point HOME back at Google TV Home:
#     adb -s <id> shell cmd package set-home-activity \
#        com.google.android.apps.tv.launcherx/com.google.android.apps.tv.launcherx.MainActivity
#
#   Nothing here is permanent — a factory reset also returns the stick to stock.
#

set -euo pipefail

# ─── Config ────────────────────────────────────────────────────────────
DASHIE_PACKAGE="com.dashieapp.Dashie"
DASHIE_HOME_ACTIVITY="com.dashieapp.Dashie/.MainActivity"
GOOGLE_TV_HOME="com.google.android.apps.tv.launcherx"
DASHIE_APK_URL="https://dashieapp.com/downloads/Dashie-sideload-beta.apk"

# Bloat list — validated safe on the onn Google TV stick. The Google TV Home
# launcher (com.google.android.apps.tv.launcherx) is intentionally NOT in this
# list; it's handled separately AFTER Dashie is set as home, so the stick is
# never left without a working launcher.
BLOAT_PACKAGES=(
    com.google.android.youtube.tv
    com.google.android.youtube.tvmusic
    com.netflix.ninja
    com.netflix.tokenmanager
    com.android.vending                         # Play Store (Dashie self-updates, so not needed)
    com.google.android.tungsten.setupwraith     # Setup wizard (done after first boot)
    com.google.android.apps.tv.dreamx           # Ambient/screensaver
    com.google.android.apps.mediashell
    com.google.android.feedback
    com.google.android.play.games
    com.gretzky.hwinfo
    com.google.android.katniss                  # Google Assistant on TV
    com.onn.bluetoothconnect
    com.onn.updatenotification
    com.google.android.tv.axel
    com.google.android.marvin.talkback          # screen reader — re-enable if you use it
    com.google.android.syncadapters.calendar
    com.android.settings.intelligence
)

# ─── Defaults ──────────────────────────────────────────────────────────
DEVICE=""
APK_PATH=""
DRY_RUN=0
SKIP_INSTALL=0

# ─── Colors ────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
    RED=$'\033[31m'; GRN=$'\033[32m'; YEL=$'\033[33m'; BLU=$'\033[34m'; DIM=$'\033[2m'; RST=$'\033[0m'
else
    RED=""; GRN=""; YEL=""; BLU=""; DIM=""; RST=""
fi

ok()   { echo "${GRN}✓${RST} $*"; }
info() { echo "${BLU}ℹ${RST} $*"; }
warn() { echo "${YEL}⚠${RST} $*"; }
err()  { echo "${RED}✗${RST} $*" >&2; }
step() { echo ""; echo "${BLU}━━━${RST} ${1} ${BLU}━━━${RST}"; }

# ─── Arg parsing ───────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
    case "$1" in
        --device)       DEVICE="$2"; shift 2 ;;
        --apk)          APK_PATH="$2"; shift 2 ;;
        --dry-run)      DRY_RUN=1; shift ;;
        --skip-install) SKIP_INSTALL=1; shift ;;
        -h|--help)      sed -n '2,/^$/p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *)              err "Unknown option: $1"; exit 2 ;;
    esac
done

# ─── Dry-run wrapper ───────────────────────────────────────────────────
run() {
    if [[ $DRY_RUN -eq 1 ]]; then
        echo "${DIM}[dry-run]${RST} $*"
    else
        "$@"
    fi
}

# adb shell wrapper bound to the chosen device. Single source of truth so
# dry-run captures every adb call.
adbsh() { run adb -s "$DEVICE" shell "$@"; }

# ─── Step 1: pick the device ───────────────────────────────────────────
step "Selecting ADB device"
if ! command -v adb >/dev/null 2>&1; then
    err "adb not found on your PATH. Install Android SDK platform-tools:"
    err "  https://developer.android.com/tools/releases/platform-tools"
    exit 1
fi

if [[ -z "$DEVICE" ]]; then
    # Auto-detect: look for exactly one onn Google TV stick.
    # Avoiding `mapfile` because macOS ships bash 3.2.
    CANDIDATES=()
    while IFS= read -r line; do
        [[ -n "$line" ]] && CANDIDATES+=("$line")
    done < <(adb devices -l | awk '/Streaming_Device|onn_2k_gtv/ {print $1}')
    if [[ ${#CANDIDATES[@]} -eq 0 ]]; then
        err "No onn stick detected via ADB. Pair & connect the stick first"
        err "(see the WHAT YOU NEED FIRST section at the top of this script), then retry."
        err "Or pass --device <id> to target a specific device from 'adb devices'."
        exit 1
    elif [[ ${#CANDIDATES[@]} -gt 1 ]]; then
        err "Multiple sticks connected. Pass --device <id> to choose one:"
        printf '  - %s\n' "${CANDIDATES[@]}" >&2
        exit 1
    fi
    DEVICE="${CANDIDATES[0]}"
fi

MODEL=$(adb -s "$DEVICE" shell getprop ro.product.model 2>/dev/null | tr -d '\r' || true)
ANDROID_VER=$(adb -s "$DEVICE" shell getprop ro.build.version.release 2>/dev/null | tr -d '\r' || true)
if [[ -z "$MODEL" ]]; then
    err "Device $DEVICE is not responding. Check the ADB connection."
    exit 1
fi
ok "Device: $DEVICE  ($MODEL, Android $ANDROID_VER)"
if [[ "$MODEL" != *"Streaming Device"* ]]; then
    warn "This doesn't look like an onn Google TV stick. Continue anyway? [y/N]"
    read -r CONFIRM
    [[ "$CONFIRM" =~ ^[Yy]$ ]] || { info "Aborted."; exit 0; }
fi

# ─── Step 2: the APK ───────────────────────────────────────────────────
if [[ $SKIP_INSTALL -eq 1 ]]; then
    step "Skipping app install (--skip-install)"
    if ! adb -s "$DEVICE" shell pm list packages | grep -q "$DASHIE_PACKAGE$"; then
        err "--skip-install set but Dashie is not installed. Aborting."
        exit 1
    fi
    ok "Dashie already installed"
else
    step "Downloading the Dashie app"
    if [[ -z "$APK_PATH" ]]; then
        APK_PATH="$(mktemp -t Dashie.XXXXXX).apk"
        info "Fetching $DASHIE_APK_URL"
        run curl -fsSL --retry 2 -o "$APK_PATH" "$DASHIE_APK_URL"
        if [[ $DRY_RUN -eq 0 && ! -s "$APK_PATH" ]]; then
            err "Download failed (empty file). Check your network and try again."
            exit 1
        fi
        ok "Downloaded to $APK_PATH"
    else
        [[ -f "$APK_PATH" ]] || { err "APK not found: $APK_PATH"; exit 1; }
        ok "Using local APK: $APK_PATH"
    fi

    step "Installing Dashie"
    run adb -s "$DEVICE" install -r "$APK_PATH"
fi

# ─── Step 3: verify Dashie can be the home app ─────────────────────────
step "Verifying Dashie can be the home app"
if [[ $DRY_RUN -eq 0 ]]; then
    if ! adb -s "$DEVICE" shell cmd package query-activities -a android.intent.action.MAIN -c android.intent.category.HOME 2>&1 | grep -q "$DASHIE_PACKAGE"; then
        err "Dashie isn't reporting itself as a launcher yet. Refusing to disable the"
        err "Google TV Home — that would leave the stick with no launcher. Open Dashie"
        err "once on the stick, then re-run this script."
        exit 1
    fi
fi
ok "Dashie is eligible to be the home app"

# ─── Step 4: set Dashie as home ────────────────────────────────────────
step "Setting Dashie as the home app"
adbsh cmd package set-home-activity "$DASHIE_HOME_ACTIVITY"
ok "Home app → $DASHIE_HOME_ACTIVITY"

# ─── Step 5: disable Google TV Home ────────────────────────────────────
# Done AFTER setting Dashie as home so HOME never resolves to nothing.
step "Disabling Google TV Home (the sponsored-content launcher)"
adbsh pm disable-user --user 0 "$GOOGLE_TV_HOME"
ok "Disabled $GOOGLE_TV_HOME"

# ─── Step 6: disable bloat ─────────────────────────────────────────────
step "Disabling bloat (${#BLOAT_PACKAGES[@]} packages)"
DISABLED_COUNT=0
SKIPPED_COUNT=0
for pkg in "${BLOAT_PACKAGES[@]}"; do
    if [[ $DRY_RUN -eq 1 ]]; then
        echo "${DIM}[dry-run]${RST} adb -s $DEVICE shell pm disable-user --user 0 $pkg"
        DISABLED_COUNT=$((DISABLED_COUNT + 1))
        continue
    fi
    # Skip packages not present (some sticks ship without all of these).
    if ! adb -s "$DEVICE" shell pm list packages 2>/dev/null | grep -q "$pkg\$"; then
        echo "  ${DIM}—${RST} $pkg ${DIM}(not installed)${RST}"
        SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
        continue
    fi
    # pm disable-user is idempotent (re-disabling is a no-op).
    if adb -s "$DEVICE" shell pm disable-user --user 0 "$pkg" 2>&1 | grep -q "new state: disabled"; then
        echo "  ${GRN}✓${RST} $pkg"
        DISABLED_COUNT=$((DISABLED_COUNT + 1))
    else
        echo "  ${YEL}—${RST} $pkg ${DIM}(already disabled or refused)${RST}"
        SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    fi
done

# ─── Summary ───────────────────────────────────────────────────────────
step "Summary"
if [[ $DRY_RUN -eq 1 ]]; then
    warn "Dry run — nothing was changed. Re-run without --dry-run to apply."
else
    CURRENT_HOME=$(adb -s "$DEVICE" shell cmd package resolve-activity -c android.intent.category.HOME -a android.intent.action.MAIN 2>&1 | awk -F= '/packageName=/{print $2; exit}' | tr -d '\r')
    ok "Home app: $CURRENT_HOME"
    ok "Bloat disabled: $DISABLED_COUNT  |  skipped: $SKIPPED_COUNT"
    echo ""
    info "Next steps:"
    info "  • Unplug and replug the stick — it should boot straight into Dashie."
    info "  • If Dashie can't load (e.g. no internet), hold BACK for 2s to reach Settings."
    info "  • Wireless debugging resets on each reboot — re-pair before your next ADB session."
fi
