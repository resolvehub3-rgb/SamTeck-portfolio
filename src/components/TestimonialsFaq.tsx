import React, { useState } from 'react';
import { 
  Quote, 
  Star, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  HelpCircle,
  MessageSquareQuote
} from 'lucide-react';
import { Testimonial, Faq } from '../types';
import { OptimizedImage } from './common/OptimizedImage';

interface TestimonialsFaqProps {
  testimonials: Testimonial[];
  faqs: Faq[];
}

export const TestimonialsFaq: React.FC<TestimonialsFaqProps> = ({ testimonials, faqs }) => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const activeTestimonials = testimonials.length > 0 ? testimonials : [];
  const activeFaqs = faqs.filter((f) => f.isActive !== false);

  const currentTestimonial = activeTestimonials[currentTestimonialIndex] || activeTestimonials[0];

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? activeTestimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === activeTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden bg-[#020B24] border-t border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#FF6A00] rounded-full blur-[160px] opacity-10 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          
          {/* Left Column: Testimonials Showcase */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Section Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>TESTIMONIALS</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-8">
                What Clients Say
              </h2>

              {/* Testimonial Card */}
              {currentTestimonial && (
                <div className="relative p-7 sm:p-8 rounded-2xl bg-[#0A1A3F] border border-white/5 shadow-2xl flex flex-col justify-between min-h-[300px]">
                  
                  {/* Quote Icon */}
                  <div className="text-[#FF6A00] mb-4">
                    <Quote className="w-10 h-10 text-[#FF6A00] opacity-90 fill-[#FF6A00]/20" />
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed italic mb-8">
                    "{currentTestimonial.testimonialText}"
                  </p>

                  {/* Client Info & Star Rating */}
                  <div className="pt-5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <OptimizedImage
                        src={currentTestimonial.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                        alt={currentTestimonial.clientName}
                        sizes="48px"
                        containerClassName="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF6A00]/40 shrink-0"
                        className="w-full h-full object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {currentTestimonial.clientName}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {currentTestimonial.clientRole}, {currentTestimonial.company}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FF6A00] text-[#FF6A00]" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Testimonials Carousel Controls */}
            {activeTestimonials.length > 1 && (
              <div className="flex items-center justify-between mt-6 pt-2">
                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {activeTestimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonialIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentTestimonialIndex === idx
                          ? 'w-6 bg-[#FF6A00]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevTestimonial}
                    className="p-2 rounded-xl bg-[#0A1A3F] hover:bg-[#0D2254] border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextTestimonial}
                    className="p-2 rounded-xl bg-[#0A1A3F] hover:bg-[#0D2254] border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: FAQs Accordion */}
          <div id="faqs" className="lg:col-span-7 flex flex-col justify-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] text-xs font-mono font-semibold tracking-wider uppercase mb-3 self-start">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>FAQS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-8">
              Frequently Asked Questions
            </h2>

            {/* Accordion list */}
            <div className="space-y-3.5">
              {activeFaqs.map((faq, index) => {
                const isOpen = openFaqId === faq.id || (openFaqId === null && index === 0);
                return (
                  <div
                    key={faq.id || index}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-[#0A1A3F] border-[#FF6A00]/35 shadow-lg shadow-[#FF6A00]/5'
                        : 'bg-[#0A1A3F]/70 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    >
                      <span className="font-semibold text-sm sm:text-base text-white">
                        {faq.question}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? 'bg-[#FF6A00]/20 text-[#FF6A00] rotate-180'
                            : 'bg-[#020B24] text-gray-400'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
