import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useResetPassword } from "@/hooks/use-api";
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Form = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [completed, setCompleted] = useState(false);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: Form) => {
    if (!token) {
      setError("root", { message: "Missing reset token. Please use the link from your email." });
      return;
    }
    try {
      await resetPassword.mutateAsync({ token, newPassword: data.newPassword });
      setCompleted(true);
    } catch {
      // Error toast handled by hook
    }
  };

  if (!token) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger-100">
          <AlertCircle className="h-8 w-8 text-danger-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Invalid Reset Link</h1>
        <p className="text-sm text-slate-500">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link to={ROUTES.FORGOT_PASSWORD}>
          <Button>
            <ArrowLeft className="h-4 w-4" />
            Request New Link
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
          <CheckCircle2 className="h-8 w-8 text-success-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Password Reset!</h1>
        <p className="text-sm text-slate-500">
          Your password has been updated successfully. You can now log in with your new password.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button>Sign In</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="p-3 rounded-lg bg-danger-50 text-danger-600 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.root.message}
          </div>
        )}
        <Input
          label="New Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.newPassword?.message}
          icon={<Lock className="h-4 w-4" />}
          {...register("newPassword")}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          icon={<Lock className="h-4 w-4" />}
          {...register("confirmPassword")}
        />
        <Button type="submit" fullWidth loading={resetPassword.isPending}>
          Reset Password
        </Button>
      </form>

      <div className="text-center">
        <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
