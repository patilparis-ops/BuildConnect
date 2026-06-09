import { useState } from "react";
import { Code2, Monitor, Smartphone, Tablet, Copy, Check } from "lucide-react";
import { cn } from "../../utils/cn";

export default function LivePreview() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const codeSnippet = `export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" />
        <span className="font-bold text-xl text-white">Brand</span>
      </div>
      <div className="flex items-center gap-8 text-sm font-medium text-white/70">
        <a href="#" className="hover:text-white transition-colors">Features</a>
        <a href="#" className="hover:text-white transition-colors">Pricing</a>
        <a href="#" className="hover:text-white transition-colors">About</a>
      </div>
      <button className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-all">
        Sign In
      </button>
    </nav>
  );
};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <div className="lg:w-1/3">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Real-time Preview & <br />
              <span className="text-brand-purple">Clean Code</span>
            </h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              Watch as FrameForge transforms your vision into reality. Every component is optimized for performance, accessibility, and responsiveness.
            </p>
            
            <ul className="space-y-6">
              {[
                "Production-ready React & TypeScript",
                "Fully responsive Tailwind CSS",
                "Semantic HTML5 structure",
                "Optimized asset handling"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-brand-purple" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* IDE/Preview Mockup */}
          <div className="lg:w-2/3 w-full">
            <div className="glass rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10">
                    <Code2 className="w-3.5 h-3.5 text-brand-purple" />
                    <span className="text-xs font-mono text-white/50">Navbar.tsx</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/5">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                      activeTab === "preview" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                    )}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("code")}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                      activeTab === "code" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                    )}
                  >
                    <Code2 className="w-3.5 h-3.5" /> Code
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="relative min-h-[500px] bg-black/40">
                {activeTab === "preview" ? (
                  <div className="p-8 h-full flex flex-col items-center justify-center group">
                    <div className="w-full max-w-2xl bg-[#090909] rounded-2xl border border-white/10 shadow-lg overflow-hidden animate-pulse-slow">
                        {/* Mock Navbar */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded bg-brand-purple" />
                             <div className="w-20 h-4 bg-white/10 rounded" />
                           </div>
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-3 bg-white/5 rounded" />
                             <div className="w-12 h-3 bg-white/5 rounded" />
                             <div className="w-16 h-6 bg-white rounded-full" />
                           </div>
                        </div>
                        {/* Mock Hero */}
                        <div className="p-12 flex flex-col items-center gap-6">
                           <div className="w-full h-8 bg-white/10 rounded-lg" />
                           <div className="w-3/4 h-8 bg-white/10 rounded-lg" />
                           <div className="w-1/2 h-4 bg-white/5 rounded-lg mt-4" />
                           <div className="flex gap-4 mt-8">
                             <div className="w-32 h-10 bg-brand-purple rounded-full" />
                             <div className="w-32 h-10 bg-white/5 rounded-full border border-white/10" />
                           </div>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 h-full font-mono text-sm overflow-x-auto">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-white/30 lowercase">TypeScript / React</span>
                        <button 
                          onClick={handleCopy}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                        </button>
                    </div>
                    <pre className="text-white/80">
                      <code>{codeSnippet}</code>
                    </pre>
                  </div>
                )}
                
                {/* Viewport controls only for preview */}
                {activeTab === "preview" && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full glass border border-white/20">
                      <Monitor className="w-4 h-4 text-brand-purple" />
                      <Tablet className="w-4 h-4 text-white/40" />
                      <Smartphone className="w-4 h-4 text-white/40" />
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
