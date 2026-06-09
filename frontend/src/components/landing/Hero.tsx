import { motion } from "framer-motion";
import { Rocket, Play, Code2, Layers, MousePointer2, Sparkles, ChevronRight } from "lucide-react";
import heroImage from "../../assets/hero_visual.png";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-brand-blue/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium mb-10 group cursor-default"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-background-dark bg-brand-purple/20 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-brand-purple" />
              </div>
            ))}
          </div>
          <span className="text-white/60">Trusted by 2,000+ top developers</span>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <span className="text-white flex items-center gap-1 group-hover:text-brand-purple transition-colors">
            v2.0 is out <ChevronRight className="w-3 h-3" />
          </span>
        </motion.div>

        {/* Hero Headline */}
        <div className="relative text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-extrabold tracking-tight leading-[1.05] mb-8"
          >
            Convert Any UI Screenshot <br />
            Into <span className="text-white purple-glow-text">Clean React Code</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            FrameForge analyzes screenshots, detects layouts, extracts components, and generates production-ready React and Tailwind code in minutes.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mt-4"
          >
            <Link to="/workspace">
              <button className="px-10 py-5 rounded-2xl premium-gradient text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all flex items-center gap-3 active:scale-95 group">
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Building Free
              </button>
            </Link>
            <button className="px-10 py-5 rounded-2xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95 border border-white/10">
              <Play className="w-5 h-5 fill-white" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Futuristic Workspace Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative w-full max-w-6xl mt-20 group"
        >
          {/* Main Container */}
          <div className="relative rounded-[2.5rem] overflow-hidden glass p-3 bg-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            <div className="relative rounded-[2rem] overflow-hidden">
               <img
                src={heroImage}
                alt="FrameForge AI Workspace"
                className="w-full h-auto rounded-[2rem] filter brightness-75 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-[1.02]"
              />
              
              {/* Overlay Interactive Elements */}
              <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 via-transparent to-transparent" />
              
              {/* Floating Code Panel */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-8 p-5 glass-card bg-black/60 shadow-2xl border border-brand-purple/30 max-w-[280px]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="text-[10px] text-white/30 ml-auto font-mono">Navbar.tsx</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-brand-purple/20 rounded" />
                  <div className="h-2 w-[80%] bg-white/10 rounded" />
                  <div className="h-2 w-[90%] bg-brand-blue/20 rounded" />
                  <div className="h-2 w-[70%] bg-white/10 rounded" />
                </div>
              </motion.div>

              {/* Floating Status Badge */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-8 p-4 glass-card bg-brand-purple/10 border border-white/20 shadow-2xl flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Analysis</div>
                  <div className="text-sm font-bold text-white text-glow-purple">99.8% Accuracy</div>
                </div>
              </motion.div>

              {/* Central Transformation Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-none">
                 <div className="w-32 h-32 rounded-full bg-brand-purple/20 blur-3xl animate-pulse" />
                 <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-16 h-16 rounded-2xl glass flex items-center justify-center rotate-12 border-brand-cyan/50"
                 >
                    <Layers className="w-8 h-8 text-brand-cyan" />
                 </motion.div>
              </div>
            </div>
          </div>
          
          {/* Background Glow */}
          <div className="absolute -inset-10 premium-gradient blur-[140px] opacity-10 -z-20 animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
