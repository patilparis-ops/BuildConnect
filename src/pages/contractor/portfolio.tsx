import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { PlusCircle, Images, Edit3, Trash2, MapPin, Calendar, Star, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ErrorBanner } from "@/components/shared/error-banner";
import { usePortfolio, useCreatePortfolioItem, useUpdatePortfolioItem, useDeletePortfolioItem } from "@/hooks/use-api";
import { EmptyState } from "@/components/shared/empty-states";
import { PageSkeleton } from "@/components/shared/skeleton-loaders";

interface FormData {
  title: string;
  description: string;
  category: string;
  location: string;
  completedAt: string;
}

const fadeUpVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ContractorPortfolioPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { data, isError, refetch, isLoading } = usePortfolio();
  const createItem = useCreatePortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const deleteItem = useDeletePortfolioItem();
  const projects = data?.projects || [];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: { title: "", description: "", category: "", location: "", completedAt: "" },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", description: "", category: "", location: "", completedAt: "" });
    setShowForm(true);
  };

  const openEdit = (id: string) => {
    const item = projects.find(p => p.id === id);
    if (!item) return;
    setEditing(id);
    setValue("title", item.title);
    setValue("description", item.description);
    setValue("category", item.category);
    setValue("location", item.location || "");
    setValue("completedAt", item.completedAt);
    setShowForm(true);
  };

  const onSubmit = async (formData: FormData) => {
    if (editing) {
      await updateItem.mutateAsync({ id: editing, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remove this portfolio item?")) {
      await deleteItem.mutateAsync(id);
    }
  };

  const isPending = createItem.isPending || updateItem.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeUpVariants} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Portfolio" }]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Portfolio</h1>
          <p className="text-sm text-slate-500 mt-2">Showcase your best work to attract more clients</p>
        </div>
        <Button onClick={openCreate} variant="secondary" className="font-semibold"><PlusCircle className="h-5 w-5" /> Add Project</Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {projects.length === 0 ? (
          <div className="sm:col-span-2">
            <EmptyState
              icon={<Images className="h-6 w-6 text-slate-400" />}
              title="No portfolio items yet"
              description="Add your first project to showcase your high-quality work and attract more homeowners."
              actionText="Add Project"
              onActionClick={openCreate}
            />
          </div>
        ) : (
          projects.map((p: any, i: number) => (
            <motion.div key={p.id} variants={fadeUpVariants}>
              <Card className="overflow-hidden border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300 group">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                  <Images className="h-14 w-14 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="primary" size="sm" className="backdrop-blur-sm bg-white/80">{p.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3.5 text-xs text-slate-500">
                    {p.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.location}</span>}
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.completedAt}</span>
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {p.images?.length || 0} photos</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100/80">
                    <Button variant="ghost" size="sm" className="font-medium" onClick={() => openEdit(p.id)}><Edit3 className="h-4 w-4" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="font-medium text-danger-500 hover:text-danger-600 hover:bg-danger-50" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Dialog isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Project" : "Add Portfolio Project"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Project Title" placeholder="e.g. Modern Villa Renovation" error={errors.title?.message} {...register("title", { required: "Title is required" })} />
          <Textarea label="Description" placeholder="Describe the project scope and your role..." className="min-h-[100px]" error={errors.description?.message} {...register("description", { required: "Description is required" })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" placeholder="e.g. Renovation, Interior Design" error={errors.category?.message} {...register("category", { required: "Category is required" })} />
            <Input label="Location" placeholder="Mumbai" {...register("location")} />
          </div>
          <Input label="Completion Date" type="month" error={errors.completedAt?.message} {...register("completedAt", { required: "Date is required" })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={isPending}><PlusCircle className="h-4 w-4" /> Save Project</Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  );
}
