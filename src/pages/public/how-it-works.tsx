import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Users, CheckCircle2, HardHat, Search, ArrowRight, Star, MessageSquare } from "lucide-react";

const customerSteps = [
  { number: "01", icon: <Building2 className="h-8 w-8" />, title: "Post Your Project", description: "Tell us what you need. Include budget, timeline, and location.", details: ["Describe your project", "Set your budget", "Choose timeline", "Add photos"] },
  { number: "02", icon: <FileText className="h-8 w-8" />, title: "Receive Quotes", description: "Get competitive quotes from verified professionals.", details: ["3-5 quotes on average", "Compare pricing", "View profiles", "Read reviews"] },
  { number: "03", icon: <Users className="h-8 w-8" />, title: "Compare & Hire", description: "Review profiles and choose the best contractor.", details: ["Compare qualifications", "Check certifications", "View portfolios", "Message directly"] },
  { number: "04", icon: <CheckCircle2 className="h-8 w-8" />, title: "Track & Complete", description: "Monitor progress and release payments securely.", details: ["Track milestones", "Secure payments", "Progress updates", "Leave review"] },
];

const contractorSteps = [
  { number: "01", icon: <HardHat className="h-8 w-8" />, title: "Create Your Profile", description: "Showcase your skills and experience.", details: ["Add specialties", "Upload certifications", "Showcase portfolio", "Set rates"] },
  { number: "02", icon: <Search className="h-8 w-8" />, title: "Browse Projects", description: "Find projects that match your expertise.", details: ["Smart recommendations", "Filter by skills", "View requirements", "Set budget range"] },
  { number: "03", icon: <MessageSquare className="h-8 w-8" />, title: "Submit Quotes", description: "Send professional quotes with proposals.", details: ["Price breakdowns", "Timeline estimates", "Custom proposals", "Answer questions"] },
  { number: "04", icon: <Star className="h-8 w-8" />, title: "Win Projects & Grow", description: "Complete projects and build your reputation.", details: ["Get paid securely", "Earn ratings", "Build reputation", "More opportunities"] },
];

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState("customer");
  const steps = activeTab === "customer" ? customerSteps : contractorSteps;
  return (<div className="flex flex-col">
    <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container-page py-24 sm:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="secondary" size="lg" className="mb-4">How It Works</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Simple steps to get started</h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">Whether you're a homeowner or a contractor, we make it easy.</p>
        </motion.div>
        <div className="mt-12 inline-flex items-center p-1.5 bg-white/10 rounded-2xl backdrop-blur-sm">
          <button onClick={() => setActiveTab("customer")} className={
            "px-6 py-3 rounded-xl text-sm font-medium transition-all " +
            (activeTab === "customer" ? "bg-white text-slate-900 shadow-sm" : "text-slate-300 hover:text-white")
          }><Users className="h-4 w-4 inline mr-1" /> For Customers</button>
          <button onClick={() => setActiveTab("contractor")} className={
            "px-6 py-3 rounded-xl text-sm font-medium transition-all " +
            (activeTab === "contractor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-300 hover:text-white")
          }><HardHat className="h-4 w-4 inline mr-1" /> For Contractors</button>
        </div>
      </div>
    </section>
    <section className="container-page py-20 sm:py-28">
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} className="grid lg:grid-cols-2 gap-8 items-center">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="inline-flex items-center gap-3 text-sm font-medium text-brand-600 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-base font-bold">{step.number}</span>
                  Step {step.number}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">{step.icon}</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{step.title}</h2>
                <p className="text-lg text-slate-500 mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm text-slate-600"><CheckCircle2 className="h-5 w-5 text-success-500 shrink-0 mt-0.5" />{detail}</li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">{step.icon}</div>
                    <p className="text-lg font-semibold text-slate-700">{step.title}</p>
                    <p className="text-sm text-slate-500 mt-1">Step {step.number} of 4</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
    <section className="bg-brand-600">
      <div className="container-page py-16 sm:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">{activeTab === "customer" ? "Ready to start your project?" : "Ready to grow your business?"}</h2>
        <p className="mt-4 text-lg text-brand-100 max-w-xl mx-auto">{activeTab === "customer" ? "Post your first project free." : "Create your profile and start today."}</p>
        <div className="mt-8">
          {activeTab === "customer" ? (
            <Link to="/register/customer"><Button variant="secondary" size="xl">Post a Project <ArrowRight className="h-5 w-5" /></Button></Link>
          ) : (
            <Link to="/register/contractor"><Button variant="secondary" size="xl">Join as Contractor <ArrowRight className="h-5 w-5" /></Button></Link>
          )}
        </div>
      </div>
    </section>
  </div>);
}
