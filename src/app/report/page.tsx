
"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateFeedbackReport, FeedbackReportOutput } from '@/ai/flows/ai-feedback-report-generation';
import { 
  Trophy, 
  Target, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Download,
  Share2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<FeedbackReportOutput | null>(null);

  useEffect(() => {
    const generate = async () => {
      const resultsStr = localStorage.getItem('sessionResults');
      if (!resultsStr) {
        router.push('/dashboard');
        return;
      }
      const results = JSON.parse(resultsStr);
      try {
        const data = await generateFeedbackReport(results);
        setReport(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <h2 className="text-xl font-headline font-bold">Generating AI Feedback Report...</h2>
        <p className="text-muted-foreground">Analyzing your technical logic and communication clarity.</p>
      </div>
    );
  }

  if (!report) return null;

  const scoreStats = [
    { label: "Overall", score: report.overallScore, color: "text-accent", icon: <Trophy className="w-5 h-5" /> },
    { label: "Technical", score: report.technicalScore, color: "text-blue-400", icon: <Target className="w-5 h-5" /> },
    { label: "Communication", score: report.communicationScore, color: "text-green-400", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Optimization", score: report.optimizationScore, color: "text-yellow-400", icon: <Zap className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16"
        >
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Session Feedback</h1>
            <p className="text-muted-foreground">Comprehensive analysis of your problem-solving session.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 glass rounded-xl"><Download className="w-4 h-4" /> Export PDF</Button>
            <Button className="gap-2 bg-primary hover:bg-primary/80 neon-glow rounded-xl"><Share2 className="w-4 h-4" /> Share Results</Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {scoreStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass border-white/5 relative overflow-hidden">
                <CardContent className="pt-6 text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full border-2 border-white/5 flex items-center justify-center mb-4 ${stat.color} bg-white/5`}>
                    {stat.icon}
                  </div>
                  <div className={`text-4xl font-headline font-bold mb-1 ${stat.color}`}>{stat.score}%</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  {/* Subtle progress ring background */}
                  <div className="absolute -bottom-8 -right-8 opacity-5">
                    {stat.icon}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="glass border-white/5 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> Key Strengths
            </h3>
            <div className="space-y-4">
              {report.strengths.map((s, i) => (
                <div key={i} className="flex gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <p>{s}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass border-white/5 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Areas for Improvement
            </h3>
            <div className="space-y-4">
              {report.weaknesses.map((w, i) => (
                <div key={i} className="flex gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <p>{w}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="glass border-white/5 p-8 mb-12">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-accent" /> Improvement Roadmap
          </h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold mb-4 text-accent">Step-by-Step Actions</h4>
              <div className="space-y-6">
                {report.improvementRoadmap.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-accent font-bold text-xs border border-accent/20">
                      {i + 1}
                    </div>
                    <p className="text-muted-foreground text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Recommended Topics</h4>
              <div className="flex flex-wrap gap-3">
                {report.recommendedNextTopics.map((topic, i) => (
                  <div key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:border-accent/30 transition-all cursor-pointer">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="px-8 h-14 rounded-xl">Back to Dashboard</Button>
          </Link>
          <Link href="/solve">
            <Button className="px-8 h-14 bg-primary hover:bg-primary/80 neon-glow rounded-xl font-bold">
              Start Next Practice Session <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
