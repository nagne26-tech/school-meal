import React from 'react';
import { AcademicScheduleItem } from '../types';

interface ScheduleCardProps {
  schedules: AcademicScheduleItem[];
  loading: boolean;
  schoolName: string;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedules,
  loading,
  schoolName,
}) => {
  return (
    <section className="w-full mb-4">
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border border-blue-50 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#004ac6]">
              <span className="material-symbols-outlined text-[18px]">event_note</span>
            </div>
            <div>
              <h3 className="text-[14px] text-[#0b1c30] font-bold">이번 주 학사일정</h3>
              <p className="text-[11px] text-[#737686]">
                {schoolName} · NEIS SchoolSchedule 연계
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#004ac6] bg-[#eff4ff] px-2 py-0.5 rounded-full">
            공식 학사일정
          </span>
        </div>

        {loading ? (
          <div className="py-3 flex items-center justify-center gap-2 text-[12px] text-[#737686]">
            <span className="w-4 h-4 border-2 border-[#004ac6] border-t-transparent rounded-full animate-spin"></span>
            <span>나이스 학사일정 조회 중...</span>
          </div>
        ) : schedules.length > 0 ? (
          <div className="flex flex-col gap-1.5 pt-1">
            {schedules.map((item, idx) => {
              const formattedDate =
                item.date.length === 8
                  ? `${parseInt(item.date.slice(4, 6), 10)}월 ${parseInt(item.date.slice(6, 8), 10)}일`
                  : item.date;

              const isHoliday = item.dayType === '휴업일' || item.dayType === '공휴일';

              return (
                <div
                  key={`${item.date}-${idx}`}
                  className={`p-2.5 rounded-xl flex items-center justify-between gap-2 text-[12px] ${
                    isHoliday
                      ? 'bg-amber-50/80 border border-amber-200/60'
                      : 'bg-[#eff4ff]/60 hover:bg-[#eff4ff]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#004ac6] shrink-0">{formattedDate}</span>
                    <span className="font-semibold text-[#0b1c30] truncate">
                      {item.eventName}
                    </span>
                    {item.content && (
                      <span className="text-[11px] text-[#737686] hidden sm:inline truncate">
                        ({item.content})
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                      isHoliday
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-white text-[#434655] shadow-xs'
                    }`}
                  >
                    {item.dayType || '일정'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-2 text-[12px] text-[#737686] bg-[#eff4ff]/40 rounded-xl px-3 text-center">
            이번 주 등록된 특별 학사일정(시험, 휴업일 등)이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};
