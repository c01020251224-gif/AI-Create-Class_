export type Continent = '아시아' | '유럽' | '아프리카' | '북미' | '남미' | '오세아니아' | '중동';

export type DestinationTrack = 'iconic' | 'hidden';

export interface Destination {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  continent: Continent;
  track: DestinationTrack; // 'iconic' (대표) | 'hidden' (숨은 이색)
  image: string;
  tagline: string;
  recommendedSeason: string;
  suggestedDuration: string;
  accessibility: string;
  description: string;
  topSpots: { name: string; desc: string; time: string }[];
  localTips: string[];
  visaAndSafety: {
    visa: string;
    safetyLevel: string;
    notes: string;
  };
}

export interface Festival {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  city: string;
  month: number; // 1-12
  period: string;
  origin: string;
  image: string;
  tips: string[];
  earlyBookingAlert: string;
  lat: number;
  lng: number;
}

export interface Dish {
  name: string;
  nameOriginal: string;
  taste: string;
  eatingGuide: string;
  priceRange: string;
  allergens: string[];
  dietaryTags: ('비건' | '채식' | '할랄' | '글루텐프리' | '유제품프리')[];
}

export interface CountryCuisine {
  id: string;
  country: string;
  cultureName: string;
  tagline: string;
  image: string;
  etiquette: string[];
  orderingTips: string[];
  dishes: Dish[];
}

export type TravelStyle =
  | '효도관광'
  | '태교여행'
  | '커플'
  | '허니문'
  | '가족'
  | '동창회'
  | '동호회'
  | '혼자여행'
  | '우정여행'
  | '워케이션'
  | '직접입력';

export interface CompanionCondition {
  elderly: boolean; // 어르신
  toddler: boolean; // 영유아
  pregnant: boolean; // 임산부
  medicalCondition: boolean; // 지병
  allergies: boolean; // 알러지
  disability: boolean; // 장애 (휠체어 등)
  dietaryRestriction: boolean; // 채식/할랄 등
  notes: string; // 특이사항 메모
}

export interface PetCondition {
  hasPet: boolean;
  typeAndSize: string; // 예: 소형견 (포메라니안 4kg)
}

export type TransitPreference = '대중교통' | '렌터카' | '택시' | '도보' | '자전거' | '기차';

export type TravelKeyword =
  | '맛집'
  | '명소'
  | '쇼핑'
  | '유적지'
  | '호캉스'
  | '놀이동산'
  | '자연'
  | '야경'
  | '액티비티'
  | '사진'
  | '휴식'
  | '온천/스파';

export interface PlannerInput {
  startDate: string;
  endDate: string;
  durationDays: number;
  primaryDestination: string;
  transitStops: string[]; // 경유지
  groupMembers: {
    adults: number;
    teens: number;
    children: number;
  };
  travelStyle: TravelStyle;
  customTravelStyle?: string;
  companionCondition: CompanionCondition;
  petCondition: PetCondition;
  preferredTransits: TransitPreference[];
  keywords: TravelKeyword[];
  budget: {
    amount: number;
    type: 'total' | 'perPerson'; // 총액 vs 1인당
    currency: 'KRW' | 'USD' | 'EUR' | 'JPY';
    includesFlightAndHotel: boolean; // 항공·숙박 포함 여부
  };
}

export interface MealChoice {
  id: string;
  name: string;
  category: string;
  signatureMenu: string;
  pricePerPerson: string;
  approxPriceKRW: number;
  location: string;
  openHours: string;
  dietarySuitability: string; // 예: 채식 옵션 구비, 글루텐프리 가능
  accessibilityInfo: string; // 예: 엘리베이터 완비, 유모차 및 휠체어 진입 수월, 반려동물 야외테라스 동반 가능
  highlightTip: string;
}

export interface TransitGuidance {
  route: string;
  mode: string;
  estimatedCost: string;
  costKRW: number;
  duration: string;
  steps: {
    stepNumber: number;
    instruction: string;
    boardingLocation: string;
    ticketInfo: string;
    appOrPass: string;
    transferNotes?: string;
  }[];
}

export interface LocalTourOption {
  tourName: string;
  price: string;
  priceKRW: number;
  meetingTimeAndPlace: string;
  duration: string;
  inclusions: string[];
  exclusions: string[];
  bookingMethod: string;
  cancellationPolicy: string;
}

export interface ActivitySpot {
  timeSlot: string; // "10:00 - 12:30"
  spotName: string;
  category: string;
  description: string;
  duration: string;
  admissionFee: string;
  admissionKRW: number;
  bookingRequired: boolean;
  bookingTips: string;
  accessibilityNotice?: string;
}

export interface DayItinerary {
  dayNumber: number;
  dateStr: string;
  themeTitle: string;
  summary: string;
  transitGuidance: TransitGuidance[];
  activities: ActivitySpot[];
  meals: {
    breakfast: {
      selectedId: string;
      options: MealChoice[];
    };
    lunch: {
      selectedId: string;
      options: MealChoice[];
    };
    dinner: {
      selectedId: string;
      options: MealChoice[];
    };
  };
  localTour?: LocalTourOption;
  companionCareAlert: string[];
  estimatedDayCostKRW: number;
}

export interface GeneratedTravelPlan {
  id: string;
  createdAt: string;
  referenceDate: string; // 조회 기준일 (2026년 11월 기준)
  title: string;
  destination: string;
  durationText: string;
  travelStyle: string;
  groupSummary: string;
  totalBudgetKRW: number;
  estimatedTotalSpentKRW: number;
  budgetStatus: 'within' | 'warning' | 'exceeded';
  costSavingSuggestions?: string[];
  companionSpecialNotices: {
    category: string;
    guideline: string;
    nearbyFacilities: string; // 인근 약국/병원/수유실 등
  }[];
  days: DayItinerary[];
}
