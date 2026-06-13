import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingUp, TrendingDown, Wallet, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useEarnings } from "@/hooks/use-api";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function ContractorEarningsPage() {
  const { data, isError, refetch } = useEarnings();
  const earningsData = data?.monthlyData || [25000, 42000, 38000, 55000, 48000, 62000, 71000, 58000, 45000];
  const transactions = data?.transactions || [];
  const totalEarnings = earningsData.reduce((a: number, b: number) => a + b, 0);
  const thisMonth = earningsData[earningsData.length - 1];
  const lastMonth = earningsData[earningsData.length - 2];
  const growth = ((thisMonth - lastMonth) / lastMonth) * 100;

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Earnings" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Earnings</h1>
          <p className="text-slate-500 mt-1">Track your revenue and payments.</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">Total Earnings</span>
            <div className="w-9 h-9 rounded-lg bg-success-50 text-success-600 flex items-center justify-center"><Wallet className="h-5 w-5" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{totalEarnings.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Lifetime earnings</p>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">This Month</span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><IndianRupee className="h-5 w-5" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{thisMonth.toLocaleString()}</p>
          <div className={"flex items-center gap-1 text-xs mt-1 " + (growth >= 0 ? "text-success-600" : "text-danger-600")}>
            {growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(growth).toFixed(0)}% vs last month
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">Pending</span>
            <div className="w-9 h-9 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center"><Calendar className="h-5 w-5" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{(totalEarnings * 0.15).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Awaiting clearance</p>
        </CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Earnings Overview</CardTitle></CardHeader>
            <CardContent className="p-6">
              <div className="flex items-end gap-1 h-40">
                {earningsData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-medium">₹{(val / 1000).toFixed(0)}k</span>
                    <div className="w-full rounded-t-md bg-gradient-to-t from-brand-500 to-brand-400"
                      style={{ height: (val / Math.max(...earningsData)) * 100 + "%" }} />
                    <span className="text-[10px] text-slate-500">{months[i % 12]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Recent Transactions</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-3">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{t.project}</p>
                  <p className="text-xs text-slate-400">{t.date}</p>
                </div>
                <div className="text-right">
                  <p className={"text-sm font-semibold " + (t.type === "credit" ? "text-success-600" : "text-danger-600")}>
                    {t.type === "credit" ? "+" : ""}₹{Math.abs(t.amount).toLocaleString()}
                  </p>
                  <Badge variant={t.status === "completed" ? "success" : "warning"} size="sm">{t.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
