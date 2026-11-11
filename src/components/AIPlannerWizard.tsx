import React, { useState, useEffect } from 'react';
import {
  PlannerInput,
  TravelStyle,
  TransitPreference,
  TravelKeyword,
  GeneratedTravelPlan,
} from '../types/travel';
import {
  Calendar,
  MapPin,
  Users,
  Compass,
  Heart,
  Dog,
  Car,
  Tag,
  Coins,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle,
  Smile,
} from 'lucide-react';

interface AIPlannerWizardProps {
  initialDestination?: string;
  onPlanGenerated: (plan: GeneratedTravelPlan) => void;
}

export const AIPlannerWizard: React.FC<AIPlannerWizardProps> = ({
  initialDestination = '',
  onPlanGenerated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<PlannerInput>({
    startDate: '2026-11-20',
    endDate: '2026-11-24',
    durationDays: 4,
    primaryDestination: initialDestination || '교토',
    transitStops: [],
    groupMembers: {
      adults: 2,
      teens: 0,
      children: 0,
    },
    travelStyle: '효도관광',
    customTravelStyle: '',
    companionCondition: {
      elderly: true,
      toddler: false,
      pregnant: false,
      medicalCondition: false,
      allergies: false,
      disability: false,
      dietaryRestriction: false,
      notes: '',
    },
    petCondition: {
      hasPet: false,
      typeAndSize: '',
    },
    preferredTransits: ['대중교통', '택시'],
    keywords: ['맛집', '명소', '자연', '사진', '휴식'],
    budget: {
      amount: 2500000,
      type: 'total',
      currency: 'KRW',
      includesFlightAndHotel: false,
    },
  });

  // Transit stop input draft
  const [newTransitStop, setNewTransitStop] = useState('');

  // Update destination if passed from external card
  useEffect(() => {
    if (initialDestination) {
      setFormData((prev) => ({ ...prev, primaryDestination: initialDestination }));
    }
  }, [initialDestination]);

  // Recalculate duration when dates change
  const handleDateChange = (field: 'startDate' | 'endDate', val: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (next.startDate && next.endDate) {
        const start = new Date(next.startDate);
        const end = new Date(next.endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        next.durationDays = diffDays;
      }
      return next;
    });
  };

  // Preset Personas for quick one-click testing
  const applyPreset = (presetName: string) => {
    if (presetName === 'filial') {
      setFormData((prev) => ({
        ...prev,
        travelStyle: '효도관광',
        preferredTransits: ['택시', '대중교통'],
        keywords: ['맛집', '명소', '자연', '휴식', '온천/스파'],
        companionCondition: {
          ...prev.companionCondition,
          elderly: true,
          toddler: false,
          pregnant: false,
          notes: '계단 오르내림이 어려운 70대 부모님 동반, 평지 위주와 잦은 휴식 필요',
        },
      }));
    } else if (presetName === 'family') {
      setFormData((prev) => ({
        ...prev,
        travelStyle: '가족',
        groupMembers: { adults: 2, teens: 0, children: 1 },
        preferredTransits: ['렌터카', '대중교통'],
        keywords: ['맛집', '자연', '놀이동산', '휴식'],
        companionCondition: {
          ...prev.companionCondition,
          elderly: false,
          toddler: true,
          allergies: true,
          notes: '3세 유아 동반으로 유모차 이동 및 오후 낮잠(14:00~16:00) 필수, 견과류 알러지 있음',
        },
      }));
    } else if (presetName === 'couple') {
      setFormData((prev) => ({
        ...prev,
        travelStyle: '커플',
        groupMembers: { adults: 2, teens: 0, children: 0 },
        preferredTransits: ['도보', '대중교통'],
        keywords: ['맛집', '명소', '야경', '사진', '호캉스'],
        companionCondition: {
          ...prev.companionCondition,
          elderly: false,
          toddler: false,
          pregnant: false,
          notes: '',
        },
      }));
    } else if (presetName === 'pregnant') {
      setFormData((prev) => ({
        ...prev,
        travelStyle: '태교여행',
        groupMembers: { adults: 2, teens: 0, children: 0 },
        preferredTransits: ['택시', '렌터카'],
        keywords: ['호캉스', '휴식', '자연', '맛집'],
        companionCondition: {
          ...prev.companionCondition,
          pregnant: true,
          notes: '임신 24주차 안정기, 무리한 도보 배제 및 인근 산부인과/병원 접근성 중요',
        },
      }));
    } else if (presetName === 'solo') {
      setFormData((prev) => ({
        ...prev,
        travelStyle: '혼자여행',
        groupMembers: { adults: 1, teens: 0, children: 0 },
        preferredTransits: ['대중교통', '도보', '자전거'],
        keywords: ['맛집', '유적지', '사진', '자연'],
        companionCondition: {
          ...prev.companionCondition,
          elderly: false,
          toddler: false,
          pregnant: false,
          notes: '',
        },
      }));
    }
  };

  const travelStyles: TravelStyle[] = [
    '효도관광',
    '가족',
    '커플',
    '허니문',
    '태교여행',
    '혼자여행',
    '우정여행',
    '동창회',
    '동호회',
    '워케이션',
    '직접입력',
  ];

  const transitOptions: TransitPreference[] = [
    '대중교통',
    '렌터카',
    '택시',
    '도보',
    '자전거',
    '기차',
  ];

  const keywordOptions: TravelKeyword[] = [
    '맛집',
    '명소',
    '자연',
    '야경',
    '사진',
    '유적지',
    '쇼핑',
    '호캉스',
    '휴식',
    '온천/스파',
    '액티비티',
    '놀이동산',
  ];

  const handleAddTransitStop = () => {
    if (!newTransitStop.trim()) return;
    setFormData((prev) => ({
      ...prev,
      transitStops: [...prev.transitStops, newTransitStop.trim()],
    }));
    setNewTransitStop('');
  };

  const handleRemoveTransitStop = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      transitStops: prev.transitStops.filter((_, i) => i !== idx),
    }));
  };

  // Submit and Generate Plan via Backend API
  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Multi-stage UX loading progression
    setLoadingStepText('동행자 상황 및 페이스 분석 중...');
    const timer1 = setTimeout(() => {
      setLoadingStepText('식이 제한 및 보행 접근성 필터 적용 중...');
    }, 1200);
    const timer2 = setTimeout(() => {
      setLoadingStepText('식사 옵션 5종 및 교통편 환승 데이터 결합 중...');
    }, 2500);

    try {
      const response = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류 (${response.status})`);
      }

      const plan: GeneratedTravelPlan = await response.json();
      onPlanGenerated(plan);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMessage('일정표를 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
    }
  };

  return (
    <section id="planner" className="py-24 px-6 max-w-4xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-stone-500 uppercase mb-2">
          <span>AI Precision Itinerary Engine</span>
          <span aria-hidden="true">·</span>
          <span>4단계 맞춤 일정 설계</span>
        </div>
        <h2 className="font-serif-kr text-3xl sm:text-4xl text-stone-900 font-normal leading-tight break-keep">
          당신의 조건에 꼭 맞춘 디테일 플래너
        </h2>
        <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed break-keep">
          어르신의 보행 체력과 유아의 낮잠, 식품 알러지 표기부터<br className="hidden sm:inline" />
          매 끼니 5가지 식당 선택지까지 한 번의 입력으로 완성합니다.
        </p>

        {/* Quick Persona Presets */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-stone-500 font-medium mr-1">빠른 추천 프리셋:</span>
          <button
            onClick={() => applyPreset('filial')}
            className="px-3 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full transition-colors cursor-pointer"
          >
            효도관광 (부모님 동반)
          </button>
          <button
            onClick={() => applyPreset('family')}
            className="px-3 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full transition-colors cursor-pointer"
          >
            가족 (영유아 동반)
          </button>
          <button
            onClick={() => applyPreset('couple')}
            className="px-3 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full transition-colors cursor-pointer"
          >
            커플 & 허니문
          </button>
          <button
            onClick={() => applyPreset('pregnant')}
            className="px-3 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full transition-colors cursor-pointer"
          >
            태교여행
          </button>
          <button
            onClick={() => applyPreset('solo')}
            className="px-3 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full transition-colors cursor-pointer"
          >
            혼행족
          </button>
        </div>
      </div>

      {/* 4-Step Progress Bar */}
      <div className="mb-10 bg-white border border-stone-200/90 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium">
          <div className={`py-2 px-1 rounded transition-colors ${currentStep >= 1 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
            <span className="block text-[10px] text-stone-400">Step 1</span>
            <span>기본 정보</span>
          </div>
          <div className={`py-2 px-1 rounded transition-colors ${currentStep >= 2 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
            <span className="block text-[10px] text-stone-400">Step 2</span>
            <span>동행 상황</span>
          </div>
          <div className={`py-2 px-1 rounded transition-colors ${currentStep >= 3 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
            <span className="block text-[10px] text-stone-400">Step 3</span>
            <span>선호 & 취향</span>
          </div>
          <div className={`py-2 px-1 rounded transition-colors ${currentStep >= 4 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
            <span className="block text-[10px] text-stone-400">Step 4</span>
            <span>예산 & 완성</span>
          </div>
        </div>
        {/* Progress Line */}
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className="bg-[#233532] h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-10 shadow-sm relative min-h-[460px] flex flex-col justify-between">
        {isLoading ? (
          <div className="my-auto py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-3 border-stone-200 border-t-[#233532] rounded-full animate-spin mb-6" />
            <h3 className="font-serif-kr text-xl font-bold text-stone-900 mb-2">
              일정을 정밀 분석하고 있습니다
            </h3>
            <p className="text-sm text-stone-600 animate-pulse">
              {loadingStepText}
            </p>
            <span className="text-xs text-stone-400 mt-6">
              식사 선택지 5종, 교통 요금 및 단계별 환승 가이드를 구성 중입니다.
            </span>
          </div>
        ) : (
          <div>
            {/* Step 1: 기본 정보 */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="font-serif-kr text-xl font-bold text-stone-900 mb-1">
                    어디로, 언제 떠나시나요?
                  </h3>
                  <p className="text-xs text-stone-500">
                    목적지와 일정을 입력하면 현지 계절 및 축제 시기가 자동 반영됩니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 목적지 */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      여행 목적지 (필수)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={formData.primaryDestination}
                        onChange={(e) => setFormData({ ...formData, primaryDestination: e.target.value })}
                        placeholder="예: 교토, 로마, 쉐프샤우엔, 우유니, 뉴욕 등"
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                      />
                    </div>
                  </div>

                  {/* 여행 기간 / 날짜 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1.5">출발일</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1.5">도착일</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 경유지 추가 */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    경유지 추가 (선택)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTransitStop}
                      onChange={(e) => setNewTransitStop(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTransitStop();
                        }
                      }}
                      placeholder="함께 들르고 싶은 도시 또는 명소 (예: 나라, 우지)"
                      className="flex-1 px-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddTransitStop}
                      className="px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer shrink-0"
                    >
                      추가
                    </button>
                  </div>

                  {formData.transitStops.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {formData.transitStops.map((stop, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-800 text-xs rounded-full border border-stone-200"
                        >
                          <span>{idx + 1}. {stop}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTransitStop(idx)}
                            className="text-stone-400 hover:text-stone-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 인원수 */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    여행 인원 (성인 / 청소년 / 유아)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-md flex items-center justify-between">
                      <span className="text-xs text-stone-700">성인 (만 18세 이상)</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.groupMembers.adults}
                        onChange={(e) => setFormData({
                          ...formData,
                          groupMembers: { ...formData.groupMembers, adults: Number(e.target.value) || 1 },
                        })}
                        className="w-14 px-2 py-1 text-center font-bold text-sm bg-white border border-stone-300 rounded"
                      />
                    </div>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-md flex items-center justify-between">
                      <span className="text-xs text-stone-700">청소년 (만 12~17세)</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formData.groupMembers.teens}
                        onChange={(e) => setFormData({
                          ...formData,
                          groupMembers: { ...formData.groupMembers, teens: Number(e.target.value) || 0 },
                        })}
                        className="w-14 px-2 py-1 text-center font-bold text-sm bg-white border border-stone-300 rounded"
                      />
                    </div>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-md flex items-center justify-between">
                      <span className="text-xs text-stone-700">유아 (만 0~11세)</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formData.groupMembers.children}
                        onChange={(e) => setFormData({
                          ...formData,
                          groupMembers: { ...formData.groupMembers, children: Number(e.target.value) || 0 },
                        })}
                        className="w-14 px-2 py-1 text-center font-bold text-sm bg-white border border-stone-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: 동행 상황 & 여행 형태 */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="font-serif-kr text-xl font-bold text-stone-900 mb-1">
                    동행자 상황과 여행 형태를 알려주세요
                  </h3>
                  <p className="text-xs text-stone-500">
                    부모님의 보행 거리, 유모차 진입 여부, 알러지 표기 카드를 맞춤 준비합니다.
                  </p>
                </div>

                {/* 여행 형태 */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-2">여행 형태</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {travelStyles.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelStyle: style })}
                        className={`py-2 px-3 text-xs rounded-md border text-center transition-all cursor-pointer ${
                          formData.travelStyle === style
                            ? 'bg-[#233532] text-white font-semibold border-[#233532]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>

                  {formData.travelStyle === '직접입력' && (
                    <input
                      type="text"
                      placeholder="여행 형태를 직접 입력하세요 (예: 퇴사 기념 나홀로 쉼)"
                      value={formData.customTravelStyle || ''}
                      onChange={(e) => setFormData({ ...formData, customTravelStyle: e.target.value })}
                      className="mt-2 w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md"
                    />
                  )}
                </div>

                {/* 동행자 특이사항 체크박스 */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-2">
                    동행자 특이사항 (복수 선택)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: 'elderly', label: '어르신 (체력/계단 고려)' },
                      { key: 'toddler', label: '영유아 (유모차/수유실)' },
                      { key: 'pregnant', label: '임산부 (무리 없는 동선)' },
                      { key: 'medicalCondition', label: '지병 (병원/약국 비상망)' },
                      { key: 'allergies', label: '식품 알러지 (성분표 확인)' },
                      { key: 'disability', label: '장애 (휠체어/경사로 필수)' },
                      { key: 'dietaryRestriction', label: '채식 / 할랄 / 글루텐프리' },
                    ].map(({ key, label }) => {
                      const isChecked = !!(formData.companionCondition as any)[key];
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              companionCondition: {
                                ...formData.companionCondition,
                                [key]: !isChecked,
                              },
                            });
                          }}
                          className={`p-2.5 text-xs rounded-md border text-left flex items-center justify-between cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-amber-50/80 border-amber-300 text-stone-900 font-semibold'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span>{label}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="동행자 특이사항 세부 메모 (예: 70대 부모님 무릎 수술 이력, 갑각류 알러지)"
                      value={formData.companionCondition.notes}
                      onChange={(e) => setFormData({
                        ...formData,
                        companionCondition: {
                          ...formData.companionCondition,
                          notes: e.target.value,
                        },
                      })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md"
                    />
                  </div>
                </div>

                {/* 반려동물 동반 */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <Dog className="w-4 h-4 text-stone-600" />
                      반려동물 동반 여부
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        petCondition: {
                          ...formData.petCondition,
                          hasPet: !formData.petCondition.hasPet,
                        },
                      })}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                        formData.petCondition.hasPet
                          ? 'bg-[#233532] text-white'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {formData.petCondition.hasPet ? '동반함 (ON)' : '동반 안 함'}
                    </button>
                  </div>

                  {formData.petCondition.hasPet && (
                    <input
                      type="text"
                      placeholder="반려동물 종류 및 크기 (예: 소형견 비숑 4.5kg)"
                      value={formData.petCondition.typeAndSize}
                      onChange={(e) => setFormData({
                        ...formData,
                        petCondition: {
                          ...formData.petCondition,
                          typeAndSize: e.target.value,
                        },
                      })}
                      className="mt-3 w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-md"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 3: 선호 이동수단 & 키워드 */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="font-serif-kr text-xl font-bold text-stone-900 mb-1">
                    어떤 방식으로 즐기고 싶으신가요?
                  </h3>
                  <p className="text-xs text-stone-500">
                    선호 이동수단 기준으로 요금과 승차 위치를 계산하고, 키워드에 맞는 활동을 배치합니다.
                  </p>
                </div>

                {/* 선호 이동수단 */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-2">
                    선호 이동수단 (복수 선택)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {transitOptions.map((t) => {
                      const isSelected = formData.preferredTransits.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFormData({
                                ...formData,
                                preferredTransits: formData.preferredTransits.filter((x) => x !== t),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferredTransits: [...formData.preferredTransits, t],
                              });
                            }
                          }}
                          className={`p-3 text-xs rounded-md border text-center font-medium cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#233532] text-white border-[#233532]'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 취향 키워드 */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-2">
                    여행 테마 키워드 (복수 선택)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {keywordOptions.map((kw) => {
                      const isSelected = formData.keywords.includes(kw);
                      return (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFormData({
                                ...formData,
                                keywords: formData.keywords.filter((x) => x !== kw),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                keywords: [...formData.keywords, kw],
                              });
                            }
                          }}
                          className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 border-amber-300 text-stone-900 font-semibold shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {kw}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: 예산 및 최종 확인 */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="font-serif-kr text-xl font-bold text-stone-900 mb-1">
                    예산과 마무리 옵션을 설정해 주세요
                  </h3>
                  <p className="text-xs text-stone-500">
                    예산 소진율 그래프와 함께, 초과 시 실시간 절약 팁을 자동 제공합니다.
                  </p>
                </div>

                {/* 예산 금액 & 유형 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      예산 금액 ({formData.budget.currency})
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={formData.budget.amount}
                      onChange={(e) => setFormData({
                        ...formData,
                        budget: { ...formData.budget, amount: Number(e.target.value) || 0 },
                      })}
                      className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md font-bold text-stone-900 focus:bg-white"
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      약 {formData.budget.amount.toLocaleString()} {formData.budget.currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1.5">예산 기준</label>
                      <select
                        value={formData.budget.type}
                        onChange={(e) => setFormData({
                          ...formData,
                          budget: { ...formData.budget, type: e.target.value as any },
                        })}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md"
                      >
                        <option value="total">전체 총액</option>
                        <option value="perPerson">1인당 기준</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1.5">통화 단위</label>
                      <select
                        value={formData.budget.currency}
                        onChange={(e) => setFormData({
                          ...formData,
                          budget: { ...formData.budget, currency: e.target.value as any },
                        })}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md"
                      >
                        <option value="KRW">KRW (원)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 항공/숙박 포함 여부 토글 */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      항공권 및 호텔 숙박비 포함 여부
                    </span>
                    <span className="text-xs text-stone-500">
                      체크 시 전체 예산에서 항공/숙박을 제외한 현지 식비·교통·투어 순수 활동비로 자동 안배합니다.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.budget.includesFlightAndHotel}
                    onChange={(e) => setFormData({
                      ...formData,
                      budget: { ...formData.budget, includesFlightAndHotel: e.target.checked },
                    })}
                    className="w-5 h-5 accent-[#233532] cursor-pointer"
                  />
                </div>

                {/* 요약 카드 */}
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-md text-xs text-stone-700 space-y-1">
                  <div className="font-semibold text-amber-900 mb-1">설정된 여행 요약</div>
                  <p>• 목적지: {formData.primaryDestination} ({formData.durationDays}박 {formData.durationDays + 1}일)</p>
                  <p>• 여행 형태: {formData.travelStyle} / 인원 {formData.groupMembers.adults}명</p>
                  <p>• 동행 케어: {[
                    formData.companionCondition.elderly ? '어르신' : '',
                    formData.companionCondition.toddler ? '유아' : '',
                    formData.companionCondition.pregnant ? '임산부' : '',
                    formData.companionCondition.allergies ? '알러지' : '',
                  ].filter(Boolean).join(', ') || '표준 일정'}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Step Navigation Actions */}
        {!isLoading && (
          <div className="pt-8 border-t border-stone-100 flex items-center justify-between gap-4 mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전 단계</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#233532] hover:bg-[#182523] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>다음 단계</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGeneratePlan}
                className="px-7 py-3 text-xs sm:text-sm font-semibold text-stone-900 bg-[#E8E2D2] hover:bg-[#F2ECE0] rounded-md transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-800" />
                <span>맞춤 여행 플랜 생성하기</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
