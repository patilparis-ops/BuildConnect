import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { APP_CONFIG, PROJECT_CATEGORIES } from "@/constants";
import { testimonials, faqData } from "@/mock/data";
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
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

const steps = [
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Post Your Project",
    description: "Describe your project in detail — type, budget, timeline, and location.",
    color: "from-brand-500 to-brand-600",
  },
  {
    icon: <FileTextIcon />,
    title: "Receive Quotes",
    description: "Get competitive quotes from verified professionals near you.",
    color: "from-secondary-400 to-secondary-500",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Compare & Hire",
    description: "Compare profiles, ratings, and proposals. Hire with confidence.",
    color: "from-success-500 to-success-600",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Track & Complete",
    description: "Monitor progress, make payments securely, and leave a review.",
    color: "from-brand-500 to-brand-600",
  },
];

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredContractors = [
    { name: "Amit Verma", profession: "Builder", rating: 4.8, projects: 342, location: "Mumbai", badge: "Top Rated" },
    { name: "Priya Sharma", profession: "Interior Designer", rating: 4.9, projects: 215, location: "Delhi", badge: "Premium" },
    { name: "Rajesh Kumar", profession: "Electrician", rating: 4.7, projects: 1500, location: "Pune", badge: "Most Booked" },
    { name: "Sneha Patel", profession: "Architect", rating: 4.9, projects: 98, location: "Ahmedabad", badge: "Expert" },
  ];

  return (
    <div className="flex flex-col">
      {/* ==================== Hero Section ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container-page relative py-20 sm:py-28 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Trusted by 10,000+ professionals across India
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Your Vision,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-secondary-500">
                Our Builders
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
              {APP_CONFIG.DESCRIPTION} Post your project, compare quotes, and hire with confidence.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
                <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5">
                  <Search className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="What are you looking to build?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 sm:w-48">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Your city"
                    className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none text-sm"
                  />
                </div>
                <Button variant="secondary" size="lg" className="rounded-xl">
                  Search
                </Button>
              </div>
            </div>

            {/* Popular searches */}
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <span>Popular:</span>
              {["Home Renovation", "Electrical", "Plumbing", "Interior Design"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className="px-3 py-1 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-xs"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap items-center gap-6 sm:gap-10 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-800 bg-gradient-to-br from-slate-600 to-slate-500" />
                  ))}
                </div>
                <span className="text-slate-300"><span className="text-white font-semibold">4.8</span> ★ avg rating</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="h-4 w-4" />
                <span><span className="text-white font-semibold">3,400+</span> projects completed</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="h-4 w-4" />
                <span><span className="text-white font-semibold">25</span> cities</span>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ==================== Categories Section ==================== */}
      <section className="container-page py-20 sm:py-28">
        <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUp}>
          <Badge variant="primary" size="lg" className="mb-4">Browse Categories</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Find the right professional</h2>
          <p className="mt-4 text-lg text-slate-500">Choose from 10+ categories of skilled professionals ready to serve you</p>
        </motion.div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" {...staggerContainer}>
          {PROJECT_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.value}
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
              }}
            >
              <Link
                to={`/how-it-works`}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 group ${
                  selectedCategory === cat.value
                    ? "border-brand-500 bg-brand-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-brand-200 hover:shadow-md hover:-translate-y-0.5"
                }`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-colors ${
                  selectedCategory === cat.value ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600"
                }`}>
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900">{cat.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ==================== How It Works Section ==================== */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container-page py-20 sm:py-28">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeInUp}>
            <Badge variant="secondary" size="lg" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How BuildConnect Works</h2>
            <p className="mt-4 text-lg text-slate-500">Get your project done in 4 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-slate-300" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg mb-6 relative`}>
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-12 text-center" {...fadeInUp}>
            <div className="inline-flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-brand-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Looking for work?</p>
                  <Link to={ROUTES.REGISTER_CONTRACTOR} className="text-sm text-brand-600 hover:underline">
                    Join as contractor
                  </Link>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                  <HardHat className="h-5 w-5 text-secondary-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Need a professional?</p>
                  <Link to={ROUTES.REGISTER_CUSTOMER} className="text-sm text-secondary-600 hover:underline">
                    Post a project
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== Stats Section ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]" />
        <div className="container-page relative py-16 sm:py-20">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" {...staggerContainer}>
            {[
              { icon: <Users className="h-6 w-6" />, value: "2,500+", label: "Verified Contractors" },
              { icon: <Building2 className="h-6 w-6" />, value: "5,000+", label: "Projects Posted" },
              { icon: <CheckCircle2 className="h-6 w-6" />, value: "3,400+", label: "Projects Completed" },
              { icon: <Star className="h-6 w-6" />, value: "4.7★", label: "Average Rating" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4">
                  {stat.icon}
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-brand-100 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== Featured Contractors ==================== */}
      <section className="container-page py-20 sm:py-28">
        <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12" {...fadeInUp}>
          <div>
            <Badge variant="primary" size="lg" className="mb-4">Top Professionals</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Featured Contractors</h2>
            <p className="mt-3 text-lg text-slate-500">Highly rated professionals ready to serve you</p>
          </div>
          <Link to={ROUTES.CONTRACTORS}>
            <Button variant="outline" className="shrink-0">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" {...staggerContainer}>
          {featuredContractors.map((contractor, index) => (
            <motion.div
              key={contractor.name}
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
              }}
            >
              <Card hover padding="none" className="overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                      {contractor.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <Badge variant="success" size="sm">{contractor.badge}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{contractor.name}</h3>
                  <p className="text-sm text-slate-500">{contractor.profession}</p>
                  <div className="flex items-center gap-3 mt-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {contractor.rating}
                    </span>
                    <span>{contractor.projects} projects</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {contractor.location}
                    </span>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-300" />
                      ))}
                      <span className="text-xs text-slate-400 ml-2">+{12 + index * 3} reviews</span>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ==================== Testimonials ==================== */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container-page py-20 sm:py-28">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUp}>
            <Badge variant="primary" size="lg" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Trusted by thousands</h2>
            <p className="mt-4 text-lg text-slate-500">Hear from homeowners and contractors who found success on BuildConnect</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" {...staggerContainer}>
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-brand-200 mb-3" />
                    <p className="text-sm text-slate-600 leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.role}</p>
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

      {/* ==================== Trust Badges ==================== */}
      <section className="container-page py-20">
        <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUp}>
          <Badge variant="primary" size="lg" className="mb-4">Why Choose Us</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Built on trust and transparency</h2>
        </motion.div>

        <motion.div className="grid sm:grid-cols-3 gap-8" {...staggerContainer}>
          {[
            { icon: <Shield className="h-8 w-8" />, title: "Verified Professionals", description: "Every contractor undergoes thorough background verification and credential checks before joining our platform." },
            { icon: <Award className="h-8 w-8" />, title: "Quality Guaranteed", description: "We stand behind the work. If you're not satisfied, our mediation team ensures fair resolution." },
            { icon: <TrendingUp className="h-8 w-8" />, title: "Transparent Pricing", description: "Compare multiple quotes side-by-side. No hidden fees, no surprises. You're always in control." },
            { icon: <Clock className="h-8 w-8" />, title: "Timely Delivery", description: "Track project milestones with real-time updates. Our contractors are committed to deadlines." },
            { icon: <CheckCircle2 className="h-8 w-8" />, title: "Secure Payments", description: "Payments held in escrow and released upon milestone completion. Your money is always protected." },
            { icon: <Sparkles className="h-8 w-8" />, title: "End-to-End Support", description: "Dedicated support team available 6 days a week to help you at every step of your project." },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
              }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ==================== FAQ Preview ==================== */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container-page py-20 sm:py-28">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUp}>
            <Badge variant="primary" size="lg" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </motion.div>
          <motion.div className="max-w-3xl mx-auto space-y-3" {...fadeInUp}>
            {faqData.slice(0, 2).flatMap((cat) =>
              cat.questions.slice(0, 2).map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))
            )}
          </motion.div>
          <motion.div className="text-center mt-8" {...fadeInUp}>
            <Link to={ROUTES.FAQ}>
              <Button variant="outline">
                View All FAQs <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA Section ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
        <div className="container-page relative py-20 sm:py-28 text-center">
          <motion.div {...fadeInUp}>
            <Badge variant="secondary" size="lg" className="mb-4">Get Started Today</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto">
              Ready to bring your project to life?
            </h2>
            <p className="mt-6 text-lg text-brand-100 max-w-xl mx-auto">
              Join thousands of homeowners and contractors already building on BuildConnect. Post your first project free.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.REGISTER_CUSTOMER}>
                <Button variant="secondary" size="xl" className="shadow-lg shadow-secondary-500/25">
                  Post a Project Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER_CONTRACTOR}>
                <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10">
                  Join as Contractor
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-brand-200">
              No credit card required. Free to post projects. Free to receive quotes.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
