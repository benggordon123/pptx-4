
import React, { useState } from 'react';
import * as GS from '../services/geminiService';
import { MeetingExtraction, TaskExtraction, OOOResult } from '../types';
import PromptLabLayout from './PromptLabLayout';
import PromptTheorySection from './PromptTheorySection';

const ModuleAdmin: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'meeting' | 'tasks' | 'ooo'>('meeting');
  const [viewMode, setViewMode] = useState<'theory' | 'lab'>('theory');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [meeting, setMeeting] = useState<MeetingExtraction | null>(null);
  const [tasks, setTasks] = useState<TaskExtraction | null>(null);
  const [ooo, setOoo] = useState<OOOResult | null>(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      if (activeTool === 'meeting') setMeeting(await GS.scheduleMeeting(input));
      else if (activeTool === 'tasks') setTasks(await GS.extractTasks(input));
      else if (activeTool === 'ooo') setOoo(await GS.craftOOO(input));
    } finally {
      setLoading(false);
    }
  };

  const getToolData = () => {
    switch(activeTool) {
      case 'meeting': return {
        title: "The Scheduling Engine",
        icon: "🗓️",
        roleDescription: "An Ultra-Efficient Administrative Chief focused on data normalization and time optimization.",
        lesson: "Human scheduling talk is 'unstructured data'. Use the verb 'Normalize' or 'Parse' to transform it into structure.",
        role: "Ultra-Efficient Administrative Assistant & Scheduler",
        task: "Sift through the thread. Find all proposed dates/times. Create a clean list. Write a one-sentence confirmation.",
        taskAnatomy: {
          verb: "Parse",
          instruction: "Identify dates/times + confirmation summary",
          constraints: "Clean list format + One-sentence limit",
          whyItWorks: "'Parse' focuses the AI on identifying entities (dates) rather than interpreting the mood."
        },
        examplePrompts: [
          "Parse this thread and extract all proposed meeting times. Output as a bulleted list.",
          "Identify all scheduling conflicts in this chain. Suggest a single time that works for everyone.",
          "Normalize these messy calendar notes into a standard ISO format list."
        ],
        workplaceBenefit: "Eliminate the 'When works for you?' dance. This prompt extracts the facts from a 10-email thread, allowing you to book the meeting in seconds instead of minutes of re-reading.",
        format: "JSON: { proposedSlots: string[], confirmationMessage: string }",
        tip: "Combining 'Identify' with 'Confirmation' gives you the data AND the response in one go.",
        strategy: "Use this when you get back from vacation to quickly clear all the 'Let's meet' emails in one pass."
      };
      case 'tasks': return {
        title: "The Task Extractor",
        icon: "✅",
        roleDescription: "A Project Manager obsessed with 'Actionable Items' and clear team accountability.",
        lesson: "To word a project task, use 'Extract and Rank'. It forces the AI to evaluate importance, not just list keywords.",
        role: "Project Manager & Productivity Specialist",
        task: "Identify every action item. Categorize them by priority (High, Med, Low). Ensure the output is concise.",
        taskAnatomy: {
          verb: "Extract",
          instruction: "Action items + Priority levels",
          constraints: "Concise items + Tri-level priority",
          whyItWorks: "'Rank' or 'Prioritize' triggers the AI's logical evaluation of project impact."
        },
        examplePrompts: [
          "Extract every actionable task from this meeting transcript. Rank by High/Med/Low priority.",
          "Identify who is responsible for each task in this thread. Create a table of responsibilities.",
          "Summarize this project update as a Checklist of 5 immediate next steps."
        ],
        workplaceBenefit: "Turn chatter into checklists. This lab ensures that after every email thread, you have a clear 'To-Do' list, preventing the common problem of 'Assuming someone else is doing it'.",
        format: "JSON: { tasks: Array<{task, priority}> }",
        tip: "Always ask for 'Priority'. It forces the AI to look for cues like 'urgent' or 'by EOD'.",
        strategy: "Paste your Monday morning inbox into this. It builds your week's schedule for you."
      };
      case 'ooo': return {
        title: "The Boundary Crafter",
        icon: "🌴",
        roleDescription: "A Corporate Communications Manager who specializes in professional detachment and boundary setting.",
        lesson: "OOO prompts are all about 'Entity Scoping'. You must provide the dates and the alternative contact as hard entities.",
        role: "Corporate Communications Manager",
        task: "Draft an OOO that sets clear expectations for response times and provides an alternative contact for emergencies.",
        taskAnatomy: {
          verb: "Construct",
          instruction: "Clear OOO message + Alternative contact",
          constraints: "Professional tone + Explicit boundary",
          whyItWorks: "'Construct' suggests building a template with specific slots for data."
        },
        examplePrompts: [
          "Construct a professional OOO message for these dates: [Date Range]. Alternative: [Sarah].",
          "Draft an OOO auto-responder that is friendly but firm about 'No exceptions'.",
          "Create a humor-tinged but professional OOO for a design team lead."
        ],
        workplaceBenefit: "Protect your time off. This lab generates messages that are polite enough to keep your job, but firm enough to ensure you aren't bothered on your vacation.",
        format: "JSON: { message: string }",
        tip: "Define 'Emergency contact' as a mandatory field. It's the #1 reason OOO messages fail.",
        strategy: "Set this up once, then just swap the dates each time you're away. Consistency is the key to professional boundaries."
      };
    }
  };

  const data = getToolData();

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'meeting', label: 'Scheduling Engine', icon: '🗓️' },
          { id: 'tasks', label: 'Task Extractor', icon: '✅' },
          { id: 'ooo', label: 'Boundary Crafter', icon: '🌴' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTool(t.id as any); setViewMode('theory'); setMeeting(null); setTasks(null); setOoo(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTool === t.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
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
            className="mb-4 text-xs font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1 uppercase tracking-widest"
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
                className="w-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                placeholder="Paste the thread or notes to normalize..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            }
            output={
              <div className="space-y-6">
                {activeTool === 'meeting' && meeting && (
                  <div className="space-y-4">
                     <div className="grid grid-cols-1 gap-2">
                        {meeting.proposedSlots.map((s, i) => <div key={i} className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30 text-emerald-400 font-bold text-xs italic">📅 {s}</div>)}
                     </div>
                     <div className="bg-white p-6 rounded-2xl text-slate-800 text-sm whitespace-pre-wrap italic shadow-lg">
                        {meeting.confirmationMessage}
                     </div>
                  </div>
                )}
                {activeTool === 'tasks' && tasks && (
                  <div className="space-y-3">
                     {tasks.tasks.map((t, i) => (
                       <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                          <span className="text-sm">{t.task}</span>
                          <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${t.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>{t.priority}</span>
                       </div>
                     ))}
                  </div>
                )}
                {activeTool === 'ooo' && ooo && (
                  <div className="bg-white p-8 rounded-2xl text-slate-800 text-sm leading-relaxed whitespace-pre-wrap shadow-2xl italic border-t-8 border-emerald-500">
                    {ooo.message}
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

export default ModuleAdmin;
