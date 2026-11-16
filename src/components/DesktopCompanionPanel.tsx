import React, { useState } from 'react';
import {
  ACCESS_PIN,
  AppScreen,
  MoneyRequestRecord,
  SplitGroup,
  TransactionRecord,
} from '../types/transfer';
import { getMethodLabel } from '../utils/transferHelpers';
import { StarIcon } from './Icons';

interface DesktopCompanionPanelProps {
  currentScreen: AppScreen;
  showPinDialog: boolean;
  completedTransaction: TransactionRecord | null;
  transactions: TransactionRecord[];
  splitGroups: SplitGroup[];
  moneyRequests: MoneyRequestRecord[];
  onToggleFavorite: (id: string) => void;
  onRepeatTransfer: (tx: TransactionRecord) => void;
  onOpenReceipt: (tx: TransactionRecord) => void;
  onQuickNavigate: (screen: AppScreen) => void;
  pwaStatus?: {
    isInstalled: boolean;
    isStandalone: boolean;
    onOpenInstallModal: () => void;
  };
}

const KOTLIN_FILES = [
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/MainActivity.kt',
    role: 'نقطة الدخول وتوجيه Navigation Compose',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/viewmodel/TransferViewModel.kt',
    role: 'إدارة الحالة والتحقق وتوليد المعرفات',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/model/TransferModels.kt',
    role: 'نماذج البيانات والسجل المحلي',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/screens/HomeScreen.kt',
    role: 'الشاشة الرئيسية — تحويل الأموال واللوحة',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/screens/SendMoneyScreen.kt',
    role: 'شاشة إرسال الأموال والتبويبات الأربعة',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/screens/RequestMoneyScreen.kt',
    role: 'شاشة طلب المال والتبويبات الثلاثة',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/screens/BoardScreen.kt',
    role: 'شاشة اللوحة وتقسيم المبلغ على الأفراد',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/screens/TransferConfirmationScreen.kt',
    role: 'شاشة مراجعة وتأكيد التفاصيل',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/dialogs/PinVerificationDialog.kt',
    role: 'نافذة إدخال الرمز السري من 4 أرقام',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/dialogs/TransferSuccessDialog.kt',
    role: 'نافذة نجاح النقل وإضافة المفضلة',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/theme/Color.kt',
    role: 'نظام الألوان والهوية البصرية',
  },
  {
    path: 'android/app/src/main/java/com/mauritop/transfer/ui/theme/Theme.kt',
    role: 'تخطيط RTL والأبعاد الموحدة',
  },
];

export const DesktopCompanionPanel: React.FC<DesktopCompanionPanelProps> = ({
  currentScreen,
  showPinDialog,
  completedTransaction,
  transactions,
  splitGroups,
  moneyRequests,
  onToggleFavorite,
  onRepeatTransfer,
  onOpenReceipt,
  onQuickNavigate,
  pwaStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'kotlin'>('ledger');

  const currentStageLabel = completedTransaction
    ? 'نافذة نتيجة النجاح'
    : showPinDialog
    ? 'نافذة إدخال الرمز السري'
    : currentScreen === 'confirm'
    ? 'تأكيد تحويل الأموال'
    : currentScreen === 'send'
    ? 'إرسال الأموال'
    : currentScreen === 'request'
    ? 'طلب المال'
    : currentScreen === 'board'
    ? 'اللوحة'
    : 'تحويل الأموال';

  const favoriteTransactions = transactions.filter((t) => t.isFavorite);

  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
      {/* Header Summary */}
      <div className="space-y-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[20px] font-semibold text-[#171717]">
            تحويل الأموال والسجل المحلي
          </h2>
          <button
            type="button"
            onClick={() => onQuickNavigate('home')}
            className="text-[13px] font-medium text-[#008CA0] hover:text-[#006972] whitespace-nowrap shrink-0"
          >
            العودة للبداية
          </button>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#666666]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>الشاشة الحالية: <strong className="text-[#171717] font-medium">{currentStageLabel}</strong></span>
            <span aria-hidden="true">·</span>
            <span>
              الرمز السري: <strong dir="ltr" className="text-[#171717] font-code">{ACCESS_PIN}</strong>
            </span>
          </div>
          {pwaStatus && !pwaStatus.isInstalled && !pwaStatus.isStandalone && (
            <button
              type="button"
              onClick={pwaStatus.onOpenInstallModal}
              className="px-3 py-1.5 bg-[#00BCD5] hover:bg-[#00AAC2] text-white text-[12.5px] font-medium rounded-[4px] transition-colors shrink-0"
            >
              تثبيت التطبيق
            </button>
          )}
        </div>
      </div>

      {/* Segmented Switcher */}
      <div className="flex items-center gap-1 p-1 bg-[#F2F2F2] rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 py-2 px-3 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-white text-[#171717] shadow-xs'
              : 'text-[#666666] hover:text-[#171717]'
          }`}
        >
          سجل المعاملات والمفضلة ({transactions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kotlin')}
          className={`flex-1 py-2 px-3 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'kotlin'
              ? 'bg-white text-[#171717] shadow-xs'
              : 'text-[#666666] hover:text-[#171717]'
          }`}
        >
          ملفات Kotlin Compose ({KOTLIN_FILES.length})
        </button>
      </div>

      {activeTab === 'ledger' ? (
        <div className="space-y-6">
          {/* Completed Transactions */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-semibold text-[#171717]">
              التحويلات المنفذة
            </h3>
            {transactions.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-200 rounded-lg text-[13px] text-[#777777]">
                أجرِ عملية تحويل من شاشة الهاتف لتظهر تفاصيلها هنا فوراً.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-3.5 bg-white space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(tx.id)}
                          aria-label={tx.isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                          className="p-1 rounded hover:bg-slate-100 shrink-0"
                        >
                          <StarIcon
                            filled={tx.isFavorite}
                            className={`w-5 h-5 ${
                              tx.isFavorite ? 'text-[#FEC107]' : 'text-[#CCCCCC]'
                            }`}
                          />
                        </button>
                        <span dir="ltr" className="text-[14px] font-semibold text-[#171717] tabular-nums truncate">
                          {tx.recipientDisplay}
                        </span>
                      </div>
                      <span dir="ltr" className="text-[14px] font-bold text-[#008CA0] tabular-nums shrink-0">
                        MRU {tx.amount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[12px] text-[#666666]">
                      <div className="flex items-center gap-2 truncate">
                        <span>{getMethodLabel(tx.method)}</span>
                        <span aria-hidden="true">·</span>
                        <span dir="ltr" className="tabular-nums">{tx.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => onOpenReceipt(tx)}
                          className="text-[#171717] hover:underline font-medium"
                        >
                          الإيصال
                        </button>
                        <button
                          type="button"
                          onClick={() => onRepeatTransfer(tx)}
                          className="text-[#008CA0] hover:underline font-medium"
                        >
                          تكرار
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#888888] font-code tabular-nums" dir="ltr">
                      {tx.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorites Summary */}
          {favoriteTransactions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[14px] font-semibold text-[#171717]">
                المستفيدون المفضلون ({favoriteTransactions.length})
              </h3>
              <div className="space-y-1.5">
                {favoriteTransactions.map((fav) => (
                  <div
                    key={`fav-${fav.id}`}
                    className="flex items-center justify-between py-2 px-3 bg-[#FAFAFA] border border-slate-200 rounded-md text-[13px]"
                  >
                    <span dir="ltr" className="font-medium text-[#171717] tabular-nums">
                      {fav.recipientDisplay}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRepeatTransfer(fav)}
                      className="text-[#008CA0] font-medium hover:underline"
                    >
                      تحويل جديد
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Split Groups & Money Requests */}
          {(splitGroups.length > 0 || moneyRequests.length > 0) && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-[13px]">
              <div>
                <span className="text-[#777777]">المجموعات المحفوظة: </span>
                <strong className="text-[#171717] tabular-nums">{splitGroups.length}</strong>
              </div>
              <div>
                <span className="text-[#777777]">طلبات المال: </span>
                <strong className="text-[#171717] tabular-nums">{moneyRequests.length}</strong>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3.5 bg-[#F7FDFE] border border-[#BFEBF1] rounded-lg space-y-2.5">
            <div className="text-[13px] font-semibold text-[#171717]">
              حزمة مشروع Android الأصلي (بدون Google Play)
            </div>
            <p className="text-[12px] text-[#555555] leading-relaxed">
              تتضمن الحزمة مشروع Kotlin + Jetpack Compose الكامل وملف Gradle وملف GitHub Actions لبناء
              ملف APK مباشر مجاناً.
            </p>
            <a
              href="/downloads/bankily-android-project.zip"
              download="bankily-android-project.zip"
              className="inline-flex items-center justify-center px-4 h-[38px] bg-[#00BCD5] hover:bg-[#00AAC2] text-white text-[13px] font-medium rounded-[4px] transition-colors"
            >
              تنزيل مشروع Android الكامل (ZIP)
            </a>
          </div>
          <p className="text-[13px] text-[#555555]">
            ملفات مشروع Android الأصلي بلغة Kotlin و Jetpack Compose:
          </p>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {KOTLIN_FILES.map((file) => (
              <div key={file.path} className="px-3.5 py-2.5 bg-white space-y-0.5">
                <div className="text-[12px] font-medium text-[#171717]">{file.role}</div>
                <div dir="ltr" className="text-[11px] font-code text-[#008CA0] truncate text-left">
                  {file.path}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
