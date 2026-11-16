import React from 'react';

interface IconProps {
  className?: string;
}

export const BackArrowIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SendMoneyBillIcon: React.FC<IconProps> = ({ className = 'w-[66px] h-[30px]' }) => (
  <svg viewBox="0 0 76 34" fill="none" className={className} aria-hidden="true">
    {/* Speed lines to the right */}
    <rect x="47" y="5.5" width="23" height="3.6" rx="1.8" fill="currentColor" />
    <rect x="47" y="15.2" width="26" height="3.6" rx="1.8" fill="currentColor" />
    <rect x="47" y="24.9" width="23" height="3.6" rx="1.8" fill="currentColor" />
    {/* Banknote slightly contoured top & bottom */}
    <path
      d="M5 6.2C5 5.4 5.7 4.8 6.5 4.9C18 6.4 29 6.4 40.5 4.9C41.3 4.8 42 5.4 42.3 6.2L45.6 17L42.3 27.8C42 28.6 41.3 29.2 40.5 29.1C29 27.6 18 27.6 6.5 29.1C5.7 29.2 5 28.6 5 27.8L8.4 17L5 6.2Z"
      fill="currentColor"
    />
    {/* Currency circle */}
    <circle cx="25.5" cy="17" r="7.5" fill="#008CA0" />
    <path
      d="M23 13.4H28M23 15.9H27.7M25 13.4C26.3 13.4 27 14.2 27 15.4C27 16.7 26.1 17.5 24.5 17.5H23.5L27 21"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RequestMoneyBillIcon: React.FC<IconProps> = ({ className = 'w-[66px] h-[30px]' }) => (
  <svg viewBox="0 0 76 34" fill="none" className={className} aria-hidden="true">
    {/* Banknote */}
    <path
      d="M7 6.2C7 5.4 7.7 4.8 8.5 4.9C19 6.4 29.5 6.4 40 4.9C40.8 4.8 41.5 5.4 41.8 6.2L45 17L41.8 27.8C41.5 28.6 40.8 29.2 40 29.1C29.5 27.6 19 27.6 8.5 29.1C7.7 29.2 7 28.6 7 27.8L10.2 17L7 6.2Z"
      fill="currentColor"
    />
    {/* Currency circle */}
    <circle cx="26" cy="17" r="7.5" fill="#FEC107" />
    <path
      d="M23.5 13.4H28.5M23.5 15.9H28.2M25.5 13.4C26.8 13.4 27.5 14.2 27.5 15.4C27.5 16.7 26.6 17.5 25 17.5H24L27.5 21"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Incoming/outgoing curved arrow on right side matching screenshot */}
    <path
      d="M36 25C39.5 20.5 45 18 50.5 18L49 23.5L65 15L49 6.5L50.5 12C43.5 12.2 38 16.5 34.8 23.5L36 25Z"
      fill="currentColor"
    />
  </svg>
);

export const QrTileIcon: React.FC<IconProps> = ({ className = 'w-[34px] h-[34px]' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    {/* Top-left hollow square */}
    <rect x="2" y="2" width="13" height="13" stroke="currentColor" strokeWidth="4" />
    {/* Top-right hollow square */}
    <rect x="21" y="2" width="13" height="13" stroke="currentColor" strokeWidth="4" />
    {/* Bottom-left hollow square */}
    <rect x="2" y="21" width="13" height="13" stroke="currentColor" strokeWidth="4" />
    {/* Inner crisp asymmetric modules matching Bankily QR icon */}
    <rect x="13" y="13" width="6" height="6" fill="currentColor" />
    <rect x="19" y="19" width="6" height="6" fill="currentColor" />
    <rect x="29" y="21" width="5" height="5" fill="currentColor" />
    <rect x="21" y="29" width="5" height="5" fill="currentColor" />
    <rect x="29" y="29" width="5" height="5" fill="currentColor" />
  </svg>
);

export const TabPhoneIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 32 36" fill="none" className={className} aria-hidden="true">
    <rect
      x="6"
      y="2"
      width="20"
      height="32"
      rx="3"
      stroke="currentColor"
      strokeWidth="2.2"
    />
    <line x1="6" y1="6.5" x2="26" y2="6.5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="6" y1="28.5" x2="26" y2="28.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="31.2" r="1.1" fill="currentColor" />
  </svg>
);

export const TabUsernameIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <circle cx="18" cy="11.5" r="5.5" fill="currentColor" />
    <path
      d="M7 29.5C7 24 11.9 20.5 18 20.5C24.1 20.5 29 24 29 29.5V30.5H7V29.5Z"
      fill="currentColor"
    />
  </svg>
);

export const TabBankIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <path d="M18 5L4 12.5H32L18 5Z" fill="currentColor" />
    <rect x="7.5" y="14.5" width="3.8" height="11" fill="currentColor" />
    <rect x="16.1" y="14.5" width="3.8" height="11" fill="currentColor" />
    <rect x="24.7" y="14.5" width="3.8" height="11" fill="currentColor" />
    <rect x="4" y="27.5" width="28" height="3.2" rx="0.8" fill="currentColor" />
  </svg>
);

export const TabFacebookIcon: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <circle cx="18" cy="18" r="14" fill="currentColor" />
    <path
      d="M20.3 29.5V19.2H23.6L24.1 15.3H20.3V12.8C20.3 11.7 20.6 10.9 22.2 10.9H24.2V7.4C23.8 7.3 22.6 7.2 21.2 7.2C18.3 7.2 16.3 9 16.3 12.3V15.3H13V19.2H16.3V29.5H20.3Z"
      fill="#00BCD5"
    />
  </svg>
);

export const AddMemberIcon: React.FC<IconProps> = ({ className = 'w-[44px] h-[44px]' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    {/* Bust silhouette */}
    <circle cx="24" cy="14.5" r="7" fill="#596978" />
    <path
      d="M11 36.5C11 29.5 16.5 25 24 25C31.5 25 37 29.5 37 36.5V38H11V36.5Z"
      fill="#596978"
    />
    {/* Plus badge at bottom-left matching Bankily_54e62468 */}
    <circle cx="14" cy="34" r="8" fill="#FFFFFF" stroke="#596978" strokeWidth="1.8" />
    <path
      d="M14 30V38M10 34H18"
      stroke="#596978"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ContactBookIcon: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    {/* Cover */}
    <rect
      x="3"
      y="4"
      width="23"
      height="24"
      rx="2"
      stroke="#FEC107"
      strokeWidth="2"
      fill="#FFFFFF"
    />
    {/* Spiral rings on the right */}
    <rect x="23" y="8" width="6" height="2.4" rx="1.2" fill="#FEC107" />
    <rect x="23" y="14.8" width="6" height="2.4" rx="1.2" fill="#FEC107" />
    <rect x="23" y="21.6" width="6" height="2.4" rx="1.2" fill="#FEC107" />
    {/* Phone handset inside */}
    <path
      d="M11.2 10.2C10.7 10.2 10.2 10.6 10.1 11.1C9.5 14.3 11.3 18.8 14.5 21.4C15.5 22.2 16.7 22.5 17.5 22.1C18.1 21.8 18.7 21.2 18.9 20.6C19.1 20.1 18.9 19.6 18.4 19.3L16.7 18.3C16.3 18.1 15.8 18.2 15.5 18.5L14.8 19.2C13.6 18.3 12.6 16.7 12.2 15.3L13.1 14.7C13.5 14.4 13.6 13.9 13.4 13.5L12.6 11.4C12.4 10.7 11.8 10.2 11.2 10.2Z"
      fill="#FEC107"
    />
  </svg>
);

export const SuccessCheckCircleIcon: React.FC<IconProps> = ({ className = 'w-[70px] h-[70px]' }) => (
  <svg viewBox="0 0 72 72" fill="none" className={className} aria-hidden="true">
    <circle cx="36" cy="36" r="31" stroke="#4EB250" strokeWidth="4.5" />
    <path
      d="M23.5 36.5L32 45L49 27"
      stroke="#4EB250"
      strokeWidth="4.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({
  className = 'w-7 h-7',
  filled = false,
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path
      d="M12 2.4L14.95 8.38L21.55 9.34L16.77 13.99L17.9 20.57L12 17.46L6.1 20.57L7.23 13.99L2.45 9.34L9.05 8.38L12 2.4Z"
      stroke="currentColor"
      strokeWidth={filled ? '0.5' : '0'}
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseXIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M6 6L18 18M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
