import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { IndianRupee, Download, Search, TrendingUp, Wallet, CreditCard, Clock } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useAdminPayments } from "@/hooks/use-api";

export default function AdminPaymentsPage() {
  const { data, isError, refetch } = useAdminPayments();
  const transactions = data?.transactions || [];
  const totalRevenue = transactions.filter((t: any) => t.status === "completed").reduce((a: number, t: any) => a + t.fee, 0);
  const totalVolume = transactions.filter((t: any) => t.status === "completed").reduce((a: number, t: any) => a + t.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Payments" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Payments</h1>
          <p className="text-slate-500 mt-1">Monitor transactions and platform revenue.</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">Platform Revenue</span>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-success-600 mt-1">+12.5% this month</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">Total Volume</span>
            <div className="w-9 h-9 rounded-lg bg-success-50 text-success-600 flex items-center justify-center"><Wallet className="h-5 w-5" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{(totalVolume / 100000).toFixed(1)}L</p>
          <p className="text-xs text-slate-500 mt-1">Processed transactions</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">In Escrow</span>
            <div className="w-9 h-9 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center"><Clock className="h-5 w-5" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{transactions.filter(t => t.status === "escrow").reduce((a, t) => a + t.amount, 0).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Held in escrow</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="px-6 pt-6 pb-0"><CardTitle>All Transactions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead sortable>Amount</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-200 transition-colors hover:bg-slate-50/50">
                  <TableCell><span className="text-sm font-medium text-slate-900">{t.project}</span></TableCell>
                  <TableCell><span className="text-sm text-slate-600">{t.customer}</span></TableCell>
                  <TableCell><span className="text-sm text-slate-600">{t.contractor}</span></TableCell>
                  <TableCell><span className="text-sm font-semibold text-slate-900">₹{t.amount.toLocaleString()}</span></TableCell>
                  <TableCell><span className="text-sm text-slate-500">₹{t.fee.toLocaleString()}</span></TableCell>
                  <TableCell><Badge variant={t.status === "completed" ? "success" : t.status === "escrow" ? "warning" : "primary"} size="sm">{t.status}</Badge></TableCell>
                  <TableCell><span className="text-sm text-slate-500">{t.date}</span></TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
