import { useState } from "react";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Download, 
  Zap, 
  Share2, 
  RefreshCw, 
  ChevronLeft,
  Layout,
  ExternalLink,
  MoreVertical,
  Check,
  FileArchive,
  Code2,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectToolbarProps {
  viewport: "desktop" | "tablet" | "mobile";
  setViewport: (v: "desktop" | "tablet" | "mobile") => void;
  projectName: string;
}

export function ProjectToolbar({ viewport, setViewport, projectName }: ProjectToolbarProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const exportOptions = [
    { label: "Export as React ZIP", icon: <FileArchive className="w-4 h-4" />, description: "Complete source files" },
    { label: "Export to Next.js", icon: <Globe className="w-4 h-4" />, description: "Optimized framework setup" },
    { label: "Copy Source Code", icon: <Code2 className="w-4 h-4" />, description: "One-click clipboard" },
  ];

  return (
    <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 relative z-50">
      {/* Left: Project Branding & Navigation */}
      <div className="flex items-center gap-6">
        <Link to="/workspace" className="p-2 rounded-xl hover:bg-white/5 transition-all text-white/40 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="w-px h-6 bg-white/5" />
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
             <h2 className="font-display font-bold text-sm tracking-tight text-white">{projectName}</h2>
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Synced</span>
             </div>
          </div>
          <span className="text-[10px] text-white/20 font-medium">Last regenerated 14 mins ago</span>
        </div>
      </div>

      {/* Center: Tabs */}
      <div className="hidden lg:flex items-center p-1 rounded-xl bg-white/5 border border-white/5">
         {[
           { id: "overview", label: "Overview", icon: <Layout className="w-3.5 h-3.5" /> },
           { id: "deployments", label: "Deployments", icon: <Zap className="w-3.5 h-3.5" /> },
           { id: "monitoring", label: "Monitoring", icon: <div className="w-3.5 h-3.5 rounded-full border border-current" /> }
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={cn(
               "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2",
               activeTab === tab.id ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
             )}
           >
             {tab.icon}
             {tab.label}
           </button>
         ))}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Device Switcher */}
        <div className="flex items-center p-1 rounded-lg bg-white/5 gap-1">
           {[
             { id: "desktop", icon: <Monitor className="w-3.5 h-3.5" /> },
             { id: "tablet", icon: <Tablet className="w-3.5 h-3.5" /> },
             { id: "mobile", icon: <Smartphone className="w-3.5 h-3.5" /> }
           ].map((item) => (
             <button
               key={item.id}
               onClick={() => setViewport(item.id as any)}
               className={cn(
                 "p-2 rounded-md transition-all",
                 viewport === item.id ? "bg-white/10 text-brand-purple shadow-sm" : "text-white/20 hover:text-white hover:bg-white/5"
               )}
             >
               {item.icon}
             </button>
           ))}
        </div>

        <div className="w-px h-6 bg-white/5" />

        <div className="flex items-center gap-2">
           <button className="p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all">
              <RefreshCw className="w-4 h-4" />
           </button>
           <button className="p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all">
              <Share2 className="w-4 h-4" />
           </button>
           
           <div className="relative">
             <button 
               onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
               className={cn(
                 "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-purple/20",
                 isExportMenuOpen ? "bg-brand-purple text-white" : "premium-gradient text-white hover:brightness-110"
               )}
             >
                <Download className="w-4 h-4" />
                Export Project
             </button>

             <AnimatePresence>
               {isExportMenuOpen && (
                 <>
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }} 
                     exit={{ opacity: 0 }}
                     onClick={() => setIsExportMenuOpen(false)}
                     className="fixed inset-0 z-40"
                   />
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute top-full right-0 mt-3 w-72 p-2 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl z-50 overflow-hidden"
                   >
                      <div className="p-4 border-b border-white/5">
                         <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Select Export Format</h4>
                      </div>
                      <div className="py-2">
                         {exportOptions.map((opt, i) => (
                           <button key={i} className="w-full flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-left group">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-brand-purple transition-colors">
                                 {opt.icon}
                              </div>
                              <div className="flex-grow pt-1">
                                 <div className="text-[12px] font-bold text-white group-hover:text-brand-purple transition-colors">{opt.label}</div>
                                 <div className="text-[10px] text-white/40">{opt.description}</div>
                              </div>
                           </button>
                         ))}
                      </div>
                      <div className="p-2 mt-2 bg-brand-purple/10 rounded-xl flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                         </div>
                         <div className="text-[10px] text-brand-purple font-bold">PRO: Fast Exporting Active</div>
                      </div>
                   </motion.div>
                 </>
               )}
             </AnimatePresence>
           </div>
        </div>

        <div className="w-10 h-10 rounded-full premium-gradient p-[1px] cursor-pointer hover:scale-105 transition-all">
           <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">JD</div>
        </div>
      </div>
    </header>
  );
}
