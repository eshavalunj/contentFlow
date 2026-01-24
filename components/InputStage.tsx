
import React, { useState } from 'react';
import { Upload, Link as LinkIcon, FileText, ArrowRight, CheckSquare, Square, Plus, Trash2 } from 'lucide-react';
import { Platform } from '../types';

interface InputStageProps {
  onNext: (source: string, intent: string, name: string, platforms: Platform[]) => void;
}

const InputStage: React.FC<InputStageProps> = ({ onNext }) => {
  const [name, setName] = useState('New Campaign');
  const [text, setText] = useState('');
  const [intent, setIntent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState<string[]>(['']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['Twitter', 'LinkedIn', 'Instagram']);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setText(prev => prev + '\n' + ev.target!.result);
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => setLinks([...links, '']);
  const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index));

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(prev => prev.filter(item => item !== p));
    } else {
      setSelectedPlatforms(prev => [...prev, p]);
    }
  };

  const handleNext = () => {
    if ((!text && !file && links.filter(l => l.trim() !== '').length === 0) || !intent || selectedPlatforms.length === 0) return;
    
    // Combine text and valid links into a source string
    const combinedSource = `${text}\n\nReferenced Links:\n${links.filter(l => l.trim() !== '').join('\n')}`;
    onNext(combinedSource, intent, name, selectedPlatforms);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Init Campaign</h2>
        <p className="text-slate-500 font-mono text-sm">Upload directives. Select output vectors.</p>
      </div>

      <div className="bg-white p-8 border border-slate-200 shadow-sm space-y-8">
        
        {/* Campaign Name */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Identifier</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-slate-300 focus:border-indigo-600 focus:ring-0 outline-none transition-all bg-slate-50 font-medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Q3 RESEARCH LAUNCH"
          />
        </div>

        {/* Source Material */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Source Data</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors ${file ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>
              <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} accept=".txt,.md,.csv" />
              <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
                 <Upload className={`mb-3 ${file ? 'text-indigo-600' : 'text-slate-400'}`} size={28} />
                 <span className="text-sm font-bold text-slate-700 uppercase">{file ? file.name : "Upload Document"}</span>
                 <span className="text-xs text-slate-400 mt-2 font-mono">TXT, MD (Max 5MB)</span>
              </label>
            </div>
            
            <div className="border border-slate-300 p-6 bg-slate-50 space-y-3">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center space-x-2 text-slate-700">
                    <LinkIcon size={18} />
                    <span className="text-sm font-bold uppercase tracking-tight">Source Links</span>
                 </div>
                 <button onClick={addLink} className="p-1 text-indigo-600 hover:bg-indigo-50">
                    <Plus size={18} />
                 </button>
               </div>
               
               <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                 {links.map((link, idx) => (
                   <div key={idx} className="flex space-x-2">
                     <input 
                       type="url" 
                       placeholder="https://..." 
                       value={link}
                       onChange={(e) => handleLinkChange(idx, e.target.value)}
                       className="flex-1 text-xs p-2 bg-white border border-slate-200 focus:border-indigo-600 outline-none"
                     />
                     {links.length > 1 && (
                       <button onClick={() => removeLink(idx)} className="p-2 text-slate-400 hover:text-red-500">
                         <Trash2 size={14} />
                       </button>
                     )}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute top-3 left-3 text-slate-400">
               <FileText size={18} />
             </div>
             <textarea
               className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:border-indigo-600 focus:ring-0 outline-none min-h-[120px] resize-y bg-slate-50 text-sm font-mono"
               placeholder="Paste raw content buffer..."
               value={text}
               onChange={(e) => setText(e.target.value)}
             ></textarea>
          </div>
        </div>

        {/* Intent */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Intent</label>
          <textarea
            className="w-full px-4 py-3 border border-slate-300 focus:border-indigo-600 focus:ring-0 outline-none min-h-[80px] bg-slate-50"
            placeholder="Describe the objective. Tone. Key takeaways."
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
          ></textarea>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Target Channels</label>
          <div className="flex flex-wrap gap-4">
             {(['Twitter', 'LinkedIn', 'Instagram'] as Platform[]).map(platform => (
               <button
                 key={platform}
                 onClick={() => togglePlatform(platform)}
                 className={`flex items-center space-x-3 px-6 py-3 border transition-all ${selectedPlatforms.includes(platform) ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
               >
                 {selectedPlatforms.includes(platform) ? <CheckSquare size={18} /> : <Square size={18} />}
                 <span className="text-sm font-bold uppercase">{platform}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end border-t border-slate-100">
          <button
            onClick={handleNext}
            disabled={(!intent || (!text && !file && links.filter(l => l.trim() !== '').length === 0)) || selectedPlatforms.length === 0}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <span>Initialize Generation</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputStage;
