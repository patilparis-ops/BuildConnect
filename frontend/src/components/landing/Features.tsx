import { motion } from "framer-motion";
import { Upload, Eye, Cpu, Braces, Palette, Zap } from "lucide-react";
import { cn } from "../../utils/cn";

const features = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Screenshot Upload",
    description: "Simply drag and drop any image or design link. Our AI handles the rest.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Vision Analysis",
    description: "Advanced VLM models analyze hierarchy, spacing, and component definitions.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Component Detection",
    description: "Automatic identification of buttons, inputs, cards, and complex layouts.",
    color: "from-orange-500 to-yellow-500"
  },
  {
    icon: <Braces className="w-6 h-6" />,
    title: "React Generation",
    description: "Produces clean, modular, and type-safe React components instantly.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Tailwind Generation",
    description: "Utility-first CSS generation that perfectly matches the original design.",
    color: "from-blue-600 to-indigo-600"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Live Preview",
    description: "See your code in action with a hot-reloading real-time preview browser.",
    color: "from-yellow-400 to-orange-500"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Powerful Features for <br />
            <span className="text-white/40">Modern Development</span>
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Stop wasting hours manually slicing designs. Our AI-driven engine automates the tedious parts of frontend development.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass-card p-10 hover:border-brand-purple/50 flex flex-col items-start text-left"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-linear-to-br transition-all duration-500 shadow-lg",
                feature.color,
                "opacity-80 group-hover:opacity-100 group-hover:scale-110"
              )}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white/20 group-hover:text-brand-purple transition-all translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                Learn more <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
