import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/components/ui/toast";
import { User, Mail, Phone, Lock, Save, Bell, Shield, Camera } from "lucide-react";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Settings saved!", variant: "success" });
    }, 1000);
  };

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-3xl mx-auto space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Settings" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and preferences.</p>
      </div>

      <Tabs
        tabs={[
          { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
          { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
          { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {activeTab === "profile" && (
        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Profile Information</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <Button variant="outline" size="sm"><Camera className="h-4 w-4" /> Change Photo</Button>
                <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" defaultValue={user?.firstName} icon={<User className="h-4 w-4" />} />
              <Input label="Last Name" defaultValue={user?.lastName} />
            </div>
            <Input label="Email" type="email" defaultValue={user?.email} icon={<Mail className="h-4 w-4" />} />
            <Input label="Phone" type="tel" defaultValue={user?.phone} icon={<Phone className="h-4 w-4" />} />
            {user?.role === "contractor" && (
              <>
                <Textarea label="Bio" placeholder="Tell clients about yourself..." defaultValue={(user as any).bio} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Hourly Rate (₹)" type="number" defaultValue={(user as any).hourlyRate} />
                  <Input label="Service Radius (km)" type="number" defaultValue={(user as any).serviceRadius} />
                </div>
              </>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSave} loading={isSaving}><Save className="h-4 w-4" /> Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Notification Preferences</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-5">
            {[
              { label: "Email Notifications", desc: "Receive notifications via email", enabled: true },
              { label: "Push Notifications", desc: "Receive push notifications in browser", enabled: true },
              { label: "SMS Notifications", desc: "Receive text message alerts", enabled: false },
              { label: "Quote Updates", desc: "Get notified when you receive or send quotes", enabled: true },
              { label: "Project Updates", desc: "Updates about your project status changes", enabled: true },
              { label: "Marketing Emails", desc: "Receive tips, offers, and platform updates", enabled: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                  <div className="w-10 h-5 bg-slate-200 peer-checked:bg-brand-600 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} loading={isSaving}><Save className="h-4 w-4" /> Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <Card>
          <CardHeader className="px-6 pt-6 pb-0"><CardTitle>Security Settings</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Change Password</h3>
              <Input label="Current Password" type="password" icon={<Lock className="h-4 w-4" />} />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
              <Button onClick={handleSave} loading={isSaving}>Update Password</Button>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Account</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-danger-50 border border-danger-200">
                <div>
                  <p className="text-sm font-medium text-danger-700">Delete Account</p>
                  <p className="text-xs text-danger-500">Permanently delete your account and all data</p>
                </div>
                <Button variant="danger" size="sm">Delete</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
