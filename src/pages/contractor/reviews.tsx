import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { useContractorReviews, useProjects } from "@/hooks/use-api";
import { ErrorBanner } from "@/components/shared/error-banner";
import { NoReviewsEmpty } from "@/components/shared/empty-states";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";
import { cn } from "@/lib/cn";
import { Star, Calendar, User } from "lucide-react";

const fadeUpVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const ratingFilters = [
  { value: "all", label: "All" },
  { value: "5", label: "5★" },
  { value: "4", label: "4★" },
  { value: "3", label: "3★" },
  { value: "2", label: "2★" },
  { value: "1", label: "1★" },
];

export default function ContractorReviewsPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState("all");
  const myId = user?.id || "c5";
  const { data: reviewsData, isLoading, isError: isError1, refetch: refetch1 } = useContractorReviews(myId);
  const { data: projectsData, isError: isError2, refetch: refetch2 } = useProjects();
  const hasError = isError1 || isError2;
  const handleRetry = () => { refetch1(); refetch2(); };
  const myReviews = reviewsData?.reviews ?? [];
  const allProjects = projectsData?.projects ?? [];
  const filtered = filter === "all" ? myReviews : myReviews.filter((r) => r.rating === Number(filter));
  const getProjectTitle = (id: string) => allProjects.find((p) => p.id === id)?.title || "Unknown Project";
  const avgRating = myReviews.length > 0 ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1) : "0";

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUpVariants} className="space-y-6">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      
      <div>
        <Breadcrumbs items={[{ label: "Reviews" }]} />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Client Reviews</h1>
        <p className="text-sm text-slate-500 mt-2">Feedback from your completed projects</p>
      </div>

      {/* Rating Summary */}
      {myReviews.length > 0 && (
        <Card className="border-slate-200/70 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">{avgRating}</span>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={"h-4 w-4 " + (i < Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{myReviews.length} review{myReviews.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 w-fit">
        {ratingFilters.map((r) => (
          <button
            key={r.value}
            onClick={() => setFilter(r.value)}
            className={cn(
              "px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200",
              filter === r.value
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                : "text-slate-500 hover:text-slate-700"
            )}
            aria-pressed={filter === r.value}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <NoReviewsEmpty />
        ) : (
          filtered.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{review.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{getProjectTitle(review.projectId)}</p>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5" /> {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
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
