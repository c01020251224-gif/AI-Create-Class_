import React, { useState } from 'react';
import { COUNTRY_CUISINES } from '../data/travelData';
import { CountryCuisine, Dish } from '../types/travel';
import { Utensils, AlertTriangle, ShieldCheck, Info, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

interface FoodSectionProps {
  onDietaryFilterClick?: (tag: string) => void;
}

export const FoodSection: React.FC<FoodSectionProps> = ({
  onDietaryFilterClick,
}) => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>(COUNTRY_CUISINES[0].id);

  const currentCuisine = COUNTRY_CUISINES.find((c) => c.id === selectedCountryId) || COUNTRY_CUISINES[0];

  return (
    <section id="cuisines" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 border-t border-stone-200">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-500 uppercase mb-2">
            <span>Culinary Heritage & Dining</span>
            <span aria-hidden="true">·</span>
            <span>세계의 미식 문화</span>
          </div>
          <h2 className="font-serif-kr text-3xl sm:text-4xl text-stone-900 font-normal leading-tight break-keep">
            그 나라의 식탁을 알면, 여행의 깊이가 달라집니다
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed break-keep">
            한 그릇에 담긴 문화적 유래와 올바른 취식법부터,<br className="hidden sm:inline" />
            알러지 유발 성분 및 비건·할랄 표기까지 세심하게 정리했습니다.
          </p>
        </div>

        {/* Country Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto p-1 bg-stone-200/70 rounded-lg shrink-0">
          {COUNTRY_CUISINES.map((cuisine) => (
            <button
              key={cuisine.id}
              onClick={() => setSelectedCountryId(cuisine.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCountryId === cuisine.id
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cuisine.country}
            </button>
          ))}
        </div>
      </div>

      {/* Main Selected Country Overview Strip */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100 pb-6 mb-6">
          <div>
            <span className="text-xs font-semibold text-stone-500 tracking-wider uppercase">
              {currentCuisine.country}
            </span>
            <h3 className="font-serif-kr text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {currentCuisine.cultureName}
            </h3>
            <p className="font-serif-kr italic text-stone-600 mt-1.5 text-base">
              "{currentCuisine.tagline}"
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-4 py-2.5 rounded-lg border border-stone-200/60 shrink-0">
            <Info className="w-4 h-4 text-stone-400 shrink-0" />
            <span>AI 플래너에서 이 나라를 선택하면 아래의 알러지 및 식이 제한 데이터가 자동 연동됩니다.</span>
          </div>
        </div>

        {/* 2-Column: Etiquette & Ordering Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FAF9F5] p-5 rounded-lg border border-stone-200/70">
            <h4 className="text-xs font-bold tracking-wider text-stone-900 uppercase flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-stone-700" />
              현지 식문화 에티켓
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700 list-disc list-inside">
              {currentCuisine.etiquette.map((e, idx) => (
                <li key={idx} className="leading-relaxed">{e}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FAF9F5] p-5 rounded-lg border border-stone-200/70">
            <h4 className="text-xs font-bold tracking-wider text-stone-900 uppercase flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-stone-700" />
              현명한 주문 & 소통 팁
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700 list-disc list-inside">
              {currentCuisine.orderingTips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Signature Dishes Cards */}
      <h3 className="font-serif-kr text-xl sm:text-2xl font-bold text-stone-900 mb-6">
        {currentCuisine.country}의 대표 요리 3선
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentCuisine.dishes.map((dish, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-200/90 rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Dish Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="font-serif-kr text-xl font-bold text-stone-900">{dish.name}</h4>
                  <span className="text-xs text-stone-500 italic block">{dish.nameOriginal}</span>
                </div>
                <span className="text-xs font-medium text-stone-700 bg-stone-100 px-2 py-1 rounded whitespace-nowrap">
                  {dish.priceRange}
                </span>
              </div>

              {/* Dietary Tags (Clean unboxed inline text or quiet tags) */}
              {dish.dietaryTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs font-medium text-emerald-800">
                  {dish.dietaryTags.map((tag) => (
                    <span key={tag} className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {tag} 적합
                    </span>
                  ))}
                </div>
              )}

              {/* Taste Profile */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-stone-900 block mb-1">맛의 특징</span>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {dish.taste}
                </p>
              </div>

              {/* Eating Guide */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-stone-900 block mb-1">제대로 먹는 방법</span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {dish.eatingGuide}
                </p>
              </div>
            </div>

            {/* Allergens warning */}
            <div className="pt-4 border-t border-stone-100 mt-2">
              <div className="flex items-start gap-1.5 text-xs text-stone-500">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-700">알러지 유발 성분:</strong>{' '}
                  {dish.allergens.length > 0 ? dish.allergens.join(', ') : '주요 알러지 유발 물질 없음'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
