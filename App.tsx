
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import InputStage from './components/InputStage';
import ReviewStage from './components/ReviewStage';
import ScheduleStage from './components/ScheduleStage';
import Dashboard from './components/Dashboard';
import GlobalSchedule from './components/GlobalSchedule';
import Settings from './components/Settings';
import { AppStep, Campaign, AppView, Platform } from './types';
import { generateCampaignContent } from './services/geminiService';
import { Plus, Zap, Cpu, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loaderMsg, setLoaderMsg] = useState('Initializing Core Engine');

  const loaderMessages = [
    'Mapping thematic clusters...',
    'Optimizing stylistic fidelity...',
    'Synthesizing creative variations...',
    'Rendering carousel sequences...',
    'Injecting stylistic DNA...',
    'Buffering multi-part frames...'
  ];

  useEffect(() => {
    let interval: any;
    if (step === AppStep.GENERATING) {
      let idx = 0;
      interval = setInterval(() => {
        setLoaderMsg(loaderMessages[idx % loaderMessages.length]);
        idx++;
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleInputComplete = async (sourceText: string, intent: string, name: string, platforms: Platform[]) => {
    setLoading(true);
    setStep(AppStep.GENERATING);
    try {
      const themes = await generateCampaignContent(sourceText, intent, platforms);
      setCampaign({
        id: Date.now().toString(),
        name,
        intent,
        sourceText,
        themes: themes,
        createdAt: Date.now()
      });
      setStep(AppStep.REVIEW);
    } catch (error) {
      console.error("Generation failed:", error);
      setStep(AppStep.INPUT);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    setCurrentView('DASHBOARD');
    setStep(AppStep.INPUT);
    setCampaign(null);
  };

  const renderCampaignModule = () => {
    if (step === AppStep.INPUT) {
      return <InputStage onNext={handleInputComplete} />;
    }
    if (step === AppStep.GENERATING) {
      return (
        <div className="h-[75vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Neural Network Pulse Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-full h-full border border-indigo-600/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
               <div className="absolute w-[80%] h-[80%] border border-indigo-600/20 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
               <div className="absolute w-[60%] h-[60%] border border-indigo-600/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
            </div>
            
            <div className="relative z-10 p-8 bg-slate-900 shadow-2xl rounded-none border-2 border-indigo-500 animate-[pulse_2s_ease-in-out_infinite] flex flex-col items-center">
               <BrainCircuit size={48} className="text-white mb-2" />
               <div className="flex space-x-1">
                 <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                 <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
               </div>
            </div>
          </div>
          
          <div className="mt-12 space-y-6">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Creative Synthesis Active</h3>
            <div className="flex flex-col items-center">
              <div className="bg-indigo-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                 {loaderMsg}
              </div>
              <div className="w-48 h-[1px] bg-slate-300 relative overflow-hidden">
                 <div className="absolute inset-y-0 bg-indigo-600 w-1/4 animate-[scanning_1.2s_infinite]"></div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes scanning {
              0% { left: -25%; }
              100% { left: 100%; }
            }
          `}</style>
        </div>
      );
    }
    if (step === AppStep.REVIEW && campaign) {
      return (
        <ReviewStage 
          themes={campaign.themes}
          onUpdate={(updatedThemes) => setCampaign({ ...campaign, themes: updatedThemes })}
          onNext={() => setStep(AppStep.SCHEDULE)}
        />
      );
    }
    if (step === AppStep.SCHEDULE && campaign) {
      return (
        <ScheduleStage 
          campaign={campaign}
          onUpdateCampaign={setCampaign}
          onDashboardReturn={handleGoToDashboard}
        />
      );
    }
    return null;
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'DASHBOARD' && <Dashboard onStartCampaign={() => setCurrentView('CAMPAIGNS')} />}
      {currentView === 'SCHEDULE' && <GlobalSchedule />}
      {currentView === 'SETTINGS' && <Settings />}
      {currentView === 'CAMPAIGNS' && (
        <div className="max-w-7xl mx-auto">
          {step !== AppStep.INPUT && step !== AppStep.GENERATING && (
            <div className="mb-8 flex justify-between items-center bg-white p-4 border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-500">
               <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                  <span className="hover:text-indigo-600 cursor-pointer uppercase tracking-widest" onClick={handleGoToDashboard}>Workflow</span>
                  <span>/</span>
                  <span className="text-slate-900 font-black uppercase tracking-widest italic">{campaign?.name}</span>
               </div>
               <button onClick={() => {setCampaign(null); setStep(AppStep.INPUT);}} className="text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 border border-indigo-100 uppercase tracking-[0.15em] flex items-center space-x-2 transition-all">
                   <Plus size={14} />
                   <span>Reset Pipeline</span>
               </button>
            </div>
          )}
          {renderCampaignModule()}
        </div>
      )}
    </Layout>
  );
};

export default App;
