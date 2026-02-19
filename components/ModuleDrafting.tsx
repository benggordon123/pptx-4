
import React, { useState } from 'react';
import * as GS from '../services/geminiService';
import { ReplyStance, SubjectLineResult, SummarizerResult, ReplyWizardResult } from '../types';
import PromptLabLayout from './PromptLabLayout';
import PromptTheorySection from './PromptTheorySection';

const ModuleDrafting: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'wizard' | 'subject' | 'summary'>('wizard');
  const [viewMode, setViewMode] = useState<'theory' | 'lab'>('theory');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [wizardRes, setWizardRes] = useState<ReplyWizardResult | null>(null);
  const [stance, setStance] = useState<ReplyStance>('Agree');
  const [subjects, setSubjects] = useState<SubjectLineResult | null>(null);
  const [summary, setSummary] = useState<SummarizerResult | null>(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      if (activeTool === 'wizard') setWizardRes(await GS.useReplyWizard(input, stance));
      else if (activeTool === 'subject') setSubjects(await GS.generateSubjectLines(input));
      else if (activeTool === 'summary') setSummary(await GS.summarizeEmail(input));
    } finally {
      setLoading(false);
    }
  };

  const getToolData = () => {
    switch(activeTool) {
      case 'wizard': return {
        title: "The Diplomacy Engine",
        icon: "🪄",
        roleDescription: "An Expert Relationship Manager who balances firm boundaries with professional warmth.",
        lesson: "Avoid using the verb 'Write'—it's too passive. 'Draft' tells the AI this is a high-stakes document that needs careful wording.",
        role: "Expert Professional Communicator & Relationship Manager",
        task: `Draft a professional reply with a stance of "${stance}". Priority: Maintain the relationship while being firm on our position.`,
        taskAnatomy: {
          verb: "Draft",
          instruction: "Professional response matching a specific stance",
          constraints: "Relationship priority + Firm position",
          whyItWorks: "'Draft' primes the AI to use more formal syntax compared to 'write'."
        },
        examplePrompts: [
          `Draft a professional reply with a stance of "Agree". Priority: Maintain the relationship while being firm on our position.`,
          `Act as an Expert Negotiator. Draft a response that declines the request but keeps the door open for future collaboration.`,
          `Compose a professional email draft that addresses the concerns raised while maintaining a stance of "Negotiate".`
        ],
        workplaceBenefit: "Using this specific anatomy allows you to say 'No' to a client while making them feel heard. It prevents the AI from being overly apologetic, which is the #1 mistake junior staff make in emails.",
        format: "Structured JSON: { reply: string }",
        tip: "When prompt engineering for email, always define the relationship priority. Is it a long-term client or a one-off vendor?",
        strategy: "Apply this logic to Slack or Teams when you need to redirect a project without hurting your colleague's feelings."
      };
      case 'subject': return {
        title: "Priority Signal Lab",
        icon: "🏷️",
        roleDescription: "A Direct Response Copywriter obsessed with human attention spans and click-through psychology.",
        lesson: "Generic subject tasks fail because they lack 'Variability'. We must force the AI to provide 5 distinct psychological hooks.",
        role: "Direct Response Marketing Copywriter & Email Strategist",
        task: "Generate 5 high-impact subject lines. Mix urgency, curiosity, and utility styles. Keep them under 50 characters.",
        taskAnatomy: {
          verb: "Generate",
          instruction: "5 High-impact subject lines",
          constraints: "Mix 3 styles + Under 50 chars",
          whyItWorks: "'Generate' combined with 'Styles' forces the AI to diverge its creative paths."
        },
        examplePrompts: [
          "Generate 5 high-impact subject lines. Mix urgency, curiosity, and utility styles. Keep them under 50 characters.",
          "As a senior marketing strategist, create 3 subject line options that trigger immediate curiosity.",
          "Identify the core value proposition of this email and generate a subject line that highlights it with urgency."
        ],
        workplaceBenefit: "Standard emails get lost. By using this prompt, you ensure your email stands out in a crowded executive inbox by leveraging 'Curiosity' hooks that humans are biologically wired to click.",
        format: "Structured JSON: { suggestions: string[] }",
        tip: "A good subject line prompt should always include a character limit. Executive screens cut off text after ~45 characters.",
        strategy: "Use the 'Utility' style for internal updates and 'Urgency' for deadline-sensitive requests."
      };
      case 'summary': return {
        title: "Noise Filter 9000",
        icon: "📋",
        roleDescription: "An Executive Chief of Staff who values time above all else and hates fluff.",
        lesson: "Summaries are often too long. The verb 'Extract' changes the AI's internal logic from 'generative' to 'analytical'.",
        role: "High-Level Executive Assistant",
        task: "Extract the core message (TL;DR) and exactly one MUST-DO action item. Ignore pleasantries.",
        taskAnatomy: {
          verb: "Extract",
          instruction: "Core message + Action Item",
          constraints: "Exactly one item + Ignore pleasantries",
          whyItWorks: "'Extract' focuses the model on entity identification, reducing hallucination."
        },
        examplePrompts: [
          "Extract the core message (TL;DR) and exactly one MUST-DO action item. Ignore pleasantries.",
          "Identify the single most important next step from this email thread. Be concise.",
          "Strip all the corporate fluff and extract only the factual updates and pending approvals."
        ],
        workplaceBenefit: "This prompt turns a 50-email chain into a single sentence. It's the ultimate tool for catching up after a holiday or staying productive in high-volume environments.",
        format: "Structured JSON: { summary: string, actionItem: string }",
        tip: "Adding 'Ignore pleasantries' is the pro way to skip 90% of the useless content in modern emails.",
        strategy: "Save this as a system prompt in your AI tool of choice. Every time you get a long thread, 'Extract' the truth."
      };
    }
  };

  const data = getToolData();

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'wizard', label: 'Diplomacy Engine', icon: '🪄' },
          { id: 'subject', label: 'Priority Signals', icon: '🏷️' },
          { id: 'summary', label: 'Noise Filter', icon: '📋' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTool(t.id as any); setViewMode('theory'); setWizardRes(null); setSubjects(null); setSummary(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTool === t.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
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
            className="mb-4 text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 uppercase tracking-widest"
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
              <div className="space-y-4">
                <textarea
                  className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste raw email content here to test the prompt..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                {activeTool === 'wizard' && (
                  <div className="grid grid-cols-3 gap-2">
                    {(['Agree', 'Decline', 'Negotiate'] as ReplyStance[]).map(s => (
                      <button 
                        key={s} 
                        onClick={() => setStance(s)}
                        className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${stance === s ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
            output={
              <div className="space-y-6">
                {activeTool === 'wizard' && wizardRes && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-sm leading-relaxed whitespace-pre-wrap italic">
                    {wizardRes.reply}
                  </div>
                )}
                {activeTool === 'subject' && subjects && (
                  <ul className="space-y-3">
                    {subjects.suggestions.map((s, i) => (
                      <li key={i} className="bg-white/10 p-4 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer group">
                        <span className="text-blue-400 mr-2">#{i+1}</span> {s}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTool === 'summary' && summary && (
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">TL;DR Summary</h5>
                      <p className="text-sm">{summary.summary}</p>
                    </div>
                    <div className="p-6 bg-amber-500/20 border border-amber-500/30 rounded-2xl">
                      <h5 className="text-[10px] font-bold text-amber-400 uppercase mb-2">Primary Action Item</h5>
                      <p className="text-lg font-bold text-amber-50">⚡ {summary.actionItem}</p>
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

export default ModuleDrafting;
