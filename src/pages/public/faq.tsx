import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { faqData } from "@/mock/data";
import { ChevronDown, Search } from "lucide-react";

export default function FAQPage() {
  const [category, setCategory] = useState(faqData[0]?.category || "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (id: string) => setOpen(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const cats = faqData.map(c => ({...c, qs: c.questions.filter(q => q.q.toLowerCase().includes(query.toLowerCase()))})).filter(c => c.qs.length > 0);
  const cur = cats.find(c => c.category === category) || cats[0];
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container-page py-24 sm:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="secondary" size="lg" className="mb-4">FAQ</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Frequently Asked Questions</h1>
            <p className="mt-6 text-lg text-slate-300">Everything you need to know about BuildConnect.</p>
          </motion.div>
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/10">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input type="text" placeholder="Search FAQs..." value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none text-sm" />
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-1">
            {cats.map(c => (
              <button key={c.category} onClick={() => setCategory(c.category)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${category === c.category ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"}`}>
                {c.category} <span className="ml-2 text-xs text-slate-400">({c.qs.length})</span>
              </button>
            ))}
          </div>
          <div className="lg:col-span-3 space-y-4">
            {cur?.qs.map((q, i) => {
              const id = category + "-" + i;
              const isOpen = open.includes(id);
              return (
                <div key={id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button onClick={() => toggle(id)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={isOpen}>
                    <span className="text-sm font-medium text-slate-900 pr-4">{q.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{q.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
