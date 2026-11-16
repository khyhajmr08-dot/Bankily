import React from 'react';
import { TransferDraft } from '../../types/transfer';
import {
  calculateTransferFees,
  formatMruDisplay,
  getRecipientDisplay,
} from '../../utils/transferHelpers';
import {
  BackArrowIcon,
  TabBankIcon,
  TabFacebookIcon,
  TabPhoneIcon,
  TabUsernameIcon,
} from '../Icons';

interface TransferConfirmationScreenProps {
  draft: TransferDraft;
  onBack: () => void;
  onConfirmClick: () => void;
}

export const TransferConfirmationScreen: React.FC<TransferConfirmationScreenProps> = ({
  draft,
  onBack,
  onConfirmClick,
}) => {
  const recipientValue = getRecipientDisplay(draft);
  const formattedAmount = formatMruDisplay(draft.amount);
  const fees = calculateTransferFees(draft.amount);

  const renderMethodIcon = () => {
    switch (draft.method) {
      case 'phone':
        return <TabPhoneIcon className="w-6 h-7 text-white" />;
      case 'username':
        return <TabUsernameIcon className="w-6 h-6 text-white" />;
      case 'bank':
        return <TabBankIcon className="w-6 h-6 text-white" />;
      case 'facebook':
        return <TabFacebookIcon className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-[#FAFAFA]">
      {/* Top Turquoise Header (53dp) */}
      <header className="bg-[#00BCD5] text-white shrink-0">
        <div className="relative h-[53px] flex items-center justify-center px-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="العودة لتعديل البيانات"
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <BackArrowIcon className="w-6 h-6" />
          </button>
          <h1 className="text-[19px] font-normal">تأكيد تحويل الأموال</h1>
        </div>
      </header>

      {/* Scrollable Review Body + Fixed Bottom Action Bar */}
      <div className="flex-1 min-h-0 flex flex-col bg-[#FAFAFA]">
        <div className="flex-1 min-h-0 overflow-y-auto px-[11.5px] pt-5 pb-6">
          <h2 className="text-[15.5px] text-[#171717] mb-3.5 px-1">مراجعة التفاصيل المدخلة</h2>

          {/* Recipient Row */}
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-[40px] h-[40px] rounded-full bg-[#596978] flex items-center justify-center shrink-0">
              {renderMethodIcon()}
            </div>
            <div className="min-w-0">
              <div
                dir={draft.method === 'facebook' ? 'auto' : 'ltr'}
                className="text-[17px] font-bold text-[#171717] tabular-nums truncate text-right"
              >
                {recipientValue}
              </div>
              {draft.method === 'bank' && (
                <div className="text-[12px] text-[#666666] mt-0.5">{draft.bankName}</div>
              )}
            </div>
          </div>

          {/* Light Gray Rounded Information Card (#F2F2F2, 11.5dp side margins, 4dp radius) */}
          <div className="bg-[#F2F2F2] rounded-[4px] px-4 py-4">
            <div className="text-[15px] text-[#222222]">المبلغ</div>
            <div
              dir="ltr"
              className="mt-2 pb-3.5 text-right text-[18px] font-bold text-[#171717] tabular-nums"
            >
              MRU {formattedAmount}
            </div>

            <div className="h-[1.5px] bg-white w-full my-1" />

            <div className="pt-3 text-[15px] text-[#222222] mb-4">تفاصيل تكلفة الخدمة</div>

            <div className="space-y-3.5 text-[15px] text-[#222222]">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <span className="text-right">تكلفة الخدمة</span>
                <span className="text-center px-3">-</span>
                <span dir="ltr" className="text-left tabular-nums">
                  MRU {fees.serviceFee}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <span className="text-right">العمولة</span>
                <span className="text-center px-3">-</span>
                <span dir="ltr" className="text-left tabular-nums">
                  MRU {fees.commission}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <span className="text-right">الضريبة</span>
                <span className="text-center px-3">-</span>
                <span dir="ltr" className="text-left tabular-nums">
                  MRU {fees.tax}
                </span>
              </div>
            </div>

            {draft.note.trim() && (
              <>
                <div className="h-[1.5px] bg-white w-full my-3.5" />
                <div className="flex items-start justify-between gap-3 text-[14px]">
                  <span className="text-[#555555] shrink-0">ملاحظة</span>
                  <span className="text-[#171717] text-left break-words">{draft.note.trim()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Fixed Bottom Yellow Button (53dp height, #FEC107, pinned to screen bottom) */}
        <div className="shrink-0 bg-[#FEC107]">
          <button
            type="button"
            onClick={onConfirmClick}
            className="w-full h-[53px] bg-[#FEC107] hover:bg-[#F2B700] active:bg-[#E5AD00] text-white text-[18px] font-normal flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#171717]"
          >
            أتمم
          </button>
        </div>
      </div>
    </div>
  );
};
