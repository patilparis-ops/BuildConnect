import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const faqs = [
  {
    question: "How accurate is the AI in converting screenshots?",
    answer: "FrameForge uses state-of-the-art vision-language models trained specifically on web architecture. It typically achieves 95% accuracy for layouts and component identification, requiring only minor styling adjustments for complex animations."
  },
  {
    question: "Does it support other frameworks besides React?",
    answer: "Currently, we offer first-class support for React with Tailwind CSS. Support for Vue, Svelte, and Next.js is available on our Pro and Team plans."
  },
  {
    question: "Can I use my own design system components?",
    answer: "Yes! Team plan users can upload their design system documentation, and FrameForge will prioritize using your existing component library instead of generating generic HTML."
  },
  {
    question: "Is the generated code SEO-friendly?",
    answer: "Absolutely. FrameForge generates semantic HTML5 elements and follows accessibility guidelines (WCAG) to ensure your components are search-engine ready and usable by everyone."
  },
  {
    question: "Can I export the full project structure?",
    answer: "Yes, you can export individual components or a full Vite-based project structure ready to be deployed or integrated into your current codebase."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-32">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={cn(
                "glass-card overflow-hidden transition-all duration-300",
                activeIndex === idx ? "border-brand-purple/30 bg-white/5" : ""
              )}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-semibold text-white/80 group-hover:text-white transition-colors">
                  {faq.question}
                </span>
                <div className={cn(
                  "p-2 rounded-lg bg-white/5 transition-transform duration-300",
                  activeIndex === idx ? "rotate-180 bg-brand-purple/20 text-brand-purple" : "text-white/40"
                )}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-white/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
