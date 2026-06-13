import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useProject, useContractor, useProjectQuotations, useContractors } from "@/hooks/use-api";
import { PROJECT_CATEGORIES } from "@/constants";
import { MapPin, IndianRupee, Building2, Calendar, Clock, ChevronLeft, CheckCircle2, FileText, HardHat, Star, Shield, Quote } from "lucide-react";

const f = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { data: project, isLoading, isError: isError1, refetch: refetch1 } = useProject(id || "");
  const { data: awardedData } = useContractor(project?.awardedTo || "");
  const { data: quotesData, isError: isError2, refetch: refetch2 } = useProjectQuotations(id || "");
  const { data: contractorsData, isError: isError3, refetch: refetch3 } = useContractors();
  const hasError = isError1 || isError2 || isError3;
  const handleRetry = () => { refetch1(); refetch2(); refetch3(); };
  const awardedContractor = project?.awardedTo ? awardedData : null;
  const quotes = quotesData?.quotations ?? [];
  const allContractors = contractorsData?.contractors ?? [];

  if (isLoading) {
    return (
      <motion.div initial="initial" animate="animate" className="space-y-8">
        <ErrorBanner isError={hasError} dismissable={false} />
        <Skeleton className="h-4 w-32 mb-4" />
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-b-3xl">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-7 w-24 rounded-full bg-slate-700" />
              <Skeleton className="h-7 w-28 rounded-full bg-slate-700" />
            </div>
            <Skeleton className="h-10 w-96 bg-slate-700" />
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-4 w-36 bg-slate-700" />)}
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-4 w-28 bg-slate-700" />)}
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-28" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
                <Skeleton className="h-6 w-28 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-3 w-36 mx-auto" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <HardHat className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project not found</h2>
          <p className="text-slate-500 mb-6">The project you are looking for does not exist.</p>
          <Link to="/projects"><Button variant="outline"><ChevronLeft className="h-4 w-4" /> Back to Projects</Button></Link>
        </div>
      </div>
    );
  }

  const categoryLabel = PROJECT_CATEGORIES.find((c) => c.value === project.category)?.label || project.category;

  return (
    <motion.div initial="initial" animate="animate" className="space-y-8">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ChevronLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-b-3xl">
        <div className="max-w-5xl mx-auto">
          <motion.div {...f}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge variant="outline" size="sm" className="border-white/20 text-slate-300">{categoryLabel}</Badge>
              <Badge variant={project.status === "open" ? "success" : project.status === "quoting" ? "warning" : "primary"} size="sm">
                {project.status === "open" ? "Open for Quotes" : project.status === "quoting" ? "Accepting Quotes" : project.status.replace("_", " ")}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-300">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {project.location}</span>
              <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4" /> Budget: Rs {project.budgetMin.toLocaleString()} - Rs {project.budgetMax.toLocaleString()}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            {project.propertyType && (
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {project.propertyType}</span>
                {project.propertySize && <span>{project.propertySize} sq.ft.</span>}
                <span><FileText className="h-4 w-4 inline" /> {project.quoteCount} quotes</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div {...f}>
            <Card>
              <CardHeader><CardTitle>Description</CardTitle></CardHeader>
              <CardContent><p className="text-slate-600 leading-relaxed">{project.description}</p></CardContent>
            </Card>
          </motion.div>

          {project.requirements.length > 0 && (
            <motion.div {...f}>
              <Card>
                <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-success-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {quotes.length > 0 && (
            <motion.div {...f}>
              <Card>
                <CardHeader><CardTitle>Submitted Quotes ({quotes.length})</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {quotes.map((q) => {
                    const contractor = allContractors.find((c) => c.id === q.contractorId);
                    return (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 hover:border-brand-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {contractor ? (
                              <Link to={"/contractors/" + contractor.id} className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-sm font-bold">
                                  {contractor.firstName[0]}{contractor.lastName[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-slate-900 group-hover:text-brand-600">{contractor.firstName} {contractor.lastName}</p>
                                  <p className="text-xs text-slate-500">{contractor.profession}</p>
                                </div>
                              </Link>
                            ) : <div className="w-10 h-10 rounded-xl bg-slate-200" />}
                          </div>
                          <Badge variant={q.status === "pending" ? "warning" : q.status === "accepted" ? "success" : "secondary"} size="sm">{q.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{q.proposal}</p>
                        <div className="text-sm font-semibold text-slate-900">Rs {q.estimatedPrice.toLocaleString()} <span className="font-normal text-slate-500"><Clock className="h-3 w-3 inline" /> {q.timeline}</span></div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div {...f}>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <HardHat className="h-12 w-12 text-brand-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Interested?</h3>
                  <p className="text-sm text-slate-500 mt-1">Sign up as a contractor to submit your quote</p>
                </div>
                <Link to="/register/contractor" className="block">
                  <Button variant="primary" size="lg" className="w-full rounded-xl"><Quote className="h-4 w-4" /> Submit Quote</Button>
                </Link>
                <p className="text-xs text-center text-slate-400">Already a contractor? <Link to="/login" className="text-brand-600 hover:underline">Log in</Link></p>
              </CardContent>
            </Card>
          </motion.div>

          {awardedContractor && (
            <motion.div {...f}>
              <Card>
                <CardHeader><CardTitle>Awarded To</CardTitle></CardHeader>
                <CardContent>
                  <Link to={"/contractors/" + awardedContractor.id} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold shrink-0">{awardedContractor.firstName[0]}{awardedContractor.lastName[0]}</div>
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-brand-600">{awardedContractor.firstName} {awardedContractor.lastName}</p>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> {awardedContractor.rating}
                        {awardedContractor.verified && <><Shield className="h-3 w-3 text-success-500" /> Verified</>}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div {...f}>
            <Card>
              <CardHeader><CardTitle>Project Info</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <Badge variant={project.status === "open" ? "success" : project.status === "quoting" ? "warning" : "primary"} size="sm">{project.status.replace("_", " ")}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="text-slate-900 font-medium">{categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Type</span>
                  <span className="text-slate-900">{project.propertyType || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Size</span>
                  <span className="text-slate-900">{project.propertySize ? project.propertySize + " sq.ft." : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Budget</span>
                  <span className="text-slate-900 font-medium">Rs {project.budgetMin.toLocaleString()} - Rs {project.budgetMax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Posted</span>
                  <span className="text-slate-900">{new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quotes</span>
                  <span className="text-slate-900">{project.quoteCount}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}