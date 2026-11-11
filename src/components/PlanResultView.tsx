import React, { useState } from 'react';
import {
  GeneratedTravelPlan,
  DayItinerary,
  MealChoice,
  ActivitySpot,
  TransitGuidance,
} from '../types/travel';
import {
  Calendar,
  Clock,
  Compass,
  Utensils,
  Share2,
  Printer,
  Mail,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  TrendingDown,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Ticket,
  Send,
  Heart,
} from 'lucide-react';

interface PlanResultViewProps {
  plan: GeneratedTravelPlan;
  onModifyPlan: () => void;
  onAttachToInquiry: (plan: GeneratedTravelPlan) => void;
}

export const PlanResultView: React.FC<PlanResultViewProps> = ({
  plan: initialPlan,
  onModifyPlan,
  onAttachToInquiry,
}) => {
  const [plan, setPlan] = useState<GeneratedTravelPlan>(initialPlan);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [targetEmail, setTargetEmail] = useState<string>('');
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeMealSelector, setActiveMealSelector] = useState<{
    dayIdx: number;
    mealType: 'breakfast' | 'lunch' | 'dinner';
  } | null>(null);

  const currentDay = plan.days[activeDayIndex] || plan.days[0];

  // Budget calculation
  const budgetRatio = plan.totalBudgetKRW > 0
    ? Math.min(100, Math.round((plan.estimatedTotalSpentKRW / plan.totalBudgetKRW) * 100))
    : 0;

  // Meal Choice Switcher (Allows picking from the 5+ meal choices)
  const handleSelectMeal = (
    dayIdx: number,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    mealId: string
  ) => {
    setPlan((prev) => {
      const nextDays = [...prev.days];
      const targetDay = { ...nextDays[dayIdx] };
      const targetMeal = { ...targetDay.meals[mealType] };
      targetMeal.selectedId = mealId;
      targetDay.meals[mealType] = targetMeal;
      nextDays[dayIdx] = targetDay;
      return { ...prev, days: nextDays };
    });
    setActiveMealSelector(null);
  };

  // Reorder activities in the day (Move up/down)
  const handleMoveActivity = (activityIdx: number, direction: 'up' | 'down') => {
    setPlan((prev) => {
      const nextDays = [...prev.days];
      const targetDay = { ...nextDays[activeDayIndex] };
      const nextActivities = [...targetDay.activities];
      const targetIdx = direction === 'up' ? activityIdx - 1 : activityIdx + 1;
      if (targetIdx < 0 || targetIdx >= nextActivities.length) return prev;

      const temp = nextActivities[activityIdx];
      nextActivities[activityIdx] = nextActivities[targetIdx];
      nextActivities[targetIdx] = temp;
      targetDay.activities = nextActivities;
      nextDays[activeDayIndex] = targetDay;
      return { ...prev, days: nextDays };
    });
  };

  // Share Link via Clipboard
  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Send Email Modal action
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.includes('@')) return;
    setEmailSentStatus('일정표와 상세 안내문이 입력하신 이메일로 전송되었습니다.');
    setTimeout(() => {
      setEmailSentStatus(null);
      setEmailModalOpen(false);
      setTargetEmail('');
    }, 2500);
  };

  // Print PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-5xl mx-auto print:p-0">
      {/* Top Banner & Action Header */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 mb-8 shadow-sm print:border-none print:shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              <span>Tailored Travel Plan</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-800 font-bold">{plan.referenceDate}</span>
            </div>
            <h1 className="font-serif-kr text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {plan.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              {plan.durationText} · {plan.travelStyle} · {plan.groupSummary}
            </p>
          </div>

          {/* Export & Inquiry Actions */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
              title="PDF 저장 및 인쇄"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">PDF 인쇄</span>
            </button>
            <button
              onClick={handleCopyShareLink}
              className="p-2.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
              title="링크 복사"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? '복사 완료' : '공유'}</span>
            </button>
            <button
              onClick={() => setEmailModalOpen(true)}
              className="p-2.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
              title="이메일 발송"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">이메일</span>
            </button>
            <button
              onClick={() => onAttachToInquiry(plan)}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#233532] hover:bg-[#182523] rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>이 플랜으로 문의하기</span>
            </button>
          </div>
        </div>

        {/* Budget Depletion & Status Bar */}
        <div className="mt-6 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-2">
            <span className="font-semibold text-stone-800">
              총 예상 여행 경비:{' '}
              <strong className="text-base font-bold text-stone-900 font-mono">
                {plan.estimatedTotalSpentKRW.toLocaleString()}원
              </strong>
            </span>
            <span className="text-stone-500 font-mono">
              예산 {plan.totalBudgetKRW.toLocaleString()}원 중 {budgetRatio}% 소진
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                budgetRatio > 100
                  ? 'bg-rose-500'
                  : budgetRatio > 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, budgetRatio)}%` }}
            />
          </div>

          {/* Cost saving suggestions if exceeded or warning */}
          {plan.costSavingSuggestions && plan.costSavingSuggestions.length > 0 && (
            <div className="mt-4 p-4 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900">
              <div className="font-semibold flex items-center gap-1.5 mb-1.5 text-amber-950">
                <TrendingDown className="w-4 h-4 text-amber-800" />
                <span>예산 최적화를 위한 절약 대안 가이드</span>
              </div>
              <ul className="space-y-1 list-disc list-inside text-stone-700">
                {plan.costSavingSuggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Medical & Safety Legal Disclaimer Banner */}
        <div className="mt-5 p-3.5 bg-stone-50 border border-stone-200 rounded-md flex items-start gap-2.5 text-xs text-stone-500">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            * 본 일정에 수록된 식당 영업시간, 대중교통 요금 및 현지 투어 규정은 {plan.referenceDate}에 기반합니다.
            현지 날씨나 사정에 따라 변동될 수 있으므로 예약 전 최종 확인하시기 바라며, 건강 및 안전 관련 안내는 의료 조언이 아닌 일정 조정 참고용입니다.
          </p>
        </div>
      </div>

      {/* Companion Special Care Cards */}
      {plan.companionSpecialNotices.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.companionSpecialNotices.map((notice, i) => (
            <div key={i} className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 mb-2">
                <Heart className="w-4 h-4 text-rose-700" />
                <span>{notice.category}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                {notice.guideline}
              </p>
              <div className="text-xs text-stone-500 bg-[#FAF9F5] p-2.5 rounded border border-stone-200/60">
                <strong className="text-stone-700">긴급/편의 시설:</strong> {notice.nearbyFacilities}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-stone-200 print:hidden">
        {plan.days.map((day, idx) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-5 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 text-left ${
              activeDayIndex === idx
                ? 'bg-[#233532] text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span className="block text-[10px] opacity-75 uppercase">Day {day.dayNumber}</span>
            <span className="font-semibold">{day.themeTitle.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Day Itinerary Content */}
      <div className="space-y-8">
        {/* Day Header */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
            <div>
              <span className="text-xs font-bold text-amber-800 tracking-wider uppercase">
                Day {currentDay.dayNumber}
              </span>
              <h2 className="font-serif-kr text-2xl font-bold text-stone-900 mt-0.5">
                {currentDay.themeTitle}
              </h2>
            </div>
            <div className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded self-start sm:self-auto font-mono">
              예상 일일 경비: 약 {currentDay.estimatedDayCostKRW.toLocaleString()}원
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {currentDay.summary}
          </p>
        </div>

        {/* 1. 이동 안내 (Transit Guidance) */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-serif-kr text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-stone-700" />
            구간별 이동 가이드 및 승차 정보
          </h3>

          <div className="space-y-6">
            {currentDay.transitGuidance.map((transit, tIdx) => (
              <div key={tIdx} className="p-4 bg-stone-50/80 rounded-lg border border-stone-200/70">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {transit.mode}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800">{transit.route}</span>
                  </div>
                  <div className="text-xs text-stone-600 font-mono">
                    소요 {transit.duration} · {transit.estimatedCost}
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2 mt-2">
                  {transit.steps.map((st) => (
                    <div key={st.stepNumber} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <span className="w-4 h-4 rounded-full bg-stone-800 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {st.stepNumber}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-stone-900">{st.instruction}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-500 mt-1">
                          <span>승차 위치: {st.boardingLocation}</span>
                          <span>티켓: {st.ticketInfo}</span>
                          {st.appOrPass && <span>앱/패스: {st.appOrPass}</span>}
                        </div>
                        {st.transferNotes && (
                          <p className="text-[11px] text-amber-800 mt-1 bg-amber-50/80 px-2 py-0.5 rounded inline-block">
                            💡 {st.transferNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 명소 & 활동 타임라인 (Activities with reordering) */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-kr text-lg font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-stone-700" />
              오늘의 주요 방문 명소 & 액티비티
            </h3>
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              화살표 버튼으로 일정 순서를 직접 변경할 수 있습니다.
            </span>
          </div>

          <div className="space-y-4">
            {currentDay.activities.map((act, actIdx) => (
              <div
                key={actIdx}
                className="p-4 bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {act.timeSlot}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-600">{act.category}</span>
                      {act.bookingRequired && (
                        <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-medium">
                          사전 예약 필수
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-stone-900">{act.spotName}</h4>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                      <span>소요 시간: {act.duration}</span>
                      <span>입장료: {act.admissionFee}</span>
                      <span>팁: {act.bookingTips}</span>
                    </div>

                    {act.accessibilityNotice && (
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-200/50">
                        ✓ {act.accessibilityNotice}
                      </div>
                    )}
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1 shrink-0 print:hidden">
                    <button
                      disabled={actIdx === 0}
                      onClick={() => handleMoveActivity(actIdx, 'up')}
                      className="p-1.5 text-stone-400 hover:text-stone-800 disabled:opacity-20 cursor-pointer rounded hover:bg-stone-100"
                      title="위로 이동"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={actIdx === currentDay.activities.length - 1}
                      onClick={() => handleMoveActivity(actIdx, 'down')}
                      className="p-1.5 text-stone-400 hover:text-stone-800 disabled:opacity-20 cursor-pointer rounded hover:bg-stone-100"
                      title="아래로 이동"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 식사 추천 (아침·점심·저녁 각각 5개 이상의 선택지 및 즉시 교체 UI) */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-serif-kr text-lg font-bold text-stone-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-stone-700" />
                식사 추천 (끼니마다 엄선된 5가지 선택지)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                알러지, 채식, 유모차 및 반려동물 동반 조건을 만족하는 5개 후보 중 원하는 식당으로 즉시 교체할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
              const mealLabel = mealType === 'breakfast' ? '아침 식사' : mealType === 'lunch' ? '점심 식사' : '저녁 식사';
              const mealData = currentDay.meals[mealType];
              const selectedOption = mealData.options.find((o) => o.id === mealData.selectedId) || mealData.options[0];
              const isSelectorOpen = activeMealSelector?.dayIdx === activeDayIndex && activeMealSelector?.mealType === mealType;

              return (
                <div key={mealType} className="border border-stone-200 rounded-lg p-5 bg-[#FAF9F5]/70">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3 mb-3">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wide bg-stone-200/80 px-2 py-0.5 rounded">
                      {mealLabel}
                    </span>
                    <button
                      onClick={() => {
                        if (isSelectorOpen) {
                          setActiveMealSelector(null);
                        } else {
                          setActiveMealSelector({ dayIdx: activeDayIndex, mealType });
                        }
                      }}
                      className="text-xs font-semibold text-[#233532] hover:text-stone-900 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded border border-stone-200 shadow-xs print:hidden"
                    >
                      <span>다른 식당 보기 ({mealData.options.length}개 선택지)</span>
                      {isSelectorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Currently Selected Meal Card */}
                  <div className="bg-white p-4 rounded-md border border-stone-200/90 shadow-xs">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-stone-900">{selectedOption.name}</h4>
                          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                            {selectedOption.category}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-amber-900 mt-1">
                          대표 메뉴: {selectedOption.signatureMenu}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-800">
                        {selectedOption.pricePerPerson}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 border-t border-stone-100 pt-2.5">
                      <div><strong className="text-stone-700">위치:</strong> {selectedOption.location}</div>
                      <div><strong className="text-stone-700">영업시간:</strong> {selectedOption.openHours}</div>
                      <div><strong className="text-stone-700">식이/알러지:</strong> {selectedOption.dietarySuitability}</div>
                      <div><strong className="text-stone-700">접근성:</strong> {selectedOption.accessibilityInfo}</div>
                    </div>

                    <div className="mt-2 text-xs text-stone-500 italic">
                      💡 {selectedOption.highlightTip}
                    </div>
                  </div>

                  {/* 5+ Options Dropdown Selector */}
                  {isSelectorOpen && (
                    <div className="mt-4 pt-3 border-t border-stone-200 space-y-3 animate-in fade-in">
                      <div className="text-xs font-semibold text-stone-700">
                        원하는 식당을 선택하면 일정표에 즉시 반영됩니다:
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {mealData.options.map((opt) => (
                          <div
                            key={opt.id}
                            onClick={() => handleSelectMeal(activeDayIndex, mealType, opt.id)}
                            className={`p-3 rounded-md border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                              opt.id === selectedOption.id
                                ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300'
                                : 'bg-white border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-stone-900">{opt.name}</span>
                                <span className="text-[11px] text-stone-500">· {opt.category}</span>
                              </div>
                              <p className="text-xs text-stone-600 mt-0.5">
                                {opt.signatureMenu} ({opt.pricePerPerson})
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 mt-1">
                                <span>{opt.dietarySuitability}</span>
                                <span>·</span>
                                <span>{opt.accessibilityInfo}</span>
                              </div>
                            </div>
                            {opt.id === selectedOption.id && (
                              <CheckCircle className="w-4 h-4 text-amber-800 shrink-0 mt-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 현지 투어 안내 (Local Tour Option) */}
        {currentDay.localTour && (
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif-kr text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-stone-700" />
              추천 현지 데이투어 (선택)
            </h3>

            <div className="p-5 bg-stone-50 rounded-lg border border-stone-200">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h4 className="text-base font-bold text-stone-900">{currentDay.localTour.tourName}</h4>
                <span className="text-sm font-bold font-mono text-emerald-800">
                  {currentDay.localTour.price}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600 mb-4">
                <div><strong className="text-stone-800">집합 시간 및 장소:</strong> {currentDay.localTour.meetingTimeAndPlace}</div>
                <div><strong className="text-stone-800">소요 시간:</strong> {currentDay.localTour.duration}</div>
                <div><strong className="text-stone-800">포함 사항:</strong> {currentDay.localTour.inclusions.join(', ')}</div>
                <div><strong className="text-stone-800">불포함 사항:</strong> {currentDay.localTour.exclusions.join(', ')}</div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                <span>예약 방법: {currentDay.localTour.bookingMethod}</span>
                <span className="text-stone-600 font-medium">취소 규정: {currentDay.localTour.cancellationPolicy}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation for Easy Action */}
      <div className="mt-12 p-6 bg-[#233532] text-stone-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="font-serif-kr text-lg font-bold break-keep">이 일정이 마음에 드셨나요?</h4>
          <p className="text-xs text-stone-300 mt-1 break-keep">
            전문 여행 플래너에게 이 플랜을 그대로 전달하여 항공·숙박 예약 및 비자 문의를 무료로 상담받으세요.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onModifyPlan}
            className="px-4 py-2.5 text-xs font-medium text-stone-200 border border-stone-500 hover:border-stone-300 rounded-md transition-colors cursor-pointer"
          >
            조건 다시 설정
          </button>
          <button
            onClick={() => onAttachToInquiry(plan)}
            className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-[#E8E2D2] hover:bg-white rounded-md transition-colors cursor-pointer shadow-sm"
          >
            플랜 첨부 상담 요청
          </button>
        </div>
      </div>

      {/* Send Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <h3 className="font-serif-kr text-xl font-bold text-stone-900 mb-2">
              이메일로 여행 플랜 받기
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              생성된 일정표와 식당 예약 정보, 교통 환승 지침을 이메일로 발송해 드립니다.
            </p>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">받는 분 이메일</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                />
              </div>

              {emailSentStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded border border-emerald-200">
                  {emailSentStatus}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#233532] hover:bg-[#182523] rounded-md transition-colors cursor-pointer shadow-sm"
                >
                  발송하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
