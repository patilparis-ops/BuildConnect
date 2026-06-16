import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { useMyReviews, useProjects, useContractors } from "@/hooks/use-api";
import { ErrorBanner } from "@/components/shared/error-banner";
import { Star, Calendar } from "lucide-react";
import { NoReviewsEmpty } from "@/components/shared/empty-states";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function CustomerReviewsPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState("all");
  const { data: reviewsData, isLoading, isError: isError1, refetch: refetch1 } = useMyReviews();
  const { data: projectsData, isError: isError2, refetch: refetch2 } = useProjects();
  const { data: contractorsData, isError: isError3, refetch: refetch3 } = useContractors();
  const hasError = isError1 || isError2 || isError3;
  const handleRetry = () => { refetch1(); refetch2(); refetch3(); };
  const allReviews = reviewsData?.reviews ?? [];
  const allProjects = projectsData?.projects ?? [];
  const allContractors = contractorsData?.contractors ?? [];

  const myReviews = allReviews.filter((r) => r.customerId === user?.id || r.customerId === "u1");
  const filtered = filter === "all" ? myReviews : myReviews.filter((r) => r.rating === Number(filter));

  const getProjectTitle = (id: string) => allProjects.find((p) => p.id === id)?.title || "Unknown Project";
  const getContractorName = (id: string) => {
    const c = allContractors.find((c) => c.id === id);
    return c ? c.firstName + " " + c.lastName : "Unknown Contractor";
  };

  const ratingFilters = ["all", "5", "4", "3", "2", "1"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48 mt-2" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-80 rounded-lg" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      <div>
        <Breadcrumbs items={[{ label: "My Reviews" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">My Reviews</h1>
        <p className="text-slate-500 mt-1">Reviews you have written for contractors.</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {ratingFilters.map((r) => (
          <button key={r} onClick={() => setFilter(r)}
            className={"px-4 py-1.5 text-sm font-medium rounded-md transition-colors " + (filter === r ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700")}>
            {r === "all" ? "All" : r + "\u2605"}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card><CardContent className="py-8">
            <NoReviewsEmpty />
          </CardContent></Card>
        ) : (
          filtered.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                      <Star className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{review.title}</h3>
                          <p className="text-sm text-slate-500 mt-0.5">{getProjectTitle(review.projectId)}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">{review.comment}</p>
                      <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                        <span>Contractor: {getContractorName(review.contractorId)}</span>
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