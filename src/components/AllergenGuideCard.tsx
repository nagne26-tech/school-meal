import React, { useState } from 'react';
import { ALLERGEN_MAP } from '../data/constants';

interface AllergenGuideCardProps {
  selectedAllergens: Set<number>;
  onToggleAllergen: (id: number) => void;
}

export const AllergenGuideCard: React.FC<AllergenGuideCardProps> = ({
  selectedAllergens,
  onToggleAllergen,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="w-full mt-2">
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border border-blue-50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#004ac6]">
              <span className="material-symbols-outlined text-[20px]">medical_services</span>
            </div>
            <div>
              <h3 className="text-[15px] text-[#0b1c30] font-bold">식약처 19종 알레르기 번호표</h3>
              <p className="text-[11px] text-[#434655]">식단 번호와 일치하는 유발물질 안내</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="min-h-[36px] px-3.5 py-1 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#004ac6] rounded-xl text-[12px] font-bold transition-colors cursor-pointer"
          >
            {isExpanded ? '닫기' : '보기'}
          </button>
        </div>

        {isExpanded && (
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <p className="text-[11px] text-[#737686]">
              터치하여 관심 알레르기를 등록하거나 해제할 수 있습니다.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Array.from({ length: 19 }, (_, i) => i + 1).map((id) => {
                const isSelected = selectedAllergens.has(id);
                const name = ALLERGEN_MAP[id];

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onToggleAllergen(id)}
                    className={`p-2.5 rounded-xl text-left text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ffdad6] text-[#93000a] font-bold border border-rose-300'
                        : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <span>
                      {id}. {name}
                    </span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'check_circle' : 'add_circle'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
