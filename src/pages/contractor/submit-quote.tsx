import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitQuote, useProject } from "@/hooks/use-api";
import { ROUTES } from "@/constants/routes";
import { IndianRupee, Calendar, Send, PlusCircle, X, Building2, MapPin } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";

const quoteSchema = z.object({
  price: z.string().min(1, "Please enter an estimated price"),
  timeline: z.string().min(2, "Please enter a timeline"),
  proposal: z.string().min(20, "Proposal must be at least 20 characters"),
});

type QuoteForm = z.infer<typeof quoteSchema>;

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function ContractorSubmitQuotePage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const submitQuote = useSubmitQuote();
  const { data: project, isError, refetch } = useProject(projectId || "");
  const [materials, setMaterials] = useState([{ name: "", cost: "" }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { price: "", timeline: "", proposal: "" },
  });

  const addMaterial = () => setMaterials([...materials, { name: "", cost: "" }]);
  const updateMaterial = (i: number, field: string, val: string) => {
    const m = [...materials]; m[i] = { ...m[i], [field]: val }; setMaterials(m);
  };
  const removeMaterial = (i: number) => setMaterials(materials.filter((_, idx) => idx !== i));

  const onSubmit = (data: QuoteForm) => {
    submitQuote.mutateAsync({
      projectId: project?.id || "",
      estimatedPrice: Number(data.price) || 0,
      timeline: data.timeline,
      proposal: data.proposal,
      materials: materials.filter(m => m.name && m.cost).map(m => ({ name: m.name, cost: Number(m.cost) || 0 })),
    }).then(() => {
      navigate(ROUTES.CONTRACTOR.MY_QUOTES);
    });
  };

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-3xl mx-auto space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div>
        <Breadcrumbs items={[{ label: "Available Projects", href: ROUTES.CONTRACTOR.AVAILABLE_PROJECTS }, { label: "Submit Quote" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Submit a Quote</h1>
        <p className="text-slate-500 mt-1">Send your proposal to the customer.</p>
      </div>

      {project && (
        <Card>
          <CardContent className="p-5 bg-slate-50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><Building2 className="h-5 w-5" /></div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{project.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {project.location}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Budget: ₹{project.budgetMin.toLocaleString()} - ₹{project.budgetMax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Your Proposal</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Estimated Price (₹)" type="number" placeholder="500000" icon={<IndianRupee className="h-4 w-4" />} error={errors.price?.message} {...register("price")} />
            <Input label="Timeline" placeholder="e.g. 6-8 weeks" icon={<Calendar className="h-4 w-4" />} error={errors.timeline?.message} {...register("timeline")} />
          </div>

          <Textarea label="Proposal" placeholder="Describe your approach, experience, and why you're the best fit for this project..." className="min-h-[150px]" error={errors.proposal?.message} {...register("proposal")} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Materials Breakdown (Optional)</label>
            <div className="space-y-2">
              {materials.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={m.name} onChange={e => updateMaterial(i, "name", e.target.value)} placeholder="Material name"
                    className="flex-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none" />
                  <input value={m.cost} onChange={e => updateMaterial(i, "cost", e.target.value)} type="number" placeholder="Cost"
                    className="w-32 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none" />
                  {materials.length > 1 && (
                    <button onClick={() => removeMaterial(i)} className="p-2 text-slate-400 hover:text-danger-500"><X className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={addMaterial} className="mt-2"><PlusCircle className="h-4 w-4" /> Add Material</Button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(ROUTES.CONTRACTOR.AVAILABLE_PROJECTS)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={submitQuote.isPending}><Send className="h-4 w-4" /> Submit Quote</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
