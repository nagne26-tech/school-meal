import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 px-4 py-2.5 rounded-full bg-[#213145] text-[#eaf1ff] text-[13px] font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <span className="material-symbols-outlined text-[#40c2fd] text-[18px]">check_circle</span>
      <span>{message}</span>
    </div>
  );
};
