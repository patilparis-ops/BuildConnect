import { useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import { Menu, X, Frame, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/#pricing" },
    { name: "History", href: "/history" },
  ];

  const isDarkMode = true; // Always dark for this theme

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover:scale-110 transition-transform duration-500">
            <Frame className="text-white w-6 h-6 border-none" />
          </div>
          <span className="font-display font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-white/40">
            FrameForge
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-white/50 hover:text-white transition-all hover:translate-y-[-1px]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/workspace" className="text-sm font-bold text-white/80 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/workspace">
            <button className="px-6 py-3 rounded-2xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all flex items-center gap-2 group shadow-xl active:scale-95">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white/60 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 glass border-b border-white/5 py-8 px-6 flex flex-col gap-6 md:hidden bg-black/90 backdrop-blur-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-2xl font-bold text-white/70 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/5 my-2" />
            <div className="flex flex-col gap-4">
               <Link to="/workspace" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-lg font-bold text-white/40">
                  Login
               </Link>
               <Link to="/workspace" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-2xl bg-white text-black text-center font-bold text-lg">
                  Get Started
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
