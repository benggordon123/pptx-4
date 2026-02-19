
import React from 'react';

interface TaskAnatomyData {
  verb: string;
  instruction: string;
  constraints: string;
}

interface Props {
  title: string;
  lesson: string;
  role: string;
  task: string;
  taskAnatomy?: TaskAnatomyData;
  format: string;
  contextInput: React.ReactNode;
  output: React.ReactNode;
  onRun: () => void;
  loading: boolean;
  canRun: boolean;
  frameworkTip: string;
  workplaceStrategy: string;
}

const PromptLabLayout: React.FC<Props> = ({ 
  title, lesson, role, task, taskAnatomy, format, contextInput, output, onRun, loading, canRun, frameworkTip, workplaceStrategy 
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Workshop Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-400/30">
            <span className="text-4xl">🎓</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">{lesson}</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl font-black italic select-none">RTCF</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Step 1: Assemble the Prompt */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              Assemble the Prompt
            </h4>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Framework: RTCF</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Persona Section */}
            <div className="p-4 border-b border-slate-100 flex gap-4">
              <div className="w-20 text-[10px] font-black text-slate-400 uppercase tracking-tighter pt-1">Persona</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-700 mb-1">{role}</p>
                <p className="text-[10px] text-slate-500 italic">Sets the tone, vocabulary, and expertise level.</p>
              </div>
            </div>

            {/* ENHANCED Task Section */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex gap-4 mb-4">
                <div className="w-20 text-[10px] font-black text-slate-400 uppercase tracking-tighter pt-1">Task</div>
                <div className="flex-1 text-sm font-medium text-slate-800 leading-relaxed">
                  {task}
                </div>
              </div>
              
              {taskAnatomy && (
                <div className="mt-4 pt-4 border-t border-slate-200/60">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Anatomy of this Task:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <span className="text-[9px] font-bold text-blue-600 uppercase block mb-1">Action Verb</span>
                      <span className="text-xs font-bold text-blue-900">{taskAnatomy.verb}</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase block mb-1">Instruction</span>
                      <span className="text-xs font-bold text-emerald-900">{taskAnatomy.instruction}</span>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                      <span className="text-[9px] font-bold text-purple-600 uppercase block mb-1">Constraints</span>
                      <span className="text-xs font-bold text-purple-900">{taskAnatomy.constraints}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Context Section */}
            <div className="p-4 border-b border-slate-100 flex gap-4">
              <div className="w-20 text-[10px] font-black text-slate-400 uppercase tracking-tighter pt-3">Context</div>
              <div className="flex-1">
                {contextInput}
                <p className="text-[10px] text-slate-500 mt-2">The raw data the AI needs to process.</p>
              </div>
            </div>

            {/* Format Section */}
            <div className="p-4 flex gap-4 bg-slate-50/30">
              <div className="w-20 text-[10px] font-black text-slate-400 uppercase tracking-tighter pt-1">Format</div>
              <div className="flex-1 text-[11px] font-mono text-slate-500">
                {format}
              </div>
            </div>
          </div>

          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
             <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm font-bold">💡</div>
             <p className="text-xs text-emerald-900 leading-relaxed">
               <span className="uppercase font-black tracking-widest text-[10px] block mb-1">Mastery Insight: Why this works</span>
               {frameworkTip}
             </p>
          </div>

          <button 
            onClick={onRun}
            disabled={!canRun || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? <span className="animate-spin text-2xl">🌀</span> : 'Run Lab Test ✨'}
          </button>
        </div>

        {/* Step 2: Analyze Output */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">2</span>
              Result Analysis
            </h4>
          </div>
          
          <div className="bg-slate-900 rounded-[32px] p-8 min-h-[500px] text-white shadow-2xl relative border border-slate-800">
            {output ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {output}
                
                <div className="pt-8 border-t border-white/10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl">💼</div>
                      <div>
                        <h5 className="font-bold text-blue-400 text-sm uppercase tracking-widest">Workplace Strategy</h5>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">How to use this logic at your job</p>
                      </div>
                   </div>
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-sm text-slate-300 leading-relaxed italic">
                      {workplaceStrategy}
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-40 space-y-4 pt-20">
                <span className="text-8xl">🧬</span>
                <p className="font-black tracking-[0.2em] uppercase text-xs">Waiting for Lab Execution</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptLabLayout;
