import React, { useState } from 'react';
import { DESTINATIONS } from '../data/travelData';
import { Destination, Continent, DestinationTrack } from '../types/travel';
import { Calendar, Clock, Accessibility, Sparkles, ArrowRight, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DestinationsSectionProps {
  onSelectForPlanner: (destinationName: string) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  onSelectForPlanner,
}) => {
  const [selectedContinent, setSelectedContinent] = useState<Continent | '전체'>('전체');
  const [activeTrack, setActiveTrack] = useState<'all' | DestinationTrack>('all');
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  const continents: (Continent | '전체')[] = [
    '전체',
    '아시아',
    '유럽',
    '아프리카',
    '남미',
    '북미',
    '중동',
    '오세아니아',
  ];

  const filteredDestinations = DESTINATIONS.filter((d) => {
    const matchContinent = selectedContinent === '전체' || d.continent === selectedContinent;
    const matchTrack = activeTrack === 'all' || d.track === activeTrack;
    return matchContinent && matchTrack;
  });

  return (
    <section id="destinations" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-500 uppercase mb-2">
            <span>Curated Destinations</span>
            <span aria-hidden="true">·</span>
            <span>엄선된 여행지</span>
          </div>
          <h2 className="font-serif-kr text-3xl sm:text-4xl text-stone-900 font-normal leading-tight break-keep">
            세상의 경계에서 만나는 두 가지 시선
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed break-keep">
            세계인에게 사랑받는 영원한 클래식 명소와,<br className="hidden sm:inline" />
            여행자의 가슴을 뛰게 하는 비밀스러운 이색 여행지를 함께 큐레이션했습니다.
          </p>
        </div>

        {/* Dual Track Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTrack('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTrack === 'all'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            모든 여행지
          </button>
          <button
            onClick={() => setActiveTrack('iconic')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTrack === 'iconic'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            대표 명소
          </button>
          <button
            onClick={() => setActiveTrack('hidden')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTrack === 'hidden'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            숨은 이색 여행지
          </button>
        </div>
      </div>

      {/* Continent Horizontal Scroll Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none border-b border-stone-200">
        {continents.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedContinent(c)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
              selectedContinent === c
                ? 'bg-[#233532] text-stone-50'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Asymmetric Bento Grid (Mixing large focal cards and compact cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest, index) => {
          // Asymmetric layout span rule: First card or 4th card in grid spans 2 columns on lg
          const isFocal = index === 0 || index === 3;
          return (
            <div
              key={dest.id}
              className={`group flex flex-col justify-between bg-white border border-stone-200/90 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${
                isFocal ? 'lg:col-span-2' : 'lg:col-span-1'
              }`}
            >
              {/* Image Area with Scrim */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                
                {/* Track label in subtle text on top */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-medium text-stone-100 bg-stone-900/60 backdrop-blur-sm px-2.5 py-1 rounded">
                  <span>{dest.continent}</span>
                  <span aria-hidden="true">·</span>
                  <span>{dest.track === 'iconic' ? '대표 명소' : '숨은 이색지'}</span>
                </div>

                {/* Bottom title in overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <span className="text-xs text-stone-300 font-light block">{dest.country}</span>
                  <h3 className="font-serif-kr text-2xl font-bold tracking-tight">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-serif-kr text-base text-stone-800 italic leading-snug mb-4">
                    "{dest.tagline}"
                  </p>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2 mb-5">
                    {dest.description}
                  </p>

                  {/* Metadata: Unboxed Text with Separators */}
                  <div className="space-y-2 text-xs text-stone-500 border-t border-stone-100 pt-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-stone-700 font-medium">추천 시기:</span>
                      <span>{dest.recommendedSeason}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-stone-700 font-medium">권장 일정:</span>
                      <span>{dest.suggestedDuration}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Accessibility className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span className="text-stone-700 font-medium shrink-0">접근성:</span>
                      <span className="line-clamp-1">{dest.accessibility}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => setActiveModalDest(dest)}
                    className="flex-1 py-2.5 px-3 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors cursor-pointer text-center"
                  >
                    상세 가이드 보기
                  </button>
                  <button
                    onClick={() => onSelectForPlanner(dest.name)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-[#233532] hover:bg-[#182523] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-center shadow-sm"
                  >
                    <span>플랜 만들기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Destination Detail Modal */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative bg-[#FAF9F5] w-full max-w-3xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header Media */}
            <div className="relative h-64 sm:h-72 shrink-0 overflow-hidden bg-stone-900">
              <img
                src={activeModalDest.image}
                alt={activeModalDest.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/30 to-transparent" />
              
              <button
                onClick={() => setActiveModalDest(null)}
                className="absolute top-4 right-4 z-10 p-2 text-white/90 hover:text-white bg-stone-950/40 hover:bg-stone-950/70 rounded-full transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs font-medium text-stone-300 mb-1">
                  <span>{activeModalDest.continent}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalDest.country}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-200">{activeModalDest.track === 'iconic' ? '대표 명소' : '숨은 이색 여행지'}</span>
                </div>
                <h3 className="font-serif-kr text-3xl font-bold tracking-tight">
                  {activeModalDest.name} <span className="text-lg font-normal text-stone-300">({activeModalDest.nameEn})</span>
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
              <div>
                <p className="font-serif-kr text-lg text-stone-900 italic mb-3">
                  "{activeModalDest.tagline}"
                </p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {activeModalDest.description}
                </p>
              </div>

              {/* 볼거리 TOP 5 */}
              <div>
                <h4 className="font-serif-kr text-lg font-bold text-stone-900 border-b border-stone-200 pb-2 mb-4">
                  놓치지 말아야 할 대표 볼거리 TOP 5
                </h4>
                <div className="space-y-3">
                  {activeModalDest.topSpots.map((spot, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-stone-200/80">
                      <span className="font-serif-kr text-sm font-bold text-stone-400 w-5">
                        0{idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="text-sm font-semibold text-stone-900">{spot.name}</h5>
                          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">{spot.time}</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{spot.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 현지 팁 & 비자/안전 유의사항 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-stone-200/80">
                  <h4 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    현지 여행 필수 팁
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-600 list-disc list-inside">
                    {activeModalDest.localTips.map((tip, i) => (
                      <li key={i} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-lg border border-stone-200/80">
                  <h4 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    비자 및 안전 가이드
                  </h4>
                  <div className="space-y-2 text-xs text-stone-600">
                    <p><span className="font-semibold text-stone-800">비자:</span> {activeModalDest.visaAndSafety.visa}</p>
                    <p><span className="font-semibold text-stone-800">치안 수준:</span> {activeModalDest.visaAndSafety.safetyLevel}</p>
                    <p><span className="font-semibold text-stone-800">유의점:</span> {activeModalDest.visaAndSafety.notes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-6 bg-white border-t border-stone-200 flex items-center justify-between gap-4 shrink-0">
              <span className="text-xs text-stone-500 hidden sm:inline">
                이 여행지로 이동/식사/투어가 포함된 일정표를 받아보세요.
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setActiveModalDest(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    const name = activeModalDest.name;
                    setActiveModalDest(null);
                    onSelectForPlanner(name);
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#233532] hover:bg-[#182523] rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>이 여행지로 플랜 만들기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
