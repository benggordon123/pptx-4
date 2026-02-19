
import React from 'react';
import { AppTab } from '../types';

interface DashboardViewProps {
  setActiveTab: (tab: AppTab) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const steps = [
    { id: 'drafting', title: '1. RTCF Patterning', desc: 'Learn the fundamental framework for high-quality email drafts.', icon: '✍️' },
    { id: 'tone', title: '2. Emotional Priming', desc: 'Discover how to nudge AI toward high-empathy communications.', icon: '🎭' },
    { id: 'crisis', title: '3. Chain of Thought', desc: 'Use multi-phase logic to handle angry clients and high-risk threads.', icon: '🛡️' },
    { id: 'admin', title: '4. Entity Extraction', desc: 'Master the art of filtering noise and extracting structured data.', icon: '📎' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">Welcome to the <br/><span className="text-blue-600 underline decoration-blue-200">Prompt Mastery Suite.</span></h3>
          <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
            This isn't just a generator. This is a workshop. Each module is designed to peel back the curtain on how 
            professional prompt engineers talk to AI to get consistent, enterprise-grade results.
          </p>
          <div className="mt-10 flex gap-4">
            <button 
              onClick={() => setActiveTab('drafting')}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Start Module 1
            </button>
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4].map(i => <img key={i} src={`https://picsum.photos/seed/${i+40}/40`} className="w-10 h-10 rounded-full border-2 border-white" alt="Student" />)}
              <span className="ml-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Join 400+ Students</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 text-[200px] leading-none opacity-[0.03] font-black select-none pointer-events-none">LEARN</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <div 
            key={step.id} 
            onClick={() => setActiveTab(step.id as AppTab)}
            className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-400 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="text-4xl mb-6 group-hover:scale-125 transition-transform origin-left">{step.icon}</div>
            <h4 className="text-xl font-black text-slate-900 mb-2">{step.title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Lab →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
