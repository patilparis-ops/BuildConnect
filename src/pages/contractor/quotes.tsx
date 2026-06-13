import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyQuotes, useProjects } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { FileText, IndianRupee, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function ContractorQuotesPage() {
  const [filter, setFilter] = useState("all");
  const { data: quotesData, isLoading } = useMyQuotes();
  const { data: projectsData } = useProjects();
  const myQuotes = quotesData?.quotations ?? [];
  const projects = projectsData?.projects ?? [];
  const filtered = filter === "all" ? myQuotes : myQuotes.filter(q => q.status === filter);

  const getProject = (id: string) => projects.find(p => p.id === id);

  if (isLoading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "My Quotes" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">My Quotes</h1>
        <p className="text-slate-500 mt-1">Track all your submitted quotations.</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {["all", "pending", "accepted", "rejected", "withdrawn"].map(st => (
          <button key={st} onClick={() => setFilter(st)}
            className={"px-4 py-1.5 text-sm font-medium rounded-md transition-colors " + (filter === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700")}>
            {st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card><CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900">No quotes yet</h3>
            <p className="text-sm text-slate-500 mt-1">Browse available projects and submit your first quote</p>
          </CardContent></Card>
        ) : (
          filtered.map((quote, i) => {
            const project = getProject(quote.projectId);
            return (
              <motion.div key={quote.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={"w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 " +
                          (quote.status === "accepted" ? "bg-gradient-to-br from-success-500 to-success-600" :
                           quote.status === "rejected" ? "bg-gradient-to-br from-danger-500 to-danger-600" :
                           "bg-gradient-to-br from-warning-500 to-orange-500")}>
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-slate-900">{project?.title || "Unknown Project"}</h3>
                            <Badge className={STATUS_COLORS[quote.status]} variant="default" size="md">{quote.status}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1 text-base font-bold text-slate-900"><IndianRupee className="h-4 w-4" /> {quote.estimatedPrice.toLocaleString()}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {quote.timeline}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(quote.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{quote.proposal}</p>
                          <div className="flex items-center gap-2 mt-3">
                            {quote.status === "accepted" && <Badge variant="success" size="sm"><CheckCircle2 className="h-3 w-3" /> Won!</Badge>}
                            {quote.status === "rejected" && <Badge variant="danger" size="sm"><XCircle className="h-3 w-3" /> Not selected</Badge>}
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
