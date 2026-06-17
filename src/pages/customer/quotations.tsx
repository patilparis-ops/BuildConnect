import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { useMyQuotes, useProjects, useAcceptQuote, useRejectQuote } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { FileText, IndianRupee, Calendar, Clock, CheckCircle2, XCircle, Building2 } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";
import type { Quotation } from "@/types";
import { NoQuotesEmpty } from "@/components/shared/empty-states";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";
import { cn } from "@/lib/cn";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const filterTabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Declined" },
];

interface QuoteListItemProps {
  quote: any;
  index: number;
  getProject: (id: string) => any;
  acceptQuote: ReturnType<typeof useAcceptQuote>;
  rejectQuote: ReturnType<typeof useRejectQuote>;
}

function QuoteListItem({ quote, index, getProject, acceptQuote, rejectQuote }: QuoteListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="overflow-hidden border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{getProject(quote.projectId)?.title || "Unknown Project"}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Quote #{quote.id.slice(0, 8)}</p>
                  </div>
                  <Badge className={cn(STATUS_COLORS[quote.status], "border-none font-semibold capitalize text-[10px] py-1 px-2.5 rounded-lg shrink-0")} variant="default" size="sm">
                    {quote.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs">
                  <span className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
                    <IndianRupee className="h-4 w-4" /> {quote.estimatedPrice.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> {quote.timeline || "Timeline TBD"}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">{quote.proposal}</p>
                {quote.status === "pending" && (
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" onClick={() => acceptQuote.mutate(quote.id)}>
                      <CheckCircle2 className="h-4 w-4" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => rejectQuote.mutate(quote.id)}>
                      <XCircle className="h-4 w-4" /> Decline
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CustomerQuotationsPage() {
  const [filter, setFilter] = useState("all");
  const { data: quotesData, isLoading: ql, isError: isError1, refetch: refetch1 } = useMyQuotes();
  const { data: projectsData, isLoading: pl, isError: isError2, refetch: refetch2 } = useProjects();
  const hasError = isError1 || isError2;
  const handleRetry = () => { refetch1(); refetch2(); };
  const acceptQuote = useAcceptQuote();
  const rejectQuote = useRejectQuote();

  const isLoading = ql || pl;
  const quotations: Quotation[] = quotesData?.quotations ?? [];
  const projects = projectsData?.projects ?? [];
  const filtered = filter === "all" ? quotations : quotations.filter(q => q.status === filter);

  const getProject = (projectId: string) => projects.find(p => p.id === projectId);

  // Group pending quotes by project for comparison
  const pendingByProject = quotations
    .filter(q => q.status === "pending")
    .reduce<Record<string, typeof quotations>>((acc, q) => {
      const pid = q.projectId;
      if (!acc[pid]) acc[pid] = [];
      acc[pid].push(q);
      return acc;
    }, {});

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      
      {/* Header */}
      <div>
        <Breadcrumbs items={[{ label: "Quotations" }]} />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Quotations</h1>
        <p className="text-sm text-slate-500 mt-2">Review and compare quotes from contractors</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: quotations.length, color: "from-brand-500 to-brand-600", icon: <FileText className="h-4 w-4" /> },
          { label: "Pending", value: quotations.filter(q => q.status === "pending").length, color: "from-warning-500 to-warning-600", icon: <Clock className="h-4 w-4" /> },
          { label: "Accepted", value: quotations.filter(q => q.status === "accepted").length, color: "from-success-500 to-success-600", icon: <CheckCircle2 className="h-4 w-4" /> },
        ].map((s) => (
          <Card key={s.label} className="relative overflow-hidden border-slate-200/70 shadow-xs">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">{s.icon}</div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{s.value}</p>
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

      {/* Pending Quotes Grouped by Project (Comparison View) */}
      {filter === "all" && Object.keys(pendingByProject).length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Pending Quotes — Compare</h2>
          {Object.entries(pendingByProject).map(([projectId, quotes]) => {
            const project = getProject(projectId);
            return (
              <div key={projectId}>
                <p className="text-sm font-semibold text-slate-600 mb-3">{project?.title || "Project"}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quotes.map((quote, qi) => (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qi * 0.05 }}
                      className="flex flex-col"
                    >
                      <Card className="flex-1 border-slate-200/70 hover:border-brand-400/50 hover:shadow-sm transition-all duration-300 group">
                        <CardContent className="p-5 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">Quote #{quote.id.slice(0, 6)}</p>
                              <p className="text-xs text-slate-400">{new Date(quote.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <p className="text-2xl font-bold text-slate-900 tracking-tight">₹{quote.estimatedPrice.toLocaleString()}</p>
                          
                          {quote.timeline && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>{quote.timeline}</span>
                            </div>
                          )}

                          <p className="text-sm text-slate-600 mt-4 line-clamp-3 leading-relaxed flex-1">{quote.proposal}</p>

                          {quote.materials && quote.materials.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-slate-100/80">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Materials</p>
                              <div className="space-y-1.5">
                                {quote.materials.map((m: any, mi: number) => (
                                  <div key={mi} className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600">{m.name}</span>
                                    <span className="font-semibold text-slate-900">₹{m.cost.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {quote.status === "pending" && (
                            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100/80">
                              <Button size="sm" className="flex-1 text-xs" onClick={() => acceptQuote.mutate(quote.id)}>
                                <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => rejectQuote.mutate(quote.id)}>
                                <XCircle className="h-3.5 w-3.5" /> Decline
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All Quotes List (excluding pending when shown in comparison) */}
      <div className="grid gap-4">
        {filter === "all" && Object.keys(pendingByProject).length > 0 ? (
          <>
            {quotations.filter(q => q.status !== "pending").length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 mt-2">History</h2>
                {quotations.filter(q => q.status !== "pending").map((quote, i) => (
                  <QuoteListItem key={quote.id} quote={quote} index={i} getProject={getProject} acceptQuote={acceptQuote} rejectQuote={rejectQuote} />
                ))}
              </div>
            )}
          </>
        ) : filtered.length === 0 ? (
          <NoQuotesEmpty />
        ) : (
          filtered.map((quote, i) => (
            <QuoteListItem key={quote.id} quote={quote} index={i} getProject={getProject} acceptQuote={acceptQuote} rejectQuote={rejectQuote} />
          ))
        )}
      </div>
    </motion.div>
  );
}
