import React from 'react';

const styles = `
  .component-showcase {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 32px;
    padding: 24px;
    background: #f3f5f7;
    font-family: Arial, sans-serif;
  }

  .component-showcase * { box-sizing: border-box; }

  .component-modal {
    width: min(100%, 340px);
    padding: 30px 24px 24px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 12px 36px rgba(0, 0, 0, .10);
    text-align: center;
  }

  .component-modal-title {
    margin: 0 0 28px;
    color: #333;
    font-size: 19px;
    font-weight: 600;
  }

  .component-code-illustration {
    display: flex;
    justify-content: center;
    gap: 17px;
    margin: 0 auto 30px;
  }

  .component-code-slot {
    width: 43px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #00bcd4;
  }

  .component-code-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #333;
  }

  .component-primary-button {
    width: 100%;
    min-height: 48px;
    border: 0;
    border-radius: 9px;
    background: #00bcd4;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: default;
  }

  .component-success-icon {
    width: 66px;
    height: 66px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #e8f5e9;
    color: #4caf50;
    font-size: 35px;
    font-weight: 700;
  }

  .component-success-title {
    margin: 0 0 24px;
    color: #333;
    font-size: 21px;
    font-weight: 700;
  }

  .component-details {
    margin-bottom: 26px;
    padding: 16px;
    border-radius: 10px;
    background: #f8f9fa;
    text-align: right;
  }

  .component-detail-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #e8e8e8;
    color: #757575;
    font-size: 14px;
  }

  .component-detail-row:last-child { border-bottom: 0; }
  .component-detail-value { color: #333; font-weight: 600; }

  @media (max-width: 420px) {
    .component-showcase { align-content: center; padding: 18px; gap: 20px; }
  }
`;

export function ModalComponentsShowcase() {
  return (
    <>
      <style>{styles}</style>
      <main className="component-showcase" dir="rtl">
        <section className="component-modal" aria-labelledby="component-pin-title">
          <h2 id="component-pin-title" className="component-modal-title">
            الرجاء إدخال الرمز السري
          </h2>
          <div className="component-code-illustration" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="component-code-slot" key={index}>
                <span className="component-code-dot" />
              </div>
            ))}
          </div>
          <button className="component-primary-button" type="button" tabIndex={-1}>
            متابعة
          </button>
        </section>

        <section className="component-modal" aria-labelledby="component-success-title">
          <div className="component-success-icon" aria-hidden="true">✓</div>
          <h2 id="component-success-title" className="component-success-title">
            تم بنجاح
          </h2>
          <div className="component-details">
            <div className="component-detail-row">
              <span>معرّف العنصر</span>
              <span className="component-detail-value">123</span>
            </div>
            <div className="component-detail-row">
              <span>الوصف</span>
              <span className="component-detail-value">عنصر محفوظ</span>
            </div>
            <div className="component-detail-row">
              <span>التاريخ</span>
              <span className="component-detail-value">الآن</span>
            </div>
          </div>
          <button className="component-primary-button" type="button" tabIndex={-1}>
            تم
          </button>
        </section>
      </main>
    </>
  );
}
