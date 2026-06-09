import { Sparkles, CheckCircle2, Zap, Clock, ShieldCheck, BarChart3, Layers, Layout, Navigation, Box, Table, Lock } from "lucide-react";
import { cn } from "../../utils/cn";

export function InsightsPanel() {
  const stats = [
    { label: "Components", value: "14", icon: <Layers className="w-3.5 h-3.5 text-brand-purple" /> },
    { label: "Files", value: "8", icon: <Box className="w-3.5 h-3.5 text-blue-400" /> },
    { label: "Generation", value: "2.4s", icon: <Clock className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: "Confidence", value: "98%", icon: <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> },
  ];

  const components = [
    { name: "Navigation", icon: <Navigation className="w-3.5 h-3.5" /> },
    { name: "Data Tables", icon: <Table className="w-3.5 h-3.5" /> },
    { name: "Auth Flow", icon: <Lock className="w-3.5 h-3.5" /> },
    { name: "Charts", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { name: "SaaS Hero", icon: <Layout className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside className="w-72 border-l border-white/5 bg-[#080808] flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-purple" />
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">AI Generation Insights</h3>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Generation Summary */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Summary</h4>
          <div className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/10 space-y-2">
            <p className="text-[11px] leading-relaxed text-white/70">
              Architected a high-performance React application using Tailwind CSS. 
              Implemented a modular component structure with accessible state management.
            </p>
            <div className="flex items-center gap-2 text-brand-purple">
               <CheckCircle2 className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-widest">Quality Verified</span>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-3">
           {stats.map((stat, i) => (
             <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                   {stat.icon}
                   <span className="text-[9px] font-bold text-white/30 uppercase">{stat.label}</span>
                </div>
                <div className="text-sm font-bold text-white">{stat.value}</div>
             </div>
           ))}
        </div>

        {/* Detected Components */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Detected Patterns</h4>
          <div className="space-y-1">
             {components.map((comp, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white/40 group-hover:text-brand-purple transition-colors">
                       {comp.icon}
                    </div>
                    <span className="text-[12px] font-bold text-white/60 group-hover:text-white">{comp.name}</span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/10 group-hover:text-brand-purple" />
               </div>
             ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4 pt-4 border-t border-white/5">
           <div className="space-y-2">
              <div className="flex justify-between items-end">
                 <span className="text-[10px] font-bold text-white/30 uppercase">Generation Quality</span>
                 <span className="text-[10px] font-bold text-brand-purple">98/100</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full w-[98%] bg-brand-purple shadow-[0_0_10px_#8b5cf6]" />
              </div>
           </div>
           
           <div className="space-y-2">
              <div className="flex justify-between items-end">
                 <span className="text-[10px] font-bold text-white/30 uppercase">Cohesion Score</span>
                 <span className="text-[10px] font-bold text-blue-400">94%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full w-[94%] bg-blue-400 shadow-[0_0_10px_#3b82f6]" />
              </div>
           </div>
        </div>
      </div>

      {/* Export Experience */}
      <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
         <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white text-black font-bold text-[11px] hover:bg-white/90 transition-all shadow-xl group">
            <span>Export to Vercel</span>
            <Zap className="w-3.5 h-3.5 fill-black group-hover:translate-x-1 transition-transform" />
         </button>
         <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-bold text-[11px] hover:bg-brand-purple/20 transition-all">
            Share Project
         </button>
      </div>
    </aside>
  );
}
