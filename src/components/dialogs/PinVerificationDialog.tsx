import React, { useEffect, useRef, useState } from 'react';
import { ACCESS_PIN } from '../../types/transfer';
import { CloseXIcon } from '../Icons';

interface PinVerificationDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PinVerificationDialog: React.FC<PinVerificationDialogProps> = ({
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleViewport, setVisibleViewport] = useState({ top: 0, height: 0 });
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Match Android's resize-on-keyboard behavior: the dialog is centered in the
  // visible viewport, not the original full-height page behind the keyboard.
  useEffect(() => {
    const vv = window.visualViewport;
    const update = () => {
      setVisibleViewport({
        top: vv?.offsetTop ?? 0,
        height: vv?.height ?? window.innerHeight,
      });
    };
    update();
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSubmitting]);

  const handleChange = (raw: string) => {
    if (isSubmitting) return;
    setPin(raw.replace(/\\D/g, '').slice(0, 4));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (pin.length !== 4) {
      setErrorMsg('الرجاء إدخال الرمز السري');
      inputRef.current?.focus();
      return;
    }
    if (pin !== ACCESS_PIN) {
      setErrorMsg('الرمز السري غير صحيح');
      setPin('');
      inputRef.current?.focus();
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    window.setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 900);
  };

  const activeSlot = Math.min(pin.length, 3);
  const viewportHeight = visibleViewport.height || window.innerHeight;

  return (
    <div
      style={{
        top: visibleViewport.top,
        height: viewportHeight,
      }}
      className="absolute inset-x-0 z-50 bg-black/60 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-dialog-title"
    >
      <div
        className="relative bg-white w-[177px] rounded-[4px] shadow-2xl overflow-hidden"
        style={{ transform: 'translateY(-11%)' }}
      >
        <div className="flex justify-start px-0.5 pt-0.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="إغلاق نافذة الرمز السري"
            className="w-7 h-7 flex items-center justify-center text-[#9A9A9A] hover:text-[#333333] rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-[#00BCD5]"
          >
            <CloseXIcon className="w-4 h-4" />
          </button>
        </div>

        <h2
          id="pin-dialog-title"
          className="text-[13.5px] font-normal text-[#171717] text-center px-2 pt-1 pb-5 whitespace-nowrap"
        >
          الرجاء إدخال الرمز السري
        </h2>

        {/* One hidden numeric field mirrors the original Android dialog.
            The four visible slots are presentation only, so focus never jumps
            between separate inputs while the phone keyboard is open. */}
        <div
          dir="ltr"
          className="relative flex items-center justify-center gap-[14px] px-2 pb-5"
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            enterKeyHint="done"
            maxLength={4}
            value={pin}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            aria-label="الرمز السري المكون من أربعة أرقام"
            className="absolute left-1/2 top-1/2 h-px w-px -translate-x-1/2 -translate-y-1/2 opacity-0"
          />
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="relative w-[24px] h-[28px] flex items-center justify-center">
              <span className="absolute -top-0.5 text-[24px] leading-none font-bold text-[#171717]">
                {index < pin.length ? '•' : ''}
              </span>
              <span
                className={`absolute bottom-0 w-full ${index === activeSlot ? 'h-[2px] bg-[#00BCD5]' : 'h-px bg-[#222222]'}`}
              />
            </div>
          ))}
        </div>

        {errorMsg && (
          <p role="alert" className="text-[11px] text-[#D32F2F] text-center px-2 pb-2.5 leading-snug">
            {errorMsg}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-[54px] bg-[#00BCD5] hover:bg-[#00AAC2] active:bg-[#0099AF] disabled:opacity-70 text-white text-[15px] font-normal flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#171717]"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2" role="status" aria-live="polite">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.28" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              جاري التحقق...
            </span>
          ) : 'ارسل الطلب'}
        </button>
      </div>

      {isSubmitting && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/35 p-4" role="status" aria-live="polite">
          <div className="w-[210px] rounded-[4px] bg-white px-5 py-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-[4px] border-[#D9F4F7] border-t-[#00BCD5]" aria-hidden="true" />
            <p className="text-[15px] text-[#171717]">جارٍ التحقق من الرمز السري</p>
            <p className="mt-1 text-[12px] text-[#777777]">يرجى الانتظار</p>
          </div>
        </div>
      )}
    </div>
  );
};
