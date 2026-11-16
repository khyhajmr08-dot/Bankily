import { useEffect, useState } from 'react';

function isFormControlFocused(): boolean {
  if (typeof document === 'undefined') return false;
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

/**
 * Locks the mobile viewport height to the full screen height before the soft keyboard opens.
 * Prevents WebViews / Chrome Custom Tabs / browsers from shrinking the layout height on input focus
 * and pushing bottom action bars (إرسال / أتمم / طلب / التالي) into the middle of the screen.
 */
export function useLockedViewportHeight(): number | null {
  const [lockedHeight, setLockedHeight] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.innerWidth < 1024 ? window.innerHeight : null;
  });

  useEffect(() => {
    let blurTimer: number | null = null;

    const syncFullHeight = (forceWhenFocused = false) => {
      if (window.innerWidth >= 1024) {
        setLockedHeight(null);
        return;
      }

      const currentInnerHeight = window.innerHeight;

      setLockedHeight((prev) => {
        if (prev === null || forceWhenFocused) {
          return currentInnerHeight;
        }
        // Only shrink the locked viewport height when NO input is focused (keyboard closed / orientation settled).
        if (!isFormControlFocused()) {
          return currentInnerHeight;
        }
        // If viewport grew (keyboard closed while element retained focus or browser toolbar hid), expand to match.
        if (currentInnerHeight > prev) {
          return currentInnerHeight;
        }
        return prev;
      });
    };

    const handleResize = () => {
      syncFullHeight(false);
    };

    const handleOrientationChange = () => {
      window.setTimeout(() => {
        syncFullHeight(true);
      }, 180);
    };

    const handleFocusOut = () => {
      if (blurTimer !== null) {
        window.clearTimeout(blurTimer);
      }
      blurTimer = window.setTimeout(() => {
        if (!isFormControlFocused()) {
          syncFullHeight(true);
          if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          }
        }
      }, 140);
    };

    syncFullHeight(true);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      if (blurTimer !== null) {
        window.clearTimeout(blurTimer);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return lockedHeight;
}
