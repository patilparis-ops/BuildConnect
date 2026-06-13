import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { teamMembers } from "@/mock/data";
import { APP_CONFIG } from "@/constants";
import { Building2, Target, Eye, Shield, Zap, Users, Globe } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const values = [
  { icon: <Shield className="h-6 w-6" />, title: "Trust & Transparency", description: "Every contractor is verified, every transaction is secure. Your peace of mind is our priority." },
  { icon: <Zap className="h-6 w-6" />, title: "Innovation", description: "We leverage cutting-edge technology to simplify and streamline the construction experience." },
  { icon: <Users className="h-6 w-6" />, title: "Community First", description: "Building a thriving community of trusted professionals and satisfied homeowners across India." },
  { icon: <Globe className="h-6 w-6" />, title: "Sustainability", description: "Promoting sustainable construction practices and eco-friendly building materials." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container-page py-24 sm:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" size="lg" className="mb-4">About Us</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Building trust, one project at a time</h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">{APP_CONFIG.NAME} was founded to solve the biggest challenge in construction: finding reliable, skilled professionals you can trust.</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="container-page py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <Badge variant="primary" size="lg" className="mb-4">Our Story</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">From a simple idea to a movement</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>BuildConnect was born in 2024 when our founders experienced firsthand the frustration of finding reliable contractors for their own home renovation project.</p>
              <p>They realized that India's construction industry — one of the largest in the world — lacked a trusted, technology-driven platform that could connect homeowners with verified professionals.</p>
              <p>Today, BuildConnect has grown into India's fastest-growing construction marketplace, serving thousands of homeowners and contractors across 25+ cities.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
              <div className="text-center p-8">
                <Building2 className="h-20 w-20 text-brand-400 mx-auto mb-4" />
                <p className="text-2xl font-bold text-brand-600">Est. 2024</p>
                <p className="text-brand-500">25+ Cities • 10,000+ Professionals</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container-page py-20 sm:py-28">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeInUp}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mb-6"><Target className="h-7 w-7" /></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed">To democratize access to quality construction services by connecting every homeowner with trusted, verified professionals through a seamless, technology-driven platform.</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeInUp}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-100 text-secondary-600 flex items-center justify-center mb-6"><Eye className="h-7 w-7" /></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                  <p className="text-slate-600 leading-relaxed">To become India's most trusted construction ecosystem — where every home is built with confidence, every contractor is empowered, and every project is a success story.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-page py-20 sm:py-28">
        <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUp}>
          <Badge variant="primary" size="lg" className="mb-4">Our Values</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What drives us every day</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">{v.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container-page py-20 sm:py-28">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeInUp}>
            <Badge variant="primary" size="lg" className="mb-4">Our Team</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Meet the people behind BuildConnect</h2>
            <p className="mt-4 text-lg text-slate-500">A passionate team dedicated to transforming India's construction industry</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-brand-600">{member.name.split(" ").map((n: string) => n[0]).join("")}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                    <p className="text-sm text-brand-600 font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20 sm:py-28">
        <motion.div className="text-center max-w-2xl mx-auto" {...fadeInUp}>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">We're redefining construction in India</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">Whether you're building your dream home or growing your contracting business, BuildConnect gives you the tools, trust, and transparency you need.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register/customer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-700 transition-all">Get Started Free</a>
            <a href="/register/contractor" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-8 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all">Join as Contractor</a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
