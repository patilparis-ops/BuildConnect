import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useProjects } from "@/hooks/use-api";
import { PROJECT_CATEGORIES } from "@/constants";
import { Search, MapPin, IndianRupee, Building2, Clock, SlidersHorizontal, HardHat, ArrowRight } from "lucide-react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function PublicProjectsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: projectsData, isError, refetch } = useProjects();
  const allProjects = projectsData?.projects ?? [];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-8">
        <ErrorBanner isError={isError} onRetry={refetch} />
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center"><Skeleton className="h-6 w-40 rounded-full bg-slate-700" /></div>
            <Skeleton className="h-10 sm:h-12 w-80 mx-auto bg-slate-700" />
            <Skeleton className="h-5 w-72 mx-auto bg-slate-700" />
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
              <div className="flex-1"><Skeleton className="h-11 w-full rounded-xl bg-slate-700" /></div>
              <Skeleton className="h-11 w-11 rounded-xl bg-slate-700" />
            </div>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-7 w-20 rounded-full bg-slate-700" />)}
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-4 w-36 bg-slate-200" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <div className="flex gap-1.5 pt-4 border-t border-slate-100">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  const openProjects = allProjects.filter((p) => p.status === "open" || p.status === "quoting");

  const filtered = openProjects.filter((p) => {
    const s = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const c = category === "all" || p.category === category;
    return s && c;
  });

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-8">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 mb-4">
            <Building2 className="h-4 w-4 text-green-400" />{openProjects.length} open projects
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Find Your Next Project</h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">Browse open projects from verified property owners across India.</p>
          <div className="mt-8 max-w-xl mx-auto">
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none text-sm" />
              </div>
              <Button variant="secondary" size="icon" className="rounded-xl" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400">
            <span>Popular:</span>
            {["Renovation", "New Build", "Interior Design", "Electrical"].map((p) => (
              <button key={p} onClick={() => { setCategory(p.toLowerCase().replace(" ", "_")); setShowFilters(true); }}
                className="px-3 py-1 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white text-xs">{p}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-6">
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Category:</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none">
                <option value="all">All Categories</option>
                {PROJECT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            {category !== "all" && <Button variant="ghost" size="sm" onClick={() => setCategory("all")}>Clear</Button>}
          </motion.div>
        )}

        <p className="text-sm text-slate-500">Showing <span className="font-medium">{filtered.length}</span> open projects</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <HardHat className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No projects found</h3>
            <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => { setSearch(""); setCategory("all"); }}>Reset Filters</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={"/projects/" + p.id}>
                  <Card hover className="h-full group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline" size="sm">{PROJECT_CATEGORIES.find((c) => c.value === p.category)?.label || p.category}</Badge>
                        <Badge variant={p.status === "open" ? "success" : "warning"} size="sm">{p.status === "open" ? "Open" : "Accepting Quotes"}</Badge>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-600 mb-2">{p.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{p.description}</p>
                      <div className="flex flex-col gap-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" /> {p.location}</span>
                        <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-slate-400" /> Rs {p.budgetMin.toLocaleString()} - Rs {p.budgetMax.toLocaleString()}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      {p.requirements.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {p.requirements.slice(0, 2).map((r, ri) => <Badge key={ri} variant="outline" size="sm" className="text-xs">{r}</Badge>)}
                          {p.requirements.length > 2 && <Badge variant="outline" size="sm">+{p.requirements.length - 2} more</Badge>}
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400">{p.quoteCount} quotes received</span>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}