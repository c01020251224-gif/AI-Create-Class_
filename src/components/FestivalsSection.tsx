import React, { useState } from 'react';
import { FESTIVALS } from '../data/travelData';
import { Festival } from '../types/travel';
import { Calendar, MapPin, AlertCircle, Sparkles, Compass, List, Map as MapIcon, ChevronRight } from 'lucide-react';

interface FestivalsSectionProps {
  onSelectFestivalDestination: (destinationName: string) => void;
}

export const FestivalsSection: React.FC<FestivalsSectionProps> = ({
  onSelectFestivalDestination,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [focusedFestivalId, setFocusedFestivalId] = useState<string | null>(null);

  const months = [
    { label: '전체 월', val: 'all' as const },
    { label: '2월', val: 2 },
    { label: '4월', val: 4 },
    { label: '8월', val: 8 },
    { label: '9월', val: 9 },
    { label: '11월', val: 11 },
  ];

  const countries = ['all', '태국', '스페인', '독일', '일본', '브라질'];

  const filteredFestivals = FESTIVALS.filter((f) => {
    const matchMonth = selectedMonth === 'all' || f.month === selectedMonth;
    const matchCountry = selectedCountry === 'all' || f.country === selectedCountry;
    return matchMonth && matchCountry;
  });

  return (
    <section id="festivals" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 border-t border-stone-200">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-500 uppercase mb-2">
            <span>World Festivals & Gatherings</span>
            <span aria-hidden="true">·</span>
            <span>세계 축제 캘린더</span>
          </div>
          <h2 className="font-serif-kr text-3xl sm:text-4xl text-stone-900 font-normal leading-tight break-keep">
            일생에 단 한 번, 대지가 들썩이는 축제의 계절로
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed break-keep">
            축제 시기는 인근 숙소와 교통편이 수개월 전 조기 마감됩니다.<br className="hidden sm:inline" />
            여행 시기와 맞물리는 황홀한 축제의 순간을 미리 확인하세요.
          </p>
        </div>

        {/* View Mode Toggle: List vs Map */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              viewMode === 'list'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>리스트 뷰</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              viewMode === 'map'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>월드 지도 뷰</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200">
        {/* Month Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-xs text-stone-500 font-medium mr-1 whitespace-nowrap">시기:</span>
          {months.map((m) => (
            <button
              key={String(m.val)}
              onClick={() => setSelectedMonth(m.val)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedMonth === m.val
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Country Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-xs text-stone-500 font-medium mr-1 whitespace-nowrap">국가:</span>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCountry === c
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c === 'all' ? '전체 국가' : c}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Map View */}
      {viewMode === 'map' ? (
        <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-8 mb-10 overflow-hidden relative shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-300">Global Interactive Map</span>
              <h3 className="font-serif-kr text-xl font-bold mt-1">세계 축제 거점 맵</h3>
            </div>
            <span className="text-xs text-stone-400">핀을 클릭하면 해당 축제의 세부 정보로 이동합니다.</span>
          </div>

          {/* Stylized Minimalist World Map with SVG Coordinates */}
          <div className="relative aspect-[21/9] min-h-[300px] w-full bg-[#1A2322] rounded-lg border border-stone-800 flex items-center justify-center overflow-hidden">
            <svg
              className="w-full h-full opacity-35"
              viewBox="0 0 1000 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Subtle Equator and Grids */}
              <line x1="0" y1="250" x2="1000" y2="250" stroke="#4A5568" strokeDasharray="4 4" strokeWidth="0.5" />
              <line x1="500" y1="0" x2="500" y2="500" stroke="#4A5568" strokeDasharray="4 4" strokeWidth="0.5" />
              
              {/* Stylized Continents silhouettes */}
              {/* Americas */}
              <path d="M180,80 Q240,110 260,180 T220,320 T280,440" stroke="#718096" strokeWidth="1.2" fill="none" />
              {/* Eurasia */}
              <path d="M480,100 Q650,90 850,130 T800,280 T600,260" stroke="#718096" strokeWidth="1.2" fill="none" />
              {/* Africa */}
              <path d="M480,220 Q560,260 540,380 T470,390" stroke="#718096" strokeWidth="1.2" fill="none" />
              {/* Oceania */}
              <path d="M820,340 Q880,360 860,420" stroke="#718096" strokeWidth="1.2" fill="none" />
            </svg>

            {/* Pins on the Map */}
            {filteredFestivals.map((fest) => {
              // Convert lat/lng to roughly 1000x500 box
              // Lng: -180 to 180 -> 0 to 1000
              // Lat: 90 to -90 -> 0 to 500
              const xPercent = ((fest.lng + 180) / 360) * 100;
              const yPercent = ((90 - fest.lat) / 180) * 100;

              const isFocused = focusedFestivalId === fest.id;

              return (
                <div
                  key={fest.id}
                  style={{ left: `${Math.max(8, Math.min(92, xPercent))}%`, top: `${Math.max(12, Math.min(88, yPercent))}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                  onClick={() => setFocusedFestivalId(fest.id)}
                >
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md transition-all ${
                    isFocused ? 'bg-amber-400 text-stone-950 scale-110 ring-4 ring-amber-400/30' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                  }`}>
                    <MapPin className="w-3 h-3 text-amber-400 group-hover:text-amber-300" />
                    <span>{fest.name.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Focused Festival detail bar if pin clicked */}
          {focusedFestivalId && (
            <div className="mt-6 p-4 bg-stone-800/90 rounded-lg border border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {(() => {
                const target = FESTIVALS.find((f) => f.id === focusedFestivalId);
                if (!target) return null;
                return (
                  <>
                    <div>
                      <span className="text-xs text-amber-400 font-semibold">{target.country} · {target.period}</span>
                      <h4 className="font-serif-kr text-lg font-bold text-white mt-0.5">{target.name}</h4>
                      <p className="text-xs text-stone-300 mt-1">{target.earlyBookingAlert}</p>
                    </div>
                    <button
                      onClick={() => onSelectFestivalDestination(target.city || target.country)}
                      className="px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-md shrink-0 cursor-pointer"
                    >
                      이 축제 일정으로 플래너 시작
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      ) : null}

      {/* Festivals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFestivals.map((fest) => (
          <div
            key={fest.id}
            className="flex flex-col justify-between bg-white border border-stone-200/90 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
          >
            {/* Card Visual with Scrim */}
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
              <img
                src={fest.image}
                alt={fest.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-xs font-semibold text-stone-100 bg-stone-900/70 backdrop-blur-sm px-2.5 py-1 rounded">
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>{fest.country} {fest.city}</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <span className="text-xs text-amber-200 font-medium block mb-0.5">
                  {fest.month}월 개최 · {fest.period}
                </span>
                <h3 className="font-serif-kr text-xl font-bold tracking-tight">
                  {fest.name}
                </h3>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Origin story */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-stone-900 block mb-1">축제의 유래</span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {fest.origin}
                  </p>
                </div>

                {/* Participation Tips */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-stone-900 block mb-1.5">참여 팁 & 필수 수칙</span>
                  <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                    {fest.tips.map((tip, i) => (
                      <li key={i} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Early Booking Alert */}
                <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-md flex items-start gap-2.5 text-xs text-amber-900 mb-6">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">숙박 조기 마감 경보</span>
                    <span>{fest.earlyBookingAlert}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  onClick={() => onSelectFestivalDestination(fest.city || fest.country)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-stone-900 bg-[#E8E2D2] hover:bg-[#DDD6C3] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>이 축제 시기로 일정 플랜 짜기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Notice */}
      <div className="mt-12 text-center text-xs text-stone-400">
        축제 개최 시기는 현지 사정 및 음력·천문 주기에 따라 변동될 수 있으며, 매년 1회 이상 최신 정보로 갱신됩니다.
      </div>
    </section>
  );
};
