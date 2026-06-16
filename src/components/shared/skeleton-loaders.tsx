import { motion } from "framer-motion";

// Pulse animation for skeleton loaders
const pulseVariants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 0.9, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Card skeleton loader
export function CardSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="border border-slate-200/70 rounded-xl p-6 bg-white space-y-4"
    >
      <div className="h-4 w-24 rounded-lg bg-slate-200/40" />
      <div className="space-y-3">
        <div className="h-8 w-32 rounded-lg bg-slate-200/40" />
        <div className="h-3 w-full rounded-lg bg-slate-200/40" />
        <div className="h-3 w-3/4 rounded-lg bg-slate-200/40" />
      </div>
    </motion.div>
  );
}

// Stats card skeleton
export function StatsSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="border border-slate-200/70 rounded-xl p-6 bg-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-16 rounded-lg bg-slate-200/40" />
        <div className="h-8 w-8 rounded-lg bg-slate-200/40" />
      </div>
      <div className="h-10 w-20 rounded-lg bg-slate-200/40 mb-3" />
      <div className="h-1.5 w-full rounded-full bg-slate-200/40" />
    </motion.div>
  );
}

// Project card skeleton
export function ProjectCardSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="flex gap-4 py-4"
    >
      <div className="h-11 w-11 rounded-lg bg-slate-200/40 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-2/3 rounded-lg bg-slate-200/40" />
        <div className="flex gap-4">
          <div className="h-3 w-24 rounded-lg bg-slate-200/40" />
          <div className="h-3 w-32 rounded-lg bg-slate-200/40" />
        </div>
      </div>
    </motion.div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <motion.tr
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="border-b border-slate-200/70 hover:bg-slate-50/50"
    >
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 rounded-lg bg-slate-200/40" />
        </td>
      ))}
    </motion.tr>
  );
}

// List item skeleton
export function ListItemSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="flex gap-3 py-3 border-b border-slate-200/70 last:border-0"
    >
      <div className="h-10 w-10 rounded-lg bg-slate-200/40 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded-lg bg-slate-200/40" />
        <div className="h-3 w-1/2 rounded-lg bg-slate-200/40" />
      </div>
    </motion.div>
  );
}

// Dashboard grid skeleton
export function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsSkeleton key={i} />
      ))}
    </div>
  );
}

// Content skeleton (for main sections)
export function ContentSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="border border-slate-200/70 rounded-xl p-6 bg-white"
    >
      <div className="h-4 w-32 rounded-lg bg-slate-200/40 mb-6" />
      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full rounded-lg bg-slate-200/40" />
            <div className="h-4 w-5/6 rounded-lg bg-slate-200/40" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Avatar skeleton
export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  }[size];

  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className={`${sizeClass} rounded-full bg-slate-200/40`}
    />
  );
}

// Badge skeleton
export function BadgeSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="h-6 w-16 rounded-lg bg-slate-200/40"
    />
  );
}

// Form field skeleton
export function FormFieldSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      <div className="h-4 w-24 rounded-lg bg-slate-200/40" />
      <div className="h-10 w-full rounded-lg bg-slate-200/40" />
    </motion.div>
  );
}

// Text skeleton (inline)
export function TextSkeleton({ width = "w-24" }: { width?: string }) {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className={`h-4 rounded-lg bg-slate-200/40 ${width}`}
    />
  );
}

// Full page skeleton loader
export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-lg bg-slate-200/40 animate-pulse" />
        <div className="h-10 w-64 rounded-lg bg-slate-200/40 animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <DashboardGridSkeleton />

      {/* Content sections skeleton */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CardSkeleton />
          <ContentSkeleton rows={3} />
        </div>
        <div className="space-y-8">
          <CardSkeleton />
        </div>
      </div>
    </motion.div>
  );
}
