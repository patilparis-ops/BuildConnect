import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Search, Users, Shield, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useAdminUsers, useVerifyUser } from "@/hooks/use-api";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { data, isError, refetch } = useAdminUsers();
  const verifyUser = useVerifyUser();

  const allUsers = data?.users || [];
  const filtered = allUsers.filter((u: any) => {
    const matchSearch = !search || (u.name || u.firstName + " " + u.lastName).toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div>
        <Breadcrumbs items={[{ label: "User Management" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Users</h1>
        <p className="text-slate-500 mt-1">Manage all platform users.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {["all", "customer", "contractor", "admin"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors " + (roleFilter === r ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700")}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <Button variant="outline"><Shield className="h-4 w-4" /> Invite User</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-slate-200 transition-colors hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={"w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold " +
                        (u.role === "admin" ? "bg-slate-700" : u.role === "contractor" ? "bg-secondary-500" : "bg-brand-500")}>
                        {(u.name || u.firstName + " " + u.lastName).split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{u.name || u.firstName + " " + u.lastName}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={u.role === "admin" ? "default" : u.role === "contractor" ? "secondary" : "primary"} size="sm">{u.role}</Badge></TableCell>
                  <TableCell><Badge variant={(u.status === "active" || u.isVerified) ? "success" : "warning"} size="sm">{u.status || (u.isVerified ? "active" : "pending")}</Badge></TableCell>
                  <TableCell>{(u.verified || u.isVerified) ? <CheckCircle2 className="h-4 w-4 text-success-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}</TableCell>
                  <TableCell><span className="text-sm text-slate-500">{u.joined || u.createdAt?.split("T")[0] || "-"}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {!u.verified && !u.isVerified && (
                        <Button variant="ghost" size="xs" onClick={() => verifyUser.mutate(u.id)}>Verify</Button>
                      )}
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
