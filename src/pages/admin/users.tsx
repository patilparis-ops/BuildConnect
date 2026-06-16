import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Search, Users, Shield, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";
import { useAdminUsers, useVerifyUser } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { data, isLoading, isError, refetch } = useAdminUsers();
  const verifyUser = useVerifyUser();

  const allUsers = data?.users || [];
  const filtered = allUsers.filter((u: any) => {
    const matchSearch = !search || (u.name || u.firstName + " " + u.lastName).toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUpVariants} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      
      <div>
        <Breadcrumbs items={[{ label: "User Management" }]} />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Users</h1>
        <p className="text-sm text-slate-500 mt-2">Manage all platform users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300/70 bg-white text-sm transition-all duration-200 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
            aria-label="Search users" />
        </div>
        <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50">
          {["all", "customer", "contractor", "admin"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                roleFilter === r ? "bg-white text-slate-900 shadow-xs border border-slate-200/50" : "text-slate-500 hover:text-slate-700"
              )}
              aria-pressed={roleFilter === r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <Button variant="outline" className="font-semibold"><Shield className="h-4 w-4" /> Invite User</Button>
      </div>

      <Card className="border-slate-200/70 shadow-xs">
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
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">No users found</TableCell></TableRow>
              ) : (
                filtered.map((u: any, i: number) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-slate-200/60 transition-all duration-200 hover:bg-slate-50/80">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={"w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 " +
                          (u.role === "admin" ? "bg-slate-700" : u.role === "contractor" ? "bg-secondary-500" : "bg-brand-500")}>
                          {(u.name || u.firstName + " " + u.lastName).split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{u.name || u.firstName + " " + u.lastName}</p>
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
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
                          <Button variant="ghost" size="xs" className="text-xs font-semibold text-brand-600" onClick={() => verifyUser.mutate(u.id)}>Verify</Button>
                        )}
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
