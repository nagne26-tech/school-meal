import React, { useState, useEffect } from 'react';
import { School } from '../types';
import { SCHOOL_PRESETS } from '../data/constants';
import { searchSchools } from '../services/neisService';

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchool: School;
  onSelectSchool: (school: School) => void;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  currentSchool,
  onSelectSchool,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'success' | 'no_data' | 'connection_error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setSearchStatus('idle');
      return;
    }
  }, [isOpen]);

  // Debounced real-time NEIS schoolInfo search
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchStatus('idle');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      const res = await searchSchools(trimmed);
      setIsSearching(false);
      setSearchStatus(res.status);
      setStatusMessage(res.message || '');
      setSearchResults(res.schools || []);
    }, 380);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 flex flex-col max-h-[85vh] border border-blue-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[24px]">school</span>
            <div className="flex flex-col">
              <h2 className="text-[17px] text-[#0b1c30] font-bold">학교 검색 및 설정</h2>
              <span className="text-[11px] text-[#737686]">나이스(NEIS) schoolInfo 실시간 검색</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-[#737686] hover:text-[#0b1c30] hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-[#434655] mt-2 mb-3">
          전국 초·중·고등학교 이름을 검색해 지정하면 해당 학교의 NEIS 급식 식단표가 연동됩니다.
        </p>

        {/* Search Field */}
        <div className="relative mb-3">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="학교명 입력 (예: 서울고, 세종고, 경기고, 대전여고)"
            className="w-full pl-10 pr-10 py-2.5 bg-[#eff4ff] rounded-xl text-[14px] text-[#0b1c30] placeholder:text-[#737686] outline-none focus:ring-2 focus:ring-[#004ac6]/30 transition-all"
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#0b1c30] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* School List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 py-1 pr-1 max-h-[380px]">
          {isSearching ? (
            <div className="py-10 flex flex-col items-center justify-center gap-2 text-[#004ac6] text-[13px]">
              <span className="w-5 h-5 border-2 border-[#004ac6] border-t-transparent rounded-full animate-spin"></span>
              <span>나이스 포털에서 학교 정보를 조회 중입니다...</span>
            </div>
          ) : searchTerm.trim() ? (
            searchStatus === 'connection_error' ? (
              <div className="py-8 px-3 text-center flex flex-col items-center gap-2 text-rose-600 text-[13px] bg-rose-50 rounded-xl">
                <span className="material-symbols-outlined text-[24px]">cloud_off</span>
                <span className="font-semibold">{statusMessage}</span>
                <span className="text-[11px] text-gray-500">잠시 후 다시 검색해주세요.</span>
              </div>
            ) : searchStatus === 'no_data' || searchResults.length === 0 ? (
              <div className="py-8 text-center text-[#737686] text-[13px]">
                '{searchTerm}'에 대한 검색 결과가 없습니다. 정확한 학교명을 입력해주세요.
              </div>
            ) : (
              searchResults.map((s) => {
                const isCurrent = s.schoolCode === currentSchool.schoolCode;

                return (
                  <button
                    key={`${s.officeCode}-${s.schoolCode}`}
                    type="button"
                    onClick={() => {
                      onSelectSchool(s);
                      onClose();
                    }}
                    className={`w-full p-3 text-left rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                      isCurrent
                        ? 'bg-[#eff4ff] border-blue-300'
                        : 'hover:bg-[#eff4ff]/60 border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] text-[#0b1c30] font-bold truncate">
                          {s.schoolName}
                        </span>
                        {s.schoolKind && (
                          <span className="px-1.5 py-0.2 bg-[#dce9ff] text-[#004d6a] rounded text-[10px] font-semibold">
                            {s.schoolKind}
                          </span>
                        )}
                        {s.region && (
                          <span className="px-1.5 py-0.2 bg-gray-100 text-[#434655] rounded text-[10px] font-medium">
                            {s.region}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#737686] mt-0.5 truncate">
                        {s.officeName} · {s.address}
                      </span>
                    </div>

                    <span
                      className={`material-symbols-outlined text-[20px] shrink-0 ${
                        isCurrent ? 'text-[#004ac6]' : 'text-gray-300'
                      }`}
                    >
                      {isCurrent ? 'check_circle' : 'add_circle'}
                    </span>
                  </button>
                );
              })
            )
          ) : (
            <>
              <div className="text-[11px] font-semibold text-[#737686] px-1 pb-1">
                추천 및 주요 프리셋 학교 (직접 검색도 가능)
              </div>
              {SCHOOL_PRESETS.map((s) => {
                const isCurrent = s.schoolCode === currentSchool.schoolCode;

                return (
                  <button
                    key={s.schoolCode}
                    type="button"
                    onClick={() => {
                      onSelectSchool(s);
                      onClose();
                    }}
                    className={`w-full p-3 text-left rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                      isCurrent
                        ? 'bg-[#eff4ff] border-blue-300'
                        : 'hover:bg-[#eff4ff]/50 border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] text-[#0b1c30] font-bold truncate">
                          {s.schoolName}
                        </span>
                        {s.region && (
                          <span className="px-1.5 py-0.2 bg-[#dce9ff] text-[#004d6a] rounded text-[10px] font-semibold">
                            {s.region}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#737686] mt-0.5 truncate">
                        {s.officeName} · {s.address}
                      </span>
                    </div>

                    <span
                      className={`material-symbols-outlined text-[20px] shrink-0 ${
                        isCurrent ? 'text-[#004ac6]' : 'text-gray-300'
                      }`}
                    >
                      {isCurrent ? 'check_circle' : 'chevron_right'}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 bg-[#004ac6] text-white rounded-xl text-[14px] font-bold flex items-center justify-center shadow-xs hover:bg-[#003ea8] transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
