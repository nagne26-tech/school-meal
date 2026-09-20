import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="w-full mb-4">
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#004ac6] to-[#2563eb] p-4 sm:p-5 text-white shadow-[0_8px_24px_rgba(37,99,235,0.18)]">
        {/* Background geometric decorative pattern */}
        <div className="absolute right-[-15px] bottom-[-20px] w-40 h-40 opacity-15 pointer-events-none">
          <svg fill="currentColor" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="45"
              stroke="currentColor"
              strokeDasharray="8 6"
              strokeWidth="8"
            ></circle>
            <path
              d="M30 40 Q50 65 70 40"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="6"
            ></path>
          </svg>
        </div>

        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="flex flex-col gap-1 max-w-[72%]">
            <div className="inline-flex items-center gap-1 text-[#ffdbca] text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">arrow_back_ios_new</span>
              <span>영양 가득 안심 식단</span>
            </div>
            <div className="text-[17px] sm:text-[19px] font-bold tracking-tight leading-tight">
              오늘도 건강하고 맛있는 한 끼!
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#dbe1ff] opacity-90 line-clamp-1">
              원산지 안심 표시제 준수 · HACCP 위생 인증 기준 식단
            </p>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md shrink-0 bg-white/20 flex items-center justify-center backdrop-blur-sm p-0.5 border border-white/20">
            <img
              className="w-full h-full object-cover rounded-xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjCs0q2G0TIA8CGhpfYOkJW3uwwX5FnQAzSY5vOi_ouuRH6zlF3rP7fkgZNXUzJ6AfA1TgNyucE5L6Wm2t59kQbPX8YLNl77cO1zkkOeSMx2hOopxscSelDJD_mzpPy1GbSYiTWrjbCpiwkZ5fdp6l_Eon3UpCI20puQjs6wac4CnFR8OXQFIspyHDl0lBQQ6hQ8yddV1xODUkvZiWbHhSZc57l2xhytwKJ1rf0FSrsEDAA445b0qJuw"
              alt="맛있는 학교 급식 식판"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
