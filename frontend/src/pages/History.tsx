import { motion } from "framer-motion";
import { 
  History, 
  Search, 
  Filter, 
  ExternalLink, 
  Trash2, 
  Clock, 
  ChevronRight,
  Layout,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const projects = [
  { id: 1, name: "Modern Landing Page", date: "2 hours ago", status: "Completed", components: 12 },
  { id: 2, name: "Auth Module Redesign", date: "Yesterday", status: "Saved", components: 5 },
  { id: 3, name: "Pricing Table Component", date: "3 days ago", status: "Exported", components: 1 },
  { id: 4, name: "Dashboard Prototype", date: "June 01, 2026", status: "Completed", components: 24 },
  { id: 5, name: "Hero Section Variant", date: "May 28, 2026", status: "Draft", components: 3 }
];

export default function HistoryPage() {
  return (
    <div className="bg-background min-h-screen text-white flex flex-col pt-32">
      <Navbar />
      
      <main className="flex-grow max-w-6xl mx-auto px-6 w-full py-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
             <Link to="/workspace" className="flex items-center gap-2 text-brand-purple text-sm font-bold mb-4 hover:opacity-80 transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Workspace
             </Link>
             <h1 className="text-5xl font-display font-bold">Project History</h1>
             <p className="text-white/40 mt-4 text-lg">Manage and review your previous AI generations.</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group flex-grow md:flex-grow-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-purple transition-colors" />
                <input 
                   type="text" 
                   placeholder="Search projects..." 
                   className="pl-12 pr-6 py-3 rounded-2xl glass bg-white/5 border-white/10 w-full md:w-64 focus:outline-none focus:border-brand-purple/50 transition-all text-sm"
                />
             </div>
             <button className="p-3 rounded-2xl glass border border-white/10 hover:bg-white/5 transition-all">
                <Filter className="w-5 h-5 text-white/40" />
             </button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-brand-purple/30"
            >
              {/* Thumbnail Mock */}
              <div className="w-full md:w-48 h-32 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                 <div className="absolute inset-0 bg-linear-to-tr from-brand-purple/5 to-transparent" />
                 <Layout className="w-8 h-8 text-white/10" />
              </div>

              {/* Info */}
              <div className="flex-grow text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className="text-xl font-bold group-hover:text-white transition-colors">{project.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider">
                       {project.status}
                    </span>
                 </div>
                 <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-white/30">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4" /> {project.date}
                    </div>
                    <div className="flex items-center gap-2">
                       <Layout className="w-4 h-4" /> {project.components} components
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                 <button className="p-3 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all">
                    <Trash2 className="w-5 h-5" />
                 </button>
                 <Link to="/preview">
                   <button className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-sm font-bold hover:bg-white/5 transition-all">
                      View Project <ExternalLink className="w-4 h-4 text-white/40" />
                   </button>
                 </Link>
                 <Link to="/workspace">
                   <button className="p-3 rounded-xl premium-gradient text-white shadow-lg active:scale-95 transition-all">
                      <ChevronRight className="w-6 h-6" />
                   </button>
                 </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-20 flex justify-center">
           <button className="flex items-center gap-2 px-10 py-4 rounded-2xl glass text-white/40 hover:text-white transition-all border border-white/5 font-bold uppercase tracking-widest text-xs">
              Load More Projects
           </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
