import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DestinationsSection } from './components/DestinationsSection';
import { FestivalsSection } from './components/FestivalsSection';
import { FoodSection } from './components/FoodSection';
import { AIPlannerWizard } from './components/AIPlannerWizard';
import { PlanResultView } from './components/PlanResultView';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GeneratedTravelPlan } from './types/travel';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [plannerDestination, setPlannerDestination] = useState<string>('교토');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedTravelPlan | null>(null);
  const [attachedPlanForInquiry, setAttachedPlanForInquiry] = useState<GeneratedTravelPlan | null>(null);

  const plannerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDestinationForPlanner = (destName: string) => {
    setPlannerDestination(destName);
    setGeneratedPlan(null); // Reset previous plan to focus on new destination
    scrollToSection('planner');
  };

  const handlePlanGenerated = (plan: GeneratedTravelPlan) => {
    setGeneratedPlan(plan);
    setAttachedPlanForInquiry(plan);
    // Smoothly scroll to results
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAttachToInquiry = (plan: GeneratedTravelPlan) => {
    setAttachedPlanForInquiry(plan);
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-[#233532] selection:text-white">
      {/* Top Fixed Navigation */}
      <Navbar
        onNavigate={scrollToSection}
        onOpenPlanner={() => scrollToSection('planner')}
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* Full-Bleed Editorial Hero */}
        <Hero
          onStartPlanning={() => scrollToSection('planner')}
          onExploreDestinations={() => scrollToSection('destinations')}
        />

        {/* 1. 소개: 엄선된 대륙별 명소 & 숨은 이색 여행지 */}
        <DestinationsSection
          onSelectForPlanner={handleSelectDestinationForPlanner}
        />

        {/* 2. 세계 축제 캘린더 & 월드 맵 */}
        <FestivalsSection
          onSelectFestivalDestination={handleSelectDestinationForPlanner}
        />

        {/* 3. 세계 음식 문화 & 식이/알러지 가이드 */}
        <FoodSection />

        {/* 4. AI 맞춤 여행 플래너 섹션 */}
        <div ref={plannerRef} className="border-t border-stone-200 bg-[#F4F1EA]/50">
          <AIPlannerWizard
            initialDestination={plannerDestination}
            onPlanGenerated={handlePlanGenerated}
          />
        </div>

        {/* 4-B. 생성된 플랜 결과 뷰 (타임라인, 5+ 식당 선택지, 이동 안내, 예산 게이지) */}
        {generatedPlan && (
          <div ref={resultRef} className="border-t border-stone-200 bg-white">
            <PlanResultView
              plan={generatedPlan}
              onModifyPlan={() => scrollToSection('planner')}
              onAttachToInquiry={handleAttachToInquiry}
            />
          </div>
        )}

        {/* 5. 1:1 맞춤 컨시어지 문의 (tel:, mailto:, 플랜 자동 첨부) */}
        <div ref={contactRef}>
          <ContactSection
            attachedPlan={attachedPlanForInquiry}
            onClearAttachedPlan={() => setAttachedPlanForInquiry(null)}
          />
        </div>
      </main>

      {/* Quiet Editorial Footer */}
      <Footer />
    </div>
  );
}
