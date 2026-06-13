import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { APP_CONFIG } from "@/constants";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container-page py-24 sm:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="secondary" size="lg" className="mb-4">Contact Us</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">We would love to hear from you</h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">Have a question or need help? Our team is here for you.</p>
          </motion.div>
        </div>
      </section>
      <section className="container-page -mt-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Mail className="h-6 w-6" />, title: "Email", desc: "24hr response", val: APP_CONFIG.EMAIL },
            { icon: <Phone className="h-6 w-6" />, title: "Phone", desc: "Mon-Sat 9-8", val: APP_CONFIG.PHONE },
            { icon: <MapPin className="h-6 w-6" />, title: "Office", desc: "Headquarters", val: "Mumbai, India" },
            { icon: <Clock className="h-6 w-6" />, title: "Hours", desc: "Support hours", val: APP_CONFIG.SUPPORT_HOURS },
          ].map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }}>
              <Card className="text-center h-full"><CardContent className="p-6">
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">{m.icon}</div>
                <h3 className="text-sm font-semibold">{m.title}</h3>
                <p className="text-xs text-slate-500 mb-2">{m.desc}</p>
                <p className="text-sm font-medium text-brand-600">{m.val}</p>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
