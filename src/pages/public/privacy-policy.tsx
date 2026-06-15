import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { APP_CONFIG } from "@/constants";

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide when creating an account, posting projects, or communicating with other users. This includes your name, email address, phone number, location, and project details. We also automatically collect usage data such as IP address, browser type, and pages visited.",
  },
  {
    title: "How We Use Your Information",
    content: "Your information is used to facilitate connections between customers and contractors, process transactions, send notifications about project updates, improve our platform, and comply with legal obligations. We never sell your personal information to third parties.",
  },
  {
    title: "Information Sharing",
    content: "We share information only as necessary to provide our services: contractors see project details posted by customers, customers see contractor profiles and quotations, and we may share data with payment processors or legal authorities when required by law.",
  },
  {
    title: "Data Security",
    content: "We implement industry-standard security measures including encryption in transit (TLS 1.3), encrypted data at rest, secure session management, and regular security audits. However, no method of transmission over the Internet is 100% secure.",
  },
  {
    title: "Data Retention",
    content: "We retain your account information for as long as your account is active. You may request deletion of your account and associated data at any time. Project-related data may be retained anonymously for analytics purposes.",
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal data. You can update your profile information at any time through your account settings. To request complete data deletion, contact our support team.",
  },
  {
    title: "Cookies",
    content: "We use essential cookies for authentication and session management. We also use analytics cookies to improve our platform. You can control cookie preferences through your browser settings.",
  },
  {
    title: "Third-Party Services",
    content: "We use trusted third-party services including Supabase (database hosting), Resend (email delivery), and Vercel/Railway (cloud hosting). Each service provider has its own privacy and security practices.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this privacy policy from time to time. We will notify users of material changes via email or through the platform.",
  },
  {
    title: "Contact Us",
    content: "If you have questions about this privacy policy, please contact us or visit our Contact page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
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
            At {APP_CONFIG.NAME}, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
          </p>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 shrink-0 mt-0.5">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">{section.title}</h2>
                    <p className="text-slate-600 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Have Questions?</h3>
            <p className="text-slate-600 mb-6">If you have any concerns about your privacy, we're here to help.</p>
            <div className="flex items-center justify-center gap-4">
              <Link to={ROUTES.CONTACT}><Button variant="primary">Contact Us</Button></Link>
              <Link to={ROUTES.FAQ}><Button variant="ghost">View FAQ</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
