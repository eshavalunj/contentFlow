
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
import { Plus, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loaderMsg, setLoaderMsg] = useState('Synthesizing Core Engine');

  const loaderMessages = [
    'Clustering thematic data...',
    'Optimizing style vectors...',
    'Generating creative variations...',
    'Buffering assets...'
  ];

  useEffect(() => {
    let interval: any;
    if (step === AppStep.GENERATING) {
      let idx = 0;
      interval = setInterval(() => {
        setLoaderMsg(loaderMessages[idx % loaderMessages.length]);
        idx++;
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleInputComplete = async (sourceText: string, intent: string, name: string, platforms: Platform[]) => {
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
        <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
          <div className="mb-8">
             <Loader2 size={48} className="text-indigo-600 animate-spin" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Creative Syncing</h3>
            <div className="flex flex-col items-center">
              <div className="bg-slate-900 text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                 {loaderMsg}
              </div>
            </div>
          </div>
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
            <div className="mb-6 flex justify-between items-center bg-white p-4 border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
               <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                  <span className="hover:text-indigo-600 cursor-pointer uppercase tracking-widest" onClick={handleGoToDashboard}>Workflow</span>
                  <span>/</span>
                  <span className="text-slate-900 font-black uppercase tracking-widest italic">{campaign?.name}</span>
               </div>
               <button onClick={() => {setCampaign(null); setStep(AppStep.INPUT);}} className="text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 border border-indigo-100 uppercase tracking-widest flex items-center space-x-2 transition-all">
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
