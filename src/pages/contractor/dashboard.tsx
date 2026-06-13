import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { useProjects, useMyQuotes, useContractors } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { Briefcase, FileText, Star, MapPin, IndianRupee, Clock, ChevronRight, Building2, HardHat, TrendingUp } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";

const f = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const s = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function ContractorDashboardPage() {
  const { user } = useAuthStore();
  const { data: pd, isLoading: pl, isError: isError1, refetch: refetch1 } = useProjects({ status: "open" });
  const { data: qd, isLoading: ql, isError: isError2, refetch: refetch2 } = useMyQuotes();
  const { data: cd, isError: isError3, refetch: refetch3 } = useContractors();
  const hasError = isError1 || isError2 || isError3;
  const handleRetry = () => { refetch1(); refetch2(); refetch3(); };
  const openProjects = pd?.projects ?? [];
  const myQuotes = qd?.quotations ?? [];
  const acceptedQuotes = myQuotes.filter(q => q.status === "accepted");
  const contractors = cd?.contractors ?? [];
  const me = contractors.find(c => c.email === user?.email);
  const stats = [
    { label: "Available", value: openProjects.length, icon: <Briefcase className="h-5 w-5" />, color: "from-brand-500 to-brand-600", bg: "bg-brand-50 text-brand-600" },
    { label: "My Quotes", value: myQuotes.length, icon: <FileText className="h-5 w-5" />, color: "from-warning-500 to-warning-600", bg: "bg-warning-50 text-warning-600" },
    { label: "Active", value: acceptedQuotes.length, icon: <HardHat className="h-5 w-5" />, color: "from-success-500 to-success-600", bg: "bg-success-50 text-success-600" },
    { label: "Rating", value: me?.rating || 0, icon: <Star className="h-5 w-5" />, color: "from-secondary-500 to-secondary-600", bg: "bg-secondary-50 text-secondary-600" },
  ];
  if (pl && ql) {
    return <div className="space-y-6"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div></div>;
  }
  return (
    <motion.div initial="initial" animate="animate" variants={s} className="space-y-8">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      <motion.div variants={f} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="text-2xl font-bold mt-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-slate-500 mt-1">Find new projects and grow your business.</p>
        </div>
        <Link to={ROUTES.CONTRACTOR.AVAILABLE_PROJECTS}>
          <Button variant="secondary"><Briefcase className="h-4 w-4" /> Browse Projects</Button>
        </Link>
      </motion.div>
      <motion.div variants={s} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(st => (
          <motion.div key={st.label} variants={f}>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase">{st.label}</span>
                  <div className={"w-9 h-9 rounded-lg " + st.bg + " flex items-center justify-center"}>{st.icon}</div>
                </div>
                <p className="text-3xl font-bold">{st.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={f} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between px-6 pt-6 pb-0">
              <CardTitle>Open Projects</CardTitle>
              <Link to={ROUTES.CONTRACTOR.AVAILABLE_PROJECTS}><Button variant="ghost" size="sm">View All <ChevronRight className="h-4 w-4" /></Button></Link>
            </CardHeader>
            <CardContent className="p-6">
              {openProjects.slice(0, 4).map((p, i) => (
                <div key={p.id} className={"flex items-start gap-4 py-4 " + (i < 3 ? "border-b border-slate-100" : "")}>
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><Building2 className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold">{p.title}</h3>
                      <Badge className={STATUS_COLORS[p.status]} variant="default" size="sm">{p.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span><MapPin className="h-3 w-3 inline" /> {p.location}</span>
                      <span><IndianRupee className="h-3 w-3 inline" /> {p.budgetMin.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success-50 text-success-600 flex items-center justify-center"><FileText className="h-4 w-4" /></div>
                  <div><p className="text-sm">Quote accepted for Office Design</p><p className="text-xs text-slate-400">1 day ago</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><TrendingUp className="h-4 w-4" /></div>
                  <div><p className="text-sm">New project: Garden Landscaping</p><p className="text-xs text-slate-400">3 hours ago</p></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={f} className="space-y-6">
          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-2">
              <Link to={ROUTES.CONTRACTOR.AVAILABLE_PROJECTS}><Button variant="outline" fullWidth className="justify-start"><Briefcase className="h-4 w-4 text-brand-500" /> Browse Projects</Button></Link>
              <Link to={ROUTES.CONTRACTOR.MY_QUOTES}><Button variant="outline" fullWidth className="justify-start"><FileText className="h-4 w-4 text-warning-500" /> My Quotes</Button></Link>
              <Link to={ROUTES.CONTRACTOR.PORTFOLIO}><Button variant="outline" fullWidth className="justify-start"><Star className="h-4 w-4" /> Portfolio</Button></Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white"><HardHat className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Pro Tip</h4>
                  <p className="text-xs text-slate-500">Complete your portfolio with project photos to increase your chances by 60%.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
