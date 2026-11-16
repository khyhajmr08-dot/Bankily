import { useEffect, useState } from 'react';

function isFormControlFocused(): boolean {
  if (typeof document === 'undefined') return false;
  const active = document.activeElement;
  if (!active) return false;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName);
}

function keyboardIsOpen(): boolean {
  const viewport = window.visualViewport;
  return Boolean(viewport && window.innerHeight - viewport.height > 120);
}

/**
 * Keep the app's full-height layout stable while Android's soft keyboard opens.
 * The visual viewport can resize before the input receives focus, so focus state
 * alone is not sufficient to decide whether the app shell should shrink.
 */
export function useLockedViewportHeight(): number | null {
  const [lockedHeight, setLockedHeight] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.innerWidth < 1024 ? window.innerHeight : null;
  });

  useEffect(() => {
    let blurTimer: number | null = null;

    const syncFullHeight = (force = false) => {
      if (window.innerWidth >= 1024) {
        setLockedHeight(null);
        return;
      }

      const nextHeight = window.innerHeight;
      setLockedHeight((previous) => {
        if (previous === null) return nextHeight;
        if (!force && (isFormControlFocused() || keyboardIsOpen())) return previous;
        return nextHeight;
      });
    };

    const handleResize = () => syncFullHeight(false);
    const handleOrientationChange = () => {
      window.setTimeout(() => syncFullHeight(true), 250);
    };
    const handleFocusIn = () => {
      if (blurTimer !== null) {
        window.clearTimeout(blurTimer);
        blurTimer = null;
      }
    };
    const handleFocusOut = () => {
      if (blurTimer !== null) window.clearTimeout(blurTimer);
      blurTimer = window.setTimeout(() => {
        if (!isFormControlFocused() && !keyboardIsOpen()) {
          syncFullHeight(true);
          if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          }
        }
      }, 180);
    };

    const visualViewport = window.visualViewport;
    syncFullHeight(true);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    visualViewport?.addEventListener('resize', handleResize);
    visualViewport?.addEventListener('scroll', handleResize);

    return () => {
      if (blurTimer !== null) window.clearTimeout(blurTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      visualViewport?.removeEventListener('resize', handleResize);
      visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  return lockedHeight;
}
