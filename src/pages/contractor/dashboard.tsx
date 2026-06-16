import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { useProjects, useMyQuotes, useContractors, useEarnings } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { NoAvailableProjectsEmpty } from "@/components/shared/empty-states";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";
import { Briefcase, FileText, Star, MapPin, IndianRupee, ChevronRight, Building2, HardHat, TrendingUp, Wallet, ArrowUpRight } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";

const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const staggerVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function ContractorDashboardPage() {
  const { user } = useAuthStore();
  const { data: pd, isLoading: pl, isError: isError1, refetch: refetch1 } = useProjects({ status: "open" });
  const { data: qd, isLoading: ql, isError: isError2, refetch: refetch2 } = useMyQuotes();
  const { data: cd, isError: isError3, refetch: refetch3 } = useContractors();
  const { data: ed } = useEarnings();
  const hasError = isError1 || isError2 || isError3;
  const handleRetry = () => { refetch1(); refetch2(); refetch3(); };
  const isLoading = pl || ql;
  const openProjects = pd?.projects ?? [];
  const myQuotes = qd?.quotations ?? [];
  const acceptedQuotes = myQuotes.filter(q => q.status === "accepted");
  const contractors = cd?.contractors ?? [];
  const me = contractors.find(c => c.email === user?.email);
  const earningsData = ed?.monthlyData || [];
  const thisMonthEarnings = earningsData.length > 0 ? earningsData[earningsData.length - 1] : 0;
  
  const stats = [
    { label: "Available", value: openProjects.length, icon: <Briefcase className="h-5 w-5" />, color: "from-brand-500 to-brand-600", bg: "bg-brand-50 text-brand-600" },
    { label: "My Quotes", value: myQuotes.length, icon: <FileText className="h-5 w-5" />, color: "from-warning-500 to-warning-600", bg: "bg-warning-50 text-warning-600" },
    { label: "Active", value: acceptedQuotes.length, icon: <HardHat className="h-5 w-5" />, color: "from-success-500 to-success-600", bg: "bg-success-50 text-success-600" },
    { label: "Earnings", value: `₹${(thisMonthEarnings / 1000).toFixed(0)}k`, icon: <Wallet className="h-5 w-5" />, color: "from-secondary-500 to-secondary-600", bg: "bg-secondary-50 text-secondary-600" },
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
          <p className="text-sm text-slate-500 mt-2">Find new projects and grow your business</p>
        </div>
        <Link to={ROUTES.CONTRACTOR.AVAILABLE_PROJECTS}>
          <Button variant="secondary" size="lg" className="font-semibold shadow-lg shadow-secondary-500/20"><Briefcase className="h-5 w-5" /> Browse Projects</Button>
        </Link>
      </motion.div>

      <motion.div variants={staggerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(st => (
          <motion.div key={st.label} variants={fadeUpVariants}>
            <Card className="relative overflow-hidden border-slate-200/70 shadow-xs group hover:shadow-sm hover:border-slate-300/80 transition-all duration-300 hover:-translate-y-0.5">
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${st.color}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{st.label}</span>
                  <div className={"w-10 h-10 rounded-lg " + st.bg + " flex items-center justify-center transition-all duration-200 shadow-xs"}>{st.icon}</div>
                </div>
                <p className="text-4xl font-bold text-slate-900 tracking-tight">
                  {st.label === "Rating" && typeof st.value === "number" ? st.value.toFixed(1) : st.value}
                </p>
                {st.label === "Earnings" && (
                  <span className="text-[10px] text-success-600 font-semibold block mt-2">This month</span>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-8">
          <Card className="border-slate-200/70 shadow-xs h-full hover:shadow-sm transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100/80">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Open Projects</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Browse and submit quotes</p>
              </div>
              <Link to={ROUTES.CONTRACTOR.AVAILABLE_PROJECTS}>
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50/60 flex items-center gap-1">View All <ArrowUpRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {openProjects.length === 0 ? (
                <NoAvailableProjectsEmpty />
              ) : (
                <div className="divide-y divide-slate-100/80">
                  {openProjects.slice(0, 4).map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-4 py-4.5 first:pt-1 last:pb-1 group hover:bg-slate-50/40 px-2 -mx-2 rounded-lg transition-all duration-200"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 group-hover:from-brand-50 group-hover:to-brand-100 group-hover:text-brand-600 flex items-center justify-center shrink-0 transition-all duration-200 shadow-xs">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <Link to={`/contractor/projects/${p.id}`} className="text-sm font-semibold text-slate-900 truncate hover:text-brand-600 transition-colors">
                            {p.title}
                          </Link>
                          <Badge className={STATUS_COLORS[p.status] + " border-none font-semibold capitalize text-[10px] py-1 px-2.5 shrink-0 rounded-lg"} variant="default" size="sm">
                            {p.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {p.location}</span>
                          <span className="flex items-center gap-1.5 text-slate-700 font-semibold"><IndianRupee className="h-3.5 w-3.5" /> ₹{p.budgetMin.toLocaleString()} - ₹{p.budgetMax.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50/40 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-success-50 text-success-600 flex items-center justify-center shrink-0 group-hover:bg-success-100 transition-colors shadow-xs"><FileText className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Quote accepted for Office Design</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50/40 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors shadow-xs"><TrendingUp className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">New project: Garden Landscaping</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeUpVariants} className="space-y-8">
          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
              <Link to={ROUTES.CONTRACTOR.AVAILABLE_PROJECTS} className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 border-slate-200/70 hover:border-brand-400/50 hover:bg-brand-50/30 font-semibold h-11">
                  <Briefcase className="h-5 w-5 text-brand-600" />
                  Browse Projects
                </Button>
              </Link>
              <Link to={ROUTES.CONTRACTOR.MY_QUOTES} className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 border-slate-200/70 hover:border-warning-400/50 hover:bg-warning-50/30 font-semibold h-11">
                  <FileText className="h-5 w-5 text-warning-600" />
                  My Quotes
                </Button>
              </Link>
              <Link to={ROUTES.CONTRACTOR.PORTFOLIO} className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 border-slate-200/70 hover:border-secondary-400/50 hover:bg-secondary-50/30 font-semibold h-11">
                  <Star className="h-5 w-5 text-secondary-600" />
                  Portfolio
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300 bg-gradient-to-br from-secondary-50/40 to-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-secondary-500 to-secondary-600 flex items-center justify-center text-white shrink-0 shadow-sm"><HardHat className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Pro Tip</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Complete your portfolio with project photos to increase your hire rate by 60%.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
