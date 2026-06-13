import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-api";
import { STATUS_COLORS, PROJECT_CATEGORIES } from "@/constants";
import { Briefcase, MapPin, IndianRupee, Clock, Search, FileText, Building2 } from "lucide-react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

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
    return <div className="grid sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div>;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Available Projects" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Available Projects</h1>
        <p className="text-slate-500 mt-1">Browse open projects and submit your quotes.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none">
          <option value="all">All Categories</option>
          {PROJECT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2">
            <Card><CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900">No projects found</h3>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter criteria</p>
            </CardContent></Card>
          </div>
        ) : (
          filtered.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card hover className="h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><Building2 className="h-5 w-5" /></div>
                    <Badge className={STATUS_COLORS[project.status]} variant="default" size="sm">{project.status}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{project.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {project.location}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Rs.{project.budgetMin.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {project.quoteCount} bids</span>
                  </div>
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400"><Clock className="h-3 w-3 inline" /> {new Date(project.createdAt).toLocaleDateString()}</span>
                    <Link to={"/contractor/projects/" + project.id + "/quote"}><Button variant="primary" size="xs">Submit Quote</Button></Link>
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
