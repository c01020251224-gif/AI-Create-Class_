import React from 'react';
import { ArrowDown, Compass, ShieldCheck, HeartHandshake, Utensils } from 'lucide-react';
import { HERO_IMAGE } from '../data/travelData';

interface HeroProps {
  onStartPlanning: () => void;
  onExploreDestinations: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartPlanning,
  onExploreDestinations,
}) => {
  return (
    <section id="hero" className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden">
      {/* Background Hero Image with natural warm scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="우유니 소금사막의 새벽 일출 반영"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-100 transform transition-transform duration-1000 ease-out"
        />
        {/* Measured editorial scrim to ensure contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/40 to-stone-950/30" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-16 w-full flex-1 flex flex-col justify-end">
        <div className="max-w-3xl">
          {/* Quiet text kicker with typographic separator */}
          <div className="flex items-center gap-3 text-xs md:text-sm font-medium tracking-widest text-stone-300 uppercase mb-4">
            <span>Salar de Uyuni</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>새벽 5시 20분</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>소금사막 위로 해가 번지는 15분</span>
          </div>

          {/* Large Serif Title */}
          <h1 className="font-serif-kr text-3xl sm:text-5xl lg:text-6xl text-stone-50 font-normal leading-[1.3] tracking-tight mb-6 break-keep">
            가보고 싶어지는 그 한 장면에서,<br />
            당신의 여행 일정이 시작됩니다.
          </h1>

          {/* Value proposition with natural Korean phrase breaks */}
          <p className="text-base sm:text-lg text-stone-200/90 font-normal leading-relaxed max-w-2xl mb-10 break-keep">
            넘쳐나는 관광 정보 대신, 시선을 사로잡는 장소의 디테일로부터 출발합니다.<br className="hidden sm:inline" />
            어르신의 보행 거리와 아이의 낮잠 시간, 알러지와 식이 제한까지<br className="hidden sm:inline" />
            세심하게 반영된 실행 가능한 일정을 단 한 번에 구성해 드립니다.
          </p>

          {/* Primary Action Row */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartPlanning}
              className="px-7 py-3.5 text-sm font-semibold tracking-wide text-stone-900 bg-[#E8E2D2] hover:bg-[#F2ECE0] active:scale-[0.98] transition-all rounded-md shadow-md cursor-pointer whitespace-nowrap shrink-0"
            >
              내 상황에 맞는 일정 만들기
            </button>
            <button
              onClick={onExploreDestinations}
              className="px-6 py-3.5 text-sm font-medium text-stone-200 hover:text-white border border-stone-400/40 hover:border-stone-200 active:scale-[0.98] transition-all rounded-md cursor-pointer whitespace-nowrap shrink-0"
            >
              세계 여행지 둘러보기
            </button>
          </div>
        </div>

        {/* Adjacent Proof / Features strip */}
        <div className="mt-16 pt-8 border-t border-stone-200/20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-stone-300 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-[#D4C3A3] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-100 block mb-0.5">동행자 맞춤 설계</span>
              <span className="text-stone-400">부모님 보행, 유모차 동선, 알러지 및 식이 제한 세부 필터링</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Utensils className="w-5 h-5 text-[#D4C3A3] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-100 block mb-0.5">매 끼니 5가지 선택지</span>
              <span className="text-stone-400">아침·점심·저녁마다 현지 검증 식당과 대체 메뉴 즉시 교체</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-[#D4C3A3] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-100 block mb-0.5">현실적인 이동 & 요금</span>
              <span className="text-stone-400">승차 위치부터 티켓 구매법, 환승 앱과 예상 요금 단계별 안내</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
