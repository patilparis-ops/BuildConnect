import { motion } from "framer-motion";

export function IsometricConstruction() {
  return (
    <div className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-500/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-secondary-500/10 rounded-full blur-[60px] -z-10" />

      {/* Isometric Projection Container */}
      <div 
        className="relative scale-90 sm:scale-100 transition-transform duration-300"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(55deg) rotateZ(-45deg)",
        }}
      >
        {/* Blueprint Grid Base */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-80 h-80 border-2 border-brand-500/30 bg-slate-950/20 backdrop-blur-xs rounded-xl shadow-2xl"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(59,130,246,0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Blueprint grid lines and dimensions */}
          <div className="absolute inset-0 border border-brand-500/20 m-4 pointer-events-none" />
          <div className="absolute inset-0 border border-dashed border-slate-700/40 m-8 pointer-events-none" />
          
          {/* Dimension Texts */}
          <div 
            className="absolute top-1 left-4 text-[10px] font-mono text-brand-400 select-none"
            style={{ transform: "rotateZ(0deg) translateZ(1px)" }}
          >
            L: 12.4m
          </div>
          <div 
            className="absolute bottom-4 right-1 text-[10px] font-mono text-brand-400 select-none"
            style={{ transform: "rotateZ(90deg) translateZ(1px)" }}
          >
            W: 8.5m
          </div>

          {/* Construction/Structure 1: Brand Blue Building block */}
          <IsometricCube 
            size={{ x: 60, y: 60, z: 90 }} 
            position={{ x: 40, y: 40, z: 0 }} 
            color="bg-brand-600"
            delay={0.2}
          />

          {/* Construction/Structure 2: Construction Orange block */}
          <IsometricCube 
            size={{ x: 40, y: 40, z: 120 }} 
            position={{ x: 140, y: 40, z: 0 }} 
            color="bg-secondary-500"
            delay={0.4}
          />

          {/* Construction/Structure 3: Success Green block */}
          <IsometricCube 
            size={{ x: 50, y: 50, z: 50 }} 
            position={{ x: 40, y: 160, z: 0 }} 
            color="bg-success-600"
            delay={0.6}
          />

          {/* Transparent Glass Structure to mimic architecture */}
          <IsometricCube 
            size={{ x: 80, y: 80, z: 40 }} 
            position={{ x: 120, y: 120, z: 0 }} 
            color="bg-slate-500/20 backdrop-blur-xs border border-white/20"
            delay={0.8}
            isGlass
          />

          {/* Floating Element: 2D HUD Panel floating above the structure */}
          <motion.div
            initial={{ opacity: 0, z: 50 }}
            animate={{ opacity: 1, z: 180 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-lg shadow-xl flex items-center gap-3 backdrop-blur-sm pointer-events-none"
            style={{
              left: 30,
              top: 30,
              width: 180,
              transform: "translateZ(180px) rotateZ(0deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white truncate">BuildConnect Core</p>
              <p className="text-[8px] text-slate-400 truncate">Verifying Contractors...</p>
            </div>
          </motion.div>

          {/* Floating badge 2: Orange Project Alert */}
          <motion.div
            initial={{ opacity: 0, z: 20 }}
            animate={{ opacity: 1, z: 140 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bg-slate-900/95 border border-slate-700/60 p-2.5 rounded-lg shadow-xl text-left pointer-events-none"
            style={{
              left: 170,
              top: 170,
              width: 140,
              transform: "translateZ(140px) rotateZ(0deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <span className="text-[8px] font-semibold text-secondary-400 uppercase tracking-wider">Active Bid</span>
            <p className="text-[10px] font-bold text-white mt-0.5">Rs. 4,20,000</p>
            <p className="text-[8px] text-slate-400 mt-1">Interior Renovations</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

interface CubeProps {
  size: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  color: string;
  delay?: number;
  isGlass?: boolean;
}

function IsometricCube({ size, position, color, delay = 0, isGlass = false }: CubeProps) {
  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
        width: size.x,
        height: size.y,
        transform: `translateZ(${position.z}px)`,
        transformStyle: "preserve-3d",
        originY: 1,
      }}
    >
      {/* Cube Container */}
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        
        {/* Right Face */}
        <div 
          className={`absolute ${color} brightness-75`}
          style={{
            width: size.z,
            height: size.y,
            left: size.x,
            top: 0,
            transform: "rotateY(90deg)",
            transformOrigin: "left",
          }}
        />

        {/* Left Face */}
        <div 
          className={`absolute ${color} brightness-50`}
          style={{
            width: size.x,
            height: size.z,
            left: 0,
            top: size.y,
            transform: "rotateX(-90deg)",
            transformOrigin: "top",
          }}
        />

        {/* Top Face */}
        <div 
          className={`absolute inset-0 ${color} ${!isGlass && 'brightness-100'}`}
          style={{
            transform: `translateZ(${size.z}px)`,
          }}
        />
      </div>
    </motion.div>
  );
}
