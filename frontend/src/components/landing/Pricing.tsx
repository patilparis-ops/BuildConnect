import { motion } from "framer-motion";
import { Check, Zap, Users, Sparkles } from "lucide-react";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Ideal for individual developers exploring AI speed.",
    features: [
      "10 Component extractions / mo",
      "React export with Tailwind",
      "Standard Vision Model",
      "Community support"
    ],
    cta: "Start for Free",
    highlight: false,
    icon: <Zap className="w-5 h-5 text-white/40" />
  },
  {
    name: "Professional",
    price: "$39",
    description: "The complete toolkit for high-velocity frontend teams.",
    features: [
      "Unlimited extractions",
      "Full Project Exports",
      "Advanced 8K Vision Model",
      "Custom Component Libraries",
      "Private Workspace",
      "Priority Support"
    ],
    cta: "Go Pro Now",
    highlight: true,
    icon: <Sparkles className="w-5 h-5 text-white" />
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Secure, scalable infrastructure for global organizations.",
    features: [
      "Everything in Pro",
      "Dedicated GPU Instances",
      "Custom SLM Fine-tuning",
      "SSO & Directory Sync",
      "On-premise Deployment",
      "Dedicated Account Manager"
    ],
    cta: "Contact Sales",
    highlight: false,
    icon: <Users className="w-5 h-5 text-white/40" />
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-40 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-brand-purple/10 blur-[180px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full glass border border-white/10 text-[10px] font-bold uppercase tracking-widest text-brand-purple mb-6"
          >
            Flexible Plans
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Built for Scaling</h2>
          <p className="text-white/50 text-xl max-w-xl mx-auto">Choose a plan that matches your development velocity perfectly.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "glass-card p-10 flex flex-col relative group transition-all duration-500",
                plan.highlight ? "border-brand-purple bg-brand-purple/[0.03] shadow-[0_0_50px_rgba(139,92,246,0.1)]" : "hover:border-white/20"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full premium-gradient text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
                  Highly Recommended
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                  plan.highlight ? "bg-brand-purple" : "bg-white/5"
                )}>
                  {plan.icon}
                </div>
                <div>
                   <h3 className="text-2xl font-bold">{plan.name}</h3>
                   <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Best for {plan.name === "Starter" ? "Builders" : plan.name === "Professional" ? "Teams" : "Enterprise"}</div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-bold tracking-tighter">{plan.price}</span>
                {plan.price.startsWith("$") && <span className="text-white/30 font-medium font-sans">/month</span>}
              </div>

              <p className="text-white/40 mb-10 text-sm leading-relaxed min-h-[40px]">
                {plan.description}
              </p>

              <div className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 group/feature">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                      plan.highlight ? "bg-brand-purple/20 text-brand-purple" : "bg-white/5 text-white/20"
                    )}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-white/70 group-hover/feature:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/workspace">
                <button className={cn(
                  "w-full py-5 rounded-2xl font-bold transition-all active:scale-95 text-sm uppercase tracking-widest",
                  plan.highlight 
                    ? "premium-gradient text-white shadow-2xl hover:shadow-brand-purple/40" 
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                )}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
