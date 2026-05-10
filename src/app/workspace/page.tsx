
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { intuitionBuilderGuidance } from '@/ai/flows/intuition-builder-guidance';
import { simulateVivaInterview } from '@/ai/flows/viva-interview-simulation-flow';
import { 
  Send, 
  Terminal, 
  Lightbulb, 
  ArrowLeft, 
  Play, 
  Code2,
  Settings,
  MoreVertical,
  HelpCircle,
  Cpu,
  CheckCircle,
  FileCode,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<'intuition' | 'viva'>('intuition');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedSteps, setSuggestedSteps] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = localStorage.getItem('currentSession');
    if (!data) {
      router.push('/solve');
      return;
    }
    const parsed = JSON.parse(data);
    setSessionData(parsed);
    
    const initialPrompt = async () => {
      setLoading(true);
      try {
        const result = await intuitionBuilderGuidance({
          problemStatement: parsed.problemStatement,
          userCurrentSolutionOrThoughts: "I'm just starting to think about the problem.",
          conversationHistory: []
        });
        setChatMessages([{ role: 'model', content: result.guidanceMessage }]);
        setSuggestedSteps(result.suggestedNextSteps);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initialPrompt();
  }, [router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [...chatMessages, { role: 'user', content: textToSend }];
    setChatMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      if (mode === 'intuition') {
        const result = await intuitionBuilderGuidance({
          problemStatement: sessionData.problemStatement,
          userCurrentSolutionOrThoughts: textToSend + "\nCurrent Code Context:\n" + code,
          conversationHistory: newMessages.map(m => ({ role: m.role as any, content: m.content }))
        });
        setChatMessages(prev => [...prev, { role: 'model', content: result.guidanceMessage }]);
        setSuggestedSteps(result.suggestedNextSteps);
      } else {
        const result = await simulateVivaInterview({
          problemStatement: sessionData.problemStatement,
          previousAiAnalysis: sessionData.analysis,
          latestUserAnswer: textToSend,
          conversationHistory: newMessages.map(m => ({ role: m.role as any, message: m.content }))
        });
        setChatMessages(prev => [...prev, { role: 'model', content: result.question, hint: result.hint }]);
        setSuggestedSteps(["Explain my logic", "Give me a hint", "Consider optimizations"]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionData) return null;

  return (
    <div className="h-screen pt-16 bg-[#080809] overflow-hidden flex flex-col font-body">
      {/* Workspace Sub-Header */}
      <div className="h-12 px-6 bg-[#0C0C0E] border-b border-white/[0.05] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Exit
          </Link>
          <div className="h-4 w-px bg-white/[0.08]" />
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Solution.java</span>
            <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.05]">{sessionData.analysis.difficulty}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5"><Settings className="w-4 h-4 text-muted-foreground" /></Button>
           <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Problem Definition */}
        <aside className="w-80 h-full border-r border-white/[0.05] bg-[#0C0C0E] flex flex-col shrink-0">
          <ScrollArea className="flex-1">
            <div className="p-8 space-y-10">
              <div>
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  <Terminal className="w-4 h-4 text-primary" /> The Problem
                </div>
                <div className="text-sm leading-relaxed text-white/80 font-medium">
                  {sessionData.problemStatement}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  <Lightbulb className="w-4 h-4 text-accent" /> Pattern Logic
                </div>
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] space-y-4">
                  <div>
                    <div className="text-[9px] text-accent font-bold mb-1 tracking-widest uppercase opacity-60">Detected Pattern</div>
                    <div className="text-sm font-bold text-white">{sessionData.analysis.pattern}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-primary font-bold mb-1 tracking-widest uppercase opacity-60">Mentor Goal</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      Focus on mapping the constraints to a {sessionData.analysis.pattern} strategy.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={() => router.push('/report')} 
                  className="w-full bg-white text-black font-bold h-11 rounded-xl shadow-xl shadow-white/5 hover:bg-white/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Finish Session
                </Button>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Editor Area */}
        <div className="flex-1 h-full flex flex-col bg-[#080809]">
          <div className="h-11 px-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Code Editor</span>
              <div className="h-3 w-px bg-white/[0.08]" />
              <span className="text-[10px] font-code text-primary">JAVA 21</span>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold text-muted-foreground hover:text-white uppercase tracking-widest">Debug</Button>
              <Button size="sm" className="h-8 px-6 bg-[#1A1A1E] text-white border border-white/[0.08] font-bold text-[10px] hover:bg-white/[0.05] uppercase tracking-widest rounded-lg">
                <Play className="w-3.5 h-3.5 mr-2 text-green-500" /> Run Tests
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              className="w-full h-full bg-transparent p-10 font-code text-sm outline-none resize-none text-white/90 selection:bg-primary/30 leading-relaxed"
              placeholder="// Start implementing your intuition-based solution here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        {/* AI Buddy Area */}
        <aside className="w-96 h-full border-l border-white/[0.05] bg-[#0C0C0E] flex flex-col shrink-0 shadow-2xl">
          <div className="h-14 border-b border-white/[0.05] px-5 flex items-center justify-between">
            <div className="flex bg-[#161618] p-1 rounded-xl border border-white/[0.05]">
              <button 
                onClick={() => setMode('intuition')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${mode === 'intuition' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'}`}
              >
                Guide
              </button>
              <button 
                onClick={() => setMode('viva')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${mode === 'viva' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'}`}
              >
                Viva
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-accent animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{loading ? 'Thinking' : 'Online'}</span>
            </div>
          </div>

          <ScrollArea ref={scrollRef} className="flex-1 p-6">
            <div className="space-y-8">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ${msg.role === 'user' ? 'text-muted-foreground' : 'text-primary flex items-center gap-1.5'}`}>
                    {msg.role === 'user' ? 'You' : <><Sparkles className="w-3 h-3" /> IntuiCode Mentor</>}
                  </div>
                  <div className={`max-w-[95%] p-5 rounded-2xl text-xs leading-relaxed border ${
                    msg.role === 'user' 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-white/[0.02] border-white/[0.05] text-white/90'
                  }`}>
                    {msg.content}
                    {msg.hint && (
                      <div className="mt-4 pt-4 border-t border-white/[0.05] text-[10px] italic text-accent opacity-90 flex gap-2">
                        <Lightbulb className="w-3 h-3 shrink-0" />
                        <span>HINT: {msg.hint}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex flex-col items-start">
                  <div className="text-[10px] font-bold mb-2 uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Mentor is thinking
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-white/[0.05] bg-[#080809]">
            <div className="flex flex-wrap gap-2 mb-6">
              {suggestedSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(step)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[9px] font-bold text-muted-foreground hover:text-white hover:border-primary transition-all uppercase tracking-widest"
                >
                  {step}
                </button>
              ))}
            </div>
            <div className="relative">
              <input 
                placeholder="Ask for guidance..."
                className="w-full bg-[#161618] border border-white/[0.08] rounded-xl px-5 py-3 text-xs text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-all pr-12 shadow-2xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors p-1"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
