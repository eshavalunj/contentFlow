
import React, { useState } from 'react';
import { ContentTheme, SocialPost, Platform } from '../types';
import { Edit2, Twitter, Linkedin, Instagram, Check, RefreshCw, Copy, CheckCircle } from 'lucide-react';

interface ReviewStageProps {
  themes: ContentTheme[];
  onUpdate: (themes: ContentTheme[]) => void;
  onNext: () => void;
}

const ReviewStage: React.FC<ReviewStageProps> = ({ themes, onUpdate, onNext }) => {
  const [activeThemeId, setActiveThemeId] = useState<string>(themes[0]?.id || '');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [variationSeeds, setVariationSeeds] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeTheme = themes.find(t => t.id === activeThemeId);

  const handlePostUpdate = (postId: string, field: 'content' | 'imageDescription', value: string) => {
    if (!activeTheme) return;
    const updatedTheme = {
      ...activeTheme,
      posts: activeTheme.posts.map(p => p.id === postId ? { ...p, [field]: value } : p)
    };
    onUpdate(themes.map(t => t.id === activeTheme.id ? updatedTheme : t));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case 'Twitter': return <Twitter size={16} className="text-slate-900" />;
      case 'LinkedIn': return <Linkedin size={16} className="text-slate-900" />;
      case 'Instagram': return <Instagram size={16} className="text-slate-900" />;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Review & Refine</h2>
           <p className="text-slate-500 text-sm font-mono">Verify and polish AI generated content.</p>
        </div>
        <div className="flex space-x-3">
             <button className="flex items-center space-x-2 px-5 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors">
                <RefreshCw size={16} />
                <span>Regenerate All</span>
             </button>
             <button onClick={onNext} className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-indigo-700 shadow-md transition-all active:scale-95">
                <Check size={16} />
                <span>Finalize Campaign</span>
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
        {/* Themes Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Theme Selection</h3>
          <div className="space-y-3">
            {themes.map(theme => (
              <div 
                key={theme.id}
                onClick={() => setActiveThemeId(theme.id)}
                className={`p-5 cursor-pointer border-l-4 transition-all ${activeThemeId === theme.id ? 'bg-white border-indigo-600 shadow-md' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'}`}
              >
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wide">{theme.title}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-2 font-mono leading-relaxed">{theme.rationale}</p>
                <div className="mt-3">
                   <span className="text-[9px] bg-slate-200 px-2 py-1 text-slate-600 font-bold uppercase tracking-tighter">{theme.posts.length} Media Units</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6 overflow-y-auto pb-20 pr-2">
          {activeTheme && (
            <>
               <div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 shadow-sm">
                 <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Strategy Rationale</h4>
                 <p className="text-sm text-indigo-800 mt-2 font-mono leading-relaxed">{activeTheme.rationale}</p>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 {activeTheme.posts.map((post) => {
                   const currentVar = variationSeeds[post.id] || 0;
                   const isEditing = editingPostId === post.id;
                   return (
                   <div key={post.id} className="bg-white border border-slate-200 shadow-sm flex flex-col group/post">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center space-x-3">
                           <div className="p-1.5 bg-white border border-slate-200">
                             {getPlatformIcon(post.platform)}
                           </div>
                           <span className="font-black text-slate-900 text-xs uppercase tracking-widest italic">{post.platform}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => copyToClipboard(post.content, post.id)}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            {copiedId === post.id ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                          <button 
                            onClick={() => setEditingPostId(isEditing ? null : post.id)}
                            className={`p-2 transition-colors ${isEditing ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex-1 space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Post Copy</label>
                            {isEditing ? (
                              <textarea
                                className="w-full p-4 text-sm border border-slate-200 focus:border-indigo-600 focus:ring-0 outline-none resize-none h-40 font-mono bg-slate-50"
                                value={post.content}
                                onChange={(e) => handlePostUpdate(post.id, 'content', e.target.value)}
                              />
                            ) : (
                              <div className="text-sm text-slate-800 whitespace-pre-wrap p-4 bg-slate-50 border border-slate-100 min-h-[6rem] font-sans leading-relaxed">
                                {post.content}
                              </div>
                            )}
                         </div>

                         <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Direction</label>
                              <div className="flex bg-slate-100 p-0.5 border border-slate-200">
                                {[0, 1, 2].map(v => (
                                  <button 
                                    key={v}
                                    onClick={() => setVariationSeeds(prev => ({...prev, [post.id]: v}))}
                                    className={`w-7 h-6 text-[10px] flex items-center justify-center font-bold transition-all ${currentVar === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                  >
                                    V{v+1}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="relative aspect-video bg-slate-100 overflow-hidden border border-slate-200 group/img">
                               <img 
                                 src={`https://picsum.photos/seed/${post.id}_${currentVar}/800/600`} 
                                 alt="Visual reference" 
                                 className="w-full h-full object-cover grayscale opacity-90 group-hover/img:grayscale-0 group-hover/img:opacity-100 transition-all duration-700" 
                               />
                               <div className="absolute inset-0 bg-indigo-900/20 group-hover/img:bg-transparent transition-colors"></div>
                               <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest">
                                 Variation {currentVar + 1}
                               </div>
                            </div>

                            <div className="mt-2">
                               {isEditing ? (
                                 <textarea
                                   className="w-full p-3 text-xs border border-slate-200 focus:border-indigo-600 outline-none h-20 font-mono bg-slate-50"
                                   value={post.imageDescription}
                                   onChange={(e) => handlePostUpdate(post.id, 'imageDescription', e.target.value)}
                                   placeholder="Visual Prompt..."
                                 />
                               ) : (
                                 <div className="group relative">
                                   <p className="text-[10px] text-slate-500 italic bg-slate-50 p-3 border border-slate-100 font-mono line-clamp-2 hover:line-clamp-none transition-all cursor-help">
                                     <span className="font-bold uppercase text-slate-400 mr-2">Prompt:</span>
                                     {post.imageDescription}
                                   </p>
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                   );
                 })}
               </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewStage;
