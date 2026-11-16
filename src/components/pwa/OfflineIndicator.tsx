import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+10px)] left-1/2 -translate-x-1/2 z-[60] bg-[#171717]/90 text-white px-3.5 py-1.5 rounded-[4px] shadow-lg flex items-center gap-2 text-[12px] whitespace-nowrap pointer-events-none"
    >
      <span className="w-2 h-2 rounded-full bg-[#FEC107] shrink-0" />
      <span>وضع عدم الاتصال — يتم حفظ بياناتك محلياً</span>
    </div>
  );
};
