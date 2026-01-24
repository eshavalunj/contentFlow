
import React, { useState } from 'react';
import { ContentTheme, SocialPost, Platform, PostVersion } from '../types';
import { Edit2, Twitter, Linkedin, Instagram, Check, RefreshCw, Sparkles, Loader2, CheckSquare, Square } from 'lucide-react';
import { generateImage } from '../services/geminiService';

interface ReviewStageProps {
  themes: ContentTheme[];
  onUpdate: (themes: ContentTheme[]) => void;
  onNext: () => void;
}

const ReviewStage: React.FC<ReviewStageProps> = ({ themes, onUpdate, onNext }) => {
  const [activeThemeId, setActiveThemeId] = useState<string>(themes[0]?.id || '');
  const [activePlatform, setActivePlatform] = useState<Platform>('Instagram');
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState<string | null>(null);

  const activeTheme = themes.find(t => t.id === activeThemeId);
  const activePost = activeTheme?.posts.find(p => p.platform === activePlatform);

  const updateVersion = (versionId: string, updates: Partial<PostVersion>) => {
    if (!activeTheme || !activePost) return;
    const updatedThemes = themes.map(t => {
      if (t.id !== activeThemeId) return t;
      return {
        ...t,
        posts: t.posts.map(p => {
          if (p.platform !== activePlatform) return p;
          return {
            ...p,
            versions: p.versions.map(v => v.id === versionId ? { ...v, ...updates } : v)
          };
        })
      };
    });
    onUpdate(updatedThemes);
  };

  const handleRegenerateImage = async (version: PostVersion) => {
    setIsGeneratingImg(version.id);
    try {
      const newUrl = await generateImage(version.imageDescription);
      updateVersion(version.id, { imageUrl: newUrl });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImg(null);
    }
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case 'Twitter': return <Twitter size={16} />;
      case 'LinkedIn': return <Linkedin size={16} />;
      case 'Instagram': return <Instagram size={16} />;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Creative Selection</h2>
           <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Approve stylistic versions for deployment.</p>
        </div>
        <div className="flex space-x-2">
             <button onClick={onNext} className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg transition-all active:scale-95">
                <Check size={14} />
                <span>Go to Scheduling</span>
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
        <div className="lg:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Campaign Themes</label>
          {themes.map(theme => (
            <div 
              key={theme.id}
              onClick={() => setActiveThemeId(theme.id)}
              className={`p-4 cursor-pointer border-l-4 transition-all ${activeThemeId === theme.id ? 'bg-white border-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <h4 className="font-black text-xs uppercase tracking-tight leading-none mb-1">{theme.title}</h4>
            </div>
          ))}
        </div>

        <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePost?.versions.map((version, vIdx) => {
            const isEditing = editingVersionId === version.id;
            return (
              <div key={version.id} className={`bg-white border-2 flex flex-col shadow-sm transition-all group relative ${version.isApproved ? 'border-indigo-600 shadow-indigo-100' : 'border-slate-200'}`}>
                {/* Approval Checkbox */}
                <div className="absolute top-3 left-3 z-30">
                  <button 
                    onClick={() => updateVersion(version.id, { isApproved: !version.isApproved })}
                    className={`p-1 transition-colors ${version.isApproved ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'}`}
                  >
                    {version.isApproved ? <CheckSquare size={24} /> : <Square size={24} />}
                  </button>
                </div>

                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  <img 
                    src={version.imageUrl} 
                    alt="Preview" 
                    className={`w-full h-full object-cover transition-all duration-700 ${version.isApproved ? 'grayscale-0' : 'grayscale'}`}
                  />
                  
                  {isGeneratingImg === version.id && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 size={32} className="text-white animate-spin" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 z-20 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isEditing && (
                      <button 
                        onClick={() => handleRegenerateImage(version)}
                        disabled={!!isGeneratingImg}
                        className="bg-indigo-600 text-white p-2 border border-indigo-700 hover:bg-indigo-700 shadow-lg flex items-center space-x-1"
                      >
                        {isGeneratingImg === version.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      </button>
                    )}
                    <button 
                      onClick={() => setEditingVersionId(isEditing ? null : version.id)}
                      className="bg-white text-slate-600 p-2 border border-slate-200 hover:bg-slate-50 shadow-lg"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                     <span className="text-white text-[10px] font-black uppercase tracking-widest italic">{version.label}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col space-y-3">
                   {isEditing ? (
                     <textarea 
                        className="flex-1 w-full text-[10px] font-mono border border-slate-200 bg-slate-50 p-2 leading-relaxed outline-none focus:border-indigo-600 h-32"
                        value={version.content}
                        onChange={(e) => updateVersion(version.id, { content: e.target.value })}
                     />
                   ) : (
                     <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-4 h-[4.5rem]">
                        "{version.content}"
                     </p>
                   )}
                   
                   {isEditing && (
                     <div className="pt-2 border-t border-slate-100">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Visual Prompt</label>
                        <input 
                          className="w-full text-[9px] font-mono bg-slate-50 border border-slate-100 px-2 py-1 outline-none focus:border-indigo-600"
                          value={version.imageDescription}
                          onChange={(e) => updateVersion(version.id, { imageDescription: e.target.value })}
                        />
                     </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewStage;
