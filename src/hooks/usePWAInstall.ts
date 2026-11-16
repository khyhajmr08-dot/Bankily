import { useCallback, useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt: () => Promise<void>;
}

declare global {
  interface Window {
    __bankilyDeferredInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export type InstallOutcome = 'accepted' | 'dismissed' | 'manual-required';

export function detectStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  const standaloneMedia =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches;
  const iosStandalone =
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return standaloneMedia || iosStandalone;
}

export function detectEmbeddedIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__bankilyDeferredInstallPrompt) {
      return window.__bankilyDeferredInstallPrompt;
    }
    return null;
  });

  const [isStandalone, setIsStandalone] = useState<boolean>(() => detectStandaloneMode());
  const [isInstalled, setIsInstalled] = useState<boolean>(() => detectStandaloneMode());
  const [isInIframe] = useState<boolean>(() => detectEmbeddedIframe());
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const androidDevice = /android/.test(ua);
    setIsIOS(iosDevice);
    setIsAndroid(androidDevice);

    const updateStandalone = () => {
      const runningStandalone = detectStandaloneMode();
      setIsStandalone(runningStandalone);
      if (runningStandalone) {
        setIsInstalled(true);
      }
    };

    updateStandalone();

    // Check WebAPK / related installed apps when supported by Android Chrome
    const navWithApps = navigator as Navigator & {
      getInstalledRelatedApps?: () => Promise<Array<{ id?: string; platform?: string }>>;
    };
    if (typeof navWithApps.getInstalledRelatedApps === 'function') {
      navWithApps
        .getInstalledRelatedApps()
        .then((apps) => {
          if (apps && apps.length > 0) {
            setIsInstalled(true);
          }
        })
        .catch(() => {
          // Ignore unsupported browser errors
        });
    }

    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const fullscreenQuery = window.matchMedia('(display-mode: fullscreen)');
    standaloneQuery.addEventListener?.('change', updateStandalone);
    fullscreenQuery.addEventListener?.('change', updateStandalone);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      window.__bankilyDeferredInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      if (!detectStandaloneMode()) {
        setIsInstalled(false);
      }
    };

    const handleAppInstalled = () => {
      window.__bankilyDeferredInstallPrompt = null;
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      standaloneQuery.removeEventListener?.('change', updateStandalone);
      fullscreenQuery.removeEventListener?.('change', updateStandalone);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<InstallOutcome> => {
    const activePrompt = deferredPrompt ?? window.__bankilyDeferredInstallPrompt ?? null;
    if (!activePrompt) {
      return 'manual-required';
    }

    try {
      await activePrompt.prompt();
      const { outcome } = await activePrompt.userChoice;
      if (outcome === 'accepted') {
        window.__bankilyDeferredInstallPrompt = null;
        setDeferredPrompt(null);
        setIsInstalled(true);
        return 'accepted';
      }
      return 'dismissed';
    } catch {
      return 'manual-required';
    }
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isStandalone,
    isInIframe,
    isIOS,
    isAndroid,
    install,
  };
}
