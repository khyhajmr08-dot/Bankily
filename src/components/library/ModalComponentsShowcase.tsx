import React from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

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

  .component-showcase,
  .component-showcase * { box-sizing: border-box; }

  .component-otp-modal {
    position: relative;
    width: 100%;
    max-width: 320px;
    padding: 24px 20px;
    border-radius: 8px;
    background: #fff;
    text-align: center;
  }

  .component-close {
    position: absolute;
    top: 12px;
    left: 12px;
    border: 0;
    padding: 0;
    background: transparent;
    color: #999;
    font: inherit;
    font-size: 22px;
    line-height: 1;
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

  .component-primary-button {
    width: 100%;
    min-height: 48px;
    padding: 12px;
    border: 0;
    border-radius: 4px;
    background: #00bcd4;
    color: #fff;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    cursor: default;
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
    margin: 0 0 24px;
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
    margin: 0 auto 16px;
    border: 3px solid #4caf50;
    border-radius: 50%;
    color: #4caf50;
    font-size: 30px;
    line-height: 1;
  }

  .component-status-details {
    margin-bottom: 20px;
    color: #333;
    font-size: 13px;
    line-height: 1.8;
    text-align: center;
  }

  .component-status-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-bottom: 20px;
    color: #757575;
    font-size: 13px;
  }

  .component-status-button {
    width: 100%;
    min-height: 52px;
    padding: 14px;
    border: 0;
    background: #00bcd4;
    color: #fff;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    cursor: default;
  }

  @media (max-width: 380px) {
    .component-showcase { gap: 24px; padding: 16px; }
  }
`;

export function ModalComponentsShowcase() {
  return (
    <>
      <style>{styles}</style>
      <main className="component-showcase" dir="rtl">
        <section className="component-otp-modal" aria-labelledby="component-otp-title">
          <button className="component-close" type="button" aria-label="إغلاق" tabIndex={-1}>
            ×
          </button>
          <h2 id="component-otp-title" className="component-otp-title">
            الرجاء إدخال الرمز السري
          </h2>
          <div className="component-otp-slots" aria-hidden="true">
            <div className="component-otp-slot"><span className="component-otp-dot" /></div>
            <div className="component-otp-slot"><span className="component-otp-dot" /></div>
            <div className="component-otp-slot"><span className="component-otp-dot" /></div>
            <div className="component-otp-slot is-active" />
          </div>
          <button className="component-primary-button" type="button" tabIndex={-1}>
            متابعة
          </button>
        </section>

        <section className="component-status-modal" aria-labelledby="component-status-title">
          <div className="component-status-content">
            <h2 id="component-status-title" className="component-status-title">
              تم بنجاح
            </h2>
            <div className="component-status-icon" aria-hidden="true">✓</div>
            <div className="component-status-details">
              اكتملت العملية المطلوبة
            </div>
            <div className="component-status-meta">
              <span>معرّف العنصر: 123</span>
              <span>الحالة: مكتمل</span>
              <span>التاريخ والوقت: الآن</span>
            </div>
          </div>
          <button className="component-status-button" type="button" tabIndex={-1}>
            تم
          </button>
        </section>
      </main>
    </>
  );
}
