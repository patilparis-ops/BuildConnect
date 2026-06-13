import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/components/ui/toast";
import { Mail, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type EmailForm = z.infer<typeof emailSchema>;
type PhoneForm = z.infer<typeof phoneSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "", password: "" },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onEmailSubmit = async (data: EmailForm) => {
    setIsLoading(true);
    try {
      // Mock login
      await new Promise((r) => setTimeout(r, 1000));
      login({
        id: "1",
        email: data.email,
        firstName: "Rahul",
        lastName: "Sharma",
        role: "customer",
        createdAt: new Date().toISOString(),
        isVerified: true,
      });
      toast({ title: "Welcome back!", variant: "success" });
      navigate(ROUTES.CUSTOMER.DASHBOARD);
    } catch {
      toast({ title: "Login failed", message: "Invalid credentials", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneSubmit = async (data: PhoneForm) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      login({
        id: "2",
        email: "user@example.com",
        phone: data.phone,
        firstName: "Demo",
        lastName: "User",
        role: "customer",
        createdAt: new Date().toISOString(),
        isVerified: true,
      });
      toast({ title: "Welcome back!", variant: "success" });
      navigate(ROUTES.CUSTOMER.DASHBOARD);
    } catch {
      toast({ title: "Login failed", message: "Invalid credentials", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to your BuildConnect account
        </p>
      </div>

      {/* Login tabs */}
      <Tabs
        tabs={[
          { id: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
          { id: "phone", label: "Phone", icon: <Phone className="h-4 w-4" /> },
        ]}
        activeTab={loginMethod}
        onChange={setLoginMethod}
        variant="pills"
      />

      {loginMethod === "email" ? (
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={emailForm.formState.errors.email?.message}
            {...emailForm.register("email")}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              error={emailForm.formState.errors.password?.message}
              {...emailForm.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-end">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={isLoading}>
            Sign In <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            error={phoneForm.formState.errors.phone?.message}
            {...phoneForm.register("phone")}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              error={phoneForm.formState.errors.password?.message}
              {...phoneForm.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Button type="submit" fullWidth loading={isLoading}>
            Sign In <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-slate-500">Don't have an account?</span>
        </div>
      </div>

      {/* Register links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to={ROUTES.REGISTER_CUSTOMER}>
          <Button variant="outline" fullWidth size="sm">
            Join as Customer
          </Button>
        </Link>
        <Link to={ROUTES.REGISTER_CONTRACTOR}>
          <Button variant="outline" fullWidth size="sm">
            Join as Contractor
          </Button>
        </Link>
      </div>

      {/* Back to home */}
      <div className="text-center">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
          Back to home
        </Link>
      </div>
    </motion.div>
  );
}
