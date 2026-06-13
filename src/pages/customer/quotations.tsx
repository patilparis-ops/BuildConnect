import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { useMyQuotes, useProjects } from "@/hooks/use-api";
import { useAcceptQuote, useRejectQuote } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { FileText, IndianRupee, Calendar, Clock, CheckCircle2, XCircle, Star, User } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function CustomerQuotationsPage() {
  const [filter, setFilter] = useState("all");
  const { data: quotesData, isError: isError1, refetch: refetch1 } = useMyQuotes();
  const { data: projectsData, isError: isError2, refetch: refetch2 } = useProjects();
  const hasError = isError1 || isError2;
  const handleRetry = () => { refetch1(); refetch2(); };
  const acceptQuote = useAcceptQuote();
  const rejectQuote = useRejectQuote();

  const quotations = quotesData?.quotations ?? [];
  const projects = projectsData?.projects ?? [];
  const filtered = filter === "all" ? quotations : quotations.filter(q => q.status === filter);

  const getProjectTitle = (projectId: string) => projects.find(p => p.id === projectId)?.title || "Unknown Project";

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      <div>
        <Breadcrumbs items={[{ label: "Quotations" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Quotations</h1>
        <p className="text-slate-500 mt-1">Review and compare quotes from contractors.</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {["all", "pending", "accepted", "rejected"].map(st => (
          <button key={st} onClick={() => setFilter(st)}
            className={"px-4 py-1.5 text-sm font-medium rounded-md transition-colors " + (filter === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700")}>
            {st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900">No quotations yet</h3>
              <p className="text-sm text-slate-500 mt-1">Quotes from contractors will appear here</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((quote, i) => (
            <motion.div key={quote.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">{getProjectTitle(quote.projectId)}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Quote #{quote.id.slice(0, 6)}</p>
                          </div>
                          <Badge className={STATUS_COLORS[quote.status]} variant="default" size="md">{quote.status}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-base font-bold text-slate-900"><IndianRupee className="h-4 w-4" /> {quote.estimatedPrice.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {quote.timeline}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(quote.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-3 line-clamp-2">{quote.proposal}</p>
                        {quote.materials && quote.materials.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {quote.materials.map((m: any, mi: number) => (
                              <Badge key={mi} variant="outline" size="sm">{m.name}: Rs.{m.cost.toLocaleString()}</Badge>
                            ))}
                          </div>
                        )}
                        {quote.status === "pending" && (
                          <div className="flex items-center gap-2 mt-4">
                            <Button variant="primary" size="sm" onClick={() => acceptQuote.mutate(quote.id)}><CheckCircle2 className="h-4 w-4" /> Accept</Button>
                            <Button variant="outline" size="sm" onClick={() => rejectQuote.mutate(quote.id)}><XCircle className="h-4 w-4" /> Decline</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
