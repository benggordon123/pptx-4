
import React, { useState } from 'react';
import { PromptBlueprint } from '../types';

interface Props {
  blueprint: PromptBlueprint | null;
}

const PromptBlueprintViewer: React.FC<Props> = ({ blueprint }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!blueprint) return null;

  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
      >
        <span>{isOpen ? '▽' : '▷'}</span>
        How did AI do this? (Prompt Blueprint)
      </button>

      {isOpen && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter mb-1">Persona (Role)</p>
                <p className="text-sm font-medium bg-white/5 p-3 rounded-lg border border-white/10">{blueprint.role}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter mb-1">Instruction (Task)</p>
                <p className="text-sm font-medium bg-white/5 p-3 rounded-lg border border-white/10">{blueprint.task}</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter mb-1">Constraints (Format)</p>
              <p className="text-xs bg-white/5 p-3 rounded-lg border border-white/10 italic">{blueprint.format}</p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Master Template for your use:</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(blueprint.fullPromptTemplate)}
                  className="text-[10px] bg-blue-600/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-all"
                >
                  Copy Prompt
                </button>
              </div>
              <pre className="text-[11px] bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-400">
                {blueprint.fullPromptTemplate}
              </pre>
              <p className="text-[10px] text-slate-500 mt-4 italic">
                💡 Tip: Copy the structure above. Replace the context with your own data in any LLM to get similar professional results.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptBlueprintViewer;
