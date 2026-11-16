/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { DesktopCompanionPanel } from './components/DesktopCompanionPanel';
import { ModalComponentsShowcase } from './components/library/ModalComponentsShowcase';
import { PinVerificationDialog } from './components/dialogs/PinVerificationDialog';
import { TransferSuccessDialog } from './components/dialogs/TransferSuccessDialog';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PWAInstallExperience } from './components/pwa/PWAInstallExperience';
import { BoardScreen } from './components/screens/BoardScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { RequestMoneyScreen } from './components/screens/RequestMoneyScreen';
import { SendMoneyScreen } from './components/screens/SendMoneyScreen';
import { TransferConfirmationScreen } from './components/screens/TransferConfirmationScreen';
import { useLockedViewportHeight } from './hooks/useLockedViewportHeight';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  AppScreen,
  INITIAL_REQUEST_DRAFT,
  INITIAL_TRANSFER_DRAFT,
  MoneyRequestRecord,
  RequestDraft,
  SplitGroup,
  TransactionRecord,
  TransferDraft,
} from './types/transfer';
import {
  formatMruDisplay,
  formatTransactionDateTime,
  generateTransactionId,
  getRecipientDisplay,
} from './utils/transferHelpers';

const STORAGE_KEY_TX = 'mauritop_sim_transactions_v1';
const STORAGE_KEY_GROUPS = 'mauritop_sim_groups_v1';
const STORAGE_KEY_REQUESTS = 'mauritop_sim_requests_v1';
const STORAGE_KEY_PWA_INSTALLED = 'bankily_pwa_installed_v1';

function MainApp() {
  const [screen, setScreen] = useState<AppScreen>(() => {
    if (typeof window === 'undefined') return 'home';
    const action = new URLSearchParams(window.location.search).get('action');
    if (action === 'send') return 'send';
    if (action === 'request') return 'request';
    if (action === 'board') return 'board';
    return 'home';
  });
  const [draft, setDraft] = useState<TransferDraft>(INITIAL_TRANSFER_DRAFT);
  const [requestDraft, setRequestDraft] = useState<RequestDraft>(INITIAL_REQUEST_DRAFT);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [completedTx, setCompletedTx] = useState<TransactionRecord | null>(null);

  const lockedMobileHeight = useLockedViewportHeight();
  const { isInstallable, isInstalled, isStandalone, isInIframe, isIOS, isAndroid, install } =
    usePWAInstall();
  const [persistedInstalled, setPersistedInstalled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PWA_INSTALLED) === 'true';
    } catch {
      return false;
    }
  });
  const [installPromptDismissed, setInstallPromptDismissed] = useState<boolean>(false);
  const [forceShowInstallModal, setForceShowInstallModal] = useState(false);

  useEffect(() => {
    const markInstalled = () => {
      setPersistedInstalled(true);
      setForceShowInstallModal(false);
      setInstallPromptDismissed(true);
      try {
        localStorage.setItem(STORAGE_KEY_PWA_INSTALLED, 'true');
      } catch {
        // Ignore storage quota errors
      }
    };

    if (isStandalone || isInstalled) {
      markInstalled();
    }

    window.addEventListener('appinstalled', markInstalled);
    return () => window.removeEventListener('appinstalled', markInstalled);
  }, [isInstalled, isStandalone]);

  const effectiveInstalled = isInstalled || isStandalone || persistedInstalled;
  const showInstallModal =
    !effectiveInstalled && (forceShowInstallModal || !installPromptDismissed);

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TX);
      return saved ? (JSON.parse(saved) as TransactionRecord[]) : [];
    } catch {
      return [];
    }
  });

  const [splitGroups, setSplitGroups] = useState<SplitGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
      return saved ? (JSON.parse(saved) as SplitGroup[]) : [];
    } catch {
      return [];
    }
  });

  const [moneyRequests, setMoneyRequests] = useState<MoneyRequestRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
      return saved ? (JSON.parse(saved) as MoneyRequestRecord[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
    } catch {
      // Ignore storage quota errors
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(splitGroups));
    } catch {
      // Ignore storage quota errors
    }
  }, [splitGroups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(moneyRequests));
    } catch {
      // Ignore storage quota errors
    }
  }, [moneyRequests]);

  // Android Hardware / System Back Navigation Support (History API)
  const navStateRef = useRef({
    screen,
    showPinDialog,
    hasCompletedTx: !!completedTx,
    showInstallModal,
  });
  navStateRef.current = {
    screen,
    showPinDialog,
    hasCompletedTx: !!completedTx,
    showInstallModal,
  };

  const pushHistoryMarker = useCallback((tag: string) => {
    try {
      window.history.pushState({ bankilyNav: tag }, '');
    } catch {
      // Ignore restricted history API calls
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const current = navStateRef.current;
      if (current.showInstallModal) {
        setForceShowInstallModal(false);
        setInstallPromptDismissed(true);
        return;
      }
      if (current.hasCompletedTx) {
        setCompletedTx(null);
        setDraft(INITIAL_TRANSFER_DRAFT);
        setScreen('home');
        return;
      }
      if (current.showPinDialog) {
        setShowPinDialog(false);
        return;
      }
      if (current.screen === 'confirm') {
        setScreen('send');
        return;
      }
      if (current.screen === 'send' || current.screen === 'request' || current.screen === 'board') {
        setScreen('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleDismissInstallModal = () => {
    setForceShowInstallModal(false);
    setInstallPromptDismissed(true);
  };

  const handleUpdateDraft = (patch: Partial<TransferDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleUpdateRequestDraft = (patch: Partial<RequestDraft>) => {
    setRequestDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleNavigateToSend = (prefill?: { phone?: string; amount?: string; note?: string }) => {
    if (prefill) {
      setDraft({
        ...INITIAL_TRANSFER_DRAFT,
        method: 'phone',
        phone: prefill.phone ?? '',
        amount: prefill.amount ?? '',
        note: prefill.note ?? '',
      });
    }
    pushHistoryMarker('send');
    setScreen('send');
  };

  const handlePinSuccess = () => {
    const now = new Date();
    const record: TransactionRecord = {
      id: generateTransactionId(now),
      method: draft.method,
      recipientDisplay: getRecipientDisplay(draft),
      recipientSubtext: draft.method === 'bank' ? draft.bankName : undefined,
      amount: formatMruDisplay(draft.amount),
      currency: 'MRU',
      note: draft.note.trim() || undefined,
      timestamp: formatTransactionDateTime(now),
      isFavorite: false,
      status: 'SUCCESS',
    };

    setShowPinDialog(false);
    setTransactions((prev) => [record, ...prev]);
    setCompletedTx(record);
  };

  const handleToggleFavorite = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, isFavorite: !tx.isFavorite } : tx))
    );
    setCompletedTx((prev) =>
      prev && prev.id === txId ? { ...prev, isFavorite: !prev.isFavorite } : prev
    );
  };

  const handleSuccessDone = () => {
    setCompletedTx(null);
    setDraft(INITIAL_TRANSFER_DRAFT);
    setScreen('home');
  };

  const handleRepeatTransfer = (tx: TransactionRecord) => {
    setCompletedTx(null);
    setShowPinDialog(false);
    setDraft({
      ...INITIAL_TRANSFER_DRAFT,
      method: tx.method,
      phone: tx.method === 'phone' ? tx.recipientDisplay : '',
      username: tx.method === 'username' ? tx.recipientDisplay : '',
      bankAccount: tx.method === 'bank' ? tx.recipientDisplay : '',
      bankName: tx.recipientSubtext || INITIAL_TRANSFER_DRAFT.bankName,
      facebookAccount: tx.method === 'facebook' ? tx.recipientDisplay : '',
      amount: tx.amount.replace(/\s+/g, ''),
      note: tx.note ?? '',
    });
    pushHistoryMarker('send');
    setScreen('send');
  };

  const handleOpenSavedReceipt = (tx: TransactionRecord) => {
    setShowPinDialog(false);
    setDraft({
      ...INITIAL_TRANSFER_DRAFT,
      method: tx.method,
      phone: tx.method === 'phone' ? tx.recipientDisplay : '',
      username: tx.method === 'username' ? tx.recipientDisplay : '',
      bankAccount: tx.method === 'bank' ? tx.recipientDisplay : '',
      bankName: tx.recipientSubtext || INITIAL_TRANSFER_DRAFT.bankName,
      facebookAccount: tx.method === 'facebook' ? tx.recipientDisplay : '',
      amount: tx.amount.replace(/\s+/g, ''),
      note: tx.note ?? '',
    });
    pushHistoryMarker('confirm');
    setScreen('confirm');
    setCompletedTx(tx);
  };

  return (
    <>
      <div
      dir="rtl"
      style={
        lockedMobileHeight
          ? ({ '--mobile-app-height': `${lockedMobileHeight}px` } as React.CSSProperties)
          : undefined
      }
      className="w-screen h-[var(--mobile-app-height,100dvh)] min-h-0 overflow-hidden bg-[#FAFAFA]"
    >
      <div className="fixed bottom-2 left-2 z-[90] rounded-md bg-[#263238]/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-sm" aria-label="نموذج تجريبي">نموذج تجريبي</div>
      <div className="w-full h-full">
        {/* Mobile fills 100% locked full-screen viewport with Safe Areas; Desktop renders 360x754 frame */}
        <main className="relative w-full h-full overflow-hidden bg-[#FAFAFA] flex flex-col">
          {/* Top Safe-Area Fill matching all 5 screens' #00BCD5 header */}
          <div
            className="h-[env(safe-area-inset-top,0px)] bg-[#00BCD5] shrink-0 lg:hidden"
            aria-hidden="true"
          />

          <div className="relative flex-1 min-h-0 flex flex-col">
            {screen === 'home' && (
              <HomeScreen
                onNavigateToSend={handleNavigateToSend}
                onNavigateToRequest={() => {
                  setRequestDraft(INITIAL_REQUEST_DRAFT);
                  pushHistoryMarker('request');
                  setScreen('request');
                }}
                onNavigateToBoard={() => {
                  pushHistoryMarker('board');
                  setScreen('board');
                }}
                transactions={transactions}
                onOpenReceipt={handleOpenSavedReceipt}
              />
            )}

            {screen === 'send' && (
              <SendMoneyScreen
                draft={draft}
                onUpdateDraft={handleUpdateDraft}
                onBack={() => setScreen('home')}
                onProceedToReview={() => {
                  pushHistoryMarker('confirm');
                  setScreen('confirm');
                }}
              />
            )}

            {screen === 'request' && (
              <RequestMoneyScreen
                draft={requestDraft}
                onUpdateDraft={handleUpdateRequestDraft}
                onBack={() => setScreen('home')}
                onRequestCreated={(req) => setMoneyRequests((prev) => [req, ...prev])}
              />
            )}

            {screen === 'board' && (
              <BoardScreen
                splitGroups={splitGroups}
                onBack={() => setScreen('home')}
                onCreateSplitGroup={(grp) => setSplitGroups((prev) => [grp, ...prev])}
                onPrefillMemberTransfer={(phone, amount, note) =>
                  handleNavigateToSend({ phone, amount, note })
                }
              />
            )}

            {screen === 'confirm' && (
              <TransferConfirmationScreen
                draft={draft}
                onBack={() => setScreen('send')}
                onConfirmClick={() => {
                  pushHistoryMarker('pin');
                  setShowPinDialog(true);
                }}
              />
            )}

            {screen === 'confirm' && showPinDialog && (
              <PinVerificationDialog
                onClose={() => setShowPinDialog(false)}
                onSuccess={handlePinSuccess}
              />
            )}

            {screen === 'confirm' && completedTx && (
              <TransferSuccessDialog
                transaction={completedTx}
                onToggleFavorite={handleToggleFavorite}
                onDone={handleSuccessDone}
              />
            )}
          </div>

          {/* Bottom Safe-Area Clearance above Android Gesture Bar / iPhone Home Indicator */}
          <div
            className="h-[env(safe-area-inset-bottom,0px)] bg-[#FAFAFA] shrink-0 lg:hidden"
            aria-hidden="true"
          />
        </main>

        {/* Desktop Companion Panel (Hidden on mobile viewports) */}
        <div className="hidden">
          <DesktopCompanionPanel
            currentScreen={screen}
            showPinDialog={showPinDialog}
            completedTransaction={completedTx}
            transactions={transactions}
            splitGroups={splitGroups}
            moneyRequests={moneyRequests}
            onToggleFavorite={handleToggleFavorite}
            onRepeatTransfer={handleRepeatTransfer}
            onOpenReceipt={handleOpenSavedReceipt}
            onQuickNavigate={(target) => {
              setShowPinDialog(false);
              setCompletedTx(null);
              pushHistoryMarker(target);
              setScreen(target);
            }}
            pwaStatus={{
              isInstalled: effectiveInstalled,
              isStandalone,
              onOpenInstallModal: () => setForceShowInstallModal(true),
            }}
          />
        </div>
      </div>

      {/* First-Visit Branded PWA Install Prompt (Suppressed once installed/standalone) */}
      {showInstallModal && (
        <PWAInstallExperience
          isInstallable={isInstallable}
          isInIframe={isInIframe}
          isIOS={isIOS}
          isAndroid={isAndroid}
          onInstall={async () => {
            const outcome = await install();
            if (outcome === 'accepted') {
              setPersistedInstalled(true);
              setForceShowInstallModal(false);
              setInstallPromptDismissed(true);
              try {
                localStorage.setItem(STORAGE_KEY_PWA_INSTALLED, 'true');
              } catch {
                // Ignore storage quota errors
              }
            }
            return outcome;
          }}
          onDismiss={handleDismissInstallModal}
        />
      )}

      {/* Non-Intrusive Offline Status Indicator */}
      <OfflineIndicator />
    </div>
    </>
  );
}


export default function App() {
  const isComponentShowcase =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('components') === '1';

  return isComponentShowcase ? <ModalComponentsShowcase /> : <MainApp />;
}
