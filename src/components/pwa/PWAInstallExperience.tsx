import React, { useState } from 'react';
import { InstallOutcome } from '../../hooks/usePWAInstall';
import { CloseXIcon } from '../Icons';

interface PWAInstallExperienceProps {
  isInstallable: boolean;
  isInIframe: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  onInstall: () => Promise<InstallOutcome>;
  onDismiss: () => void;
}

export const PWAInstallExperience: React.FC<PWAInstallExperienceProps> = ({
  isInstallable,
  isInIframe,
  isIOS,
  isAndroid,
  onInstall,
  onDismiss,
}) => {
  const [showManualSteps, setShowManualSteps] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [dismissNotice, setDismissNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const directAppUrl = typeof window !== 'undefined' ? window.location.href : '/';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(directAppUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(false);
    }
  };

  const handlePrimaryClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      setDismissNotice(false);
      const outcome = await onInstall();
      setInstalling(false);
      if (outcome === 'dismissed') {
        setDismissNotice(true);
      } else if (outcome === 'manual-required') {
        setShowManualSteps(true);
      }
      return;
    }
    setShowManualSteps(true);
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[70] bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      <div className="bg-[#FAFAFA] w-full max-w-[390px] rounded-t-[10px] sm:rounded-[6px] shadow-2xl overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
        {/* Top Brand Bar matching App Header */}
        <div className="bg-[#00BCD5] text-white px-4 h-[48px] flex items-center justify-between">
          <span className="text-[16px] font-normal">تثبيت التطبيق على الهاتف</span>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="إغلاق نافذة التثبيت"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
          >
            <CloseXIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Cover Image (Attached Bankily Official Cover) */}
        <div className="w-full bg-[#F8F8F8] border-b border-[#EAEAEA] overflow-hidden">
          <img
            src="/assets/aistudio/IMG-20261116-WA0009_5d4a8b97.jpg"
            alt="صورة توضيحية لمحاكاة تحويل الأموال"
            className="w-full h-[148px] object-cover object-center block"
          />
        </div>

        {/* App Identity & Description */}
        <div className="px-5 pt-4 pb-5 space-y-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/pwa-192x192.png"
              alt="أيقونة محاكاة بنكيلي"
              className="w-[58px] h-[58px] rounded-[12px] bg-white border border-[#E5E5E5] shadow-sm object-contain shrink-0"
            />
            <div className="min-w-0">
              <h2 id="pwa-install-title" className="text-[18px] font-semibold text-[#171717]">محاكاة بنكيلي</h2>
              <p className="text-[12.5px] text-[#008CA0] font-medium">
                تجربة تجريبية غير رسمية
              </p>
            </div>
          </div>

          <p className="text-[13.5px] text-[#555555] leading-relaxed">
            ثبّت تطبيق بنكيلي على الشاشة الرئيسية ليفتح كبرنامج مستقل بملء الشاشة بدون شريط
            المتصفح مع حفظ سجل عملياتك محلياً.
          </p>

          {dismissNotice && (
            <p className="text-[12.5px] text-[#008CA0] bg-[#E8F8FA] px-3 py-2 rounded-[4px]">
              لم يكتمل التثبيت. يمكنك الضغط على «تثبيت التطبيق» مجدداً لإعادة إظهار نافذة النظام.
            </p>
          )}

          {/* Embedded iframe notice: direct link to break out into standalone Chrome tab */}
          {isInIframe && !isInstallable && (
            <div className="bg-[#EFEFEF] border border-[#E2E2E2] rounded-[4px] p-3.5 space-y-2.5 text-[12.5px] text-[#171717]">
              <p className="text-[#333333] leading-relaxed">
                أنت تفتح التطبيق الآن داخل إطار المعاينة؛ لكي يظهر زر التثبيت الأصلي وتختفي واجهة
                المتصفح بعد التثبيت، افتح رابط التطبيق مباشرة في Chrome أو انسخه:
              </p>
              <a
                href={directAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-[46px] bg-[#00BCD5] hover:bg-[#00AAC2] text-white text-[15px] font-normal flex items-center justify-center rounded-[2px] transition-colors"
              >
                فتح التطبيق في Chrome للتثبيت المباشر
              </a>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="w-full h-[40px] bg-white hover:bg-[#F7FDFE] border border-[#D8D8D8] text-[#171717] text-[13.5px] font-normal flex items-center justify-center rounded-[2px] transition-colors"
              >
                {copiedLink ? 'تم نسخ رابط التطبيق' : 'نسخ رابط التطبيق'}
              </button>
            </div>
          )}

          {/* Platform-Accurate Manual Guide when beforeinstallprompt isn't available outside iframe */}
          {!isInIframe && showManualSteps && (
            <div className="bg-[#EFEFEF] border border-[#E2E2E2] rounded-[4px] p-3.5 space-y-2 text-[12.5px] text-[#171717]">
              {isIOS ? (
                <>
                  <div className="font-semibold text-[#008CA0]">خطوات التثبيت على iPhone / Safari:</div>
                  <ol className="list-decimal list-inside space-y-1 text-[#333333]">
                    <li>اضغط على زر المشاركة (Share) في شريط Safari السفلي.</li>
                    <li>مرّر للأسفل واختر «إضافة إلى الشاشة الرئيسية».</li>
                    <li>اضغط «إضافة» ليظهر التطبيق كأيقونة مستقلة بملء الشاشة.</li>
                  </ol>
                </>
              ) : (
                <>
                  <div className="font-semibold text-[#008CA0]">
                    {isAndroid ? 'التثبيت من قائمة Chrome على Android:' : 'التثبيت من قائمة المتصفح:'}
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[#333333]">
                    <li>افتح قائمة المتصفح (⋮) في الزاوية العلوية.</li>
                    <li>اختر «تثبيت التطبيق» أو «الإضافة إلى الشاشة الرئيسية».</li>
                    <li>أكّد التثبيت ثم افتح التطبيق من أيقونته على الشاشة الرئيسية.</li>
                  </ol>
                </>
              )}
            </div>
          )}

          {/* Primary Install Action + Dismiss Option */}
          <div className="space-y-2 pt-1">
            {isInstallable || (!isInIframe && !showManualSteps) ? (
              <button
                type="button"
                onClick={handlePrimaryClick}
                disabled={installing}
                className="w-full h-[48px] bg-[#00BCD5] hover:bg-[#00AAC2] active:bg-[#0099AF] disabled:opacity-70 text-white text-[16px] font-normal flex items-center justify-center transition-colors"
              >
                {installing
                  ? 'جاري تأكيد التثبيت...'
                  : isIOS && !isInstallable
                  ? 'طريقة التثبيت على iPhone'
                  : 'تثبيت التطبيق'}
              </button>
            ) : !isInIframe ? (
              <button
                type="button"
                onClick={onDismiss}
                className="w-full h-[48px] bg-[#00BCD5] hover:bg-[#00AAC2] text-white text-[16px] font-normal flex items-center justify-center transition-colors"
              >
                متابعة للتطبيق
              </button>
            ) : null}

            <a
              href="/downloads/bankily-android-project.zip"
              download="bankily-android-project.zip"
              className="w-full h-[40px] bg-white hover:bg-[#F7FDFE] border border-[#E0E0E0] text-[#008CA0] text-[13.5px] font-medium flex items-center justify-center transition-colors"
            >
              تنزيل ملفات مشروع Android التجريبي
            </a>

            <button
              type="button"
              onClick={onDismiss}
              className="w-full h-[42px] bg-[#EFEFEF] hover:bg-[#E5E5E5] text-[#555555] text-[14.5px] font-normal flex items-center justify-center transition-colors"
            >
              ليس الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
