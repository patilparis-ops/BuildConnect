import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { APP_CONFIG } from "@/constants";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using BuildConnect, you agree to be bound by these Terms of Service. If you do not agree, you may not use our platform." },
  { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration." },
  { title: "User Conduct", content: "Users agree to provide accurate information, communicate professionally, and comply with all applicable laws. Prohibited conduct includes fraud, harassment, and spam." },
  { title: "Customer Responsibilities", content: "Customers must provide clear project requirements, review quotations in a timely manner, make payments as agreed, and communicate respectfully with contractors." },
  { title: "Contractor Responsibilities", content: "Contractors must provide accurate quotations, deliver services as described, maintain appropriate licenses and insurance, and complete projects within agreed timelines." },
  { title: "Fees and Payments", content: "BuildConnect is currently free to use. Any future fee changes will be communicated to users in advance. Payment terms between users are agreed upon directly." },
  { title: "Intellectual Property", content: "Project materials and content shared through the platform remain the property of their respective owners. You may not use our branding without permission." },
  { title: "Limitation of Liability", content: "BuildConnect provides a platform for connecting users and is not a party to agreements between them. We are not liable for project outcomes or disputes." },
  { title: "Dispute Resolution", content: "Users should resolve disputes through direct communication. As a last resort, disputes shall be governed by the laws of India." },
  { title: "Termination", content: "We reserve the right to suspend or terminate accounts that violate these terms. Users may terminate their account at any time through settings." },
  { title: "Privacy", content: "Your use of the platform is also governed by our Privacy Policy, which describes how we protect your personal information." },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-lg text-slate-300">Last updated: June 15, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page max-w-3xl mx-auto">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            Welcome to BuildConnect. These Terms of Service govern your use of our platform.
          </p>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 shrink-0 mt-0.5">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">{index + 1}. {section.title}</h2>
                    <p className="text-slate-600 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Questions About Our Terms?</h3>
            <p className="text-slate-600 mb-6">We're happy to clarify any aspect of our Terms of Service.</p>
            <div className="flex items-center justify-center gap-4">
              <Link to={ROUTES.CONTACT}><Button variant="primary">Contact Us</Button></Link>
              <Link to={ROUTES.PRIVACY_POLICY}><Button variant="ghost">View Privacy Policy</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
