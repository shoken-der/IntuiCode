
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Cpu, Terminal, LayoutDashboard, Code2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();
  
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/solve", label: "Solve", icon: Terminal },
    { href: "/workspace", label: "Workspace", icon: Code2 },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-header px-6"
    >
      <div className="container mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-headline font-bold text-white tracking-tighter">
              IntuiCode
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button 
                    variant="ghost" 
                    className={`h-9 px-4 gap-2 text-sm transition-all rounded-md ${isActive ? 'bg-white/5 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'opacity-50'}`} />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" className="text-muted-foreground hover:text-white text-sm font-medium">
              Log in
            </Button>
          </Link>
          <Link href="/solve">
            <Button className="h-9 px-5 bg-white text-black font-bold hover:bg-white/90 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
