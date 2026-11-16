import { RecipientMethod, RequestDraft, TransferDraft } from '../types/transfer';

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

let lastTxSequence = 0;

/**
 * Generates a unique 19-digit transaction ID matching the reference format (e.g. 0126102413200650000):
 * 01 + YY + MM + DD + HH + mm + ss + 1-digit sequence + 4 random digits
 */
export function generateTransactionId(now: Date = new Date()): string {
  const yy = pad2(now.getFullYear() % 100);
  const mm = pad2(now.getMonth() + 1);
  const dd = pad2(now.getDate());
  const hh = pad2(now.getHours());
  const min = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());
  lastTxSequence = (lastTxSequence + 1) % 10;
  const seq = String(lastTxSequence);
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `01${yy}${mm}${dd}${hh}${min}${ss}${seq}${rand}`;
}

/**
 * Formats device date and time as DD-MM-YY HH:mm:ss
 */
export function formatTransactionDateTime(now: Date = new Date()): string {
  const dd = pad2(now.getDate());
  const mm = pad2(now.getMonth() + 1);
  const yy = pad2(now.getFullYear() % 100);
  const hh = pad2(now.getHours());
  const min = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());
  return `${dd}-${mm}-${yy} ${hh}:${min}:${ss}`;
}

export function formatMruAmount(raw: string): string {
  const normalized = raw.replace(/\s+/g, '').replace(',', '.').trim();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return raw.trim();
  }
  if (Number.isInteger(parsed)) {
    return String(parsed);
  }
  return parsed.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Formats amounts with space thousands separator as shown in reference (e.g. "2 000", "18")
 */
export function formatMruDisplay(raw: string): string {
  const clean = formatMruAmount(raw);
  const [intPart, decPart] = clean.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped;
}

export interface TransferFeeBreakdown {
  serviceFee: string;
  commission: string;
  tax: string;
}

/**
 * Matches observed fee schedule in reference screenshots:
 * - Small transfers (<= 100 MRU, e.g. 18 MRU): 0 / 0 / 0
 * - Larger transfers (> 100 MRU, e.g. 2 000 MRU): serviceFee = amount * (2 / 116) -> 34.48, commission = 0, tax = 20% of serviceFee -> 6.9
 */
export function calculateTransferFees(rawAmount: string): TransferFeeBreakdown {
  const numeric = Number(rawAmount.replace(/\s+/g, '').replace(',', '.').trim());
  if (!Number.isFinite(numeric) || numeric <= 100) {
    return { serviceFee: '0', commission: '0', tax: '0' };
  }
  const rawFee = Math.round(numeric * (2 / 116) * 100) / 100;
  const rawTax = Math.round(rawFee * 0.2 * 100) / 100;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, ''));
  return {
    serviceFee: fmt(rawFee),
    commission: '0',
    tax: fmt(rawTax),
  };
}

export function getRecipientDisplay(draft: TransferDraft): string {
  switch (draft.method) {
    case 'phone':
      return draft.phone.trim();
    case 'username':
      return draft.username.trim();
    case 'bank':
      return draft.bankAccount.trim();
    case 'facebook':
      return draft.facebookAccount.trim();
  }
}

export function getRequestRecipientDisplay(draft: RequestDraft): string {
  switch (draft.method) {
    case 'phone':
      return draft.phone.trim();
    case 'username':
      return draft.username.trim();
    case 'facebook':
      return draft.facebookAccount.trim();
  }
}

export function getMethodLabel(method: RecipientMethod): string {
  switch (method) {
    case 'phone':
      return 'رقم الهاتف';
    case 'username':
      return 'اسم المستخدم';
    case 'bank':
      return 'بنك';
    case 'facebook':
      return 'فيسبوك';
  }
}

export interface ValidationErrors {
  recipient?: string;
  bankName?: string;
  amount?: string;
}

export function validateTransferDraft(draft: TransferDraft): ValidationErrors {
  const errors: ValidationErrors = {};

  if (draft.method === 'phone') {
    const cleanPhone = draft.phone.trim();
    if (!cleanPhone) {
      errors.recipient = 'الرجاء إدخال رقم الهاتف';
    } else if (!/^\d{8,15}$/.test(cleanPhone)) {
      errors.recipient = 'الرجاء إدخال رقم هاتف صحيح (8 أرقام على الأقل)';
    }
  } else if (draft.method === 'username') {
    const cleanUser = draft.username.trim();
    if (!cleanUser) {
      errors.recipient = 'الرجاء إدخال اسم المستخدم';
    } else if (cleanUser.length < 3) {
      errors.recipient = 'يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل';
    }
  } else if (draft.method === 'bank') {
    if (!draft.bankName.trim()) {
      errors.bankName = 'الرجاء اختيار البنك';
    }
    const cleanAcc = draft.bankAccount.trim();
    if (!cleanAcc) {
      errors.recipient = 'الرجاء إدخال رقم الحساب البنكي';
    } else if (!/^[A-Za-z0-9]{6,30}$/.test(cleanAcc)) {
      errors.recipient = 'الرجاء إدخال رقم حساب بنكي صحيح';
    }
  } else if (draft.method === 'facebook') {
    const cleanFb = draft.facebookAccount.trim();
    if (!cleanFb) {
      errors.recipient = 'الرجاء إدخال اسم حساب فيسبوك المستلم';
    } else if (cleanFb.length < 3) {
      errors.recipient = 'الرجاء إدخال اسم حساب صحيح';
    }
  }

  const normalizedAmount = draft.amount.replace(/\s+/g, '').replace(',', '.').trim();
  if (!normalizedAmount) {
    errors.amount = 'الرجاء إدخال المبلغ';
  } else {
    const num = Number(normalizedAmount);
    if (!/^\d+(\.\d{1,2})?$/.test(normalizedAmount) || !Number.isFinite(num) || num <= 0) {
      errors.amount = 'الرجاء إدخال مبلغ صحيح أكبر من صفر';
    }
  }

  return errors;
}

export function validateRequestDraft(draft: RequestDraft): ValidationErrors {
  const errors: ValidationErrors = {};

  if (draft.method === 'phone') {
    const cleanPhone = draft.phone.trim();
    if (!cleanPhone) {
      errors.recipient = 'الرجاء إدخال رقم الهاتف';
    } else if (!/^\d{8,15}$/.test(cleanPhone)) {
      errors.recipient = 'الرجاء إدخال رقم هاتف صحيح (8 أرقام على الأقل)';
    }
  } else if (draft.method === 'username') {
    const cleanUser = draft.username.trim();
    if (!cleanUser) {
      errors.recipient = 'الرجاء إدخال اسم المستخدم';
    } else if (cleanUser.length < 3) {
      errors.recipient = 'يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل';
    }
  } else if (draft.method === 'facebook') {
    const cleanFb = draft.facebookAccount.trim();
    if (!cleanFb) {
      errors.recipient = 'الرجاء إدخال اسم حساب فيسبوك';
    } else if (cleanFb.length < 3) {
      errors.recipient = 'الرجاء إدخال اسم حساب صحيح';
    }
  }

  const normalizedAmount = draft.amount.replace(/\s+/g, '').replace(',', '.').trim();
  if (!normalizedAmount) {
    errors.amount = 'الرجاء إدخال المبلغ';
  } else {
    const num = Number(normalizedAmount);
    if (!/^\d+(\.\d{1,2})?$/.test(normalizedAmount) || !Number.isFinite(num) || num <= 0) {
      errors.amount = 'الرجاء إدخال مبلغ صحيح أكبر من صفر';
    }
  }

  return errors;
}
