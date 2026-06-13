import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useAdminProjects } from "@/hooks/use-api";
import { PROJECT_CATEGORIES } from "@/constants";
import { Search, MapPin, Download } from "lucide-react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function AdminAllProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: projectsData, isLoading, isError, refetch } = useAdminProjects();
  const allProjects = projectsData?.projects ?? [];

  const filtered = allProjects.filter((p) => {
    const s = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const st = statusFilter === "all" || p.status === statusFilter;
    return s && st;
  });

  const statusCounts = allProjects.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  const statuses = ["all", ...Object.keys(statusCounts)];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-48 mt-2" />
            <Skeleton className="h-4 w-56 mt-1" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-80 rounded-lg" />
        <Skeleton className="h-10 w-96 rounded-lg" />
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Project", "Category", "Location", "Budget", "Status", "Quotes", "Posted"].map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className={"h-4 " + ["w-24","w-20","w-28","w-24","w-16","w-12","w-20"][j]} /></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: "All Projects" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">All Projects</h1>
          <p className="text-slate-500 mt-1">View and manage all projects on the platform.</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search by title, location, or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {statuses.map((st) => (
          <button key={st} onClick={() => setStatusFilter(st)}
            className={"px-4 py-1.5 text-sm font-medium rounded-md transition-colors " + (statusFilter === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700")}>
            {st === "all" ? "All" : st.replace("_", " ")} ({st === "all" ? allProjects.length : statusCounts[st] || 0})
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead sortable>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quotes</TableHead>
                <TableHead>Posted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">No projects found</TableCell>
                </TableRow>
              ) : (
                filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-200 transition-colors hover:bg-slate-50/50">
                    <TableCell><span className="text-sm font-medium text-slate-900">{p.title}</span></TableCell>
                    <TableCell><Badge variant="outline" size="sm">{PROJECT_CATEGORIES.find((c) => c.value === p.category)?.label || p.category}</Badge></TableCell>
                    <TableCell><span className="text-sm text-slate-600 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.location}</span></TableCell>
                    <TableCell><span className="text-sm font-semibold text-slate-900">Rs {p.budgetMin.toLocaleString()} - Rs {p.budgetMax.toLocaleString()}</span></TableCell>
                    <TableCell><Badge variant={p.status === "completed" ? "success" : p.status === "in_progress" ? "primary" : p.status === "open" ? "success" : "warning"} size="sm">{p.status.replace("_", " ")}</Badge></TableCell>
                    <TableCell><span className="text-sm text-slate-500">{p.quoteCount}</span></TableCell>
                    <TableCell><span className="text-sm text-slate-500">{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></TableCell>
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