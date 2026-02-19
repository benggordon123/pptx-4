
import React, { useState } from 'react';
import { AppTab } from './types';
import DashboardView from './components/DashboardView';
import ModuleDrafting from './components/ModuleDrafting';
import ModuleTone from './components/ModuleTone';
import ModuleCrisis from './components/ModuleCrisis';
import ModuleAdmin from './components/ModuleAdmin';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Workshop Overview' },
    { id: 'drafting', icon: '✍️', label: '1: Drafting Patterns' },
    { id: 'tone', icon: '🎭', label: '2: Emotional Priming' },
    { id: 'crisis', icon: '🛡️', label: '3: Chain of Thought' },
    { id: 'admin', icon: '📎', label: '4: Entity Extraction' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0 border-r border-slate-800`}>
        <div className="p-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AI Mastery
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Prompting Suite</p>
        </div>
        
        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-6 right-6 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${process.env.API_KEY ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{process.env.API_KEY ? 'Engine Active' : 'Simulation Mode'}</span>
          </div>
          <p className="text-[9px] text-slate-500 leading-tight">
            Learning environment is connected to Gemini 3 Flash.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-6 md:p-12">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{menuItems.find(i => i.id === activeTab)?.label}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-[2px] w-8 bg-blue-600"></span>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Interactive Prompt Engineering Lab</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-3">
             <span className="text-xs font-bold text-slate-400">STUDENT PROGRESS</span>
             <div className="flex gap-1">
                <div className="w-6 h-1 rounded-full bg-blue-600"></div>
                <div className={`w-6 h-1 rounded-full ${activeTab !== 'dashboard' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                <div className="w-6 h-1 rounded-full bg-slate-200"></div>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
        {activeTab === 'drafting' && <ModuleDrafting />}
        {activeTab === 'tone' && <ModuleTone />}
        {activeTab === 'crisis' && <ModuleCrisis />}
        {activeTab === 'admin' && <ModuleAdmin />}
      </main>
    </div>
  );
};

export default App;
