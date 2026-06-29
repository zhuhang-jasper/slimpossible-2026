import { useCallback, useEffect, useState } from "react";

import { Download, Share, SquarePlus, X } from "lucide-react";

import { track } from "../utils/analytics.js";

// Local-storage key for "user dismissed the install prompt". Once set, we stay quiet
// for DISMISS_DAYS before offering again — long enough to not nag, short enough that a
// new challenge week (the booster rotates fortnightly) reminds latecomers.
const DISMISS_KEY = "sp_install_dismissed_at";
const DISMISS_DAYS = 14;

// Already running as an installed app? Mirrors the display-mode checks in analytics.js
// (kept local so this component stays self-contained).
function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }
  if (window.navigator.standalone === true) {
    return true; // iOS installed PWA
  }
  if (document.referrer.startsWith("android-app://")) {
    return true; // Android TWA
  }
  return ["fullscreen", "standalone", "minimal-ui"].some((m) => window.matchMedia(`(display-mode: ${m})`).matches);
}

// iOS Safari never fires beforeinstallprompt, so installs there are manual
// (Share → Add to Home Screen). Detect it so we can show instructions instead of a button.
function isIosSafari() {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // Exclude in-app browsers / other engines that masquerade — only real Safari can A2HS.
  const webkit = /WebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return iOS && webkit;
}

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

/**
 * A dismissible "install this app" banner.
 *
 * - Chrome / Edge / Android: captures the deferred `beforeinstallprompt` event and shows
 *   a one-tap Install button that calls the native prompt.
 * - iOS Safari: shows manual "Share → Add to Home Screen" instructions (no native prompt).
 * - Already installed, or no install path available: renders nothing.
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || dismissedRecently()) {
      return;
    }

    // Chrome/Edge/Android: stash the event so we can trigger the prompt on tap.
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
      track("install_prompt_shown", { method: "native" });
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // Hide the banner once the app is actually installed.
    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
      track("install_accepted", { method: "appinstalled_event" });
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari can't fire beforeinstallprompt — fall back to manual instructions.
    if (isIosSafari()) {
      setIosHint(true);
      setVisible(true);
      track("install_prompt_shown", { method: "ios" });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore storage failures (private mode etc.) — we just won't remember.
    }
    track("install_prompt_dismissed", { method: iosHint ? "ios" : "native" });
  }, [iosHint]);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    track(outcome === "accepted" ? "install_accepted" : "install_dismissed", { method: "native_choice" });
    setDeferredPrompt(null);
    setVisible(false);
  }, [deferredPrompt]);

  if (!visible) {
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
            It&rsquo;s just this page — nothing to download. Tap{" "}
            <Share size={14} strokeWidth={2.5} className="install-inline-icon" aria-label="the Share button" /> then{" "}
            <b>
              Add to Home Screen <SquarePlus size={14} strokeWidth={2.5} className="install-inline-icon" aria-hidden="true" />
            </b>
            .
          </p>
        ) : (
          <p className="install-text">
            Add <b>SlimPossible 2026</b> to your home screen for one-tap access. It&rsquo;s just this web page — nothing to download.
          </p>
        )}
      </div>
      {!iosHint && (
        <button type="button" className="install-cta" onClick={install}>
          Install
        </button>
      )}
      <button type="button" className="install-close" onClick={dismiss} aria-label="Dismiss install prompt">
        <X size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </section>
  );
}
