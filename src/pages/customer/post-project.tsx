import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { PROJECT_CATEGORIES, PROPERTY_TYPES } from "@/constants";
import { useCreateProject } from "@/hooks/use-api";
import { PlusCircle, X, ArrowLeft, Save, Send, Upload } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  budgetMin: z.string().min(1, "Please enter a minimum budget"),
  budgetMax: z.string().min(1, "Please enter a maximum budget"),
  location: z.string().min(3, "Please enter a location"),
  propertyType: z.string().optional(),
  propertySize: z.string().optional(),
  startDate: z.string().optional(),
}).refine((data) => {
  if (data.budgetMin && data.budgetMax) {
    return Number(data.budgetMax) >= Number(data.budgetMin);
  }
  return true;
}, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["budgetMax"],
});

type ProjectForm = z.infer<typeof projectSchema>;

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function CustomerPostProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const createProject = useCreateProject();
  const [reqs, setReqs] = useState(["", "", ""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "", description: "", category: "",
      budgetMin: "", budgetMax: "", location: "",
      propertyType: "", propertySize: "", startDate: "",
    },
  });

  const [reqError, setReqError] = useState("");

  const addReq = () => setReqs([...reqs, ""]);
  const updReq = (i: number, v: string) => { const r = [...reqs]; r[i] = v; setReqs(r); if (v.trim()) setReqError(""); };
  const remReq = (i: number) => setReqs(reqs.filter((_, idx) => idx !== i));

  const goToStep = async (nextStep: number) => {
    setReqError("");
    if (step === 1 && nextStep > 1) {
      const valid = await trigger(["title", "description", "category", "budgetMin", "budgetMax", "location"]);
      if (!valid) return;
    }
    if (step === 2 && nextStep > 2) {
      const filledReqs = reqs.filter(r => r.trim());
      if (filledReqs.length === 0) {
        setReqError("Please add at least one requirement before continuing.");
        return;
      }
    }
    setStep(nextStep);
  };

  const onFinalSubmit = () => {
    const form = getValues();
    createProject.mutateAsync({
      title: form.title,
      description: form.description,
      category: form.category,
      budgetMin: Number(form.budgetMin) || 0,
      budgetMax: Number(form.budgetMax) || 0,
      location: form.location,
      propertyType: form.propertyType || undefined,
      propertySize: form.propertySize ? Number(form.propertySize) : undefined,
      startDate: form.startDate || undefined,
      requirements: reqs.filter(r => r.trim()),
    }).then(() => {
      navigate(ROUTES.CUSTOMER.PROJECTS);
    });
  };

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Projects", href: ROUTES.CUSTOMER.PROJECTS }, { label: "Post Project" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Post a New Project</h1>
          <p className="text-slate-500 mt-1">Describe your project and receive quotes from top contractors.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium " + (step >= s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400")}>
              {step > s ? "✓" : s}
            </div>
            <span className={"text-xs font-medium " + (step >= s ? "text-slate-900" : "text-slate-400")}>
              {s === 1 ? "Details" : s === 2 ? "Requirements" : "Review"}
            </span>
            {s < 3 && <div className={"flex-1 h-0.5 " + (step > s ? "bg-brand-600" : "bg-slate-200")} />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-900">Project Details</h2>
              <Input label="Project Title" placeholder="e.g. Complete Home Renovation - 3 BHK Apartment" error={errors.title?.message} {...register("title")} />
              <Textarea label="Description" placeholder="Describe your project in detail..." className="min-h-[120px]" error={errors.description?.message} {...register("description")} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" placeholder="Select category"
                  options={PROJECT_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                  error={errors.category?.message} {...register("category")} />
                <Select label="Property Type" placeholder="Select type"
                  options={PROPERTY_TYPES.map(t => ({ value: t, label: t }))}
                  {...register("propertyType")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Budget Min (Rs.)" type="number" placeholder="500000" error={errors.budgetMin?.message} {...register("budgetMin")} />
                <Input label="Budget Max (Rs.)" type="number" placeholder="800000" error={errors.budgetMax?.message} {...register("budgetMax")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Location" placeholder="Andheri West, Mumbai" error={errors.location?.message} {...register("location")} />
                <Input label="Property Size (sq ft)" type="number" placeholder="1200" {...register("propertySize")} />
              </div>
              <Input label="Expected Start Date" type="date" {...register("startDate")} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-900">Requirements & Attachments</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Requirements</label>
                <div className="space-y-2">
                  {reqs.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={r} onChange={e => updReq(i, e.target.value)}
                        placeholder={"Requirement " + (i + 1)}
                        className={"flex-1 h-10 rounded-lg border bg-white px-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none " + (reqError ? "border-danger-400" : "border-slate-300")} />
                      {reqs.length > 1 && (
                        <button onClick={() => remReq(i)} className="p-2 text-slate-400 hover:text-danger-500"><X className="h-4 w-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
                {reqError && (
                  <p className="flex items-center gap-1 text-xs text-danger-500 mt-1" role="alert">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {reqError}
                  </p>
                )}
                <Button variant="ghost" size="sm" onClick={addReq} className="mt-2"><PlusCircle className="h-4 w-4" /> Add Requirement</Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Attachments (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, Images (Max 10MB)</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-900">Review & Submit</h2>
              <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">Title:</span><p className="font-medium text-slate-900 mt-0.5">{getValues().title || "Not specified"}</p></div>
                  <div><span className="text-slate-500">Category:</span><p className="font-medium text-slate-900 mt-0.5 capitalize">{getValues().category || "Not specified"}</p></div>
                  <div><span className="text-slate-500">Budget:</span><p className="font-medium text-slate-900 mt-0.5">Rs.{getValues().budgetMin || "0"} - Rs.{getValues().budgetMax || "0"}</p></div>
                  <div><span className="text-slate-500">Location:</span><p className="font-medium text-slate-900 mt-0.5">{getValues().location || "Not specified"}</p></div>
                  <div><span className="text-slate-500">Property Type:</span><p className="font-medium text-slate-900 mt-0.5 capitalize">{getValues().propertyType || "Not specified"}</p></div>
                  <div><span className="text-slate-500">Start Date:</span><p className="font-medium text-slate-900 mt-0.5">{getValues().startDate || "Not specified"}</p></div>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-slate-500 text-sm">Description:</span>
                  <p className="text-sm text-slate-900 mt-1">{getValues().description || "No description provided"}</p>
                </div>
                {reqs.filter(r => r).length > 0 && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-slate-500 text-sm">Requirements:</span>
                    <ul className="mt-2 space-y-1">
                      {reqs.filter(r => r).map((r, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" />{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
            ) : <div />}
            {step < 3 ? (
              <Button onClick={() => goToStep(step + 1)}>Continue <Send className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={handleSubmit(onFinalSubmit)} loading={createProject.isPending}><Save className="h-4 w-4" /> Post Project</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
