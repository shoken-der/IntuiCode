
"use client";

import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Target, 
  History, 
  Flame, 
  ChevronRight, 
  PlusCircle, 
  BarChart3,
  Brain,
  Code2,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    { label: "Completion", value: "84%", icon: <Target className="w-4 h-4 text-primary" />, trend: "+12%" },
    { label: "Daily Streak", value: "12 Days", icon: <Flame className="w-4 h-4 text-orange-400" />, trend: "Record!" },
    { label: "Avg Score", value: "78.4", icon: <Brain className="w-4 h-4 text-accent" />, trend: "+5.2" },
    { label: "XP Earned", value: "2.4k", icon: <Zap className="w-4 h-4 text-yellow-400" />, trend: "+450" }
  ];

  const recentSessions = [
    { id: 1, title: "Trapping Rain Water", pattern: "Two Pointers", score: 92, date: "2h ago", status: "Perfect" },
    { id: 2, title: "Longest Substring...", pattern: "Sliding Window", score: 78, date: "1d ago", status: "Good" },
    { id: 3, title: "Course Schedule", pattern: "Graph BFS", score: 85, date: "2d ago", status: "Great" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 selection:bg-primary/20">
      <div className="fixed inset-0 grid-overlay opacity-[0.2] pointer-events-none" />
      <Navbar />
      
      <main className="container mx-auto px-6 max-w-7xl relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold tracking-tighter">Welcome back, Engineer</h1>
            <p className="text-muted-foreground text-lg">Continue building your intuition logic.</p>
          </div>
          <Link href="/solve">
            <Button className="bg-white text-black font-bold h-11 px-8 rounded-xl hover:bg-white/90 shadow-lg shadow-white/5 group">
              <PlusCircle className="mr-2 w-4 h-4" /> New Session
            </Button>
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="premium-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{stat.trend}</span>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-1">{stat.label}</div>
              <div className="text-2xl font-headline font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">Recent Sessions</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white text-xs">View All</Button>
              </div>
              <div className="premium-card divide-y divide-white/[0.05]">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-white leading-none">{session.score}</span>
                        <span className="text-[8px] text-muted-foreground uppercase mt-1">Score</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-primary transition-colors">{session.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{session.pattern}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{session.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        session.score > 90 ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                        session.score > 80 ? 'text-primary border-primary/20 bg-primary/5' :
                        'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'
                      }`}>
                        {session.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="premium-card p-8">
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Pattern Mastery</span>
                </div>
                <div className="space-y-6">
                  {[
                    { name: "Sliding Window", progress: 92 },
                    { name: "Dynamic Programming", progress: 45 },
                    { name: "Graphs / BFS", progress: 78 }
                  ].map((t, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-muted-foreground">{t.name}</span>
                        <span className="text-white">{t.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${t.progress}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`h-full ${t.progress < 50 ? 'bg-red-500/60' : 'bg-primary'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="premium-card p-8 bg-gradient-to-br from-primary/[0.03] to-transparent border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Tailored Mock</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  Start an interview session tailored specifically to your GitHub repositories and target company profile.
                </p>
                <Button className="w-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-xs h-10 rounded-xl">
                  Start Tailored Session
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="premium-card p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-2 border-white/[0.05] bg-background mb-8 relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                <span className="text-4xl font-headline font-bold text-white relative">84</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Readiness Score</h3>
              <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                You're performing better than <span className="text-white font-bold">82%</span> of candidates applying to FAANG.
              </p>
              <Button variant="outline" className="w-full border-white/[0.1] hover:bg-white/[0.05] text-xs h-10 rounded-xl">Analyze Breakdown</Button>
            </div>

            <div className="premium-card p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Quick Challenges</h3>
              <div className="space-y-3">
                {[
                  { label: "Daily Intuition", icon: <Brain className="w-3.5 h-3.5" /> },
                  { label: "Mock Behavioral", icon: <MessageSquareCode className="w-3.5 h-3.5" /> },
                  { label: "System Design", icon: <BarChart3 className="w-3.5 h-3.5" /> }
                ].map((action, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-start text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/[0.05] h-12 rounded-xl group px-4">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center mr-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      {action.icon}
                    </div>
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
