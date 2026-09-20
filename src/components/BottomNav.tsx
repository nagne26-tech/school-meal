import React from 'react';
import { ViewTab } from '../types';

interface BottomNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenAllergyModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAllergyModal,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 bg-[#f8f9ff]/95 backdrop-blur-md border-t border-blue-100/60 shadow-[0_-2px_12px_rgba(0,74,198,0.06)] pb-safe">
      <div className="h-16 max-w-4xl mx-auto px-4 flex items-center justify-around">
        {/* 오늘의 식단 */}
        <button
          type="button"
          onClick={() => onSelectTab('today')}
          className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            currentTab === 'today'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">today</span>
          <span className="text-[12px] font-semibold">오늘의 식단</span>
        </button>

        {/* 내일의 식단 */}
        <button
          type="button"
          onClick={() => onSelectTab('tomorrow')}
          className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            currentTab === 'tomorrow'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">event</span>
          <span className="text-[12px] font-semibold">내일의 식단</span>
        </button>

        {/* 이번 주 식단 */}
        <button
          type="button"
          onClick={() => onSelectTab('weekly')}
          className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            currentTab === 'weekly'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">date_range</span>
          <span className="text-[12px] font-semibold">이번 주 식단</span>
        </button>

        {/* 영양/알레르기 */}
        <button
          type="button"
          onClick={onOpenAllergyModal}
          className="min-h-[44px] min-w-[56px] flex flex-col items-center justify-center gap-0.5 text-[#434655] hover:text-[#004ac6] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">nutrition</span>
          <span className="text-[12px] font-semibold">영양/알레르기</span>
        </button>
      </div>
    </nav>
  );
};
