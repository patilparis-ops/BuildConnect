import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { useMyProjects, useMyQuotes } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";
import { NoProjectsEmpty, NoQuotesEmpty } from "@/components/shared/empty-states";
import { FolderKanban, PlusCircle, FileText, Star, CheckCircle2, ChevronRight, Building2, MapPin, IndianRupee, Clock, ArrowUpRight } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";

const staggerVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { data: pd, isLoading: pl, isError: isError1, refetch: refetch1 } = useMyProjects();
  const { data: qd, isLoading: ql, isError: isError2, refetch: refetch2 } = useMyQuotes();
  
  const hasError = isError1 || isError2;
  const handleRetry = () => { refetch1(); refetch2(); };
  
  const projects = pd?.projects ?? [];
  const quotes = qd?.quotations ?? [];
  const isLoading = pl || ql;
  
  const activeProjects = projects.filter(p => p.status === "in_progress" || p.status === "quoting");
  const pendingQuotes = quotes.filter(q => q.status === "pending");
  const completedProjects = projects.filter(p => p.status === "completed");
  const maxVal = Math.max(...[activeProjects.length, pendingQuotes.length, completedProjects.length, projects.length, 1]);
  
  const stats = [
    { label: "Active Projects", value: activeProjects.length, color: "from-brand-500 to-brand-600", icon: <FolderKanban className="h-5 w-5" /> },
    { label: "Pending Quotes", value: pendingQuotes.length, color: "from-warning-500 to-warning-600", icon: <FileText className="h-5 w-5" /> },
    { label: "Completed", value: completedProjects.length, color: "from-success-500 to-success-600", icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Total Projects", value: projects.length, color: "from-secondary-500 to-secondary-600", icon: <FolderKanban className="h-5 w-5" /> },
  ];

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={staggerVariants} className="space-y-8">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      
      <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Welcome back, {user?.firstName}!</h1>
          <p className="text-sm text-slate-500 mt-2">Here's what's happening with your projects</p>
        </div>
        <Link to={ROUTES.CUSTOMER.POST_PROJECT}>
          <Button variant="secondary" size="lg" className="font-semibold shadow-lg shadow-secondary-500/20"><PlusCircle className="h-5 w-5" /> Post Project</Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={staggerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(st => (
          <motion.div key={st.label} variants={fadeUpVariants}>
            <Card className="relative overflow-hidden border-slate-200/70 shadow-xs group hover:shadow-sm hover:border-slate-300/80 transition-all duration-300 hover:-translate-y-0.5">
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${st.color}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{st.label}</span>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 group-hover:from-brand-50 group-hover:to-brand-100 group-hover:text-brand-600 flex items-center justify-center transition-all duration-200 shadow-xs">
                    {st.icon}
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-900 tracking-tight">{st.value}</p>
                <div className="mt-5 h-1.5 w-full rounded-full bg-slate-100/80 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${st.color} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(10, (st.value / maxVal * 100)))}%` }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200/70 shadow-xs h-full hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between border-b border-slate-100/80">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Active Projects</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Manage your ongoing projects</p>
              </div>
              <Link to={ROUTES.CUSTOMER.PROJECTS}>
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50/60 flex items-center gap-1">
                  View All <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {projects.length === 0 ? (
                <NoProjectsEmpty />
              ) : (
                <div className="divide-y divide-slate-100/80">
                  {projects.slice(0, 3).map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 py-4.5 first:pt-1 last:pb-1 group hover:bg-slate-50/40 px-2 -mx-2 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 group-hover:from-brand-50 group-hover:to-brand-100 group-hover:text-brand-600 flex items-center justify-center shrink-0 transition-all duration-200 shadow-xs">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <Link to={ROUTES.CUSTOMER.PROJECTS} className="text-sm font-semibold text-slate-900 truncate hover:text-brand-600 transition-colors">
                            {p.title}
                          </Link>
                          <Badge className={`${STATUS_COLORS[p.status] || "bg-slate-100 text-slate-700"} border-none font-semibold capitalize text-[10px] py-1 px-2.5 shrink-0 rounded-lg`} variant="default" size="sm">
                            {p.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {p.location}</span>
                          <span className="flex items-center gap-1.5 text-slate-700 font-semibold"><IndianRupee className="h-3.5 w-3.5" /> ₹{p.budgetMin.toLocaleString()} - ₹{p.budgetMax.toLocaleString()}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> {new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Pending Quotes */}
          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">Pending Quotes</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Review proposals</p>
                </div>
                {pendingQuotes.length > 0 && (
                  <Badge variant="warning" size="sm" className="rounded-lg">{pendingQuotes.length} new</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {pendingQuotes.length === 0 ? (
                <NoQuotesEmpty />
              ) : (
                <div className="space-y-3">
                  {pendingQuotes.slice(0, 3).map((q, i) => {
                    const proj = projects.find(p => p.id === q.projectId);
                    return (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link to={ROUTES.CUSTOMER.QUOTATIONS} className="block group">
                          <div className="p-4 rounded-xl border border-slate-200/70 hover:border-brand-400/50 hover:shadow-sm transition-all duration-200 bg-white group">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{proj?.title || "Project"}</p>
                              <Badge variant="warning" size="sm" className="text-[10px]">Pending</Badge>
                            </div>
                            <p className="text-xl font-bold text-slate-900 tracking-tight">₹{q.estimatedPrice.toLocaleString()}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-slate-400">{q.timeline || "Timeline TBD"}</span>
                              <span className="text-xs font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">Review →</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
              <Link to={ROUTES.CUSTOMER.POST_PROJECT} className="block">
                <Button variant="outline" className="w-full justify-start gap-3 border-slate-200/70 hover:border-brand-400/50 hover:bg-brand-50/30 font-semibold h-11">
                  <PlusCircle className="h-5 w-5 text-brand-600" />
                  Post a New Project
                </Button>
              </Link>
              <Link to={ROUTES.CUSTOMER.QUOTATIONS} className="block">
                <Button variant="outline" className="w-full justify-start gap-3 border-slate-200/70 hover:border-secondary-400/50 hover:bg-secondary-50/30 font-semibold h-11">
                  <FileText className="h-5 w-5 text-secondary-600" />
                  Review All Quotes
                </Button>
              </Link>
              <Link to={ROUTES.CUSTOMER.HIRED_CONTRACTORS} className="block">
                <Button variant="outline" className="w-full justify-start gap-3 border-slate-200/70 hover:border-brand-400/50 hover:bg-brand-50/30 font-semibold h-11">
                  <Building2 className="h-5 w-5 text-brand-600" />
                  My Contractors
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
