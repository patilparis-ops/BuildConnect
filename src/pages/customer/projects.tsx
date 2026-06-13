import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { useMyProjects } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { Building2, MapPin, IndianRupee, FileText, PlusCircle, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { ErrorBanner } from "@/components/shared/error-banner";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function CustomerProjectsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { data, isError, refetch } = useMyProjects();
  const projects = data?.projects ?? [];

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Projects" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">My Projects</h1>
        </div>
        <Link to={ROUTES.CUSTOMER.POST_PROJECT}>
          <Button><PlusCircle className="h-4 w-4" /> Post New Project</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {["all", "open", "quoting", "in_progress", "completed", "cancelled"].map(st => (
            <button key={st} onClick={() => setFilterStatus(st)}
              className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors " + (filterStatus === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700")}>
              {st === "all" ? "All" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-900 mb-1">No projects found</h3>
              <p className="text-sm text-slate-500 mb-4">Post your first project to get started</p>
              <Link to={ROUTES.CUSTOMER.POST_PROJECT}><Button size="sm"><PlusCircle className="h-4 w-4" /> Post a Project</Button></Link>
            </CardContent>
          </Card>
        ) : (
          filtered.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link to={"#"} className="block">
                <Card hover className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shrink-0">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-900">{project.title}</h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {project.location}</span>
                            <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> Rs.{project.budgetMin.toLocaleString()} - Rs.{project.budgetMax.toLocaleString()}</span>
                            <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {project.quoteCount} quotes</span>
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={STATUS_COLORS[project.status]} variant="default" size="md">{project.status.replace("_", " ")}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
