import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyQuotes, useProjects } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { FileText, IndianRupee, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { NoQuotesEmpty } from "@/components/shared/empty-states";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";
import { cn } from "@/lib/cn";

const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const filterTabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Declined" },
  { value: "withdrawn", label: "Withdrawn" },
];

export default function ContractorQuotesPage() {
  const [filter, setFilter] = useState("all");
  const { data: quotesData, isLoading } = useMyQuotes();
  const { data: projectsData } = useProjects();
  const myQuotes = quotesData?.quotations ?? [];
  const projects = projectsData?.projects ?? [];
  const filtered = filter === "all" ? myQuotes : myQuotes.filter(q => q.status === filter);

  const getProject = (id: string) => projects.find(p => p.id === id);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUpVariants} className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "My Quotes" }]} />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">My Quotes</h1>
        <p className="text-sm text-slate-500 mt-2">Track all your submitted quotations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: myQuotes.length, color: "from-brand-500 to-brand-600" },
          { label: "Pending", value: myQuotes.filter(q => q.status === "pending").length, color: "from-warning-500 to-warning-600" },
          { label: "Accepted", value: myQuotes.filter(q => q.status === "accepted").length, color: "from-success-500 to-success-600" },
          { label: "Declined", value: myQuotes.filter(q => q.status === "rejected").length, color: "from-danger-500 to-danger-600" },
        ].map(s => (
          <Card key={s.label} className="relative overflow-hidden border-slate-200/70 shadow-xs">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 w-fit">
        {filterTabs.map(st => (
          <button
            key={st.value}
            onClick={() => setFilter(st.value)}
            className={cn(
              "px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200",
              filter === st.value
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                : "text-slate-500 hover:text-slate-700"
            )}
            aria-pressed={filter === st.value}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Quotes List */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <NoQuotesEmpty />
        ) : (
          filtered.map((quote, i) => {
            const project = getProject(quote.projectId);
            const statusBg = quote.status === "accepted" ? "from-success-500 to-success-600" :
              quote.status === "rejected" ? "from-danger-500 to-danger-600" :
              "from-warning-500 to-orange-500";
            return (
              <motion.div key={quote.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusBg} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-bold text-slate-900">{project?.title || "Unknown Project"}</h3>
                              <p className="text-xs text-slate-500 mt-0.5">Quote #{quote.id.slice(0, 8)}</p>
                            </div>
                            <Badge className={cn(STATUS_COLORS[quote.status], "border-none font-semibold capitalize text-[10px] py-1 px-2.5 rounded-lg shrink-0")} variant="default" size="sm">
                              {quote.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs">
                            <span className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
                              <IndianRupee className="h-4 w-4" /> {quote.estimatedPrice.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" /> {quote.timeline}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Clock className="h-3.5 w-3.5 text-slate-400" /> {new Date(quote.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">{quote.proposal}</p>
                          <div className="flex items-center gap-2 mt-3">
                            {quote.status === "accepted" && <Badge variant="success" size="sm" className="rounded-lg"><CheckCircle2 className="h-3 w-3" /> Won!</Badge>}
                            {quote.status === "rejected" && <Badge variant="danger" size="sm" className="rounded-lg"><XCircle className="h-3 w-3" /> Not selected</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
