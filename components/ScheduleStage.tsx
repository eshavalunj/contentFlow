
import React, { useState } from 'react';
import { Campaign, ContentTheme } from '../types';
import { Calendar as CalendarIcon, Download, CheckCircle, Clock, X, ArrowRight } from 'lucide-react';
import { generateCampaignZip } from '../services/zipService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ScheduleStageProps {
  campaign: Campaign;
  onUpdateCampaign: (campaign: Campaign) => void;
  onDashboardReturn: () => void;
}

const ScheduleStage: React.FC<ScheduleStageProps> = ({ campaign, onUpdateCampaign, onDashboardReturn }) => {
  const [downloading, setDownloading] = React.useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDateChange = (themeId: string, postId: string, date: string) => {
    const updatedThemes = campaign.themes.map(t => {
      if (t.id !== themeId) return t;
      return {
        ...t,
        posts: t.posts.map(p => p.id === postId ? { ...p, scheduledDate: date } : p)
      };
    });
    onUpdateCampaign({ ...campaign, themes: updatedThemes });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await generateCampaignZip(campaign);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${campaign.name.replace(/\s+/g, '_')}_Campaign.zip`;
      a.click();
    } catch (e) {
      console.error(e);
      alert('Error generating zip');
    } finally {
      setDownloading(false);
    }
  };

  const handleExecute = () => {
    setShowSuccess(true);
  };

  // Mock data for the chart
  const data = [
    { name: 'Mon', engagement: 2000 },
    { name: 'Tue', engagement: 3000 },
    { name: 'Wed', engagement: 2500 },
    { name: 'Thu', engagement: 4500 },
    { name: 'Fri', engagement: 3800 },
    { name: 'Sat', engagement: 1500 },
    { name: 'Sun', engagement: 1800 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto relative">
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
           <div className="bg-white max-w-lg w-full p-10 shadow-2xl border-t-8 border-indigo-600 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <CheckCircle size={160} className="text-indigo-600" />
             </div>
             
             <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Campaign Queued</h3>
                <p className="text-slate-500 font-mono text-sm leading-relaxed">
                   The campaign <span className="text-indigo-600 font-bold">"{campaign.name}"</span> has been successfully injected into the global deployment pipeline. 
                   Posts will trigger automatically at their scheduled timestamps.
                </p>
                <div className="pt-4 flex flex-col space-y-3">
                   <button 
                    onClick={onDashboardReturn}
                    className="w-full py-4 bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                   >
                     <span>Return to Workspace</span>
                     <ArrowRight size={14} />
                   </button>
                   <button 
                    onClick={() => setShowSuccess(false)}
                    className="w-full py-4 border border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-xs hover:bg-slate-50"
                   >
                     Stay in Editor
                   </button>
                </div>
             </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Deployment</h2>
           <p className="text-slate-500 font-mono text-sm">Finalize timeline. Export assets.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleDownload}
             disabled={downloading}
             className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-md disabled:opacity-70 font-bold uppercase tracking-wider text-sm"
           >
             {downloading ? (
                <span>Archiving...</span>
             ) : (
               <>
                 <Download size={18} />
                 <span>Download ZIP</span>
               </>
             )}
           </button>
           <button 
            onClick={handleExecute}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md font-bold uppercase tracking-wider text-sm"
           >
             <CheckCircle size={18} />
             <span>Execute Schedule</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduling List */}
        <div className="lg:col-span-2 space-y-6">
          {campaign.themes.map(theme => (
            <div key={theme.id} className="bg-white border border-slate-200 shadow-sm">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-700 uppercase tracking-wide text-sm">{theme.title}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {theme.posts.map(post => (
                  <div key={post.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 bg-slate-100 border border-slate-200`}>
                        <span className="text-slate-900 font-bold text-xs uppercase">{post.platform.substring(0,2)}</span>
                      </div>
                      <div className="max-w-md">
                        <p className="text-sm text-slate-800 line-clamp-2 font-medium">{post.content}</p>
                        <p className="text-xs text-slate-400 mt-1 font-mono">IMG_PROMPT: {post.imageDescription.substring(0, 30)}...</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                       <div className="relative">
                         <div className="absolute left-3 top-3 text-slate-400">
                           <CalendarIcon size={14} />
                         </div>
                         <input 
                           type="datetime-local" 
                           className="pl-9 pr-3 py-2 text-sm border border-slate-200 focus:border-indigo-600 focus:ring-0 outline-none bg-slate-50 hover:bg-white transition-colors font-mono"
                           value={post.scheduledDate || ''}
                           onChange={(e) => handleDateChange(theme.id, post.id, e.target.value)}
                         />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Analytics/Preview Side */}
        <div className="space-y-6">
           <div className="bg-white p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center space-x-2 uppercase text-xs tracking-widest border-b border-slate-100 pb-2">
                <Clock size={16} className="text-indigo-600" />
                <span>Impact Projection</span>
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontFamily: 'monospace'}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none' }} 
                      cursor={{fill: '#f1f5f9'}}
                    />
                    <Bar dataKey="engagement" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center font-mono">ESTIMATED REACH BASED ON POSTING TIME</p>
           </div>
           
           <div className="bg-slate-900 p-6 text-white shadow-lg border border-slate-800">
              <h4 className="font-bold text-lg mb-2 uppercase tracking-wide text-indigo-400">System Insight</h4>
              <p className="text-slate-300 text-sm font-mono leading-relaxed">Optimization algorithms suggest Tuesday windows (0900-1100 EST) yield 15% higher engagement on B2B vectors.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStage;
