import React, { useMemo, useState } from 'react';
import {
  ACCOUNT_OWNER,
  DIRECTORY_CONTACTS,
  SplitGroup,
  SplitGroupMember,
} from '../../types/transfer';
import { formatTransactionDateTime } from '../../utils/transferHelpers';
import { AddMemberIcon, BackArrowIcon, CloseXIcon } from '../Icons';

interface BoardScreenProps {
  splitGroups: SplitGroup[];
  onBack: () => void;
  onCreateSplitGroup: (group: SplitGroup) => void;
  onPrefillMemberTransfer: (phone: string, amount: string, note: string) => void;
}

interface DraftParticipant {
  id: string;
  name: string;
  phone: string;
}

export const BoardScreen: React.FC<BoardScreenProps> = ({
  splitGroups,
  onBack,
  onCreateSplitGroup,
  onPrefillMemberTransfer,
}) => {
  const [totalAmount, setTotalAmount] = useState('');
  const [note, setNote] = useState('');
  const [participants, setParticipants] = useState<DraftParticipant[]>([
    { id: 'owner', name: ACCOUNT_OWNER.name, phone: ACCOUNT_OWNER.phone },
  ]);
  const [customShares, setCustomShares] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');

  // Add Member Picker Modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [memberError, setMemberError] = useState('');

  // Saved Group Confirmation / Next step
  const [savedGroup, setSavedGroup] = useState<SplitGroup | null>(null);

  const numericTotal = useMemo(() => {
    const n = Number(totalAmount.replace(',', '.').trim());
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [totalAmount]);

  const defaultEqualShare = useMemo(() => {
    if (numericTotal <= 0 || participants.length === 0) return '0.00';
    return (numericTotal / participants.length).toFixed(2);
  }, [numericTotal, participants.length]);

  const getParticipantShare = (id: string) => {
    if (customShares[id] !== undefined) return customShares[id];
    return defaultEqualShare;
  };

  const handleAddContact = (contact: (typeof DIRECTORY_CONTACTS)[number]) => {
    if (participants.some((p) => p.phone === contact.phone)) {
      setShowAddMemberModal(false);
      return;
    }
    setParticipants((prev) => [
      ...prev,
      { id: contact.id, name: contact.name, phone: contact.phone },
    ]);
    setCustomShares({});
    setShowAddMemberModal(false);
    setErrorMsg('');
  };

  const handleAddCustomMember = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newName.trim();
    const cleanPhone = newPhone.trim();
    if (!cleanName) {
      setMemberError('الرجاء إدخال الاسم');
      return;
    }
    if (!/^\d{8,15}$/.test(cleanPhone)) {
      setMemberError('الرجاء إدخال رقم هاتف صحيح (8 أرقام على الأقل)');
      return;
    }
    if (participants.some((p) => p.phone === cleanPhone)) {
      setMemberError('هذا الرقم مضاف بالفعل');
      return;
    }
    setParticipants((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, name: cleanName, phone: cleanPhone },
    ]);
    setCustomShares({});
    setNewName('');
    setNewPhone('');
    setMemberError('');
    setShowAddMemberModal(false);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericTotal <= 0) {
      setErrorMsg('الرجاء إدخال المبلغ');
      return;
    }
    if (participants.length < 2) {
      setErrorMsg('أضف فرداً واحداً على الأقل لتقسيم المبلغ');
      return;
    }

    const members: SplitGroupMember[] = participants.map((p) => {
      const shareNum = Number(getParticipantShare(p.id)) || numericTotal / participants.length;
      return {
        id: p.id,
        name: p.name,
        phone: p.phone,
        share: Number(shareNum.toFixed(2)),
      };
    });

    const group: SplitGroup = {
      id: `GRP-${Date.now().toString().slice(-5)}`,
      name: note.trim() || `مجموعة (${participants.length} أفراد)`,
      totalAmount: numericTotal,
      members,
      createdAt: formatTransactionDateTime(new Date()),
    };

    onCreateSplitGroup(group);
    setSavedGroup(group);
    setErrorMsg('');
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-[#FAFAFA]">
      {/* Top Turquoise Header (53dp matching Bankily_54e62468) */}
      <header className="bg-[#00BCD5] text-white shrink-0">
        <div className="relative h-[53px] flex items-center justify-center px-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="العودة"
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <BackArrowIcon className="w-6 h-6" />
          </button>
          <h1 className="text-[19px] font-normal">اللوحة</h1>
        </div>
      </header>

      {/* Form Body + Fixed Bottom Action Bar */}
      <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col bg-[#FAFAFA]">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-5 pb-8 space-y-6">
          {/* Amount */}
          <div>
            <label htmlFor="board-amount" className="block text-[15px] text-[#171717] mb-2">
              المبلغ
            </label>
            <div className="pb-1.5 border-b border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px] transition-colors">
              <input
                id="board-amount"
                type="text"
                inputMode="decimal"
                dir="ltr"
                value={totalAmount}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
                  const parts = cleaned.split('.');
                  const normalized =
                    parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
                  setTotalAmount(normalized);
                  setCustomShares({});
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="أدخل المبلغ"
                className="w-full text-right bg-transparent text-[17px] text-[#171717] placeholder:text-[#777777] outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label htmlFor="board-note" className="block text-[15px] text-[#171717] mb-2">
              ملاحظة
            </label>
            <div className="pb-1.5 border-b border-[#555555] focus-within:border-[#111111] focus-within:border-b-[2px] transition-colors">
              <input
                id="board-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="أدخل ملاحظة"
                className="w-full text-right bg-transparent text-[16px] text-[#171717] placeholder:text-[#777777] outline-none"
              />
            </div>
          </div>

          {/* Members Section */}
          <div className="pt-1 space-y-4">
            <h2 className="text-[15.5px] text-[#171717] font-normal">أفراد</h2>

            <div className="space-y-4">
              {participants.map((p, index) => {
                const isOwner = index === 0;
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-[44px] h-[44px] rounded-full bg-[#00BCD5] text-white text-[18px] font-normal flex items-center justify-center shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] text-[#171717] truncate">{p.name}</span>
                          {!isOwner && (
                            <button
                              type="button"
                              onClick={() => {
                                setParticipants((prev) => prev.filter((m) => m.id !== p.id));
                                setCustomShares({});
                              }}
                              aria-label={`إزالة ${p.name}`}
                              className="text-[11px] text-[#D32F2F] hover:underline shrink-0"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                        <div dir="ltr" className="text-[14px] text-[#171717] tabular-nums text-right">
                          {p.phone}
                        </div>
                      </div>
                    </div>

                    <div className="w-[54px] pb-1 border-b border-[#222222] shrink-0">
                      <input
                        type="text"
                        inputMode="decimal"
                        dir="ltr"
                        aria-label={`حصة ${p.name}`}
                        value={getParticipantShare(p.id)}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
                          setCustomShares((prev) => ({ ...prev, [p.id]: cleaned }));
                        }}
                        className="w-full text-center bg-transparent text-[15px] text-[#171717] outline-none tabular-nums"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Add Member Row matching Bankily_54e62468 */}
              <button
                type="button"
                onClick={() => {
                  setMemberError('');
                  setShowAddMemberModal(true);
                }}
                className="flex items-center gap-3 w-full text-right py-1 hover:opacity-85 transition-opacity"
              >
                <AddMemberIcon className="w-[44px] h-[44px] shrink-0" />
                <span className="text-[15.5px] text-[#171717]">إضافة أفراد</span>
              </button>
            </div>

            {errorMsg && <p className="text-[12.5px] text-[#D32F2F]">{errorMsg}</p>}
          </div>

          {/* Saved Groups Section (only shown if groups were previously saved) */}
          {splitGroups.length > 0 && (
            <div className="pt-4 border-t border-[#E5E5E5] space-y-2.5">
              <h3 className="text-[13.5px] text-[#555555]">المجموعات المحفوظة ({splitGroups.length})</h3>
              {splitGroups.map((grp) => (
                <div key={grp.id} className="p-3 bg-[#F2F2F2] rounded-[4px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-[#171717]">{grp.name}</span>
                    <span dir="ltr" className="text-[13.5px] font-bold text-[#008CA0] tabular-nums">
                      MRU {grp.totalAmount}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {grp.members
                      .filter((m) => m.phone !== ACCOUNT_OWNER.phone)
                      .map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-[12.5px] text-[#333333]">
                          <span>
                            {m.name} (<span dir="ltr" className="tabular-nums">{m.phone}</span>)
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onPrefillMemberTransfer(m.phone, String(m.share), grp.name)
                            }
                            className="text-[#008CA0] font-medium hover:underline"
                          >
                            إرسال <span dir="ltr">{m.share} MRU</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Bottom Yellow Action Bar (53dp height, #FEC107) */}
        <div className="shrink-0 bg-[#FEC107]">
          <button
            type="submit"
            className="w-full h-[53px] bg-[#FEC107] hover:bg-[#F2B700] active:bg-[#E5AD00] text-white text-[18px] font-normal flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#171717]"
          >
            التالي
          </button>
        </div>
      </form>

      {/* Add Members Modal */}
      {showAddMemberModal && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-member-title"
        >
          <div className="bg-white w-full max-w-[330px] max-h-[80vh] flex flex-col rounded-[4px] shadow-2xl overflow-hidden">
            <div className="bg-[#00BCD5] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <h3 id="add-member-title" className="text-[15px] font-normal">
                إضافة أفراد
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                aria-label="إغلاق"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/15"
              >
                <CloseXIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div className="space-y-1 divide-y divide-[#EEEEEE]">
                {DIRECTORY_CONTACTS.map((c) => {
                  const alreadyAdded = participants.some((p) => p.phone === c.phone);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddContact(c)}
                      className="w-full py-2.5 px-1 flex items-center justify-between text-right hover:bg-[#F7FDFE] disabled:opacity-50"
                    >
                      <div>
                        <div className="text-[14px] text-[#171717]">{c.name}</div>
                        <div dir="ltr" className="text-[12px] text-[#777777] tabular-nums">
                          {c.phone}
                        </div>
                      </div>
                      <span className="text-[12px] text-[#008CA0] font-medium">
                        {alreadyAdded ? 'مضاف' : 'إضافة'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleAddCustomMember} className="pt-3 border-t border-[#EEEEEE] space-y-3">
                <div className="text-[13px] font-medium text-[#171717]">أو إضافة رقم آخر</div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="الاسم"
                  className="w-full border-b border-[#555555] focus:border-[#111111] py-1.5 text-[14px] outline-none"
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="رقم الهاتف"
                  className="w-full text-right border-b border-[#555555] focus:border-[#111111] py-1.5 text-[14px] outline-none tabular-nums"
                />
                {memberError && <p className="text-[12px] text-[#D32F2F]">{memberError}</p>}
                <button
                  type="submit"
                  className="w-full h-[42px] bg-[#00BCD5] text-white text-[14.5px] rounded-[4px]"
                >
                  إضافة للمجموعة
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Group Saved Result Modal */}
      {savedGroup && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center px-[27px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="group-saved-title"
        >
          <div className="bg-white w-full max-w-[306px] rounded-[4px] shadow-2xl overflow-hidden">
            <div className="px-4 pt-5 pb-4 space-y-3">
              <h2 id="group-saved-title" className="text-[17px] font-normal text-[#171717] text-center">
                تفاصيل تقسيم المبلغ
              </h2>
              <div className="bg-[#F2F2F2] rounded-[4px] p-3 space-y-2 text-[13.5px]">
                <div className="flex justify-between">
                  <span className="text-[#555555]">المبلغ الإجمالي</span>
                  <span dir="ltr" className="font-bold text-[#171717] tabular-nums">
                    MRU {savedGroup.totalAmount}
                  </span>
                </div>
                {savedGroup.members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between pt-1 border-t border-white">
                    <span className="text-[#171717]">{m.name}</span>
                    <div className="flex items-center gap-2">
                      <span dir="ltr" className="tabular-nums text-[#171717]">
                        MRU {m.share}
                      </span>
                      {m.phone !== ACCOUNT_OWNER.phone && (
                        <button
                          type="button"
                          onClick={() => {
                            const name = savedGroup.name;
                            setSavedGroup(null);
                            onPrefillMemberTransfer(m.phone, String(m.share), name);
                          }}
                          className="text-[12px] text-[#008CA0] font-medium underline"
                        >
                          إرسال
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSavedGroup(null);
                onBack();
              }}
              className="w-full h-[50px] bg-[#00BCD5] text-white text-[16px] font-normal flex items-center justify-center"
            >
              تم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
