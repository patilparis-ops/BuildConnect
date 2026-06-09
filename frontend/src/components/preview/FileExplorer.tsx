import { useState } from "react";
import { Folder, File, ChevronRight, ChevronDown, Search, FileCode, ImageIcon, Hash, Layout } from "lucide-react";
import { cn } from "../../utils/cn";

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  icon?: React.ReactNode;
  children?: FileNode[];
}

const mockFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Navbar.tsx", type: "file" },
          { name: "Hero.tsx", type: "file" },
          { name: "Footer.tsx", type: "file" },
        ]
      },
      {
        name: "pages",
        type: "folder",
        children: [
          { name: "Home.tsx", type: "file" },
          { name: "Dashboard.tsx", type: "file" },
        ]
      },
      { name: "App.tsx", type: "file" },
      { name: "index.css", type: "file" },
    ]
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "favicon.ico", type: "file" },
      { name: "logo.svg", type: "file" },
    ]
  },
  { name: "package.json", type: "file" },
  { name: "tailwind.config.js", type: "file" },
];

export function FileExplorer() {
  const [expanded, setExpanded] = useState<string[]>(["src", "src/components"]);
  const [selectedFile, setSelectedFile] = useState("src/components/Navbar.tsx");

  const toggleFolder = (path: string) => {
    setExpanded(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const renderNode = (node: FileNode, path: string = "") => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expanded.includes(currentPath);
    const isSelected = selectedFile === currentPath;

    if (node.type === "folder") {
      return (
        <div key={currentPath} className="select-none">
          <button 
            onClick={() => toggleFolder(currentPath)}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/[0.03] transition-colors text-white/50 hover:text-white"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <Folder className="w-4 h-4 text-brand-purple/60" />
            <span className="text-[13px] font-medium">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div className="pl-4 border-l border-white/5 ml-4 my-1">
              {node.children.map(child => renderNode(child, currentPath))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button 
        key={currentPath}
        onClick={() => setSelectedFile(currentPath)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-1.5 transition-all text-[13px]",
          isSelected ? "bg-brand-purple/10 text-brand-purple border-r-2 border-brand-purple" : "text-white/40 hover:bg-white/[0.03] hover:text-white"
        )}
      >
        <FileCode className={cn("w-4 h-4", isSelected ? "text-brand-purple" : "text-white/20")} />
        <span>{node.name}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 border-r border-white/5 bg-[#080808] flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Project Explorer</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input 
            type="text" 
            placeholder="Search files..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-[12px] focus:outline-none focus:border-brand-purple/30 transition-all placeholder:text-white/10"
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto py-2 custom-scrollbar">
        {mockFiles.map(node => renderNode(node))}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <h4 className="text-[9px] font-bold text-white/20 uppercase mb-3">Recent Files</h4>
        <div className="space-y-1">
           {["App.tsx", "Navbar.tsx", "Hero.tsx"].map(f => (
             <div key={f} className="flex items-center gap-2 text-[11px] text-white/40 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-white/5 transition-colors">
                <File className="w-3 h-3 opacity-30" />
                {f}
             </div>
           ))}
        </div>
      </div>
    </aside>
  );
}
