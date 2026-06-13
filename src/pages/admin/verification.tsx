import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CheckCircle2, XCircle, Shield, Search, FileText, Download, Briefcase } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useAdminContractors, useVerifyContractor } from "@/hooks/use-api";

export default function AdminVerificationPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const { data, isError, refetch } = useAdminContractors({ verified: false });
  const verifyContractor = useVerifyContractor();

  const pending = (data?.contractors || []).filter((c: any) => !c.verified && !c.isVerified).map((c: any) => ({
    id: c.id,
    name: c.firstName + " " + c.lastName,
    profession: c.profession,
    docs: c.certifications?.length > 0 ? c.certifications.map((cert: any) => cert.name) : ["License"],
    submitted: c.createdAt?.split("T")[0] || "-",
    status: c.verificationStatus || "pending",
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div>
        <Breadcrumbs items={[{ label: "Verification Requests" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Verification Requests</h1>
        <p className="text-slate-500 mt-1">Review and verify contractor credentials.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search requests..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>

      <Card>
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
              {pending.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">No pending verification requests</TableCell></TableRow>
            ) : (
              pending.map((v, i) => (
                <TableRow key={v.id}>
                  <TableCell><span className="text-sm font-medium text-slate-900">{v.name}</span></TableCell>
                  <TableCell><span className="text-sm text-slate-600">{v.profession}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {v.docs.slice(0, 2).map((d: string, di: number) => (
                        <Badge key={di} variant="outline" size="sm" className="cursor-pointer" onClick={() => setSelected(d)}>
                          <FileText className="h-3 w-3 mr-1" />{d}
                        </Badge>
                      ))}
                      {v.docs.length > 2 && <Badge variant="outline" size="sm">+{v.docs.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm text-slate-500">{v.submitted}</span></TableCell>
                  <TableCell>
                    <Badge variant={v.status === "pending" ? "warning" : "primary"} size="sm">{v.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-success-600" onClick={() => verifyContractor.mutate(v.id)}>
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </Button>
                      <Button variant="ghost" size="sm" className="text-danger-600">
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
        <div className="h-48 rounded-xl bg-slate-100 flex items-center justify-center">
          <FileText className="h-16 w-16 text-slate-300" />
        </div>
        <p className="text-sm text-slate-500 mt-4 text-center">Document preview would appear here</p>
      </Dialog>
    </motion.div>
  );
}
