export type RecipientMethod = 'phone' | 'username' | 'bank' | 'facebook';

export type RequestMethod = 'phone' | 'username' | 'facebook';

export type AppScreen = 'home' | 'send' | 'confirm' | 'request' | 'board';

export interface TransferDraft {
  method: RecipientMethod;
  phone: string;
  username: string;
  bankName: string;
  bankAccount: string;
  facebookAccount: string;
  amount: string;
  note: string;
}

export interface RequestDraft {
  method: RequestMethod;
  phone: string;
  username: string;
  facebookAccount: string;
  amount: string;
  note: string;
}

export interface TransactionRecord {
  id: string;
  method: RecipientMethod;
  recipientDisplay: string;
  recipientSubtext?: string;
  amount: string;
  currency: 'MRU';
  note?: string;
  timestamp: string;
  isFavorite: boolean;
  status: 'SUCCESS';
}

export interface SplitGroupMember {
  id: string;
  name: string;
  phone: string;
  share: number;
}

export interface SplitGroup {
  id: string;
  name: string;
  totalAmount: number;
  members: SplitGroupMember[];
  createdAt: string;
}

export interface MoneyRequestRecord {
  id: string;
  method: RequestMethod;
  fromDisplay: string;
  amount: string;
  note?: string;
  createdAt: string;
}

export interface DirectoryContact {
  id: string;
  name: string;
  phone: string;
  username: string;
  facebook: string;
  bankName: string;
  bankAccount: string;
}

export const ACCESS_PIN = '1234';

export const ACCOUNT_OWNER = {
  name: 'أنت',
  initial: 'أ',
  phone: '32014902',
};

export const LOCAL_BANKS = [
  'بنك موريتانيا الشعبي (BPM)',
  'البنك الوطني لموريتانيا (BNM)',
  'التجاري بنك موريتانيا (ATB)',
  'البنك الموريتاني للاستثمار (BMI)',
];

export const DIRECTORY_CONTACTS: DirectoryContact[] = [
  {
    id: 'c1',
    name: 'محمد ولد أحمد',
    phone: '31198065',
    username: 'mohamed_mr',
    facebook: 'Mohamed Ahmed',
    bankName: LOCAL_BANKS[0],
    bankAccount: 'MR13000200010031198065',
  },
  {
    id: 'c2',
    name: 'فاطمة منت سالم',
    phone: '31317724',
    username: 'fatima_salem',
    facebook: 'Fatima Salem',
    bankName: LOCAL_BANKS[1],
    bankAccount: 'MR13000400020031317724',
  },
  {
    id: 'c3',
    name: 'سيدي ولد المختار',
    phone: '46120984',
    username: 'sidi_store',
    facebook: 'Sidi Mokhtar',
    bankName: LOCAL_BANKS[2],
    bankAccount: 'MR13000500080046120984',
  },
  {
    id: 'c4',
    name: 'مريم منت الشيخ',
    phone: '22884510',
    username: 'mariam_nk',
    facebook: 'Mariam Cheikh',
    bankName: LOCAL_BANKS[3],
    bankAccount: 'MR13000700030022884510',
  },
];

export const INITIAL_TRANSFER_DRAFT: TransferDraft = {
  method: 'phone',
  phone: '',
  username: '',
  bankName: LOCAL_BANKS[0],
  bankAccount: '',
  facebookAccount: '',
  amount: '',
  note: '',
};

export const INITIAL_REQUEST_DRAFT: RequestDraft = {
  method: 'phone',
  phone: '',
  username: '',
  facebookAccount: '',
  amount: '',
  note: '',
};
