import React from 'react';
import { School } from '../types';

interface HeaderProps {
  school: School;
  onOpenSchoolModal: () => void;
  onOpenAllergyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  school,
  onOpenSchoolModal,
  onOpenAllergyModal,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-blue-50/50">
      <div className="h-20 max-w-4xl mx-auto px-4 flex items-center justify-between">
        {/* Left: App Logo & School Info */}
        <div className="flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1WotyPMUp8WCnv0olZz4504XO-1AiS98-nQ9EDjysKc7rjztp7lAHfuvw5v3Dlz00luaen4XrEb2yRqy-ljT3FHQ0BPEf2VBk2JAKhBz9jbwPftf92V6mc5eQnBgjDP_MvrX8MjmobVGz5DU4f0hmuBg3Zncd9TgQ7_OiKdzDRkB34fZE9HtNfReXMdOhSzeSfl773x59LUXdG1cd2XJ1ePFuRfCyotvs_IovyOM_GiekxkyDiIwJvJm9pi"
            alt="스쿨밀 로고"
            className="h-9 w-auto object-contain drop-shadow-xs"
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[19px] text-[#004ac6] tracking-tight">스쿨밀</span>
              <span className="text-[11px] text-[#434655] hidden sm:inline-block font-medium">(School Meal)</span>
              <div className="inline-flex items-center gap-1 bg-[#dce9ff] px-2 py-0.5 rounded-full ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] animate-pulse"></span>
                <span className="text-[11px] font-semibold text-[#004d6a]">급식 안내중</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[13px] font-semibold text-[#0b1c30] truncate max-w-[140px] sm:max-w-xs">
                {school.schoolName}
              </span>
              <button
                type="button"
                onClick={onOpenSchoolModal}
                className="min-h-[32px] px-1.5 py-0.5 inline-flex items-center gap-0.5 text-[#004ac6] hover:text-[#003ea8] hover:bg-blue-50 text-[11px] font-semibold rounded-md transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">edit_location</span>
                <span>학교 변경</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAllergyModal}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#eff4ff] text-[#8e3c00] hover:bg-[#e5eeff] transition-colors shadow-xs"
            title="알레르기 유발물질 안내"
          >
            <span className="material-symbols-outlined text-[20px]">warning_amber</span>
          </button>

          <button
            type="button"
            onClick={onOpenSchoolModal}
            className="w-9 h-9 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-sm hover:bg-[#003ea8] transition-colors"
            title="사용자 설정"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
