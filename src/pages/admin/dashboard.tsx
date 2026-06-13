import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorBanner } from "@/components/shared/error-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboard } from "@/hooks/use-api";
import { Users, Building2, FolderKanban, Star, TrendingUp, IndianRupee, CheckCircle2 } from "lucide-react";

const f = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const s = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08 } } };

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
    return <div className="space-y-8"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div></div>;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={s} className="space-y-8">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div>
        <Breadcrumbs items={[{ label: "Admin Dashboard" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform overview and metrics.</p>
      </div>

      <motion.div variants={s} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(st => (
          <motion.div key={st.label} variants={f}>
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{st.label}</span>
                  <div className={"w-9 h-9 rounded-lg " + st.bg + " flex items-center justify-center"}>{st.icon}</div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{st.value}</p>
                {(st as any).change && <span className="text-xs text-success-600 font-medium">{(st as any).change}</span>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Revenue Overview</CardTitle></CardHeader>
            <CardContent className="p-6">
              <p className="text-3xl font-bold text-slate-900">Rs.{d?.revenue?.total?.toLocaleString() || "0"}</p>
              <p className="text-sm text-slate-500 mt-1">Total platform revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { text: "New contractor registered: Sneha Patel", time: "5 min ago", icon: <Users className="h-4 w-4" />, color: "bg-brand-50 text-brand-600" },
                  { text: "New project posted: Office Interior Design", time: "15 min ago", icon: <FolderKanban className="h-4 w-4" />, color: "bg-success-50 text-success-600" },
                  { text: "Verification request pending: Rajesh Kumar", time: "1 hour ago", icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-warning-50 text-warning-600" },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={"w-8 h-8 rounded-lg " + a.color + " flex items-center justify-center shrink-0"}>{a.icon}</div>
                    <div className="flex-1"><p className="text-sm text-slate-700">{a.text}</p><p className="text-xs text-slate-400 mt-0.5">{a.time}</p></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Quick Stats</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm text-slate-600">Customers</span><span className="font-semibold">{d?.users?.customers?.toLocaleString() || "0"}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-slate-600">Contractors</span><span className="font-semibold">{d?.users?.contractors?.toLocaleString() || "0"}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-slate-600">New This Month</span><Badge variant="primary">{d?.users?.newThisMonth || 0}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm text-slate-600">Avg Project Value</span><span className="text-sm font-semibold">Rs.{d?.revenue?.averageProjectValue?.toLocaleString() || "0"}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Rating Distribution</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-2">
              {[5, 4, 3, 2, 1].map(r => {
                const count = d?.ratings?.distribution?.[r] || 0;
                const total = Object.values(d?.ratings?.distribution || {}).reduce((a: number, b: any) => a + (b as number), 0);
                const pct = total > 0 ? (count / total * 100) : 0;
                return (
                  <div key={r} className="flex items-center gap-2">
                    <span className="text-xs w-6">{r}★</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full">
                      <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500" style={{ width: pct + "%" }} />
                    </div>
                    <span className="text-xs w-8 text-right">{count}</span>
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
