import React from 'react';
import { TransactionRecord } from '../../types/transfer';
import { StarIcon, SuccessCheckCircleIcon } from '../Icons';

interface TransferSuccessDialogProps {
  transaction: TransactionRecord;
  onToggleFavorite: (id: string) => void;
  onDone: () => void;
}

export const TransferSuccessDialog: React.FC<TransferSuccessDialogProps> = ({
  transaction,
  onToggleFavorite,
  onDone,
}) => {
  return (
    <div
      className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center px-[27px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-dialog-title"
    >
      <div className="bg-white w-full max-w-[306px] rounded-[4px] shadow-2xl overflow-hidden">
        <div className="px-2.5 pt-5 pb-4 flex flex-col items-center text-center">
          {/* Top Title */}
          <h2 id="success-dialog-title" className="text-[17px] font-normal text-[#171717] mb-4">
            النقل ناجح!
          </h2>

          {/* Large Green Checkmark Circle */}
          <div className="mb-5">
            <SuccessCheckCircleIcon className="w-[60px] h-[60px]" />
          </div>

          {/* Transfer Summary Details matching Gallery_9ab03982 single-line layout */}
          <div className="w-full text-[12.5px] font-normal text-[#222222] leading-[1.6]">
            <p className="mb-4 whitespace-nowrap">
              <span>المستفيد: </span>
              <span dir="ltr" className="tabular-nums">
                {transaction.recipientDisplay}
              </span>
              <span> المبلغ المرسل: </span>
              <span dir="ltr" className="tabular-nums">
                {transaction.currency} {transaction.amount}
              </span>
            </p>

            <p className="text-[12.5px] whitespace-nowrap">
              <span>معرف المعاملة : </span>
              <span dir="ltr" className="tabular-nums">
                {transaction.id}
              </span>
            </p>

            <p className="mt-0.5 text-[13px] whitespace-nowrap">
              <span>التاريخ والوقت : </span>
              <span dir="ltr" className="tabular-nums">
                {transaction.timestamp}
              </span>
            </p>
          </div>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => onToggleFavorite(transaction.id)}
            aria-pressed={transaction.isFavorite}
            className="mt-5 mb-1 min-h-[44px] px-4 inline-flex items-center justify-center gap-3 rounded-md hover:bg-[#F7F7F7] active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#00BCD5]"
          >
            <span
              className={`text-[14.5px] transition-colors ${
                transaction.isFavorite ? 'text-[#171717] font-medium' : 'text-[#555555]'
              }`}
            >
              إضافة إلى المفضلة
            </span>
            <StarIcon
              filled={transaction.isFavorite}
              className={`w-7 h-7 transition-all ${
                transaction.isFavorite ? 'text-[#FEC107] scale-110' : 'text-[#9E9E9E]'
              }`}
            />
          </button>
        </div>

        {/* Full-Width Bottom Turquoise Done Button (50dp) */}
        <button
          type="button"
          onClick={onDone}
          className="w-full h-[50px] bg-[#00BCD5] hover:bg-[#00AAC2] active:bg-[#0099AF] text-white text-[16px] font-normal flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#171717]"
        >
          تم
        </button>
      </div>
    </div>
  );
};
