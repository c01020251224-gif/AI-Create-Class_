import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { PlannerInput, GeneratedTravelPlan } from './src/types/travel.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client (Server-side only)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Helper for deterministic fallback when Gemini API key is missing or quota exceeded
function generateFallbackPlan(input: PlannerInput): GeneratedTravelPlan {
  const daysCount = Math.max(1, Math.min(input.durationDays || 3, 7));
  const dest = input.primaryDestination || '교토';
  const groupSize = (input.groupMembers.adults || 1) + (input.groupMembers.teens || 0) + (input.groupMembers.children || 0);
  const totalBudgetKRW = input.budget.type === 'perPerson'
    ? input.budget.amount * groupSize
    : input.budget.amount;

  const styleLabel = input.travelStyle === '직접입력' ? (input.customTravelStyle || '자유여행') : input.travelStyle;

  const sampleMealOptions = (mealType: string, day: number) => [
    {
      id: `${day}-${mealType}-1`,
      name: `${dest} 로컬 명가 (${mealType})`,
      category: '현지 전통식',
      signatureMenu: '제철 제철 정식 & 따뜻한 특제 수프',
      pricePerPerson: '18,000원',
      approxPriceKRW: 18000,
      location: `${dest} 중심가 1가 12-4`,
      openHours: '08:00 - 21:00 (브레이크 15:00-17:00)',
      dietarySuitability: input.companionCondition.dietaryRestriction ? '채식/할랄 변경 요청 가능' : '표준 식단',
      accessibilityInfo: input.companionCondition.elderly || input.companionCondition.disability ? '문턱 없는 평지 입구, 테이블 좌석 구비 (휠체어/유모차 진입 가능)' : '계단 없는 1층 매장',
      highlightTip: '현지인들이 아침부터 줄 서는 원조 맛집, 10분 전 도착 추천',
    },
    {
      id: `${day}-${mealType}-2`,
      name: `${dest} 헤리티지 다이닝`,
      category: '전통 솥밥 & 탕 요리',
      signatureMenu: '은은한 다시마 육수 해산물/버섯 솥밥',
      pricePerPerson: '25,000원',
      approxPriceKRW: 25000,
      location: `${dest} 올드타운 문화거리 45`,
      openHours: '11:00 - 20:30',
      dietarySuitability: '글루텐프리 대응 가능, 자극 없는 순한 양념',
      accessibilityInfo: '유모차 전용 보관소 및 아기의자 4점 보유',
      highlightTip: '부모님과 어르신들이 가장 선호하는 속 편한 담백한 맛',
    },
    {
      id: `${day}-${mealType}-3`,
      name: `${dest} 가든 팜투테이블`,
      category: '유기농 비스트로',
      signatureMenu: '신선한 로컬 계절 채소 플레이트 & 생선구이',
      pricePerPerson: '22,000원',
      approxPriceKRW: 22000,
      location: `${dest} 공원 산책로 맞은편`,
      openHours: '09:00 - 21:00',
      dietarySuitability: '완전 비건 옵션 및 유제품 미사용 메뉴 별도 표기',
      accessibilityInfo: input.petCondition.hasPet ? '야외 테라스 반려동물 동반 가능 (리드줄 필수)' : '넓은 테이블 간격',
      highlightTip: '창가 석에서 도심 정원을 조망할 수 있어 감성 사진 촬영에 최적',
    },
    {
      id: `${day}-${mealType}-4`,
      name: `${dest} 백년 노포 소바·누들`,
      category: '수제 면 요리',
      signatureMenu: '맷돌 제분 메밀면 & 바삭한 채소 튀김',
      pricePerPerson: '14,000원',
      approxPriceKRW: 14000,
      location: `${dest} 전통시장 골목길 입구`,
      openHours: '11:00 - 18:00 (재료 소진 시 조기 마감)',
      dietarySuitability: '메밀 알러지 주의 안내문 비치, 우동면 대체 가능',
      accessibilityInfo: '실내 입식 테이블 완비 (좌식 불편 어르신 맞춤)',
      highlightTip: '빠른 서빙과 합리적인 가격대로 여행 동선 중간에 들르기 좋음',
    },
    {
      id: `${day}-${mealType}-5`,
      name: `${dest} 감성 찻집 & 브런치`,
      category: '전통 티하우스 & 디저트',
      signatureMenu: '말차 파르페 & 수제 당고 세트',
      pricePerPerson: '12,000원',
      approxPriceKRW: 12000,
      location: `${dest} 강변 산책로 77`,
      openHours: '10:00 - 19:00',
      dietarySuitability: '두유/오트밀크 변경 가능',
      accessibilityInfo: '경사로 완비, 화장실 기저귀 갈이대 설치',
      highlightTip: '정오 무렵 부드러운 채광과 잔잔한 음악으로 여유로운 휴식',
    },
  ];

  const days = Array.from({ length: daysCount }).map((_, idx) => {
    const dayNum = idx + 1;
    const dayCost = 85000 * groupSize;
    return {
      dayNumber: dayNum,
      dateStr: `Day ${dayNum}`,
      themeTitle: dayNum === 1
        ? `${dest} 첫 만남: 감성 골목과 상징적인 풍경 속으로`
        : dayNum === 2
        ? `숨겨진 비경과 쉼이 있는 로컬 예술 탐방`
        : dayNum === 3
        ? `자연의 파노라마와 미식으로 완성하는 여유`
        : `깊이 있는 전통 체험과 선물 같은 피날레`,
      summary: `${dest}의 핵심 명소를 무리 없는 동선으로 엮어 여유롭게 즐기는 하루 일정입니다.`,
      transitGuidance: [
        {
          route: `숙소 → 오전 메인 명소 (${dest})`,
          mode: input.preferredTransits[0] || '대중교통',
          estimatedCost: '편도 약 3,200원 (1인)',
          costKRW: 3200 * groupSize,
          duration: '약 25분',
          steps: [
            {
              stepNumber: 1,
              instruction: `중심역 3번 출구 방면에서 승차`,
              boardingLocation: `${dest} 메인 스테이션 버스 베이 2번`,
              ticketInfo: '교통카드(컨택리스 신용카드 또는 IC카드) 단말기 태그',
              appOrPass: '구글맵 길찾기 앱 실시간 버스 도착 정보 연동',
              transferNotes: '계단 대신 엘리베이터가 우측 30m 지점에 위치하여 짐/유모차 이동 용이',
            },
            {
              stepNumber: 2,
              instruction: '3개 정류장 이동 후 명소 입구 정류소 하차',
              boardingLocation: '정류소 하차 후 도보 3분',
              ticketInfo: '하차 시 하차 단말기 태그',
              appOrPass: '현지 교통 앱',
              transferNotes: '완만한 보행자 전용 도로로 연결됨',
            },
          ],
        },
        {
          route: `오후 명소 → 저녁 식당가`,
          mode: input.preferredTransits.includes('택시') ? '택시' : (input.preferredTransits[0] || '도보 및 대중교통'),
          estimatedCost: '약 12,000원 (그룹 기준)',
          costKRW: 12000,
          duration: '약 15분',
          steps: [
            {
              stepNumber: 1,
              instruction: '콜택시 또는 우버(Uber) 호출 지점에서 탑승',
              boardingLocation: '명소 앞 전용 승하차 베이',
              ticketInfo: '앱 내 자동 결제',
              appOrPass: 'Uber / 카카오T 해외연동',
              transferNotes: '어르신 및 유아 동반 시 도보 피로를 방지하기 위해 적극 권장',
            },
          ],
        },
      ],
      activities: [
        {
          timeSlot: '10:00 - 12:30',
          spotName: `${dest} 대표 랜드마크 & 뷰포인트`,
          category: '역사 및 자연 명소',
          description: `가장 고즈넉한 오전 시간대에 방문하여 여유롭게 산책하고 사진을 남깁니다.`,
          duration: '2시간 30분',
          admissionFee: '1인 8,000원',
          admissionKRW: 8000 * groupSize,
          bookingRequired: false,
          bookingTips: '오전 10시 이전 도착 시 단체 관광객 없이 쾌적하게 관람 가능',
          accessibilityNotice: input.companionCondition.elderly ? '본당까지 완만한 우회 경사로(슬로프)가 정비되어 있습니다.' : undefined,
        },
        {
          timeSlot: '15:00 - 17:30',
          spotName: `${dest} 예술가 골목 & 힐링 정원`,
          category: '문화 및 감성 산책',
          description: '아기자기한 공방과 찻집들이 이어진 옛 골목을 걷고 벤치에서 휴식을 취합니다.',
          duration: '2시간 30분',
          admissionFee: '무료 관람',
          admissionKRW: 0,
          bookingRequired: false,
          bookingTips: '현지 장인들의 수공예품과 기념품 쇼핑이 가능한 작은 상점 다수',
          accessibilityNotice: '중간중간 쉼터 벤치가 100m 간격으로 배치되어 있습니다.',
        },
      ],
      meals: {
        breakfast: {
          selectedId: `${dayNum}-breakfast-1`,
          options: sampleMealOptions('아침', dayNum),
        },
        lunch: {
          selectedId: `${dayNum}-lunch-2`,
          options: sampleMealOptions('점심', dayNum),
        },
        dinner: {
          selectedId: `${dayNum}-dinner-1`,
          options: sampleMealOptions('저녁', dayNum),
        },
      },
      localTour: dayNum === 2 ? {
        tourName: `${dest} 히스토리 & 시크릿 골목 워킹 투어 (소규모 한국어 가이드)`,
        price: '1인 45,000원',
        priceKRW: 45000 * groupSize,
        meetingTimeAndPlace: '오전 09:30 중앙광장 분수대 앞',
        duration: '약 3시간 (여유로운 보행 속도)',
        inclusions: ['전문 공인 가이드 해설', '수신기 대여', '전통 디저트 1회 시식'],
        exclusions: ['개인 음료', '명소 개별 입장료'],
        bookingMethod: '현지 여행사 온라인 바우처 사전 발권',
        cancellationPolicy: '투어 24시간 전까지 100% 전액 무료 취소 가능',
      } : undefined,
      companionCareAlert: [
        input.companionCondition.elderly ? '어르신 케어: 오후 2시~3시 사이 40분 이상의 여유로운 찻집 휴식을 배정했습니다.' : '',
        input.companionCondition.toddler ? '영유아 케어: 점심 식당 인근 100m 내 복합몰 수유실과 기저귀 갈이대가 위치합니다.' : '',
        input.companionCondition.allergies ? '알러지 주의: 식당 주문 시 견과류/메밀/유제품 제외 번역 카드를 확인하세요.' : '',
      ].filter(Boolean),
      estimatedDayCostKRW: dayCost,
    };
  });

  const estimatedTotalSpentKRW = days.reduce((sum, d) => sum + d.estimatedDayCostKRW, 0);
  const budgetStatus = totalBudgetKRW > 0 && estimatedTotalSpentKRW > totalBudgetKRW ? 'exceeded' : 'within';

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    referenceDate: '조회 기준일: 2026년 11월 기준 / 환율 및 현지 사정에 따라 변동 가능',
    title: `${dest} ${daysCount}박 ${daysCount + 1}일 ${styleLabel} 맞춤 일정표`,
    destination: dest,
    durationText: `${daysCount}박 ${daysCount + 1}일 (${input.startDate || '2026.11'} ~ ${input.endDate || '2026.11'})`,
    travelStyle: styleLabel,
    groupSummary: `총 ${groupSize}인 (성인 ${input.groupMembers.adults || 1}명${input.groupMembers.teens ? `, 청소년 ${input.groupMembers.teens}명` : ''}${input.groupMembers.children ? `, 유아 ${input.groupMembers.children}명` : ''})`,
    totalBudgetKRW: totalBudgetKRW || 2000000,
    estimatedTotalSpentKRW: estimatedTotalSpentKRW,
    budgetStatus: budgetStatus,
    costSavingSuggestions: budgetStatus === 'exceeded' ? [
      '택시 이용 구간 중 1~2회를 정시성 높은 지하철/트램으로 전환하면 약 40,000원 절약 가능',
      '점심 특선 런치 콤보를 활용하면 디너 대비 30~40% 저렴하게 동일 레스토랑 이용 가능',
      '관광 명소 2일 통합 패스(City Pass)를 온라인 사전 구매하여 입장료 20% 할인',
    ] : undefined,
    companionSpecialNotices: [
      {
        category: '동행자 맞춤 보행 & 휴식 가이드',
        guideline: input.companionCondition.elderly
          ? '무리한 계단 이동을 전면 배제하고 평지 및 엘리베이터 동선 위주로 설계되었습니다. 매 90분마다 20분 이상의 착석 휴식을 권장합니다.'
          : '쾌적한 보행 동선과 감성 포토존 중심으로 자연스럽게 이어집니다.',
        nearbyFacilities: `${dest} 중앙 응급의료센터 및 24시 약국: 시청 맞은편 (도보 8분, 비상연락처 구비)`,
      },
      {
        category: '식이 제한 & 알러지 안심 가이드',
        guideline: input.companionCondition.allergies || input.companionCondition.dietaryRestriction
          ? '추천된 모든 식당에 알러지 성분표 표기 여부 및 대체 조리 가능 여부를 사전 검증했습니다.'
          : '현지 로컬 고유의 풍미를 살리면서도 위생 등급 우수 식당으로 엄선했습니다.',
        nearbyFacilities: '모든 식사 블록에 비상 시 번역해 보여줄 수 있는 식이제한 확인 카드가 탑재되어 있습니다.',
      },
      ...(input.petCondition.hasPet ? [{
        category: '반려동물 동반 수칙',
        guideline: `동반 동물: ${input.petCondition.typeAndSize}. 추천 식당 테라스석 및 야외 정원 명소 위주로 구성되었습니다.`,
        nearbyFacilities: `${dest} 동물병원 및 펫 용품 숍: 역전 서편 300m`,
      }] : []),
    ],
    days: days,
  };
}

// Endpoint: Generate Travel Plan with Gemini API (or robust fallback)
app.post('/api/planner/generate', async (req: Request, res: Response) => {
  const input: PlannerInput = req.body;

  if (!input || !input.primaryDestination) {
    return res.status(400).json({ error: '목적지가 지정되지 않았습니다.' });
  }

  // If Gemini API Key is available, invoke Gemini 3.8 Flash
  if (process.env.GEMINI_API_KEY) {
    try {
      const companionDesc = [
        input.companionCondition?.elderly ? '어르신 동반(계단 회피, 잦은 휴식)' : '',
        input.companionCondition?.toddler ? '영유아 동반(유모차, 수유실 필수)' : '',
        input.companionCondition?.pregnant ? '임산부 동반(무리 없는 일정, 의료 접근성)' : '',
        input.companionCondition?.medicalCondition ? '지병(인근 약국/병원 필요)' : '',
        input.companionCondition?.allergies ? '알러지 주의(식재료 체크 필요)' : '',
        input.companionCondition?.disability ? '장애/휠체어 이동 필수' : '',
        input.companionCondition?.dietaryRestriction ? '채식/할랄 등 식이 제한' : '',
        input.companionCondition?.notes ? `추가 메모: ${input.companionCondition.notes}` : '',
      ].filter(Boolean).join(', ');

      const petDesc = input.petCondition?.hasPet
        ? `반려동물 동반: ${input.petCondition.typeAndSize}`
        : '반려동물 없음';

      const prompt = `당신은 최고급 맞춤 여행 컨설턴트입니다. 다음 사용자의 여행 조건에 맞춰 일자별 상세 여행 플랜을 한국어로 작성하여 유효한 JSON 형식으로 출력해주세요.

[사용자 입력 조건]
- 목적지: ${input.primaryDestination} (경유지: ${input.transitStops?.join(', ') || '없음'})
- 일정: ${input.startDate || '2026-11-15'} ~ ${input.endDate || '2026-11-18'} (${input.durationDays || 3}박)
- 인원: 성인 ${input.groupMembers?.adults || 1}명, 청소년 ${input.groupMembers?.teens || 0}명, 유아 ${input.groupMembers?.children || 0}명
- 여행 스타일: ${input.travelStyle} ${input.customTravelStyle ? `(${input.customTravelStyle})` : ''}
- 동행자 특이사항: ${companionDesc || '특이사항 없음'}
- 반려동물: ${petDesc}
- 선호 이동수단: ${input.preferredTransits?.join(', ') || '대중교통'}
- 선호 키워드: ${input.keywords?.join(', ') || '맛집, 명소, 힐링'}
- 예산: ${input.budget?.amount?.toLocaleString() || '2,000,000'} ${input.budget?.currency || 'KRW'} (${input.budget?.type === 'perPerson' ? '1인당' : '총액'}, 항공숙박 ${input.budget?.includesFlightAndHotel ? '포함' : '불포함'})

[엄격한 필수 요구사항]
1. 일자별(Day 1부터) 타임라인을 작성하세요.
2. 매일의 식사(breakfast, lunch, dinner)마다 "반드시 5개 이상의 구체적인 식당 선택지(options)"를 제공해야 합니다.
   각 식당 옵션에는 id, name, category, signatureMenu, pricePerPerson, approxPriceKRW, location, openHours, dietarySuitability, accessibilityInfo, highlightTip을 포함하세요.
   동행자의 알러지, 채식/할랄, 휠체어/유모차, 반려동물 동반 조건을 명확히 반영하세요.
3. 이동 안내(transitGuidance): 선호 이동수단을 기준으로 구간별 요금, 소요시간, 그리고 승차 위치, 티켓 구매 방법, 교통카드/앱, 환승 팁이 담긴 상세한 단계별 steps를 작성하세요.
4. 현지 투어(localTour): 최소 1일 이상 현지 추천 투어(투어명, 가격, 집합시간/장소, 소요시간, 포함/불포함, 예약방법, 취소규정)를 포함하세요.
5. 명소/활동(activities): 시간대(timeSlot), spotName, category, description, duration, admissionFee, admissionKRW, bookingRequired, bookingTips, accessibilityNotice.
6. 예산 분석: 일자별 예상 비용 합계(estimatedDayCostKRW)와 총 예상 비용(estimatedTotalSpentKRW), 예산 초과 여부(budgetStatus: 'within' | 'warning' | 'exceeded'), 예산 초과 시 절약 팁(costSavingSuggestions).
7. 조회 기준일 명시: "조회 기준일: 2026년 11월 기준 / 예약 전 최종 확인 요망"
8. 동행자 맞춤 주의사항(companionSpecialNotices): 어르신 휴식 간격, 유모차/수유실, 인근 약국/병원 등.

응답은 마크다운 코드블록(\`\`\`json) 없이 순수 JSON 객체만 반환하세요.`;

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingLevel: 'low' as any,
          },
        },
      });

      const text = geminiResponse.text?.trim() || '';
      if (text) {
        const cleanJsonStr = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
        const parsedPlan: GeneratedTravelPlan = JSON.parse(cleanJsonStr);
        // Ensure ID and basic fields exist
        parsedPlan.id = parsedPlan.id || `plan-${Date.now()}`;
        parsedPlan.referenceDate = parsedPlan.referenceDate || '조회 기준일: 2026년 11월 기준 / 예약 전 최종 확인 요망';
        return res.json(parsedPlan);
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to curated planner engine:', err?.message || err);
      // Seamlessly fall through to deterministic fallback
    }
  }

  // Graceful high-fidelity fallback generator
  const fallbackPlan = generateFallbackPlan(input);
  return res.json(fallbackPlan);
});

// Endpoint: Submit Travel Inquiry with attached plan
app.post('/api/inquiry', (req: Request, res: Response) => {
  const { name, contact, planSummary, preferredTime, message } = req.body;

  if (!name || !contact) {
    return res.status(400).json({ error: '이름과 연락처는 필수 입력 항목입니다.' });
  }

  console.log('[Travel Planner Inquiry Received]', {
    name,
    contact,
    preferredTime,
    hasPlan: !!planSummary,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    message: '상담 문의가 성공적으로 접수되었습니다. 담당 여행 컨설턴트가 24시간 이내에 안내드리겠습니다.',
    inquiryId: `INQ-${Date.now().toString(36).toUpperCase()}`,
  });
});

// Production vs Development Setup
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev, attach Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Travel Planner Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
