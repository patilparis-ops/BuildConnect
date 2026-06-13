import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/store/notification-store";
import { Bell, CheckCheck, Trash2, FileText, Star, CheckCircle2, AlertCircle, IndianRupee, HardHat } from "lucide-react";
import { toast } from "@/components/ui/toast";

const mockNotifications = [
  { id: "n1", type: "quote_received", title: "New Quote Received", message: "Amit Verma has submitted a quote for your Home Renovation project.", read: false, createdAt: "2026-06-13T10:00:00Z", link: "#" },
  { id: "n2", type: "quote_accepted", title: "Quote Accepted", message: "Vikram Singh has accepted your project: Bathroom Plumbing.", read: false, createdAt: "2026-06-12T14:30:00Z", link: "#" },
  { id: "n3", type: "review_received", title: "New Review", message: "Priya Mehta left a 5-star review for your work on Home Renovation.", read: false, createdAt: "2026-06-11T09:15:00Z", link: "#" },
  { id: "n4", type: "project_update", title: "Project Update", message: "Your project Office Interior Design has been marked as In Progress.", read: true, createdAt: "2026-06-10T16:00:00Z", link: "#" },
  { id: "n5", type: "payment", title: "Payment Released", message: "Payment of ₹65,000 for Home Renovation has been released.", read: true, createdAt: "2026-06-09T11:00:00Z", link: "#" },
];

const typeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  quote_received: { icon: <FileText className="h-4 w-4" />, color: "bg-brand-50 text-brand-600" },
  quote_accepted: { icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-success-50 text-success-600" },
  review_received: { icon: <Star className="h-4 w-4" />, color: "bg-warning-50 text-warning-600" },
  project_update: { icon: <HardHat className="h-4 w-4" />, color: "bg-secondary-50 text-secondary-600" },
  payment: { icon: <IndianRupee className="h-4 w-4" />, color: "bg-brand-50 text-brand-600" },
  verification: { icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-primary-50 text-primary-600" },
  message: { icon: <AlertCircle className="h-4 w-4" />, color: "bg-slate-50 text-slate-600" },
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Notifications" }]} />
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated with your activity.</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { markAllAsRead(); toast({ title: "All marked as read", variant: "success" }); }}>
              <CheckCheck className="h-4 w-4" /> Mark All Read
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-danger-500" onClick={() => { clearNotifications(); toast({ title: "Notifications cleared", variant: "info" }); }}>
            <Trash2 className="h-4 w-4" /> Clear All
          </Button>
        </div>
      </div>

      {displayNotifications.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-slate-900">All caught up!</h3>
          <p className="text-sm text-slate-500 mt-1">No new notifications</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {displayNotifications.map((n, i) => {
            const style = typeIcons[n.type] || typeIcons.message;
            return (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className={"overflow-hidden transition-colors " + (!n.read ? "border-brand-200 bg-brand-50/30" : "")}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={"w-9 h-9 rounded-lg " + style.color + " flex items-center justify-center shrink-0"}>{style.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">{n.title}</h4>
                          <div className="flex items-center gap-2 shrink-0">
                            {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                            <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">{n.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {!n.read && (
                            <Button variant="ghost" size="xs" onClick={() => { markAsRead(n.id); toast({ title: "Marked as read", variant: "info" }); }}>
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
