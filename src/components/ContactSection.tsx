import React, { useState, useEffect } from 'react';
import { Phone, Mail, Send, CheckCircle2, AlertCircle, FileText, Clock } from 'lucide-react';
import { GeneratedTravelPlan } from '../types/travel';

interface ContactSectionProps {
  attachedPlan: GeneratedTravelPlan | null;
  onClearAttachedPlan: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  attachedPlan,
  onClearAttachedPlan,
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('평일 오후 (13:00~18:00)');
  const [includePlan, setIncludePlan] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    inquiryId?: string;
  } | null>(null);

  useEffect(() => {
    if (attachedPlan) {
      setIncludePlan(true);
    }
  }, [attachedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          preferredTime,
          message: message.trim(),
          planSummary: includePlan && attachedPlan ? {
            title: attachedPlan.title,
            destination: attachedPlan.destination,
            duration: attachedPlan.durationText,
            budget: `${attachedPlan.totalBudgetKRW.toLocaleString()}원`,
            groupSummary: attachedPlan.groupSummary,
          } : null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitResult({
          success: true,
          message: data.message || '상담 문의가 성공적으로 접수되었습니다.',
          inquiryId: data.inquiryId,
        });
        setName('');
        setContact('');
        setMessage('');
      } else {
        setSubmitResult({
          success: false,
          message: data.error || '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        });
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        message: '네트워크 연결 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 border-t border-stone-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-500 uppercase mb-2">
              <span>Direct Concierge Desk</span>
              <span aria-hidden="true">·</span>
              <span>1:1 여행 컨설팅</span>
            </div>
            <h2 className="font-serif-kr text-3xl sm:text-4xl text-stone-900 font-normal leading-tight break-keep">
              당신만의 완벽한 여정을 위해<br />
              언제든 편안하게 말씀해 주세요
            </h2>
            <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed break-keep">
              AI가 설계한 일정표를 기반으로, 현지 프라이빗 차량 대절과 특급 호텔 예약,<br className="hidden sm:inline" />
              전담 가이드 및 비자 대행까지 원스톱으로 맞춤 지원합니다.
            </p>

            {/* Direct Connect Buttons (tel: and mailto:) */}
            <div className="mt-8 space-y-4">
              {/* Phone Button */}
              <a
                href="tel:010-0000-1111"
                className="flex items-center gap-4 p-4 bg-white border border-stone-200/90 rounded-xl hover:border-stone-400 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 group-hover:bg-[#233532] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-medium block">직통 전화 상담 (터치 시 통화 연결)</span>
                  <span className="text-base font-bold text-stone-900 font-mono tracking-wide">010-0000-1111</span>
                </div>
              </a>

              {/* Email Button */}
              <a
                href="mailto:contact@travelplanner.co.kr?subject=%EC%97%AC%ED%96%89%20%EB%A7%9E%EC%B6%A4%20%EC%83%81%EB%8B%B4%20%EB%AC%B8%EC%9D%98"
                className="flex items-center gap-4 p-4 bg-white border border-stone-200/90 rounded-xl hover:border-stone-400 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 group-hover:bg-[#233532] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-medium block">공식 이메일 상담 (메일 앱 연결)</span>
                  <span className="text-base font-bold text-stone-900 font-mono">contact@travelplanner.co.kr</span>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200 text-xs text-stone-500 flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-400 shrink-0" />
            <span>상담 운영 시간: 평일 09:30 ~ 18:30 (주말 및 공휴일 긴급 상담 지원)</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-10 shadow-sm">
            <h3 className="font-serif-kr text-xl font-bold text-stone-900 mb-1">
              온라인 맞춤 상담 신청서
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              남겨주신 내용을 바탕으로 전문 여행 플래너가 24시간 이내에 연락드립니다.
            </p>

            {submitResult && (
              <div
                className={`p-4 rounded-lg mb-6 flex items-start gap-3 text-xs ${
                  submitResult.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {submitResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{submitResult.message}</p>
                  {submitResult.inquiryId && (
                    <p className="mt-1 text-emerald-800">
                      접수 번호: <strong className="font-mono">{submitResult.inquiryId}</strong>
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Attached Plan Card */}
              {attachedPlan && (
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-amber-950 block">생성된 AI 여행 플랜 자동 첨부</span>
                      <span className="text-stone-700">{attachedPlan.title}</span>
                      <span className="text-stone-500 block text-[11px] mt-0.5">
                        {attachedPlan.durationText} · {attachedPlan.groupSummary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includePlan}
                        onChange={(e) => setIncludePlan(e.target.checked)}
                        className="accent-[#233532]"
                      />
                      <span>첨부 포함</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    성함 (필수)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    연락처 (필수)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="010-1234-5678"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  상담 희망 시간대
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md"
                >
                  <option value="평일 오전 (09:30~12:00)">평일 오전 (09:30 ~ 12:00)</option>
                  <option value="평일 오후 (13:00~18:00)">평일 오후 (13:00 ~ 18:00)</option>
                  <option value="평일 저녁 (18:30~20:00)">평일 저녁 (18:30 ~ 20:00)</option>
                  <option value="문자/카카오톡 상담 희망">전화 대신 문자/카카오톡 상담 희망</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  여행 계획 요약 및 추가 요청사항
                </label>
                <textarea
                  rows={4}
                  placeholder="예: 70대 부모님 칠순 기념 여행으로 편안한 리무진 차량과 온천 료칸 숙박을 희망합니다."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                />
              </div>

              <div className="text-[11px] text-stone-500">
                수집된 성함과 연락처는 맞춤 여행 상담 서비스 제공을 위해서만 이용되며, 상담 완료 후 30일 이내 안전하게 파기됩니다.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#233532] hover:bg-[#182523] active:scale-[0.99] disabled:opacity-50 transition-all rounded-md shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? '접수 처리 중...' : '맞춤 여행 무료 상담 신청'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
