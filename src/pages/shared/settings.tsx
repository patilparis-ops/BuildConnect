import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/components/ui/toast";
import { useCertifications, useCreateCertification, useDeleteCertification } from "@/hooks/use-api";
import { User, Mail, Phone, Lock, Save, Bell, Shield, Camera, Award, Plus, Trash2, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Certifications state
  const { data: certData, refetch: refetchCerts } = useCertifications();
  const createCert = useCreateCertification();
  const deleteCert = useDeleteCertification();
  const [showCertForm, setShowCertForm] = useState(false);
  const { register: certRegister, handleSubmit: certHandleSubmit, reset: certReset, formState: { errors: certErrors } } = useForm({
    defaultValues: { name: "", issuer: "", issueDate: "", expiryDate: "", documentUrl: "" },
  });

  const certifications = certData?.certifications || [];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Settings saved!", variant: "success" });
    }, 1000);
  };

  const onCertSubmit = async (data: any) => {
    await createCert.mutateAsync({
      name: data.name,
      issuer: data.issuer,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate || undefined,
      documentUrl: data.documentUrl || undefined,
    });
    setShowCertForm(false);
    certReset();
  };

  const handleDeleteCert = async (id: string) => {
    if (confirm("Remove this certification?")) {
      await deleteCert.mutateAsync(id);
    }
  };

  const isContractor = user?.role === "contractor";
  const baseTabs = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
  ];
  const allTabs = isContractor
    ? [...baseTabs.slice(0, 1), { id: "certifications", label: "Certifications", icon: <Award className="h-4 w-4" /> }, ...baseTabs.slice(1)]
    : baseTabs;

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-3xl mx-auto space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Settings" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and preferences.</p>
      </div>

      <Tabs
        tabs={allTabs}
        activeTab={activeTab}
        onChange={(id) => id === "certifications" ? setActiveTab("certifications") : setActiveTab(id)}
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
            {isContractor && (
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

      {activeTab === "certifications" && (
        <Card>
          <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Certifications & Licenses</CardTitle>
              <Button size="sm" onClick={() => { setShowCertForm(true); certReset(); }}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {certifications.length === 0 && !showCertForm ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-900">No certifications yet</p>
                <p className="text-xs text-slate-500 mt-1">Add certifications to build trust with clients</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowCertForm(true)}>
                  <Plus className="h-4 w-4" /> Add Certification
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {certifications.map((cert: any) => (
                  <div key={cert.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{cert.name}</h4>
                          <p className="text-xs text-slate-500">{cert.issuer}</p>
                        </div>
                        {cert.verified ? (
                          <span className="flex items-center gap-1 text-xs text-success-600 shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                            <XCircle className="h-3.5 w-3.5" /> Unverified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>Issued: {cert.issueDate}</span>
                        {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {cert.documentUrl && (
                          <a href={cert.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> View Document
                          </a>
                        )}
                        <button onClick={() => handleDeleteCert(cert.id)} className="text-xs text-danger-500 hover:text-danger-600 flex items-center gap-1">
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!showCertForm && (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setShowCertForm(true)}>
                    <Plus className="h-4 w-4" /> Add Another
                  </Button>
                )}
              </div>
            )}

            {showCertForm && (
              <form onSubmit={certHandleSubmit(onCertSubmit)} className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900">Add New Certification</h4>
                <Input label="Certification Name" placeholder="e.g. LEED AP" error={certErrors.name?.message} {...certRegister("name", { required: "Name is required" })} />
                <Input label="Issuing Organization" placeholder="e.g. USGBC" error={certErrors.issuer?.message} {...certRegister("issuer", { required: "Issuer is required" })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Issue Date" type="month" error={certErrors.issueDate?.message} {...certRegister("issueDate", { required: "Date is required" })} />
                  <Input label="Expiry Date (optional)" type="month" {...certRegister("expiryDate")} />
                </div>
                <Input label="Document URL (optional)" placeholder="Link to certificate PDF" {...certRegister("documentUrl")} />
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" type="button" onClick={() => { setShowCertForm(false); certReset(); }}>Cancel</Button>
                  <Button type="submit" loading={createCert.isPending}><Plus className="h-4 w-4" /> Add Certification</Button>
                </div>
              </form>
            )}
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
