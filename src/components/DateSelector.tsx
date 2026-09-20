import React from 'react';
import { ViewTab } from '../types';
import { getKSTWeekDates, getKSTDate } from '../services/neisService';

interface DateSelectorProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  currentTab,
  onSelectTab,
  selectedDate,
  onSelectDate,
  onPrevDay,
  onNextDay,
}) => {
  const weekDates = getKSTWeekDates(selectedDate);
  const dayNames = ['월', '화', '수', '목', '금'];

  const isSameDayKST = (d1: Date, d2: Date) => {
    const k1 = getKSTDate(d1);
    const k2 = getKSTDate(d2);
    return (
      k1.getFullYear() === k2.getFullYear() &&
      k1.getMonth() === k2.getMonth() &&
      k1.getDate() === k2.getDate()
    );
  };

  const today = new Date();

  return (
    <div className="flex flex-col gap-3 w-full mb-4">
      {/* 3-Way Segmented Tabs */}
      <section className="w-full">
        <div className="grid grid-cols-3 gap-1 bg-[#eff4ff] p-1.5 rounded-2xl border border-blue-100/40">
          <button
            type="button"
            onClick={() => onSelectTab('today')}
            className={`min-h-[42px] flex items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
              currentTab === 'today'
                ? 'bg-white text-[#004ac6] font-bold shadow-sm'
                : 'text-[#434655] hover:text-[#0b1c30] hover:bg-white/40'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
            <span>오늘 식단</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('tomorrow')}
            className={`min-h-[42px] flex items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
              currentTab === 'tomorrow'
                ? 'bg-white text-[#004ac6] font-bold shadow-sm'
                : 'text-[#434655] hover:text-[#0b1c30] hover:bg-white/40'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">fastfood</span>
            <span>내일 식단</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('weekly')}
            className={`min-h-[42px] flex items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
              currentTab === 'weekly'
                ? 'bg-white text-[#004ac6] font-bold shadow-sm'
                : 'text-[#434655] hover:text-[#0b1c30] hover:bg-white/40'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">calendar_view_week</span>
            <span>주간 식단표</span>
          </button>
        </div>
      </section>

      {/* 5-Day Quick Selection Strip (Hidden when in weekly mode) */}
      {currentTab !== 'weekly' && (
        <section className="w-full">
          <div className="bg-white rounded-2xl p-2 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border border-blue-50 flex items-center justify-between gap-1.5">
            <button
              type="button"
              onClick={onPrevDay}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] transition-colors cursor-pointer"
              title="이전 날짜"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            {/* 5 Days (Mon - Fri) */}
            <div className="flex-1 grid grid-cols-5 gap-1 text-center">
              {weekDates.map((d, index) => {
                const kstDay = getKSTDate(d);
                const isSelected = isSameDayKST(d, selectedDate);
                const isCurrentToday = isSameDayKST(d, today);

                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => onSelectDate(d)}
                    className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl p-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#004ac6] text-white shadow-sm font-bold scale-[1.03]'
                        : isCurrentToday
                        ? 'bg-[#dce9ff] text-[#004ac6] font-semibold'
                        : 'text-[#434655] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <span className="text-[10px] leading-tight opacity-80">{dayNames[index]}</span>
                    <span className="text-[14px] font-bold leading-tight">{kstDay.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onNextDay}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] transition-colors cursor-pointer"
              title="다음 날짜"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
