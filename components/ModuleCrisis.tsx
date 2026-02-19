
import React, { useState } from 'react';
import * as GS from '../services/geminiService';
import { CrisisAnalysis, EscalationResult, RootCauseResult } from '../types';
import PromptLabLayout from './PromptLabLayout';
import PromptTheorySection from './PromptTheorySection';

const ModuleCrisis: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'shield' | 'heatmap' | 'root'>('shield');
  const [viewMode, setViewMode] = useState<'theory' | 'lab'>('theory');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [crisis, setCrisis] = useState<CrisisAnalysis | null>(null);
  const [heatmap, setHeatmap] = useState<EscalationResult | null>(null);
  const [root, setRoot] = useState<RootCauseResult | null>(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      if (activeTool === 'shield') setCrisis(await GS.generateCrisisShield(input));
      else if (activeTool === 'heatmap') setHeatmap(await GS.detectEscalation(input));
      else if (activeTool === 'root') setRoot(await GS.analyzeRootCause(input));
    } finally {
      setLoading(false);
    }
  };

  const getToolData = () => {
    switch(activeTool) {
      case 'shield': return {
        title: "The De-escalation Shield",
        icon: "🛡️",
        roleDescription: "A Conflict Resolution Specialist trained in hostile client management and high-stakes negotiation.",
        lesson: "When handling anger, use the 'Analyze before Acting' pattern. It forces the AI to process the emotion before generating words.",
        role: "Crisis Communications & Conflict Resolution Specialist",
        task: "Phase 1: Identify why the user is angry. Phase 2: Write a response that affirms their feelings without admitting legal liability.",
        taskAnatomy: {
          verb: "Analyze",
          instruction: "Identify triggers + affirmation draft",
          constraints: "Preserve facts + Avoid liability",
          whyItWorks: "Forces 'Chain of Thought' reasoning which prevents shallow, generic apologies."
        },
        examplePrompts: [
          "Phase 1: Map the emotional triggers. Phase 2: Draft a de-escalation response that is firm but empathetic.",
          "Analyze the hidden needs in this complaint. Respond by addressing the core issue first, then the emotion.",
          "Act as a Crisis Specialist. Draft a response that lowers the emotional temperature by 50% without giving a refund yet."
        ],
        workplaceBenefit: "Turn hostile threads into productive outcomes. This prompt helps you 'stay cool' when the customer is 'running hot' by using AI as a cognitive filter for your own frustration.",
        format: "JSON: { psychologicalInsights: string[], responseDraft: string }",
        tip: "By separating 'Analysis' from 'Response', you ensure the final draft is grounded in logic, not just reaction.",
        strategy: "Use this for 'Karen' emails. It helps you stay professional when your instinct is to be defensive."
      };
      case 'heatmap': return {
        title: "The Risk Heatmap",
        icon: "🔥",
        roleDescription: "A Corporate Risk Auditor trained to spot litigation threats and passive-aggressive patterns early.",
        lesson: "Use 'Linguistic Pattern Matching' to hunt for red-flag phrases that signal a move from 'upset' to 'legal threat'.",
        role: "Corporate Risk Auditor & Litigation Specialist",
        task: "Assign a risk level (Low, Med, High). Identify specific red-flag sentences that indicate the situation is worsening.",
        taskAnatomy: {
          verb: "Audit",
          instruction: "Classify risk + Pinpoint triggers",
          constraints: "Legal risk focus + Actionable advice",
          whyItWorks: "Categorization prompts help standardize how your team handles complaints across the board."
        },
        examplePrompts: [
          "Audit this text for litigation risk. Identify every sentence that sounds like a legal threat.",
          "Classify the escalation risk of this thread. Provide advice for a junior manager on how to respond.",
          "Identify passive-aggressive linguistic markers and score the escalation potential."
        ],
        workplaceBenefit: "Standardize your support team's crisis management. Use this to automatically flag high-risk emails for management review before they blow up on social media or in court.",
        format: "JSON: { riskLevel, triggers, advice }",
        tip: "Linguistic markers are the 'early warning system' for your business reputation.",
        strategy: "Integrate this into your CRM. If the AI scores a 'High' risk, immediately BCC your legal or PR team."
      };
      case 'root': return {
        title: "The Root Cause Analyst",
        icon: "🪵",
        roleDescription: "A Lean Process Expert who looks past the drama to fix the machine behind the mistake.",
        lesson: "Ignore the emotion entirely. Use 'Systems Extraction' to find out what actually broke in your business workflow.",
        role: "Operations Consultant & Lean Process Expert",
        task: "Ignore the anger. Identify the broken business process that led to this email. Propose one structural fix.",
        taskAnatomy: {
          verb: "Isolate",
          instruction: "System failure identification + Process fix",
          constraints: "No emotional content + 1 Structural recommendation",
          whyItWorks: "Instructional 'Filtering' removes noise and forces the model into 'Consultant Mode'."
        },
        examplePrompts: [
          "Ignore the client's tone. Identify the specific operational failure that caused this complaint.",
          "Extract the business logic failure from this thread. Suggest a process change to prevent recurrence.",
          "Act as an Ops Consultant. Analyze this complaint to find the bottleneck in our communication funnel."
        ],
        workplaceBenefit: "Stop fixing people, start fixing processes. This prompt ensures that every customer complaint becomes a 'Lesson Learned' that improves your business efficiency for everyone.",
        format: "JSON: { causes, structuralFix }",
        tip: "Instructions like 'Ignore the anger' are known as Attention Guidance prompts.",
        strategy: "Use this during your weekly 'Operations Review'. It's the most objective way to analyze your team's failures."
      };
    }
  };

  const data = getToolData();

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'shield', label: 'De-escalation Shield', icon: '🛡️' },
          { id: 'heatmap', label: 'Risk Heatmap', icon: '🔥' },
          { id: 'root', label: 'Root Cause', icon: '🪵' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTool(t.id as any); setViewMode('theory'); setCrisis(null); setHeatmap(null); setRoot(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTool === t.id ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
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
          examplePrompts={data.examplePrompts}
          workplaceBenefit={data.workplaceBenefit}
          onLaunchLab={() => setViewMode('lab')}
        />
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <button 
            onClick={() => setViewMode('theory')}
            className="mb-4 text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 uppercase tracking-widest"
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
                className="w-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-rose-500"
                placeholder="Paste the angry/crisis text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            }
            output={
              <div className="space-y-6">
                {activeTool === 'shield' && crisis && (
                  <div className="space-y-6">
                     <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h5 className="text-[10px] font-bold text-rose-300 uppercase mb-2">Psychological Map</h5>
                        <ul className="text-xs space-y-2 text-slate-300">
                          {crisis.psychologicalInsights.map((ins, i) => <li key={i}>• {ins}</li>)}
                        </ul>
                     </div>
                     <div className="bg-white p-6 rounded-2xl text-slate-800 text-sm whitespace-pre-wrap leading-relaxed border-l-4 border-rose-500 italic">
                        {crisis.responseDraft}
                     </div>
                  </div>
                )}
                {activeTool === 'heatmap' && heatmap && (
                  <div className="space-y-6">
                     <div className={`p-6 rounded-2xl text-center border-2 ${heatmap.riskLevel === 'High' ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-blue-500 bg-blue-500/10 text-blue-500'}`}>
                        <p className="text-[10px] uppercase font-bold">Escalation Threat</p>
                        <p className="text-4xl font-black">{heatmap.riskLevel}</p>
                     </div>
                     <div className="space-y-2">
                        <h5 className="text-[10px] text-slate-500 uppercase font-bold">Linguistic triggers</h5>
                        <div className="flex flex-wrap gap-2">
                           {heatmap.triggers.map((t, i) => <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-[10px] border border-white/10">{t}</span>)}
                        </div>
                     </div>
                  </div>
                )}
                {activeTool === 'root' && root && (
                  <div className="space-y-6">
                     <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Systemic Failures</h5>
                        <ul className="text-xs space-y-2 text-slate-300">
                          {root.causes.map((c, i) => <li key={i}>• {c}</li>)}
                        </ul>
                     </div>
                     <div className="p-6 bg-emerald-600 rounded-2xl shadow-xl">
                        <h5 className="text-[10px] font-bold text-emerald-200 uppercase mb-2">Operational Recommendation</h5>
                        <p className="text-sm font-bold text-white">{root.structuralFix}</p>
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

export default ModuleCrisis;
