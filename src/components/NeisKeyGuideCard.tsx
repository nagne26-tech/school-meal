import React, { useState } from 'react';

interface NeisKeyGuideCardProps {
  hasKey: boolean;
  source: string;
}

export const NeisKeyGuideCard: React.FC<NeisKeyGuideCardProps> = ({
  hasKey,
  source,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyVar = () => {
    navigator.clipboard.writeText('NEIS_API_KEY');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full mb-4">
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_20px_-2px_rgba(37,99,235,0.06)] border border-blue-100/60 flex flex-col gap-2.5">
        {/* Status bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[15px] ${
                hasKey ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {hasKey ? 'verified_user' : 'vpn_key'}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-[#0b1c30]">
                  {hasKey ? 'NEIS_API_KEY 서버 Secret 연동됨' : 'NEIS 공공 API 오픈 모드'}
                </span>
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    hasKey
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {hasKey ? '개인 인증키 적용' : '기본 호출 모드'}
                </span>
              </div>
              <span className="text-[11px] text-[#737686]">
                출처: {source}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-h-[32px] px-2.5 py-1 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#004ac6] text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isOpen ? '안내 닫기' : '인증키 설정 안내'}</span>
            <span
              className={`material-symbols-outlined text-[15px] transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>
        </div>

        {/* Expandable Guide */}
        {isOpen && (
          <div className="pt-2.5 border-t border-gray-100 flex flex-col gap-2.5 text-[12px] text-[#434655] animate-in fade-in duration-150">
            <div className="bg-[#eff4ff]/60 p-3 rounded-xl flex flex-col gap-1.5">
              <span className="font-bold text-[#004ac6] text-[12px]">
                🔑 AI Studio의 Settings &gt; Secrets 등록 방법
              </span>
              <p className="leading-relaxed">
                나이스 교육정보 개방 포털(open.neis.go.kr)에서 발급받은 인증키를 서버 환경변수{' '}
                <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-mono font-bold border border-blue-200">
                  NEIS_API_KEY
                </code>
                에 등록하면 대량 및 실시간 조회가 제한 없이 안정적으로 이루어집니다.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleCopyVar}
                  className="min-h-[32px] px-2.5 py-1 bg-white border border-blue-200 hover:bg-blue-50 text-[#004ac6] font-bold rounded-lg flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? '복사 완료!' : '변수명 복사 (NEIS_API_KEY)'}</span>
                </button>

                <a
                  href="https://open.neis.go.kr"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="min-h-[32px] px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-[#434655] font-semibold rounded-lg flex items-center gap-1 text-[11px]"
                >
                  <span>나이스 포털 열기</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>

            <ol className="list-decimal list-inside space-y-1 text-[#434655] px-1 text-[11px] leading-relaxed">
              <li>화면 우측 상단/사이드바의 <b>Settings</b> 메뉴를 엽니다.</li>
              <li><b>Secrets</b> 탭에서 새 환경변수를 추가합니다.</li>
              <li>Secret Name에 <code>NEIS_API_KEY</code>, Value에 발급받은 인증키를 입력합니다.</li>
              <li>외부 API는 브라우저에 인증키를 노출하지 않고 안전하게 프록시 서버에서 호출됩니다.</li>
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};
