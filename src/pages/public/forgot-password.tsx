import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { toast } from "@/components/ui/toast";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: Form) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
      toast({
        title: "Reset link sent!",
        message: `Check ${data.email} for instructions`,
        variant: "success",
      });
    } catch {
      toast({ title: "Something went wrong", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
          <CheckCircle2 className="h-8 w-8 text-success-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
        <p className="text-sm text-slate-500">
          We've sent a password reset link to your email. It may take a few minutes to arrive.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          icon={<Mail className="h-4 w-4" />}
          {...register("email")}
        />
        <Button type="submit" fullWidth loading={isLoading}>
          Send Reset Link
        </Button>
      </form>

      <div className="text-center">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
