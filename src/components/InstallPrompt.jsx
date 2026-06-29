import { useCallback, useEffect, useState } from "react";

import { Download, Share, SquarePlus, X } from "lucide-react";

import { track } from "../utils/analytics.js";
import { useInstallPrompt } from "../utils/useInstallPrompt.js";

// Local-storage key for "user dismissed the floating banner". Once set, we stay quiet
// for DISMISS_DAYS before offering again — long enough to not nag, short enough that a
// new challenge week (the booster rotates fortnightly) reminds latecomers. The in-drawer
// card ignores this — it's always available for users who closed the banner.
const DISMISS_KEY = "sp_install_dismissed_at";
const DISMISS_DAYS = 14;

function dismissedRecently() {
  try {
    const ts = Number(localStorage.getItem(DISMISS_KEY));
    if (!ts) {
      return false;
    }
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

// The iOS "Share → Add to Home Screen" instruction line, shared by both surfaces.
function IosHintText() {
  return (
    <>
      It&rsquo;s just this page — nothing to download. Tap{" "}
      <Share size={14} strokeWidth={2.5} className="install-inline-icon" aria-label="the Share button" /> then{" "}
      <b>
        Add to Home Screen <SquarePlus size={14} strokeWidth={2.5} className="install-inline-icon" aria-hidden="true" />
      </b>
      .
    </>
  );
}

/**
 * Floating, dismissible "install this app" banner pinned to the bottom of the viewport.
 * Shown only in a browser tab (not when installed) and respects a 14-day dismissal.
 */
function InstallPrompt() {
  const { installed, canInstall, iosHint, install } = useInstallPrompt("banner");
  const [visible, setVisible] = useState(false);

  // Reveal once we know there's an install path to offer, unless recently dismissed.
  useEffect(() => {
    if (installed || dismissedRecently()) {
      return;
    }
    if (canInstall) {
      setVisible(true);
      track("install_prompt_shown", { method: "native", source: "banner" });
    } else if (iosHint) {
      setVisible(true);
      track("install_prompt_shown", { method: "ios", source: "banner" });
    }
  }, [installed, canInstall, iosHint]);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore storage failures (private mode etc.) — we just won't remember.
    }
    track("install_prompt_dismissed", { method: iosHint ? "ios" : "native", source: "banner" });
  }, [iosHint]);

  const onInstall = useCallback(async () => {
    const outcome = await install();
    if (outcome === "accepted") {
      setVisible(false);
    }
  }, [install]);

  if (!visible || installed) {
    return null;
  }

  return (
    <section className="install-prompt" aria-label="Install this app">
      <div className="install-icon" aria-hidden="true">
        <Download size={22} strokeWidth={2.25} />
      </div>
      <div className="install-body">
        <p className="install-title">Add to your home screen</p>
        {iosHint ? (
          <p className="install-text">
            <IosHintText />
          </p>
        ) : (
          <p className="install-text">
            Add <b>SlimPossible 2026</b> to your home screen for one-tap access. It&rsquo;s just this web page — nothing to download.
          </p>
        )}
      </div>
      {canInstall && (
        <button type="button" className="install-cta" onClick={onInstall}>
          Install
        </button>
      )}
      <button type="button" className="install-close" onClick={dismiss} aria-label="Dismiss install prompt">
        <X size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </section>
  );
}

/**
 * Persistent install card for the bottom of the details drawer. Unlike the floating
 * banner, this has no dismiss timer — it's always available while the user is in a
 * browser tab, so latecomers who closed the banner still have a way in.
 *
 * Renders nothing once installed, or when there's no install path (e.g. a desktop
 * browser that never fired beforeinstallprompt and isn't iOS Safari).
 */
function InstallCard() {
  const { installed, canInstall, iosHint, install } = useInstallPrompt("drawer_card");

  // Announce the card once, when it first becomes available.
  useEffect(() => {
    if (installed) {
      return;
    }
    if (canInstall) {
      track("install_prompt_shown", { method: "native", source: "drawer_card" });
    } else if (iosHint) {
      track("install_prompt_shown", { method: "ios", source: "drawer_card" });
    }
  }, [installed, canInstall, iosHint]);

  if (installed || (!canInstall && !iosHint)) {
    return null;
  }

  return (
    <section className="install-card">
      <h2>📲 Install this app</h2>
      <p className="install-card-text">
        {iosHint ? (
          <IosHintText />
        ) : (
          <>
            Add <b>SlimPossible 2026</b> to your home screen for one-tap, full-screen access. It&rsquo;s just this web page — nothing to download.
          </>
        )}
      </p>
      {canInstall && (
        <button type="button" className="install-card-cta" onClick={install}>
          <Download size={16} strokeWidth={2.25} aria-hidden="true" />
          Install
        </button>
      )}
    </section>
  );
}

export default InstallPrompt;
export { InstallCard };
