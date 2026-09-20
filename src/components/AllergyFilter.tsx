import React from 'react';
import { COMMON_QUICK_ALLERGENS } from '../data/constants';

interface AllergyFilterProps {
  selectedAllergens: Set<number>;
  onToggleAllergen: (allergenId: number) => void;
}

export const AllergyFilter: React.FC<AllergyFilterProps> = ({
  selectedAllergens,
  onToggleAllergen,
}) => {
  return (
    <section className="w-full mb-4">
      <div className="bg-[#eff4ff] rounded-2xl p-3 flex flex-col gap-2 border border-blue-100/40">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#8e3c00] text-[18px]">
              shield_person
            </span>
            <span className="text-[13px] font-bold text-[#0b1c30]">내 알레르기 강조 표시</span>
          </div>
          <span className="text-[11px] font-medium text-[#434655]">선택된 항목 빨간색 경고</span>
        </div>

        {/* Quick Allergy Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {COMMON_QUICK_ALLERGENS.map((item) => {
            const isSelected = selectedAllergens.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleAllergen(item.id)}
                className={`shrink-0 min-h-[40px] px-3.5 py-1 rounded-full text-[12px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-[#004ac6] text-white font-bold shadow-xs'
                    : 'bg-white text-[#434655] hover:bg-white/80 hover:text-[#0b1c30] shadow-xs'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
