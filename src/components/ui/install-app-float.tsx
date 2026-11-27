'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Download, Share, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const emptySubscribe = () => () => {};

function useShouldShowInstall() {
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      const wasDismissed = sessionStorage.getItem('iloveshare_install_dismissed') === '1';
      return !standalone && !wasDismissed;
    },
    () => false
  );
}

/**
 * Floating cross-device app install button supporting native PWA install prompts
 * (Chrome, Edge, Android) as well as iOS Safari Add-to-Home-Screen instructions.
 */
export function InstallAppFloat() {
  const canShow = useShouldShowInstall();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setInstalled(true);
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!canShow || installed || dismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      return;
    }
    setShowModal(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('iloveshare_install_dismissed', '1');
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1 rounded-full bg-brand-surface/95 backdrop-blur-md border border-brand-border shadow-large p-1 pl-1.5">
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary text-white text-xs sm:text-sm font-medium hover:opacity-95 transition-opacity"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>Install App</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="p-1.5 rounded-full text-brand-muted hover:text-brand-text transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-brand-surface border border-brand-border p-6 shadow-large text-brand-text"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="font-serif text-lg font-bold">Install iLoveShare</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close install instructions"
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-brand-muted">
              <div className="p-3 rounded-xl bg-brand-background border border-brand-border">
                <p className="font-semibold text-brand-text mb-1">iPhone / iPad (Safari)</p>
                <p className="text-xs leading-relaxed">
                  Tap the <Share className="w-3.5 h-3.5 inline mx-0.5 text-brand-primary" /> <strong>Share</strong> button, then tap <strong>Add to Home Screen</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-brand-background border border-brand-border">
                <p className="font-semibold text-brand-text mb-1">Android / Desktop (Chrome / Edge)</p>
                <p className="text-xs leading-relaxed">
                  Open the browser menu (<strong>⋮</strong>) and tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
