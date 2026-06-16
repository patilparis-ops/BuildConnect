import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingUp, TrendingDown, Wallet, Calendar, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useEarnings } from "@/hooks/use-api";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ContractorEarningsPage() {
  const { data, isLoading, isError, refetch } = useEarnings();
  const earningsData = data?.monthlyData || [25000, 42000, 38000, 55000, 48000, 62000, 71000, 58000, 45000];
  const transactions = data?.transactions || [];
  const totalEarnings = earningsData.reduce((a: number, b: number) => a + b, 0);
  const thisMonth = earningsData[earningsData.length - 1];
  const lastMonth = earningsData[earningsData.length - 2];
  const growth = ((thisMonth - lastMonth) / (lastMonth || 1)) * 100;
  const maxVal = Math.max(...earningsData, 1);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUpVariants} className="space-y-8">
      <ErrorBanner isError={isError} onRetry={refetch} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Earnings" }]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Earnings</h1>
          <p className="text-sm text-slate-500 mt-2">Track your revenue and payments</p>
        </div>
        <Button variant="outline" className="font-semibold"><Download className="h-4 w-4" /> Export</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Earnings</span>
              <div className="w-10 h-10 rounded-lg bg-success-50 text-success-600 flex items-center justify-center"><Wallet className="h-5 w-5" /></div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">₹{totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">This Month</span>
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><IndianRupee className="h-5 w-5" /></div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">₹{thisMonth.toLocaleString()}</p>
            <div className={"flex items-center gap-1.5 text-xs mt-2 font-medium " + (growth >= 0 ? "text-success-600" : "text-danger-600")}>
              {growth >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {Math.abs(growth).toFixed(0)}% vs last month
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending</span>
              <div className="w-10 h-10 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center"><Calendar className="h-5 w-5" /></div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">₹{(totalEarnings * 0.15).toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Awaiting clearance</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Transactions */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
              <CardTitle className="text-lg font-bold text-slate-900">Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-end gap-1.5 h-48">
                {earningsData.map((val: number, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[9px] text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">₹{(val / 1000).toFixed(0)}k</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: (val / maxVal) * 100 + "%" }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="w-full rounded-t-md bg-gradient-to-t from-brand-500 to-brand-400 group-hover:from-brand-600 group-hover:to-brand-500 transition-colors cursor-pointer"
                    />
                    <span className="text-[9px] text-slate-500 font-medium">{months[i % 12]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-300">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100/80">
            <CardTitle className="text-lg font-bold text-slate-900">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {transactions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">No recent transactions</div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-slate-100/80 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{t.project}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{t.date}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className={"text-sm font-bold " + (t.type === "credit" ? "text-success-600" : "text-danger-600")}>
                        {t.type === "credit" ? "+" : "-"}₹{Math.abs(t.amount || 0).toLocaleString()}
                      </p>
                      <Badge variant={t.status === "completed" ? "success" : "warning"} size="sm" className="mt-0.5">{t.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
