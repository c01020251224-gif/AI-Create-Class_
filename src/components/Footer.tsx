import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 px-6 border-t border-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-12 border-b border-stone-800">
          <div className="max-w-md">
            <span className="font-serif-kr text-2xl font-bold text-stone-100 tracking-tight block mb-3">
              여행플래너
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              흔한 관광 정보가 아닌 시선을 사로잡는 장소의 디테일에서 시작해,
              부모님·아이·식이제한 등 내 상황에 꼭 맞춘 디테일 일정표를 완성하는 맞춤형 여행 플랫폼입니다.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <span className="text-stone-200 font-semibold block mb-3">탐색</span>
              <ul className="space-y-2">
                <li><a href="#destinations" className="hover:text-stone-200 transition-colors">대륙별 여행지</a></li>
                <li><a href="#festivals" className="hover:text-stone-200 transition-colors">세계 축제 캘린더</a></li>
                <li><a href="#cuisines" className="hover:text-stone-200 transition-colors">세계 미식 문화</a></li>
              </ul>
            </div>

            <div>
              <span className="text-stone-200 font-semibold block mb-3">서비스</span>
              <ul className="space-y-2">
                <li><a href="#planner" className="hover:text-stone-200 transition-colors">AI 맞춤 플래너</a></li>
                <li><a href="#contact" className="hover:text-stone-200 transition-colors">1:1 프라이빗 컨설팅</a></li>
                <li><a href="#contact" className="hover:text-stone-200 transition-colors">단체 및 효도여행 대절</a></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-stone-200 font-semibold block mb-3">고객센터</span>
              <p className="space-y-1 text-stone-400">
                <span className="block">전화: 010-0000-1111</span>
                <span className="block">메일: contact@travelplanner.co.kr</span>
                <span className="block">운영: 평일 09:30 ~ 18:30</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 여행플래너 (Travel Planner). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#contact" className="hover:text-stone-400 transition-colors">이용약관</a>
            <a href="#contact" className="hover:text-stone-400 transition-colors">개인정보처리방침</a>
            <a href="#contact" className="hover:text-stone-400 transition-colors">여행약관 및 안전공지</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
