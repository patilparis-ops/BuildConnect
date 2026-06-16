import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorBanner } from "@/components/shared/error-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminDashboard } from "@/hooks/use-api";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";
import { Users, Building2, FolderKanban, Star, TrendingUp, IndianRupee, CheckCircle2 } from "lucide-react";

const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const staggerVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const d = data as any;

  const stats = [
    { label: "Total Users", value: d?.users?.total?.toLocaleString() || "0", change: "+" + (d?.users?.newThisMonth || 0) + " this month", icon: <Users className="h-5 w-5" />, color: "from-brand-500 to-brand-600", bg: "bg-brand-50 text-brand-600" },
    { label: "Contractors", value: d?.users?.contractors?.toLocaleString() || "0", icon: <Building2 className="h-5 w-5" />, color: "from-secondary-500 to-secondary-600", bg: "bg-secondary-50 text-secondary-600" },
    { label: "Active Projects", value: d?.projects?.active?.toLocaleString() || "0", icon: <FolderKanban className="h-5 w-5" />, color: "from-success-500 to-success-600", bg: "bg-success-50 text-success-600" },
    { label: "Avg. Rating", value: d?.ratings?.average || "0", icon: <Star className="h-5 w-5" />, color: "from-warning-500 to-warning-600", bg: "bg-warning-50 text-warning-600" },
  ];

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={staggerVariants} className="space-y-8">
      <ErrorBanner isError={isError} onRetry={refetch} />
      
      <div>
        <Breadcrumbs items={[{ label: "Admin Dashboard" }]} />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-2">Platform overview and metrics</p>
      </div>

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
                <p className="text-4xl font-bold text-slate-900 tracking-tight">{st.value}</p>
                {(st as any).change && <span className="text-[10px] text-success-600 font-semibold block mt-2">{(st as any).change}</span>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <CardTitle className="text-lg font-bold text-slate-900">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-5xl font-bold text-slate-900 tracking-tight">₹{d?.revenue?.total?.toLocaleString() || "0"}</p>
              <p className="text-sm text-slate-500 mt-2 font-medium">Total platform escrow transaction volume</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <CardTitle className="text-lg font-bold text-slate-900">Recent Platform Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-5">
                {[
                  { text: "New contractor registered: Sneha Patel", time: "5 min ago", icon: <Users className="h-5 w-5" />, color: "bg-brand-50 text-brand-600" },
                  { text: "New project posted: Office Interior Design", time: "15 min ago", icon: <FolderKanban className="h-5 w-5" />, color: "bg-success-50 text-success-600" },
                  { text: "Verification request pending: Rajesh Kumar", time: "1 hour ago", icon: <CheckCircle2 className="h-5 w-5" />, color: "bg-warning-50 text-warning-600" },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50/40 transition-colors group">
                    <div className={"w-10 h-10 rounded-lg " + a.color + " flex items-center justify-center shrink-0 transition-colors shadow-xs"}>{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 leading-snug">{a.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <CardTitle className="text-lg font-bold text-slate-900">Platform Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50/50 transition-colors"><span className="text-xs text-slate-600 font-semibold">Homeowners</span><span className="text-sm font-bold text-slate-900">{d?.users?.customers?.toLocaleString() || "0"}</span></div>
              <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50/50 transition-colors"><span className="text-xs text-slate-600 font-semibold">Contractors</span><span className="text-sm font-bold text-slate-900">{d?.users?.contractors?.toLocaleString() || "0"}</span></div>
              <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50/50 transition-colors border-t border-slate-100 pt-3.5"><span className="text-xs text-slate-600 font-semibold">New This Month</span><Badge className="bg-brand-50 text-brand-700 border-none font-bold text-[10px] rounded-lg py-1 px-2.5">{d?.users?.newThisMonth || 0}</Badge></div>
              <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50/50 transition-colors"><span className="text-xs text-slate-600 font-semibold">Avg Project Value</span><span className="text-sm font-bold text-slate-900">₹{d?.revenue?.averageProjectValue?.toLocaleString() || "0"}</span></div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <CardTitle className="text-lg font-bold text-slate-900">Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
              {[5, 4, 3, 2, 1].map(r => {
                const count = d?.ratings?.distribution?.[r] || 0;
                const total = Object.values(d?.ratings?.distribution || {}).reduce((a: number, b: any) => a + (b as number), 0);
                const pct = total > 0 ? (count / total * 100) : 0;
                return (
                  <div key={r} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600 w-6">{r}★</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
