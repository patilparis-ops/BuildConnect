import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/hooks/use-api";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      const role = result.user?.role;
      if (role === "customer") navigate(ROUTES.CUSTOMER.DASHBOARD);
      else if (role === "contractor") navigate(ROUTES.CONTRACTOR.DASHBOARD);
      else if (role === "admin") navigate(ROUTES.ADMIN.DASHBOARD);
      else navigate(ROUTES.HOME);
    } catch {
      // Error toast is handled by useLogin() hook
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
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

        <Button type="submit" fullWidth loading={loginMutation.isPending}>
          Sign In <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

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
