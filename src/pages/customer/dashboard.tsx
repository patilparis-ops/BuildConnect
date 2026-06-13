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
import { FolderKanban, PlusCircle, FileText, Star, CheckCircle2, ChevronRight, Building2, MapPin, IndianRupee } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";

const f = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const s = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { data: pd, isError: isError1, refetch: refetch1 } = useMyProjects();
  const { data: qd, isError: isError2, refetch: refetch2 } = useMyQuotes();
  const hasError = isError1 || isError2;
  const handleRetry = () => { refetch1(); refetch2(); };
  const projects = pd?.projects ?? [];
  const quotes = qd?.quotations ?? [];
  const ap = projects.filter(p => p.status === "in_progress" || p.status === "quoting");
  const pq = quotes.filter(q => q.status === "pending");
  const cp = projects.filter(p => p.status === "completed");
  const maxVal = Math.max(...[ap.length, pq.length, cp.length, projects.length, 1]);
  const stats = [
    { l: "Active", v: ap.length, c: "from-brand-500 to-brand-600", ic: <FolderKanban className="h-5 w-5" /> },
    { l: "Pending Quotes", v: pq.length, c: "from-warning-500 to-warning-600", ic: <FileText className="h-5 w-5" /> },
    { l: "Completed", v: cp.length, c: "from-success-500 to-success-600", ic: <CheckCircle2 className="h-5 w-5" /> },
    { l: "Total", v: projects.length, c: "from-secondary-500 to-secondary-600", ic: <Star className="h-5 w-5" /> },
  ];
  return (
    <motion.div initial="initial" animate="animate" variants={s} className="space-y-8">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      <motion.div variants={f} className="flex items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="text-2xl font-bold mt-2">Welcome, {user?.firstName}!</h1>
        </div>
        <Link to={ROUTES.CUSTOMER.POST_PROJECT}>
          <Button variant="secondary"><PlusCircle className="h-4 w-4" /> Post Project</Button>
        </Link>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(st => (
          <Card key={st.l} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase">{st.l}</span>
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">{st.ic}</div>
              </div>
              <p className="text-3xl font-bold">{st.v}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                <div className={"h-full rounded-full bg-gradient-to-r " + st.c} style={{ width: (st.v / maxVal * 100) + "%" }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Active Projects</CardTitle></CardHeader>
            <CardContent className="p-6">
              {projects.slice(0, 3).map((p, i) => (
                <div key={p.id} className={"flex gap-4 py-4 " + (i < 2 ? "border-b border-slate-100" : "")}>
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><Building2 className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold">{p.title}</h3>
                      <Badge className={STATUS_COLORS[p.status]} variant="default" size="sm">{p.status}</Badge>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                      <span><MapPin className="h-3 w-3 inline" /> {p.location}</span>
                      <span><IndianRupee className="h-3 w-3 inline" /> {p.budgetMin.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Pending Quotes</CardTitle></CardHeader>
            <CardContent className="p-6">
              {pq.length === 0 ? <p className="text-sm text-slate-500">No pending quotes</p> : pq.slice(0, 3).map(q => {
                const proj = projects.find(p => p.id === q.projectId);
                return (
                  <div key={q.id} className="p-3 rounded-xl border border-slate-100 mb-3">
                    <p className="text-xs text-slate-500">{proj?.title || "Project"}</p>
                    <p className="text-lg font-bold">Rs.{q.estimatedPrice.toLocaleString()}</p>
                    <Link to={ROUTES.CUSTOMER.QUOTATIONS}><Button size="xs" className="mt-2">Review</Button></Link>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-2">
              <Link to={ROUTES.CUSTOMER.POST_PROJECT}><Button variant="outline" className="justify-start"><PlusCircle className="h-4 w-4" /> Post Project</Button></Link>
              <Link to={ROUTES.CUSTOMER.QUOTATIONS}><Button variant="outline" className="justify-start"><FileText className="h-4 w-4" /> Review Quotes</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
