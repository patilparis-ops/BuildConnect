import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Building2, FolderKanban, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useAdminDashboard } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";

const f = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const s = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function AdminAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const d = data as any;

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div></div>;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={s} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Analytics" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Analytics</h1>
          <p className="text-slate-500 mt-1">Platform insights and reports.</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      <motion.div variants={s} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: (d?.users?.total || 4892).toLocaleString(), change: "+" + (d?.users?.newThisMonth || 520) + " this month" },
          { label: "Active Users", value: ((d?.users?.total || 4892) * 0.58).toFixed(0), change: "+8.1%" },
          { label: "Conversion Rate", value: "24.6%", change: "+2.4%" },
          { label: "Avg. Rating", value: (d?.ratings?.average || 4.7).toString() + " \u2605", change: "+" + ((d?.ratings?.average || 4.7) - 4.6).toFixed(1) + "%" },
        ].map((st, i) => (
          <motion.div key={i} variants={f}>
            <Card>
              <CardContent className="p-5">
                <span className="text-xs font-medium text-slate-500 uppercase">{st.label}</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{st.value}</p>
                <span className="text-xs text-success-600 font-medium">{st.change}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>User Growth</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="flex items-end gap-1 h-40">
              {[120, 180, 240, 310, 280, 350, 420, 390, 450, 510, 580, 650].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-slate-400">{val}</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-brand-500 to-brand-400" style={{ height: (val / 650) * 100 + "%" }} />
                  <span className="text-[10px] text-slate-500">{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Rating Distribution</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(r => {
                const count = d?.ratings?.distribution?.[r] || [245, 85, 30, 12, 8][5 - r];
                const dist = d?.ratings?.distribution || { 5: 245, 4: 85, 3: 30, 2: 12, 1: 8 };
                const total = Object.values(dist).reduce((a: number, b: any) => a + (b as number), 0);
                const pct = total > 0 ? (count / total * 100) : 0;
                return (
                  <div key={r} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600 w-8">{r} \u2605</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500" style={{ width: pct + "%" }} />
                    </div>
                    <span className="text-xs text-slate-500 w-10 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Top Cities</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-3">
            {[
              { city: "Mumbai", count: 890, pct: 100 },
              { city: "Delhi", count: 720, pct: 80 },
              { city: "Bangalore", count: 650, pct: 72 },
              { city: "Hyderabad", count: 480, pct: 53 },
              { city: "Pune", count: 410, pct: 46 },
              { city: "Ahmedabad", count: 320, pct: 36 },
            ].map(c => (
              <div key={c.city} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24">{c.city}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400" style={{ width: c.pct + "%" }} />
                </div>
                <span className="text-xs font-medium text-slate-900 w-12 text-right">{c.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Project Categories</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-3">
            {[
              { label: "Renovation", pct: 28 },
              { label: "New Build", pct: 18 },
              { label: "Electrical", pct: 15 },
              { label: "Plumbing", pct: 12 },
              { label: "Interior Design", pct: 10 },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 flex-1">{c.label}</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-secondary-500 to-secondary-400" style={{ width: c.pct * 3 + "%" }} />
                </div>
                <span className="text-xs font-medium text-slate-900 w-10 text-right">{c.pct}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Engagement</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Avg. Projects/User</span>
              <span className="text-sm font-semibold text-slate-900">2.4</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Avg. Quotes/Project</span>
              <span className="text-sm font-semibold text-slate-900">4.2</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Project Success Rate</span>
              <span className="text-sm font-semibold text-slate-900">87%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Repeat Customer Rate</span>
              <span className="text-sm font-semibold text-slate-900">42%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-600">Avg. Response Time</span>
              <span className="text-sm font-semibold text-slate-900">4.5 hrs</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
