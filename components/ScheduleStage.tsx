
import React, { useState } from 'react';
import { Campaign, ContentTheme, SocialPost, PostVersion } from '../types';
import { Calendar as CalendarIcon, Download, CheckCircle, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';
import { generateCampaignZip } from '../services/zipService';

interface ScheduleStageProps {
  campaign: Campaign;
  onUpdateCampaign: (campaign: Campaign) => void;
  onDashboardReturn: () => void;
}

const ScheduleStage: React.FC<ScheduleStageProps> = ({ campaign, onUpdateCampaign, onDashboardReturn }) => {
  const [downloading, setDownloading] = React.useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const approvedVersions = campaign.themes.flatMap(t => 
    t.posts.flatMap(p => 
      p.versions.filter(v => v.isApproved).map(v => ({ ...v, platform: p.platform, themeId: t.id, postId: p.id }))
    )
  );

  const handleAddSlot = (themeId: string, postId: string, versionId: string) => {
    const updatedThemes = campaign.themes.map(t => {
      if (t.id !== themeId) return t;
      return {
        ...t,
        posts: t.posts.map(p => {
          if (p.id !== postId) return p;
          return {
            ...p,
            versions: p.versions.map(v => v.id === versionId ? { ...v, scheduledDates: [...v.scheduledDates, ''] } : v)
          };
        })
      };
    });
    onUpdateCampaign({ ...campaign, themes: updatedThemes });
  };

  const handleUpdateSlot = (themeId: string, postId: string, versionId: string, idx: number, value: string) => {
    const updatedThemes = campaign.themes.map(t => {
      if (t.id !== themeId) return t;
      return {
        ...t,
        posts: t.posts.map(p => {
          if (p.id !== postId) return p;
          return {
            ...p,
            versions: p.versions.map(v => {
              if (v.id !== versionId) return v;
              const newDates = [...v.scheduledDates];
              newDates[idx] = value;
              return { ...v, scheduledDates: newDates };
            })
          };
        })
      };
    });
    onUpdateCampaign({ ...campaign, themes: updatedThemes });
  };

  const handleRemoveSlot = (themeId: string, postId: string, versionId: string, idx: number) => {
    const updatedThemes = campaign.themes.map(t => {
      if (t.id !== themeId) return t;
      return {
        ...t,
        posts: t.posts.map(p => {
          if (p.id !== postId) return p;
          return {
            ...p,
            versions: p.versions.map(v => v.id === versionId ? { ...v, scheduledDates: v.scheduledDates.filter((_, i) => i !== idx) } : v)
          };
        })
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
      a.download = `${campaign.name.replace(/\s+/g, '_')}.zip`;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-20">
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl">
           <div className="bg-white max-w-lg w-full p-12 text-center shadow-2xl border-t-[12px] border-indigo-600">
                <CheckCircle size={48} className="text-emerald-500 mx-auto mb-6" />
                <h3 className="text-3xl font-black uppercase italic mb-4 tracking-tighter">Queue Ready</h3>
                <p className="text-slate-500 font-mono text-xs mb-10">Deployments propagated to core buffers.</p>
                <button onClick={onDashboardReturn} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg">Return to Workspace</button>
           </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Schedule Sync</h2>
           <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Allocating time slots for approved versions.</p>
        </div>
        <div className="flex space-x-3">
           <button onClick={handleDownload} disabled={downloading} className="px-5 py-2 border-2 border-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
             <Download size={14} />
             <span>{downloading ? "Archiving..." : "Export Assets"}</span>
           </button>
           <button onClick={() => setShowSuccess(true)} className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
             <span>Deploy Pipeline</span>
           </button>
        </div>
      </div>

      {approvedVersions.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 text-slate-400">
           <AlertCircle size={32} className="mb-4 opacity-30" />
           <p className="text-xs font-mono uppercase">No versions approved for scheduling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedVersions.map((v) => (
            <div key={v.id} className="bg-white border border-slate-200 p-6 shadow-sm flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                 <div className="flex items-center space-x-3">
                    <span className="bg-slate-900 text-white px-2 py-1 font-black text-[9px] italic uppercase">{v.platform}</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{v.label}</span>
                 </div>
                 <button 
                  onClick={() => handleAddSlot(v.themeId, v.postId, v.id)}
                  className="text-[9px] font-black text-indigo-600 uppercase flex items-center hover:underline"
                 >
                    <Plus size={12} className="mr-1" /> Add Time Slot
                 </button>
              </div>

              <div className="flex items-center space-x-4">
                 <div className="w-16 h-16 bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                    <img src={v.imageUrl} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-mono text-slate-500 italic line-clamp-2">"{v.content}"</p>
                 </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                 {v.scheduledDates.map((date, idx) => (
                   <div key={idx} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Clock size={12} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                          type="datetime-local"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-[10px] font-mono outline-none focus:border-indigo-600"
                          value={date}
                          onChange={(e) => handleUpdateSlot(v.themeId, v.postId, v.id, idx, e.target.value)}
                        />
                      </div>
                      <button onClick={() => handleRemoveSlot(v.themeId, v.postId, v.id, idx)} className="p-2 text-slate-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                   </div>
                 ))}
                 {v.scheduledDates.length === 0 && (
                    <p className="text-[9px] text-slate-400 font-mono italic">No slots allocated.</p>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleStage;
