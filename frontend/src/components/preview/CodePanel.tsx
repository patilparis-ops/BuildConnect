import { useState } from "react";
import { Copy, Maximize2, Check, FileCode, Braces, Palette, Box } from "lucide-react";
import { cn } from "../../utils/cn";

export function CodePanel() {
  const [activeTab, setActiveTab] = useState<"react" | "components" | "tailwind" | "structure">("react");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    react: `import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}`,
    components: `export function Card({ title, description, icon }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all">
      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-white/40 text-sm">{description}</p>
    </div>
  );
}`,
    tailwind: `module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#8b5cf6",
          blue: "#3b82f6"
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  }
}`,
    structure: `src/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   └── Footer.tsx
├── pages/
│   └── Home.tsx
├── App.tsx
└── main.tsx`
  };

  return (
    <div className="h-[300px] border-t border-white/5 bg-[#050505] flex flex-col overflow-hidden relative z-30">
      {/* Tabs */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-black/40">
        <div className="flex gap-2 h-full">
          {[
            { id: "react", label: "App.tsx", icon: <FileCode className="w-3.5 h-3.5" /> },
            { id: "components", label: "Components", icon: <Box className="w-3.5 h-3.5" /> },
            { id: "tailwind", label: "Theme", icon: <Palette className="w-3.5 h-3.5" /> },
            { id: "structure", label: "Project", icon: <Braces className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 h-full text-[11px] font-bold transition-all relative border-b-2",
                activeTab === tab.id 
                  ? "text-brand-purple border-brand-purple bg-brand-purple/5" 
                  : "text-white/40 border-transparent hover:text-white hover:bg-white/5"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Code"}
          </button>
          <button className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-grow overflow-auto p-6 font-mono text-[12px] leading-relaxed custom-scrollbar">
        <pre className="text-white/80">
          <code className="block">
            {codeSnippets[activeTab]}
          </code>
        </pre>
      </div>
    </div>
  );
}
