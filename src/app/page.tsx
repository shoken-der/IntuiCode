
"use client";

import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BrainCircuit, 
  MessageSquareCode, 
  Sparkles, 
  Terminal, 
  Code2,
  ChevronRight,
  MonitorSmartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-primary" />,
      title: "Intuition Logic",
      description: "Move beyond rote memorization. We teach you the high-level patterns that reveal solutions instantly."
    },
    {
      icon: <MessageSquareCode className="w-5 h-5 text-accent" />,
      title: "Simulated Viva",
      description: "Articulate your thoughts in a high-pressure interview environment with real-time feedback."
    },
    {
      icon: <Terminal className="w-5 h-5 text-white" />,
      title: "Pattern Detection",
      description: "Upload any problem and our AI engine decomposes complex constraints into solvable modules."
    }
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <div className="fixed inset-0 grid-overlay opacity-[0.4] pointer-events-none" />
      <div className="fixed inset-0 mesh-bg opacity-[0.8] pointer-events-none" />
      
      <Navbar />
      
      <main className="relative pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>The Future of Engineering Interviews</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-bold mb-8 leading-[0.95] tracking-tighter text-white">
                Engineering is <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Deep Logic.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Master the mental frameworks behind complex algorithms. Build deep intuition through guided reasoning and interactive AI coaching.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/solve">
                  <Button size="lg" className="h-14 px-10 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all shadow-xl shadow-white/10 group">
                    Start Your Session <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="h-14 px-10 bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] rounded-xl text-white font-semibold">
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Visual Teaser */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-24 w-full max-w-5xl"
            >
              <div className="premium-card p-1 bg-gradient-to-b from-white/[0.1] to-transparent">
                <div className="bg-[#080809] rounded-lg overflow-hidden border border-white/[0.05]">
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.05]">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <div className="text-[10px] font-code text-muted-foreground uppercase tracking-widest">viva_simulation.exe</div>
                    <div className="w-8" />
                  </div>
                  <div className="p-8 md:p-12 text-left space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center shrink-0">
                        <Code2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="text-sm font-bold text-white">Interviewer AI</div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          "I see you're using a Nested Loop for the two-sum problem. This yields O(n²) time complexity. Can you think of a data structure that could reduce this to O(n)?"
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-end">
                      <div className="space-y-2 flex-1 text-right">
                        <div className="text-sm font-bold text-white">You</div>
                        <p className="text-white/80 text-sm leading-relaxed italic bg-white/5 inline-block px-4 py-2 rounded-lg">
                          "A Hash Map? We could store the complement of each number..."
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 border-t border-white/[0.05]">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="premium-card p-8 group hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:border-primary/40 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-6 py-24">
          <div className="premium-card relative p-12 md:p-24 text-center group">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8">Ready to Level Up?</h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto">
                Join thousands of engineers who use IntuiCode to land roles at top-tier tech companies.
              </p>
              <Link href="/solve">
                <Button size="lg" className="h-16 px-12 bg-primary text-primary-foreground font-bold rounded-xl shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-transform">
                  Get Started for Free <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/[0.05] text-center">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
            © 2025 IntuiCode Labs. Built for Engineers.
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
