import React, { useState } from 'react';
import { Compass, Menu, X, Calendar, MapPin, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenPlanner: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenPlanner,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'destinations', label: '소개' },
    { id: 'festivals', label: '세계 축제' },
    { id: 'cuisines', label: '세계 음식' },
    { id: 'planner', label: 'AI 플래너' },
    { id: 'contact', label: '문의' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element, typography-driven) */}
        <button
          onClick={() => handleNavClick('hero')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 rounded"
        >
          <span className="font-serif-kr text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors whitespace-nowrap shrink-0">
            여행플래너
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative py-1 cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 ${
                activeSection === item.id ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <button
            onClick={onOpenPlanner}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider text-stone-50 bg-[#233532] hover:bg-[#182523] active:scale-[0.98] transition-all rounded-md shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            맞춤 플랜 시작
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-950 focus:outline-none"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF9F5] px-6 py-5 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4 text-base font-medium text-stone-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left py-2 hover:text-stone-950 border-b border-stone-100 last:border-none"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  onOpenPlanner();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center text-sm font-semibold text-stone-50 bg-[#233532] rounded-md shadow-sm"
              >
                맞춤 일정표 만들기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
