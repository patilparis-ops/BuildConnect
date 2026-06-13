import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useContractors } from "@/hooks/use-api";
import { PROFESSIONS } from "@/constants";
import { Search, MapPin, Star, Briefcase, HardHat, ChevronRight, Shield, SlidersHorizontal } from "lucide-react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function ContractorsPage() {
  const [search, setSearch] = useState("");
  const [profession, setProfession] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: contractorsData, isError, refetch } = useContractors();
  const allContractors = contractorsData?.contractors ?? [];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-8">
        <ErrorBanner isError={isError} onRetry={refetch} />
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center"><Skeleton className="h-6 w-48 rounded-full bg-slate-700" /></div>
            <Skeleton className="h-10 sm:h-12 w-96 mx-auto bg-slate-700" />
            <Skeleton className="h-5 w-64 mx-auto bg-slate-700" />
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
              <div className="flex-1"><Skeleton className="h-11 w-full rounded-xl bg-slate-700" /></div>
              <Skeleton className="h-11 w-11 rounded-xl bg-slate-700" />
            </div>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-7 w-20 rounded-full bg-slate-700" />)}
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-4 w-40 bg-slate-200" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-6 w-16 rounded-full" />)}
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  const filtered = allContractors.filter((c) => {
    const s = !search || c.firstName.toLowerCase().includes(search.toLowerCase()) || c.lastName.toLowerCase().includes(search.toLowerCase()) || c.profession.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const p = profession === "all" || c.profession === profession;
    const r = c.rating >= minRating;
    return s && p && r;
  });

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-8">
      <ErrorBanner isError={isError} onRetry={refetch} />
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 mb-4">
            <Shield className="h-4 w-4 text-green-400" />
            {allContractors.length} verified professionals
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Find the Right Professional</h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">Browse India network of verified contractors.</p>
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input type="text" placeholder="Search by name, profession, or location..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none text-sm" />
              </div>
              <Button variant="secondary" size="icon" className="rounded-xl" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400">
            <span>Popular:</span>
            {["Builder", "Electrician", "Plumber", "Interior Designer", "Architect"].map((p) => (
              <button key={p} onClick={() => { setProfession(p); setShowFilters(true); }}
                className="px-3 py-1 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white text-xs">{p}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-6">
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Profession:</span>
              <select value={profession} onChange={(e) => setProfession(e.target.value)}
                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none">
                <option value="all">All Professions</option>
                {PROFESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Min Rating:</span>
              <div className="flex gap-1">
                {[0, 3, 3.5, 4, 4.5].map((r) => (
                  <button key={r} onClick={() => setMinRating(r)}
                    className={"px-3 py-1.5 text-xs font-medium rounded-lg " + (minRating === r ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                    {r === 0 ? "Any" : r + "★"}
                  </button>
                ))}
              </div>
            </div>
            {(profession !== "all" || minRating > 0) && (
              <Button variant="ghost" size="sm" onClick={() => { setProfession("all"); setMinRating(0); }}>Clear</Button>
            )}
          </motion.div>
        )}

        <p className="text-sm text-slate-500">Showing <span className="font-medium">{filtered.length}</span> professionals</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <HardHat className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No contractors found</h3>
            <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filter</p>
            <Button variant="outline" onClick={() => { setSearch(""); setProfession("all"); setMinRating(0); }}>Reset Filters</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={"/contractors/" + c.id}>
                  <Card hover className="h-full overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xl font-bold">
                            {c.firstName[0]}{c.lastName[0]}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-600">{c.firstName} {c.lastName}</h3>
                            <p className="text-sm text-slate-500">{c.profession}</p>
                          </div>
                        </div>
                        {c.verified && <Shield className="h-5 w-5 text-success-500 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 mb-3 text-sm">
                        <span className="flex items-center gap-1 text-yellow-500 font-medium">
                          <Star className="h-4 w-4 fill-yellow-400" /> {c.rating} ({c.reviewCount})
                        </span>
                        <span className="flex items-center gap-1 text-slate-500"><MapPin className="h-4 w-4" /> {c.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span>{c.experience} years exp.</span>
                        <span>{c.completedProjects} projects</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {c.specialties.slice(0, 3).map((s, si) => <Badge key={si} variant="outline" size="sm">{s}</Badge>)}
                        {c.specialties.length > 3 && <Badge variant="outline" size="sm">+{c.specialties.length - 3}</Badge>}
                      </div>
                      {c.hourlyRate && (
                        <p className="text-sm font-semibold text-slate-900 mb-3">Rs {c.hourlyRate.toLocaleString()}<span className="text-xs font-normal text-slate-500">/hr</span></p>
                      )}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">View Profile <ChevronRight className="h-3.5 w-3.5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
