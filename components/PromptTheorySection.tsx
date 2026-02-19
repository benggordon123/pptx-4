
import React from 'react';

interface TheoryProps {
  title: string;
  icon: string;
  roleDescription: string;
  taskAnatomy: {
    verb: string;
    instruction: string;
    constraints: string;
    whyItWorks: string;
  };
  examplePrompts: string[];
  workplaceBenefit: string;
  onLaunchLab: () => void;
}

const PromptTheorySection: React.FC<TheoryProps> = ({ title, icon, roleDescription, taskAnatomy, workplaceBenefit, examplePrompts, onLaunchLab }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden mb-8">
        {/* PPTX Header Style */}
        <div className="bg-slate-900 px-8 md:px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{icon}</span>
            <h3 className="text-xl font-bold text-white tracking-tight uppercase">{title} THEORY</h3>
          </div>
          <div className="text-[10px] font-black text-slate-500 tracking-[0.3em]">SLIDE 04 / 12</div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Column 1: The Concept */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Core Philosophy</h4>
                <p className="text-2xl font-semibold text-slate-800 leading-tight mb-4">
                  {roleDescription}
                </p>
                <div className="p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl">
                   <p className="text-sm text-blue-900 font-medium italic">
                     "The goal here is not automation, but augmentation. We use AI to bypass the emotional 'friction' of corporate communication."
                   </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest">The Mastery Anatomy</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Optimal Verb</span>
                    <p className="text-lg font-black text-slate-900">"{taskAnatomy.verb}"</p>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{taskAnatomy.whyItWorks}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Key Instruction</span>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">{taskAnatomy.instruction}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Primary Constraint</span>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">{taskAnatomy.constraints}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">Mastery Example Prompts</h4>
                <div className="space-y-3">
                  {examplePrompts.map((prompt, idx) => (
                    <div key={idx} className="group relative p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-default">
                      <div className="absolute -left-2 top-4 w-1 h-8 bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                      <code className="text-[11px] text-slate-300 block leading-relaxed font-mono">
                        {prompt}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: The Application */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 h-full flex flex-col">
                <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-6">Workplace Strategy</h4>
                <div className="space-y-6 flex-1">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold">✓</div>
                    <p className="text-sm text-emerald-900 leading-relaxed">
                      {workplaceBenefit}
                    </p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-2xl border border-emerald-200">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase mb-2">Pro Tip:</p>
                    <p className="text-xs text-emerald-800 leading-relaxed italic">
                      "Save these prompts as 'Snippets' or 'Templates' in your email client. Never start from scratch again."
                    </p>
                  </div>
                </div>

                <div className="mt-12">
                  <button 
                    onClick={onLaunchLab}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-slate-300 text-lg"
                  >
                    Launch Interactive Lab
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">Prepare for hands-on practice</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptTheorySection;
