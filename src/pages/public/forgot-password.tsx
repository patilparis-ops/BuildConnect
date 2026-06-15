import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useForgotPassword } from "@/hooks/use-api";
import { Mail, ArrowLeft, CheckCircle2, Copy } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: Form) => {
    try {
      const result = await forgotPassword.mutateAsync({ email: data.email });
      setSent(true);
      // In dev mode, show the reset token for testing
      if ((result as any).resetToken) {
        setDevToken((result as any).resetToken);
      }
    } catch {
      // Error toast already handled by the hook
    }
  };

  const copyToken = () => {
    if (devToken) {
      navigator.clipboard.writeText(devToken);
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
        {devToken && (
          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-xs font-medium text-amber-600 uppercase">Development Mode</p>
            <p className="text-xs text-slate-500">Copy this reset token to test:</p>
            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-2">
              <code className="text-xs text-slate-700 flex-1 break-all font-mono">{devToken}</code>
              <button onClick={copyToken} className="shrink-0 p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <Link
              to={`/reset-password?token=${devToken}`}
              className="block w-full text-center"
            >
              <Button size="sm" fullWidth>Continue to Reset Password</Button>
            </Link>
          </div>
        )}
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
        <Button type="submit" fullWidth loading={forgotPassword.isPending}>
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
