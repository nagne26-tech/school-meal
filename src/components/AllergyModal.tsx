import React from 'react';
import { ALLERGEN_MAP } from '../data/constants';

interface AllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergens: Set<number>;
  onToggleAllergen: (id: number) => void;
}

export const AllergyModal: React.FC<AllergyModalProps> = ({
  isOpen,
  onClose,
  selectedAllergens,
  onToggleAllergen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-5 flex flex-col max-h-[85vh] border border-blue-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8e3c00] text-[24px]">info</span>
            <h2 className="text-[17px] text-[#0b1c30] font-bold">식약처 알레르기 유발물질</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-[#737686] hover:text-[#0b1c30] rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-[#434655] mt-2 mb-3">
          식단표 숫자 번호는 아래 원재료 알레르기 번호입니다. 터치하여 내 알레르기 경고를 설정하세요.
        </p>

        {/* 19 Allergens grid */}
        <div className="grid grid-cols-2 gap-2 text-[12px] max-h-[380px] overflow-y-auto pr-1 py-1">
          {Array.from({ length: 19 }, (_, i) => i + 1).map((id) => {
            const isSelected = selectedAllergens.has(id);
            const name = ALLERGEN_MAP[id];

            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleAllergen(id)}
                className={`p-2.5 rounded-xl text-left font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#ffdad6] text-[#93000a] font-bold border border-rose-300'
                    : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                }`}
              >
                <span>
                  {id}. {name}
                </span>
                <span className="material-symbols-outlined text-[16px]">
                  {isSelected ? 'check_circle' : 'add'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-gray-100 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 bg-[#004ac6] text-white rounded-xl text-[14px] font-bold flex items-center justify-center shadow-xs hover:bg-[#003ea8] transition-colors cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
