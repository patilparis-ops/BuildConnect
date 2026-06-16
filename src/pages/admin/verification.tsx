import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CheckCircle2, XCircle, Shield, Search, FileText, Download, Briefcase } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useAdminContractors, useVerifyContractor } from "@/hooks/use-api";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";

const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AdminVerificationPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useAdminContractors({ verified: false });
  const verifyContractor = useVerifyContractor();

  const pending = (data?.contractors || []).filter((c: any) => !c.verified && !c.isVerified).map((c: any) => ({
    id: c.id,
    name: c.firstName + " " + c.lastName,
    profession: c.profession,
    docs: c.certifications?.length > 0 ? c.certifications.map((cert: any) => cert.name) : ["License", "ID Proof"],
    submitted: c.createdAt?.split("T")[0] || "-",
    status: c.verificationStatus || "pending",
  }));

  const filtered = pending.filter((v: any) =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.profession.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUpVariants} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      
      <div>
        <Breadcrumbs items={[{ label: "Verification Requests" }]} />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Verification Requests</h1>
        <p className="text-sm text-slate-500 mt-2">Review and verify contractor credentials</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Search by name or profession..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300/70 bg-white text-sm transition-all duration-200 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
            aria-label="Search verification requests" />
        </div>
        <Button variant="outline" className="font-semibold"><Download className="h-4 w-4" /> Export</Button>
      </div>

      <Card className="border-slate-200/70 shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableHead>Profession</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">No pending verification requests</TableCell></TableRow>
              ) : (
                filtered.map((v: any, i: number) => (
                  <TableRow key={v.id} className="border-b border-slate-200/60 transition-all duration-200 hover:bg-slate-50/80">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {v.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{v.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm text-slate-600">{v.profession}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {v.docs.slice(0, 2).map((d: string, di: number) => (
                          <Badge key={di} variant="outline" size="sm" className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setSelected(d)}>
                            <FileText className="h-3 w-3 mr-1" />{d}
                          </Badge>
                        ))}
                        {v.docs.length > 2 && <Badge variant="outline" size="sm">+{v.docs.length - 2}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm text-slate-500">{v.submitted}</span></TableCell>
                    <TableCell>
                      <Badge variant={v.status === "pending" ? "warning" : "primary"} size="sm" className="rounded-lg">{v.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-success-600 hover:text-success-700 hover:bg-success-50 text-xs font-semibold" onClick={() => verifyContractor.mutate(v.id)}>
                          <CheckCircle2 className="h-4 w-4" /> Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 text-xs font-semibold">
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog isOpen={!!selected} onClose={() => setSelected(null)} title="View Document" size="md">
        <div className="h-48 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center">
          <FileText className="h-16 w-16 text-slate-300" />
        </div>
        <p className="text-sm text-slate-500 mt-4 text-center leading-relaxed">
          Document preview for <strong className="text-slate-700">{selected}</strong> would appear here
        </p>
      </Dialog>
    </motion.div>
  );
}
