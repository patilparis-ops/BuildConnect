import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/use-api";
import { STATUS_COLORS, PROJECT_CATEGORIES } from "@/constants";
import { Briefcase, MapPin, IndianRupee, Clock, Search, FileText, Building2, ArrowUpRight } from "lucide-react";
import { NoAvailableProjectsEmpty } from "@/components/shared/empty-states";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";

const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ContractorProjectsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data, isLoading } = useProjects({ status: "open" });
  const projects = data?.projects ?? [];

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUpVariants} className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Available Projects" }]} />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Available Projects</h1>
        <p className="text-sm text-slate-500 mt-2">Browse open projects and submit your quotes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Search projects by title or location..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300/70 bg-white text-sm transition-all duration-200 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
            aria-label="Search projects" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-300/70 bg-white px-3.5 text-sm transition-all duration-200 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20 focus:outline-none">
          <option value="all">All Categories</option>
          {PROJECT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2">
            <NoAvailableProjectsEmpty />
          </div>
        ) : (
          filtered.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="h-full border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300 group">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-100 transition-colors"><Building2 className="h-5 w-5" /></div>
                    <Badge className={STATUS_COLORS[project.status] + " border-none font-semibold capitalize"} variant="default" size="sm">{project.status}</Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{project.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {project.location}</span>
                    <span className="flex items-center gap-1.5 text-slate-700 font-semibold"><IndianRupee className="h-3.5 w-3.5" /> ₹{project.budgetMin.toLocaleString()} - {project.budgetMax.toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-slate-400" /> {project.quoteCount || 0} bids</span>
                  </div>
                  <div className="mt-auto pt-3 border-t border-slate-100/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium"><Clock className="h-3.5 w-3.5 inline mr-1" /> {new Date(project.createdAt).toLocaleDateString()}</span>
                    <Link to={"/contractor/projects/" + project.id + "/quote"}>
                      <Button variant="primary" size="sm" className="text-xs">Submit Quote <ArrowUpRight className="h-3.5 w-3.5" /></Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
