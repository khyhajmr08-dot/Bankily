import React, { useState } from 'react';
import {
  ACCOUNT_OWNER,
  DIRECTORY_CONTACTS,
  TransactionRecord,
} from '../../types/transfer';
import {
  BackArrowIcon,
  CloseXIcon,
  QrTileIcon,
  RequestMoneyBillIcon,
  SendMoneyBillIcon,
} from '../Icons';

interface HomeScreenProps {
  onNavigateToSend: (prefill?: { phone?: string; amount?: string; note?: string }) => void;
  onNavigateToRequest: () => void;
  onNavigateToBoard: () => void;
  transactions: TransactionRecord[];
  onOpenReceipt: (tx: TransactionRecord) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToSend,
  onNavigateToRequest,
  onNavigateToBoard,
  transactions,
  onOpenReceipt,
}) => {
  const [activeModal, setActiveModal] = useState<'none' | 'qr' | 'history'>('none');
  const [qrTab, setQrTab] = useState<'scan' | 'myqr'>('scan');

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-[#FAFAFA] select-none overflow-y-auto">
      {/* Top Turquoise Header Section (205dp total height matching Bankily_f84d917f) */}
      <header className="bg-[#00BCD4] text-white shrink-0">
        {/* Title & Right Navigation Arrow (85dp) */}
        <div className="relative h-[85px] flex items-center justify-center px-3">
          <button
            type="button"
            onClick={() => setActiveModal('history')}
            aria-label="سجل المعاملات"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <BackArrowIcon className="w-6 h-6" />
          </button>
          <h1 className="text-[19px] font-normal tracking-normal">تحويل الأموال</h1>
        </div>

        {/* Two Main Horizontal Action Buttons (89dp height, 0px sharp corners, 6.5dp outer padding, 12dp gap, 31dp bottom padding) */}
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {/* Right Button (first in RTL): Send Money (#008CA0) */}
          <button
            type="button"
            onClick={() => onNavigateToSend()}
            className="h-[100px] bg-[#00838F] hover:bg-[#007D8F] active:scale-[0.985] rounded-none flex flex-col items-center justify-center gap-2 text-white transition-all focus-visible:outline-2 focus-visible:outline-white"
          >
            <SendMoneyBillIcon className="w-[66px] h-[30px]" />
            <span className="text-[15px] font-normal leading-none">إرسال الأموال</span>
          </button>

          {/* Left Button (second in RTL): Request Money (#FEC107) -> navigates to RequestMoneyScreen */}
          <button
            type="button"
            onClick={onNavigateToRequest}
            className="h-[100px] bg-[#FFC107] hover:bg-[#F2B700] active:scale-[0.985] rounded-none flex flex-col items-center justify-center gap-2 text-white transition-all focus-visible:outline-2 focus-visible:outline-white"
          >
            <RequestMoneyBillIcon className="w-[66px] h-[30px]" />
            <span className="text-[15px] font-normal leading-none">طلب المال</span>
          </button>
        </div>
      </header>

      {/* Light Gray Band 1: Quick Transfer (70dp height) */}
      <div className="bg-[#F0F0F0] min-h-[48px] py-3 flex items-center justify-center shrink-0">
        <h2 className="text-[16px] font-bold text-[#171717]">التحويل السريع</h2>
      </div>

      {/* QR Section (140dp height) */}
      <div className="bg-white min-h-[160px] px-10 py-10 flex items-center justify-center shrink-0">
        <button
          type="button"
          onClick={() => setActiveModal('qr')}
          className="min-w-[100px] min-h-[80px] px-4 py-2 flex flex-col items-center justify-center gap-2.5 hover:bg-[#00BCD5]/5 active:scale-[0.97] transition-all focus-visible:outline-2 focus-visible:outline-[#00BCD5]"
        >
          <QrTileIcon className="w-[34px] h-[34px] text-[#00BCD5]" />
          <span className="text-[15px] text-[#171717] font-normal">رمز QR</span>
        </button>
      </div>

      {/* Light Gray Band 2: Board / Split Panel (70dp height) */}
      <div className="bg-[#EFEFEF] h-[70px] flex items-center justify-center shrink-0">
        <h2 className="text-[16px] font-normal text-[#171717]">اللوحة</h2>
      </div>

      {/* Bottom Section: Split Group Creation (opens BoardScreen) */}
      <div className="bg-white flex-1 px-6 pt-5 pb-8 flex flex-col items-center">
        <p className="text-[13.5px] text-[#171717] text-center leading-relaxed">
          أنشئ مجموعة جديدة أو حدد مجموعة حالية لتقسيم المبلغ
        </p>

        <button
          type="button"
          onClick={onNavigateToBoard}
          aria-label="أنشئ مجموعة جديدة"
          className="mt-7 w-[150px] h-[150px] border-2 border-dashed border-[#00BCD4] rounded-[8px] flex items-center justify-center text-[#00BCD5] hover:bg-[#00BCD5]/5 active:scale-[0.97] transition-all focus-visible:outline-2 focus-visible:outline-[#00BCD5]"
        >
          <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9" aria-hidden="true">
            <path
              d="M18 6V30M6 18H30"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* QR Quick Transfer Modal */}
      {activeModal === 'qr' && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <div className="bg-white w-full max-w-[330px] rounded-[4px] shadow-2xl overflow-hidden">
            <div className="bg-[#00BCD5] text-white px-4 py-3 flex items-center justify-between">
              <h3 id="qr-modal-title" className="text-[16px] font-normal">
                التحويل السريع — رمز QR
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                aria-label="إغلاق"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/15"
              >
                <CloseXIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 border-b border-[#EEEEEE]">
              <button
                type="button"
                onClick={() => setQrTab('scan')}
                className={`h-[44px] text-[14px] font-medium border-b-2 transition-colors ${
                  qrTab === 'scan'
                    ? 'border-[#00BCD5] text-[#008CA0]'
                    : 'border-transparent text-[#777777]'
                }`}
              >
                مسح رمز QR
              </button>
              <button
                type="button"
                onClick={() => setQrTab('myqr')}
                className={`h-[44px] text-[14px] font-medium border-b-2 transition-colors ${
                  qrTab === 'myqr'
                    ? 'border-[#00BCD5] text-[#008CA0]'
                    : 'border-transparent text-[#777777]'
                }`}
              >
                رمزي الشخصي
              </button>
            </div>

            {qrTab === 'scan' ? (
              <div className="p-4 space-y-2.5">
                {DIRECTORY_CONTACTS.slice(0, 3).map((contact, idx) => {
                  const presetAmount = idx === 0 ? '18' : idx === 1 ? '50' : '125';
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => {
                        setActiveModal('none');
                        onNavigateToSend({
                          phone: contact.phone,
                          amount: presetAmount,
                          note: 'تحويل عبر رمز QR',
                        });
                      }}
                      className="w-full p-3 bg-[#F4F4F4] hover:bg-[#EAF8FA] rounded-[4px] flex items-center justify-between text-right transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <QrTileIcon className="w-7 h-7 text-[#00BCD5] shrink-0" />
                        <div>
                          <div className="text-[14px] font-medium text-[#171717]">{contact.name}</div>
                          <div className="text-[12px] text-[#777777] tabular-nums" dir="ltr">
                            {contact.phone}
                          </div>
                        </div>
                      </div>
                      <span className="text-[13px] font-bold text-[#008CA0] tabular-nums" dir="ltr">
                        MRU {presetAmount}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="p-4 border-2 border-[#00BCD5] rounded-[4px] bg-white">
                  <QrTileIcon className="w-28 h-28 text-[#171717]" />
                </div>
                <p className="text-[14px] font-medium text-[#171717]">رمز الاستلام الخاص بي</p>
                <p className="text-[13px] text-[#777777] tabular-nums" dir="ltr">
                  {ACCOUNT_OWNER.phone} · MRU
                </p>
              </div>
            )}

            <div className="p-3 border-t border-[#EEEEEE]">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-full h-[42px] bg-[#00BCD5] text-white text-[15px] font-normal rounded-[4px]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Modal triggered by Top-Right Arrow */}
      {activeModal === 'history' && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-modal-title"
        >
          <div className="bg-white w-full max-w-[330px] max-h-[80vh] flex flex-col rounded-[4px] shadow-2xl overflow-hidden">
            <div className="bg-[#00BCD5] text-white px-4 py-3 flex items-center justify-between">
              <h3 id="history-modal-title" className="text-[16px] font-normal">
                سجل المعاملات
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                aria-label="إغلاق"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/15"
              >
                <CloseXIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              {transactions.length === 0 ? (
                <p className="text-[14px] text-[#777777] text-center py-6">
                  لا توجد معاملات محفوظة بعد.
                </p>
              ) : (
                transactions.map((tx) => (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => {
                      setActiveModal('none');
                      onOpenReceipt(tx);
                    }}
                    className="w-full text-right p-3 bg-[#F4F4F4] hover:bg-[#EAF8FA] rounded-[4px] space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#171717]" dir="ltr">
                        {tx.recipientDisplay}
                      </span>
                      <span className="text-[14px] font-bold text-[#008CA0] tabular-nums" dir="ltr">
                        MRU {tx.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#666666] tabular-nums">
                      <span dir="ltr">{tx.timestamp}</span>
                      <span className="text-[#008CA0] font-medium">عرض الإيصال</span>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="p-3 border-t border-[#EEEEEE]">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-full h-[42px] bg-[#00BCD5] text-white text-[15px] font-normal rounded-[4px]"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
