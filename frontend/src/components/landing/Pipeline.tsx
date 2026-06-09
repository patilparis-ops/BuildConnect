import { motion } from "framer-motion";
import { Upload, Eye, Layout, Cpu, Code2 } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Upload Screenshot",
    desc: "Single image or Figma URL",
    color: "brand-purple"
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "AI Vision Analysis",
    desc: "Deep structure mapping",
    color: "brand-blue"
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Layout Planning",
    desc: "Grid & Flex optimization",
    color: "brand-cyan"
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Component Gen",
    desc: "Modular logic building",
    color: "brand-purple"
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "React Output",
    desc: "Type-safe code delivery",
    color: "brand-blue"
  }
];

export default function Pipeline() {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-white/60 text-lg">Our multi-stage pipeline ensures pixel-perfect results.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 hidden lg:block" />
          
          <div className="grid lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-xs font-bold text-white/20 group-hover:text-brand-purple transition-colors">
                  0{i + 1}
                </div>

                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-3xl glass border border-white/10 flex items-center justify-center mb-8 bg-white/5 relative z-10 group-hover:border-brand-purple/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-500`}>
                  <div className="text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                
                {/* Arrow for mobile/tablet */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden mt-8 text-white/10">
                    <svg className="w-6 h-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
