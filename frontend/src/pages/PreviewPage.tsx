
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  Code2,
  Sparkles,
  Search,
  MessageSquare,
} from "lucide-react";

import { cn } from "../utils/cn";
import { api } from "../services/api";

// Components
import { FileExplorer } from "../components/preview/FileExplorer";
import { PreviewBrowser } from "../components/preview/PreviewBrowser";
import { CodePanel } from "../components/preview/CodePanel";
import { InsightsPanel } from "../components/preview/InsightsPanel";
import { ProjectToolbar } from "../components/preview/ProjectToolbar";

export default function PreviewPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewport, setViewport] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const [mobileTab, setMobileTab] = useState<
    "explorer" | "preview" | "code" | "insights"
  >("preview");

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setError("Invalid project ID");
        setLoading(false);
        return;
      }

      try {
        const data = await api.getProject(projectId);
        setProject(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl premium-gradient opacity-20 blur-2xl animate-pulse" />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-brand-purple" />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-display font-bold tracking-tight">
            Loading project...
          </h2>

          <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
              className="h-full bg-brand-purple"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Top Toolbar */}
      <ProjectToolbar
        viewport={viewport}
        setViewport={setViewport}
        projectName={project?.name || "Generated Project"}
      />

      {/* Main Workspace */}
      <div className="flex-grow flex overflow-hidden relative">

        {/* File Explorer */}
        <div className="hidden md:block">
          <FileExplorer />
        </div>

        {/* Main Content */}
        <main className="flex-grow flex flex-col min-w-0 bg-[#020202]">

          <div className="flex-grow flex flex-col">

            <div
              className={cn(
                "flex-grow flex flex-col",
                mobileTab !== "preview" && "hidden md:flex"
              )}
            >
              <PreviewBrowser
                viewport={viewport}
                url={
                  project?.previewUrl ||
                  "http://localhost:5173"
                }
              />
            </div>

            {/* Mobile Panels */}
            <div className="md:hidden flex-grow overflow-hidden">
              {mobileTab === "explorer" && <FileExplorer />}

              {mobileTab === "code" && <CodePanel />}

              {mobileTab === "insights" && <InsightsPanel />}
            </div>

            {/* Code Panel */}
            <div
              className={cn(
                "hidden md:block shrink-0",
                viewport === "mobile"
                  ? "h-[200px]"
                  : "h-[300px]"
              )}
            >
              <CodePanel />
            </div>

          </div>
        </main>

        {/* Insights */}
        <div className="hidden xl:block">
          <InsightsPanel />
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 z-[100] md:hidden flex items-center justify-around px-6">

          {[
            {
              id: "explorer",
              icon: <Search className="w-5 h-5" />,
              label: "Files",
            },
            {
              id: "preview",
              icon: <Eye className="w-5 h-5" />,
              label: "Preview",
            },
            {
              id: "code",
              icon: <Code2 className="w-5 h-5" />,
              label: "Code",
            },
            {
              id: "insights",
              icon: <Sparkles className="w-5 h-5" />,
              label: "AI",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setMobileTab(tab.id as any)
              }
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                mobileTab === tab.id
                  ? "text-brand-purple"
                  : "text-white/30 hover:text-white"
              )}
            >
              {tab.icon}

              <span className="text-[9px] font-bold uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full premium-gradient flex items-center justify-center shadow-2xl shadow-brand-purple/40 z-[90] hidden md:flex border border-white/20"
      >
        <MessageSquare className="w-6 h-6 text-white" />

        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black" />
      </motion.button>
    </div>
  );
}

