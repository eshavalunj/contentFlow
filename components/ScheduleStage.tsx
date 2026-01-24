
import React, { useState } from 'react';
import { Campaign, ContentTheme, SocialPost, PostVersion } from '../types';
import { Calendar as CalendarIcon, Download, CheckCircle, Clock, ArrowRight, Layers } from 'lucide-react';
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
  const [selectedVersions, setSelectedVersions] = useState<Record<string, string>>({});

  const handleVersionSelect = (postId: string, versionId: string) => {
    setSelectedVersions(prev => ({ ...prev, [postId]: versionId }));
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

  const data = [
    { name: '08:00', engagement: 1200 },
    { name: '10:00', engagement: 2800 },
    { name: '12:00', engagement: 4500 },
    { name: '14:00', engagement: 3200 },
    { name: '16:00', engagement: 2500 },
    { name: '18:00', engagement: 3800 },
    { name: '20:00', engagement: 4100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto relative pb-20">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
           <div className="bg-white max-w-lg w-full p-12 shadow-2xl border-t-[12px] border-indigo-600 relative overflow-hidden text-center">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                   <CheckCircle size={48} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic mb-4">Pipeline Loaded</h3>
                <p className="text-slate-500 font-mono text-xs leading-relaxed mb-10 px-4">
                   Deployment instructions for <span className="text-indigo-600 font-bold">"{campaign.name}"</span> have been propagated to all satellite account managers.
                </p>
                <div className="flex flex-col space-y-4">
                   <button 
                    onClick={onDashboardReturn}
                    className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                   >
                     Return to Hub
                   </button>
                   <button 
                    onClick={() => setShowSuccess(false)}
                    className="w-full py-4 border border-slate-200 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-50 transition-all"
                   >
                     Inspect Log
                   </button>
                </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Deployment Sync</h2>
           <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Final node selection and timestamp scheduling.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleDownload}
             disabled={downloading}
             className="px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-70 font-black uppercase tracking-widest text-[10px] flex items-center space-x-2"
           >
             <Download size={14} />
             <span>{downloading ? "Archiving..." : "Download Package"}</span>
           </button>
           <button 
            onClick={() => setShowSuccess(true)}
            className="px-8 py-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] font-black uppercase tracking-widest text-[10px] flex items-center space-x-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
           >
             <CheckCircle size={14} />
             <span>Initialize Push</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {campaign.themes.map(theme => (
            <div key={theme.id} className="space-y-6">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] border-b border-indigo-100 pb-2">{theme.title}</h3>
              <div className="space-y-4">
                {theme.posts.map(post => {
                  const currentVerId = selectedVersions[post.id] || post.versions[0]?.id;
                  const currentVersion = post.versions.find(v => v.id === currentVerId);
                  return (
                    <div key={post.id} className="bg-white border border-slate-200 p-6 flex flex-col space-y-6 shadow-sm">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-black text-[10px] italic">{post.platform.substring(0,2)}</span>
                            <div>
                               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{post.platform} Output</p>
                               <p className="text-[9px] font-mono text-slate-400 uppercase">{currentVersion?.frames.length || 0} Frames Sequenced</p>
                            </div>
                         </div>
                         <div className="flex flex-col items-end space-y-2">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Select Version</label>
                            <div className="flex bg-slate-100 p-1 border border-slate-200">
                               {post.versions.map((v, i) => (
                                 <button 
                                   key={v.id}
                                   onClick={() => handleVersionSelect(post.id, v.id)}
                                   className={`px-3 py-1 text-[9px] font-black uppercase transition-all ${currentVerId === v.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                 >
                                   V{i+1}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {currentVersion?.frames.map((frame, i) => (
                          <div key={frame.id} className="aspect-square bg-slate-50 border border-slate-100 p-2 overflow-hidden flex flex-col justify-between">
                             <div className="h-2/3 bg-slate-200 relative overflow-hidden">
                                <img src={`https://picsum.photos/seed/${frame.id}/200`} className="w-full h-full object-cover grayscale opacity-50" />
                             </div>
                             <p className="text-[8px] font-mono line-clamp-2 mt-1 uppercase text-slate-500">{frame.content}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                         <div className="flex items-center space-x-3">
                           <CalendarIcon size={14} className="text-slate-400" />
                           <input 
                             type="datetime-local" 
                             className="text-[10px] font-black font-mono border-none outline-none bg-slate-50 px-3 py-2 hover:bg-indigo-50 transition-colors"
                             value={currentVersion?.status === 'SCHEDULED' ? '2023-12-01T09:00' : ''}
                           />
                         </div>
                         <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Staging Buffer</span>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Layers size={80} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter italic mb-4">Propagation Analytics</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} tick={{fill: '#475569', fontFamily: 'monospace'}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0', fontSize: '10px', fontStyle: 'monospace' }} 
                      cursor={{fill: '#1e293b'}}
                    />
                    <Bar dataKey="engagement" fill="#4f46e5" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-4 uppercase tracking-[0.1em] text-center">Peak Engagement Vector: 12:00 UTC</p>
           </div>
           
           <div className="bg-white p-6 border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center">
                 <Clock size={14} className="mr-2 text-indigo-600" />
                 Deployment Health
              </h4>
              <div className="space-y-4">
                 {[
                   { p: 'Instagram', s: 'Operational' },
                   { p: 'Twitter', s: 'Rate-Limited' },
                   { p: 'LinkedIn', s: 'Operational' }
                 ].map(item => (
                   <div key={item.p} className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{item.p}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${item.s === 'Operational' ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`}>{item.s}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStage;
