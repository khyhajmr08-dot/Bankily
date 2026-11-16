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
  const [keyboardInset, setKeyboardInset] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const updateInset = () => {
      const covered = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      setKeyboardInset(covered > 80 ? covered : 0);
    };

    updateInset();
    vv.addEventListener('resize', updateInset);
    vv.addEventListener('scroll', updateInset);
    return () => {
      vv.removeEventListener('resize', updateInset);
      vv.removeEventListener('scroll', updateInset);
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
      style={keyboardInset > 0 ? { paddingBottom: `${keyboardInset + 16}px` } : undefined}
      className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4 transition-[padding] duration-150"
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
          ارسل الطلب
        </button>
      </div>
    </div>
  );
};
