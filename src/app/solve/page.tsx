
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { dsaProblemAnalysis, DsaProblemAnalysisOutput } from '@/ai/flows/dsa-problem-analysis-flow';
import { 
  Upload, 
  Link as LinkIcon, 
  Terminal, 
  AlertCircle, 
  ChevronRight, 
  Cpu,
  Brain,
  Zap,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SolvePage() {
  const [problemText, setProblemText] = useState("");
  const [problemUrl, setProblemUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DsaProblemAnalysisOutput | null>(null);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!problemText && !problemUrl) return;
    setLoading(true);
    try {
      const result = await dsaProblemAnalysis({
        problemStatement: problemText,
        problemUrl: problemUrl
      });
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startPractice = () => {
    // Save session data to local storage for the workspace
    if (analysis) {
      localStorage.setItem('currentSession', JSON.stringify({
        analysis,
        problemStatement: problemText || "LeetCode Problem",
      }));
      router.push('/workspace');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Navbar />
      
      <main className="container max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">Master a Problem</h1>
          <p className="text-muted-foreground text-lg">Paste a problem statement or link. We'll decompose it for you.</p>
        </motion.div>

        {!analysis ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-2 gap-12"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" /> Problem Statement
                </label>
                <Textarea 
                  placeholder="Paste the full problem description here..."
                  className="min-h-[300px] glass border-white/10 resize-none p-6 text-lg"
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-accent" /> Or paste LeetCode URL
                </label>
                <Input 
                  placeholder="https://leetcode.com/problems/..." 
                  className="h-14 glass border-white/10"
                  value={problemUrl}
                  onChange={(e) => setProblemUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={loading || (!problemText && !problemUrl)}
                className="w-full h-16 text-lg bg-primary hover:bg-primary/80 neon-glow rounded-xl"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Decompose Pattern"}
              </Button>
            </div>

            <div className="hidden lg:flex flex-col justify-center gap-8">
              <div className="p-8 glass rounded-3xl border border-white/10">
                <Brain className="w-12 h-12 text-accent mb-6" />
                <h3 className="text-2xl font-bold mb-4">Deep Intuition Engine</h3>
                <p className="text-muted-foreground">Our AI detects the core coding pattern and explains exactly why it fits, helping you stop memorizing solutions and start identifying logic.</p>
              </div>
              <div className="p-8 glass rounded-3xl border border-white/10">
                <Zap className="w-12 h-12 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Interactive Learning</h3>
                <p className="text-muted-foreground">After analysis, jump into an immersive workspace where an AI mentor guides you through the implementation without giving away the answer.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-bold">
                      {analysis.pattern}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                      analysis.difficulty === 'Easy' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                      analysis.difficulty === 'Medium' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' :
                      'bg-red-500/10 border-red-500/30 text-red-500'
                    }`}>
                      {analysis.difficulty}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold">Initial Analysis</h2>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setAnalysis(null)} className="rounded-xl">Back</Button>
                  <Button onClick={startPractice} className="bg-primary hover:bg-primary/80 neon-glow rounded-xl">
                    Build Implementation <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass border-white/5 p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-accent" /> Why this pattern?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{analysis.whyPatternFits}</p>
                </Card>
                <Card className="glass border-white/5 p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-accent" /> Brute Force Thinking
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{analysis.bruteForceThinking}</p>
                </Card>
                <Card className="glass border-white/5 p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" /> Optimization Direction
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{analysis.optimizationHint}</p>
                </Card>
                <Card className="glass border-white/5 p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-accent" /> Edge Cases
                  </h3>
                  <ul className="space-y-2">
                    {analysis.edgeCases.map((edge, idx) => (
                      <li key={idx} className="flex gap-2 text-muted-foreground text-sm">
                        <span className="text-accent">•</span> {edge}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
