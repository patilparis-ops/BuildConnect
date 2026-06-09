import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Upload, 
  Plus, 
  History, 
  Layout, 
  Settings, 
  Code2, 
  Eye, 
  RefreshCw, 
  Menu,
  Database,
  Users,
  FileCode,
  Box,
  MessageSquare,
  Mic,
  Paperclip,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  ChevronDown,
  Activity,
  Layers,
  ArrowRight,
  X
} from "lucide-react";
import { cn } from "../utils/cn";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Project, Message, GenerationStatus } from "../types/project";
import { initialMessages } from "../services/mockData";

export default function Workspace() {
  const navigate = useNavigate();

  // UI State
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("editor");
  const [dragActive, setDragActive] = useState(false);

  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Load projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setErrorMessage(error instanceof Error ? error.message : "Failed to fetch projects");
      }
    };
    fetchProjects();
  }, []);

  // Update pipeline step based on status
  useEffect(() => {
    const statusMap: Record<GenerationStatus, number> = {
      idle: 0,
      uploading: 0,
      analyzing: 1,
      extracting: 2,
      generating: 3,
      completed: 4,
      error: 0
    };
    setActiveStep(statusMap[status]);
  }, [status]);

  const pipelineSteps = [
    { title: "UPLOAD", icon: <Upload className="w-4 h-4" /> },
    { title: "ANALYZE", icon: <Layers className="w-4 h-4" /> },
    { title: "EXTRACT", icon: <Box className="w-4 h-4" /> },
    { title: "GENERATE", icon: <Sparkles className="w-4 h-4" /> },
    { title: "PREVIEW", icon: <Eye className="w-4 h-4" /> },
  ];

  const quickActions = [
    { label: "Generate Dashboard", icon: <Layout className="w-4 h-4" /> },
    { label: "Landing Page", icon: <Globe className="w-4 h-4" /> },
    { label: "SaaS App", icon: <Box className="w-4 h-4" /> },
    { label: "Admin Panel", icon: <Database className="w-4 h-4" /> },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onFileUpload = async (files: FileList) => {
    setStatus("uploading");
    const fileArray = Array.from(files);
    
    try {
      setErrorMessage("");
      const uploadPromises = fileArray.map(file => api.uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
      setStatus("idle");
    } catch (error) {
      console.error("Upload failed", error);
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      setStatus("error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating || !prompt.trim() || uploadedImages.length === 0) return;

    const generationPrompt = prompt;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: generationPrompt,
      timestamp: new Date().toISOString(),
      attachments: uploadedImages
    };
    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    
    // Start Generation Flow
    try {
      setErrorMessage("");
      setIsGenerating(true);
      setStatus("analyzing");
      await new Promise(r => setTimeout(r, 1000));
      
      setStatus("extracting");
      await new Promise(r => setTimeout(r, 1000));
      
      setStatus("generating");
      const project = await api.generateProject(generationPrompt, uploadedImages);
      
      setStatus("completed");
      setCurrentProject(project);
      navigate(`/preview/${project.id}`);
      
      // Add assistant success message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've architected your project "${project.name}". You can see the preview in the right panel.`,
        timestamp: new Date().toISOString()
      }]);

      setUploadedImages([]);
    } catch (error) {
      console.error("Generation failed", error);
      setErrorMessage(error instanceof Error ? error.message : "Generation failed");
      setStatus("error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      {/* LEFT SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={cn(
          "flex flex-col border-r border-white/5 bg-[#0A0A0A] z-40 relative h-full",
          !isSidebarOpen && "pointer-events-none"
        )}
      >
        {/* Logo */}
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
               <Layout className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">FrameForge</span>
          </Link>
        </div>

        {/* Action Button */}
        <div className="px-4 mb-8">
          <button 
            onClick={() => {
              setCurrentProject(null);
              setMessages(initialMessages);
              setStatus("idle");
              setIsGenerating(false);
              setErrorMessage("");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-grow px-2 space-y-6 overflow-y-auto">
          {/* Section: Main */}
          <div className="space-y-1">
             {[
               { icon: <Monitor className="w-4 h-4" />, label: "Workspace", active: !currentProject },
               { icon: <History className="w-4 h-4" />, label: "Project History", href: "/history" },
               { icon: <Box className="w-4 h-4" />, label: "Assets" },
               { icon: <Users className="w-4 h-4" />, label: "Team" },
               { icon: <Settings className="w-4 h-4" />, label: "Settings" }
             ].map((item, i) => (
               <Link key={i} to={item.href || "#"} className={cn(
                 "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group relative",
                 item.active ? "bg-brand-purple/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
               )}>
                 {item.active && (
                   <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                 )}
                 <div className={cn("transition-colors", item.active ? "text-brand-purple" : "text-white/20 group-hover:text-white")}>
                   {item.icon}
                 </div>
                 <span className={cn("font-medium text-[13px]", item.active ? "text-white" : "text-inherit")}>{item.label}</span>
               </Link>
             ))}
          </div>

          {/* Section: Recent Projects */}
          <div className="space-y-3 px-2">
            <h4 className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold px-2">Recent Projects</h4>
            <div className="space-y-1">
              {projects.map((proj) => (
                <button 
                  key={proj.id} 
                  onClick={() => setCurrentProject(proj)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[13px] text-left transition-colors group",
                    currentProject?.id === proj.id ? "text-brand-purple bg-brand-purple/5" : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    currentProject?.id === proj.id ? "bg-brand-purple shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "bg-white/20 group-hover:bg-white/40"
                  )} />
                  <span className="truncate text-white/70 group-hover:text-white">{proj.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {[
            { icon: <FileCode className="w-4 h-4" />, label: "Documentation" },
            { icon: <MessageSquare className="w-4 h-4" />, label: "Support" }
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] text-white/40 hover:text-white hover:bg-white/5 transition-all text-left">
               {item.icon}
               <span>{item.label}</span>
            </button>
          ))}
          
          <button className="mt-4 w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group text-white/60">
             <div className="w-8 h-8 rounded-full premium-gradient flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
             <div className="flex-grow overflow-hidden">
                <div className="text-xs font-bold truncate group-hover:text-brand-purple transition-colors">John Doe</div>
                <div className="text-[10px] text-white/40 truncate">Pro Developer</div>
             </div>
             <ChevronDown className="w-4 h-4 text-white/20" />
          </button>
        </div>
      </motion.aside>

      {/* CENTER PANEL */}
      <main className="flex-grow flex flex-col min-w-0 bg-[#050505] relative pt-16">
        {/* Toggle Sidebar Button (Float) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute left-6 top-6 w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all z-50"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Top Navigation */}
        <div className="absolute top-0 right-0 left-0 h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold text-sm tracking-wide text-white">
              {currentProject ? currentProject.name : "Untitled Project"}
            </h2>
            <div className="px-2 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-[10px] font-extrabold text-brand-purple tracking-wider uppercase">
              {currentProject?.status || "Draft"}
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl">
             {[
               { id: "editor", label: "Editor", icon: <Code2 className="w-4 h-4" /> },
               { id: "deploy", label: "Deploy", icon: <Globe className="w-4 h-4" /> },
               { id: "analytics", label: "Analytics", icon: <Activity className="w-4 h-4" /> }
             ].map((tab) => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                   "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all",
                   activeTab === tab.id ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
                 )}
               >
                 {tab.icon}
                 {tab.label}
               </button>
             ))}
          </div>

          <div className="w-[100px]" /> {/* Spacer */}
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar pt-8">
          {/* Generation Pipeline */}
          <div className="max-w-4xl mx-auto px-8 mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-[1px] bg-white/5 z-0" />
              <div 
                className="absolute top-5 left-0 h-[1px] bg-brand-purple transition-all duration-1000 z-0" 
                style={{ width: `${(activeStep / (pipelineSteps.length - 1)) * 100}%` }}
              />

              {pipelineSteps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-3 group">
                  <div className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    idx < activeStep ? "bg-brand-purple border-brand-purple text-white" :
                    idx === activeStep && isGenerating ? "bg-black border-brand-purple text-brand-purple shadow-[0_0_20px_rgba(139,92,246,0.3)]" :
                    "bg-black border-white/10 text-white/20 group-hover:border-white/30"
                  )}>
                    {isGenerating && idx === activeStep ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-purple" />
                    ) : step.icon}
                  </div>
                  <span className={cn(
                    "text-[9px] font-black tracking-widest transition-colors",
                    idx === activeStep && isGenerating ? "text-brand-purple" : "text-white/20"
                  )}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!currentProject && status === "idle" && (
            <div className="text-center px-8 mb-12">
              <h1 className="text-5xl font-display font-bold mb-6 tracking-tight text-white leading-tight">
                Build the future with <span className="gradient-text">FrameForge</span>
              </h1>
              <p className="text-white/40 max-w-xl mx-auto leading-relaxed text-sm">
                Upload a screenshot, design file, or describe your vision.<br />
                FrameForge will architect and generate a production-ready application for you.
              </p>
            </div>
          )}

          {/* Main AI Interaction Grid */}
          <div className="max-w-4xl mx-auto px-8 space-y-6 pb-24">
            
            {/* Conversation History */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 items-start",
                      msg.role === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                      msg.role === "assistant" ? "premium-gradient" : "bg-white/10 border border-white/10"
                    )}>
                      {msg.role === "assistant" ? <Sparkles className="w-5 h-5 text-white" /> : <div className="text-[10px] font-bold text-white/40">JD</div>}
                    </div>
                    <div className={cn(
                      "glass-card p-4 flex-grow max-w-[80%]",
                      msg.role === "assistant" ? "bg-brand-purple/[0.02] border-brand-purple/20" : "bg-white/[0.01]"
                    )}>
                      <p className="text-xs leading-relaxed text-white/80">{msg.content}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                           {msg.attachments.map((url, i) => (
                             <img key={i} src={url} alt="Attachment" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                           ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick Actions (only show at start) */}
            {messages.length < 3 && status === "idle" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                 {quickActions.map((action, i) => (
                   <button 
                    key={i} 
                    onClick={() => setPrompt(action.label)}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all text-white/60 hover:text-white group"
                   >
                      <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center transition-colors group-hover:text-brand-purple text-white">
                        {action.icon}
                      </div>
                      <span className="text-[10px] font-bold text-center text-white/80">{action.label}</span>
                   </button>
                 ))}
              </div>
            )}

            {/* Upload Section */}
            {uploadedImages.length === 0 && status === "idle" && !currentProject && (
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 flex flex-col items-center justify-center text-center",
                  dragActive ? "border-brand-purple bg-brand-purple/5" : "border-white/5 hover:border-white/10 bg-white/[0.01]"
                )}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Upload className="w-6 h-6 text-white/40" />
                </div>
                <h4 className="text-sm font-bold mb-1 text-white">Drag and drop assets here</h4>
                <p className="text-xs text-white/30 mb-4">PNG, JPG, JPEG, WebP or Figma screenshots</p>
                <input 
                  type="file" 
                  className="hidden" 
                  id="file-upload" 
                  multiple 
                  onChange={(e) => e.target.files && onFileUpload(e.target.files)} 
                />
                <label htmlFor="file-upload" className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all cursor-pointer text-white">
                  Browse Files
                </label>
              </div>
            )}

            {/* Prompt Input Area */}
            <div className="space-y-4">
               <div className="relative glass-card bg-white/[0.02] border-white/10 p-2 focus-within:border-brand-purple/30 transition-all group shadow-2xl">
                  {uploadedImages.length > 0 && (
                    <div className="flex gap-2 p-4 border-b border-white/5 overflow-x-auto">
                       {uploadedImages.map((url, i) => (
                         <div key={i} className="relative w-12 h-12 flex-shrink-0 group/img">
                            <img src={url} alt="To upload" className="w-full h-full rounded-lg object-cover" />
                            <button 
                              onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                         </div>
                       ))}
                    </div>
                  )}
                  <textarea 
                    placeholder="Describe your interface in detail..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 resize-none min-h-[140px] px-6 py-4 text-sm"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                  />
                  {errorMessage && (
                    <div className="px-6 pb-3 text-xs font-semibold text-red-400">
                      {errorMessage}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between px-4 pb-2">
                     <div className="flex items-center gap-1">
                        <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-all flex items-center gap-2" title="Voice Input">
                           <Mic className="w-4 h-4" />
                        </button>
                        <label htmlFor="file-upload-input" className="p-2.5 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-all flex items-center gap-2 cursor-pointer">
                           <Paperclip className="w-4 h-4" />
                           <input 
                              type="file" 
                              id="file-upload-input" 
                              className="hidden" 
                              multiple 
                              onChange={(e) => e.target.files && onFileUpload(e.target.files)} 
                            />
                        </label>
                        <div className="h-4 w-[1px] bg-white/10 mx-2" />
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all text-[10px] font-bold flex items-center gap-2">
                           Web App <ChevronDown className="w-3 h-3" />
                        </button>
                     </div>

                      <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim() || uploadedImages.length === 0}
                      className={cn(
                       "flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]",
                       prompt.trim() && uploadedImages.length > 0
                        ? "premium-gradient text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)]" 
                        : "bg-white/10 text-white/20 pointer-events-none"
                     )}>
                        {!isGenerating ? (
                          <>Generate <ArrowRight className="w-4 h-4" /></>
                        ) : (
                          <div className="flex items-center gap-2 text-white">
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            Building...
                          </div>
                        )}
                     </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* RIGHT PANEL - PREVIEW */}
      <aside className="w-[480px] bg-[#020202] border-l border-white/5 flex flex-col relative z-20">
         {/* Browser Controls */}
         <div className="h-14 border-b border-white/5 bg-black/40 flex items-center px-4 gap-3">
            <div className="flex gap-1.5 mr-2">
               <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
               <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
               <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            
            <div className="flex-grow h-8 rounded-lg bg-white/5 border border-white/10 flex items-center px-3 gap-2 overflow-hidden">
               <Globe className="w-3 h-3 text-white/20 flex-shrink-0" />
               <span className="text-[10px] text-white/20 truncate">
                 {currentProject ? `localhost:3000/preview/${currentProject.id}` : "localhost:3000/preview/empty"}
               </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                <button className="p-1.5 rounded-md bg-white/10 text-brand-purple shadow-sm"><Monitor className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-white transition-all"><Tablet className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-white transition-all"><Smartphone className="w-3.5 h-3.5" /></button>
            </div>
         </div>

         {/* Viewport Content */}
         <div className="flex-grow flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0%,transparent_100%)]">
            <div className="flex-grow flex items-center justify-center p-4">
               {currentProject ? (
                 <div className="w-full h-full glass rounded-xl border border-white/5 overflow-hidden bg-white/5 flex items-center justify-center relative group">
                    <iframe 
                      src={currentProject.previewUrl} 
                      className="w-full h-full border-none"
                      title="Preview"
                    />
                    {isGenerating && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-center px-6">
                        <RefreshCw className="w-8 h-8 text-brand-purple animate-spin" />
                        <span className="text-xs font-bold tracking-widest text-white/60">REGENERATING PREVIEW...</span>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="w-full flex flex-col items-center text-center space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-brand-purple/20 rounded-full blur-3xl animate-pulse-slow opacity-50" />
                      <div className="relative w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-2">
                          {isGenerating ? <RefreshCw className="w-10 h-10 text-brand-purple animate-spin" /> : <Monitor className="w-10 h-10 text-white/10" />}
                          {isGenerating && (
                            <div className="absolute top-1 right-1">
                               <div className="w-2 h-2 rounded-full bg-brand-purple animate-ping" />
                               <div className="w-2 h-2 rounded-full bg-brand-purple absolute top-0" />
                            </div>
                          )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 px-6">
                      <h3 className="text-xl font-display font-bold text-white">
                        {!isGenerating ? "Preview is Ready" : "Generating Blueprint..."}
                      </h3>
                      <p className="text-white/40 text-xs max-w-[240px] mx-auto leading-relaxed">
                        {!isGenerating 
                          ? "Your generated application will appear here in real-time."
                          : "We're architecting your vision. This usually takes 30-60 seconds."}
                      </p>
                    </div>

                    {isGenerating && (
                      <div className="flex gap-1">
                         <div className="w-1 h-1 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: "0ms" }} />
                         <div className="w-1 h-1 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: "150ms" }} />
                         <div className="w-1 h-1 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                 </div>
               )}
            </div>

            {/* Bottom Preview Toolbar */}
            <div className="h-14 border-t border-white/5 bg-black/40 flex items-center justify-between px-4">
               <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all" title="Refresh">
                     <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all" title="Open in New Window">
                     <ExternalLink className="w-4 h-4" />
                  </button>
               </div>
               
               <button 
                onClick={handleGenerate}
                 disabled={!currentProject || isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-white/60 hover:text-brand-purple hover:bg-brand-purple/10 transition-all border border-transparent hover:border-brand-purple/20 disabled:opacity-30"
               >
                  <Sparkles className="w-3.5 h-3.5" />
                  Regenerate
               </button>
            </div>
         </div>
      </aside>

      {/* MOBILE NAVIGATION OVERLAY */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/5 z-[100] md:hidden flex items-center justify-around px-6">
         <button className="p-2 text-brand-purple"><Layout className="w-6 h-6" /></button>
         <button className="p-2 text-white/40"><MessageSquare className="w-6 h-6" /></button>
         <button className="p-3 -mt-8 rounded-2xl premium-gradient text-white shadow-lg"><Plus className="w-6 h-6" /></button>
         <button className="p-2 text-white/40"><Eye className="w-6 h-6" /></button>
         <div className="w-8 h-8 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
