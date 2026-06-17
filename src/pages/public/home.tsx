import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { APP_CONFIG, PROJECT_CATEGORIES } from "@/constants";
import { testimonials, faqData } from "@/mock/data";
import { IsometricConstruction } from "@/components/shared/isometric-construction";
import {
  Building2,
  Search,
  MapPin,
  ChevronRight,
  Star,
  Shield,
  CheckCircle2,
  Clock,
  Users,
  HardHat,
  ArrowRight,
  Quote,
  Sparkles,
  TrendingUp,
  Award,
  PlusCircle,
  FileText,
  GitCompare,
  UserPlus,
  Compass,
  Send,
} from "lucide-react";

// ==================== Animation Variants ====================
const fadeInUpVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const staggerContainerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const staggerItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const fadeInUpProps = {
  variants: fadeInUpVariants,
  initial: "initial",
  whileInView: "animate",
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const fadeInProps = {
  variants: fadeInVariants,
  initial: "initial",
  whileInView: "animate",
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};

const staggerContainerProps = {
  variants: staggerContainerVariants,
  initial: "initial",
  whileInView: "animate",
  viewport: { once: true },
  transition: { staggerChildren: 0.08, delayChildren: 0.1 },
};

const staggerItemProps = {
  variants: staggerItemVariants,
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// ==================== Data ====================
const homeownerSteps = [
  {
    icon: <PlusCircle className="h-6 w-6" />,
    title: "Post Your Project",
    description: "Describe your project type, budget, timeline, and exact requirements in minutes.",
    accent: "text-brand-600",
    bg: "bg-brand-50 border-brand-200/50",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Receive Quotes",
    description: "Get structured, transparent bids from qualified professionals matching your needs.",
    accent: "text-brand-600",
    bg: "bg-brand-50 border-brand-200/50",
  },
  {
    icon: <GitCompare className="h-6 w-6" />,
    title: "Compare & Choose",
    description: "Analyze portfolios, verified ratings, past work, and credentials side-by-side.",
    accent: "text-brand-600",
    bg: "bg-brand-50 border-brand-200/50",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Hire & Build",
    description: "Fund milestone payments in secure escrow and kick off your build with confidence.",
    accent: "text-brand-600",
    bg: "bg-brand-50 border-brand-200/50",
  },
];

const contractorSteps = [
  {
    icon: <UserPlus className="h-6 w-6" />,
    title: "Create Profile",
    description: "Upload licenses, showcase your portfolio, and define your service areas in minutes.",
    accent: "text-secondary-600",
    bg: "bg-secondary-50 border-secondary-200/50",
  },
  {
    icon: <Compass className="h-6 w-6" />,
    title: "Discover Projects",
    description: "Browse qualified homeowners posting verified projects in your local area.",
    accent: "text-secondary-600",
    bg: "bg-secondary-50 border-secondary-200/50",
  },
  {
    icon: <Send className="h-6 w-6" />,
    title: "Submit Proposals",
    description: "Send professional, line-item estimates and bid for projects directly through the platform.",
    accent: "text-secondary-600",
    bg: "bg-secondary-50 border-secondary-200/50",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Grow Your Business",
    description: "Win contracts, release escrow payments on milestones, and build your reputation.",
    accent: "text-secondary-600",
    bg: "bg-secondary-50 border-secondary-200/50",
  },
];

const featuredContractors = [
  { name: "Amit Verma", profession: "Builder", rating: 4.8, projects: 342, location: "Mumbai", badge: "Top Rated" },
  { name: "Priya Sharma", profession: "Interior Designer", rating: 4.9, projects: 215, location: "Delhi", badge: "Premium" },
  { name: "Rajesh Kumar", profession: "Electrician", rating: 4.7, projects: 1500, location: "Pune", badge: "Most Booked" },
  { name: "Sneha Patel", profession: "Architect", rating: 4.9, projects: 98, location: "Ahmedabad", badge: "Expert" },
];

const trustFeatures = [
  { icon: <Shield className="h-6 w-6" />, title: "Verified Professionals", description: "Every contractor undergoes thorough background and credential verification before joining." },
  { icon: <Award className="h-6 w-6" />, title: "Quality Guaranteed", description: "If you're not satisfied, our mediation team ensures fair resolution every time." },
  { icon: <TrendingUp className="h-6 w-6" />, title: "Transparent Pricing", description: "Compare multiple quotes side-by-side. No hidden fees, no surprises — ever." },
  { icon: <Clock className="h-6 w-6" />, title: "Timely Delivery", description: "Track project milestones with real-time updates from your chosen contractor." },
  { icon: <CheckCircle2 className="h-6 w-6" />, title: "Secure Payments", description: "Funds held in escrow and released only upon milestone completion and approval." },
  { icon: <Sparkles className="h-6 w-6" />, title: "End-to-End Support", description: "Dedicated support team available 6 days a week to help at every step." },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"homeowners" | "contractors">("homeowners");

  return (
    <div className="flex flex-col">
      {/* ==================== Hero Section ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-b border-slate-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-secondary-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-page relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" as const }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold text-slate-300 tracking-wide">India's Premium Construction Marketplace</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                Your Vision,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-secondary-300">
                  Built by the Best
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                {APP_CONFIG.NAME} connects homeowners with rigorously verified contractors. 
                Post your project, compare quotes, and build with confidence — powered by 
                secure escrow payments and real reviews.
              </p>

              <div className="flex flex-wrap gap-4 items-center pt-2">
                <Link to={ROUTES.REGISTER_CUSTOMER}>
                  <Button variant="secondary" size="lg" className="rounded-lg font-bold shadow-lg shadow-secondary-500/25 px-8 hover:shadow-xl hover:shadow-secondary-500/30 hover:-translate-y-0.5 transition-all duration-300 text-white">
                    <PlusCircle className="h-5 w-5" />
                    Post a Project
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER_CONTRACTOR}>
                  <Button variant="outline" size="lg" className="rounded-lg font-semibold border-slate-600/50 text-slate-200 bg-white/5 hover:bg-white/10 hover:text-white hover:-translate-y-0.5 hover:border-slate-500/80 transition-all duration-300 px-8">
                    <HardHat className="h-5 w-5" />
                    Join as Contractor
                  </Button>
                </Link>
              </div>

              <div className="max-w-xl pt-2">
                <div className="flex flex-col sm:flex-row gap-2 bg-slate-950/70 p-2 border border-slate-800/50 rounded-2xl shadow-xl backdrop-blur-sm">
                  <div className="flex-1 flex items-center gap-2.5 bg-slate-900/50 rounded-xl px-4 py-2.5 border border-slate-800/30 focus-within:border-brand-700/50 transition-colors duration-200">
                    <Search className="h-4 w-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search projects, contractors, or services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-sm"
                      aria-label="Search for projects or contractors"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/50 rounded-xl px-4 py-2.5 border border-slate-800/30 focus-within:border-brand-700/50 transition-colors duration-200 sm:w-36">
                    <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-sm"
                      aria-label="Enter your city"
                    />
                  </div>
                  <Button variant="primary" size="md" className="rounded-xl font-semibold px-5 bg-brand-600 hover:bg-brand-700 text-white text-sm shrink-0">
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
                {[
                  { icon: <Shield className="h-4 w-4" />, label: "100% Verified Pros" },
                  { icon: <Clock className="h-4 w-4" />, label: "Milestone Escrow" },
                  { icon: <Star className="h-4 w-4" />, label: "Verified Reviews" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-brand-400">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Isometric Component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
              className="lg:col-span-5 hidden lg:block"
            >
              <IsometricConstruction />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== Categories Section ==================== */}
      <section className="section-spacing">
        <div className="container-page">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUpProps}>
            <Badge variant="primary" size="md" className="mb-5">Browse Categories</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Find the right professional
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Choose from 10+ categories of skilled professionals ready to serve you
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" {...staggerContainerProps}>
            {PROJECT_CATEGORIES.map((cat) => (
              <motion.div key={cat.value} {...staggerItemProps}>
                <Link
                  to="/how-it-works"
                  className={`flex flex-col items-center gap-3.5 p-5 sm:p-6 rounded-xl border transition-all duration-300 group ${
                    selectedCategory === cat.value
                      ? "border-brand-500/70 bg-brand-50/60 shadow-sm ring-1 ring-brand-500/30"
                      : "border-slate-200/70 bg-white hover:border-brand-400/50 hover:shadow-sm hover:-translate-y-0.5"
                  }`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    selectedCategory === cat.value
                      ? "bg-brand-100 text-brand-600"
                      : "bg-slate-50 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600"
                  }`}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-900">{cat.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== How It Works Section ==================== */}
      <section className="bg-slate-50/80 border-y border-slate-200/60 section-spacing">
        <div className="container-page">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUpProps}>
            <Badge variant="secondary" size="md" className="mb-5">Simple Process</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              How BuildConnect Works
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Everything you need to run your project from start to finish
            </p>
          </motion.div>

          <div className="flex justify-center mb-14">
            <div className="inline-flex p-1 bg-slate-200/60 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setActiveTab("homeowners")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "homeowners"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                aria-pressed={activeTab === "homeowners"}
              >
                For Homeowners
              </button>
              <button
                onClick={() => setActiveTab("contractors")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "contractors"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                aria-pressed={activeTab === "contractors"}
              >
                For Contractors
              </button>
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {(activeTab === "homeowners" ? homeownerSteps : contractorSteps).map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col p-7 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span className="absolute top-5 right-5 text-[11px] font-bold text-slate-300 group-hover:text-slate-400 transition-colors select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border ${step.accent} ${step.bg} shadow-xs`}>
                  {step.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2.5 leading-snug">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-grow">{step.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div className="mt-14 text-center" {...fadeInUpProps}>
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/50 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-brand-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-900">Looking for projects?</p>
                  <Link to={ROUTES.REGISTER_CONTRACTOR} className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline">
                    Join as contractor &rarr;
                  </Link>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-slate-200/70" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-50 border border-secondary-200/50 flex items-center justify-center shrink-0">
                  <HardHat className="h-5 w-5 text-secondary-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-900">Need a vetted team?</p>
                  <Link to={ROUTES.REGISTER_CUSTOMER} className="text-xs font-bold text-secondary-600 hover:text-secondary-700 hover:underline">
                    Post a project free &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== Stats Section ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 dot-pattern-light" />
        
        <div className="container-page relative section-spacing">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10" {...staggerContainerProps}>
            {[
              { icon: <Users className="h-7 w-7" />, value: "2,500+", label: "Verified Contractors" },
              { icon: <Building2 className="h-7 w-7" />, value: "5,000+", label: "Projects Posted" },
              { icon: <CheckCircle2 className="h-7 w-7" />, value: "3,400+", label: "Projects Completed" },
              { icon: <Star className="h-7 w-7" />, value: "4.7★", label: "Average Rating" },
            ].map((stat) => (
              <motion.div key={stat.label} {...staggerItemProps} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white mb-5 hover:bg-white/15 transition-colors duration-200">
                  {stat.icon}
                </div>
                <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-sm text-brand-200 mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== Featured Contractors ==================== */}
      <section className="section-spacing">
        <div className="container-page">
          <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14" {...fadeInUpProps}>
            <div>
              <Badge variant="primary" size="md" className="mb-5">Top Professionals</Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">Featured Contractors</h2>
              <p className="mt-3 text-lg text-slate-500 leading-relaxed">Highly rated professionals ready to serve you</p>
            </div>
            <Link to={ROUTES.CONTRACTORS}>
              <Button variant="outline" className="shrink-0 font-semibold">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" {...staggerContainerProps}>
            {featuredContractors.map((contractor) => (
              <motion.div key={contractor.name} {...staggerItemProps}>
                <Card className="overflow-hidden border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300 group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-base font-bold shadow-sm">
                        {contractor.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <Badge variant="success" size="sm" className="bg-success-50 text-success-700 border-success-200/50 font-semibold">
                        {contractor.badge}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{contractor.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{contractor.profession}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {contractor.rating}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-medium text-slate-500">{contractor.projects} projects</span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 font-medium text-slate-500">
                        <MapPin className="h-3 w-3" /> {contractor.location}
                      </span>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gradient-to-br from-slate-300 to-slate-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">+{12 + Math.floor(Math.random() * 10)} reviews</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50/60 p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-semibold">
                        View Profile <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== Testimonials ==================== */}
      <section className="bg-slate-50/80 border-y border-slate-200/60 section-spacing">
        <div className="container-page">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUpProps}>
            <Badge variant="primary" size="md" className="mb-5">Testimonials</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">Trusted by thousands</h2>
            <p className="mt-3 text-lg text-slate-500 leading-relaxed">Hear from homeowners and contractors who found success</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5" {...staggerContainerProps}>
            {testimonials.map((t) => (
              <motion.div key={t.id} {...staggerItemProps}>
                <Card className="h-full border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300 group">
                  <CardContent className="p-7">
                    <Quote className="h-7 w-7 text-brand-100 mb-4 opacity-60" />
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center justify-between pt-5 border-t border-slate-100/80">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{t.role}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== Trust Indicators ==================== */}
      <section className="section-spacing">
        <div className="container-page">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUpProps}>
            <Badge variant="primary" size="md" className="mb-5">Why Choose Us</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">Built on trust and transparency</h2>
            <p className="mt-3 text-lg text-slate-500 leading-relaxed">Every feature designed to give you confidence at every step</p>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" {...staggerContainerProps}>
            {trustFeatures.map((item) => (
              <motion.div
                key={item.title}
                {...staggerItemProps}
                className="flex flex-col sm:flex-row gap-4 p-6 rounded-xl border border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200/50 text-brand-600 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== FAQ Preview ==================== */}
      <section className="bg-slate-50/80 border-y border-slate-200/60 section-spacing">
        <div className="container-page">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUpProps}>
            <Badge variant="primary" size="md" className="mb-5">FAQ</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-3 text-lg text-slate-500 leading-relaxed">Everything you need to know about getting started</p>
          </motion.div>

          <motion.div className="max-w-3xl mx-auto space-y-3" {...fadeInProps}>
            {faqData.slice(0, 2).flatMap((cat) =>
              cat.questions.slice(0, 2).map((faq) => (
                <details key={faq.q} className="group bg-white rounded-xl border border-slate-200/70 overflow-hidden hover:border-slate-300/80 transition-all duration-200">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-slate-900 hover:bg-slate-50/50 transition-colors select-none">
                    <span>{faq.q}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition-transform duration-300 shrink-0 ml-4" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))
            )}
          </motion.div>

          <motion.div className="text-center mt-6" {...fadeInUpProps}>
            <Link to={ROUTES.FAQ}>
              <Button variant="outline" className="font-semibold">
                View All FAQs <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== Final CTA Section ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 dot-pattern-light" />
        
        <div className="container-page relative py-24 sm:py-32 text-center">
          <motion.div {...fadeInUpProps} className="max-w-2xl mx-auto">
            <Badge variant="secondary" size="md" className="mb-6">Get Started Today</Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Ready to bring your project to life?
            </h2>
            <p className="mt-6 text-lg text-brand-200 leading-relaxed max-w-lg mx-auto">
              Join thousands of homeowners and contractors already building on {APP_CONFIG.NAME}. Post your first project free — no credit card required.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.REGISTER_CUSTOMER}>
                <Button variant="secondary" size="lg" className="shadow-lg shadow-secondary-500/30 font-bold px-8 hover:shadow-xl hover:shadow-secondary-500/40 hover:-translate-y-0.5 transition-all duration-300">
                  <PlusCircle className="h-5 w-5" />
                  Post a Project Free
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER_CONTRACTOR}>
                <Button variant="outline" size="lg" className="border-white/25 text-white hover:bg-white/15 font-semibold px-8 hover:border-white/40 hover:-translate-y-0.5 transition-all duration-300">
                  <HardHat className="h-5 w-5" />
                  Join as Contractor
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-brand-300/80">
              No credit card required · Free to post · Free to receive quotes
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
