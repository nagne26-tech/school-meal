import React from 'react';
import { School, MealType } from '../types';
import { formatKSTDisplayDate } from '../services/neisService';

interface SchoolCardProps {
  school: School;
  selectedDate: Date;
  mealType: MealType;
  onSelectMealType: (type: MealType) => void;
  onOpenSchoolModal: () => void;
  source: string;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  selectedDate,
  mealType,
  onSelectMealType,
  onOpenSchoolModal,
  source,
}) => {
  const mealLabel =
    mealType === 'breakfast'
      ? '조식(아침)'
      : mealType === 'dinner'
      ? '석식(저녁)'
      : '중식(점심)';

  const mealIcon =
    mealType === 'breakfast'
      ? 'sunny'
      : mealType === 'dinner'
      ? 'nightlight'
      : 'soup_kitchen';

  return (
    <section className="w-full mb-4">
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06),0_2px_6px_-1px_rgba(15,23,42,0.04)] border border-blue-50 flex flex-col gap-3">
        {/* Top Badges and Settings Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#004ac6] text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-ping"></span>
              <span>{school.officeName}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#004d6a] text-[11px] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">{mealIcon}</span>
              <span>{mealLabel} 정규 식단</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenSchoolModal}
            className="min-h-[36px] px-3 py-1.5 inline-flex items-center gap-1 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#004ac6] rounded-xl text-[13px] font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>학교 설정</span>
          </button>
        </div>

        {/* School Name, Date, and Meal Switcher */}
        <div className="flex items-end justify-between pt-1 flex-wrap gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-[22px] sm:text-[24px] text-[#0b1c30] font-bold tracking-tight">
                {school.schoolName}
              </h1>
              <span
                className="material-symbols-outlined text-[#004ac6] text-[20px]"
                title="NEIS 공공데이터 인증"
              >
                verified
              </span>
              {school.region && (
                <span className="text-[11px] text-[#737686] bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {school.region}
                </span>
              )}
            </div>

            <p className="text-[13px] text-[#434655] flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="material-symbols-outlined text-[#737686] text-[16px]">
                calendar_month
              </span>
              <span>{formatKSTDisplayDate(selectedDate)} (KST)</span>
            </p>
            <span className="text-[10px] text-[#737686] mt-0.5">
              출처: {source} (코드: {school.schoolCode})
            </span>
          </div>

          {/* Meal Switcher: 조식 / 중식 / 석식 */}
          <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-blue-100/50">
            <button
              type="button"
              onClick={() => onSelectMealType('lunch')}
              className={`min-h-[38px] px-3 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                mealType === 'lunch'
                  ? 'bg-[#004ac6] text-white shadow-sm font-bold'
                  : 'text-[#434655] hover:text-[#0b1c30] hover:bg-white/60'
              }`}
            >
              <span>중식</span>
              <span>🍱</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectMealType('dinner')}
              className={`min-h-[38px] px-3 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                mealType === 'dinner'
                  ? 'bg-[#004ac6] text-white shadow-sm font-bold'
                  : 'text-[#434655] hover:text-[#0b1c30] hover:bg-white/60'
              }`}
            >
              <span>석식</span>
              <span>🌙</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectMealType('breakfast')}
              className={`min-h-[38px] px-2.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                mealType === 'breakfast'
                  ? 'bg-[#004ac6] text-white shadow-sm font-bold'
                  : 'text-[#434655] hover:text-[#0b1c30] hover:bg-white/60'
              }`}
            >
              <span>조식</span>
              <span>🍳</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
