
import React, { useState } from 'react';
import { ContentTheme, SocialPost, Platform, PostVersion, PostFrame } from '../types';
import { Edit2, Twitter, Linkedin, Instagram, Check, RefreshCw, Copy, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface ReviewStageProps {
  themes: ContentTheme[];
  onUpdate: (themes: ContentTheme[]) => void;
  onNext: () => void;
}

const ReviewStage: React.FC<ReviewStageProps> = ({ themes, onUpdate, onNext }) => {
  const [activeThemeId, setActiveThemeId] = useState<string>(themes[0]?.id || '');
  const [activePlatform, setActivePlatform] = useState<Platform>('Instagram');
  const [editingFrameId, setEditingFrameId] = useState<string | null>(null);

  const activeTheme = themes.find(t => t.id === activeThemeId);
  const activePost = activeTheme?.posts.find(p => p.platform === activePlatform);

  const handleFrameUpdate = (versionId: string, frameId: string, field: 'content' | 'imageDescription', value: string) => {
    if (!activeTheme || !activePost) return;

    const updatedThemes = themes.map(t => {
      if (t.id !== activeThemeId) return t;
      return {
        ...t,
        posts: t.posts.map(p => {
          if (p.platform !== activePlatform) return p;
          return {
            ...p,
            versions: p.versions.map(v => {
              if (v.id !== versionId) return v;
              return {
                ...v,
                frames: v.frames.map(f => f.id === frameId ? { ...f, [field]: value } : f)
              };
            })
          };
        })
      };
    });

    onUpdate(updatedThemes);
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case 'Twitter': return <Twitter size={18} />;
      case 'LinkedIn': return <Linkedin size={18} />;
      case 'Instagram': return <Instagram size={18} />;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Creative Review</h2>
           <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Select versions and refine the sequence.</p>
        </div>
        <div className="flex space-x-2">
             <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                <RefreshCw size={14} />
                <span>Reroll All</span>
             </button>
             <button onClick={onNext} className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-lg transition-all active:scale-95">
                <Check size={14} />
                <span>Approve Campaign</span>
             </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 p-1 bg-slate-200 w-fit">
        {(['Instagram', 'Twitter', 'LinkedIn'] as Platform[]).map(p => (
          <button 
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all ${activePlatform === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {getPlatformIcon(p)}
            <span>{p}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Themes */}
        <div className="lg:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Campaign Themes</label>
          {themes.map(theme => (
            <div 
              key={theme.id}
              onClick={() => setActiveThemeId(theme.id)}
              className={`p-4 cursor-pointer border-l-4 transition-all ${activeThemeId === theme.id ? 'bg-white border-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <h4 className="font-black text-xs uppercase tracking-tight leading-none mb-1">{theme.title}</h4>
              <p className="text-[9px] font-mono uppercase line-clamp-1">{theme.rationale}</p>
            </div>
          ))}
        </div>

        {/* Content: Versions Grid (Matching the wireframe) */}
        <div className="lg:col-span-10 space-y-12">
          {activePost?.versions.map((version, vIdx) => (
            <div key={version.id} className="space-y-4 border border-slate-300 p-6 bg-white shadow-sm relative group">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">Version {vIdx + 1}: {version.label}</h3>
                <div className="flex space-x-2">
                   <button className="px-3 py-1 bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200">Set Primary</button>
                </div>
              </div>

              {/* The "Boxes" from the wireframe */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {version.frames.map((frame, fIdx) => (
                  <div key={frame.id} className="space-y-2 group/frame">
                    <div className="aspect-[4/5] border-2 border-slate-200 bg-slate-50 relative overflow-hidden flex flex-col group-hover/frame:border-indigo-400 transition-colors">
                        <div className="absolute top-2 right-2 z-10">
                          <button 
                            onClick={() => setEditingFrameId(editingFrameId === frame.id ? null : frame.id)}
                            className="p-1.5 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-indigo-600 opacity-0 group-hover/frame:opacity-100 transition-opacity"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                        
                        {/* Placeholder for visual */}
                        <div className="flex-1 bg-slate-100 relative overflow-hidden">
                           <img 
                              src={`https://picsum.photos/seed/${frame.id}/400/500`} 
                              alt="Frame preview" 
                              className="w-full h-full object-cover grayscale opacity-80"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                              <span className="text-white text-[10px] font-black uppercase tracking-widest border-b-2 border-white/50 pb-1">post {fIdx + 1}</span>
                           </div>
                        </div>

                        {/* Content area below/over visual */}
                        <div className="p-3 bg-white min-h-[80px]">
                           {editingFrameId === frame.id ? (
                             <textarea 
                               autoFocus
                               className="w-full h-full text-[10px] font-mono border-none outline-none bg-indigo-50 p-1 leading-relaxed"
                               value={frame.content}
                               onChange={(e) => handleFrameUpdate(version.id, frame.id, 'content', e.target.value)}
                             />
                           ) : (
                             <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-4 italic">
                                "{frame.content}"
                             </p>
                           )}
                        </div>
                    </div>
                    {/* Visual Prompt Editor */}
                    <div className="px-1">
                       <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Visual Prompt</label>
                       {editingFrameId === frame.id ? (
                          <input 
                            className="w-full text-[9px] font-mono bg-transparent border-b border-indigo-200 outline-none focus:border-indigo-600 py-1"
                            value={frame.imageDescription}
                            onChange={(e) => handleFrameUpdate(version.id, frame.id, 'imageDescription', e.target.value)}
                          />
                       ) : (
                          <p className="text-[9px] font-mono text-slate-400 truncate">{frame.imageDescription}</p>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {activePost?.versions.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 text-slate-400">
               <p className="text-xs font-mono uppercase italic tracking-widest">No versions generated for this platform.</p>
               <button className="mt-4 px-4 py-2 border border-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-white">Generate Sequence</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewStage;
