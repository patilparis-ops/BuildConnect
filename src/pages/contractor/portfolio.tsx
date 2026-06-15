import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { PlusCircle, Images, Edit3, Trash2, MapPin, Calendar, Star, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ErrorBanner } from "@/components/shared/error-banner";
import { usePortfolio, useCreatePortfolioItem, useUpdatePortfolioItem, useDeletePortfolioItem } from "@/hooks/use-api";

interface FormData {
  title: string;
  description: string;
  category: string;
  location: string;
  completedAt: string;
}

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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Portfolio" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Portfolio</h1>
          <p className="text-slate-500 mt-1">Showcase your best work to attract more clients.</p>
        </div>
        <Button onClick={openCreate}><PlusCircle className="h-4 w-4" /> Add Project</Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <Card className="sm:col-span-2">
            <CardContent className="p-12 text-center">
              <Images className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900">No portfolio items yet</h3>
              <p className="text-sm text-slate-500 mt-1">Add your first project to showcase your work</p>
              <Button variant="outline" className="mt-4" onClick={openCreate}>
                <PlusCircle className="h-4 w-4" /> Add Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((p: any, i: number) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="relative h-40 -mx-5 -mt-5 mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-xl flex items-center justify-center">
                    <Images className="h-12 w-12 text-slate-300" />
                    <div className="absolute top-3 right-3">
                      <Badge variant="primary" size="sm">{p.category}</Badge>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                    {p.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>}
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.completedAt}</span>
                    <span><Star className="h-3 w-3 inline fill-yellow-400 text-yellow-400" /></span>
                    <span>{p.images?.length || 0} photos</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p.id)}><Edit3 className="h-4 w-4" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-danger-500 hover:text-danger-600" onClick={() => handleDelete(p.id)}>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Project Title" placeholder="e.g. Modern Villa Renovation" error={errors.title?.message} {...register("title", { required: "Title is required" })} />
          <Textarea label="Description" placeholder="Describe the project scope and your role..." error={errors.description?.message} {...register("description", { required: "Description is required" })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" placeholder="e.g. Renovation, Interior Design" error={errors.category?.message} {...register("category", { required: "Category is required" })} />
            <Input label="Location" placeholder="Mumbai" {...register("location")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Completion Date" type="month" error={errors.completedAt?.message} {...register("completedAt", { required: "Date is required" })} />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={isPending}>Save Project</Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  );
}
