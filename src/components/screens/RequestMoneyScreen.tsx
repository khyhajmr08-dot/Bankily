import React, { useState } from 'react';
import {
  DIRECTORY_CONTACTS,
  MoneyRequestRecord,
  RequestDraft,
  RequestMethod,
} from '../../types/transfer';
import {
  formatMruDisplay,
  formatTransactionDateTime,
  generateTransactionId,
  getRequestRecipientDisplay,
  validateRequestDraft,
  ValidationErrors,
} from '../../utils/transferHelpers';
import {
  BackArrowIcon,
  CloseXIcon,
  ContactBookIcon,
  SuccessCheckCircleIcon,
  TabFacebookIcon,
  TabPhoneIcon,
  TabUsernameIcon,
} from '../Icons';

interface RequestMoneyScreenProps {
  draft: RequestDraft;
  onUpdateDraft: (patch: Partial<RequestDraft>) => void;
  onBack: () => void;
  onRequestCreated: (record: MoneyRequestRecord) => void;
}

const REQUEST_TABS: { id: RequestMethod; label: string }[] = [
  { id: 'phone', label: 'رقم الهاتف' },
  { id: 'username', label: 'اسم المستخدم' },
  { id: 'facebook', label: 'فيسبوك' },
];

export const RequestMoneyScreen: React.FC<RequestMoneyScreenProps> = ({
  draft,
  onUpdateDraft,
  onBack,
  onRequestCreated,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<MoneyRequestRecord | null>(null);

  const handleTabChange = (method: RequestMethod) => {
    onUpdateDraft({ method });
    setErrors({});
  };

  const handleSelectContact = (contact: (typeof DIRECTORY_CONTACTS)[number]) => {
    if (draft.method === 'phone') {
      onUpdateDraft({ phone: contact.phone });
    } else if (draft.method === 'username') {
      onUpdateDraft({ username: contact.username });
    } else {
      onUpdateDraft({ facebookAccount: contact.facebook });
    }
    setErrors((prev) => ({ ...prev, recipient: undefined }));
    setShowContactsModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateRequestDraft(draft);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const now = new Date();
    const record: MoneyRequestRecord = {
      id: generateTransactionId(now),
      method: draft.method,
      fromDisplay: getRequestRecipientDisplay(draft),
      amount: formatMruDisplay(draft.amount),
      note: draft.note.trim() || undefined,
      createdAt: formatTransactionDateTime(now),
    };
    onRequestCreated(record);
    setSubmittedRecord(record);
  };

  const renderTabIcon = (id: RequestMethod, isSelected: boolean) => {
    const colorClass = isSelected ? 'text-[#FEC107]' : 'text-white';
    switch (id) {
      case 'phone':
        return <TabPhoneIcon className={`w-7 h-8 ${colorClass}`} />;
      case 'username':
        return <TabUsernameIcon className={`w-8 h-8 ${colorClass}`} />;
      case 'facebook':
        return <TabFacebookIcon className={`w-8 h-8 ${colorClass}`} />;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-[#FAFAFA]">
      {/* Top Turquoise Header + 3 Horizontal Tabs (120dp total height matching Bankily_db2dec9a) */}
      <header className="bg-[#00BCD5] text-white shrink-0">
        <div className="relative h-[52px] flex items-center justify-center px-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="العودة"
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <BackArrowIcon className="w-6 h-6" />
          </button>
          <h1 className="text-[19px] font-normal">طلب المال</h1>
        </div>

        {/* 3 Tabs in exact RTL order: رقم الهاتف, اسم المستخدم, فيسبوك */}
        <nav aria-label="طريقة طلب المال" className="grid grid-cols-3 h-[68px]">
          {REQUEST_TABS.map((tab) => {
            const isSelected = draft.method === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                aria-selected={isSelected}
                role="tab"
                className={`h-full pt-1.5 pb-1.5 px-1 flex flex-col items-center justify-center gap-1 border-b-[3px] transition-colors focus-visible:outline-2 focus-visible:outline-white ${
                  isSelected
                    ? 'border-white text-white font-medium'
                    : 'border-transparent text-white/80 hover:bg-white/5'
                }`}
              >
                {renderTabIcon(tab.id, isSelected)}
                <span className="text-[11.5px] leading-tight whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Scrollable Body + Fixed Bottom Action Bar */}
      <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col bg-[#FAFAFA]">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-5 pb-8 space-y-6">
          <h2 className="text-[16px] text-[#171717] font-normal">أدخل تفاصيل الدافع</h2>

          {draft.method === 'phone' && (
            <div>
              <label htmlFor="req-phone" className="block text-[15px] text-[#171717] mb-2">
                رقم الهاتف
              </label>
              <div
                className={`flex items-center justify-between gap-2 pb-1.5 border-b transition-colors ${
                  errors.recipient
                    ? 'border-[#D32F2F] border-b-[1.5px]'
                    : 'border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px]'
                }`}
              >
                <input
                  id="req-phone"
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  value={draft.phone}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/[^\d]/g, '');
                    onUpdateDraft({ phone: sanitized });
                    if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: undefined }));
                  }}
                  placeholder="أدخل رقم الهاتف"
                  className="w-full text-right bg-transparent text-[17px] text-[#171717] placeholder:text-[#777777] outline-none tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => setShowContactsModal(true)}
                  aria-label="اختيار من جهات الاتصال"
                  className="min-w-[40px] min-h-[36px] flex items-center justify-end shrink-0 hover:opacity-80"
                >
                  <ContactBookIcon className="w-[28px] h-[28px]" />
                </button>
              </div>
              {errors.recipient && (
                <p className="mt-1.5 text-[12px] text-[#D32F2F]">{errors.recipient}</p>
              )}
            </div>
          )}

          {draft.method === 'username' && (
            <div>
              <label htmlFor="req-username" className="block text-[15px] text-[#171717] mb-2">
                اسم المستخدم
              </label>
              <div
                className={`flex items-center justify-between gap-2 pb-1.5 border-b transition-colors ${
                  errors.recipient
                    ? 'border-[#D32F2F] border-b-[1.5px]'
                    : 'border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px]'
                }`}
              >
                <input
                  id="req-username"
                  type="text"
                  dir="ltr"
                  value={draft.username}
                  onChange={(e) => {
                    onUpdateDraft({ username: e.target.value });
                    if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: undefined }));
                  }}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full text-right bg-transparent text-[17px] text-[#171717] placeholder:text-[#777777] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowContactsModal(true)}
                  aria-label="اختيار من جهات الاتصال"
                  className="min-w-[40px] min-h-[36px] flex items-center justify-end shrink-0 hover:opacity-80"
                >
                  <ContactBookIcon className="w-[28px] h-[28px]" />
                </button>
              </div>
              {errors.recipient && (
                <p className="mt-1.5 text-[12px] text-[#D32F2F]">{errors.recipient}</p>
              )}
            </div>
          )}

          {draft.method === 'facebook' && (
            <div>
              <label htmlFor="req-facebook" className="block text-[15px] text-[#171717] mb-2">
                حساب فيسبوك
              </label>
              <div
                className={`flex items-center justify-between gap-2 pb-1.5 border-b transition-colors ${
                  errors.recipient
                    ? 'border-[#D32F2F] border-b-[1.5px]'
                    : 'border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px]'
                }`}
              >
                <input
                  id="req-facebook"
                  type="text"
                  value={draft.facebookAccount}
                  onChange={(e) => {
                    onUpdateDraft({ facebookAccount: e.target.value });
                    if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: undefined }));
                  }}
                  placeholder="أدخل اسم حساب فيسبوك"
                  className="w-full text-right bg-transparent text-[17px] text-[#171717] placeholder:text-[#777777] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowContactsModal(true)}
                  aria-label="اختيار من جهات الاتصال"
                  className="min-w-[40px] min-h-[36px] flex items-center justify-end shrink-0 hover:opacity-80"
                >
                  <ContactBookIcon className="w-[28px] h-[28px]" />
                </button>
              </div>
              {errors.recipient && (
                <p className="mt-1.5 text-[12px] text-[#D32F2F]">{errors.recipient}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="req-amount" className="block text-[15px] text-[#171717] mb-2">
              المبلغ
            </label>
            <div
              className={`pb-1.5 border-b transition-colors ${
                errors.amount
                  ? 'border-[#D32F2F] border-b-[1.5px]'
                  : 'border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px]'
              }`}
            >
              <input
                id="req-amount"
                type="text"
                inputMode="decimal"
                dir="ltr"
                value={draft.amount}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
                  const parts = cleaned.split('.');
                  const normalized =
                    parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
                  onUpdateDraft({ amount: normalized });
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                placeholder="أدخل المبلغ"
                className="w-full text-right bg-transparent text-[18px] text-[#171717] placeholder:text-[#777777] outline-none tabular-nums"
              />
            </div>
            {errors.amount && <p className="mt-1.5 text-[12px] text-[#D32F2F]">{errors.amount}</p>}
          </div>

          <div>
            <label htmlFor="req-note" className="block text-[15px] text-[#171717] mb-2">
              ملاحظة (اختياري)
            </label>
            <div className="pb-1.5 border-b border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px] transition-colors">
              <input
                id="req-note"
                type="text"
                value={draft.note}
                onChange={(e) => onUpdateDraft({ note: e.target.value })}
                placeholder="أدخل ملاحظة"
                className="w-full text-right bg-transparent text-[16px] text-[#171717] placeholder:text-[#777777] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Inset Bottom Yellow Action Bar (53dp height, 17.5dp side & 17dp bottom margin matching Bankily_db2dec9a) */}
        <div className="shrink-0 px-[17.5px] pb-[17px] pt-2 bg-[#FAFAFA]">
          <button
            type="submit"
            className="w-full h-[53px] bg-[#FEC107] hover:bg-[#F2B700] active:bg-[#E5AD00] text-white text-[18px] font-normal flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#171717]"
          >
            طلب
          </button>
        </div>
      </form>

      {/* Contacts Picker */}
      {showContactsModal && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="req-contacts-title"
        >
          <div className="bg-white w-full max-w-[320px] rounded-[4px] shadow-2xl overflow-hidden">
            <div className="bg-[#00BCD5] text-white px-4 py-3 flex items-center justify-between">
              <h3 id="req-contacts-title" className="text-[15px] font-normal">
                جهات الاتصال
              </h3>
              <button
                type="button"
                onClick={() => setShowContactsModal(false)}
                aria-label="إغلاق"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/15"
              >
                <CloseXIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 divide-y divide-[#EEEEEE] max-h-[60vh] overflow-y-auto">
              {DIRECTORY_CONTACTS.map((contact) => {
                const subValue =
                  draft.method === 'phone'
                    ? contact.phone
                    : draft.method === 'username'
                    ? `@${contact.username}`
                    : contact.facebook;
                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className="w-full py-3 px-2 flex items-center justify-between text-right hover:bg-[#F7FDFE] transition-colors"
                  >
                    <div>
                      <div className="text-[14px] font-medium text-[#171717]">{contact.name}</div>
                      <div className="text-[12px] text-[#777777] tabular-nums" dir="ltr">
                        {subValue}
                      </div>
                    </div>
                    <span className="text-[12px] text-[#008CA0] font-medium">اختيار</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Request Sent Success Modal */}
      {submittedRecord && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center px-[27px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="req-success-title"
        >
          <div className="bg-white w-full max-w-[306px] rounded-[4px] shadow-2xl overflow-hidden">
            <div className="px-3 pt-5 pb-5 flex flex-col items-center text-center">
              <h2 id="req-success-title" className="text-[17px] font-normal text-[#171717] mb-4">
                تم إرسال الطلب بنجاح!
              </h2>
              <div className="mb-5">
                <SuccessCheckCircleIcon className="w-[68px] h-[68px]" />
              </div>
              <div className="space-y-2 text-[13.5px] font-normal text-[#222222] leading-relaxed w-full">
                <p>
                  <span>الدافع: </span>
                  <span dir="ltr" className="tabular-nums">
                    {submittedRecord.fromDisplay}
                  </span>
                  <span> المبلغ المطلوب: </span>
                  <span dir="ltr" className="tabular-nums">
                    MRU {submittedRecord.amount}
                  </span>
                </p>
                <p className="pt-2 whitespace-nowrap">
                  <span>رقم الطلب : </span>
                  <span dir="ltr" className="tabular-nums">
                    {submittedRecord.id}
                  </span>
                </p>
                <p className="whitespace-nowrap">
                  <span>التاريخ والوقت : </span>
                  <span dir="ltr" className="tabular-nums">
                    {submittedRecord.createdAt}
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmittedRecord(null);
                onBack();
              }}
              className="w-full h-[50px] bg-[#00BCD5] hover:bg-[#00AAC2] text-white text-[16px] font-normal flex items-center justify-center"
            >
              تم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
