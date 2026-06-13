import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { PlusCircle, Images, Edit3, Trash2, MapPin, Calendar, Star } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";
import { usePortfolio } from "@/hooks/use-api";

export default function ContractorPortfolioPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { data, isError, refetch } = usePortfolio();
  const projects = data?.projects || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Portfolio" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Portfolio</h1>
          <p className="text-slate-500 mt-1">Showcase your best work to attract more clients.</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><PlusCircle className="h-4 w-4" /> Add Project</Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((p, i) => (
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
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.completedAt}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {p.rating}</span>
                  <span>{p.images} photos</span>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(p.id); setShowForm(true); }}><Edit3 className="h-4 w-4" /> Edit</Button>
                  <Button variant="ghost" size="sm" className="text-danger-500 hover:text-danger-600">
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Project" : "Add Portfolio Project"} size="lg">
        <div className="space-y-4">
          <Input label="Project Title" placeholder="e.g. Modern Villa Renovation" />
          <Textarea label="Description" placeholder="Describe the project scope and your role..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" placeholder="e.g. Renovation, Interior Design" />
            <Input label="Location" placeholder="Mumbai" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Completion Date" type="month" />
            <Input label="Upload Photos" type="file" multiple />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={() => setShowForm(false)}>Save Project</Button>
          </div>
        </div>
      </Dialog>
    </motion.div>
  );
}
