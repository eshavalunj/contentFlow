
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
import { Plus, Zap, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loaderMsg, setLoaderMsg] = useState('Initializing Core Engine');

  const loaderMessages = [
    'Mapping thematic clusters...',
    'Optimizing channel fidelity...',
    'Cross-referencing source vectors...',
    'Synthesizing creative direction...',
    'Finalizing metadata payloads...',
    'Buffering visual assets...'
  ];

  useEffect(() => {
    let interval: any;
    if (step === AppStep.GENERATING) {
      let idx = 0;
      interval = setInterval(() => {
        setLoaderMsg(loaderMessages[idx % loaderMessages.length]);
        idx++;
      }, 2500);
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
        <div className="h-[70vh] flex flex-col items-center justify-center space-y-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-56 h-56 border border-indigo-500/10 rounded-full animate-pulse scale-110"></div>
            <div className="absolute w-44 h-44 border border-indigo-600/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
            <div className="w-24 h-24 bg-slate-900 text-white flex items-center justify-center shadow-2xl relative z-10 border border-slate-700">
               <Cpu size={40} className="animate-pulse" />
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center justify-center space-x-4">
               <span>Synthesizing Intelligence</span>
            </h3>
            <div className="flex flex-col items-center">
              <p className="text-indigo-600 font-mono text-xs font-bold uppercase tracking-[0.3em] h-4 transition-all duration-500">
                 {loaderMsg}
              </p>
              <div className="w-64 h-[2px] bg-slate-200 mt-6 relative overflow-hidden">
                 <div className="absolute inset-y-0 bg-indigo-600 w-1/3 animate-[scanning_1.5s_infinite]"></div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes scanning {
              0% { left: -33%; }
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
                  <span className="hover:text-indigo-600 cursor-pointer" onClick={handleGoToDashboard}>WORKSPACE</span>
                  <span>/</span>
                  <span className="text-slate-900 font-bold uppercase tracking-widest">{campaign?.name}</span>
               </div>
               <button onClick={() => {setCampaign(null); setStep(AppStep.INPUT);}} className="text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 border border-indigo-100 uppercase flex items-center space-x-2 transition-all">
                   <Plus size={14} />
                   <span>Reset Entry</span>
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
