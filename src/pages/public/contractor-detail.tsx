import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { useContractor, useContractorReviews, useProjects } from "@/hooks/use-api";
import { ErrorBanner } from "@/components/shared/error-banner";
import { Star, MapPin, Shield, Briefcase, Clock, Award, CheckCircle2, ChevronLeft, Mail, Building2, HardHat, Quote, Send, Phone, IndianRupee } from "lucide-react";
import { NoReviewsEmpty } from "@/components/shared/empty-states";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

const f = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const timelineOptions = [
  { value: "asap", label: "ASAP" },
  { value: "1-2 weeks", label: "1-2 weeks" },
  { value: "2-4 weeks", label: "2-4 weeks" },
  { value: "1-3 months", label: "1-3 months" },
  { value: "3+ months", label: "3+ months" },
  { value: "flexible", label: "Flexible" },
];

const quoteRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budget: z.string().min(1, "Please enter an estimated budget"),
  timeline: z.string().min(1, "Please select a timeline"),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"),
  message: z.string().optional(),
});

type QuoteRequestForm = z.infer<typeof quoteRequestSchema>;

const messageSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type MessageForm = z.infer<typeof messageSchema>;

export default function ContractorDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [msgSubmitting, setMsgSubmitting] = useState(false);

  const quoteForm = useForm<QuoteRequestForm>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: { title: "", description: "", budget: "", timeline: "", phone: "", message: "" },
  });

  const msgForm = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: { subject: "", message: "" },
  });
  const [loading, setLoading] = useState(true);
  const { data: contractorData, isError: isError1, refetch: refetch1 } = useContractor(id || "");
  const { data: reviewsData, isError: isError2, refetch: refetch2 } = useContractorReviews(id || "");
  const { data: projectsData, isError: isError3, refetch: refetch3 } = useProjects();
  const hasError = isError1 || isError2 || isError3;
  const handleRetry = () => { refetch1(); refetch2(); refetch3(); };
  const contractor = contractorData;
  const reviews = reviewsData?.reviews ?? [];
  const allProjects = projectsData?.projects ?? [];

  const closeQuoteDialog = () => { setQuoteOpen(false); quoteForm.reset(); };
  const closeMsgDialog = () => { setMsgOpen(false); msgForm.reset(); };
  const projects = allProjects.filter((p) => p.awardedTo === id);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <motion.div initial="initial" animate="animate" className="space-y-8">
        <ErrorBanner isError={hasError} dismissable={false} />
        <Skeleton className="h-4 w-32 mb-4" />
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-b-3xl">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start gap-8">
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-slate-700 shrink-0" />
              <div className="flex-1 min-w-0 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64 bg-slate-700" />
                  <Skeleton className="h-5 w-40 bg-slate-700" />
                </div>
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-4 w-24 bg-slate-700" />)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-24 rounded-full bg-slate-700" />)}
                </div>
                <Skeleton className="h-5 w-32 bg-slate-700" />
              </div>
              <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
                <Skeleton className="h-11 w-40 rounded-xl bg-slate-700" />
                <Skeleton className="h-11 w-40 rounded-xl bg-slate-700" />
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex gap-2 mb-8">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-28 rounded-lg" />)}
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  if (!contractor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <HardHat className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Contractor not found</h2>
          <p className="text-slate-500 mb-6">The contractor you are looking for does not exist.</p>
          <Link to="/contractors"><Button variant="outline"><ChevronLeft className="h-4 w-4" /> Back to Contractors</Button></Link>
        </div>
      </div>
    );
  }

  const initials = contractor.firstName[0] + contractor.lastName[0];
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : contractor.rating.toFixed(1);

  return (
    <motion.div initial="initial" animate="animate" className="space-y-8">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      <Link to="/contractors" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ChevronLeft className="h-4 w-4" /> Back to Contractors
      </Link>

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-b-3xl">
        <div className="max-w-5xl mx-auto">
          <motion.div className="flex flex-col sm:flex-row items-start gap-8" {...f}>
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shrink-0 shadow-xl">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{contractor.firstName} {contractor.lastName}</h1>
                {contractor.verified && <Badge variant="success" size="sm"><Shield className="h-3 w-3" /> Verified</Badge>}
              </div>
              <p className="text-xl text-brand-200 mb-4">{contractor.profession}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /><span className="text-white font-semibold">{avgRating}</span> ({reviews.length})</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {contractor.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {contractor.experience}y</span>
                <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {contractor.completedProjects}</span>
                <Badge variant={contractor.availability === "available" ? "success" : contractor.availability === "busy" ? "warning" : "secondary"} size="sm">{contractor.availability}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {contractor.specialties.map((s) => <Badge key={s} variant="outline" size="sm" className="border-white/20 text-slate-300">{s}</Badge>)}
              </div>
              {contractor.hourlyRate && <p className="mt-4 text-lg font-semibold text-white">Rs {contractor.hourlyRate.toLocaleString()}<span className="text-sm font-normal text-slate-400">/hour</span></p>}
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Button variant="secondary" size="lg" className="rounded-xl" onClick={() => setQuoteOpen(true)}><Quote className="h-4 w-4" /> Request Quote</Button>
              <Button variant="outline" size="lg" className="rounded-xl border-white/20 text-white hover:bg-white/10" onClick={() => setMsgOpen(true)}><Mail className="h-4 w-4" /> Message</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full">
        <Tabs
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "portfolio", label: "Portfolio", count: contractor.portfolio.length },
            { id: "reviews", label: "Reviews", count: reviews.length },
            { id: "projects", label: "Projects", count: projects.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          className="w-full"
        >
          {activeTab === "overview" && (
            <div className="mt-8 space-y-8">
            <motion.div {...f}>
              <Card><CardHeader><CardTitle>About</CardTitle></CardHeader><CardContent><p className="text-slate-600 leading-relaxed">{contractor.bio}</p></CardContent></Card>
            </motion.div>
            {contractor.certifications.length > 0 && (
              <motion.div {...f}>
                <Card>
                  <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {contractor.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 shrink-0"><Award className="h-5 w-5" /></div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{cert.name}</p>
                          <p className="text-sm text-slate-500">{cert.issuer} &bull; {cert.issueDate}</p>
                        </div>
                        {cert.verified && <Badge variant="success" size="sm" className="shrink-0"><CheckCircle2 className="h-3 w-3" /> Verified</Badge>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            <motion.div {...f}>
              <Card>
                <CardHeader><CardTitle>Service Area</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span>Serving <strong>{contractor.location}</strong> (up to {contractor.serviceRadius} km)</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            </div>
          )}
          {activeTab === "portfolio" && (
            <div className="mt-8">
            {contractor.portfolio.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl">
                <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Portfolio coming soon</h3>
                <p className="text-sm text-slate-500">This contractor has not added portfolio items yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {contractor.portfolio.map((item) => (
                  <Card key={item.id} hover>
                    <CardContent className="p-4">
                      <div className="aspect-video rounded-xl bg-slate-100 mb-4 flex items-center justify-center"><Building2 className="h-12 w-12 text-slate-300" /></div>
                      <h4 className="font-medium text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{reviews.length} Reviews</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={"h-4 w-4 " + (i < Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />)}</div>
                  <span className="text-sm font-medium text-slate-700">{avgRating} out of 5</span>
                </div>
              </div>
            </div>
            {reviews.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl">
                <NoReviewsEmpty />
              </div>
            ) : (
              reviews.map((review, i) => (
                <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">{allProjects.find((p) => p.id === review.projectId)?.title[0] || "?"}</div>
                          <div>
                            <p className="font-medium text-sm text-slate-900">{review.title}</p>
                            <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                          </div>
                        </div>
                        <div className="flex">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-slate-400 mt-2">Project: {allProjects.find((p) => p.id === review.projectId)?.title || "Unknown"}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
            </div>
          )}
          {activeTab === "projects" && (
            <div className="mt-8 space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No completed projects listed.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <Card key={p.id} hover>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" size="sm">{p.category.replace("_", " ")}</Badge>
                        <Badge variant={p.status === "completed" ? "success" : "primary"} size="sm">{p.status.replace("_", " ")}</Badge>
                      </div>
                      <h4 className="font-medium text-slate-900 mb-1">{p.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span><MapPin className="h-3 w-3 inline" /> {p.location}</span>
                        <span>Rs {p.budgetMin.toLocaleString()} - Rs {p.budgetMax.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            </div>
          )}
        </Tabs>
      </div>
      {/* Request Quote Dialog */}
      <Dialog isOpen={quoteOpen} onClose={closeQuoteDialog} title="Request a Quote" description={`Tell ${contractor.firstName} about your project.`} size="lg">
        <form onSubmit={quoteForm.handleSubmit((data) => { setQuoteSubmitting(true); setTimeout(() => { setQuoteSubmitting(false); closeQuoteDialog(); toast({ title: "Quote requested!", message: `${contractor.firstName} will review and respond shortly.`, variant: "success" }); }, 1200); })} className="space-y-4">
          <Input label="Project Title" placeholder="e.g. Kitchen Renovation" error={quoteForm.formState.errors.title?.message} {...quoteForm.register("title")} />
          <Textarea label="Project Description" placeholder="Describe what you need done..." error={quoteForm.formState.errors.description?.message} {...quoteForm.register("description")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Estimated Budget (Rs)" type="number" placeholder="50000" icon={<IndianRupee className="h-4 w-4" />} error={quoteForm.formState.errors.budget?.message} {...quoteForm.register("budget")} />
            <Select label="Timeline" options={timelineOptions} placeholder="Select timeline" error={quoteForm.formState.errors.timeline?.message} {...quoteForm.register("timeline")} />
          </div>
          <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" icon={<Phone className="h-4 w-4" />} error={quoteForm.formState.errors.phone?.message} {...quoteForm.register("phone")} />
          <Textarea label="Additional Message (optional)" placeholder="Any specific requirements or questions..." {...quoteForm.register("message")} />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={closeQuoteDialog} disabled={quoteSubmitting}>Cancel</Button>
            <Button type="submit" loading={quoteSubmitting}><Send className="h-4 w-4" /> Send Request</Button>
          </div>
        </form>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog isOpen={msgOpen} onClose={closeMsgDialog} title="Send Message" description={`Send a direct message to ${contractor.firstName}.`} size="md">
        <form onSubmit={msgForm.handleSubmit((data) => { setMsgSubmitting(true); setTimeout(() => { setMsgSubmitting(false); closeMsgDialog(); toast({ title: "Message sent!", message: `${contractor.firstName} will receive your message shortly.`, variant: "success" }); }, 1000); })} className="space-y-4">
          <Input label="Subject" placeholder="What is this about?" error={msgForm.formState.errors.subject?.message} {...msgForm.register("subject")} />
          <Textarea label="Message" placeholder="Write your message here..." className="min-h-[120px]" error={msgForm.formState.errors.message?.message} {...msgForm.register("message")} />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={closeMsgDialog} disabled={msgSubmitting}>Cancel</Button>
            <Button type="submit" loading={msgSubmitting}><Send className="h-4 w-4" /> Send Message</Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  );
}