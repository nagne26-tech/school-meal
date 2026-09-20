import React from 'react';
import { MealType, MealData, AcademicScheduleItem } from '../types';
import { getKSTDate } from '../services/neisService';

interface WeeklyMealViewProps {
  weekDates: Date[];
  weekMealsMap: Record<string, MealData>;
  schedules: AcademicScheduleItem[];
  mealType: MealType;
  loading: boolean;
  onSelectDay: (date: Date) => void;
  source: string;
}

export const WeeklyMealView: React.FC<WeeklyMealViewProps> = ({
  weekDates,
  weekMealsMap,
  schedules,
  mealType,
  loading,
  onSelectDay,
  source,
}) => {
  const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일'];

  const mealLabel =
    mealType === 'breakfast' ? '조식' : mealType === 'dinner' ? '석식' : '중식';

  return (
    <section className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[22px]">
            date_range
          </span>
          <h2 className="text-[17px] text-[#0b1c30] font-bold">이번 주 주간 식단</h2>
        </div>
        <span className="text-[11px] font-medium text-[#737686]">
          출처: {source}
        </span>
      </div>

      {loading ? (
        <div className="py-12 bg-white rounded-2xl border border-blue-50 flex flex-col items-center justify-center gap-3 text-[#004ac6]">
          <span className="w-6 h-6 border-2 border-[#004ac6] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-[13px] font-semibold">
            나이스(NEIS) 주간 식단표를 불러오는 중입니다...
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {weekDates.map((date, idx) => {
            const kst = getKSTDate(date);
            const ymd = `${kst.getFullYear()}${String(kst.getMonth() + 1).padStart(2, '0')}${String(
              kst.getDate()
            ).padStart(2, '0')}`;

            const meal = weekMealsMap[ymd];
            const month = kst.getMonth() + 1;
            const day = kst.getDate();

            // Check if there is an academic schedule on this date
            const daySchedule = schedules.find((s) => s.date === ymd);

            const hasDishes = meal && meal.dishes && meal.dishes.length > 0;

            const dishSummary = hasDishes
              ? meal.dishes.map((d) => d.name).slice(0, 5).join(', ') +
                (meal.dishes.length > 5 ? ` 외 ${meal.dishes.length - 5}종` : '')
              : null;

            return (
              <div
                key={ymd}
                className={`bg-white p-4 rounded-2xl shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border transition-all ${
                  hasDishes ? 'border-blue-50 hover:border-blue-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#0b1c30]">
                      {month}월 {day}일 ({dayNames[idx]})
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#004ac6] text-[11px] font-bold">
                      {mealLabel}
                    </span>
                    {daySchedule && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {daySchedule.eventName}
                      </span>
                    )}
                  </div>

                  {hasDishes && meal.nutrition?.calories && (
                    <span className="text-[12px] text-[#8e3c00] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[15px]">
                        local_fire_department
                      </span>
                      <span>{meal.nutrition.calories}</span>
                    </span>
                  )}
                </div>

                {hasDishes ? (
                  <>
                    <p className="text-[13px] text-[#434655] line-clamp-2 leading-relaxed mt-1.5">
                      {dishSummary}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectDay(date)}
                        className="min-h-[34px] px-3 py-1 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#004ac6] rounded-xl text-[12px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>상세 식판 보기</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-2 mt-1 text-[12px] text-[#737686] flex items-center justify-between">
                    <span>
                      {daySchedule
                        ? `학사일정(${daySchedule.eventName})으로 급식 미등록 상태입니다.`
                        : '등록된 급식 정보가 없습니다. (방학/휴업 또는 식단 미등록)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectDay(date)}
                      className="text-[11px] text-[#004ac6] font-semibold hover:underline cursor-pointer"
                    >
                      해당일 확인
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
