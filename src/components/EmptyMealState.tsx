import React from 'react';

interface EmptyMealStateProps {
  status: 'no_data' | 'connection_error';
  isWeekend?: boolean;
  scheduleEvent?: string;
  dayType?: string;
  errorMessage?: string;
  onJumpToday: () => void;
  onJumpNextWeekday: () => void;
  onRetry: () => void;
}

export const EmptyMealState: React.FC<EmptyMealStateProps> = ({
  status,
  isWeekend,
  scheduleEvent,
  dayType,
  errorMessage,
  onJumpToday,
  onJumpNextWeekday,
  onRetry,
}) => {
  if (status === 'connection_error') {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border border-rose-100 flex flex-col items-center text-center gap-4 my-3">
        <div className="w-18 h-18 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[38px]">cloud_off</span>
        </div>

        <div className="flex flex-col gap-1.5 max-w-sm">
          <h3 className="text-[19px] text-[#0b1c30] font-bold tracking-tight">
            나이스(NEIS) 서버 연결 실패
          </h3>
          <p className="text-[13px] text-[#434655] leading-relaxed">
            {errorMessage ||
              '교육부 나이스 교육정보 개방포털 서버와 통신할 수 없습니다. 일시적인 서비스 점검이거나 네트워크 지연일 수 있습니다.'}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onRetry}
            className="min-h-[42px] px-5 py-2 bg-[#004ac6] text-white font-semibold text-[13px] rounded-xl shadow-xs transition-all hover:bg-[#003ea8] active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>다시 시도</span>
          </button>
        </div>
      </div>
    );
  }

  // Determine accurate reason text without blindly assuming it is a holiday
  let title = '급식 정보가 등록되지 않았습니다';
  let description =
    '방학, 학교 행사, 또는 해당 일자의 식단이 나이스 포털에 아직 등록되지 않은 상태입니다. (자료가 없다고 휴교일로 단정할 수 없습니다)';
  let icon = 'restaurant_menu';

  if (scheduleEvent) {
    title = `학사일정: ${scheduleEvent}`;
    description = `해당 일자는 '${scheduleEvent}' (${dayType || '학사일정'})으로 인해 급식 식단이 등록되지 않았습니다.`;
    icon = 'event_busy';
  } else if (isWeekend) {
    title = '주말 급식 미제공';
    description =
      '토요일/일요일은 학교 급식이 운영되지 않는 주말입니다. 가족과 함께 꿀맛 같은 휴식을 즐기세요!';
    icon = 'bedtime';
  }

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border border-blue-50 flex flex-col items-center text-center gap-5 my-3">
      {/* Icon Circle */}
      <div className="w-20 h-20 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#004ac6] shadow-xs">
        <span className="material-symbols-outlined text-[42px] leading-none">{icon}</span>
      </div>

      {/* Description Text */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-[20px] text-[#0b1c30] font-bold tracking-tight">{title}</h3>
        <p className="text-[13px] text-[#434655] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap justify-center pt-1">
        <button
          type="button"
          onClick={onJumpToday}
          className="min-h-[44px] px-5 py-2.5 bg-[#004ac6] text-white font-semibold text-[13px] rounded-xl shadow-xs transition-all hover:bg-[#003ea8] active:scale-95 cursor-pointer"
        >
          오늘 날짜로 이동
        </button>

        <button
          type="button"
          onClick={onJumpNextWeekday}
          className="min-h-[44px] px-5 py-2.5 bg-[#eff4ff] text-[#004ac6] font-semibold text-[13px] rounded-xl transition-all hover:bg-[#e5eeff] active:scale-95 cursor-pointer"
        >
          다음 평일 식단
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="min-h-[44px] px-3.5 py-2.5 bg-gray-100 text-[#434655] hover:text-[#0b1c30] font-semibold text-[13px] rounded-xl transition-all hover:bg-gray-200 active:scale-95 cursor-pointer flex items-center gap-1"
          title="식단 새로고침"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>새로고침</span>
        </button>
      </div>
    </div>
  );
};
