import { useCallback, useEffect, useState } from "react";

import { track } from "./analytics.js";

// Already running as an installed app? Mirrors the display-mode checks in analytics.js.
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

/**
 * Shared install-state hook used by both the floating banner and the in-drawer card.
 *
 * Returns:
 *  - installed   : true once running as a standalone app (suppress all install UI)
 *  - canInstall  : a native `beforeinstallprompt` was captured → show an Install button
 *  - iosHint      : iOS Safari → show manual Add-to-Home-Screen instructions
 *  - install()    : trigger the native prompt (no-op unless canInstall); resolves to the outcome
 *
 * The `source` arg is only used to tag analytics so we can tell the banner and the
 * drawer card apart in GA.
 */
export function useInstallPrompt(source) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [iosHint, setIosHint] = useState(false);
  const [installed, setInstalled] = useState(() => isStandalone());

  useEffect(() => {
    if (isStandalone()) {
      return;
    }

    // Chrome/Edge/Android: stash the event so we can trigger the prompt on tap.
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // Mark installed once the app is actually added (hides all install UI live).
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      track("install_accepted", { method: "appinstalled_event", source });
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari can't fire beforeinstallprompt — fall back to manual instructions.
    if (isIosSafari()) {
      setIosHint(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [source]);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      return null;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    track(outcome === "accepted" ? "install_accepted" : "install_dismissed", { method: "native_choice", source });
    setDeferredPrompt(null);
    return outcome;
  }, [deferredPrompt, source]);

  return { installed, canInstall: Boolean(deferredPrompt), iosHint, install };
}
