
import React, { useState } from 'react';
import * as GS from '../services/geminiService';
import { ToneAnalysis, RewriteResult, ClarityResult } from '../types';
import PromptLabLayout from './PromptLabLayout';
import PromptTheorySection from './PromptTheorySection';

const ModuleTone: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'analyze' | 'empathy' | 'clarity'>('analyze');
  const [viewMode, setViewMode] = useState<'theory' | 'lab'>('theory');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState<ToneAnalysis | null>(null);
  const [rewritten, setRewritten] = useState<RewriteResult | null>(null);
  const [clarity, setClarity] = useState<ClarityResult | null>(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      if (activeTool === 'analyze') setAnalysis(await GS.analyzeTone(input));
      else if (activeTool === 'empathy') setRewritten(await GS.rewriteForEmpathy(input));
      else if (activeTool === 'clarity') setClarity(await GS.checkClarity(input));
    } finally {
      setLoading(false);
    }
  };

  const getToolData = () => {
    switch(activeTool) {
      case 'analyze': return {
        title: "The Communications Auditor",
        icon: "📊",
        roleDescription: "A Linguistic Psychologist who measures the impact of written words on corporate relationships.",
        lesson: "To measure tone, use 'Quantify'. This forces the AI to output a hard metric (0-100), making communication performance visible.",
        role: "Linguistic Psychologist & Communications Auditor",
        task: "Score the following text on 2 dimensions (0-100): Warmth and Professionalism. Provide 1 actionable fix.",
        taskAnatomy: {
          verb: "Score",
          instruction: "Quantify Warmth + Professionalism",
          constraints: "0-100 Range + 1 Actionable fix",
          whyItWorks: "'Score' stops the AI from being 'nice' and forces it to act as a cold measurement device."
        },
        examplePrompts: [
          "Score the following text on 2 dimensions (0-100): Warmth and Professionalism. Provide 1 actionable fix.",
          "As a Communications Auditor, evaluate this email draft for passive-aggression. Assign a score for 'Empathy'.",
          "Identify the tone of this message and provide a numerical score for how 'Encouraging' it sounds to a direct report."
        ],
        workplaceBenefit: "Before hitting send on a message to your boss, this lab tells you if you sound passive-aggressive. It's like having a 'vibe check' for your career.",
        format: "JSON: { warmth: number, professionalism: number, improvement: string }",
        tip: "Providing 'Dimensions' (X vs Y) is the best way to get a balanced AI critique.",
        strategy: "Keep your professionalism above 80% and warmth above 40% for any internal Slack messages to senior leadership."
      };
      case 'empathy': return {
        title: "The Humanizer",
        icon: "❤️",
        roleDescription: "A specialist in high-empathy communication who understands how to soften corporate bluntness.",
        lesson: "To change a vibe, use the verb 'Infuse'. It signals the model to keep the skeleton of the facts but wrap them in new emotional skin.",
        role: "High-Empathy Communication Coach & Human-Centered Writer",
        task: "Infuse the message with warmth and understanding. Acknowledge the recipient's likely feelings without over-apologizing.",
        taskAnatomy: {
          verb: "Infuse",
          instruction: "Add warmth + Understanding",
          constraints: "Preserve facts + No over-apologizing",
          whyItWorks: "'Infuse' maintains the core business facts while modifying the linguistic 'texture'."
        },
        examplePrompts: [
          "Infuse the message with warmth and understanding. Acknowledge the recipient's likely feelings without over-apologizing.",
          "Rewrite this project update to sound more supportive and human-centric. Do not change the timeline data.",
          "Add emotional warmth to this rejection email while maintaining clear professional boundaries."
        ],
        workplaceBenefit: "Turn cold project updates into collaborative messages. This specific prompt avoids 'over-apologizing'—a key trait of successful executives who take ownership without looking weak.",
        format: "JSON: { output: string }",
        tip: "Avoid 'Make it nicer'. Use 'Infuse with empathy'. The word 'Empathy' triggers a much higher quality of linguistic output.",
        strategy: "Use this when you have to miss a deadline. It ensures you sound like a human who cares, not a robot making excuses."
      };
      case 'clarity': return {
        title: "The Jargon Detox",
        icon: "🔍",
        roleDescription: "A Plain Language Consultant focused on radical clarity and internal team alignment.",
        lesson: "Clarity prompts require a 'Comparative Constraint'. We use 'Identify and Replace' to ensure we see exactly what was fixed.",
        role: "Professional Editor & Plain Language Consultant",
        task: "Identify words that a 12-year-old wouldn't understand. Replace them with simpler alternatives. Score readability.",
        taskAnatomy: {
          verb: "Identify",
          instruction: "Spot jargon + Provide Simpler versions",
          constraints: "12-year-old level + Readability score",
          whyItWorks: "'Identify' turns the prompt into a two-step logic gate: find then fix."
        },
        examplePrompts: [
          "Identify words that a 12-year-old wouldn't understand. Replace them with simpler alternatives. Score readability.",
          "Strip all technical jargon from this email and rewrite it for a general audience. Provide a list of changes made.",
          "Analyze this memo for 'Business Speak' and simplify it so a new hire can understand it instantly."
        ],
        workplaceBenefit: "Stop confusing your team with 'synergy' and 'bandwidth'. This lab translates corporate-speak into actual work, reducing errors caused by misinterpretation of complex instructions.",
        format: "JSON: { jargonFound: Array<{original, simpler}>, readabilityScore: number }",
        tip: "Using an age constraint (like 12-year-old) is the gold standard for simple workplace communication.",
        strategy: "Apply this to your company's internal onboarding documents to ensure new hires actually understand their roles."
      };
    }
  };

  const data = getToolData();

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'analyze', label: 'Comm Auditor', icon: '📊' },
          { id: 'empathy', label: 'The Humanizer', icon: '❤️' },
          { id: 'clarity', label: 'Jargon Detox', icon: '🔍' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTool(t.id as any); setViewMode('theory'); setAnalysis(null); setRewritten(null); setClarity(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTool === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {viewMode === 'theory' ? (
        <PromptTheorySection 
          title={data.title}
          icon={data.icon}
          roleDescription={data.roleDescription}
          taskAnatomy={data.taskAnatomy}
          workplaceBenefit={data.workplaceBenefit}
          examplePrompts={data.examplePrompts}
          onLaunchLab={() => setViewMode('lab')}
        />
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <button 
            onClick={() => setViewMode('theory')}
            className="mb-4 text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-widest"
          >
            ← Back to Theory
          </button>
          <PromptLabLayout
            title={data.title}
            lesson={data.lesson}
            role={data.role}
            task={data.task}
            taskAnatomy={data.taskAnatomy}
            format={data.format}
            frameworkTip={data.tip}
            workplaceStrategy={data.strategy}
            onRun={handleRun}
            loading={loading}
            canRun={!!input}
            contextInput={
              <textarea
                className="w-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste your workplace text here to test the audit..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            }
            output={
              <div className="space-y-6">
                {activeTool === 'analyze' && analysis && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Warmth Score</p>
                          <p className="text-4xl font-black text-orange-400">{analysis.warmth}%</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Prof. Score</p>
                          <p className="text-4xl font-black text-blue-400">{analysis.professionalism}%</p>
                       </div>
                     </div>
                     <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl">
                        <h5 className="text-[10px] font-bold text-indigo-300 uppercase mb-2">Audit Critique</h5>
                        <p className="text-sm italic text-indigo-50">"{analysis.improvement}"</p>
                     </div>
                  </div>
                )}
                {activeTool === 'empathy' && rewritten && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-sm leading-relaxed whitespace-pre-wrap">
                    {rewritten.output}
                  </div>
                )}
                {activeTool === 'clarity' && clarity && (
                  <div className="space-y-6">
                     <div className="p-4 bg-blue-600/20 rounded-2xl text-center">
                        <p className="text-[10px] text-blue-300 uppercase font-bold">Readability Grade</p>
                        <p className="text-4xl font-black">{clarity.readabilityScore}</p>
                     </div>
                     <div className="space-y-2">
                        <h5 className="text-[10px] text-slate-500 uppercase font-bold">Jargon translation</h5>
                        {clarity.jargonFound.map((j, i) => (
                          <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                            <span className="text-rose-400 line-through text-xs font-mono">{j.original}</span>
                            <span className="text-emerald-400 font-bold text-sm">→ {j.simpler}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ModuleTone;
