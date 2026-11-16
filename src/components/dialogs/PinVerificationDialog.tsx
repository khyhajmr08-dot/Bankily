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
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleViewport, setVisibleViewport] = useState<{ top: number; height: number } | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    // Keep the dialog centered in the actually visible area above Android's keyboard.
    // Capture the layout height before the keyboard opens because some browsers
    // also resize window.innerHeight while the visual viewport is changing.
    const layoutHeight = window.innerHeight;
    const updateVisibleViewport = () => {
      const keyboardOpen = layoutHeight - vv.height - vv.offsetTop > 120;
      setVisibleViewport(
        keyboardOpen
          ? { top: Math.max(0, Math.round(vv.offsetTop)), height: Math.round(vv.height) }
          : null
      );
    };

    updateVisibleViewport();
    vv.addEventListener('resize', updateVisibleViewport);
    vv.addEventListener('scroll', updateVisibleViewport);
    window.addEventListener('resize', updateVisibleViewport);
    return () => {
      vv.removeEventListener('resize', updateVisibleViewport);
      vv.removeEventListener('scroll', updateVisibleViewport);
      window.removeEventListener('resize', updateVisibleViewport);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSubmitting]);

  const handleDigitChange = (index: number, rawValue: string) => {
    if (isSubmitting) return;
    const onlyDigits = rawValue.replace(/\D/g, '');

    // Handle pasting full 4 digits
    if (onlyDigits.length > 1) {
      const next = ['', '', '', ''];
      for (let i = 0; i < 4; i++) {
        next[i] = onlyDigits[i] ?? '';
      }
      setDigits(next);
      setErrorMsg('');
      const focusIdx = Math.min(onlyDigits.length, 3);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = onlyDigits;
    setDigits(next);
    if (errorMsg) setErrorMsg('');

    if (onlyDigits && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isSubmitting) return;
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    const pin = digits.join('');

    if (pin.length < 4) {
      setErrorMsg('الرجاء إدخال الرمز السري المكون من 4 أرقام');
      const firstEmpty = digits.findIndex((d) => !d);
      inputRefs.current[firstEmpty >= 0 ? firstEmpty : 0]?.focus();
      return;
    }

    if (pin !== ACCESS_PIN) {
      setErrorMsg('الرمز السري غير صحيح');
      setDigits(['', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 30);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 900);
  };

  return (
    <div
      style={visibleViewport
        ? { top: `${visibleViewport.top}px`, height: `${visibleViewport.height}px` }
        : { top: 0, bottom: 0 }}
      className="absolute left-0 right-0 z-50 bg-black/60 flex items-center justify-center p-4 transition-[top,height] duration-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-dialog-title"
    >
      <div className="bg-white w-[177px] rounded-[4px] shadow-2xl overflow-hidden">
        {/* Top-Right Close X Icon */}
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

        {/* Title */}
        <h2
          id="pin-dialog-title"
          className="text-[13.5px] font-normal text-[#171717] text-center px-2 pt-1 pb-5 whitespace-nowrap"
        >
          الرجاء إدخال الرمز السري
        </h2>

        {/* 4 Separate Digit Positions (LTR numeric order, 24px width, 14px gap matching Bankily_42e2251e) */}
        <div dir="ltr" className="flex items-center justify-center gap-[14px] px-2 pb-5">
          {digits.map((digit, index) => (
            <div key={index} className="relative w-[24px] h-[28px] flex items-center justify-center">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={4}
                aria-label={`الرقم ${index + 1} من الرمز السري`}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(index, e)}
                className="w-full h-full text-center text-[19px] font-bold text-[#171717] bg-transparent border-b border-[#222222] focus:border-[#00BCD5] focus:border-b-[2px] outline-none caret-[#00BCD5] tabular-nums"
              />
            </div>
          ))}
        </div>

        {errorMsg && (
          <p role="alert" className="text-[11px] text-[#D32F2F] text-center px-2 pb-2.5 leading-snug">
            {errorMsg}
          </p>
        )}

        {/* Full-Width Bottom Turquoise Submit Button (54dp) */}
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
