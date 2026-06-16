import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { useMyProjects, useContractors } from "@/hooks/use-api";
import { ErrorBanner } from "@/components/shared/error-banner";
import { Star, MapPin, Shield, ChevronRight } from "lucide-react";
import { NoHiredContractorsEmpty } from "@/components/shared/empty-states";
import { ROUTES } from "@/constants/routes";

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function CustomerHiredContractorsPage() {
  const { user } = useAuthStore();
  const { data: projectsData, isLoading, isError: isError1, refetch: refetch1 } = useMyProjects();
  const { data: contractorsData, isError: isError2, refetch: refetch2 } = useContractors();
  const hasError = isError1 || isError2;
  const handleRetry = () => { refetch1(); refetch2(); };
  const allProjects = projectsData?.projects ?? [];
  const allContractors = contractorsData?.contractors ?? [];

  const myProjects = allProjects.filter((p) => (p.customerId === user?.id || p.customerId === "u1") && p.awardedTo);
  const hired = myProjects.map((p) => ({
    project: p,
    contractor: allContractors.find((c) => c.id === p.awardedTo)!,
  })).filter((h) => h.contractor);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48 mt-2" />
          <Skeleton className="h-4 w-56 mt-1" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="space-y-6">
      <ErrorBanner isError={hasError} onRetry={handleRetry} />
      <div>
        <Breadcrumbs items={[{ label: "Hired Contractors" }]} />
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Hired Contractors</h1>
        <p className="text-slate-500 mt-1">Contractors you have hired for your projects.</p>
      </div>

      {hired.length === 0 ? (
        <Card><CardContent className="py-8">
          <NoHiredContractorsEmpty />
          <div className="text-center -mt-2">
            <Link to={ROUTES.CUSTOMER.POST_PROJECT}><Button variant="primary" size="sm">Post a Project</Button></Link>
          </div>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {hired.map((h, i) => (
            <motion.div key={h.project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Link to={"/contractors/" + h.contractor.id}>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold shrink-0">
                        {h.contractor.firstName[0]}{h.contractor.lastName[0]}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={"/contractors/" + h.contractor.id} className="text-base font-semibold text-slate-900 hover:text-brand-600">
                            {h.contractor.firstName} {h.contractor.lastName}
                          </Link>
                          <p className="text-sm text-slate-500">{h.contractor.profession}</p>
                        </div>
                        <Badge variant={h.project.status === "completed" ? "success" : "primary"} size="sm">
                          {h.project.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {h.contractor.rating}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {h.contractor.location}</span>
                        {h.contractor.verified && <Shield className="h-4 w-4 text-success-500" />}
                      </div>
                      <p className="text-sm text-slate-500 mt-2">Project: {h.project.title}</p>
                      <Link to={"/contractors/" + h.contractor.id}>
                        <Button variant="ghost" size="sm" className="mt-2">View Profile <ChevronRight className="h-3.5 w-3.5" /></Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}