import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { APP_CONFIG } from "@/constants";
import { ROUTES } from "@/constants/routes";

const footerLinks = {
  Company: [
    { label: "About Us", href: ROUTES.ABOUT },
    { label: "How It Works", href: ROUTES.HOW_IT_WORKS },
    { label: "Contact", href: ROUTES.CONTACT },
    { label: "FAQ", href: ROUTES.FAQ },
  ],
  "For Customers": [
    { label: "Post a Project", href: ROUTES.REGISTER_CUSTOMER },
    { label: "Find Contractors", href: ROUTES.CONTRACTORS },
    { label: "Browse Projects", href: ROUTES.PROJECTS },
    { label: "How It Works", href: ROUTES.HOW_IT_WORKS },
    { label: "Safety Tips", href: ROUTES.FAQ },
  ],
  "For Contractors": [
    { label: "Join as Contractor", href: ROUTES.REGISTER_CONTRACTOR },
    { label: "Browse Projects", href: ROUTES.PROJECTS },
    { label: "Find Contractors", href: ROUTES.CONTRACTORS },
    { label: "Success Stories", href: ROUTES.ABOUT },
    { label: "Contractor Guide", href: ROUTES.FAQ },
  ],
  Support: [
    { label: "Help Center", href: ROUTES.FAQ },
    { label: "Contact Support", href: ROUTES.CONTACT },
    { label: "Terms of Service", href: ROUTES.TERMS_OF_SERVICE },
    { label: "Privacy Policy", href: ROUTES.PRIVACY_POLICY },
  ],
};

const socialLinks = [
  { label: "Twitter", href: APP_CONFIG.SOCIAL.TWITTER },
  { label: "LinkedIn", href: APP_CONFIG.SOCIAL.LINKEDIN },
  { label: "Instagram", href: APP_CONFIG.SOCIAL.INSTAGRAM },
  { label: "YouTube", href: APP_CONFIG.SOCIAL.YOUTUBE },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900">
      <div className="container-page py-16">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                {APP_CONFIG.NAME}
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {APP_CONFIG.DESCRIPTION}
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">{APP_CONFIG.ADDRESS}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="text-sm text-slate-400">{APP_CONFIG.PHONE}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="text-sm text-slate-400">{APP_CONFIG.EMAIL}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">{APP_CONFIG.SUPPORT_HOURS}</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-white transition-colors"
                aria-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
