import { motion } from "framer-motion";

const companies = [
  "Linear", "Vercel", "OpenAI", "Cursor", "Framer", "Stripe", "Raycast", "Arc", "Slack", "Discord"
];

export default function TrustedBy() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/20 mb-16">
          Powering frontend velocity at
        </p>
        
        <div className="relative flex overflow-hidden group">
          {/* First set of logos */}
          <motion.div 
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-20 pr-20 whitespace-nowrap"
          >
            {companies.map((company) => (
              <span
                key={company}
                className="font-display font-bold text-3xl text-white/20 hover:text-white transition-all cursor-default select-none"
              >
                {company}
              </span>
            ))}
          </motion.div>
          
          {/* Second set for seamless loop */}
          <motion.div 
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-20 pr-20 whitespace-nowrap"
          >
            {companies.map((company) => (
              <span
                key={`${company}-2`}
                className="font-display font-bold text-3xl text-white/20 hover:text-white transition-all cursor-default select-none"
              >
                {company}
              </span>
            ))}
          </motion.div>

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-background-dark to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-background-dark to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
