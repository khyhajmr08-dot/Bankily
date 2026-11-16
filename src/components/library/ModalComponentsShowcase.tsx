import React, { useRef, useState } from 'react';

const styles = `
  .component-showcase {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 20px;
    background: #000;
    font-family: 'Cairo', sans-serif;
  }

  .component-showcase, .component-showcase * { box-sizing: border-box; }

  .component-otp-modal {
    position: relative;
    width: 100%;
    max-width: 320px;
    padding: 24px 20px;
    border-radius: 12px;
    background: #fff;
    text-align: center;
  }

  .component-close {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 30px;
    height: 30px;
    border: 0;
    background: transparent;
    color: #999;
    font: inherit;
    font-size: 20px;
    cursor: pointer;
  }

  .component-otp-title {
    margin: 10px 0 24px;
    color: #333;
    font-size: 16px;
    font-weight: 600;
  }

  .component-otp-slots {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
    cursor: text;
  }

  .component-otp-slot {
    width: 35px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #ccc;
  }

  .component-otp-slot.is-active { border-bottom-color: #00bcd4; }

  .component-otp-dot {
    width: 8px;
    height: 8px;
    margin-bottom: 5px;
    border-radius: 50%;
    background: #000;
  }

  .component-otp-input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  .component-primary-button, .component-status-button {
    width: 100%;
    min-height: 50px;
    padding: 14px;
    border: 0;
    background: #00bcd4;
    color: #fff;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  .component-primary-button:disabled {
    cursor: not-allowed;
    opacity: .55;
  }

  .component-demo-note {
    margin: -10px 0 18px;
    color: #795548;
    background: #fff8e1;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 600;
  }

  .component-status-modal {
    width: 100%;
    max-width: 360px;
    overflow: hidden;
    border-radius: 8px;
    background: #fff;
    text-align: center;
  }

  .component-status-content { padding: 30px 20px 20px; }

  .component-status-title {
    margin: 0 0 16px;
    color: #333;
    font-size: 18px;
    font-weight: 700;
  }

  .component-status-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    border: 3px solid #4caf50;
    border-radius: 50%;
    color: #4caf50;
    font-size: 30px;
    line-height: 1;
  }

  .component-status-details {
    margin-bottom: 20px;
    color: #333;
    font-size: 14px;
    line-height: 1.8;
  }

  @media (max-width: 380px) {
    .component-showcase { gap: 24px; padding: 16px; }
  }
`;

export function ModalComponentsShowcase() {
  const [pin, setPin] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const closePreview = () => {
    setShowPreview(false);
    setPin('');
    setMessage('');
  };

  const submitPreview = () => {
    if (pin.length !== 4) {
      setMessage('أدخل أربعة أرقام للمتابعة');
      inputRef.current?.focus();
      return;
    }
    setMessage('');
    setShowPreview(true);
  };

  return (
    <>
      <style>{styles}</style>
      <main className="component-showcase" dir="rtl">
        {!showPreview ? (
          <section className="component-otp-modal" aria-labelledby="component-otp-title" role="dialog" aria-modal="true">
            <button className="component-close" type="button" aria-label="إغلاق" onClick={closePreview}>×</button>
            <h2 id="component-otp-title" className="component-otp-title">الرجاء إدخال الرمز السري</h2>
            <div className="component-otp-slots" onClick={() => inputRef.current?.focus()}>
              <input
                ref={inputRef}
                className="component-otp-input"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={pin}
                aria-label="رمز تجريبي من أربعة أرقام"
                onChange={(event) => {
                  setPin(event.target.value.replace(/\\D/g, '').slice(0, 4));
                  setMessage('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submitPreview();
                }}
              />
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className={`component-otp-slot ${index === Math.min(pin.length, 3) ? 'is-active' : ''}`}>
                  {index < pin.length ? <span className="component-otp-dot" /> : null}
                </div>
              ))}
            </div>
            {message ? <p role="alert" style={{ color: '#D32F2F', fontSize: 12, margin: '-12px 0 12px' }}>{message}</p> : null}
            <button className="component-primary-button" type="button" onClick={submitPreview}>
              ارسل الطلب
            </button>
          </section>
        ) : (
          <section className="component-status-modal" aria-labelledby="component-status-title" role="dialog" aria-modal="true">
            <div className="component-status-content">
              <p className="component-demo-note">معاينة واجهة فقط — لم يتم تنفيذ أي معاملة</p>
              <h2 id="component-status-title" className="component-status-title">اكتملت معاينة التفاعل</h2>
              <div className="component-status-icon" aria-hidden="true">✓</div>
              <div className="component-status-details">
                تم إدخال الرمز التجريبي بنجاح.<br />
                هذه شاشة توضيحية لعرض تصميم النافذة فقط.
              </div>
            </div>
            <button className="component-status-button" type="button" onClick={closePreview}>تم</button>
          </section>
        )}
      </main>
    </>
  );
}
