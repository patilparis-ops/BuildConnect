import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/components/ui/toast";
import { ArrowRight, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterCustomerPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      login({
        id: Math.random().toString(36).slice(2),
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "customer",
        createdAt: new Date().toISOString(),
        isVerified: true,
      });
      toast({
        title: "Account created!",
        message: "Welcome to BuildConnect",
        variant: "success",
      });
      navigate(ROUTES.CUSTOMER.DASHBOARD);
    } catch {
      toast({
        title: "Registration failed",
        message: "Please try again",
        variant: "error",
      });
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
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Join as a customer and find the best professionals
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Rahul"
            error={errors.firstName?.message}
            icon={<User className="h-4 w-4" />}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            placeholder="Sharma"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          icon={<Mail className="h-4 w-4" />}
          {...register("email")}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          error={errors.phone?.message}
          icon={<Phone className="h-4 w-4" />}
          {...register("phone")}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            error={errors.password?.message}
            icon={<Lock className="h-4 w-4" />}
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

        <Input
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          icon={<Lock className="h-4 w-4" />}
          {...register("confirmPassword")}
        />

        <p className="text-xs text-slate-500">
          By signing up, you agree to our{" "}
          <a href="#" className="text-brand-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-brand-600 hover:underline">
            Privacy Policy
          </a>
        </p>

        <Button type="submit" fullWidth loading={isLoading}>
          Create Account <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center">
        <span className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="text-brand-600 hover:text-brand-700 font-medium">
            Sign in
          </Link>
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-slate-500">Are you a professional?</span>
        </div>
      </div>

      <Link to={ROUTES.REGISTER_CONTRACTOR}>
        <Button variant="outline" fullWidth>
          Join as Contractor
        </Button>
      </Link>
    </motion.div>
  );
}
