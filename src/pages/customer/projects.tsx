import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import { useMyProjects, useCreateReview } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { Building2, MapPin, IndianRupee, FileText, PlusCircle, Star, Search, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/cn";
import { ErrorBanner } from "@/components/shared/error-banner";
import { NoProjectsEmpty } from "@/components/shared/empty-states";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const statusFilters = [
  { value: "all", label: "All Projects" },
  { value: "open", label: "Open" },
  { value: "quoting", label: "Quoting" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface ReviewForm {
  rating: number;
  title: string;
  comment: string;
}

export default function CustomerProjectsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [reviewProject, setReviewProject] = useState<{ id: string; title: string; contractorId: string } | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const { data, isLoading, isError, refetch } = useMyProjects();
  const createReview = useCreateReview();
  const projects = data?.projects ?? [];

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ReviewForm>({
    defaultValues: { rating: 5, title: "", comment: "" },
  });

  const watchRating = watch("rating");

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleReviewSubmit = async (formData: ReviewForm) => {
    if (!reviewProject) return;
    await createReview.mutateAsync({
      projectId: reviewProject.id,
      contractorId: reviewProject.contractorId,
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
    });
    setReviewProject(null);
    reset();
  };

  const openReview = (project: any) => {
    setReviewProject({
      id: project.id,
      title: project.title,
      contractorId: project.awardedTo || "",
    });
    setValue("rating", 5);
    setValue("title", "");
    setValue("comment", "");
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Projects" }]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">My Projects</h1>
          <p className="text-sm text-slate-500 mt-2">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link to={ROUTES.CUSTOMER.POST_PROJECT}>
          <Button variant="secondary" size="lg" className="font-semibold shadow-lg shadow-secondary-500/20"><PlusCircle className="h-5 w-5" /> Post New Project</Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects by title or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300/70 bg-white text-sm transition-all duration-200 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
            aria-label="Search projects"
          />
        </div>
        <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 w-fit flex-wrap">
          {statusFilters.map(st => (
            <button
              key={st.value}
              onClick={() => setFilterStatus(st.value)}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                filterStatus === st.value
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700"
              )}
              aria-pressed={filterStatus === st.value}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <NoProjectsEmpty />
        ) : (
          filtered.map((project: any, i: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="overflow-hidden border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-bold text-slate-900 leading-snug">{project.title}</h3>
                            <Badge className={cn(STATUS_COLORS[project.status] || "bg-slate-100 text-slate-700", "border-none font-semibold capitalize text-[10px] py-1 px-2.5 shrink-0 rounded-lg")} variant="default" size="sm">
                              {project.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {project.location}
                            </span>
                            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                              <IndianRupee className="h-3.5 w-3.5" /> ₹{project.budgetMin?.toLocaleString()} - ₹{project.budgetMax?.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-slate-400" /> {project.quoteCount || 0} quotes
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Actions Bar */}
                  <div className="px-5 sm:px-6 py-3 bg-slate-50/50 border-t border-slate-100/80 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {project.status === "completed" && (
                      <Button size="sm" variant="ghost" className="text-xs font-semibold text-yellow-600 hover:bg-yellow-50/80" onClick={() => openReview(project)}>
                        <Star className="h-3.5 w-3.5" /> Leave Review
                      </Button>
                    )}
                    {project.status === "quoting" && (
                      <Link to={ROUTES.CUSTOMER.QUOTATIONS}>
                        <Button size="sm" variant="ghost" className="text-xs font-semibold text-brand-600 hover:bg-brand-50/80">
                          <FileText className="h-3.5 w-3.5" /> View Quotes <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Review Dialog */}
      <Dialog
        isOpen={!!reviewProject}
        onClose={() => setReviewProject(null)}
        title={`Review: ${reviewProject?.title || ""}`}
        size="md"
      >
        <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-3 block">Rating</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue("rating", star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-all duration-150 hover:scale-110"
                  aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || watchRating)
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Review Title"
            placeholder="Summarize your experience"
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />

          <Textarea
            label="Your Review"
            placeholder="Describe your experience working with this contractor..."
            className="min-h-[100px]"
            error={errors.comment?.message}
            {...register("comment", { required: "Please write a review" })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setReviewProject(null)}>Cancel</Button>
            <Button type="submit" loading={createReview.isPending}>
              <Star className="h-4 w-4" /> Submit Review
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  );
}
