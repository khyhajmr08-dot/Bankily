import React, { useState } from 'react';
import {
  DIRECTORY_CONTACTS,
  LOCAL_BANKS,
  RecipientMethod,
  TransferDraft,
} from '../../types/transfer';
import { validateTransferDraft, ValidationErrors } from '../../utils/transferHelpers';
import {
  BackArrowIcon,
  CloseXIcon,
  ContactBookIcon,
  TabBankIcon,
  TabFacebookIcon,
  TabPhoneIcon,
  TabUsernameIcon,
} from '../Icons';

interface SendMoneyScreenProps {
  draft: TransferDraft;
  onUpdateDraft: (patch: Partial<TransferDraft>) => void;
  onBack: () => void;
  onProceedToReview: () => void;
}

const TABS: { id: RecipientMethod; label: string }[] = [
  { id: 'phone', label: 'رقم الهاتف' },
  { id: 'username', label: 'اسم المستخدم' },
  { id: 'bank', label: 'بنك' },
  { id: 'facebook', label: 'فيسبوك' },
];

export const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({
  draft,
  onUpdateDraft,
  onBack,
  onProceedToReview,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showContactsModal, setShowContactsModal] = useState(false);

  const handleTabChange = (method: RecipientMethod) => {
    onUpdateDraft({ method });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTransferDraft(draft);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    onProceedToReview();
  };

  const handleSelectContact = (contact: (typeof DIRECTORY_CONTACTS)[number]) => {
    if (draft.method === 'phone') {
      onUpdateDraft({ phone: contact.phone });
    } else if (draft.method === 'username') {
      onUpdateDraft({ username: contact.username });
    } else if (draft.method === 'bank') {
      onUpdateDraft({ bankName: contact.bankName, bankAccount: contact.bankAccount });
    } else if (draft.method === 'facebook') {
      onUpdateDraft({ facebookAccount: contact.facebook });
    }
    setErrors((prev) => ({ ...prev, recipient: undefined }));
    setShowContactsModal(false);
  };

  const renderTabIcon = (id: RecipientMethod, isSelected: boolean) => {
    const colorClass = isSelected ? 'text-[#FEC107]' : 'text-white';
    switch (id) {
      case 'phone':
        return <TabPhoneIcon className={`w-7 h-8 ${colorClass}`} />;
      case 'username':
        return <TabUsernameIcon className={`w-8 h-8 ${colorClass}`} />;
      case 'bank':
        return <TabBankIcon className={`w-8 h-8 ${colorClass}`} />;
      case 'facebook':
        return <TabFacebookIcon className={`w-8 h-8 ${colorClass}`} />;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-[#FAFAFA]">
      {/* Top Turquoise Header + 4 Horizontal Tabs (120dp total height) */}
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
          <h1 className="text-[19px] font-normal">إرسال الأموال</h1>
        </div>

        {/* 4 Tabs in exact RTL order: رقم الهاتف, اسم المستخدم, بنك, فيسبوك */}
        <nav aria-label="طريقة اختيار المستلم" className="grid grid-cols-4 h-[68px]">
          {TABS.map((tab) => {
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

      {/* Form Shell: Scrollable Content Region + Fixed Bottom Action Bar */}
      <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col bg-[#FAFAFA]">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-6 pb-8 space-y-7">
          {/* Recipient Field per Selected Tab */}
          {draft.method === 'phone' && (
            <div>
              <label htmlFor="input-phone" className="block text-[15px] text-[#171717] mb-2">
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
                  id="input-phone"
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
                  className="min-w-[40px] min-h-[36px] flex items-center justify-end shrink-0 hover:opacity-80 active:scale-95 transition-transform"
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
              <label htmlFor="input-username" className="block text-[15px] text-[#171717] mb-2">
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
                  id="input-username"
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

          {draft.method === 'bank' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="select-bank" className="block text-[15px] text-[#171717] mb-2">
                  اسم البنك
                </label>
                <select
                  id="select-bank"
                  value={draft.bankName}
                  onChange={(e) => onUpdateDraft({ bankName: e.target.value })}
                  className="w-full bg-transparent border-b border-[#555555] focus:border-[#111111] focus:border-b-[2px] pb-2 text-[15px] text-[#171717] outline-none"
                >
                  {LOCAL_BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="input-bank-account" className="block text-[15px] text-[#171717] mb-2">
                  رقم الحساب البنكي
                </label>
                <div
                  className={`flex items-center justify-between gap-2 pb-1.5 border-b transition-colors ${
                    errors.recipient
                      ? 'border-[#D32F2F] border-b-[1.5px]'
                      : 'border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px]'
                  }`}
                >
                  <input
                    id="input-bank-account"
                    type="text"
                    dir="ltr"
                    value={draft.bankAccount}
                    onChange={(e) => {
                      onUpdateDraft({ bankAccount: e.target.value.toUpperCase() });
                      if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: undefined }));
                    }}
                    placeholder="أدخل رقم الحساب البنكي"
                    className="w-full text-right bg-transparent text-[16px] text-[#171717] placeholder:text-[#777777] outline-none tabular-nums"
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
            </div>
          )}

          {draft.method === 'facebook' && (
            <div>
              <label htmlFor="input-facebook" className="block text-[15px] text-[#171717] mb-2">
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
                  id="input-facebook"
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

          {/* Amount Input */}
          <div>
            <label htmlFor="input-amount" className="block text-[15px] text-[#171717] mb-2">
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
                id="input-amount"
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

          {/* Note Input (Optional) */}
          <div>
            <label htmlFor="input-note" className="block text-[15px] text-[#171717] mb-2">
              ملاحظة (اختياري)
            </label>
            <div className="pb-1.5 border-b border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px] transition-colors">
              <input
                id="input-note"
                type="text"
                value={draft.note}
                onChange={(e) => onUpdateDraft({ note: e.target.value })}
                placeholder="أدخل ملاحظة"
                className="w-full text-right bg-transparent text-[16px] text-[#171717] placeholder:text-[#777777] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar (53dp height, #FEC107, pinned to bottom of screen) */}
        <div className="shrink-0 bg-[#FEC107]">
          <button
            type="submit"
            className="w-full h-[53px] bg-[#FEC107] hover:bg-[#F2B700] active:bg-[#E5AD00] text-white text-[18px] font-normal flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#171717]"
          >
            إرسال
          </button>
        </div>
      </form>

      {/* Simulated Contacts / Demo Recipients Picker Modal */}
      {showContactsModal && (
        <div
          className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contacts-modal-title"
        >
          <div className="bg-white w-full max-w-[330px] rounded-[6px] shadow-2xl overflow-hidden">
            <div className="bg-[#00BCD5] text-white px-4 py-3 flex items-center justify-between">
              <h3 id="contacts-modal-title" className="text-[15px] font-normal">
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
                    : draft.method === 'bank'
                    ? contact.bankAccount
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
    </div>
  );
};
