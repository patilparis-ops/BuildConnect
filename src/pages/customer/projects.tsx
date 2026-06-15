import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import { useMyProjects, useCreateReview } from "@/hooks/use-api";
import { STATUS_COLORS } from "@/constants";
import { Building2, MapPin, IndianRupee, FileText, PlusCircle, Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorBanner } from "@/components/shared/error-banner";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

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
  const { data, isError, refetch } = useMyProjects();
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

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Projects" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">My Projects</h1>
        </div>
        <Link to={ROUTES.CUSTOMER.POST_PROJECT}>
          <Button><PlusCircle className="h-4 w-4" /> Post New Project</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-3 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none" />
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit flex-wrap">
          {["all", "open", "quoting", "in_progress", "completed", "cancelled"].map(st => (
            <button key={st} onClick={() => setFilterStatus(st)}
              className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors " + (filterStatus === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700")}>
              {st === "all" ? "All" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-900 mb-1">No projects found</h3>
              <p className="text-sm text-slate-500 mb-4">Post your first project to get started</p>
              <Link to={ROUTES.CUSTOMER.POST_PROJECT}><Button size="sm"><PlusCircle className="h-4 w-4" /> Post a Project</Button></Link>
            </CardContent>
          </Card>
        ) : (
          filtered.map((project: any, i: number) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card hover className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shrink-0">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-slate-900">{project.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {project.location}</span>
                          <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> Rs.{project.budgetMin?.toLocaleString()} - Rs.{project.budgetMax?.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {project.quoteCount || 0} quotes</span>
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge className={STATUS_COLORS[project.status]} variant="default" size="md">
                        {project.status.replace("_", " ")}
                      </Badge>
                      {project.status === "completed" && (
                        <Button size="xs" variant="secondary" onClick={() => openReview(project)}>
                          <Star className="h-3.5 w-3.5" /> Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Dialog
        isOpen={!!reviewProject}
        onClose={() => setReviewProject(null)}
        title={`Review: ${reviewProject?.title || ""}`}
        size="md"
      >
        <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-5">
          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue("rating", star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= (hoverRating || watchRating)
                        ? "fill-yellow-400 text-yellow-400"
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
            label="Review"
            placeholder="Describe your experience working with this contractor..."
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
