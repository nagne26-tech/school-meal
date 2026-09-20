import React, { useState } from 'react';
import { MealData } from '../types';
import { ALLERGEN_MAP } from '../data/constants';

interface MealDetailViewProps {
  meal: MealData;
  selectedAllergens: Set<number>;
}

export const MealDetailView: React.FC<MealDetailViewProps> = ({
  meal,
  selectedAllergens,
}) => {
  const [showNutrDetails, setShowNutrDetails] = useState(false);

  // Pick appropriate icon for each dish
  const getDishIcon = (name: string) => {
    if (name.includes('밥')) return 'rice_bowl';
    if (name.includes('국') || name.includes('탕') || name.includes('찌개')) return 'ramen_dining';
    if (name.includes('김치') || name.includes('깍두기') || name.includes('무침')) return 'eco';
    if (name.includes('가스') || name.includes('스테이크') || name.includes('구이') || name.includes('찜') || name.includes('볶음') || name.includes('돈까스'))
      return 'kebab_dining';
    if (name.includes('우유') || name.includes('요거트') || name.includes('음료') || name.includes('식혜')) return 'local_cafe';
    if (name.includes('사과') || name.includes('과일') || name.includes('샐러드') || name.includes('키위') || name.includes('바나나'))
      return 'nutrition';
    return 'restaurant';
  };

  return (
    <section className="w-full flex flex-col gap-4">
      {/* 1. Calories & Macros Bento Card */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border border-blue-50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ffdbca] flex items-center justify-center text-[#8e3c00]">
              <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
            </div>
            <div>
              <div className="text-[11px] text-[#737686] font-semibold">총 열량 및 권장량</div>
              <div className="text-[20px] text-[#0b1c30] font-bold tracking-tight">
                {meal.nutrition.calories}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNutrDetails(!showNutrDetails)}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#eff4ff] text-[#004ac6] text-[13px] font-semibold flex items-center gap-1 hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span>영양성분 상세</span>
            <span
              className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                showNutrDetails ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>
        </div>

        {/* Macro visual distribution bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-[#434655] font-medium">
            <span>
              탄수화물 <b className="text-[#0b1c30] font-bold">{meal.nutrition.carb}</b>
            </span>
            <span>
              단백질 <b className="text-[#0b1c30] font-bold">{meal.nutrition.protein}</b>
            </span>
            <span>
              지방 <b className="text-[#0b1c30] font-bold">{meal.nutrition.fat}</b>
            </span>
          </div>
          <div className="w-full h-3 bg-[#dce9ff] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#004ac6]"
              style={{ width: `${meal.nutrition.carbPercent}%` }}
              title="탄수화물 비율"
            ></div>
            <div
              className="h-full bg-[#40c2fd]"
              style={{ width: `${meal.nutrition.proteinPercent}%` }}
              title="단백질 비율"
            ></div>
            <div
              className="h-full bg-[#ffb690]"
              style={{ width: `${meal.nutrition.fatPercent}%` }}
              title="지방 비율"
            ></div>
          </div>
        </div>

        {/* Collapsible detailed nutrition grid */}
        {showNutrDetails && (
          <div className="pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#eff4ff] p-3 rounded-xl text-[11px]">
              <div className="p-2 bg-white rounded-lg flex flex-col shadow-xs">
                <span className="text-[#737686]">탄수화물</span>
                <span className="font-bold text-[#0b1c30] text-[13px]">{meal.nutrition.carb}</span>
              </div>
              <div className="p-2 bg-white rounded-lg flex flex-col shadow-xs">
                <span className="text-[#737686]">단백질</span>
                <span className="font-bold text-[#0b1c30] text-[13px]">{meal.nutrition.protein}</span>
              </div>
              <div className="p-2 bg-white rounded-lg flex flex-col shadow-xs">
                <span className="text-[#737686]">지방</span>
                <span className="font-bold text-[#0b1c30] text-[13px]">{meal.nutrition.fat}</span>
              </div>
              <div className="p-2 bg-white rounded-lg flex flex-col shadow-xs">
                <span className="text-[#737686]">식이섬유</span>
                <span className="font-bold text-[#0b1c30] text-[13px]">{meal.nutrition.fiber || '8.2 g'}</span>
              </div>
              <div className="p-2 bg-white rounded-lg flex flex-col shadow-xs">
                <span className="text-[#737686]">칼슘(Ca)</span>
                <span className="font-bold text-[#0b1c30] text-[13px]">{meal.nutrition.calcium || '380 mg'}</span>
              </div>
              <div className="p-2 bg-white rounded-lg flex flex-col shadow-xs">
                <span className="text-[#737686]">철분(Fe)</span>
                <span className="font-bold text-[#0b1c30] text-[13px]">{meal.nutrition.iron || '4.5 mg'}</span>
              </div>
              <div className="p-2 bg-white rounded-lg flex flex-col shadow-xs">
                <span className="text-[#737686]">비타민A</span>
                <span className="font-bold text-[#0b1c30] text-[13px]">{meal.nutrition.vitaminA || '320 R.E'}</span>
              </div>
              <div className="p-2 bg-white rounded-lg flex flex-col shadow-xs">
                <span className="text-[#737686]">비타민C</span>
                <span className="font-bold text-[#0b1c30] text-[13px]">{meal.nutrition.vitaminC || '18.4 mg'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Dish Items Plate Container */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border border-blue-50 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">lunch_dining</span>
            <h2 className="text-[17px] text-[#0b1c30] font-bold">오늘의 식판 차림표</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[11px] font-bold text-[#004d6a]">
            {meal.dishes.length}가지 구성
          </span>
        </div>

        {/* Dish cards */}
        <div className="flex flex-col gap-2.5">
          {meal.dishes.map((dish, idx) => {
            const hasAlert = dish.allergens.some((a) => selectedAllergens.has(a));

            return (
              <div
                key={`${dish.name}-${idx}`}
                className={`p-3 rounded-xl flex items-center justify-between gap-3 transition-all ${
                  hasAlert
                    ? 'bg-rose-50/70 border border-rose-200/80 hover:bg-rose-50'
                    : 'bg-[#eff4ff]/60 hover:bg-[#eff4ff] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${
                      hasAlert ? 'bg-white text-rose-600' : 'bg-white text-[#004ac6]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      {getDishIcon(dish.name)}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-bold text-[#0b1c30] truncate">
                      {dish.name}
                    </span>
                    <div className="flex items-center gap-1 flex-wrap mt-0.5">
                      {dish.allergens.length > 0 ? (
                        dish.allergens.map((num) => {
                          const isWarn = selectedAllergens.has(num);
                          const allergenName = ALLERGEN_MAP[num] || `${num}번`;
                          if (isWarn) {
                            return (
                              <span
                                key={num}
                                className="px-1.5 py-0.5 rounded-md bg-[#ffdad6] text-[#93000a] text-[11px] font-bold inline-flex items-center gap-0.5 animate-pulse"
                                title={`주의: ${allergenName}`}
                              >
                                <span>⚠️</span>
                                <span>{allergenName}</span>
                              </span>
                            );
                          }
                          return (
                            <span
                              key={num}
                              className="px-1.5 py-0.5 rounded-md bg-white text-[#434655] text-[10px] font-medium shadow-xs"
                              title={allergenName}
                            >
                              {allergenName}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[11px] text-[#737686]">알레르기 없음</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="text-[12px] font-bold text-[#737686]">#{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Origin Info Card */}
      <div className="bg-[#eff4ff] rounded-2xl p-4 flex flex-col gap-1.5 text-[#0b1c30] border border-blue-100/40">
        <div className="flex items-center gap-1.5 text-[13px] text-[#004ac6] font-bold">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>주요 식재료 원산지 정보</span>
        </div>
        <p className="text-[13px] text-[#434655] leading-relaxed">
          {meal.originInfo ||
            '쌀(국내산), 쇠고기(한우), 돼지고기(국내산 1등급), 닭고기(국내산 무항생제), 김치(국내산 배추, 고춧가루)'}
        </p>
      </div>
    </section>
  );
};
